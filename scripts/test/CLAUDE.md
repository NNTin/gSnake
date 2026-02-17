# Act Testing Infrastructure - Claude Instructions

## Overview

This directory contains automated testing infrastructure for running GitHub Actions workflows locally using [nektos/act](https://github.com/nektos/act).  
The act tool performs a remote checkout. Local unpushed commits are not seen. Before using the act tool synchronize the repos.

## Important Rules

### DO NOT Edit Files
- **DO NOT** modify `test_act.sh` without explicit user request
- These scripts are maintained separately and changes may break the testing infrastructure

### DO NOT Run test_act.sh
- **DO NOT** execute `./test_act.sh` directly - it runs ALL jobs sequentially and takes a very long time (30+ minutes)
- Instead, run individual act commands for specific jobs you want to test

## Understanding Test Results

### result.txt
After `test_act.sh` completes, `result.txt` contains:
- Summary of all jobs with SUCCESS/FAILED status
- Full failure logs for any failed jobs
- Job naming format: `<workflow-path>::<job-name>`

Example from result.txt:
```
- [SUCCESS] .github/workflows/ci.yml::test
- [FAILED] gsnake-web/.github/workflows/ci.yml::build
- [FAILED] gsnake-levels/.github/workflows/ci.yml::test
```

## Running Act Commands Directly

### Basic Command Format
```bash
act -W <workflow-path> -j <job-name> --container-architecture linux/amd64
```

### Examples

**Test root repository CI workflow - test job:**
```bash
act -W .github/workflows/ci.yml -j test --container-architecture linux/amd64
```

**Test gsnake-web build job:**
```bash
act -W gsnake-web/.github/workflows/ci.yml -j build --container-architecture linux/amd64
```

**Test gsnake-editor typecheck job:**
```bash
act -W gsnake-editor/.github/workflows/ci.yml -j typecheck --container-architecture linux/amd64
```

**Test gsnake-levels test job:**
```bash
act -W gsnake-levels/.github/workflows/ci.yml -j test --container-architecture linux/amd64
```

**Test gsnake-specs validate job:**
```bash
act -W gsnake-specs/.github/workflows/ci.yml -j validate --container-architecture linux/amd64
```

### Listing Available Jobs

To see all jobs in a workflow without running them:
```bash
act -l -W .github/workflows/ci.yml
act -l -W gsnake-web/.github/workflows/ci.yml
```

### Dependency Audit Workflow
The monorepo dependency-security checks are in `.github/workflows/dependency-audit.yml`:
```bash
act -W .github/workflows/dependency-audit.yml -j npm-audit --container-architecture linux/amd64
act -W .github/workflows/dependency-audit.yml -j cargo-audit --container-architecture linux/amd64
```
Keep this workflow in sync whenever a new `package-lock.json` or `Cargo.lock` is added.

## Common Workflow

1. **Check result.txt** to see which jobs failed:
   ```bash
   cat scripts/test/result.txt
   ```

2. **Run the specific failed job** to investigate:
   ```bash
   # Example: if gsnake-web::build failed
   act -W gsnake-web/.github/workflows/ci.yml -j build --container-architecture linux/amd64
   ```

3. **Fix the underlying issue** in the codebase or workflow

4. **Re-run the specific job** to verify the fix

5. **Only run full test suite** when requested by the user

## Known Issues

### Docker Volume Errors
Act may occasionally fail with Docker volume errors like:
```
Error response from daemon: get act-CI-Test-...-env: no such volume
```

This is a known limitation with act's volume handling. The test script has been updated to run jobs sequentially to minimize these issues, but they may still occur occasionally. If you encounter this, simply re-run the specific job.

### Artifact Upload Token Errors in Act
Jobs that use `actions/upload-artifact` can fail in local `act` runs with:
```
Unable to get the ACTIONS_RUNTIME_TOKEN env variable
```

When this happens, review the preceding job steps to determine whether build/test/coverage work actually passed before the upload step. Treat this as an act runtime limitation unless the same failure reproduces on GitHub Actions.
Where possible, prevent this class of false failures by guarding artifact uploads in workflows with:
```yaml
if: ${{ always() && env.ACT != 'true' }}
```

### Missing npm Scripts
Many submodules show failures for missing npm scripts (test, build, check). This is expected as those submodules may not have these scripts implemented yet. Focus on the jobs that should work based on the actual package.json content.

### Workflow Working Directory Mismatch for Submodule CI
When running a submodule workflow file with `act -W gsnake-web/.github/workflows/ci.yml ...` from monorepo root, jobs that execute repo-relative scripts can fail because `actions/checkout` places files under the current workspace.

Typical symptom:
```
Error: Cannot find module '/.../packages/gsnake-web-app/scripts/detect-local-deps.js'
```

Use the submodule as the working directory for those runs:
```bash
cd gsnake-web
act -W .github/workflows/ci.yml -j typecheck --container-architecture linux/amd64
```

### Missing Git Submodule Ref During Dependency Fetch
`gsnake-levels` workflows can fail in `act` before tests execute when Cargo updates the git dependency `https://github.com/nntin/gsnake?branch=main` and one of that repo's submodule commits is not reachable on the remote yet.

Typical symptom:
```
failed to update submodule `gsnake-specs`
revision <sha> not found
```

Treat this as an external remote-ref availability issue. Record the exact missing SHA in `result.txt`, and use local `cargo check`/`cargo test` as the reliable signal for code-validation in that iteration.

### Root E2E False Negatives from Stale Playwright Processes
For `.github/workflows/ci.yml::e2e-test`, broad sudden failures across many Playwright specs can be environmental in local `act` runs.  
The workflow cleanup step uses `fuser`, but `fuser` may be unavailable in the act container image, leaving host-side Playwright processes alive.

If this happens, clear stale processes and rerun the job:
```bash
pkill -f 'chromium_headless_shell|playwright_chromiumdev_profile' || true
act -W .github/workflows/ci.yml -j e2e-test --container-architecture linux/amd64
```

### Root E2E localhost IPv6 Resolution in Act
In local `act` runs, Playwright API requests may resolve `localhost` to `::1` and fail with:
```
apiRequestContext.post: connect ECONNREFUSED ::1:3001
```

Keep the E2E step env override in `.github/workflows/ci.yml`:
```yaml
NODE_OPTIONS: --dns-result-order=ipv4first
```
and retain `/health` readiness probes for `3000`, `3003`, and `3001` so startup issues and DNS-resolution issues are diagnosable separately.

## Debugging Tips

- Use `-v` flag for verbose output: `act -v -W ... -j ...`
- Check the workflow file itself to understand what the job is trying to do
- Look at the actual error in the act output, not just the exit code
- Remember that act runs in Docker containers - paths and environment may differ from your local machine

## Files in This Directory

- `test_act.sh` - Main test script (runs ALL jobs sequentially)
- `result.txt` - Latest test results summary and failure logs
- `tmp_act_results/` - Temporary directory for job outputs (auto-cleaned)
- `CLAUDE.md` - This file

## When to Use test_act.sh

Only run the full test suite when:
- User explicitly requests it
- You need a complete overview of all workflow statuses
- You're doing final validation before a release

Otherwise, use individual act commands for faster iteration.
