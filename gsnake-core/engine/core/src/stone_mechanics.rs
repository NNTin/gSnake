use crate::{Direction, LevelState, Position};

/// Result of attempting to push a stone
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum PushResult {
    /// Push was successful
    Success,
    /// Push was blocked (stone can't move)
    Blocked(Position),
    /// Vertical push was attempted (not allowed)
    VerticalPushAttempt,
}

/// Try to push a stone at the given position in the given direction
pub fn try_push_stone(
    stone_pos: Position,
    direction: Direction,
    level_state: &mut LevelState,
) -> PushResult {
    // Vertical pushes are not allowed
    if matches!(direction, Direction::North | Direction::South) {
        return PushResult::VerticalPushAttempt;
    }

    // Find all stones in a horizontal row in the push direction
    let stone_row = find_stone_row(stone_pos, direction, &level_state.stones);

    // Check if the stones can be pushed
    if can_push_stones(&stone_row, direction, level_state) {
        // Execute the push
        execute_stone_push(&stone_row, direction, level_state);
        PushResult::Success
    } else {
        PushResult::Blocked(stone_pos)
    }
}

/// Find all connected stones in a horizontal row in the given direction
fn find_stone_row(start: Position, direction: Direction, stones: &[Position]) -> Vec<Position> {
    debug_assert!(
        matches!(direction, Direction::East | Direction::West),
        "find_stone_row only supports horizontal directions"
    );

    let mut row = vec![start];
    let mut current = start;

    loop {
        let next_pos = get_next_position(current, direction);
        if is_stone_at(next_pos, stones) {
            row.push(next_pos);
            current = next_pos;
        } else {
            break;
        }
    }

    row
}

/// Check if all stones in the row can be pushed
fn can_push_stones(stones: &[Position], direction: Direction, level_state: &LevelState) -> bool {
    if stones.is_empty() {
        return false;
    }

    // Get the last stone in the row (the one being pushed into empty space)
    let last_stone = stones[stones.len() - 1];
    let target_pos = get_next_position(last_stone, direction);

    // Check if the target position is available or is a spike (stones can be pushed onto spikes)
    is_space_available(target_pos, level_state) || is_spike_at(target_pos, &level_state.spikes)
}

/// Execute the stone push (move all stones in the row)
fn execute_stone_push(stones: &[Position], direction: Direction, level_state: &mut LevelState) {
    // Move stones from last to first to avoid overwrites
    for stone in stones.iter().rev() {
        let new_pos = get_next_position(*stone, direction);

        // Check if pushing onto a spike (stone gets destroyed)
        if is_spike_at(new_pos, &level_state.spikes) {
            // Remove the stone from the level state
            level_state.stones.retain(|s| s != stone);
        } else {
            // Move the stone
            if let Some(idx) = level_state.stones.iter().position(|s| s == stone) {
                level_state.stones[idx] = new_pos;
            }
        }
    }
}

/// Get the next position in the given direction
fn get_next_position(pos: Position, direction: Direction) -> Position {
    match direction {
        Direction::North => Position::new(pos.x, pos.y - 1),
        Direction::South => Position::new(pos.x, pos.y + 1),
        Direction::East => Position::new(pos.x + 1, pos.y),
        Direction::West => Position::new(pos.x - 1, pos.y),
    }
}

/// Check if there's a stone at the given position
fn is_stone_at(pos: Position, stones: &[Position]) -> bool {
    stones.contains(&pos)
}

/// Check if there's a spike at the given position
fn is_spike_at(pos: Position, spikes: &[Position]) -> bool {
    spikes.contains(&pos)
}

/// Check if a position is available (empty and within bounds)
fn is_space_available(pos: Position, level_state: &LevelState) -> bool {
    // Check bounds
    if pos.x < 0
        || pos.x >= level_state.grid_size.width
        || pos.y < 0
        || pos.y >= level_state.grid_size.height
    {
        return false;
    }

    // Check for obstacles
    if level_state.obstacles.contains(&pos) {
        return false;
    }

    // Check for other stones
    if is_stone_at(pos, &level_state.stones) {
        return false;
    }

    // Check for food items
    if level_state.food.contains(&pos)
        || level_state.floating_food.contains(&pos)
        || level_state.falling_food.contains(&pos)
    {
        return false;
    }

    // Exit tile is always blocked for horizontal stone pushes
    if level_state.exit == pos {
        return false;
    }

    // Check for snake segments
    if level_state.snake.segments.contains(&pos) {
        return false;
    }

    true
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::{GridSize, Snake};

    fn create_test_level_state() -> LevelState {
        LevelState {
            grid_size: GridSize::new(10, 10),
            snake: Snake::new(vec![Position::new(2, 5)]),
            obstacles: vec![Position::new(5, 5)],
            food: vec![],
            exit: Position::new(9, 9),
            floating_food: vec![],
            falling_food: vec![],
            stones: vec![Position::new(3, 5)],
            spikes: vec![],
            exit_is_solid: true,
        }
    }

    #[test]
    fn test_single_stone_push_success() {
        let mut state = create_test_level_state();
        let result = try_push_stone(Position::new(3, 5), Direction::East, &mut state);

        assert_eq!(result, PushResult::Success);
        assert!(state.stones.contains(&Position::new(4, 5)));
        assert!(!state.stones.contains(&Position::new(3, 5)));
    }

    #[test]
    fn test_stone_push_blocked_by_wall() {
        let mut state = create_test_level_state();
        state.stones = vec![Position::new(9, 5)];

        let result = try_push_stone(Position::new(9, 5), Direction::East, &mut state);

        assert_eq!(result, PushResult::Blocked(Position::new(9, 5)));
        assert!(state.stones.contains(&Position::new(9, 5)));
    }

    #[test]
    fn test_stone_push_blocked_by_obstacle() {
        let mut state = create_test_level_state();
        state.stones = vec![Position::new(4, 5)];
        state.obstacles = vec![Position::new(5, 5)];

        let result = try_push_stone(Position::new(4, 5), Direction::East, &mut state);

        assert_eq!(result, PushResult::Blocked(Position::new(4, 5)));
        assert!(state.stones.contains(&Position::new(4, 5)));
    }

    #[test]
    fn test_vertical_push_rejected() {
        let mut state = create_test_level_state();
        let result = try_push_stone(Position::new(3, 5), Direction::North, &mut state);

        assert_eq!(result, PushResult::VerticalPushAttempt);
        assert!(state.stones.contains(&Position::new(3, 5)));
    }

    #[test]
    fn test_multiple_stone_push() {
        let mut state = create_test_level_state();
        state.stones = vec![
            Position::new(3, 5),
            Position::new(4, 5),
            Position::new(5, 5),
        ];

        let result = try_push_stone(Position::new(3, 5), Direction::East, &mut state);

        assert_eq!(result, PushResult::Success);
        assert!(state.stones.contains(&Position::new(4, 5)));
        assert!(state.stones.contains(&Position::new(5, 5)));
        assert!(state.stones.contains(&Position::new(6, 5)));
        assert!(!state.stones.contains(&Position::new(3, 5)));
    }

    #[test]
    fn test_stone_destroyed_on_spike() {
        let mut state = create_test_level_state();
        state.stones = vec![Position::new(3, 5)];
        state.spikes = vec![Position::new(4, 5)];

        let result = try_push_stone(Position::new(3, 5), Direction::East, &mut state);

        assert_eq!(result, PushResult::Success);
        assert!(state.stones.is_empty()); // Stone was destroyed
    }

    #[test]
    fn test_stone_push_blocked_by_food() {
        let mut state = create_test_level_state();
        state.stones = vec![Position::new(3, 5)];
        state.food = vec![Position::new(4, 5)];

        let result = try_push_stone(Position::new(3, 5), Direction::East, &mut state);

        assert_eq!(result, PushResult::Blocked(Position::new(3, 5)));
        assert_eq!(state.stones, vec![Position::new(3, 5)]);
        assert_eq!(state.food, vec![Position::new(4, 5)]);
    }

    #[test]
    fn test_stone_push_blocked_by_floating_food() {
        let mut state = create_test_level_state();
        state.stones = vec![Position::new(3, 5)];
        state.floating_food = vec![Position::new(4, 5)];

        let result = try_push_stone(Position::new(3, 5), Direction::East, &mut state);

        assert_eq!(result, PushResult::Blocked(Position::new(3, 5)));
        assert_eq!(state.stones, vec![Position::new(3, 5)]);
        assert_eq!(state.floating_food, vec![Position::new(4, 5)]);
    }

    #[test]
    fn test_stone_push_blocked_by_falling_food() {
        let mut state = create_test_level_state();
        state.stones = vec![Position::new(3, 5)];
        state.falling_food = vec![Position::new(4, 5)];

        let result = try_push_stone(Position::new(3, 5), Direction::East, &mut state);

        assert_eq!(result, PushResult::Blocked(Position::new(3, 5)));
        assert_eq!(state.stones, vec![Position::new(3, 5)]);
        assert_eq!(state.falling_food, vec![Position::new(4, 5)]);
    }

    #[test]
    fn test_stone_push_blocked_by_exit_even_when_exit_not_solid() {
        let mut state = create_test_level_state();
        state.stones = vec![Position::new(3, 5)];
        state.exit = Position::new(4, 5);
        state.exit_is_solid = false;

        let result = try_push_stone(Position::new(3, 5), Direction::East, &mut state);

        assert_eq!(result, PushResult::Blocked(Position::new(3, 5)));
        assert_eq!(state.stones, vec![Position::new(3, 5)]);
        assert_eq!(state.exit, Position::new(4, 5));
    }

    #[test]
    #[should_panic(expected = "find_stone_row only supports horizontal directions")]
    fn test_find_stone_row_rejects_vertical_direction() {
        let stones = vec![Position::new(3, 5), Position::new(3, 4)];
        let _ = find_stone_row(Position::new(3, 5), Direction::North, &stones);
    }

    #[test]
    fn test_south_push_rejected() {
        let mut state = create_test_level_state();
        let result = try_push_stone(Position::new(3, 5), Direction::South, &mut state);

        assert_eq!(result, PushResult::VerticalPushAttempt);
        assert!(state.stones.contains(&Position::new(3, 5)));
    }

    #[test]
    fn test_push_west_single_stone() {
        let mut state = create_test_level_state();
        state.stones = vec![Position::new(5, 3)];
        state.obstacles = vec![];

        let result = try_push_stone(Position::new(5, 3), Direction::West, &mut state);

        assert_eq!(result, PushResult::Success);
        assert!(state.stones.contains(&Position::new(4, 3)));
        assert!(!state.stones.contains(&Position::new(5, 3)));
    }

    #[test]
    fn test_push_west_multiple_stones() {
        let mut state = create_test_level_state();
        state.stones = vec![
            Position::new(5, 3),
            Position::new(4, 3),
            Position::new(3, 3),
        ];
        state.obstacles = vec![];

        let result = try_push_stone(Position::new(5, 3), Direction::West, &mut state);

        assert_eq!(result, PushResult::Success);
        assert!(state.stones.contains(&Position::new(4, 3)));
        assert!(state.stones.contains(&Position::new(3, 3)));
        assert!(state.stones.contains(&Position::new(2, 3)));
        assert!(!state.stones.contains(&Position::new(5, 3)));
    }

    #[test]
    fn test_push_west_blocked_by_wall() {
        let mut state = create_test_level_state();
        state.stones = vec![Position::new(0, 5)];

        // Target would be x=-1, which is out of bounds
        let result = try_push_stone(Position::new(0, 5), Direction::West, &mut state);

        assert_eq!(result, PushResult::Blocked(Position::new(0, 5)));
        assert!(state.stones.contains(&Position::new(0, 5)));
    }

    #[test]
    fn test_stone_push_blocked_by_snake_segment() {
        let mut state = create_test_level_state();
        state.stones = vec![Position::new(3, 5)];
        // Place a snake body segment at the target position (4, 5)
        state.snake = Snake::new(vec![Position::new(1, 5), Position::new(4, 5)]);

        let result = try_push_stone(Position::new(3, 5), Direction::East, &mut state);

        assert_eq!(result, PushResult::Blocked(Position::new(3, 5)));
        assert!(state.stones.contains(&Position::new(3, 5)));
    }
}
