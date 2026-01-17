use crate::{GridSize, Level, Position, Snake};
use serde::{Deserialize, Serialize};

/// JSON-facing level definition shared across bindings.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LevelDefinition {
    pub id: u32,
    pub name: String,
    #[serde(rename = "gridSize")]
    pub grid_size: GridSize,
    pub snake: Vec<Position>,
    pub obstacles: Vec<Position>,
    pub food: Vec<Position>,
    pub exit: Position,
}

impl From<LevelDefinition> for Level {
    fn from(level: LevelDefinition) -> Self {
        Level::new(
            level.grid_size,
            Snake::new(level.snake),
            level.obstacles,
            level.food,
            level.exit,
        )
    }
}

pub fn parse_levels_json(data: &str) -> Result<Vec<LevelDefinition>, serde_json::Error> {
    serde_json::from_str(data)
}

#[cfg(test)]
mod tests {
    use super::*;

    const SAMPLE_LEVELS: &str = r#"
[
  {
    "id": 1,
    "name": "Sample",
    "gridSize": { "width": 5, "height": 5 },
    "snake": [{ "x": 1, "y": 1 }],
    "obstacles": [],
    "food": [{ "x": 2, "y": 2 }],
    "exit": { "x": 4, "y": 4 }
  }
]
"#;

    #[test]
    fn parses_levels_json() {
        let levels = parse_levels_json(SAMPLE_LEVELS).expect("Failed to parse levels");
        assert_eq!(levels.len(), 1);
        assert_eq!(levels[0].id, 1);
        assert_eq!(levels[0].name, "Sample");
        assert_eq!(levels[0].grid_size.width, 5);
        assert_eq!(levels[0].grid_size.height, 5);
    }
}
