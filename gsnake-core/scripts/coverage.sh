#!/usr/bin/env bash
set -euo pipefail

mkdir -p target/llvm-cov

# Temporarily disable exit-on-error so we can capture failure
set +e
cargo llvm-cov \
  --package gsnake-core \
  --package gsnake-wasm \
  --all-targets \
  --ignore-filename-regex 'bindings/cli|bin/export_ts' \
  --fail-under-lines 80 \
  --lcov \
  --output-path target/llvm-cov/lcov.info
COV_STATUS=$?
set -e

# Always generate summary (even if threshold failed)
cargo llvm-cov report --summary-only \
  --package gsnake-core \
  --package gsnake-wasm \
  --ignore-filename-regex 'bindings/cli|bin/export_ts' \
  > target/llvm-cov/summary.txt

# Re-exit with original coverage status
exit $COV_STATUS