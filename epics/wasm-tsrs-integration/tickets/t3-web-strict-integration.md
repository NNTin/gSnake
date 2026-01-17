## Objective

Refactor the web wrapper and UI integration to consume the strict wasm contract without runtime normalization.

## Scope

**Included:**

- Remove `normalizeFrame` and enum normalization paths
- Handle `ContractError` payloads in `WasmGameEngine.ts`
- Implement a single retry on wasm init failure
- Render strictly from `Frame.grid` and `Frame.state`
- Align UI code to new `Frame` contract (no `snake` usage)

**Excluded:**

- Rust model changes
- wasm API changes

## Spec References

- spec:epics/wasm-tsrs-integration/tech-plan.md - Component Architecture (Web)
- spec:epics/wasm-tsrs-integration/core-flows.md - Flow 1: UI Developer Integrates Engine Interface
- spec:epics/wasm-tsrs-integration/epic-brief.md - Strict Direction (Decisions)

## Key Deliverables

1. **Web Wrapper:** Updated `gsnake-web/engine/WasmGameEngine.ts` with strict payload handling.
2. **UI Contract Usage:** UI renders from `Frame.grid` only and removes `snake` usage.
3. **Init Resilience:** Single retry policy for wasm init failure.

## Acceptance Criteria

- ✅ No runtime normalization or enum mapping exists in web code
- ✅ UI compiles against generated ts-rs types
- ✅ `ContractError` surfaced as fatal UI state on failure
- ✅ UI renders strictly from `Frame.grid`

## Dependencies

- `ticket:T2` - wasm strict API available
