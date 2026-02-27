# status-commit

CLI tool for STATUS commit enforcement and lightweight git history intelligence.

## Install
```bash
npm install -g status-commit        # from npm
# or locally from this repo
cd status-commit && npm install -g
```

## Commands
- `status-commit install` - install commit hooks to enforce `status(###): message`
- `status-commit commit "<msg>"` - validate a message (useful in CI)
- `status-commit scan [--limit 200]` - scan git history, compute risk, store in SQLite
- `status-commit report [--limit 50]` - console report of recent commits and risk
- `status-commit dashboard [--limit 200]` - generate static HTML dashboard and open it

## Notes
- STATUS code list is unchanged (see repo root README/`status-codes.json`).
- VS Code extension lives at `vscode-extension/` (unchanged).
