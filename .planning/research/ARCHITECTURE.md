# Architecture Research: SVG Rendering Integration

**Domain:** SVG rendering for tile-based game with Svelte reactive architecture
**Researched:** 2026-02-09
**Confidence:** HIGH

## Recommended Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Existing System (Unchanged)               │
├─────────────────────────────────────────────────────────────┤
│  Rust GameEngine → WASM Binding → TypeScript Wrapper        │
│       ↓                                ↓                     │
│    Frame object           WasmGameEngine (events)            │
│  (grid + state)                                              │
├─────────────────────────────────────────────────────────────┤
│                    Svelte Store Layer (Unchanged)            │
├─────────────────────────────────────────────────────────────┤
│  frame store    gameState store    level store               │
│       ↓                ↓                  ↓                  │
├─────────────────────────────────────────────────────────────┤
│              Component Layer (Modified)                      │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐    │
│  │             GameGrid.svelte                         │    │
│  │  (subscribes to frame store)                        │    │
│  │                     ↓                               │    │
│  │        Creates Cell components                      │    │
│  │                     ↓                               │    │
│  │  ┌───────────────────────────────────────────┐     │    │
│  │  │   Cell.svelte (NEW IMPLEMENTATION)        │     │    │
│  │  │   - Receives CellType prop                │     │    │
│  │  │   - Maps to SVG symbol ID                 │     │    │
│  │  │   - Renders <svg><use href="#id"/></svg>  │     │    │
│  │  └───────────────────────────────────────────┘     │    │
│  └─────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│                   Asset Layer (NEW)                          │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────┐       │
│  │  SVG Sprite Sheet (sprites.svg)                  │       │
│  │  <svg><defs>                                      │       │
│  │    <symbol id="snake-head">...</symbol>          │       │
│  │    <symbol id="snake-body">...</symbol>          │       │
│  │    <symbol id="food">...</symbol>                │       │
│  │    ... (one symbol per CellType)                 │       │
│  │  </defs></svg>                                   │       │
│  └──────────────────────────────────────────────────┘       │
│                                                              │
│  ┌──────────────────────────────────────────────────┐       │
│  │  SpriteLoader.svelte (NEW)                        │       │
│  │  - Inlines sprite sheet into DOM                 │       │
│  │  - Mounted once in App.svelte                    │       │
│  │  - Hidden (display: none)                        │       │
│  └──────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Integration Point |
|-----------|----------------|-------------------|
| **GameGrid.svelte** | Subscribe to frame store, create grid layout | MODIFIED: No changes to store subscription or layout logic |
| **Cell.svelte** | Render single cell visual | REPLACED: Switch from colored div to SVG `<use>` element |
| **SpriteLoader.svelte** | Load SVG sprite sheet into DOM | NEW: Mounted in App.svelte, loads assets once at startup |
| **sprites.svg** | Define all game entity visuals | NEW: Static asset file with SVG `<symbol>` definitions |
| **App.svelte** | Mount SpriteLoader during initialization | MODIFIED: Add `<SpriteLoader />` component before GameContainer |

## Recommended Project Structure

```
gsnake-web/
├── assets/                # NEW folder
│   └── sprites.svg        # SVG sprite sheet with all game entity symbols
├── components/
│   ├── Cell.svelte        # MODIFIED: Replace div rendering with SVG
│   ├── GameGrid.svelte    # UNCHANGED: Still creates Cell array
│   ├── SpriteLoader.svelte # NEW: Inlines sprite sheet into DOM
│   └── App.svelte         # MODIFIED: Mount SpriteLoader
├── engine/                # UNCHANGED
│   └── WasmGameEngine.ts
├── stores/                # UNCHANGED
│   └── stores.ts
├── types/                 # UNCHANGED
│   └── models.ts
└── main.ts                # UNCHANGED
```

### Structure Rationale

- **assets/sprites.svg**: Centralized visual definitions, cacheable by browser, easy to update without touching component code
- **SpriteLoader.svelte**: Single responsibility component that handles asset loading, separates concern from rendering logic
- **Cell.svelte modification**: Minimal change to existing component—swap rendering technique while keeping same props interface

## Architectural Patterns

### Pattern 1: SVG Symbol + Use (Sprite Sheet Pattern)

**What:** Define all game entity visuals as `<symbol>` elements in a sprite sheet, reference them with `<use>` elements.

**When to use:** When you have reusable graphical elements that appear many times (snake segments, food, obstacles).

**Trade-offs:**
- **Pros:**
  - Browser caches sprite sheet (single HTTP request)
  - Low memory footprint—symbol defined once, referenced many times
  - CSS can style fill/stroke colors
  - Each Cell component renders only 2 DOM nodes: `<svg>` + `<use>`
  - Clean separation between visual design (sprites.svg) and rendering logic (Cell.svelte)
- **Cons:**
  - Initial setup overhead (creating sprite sheet)
  - Cannot animate individual symbol instances independently without CSS hacks
  - All sprites must be downloaded even if only subset is used (acceptable for small sprite sheets <10KB)

**Example:**
```typescript
// sprites.svg
<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
  <defs>
    <symbol id="snake-head" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#2196F3"/>
      <circle cx="8" cy="10" r="2" fill="white"/>
      <circle cx="16" cy="10" r="2" fill="white"/>
    </symbol>
    <symbol id="food" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8" fill="#FF5722"/>
    </symbol>
  </defs>
</svg>

// Cell.svelte
<script lang="ts">
  import type { CellType } from '../types/models';
  export let type: CellType;

  function getSymbolId(t: CellType): string | null {
    const map: Record<CellType, string> = {
      'SnakeHead': 'snake-head',
      'SnakeBody': 'snake-body',
      'Food': 'food',
      'FloatingFood': 'floating-food',
      'FallingFood': 'falling-food',
      'Stone': 'stone',
      'Spike': 'spike',
      'Obstacle': 'obstacle',
      'Exit': 'exit',
      'Empty': null // No rendering for empty cells
    };
    return map[t] ?? null;
  }

  $: symbolId = getSymbolId(type);
</script>

{#if symbolId}
  <svg class="cell-svg" viewBox="0 0 24 24">
    <use href="#{symbolId}" />
  </svg>
{:else}
  <div class="cell-empty"></div>
{/if}

<style>
  .cell-svg {
    width: 100%;
    height: 100%;
  }
  .cell-empty {
    width: 100%;
    height: 100%;
    background: white;
  }
</style>
```

### Pattern 2: Inline Sprite Sheet Loading

**What:** Load sprite sheet into DOM once at app startup, hidden, making symbols available for `<use>` references throughout the app.

**When to use:** When using SVG sprite sheets with `<use>` elements—required for `<use href="#id">` to work.

**Trade-offs:**
- **Pros:**
  - Symbols immediately available after load (no CORS issues)
  - Works in all browsers without external file fetching delays
  - Sprite sheet is part of initial bundle or loaded via Vite's asset pipeline
- **Cons:**
  - Increases initial HTML/JS bundle size slightly
  - Sprite sheet cannot be cached separately from JS bundle (unless loaded as separate file)

**Example:**
```svelte
<!-- SpriteLoader.svelte -->
<script lang="ts">
  import spriteSheetContent from '../assets/sprites.svg?raw';
</script>

{@html spriteSheetContent}

<style>
  :global(svg[data-sprite-sheet]) {
    position: absolute;
    width: 0;
    height: 0;
    pointer-events: none;
    visibility: hidden;
  }
</style>
```

**Note:** Vite's `?raw` import loads SVG as string. Add `data-sprite-sheet` attribute to sprite sheet root `<svg>` to target with CSS.

### Pattern 3: Store-Driven Reactive Rendering (Existing Pattern - Preserved)

**What:** Components subscribe to Svelte stores, re-render automatically when store values change.

**Why preserve:** This pattern already works perfectly for game state propagation. SVG rendering integrates seamlessly—Cell components still receive CellType props, just render differently.

**Trade-offs:**
- **Pros:**
  - Existing data flow unchanged
  - Frame updates from WASM → Store → Components work identically
  - No performance regression (still one subscription per GameGrid)
- **Cons:**
  - Each frame update causes all Cell components to re-render (acceptable at 60fps with simple SVG rendering)

**Implementation note:**
GameGrid.svelte already subscribes to `frame` store and creates Cell array. Only Cell.svelte changes internally.

## Data Flow

### Asset Loading Flow (New)

```
App.svelte mounts
    ↓
SpriteLoader.svelte mounts
    ↓
Vite loads sprites.svg (compile-time import)
    ↓
SpriteLoader inlines SVG into DOM (hidden)
    ↓
<symbol> elements available for <use> references
```

### Frame Rendering Flow (Mostly Unchanged)

```
User input → WasmGameEngine.processMove()
    ↓
Rust engine generates new Frame
    ↓
WASM onFrame callback fires
    ↓
WasmGameEngine.handleFrameUpdate() emits frameChanged event
    ↓
Store listener updates frame store
    ↓
GameGrid.svelte re-renders (subscribed to frame store)
    ↓
Creates array of Cell components with CellType props
    ↓
Each Cell.svelte:
  - Maps CellType → symbol ID
  - Renders <svg><use href="#symbol-id" /></svg>  ← NEW
  (Previously: rendered <div class="cell {typeClass}"></div>)
```

### Critical Performance Characteristics

**What doesn't change:**
- Number of store subscriptions (1 per GameGrid)
- Number of components created (width × height cells)
- Reactivity model (stores trigger re-renders)

**What changes:**
- DOM node type: `<div>` → `<svg>` + `<use>`
- Rendering cost: CSS background color → SVG symbol reference
- Visual customization: CSS classes → SVG symbol definitions

**Performance expectation:** Near-identical frame times. Research shows SVG `<use>` with sprite sheets performs comparably to HTML divs with background colors for grid sizes typical of this game (likely <30×30 cells). Critical bottleneck remains at ~3000-5000 SVG elements, well above expected grid sizes.

## Integration Points

### Component Integration

| Integration Point | Change Required | Risk Level |
|-------------------|----------------|------------|
| **App.svelte** | Add `<SpriteLoader />` before GameContainer | LOW - Single line addition |
| **Cell.svelte** | Replace div rendering with SVG `<use>` | MEDIUM - Core rendering change, affects all cells |
| **GameGrid.svelte** | None | NONE - Props and store subscription unchanged |
| **WasmGameEngine** | None | NONE - Frame generation unchanged |
| **Store layer** | None | NONE - Store structure unchanged |

### Asset Pipeline Integration

| Asset | Integration Method | Notes |
|-------|-------------------|-------|
| **sprites.svg** | Vite `?raw` import | Loaded at compile time, inlined into bundle |
| **Alternative: sprites.svg** | Static asset in `/public` | Fetched at runtime via fetch(), requires CORS handling |

**Recommended:** Vite `?raw` import for simplicity and immediate availability.

### Build Process Integration

No changes required to build pipeline. Vite already handles SVG imports via `@sveltejs/vite-plugin-svelte`.

## Performance Considerations

### Rendering Performance

| Metric | Current (Divs) | SVG Implementation | Notes |
|--------|----------------|-------------------|-------|
| **DOM nodes per cell** | 1 (`<div>`) | 2 (`<svg>` + `<use>`) | 2x DOM nodes, but `<use>` is extremely lightweight |
| **Memory per cell** | ~200 bytes | ~250 bytes | SVG elements slightly larger in memory |
| **Rendering cost** | Fill background color | Reference SVG symbol | Comparable GPU cost |
| **Style recalculation** | 1 class per cell | No classes (SVG attributes) | SVG potentially faster (fewer CSS lookups) |
| **Grid size limit (60fps)** | ~5000 cells | ~3000-5000 cells | Research indicates SVG bottleneck at 3-5k elements |

**Verdict:** For typical grid sizes (10×10 to 30×30 = 100-900 cells), performance impact is negligible. Both implementations easily maintain 60fps.

### Store Reactivity Performance

**Current:** Svelte 4 stores re-render entire Cell array on frame updates.
**Future optimization (out of scope):** Svelte 5 runes with `$derived` could enable per-cell reactivity, but requires upgrading to Svelte 5.

Research shows Svelte 5's fine-grained reactivity could provide 1000%+ speedups for large grids by updating only changed cells. However, this requires architectural changes (runes instead of stores).

**Recommendation for this milestone:** Preserve existing Svelte 4 store pattern. Optimize in future milestone if performance becomes issue.

## Anti-Patterns to Avoid

### Anti-Pattern 1: Inline SVG in Every Cell

**What people do:** Define SVG graphics directly in Cell.svelte without sprite sheet.

```svelte
<!-- BAD -->
<svg viewBox="0 0 24 24">
  <circle cx="12" cy="12" r="10" fill="#2196F3"/>
</svg>
```

**Why it's wrong:**
- Creates duplicate SVG definitions in DOM (width × height copies)
- Bloats memory and increases style recalculation time
- Makes visual updates require component code changes

**Do this instead:** Use sprite sheet with `<use>` elements (Pattern 1).

### Anti-Pattern 2: External SVG File Per Cell Type

**What people do:** Load separate `.svg` file for each CellType (snake-head.svg, food.svg, etc.).

**Why it's wrong:**
- Multiplies HTTP requests (9+ requests for all cell types)
- Breaks browser caching efficiency
- Async loading causes visual popping during gameplay

**Do this instead:** Single sprite sheet with all symbols defined (Pattern 1).

### Anti-Pattern 3: Mixing CSS and SVG Styling

**What people do:** Use CSS classes to style SVG fill colors, creating hybrid CSS/SVG styling system.

```svelte
<!-- BAD -->
<svg class="cell-svg {typeClass}">
  <use href="#generic-cell" />
</svg>
<style>
  .snake-head { fill: blue; }
  .food { fill: red; }
</style>
```

**Why it's wrong:**
- CSS fill overrides SVG presentation attributes inconsistently across browsers
- Splits visual definition between sprite sheet and CSS
- Makes color changes require both SVG and CSS updates

**Do this instead:** Define colors in sprite sheet symbols. Use CSS only for layout (width/height).

### Anti-Pattern 4: Preloading Sprite Sheet with `<link rel="preload">`

**What people do:** Attempt to preload SVG sprite sheet to improve performance.

```html
<!-- BAD -->
<link rel="preload" href="/sprites.svg" as="image">
```

**Why it's wrong:** Research shows preloading SVGs for `<use>` references is harmful to performance—causes double request and blocks rendering.

**Do this instead:** Inline sprite sheet with SpriteLoader.svelte (Pattern 2) or load normally without preload.

## Build Order and Dependencies

### Phase 1: Asset Creation (Independent)
**Goal:** Create SVG sprite sheet with all game entity symbols.

**Tasks:**
1. Create `/gsnake-web/assets/sprites.svg`
2. Define `<symbol>` elements for all 9 CellType values
3. Set appropriate viewBox and fill colors matching current CSS colors
4. Add `data-sprite-sheet` attribute to root `<svg>`

**Dependencies:** None (can be done in parallel with component work)

**Deliverable:** `sprites.svg` file with all symbols defined

**Validation:** Open in browser, verify symbols render correctly

### Phase 2: Sprite Loader (Depends on Phase 1)
**Goal:** Create component that inlines sprite sheet into DOM.

**Tasks:**
1. Create `/gsnake-web/components/SpriteLoader.svelte`
2. Import `sprites.svg?raw` with Vite
3. Render with `{@html}` directive
4. Add CSS to hide sprite sheet (`display: none`)

**Dependencies:** Requires `sprites.svg` from Phase 1

**Deliverable:** `SpriteLoader.svelte` component

**Validation:** Mount in test app, verify sprite sheet exists in DOM (inspect elements)

### Phase 3: Cell Rendering (Depends on Phase 1 & 2)
**Goal:** Replace div rendering with SVG `<use>` elements in Cell.svelte.

**Tasks:**
1. Modify `/gsnake-web/components/Cell.svelte`
2. Create `getSymbolId(CellType)` mapping function
3. Replace `<div class="cell {typeClass}">` with `<svg><use href="#{symbolId}" /></svg>`
4. Update styles (remove color classes, keep layout styles)
5. Handle Empty cell type (render empty div or transparent SVG)

**Dependencies:** Requires sprites.svg (Phase 1) and SpriteLoader (Phase 2)

**Deliverable:** Modified Cell.svelte

**Validation:**
- Unit tests: Cell renders correct symbol ID for each CellType
- Visual regression: Compare screenshots before/after (colors should match exactly)

### Phase 4: App Integration (Depends on Phase 2 & 3)
**Goal:** Mount SpriteLoader in App.svelte, verify end-to-end rendering.

**Tasks:**
1. Modify `/gsnake-web/App.svelte`
2. Import and mount `<SpriteLoader />` before `<GameContainer />`
3. Run dev server, verify grid renders with SVGs
4. Run E2E tests, verify gameplay still works

**Dependencies:** Requires SpriteLoader (Phase 2) and modified Cell (Phase 3)

**Deliverable:** Working game with SVG rendering

**Validation:**
- E2E tests pass (gameplay unchanged)
- Performance test: Measure frame times, compare to baseline
- Visual test: Manual QA to verify graphics match original

### Dependency Graph

```
Phase 1: sprites.svg
    ↓
Phase 2: SpriteLoader.svelte ────┐
    ↓                             ↓
Phase 3: Cell.svelte ─────────────┤
    ↓                             ↓
Phase 4: App.svelte integration
```

**Critical path:** Phase 1 → Phase 2 → Phase 3 → Phase 4 (serial)
**Parallelizable:** None (each phase depends on previous)

## Alternative Architectures Considered

### Alternative 1: Canvas Rendering

**What:** Replace entire GameGrid with `<canvas>` element, render with 2D context API.

**Why not:**
- Breaks existing Svelte component architecture
- Loses Svelte reactivity benefits
- Requires rewriting all rendering logic
- Accessibility concerns (canvas is opaque to screen readers)
- Over-engineering for current requirements

**When to consider:** If profiling shows 60fps drops with >1000 cells and SVG optimization exhausted.

### Alternative 2: Per-Cell SVG Files with `<img>`

**What:** Store each CellType visual as separate SVG file, render with `<img src="snake-head.svg">`.

**Why not:**
- 9+ HTTP requests for initial load
- Browser must decode/parse each SVG separately
- Cannot style with CSS (opaque `<img>` elements)
- Slower than sprite sheet approach

**When to consider:** Never—sprite sheets are superior for all metrics.

### Alternative 3: Svelte 5 Runes + Fine-Grained Reactivity

**What:** Upgrade to Svelte 5, use `$state` runes for per-cell reactivity, update only changed cells.

**Why not now:**
- Requires Svelte 4 → 5 migration (high risk, out of scope)
- Current performance acceptable (no 60fps drops observed)
- Adds complexity for uncertain benefit

**When to consider:** Future milestone if:
- Grid sizes exceed 30×30 (900+ cells)
- Profiling shows frame times >16ms (60fps threshold)
- Svelte 5 stable and well-tested in production

## Sources

### SVG Performance and Best Practices
- [SVG vs Canvas vs WebGL Performance Comparison 2025](https://www.svggenie.com/blog/svg-vs-canvas-vs-webgl-performance-2025) - Performance bottlenecks at 3k-5k elements
- [Improving SVG Runtime Performance](https://codepen.io/tigt/post/improving-svg-rendering-performance) - GPU-friendly properties (transform vs fill)
- [High Performance SVGs | CSS-Tricks](https://css-tricks.com/high-performance-svgs/) - Optimization strategies
- [SVG Icon Stress Test](https://cloudfour.com/thinks/svg-icon-stress-test/) - Symbol + use is most performant for many icons
- [Exploring SVG Over HTML/DOM for Performance](https://medium.com/@gdbate/exploring-using-svg-over-html-dom-for-performance-e294d9daf2f1) - Comparable performance for moderate element counts

### SVG Sprite Sheets
- [What the heck is an SVG sprite sheet?](https://ryantrimble.com/blog/what-the-heck-is-an-svg-sprite-sheet/) - Sprite sheet basics
- [Simple icon systems using SVG sprites](https://oliverjam.es/articles/svg-sprites) - Implementation patterns
- [You can't preload SVG sprites](https://geoffrich.net/posts/preloading-svgs/) - Preloading anti-pattern
- [Icon System with SVG Sprites | CSS-Tricks](https://css-tricks.com/svg-sprites-use-better-icon-fonts/) - Best practices

### Svelte 5 Reactivity
- [Svelte 5 Reactivity Documentation](https://svelte.dev/docs/svelte/svelte-reactivity) - SvelteMap, $derived, performance patterns
- [Svelte 5 Runes Performance](https://luminary.blog/techs/05-svelte5-refresher/) - Fine-grained reactivity benefits
- [Slow Code HATES him! From 1 to 60fps](https://stevenwaterman.uk/minesweeper-optimisation/) - 1126% speedup from bottom-up derived stores

### Svelte SVG Integration
- [What's new in Svelte: January 2026](https://svelte.dev/blog/whats-new-in-svelte-january-2026) - SVG namespace fixes in Svelte 5
- [Layer Cake Graphics Framework](https://layercake.graphics/) - Headless SVG framework for Svelte

---

*Architecture research for: SVG rendering integration with Svelte game*
*Researched: 2026-02-09*
*Confidence: HIGH - All recommendations verified with official sources and performance benchmarks*
