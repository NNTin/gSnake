# gsnake-core

Rust workspace for the gSnake engine and bindings.

## Crates

- `engine/core` – game engine
- `engine/bindings/cli` – terminal UI (bin: `gsnake-cli`)
- `engine/bindings/wasm` – WebAssembly bindings

## Standalone Build

This repository can be built independently without the parent gSnake repository.

### Prerequisites

- Rust 1.70+ (install via [rustup](https://rustup.rs/))
- For WASM builds: `wasm-pack` (install via `cargo install wasm-pack`)
- For WASM target: `rustup target add wasm32-unknown-unknown`

### Build Commands

```bash
# Build all crates
cargo build

# Run the CLI
cargo run -p gsnake-cli

# Run tests
cargo test

# Generate coverage report (requires cargo-llvm-cov)
./scripts/coverage.sh

# Generate documentation
cargo doc --no-deps

# Build WASM bindings
cd engine/bindings/wasm
wasm-pack build
```

Coverage artifacts are written to:
```
target/llvm-cov/lcov.info
```

The coverage command enforces a minimum line-coverage gate of `80%` for the
`gsnake-core` crate via `cargo llvm-cov --package gsnake-core --fail-under-lines 80`.

### WASM Build Output

After running `wasm-pack build`, the compiled WASM package will be available at:
```
engine/bindings/wasm/pkg/
```

This package can be imported by JavaScript/TypeScript projects.

**Note**: The `pkg/` directory is committed to git (prebuilt WASM artifacts) to enable standalone builds of dependent packages like `gsnake-web`. This allows JavaScript projects to use git dependencies without needing to build WASM locally. When developing in the root repository, you can rebuild WASM as needed, and the changes will be tracked in version control.

## Known Issues

- **Profile Warning**: You may see a warning about profiles being ignored for non-root packages. This is expected in workspace configurations and does not affect the build.
- **wasm-pack Metadata**: Optional Cargo.toml fields (description, repository, license) are missing from the WASM package. These are recommended for publishing but not required for local builds.

## CI/CD

This repository includes GitHub Actions workflows for continuous integration:

- **Build**: Validates `cargo build` succeeds
- **Test**: Runs `cargo test` on all workspace crates
- **WASM**: Builds WASM bindings with `wasm-pack`

### Testing CI Locally with nektos/act

You can test GitHub Actions workflows locally using [nektos/act](https://github.com/nektos/act):

```bash
# Install act (requires Docker)
curl -s https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Test individual jobs
cd gsnake-core
act -j build   # Test build job
act -j test    # Test test job
act -j wasm    # Test WASM build job
```

#### Known Limitations with act

- **Docker Required**: act requires Docker to be installed and running
- **Image Download**: First run downloads ~500MB Docker image (medium size)
- **Cache Actions**: GitHub Actions cache (actions/cache@v4) may not work exactly as on GitHub
- **Network Access**: Some network operations may behave differently in Docker containers
- **Performance**: Local runs may be slower than GitHub-hosted runners
- **Workflow Dispatch**: `workflow_dispatch` trigger cannot be tested locally with act

For full validation, push to GitHub and verify workflows run successfully there.

## Development

When developing in the root gSnake repository, local path dependencies are automatically detected and used. When building standalone, all dependencies are resolved from crates.io.
