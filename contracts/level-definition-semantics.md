# LevelDefinition Optional-Field Semantics

This document is the authoritative reference for `LevelDefinition` serialization semantics around:

- `floatingFood`
- `fallingFood`
- `stones`
- `spikes`
- `totalFood`

Canonical schema: `contracts/level-definition.schema.json`

## Field Semantics

### Snake and coordinates

- `snake` is required and must contain at least one segment.
- All coordinate fields (`x`, `y`) must be non-negative integers at the schema boundary.
- Coordinates must be inside the declared grid (`0 <= x < gridSize.width`, `0 <= y < gridSize.height`) at API validation boundaries.

### Optional arrays

- `floatingFood`, `fallingFood`, `stones`, and `spikes` are optional at the schema boundary.
- When present, each value must be an array of `{ x, y }` integer positions.
- When absent, consumers must interpret the value as an empty array.

### `totalFood`

- `totalFood` is required and must be a non-negative integer.
- Editor-exported payloads must compute:
  - `totalFood = food.length + floatingFood.length + fallingFood.length`
- `stones` and `spikes` do not contribute to `totalFood`.

## Editor <-> Server Round-Trip Contract

The editor and server must preserve stable behavior for these fields:

1. Editor export (`gsnake-editor/src/lib/levelModel.ts`) always emits all four optional arrays, even when empty.
2. Editor export always recomputes and emits `totalFood` from food-bearing arrays.
3. Server validation (`gsnake-editor/src/server/levelDefinitionValidator.ts`) enforces schema shape and grid-bounds checks, but does not recompute `totalFood`.
4. Server storage/retrieval (`gsnake-editor/server.ts`) stores the validated payload and returns it unchanged.
5. Editor load paths must treat missing optional arrays as empty arrays for compatibility with older payloads.

## Maintenance Rules

- Any semantic change to these fields must update:
  - `contracts/level-definition.schema.json`
  - this document
  - editor/server tests that assert round-trip behavior
