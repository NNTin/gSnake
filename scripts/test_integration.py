#!/usr/bin/env python3
import subprocess
import sys
from pathlib import Path


def main() -> int:
    repo_root = Path(__file__).resolve().parent.parent
    steps = [
        [sys.executable, str(repo_root / "scripts" / "build_wasm.py")],
        ["npm", "--prefix", "gsnake-web", "install"],
        ["npm", "run", "test:e2e"],
    ]
    for step in steps:
        result = subprocess.run(step, cwd=repo_root, check=False)
        if result.returncode != 0:
            return result.returncode
    return 0


if __name__ == "__main__":
    sys.exit(main())
