const fs = require('fs');
const path = require('path');

function generateReports(repoPath, commits, driftEvents) {
  const outDir = path.join(repoPath, '.status-intel', 'reports');
  fs.mkdirSync(outDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const mdPath = path.join(outDir, `status-report-${stamp}.md`);
  const htmlPath = path.join(outDir, `status-report-${stamp}.html`);

  const md = renderMarkdown(commits, driftEvents);
  const html = renderHtml(commits, driftEvents);

  fs.writeFileSync(mdPath, md, 'utf8');
  fs.writeFileSync(htmlPath, html, 'utf8');

  return { mdPath, htmlPath };
}

function renderMarkdown(commits, driftEvents) {
  const { total, highCount, mediumCount, lowCount } = summarize(commits);
  const lines = [];
  lines.push(`# STATUS Intel Report`);
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('');
  lines.push(`- Commits analyzed: ${total}`);
  lines.push(`- High risk: ${highCount}, Medium: ${mediumCount}, Low: ${lowCount}`);
  lines.push('');
  lines.push(`## Commits`);
  lines.push(`| Commit | Status | Files | Churn (+/-) | Risk | Rationale |`);
  lines.push(`| --- | --- | ---: | ---: | --- | --- |`);
  for (const c of commits) {
    const rationales = safeParseRationale(c.rationale).join('; ');
    lines.push(
      `| ${c.hash.slice(0, 7)} | ${c.status_code || '---'} | ${c.files_changed} | +${c.insertions}/-${c.deletions} | ${c.score} ${c.level} | ${rationales} |`
    );
  }
  if (driftEvents && driftEvents.length) {
    lines.push('');
    lines.push('## Architecture Drift');
    for (const d of driftEvents) {
      lines.push(
        `- Drift ${d.id}: edges ${formatDelta(d.edge_delta)}, cycles ${formatDelta(d.cycle_delta)} (${formatSince(
          d.created_at
        )})`
      );
    }
  }
  return lines.join('\n');
}

function renderHtml(commits, driftEvents) {
  const { total, highCount, mediumCount, lowCount } = summarize(commits);
  const rows = commits
    .map((c) => {
      const rationales = safeParseRationale(c.rationale).join('; ');
      return `<tr class="risk-${c.level.toLowerCase()}">
        <td>${escape(c.hash.slice(0, 7))}</td>
        <td>${escape(c.status_code || '---')}</td>
        <td class="num">${c.files_changed}</td>
        <td class="num">+${c.insertions}/-${c.deletions}</td>
        <td class="num">${c.score} ${escape(c.level)}</td>
        <td>${escape(rationales)}</td>
      </tr>`;
    })
    .join('\n');

  const driftList =
    driftEvents && driftEvents.length
      ? driftEvents
          .map(
            (d) =>
              `<li>Drift ${d.id}: edges ${formatDelta(d.edge_delta)}, cycles ${formatDelta(
                d.cycle_delta
              )} (${formatSince(d.created_at)})</li>`
          )
          .join('\n')
      : '<li>No drift events recorded.</li>';

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>STATUS Intel Report</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; color: #111; background: #f7f7f9; }
    h1, h2 { margin: 0 0 12px 0; }
    .summary { margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; background: #fff; }
    th, td { border: 1px solid #ddd; padding: 8px; font-size: 14px; }
    th { background: #f0f0f3; text-align: left; }
    td.num { text-align: right; }
    tr:nth-child(even) { background: #fafafa; }
    .risk-high { background: #ffe8e6; }
    .risk-medium { background: #fff7e0; }
    .risk-low { background: #e8f6ef; }
    .muted { color: #666; font-size: 13px; }
  </style>
</head>
<body>
  <h1>STATUS Intel Report</h1>
  <div class="muted">Generated ${escape(new Date().toISOString())}</div>
  <div class="summary">
    <strong>Commits:</strong> ${total} &nbsp; | &nbsp;
    <strong>High:</strong> ${highCount} &nbsp; | &nbsp;
    <strong>Medium:</strong> ${mediumCount} &nbsp; | &nbsp;
    <strong>Low:</strong> ${lowCount}
  </div>
  <h2>Commits</h2>
  <table>
    <thead>
      <tr>
        <th>Commit</th><th>Status</th><th>Files</th><th>Churn</th><th>Risk</th><th>Rationale</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>
  <h2>Architecture Drift</h2>
  <ul>
    ${driftList}
  </ul>
</body>
</html>`;
}

function summarize(commits) {
  let highCount = 0;
  let mediumCount = 0;
  let lowCount = 0;
  for (const c of commits) {
    const level = (c.level || '').toUpperCase();
    if (level === 'HIGH') highCount++;
    else if (level === 'MEDIUM') mediumCount++;
    else lowCount++;
  }
  return { total: commits.length, highCount, mediumCount, lowCount };
}

function safeParseRationale(raw) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function formatDelta(n) {
  if (n === 0) return 'no change';
  return n > 0 ? `+${n}` : `${n}`;
}

function formatSince(epochMs) {
  const delta = Date.now() - Number(epochMs);
  if (!Number.isFinite(delta) || delta < 0) return 'just now';
  const minutes = Math.floor(delta / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function escape(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

module.exports = { generateReports };
