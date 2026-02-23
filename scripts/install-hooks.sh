#!/bin/sh
set -e

root="$(cd "$(dirname "$0")/.." && pwd)"
hook_dir="$root/.git/hooks"
commit_msg_src="$root/hooks/commit-msg"
prepare_msg_src="$root/hooks/prepare-commit-msg"

mkdir -p "$hook_dir"

cp "$commit_msg_src" "$hook_dir/commit-msg"
cp "$prepare_msg_src" "$hook_dir/prepare-commit-msg"
chmod +x "$hook_dir/commit-msg" "$hook_dir/prepare-commit-msg" 2>/dev/null || true

git -C "$root" config commit.template .gitmessage

echo "Installed commit hooks and commit template in $root"
