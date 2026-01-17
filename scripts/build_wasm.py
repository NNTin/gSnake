#!/usr/bin/env python3
import subprocess
import sys
from pathlib import Path


def main() -> int:
    wasm_dir = Path(__file__).resolve().parent.parent / "gsnake-core" / "engine" / "bindings" / "wasm"
    result = subprocess.run(
        ["wasm-pack", "build", "--target", "web"],
        cwd=wasm_dir,
        check=False,
    )
    return result.returncode


if __name__ == "__main__":
    sys.exit(main())
