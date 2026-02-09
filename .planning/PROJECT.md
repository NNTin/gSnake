# gSnake Visual Upgrade: SVG Game Objects

## What This Is

A visual upgrade for gSnake game that replaces solid colored squares with realistic, detailed SVG representations of game objects. The SVGs support partial transparency for object layering, making the game immediately understandable while maintaining smooth performance during rapid game updates.

## Core Value

Players must be able to instantly recognize what each game object is without needing to learn a color-coding system.

## Requirements

### Validated

- ✓ Rust game engine (gsnake-core) compiled to WebAssembly — existing
- ✓ Svelte UI framework with reactive stores for state management — existing
- ✓ Frame-based rendering system with CellType enum — existing
- ✓ 10 game object types defined (Empty, SnakeHead, SnakeBody, Food, Obstacle, Exit, FloatingFood, FallingFood, Stone, Spike) — existing

### Active

- [ ] Create realistic/detailed SVG assets for all 10 game object types
- [ ] Implement SVG rendering system with partial transparency support
- [ ] Support object layering (multiple objects visible on same tile through transparency)
- [ ] Replace current colored square rendering with SVG-based rendering
- [ ] Maintain smooth 60fps performance during rapid updates (falling objects, snake movement)
- [ ] Ensure visual distinction between similar objects (FloatingFood vs FallingFood, Stone vs Obstacle)
- [ ] Keep SVG assets modular and replaceable for future iteration

### Out of Scope

- Animations or transitions between states — deferred, static SVGs first
- Multiple visual themes or user customization — single style for v1
- Sound effects or audio feedback — visual only
- Mobile-specific touch controls — existing input system unchanged
- Accessibility features (screen reader support, colorblind modes) — deferred to v2

## Context

**Architecture:**
- Monorepo structure: gsnake-core (Rust engine), gsnake-web (Svelte UI), gsnake-editor (level editor), gsnake-levels (level tools)
- Game engine generates Frame objects containing 2D grid of CellType enum values
- Svelte components subscribe to stores (gameState, frame) and re-render on updates
- Current rendering: Grid-based system in gsnake-web/components using solid colors

**Performance Characteristics:**
- Game engine can trigger rapid frame updates (gravity, falling objects)
- Each move processes through: input → engine → frame generation → store update → component re-render
- Critical path: Frame updates must not lag or cause visual stutter

**Visual Requirements:**
- FloatingFood and FallingFood should look similar but have slight differences (e.g., coloring)
- Objects need transparency/alpha channel to show overlapping (snake head on spike, food on obstacle)
- Style flexibility: SVG assets are designed to be replaceable, not final art

## Constraints

- **Performance**: Must maintain 60fps during rapid game updates (falling/floating objects, snake movement) — cannot introduce rendering lag
- **Tech Stack**: Must work with existing Svelte 4.2.0 + Vite build system in gsnake-web
- **Architecture**: Rendering changes only in gsnake-web UI layer — no changes to gsnake-core engine or data contracts
- **Browser Compatibility**: Must work on modern browsers (Chrome, Firefox, Safari, Edge) — target WebAssembly-capable browsers

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use SVG over PNG/Canvas | SVG provides scalability, transparency, and small file size | — Pending |
| Keep assets replaceable | Early iteration, don't overinvest in final art | — Pending |
| UI-layer only changes | Game engine logic is in Rust, UI just renders state | — Pending |

---
*Last updated: 2026-02-09 after initialization*
