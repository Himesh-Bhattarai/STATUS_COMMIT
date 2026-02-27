const fs = require('fs');
const path = require('path');

const defaultConfig = {
  criticalPaths: ['auth', 'core', 'api'],
  graph: {
    enabled: true,
    entry: 'index.js',
    include: ['.'],
    exclude: ['node_modules', 'dist', 'build']
  },
  thresholds: {
    riskLevel: 'HIGH', // HIGH|MEDIUM|LOW
    maxScore: 9
  },
  dashboard: {
    commitLimit: 50
  }
};

function loadConfig(repoPath = process.cwd()) {
  const userPath = path.join(repoPath, 'status-intel.config.json');
  let userConfig = {};
  if (fs.existsSync(userPath)) {
    try {
      userConfig = JSON.parse(fs.readFileSync(userPath, 'utf8'));
    } catch (err) {
      console.warn(`Could not parse ${userPath}, using defaults.`, err.message);
    }
  }
  return deepMerge(defaultConfig, userConfig);
}

function deepMerge(base, override) {
  if (Array.isArray(base) && Array.isArray(override)) return override;
  if (isObject(base) && isObject(override)) {
    const out = { ...base };
    for (const key of Object.keys(override)) {
      out[key] = deepMerge(base[key], override[key]);
    }
    return out;
  }
  return override === undefined ? base : override;
}

function isObject(val) {
  return val && typeof val === 'object' && !Array.isArray(val);
}

module.exports = loadConfig;
