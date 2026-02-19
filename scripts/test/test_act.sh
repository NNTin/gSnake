#!/usr/bin/env bash

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
RESULT_FILE="${SCRIPT_DIR}/result.txt"
TEMP_DIR="${SCRIPT_DIR}/tmp_act_results"
MODE="job"

# Arguments
while [[ $# -gt 0 ]]; do
    case "$1" in
        --mode|-m)
            if [[ $# -lt 2 ]]; then
                echo "Missing value for $1. Expected 'job' or 'workflow'."
                exit 1
            fi
            MODE="$2"
            shift 2
            ;;
        --job)
            MODE="job"
            shift
            ;;
        --workflow)
            MODE="workflow"
            shift
            ;;
        *)
            echo "Unknown argument: $1"
            echo "Usage: $0 [--mode job|workflow|--job|--workflow]"
            exit 1
            ;;
    esac
done

if [[ "${MODE}" != "job" && "${MODE}" != "workflow" ]]; then
    echo "Invalid mode: ${MODE}. Expected 'job' or 'workflow'."
    exit 1
fi

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
declare -a WORKFLOW_NAMES=()
declare -A WORKFLOW_REPO_DIRS=()
declare -A WORKFLOW_RELS=()

echo "=== Act CI Test Results ===" > "${RESULT_FILE}"
echo "Started: $(date)" >> "${RESULT_FILE}"
echo "Mode: ${MODE}" >> "${RESULT_FILE}"
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

# Function to run an entire workflow
run_workflow() {
    local repo_dir="$1"
    local workflow_rel="$2"
    local output_file="$3"
    local status_file="$4"

    if (
        cd "${repo_dir}" &&
        act -W "${workflow_rel}" --container-architecture linux/amd64 > "${output_file}" 2>&1
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

    WORKFLOW_NAMES+=("${workflow}")
    WORKFLOW_REPO_DIRS["${workflow}"]="${repo_dir}"
    WORKFLOW_RELS["${workflow}"]="${workflow_rel}"

    if [[ "${MODE}" == "workflow" ]]; then
        continue
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

if [[ "${MODE}" == "job" && ${#JOB_NAMES[@]} -eq 0 ]]; then
    echo "No jobs found to run. Exiting."
    exit 1
fi

if [[ "${MODE}" == "workflow" && ${#WORKFLOW_NAMES[@]} -eq 0 ]]; then
    echo "No workflows found to run. Exiting."
    exit 1
fi

# Run sequentially in selected mode
if [[ "${MODE}" == "job" ]]; then
    total_items=${#JOB_NAMES[@]}
    item_index=0
    for job_name in "${JOB_NAMES[@]}"; do
        item_index=$((item_index + 1))
        workflow="${job_name%%::*}"
        job="${job_name##*::}"
        repo_dir="${JOB_REPO_DIRS["${job_name}"]}"
        workflow_rel="${JOB_WORKFLOW_RELS["${job_name}"]}"
        output_file="${TEMP_DIR}/${workflow//\//_}_${job}.log"
        status_file="${TEMP_DIR}/${workflow//\//_}_${job}.status"

        echo "  Running: ${job_name} (${item_index} of ${total_items})"
        run_job "${repo_dir}" "${workflow_rel}" "${job}" "${output_file}" "${status_file}"
    done
else
    total_items=${#WORKFLOW_NAMES[@]}
    item_index=0
    for workflow in "${WORKFLOW_NAMES[@]}"; do
        item_index=$((item_index + 1))
        repo_dir="${WORKFLOW_REPO_DIRS["${workflow}"]}"
        workflow_rel="${WORKFLOW_RELS["${workflow}"]}"
        output_file="${TEMP_DIR}/${workflow//\//_}.log"
        status_file="${TEMP_DIR}/${workflow//\//_}.status"

        echo "  Running: ${workflow} (${item_index} of ${total_items})"
        run_workflow "${repo_dir}" "${workflow_rel}" "${output_file}" "${status_file}"
    done
fi

# Generate summary
echo "## Summary" >> "${RESULT_FILE}"
echo "" >> "${RESULT_FILE}"

declare -a FAILED_TARGETS=()
success_count=0
fail_count=0

if [[ "${MODE}" == "job" ]]; then
    for job_name in "${JOB_NAMES[@]}"; do
        workflow="${job_name%%::*}"
        job="${job_name##*::}"
        status_file="${TEMP_DIR}/${workflow//\//_}_${job}.status"

        if [[ -f "${status_file}" ]]; then
            status=$(cat "${status_file}")
            echo "- [${status}] ${job_name}" >> "${RESULT_FILE}"

            if [[ "${status}" == "FAILED" ]]; then
                FAILED_TARGETS+=("${job_name}")
                fail_count=$((fail_count + 1))
            else
                success_count=$((success_count + 1))
            fi
        else
            echo "- [UNKNOWN] ${job_name}" >> "${RESULT_FILE}"
            FAILED_TARGETS+=("${job_name}")
            fail_count=$((fail_count + 1))
        fi
    done
else
    for workflow in "${WORKFLOW_NAMES[@]}"; do
        status_file="${TEMP_DIR}/${workflow//\//_}.status"

        if [[ -f "${status_file}" ]]; then
            status=$(cat "${status_file}")
            echo "- [${status}] ${workflow}" >> "${RESULT_FILE}"

            if [[ "${status}" == "FAILED" ]]; then
                FAILED_TARGETS+=("${workflow}")
                fail_count=$((fail_count + 1))
            else
                success_count=$((success_count + 1))
            fi
        else
            echo "- [UNKNOWN] ${workflow}" >> "${RESULT_FILE}"
            FAILED_TARGETS+=("${workflow}")
            fail_count=$((fail_count + 1))
        fi
    done
fi

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
echo "Mode: ${MODE}"
echo "Duration: ${RUN_DURATION_FMT}"
echo "Result: ${success_count} passed, ${fail_count} failed"
echo "Result file: ${RESULT_FILE}"
echo "Temp dir: ${TEMP_DIR}"

# Exit with failure if any jobs failed
if [[ ${#FAILED_TARGETS[@]} -gt 0 ]]; then
    exit 1
else
    exit 0
fi
