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

# Generate documentation
cargo doc --no-deps

# Build WASM bindings
cd engine/bindings/wasm
wasm-pack build
```

### WASM Build Output

After running `wasm-pack build`, the compiled WASM package will be available at:
```
engine/bindings/wasm/pkg/
```

This package can be imported by JavaScript/TypeScript projects.

## Known Issues

- **Profile Warning**: You may see a warning about profiles being ignored for non-root packages. This is expected in workspace configurations and does not affect the build.
- **wasm-pack Metadata**: Optional Cargo.toml fields (description, repository, license) are missing from the WASM package. These are recommended for publishing but not required for local builds.

## Development

When developing in the root gSnake repository, local path dependencies are automatically detected and used. When building standalone, all dependencies are resolved from crates.io.
