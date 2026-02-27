import fs from 'fs';
import path from 'path';
import { statusRegex, repoRoot } from './utils.js';
import chalk from 'chalk';

export function validateMessage(message) {
  return statusRegex().test(message.trim());
}

export function installHooks(root = repoRoot()) {
  const gitHooks = path.join(root, '.git', 'hooks');
  if (!fs.existsSync(gitHooks)) {
    throw new Error('No .git/hooks directory found. Run inside a git repo.');
  }

  const commitMsgTarget = path.join(gitHooks, 'commit-msg');
  const prepareTarget = path.join(gitHooks, 'prepare-commit-msg');

  const commitMsgScript = `#!/usr/bin/env node
const fs = require('fs');
const msg = fs.readFileSync(process.argv[2], 'utf8').split('\\n')[0];
if(!/^status\\((\\d{3}|infinity)\\):\\s.+/i.test(msg)){
  console.error('Commit message must follow STATUS(code): message');
  process.exit(1);
}
process.exit(0);
`;
  fs.writeFileSync(commitMsgTarget, commitMsgScript, 'utf8');
  fs.chmodSync(commitMsgTarget, 0o755);

  const prepareScript = '#!/usr/bin/env sh\n# Reserved for future STATUS automation\nexit 0\n';
  fs.writeFileSync(prepareTarget, prepareScript, 'utf8');
  fs.chmodSync(prepareTarget, 0o755);

  console.log(chalk.green('STATUS commit hooks installed.'));
}

export function enforceHook(msgFile) {
  const msg = fs.readFileSync(msgFile, 'utf8').split('\n')[0];
  if (!validateMessage(msg)) {
    console.error('Commit message must follow STATUS(code): message');
    process.exit(1);
  }
  process.exit(0);
}
