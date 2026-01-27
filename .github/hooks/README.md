# Git hooks via core.hooksPath

This repo stores shared Git hooks in `.github/hooks` so maintainers can opt-in locally.

## One-time setup

From the repo root:

```bash
git config core.hooksPath .github/hooks
```

This updates your local Git config for this repo only (not global).

## Verify

```bash
git config --get core.hooksPath
```

Expected output:

```
.github/hooks
```

## Notes

- Hooks in `.github/hooks` are versioned and visible to all maintainers.
- To disable, run:

```bash
git config --unset core.hooksPath
```

- If you already use a global hooks path, you can temporarily override it per repo with the command above.
