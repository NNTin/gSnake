#!/usr/bin/env bash
set -euo pipefail

mkdir -p target/llvm-cov

cargo llvm-cov \
  --package gsnake-core \
  --all-targets \
  --ignore-filename-regex 'bin/export_ts' \
  --fail-under-lines 80 \
  --lcov \
  --output-path target/llvm-cov/lcov.info
