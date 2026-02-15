use serde::{Deserialize, Serialize};
use std::fmt;
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
    FloatingFood,
    FallingFood,
    Stone,
    Spike,
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
    #[serde(skip_serializing_if = "Option::is_none")]
    pub difficulty: Option<String>,
    pub grid_size: GridSize,
    pub snake: Vec<Position>,
    pub obstacles: Vec<Position>,
    pub food: Vec<Position>,
    pub exit: Position,
    pub snake_direction: Direction,
    #[serde(default)]
    pub floating_food: Vec<Position>,
    #[serde(default)]
    pub falling_food: Vec<Position>,
    #[serde(default)]
    pub stones: Vec<Position>,
    #[serde(default)]
    pub spikes: Vec<Position>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub exit_is_solid: Option<bool>,
    #[serde(default)]
    pub total_food: u32,
}

impl LevelDefinition {
    #[must_use]
    #[allow(clippy::too_many_arguments)]
    pub fn new(
        id: u32,
        name: String,
        grid_size: GridSize,
        snake: Vec<Position>,
        obstacles: Vec<Position>,
        food: Vec<Position>,
        exit: Position,
        snake_direction: Direction,
    ) -> Self {
        Self {
            id,
            name,
            difficulty: None,
            grid_size,
            snake,
            obstacles,
            food,
            exit,
            snake_direction,
            floating_food: Vec::new(),
            falling_food: Vec::new(),
            stones: Vec::new(),
            spikes: Vec::new(),
            exit_is_solid: Some(true),
            total_food: 0,
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
    pub floating_food: Vec<Position>,
    pub falling_food: Vec<Position>,
    pub stones: Vec<Position>,
    pub spikes: Vec<Position>,
    pub exit_is_solid: bool,
}

impl LevelState {
    #[must_use]
    pub fn from_definition(definition: &LevelDefinition) -> Self {
        let mut snake = Snake::new(definition.snake.clone());
        snake.direction = Some(definition.snake_direction);

        Self {
            grid_size: definition.grid_size,
            snake,
            obstacles: definition.obstacles.clone(),
            food: definition.food.clone(),
            exit: definition.exit,
            floating_food: definition.floating_food.clone(),
            falling_food: definition.falling_food.clone(),
            stones: definition.stones.clone(),
            spikes: definition.spikes.clone(),
            exit_is_solid: definition.exit_is_solid.unwrap_or(true),
        }
    }
}

/// Represents a single frame of the game state to be rendered
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, TS)]
pub struct Frame {
    pub grid: Vec<Vec<CellType>>,
    pub state: GameState,
}

impl Frame {
    #[must_use]
    pub fn new(grid: Vec<Vec<CellType>>, state: GameState) -> Self {
        Self { grid, state }
    }
}

/// Runtime engine errors surfaced when game state invariants are violated.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(rename_all = "camelCase")]
pub enum EngineError {
    SnakeHasNoSegments,
}

impl fmt::Display for EngineError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::SnakeHasNoSegments => {
                write!(
                    f,
                    "Invalid snake state: expected at least one segment, found 0"
                )
            },
        }
    }
}

impl std::error::Error for EngineError {}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(rename_all = "camelCase")]
pub struct ContractError {
    pub kind: ContractErrorKind,
    pub message: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub context: Option<std::collections::BTreeMap<String, String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub rejection_reason: Option<RejectionReason>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(rename_all = "camelCase")]
pub struct RejectionReason {
    pub reason: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(rename_all = "camelCase")]
pub enum ContractErrorKind {
    #[serde(rename = "invalidInput")]
    #[ts(rename = "invalidInput")]
    InvalidInput,
    #[serde(rename = "inputRejected")]
    #[ts(rename = "inputRejected")]
    InputRejected,
    #[serde(rename = "serializationFailed")]
    #[ts(rename = "serializationFailed")]
    SerializationFailed,
    #[serde(rename = "initializationFailed")]
    #[ts(rename = "initializationFailed")]
    InitializationFailed,
    #[serde(rename = "internalError")]
    #[ts(rename = "internalError")]
    InternalError,
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

    #[test]
    fn test_contract_error_serialization() {
        let error = ContractError {
            kind: ContractErrorKind::InvalidInput,
            message: "Invalid direction".to_string(),
            context: None,
            rejection_reason: None,
        };

        let json = serde_json::to_string(&error).unwrap();
        let deserialized: ContractError = serde_json::from_str(&json).unwrap();
        assert_eq!(error, deserialized);
    }

    #[test]
    fn test_enum_string_values() {
        assert_eq!(
            serde_json::to_string(&Direction::North).unwrap(),
            "\"North\""
        );
        assert_eq!(
            serde_json::to_string(&CellType::SnakeHead).unwrap(),
            "\"SnakeHead\""
        );
        assert_eq!(
            serde_json::to_string(&GameStatus::LevelComplete).unwrap(),
            "\"LevelComplete\""
        );
        assert_eq!(
            serde_json::to_string(&ContractErrorKind::InvalidInput).unwrap(),
            "\"invalidInput\""
        );
    }
}
