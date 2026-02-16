# Dependency Maintenance and Security Audit Policy

## Purpose

This policy defines ownership, update cadence, and incident handling for third-party dependencies in the `gSnake` monorepo.

## Ownership

Dependency maintenance is owned by repository maintainers. Ownership is tracked by lockfile scope:

| Scope | Lockfiles | Primary owner |
| --- | --- | --- |
| Root tooling | `package-lock.json` | Monorepo maintainers |
| Web app | `gsnake-web/package-lock.json` | `gsnake-web` maintainers |
| Editor | `gsnake-editor/package-lock.json` | `gsnake-editor` maintainers |
| Specs docs tooling | `gsnake-specs/package-lock.json` | `gsnake-specs` maintainers |
| Core engine | `gsnake-core/Cargo.lock` | `gsnake-core` maintainers |
| Levels tooling | `gsnake-levels/Cargo.lock` | `gsnake-levels` maintainers |

## Cadence

1. Automated dependency audits run weekly on Monday at 09:00 UTC via `.github/workflows/dependency-audit.yml`.
2. Maintainers should also trigger the audit workflow manually before release tags.
3. Lockfile updates should be batched at least monthly per scope, even if no audit alert is currently open.

## Automated Security Checks

The dependency audit workflow runs:

- `npm audit --package-lock-only --audit-level=high` for:
  - `package-lock.json`
  - `gsnake-web/package-lock.json`
  - `gsnake-editor/package-lock.json`
  - `gsnake-specs/package-lock.json`
- `cargo audit --file <Cargo.lock>` for:
  - `gsnake-core/Cargo.lock`
  - `gsnake-levels/Cargo.lock`

## Audit Failure Handling

When an audit job fails:

1. Open or update a tracking issue on the same day, linking the failed workflow run.
2. Classify each finding by severity and runtime exposure:
   - High/Critical reachable at runtime: patch or mitigate within 7 days.
   - High/Critical not runtime-reachable: document proof and target fix within 30 days.
   - Moderate/Low: schedule into the next regular dependency update batch.
3. If no immediate upgrade path exists, document temporary mitigation and accepted risk in the tracking issue.
4. After upgrades or mitigations, rerun `.github/workflows/dependency-audit.yml` and link the passing run in the issue before closing.

## Scope Updates

Whenever a new `package-lock.json` or `Cargo.lock` is added to the repo, update:

1. `.github/workflows/dependency-audit.yml`
2. The ownership table in this document
