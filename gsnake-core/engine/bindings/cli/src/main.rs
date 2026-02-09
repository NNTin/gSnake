use anyhow::{Context, Result};
use clap::{ArgGroup, Parser};
use crossterm::{
    execute,
    terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
};
use gsnake_core::{engine::GameEngine, Direction, GameStatus};
use ratatui::{backend::CrosstermBackend, Terminal};
use std::{
    io,
    path::PathBuf,
    process::Command,
    time::{Duration, Instant},
};

mod input;
mod levels;
mod playback;
mod ui;

use input::{Action, InputHandler};
use levels::{
    levels_path, load_level_by_index, load_level_by_json_id, load_level_from_file, load_levels,
};
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
#[command(group(
    ArgGroup::new("level_source")
        .args(["level_file", "level_id", "level_index"])
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

    /// Load a single level from a JSON file
    #[arg(long, value_name = "PATH")]
    level_file: Option<PathBuf>,

    /// Load a single level by JSON id field (from levels.json)
    #[arg(long, value_name = "ID")]
    level_id: Option<u32>,

    /// Load a single level by 1-based index in levels.json
    #[arg(long, value_name = "INDEX")]
    level_index: Option<u32>,

    /// Record gameplay with asciinema
    #[arg(long)]
    record: bool,

    /// Output path for asciinema recording (.cast)
    #[arg(long, value_name = "PATH")]
    record_output: Option<PathBuf>,
}

fn main() -> Result<()> {
    let args = Args::parse();

    if args.record {
        maybe_spawn_recording(&args)?;
    }

    let (levels, single_level_mode) = load_requested_levels(&args)?;
    if levels.is_empty() {
        anyhow::bail!("No levels found");
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

    let result = run_game(
        &mut terminal,
        &levels,
        playback,
        single_level_mode,
        args.record,
    );

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
    single_level_mode: bool,
    record_mode: bool,
) -> Result<()> {
    let mut current_level_index = 0;
    let mut engine = GameEngine::new(levels[current_level_index].clone());
    let mut frame = engine.generate_frame();
    let mut playback_state = playback.and_then(PlaybackState::new);
    let mut playback_done_at: Option<Instant> = None;

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
            )
            .is_ok()
            {
                UI::render(f, &frame);
            } else {
                let required_width = (grid_width * 2 + 4) as u16;
                let required_height = (grid_height + 6) as u16;
                UI::render_terminal_too_small(f, required_width, required_height);
            }
        })?;

        if let Some(state) = playback_state.as_mut() {
            if state.is_done() {
                if record_mode {
                    playback_done_at = Some(Instant::now());
                }
                playback_state = None;
                continue;
            }

            if let Some(action) = state.next_action() {
                if !apply_action(
                    action,
                    &mut engine,
                    &mut frame,
                    &mut current_level_index,
                    levels,
                    single_level_mode,
                ) {
                    return finalize_exit(frame.state.status, single_level_mode);
                }
            } else {
                let sleep_for = state
                    .time_until_next()
                    .min(Duration::from_millis(INPUT_POLL_TIMEOUT_MS));
                if !sleep_for.is_zero() {
                    std::thread::sleep(sleep_for);
                }
            }
        } else if playback_done_at.is_none() {
            // Poll for input
            if let Some(action) =
                InputHandler::poll_action(Duration::from_millis(INPUT_POLL_TIMEOUT_MS))?
            {
                if !apply_action(
                    action,
                    &mut engine,
                    &mut frame,
                    &mut current_level_index,
                    levels,
                    single_level_mode,
                ) {
                    return finalize_exit(frame.state.status, single_level_mode);
                }
            }
        }

        if let Some(done_at) = playback_done_at {
            if Instant::now().duration_since(done_at) >= Duration::from_secs(1) {
                return finalize_exit(frame.state.status, single_level_mode);
            }
        }
    }
}

fn apply_action(
    action: Action,
    engine: &mut GameEngine,
    frame: &mut gsnake_core::Frame,
    current_level_index: &mut usize,
    levels: &[gsnake_core::LevelDefinition],
    single_level_mode: bool,
) -> bool {
    match action {
        Action::Quit => {
            return false;
        },
        Action::Reset => {
            *engine = GameEngine::new(levels[*current_level_index].clone());
            *frame = engine.generate_frame();
        },
        Action::Continue => {
            // Only advance on level complete
            if frame.state.status == GameStatus::LevelComplete && !single_level_mode {
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
        },
        Action::MoveNorth => {
            if frame.state.status == GameStatus::Playing {
                engine.process_move(Direction::North);
                *frame = engine.generate_frame();
            }
        },
        Action::MoveSouth => {
            if frame.state.status == GameStatus::Playing {
                engine.process_move(Direction::South);
                *frame = engine.generate_frame();
            }
        },
        Action::MoveEast => {
            if frame.state.status == GameStatus::Playing {
                engine.process_move(Direction::East);
                *frame = engine.generate_frame();
            }
        },
        Action::MoveWest => {
            if frame.state.status == GameStatus::Playing {
                engine.process_move(Direction::West);
                *frame = engine.generate_frame();
            }
        },
    }

    true
}

fn finalize_exit(status: GameStatus, single_level_mode: bool) -> Result<()> {
    if single_level_mode {
        match status {
            GameStatus::LevelComplete | GameStatus::AllComplete => Ok(()),
            _ => anyhow::bail!("Level not completed"),
        }
    } else {
        Ok(())
    }
}

fn load_requested_levels(args: &Args) -> Result<(Vec<gsnake_core::LevelDefinition>, bool)> {
    if let Some(path) = &args.level_file {
        let level = load_level_from_file(path)?;
        return Ok((vec![level], true));
    }

    let levels_path = levels_path();
    let levels = load_levels(&levels_path).with_context(|| {
        format!(
            "Failed to load levels. Make sure you're running from the workspace root. Path: {}",
            levels_path.display()
        )
    })?;

    if let Some(json_id) = args.level_id {
        let level = load_level_by_json_id(&levels_path, json_id)?;
        return Ok((vec![level], true));
    }

    if let Some(index) = args.level_index {
        let level = load_level_by_index(&levels_path, index)?;
        return Ok((vec![level], true));
    }

    Ok((levels, false))
}

fn maybe_spawn_recording(args: &Args) -> Result<()> {
    if std::env::var("GSNAKE_RECORDING").is_ok() {
        return Ok(());
    }

    let output = args
        .record_output
        .clone()
        .unwrap_or_else(|| PathBuf::from("recording.cast"));

    ensure_asciinema()?;

    let mut cmd = Command::new("asciinema");
    cmd.arg("rec").arg(output);
    let command_string = build_record_command(args)?;
    cmd.arg("--command").arg(command_string);
    cmd.env("GSNAKE_RECORDING", "1");

    let status = cmd.status().context("Failed to start asciinema")?;
    std::process::exit(status.code().unwrap_or(1));
}

fn build_record_command(args: &Args) -> Result<String> {
    let exe = std::env::current_exe().context("Failed to resolve executable path")?;
    let mut parts = vec![shell_escape(exe.to_string_lossy().as_ref())];

    parts.push("--record".to_string());

    if let Some(input) = &args.input {
        parts.push("--input".to_string());
        parts.push(shell_escape(input));
    }
    if let Some(input_file) = &args.input_file {
        parts.push("--input-file".to_string());
        parts.push(shell_escape(input_file.to_string_lossy().as_ref()));
    }
    if args.delay_ms != 200 {
        parts.push("--delay-ms".to_string());
        parts.push(args.delay_ms.to_string());
    }
    if let Some(level_file) = &args.level_file {
        parts.push("--level-file".to_string());
        parts.push(shell_escape(level_file.to_string_lossy().as_ref()));
    }
    if let Some(level_id) = args.level_id {
        parts.push("--level-id".to_string());
        parts.push(level_id.to_string());
    }
    if let Some(level_index) = args.level_index {
        parts.push("--level-index".to_string());
        parts.push(level_index.to_string());
    }

    Ok(parts.join(" "))
}

fn shell_escape(value: &str) -> String {
    if value
        .chars()
        .all(|c| c.is_ascii_alphanumeric() || "/-_.".contains(c))
    {
        return value.to_string();
    }
    let escaped = value.replace('\'', "'\\''");
    format!("'{escaped}'")
}

fn ensure_asciinema() -> Result<()> {
    let status = Command::new("asciinema").arg("--version").status();
    if matches!(status, Ok(status) if status.success()) {
        Ok(())
    } else {
        anyhow::bail!("asciinema is not available in PATH")
    }
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

#[cfg(test)]
mod tests {
    use super::*;

    fn base_args() -> Args {
        Args {
            input: None,
            input_file: None,
            delay_ms: 200,
            level_file: None,
            level_id: None,
            level_index: None,
            record: false,
            record_output: None,
        }
    }

    #[test]
    fn finalize_exit_single_level_requires_completion() {
        let err = finalize_exit(GameStatus::Playing, true).unwrap_err();
        assert_eq!(err.to_string(), "Level not completed");
    }

    #[test]
    fn finalize_exit_single_level_accepts_completed_statuses() {
        assert!(finalize_exit(GameStatus::LevelComplete, true).is_ok());
        assert!(finalize_exit(GameStatus::AllComplete, true).is_ok());
    }

    #[test]
    fn finalize_exit_multi_level_allows_any_status() {
        assert!(finalize_exit(GameStatus::Playing, false).is_ok());
        assert!(finalize_exit(GameStatus::GameOver, false).is_ok());
    }

    #[test]
    fn load_requested_levels_rejects_missing_level_file() {
        let mut args = base_args();
        args.level_file = Some(PathBuf::from("does-not-exist-level.json"));

        let err = load_requested_levels(&args).unwrap_err();
        assert!(
            err.to_string().contains("Failed to read level file"),
            "unexpected error: {err}"
        );
    }

    #[test]
    fn load_requested_levels_rejects_zero_level_index() {
        let mut args = base_args();
        args.level_index = Some(0);

        let err = load_requested_levels(&args).unwrap_err();
        assert_eq!(err.to_string(), "Level indices start at 1");
    }
}
