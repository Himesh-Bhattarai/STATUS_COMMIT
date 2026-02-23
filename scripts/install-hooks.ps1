$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$src = Join-Path $root "hooks\commit-msg"
$dest = Join-Path $root ".git\hooks\commit-msg"

Copy-Item -Force $src $dest
Write-Host "Installed commit-msg hook to $dest"
