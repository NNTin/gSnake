// CLI interface for gSnake
// This will be expanded in T4 and T5 with TUI rendering and input handling

use gsnake_core::{GameState, Position};

fn main() {
    println!("gSnake CLI - Coming Soon!");
    println!("Core library version: {}", env!("CARGO_PKG_VERSION"));

    // Demonstrate that core models are accessible
    let pos = Position::new(0, 0);
    let state = GameState::new(1, 5);

    println!("Created initial position: ({}, {})", pos.x, pos.y);
    println!("Initial game state: level {}, status {:?}", state.current_level, state.status);
}
