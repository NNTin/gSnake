## gSnake

Gravity Snake is a strategic puzzle game that reimagines the classic Snake experience by introducing gravity physics and turn-based movement. Unlike traditional Snake games that rely on reflexes and continuous movement, Gravity Snake requires players to think ahead about how gravity will affect their position after each deliberate move. The snake only moves when the player acts, and after each action, gravity pulls the snake downward until it hits an obstacle or the floor. This creates a puzzle-like experience where players must navigate through increasingly complex levels with static obstacles and platforms.

### Rust command reference

```bash
# Run these from the gsnake-core workspace root
cd gsnake-core

# Build CLI binary
cargo build --package gsnake-cli

# Build optimized release
cargo build --package gsnake-cli --release

# Run CLI game
cargo run --package gsnake-cli

# Run UI demo
cargo run --package gsnake-cli --example ui_demo

# Run tests
cargo test --package gsnake-cli

# Run all workspace tests
cargo test --workspace

# Check code quality
cargo clippy --package gsnake-cli

# Run with verbose output
RUST_LOG=debug cargo run --package gsnake-cli
```
