use anyhow::{Context, Result};
use crossterm::{
    execute,
    terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
};
use gsnake_core::{engine::GameEngine, Direction, GameStatus};
use ratatui::{backend::CrosstermBackend, Terminal};
use std::{io, time::Duration};

mod input;
mod levels;
mod ui;

use input::{Action, InputHandler};
use levels::{load_levels, levels_path};
use ui::UI;

const INPUT_POLL_TIMEOUT_MS: u64 = 100;

fn main() -> Result<()> {
    // Load all levels
    let levels_path = levels_path();
    let levels = load_levels(&levels_path)
        .with_context(|| format!(
            "Failed to load levels. Make sure you're running from the workspace root. Path: {}",
            levels_path.display()
        ))?;

    if levels.is_empty() {
        anyhow::bail!("No levels found in {}", levels_path.display());
    }

    // Setup terminal
    enable_raw_mode().context("Failed to enable raw mode")?;
    let mut stdout = io::stdout();
    execute!(stdout, EnterAlternateScreen).context("Failed to enter alternate screen")?;
    let backend = CrosstermBackend::new(stdout);
    let mut terminal = Terminal::new(backend).context("Failed to create terminal")?;

    // Run the game
    let result = run_game(&mut terminal, &levels);

    // Cleanup terminal
    disable_raw_mode().context("Failed to disable raw mode")?;
    execute!(terminal.backend_mut(), LeaveAlternateScreen)
        .context("Failed to leave alternate screen")?;
    terminal.show_cursor().context("Failed to show cursor")?;

    result
}

fn run_game(
    terminal: &mut Terminal<CrosstermBackend<io::Stdout>>,
    levels: &[gsnake_core::Level],
) -> Result<()> {
    let mut current_level_index = 0;
    let mut engine = GameEngine::new(levels[current_level_index].clone());
    let mut frame = engine.generate_frame();

    loop {
        // Check terminal size
        let terminal_size = terminal.size()?;
        let grid_width = frame.grid[0].len();
        let grid_height = frame.grid.len();

        // Render
        terminal.draw(|f| {
            if ui::validate_terminal_size(
                terminal_size.width,
                terminal_size.height,
                grid_width,
                grid_height,
            ).is_ok() {
                UI::render(f, &frame);
            } else {
                let required_width = (grid_width * 2 + 4) as u16;
                let required_height = (grid_height + 6) as u16;
                UI::render_terminal_too_small(f, required_width, required_height);
            }
        })?;

        // Poll for input
        if let Some(action) = InputHandler::poll_action(Duration::from_millis(INPUT_POLL_TIMEOUT_MS))? {
            match action {
                Action::Quit => {
                    break;
                }
                Action::Reset => {
                    // Reset current level
                    engine = GameEngine::new(levels[current_level_index].clone());
                    frame = engine.generate_frame();
                }
                Action::Continue => {
                    // Only advance on level complete
                    if frame.state.status == GameStatus::LevelComplete {
                        current_level_index += 1;
                        if current_level_index >= levels.len() {
                            // All levels complete
                            frame.state.status = GameStatus::AllComplete;
                        } else {
                            // Load next level
                            engine = GameEngine::new(levels[current_level_index].clone());
                            frame = engine.generate_frame();
                        }
                    } else if frame.state.status == GameStatus::AllComplete {
                        // Restart from first level
                        current_level_index = 0;
                        engine = GameEngine::new(levels[current_level_index].clone());
                        frame = engine.generate_frame();
                    }
                }
                Action::MoveNorth => {
                    if frame.state.status == GameStatus::Playing {
                        engine.process_move(Direction::North);
                        frame = engine.generate_frame();
                    }
                }
                Action::MoveSouth => {
                    if frame.state.status == GameStatus::Playing {
                        engine.process_move(Direction::South);
                        frame = engine.generate_frame();
                    }
                }
                Action::MoveEast => {
                    if frame.state.status == GameStatus::Playing {
                        engine.process_move(Direction::East);
                        frame = engine.generate_frame();
                    }
                }
                Action::MoveWest => {
                    if frame.state.status == GameStatus::Playing {
                        engine.process_move(Direction::West);
                        frame = engine.generate_frame();
                    }
                }
            }
        }
    }

    Ok(())
}
