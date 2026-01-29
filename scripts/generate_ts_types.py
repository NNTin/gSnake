#!/usr/bin/env python3
"""
Generate TypeScript type definitions from Rust types.

This script runs the export_ts binary from gsnake-core to generate TypeScript
type definitions. It must be run from the root repository context.

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
    core_dir = root_dir / "gsnake-core"

    # Verify gsnake-core exists (root repo context check)
    if not core_dir.exists():
        print(f"Error: gsnake-core directory not found: {core_dir}", file=sys.stderr)
        print("This script must be run from the root gSnake repository.", file=sys.stderr)
        print("gsnake-core is part of the root repo (not a submodule).", file=sys.stderr)
        return 1

    print(f"Generating TypeScript types from: {core_dir}")
    result = subprocess.run(
        ["cargo", "run", "-p", "gsnake-core", "--bin", "export_ts"],
        cwd=core_dir,
        check=False,
    )
    return result.returncode


if __name__ == "__main__":
    sys.exit(main())
