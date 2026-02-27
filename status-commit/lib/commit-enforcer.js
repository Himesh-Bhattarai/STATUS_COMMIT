import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { statusRegex, repoRoot } from './utils.js';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkgRoot = path.resolve(__dirname, '..');
const templatesRoot = path.join(pkgRoot, 'templates');

export function validateMessage(message) {
  return statusRegex().test(message.trim());
}

function writeFile(target, contents, force = false) {
  if (fs.existsSync(target) && !force) return false;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, contents, 'utf8');
  return true;
}

function copyTemplate(relativePath, dest, force = false) {
  const src = path.join(templatesRoot, relativePath);
  const data = fs.readFileSync(src, 'utf8');
  return writeFile(dest, data, force);
}

export function installHooks(opts = {}, root = repoRoot()) {
  const options = { ci: false, templates: false, force: false, ...opts };
  const gitHooks = path.join(root, '.git', 'hooks');
  if (!fs.existsSync(gitHooks)) {
    throw new Error('No .git/hooks directory found. Run inside a git repo.');
  }

  const commitMsgTarget = path.join(gitHooks, 'commit-msg');
  const prepareTarget = path.join(gitHooks, 'prepare-commit-msg');

  const commitMsgScript = `#!/usr/bin/env node
const fs = require('fs');
const msg = fs.readFileSync(process.argv[2], 'utf8').split('\\n')[0];
const skip = /^(Merge|Revert|fixup!|squash!)/;
const regex = /^[\\s]*(STATUS|Status|status)\\(((infinity)|([0-9]{3}))\\)[\\s]*:[\\s]+.+/;
if (skip.test(msg)) process.exit(0);
if (!regex.test(msg)) {
  console.error('Commit message must follow STATUS(code): message');
  process.exit(1);
}
process.exit(0);
`;
  const prepareScript = '#!/usr/bin/env sh\n# Reserved for future STATUS automation\nexit 0\n';

  const created = [];
  writeFile(commitMsgTarget, commitMsgScript, options.force) && created.push(commitMsgTarget);
  fs.chmodSync(commitMsgTarget, 0o755);
  writeFile(prepareTarget, prepareScript, options.force) && created.push(prepareTarget);
  fs.chmodSync(prepareTarget, 0o755);

  if (options.ci) {
    const dest = path.join(root, '.github', 'workflows', 'status-commit.yml');
    copyTemplate(path.join('github', 'workflows', 'status-commit.yml'), dest, options.force) &&
      created.push(dest);
  }

  if (options.templates) {
    const prDest = path.join(root, '.github', 'pull_request_template.md');
    copyTemplate(path.join('github', 'pull_request_template.md'), prDest, options.force) &&
      created.push(prDest);

    const issueDest = path.join(root, '.github', 'ISSUE_TEMPLATE', 'status.md');
    copyTemplate(path.join('github', 'ISSUE_TEMPLATE', 'status.md'), issueDest, options.force) &&
      created.push(issueDest);

    const issueConfigDest = path.join(root, '.github', 'ISSUE_TEMPLATE', 'config.yml');
    copyTemplate(path.join('github', 'ISSUE_TEMPLATE', 'config.yml'), issueConfigDest, options.force) &&
      created.push(issueConfigDest);
  }

  console.log(chalk.green(`STATUS assets installed${created.length ? ':' : ''}`));
  created.forEach((p) => console.log(`  - ${path.relative(root, p)}`));
}

export function enforceHook(msgFile) {
  const msg = fs.readFileSync(msgFile, 'utf8').split('\n')[0];
  if (!validateMessage(msg)) {
    console.error('Commit message must follow STATUS(code): message');
    process.exit(1);
  }
  process.exit(0);
}
