# LevelDefinition Contract

This directory holds the canonical `LevelDefinition` schema shared across gSnake runtimes and tooling.

## Canonical Artifact

- Schema: `contracts/level-definition.schema.json`
- Fixtures: `contracts/fixtures/*.json`
- Validation runner: `scripts/contracts/validate-level-definition-schema.mjs`

## Ownership

- Primary owners: engine contract maintainers in `gsnake-core/engine/core`.
- Any change to `LevelDefinition` fields or semantics must update:
  - `gsnake-core/engine/core/src/models.rs`
  - `contracts/level-definition.schema.json`
  - `contracts/fixtures/*.json`

## Derived Validators / Guards

Consumers should derive validators/guards from the canonical schema instead of maintaining ad-hoc copies.

- TypeScript services/tests: compile this schema with `ajv` and reuse the compiled validator.
- Rust/runtime types: keep `serde` contracts aligned with schema field names and optionality.
- E2E/tests: import a generated/shared validator wrapper rather than duplicating `isLevelDefinition` guards.

## Regeneration / Verification Workflow

1. Update schema and fixtures in this directory.
2. Regenerate or refresh consumer-side validators/guards from this schema.
3. Run:

```bash
npm run test:level-schema
```

This check fails if valid fixtures are rejected or invalid fixtures are accepted.
