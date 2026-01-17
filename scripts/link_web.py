#!/usr/bin/env python3
import json
import sys
from pathlib import Path


def main() -> int:
    repo_root = Path(__file__).resolve().parent.parent
    package_json = repo_root / "package.json"
    data = json.loads(package_json.read_text(encoding="utf-8"))
    deps = data.setdefault("dependencies", {})
    expected = "file:gsnake-core/engine/bindings/wasm/pkg"
    if deps.get("gsnake-wasm") != expected:
        deps["gsnake-wasm"] = expected
        package_json.write_text(
            json.dumps(data, indent=2) + "\n",
            encoding="utf-8",
        )
        print("Updated gsnake-wasm dependency to file: path")
    else:
        print("gsnake-wasm dependency already set")
    return 0


if __name__ == "__main__":
    sys.exit(main())
