# Ralph Agent Instructions

You are an autonomous coding agent working on a software project.

## Your Task

1. Read the PRD at `scripts/ralph/prd.json` (in the same directory as this file)
2. Read the progress log at `scripts/ralph/progress.txt` (check Codebase Patterns section first)
3. CI pipeline status can be seen in `scripts/test/result.txt` and is refreshed in each iteration.
   Do not run `scripts/test/test_act.sh`. Use `act -W <workflow-path> -j <job-name> --container-architecture linux/amd64` to run individual tests.
4. a) Pick the **highest priority** user story where `passes: false`
4. b) If all user stories are `passes: true`: check CI pipeline status
5. Implement that single user story
6. Run quality checks (e.g., typecheck, lint, test - use whatever your project requires)
7. Update CLAUDE.md files if you discover reusable patterns (see below)
8. If checks pass, commit ALL changes with message: `feat: [Story ID] - [Story Title]`
9. Update the PRD to set `passes: true` for the completed story
10. Append your progress to `progress.txt`
11. when committing always git push. Git submodules exist, so they are updated first. CI pipeline status from 3. depends on pushed source.

## Progress Report Format

APPEND to progress.txt (never replace, always append):
```
## [Date/Time] - [Story ID]
- What was implemented
- Files changed
- **Learnings for future iterations:**
  - Patterns discovered (e.g., "this codebase uses X for Y")
  - Gotchas encountered (e.g., "don't forget to update Z when changing W")
  - Useful context (e.g., "the evaluation panel is in component X")
---
```

The learnings section is critical - it helps future iterations avoid repeating mistakes and understand the codebase better.

## Consolidate Patterns

If you discover a **reusable pattern** that future iterations should know, add it to the `## Codebase Patterns` section at the TOP of progress.txt (create it if it doesn't exist). This section should consolidate the most important learnings:

```
## Codebase Patterns
- Example: Use `sql<number>` template for aggregations
- Example: Always use `IF NOT EXISTS` for migrations
- Example: Export types from actions.ts for UI components
```

Only add patterns that are **general and reusable**, not story-specific details.

## Update CLAUDE.md Files

Before committing, check if any edited files have learnings worth preserving in nearby CLAUDE.md files:

1. **Identify directories with edited files** - Look at which directories you modified
2. **Check for existing CLAUDE.md** - Look for CLAUDE.md in those directories or parent directories
3. **Add valuable learnings** - If you discovered something future developers/agents should know:
   - API patterns or conventions specific to that module
   - Gotchas or non-obvious requirements
   - Dependencies between files
   - Testing approaches for that area
   - Configuration or environment requirements
   - the file scripts/test/result.txt should be included in the commit

**Examples of good CLAUDE.md additions:**
- "When modifying X, also update Y to keep them in sync"
- "This module uses pattern Z for all API calls"
- "Tests require the dev server running on PORT 3000"
- "Field names must match the template exactly"

**Do NOT add:**
- Story-specific implementation details
- Temporary debugging notes
- Information already in progress.txt

Only update CLAUDE.md if you have **genuinely reusable knowledge** that would help future work in that directory.

## Quality Requirements

- ALL commits must pass your project's quality checks (typecheck, lint, test)
- Do NOT commit broken code
- Keep changes focused and minimal
- Follow existing code patterns

## Browser Testing (If Available)

For any story that changes UI, verify it works in the browser if you have browser testing tools configured (e.g., via MCP):

1. Navigate to the relevant page
2. Verify the UI changes work as expected
3. Take a screenshot if helpful for the progress log

If no browser tools are available, note in your progress report that manual browser verification is needed.

## Reusable Repository Patterns

- For `gsnake-levels validate-levels-toml`, keep validation output aggregated and deterministic (`[io]`, `[parse]`, `[validation]` with numbered lines) so one run reports all actionable issues and tests can assert stable CLI output.

## Tooling for Agents

### `chunkhound` (code search/research)

Use `chunkhound` first when you need to find implementation details quickly across the repo.

Recommended workflow:

```bash
# 1) Index a target directory
chunkhound index .

# 2) Fast exact/pattern lookups (works with --no-embeddings indexes too)
chunkhound search "gsnake" . --regex --page-size 10

# 3) Semantic search (requires embedding provider configured)
chunkhound search "levels" . --semantic --page-size 10

# 4) Deep synthesis (requires BOTH LLM + embeddings/reranking configured)
chunkhound research "What are the required CI and commit steps?" .
```

Important caveats:
- `--no-embeddings` is fine for indexing and `--regex` search, but `--semantic` and `research` will fail without embeddings.
- `research` also requires an LLM provider (`llm` config or env vars), in addition to embeddings.
- Avoid running multiple chunkhound commands against the same DuckDB file concurrently; it can fail with lock errors.
- Use `--include` / `--exclude` on `index` and `--path-filter` on `search` to keep results focused and fast.
- `chunkhound mcp --help` shows how to run it as an MCP server if you want tool-server integration.

### `agent-browser` (webserver/browser interaction)

Use `agent-browser` for live page interaction and verification (open, snapshot, click, fill, screenshot, etc.).

Helpful setup + usage:

```bash
# Install browser binaries once per machine
agent-browser install

# Start a CDP-capable browser (example with Playwright-managed Chromium)
CHROME_BIN=$(find ~/.cache/ms-playwright -type f -path '*/chrome-linux64/chrome' | sort | tail -n 1)
"$CHROME_BIN" \
  --headless=new \
  --remote-debugging-port=9222 \
  --no-first-run \
  --no-default-browser-check \
  --user-data-dir=/tmp/agent-browser-cdp

# Connect agent-browser session to that running browser
agent-browser --session demo connect 9222

# Navigate and inspect
agent-browser --session demo open https://example.com
agent-browser --session demo snapshot -i -c -d 2
agent-browser --session demo click @e1
agent-browser --session demo get url
agent-browser --session demo screenshot /tmp/demo.png
agent-browser --session demo close
```

Agent-browser notes:
- The command set is rich (`open`, `snapshot`, `click`, `fill`, `press`, `get`, `is`, `find`, `network`, `cookies`, `storage`, `tab`, `record`, `trace`).
- Use refs from `snapshot` output (e.g. `@e1`) for reliable actions.
- In this environment, connecting via `agent-browser connect <port|url>` to a running CDP browser is reliable for session startup.
- Prefer `wait --load domcontentloaded|networkidle`, `wait --url`, or `wait --text` before asserting navigation-dependent state.

## Stop Condition

The ralph loop is stopped automatically when `scripts/ralph/prd.json` has been completed.

## Important

- Work on ONE story per iteration
- Commit frequently
- Keep CI green
- Read the Codebase Patterns section in progress.txt before starting
