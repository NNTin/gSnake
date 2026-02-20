/* tslint:disable */
/* eslint-disable */

/**
 * WASM wrapper around the Rust `GameEngine`
 * Provides JS-friendly interface for the web frontend
 */
export class WasmGameEngine {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Gets the current game frame (grid + state)
     * Returns a JS object with grid and state properties
     */
    getFrame(): any;
    /**
     * Gets the current game state as a JS object
     */
    getGameState(): any;
    /**
     * Gets the current level data as a JS object
     */
    getLevel(): any;
    /**
     * Creates a new WASM game engine from serialized level JSON
     */
    constructor(level_json: any);
    /**
     * Registers a JavaScript callback to be invoked whenever the game state changes
     * The callback receives a Frame object containing the grid and game state
     */
    onFrame(callback: Function): void;
    /**
     * Processes a move in the given direction
     * Returns a Frame on success; failures return a `ContractError`
     * Automatically invokes the onFrame callback with the new state
     */
    processMove(direction: any): any;
}

/**
 * Returns all levels embedded in the WASM package.
 */
export function getLevels(): any;

/**
 * Initialize panic hook for better error messages in the browser console
 */
export function init_panic_hook(): void;

/**
 * Logs a message to the browser console (for debugging)
 */
export function log(s: string): void;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_wasmgameengine_free: (a: number, b: number) => void;
    readonly getLevels: () => [number, number, number];
    readonly log: (a: number, b: number) => void;
    readonly wasmgameengine_getFrame: (a: number) => [number, number, number];
    readonly wasmgameengine_getGameState: (a: number) => [number, number, number];
    readonly wasmgameengine_getLevel: (a: number) => [number, number, number];
    readonly wasmgameengine_new: (a: any) => [number, number, number];
    readonly wasmgameengine_onFrame: (a: number, b: any) => void;
    readonly wasmgameengine_processMove: (a: number, b: any) => [number, number, number];
    readonly init_panic_hook: () => void;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_exn_store: (a: number) => void;
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
