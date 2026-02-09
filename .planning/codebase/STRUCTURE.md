# Codebase Structure

**Analysis Date:** 2026-02-09

## Directory Layout

```
gSnake/ (root monorepo)
├── gsnake-core/            # Rust game engine (core logic)
│   ├── engine/
│   │   ├── core/           # Core GameEngine implementation
│   │   │   └── src/
│   │   │       ├── lib.rs
│   │   │       ├── engine.rs
│   │   │       ├── models.rs (CellType, GameState, Direction, etc.)
│   │   │       ├── gravity.rs
│   │   │       ├── stone_mechanics.rs
│   │   │       └── levels.rs
│   │   ├── bindings/
│   │   │   ├── wasm/       # WASM binding (WebAssembly)
│   │   │   │   └── src/lib.rs
│   │   │   └── cli/        # CLI binding (standalone)
│   │   └── data/
│   │       └── levels.json (embedded default levels)
│   └── Cargo.toml (workspace config)
├── gsnake-web/             # Web game UI (Svelte)
│   ├── engine/
│   │   ├── WasmGameEngine.ts (TypeScript wrapper around WASM)
│   │   ├── KeyboardHandler.ts (input handling)
│   │   └── CompletionTracker.ts (localStorage persistence)
│   ├── stores/
│   │   └── stores.ts (Svelte reactive state)
│   ├── components/
│   │   ├── App.svelte (root component, engine initialization)
│   │   ├── GameContainer.svelte
│   │   ├── GameGrid.svelte
│   │   ├── Cell.svelte
│   │   ├── GameCompleteModal.svelte
│   │   ├── GameOverModal.svelte
│   │   ├── LevelSelectorOverlay.svelte
│   │   └── ... (other modals/controls)
│   ├── types/
│   │   ├── models.ts (generated from Rust via ts-rs)
│   │   └── events.ts (GameEvent union type)
│   ├── tests/
│   │   ├── unit/
│   │   │   ├── WasmGameEngine.test.ts
│   │   │   ├── KeyboardHandler.test.ts
│   │   │   ├── CompletionTracker.test.ts
│   │   │   └── stores.test.ts
│   │   └── contract/
│   │       ├── types.test.ts
│   │       ├── enums.test.ts
│   │       └── fixtures.test.ts
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── main.ts (Svelte app entry point)
├── gsnake-editor/          # Level editor (Svelte + Express)
│   ├── src/
│   │   ├── main.ts (entry point, mount App)
│   │   ├── App.svelte (root, page routing)
│   │   ├── lib/
│   │   │   ├── EditorLayout.svelte (main editor grid/controls)
│   │   │   ├── LandingPage.svelte (create/load landing)
│   │   │   ├── GridCanvas.svelte
│   │   │   ├── GridSizeModal.svelte
│   │   │   ├── SaveLevelModal.svelte
│   │   │   ├── HelpModal.svelte
│   │   │   ├── EntityPalette.svelte
│   │   │   ├── levelModel.ts (LevelData, LevelExportPayload, helpers)
│   │   │   └── types.ts (EntityType, GridCell, etc.)
│   │   └── tests/
│   │       ├── integration.test.ts
│   │       ├── server.test.ts
│   │       ├── types.test.ts
│   │       ├── EditorLayout.gridInteractions.test.ts
│   │       ├── EditorLayout.saveLoad.test.ts
│   │       └── LandingPage.test.ts
│   ├── server.ts (Express server for test-level API)
│   ├── public/
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── vite.config.ts
├── gsnake-levels/          # Level management tools (Rust CLI)
│   ├── src/
│   │   └── main.rs
│   ├── levels/             # Level JSON definitions
│   ├── renders/            # Rendered level images
│   ├── playbacks/          # Recorded gameplay data
│   ├── Cargo.toml
│   └── tests/
├── gsnake-python/          # Python integration (experimental)
├── gsnake-specs/           # Documentation/specifications (git submodule)
├── e2e/                    # End-to-end tests (Playwright)
│   └── fixtures/
├── scripts/
│   ├── ralph/              # CI/build orchestration
│   └── test/
├── .github/
│   └── workflows/          # GitHub Actions CI/CD
├── .planning/
│   └── codebase/           # GSD codebase documentation
├── vite.config.ts (root, not used)
├── playwright.config.ts (E2E test config)
├── package.json (workspace root, only test scripts)
└── README.md
```

## Directory Purposes

**gsnake-core/engine/core:**
- Purpose: Core game engine implementation in Rust
- Contains: GameEngine state machine, physics handlers (gravity, stones), level parsing, enums/types
- Key files: `engine.rs` (main game loop), `models.rs` (data types), `gravity.rs`, `stone_mechanics.rs`
- Generated: None (source of truth)
- Committed: Yes

**gsnake-core/engine/bindings/wasm:**
- Purpose: WebAssembly binding layer; exposes Rust engine to JavaScript
- Contains: WasmGameEngine wrapper struct, WASM FFI definitions
- Key files: `lib.rs` (WASM exports), `Cargo.toml` with wasm-bindgen dependencies
- Generated: `pkg/` directory built during build (contains .wasm binary, .d.ts, .js)
- Committed: Only source; built artifacts in `pkg/` are .gitignored

**gsnake-web/engine:**
- Purpose: TypeScript wrapper and utilities around WASM engine
- Contains: Event emission logic, keyboard input handling, localStorage utilities
- Key files: `WasmGameEngine.ts` (wraps WASM, emits events), `KeyboardHandler.ts`, `CompletionTracker.ts`
- Not generated; pure source code

**gsnake-web/stores:**
- Purpose: Svelte reactive state store definitions
- Contains: writable stores for game state, frame, levels, errors
- Key files: `stores.ts` (all store definitions and event listener connection)
- Pattern: All stores imported and subscribed to by components

**gsnake-web/components:**
- Purpose: Svelte UI components for game player
- Contains: Game grid, modals, buttons, score display
- Key files: `App.svelte` (initialization), `GameContainer.svelte`, `GameGrid.svelte`, `Cell.svelte`
- Pattern: Component subscription pattern; each component has reactive let binding to store values

**gsnake-web/types:**
- Purpose: TypeScript type definitions for game data
- Key files: `models.ts` (generated from Rust via ts-rs), `events.ts` (GameEvent type)
- Generated: `models.ts` auto-generated during WASM build; do not edit manually

**gsnake-web/tests:**
- Purpose: Unit and contract tests for game logic and types
- Subdirectories:
  - `unit/`: Tests for WasmGameEngine wrapper, KeyboardHandler, stores, etc.
  - `contract/`: Tests verifying Rust types match TypeScript (fixtures.test.ts, types.test.ts)
- Config: `vite.config.ts` doesn't exist; uses default Vitest via package.json test script

**gsnake-editor/src/lib:**
- Purpose: Editor components and business logic
- Key files: `EditorLayout.svelte` (main editor), `levelModel.ts` (export/import helpers), `types.ts` (editor-specific types)
- Pattern: Editor uses `GridCell[][]` model (row/col based); exports to `LevelExportPayload` for runtime compatibility

**gsnake-editor/server.ts:**
- Purpose: Express server for test level API during E2E testing
- Endpoints: POST/GET `/api/test-level` with validation
- Starts on port 3001 when run directly; exported for testing with `resetTestLevelForTests()`

**gsnake-levels/src:**
- Purpose: Rust CLI tools for level management
- Contains: CLI binary, level rendering, playback analysis
- Pattern: Uses gsnake-core as dependency; validates and processes level JSON

**e2e/:**
- Purpose: End-to-end tests using Playwright
- Contains: Test specs for game flow, editor, contract boundaries
- Config: `playwright.config.ts` at root; tests run via `npm run test:e2e` from root

## Key File Locations

**Entry Points:**
- `gsnake-web/main.ts`: Mounts Svelte App, initializes game (npm run dev, port 3000)
- `gsnake-editor/src/main.ts`: Mounts editor App (npm run dev:editor, port 3003)
- `gsnake-editor/server.ts`: Express test-level server (npm run dev:server, port 3001)
- `gsnake-core/engine/core/src/lib.rs`: Exports public types and engine module

**Configuration:**
- `gsnake-web/vite.config.ts`: Vite build config (includes WASM and top-level-await plugins)
- `gsnake-editor/vite.config.ts`: Vite build config (Svelte only)
- `gsnake-core/Cargo.toml`: Rust workspace definition
- `tsconfig.json` (both gsnake-web and gsnake-editor): TypeScript config

**Core Logic:**
- `gsnake-core/engine/core/src/engine.rs`: GameEngine implementation (process_move, game rules)
- `gsnake-core/engine/core/src/models.rs`: Rust type definitions (CellType, GameState, Direction)
- `gsnake-web/engine/WasmGameEngine.ts`: TypeScript wrapper (event emission, initialization)
- `gsnake-web/stores/stores.ts`: Svelte store definitions and event listener connection

**Testing:**
- `gsnake-web/tests/`: Vitest unit and contract tests
- `gsnake-editor/src/tests/`: Vitest tests for editor logic
- `e2e/`: Playwright E2E tests (run from root)
- `playwright.config.ts`: E2E test configuration at root

## Naming Conventions

**Files:**
- `.ts` - TypeScript source files
- `.svelte` - Svelte component files
- `.rs` - Rust source files
- `.test.ts` - Vitest unit/integration test files (colocated with source)
- `.toml` - Cargo manifest files
- CamelCase for component names: `GameGrid.svelte`, `EditorLayout.svelte`
- camelCase for utility files: `levelModel.ts`, `stores.ts`

**Directories:**
- kebab-case for workspace package names: `gsnake-web`, `gsnake-editor`, `gsnake-core`
- snake_case for Rust modules: `engine`, `stone_mechanics`, `gravity`
- PascalCase component folders (if organizing by feature): Not used; flat in `components/`
- lowercase for generic dirs: `src`, `tests`, `engine`, `stores`, `types`

**Classes/Types:**
- PascalCase for classes and types: `WasmGameEngine`, `KeyboardHandler`, `CompletionTracker`, `GameState`, `CellType`
- UPPER_SNAKE_CASE for constants: `STORAGE_KEY`, `MAX_FRAME_CELLS`, `UINT32_MAX`

**Functions:**
- camelCase for methods and functions: `processMove`, `loadLevel`, `getFrame`, `markCompleted`
- Verb-first pattern for action functions: `handleKeyPress`, `processMove`

## Where to Add New Code

**New Feature (Game Logic):**
- Primary code: `gsnake-core/engine/core/src/engine.rs` or new module in `gsnake-core/engine/core/src/`
- Tests: `gsnake-core/engine/core/tests/` (new .rs files)
- Rebuild WASM binding: `cd gsnake-core/engine/bindings/wasm && wasm-pack build`
- TypeScript types will auto-generate into `gsnake-web/types/models.ts`

**New UI Component (gsnake-web):**
- Implementation: `gsnake-web/components/[ComponentName].svelte`
- Tests: `gsnake-web/tests/unit/[ComponentName].test.ts` or `tests/integration/[ComponentName].test.ts`
- Import from stores: `import { frame, gameState } from '../stores/stores'`
- Subscribe pattern: `let $frame` (auto-subscription) or `frame.subscribe(f => {...})`

**New Editor Feature (gsnake-editor):**
- UI: `gsnake-editor/src/lib/[FeatureName].svelte`
- Logic: `gsnake-editor/src/lib/[featureName]Model.ts`
- Tests: `gsnake-editor/src/tests/[FeatureName].test.ts`
- Import types from: `./types.ts` (EntityType, GridCell) and `./levelModel.ts` (LevelData, LevelExportPayload)

**New Utility/Helper:**
- Shared Rust utilities: `gsnake-core/engine/core/src/utils/` (new file, add mod declaration in `lib.rs`)
- Shared TypeScript utilities: `gsnake-web/lib/` (create if needed) or colocate in feature file
- Type-safe utilities: Place in same directory as usage

**Shared Types (gsnake-web & gsnake-editor):**
- Editor uses custom types: `gsnake-editor/src/lib/types.ts` (EntityType, GridCell, Direction)
- Game uses runtime types: `gsnake-web/types/models.ts` (LevelDefinition, GameState, CellType)
- Never duplicate; editor's `LevelExportPayload` must match game's `LevelDefinition` structure
- Validation happens at editor save-time and at server/engine load-time

**Tests:**
- Colocate tests near source: `src/[module].test.ts` pattern
- Unit tests: Test individual functions/classes in isolation
- Integration tests: Test component interactions, store updates
- Contract tests: Verify Rust↔TypeScript type/enum compatibility
- E2E tests: `e2e/` directory, use Playwright API

## Special Directories

**gsnake-core/engine/bindings/wasm/pkg/:**
- Purpose: Built WASM binary and JavaScript bindings
- Generated: Yes, by `wasm-pack build`
- Committed: No (.gitignored)
- How to regenerate: `cd gsnake-core/engine/bindings/wasm && wasm-pack build --target bundler`

**gsnake-web/dist/ & gsnake-editor/dist/:**
- Purpose: Production build outputs
- Generated: Yes, by `vite build`
- Committed: No (.gitignored)

**gsnake-web/node_modules/ & gsnake-editor/node_modules/:**
- Purpose: npm dependencies
- Generated: Yes, by `npm install`
- Committed: No (.gitignored)

**gsnake-core/target/:**
- Purpose: Rust build artifacts
- Generated: Yes, by `cargo build`
- Committed: No (.gitignored)

**gsnake-levels/levels/:**
- Purpose: Stored level JSON definitions
- Generated: Partially (some auto-generated from renders)
- Committed: Yes (source of truth for game levels)

**gsnake-specs/:**
- Purpose: Documentation, specifications, requirements (git submodule)
- Generated: No
- Committed: Yes (separate git repo)

**.planning/codebase/:**
- Purpose: GSD codebase documentation (architecture, structure, conventions, concerns)
- Generated: No (manually written by GSD agents)
- Committed: Yes

## Architecture Patterns by Location

**Data Models:**
- Rust: `gsnake-core/engine/core/src/models.rs` (source of truth)
- Generated TypeScript: `gsnake-web/types/models.ts` (via ts-rs)
- Editor: `gsnake-editor/src/lib/types.ts` (editor-specific, LevelData format)

**Event System:**
- Engine: `gsnake-web/engine/WasmGameEngine.ts` (emit frameChanged, levelChanged, engineError)
- Listener: `gsnake-web/stores/stores.ts` (connectGameEngineToStores function)
- Subscribers: All components use store subscriptions

**State Management:**
- No Redux/Pinia; pure Svelte stores (writable)
- Single store subscription in App.svelte via `connectGameEngineToStores()`
- Stores are single source of truth for UI

**Build System:**
- Vite for web/editor frontend (HMR, fast builds)
- Cargo for Rust packages
- wasm-pack for WASM binding (produces NPM package in pkg/)
- Preinstall hooks (detect-local-deps.js) for monorepo dependency resolution

---

*Structure analysis: 2026-02-09*
