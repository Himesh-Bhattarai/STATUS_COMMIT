# STATUS Commit VS Code Extension

This extension adds autocomplete and a Quick Pick command for STATUS commit messages.

## Features
- Autocomplete for `status(###):` in commit message editors (`git-commit`).
- Command: `STATUS Commit: Insert Code`.

## Usage
1. Open a commit message file or SCM input box.
2. Trigger autocomplete (Ctrl+Space) or run the command from the Command Palette.

## Local Install (VSIX)
```bash
npm i -g @vscode/vsce
vsce package
code --install-extension status-commit-0.0.1.vsix
```

## Development
Open this folder in VS Code and press `F5` to launch an Extension Development Host.
