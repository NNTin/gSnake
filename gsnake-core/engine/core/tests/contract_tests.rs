use gsnake_core::{
    engine::GameEngine, CellType, ContractError, ContractErrorKind, Direction, Frame, GameState,
    GameStatus, GridSize, LevelDefinition, Position,
};
use std::collections::BTreeMap;
use std::fs;
use std::path::{Path, PathBuf};

// =============================================================================
// 2.1 Enum Serialization Tests
// =============================================================================

#[test]
fn test_direction_serialization() {
    assert_eq!(
        serde_json::to_string(&Direction::North).unwrap(),
        "\"North\""
    );
    assert_eq!(
        serde_json::to_string(&Direction::South).unwrap(),
        "\"South\""
    );
    assert_eq!(serde_json::to_string(&Direction::East).unwrap(), "\"East\"");
    assert_eq!(serde_json::to_string(&Direction::West).unwrap(), "\"West\"");
}

#[test]
fn test_celltype_serialization() {
    for (cell_type, expected) in [
        (CellType::Empty, "\"Empty\""),
        (CellType::SnakeHead, "\"SnakeHead\""),
        (CellType::SnakeBody, "\"SnakeBody\""),
        (CellType::Food, "\"Food\""),
        (CellType::Obstacle, "\"Obstacle\""),
        (CellType::Exit, "\"Exit\""),
        (CellType::FloatingFood, "\"FloatingFood\""),
        (CellType::FallingFood, "\"FallingFood\""),
        (CellType::Stone, "\"Stone\""),
        (CellType::Spike, "\"Spike\""),
    ] {
        assert_eq!(
            serde_json::to_string(&cell_type).unwrap(),
            expected,
            "CellType serialization mismatch for {cell_type:?}"
        );
    }
}

#[test]
fn test_gamestatus_serialization() {
    assert_eq!(
        serde_json::to_string(&GameStatus::Playing).unwrap(),
        "\"Playing\""
    );
    assert_eq!(
        serde_json::to_string(&GameStatus::GameOver).unwrap(),
        "\"GameOver\""
    );
    assert_eq!(
        serde_json::to_string(&GameStatus::LevelComplete).unwrap(),
        "\"LevelComplete\""
    );
    assert_eq!(
        serde_json::to_string(&GameStatus::AllComplete).unwrap(),
        "\"AllComplete\""
    );
}

#[test]
fn test_contracterrorkind_serialization() {
    assert_eq!(
        serde_json::to_string(&ContractErrorKind::InvalidInput).unwrap(),
        "\"invalidInput\""
    );
    assert_eq!(
        serde_json::to_string(&ContractErrorKind::InputRejected).unwrap(),
        "\"inputRejected\""
    );
    assert_eq!(
        serde_json::to_string(&ContractErrorKind::SerializationFailed).unwrap(),
        "\"serializationFailed\""
    );
    assert_eq!(
        serde_json::to_string(&ContractErrorKind::InitializationFailed).unwrap(),
        "\"initializationFailed\""
    );
    assert_eq!(
        serde_json::to_string(&ContractErrorKind::InternalError).unwrap(),
        "\"internalError\""
    );
}

// =============================================================================
// 2.2 Struct Serialization Tests
// =============================================================================

#[test]
fn test_frame_field_names() {
    let grid = vec![vec![CellType::Empty, CellType::SnakeHead]];
    let state = GameState::new(1, 5);
    let frame = Frame::new(grid, state);

    let json = serde_json::to_value(&frame).unwrap();
    assert!(json.get("grid").is_some(), "Frame must have 'grid' field");
    assert!(json.get("state").is_some(), "Frame must have 'state' field");
    assert!(
        json.get("snake_grid").is_none(),
        "Frame must not use snake_case field names"
    );
    assert!(
        json.get("game_state").is_none(),
        "Frame must not use snake_case field names"
    );
}

#[test]
fn test_gamestate_camelcase_fields() {
    let state = GameState::new(1, 5);
    let json = serde_json::to_value(&state).unwrap();

    assert!(
        json.get("currentLevel").is_some(),
        "GameState must use camelCase 'currentLevel'"
    );
    assert!(
        json.get("foodCollected").is_some(),
        "GameState must use camelCase 'foodCollected'"
    );
    assert!(
        json.get("totalFood").is_some(),
        "GameState must use camelCase 'totalFood'"
    );
    assert!(
        json.get("current_level").is_none(),
        "GameState must not use snake_case"
    );
    assert!(
        json.get("food_collected").is_none(),
        "GameState must not use snake_case"
    );
    assert!(
        json.get("total_food").is_none(),
        "GameState must not use snake_case"
    );
}

#[test]
fn test_leveldefinition_camelcase_fields() {
    let level = create_test_level();
    let json = serde_json::to_value(&level).unwrap();

    assert!(
        json.get("gridSize").is_some(),
        "LevelDefinition must use camelCase 'gridSize'"
    );
    assert!(
        json.get("snakeDirection").is_some(),
        "LevelDefinition must use camelCase 'snakeDirection'"
    );
    assert!(
        json.get("grid_size").is_none(),
        "LevelDefinition must not use snake_case"
    );
    assert!(
        json.get("snake_direction").is_none(),
        "LevelDefinition must not use snake_case"
    );
}

#[test]
fn test_contracterror_without_context() {
    let error = ContractError {
        kind: ContractErrorKind::InvalidInput,
        message: "Test error".to_string(),
        context: None,
        rejection_reason: None,
    };

    let json = serde_json::to_string(&error).unwrap();
    assert!(
        !json.contains("context"),
        "Optional context field should not be serialized when None"
    );

    let json_value = serde_json::to_value(&error).unwrap();
    assert!(json_value.get("kind").is_some());
    assert!(json_value.get("message").is_some());
    assert!(json_value.get("context").is_none());
}

#[test]
fn test_contracterror_with_context() {
    let mut context = BTreeMap::new();
    context.insert("input".to_string(), "InvalidDirection".to_string());

    let error = ContractError {
        kind: ContractErrorKind::InvalidInput,
        message: "Test error".to_string(),
        context: Some(context),
        rejection_reason: None,
    };

    let json_value = serde_json::to_value(&error).unwrap();
    assert!(json_value.get("kind").is_some());
    assert!(json_value.get("message").is_some());
    assert!(
        json_value.get("context").is_some(),
        "Context field should be serialized when Some"
    );
}

// =============================================================================
// 2.3 Round-Trip Tests
// =============================================================================

#[test]
fn test_direction_roundtrip() {
    for direction in [
        Direction::North,
        Direction::South,
        Direction::East,
        Direction::West,
    ] {
        let json = serde_json::to_string(&direction).unwrap();
        let deserialized: Direction = serde_json::from_str(&json).unwrap();
        assert_eq!(
            direction, deserialized,
            "Direction round-trip failed for {direction:?}"
        );
    }
}

#[test]
fn test_celltype_roundtrip() {
    for cell_type in [
        CellType::Empty,
        CellType::SnakeHead,
        CellType::SnakeBody,
        CellType::Food,
        CellType::Obstacle,
        CellType::Exit,
        CellType::FloatingFood,
        CellType::FallingFood,
        CellType::Stone,
        CellType::Spike,
    ] {
        let json = serde_json::to_string(&cell_type).unwrap();
        let deserialized: CellType = serde_json::from_str(&json).unwrap();
        assert_eq!(
            cell_type, deserialized,
            "CellType round-trip failed for {cell_type:?}"
        );
    }
}

#[test]
fn test_gamestatus_roundtrip() {
    for status in [
        GameStatus::Playing,
        GameStatus::GameOver,
        GameStatus::LevelComplete,
        GameStatus::AllComplete,
    ] {
        let json = serde_json::to_string(&status).unwrap();
        let deserialized: GameStatus = serde_json::from_str(&json).unwrap();
        assert_eq!(
            status, deserialized,
            "GameStatus round-trip failed for {status:?}"
        );
    }
}

#[test]
fn test_frame_roundtrip() {
    let frame = create_test_frame();
    let json = serde_json::to_string(&frame).unwrap();
    let deserialized: Frame = serde_json::from_str(&json).unwrap();
    assert_eq!(frame, deserialized, "Frame round-trip failed");
}

#[test]
fn test_leveldefinition_roundtrip() {
    let level = create_test_level();
    let json = serde_json::to_string(&level).unwrap();
    let deserialized: LevelDefinition = serde_json::from_str(&json).unwrap();
    assert_eq!(level, deserialized, "LevelDefinition round-trip failed");
}

#[test]
fn test_contracterror_roundtrip() {
    let error = create_error(ContractErrorKind::InvalidInput);
    let json = serde_json::to_string(&error).unwrap();
    let deserialized: ContractError = serde_json::from_str(&json).unwrap();
    assert_eq!(error, deserialized, "ContractError round-trip failed");
}

// =============================================================================
// 2.4 Stone Interaction Matrix Contract Tests
// =============================================================================

#[test]
fn stone_push_matrix_horizontal_single_push_moves_snake_and_stone() {
    let mut level = create_stone_matrix_level();
    level.stones = vec![Position::new(2, 1)];

    let mut engine = create_engine(level);
    let result = engine.process_move(Direction::East).unwrap();

    assert!(result, "horizontal push into free space should be accepted");
    assert_eq!(engine.level_state().snake.segments[0], Position::new(2, 1));
    assert_eq!(engine.level_state().stones, vec![Position::new(3, 1)]);
    assert_eq!(engine.game_state().moves, 1);
    assert_eq!(engine.game_state().status, GameStatus::Playing);
}

#[test]
fn stone_push_matrix_horizontal_row_push_shifts_entire_row() {
    let mut level = create_stone_matrix_level();
    level.stones = vec![
        Position::new(2, 1),
        Position::new(3, 1),
        Position::new(4, 1),
    ];

    let mut engine = create_engine(level);
    let result = engine.process_move(Direction::East).unwrap();

    assert!(result, "horizontal push should shift every connected stone");
    assert_eq!(engine.level_state().snake.segments[0], Position::new(2, 1));
    assert_eq!(
        engine.level_state().stones,
        vec![
            Position::new(3, 1),
            Position::new(4, 1),
            Position::new(5, 1)
        ]
    );
    assert_eq!(engine.game_state().moves, 1);
}

#[test]
fn stone_push_matrix_horizontal_row_push_is_rejected_when_target_blocked() {
    let mut level = create_stone_matrix_level();
    level.stones = vec![Position::new(2, 1), Position::new(3, 1)];
    level.obstacles.push(Position::new(4, 1));

    let mut engine = create_engine(level);
    let result = engine.process_move(Direction::East).unwrap();

    assert!(
        !result,
        "horizontal push must be rejected if the row target cell is blocked"
    );
    assert_eq!(engine.level_state().snake.segments[0], Position::new(1, 1));
    assert_eq!(
        engine.level_state().stones,
        vec![Position::new(2, 1), Position::new(3, 1)]
    );
    assert_eq!(engine.game_state().moves, 0);
}

#[test]
fn stone_push_matrix_vertical_push_attempt_is_rejected_without_state_changes() {
    let mut level = create_stone_matrix_level();
    level.snake = vec![Position::new(2, 2)];
    level.stones = vec![Position::new(2, 1)];

    let mut engine = create_engine(level);
    let result = engine.process_move(Direction::North).unwrap();

    assert!(
        !result,
        "vertical moves into stones should be rejected instead of pushed"
    );
    assert_eq!(engine.level_state().snake.segments[0], Position::new(2, 2));
    assert_eq!(engine.level_state().stones, vec![Position::new(2, 1)]);
    assert_eq!(engine.game_state().moves, 0);
}

#[test]
fn stone_push_matrix_horizontal_push_into_vertical_stack_moves_only_same_row_stone() {
    let mut level = create_stone_matrix_level();
    level.stones = vec![Position::new(2, 0), Position::new(2, 1)];

    let mut engine = create_engine(level);
    let result = engine.process_move(Direction::East).unwrap();

    assert!(
        result,
        "horizontal push into vertical stack should still push the contacted row"
    );
    assert_eq!(engine.level_state().snake.segments[0], Position::new(2, 1));
    assert!(
        engine.level_state().stones.contains(&Position::new(2, 0)),
        "stone above should not be shifted horizontally"
    );
    assert!(
        engine.level_state().stones.contains(&Position::new(3, 1)),
        "only the stone at snake level should move horizontally"
    );
    assert_eq!(engine.level_state().stones.len(), 2);
}

#[test]
fn stone_push_matrix_push_onto_spike_destroys_stone() {
    let mut level = create_stone_matrix_level();
    level.stones = vec![Position::new(2, 1)];
    level.spikes = vec![Position::new(3, 1)];

    let mut engine = create_engine(level);
    let result = engine.process_move(Direction::East).unwrap();

    assert!(result, "push onto spike should still be accepted");
    assert_eq!(engine.level_state().snake.segments[0], Position::new(2, 1));
    assert!(engine.level_state().stones.is_empty());
    assert_eq!(engine.game_state().moves, 1);
}

// =============================================================================
// 3. Fixture Generation
// =============================================================================

#[test]
fn generate_contract_fixtures() {
    let fixtures_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("tests/fixtures");
    fs::create_dir_all(&fixtures_dir).unwrap();

    // Generate canonical examples
    write_fixture(&fixtures_dir, "frame.json", &create_test_frame());
    write_fixture(&fixtures_dir, "level.json", &create_test_level());
    write_fixture(
        &fixtures_dir,
        "error-invalid-input.json",
        &create_error(ContractErrorKind::InvalidInput),
    );
    write_fixture(
        &fixtures_dir,
        "error-input-rejected.json",
        &create_error(ContractErrorKind::InputRejected),
    );
    write_fixture(
        &fixtures_dir,
        "error-serialization-failed.json",
        &create_error(ContractErrorKind::SerializationFailed),
    );
    write_fixture(
        &fixtures_dir,
        "error-initialization-failed.json",
        &create_error(ContractErrorKind::InitializationFailed),
    );
    write_fixture(
        &fixtures_dir,
        "error-internal-error.json",
        &create_error(ContractErrorKind::InternalError),
    );
    write_fixture(
        &fixtures_dir,
        "error-with-context.json",
        &create_error_with_context(),
    );
}

// =============================================================================
// Helper Functions
// =============================================================================

fn write_fixture<T: serde::Serialize>(dir: &Path, filename: &str, data: &T) {
    let path = dir.join(filename);
    let json = serde_json::to_string_pretty(data).unwrap();
    fs::write(&path, json).unwrap();
}

fn create_test_frame() -> Frame {
    let grid = vec![
        vec![CellType::Obstacle, CellType::Empty, CellType::Empty],
        vec![CellType::Empty, CellType::SnakeHead, CellType::Empty],
        vec![CellType::Empty, CellType::SnakeBody, CellType::Food],
        vec![CellType::Empty, CellType::Empty, CellType::Exit],
    ];
    let state = GameState {
        status: GameStatus::Playing,
        current_level: 1,
        moves: 5,
        food_collected: 2,
        total_food: 3,
    };
    Frame::new(grid, state)
}

fn create_test_level() -> LevelDefinition {
    LevelDefinition::new(
        1,
        "Test Level".to_string(),
        GridSize::new(5, 5),
        vec![Position::new(2, 2), Position::new(2, 3)],
        vec![Position::new(0, 0), Position::new(4, 4)],
        vec![Position::new(1, 1), Position::new(3, 3)],
        Position::new(4, 0),
        Direction::North,
    )
}

fn create_stone_matrix_level() -> LevelDefinition {
    let mut level = LevelDefinition::new(
        99,
        "Stone Matrix Level".to_string(),
        GridSize::new(8, 6),
        vec![Position::new(1, 1)],
        vec![],
        vec![],
        Position::new(7, 5),
        Direction::East,
    );

    // Add a platform to isolate push semantics from gravity side effects.
    level.obstacles = (0..8).map(|x| Position::new(x, 2)).collect();
    level
}

fn create_engine(level: LevelDefinition) -> GameEngine {
    GameEngine::new(level).expect("stone matrix fixture should construct a valid engine")
}

fn create_error(kind: ContractErrorKind) -> ContractError {
    let message = match kind {
        ContractErrorKind::InvalidInput => "Invalid input provided",
        ContractErrorKind::InputRejected => "Input rejected by game logic",
        ContractErrorKind::SerializationFailed => "Failed to serialize data",
        ContractErrorKind::InitializationFailed => "Failed to initialize game",
        ContractErrorKind::InternalError => "Internal error occurred",
    };

    ContractError {
        kind,
        message: message.to_string(),
        context: None,
        rejection_reason: None,
    }
}

fn create_error_with_context() -> ContractError {
    let mut context = BTreeMap::new();
    context.insert("input".to_string(), "InvalidDirection".to_string());
    context.insert("expected".to_string(), "North|South|East|West".to_string());

    ContractError {
        kind: ContractErrorKind::InvalidInput,
        message: "Invalid direction provided".to_string(),
        context: Some(context),
        rejection_reason: None,
    }
}
