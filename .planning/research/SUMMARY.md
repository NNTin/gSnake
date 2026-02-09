# Project Research Summary

**Project:** gSnake SVG Game Object Rendering
**Domain:** Performance-critical grid-based puzzle game with WebAssembly engine
**Researched:** 2026-02-09
**Confidence:** MEDIUM-HIGH

## Executive Summary

This project adds SVG rendering to an existing Svelte 4.2.0 grid-based game with a Rust/WASM engine. The goal is to replace colored divs with 10 distinct SVG game objects while maintaining 60fps during rapid updates (falling objects, snake movement). Research shows this is achievable using native Svelte SVG rendering with a sprite sheet pattern—no additional rendering libraries needed for this scale.

The recommended approach uses SVG symbol sprites loaded once at startup, referenced via lightweight `<use>` elements in each cell. Critical to success: use CSS transforms exclusively for animation (never SVG attributes), implement proper cleanup to prevent memory leaks, and optimize all SVG assets through SVGO. The existing Svelte store-driven reactive architecture remains unchanged, minimizing integration risk.

Key risks center on performance pitfalls that appear innocuous but are catastrophic: animating SVG attributes instead of CSS transforms drops FPS by 2-5x; inline SVG pollution creates DOM explosions; SVG filters destroy mobile performance. The mitigation strategy is preventative—establish correct patterns in Phase 1 architecture, as retrofitting is expensive (2-3 days per pitfall).

## Key Findings

### Recommended Stack

Native Svelte inline SVG outperforms any library overhead at 10 objects. Research confirms Svelte maintains 60fps with 100+ concurrent operations—well above this project's requirements. The only addition is `vite-plugin-svelte-svg` (^2.3.0) for asset optimization, which integrates cleanly with the existing Vite 5.0.0 build pipeline.

**Core technologies:**
- **Native Svelte SVG (4.2.0+)**: Inline SVG rendering — no dependencies, full reactivity, optimal for <100 objects, surgical DOM updates through Svelte's compiler
- **Keyed #each blocks (built-in)**: List rendering optimization — reduces DOM operations by ~50%, essential for moving objects
- **CSS Transforms (native)**: Animation/positioning — GPU-accelerated, avoids layout invalidation, critical for 60fps target
- **vite-plugin-svelte-svg (^2.3.0)**: SVG component imports — includes SVGO optimization, integrates with Vite, converts SVG to components with ?component suffix
- **SVGO (bundled)**: SVG optimization — industry standard, reduces file size by up to 80%, automatic during build

**Confidence notes:** Plugin last published 2 years ago but actively used (254 weekly downloads). Fallback to manual SVGO + inline imports is well-documented if needed.

### Expected Features

Research divided features into table stakes (blocking), differentiators (competitive advantage), and anti-features (deliberately avoid).

**Must have (table stakes):**
- SVG Element Embedding — core rendering mechanism, replaces background colors
- ViewBox Coordinate System — maps game grid to viewport, enables responsive scaling
- Asset Loading System — loads 10 SVG files (one per CellType) via Vite imports
- Opacity/Transparency Support — enables object layering (snake on spike, etc.)
- Transform-based Updates — position/scale changes without reflow (GPU-accelerated)
- RequestAnimationFrame Integration — syncs with browser repaint, maintains 60fps
- Path Simplification — SVGO optimization reduces DOM complexity
- Visual State Differentiation — FloatingFood vs FallingFood must be visually distinct

**Should have (competitive):**
- will-change CSS Hints — GPU layer promotion for frequently updating elements
- Sprite Sheet/Symbol Reuse — reduces memory when same asset appears multiple times
- Asset Preloading — eliminates first-frame jank during level load
- Layered Transparency Rendering — composite effects (glowing eyes on different backgrounds)

**Defer (v2+):**
- Shape-rendering Optimization — only if 60fps not met after profiling
- Intersection Observer — only needed for off-viewport features (thumbnails, minimap)
- Transform-based Positional Updates — only if adding smooth sub-cell interpolation

**Anti-features (never build):**
- SMIL/SVG Native Animations — poor browser support, can't sync with game state
- Complex SVG Filters (blur, shadows) — expensive repaints, blocks GPU acceleration
- Real-time Path Morphing — triggers layout recalculation
- Animated fill/stroke Colors — use asset swapping instead
- Individual x/y Coordinate Updates — use transform: translate() for GPU acceleration
- Inline Style Attributes Every Frame — DOM thrashing, use CSS classes

### Architecture Approach

The architecture preserves the existing Svelte store-driven reactive flow while replacing only the rendering implementation in Cell.svelte. This minimizes integration risk and leverages proven patterns.

**Major components:**
1. **sprites.svg (NEW)** — Single SVG file with `<symbol>` definitions for all 10 CellType values, loaded once at app startup, cached by browser
2. **SpriteLoader.svelte (NEW)** — Inlines sprite sheet into DOM (hidden), makes symbols available for `<use>` references, mounted once in App.svelte
3. **Cell.svelte (MODIFIED)** — Replace div rendering with `<svg><use href="#symbol-id"/>`, maps CellType to symbol ID, maintains same prop interface
4. **GameGrid.svelte (UNCHANGED)** — Continues subscribing to frame store and creating Cell array
5. **Store layer (UNCHANGED)** — Frame updates from Rust → WASM → Store → Components work identically

**Key pattern:** SVG Symbol + Use (sprite sheet pattern). Define visuals once in sprites.svg, reference many times with lightweight `<use>` elements. Each Cell renders only 2 DOM nodes (svg + use) instead of duplicating graphics.

**Performance expectation:** Near-identical frame times to current colored div approach. Research shows SVG `<use>` with sprite sheets performs comparably to HTML divs for typical grid sizes (<30x30 cells). Critical bottleneck at ~3000-5000 SVG elements, well above project requirements.

### Critical Pitfalls

Research identified 7 critical pitfalls, ranked by prevention phase:

1. **Animating Non-Transform SVG Attributes (CRITICAL)** — Animating cx, cy, x, y, width, height prevents GPU acceleration, drops FPS by 2-5x. Khan Academy hit 12fps on tablets with this mistake. **Solution:** Use CSS transform (translate, scale, rotate) and opacity only, wrap SVGs in divs for transforms, never manipulate SVG attributes in animation loops. **Prevent in Phase 1.**

2. **Inline SVG DOM Pollution (CRITICAL)** — Embedding SVG markup per object creates massive DOM trees (4000+ nodes for 20x20 grid). Chrome's GPU pipeline chokes on large SVG-heavy DOMs. **Solution:** Use SVG sprites with `<use>`, single sprite sheet with all symbols, component instance reuse. **Prevent in Phase 1.**

3. **Svelte Reactivity Triggering Unnecessary Re-renders (CRITICAL)** — Passing objects as props to 400 cells causes excessive check_dirtiness calls (78ms documented in one case). **Solution:** Pass primitive props only (type: CellType not cell: CellObject), immutable updates, avoid deep reactivity, memoize computed values. **Prevent in Phase 1 & 2.**

4. **SVG Filter Abuse (HIGH)** — Filters like feGaussianBlur drop FPS from 60 to 15 on mobile, inconsistently GPU-accelerated across browsers. **Solution:** Never use filters on animated objects, bake effects into paths, use CSS box-shadow on wrappers instead. **Prevent in Phase 0 (asset creation).**

5. **Memory Leaks from Animation Cleanup (HIGH)** — requestAnimationFrame loops and event listeners survive component destruction, memory balloons after 5-10 level plays. **Solution:** Track animation IDs and cancel in onDestroy, use Svelte actions for auto-cleanup, single game loop manager in store. **Prevent in Phase 2.**

6. **setAttribute() Performance Bottleneck (MEDIUM)** — Repeatedly calling element.setAttribute() in animation loops consumes 10%+ of frame time. **Solution:** Use element.style.transform not setAttribute('transform'), batch updates, CSS classes over inline styles, Svelte reactive style bindings. **Prevent in Phase 1.**

7. **Path Complexity Explosion (MEDIUM)** — Design tools export SVGs with 200+ points and 6-decimal precision, slows parsing and rendering. **Solution:** Run SVGO on all assets (40-80% size reduction), manual path simplification, target <2KB per asset, <20KB total bundle. **Prevent in Phase 0.**

## Implications for Roadmap

Based on research, a 4-phase approach balances dependency order, risk mitigation, and validation cycles.

### Phase 0: Asset Creation & Optimization (Foundation)
**Rationale:** SVG assets must be created and optimized before implementation begins. This prevents retrofitting optimization later and establishes visual consistency early. Design decisions (colors, shapes, style) affect all subsequent phases.

**Delivers:**
- sprites.svg with all 10 CellType symbols defined
- Optimized through SVGO (<2KB per symbol, <20KB total)
- Visual style guide (geometry vs realism, color palette)
- ViewBox standardization (likely 0 0 24 24 or similar)

**Addresses:**
- Visual State Differentiation (FEATURES.md) — FloatingFood vs FallingFood must be distinct
- Path Complexity pitfall — SVGO optimization built into workflow
- SVG Filter pitfall — asset guidelines forbid filters/complex effects

**Avoids:**
- Creating assets that require expensive optimization later
- Visual inconsistency requiring rework
- Performance-killing filters baked into designs

**Research flag:** No additional research needed. Standard SVG asset creation with clear optimization requirements.

---

### Phase 1: Architecture & Integration Setup (Core Patterns)
**Rationale:** Establish correct rendering patterns before implementing game objects. This phase prevents the costliest pitfalls (transform-based animation, sprite loading, component design). Getting architecture wrong requires 2-3 days per pitfall to fix.

**Delivers:**
- SpriteLoader.svelte component (loads sprites.svg into DOM)
- Modified Cell.svelte (CellType → symbol ID mapping, `<use>` rendering)
- Integration in App.svelte (mount SpriteLoader)
- TypeScript definitions for SVG imports (app.d.ts)
- Vite config updated (vite-plugin-svelte-svg with SVGO settings)
- Transform-based animation patterns documented and tested

**Addresses:**
- SVG Element Embedding (table stakes)
- ViewBox Coordinate System (table stakes)
- Asset Loading System (table stakes)
- Sprite Sheet/Symbol Reuse (differentiator)

**Avoids:**
- Animating Non-Transform Attributes pitfall — establish CSS transform pattern
- Inline SVG Pollution pitfall — sprite sheet architecture
- setAttribute() Bottleneck pitfall — reactive style bindings pattern
- Svelte Reactivity pitfall — primitive props only (type: CellType)

**Dependencies:** Requires completed Phase 0 (sprites.svg)

**Research flag:** No additional research needed. Implementation follows well-documented sprite sheet + Svelte patterns from research.

---

### Phase 2: Game State Integration & Lifecycle (Reactivity)
**Rationale:** Connect SVG rendering to existing game engine and stores. This phase surfaces reactivity issues and memory leak risks. Keeping this separate from Phase 1 allows validating architecture before adding game state complexity.

**Delivers:**
- Cell.svelte receiving CellType from frame store
- GameGrid rendering full grid with SVG objects
- requestAnimationFrame lifecycle management
- onDestroy cleanup for all timers/listeners
- Transform updates driven by game state (falling food, snake movement)

**Addresses:**
- Transform-based Updates (table stakes)
- RequestAnimationFrame Integration (table stakes)
- Opacity/Transparency Support (table stakes)
- Per-Cell Rendering (table stakes)

**Avoids:**
- Memory Leaks pitfall — proper cleanup in onDestroy
- Svelte Reactivity pitfall — verify primitive props pattern holds under full game state
- Frame synchronization issues — RAF integration tested with rapid updates

**Dependencies:** Requires completed Phase 1 (rendering architecture)

**Research flag:** No additional research needed. Svelte reactivity patterns and lifecycle management well-documented in research.

---

### Phase 3: Performance Validation & Optimization (Polish)
**Rationale:** Validate 60fps target across devices, optimize only where profiling indicates need. Premature optimization wastes effort—this phase applies targeted fixes based on real measurements.

**Delivers:**
- Performance profiling with DevTools (frame times, DOM node count, memory)
- will-change CSS hints applied to animated elements
- Asset preloading if first-frame jank detected
- Layered transparency rendering if visual requirements demand it
- Mobile/tablet performance testing and fixes
- Visual regression testing (screenshots before/after)

**Addresses:**
- will-change CSS Hints (differentiator) — apply based on profiling
- Asset Preloading (differentiator) — if jank observed
- Layered Transparency Rendering (differentiator) — if needed for visuals

**Avoids:**
- Premature optimization — profile first, optimize second
- Over-application of will-change — causes GPU memory waste
- Adding complexity without measured benefit

**Dependencies:** Requires completed Phase 2 (full integration)

**Research flag:** No additional research needed. Performance testing follows standard DevTools profiling workflow documented in research.

---

### Phase Ordering Rationale

**Why this order:**
1. **Assets before code** — Can't implement rendering without graphics. Optimization workflow established early prevents rework.
2. **Architecture before integration** — Correct patterns must be established before connecting to game state. Retrofitting transform-based animation is expensive (2-3 days per pitfall).
3. **Integration before optimization** — Need working system to profile. Premature optimization wastes effort on non-bottlenecks.
4. **Separate validation phase** — Ensures 60fps target met across devices before considering "done."

**How this avoids pitfalls:**
- Phase 0 prevents path complexity and filter abuse (asset-level)
- Phase 1 prevents transform, inline SVG, and setAttribute pitfalls (architecture-level)
- Phase 2 prevents memory leaks and reactivity pitfalls (integration-level)
- Phase 3 validates prevention worked (measurement-level)

**Dependency chain:**
```
Phase 0 (sprites.svg)
    ↓
Phase 1 (SpriteLoader + Cell.svelte)
    ↓
Phase 2 (Game state integration)
    ↓
Phase 3 (Performance validation)
```

Linear dependencies—no parallelization possible.

### Research Flags

**Phases with standard patterns (skip research-phase):**
- **Phase 0:** Standard SVG asset creation and SVGO optimization workflow
- **Phase 1:** Well-documented sprite sheet pattern, Vite plugin configuration covered in STACK.md
- **Phase 2:** Standard Svelte reactivity and lifecycle patterns
- **Phase 3:** Standard browser DevTools performance profiling

**No phases require additional research.** All patterns are well-documented in research outputs with HIGH or MEDIUM-HIGH confidence. Implementation can proceed directly from research findings.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Native Svelte SVG verified with official docs, vite-plugin-svelte-svg actively used despite 2-year gap since publish. Performance targets confirmed with 2025-2026 benchmarks. |
| Features | HIGH | Feature categories derived from official MDN docs, CSS-Tricks, and real-world game development examples. Table stakes vs differentiators clear from performance research. |
| Architecture | HIGH | Sprite sheet pattern verified with multiple sources (CSS-Tricks, SVG stress tests). Store-driven reactive rendering is existing proven pattern. Integration points identified with specific file changes. |
| Pitfalls | MEDIUM-HIGH | Top pitfalls verified with official sources (Khan Academy case study, MDN performance guides). Some Svelte-specific patterns derived from GitHub issues. SVG game context generalized from web performance research. |

**Overall confidence: MEDIUM-HIGH**

Stack and architecture recommendations are highly confident—based on official documentation and verified benchmarks. Pitfall severity rankings are medium-high confidence—derived from authoritative performance research but some game-specific context is inferred. Implementation risk is low given existing working codebase and minimal changes to core architecture.

### Gaps to Address

**vite-plugin-svelte-svg maintenance:** Last published 2 years ago. Research identified this as the only significant risk. **Mitigation:** Fallback to manual SVGO + inline SVG imports is well-documented. Test plugin installation and Vite integration in Phase 1 immediately—if issues arise, pivot to manual approach adds ~2 hours.

**Mobile device performance:** Research focused on desktop. Low-end mobile testing needed to confirm 60fps target holds. **Mitigation:** Phase 3 includes explicit mobile/tablet testing. If FPS drops below 60, research documents clear optimization path (will-change hints, shape-rendering, reduce grid size).

**Actual SVG file complexity:** Optimization settings may need tuning based on source SVG structure (filters, masks, gradients). **Mitigation:** Phase 0 includes SVGO test with sample asset. If optimization <40% (research target: 40-80%), adjust SVGO settings or simplify designs.

**Edge case rendering:** All 10x10 possible CellType pair combinations (100 permutations) need visual validation for transparency/layering. **Mitigation:** Phase 2 includes explicit combination testing. Create test level with all pairs visible.

## Sources

### Primary (HIGH confidence)
- **STACK.md** — Stack research (vite-plugin-svelte-svg, Svelte SVG rendering, CSS transform performance, SVGO optimization)
- **FEATURES.md** — Feature landscape (table stakes, differentiators, anti-features, MVP definition)
- **ARCHITECTURE.md** — Architecture patterns (sprite sheet + use, inline loading, store-driven reactivity, component responsibilities)
- **PITFALLS.md** — Critical pitfalls (transform vs attributes, inline SVG pollution, reactivity re-renders, memory leaks, setAttribute bottlenecks)

### Secondary (MEDIUM confidence)
- [Svelte #each docs](https://svelte.dev/docs/svelte/each) — Keyed blocks performance
- [MDN will-change](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/will-change) — GPU acceleration
- [Khan Academy: Doubling SVG FPS](https://www.crmarsh.com/svg-performance/) — Transform vs attribute performance (2-5x improvement)
- [High Performance SVGs | CSS-Tricks](https://css-tricks.com/high-performance-svgs/) — Optimization strategies and filter costs
- [SVG Icon Stress Test](https://cloudfour.com/thinks/svg-icon-stress-test/) — Symbol + use performance benchmarks
- [SVG vs Canvas Performance 2025](https://www.svggenie.com/blog/svg-vs-canvas-vs-webgl-performance-2025) — 3k-5k element bottleneck data

### Tertiary (LOW confidence)
- vite-plugin-svelte-svg npm (254 weekly downloads) — Plugin adoption metrics, needs validation
- Svelte GitHub issues (#11405, #14721, #7808) — Svelte-specific SVG/reactivity patterns, community-reported

---
*Research completed: 2026-02-09*
*Ready for roadmap: yes*
