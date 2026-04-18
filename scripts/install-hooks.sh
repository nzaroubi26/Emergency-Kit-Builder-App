#!/usr/bin/env bash
set -e

# Install git hooks from scripts/hooks/ into .git/hooks/.
# Run once after cloning: ./scripts/install-hooks.sh

ROOT=$(git rev-parse --show-toplevel)
SRC="$ROOT/scripts/hooks"
DST="$ROOT/.git/hooks"

if [ ! -d "$SRC" ]; then
  echo "Error: $SRC does not exist."
  exit 1
fi

for hook in pre-commit pre-push; do
  if [ -f "$SRC/$hook" ]; then
    cp "$SRC/$hook" "$DST/$hook"
    chmod +x "$DST/$hook"
    echo "Installed $hook"
  fi
done

echo "Done. Hooks will run on commit/push."
