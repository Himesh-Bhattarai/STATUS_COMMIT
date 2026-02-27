const simpleGit = require('simple-git');
const db = require('../storage/db');
const { scoreCommit } = require('./risk');

async function scanCommits({ repoPath = process.cwd(), limit = 25, criticalPaths = ['auth', 'core', 'api'] }) {
  const git = simpleGit(repoPath);
  const log = await git.log({ maxCount: limit });
  const results = [];

  for (const commit of log.all) {
    if (db.hasCommit(commit.hash)) continue;

    const statusCode = parseStatusCode(commit.message);
    const numstat = await git.raw(['show', '--numstat', '--format=', commit.hash]);
    const { summary, files } = parseNumstat(numstat, criticalPaths, commit.hash);
    const stats = summary;
    const risk = scoreCommit({
      statusCode,
      filesChanged: stats.filesChanged,
      insertions: stats.insertions,
      deletions: stats.deletions,
      testsChanged: stats.testsChanged,
      criticalHits: stats.criticalHits
    });

    db.saveCommit({
      hash: commit.hash,
      message: commit.message,
      author: commit.author_name || '',
      date: Math.floor(new Date(commit.date).getTime()),
      status_code: statusCode
    });

    db.saveStats({
      hash: commit.hash,
      files_changed: stats.filesChanged,
      insertions: stats.insertions,
      deletions: stats.deletions,
      tests_changed: stats.testsChanged ? 1 : 0,
      critical_hits: stats.criticalHits
    });

    db.saveCommitFiles(
      files.map((f) => ({
        hash: commit.hash,
        file_path: f.filePath,
        insertions: f.added,
        deletions: f.removed,
        is_test: f.isTest ? 1 : 0,
        is_critical: f.isCritical ? 1 : 0
      }))
    );

    db.saveRisk({
      hash: commit.hash,
      score: risk.score,
      level: risk.level,
      rationale: JSON.stringify(risk.rationale)
    });

    results.push({
      hash: commit.hash,
      message: commit.message,
      statusCode,
      ...stats,
      risk
    });
  }

  return results;
}

function parseStatusCode(message) {
  const match = message && message.match(/status\((\d{3})\)/i);
  return match ? parseInt(match[1], 10) : null;
}

function parseNumstat(output, criticalPaths) {
  const lines = output.split('\n');
  let filesChanged = 0;
  let insertions = 0;
  let deletions = 0;
  let testsChanged = false;
  let criticalHits = 0;
  const files = [];

  for (const line of lines) {
    if (!line.trim()) continue;
    const match = line.match(/^(\d+|-)\s+(\d+|-)\s+(.*)$/);
    if (!match) continue;

    const added = match[1] === '-' ? 0 : parseInt(match[1], 10);
    const removed = match[2] === '-' ? 0 : parseInt(match[2], 10);
    const filePath = match[3];

    filesChanged += 1;
    insertions += added;
    deletions += removed;
    const isTest = isTestFile(filePath);
    const isCriticalPath = isCritical(filePath, criticalPaths);
    if (isTest) testsChanged = true;
    if (isCriticalPath) criticalHits += 1;
    files.push({
      filePath,
      added,
      removed,
      isTest,
      isCritical: isCriticalPath
    });
  }

  return {
    summary: { filesChanged, insertions, deletions, testsChanged, criticalHits },
    files
  };
}

function isTestFile(filePath) {
  const normalized = filePath.toLowerCase();
  return (
    normalized.includes('__tests__') ||
    normalized.includes('/test/') ||
    normalized.includes('\\test\\') ||
    normalized.endsWith('.spec.js') ||
    normalized.endsWith('.test.js') ||
    normalized.endsWith('.spec.ts') ||
    normalized.endsWith('.test.ts')
  );
}

function isCritical(filePath, criticalPaths) {
  const normalized = filePath.replace(/\\/g, '/');
  return criticalPaths.some((segment) => normalized.startsWith(`${segment}/`) || normalized.includes(`/${segment}/`));
}

module.exports = { scanCommits };
