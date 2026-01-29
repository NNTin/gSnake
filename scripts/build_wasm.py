#!/usr/bin/env python3
"""
Build WASM bindings for gsnake-core.

This script builds the WebAssembly bindings for the gsnake-core game engine
using wasm-pack. It must be run from the root repository context.

Dependency Resolution:
- This script uses local paths and assumes root repository context
- gsnake-core is part of the root repository (not a submodule)
- The script automatically detects the gsnake-core directory relative to its location
- If gsnake-core is not found, the script will fail with a clear error message
"""
import subprocess
import sys
from pathlib import Path


def main() -> int:
    # Detect root repository context
    root_dir = Path(__file__).resolve().parent.parent
    wasm_dir = root_dir / "gsnake-core" / "engine" / "bindings" / "wasm"

    # Verify gsnake-core exists (root repo context check)
    if not wasm_dir.exists():
        print(f"Error: WASM directory not found: {wasm_dir}", file=sys.stderr)
        print("This script must be run from the root gSnake repository.", file=sys.stderr)
        print("gsnake-core is part of the root repo (not a submodule).", file=sys.stderr)
        return 1

    print(f"Building WASM in: {wasm_dir}")
    result = subprocess.run(
        ["wasm-pack", "build", "--target", "web"],
        cwd=wasm_dir,
        check=False,
    )
    return result.returncode


if __name__ == "__main__":
    sys.exit(main())
