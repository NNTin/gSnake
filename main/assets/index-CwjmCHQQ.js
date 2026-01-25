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
function h() {
}
function Ze(n) {
  return n();
}
function qe() {
  return /* @__PURE__ */ Object.create(null);
}
function Y(n) {
  n.forEach(Ze);
}
function et(n) {
  return typeof n == "function";
}
function I(n, e) {
  return n != n ? e == e : n !== e || n && typeof n == "object" || typeof n == "function";
}
function at(n) {
  return Object.keys(n).length === 0;
}
function ct(n, ...e) {
  if (n == null) {
    for (const r of e) r(void 0);
    return h;
  }
  const t = n.subscribe(...e);
  return t.unsubscribe ? () => t.unsubscribe() : t;
}
function x(n, e, t) {
  n.$$.on_destroy.push(ct(e, t));
}
function be(n) {
  return n ?? "";
}
function u(n, e) {
  n.appendChild(e);
}
function E(n, e, t) {
  n.insertBefore(e, t || null);
}
function y(n) {
  n.parentNode && n.parentNode.removeChild(n);
}
function tt(n, e) {
  for (let t = 0; t < n.length; t += 1) n[t] && n[t].d(e);
}
function m(n) {
  return document.createElement(n);
}
function F(n) {
  return document.createTextNode(n);
}
function w() {
  return F(" ");
}
function Ie() {
  return F("");
}
function D(n, e, t, r) {
  return n.addEventListener(e, t, r), () => n.removeEventListener(e, t, r);
}
function d(n, e, t) {
  t == null ? n.removeAttribute(e) : n.getAttribute(e) !== t && n.setAttribute(e, t);
}
function ut(n) {
  return Array.from(n.childNodes);
}
function T(n, e) {
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
function nt(n) {
  we().$$.on_mount.push(n);
}
function ft(n) {
  we().$$.on_destroy.push(n);
}
function dt(n, e) {
  return we().$$.context.set(n, e), e;
}
function Oe(n) {
  return we().$$.context.get(n);
}
const ee = [], Ee = [];
let te = [];
const Re = [], _t = Promise.resolve();
let Le = false;
function gt() {
  Le || (Le = true, _t.then(rt));
}
function Se(n) {
  te.push(n);
}
const ye = /* @__PURE__ */ new Set();
let X = 0;
function rt() {
  if (X !== 0) return;
  const n = ce;
  do {
    try {
      for (; X < ee.length; ) {
        const e = ee[X];
        X++, le(e), mt(e.$$);
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
function mt(n) {
  if (n.fragment !== null) {
    n.update(), Y(n.before_update);
    const e = n.dirty;
    n.dirty = [-1], n.fragment && n.fragment.p(n.ctx, e), n.after_update.forEach(Se);
  }
}
function pt(n) {
  const e = [], t = [];
  te.forEach((r) => n.indexOf(r) === -1 ? e.push(r) : t.push(r)), t.forEach((r) => r()), te = e;
}
const ge = /* @__PURE__ */ new Set();
let K;
function ze() {
  K = { r: 0, c: [], p: K };
}
function Me() {
  K.r || Y(K.c), K = K.p;
}
function L(n, e) {
  n && n.i && (ge.delete(n), n.i(e));
}
function A(n, e, t, r) {
  if (n && n.o) {
    if (ge.has(n)) return;
    ge.add(n), K.c.push(() => {
      ge.delete(n), r && (t && n.d(1), r());
    }), n.o(e);
  } else r && r();
}
function he(n) {
  return (n == null ? void 0 : n.length) !== void 0 ? n : Array.from(n);
}
function G(n) {
  n && n.c();
}
function O(n, e, t) {
  const { fragment: r, after_update: s } = n.$$;
  r && r.m(e, t), Se(() => {
    const i = n.$$.on_mount.map(Ze).filter(et);
    n.$$.on_destroy ? n.$$.on_destroy.push(...i) : Y(i), n.$$.on_mount = [];
  }), s.forEach(Se);
}
function z(n, e) {
  const t = n.$$;
  t.fragment !== null && (pt(t.after_update), Y(t.on_destroy), t.fragment && t.fragment.d(e), t.on_destroy = t.fragment = null, t.ctx = []);
}
function bt(n, e) {
  n.$$.dirty[0] === -1 && (ee.push(n), gt(), n.$$.dirty.fill(0)), n.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function M(n, e, t, r, s, i, l = null, o = [-1]) {
  const a = ce;
  le(n);
  const c = n.$$ = { fragment: null, ctx: [], props: i, update: h, not_equal: s, bound: qe(), on_mount: [], on_destroy: [], on_disconnect: [], before_update: [], after_update: [], context: new Map(e.context || (a ? a.$$.context : [])), callbacks: qe(), dirty: o, skip_bound: false, root: e.target || a.$$.root };
  l && l(c.root);
  let g = false;
  if (c.ctx = t ? t(n, e.props || {}, (p, _, ...f) => {
    const v = f.length ? f[0] : _;
    return c.ctx && s(c.ctx[p], c.ctx[p] = v) && (!c.skip_bound && c.bound[p] && c.bound[p](v), g && bt(n, p)), _;
  }) : [], c.update(), g = true, Y(c.before_update), c.fragment = r ? r(c.ctx) : false, e.target) {
    if (e.hydrate) {
      const p = ut(e.target);
      c.fragment && c.fragment.l(p), p.forEach(y);
    } else c.fragment && c.fragment.c();
    e.intro && L(n.$$.fragment), O(n, e.target, e.anchor), rt();
  }
  le(a);
}
class N {
  constructor() {
    __publicField(this, "$$");
    __publicField(this, "$$set");
  }
  $destroy() {
    z(this, 1), this.$destroy = h;
  }
  $on(e, t) {
    if (!et(t)) return h;
    const r = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
    return r.push(t), () => {
      const s = r.indexOf(t);
      s !== -1 && r.splice(s, 1);
    };
  }
  $set(e) {
    this.$$set && !at(e) && (this.$$.skip_bound = true, this.$$set(e), this.$$.skip_bound = false);
  }
}
const ht = "4";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(ht);
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
    if (e[2]) throw j(e[1]);
    return j(e[0]);
  }
  getGameState() {
    const e = b.wasmgameengine_getGameState(this.__wbg_ptr);
    if (e[2]) throw j(e[1]);
    return j(e[0]);
  }
  getLevel() {
    const e = b.wasmgameengine_getLevel(this.__wbg_ptr);
    if (e[2]) throw j(e[1]);
    return j(e[0]);
  }
  constructor(e) {
    const t = b.wasmgameengine_new(e);
    if (t[2]) throw j(t[1]);
    return this.__wbg_ptr = t[0] >>> 0, Ge.register(this, this.__wbg_ptr, this), this;
  }
  onFrame(e) {
    b.wasmgameengine_onFrame(this.__wbg_ptr, e);
  }
  processMove(e) {
    const t = b.wasmgameengine_processMove(this.__wbg_ptr, e);
    if (t[2]) throw j(t[1]);
    return j(t[0]);
  }
};
Symbol.dispose && (Ce.prototype[Symbol.dispose] = Ce.prototype.free);
function vt() {
  const n = b.getLevels();
  if (n[2]) throw j(n[1]);
  return j(n[0]);
}
function wt(n) {
  const e = ie(n, b.__wbindgen_malloc, b.__wbindgen_realloc), t = J;
  b.log(e, t);
}
function yt() {
  return { __proto__: null, "./gsnake_wasm_bg.js": { __proto__: null, __wbg_Error_8c4e43fe74559d73: function(e, t) {
    return Error(fe(e, t));
  }, __wbg_Number_04624de7d0e8332d: function(e) {
    return Number(e);
  }, __wbg_String_8f0eb39a4a4c2f66: function(e, t) {
    const r = String(t), s = ie(r, b.__wbindgen_malloc, b.__wbindgen_realloc), i = J;
    B().setInt32(e + 4, i, true), B().setInt32(e + 0, s, true);
  }, __wbg___wbindgen_boolean_get_bbbb1c18aa2f5e25: function(e) {
    const t = e, r = typeof t == "boolean" ? t : void 0;
    return de(r) ? 16777215 : r ? 1 : 0;
  }, __wbg___wbindgen_debug_string_0bc8482c6e3508ae: function(e, t) {
    const r = Ae(t), s = ie(r, b.__wbindgen_malloc, b.__wbindgen_realloc), i = J;
    B().setInt32(e + 4, i, true), B().setInt32(e + 0, s, true);
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
    B().setFloat64(e + 8, de(s) ? 0 : s, true), B().setInt32(e + 0, !de(s), true);
  }, __wbg___wbindgen_string_get_72fb696202c56729: function(e, t) {
    const r = t, s = typeof r == "string" ? r : void 0;
    var i = de(s) ? 0 : ie(s, b.__wbindgen_malloc, b.__wbindgen_realloc), l = J;
    B().setInt32(e + 4, l, true), B().setInt32(e + 0, i, true);
  }, __wbg___wbindgen_throw_be289d5034ed271b: function(e, t) {
    throw new Error(fe(e, t));
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
      r = e, s = t, console.error(fe(e, t));
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
    B().setInt32(e + 4, i, true), B().setInt32(e + 0, s, true);
  }, __wbg_value_0546255b415e96c1: function(e) {
    return e.value;
  }, __wbindgen_cast_0000000000000001: function(e) {
    return e;
  }, __wbindgen_cast_0000000000000002: function(e, t) {
    return fe(e, t);
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
function B() {
  return (V === null || V.buffer.detached === true || V.buffer.detached === void 0 && V.buffer !== b.memory.buffer) && (V = new DataView(b.memory.buffer)), V;
}
function fe(n, e) {
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
function de(n) {
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
function j(n) {
  const e = b.__wbindgen_externrefs.get(n);
  return b.__externref_table_dealloc(n), e;
}
let me = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
me.decode();
const Et = 2146435072;
let $e = 0;
function Lt(n, e) {
  return $e += e, $e >= Et && (me = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true }), me.decode(), $e = e), me.decode(oe().subarray(n, n + e));
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
async function Ue(n) {
  if (b !== void 0) return b;
  n !== void 0 && (Object.getPrototypeOf(n) === Object.prototype ? { module_or_path: n } = n : console.warn("using deprecated parameters for the initialization function; pass a single object instead")), n === void 0 && (n = new URL("/gSnake/main/assets/gsnake_wasm_bg-Q3z57T_B.wasm", import.meta.url));
  const e = yt();
  (typeof n == "string" || typeof Request == "function" && n instanceof Request || typeof URL == "function" && n instanceof URL) && (n = fetch(n));
  const { instance: t, module: r } = await Ct(await n, e);
  return St(t);
}
class At {
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
      await Ue();
    } catch (r) {
      console.error("WASM init failed, retrying once:", r);
      try {
        await Ue();
      } catch (s) {
        throw this.handleContractError(s, "Failed to initialize WASM module", "initializationFailed"), s;
      }
    }
    wt("gSnake WASM engine initialized");
    try {
      this.levels = e ?? vt();
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
function P(n, e = h) {
  let t;
  const r = /* @__PURE__ */ new Set();
  function s(o) {
    if (I(n, o) && (n = o, t)) {
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
  function l(o, a = h) {
    const c = [o, a];
    return r.add(c), r.size === 1 && (t = e(s, i) || h), o(n), () => {
      r.delete(c), r.size === 0 && t && (t(), t = null);
    };
  }
  return { set: s, update: i, subscribe: l };
}
const Q = P({ status: "Playing", currentLevel: 1, moves: 0, foodCollected: 0, totalFood: 0 }), st = P(0), Ne = P(null), it = P(null), ue = P(null), lt = P([]), xe = P([]), Fe = P(false), ve = P(null);
function xt() {
  return typeof window > "u" ? false : new URLSearchParams(window.location.search).get("contractTest") === "1";
}
function We(n) {
  if (!xt()) return;
  const e = window, t = e.__gsnakeContract ?? {};
  e.__gsnakeContract = { ...t, ...n };
}
function Ft(n) {
  n.addEventListener((e) => {
    switch (e.type) {
      case "levelChanged":
        Ne.set(e.level);
        break;
      case "frameChanged":
        it.set(e.frame), Q.set(e.frame.state), st.set(It(e.frame)), ue.set(null), We({ frame: e.frame, error: null });
        break;
      case "engineError":
        ue.set(e.error), We({ error: e.error });
        break;
    }
  });
}
function It(n) {
  let e = 0;
  for (const t of n.grid) for (const r of t) (r === "SnakeHead" || r === "SnakeBody") && (e += 1);
  return e;
}
class Ot {
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
class je {
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
  let e, t, r, s, i, l = n[0].currentLevel + "", o, a, c, g, p, _, f, v, S, q, U, $, C = n[0].moves + "", k;
  return { c() {
    e = m("div"), t = m("div"), r = m("span"), r.textContent = "Level", s = w(), i = m("span"), o = F(l), a = w(), c = m("div"), g = m("span"), g.textContent = "Length", p = w(), _ = m("span"), f = F(n[1]), v = w(), S = m("div"), q = m("span"), q.textContent = "Moves", U = w(), $ = m("span"), k = F(C), d(r, "class", "score-label svelte-1dkg50z"), d(i, "class", "score-value svelte-1dkg50z"), d(i, "data-element-id", "level-display"), d(t, "class", "score-item svelte-1dkg50z"), d(g, "class", "score-label svelte-1dkg50z"), d(_, "class", "score-value svelte-1dkg50z"), d(_, "data-element-id", "length-display"), d(c, "class", "score-item svelte-1dkg50z"), d(q, "class", "score-label svelte-1dkg50z"), d($, "class", "score-value svelte-1dkg50z"), d($, "data-element-id", "moves-display"), d(S, "class", "score-item svelte-1dkg50z"), d(e, "class", "score-info svelte-1dkg50z");
  }, m(R, W) {
    E(R, e, W), u(e, t), u(t, r), u(t, s), u(t, i), u(i, o), u(e, a), u(e, c), u(c, g), u(c, p), u(c, _), u(_, f), u(e, v), u(e, S), u(S, q), u(S, U), u(S, $), u($, k);
  }, p(R, [W]) {
    W & 1 && l !== (l = R[0].currentLevel + "") && T(o, l), W & 2 && T(f, R[1]), W & 1 && C !== (C = R[0].moves + "") && T(k, C);
  }, i: h, o: h, d(R) {
    R && y(e);
  } };
}
function Mt(n, e, t) {
  let r, s;
  return x(n, Q, (i) => t(0, r = i)), x(n, st, (i) => t(1, s = i)), [r, s];
}
class Nt extends N {
  constructor(e) {
    super(), M(this, e, Mt, zt, I, {});
  }
}
function qt(n) {
  let e, t, r;
  return { c() {
    e = m("button"), e.textContent = "Restart", d(e, "class", "restart-btn svelte-11sh8jp"), d(e, "data-element-id", "restart-button");
  }, m(s, i) {
    E(s, e, i), t || (r = D(e, "click", n[0]), t = true);
  }, p: h, i: h, o: h, d(s) {
    s && y(e), t = false, r();
  } };
}
function Rt(n) {
  const e = Oe("GAME_ENGINE");
  function t() {
    var _a;
    e.restartLevel(), (_a = document.activeElement) == null ? void 0 : _a.blur();
  }
  return [t];
}
class Gt extends N {
  constructor(e) {
    super(), M(this, e, Rt, qt, I, {});
  }
}
function Ut(n) {
  let e, t, r;
  return { c() {
    e = m("button"), e.textContent = "Levels", d(e, "class", "level-selector-btn svelte-hz9znr"), d(e, "data-element-id", "level-selector-btn");
  }, m(s, i) {
    E(s, e, i), t || (r = D(e, "click", n[0]), t = true);
  }, p: h, i: h, o: h, d(s) {
    s && y(e), t = false, r();
  } };
}
function Wt(n) {
  function e() {
    Fe.update((t) => !t);
  }
  return [e];
}
class jt extends N {
  constructor(e) {
    super(), M(this, e, Wt, Ut, I, {});
  }
}
function Bt(n) {
  let e, t, r, s, i, l, o, a;
  return t = new Nt({}), i = new jt({}), o = new Gt({}), { c() {
    e = m("div"), G(t.$$.fragment), r = w(), s = m("div"), G(i.$$.fragment), l = w(), G(o.$$.fragment), d(s, "class", "header-actions svelte-g4zqdl"), d(e, "class", "header svelte-g4zqdl");
  }, m(c, g) {
    E(c, e, g), O(t, e, null), u(e, r), u(e, s), O(i, s, null), u(s, l), O(o, s, null), a = true;
  }, p: h, i(c) {
    a || (L(t.$$.fragment, c), L(i.$$.fragment, c), L(o.$$.fragment, c), a = true);
  }, o(c) {
    A(t.$$.fragment, c), A(i.$$.fragment, c), A(o.$$.fragment, c), a = false;
  }, d(c) {
    c && y(e), z(t), z(i), z(o);
  } };
}
class Tt extends N {
  constructor(e) {
    super(), M(this, e, null, Bt, I, {});
  }
}
function Dt(n) {
  let e, t;
  return { c() {
    e = m("div"), d(e, "class", t = "cell " + n[0] + " svelte-yltpn2");
  }, m(r, s) {
    E(r, e, s);
  }, p(r, [s]) {
    s & 1 && t !== (t = "cell " + r[0] + " svelte-yltpn2") && d(e, "class", t);
  }, i: h, o: h, d(r) {
    r && y(e);
  } };
}
function Pt(n) {
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
function Ht(n, e, t) {
  let r, { type: s } = e;
  return n.$$set = (i) => {
    "type" in i && t(1, s = i.type);
  }, n.$$.update = () => {
    n.$$.dirty & 2 && t(0, r = Pt(s));
  }, [r, s];
}
class Vt extends N {
  constructor(e) {
    super(), M(this, e, Ht, Dt, I, { type: 1 });
  }
}
function Be(n, e, t) {
  const r = n.slice();
  return r[5] = e[t], r;
}
function Te(n) {
  let e, t;
  return e = new Vt({ props: { type: n[5] } }), { c() {
    G(e.$$.fragment);
  }, m(r, s) {
    O(e, r, s), t = true;
  }, p(r, s) {
    const i = {};
    s & 1 && (i.type = r[5]), e.$set(i);
  }, i(r) {
    t || (L(e.$$.fragment, r), t = true);
  }, o(r) {
    A(e.$$.fragment, r), t = false;
  }, d(r) {
    z(e, r);
  } };
}
function Kt(n) {
  let e, t, r, s = he(n[0]), i = [];
  for (let o = 0; o < s.length; o += 1) i[o] = Te(Be(n, s, o));
  const l = (o) => A(i[o], 1, 1, () => {
    i[o] = null;
  });
  return { c() {
    e = m("div");
    for (let o = 0; o < i.length; o += 1) i[o].c();
    d(e, "class", "game-field svelte-2ydslf"), d(e, "data-element-id", "game-field"), d(e, "style", t = `grid-template-columns: repeat(${n[2]}, 1fr); grid-template-rows: repeat(${n[1]}, 1fr);`);
  }, m(o, a) {
    E(o, e, a);
    for (let c = 0; c < i.length; c += 1) i[c] && i[c].m(e, null);
    r = true;
  }, p(o, [a]) {
    if (a & 1) {
      s = he(o[0]);
      let c;
      for (c = 0; c < s.length; c += 1) {
        const g = Be(o, s, c);
        i[c] ? (i[c].p(g, a), L(i[c], 1)) : (i[c] = Te(g), i[c].c(), L(i[c], 1), i[c].m(e, null));
      }
      for (ze(), c = s.length; c < i.length; c += 1) l(c);
      Me();
    }
    (!r || a & 6 && t !== (t = `grid-template-columns: repeat(${o[2]}, 1fr); grid-template-rows: repeat(${o[1]}, 1fr);`)) && d(e, "style", t);
  }, i(o) {
    if (!r) {
      for (let a = 0; a < s.length; a += 1) L(i[a]);
      r = true;
    }
  }, o(o) {
    i = i.filter(Boolean);
    for (let a = 0; a < i.length; a += 1) A(i[a]);
    r = false;
  }, d(o) {
    o && y(e), tt(i, o);
  } };
}
function Jt(n, e, t) {
  let r, s, i, l, o;
  return x(n, it, (a) => t(4, o = a)), n.$$.update = () => {
    var _a;
    n.$$.dirty & 16 && t(3, r = (o == null ? void 0 : o.grid) ?? []), n.$$.dirty & 8 && t(2, s = ((_a = r[0]) == null ? void 0 : _a.length) ?? 0), n.$$.dirty & 8 && t(1, i = r.length), n.$$.dirty & 8 && t(0, l = r.flat());
  }, [l, i, s, r, o];
}
class Yt extends N {
  constructor(e) {
    super(), M(this, e, Jt, Kt, I, {});
  }
}
function Qt(n) {
  let e, t, r, s, i, l, o, a, c;
  return { c() {
    e = m("div"), t = m("h2"), t.textContent = "Game Over", r = w(), s = m("div"), i = m("button"), i.textContent = "Restart Level", l = w(), o = m("button"), o.textContent = "Back to Level 1", d(t, "class", "svelte-r80wre"), d(i, "class", "modal-btn primary svelte-r80wre"), d(i, "data-element-id", "restart-level-btn"), d(o, "class", "modal-btn secondary svelte-r80wre"), d(o, "data-element-id", "back-to-level1-btn"), d(s, "class", "modal-buttons svelte-r80wre"), d(e, "class", "modal svelte-r80wre");
  }, m(g, p) {
    E(g, e, p), u(e, t), u(e, r), u(e, s), u(s, i), n[3](i), u(s, l), u(s, o), a || (c = [D(i, "click", n[1]), D(o, "click", n[2])], a = true);
  }, p: h, i: h, o: h, d(g) {
    g && y(e), n[3](null), a = false, Y(c);
  } };
}
function Xt(n, e, t) {
  const r = Oe("GAME_ENGINE");
  let s;
  nt(() => {
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
class Zt extends N {
  constructor(e) {
    super(), M(this, e, Xt, Qt, I, {});
  }
}
function en(n) {
  let e;
  return { c() {
    e = m("div"), e.innerHTML = '<h2 class="svelte-q2s5gm">All Levels Complete!</h2> <p style="margin: 15px 0; color: #666;">Congratulations! You&#39;ve beaten all levels.</p> <p style="font-size: 12px; color: #999;">Refresh the page to play again.</p>', d(e, "class", "modal svelte-q2s5gm");
  }, m(t, r) {
    E(t, e, r);
  }, p: h, i: h, o: h, d(t) {
    t && y(e);
  } };
}
class tn extends N {
  constructor(e) {
    super(), M(this, e, null, en, I, {});
  }
}
function nn(n) {
  var _a, _b;
  let e, t, r, s, i = (((_a = n[0]) == null ? void 0 : _a.message) ?? "Unexpected engine error.") + "", l, o, a, c, g, p = (((_b = n[0]) == null ? void 0 : _b.kind) ?? "internalError") + "", _, f, v, S, q, U, $, C;
  return { c() {
    e = m("div"), t = m("h2"), t.textContent = "Engine Error", r = w(), s = m("p"), l = F(i), o = w(), a = m("p"), c = F("Kind: "), g = m("span"), _ = F(p), f = w(), v = m("div"), S = m("button"), S.textContent = "Reload", q = w(), U = m("button"), U.textContent = "Dismiss", d(t, "class", "svelte-1x0qq8p"), d(s, "class", "message svelte-1x0qq8p"), d(g, "class", "svelte-1x0qq8p"), d(a, "class", "detail svelte-1x0qq8p"), d(S, "class", "modal-btn primary svelte-1x0qq8p"), d(U, "class", "modal-btn secondary svelte-1x0qq8p"), d(v, "class", "modal-buttons svelte-1x0qq8p"), d(e, "class", "modal svelte-1x0qq8p"), d(e, "data-element-id", "engine-error-modal");
  }, m(k, R) {
    E(k, e, R), u(e, t), u(e, r), u(e, s), u(s, l), u(e, o), u(e, a), u(a, c), u(a, g), u(g, _), u(e, f), u(e, v), u(v, S), u(v, q), u(v, U), $ || (C = [D(S, "click", rn), D(U, "click", n[1])], $ = true);
  }, p(k, [R]) {
    var _a2, _b2;
    R & 1 && i !== (i = (((_a2 = k[0]) == null ? void 0 : _a2.message) ?? "Unexpected engine error.") + "") && T(l, i), R & 1 && p !== (p = (((_b2 = k[0]) == null ? void 0 : _b2.kind) ?? "internalError") + "") && T(_, p);
  }, i: h, o: h, d(k) {
    k && y(e), $ = false, Y(C);
  } };
}
function rn() {
  window.location.reload();
}
function sn(n, e, t) {
  let r;
  x(n, ue, (i) => t(0, r = i));
  function s() {
    ue.set(null);
  }
  return [r, s];
}
class ln extends N {
  constructor(e) {
    super(), M(this, e, sn, nn, I, {});
  }
}
function on(n) {
  let e, t, r, s, i, l, o, a, c;
  return { c() {
    e = m("div"), t = m("h2"), t.textContent = "Level Load Failed", r = w(), s = m("p"), i = F(n[0]), l = w(), o = m("button"), o.textContent = "Continue", d(o, "class", "modal-btn svelte-10hk6qk"), d(e, "class", "modal svelte-10hk6qk");
  }, m(g, p) {
    E(g, e, p), u(e, t), u(e, r), u(e, s), u(s, i), u(e, l), u(e, o), a || (c = D(o, "click", n[1]), a = true);
  }, p(g, [p]) {
    p & 1 && T(i, g[0]);
  }, i: h, o: h, d(g) {
    g && y(e), a = false, c();
  } };
}
function an(n, e, t) {
  let r;
  x(n, ve, (i) => t(0, r = i));
  function s() {
    ve.set(null);
  }
  return [r, s];
}
class cn extends N {
  constructor(e) {
    super(), M(this, e, an, on, I, {});
  }
}
function De(n) {
  let e, t, r, s;
  const i = [_n, dn, fn, un], l = [];
  function o(a, c) {
    return a[3] ? 0 : a[2] ? 1 : a[1] ? 2 : a[0] ? 3 : -1;
  }
  return ~(t = o(n)) && (r = l[t] = i[t](n)), { c() {
    e = m("div"), r && r.c(), d(e, "class", "overlay active svelte-16e68es"), d(e, "data-element-id", "overlay");
  }, m(a, c) {
    E(a, e, c), ~t && l[t].m(e, null), s = true;
  }, p(a, c) {
    let g = t;
    t = o(a), t !== g && (r && (ze(), A(l[g], 1, 1, () => {
      l[g] = null;
    }), Me()), ~t ? (r = l[t], r || (r = l[t] = i[t](a), r.c()), L(r, 1), r.m(e, null)) : r = null);
  }, i(a) {
    s || (L(r), s = true);
  }, o(a) {
    A(r), s = false;
  }, d(a) {
    a && y(e), ~t && l[t].d();
  } };
}
function un(n) {
  let e, t;
  return e = new tn({}), { c() {
    G(e.$$.fragment);
  }, m(r, s) {
    O(e, r, s), t = true;
  }, i(r) {
    t || (L(e.$$.fragment, r), t = true);
  }, o(r) {
    A(e.$$.fragment, r), t = false;
  }, d(r) {
    z(e, r);
  } };
}
function fn(n) {
  let e, t;
  return e = new Zt({}), { c() {
    G(e.$$.fragment);
  }, m(r, s) {
    O(e, r, s), t = true;
  }, i(r) {
    t || (L(e.$$.fragment, r), t = true);
  }, o(r) {
    A(e.$$.fragment, r), t = false;
  }, d(r) {
    z(e, r);
  } };
}
function dn(n) {
  let e, t;
  return e = new ln({}), { c() {
    G(e.$$.fragment);
  }, m(r, s) {
    O(e, r, s), t = true;
  }, i(r) {
    t || (L(e.$$.fragment, r), t = true);
  }, o(r) {
    A(e.$$.fragment, r), t = false;
  }, d(r) {
    z(e, r);
  } };
}
function _n(n) {
  let e, t;
  return e = new cn({}), { c() {
    G(e.$$.fragment);
  }, m(r, s) {
    O(e, r, s), t = true;
  }, i(r) {
    t || (L(e.$$.fragment, r), t = true);
  }, o(r) {
    A(e.$$.fragment, r), t = false;
  }, d(r) {
    z(e, r);
  } };
}
function gn(n) {
  let e, t, r = n[4] && De(n);
  return { c() {
    r && r.c(), e = Ie();
  }, m(s, i) {
    r && r.m(s, i), E(s, e, i), t = true;
  }, p(s, [i]) {
    s[4] ? r ? (r.p(s, i), i & 16 && L(r, 1)) : (r = De(s), r.c(), L(r, 1), r.m(e.parentNode, e)) : r && (ze(), A(r, 1, 1, () => {
      r = null;
    }), Me());
  }, i(s) {
    t || (L(r), t = true);
  }, o(s) {
    A(r), t = false;
  }, d(s) {
    s && y(e), r && r.d(s);
  } };
}
function mn(n, e, t) {
  let r, s, i, l, o, a, c, g;
  return x(n, Q, (p) => t(5, a = p)), x(n, ue, (p) => t(6, c = p)), x(n, ve, (p) => t(7, g = p)), n.$$.update = () => {
    n.$$.dirty & 128 && t(3, r = g !== null), n.$$.dirty & 64 && t(2, s = c !== null), n.$$.dirty & 32 && t(1, i = a.status === "GameOver"), n.$$.dirty & 32 && t(0, l = a.status === "AllComplete"), n.$$.dirty & 15 && t(4, o = r || s || i || l);
  }, [l, i, s, r, o, a, c, g];
}
class pn extends N {
  constructor(e) {
    super(), M(this, e, mn, gn, I, {});
  }
}
function Pe(n, e, t) {
  const r = n.slice();
  return r[10] = e[t], r[12] = t, r;
}
function He(n) {
  let e, t, r, s, i, l, o, a, c;
  function g(f, v) {
    return f[2].length === 0 ? hn : bn;
  }
  let p = g(n), _ = p(n);
  return { c() {
    e = m("div"), t = m("div"), r = m("div"), s = m("div"), s.innerHTML = '<h2 class="svelte-1h9haes">Choose a Level</h2> <p class="svelte-1h9haes">Select a level to play. Completed levels are marked.</p>', i = w(), l = m("button"), l.textContent = "Close", o = w(), _.c(), d(l, "class", "close-btn svelte-1h9haes"), d(r, "class", "level-header svelte-1h9haes"), d(t, "class", "level-panel svelte-1h9haes"), d(e, "class", "level-overlay svelte-1h9haes"), d(e, "data-element-id", "level-selector-overlay");
  }, m(f, v) {
    E(f, e, v), u(e, t), u(t, r), u(r, s), u(r, i), u(r, l), u(t, o), _.m(t, null), a || (c = D(l, "click", n[3]), a = true);
  }, p(f, v) {
    p === (p = g(f)) && _ ? _.p(f, v) : (_.d(1), _ = p(f), _ && (_.c(), _.m(t, null)));
  }, d(f) {
    f && y(e), _.d(), a = false, c();
  } };
}
function bn(n) {
  let e, t = he(n[2]), r = [];
  for (let s = 0; s < t.length; s += 1) r[s] = Ye(Pe(n, t, s));
  return { c() {
    e = m("div");
    for (let s = 0; s < r.length; s += 1) r[s].c();
    d(e, "class", "level-grid svelte-1h9haes");
  }, m(s, i) {
    E(s, e, i);
    for (let l = 0; l < r.length; l += 1) r[l] && r[l].m(e, null);
  }, p(s, i) {
    if (i & 53) {
      t = he(s[2]);
      let l;
      for (l = 0; l < t.length; l += 1) {
        const o = Pe(s, t, l);
        r[l] ? r[l].p(o, i) : (r[l] = Ye(o), r[l].c(), r[l].m(e, null));
      }
      for (; l < r.length; l += 1) r[l].d(1);
      r.length = t.length;
    }
  }, d(s) {
    s && y(e), tt(r, s);
  } };
}
function hn(n) {
  let e;
  return { c() {
    e = m("div"), e.textContent = "No levels loaded.", d(e, "class", "empty-state svelte-1h9haes");
  }, m(t, r) {
    E(t, e, r);
  }, p: h, d(t) {
    t && y(e);
  } };
}
function Ve(n) {
  let e, t, r = n[10].difficulty + "", s, i, l;
  return { c() {
    e = m("div"), t = F("("), s = F(r), i = F(")"), d(e, "class", l = be(`level-difficulty difficulty-${n[10].difficulty}`) + " svelte-1h9haes");
  }, m(o, a) {
    E(o, e, a), u(e, t), u(e, s), u(e, i);
  }, p(o, a) {
    a & 4 && r !== (r = o[10].difficulty + "") && T(s, r), a & 4 && l !== (l = be(`level-difficulty difficulty-${o[10].difficulty}`) + " svelte-1h9haes") && d(e, "class", l);
  }, d(o) {
    o && y(e);
  } };
}
function Ke(n) {
  let e;
  return { c() {
    e = m("div"), e.textContent = "Completed", d(e, "class", "level-status svelte-1h9haes");
  }, m(t, r) {
    E(t, e, r);
  }, d(t) {
    t && y(e);
  } };
}
function Je(n) {
  let e;
  return { c() {
    e = m("div"), e.textContent = "Current", d(e, "class", "level-status current svelte-1h9haes");
  }, m(t, r) {
    E(t, e, r);
  }, d(t) {
    t && y(e);
  } };
}
function Ye(n) {
  let e, t, r, s = n[10].id + "", i, l, o, a = n[10].name + "", c, g, p, _ = n[5](n[10].id), f, v, S, q, U, $ = n[10].difficulty && Ve(n), C = _ && Ke(), k = n[10].id === n[0] && Je();
  function R() {
    return n[7](n[10], n[12]);
  }
  return { c() {
    e = m("button"), t = m("div"), r = F("Level "), i = F(s), l = w(), o = m("div"), c = F(a), g = w(), $ && $.c(), p = w(), C && C.c(), f = w(), k && k.c(), v = w(), d(t, "class", "level-number svelte-1h9haes"), d(o, "class", "level-name svelte-1h9haes"), d(e, "class", S = be(`level-card ${n[5](n[10].id) ? "completed" : ""} ${n[10].id === n[0] ? "current" : ""}`) + " svelte-1h9haes");
  }, m(W, H) {
    E(W, e, H), u(e, t), u(t, r), u(t, i), u(e, l), u(e, o), u(o, c), u(e, g), $ && $.m(e, null), u(e, p), C && C.m(e, null), u(e, f), k && k.m(e, null), u(e, v), q || (U = D(e, "click", R), q = true);
  }, p(W, H) {
    n = W, H & 4 && s !== (s = n[10].id + "") && T(i, s), H & 4 && a !== (a = n[10].name + "") && T(c, a), n[10].difficulty ? $ ? $.p(n, H) : ($ = Ve(n), $.c(), $.m(e, p)) : $ && ($.d(1), $ = null), H & 4 && (_ = n[5](n[10].id)), _ ? C || (C = Ke(), C.c(), C.m(e, f)) : C && (C.d(1), C = null), n[10].id === n[0] ? k || (k = Je(), k.c(), k.m(e, v)) : k && (k.d(1), k = null), H & 5 && S !== (S = be(`level-card ${n[5](n[10].id) ? "completed" : ""} ${n[10].id === n[0] ? "current" : ""}`) + " svelte-1h9haes") && d(e, "class", S);
  }, d(W) {
    W && y(e), $ && $.d(), C && C.d(), k && k.d(), q = false, U();
  } };
}
function vn(n) {
  let e, t = n[1] && He(n);
  return { c() {
    t && t.c(), e = Ie();
  }, m(r, s) {
    t && t.m(r, s), E(r, e, s);
  }, p(r, [s]) {
    r[1] ? t ? t.p(r, s) : (t = He(r), t.c(), t.m(e.parentNode, e)) : t && (t.d(1), t = null);
  }, i: h, o: h, d(r) {
    r && y(e), t && t.d(r);
  } };
}
function wn(n, e, t) {
  let r, s, i, l, o;
  x(n, xe, (f) => t(8, s = f)), x(n, Q, (f) => t(6, i = f)), x(n, Fe, (f) => t(1, l = f)), x(n, lt, (f) => t(2, o = f));
  const a = Oe("GAME_ENGINE");
  function c() {
    Fe.set(false);
  }
  async function g(f, v) {
    await a.loadLevel(v + 1), c();
  }
  function p(f) {
    return s.includes(f);
  }
  const _ = (f, v) => g(f, v);
  return n.$$.update = () => {
    n.$$.dirty & 64 && t(0, r = i.currentLevel);
  }, [r, l, o, c, g, p, i, _];
}
class yn extends N {
  constructor(e) {
    super(), M(this, e, wn, vn, I, {});
  }
}
function Qe(n) {
  let e, t, r, s = n[1] && Xe(n);
  return { c() {
    e = m("div"), t = m("strong"), t.textContent = "Level Complete!", r = w(), s && s.c(), d(e, "class", "banner svelte-1uymdtg"), d(e, "data-element-id", "level-complete-banner");
  }, m(i, l) {
    E(i, e, l), u(e, t), u(e, r), s && s.m(e, null);
  }, p(i, l) {
    i[1] ? s ? s.p(i, l) : (s = Xe(i), s.c(), s.m(e, null)) : s && (s.d(1), s = null);
  }, d(i) {
    i && y(e), s && s.d();
  } };
}
function Xe(n) {
  let e, t = n[1].name + "", r;
  return { c() {
    e = m("span"), r = F(t);
  }, m(s, i) {
    E(s, e, i), u(e, r);
  }, p(s, i) {
    i & 2 && t !== (t = s[1].name + "") && T(r, t);
  }, d(s) {
    s && y(e);
  } };
}
function $n(n) {
  let e, t = n[0].status === "LevelComplete" && Qe(n);
  return { c() {
    t && t.c(), e = Ie();
  }, m(r, s) {
    t && t.m(r, s), E(r, e, s);
  }, p(r, [s]) {
    r[0].status === "LevelComplete" ? t ? t.p(r, s) : (t = Qe(r), t.c(), t.m(e.parentNode, e)) : t && (t.d(1), t = null);
  }, i: h, o: h, d(r) {
    r && y(e), t && t.d(r);
  } };
}
function kn(n, e, t) {
  let r, s;
  return x(n, Q, (i) => t(0, r = i)), x(n, Ne, (i) => t(1, s = i)), [r, s];
}
class En extends N {
  constructor(e) {
    super(), M(this, e, kn, $n, I, {});
  }
}
function Ln(n) {
  let e, t, r, s, i, l, o, a, c, g, p;
  return t = new Tt({}), s = new En({}), l = new Yt({}), a = new pn({}), g = new yn({}), { c() {
    e = m("div"), G(t.$$.fragment), r = w(), G(s.$$.fragment), i = w(), G(l.$$.fragment), o = w(), G(a.$$.fragment), c = w(), G(g.$$.fragment), d(e, "class", "game-container svelte-1t5xe4u");
  }, m(_, f) {
    E(_, e, f), O(t, e, null), u(e, r), O(s, e, null), u(e, i), O(l, e, null), u(e, o), O(a, e, null), u(e, c), O(g, e, null), p = true;
  }, p: h, i(_) {
    p || (L(t.$$.fragment, _), L(s.$$.fragment, _), L(l.$$.fragment, _), L(a.$$.fragment, _), L(g.$$.fragment, _), p = true);
  }, o(_) {
    A(t.$$.fragment, _), A(s.$$.fragment, _), A(l.$$.fragment, _), A(a.$$.fragment, _), A(g.$$.fragment, _), p = false;
  }, d(_) {
    _ && y(e), z(t), z(s), z(l), z(a), z(g);
  } };
}
class Sn extends N {
  constructor(e) {
    super(), M(this, e, null, Ln, I, {});
  }
}
function Cn(n) {
  let e, t;
  return e = new Sn({}), { c() {
    G(e.$$.fragment);
  }, m(r, s) {
    O(e, r, s), t = true;
  }, p: h, i(r) {
    t || (L(e.$$.fragment, r), t = true);
  }, o(r) {
    A(e.$$.fragment, r), t = false;
  }, d(r) {
    z(e, r);
  } };
}
function _e(n) {
  return n === void 0 ? true : pe(n);
}
function pe(n) {
  return Array.isArray(n) && n.every((e) => ot(e));
}
function ot(n) {
  if (!n || typeof n != "object") return false;
  const e = n;
  return ne(e.x) && ne(e.y);
}
function An(n) {
  if (!n || typeof n != "object") return false;
  const e = n;
  return ne(e.width) && ne(e.height);
}
function ne(n) {
  return typeof n == "number" && Number.isFinite(n);
}
function xn(n, e, t) {
  let r, s;
  x(n, Ne, (_) => t(1, r = _)), x(n, Q, (_) => t(2, s = _));
  const i = new At();
  dt("GAME_ENGINE", i);
  let l, o = null;
  nt(async () => {
    const _ = new URLSearchParams(window.location.search), f = parseInt(_.get("level") || "1", 10), v = _.get("levelsUrl");
    Ft(i), l = new Ot(i), l.attach(), xe.set(je.getCompletedLevels());
    let S = null;
    if (v) {
      const q = await a(v);
      S = q.levels, S || ve.set(q.error ?? `Failed to load levels from ${v}. Using default levels instead.`);
    }
    await i.init(S, f), lt.set(i.getLevels());
  }), ft(() => {
    l && l.detach();
  });
  async function a(_) {
    try {
      const f = await fetch(_);
      if (!f.ok) return { levels: null, error: `Failed to fetch levels (${f.status}). Using default levels instead.` };
      const v = await f.json();
      return g(v) ? { levels: v } : { levels: null, error: "Levels file has an invalid schema. Using default levels instead." };
    } catch (f) {
      return console.error("Failed to fetch custom levels", f), { levels: null, error: "Network, CORS, or JSON error while loading levels. Using default levels instead." };
    }
  }
  const c = /* @__PURE__ */ new Set(["North", "South", "East", "West"]);
  function g(_) {
    return Array.isArray(_) ? _.every((f) => p(f)) : false;
  }
  function p(_) {
    if (!_ || typeof _ != "object") return false;
    const f = _;
    return !(!ne(f.id) || typeof f.name != "string" || f.difficulty !== void 0 && typeof f.difficulty != "string" || !An(f.gridSize) || !pe(f.snake) || !pe(f.obstacles) || !pe(f.food) || !ot(f.exit) || typeof f.snakeDirection != "string" || !c.has(f.snakeDirection) || !_e(f.floatingFood) || !_e(f.fallingFood) || !_e(f.stones) || !_e(f.spikes) || f.exitIsSolid !== void 0 && typeof f.exitIsSolid != "boolean" || !ne(f.totalFood));
  }
  return n.$$.update = () => {
    if (n.$$.dirty & 7) {
      if (s.status !== "LevelComplete") t(0, o = null);
      else if (r && o !== r.id) {
        t(0, o = r.id);
        const _ = je.markCompleted(r.id);
        xe.set(_);
      }
    }
  }, [o, r, s];
}
class Fn extends N {
  constructor(e) {
    super(), M(this, e, xn, Cn, I, {});
  }
}
new Fn({ target: document.getElementById("app") });
