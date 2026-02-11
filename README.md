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

### Local Development Ports

- **gsnake-web (Vite dev server):** http://localhost:3000
- **gsnake-editor (Vite dev server):** http://localhost:3003
- **gsnake-editor test-level API (Express):** http://localhost:3001 (`/api/test-level`)

### Submodule Dependency Resolution

The repository supports two modes:

1. Root repository mode (this repo with submodules)
2. Standalone submodule mode (each submodule cloned independently)

`gsnake-web` and `gsnake-editor` now synchronize UI through `gsnake-web-ui`:

- `gsnake-web` is an npm workspace with:
  - `packages/gsnake-web-ui`
  - `packages/gsnake-web-app`
- `gsnake-editor` depends on `gsnake-web-ui` via an auto-detection preinstall script.

#### Root Repository Mode

- `gsnake-web-app` uses local `gsnake-core` WASM
- `gsnake-editor` uses local `../gsnake-web/packages/gsnake-web-ui`
- shared style/sprite/component changes can be validated across both apps immediately

#### Standalone Mode

- `gsnake-web` vendors prebuilt WASM automatically
- `gsnake-editor` vendors a `gsnake-web-ui` snapshot from `NNTin/gsnake-web` `main` and builds it locally for precompiled consumption
- standalone CI jobs force this mode with `FORCE_GIT_DEPS=1`

#### Shared UI Workflow

When changing shared art style:

1. edit `gsnake-web/packages/gsnake-web-ui`
2. run `npm --prefix gsnake-web run dev` (UI watch + web app dev)
3. run `npm --prefix gsnake-editor run dev` to verify editor parity
4. build/test both packages before merge

Breaking `gsnake-web-ui` changes are allowed, but editor compatibility must be updated quickly to keep standalone CI green.

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

### Coverage Command Contract

Use exactly one package-level command per package:

- `gsnake-web`: `npm run coverage`
- `gsnake-editor`: `npm run coverage`
- `gsnake-core`: `./scripts/coverage.sh`
- `gsnake-levels`: `./scripts/coverage.sh`

Coverage report output locations are standardized:

- `gsnake-web/packages/gsnake-web-app/coverage/`
- `gsnake-editor/coverage/`
- `gsnake-core/target/llvm-cov/lcov.info`
- `gsnake-levels/target/llvm-cov/lcov.info`

### Testing CI Locally

All submodule CI workflows are designed to be compatible with [nektos/act](https://github.com/nektos/act), a tool for running GitHub Actions locally.

#### Installation

**macOS:**
```bash
brew install act
```

**Linux:**
```bash
curl -s https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
```

**Windows:**
```powershell
choco install act-cli
```

#### Usage

Test individual workflows in any submodule:

**gsnake-core (Rust):**
```bash
cd gsnake-core
act -j build    # Test build job
act -j test     # Test test job
act -j wasm     # Test WASM build job
```

**gsnake-web (TypeScript/Svelte):**
```bash
cd gsnake-web
act -j build      # Test build job
act -j typecheck  # Test typecheck job
act -j test       # Test test job
```

**gsnake-levels (Rust):**
```bash
cd gsnake-levels
act -j build  # Test build job
act -j test   # Test test job
```

**gsnake-editor (TypeScript/Svelte):**
```bash
cd gsnake-editor
act -j build      # Test build job
act -j typecheck  # Test typecheck job
act -j test       # Test test job
```

**gsnake-specs (Markdown docs):**
```bash
cd gsnake-specs
act -j markdown-lint  # Test markdown linting
act -j link-check     # Test link checking
act -j validate       # Test structure validation
```

**Root repository (all tests):**
```bash
# Run individual jobs from root repo
act -W .github/workflows/ci.yml -j build              # Test gsnake-core build
act -W .github/workflows/ci.yml -j test               # Test gsnake-core tests
act -W .github/workflows/ci.yml -j wasm               # Test WASM build
act -W .github/workflows/ci.yml -j gsnake-editor-test # Test gsnake-editor
act -W .github/workflows/ci.yml -j e2e-test           # Test E2E tests (slow)

# Or run all jobs (this will take 15+ minutes):
act -W .github/workflows/ci.yml
```

#### Known Limitations

1. **Docker requirement:** `act` requires Docker to be installed and running
2. **Cache behavior:** actions/cache may behave differently locally than on GitHub
3. **WASM build:** The WASM job in gsnake-core may be slow due to wasm-pack installation (~30-40s)
4. **Link checking:** The gsnake-specs link-check job may fail due to network issues or rate limits
5. **External repo checkouts:** Submodule test.yml workflows that checkout external repositories (gsnake-levels, gsnake-web) require a GitHub token:
   ```bash
   act -W .github/workflows/test.yml --secret GITHUB_TOKEN="your-token"
   ```
6. **E2E tests:** The root e2e-test job takes 5+ minutes due to WASM compilation, npm installs, and browser automation
7. **Cross-repo links:** The gsnake-specs link-check may report false positives for relative links to sibling submodules (../../gsnake-*/README.md) when run in standalone mode

#### Alternative: Manual Testing

If `act` is not available, you can manually test the same commands that CI runs:

**Rust projects:**
```bash
cargo build --verbose
cargo test --verbose
```

**JavaScript projects:**
```bash
npm ci
npm run build
npm run check
npm test
```

**gsnake-specs:**
```bash
npx markdownlint '**/*.md'
npx markdown-link-check README.md
```

---

Built with [Rust](https://www.rust-lang.org/) and [Svelte](https://svelte.dev/)
