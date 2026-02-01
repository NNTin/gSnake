use crate::input::Action;
use anyhow::{bail, Context, Result};
use serde::Deserialize;
use std::{fs, path::Path, time::Duration};

#[derive(Debug, Clone, Copy)]
pub struct PlaybackStep {
    pub action: Action,
    pub delay: Duration,
}

#[derive(Debug)]
pub struct Playback {
    pub steps: Vec<PlaybackStep>,
}

#[derive(Debug, Deserialize)]
struct PlaybackFileStep {
    key: String,
    delay_ms: u64,
}

impl Playback {
    pub fn from_input_string(input: &str, delay_ms: u64) -> Result<Self> {
        let mut steps = Vec::new();
        for ch in input.chars().filter(|c| !c.is_whitespace()) {
            let action = parse_string_char(ch)?;
            steps.push(PlaybackStep {
                action,
                delay: Duration::from_millis(delay_ms),
            });
        }

        if steps.is_empty() {
            bail!("Input string is empty after trimming whitespace");
        }

        Ok(Self { steps })
    }

    pub fn from_input_file(path: &Path) -> Result<Self> {
        let contents = fs::read_to_string(path)
            .with_context(|| format!("Failed to read input file: {}", path.display()))?;
        let raw_steps: Vec<PlaybackFileStep> =
            serde_json::from_str(&contents).with_context(|| "Failed to parse playback JSON")?;

        if raw_steps.is_empty() {
            bail!("Playback input file is empty");
        }

        let mut steps = Vec::with_capacity(raw_steps.len());
        for step in raw_steps {
            let action = parse_key(&step.key)?;
            steps.push(PlaybackStep {
                action,
                delay: Duration::from_millis(step.delay_ms),
            });
        }

        Ok(Self { steps })
    }
}

fn parse_string_char(ch: char) -> Result<Action> {
    match ch {
        'R' => Ok(Action::MoveEast),
        'D' => Ok(Action::MoveSouth),
        'L' => Ok(Action::MoveWest),
        'U' => Ok(Action::MoveNorth),
        'q' | 'Q' => Ok(Action::Quit),
        'r' => Ok(Action::Reset),
        _ => bail!(
            "Invalid input character '{ch}'. Use R, D, L, U for moves; q to quit; r to reset."
        ),
    }
}

fn parse_key(key: &str) -> Result<Action> {
    if key.len() == 1 {
        let ch = key.chars().next().unwrap();
        if matches!(ch, 'R' | 'D' | 'L' | 'U') {
            return parse_string_char(ch);
        }
    }

    let normalized = key.trim().to_lowercase();
    match normalized.as_str() {
        "right" | "east" => Ok(Action::MoveEast),
        "down" | "south" => Ok(Action::MoveSouth),
        "left" | "west" => Ok(Action::MoveWest),
        "up" | "north" => Ok(Action::MoveNorth),
        "q" | "quit" => Ok(Action::Quit),
        "r" | "reset" => Ok(Action::Reset),
        _ => bail!("Invalid key '{key}'. Use Right/Left/Up/Down (or R/L/U/D), Q/Quit, or R/Reset."),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parse_string_input() {
        let playback = Playback::from_input_string("RDLU q r", 200).unwrap();
        assert_eq!(playback.steps.len(), 6);
        assert_eq!(playback.steps[0].action, Action::MoveEast);
        assert_eq!(playback.steps[4].action, Action::Quit);
        assert_eq!(playback.steps[5].action, Action::Reset);
    }

    #[test]
    fn parse_file_key_variants() {
        assert_eq!(parse_key("Right").unwrap(), Action::MoveEast);
        assert_eq!(parse_key("U").unwrap(), Action::MoveNorth);
        assert_eq!(parse_key("reset").unwrap(), Action::Reset);
        assert_eq!(parse_key("q").unwrap(), Action::Quit);
    }
}
