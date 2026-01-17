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
function Te(n) {
  return n();
}
function Ae() {
  return /* @__PURE__ */ Object.create(null);
}
function q(n) {
  n.forEach(Te);
}
function Ge(n) {
  return typeof n == "function";
}
function $(n, e) {
  return n != n ? e == e : n !== e || n && typeof n == "object" || typeof n == "function";
}
function Be(n) {
  return Object.keys(n).length === 0;
}
function je(n, ...e) {
  if (n == null) {
    for (const r of e) r(void 0);
    return _;
  }
  const t = n.subscribe(...e);
  return t.unsubscribe ? () => t.unsubscribe() : t;
}
function ee(n, e, t) {
  n.$$.on_destroy.push(je(e, t));
}
function d(n, e) {
  n.appendChild(e);
}
function O(n, e, t) {
  n.insertBefore(e, t || null);
}
function E(n) {
  n.parentNode && n.parentNode.removeChild(n);
}
function De(n, e) {
  for (let t = 0; t < n.length; t += 1) n[t] && n[t].d(e);
}
function g(n) {
  return document.createElement(n);
}
function X(n) {
  return document.createTextNode(n);
}
function S() {
  return X(" ");
}
function Ue() {
  return X("");
}
function be(n, e, t, r) {
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
function J(n) {
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
function Re(n) {
  return le().$$.context.get(n);
}
const D = [], he = [];
let H = [];
const Oe = [], Ye = Promise.resolve();
let pe = false;
function Ke() {
  pe || (pe = true, Ye.then(ze));
}
function we(n) {
  H.push(n);
}
const _e = /* @__PURE__ */ new Set();
let B = 0;
function ze() {
  if (B !== 0) return;
  const n = te;
  do {
    try {
      for (; B < D.length; ) {
        const e = D[B];
        B++, J(e), Xe(e.$$);
      }
    } catch (e) {
      throw D.length = 0, B = 0, e;
    }
    for (J(null), D.length = 0, B = 0; he.length; ) he.pop()();
    for (let e = 0; e < H.length; e += 1) {
      const t = H[e];
      _e.has(t) || (_e.add(t), t());
    }
    H.length = 0;
  } while (D.length);
  for (; Oe.length; ) Oe.pop()();
  pe = false, _e.clear(), J(n);
}
function Xe(n) {
  if (n.fragment !== null) {
    n.update(), q(n.before_update);
    const e = n.dirty;
    n.dirty = [-1], n.fragment && n.fragment.p(n.ctx, e), n.after_update.forEach(we);
  }
}
function Je(n) {
  const e = [], t = [];
  H.forEach((r) => n.indexOf(r) === -1 ? e.push(r) : t.push(r)), t.forEach((r) => r()), H = e;
}
const ce = /* @__PURE__ */ new Set();
let R;
function $e() {
  R = { r: 0, c: [], p: R };
}
function Ee() {
  R.r || q(R.c), R = R.p;
}
function p(n, e) {
  n && n.i && (ce.delete(n), n.i(e));
}
function w(n, e, t, r) {
  if (n && n.o) {
    if (ce.has(n)) return;
    ce.add(n), R.c.push(() => {
      ce.delete(n), r && (t && n.d(1), r());
    }), n.o(e);
  } else r && r();
}
function Ce(n) {
  return (n == null ? void 0 : n.length) !== void 0 ? n : Array.from(n);
}
function M(n) {
  n && n.c();
}
function k(n, e, t) {
  const { fragment: r, after_update: s } = n.$$;
  r && r.m(e, t), we(() => {
    const o = n.$$.on_mount.map(Te).filter(Ge);
    n.$$.on_destroy ? n.$$.on_destroy.push(...o) : q(o), n.$$.on_mount = [];
  }), s.forEach(we);
}
function A(n, e) {
  const t = n.$$;
  t.fragment !== null && (Je(t.after_update), q(t.on_destroy), t.fragment && t.fragment.d(e), t.on_destroy = t.fragment = null, t.ctx = []);
}
function Qe(n, e) {
  n.$$.dirty[0] === -1 && (D.push(n), Ke(), n.$$.dirty.fill(0)), n.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function C(n, e, t, r, s, o, i = null, a = [-1]) {
  const c = te;
  J(n);
  const l = n.$$ = { fragment: null, ctx: [], props: o, update: _, not_equal: s, bound: Ae(), on_mount: [], on_destroy: [], on_disconnect: [], before_update: [], after_update: [], context: new Map(e.context || (c ? c.$$.context : [])), callbacks: Ae(), dirty: a, skip_bound: false, root: e.target || c.$$.root };
  i && i(l.root);
  let m = false;
  if (l.ctx = t ? t(n, e.props || {}, (b, h, ...T) => {
    const z = T.length ? T[0] : h;
    return l.ctx && s(l.ctx[b], l.ctx[b] = z) && (!l.skip_bound && l.bound[b] && l.bound[b](z), m && Qe(n, b)), h;
  }) : [], l.update(), m = true, q(l.before_update), l.fragment = r ? r(l.ctx) : false, e.target) {
    if (e.hydrate) {
      const b = He(e.target);
      l.fragment && l.fragment.l(b), b.forEach(E);
    } else l.fragment && l.fragment.c();
    e.intro && p(n.$$.fragment), k(n, e.target, e.anchor), ze();
  }
  J(c);
}
class I {
  constructor() {
    __publicField(this, "$$");
    __publicField(this, "$$set");
  }
  $destroy() {
    A(this, 1), this.$destroy = _;
  }
  $on(e, t) {
    if (!Ge(t)) return _;
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
const Ze = "4";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(Ze);
let ye = class {
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
    if (e[2]) throw L(e[1]);
    return L(e[0]);
  }
  getGameState() {
    const e = u.wasmgameengine_getGameState(this.__wbg_ptr);
    if (e[2]) throw L(e[1]);
    return L(e[0]);
  }
  getLevel() {
    const e = u.wasmgameengine_getLevel(this.__wbg_ptr);
    if (e[2]) throw L(e[1]);
    return L(e[0]);
  }
  constructor(e) {
    const t = u.wasmgameengine_new(e);
    if (t[2]) throw L(t[1]);
    return this.__wbg_ptr = t[0] >>> 0, Ie.register(this, this.__wbg_ptr, this), this;
  }
  onFrame(e) {
    u.wasmgameengine_onFrame(this.__wbg_ptr, e);
  }
  processMove(e) {
    const t = U(e, u.__wbindgen_malloc, u.__wbindgen_realloc), r = F, s = u.wasmgameengine_processMove(this.__wbg_ptr, t, r);
    if (s[2]) throw L(s[1]);
    return s[0] !== 0;
  }
};
Symbol.dispose && (ye.prototype[Symbol.dispose] = ye.prototype.free);
function et() {
  const n = u.getLevels();
  if (n[2]) throw L(n[1]);
  return L(n[0]);
}
function tt(n) {
  const e = U(n, u.__wbindgen_malloc, u.__wbindgen_realloc), t = F;
  u.log(e, t);
}
function nt() {
  return { __proto__: null, "./gsnake_wasm_bg.js": { __proto__: null, __wbg_Error_8c4e43fe74559d73: function(e, t) {
    return Error(se(e, t));
  }, __wbg_Number_04624de7d0e8332d: function(e) {
    return Number(e);
  }, __wbg_String_8f0eb39a4a4c2f66: function(e, t) {
    const r = String(t), s = U(r, u.__wbindgen_malloc, u.__wbindgen_realloc), o = F;
    x().setInt32(e + 4, o, true), x().setInt32(e + 0, s, true);
  }, __wbg___wbindgen_boolean_get_bbbb1c18aa2f5e25: function(e) {
    const t = e, r = typeof t == "boolean" ? t : void 0;
    return oe(r) ? 16777215 : r ? 1 : 0;
  }, __wbg___wbindgen_debug_string_0bc8482c6e3508ae: function(e, t) {
    const r = ve(t), s = U(r, u.__wbindgen_malloc, u.__wbindgen_realloc), o = F;
    x().setInt32(e + 4, o, true), x().setInt32(e + 0, s, true);
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
    x().setFloat64(e + 8, oe(s) ? 0 : s, true), x().setInt32(e + 0, !oe(s), true);
  }, __wbg___wbindgen_string_get_72fb696202c56729: function(e, t) {
    const r = t, s = typeof r == "string" ? r : void 0;
    var o = oe(s) ? 0 : U(s, u.__wbindgen_malloc, u.__wbindgen_realloc), i = F;
    x().setInt32(e + 4, i, true), x().setInt32(e + 0, o, true);
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
    Uint8Array.prototype.set.call(st(e, t), r);
  }, __wbg_set_3f1d0b984ed272ed: function(e, t, r) {
    e[t] = r;
  }, __wbg_set_f43e577aea94465b: function(e, t, r) {
    e[t >>> 0] = r;
  }, __wbg_stack_0ed75d68575b0f3c: function(e, t) {
    const r = t.stack, s = U(r, u.__wbindgen_malloc, u.__wbindgen_realloc), o = F;
    x().setInt32(e + 4, o, true), x().setInt32(e + 0, s, true);
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
function rt(n) {
  const e = u.__externref_table_alloc();
  return u.__wbindgen_externrefs.set(e, n), e;
}
function ve(n) {
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
    s > 0 && (o += ve(n[0]));
    for (let i = 1; i < s; i++) o += ", " + ve(n[i]);
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
function st(n, e) {
  return n = n >>> 0, Q().subarray(n / 1, n / 1 + e);
}
let W = null;
function x() {
  return (W === null || W.buffer.detached === true || W.buffer.detached === void 0 && W.buffer !== u.memory.buffer) && (W = new DataView(u.memory.buffer)), W;
}
function se(n, e) {
  return n = n >>> 0, ot(n, e);
}
let K = null;
function Q() {
  return (K === null || K.byteLength === 0) && (K = new Uint8Array(u.memory.buffer)), K;
}
function ie(n, e) {
  try {
    return n.apply(this, e);
  } catch (t) {
    const r = rt(t);
    u.__wbindgen_exn_store(r);
  }
}
function oe(n) {
  return n == null;
}
function U(n, e, t) {
  if (t === void 0) {
    const a = Z.encode(n), c = e(a.length, 1) >>> 0;
    return Q().subarray(c, c + a.length).set(a), F = a.length, c;
  }
  let r = n.length, s = e(r, 1) >>> 0;
  const o = Q();
  let i = 0;
  for (; i < r; i++) {
    const a = n.charCodeAt(i);
    if (a > 127) break;
    o[s + i] = a;
  }
  if (i !== r) {
    i !== 0 && (n = n.slice(i)), s = t(s, r, r = i + n.length * 3, 1) >>> 0;
    const a = Q().subarray(s + i, s + r), c = Z.encodeInto(n, a);
    i += c.written, s = t(s, r, i, 1) >>> 0;
  }
  return F = i, s;
}
function L(n) {
  const e = u.__wbindgen_externrefs.get(n);
  return u.__externref_table_dealloc(n), e;
}
let ae = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
ae.decode();
const it = 2146435072;
let ge = 0;
function ot(n, e) {
  return ge += e, ge >= it && (ae = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true }), ae.decode(), ge = e), ae.decode(Q().subarray(n, n + e));
}
const Z = new TextEncoder();
"encodeInto" in Z || (Z.encodeInto = function(n, e) {
  const t = Z.encode(n);
  return e.set(t), { read: n.length, written: t.length };
});
let F = 0, u;
function ct(n, e) {
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
async function lt(n) {
  if (u !== void 0) return u;
  n !== void 0 && (Object.getPrototypeOf(n) === Object.prototype ? { module_or_path: n } = n : console.warn("using deprecated parameters for the initialization function; pass a single object instead")), n === void 0 && (n = new URL("/gSnake/main/assets/gsnake_wasm_bg-DBwVCiF8.wasm", import.meta.url));
  const e = nt();
  (typeof n == "string" || typeof Request == "function" && n instanceof Request || typeof URL == "function" && n instanceof URL) && (n = fetch(n));
  const { instance: t, module: r } = await at(await n, e);
  return ct(t);
}
class ut {
  constructor() {
    __publicField(this, "wasmEngine", null);
    __publicField(this, "listeners", []);
    __publicField(this, "initialized", false);
    __publicField(this, "levels", []);
    __publicField(this, "currentLevelIndex", 0);
  }
  async init(e = null, t = 1) {
    if (this.initialized) {
      console.warn("WasmGameEngine already initialized");
      return;
    }
    await lt(), tt("gSnake WASM engine initialized"), this.levels = e ?? et(), this.currentLevelIndex = t - 1, await this.loadLevelByIndex(this.currentLevelIndex), this.initialized = true;
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
    this.wasmEngine = new ye(r), this.wasmEngine.onFrame((s) => {
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
var y = ((n) => (n.North = "NORTH", n.South = "SOUTH", n.East = "EAST", n.West = "WEST", n))(y || {}), v = ((n) => (n.Empty = "EMPTY", n.SnakeHead = "SNAKE_HEAD", n.SnakeBody = "SNAKE_BODY", n.Food = "FOOD", n.Obstacle = "OBSTACLE", n.Exit = "EXIT", n))(v || {}), N = ((n) => (n.Playing = "PLAYING", n.GameOver = "GAME_OVER", n.LevelComplete = "LEVEL_COMPLETE", n.AllComplete = "ALL_COMPLETE", n))(N || {});
const j = [];
function xe(n, e = _) {
  let t;
  const r = /* @__PURE__ */ new Set();
  function s(a) {
    if ($(n, a) && (n = a, t)) {
      const c = !j.length;
      for (const l of r) l[1](), j.push(l, n);
      if (c) {
        for (let l = 0; l < j.length; l += 2) j[l][0](j[l + 1]);
        j.length = 0;
      }
    }
  }
  function o(a) {
    s(a(n));
  }
  function i(a, c = _) {
    const l = [a, c];
    return r.add(l), r.size === 1 && (t = e(s, o) || _), a(n), () => {
      r.delete(l), r.size === 0 && t && (t(), t = null);
    };
  }
  return { set: s, update: o, subscribe: i };
}
const ue = xe({ status: N.Playing, currentLevel: 1, moves: 0, foodCollected: 0, totalFood: 0 }), Le = xe({ segments: [], direction: null }), Pe = xe(null);
function ft(n) {
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
class dt {
  constructor(e) {
    __publicField(this, "keyMap");
    __publicField(this, "boundHandler");
    __publicField(this, "currentStatus", N.Playing);
    __publicField(this, "unsubscribe");
    this.gameEngine = e, this.keyMap = /* @__PURE__ */ new Map([["ArrowUp", y.North], ["ArrowDown", y.South], ["ArrowLeft", y.West], ["ArrowRight", y.East], ["w", y.North], ["s", y.South], ["a", y.West], ["d", y.East], ["W", y.North], ["S", y.South], ["A", y.West], ["D", y.East]]), this.boundHandler = this.handleKeyPress.bind(this), this.unsubscribe = ue.subscribe((t) => {
      this.currentStatus = t.status;
    });
  }
  handleKeyPress(e) {
    if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return;
    const t = e.key, r = t.toLowerCase();
    switch ([" ", "Spacebar", "Tab", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(t) && e.preventDefault(), ["r", "q", "escape", "esc"].includes(r) && e.preventDefault(), this.currentStatus) {
      case N.Playing:
        this.handlePlayingState(e, r);
        break;
      case N.GameOver:
        this.handleGameOverState(e, r);
        break;
      case N.AllComplete:
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
function _t(n) {
  let e, t, r, s, o, i = n[0].currentLevel + "", a, c, l, m, b, h, T = n[1].segments.length + "", z, Se, P, ne, ke, V, re = n[0].moves + "", fe;
  return { c() {
    e = g("div"), t = g("div"), r = g("span"), r.textContent = "Level", s = S(), o = g("span"), a = X(i), c = S(), l = g("div"), m = g("span"), m.textContent = "Length", b = S(), h = g("span"), z = X(T), Se = S(), P = g("div"), ne = g("span"), ne.textContent = "Moves", ke = S(), V = g("span"), fe = X(re), f(r, "class", "score-label svelte-1dkg50z"), f(o, "class", "score-value svelte-1dkg50z"), f(o, "data-element-id", "level-display"), f(t, "class", "score-item svelte-1dkg50z"), f(m, "class", "score-label svelte-1dkg50z"), f(h, "class", "score-value svelte-1dkg50z"), f(h, "data-element-id", "length-display"), f(l, "class", "score-item svelte-1dkg50z"), f(ne, "class", "score-label svelte-1dkg50z"), f(V, "class", "score-value svelte-1dkg50z"), f(V, "data-element-id", "moves-display"), f(P, "class", "score-item svelte-1dkg50z"), f(e, "class", "score-info svelte-1dkg50z");
  }, m(G, Y) {
    O(G, e, Y), d(e, t), d(t, r), d(t, s), d(t, o), d(o, a), d(e, c), d(e, l), d(l, m), d(l, b), d(l, h), d(h, z), d(e, Se), d(e, P), d(P, ne), d(P, ke), d(P, V), d(V, fe);
  }, p(G, [Y]) {
    Y & 1 && i !== (i = G[0].currentLevel + "") && de(a, i), Y & 2 && T !== (T = G[1].segments.length + "") && de(z, T), Y & 1 && re !== (re = G[0].moves + "") && de(fe, re);
  }, i: _, o: _, d(G) {
    G && E(e);
  } };
}
function gt(n, e, t) {
  let r, s;
  return ee(n, ue, (o) => t(0, r = o)), ee(n, Le, (o) => t(1, s = o)), [r, s];
}
class mt extends I {
  constructor(e) {
    super(), C(this, e, gt, _t, $, {});
  }
}
function bt(n) {
  let e, t, r;
  return { c() {
    e = g("button"), e.textContent = "Restart", f(e, "class", "restart-btn svelte-11sh8jp"), f(e, "data-element-id", "restart-button");
  }, m(s, o) {
    O(s, e, o), t || (r = be(e, "click", n[0]), t = true);
  }, p: _, i: _, o: _, d(s) {
    s && E(e), t = false, r();
  } };
}
function ht(n) {
  const e = Re("GAME_ENGINE");
  function t() {
    var _a;
    e.restartLevel(), (_a = document.activeElement) == null ? void 0 : _a.blur();
  }
  return [t];
}
class pt extends I {
  constructor(e) {
    super(), C(this, e, ht, bt, $, {});
  }
}
function wt(n) {
  let e, t, r, s, o;
  return t = new mt({}), s = new pt({}), { c() {
    e = g("div"), M(t.$$.fragment), r = S(), M(s.$$.fragment), f(e, "class", "header svelte-6xj8ba");
  }, m(i, a) {
    O(i, e, a), k(t, e, null), d(e, r), k(s, e, null), o = true;
  }, p: _, i(i) {
    o || (p(t.$$.fragment, i), p(s.$$.fragment, i), o = true);
  }, o(i) {
    w(t.$$.fragment, i), w(s.$$.fragment, i), o = false;
  }, d(i) {
    i && E(e), A(t), A(s);
  } };
}
class yt extends I {
  constructor(e) {
    super(), C(this, e, null, wt, $, {});
  }
}
function vt(n) {
  let e, t;
  return { c() {
    e = g("div"), f(e, "class", t = "cell " + n[0] + " svelte-1663m3o");
  }, m(r, s) {
    O(r, e, s);
  }, p(r, [s]) {
    s & 1 && t !== (t = "cell " + r[0] + " svelte-1663m3o") && f(e, "class", t);
  }, i: _, o: _, d(r) {
    r && E(e);
  } };
}
function $t(n, e, t) {
  let r, { type: s } = e;
  function o(i) {
    switch (i) {
      case v.SnakeHead:
        return "snake-head";
      case v.SnakeBody:
        return "snake-body";
      case v.Food:
        return "food";
      case v.Obstacle:
        return "obstacle";
      case v.Exit:
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
class Et extends I {
  constructor(e) {
    super(), C(this, e, $t, vt, $, { type: 1 });
  }
}
function Me(n, e, t) {
  const r = n.slice();
  return r[4] = e[t], r;
}
function Fe(n) {
  let e, t;
  return e = new Et({ props: { type: n[3](n[4], n[0], n[1]) } }), { c() {
    M(e.$$.fragment);
  }, m(r, s) {
    k(e, r, s), t = true;
  }, p(r, s) {
    const o = {};
    s & 3 && (o.type = r[3](r[4], r[0], r[1])), e.$set(o);
  }, i(r) {
    t || (p(e.$$.fragment, r), t = true);
  }, o(r) {
    w(e.$$.fragment, r), t = false;
  }, d(r) {
    A(e, r);
  } };
}
function xt(n) {
  let e, t, r = Ce(n[2]), s = [];
  for (let i = 0; i < r.length; i += 1) s[i] = Fe(Me(n, r, i));
  const o = (i) => w(s[i], 1, 1, () => {
    s[i] = null;
  });
  return { c() {
    e = g("div");
    for (let i = 0; i < s.length; i += 1) s[i].c();
    f(e, "class", "game-field svelte-179gkcr"), f(e, "data-element-id", "game-field");
  }, m(i, a) {
    O(i, e, a);
    for (let c = 0; c < s.length; c += 1) s[c] && s[c].m(e, null);
    t = true;
  }, p(i, [a]) {
    if (a & 15) {
      r = Ce(i[2]);
      let c;
      for (c = 0; c < r.length; c += 1) {
        const l = Me(i, r, c);
        s[c] ? (s[c].p(l, a), p(s[c], 1)) : (s[c] = Fe(l), s[c].c(), p(s[c], 1), s[c].m(e, null));
      }
      for ($e(), c = r.length; c < s.length; c += 1) o(c);
      Ee();
    }
  }, i(i) {
    if (!t) {
      for (let a = 0; a < r.length; a += 1) p(s[a]);
      t = true;
    }
  }, o(i) {
    s = s.filter(Boolean);
    for (let a = 0; a < s.length; a += 1) w(s[a]);
    t = false;
  }, d(i) {
    i && E(e), De(s, i);
  } };
}
const me = 15, Lt = 15;
function St(n, e, t) {
  let r, s;
  ee(n, Pe, (a) => t(0, r = a)), ee(n, Le, (a) => t(1, s = a));
  const o = Array.from({ length: me * Lt }, (a, c) => c);
  function i(a, c, l) {
    if (!c) return v.Empty;
    const m = a % me, b = Math.floor(a / me);
    if (l.segments.length > 0 && l.segments[0].x === m && l.segments[0].y === b) return v.SnakeHead;
    for (let h = 1; h < l.segments.length; h++) if (l.segments[h].x === m && l.segments[h].y === b) return v.SnakeBody;
    return c.food && c.food.some((h) => h.x === m && h.y === b) ? v.Food : c.obstacles && c.obstacles.some((h) => h.x === m && h.y === b) ? v.Obstacle : c.exit && c.exit.x === m && c.exit.y === b ? v.Exit : v.Empty;
  }
  return [r, s, o, i];
}
class kt extends I {
  constructor(e) {
    super(), C(this, e, St, xt, $, {});
  }
}
function At(n) {
  let e, t, r, s, o, i, a, c, l;
  return { c() {
    e = g("div"), t = g("h2"), t.textContent = "Game Over", r = S(), s = g("div"), o = g("button"), o.textContent = "Restart Level", i = S(), a = g("button"), a.textContent = "Back to Level 1", f(t, "class", "svelte-r80wre"), f(o, "class", "modal-btn primary svelte-r80wre"), f(o, "data-element-id", "restart-level-btn"), f(a, "class", "modal-btn secondary svelte-r80wre"), f(a, "data-element-id", "back-to-level1-btn"), f(s, "class", "modal-buttons svelte-r80wre"), f(e, "class", "modal svelte-r80wre");
  }, m(m, b) {
    O(m, e, b), d(e, t), d(e, r), d(e, s), d(s, o), n[3](o), d(s, i), d(s, a), c || (l = [be(o, "click", n[1]), be(a, "click", n[2])], c = true);
  }, p: _, i: _, o: _, d(m) {
    m && E(e), n[3](null), c = false, q(l);
  } };
}
function Ot(n, e, t) {
  const r = Re("GAME_ENGINE");
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
  function a(c) {
    he[c ? "unshift" : "push"](() => {
      s = c, t(0, s);
    });
  }
  return [s, o, i, a];
}
class Ct extends I {
  constructor(e) {
    super(), C(this, e, Ot, At, $, {});
  }
}
function It(n) {
  let e;
  return { c() {
    e = g("div"), e.innerHTML = '<h2 class="svelte-q2s5gm">All Levels Complete!</h2> <p style="margin: 15px 0; color: #666;">Congratulations! You&#39;ve beaten all levels.</p> <p style="font-size: 12px; color: #999;">Refresh the page to play again.</p>', f(e, "class", "modal svelte-q2s5gm");
  }, m(t, r) {
    O(t, e, r);
  }, p: _, i: _, o: _, d(t) {
    t && E(e);
  } };
}
class Mt extends I {
  constructor(e) {
    super(), C(this, e, null, It, $, {});
  }
}
function Ne(n) {
  let e, t, r, s;
  const o = [Nt, Ft], i = [];
  function a(c, l) {
    return c[1] ? 0 : c[0] ? 1 : -1;
  }
  return ~(t = a(n)) && (r = i[t] = o[t](n)), { c() {
    e = g("div"), r && r.c(), f(e, "class", "overlay active svelte-16e68es"), f(e, "data-element-id", "overlay");
  }, m(c, l) {
    O(c, e, l), ~t && i[t].m(e, null), s = true;
  }, p(c, l) {
    let m = t;
    t = a(c), t !== m && (r && ($e(), w(i[m], 1, 1, () => {
      i[m] = null;
    }), Ee()), ~t ? (r = i[t], r || (r = i[t] = o[t](c), r.c()), p(r, 1), r.m(e, null)) : r = null);
  }, i(c) {
    s || (p(r), s = true);
  }, o(c) {
    w(r), s = false;
  }, d(c) {
    c && E(e), ~t && i[t].d();
  } };
}
function Ft(n) {
  let e, t;
  return e = new Mt({}), { c() {
    M(e.$$.fragment);
  }, m(r, s) {
    k(e, r, s), t = true;
  }, i(r) {
    t || (p(e.$$.fragment, r), t = true);
  }, o(r) {
    w(e.$$.fragment, r), t = false;
  }, d(r) {
    A(e, r);
  } };
}
function Nt(n) {
  let e, t;
  return e = new Ct({}), { c() {
    M(e.$$.fragment);
  }, m(r, s) {
    k(e, r, s), t = true;
  }, i(r) {
    t || (p(e.$$.fragment, r), t = true);
  }, o(r) {
    w(e.$$.fragment, r), t = false;
  }, d(r) {
    A(e, r);
  } };
}
function Tt(n) {
  let e, t, r = n[2] && Ne(n);
  return { c() {
    r && r.c(), e = Ue();
  }, m(s, o) {
    r && r.m(s, o), O(s, e, o), t = true;
  }, p(s, [o]) {
    s[2] ? r ? (r.p(s, o), o & 4 && p(r, 1)) : (r = Ne(s), r.c(), p(r, 1), r.m(e.parentNode, e)) : r && ($e(), w(r, 1, 1, () => {
      r = null;
    }), Ee());
  }, i(s) {
    t || (p(r), t = true);
  }, o(s) {
    w(r), t = false;
  }, d(s) {
    s && E(e), r && r.d(s);
  } };
}
function Gt(n, e, t) {
  let r, s, o, i;
  return ee(n, ue, (a) => t(3, i = a)), n.$$.update = () => {
    n.$$.dirty & 8 && t(1, r = i.status === N.GameOver), n.$$.dirty & 8 && t(0, s = i.status === N.AllComplete), n.$$.dirty & 3 && t(2, o = r || s);
  }, [s, r, o, i];
}
class Wt extends I {
  constructor(e) {
    super(), C(this, e, Gt, Tt, $, {});
  }
}
function Rt(n) {
  let e, t, r, s, o, i, a;
  return t = new yt({}), s = new kt({}), i = new Wt({}), { c() {
    e = g("div"), M(t.$$.fragment), r = S(), M(s.$$.fragment), o = S(), M(i.$$.fragment), f(e, "class", "game-container svelte-1t5xe4u");
  }, m(c, l) {
    O(c, e, l), k(t, e, null), d(e, r), k(s, e, null), d(e, o), k(i, e, null), a = true;
  }, p: _, i(c) {
    a || (p(t.$$.fragment, c), p(s.$$.fragment, c), p(i.$$.fragment, c), a = true);
  }, o(c) {
    w(t.$$.fragment, c), w(s.$$.fragment, c), w(i.$$.fragment, c), a = false;
  }, d(c) {
    c && E(e), A(t), A(s), A(i);
  } };
}
class zt extends I {
  constructor(e) {
    super(), C(this, e, null, Rt, $, {});
  }
}
function Pt(n) {
  let e, t;
  return e = new zt({}), { c() {
    M(e.$$.fragment);
  }, m(r, s) {
    k(e, r, s), t = true;
  }, p: _, i(r) {
    t || (p(e.$$.fragment, r), t = true);
  }, o(r) {
    w(e.$$.fragment, r), t = false;
  }, d(r) {
    A(e, r);
  } };
}
function Bt(n) {
  const e = new ut();
  Ve("GAME_ENGINE", e);
  let t;
  return We(async () => {
    const r = new URLSearchParams(window.location.search), s = parseInt(r.get("level") || "1", 10);
    ft(e), await e.init(null, s), t = new dt(e), t.attach();
  }), qe(() => {
    t && t.detach();
  }), [];
}
class jt extends I {
  constructor(e) {
    super(), C(this, e, Bt, Pt, $, {});
  }
}
new jt({ target: document.getElementById("app") });
