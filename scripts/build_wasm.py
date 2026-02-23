#!/usr/bin/env python3
"""
Build WASM bindings for gsnake-core.

This script keeps generated level data and WASM artifacts in sync by:
1. Regenerating gsnake-core/engine/core/data/levels.json from gsnake-levels
2. Building WebAssembly bindings for gsnake-core using wasm-pack

Dependency Resolution:
- This script uses local paths and assumes root repository context
- gsnake-core is part of the root repository (not a submodule)
- gsnake-levels is a submodule required to regenerate levels.json
- The script automatically detects the gsnake-core directory relative to its location
- If required directories are missing, the script fails with a clear error message
"""
import subprocess
import sys
from pathlib import Path


def run_generate_levels(root_dir: Path) -> int:
    levels_manifest = root_dir / "gsnake-levels" / "Cargo.toml"
    levels_output = root_dir / "gsnake-core" / "engine" / "core" / "data" / "levels.json"

    if not levels_manifest.exists():
        print(
            f"Error: gsnake-levels manifest not found: {levels_manifest}",
            file=sys.stderr,
        )
        print(
            "Initialize submodules first: git submodule update --init --recursive",
            file=sys.stderr,
        )
        return 1

    print(f"Generating levels JSON via: {levels_manifest}", flush=True)
    result = subprocess.run(
        [
            "cargo",
            "run",
            "--manifest-path",
            str(levels_manifest),
            "--",
            "generate-levels-json",
            "--no-sync",
        ],
        cwd=root_dir,
        check=False,
        capture_output=True,
        text=True,
    )

    if result.returncode != 0:
        if result.stdout:
            print(result.stdout, file=sys.stderr)
        if result.stderr:
            print(result.stderr, file=sys.stderr)
        return result.returncode

    output = result.stdout
    if output and not output.endswith("\n"):
        output += "\n"
    levels_output.write_text(output, encoding="utf-8")
    print(f"Updated generated levels: {levels_output}", flush=True)
    return 0


def run_build_wasm(root_dir: Path) -> int:
    wasm_dir = root_dir / "gsnake-core" / "engine" / "bindings" / "wasm"

    # Verify gsnake-core exists (root repo context check)
    if not wasm_dir.exists():
        print(f"Error: WASM directory not found: {wasm_dir}", file=sys.stderr)
        print("This script must be run from the root gSnake repository.", file=sys.stderr)
        print("gsnake-core is part of the root repo (not a submodule).", file=sys.stderr)
        return 1

    print(f"Building WASM in: {wasm_dir}", flush=True)
    result = subprocess.run(
        ["wasm-pack", "build", "--target", "web"],
        cwd=wasm_dir,
        check=False,
    )
    return result.returncode


def main() -> int:
    # Detect root repository context
    root_dir = Path(__file__).resolve().parent.parent

    generate_code = run_generate_levels(root_dir)
    if generate_code != 0:
        return generate_code

    return run_build_wasm(root_dir)


if __name__ == "__main__":
    sys.exit(main())
