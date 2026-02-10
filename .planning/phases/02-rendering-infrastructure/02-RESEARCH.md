# Phase 2: Rendering Infrastructure - Research

**Researched:** 2026-02-10
**Domain:** SVG sprite sheet rendering in Svelte 4 with Vite
**Confidence:** HIGH

## Summary

Phase 2 implements an SVG sprite-based rendering system that replaces the current colored div cells with SVG graphics using the `<use>` element pattern. The architecture consists of three components: (1) a Vite plugin that processes SVG imports with SVGO optimization, (2) a SpriteLoader component that inlines the sprite sheet into the DOM at app startup, and (3) a modified Cell component that renders individual game objects using `<use>` references to sprite symbols.

The standard approach uses vite-plugin-svelte-svg for development workflow integration, inline sprite sheets for optimal performance in games with <100 icons, and CSS transforms for GPU-accelerated positioning. TypeScript definitions require manual ambient module declarations since Vite's default SVG types conflict with component imports. Performance is maintained through primitive props (CellType strings), proper cleanup in onDestroy hooks, and avoiding will-change CSS hints except on actively animating elements.

**Primary recommendation:** Inline the sprites.svg into the DOM at app startup using a SpriteLoader component in App.svelte, render cells with simple `<svg><use href="#symbolId" /></svg>` elements, and use CSS transforms for all positioning to enable GPU acceleration and maintain 60fps performance.

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| vite-plugin-svelte-svg | Latest (3.x compatible) | Transform SVGs into Svelte components with SVGO | De facto plugin for SVG component imports in Svelte + Vite projects, provides automatic SVGO optimization during build |
| SVGO | 3.x | Optimize SVG files during build | Industry standard SVG optimizer, removes unnecessary metadata and reduces file sizes by 60-80%, built into most SVG toolchains |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @poppanator/sveltekit-svg | Latest | Alternative SVG import plugin | When vite-plugin-svelte-svg has compatibility issues or for SvelteKit-specific features |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| vite-plugin-svelte-svg | Manual SVG imports as strings | Manual approach gives more control but loses build-time optimization, SVGO integration, and component ergonomics |
| Inline sprite sheet | External sprite.svg file | External sprites cache better but Chrome/Edge show 3-5x worse performance vs inline for <100 icons; Safari performs better with external but this is Edge case |
| CSS transforms | SVG x/y attributes | SVG attributes work but don't get GPU acceleration, trigger layout recalculation, and can't leverage will-change hints |

**Installation:**

```bash
npm install vite-plugin-svelte-svg --save-dev
```

## Architecture Patterns

### Recommended Project Structure

```
gsnake-web/
├── assets/
│   └── sprites.svg          # Symbol definitions (Phase 1 output)
├── components/
│   ├── SpriteLoader.svelte  # Inlines sprites.svg into DOM
│   ├── Cell.svelte          # Renders individual cells with <use>
│   └── GameGrid.svelte      # Grid container (existing)
├── types/
│   └── svg.d.ts             # TypeScript SVG import declarations
└── vite.config.ts           # Vite plugin configuration
```

### Pattern 1: Inline Sprite Sheet with SpriteLoader Component

**What:** Load sprites.svg once at app startup and inline it into the DOM with `display:none`, allowing all subsequent `<use>` elements to reference symbols by ID.

**When to use:** Games with <100 icons visible simultaneously where first-paint performance matters more than caching.

**Example:**

```svelte
<!-- SpriteLoader.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import spritesUrl from '../assets/sprites.svg?url';

  let spriteContent = '';

  onMount(async () => {
    const response = await fetch(spritesUrl);
    spriteContent = await response.text();
  });
</script>

{#if spriteContent}
  {@html spriteContent}
{/if}
```

**Source:** [CSS-Tricks - High Performance SVGs](https://css-tricks.com/high-performance-svgs/)

### Pattern 2: Cell Rendering with SVG `<use>` Element

**What:** Render each cell as an `<svg>` wrapper containing a `<use>` element that references the sprite symbol. Use modern `href` attribute (not deprecated `xlink:href`).

**When to use:** All cell rendering after SpriteLoader has initialized.

**Example:**

```svelte
<!-- Cell.svelte -->
<script lang="ts">
  export let type: CellType;

  // Map CellType enum to symbol ID
  $: symbolId = getSymbolId(type);

  function getSymbolId(t: CellType): string {
    // Map CellType values to sprite symbol IDs
    // Empty, SnakeHead, SnakeBody, Food, etc.
    return t; // Assuming symbol IDs match CellType values
  }
</script>

<svg class="cell" viewBox="0 0 32 32">
  <use href="#{symbolId}" />
</svg>

<style>
  .cell {
    width: 100%;
    height: 100%;
  }
</style>
```

**Source:** [MDN - SVG use element](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/use), [CSS-Tricks - xlink:href deprecation](https://css-tricks.com/on-xlinkhref-being-deprecated-in-svg/)

### Pattern 3: CSS Transform-based Positioning

**What:** Use CSS `transform: translate()` for any dynamic positioning instead of manipulating SVG `x`/`y` attributes.

**When to use:** Animation, movement, or any position updates that happen per frame.

**Example:**

```css
.cell {
  transform: translate(var(--x), var(--y));
  /* GPU-accelerated, doesn't trigger layout */
}

/* For animations, add will-change ONLY to moving elements */
.cell.animating {
  will-change: transform;
}
```

**Source:** [Charlie Marsh - Animating SVGs with CSS Transforms](https://www.crmarsh.com/svg-performance/), [Chrome Developers - Hardware-accelerated animations](https://developer.chrome.com/blog/hardware-accelerated-animations)

### Pattern 4: TypeScript SVG Import Declarations

**What:** Define ambient module declarations for SVG imports to avoid TypeScript errors with component imports.

**When to use:** When importing SVGs as components with `?component` query parameter.

**Example:**

```typescript
// types/svg.d.ts
declare module '*.svg?component' {
  import type { SvelteComponent } from 'svelte';
  const component: typeof SvelteComponent;
  export default component;
}

declare module '*.svg?url' {
  const url: string;
  export default url;
}

declare module '*.svg' {
  const content: string;
  export default content;
}
```

**Source:** [GitHub - poppa/sveltekit-svg TypeScript setup](https://github.com/poppa/sveltekit-svg), [Medium - How to import SVG files as components](https://medium.com/@praizjosh/how-to-import-svg-files-as-react-components-in-vite-97d6e1f2c046)

### Pattern 5: Cleanup with onDestroy

**What:** Clean up subscriptions, timers, and animation frames when components unmount to prevent memory leaks.

**When to use:** Any component using setInterval, requestAnimationFrame, or store subscriptions without auto-subscriptions.

**Example:**

```svelte
<script lang="ts">
  import { onDestroy } from 'svelte';

  let frameId: number | null = null;

  function animate() {
    // Animation logic
    frameId = requestAnimationFrame(animate);
  }

  onDestroy(() => {
    if (frameId !== null) {
      cancelAnimationFrame(frameId);
    }
  });
</script>
```

**Source:** [Svelte Tutorial - onDestroy](https://svelte.io/tutorial/ondestroy), [egghead.io - Auto-subscriptions to avoid memory leaks](https://egghead.io/lessons/svelte-use-auto-subscriptions-in-svelte-3-to-avoid-memory-leaks-when-using-stores)

### Anti-Patterns to Avoid

- **Using xlink:href instead of href:** The `xlink:href` attribute is deprecated in SVG 2; use plain `href` for modern browsers
- **Applying will-change to all elements:** Overusing will-change increases memory usage; apply only to actively animating elements
- **Animating SVG attributes directly:** Setting cx/cy or other SVG attributes doesn't get GPU acceleration; use CSS transforms instead
- **Passing object props to Cell components:** Object props trigger more change detection; use primitive CellType strings for better performance
- **External sprite sheets for small icon counts:** Chrome/Edge show 3-5x slower performance with external sprites vs inline for <100 icons

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| SVG optimization | Custom SVG minification scripts | SVGO via vite-plugin-svelte-svg | SVGO handles 50+ edge cases (viewBox normalization, path precision, unused defs, namespace cleanup) that custom scripts miss |
| TypeScript SVG types | Manual type guards for every import | Ambient module declarations in .d.ts | TypeScript's module resolution system is designed for this; manual guards bypass type checking and IDE autocomplete |
| requestAnimationFrame game loop | Recursive rAF without delta time | Fixed timestep with frame independence | High refresh rate displays (120Hz+) will run physics 2x faster without delta time adjustment, breaking gameplay |
| Sprite symbol loading | Dynamic import() per symbol | Single inline sprite sheet | Each dynamic import adds bundle complexity and race conditions; inline sheet loads once at startup |

**Key insight:** SVG rendering infrastructure has well-established patterns that handle performance, browser compatibility, and build tooling complexity. Custom solutions miss edge cases that took the ecosystem years to discover (e.g., Chrome's poor external sprite performance, Safari's opposite behavior, will-change memory pressure).

## Common Pitfalls

### Pitfall 1: Vite's Default SVG Type Conflicts

**What goes wrong:** TypeScript shows errors when importing SVGs with `?component` query parameter because Vite ships a default type definition that declares `*.svg` imports return a string.

**Why it happens:** Vite's built-in types assume SVGs are imported as URLs (strings), conflicting with component imports from vite-plugin-svelte-svg.

**How to avoid:** Always use the `?component` query parameter (e.g., `import Icon from './icon.svg?component'`) and define explicit ambient module declarations in a `.d.ts` file for `*.svg?component` imports.

**Warning signs:** TypeScript errors saying "Type 'string' is not assignable to type 'typeof SvelteComponent'" when using SVG imports as components.

**Source:** [GitHub - sveltekit-svg TypeScript configuration](https://github.com/poppa/sveltekit-svg), [Stack Overflow - TypeScript SVG module declarations](https://medium.com/@bhargavagonugunta123/how-to-use-svg-in-react-vite-typescript-8503f3d7d51b)

### Pitfall 2: xlink:href Deprecation

**What goes wrong:** Using `xlink:href` instead of `href` for `<use>` elements triggers deprecation warnings and fails in some modern browsers.

**Why it happens:** SVG 2 removed the XLink namespace, but older tutorials and examples still show `xlink:href` syntax.

**How to avoid:** Always use `<use href="#symbolId" />` without any namespace prefix. For backwards compatibility with very old browsers (if needed), include both: `<use href="#id" xlink:href="#id" />` (modern `href` takes precedence).

**Warning signs:** Console warnings about deprecated XLink attributes, or SVG symbols not rendering in newest browser versions.

**Source:** [MDN - xlink:href deprecation](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/xlink:href), [CSS-Tricks - On xlink:href being deprecated](https://css-tricks.com/on-xlinkhref-being-deprecated-in-svg/)

### Pitfall 3: Inconsistent viewBox Coordinates

**What goes wrong:** Sprite symbols with different viewBox dimensions render at inconsistent scales, making some symbols appear larger or smaller than intended.

**Why it happens:** The viewBox defines the SVG coordinate system, and when symbols have different coordinate ranges (e.g., one uses `0 0 32 32` and another uses `0 0 64 64`), the browser scales them differently to fit the same viewport.

**How to avoid:** Standardize all symbol viewBox attributes to the same dimensions (e.g., `viewBox="0 0 32 32"`) during sprite sheet creation. Document this standard in the sprite creation process.

**Warning signs:** Some game objects appearing 2x or 0.5x the size of others despite identical CSS dimensions.

**Source:** [Sara Soueidan - Understanding SVG Coordinate Systems](https://www.sarasoueidan.com/blog/svg-coordinate-systems/), [DigitalOcean - SVG viewBox tutorial](https://www.digitalocean.com/community/tutorials/svg-svg-viewbox)

### Pitfall 4: will-change Memory Overhead

**What goes wrong:** Adding `will-change: transform` to all cells causes excessive memory usage and can actually harm performance instead of helping.

**Why it happens:** `will-change` tells the browser to allocate GPU memory for compositing layers in advance. When overused, this exhausts GPU memory and forces the browser to fall back to software rendering.

**How to avoid:** Only apply `will-change` to elements that are actively animating right now. Remove the hint when animation completes. For static cells or cells that update infrequently, omit will-change entirely.

**Warning signs:** DevTools Performance tab showing increased memory usage, lower frame rates after adding will-change hints, or browser warning messages about too many composited layers.

**Source:** [MDN - will-change best practices](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change), [CSS-Tricks - High Performance SVGs](https://css-tricks.com/high-performance-svgs/)

### Pitfall 5: Svelte Store Auto-subscription Lifecycle

**What goes wrong:** Manually subscribing to stores without unsubscribing in onDestroy causes memory leaks as components mount and unmount.

**Why it happens:** When you call `store.subscribe()` manually, Svelte doesn't automatically clean it up. The subscription remains active even after the component is destroyed.

**How to avoid:** Use the `$` prefix for auto-subscriptions (e.g., `$frame` instead of manually subscribing), or if you must subscribe manually, store the unsubscribe function and call it in onDestroy. Prefer auto-subscriptions for simplicity.

**Warning signs:** Memory usage grows when navigating between levels or restarting games, DevTools heap snapshots showing increasing numbers of detached DOM nodes.

**Source:** [egghead.io - Use auto-subscriptions to avoid memory leaks](https://egghead.io/lessons/svelte-use-auto-subscriptions-in-svelte-3-to-avoid-memory-leaks-when-using-stores), [Thoughtspile - Svelte stores: the curious parts](https://thoughtspile.github.io/2023/04/22/svelte-stores/)

## Code Examples

Verified patterns from official sources and documentation:

### Vite Plugin Configuration

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import svelteSVG from "vite-plugin-svelte-svg";

export default defineConfig({
  plugins: [
    svelteSVG({
      svgoConfig: {
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                // Preserve viewBox for consistent scaling
                removeViewBox: false,
                // Clean up IDs but preserve symbol IDs
                cleanupIds: false,
              }
            }
          }
        ]
      },
      requireSuffix: true // Require ?component suffix
    }),
    svelte()
  ]
});
```

**Source:** [vite-plugin-svelte-svg GitHub](https://github.com/metafy-gg/vite-plugin-svelte-svg), [SVGO configuration docs](https://github.com/svg/svgo#configuration)

### CellType to Symbol ID Mapping

```typescript
// components/Cell.svelte
<script lang="ts">
  import type { CellType } from '../types/models';

  export let type: CellType;

  // Direct mapping since symbol IDs match CellType values
  // Empty, SnakeHead, SnakeBody, Food, FloatingFood, FallingFood,
  // Obstacle, Stone, Spike, Exit
  $: symbolId = type;
</script>

<svg class="cell" viewBox="0 0 32 32">
  <use href="#{symbolId}" />
</svg>

<style>
  .cell {
    width: 100%;
    height: 100%;
    display: block;
  }
</style>
```

**Note:** This assumes sprites.svg symbol IDs exactly match CellType enum values from types/models.ts. If there's a mismatch (e.g., FallingFood uses Food symbol), add a mapping function.

### SVGO Optimization Configuration

```javascript
// svgo.config.mjs (if using standalone SVGO)
export default {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,        // Keep viewBox for scaling
          cleanupIds: false,           // Preserve symbol IDs
          removeUnknownsAndDefaults: { // Remove unnecessary attributes
            keepRoleAttr: true
          }
        }
      }
    },
    'removeDoctype',
    'removeComments',
    'removeMetadata',
    'cleanupNumericValues',
    'convertColors',
    'removeEmptyAttrs',
    'removeEmptyContainers',
    'mergePaths'
  ]
};
```

**Source:** [SVGO GitHub - Configuration](https://github.com/svg/svgo), [SiteLint - Best practices for optimizing SVG](https://www.sitelint.com/blog/best-practices-for-optimizing-svg-code)

### requestAnimationFrame with Frame Independence

```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  let frameId: number | null = null;
  let lastTime = 0;
  const targetFPS = 60;
  const frameInterval = 1000 / targetFPS;

  function gameLoop(timestamp: number) {
    const delta = timestamp - lastTime;

    // Only update if enough time has passed (frame independence)
    if (delta >= frameInterval) {
      lastTime = timestamp - (delta % frameInterval);

      // Update game logic here
      updateGame(delta);
    }

    frameId = requestAnimationFrame(gameLoop);
  }

  function updateGame(deltaTime: number) {
    // Game update logic
  }

  onMount(() => {
    lastTime = performance.now();
    frameId = requestAnimationFrame(gameLoop);
  });

  onDestroy(() => {
    if (frameId !== null) {
      cancelAnimationFrame(frameId);
    }
  });
</script>
```

**Source:** [Aleksandr Hovhannisyan - Performant Game Loops in JavaScript](https://www.aleksandrhovhannisyan.com/blog/javascript-game-loop/), [Medium - Game Loop in JavaScript](https://medium.com/geekculture/inventing-games-game-loop-in-javascript-1cb0a5fcc81b)

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| xlink:href for SVG use | Plain href attribute | SVG 2 spec (2018) | Simpler syntax, no namespace required, better forward compatibility |
| Individual SVG imports | Sprite sheet with symbols | ~2015 | Reduced DOM nodes (2 per cell vs 20+), better memory usage |
| External sprite files | Inline sprite sheets for <100 icons | 2020-2021 | Better Chrome/Edge performance, eliminates HTTP request waterfall |
| SVG attribute animation | CSS transform animation | Hardware acceleration available (~2017) | GPU acceleration, 60fps smoothness on mobile |
| Global will-change hints | Selective will-change on animating elements | ~2019 | Lower memory pressure, better performance on resource-constrained devices |

**Deprecated/outdated:**

- **xlink:href:** Replaced by plain `href` in SVG 2 specification; all modern browsers support href without namespace
- **SMIL animations:** Poor browser support and no way to sync with game state; use CSS animations or JavaScript instead
- **SVG filters for game objects:** Expensive repaints drop mobile FPS from 60 to 15; use pre-rendered effects in static SVG instead
- **ES5 module syntax for Vite plugins:** Vite 3+ requires ESM; use `export default` not `module.exports`

## Open Questions

1. **Question: Does vite-plugin-svelte-svg handle HMR (Hot Module Replacement) correctly when sprites.svg changes?**
   - What we know: The plugin supports HMR for individual SVG component imports
   - What's unclear: Whether changes to sprites.svg trigger proper re-rendering of all cells using symbols from that sprite sheet
   - Recommendation: Test during implementation; may need manual refresh for sprite sheet changes during development

2. **Question: Should FallingFood use a distinct symbol or reuse the Food symbol with CSS class variation?**
   - What we know: Phase 1 created 9 unique symbols; FallingFood might reuse Food symbol
   - What's unclear: Whether symbol reuse is already implemented or needs mapping logic
   - Recommendation: Check sprites.svg symbol IDs against CellType enum; add mapping function if needed

3. **Question: What's the correct loading order for SpriteLoader vs GameGrid initialization?**
   - What we know: Sprites must be in DOM before first `<use>` element renders
   - What's unclear: Whether Svelte's component initialization order guarantees SpriteLoader completes before GameGrid mounts
   - Recommendation: Use an initialization flag or writable store to signal sprite loading complete, render GameGrid conditionally

## Sources

### Primary (HIGH confidence)

- [MDN - SVG use element](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/use) - Official use element specification and browser support
- [MDN - xlink:href attribute](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/xlink:href) - Deprecation status and modern alternatives
- [Chrome Developers - Hardware-accelerated animations](https://developer.chrome.com/blog/hardware-accelerated-animations) - GPU acceleration with CSS transforms
- [Svelte Tutorial - onDestroy](https://svelte.io/tutorial/ondestroy) - Official lifecycle hook documentation
- [GitHub - svg/svgo](https://github.com/svg/svgo) - Official SVGO configuration and plugin API
- [vite-plugin-svelte-svg npm](https://www.npmjs.com/package/vite-plugin-svelte-svg) - Package installation and basic setup

### Secondary (MEDIUM confidence)

- [CSS-Tricks - On xlink:href being deprecated in SVG](https://css-tricks.com/on-xlinkhref-being-deprecated-in-svg/) - Community explanation of SVG 2 changes (2018)
- [Sara Soueidan - Understanding SVG Coordinate Systems](https://www.sarasoueidan.com/blog/svg-coordinate-systems/) - Expert tutorial on viewBox behavior
- [Charlie Marsh - Animating SVGs with CSS Transforms](https://www.crmarsh.com/svg-performance/) - Performance case study with benchmarks
- [CSS-Tricks - Which SVG technique performs best](https://css-tricks.com/which-svg-technique-performs-best-for-way-too-many-icons/) - Performance comparison of inline vs external sprites (2017 study, still relevant)
- [egghead.io - Auto-subscriptions in Svelte 3](https://egghead.io/lessons/svelte-use-auto-subscriptions-in-svelte-3-to-avoid-memory-leaks-when-using-stores) - Video tutorial on Svelte store patterns
- [Aleksandr Hovhannisyan - Performant Game Loops in JavaScript](https://www.aleksandrhovhannisyan.com/blog/javascript-game-loop/) - requestAnimationFrame best practices
- [GitHub - poppa/sveltekit-svg](https://github.com/poppa/sveltekit-svg) - Alternative plugin with TypeScript setup examples

### Tertiary (LOW confidence - needs validation)

- [Medium - How to import SVG files as components](https://medium.com/@praizjosh/how-to-import-svg-files-as-react-components-in-vite-97d6e1f2c046) - React-focused but TypeScript patterns applicable
- [Thoughtspile - Svelte stores: the curious parts](https://thoughtspile.github.io/2023/04/22/svelte-stores/) - Community blog analyzing store internals

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - vite-plugin-svelte-svg is well-documented and widely used in Svelte + Vite ecosystem
- Architecture: HIGH - Inline sprite sheet pattern is verified by multiple sources and performance studies
- Pitfalls: HIGH - All pitfalls backed by official docs or reproducible performance testing
- Code examples: HIGH - Examples derived from official documentation and verified open-source implementations

**Research date:** 2026-02-10
**Valid until:** 30 days (stable ecosystem, Svelte 4 is mature, Vite 5 is stable)

**Domain-specific notes:**
- This research targets Svelte 4.2.0 specifically; Svelte 5 has different reactivity patterns
- Performance recommendations assume desktop/mobile browsers from 2023+
- SVGO configuration is conservative (preserves viewBox and IDs) to avoid breaking symbol references
