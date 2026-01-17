# Technical Plan - Modular Repository Restructuring

This plan outlines the restructuring of the `gSnake` repository into a modular, submodule-ready architecture.

## Architectural Approach

The system transitions from a monolithic flat structure to a nested, workspace-oriented modular design. This enables each component to eventually function as an independent Git submodule with its own lifecycle and CI/CD pipelines.

### 1. gsnake-core (Rust Workspace)
- **Role**: The source of truth for game logic and data.
- **Structure**: A Rust workspace moved into `gsnake-core/`.
  - **engine/core**: Pure Rust game engine. Owns `data/levels.json`.
  - **engine/bindings/**: Sub-crates for platform-specific integration.
    - `wasm/`: Generates WASM bindings for web consumption (package name `gsnake-wasm`).
    - `cli/`: Terminal interface using `ratatui`.
    - `py/`: Python bindings using `pyproject.toml`.
- **Constraint**: `gsnake-core` will hold the workspace-level `Cargo.toml`. The root retains Rust config needed for integration and end-to-end tests, and must support running Rust commands from the parent directory.

### 2. gsnake-web (Svelte Frontend)
- **Role**: Standalone Svelte web application.
- **Integration**: Consumes the WASM package from `gsnake-core/engine/bindings/wasm/pkg` via local linking (`wasm-pack build` then `npm link`).
- **Constraint**: Self-contained configurations for Vite, TypeScript, and Playwright.

### 3. gsnake-python (Placeholder)
- **Role**: Placeholder boundary for future Python integration.
- **Structure**: Basic `pyproject.toml` and directory structure only (no implementation in current scope).

### 4. Root (Integration Layer)
- **Role**: Orchestration, global CI/CD, and cross-module specifications (`epics/`).
- **State**: Drastically reduced; implementation detail is delegated to sub-modules. Existing GitHub Actions remain at the root for integration testing and Svelte deployment during transition.
- **Orchestration**: Integration workflows use Python as the orchestration layer.

## Data Model

The restructuring centralizes game data within the core engine to ensure consistency across all platforms (Web, CLI, Python).

### Entity: Game Level
- **Source**: `gsnake-core/engine/core/data/levels.json` (moved from root).
- **Structure**:
  - `id`: Unique identifier (Integer).
  - `name`: Display name (String).
  - `gridSize`: Boundary dimensions (`width`, `height`).
  - `snake`: Initial body coordinates (Array of Points).
  - `obstacles`: Static collision points (Array of Points).
  - `food`: Consumable items that also act as platforms (Array of Points).
  - `exit`: Target coordinate for level completion (Point).

### Entity: Shared State (WASM/Core)
- **Interface**: Data models defined in `gsnake-core/engine/core/src/engine.rs` are serialized via `serde` for cross-boundary communication (Rust <-> TS).

## Component Architecture

The architecture enforces strict boundaries between engine logic, platform bindings, and user interfaces.

### 1. Game Engine (engine/core)
- **Responsibility**: Physics (gravity), collision detection, snake movement, and level state management.
- **Interface**: Exposed as a Rust library for consumption by bindings.

### 2. Platform Bindings (engine/bindings)
- **WASM Bridge**: Translates Rust structures to JavaScript-friendly objects using `wasm-bindgen`.
- **CLI Wrapper**: Manages terminal I/O and renders the game state using `ratatui`.
- **Python Bridge**: Provides bindings with `pyproject.toml` for Python scriptability.

### 3. Web UI (gsnake-web)
- **Responsibility**: Rendering the game grid, handling keyboard input, and managing high-level UI states (Modals, Overlays).
- **Integration Point**: `WasmGameEngine.ts` acts as the service layer between Svelte stores and the WASM binary.

### 4. CLI App (gsnake-cli)
**Responsibility**: Direct-to-terminal gameplay.
**Integration Point**: Implemented as `gsnake-core/engine/bindings/cli`, linking directly to the engine.
