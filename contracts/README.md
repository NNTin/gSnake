# LevelDefinition Contract

This directory holds the canonical `LevelDefinition` schema shared across gSnake runtimes and tooling.

## Canonical Artifact

- Schema: `contracts/level-definition.schema.json`
- Semantics: `contracts/level-definition-semantics.md`
- Fixtures: `contracts/fixtures/*.json`
- Generated validator: `contracts/generated/level-definition-validator.ts`
- Validation runner: `scripts/contracts/validate-level-definition-schema.mjs`
- Generator: `scripts/contracts/generate-level-definition-validator.mjs`

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
2. Regenerate the shared validator from repo root:

```bash
npm run generate:level-validator
```

3. Verify generated validator and schema fixtures:

```bash
npm run test:level-schema
```

This check fails if valid fixtures are rejected or invalid fixtures are accepted.
