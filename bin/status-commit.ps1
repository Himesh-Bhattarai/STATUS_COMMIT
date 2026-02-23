param(
  [string]$Command = "install",
  [string]$Repo = "."
)

$root = Split-Path -Parent $PSScriptRoot
$gitDir = Join-Path $Repo ".git"

function Show-Usage {
  Write-Host "STATUS Commit System CLI"
  Write-Host ""
  Write-Host "Usage:"
  Write-Host "  status-commit.ps1 install -Repo <path>"
  Write-Host "  status-commit.ps1 commit -Repo <path>"
  Write-Host ""
  Write-Host "Examples:"
  Write-Host "  status-commit.ps1 install -Repo ."
  Write-Host "  status-commit.ps1 commit -Repo ."
}

if (-not (Test-Path $gitDir)) {
  Write-Error "Not a git repository: $Repo"
  exit 1
}

switch ($Command) {
  "install" {
    New-Item -ItemType Directory -Force -Path (Join-Path $Repo "hooks") | Out-Null
    New-Item -ItemType Directory -Force -Path (Join-Path $Repo ".git\hooks") | Out-Null

    Copy-Item -Force (Join-Path $root ".gitmessage") (Join-Path $Repo ".gitmessage")
    Copy-Item -Force (Join-Path $root "hooks\commit-msg") (Join-Path $Repo "hooks\commit-msg")
    Copy-Item -Force (Join-Path $root "hooks\prepare-commit-msg") (Join-Path $Repo "hooks\prepare-commit-msg")
    Copy-Item -Force (Join-Path $root "hooks\commit-msg") (Join-Path $Repo ".git\hooks\commit-msg")
    Copy-Item -Force (Join-Path $root "hooks\prepare-commit-msg") (Join-Path $Repo ".git\hooks\prepare-commit-msg")

    & git -C $Repo config commit.template .gitmessage | Out-Null

    Write-Host "Installed STATUS tools into $Repo"
    Write-Host "Next: git commit -m `"STATUS(301): add feature`""
  }
  "commit" {
    Write-Host "Pick a STATUS code:"
    Write-Host "1) 301 New feature"
    Write-Host "2) 601 Bug fix"
    Write-Host "3) 302 Improvement"
    Write-Host "4) 201 Stable change"
    Write-Host "5) 300 Refactor"
    Write-Host "6) 102 WIP"
    Write-Host "7) 203 Docs update"
    Write-Host "8) 500 Broken / failure"
    Write-Host "9) 404 Human state / chaos"
    Write-Host "0) Custom code"
    $choice = Read-Host "Choice"

    switch ($choice) {
      "1" { $code = "301" }
      "2" { $code = "601" }
      "3" { $code = "302" }
      "4" { $code = "201" }
      "5" { $code = "300" }
      "6" { $code = "102" }
      "7" { $code = "203" }
      "8" { $code = "500" }
      "9" { $code = "404" }
      "0" { $code = Read-Host "Enter code (3 digits or infinity)" }
      default {
        Write-Error "Invalid choice."
        exit 1
      }
    }

    if ($code -notmatch '^(infinity|\d{3})$') {
      Write-Error "Invalid code: $code"
      exit 1
    }

    $summary = Read-Host "Summary"
    if ([string]::IsNullOrWhiteSpace($summary)) {
      Write-Error "Summary is required."
      exit 1
    }

    $msg = "STATUS($code): $summary"
    & git -C $Repo commit -m $msg
  }
  default {
    Show-Usage
    exit 1
  }
}
