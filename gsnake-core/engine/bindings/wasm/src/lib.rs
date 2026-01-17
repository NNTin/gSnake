use gsnake_core::{
    engine::GameEngine, levels::parse_levels_json, Direction, LevelDefinition,
};
use js_sys::Function;
use serde_wasm_bindgen::{from_value, to_value};
use wasm_bindgen::prelude::*;

// Use wee_alloc as the global allocator for smaller binary size
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

const LEVELS_JSON: &str = include_str!("../../../core/data/levels.json");

/// Initialize panic hook for better error messages in the browser console
#[wasm_bindgen(start)]
pub fn init_panic_hook() {
    console_error_panic_hook::set_once();
}

/// WASM wrapper around the Rust GameEngine
/// Provides JS-friendly interface for the web frontend
#[wasm_bindgen]
pub struct WasmGameEngine {
    engine: GameEngine,
    on_frame_callback: Option<Function>,
}

#[wasm_bindgen]
impl WasmGameEngine {
    /// Creates a new WASM game engine from serialized level JSON
    #[wasm_bindgen(constructor)]
    pub fn new(level_json: JsValue) -> Result<WasmGameEngine, JsValue> {
        let level: LevelDefinition = from_value(level_json)
            .map_err(|e| JsValue::from_str(&format!("Failed to parse level: {}", e)))?;

        Ok(WasmGameEngine {
            engine: GameEngine::new(level),
            on_frame_callback: None,
        })
    }

    /// Registers a JavaScript callback to be invoked whenever the game state changes
    /// The callback receives a Frame object containing the grid and game state
    #[wasm_bindgen(js_name = onFrame)]
    pub fn on_frame(&mut self, callback: Function) {
        self.on_frame_callback = Some(callback);
    }

    /// Processes a move in the given direction
    /// Returns true if the move was processed, false if input was locked or invalid
    /// Automatically invokes the onFrame callback with the new state
    #[wasm_bindgen(js_name = processMove)]
    pub fn process_move(&mut self, direction_str: &str) -> Result<bool, JsValue> {
        let direction = match direction_str {
            "North" | "north" | "up" => Direction::North,
            "South" | "south" | "down" => Direction::South,
            "East" | "east" | "right" => Direction::East,
            "West" | "west" | "left" => Direction::West,
            _ => {
                return Err(JsValue::from_str(&format!(
                    "Invalid direction: {}",
                    direction_str
                )))
            }
        };

        let processed = self.engine.process_move(direction);

        // Emit frame after processing move
        if processed {
            self.emit_frame()?;
        }

        Ok(processed)
    }

    /// Gets the current game frame (grid + state)
    /// Returns a JS object with grid and state properties
    #[wasm_bindgen(js_name = getFrame)]
    pub fn get_frame(&self) -> Result<JsValue, JsValue> {
        let frame = self.engine.generate_frame();
        to_value(&frame).map_err(|e| JsValue::from_str(&format!("Failed to serialize frame: {}", e)))
    }

    /// Gets the current game state as a JS object
    #[wasm_bindgen(js_name = getGameState)]
    pub fn get_game_state(&self) -> Result<JsValue, JsValue> {
        to_value(self.engine.game_state())
            .map_err(|e| JsValue::from_str(&format!("Failed to serialize game state: {}", e)))
    }

    /// Gets the current level data as a JS object
    #[wasm_bindgen(js_name = getLevel)]
    pub fn get_level(&self) -> Result<JsValue, JsValue> {
        to_value(self.engine.level_definition())
            .map_err(|e| JsValue::from_str(&format!("Failed to serialize level: {}", e)))
    }

    /// Emits the current frame to the registered callback
    fn emit_frame(&self) -> Result<(), JsValue> {
        if let Some(callback) = &self.on_frame_callback {
            let frame_js = self.get_frame()?;
            callback.call1(&JsValue::NULL, &frame_js)?;
        }
        Ok(())
    }
}

/// Returns all levels embedded in the WASM package.
#[wasm_bindgen(js_name = getLevels)]
pub fn get_levels() -> Result<JsValue, JsValue> {
    let levels = parse_levels_json(LEVELS_JSON)
        .map_err(|e| JsValue::from_str(&format!("Failed to parse levels JSON: {}", e)))?;
    to_value(&levels)
        .map_err(|e| JsValue::from_str(&format!("Failed to serialize levels: {}", e)))
}

/// Logs a message to the browser console (for debugging)
#[wasm_bindgen]
pub fn log(s: &str) {
    web_sys::console::log_1(&JsValue::from_str(s));
}

#[cfg(test)]
mod tests {
    use super::*;
    use gsnake_core::{GridSize, Position};

    #[test]
    fn test_direction_parsing() {
        // Just a basic smoke test for the Rust side
        // Full WASM integration tests would require wasm-bindgen-test
        let level = LevelDefinition::new(
            1,
            "Test".to_string(),
            GridSize::new(5, 5),
            vec![Position::new(2, 2)],
            vec![],
            vec![],
            Position::new(4, 4),
            None,
        );

        let engine = GameEngine::new(level);
        assert_eq!(engine.game_state().moves, 0);
    }
}
