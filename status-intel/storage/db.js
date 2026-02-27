const path = require('path');
const Database = require('better-sqlite3');

let db;

function init(dbDir = process.cwd()) {
  const dbPath = path.join(dbDir, '.status-intel.db');
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS commits (
      hash TEXT PRIMARY KEY,
      message TEXT,
      author TEXT,
      date INTEGER,
      status_code INTEGER
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
    CREATE TABLE IF NOT EXISTS graphs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      commit_hash TEXT,
      edge_count INTEGER,
      cycles INTEGER,
      created_at INTEGER
    );
    CREATE TABLE IF NOT EXISTS graph_edges (
      graph_id INTEGER,
      source TEXT,
      target TEXT
    );
    CREATE TABLE IF NOT EXISTS drift_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      base_graph_id INTEGER,
      new_graph_id INTEGER,
      edge_delta INTEGER,
      cycle_delta INTEGER,
      created_at INTEGER
    );
  `);
  return dbPath;
}

function hasCommit(hash) {
  const row = db.prepare('SELECT 1 FROM commits WHERE hash = ?').get(hash);
  return Boolean(row);
}

function saveCommit(commit) {
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO commits(hash, message, author, date, status_code)
    VALUES (@hash, @message, @author, @date, @status_code)
  `);
  stmt.run(commit);
}

function saveStats(stats) {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO stats(hash, files_changed, insertions, deletions, tests_changed, critical_hits)
    VALUES (@hash, @files_changed, @insertions, @deletions, @tests_changed, @critical_hits)
  `);
  stmt.run(stats);
}

function saveCommitFiles(files = []) {
  if (!files.length) return;
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO commit_files(hash, file_path, insertions, deletions, is_test, is_critical)
    VALUES (@hash, @file_path, @insertions, @deletions, @is_test, @is_critical)
  `);
  const insert = db.transaction((rows) => {
    for (const row of rows) stmt.run(row);
  });
  insert(files);
}

function saveRisk(risk) {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO risk(hash, score, level, rationale)
    VALUES (@hash, @score, @level, @rationale)
  `);
  stmt.run(risk);
}

function fetchRecent(limit = 20) {
  return db
    .prepare(
      `SELECT c.hash, c.message, c.author, c.date, c.status_code,
              s.files_changed, s.insertions, s.deletions, s.tests_changed, s.critical_hits,
              r.score, r.level, r.rationale
       FROM commits c
       JOIN stats s ON c.hash = s.hash
       JOIN risk r ON c.hash = r.hash
       ORDER BY c.date DESC
       LIMIT ?`
    )
    .all(limit);
}

function breakdownByStatus() {
  return db
    .prepare(
      `SELECT status_code, COUNT(*) as count
       FROM commits
       WHERE status_code IS NOT NULL
       GROUP BY status_code
       ORDER BY count DESC`
    )
    .all();
}

function saveGraphSnapshot({ commitHash, edgeCount, cycles }) {
  const stmt = db.prepare(`
    INSERT INTO graphs(commit_hash, edge_count, cycles, created_at)
    VALUES (?, ?, ?, ?)
  `);
  const info = stmt.run(commitHash, edgeCount, cycles, Date.now());
  return info.lastInsertRowid;
}

function saveGraphEdges(graphId, edges = []) {
  if (!edges.length) return;
  const stmt = db.prepare(`INSERT INTO graph_edges(graph_id, source, target) VALUES (?, ?, ?)`);
  const insert = db.transaction((rows) => {
    for (const edge of rows) stmt.run(graphId, edge.source, edge.target);
  });
  insert(edges);
}

function fetchLastGraph() {
  return db
    .prepare(
      `SELECT id, commit_hash, edge_count, cycles, created_at
       FROM graphs
       ORDER BY created_at DESC
       LIMIT 1`
    )
    .get();
}

function saveDriftEvent({ baseGraphId, newGraphId, edgeDelta, cycleDelta }) {
  db.prepare(
    `INSERT INTO drift_events(base_graph_id, new_graph_id, edge_delta, cycle_delta, created_at)
     VALUES (?, ?, ?, ?, ?)`
  ).run(baseGraphId, newGraphId, edgeDelta, cycleDelta, Date.now());
}

function fetchRecentDrift(limit = 5) {
  return db
    .prepare(
      `SELECT id, base_graph_id, new_graph_id, edge_delta, cycle_delta, created_at
       FROM drift_events
       ORDER BY created_at DESC
       LIMIT ?`
    )
    .all(limit);
}

function fetchCommitFiles() {
  return db
    .prepare(
      `SELECT cf.hash, cf.file_path, cf.insertions, cf.deletions, cf.is_test, cf.is_critical,
              c.date, r.score, r.level
       FROM commit_files cf
       JOIN commits c ON c.hash = cf.hash
       JOIN risk r ON r.hash = cf.hash`
    )
    .all();
}

function fetchLatestGraphEdges() {
  const latest = fetchLastGraph();
  if (!latest) return { graph: null, edges: [] };
  const edges = db
    .prepare(`SELECT source, target FROM graph_edges WHERE graph_id = ?`)
    .all(latest.id);
  return { graph: latest, edges };
}

function close() {
  if (db) db.close();
}

module.exports = {
  init,
  hasCommit,
  saveCommit,
  saveCommitFiles,
  saveStats,
  saveRisk,
  fetchRecent,
  breakdownByStatus,
  fetchCommitFiles,
  saveGraphSnapshot,
  saveGraphEdges,
  fetchLastGraph,
  fetchLatestGraphEdges,
  saveDriftEvent,
  fetchRecentDrift,
  close
};
