# Technology Stack

**Analysis Date:** 2026-02-09

## Languages

**Primary:**
- TypeScript 5.2-5.9.3 - Used in gsnake-web, gsnake-editor for frontend development
- Rust (stable channel) - Used in gsnake-core for game engine logic, compiled to WebAssembly
- JavaScript (ES modules) - Supporting runtime for Node.js tools and build scripts

**Secondary:**
- Python 3 - Used for build scripts (e.g., `scripts/generate_ts_types.py`, `scripts/build_wasm.py`)
- Bash - Used for build automation and CI/CD workflows

## Runtime

**Environment:**
- Node.js 20 (specified in CI workflows)
- Rust stable toolchain with wasm32-unknown-unknown target

**Package Manager:**
- npm (primary) - Version management via `package.json`
- Cargo (Rust) - Workspace monorepo defined in `/home/nntin/git/gSnake/gsnake-core/Cargo.toml`
- Lockfiles: `package-lock.json` (npm) and `Cargo.lock` (Rust)

## Frameworks

**Core:**
- Svelte 4.2.0 (gsnake-web) and Svelte 5.43.8 (gsnake-editor) - UI framework for interactive components
- Express 5.2.1 - API server for gsnake-editor test-level endpoint (`/api/test-level`)
- Vite 5.0.0 (gsnake-web) and Vite 7.2.4 (gsnake-editor) - Build tool and dev server

**Testing:**
- Vitest 1.0.0 (gsnake-web) and Vitest 4.0.18 (gsnake-editor) - Test runner for unit/integration tests
- Playwright 1.41.0 - E2E testing framework at root level (`playwright.config.ts`)
- Testing Library - svelte (@testing-library/svelte 5.3.1) for component testing
- Happy DOM 20.4.0 and jsdom 24.1.3-27.4.0 - DOM environments for testing

**Build/Dev:**
- wasm-pack - Builds Rust code to WebAssembly
- tsx 4.21.0 - TypeScript executor for running `.ts` files (gsnake-editor server)
- Prettier 3.8.1 - Code formatting (gsnake-editor)
- ESLint 9.39.2 with TypeScript support - Linting (gsnake-editor)
- svelte-check - Svelte component type checking

## Key Dependencies

**Critical:**
- wasm-bindgen 0.2 - Bridges Rust/WebAssembly with JavaScript in `gsnake-core/engine/bindings/wasm`
- serde 1.0 and serde_json 1.0 - Serialization across Rust and TypeScript layers
- ts-rs 7.0 - Automatic TypeScript type generation from Rust structs
- gsnake-wasm - Local file dependency in gsnake-web pointing to `../gsnake-core/engine/bindings/wasm/pkg`

**Infrastructure:**
- cors 2.8.6 - CORS middleware for Express API server
- concurrently 9.2.1 - Runs multiple npm scripts in parallel (dev mode)
- allure-playwright 2.10.0 - Test reporting for E2E tests
- ratatui 0.28 - Terminal UI framework for gsnake-cli
- crossterm 0.28 - Terminal manipulation for CLI
- anyhow 1.0 - Error handling in Rust
- clap 4.5 - CLI argument parsing (gsnake-levels, gsnake-cli)

## Configuration

**Environment:**
- Vite environment variables with `VITE_` prefix
- `VITE_BASE_PATH` - Dynamic routing for GitHub Pages deployment (main/ or version-specific)
- `VITE_GSNAKE_WEB_URL` - E2E test configuration for web URL
- Node environment detection (CI=true in workflows)

**Build:**
- `vite.config.ts` in gsnake-web and gsnake-editor - Vite configuration
- `tsconfig.json` files - TypeScript configuration per workspace
- `vitest.config.ts` - Vitest configuration
- `playwright.config.ts` - E2E test configuration (root level)
- `.prettierrc` in gsnake-editor - Prettier formatting rules (semi, singleQuote, tabWidth)
- Cargo workspace with unified settings in `/home/nntin/git/gSnake/gsnake-core/Cargo.toml`
- `rust-toolchain.toml` - Specifies stable Rust channel

## Platform Requirements

**Development:**
- Node.js 20
- Rust stable (with wasm32-unknown-unknown target for WebAssembly)
- wasm-pack (installed via curl in CI)
- Python 3 (for build scripts)

**Production:**
- GitHub Pages (static hosting at nntin.xyz/gSnake)
- GitHub Actions (CI/CD via workflows in `.github/workflows/`)
- Deployment via `peaceiris/actions-gh-pages` action

---

*Stack analysis: 2026-02-09*
