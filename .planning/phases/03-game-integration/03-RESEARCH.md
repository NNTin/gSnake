# Phase 3: Game Integration - Research

**Researched:** 2026-02-10
**Domain:** Svelte reactive store integration with SVG rendering for game state visualization
**Confidence:** HIGH

## Summary

Phase 3 connects the existing SVG rendering infrastructure (Phase 2) to the live game engine through Svelte's reactive store system. The architecture leverages Svelte's auto-subscription pattern ($store syntax) to automatically re-render Cell components when the frame store updates. The game engine already emits frameChanged events through the WasmGameEngine wrapper, which updates the frame store, triggering reactive updates in GameGrid that propagate to individual Cell components via primitive CellType props.

The current implementation already has the core integration in place: GameGrid subscribes to the frame store ($frame), flattens the grid into an array of CellType primitives, and passes each value as a primitive prop to Cell.svelte. Phase 3 focuses on validating this integration works correctly with SVG rendering, implementing transparency for visual layering (using CSS opacity on SVG elements), and ensuring proper cleanup (onDestroy hooks) to prevent memory leaks.

**Primary recommendation:** The integration architecture is already complete. Focus on validation, transparency implementation (CSS opacity on SVG use elements to show layering), and memory leak prevention through proper cleanup of any new subscriptions or resources. No requestAnimationFrame is needed — the game engine's processMove() already triggers frame updates through the store subscription pattern.

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Svelte | 4.2.0 (existing) | Reactive UI framework with store subscriptions | Project's existing framework, provides automatic reactivity and cleanup through $ syntax |
| svelte/store | Built-in | Writable stores for game state management | Svelte's official state management, provides subscribe/unsubscribe pattern with automatic cleanup |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Chrome DevTools | Built-in | Memory leak detection via heap snapshots | Validation step to verify no memory leaks between level loads |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Auto-subscriptions ($store) | Manual store.subscribe() | Manual subscriptions require explicit unsubscribe in onDestroy, error-prone and verbose vs $ syntax |
| Store-based updates | requestAnimationFrame loop | RAF adds complexity and polling overhead when event-driven updates already work; game engine triggers updates on processMove() |
| CSS opacity | SVG opacity attribute | CSS and SVG opacity are equivalent, but CSS is more familiar and allows easier media queries/responsive behavior |

**Installation:**

No new dependencies required — all integration uses existing Svelte and browser APIs.

## Architecture Patterns

### Recommended Project Structure

```
gsnake-web/
├── stores/
│   └── stores.ts                # Frame store already exists, connects to WasmGameEngine
├── components/
│   ├── GameGrid.svelte          # Already subscribes to $frame, flattens grid
│   ├── Cell.svelte              # Already receives primitive CellType prop
│   └── App.svelte               # Already connects engine to stores in onMount
└── engine/
    └── WasmGameEngine.ts        # Already emits frameChanged events
```

**Current integration flow (already implemented):**
1. WasmGameEngine.processMove() → frame updates in Rust → onFrame callback
2. onFrame → emits frameChanged event
3. connectGameEngineToStores → listens for frameChanged → calls frame.set()
4. GameGrid uses $frame (auto-subscription) → rerenders when frame changes
5. GameGrid passes primitive CellType values to Cell components
6. Cell.svelte receives type prop, maps to symbol ID, renders <use> element

### Pattern 1: Svelte Store Auto-Subscription for Frame Updates

**What:** Use Svelte's $ syntax to automatically subscribe to the frame store, eliminating manual subscription management and ensuring automatic cleanup on component destruction.

**When to use:** All component-level store access in Svelte components.

**Example:**

```svelte
<!-- GameGrid.svelte (already implemented) -->
<script lang="ts">
  import { frame } from '../stores/stores';

  // Auto-subscription: Svelte subscribes and unsubscribes automatically
  $: grid = $frame?.grid ?? [];
  $: cells = grid.flat() as CellType[];
</script>

{#each cells as cell}
  <Cell type={cell} />
{/each}
```

**Source:** [Svelte Docs - Stores](https://svelte.dev/docs/svelte/stores)

### Pattern 2: Primitive Props for Performance

**What:** Pass CellType string values (primitives) to Cell components instead of object references to avoid unnecessary re-renders caused by object reference changes.

**When to use:** All prop passing from parent to child components in reactive rendering.

**Example:**

```svelte
<!-- GameGrid.svelte -->
<script lang="ts">
  // Flatten grid into primitive array
  $: cells = grid.flat() as CellType[];
</script>

{#each cells as cell}
  <!-- Pass primitive string value, not object reference -->
  <Cell type={cell} />
{/each}
```

**Why:** When a prop is an object, Svelte executes reactive declarations even if the object reference hasn't changed (equal reference problem). Primitives only trigger updates when the value actually changes.

**Source:** [GitHub Issue #4255](https://github.com/sveltejs/svelte/issues/4255)

### Pattern 3: CSS Opacity for SVG Layering

**What:** Apply CSS opacity to SVG `<use>` elements or their parent `<svg>` wrappers to create transparency effects when objects overlap on the same cell.

**When to use:** Implementing visual layering (e.g., snake over spike, both visible through transparency).

**Example:**

```svelte
<!-- Cell.svelte -->
<script lang="ts">
  export let type: CellType;
  $: symbolId = getSymbolId(type);

  // Determine opacity based on object type
  $: opacity = getOpacity(type);

  function getOpacity(t: CellType): number {
    // Example: make certain objects semi-transparent
    if (t === 'Spike' || t === 'Exit') return 0.7;
    return 1.0;
  }
</script>

<svg class="cell" viewBox="0 0 32 32" style="opacity: {opacity}">
  <use href="#{symbolId}" />
</svg>
```

**Note:** SVG opacity attribute and CSS opacity property are functionally equivalent. Unlike fill-opacity and stroke-opacity (applied per operation), opacity is a post-processing operation applied to the whole rendered object.

**Source:** [MDN - SVG opacity](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/opacity), [SVG 2 Rendering Model](https://svgwg.org/svg2-draft/render.html)

### Pattern 4: onDestroy Cleanup for Memory Leak Prevention

**What:** Use onDestroy lifecycle hook to clean up event listeners, timers, and manual subscriptions when components unmount.

**When to use:** Any component that creates resources needing cleanup (event listeners, intervals, manual subscriptions).

**Example:**

```svelte
<script lang="ts">
  import { onDestroy } from 'svelte';

  let intervalId: number;

  // If you had a timer or listener (not needed for this phase)
  // intervalId = setInterval(() => { /* ... */ }, 1000);

  onDestroy(() => {
    // Clean up resources
    if (intervalId) clearInterval(intervalId);
    // Note: $ auto-subscriptions clean up automatically
  });
</script>
```

**Important:** When using $ syntax for store subscriptions, Svelte automatically unsubscribes when the component is destroyed. Manual cleanup is only needed for resources created outside Svelte's auto-subscription system.

**Source:** [Svelte Docs - Lifecycle Hooks](https://svelte.dev/docs/svelte/lifecycle-hooks), [StudyRaid - onDestroy for cleanup](https://app.studyraid.com/en/read/6598/151188/ondestroy-for-cleanup-operations)

### Anti-Patterns to Avoid

- **Using requestAnimationFrame for frame updates:** The game engine already triggers updates through processMove() → frameChanged events → store updates. Adding RAF would create polling overhead and duplicate the event-driven system already in place.

- **Passing object props instead of primitives:** Passing grid[y][x] (if it were an object) or entire Frame objects as props causes unnecessary re-renders. Always pass primitive CellType values.

- **Manual store subscriptions in components:** Using `frame.subscribe()` instead of `$frame` requires manual unsubscribe in onDestroy and is error-prone. Always use $ syntax in components.

- **Applying will-change CSS to all cells:** will-change should only be applied to elements that are actively animating. Applying it to the entire grid increases GPU memory usage without benefit.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Store subscriptions | Custom event listeners or polling | Svelte's $ auto-subscription | Handles subscribe/unsubscribe lifecycle automatically, prevents memory leaks |
| Frame updates | requestAnimationFrame loop | WasmGameEngine's frameChanged events | Event-driven updates are more efficient than polling, engine already emits events on state changes |
| Component reactivity | Manual DOM manipulation | Svelte's reactive declarations ($:) | Svelte's compiler generates optimized update code, manual DOM updates break framework patterns |
| Memory leak detection | Custom logging or manual tracking | Chrome DevTools heap snapshots | Industry-standard tool with visual comparison, detached DOM tree detection, and memory timeline |

**Key insight:** Svelte's reactive system and store auto-subscriptions already solve the integration problem. The challenge is validation and cleanup, not building new infrastructure.

## Common Pitfalls

### Pitfall 1: Memory Leaks from Uncleaned Resources

**What goes wrong:** Creating event listeners, timers, or manual subscriptions without cleanup causes memory to accumulate when components mount/unmount repeatedly (e.g., switching levels).

**Why it happens:** onDestroy hook isn't called, or cleanup code is missing/incorrect.

**How to avoid:**
1. Use $ auto-subscriptions for stores (automatic cleanup)
2. For any manual resources, store references and clean up in onDestroy
3. Validate with DevTools: load level → take heap snapshot → switch level → take snapshot → compare for memory increase

**Warning signs:**
- Memory usage increases when switching between levels repeatedly
- DevTools shows "Detached" DOM nodes accumulating
- Performance degrades over time during gameplay

**Source:** [Chrome DevTools - Heap Snapshots](https://developer.chrome.com/docs/devtools/memory-problems/heap-snapshots)

### Pitfall 2: Object Props Triggering Unnecessary Re-renders

**What goes wrong:** Passing objects or arrays as props causes components to re-render even when the object contents haven't changed, just because the reference is different.

**Why it happens:** Svelte compares props by reference. New object instances (even with identical contents) trigger updates.

**How to avoid:**
1. Pass primitive values (strings, numbers, booleans) as props
2. If objects are necessary, create them outside the parent component or use derived stores
3. Consider `<svelte:options immutable={true}/>` if you guarantee no object mutations

**Warning signs:**
- Cell components re-render on every parent update
- DevTools Performance tab shows excessive component updates
- Frame times increase with grid size

**Source:** [Svelte Issue #4255](https://github.com/sveltejs/svelte/issues/4255), [StudyRaid - Minimize Re-renders](https://app.studyraid.com/en/read/6598/151201/minimizing-unnecessary-re-renders)

### Pitfall 3: Z-Index Expectations for SVG Layering

**What goes wrong:** Attempting to use CSS z-index to control SVG element stacking order fails because SVG uses document order (painter's model), not z-index.

**Why it happens:** Misunderstanding how SVG rendering differs from HTML elements. Z-index only works on positioned elements and creates stacking contexts, which don't apply to SVG internal elements.

**How to avoid:**
1. For multiple objects in the same cell, render multiple `<use>` elements in desired stacking order
2. Last element in DOM renders on top (document order)
3. Use CSS opacity for transparency, not z-index for layering

**Warning signs:**
- Z-index styles have no visual effect
- Objects stack incorrectly despite z-index values

**Source:** [GeeksforGeeks - Z-index in SVG](https://www.geeksforgeeks.org/html/how-to-use-z-index-in-svg-elements/), [W3C SVG Working Group](https://github.com/w3c/svgwg/issues/463)

### Pitfall 4: Missing SpriteLoader Initialization

**What goes wrong:** Cell components render before SpriteLoader has inlined the sprite sheet, causing `<use>` elements to reference non-existent symbols (empty rendering).

**Why it happens:** Race condition between SpriteLoader's fetch/mount and Cell component rendering.

**How to avoid:**
1. Render SpriteLoader before GameContainer in App.svelte (already done)
2. SpriteLoader uses onMount to fetch sprites.svg synchronously
3. Sprites have display:none so they don't appear as visible elements

**Warning signs:**
- Cells render as empty squares
- Browser console shows no errors but sprites don't appear
- DOM inspection shows `<use>` elements but symbols aren't defined

## Code Examples

Verified patterns from current codebase and official sources:

### Frame Store Connection (Current Implementation)

```typescript
// stores/stores.ts
import { writable } from "svelte/store";
import type { Frame } from "../types/models";

export const frame = writable<Frame | null>(null);

export function connectGameEngineToStores(engine: WasmGameEngine): void {
  engine.addEventListener((event: GameEvent) => {
    switch (event.type) {
      case "frameChanged":
        frame.set(event.frame);  // Updates frame store
        gameState.set(event.frame.state);
        break;
    }
  });
}
```

### Component Auto-Subscription (Current Implementation)

```svelte
<!-- GameGrid.svelte -->
<script lang="ts">
  import { frame } from '../stores/stores';
  import Cell from './Cell.svelte';

  // Auto-subscription with $ syntax
  $: grid = $frame?.grid ?? [];
  $: cells = grid.flat() as CellType[];
</script>

<div class="game-field">
  {#each cells as cell}
    <Cell type={cell} />  <!-- Primitive prop -->
  {/each}
</div>
```

### Memory Leak Prevention

```svelte
<!-- App.svelte (current pattern) -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { KeyboardHandler } from '../engine/KeyboardHandler';

  let keyboardHandler: KeyboardHandler;

  onMount(async () => {
    connectGameEngineToStores(gameEngine);
    keyboardHandler = new KeyboardHandler(gameEngine);
    keyboardHandler.attach();  // Adds window event listener
  });

  onDestroy(() => {
    if (keyboardHandler) {
      keyboardHandler.detach();  // Removes listener, unsubscribes store
    }
  });
</script>
```

### DevTools Memory Snapshot Workflow

```bash
# Manual validation in Chrome DevTools:
# 1. Open game, navigate to Memory tab
# 2. Take "Heap snapshot" (Snapshot 1)
# 3. Play level, complete/switch level
# 4. Take another "Heap snapshot" (Snapshot 2)
# 5. Change view from "Summary" to "Comparison"
# 6. Verify no significant memory increase
# 7. Search for "Detached" in Class filter to find detached DOM nodes
```

**Source:** [Chrome DevTools - Record Heap Snapshots](https://developer.chrome.com/docs/devtools/memory-problems/heap-snapshots)

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Colored div cells | SVG `<use>` elements | Phase 2 (2026-02-10) | Better visual clarity, transparency support, scalability |
| Manual store subscriptions | $ auto-subscription syntax | Svelte 3+ (standard) | Automatic cleanup, less boilerplate, fewer memory leaks |
| vite-plugin-svelte-svg | Native Vite ?url imports | Phase 2 (2026-02-10) | Vite 5 compatibility, simpler setup |
| Svelte 4 lifecycle | Svelte 5 runes ($effect) | Svelte 5 (2024+) | Not applicable - project uses Svelte 4.2.0 |

**Deprecated/outdated:**
- **xlink:href for SVG use:** Replaced by plain `href` in SVG 2 specification. Modern browsers support both, but `href` is the standard.
- **store.get() in hot paths:** Creates temporary subscription, use $ syntax or reactive declarations instead.

## Open Questions

1. **How to handle multiple objects in the same cell?**
   - What we know: Rust engine's grid stores single CellType per cell (primitive enum). Looking at engine.rs, each position gets overwritten by subsequent object placements (obstacle → spike → stone → food → snake, last writer wins).
   - What's unclear: Success criteria mentions "snake over spike, both visible through transparency" but grid only stores one CellType per cell. Current engine doesn't support multi-object cells.
   - Recommendation: Validate actual game behavior. If engine only shows top object (snake over spike = only SnakeHead visible), transparency/layering isn't needed. If transparency is required, engine would need modification (out of scope for UI-only phase). **ASSUMPTION:** Success criteria may refer to transparency of individual sprites (partial alpha channel) rather than multi-object stacking.

2. **Do falling objects trigger rapid frame updates?**
   - What we know: Engine has gravity and stone_mechanics modules. WasmGameEngine.processMove() triggers onFrame callback which emits frameChanged.
   - What's unclear: Does gravity cause automatic frame updates without player input, or only on moves?
   - Recommendation: Test during validation. If gravity auto-updates, verify 60fps performance. If not, no special handling needed.

3. **Is requestAnimationFrame needed for smooth updates?**
   - What we know: Current architecture is event-driven (processMove → frameChanged → store update). No RAF in current codebase.
   - What's unclear: Whether gravity/falling objects need RAF loop for time-based updates.
   - Recommendation: Start without RAF. Only add if testing reveals frame timing issues. Event-driven updates are more efficient than polling.

## Sources

### Primary (HIGH confidence)

- [Svelte Docs - Stores](https://svelte.dev/docs/svelte/stores) - Store contract, auto-subscriptions, $ syntax
- [Svelte Docs - Lifecycle Hooks](https://svelte.dev/docs/svelte/lifecycle-hooks) - onMount, onDestroy patterns
- [Chrome DevTools - Heap Snapshots](https://developer.chrome.com/docs/devtools/memory-problems/heap-snapshots) - Memory leak detection workflow
- [MDN - SVG opacity attribute](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/opacity) - Opacity specification and behavior
- Current codebase: stores.ts, WasmGameEngine.ts, GameGrid.svelte, Cell.svelte, App.svelte

### Secondary (MEDIUM confidence)

- [GitHub Issue #4255](https://github.com/sveltejs/svelte/issues/4255) - Object prop reference behavior
- [StudyRaid - Minimize Re-renders](https://app.studyraid.com/en/read/6598/151201/minimizing-unnecessary-re-renders) - Performance optimization patterns
- [SVG 2 Rendering Model](https://svgwg.org/svg2-draft/render.html) - Opacity post-processing behavior
- [DebugBear - JavaScript Memory Leaks](https://www.debugbear.com/blog/debugging-javascript-memory-leaks) - Detection techniques

### Tertiary (LOW confidence)

- [GeeksforGeeks - Z-index in SVG](https://www.geeksforgeeks.org/html/how-to-use-z-index-in-svg-elements/) - SVG stacking context limitations
- WebSearch results on Svelte reactivity performance - general guidance, needs project-specific validation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Using existing Svelte 4.2.0 and built-in stores, no new dependencies
- Architecture: HIGH - Integration pattern already implemented, verified in current codebase
- Pitfalls: HIGH - Memory leak detection via DevTools is industry standard, object prop behavior documented in Svelte issues

**Research date:** 2026-02-10
**Valid until:** 60 days (2026-04-11) - Svelte 4 and Chrome DevTools are stable, no major changes expected
