#!/bin/sh
set -e

root="$(cd "$(dirname "$0")/.." && pwd)"
src="$root/hooks/commit-msg"
dest="$root/.git/hooks/commit-msg"

cp "$src" "$dest"
chmod +x "$dest"

echo "Installed commit-msg hook to $dest"
