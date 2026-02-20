/* @ts-self-types="./gsnake_wasm.d.ts" */

import * as wasm from "./gsnake_wasm_bg.wasm";
import { __wbg_set_wasm } from "./gsnake_wasm_bg.js";
__wbg_set_wasm(wasm);
wasm.__wbindgen_start();
export {
    WasmGameEngine, getLevels, init_panic_hook, log
} from "./gsnake_wasm_bg.js";
