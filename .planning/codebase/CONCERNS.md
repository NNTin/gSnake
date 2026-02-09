# Codebase Concerns

**Analysis Date:** 2026-02-09

## Tech Debt

**Fragile input validation in game engine**
- Issue: Negative or invalid grid dimensions can cause allocation panics in Rust engine
- Files: `gsnake-core/engine/core/src/engine.rs` (lines 6-38), `gsnake-core/engine/core/src/models.rs` (lines 44-92)
- Impact: Malformed level JSON with negative gridSize values triggers unrecoverable panics instead of graceful error handling
- Fix approach: Add explicit bounds checking on grid dimensions before frame generation; validate all coordinate arrays for negative/out-of-bounds values; return ContractError instead of panicking

**Excessive use of unwrap() in Rust level generation code**
- Issue: 147 instances of `unwrap()`, `panic()`, or `expect()` across gsnake-levels/src/*.rs
- Files: `gsnake-levels/src/validate_levels_toml.rs`, `gsnake-levels/src/playback_generator.rs`, `gsnake-levels/src/verify.rs`, `gsnake-levels/src/generate.rs`
- Impact: Tool crashes instead of collecting and reporting multiple validation errors; poor developer experience
- Fix approach: Replace `unwrap()` calls with `?` operator and Result propagation; aggregate multiple validation errors and report all at once; add context information to each error

**Single unwrap in core engine initialization**
- Issue: `self.level_state.snake.segments.first().unwrap()` in engine.rs line 87
- Files: `gsnake-core/engine/core/src/engine.rs` (lines 87-88)
- Impact: If snake has no segments (invalid level definition), panics instead of returning error
- Fix approach: Check `segments.is_empty()` before accessing; early return with ContractError; add validation in LevelState::from_definition

**gsnake-levels path resolution inconsistency**
- Issue: generate-levels-json assumes cwd-relative `levels/` and `playbacks/` directories; fails when invoked from parent directories
- Files: `gsnake-levels/src/generate.rs`, `gsnake-levels/src/sync_metadata.rs`, `gsnake-levels/src/levels.rs`
- Impact: Tool only works correctly when run from gsnake-levels directory; CI/deployment scripts must use workarounds
- Fix approach: Accept explicit `--levels-dir` and `--playbacks-dir` flags; resolve paths as absolute; update sync functions to accept resolved root paths instead of inferring them

## Known Bugs

**Query parameter NaN bypass in web initialization**
- Symptoms: `?level=NaN` bypasses bounds validation and breaks level loading
- Files: `gsnake-web/components/App.svelte` (lines 45-67), `gsnake-web/engine/WasmGameEngine.ts` (lines 22-28)
- Trigger: User navigates to URL with `?level=NaN`; WasmGameEngine initializes with invalid level index
- Workaround: Use safe integer fallback; return to level 1 on invalid input
- Fix: Explicitly validate level number as positive integer; use `Number.isInteger()` AND check bounds before passing to engine

**Editor level ID type mismatch with core contract**
- Symptoms: Level editor emits string IDs while game engine expects numeric IDs
- Files: `gsnake-editor/src/lib/EditorLayout.svelte`, `gsnake-editor/src/lib/types.ts`, `gsnake-web/types/models.ts`
- Trigger: User exports level from editor and tries to load in game
- Workaround: Manually convert IDs in test harness
- Fix: Align ID type across editor and web; make ID a required numeric field in shared types

**Contract test coverage gaps for new cell types**
- Symptoms: Tests omit validation for FloatingFood, FallingFood, Stone, Spike cell types
- Files: `gsnake-web/tests/contract/types.test.ts`, `gsnake-web/tests/contract/enums.test.ts`, `gsnake-web/tests/contract/fixtures.test.ts`
- Trigger: Game renders new cell types but tests don't verify they're in CellType enum
- Impact: Breaking changes to cell type enum go undetected
- Fix: Expand allowed enum sets and fixtures to include all cell type variants

## Security Considerations

**CORS configuration too permissive for localhost development**
- Risk: Editor server allows all localhost:* origins; could enable CSRF attacks if localhost runs untrusted code
- Files: `gsnake-editor/server.ts` (lines 10-26)
- Current mitigation: Only listens on localhost; production would be on different domain
- Recommendations: Add explicit whitelist of allowed ports; add CSRF token validation; document security assumption (dev-only usage)

**Webhook signature validation vulnerable to replay attacks**
- Risk: No timestamp validation in n8n webhook handler; old GitHub events could be replayed
- Files: `gsnake-n8n/tools/n8n-flows/github-discord-notify.json` (HMAC validation logic)
- Current mitigation: HMAC signature is validated; event uniqueness relies on GitHub deduplication
- Recommendations: Add X-GitHub-Delivery header (unique per event) to replay-attack cache; reject events older than 5 minutes; document GitHub's event delivery guarantees

**Environment variable secrets accessible in Code nodes**
- Risk: n8n Code nodes can access `$env` variables which may contain secrets if `N8N_BLOCK_ENV_ACCESS_IN_NODE=false`
- Files: `gsnake-n8n/` configuration (n8n v2.4.6)
- Current mitigation: Secrets stored in n8n credential system; env vars used for webhooks only
- Recommendations: Prefer n8n credentials over $env for secrets; audit all Code nodes for env access; enable `N8N_BLOCK_ENV_ENV_ACCESS_IN_NODE=true` if not needed

## Performance Bottlenecks

**Solver performance: BFS with full cloning per level**
- Problem: Playback generation spawns separate process per level; each process clones entire GameEngine for BFS path exploration
- Files: `gsnake-levels/src/playback_generator.rs` (lines 1-50), `gsnake-levels/src/bin/solve_level.rs`
- Cause: One-process-per-level design + GameEngine Clone trait; no state reuse across solver iterations
- Current capacity: ~50 levels in ~2 minutes; estimated 100ms per level
- Improvement path: Batch multiple levels in single solver process; cache intermediate game states; reduce clone frequency by using references or Rc<>

**Game engine input locking pattern causes frame updates**
- Problem: `process_move()` acquires input lock for one frame; if no move queued, input stays locked until next move
- Files: `gsnake-core/engine/core/src/engine.rs` (lines 61-78)
- Cause: Spin-waiting design for synchronous move processing
- Impact: If player doesn't input for a frame, game state can become inconsistent
- Improvement path: Use a proper frame counter or queue to unlock input after defined cycles; document expected move timing

**Test file count vs coverage: web components undertested**
- Problem: 15 components in gsnake-web/components/ but only 13 test files total; several components have no tests
- Files: `gsnake-web/components/Cell.svelte`, `gsnake-web/components/Header.svelte`, `gsnake-web/components/RestartButton.svelte` (no tests)
- Impact: UI bugs go undetected; refactoring breaks rendering without feedback
- Improvement path: Add component-level unit tests for rendering and event handling; target 80%+ line coverage per file

## Fragile Areas

**WasmGameEngine initialization frame emission pattern**
- Files: `gsnake-web/engine/WasmGameEngine.ts` (lines 100-119)
- Why fragile: WASM `onFrame()` callback only fires on `processMove()`, not on initialization. Code must explicitly call `getFrame()` and emit `frameChanged` event for UI to render. Easy to forget this step.
- Safe modification: Always follow pattern in CLAUDE.md - register callback, then immediately call `getFrame()` and emit. Add comment explaining why. Reference `gsnake-web/engine/CLAUDE.md` in all related code.
- Test coverage: `gsnake-web/tests/unit/WasmGameEngine.test.ts` has pattern coverage but integration test gaps remain

**Level serialization round-trip in editor**
- Files: `gsnake-editor/src/lib/levelModel.ts`, `gsnake-editor/src/tests/EditorLayout.saveLoad.test.ts` (259 lines)
- Why fragile: TypeScript level serialization must handle optional fields (floatingFood, fallingFood, stones, spikes) correctly. Missing or extra fields break game contract.
- Safe modification: Always validate serialized JSON against contract schema after save; add explicit null checks for optional arrays; test all cell type combinations
- Test coverage: saveLoad test is comprehensive (259 lines) but doesn't cover all cell type combinations; add property-based tests

**Server.ts test level validation chain**
- Files: `gsnake-editor/server.ts` (lines 95-152)
- Why fragile: 13 separate validation rules for LevelPayload. Changes to one rule can inadvertently affect others. Error messages must match test expectations.
- Safe modification: Use schema validation library (zod, yup) instead of manual validation; make validation function composable; add type guards for each sub-schema
- Test coverage: `gsnake-editor/src/tests/server.test.ts` has negative-path tests but coverage of edge cases (gridSize 0, negative coordinates) is minimal

**Gravity and stone mechanics physics**
- Files: `gsnake-core/engine/core/src/gravity.rs` (422 lines), `gsnake-core/engine/core/src/stone_mechanics.rs` (238 lines)
- Why fragile: Gravity applies to snake, stones, and falling food in sequence. Order matters; collision detection is position-dependent. Easy to introduce off-by-one errors.
- Safe modification: Test every combination of: empty snake, single segment, multi-segment; stones vs spikes; gravity before/after move. Document order dependency in comments.
- Test coverage: `gsnake-core/engine/core/tests/contract_tests.rs` has gravity tests but stone interaction matrix is incomplete

## Scaling Limits

**Level storage JSON format not optimized for large counts**
- Current capacity: ~500 levels stored as individual JSON files
- Limit: Filesystem scales poorly beyond ~1000 files per directory; metadata sync becomes O(n) disk operations
- Scaling path: Consider TOML-based level registry with lazy-loaded level data; batch multiple levels per file; add level indexing

**Playback generation: sequential solver bottleneck**
- Current capacity: ~50 levels solved in ~2 minutes
- Limit: Single-threaded process; each level blocks until solved
- Scaling path: Implement parallel solver queue; worker pool pattern; cache intermediate solutions

**WASM module size and load time**
- Current capacity: gsnake-wasm pkg is bundled in web binary; loads synchronously
- Limit: WASM module size grows with feature additions; blocks initial page render
- Scaling path: Lazy-load WASM after page interactive; use web workers; consider splitting core + gameplay mechanics into separate modules

## Dependencies at Risk

**Vitest coverage integration fragile**
- Risk: `@vitest/coverage-v8` v1.0.0 in gsnake-web; v4.0.18 in gsnake-editor; different versions may have incompatible config
- Impact: Coverage thresholds enforced in CI may drift or become inconsistent between packages
- Migration plan: Standardize all packages on latest Vitest v4.x; test coverage generation in CI before enforcing thresholds

**Rust test compilation leaning on `unwrap()` pattern**
- Risk: gsnake-core tests use excessive `unwrap()` which panics on failures instead of reporting assertion errors
- Files: `gsnake-core/engine/core/tests/contract_tests.rs` (405 lines), `gsnake-core/engine/core/src/models.rs` (tests)
- Impact: Test failures produce panic messages instead of useful assertion output; hard to debug
- Migration plan: Replace test `unwrap()` with `assert!()` + error message; use `expect()` only for truly unrecoverable setup failures

**n8n version locked to v2.4.6**
- Risk: No automated updates; security patches and feature releases in n8n may not be applied
- Impact: Older n8n versions have security vulnerabilities; workflows may not support newer node types
- Scaling path: Set up automated n8n updates in docker-compose; test migrations against existing workflows; document breaking change handling

## Missing Critical Features

**No input rate limiting in game engine**
- Problem: Server processes all move inputs immediately; burst inputs could trigger frame skips or inconsistent state
- Blocks: Multiplayer/competitive features; client-side prediction; replay accuracy
- Recommendation: Add configurable move queue with max depth; drop oldest if queue full; emit frame updates at fixed tick rate

**No level difficulty progression guarantee**
- Problem: Levels have optional `difficulty` field but no enforcement that Easy < Medium < Hard across the level set
- Blocks: Learning curve guarantee; tutorial structure; achievement-based progression
- Recommendation: Add difficulty validator in CI; emit warning if levels don't progress; consider auto-grading difficulty based on game metrics

**No replay/playback mechanism in web player**
- Problem: Game state is lost when level resets; no way to review how player solved it
- Blocks: Learning from mistakes; teaching moments; speedrun community features
- Recommendation: Capture move sequence during gameplay; store to localStorage; add replay button to load and playback moves

## Test Coverage Gaps

**UI component rendering not fully tested**
- What's not tested: Cell.svelte, Header.svelte, RestartButton.svelte component rendering and props
- Files: `gsnake-web/components/Cell.svelte`, `gsnake-web/components/Header.svelte`, `gsnake-web/components/RestartButton.svelte`
- Risk: Visual bugs go undetected; component refactoring may break without failing tests
- Priority: High - these are core UI elements; visible to every player

**Editor grid interactions missing comprehensive tests**
- What's not tested: Brush tool interactions; multi-cell selections; undo/redo edge cases
- Files: `gsnake-editor/src/lib/GridCanvas.svelte` (no dedicated test file)
- Risk: Editor crashes on edge cases; serialization format corruptions; lost work
- Priority: High - directly blocks level creation

**Server validation error path not fully exercised**
- What's not tested: All 13 validation rules in combination; edge cases like gridSize: 0 or negative coordinates
- Files: `gsnake-editor/server.ts` (lines 95-152)
- Risk: Invalid levels bypass validation; game engine crashes; security issues
- Priority: Medium - validation is critical but edge case density is high

**WASM binding coverage incomplete for new cell types**
- What's not tested: FloatingFood, FallingFood, Stone, Spike serialization/deserialization round-trips
- Files: `gsnake-core/engine/bindings/wasm/src/lib.rs` (399 lines)
- Risk: New cell types may break on serialization; type mismatches between Rust and TypeScript
- Priority: High - blocks new gameplay features

**KeyboardHandler edge cases**
- What's not tested: Rapid key presses (ghosting); modifier keys; non-standard keyboard layouts
- Files: `gsnake-web/engine/KeyboardHandler.ts` (lines 1-50)
- Risk: Some players cannot play due to keyboard handling issues; competitive play unfair
- Priority: Medium - affects accessibility and competitive play

---

*Concerns audit: 2026-02-09*
