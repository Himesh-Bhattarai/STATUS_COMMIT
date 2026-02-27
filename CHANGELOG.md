# Changelog
All notable changes to this project will be documented in this file.

## [1.3.0] - 2026-02-27
- Added `status-commit install --ci --templates` to scaffold GitHub workflow, PR, and issue templates.
- Bundled reusable workflow/templates in the npm package and CLI installer output.
- Swapped native SQLite deps for pure WASM `sql.js` (removes `prebuild-install` warnings).
- CLI now reports the package version correctly and exposes new install flags.
- Quickstart docs refreshed to match the new install flow (GIF needs re-recording).

## [1.1.1] - 2026-02-24
- Fixed garbled dash in Live Examples links across docs.

## [1.2.0] - 2026-02-27
- Added `status-commit` npm CLI (bin) with commands: install, commit validation, scan, report, dashboard.
- Hook install is now one command (`status-commit install`) without manual templates.
- Git history scanner stores risk metadata in SQLite and can output a static interactive dashboard.
- Kept STATUS codes unchanged; VS Code extension remains as before.

## [1.2.1] - 2026-02-27
- Switched `status-commit` storage to `better-sqlite3` (removes tar/node-gyp audit issues).
- Dashboard default commit limit set to 50.
- README updated to show new `status-commit commit "<msg>"` validator; removed outdated guided command examples.
- Added `.status-intel/` to .gitignore to avoid committing report artifacts.

## [1.1.0] - 2026-02-23
- Added VS Code extension source with autocomplete and Quick Pick.
- Added guided commit command in the CLI.
- Defaulted examples and templates to `status(###):` and required `:` separator.
- Added quickstart GIF and printable cheat sheet image.

## [1.0.0] - 2026-02-23
- Initial release of the STATUS commit system.
- Added commit template, hook installers, and validation hook.
- Added documentation, examples, and machine-readable codes.
