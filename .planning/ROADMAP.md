# Roadmap: gSnake SVG Visual Upgrade

## Overview

This roadmap transforms gSnake from colored squares to realistic SVG game objects. We begin by creating optimized SVG assets for all game object types (9 unique symbols covering 10 CellType values), then build the rendering infrastructure using sprite sheets and CSS transforms. Next, we integrate the SVG system with the existing Rust/WASM game engine through Svelte's reactive stores. Finally, we validate 60fps performance during rapid updates and test visual layering across all object combinations.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: SVG Asset Creation** - Create and optimize 9 game object SVG symbols
- [ ] **Phase 2: Rendering Infrastructure** - Build sprite sheet system and SVG component architecture
- [ ] **Phase 3: Game Integration** - Connect SVG rendering to game engine and stores
- [ ] **Phase 4: Performance & Validation** - Verify 60fps target and visual correctness

## Phase Details

### Phase 1: SVG Asset Creation
**Goal**: All game object types have visually distinct, optimized SVG representations ready for rendering
**Depends on**: Nothing (first phase)
**Requirements**: ASSET-01, ASSET-02, ASSET-03, ASSET-04, ASSET-05
**Success Criteria** (what must be TRUE):
  1. sprites.svg file contains 9 unique symbol definitions covering all CellType values (Empty, SnakeHead, SnakeBody, Food, Obstacle, Exit, FloatingFood, Stone, Spike; note: FallingFood uses Food symbol)
  2. Developer can visually distinguish FloatingFood from Food when viewing sprites.svg in browser
  3. Total sprites.svg bundle size is under 20KB and each symbol is under 2KB
  4. All symbols use consistent viewBox coordinates (same dimensions across all symbols)
  5. Opening any symbol in browser shows geometric shapes without filters, blur, or drop-shadow effects
**Plans:** 1 plan
**Status**: ✓ Complete (2026-02-10)

Plans:
- [x] 01-01-PLAN.md — Create and validate SVG sprite sheet with all game object symbols

### Phase 2: Rendering Infrastructure
**Goal**: SVG sprite system is built and ready to render game objects using symbol references
**Depends on**: Phase 1
**Requirements**: RENDER-01, RENDER-02, RENDER-03, RENDER-04, RENDER-05, RENDER-06
**Success Criteria** (what must be TRUE):
  1. vite-plugin-svelte-svg is installed and SVGO optimization runs during build
  2. SpriteLoader.svelte component successfully inlines sprites.svg into DOM at app startup
  3. Cell.svelte renders SVG using `<use>` elements with correct symbol ID mapping from CellType enum
  4. Developer can inspect DOM and see 2 nodes per cell (svg + use) instead of duplicated graphics
  5. TypeScript autocomplete works for SVG imports without errors in IDE
**Plans**: TBD

Plans:
- TBD

### Phase 3: Game Integration
**Goal**: SVG game objects render live game state with transparency support for object layering
**Depends on**: Phase 2
**Requirements**: INTEG-01, INTEG-02, INTEG-03, INTEG-04, INTEG-05, INTEG-06
**Success Criteria** (what must be TRUE):
  1. Player can see all game object types rendered as SVGs during actual gameplay
  2. When snake moves over spike, both objects are visible through transparency (layering works)
  3. Rapid game events (falling food, snake movement) trigger frame updates without visible lag
  4. Loading a level and then switching levels shows no memory increase in DevTools heap snapshot
  5. GameGrid component uses primitive props (CellType values) not object references when rendering cells
**Plans**: TBD

Plans:
- TBD

### Phase 4: Performance & Validation
**Goal**: Visual upgrade maintains 60fps performance and all object combinations render correctly
**Depends on**: Phase 3
**Requirements**: PERF-01, PERF-02, PERF-03, PERF-04
**Success Criteria** (what must be TRUE):
  1. Chrome DevTools Performance tab shows frame times consistently under 16.67ms during snake movement and falling objects
  2. Test level with all object types simultaneously visible runs at 60fps for 30 seconds
  3. Visual regression screenshots show SVG rendering matches expected appearance for all objects
  4. Developer can observe in DevTools that will-change CSS hints are applied only to animated elements (not static objects)
**Plans**: TBD

Plans:
- TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. SVG Asset Creation | 1/1 | ✓ Complete | 2026-02-10 |
| 2. Rendering Infrastructure | 0/TBD | Not started | - |
| 3. Game Integration | 0/TBD | Not started | - |
| 4. Performance & Validation | 0/TBD | Not started | - |

---
*Roadmap created: 2026-02-09*
*Last updated: 2026-02-10*
