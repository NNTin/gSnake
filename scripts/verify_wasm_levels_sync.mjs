#!/usr/bin/env node

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { isDeepStrictEqual } from "node:util";

function firstMismatchPath(expected, actual, currentPath = "$") {
  if (isDeepStrictEqual(expected, actual)) {
    return null;
  }

  if (
    expected !== null &&
    actual !== null &&
    typeof expected === "object" &&
    typeof actual === "object"
  ) {
    if (Array.isArray(expected) && Array.isArray(actual)) {
      const max = Math.max(expected.length, actual.length);
      for (let i = 0; i < max; i += 1) {
        const mismatch = firstMismatchPath(
          expected[i],
          actual[i],
          `${currentPath}[${i}]`,
        );
        if (mismatch) {
          return mismatch;
        }
      }
      return `${currentPath}.length`;
    }

    const expectedKeys = Object.keys(expected);
    const actualKeys = Object.keys(actual);
    for (const key of expectedKeys) {
      if (!Object.prototype.hasOwnProperty.call(actual, key)) {
        return `${currentPath}.${key}`;
      }
      const mismatch = firstMismatchPath(
        expected[key],
        actual[key],
        `${currentPath}.${key}`,
      );
      if (mismatch) {
        return mismatch;
      }
    }
    for (const key of actualKeys) {
      if (!Object.prototype.hasOwnProperty.call(expected, key)) {
        return `${currentPath}.${key}`;
      }
    }
  }

  return currentPath;
}

async function main() {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const rootDir = path.resolve(scriptDir, "..");
  const levelsPath = path.join(
    rootDir,
    "gsnake-core",
    "engine",
    "core",
    "data",
    "levels.json",
  );
  const wasmJsPath = path.join(
    rootDir,
    "gsnake-core",
    "engine",
    "bindings",
    "wasm",
    "pkg",
    "gsnake_wasm.js",
  );
  const wasmBinPath = path.join(
    rootDir,
    "gsnake-core",
    "engine",
    "bindings",
    "wasm",
    "pkg",
    "gsnake_wasm_bg.wasm",
  );

  const expectedLevels = JSON.parse(readFileSync(levelsPath, "utf-8"));
  const wasmModule = await import(pathToFileURL(wasmJsPath).href);
  const wasmBytes = readFileSync(wasmBinPath);
  wasmModule.initSync({ module: wasmBytes });
  const embeddedLevels = wasmModule.getLevels();

  if (!isDeepStrictEqual(expectedLevels, embeddedLevels)) {
    const mismatchPath = firstMismatchPath(expectedLevels, embeddedLevels) ?? "$";
    console.error(
      `WASM embedded levels do not match generated levels.json (first mismatch: ${mismatchPath})`,
    );
    process.exit(1);
  }

  console.log(
    `WASM embedded levels are synchronized (${expectedLevels.length} levels verified).`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
