import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

export function repoRoot(start = process.cwd()) {
  let current = start;
  while (current && current !== path.parse(current).root) {
    if (fs.existsSync(path.join(current, '.git'))) return current;
    current = path.dirname(current);
  }
  return start;
}

export function dataDir(root = repoRoot()) {
  const dir = path.join(root, '.status-intel');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function dbPath(root = repoRoot()) {
  return path.join(dataDir(root), 'status-commit.db');
}

export function readConfig(root = repoRoot()) {
  const configPath = path.join(root, 'status-intel.config.json');
  if (!fs.existsSync(configPath)) return {};
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (err) {
    console.warn('Could not parse config, using defaults.', err.message);
    return {};
  }
}

export function statusRegex() {
  return /^status\((\d{3}|infinity)\):\s.+/i;
}

export function defaultCriticalPaths(config) {
  return config.criticalPaths || ['auth', 'core', 'api'];
}

export function openFile(htmlPath) {
  const platform = process.platform;
  if (platform === 'win32') {
    spawn('cmd', ['/c', 'start', '""', htmlPath], { detached: true, stdio: 'ignore' }).unref();
  } else if (platform === 'darwin') {
    spawn('open', [htmlPath], { detached: true, stdio: 'ignore' }).unref();
  } else {
    spawn('xdg-open', [htmlPath], { detached: true, stdio: 'ignore' }).unref();
  }
}
