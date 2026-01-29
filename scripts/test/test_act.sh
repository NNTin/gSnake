#!/usr/bin/env bash

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
RESULT_FILE="${SCRIPT_DIR}/result.txt"
TEMP_DIR="${SCRIPT_DIR}/tmp_act_results"

# Clean up any previous runs
rm -rf "${TEMP_DIR}"
mkdir -p "${TEMP_DIR}"
> "${RESULT_FILE}"

cd "${REPO_ROOT}"

# Find all ci.yml workflow files
WORKFLOWS=()
if [[ -f ".github/workflows/ci.yml" ]]; then
    WORKFLOWS+=(".github/workflows/ci.yml")
fi
if [[ -f "gsnake-web/.github/workflows/ci.yml" ]]; then
    WORKFLOWS+=("gsnake-web/.github/workflows/ci.yml")
fi
if [[ -f "gsnake-core/.github/workflows/ci.yml" ]]; then
    WORKFLOWS+=("gsnake-core/.github/workflows/ci.yml")
fi
if [[ -f "gsnake-editor/.github/workflows/ci.yml" ]]; then
    WORKFLOWS+=("gsnake-editor/.github/workflows/ci.yml")
fi
if [[ -f "gsnake-levels/.github/workflows/ci.yml" ]]; then
    WORKFLOWS+=("gsnake-levels/.github/workflows/ci.yml")
fi
if [[ -f "gsnake-specs/.github/workflows/ci.yml" ]]; then
    WORKFLOWS+=("gsnake-specs/.github/workflows/ci.yml")
fi

if [[ ${#WORKFLOWS[@]} -eq 0 ]]; then
    echo "No ci.yml workflows found!"
    exit 1
fi

# Array to store job information
declare -a JOB_NAMES=()

echo "=== Act CI Test Results ===" > "${RESULT_FILE}"
echo "Started: $(date)" >> "${RESULT_FILE}"
echo "" >> "${RESULT_FILE}"

# Function to run a single job
run_job() {
    local workflow="$1"
    local job="$2"
    local output_file="$3"
    local status_file="$4"

    if act -W "${workflow}" -j "${job}" --container-architecture linux/amd64 > "${output_file}" 2>&1; then
        echo "SUCCESS" > "${status_file}"
    else
        echo "FAILED" > "${status_file}"
    fi
}

# Discover and run all jobs sequentially
echo "Discovering jobs..."
for workflow in "${WORKFLOWS[@]}"; do
    if [[ ! -f "${workflow}" ]]; then
        continue
    fi

    # Get list of jobs for this workflow
    jobs=$(act -l -W "${workflow}" 2>/dev/null | tail -n +2 | awk '{print $2}' || true)

    if [[ -z "${jobs}" ]]; then
        continue
    fi

    for job in ${jobs}; do
        job_name="${workflow}::${job}"
        output_file="${TEMP_DIR}/${workflow//\//_}_${job}.log"
        status_file="${TEMP_DIR}/${workflow//\//_}_${job}.status"

        echo "  Running: ${job_name}"
        run_job "${workflow}" "${job}" "${output_file}" "${status_file}"
        JOB_NAMES+=("${job_name}")
    done
done

if [[ ${#JOB_NAMES[@]} -eq 0 ]]; then
    echo "No jobs found to run!"
    exit 1
fi

echo ""
echo "All ${#JOB_NAMES[@]} jobs completed!"
echo ""

# Generate summary
echo "## Summary" >> "${RESULT_FILE}"
echo "" >> "${RESULT_FILE}"

declare -a FAILED_JOBS=()
success_count=0
fail_count=0

for job_name in "${JOB_NAMES[@]}"; do
    workflow="${job_name%%::*}"
    job="${job_name##*::}"
    status_file="${TEMP_DIR}/${workflow//\//_}_${job}.status"

    if [[ -f "${status_file}" ]]; then
        status=$(cat "${status_file}")
        echo "- [${status}] ${job_name}" >> "${RESULT_FILE}"

        if [[ "${status}" == "FAILED" ]]; then
            FAILED_JOBS+=("${job_name}")
            fail_count=$((fail_count + 1))
        else
            success_count=$((success_count + 1))
        fi
    else
        echo "- [UNKNOWN] ${job_name}" >> "${RESULT_FILE}"
        FAILED_JOBS+=("${job_name}")
        fail_count=$((fail_count + 1))
    fi
done

echo "" >> "${RESULT_FILE}"
echo "**Total: ${success_count} passed, ${fail_count} failed**" >> "${RESULT_FILE}"

# If there are failures, append logs
if [[ ${#FAILED_JOBS[@]} -gt 0 ]]; then
    echo "" >> "${RESULT_FILE}"
    echo "---" >> "${RESULT_FILE}"
    echo "" >> "${RESULT_FILE}"
    echo "## Failure Logs" >> "${RESULT_FILE}"
    echo "" >> "${RESULT_FILE}"

    for job_name in "${FAILED_JOBS[@]}"; do
        workflow="${job_name%%::*}"
        job="${job_name##*::}"
        output_file="${TEMP_DIR}/${workflow//\//_}_${job}.log"

        echo "### ${job_name}" >> "${RESULT_FILE}"
        echo "" >> "${RESULT_FILE}"
        echo '```' >> "${RESULT_FILE}"
        if [[ -f "${output_file}" ]]; then
            cat "${output_file}" >> "${RESULT_FILE}"
        else
            echo "Log file not found" >> "${RESULT_FILE}"
        fi
        echo '```' >> "${RESULT_FILE}"
        echo "" >> "${RESULT_FILE}"
    done
fi

# Add completion timestamp
echo "" >> "${RESULT_FILE}"
echo "---" >> "${RESULT_FILE}"
echo "Completed: $(date)" >> "${RESULT_FILE}"

# Display results
echo ""
echo "========================================"
cat "${RESULT_FILE}"
echo "========================================"
echo ""
echo "Full results saved to: ${RESULT_FILE}"

# Clean up temp directory
rm -rf "${TEMP_DIR}"

# Exit with failure if any jobs failed
if [[ ${#FAILED_JOBS[@]} -gt 0 ]]; then
    echo ""
    echo "❌ ${fail_count} job(s) failed"
    exit 1
else
    echo ""
    echo "✅ All ${success_count} jobs passed!"
    exit 0
fi
