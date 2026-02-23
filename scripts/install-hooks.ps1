$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$hookDir = Join-Path $root ".git\hooks"
$commitMsg = Join-Path $root "hooks\commit-msg"
$prepareMsg = Join-Path $root "hooks\prepare-commit-msg"

New-Item -ItemType Directory -Force -Path $hookDir | Out-Null
Copy-Item -Force $commitMsg (Join-Path $hookDir "commit-msg")
Copy-Item -Force $prepareMsg (Join-Path $hookDir "prepare-commit-msg")

& git -C $root config commit.template .gitmessage | Out-Null

Write-Host "Installed commit hooks and commit template in $root"
