# Requirements: gSnake SVG Visual Upgrade

**Defined:** 2026-02-09
**Core Value:** Players must be able to instantly recognize what each game object is without needing to learn a color-coding system.

## v1 Requirements

Requirements for SVG rendering upgrade. Each maps to roadmap phases.

### SVG Assets

- [ ] **ASSET-01**: Create sprites.svg with 10 CellType symbol definitions (SnakeHead, SnakeBody, Food, FloatingFood, FallingFood, Obstacle, Stone, Spike, Exit, Empty)
- [ ] **ASSET-02**: Use geometric style without SVG filters (no blur, drop-shadow, or complex effects)
- [ ] **ASSET-03**: Ensure visual distinction between similar objects (FloatingFood vs FallingFood with color variation)
- [ ] **ASSET-04**: Standardize viewBox coordinates across all symbols
- [ ] **ASSET-05**: Optimize assets through SVGO targeting <2KB per symbol, <20KB total bundle

### Rendering Infrastructure

- [ ] **RENDER-01**: Install and configure vite-plugin-svelte-svg with SVGO optimization
- [ ] **RENDER-02**: Add TypeScript definitions for SVG imports
- [ ] **RENDER-03**: Create SpriteLoader.svelte component to inline sprites.svg into DOM
- [ ] **RENDER-04**: Modify Cell.svelte to render SVG with `<use>` elements instead of colored divs
- [ ] **RENDER-05**: Implement CellType enum to sprite symbol ID mapping
- [ ] **RENDER-06**: Use transform-based positioning (CSS transforms, not SVG attributes)

### Game Integration

- [ ] **INTEG-01**: Integrate SpriteLoader component in App.svelte
- [ ] **INTEG-02**: Connect Cell.svelte to frame store for reactive updates
- [ ] **INTEG-03**: Pass primitive props only to Cell components (avoid object props for performance)
- [ ] **INTEG-04**: Implement partial transparency/opacity for object layering
- [ ] **INTEG-05**: Integrate requestAnimationFrame with game engine frame updates
- [ ] **INTEG-06**: Implement proper cleanup in onDestroy lifecycle hook (prevent memory leaks)

### Performance & Validation

- [ ] **PERF-01**: Profile rendering with Chrome DevTools (frame times, DOM node count, memory usage)
- [ ] **PERF-02**: Validate 60fps target during rapid updates (falling objects, snake movement)
- [ ] **PERF-03**: Test transparency layering for all relevant CellType combinations
- [ ] **PERF-04**: Conduct visual regression testing (screenshots before/after for quality assurance)

## v2 Requirements

Deferred optimization and advanced features. Tracked but not in current roadmap.

### Performance Optimization

- **PERF-05**: Apply will-change CSS hints to frequently animated elements
- **PERF-06**: Implement asset preloading to eliminate first-frame jank
- **PERF-07**: Test and optimize for mobile/tablet devices

### Advanced Rendering

- **RENDER-07**: Implement layered transparency rendering for composite effects
- **RENDER-08**: Add intersection observer for off-viewport optimization
- **RENDER-09**: Explore canvas hybrid approach if object count exceeds 50

## Out of Scope

Explicitly excluded features. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| SMIL/SVG native animations | Poor browser support, can't sync with game state |
| Complex SVG filters in game objects | Expensive repaints, drops mobile FPS from 60 to 15 |
| Real-time path morphing | Triggers layout recalculation, breaks 60fps target |
| Animated fill/stroke colors per frame | DOM thrashing, use asset swapping instead |
| Individual x/y coordinate updates | Prevents GPU acceleration, use CSS transforms |
| Inline style manipulation every frame | Performance bottleneck, use CSS classes or reactive bindings |
| Multiple visual themes | Single style for v1, defer customization |
| Sound effects or audio | Visual upgrade only |
| Animations/transitions between states | Static SVGs first, defer motion |
| Svelte 5 upgrade | Stay on Svelte 4.2.0 to avoid SVG namespace bugs mid-milestone |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| ASSET-01 | Phase 1 | Pending |
| ASSET-02 | Phase 1 | Pending |
| ASSET-03 | Phase 1 | Pending |
| ASSET-04 | Phase 1 | Pending |
| ASSET-05 | Phase 1 | Pending |
| RENDER-01 | Phase 2 | Pending |
| RENDER-02 | Phase 2 | Pending |
| RENDER-03 | Phase 2 | Pending |
| RENDER-04 | Phase 2 | Pending |
| RENDER-05 | Phase 2 | Pending |
| RENDER-06 | Phase 2 | Pending |
| INTEG-01 | Phase 3 | Pending |
| INTEG-02 | Phase 3 | Pending |
| INTEG-03 | Phase 3 | Pending |
| INTEG-04 | Phase 3 | Pending |
| INTEG-05 | Phase 3 | Pending |
| INTEG-06 | Phase 3 | Pending |
| PERF-01 | Phase 4 | Pending |
| PERF-02 | Phase 4 | Pending |
| PERF-03 | Phase 4 | Pending |
| PERF-04 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 20 total
- Mapped to phases: 20
- Unmapped: 0 ✓

---
*Requirements defined: 2026-02-09*
*Last updated: 2026-02-09 after roadmap creation*
