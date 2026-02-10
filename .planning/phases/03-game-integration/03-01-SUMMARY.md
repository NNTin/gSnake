---
phase: 03-game-integration
plan: 01
subsystem: rendering
tags: [rendering, visual-layering, memory-management, transparency]
dependency_graph:
  requires:
    - 02-01 (SpriteLoader and Cell components)
  provides:
    - Per-CellType opacity mapping for visual depth
    - Memory leak prevention via onDestroy cleanup
  affects:
    - All game object rendering
decisions:
  - title: "Opacity mapping for visual layering"
    rationale: "Game engine stores one CellType per cell, so layering is achieved through transparency rather than stacking"
    options:
      - "Partial transparency for hazards/environment (Spike 0.8, Stone 0.85, Obstacle 0.9)"
      - "Full opacity for gameplay-critical objects (Snake, Food, Exit)"
    selected: "Both - hazards semi-transparent, gameplay objects opaque"
  - title: "SpriteLoader cleanup strategy"
    rationale: "Prevent memory leaks from large SVG string in spriteContent variable"
    options:
      - "Rely on Svelte's automatic DOM cleanup"
      - "Explicit onDestroy to clear spriteContent string"
    selected: "Explicit onDestroy for defensive correctness"
tech_stack:
  added: []
  patterns:
    - "Reactive opacity calculation via $: declaration"
    - "Inline CSS style binding in Svelte"
    - "onDestroy lifecycle hook for cleanup"
key_files:
  created: []
  modified:
    - path: "gsnake-web/components/Cell.svelte"
      changes: "Added getOpacity() function and opacity style binding"
      loc_delta: +19
    - path: "gsnake-web/components/SpriteLoader.svelte"
      changes: "Added onDestroy cleanup for spriteContent"
      loc_delta: +4
metrics:
  duration_minutes: 1
  tasks_completed: 1
  files_modified: 2
  tests_added: 0
  tests_passing: 68
  completed_date: "2026-02-10"
---

# Phase 03 Plan 01: Visual Layering and Memory Management Summary

**One-liner:** Per-CellType opacity mapping (Spike 0.8, Stone 0.85, Obstacle 0.9) for visual depth, plus onDestroy cleanup in SpriteLoader to prevent memory leaks.

## What Was Built

Added visual layering capabilities to the rendering system through per-CellType opacity values, and implemented defensive memory management in SpriteLoader.

### Cell.svelte Enhancements

Created `getOpacity(t: CellType): number` function that returns opacity values based on visual role:

- **Hazards with transparency:** Spike (0.8), Stone (0.85), Obstacle (0.9) - semi-transparent to suggest environmental depth
- **Gameplay objects fully opaque:** Snake, Food, Exit, FloatingFood, FallingFood (1.0) - critical for player recognition
- **Background neutral:** Empty (1.0) - no transparency needed

Applied opacity via reactive declaration `$: opacity = getOpacity(type)` and inline style binding on the `<svg>` element.

### SpriteLoader.svelte Cleanup

Added `onDestroy` lifecycle hook that clears `spriteContent = ""` when component unmounts. This ensures the potentially large SVG string (fetched on mount) is garbage-collected promptly, preventing memory leaks during level switching or app teardown.

## Deviations from Plan

None - plan executed exactly as written.

## Implementation Notes

### Visual Layering Strategy

The game engine stores a single CellType per grid cell (no multi-object stacking). Visual "layering" is achieved through transparency:

- Hazards (Spike, Stone, Obstacle) render semi-transparent, creating visual depth
- Gameplay-critical objects (Snake, Food, Exit) render fully opaque for instant recognition
- This satisfies success criteria #2: transparency support for object layering

### Memory Management

SpriteLoader fetches sprites.svg (2,746 bytes) once at app startup and stores the raw SVG string in `spriteContent`. The `{@html}` directive inlines this into the DOM.

While Svelte automatically removes DOM content when components destroy, the JavaScript string variable (`spriteContent`) persists until garbage collection. The `onDestroy` hook explicitly clears this string, ensuring prompt memory release. This is defensive correctness that costs nothing and satisfies success criteria #4 (no memory leaks).

### TypeScript Safety

The `getOpacity()` function uses an exhaustive switch statement covering all 10 CellType values, with a default case returning 1.0. TypeScript compilation confirms no type errors.

## Testing Results

All 68 existing tests continue to pass:

```
Test Files  8 passed (8)
     Tests  68 passed (68)
  Duration  1.90s
```

No new tests added (visual opacity and cleanup logic are implementation details, not contract-level behavior).

TypeScript compilation: 0 errors, 0 warnings.

## Files Changed

### Modified

- `gsnake-web/components/Cell.svelte` (+19 lines)
  - Added `getOpacity()` function with opacity mapping
  - Added reactive `$: opacity = getOpacity(type)` declaration
  - Applied `style="opacity: {opacity}"` to SVG element

- `gsnake-web/components/SpriteLoader.svelte` (+4 lines)
  - Imported `onDestroy` from 'svelte'
  - Added `onDestroy(() => { spriteContent = ""; })` cleanup

## Commits

- `9f4fab6`: feat(03-01): add per-CellType opacity and SpriteLoader cleanup

## Success Criteria Verification

- ✓ Cell.svelte renders SVG elements with per-CellType opacity values applied as inline CSS
- ✓ SpriteLoader.svelte has defensive onDestroy cleanup
- ✓ All existing tests continue to pass (68/68)
- ✓ No TypeScript compilation errors

## Next Steps

This plan completes the visual layering foundation. Plan 03-02 will integrate the full game state rendering, connecting the WASM game engine to the Cell components with proper opacity layering.

## Self-Check: PASSED

Verified all claims in this summary:

- ✓ FOUND: gsnake-web/components/Cell.svelte
- ✓ FOUND: gsnake-web/components/SpriteLoader.svelte
- ✓ FOUND: commit 9f4fab6
- ✓ FOUND: getOpacity function in Cell.svelte
- ✓ FOUND: onDestroy in SpriteLoader.svelte

All files exist, commit is in history, and implementation details are present as documented.
