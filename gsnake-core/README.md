# gsnake-core

Rust workspace for the gSnake engine and bindings.

## Crates

- `engine/core` – game engine
- `engine/bindings/cli` – terminal UI (bin: `gsnake-cli`)
- `engine/bindings/wasm` – WebAssembly bindings

## Common commands

```bash
# Build all crates
cargo build

# Run the CLI
cargo run -p gsnake-cli

# Run tests
cargo test
```
