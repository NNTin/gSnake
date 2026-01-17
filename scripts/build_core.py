#!/usr/bin/env python3
import subprocess
import sys
from pathlib import Path


def main() -> int:
    core_dir = Path(__file__).resolve().parent.parent / "gsnake-core"
    result = subprocess.run(["cargo", "build", "--workspace"], cwd=core_dir, check=False)
    return result.returncode


if __name__ == "__main__":
    sys.exit(main())
