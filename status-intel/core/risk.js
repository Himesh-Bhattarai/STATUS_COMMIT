function scoreCommit(features) {
  const rationale = [];
  let score = 2; // starting noise floor

  if (features.statusCode) {
    const band = Math.floor(features.statusCode / 100);
    if (band === 6) {
      score += 3;
      rationale.push('Bugfix/status 6xx');
    } else if (band === 5) {
      score += 2;
      rationale.push('Hotfix/status 5xx');
    } else if (band === 3) {
      score += 1;
      rationale.push('Refactor/status 3xx');
    } else {
      rationale.push('Neutral status code');
    }
  } else {
    rationale.push('No status code found');
  }

  const churn = (features.insertions || 0) + (features.deletions || 0);
  if (churn > 500) {
    score += 2;
    rationale.push('Heavy churn >500 LOC');
  } else if (churn > 200) {
    score += 1;
    rationale.push('Moderate churn >200 LOC');
  }

  if (features.filesChanged > 15) {
    score += 2;
    rationale.push('Touches many files');
  } else if (features.filesChanged > 8) {
    score += 1;
    rationale.push('Touches several files');
  }

  if (features.criticalHits > 0) {
    score += 2;
    rationale.push('Critical paths touched');
  }

  if (!features.testsChanged && features.criticalHits > 0) {
    score += 1;
    rationale.push('Critical changes without tests');
  } else if (!features.testsChanged) {
    rationale.push('No tests touched');
  }

  score = Math.max(1, Math.min(10, score));
  const level = score >= 7 ? 'HIGH' : score >= 4 ? 'MEDIUM' : 'LOW';

  return { score, level, rationale };
}

module.exports = { scoreCommit };
