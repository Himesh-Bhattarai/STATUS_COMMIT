import simpleGit from 'simple-git';
import fs from 'fs';
import path from 'path';
import initSqlJs from 'sql.js';
import { defaultCriticalPaths, repoRoot, dbPath } from './utils.js';

const sqlPromise = initSqlJs();

export async function scan({ limit = 200, root = repoRoot(), config = {} }) {
  const git = simpleGit(root);
  const log = await git.log({ maxCount: limit });
  const dbFile = dbPath(root);
  const { db, SQL } = await openDb(dbFile);
  ensureSchema(db);

  const criticalPaths = defaultCriticalPaths(config);
  const scanned = [];

  const insertCommit = db.prepare(
    `INSERT OR IGNORE INTO commits(hash, message, author, date, status_code) VALUES (?, ?, ?, ?, ?)`
  );
  const insertStats = db.prepare(
    `INSERT OR REPLACE INTO stats(hash, files_changed, insertions, deletions, tests_changed, critical_hits)
     VALUES (?, ?, ?, ?, ?, ?)`
  );
  const insertRisk = db.prepare(
    `INSERT OR REPLACE INTO risk(hash, score, level, rationale) VALUES (?, ?, ?, ?)`
  );
  const insertFile = db.prepare(
    `INSERT OR REPLACE INTO commit_files(hash, file_path, insertions, deletions, is_test, is_critical)
     VALUES (?, ?, ?, ?, ?, ?)`
  );

  for (const commit of log.all) {
    if (hasCommit(db, commit.hash)) continue;

    const statusCode = parseStatus(commit.message);
    const numstat = await git.raw(['show', '--numstat', '--format=', commit.hash]);
    const { summary, files } = parseNumstat(numstat, criticalPaths);
    const risk = score(summary, statusCode);

    insertCommit.run([commit.hash, commit.message, commit.author_name, Date.parse(commit.date), statusCode]);
    insertStats.run([
      commit.hash,
      summary.filesChanged,
      summary.insertions,
      summary.deletions,
      summary.testsChanged ? 1 : 0,
      summary.criticalHits
    ]);
    insertRisk.run([commit.hash, risk.score, risk.level, JSON.stringify(risk.rationale)]);

    db.exec('BEGIN TRANSACTION');
    for (const f of files) {
      insertFile.run([commit.hash, f.file_path, f.insertions, f.deletions, f.is_test, f.is_critical]);
    }
    db.exec('COMMIT');

    scanned.push({ hash: commit.hash, statusCode, summary, risk });
  }

  insertCommit.free();
  insertStats.free();
  insertRisk.free();
  insertFile.free();

  persistDb(db, dbFile);
  db.close();
  return { scanned, dbFile };
}

export async function recent(dbFile, limit = 50) {
  const { db, SQL } = await openDb(dbFile);
  ensureSchema(db);

  const commits = [];
  const commitStmt = db.prepare(
    `SELECT c.hash, c.message, c.author, c.date, c.status_code,
            s.files_changed, s.insertions, s.deletions, s.tests_changed, s.critical_hits,
            r.score, r.level, r.rationale
     FROM commits c
     JOIN stats s ON c.hash = s.hash
     JOIN risk r ON c.hash = r.hash
     ORDER BY c.date DESC
     LIMIT ?`
  );
  commitStmt.bind([limit]);
  while (commitStmt.step()) {
    commits.push(commitStmt.getAsObject());
  }
  commitStmt.free();

  const files = [];
  const fileStmt = db.prepare(
    `SELECT cf.hash, cf.file_path, cf.insertions, cf.deletions, cf.is_test, cf.is_critical,
            r.score, r.level, c.date
     FROM commit_files cf
     JOIN risk r ON r.hash = cf.hash
     JOIN commits c ON c.hash = cf.hash`
  );
  while (fileStmt.step()) {
    files.push(fileStmt.getAsObject());
  }
  fileStmt.free();

  // read-only: no need to persist
  db.close();
  return { commits, files };
}

async function openDb(dbFile) {
  const SQL = await sqlPromise;
  fs.mkdirSync(path.dirname(dbFile), { recursive: true });
  let db;
  if (fs.existsSync(dbFile)) {
    const fileBuffer = fs.readFileSync(dbFile);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }
  return { db, SQL };
}

function ensureSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS commits (
      hash TEXT PRIMARY KEY,
      message TEXT,
      author TEXT,
      date INTEGER,
      status_code INTEGER
    );
    CREATE TABLE IF NOT EXISTS stats (
      hash TEXT PRIMARY KEY,
      files_changed INTEGER,
      insertions INTEGER,
      deletions INTEGER,
      tests_changed INTEGER,
      critical_hits INTEGER
    );
    CREATE TABLE IF NOT EXISTS risk (
      hash TEXT PRIMARY KEY,
      score INTEGER,
      level TEXT,
      rationale TEXT
    );
    CREATE TABLE IF NOT EXISTS commit_files (
      hash TEXT,
      file_path TEXT,
      insertions INTEGER,
      deletions INTEGER,
      is_test INTEGER,
      is_critical INTEGER,
      PRIMARY KEY (hash, file_path)
    );
  `);
}

function parseStatus(message) {
  const match = message && message.match(/status\((\d{3}|infinity)\)/i);
  return match ? (match[1].toLowerCase() === 'infinity' ? 999 : parseInt(match[1], 10)) : null;
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
    const isCritical = isCriticalFile(filePath, criticalPaths);
    if (isTest) testsChanged = true;
    if (isCritical) criticalHits += 1;
    files.push({
      file_path: filePath,
      insertions: added,
      deletions: removed,
      is_test: isTest ? 1 : 0,
      is_critical: isCritical ? 1 : 0
    });
  }
  return { summary: { filesChanged, insertions, deletions, testsChanged, criticalHits }, files };
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

function isCriticalFile(filePath, criticalPaths) {
  const normalized = filePath.replace(/\\/g, '/');
  return criticalPaths.some((seg) => normalized.startsWith(`${seg}/`) || normalized.includes(`/${seg}/`));
}

function score(summary, statusCode) {
  const rationale = [];
  let s = 2;
  if (statusCode) {
    const band = Math.floor(statusCode / 100);
    if (band === 6) {
      s += 3;
      rationale.push('Bugfix/status 6xx');
    } else if (band === 5) {
      s += 2;
      rationale.push('Hotfix/status 5xx');
    } else if (band === 3) {
      s += 1;
      rationale.push('Refactor/status 3xx');
    } else {
      rationale.push('Neutral status code');
    }
  } else rationale.push('No status code found');

  const churn = summary.insertions + summary.deletions;
  if (churn > 500) {
    s += 2;
    rationale.push('Heavy churn >500 LOC');
  } else if (churn > 200) {
    s += 1;
    rationale.push('Moderate churn >200 LOC');
  }

  if (summary.filesChanged > 15) {
    s += 2;
    rationale.push('Touches many files');
  } else if (summary.filesChanged > 8) {
    s += 1;
    rationale.push('Touches several files');
  }

  if (summary.criticalHits > 0) {
    s += 2;
    rationale.push('Critical paths touched');
  }
  if (!summary.testsChanged && summary.criticalHits > 0) {
    s += 1;
    rationale.push('Critical changes without tests');
  } else if (!summary.testsChanged) rationale.push('No tests touched');

  s = Math.max(1, Math.min(10, s));
  const level = s >= 7 ? 'HIGH' : s >= 4 ? 'MEDIUM' : 'LOW';
  return { score: s, level, rationale };
}

function hasCommit(db, hash) {
  const stmt = db.prepare('SELECT 1 FROM commits WHERE hash = ?');
  stmt.bind([hash]);
  const exists = stmt.step();
  stmt.free();
  return exists;
}

function persistDb(db, dbFile) {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbFile, buffer);
}
