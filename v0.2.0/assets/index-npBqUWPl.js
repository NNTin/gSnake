var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
(function() {
  const e = document.createElement("link").relList;
  if (e && e.supports && e.supports("modulepreload")) return;
  for (const s of document.querySelectorAll('link[rel="modulepreload"]')) r(s);
  new MutationObserver((s) => {
    for (const o of s) if (o.type === "childList") for (const i of o.addedNodes) i.tagName === "LINK" && i.rel === "modulepreload" && r(i);
  }).observe(document, { childList: true, subtree: true });
  function t(s) {
    const o = {};
    return s.integrity && (o.integrity = s.integrity), s.referrerPolicy && (o.referrerPolicy = s.referrerPolicy), s.crossOrigin === "use-credentials" ? o.credentials = "include" : s.crossOrigin === "anonymous" ? o.credentials = "omit" : o.credentials = "same-origin", o;
  }
  function r(s) {
    if (s.ep) return;
    s.ep = true;
    const o = t(s);
    fetch(s.href, o);
  }
})();
function _() {
}
function Ne(n) {
  return n();
}
function Ae() {
  return /* @__PURE__ */ Object.create(null);
}
function q(n) {
  n.forEach(Ne);
}
function ze(n) {
  return typeof n == "function";
}
function v(n, e) {
  return n != n ? e == e : n !== e || n && typeof n == "object" || typeof n == "function";
}
function Be(n) {
  return Object.keys(n).length === 0;
}
function De(n, ...e) {
  if (n == null) {
    for (const r of e) r(void 0);
    return _;
  }
  const t = n.subscribe(...e);
  return t.unsubscribe ? () => t.unsubscribe() : t;
}
function ee(n, e, t) {
  n.$$.on_destroy.push(De(e, t));
}
function d(n, e) {
  n.appendChild(e);
}
function A(n, e, t) {
  n.insertBefore(e, t || null);
}
function $(n) {
  n.parentNode && n.parentNode.removeChild(n);
}
function je(n, e) {
  for (let t = 0; t < n.length; t += 1) n[t] && n[t].d(e);
}
function g(n) {
  return document.createElement(n);
}
function X(n) {
  return document.createTextNode(n);
}
function L() {
  return X(" ");
}
function Ue() {
  return X("");
}
function me(n, e, t, r) {
  return n.addEventListener(e, t, r), () => n.removeEventListener(e, t, r);
}
function f(n, e, t) {
  t == null ? n.removeAttribute(e) : n.getAttribute(e) !== t && n.setAttribute(e, t);
}
function He(n) {
  return Array.from(n.childNodes);
}
function de(n, e) {
  e = "" + e, n.data !== e && (n.data = e);
}
let te;
function Z(n) {
  te = n;
}
function le() {
  if (!te) throw new Error("Function called outside component initialization");
  return te;
}
function We(n) {
  le().$$.on_mount.push(n);
}
function qe(n) {
  le().$$.on_destroy.push(n);
}
function Ve(n, e) {
  return le().$$.context.set(n, e), e;
}
function Ge(n) {
  return le().$$.context.get(n);
}
const j = [], be = [];
let H = [];
const Oe = [], Ye = Promise.resolve();
let he = false;
function Ke() {
  he || (he = true, Ye.then(Re));
}
function xe(n) {
  H.push(n);
}
const _e = /* @__PURE__ */ new Set();
let B = 0;
function Re() {
  if (B !== 0) return;
  const n = te;
  do {
    try {
      for (; B < j.length; ) {
        const e = j[B];
        B++, Z(e), Xe(e.$$);
      }
    } catch (e) {
      throw j.length = 0, B = 0, e;
    }
    for (Z(null), j.length = 0, B = 0; be.length; ) be.pop()();
    for (let e = 0; e < H.length; e += 1) {
      const t = H[e];
      _e.has(t) || (_e.add(t), t());
    }
    H.length = 0;
  } while (j.length);
  for (; Oe.length; ) Oe.pop()();
  he = false, _e.clear(), Z(n);
}
function Xe(n) {
  if (n.fragment !== null) {
    n.update(), q(n.before_update);
    const e = n.dirty;
    n.dirty = [-1], n.fragment && n.fragment.p(n.ctx, e), n.after_update.forEach(xe);
  }
}
function Ze(n) {
  const e = [], t = [];
  H.forEach((r) => n.indexOf(r) === -1 ? e.push(r) : t.push(r)), t.forEach((r) => r()), H = e;
}
const ae = /* @__PURE__ */ new Set();
let G;
function ve() {
  G = { r: 0, c: [], p: G };
}
function $e() {
  G.r || q(G.c), G = G.p;
}
function h(n, e) {
  n && n.i && (ae.delete(n), n.i(e));
}
function x(n, e, t, r) {
  if (n && n.o) {
    if (ae.has(n)) return;
    ae.add(n), G.c.push(() => {
      ae.delete(n), r && (t && n.d(1), r());
    }), n.o(e);
  } else r && r();
}
function Ce(n) {
  return (n == null ? void 0 : n.length) !== void 0 ? n : Array.from(n);
}
function I(n) {
  n && n.c();
}
function S(n, e, t) {
  const { fragment: r, after_update: s } = n.$$;
  r && r.m(e, t), xe(() => {
    const o = n.$$.on_mount.map(Ne).filter(ze);
    n.$$.on_destroy ? n.$$.on_destroy.push(...o) : q(o), n.$$.on_mount = [];
  }), s.forEach(xe);
}
function k(n, e) {
  const t = n.$$;
  t.fragment !== null && (Ze(t.after_update), q(t.on_destroy), t.fragment && t.fragment.d(e), t.on_destroy = t.fragment = null, t.ctx = []);
}
function Je(n, e) {
  n.$$.dirty[0] === -1 && (j.push(n), Ke(), n.$$.dirty.fill(0)), n.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function O(n, e, t, r, s, o, i = null, c = [-1]) {
  const a = te;
  Z(n);
  const l = n.$$ = { fragment: null, ctx: [], props: o, update: _, not_equal: s, bound: Ae(), on_mount: [], on_destroy: [], on_disconnect: [], before_update: [], after_update: [], context: new Map(e.context || (a ? a.$$.context : [])), callbacks: Ae(), dirty: c, skip_bound: false, root: e.target || a.$$.root };
  i && i(l.root);
  let y = false;
  if (l.ctx = t ? t(n, e.props || {}, (m, b, ...N) => {
    const R = N.length ? N[0] : b;
    return l.ctx && s(l.ctx[m], l.ctx[m] = R) && (!l.skip_bound && l.bound[m] && l.bound[m](R), y && Je(n, m)), b;
  }) : [], l.update(), y = true, q(l.before_update), l.fragment = r ? r(l.ctx) : false, e.target) {
    if (e.hydrate) {
      const m = He(e.target);
      l.fragment && l.fragment.l(m), m.forEach($);
    } else l.fragment && l.fragment.c();
    e.intro && h(n.$$.fragment), S(n, e.target, e.anchor), Re();
  }
  Z(a);
}
class C {
  constructor() {
    __publicField(this, "$$");
    __publicField(this, "$$set");
  }
  $destroy() {
    k(this, 1), this.$destroy = _;
  }
  $on(e, t) {
    if (!ze(t)) return _;
    const r = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
    return r.push(t), () => {
      const s = r.indexOf(t);
      s !== -1 && r.splice(s, 1);
    };
  }
  $set(e) {
    this.$$set && !Be(e) && (this.$$.skip_bound = true, this.$$set(e), this.$$.skip_bound = false);
  }
}
const Qe = "4";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(Qe);
let pe = class {
  __destroy_into_raw() {
    const e = this.__wbg_ptr;
    return this.__wbg_ptr = 0, Ie.unregister(this), e;
  }
  free() {
    const e = this.__destroy_into_raw();
    u.__wbg_wasmgameengine_free(e, 0);
  }
  getFrame() {
    const e = u.wasmgameengine_getFrame(this.__wbg_ptr);
    if (e[2]) throw M(e[1]);
    return M(e[0]);
  }
  getGameState() {
    const e = u.wasmgameengine_getGameState(this.__wbg_ptr);
    if (e[2]) throw M(e[1]);
    return M(e[0]);
  }
  getLevel() {
    const e = u.wasmgameengine_getLevel(this.__wbg_ptr);
    if (e[2]) throw M(e[1]);
    return M(e[0]);
  }
  constructor(e) {
    const t = u.wasmgameengine_new(e);
    if (t[2]) throw M(t[1]);
    return this.__wbg_ptr = t[0] >>> 0, Ie.register(this, this.__wbg_ptr, this), this;
  }
  onFrame(e) {
    u.wasmgameengine_onFrame(this.__wbg_ptr, e);
  }
  processMove(e) {
    const t = U(e, u.__wbindgen_malloc, u.__wbindgen_realloc), r = T, s = u.wasmgameengine_processMove(this.__wbg_ptr, t, r);
    if (s[2]) throw M(s[1]);
    return s[0] !== 0;
  }
};
Symbol.dispose && (pe.prototype[Symbol.dispose] = pe.prototype.free);
function et(n) {
  const e = U(n, u.__wbindgen_malloc, u.__wbindgen_realloc), t = T;
  u.log(e, t);
}
function tt() {
  return { __proto__: null, "./gsnake_wasm_bg.js": { __proto__: null, __wbg_Error_8c4e43fe74559d73: function(e, t) {
    return Error(se(e, t));
  }, __wbg_Number_04624de7d0e8332d: function(e) {
    return Number(e);
  }, __wbg_String_8f0eb39a4a4c2f66: function(e, t) {
    const r = String(t), s = U(r, u.__wbindgen_malloc, u.__wbindgen_realloc), o = T;
    E().setInt32(e + 4, o, true), E().setInt32(e + 0, s, true);
  }, __wbg___wbindgen_boolean_get_bbbb1c18aa2f5e25: function(e) {
    const t = e, r = typeof t == "boolean" ? t : void 0;
    return oe(r) ? 16777215 : r ? 1 : 0;
  }, __wbg___wbindgen_debug_string_0bc8482c6e3508ae: function(e, t) {
    const r = we(t), s = U(r, u.__wbindgen_malloc, u.__wbindgen_realloc), o = T;
    E().setInt32(e + 4, o, true), E().setInt32(e + 0, s, true);
  }, __wbg___wbindgen_in_47fa6863be6f2f25: function(e, t) {
    return e in t;
  }, __wbg___wbindgen_is_function_0095a73b8b156f76: function(e) {
    return typeof e == "function";
  }, __wbg___wbindgen_is_object_5ae8e5880f2c1fbd: function(e) {
    const t = e;
    return typeof t == "object" && t !== null;
  }, __wbg___wbindgen_is_string_cd444516edc5b180: function(e) {
    return typeof e == "string";
  }, __wbg___wbindgen_is_undefined_9e4d92534c42d778: function(e) {
    return e === void 0;
  }, __wbg___wbindgen_jsval_loose_eq_9dd77d8cd6671811: function(e, t) {
    return e == t;
  }, __wbg___wbindgen_number_get_8ff4255516ccad3e: function(e, t) {
    const r = t, s = typeof r == "number" ? r : void 0;
    E().setFloat64(e + 8, oe(s) ? 0 : s, true), E().setInt32(e + 0, !oe(s), true);
  }, __wbg___wbindgen_string_get_72fb696202c56729: function(e, t) {
    const r = t, s = typeof r == "string" ? r : void 0;
    var o = oe(s) ? 0 : U(s, u.__wbindgen_malloc, u.__wbindgen_realloc), i = T;
    E().setInt32(e + 4, i, true), E().setInt32(e + 0, o, true);
  }, __wbg___wbindgen_throw_be289d5034ed271b: function(e, t) {
    throw new Error(se(e, t));
  }, __wbg_call_389efe28435a9388: function() {
    return ie(function(e, t) {
      return e.call(t);
    }, arguments);
  }, __wbg_call_4708e0c13bdc8e95: function() {
    return ie(function(e, t, r) {
      return e.call(t, r);
    }, arguments);
  }, __wbg_done_57b39ecd9addfe81: function(e) {
    return e.done;
  }, __wbg_entries_58c7934c745daac7: function(e) {
    return Object.entries(e);
  }, __wbg_error_7534b8e9a36f1ab4: function(e, t) {
    let r, s;
    try {
      r = e, s = t, console.error(se(e, t));
    } finally {
      u.__wbindgen_free(r, s, 1);
    }
  }, __wbg_get_9b94d73e6221f75c: function(e, t) {
    return e[t >>> 0];
  }, __wbg_get_b3ed3ad4be2bc8ac: function() {
    return ie(function(e, t) {
      return Reflect.get(e, t);
    }, arguments);
  }, __wbg_get_with_ref_key_1dc361bd10053bfe: function(e, t) {
    return e[t];
  }, __wbg_instanceof_ArrayBuffer_c367199e2fa2aa04: function(e) {
    let t;
    try {
      t = e instanceof ArrayBuffer;
    } catch {
      t = false;
    }
    return t;
  }, __wbg_instanceof_Uint8Array_9b9075935c74707c: function(e) {
    let t;
    try {
      t = e instanceof Uint8Array;
    } catch {
      t = false;
    }
    return t;
  }, __wbg_isArray_d314bb98fcf08331: function(e) {
    return Array.isArray(e);
  }, __wbg_isSafeInteger_bfbc7332a9768d2a: function(e) {
    return Number.isSafeInteger(e);
  }, __wbg_iterator_6ff6560ca1568e55: function() {
    return Symbol.iterator;
  }, __wbg_length_32ed9a279acd054c: function(e) {
    return e.length;
  }, __wbg_length_35a7bace40f36eac: function(e) {
    return e.length;
  }, __wbg_log_6b5ca2e6124b2808: function(e) {
    console.log(e);
  }, __wbg_new_361308b2356cecd0: function() {
    return new Object();
  }, __wbg_new_3eb36ae241fe6f44: function() {
    return new Array();
  }, __wbg_new_8a6f238a6ece86ea: function() {
    return new Error();
  }, __wbg_new_dd2b680c8bf6ae29: function(e) {
    return new Uint8Array(e);
  }, __wbg_next_3482f54c49e8af19: function() {
    return ie(function(e) {
      return e.next();
    }, arguments);
  }, __wbg_next_418f80d8f5303233: function(e) {
    return e.next;
  }, __wbg_prototypesetcall_bdcdcc5842e4d77d: function(e, t, r) {
    Uint8Array.prototype.set.call(rt(e, t), r);
  }, __wbg_set_3f1d0b984ed272ed: function(e, t, r) {
    e[t] = r;
  }, __wbg_set_f43e577aea94465b: function(e, t, r) {
    e[t >>> 0] = r;
  }, __wbg_stack_0ed75d68575b0f3c: function(e, t) {
    const r = t.stack, s = U(r, u.__wbindgen_malloc, u.__wbindgen_realloc), o = T;
    E().setInt32(e + 4, o, true), E().setInt32(e + 0, s, true);
  }, __wbg_value_0546255b415e96c1: function(e) {
    return e.value;
  }, __wbindgen_cast_0000000000000001: function(e) {
    return e;
  }, __wbindgen_cast_0000000000000002: function(e, t) {
    return se(e, t);
  }, __wbindgen_init_externref_table: function() {
    const e = u.__wbindgen_externrefs, t = e.grow(4);
    e.set(0, void 0), e.set(t + 0, void 0), e.set(t + 1, null), e.set(t + 2, true), e.set(t + 3, false);
  } } };
}
const Ie = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((n) => u.__wbg_wasmgameengine_free(n >>> 0, 1));
function nt(n) {
  const e = u.__externref_table_alloc();
  return u.__wbindgen_externrefs.set(e, n), e;
}
function we(n) {
  const e = typeof n;
  if (e == "number" || e == "boolean" || n == null) return `${n}`;
  if (e == "string") return `"${n}"`;
  if (e == "symbol") {
    const s = n.description;
    return s == null ? "Symbol" : `Symbol(${s})`;
  }
  if (e == "function") {
    const s = n.name;
    return typeof s == "string" && s.length > 0 ? `Function(${s})` : "Function";
  }
  if (Array.isArray(n)) {
    const s = n.length;
    let o = "[";
    s > 0 && (o += we(n[0]));
    for (let i = 1; i < s; i++) o += ", " + we(n[i]);
    return o += "]", o;
  }
  const t = /\[object ([^\]]+)\]/.exec(toString.call(n));
  let r;
  if (t && t.length > 1) r = t[1];
  else return toString.call(n);
  if (r == "Object") try {
    return "Object(" + JSON.stringify(n) + ")";
  } catch {
    return "Object";
  }
  return n instanceof Error ? `${n.name}: ${n.message}
${n.stack}` : r;
}
function rt(n, e) {
  return n = n >>> 0, J().subarray(n / 1, n / 1 + e);
}
let W = null;
function E() {
  return (W === null || W.buffer.detached === true || W.buffer.detached === void 0 && W.buffer !== u.memory.buffer) && (W = new DataView(u.memory.buffer)), W;
}
function se(n, e) {
  return n = n >>> 0, it(n, e);
}
let K = null;
function J() {
  return (K === null || K.byteLength === 0) && (K = new Uint8Array(u.memory.buffer)), K;
}
function ie(n, e) {
  try {
    return n.apply(this, e);
  } catch (t) {
    const r = nt(t);
    u.__wbindgen_exn_store(r);
  }
}
function oe(n) {
  return n == null;
}
function U(n, e, t) {
  if (t === void 0) {
    const c = Q.encode(n), a = e(c.length, 1) >>> 0;
    return J().subarray(a, a + c.length).set(c), T = c.length, a;
  }
  let r = n.length, s = e(r, 1) >>> 0;
  const o = J();
  let i = 0;
  for (; i < r; i++) {
    const c = n.charCodeAt(i);
    if (c > 127) break;
    o[s + i] = c;
  }
  if (i !== r) {
    i !== 0 && (n = n.slice(i)), s = t(s, r, r = i + n.length * 3, 1) >>> 0;
    const c = J().subarray(s + i, s + r), a = Q.encodeInto(n, c);
    i += a.written, s = t(s, r, i, 1) >>> 0;
  }
  return T = i, s;
}
function M(n) {
  const e = u.__wbindgen_externrefs.get(n);
  return u.__externref_table_dealloc(n), e;
}
let ce = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
ce.decode();
const st = 2146435072;
let ge = 0;
function it(n, e) {
  return ge += e, ge >= st && (ce = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true }), ce.decode(), ge = e), ce.decode(J().subarray(n, n + e));
}
const Q = new TextEncoder();
"encodeInto" in Q || (Q.encodeInto = function(n, e) {
  const t = Q.encode(n);
  return e.set(t), { read: n.length, written: t.length };
});
let T = 0, u;
function ot(n, e) {
  return u = n.exports, W = null, K = null, u.__wbindgen_start(), u;
}
async function at(n, e) {
  if (typeof Response == "function" && n instanceof Response) {
    if (typeof WebAssembly.instantiateStreaming == "function") try {
      return await WebAssembly.instantiateStreaming(n, e);
    } catch (s) {
      if (n.ok && t(n.type) && n.headers.get("Content-Type") !== "application/wasm") console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", s);
      else throw s;
    }
    const r = await n.arrayBuffer();
    return await WebAssembly.instantiate(r, e);
  } else {
    const r = await WebAssembly.instantiate(n, e);
    return r instanceof WebAssembly.Instance ? { instance: r, module: n } : r;
  }
  function t(r) {
    switch (r) {
      case "basic":
      case "cors":
      case "default":
        return true;
    }
    return false;
  }
}
async function ct(n) {
  if (u !== void 0) return u;
  n !== void 0 && (Object.getPrototypeOf(n) === Object.prototype ? { module_or_path: n } = n : console.warn("using deprecated parameters for the initialization function; pass a single object instead")), n === void 0 && (n = new URL("/gSnake/v0.2.0/assets/gsnake_wasm_bg-DXT1Nb0h.wasm", import.meta.url));
  const e = tt();
  (typeof n == "string" || typeof Request == "function" && n instanceof Request || typeof URL == "function" && n instanceof URL) && (n = fetch(n));
  const { instance: t, module: r } = await at(await n, e);
  return ot(t);
}
class lt {
  constructor() {
    __publicField(this, "wasmEngine", null);
    __publicField(this, "listeners", []);
    __publicField(this, "initialized", false);
    __publicField(this, "levels", []);
    __publicField(this, "currentLevelIndex", 0);
  }
  async init(e, t = 1) {
    if (this.initialized) {
      console.warn("WasmGameEngine already initialized");
      return;
    }
    await ct(), et("gSnake WASM engine initialized"), this.levels = e, this.currentLevelIndex = t - 1, await this.loadLevelByIndex(this.currentLevelIndex), this.initialized = true;
  }
  async loadLevel(e) {
    await this.loadLevelByIndex(e - 1);
  }
  async restartLevel() {
    await this.resetLevel();
  }
  async loadLevelByIndex(e) {
    if (e < 0 || e >= this.levels.length) throw new Error(`Invalid level index: ${e}`);
    const t = this.levels[e];
    this.currentLevelIndex = e;
    const r = { grid_size: { width: t.gridSize.width, height: t.gridSize.height }, snake: { segments: t.snake.map((s) => ({ x: s.x, y: s.y })), direction: null }, obstacles: t.obstacles.map((s) => ({ x: s.x, y: s.y })), food: t.food.map((s) => ({ x: s.x, y: s.y })), exit: { x: t.exit.x, y: t.exit.y } };
    this.wasmEngine = new pe(r), this.wasmEngine.onFrame((s) => {
      this.handleFrameUpdate(s, t);
    }), this.emitInitialEvents(t);
  }
  emitInitialEvents(e) {
    if (this.emitEvent({ type: "levelChanged", level: e }), this.wasmEngine) {
      const t = this.wasmEngine.getFrame();
      this.handleFrameUpdate(t, e);
    }
  }
  handleFrameUpdate(e, t) {
    const s = { status: { Playing: "PLAYING", GameOver: "GAME_OVER", LevelComplete: "LEVEL_COMPLETE", AllComplete: "ALL_COMPLETE" }[e.state.status] || e.state.status, currentLevel: this.currentLevelIndex + 1, moves: e.state.moves, foodCollected: e.state.food_collected, totalFood: e.state.total_food };
    this.emitEvent({ type: "stateChanged", state: s });
    const o = { segments: e.snake.segments, direction: e.snake.direction };
    this.emitEvent({ type: "snakeChanged", snake: o }), this.emitEvent({ type: "gridDirty" }), s.status === "LEVEL_COMPLETE" && this.handleLevelComplete();
  }
  async handleLevelComplete() {
    this.currentLevelIndex < this.levels.length - 1 && setTimeout(async () => {
      await this.nextLevel();
    }, 1e3);
  }
  processMove(e) {
    if (!this.wasmEngine) {
      console.error("WASM engine not initialized");
      return;
    }
    const r = { NORTH: "North", SOUTH: "South", EAST: "East", WEST: "West", North: "North", South: "South", East: "East", West: "West" }[e];
    if (!r) {
      console.error(`Invalid direction: ${e}`);
      return;
    }
    try {
      this.wasmEngine.processMove(r);
    } catch (s) {
      console.error("Error processing move:", s);
    }
  }
  async nextLevel() {
    this.currentLevelIndex >= this.levels.length - 1 || (this.currentLevelIndex++, await this.loadLevelByIndex(this.currentLevelIndex));
  }
  async resetLevel() {
    await this.loadLevelByIndex(this.currentLevelIndex);
  }
  addEventListener(e) {
    this.listeners.push(e);
  }
  emitEvent(e) {
    for (const t of this.listeners) t(e);
  }
}
var p = ((n) => (n.North = "NORTH", n.South = "SOUTH", n.East = "EAST", n.West = "WEST", n))(p || {}), w = ((n) => (n.Empty = "EMPTY", n.SnakeHead = "SNAKE_HEAD", n.SnakeBody = "SNAKE_BODY", n.Food = "FOOD", n.Obstacle = "OBSTACLE", n.Exit = "EXIT", n))(w || {}), F = ((n) => (n.Playing = "PLAYING", n.GameOver = "GAME_OVER", n.LevelComplete = "LEVEL_COMPLETE", n.AllComplete = "ALL_COMPLETE", n))(F || {});
const D = [];
function Ee(n, e = _) {
  let t;
  const r = /* @__PURE__ */ new Set();
  function s(c) {
    if (v(n, c) && (n = c, t)) {
      const a = !D.length;
      for (const l of r) l[1](), D.push(l, n);
      if (a) {
        for (let l = 0; l < D.length; l += 2) D[l][0](D[l + 1]);
        D.length = 0;
      }
    }
  }
  function o(c) {
    s(c(n));
  }
  function i(c, a = _) {
    const l = [c, a];
    return r.add(l), r.size === 1 && (t = e(s, o) || _), c(n), () => {
      r.delete(l), r.size === 0 && t && (t(), t = null);
    };
  }
  return { set: s, update: o, subscribe: i };
}
const ue = Ee({ status: F.Playing, currentLevel: 1, moves: 0, foodCollected: 0, totalFood: 0 }), Le = Ee({ segments: [], direction: null }), Pe = Ee(null);
function ut(n) {
  n.addEventListener((e) => {
    switch (e.type) {
      case "stateChanged":
        ue.set(e.state);
        break;
      case "snakeChanged":
        Le.set(e.snake);
        break;
      case "levelChanged":
        Pe.set(e.level);
        break;
    }
  });
}
class ft {
  constructor(e) {
    __publicField(this, "keyMap");
    __publicField(this, "boundHandler");
    __publicField(this, "currentStatus", F.Playing);
    __publicField(this, "unsubscribe");
    this.gameEngine = e, this.keyMap = /* @__PURE__ */ new Map([["ArrowUp", p.North], ["ArrowDown", p.South], ["ArrowLeft", p.West], ["ArrowRight", p.East], ["w", p.North], ["s", p.South], ["a", p.West], ["d", p.East], ["W", p.North], ["S", p.South], ["A", p.West], ["D", p.East]]), this.boundHandler = this.handleKeyPress.bind(this), this.unsubscribe = ue.subscribe((t) => {
      this.currentStatus = t.status;
    });
  }
  handleKeyPress(e) {
    if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return;
    const t = e.key, r = t.toLowerCase();
    switch ([" ", "Spacebar", "Tab", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(t) && e.preventDefault(), ["r", "q", "escape", "esc"].includes(r) && e.preventDefault(), this.currentStatus) {
      case F.Playing:
        this.handlePlayingState(e, r);
        break;
      case F.GameOver:
        this.handleGameOverState(e, r);
        break;
      case F.AllComplete:
        this.handleAllCompleteState(e, r);
        break;
    }
  }
  handlePlayingState(e, t) {
    if (t === "r") {
      this.gameEngine.restartLevel();
      return;
    }
    if (t === "q") {
      this.gameEngine.loadLevel(1);
      return;
    }
    if (t === "escape" || t === "esc") return;
    const r = this.keyMap.get(e.key);
    r && (e.defaultPrevented || e.preventDefault(), this.gameEngine.processMove(r));
  }
  handleGameOverState(e, t) {
    t === "q" || t === "escape" || t === "esc" ? this.gameEngine.loadLevel(1) : ["Control", "Shift", "Alt", "Meta", "CapsLock"].includes(e.key) || this.gameEngine.restartLevel();
  }
  handleAllCompleteState(e, t) {
    (t === "r" || t === "q" || t === "escape" || t === "esc") && this.gameEngine.loadLevel(1);
  }
  attach() {
    window.addEventListener("keydown", this.boundHandler);
  }
  detach() {
    window.removeEventListener("keydown", this.boundHandler), this.unsubscribe && this.unsubscribe();
  }
}
function dt(n) {
  let e, t, r, s, o, i = n[0].currentLevel + "", c, a, l, y, m, b, N = n[1].segments.length + "", R, Se, P, ne, ke, V, re = n[0].moves + "", fe;
  return { c() {
    e = g("div"), t = g("div"), r = g("span"), r.textContent = "Level", s = L(), o = g("span"), c = X(i), a = L(), l = g("div"), y = g("span"), y.textContent = "Length", m = L(), b = g("span"), R = X(N), Se = L(), P = g("div"), ne = g("span"), ne.textContent = "Moves", ke = L(), V = g("span"), fe = X(re), f(r, "class", "score-label svelte-1dkg50z"), f(o, "class", "score-value svelte-1dkg50z"), f(o, "data-element-id", "level-display"), f(t, "class", "score-item svelte-1dkg50z"), f(y, "class", "score-label svelte-1dkg50z"), f(b, "class", "score-value svelte-1dkg50z"), f(b, "data-element-id", "length-display"), f(l, "class", "score-item svelte-1dkg50z"), f(ne, "class", "score-label svelte-1dkg50z"), f(V, "class", "score-value svelte-1dkg50z"), f(V, "data-element-id", "moves-display"), f(P, "class", "score-item svelte-1dkg50z"), f(e, "class", "score-info svelte-1dkg50z");
  }, m(z, Y) {
    A(z, e, Y), d(e, t), d(t, r), d(t, s), d(t, o), d(o, c), d(e, a), d(e, l), d(l, y), d(l, m), d(l, b), d(b, R), d(e, Se), d(e, P), d(P, ne), d(P, ke), d(P, V), d(V, fe);
  }, p(z, [Y]) {
    Y & 1 && i !== (i = z[0].currentLevel + "") && de(c, i), Y & 2 && N !== (N = z[1].segments.length + "") && de(R, N), Y & 1 && re !== (re = z[0].moves + "") && de(fe, re);
  }, i: _, o: _, d(z) {
    z && $(e);
  } };
}
function _t(n, e, t) {
  let r, s;
  return ee(n, ue, (o) => t(0, r = o)), ee(n, Le, (o) => t(1, s = o)), [r, s];
}
class gt extends C {
  constructor(e) {
    super(), O(this, e, _t, dt, v, {});
  }
}
function yt(n) {
  let e, t, r;
  return { c() {
    e = g("button"), e.textContent = "Restart", f(e, "class", "restart-btn svelte-11sh8jp"), f(e, "data-element-id", "restart-button");
  }, m(s, o) {
    A(s, e, o), t || (r = me(e, "click", n[0]), t = true);
  }, p: _, i: _, o: _, d(s) {
    s && $(e), t = false, r();
  } };
}
function mt(n) {
  const e = Ge("GAME_ENGINE");
  function t() {
    var _a;
    e.restartLevel(), (_a = document.activeElement) == null ? void 0 : _a.blur();
  }
  return [t];
}
class bt extends C {
  constructor(e) {
    super(), O(this, e, mt, yt, v, {});
  }
}
function ht(n) {
  let e, t, r, s, o;
  return t = new gt({}), s = new bt({}), { c() {
    e = g("div"), I(t.$$.fragment), r = L(), I(s.$$.fragment), f(e, "class", "header svelte-6xj8ba");
  }, m(i, c) {
    A(i, e, c), S(t, e, null), d(e, r), S(s, e, null), o = true;
  }, p: _, i(i) {
    o || (h(t.$$.fragment, i), h(s.$$.fragment, i), o = true);
  }, o(i) {
    x(t.$$.fragment, i), x(s.$$.fragment, i), o = false;
  }, d(i) {
    i && $(e), k(t), k(s);
  } };
}
class xt extends C {
  constructor(e) {
    super(), O(this, e, null, ht, v, {});
  }
}
function pt(n) {
  let e, t;
  return { c() {
    e = g("div"), f(e, "class", t = "cell " + n[0] + " svelte-1663m3o");
  }, m(r, s) {
    A(r, e, s);
  }, p(r, [s]) {
    s & 1 && t !== (t = "cell " + r[0] + " svelte-1663m3o") && f(e, "class", t);
  }, i: _, o: _, d(r) {
    r && $(e);
  } };
}
function wt(n, e, t) {
  let r, { type: s } = e;
  function o(i) {
    switch (i) {
      case w.SnakeHead:
        return "snake-head";
      case w.SnakeBody:
        return "snake-body";
      case w.Food:
        return "food";
      case w.Obstacle:
        return "obstacle";
      case w.Exit:
        return "exit";
      default:
        return "";
    }
  }
  return n.$$set = (i) => {
    "type" in i && t(1, s = i.type);
  }, n.$$.update = () => {
    n.$$.dirty & 2 && t(0, r = o(s));
  }, [r, s];
}
class vt extends C {
  constructor(e) {
    super(), O(this, e, wt, pt, v, { type: 1 });
  }
}
function Me(n, e, t) {
  const r = n.slice();
  return r[4] = e[t], r;
}
function Te(n) {
  let e, t;
  return e = new vt({ props: { type: n[3](n[4], n[0], n[1]) } }), { c() {
    I(e.$$.fragment);
  }, m(r, s) {
    S(e, r, s), t = true;
  }, p(r, s) {
    const o = {};
    s & 3 && (o.type = r[3](r[4], r[0], r[1])), e.$set(o);
  }, i(r) {
    t || (h(e.$$.fragment, r), t = true);
  }, o(r) {
    x(e.$$.fragment, r), t = false;
  }, d(r) {
    k(e, r);
  } };
}
function $t(n) {
  let e, t, r = Ce(n[2]), s = [];
  for (let i = 0; i < r.length; i += 1) s[i] = Te(Me(n, r, i));
  const o = (i) => x(s[i], 1, 1, () => {
    s[i] = null;
  });
  return { c() {
    e = g("div");
    for (let i = 0; i < s.length; i += 1) s[i].c();
    f(e, "class", "game-field svelte-179gkcr"), f(e, "data-element-id", "game-field");
  }, m(i, c) {
    A(i, e, c);
    for (let a = 0; a < s.length; a += 1) s[a] && s[a].m(e, null);
    t = true;
  }, p(i, [c]) {
    if (c & 15) {
      r = Ce(i[2]);
      let a;
      for (a = 0; a < r.length; a += 1) {
        const l = Me(i, r, a);
        s[a] ? (s[a].p(l, c), h(s[a], 1)) : (s[a] = Te(l), s[a].c(), h(s[a], 1), s[a].m(e, null));
      }
      for (ve(), a = r.length; a < s.length; a += 1) o(a);
      $e();
    }
  }, i(i) {
    if (!t) {
      for (let c = 0; c < r.length; c += 1) h(s[c]);
      t = true;
    }
  }, o(i) {
    s = s.filter(Boolean);
    for (let c = 0; c < s.length; c += 1) x(s[c]);
    t = false;
  }, d(i) {
    i && $(e), je(s, i);
  } };
}
const ye = 15, Et = 15;
function Lt(n, e, t) {
  let r, s;
  ee(n, Pe, (c) => t(0, r = c)), ee(n, Le, (c) => t(1, s = c));
  const o = Array.from({ length: ye * Et }, (c, a) => a);
  function i(c, a, l) {
    if (!a) return w.Empty;
    const y = c % ye, m = Math.floor(c / ye);
    if (l.segments.length > 0 && l.segments[0].x === y && l.segments[0].y === m) return w.SnakeHead;
    for (let b = 1; b < l.segments.length; b++) if (l.segments[b].x === y && l.segments[b].y === m) return w.SnakeBody;
    return a.food && a.food.some((b) => b.x === y && b.y === m) ? w.Food : a.obstacles && a.obstacles.some((b) => b.x === y && b.y === m) ? w.Obstacle : a.exit && a.exit.x === y && a.exit.y === m ? w.Exit : w.Empty;
  }
  return [r, s, o, i];
}
class St extends C {
  constructor(e) {
    super(), O(this, e, Lt, $t, v, {});
  }
}
function kt(n) {
  let e, t, r, s, o, i, c, a, l;
  return { c() {
    e = g("div"), t = g("h2"), t.textContent = "Game Over", r = L(), s = g("div"), o = g("button"), o.textContent = "Restart Level", i = L(), c = g("button"), c.textContent = "Back to Level 1", f(t, "class", "svelte-r80wre"), f(o, "class", "modal-btn primary svelte-r80wre"), f(o, "data-element-id", "restart-level-btn"), f(c, "class", "modal-btn secondary svelte-r80wre"), f(c, "data-element-id", "back-to-level1-btn"), f(s, "class", "modal-buttons svelte-r80wre"), f(e, "class", "modal svelte-r80wre");
  }, m(y, m) {
    A(y, e, m), d(e, t), d(e, r), d(e, s), d(s, o), n[3](o), d(s, i), d(s, c), a || (l = [me(o, "click", n[1]), me(c, "click", n[2])], a = true);
  }, p: _, i: _, o: _, d(y) {
    y && $(e), n[3](null), a = false, q(l);
  } };
}
function At(n, e, t) {
  const r = Ge("GAME_ENGINE");
  let s;
  We(() => {
    s == null ? void 0 : s.focus();
  });
  function o() {
    r.restartLevel();
  }
  function i() {
    r.loadLevel(1);
  }
  function c(a) {
    be[a ? "unshift" : "push"](() => {
      s = a, t(0, s);
    });
  }
  return [s, o, i, c];
}
class Ot extends C {
  constructor(e) {
    super(), O(this, e, At, kt, v, {});
  }
}
function Ct(n) {
  let e;
  return { c() {
    e = g("div"), e.innerHTML = '<h2 class="svelte-q2s5gm">All Levels Complete!</h2> <p style="margin: 15px 0; color: #666;">Congratulations! You&#39;ve beaten all levels.</p> <p style="font-size: 12px; color: #999;">Refresh the page to play again.</p>', f(e, "class", "modal svelte-q2s5gm");
  }, m(t, r) {
    A(t, e, r);
  }, p: _, i: _, o: _, d(t) {
    t && $(e);
  } };
}
class It extends C {
  constructor(e) {
    super(), O(this, e, null, Ct, v, {});
  }
}
function Fe(n) {
  let e, t, r, s;
  const o = [Tt, Mt], i = [];
  function c(a, l) {
    return a[1] ? 0 : a[0] ? 1 : -1;
  }
  return ~(t = c(n)) && (r = i[t] = o[t](n)), { c() {
    e = g("div"), r && r.c(), f(e, "class", "overlay active svelte-16e68es"), f(e, "data-element-id", "overlay");
  }, m(a, l) {
    A(a, e, l), ~t && i[t].m(e, null), s = true;
  }, p(a, l) {
    let y = t;
    t = c(a), t !== y && (r && (ve(), x(i[y], 1, 1, () => {
      i[y] = null;
    }), $e()), ~t ? (r = i[t], r || (r = i[t] = o[t](a), r.c()), h(r, 1), r.m(e, null)) : r = null);
  }, i(a) {
    s || (h(r), s = true);
  }, o(a) {
    x(r), s = false;
  }, d(a) {
    a && $(e), ~t && i[t].d();
  } };
}
function Mt(n) {
  let e, t;
  return e = new It({}), { c() {
    I(e.$$.fragment);
  }, m(r, s) {
    S(e, r, s), t = true;
  }, i(r) {
    t || (h(e.$$.fragment, r), t = true);
  }, o(r) {
    x(e.$$.fragment, r), t = false;
  }, d(r) {
    k(e, r);
  } };
}
function Tt(n) {
  let e, t;
  return e = new Ot({}), { c() {
    I(e.$$.fragment);
  }, m(r, s) {
    S(e, r, s), t = true;
  }, i(r) {
    t || (h(e.$$.fragment, r), t = true);
  }, o(r) {
    x(e.$$.fragment, r), t = false;
  }, d(r) {
    k(e, r);
  } };
}
function Ft(n) {
  let e, t, r = n[2] && Fe(n);
  return { c() {
    r && r.c(), e = Ue();
  }, m(s, o) {
    r && r.m(s, o), A(s, e, o), t = true;
  }, p(s, [o]) {
    s[2] ? r ? (r.p(s, o), o & 4 && h(r, 1)) : (r = Fe(s), r.c(), h(r, 1), r.m(e.parentNode, e)) : r && (ve(), x(r, 1, 1, () => {
      r = null;
    }), $e());
  }, i(s) {
    t || (h(r), t = true);
  }, o(s) {
    x(r), t = false;
  }, d(s) {
    s && $(e), r && r.d(s);
  } };
}
function Nt(n, e, t) {
  let r, s, o, i;
  return ee(n, ue, (c) => t(3, i = c)), n.$$.update = () => {
    n.$$.dirty & 8 && t(1, r = i.status === F.GameOver), n.$$.dirty & 8 && t(0, s = i.status === F.AllComplete), n.$$.dirty & 3 && t(2, o = r || s);
  }, [s, r, o, i];
}
class zt extends C {
  constructor(e) {
    super(), O(this, e, Nt, Ft, v, {});
  }
}
function Wt(n) {
  let e, t, r, s, o, i, c;
  return t = new xt({}), s = new St({}), i = new zt({}), { c() {
    e = g("div"), I(t.$$.fragment), r = L(), I(s.$$.fragment), o = L(), I(i.$$.fragment), f(e, "class", "game-container svelte-1t5xe4u");
  }, m(a, l) {
    A(a, e, l), S(t, e, null), d(e, r), S(s, e, null), d(e, o), S(i, e, null), c = true;
  }, p: _, i(a) {
    c || (h(t.$$.fragment, a), h(s.$$.fragment, a), h(i.$$.fragment, a), c = true);
  }, o(a) {
    x(t.$$.fragment, a), x(s.$$.fragment, a), x(i.$$.fragment, a), c = false;
  }, d(a) {
    a && $(e), k(t), k(s), k(i);
  } };
}
class Gt extends C {
  constructor(e) {
    super(), O(this, e, null, Wt, v, {});
  }
}
const Rt = [{ id: 1, name: "First Steps", gridSize: { width: 15, height: 15 }, snake: [{ x: 2, y: 13 }, { x: 1, y: 13 }, { x: 0, y: 13 }], obstacles: [{ x: 0, y: 14 }, { x: 1, y: 14 }, { x: 2, y: 14 }, { x: 3, y: 14 }, { x: 4, y: 14 }, { x: 5, y: 14 }, { x: 6, y: 14 }, { x: 7, y: 14 }, { x: 8, y: 14 }, { x: 9, y: 14 }, { x: 10, y: 14 }, { x: 11, y: 14 }, { x: 12, y: 14 }, { x: 13, y: 14 }, { x: 14, y: 14 }], food: [{ x: 7, y: 13 }], exit: { x: 13, y: 13 } }, { id: 2, name: "The Drop", gridSize: { width: 15, height: 15 }, snake: [{ x: 2, y: 2 }, { x: 1, y: 2 }, { x: 0, y: 2 }], obstacles: [{ x: 0, y: 3 }, { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 7 }, { x: 5, y: 7 }, { x: 6, y: 7 }, { x: 8, y: 10 }, { x: 9, y: 10 }, { x: 10, y: 10 }, { x: 0, y: 14 }, { x: 1, y: 14 }, { x: 2, y: 14 }, { x: 3, y: 14 }, { x: 4, y: 14 }, { x: 5, y: 14 }, { x: 6, y: 14 }, { x: 7, y: 14 }, { x: 8, y: 14 }, { x: 9, y: 14 }, { x: 10, y: 14 }, { x: 11, y: 14 }, { x: 12, y: 14 }, { x: 13, y: 14 }, { x: 14, y: 14 }], food: [{ x: 5, y: 6 }], exit: { x: 13, y: 13 } }, { id: 3, name: "The Wall", gridSize: { width: 15, height: 15 }, snake: [{ x: 2, y: 13 }, { x: 1, y: 13 }, { x: 0, y: 13 }], obstacles: [{ x: 7, y: 14 }, { x: 7, y: 13 }, { x: 7, y: 12 }, { x: 7, y: 11 }, { x: 7, y: 10 }, { x: 7, y: 9 }, { x: 7, y: 8 }, { x: 7, y: 7 }, { x: 0, y: 14 }, { x: 1, y: 14 }, { x: 2, y: 14 }, { x: 3, y: 14 }, { x: 4, y: 14 }, { x: 5, y: 14 }, { x: 6, y: 14 }, { x: 8, y: 14 }, { x: 9, y: 14 }, { x: 10, y: 14 }, { x: 11, y: 14 }, { x: 12, y: 14 }, { x: 13, y: 14 }, { x: 14, y: 14 }], food: [{ x: 3, y: 13 }, { x: 4, y: 13 }, { x: 5, y: 13 }, { x: 3, y: 12 }, { x: 4, y: 12 }], exit: { x: 13, y: 13 } }, { id: 4, name: "Zig Zag", gridSize: { width: 15, height: 15 }, snake: [{ x: 1, y: 1 }, { x: 0, y: 1 }, { x: 0, y: 2 }], obstacles: [{ x: 0, y: 3 }, { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 6, y: 3 }, { x: 7, y: 3 }, { x: 8, y: 3 }, { x: 9, y: 3 }, { x: 10, y: 3 }, { x: 4, y: 6 }, { x: 5, y: 6 }, { x: 6, y: 6 }, { x: 7, y: 6 }, { x: 8, y: 6 }, { x: 9, y: 6 }, { x: 10, y: 6 }, { x: 11, y: 6 }, { x: 12, y: 6 }, { x: 13, y: 6 }, { x: 14, y: 6 }, { x: 0, y: 9 }, { x: 1, y: 9 }, { x: 2, y: 9 }, { x: 3, y: 9 }, { x: 4, y: 9 }, { x: 5, y: 9 }, { x: 6, y: 9 }, { x: 7, y: 9 }, { x: 8, y: 9 }, { x: 9, y: 9 }, { x: 10, y: 9 }, { x: 4, y: 12 }, { x: 5, y: 12 }, { x: 6, y: 12 }, { x: 7, y: 12 }, { x: 8, y: 12 }, { x: 9, y: 12 }, { x: 10, y: 12 }, { x: 11, y: 12 }, { x: 12, y: 12 }, { x: 13, y: 12 }, { x: 14, y: 12 }, { x: 0, y: 14 }, { x: 1, y: 14 }, { x: 2, y: 14 }, { x: 3, y: 14 }, { x: 4, y: 14 }, { x: 5, y: 14 }, { x: 6, y: 14 }, { x: 7, y: 14 }, { x: 8, y: 14 }, { x: 9, y: 14 }, { x: 10, y: 14 }, { x: 11, y: 14 }, { x: 12, y: 14 }, { x: 13, y: 14 }, { x: 14, y: 14 }], food: [{ x: 13, y: 2 }, { x: 1, y: 5 }, { x: 13, y: 8 }, { x: 1, y: 11 }], exit: { x: 0, y: 13 } }, { id: 5, name: "The Tower", gridSize: { width: 15, height: 15 }, snake: [{ x: 1, y: 13 }, { x: 0, y: 13 }, { x: 0, y: 12 }], obstacles: [{ x: 7, y: 14 }, { x: 7, y: 13 }, { x: 7, y: 12 }, { x: 7, y: 11 }, { x: 7, y: 10 }, { x: 7, y: 9 }, { x: 7, y: 8 }, { x: 7, y: 7 }, { x: 7, y: 6 }, { x: 7, y: 5 }, { x: 7, y: 4 }, { x: 5, y: 10 }, { x: 6, y: 10 }, { x: 8, y: 7 }, { x: 9, y: 7 }, { x: 5, y: 4 }, { x: 6, y: 4 }, { x: 0, y: 14 }, { x: 1, y: 14 }, { x: 2, y: 14 }, { x: 3, y: 14 }, { x: 4, y: 14 }, { x: 5, y: 14 }, { x: 6, y: 14 }, { x: 8, y: 14 }, { x: 9, y: 14 }, { x: 10, y: 14 }, { x: 11, y: 14 }, { x: 12, y: 14 }, { x: 13, y: 14 }, { x: 14, y: 14 }], food: [{ x: 3, y: 13 }, { x: 4, y: 13 }, { x: 5, y: 9 }, { x: 9, y: 6 }], exit: { x: 7, y: 3 } }];
function Pt(n) {
  let e, t;
  return e = new Gt({}), { c() {
    I(e.$$.fragment);
  }, m(r, s) {
    S(e, r, s), t = true;
  }, p: _, i(r) {
    t || (h(e.$$.fragment, r), t = true);
  }, o(r) {
    x(e.$$.fragment, r), t = false;
  }, d(r) {
    k(e, r);
  } };
}
function Bt(n) {
  const e = new lt();
  Ve("GAME_ENGINE", e);
  let t;
  return We(async () => {
    const r = Rt, s = new URLSearchParams(window.location.search), o = parseInt(s.get("level") || "1", 10);
    ut(e), await e.init(r, o), t = new ft(e), t.attach();
  }), qe(() => {
    t && t.detach();
  }), [];
}
class Dt extends C {
  constructor(e) {
    super(), O(this, e, Bt, Pt, v, {});
  }
}
new Dt({ target: document.getElementById("app") });
