# Testing Patterns

**Analysis Date:** 2026-02-09

## Test Framework

**Runner:**
- Framework: Vitest 1.0+ (gsnake-web) and 4.0+ (gsnake-editor)
- Config files: `vitest.config.ts` in each package
- Assertion Library: Vitest built-in (compatible with Jest syntax)

**Environment Setup:**
- gsnake-web: `node` environment with jsdom per-test override
- gsnake-editor: `jsdom` environment with node override per-test
- Svelte support: Enabled via `@testing-library/svelte` in editor
- Plugin support: WASM (`vite-plugin-wasm`), Svelte (`@sveltejs/vite-plugin-svelte`)

**Run Commands:**
```bash
npm test              # Run all tests once
npm run test:watch   # Watch mode for development
npm run coverage     # Generate coverage report (alias for test:coverage)
npm run test:coverage # Full coverage with thresholds
npm run test:ui      # UI test runner (gsnake-editor only)
```

## Test File Organization

**Location:**
- Co-located with source files using `tests/` subdirectory at package root
- gsnake-web: `/gsnake-web/tests/` with subdirectories `unit/`, `contract/`
- gsnake-editor: `/gsnake-editor/src/tests/` alongside source in `src/`

**Naming:**
- Pattern: `[SourceName].test.ts`
- Examples: `stores.test.ts`, `KeyboardHandler.test.ts`, `types.test.ts`
- Describe blocks: Full path/feature name (e.g., "stores.connectGameEngineToStores")

**Structure:**
```
gsnake-web/
├── tests/
│   ├── unit/           # Unit tests (isolated components)
│   │   ├── stores.test.ts
│   │   ├── KeyboardHandler.test.ts
│   │   └── WasmGameEngine.test.ts
│   └── contract/       # Contract/fixture tests
│       ├── fixtures.test.ts
│       ├── types.test.ts
│       └── enums.test.ts

gsnake-editor/
└── src/tests/
    ├── types.test.ts
    ├── server.test.ts
    ├── EditorLayout.gridInteractions.test.ts
    ├── EditorLayout.saveLoad.test.ts
    └── LandingPage.test.ts
```

## Test Structure

**Suite Organization:**

```typescript
// @vitest-environment jsdom  // Override default environment if needed
import { beforeEach, describe, expect, it, vi } from "vitest";
import { get } from "svelte/store";
// ... imports

describe("Feature Name", () => {
  let engine: EngineStub;
  let handler: KeyboardHandler;

  beforeEach(() => {
    // Reset state and recreate fresh instances
    engine = createEngineStub();
    handler = new KeyboardHandler(engine as never);
  });

  afterEach(() => {
    // Cleanup: detach handlers, restore mocks
    handler.detach();
    vi.restoreAllMocks();
  });

  it("describes expected behavior", () => {
    // Arrange
    const event = createEvent("ArrowUp");

    // Act
    handler.handleKeyPress(event);

    // Assert
    expect(engine.processMove).toHaveBeenCalledWith("North");
  });
});
```

**Patterns:**
- `beforeEach()`: Creates fresh instances, resets stores, clears state
- `afterEach()`: Unsubscribes from stores, detaches event listeners, restores mocks
- Test isolation: Each test is completely independent

## Mocking

**Framework:** Vitest built-in with `vi` object

**Patterns:**

```typescript
// Stub class for complex dependencies
class FakeEngine {
  private listener: GameEventListener | null = null;

  addEventListener(listener: GameEventListener): void {
    this.listener = listener;
  }

  emit(event: GameEvent): void {
    this.listener?.(event);
  }
}

// Mock function stub
function createEngineStub() {
  return {
    processMove: vi.fn(),
    restartLevel: vi.fn(),
    loadLevel: vi.fn(),
  };
}
```

**What to Mock:**
- External dependencies (game engine, APIs, WASM modules)
- Objects with side effects (event emitters, stores)
- Browser APIs when needed (Window, localStorage)
- Never mock the code being tested

**What NOT to Mock:**
- Code under test (always test real implementation)
- Pure utility functions
- Type assertions (pass through as-is)
- Store subscriptions when testing store behavior

**Assertions:**
- Vitest syntax: `expect(value).toBe()`, `toHaveBeenCalledWith()`, `toEqual()`
- Store assertions: Use `get(store)` to extract current value, then assert
- Event assertions: Check `event.defaultPrevented`, mock `vi.fn()` calls

## Fixtures and Factories

**Test Data:**

```typescript
// Factory pattern for creating test objects
function createLevel(id: number): LevelDefinition {
  return {
    id,
    name: `Level ${id}`,
    difficulty: "easy",
    gridSize: { width: 4, height: 4 },
    snake: [{ x: 1, y: 1 }],
    obstacles: [],
    food: [{ x: 2, y: 2 }],
    exit: { x: 3, y: 3 },
    snakeDirection: "East",
    // ... other fields with defaults
  };
}

function createFrame(status: Frame["state"]["status"] = "Playing"): Frame {
  return {
    grid: [
      ["SnakeHead", "SnakeBody", "Empty", "Empty"],
      // ... complete grid structure
    ],
    state: {
      status,
      currentLevel: 1,
      moves: 5,
      foodCollected: 1,
      totalFood: 2,
    },
  };
}

// Reset utilities
function resetStores(): void {
  level.set(null);
  frame.set(null);
  engineError.set(null);
  snakeLength.set(0);
  gameState.set({ /* defaults */ });
}
```

**Location:**
- Factories defined at top of test file (before `describe` block)
- Shared fixtures in `tests/fixtures/` directory (JSON files)
- Contract tests load fixtures: `loadFixture<T>(filename: string): T`

**Fixture Files:**
- Located: `gsnake-web/tests/fixtures/` and `gsnake-editor/tests/fixtures/`
- Format: JSON matching TypeScript interfaces
- Examples: `frame.json`, `level.json`, `error-*.json`

## Coverage

**Requirements:**
- gsnake-web: 80% line and statement threshold
- gsnake-editor: 80% line and statement threshold
- Coverage enforced in CI as required merge gate

**Thresholds Configuration:**

```typescript
// gsnake-web/vitest.config.ts
coverage: {
  provider: "v8",
  reporter: ["text", "json-summary", "json", "html", "lcov"],
  reportsDirectory: "coverage",
  all: true,
  include: [
    "App.svelte",
    "components/**/*.svelte",
    "engine/**/*.ts",
    "stores/**/*.ts",
  ],
  exclude: ["**/*.d.ts", "tests/**", "**/*.test.ts"],
  thresholds: {
    lines: 80,
    statements: 80,
    functions: 30,
    branches: 45,
  },
}
```

**View Coverage:**
```bash
npm run coverage        # Generate reports
# Opens in browser: coverage/index.html
```

## Test Types

**Unit Tests:**
- Scope: Individual functions, methods, stores
- Approach: Isolate with mocks, test behavior not implementation
- Location: `tests/unit/`
- Examples: `stores.test.ts`, `KeyboardHandler.test.ts`
- Pattern: Create stubs, invoke method, assert results

**Integration Tests:**
- Scope: Multiple modules working together
- Approach: Mix real and mocked components, test flows
- Location: `gsnake-editor/src/tests/` (Svelte component tests)
- Examples: `EditorLayout.gridInteractions.test.ts`, `server.test.ts`
- Pattern: Render component, simulate user actions, verify DOM changes

**Contract Tests:**
- Scope: Validate data structures match Rust contracts
- Approach: Load fixtures, verify types and field names
- Location: `gsnake-web/tests/contract/`
- Examples: `fixtures.test.ts`, `types.test.ts`
- Pattern: Load JSON, type-cast, validate structure and naming

**E2E Tests:**
- Framework: Playwright with Allure reporting
- Config: `playwright.config.ts` (root)
- Location: `e2e/` directory
- Commands: `npm run test:e2e`
- Not Vitest-based; separate from unit/integration tests

## Common Patterns

**Async Testing:**

```typescript
it("should return success with { success: true }", async () => {
  const response = await request(app)
    .post("/api/test-level")
    .send(validLevelData)
    .expect(200);

  expect(response.body).toEqual({ success: true, message: "..." });
});
```

**Error Testing:**

```typescript
it("should reject malformed payloads", async () => {
  const response = await request(app)
    .post("/api/test-level")
    .send({ ...validData, id: "bad-id" })
    .expect(400);

  expect(response.body).toMatchObject({ error: "Invalid level payload" });
  expect(response.body.details).toBeInstanceOf(Array);
});
```

**Event Handler Testing:**

```typescript
it("moves in playing state and prevents default for arrow keys", () => {
  const event = createEvent("ArrowUp");

  handler.handleKeyPress(event);

  expect(event.defaultPrevented).toBe(true);
  expect(engine.processMove).toHaveBeenCalledWith("North");
});
```

**Svelte Component Testing:**

```typescript
it("supports placement and shift-click removal interactions on the grid", async () => {
  const { container } = render(EditorLayout, {
    gridWidth: 5,
    gridHeight: 5,
    initialLevelData: null,
  });

  const snakeHead = getGridCell(container, 0, 0);
  await fireEvent.click(snakeHead);

  expect(snakeHead).toHaveClass("is-snake-segment");
  expect(snakeHead).toHaveTextContent("H");
});
```

**HTTP/API Testing with Supertest:**

```typescript
it("should return the stored payload", async () => {
  // First store
  await request(app).post("/api/test-level").send(validLevelData).expect(200);

  // Then retrieve
  const response = await request(app).get("/api/test-level").expect(200);

  expect(response.body).toEqual(validLevelData);
});
```

**Store Testing:**

```typescript
it("updates level on levelChanged events", () => {
  const engine = new FakeEngine();
  const currentLevel = createLevel(1);

  connectGameEngineToStores(engine as never);
  engine.emit({ type: "levelChanged", level: currentLevel });

  expect(get(level)).toEqual(currentLevel);  // Use get() to extract store value
});
```

## Special Notes

**Environment Override:**
- Add `// @vitest-environment jsdom` at top of test file to override config
- Used when node environment needs DOM APIs or vice versa
- Example: `stores.test.ts` uses jsdom for store + DOM interactions

**Debugging:**
- Use `expect(...).toMatchObject()` for partial assertions
- Print fixture files with `.json` extension for clarity
- Check `test-results/` directory for failure details and artifacts
- Leverage browser console via `window.__gsnakeContract` debug flag (add `?contractTest=1` to URL)

---

*Testing analysis: 2026-02-09*
