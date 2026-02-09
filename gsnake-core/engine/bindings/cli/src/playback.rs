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
    use std::{
        fs,
        path::{Path, PathBuf},
        time::{SystemTime, UNIX_EPOCH},
    };

    struct TempPlaybackFile {
        path: PathBuf,
    }

    impl TempPlaybackFile {
        fn new(contents: &str) -> Self {
            let unique = SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .expect("clock should be after epoch")
                .as_nanos();
            let mut path = std::env::temp_dir();
            path.push(format!(
                "gsnake-cli-playback-{}-{unique}.json",
                std::process::id()
            ));
            fs::write(&path, contents).expect("failed to create temp playback file");
            Self { path }
        }

        fn path(&self) -> &Path {
            &self.path
        }
    }

    impl Drop for TempPlaybackFile {
        fn drop(&mut self) {
            let _ = fs::remove_file(&self.path);
        }
    }

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
        assert_eq!(parse_key(" north ").unwrap(), Action::MoveNorth);
    }

    #[test]
    fn parse_string_input_rejects_invalid_character() {
        let err = Playback::from_input_string("RX", 200).unwrap_err();
        assert!(err.to_string().contains("Invalid input character 'X'"));
    }

    #[test]
    fn parse_string_input_rejects_empty_input() {
        let err = Playback::from_input_string(" \n\t ", 200).unwrap_err();
        assert_eq!(
            err.to_string(),
            "Input string is empty after trimming whitespace"
        );
    }

    #[test]
    fn parse_input_file_rejects_missing_file() {
        let mut missing_path = std::env::temp_dir();
        let unique = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .expect("clock should be after epoch")
            .as_nanos();
        missing_path.push(format!(
            "gsnake-cli-missing-playback-{}-{unique}.json",
            std::process::id()
        ));

        let err = Playback::from_input_file(&missing_path).unwrap_err();
        assert!(
            err.to_string().contains("Failed to read input file"),
            "unexpected error: {err}"
        );
    }

    #[test]
    fn parse_input_file_rejects_malformed_json() {
        let playback_file = TempPlaybackFile::new("not-json");

        let err = Playback::from_input_file(playback_file.path()).unwrap_err();
        assert!(
            err.to_string().contains("Failed to parse playback JSON"),
            "unexpected error: {err}"
        );
    }

    #[test]
    fn parse_input_file_rejects_empty_playback() {
        let playback_file = TempPlaybackFile::new("[]");

        let err = Playback::from_input_file(playback_file.path()).unwrap_err();
        assert_eq!(err.to_string(), "Playback input file is empty");
    }

    #[test]
    fn parse_input_file_rejects_invalid_key() {
        let playback_file = TempPlaybackFile::new(r#"[{"key":"Sideways","delay_ms":25}]"#);

        let err = Playback::from_input_file(playback_file.path()).unwrap_err();
        assert!(err.to_string().contains("Invalid key 'Sideways'"));
    }

    #[test]
    fn parse_input_file_success_path() {
        let playback_file =
            TempPlaybackFile::new(r#"[{"key":"right","delay_ms":25},{"key":"Q","delay_ms":1}]"#);

        let playback = Playback::from_input_file(playback_file.path()).unwrap();
        assert_eq!(playback.steps.len(), 2);
        assert_eq!(playback.steps[0].action, Action::MoveEast);
        assert_eq!(playback.steps[0].delay, Duration::from_millis(25));
        assert_eq!(playback.steps[1].action, Action::Quit);
        assert_eq!(playback.steps[1].delay, Duration::from_millis(1));
    }
}
