use crate::{
    gravity, stone_mechanics, CellType, Direction, Frame, GameState, GameStatus, LevelDefinition,
    LevelState, Position,
};

/// Main game engine that manages game state and processes moves
#[derive(Debug, Clone)]
pub struct GameEngine {
    level_definition: LevelDefinition,
    level_state: LevelState,
    game_state: GameState,
    input_locked: bool,
}

impl GameEngine {
    /// Creates a new game engine with the given level definition
    #[must_use]
    pub fn new(level: LevelDefinition) -> Self {
        // Calculate total food requirement
        // If total_food is explicitly set (non-zero), use it
        // Otherwise, count all food items (regular + floating + falling)
        let total_food = if level.total_food > 0 {
            level.total_food
        } else {
            (level.food.len() + level.floating_food.len() + level.falling_food.len()) as u32
        };

        let current_level = if level.id == 0 { 1 } else { level.id };
        let level_state = LevelState::from_definition(&level);

        Self {
            game_state: GameState::new(current_level, total_food),
            level_definition: level,
            level_state,
            input_locked: false,
        }
    }

    /// Returns a reference to the current game state
    #[must_use]
    pub fn game_state(&self) -> &GameState {
        &self.game_state
    }

    /// Returns a reference to the current level definition
    #[must_use]
    pub fn level_definition(&self) -> &LevelDefinition {
        &self.level_definition
    }

    /// Returns a reference to the current level state
    #[must_use]
    pub fn level_state(&self) -> &LevelState {
        &self.level_state
    }

    /// Processes a move in the given direction
    /// Returns true if the move was processed, false if input was locked or invalid
    pub fn process_move(&mut self, direction: Direction) -> bool {
        // Check if input is locked or game is not in Playing state
        if self.input_locked || self.game_state.status != GameStatus::Playing {
            return false;
        }

        if self.level_state.snake.segments.is_empty() {
            self.game_state.status = GameStatus::GameOver;
            return false;
        }

        // Lock input immediately
        self.input_locked = true;

        // Check for opposite direction (prevent 180-degree turns)
        if let Some(current_dir) = self.level_state.snake.direction {
            if Self::is_opposite_direction(direction, current_dir) {
                self.input_locked = false;
                return false;
            }
        }

        // Update snake direction
        self.level_state.snake.direction = Some(direction);

        // Calculate new head position
        let current_head = *self.level_state.snake.segments.first().unwrap();
        let new_head = Self::get_new_head_position(current_head, direction);

        // Check if moving into a stone
        if self.is_stone(new_head) {
            // Try to push the stone
            let push_result =
                stone_mechanics::try_push_stone(new_head, direction, &mut self.level_state);

            match push_result {
                stone_mechanics::PushResult::Success => {
                    // Stone was pushed, continue with move
                }
                stone_mechanics::PushResult::Blocked(_) | stone_mechanics::PushResult::VerticalPushAttempt => {
                    // Stone push failed, reject the move
                    self.input_locked = false;
                    return false;
                }
            }
        }

        // Check if snake eats any type of food
        let food_eaten = self.check_and_eat_food(new_head);

        // Add new head to front of segments
        self.level_state.snake.segments.insert(0, new_head);

        if !food_eaten {
            // Remove tail if no food was eaten
            self.level_state.snake.segments.pop();
        }

        // Check for collision immediately after move (spikes have highest priority)
        if self.check_collision(self.level_state.snake.segments[0]) {
            self.game_state.status = GameStatus::GameOver;
        } else {
            // Apply gravity to snake
            let hit_spike = gravity::apply_gravity_to_snake(&mut self.level_state);
            if hit_spike {
                self.game_state.status = GameStatus::GameOver;
            } else {
                // Apply gravity to stones
                gravity::apply_gravity_to_stones(&mut self.level_state);

                // Apply gravity to falling food
                gravity::apply_gravity_to_falling_food(&mut self.level_state);

                // Check if reached exit (only if not game over and collected required food)
                if self.game_state.status == GameStatus::Playing {
                    let head = self.level_state.snake.segments[0];
                    if self.check_exit(head)
                        && self.game_state.food_collected >= self.game_state.total_food
                    {
                        self.game_state.status = GameStatus::LevelComplete;
                    }
                }
            }
        }

        // Update move counter
        self.game_state.moves += 1;

        // Unlock input
        self.input_locked = false;

        true
    }

    /// Generates a Frame representing the current game state
    #[must_use]
    pub fn generate_frame(&self) -> Frame {
        let width = self.level_state.grid_size.width as usize;
        let height = self.level_state.grid_size.height as usize;

        // Initialize empty grid
        let mut grid = vec![vec![CellType::Empty; width]; height];

        // Place obstacles
        for obstacle in &self.level_state.obstacles {
            if self.is_within_bounds(*obstacle) {
                grid[obstacle.y as usize][obstacle.x as usize] = CellType::Obstacle;
            }
        }

        // Place spikes
        for spike in &self.level_state.spikes {
            if self.is_within_bounds(*spike) {
                grid[spike.y as usize][spike.x as usize] = CellType::Spike;
            }
        }

        // Place stones
        for stone in &self.level_state.stones {
            if self.is_within_bounds(*stone) {
                grid[stone.y as usize][stone.x as usize] = CellType::Stone;
            }
        }

        // Place regular food
        for food in &self.level_state.food {
            if self.is_within_bounds(*food) {
                grid[food.y as usize][food.x as usize] = CellType::Food;
            }
        }

        // Place floating food
        for food in &self.level_state.floating_food {
            if self.is_within_bounds(*food) {
                grid[food.y as usize][food.x as usize] = CellType::FloatingFood;
            }
        }

        // Place falling food
        for food in &self.level_state.falling_food {
            if self.is_within_bounds(*food) {
                grid[food.y as usize][food.x as usize] = CellType::FallingFood;
            }
        }

        // Place exit
        if self.is_within_bounds(self.level_state.exit) {
            grid[self.level_state.exit.y as usize][self.level_state.exit.x as usize] =
                CellType::Exit;
        }

        // Place snake (head first, then body)
        if let Some(head) = self.level_state.snake.segments.first() {
            if self.is_within_bounds(*head) {
                grid[head.y as usize][head.x as usize] = CellType::SnakeHead;
            }
        }

        for segment in self.level_state.snake.segments.iter().skip(1) {
            if self.is_within_bounds(*segment) {
                grid[segment.y as usize][segment.x as usize] = CellType::SnakeBody;
            }
        }

        Frame::new(grid, self.game_state.clone())
    }

    /// Check and eat any type of food at the given position
    /// Returns true if food was eaten
    fn check_and_eat_food(&mut self, pos: Position) -> bool {
        // Check regular food
        if let Some(idx) = self.get_food_index(pos) {
            self.level_state.food.remove(idx);
            self.game_state.food_collected += 1;
            return true;
        }

        // Check floating food
        if let Some(idx) = self
            .level_state
            .floating_food
            .iter()
            .position(|f| f.x == pos.x && f.y == pos.y)
        {
            self.level_state.floating_food.remove(idx);
            self.game_state.food_collected += 1;
            return true;
        }

        // Check falling food
        if let Some(idx) = self
            .level_state
            .falling_food
            .iter()
            .position(|f| f.x == pos.x && f.y == pos.y)
        {
            self.level_state.falling_food.remove(idx);
            self.game_state.food_collected += 1;
            return true;
        }

        false
    }

    /// Checks if a position has a collision (out of bounds, spike, obstacle, or self)
    fn check_collision(&self, head: Position) -> bool {
        // Check spikes first (highest priority)
        if self.is_spike(head) {
            return true;
        }

        // Check out of bounds
        if !self.is_within_bounds(head) {
            return true;
        }

        // Check obstacles
        if self.is_obstacle(head) {
            return true;
        }

        // Check self collision (skip first segment which is the head)
        for segment in self.level_state.snake.segments.iter().skip(1) {
            if segment.x == head.x && segment.y == head.y {
                return true;
            }
        }

        false
    }

    /// Checks if a position is within the grid bounds
    fn is_within_bounds(&self, pos: Position) -> bool {
        pos.x >= 0
            && pos.x < self.level_state.grid_size.width
            && pos.y >= 0
            && pos.y < self.level_state.grid_size.height
    }

    /// Checks if a position contains an obstacle
    fn is_obstacle(&self, pos: Position) -> bool {
        self.level_state
            .obstacles
            .iter()
            .any(|o| o.x == pos.x && o.y == pos.y)
    }

    /// Checks if a position contains food
    fn is_food(&self, pos: Position) -> bool {
        self.level_state
            .food
            .iter()
            .any(|f| f.x == pos.x && f.y == pos.y)
    }

    /// Checks if a position contains a stone
    fn is_stone(&self, pos: Position) -> bool {
        self.level_state
            .stones
            .iter()
            .any(|s| s.x == pos.x && s.y == pos.y)
    }

    /// Checks if a position contains a spike
    fn is_spike(&self, pos: Position) -> bool {
        self.level_state
            .spikes
            .iter()
            .any(|s| s.x == pos.x && s.y == pos.y)
    }

    /// Checks if the head has reached the exit
    fn check_exit(&self, head: Position) -> bool {
        head.x == self.level_state.exit.x && head.y == self.level_state.exit.y
    }

    /// Gets the index of food at the given position, if any
    fn get_food_index(&self, pos: Position) -> Option<usize> {
        self.level_state
            .food
            .iter()
            .position(|f| f.x == pos.x && f.y == pos.y)
    }

    /// Calculates the new head position based on direction
    fn get_new_head_position(head: Position, direction: Direction) -> Position {
        match direction {
            Direction::North => Position::new(head.x, head.y - 1),
            Direction::South => Position::new(head.x, head.y + 1),
            Direction::East => Position::new(head.x + 1, head.y),
            Direction::West => Position::new(head.x - 1, head.y),
        }
    }

    /// Checks if two directions are opposite
    fn is_opposite_direction(new_dir: Direction, current_dir: Direction) -> bool {
        matches!(
            (new_dir, current_dir),
            (Direction::North, Direction::South)
                | (Direction::South, Direction::North)
                | (Direction::East, Direction::West)
                | (Direction::West, Direction::East)
        )
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::GridSize;

    fn create_test_level() -> LevelDefinition {
        LevelDefinition::new(
            1,
            "Test Level".to_string(),
            GridSize::new(10, 10),
            vec![Position::new(5, 5)],
            vec![Position::new(3, 3), Position::new(7, 7)],
            vec![Position::new(5, 3)],
            Position::new(9, 9),
            Direction::East,
        )
    }

    #[test]
    fn test_engine_creation() {
        let level = create_test_level();
        let engine = GameEngine::new(level);

        assert_eq!(engine.game_state().status, GameStatus::Playing);
        assert_eq!(engine.game_state().moves, 0);
        assert_eq!(engine.game_state().food_collected, 0);
        assert_eq!(engine.game_state().total_food, 1);
    }

    #[test]
    fn test_basic_movement() {
        let mut level = create_test_level();
        // Place snake on a platform (obstacle below it)
        level.snake = vec![Position::new(5, 5)];
        level.obstacles = vec![Position::new(5, 6)]; // Platform below

        let mut engine = GameEngine::new(level);

        // Move north - snake will move to (5,4) then fall back to (5,5) due to gravity
        let result = engine.process_move(Direction::North);
        assert!(result);
        // After moving north and applying gravity, snake falls back to platform
        assert_eq!(
            engine.level_state().snake.segments[0],
            Position::new(5, 5)
        );
        assert_eq!(engine.game_state().moves, 1);
    }

    #[test]
    fn test_opposite_direction_blocked() {
        let mut level = create_test_level();
        level.snake = vec![Position::new(5, 5), Position::new(5, 6)];
        level.snake_direction = Direction::North;

        let mut engine = GameEngine::new(level);

        // Try to move south (opposite of north)
        let result = engine.process_move(Direction::South);
        assert!(!result);
        assert_eq!(engine.game_state().moves, 0);
    }

    #[test]
    fn test_food_collection() {
        let mut level = create_test_level();
        level.snake = vec![Position::new(5, 4)];
        level.food = vec![Position::new(5, 3)];

        let mut engine = GameEngine::new(level);

        // Move north to collect food
        engine.process_move(Direction::North);

        assert_eq!(engine.game_state().food_collected, 1);
        assert_eq!(engine.level_state().food.len(), 0);
        assert_eq!(engine.level_state().snake.segments.len(), 2); // Snake grew
    }

    #[test]
    fn test_wall_collision() {
        let mut level = create_test_level();
        level.snake = vec![Position::new(0, 5)];
        level.snake_direction = Direction::North;

        let mut engine = GameEngine::new(level);

        // Move west into wall
        engine.process_move(Direction::West);

        assert_eq!(engine.game_state().status, GameStatus::GameOver);
    }

    #[test]
    fn test_obstacle_collision() {
        let mut level = create_test_level();
        level.snake = vec![Position::new(3, 4)];
        level.obstacles = vec![Position::new(3, 3)];

        let mut engine = GameEngine::new(level);

        // Move north into obstacle
        engine.process_move(Direction::North);

        assert_eq!(engine.game_state().status, GameStatus::GameOver);
    }

    #[test]
    fn test_self_collision() {
        let mut level = create_test_level();
        // Create a snake where the head can move into the body (not tail)
        level.snake = vec![
            Position::new(5, 5),
            Position::new(5, 6),
            Position::new(6, 6),
            Position::new(6, 5),
            Position::new(6, 4),
        ];
        level.snake_direction = Direction::East;
        // Add platform below to prevent falling through
        level.obstacles = vec![Position::new(5, 7), Position::new(6, 7)];

        let mut engine = GameEngine::new(level);

        // Move south into own body at (5, 6)
        engine.process_move(Direction::South);

        assert_eq!(engine.game_state().status, GameStatus::GameOver);
    }

    #[test]
    fn test_gravity_fall() {
        let mut level = create_test_level();
        level.snake = vec![Position::new(5, 2)];
        level.obstacles = vec![Position::new(6, 5)]; // Floor at y=5 in column 6

        let mut engine = GameEngine::new(level);

        // Move east (should trigger gravity)
        engine.process_move(Direction::East);

        // Snake should fall to y=4 (one above obstacle at (6, 5))
        assert_eq!(
            engine.level_state().snake.segments[0],
            Position::new(6, 4)
        );
    }

    #[test]
    fn test_food_as_platform() {
        let mut level = create_test_level();
        level.snake = vec![Position::new(5, 2)];
        level.food = vec![Position::new(6, 3)]; // Food at (6, 3)

        let mut engine = GameEngine::new(level);

        // Move east (should trigger gravity but stop at food)
        engine.process_move(Direction::East);

        // Snake should stop at y=2 (food at (6, 3) acts as platform below)
        assert_eq!(
            engine.level_state().snake.segments[0],
            Position::new(6, 2)
        );
    }

    #[test]
    fn test_level_completion() {
        let mut level = create_test_level();
        level.snake = vec![Position::new(9, 8)];
        level.food = vec![];
        level.exit = Position::new(9, 9);

        let mut engine = GameEngine::new(level);
        engine.game_state.food_collected = engine.game_state.total_food;

        // Move south to exit
        engine.process_move(Direction::South);

        assert_eq!(engine.game_state().status, GameStatus::LevelComplete);
    }

    #[test]
    fn test_exit_blocked_without_all_food() {
        let mut level = create_test_level();
        level.snake = vec![Position::new(9, 8)];
        level.food = vec![Position::new(5, 5)]; // Food still remaining
        level.exit = Position::new(9, 9);

        let mut engine = GameEngine::new(level);

        // Move south to exit (but haven't collected all food)
        engine.process_move(Direction::South);

        // Should still be playing (exit doesn't trigger completion)
        assert_eq!(engine.game_state().status, GameStatus::Playing);
    }

    #[test]
    fn test_frame_generation() {
        let mut level = create_test_level();
        level.grid_size = GridSize::new(5, 5);
        level.snake = vec![Position::new(2, 2), Position::new(2, 3)];
        level.obstacles = vec![Position::new(1, 1)];
        level.food = vec![Position::new(3, 3)];
        level.exit = Position::new(4, 4);

        let engine = GameEngine::new(level);
        let frame = engine.generate_frame();

        assert_eq!(frame.grid.len(), 5);
        assert_eq!(frame.grid[0].len(), 5);
        assert_eq!(frame.grid[2][2], CellType::SnakeHead);
        assert_eq!(frame.grid[3][2], CellType::SnakeBody);
        assert_eq!(frame.grid[1][1], CellType::Obstacle);
        assert_eq!(frame.grid[3][3], CellType::Food);
        assert_eq!(frame.grid[4][4], CellType::Exit);
    }
}
