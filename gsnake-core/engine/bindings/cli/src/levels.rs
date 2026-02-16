use anyhow::{Context, Result};
use gsnake_core::{levels::parse_levels_json, LevelDefinition};
use std::{
    fs,
    path::{Path, PathBuf},
};

/// Loads all levels from the levels.json file
pub fn load_levels<P: AsRef<Path>>(path: P) -> Result<Vec<LevelDefinition>> {
    let path_ref = path.as_ref();
    let contents = fs::read_to_string(path_ref)
        .with_context(|| format!("Failed to read levels file: {}", path_ref.display()))?;

    let levels_json = parse_levels_json(&contents)
        .with_context(|| format!("Failed to parse levels JSON from {}", path_ref.display()))?;

    Ok(levels_json)
}

/// Loads a specific level by index (1-indexed position in the array)
pub fn load_level_by_index<P: AsRef<Path>>(path: P, level_index: u32) -> Result<LevelDefinition> {
    let levels = load_levels(path)?;

    if level_index == 0 {
        return Err(anyhow::anyhow!("Level indices start at 1"));
    }

    levels
        .into_iter()
        .nth((level_index - 1) as usize)
        .ok_or_else(|| anyhow::anyhow!("Level index {level_index} not found"))
}

/// Loads a specific level by JSON id field
pub fn load_level_by_json_id<P: AsRef<Path>>(path: P, json_id: u32) -> Result<LevelDefinition> {
    let levels = load_levels(path)?;
    let mut matches = levels.into_iter().filter(|level| level.id == json_id);
    let level = matches
        .next()
        .ok_or_else(|| anyhow::anyhow!("Level with id {json_id} not found"))?;
    if matches.next().is_some() {
        return Err(anyhow::anyhow!("Multiple levels found with id {json_id}"));
    }
    Ok(level)
}

/// Loads a single level definition from a JSON file
pub fn load_level_from_file<P: AsRef<Path>>(path: P) -> Result<LevelDefinition> {
    let path_ref = path.as_ref();
    let contents = fs::read_to_string(path_ref)
        .with_context(|| format!("Failed to read level file: {}", path_ref.display()))?;
    let level: LevelDefinition = serde_json::from_str(&contents)
        .with_context(|| format!("Failed to parse level JSON from {}", path_ref.display()))?;
    Ok(level)
}

#[must_use]
pub fn levels_path() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../../core/data/levels.json")
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::{
        fs,
        path::{Path, PathBuf},
        time::{SystemTime, UNIX_EPOCH},
    };

    struct TempLevelFile {
        path: PathBuf,
    }

    impl TempLevelFile {
        fn new(contents: &str) -> Result<Self> {
            let unique = match SystemTime::now().duration_since(UNIX_EPOCH) {
                Ok(duration) => duration.as_nanos(),
                Err(_) => 0,
            };
            let mut path = std::env::temp_dir();
            path.push(format!(
                "gsnake-cli-levels-test-{}-{unique}.json",
                std::process::id()
            ));
            fs::write(&path, contents)
                .with_context(|| format!("Failed to create temp level file {}", path.display()))?;
            Ok(Self { path })
        }

        fn path(&self) -> &Path {
            &self.path
        }
    }

    impl Drop for TempLevelFile {
        fn drop(&mut self) {
            let _ = fs::remove_file(&self.path);
        }
    }

    #[test]
    fn test_load_levels() -> Result<()> {
        let levels = load_levels(levels_path())?;
        assert!(!levels.is_empty(), "Should load at least one level");
        assert_eq!(levels.len(), 20, "Should load 20 levels");
        Ok(())
    }

    #[test]
    fn test_level_structure() -> Result<()> {
        let levels = load_levels(levels_path())?;
        let first_level = &levels[0];

        // Verify first level has expected structure
        assert_eq!(first_level.grid_size.width, 15);
        assert_eq!(first_level.grid_size.height, 15);
        assert_eq!(first_level.snake.len(), 3);
        assert!(!first_level.food.is_empty());
        Ok(())
    }

    #[test]
    fn load_level_from_file_rejects_malformed_json_with_path_context() -> Result<()> {
        let malformed_file = TempLevelFile::new("{ not-json }")?;

        let err = load_level_from_file(malformed_file.path()).unwrap_err();
        let err_chain = format!("{err:#}");
        assert!(
            err_chain.contains("Failed to parse level JSON from"),
            "unexpected error: {err_chain}"
        );
        assert!(
            err_chain.contains(&malformed_file.path().display().to_string()),
            "unexpected error: {err_chain}"
        );
        Ok(())
    }

    #[test]
    fn load_levels_rejects_malformed_json_with_path_context() -> Result<()> {
        let malformed_file = TempLevelFile::new("not-json")?;

        let err = load_levels(malformed_file.path()).unwrap_err();
        let err_chain = format!("{err:#}");
        assert!(
            err_chain.contains("Failed to parse levels JSON from"),
            "unexpected error: {err_chain}"
        );
        assert!(
            err_chain.contains(&malformed_file.path().display().to_string()),
            "unexpected error: {err_chain}"
        );
        Ok(())
    }
}
