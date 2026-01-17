## Objective

Refactor core domain models to enforce the strict wasm/web contract and generate authoritative TS types.

## Scope

**Included:**

- Make `LevelDefinition.snake_direction` required
- Remove `Frame.snake` from the public contract (keep only `grid` + `state`)
- Introduce `ContractError` with `kind`, `message`, optional `context`
- Ensure all enums serialize as string enums via serde + ts-rs
- Update ts-rs generation to output the new contract types
- Add Rust serialization tests for `Frame`, `GameState`, and `ContractError`

**Excluded:**

- wasm-bindgen API changes
- Web integration and UI refactors

## Spec References

- spec:epics/wasm-tsrs-integration/tech-plan.md - Data Model
- spec:epics/wasm-tsrs-integration/epic-brief.md - Strict Direction (Decisions)

## Key Deliverables

1. **Core Models:** Updated domain structs/enums in `gsnake-core/engine/core/src/models.rs`.
2. **Type Generation:** Updated `gsnake-core/engine/core/src/bin/export_ts.rs` output matches contract.
3. **Serialization Tests:** Rust tests validate string enum outputs and error shape.

## Acceptance Criteria

- ✅ `LevelDefinition` requires `snake_direction`
- ✅ `Frame` contract excludes `snake`
- ✅ `ContractError` is defined and serializes with string enums
- ✅ ts-rs output matches the new contract in `gsnake-web/types/models.ts`
- ✅ Rust tests fail on enum shape drift

## Dependencies

- None
