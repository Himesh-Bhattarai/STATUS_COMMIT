const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

function generateDashboard({ repoPath, commits, commitFiles, graph, edges, driftEvents, open = true }) {
  const outDir = path.join(repoPath, '.status-intel', 'reports');
  fs.mkdirSync(outDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const htmlPath = path.join(outDir, `dashboard-${stamp}.html`);

  const payload = {
    commits,
    commitFiles,
    graph,
    edges,
    driftEvents
  };

  const html = render(payload);
  fs.writeFileSync(htmlPath, html, 'utf8');

  if (open) openInBrowser(htmlPath);
  return htmlPath;
}

function render(data) {
  const json = JSON.stringify(data);
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>STATUS Intel Dashboard</title>
  <link rel="stylesheet" href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css">
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; background: #f5f6fa; color: #111; }
    h1 { margin-bottom: 8px; }
    .muted { color: #666; font-size: 13px; }
    #graph { width: 100%; height: 480px; border: 1px solid #ccc; background: #fff; margin: 16px 0; }
    table.dataTable tr.risk-HIGH { background: #ffe6e6; }
    table.dataTable tr.risk-MEDIUM { background: #fff6dd; }
    table.dataTable tr.risk-LOW { background: #e8f6ef; }
    .filter-bar { margin: 10px 0; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 8px; font-size: 12px; }
    .badge.HIGH { background: #e53935; color: #fff; }
    .badge.MEDIUM { background: #f5a623; color: #fff; }
    .badge.LOW { background: #43a047; color: #fff; }
    .panel { background: #fff; padding: 12px; border: 1px solid #ddd; margin-top: 8px; }
  </style>
</head>
<body>
  <h1>STATUS Intel Dashboard</h1>
  <div class="muted">Generated ${new Date().toISOString()}</div>

  <div class="panel">
    <strong>Drift summary:</strong>
    <div id="drift-summary">Loading…</div>
  </div>

  <div class="panel">
    <div class="filter-bar">
      Filter by status:
      <input type="text" id="statusFilter" placeholder="e.g. 301">
      &nbsp; Filter by risk:
      <select id="riskFilter">
        <option value="">All</option>
        <option value="HIGH">HIGH</option>
        <option value="MEDIUM">MEDIUM</option>
        <option value="LOW">LOW</option>
      </select>
      &nbsp; <button id="clearFilters">Clear</button>
    </div>
    <table id="commitTable" class="display" style="width:100%">
      <thead>
        <tr>
          <th>Commit</th>
          <th>Author</th>
          <th>Date</th>
          <th>Status</th>
          <th>Files</th>
          <th>Churn</th>
          <th>Risk</th>
          <th>Message</th>
          <th>Rationale</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>

  <h2>Dependency Graph</h2>
  <div id="graph"></div>
  <div class="muted">Click a node to filter commits that touched the file; double-click to reset.</div>

  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
  <script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
  <script src="https://unpkg.com/cytoscape@3.26.0/dist/cytoscape.min.js"></script>
  <script>
    const DATA = ${json};

    const fileCommits = buildFileCommitMap(DATA.commitFiles);
    const fileRisk = buildFileRisk(DATA.commitFiles);

    const table = $('#commitTable').DataTable({
      data: DATA.commits.map(row => {
        const rationale = safeParse(row.rationale).join('; ');
        return {
          hash: row.hash,
          shortHash: row.hash.slice(0,7),
          author: row.author || '',
          date: formatDate(row.date),
          status: row.status_code || '---',
          files: row.files_changed,
          churn: '+' + row.insertions + '/-' + row.deletions,
          risk: row.score + ' ' + row.level,
          level: row.level || 'LOW',
          message: row.message || '',
          rationale
        };
      }),
      columns: [
        { data: 'shortHash',
          render: (d, t, row) => '<code>' + d + '</code>' },
        { data: 'author' },
        { data: 'date' },
        { data: 'status' },
        { data: 'files' },
        { data: 'churn' },
        { data: 'risk',
          render: (d, t, row) => '<span class="badge ' + row.level + '">' + d + '</span>' },
        { data: 'message',
          render: (d) => '<span title="' + escapeHtml(d) + '">' + escapeHtml(truncate(d, 80)) + '</span>' },
        { data: 'rationale' }
      ],
      createdRow: function(row, data) {
        $(row).addClass('risk-' + data.level);
      },
      order: [[2, 'desc']]
    });

    $('#statusFilter').on('keyup change', function() {
      table.column(3).search(this.value).draw();
    });
    $('#riskFilter').on('change', function() {
      table.column(6).search(this.value, true, false).draw();
    });
    $('#clearFilters').on('click', function() {
      $('#statusFilter').val('');
      $('#riskFilter').val('');
      table.search('').columns().search('').draw();
    });

    buildDriftSummary(DATA.driftEvents, DATA.graph);
    buildGraph(DATA.edges, fileRisk, fileCommits, table);

    function buildGraph(edges, fileRisk, fileCommits, table) {
      if (!edges || !edges.length) {
        document.getElementById('graph').innerHTML = 'No graph data yet.';
        return;
      }
      const nodesMap = {};
      edges.forEach(e => {
        nodesMap[e.source] = true;
        nodesMap[e.target] = true;
      });
      const elements = [];
      Object.keys(nodesMap).forEach(id => {
        const risk = fileRisk[id] || { level: 'NONE' };
        elements.push({ data: { id, label: id, risk: risk.level } });
      });
      edges.forEach(e => elements.push({ data: { id: e.source + '->' + e.target, source: e.source, target: e.target } }));

      const cy = cytoscape({
        container: document.getElementById('graph'),
        elements,
        style: [
          { selector: 'node', style: {
            'label': 'data(label)',
            'font-size': 10,
            'background-color': ele => riskColor(ele.data('risk')),
            'color': '#111',
            'text-valign': 'center',
            'text-halign': 'center'
          }},
          { selector: 'edge', style: {
            'width': 1,
            'line-color': '#999',
            'target-arrow-shape': 'triangle',
            'target-arrow-color': '#999',
            'curve-style': 'bezier'
          }},
          { selector: 'node:selected', style: {
            'border-width': 3,
            'border-color': '#0d47a1'
          }},
          { selector: 'edge:selected', style: {
            'line-color': '#0d47a1',
            'target-arrow-color': '#0d47a1',
            'width': 2
          }}
        ],
        layout: { name: 'cose', animate: false }
      });

      cy.on('tap', 'node', function(evt) {
        const id = evt.target.id();
        highlightCommitsForFile(id, fileCommits, table);
      });
      cy.on('tap', function(evt) {
        if (evt.target === cy) {
          table.search('').columns().search('').draw();
        }
      });
    }

    function highlightCommitsForFile(filePath, fileCommits, table) {
      const commits = fileCommits[filePath] || [];
      if (!commits.length) return;
      const pattern = commits.map(h => h.slice(0,7)).join('|');
      table.column(0).search(pattern, true, false).draw();
    }

    function buildFileCommitMap(commitFiles) {
      const map = {};
      for (const row of commitFiles) {
        if (!map[row.file_path]) map[row.file_path] = [];
        map[row.file_path].push(row.hash);
      }
      return map;
    }

    function buildFileRisk(commitFiles) {
      const sorted = [...commitFiles].sort((a, b) => Number(b.date || 0) - Number(a.date || 0));
      const out = {};
      for (const row of sorted) {
        if (!out[row.file_path]) {
          out[row.file_path] = { level: row.level, score: row.score };
        }
      }
      return out;
    }

    function buildDriftSummary(events, graph) {
      const el = document.getElementById('drift-summary');
      if (!events || !events.length) {
        el.textContent = 'No drift events recorded yet.';
        return;
      }
      const latest = events[0];
      const cycles = graph && graph.cycles !== undefined ? graph.cycles : 'n/a';
      el.innerHTML = 'Latest: cycles ' + cycles + ', edge delta ' + formatDelta(latest.edge_delta) + ', cycle delta ' + formatDelta(latest.cycle_delta);
    }

    function riskColor(level) {
      if (level === 'HIGH') return '#e53935';
      if (level === 'MEDIUM') return '#f5a623';
      if (level === 'LOW') return '#43a047';
      return '#9e9e9e';
    }

    function formatDelta(n) {
      if (n === 0) return 'no change';
      return n > 0 ? '+' + n : String(n);
    }
    function safeParse(raw) {
      try {
        const p = JSON.parse(raw);
        return Array.isArray(p) ? p : [];
      } catch(e) { return []; }
    }
    function formatDate(epoch) {
      if (!epoch) return '';
      const d = new Date(Number(epoch));
      return d.toISOString().slice(0,10);
    }
    function truncate(str, n) {
      if (!str) return '';
      return str.length > n ? str.slice(0, n - 1) + '…' : str;
    }
    function escapeHtml(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }
  </script>
</body>
</html>`;
}

function openInBrowser(filePath) {
  const platform = process.platform;
  let cmd;
  let args;
  if (platform === 'win32') {
    cmd = 'cmd';
    args = ['/c', 'start', '""', filePath];
  } else if (platform === 'darwin') {
    cmd = 'open';
    args = [filePath];
  } else {
    cmd = 'xdg-open';
    args = [filePath];
  }
  spawn(cmd, args, { stdio: 'ignore', detached: true }).unref();
}

module.exports = { generateDashboard };
