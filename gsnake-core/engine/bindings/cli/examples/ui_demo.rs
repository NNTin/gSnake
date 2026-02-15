use anyhow::Result;
use crossterm::{
    event::{self, Event, KeyCode},
    execute,
    terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
};
use gsnake_core::{engine::GameEngine, Direction, GameStatus, GridSize, LevelDefinition, Position};
use ratatui::{backend::CrosstermBackend, Terminal};
use std::{io, time::Duration};

// Import UI from the crate
use gsnake_cli::ui::{self, UI};

fn main() -> Result<()> {
    // Setup terminal
    enable_raw_mode()?;
    let mut stdout = io::stdout();
    execute!(stdout, EnterAlternateScreen)?;
    let backend = CrosstermBackend::new(stdout);
    let mut terminal = Terminal::new(backend)?;

    // Run the UI demo
    let result = run_demo(&mut terminal);

    // Restore terminal
    disable_raw_mode()?;
    execute!(terminal.backend_mut(), LeaveAlternateScreen)?;
    terminal.show_cursor()?;

    result
}

#[allow(clippy::too_many_lines)]
fn run_demo(terminal: &mut Terminal<CrosstermBackend<io::Stdout>>) -> Result<()> {
    let mut demo_state = 0;

    // Create test level
    let level = create_test_level();
    let mut engine = GameEngine::new(level);

    // Get initial frame
    let mut frame = engine.generate_frame();

    println!("gSnake CLI UI Demo\n");
    println!("Press SPACE to cycle through different UI states");
    println!("Press Q to quit");
    println!("\nStates:");
    println!("1. Normal gameplay");
    println!("2. After collecting food (snake grows)");
    println!("3. Game Over overlay");
    println!("4. Level Complete overlay");
    println!("5. Terminal too small warning");

    loop {
        // Check terminal size
        let terminal_size = terminal.size()?;
        let grid_width = frame.grid[0].len();
        let grid_height = frame.grid.len();

        terminal.draw(|f| {
            if demo_state == 4 {
                // Show "Terminal too small" warning
                UI::render_terminal_too_small(f, 60, 30);
            } else {
                // Validate terminal size
                match ui::validate_terminal_size(
                    terminal_size.width,
                    terminal_size.height,
                    grid_width,
                    grid_height,
                ) {
                    Ok(()) => {
                        // Render normal UI
                        UI::render(f, &frame);
                    },
                    Err(_) => {
                        // Terminal is actually too small
                        UI::render_terminal_too_small(
                            f,
                            (grid_width * 2 + 4) as u16,
                            (grid_height + 6) as u16,
                        );
                    },
                }
            }
        })?;

        // Handle input
        if event::poll(Duration::from_millis(100))? {
            if let Event::Key(key) = event::read()? {
                match key.code {
                    KeyCode::Char('q' | 'Q') => {
                        break;
                    },
                    KeyCode::Char(' ') => {
                        demo_state = (demo_state + 1) % 5;

                        // Reset engine and create different states
                        let level = create_test_level();
                        engine = GameEngine::new(level);
                        frame = engine.generate_frame();

                        match demo_state {
                            1 => {
                                // After collecting food
                                let _ = engine.process_move(Direction::East);
                                frame = engine.generate_frame();
                            },
                            2 => {
                                // Game Over - move into wall
                                for _ in 0..20 {
                                    let _ = engine.process_move(Direction::West);
                                }
                                frame = engine.generate_frame();
                                frame.state.status = GameStatus::GameOver;
                            },
                            3 => {
                                // Level Complete
                                frame.state.status = GameStatus::LevelComplete;
                                frame.state.food_collected = frame.state.total_food;
                            },
                            _ => {},
                        }
                    },
                    KeyCode::Up | KeyCode::Char('w' | 'W') => {
                        if demo_state == 0 || demo_state == 1 {
                            let _ = engine.process_move(Direction::North);
                            frame = engine.generate_frame();
                        }
                    },
                    KeyCode::Down | KeyCode::Char('s' | 'S') => {
                        if demo_state == 0 || demo_state == 1 {
                            let _ = engine.process_move(Direction::South);
                            frame = engine.generate_frame();
                        }
                    },
                    KeyCode::Left | KeyCode::Char('a' | 'A') => {
                        if demo_state == 0 || demo_state == 1 {
                            let _ = engine.process_move(Direction::West);
                            frame = engine.generate_frame();
                        }
                    },
                    KeyCode::Right | KeyCode::Char('d' | 'D') => {
                        if demo_state == 0 || demo_state == 1 {
                            let _ = engine.process_move(Direction::East);
                            frame = engine.generate_frame();
                        }
                    },
                    _ => {},
                }
            }
        }
    }

    Ok(())
}

fn create_test_level() -> LevelDefinition {
    LevelDefinition::new(
        1,
        "UI Demo Level".to_string(),
        GridSize::new(20, 12),
        vec![
            Position::new(2, 10),
            Position::new(1, 10),
            Position::new(0, 10),
        ],
        vec![
            // Floor
            Position::new(0, 11),
            Position::new(1, 11),
            Position::new(2, 11),
            Position::new(3, 11),
            Position::new(4, 11),
            Position::new(5, 11),
            Position::new(6, 11),
            Position::new(7, 11),
            Position::new(8, 11),
            Position::new(9, 11),
            Position::new(10, 11),
            Position::new(11, 11),
            Position::new(12, 11),
            Position::new(13, 11),
            Position::new(14, 11),
            Position::new(15, 11),
            Position::new(16, 11),
            Position::new(17, 11),
            Position::new(18, 11),
            Position::new(19, 11),
            // Some platforms
            Position::new(7, 8),
            Position::new(8, 8),
            Position::new(9, 8),
            Position::new(12, 5),
            Position::new(13, 5),
            Position::new(14, 5),
        ],
        vec![
            Position::new(5, 10),
            Position::new(8, 7),
            Position::new(13, 4),
        ],
        Position::new(18, 10),
        Direction::East,
    )
}
