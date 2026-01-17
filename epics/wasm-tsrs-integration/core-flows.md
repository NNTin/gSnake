# Core Flows: Stable Core Interface (wasm-bindgen + ts-rs)

## Flow 1: UI Developer Integrates Engine Interface
Description: UI developer consumes the stable interface to render and control gameplay without manual type mapping.
Trigger / Entry: Developer starts a new UI feature or integrates the engine into the Svelte client.
Steps:
1) Import shared domain types from the generated type bundle.
2) Initialize the engine using the documented entrypoint and level data format.
3) Subscribe to frame updates and game state payloads from the engine.
4) Render the grid and state directly from the authoritative frame payload.
5) Send user input actions to the engine via documented commands.
Feedback & State:
- Success: UI renders grid and state with no manual type conversion.
- Error: Schema mismatch or missing types surfaces as compile-time or runtime errors.
Exit: UI reliably drives the engine and renders frames using shared types.

## Flow 2: Engine Developer Extends Core Models Safely
Description: Engine developer updates domain models while preserving the stable interface contract.
Trigger / Entry: Developer adds or modifies core gameplay data structures.
Steps:
1) Update Rust domain models and ensure serde + ts-rs derivations remain intact.
2) Regenerate shared types and validate that the TypeScript interfaces match expectations.
3) Run existing client integration checks to confirm no breaking changes.
4) Document any intended minor-release interface changes.
Feedback & State:
- Success: Updated types generate cleanly and remain compatible with the UI.
- Error: Missing type exports or schema drift detected during generation or tests.
Exit: Core models evolve without forcing frequent client rewrites.

## Flow 3: Engine Initialization Fails
Description: UI developer handles wasm initialization failure during startup.
Trigger / Entry: Engine initialization throws or fails to load.
Steps:
1) Attempt engine initialization at app startup.
2) If initialization fails, surface an error state to the UI.
3) Log or display a diagnostic message for debugging.
Feedback & State:
- Error: Initialization failure state shown instead of gameplay UI.
Exit: User sees a clear failure state and the developer has actionable diagnostics.

## Flow 4: Schema Mismatch or Missing Types Detected
Description: UI developer encounters mismatched payloads or missing type definitions.
Trigger / Entry: UI consumes a payload or type that no longer matches the core contract.
Steps:
1) Attempt to build or run the UI using shared types.
2) Detect mismatch via compile-time type errors or runtime payload validation issues.
3) Surface a clear error message indicating the missing or mismatched type.
Feedback & State:
- Error: Type mismatch or missing definitions are explicitly reported.
Exit: Developer identifies the contract gap and resolves it before release.
