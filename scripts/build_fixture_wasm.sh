#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FIXTURE_LEVELS="${ROOT_DIR}/e2e/fixtures/levels.json"
OUTPUT_DIR="${ROOT_DIR}/e2e/fixtures/gsnake-wasm"
TMP_DIR="$(mktemp -d)"

cleanup() {
  rm -rf "${TMP_DIR}"
}
trap cleanup EXIT

cp -R "${ROOT_DIR}/gsnake-core" "${TMP_DIR}/gsnake-core"
cp "${FIXTURE_LEVELS}" "${TMP_DIR}/gsnake-core/engine/core/data/levels.json"

(
  cd "${TMP_DIR}/gsnake-core/engine/bindings/wasm"
  wasm-pack build --target web
)

rm -rf "${OUTPUT_DIR}"
mkdir -p "${OUTPUT_DIR}"
cp -R "${TMP_DIR}/gsnake-core/engine/bindings/wasm/pkg" "${OUTPUT_DIR}/pkg"
