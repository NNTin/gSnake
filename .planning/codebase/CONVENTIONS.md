# Coding Conventions

**Analysis Date:** 2026-02-09

## Naming Patterns

**Files:**
- Components: PascalCase with `.svelte` extension (e.g., `KeyboardHandler.ts`, `GameGrid.svelte`, `EditorLayout.svelte`)
- Store files: lowercase with descriptive name (e.g., `stores.ts`, `levelModel.ts`)
- Test files: match source name with `.test.ts` suffix (e.g., `stores.test.ts`, `KeyboardHandler.test.ts`)
- Modal components: PascalCase suffixed with `Modal` (e.g., `GameOverModal.svelte`, `LevelLoadErrorModal.svelte`)

**Functions:**
- camelCase for all functions and methods (e.g., `processMove()`, `connectGameEngineToStores()`, `buildLevelExportPayload()`, `handleFrameUpdate()`)
- Private methods prefixed with private keyword (e.g., `private handlePlayingState()`)
- Event handlers prefixed with "handle" (e.g., `handleKeyPress()`, `handleFrameUpdate()`)
- Type guard functions use "is" prefix (e.g., `isValidLevelId()`, `isContractError()`)
- Factory/builder functions use imperative verb (e.g., `createLevel()`, `createFrame()`, `generateLevelId()`)

**Variables:**
- camelCase for all variable names (e.g., `gameState`, `snakeLength`, `engineError`, `levelSelectorOpen`)
- Boolean stores suffixed with action verb (e.g., `levelSelectorOpen`, `levelLoadError`)
- Constants in UPPER_SNAKE_CASE with underscores for large numbers (e.g., `UINT32_MAX = 4_294_967_295`)
- Private instance variables prefixed with `#` or use `private` keyword (e.g., `private keyMap`, `private listeners`)

**Types:**
- Interfaces: PascalCase prefixed with "I" optional but common (e.g., `LevelDefinition`, `Frame`, `ContractError`, `GameEvent`)
- Type aliases: PascalCase (e.g., `Direction`, `GameStatus`, `Difficulty`)
- Union types: TitleCase names (e.g., `RuntimeSnakeDirection = "North" | "South" | "East" | "West"`)

## Code Style

**Formatting:**
- Tool: Prettier with `.prettierrc`
- Configuration: `gsnake-editor/.prettierrc`
  - Semi-colons required: `"semi": true`
  - Double quotes required: `"singleQuote": false`
  - Tab width: 2 spaces
  - Trailing commas: ES5 style
  - Print width: 100 characters
- All code must pass prettier formatting (checked via CI)

**Linting:**
- Tool: ESLint with flat config in `eslint.config.js` (gsnake-editor)
- Recommended rules: TypeScript ESLint recommended + Svelte recommended
- Ignores: `dist/`, `build/`, `.svelte-kit/`, `node_modules/`
- Additional checks: JavaScript recommended rules + TypeScript strict rules
- Svelte files: Parsed with TypeScript parser for consistent type handling

**TypeScript Configuration:**
- `target: ES2022` (editor) or `ESNext` (web)
- `strict: true` for both packages
- `checkJs: true` - JavaScript files checked for type safety
- `isolatedModules: true` - Each file treated independently for compilation
- `forceConsistentCasingInFileNames: true`
- No implicit any

## Import Organization

**Order:**
1. Type imports from external libraries (e.g., `import type { Frame } from "gsnake-wasm"`)
2. Value imports from external libraries (e.g., `import { writable } from "svelte/store"`)
3. Type imports from relative paths (e.g., `import type { GameEvent } from "../types/events"`)
4. Value imports from relative paths (e.g., `import { KeyboardHandler } from "./KeyboardHandler"`)

**Path Aliases:**
- Relative imports use `../` notation, no path aliases configured
- Examples: `../types/models`, `../stores/stores`, `../engine/WasmGameEngine`

**Type-only imports:**
- Use `import type` syntax consistently (e.g., `import type { ContractError, Frame } from "../types/models"`)
- Separate type and value imports on different lines

## Error Handling

**Patterns:**
- Errors normalized to `ContractError` type with `{ kind, message, context? }`
- Error handler methods use fallback kind/message: `handleContractError(error, fallbackMessage, fallbackKind)`
- Type guard for contract errors: `private isContractError(error: unknown): error is ContractError`
- Normalization: Extract error detail, wrap in context object if needed
- Examples:
  - `WasmGameEngine.ts` lines 181-223: Comprehensive error normalization
  - `KeyboardHandler.test.ts` lines 13-19: Stub creation with mocked methods for error testing

**Logging:**
- `console.warn()` for non-critical issues (e.g., "WasmGameEngine already initialized")
- `console.error()` for critical issues with structured output: `` `[ContractError:${kind}] ${message}` ``
- Error context included in console output for debugging

## Comments

**When to Comment:**
- Multi-step algorithms: number steps (e.g., "1. Check Modifiers", "2. Prevent Defaults")
- Non-obvious logic: explain "why" not "what" (e.g., "Avoid zero to keep IDs truthy across tools")
- Critical patterns: document assumptions (e.g., "The onFrame callback only fires when processMove() is called")
- See `engine/CLAUDE.md` for architecture-specific patterns and initialization requirements

**JSDoc/TSDoc:**
- Sparingly used, primarily for public APIs
- Function-level comments for complex control flow (see `KeyboardHandler.ts` lines 33-95)
- Not consistently applied across all files; focus on clarity over documentation

## Function Design

**Size:**
- Typical functions 20-50 lines
- Methods handling state transitions can be slightly longer (KeyboardHandler state handlers)
- Complex logic broken into private helper methods

**Parameters:**
- Use object parameters for multiple related values (e.g., `handleKeyPress(event: KeyboardEvent)`)
- Type all parameters strictly
- Consider using discriminated unions for state-dependent functions (e.g., different handlers per game status)

**Return Values:**
- Functions returning `void` for event handlers (e.g., `handleKeyPress()`, `addEventListener()`)
- Functions returning specific types for pure functions (e.g., `isValidLevelId(): boolean`)
- Async functions return `Promise<void>` or `Promise<T>`
- Errors thrown explicitly rather than returning null/undefined

## Module Design

**Exports:**
- Named exports for classes and functions (e.g., `export class KeyboardHandler`)
- Named exports for types (e.g., `export type GameEvent`)
- Store values exported as named exports (e.g., `export const gameState = writable(...)`)
- No default exports

**Barrel Files:**
- Not extensively used; imports typically direct to specific modules
- Example structure: `stores.ts` exports multiple stores in one file

**Class Design:**
- Private instance variables with clear initialization in constructor
- Public methods for interface, private methods for implementation
- Constructor dependency injection (e.g., `constructor(private gameEngine: WasmGameEngine)`)
- Subscriptions and event listeners managed explicitly (stored as fields for cleanup)

## Svelte-Specific Patterns

**Component Structure:**
- Script section: types, reactive variables, event handlers
- HTML template: reactive bindings with `{#if}`, `{#each}` blocks
- Inline event handlers: `on:click={handleClick}` pattern
- Store subscriptions: imported stores used directly with auto-unsubscribe

**Props:**
- All props defined with `let` statements (Svelte 5 style)
- Type annotations on all props (e.g., `let gridWidth: number`)
- Props passed as component arguments on render (test-friendly)

## Test File Conventions

**Structure:**
- `describe()` blocks nest by feature/component
- `beforeEach()` for setup, `afterEach()` for cleanup
- `it()` blocks for individual test cases with clear descriptions
- Helper functions at top of file (factories, setup utils)

**Mocking:**
- Fake/stub classes created in test files (e.g., `FakeEngine` in stores.test.ts)
- `vi.fn()` for Vitest mocks in unit tests
- Complete mock implementations for complex dependencies
- No external mocking libraries (vitest built-in used exclusively)

**Snapshots:**
- Not heavily used; prefer explicit assertions
- Focus on behavior verification over structure verification

---

*Convention analysis: 2026-02-09*
