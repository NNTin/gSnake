var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
(function() {
  const e = document.createElement("link").relList;
  if (e && e.supports && e.supports("modulepreload")) return;
  for (const i of document.querySelectorAll('link[rel="modulepreload"]')) r(i);
  new MutationObserver((i) => {
    for (const s of i) if (s.type === "childList") for (const l of s.addedNodes) l.tagName === "LINK" && l.rel === "modulepreload" && r(l);
  }).observe(document, { childList: true, subtree: true });
  function t(i) {
    const s = {};
    return i.integrity && (s.integrity = i.integrity), i.referrerPolicy && (s.referrerPolicy = i.referrerPolicy), i.crossOrigin === "use-credentials" ? s.credentials = "include" : i.crossOrigin === "anonymous" ? s.credentials = "omit" : s.credentials = "same-origin", s;
  }
  function r(i) {
    if (i.ep) return;
    i.ep = true;
    const s = t(i);
    fetch(i.href, s);
  }
})();
function b() {
}
function nt(n) {
  return n();
}
function Re() {
  return /* @__PURE__ */ Object.create(null);
}
function Y(n) {
  n.forEach(nt);
}
function rt(n) {
  return typeof n == "function";
}
function C(n, e) {
  return n != n ? e == e : n !== e || n && typeof n == "object" || typeof n == "function";
}
function ft(n) {
  return Object.keys(n).length === 0;
}
function dt(n, ...e) {
  if (n == null) {
    for (const r of e) r(void 0);
    return b;
  }
  const t = n.subscribe(...e);
  return t.unsubscribe ? () => t.unsubscribe() : t;
}
function M(n, e, t) {
  n.$$.on_destroy.push(dt(e, t));
}
function we(n) {
  return n ?? "";
}
function u(n, e) {
  n.appendChild(e);
}
function k(n, e, t) {
  n.insertBefore(e, t || null);
}
function v(n) {
  n.parentNode && n.parentNode.removeChild(n);
}
function it(n, e) {
  for (let t = 0; t < n.length; t += 1) n[t] && n[t].d(e);
}
function m(n) {
  return document.createElement(n);
}
function Le(n) {
  return document.createElementNS("http://www.w3.org/2000/svg", n);
}
function N(n) {
  return document.createTextNode(n);
}
function $() {
  return N(" ");
}
function de() {
  return N("");
}
function P(n, e, t, r) {
  return n.addEventListener(e, t, r), () => n.removeEventListener(e, t, r);
}
function f(n, e, t) {
  t == null ? n.removeAttribute(e) : n.getAttribute(e) !== t && n.setAttribute(e, t);
}
function _t(n) {
  return Array.from(n.childNodes);
}
function U(n, e) {
  e = "" + e, n.data !== e && (n.data = e);
}
function qe(n, e, t, r) {
  t == null ? n.style.removeProperty(e) : n.style.setProperty(e, t, "");
}
class gt {
  constructor(e = false) {
    __publicField(this, "is_svg", false);
    __publicField(this, "e");
    __publicField(this, "n");
    __publicField(this, "t");
    __publicField(this, "a");
    this.is_svg = e, this.e = this.n = null;
  }
  c(e) {
    this.h(e);
  }
  m(e, t, r = null) {
    this.e || (this.is_svg ? this.e = Le(t.nodeName) : this.e = m(t.nodeType === 11 ? "TEMPLATE" : t.nodeName), this.t = t.tagName !== "TEMPLATE" ? t : t.content, this.c(e)), this.i(r);
  }
  h(e) {
    this.e.innerHTML = e, this.n = Array.from(this.e.nodeName === "TEMPLATE" ? this.e.content.childNodes : this.e.childNodes);
  }
  i(e) {
    for (let t = 0; t < this.n.length; t += 1) k(this.t, this.n[t], e);
  }
  p(e) {
    this.d(), this.h(e), this.i(this.a);
  }
  d() {
    this.n.forEach(v);
  }
}
let ae;
function le(n) {
  ae = n;
}
function ve() {
  if (!ae) throw new Error("Function called outside component initialization");
  return ae;
}
function Ne(n) {
  ve().$$.on_mount.push(n);
}
function st(n) {
  ve().$$.on_destroy.push(n);
}
function mt(n, e) {
  return ve().$$.context.set(n, e), e;
}
function Oe(n) {
  return ve().$$.context.get(n);
}
const ee = [], Se = [];
let te = [];
const Ge = [], ht = Promise.resolve();
let Fe = false;
function pt() {
  Fe || (Fe = true, ht.then(lt));
}
function xe(n) {
  te.push(n);
}
const $e = /* @__PURE__ */ new Set();
let X = 0;
function lt() {
  if (X !== 0) return;
  const n = ae;
  do {
    try {
      for (; X < ee.length; ) {
        const e = ee[X];
        X++, le(e), bt(e.$$);
      }
    } catch (e) {
      throw ee.length = 0, X = 0, e;
    }
    for (le(null), ee.length = 0, X = 0; Se.length; ) Se.pop()();
    for (let e = 0; e < te.length; e += 1) {
      const t = te[e];
      $e.has(t) || ($e.add(t), t());
    }
    te.length = 0;
  } while (ee.length);
  for (; Ge.length; ) Ge.pop()();
  Fe = false, $e.clear(), le(n);
}
function bt(n) {
  if (n.fragment !== null) {
    n.update(), Y(n.before_update);
    const e = n.dirty;
    n.dirty = [-1], n.fragment && n.fragment.p(n.ctx, e), n.after_update.forEach(xe);
  }
}
function wt(n) {
  const e = [], t = [];
  te.forEach((r) => n.indexOf(r) === -1 ? e.push(r) : t.push(r)), t.forEach((r) => r()), te = e;
}
const he = /* @__PURE__ */ new Set();
let K;
function ze() {
  K = { r: 0, c: [], p: K };
}
function Be() {
  K.r || Y(K.c), K = K.p;
}
function S(n, e) {
  n && n.i && (he.delete(n), n.i(e));
}
function x(n, e, t, r) {
  if (n && n.o) {
    if (he.has(n)) return;
    he.add(n), K.c.push(() => {
      he.delete(n), r && (t && n.d(1), r());
    }), n.o(e);
  } else r && r();
}
function ye(n) {
  return (n == null ? void 0 : n.length) !== void 0 ? n : Array.from(n);
}
function T(n) {
  n && n.c();
}
function A(n, e, t) {
  const { fragment: r, after_update: i } = n.$$;
  r && r.m(e, t), xe(() => {
    const s = n.$$.on_mount.map(nt).filter(rt);
    n.$$.on_destroy ? n.$$.on_destroy.push(...s) : Y(s), n.$$.on_mount = [];
  }), i.forEach(xe);
}
function I(n, e) {
  const t = n.$$;
  t.fragment !== null && (wt(t.after_update), Y(t.on_destroy), t.fragment && t.fragment.d(e), t.on_destroy = t.fragment = null, t.ctx = []);
}
function yt(n, e) {
  n.$$.dirty[0] === -1 && (ee.push(n), pt(), n.$$.dirty.fill(0)), n.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function O(n, e, t, r, i, s, l = null, o = [-1]) {
  const c = ae;
  le(n);
  const a = n.$$ = { fragment: null, ctx: [], props: s, update: b, not_equal: i, bound: Re(), on_mount: [], on_destroy: [], on_disconnect: [], before_update: [], after_update: [], context: new Map(e.context || (c ? c.$$.context : [])), callbacks: Re(), dirty: o, skip_bound: false, root: e.target || c.$$.root };
  l && l(a.root);
  let g = false;
  if (a.ctx = t ? t(n, e.props || {}, (p, h, ...d) => {
    const _ = d.length ? d[0] : h;
    return a.ctx && i(a.ctx[p], a.ctx[p] = _) && (!a.skip_bound && a.bound[p] && a.bound[p](_), g && yt(n, p)), h;
  }) : [], a.update(), g = true, Y(a.before_update), a.fragment = r ? r(a.ctx) : false, e.target) {
    if (e.hydrate) {
      const p = _t(e.target);
      a.fragment && a.fragment.l(p), p.forEach(v);
    } else a.fragment && a.fragment.c();
    e.intro && S(n.$$.fragment), A(n, e.target, e.anchor), lt();
  }
  le(c);
}
class z {
  constructor() {
    __publicField(this, "$$");
    __publicField(this, "$$set");
  }
  $destroy() {
    I(this, 1), this.$destroy = b;
  }
  $on(e, t) {
    if (!rt(t)) return b;
    const r = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
    return r.push(t), () => {
      const i = r.indexOf(t);
      i !== -1 && r.splice(i, 1);
    };
  }
  $set(e) {
    this.$$set && !ft(e) && (this.$$.skip_bound = true, this.$$set(e), this.$$.skip_bound = false);
  }
}
const vt = "4";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(vt);
let Ce = class {
  __destroy_into_raw() {
    const e = this.__wbg_ptr;
    return this.__wbg_ptr = 0, De.unregister(this), e;
  }
  free() {
    const e = this.__destroy_into_raw();
    w.__wbg_wasmgameengine_free(e, 0);
  }
  getFrame() {
    const e = w.wasmgameengine_getFrame(this.__wbg_ptr);
    if (e[2]) throw D(e[1]);
    return D(e[0]);
  }
  getGameState() {
    const e = w.wasmgameengine_getGameState(this.__wbg_ptr);
    if (e[2]) throw D(e[1]);
    return D(e[0]);
  }
  getLevel() {
    const e = w.wasmgameengine_getLevel(this.__wbg_ptr);
    if (e[2]) throw D(e[1]);
    return D(e[0]);
  }
  constructor(e) {
    const t = w.wasmgameengine_new(e);
    if (t[2]) throw D(t[1]);
    return this.__wbg_ptr = t[0] >>> 0, De.register(this, this.__wbg_ptr, this), this;
  }
  onFrame(e) {
    w.wasmgameengine_onFrame(this.__wbg_ptr, e);
  }
  processMove(e) {
    const t = w.wasmgameengine_processMove(this.__wbg_ptr, e);
    if (t[2]) throw D(t[1]);
    return D(t[0]);
  }
};
Symbol.dispose && (Ce.prototype[Symbol.dispose] = Ce.prototype.free);
function $t() {
  const n = w.getLevels();
  if (n[2]) throw D(n[1]);
  return D(n[0]);
}
function kt() {
  w.init_panic_hook();
}
function Et(n) {
  const e = se(n, w.__wbindgen_malloc, w.__wbindgen_realloc), t = J;
  w.log(e, t);
}
function Lt() {
  return { __proto__: null, "./gsnake_wasm_bg.js": { __proto__: null, __wbg_Error_8c4e43fe74559d73: function(e, t) {
    return Error(_e(e, t));
  }, __wbg_Number_04624de7d0e8332d: function(e) {
    return Number(e);
  }, __wbg_String_8f0eb39a4a4c2f66: function(e, t) {
    const r = String(t), i = se(r, w.__wbindgen_malloc, w.__wbindgen_realloc), s = J;
    j().setInt32(e + 4, s, true), j().setInt32(e + 0, i, true);
  }, __wbg___wbindgen_boolean_get_bbbb1c18aa2f5e25: function(e) {
    const t = e, r = typeof t == "boolean" ? t : void 0;
    return ge(r) ? 16777215 : r ? 1 : 0;
  }, __wbg___wbindgen_debug_string_0bc8482c6e3508ae: function(e, t) {
    const r = Ae(t), i = se(r, w.__wbindgen_malloc, w.__wbindgen_realloc), s = J;
    j().setInt32(e + 4, s, true), j().setInt32(e + 0, i, true);
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
    const r = t, i = typeof r == "number" ? r : void 0;
    j().setFloat64(e + 8, ge(i) ? 0 : i, true), j().setInt32(e + 0, !ge(i), true);
  }, __wbg___wbindgen_string_get_72fb696202c56729: function(e, t) {
    const r = t, i = typeof r == "string" ? r : void 0;
    var s = ge(i) ? 0 : se(i, w.__wbindgen_malloc, w.__wbindgen_realloc), l = J;
    j().setInt32(e + 4, l, true), j().setInt32(e + 0, s, true);
  }, __wbg___wbindgen_throw_be289d5034ed271b: function(e, t) {
    throw new Error(_e(e, t));
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
    let r, i;
    try {
      r = e, i = t, console.error(_e(e, t));
    } finally {
      w.__wbindgen_free(r, i, 1);
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
    Uint8Array.prototype.set.call(Ft(e, t), r);
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
    const r = t.stack, i = se(r, w.__wbindgen_malloc, w.__wbindgen_realloc), s = J;
    j().setInt32(e + 4, s, true), j().setInt32(e + 0, i, true);
  }, __wbg_value_0546255b415e96c1: function(e) {
    return e.value;
  }, __wbindgen_cast_0000000000000001: function(e) {
    return e;
  }, __wbindgen_cast_0000000000000002: function(e, t) {
    return _e(e, t);
  }, __wbindgen_init_externref_table: function() {
    const e = w.__wbindgen_externrefs, t = e.grow(4);
    e.set(0, void 0), e.set(t + 0, void 0), e.set(t + 1, null), e.set(t + 2, true), e.set(t + 3, false);
  } } };
}
const De = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((n) => w.__wbg_wasmgameengine_free(n >>> 0, 1));
function St(n) {
  const e = w.__externref_table_alloc();
  return w.__wbindgen_externrefs.set(e, n), e;
}
function Ae(n) {
  const e = typeof n;
  if (e == "number" || e == "boolean" || n == null) return `${n}`;
  if (e == "string") return `"${n}"`;
  if (e == "symbol") {
    const i = n.description;
    return i == null ? "Symbol" : `Symbol(${i})`;
  }
  if (e == "function") {
    const i = n.name;
    return typeof i == "string" && i.length > 0 ? `Function(${i})` : "Function";
  }
  if (Array.isArray(n)) {
    const i = n.length;
    let s = "[";
    i > 0 && (s += Ae(n[0]));
    for (let l = 1; l < i; l++) s += ", " + Ae(n[l]);
    return s += "]", s;
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
function Ft(n, e) {
  return n = n >>> 0, oe().subarray(n / 1, n / 1 + e);
}
let V = null;
function j() {
  return (V === null || V.buffer.detached === true || V.buffer.detached === void 0 && V.buffer !== w.memory.buffer) && (V = new DataView(w.memory.buffer)), V;
}
function _e(n, e) {
  return n = n >>> 0, Ct(n, e);
}
let ie = null;
function oe() {
  return (ie === null || ie.byteLength === 0) && (ie = new Uint8Array(w.memory.buffer)), ie;
}
function re(n, e) {
  try {
    return n.apply(this, e);
  } catch (t) {
    const r = St(t);
    w.__wbindgen_exn_store(r);
  }
}
function ge(n) {
  return n == null;
}
function se(n, e, t) {
  if (t === void 0) {
    const o = ce.encode(n), c = e(o.length, 1) >>> 0;
    return oe().subarray(c, c + o.length).set(o), J = o.length, c;
  }
  let r = n.length, i = e(r, 1) >>> 0;
  const s = oe();
  let l = 0;
  for (; l < r; l++) {
    const o = n.charCodeAt(l);
    if (o > 127) break;
    s[i + l] = o;
  }
  if (l !== r) {
    l !== 0 && (n = n.slice(l)), i = t(i, r, r = l + n.length * 3, 1) >>> 0;
    const o = oe().subarray(i + l, i + r), c = ce.encodeInto(n, o);
    l += c.written, i = t(i, r, l, 1) >>> 0;
  }
  return J = l, i;
}
function D(n) {
  const e = w.__wbindgen_externrefs.get(n);
  return w.__externref_table_dealloc(n), e;
}
let pe = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
pe.decode();
const xt = 2146435072;
let ke = 0;
function Ct(n, e) {
  return ke += e, ke >= xt && (pe = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true }), pe.decode(), ke = e), pe.decode(oe().subarray(n, n + e));
}
const ce = new TextEncoder();
"encodeInto" in ce || (ce.encodeInto = function(n, e) {
  const t = ce.encode(n);
  return e.set(t), { read: n.length, written: t.length };
});
let J = 0, w;
function At(n, e) {
  return w = n.exports, V = null, ie = null, w.__wbindgen_start(), w;
}
async function It(n, e) {
  if (typeof Response == "function" && n instanceof Response) {
    if (typeof WebAssembly.instantiateStreaming == "function") try {
      return await WebAssembly.instantiateStreaming(n, e);
    } catch (i) {
      if (n.ok && t(n.type) && n.headers.get("Content-Type") !== "application/wasm") console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", i);
      else throw i;
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
async function Mt(n) {
  if (w !== void 0) return w;
  n !== void 0 && (Object.getPrototypeOf(n) === Object.prototype ? { module_or_path: n } = n : console.warn("using deprecated parameters for the initialization function; pass a single object instead")), n === void 0 && (n = new URL("/gSnake/main/assets/gsnake_wasm_bg-B7YzMFk7.wasm", import.meta.url));
  const e = Lt();
  (typeof n == "string" || typeof Request == "function" && n instanceof Request || typeof URL == "function" && n instanceof URL) && (n = fetch(n));
  const { instance: t, module: r } = await It(await n, e);
  return At(t);
}
class Nt {
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
      await Mt();
    } catch (i) {
      throw this.handleContractError(i, "Failed to initialize WASM module", "initializationFailed"), i;
    }
    try {
      kt();
    } catch (i) {
      console.warn("Failed to initialize panic hook:", i);
    }
    Et("gSnake WASM engine initialized");
    try {
      this.levels = e ?? $t();
    } catch (i) {
      throw this.handleContractError(i, "Failed to load levels", "initializationFailed"), i;
    }
    const r = Number.isInteger(t) && t > 0 ? t : 1;
    this.currentLevelIndex = r - 1, await this.loadLevelByIndex(this.currentLevelIndex), this.initialized = true;
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
    const i = this.normalizeContractError(e, t, r);
    if (i) {
      this.emitEvent({ type: "engineError", error: i }), console.error(`[ContractError:${i.kind}] ${i.message}`, i.context ?? {});
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
    const i = e instanceof Error ? e.message : String(e);
    return { kind: r, message: t, context: { detail: i } };
  }
}
const Z = [];
function W(n, e = b) {
  let t;
  const r = /* @__PURE__ */ new Set();
  function i(o) {
    if (C(n, o) && (n = o, t)) {
      const c = !Z.length;
      for (const a of r) a[1](), Z.push(a, n);
      if (c) {
        for (let a = 0; a < Z.length; a += 2) Z[a][0](Z[a + 1]);
        Z.length = 0;
      }
    }
  }
  function s(o) {
    i(o(n));
  }
  function l(o, c = b) {
    const a = [o, c];
    return r.add(a), r.size === 1 && (t = e(i, s) || b), o(n), () => {
      r.delete(a), r.size === 0 && t && (t(), t = null);
    };
  }
  return { set: i, update: s, subscribe: l };
}
const Q = W({ status: "Playing", currentLevel: 1, moves: 0, foodCollected: 0, totalFood: 0 }), ot = W(0), Te = W(null), ct = W(null), ue = W(null), at = W([]), Ie = W([]), Me = W(false), fe = W(null);
function Ot() {
  return typeof window > "u" ? false : new URLSearchParams(window.location.search).get("contractTest") === "1";
}
function je(n) {
  if (!Ot()) return;
  const e = window, t = e.__gsnakeContract ?? {};
  e.__gsnakeContract = { ...t, ...n };
}
function zt(n) {
  n.addEventListener((e) => {
    switch (e.type) {
      case "levelChanged":
        Te.set(e.level);
        break;
      case "frameChanged":
        ct.set(e.frame), Q.set(e.frame.state), ot.set(Bt(e.frame)), ue.set(null), je({ frame: e.frame, error: null });
        break;
      case "engineError":
        ue.set(e.error), je({ error: e.error });
        break;
    }
  });
}
function Bt(n) {
  let e = 0;
  for (const t of n.grid) for (const r of t) (r === "SnakeHead" || r === "SnakeBody") && (e += 1);
  return e;
}
class Tt {
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
const Ee = "gsnake_completed_levels";
class Ue {
  static getCompletedLevels() {
    if (typeof window > "u") return [];
    try {
      const e = window.localStorage.getItem(Ee);
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
    const r = Array.from(t.values()).sort((i, s) => i - s);
    return window.localStorage.setItem(Ee, JSON.stringify(r)), r;
  }
  static clearCompleted() {
    typeof window > "u" || window.localStorage.removeItem(Ee);
  }
}
const Rt = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20style='display:none'%3e%3c!--%20Empty:%20Light%20gray%20filled%20rectangle%20--%3e%3csymbol%20id='Empty'%20viewBox='0%200%2032%2032'%3e%3crect%20width='32'%20height='32'%20fill='%23F5F5F5'/%3e%3c/symbol%3e%3c!--%20SnakeHead:%20Blue%20rounded%20rectangle%20with%20eyes%20--%3e%3csymbol%20id='SnakeHead'%20viewBox='0%200%2032%2032'%3e%3crect%20x='2'%20y='2'%20width='28'%20height='28'%20rx='4'%20fill='%232196F3'/%3e%3ccircle%20cx='11'%20cy='12'%20r='2.5'%20fill='%23FFF'/%3e%3ccircle%20cx='21'%20cy='12'%20r='2.5'%20fill='%23FFF'/%3e%3c/symbol%3e%3c!--%20SnakeBody:%20Lighter%20blue%20with%20horizontal%20stripe%20--%3e%3csymbol%20id='SnakeBody'%20viewBox='0%200%2032%2032'%3e%3crect%20x='2'%20y='2'%20width='28'%20height='28'%20rx='3'%20fill='%2364B5F6'/%3e%3crect%20x='4'%20y='14'%20width='24'%20height='4'%20rx='1'%20fill='%2342A5F5'/%3e%3c/symbol%3e%3c!--%20Food:%20Red%20circle%20with%20green%20stem%20(apple-like)%20--%3e%3csymbol%20id='Food'%20viewBox='0%200%2032%2032'%3e%3ccircle%20cx='16'%20cy='17'%20r='12'%20fill='%23FF5722'/%3e%3cline%20x1='16'%20y1='5'%20x2='16'%20y2='9'%20stroke='%234CAF50'%20stroke-width='2'%20stroke-linecap='round'/%3e%3cline%20x1='16'%20y1='5'%20x2='18'%20y2='7'%20stroke='%234CAF50'%20stroke-width='1.5'%20stroke-linecap='round'/%3e%3c/symbol%3e%3c!--%20FloatingFood:%20Orange%20circle%20with%20upward%20chevrons%20--%3e%3csymbol%20id='FloatingFood'%20viewBox='0%200%2032%2032'%3e%3ccircle%20cx='16'%20cy='18'%20r='10'%20fill='%23FF9800'/%3e%3cpolyline%20points='12,10%2016,6%2020,10'%20fill='none'%20stroke='%23FFB74D'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpolyline%20points='12,6%2016,2%2020,6'%20fill='none'%20stroke='%23FFB74D'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/symbol%3e%3c!--%20Obstacle:%20Dark%20gray%20with%20cross-hatch%20pattern%20--%3e%3csymbol%20id='Obstacle'%20viewBox='0%200%2032%2032'%3e%3crect%20width='32'%20height='32'%20fill='%23424242'/%3e%3cline%20x1='0'%20y1='0'%20x2='32'%20y2='32'%20stroke='%23616161'%20stroke-width='1'/%3e%3cline%20x1='32'%20y1='0'%20x2='0'%20y2='32'%20stroke='%23616161'%20stroke-width='1'/%3e%3c/symbol%3e%3c!--%20Exit:%20Green%20rectangle%20with%20white%20doorway%20arch%20--%3e%3csymbol%20id='Exit'%20viewBox='0%200%2032%2032'%3e%3crect%20width='32'%20height='32'%20fill='%234CAF50'/%3e%3crect%20x='10'%20y='12'%20width='12'%20height='20'%20fill='%23FFF'/%3e%3cpath%20d='M%2010%2012%20Q%2010%206%2016%206%20Q%2022%206%2022%2012'%20fill='%23FFF'/%3e%3c/symbol%3e%3c!--%20Stone:%20Brown%20rounded%20rectangle%20with%20texture%20spots%20--%3e%3csymbol%20id='Stone'%20viewBox='0%200%2032%2032'%3e%3crect%20x='2'%20y='2'%20width='28'%20height='28'%20rx='6'%20fill='%23795548'/%3e%3cellipse%20cx='11'%20cy='10'%20rx='3'%20ry='2.5'%20fill='%238D6E63'/%3e%3cellipse%20cx='20'%20cy='14'%20rx='2.5'%20ry='3'%20fill='%238D6E63'/%3e%3ccircle%20cx='14'%20cy='21'%20r='2'%20fill='%238D6E63'/%3e%3c/symbol%3e%3c!--%20Spike:%20Red%20background%20with%20sharp%20upward%20triangle%20--%3e%3csymbol%20id='Spike'%20viewBox='0%200%2032%2032'%3e%3crect%20width='32'%20height='32'%20fill='%23F44336'/%3e%3cpolygon%20points='16,6%2022,26%2010,26'%20fill='%23B71C1C'/%3e%3c/symbol%3e%3c/svg%3e";
function Pe(n) {
  let e, t;
  return { c() {
    e = new gt(false), t = de(), e.a = t;
  }, m(r, i) {
    e.m(n[0], r, i), k(r, t, i);
  }, p(r, i) {
    i & 1 && e.p(r[0]);
  }, d(r) {
    r && (v(t), e.d());
  } };
}
function qt(n) {
  let e, t = n[0] && Pe(n);
  return { c() {
    t && t.c(), e = de();
  }, m(r, i) {
    t && t.m(r, i), k(r, e, i);
  }, p(r, [i]) {
    r[0] ? t ? t.p(r, i) : (t = Pe(r), t.c(), t.m(e.parentNode, e)) : t && (t.d(1), t = null);
  }, i: b, o: b, d(r) {
    r && v(e), t && t.d(r);
  } };
}
function Gt(n, e, t) {
  let r = "";
  return Ne(async () => {
    const i = await fetch(Rt);
    t(0, r = await i.text());
  }), st(() => {
    t(0, r = "");
  }), [r];
}
class Dt extends z {
  constructor(e) {
    super(), O(this, e, Gt, qt, C, {});
  }
}
function jt(n) {
  let e, t, r, i, s, l = n[0].currentLevel + "", o, c, a, g, p, h, d, _, F, B, q, y, E = n[0].moves + "", L;
  return { c() {
    e = m("div"), t = m("div"), r = m("span"), r.textContent = "Level", i = $(), s = m("span"), o = N(l), c = $(), a = m("div"), g = m("span"), g.textContent = "Length", p = $(), h = m("span"), d = N(n[1]), _ = $(), F = m("div"), B = m("span"), B.textContent = "Moves", q = $(), y = m("span"), L = N(E), f(r, "class", "score-label svelte-1dkg50z"), f(s, "class", "score-value svelte-1dkg50z"), f(s, "data-element-id", "level-display"), f(t, "class", "score-item svelte-1dkg50z"), f(g, "class", "score-label svelte-1dkg50z"), f(h, "class", "score-value svelte-1dkg50z"), f(h, "data-element-id", "length-display"), f(a, "class", "score-item svelte-1dkg50z"), f(B, "class", "score-label svelte-1dkg50z"), f(y, "class", "score-value svelte-1dkg50z"), f(y, "data-element-id", "moves-display"), f(F, "class", "score-item svelte-1dkg50z"), f(e, "class", "score-info svelte-1dkg50z");
  }, m(R, G) {
    k(R, e, G), u(e, t), u(t, r), u(t, i), u(t, s), u(s, o), u(e, c), u(e, a), u(a, g), u(a, p), u(a, h), u(h, d), u(e, _), u(e, F), u(F, B), u(F, q), u(F, y), u(y, L);
  }, p(R, [G]) {
    G & 1 && l !== (l = R[0].currentLevel + "") && U(o, l), G & 2 && U(d, R[1]), G & 1 && E !== (E = R[0].moves + "") && U(L, E);
  }, i: b, o: b, d(R) {
    R && v(e);
  } };
}
function Ut(n, e, t) {
  let r, i;
  return M(n, Q, (s) => t(0, r = s)), M(n, ot, (s) => t(1, i = s)), [r, i];
}
class Pt extends z {
  constructor(e) {
    super(), O(this, e, Ut, jt, C, {});
  }
}
function Wt(n) {
  let e, t, r;
  return { c() {
    e = m("button"), e.textContent = "Restart", f(e, "class", "restart-btn svelte-11sh8jp"), f(e, "data-element-id", "restart-button");
  }, m(i, s) {
    k(i, e, s), t || (r = P(e, "click", n[0]), t = true);
  }, p: b, i: b, o: b, d(i) {
    i && v(e), t = false, r();
  } };
}
function Ht(n) {
  const e = Oe("GAME_ENGINE");
  function t() {
    var _a;
    e.restartLevel(), (_a = document.activeElement) == null ? void 0 : _a.blur();
  }
  return [t];
}
class Vt extends z {
  constructor(e) {
    super(), O(this, e, Ht, Wt, C, {});
  }
}
function Kt(n) {
  let e, t, r;
  return { c() {
    e = m("button"), e.textContent = "Levels", f(e, "class", "level-selector-btn svelte-hz9znr"), f(e, "data-element-id", "level-selector-btn");
  }, m(i, s) {
    k(i, e, s), t || (r = P(e, "click", n[0]), t = true);
  }, p: b, i: b, o: b, d(i) {
    i && v(e), t = false, r();
  } };
}
function Jt(n) {
  function e() {
    Me.update((t) => !t);
  }
  return [e];
}
class Yt extends z {
  constructor(e) {
    super(), O(this, e, Jt, Kt, C, {});
  }
}
function Qt(n) {
  let e, t, r, i, s, l, o, c;
  return t = new Pt({}), s = new Yt({}), o = new Vt({}), { c() {
    e = m("div"), T(t.$$.fragment), r = $(), i = m("div"), T(s.$$.fragment), l = $(), T(o.$$.fragment), f(i, "class", "header-actions svelte-g4zqdl"), f(e, "class", "header svelte-g4zqdl");
  }, m(a, g) {
    k(a, e, g), A(t, e, null), u(e, r), u(e, i), A(s, i, null), u(i, l), A(o, i, null), c = true;
  }, p: b, i(a) {
    c || (S(t.$$.fragment, a), S(s.$$.fragment, a), S(o.$$.fragment, a), c = true);
  }, o(a) {
    x(t.$$.fragment, a), x(s.$$.fragment, a), x(o.$$.fragment, a), c = false;
  }, d(a) {
    a && v(e), I(t), I(s), I(o);
  } };
}
class Xt extends z {
  constructor(e) {
    super(), O(this, e, null, Qt, C, {});
  }
}
function Zt(n) {
  let e, t, r;
  return { c() {
    e = Le("svg"), t = Le("use"), f(t, "href", r = "#" + n[1]), f(e, "class", "cell svelte-18tgpre"), f(e, "viewBox", "0 0 32 32"), qe(e, "opacity", n[0]);
  }, m(i, s) {
    k(i, e, s), u(e, t);
  }, p(i, [s]) {
    s & 2 && r !== (r = "#" + i[1]) && f(t, "href", r), s & 1 && qe(e, "opacity", i[0]);
  }, i: b, o: b, d(i) {
    i && v(e);
  } };
}
function en(n) {
  return n === "FallingFood" ? "Food" : n;
}
function tn(n) {
  switch (n) {
    case "Spike":
      return 0.8;
    case "Stone":
      return 0.85;
    case "Obstacle":
      return 0.9;
    case "Empty":
    case "SnakeHead":
    case "SnakeBody":
    case "Food":
    case "FloatingFood":
    case "FallingFood":
    case "Exit":
    default:
      return 1;
  }
}
function nn(n, e, t) {
  let r, i, { type: s } = e;
  return n.$$set = (l) => {
    "type" in l && t(2, s = l.type);
  }, n.$$.update = () => {
    n.$$.dirty & 4 && t(1, r = en(s)), n.$$.dirty & 4 && t(0, i = tn(s));
  }, [i, r, s];
}
class rn extends z {
  constructor(e) {
    super(), O(this, e, nn, Zt, C, { type: 2 });
  }
}
function We(n, e, t) {
  const r = n.slice();
  return r[5] = e[t], r;
}
function He(n) {
  let e, t;
  return e = new rn({ props: { type: n[5] } }), { c() {
    T(e.$$.fragment);
  }, m(r, i) {
    A(e, r, i), t = true;
  }, p(r, i) {
    const s = {};
    i & 1 && (s.type = r[5]), e.$set(s);
  }, i(r) {
    t || (S(e.$$.fragment, r), t = true);
  }, o(r) {
    x(e.$$.fragment, r), t = false;
  }, d(r) {
    I(e, r);
  } };
}
function sn(n) {
  let e, t, r, i = ye(n[0]), s = [];
  for (let o = 0; o < i.length; o += 1) s[o] = He(We(n, i, o));
  const l = (o) => x(s[o], 1, 1, () => {
    s[o] = null;
  });
  return { c() {
    e = m("div");
    for (let o = 0; o < s.length; o += 1) s[o].c();
    f(e, "class", "game-field svelte-2ydslf"), f(e, "data-element-id", "game-field"), f(e, "style", t = `grid-template-columns: repeat(${n[2]}, 1fr); grid-template-rows: repeat(${n[1]}, 1fr);`);
  }, m(o, c) {
    k(o, e, c);
    for (let a = 0; a < s.length; a += 1) s[a] && s[a].m(e, null);
    r = true;
  }, p(o, [c]) {
    if (c & 1) {
      i = ye(o[0]);
      let a;
      for (a = 0; a < i.length; a += 1) {
        const g = We(o, i, a);
        s[a] ? (s[a].p(g, c), S(s[a], 1)) : (s[a] = He(g), s[a].c(), S(s[a], 1), s[a].m(e, null));
      }
      for (ze(), a = i.length; a < s.length; a += 1) l(a);
      Be();
    }
    (!r || c & 6 && t !== (t = `grid-template-columns: repeat(${o[2]}, 1fr); grid-template-rows: repeat(${o[1]}, 1fr);`)) && f(e, "style", t);
  }, i(o) {
    if (!r) {
      for (let c = 0; c < i.length; c += 1) S(s[c]);
      r = true;
    }
  }, o(o) {
    s = s.filter(Boolean);
    for (let c = 0; c < s.length; c += 1) x(s[c]);
    r = false;
  }, d(o) {
    o && v(e), it(s, o);
  } };
}
function ln(n, e, t) {
  let r, i, s, l, o;
  return M(n, ct, (c) => t(4, o = c)), n.$$.update = () => {
    var _a;
    n.$$.dirty & 16 && t(3, r = (o == null ? void 0 : o.grid) ?? []), n.$$.dirty & 8 && t(2, i = ((_a = r[0]) == null ? void 0 : _a.length) ?? 0), n.$$.dirty & 8 && t(1, s = r.length), n.$$.dirty & 8 && t(0, l = r.flat());
  }, [l, s, i, r, o];
}
class on extends z {
  constructor(e) {
    super(), O(this, e, ln, sn, C, {});
  }
}
function cn(n) {
  let e, t, r, i, s, l, o, c, a;
  return { c() {
    e = m("div"), t = m("h2"), t.textContent = "Game Over", r = $(), i = m("div"), s = m("button"), s.textContent = "Restart Level", l = $(), o = m("button"), o.textContent = "Back to Level 1", f(t, "class", "svelte-r80wre"), f(s, "class", "modal-btn primary svelte-r80wre"), f(s, "data-element-id", "restart-level-btn"), f(o, "class", "modal-btn secondary svelte-r80wre"), f(o, "data-element-id", "back-to-level1-btn"), f(i, "class", "modal-buttons svelte-r80wre"), f(e, "class", "modal svelte-r80wre");
  }, m(g, p) {
    k(g, e, p), u(e, t), u(e, r), u(e, i), u(i, s), n[3](s), u(i, l), u(i, o), c || (a = [P(s, "click", n[1]), P(o, "click", n[2])], c = true);
  }, p: b, i: b, o: b, d(g) {
    g && v(e), n[3](null), c = false, Y(a);
  } };
}
function an(n, e, t) {
  const r = Oe("GAME_ENGINE");
  let i;
  Ne(() => {
    i == null ? void 0 : i.focus();
  });
  function s() {
    r.restartLevel();
  }
  function l() {
    r.loadLevel(1);
  }
  function o(c) {
    Se[c ? "unshift" : "push"](() => {
      i = c, t(0, i);
    });
  }
  return [i, s, l, o];
}
class un extends z {
  constructor(e) {
    super(), O(this, e, an, cn, C, {});
  }
}
function fn(n) {
  let e;
  return { c() {
    e = m("div"), e.innerHTML = '<h2 class="svelte-q2s5gm">All Levels Complete!</h2> <p style="margin: 15px 0; color: #666;">Congratulations! You&#39;ve beaten all levels.</p> <p style="font-size: 12px; color: #999;">Refresh the page to play again.</p>', f(e, "class", "modal svelte-q2s5gm");
  }, m(t, r) {
    k(t, e, r);
  }, p: b, i: b, o: b, d(t) {
    t && v(e);
  } };
}
class dn extends z {
  constructor(e) {
    super(), O(this, e, null, fn, C, {});
  }
}
function _n(n) {
  var _a, _b;
  let e, t, r, i, s = (((_a = n[0]) == null ? void 0 : _a.message) ?? "Unexpected engine error.") + "", l, o, c, a, g, p = (((_b = n[0]) == null ? void 0 : _b.kind) ?? "internalError") + "", h, d, _, F, B, q, y, E;
  return { c() {
    e = m("div"), t = m("h2"), t.textContent = "Engine Error", r = $(), i = m("p"), l = N(s), o = $(), c = m("p"), a = N("Kind: "), g = m("span"), h = N(p), d = $(), _ = m("div"), F = m("button"), F.textContent = "Reload", B = $(), q = m("button"), q.textContent = "Dismiss", f(t, "class", "svelte-1x0qq8p"), f(i, "class", "message svelte-1x0qq8p"), f(g, "class", "svelte-1x0qq8p"), f(c, "class", "detail svelte-1x0qq8p"), f(F, "class", "modal-btn primary svelte-1x0qq8p"), f(q, "class", "modal-btn secondary svelte-1x0qq8p"), f(_, "class", "modal-buttons svelte-1x0qq8p"), f(e, "class", "modal svelte-1x0qq8p"), f(e, "data-element-id", "engine-error-modal");
  }, m(L, R) {
    k(L, e, R), u(e, t), u(e, r), u(e, i), u(i, l), u(e, o), u(e, c), u(c, a), u(c, g), u(g, h), u(e, d), u(e, _), u(_, F), u(_, B), u(_, q), y || (E = [P(F, "click", gn), P(q, "click", n[1])], y = true);
  }, p(L, [R]) {
    var _a2, _b2;
    R & 1 && s !== (s = (((_a2 = L[0]) == null ? void 0 : _a2.message) ?? "Unexpected engine error.") + "") && U(l, s), R & 1 && p !== (p = (((_b2 = L[0]) == null ? void 0 : _b2.kind) ?? "internalError") + "") && U(h, p);
  }, i: b, o: b, d(L) {
    L && v(e), y = false, Y(E);
  } };
}
function gn() {
  window.location.reload();
}
function mn(n, e, t) {
  let r;
  M(n, ue, (s) => t(0, r = s));
  function i() {
    ue.set(null);
  }
  return [r, i];
}
class hn extends z {
  constructor(e) {
    super(), O(this, e, mn, _n, C, {});
  }
}
function pn(n) {
  let e, t, r, i, s, l, o, c, a;
  return { c() {
    e = m("div"), t = m("h2"), t.textContent = "Level Load Failed", r = $(), i = m("p"), s = N(n[0]), l = $(), o = m("button"), o.textContent = "Continue", f(o, "class", "modal-btn svelte-10hk6qk"), f(e, "class", "modal svelte-10hk6qk");
  }, m(g, p) {
    k(g, e, p), u(e, t), u(e, r), u(e, i), u(i, s), u(e, l), u(e, o), c || (a = P(o, "click", n[1]), c = true);
  }, p(g, [p]) {
    p & 1 && U(s, g[0]);
  }, i: b, o: b, d(g) {
    g && v(e), c = false, a();
  } };
}
function bn(n, e, t) {
  let r;
  M(n, fe, (s) => t(0, r = s));
  function i() {
    fe.set(null);
  }
  return [r, i];
}
class wn extends z {
  constructor(e) {
    super(), O(this, e, bn, pn, C, {});
  }
}
function Ve(n) {
  let e, t, r, i;
  const s = [kn, $n, vn, yn], l = [];
  function o(c, a) {
    return c[3] ? 0 : c[2] ? 1 : c[1] ? 2 : c[0] ? 3 : -1;
  }
  return ~(t = o(n)) && (r = l[t] = s[t](n)), { c() {
    e = m("div"), r && r.c(), f(e, "class", "overlay active svelte-16e68es"), f(e, "data-element-id", "overlay");
  }, m(c, a) {
    k(c, e, a), ~t && l[t].m(e, null), i = true;
  }, p(c, a) {
    let g = t;
    t = o(c), t !== g && (r && (ze(), x(l[g], 1, 1, () => {
      l[g] = null;
    }), Be()), ~t ? (r = l[t], r || (r = l[t] = s[t](c), r.c()), S(r, 1), r.m(e, null)) : r = null);
  }, i(c) {
    i || (S(r), i = true);
  }, o(c) {
    x(r), i = false;
  }, d(c) {
    c && v(e), ~t && l[t].d();
  } };
}
function yn(n) {
  let e, t;
  return e = new dn({}), { c() {
    T(e.$$.fragment);
  }, m(r, i) {
    A(e, r, i), t = true;
  }, i(r) {
    t || (S(e.$$.fragment, r), t = true);
  }, o(r) {
    x(e.$$.fragment, r), t = false;
  }, d(r) {
    I(e, r);
  } };
}
function vn(n) {
  let e, t;
  return e = new un({}), { c() {
    T(e.$$.fragment);
  }, m(r, i) {
    A(e, r, i), t = true;
  }, i(r) {
    t || (S(e.$$.fragment, r), t = true);
  }, o(r) {
    x(e.$$.fragment, r), t = false;
  }, d(r) {
    I(e, r);
  } };
}
function $n(n) {
  let e, t;
  return e = new hn({}), { c() {
    T(e.$$.fragment);
  }, m(r, i) {
    A(e, r, i), t = true;
  }, i(r) {
    t || (S(e.$$.fragment, r), t = true);
  }, o(r) {
    x(e.$$.fragment, r), t = false;
  }, d(r) {
    I(e, r);
  } };
}
function kn(n) {
  let e, t;
  return e = new wn({}), { c() {
    T(e.$$.fragment);
  }, m(r, i) {
    A(e, r, i), t = true;
  }, i(r) {
    t || (S(e.$$.fragment, r), t = true);
  }, o(r) {
    x(e.$$.fragment, r), t = false;
  }, d(r) {
    I(e, r);
  } };
}
function En(n) {
  let e, t, r = n[4] && Ve(n);
  return { c() {
    r && r.c(), e = de();
  }, m(i, s) {
    r && r.m(i, s), k(i, e, s), t = true;
  }, p(i, [s]) {
    i[4] ? r ? (r.p(i, s), s & 16 && S(r, 1)) : (r = Ve(i), r.c(), S(r, 1), r.m(e.parentNode, e)) : r && (ze(), x(r, 1, 1, () => {
      r = null;
    }), Be());
  }, i(i) {
    t || (S(r), t = true);
  }, o(i) {
    x(r), t = false;
  }, d(i) {
    i && v(e), r && r.d(i);
  } };
}
function Ln(n, e, t) {
  let r, i, s, l, o, c, a, g;
  return M(n, Q, (p) => t(5, c = p)), M(n, ue, (p) => t(6, a = p)), M(n, fe, (p) => t(7, g = p)), n.$$.update = () => {
    n.$$.dirty & 128 && t(3, r = g !== null), n.$$.dirty & 64 && t(2, i = a !== null), n.$$.dirty & 32 && t(1, s = c.status === "GameOver"), n.$$.dirty & 32 && t(0, l = c.status === "AllComplete"), n.$$.dirty & 15 && t(4, o = r || i || s || l);
  }, [l, s, i, r, o, c, a, g];
}
class Sn extends z {
  constructor(e) {
    super(), O(this, e, Ln, En, C, {});
  }
}
function Ke(n, e, t) {
  const r = n.slice();
  return r[10] = e[t], r[12] = t, r;
}
function Je(n) {
  let e, t, r, i, s, l, o, c, a;
  function g(d, _) {
    return d[2].length === 0 ? xn : Fn;
  }
  let p = g(n), h = p(n);
  return { c() {
    e = m("div"), t = m("div"), r = m("div"), i = m("div"), i.innerHTML = '<h2 class="svelte-1h9haes">Choose a Level</h2> <p class="svelte-1h9haes">Select a level to play. Completed levels are marked.</p>', s = $(), l = m("button"), l.textContent = "Close", o = $(), h.c(), f(l, "class", "close-btn svelte-1h9haes"), f(r, "class", "level-header svelte-1h9haes"), f(t, "class", "level-panel svelte-1h9haes"), f(e, "class", "level-overlay svelte-1h9haes"), f(e, "data-element-id", "level-selector-overlay");
  }, m(d, _) {
    k(d, e, _), u(e, t), u(t, r), u(r, i), u(r, s), u(r, l), u(t, o), h.m(t, null), c || (a = P(l, "click", n[3]), c = true);
  }, p(d, _) {
    p === (p = g(d)) && h ? h.p(d, _) : (h.d(1), h = p(d), h && (h.c(), h.m(t, null)));
  }, d(d) {
    d && v(e), h.d(), c = false, a();
  } };
}
function Fn(n) {
  let e, t = ye(n[2]), r = [];
  for (let i = 0; i < t.length; i += 1) r[i] = Ze(Ke(n, t, i));
  return { c() {
    e = m("div");
    for (let i = 0; i < r.length; i += 1) r[i].c();
    f(e, "class", "level-grid svelte-1h9haes");
  }, m(i, s) {
    k(i, e, s);
    for (let l = 0; l < r.length; l += 1) r[l] && r[l].m(e, null);
  }, p(i, s) {
    if (s & 53) {
      t = ye(i[2]);
      let l;
      for (l = 0; l < t.length; l += 1) {
        const o = Ke(i, t, l);
        r[l] ? r[l].p(o, s) : (r[l] = Ze(o), r[l].c(), r[l].m(e, null));
      }
      for (; l < r.length; l += 1) r[l].d(1);
      r.length = t.length;
    }
  }, d(i) {
    i && v(e), it(r, i);
  } };
}
function xn(n) {
  let e;
  return { c() {
    e = m("div"), e.textContent = "No levels loaded.", f(e, "class", "empty-state svelte-1h9haes");
  }, m(t, r) {
    k(t, e, r);
  }, p: b, d(t) {
    t && v(e);
  } };
}
function Ye(n) {
  let e, t, r = n[10].difficulty + "", i, s, l;
  return { c() {
    e = m("div"), t = N("("), i = N(r), s = N(")"), f(e, "class", l = we(`level-difficulty difficulty-${n[10].difficulty}`) + " svelte-1h9haes");
  }, m(o, c) {
    k(o, e, c), u(e, t), u(e, i), u(e, s);
  }, p(o, c) {
    c & 4 && r !== (r = o[10].difficulty + "") && U(i, r), c & 4 && l !== (l = we(`level-difficulty difficulty-${o[10].difficulty}`) + " svelte-1h9haes") && f(e, "class", l);
  }, d(o) {
    o && v(e);
  } };
}
function Qe(n) {
  let e;
  return { c() {
    e = m("div"), e.textContent = "Completed", f(e, "class", "level-status svelte-1h9haes");
  }, m(t, r) {
    k(t, e, r);
  }, d(t) {
    t && v(e);
  } };
}
function Xe(n) {
  let e;
  return { c() {
    e = m("div"), e.textContent = "Current", f(e, "class", "level-status current svelte-1h9haes");
  }, m(t, r) {
    k(t, e, r);
  }, d(t) {
    t && v(e);
  } };
}
function Ze(n) {
  let e, t, r, i = n[10].id + "", s, l, o, c = n[10].name + "", a, g, p, h = n[5](n[10].id), d, _, F, B, q, y = n[10].difficulty && Ye(n), E = h && Qe(), L = n[10].id === n[0] && Xe();
  function R() {
    return n[7](n[10], n[12]);
  }
  return { c() {
    e = m("button"), t = m("div"), r = N("Level "), s = N(i), l = $(), o = m("div"), a = N(c), g = $(), y && y.c(), p = $(), E && E.c(), d = $(), L && L.c(), _ = $(), f(t, "class", "level-number svelte-1h9haes"), f(o, "class", "level-name svelte-1h9haes"), f(e, "class", F = we(`level-card ${n[5](n[10].id) ? "completed" : ""} ${n[10].id === n[0] ? "current" : ""}`) + " svelte-1h9haes");
  }, m(G, H) {
    k(G, e, H), u(e, t), u(t, r), u(t, s), u(e, l), u(e, o), u(o, a), u(e, g), y && y.m(e, null), u(e, p), E && E.m(e, null), u(e, d), L && L.m(e, null), u(e, _), B || (q = P(e, "click", R), B = true);
  }, p(G, H) {
    n = G, H & 4 && i !== (i = n[10].id + "") && U(s, i), H & 4 && c !== (c = n[10].name + "") && U(a, c), n[10].difficulty ? y ? y.p(n, H) : (y = Ye(n), y.c(), y.m(e, p)) : y && (y.d(1), y = null), H & 4 && (h = n[5](n[10].id)), h ? E || (E = Qe(), E.c(), E.m(e, d)) : E && (E.d(1), E = null), n[10].id === n[0] ? L || (L = Xe(), L.c(), L.m(e, _)) : L && (L.d(1), L = null), H & 5 && F !== (F = we(`level-card ${n[5](n[10].id) ? "completed" : ""} ${n[10].id === n[0] ? "current" : ""}`) + " svelte-1h9haes") && f(e, "class", F);
  }, d(G) {
    G && v(e), y && y.d(), E && E.d(), L && L.d(), B = false, q();
  } };
}
function Cn(n) {
  let e, t = n[1] && Je(n);
  return { c() {
    t && t.c(), e = de();
  }, m(r, i) {
    t && t.m(r, i), k(r, e, i);
  }, p(r, [i]) {
    r[1] ? t ? t.p(r, i) : (t = Je(r), t.c(), t.m(e.parentNode, e)) : t && (t.d(1), t = null);
  }, i: b, o: b, d(r) {
    r && v(e), t && t.d(r);
  } };
}
function An(n, e, t) {
  let r, i, s, l, o;
  M(n, Ie, (d) => t(8, i = d)), M(n, Q, (d) => t(6, s = d)), M(n, Me, (d) => t(1, l = d)), M(n, at, (d) => t(2, o = d));
  const c = Oe("GAME_ENGINE");
  function a() {
    Me.set(false);
  }
  async function g(d, _) {
    await c.loadLevel(_ + 1), a();
  }
  function p(d) {
    return i.includes(d);
  }
  const h = (d, _) => g(d, _);
  return n.$$.update = () => {
    n.$$.dirty & 64 && t(0, r = s.currentLevel);
  }, [r, l, o, a, g, p, s, h];
}
class In extends z {
  constructor(e) {
    super(), O(this, e, An, Cn, C, {});
  }
}
function et(n) {
  let e, t, r, i = n[1] && tt(n);
  return { c() {
    e = m("div"), t = m("strong"), t.textContent = "Level Complete!", r = $(), i && i.c(), f(e, "class", "banner svelte-1uymdtg"), f(e, "data-element-id", "level-complete-banner");
  }, m(s, l) {
    k(s, e, l), u(e, t), u(e, r), i && i.m(e, null);
  }, p(s, l) {
    s[1] ? i ? i.p(s, l) : (i = tt(s), i.c(), i.m(e, null)) : i && (i.d(1), i = null);
  }, d(s) {
    s && v(e), i && i.d();
  } };
}
function tt(n) {
  let e, t = n[1].name + "", r;
  return { c() {
    e = m("span"), r = N(t);
  }, m(i, s) {
    k(i, e, s), u(e, r);
  }, p(i, s) {
    s & 2 && t !== (t = i[1].name + "") && U(r, t);
  }, d(i) {
    i && v(e);
  } };
}
function Mn(n) {
  let e, t = n[0].status === "LevelComplete" && et(n);
  return { c() {
    t && t.c(), e = de();
  }, m(r, i) {
    t && t.m(r, i), k(r, e, i);
  }, p(r, [i]) {
    r[0].status === "LevelComplete" ? t ? t.p(r, i) : (t = et(r), t.c(), t.m(e.parentNode, e)) : t && (t.d(1), t = null);
  }, i: b, o: b, d(r) {
    r && v(e), t && t.d(r);
  } };
}
function Nn(n, e, t) {
  let r, i;
  return M(n, Q, (s) => t(0, r = s)), M(n, Te, (s) => t(1, i = s)), [r, i];
}
class On extends z {
  constructor(e) {
    super(), O(this, e, Nn, Mn, C, {});
  }
}
function zn(n) {
  let e, t, r, i, s, l, o, c, a, g, p;
  return t = new Xt({}), i = new On({}), l = new on({}), c = new Sn({}), g = new In({}), { c() {
    e = m("div"), T(t.$$.fragment), r = $(), T(i.$$.fragment), s = $(), T(l.$$.fragment), o = $(), T(c.$$.fragment), a = $(), T(g.$$.fragment), f(e, "class", "game-container svelte-1t5xe4u");
  }, m(h, d) {
    k(h, e, d), A(t, e, null), u(e, r), A(i, e, null), u(e, s), A(l, e, null), u(e, o), A(c, e, null), u(e, a), A(g, e, null), p = true;
  }, p: b, i(h) {
    p || (S(t.$$.fragment, h), S(i.$$.fragment, h), S(l.$$.fragment, h), S(c.$$.fragment, h), S(g.$$.fragment, h), p = true);
  }, o(h) {
    x(t.$$.fragment, h), x(i.$$.fragment, h), x(l.$$.fragment, h), x(c.$$.fragment, h), x(g.$$.fragment, h), p = false;
  }, d(h) {
    h && v(e), I(t), I(i), I(l), I(c), I(g);
  } };
}
class Bn extends z {
  constructor(e) {
    super(), O(this, e, null, zn, C, {});
  }
}
function Tn(n) {
  let e, t, r, i;
  return e = new Dt({}), r = new Bn({}), { c() {
    T(e.$$.fragment), t = $(), T(r.$$.fragment);
  }, m(s, l) {
    A(e, s, l), k(s, t, l), A(r, s, l), i = true;
  }, p: b, i(s) {
    i || (S(e.$$.fragment, s), S(r.$$.fragment, s), i = true);
  }, o(s) {
    x(e.$$.fragment, s), x(r.$$.fragment, s), i = false;
  }, d(s) {
    s && v(t), I(e, s), I(r, s);
  } };
}
function me(n) {
  return n === void 0 ? true : be(n);
}
function be(n) {
  return Array.isArray(n) && n.every((e) => ut(e));
}
function ut(n) {
  if (!n || typeof n != "object") return false;
  const e = n;
  return ne(e.x) && ne(e.y);
}
function Rn(n) {
  if (!n || typeof n != "object") return false;
  const e = n;
  return ne(e.width) && ne(e.height);
}
function ne(n) {
  return typeof n == "number" && Number.isFinite(n);
}
function qn(n, e, t) {
  let r, i;
  M(n, Te, (d) => t(1, r = d)), M(n, Q, (d) => t(2, i = d));
  const s = new Nt();
  mt("GAME_ENGINE", s);
  let l, o = null;
  Ne(async () => {
    const d = new URLSearchParams(window.location.search), _ = Number.parseInt(d.get("level") ?? "1", 10), F = Number.isInteger(_) && _ > 0 ? _ : 1, B = d.get("levelsUrl"), q = d.get("test") === "true";
    zt(s), l = new Tt(s), l.attach(), Ie.set(Ue.getCompletedLevels());
    let y = null;
    if (q) {
      const E = await a();
      y = E.levels, y || fe.set(E.error ?? "Failed to load test level. Make sure the test server is running on port 3001.");
    } else if (B) {
      const E = await c(B);
      y = E.levels, y || fe.set(E.error ?? `Failed to load levels from ${B}. Using default levels instead.`);
    }
    await s.init(y, F), at.set(s.getLevels());
  }), st(() => {
    l && l.detach();
  });
  async function c(d) {
    try {
      const _ = await fetch(d);
      if (!_.ok) return { levels: null, error: `Failed to fetch levels (${_.status}). Using default levels instead.` };
      const F = await _.json();
      return p(F) ? { levels: F } : { levels: null, error: "Levels file has an invalid schema. Using default levels instead." };
    } catch (_) {
      return console.error("Failed to fetch custom levels", _), { levels: null, error: "Network, CORS, or JSON error while loading levels. Using default levels instead." };
    }
  }
  async function a() {
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
    return !(!ne(_.id) || typeof _.name != "string" || _.difficulty !== void 0 && typeof _.difficulty != "string" || !Rn(_.gridSize) || !be(_.snake) || !be(_.obstacles) || !be(_.food) || !ut(_.exit) || typeof _.snakeDirection != "string" || !g.has(_.snakeDirection) || !me(_.floatingFood) || !me(_.fallingFood) || !me(_.stones) || !me(_.spikes) || _.exitIsSolid !== void 0 && typeof _.exitIsSolid != "boolean" || !ne(_.totalFood));
  }
  return n.$$.update = () => {
    if (n.$$.dirty & 7) {
      if (i.status !== "LevelComplete") t(0, o = null);
      else if (r && o !== r.id) {
        t(0, o = r.id);
        const d = Ue.markCompleted(r.id);
        Ie.set(d);
      }
    }
  }, [o, r, i];
}
class Gn extends z {
  constructor(e) {
    super(), O(this, e, qn, Tn, C, {});
  }
}
new Gn({ target: document.getElementById("app") });
