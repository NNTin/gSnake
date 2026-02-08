# Git Hooks for gSnake

This directory contains shared git hooks for the parent gSnake repository. Additional hooks are available in submodules (gsnake-editor, gsnake-levels, gsnake-n8n, gsnake-python, gsnake-specs, gsnake-web).

## Quick Start: Enable All Hooks

To enable hooks in the parent repo and all initialized submodules with one command:

```bash
.github/hooks/enable-all-hooks.sh
```

This will:
- Enable hooks in the parent repo (gSnake)
- Enable hooks in all initialized submodules that have `.github/hooks` directories
- Skip submodules that don't have hooks configured
- Provide clear output showing which repos had hooks enabled

## Manual Per-Repo Enablement

If you prefer to enable hooks selectively, you can enable them manually for each repository:

### Parent Repository (gSnake)

From the repo root:

```bash
git config core.hooksPath .github/hooks
```

### Individual Submodules

Navigate to each submodule and run:

```bash
cd <submodule-name>
git config core.hooksPath .github/hooks
cd ..
```

## Verification

Verify that hooks are enabled:

```bash
# Check parent repo
git config --get core.hooksPath

# Check all submodules
git submodule foreach 'git config --get core.hooksPath || echo "(not enabled)"'
```

Expected output for parent repo: `.github/hooks`

## Disabling Hooks

To disable hooks:

```bash
# Parent repo
git config --unset core.hooksPath

# All submodules
git submodule foreach 'git config --unset core.hooksPath'
```

## Available Repositories with Hooks

The following repositories have git hooks available:

- **Parent (gSnake)**: .env secret scan + gsnake-core format/lint/typecheck/build
- **gsnake-editor**: .env secret scan + format/lint/typecheck/build
- **gsnake-levels**: .env secret scan + format/lint/typecheck/build
- **gsnake-n8n**: .env secret scan
- **gsnake-python**: .env secret scan
- **gsnake-specs**: .env secret scan + markdown format/lint
- **gsnake-web**: .env secret scan + format/typecheck/build

**Note**: Submodule hooks are independent and can be enabled selectively. You don't need to enable hooks in all repos.

## Available Hooks

### Parent Repository: pre-commit

The parent repo's pre-commit hook runs secret checks for `.env` first, then validates the **gsnake-core Rust workspace only**. It does NOT check submodules.

The hook runs the following checks:

1. **Secret Scan**:
   - Fails if `.env` is tracked by git
   - Scans tracked files in the working tree for exact matches of `.env` values
   - Reports only `KEY` + `file:line` without printing secret values
   - Optional allowlist file: `.github/hooks/env-key-allowlist.txt` (one key per line)
2. **Format Check**: `cargo fmt --all -- --check` (in `gsnake-core`)
3. **Linter**: `cargo clippy --all-targets -- -D warnings` (in `gsnake-core`, with allowances for pedantic style warnings)
4. **Type Check**: `cargo check` (in `gsnake-core`)
5. **Build**: `cargo build` (in `gsnake-core`)

**Note: Tests are NOT run in pre-commit hooks for speed.** The parent hook also does NOT recurse into submodules. Run `cargo test` and `npm run test:e2e` manually before pushing.

## Notes

- Hooks in `.github/hooks` are versioned and visible to all maintainers
- This updates your local Git config for each repo only (not global)
- If you already use a global hooks path, you can temporarily override it per repo with the commands above
