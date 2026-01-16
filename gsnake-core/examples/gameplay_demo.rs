use gsnake_core::{
    engine::GameEngine, CellType, Direction, GameStatus, GridSize, Level, Position, Snake,
};

fn print_frame(engine: &GameEngine) {
    let frame = engine.generate_frame();
    println!("\n=== Frame {} ===", engine.game_state().moves);
    println!(
        "Status: {:?} | Food: {}/{}",
        frame.state.status, frame.state.food_collected, frame.state.total_food
    );

    for row in &frame.grid {
        for cell in row {
            let c = match cell {
                CellType::Empty => ".",
                CellType::SnakeHead => "H",
                CellType::SnakeBody => "B",
                CellType::Food => "F",
                CellType::Obstacle => "#",
                CellType::Exit => "E",
            };
            print!("{} ", c);
        }
        println!();
    }
}

fn main() {
    println!("=== gSnake Core Engine Demo ===\n");

    // Create a simple level: snake starts on floor, collects food along the way, reaches exit
    let level = Level::new(
        GridSize::new(8, 6),
        Snake::new(vec![Position::new(1, 4)]),
        vec![
            // Ground floor at row 5
            Position::new(0, 5),
            Position::new(1, 5),
            Position::new(2, 5),
            Position::new(3, 5),
            Position::new(4, 5),
            Position::new(5, 5),
            Position::new(6, 5),
            Position::new(7, 5),
        ],
        vec![Position::new(3, 4), Position::new(5, 4)],
        Position::new(7, 4),
    );

    let mut engine = GameEngine::new(level);

    println!("Initial state:");
    print_frame(&engine);

    println!("\n--- Move 1: East (head towards first food) ---");
    engine.process_move(Direction::East);
    print_frame(&engine);

    println!("\n--- Move 2: East (collect first food) ---");
    engine.process_move(Direction::East);
    print_frame(&engine);

    println!("\n--- Move 3: East (head towards second food) ---");
    engine.process_move(Direction::East);
    print_frame(&engine);

    println!("\n--- Move 4: East (collect second food) ---");
    engine.process_move(Direction::East);
    print_frame(&engine);

    println!("\n--- Move 5: East (head towards exit) ---");
    engine.process_move(Direction::East);
    print_frame(&engine);

    println!("\n--- Move 6: East (reach exit - level complete!) ---");
    engine.process_move(Direction::East);
    print_frame(&engine);

    if engine.game_state().status == GameStatus::LevelComplete {
        println!("\n🎉 LEVEL COMPLETE! 🎉");
    }

    println!("\nFinal Stats:");
    println!("  Total Moves: {}", engine.game_state().moves);
    println!(
        "  Food Collected: {}/{}",
        engine.game_state().food_collected,
        engine.game_state().total_food
    );
}
