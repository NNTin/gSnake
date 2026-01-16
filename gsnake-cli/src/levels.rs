use anyhow::{Context, Result};
use gsnake_core::{GridSize, Level, Position, Snake};
use serde::Deserialize;
use std::fs;

/// JSON representation of a level with camelCase fields
#[derive(Debug, Deserialize)]
struct LevelJson {
    #[allow(dead_code)]
    id: u32,
    #[allow(dead_code)]
    name: String,
    #[serde(rename = "gridSize")]
    grid_size: GridSizeJson,
    snake: Vec<PositionJson>,
    obstacles: Vec<PositionJson>,
    food: Vec<PositionJson>,
    exit: PositionJson,
}

/// JSON representation of grid size
#[derive(Debug, Deserialize)]
struct GridSizeJson {
    width: usize,
    height: usize,
}

/// JSON representation of a position
#[derive(Debug, Deserialize)]
struct PositionJson {
    x: i32,
    y: i32,
}

impl From<PositionJson> for Position {
    fn from(pos: PositionJson) -> Self {
        Position::new(pos.x, pos.y)
    }
}

impl From<GridSizeJson> for GridSize {
    fn from(size: GridSizeJson) -> Self {
        GridSize::new(size.width as i32, size.height as i32)
    }
}

impl From<LevelJson> for Level {
    fn from(level_json: LevelJson) -> Self {
        let snake_positions: Vec<Position> = level_json.snake.into_iter().map(Into::into).collect();
        let obstacles: Vec<Position> = level_json.obstacles.into_iter().map(Into::into).collect();
        let food: Vec<Position> = level_json.food.into_iter().map(Into::into).collect();

        Level::new(
            level_json.grid_size.into(),
            Snake::new(snake_positions),
            obstacles,
            food,
            level_json.exit.into(),
        )
    }
}

/// Loads all levels from the levels.json file
pub fn load_levels(path: &str) -> Result<Vec<Level>> {
    let contents = fs::read_to_string(path)
        .with_context(|| format!("Failed to read levels file: {path}"))?;

    let levels_json: Vec<LevelJson> = serde_json::from_str(&contents)
        .with_context(|| "Failed to parse levels JSON")?;

    Ok(levels_json.into_iter().map(Into::into).collect())
}

/// Loads a specific level by ID (1-indexed)
#[allow(dead_code)]
pub fn load_level_by_id(path: &str, level_id: u32) -> Result<Level> {
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
        let levels = load_levels("data/levels.json").expect("Failed to load levels");
        assert!(!levels.is_empty(), "Should load at least one level");
        assert_eq!(levels.len(), 5, "Should load 5 levels");
    }

    #[test]
    fn test_level_structure() {
        let levels = load_levels("data/levels.json").expect("Failed to load levels");
        let first_level = &levels[0];

        // Verify first level has expected structure
        assert_eq!(first_level.grid_size.width, 15);
        assert_eq!(first_level.grid_size.height, 15);
        assert_eq!(first_level.snake.segments.len(), 3);
        assert!(!first_level.food.is_empty());
    }
}
