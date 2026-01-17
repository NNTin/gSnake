use anyhow::{Context, Result};
use gsnake_core::{levels::parse_levels_json, LevelDefinition};
use std::{fs, path::{Path, PathBuf}};

/// Loads all levels from the levels.json file
pub fn load_levels<P: AsRef<Path>>(path: P) -> Result<Vec<LevelDefinition>> {
    let path_ref = path.as_ref();
    let contents = fs::read_to_string(path_ref)
        .with_context(|| format!("Failed to read levels file: {}", path_ref.display()))?;

    let levels_json = parse_levels_json(&contents)
        .with_context(|| "Failed to parse levels JSON")?;

    Ok(levels_json)
}

/// Loads a specific level by ID (1-indexed)
#[allow(dead_code)]
pub fn load_level_by_id<P: AsRef<Path>>(path: P, level_id: u32) -> Result<LevelDefinition> {
    let levels = load_levels(path)?;

    if level_id == 0 {
        return Err(anyhow::anyhow!("Level IDs start at 1"));
    }

    levels
        .into_iter()
        .nth((level_id - 1) as usize)
        .ok_or_else(|| anyhow::anyhow!("Level {level_id} not found"))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_load_levels() {
        let levels = load_levels(levels_path()).expect("Failed to load levels");
        assert!(!levels.is_empty(), "Should load at least one level");
        assert_eq!(levels.len(), 5, "Should load 5 levels");
    }

    #[test]
    fn test_level_structure() {
        let levels = load_levels(levels_path()).expect("Failed to load levels");
        let first_level = &levels[0];

        // Verify first level has expected structure
        assert_eq!(first_level.grid_size.width, 15);
        assert_eq!(first_level.grid_size.height, 15);
        assert_eq!(first_level.snake.len(), 3);
        assert!(!first_level.food.is_empty());
    }
}
pub fn levels_path() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../../core/data/levels.json")
}
