# Pitfalls Research: SVG Game Rendering

**Domain:** SVG rendering for performance-critical grid-based games
**Researched:** 2026-02-09
**Confidence:** MEDIUM-HIGH (Multiple authoritative sources, some SVG-specific game context derived from general patterns)

## Critical Pitfalls

### Pitfall 1: Animating Non-Transform SVG Attributes

**What goes wrong:**
Animating SVG-specific attributes like `cx`, `cy`, `x`, `y`, `width`, `height`, or `d` (path data) causes the browser to recalculate and redraw the entire element from scratch on every frame. This prevents GPU acceleration and triggers expensive layout recalculation, making 60fps impossible with even modest numbers of objects (10+ elements).

**Why it happens:**
Developers naturally reach for SVG's native attributes when manipulating SVG elements. The pattern `element.setAttribute('cx', newValue)` seems correct and works for static updates, but becomes catastrophic in animation loops. Khan Academy initially hit only 12 FPS on tablets using this approach.

**How to avoid:**
- **Never animate**: `cx`, `cy`, `x`, `y`, `width`, `height`, `d`, `points`, `clip-path` attributes directly
- **Always animate**: CSS `transform` (translate, scale, rotate) and `opacity` properties only
- **Wrap SVGs in divs**: Apply CSS transforms to wrapper divs, not the SVG elements themselves (Khan Academy's 2-5x performance gain strategy)
- **For Svelte**: Use reactive `style` bindings for transforms, not reactive SVG attribute bindings

**Warning signs:**
- DevTools Performance tab shows high "Recalculate Style" and "Layout" time (>3ms per frame)
- FPS drops below 30 when moving multiple objects simultaneously
- Mobile/tablet performance significantly worse than desktop
- CPU usage spikes during game updates

**Phase to address:**
Phase 1 (Architecture/Setup) - Must establish transform-based animation pattern from start. Retrofitting is expensive.

---

### Pitfall 2: Inline SVG DOM Pollution

**What goes wrong:**
Embedding SVG markup inline for every game object creates massive DOM trees that slow style recalculation/reflow and inflate memory usage. With a 20x20 grid and 10 potential objects per cell, you could hit 4000+ DOM nodes. Chrome's GPU rendering pipeline chokes on large SVG-heavy DOMs, causing frame drops even when individual SVGs are simple.

**Why it happens:**
Each inline `<svg>` tag creates a complete SVG context with all associated browser overhead. Developers copy-paste SVG code directly into components because it's convenient and "works" in small tests. The performance cliff appears suddenly when object count scales.

**How to avoid:**
- **Use SVG sprites with `<use>`**: Single `<svg>` with `<defs>` containing all symbols, reference via `<use href="#symbol-id">`
- **CSS background-image for static tiles**: Non-interactive objects can use `background-image: url('data:image/svg+xml,...')`
- **Component instance reuse**: Don't create/destroy SVG components per frame - reuse instances and update their transforms
- **For Svelte**: Create single sprite component, use `{#key}` blocks sparingly to avoid recreating DOM nodes

**How to avoid (example for gSnake):**
```svelte
<!-- Good: Sprite-based approach -->
<svg style="display: none">
  <defs>
    <symbol id="snake-head" viewBox="0 0 32 32">...</symbol>
    <symbol id="food" viewBox="0 0 32 32">...</symbol>
  </defs>
</svg>

<!-- Per-cell rendering -->
<svg class="cell-icon">
  <use href="#snake-head" transform="translate({x}, {y})" />
</svg>

<!-- Bad: Inline SVG per cell -->
<svg class="cell-icon" viewBox="0 0 32 32">
  <path d="...full path data repeated 400 times..." />
</svg>
```

**Warning signs:**
- DOM node count >2000 in DevTools Elements panel
- "Style Recalculation" time increases linearly with grid size
- Memory usage grows continuously during gameplay
- Noticeable lag when opening DevTools Elements tab

**Phase to address:**
Phase 1 (Architecture/Setup) - SVG loading/organization strategy must be established before implementing game objects.

---

### Pitfall 3: Svelte Reactivity Triggering Unnecessary Re-renders

**What goes wrong:**
Svelte's reactive system can cause full component re-renders when passing objects/arrays as props, even when the visual output doesn't change. With 400 cells (20x20 grid) each receiving `type` prop updates on every frame, unnecessary re-renders compound into catastrophic performance loss. Deep reactive state with large arrays (your grid state) causes excessive `check_dirtiness` calls - one case documented 78ms per update.

**Why it happens:**
- Svelte treats objects/arrays pessimistically, assuming they might be mutated
- Reactive statements (`$:`) re-run when dependencies change, even if the value is equivalent
- Props passing non-primitive values create subscriptions that fire on parent updates
- Component wraps every cell, so per-cell reactivity multiplies by grid size (400x)

**How to avoid:**
- **Primitive props only**: Pass `type: CellType` (enum/string) not `cell: CellObject`
- **Immutable updates**: Use spread operators to create new objects, don't mutate
- **Memoize computed values**: Cache results of expensive calculations
- **Avoid deep reactivity**: Keep reactive stores shallow - grid as flat array, not nested structure
- **For gSnake specifically**:
  - Current `Cell.svelte` is correct (receives primitive `type: CellType`)
  - Don't add reactive computed props inside Cell component
  - Use `{#key type}` blocks only when necessary (e.g., for animations), not for static rendering

**How to avoid (example):**
```svelte
<!-- Good: Primitive prop, static rendering -->
<script>
  export let type: CellType; // String/enum primitive
  $: typeClass = getTypeClass(type); // Fast lookup
</script>
<div class="cell {typeClass}"></div>

<!-- Bad: Object prop, reactive computation -->
<script>
  export let cell: { type: CellType, state: any }; // Object prop
  $: computedStyle = calculateComplexStyle(cell); // Re-runs on every frame
</script>
```

**Warning signs:**
- DevTools Performance shows "Scripting" time >10ms per frame
- Many small "Function Call" entries in flame chart during updates
- High CPU usage even when visuals appear smooth
- `svelte-render-scan` (if installed) shows excessive re-renders

**Phase to address:**
Phase 1 (Architecture/Setup) - Component prop contracts must be designed correctly from start. Also revisit in Phase 2 (Integration) when connecting SVGs to game state.

---

### Pitfall 4: SVG Filter Abuse (Blur, Drop-Shadow)

**What goes wrong:**
SVG filters like `<feGaussianBlur>`, `<feDropShadow>`, and complex filter chains are GPU-accelerated inconsistently across browsers. Chrome accelerates some, Firefox others, Safari does okay with CSS `filter:` shortcuts but not SVG `<filter>`. On Android or lower-end hardware, filters can drop you from 60fps to 15fps instantly. Even 2-3 filtered objects destroy performance.

**Why it happens:**
Filters look impressive and designers/developers add them liberally during asset creation ("just a small drop shadow"). The performance cost is invisible during static design but catastrophic in motion. Filter calculations happen per-pixel and per-frame, compounding with object count.

**How to avoid:**
- **Never use filters on animated objects**: If it moves/changes, no filters
- **Bake effects into paths**: Pre-render shadows/glows as additional SVG paths in the design
- **Use CSS `box-shadow` on wrapper divs**: More consistently accelerated than SVG filters
- **Prefer simple shapes over filtered complex ones**: Two circles are faster than one circle with blur
- **For gSnake**: Keep SVG assets simple, flat colors, no gradients/filters. Add visual polish through shape design, not effects.

**Warning signs:**
- FPS tanks when specific objects appear on screen (e.g., "spike" object with drop shadow)
- Performance inconsistent across browsers (good on Chrome, terrible on Firefox)
- Mobile devices unusable but desktop fine
- DevTools shows "Paint" and "Rasterize" times >10ms

**Phase to address:**
Phase 0 (Asset Creation) - Establish SVG asset guidelines before designers create graphics. Phase 2 (Integration) - Audit assets during integration testing.

---

### Pitfall 5: Memory Leaks from Animation Cleanup

**What goes wrong:**
SVG animation libraries and custom animation code create timers, event listeners, and loop references that survive component destruction. In Svelte, when components unmount (e.g., switching levels, game over), these resources persist, accumulating with each game session. After 5-10 level plays, memory usage balloons and FPS degrades.

**Why it happens:**
- `requestAnimationFrame` loops don't auto-cancel on component destroy
- Event listeners on SVG elements aren't removed when DOM nodes are recycled
- Animation libraries (svg.js, anime.js) maintain internal element references
- Svelte's component lifecycle (`onDestroy`) is easy to forget when animation logic lives in stores

**How to avoid:**
- **Track animation IDs**: Store `requestAnimationFrame` IDs and cancel in `onDestroy`
- **Use Svelte actions for event listeners**: Automatically cleaned up
- **Avoid third-party animation libraries**: Build custom RAF loop with explicit lifecycle
- **For gSnake**:
  - Create single game loop manager in store, not per-component loops
  - Use `onDestroy` to cancel game loop subscription
  - No animation libraries - use CSS transforms managed by reactive state

**How to avoid (example):**
```svelte
<script>
  import { onDestroy } from 'svelte';

  let animationId: number;

  function gameLoop(timestamp: number) {
    // Update logic
    animationId = requestAnimationFrame(gameLoop);
  }

  animationId = requestAnimationFrame(gameLoop);

  onDestroy(() => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  });
</script>
```

**Warning signs:**
- Memory usage in DevTools grows over time (heap size doesn't decrease after GC)
- Performance degrades after playing multiple levels
- Browser tab slows down even when game is paused/inactive
- DevTools shows increasing "Listener" count in Memory profiler

**Phase to address:**
Phase 2 (Integration) - When connecting animation loop to game state. Phase 3 (Testing/Optimization) - Memory profiling before considering "done".

---

### Pitfall 6: setAttribute() Performance Bottleneck

**What goes wrong:**
Repeatedly calling `element.setAttribute('attribute', value)` in animation loops incurs parsing overhead on every call. With 10 SVG objects updating at 60fps, that's 600 setAttribute calls per second. Profiling data shows setAttribute can consume 10%+ of frame time, leaving insufficient budget (16.7ms total) for game logic and rendering.

**Why it happens:**
setAttribute is the DOM API for SVG manipulation, so developers naturally use it. The browser must parse the attribute string, validate it, and apply it to the render tree on every call. This is fine for infrequent updates but catastrophic in tight loops.

**How to avoid:**
- **Use element properties instead**: `element.style.transform = 'translate(x, y)'` instead of `setAttribute('transform', '...')`
- **Batch updates**: Update multiple attributes, then trigger single render
- **CSS classes over inline styles**: Toggle classes that define transforms
- **For gSnake/Svelte**: Use reactive `style` prop with CSS transforms, never manipulate SVG DOM directly

**How to avoid (example):**
```svelte
<!-- Good: Svelte reactive style binding -->
<div class="cell" style:transform="translate({x}px, {y}px)">
  <svg><use href="#icon" /></svg>
</div>

<!-- Bad: Manual setAttribute in onMount/reactive statement -->
<script>
  $: if (element) {
    element.setAttribute('transform', `translate(${x}, ${y})`); // DON'T DO THIS
  }
</script>
```

**Warning signs:**
- DevTools flame chart shows many `setAttribute` calls
- "Scripting" time disproportionately high relative to visual changes
- Performance worse on Firefox than Chrome (different setAttribute optimization)

**Phase to address:**
Phase 1 (Architecture/Setup) - Establish DOM manipulation patterns. Code review in Phase 2 (Integration) to catch setAttribute usage.

---

### Pitfall 7: Path Complexity Explosion

**What goes wrong:**
SVG paths exported from design tools (Illustrator, Figma) contain excessive anchor points and decimal precision. A "simple" apple icon might have 200+ path points with 6-decimal precision coordinates (`M 123.456789,78.901234 L...`). Complex paths slow parsing, increase memory, and make rendering expensive - each point must be calculated per frame when transforms apply.

**Why it happens:**
Design tools prioritize precision over optimization. Auto-trace features create thousands of points. Designers don't realize the performance cost. Exported SVG includes editor metadata and unnecessary decimal precision.

**How to avoid:**
- **Run SVGO/SVGOMG on all assets**: Removes metadata, reduces precision (2-3 decimals sufficient)
- **Manual path simplification**: Use SVG editors to reduce anchor points before export
- **Design for simplicity**: Geometric shapes (circles, rects, polygons) over complex paths
- **Target file size**: Each SVG asset <2KB, total sprite sheet <20KB
- **For gSnake**: 10 game object types, aim for 1-2KB per asset, <15KB total bundle

**How to avoid (workflow):**
1. Export SVG from design tool
2. Run through SVGOMG (https://jakearchibald.github.io/svgomg/):
   - Enable "Remove metadata"
   - Enable "Minify styles"
   - Set precision to 2-3 decimals
   - Enable "Remove unused namespaces"
3. Review optimized output (should be 40-80% smaller)
4. Test in game before accepting

**Warning signs:**
- SVG file sizes >5KB for simple icons
- Parsing time >1ms per asset on load
- Bundle size >100KB for all game assets
- "Rasterize" time in DevTools >2ms for individual objects

**Phase to address:**
Phase 0 (Asset Creation) - Establish asset optimization pipeline before creating graphics. Phase 1 (Architecture) - Integrate SVGO into build process.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Inline SVG per component | Simple, easy to understand, no setup required | DOM explosion, memory leaks, hard to optimize | Never - even for MVP, use sprite pattern |
| Animating SVG attributes directly | "Works" for simple cases, matches SVG tutorials online | 2-5x performance penalty, GPU acceleration blocked | Never in game loops - only for one-off transitions |
| Object props instead of primitives | More flexible, easier to add fields later | Svelte reactivity overhead, unnecessary re-renders | Never for frequently updated components (400+ cells) |
| Third-party animation libraries | Rich features, don't reinvent wheel | Bundle size, memory leaks, lifecycle management complexity | Never for core game loop - okay for UI flourishes |
| Skip asset optimization | Faster iteration, design changes frequently | 5-10x larger bundles, slower parsing, worse performance | Only during early prototyping, must optimize before Phase 3 |
| CSS transforms on SVG elements directly | Seems correct, less DOM nesting | Inconsistent GPU acceleration, layout triggers on Safari | Never - always wrap in div for transforms |

## Integration Gotchas

Common mistakes when connecting SVG rendering to game systems.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Grid-based layout | Creating 400 individual SVG components per cell | Single sprite sheet, `<use>` elements per cell, transforms for positioning |
| Object layering (transparency) | Using z-index on SVG elements | z-index doesn't work in SVG - use document order or wrapper divs with z-index |
| Rapid state updates from Rust engine | Updating Svelte store triggers 400 cell re-renders | Batch updates, use `writable.update()` not `.set()`, primitive props only |
| FallingFood animation | Animate `y` attribute as food falls | CSS `transform: translateY()` applied to wrapper, update once per frame |
| Asset loading | Import SVG as component 10x times | Single sprite component with all symbols, lazy load if needed |
| Frame synchronization | Update DOM in response to store changes | requestAnimationFrame loop reads store, batches DOM updates, single render per frame |

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| One SVG component per object type | Easy to manage, clear separation | Use sprite sheet with `<use>` | >50 objects on screen (~5x5 grid with objects) |
| Reactive computed props in Cell component | Flexible styling, easy to extend | Move computation to parent, pass primitive classes/styles | >200 cells with reactivity |
| `{#each}` blocks recreating SVG nodes | Simple template syntax | Use `{#key}` sparingly, stable node identity | Frame updates >30fps or >10 objects changing |
| will-change: transform on all SVGs | Hints GPU acceleration | Apply only to actively animating elements | >20 simultaneous will-change elements |
| Deep reactive stores (nested objects) | Matches game state structure | Flatten stores, use derived stores for computed values | Grid state >10x10 with frequent updates |
| Non-pooled component instances | Svelte handles lifecycle automatically | Reuse component instances, update props instead of recreate | Frequent object creation/destruction (falling food) |

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Unsanitized user SVG upload (if level editor allows custom assets) | XSS via `<script>` tags in SVG, arbitrary code execution | Server-side SVG sanitization (DOMPurify), Content-Security-Policy, no inline event handlers |
| Loading SVG from untrusted CDN | MITM attacks, CDN compromise injects malicious content | Bundle SVGs in build, use SRI if external CDN required |
| SVG with external references (`<use href="http://...">`) | Privacy leak (tracks users), load performance unpredictable | Only use internal `#id` references, no external URLs |

## UX Pitfalls

Common user experience mistakes in SVG game rendering.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Blurry SVGs during animation | Objects sharp when static, blurry when moving (GPU rasterization) | Increase viewBox dimensions 2x, use `shape-rendering: geometricPrecision` sparingly (performance cost) |
| Similar objects indistinguishable | FloatingFood vs FallingFood look identical, confuses players | Design distinct silhouettes/colors, not just labels. Test at 50% scale (mobile) |
| No visual feedback on rapid updates | Food falls fast, player can't track it | Add motion blur effect (pre-rendered in SVG, not filter), or slight trail effect |
| Objects vanish when overlapping | Multiple objects on same tile, only top one visible | Ensure proper transparency (alpha <1.0), test all object combinations |
| Inconsistent visual style | Some objects geometric, others realistic | Establish style guide (Phase 0), review all assets together before implementing |
| Poor contrast on different backgrounds | Objects visible on white cells, invisible on dark obstacles | Add stroke/outline to all objects, test on all background types |

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **SVG rendering works**: Often missing proper cleanup - verify `onDestroy` cancels all timers/listeners, test memory usage over 10+ level plays
- [ ] **Objects look good static**: Often missing animation performance testing - verify 60fps with 10 objects moving simultaneously, profile on mobile/tablet
- [ ] **Asset pipeline set up**: Often missing optimization step - verify all SVGs run through SVGOMG, total bundle <20KB, no metadata/comments
- [ ] **Transform-based positioning works**: Often missing GPU acceleration verification - check DevTools Layers panel, ensure separate compositing layers for animated elements
- [ ] **Transparency/layering implemented**: Often missing edge case testing - verify all 10x10 object pair combinations render correctly overlapped
- [ ] **Svelte components integrated**: Often missing reactivity optimization - profile re-render count with `svelte-render-scan`, ensure <400 components update per frame
- [ ] **Sprite sheet loading**: Often missing error handling - verify fallback when sprite fails to load, test with network throttling
- [ ] **Game loop synchronization**: Often missing frame pacing logic - verify consistent 60fps or graceful degradation, test with 120Hz display

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Inline SVG pollution (thousands of DOM nodes) | MEDIUM | 1. Create sprite sheet from existing inline SVGs (1-2 hours), 2. Replace component implementations with `<use>` pattern (2-3 hours), 3. Test rendering (1 hour). Total: ~1 day |
| Animating SVG attributes instead of CSS transforms | HIGH | 1. Refactor all animation code to use wrapper divs (4-6 hours), 2. Update Svelte components to use style bindings (3-4 hours), 3. Regression test all animations (2-3 hours). Total: 2-3 days |
| Svelte reactivity causing excessive re-renders | MEDIUM-HIGH | 1. Profile with DevTools/svelte-render-scan to identify hot spots (1-2 hours), 2. Refactor object props to primitives (3-5 hours), 3. Flatten reactive stores (2-4 hours), 4. Test (2 hours). Total: 1-2 days |
| Memory leaks from animation cleanup | LOW-MEDIUM | 1. Audit all `onMount`/`onDestroy` pairs (1 hour), 2. Add cleanup code for timers/listeners (2-3 hours), 3. Memory profiling verification (1 hour). Total: 4-5 hours |
| SVG filter performance issues | LOW | 1. Identify filtered elements (30 min), 2. Remove filters or bake into paths (1-2 hours per asset), 3. Redesign if needed (variable). Total: 2-4 hours + design time |
| Unoptimized assets bloating bundle | LOW | 1. Run all SVGs through SVGOMG (1 hour), 2. Rebuild and test (30 min). Total: 1.5 hours |
| setAttribute bottleneck in animation | MEDIUM | 1. Find setAttribute calls in codebase (30 min), 2. Replace with style properties or class toggles (2-3 hours), 3. Test (1 hour). Total: 3-4 hours |

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Animating non-transform attributes | Phase 1: Architecture/Setup | DevTools Performance: Layout+Paint <3ms per frame with 10 moving objects |
| Inline SVG pollution | Phase 1: Architecture/Setup | DOM node count <1000 with full grid rendered |
| Svelte reactivity re-renders | Phase 1: Architecture + Phase 2: Integration | svelte-render-scan shows <50 components update per frame during gameplay |
| SVG filter abuse | Phase 0: Asset Creation | DevTools Performance: Paint time <5ms per frame, consistent across browsers |
| Memory leaks | Phase 2: Integration + Phase 3: Testing | Memory heap stable after 10 level plays, no growth after GC |
| setAttribute bottleneck | Phase 1: Architecture | Code review: zero `setAttribute` calls in animation code paths |
| Path complexity | Phase 0: Asset Creation + Phase 1: Build setup | All SVG assets <2KB each, total bundle <20KB |
| z-index/layering | Phase 1: Architecture | All 100 possible object pair combinations tested and visible |
| will-change overuse | Phase 2: Integration + Phase 3: Optimization | DevTools Layers: <20 compositing layers during active gameplay |
| requestAnimationFrame lifecycle | Phase 2: Integration | No requestAnimationFrame IDs remain after component destroy |

## Sources

### High Confidence (Official/Verified)
- [MDN: Animation Performance and Frame Rate](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Animation_performance_and_frame_rate) - Frame budget constraints, CSS rendering waterfall
- [Khan Academy: Doubling SVG FPS Rates](https://www.crmarsh.com/svg-performance/) - Wrapper div strategy, 2-5x performance gains, SVG transform limitations
- [High Performance SVGs - CSS-Tricks](https://css-tricks.com/high-performance-svgs/) - Filter performance issues, inline SVG overhead
- [Planning for Performance - O'Reilly SVG Book](https://oreillymedia.github.io/Using_SVG/extras/ch19-performance.html) - setAttribute bottlenecks, declarative vs imperative animations

### Medium Confidence (Multiple Sources)
- [Canvas vs SVG Performance - Boris Smus](https://smus.com/canvas-vs-svg-performance/) - SVG performance degrades with object count
- [Improving SVG Runtime Performance - Taylor Hunt (CodePen)](https://codepen.io/tigt/post/improving-svg-rendering-performance) - Performance criminals: filters, complex paths, inline SVG DOM overhead (403 on fetch, confirmed via WebSearch)
- [SVG vs Canvas Animation 2026 - August Infotech](https://www.augustinfotech.com/blogs/svg-vs-canvas-animation-what-modern-frontends-should-use-in-2026/) - Use case recommendations
- [Reducing Memory Leaks with Animations - David Walsh](https://davidwalsh.name/reducing-memory-leaks-working-animations) - Timer cleanup patterns

### Svelte-Specific Sources
- [Svelte Issue #11405: Deeply nested SVGs cause lag](https://github.com/sveltejs/svelte/issues/11405) - DOM performance with SVG
- [Svelte Issue #14721: Dropped frames on reactive graph updates](https://github.com/sveltejs/svelte/issues/14721) - Deep reactivity performance
- [Svelte Issue #7808: Style props incompatible with SVG components](https://github.com/sveltejs/svelte/issues/7808) - SVG wrapping issues
- [Troubleshooting Svelte Performance - Mindful Chase](https://www.mindfulchase.com/explore/troubleshooting-tips/troubleshooting-svelte-performance-optimizing-reactivity-and-preventing-memory-leaks.html) - Reactivity optimization, memory leaks
- [Fine-Grained Reactivity in Svelte 5 - Frontend Masters](https://frontendmasters.com/blog/fine-grained-reactivity-in-svelte-5/) - How reactivity works

### Game Loop & Animation Sources
- [Performant Game Loops in JavaScript - Aleksandr Hovhannisyan](https://www.aleksandrhovhannisyan.com/blog/javascript-game-loop/) - requestAnimationFrame patterns
- [Create Proper Game Loop - Spicy Yoghurt](https://spicyyoghurt.com/tutorials/html5-javascript-game-development/create-a-proper-game-loop-with-requestanimationframe) - Best practices, time delta
- [Standardize Framerate Across Monitors - Chris Courses](https://chriscourses.com/blog/standardize-your-javascript-games-framerate-for-different-monitors) - 60 FPS physics limiting

### SVG Optimization Sources
- [7 Ways to Optimize SVGs - FrontendTools](https://www.frontendtools.tech/blog/optimizing-svgs-web-performance-scalability) - Path simplification, metadata removal, 40-80% size reduction
- [Breaking Up with SVG-in-JS - Jacob Groß](https://kurtextrem.de/posts/svg-in-js) - Bundle cost analysis: SVG-as-JSX is 3x more expensive
- [SVGOMG Tool](https://jakearchibald.github.io/svgomg/) - Optimization tool
- [SVG Backgrounds: How to Optimize SVG Files](https://www.svgbackgrounds.com/how-to-optimize-and-reduce-the-file-size-of-svg-images/) - Workflow recommendations

### Memory Leak Sources
- [svg.js Issue #903: clear() causing memory leaks](https://github.com/svgdotjs/svg.js/issues/903) - Cleanup patterns for SVG libraries
- [Solving Memory Issues with Lottie SVG - DEV Community](https://dev.to/integridsolutions/solving-memory-issues-with-lottie-svg-animations-bh8) - Library-specific memory issues

### SVG Layering & z-index
- [Animation Tricks with SVG z-index - LogRocket](https://blog.logrocket.com/animation-tricks-svg-z-index/) - SVG doesn't support z-index, document order matters
- [SVG z-index - GSAP Forums](https://gsap.com/community/forums/topic/22566-z-index-in-svg-element/) - Workarounds for layering

---
*Pitfalls research for: SVG Game Rendering (gSnake Visual Upgrade)*
*Researched: 2026-02-09*
*Context: Performance-critical grid-based puzzle game with 60fps requirement, 10 SVG object types, rapid updates from Rust WebAssembly engine*
