# Architecture

**Analysis Date:** 2026-02-09

## Pattern Overview

**Overall:** Modular monorepo with clear separation between game engine (Rust), web UI (Svelte), level editor (Svelte), and level management tools. The architecture follows a **layered pattern** with platform-specific bindings.

**Key Characteristics:**
- Multi-package monorepo with git submodule dependencies
- Rust game engine compiled to WebAssembly (WASM) for browser execution
- Platform-specific bindings: WASM for web/editor, CLI for standalone
- Svelte 5 for UI layer with reactive stores for state management
- Type-safe JavaScript generated from Rust using ts-rs
- Clear separation of concerns: game logic, UI rendering, level persistence

## Layers

**Core Engine Layer:**
- Purpose: Implements all game logic, physics (gravity, movement), and rules
- Location: `gsnake-core/engine/core/src/`
- Contains: `GameEngine`, `LevelState`, physics handlers, level parsing
- Depends on: Rust standard library, serde for serialization
- Used by: WASM binding layer, CLI binding, gsnake-levels tools

**WASM Binding Layer:**
- Purpose: Exposes Rust game engine to JavaScript via WebAssembly
- Location: `gsnake-core/engine/bindings/wasm/src/lib.rs`
- Contains: `WasmGameEngine` (wrapper struct), JS-friendly interfaces, error serialization
- Depends on: Core engine, wasm-bindgen, serde-wasm-bindgen, js-sys
- Used by: gsnake-web, gsnake-editor
- Package: Built to `gsnake-core/engine/bindings/wasm/pkg/` and installed as `gsnake-wasm`

**TypeScript Wrapper Layer (gsnake-web/engine):**
- Purpose: Provides TypeScript interface around WASM engine, manages event dispatching
- Location: `gsnake-web/engine/`
- Contains: `WasmGameEngine` (TypeScript), `KeyboardHandler`, `CompletionTracker`
- Depends on: gsnake-wasm package, game types
- Used by: Svelte components, stores
- Key classes:
  - `WasmGameEngine`: Wraps WASM module, emits typed events (levelChanged, frameChanged, engineError)
  - `KeyboardHandler`: Translates keyboard input to game moves, handles game state-based key handling
  - `CompletionTracker`: Persists completed level IDs to localStorage

**State Management Layer (gsnake-web/stores):**
- Purpose: Centralized reactive state for game UI
- Location: `gsnake-web/stores/stores.ts`
- Contains: Svelte writable stores for gameState, frame, engineError, availableLevels, completedLevels
- Depends on: Svelte stores API, event types from engine
- Used by: All Svelte components
- Key stores: `gameState`, `frame`, `level`, `engineError`, `availableLevels`, `completedLevels`

**UI Component Layer (gsnake-web/components, gsnake-editor/src/lib):**
- Purpose: Renders game and editor interfaces
- Location: `gsnake-web/components/`, `gsnake-editor/src/lib/`
- Contains: Svelte components for game grid, modals, UI controls
- Depends on: Stores, types, game engine context
- Reactive subscriptions: Components subscribe to store changes and re-render on updates

**Level Persistence Layer (gsnake-editor/server.ts):**
- Purpose: Express server for level data exchange during testing/development
- Location: `gsnake-editor/server.ts`
- Contains: REST endpoints for POST/GET test levels, payload validation
- Depends on: Express, CORS middleware
- Used by: gsnake-editor frontend for load/save workflows, gsnake-web for test level loading
- Ports: 3001 (Express server)

**Level Definition & Data Layer (gsnake-levels):**
- Purpose: Manages level definitions, rendering, and playback analysis
- Location: `gsnake-levels/src/`, `gsnake-levels/levels/`
- Contains: Rust CLI tools, level JSON files, render scripts
- Depends on: gsnake-core for level validation
- Used by: Manual level creation, automated level rendering/testing

## Data Flow

**Game Initialization Flow:**

1. `App.svelte` (gsnake-web) mounts and calls `WasmGameEngine.init()`
2. `WasmGameEngine.init()` loads WASM module via `init_wasm()`, obtains level definitions via `getLevels()`
3. Engine loads initial level by index, calls `loadLevelByIndex()` which:
   - Creates new `RustEngine` (Rust GameEngine via WASM)
   - Registers onFrame callback: `wasmEngine.onFrame((frame) => { this.handleFrameUpdate(frame) })`
   - Explicitly calls `getFrame()` to emit initial frame (critical for grid rendering)
   - Emits `levelChanged` event with level definition
4. Store subscription in App.svelte receives levelChanged event, updates `level` store
5. Components subscribe to `level` and `frame` stores, re-render on updates

**Move Processing Flow:**

1. `KeyboardHandler` captures key press → translates to Direction enum
2. Calls `gameEngine.processMove(direction)`
3. `WasmGameEngine.processMove()` calls Rust engine `process_move()`
4. Rust engine validates move, updates game state, triggers gravity/physics
5. Rust engine generates new Frame (grid + GameState)
6. WASM binding's onFrame callback fires with new Frame
7. TypeScript WasmGameEngine calls `this.handleFrameUpdate(frame)`
8. Event listener triggers with `frameChanged` event
9. Store subscription receives event → updates `gameState` and `frame` stores
10. Components re-render based on store changes

**Level Editor Save/Load Flow:**

1. Editor frontend (`EditorLayout.svelte`) builds `LevelData` from grid cells
2. User clicks Save → sends POST to `server.ts:/api/test-level` with level payload
3. Server validates payload (LevelPayload validation)
4. Server stores level in memory with timestamp
5. Editor frontend fetches from GET `/api/test-level`
6. Server returns stored level data
7. Editor restores UI state from loaded data

**State Management:**

- Stores are the source of truth for UI rendering
- Game engine events propagate to stores via event listener connection
- No bidirectional binding: UI reads from stores, writes only through engine methods
- localStorage persists completion state via `CompletionTracker`
- Contract debug mode exposes frame/error state via `window.__gsnakeContract` when `?contractTest=1`

## Key Abstractions

**GameEngine (Rust):**
- Purpose: Core simulation engine that manages all game logic
- Examples: `gsnake-core/engine/core/src/engine.rs`
- Pattern: Stateful object that processes moves and generates frames

**Frame (Data Contract):**
- Purpose: Immutable snapshot of game state and visual grid at a point in time
- Pattern: Contains 2D grid (CellType[][]) and GameState; generated after each move
- Critical: Frame must be explicitly fetched after initialization to render grid

**LevelDefinition (Data Contract):**
- Purpose: JSON-serializable definition of a level's initial state
- Pattern: Contains grid size, entities (snake, food, obstacles, exit, etc.), and level metadata
- Used by: Engine initialization, UI display, level editor, persistence

**GameEvent (Type Union):**
- Purpose: Strongly-typed events emitted by game engine to UI
- Pattern: Discriminated union: frameChanged, levelChanged, engineError
- Allows strict type-checking in store update handlers

**CellType (Enum):**
- Purpose: Represents contents of a single grid cell
- Values: Empty, SnakeHead, SnakeBody, Food, Obstacle, Exit, FloatingFood, FallingFood, Stone, Spike
- Generated from Rust via ts-rs into `gsnake-web/types/models.ts`

## Entry Points

**gsnake-web (Game Player):**
- Location: `gsnake-web/main.ts`
- Triggers: `npm run dev` (Vite dev server on port 3000), or `npm run build` (production build)
- Responsibilities: Mounts Svelte App component, initializes game engine, connects keyboard input
- Dependencies: WASM engine via gsnake-wasm package, Svelte components

**gsnake-editor (Level Editor):**
- Location: `gsnake-editor/src/main.ts` (frontend), `gsnake-editor/server.ts` (backend)
- Triggers: `npm run dev` (Vite on 3003 + Express on 3001), or `npm run build`
- Responsibilities: Frontend mounts App component for level editing; backend serves test level API
- Dependencies: Frontend uses Svelte, backend uses Express

**gsnake-levels (Level Tools):**
- Location: `gsnake-levels/src/main.rs`
- Triggers: `cargo run --release`, or direct binary execution
- Responsibilities: CLI tool for managing level definitions, rendering levels to images, analyzing playback
- Dependencies: gsnake-core engine, Rust ecosystem

**gsnake-core (Engine):**
- Location: `gsnake-core/Cargo.toml` (workspace)
- Triggers: Built as part of WASM binding or CLI binding
- Responsibilities: Houses core game engine, physics, level parsing, type definitions
- Dependencies: serde, ts-rs for type generation

## Error Handling

**Strategy:** Contract-based error propagation with typed error objects

**Patterns:**

- **WASM Layer:** Rust errors converted to `ContractError` JS objects via `contract_error_from_data()`
- **TypeScript Layer:** WASM errors caught and emitted as `engineError` game events
- **Store Layer:** `engineError` store holds the current error state; cleared on successful frame update
- **UI Layer:** Error modals (EngineErrorModal, LevelLoadErrorModal) subscribe to error stores
- **Validation:** Input validation at server layer (gsnake-editor/server.ts), level schema validation in both Rust and TypeScript

**Error Types** (from `gsnake-web/types/models.ts`):
- `invalidInput`: Move or input rejected by engine
- `inputRejected`: Valid move rejected (e.g., 180-degree turn)
- `serializationFailed`: Frame/state serialization error
- `initializationFailed`: WASM module or level init failed
- `internalError`: Unexpected engine error

## Cross-Cutting Concerns

**Logging:**
- Browser console logging via console.error/warn/log in TypeScript wrapper
- Rust panic messages via console-error-panic-hook (enabled in WASM build)
- Server logging via console.log in Express middleware

**Validation:**
- Rust-side: All level definitions parsed and validated by core engine before use
- TypeScript-side: Input validation in `App.svelte` for custom level loading, keyboard input filtering
- Server-side: LevelPayload validation with detailed error messages in Express routes

**Authentication:**
- Not applicable; single-player game with no backend auth
- CORS configured in editor server for localhost development only

**State Persistence:**
- localStorage for completion state (CompletionTracker)
- Server in-memory storage for test levels (1-hour expiration)
- No database; all persistence is client-side or ephemeral

---

*Architecture analysis: 2026-02-09*
