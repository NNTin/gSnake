use anyhow::{Context, Result};
use clap::{ArgGroup, Parser};
use crossterm::{
    execute,
    terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
};
use gsnake_core::{engine::GameEngine, Direction, GameStatus};
use ratatui::{backend::CrosstermBackend, Terminal};
use std::{io, path::PathBuf, time::{Duration, Instant}};

mod input;
mod levels;
mod playback;
mod ui;

use input::{Action, InputHandler};
use levels::{load_levels, levels_path};
use playback::{Playback, PlaybackStep};
use ui::UI;

const INPUT_POLL_TIMEOUT_MS: u64 = 100;

#[derive(Parser, Debug)]
#[command(author, version, about)]
#[command(group(
    ArgGroup::new("input_source")
        .args(["input", "input_file"])
        .multiple(false)
))]
struct Args {
    /// Playback input string (e.g. "RDLU")
    #[arg(long)]
    input: Option<String>,

    /// Playback input file with JSON steps
    #[arg(long, value_name = "PATH")]
    input_file: Option<PathBuf>,

    /// Default delay between moves for string input (ms)
    #[arg(long, default_value_t = 200)]
    delay_ms: u64,
}

fn main() -> Result<()> {
    let args = Args::parse();

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
    let playback = match (args.input, args.input_file) {
        (Some(input), None) => Some(Playback::from_input_string(&input, args.delay_ms)?),
        (None, Some(path)) => Some(Playback::from_input_file(&path)?),
        (None, None) => None,
        (Some(_), Some(_)) => unreachable!("clap enforces mutually exclusive input options"),
    };

    let result = run_game(&mut terminal, &levels, playback);

    // Cleanup terminal
    disable_raw_mode().context("Failed to disable raw mode")?;
    execute!(terminal.backend_mut(), LeaveAlternateScreen)
        .context("Failed to leave alternate screen")?;
    terminal.show_cursor().context("Failed to show cursor")?;

    result
}

fn run_game(
    terminal: &mut Terminal<CrosstermBackend<io::Stdout>>,
    levels: &[gsnake_core::LevelDefinition],
    playback: Option<Playback>,
) -> Result<()> {
    let mut current_level_index = 0;
    let mut engine = GameEngine::new(levels[current_level_index].clone());
    let mut frame = engine.generate_frame();
    let mut playback_state = playback.and_then(PlaybackState::new);

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

        if let Some(state) = playback_state.as_mut() {
            if state.is_done() {
                playback_state = None;
                continue;
            }

            if let Some(action) = state.next_action() {
                if !apply_action(action, &mut engine, &mut frame, &mut current_level_index, levels)
                {
                    break;
                }
            } else {
                let sleep_for = state
                    .time_until_next()
                    .min(Duration::from_millis(INPUT_POLL_TIMEOUT_MS));
                if !sleep_for.is_zero() {
                    std::thread::sleep(sleep_for);
                }
            }
        } else {
            // Poll for input
            if let Some(action) =
                InputHandler::poll_action(Duration::from_millis(INPUT_POLL_TIMEOUT_MS))?
            {
                if !apply_action(action, &mut engine, &mut frame, &mut current_level_index, levels)
                {
                    break;
                }
            }
        }
    }

    Ok(())
}

fn apply_action(
    action: Action,
    engine: &mut GameEngine,
    frame: &mut gsnake_core::Frame,
    current_level_index: &mut usize,
    levels: &[gsnake_core::LevelDefinition],
) -> bool {
    match action {
        Action::Quit => {
            return false;
        }
        Action::Reset => {
            *engine = GameEngine::new(levels[*current_level_index].clone());
            *frame = engine.generate_frame();
        }
        Action::Continue => {
            // Only advance on level complete
            if frame.state.status == GameStatus::LevelComplete {
                *current_level_index += 1;
                if *current_level_index >= levels.len() {
                    // All levels complete
                    frame.state.status = GameStatus::AllComplete;
                } else {
                    // Load next level
                    *engine = GameEngine::new(levels[*current_level_index].clone());
                    *frame = engine.generate_frame();
                }
            } else if frame.state.status == GameStatus::AllComplete {
                // Restart from first level
                *current_level_index = 0;
                *engine = GameEngine::new(levels[*current_level_index].clone());
                *frame = engine.generate_frame();
            }
        }
        Action::MoveNorth => {
            if frame.state.status == GameStatus::Playing {
                engine.process_move(Direction::North);
                *frame = engine.generate_frame();
            }
        }
        Action::MoveSouth => {
            if frame.state.status == GameStatus::Playing {
                engine.process_move(Direction::South);
                *frame = engine.generate_frame();
            }
        }
        Action::MoveEast => {
            if frame.state.status == GameStatus::Playing {
                engine.process_move(Direction::East);
                *frame = engine.generate_frame();
            }
        }
        Action::MoveWest => {
            if frame.state.status == GameStatus::Playing {
                engine.process_move(Direction::West);
                *frame = engine.generate_frame();
            }
        }
    }

    true
}

struct PlaybackState {
    steps: Vec<PlaybackStep>,
    index: usize,
    next_at: Instant,
}

impl PlaybackState {
    fn new(playback: Playback) -> Option<Self> {
        if playback.steps.is_empty() {
            return None;
        }
        let now = Instant::now();
        let next_at = now + playback.steps[0].delay;
        Some(Self {
            steps: playback.steps,
            index: 0,
            next_at,
        })
    }

    fn is_done(&self) -> bool {
        self.index >= self.steps.len()
    }

    fn next_action(&mut self) -> Option<Action> {
        if self.is_done() {
            return None;
        }

        let now = Instant::now();
        if now < self.next_at {
            return None;
        }

        let action = self.steps[self.index].action;
        self.index += 1;
        if !self.is_done() {
            self.next_at = now + self.steps[self.index].delay;
        }
        Some(action)
    }

    fn time_until_next(&self) -> Duration {
        if self.is_done() {
            return Duration::from_millis(0);
        }
        let now = Instant::now();
        if now >= self.next_at {
            Duration::from_millis(0)
        } else {
            self.next_at - now
        }
    }
}
