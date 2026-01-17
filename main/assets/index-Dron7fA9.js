var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
(function() {
  const e = document.createElement("link").relList;
  if (e && e.supports && e.supports("modulepreload")) return;
  for (const s of document.querySelectorAll('link[rel="modulepreload"]')) r(s);
  new MutationObserver((s) => {
    for (const i of s) if (i.type === "childList") for (const c of i.addedNodes) c.tagName === "LINK" && c.rel === "modulepreload" && r(c);
  }).observe(document, { childList: true, subtree: true });
  function t(s) {
    const i = {};
    return s.integrity && (i.integrity = s.integrity), s.referrerPolicy && (i.referrerPolicy = s.referrerPolicy), s.crossOrigin === "use-credentials" ? i.credentials = "include" : s.crossOrigin === "anonymous" ? i.credentials = "omit" : i.credentials = "same-origin", i;
  }
  function r(s) {
    if (s.ep) return;
    s.ep = true;
    const i = t(s);
    fetch(s.href, i);
  }
})();
function g() {
}
function Fe(n) {
  return n();
}
function Ee() {
  return /* @__PURE__ */ Object.create(null);
}
function U(n) {
  n.forEach(Fe);
}
function Oe(n) {
  return typeof n == "function";
}
function x(n, e) {
  return n != n ? e == e : n !== e || n && typeof n == "object" || typeof n == "function";
}
function We(n) {
  return Object.keys(n).length === 0;
}
function je(n, ...e) {
  if (n == null) {
    for (const r of e) r(void 0);
    return g;
  }
  const t = n.subscribe(...e);
  return t.unsubscribe ? () => t.unsubscribe() : t;
}
function J(n, e, t) {
  n.$$.on_destroy.push(je(e, t));
}
function f(n, e) {
  n.appendChild(e);
}
function C(n, e, t) {
  n.insertBefore(e, t || null);
}
function k(n) {
  n.parentNode && n.parentNode.removeChild(n);
}
function Be(n, e) {
  for (let t = 0; t < n.length; t += 1) n[t] && n[t].d(e);
}
function _(n) {
  return document.createElement(n);
}
function N(n) {
  return document.createTextNode(n);
}
function w() {
  return N(" ");
}
function De() {
  return N("");
}
function se(n, e, t, r) {
  return n.addEventListener(e, t, r), () => n.removeEventListener(e, t, r);
}
function u(n, e, t) {
  t == null ? n.removeAttribute(e) : n.getAttribute(e) !== t && n.setAttribute(e, t);
}
function Te(n) {
  return Array.from(n.childNodes);
}
function ee(n, e) {
  e = "" + e, n.data !== e && (n.data = e);
}
let ie;
function te(n) {
  ie = n;
}
function de() {
  if (!ie) throw new Error("Function called outside component initialization");
  return ie;
}
function ze(n) {
  de().$$.on_mount.push(n);
}
function Ue(n) {
  de().$$.on_destroy.push(n);
}
function Pe(n, e) {
  return de().$$.context.set(n, e), e;
}
function Re(n) {
  return de().$$.context.get(n);
}
const V = [], be = [];
let K = [];
const xe = [], He = Promise.resolve();
let he = false;
function Ve() {
  he || (he = true, He.then(qe));
}
function pe(n) {
  K.push(n);
}
const ge = /* @__PURE__ */ new Set();
let P = 0;
function qe() {
  if (P !== 0) return;
  const n = ie;
  do {
    try {
      for (; P < V.length; ) {
        const e = V[P];
        P++, te(e), Ke(e.$$);
      }
    } catch (e) {
      throw V.length = 0, P = 0, e;
    }
    for (te(null), V.length = 0, P = 0; be.length; ) be.pop()();
    for (let e = 0; e < K.length; e += 1) {
      const t = K[e];
      ge.has(t) || (ge.add(t), t());
    }
    K.length = 0;
  } while (V.length);
  for (; xe.length; ) xe.pop()();
  he = false, ge.clear(), te(n);
}
function Ke(n) {
  if (n.fragment !== null) {
    n.update(), U(n.before_update);
    const e = n.dirty;
    n.dirty = [-1], n.fragment && n.fragment.p(n.ctx, e), n.after_update.forEach(pe);
  }
}
function Je(n) {
  const e = [], t = [];
  K.forEach((r) => n.indexOf(r) === -1 ? e.push(r) : t.push(r)), t.forEach((r) => r()), K = e;
}
const ue = /* @__PURE__ */ new Set();
let D;
function ve() {
  D = { r: 0, c: [], p: D };
}
function $e() {
  D.r || U(D.c), D = D.p;
}
function b(n, e) {
  n && n.i && (ue.delete(n), n.i(e));
}
function p(n, e, t, r) {
  if (n && n.o) {
    if (ue.has(n)) return;
    ue.add(n), D.c.push(() => {
      ue.delete(n), r && (t && n.d(1), r());
    }), n.o(e);
  } else r && r();
}
function ke(n) {
  return (n == null ? void 0 : n.length) !== void 0 ? n : Array.from(n);
}
function z(n) {
  n && n.c();
}
function S(n, e, t) {
  const { fragment: r, after_update: s } = n.$$;
  r && r.m(e, t), pe(() => {
    const i = n.$$.on_mount.map(Fe).filter(Oe);
    n.$$.on_destroy ? n.$$.on_destroy.push(...i) : U(i), n.$$.on_mount = [];
  }), s.forEach(pe);
}
function A(n, e) {
  const t = n.$$;
  t.fragment !== null && (Je(t.after_update), U(t.on_destroy), t.fragment && t.fragment.d(e), t.on_destroy = t.fragment = null, t.ctx = []);
}
function Ye(n, e) {
  n.$$.dirty[0] === -1 && (V.push(n), Ve(), n.$$.dirty.fill(0)), n.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function I(n, e, t, r, s, i, c = null, o = [-1]) {
  const a = ie;
  te(n);
  const l = n.$$ = { fragment: null, ctx: [], props: i, update: g, not_equal: s, bound: Ee(), on_mount: [], on_destroy: [], on_disconnect: [], before_update: [], after_update: [], context: new Map(e.context || (a ? a.$$.context : [])), callbacks: Ee(), dirty: o, skip_bound: false, root: e.target || a.$$.root };
  c && c(l.root);
  let m = false;
  if (l.ctx = t ? t(n, e.props || {}, (h, y, ...R) => {
    const v = R.length ? R[0] : y;
    return l.ctx && s(l.ctx[h], l.ctx[h] = v) && (!l.skip_bound && l.bound[h] && l.bound[h](v), m && Ye(n, h)), y;
  }) : [], l.update(), m = true, U(l.before_update), l.fragment = r ? r(l.ctx) : false, e.target) {
    if (e.hydrate) {
      const h = Te(e.target);
      l.fragment && l.fragment.l(h), h.forEach(k);
    } else l.fragment && l.fragment.c();
    e.intro && b(n.$$.fragment), S(n, e.target, e.anchor), qe();
  }
  te(a);
}
class M {
  constructor() {
    __publicField(this, "$$");
    __publicField(this, "$$set");
  }
  $destroy() {
    A(this, 1), this.$destroy = g;
  }
  $on(e, t) {
    if (!Oe(t)) return g;
    const r = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
    return r.push(t), () => {
      const s = r.indexOf(t);
      s !== -1 && r.splice(s, 1);
    };
  }
  $set(e) {
    this.$$set && !We(e) && (this.$$.skip_bound = true, this.$$set(e), this.$$.skip_bound = false);
  }
}
const Xe = "4";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(Xe);
let we = class {
  __destroy_into_raw() {
    const e = this.__wbg_ptr;
    return this.__wbg_ptr = 0, Le.unregister(this), e;
  }
  free() {
    const e = this.__destroy_into_raw();
    d.__wbg_wasmgameengine_free(e, 0);
  }
  getFrame() {
    const e = d.wasmgameengine_getFrame(this.__wbg_ptr);
    if (e[2]) throw L(e[1]);
    return L(e[0]);
  }
  getGameState() {
    const e = d.wasmgameengine_getGameState(this.__wbg_ptr);
    if (e[2]) throw L(e[1]);
    return L(e[0]);
  }
  getLevel() {
    const e = d.wasmgameengine_getLevel(this.__wbg_ptr);
    if (e[2]) throw L(e[1]);
    return L(e[0]);
  }
  constructor(e) {
    const t = d.wasmgameengine_new(e);
    if (t[2]) throw L(t[1]);
    return this.__wbg_ptr = t[0] >>> 0, Le.register(this, this.__wbg_ptr, this), this;
  }
  onFrame(e) {
    d.wasmgameengine_onFrame(this.__wbg_ptr, e);
  }
  processMove(e) {
    const t = d.wasmgameengine_processMove(this.__wbg_ptr, e);
    if (t[2]) throw L(t[1]);
    return L(t[0]);
  }
};
Symbol.dispose && (we.prototype[Symbol.dispose] = we.prototype.free);
function Qe() {
  const n = d.getLevels();
  if (n[2]) throw L(n[1]);
  return L(n[0]);
}
function Ze(n) {
  const e = Z(n, d.__wbindgen_malloc, d.__wbindgen_realloc), t = T;
  d.log(e, t);
}
function et() {
  return { __proto__: null, "./gsnake_wasm_bg.js": { __proto__: null, __wbg_Error_8c4e43fe74559d73: function(e, t) {
    return Error(ce(e, t));
  }, __wbg_Number_04624de7d0e8332d: function(e) {
    return Number(e);
  }, __wbg_String_8f0eb39a4a4c2f66: function(e, t) {
    const r = String(t), s = Z(r, d.__wbindgen_malloc, d.__wbindgen_realloc), i = T;
    O().setInt32(e + 4, i, true), O().setInt32(e + 0, s, true);
  }, __wbg___wbindgen_boolean_get_bbbb1c18aa2f5e25: function(e) {
    const t = e, r = typeof t == "boolean" ? t : void 0;
    return le(r) ? 16777215 : r ? 1 : 0;
  }, __wbg___wbindgen_debug_string_0bc8482c6e3508ae: function(e, t) {
    const r = ye(t), s = Z(r, d.__wbindgen_malloc, d.__wbindgen_realloc), i = T;
    O().setInt32(e + 4, i, true), O().setInt32(e + 0, s, true);
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
    O().setFloat64(e + 8, le(s) ? 0 : s, true), O().setInt32(e + 0, !le(s), true);
  }, __wbg___wbindgen_string_get_72fb696202c56729: function(e, t) {
    const r = t, s = typeof r == "string" ? r : void 0;
    var i = le(s) ? 0 : Z(s, d.__wbindgen_malloc, d.__wbindgen_realloc), c = T;
    O().setInt32(e + 4, c, true), O().setInt32(e + 0, i, true);
  }, __wbg___wbindgen_throw_be289d5034ed271b: function(e, t) {
    throw new Error(ce(e, t));
  }, __wbg_call_389efe28435a9388: function() {
    return X(function(e, t) {
      return e.call(t);
    }, arguments);
  }, __wbg_call_4708e0c13bdc8e95: function() {
    return X(function(e, t, r) {
      return e.call(t, r);
    }, arguments);
  }, __wbg_done_57b39ecd9addfe81: function(e) {
    return e.done;
  }, __wbg_entries_58c7934c745daac7: function(e) {
    return Object.entries(e);
  }, __wbg_error_7534b8e9a36f1ab4: function(e, t) {
    let r, s;
    try {
      r = e, s = t, console.error(ce(e, t));
    } finally {
      d.__wbindgen_free(r, s, 1);
    }
  }, __wbg_get_9b94d73e6221f75c: function(e, t) {
    return e[t >>> 0];
  }, __wbg_get_b3ed3ad4be2bc8ac: function() {
    return X(function(e, t) {
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
  }, __wbg_new_dca287b076112a51: function() {
    return /* @__PURE__ */ new Map();
  }, __wbg_new_dd2b680c8bf6ae29: function(e) {
    return new Uint8Array(e);
  }, __wbg_next_3482f54c49e8af19: function() {
    return X(function(e) {
      return e.next();
    }, arguments);
  }, __wbg_next_418f80d8f5303233: function(e) {
    return e.next;
  }, __wbg_prototypesetcall_bdcdcc5842e4d77d: function(e, t, r) {
    Uint8Array.prototype.set.call(nt(e, t), r);
  }, __wbg_set_1eb0999cf5d27fc8: function(e, t, r) {
    return e.set(t, r);
  }, __wbg_set_3f1d0b984ed272ed: function(e, t, r) {
    e[t] = r;
  }, __wbg_set_6cb8631f80447a67: function() {
    return X(function(e, t, r) {
      return Reflect.set(e, t, r);
    }, arguments);
  }, __wbg_set_f43e577aea94465b: function(e, t, r) {
    e[t >>> 0] = r;
  }, __wbg_stack_0ed75d68575b0f3c: function(e, t) {
    const r = t.stack, s = Z(r, d.__wbindgen_malloc, d.__wbindgen_realloc), i = T;
    O().setInt32(e + 4, i, true), O().setInt32(e + 0, s, true);
  }, __wbg_value_0546255b415e96c1: function(e) {
    return e.value;
  }, __wbindgen_cast_0000000000000001: function(e) {
    return e;
  }, __wbindgen_cast_0000000000000002: function(e, t) {
    return ce(e, t);
  }, __wbindgen_init_externref_table: function() {
    const e = d.__wbindgen_externrefs, t = e.grow(4);
    e.set(0, void 0), e.set(t + 0, void 0), e.set(t + 1, null), e.set(t + 2, true), e.set(t + 3, false);
  } } };
}
const Le = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((n) => d.__wbg_wasmgameengine_free(n >>> 0, 1));
function tt(n) {
  const e = d.__externref_table_alloc();
  return d.__wbindgen_externrefs.set(e, n), e;
}
function ye(n) {
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
    let i = "[";
    s > 0 && (i += ye(n[0]));
    for (let c = 1; c < s; c++) i += ", " + ye(n[c]);
    return i += "]", i;
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
function nt(n, e) {
  return n = n >>> 0, ne().subarray(n / 1, n / 1 + e);
}
let B = null;
function O() {
  return (B === null || B.buffer.detached === true || B.buffer.detached === void 0 && B.buffer !== d.memory.buffer) && (B = new DataView(d.memory.buffer)), B;
}
function ce(n, e) {
  return n = n >>> 0, st(n, e);
}
let Q = null;
function ne() {
  return (Q === null || Q.byteLength === 0) && (Q = new Uint8Array(d.memory.buffer)), Q;
}
function X(n, e) {
  try {
    return n.apply(this, e);
  } catch (t) {
    const r = tt(t);
    d.__wbindgen_exn_store(r);
  }
}
function le(n) {
  return n == null;
}
function Z(n, e, t) {
  if (t === void 0) {
    const o = re.encode(n), a = e(o.length, 1) >>> 0;
    return ne().subarray(a, a + o.length).set(o), T = o.length, a;
  }
  let r = n.length, s = e(r, 1) >>> 0;
  const i = ne();
  let c = 0;
  for (; c < r; c++) {
    const o = n.charCodeAt(c);
    if (o > 127) break;
    i[s + c] = o;
  }
  if (c !== r) {
    c !== 0 && (n = n.slice(c)), s = t(s, r, r = c + n.length * 3, 1) >>> 0;
    const o = ne().subarray(s + c, s + r), a = re.encodeInto(n, o);
    c += a.written, s = t(s, r, c, 1) >>> 0;
  }
  return T = c, s;
}
function L(n) {
  const e = d.__wbindgen_externrefs.get(n);
  return d.__externref_table_dealloc(n), e;
}
let fe = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
fe.decode();
const rt = 2146435072;
let me = 0;
function st(n, e) {
  return me += e, me >= rt && (fe = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true }), fe.decode(), me = e), fe.decode(ne().subarray(n, n + e));
}
const re = new TextEncoder();
"encodeInto" in re || (re.encodeInto = function(n, e) {
  const t = re.encode(n);
  return e.set(t), { read: n.length, written: t.length };
});
let T = 0, d;
function it(n, e) {
  return d = n.exports, B = null, Q = null, d.__wbindgen_start(), d;
}
async function ot(n, e) {
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
async function Se(n) {
  if (d !== void 0) return d;
  n !== void 0 && (Object.getPrototypeOf(n) === Object.prototype ? { module_or_path: n } = n : console.warn("using deprecated parameters for the initialization function; pass a single object instead")), n === void 0 && (n = new URL("/gSnake/main/assets/gsnake_wasm_bg-D7O23Jdp.wasm", import.meta.url));
  const e = et();
  (typeof n == "string" || typeof Request == "function" && n instanceof Request || typeof URL == "function" && n instanceof URL) && (n = fetch(n));
  const { instance: t, module: r } = await ot(await n, e);
  return it(t);
}
class at {
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
    try {
      await Se();
    } catch (r) {
      console.error("WASM init failed, retrying once:", r);
      try {
        await Se();
      } catch (s) {
        throw this.handleContractError(s, "Failed to initialize WASM module", "initializationFailed"), s;
      }
    }
    Ze("gSnake WASM engine initialized");
    try {
      this.levels = e ?? Qe();
    } catch (r) {
      throw this.handleContractError(r, "Failed to load levels", "initializationFailed"), r;
    }
    this.currentLevelIndex = t - 1, await this.loadLevelByIndex(this.currentLevelIndex), this.initialized = true;
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
    try {
      this.wasmEngine = new we(t);
    } catch (r) {
      throw this.handleContractError(r, "Failed to initialize engine", "initializationFailed"), r;
    }
    this.wasmEngine.onFrame((r) => {
      this.handleFrameUpdate(r);
    }), this.emitInitialEvents(t);
  }
  emitInitialEvents(e) {
    this.emitEvent({ type: "levelChanged", level: e });
  }
  handleFrameUpdate(e) {
    this.emitEvent({ type: "frameChanged", frame: e }), e.state.status === "LevelComplete" && this.handleLevelComplete();
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
    try {
      this.wasmEngine.processMove(e);
    } catch (t) {
      this.handleContractError(t, "Error processing move");
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
  handleContractError(e, t, r = "internalError") {
    const s = this.normalizeContractError(e, t, r);
    if (s) {
      this.emitEvent({ type: "engineError", error: s }), console.error(`[ContractError:${s.kind}] ${s.message}`, s.context ?? {});
      return;
    }
    console.error(t, e);
  }
  isContractError(e) {
    if (!e || typeof e != "object") return false;
    const t = e;
    return typeof t.kind == "string" && typeof t.message == "string";
  }
  normalizeContractError(e, t, r) {
    if (this.isContractError(e)) return e;
    const s = e instanceof Error ? e.message : String(e);
    return { kind: r, message: t, context: { detail: s } };
  }
}
const H = [];
function ae(n, e = g) {
  let t;
  const r = /* @__PURE__ */ new Set();
  function s(o) {
    if (x(n, o) && (n = o, t)) {
      const a = !H.length;
      for (const l of r) l[1](), H.push(l, n);
      if (a) {
        for (let l = 0; l < H.length; l += 2) H[l][0](H[l + 1]);
        H.length = 0;
      }
    }
  }
  function i(o) {
    s(o(n));
  }
  function c(o, a = g) {
    const l = [o, a];
    return r.add(l), r.size === 1 && (t = e(s, i) || g), o(n), () => {
      r.delete(l), r.size === 0 && t && (t(), t = null);
    };
  }
  return { set: s, update: i, subscribe: c };
}
const _e = ae({ status: "Playing", currentLevel: 1, moves: 0, foodCollected: 0, totalFood: 0 }), Ge = ae(0), ct = ae(null), Ne = ae(null), oe = ae(null);
function lt() {
  return typeof window > "u" ? false : new URLSearchParams(window.location.search).get("contractTest") === "1";
}
function Ae(n) {
  if (!lt()) return;
  const e = window, t = e.__gsnakeContract ?? {};
  e.__gsnakeContract = { ...t, ...n };
}
function ut(n) {
  n.addEventListener((e) => {
    switch (e.type) {
      case "levelChanged":
        ct.set(e.level);
        break;
      case "frameChanged":
        Ne.set(e.frame), _e.set(e.frame.state), Ge.set(ft(e.frame)), oe.set(null), Ae({ frame: e.frame, error: null });
        break;
      case "engineError":
        oe.set(e.error), Ae({ error: e.error });
        break;
    }
  });
}
function ft(n) {
  let e = 0;
  for (const t of n.grid) for (const r of t) (r === "SnakeHead" || r === "SnakeBody") && (e += 1);
  return e;
}
class dt {
  constructor(e) {
    __publicField(this, "keyMap");
    __publicField(this, "boundHandler");
    __publicField(this, "currentStatus", "Playing");
    __publicField(this, "unsubscribe");
    this.gameEngine = e, this.keyMap = /* @__PURE__ */ new Map([["ArrowUp", "North"], ["ArrowDown", "South"], ["ArrowLeft", "West"], ["ArrowRight", "East"], ["w", "North"], ["s", "South"], ["a", "West"], ["d", "East"], ["W", "North"], ["S", "South"], ["A", "West"], ["D", "East"]]), this.boundHandler = this.handleKeyPress.bind(this), this.unsubscribe = _e.subscribe((t) => {
      this.currentStatus = t.status;
    });
  }
  handleKeyPress(e) {
    if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return;
    const t = e.key, r = t.toLowerCase();
    switch ([" ", "Spacebar", "Tab", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(t) && e.preventDefault(), ["r", "q", "escape", "esc"].includes(r) && e.preventDefault(), this.currentStatus) {
      case "Playing":
        this.handlePlayingState(e, r);
        break;
      case "GameOver":
        this.handleGameOverState(e, r);
        break;
      case "AllComplete":
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
  let e, t, r, s, i, c = n[0].currentLevel + "", o, a, l, m, h, y, R, v, $, W, G, q, j = n[0].moves + "", F;
  return { c() {
    e = _("div"), t = _("div"), r = _("span"), r.textContent = "Level", s = w(), i = _("span"), o = N(c), a = w(), l = _("div"), m = _("span"), m.textContent = "Length", h = w(), y = _("span"), R = N(n[1]), v = w(), $ = _("div"), W = _("span"), W.textContent = "Moves", G = w(), q = _("span"), F = N(j), u(r, "class", "score-label svelte-1dkg50z"), u(i, "class", "score-value svelte-1dkg50z"), u(i, "data-element-id", "level-display"), u(t, "class", "score-item svelte-1dkg50z"), u(m, "class", "score-label svelte-1dkg50z"), u(y, "class", "score-value svelte-1dkg50z"), u(y, "data-element-id", "length-display"), u(l, "class", "score-item svelte-1dkg50z"), u(W, "class", "score-label svelte-1dkg50z"), u(q, "class", "score-value svelte-1dkg50z"), u(q, "data-element-id", "moves-display"), u($, "class", "score-item svelte-1dkg50z"), u(e, "class", "score-info svelte-1dkg50z");
  }, m(E, Y) {
    C(E, e, Y), f(e, t), f(t, r), f(t, s), f(t, i), f(i, o), f(e, a), f(e, l), f(l, m), f(l, h), f(l, y), f(y, R), f(e, v), f(e, $), f($, W), f($, G), f($, q), f(q, F);
  }, p(E, [Y]) {
    Y & 1 && c !== (c = E[0].currentLevel + "") && ee(o, c), Y & 2 && ee(R, E[1]), Y & 1 && j !== (j = E[0].moves + "") && ee(F, j);
  }, i: g, o: g, d(E) {
    E && k(e);
  } };
}
function gt(n, e, t) {
  let r, s;
  return J(n, _e, (i) => t(0, r = i)), J(n, Ge, (i) => t(1, s = i)), [r, s];
}
class mt extends M {
  constructor(e) {
    super(), I(this, e, gt, _t, x, {});
  }
}
function bt(n) {
  let e, t, r;
  return { c() {
    e = _("button"), e.textContent = "Restart", u(e, "class", "restart-btn svelte-11sh8jp"), u(e, "data-element-id", "restart-button");
  }, m(s, i) {
    C(s, e, i), t || (r = se(e, "click", n[0]), t = true);
  }, p: g, i: g, o: g, d(s) {
    s && k(e), t = false, r();
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
class pt extends M {
  constructor(e) {
    super(), I(this, e, ht, bt, x, {});
  }
}
function wt(n) {
  let e, t, r, s, i;
  return t = new mt({}), s = new pt({}), { c() {
    e = _("div"), z(t.$$.fragment), r = w(), z(s.$$.fragment), u(e, "class", "header svelte-6xj8ba");
  }, m(c, o) {
    C(c, e, o), S(t, e, null), f(e, r), S(s, e, null), i = true;
  }, p: g, i(c) {
    i || (b(t.$$.fragment, c), b(s.$$.fragment, c), i = true);
  }, o(c) {
    p(t.$$.fragment, c), p(s.$$.fragment, c), i = false;
  }, d(c) {
    c && k(e), A(t), A(s);
  } };
}
class yt extends M {
  constructor(e) {
    super(), I(this, e, null, wt, x, {});
  }
}
function vt(n) {
  let e, t;
  return { c() {
    e = _("div"), u(e, "class", t = "cell " + n[0] + " svelte-1663m3o");
  }, m(r, s) {
    C(r, e, s);
  }, p(r, [s]) {
    s & 1 && t !== (t = "cell " + r[0] + " svelte-1663m3o") && u(e, "class", t);
  }, i: g, o: g, d(r) {
    r && k(e);
  } };
}
function $t(n) {
  switch (n) {
    case "SnakeHead":
      return "snake-head";
    case "SnakeBody":
      return "snake-body";
    case "Food":
      return "food";
    case "Obstacle":
      return "obstacle";
    case "Exit":
      return "exit";
    default:
      return "";
  }
}
function Et(n, e, t) {
  let r, { type: s } = e;
  return n.$$set = (i) => {
    "type" in i && t(1, s = i.type);
  }, n.$$.update = () => {
    n.$$.dirty & 2 && t(0, r = $t(s));
  }, [r, s];
}
class xt extends M {
  constructor(e) {
    super(), I(this, e, Et, vt, x, { type: 1 });
  }
}
function Ce(n, e, t) {
  const r = n.slice();
  return r[5] = e[t], r;
}
function Ie(n) {
  let e, t;
  return e = new xt({ props: { type: n[5] } }), { c() {
    z(e.$$.fragment);
  }, m(r, s) {
    S(e, r, s), t = true;
  }, p(r, s) {
    const i = {};
    s & 1 && (i.type = r[5]), e.$set(i);
  }, i(r) {
    t || (b(e.$$.fragment, r), t = true);
  }, o(r) {
    p(e.$$.fragment, r), t = false;
  }, d(r) {
    A(e, r);
  } };
}
function kt(n) {
  let e, t, r, s = ke(n[0]), i = [];
  for (let o = 0; o < s.length; o += 1) i[o] = Ie(Ce(n, s, o));
  const c = (o) => p(i[o], 1, 1, () => {
    i[o] = null;
  });
  return { c() {
    e = _("div");
    for (let o = 0; o < i.length; o += 1) i[o].c();
    u(e, "class", "game-field svelte-2ydslf"), u(e, "data-element-id", "game-field"), u(e, "style", t = `grid-template-columns: repeat(${n[2]}, 1fr); grid-template-rows: repeat(${n[1]}, 1fr);`);
  }, m(o, a) {
    C(o, e, a);
    for (let l = 0; l < i.length; l += 1) i[l] && i[l].m(e, null);
    r = true;
  }, p(o, [a]) {
    if (a & 1) {
      s = ke(o[0]);
      let l;
      for (l = 0; l < s.length; l += 1) {
        const m = Ce(o, s, l);
        i[l] ? (i[l].p(m, a), b(i[l], 1)) : (i[l] = Ie(m), i[l].c(), b(i[l], 1), i[l].m(e, null));
      }
      for (ve(), l = s.length; l < i.length; l += 1) c(l);
      $e();
    }
    (!r || a & 6 && t !== (t = `grid-template-columns: repeat(${o[2]}, 1fr); grid-template-rows: repeat(${o[1]}, 1fr);`)) && u(e, "style", t);
  }, i(o) {
    if (!r) {
      for (let a = 0; a < s.length; a += 1) b(i[a]);
      r = true;
    }
  }, o(o) {
    i = i.filter(Boolean);
    for (let a = 0; a < i.length; a += 1) p(i[a]);
    r = false;
  }, d(o) {
    o && k(e), Be(i, o);
  } };
}
function Lt(n, e, t) {
  let r, s, i, c, o;
  return J(n, Ne, (a) => t(4, o = a)), n.$$.update = () => {
    var _a;
    n.$$.dirty & 16 && t(3, r = (o == null ? void 0 : o.grid) ?? []), n.$$.dirty & 8 && t(2, s = ((_a = r[0]) == null ? void 0 : _a.length) ?? 0), n.$$.dirty & 8 && t(1, i = r.length), n.$$.dirty & 8 && t(0, c = r.flat());
  }, [c, i, s, r, o];
}
class St extends M {
  constructor(e) {
    super(), I(this, e, Lt, kt, x, {});
  }
}
function At(n) {
  let e, t, r, s, i, c, o, a, l;
  return { c() {
    e = _("div"), t = _("h2"), t.textContent = "Game Over", r = w(), s = _("div"), i = _("button"), i.textContent = "Restart Level", c = w(), o = _("button"), o.textContent = "Back to Level 1", u(t, "class", "svelte-r80wre"), u(i, "class", "modal-btn primary svelte-r80wre"), u(i, "data-element-id", "restart-level-btn"), u(o, "class", "modal-btn secondary svelte-r80wre"), u(o, "data-element-id", "back-to-level1-btn"), u(s, "class", "modal-buttons svelte-r80wre"), u(e, "class", "modal svelte-r80wre");
  }, m(m, h) {
    C(m, e, h), f(e, t), f(e, r), f(e, s), f(s, i), n[3](i), f(s, c), f(s, o), a || (l = [se(i, "click", n[1]), se(o, "click", n[2])], a = true);
  }, p: g, i: g, o: g, d(m) {
    m && k(e), n[3](null), a = false, U(l);
  } };
}
function Ct(n, e, t) {
  const r = Re("GAME_ENGINE");
  let s;
  ze(() => {
    s == null ? void 0 : s.focus();
  });
  function i() {
    r.restartLevel();
  }
  function c() {
    r.loadLevel(1);
  }
  function o(a) {
    be[a ? "unshift" : "push"](() => {
      s = a, t(0, s);
    });
  }
  return [s, i, c, o];
}
class It extends M {
  constructor(e) {
    super(), I(this, e, Ct, At, x, {});
  }
}
function Mt(n) {
  let e;
  return { c() {
    e = _("div"), e.innerHTML = '<h2 class="svelte-q2s5gm">All Levels Complete!</h2> <p style="margin: 15px 0; color: #666;">Congratulations! You&#39;ve beaten all levels.</p> <p style="font-size: 12px; color: #999;">Refresh the page to play again.</p>', u(e, "class", "modal svelte-q2s5gm");
  }, m(t, r) {
    C(t, e, r);
  }, p: g, i: g, o: g, d(t) {
    t && k(e);
  } };
}
class Ft extends M {
  constructor(e) {
    super(), I(this, e, null, Mt, x, {});
  }
}
function Ot(n) {
  var _a, _b;
  let e, t, r, s, i = (((_a = n[0]) == null ? void 0 : _a.message) ?? "Unexpected engine error.") + "", c, o, a, l, m, h = (((_b = n[0]) == null ? void 0 : _b.kind) ?? "internalError") + "", y, R, v, $, W, G, q, j;
  return { c() {
    e = _("div"), t = _("h2"), t.textContent = "Engine Error", r = w(), s = _("p"), c = N(i), o = w(), a = _("p"), l = N("Kind: "), m = _("span"), y = N(h), R = w(), v = _("div"), $ = _("button"), $.textContent = "Reload", W = w(), G = _("button"), G.textContent = "Dismiss", u(t, "class", "svelte-1x0qq8p"), u(s, "class", "message svelte-1x0qq8p"), u(m, "class", "svelte-1x0qq8p"), u(a, "class", "detail svelte-1x0qq8p"), u($, "class", "modal-btn primary svelte-1x0qq8p"), u(G, "class", "modal-btn secondary svelte-1x0qq8p"), u(v, "class", "modal-buttons svelte-1x0qq8p"), u(e, "class", "modal svelte-1x0qq8p"), u(e, "data-element-id", "engine-error-modal");
  }, m(F, E) {
    C(F, e, E), f(e, t), f(e, r), f(e, s), f(s, c), f(e, o), f(e, a), f(a, l), f(a, m), f(m, y), f(e, R), f(e, v), f(v, $), f(v, W), f(v, G), q || (j = [se($, "click", zt), se(G, "click", n[1])], q = true);
  }, p(F, [E]) {
    var _a2, _b2;
    E & 1 && i !== (i = (((_a2 = F[0]) == null ? void 0 : _a2.message) ?? "Unexpected engine error.") + "") && ee(c, i), E & 1 && h !== (h = (((_b2 = F[0]) == null ? void 0 : _b2.kind) ?? "internalError") + "") && ee(y, h);
  }, i: g, o: g, d(F) {
    F && k(e), q = false, U(j);
  } };
}
function zt() {
  window.location.reload();
}
function Rt(n, e, t) {
  let r;
  J(n, oe, (i) => t(0, r = i));
  function s() {
    oe.set(null);
  }
  return [r, s];
}
class qt extends M {
  constructor(e) {
    super(), I(this, e, Rt, Ot, x, {});
  }
}
function Me(n) {
  let e, t, r, s;
  const i = [Wt, Nt, Gt], c = [];
  function o(a, l) {
    return a[2] ? 0 : a[1] ? 1 : a[0] ? 2 : -1;
  }
  return ~(t = o(n)) && (r = c[t] = i[t](n)), { c() {
    e = _("div"), r && r.c(), u(e, "class", "overlay active svelte-16e68es"), u(e, "data-element-id", "overlay");
  }, m(a, l) {
    C(a, e, l), ~t && c[t].m(e, null), s = true;
  }, p(a, l) {
    let m = t;
    t = o(a), t !== m && (r && (ve(), p(c[m], 1, 1, () => {
      c[m] = null;
    }), $e()), ~t ? (r = c[t], r || (r = c[t] = i[t](a), r.c()), b(r, 1), r.m(e, null)) : r = null);
  }, i(a) {
    s || (b(r), s = true);
  }, o(a) {
    p(r), s = false;
  }, d(a) {
    a && k(e), ~t && c[t].d();
  } };
}
function Gt(n) {
  let e, t;
  return e = new Ft({}), { c() {
    z(e.$$.fragment);
  }, m(r, s) {
    S(e, r, s), t = true;
  }, i(r) {
    t || (b(e.$$.fragment, r), t = true);
  }, o(r) {
    p(e.$$.fragment, r), t = false;
  }, d(r) {
    A(e, r);
  } };
}
function Nt(n) {
  let e, t;
  return e = new It({}), { c() {
    z(e.$$.fragment);
  }, m(r, s) {
    S(e, r, s), t = true;
  }, i(r) {
    t || (b(e.$$.fragment, r), t = true);
  }, o(r) {
    p(e.$$.fragment, r), t = false;
  }, d(r) {
    A(e, r);
  } };
}
function Wt(n) {
  let e, t;
  return e = new qt({}), { c() {
    z(e.$$.fragment);
  }, m(r, s) {
    S(e, r, s), t = true;
  }, i(r) {
    t || (b(e.$$.fragment, r), t = true);
  }, o(r) {
    p(e.$$.fragment, r), t = false;
  }, d(r) {
    A(e, r);
  } };
}
function jt(n) {
  let e, t, r = n[3] && Me(n);
  return { c() {
    r && r.c(), e = De();
  }, m(s, i) {
    r && r.m(s, i), C(s, e, i), t = true;
  }, p(s, [i]) {
    s[3] ? r ? (r.p(s, i), i & 8 && b(r, 1)) : (r = Me(s), r.c(), b(r, 1), r.m(e.parentNode, e)) : r && (ve(), p(r, 1, 1, () => {
      r = null;
    }), $e());
  }, i(s) {
    t || (b(r), t = true);
  }, o(s) {
    p(r), t = false;
  }, d(s) {
    s && k(e), r && r.d(s);
  } };
}
function Bt(n, e, t) {
  let r, s, i, c, o, a;
  return J(n, _e, (l) => t(4, o = l)), J(n, oe, (l) => t(5, a = l)), n.$$.update = () => {
    n.$$.dirty & 32 && t(2, r = a !== null), n.$$.dirty & 16 && t(1, s = o.status === "GameOver"), n.$$.dirty & 16 && t(0, i = o.status === "AllComplete"), n.$$.dirty & 7 && t(3, c = r || s || i);
  }, [i, s, r, c, o, a];
}
class Dt extends M {
  constructor(e) {
    super(), I(this, e, Bt, jt, x, {});
  }
}
function Tt(n) {
  let e, t, r, s, i, c, o;
  return t = new yt({}), s = new St({}), c = new Dt({}), { c() {
    e = _("div"), z(t.$$.fragment), r = w(), z(s.$$.fragment), i = w(), z(c.$$.fragment), u(e, "class", "game-container svelte-1t5xe4u");
  }, m(a, l) {
    C(a, e, l), S(t, e, null), f(e, r), S(s, e, null), f(e, i), S(c, e, null), o = true;
  }, p: g, i(a) {
    o || (b(t.$$.fragment, a), b(s.$$.fragment, a), b(c.$$.fragment, a), o = true);
  }, o(a) {
    p(t.$$.fragment, a), p(s.$$.fragment, a), p(c.$$.fragment, a), o = false;
  }, d(a) {
    a && k(e), A(t), A(s), A(c);
  } };
}
class Ut extends M {
  constructor(e) {
    super(), I(this, e, null, Tt, x, {});
  }
}
function Pt(n) {
  let e, t;
  return e = new Ut({}), { c() {
    z(e.$$.fragment);
  }, m(r, s) {
    S(e, r, s), t = true;
  }, p: g, i(r) {
    t || (b(e.$$.fragment, r), t = true);
  }, o(r) {
    p(e.$$.fragment, r), t = false;
  }, d(r) {
    A(e, r);
  } };
}
function Ht(n) {
  const e = new at();
  Pe("GAME_ENGINE", e);
  let t;
  return ze(async () => {
    const r = new URLSearchParams(window.location.search), s = parseInt(r.get("level") || "1", 10);
    ut(e), t = new dt(e), t.attach(), await e.init(null, s);
  }), Ue(() => {
    t && t.detach();
  }), [];
}
class Vt extends M {
  constructor(e) {
    super(), I(this, e, Ht, Pt, x, {});
  }
}
new Vt({ target: document.getElementById("app") });
