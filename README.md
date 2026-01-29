# gSnake

[![Deploy](https://github.com/NNTin/gSnake/actions/workflows/deploy.yml/badge.svg)](https://github.com/NNTin/gSnake/actions/workflows/deploy.yml)
[![License](https://img.shields.io/badge/license-All%20Rights%20Reserved-red.svg)](LICENSE)

**Play now:** [nntin.xyz/gSnake](http://nntin.xyz/gSnake/)

## About

Gravity Snake reimagines the classic Snake game by introducing gravity physics and strategic, turn-based movement.

Unlike traditional Snake games that rely on reflexes, Gravity Snake is a puzzle game where you must think several moves ahead. The snake only moves when you act, and after each move, gravity pulls it downward until it hits an obstacle or the floor.

## How to Play

- **🎮 Controls:** Use arrow keys or WASD to move
- **🎯 Goal:** Collect all food, then reach the exit
- **⚠️ Rules:**
  - Avoid hitting walls, obstacles, or yourself
  - You cannot reverse direction (no 180° turns)
  - Gravity pulls you down after each move
- **🔄 Restart:** Press `R` to restart the current level
- **🏠 Menu:** Press `Q` to return to level 1

## Features

- 🧩 Puzzle-focused gameplay with gravity physics
- 📊 Progressive difficulty across multiple levels
- 🎨 Clean, minimalist design
- 🚀 Built with Rust + WebAssembly for performance
- ✅ Comprehensive contract testing ensures reliability

## Terminal Demo

![Terminal Demo](gsnake-core/demo.svg)

---

## Developer Documentation

### Repository Structure

This is a monorepo containing several submodules:

- **gsnake-core** - Rust game engine (part of root repo, not a submodule)
- **gsnake-web** - Svelte web UI (git submodule)
- **gsnake-editor** - Level editor (git submodule)
- **gsnake-levels** - Level definitions and renderer (git submodule)
- **gsnake-specs** - Documentation and specifications (git submodule)

Each submodule can build and test independently using git branch dependencies.

### Submodule Dependency Resolution

The repository supports two working modes:

1. **Root repository mode** (this repo with submodules): Uses local paths for fast development
2. **Standalone submodule mode**: Uses git dependencies to build independently

**Auto-detection:**

Build scripts automatically detect which mode they're running in by checking for `../.git` and `../gsnake-core`.

**Detection script:**

```bash
source scripts/detect-repo-context.sh

if [ "$GSNAKE_ROOT_REPO" = "true" ]; then
  echo "Running in root repo - using local paths"
  # GSNAKE_CORE_PATH, GSNAKE_WEB_PATH, etc. are available
else
  echo "Running standalone - using git dependencies"
fi
```

For more details, see:
- [Repository Architecture](gsnake-specs/tasks/repo-architecture.md)
- [Standalone Submodules Build PRD](gsnake-specs/tasks/prd-standalone-submodules-build.md)

### Building

**Root repository:**

```bash
# Clone with submodules
git clone --recurse-submodules https://github.com/nntin/gSnake.git

# Build WASM
python3 scripts/build_wasm.py

# Build web UI
cd gsnake-web
npm install
npm run build
```

**Standalone submodules:**

Each submodule can be cloned and built independently. See the README.md in each submodule for instructions.

---

Built with [Rust](https://www.rust-lang.org/) and [Svelte](https://svelte.dev/)
