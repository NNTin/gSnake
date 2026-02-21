#!/usr/bin/env bash
set -euo pipefail

# Generate a compact changelog input document from git metadata.
#
# Usage:
#   scripts/generate_changelog_input.sh [RANGE]
#
# Examples:
#   scripts/generate_changelog_input.sh v1.2.3..HEAD
#   scripts/generate_changelog_input.sh
#
# Output:
#   tmp/changelog-input.md

ROOT_DIR="$(git rev-parse --show-toplevel)"
cd "$ROOT_DIR"

RANGE="${1:-}"
if [[ -z "$RANGE" ]]; then
  if latest_tag="$(git describe --tags --abbrev=0 2>/dev/null)"; then
    RANGE="${latest_tag}..HEAD"
  else
    echo "error: no range provided and no tags found." >&2
    echo "usage: scripts/generate_changelog_input.sh <from..to>" >&2
    exit 1
  fi
fi

if ! git rev-list -1 "$RANGE" >/dev/null 2>&1; then
  echo "error: invalid git range: $RANGE" >&2
  exit 1
fi

mkdir -p tmp
OUT_FILE="tmp/changelog-input.md"

NOW="$(date -u +"%Y-%m-%d %H:%M:%S UTC")"
FROM_REF="${RANGE%%..*}"
TO_REF="${RANGE##*..}"

SHORTSTAT="$(git diff --shortstat "$RANGE" || true)"
DIRSTAT="$(git diff --dirstat=files,5,cumulative "$RANGE" || true)"
COMMIT_COUNT="$(git rev-list --count --first-parent --no-merges "$RANGE")"

{
  echo "# Changelog Input"
  echo
  echo "Generated: $NOW"
  echo "Range: $RANGE"
  echo "From: $FROM_REF"
  echo "To: $TO_REF"
  echo
  echo "## Quick Stats"
  echo
  echo "- Commits (first-parent, no merges): $COMMIT_COUNT"
  echo "- Diff shortstat: ${SHORTSTAT:-n/a}"
  echo
  echo "### Directory Impact (>=5% of changed files)"
  echo
  if [[ -n "$DIRSTAT" ]]; then
    echo '```'
    echo "$DIRSTAT"
    echo '```'
  else
    echo "(no directory impact data)"
  fi
  echo
  echo "## Commit Subjects"
  echo
  git log "$RANGE" \
    --first-parent \
    --no-merges \
    --date=short \
    --pretty=tformat:'- %s (%h, %ad, %an)'
  echo
  echo
  echo "## Top Changed Files (frequency)"
  echo
  FILE_HOTSPOTS="$(git log "$RANGE" --name-only --pretty=format: | sed '/^$/d' | sort | uniq -c | sort -rn | head -n 30 || true)"
  if [[ -n "$FILE_HOTSPOTS" ]]; then
    echo '```'
    echo "$FILE_HOTSPOTS"
    echo '```'
  else
    echo "(no changed files found)"
  fi
  echo
  echo "## Contributors"
  echo
  CONTRIBUTORS="$(git shortlog -sne "$RANGE" || true)"
  if [[ -n "$CONTRIBUTORS" ]]; then
    echo '```'
    echo "$CONTRIBUTORS"
    echo '```'
  else
    echo "(no contributor data)"
  fi
  echo
  echo "## Submodule Updates"
  echo
  SUBMODULE_LINES="$(git diff --raw "$RANGE" | awk '($1 ~ /^:160000$/ || $2 == "160000") {print $6" "$3" "$4}' || true)"
  if [[ -z "$SUBMODULE_LINES" ]]; then
    echo "(no submodule updates)"
  else
    echo '```'
    while IFS= read -r line; do
      [[ -z "$line" ]] && continue
      SUB_PATH="$(awk '{print $1}' <<< "$line")"
      SUB_OLD="$(awk '{print $2}' <<< "$line")"
      SUB_NEW="$(awk '{print $3}' <<< "$line")"
      echo "$SUB_PATH $SUB_OLD..$SUB_NEW"
    done <<< "$SUBMODULE_LINES"
    echo '```'
    echo
    echo "### Submodule Commit Details"
    echo
    while IFS= read -r line; do
      [[ -z "$line" ]] && continue
      SUB_PATH="$(awk '{print $1}' <<< "$line")"
      SUB_OLD="$(awk '{print $2}' <<< "$line")"
      SUB_NEW="$(awk '{print $3}' <<< "$line")"

      echo "#### $SUB_PATH ($SUB_OLD..$SUB_NEW)"
      echo

      if [[ -d "$SUB_PATH" ]]; then
        SUB_OLD_FULL="$(git rev-parse "$FROM_REF:$SUB_PATH" 2>/dev/null || echo "$SUB_OLD")"
        SUB_NEW_FULL="$(git rev-parse "$TO_REF:$SUB_PATH" 2>/dev/null || echo "$SUB_NEW")"

        if [[ "$SUB_OLD_FULL" =~ ^0+$ ]]; then
          echo "(submodule added in range; showing latest commits up to $SUB_NEW_FULL)"
          SUB_LOG="$(git -C "$SUB_PATH" log --oneline --no-merges --max-count 20 "$SUB_NEW_FULL" 2>/dev/null || true)"
        else
          SUB_LOG="$(git -C "$SUB_PATH" log --oneline --no-merges --max-count 20 "$SUB_OLD_FULL..$SUB_NEW_FULL" 2>/dev/null || true)"
        fi

        if [[ -n "$SUB_LOG" ]]; then
          echo '```'
          echo "$SUB_LOG"
          echo '```'
        else
          echo "(unable to resolve submodule commit log locally)"
        fi
      else
        echo "(submodule path not present locally)"
      fi
      echo
    done <<< "$SUBMODULE_LINES"
  fi
} > "$OUT_FILE"

echo "wrote $OUT_FILE"