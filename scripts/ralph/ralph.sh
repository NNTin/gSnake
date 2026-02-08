#!/bin/bash
# Ralph Wiggum - Long-running AI agent loop
# Usage: ./ralph.sh [--tool amp|claude] [max_iterations]

set -e

# Parse arguments
TOOL="claude"  # Default to claude
MAX_ITERATIONS=10

while [[ $# -gt 0 ]]; do
  case $1 in
    --tool)
      TOOL="$2"
      shift 2
      ;;
    --tool=*)
      TOOL="${1#*=}"
      shift
      ;;
    *)
      # Assume it's max_iterations if it's a number
      if [[ "$1" =~ ^[0-9]+$ ]]; then
        MAX_ITERATIONS="$1"
      fi
      shift
      ;;
  esac
done

# Validate tool choice
if [[ "$TOOL" != "amp" && "$TOOL" != "claude" ]]; then
  echo "Error: Invalid tool '$TOOL'. Must be 'amp' or 'claude'."
  exit 1
fi
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PRD_FILE="$SCRIPT_DIR/prd.json"
PROGRESS_FILE="$SCRIPT_DIR/progress.txt"
ARCHIVE_DIR="$SCRIPT_DIR/archive"
TEST_ACT_SCRIPT="$SCRIPT_DIR/../test/test_act.sh"
ITERATION_TIMEOUT="${ITERATION_TIMEOUT:-900}"

mkdir -p "$ARCHIVE_DIR"

# Initialize progress file if it doesn't exist
if [ ! -f "$PROGRESS_FILE" ]; then
  echo "# Ralph Progress Log" > "$PROGRESS_FILE"
  echo "Started: $(date)" >> "$PROGRESS_FILE"
  echo "---" >> "$PROGRESS_FILE"
fi

echo "Starting Ralph - Tool: $TOOL - Max iterations: $MAX_ITERATIONS"

for i in $(seq 1 $MAX_ITERATIONS); do
  echo ""
  echo "==============================================================="
  echo "  Ralph Iteration $i of $MAX_ITERATIONS ($TOOL)"
  echo "==============================================================="

  OUTPUT_FILE="$ARCHIVE_DIR/iteration_${i}_$(date +%Y%m%d_%H%M%S).log"
  TIMEOUT_CMD=()
  if command -v timeout >/dev/null 2>&1; then
    # Keep command in foreground process group so TTY reads don't trigger job-control stop.
    TIMEOUT_CMD=(timeout --foreground "$ITERATION_TIMEOUT")
  fi

  # Run the selected tool with the ralph prompt
  set +e
  if [[ "$TOOL" == "amp" ]]; then
    if [[ ! -f "$SCRIPT_DIR/prompt.md" ]]; then
      echo "Error: Missing prompt file at $SCRIPT_DIR/prompt.md"
      exit 1
    fi
    "${TIMEOUT_CMD[@]}" amp --dangerously-allow-all < "$SCRIPT_DIR/prompt.md" 2>&1 | tee "$OUTPUT_FILE"
  else
    # Claude Code: use --dangerously-skip-permissions for autonomous operation, --print for output
    PROMPT_CONTENT="$(cat "$SCRIPT_DIR/CLAUDE.md")"
    # Force non-interactive stdin to avoid blocking on any accidental prompt.
    "${TIMEOUT_CMD[@]}" claude --dangerously-skip-permissions --no-session-persistence --print "$PROMPT_CONTENT" </dev/null 2>&1 | tee "$OUTPUT_FILE"
  fi
  CMD_STATUS=${PIPESTATUS[0]}
  set -e
  OUTPUT="$(cat "$OUTPUT_FILE")"

  if [[ "$CMD_STATUS" -eq 124 || "$CMD_STATUS" -eq 137 ]]; then
    echo ""
    echo "Warning: iteration $i timed out after ${ITERATION_TIMEOUT}s"
  fi
  
  # Check for completion signal
  if echo "$OUTPUT" | grep -q "<promise>COMPLETE</promise>"; then
    echo ""
    echo "Ralph completed all tasks!"
    echo "Completed at iteration $i of $MAX_ITERATIONS"
    exit 0
  fi

  # Run act tests between iterations; never fail the loop if tests fail.
  if [ -f "$TEST_ACT_SCRIPT" ]; then
    bash "$TEST_ACT_SCRIPT" || true
  fi
  
  echo "Iteration $i complete. Continuing..."
  sleep 2
done

echo ""
echo "Ralph reached max iterations ($MAX_ITERATIONS) without completing all tasks."
echo "Check $PROGRESS_FILE for status."
exit 1
