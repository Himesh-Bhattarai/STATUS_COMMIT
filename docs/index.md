---
title: STATUS Commit System
---

# STATUS Commit System
Readable git history, at a glance.

Created by Himeshchanchal Bhattarai
Inspired by HTTP status semantics.

License: Apache-2.0
Repository: https://github.com/Himesh-Bhattarai/STATUS_COMMIT

## What It Is
STATUS is a commit convention that encodes the reliability and state of a change.
It makes git history scannable, honest, and easy to communicate across teams.
The STATUS code signals the objective, intended state (working, broken, refactored, WIP), while the message remains the author's narrative about what they did and why.

## Quickstart
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
Source is included in `vscode-extension/`. It provides autocomplete and a Quick Pick command.

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
- Use 2xx when the change is working and safe.
- Use 3xx when you improved or refactored something.
- Use 5xx when something is broken or failing.
- Use 6xx when you fixed a failure.
- Use 203 for documentation-only changes.
- Use 404 for human chaos or debugging madness.

## Examples

```
status(301): add export endpoint
status(601): fix null pointer in auth middleware
status(102): scaffold payment flow
status(203): update README and usage examples
status(infinity): v1.0.0 gold master
status(404): everything is broken except me
```

## Live Examples
- [STATUS Commit System (this repo) — commit history](https://github.com/Himesh-Bhattarai/STATUS_COMMIT/commits/main)

## Tooling
- `.gitmessage` commit template for consistent summaries.
- `hooks/commit-msg` validates the STATUS format.
- `hooks/prepare-commit-msg` pre-fills a STATUS line for empty messages.
- `scripts/install-hooks.*` installs the hook for your repo.
- `status-codes.json` provides machine-readable codes.
- `bin/status-commit` and `bin/status-commit.ps1` install tools into any repo.

## Automation
A GitHub Action checks commit messages on PRs and pushes to `main`.

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

## Contributing
See the repository for `CONTRIBUTING.md` and `CHANGELOG.md`.

## License
Apache-2.0. See the repository for `LICENSE` and `NOTICE`.
