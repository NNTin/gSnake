## Objective

Update the wasm-bindgen boundary to enforce the strict contract with typed payloads and deterministic frame emission.

## Scope

**Included:**

- Accept `Direction` as a strict serialized enum (no string parsing)
- `processMove` returns `Frame` on success, `ContractError` on failure
- Emit initial `Frame` after engine construction or on `onFrame` registration
- Return `ContractError` for all wasm boundary failures
- Remove any enum normalization or JS-side parsing in wasm layer

**Excluded:**

- Web wrapper changes
- UI updates

## Spec References

- spec:epics/wasm-tsrs-integration/tech-plan.md - Component Architecture (wasm wrapper)
- spec:epics/wasm-tsrs-integration/core-flows.md - Flow 1: UI Developer Integrates Engine Interface

## Key Deliverables

1. **Wasm API:** Updated `gsnake-core/engine/bindings/wasm/src/lib.rs` exports.
2. **Error Payloads:** Consistent `ContractError` return shape for all wasm functions.
3. **Frame Emission:** Initial frame emitted on construction or callback registration.

## Acceptance Criteria

- ✅ `processMove` returns a `Frame` payload on success
- ✅ All failures return `ContractError` (no string errors)
- ✅ Initial frame is emitted without an explicit `getFrame()` call
- ✅ wasm API uses strict serialized enums

## Dependencies

- `ticket:T1` - Core contract models updated
