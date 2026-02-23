# STATUS Commit System
Readable git history, at a glance.

Created by Himeshchanchal Bhattarai
Inspired by HTTP status semantics.

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Commit Style](https://img.shields.io/badge/Commit%20Style-STATUS-0a7.svg)](README.md)
[![STATUS Commit Check](https://github.com/Himesh-Bhattarai/STATUS_COMMIT/actions/workflows/status-commit.yml/badge.svg)](https://github.com/Himesh-Bhattarai/STATUS_COMMIT/actions/workflows/status-commit.yml)

## What It Is
STATUS is a commit convention that encodes the reliability and state of a change.
It makes git history scannable, honest, and easy to communicate across teams.
The STATUS code signals the objective, intended state (working, broken, refactored, WIP), while the message remains the author's narrative about what they did and why.

## Quickstart (60 Seconds)
1. Copy these files into your repo: `.gitmessage`, `hooks/commit-msg`, `hooks/prepare-commit-msg`, `scripts/install-hooks.*`.
2. Set the commit template: `git config commit.template .gitmessage`.
3. Install the hook.

```bash
# macOS / Linux
bash scripts/install-hooks.sh
```

```powershell
# Windows
powershell -ExecutionPolicy Bypass -File scripts/install-hooks.ps1
```

4. Make a commit.

```bash
git commit -m "status(301): add export endpoint"
```

Tip: run `git commit` (without `-m`) to see the inline STATUS prompt in your editor.

## Quick Start Video (GIF)
Below is a short, looping GIF showing the 60-second install and a guided commit:

![Quick Start Demo](assets/quickstart.gif)

## One-Command Install
If you cloned this repo, you can install STATUS into any git repo:

```bash
# macOS / Linux
./bin/status-commit install --repo /path/to/your-repo
```

```powershell
# Windows
powershell -ExecutionPolicy Bypass -File bin/status-commit.ps1 -Repo C:\path\to\your-repo
```

## Guided Commit (Uses -m)
If you want a guided menu that still uses `-m` under the hood:

```bash
# macOS / Linux
./bin/status-commit commit --repo /path/to/your-repo
```

```powershell
# Windows
powershell -ExecutionPolicy Bypass -File bin/status-commit.ps1 commit -Repo C:\path\to\your-repo
```

## VS Code Extension
An extension source is included in `vscode-extension/`. It provides:
- Autocomplete for `status(###):` in commit message editors.
- A command: `STATUS Commit: Insert Code` (Quick Pick).

### Install Locally (VSIX)
```bash
cd vscode-extension
npm i -g @vscode/vsce
vsce package
code --install-extension status-commit-0.0.1.vsix
```

### Run In Dev Mode
Open the `vscode-extension` folder in VS Code and press `F5`.

## Format

```
status(###): short summary
```

Special case:

```
status(infinity): short summary
```

Accepted prefixes: `STATUS`, `Status`, `status` (recommended: `status`).
Required separator between code and summary: `:`.

## Cheat Sheet
![STATUS Cheat Sheet](assets/status-cheatsheet.svg)

Printable version:
[Printable Cheat Sheet (PNG)](assets/status-cheatsheet-printable.png)

Top codes:

| Code | When to use |
| --- | --- |
| STATUS(301) | New feature that works |
| STATUS(601) | Bug fix |
| STATUS(302) | Improvement to existing feature |
| STATUS(201) | Stable change |
| STATUS(300) | Refactor only |
| STATUS(102) | Work in progress |

## Decision Guide
- Use 1xx when the work is incomplete or experimental.
- Use 103 when the work is blocked or waiting on a dependency.
- Use 104 for research or spike work.
- Use 2xx when the change is working and safe.
- Use 3xx when you improved or refactored something.
- Use 5xx when something is broken or failing.
- Use 6xx when you fixed a failure.
- Use 203 for documentation-only changes.
- Use 409 when it works but is risky or fragile.
- Use 404 for human chaos or debugging madness.

## Full Code List
| Category | Code | Meaning |
| --- | --- | --- |
| Initialization | STATUS(001) | Initial commit / project start |
| Initialization | STATUS(002) | Base structure established |
| Initialization | STATUS(003) | Create / delete folder or file |
| In Progress | STATUS(101) | Draft or scaffolding added |
| In Progress | STATUS(102) | Partial implementation |
| In Progress | STATUS(103) | Blocked / waiting on dependency |
| In Progress | STATUS(104) | Research / spike / exploration |
| Stable / Working | STATUS(201) | Working as expected |
| Stable / Working | STATUS(202) | Verified with real usage |
| Stable / Working | STATUS(203) | Documentation updated (README, JSDoc, etc.) |
| Stable / Working | STATUS(204) | Production-ready |
| Change / Improvement | STATUS(300) | Refactoring (no functional change) |
| Change / Improvement | STATUS(301) | Feature or capability added |
| Change / Improvement | STATUS(302) | Enhancement or improvement |
| Design / Usage Issues | STATUS(401) | Incorrect data flow or usage |
| Design / Usage Issues | STATUS(403) | Scope or responsibility issue |
| Design / Usage Issues | STATUS(408) | Performance / latency issues identified |
| Design / Usage Issues | STATUS(409) | Works but risky / fragile (needs review or testing) |
| Broken / Failure | STATUS(500) | Not working / runtime failure |
| Broken / Failure | STATUS(502) | Interface or contract mismatch |
| Broken / Failure | STATUS(503) | Security vulnerability or auth failure |
| Recovery | STATUS(601) | Bug or failure fixed |
| Recovery | STATUS(603) | Structure or state corrected |
| Special | STATUS(infinity) | Gold Master / Fully stable, tested, and trusted |
| Special | STATUS(404) | Human State / Chaos (does not indicate code quality) |

Note: Some numeric gaps are intentional and reserved for future codes or team-specific use.

## Examples

```
status(301): add export endpoint
status(601): fix null pointer in auth middleware
status(102): scaffold payment flow
status(103): blocked by vendor API changes
status(409): works but risky, needs extra testing
status(203): update README and usage examples
status(infinity): v1.0.0 gold master
status(404): everything is broken except me
```

## Live Examples
- [STATUS Commit System (this repo) — commit history](https://github.com/Himesh-Bhattarai/STATUS_COMMIT/commits/main)

## Tooling In This Repo
- `.gitmessage` commit template for consistent summaries.
- `hooks/commit-msg` validates the STATUS format.
- `hooks/prepare-commit-msg` pre-fills a STATUS line for empty messages.
- `scripts/install-hooks.*` installs the hook for your repo.
- `status-codes.json` provides machine-readable codes.
- `bin/status-commit` and `bin/status-commit.ps1` install tools into any repo.

## Automation
A GitHub Action is included at `.github/workflows/status-commit.yml` to check commit messages in PRs and pushes to `main`.

## Templates
- Issue templates live in `.github/ISSUE_TEMPLATE`.
- A pull request template lives at `.github/pull_request_template.md`.

## Compatibility
You can combine STATUS with Conventional Commits if you want:

```
status(301): feat(api) add export endpoint
```

## FAQ
- **Do I have to use it for every commit?** Only if you enable the hook or CI check.
- **Does it replace semantic versioning?** No. It is about commit intent, not releases.
- **Can I combine this with Conventional Commits?** Yes, just add the conventional type after the STATUS prefix.
- **What about merge commits?** They are allowed and ignored by the hook and CI.

## Suggested GitHub Topics
`git`, `commit`, `conventions`, `workflow`, `developer-tools`, `productivity`

## GitHub Pages
A landing page is included in `docs/`. Enable GitHub Pages with the `main` branch and `/docs` folder.

## Social Preview
A ready-to-use image is included at `assets/social-preview.svg`. Export it to PNG and set it in your GitHub repository settings for better sharing.

## Changelog
See `CHANGELOG.md`.

## Contributing
See `CONTRIBUTING.md`.

## Author
Created and maintained by Himeshchanchal Bhattarai.

## License
Apache-2.0. See `LICENSE` and `NOTICE`.
