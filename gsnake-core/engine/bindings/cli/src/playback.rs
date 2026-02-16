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
        let raw_steps: Vec<PlaybackFileStep> = serde_json::from_str(&contents)
            .with_context(|| format!("Failed to parse playback JSON from {}", path.display()))?;

        if raw_steps.is_empty() {
            bail!("Playback input file is empty");
        }

        let mut steps = Vec::with_capacity(raw_steps.len());
        for (index, step) in raw_steps.into_iter().enumerate() {
            let action = parse_key(&step.key).with_context(|| {
                format!(
                    "Failed to parse key for playback step {} from {}",
                    index,
                    path.display()
                )
            })?;
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
        if let Some(ch) = key.chars().next() {
            if matches!(ch, 'R' | 'D' | 'L' | 'U') {
                return parse_string_char(ch);
            }
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
            let unique = match SystemTime::now().duration_since(UNIX_EPOCH) {
                Ok(duration) => duration.as_nanos(),
                Err(_) => 0,
            };
            let mut path = std::env::temp_dir();
            path.push(format!(
                "gsnake-cli-playback-{}-{unique}.json",
                std::process::id()
            ));
            if let Err(err) = fs::write(&path, contents) {
                panic!(
                    "failed to create temp playback file '{}': {err}",
                    path.display()
                );
            }
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
    fn parse_string_input() -> Result<()> {
        let playback = Playback::from_input_string("RDLU q r", 200)?;
        assert_eq!(playback.steps.len(), 6);
        assert_eq!(playback.steps[0].action, Action::MoveEast);
        assert_eq!(playback.steps[4].action, Action::Quit);
        assert_eq!(playback.steps[5].action, Action::Reset);
        Ok(())
    }

    #[test]
    fn parse_file_key_variants() -> Result<()> {
        assert_eq!(parse_key("Right")?, Action::MoveEast);
        assert_eq!(parse_key("U")?, Action::MoveNorth);
        assert_eq!(parse_key("reset")?, Action::Reset);
        assert_eq!(parse_key("q")?, Action::Quit);
        assert_eq!(parse_key(" north ")?, Action::MoveNorth);
        Ok(())
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
        let unique = match SystemTime::now().duration_since(UNIX_EPOCH) {
            Ok(duration) => duration.as_nanos(),
            Err(_) => 0,
        };
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
            err.to_string()
                .contains("Failed to parse playback JSON from"),
            "unexpected error: {err}"
        );
        assert!(
            err.to_string()
                .contains(&playback_file.path().display().to_string()),
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
        let err_chain = format!("{err:#}");
        assert!(
            err.to_string()
                .contains("Failed to parse key for playback step 0"),
            "unexpected error: {err}"
        );
        assert!(
            err_chain.contains("Invalid key 'Sideways'"),
            "unexpected error: {err_chain}"
        );
    }

    #[test]
    fn parse_input_file_rejects_invalid_key_with_index_context() {
        let playback_file = TempPlaybackFile::new(
            r#"[{"key":"Right","delay_ms":25},{"key":"Sideways","delay_ms":5}]"#,
        );

        let err = Playback::from_input_file(playback_file.path()).unwrap_err();
        let err_chain = format!("{err:#}");
        assert!(
            err.to_string()
                .contains("Failed to parse key for playback step 1"),
            "unexpected error: {err}"
        );
        assert!(
            err.to_string()
                .contains(&playback_file.path().display().to_string()),
            "unexpected error: {err}"
        );
        assert!(
            err_chain.contains("Invalid key 'Sideways'"),
            "unexpected error: {err_chain}"
        );
    }

    #[test]
    fn parse_input_file_success_path() -> Result<()> {
        let playback_file =
            TempPlaybackFile::new(r#"[{"key":"right","delay_ms":25},{"key":"Q","delay_ms":1}]"#);

        let playback = Playback::from_input_file(playback_file.path())?;
        assert_eq!(playback.steps.len(), 2);
        assert_eq!(playback.steps[0].action, Action::MoveEast);
        assert_eq!(playback.steps[0].delay, Duration::from_millis(25));
        assert_eq!(playback.steps[1].action, Action::Quit);
        assert_eq!(playback.steps[1].delay, Duration::from_millis(1));
        Ok(())
    }
}
