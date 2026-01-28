/* tslint:disable */
/* eslint-disable */

/**
 * WASM wrapper around the Rust GameEngine
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
     * Returns a Frame on success; failures return a ContractError
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
