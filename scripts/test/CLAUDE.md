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

### Missing npm Scripts
Many submodules show failures for missing npm scripts (test, build, check). This is expected as those submodules may not have these scripts implemented yet. Focus on the jobs that should work based on the actual package.json content.

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
