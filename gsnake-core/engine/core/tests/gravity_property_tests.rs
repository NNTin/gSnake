use std::collections::BTreeSet;

use gsnake_core::gravity::{apply_gravity_to_snake, apply_gravity_to_stones};
use gsnake_core::{GridSize, LevelState, Position, Snake};
use proptest::prelude::*;

fn normalize_positions(
    raw: &[(u8, u8)],
    width: i32,
    height: i32,
    blocked: &BTreeSet<(i32, i32)>,
) -> Vec<Position> {
    let mut seen = BTreeSet::new();
    let mut positions = Vec::new();

    for (raw_x, raw_y) in raw {
        let x = i32::from(*raw_x) % width;
        let y = i32::from(*raw_y) % height;
        let key = (x, y);
        if blocked.contains(&key) || !seen.insert(key) {
            continue;
        }
        positions.push(Position::new(x, y));
    }

    positions
}

fn to_coord_set(positions: &[Position]) -> BTreeSet<(i32, i32)> {
    positions.iter().map(|pos| (pos.x, pos.y)).collect()
}

fn find_first_unblocked(
    width: i32,
    height: i32,
    blocked: &BTreeSet<(i32, i32)>,
) -> Option<Position> {
    for y in 0..height {
        for x in 0..width {
            if !blocked.contains(&(x, y)) {
                return Some(Position::new(x, y));
            }
        }
    }
    None
}

struct GeneratedStateInput<'a> {
    width: i32,
    height: i32,
    snake: Vec<Position>,
    obstacle_raw: &'a [(u8, u8)],
    spike_raw: &'a [(u8, u8)],
    stone_raw: &'a [(u8, u8)],
    exit_raw: (u8, u8),
    exit_is_solid: bool,
}

fn build_common_state(input: GeneratedStateInput<'_>) -> LevelState {
    let GeneratedStateInput {
        width,
        height,
        snake,
        obstacle_raw,
        spike_raw,
        stone_raw,
        exit_raw,
        exit_is_solid,
    } = input;

    let mut blocked = to_coord_set(&snake);
    let preferred_exit = Position::new(
        i32::from(exit_raw.0) % width,
        i32::from(exit_raw.1) % height,
    );
    let exit = if blocked.contains(&(preferred_exit.x, preferred_exit.y)) {
        find_first_unblocked(width, height, &blocked).unwrap_or(preferred_exit)
    } else {
        preferred_exit
    };
    blocked.insert((exit.x, exit.y));

    let obstacles = normalize_positions(obstacle_raw, width, height, &blocked);
    blocked.extend(to_coord_set(&obstacles));

    let spikes = normalize_positions(spike_raw, width, height, &blocked);
    blocked.extend(to_coord_set(&spikes));

    let stones = normalize_positions(stone_raw, width, height, &blocked);

    LevelState {
        grid_size: GridSize::new(width, height),
        snake: Snake::new(snake),
        obstacles,
        food: Vec::new(),
        exit,
        floating_food: Vec::new(),
        falling_food: Vec::new(),
        stones,
        spikes,
        exit_is_solid,
    }
}

fn sorted_coords(positions: &[Position]) -> Vec<(i32, i32)> {
    let mut coords: Vec<(i32, i32)> = positions.iter().map(|pos| (pos.x, pos.y)).collect();
    coords.sort_unstable();
    coords
}

proptest! {
    #[test]
    fn stone_gravity_settles_in_bounds_and_is_idempotent(
        width in 4i32..15,
        height in 4i32..15,
        snake_x in 0u8..32,
        snake_y in 0u8..32,
        obstacle_raw in prop::collection::vec((0u8..32, 0u8..32), 0..24),
        spike_raw in prop::collection::vec((0u8..32, 0u8..32), 0..24),
        stone_raw in prop::collection::vec((0u8..32, 0u8..32), 0..24),
        exit_raw in (0u8..32, 0u8..32),
        exit_is_solid in any::<bool>(),
    ) {
        let snake = vec![Position::new(i32::from(snake_x) % width, i32::from(snake_y) % height)];
        let mut state = build_common_state(GeneratedStateInput {
            width,
            height,
            snake: snake.clone(),
            obstacle_raw: &obstacle_raw,
            spike_raw: &spike_raw,
            stone_raw: &stone_raw,
            exit_raw,
            exit_is_solid,
        });

        apply_gravity_to_stones(&mut state);

        let obstacle_set = to_coord_set(&state.obstacles);
        let spike_set = to_coord_set(&state.spikes);
        let snake_set = to_coord_set(&snake);
        let stone_set = to_coord_set(&state.stones);

        prop_assert_eq!(stone_set.len(), state.stones.len(), "stone positions must remain unique");

        for stone in &state.stones {
            prop_assert!((0..width).contains(&stone.x), "stone x escaped bounds: {:?}", stone);
            prop_assert!((0..height).contains(&stone.y), "stone y escaped bounds: {:?}", stone);
            prop_assert!(!obstacle_set.contains(&(stone.x, stone.y)), "stone overlapped obstacle at {:?}", stone);
            prop_assert!(!spike_set.contains(&(stone.x, stone.y)), "stone overlapped spike at {:?}", stone);
            prop_assert!(!snake_set.contains(&(stone.x, stone.y)), "stone overlapped snake at {:?}", stone);

            let below = Position::new(stone.x, stone.y + 1);
            if below.y >= height {
                continue;
            }

            let is_supported = obstacle_set.contains(&(below.x, below.y))
                || stone_set.contains(&(below.x, below.y))
                || spike_set.contains(&(below.x, below.y))
                || snake_set.contains(&(below.x, below.y))
                || (state.exit_is_solid && state.exit == below);
            prop_assert!(is_supported, "stone was left falling at {:?} with no support below", stone);
        }

        let settled = state.stones.clone();
        apply_gravity_to_stones(&mut state);
        prop_assert_eq!(state.stones, settled, "stone gravity must be idempotent once settled");
    }
}

proptest! {
    #[test]
    fn stone_gravity_is_deterministic_for_equivalent_states(
        width in 4i32..15,
        height in 4i32..15,
        snake_x in 0u8..32,
        snake_y in 0u8..32,
        obstacle_raw in prop::collection::vec((0u8..32, 0u8..32), 0..24),
        spike_raw in prop::collection::vec((0u8..32, 0u8..32), 0..24),
        stone_raw in prop::collection::vec((0u8..32, 0u8..32), 0..24),
        exit_raw in (0u8..32, 0u8..32),
        exit_is_solid in any::<bool>(),
    ) {
        let snake = vec![Position::new(i32::from(snake_x) % width, i32::from(snake_y) % height)];
        let mut state_a = build_common_state(GeneratedStateInput {
            width,
            height,
            snake,
            obstacle_raw: &obstacle_raw,
            spike_raw: &spike_raw,
            stone_raw: &stone_raw,
            exit_raw,
            exit_is_solid,
        });
        let mut state_b = state_a.clone();
        state_b.stones.reverse();

        apply_gravity_to_stones(&mut state_a);
        apply_gravity_to_stones(&mut state_b);

        prop_assert_eq!(
            sorted_coords(&state_a.stones),
            sorted_coords(&state_b.stones),
            "stone gravity should converge to the same final layout for equivalent states"
        );
    }
}

proptest! {
    #[test]
    fn snake_gravity_preserves_shape_and_is_deterministic(
        width in 4i32..15,
        height in 4i32..15,
        snake_x in 0u8..32,
        snake_start_raw in 0u8..32,
        snake_len_raw in 0u8..8,
        obstacle_raw in prop::collection::vec((0u8..32, 0u8..32), 0..24),
        spike_raw in prop::collection::vec((0u8..32, 0u8..32), 0..24),
        stone_raw in prop::collection::vec((0u8..32, 0u8..32), 0..24),
        exit_raw in (0u8..32, 0u8..32),
        exit_is_solid in any::<bool>(),
    ) {
        let max_len = usize::try_from(height.min(4)).expect("height should be positive");
        let snake_len = (usize::from(snake_len_raw) % max_len).max(1);
        let snake_len_i32 = i32::try_from(snake_len).expect("snake_len should fit in i32");
        let max_start_y = height - snake_len_i32;
        let snake_start_y = i32::from(snake_start_raw) % (max_start_y + 1);
        let snake_x = i32::from(snake_x) % width;

        let snake: Vec<Position> = (0..snake_len)
            .map(|offset| {
                let offset_i32 = i32::try_from(offset).expect("offset should fit in i32");
                Position::new(snake_x, snake_start_y + offset_i32)
            })
            .collect();

        let base_state = build_common_state(GeneratedStateInput {
            width,
            height,
            snake: snake.clone(),
            obstacle_raw: &obstacle_raw,
            spike_raw: &spike_raw,
            stone_raw: &stone_raw,
            exit_raw,
            exit_is_solid,
        });

        let mut state_a = base_state.clone();
        let initial_segments = state_a.snake.segments.clone();
        let hit_spike_a = apply_gravity_to_snake(&mut state_a);
        let spike_set = to_coord_set(&state_a.spikes);

        let vertical_shift = state_a.snake.segments[0].y - initial_segments[0].y;
        prop_assert!(vertical_shift >= 0, "snake should not move upward from gravity");

        for (before, after) in initial_segments.iter().zip(state_a.snake.segments.iter()) {
            prop_assert_eq!(before.x, after.x, "gravity should preserve snake x positions");
            prop_assert_eq!(after.y - before.y, vertical_shift, "all snake segments should move by the same vertical shift");
            prop_assert!((0..width).contains(&after.x), "snake x escaped bounds: {:?}", after);
            prop_assert!((0..height).contains(&after.y), "snake y escaped bounds: {:?}", after);
        }

        if hit_spike_a {
            prop_assert!(
                state_a
                    .snake
                    .segments
                    .iter()
                    .any(|segment| spike_set.contains(&(segment.x, segment.y))),
                "hit_spike=true must correspond to a segment touching a spike"
            );
        } else {
            prop_assert!(
                state_a
                    .snake
                    .segments
                    .iter()
                    .all(|segment| !spike_set.contains(&(segment.x, segment.y))),
                "hit_spike=false must end with no segment on a spike"
            );

            let settled_segments = state_a.snake.segments.clone();
            let hit_spike_second = apply_gravity_to_snake(&mut state_a);
            prop_assert!(!hit_spike_second, "settled non-spike snake should stay stable on repeat gravity");
            prop_assert_eq!(&state_a.snake.segments, &settled_segments, "repeat gravity should be idempotent for settled snake");
        }

        let mut state_b = base_state.clone();
        state_b.obstacles.reverse();
        state_b.spikes.reverse();
        state_b.stones.reverse();
        let hit_spike_b = apply_gravity_to_snake(&mut state_b);

        prop_assert_eq!(hit_spike_a, hit_spike_b, "reordered equivalent blockers should preserve spike outcome");
        prop_assert_eq!(&state_a.snake.segments, &state_b.snake.segments, "reordered equivalent blockers should preserve final snake layout");
    }
}
