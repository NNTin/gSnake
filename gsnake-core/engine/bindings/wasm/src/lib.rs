use gsnake_core::{
    engine::GameEngine, levels::parse_levels_json, ContractError, ContractErrorKind, Direction,
    Frame, LevelDefinition,
};
use js_sys::Function;
use serde_wasm_bindgen::{from_value, to_value};
use wasm_bindgen::prelude::*;

const LEVELS_JSON: &str = include_str!("../../../core/data/levels.json");
type FrameCallback<'a> = &'a mut dyn FnMut(&Frame) -> Result<(), String>;

/// Initialize panic hook for better error messages in the browser console
#[wasm_bindgen(start)]
pub fn init_panic_hook() {
    console_error_panic_hook::set_once();
}

/// WASM wrapper around the Rust `GameEngine`
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
        let level = parse_level_result(from_value(level_json).map_err(|e| e.to_string()))
            .map_err(|error| contract_error_from_data(&error))?;

        initialize_engine(level).map_err(|error| contract_error_from_data(&error))
    }

    /// Registers a JavaScript callback to be invoked whenever the game state changes
    /// The callback receives a Frame object containing the grid and game state
    #[wasm_bindgen(js_name = onFrame)]
    pub fn on_frame(&mut self, callback: Function) {
        self.on_frame_callback = Some(callback);
        if let Err(error) = self.emit_frame() {
            web_sys::console::error_1(
                &format!(
                    "Failed to emit initial frame in onFrame: {}",
                    js_error_message(&error)
                )
                .into(),
            );
        }
    }

    /// Processes a move in the given direction
    /// Returns a Frame on success; failures return a `ContractError`
    /// Automatically invokes the onFrame callback with the new state
    #[wasm_bindgen(js_name = processMove)]
    pub fn process_move(&mut self, direction: &JsValue) -> Result<JsValue, JsValue> {
        let direction = parse_direction_js_value(direction)?;
        let frame = process_move_on_engine(&mut self.engine, direction)
            .map_err(|error| contract_error_from_data(&error))?;

        if let Some(callback) = &self.on_frame_callback {
            let mut callback_fn =
                |current_frame: &Frame| invoke_js_callback(callback, current_frame);
            emit_frame_with_callback(&frame, Some(&mut callback_fn))
                .map_err(|error| contract_error_from_data(&error))?;
        }

        serialize_frame(&frame)
    }

    /// Gets the current game frame (grid + state)
    /// Returns a JS object with grid and state properties
    #[wasm_bindgen(js_name = getFrame)]
    pub fn get_frame(&self) -> Result<JsValue, JsValue> {
        let frame = self.engine.generate_frame();
        serialize_frame(&frame)
    }

    /// Gets the current game state as a JS object
    #[wasm_bindgen(js_name = getGameState)]
    pub fn get_game_state(&self) -> Result<JsValue, JsValue> {
        to_value(self.engine.game_state())
            .map_err(|e| contract_error(ContractErrorKind::SerializationFailed, &e.to_string()))
    }

    /// Gets the current level data as a JS object
    #[wasm_bindgen(js_name = getLevel)]
    pub fn get_level(&self) -> Result<JsValue, JsValue> {
        to_value(self.engine.level_definition())
            .map_err(|e| contract_error(ContractErrorKind::SerializationFailed, &e.to_string()))
    }

    /// Emits the current frame to the registered callback
    fn emit_frame(&self) -> Result<(), JsValue> {
        if let Some(callback) = &self.on_frame_callback {
            let frame = self.engine.generate_frame();
            let mut callback_fn =
                |current_frame: &Frame| invoke_js_callback(callback, current_frame);
            emit_frame_with_callback(&frame, Some(&mut callback_fn))
                .map_err(|error| contract_error_from_data(&error))?;
        }
        Ok(())
    }
}

/// Returns all levels embedded in the WASM package.
#[wasm_bindgen(js_name = getLevels)]
pub fn get_levels() -> Result<JsValue, JsValue> {
    let levels = parse_levels_json(LEVELS_JSON)
        .map_err(|e| contract_error(ContractErrorKind::InitializationFailed, &e.to_string()))?;
    to_value(&levels)
        .map_err(|e| contract_error(ContractErrorKind::SerializationFailed, &e.to_string()))
}

/// Logs a message to the browser console (for debugging)
#[wasm_bindgen]
pub fn log(s: &str) {
    web_sys::console::log_1(&JsValue::from_str(s));
}

fn serialize_frame(frame: &Frame) -> Result<JsValue, JsValue> {
    to_value(frame)
        .map_err(|e| contract_error(ContractErrorKind::SerializationFailed, &e.to_string()))
}

fn initialize_engine(level: LevelDefinition) -> Result<WasmGameEngine, ContractError> {
    let engine = GameEngine::new(level).map_err(|error| {
        build_contract_error(ContractErrorKind::InitializationFailed, &error.to_string())
    })?;

    Ok(WasmGameEngine {
        engine,
        on_frame_callback: None,
    })
}

fn parse_level_result(
    level_result: Result<LevelDefinition, String>,
) -> Result<LevelDefinition, ContractError> {
    level_result.map_err(|message| build_contract_error(ContractErrorKind::InvalidInput, &message))
}

fn parse_direction_js_value(direction: &JsValue) -> Result<Direction, JsValue> {
    let direction_str = direction.as_string().ok_or_else(|| {
        contract_error(
            ContractErrorKind::InvalidInput,
            "Direction must be a string",
        )
    })?;
    parse_direction_str(&direction_str).map_err(|error| contract_error_from_data(&error))
}

fn parse_direction_str(direction: &str) -> Result<Direction, ContractError> {
    match direction {
        "North" => Ok(Direction::North),
        "South" => Ok(Direction::South),
        "East" => Ok(Direction::East),
        "West" => Ok(Direction::West),
        _ => Err(build_contract_error(
            ContractErrorKind::InvalidInput,
            &format!("Invalid direction: {direction}"),
        )),
    }
}

fn process_move_on_engine(
    engine: &mut GameEngine,
    direction: Direction,
) -> Result<Frame, ContractError> {
    let processed = engine.process_move(direction).map_err(|error| {
        build_contract_error(ContractErrorKind::InternalError, &error.to_string())
    })?;
    if !processed {
        return Err(build_contract_error(
            ContractErrorKind::InputRejected,
            "Input rejected by engine",
        ));
    }

    Ok(engine.generate_frame())
}

fn emit_frame_with_callback(
    frame: &Frame,
    callback: Option<FrameCallback<'_>>,
) -> Result<(), ContractError> {
    if let Some(callback) = callback {
        callback(frame)
            .map_err(|message| build_contract_error(ContractErrorKind::InternalError, &message))?;
    }

    Ok(())
}

fn invoke_js_callback(callback: &Function, frame: &Frame) -> Result<(), String> {
    let frame_js = serialize_frame(frame).map_err(|error| js_error_message(&error))?;
    callback
        .call1(&JsValue::NULL, &frame_js)
        .map_err(|error| js_error_message(&error))?;
    Ok(())
}

fn js_error_message(error: &JsValue) -> String {
    error.as_string().unwrap_or_else(|| format!("{error:?}"))
}

fn build_contract_error(kind: ContractErrorKind, message: &str) -> ContractError {
    ContractError {
        kind,
        message: message.to_string(),
        context: None,
        rejection_reason: None,
    }
}

fn contract_error(kind: ContractErrorKind, message: &str) -> JsValue {
    let error = build_contract_error(kind, message);
    contract_error_from_data(&error)
}

fn contract_error_from_data(error: &ContractError) -> JsValue {
    if let Ok(value) = to_value(&error) {
        value
    } else {
        let obj = js_sys::Object::new();
        let error_kind = error.kind;
        let _ = js_sys::Reflect::set(
            &obj,
            &JsValue::from_str("kind"),
            &JsValue::from_str(contract_error_kind_str(error_kind)),
        );
        let _ = js_sys::Reflect::set(
            &obj,
            &JsValue::from_str("message"),
            &JsValue::from_str(&error.message),
        );
        obj.into()
    }
}

fn contract_error_kind_str(kind: ContractErrorKind) -> &'static str {
    match kind {
        ContractErrorKind::InvalidInput => "invalidInput",
        ContractErrorKind::InputRejected => "inputRejected",
        ContractErrorKind::SerializationFailed => "serializationFailed",
        ContractErrorKind::InitializationFailed => "initializationFailed",
        ContractErrorKind::InternalError => "internalError",
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use gsnake_core::{GridSize, Position};
    use std::cell::Cell;

    #[test]
    fn test_initialize_engine_sets_empty_callback() {
        let engine = initialize_engine(create_level()).expect("valid level should initialize");
        assert_eq!(engine.engine.game_state().moves, 0);
        assert!(engine.on_frame_callback.is_none());
    }

    #[test]
    fn test_initialize_engine_maps_invalid_grid_to_initialization_failed() {
        let mut level = create_level();
        level.grid_size = GridSize::new(0, 5);

        let Err(error) = initialize_engine(level) else {
            panic!("invalid grid size should fail");
        };

        assert_eq!(error.kind, ContractErrorKind::InitializationFailed);
        assert!(
            error.message.contains("width=0, height=5"),
            "unexpected error message: {}",
            error.message
        );
    }

    #[test]
    fn test_parse_level_result_maps_error_kind() {
        let error = parse_level_result(Err("bad level payload".to_string()))
            .expect_err("invalid level payload should map to contract error");
        assert_eq!(error.kind, ContractErrorKind::InvalidInput);
        assert_eq!(error.message, "bad level payload");
    }

    #[test]
    fn test_parse_level_result_success() {
        let level = create_level();
        let parsed = parse_level_result(Ok(level.clone())).expect("valid level should parse");
        assert_eq!(parsed, level);
    }

    #[test]
    fn test_parse_direction_str_accepts_cardinals() {
        assert_eq!(
            parse_direction_str("North").expect("north should parse"),
            Direction::North
        );
        assert_eq!(
            parse_direction_str("South").expect("south should parse"),
            Direction::South
        );
        assert_eq!(
            parse_direction_str("East").expect("east should parse"),
            Direction::East
        );
        assert_eq!(
            parse_direction_str("West").expect("west should parse"),
            Direction::West
        );
    }

    #[test]
    fn test_parse_direction_str_rejects_edge_cases() {
        assert_parse_direction_error("north");
        assert_parse_direction_error(" EAST ");
        assert_parse_direction_error("NORTH");
        assert_parse_direction_error("");
        assert_parse_direction_error("Diagonal");
    }

    #[test]
    fn test_process_move_on_engine_accepts_valid_direction() {
        let mut engine =
            GameEngine::new(create_level()).expect("test level should have a valid grid size");
        let frame = process_move_on_engine(&mut engine, Direction::North)
            .expect("valid direction should produce frame");
        assert_eq!(frame.state.moves, 1);
    }

    #[test]
    fn test_process_move_on_engine_rejects_opposite_direction() {
        let mut engine =
            GameEngine::new(create_level()).expect("test level should have a valid grid size");
        let error = process_move_on_engine(&mut engine, Direction::West)
            .expect_err("opposite direction should be rejected");
        assert_eq!(error.kind, ContractErrorKind::InputRejected);
        assert_eq!(error.message, "Input rejected by engine");
    }

    #[test]
    fn test_process_move_on_engine_maps_malformed_state_to_internal_error() {
        let mut level = create_level();
        level.snake = vec![];
        let mut engine = GameEngine::new(level).expect("test level should have a valid grid size");

        let error = process_move_on_engine(&mut engine, Direction::North)
            .expect_err("empty snake should map to internal error");

        assert_eq!(error.kind, ContractErrorKind::InternalError);
        assert_eq!(
            error.message,
            "Invalid snake state: expected at least one segment, found 0"
        );
    }

    #[test]
    fn test_emit_frame_with_callback_without_callback_is_noop() {
        let frame = GameEngine::new(create_level())
            .expect("test level should have a valid grid size")
            .generate_frame();
        let result = emit_frame_with_callback(&frame, None);
        assert!(result.is_ok());
    }

    #[test]
    fn test_emit_frame_with_callback_invokes_callback() {
        let frame = GameEngine::new(create_level())
            .expect("test level should have a valid grid size")
            .generate_frame();
        let called = Cell::new(false);
        let mut callback = |_: &Frame| {
            called.set(true);
            Ok(())
        };
        emit_frame_with_callback(&frame, Some(&mut callback)).expect("callback should succeed");
        assert!(called.get());
    }

    #[test]
    fn test_emit_frame_with_callback_maps_callback_errors() {
        let frame = GameEngine::new(create_level())
            .expect("test level should have a valid grid size")
            .generate_frame();
        let mut callback = |_: &Frame| Err("callback failed".to_string());
        let error = emit_frame_with_callback(&frame, Some(&mut callback))
            .expect_err("callback failures should map to internal error");
        assert_eq!(error.kind, ContractErrorKind::InternalError);
        assert_eq!(error.message, "callback failed");
    }

    #[test]
    fn test_build_contract_error_shape() {
        let error =
            build_contract_error(ContractErrorKind::SerializationFailed, "serialize failed");
        assert_eq!(error.kind, ContractErrorKind::SerializationFailed);
        assert_eq!(error.message, "serialize failed");
        assert!(error.context.is_none());
        assert!(error.rejection_reason.is_none());
    }

    #[test]
    fn test_contract_error_kind_mapping() {
        assert_eq!(
            contract_error_kind_str(ContractErrorKind::InvalidInput),
            "invalidInput"
        );
        assert_eq!(
            contract_error_kind_str(ContractErrorKind::InputRejected),
            "inputRejected"
        );
        assert_eq!(
            contract_error_kind_str(ContractErrorKind::SerializationFailed),
            "serializationFailed"
        );
        assert_eq!(
            contract_error_kind_str(ContractErrorKind::InitializationFailed),
            "initializationFailed"
        );
        assert_eq!(
            contract_error_kind_str(ContractErrorKind::InternalError),
            "internalError"
        );
    }

    #[cfg(target_arch = "wasm32")]
    #[test]
    fn test_parse_direction_js_value_accepts_string() {
        let direction = parse_direction_js_value(&JsValue::from_str("North"))
            .expect("North string should parse");
        assert_eq!(direction, Direction::North);
    }

    #[cfg(target_arch = "wasm32")]
    #[test]
    fn test_parse_direction_js_value_rejects_non_string() {
        let error = parse_direction_js_value(&JsValue::from_f64(42.0))
            .expect_err("non-string direction should fail");
        let parsed: ContractError = serde_wasm_bindgen::from_value(error)
            .expect("error payload should deserialize as ContractError");
        assert_eq!(parsed.kind, ContractErrorKind::InvalidInput);
        assert_eq!(parsed.message, "Direction must be a string");
    }

    #[cfg(target_arch = "wasm32")]
    #[test]
    fn test_contract_error_serializes_to_js_value() {
        let value = contract_error(ContractErrorKind::InputRejected, "move rejected");
        let parsed: ContractError = serde_wasm_bindgen::from_value(value)
            .expect("contract_error should produce serializable ContractError value");
        assert_eq!(parsed.kind, ContractErrorKind::InputRejected);
        assert_eq!(parsed.message, "move rejected");
    }

    #[cfg(target_arch = "wasm32")]
    #[test]
    fn test_contract_error_from_data_roundtrip() {
        let source = build_contract_error(ContractErrorKind::InternalError, "boom");
        let value = contract_error_from_data(&source);
        let parsed: ContractError = serde_wasm_bindgen::from_value(value)
            .expect("contract_error_from_data should roundtrip");
        assert_eq!(parsed, source);
    }

    #[cfg(target_arch = "wasm32")]
    #[test]
    fn test_wasm_engine_constructor_getters_and_move() {
        let level = create_level();
        let level_js = serde_wasm_bindgen::to_value(&level)
            .expect("level should serialize to JsValue for constructor");
        let mut engine = WasmGameEngine::new(level_js).expect("constructor should succeed");

        // Exercise internal frame emit path without callback.
        engine
            .emit_frame()
            .expect("emit_frame should be a no-op when callback is not set");

        let frame_js = engine.get_frame().expect("get_frame should succeed");
        let frame: Frame = serde_wasm_bindgen::from_value(frame_js)
            .expect("frame should deserialize from JsValue");
        assert_eq!(frame.state.moves, 0);

        let game_state_js = engine
            .get_game_state()
            .expect("get_game_state should succeed");
        let game_state: gsnake_core::GameState = serde_wasm_bindgen::from_value(game_state_js)
            .expect("game state should deserialize from JsValue");
        assert_eq!(game_state.current_level, 1);

        let level_js = engine.get_level().expect("get_level should succeed");
        let level_out: LevelDefinition = serde_wasm_bindgen::from_value(level_js)
            .expect("level should deserialize from JsValue");
        assert_eq!(level_out.id, level.id);

        let moved_js = engine
            .process_move(&JsValue::from_str("North"))
            .expect("valid move should succeed");
        let moved_frame: Frame =
            serde_wasm_bindgen::from_value(moved_js).expect("moved frame should deserialize");
        assert_eq!(moved_frame.state.moves, 1);
    }

    #[cfg(target_arch = "wasm32")]
    #[test]
    fn test_wasm_engine_process_move_rejects_invalid_direction() {
        let level_js = serde_wasm_bindgen::to_value(&create_level())
            .expect("level should serialize to JsValue");
        let mut engine = WasmGameEngine::new(level_js).expect("constructor should succeed");

        let error_js = engine
            .process_move(&JsValue::from_str("Diagonal"))
            .expect_err("invalid direction token should fail");
        let error: ContractError =
            serde_wasm_bindgen::from_value(error_js).expect("error payload should deserialize");
        assert_eq!(error.kind, ContractErrorKind::InvalidInput);
        assert_eq!(error.message, "Invalid direction: Diagonal");
    }

    #[cfg(target_arch = "wasm32")]
    #[test]
    fn test_wasm_engine_process_move_rejects_non_string_direction() {
        let level_js = serde_wasm_bindgen::to_value(&create_level())
            .expect("level should serialize to JsValue");
        let mut engine = WasmGameEngine::new(level_js).expect("constructor should succeed");

        let error_js = engine
            .process_move(&JsValue::from_f64(7.0))
            .expect_err("non-string direction should fail");
        let error: ContractError =
            serde_wasm_bindgen::from_value(error_js).expect("error payload should deserialize");
        assert_eq!(error.kind, ContractErrorKind::InvalidInput);
        assert_eq!(error.message, "Direction must be a string");
    }

    #[cfg(target_arch = "wasm32")]
    #[test]
    fn test_get_levels_returns_embedded_levels() {
        let levels_js = get_levels().expect("embedded levels should parse and serialize");
        let levels: Vec<LevelDefinition> =
            serde_wasm_bindgen::from_value(levels_js).expect("levels payload should deserialize");
        assert!(!levels.is_empty(), "embedded levels should not be empty");
    }

    fn create_level() -> LevelDefinition {
        LevelDefinition::new(
            1,
            "Test".to_string(),
            GridSize::new(5, 5),
            vec![Position::new(2, 2), Position::new(2, 3)],
            vec![],
            vec![Position::new(4, 4)],
            Position::new(4, 0),
            Direction::East,
        )
    }

    fn assert_parse_direction_error(direction: &str) {
        let error = parse_direction_str(direction)
            .expect_err("invalid direction tokens should return invalidInput");
        assert_eq!(error.kind, ContractErrorKind::InvalidInput);
        assert_eq!(error.message, format!("Invalid direction: {direction}"));
    }
}
