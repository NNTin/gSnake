#!/bin/bash
#
# detect-repo-context.sh
#
# Detects if the current script is running in a root repository context
# (with git submodules checked out) or in a standalone submodule context.
#
# This script exports environment variables that other build scripts can use
# to determine whether to use local paths or git dependencies.
#
# USAGE:
#   From a build script in a submodule:
#
#     source ../../scripts/detect-repo-context.sh
#
#     if [ "$GSNAKE_ROOT_REPO" = "true" ]; then
#       echo "Running in root repo - using local paths"
#       # Use local paths: ../gsnake-core, ../gsnake-levels, etc.
#     else
#       echo "Running standalone - using git dependencies"
#       # Use git dependencies
#     fi
#
# EXPORTED VARIABLES:
#   GSNAKE_ROOT_REPO - "true" if root repo detected, "false" otherwise
#   GSNAKE_CORE_PATH - Path to gsnake-core (if root repo)
#   GSNAKE_LEVELS_PATH - Path to gsnake-levels (if root repo)
#   GSNAKE_WEB_PATH - Path to gsnake-web (if root repo)
#   GSNAKE_EDITOR_PATH - Path to gsnake-editor (if root repo)
#   GSNAKE_SPECS_PATH - Path to gsnake-specs (if root repo)
#

set -e

# Detect root repo context
# We check if:
# 1. ../.git exists (we're in a submodule or subdirectory of root)
# 2. ../gsnake-core exists (gsnake-core is part of root repo, not a submodule)
if [ -e "../.git" ] && [ -d "../gsnake-core" ]; then
  export GSNAKE_ROOT_REPO=true
  export GSNAKE_CORE_PATH=../gsnake-core

  # Check for other submodules and export paths if they exist
  [ -d "../gsnake-levels" ] && export GSNAKE_LEVELS_PATH=../gsnake-levels
  [ -d "../gsnake-web" ] && export GSNAKE_WEB_PATH=../gsnake-web
  [ -d "../gsnake-editor" ] && export GSNAKE_EDITOR_PATH=../gsnake-editor
  [ -d "../gsnake-specs" ] && export GSNAKE_SPECS_PATH=../gsnake-specs

  echo "[detect-repo-context] Root repository detected"
  echo "[detect-repo-context] GSNAKE_ROOT_REPO=true"
  echo "[detect-repo-context] Local paths available:"
  [ -n "$GSNAKE_CORE_PATH" ] && echo "  - gsnake-core: $GSNAKE_CORE_PATH"
  [ -n "$GSNAKE_LEVELS_PATH" ] && echo "  - gsnake-levels: $GSNAKE_LEVELS_PATH"
  [ -n "$GSNAKE_WEB_PATH" ] && echo "  - gsnake-web: $GSNAKE_WEB_PATH"
  [ -n "$GSNAKE_EDITOR_PATH" ] && echo "  - gsnake-editor: $GSNAKE_EDITOR_PATH"
  [ -n "$GSNAKE_SPECS_PATH" ] && echo "  - gsnake-specs: $GSNAKE_SPECS_PATH"
else
  export GSNAKE_ROOT_REPO=false
  echo "[detect-repo-context] Standalone submodule detected"
  echo "[detect-repo-context] GSNAKE_ROOT_REPO=false"
  echo "[detect-repo-context] Use git dependencies for cross-repo deps"
fi
