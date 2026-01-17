use serde::{Deserialize, Serialize};
use ts_rs::TS;

/// Represents a 2D position on the game grid
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize, TS)]
pub struct Position {
    pub x: i32,
    pub y: i32,
}

impl Position {
    #[must_use]
    pub fn new(x: i32, y: i32) -> Self {
        Self { x, y }
    }
}

/// Represents the type of content in a grid cell
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, TS)]
pub enum CellType {
    Empty,
    SnakeHead,
    SnakeBody,
    Food,
    Obstacle,
    Exit,
}

/// Represents the current status of the game
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, TS)]
pub enum GameStatus {
    Playing,
    GameOver,
    LevelComplete,
    AllComplete,
}

/// Represents the four cardinal directions
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, TS)]
pub enum Direction {
    North,
    South,
    East,
    West,
}

impl Direction {
    /// Returns the opposite direction
    #[must_use]
    pub fn opposite(&self) -> Self {
        match self {
            Direction::North => Direction::South,
            Direction::South => Direction::North,
            Direction::East => Direction::West,
            Direction::West => Direction::East,
        }
    }
}

/// Represents the overall game state and progress
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(rename_all = "camelCase")]
pub struct GameState {
    pub status: GameStatus,
    pub current_level: u32,
    pub moves: u32,
    pub food_collected: u32,
    pub total_food: u32,
}

impl GameState {
    #[must_use]
    pub fn new(current_level: u32, total_food: u32) -> Self {
        Self {
            status: GameStatus::Playing,
            current_level,
            moves: 0,
            food_collected: 0,
            total_food,
        }
    }
}

/// Represents the snake entity
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, TS)]
pub struct Snake {
    pub segments: Vec<Position>,
    pub direction: Option<Direction>,
}

impl Snake {
    #[must_use]
    pub fn new(segments: Vec<Position>) -> Self {
        Self {
            segments,
            direction: None,
        }
    }

    #[must_use]
    pub fn head(&self) -> Option<&Position> {
        self.segments.first()
    }
}

/// Represents the dimensions of a grid
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, TS)]
pub struct GridSize {
    pub width: i32,
    pub height: i32,
}

impl GridSize {
    #[must_use]
    pub fn new(width: i32, height: i32) -> Self {
        Self { width, height }
    }
}

/// Immutable level definition loaded from JSON.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(rename_all = "camelCase")]
pub struct LevelDefinition {
    pub id: u32,
    pub name: String,
    pub grid_size: GridSize,
    pub snake: Vec<Position>,
    pub obstacles: Vec<Position>,
    pub food: Vec<Position>,
    pub exit: Position,
    #[serde(default)]
    pub snake_direction: Option<Direction>,
}

impl LevelDefinition {
    #[must_use]
    pub fn new(
        id: u32,
        name: String,
        grid_size: GridSize,
        snake: Vec<Position>,
        obstacles: Vec<Position>,
        food: Vec<Position>,
        exit: Position,
        snake_direction: Option<Direction>,
    ) -> Self {
        Self {
            id,
            name,
            grid_size,
            snake,
            obstacles,
            food,
            exit,
            snake_direction,
        }
    }
}

/// Runtime level state derived from a level definition.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct LevelState {
    pub grid_size: GridSize,
    pub snake: Snake,
    pub obstacles: Vec<Position>,
    pub food: Vec<Position>,
    pub exit: Position,
}

impl LevelState {
    #[must_use]
    pub fn from_definition(definition: &LevelDefinition) -> Self {
        let mut snake = Snake::new(definition.snake.clone());
        snake.direction = definition.snake_direction;

        Self {
            grid_size: definition.grid_size,
            snake,
            obstacles: definition.obstacles.clone(),
            food: definition.food.clone(),
            exit: definition.exit,
        }
    }
}

/// Represents a single frame of the game state to be rendered
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, TS)]
pub struct Frame {
    pub grid: Vec<Vec<CellType>>,
    pub state: GameState,
    pub snake: Snake,
}

impl Frame {
    #[must_use]
    pub fn new(grid: Vec<Vec<CellType>>, state: GameState, snake: Snake) -> Self {
        Self { grid, state, snake }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_position_creation() {
        let pos = Position::new(5, 10);
        assert_eq!(pos.x, 5);
        assert_eq!(pos.y, 10);
    }

    #[test]
    fn test_direction_opposite() {
        assert_eq!(Direction::North.opposite(), Direction::South);
        assert_eq!(Direction::South.opposite(), Direction::North);
        assert_eq!(Direction::East.opposite(), Direction::West);
        assert_eq!(Direction::West.opposite(), Direction::East);
    }

    #[test]
    fn test_game_state_creation() {
        let state = GameState::new(1, 5);
        assert_eq!(state.status, GameStatus::Playing);
        assert_eq!(state.current_level, 1);
        assert_eq!(state.moves, 0);
        assert_eq!(state.food_collected, 0);
        assert_eq!(state.total_food, 5);
    }

    #[test]
    fn test_snake_head() {
        let segments = vec![Position::new(0, 0), Position::new(0, 1)];
        let snake = Snake::new(segments);
        assert_eq!(snake.head(), Some(&Position::new(0, 0)));
    }

    #[test]
    fn test_serialization() {
        let pos = Position::new(5, 10);
        let json = serde_json::to_string(&pos).unwrap();
        let deserialized: Position = serde_json::from_str(&json).unwrap();
        assert_eq!(pos, deserialized);

        let state = GameState::new(1, 5);
        let json = serde_json::to_string(&state).unwrap();
        let deserialized: GameState = serde_json::from_str(&json).unwrap();
        assert_eq!(state, deserialized);
    }
}
