# scripts/

Build, generation, and tooling scripts for the gSnake monorepo.

## Script Reference

| Script | Description | gSnake (parent) | gsnake-web | gsnake-editor | gsnake-levels | gsnake-n8n | gsnake-python | gsnake-specs |
|--------|-------------|:-----------:|:----------:|:-------------:|:-------------:|:----------:|:-------------:|:------------:|
| `build_core.py` | `cargo build --workspace` in `gsnake-core` | — | — | — | — | — | — | docs only |
| `build_fixture_wasm.sh` | Builds WASM from `e2e/fixtures/levels.json` for E2E fixture isolation | CI (`ci.yml`, `deploy.yml`) | — | — | — | — | — | — |
| `build_wasm.py` | Regenerates `engine/core/data/levels.json` from `gsnake-levels`, then runs `wasm-pack` | CI (`ci.yml`, `deploy.yml`) | CI (`test.yml`) | — | — | — | — | — |
| `contracts/generate-level-definition-validator.mjs` | Compiles `level-definition.schema.json` → `contracts/generated/level-definition-validator.ts` | `package.json` (`generate:level-validator`, `check:level-validator`) | — | — | — | — | — | — |
| `contracts/validate-level-definition-schema.mjs` | Validates all level JSON files against the level-definition schema | `package.json` (`test:level-schema`) | — | — | — | — | — | — |
| `detect-repo-context.sh` | Exports env vars indicating root-repo vs. standalone-submodule context for other scripts | — | — | — | — | — | — | docs only |
| `generate_changelog_input.sh` | Generates a compact changelog input document from git log metadata | manual | — | — | — | — | — | — |
| `generate_ts_types.py` | Runs the `export_ts` binary from `gsnake-core` to emit `types/models.ts` | — | `package.json` (`generate:types`) | — | — | — | — | — |
| `link_web.py` | Updates `gsnake-web/package.json` workspace links for local development | — | — | — | — | — | — | docs only |
| `ralph/ralph.sh` | Long-running AI agent loop (Ralph Wiggum); drives autonomous story implementation | manual | — | — | — | — | — | — |
| `test/test_act.sh` | Runs all GitHub Actions workflows locally via `act` (sequential, slow — avoid direct use) | manual | — | — | — | — | — | — |
| `test_integration.py` | Integration test orchestrator: calls `build_wasm.py` then runs the full E2E suite | — | — | — | — | — | — | docs only |
| `verify_wasm_levels_sync.mjs` | Asserts that the WASM-embedded default levels match the `gsnake-levels` source output | CI (`ci.yml`) | — | — | — | — | — | — |

### Legend

| Symbol | Meaning |
|--------|---------|
| `CI (file.yml)` | Invoked by a GitHub Actions workflow |
| `package.json (script-name)` | Invoked via an npm script |
| `manual` | Run by hand; no automated caller |
| `docs only` | Referenced in documentation/specs but not actively invoked |
| — | Not used in this repo |

## Notes

- **`build_wasm.py`** is the canonical WASM build entry point. It calls `gsnake-levels generate-levels-json` before running `wasm-pack`, ensuring the embedded levels stay in sync with their source definitions.
- **`build_fixture_wasm.sh`** is a parallel build path for E2E tests only — it uses `e2e/fixtures/levels.json` instead of the production levels so fixture-based specs are isolated from mutable defaults.
- **`contracts/`** scripts are coupled: `generate-level-definition-validator.mjs` must be re-run whenever `contracts/level-definition.schema.json` changes; `validate-level-definition-schema.mjs` consumes the generated validator.
- **`ralph/ralph.sh`** is internal autonomous-agent tooling. See `ralph/CLAUDE.md` for the full loop protocol and `scripts/test/CLAUDE.md` for act testing guidance.
