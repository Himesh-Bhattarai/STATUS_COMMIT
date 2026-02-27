#!/usr/bin/env node
const db = require('./storage/db');
const { scanCommits } = require('./core/analyzer');
const { printRecent, printBreakdown, printDrift } = require('./reports/console');
const loadConfig = require('./config');
const simpleGit = require('simple-git');
const { buildGraphSnapshot } = require('./core/graph');
const { generateReports } = require('./reports/generator');
const { generateDashboard } = require('./reports/dashboard');

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const repoPath = process.cwd();
  const config = loadConfig(repoPath);

  const dbPath = db.init(repoPath);

  if (command === 'scan') {
    const limitArg = parseInt(args[1], 10);
    const limit = Number.isFinite(limitArg) ? limitArg : 25;
    const results = await scanCommits({ repoPath, limit, criticalPaths: config.criticalPaths });
    console.log(`Scanned ${results.length} new commits (limit ${limit}). DB: ${dbPath}`);

    if (config.graph && config.graph.enabled) {
      try {
        const git = simpleGit(repoPath);
        const headHash = await git.revparse(['HEAD']);
        const snapshot = await buildGraphSnapshot({ repoPath, graphConfig: config.graph });
        const prev = db.fetchLastGraph();
        const newId = db.saveGraphSnapshot({
          commitHash: headHash,
          edgeCount: snapshot.edgeCount,
          cycles: snapshot.cycles
        });
        db.saveGraphEdges(newId, snapshot.edges);
        if (prev) {
          const edgeDelta = snapshot.edgeCount - prev.edge_count;
          const cycleDelta = snapshot.cycles - prev.cycles;
          db.saveDriftEvent({
            baseGraphId: prev.id,
            newGraphId: newId,
            edgeDelta,
            cycleDelta
          });
          console.log(
            `Graph snapshot: edges ${snapshot.edgeCount} (${formatDelta(edgeDelta)}), cycles ${snapshot.cycles} (${formatDelta(
              cycleDelta
            )})`
          );
        } else {
          console.log(`Graph snapshot stored: edges ${snapshot.edgeCount}, cycles ${snapshot.cycles}`);
        }
      } catch (err) {
        console.warn('Graph analysis skipped:', err.message);
      }
    }
  } else if (command === 'check') {
    const limitArg = parseInt(args[1], 10);
    const limit = Number.isFinite(limitArg) ? limitArg : 25;
    const results = await scanCommits({ repoPath, limit, criticalPaths: config.criticalPaths });
    console.log(`Scanned ${results.length} new commits for check (limit ${limit}).`);
    const recent = db.fetchRecent(limit);
    const failures = evaluateThresholds(recent, config.thresholds);
    if (failures.length) {
      console.error('Check failed on commits:');
      failures.forEach((f) =>
        console.error(
          `  ${f.hash.slice(0, 7)} score ${f.score} level ${f.level} (threshold score>${config.thresholds.maxScore} or level>=${config.thresholds.riskLevel})`
        )
      );
      db.close();
      process.exit(1);
    } else {
      console.log('Check passed: no commits exceeded risk thresholds.');
    }
  } else if (command === 'report') {
    const limitArg = parseInt(args[1], 10);
    const limit = Number.isFinite(limitArg) ? limitArg : 20;
    const commits = db.fetchRecent(limit);
    const drift = db.fetchRecentDrift(3);
    printRecent(commits);
    printBreakdown(db.breakdownByStatus());
    printDrift(drift);
    const { mdPath, htmlPath } = generateReports(repoPath, commits, drift);
    console.log(`\nReports saved:\n  - ${mdPath}\n  - ${htmlPath}`);
  } else if (command === 'dashboard') {
    const limitArg = parseInt(args[1], 10);
    const limit = Number.isFinite(limitArg) ? limitArg : config.dashboard.commitLimit;
    const commits = db.fetchRecent(limit);
    const drift = db.fetchRecentDrift(5);
    const commitFiles = db.fetchCommitFiles();
    const { graph, edges } = db.fetchLatestGraphEdges();
    const pathOut = generateDashboard({
      repoPath,
      commits,
      commitFiles,
      graph,
      edges,
      driftEvents: drift,
      open: true
    });
    console.log(`Dashboard written to ${pathOut} (auto-opened).`);
  } else if (command === 'init') {
    console.log(`Initialized database at ${dbPath}`);
  } else {
    console.log('Usage: status-intel <scan [limit]|report [limit]|check [limit]|dashboard [limit]|init>');
  }

  db.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

function formatDelta(n) {
  if (n === 0) return 'no change';
  return n > 0 ? `+${n}` : `${n}`;
}

function evaluateThresholds(rows, thresholds) {
  const levelRank = { LOW: 1, MEDIUM: 2, HIGH: 3 };
  const minLevel = thresholds.riskLevel ? levelRank[thresholds.riskLevel.toUpperCase()] || 3 : 3;
  const maxScore = thresholds.maxScore || 10;
  return rows.filter((row) => {
    const level = levelRank[(row.level || '').toUpperCase()] || 1;
    return row.score > maxScore || level >= minLevel;
  });
}
