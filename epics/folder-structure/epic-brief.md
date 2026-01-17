# Epic Brief: Folder Structure Restructuring

## Summary
The current folder structure of the `gSnake` project is fragmented, with files for different components scattered across the root. This Epic aims to reorganize the project into a modular, Git-submodule compatible structure. The project will be divided into self-contained units: Web (Svelte), Terminal (Ratatui), Core Backend (Rust), WASM Bridge, and a planned Python wrapper (Maturin). The parent repository will focus solely on integration, project specifications (Epics), and global CI/CD pipelines, while components handle their own logic and data (e.g., moving `data/levels.json` into `gsnake-core`).

## Context & Problem
The `gSnake` project consists of several distinct components with diverging deployment needs:
-   **Web Frontend:** A Svelte-based web application.
-   **Terminal Frontend:** A Rust-based terminal application using `ratatui`.
-   **Core Backend:** The Rust game engine (`gsnake-core`), which will now include `data/levels.json`.
-   **WASM Bridge:** Rust bridge for the Web frontend (`gsnake-wasm`).
-   **Python Support:** Planned via `maturin` as a thin wrapper around `gsnake-core`.

Currently, these components are co-located, leading to:
-   **Deployment Complexity:** Mixed dependencies make publishing NPM and PyPI packages brittle.
-   **Version Management:** Challenges in maintaining independent versioning for each module.
-   **CI/CD Inefficiency:** Difficulty in executing platform-specific GitHub Actions pipelines independently.
-   **Structural Debt:** The lack of clear boundaries prevents the transition to Git submodules, which is required for scaling the project and its CI/CD infrastructure.

## Requirements

-   **Versioning:** All sub-modules must adhere to Semantic Versioning (SemVer).

-   **Development Linking:** During development, modules will be linked locally (`npm link` for Web, `pip install -e` for Python) to ensure a tight feedback loop.

-   **Happy Path Focus:** Initial implementation will prioritize the happy path for integration, with stability improvements addressed iteratively.



## Success Criteria

-   `gsnake-core` can be built and tested in complete isolation from the parent repository.

-   `gsnake-web` can be built and tested in complete isolation, consuming the core engine via local links.

-   The existing Playwright test suite passes at the root level, confirming the engine and web client are communicating correctly.

-   The folder structure is ready for conversion to Git submodules.
