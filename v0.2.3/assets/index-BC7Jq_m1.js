var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
(function() {
  const e = document.createElement("link").relList;
  if (e && e.supports && e.supports("modulepreload")) return;
  for (const s of document.querySelectorAll('link[rel="modulepreload"]')) r(s);
  new MutationObserver((s) => {
    for (const i of s) if (i.type === "childList") for (const l of i.addedNodes) l.tagName === "LINK" && l.rel === "modulepreload" && r(l);
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
function v() {
}
function Xe(n) {
  return n();
}
function qe() {
  return /* @__PURE__ */ Object.create(null);
}
function Y(n) {
  n.forEach(Xe);
}
function Ze(n) {
  return typeof n == "function";
}
function O(n, e) {
  return n != n ? e == e : n !== e || n && typeof n == "object" || typeof n == "function";
}
function ot(n) {
  return Object.keys(n).length === 0;
}
function at(n, ...e) {
  if (n == null) {
    for (const r of e) r(void 0);
    return v;
  }
  const t = n.subscribe(...e);
  return t.unsubscribe ? () => t.unsubscribe() : t;
}
function F(n, e, t) {
  n.$$.on_destroy.push(at(e, t));
}
function be(n) {
  return n ?? "";
}
function u(n, e) {
  n.appendChild(e);
}
function L(n, e, t) {
  n.insertBefore(e, t || null);
}
function $(n) {
  n.parentNode && n.parentNode.removeChild(n);
}
function et(n, e) {
  for (let t = 0; t < n.length; t += 1) n[t] && n[t].d(e);
}
function m(n) {
  return document.createElement(n);
}
function I(n) {
  return document.createTextNode(n);
}
function y() {
  return I(" ");
}
function Ie() {
  return I("");
}
function B(n, e, t, r) {
  return n.addEventListener(e, t, r), () => n.removeEventListener(e, t, r);
}
function f(n, e, t) {
  t == null ? n.removeAttribute(e) : n.getAttribute(e) !== t && n.setAttribute(e, t);
}
function ct(n) {
  return Array.from(n.childNodes);
}
function W(n, e) {
  e = "" + e, n.data !== e && (n.data = e);
}
let ce;
function le(n) {
  ce = n;
}
function we() {
  if (!ce) throw new Error("Function called outside component initialization");
  return ce;
}
function tt(n) {
  we().$$.on_mount.push(n);
}
function ut(n) {
  we().$$.on_destroy.push(n);
}
function ft(n, e) {
  return we().$$.context.set(n, e), e;
}
function Oe(n) {
  return we().$$.context.get(n);
}
const ee = [], Ee = [];
let te = [];
const Re = [], dt = Promise.resolve();
let Le = false;
function _t() {
  Le || (Le = true, dt.then(nt));
}
function Se(n) {
  te.push(n);
}
const ye = /* @__PURE__ */ new Set();
let X = 0;
function nt() {
  if (X !== 0) return;
  const n = ce;
  do {
    try {
      for (; X < ee.length; ) {
        const e = ee[X];
        X++, le(e), gt(e.$$);
      }
    } catch (e) {
      throw ee.length = 0, X = 0, e;
    }
    for (le(null), ee.length = 0, X = 0; Ee.length; ) Ee.pop()();
    for (let e = 0; e < te.length; e += 1) {
      const t = te[e];
      ye.has(t) || (ye.add(t), t());
    }
    te.length = 0;
  } while (ee.length);
  for (; Re.length; ) Re.pop()();
  Le = false, ye.clear(), le(n);
}
function gt(n) {
  if (n.fragment !== null) {
    n.update(), Y(n.before_update);
    const e = n.dirty;
    n.dirty = [-1], n.fragment && n.fragment.p(n.ctx, e), n.after_update.forEach(Se);
  }
}
function mt(n) {
  const e = [], t = [];
  te.forEach((r) => n.indexOf(r) === -1 ? e.push(r) : t.push(r)), t.forEach((r) => r()), te = e;
}
const me = /* @__PURE__ */ new Set();
let K;
function Me() {
  K = { r: 0, c: [], p: K };
}
function ze() {
  K.r || Y(K.c), K = K.p;
}
function S(n, e) {
  n && n.i && (me.delete(n), n.i(e));
}
function A(n, e, t, r) {
  if (n && n.o) {
    if (me.has(n)) return;
    me.add(n), K.c.push(() => {
      me.delete(n), r && (t && n.d(1), r());
    }), n.o(e);
  } else r && r();
}
function ve(n) {
  return (n == null ? void 0 : n.length) !== void 0 ? n : Array.from(n);
}
function G(n) {
  n && n.c();
}
function M(n, e, t) {
  const { fragment: r, after_update: s } = n.$$;
  r && r.m(e, t), Se(() => {
    const i = n.$$.on_mount.map(Xe).filter(Ze);
    n.$$.on_destroy ? n.$$.on_destroy.push(...i) : Y(i), n.$$.on_mount = [];
  }), s.forEach(Se);
}
function z(n, e) {
  const t = n.$$;
  t.fragment !== null && (mt(t.after_update), Y(t.on_destroy), t.fragment && t.fragment.d(e), t.on_destroy = t.fragment = null, t.ctx = []);
}
function ht(n, e) {
  n.$$.dirty[0] === -1 && (ee.push(n), _t(), n.$$.dirty.fill(0)), n.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function N(n, e, t, r, s, i, l = null, o = [-1]) {
  const a = ce;
  le(n);
  const c = n.$$ = { fragment: null, ctx: [], props: i, update: v, not_equal: s, bound: qe(), on_mount: [], on_destroy: [], on_disconnect: [], before_update: [], after_update: [], context: new Map(e.context || (a ? a.$$.context : [])), callbacks: qe(), dirty: o, skip_bound: false, root: e.target || a.$$.root };
  l && l(c.root);
  let g = false;
  if (c.ctx = t ? t(n, e.props || {}, (p, h, ...d) => {
    const _ = d.length ? d[0] : h;
    return c.ctx && s(c.ctx[p], c.ctx[p] = _) && (!c.skip_bound && c.bound[p] && c.bound[p](_), g && ht(n, p)), h;
  }) : [], c.update(), g = true, Y(c.before_update), c.fragment = r ? r(c.ctx) : false, e.target) {
    if (e.hydrate) {
      const p = ct(e.target);
      c.fragment && c.fragment.l(p), p.forEach($);
    } else c.fragment && c.fragment.c();
    e.intro && S(n.$$.fragment), M(n, e.target, e.anchor), nt();
  }
  le(a);
}
class q {
  constructor() {
    __publicField(this, "$$");
    __publicField(this, "$$set");
  }
  $destroy() {
    z(this, 1), this.$destroy = v;
  }
  $on(e, t) {
    if (!Ze(t)) return v;
    const r = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
    return r.push(t), () => {
      const s = r.indexOf(t);
      s !== -1 && r.splice(s, 1);
    };
  }
  $set(e) {
    this.$$set && !ot(e) && (this.$$.skip_bound = true, this.$$set(e), this.$$.skip_bound = false);
  }
}
const pt = "4";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(pt);
let Ce = class {
  __destroy_into_raw() {
    const e = this.__wbg_ptr;
    return this.__wbg_ptr = 0, Ge.unregister(this), e;
  }
  free() {
    const e = this.__destroy_into_raw();
    b.__wbg_wasmgameengine_free(e, 0);
  }
  getFrame() {
    const e = b.wasmgameengine_getFrame(this.__wbg_ptr);
    if (e[2]) throw T(e[1]);
    return T(e[0]);
  }
  getGameState() {
    const e = b.wasmgameengine_getGameState(this.__wbg_ptr);
    if (e[2]) throw T(e[1]);
    return T(e[0]);
  }
  getLevel() {
    const e = b.wasmgameengine_getLevel(this.__wbg_ptr);
    if (e[2]) throw T(e[1]);
    return T(e[0]);
  }
  constructor(e) {
    const t = b.wasmgameengine_new(e);
    if (t[2]) throw T(t[1]);
    return this.__wbg_ptr = t[0] >>> 0, Ge.register(this, this.__wbg_ptr, this), this;
  }
  onFrame(e) {
    b.wasmgameengine_onFrame(this.__wbg_ptr, e);
  }
  processMove(e) {
    const t = b.wasmgameengine_processMove(this.__wbg_ptr, e);
    if (t[2]) throw T(t[1]);
    return T(t[0]);
  }
};
Symbol.dispose && (Ce.prototype[Symbol.dispose] = Ce.prototype.free);
function bt() {
  const n = b.getLevels();
  if (n[2]) throw T(n[1]);
  return T(n[0]);
}
function vt() {
  b.init_panic_hook();
}
function wt(n) {
  const e = ie(n, b.__wbindgen_malloc, b.__wbindgen_realloc), t = J;
  b.log(e, t);
}
function yt() {
  return { __proto__: null, "./gsnake_wasm_bg.js": { __proto__: null, __wbg_Error_8c4e43fe74559d73: function(e, t) {
    return Error(de(e, t));
  }, __wbg_Number_04624de7d0e8332d: function(e) {
    return Number(e);
  }, __wbg_String_8f0eb39a4a4c2f66: function(e, t) {
    const r = String(t), s = ie(r, b.__wbindgen_malloc, b.__wbindgen_realloc), i = J;
    D().setInt32(e + 4, i, true), D().setInt32(e + 0, s, true);
  }, __wbg___wbindgen_boolean_get_bbbb1c18aa2f5e25: function(e) {
    const t = e, r = typeof t == "boolean" ? t : void 0;
    return _e(r) ? 16777215 : r ? 1 : 0;
  }, __wbg___wbindgen_debug_string_0bc8482c6e3508ae: function(e, t) {
    const r = Ae(t), s = ie(r, b.__wbindgen_malloc, b.__wbindgen_realloc), i = J;
    D().setInt32(e + 4, i, true), D().setInt32(e + 0, s, true);
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
    D().setFloat64(e + 8, _e(s) ? 0 : s, true), D().setInt32(e + 0, !_e(s), true);
  }, __wbg___wbindgen_string_get_72fb696202c56729: function(e, t) {
    const r = t, s = typeof r == "string" ? r : void 0;
    var i = _e(s) ? 0 : ie(s, b.__wbindgen_malloc, b.__wbindgen_realloc), l = J;
    D().setInt32(e + 4, l, true), D().setInt32(e + 0, i, true);
  }, __wbg___wbindgen_throw_be289d5034ed271b: function(e, t) {
    throw new Error(de(e, t));
  }, __wbg_call_389efe28435a9388: function() {
    return re(function(e, t) {
      return e.call(t);
    }, arguments);
  }, __wbg_call_4708e0c13bdc8e95: function() {
    return re(function(e, t, r) {
      return e.call(t, r);
    }, arguments);
  }, __wbg_done_57b39ecd9addfe81: function(e) {
    return e.done;
  }, __wbg_entries_58c7934c745daac7: function(e) {
    return Object.entries(e);
  }, __wbg_error_7534b8e9a36f1ab4: function(e, t) {
    let r, s;
    try {
      r = e, s = t, console.error(de(e, t));
    } finally {
      b.__wbindgen_free(r, s, 1);
    }
  }, __wbg_get_9b94d73e6221f75c: function(e, t) {
    return e[t >>> 0];
  }, __wbg_get_b3ed3ad4be2bc8ac: function() {
    return re(function(e, t) {
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
    return re(function(e) {
      return e.next();
    }, arguments);
  }, __wbg_next_418f80d8f5303233: function(e) {
    return e.next;
  }, __wbg_prototypesetcall_bdcdcc5842e4d77d: function(e, t, r) {
    Uint8Array.prototype.set.call(kt(e, t), r);
  }, __wbg_set_1eb0999cf5d27fc8: function(e, t, r) {
    return e.set(t, r);
  }, __wbg_set_3f1d0b984ed272ed: function(e, t, r) {
    e[t] = r;
  }, __wbg_set_6cb8631f80447a67: function() {
    return re(function(e, t, r) {
      return Reflect.set(e, t, r);
    }, arguments);
  }, __wbg_set_f43e577aea94465b: function(e, t, r) {
    e[t >>> 0] = r;
  }, __wbg_stack_0ed75d68575b0f3c: function(e, t) {
    const r = t.stack, s = ie(r, b.__wbindgen_malloc, b.__wbindgen_realloc), i = J;
    D().setInt32(e + 4, i, true), D().setInt32(e + 0, s, true);
  }, __wbg_value_0546255b415e96c1: function(e) {
    return e.value;
  }, __wbindgen_cast_0000000000000001: function(e) {
    return e;
  }, __wbindgen_cast_0000000000000002: function(e, t) {
    return de(e, t);
  }, __wbindgen_init_externref_table: function() {
    const e = b.__wbindgen_externrefs, t = e.grow(4);
    e.set(0, void 0), e.set(t + 0, void 0), e.set(t + 1, null), e.set(t + 2, true), e.set(t + 3, false);
  } } };
}
const Ge = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((n) => b.__wbg_wasmgameengine_free(n >>> 0, 1));
function $t(n) {
  const e = b.__externref_table_alloc();
  return b.__wbindgen_externrefs.set(e, n), e;
}
function Ae(n) {
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
    s > 0 && (i += Ae(n[0]));
    for (let l = 1; l < s; l++) i += ", " + Ae(n[l]);
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
function kt(n, e) {
  return n = n >>> 0, oe().subarray(n / 1, n / 1 + e);
}
let V = null;
function D() {
  return (V === null || V.buffer.detached === true || V.buffer.detached === void 0 && V.buffer !== b.memory.buffer) && (V = new DataView(b.memory.buffer)), V;
}
function de(n, e) {
  return n = n >>> 0, Lt(n, e);
}
let se = null;
function oe() {
  return (se === null || se.byteLength === 0) && (se = new Uint8Array(b.memory.buffer)), se;
}
function re(n, e) {
  try {
    return n.apply(this, e);
  } catch (t) {
    const r = $t(t);
    b.__wbindgen_exn_store(r);
  }
}
function _e(n) {
  return n == null;
}
function ie(n, e, t) {
  if (t === void 0) {
    const o = ae.encode(n), a = e(o.length, 1) >>> 0;
    return oe().subarray(a, a + o.length).set(o), J = o.length, a;
  }
  let r = n.length, s = e(r, 1) >>> 0;
  const i = oe();
  let l = 0;
  for (; l < r; l++) {
    const o = n.charCodeAt(l);
    if (o > 127) break;
    i[s + l] = o;
  }
  if (l !== r) {
    l !== 0 && (n = n.slice(l)), s = t(s, r, r = l + n.length * 3, 1) >>> 0;
    const o = oe().subarray(s + l, s + r), a = ae.encodeInto(n, o);
    l += a.written, s = t(s, r, l, 1) >>> 0;
  }
  return J = l, s;
}
function T(n) {
  const e = b.__wbindgen_externrefs.get(n);
  return b.__externref_table_dealloc(n), e;
}
let he = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
he.decode();
const Et = 2146435072;
let $e = 0;
function Lt(n, e) {
  return $e += e, $e >= Et && (he = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true }), he.decode(), $e = e), he.decode(oe().subarray(n, n + e));
}
const ae = new TextEncoder();
"encodeInto" in ae || (ae.encodeInto = function(n, e) {
  const t = ae.encode(n);
  return e.set(t), { read: n.length, written: t.length };
});
let J = 0, b;
function St(n, e) {
  return b = n.exports, V = null, se = null, b.__wbindgen_start(), b;
}
async function Ct(n, e) {
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
async function At(n) {
  if (b !== void 0) return b;
  n !== void 0 && (Object.getPrototypeOf(n) === Object.prototype ? { module_or_path: n } = n : console.warn("using deprecated parameters for the initialization function; pass a single object instead")), n === void 0 && (n = new URL("/gSnake/v0.2.3/assets/gsnake_wasm_bg-Qrutj6Dx.wasm", import.meta.url));
  const e = yt();
  (typeof n == "string" || typeof Request == "function" && n instanceof Request || typeof URL == "function" && n instanceof URL) && (n = fetch(n));
  const { instance: t, module: r } = await Ct(await n, e);
  return St(t);
}
class xt {
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
      await At();
    } catch (r) {
      throw this.handleContractError(r, "Failed to initialize WASM module", "initializationFailed"), r;
    }
    try {
      vt();
    } catch (r) {
      console.warn("Failed to initialize panic hook:", r);
    }
    wt("gSnake WASM engine initialized");
    try {
      this.levels = e ?? bt();
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
      this.wasmEngine = new Ce(t);
    } catch (r) {
      throw this.handleContractError(r, "Failed to initialize engine", "initializationFailed"), r;
    }
    this.wasmEngine.onFrame((r) => {
      this.handleFrameUpdate(r);
    }), this.emitInitialEvents(t);
    try {
      const r = this.wasmEngine.getFrame();
      this.handleFrameUpdate(r);
    } catch (r) {
      throw this.handleContractError(r, "Failed to get initial frame", "initializationFailed"), r;
    }
  }
  emitInitialEvents(e) {
    this.emitEvent({ type: "levelChanged", level: e });
  }
  handleFrameUpdate(e) {
    this.emitEvent({ type: "frameChanged", frame: e }), e.state.status;
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
  getLevels() {
    return this.levels;
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
const Z = [];
function P(n, e = v) {
  let t;
  const r = /* @__PURE__ */ new Set();
  function s(o) {
    if (O(n, o) && (n = o, t)) {
      const a = !Z.length;
      for (const c of r) c[1](), Z.push(c, n);
      if (a) {
        for (let c = 0; c < Z.length; c += 2) Z[c][0](Z[c + 1]);
        Z.length = 0;
      }
    }
  }
  function i(o) {
    s(o(n));
  }
  function l(o, a = v) {
    const c = [o, a];
    return r.add(c), r.size === 1 && (t = e(s, i) || v), o(n), () => {
      r.delete(c), r.size === 0 && t && (t(), t = null);
    };
  }
  return { set: s, update: i, subscribe: l };
}
const Q = P({ status: "Playing", currentLevel: 1, moves: 0, foodCollected: 0, totalFood: 0 }), rt = P(0), Ne = P(null), st = P(null), ue = P(null), it = P([]), xe = P([]), Fe = P(false), fe = P(null);
function Ft() {
  return typeof window > "u" ? false : new URLSearchParams(window.location.search).get("contractTest") === "1";
}
function je(n) {
  if (!Ft()) return;
  const e = window, t = e.__gsnakeContract ?? {};
  e.__gsnakeContract = { ...t, ...n };
}
function It(n) {
  n.addEventListener((e) => {
    switch (e.type) {
      case "levelChanged":
        Ne.set(e.level);
        break;
      case "frameChanged":
        st.set(e.frame), Q.set(e.frame.state), rt.set(Ot(e.frame)), ue.set(null), je({ frame: e.frame, error: null });
        break;
      case "engineError":
        ue.set(e.error), je({ error: e.error });
        break;
    }
  });
}
function Ot(n) {
  let e = 0;
  for (const t of n.grid) for (const r of t) (r === "SnakeHead" || r === "SnakeBody") && (e += 1);
  return e;
}
class Mt {
  constructor(e) {
    __publicField(this, "keyMap");
    __publicField(this, "boundHandler");
    __publicField(this, "currentStatus", "Playing");
    __publicField(this, "unsubscribe");
    this.gameEngine = e, this.keyMap = /* @__PURE__ */ new Map([["ArrowUp", "North"], ["ArrowDown", "South"], ["ArrowLeft", "West"], ["ArrowRight", "East"], ["w", "North"], ["s", "South"], ["a", "West"], ["d", "East"], ["W", "North"], ["S", "South"], ["A", "West"], ["D", "East"]]), this.boundHandler = this.handleKeyPress.bind(this), this.unsubscribe = Q.subscribe((t) => {
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
const ke = "gsnake_completed_levels";
class Ue {
  static getCompletedLevels() {
    if (typeof window > "u") return [];
    try {
      const e = window.localStorage.getItem(ke);
      if (!e) return [];
      const t = JSON.parse(e);
      if (Array.isArray(t)) return t.filter((r) => typeof r == "number");
    } catch {
      return [];
    }
    return [];
  }
  static isCompleted(e) {
    return this.getCompletedLevels().includes(e);
  }
  static markCompleted(e) {
    if (typeof window > "u") return [];
    const t = new Set(this.getCompletedLevels());
    t.add(e);
    const r = Array.from(t.values()).sort((s, i) => s - i);
    return window.localStorage.setItem(ke, JSON.stringify(r)), r;
  }
  static clearCompleted() {
    typeof window > "u" || window.localStorage.removeItem(ke);
  }
}
function zt(n) {
  let e, t, r, s, i, l = n[0].currentLevel + "", o, a, c, g, p, h, d, _, k, j, x, w, C = n[0].moves + "", E;
  return { c() {
    e = m("div"), t = m("div"), r = m("span"), r.textContent = "Level", s = y(), i = m("span"), o = I(l), a = y(), c = m("div"), g = m("span"), g.textContent = "Length", p = y(), h = m("span"), d = I(n[1]), _ = y(), k = m("div"), j = m("span"), j.textContent = "Moves", x = y(), w = m("span"), E = I(C), f(r, "class", "score-label svelte-1dkg50z"), f(i, "class", "score-value svelte-1dkg50z"), f(i, "data-element-id", "level-display"), f(t, "class", "score-item svelte-1dkg50z"), f(g, "class", "score-label svelte-1dkg50z"), f(h, "class", "score-value svelte-1dkg50z"), f(h, "data-element-id", "length-display"), f(c, "class", "score-item svelte-1dkg50z"), f(j, "class", "score-label svelte-1dkg50z"), f(w, "class", "score-value svelte-1dkg50z"), f(w, "data-element-id", "moves-display"), f(k, "class", "score-item svelte-1dkg50z"), f(e, "class", "score-info svelte-1dkg50z");
  }, m(R, U) {
    L(R, e, U), u(e, t), u(t, r), u(t, s), u(t, i), u(i, o), u(e, a), u(e, c), u(c, g), u(c, p), u(c, h), u(h, d), u(e, _), u(e, k), u(k, j), u(k, x), u(k, w), u(w, E);
  }, p(R, [U]) {
    U & 1 && l !== (l = R[0].currentLevel + "") && W(o, l), U & 2 && W(d, R[1]), U & 1 && C !== (C = R[0].moves + "") && W(E, C);
  }, i: v, o: v, d(R) {
    R && $(e);
  } };
}
function Nt(n, e, t) {
  let r, s;
  return F(n, Q, (i) => t(0, r = i)), F(n, rt, (i) => t(1, s = i)), [r, s];
}
class qt extends q {
  constructor(e) {
    super(), N(this, e, Nt, zt, O, {});
  }
}
function Rt(n) {
  let e, t, r;
  return { c() {
    e = m("button"), e.textContent = "Restart", f(e, "class", "restart-btn svelte-11sh8jp"), f(e, "data-element-id", "restart-button");
  }, m(s, i) {
    L(s, e, i), t || (r = B(e, "click", n[0]), t = true);
  }, p: v, i: v, o: v, d(s) {
    s && $(e), t = false, r();
  } };
}
function Gt(n) {
  const e = Oe("GAME_ENGINE");
  function t() {
    var _a;
    e.restartLevel(), (_a = document.activeElement) == null ? void 0 : _a.blur();
  }
  return [t];
}
class jt extends q {
  constructor(e) {
    super(), N(this, e, Gt, Rt, O, {});
  }
}
function Ut(n) {
  let e, t, r;
  return { c() {
    e = m("button"), e.textContent = "Levels", f(e, "class", "level-selector-btn svelte-hz9znr"), f(e, "data-element-id", "level-selector-btn");
  }, m(s, i) {
    L(s, e, i), t || (r = B(e, "click", n[0]), t = true);
  }, p: v, i: v, o: v, d(s) {
    s && $(e), t = false, r();
  } };
}
function Tt(n) {
  function e() {
    Fe.update((t) => !t);
  }
  return [e];
}
class Dt extends q {
  constructor(e) {
    super(), N(this, e, Tt, Ut, O, {});
  }
}
function Wt(n) {
  let e, t, r, s, i, l, o, a;
  return t = new qt({}), i = new Dt({}), o = new jt({}), { c() {
    e = m("div"), G(t.$$.fragment), r = y(), s = m("div"), G(i.$$.fragment), l = y(), G(o.$$.fragment), f(s, "class", "header-actions svelte-g4zqdl"), f(e, "class", "header svelte-g4zqdl");
  }, m(c, g) {
    L(c, e, g), M(t, e, null), u(e, r), u(e, s), M(i, s, null), u(s, l), M(o, s, null), a = true;
  }, p: v, i(c) {
    a || (S(t.$$.fragment, c), S(i.$$.fragment, c), S(o.$$.fragment, c), a = true);
  }, o(c) {
    A(t.$$.fragment, c), A(i.$$.fragment, c), A(o.$$.fragment, c), a = false;
  }, d(c) {
    c && $(e), z(t), z(i), z(o);
  } };
}
class Bt extends q {
  constructor(e) {
    super(), N(this, e, null, Wt, O, {});
  }
}
function Pt(n) {
  let e, t;
  return { c() {
    e = m("div"), f(e, "class", t = "cell " + n[0] + " svelte-yltpn2");
  }, m(r, s) {
    L(r, e, s);
  }, p(r, [s]) {
    s & 1 && t !== (t = "cell " + r[0] + " svelte-yltpn2") && f(e, "class", t);
  }, i: v, o: v, d(r) {
    r && $(e);
  } };
}
function Ht(n) {
  switch (n) {
    case "SnakeHead":
      return "snake-head";
    case "SnakeBody":
      return "snake-body";
    case "Food":
      return "food";
    case "FloatingFood":
      return "floating-food";
    case "FallingFood":
      return "falling-food";
    case "Stone":
      return "stone";
    case "Spike":
      return "spike";
    case "Obstacle":
      return "obstacle";
    case "Exit":
      return "exit";
    default:
      return "";
  }
}
function Vt(n, e, t) {
  let r, { type: s } = e;
  return n.$$set = (i) => {
    "type" in i && t(1, s = i.type);
  }, n.$$.update = () => {
    n.$$.dirty & 2 && t(0, r = Ht(s));
  }, [r, s];
}
class Kt extends q {
  constructor(e) {
    super(), N(this, e, Vt, Pt, O, { type: 1 });
  }
}
function Te(n, e, t) {
  const r = n.slice();
  return r[5] = e[t], r;
}
function De(n) {
  let e, t;
  return e = new Kt({ props: { type: n[5] } }), { c() {
    G(e.$$.fragment);
  }, m(r, s) {
    M(e, r, s), t = true;
  }, p(r, s) {
    const i = {};
    s & 1 && (i.type = r[5]), e.$set(i);
  }, i(r) {
    t || (S(e.$$.fragment, r), t = true);
  }, o(r) {
    A(e.$$.fragment, r), t = false;
  }, d(r) {
    z(e, r);
  } };
}
function Jt(n) {
  let e, t, r, s = ve(n[0]), i = [];
  for (let o = 0; o < s.length; o += 1) i[o] = De(Te(n, s, o));
  const l = (o) => A(i[o], 1, 1, () => {
    i[o] = null;
  });
  return { c() {
    e = m("div");
    for (let o = 0; o < i.length; o += 1) i[o].c();
    f(e, "class", "game-field svelte-2ydslf"), f(e, "data-element-id", "game-field"), f(e, "style", t = `grid-template-columns: repeat(${n[2]}, 1fr); grid-template-rows: repeat(${n[1]}, 1fr);`);
  }, m(o, a) {
    L(o, e, a);
    for (let c = 0; c < i.length; c += 1) i[c] && i[c].m(e, null);
    r = true;
  }, p(o, [a]) {
    if (a & 1) {
      s = ve(o[0]);
      let c;
      for (c = 0; c < s.length; c += 1) {
        const g = Te(o, s, c);
        i[c] ? (i[c].p(g, a), S(i[c], 1)) : (i[c] = De(g), i[c].c(), S(i[c], 1), i[c].m(e, null));
      }
      for (Me(), c = s.length; c < i.length; c += 1) l(c);
      ze();
    }
    (!r || a & 6 && t !== (t = `grid-template-columns: repeat(${o[2]}, 1fr); grid-template-rows: repeat(${o[1]}, 1fr);`)) && f(e, "style", t);
  }, i(o) {
    if (!r) {
      for (let a = 0; a < s.length; a += 1) S(i[a]);
      r = true;
    }
  }, o(o) {
    i = i.filter(Boolean);
    for (let a = 0; a < i.length; a += 1) A(i[a]);
    r = false;
  }, d(o) {
    o && $(e), et(i, o);
  } };
}
function Yt(n, e, t) {
  let r, s, i, l, o;
  return F(n, st, (a) => t(4, o = a)), n.$$.update = () => {
    var _a;
    n.$$.dirty & 16 && t(3, r = (o == null ? void 0 : o.grid) ?? []), n.$$.dirty & 8 && t(2, s = ((_a = r[0]) == null ? void 0 : _a.length) ?? 0), n.$$.dirty & 8 && t(1, i = r.length), n.$$.dirty & 8 && t(0, l = r.flat());
  }, [l, i, s, r, o];
}
class Qt extends q {
  constructor(e) {
    super(), N(this, e, Yt, Jt, O, {});
  }
}
function Xt(n) {
  let e, t, r, s, i, l, o, a, c;
  return { c() {
    e = m("div"), t = m("h2"), t.textContent = "Game Over", r = y(), s = m("div"), i = m("button"), i.textContent = "Restart Level", l = y(), o = m("button"), o.textContent = "Back to Level 1", f(t, "class", "svelte-r80wre"), f(i, "class", "modal-btn primary svelte-r80wre"), f(i, "data-element-id", "restart-level-btn"), f(o, "class", "modal-btn secondary svelte-r80wre"), f(o, "data-element-id", "back-to-level1-btn"), f(s, "class", "modal-buttons svelte-r80wre"), f(e, "class", "modal svelte-r80wre");
  }, m(g, p) {
    L(g, e, p), u(e, t), u(e, r), u(e, s), u(s, i), n[3](i), u(s, l), u(s, o), a || (c = [B(i, "click", n[1]), B(o, "click", n[2])], a = true);
  }, p: v, i: v, o: v, d(g) {
    g && $(e), n[3](null), a = false, Y(c);
  } };
}
function Zt(n, e, t) {
  const r = Oe("GAME_ENGINE");
  let s;
  tt(() => {
    s == null ? void 0 : s.focus();
  });
  function i() {
    r.restartLevel();
  }
  function l() {
    r.loadLevel(1);
  }
  function o(a) {
    Ee[a ? "unshift" : "push"](() => {
      s = a, t(0, s);
    });
  }
  return [s, i, l, o];
}
class en extends q {
  constructor(e) {
    super(), N(this, e, Zt, Xt, O, {});
  }
}
function tn(n) {
  let e;
  return { c() {
    e = m("div"), e.innerHTML = '<h2 class="svelte-q2s5gm">All Levels Complete!</h2> <p style="margin: 15px 0; color: #666;">Congratulations! You&#39;ve beaten all levels.</p> <p style="font-size: 12px; color: #999;">Refresh the page to play again.</p>', f(e, "class", "modal svelte-q2s5gm");
  }, m(t, r) {
    L(t, e, r);
  }, p: v, i: v, o: v, d(t) {
    t && $(e);
  } };
}
class nn extends q {
  constructor(e) {
    super(), N(this, e, null, tn, O, {});
  }
}
function rn(n) {
  var _a, _b;
  let e, t, r, s, i = (((_a = n[0]) == null ? void 0 : _a.message) ?? "Unexpected engine error.") + "", l, o, a, c, g, p = (((_b = n[0]) == null ? void 0 : _b.kind) ?? "internalError") + "", h, d, _, k, j, x, w, C;
  return { c() {
    e = m("div"), t = m("h2"), t.textContent = "Engine Error", r = y(), s = m("p"), l = I(i), o = y(), a = m("p"), c = I("Kind: "), g = m("span"), h = I(p), d = y(), _ = m("div"), k = m("button"), k.textContent = "Reload", j = y(), x = m("button"), x.textContent = "Dismiss", f(t, "class", "svelte-1x0qq8p"), f(s, "class", "message svelte-1x0qq8p"), f(g, "class", "svelte-1x0qq8p"), f(a, "class", "detail svelte-1x0qq8p"), f(k, "class", "modal-btn primary svelte-1x0qq8p"), f(x, "class", "modal-btn secondary svelte-1x0qq8p"), f(_, "class", "modal-buttons svelte-1x0qq8p"), f(e, "class", "modal svelte-1x0qq8p"), f(e, "data-element-id", "engine-error-modal");
  }, m(E, R) {
    L(E, e, R), u(e, t), u(e, r), u(e, s), u(s, l), u(e, o), u(e, a), u(a, c), u(a, g), u(g, h), u(e, d), u(e, _), u(_, k), u(_, j), u(_, x), w || (C = [B(k, "click", sn), B(x, "click", n[1])], w = true);
  }, p(E, [R]) {
    var _a2, _b2;
    R & 1 && i !== (i = (((_a2 = E[0]) == null ? void 0 : _a2.message) ?? "Unexpected engine error.") + "") && W(l, i), R & 1 && p !== (p = (((_b2 = E[0]) == null ? void 0 : _b2.kind) ?? "internalError") + "") && W(h, p);
  }, i: v, o: v, d(E) {
    E && $(e), w = false, Y(C);
  } };
}
function sn() {
  window.location.reload();
}
function ln(n, e, t) {
  let r;
  F(n, ue, (i) => t(0, r = i));
  function s() {
    ue.set(null);
  }
  return [r, s];
}
class on extends q {
  constructor(e) {
    super(), N(this, e, ln, rn, O, {});
  }
}
function an(n) {
  let e, t, r, s, i, l, o, a, c;
  return { c() {
    e = m("div"), t = m("h2"), t.textContent = "Level Load Failed", r = y(), s = m("p"), i = I(n[0]), l = y(), o = m("button"), o.textContent = "Continue", f(o, "class", "modal-btn svelte-10hk6qk"), f(e, "class", "modal svelte-10hk6qk");
  }, m(g, p) {
    L(g, e, p), u(e, t), u(e, r), u(e, s), u(s, i), u(e, l), u(e, o), a || (c = B(o, "click", n[1]), a = true);
  }, p(g, [p]) {
    p & 1 && W(i, g[0]);
  }, i: v, o: v, d(g) {
    g && $(e), a = false, c();
  } };
}
function cn(n, e, t) {
  let r;
  F(n, fe, (i) => t(0, r = i));
  function s() {
    fe.set(null);
  }
  return [r, s];
}
class un extends q {
  constructor(e) {
    super(), N(this, e, cn, an, O, {});
  }
}
function We(n) {
  let e, t, r, s;
  const i = [gn, _n, dn, fn], l = [];
  function o(a, c) {
    return a[3] ? 0 : a[2] ? 1 : a[1] ? 2 : a[0] ? 3 : -1;
  }
  return ~(t = o(n)) && (r = l[t] = i[t](n)), { c() {
    e = m("div"), r && r.c(), f(e, "class", "overlay active svelte-16e68es"), f(e, "data-element-id", "overlay");
  }, m(a, c) {
    L(a, e, c), ~t && l[t].m(e, null), s = true;
  }, p(a, c) {
    let g = t;
    t = o(a), t !== g && (r && (Me(), A(l[g], 1, 1, () => {
      l[g] = null;
    }), ze()), ~t ? (r = l[t], r || (r = l[t] = i[t](a), r.c()), S(r, 1), r.m(e, null)) : r = null);
  }, i(a) {
    s || (S(r), s = true);
  }, o(a) {
    A(r), s = false;
  }, d(a) {
    a && $(e), ~t && l[t].d();
  } };
}
function fn(n) {
  let e, t;
  return e = new nn({}), { c() {
    G(e.$$.fragment);
  }, m(r, s) {
    M(e, r, s), t = true;
  }, i(r) {
    t || (S(e.$$.fragment, r), t = true);
  }, o(r) {
    A(e.$$.fragment, r), t = false;
  }, d(r) {
    z(e, r);
  } };
}
function dn(n) {
  let e, t;
  return e = new en({}), { c() {
    G(e.$$.fragment);
  }, m(r, s) {
    M(e, r, s), t = true;
  }, i(r) {
    t || (S(e.$$.fragment, r), t = true);
  }, o(r) {
    A(e.$$.fragment, r), t = false;
  }, d(r) {
    z(e, r);
  } };
}
function _n(n) {
  let e, t;
  return e = new on({}), { c() {
    G(e.$$.fragment);
  }, m(r, s) {
    M(e, r, s), t = true;
  }, i(r) {
    t || (S(e.$$.fragment, r), t = true);
  }, o(r) {
    A(e.$$.fragment, r), t = false;
  }, d(r) {
    z(e, r);
  } };
}
function gn(n) {
  let e, t;
  return e = new un({}), { c() {
    G(e.$$.fragment);
  }, m(r, s) {
    M(e, r, s), t = true;
  }, i(r) {
    t || (S(e.$$.fragment, r), t = true);
  }, o(r) {
    A(e.$$.fragment, r), t = false;
  }, d(r) {
    z(e, r);
  } };
}
function mn(n) {
  let e, t, r = n[4] && We(n);
  return { c() {
    r && r.c(), e = Ie();
  }, m(s, i) {
    r && r.m(s, i), L(s, e, i), t = true;
  }, p(s, [i]) {
    s[4] ? r ? (r.p(s, i), i & 16 && S(r, 1)) : (r = We(s), r.c(), S(r, 1), r.m(e.parentNode, e)) : r && (Me(), A(r, 1, 1, () => {
      r = null;
    }), ze());
  }, i(s) {
    t || (S(r), t = true);
  }, o(s) {
    A(r), t = false;
  }, d(s) {
    s && $(e), r && r.d(s);
  } };
}
function hn(n, e, t) {
  let r, s, i, l, o, a, c, g;
  return F(n, Q, (p) => t(5, a = p)), F(n, ue, (p) => t(6, c = p)), F(n, fe, (p) => t(7, g = p)), n.$$.update = () => {
    n.$$.dirty & 128 && t(3, r = g !== null), n.$$.dirty & 64 && t(2, s = c !== null), n.$$.dirty & 32 && t(1, i = a.status === "GameOver"), n.$$.dirty & 32 && t(0, l = a.status === "AllComplete"), n.$$.dirty & 15 && t(4, o = r || s || i || l);
  }, [l, i, s, r, o, a, c, g];
}
class pn extends q {
  constructor(e) {
    super(), N(this, e, hn, mn, O, {});
  }
}
function Be(n, e, t) {
  const r = n.slice();
  return r[10] = e[t], r[12] = t, r;
}
function Pe(n) {
  let e, t, r, s, i, l, o, a, c;
  function g(d, _) {
    return d[2].length === 0 ? vn : bn;
  }
  let p = g(n), h = p(n);
  return { c() {
    e = m("div"), t = m("div"), r = m("div"), s = m("div"), s.innerHTML = '<h2 class="svelte-1h9haes">Choose a Level</h2> <p class="svelte-1h9haes">Select a level to play. Completed levels are marked.</p>', i = y(), l = m("button"), l.textContent = "Close", o = y(), h.c(), f(l, "class", "close-btn svelte-1h9haes"), f(r, "class", "level-header svelte-1h9haes"), f(t, "class", "level-panel svelte-1h9haes"), f(e, "class", "level-overlay svelte-1h9haes"), f(e, "data-element-id", "level-selector-overlay");
  }, m(d, _) {
    L(d, e, _), u(e, t), u(t, r), u(r, s), u(r, i), u(r, l), u(t, o), h.m(t, null), a || (c = B(l, "click", n[3]), a = true);
  }, p(d, _) {
    p === (p = g(d)) && h ? h.p(d, _) : (h.d(1), h = p(d), h && (h.c(), h.m(t, null)));
  }, d(d) {
    d && $(e), h.d(), a = false, c();
  } };
}
function bn(n) {
  let e, t = ve(n[2]), r = [];
  for (let s = 0; s < t.length; s += 1) r[s] = Je(Be(n, t, s));
  return { c() {
    e = m("div");
    for (let s = 0; s < r.length; s += 1) r[s].c();
    f(e, "class", "level-grid svelte-1h9haes");
  }, m(s, i) {
    L(s, e, i);
    for (let l = 0; l < r.length; l += 1) r[l] && r[l].m(e, null);
  }, p(s, i) {
    if (i & 53) {
      t = ve(s[2]);
      let l;
      for (l = 0; l < t.length; l += 1) {
        const o = Be(s, t, l);
        r[l] ? r[l].p(o, i) : (r[l] = Je(o), r[l].c(), r[l].m(e, null));
      }
      for (; l < r.length; l += 1) r[l].d(1);
      r.length = t.length;
    }
  }, d(s) {
    s && $(e), et(r, s);
  } };
}
function vn(n) {
  let e;
  return { c() {
    e = m("div"), e.textContent = "No levels loaded.", f(e, "class", "empty-state svelte-1h9haes");
  }, m(t, r) {
    L(t, e, r);
  }, p: v, d(t) {
    t && $(e);
  } };
}
function He(n) {
  let e, t, r = n[10].difficulty + "", s, i, l;
  return { c() {
    e = m("div"), t = I("("), s = I(r), i = I(")"), f(e, "class", l = be(`level-difficulty difficulty-${n[10].difficulty}`) + " svelte-1h9haes");
  }, m(o, a) {
    L(o, e, a), u(e, t), u(e, s), u(e, i);
  }, p(o, a) {
    a & 4 && r !== (r = o[10].difficulty + "") && W(s, r), a & 4 && l !== (l = be(`level-difficulty difficulty-${o[10].difficulty}`) + " svelte-1h9haes") && f(e, "class", l);
  }, d(o) {
    o && $(e);
  } };
}
function Ve(n) {
  let e;
  return { c() {
    e = m("div"), e.textContent = "Completed", f(e, "class", "level-status svelte-1h9haes");
  }, m(t, r) {
    L(t, e, r);
  }, d(t) {
    t && $(e);
  } };
}
function Ke(n) {
  let e;
  return { c() {
    e = m("div"), e.textContent = "Current", f(e, "class", "level-status current svelte-1h9haes");
  }, m(t, r) {
    L(t, e, r);
  }, d(t) {
    t && $(e);
  } };
}
function Je(n) {
  let e, t, r, s = n[10].id + "", i, l, o, a = n[10].name + "", c, g, p, h = n[5](n[10].id), d, _, k, j, x, w = n[10].difficulty && He(n), C = h && Ve(), E = n[10].id === n[0] && Ke();
  function R() {
    return n[7](n[10], n[12]);
  }
  return { c() {
    e = m("button"), t = m("div"), r = I("Level "), i = I(s), l = y(), o = m("div"), c = I(a), g = y(), w && w.c(), p = y(), C && C.c(), d = y(), E && E.c(), _ = y(), f(t, "class", "level-number svelte-1h9haes"), f(o, "class", "level-name svelte-1h9haes"), f(e, "class", k = be(`level-card ${n[5](n[10].id) ? "completed" : ""} ${n[10].id === n[0] ? "current" : ""}`) + " svelte-1h9haes");
  }, m(U, H) {
    L(U, e, H), u(e, t), u(t, r), u(t, i), u(e, l), u(e, o), u(o, c), u(e, g), w && w.m(e, null), u(e, p), C && C.m(e, null), u(e, d), E && E.m(e, null), u(e, _), j || (x = B(e, "click", R), j = true);
  }, p(U, H) {
    n = U, H & 4 && s !== (s = n[10].id + "") && W(i, s), H & 4 && a !== (a = n[10].name + "") && W(c, a), n[10].difficulty ? w ? w.p(n, H) : (w = He(n), w.c(), w.m(e, p)) : w && (w.d(1), w = null), H & 4 && (h = n[5](n[10].id)), h ? C || (C = Ve(), C.c(), C.m(e, d)) : C && (C.d(1), C = null), n[10].id === n[0] ? E || (E = Ke(), E.c(), E.m(e, _)) : E && (E.d(1), E = null), H & 5 && k !== (k = be(`level-card ${n[5](n[10].id) ? "completed" : ""} ${n[10].id === n[0] ? "current" : ""}`) + " svelte-1h9haes") && f(e, "class", k);
  }, d(U) {
    U && $(e), w && w.d(), C && C.d(), E && E.d(), j = false, x();
  } };
}
function wn(n) {
  let e, t = n[1] && Pe(n);
  return { c() {
    t && t.c(), e = Ie();
  }, m(r, s) {
    t && t.m(r, s), L(r, e, s);
  }, p(r, [s]) {
    r[1] ? t ? t.p(r, s) : (t = Pe(r), t.c(), t.m(e.parentNode, e)) : t && (t.d(1), t = null);
  }, i: v, o: v, d(r) {
    r && $(e), t && t.d(r);
  } };
}
function yn(n, e, t) {
  let r, s, i, l, o;
  F(n, xe, (d) => t(8, s = d)), F(n, Q, (d) => t(6, i = d)), F(n, Fe, (d) => t(1, l = d)), F(n, it, (d) => t(2, o = d));
  const a = Oe("GAME_ENGINE");
  function c() {
    Fe.set(false);
  }
  async function g(d, _) {
    await a.loadLevel(_ + 1), c();
  }
  function p(d) {
    return s.includes(d);
  }
  const h = (d, _) => g(d, _);
  return n.$$.update = () => {
    n.$$.dirty & 64 && t(0, r = i.currentLevel);
  }, [r, l, o, c, g, p, i, h];
}
class $n extends q {
  constructor(e) {
    super(), N(this, e, yn, wn, O, {});
  }
}
function Ye(n) {
  let e, t, r, s = n[1] && Qe(n);
  return { c() {
    e = m("div"), t = m("strong"), t.textContent = "Level Complete!", r = y(), s && s.c(), f(e, "class", "banner svelte-1uymdtg"), f(e, "data-element-id", "level-complete-banner");
  }, m(i, l) {
    L(i, e, l), u(e, t), u(e, r), s && s.m(e, null);
  }, p(i, l) {
    i[1] ? s ? s.p(i, l) : (s = Qe(i), s.c(), s.m(e, null)) : s && (s.d(1), s = null);
  }, d(i) {
    i && $(e), s && s.d();
  } };
}
function Qe(n) {
  let e, t = n[1].name + "", r;
  return { c() {
    e = m("span"), r = I(t);
  }, m(s, i) {
    L(s, e, i), u(e, r);
  }, p(s, i) {
    i & 2 && t !== (t = s[1].name + "") && W(r, t);
  }, d(s) {
    s && $(e);
  } };
}
function kn(n) {
  let e, t = n[0].status === "LevelComplete" && Ye(n);
  return { c() {
    t && t.c(), e = Ie();
  }, m(r, s) {
    t && t.m(r, s), L(r, e, s);
  }, p(r, [s]) {
    r[0].status === "LevelComplete" ? t ? t.p(r, s) : (t = Ye(r), t.c(), t.m(e.parentNode, e)) : t && (t.d(1), t = null);
  }, i: v, o: v, d(r) {
    r && $(e), t && t.d(r);
  } };
}
function En(n, e, t) {
  let r, s;
  return F(n, Q, (i) => t(0, r = i)), F(n, Ne, (i) => t(1, s = i)), [r, s];
}
class Ln extends q {
  constructor(e) {
    super(), N(this, e, En, kn, O, {});
  }
}
function Sn(n) {
  let e, t, r, s, i, l, o, a, c, g, p;
  return t = new Bt({}), s = new Ln({}), l = new Qt({}), a = new pn({}), g = new $n({}), { c() {
    e = m("div"), G(t.$$.fragment), r = y(), G(s.$$.fragment), i = y(), G(l.$$.fragment), o = y(), G(a.$$.fragment), c = y(), G(g.$$.fragment), f(e, "class", "game-container svelte-1t5xe4u");
  }, m(h, d) {
    L(h, e, d), M(t, e, null), u(e, r), M(s, e, null), u(e, i), M(l, e, null), u(e, o), M(a, e, null), u(e, c), M(g, e, null), p = true;
  }, p: v, i(h) {
    p || (S(t.$$.fragment, h), S(s.$$.fragment, h), S(l.$$.fragment, h), S(a.$$.fragment, h), S(g.$$.fragment, h), p = true);
  }, o(h) {
    A(t.$$.fragment, h), A(s.$$.fragment, h), A(l.$$.fragment, h), A(a.$$.fragment, h), A(g.$$.fragment, h), p = false;
  }, d(h) {
    h && $(e), z(t), z(s), z(l), z(a), z(g);
  } };
}
class Cn extends q {
  constructor(e) {
    super(), N(this, e, null, Sn, O, {});
  }
}
function An(n) {
  let e, t;
  return e = new Cn({}), { c() {
    G(e.$$.fragment);
  }, m(r, s) {
    M(e, r, s), t = true;
  }, p: v, i(r) {
    t || (S(e.$$.fragment, r), t = true);
  }, o(r) {
    A(e.$$.fragment, r), t = false;
  }, d(r) {
    z(e, r);
  } };
}
function ge(n) {
  return n === void 0 ? true : pe(n);
}
function pe(n) {
  return Array.isArray(n) && n.every((e) => lt(e));
}
function lt(n) {
  if (!n || typeof n != "object") return false;
  const e = n;
  return ne(e.x) && ne(e.y);
}
function xn(n) {
  if (!n || typeof n != "object") return false;
  const e = n;
  return ne(e.width) && ne(e.height);
}
function ne(n) {
  return typeof n == "number" && Number.isFinite(n);
}
function Fn(n, e, t) {
  let r, s;
  F(n, Ne, (d) => t(1, r = d)), F(n, Q, (d) => t(2, s = d));
  const i = new xt();
  ft("GAME_ENGINE", i);
  let l, o = null;
  tt(async () => {
    const d = new URLSearchParams(window.location.search), _ = parseInt(d.get("level") || "1", 10), k = d.get("levelsUrl"), j = d.get("test") === "true";
    It(i), l = new Mt(i), l.attach(), xe.set(Ue.getCompletedLevels());
    let x = null;
    if (j) {
      const w = await c();
      x = w.levels, x || fe.set(w.error ?? "Failed to load test level. Make sure the test server is running on port 3001.");
    } else if (k) {
      const w = await a(k);
      x = w.levels, x || fe.set(w.error ?? `Failed to load levels from ${k}. Using default levels instead.`);
    }
    await i.init(x, _), it.set(i.getLevels());
  }), ut(() => {
    l && l.detach();
  });
  async function a(d) {
    try {
      const _ = await fetch(d);
      if (!_.ok) return { levels: null, error: `Failed to fetch levels (${_.status}). Using default levels instead.` };
      const k = await _.json();
      return p(k) ? { levels: k } : { levels: null, error: "Levels file has an invalid schema. Using default levels instead." };
    } catch (_) {
      return console.error("Failed to fetch custom levels", _), { levels: null, error: "Network, CORS, or JSON error while loading levels. Using default levels instead." };
    }
  }
  async function c() {
    try {
      const d = await fetch("http://localhost:3001/api/test-level");
      if (!d.ok) return { levels: null, error: `Failed to fetch test level (${d.status}). Make sure the test server is running (npm run server).` };
      const _ = await d.json();
      return h(_) ? { levels: [_] } : { levels: null, error: "Test level has an invalid schema." };
    } catch (d) {
      return console.error("Failed to fetch test level", d), { levels: null, error: "Failed to connect to test server. Make sure it is running on port 3001 (npm run server)." };
    }
  }
  const g = /* @__PURE__ */ new Set(["North", "South", "East", "West"]);
  function p(d) {
    return Array.isArray(d) ? d.every((_) => h(_)) : false;
  }
  function h(d) {
    if (!d || typeof d != "object") return false;
    const _ = d;
    return !(!ne(_.id) || typeof _.name != "string" || _.difficulty !== void 0 && typeof _.difficulty != "string" || !xn(_.gridSize) || !pe(_.snake) || !pe(_.obstacles) || !pe(_.food) || !lt(_.exit) || typeof _.snakeDirection != "string" || !g.has(_.snakeDirection) || !ge(_.floatingFood) || !ge(_.fallingFood) || !ge(_.stones) || !ge(_.spikes) || _.exitIsSolid !== void 0 && typeof _.exitIsSolid != "boolean" || !ne(_.totalFood));
  }
  return n.$$.update = () => {
    if (n.$$.dirty & 7) {
      if (s.status !== "LevelComplete") t(0, o = null);
      else if (r && o !== r.id) {
        t(0, o = r.id);
        const d = Ue.markCompleted(r.id);
        xe.set(d);
      }
    }
  }, [o, r, s];
}
class In extends q {
  constructor(e) {
    super(), N(this, e, Fn, An, O, {});
  }
}
new In({ target: document.getElementById("app") });
