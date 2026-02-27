#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { installHooks, validateMessage } from '../lib/commit-enforcer.js';
import { scan, recent } from '../lib/history-analyzer.js';
import { repoRoot, dbPath, readConfig, openFile } from '../lib/utils.js';
import { generateDashboard } from '../lib/dashboard.js';

const program = new Command();

program
  .name('status-commit')
  .description('STATUS commit enforcement + git history analysis')
  .version('1.0.0');

program
  .command('install')
  .description('Install git commit hooks to enforce STATUS(code): message')
  .action(() => {
    installHooks();
  });

program
  .command('commit <message>')
  .description('Validate a commit message locally (useful for CI pre-check)')
  .action((message) => {
    if (!validateMessage(message)) {
      console.error(chalk.red('Invalid commit message. Use status(123): your message'));
      process.exit(1);
    }
    console.log(chalk.green('Commit message valid.'));
  });

program
  .command('scan')
  .option('-l, --limit <n>', 'Number of commits to scan', (v) => parseInt(v, 10), 200)
  .description('Scan git history and update local risk DB')
  .action(async (opts) => {
    const root = repoRoot();
    const config = readConfig(root);
    const { scanned, dbFile } = await scan({ limit: opts.limit, root, config });
    console.log(chalk.green(`Scanned ${scanned.length} commits. DB: ${dbFile}`));
  });

program
  .command('report')
  .option('-l, --limit <n>', 'Number of commits to show', (v) => parseInt(v, 10), 50)
  .description('Console report of recent commits and risk')
  .action(async (opts) => {
    const root = repoRoot();
    const { commits } = await recent(dbPath(root), opts.limit);
    if (!commits.length) {
      console.log('No data. Run status-commit scan first.');
      return;
    }
    for (const c of commits) {
      console.log(
        `${c.hash.slice(0,7)} | status(${c.status_code || '---'}) | files ${c.files_changed} | +${c.insertions}/-${c.deletions} | risk ${c.score} ${c.level}`
      );
    }
  });

program
  .command('dashboard')
  .option('-l, --limit <n>', 'Number of commits to include', (v) => parseInt(v, 10), 50)
  .description('Generate static HTML dashboard and open it')
  .action(async (opts) => {
    const root = repoRoot();
    const db = dbPath(root);
    const { commits, files } = await recent(db, opts.limit);
    const driftEvents = [];
    const graphData = { graph: null, edges: [] };
    if (!commits.length) {
      console.log('No data. Run status-commit scan first.');
      return;
    }
    const htmlPath = generateDashboard({
      repoPath: root,
      commits,
      commitFiles: files,
      graph: graphData.graph,
      edges: graphData.edges,
      driftEvents,
      open: false
    });
    console.log(chalk.green(`Dashboard generated at ${htmlPath}`));
    openFile(htmlPath);
  });

program.parse(process.argv);
