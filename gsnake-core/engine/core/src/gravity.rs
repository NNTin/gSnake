use crate::{LevelState, Position};

/// Hard recursion cap for falling-food support checks.
/// This comfortably exceeds real level dimensions while preventing unbounded
/// recursive descent on malformed/generated states.
const MAX_SETTLED_FALLING_FOOD_DEPTH: usize = 1024;

/// Apply gravity to the snake
/// Returns true if any snake segment touched a spike
pub fn apply_gravity_to_snake(level_state: &mut LevelState) -> bool {
    if snake_touches_spike(level_state) {
        return true;
    }

    while can_snake_fall(level_state) {
        // Move all segments down by 1
        for segment in &mut level_state.snake.segments {
            segment.y += 1;
        }

        // Check if snake hit a spike
        if snake_touches_spike(level_state) {
            return true;
        }
    }
    false
}

/// Apply gravity to all stones
pub fn apply_gravity_to_stones(level_state: &mut LevelState) {
    // Ordering invariant:
    // Stones must be updated incrementally in a fixed-point loop (instead of a batched
    // "next frame" update). This preserves collision/platform semantics for stacked stones
    // and avoids one-cell drift when support stones move first.
    // Regression coverage:
    // - tests::test_snake_stops_on_stone
    // - tests::test_stone_stops_on_spike
    // - engine/core/tests/contract_tests.rs::stone_push_matrix_horizontal_push_into_vertical_stack_moves_only_same_row_stone
    // Keep applying gravity until no stones can fall
    loop {
        let mut any_moved = false;

        // Process each stone
        for i in 0..level_state.stones.len() {
            let stone = level_state.stones[i];
            if can_object_fall(stone, level_state, ObjectType::Stone) {
                level_state.stones[i].y += 1;
                any_moved = true;
            }
        }

        if !any_moved {
            break;
        }
    }
}

/// Apply gravity to all falling food
pub fn apply_gravity_to_falling_food(level_state: &mut LevelState) {
    // Keep applying gravity until no falling food can fall
    loop {
        let mut any_moved = false;

        // Process each falling food
        for i in 0..level_state.falling_food.len() {
            let food = level_state.falling_food[i];
            if can_object_fall(food, level_state, ObjectType::FallingFood) {
                level_state.falling_food[i].y += 1;
                any_moved = true;
            }
        }

        if !any_moved {
            break;
        }
    }
}

/// Check if the snake can fall further.
///
/// Design contract:
/// - Food is consumed only by `GameEngine::check_and_eat_food` after deliberate
///   input-driven movement in `GameEngine::process_move`.
/// - Gravity does not consume food; food tiles (regular, floating, settled falling)
///   are support platforms that stop downward movement.
/// - With multi-segment snakes, a body segment can settle beside food after a fall.
///   That food is intentionally not consumed until a later deliberate move places
///   the head on that tile.
fn can_snake_fall(level_state: &LevelState) -> bool {
    for segment in &level_state.snake.segments {
        let next_y = segment.y + 1;

        // Check floor boundary
        if next_y >= level_state.grid_size.height {
            return false;
        }

        let next_pos = Position::new(segment.x, next_y);

        // Check obstacles
        if is_obstacle(next_pos, level_state) {
            return false;
        }

        // Food is support only during gravity resolution; this path never consumes it.
        if is_food(next_pos, level_state)
            || is_floating_food(next_pos, level_state)
            || is_settled_falling_food(next_pos, level_state, 0)
        {
            return false;
        }

        // Check stones (act as platform)
        if is_stone(next_pos, level_state) {
            return false;
        }

        // Spikes do NOT act as platform for snake (snake falls through and dies)
        // Exit acts as platform only if solid
        if level_state.exit_is_solid && is_exit(next_pos, level_state) {
            return false;
        }
    }

    true
}

/// Check if an object can fall further
fn can_object_fall(pos: Position, level_state: &LevelState, object_type: ObjectType) -> bool {
    let next_y = pos.y + 1;

    // Check floor boundary
    if next_y >= level_state.grid_size.height {
        return false;
    }

    let next_pos = Position::new(pos.x, next_y);

    // Check obstacles (act as platform for all objects)
    if is_obstacle(next_pos, level_state) {
        return false;
    }

    // Check for solid objects below based on object type
    match object_type {
        ObjectType::Stone | ObjectType::FallingFood => {
            // Stones and falling food stop on:
            // - Other stones
            // - Floating food
            // - Settled falling food
            // - Regular food
            // - Snake segments
            // - Spikes (spikes act as floor for objects, but not for snake)
            // - Solid exit
            if is_stone(next_pos, level_state)
                || is_floating_food(next_pos, level_state)
                || is_settled_falling_food(next_pos, level_state, 0)
                || is_food(next_pos, level_state)
                || is_snake_segment(next_pos, level_state)
                || is_spike(next_pos, level_state)
                || (level_state.exit_is_solid && is_exit(next_pos, level_state))
            {
                return false;
            }
        },
    }

    true
}

/// Check if a falling food is settled (has solid support below)
fn is_settled_falling_food(pos: Position, level_state: &LevelState, depth: usize) -> bool {
    if depth >= MAX_SETTLED_FALLING_FOOD_DEPTH {
        // Fail closed on pathological depth: treat as settled so malformed levels
        // cannot trigger unbounded recursion/stack growth.
        return true;
    }

    // Check if this position contains falling food
    if !level_state.falling_food.contains(&pos) {
        return false;
    }

    // Check if there's solid support directly below
    let below = Position::new(pos.x, pos.y + 1);

    // Falling food is settled if it has any solid object below
    is_obstacle(below, level_state)
        || is_stone(below, level_state)
        || is_floating_food(below, level_state)
        || is_settled_falling_food(below, level_state, depth + 1)
        || is_food(below, level_state)
        || is_snake_segment(below, level_state)
        || is_spike(below, level_state)
        || (level_state.exit_is_solid && is_exit(below, level_state))
        || below.y >= level_state.grid_size.height
}

/// Object types for gravity calculation
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum ObjectType {
    Stone,
    FallingFood,
}

// Helper functions to check object positions

fn is_obstacle(pos: Position, level_state: &LevelState) -> bool {
    level_state.obstacles.contains(&pos)
}

fn is_food(pos: Position, level_state: &LevelState) -> bool {
    level_state.food.contains(&pos)
}

fn is_floating_food(pos: Position, level_state: &LevelState) -> bool {
    level_state.floating_food.contains(&pos)
}

fn is_stone(pos: Position, level_state: &LevelState) -> bool {
    level_state.stones.contains(&pos)
}

fn is_spike(pos: Position, level_state: &LevelState) -> bool {
    level_state.spikes.contains(&pos)
}

fn is_snake_segment(pos: Position, level_state: &LevelState) -> bool {
    level_state.snake.segments.contains(&pos)
}

fn is_exit(pos: Position, level_state: &LevelState) -> bool {
    level_state.exit == pos
}

fn snake_touches_spike(level_state: &LevelState) -> bool {
    level_state
        .snake
        .segments
        .iter()
        .any(|segment| is_spike(*segment, level_state))
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::{Direction, GridSize, Snake};

    fn create_test_level_state() -> LevelState {
        LevelState {
            grid_size: GridSize::new(10, 10),
            snake: Snake::new(vec![Position::new(5, 2)]),
            obstacles: vec![],
            food: vec![],
            exit: Position::new(9, 9),
            floating_food: vec![],
            falling_food: vec![],
            stones: vec![],
            spikes: vec![],
            exit_is_solid: true,
        }
    }

    #[test]
    fn test_snake_falls_to_floor() {
        let mut state = create_test_level_state();
        state.snake.direction = Some(Direction::East);

        apply_gravity_to_snake(&mut state);

        assert_eq!(state.snake.segments[0].y, 9); // Floor is at y=9
    }

    #[test]
    fn test_snake_already_on_spike_returns_immediately() {
        let mut state = create_test_level_state();
        state.spikes = vec![Position::new(5, 2)];
        state.snake.direction = Some(Direction::East);

        let hit_spike = apply_gravity_to_snake(&mut state);

        assert!(hit_spike);
        assert_eq!(state.snake.segments[0], Position::new(5, 2));
    }

    #[test]
    fn test_snake_stops_on_obstacle() {
        let mut state = create_test_level_state();
        state.obstacles = vec![Position::new(5, 5)];
        state.snake.direction = Some(Direction::East);

        apply_gravity_to_snake(&mut state);

        assert_eq!(state.snake.segments[0].y, 4); // Stops above obstacle
    }

    #[test]
    fn test_snake_stops_on_stone() {
        let mut state = create_test_level_state();
        state.stones = vec![Position::new(5, 5)];
        state.snake.direction = Some(Direction::East);

        apply_gravity_to_snake(&mut state);

        assert_eq!(state.snake.segments[0].y, 4); // Stops above stone
    }

    #[test]
    fn test_snake_stops_on_solid_exit() {
        let mut state = create_test_level_state();
        state.exit = Position::new(5, 5);
        state.exit_is_solid = true;
        state.snake.direction = Some(Direction::East);

        apply_gravity_to_snake(&mut state);

        assert_eq!(state.snake.segments[0].y, 4); // Solid exit acts as platform
    }

    #[test]
    fn test_snake_stops_on_floating_food() {
        let mut state = create_test_level_state();
        state.floating_food = vec![Position::new(5, 5)];
        state.snake.direction = Some(Direction::East);

        apply_gravity_to_snake(&mut state);

        assert_eq!(state.snake.segments[0].y, 4); // Stops above floating food
    }

    #[test]
    fn test_stone_falls() {
        let mut state = create_test_level_state();
        state.stones = vec![Position::new(3, 2)];

        apply_gravity_to_stones(&mut state);

        assert_eq!(state.stones[0].y, 9); // Falls to floor
    }

    #[test]
    fn test_stone_stops_on_obstacle() {
        let mut state = create_test_level_state();
        state.stones = vec![Position::new(3, 2)];
        state.obstacles = vec![Position::new(3, 5)];

        apply_gravity_to_stones(&mut state);

        assert_eq!(state.stones[0].y, 4); // Stops above obstacle
    }

    #[test]
    fn test_falling_food_falls() {
        let mut state = create_test_level_state();
        state.falling_food = vec![Position::new(4, 2)];

        apply_gravity_to_falling_food(&mut state);

        assert_eq!(state.falling_food[0].y, 9); // Falls to floor
    }

    #[test]
    fn test_falling_food_stops_on_snake() {
        let mut state = create_test_level_state();
        state.falling_food = vec![Position::new(5, 0)];
        state.snake = Snake::new(vec![Position::new(5, 2)]);

        apply_gravity_to_falling_food(&mut state);

        assert_eq!(state.falling_food[0].y, 1); // Stops above snake
    }

    #[test]
    fn test_snake_dies_on_spike() {
        let mut state = create_test_level_state();
        state.spikes = vec![Position::new(5, 5)];
        state.snake.direction = Some(Direction::East);

        let hit_spike = apply_gravity_to_snake(&mut state);

        assert!(hit_spike);
        assert_eq!(state.snake.segments[0].y, 5); // Snake is on spike
    }

    #[test]
    fn test_snake_dies_when_body_hits_spike() {
        let mut state = create_test_level_state();
        state.snake = Snake::new(vec![Position::new(5, 2), Position::new(5, 3)]);
        state.spikes = vec![Position::new(5, 4)];
        state.snake.direction = Some(Direction::East);

        let hit_spike = apply_gravity_to_snake(&mut state);

        assert!(hit_spike);
        assert_eq!(state.snake.segments[0], Position::new(5, 3));
        assert_eq!(state.snake.segments[1], Position::new(5, 4));
    }

    #[test]
    fn test_stone_stops_on_spike() {
        let mut state = create_test_level_state();
        state.stones = vec![Position::new(3, 2)];
        state.spikes = vec![Position::new(3, 5)];

        apply_gravity_to_stones(&mut state);

        assert_eq!(state.stones[0].y, 4); // Stops above spike
    }

    #[test]
    fn test_settled_falling_food_detection() {
        let mut state = create_test_level_state();
        state.falling_food = vec![Position::new(4, 4)];
        state.obstacles = vec![Position::new(4, 5)];

        assert!(is_settled_falling_food(Position::new(4, 4), &state, 0));
    }

    #[test]
    fn test_unsettled_falling_food_detection() {
        let mut state = create_test_level_state();
        state.falling_food = vec![Position::new(4, 4)];
        // No obstacle below

        assert!(!is_settled_falling_food(Position::new(4, 4), &state, 0));
    }

    // ── can_snake_fall: non-solid exit ────────────────────────────────────────

    #[test]
    fn test_snake_falls_through_non_solid_exit() {
        let mut state = create_test_level_state();
        state.exit = Position::new(5, 5);
        state.exit_is_solid = false;
        state.snake.direction = Some(Direction::East);

        apply_gravity_to_snake(&mut state);

        // Non-solid exit is not a platform; snake falls past it to the floor
        assert_eq!(state.snake.segments[0].y, 9);
    }

    // ── can_object_fall: stone stops on various platforms ─────────────────────

    #[test]
    fn test_stone_stops_on_another_stone() {
        let mut state = create_test_level_state();
        // Two stacked stones; bottom one hits the obstacle floor
        state.stones = vec![Position::new(3, 2), Position::new(3, 4)];
        state.obstacles = vec![Position::new(3, 5)];

        apply_gravity_to_stones(&mut state);

        // Bottom stone stops above obstacle; top stone stops above bottom
        assert!(state.stones.contains(&Position::new(3, 4)));
        assert!(state.stones.contains(&Position::new(3, 3)));
    }

    #[test]
    fn test_stone_stops_on_floating_food() {
        let mut state = create_test_level_state();
        state.stones = vec![Position::new(3, 2)];
        state.floating_food = vec![Position::new(3, 5)];

        apply_gravity_to_stones(&mut state);

        assert_eq!(state.stones[0].y, 4);
    }

    #[test]
    fn test_stone_stops_on_settled_falling_food() {
        let mut state = create_test_level_state();
        state.stones = vec![Position::new(3, 2)];
        // Falling food at y=5 settled because obstacle at y=6
        state.falling_food = vec![Position::new(3, 5)];
        state.obstacles = vec![Position::new(3, 6)];

        apply_gravity_to_stones(&mut state);

        assert_eq!(state.stones[0].y, 4);
    }

    #[test]
    fn test_stone_stops_on_food() {
        let mut state = create_test_level_state();
        state.stones = vec![Position::new(3, 2)];
        state.food = vec![Position::new(3, 5)];

        apply_gravity_to_stones(&mut state);

        assert_eq!(state.stones[0].y, 4);
    }

    #[test]
    fn test_stone_stops_on_snake_segment() {
        let mut state = create_test_level_state();
        // Stone above the default snake at (5, 2)
        state.stones = vec![Position::new(5, 0)];

        apply_gravity_to_stones(&mut state);

        assert_eq!(state.stones[0].y, 1);
    }

    #[test]
    fn test_stone_stops_on_solid_exit() {
        let mut state = create_test_level_state();
        state.stones = vec![Position::new(9, 2)];
        state.exit = Position::new(9, 5);
        state.exit_is_solid = true;

        apply_gravity_to_stones(&mut state);

        assert_eq!(state.stones[0].y, 4);
    }

    #[test]
    fn test_stone_falls_through_non_solid_exit() {
        let mut state = create_test_level_state();
        state.stones = vec![Position::new(9, 2)];
        state.exit = Position::new(9, 5);
        state.exit_is_solid = false;

        apply_gravity_to_stones(&mut state);

        assert_eq!(state.stones[0].y, 9);
    }

    // ── can_object_fall: falling food stops on various platforms ──────────────

    #[test]
    fn test_falling_food_stops_on_stone() {
        let mut state = create_test_level_state();
        state.falling_food = vec![Position::new(3, 2)];
        state.stones = vec![Position::new(3, 5)];

        apply_gravity_to_falling_food(&mut state);

        assert_eq!(state.falling_food[0].y, 4);
    }

    #[test]
    fn test_falling_food_stops_on_floating_food() {
        let mut state = create_test_level_state();
        state.falling_food = vec![Position::new(3, 2)];
        state.floating_food = vec![Position::new(3, 5)];

        apply_gravity_to_falling_food(&mut state);

        assert_eq!(state.falling_food[0].y, 4);
    }

    #[test]
    fn test_falling_food_stops_on_settled_falling_food() {
        let mut state = create_test_level_state();
        // Bottom food settled on obstacle; top food stops above the settled one
        state.falling_food = vec![Position::new(3, 2), Position::new(3, 6)];
        state.obstacles = vec![Position::new(3, 7)];

        apply_gravity_to_falling_food(&mut state);

        assert!(state.falling_food.contains(&Position::new(3, 5)));
        assert!(state.falling_food.contains(&Position::new(3, 6)));
    }

    #[test]
    fn test_falling_food_stops_on_regular_food() {
        let mut state = create_test_level_state();
        state.falling_food = vec![Position::new(3, 2)];
        state.food = vec![Position::new(3, 5)];

        apply_gravity_to_falling_food(&mut state);

        assert_eq!(state.falling_food[0].y, 4);
    }

    #[test]
    fn test_falling_food_stops_on_spike() {
        let mut state = create_test_level_state();
        state.falling_food = vec![Position::new(3, 2)];
        state.spikes = vec![Position::new(3, 5)];

        apply_gravity_to_falling_food(&mut state);

        assert_eq!(state.falling_food[0].y, 4);
    }

    #[test]
    fn test_falling_food_stops_on_solid_exit() {
        let mut state = create_test_level_state();
        state.falling_food = vec![Position::new(9, 2)];
        state.exit = Position::new(9, 5);
        state.exit_is_solid = true;

        apply_gravity_to_falling_food(&mut state);

        assert_eq!(state.falling_food[0].y, 4);
    }

    #[test]
    fn test_falling_food_falls_through_non_solid_exit() {
        let mut state = create_test_level_state();
        state.falling_food = vec![Position::new(9, 2)];
        state.exit = Position::new(9, 5);
        state.exit_is_solid = false;

        apply_gravity_to_falling_food(&mut state);

        assert_eq!(state.falling_food[0].y, 9);
    }

    // ── is_settled_falling_food: each support type ────────────────────────────

    #[test]
    fn test_is_settled_falling_food_on_stone() {
        let mut state = create_test_level_state();
        state.falling_food = vec![Position::new(4, 4)];
        state.stones = vec![Position::new(4, 5)];

        assert!(is_settled_falling_food(Position::new(4, 4), &state, 0));
    }

    #[test]
    fn test_is_settled_falling_food_on_floating_food() {
        let mut state = create_test_level_state();
        state.falling_food = vec![Position::new(4, 4)];
        state.floating_food = vec![Position::new(4, 5)];

        assert!(is_settled_falling_food(Position::new(4, 4), &state, 0));
    }

    #[test]
    fn test_is_settled_falling_food_on_regular_food() {
        let mut state = create_test_level_state();
        state.falling_food = vec![Position::new(4, 4)];
        state.food = vec![Position::new(4, 5)];

        assert!(is_settled_falling_food(Position::new(4, 4), &state, 0));
    }

    #[test]
    fn test_is_settled_falling_food_on_snake_segment() {
        let mut state = create_test_level_state();
        // Snake is at (5, 2) by default; place falling food directly above it
        state.falling_food = vec![Position::new(5, 1)];

        assert!(is_settled_falling_food(Position::new(5, 1), &state, 0));
    }

    #[test]
    fn test_is_settled_falling_food_on_spike() {
        let mut state = create_test_level_state();
        state.falling_food = vec![Position::new(4, 4)];
        state.spikes = vec![Position::new(4, 5)];

        assert!(is_settled_falling_food(Position::new(4, 4), &state, 0));
    }

    #[test]
    fn test_is_settled_falling_food_on_solid_exit() {
        let mut state = create_test_level_state();
        state.falling_food = vec![Position::new(9, 8)];
        state.exit = Position::new(9, 9);
        state.exit_is_solid = true;

        assert!(is_settled_falling_food(Position::new(9, 8), &state, 0));
    }

    #[test]
    fn test_is_settled_falling_food_at_floor() {
        let mut state = create_test_level_state();
        // y=9 is the last row; below is y=10 which is >= grid height of 10
        state.falling_food = vec![Position::new(4, 9)];

        assert!(is_settled_falling_food(Position::new(4, 9), &state, 0));
    }

    #[test]
    fn test_is_settled_falling_food_recursive_chain() {
        let mut state = create_test_level_state();
        // Stack: (4,7) → (4,8) → (4,9) at floor; each is settled through the chain
        state.falling_food = vec![
            Position::new(4, 7),
            Position::new(4, 8),
            Position::new(4, 9),
        ];

        assert!(is_settled_falling_food(Position::new(4, 7), &state, 0));
    }

    #[test]
    fn test_deep_falling_food_column_hits_depth_cap_without_stack_overflow() {
        let mut state = create_test_level_state();
        state.grid_size = GridSize::new(1, (MAX_SETTLED_FALLING_FOOD_DEPTH as i32) + 8);
        state.falling_food = (0..=(MAX_SETTLED_FALLING_FOOD_DEPTH + 2))
            .map(|y| Position::new(0, y as i32))
            .collect();

        // No floor/support under the column. Without a depth cap this requires
        // traversing the entire chain recursively.
        assert!(is_settled_falling_food(Position::new(0, 0), &state, 0));
    }
}
