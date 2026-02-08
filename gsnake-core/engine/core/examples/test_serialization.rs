use gsnake_core::{CellType, Direction, Frame, GameState, GameStatus};

fn main() {
    println!("=== Testing gSnake Core Serialization ===\n");

    // Test 1: Create and serialize a Frame
    let grid = vec![
        vec![CellType::Empty, CellType::SnakeHead, CellType::Empty],
        vec![CellType::Empty, CellType::SnakeBody, CellType::Food],
        vec![CellType::Obstacle, CellType::Empty, CellType::Exit],
    ];
    let state = GameState::new(1, 5);
    let mut frame = Frame::new(grid, state);
    frame.state.moves = 5;
    frame.state.food_collected = 2;

    let json = serde_json::to_string_pretty(&frame).expect("Failed to serialize");
    println!("Serialized Frame to JSON:");
    println!("{json}\n");

    // Test 2: Deserialize the JSON back
    let deserialized: Frame = serde_json::from_str(&json).expect("Failed to deserialize");
    println!("✅ Successfully deserialized Frame!");
    println!(
        "Grid dimensions: {}x{}",
        deserialized.grid.len(),
        deserialized.grid[0].len()
    );
    println!("Game status: {:?}", deserialized.state.status);
    println!("Level: {}", deserialized.state.current_level);
    println!("Moves: {}", deserialized.state.moves);
    println!(
        "Food: {}/{}\n",
        deserialized.state.food_collected, deserialized.state.total_food
    );

    // Test 3: Test all enum serialization
    println!("=== Testing Enum Serialization ===");
    let direction = Direction::North;
    let dir_json = serde_json::to_string(&direction).unwrap();
    println!("Direction::North serialized: {dir_json}");

    let cell = CellType::SnakeHead;
    let cell_json = serde_json::to_string(&cell).unwrap();
    println!("CellType::SnakeHead serialized: {cell_json}");

    let status = GameStatus::Playing;
    let status_json = serde_json::to_string(&status).unwrap();
    println!("GameStatus::Playing serialized: {status_json}\n");

    println!("✅ All serialization tests passed!");
}
