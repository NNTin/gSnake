#!/bin/sh
# Helper script to enable Git hooks in parent repo and all initialized submodules
# This script is POSIX-compatible

set -e

echo "Enabling Git hooks in gSnake repositories..."
echo ""

# Enable hooks in parent repo
echo "Parent repository:"
if [ -d ".github/hooks" ]; then
    git config core.hooksPath .github/hooks
    echo "  ✓ Hooks enabled in parent repo (.github/hooks)"
else
    echo "  ✗ No .github/hooks directory found in parent repo"
fi
echo ""

# Enable hooks in all initialized submodules
echo "Submodules:"
git submodule foreach --quiet '
    if [ -d ".github/hooks" ]; then
        git config core.hooksPath .github/hooks
        echo "  ✓ Hooks enabled in $name (.github/hooks)"
    else
        echo "  - Skipped $name (no .github/hooks directory)"
    fi
'

echo ""
echo "Done! Git hooks have been enabled where available."
echo ""
echo "To verify, run:"
echo "  git config --get core.hooksPath"
echo "  git submodule foreach 'git config --get core.hooksPath || echo \"(not enabled)\"'"
