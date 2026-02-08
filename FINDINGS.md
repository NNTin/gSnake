# Codebase Findings

## High Priority

- [x] **Prevent engine panic on invalid grid dimensions**
  - Problem: malformed levels with negative/invalid `gridSize` can trigger allocation panic.
  - Refs: `gsnake-core/engine/core/src/engine.rs`, `gsnake-core/engine/core/src/models.rs`
  - Action: harden frame generation and add validation/tests.

- [x] **Fix `generate-levels-json` sync path inconsistency**
  - Problem: metadata sync assumes cwd-local `levels/` and fails from root invocations.
  - Refs: `gsnake-levels/src/generate.rs`, `gsnake-levels/src/sync_metadata.rs`, `gsnake-levels/src/levels.rs`
  - Action: pass resolved levels/playbacks roots into sync flow.

## Medium Priority

- [x] **Sanitize `?level=` query parsing in web app**
  - Problem: `NaN` can bypass bounds checks and break initialization.
  - Refs: `gsnake-web/components/App.svelte`, `gsnake-web/engine/WasmGameEngine.ts`
  - Action: normalize to validated positive integer with safe fallback.

- [x] **Improve solver/playback generation performance**
  - Problem: process-spawn per level and BFS cloning pattern create avoidable overhead.
  - Refs: `gsnake-levels/src/playback_generator.rs`, `gsnake-levels/src/bin/solve_level.rs`
  - Action: remove redundant work now; larger solver refactor next.

- [x] **Update stale contract tests for new `CellType` variants**
  - Problem: tests omit `FloatingFood`, `FallingFood`, `Stone`, `Spike`.
  - Refs: `gsnake-web/tests/contract/types.test.ts`, `gsnake-web/tests/contract/enums.test.ts`, `gsnake-web/tests/contract/fixtures.test.ts`
  - Action: expand allowed enum sets and assertions.

- [x] **Unify editor level ID type with runtime contract**
  - Problem: editor emits string IDs while core/web contract is numeric.
  - Refs: `gsnake-editor/src/lib/EditorLayout.svelte`, `gsnake-editor/src/lib/types.ts`, `gsnake-web/types/models.ts`
  - Action: align schema across editor/core/web.

## Low Priority

- [x] **Remove dead web entry artifacts**
  - Problem: empty `index.tsx` and unused import map entries in HTML.
  - Refs: `gsnake-web/index.html`, `gsnake-web/index.tsx`
  - Action: trim unused entry/config.

- [x] **Make `gsnake-core` clippy-clean under strict warnings**
  - Problem: strict clippy currently fails on style and pointer-arg warnings.
  - Refs: `gsnake-core/engine/core/examples/test_serialization.rs`, `gsnake-core/engine/core/tests/contract_tests.rs`
  - Action: clean warnings or scope lint levels for examples/tests.

## Test Coverage Plan

- [x] **Enable JS coverage tooling in web/editor**
  - Evidence: `vitest --coverage` fails due missing `@vitest/coverage-v8` in both packages.
  - Refs: `gsnake-web/package.json`, `gsnake-editor/package.json`, `gsnake-web/vitest.config.ts`, `gsnake-editor/vitest.config.ts`
  - Action: install coverage provider and add `test:coverage` scripts.

- [x] **Enable Rust coverage tooling in core/levels**
  - Evidence: `cargo llvm-cov` is not installed and `llvm-tools-preview` is unavailable.
  - Refs: `gsnake-core/Cargo.toml`, `gsnake-levels/Cargo.toml`
  - Action: add CI setup (`cargo-llvm-cov`, `llvm-tools-preview`) and coverage commands.

- [x] **Add coverage jobs to CI workflows**
  - Evidence: current workflows run tests/build/typecheck but no coverage artifacts/thresholds.
  - Refs: `.github/workflows/ci.yml`, `gsnake-web/.github/workflows/ci.yml`, `gsnake-editor/.github/workflows/ci.yml`, `gsnake-levels/.github/workflows/ci.yml`
  - Action: add non-blocking coverage jobs and upload artifacts for baseline.

- [x] **Set and ratchet per-package thresholds**
  - Evidence: thresholds are now enforced in Vitest and Rust coverage jobs.
  - Refs: `gsnake-web/vitest.config.ts`, `gsnake-editor/vitest.config.ts`, CI workflows
  - Action: collect baseline, set initial floor just below baseline, then tighten incrementally.
  - Baseline collected (local):
    - `gsnake-web`: `30.01%` statements / `30.01%` lines.
    - `gsnake-editor`: `61.76%` statements / `60.60%` lines.
    - `gsnake-core` workspace: `56.18%` regions / `57.68%` lines.
    - `gsnake-levels`: `62.18%` regions / `65.00%` lines.
  - Enforced floor:
    - `gsnake-web`: lines `12`, statements `12`, functions `30`, branches `45`
    - `gsnake-editor`: lines `60`, statements `60`, functions `75`, branches `40`
    - `gsnake-core`: `--fail-under-lines 55`
    - `gsnake-levels`: `--fail-under-lines 62`

- [ ] **Close highest-risk test gaps**
  - Evidence: web now has 7 test files for 19 source files; editor has 4 test files for 17 source files.
  - Refs: `gsnake-web/components/App.svelte`, `gsnake-web/engine/WasmGameEngine.ts`, `gsnake-web/engine/KeyboardHandler.ts`, `gsnake-editor/src/lib/EditorLayout.svelte`, `gsnake-editor/src/lib/GridCanvas.svelte`
  - Action: prioritize behavioral tests for initialization, URL/custom-level loading, editor serialization, and grid interactions.
  - Progress: added `gsnake-web/tests/unit/CompletionTracker.test.ts`, `gsnake-web/tests/unit/KeyboardHandler.test.ts`, `gsnake-web/tests/unit/WasmGameEngine.test.ts`, and `gsnake-web/tests/unit/stores.test.ts`.

### Architectural Approach

- Use per-package coverage first, then optionally aggregate at root.
- Roll out in 2 stages: report-only (no failure) then enforced thresholds.
- Keep Rust and Vitest coverage independent in CI to avoid fragile cross-tool coupling.
- Current blockers found:
- gsnake-web and gsnake-editor: vitest --coverage fails because @vitest/coverage-v8 is missing.

### Data Model

- Store raw reports as artifacts per package:
- gsnake-web: coverage/coverage-summary.json, coverage/lcov.info
- gsnake-editor: coverage/coverage-summary.json, coverage/lcov.info
- gsnake-core: target/llvm-cov/ (lcov + html + json)
- gsnake-levels: target/llvm-cov/ (lcov + html + json)
- Add one baseline file (for ratcheting): artifacts/coverage/baseline.json
- Track at least: line %, branch %, function %, statement % per package.

### Component Architecture

- gsnake-web (gsnake-web/package.json, gsnake-web/vitest.config.ts):
- Add @vitest/coverage-v8
- Add test:coverage script
- Add include/exclude + thresholds in Vitest config
- gsnake-editor (gsnake-editor/package.json, gsnake-editor/vitest.config.ts):
- Same coverage setup as web
- gsnake-core and gsnake-levels:
- Add CI steps for rustup component add llvm-tools-preview
- Install cargo-llvm-cov
- Run cargo llvm-cov --workspace --all-targets --lcov --output-path ...
- CI workflows:
- Add non-blocking coverage jobs in .github/workflows/ci.yml, gsnake-web/.github/workflows/ci.yml, gsnake-editor/.github/workflows/ci.yml, gsnake-levels/.github/workflows/ci.yml
- Upload artifacts; enforce thresholds only after baseline is captured.
- Priority test-gap targets:
- gsnake-web/components/App.svelte
- gsnake-web/engine/WasmGameEngine.ts
- gsnake-web/engine/KeyboardHandler.ts
- gsnake-editor/src/lib/EditorLayout.svelte
- gsnake-editor/src/lib/GridCanvas.svelte

---

Test Coverage Threshold:
- gsnake-web/vitest.config.ts
- gsnake-editor/vitest.config.ts
- .github/workflows/ci.yml
- gsnake-levels/.github/workflows/ci.yml

Thresholds needs to be increased. It is too low.
