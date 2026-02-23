# STATUS Commit System
Readable git history, at a glance.

Created by Himeshchanchal Bhattarai (Founder)
Inspired by HTTP status semantics.

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Commit Style](https://img.shields.io/badge/Commit%20Style-STATUS-0a7.svg)](README.md)
[![STATUS Commit Check](https://github.com/Himesh-Bhattarai/STATUS_COMMIT/actions/workflows/status-commit.yml/badge.svg)](https://github.com/Himesh-Bhattarai/STATUS_COMMIT/actions/workflows/status-commit.yml)

## What It Is
STATUS is a commit convention that encodes the reliability and state of a change.
It makes git history scannable, honest, and easy to communicate across teams.

## Quickstart (60 Seconds)
1. Copy these files into your repo: `.gitmessage`, `hooks/commit-msg`, `scripts/install-hooks.*`.
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
git commit -m "STATUS(301): add export endpoint"
```

## Format

```
STATUS(###): short summary
```

Special case:

```
STATUS(infinity): short summary
```

## Cheat Sheet
![STATUS Cheat Sheet](assets/status-cheatsheet.svg)

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

## Full Code List
0xx Initialization
STATUS(001): Initial commit / project start
STATUS(002): Base structure established
STATUS(003): Create / delete folder or file

1xx In Progress
STATUS(101): Draft or scaffolding added
STATUS(102): Partial implementation

2xx Stable / Working
STATUS(201): Working as expected
STATUS(202): Verified with real usage
STATUS(203): Documentation updated (README, JSDoc, etc.)
STATUS(204): Production-ready

3xx Change / Improvement
STATUS(300): Refactoring (no functional change)
STATUS(301): Feature or capability added
STATUS(302): Enhancement or improvement

4xx Design / Usage Issues
STATUS(401): Incorrect data flow or usage
STATUS(403): Scope or responsibility issue
STATUS(408): Performance / latency issues identified

5xx Broken / Failure
STATUS(500): Not working / runtime failure
STATUS(502): Interface or contract mismatch
STATUS(503): Security vulnerability or auth failure

6xx Recovery
STATUS(601): Bug or failure fixed
STATUS(603): Structure or state corrected

Special
STATUS(infinity): Gold Master / Fully stable, tested, and trusted
STATUS(404): Human State / Chaos (does not indicate code quality)

## Examples

```
STATUS(301): add export endpoint
STATUS(601): fix null pointer in auth middleware
STATUS(102): scaffold payment flow
STATUS(203): update README and usage examples
STATUS(infinity): v1.0.0 gold master
STATUS(404): everything is broken except me
```

## Tooling In This Repo
- `.gitmessage` commit template for consistent summaries.
- `hooks/commit-msg` validates the STATUS format.
- `scripts/install-hooks.*` installs the hook for your repo.
- `status-codes.json` provides machine-readable codes.

## Automation
A GitHub Action is included at `.github/workflows/status-commit.yml` to check commit messages in PRs and pushes to `main`.

## Compatibility
You can combine STATUS with Conventional Commits if you want:

```
STATUS(301): feat(api) add export endpoint
```

## FAQ
- **Do I have to use it for every commit?** Only if you enable the hook or CI check.
- **Does it replace semantic versioning?** No. It is about commit intent, not releases.
- **Can I combine this with Conventional Commits?** Yes, just add the conventional type after the STATUS prefix.
- **What about merge commits?** They are allowed and ignored by the hook and CI.

## Suggested GitHub Topics
`git`, `commit`, `conventions`, `workflow`, `developer-tools`, `productivity`

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
