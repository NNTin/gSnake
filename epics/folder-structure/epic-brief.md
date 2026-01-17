# Epic Brief: Repository Folder Structure Refactoring

## Summary

This Epic establishes a clear, scalable folder structure for the gSnake project by organizing three distinct entities—the web client, Rust core game engine, and Rust CLI terminal client—into separate, well-defined directories. The refactoring moves web client files from the repository root into a dedicated folder, creating a professional project layout that clearly communicates the multi-platform architecture. This organizational improvement will prevent root-level clutter as the project grows and make it immediately obvious to contributors and users that gSnake supports both web and terminal interfaces powered by a shared Rust core.

## Context & Problem

### Who's Affected

**Primary Users**:
- Current and future contributors who need to understand the project structure and locate relevant code
- Developers working on specific components (web frontend, CLI, or core engine) who want clear separation of concerns
- The project maintainer managing dependencies, builds, and releases for multiple targets

**Secondary Users**:
- New users exploring the repository who want to quickly understand what the project offers
- Potential contributors evaluating the project's code quality and organization

### Current State

The gSnake repository currently has a mixed structure where:

1. **Web client files live at the repository root**: Files like `App.svelte`, `app.css`, `components/`, `stores/`, `index.html`, `main.ts`, and other web-specific code are scattered at the top level
2. **Rust projects are in subdirectories**:
   - `gsnake-core/` contains the core game engine
   - `gsnake-cli/` contains the terminal client
   - `gsnake-wasm/` contains the WebAssembly bridge
3. **Configuration files are mixed with source code**: Root-level config files for multiple tools (Vite, TypeScript, Playwright, Svelte, npm, Cargo) coexist with application source files
4. **The `/epics` directory exists at the root**: Documentation and planning artifacts are properly organized but surrounded by source code

This structure made sense during early development when the project was primarily a web application, but it no longer reflects the current multi-platform reality.

### The Problem

**Unclear Project Boundaries**: When opening the repository, it's not immediately obvious that gSnake consists of three distinct but integrated projects. The web client appears to be "the main project" while the Rust components seem like add-ons, when in fact the Rust core is the single source of truth for game logic.

**Cognitive Overhead**: Contributors must mentally filter through 20+ root-level files to understand what belongs to which component. Files like `App.svelte` (web), `Cargo.toml` (workspace), `package.json` (web), and `rustfmt.toml` (Rust) all compete for attention.

**Scalability Issues**: As features are added, the root directory will continue to grow with web client files, making navigation progressively more difficult. There's no clear place to add new components or tools.

**Inconsistent Organization**: The Rust projects follow a clean, directory-based organization (`gsnake-core/`, `gsnake-cli/`) while the web project sprawls across the root. This inconsistency suggests different standards or priorities.

**Onboarding Friction**: New contributors face a higher barrier to entry when they must parse the entire repository structure before making their first contribution. A clear folder structure serves as documentation itself.

### Desired Outcome

Create a self-documenting repository structure where the folder names immediately communicate the project's architecture:

```
gSnake/
├── web/                  # Svelte + TypeScript web client
├── cli/                  # Rust terminal client
├── core/                 # Rust game engine (shared by web & cli)
├── wasm/                 # WebAssembly bridge (core → web)
├── epics/                # Project documentation and planning
└── [config files]        # Root-level workspace configuration only
```

This structure makes it obvious that:
- Three separate client applications exist (web and cli)
- They share a common core engine
- A WASM layer bridges the core to the web
- The repository is a multi-project workspace

### Success Criteria

**Primary Success Metric**: A new contributor can clone the repository and immediately understand the project's architecture by reading folder names alone, without needing to open any files or read documentation.

**Validation**:
- Run `ls` in the repository root and see only high-level project folders and workspace configuration
- Open the `web/` folder and see only web-client-specific code
- Open the `cli/` folder and see only terminal-client-specific code
- Open the `core/` folder and see only game engine logic
- All existing functionality (development, builds, tests, deployment) continues to work without modification
- Documentation and scripts are updated to reflect the new paths

**Technical Validation**:
- `npm run dev` starts the web development server
- `npm run build` builds the web client
- `npm run preview` previews the production web build
- `npm test` or `npm run test` runs all tests
- `cargo build` builds all Rust projects
- `cargo test` runs all Rust tests
- `cargo run --bin gsnake-cli` runs the terminal client
- GitHub Actions workflows pass without modification
- All imports and relative paths resolve correctly

### Out of Scope

The following changes are explicitly excluded from this Epic to maintain focused scope:

- **Renaming Rust project directories**: The existing `gsnake-core/`, `gsnake-cli/`, and `gsnake-wasm/` names remain unchanged. Only the web client moves.
- **Dependency restructuring**: No changes to how packages depend on each other or import from each other
- **Build system changes**: No modifications to Vite, Cargo, or other build configurations beyond path updates
- **Monorepo tooling**: No addition of Nx, Turborepo, or other monorepo management tools
- **Package naming**: npm and Cargo package names remain unchanged
- **CI/CD optimization**: GitHub Actions workflows are updated for new paths but not otherwise optimized
- **Documentation rewrite**: Only path references are updated; no content improvements
- **Code refactoring**: No changes to application logic, only file movements
- **Git history preservation tools**: Standard git mv is sufficient; no special history-preserving tools needed

## Migration Strategy

### Phase 1: Preparation
1. Create new folder structure alongside existing structure
2. Identify all web client files that need to move
3. Identify all configuration files that reference web client paths

### Phase 2: File Movement
1. Move web client source files to `web/src/`
2. Move web client configuration to `web/`
3. Update all path references in code and configuration

### Phase 3: Validation
1. Test development workflow (`npm run dev`)
2. Test production build (`npm run build`)
3. Test all Rust builds and tests
4. Verify GitHub Actions workflows
5. Update documentation

### Phase 4: Cleanup
1. Remove old empty directories
2. Verify no broken references remain
3. Update README with new structure

## Risk Assessment

**Low Risk**: This is primarily a file organization change with minimal logic changes
- All files are moved via `git mv` to preserve history
- Modern tooling (Vite, TypeScript) handles path changes gracefully
- Comprehensive testing validates nothing breaks

**Mitigation**:
- Create a detailed checklist of all references to update
- Test incrementally after each major change
- Keep the old structure in a branch until validation is complete
