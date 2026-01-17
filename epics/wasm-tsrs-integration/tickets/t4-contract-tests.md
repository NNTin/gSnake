## Objective

Add cross-layer contract tests to prevent enum shape drift and ensure strict payload compatibility.

## Scope

**Included:**

- Rust serialization tests for string enum outputs
- Web integration tests verifying payload shapes and enum strings
- Test coverage for `ContractError` and `processMove` result behavior

**Excluded:**

- End-to-end gameplay testing
- Performance benchmarking

## Spec References

- spec:epics/wasm-tsrs-integration/tech-plan.md - Tests
- spec:epics/wasm-tsrs-integration/epic-brief.md - Success Criteria

## Key Deliverables

1. **Rust Contract Tests:** Verify serialized outputs for `Frame`, `GameState`, and `ContractError`.
2. **Web Contract Tests:** Validate strict enum strings and payload shapes in integration tests.

## Acceptance Criteria

- ✅ Rust tests fail on enum shape drift
- ✅ Web tests fail on payload shape mismatch
- ✅ `processMove` success returns a `Frame` payload in tests

## Dependencies

- `ticket:T1` - Core contract models updated
- `ticket:T3` - Web strict integration completed
