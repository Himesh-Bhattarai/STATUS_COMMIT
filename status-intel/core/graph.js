const path = require('path');
const madge = require('madge');

async function buildGraphSnapshot({ repoPath, graphConfig }) {
  const entry = graphConfig.entry || 'index.js';
  const entryPath = path.isAbsolute(entry) ? entry : path.join(repoPath, entry);

  let exclude = [];
  if (Array.isArray(graphConfig.exclude)) exclude = graphConfig.exclude;
  else if (typeof graphConfig.exclude === 'string') exclude = [graphConfig.exclude];
  const excludeRegExp =
    exclude.length > 0 ? exclude.map((pattern) => new RegExp(escapeRegex(pattern))) : undefined;

  const res = await madge(entryPath, {
    baseDir: repoPath,
    includeNpm: false,
    fileExtensions: ['js', 'jsx', 'ts', 'tsx'],
    excludeRegExp
  });

  const obj = await res.obj();
  const cycles = res.circular();
  const edges = edgeList(obj);
  return {
    edgeCount: edges.length,
    cycles: cycles.length,
    nodes: Object.keys(obj).length,
    edges
  };
}

function edgeList(graphObj) {
  const edges = [];
  for (const [source, deps] of Object.entries(graphObj)) {
    if (!deps) continue;
    for (const target of deps) {
      edges.push({ source, target });
    }
  }
  return edges;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = { buildGraphSnapshot };
