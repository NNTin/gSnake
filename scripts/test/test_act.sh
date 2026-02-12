#!/usr/bin/env bash

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
RESULT_FILE="${SCRIPT_DIR}/result.txt"
TEMP_DIR="${SCRIPT_DIR}/tmp_act_results"

# Timing
START_TIME="$(date)"
START_EPOCH="$(date +%s)"

# Clean up any previous runs
rm -rf "${TEMP_DIR}"
mkdir -p "${TEMP_DIR}"
> "${RESULT_FILE}"

cd "${REPO_ROOT}"

# Find all GitHub Actions workflow files recursively
mapfile -t WORKFLOWS < <(
  find . -type f \
    \( -path "*/.github/workflows/*.yml" -o -path "*/.github/workflows/*.yaml" \) \
    -not -path "*/.github/workflows/deploy.yml" \
    -not -path "*/node_modules/*"
)

# Normalize paths (remove leading ./)
# WORKFLOWS=("${WORKFLOWS[@]#./}")

if [[ ${#WORKFLOWS[@]} -eq 0 ]]; then
    echo "No workflows found. Exiting."
    exit 1
fi

# Array to store job information
declare -a JOB_NAMES=()
declare -A JOB_REPO_DIRS=()
declare -A JOB_WORKFLOW_RELS=()

echo "=== Act CI Test Results ===" > "${RESULT_FILE}"
echo "Started: $(date)" >> "${RESULT_FILE}"
echo "" >> "${RESULT_FILE}"

# Function to run a single job
run_job() {
    local repo_dir="$1"
    local workflow_rel="$2"
    local job="$3"
    local output_file="$4"
    local status_file="$5"

    if (
        cd "${repo_dir}" &&
        act -W "${workflow_rel}" -j "${job}" --container-architecture linux/amd64 > "${output_file}" 2>&1
    ); then
        echo "SUCCESS" > "${status_file}"
    else
        echo "FAILED" > "${status_file}"
    fi
}

# Discover all jobs
for workflow in "${WORKFLOWS[@]}"; do
    if [[ ! -f "${workflow}" ]]; then
        continue
    fi

    repo_dir="${workflow%%/.github/workflows/*}"
    if [[ -z "${repo_dir}" ]]; then
        repo_dir="."
    fi
    if grep -Eq "repository:[[:space:]]*NNTin/gSnake" "${workflow}"; then
        repo_dir="."
    fi
    if [[ "${workflow}" == "./gsnake-specs/.github/workflows/test.yml" ]]; then
        repo_dir="."
    fi

    if [[ "${repo_dir}" == "." ]]; then
        workflow_rel="${workflow#./}"
    else
        workflow_rel="${workflow#${repo_dir}/}"
    fi

    # Get list of jobs for this workflow
    jobs=$(
        (
            cd "${repo_dir}" &&
            act -l -W "${workflow_rel}" 2>/dev/null | tail -n +2 | awk '{print $2}'
        ) || true
    )

    if [[ -z "${jobs}" ]]; then
        continue
    fi

    for job in ${jobs}; do
        job_name="${workflow}::${job}"
        JOB_NAMES+=("${job_name}")
        JOB_REPO_DIRS["${job_name}"]="${repo_dir}"
        JOB_WORKFLOW_RELS["${job_name}"]="${workflow_rel}"
    done
done

if [[ ${#JOB_NAMES[@]} -eq 0 ]]; then
    echo "No jobs found to run. Exiting."
    exit 1
fi

# Run all jobs sequentially
total_jobs=${#JOB_NAMES[@]}
job_index=0
for job_name in "${JOB_NAMES[@]}"; do
    job_index=$((job_index + 1))
    workflow="${job_name%%::*}"
    job="${job_name##*::}"
    repo_dir="${JOB_REPO_DIRS["${job_name}"]}"
    workflow_rel="${JOB_WORKFLOW_RELS["${job_name}"]}"
    output_file="${TEMP_DIR}/${workflow//\//_}_${job}.log"
    status_file="${TEMP_DIR}/${workflow//\//_}_${job}.status"

    echo "  Running: ${job_name} (${job_index} of ${total_jobs})"
    run_job "${repo_dir}" "${workflow_rel}" "${job}" "${output_file}" "${status_file}"
done

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

# Display results
END_TIME="$(date)"
END_EPOCH="$(date +%s)"
RUN_DURATION=$((END_EPOCH - START_EPOCH))
RUN_DURATION_FMT="$(printf '%02d:%02d:%02d' $((RUN_DURATION / 3600)) $(((RUN_DURATION % 3600) / 60)) $((RUN_DURATION % 60)))"

# Add completion timestamp
echo "" >> "${RESULT_FILE}"
echo "---" >> "${RESULT_FILE}"
echo "Completed: $(date)" >> "${RESULT_FILE}"
echo "Duration: ${RUN_DURATION_FMT}" >> "${RESULT_FILE}"
echo "Result: ${success_count} passed, ${fail_count} failed" >> "${RESULT_FILE}"
echo "Result file: ${RESULT_FILE}" >> "${RESULT_FILE}"
echo "Temp dir: ${TEMP_DIR}" >> "${RESULT_FILE}"


echo "Act run started: ${START_TIME}"
echo "Act run completed: ${END_TIME}"
echo "Duration: ${RUN_DURATION_FMT}"
echo "Result: ${success_count} passed, ${fail_count} failed"
echo "Result file: ${RESULT_FILE}"
echo "Temp dir: ${TEMP_DIR}"

# Exit with failure if any jobs failed
if [[ ${#FAILED_JOBS[@]} -gt 0 ]]; then
    exit 1
else
    exit 0
fi
