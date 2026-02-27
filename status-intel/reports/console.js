function printRecent(records = []) {
  if (!records.length) {
    console.log('No commits analyzed yet.');
    return;
  }

  for (const row of records) {
    const since = formatSince(row.date);
    const rationale = safeParseRationale(row.rationale);
    console.log(
      `commit ${row.hash.slice(0, 7)} | status(${row.status_code || '---'}) | files ${row.files_changed} | +${row.insertions}/-${row.deletions} | risk ${row.score} ${row.level} | ${since}`
    );
    if (rationale.length) {
      console.log(`  - ${rationale.join('; ')}`);
    }
  }
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

function printBreakdown(buckets = []) {
  if (!buckets.length) return;
  console.log('\nStatus code mix:');
  for (const bucket of buckets) {
    console.log(`  status(${bucket.status_code}): ${bucket.count} commits`);
  }
}

function printDrift(driftEvents = []) {
  if (!driftEvents.length) return;
  console.log('\nRecent architecture drift:');
  for (const event of driftEvents) {
    const since = formatSince(event.created_at);
    console.log(
      `  drift ${event.id} | edges ${formatDelta(event.edge_delta)} | cycles ${formatDelta(event.cycle_delta)} | ${since}`
    );
  }
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

module.exports = { printRecent, printBreakdown, printDrift };
