function Zp(e, t) {
  const n = /* @__PURE__ */ Object.create(null), o = e.split(",");
  for (let r = 0; r < o.length; r++)
    n[o[r]] = !0;
  return t ? (r) => !!n[r.toLowerCase()] : (r) => !!n[r];
}
const Je = process.env.NODE_ENV !== "production" ? Object.freeze({}) : {}, eh = process.env.NODE_ENV !== "production" ? Object.freeze([]) : [], Ea = () => {
}, th = /^on[^a-z]/, nh = (e) => th.test(e), Le = Object.assign, oh = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, rh = Object.prototype.hasOwnProperty, ve = (e, t) => rh.call(e, t), se = Array.isArray, wn = (e) => Lr(e) === "[object Map]", ih = (e) => Lr(e) === "[object Set]", ge = (e) => typeof e == "function", Ve = (e) => typeof e == "string", zr = (e) => typeof e == "symbol", _e = (e) => e !== null && typeof e == "object", ah = (e) => (_e(e) || ge(e)) && ge(e.then) && ge(e.catch), lh = Object.prototype.toString, Lr = (e) => lh.call(e), yu = (e) => Lr(e).slice(8, -1), sh = (e) => Lr(e) === "[object Object]", Ta = (e) => Ve(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Pa = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, ch = /-(\w)/g, mr = Pa((e) => e.replace(ch, (t, n) => n ? n.toUpperCase() : "")), ao = Pa((e) => e.charAt(0).toUpperCase() + e.slice(1)), uh = Pa((e) => e ? `on${ao(e)}` : ""), rn = (e, t) => !Object.is(e, t), dh = (e, t, n) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    value: n
  });
}, fh = (e) => {
  const t = Ve(e) ? Number(e) : NaN;
  return isNaN(t) ? e : t;
};
let Vl;
const Fi = () => Vl || (Vl = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function jr(e) {
  if (se(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const o = e[n], r = Ve(o) ? mh(o) : jr(o);
      if (r)
        for (const i in r)
          t[i] = r[i];
    }
    return t;
  } else if (Ve(e) || _e(e))
    return e;
}
const ph = /;(?![^(]*\))/g, hh = /:([^]+)/, gh = /\/\*[^]*?\*\//g;
function mh(e) {
  const t = {};
  return e.replace(gh, "").split(ph).forEach((n) => {
    if (n) {
      const o = n.split(hh);
      o.length > 1 && (t[o[0].trim()] = o[1].trim());
    }
  }), t;
}
function $o(e) {
  let t = "";
  if (Ve(e))
    t = e;
  else if (se(e))
    for (let n = 0; n < e.length; n++) {
      const o = $o(e[n]);
      o && (t += o + " ");
    }
  else if (_e(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
function Wl(e, ...t) {
  console.warn(`[Vue warn] ${e}`, ...t);
}
let Su;
function vh(e, t = Su) {
  t && t.active && t.effects.push(e);
}
function bh() {
  return Su;
}
const lo = (e) => {
  const t = new Set(e);
  return t.w = 0, t.n = 0, t;
}, wu = (e) => (e.w & Ft) > 0, Cu = (e) => (e.n & Ft) > 0, yh = ({ deps: e }) => {
  if (e.length)
    for (let t = 0; t < e.length; t++)
      e[t].w |= Ft;
}, Sh = (e) => {
  const { deps: t } = e;
  if (t.length) {
    let n = 0;
    for (let o = 0; o < t.length; o++) {
      const r = t[o];
      wu(r) && !Cu(r) ? r.delete(e) : t[n++] = r, r.w &= ~Ft, r.n &= ~Ft;
    }
    t.length = n;
  }
}, vr = /* @__PURE__ */ new WeakMap();
let kn = 0, Ft = 1;
const zi = 30;
let Ae;
const Qt = Symbol(process.env.NODE_ENV !== "production" ? "iterate" : ""), Li = Symbol(process.env.NODE_ENV !== "production" ? "Map key iterate" : "");
class xu {
  constructor(t, n = null, o) {
    this.fn = t, this.scheduler = n, this.active = !0, this.deps = [], this.parent = void 0, vh(this, o);
  }
  run() {
    if (!this.active)
      return this.fn();
    let t = Ae, n = At;
    for (; t; ) {
      if (t === this)
        return;
      t = t.parent;
    }
    try {
      return this.parent = Ae, Ae = this, At = !0, Ft = 1 << ++kn, kn <= zi ? yh(this) : Kl(this), this.fn();
    } finally {
      kn <= zi && Sh(this), Ft = 1 << --kn, Ae = this.parent, At = n, this.parent = void 0, this.deferStop && this.stop();
    }
  }
  stop() {
    Ae === this ? this.deferStop = !0 : this.active && (Kl(this), this.onStop && this.onStop(), this.active = !1);
  }
}
function Kl(e) {
  const { deps: t } = e;
  if (t.length) {
    for (let n = 0; n < t.length; n++)
      t[n].delete(e);
    t.length = 0;
  }
}
let At = !0;
const Ou = [];
function Ia() {
  Ou.push(At), At = !1;
}
function Ma() {
  const e = Ou.pop();
  At = e === void 0 ? !0 : e;
}
function ze(e, t, n) {
  if (At && Ae) {
    let o = vr.get(e);
    o || vr.set(e, o = /* @__PURE__ */ new Map());
    let r = o.get(n);
    r || o.set(n, r = lo());
    const i = process.env.NODE_ENV !== "production" ? { effect: Ae, target: e, type: t, key: n } : void 0;
    ji(r, i);
  }
}
function ji(e, t) {
  let n = !1;
  kn <= zi ? Cu(e) || (e.n |= Ft, n = !wu(e)) : n = !e.has(Ae), n && (e.add(Ae), Ae.deps.push(e), process.env.NODE_ENV !== "production" && Ae.onTrack && Ae.onTrack(
    Le(
      {
        effect: Ae
      },
      t
    )
  ));
}
function Dt(e, t, n, o, r, i) {
  const a = vr.get(e);
  if (!a)
    return;
  let l = [];
  if (t === "clear")
    l = [...a.values()];
  else if (n === "length" && se(e)) {
    const s = Number(o);
    a.forEach((d, u) => {
      (u === "length" || !zr(u) && u >= s) && l.push(d);
    });
  } else
    switch (n !== void 0 && l.push(a.get(n)), t) {
      case "add":
        se(e) ? Ta(n) && l.push(a.get("length")) : (l.push(a.get(Qt)), wn(e) && l.push(a.get(Li)));
        break;
      case "delete":
        se(e) || (l.push(a.get(Qt)), wn(e) && l.push(a.get(Li)));
        break;
      case "set":
        wn(e) && l.push(a.get(Qt));
        break;
    }
  const c = process.env.NODE_ENV !== "production" ? { target: e, type: t, key: n, newValue: o, oldValue: r, oldTarget: i } : void 0;
  if (l.length === 1)
    l[0] && (process.env.NODE_ENV !== "production" ? yn(l[0], c) : yn(l[0]));
  else {
    const s = [];
    for (const d of l)
      d && s.push(...d);
    process.env.NODE_ENV !== "production" ? yn(lo(s), c) : yn(lo(s));
  }
}
function yn(e, t) {
  const n = se(e) ? e : [...e];
  for (const o of n)
    o.computed && Ul(o, t);
  for (const o of n)
    o.computed || Ul(o, t);
}
function Ul(e, t) {
  (e !== Ae || e.allowRecurse) && (process.env.NODE_ENV !== "production" && e.onTrigger && e.onTrigger(Le({ effect: e }, t)), e.scheduler ? e.scheduler() : e.run());
}
function wh(e, t) {
  var n;
  return (n = vr.get(e)) == null ? void 0 : n.get(t);
}
const Ch = /* @__PURE__ */ Zp("__proto__,__v_isRef,__isVue"), $u = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(zr)
), Xl = /* @__PURE__ */ xh();
function xh() {
  const e = {};
  return ["includes", "indexOf", "lastIndexOf"].forEach((t) => {
    e[t] = function(...n) {
      const o = J(this);
      for (let i = 0, a = this.length; i < a; i++)
        ze(o, "get", i + "");
      const r = o[t](...n);
      return r === -1 || r === !1 ? o[t](...n.map(J)) : r;
    };
  }), ["push", "pop", "shift", "unshift", "splice"].forEach((t) => {
    e[t] = function(...n) {
      Ia();
      const o = J(this)[t].apply(this, n);
      return Ma(), o;
    };
  }), e;
}
function Oh(e) {
  const t = J(this);
  return ze(t, "has", e), t.hasOwnProperty(e);
}
class _u {
  constructor(t = !1, n = !1) {
    this._isReadonly = t, this._shallow = n;
  }
  get(t, n, o) {
    const r = this._isReadonly, i = this._shallow;
    if (n === "__v_isReactive")
      return !r;
    if (n === "__v_isReadonly")
      return r;
    if (n === "__v_isShallow")
      return i;
    if (n === "__v_raw" && o === (r ? i ? Mu : Iu : i ? Fh : Pu).get(t))
      return t;
    const a = se(t);
    if (!r) {
      if (a && ve(Xl, n))
        return Reflect.get(Xl, n, o);
      if (n === "hasOwnProperty")
        return Oh;
    }
    const l = Reflect.get(t, n, o);
    return (zr(n) ? $u.has(n) : Ch(n)) || (r || ze(t, "get", n), i) ? l : xe(l) ? a && Ta(n) ? l : l.value : _e(l) ? r ? Nu(l) : Ye(l) : l;
  }
}
class $h extends _u {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, o, r) {
    let i = t[n];
    if (zt(i) && xe(i) && !xe(o))
      return !1;
    if (!this._shallow && (!br(o) && !zt(o) && (i = J(i), o = J(o)), !se(t) && xe(i) && !xe(o)))
      return i.value = o, !0;
    const a = se(t) && Ta(n) ? Number(n) < t.length : ve(t, n), l = Reflect.set(t, n, o, r);
    return t === J(r) && (a ? rn(o, i) && Dt(t, "set", n, o, i) : Dt(t, "add", n, o)), l;
  }
  deleteProperty(t, n) {
    const o = ve(t, n), r = t[n], i = Reflect.deleteProperty(t, n);
    return i && o && Dt(t, "delete", n, void 0, r), i;
  }
  has(t, n) {
    const o = Reflect.has(t, n);
    return (!zr(n) || !$u.has(n)) && ze(t, "has", n), o;
  }
  ownKeys(t) {
    return ze(
      t,
      "iterate",
      se(t) ? "length" : Qt
    ), Reflect.ownKeys(t);
  }
}
class Eu extends _u {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, n) {
    return process.env.NODE_ENV !== "production" && Wl(
      `Set operation on key "${String(n)}" failed: target is readonly.`,
      t
    ), !0;
  }
  deleteProperty(t, n) {
    return process.env.NODE_ENV !== "production" && Wl(
      `Delete operation on key "${String(n)}" failed: target is readonly.`,
      t
    ), !0;
  }
}
const _h = /* @__PURE__ */ new $h(), Eh = /* @__PURE__ */ new Eu(), Th = /* @__PURE__ */ new Eu(!0), Na = (e) => e, Br = (e) => Reflect.getPrototypeOf(e);
function Lo(e, t, n = !1, o = !1) {
  e = e.__v_raw;
  const r = J(e), i = J(t);
  n || (rn(t, i) && ze(r, "get", t), ze(r, "get", i));
  const { has: a } = Br(r), l = o ? Na : n ? Ra : so;
  if (a.call(r, t))
    return l(e.get(t));
  if (a.call(r, i))
    return l(e.get(i));
  e !== r && e.get(t);
}
function jo(e, t = !1) {
  const n = this.__v_raw, o = J(n), r = J(e);
  return t || (rn(e, r) && ze(o, "has", e), ze(o, "has", r)), e === r ? n.has(e) : n.has(e) || n.has(r);
}
function Bo(e, t = !1) {
  return e = e.__v_raw, !t && ze(J(e), "iterate", Qt), Reflect.get(e, "size", e);
}
function Gl(e) {
  e = J(e);
  const t = J(this);
  return Br(t).has.call(t, e) || (t.add(e), Dt(t, "add", e, e)), this;
}
function kl(e, t) {
  t = J(t);
  const n = J(this), { has: o, get: r } = Br(n);
  let i = o.call(n, e);
  i ? process.env.NODE_ENV !== "production" && Tu(n, o, e) : (e = J(e), i = o.call(n, e));
  const a = r.call(n, e);
  return n.set(e, t), i ? rn(t, a) && Dt(n, "set", e, t, a) : Dt(n, "add", e, t), this;
}
function Yl(e) {
  const t = J(this), { has: n, get: o } = Br(t);
  let r = n.call(t, e);
  r ? process.env.NODE_ENV !== "production" && Tu(t, n, e) : (e = J(e), r = n.call(t, e));
  const i = o ? o.call(t, e) : void 0, a = t.delete(e);
  return r && Dt(t, "delete", e, void 0, i), a;
}
function ql() {
  const e = J(this), t = e.size !== 0, n = process.env.NODE_ENV !== "production" ? wn(e) ? new Map(e) : new Set(e) : void 0, o = e.clear();
  return t && Dt(e, "clear", void 0, void 0, n), o;
}
function Vo(e, t) {
  return function(o, r) {
    const i = this, a = i.__v_raw, l = J(a), c = t ? Na : e ? Ra : so;
    return !e && ze(l, "iterate", Qt), a.forEach((s, d) => o.call(r, c(s), c(d), i));
  };
}
function Wo(e, t, n) {
  return function(...o) {
    const r = this.__v_raw, i = J(r), a = wn(i), l = e === "entries" || e === Symbol.iterator && a, c = e === "keys" && a, s = r[e](...o), d = n ? Na : t ? Ra : so;
    return !t && ze(
      i,
      "iterate",
      c ? Li : Qt
    ), {
      // iterator protocol
      next() {
        const { value: u, done: f } = s.next();
        return f ? { value: u, done: f } : {
          value: l ? [d(u[0]), d(u[1])] : d(u),
          done: f
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function Ot(e) {
  return function(...t) {
    if (process.env.NODE_ENV !== "production") {
      const n = t[0] ? `on key "${t[0]}" ` : "";
      console.warn(
        `${ao(e)} operation ${n}failed: target is readonly.`,
        J(this)
      );
    }
    return e === "delete" ? !1 : this;
  };
}
function Ph() {
  const e = {
    get(i) {
      return Lo(this, i);
    },
    get size() {
      return Bo(this);
    },
    has: jo,
    add: Gl,
    set: kl,
    delete: Yl,
    clear: ql,
    forEach: Vo(!1, !1)
  }, t = {
    get(i) {
      return Lo(this, i, !1, !0);
    },
    get size() {
      return Bo(this);
    },
    has: jo,
    add: Gl,
    set: kl,
    delete: Yl,
    clear: ql,
    forEach: Vo(!1, !0)
  }, n = {
    get(i) {
      return Lo(this, i, !0);
    },
    get size() {
      return Bo(this, !0);
    },
    has(i) {
      return jo.call(this, i, !0);
    },
    add: Ot("add"),
    set: Ot("set"),
    delete: Ot("delete"),
    clear: Ot("clear"),
    forEach: Vo(!0, !1)
  }, o = {
    get(i) {
      return Lo(this, i, !0, !0);
    },
    get size() {
      return Bo(this, !0);
    },
    has(i) {
      return jo.call(this, i, !0);
    },
    add: Ot("add"),
    set: Ot("set"),
    delete: Ot("delete"),
    clear: Ot("clear"),
    forEach: Vo(!0, !0)
  };
  return ["keys", "values", "entries", Symbol.iterator].forEach((i) => {
    e[i] = Wo(
      i,
      !1,
      !1
    ), n[i] = Wo(
      i,
      !0,
      !1
    ), t[i] = Wo(
      i,
      !1,
      !0
    ), o[i] = Wo(
      i,
      !0,
      !0
    );
  }), [
    e,
    n,
    t,
    o
  ];
}
const [
  Ih,
  Mh,
  Nh,
  Ah
] = /* @__PURE__ */ Ph();
function Aa(e, t) {
  const n = t ? e ? Ah : Nh : e ? Mh : Ih;
  return (o, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? o : Reflect.get(
    ve(n, r) && r in o ? n : o,
    r,
    i
  );
}
const Dh = {
  get: /* @__PURE__ */ Aa(!1, !1)
}, Rh = {
  get: /* @__PURE__ */ Aa(!0, !1)
}, Hh = {
  get: /* @__PURE__ */ Aa(!0, !0)
};
function Tu(e, t, n) {
  const o = J(n);
  if (o !== n && t.call(e, o)) {
    const r = yu(e);
    console.warn(
      `Reactive ${r} contains both the raw and reactive versions of the same object${r === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
const Pu = /* @__PURE__ */ new WeakMap(), Fh = /* @__PURE__ */ new WeakMap(), Iu = /* @__PURE__ */ new WeakMap(), Mu = /* @__PURE__ */ new WeakMap();
function zh(e) {
  switch (e) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function Lh(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : zh(yu(e));
}
function Ye(e) {
  return zt(e) ? e : Da(
    e,
    !1,
    _h,
    Dh,
    Pu
  );
}
function Nu(e) {
  return Da(
    e,
    !0,
    Eh,
    Rh,
    Iu
  );
}
function Ko(e) {
  return Da(
    e,
    !0,
    Th,
    Hh,
    Mu
  );
}
function Da(e, t, n, o, r) {
  if (!_e(e))
    return process.env.NODE_ENV !== "production" && console.warn(`value cannot be made reactive: ${String(e)}`), e;
  if (e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const i = r.get(e);
  if (i)
    return i;
  const a = Lh(e);
  if (a === 0)
    return e;
  const l = new Proxy(
    e,
    a === 2 ? o : n
  );
  return r.set(e, l), l;
}
function Jt(e) {
  return zt(e) ? Jt(e.__v_raw) : !!(e && e.__v_isReactive);
}
function zt(e) {
  return !!(e && e.__v_isReadonly);
}
function br(e) {
  return !!(e && e.__v_isShallow);
}
function yr(e) {
  return Jt(e) || zt(e);
}
function J(e) {
  const t = e && e.__v_raw;
  return t ? J(t) : e;
}
function jh(e) {
  return dh(e, "__v_skip", !0), e;
}
const so = (e) => _e(e) ? Ye(e) : e, Ra = (e) => _e(e) ? Nu(e) : e;
function Au(e) {
  At && Ae && (e = J(e), process.env.NODE_ENV !== "production" ? ji(e.dep || (e.dep = lo()), {
    target: e,
    type: "get",
    key: "value"
  }) : ji(e.dep || (e.dep = lo())));
}
function Du(e, t) {
  e = J(e);
  const n = e.dep;
  n && (process.env.NODE_ENV !== "production" ? yn(n, {
    target: e,
    type: "set",
    key: "value",
    newValue: t
  }) : yn(n));
}
function xe(e) {
  return !!(e && e.__v_isRef === !0);
}
function oe(e) {
  return Ru(e, !1);
}
function V(e) {
  return Ru(e, !0);
}
function Ru(e, t) {
  return xe(e) ? e : new Bh(e, t);
}
class Bh {
  constructor(t, n) {
    this.__v_isShallow = n, this.dep = void 0, this.__v_isRef = !0, this._rawValue = n ? t : J(t), this._value = n ? t : so(t);
  }
  get value() {
    return Au(this), this._value;
  }
  set value(t) {
    const n = this.__v_isShallow || br(t) || zt(t);
    t = n ? t : J(t), rn(t, this._rawValue) && (this._rawValue = t, this._value = n ? t : so(t), Du(this, t));
  }
}
function $n(e) {
  return xe(e) ? e.value : e;
}
const Vh = {
  get: (e, t, n) => $n(Reflect.get(e, t, n)),
  set: (e, t, n, o) => {
    const r = e[t];
    return xe(r) && !xe(n) ? (r.value = n, !0) : Reflect.set(e, t, n, o);
  }
};
function Wh(e) {
  return Jt(e) ? e : new Proxy(e, Vh);
}
function Kh(e) {
  process.env.NODE_ENV !== "production" && !yr(e) && console.warn("toRefs() expects a reactive object but received a plain one.");
  const t = se(e) ? new Array(e.length) : {};
  for (const n in e)
    t[n] = Hu(e, n);
  return t;
}
class Uh {
  constructor(t, n, o) {
    this._object = t, this._key = n, this._defaultValue = o, this.__v_isRef = !0;
  }
  get value() {
    const t = this._object[this._key];
    return t === void 0 ? this._defaultValue : t;
  }
  set value(t) {
    this._object[this._key] = t;
  }
  get dep() {
    return wh(J(this._object), this._key);
  }
}
class Xh {
  constructor(t) {
    this._getter = t, this.__v_isRef = !0, this.__v_isReadonly = !0;
  }
  get value() {
    return this._getter();
  }
}
function at(e, t, n) {
  return xe(e) ? e : ge(e) ? new Xh(e) : _e(e) && arguments.length > 1 ? Hu(e, t, n) : oe(e);
}
function Hu(e, t, n) {
  const o = e[t];
  return xe(o) ? o : new Uh(e, t, n);
}
class Gh {
  constructor(t, n, o, r) {
    this._setter = n, this.dep = void 0, this.__v_isRef = !0, this.__v_isReadonly = !1, this._dirty = !0, this.effect = new xu(t, () => {
      this._dirty || (this._dirty = !0, Du(this));
    }), this.effect.computed = this, this.effect.active = this._cacheable = !r, this.__v_isReadonly = o;
  }
  get value() {
    const t = J(this);
    return Au(t), (t._dirty || !t._cacheable) && (t._dirty = !1, t._value = t.effect.run()), t._value;
  }
  set value(t) {
    this._setter(t);
  }
}
function Bi(e, t, n = !1) {
  let o, r;
  const i = ge(e);
  i ? (o = e, r = process.env.NODE_ENV !== "production" ? () => {
    console.warn("Write operation failed: computed value is readonly");
  } : Ea) : (o = e.get, r = e.set);
  const a = new Gh(o, r, i || !r, n);
  return process.env.NODE_ENV !== "production" && t && !n && (a.effect.onTrack = t.onTrack, a.effect.onTrigger = t.onTrigger), a;
}
const Zt = [];
function kh(e) {
  Zt.push(e);
}
function Yh() {
  Zt.pop();
}
function le(e, ...t) {
  if (process.env.NODE_ENV === "production")
    return;
  Ia();
  const n = Zt.length ? Zt[Zt.length - 1].component : null, o = n && n.appContext.config.warnHandler, r = qh();
  if (o)
    en(
      o,
      n,
      11,
      [
        e + t.join(""),
        n && n.proxy,
        r.map(
          ({ vnode: i }) => `at <${sd(n, i.type)}>`
        ).join(`
`),
        r
      ]
    );
  else {
    const i = [`[Vue warn]: ${e}`, ...t];
    r.length && i.push(`
`, ...Qh(r)), console.warn(...i);
  }
  Ma();
}
function qh() {
  let e = Zt[Zt.length - 1];
  if (!e)
    return [];
  const t = [];
  for (; e; ) {
    const n = t[0];
    n && n.vnode === e ? n.recurseCount++ : t.push({
      vnode: e,
      recurseCount: 0
    });
    const o = e.component && e.component.parent;
    e = o && o.vnode;
  }
  return t;
}
function Qh(e) {
  const t = [];
  return e.forEach((n, o) => {
    t.push(...o === 0 ? [] : [`
`], ...Jh(n));
  }), t;
}
function Jh({ vnode: e, recurseCount: t }) {
  const n = t > 0 ? `... (${t} recursive calls)` : "", o = e.component ? e.component.parent == null : !1, r = ` at <${sd(
    e.component,
    e.type,
    o
  )}`, i = ">" + n;
  return e.props ? [r, ...Zh(e.props), i] : [r + i];
}
function Zh(e) {
  const t = [], n = Object.keys(e);
  return n.slice(0, 3).forEach((o) => {
    t.push(...Fu(o, e[o]));
  }), n.length > 3 && t.push(" ..."), t;
}
function Fu(e, t, n) {
  return Ve(t) ? (t = JSON.stringify(t), n ? t : [`${e}=${t}`]) : typeof t == "number" || typeof t == "boolean" || t == null ? n ? t : [`${e}=${t}`] : xe(t) ? (t = Fu(e, J(t.value), !0), n ? t : [`${e}=Ref<`, t, ">"]) : ge(t) ? [`${e}=fn${t.name ? `<${t.name}>` : ""}`] : (t = J(t), n ? t : [`${e}=`, t]);
}
function eg(e, t) {
  process.env.NODE_ENV !== "production" && e !== void 0 && (typeof e != "number" ? le(`${t} is not a valid number - got ${JSON.stringify(e)}.`) : isNaN(e) && le(`${t} is NaN - the duration expression might be incorrect.`));
}
const Ha = {
  sp: "serverPrefetch hook",
  bc: "beforeCreate hook",
  c: "created hook",
  bm: "beforeMount hook",
  m: "mounted hook",
  bu: "beforeUpdate hook",
  u: "updated",
  bum: "beforeUnmount hook",
  um: "unmounted hook",
  a: "activated hook",
  da: "deactivated hook",
  ec: "errorCaptured hook",
  rtc: "renderTracked hook",
  rtg: "renderTriggered hook",
  0: "setup function",
  1: "render function",
  2: "watcher getter",
  3: "watcher callback",
  4: "watcher cleanup function",
  5: "native event handler",
  6: "component event handler",
  7: "vnode hook",
  8: "directive hook",
  9: "transition hook",
  10: "app errorHandler",
  11: "app warnHandler",
  12: "ref function",
  13: "async component loader",
  14: "scheduler flush. This is likely a Vue internals bug. Please open an issue at https://new-issue.vuejs.org/?repo=vuejs/core"
};
function en(e, t, n, o) {
  let r;
  try {
    r = o ? e(...o) : e();
  } catch (i) {
    zu(i, t, n);
  }
  return r;
}
function co(e, t, n, o) {
  if (ge(e)) {
    const i = en(e, t, n, o);
    return i && ah(i) && i.catch((a) => {
      zu(a, t, n);
    }), i;
  }
  const r = [];
  for (let i = 0; i < e.length; i++)
    r.push(co(e[i], t, n, o));
  return r;
}
function zu(e, t, n, o = !0) {
  const r = t ? t.vnode : null;
  if (t) {
    let i = t.parent;
    const a = t.proxy, l = process.env.NODE_ENV !== "production" ? Ha[n] : n;
    for (; i; ) {
      const s = i.ec;
      if (s) {
        for (let d = 0; d < s.length; d++)
          if (s[d](e, a, l) === !1)
            return;
      }
      i = i.parent;
    }
    const c = t.appContext.config.errorHandler;
    if (c) {
      en(
        c,
        null,
        10,
        [e, a, l]
      );
      return;
    }
  }
  tg(e, n, r, o);
}
function tg(e, t, n, o = !0) {
  if (process.env.NODE_ENV !== "production") {
    const r = Ha[t];
    if (n && kh(n), le(`Unhandled error${r ? ` during execution of ${r}` : ""}`), n && Yh(), o)
      throw e;
    console.error(e);
  } else
    console.error(e);
}
let Sr = !1, Vi = !1;
const Ze = [];
let It = 0;
const Cn = [];
let lt = null, Tt = 0;
const Lu = /* @__PURE__ */ Promise.resolve();
let Fa = null;
const ng = 100;
function ke(e) {
  const t = Fa || Lu;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function og(e) {
  let t = It + 1, n = Ze.length;
  for (; t < n; ) {
    const o = t + n >>> 1, r = Ze[o], i = uo(r);
    i < e || i === e && r.pre ? t = o + 1 : n = o;
  }
  return t;
}
function za(e) {
  (!Ze.length || !Ze.includes(
    e,
    Sr && e.allowRecurse ? It + 1 : It
  )) && (e.id == null ? Ze.push(e) : Ze.splice(og(e.id), 0, e), ju());
}
function ju() {
  !Sr && !Vi && (Vi = !0, Fa = Lu.then(Vu));
}
function Bu(e) {
  se(e) ? Cn.push(...e) : (!lt || !lt.includes(
    e,
    e.allowRecurse ? Tt + 1 : Tt
  )) && Cn.push(e), ju();
}
function rg(e) {
  if (Cn.length) {
    const t = [...new Set(Cn)];
    if (Cn.length = 0, lt) {
      lt.push(...t);
      return;
    }
    for (lt = t, process.env.NODE_ENV !== "production" && (e = e || /* @__PURE__ */ new Map()), lt.sort((n, o) => uo(n) - uo(o)), Tt = 0; Tt < lt.length; Tt++)
      process.env.NODE_ENV !== "production" && Wu(e, lt[Tt]) || lt[Tt]();
    lt = null, Tt = 0;
  }
}
const uo = (e) => e.id == null ? 1 / 0 : e.id, ig = (e, t) => {
  const n = uo(e) - uo(t);
  if (n === 0) {
    if (e.pre && !t.pre)
      return -1;
    if (t.pre && !e.pre)
      return 1;
  }
  return n;
};
function Vu(e) {
  Vi = !1, Sr = !0, process.env.NODE_ENV !== "production" && (e = e || /* @__PURE__ */ new Map()), Ze.sort(ig);
  const t = process.env.NODE_ENV !== "production" ? (n) => Wu(e, n) : Ea;
  try {
    for (It = 0; It < Ze.length; It++) {
      const n = Ze[It];
      if (n && n.active !== !1) {
        if (process.env.NODE_ENV !== "production" && t(n))
          continue;
        en(n, null, 14);
      }
    }
  } finally {
    It = 0, Ze.length = 0, rg(e), Sr = !1, Fa = null, (Ze.length || Cn.length) && Vu(e);
  }
}
function Wu(e, t) {
  if (!e.has(t))
    e.set(t, 1);
  else {
    const n = e.get(t);
    if (n > ng) {
      const o = t.ownerInstance, r = o && Ua(o.type);
      return le(
        `Maximum recursive updates exceeded${r ? ` in component <${r}>` : ""}. This means you have a reactive effect that is mutating its own dependencies and thus recursively triggering itself. Possible sources include component template, render function, updated hook or watcher source function.`
      ), !0;
    } else
      e.set(t, n + 1);
  }
}
let Wi = !1;
const mn = /* @__PURE__ */ new Set();
process.env.NODE_ENV !== "production" && (Fi().__VUE_HMR_RUNTIME__ = {
  createRecord: ci(ag),
  rerender: ci(lg),
  reload: ci(sg)
});
const wr = /* @__PURE__ */ new Map();
function ag(e, t) {
  return wr.has(e) ? !1 : (wr.set(e, {
    initialDef: eo(t),
    instances: /* @__PURE__ */ new Set()
  }), !0);
}
function eo(e) {
  return cd(e) ? e.__vccOpts : e;
}
function lg(e, t) {
  const n = wr.get(e);
  n && (n.initialDef.render = t, [...n.instances].forEach((o) => {
    t && (o.render = t, eo(o.type).render = t), o.renderCache = [], Wi = !0, o.update(), Wi = !1;
  }));
}
function sg(e, t) {
  const n = wr.get(e);
  if (!n)
    return;
  t = eo(t), Ql(n.initialDef, t);
  const o = [...n.instances];
  for (const r of o) {
    const i = eo(r.type);
    mn.has(i) || (i !== n.initialDef && Ql(i, t), mn.add(i)), r.appContext.propsCache.delete(r.type), r.appContext.emitsCache.delete(r.type), r.appContext.optionsCache.delete(r.type), r.ceReload ? (mn.add(i), r.ceReload(t.styles), mn.delete(i)) : r.parent ? za(r.parent.update) : r.appContext.reload ? r.appContext.reload() : typeof window < "u" ? window.location.reload() : console.warn(
      "[HMR] Root or manually mounted instance modified. Full reload required."
    );
  }
  Bu(() => {
    for (const r of o)
      mn.delete(
        eo(r.type)
      );
  });
}
function Ql(e, t) {
  Le(e, t);
  for (const n in e)
    n !== "__file" && !(n in t) && delete e[n];
}
function ci(e) {
  return (t, n) => {
    try {
      return e(t, n);
    } catch (o) {
      console.error(o), console.warn(
        "[HMR] Something went wrong during Vue component hot-reload. Full reload required."
      );
    }
  };
}
function cg(e, ...t) {
}
const ug = /* @__PURE__ */ dg(
  "component:updated"
  /* COMPONENT_UPDATED */
);
function dg(e) {
  return (t) => {
    cg(
      e,
      t.appContext.app,
      t.uid,
      t.parent ? t.parent.uid : void 0,
      t
    );
  };
}
let Ce = null, Vr = null;
function Jl(e) {
  const t = Ce;
  return Ce = e, Vr = e && e.type.__scopeId || null, t;
}
function fg(e) {
  Vr = e;
}
function pg() {
  Vr = null;
}
function hg(e, t = Ce, n) {
  if (!t || e._n)
    return e;
  const o = (...r) => {
    o._d && cs(-1);
    const i = Jl(t);
    let a;
    try {
      a = e(...r);
    } finally {
      Jl(i), o._d && cs(1);
    }
    return process.env.NODE_ENV !== "production" && ug(t), a;
  };
  return o._n = !0, o._c = !0, o._d = !0, o;
}
const gg = (e) => e.__isSuspense;
function mg(e, t) {
  t && t.pendingBranch ? se(e) ? t.effects.push(...e) : t.effects.push(e) : Bu(e);
}
function ut(e, t) {
  return La(e, null, t);
}
const Uo = {};
function ae(e, t, n) {
  return process.env.NODE_ENV !== "production" && !ge(t) && le(
    "`watch(fn, options?)` signature has been moved to a separate API. Use `watchEffect(fn, options?)` instead. `watch` now only supports `watch(source, cb, options?) signature."
  ), La(e, t, n);
}
function La(e, t, { immediate: n, deep: o, flush: r, onTrack: i, onTrigger: a } = Je) {
  var l;
  process.env.NODE_ENV !== "production" && !t && (n !== void 0 && le(
    'watch() "immediate" option is only respected when using the watch(source, callback, options?) signature.'
  ), o !== void 0 && le(
    'watch() "deep" option is only respected when using the watch(source, callback, options?) signature.'
  ));
  const c = (C) => {
    le(
      "Invalid watch source: ",
      C,
      "A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types."
    );
  }, s = bh() === ((l = Pe) == null ? void 0 : l.scope) ? Pe : null;
  let d, u = !1, f = !1;
  if (xe(e) ? (d = () => e.value, u = br(e)) : Jt(e) ? (d = () => e, o = !0) : se(e) ? (f = !0, u = e.some((C) => Jt(C) || br(C)), d = () => e.map((C) => {
    if (xe(C))
      return C.value;
    if (Jt(C))
      return Yt(C);
    if (ge(C))
      return en(C, s, 2);
    process.env.NODE_ENV !== "production" && c(C);
  })) : ge(e) ? t ? d = () => en(e, s, 2) : d = () => {
    if (!(s && s.isUnmounted))
      return p && p(), co(
        e,
        s,
        3,
        [h]
      );
  } : (d = Ea, process.env.NODE_ENV !== "production" && c(e)), t && o) {
    const C = d;
    d = () => Yt(C());
  }
  let p, h = (C) => {
    p = S.onStop = () => {
      en(C, s, 4);
    };
  }, m = f ? new Array(e.length).fill(Uo) : Uo;
  const w = () => {
    if (S.active)
      if (t) {
        const C = S.run();
        (o || u || (f ? C.some((x, O) => rn(x, m[O])) : rn(C, m))) && (p && p(), co(t, s, 3, [
          C,
          // pass undefined as the old value when it's changed for the first time
          m === Uo ? void 0 : f && m[0] === Uo ? [] : m,
          h
        ]), m = C);
      } else
        S.run();
  };
  w.allowRecurse = !!t;
  let y;
  r === "sync" ? y = w : r === "post" ? y = () => ls(w, s && s.suspense) : (w.pre = !0, s && (w.id = s.uid), y = () => za(w));
  const S = new xu(d, y);
  return process.env.NODE_ENV !== "production" && (S.onTrack = i, S.onTrigger = a), t ? n ? w() : m = S.run() : r === "post" ? ls(
    S.run.bind(S),
    s && s.suspense
  ) : S.run(), () => {
    S.stop(), s && s.scope && oh(s.scope.effects, S);
  };
}
function vg(e, t, n) {
  const o = this.proxy, r = Ve(e) ? e.includes(".") ? bg(o, e) : () => o[e] : e.bind(o, o);
  let i;
  ge(t) ? i = t : (i = t.handler, n = t);
  const a = Pe;
  ki(this);
  const l = La(r, i.bind(o), n);
  return a ? ki(a) : ad(), l;
}
function bg(e, t) {
  const n = t.split(".");
  return () => {
    let o = e;
    for (let r = 0; r < n.length && o; r++)
      o = o[n[r]];
    return o;
  };
}
function Yt(e, t) {
  if (!_e(e) || e.__v_skip || (t = t || /* @__PURE__ */ new Set(), t.has(e)))
    return e;
  if (t.add(e), xe(e))
    Yt(e.value, t);
  else if (se(e))
    for (let n = 0; n < e.length; n++)
      Yt(e[n], t);
  else if (ih(e) || wn(e))
    e.forEach((n) => {
      Yt(n, t);
    });
  else if (sh(e))
    for (const n in e)
      Yt(e[n], t);
  return e;
}
function Dn(e, t) {
  const n = Ce;
  if (n === null)
    return process.env.NODE_ENV !== "production" && le("withDirectives can only be used inside render functions."), e;
  const o = ld(n) || n.proxy, r = e.dirs || (e.dirs = []);
  for (let i = 0; i < t.length; i++) {
    let [a, l, c, s = Je] = t[i];
    a && (ge(a) && (a = {
      mounted: a,
      updated: a
    }), a.deep && Yt(l), r.push({
      dir: a,
      instance: o,
      value: l,
      oldValue: void 0,
      arg: c,
      modifiers: s
    }));
  }
  return e;
}
const Pt = Symbol("_leaveCb"), Xo = Symbol("_enterCb");
function yg() {
  const e = {
    isMounted: !1,
    isLeaving: !1,
    isUnmounting: !1,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  return De(() => {
    e.isMounted = !0;
  }), rt(() => {
    e.isUnmounting = !0;
  }), e;
}
const Ue = [Function, Array], Ku = {
  mode: String,
  appear: Boolean,
  persisted: Boolean,
  // enter
  onBeforeEnter: Ue,
  onEnter: Ue,
  onAfterEnter: Ue,
  onEnterCancelled: Ue,
  // leave
  onBeforeLeave: Ue,
  onLeave: Ue,
  onAfterLeave: Ue,
  onLeaveCancelled: Ue,
  // appear
  onBeforeAppear: Ue,
  onAppear: Ue,
  onAfterAppear: Ue,
  onAppearCancelled: Ue
}, Sg = {
  name: "BaseTransition",
  props: Ku,
  setup(e, { slots: t }) {
    const n = cn(), o = yg();
    let r;
    return () => {
      const i = t.default && Xu(t.default(), !0);
      if (!i || !i.length)
        return;
      let a = i[0];
      if (i.length > 1) {
        let m = !1;
        for (const w of i)
          if (w.type !== Rt) {
            if (process.env.NODE_ENV !== "production" && m) {
              le(
                "<transition> can only be used on a single element or component. Use <transition-group> for lists."
              );
              break;
            }
            if (a = w, m = !0, process.env.NODE_ENV === "production")
              break;
          }
      }
      const l = J(e), { mode: c } = l;
      if (process.env.NODE_ENV !== "production" && c && c !== "in-out" && c !== "out-in" && c !== "default" && le(`invalid <transition> mode: ${c}`), o.isLeaving)
        return ui(a);
      const s = Zl(a);
      if (!s)
        return ui(a);
      const d = Ki(
        s,
        l,
        o,
        n
      );
      Ui(s, d);
      const u = n.subTree, f = u && Zl(u);
      let p = !1;
      const { getTransitionKey: h } = s.type;
      if (h) {
        const m = h();
        r === void 0 ? r = m : m !== r && (r = m, p = !0);
      }
      if (f && f.type !== Rt && (!ed(s, f) || p)) {
        const m = Ki(
          f,
          l,
          o,
          n
        );
        if (Ui(f, m), c === "out-in")
          return o.isLeaving = !0, m.afterLeave = () => {
            o.isLeaving = !1, n.update.active !== !1 && n.update();
          }, ui(a);
        c === "in-out" && s.type !== Rt && (m.delayLeave = (w, y, S) => {
          const _ = Uu(
            o,
            f
          );
          _[String(f.key)] = f, w[Pt] = () => {
            y(), w[Pt] = void 0, delete d.delayedLeave;
          }, d.delayedLeave = S;
        });
      }
      return a;
    };
  }
}, wg = Sg;
function Uu(e, t) {
  const { leavingVNodes: n } = e;
  let o = n.get(t.type);
  return o || (o = /* @__PURE__ */ Object.create(null), n.set(t.type, o)), o;
}
function Ki(e, t, n, o) {
  const {
    appear: r,
    mode: i,
    persisted: a = !1,
    onBeforeEnter: l,
    onEnter: c,
    onAfterEnter: s,
    onEnterCancelled: d,
    onBeforeLeave: u,
    onLeave: f,
    onAfterLeave: p,
    onLeaveCancelled: h,
    onBeforeAppear: m,
    onAppear: w,
    onAfterAppear: y,
    onAppearCancelled: S
  } = t, _ = String(e.key), C = Uu(n, e), x = ($, T) => {
    $ && co(
      $,
      o,
      9,
      T
    );
  }, O = ($, T) => {
    const R = T[1];
    x($, T), se($) ? $.every((H) => H.length <= 1) && R() : $.length <= 1 && R();
  }, b = {
    mode: i,
    persisted: a,
    beforeEnter($) {
      let T = l;
      if (!n.isMounted)
        if (r)
          T = m || l;
        else
          return;
      $[Pt] && $[Pt](
        !0
        /* cancelled */
      );
      const R = C[_];
      R && ed(e, R) && R.el[Pt] && R.el[Pt](), x(T, [$]);
    },
    enter($) {
      let T = c, R = s, H = d;
      if (!n.isMounted)
        if (r)
          T = w || c, R = y || s, H = S || d;
        else
          return;
      let N = !1;
      const j = $[Xo] = (B) => {
        N || (N = !0, B ? x(H, [$]) : x(R, [$]), b.delayedLeave && b.delayedLeave(), $[Xo] = void 0);
      };
      T ? O(T, [$, j]) : j();
    },
    leave($, T) {
      const R = String(e.key);
      if ($[Xo] && $[Xo](
        !0
        /* cancelled */
      ), n.isUnmounting)
        return T();
      x(u, [$]);
      let H = !1;
      const N = $[Pt] = (j) => {
        H || (H = !0, T(), j ? x(h, [$]) : x(p, [$]), $[Pt] = void 0, C[R] === e && delete C[R]);
      };
      C[R] = e, f ? O(f, [$, N]) : N();
    },
    clone($) {
      return Ki($, t, n, o);
    }
  };
  return b;
}
function ui(e) {
  if (Gu(e))
    return e = ot(e), e.children = null, e;
}
function Zl(e) {
  return Gu(e) ? e.children ? e.children[0] : void 0 : e;
}
function Ui(e, t) {
  e.shapeFlag & 6 && e.component ? Ui(e.component.subTree, t) : e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
function Xu(e, t = !1, n) {
  let o = [], r = 0;
  for (let i = 0; i < e.length; i++) {
    let a = e[i];
    const l = n == null ? a.key : String(n) + String(a.key != null ? a.key : i);
    a.type === Me ? (a.patchFlag & 128 && r++, o = o.concat(
      Xu(a.children, t, l)
    )) : (t || a.type !== Rt) && o.push(l != null ? ot(a, { key: l }) : a);
  }
  if (r > 1)
    for (let i = 0; i < o.length; i++)
      o[i].patchFlag = -2;
  return o;
}
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function Z(e, t) {
  return ge(e) ? (
    // #8326: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    /* @__PURE__ */ (() => Le({ name: e.name }, t, { setup: e }))()
  ) : e;
}
const Cg = (e) => !!e.type.__asyncLoader, Gu = (e) => e.type.__isKeepAlive;
function xg(e, t, n = Pe, o = !1) {
  if (n) {
    const r = n[e] || (n[e] = []), i = t.__weh || (t.__weh = (...a) => {
      if (n.isUnmounted)
        return;
      Ia(), ki(n);
      const l = co(t, n, e, a);
      return ad(), Ma(), l;
    });
    return o ? r.unshift(i) : r.push(i), i;
  } else if (process.env.NODE_ENV !== "production") {
    const r = uh(Ha[e].replace(/ hook$/, ""));
    le(
      `${r} is called when there is no active component instance to be associated with. Lifecycle injection APIs can only be used during execution of setup(). If you are using async setup(), make sure to register lifecycle hooks before the first await statement.`
    );
  }
}
const _o = (e) => (t, n = Pe) => (
  // post-create lifecycle registrations are noops during SSR (except for serverPrefetch)
  xg(e, (...o) => t(...o), n)
), Og = _o("bm"), De = _o("m"), Eo = _o("u"), rt = _o("bum"), To = _o("um"), es = "components", $g = "directives", _g = Symbol.for("v-ndc");
function ku(e) {
  return Eg($g, e);
}
function Eg(e, t, n = !0, o = !1) {
  const r = Ce || Pe;
  if (r) {
    const i = r.type;
    if (e === es) {
      const l = Ua(
        i,
        !1
        /* do not include inferred name to avoid breaking existing code */
      );
      if (l && (l === t || l === mr(t) || l === ao(mr(t))))
        return i;
    }
    const a = (
      // local registration
      // check instance[type] first which is resolved for options API
      ts(r[e] || i[e], t) || // global registration
      ts(r.appContext[e], t)
    );
    if (!a && o)
      return i;
    if (process.env.NODE_ENV !== "production" && n && !a) {
      const l = e === es ? `
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.` : "";
      le(`Failed to resolve ${e.slice(0, -1)}: ${t}${l}`);
    }
    return a;
  } else
    process.env.NODE_ENV !== "production" && le(
      `resolve${ao(e.slice(0, -1))} can only be used in render() or setup().`
    );
}
function ts(e, t) {
  return e && (e[t] || e[mr(t)] || e[ao(mr(t))]);
}
function Tg(e, t) {
  for (let n = 0; n < t.length; n++) {
    const o = t[n];
    if (se(o))
      for (let r = 0; r < o.length; r++)
        e[o[r].name] = o[r].fn;
    else
      o && (e[o.name] = o.key ? (...r) => {
        const i = o.fn(...r);
        return i && (i.key = o.key), i;
      } : o.fn);
  }
  return e;
}
function Pg(e, t, n = {}, o, r) {
  if (Ce.isCE || Ce.parent && Cg(Ce.parent) && Ce.parent.isCE)
    return t !== "default" && (n.name = t), v("slot", n, o && o());
  let i = e[t];
  process.env.NODE_ENV !== "production" && i && i.length > 1 && (le(
    "SSR-optimized slot function detected in a non-SSR-optimized render function. You need to mark this component with $dynamic-slots in the parent template."
  ), i = () => []), i && i._c && (i._d = !1), Ba();
  const a = i && Yu(i(n)), l = Bg(
    Me,
    {
      key: n.key || // slot content array of a dynamic conditional slot may have a branch
      // key attached in the `createSlots` helper, respect that
      a && a.key || `_${t}`
    },
    a || (o ? o() : []),
    a && e._ === 1 ? 64 : -2
  );
  return !r && l.scopeId && (l.slotScopeIds = [l.scopeId + "-s"]), i && i._c && (i._d = !0), l;
}
function Yu(e) {
  return e.some((t) => ft(t) ? !(t.type === Rt || t.type === Me && !Yu(t.children)) : !0) ? e : null;
}
const Xi = (e) => e ? Ug(e) ? ld(e) || e.proxy : Xi(e.parent) : null, to = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ Le(/* @__PURE__ */ Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => process.env.NODE_ENV !== "production" ? Ko(e.props) : e.props,
    $attrs: (e) => process.env.NODE_ENV !== "production" ? Ko(e.attrs) : e.attrs,
    $slots: (e) => process.env.NODE_ENV !== "production" ? Ko(e.slots) : e.slots,
    $refs: (e) => process.env.NODE_ENV !== "production" ? Ko(e.refs) : e.refs,
    $parent: (e) => Xi(e.parent),
    $root: (e) => Xi(e.root),
    $emit: (e) => e.emit,
    $options: (e) => Ng(e),
    $forceUpdate: (e) => e.f || (e.f = () => za(e.update)),
    $nextTick: (e) => e.n || (e.n = ke.bind(e.proxy)),
    $watch: (e) => vg.bind(e)
  })
), Ig = (e) => e === "_" || e === "$", di = (e, t) => e !== Je && !e.__isScriptSetup && ve(e, t), Mg = {
  get({ _: e }, t) {
    const { ctx: n, setupState: o, data: r, props: i, accessCache: a, type: l, appContext: c } = e;
    if (process.env.NODE_ENV !== "production" && t === "__isVue")
      return !0;
    let s;
    if (t[0] !== "$") {
      const p = a[t];
      if (p !== void 0)
        switch (p) {
          case 1:
            return o[t];
          case 2:
            return r[t];
          case 4:
            return n[t];
          case 3:
            return i[t];
        }
      else {
        if (di(o, t))
          return a[t] = 1, o[t];
        if (r !== Je && ve(r, t))
          return a[t] = 2, r[t];
        if (
          // only cache other properties when instance has declared (thus stable)
          // props
          (s = e.propsOptions[0]) && ve(s, t)
        )
          return a[t] = 3, i[t];
        if (n !== Je && ve(n, t))
          return a[t] = 4, n[t];
        a[t] = 0;
      }
    }
    const d = to[t];
    let u, f;
    if (d)
      return t === "$attrs" ? (ze(e, "get", t), process.env.NODE_ENV !== "production" && void 0) : process.env.NODE_ENV !== "production" && t === "$slots" && ze(e, "get", t), d(e);
    if (
      // css module (injected by vue-loader)
      (u = l.__cssModules) && (u = u[t])
    )
      return u;
    if (n !== Je && ve(n, t))
      return a[t] = 4, n[t];
    if (
      // global properties
      f = c.config.globalProperties, ve(f, t)
    )
      return f[t];
    process.env.NODE_ENV !== "production" && Ce && (!Ve(t) || // #1091 avoid internal isRef/isVNode checks on component instance leading
    // to infinite warning loop
    t.indexOf("__v") !== 0) && (r !== Je && Ig(t[0]) && ve(r, t) ? le(
      `Property ${JSON.stringify(
        t
      )} must be accessed via $data because it starts with a reserved character ("$" or "_") and is not proxied on the render context.`
    ) : e === Ce && le(
      `Property ${JSON.stringify(t)} was accessed during render but is not defined on instance.`
    ));
  },
  set({ _: e }, t, n) {
    const { data: o, setupState: r, ctx: i } = e;
    return di(r, t) ? (r[t] = n, !0) : process.env.NODE_ENV !== "production" && r.__isScriptSetup && ve(r, t) ? (le(`Cannot mutate <script setup> binding "${t}" from Options API.`), !1) : o !== Je && ve(o, t) ? (o[t] = n, !0) : ve(e.props, t) ? (process.env.NODE_ENV !== "production" && le(`Attempting to mutate prop "${t}". Props are readonly.`), !1) : t[0] === "$" && t.slice(1) in e ? (process.env.NODE_ENV !== "production" && le(
      `Attempting to mutate public property "${t}". Properties starting with $ are reserved and readonly.`
    ), !1) : (process.env.NODE_ENV !== "production" && t in e.appContext.config.globalProperties ? Object.defineProperty(i, t, {
      enumerable: !0,
      configurable: !0,
      value: n
    }) : i[t] = n, !0);
  },
  has({
    _: { data: e, setupState: t, accessCache: n, ctx: o, appContext: r, propsOptions: i }
  }, a) {
    let l;
    return !!n[a] || e !== Je && ve(e, a) || di(t, a) || (l = i[0]) && ve(l, a) || ve(o, a) || ve(to, a) || ve(r.config.globalProperties, a);
  },
  defineProperty(e, t, n) {
    return n.get != null ? e._.accessCache[t] = 0 : ve(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n);
  }
};
process.env.NODE_ENV !== "production" && (Mg.ownKeys = (e) => (le(
  "Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead."
), Reflect.ownKeys(e)));
function ns(e) {
  return se(e) ? e.reduce(
    (t, n) => (t[n] = null, t),
    {}
  ) : e;
}
function Ng(e) {
  const t = e.type, { mixins: n, extends: o } = t, {
    mixins: r,
    optionsCache: i,
    config: { optionMergeStrategies: a }
  } = e.appContext, l = i.get(t);
  let c;
  return l ? c = l : !r.length && !n && !o ? c = t : (c = {}, r.length && r.forEach(
    (s) => Cr(c, s, a, !0)
  ), Cr(c, t, a)), _e(t) && i.set(t, c), c;
}
function Cr(e, t, n, o = !1) {
  const { mixins: r, extends: i } = t;
  i && Cr(e, i, n, !0), r && r.forEach(
    (a) => Cr(e, a, n, !0)
  );
  for (const a in t)
    if (o && a === "expose")
      process.env.NODE_ENV !== "production" && le(
        '"expose" option is ignored when declared in mixins or extends. It should only be declared in the base component itself.'
      );
    else {
      const l = Ag[a] || n && n[a];
      e[a] = l ? l(e[a], t[a]) : t[a];
    }
  return e;
}
const Ag = {
  data: os,
  props: is,
  emits: is,
  // objects
  methods: Yn,
  computed: Yn,
  // lifecycle
  beforeCreate: Ne,
  created: Ne,
  beforeMount: Ne,
  mounted: Ne,
  beforeUpdate: Ne,
  updated: Ne,
  beforeDestroy: Ne,
  beforeUnmount: Ne,
  destroyed: Ne,
  unmounted: Ne,
  activated: Ne,
  deactivated: Ne,
  errorCaptured: Ne,
  serverPrefetch: Ne,
  // assets
  components: Yn,
  directives: Yn,
  // watch
  watch: Rg,
  // provide / inject
  provide: os,
  inject: Dg
};
function os(e, t) {
  return t ? e ? function() {
    return Le(
      ge(e) ? e.call(this, this) : e,
      ge(t) ? t.call(this, this) : t
    );
  } : t : e;
}
function Dg(e, t) {
  return Yn(rs(e), rs(t));
}
function rs(e) {
  if (se(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++)
      t[e[n]] = e[n];
    return t;
  }
  return e;
}
function Ne(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function Yn(e, t) {
  return e ? Le(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function is(e, t) {
  return e ? se(e) && se(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : Le(
    /* @__PURE__ */ Object.create(null),
    ns(e),
    ns(t ?? {})
  ) : t;
}
function Rg(e, t) {
  if (!e)
    return t;
  if (!t)
    return e;
  const n = Le(/* @__PURE__ */ Object.create(null), e);
  for (const o in t)
    n[o] = Ne(e[o], t[o]);
  return n;
}
let as = null;
function dt(e, t) {
  if (!Pe)
    process.env.NODE_ENV !== "production" && le("provide() can only be used inside setup().");
  else {
    let n = Pe.provides;
    const o = Pe.parent && Pe.parent.provides;
    o === n && (n = Pe.provides = Object.create(o)), n[e] = t;
  }
}
function ye(e, t, n = !1) {
  const o = Pe || Ce;
  if (o || as) {
    const r = o ? o.parent == null ? o.vnode.appContext && o.vnode.appContext.provides : o.parent.provides : as._context.provides;
    if (r && e in r)
      return r[e];
    if (arguments.length > 1)
      return n && ge(t) ? t.call(o && o.proxy) : t;
    process.env.NODE_ENV !== "production" && le(`injection "${String(e)}" not found.`);
  } else
    process.env.NODE_ENV !== "production" && le("inject() can only be used inside setup() or functional components.");
}
const ls = mg;
function qu(e, t, n = !1) {
  const o = e.children, r = t.children;
  if (se(o) && se(r))
    for (let i = 0; i < o.length; i++) {
      const a = o[i];
      let l = r[i];
      l.shapeFlag & 1 && !l.dynamicChildren && ((l.patchFlag <= 0 || l.patchFlag === 32) && (l = r[i] = Kg(r[i]), l.el = a.el), n || qu(a, l)), l.type === ja && (l.el = a.el), process.env.NODE_ENV !== "production" && l.type === Rt && !l.el && (l.el = a.el);
    }
}
const Hg = (e) => e.__isTeleport, xn = (e) => e && (e.disabled || e.disabled === ""), ss = (e) => typeof SVGElement < "u" && e instanceof SVGElement, Gi = (e, t) => {
  const n = e && e.to;
  if (Ve(n))
    if (t) {
      const o = t(n);
      return o || process.env.NODE_ENV !== "production" && le(
        `Failed to locate Teleport target with selector "${n}". Note the target element must exist before the component is mounted - i.e. the target cannot be rendered by the component itself, and ideally should be outside of the entire Vue component tree.`
      ), o;
    } else
      return process.env.NODE_ENV !== "production" && le(
        "Current renderer does not support string target for Teleports. (missing querySelector renderer option)"
      ), null;
  else
    return process.env.NODE_ENV !== "production" && !n && !xn(e) && le(`Invalid Teleport target: ${n}`), n;
}, Fg = {
  __isTeleport: !0,
  process(e, t, n, o, r, i, a, l, c, s) {
    const {
      mc: d,
      pc: u,
      pbc: f,
      o: { insert: p, querySelector: h, createText: m, createComment: w }
    } = s, y = xn(t.props);
    let { shapeFlag: S, children: _, dynamicChildren: C } = t;
    if (process.env.NODE_ENV !== "production" && Wi && (c = !1, C = null), e == null) {
      const x = t.el = process.env.NODE_ENV !== "production" ? w("teleport start") : m(""), O = t.anchor = process.env.NODE_ENV !== "production" ? w("teleport end") : m("");
      p(x, n, o), p(O, n, o);
      const b = t.target = Gi(t.props, h), $ = t.targetAnchor = m("");
      b ? (p($, b), a = a || ss(b)) : process.env.NODE_ENV !== "production" && !y && le("Invalid Teleport target on mount:", b, `(${typeof b})`);
      const T = (R, H) => {
        S & 16 && d(
          _,
          R,
          H,
          r,
          i,
          a,
          l,
          c
        );
      };
      y ? T(n, O) : b && T(b, $);
    } else {
      t.el = e.el;
      const x = t.anchor = e.anchor, O = t.target = e.target, b = t.targetAnchor = e.targetAnchor, $ = xn(e.props), T = $ ? n : O, R = $ ? x : b;
      if (a = a || ss(O), C ? (f(
        e.dynamicChildren,
        C,
        T,
        r,
        i,
        a,
        l
      ), qu(e, t, !0)) : c || u(
        e,
        t,
        T,
        R,
        r,
        i,
        a,
        l,
        !1
      ), y)
        $ ? t.props && e.props && t.props.to !== e.props.to && (t.props.to = e.props.to) : Go(
          t,
          n,
          x,
          s,
          1
        );
      else if ((t.props && t.props.to) !== (e.props && e.props.to)) {
        const H = t.target = Gi(
          t.props,
          h
        );
        H ? Go(
          t,
          H,
          null,
          s,
          0
        ) : process.env.NODE_ENV !== "production" && le(
          "Invalid Teleport target on update:",
          O,
          `(${typeof O})`
        );
      } else
        $ && Go(
          t,
          O,
          b,
          s,
          1
        );
    }
    Qu(t);
  },
  remove(e, t, n, o, { um: r, o: { remove: i } }, a) {
    const { shapeFlag: l, children: c, anchor: s, targetAnchor: d, target: u, props: f } = e;
    if (u && i(d), a && i(s), l & 16) {
      const p = a || !xn(f);
      for (let h = 0; h < c.length; h++) {
        const m = c[h];
        r(
          m,
          t,
          n,
          p,
          !!m.dynamicChildren
        );
      }
    }
  },
  move: Go,
  hydrate: zg
};
function Go(e, t, n, { o: { insert: o }, m: r }, i = 2) {
  i === 0 && o(e.targetAnchor, t, n);
  const { el: a, anchor: l, shapeFlag: c, children: s, props: d } = e, u = i === 2;
  if (u && o(a, t, n), (!u || xn(d)) && c & 16)
    for (let f = 0; f < s.length; f++)
      r(
        s[f],
        t,
        n,
        2
      );
  u && o(l, t, n);
}
function zg(e, t, n, o, r, i, {
  o: { nextSibling: a, parentNode: l, querySelector: c }
}, s) {
  const d = t.target = Gi(
    t.props,
    c
  );
  if (d) {
    const u = d._lpa || d.firstChild;
    if (t.shapeFlag & 16)
      if (xn(t.props))
        t.anchor = s(
          a(e),
          t,
          l(e),
          n,
          o,
          r,
          i
        ), t.targetAnchor = u;
      else {
        t.anchor = a(e);
        let f = u;
        for (; f; )
          if (f = a(f), f && f.nodeType === 8 && f.data === "teleport anchor") {
            t.targetAnchor = f, d._lpa = t.targetAnchor && a(t.targetAnchor);
            break;
          }
        s(
          u,
          t,
          d,
          n,
          o,
          r,
          i
        );
      }
    Qu(t);
  }
  return t.anchor && a(t.anchor);
}
const Lg = Fg;
function Qu(e) {
  const t = e.ctx;
  if (t && t.ut) {
    let n = e.children[0].el;
    for (; n && n !== e.targetAnchor; )
      n.nodeType === 1 && n.setAttribute("data-v-owner", t.uid), n = n.nextSibling;
    t.ut();
  }
}
const Me = Symbol.for("v-fgt"), ja = Symbol.for("v-txt"), Rt = Symbol.for("v-cmt"), ir = [];
let et = null;
function Ba(e = !1) {
  ir.push(et = e ? null : []);
}
function jg() {
  ir.pop(), et = ir[ir.length - 1] || null;
}
let fo = 1;
function cs(e) {
  fo += e;
}
function Ju(e) {
  return e.dynamicChildren = fo > 0 ? et || eh : null, jg(), fo > 0 && et && et.push(e), e;
}
function Zu(e, t, n, o, r, i) {
  return Ju(
    Va(
      e,
      t,
      n,
      o,
      r,
      i,
      !0
      /* isBlock */
    )
  );
}
function Bg(e, t, n, o, r) {
  return Ju(
    v(
      e,
      t,
      n,
      o,
      r,
      !0
      /* isBlock: prevent a block from tracking itself */
    )
  );
}
function ft(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function ed(e, t) {
  return process.env.NODE_ENV !== "production" && t.shapeFlag & 6 && mn.has(t.type) ? (e.shapeFlag &= -257, t.shapeFlag &= -513, !1) : e.type === t.type && e.key === t.key;
}
const Vg = (...e) => od(
  ...e
), td = "__vInternal", nd = ({ key: e }) => e ?? null, ar = ({
  ref: e,
  ref_key: t,
  ref_for: n
}) => (typeof e == "number" && (e = "" + e), e != null ? Ve(e) || xe(e) || ge(e) ? { i: Ce, r: e, k: t, f: !!n } : e : null);
function Va(e, t = null, n = null, o = 0, r = null, i = e === Me ? 0 : 1, a = !1, l = !1) {
  const c = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && nd(t),
    ref: t && ar(t),
    scopeId: Vr,
    slotScopeIds: null,
    children: n,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: i,
    patchFlag: o,
    dynamicProps: r,
    dynamicChildren: null,
    appContext: null,
    ctx: Ce
  };
  return l ? (Wa(c, n), i & 128 && e.normalize(c)) : n && (c.shapeFlag |= Ve(n) ? 8 : 16), process.env.NODE_ENV !== "production" && c.key !== c.key && le("VNode created with invalid key (NaN). VNode type:", c.type), fo > 0 && // avoid a block node from tracking itself
  !a && // has current parent block
  et && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (c.patchFlag > 0 || i & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  c.patchFlag !== 32 && et.push(c), c;
}
const v = process.env.NODE_ENV !== "production" ? Vg : od;
function od(e, t = null, n = null, o = 0, r = null, i = !1) {
  if ((!e || e === _g) && (process.env.NODE_ENV !== "production" && !e && le(`Invalid vnode type when creating vnode: ${e}.`), e = Rt), ft(e)) {
    const l = ot(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return n && Wa(l, n), fo > 0 && !i && et && (l.shapeFlag & 6 ? et[et.indexOf(e)] = l : et.push(l)), l.patchFlag |= -2, l;
  }
  if (cd(e) && (e = e.__vccOpts), t) {
    t = Wg(t);
    let { class: l, style: c } = t;
    l && !Ve(l) && (t.class = $o(l)), _e(c) && (yr(c) && !se(c) && (c = Le({}, c)), t.style = jr(c));
  }
  const a = Ve(e) ? 1 : gg(e) ? 128 : Hg(e) ? 64 : _e(e) ? 4 : ge(e) ? 2 : 0;
  return process.env.NODE_ENV !== "production" && a & 4 && yr(e) && (e = J(e), le(
    "Vue received a Component which was made a reactive object. This can lead to unnecessary performance overhead, and should be avoided by marking the component with `markRaw` or using `shallowRef` instead of `ref`.",
    `
Component that was made reactive: `,
    e
  )), Va(
    e,
    t,
    n,
    o,
    r,
    a,
    i,
    !0
  );
}
function Wg(e) {
  return e ? yr(e) || td in e ? Le({}, e) : e : null;
}
function ot(e, t, n = !1) {
  const { props: o, ref: r, patchFlag: i, children: a } = e, l = t ? id(o || {}, t) : o;
  return {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: l,
    key: l && nd(l),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && r ? se(r) ? r.concat(ar(t)) : [r, ar(t)] : ar(t)
    ) : r,
    scopeId: e.scopeId,
    slotScopeIds: e.slotScopeIds,
    children: process.env.NODE_ENV !== "production" && i === -1 && se(a) ? a.map(rd) : a,
    target: e.target,
    targetAnchor: e.targetAnchor,
    staticCount: e.staticCount,
    shapeFlag: e.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: t && e.type !== Me ? i === -1 ? 16 : i | 16 : i,
    dynamicProps: e.dynamicProps,
    dynamicChildren: e.dynamicChildren,
    appContext: e.appContext,
    dirs: e.dirs,
    transition: e.transition,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: e.component,
    suspense: e.suspense,
    ssContent: e.ssContent && ot(e.ssContent),
    ssFallback: e.ssFallback && ot(e.ssFallback),
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce
  };
}
function rd(e) {
  const t = ot(e);
  return se(e.children) && (t.children = e.children.map(rd)), t;
}
function _n(e = " ", t = 0) {
  return v(ja, null, e, t);
}
function Kg(e) {
  return e.el === null && e.patchFlag !== -1 || e.memo ? e : ot(e);
}
function Wa(e, t) {
  let n = 0;
  const { shapeFlag: o } = e;
  if (t == null)
    t = null;
  else if (se(t))
    n = 16;
  else if (typeof t == "object")
    if (o & 65) {
      const r = t.default;
      r && (r._c && (r._d = !1), Wa(e, r()), r._c && (r._d = !0));
      return;
    } else {
      n = 32;
      const r = t._;
      !r && !(td in t) ? t._ctx = Ce : r === 3 && Ce && (Ce.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else
    ge(t) ? (t = { default: t, _ctx: Ce }, n = 32) : (t = String(t), o & 64 ? (n = 16, t = [_n(t)]) : n = 8);
  e.children = t, e.shapeFlag |= n;
}
function id(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const o = e[n];
    for (const r in o)
      if (r === "class")
        t.class !== o.class && (t.class = $o([t.class, o.class]));
      else if (r === "style")
        t.style = jr([t.style, o.style]);
      else if (nh(r)) {
        const i = t[r], a = o[r];
        a && i !== a && !(se(i) && i.includes(a)) && (t[r] = i ? [].concat(i, a) : a);
      } else
        r !== "" && (t[r] = o[r]);
  }
  return t;
}
let Pe = null;
const cn = () => Pe || Ce;
let Ka, pn, us = "__VUE_INSTANCE_SETTERS__";
(pn = Fi()[us]) || (pn = Fi()[us] = []), pn.push((e) => Pe = e), Ka = (e) => {
  pn.length > 1 ? pn.forEach((t) => t(e)) : pn[0](e);
};
const ki = (e) => {
  Ka(e), e.scope.on();
}, ad = () => {
  Pe && Pe.scope.off(), Ka(null);
};
function Ug(e) {
  return e.vnode.shapeFlag & 4;
}
let Xg = !1;
function ld(e) {
  if (e.exposed)
    return e.exposeProxy || (e.exposeProxy = new Proxy(Wh(jh(e.exposed)), {
      get(t, n) {
        if (n in t)
          return t[n];
        if (n in to)
          return to[n](e);
      },
      has(t, n) {
        return n in t || n in to;
      }
    }));
}
const Gg = /(?:^|[-_])(\w)/g, kg = (e) => e.replace(Gg, (t) => t.toUpperCase()).replace(/[-_]/g, "");
function Ua(e, t = !0) {
  return ge(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function sd(e, t, n = !1) {
  let o = Ua(t);
  if (!o && t.__file) {
    const r = t.__file.match(/([^/\\]+)\.\w+$/);
    r && (o = r[1]);
  }
  if (!o && e && e.parent) {
    const r = (i) => {
      for (const a in i)
        if (i[a] === t)
          return a;
    };
    o = r(
      e.components || e.parent.type.components
    ) || r(e.appContext.components);
  }
  return o ? kg(o) : n ? "App" : "Anonymous";
}
function cd(e) {
  return ge(e) && "__vccOpts" in e;
}
const E = (e, t) => Bi(e, t, Xg);
function wt(e, t, n) {
  const o = arguments.length;
  return o === 2 ? _e(t) && !se(t) ? ft(t) ? v(e, null, [t]) : v(e, t) : v(e, null, t) : (o > 3 ? n = Array.prototype.slice.call(arguments, 2) : o === 3 && ft(n) && (n = [n]), v(e, t, n));
}
function fi(e) {
  return !!(e && e.__v_isShallow);
}
function Yg() {
  if (process.env.NODE_ENV === "production" || typeof window > "u")
    return;
  const e = { style: "color:#3ba776" }, t = { style: "color:#0b1bc9" }, n = { style: "color:#b62e24" }, o = { style: "color:#9d288c" }, r = {
    header(u) {
      return _e(u) ? u.__isVue ? ["div", e, "VueInstance"] : xe(u) ? [
        "div",
        {},
        ["span", e, d(u)],
        "<",
        l(u.value),
        ">"
      ] : Jt(u) ? [
        "div",
        {},
        ["span", e, fi(u) ? "ShallowReactive" : "Reactive"],
        "<",
        l(u),
        `>${zt(u) ? " (readonly)" : ""}`
      ] : zt(u) ? [
        "div",
        {},
        ["span", e, fi(u) ? "ShallowReadonly" : "Readonly"],
        "<",
        l(u),
        ">"
      ] : null : null;
    },
    hasBody(u) {
      return u && u.__isVue;
    },
    body(u) {
      if (u && u.__isVue)
        return [
          "div",
          {},
          ...i(u.$)
        ];
    }
  };
  function i(u) {
    const f = [];
    u.type.props && u.props && f.push(a("props", J(u.props))), u.setupState !== Je && f.push(a("setup", u.setupState)), u.data !== Je && f.push(a("data", J(u.data)));
    const p = c(u, "computed");
    p && f.push(a("computed", p));
    const h = c(u, "inject");
    return h && f.push(a("injected", h)), f.push([
      "div",
      {},
      [
        "span",
        {
          style: o.style + ";opacity:0.66"
        },
        "$ (internal): "
      ],
      ["object", { object: u }]
    ]), f;
  }
  function a(u, f) {
    return f = Le({}, f), Object.keys(f).length ? [
      "div",
      { style: "line-height:1.25em;margin-bottom:0.6em" },
      [
        "div",
        {
          style: "color:#476582"
        },
        u
      ],
      [
        "div",
        {
          style: "padding-left:1.25em"
        },
        ...Object.keys(f).map((p) => [
          "div",
          {},
          ["span", o, p + ": "],
          l(f[p], !1)
        ])
      ]
    ] : ["span", {}];
  }
  function l(u, f = !0) {
    return typeof u == "number" ? ["span", t, u] : typeof u == "string" ? ["span", n, JSON.stringify(u)] : typeof u == "boolean" ? ["span", o, u] : _e(u) ? ["object", { object: f ? J(u) : u }] : ["span", n, String(u)];
  }
  function c(u, f) {
    const p = u.type;
    if (ge(p))
      return;
    const h = {};
    for (const m in u.ctx)
      s(p, m, f) && (h[m] = u.ctx[m]);
    return h;
  }
  function s(u, f, p) {
    const h = u[p];
    if (se(h) && h.includes(f) || _e(h) && f in h || u.extends && s(u.extends, f, p) || u.mixins && u.mixins.some((m) => s(m, f, p)))
      return !0;
  }
  function d(u) {
    return fi(u) ? "ShallowRef" : u.effect ? "ComputedRef" : "Ref";
  }
  window.devtoolsFormatters ? window.devtoolsFormatters.push(r) : window.devtoolsFormatters = [r];
}
const $t = "transition", Vn = "animation", xr = Symbol("_vtc"), Po = (e, { slots: t }) => wt(wg, qg(e), t);
Po.displayName = "Transition";
const ud = {
  name: String,
  type: String,
  css: {
    type: Boolean,
    default: !0
  },
  duration: [String, Number, Object],
  enterFromClass: String,
  enterActiveClass: String,
  enterToClass: String,
  appearFromClass: String,
  appearActiveClass: String,
  appearToClass: String,
  leaveFromClass: String,
  leaveActiveClass: String,
  leaveToClass: String
};
Po.props = /* @__PURE__ */ Le(
  {},
  Ku,
  ud
);
const jt = (e, t = []) => {
  se(e) ? e.forEach((n) => n(...t)) : e && e(...t);
}, ds = (e) => e ? se(e) ? e.some((t) => t.length > 1) : e.length > 1 : !1;
function qg(e) {
  const t = {};
  for (const N in e)
    N in ud || (t[N] = e[N]);
  if (e.css === !1)
    return t;
  const {
    name: n = "v",
    type: o,
    duration: r,
    enterFromClass: i = `${n}-enter-from`,
    enterActiveClass: a = `${n}-enter-active`,
    enterToClass: l = `${n}-enter-to`,
    appearFromClass: c = i,
    appearActiveClass: s = a,
    appearToClass: d = l,
    leaveFromClass: u = `${n}-leave-from`,
    leaveActiveClass: f = `${n}-leave-active`,
    leaveToClass: p = `${n}-leave-to`
  } = e, h = Qg(r), m = h && h[0], w = h && h[1], {
    onBeforeEnter: y,
    onEnter: S,
    onEnterCancelled: _,
    onLeave: C,
    onLeaveCancelled: x,
    onBeforeAppear: O = y,
    onAppear: b = S,
    onAppearCancelled: $ = _
  } = t, T = (N, j, B) => {
    Bt(N, j ? d : l), Bt(N, j ? s : a), B && B();
  }, R = (N, j) => {
    N._isLeaving = !1, Bt(N, u), Bt(N, p), Bt(N, f), j && j();
  }, H = (N) => (j, B) => {
    const F = N ? b : S, L = () => T(j, N, B);
    jt(F, [j, L]), fs(() => {
      Bt(j, N ? c : i), _t(j, N ? d : l), ds(F) || ps(j, o, m, L);
    });
  };
  return Le(t, {
    onBeforeEnter(N) {
      jt(y, [N]), _t(N, i), _t(N, a);
    },
    onBeforeAppear(N) {
      jt(O, [N]), _t(N, c), _t(N, s);
    },
    onEnter: H(!1),
    onAppear: H(!0),
    onLeave(N, j) {
      N._isLeaving = !0;
      const B = () => R(N, j);
      _t(N, u), em(), _t(N, f), fs(() => {
        N._isLeaving && (Bt(N, u), _t(N, p), ds(C) || ps(N, o, w, B));
      }), jt(C, [N, B]);
    },
    onEnterCancelled(N) {
      T(N, !1), jt(_, [N]);
    },
    onAppearCancelled(N) {
      T(N, !0), jt($, [N]);
    },
    onLeaveCancelled(N) {
      R(N), jt(x, [N]);
    }
  });
}
function Qg(e) {
  if (e == null)
    return null;
  if (_e(e))
    return [pi(e.enter), pi(e.leave)];
  {
    const t = pi(e);
    return [t, t];
  }
}
function pi(e) {
  const t = fh(e);
  return process.env.NODE_ENV !== "production" && eg(t, "<transition> explicit duration"), t;
}
function _t(e, t) {
  t.split(/\s+/).forEach((n) => n && e.classList.add(n)), (e[xr] || (e[xr] = /* @__PURE__ */ new Set())).add(t);
}
function Bt(e, t) {
  t.split(/\s+/).forEach((o) => o && e.classList.remove(o));
  const n = e[xr];
  n && (n.delete(t), n.size || (e[xr] = void 0));
}
function fs(e) {
  requestAnimationFrame(() => {
    requestAnimationFrame(e);
  });
}
let Jg = 0;
function ps(e, t, n, o) {
  const r = e._endId = ++Jg, i = () => {
    r === e._endId && o();
  };
  if (n)
    return setTimeout(i, n);
  const { type: a, timeout: l, propCount: c } = Zg(e, t);
  if (!a)
    return o();
  const s = a + "end";
  let d = 0;
  const u = () => {
    e.removeEventListener(s, f), i();
  }, f = (p) => {
    p.target === e && ++d >= c && u();
  };
  setTimeout(() => {
    d < c && u();
  }, l + 1), e.addEventListener(s, f);
}
function Zg(e, t) {
  const n = window.getComputedStyle(e), o = (h) => (n[h] || "").split(", "), r = o(`${$t}Delay`), i = o(`${$t}Duration`), a = hs(r, i), l = o(`${Vn}Delay`), c = o(`${Vn}Duration`), s = hs(l, c);
  let d = null, u = 0, f = 0;
  t === $t ? a > 0 && (d = $t, u = a, f = i.length) : t === Vn ? s > 0 && (d = Vn, u = s, f = c.length) : (u = Math.max(a, s), d = u > 0 ? a > s ? $t : Vn : null, f = d ? d === $t ? i.length : c.length : 0);
  const p = d === $t && /\b(transform|all)(,|$)/.test(
    o(`${$t}Property`).toString()
  );
  return {
    type: d,
    timeout: u,
    propCount: f,
    hasTransform: p
  };
}
function hs(e, t) {
  for (; e.length < t.length; )
    e = e.concat(e);
  return Math.max(...t.map((n, o) => gs(n) + gs(e[o])));
}
function gs(e) {
  return e === "auto" ? 0 : Number(e.slice(0, -1).replace(",", ".")) * 1e3;
}
function em() {
  return document.body.offsetHeight;
}
const dd = Symbol("_vod"), tm = {
  beforeMount(e, { value: t }, { transition: n }) {
    e[dd] = e.style.display === "none" ? "" : e.style.display, n && t ? n.beforeEnter(e) : Wn(e, t);
  },
  mounted(e, { value: t }, { transition: n }) {
    n && t && n.enter(e);
  },
  updated(e, { value: t, oldValue: n }, { transition: o }) {
    !t != !n && (o ? t ? (o.beforeEnter(e), Wn(e, !0), o.enter(e)) : o.leave(e, () => {
      Wn(e, !1);
    }) : Wn(e, t));
  },
  beforeUnmount(e, { value: t }) {
    Wn(e, t);
  }
};
function Wn(e, t) {
  e.style.display = t ? e[dd] : "none";
}
const nm = ["ctrl", "shift", "alt", "meta"], om = {
  stop: (e) => e.stopPropagation(),
  prevent: (e) => e.preventDefault(),
  self: (e) => e.target !== e.currentTarget,
  ctrl: (e) => !e.ctrlKey,
  shift: (e) => !e.shiftKey,
  alt: (e) => !e.altKey,
  meta: (e) => !e.metaKey,
  left: (e) => "button" in e && e.button !== 0,
  middle: (e) => "button" in e && e.button !== 1,
  right: (e) => "button" in e && e.button !== 2,
  exact: (e, t) => nm.some((n) => e[`${n}Key`] && !t.includes(n))
}, ms = (e, t) => (n, ...o) => {
  for (let r = 0; r < t.length; r++) {
    const i = om[t[r]];
    if (i && i(n, t))
      return;
  }
  return e(n, ...o);
};
function rm() {
  Yg();
}
process.env.NODE_ENV !== "production" && rm();
function po(e) {
  "@babel/helpers - typeof";
  return po = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, po(e);
}
function im(e, t) {
  if (po(e) !== "object" || e === null)
    return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(e, t || "default");
    if (po(o) !== "object")
      return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function am(e) {
  var t = im(e, "string");
  return po(t) === "symbol" ? t : String(t);
}
function lm(e, t, n) {
  return t = am(t), t in e ? Object.defineProperty(e, t, {
    value: n,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[t] = n, e;
}
function vs(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    t && (o = o.filter(function(r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), n.push.apply(n, o);
  }
  return n;
}
function U(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? vs(Object(n), !0).forEach(function(o) {
      lm(e, o, n[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : vs(Object(n)).forEach(function(o) {
      Object.defineProperty(e, o, Object.getOwnPropertyDescriptor(n, o));
    });
  }
  return e;
}
function g() {
  return g = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var o in n)
        Object.prototype.hasOwnProperty.call(n, o) && (e[o] = n[o]);
    }
    return e;
  }, g.apply(this, arguments);
}
const sm = (e) => typeof e == "function", cm = Array.isArray, um = (e) => typeof e == "string", dm = (e) => e !== null && typeof e == "object", fm = /^on[^a-z]/, pm = (e) => fm.test(e), fd = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, hm = /-(\w)/g, gm = fd((e) => e.replace(hm, (t, n) => n ? n.toUpperCase() : "")), mm = /\B([A-Z])/g, vm = fd((e) => e.replace(mm, "-$1").toLowerCase()), bm = Object.prototype.hasOwnProperty, bs = (e, t) => bm.call(e, t);
function ym(e, t, n, o) {
  const r = e[n];
  if (r != null) {
    const i = bs(r, "default");
    if (i && o === void 0) {
      const a = r.default;
      o = r.type !== Function && sm(a) ? a() : a;
    }
    r.type === Boolean && (!bs(t, n) && !i ? o = !1 : o === "" && (o = !0));
  }
  return o;
}
function ne() {
  const e = [];
  for (let t = 0; t < arguments.length; t++) {
    const n = t < 0 || arguments.length <= t ? void 0 : arguments[t];
    if (n) {
      if (um(n))
        e.push(n);
      else if (cm(n))
        for (let o = 0; o < n.length; o++) {
          const r = ne(n[o]);
          r && e.push(r);
        }
      else if (dm(n))
        for (const o in n)
          n[o] && e.push(o);
    }
  }
  return e.join(" ");
}
var pd = function() {
  if (typeof Map < "u")
    return Map;
  function e(t, n) {
    var o = -1;
    return t.some(function(r, i) {
      return r[0] === n ? (o = i, !0) : !1;
    }), o;
  }
  return (
    /** @class */
    function() {
      function t() {
        this.__entries__ = [];
      }
      return Object.defineProperty(t.prototype, "size", {
        /**
         * @returns {boolean}
         */
        get: function() {
          return this.__entries__.length;
        },
        enumerable: !0,
        configurable: !0
      }), t.prototype.get = function(n) {
        var o = e(this.__entries__, n), r = this.__entries__[o];
        return r && r[1];
      }, t.prototype.set = function(n, o) {
        var r = e(this.__entries__, n);
        ~r ? this.__entries__[r][1] = o : this.__entries__.push([n, o]);
      }, t.prototype.delete = function(n) {
        var o = this.__entries__, r = e(o, n);
        ~r && o.splice(r, 1);
      }, t.prototype.has = function(n) {
        return !!~e(this.__entries__, n);
      }, t.prototype.clear = function() {
        this.__entries__.splice(0);
      }, t.prototype.forEach = function(n, o) {
        o === void 0 && (o = null);
        for (var r = 0, i = this.__entries__; r < i.length; r++) {
          var a = i[r];
          n.call(o, a[1], a[0]);
        }
      }, t;
    }()
  );
}(), Yi = typeof window < "u" && typeof document < "u" && window.document === document, Or = function() {
  return typeof global < "u" && global.Math === Math ? global : typeof self < "u" && self.Math === Math ? self : typeof window < "u" && window.Math === Math ? window : Function("return this")();
}(), Sm = function() {
  return typeof requestAnimationFrame == "function" ? requestAnimationFrame.bind(Or) : function(e) {
    return setTimeout(function() {
      return e(Date.now());
    }, 1e3 / 60);
  };
}(), wm = 2;
function Cm(e, t) {
  var n = !1, o = !1, r = 0;
  function i() {
    n && (n = !1, e()), o && l();
  }
  function a() {
    Sm(i);
  }
  function l() {
    var c = Date.now();
    if (n) {
      if (c - r < wm)
        return;
      o = !0;
    } else
      n = !0, o = !1, setTimeout(a, t);
    r = c;
  }
  return l;
}
var xm = 20, Om = ["top", "right", "bottom", "left", "width", "height", "size", "weight"], $m = typeof MutationObserver < "u", _m = (
  /** @class */
  function() {
    function e() {
      this.connected_ = !1, this.mutationEventsAdded_ = !1, this.mutationsObserver_ = null, this.observers_ = [], this.onTransitionEnd_ = this.onTransitionEnd_.bind(this), this.refresh = Cm(this.refresh.bind(this), xm);
    }
    return e.prototype.addObserver = function(t) {
      ~this.observers_.indexOf(t) || this.observers_.push(t), this.connected_ || this.connect_();
    }, e.prototype.removeObserver = function(t) {
      var n = this.observers_, o = n.indexOf(t);
      ~o && n.splice(o, 1), !n.length && this.connected_ && this.disconnect_();
    }, e.prototype.refresh = function() {
      var t = this.updateObservers_();
      t && this.refresh();
    }, e.prototype.updateObservers_ = function() {
      var t = this.observers_.filter(function(n) {
        return n.gatherActive(), n.hasActive();
      });
      return t.forEach(function(n) {
        return n.broadcastActive();
      }), t.length > 0;
    }, e.prototype.connect_ = function() {
      !Yi || this.connected_ || (document.addEventListener("transitionend", this.onTransitionEnd_), window.addEventListener("resize", this.refresh), $m ? (this.mutationsObserver_ = new MutationObserver(this.refresh), this.mutationsObserver_.observe(document, {
        attributes: !0,
        childList: !0,
        characterData: !0,
        subtree: !0
      })) : (document.addEventListener("DOMSubtreeModified", this.refresh), this.mutationEventsAdded_ = !0), this.connected_ = !0);
    }, e.prototype.disconnect_ = function() {
      !Yi || !this.connected_ || (document.removeEventListener("transitionend", this.onTransitionEnd_), window.removeEventListener("resize", this.refresh), this.mutationsObserver_ && this.mutationsObserver_.disconnect(), this.mutationEventsAdded_ && document.removeEventListener("DOMSubtreeModified", this.refresh), this.mutationsObserver_ = null, this.mutationEventsAdded_ = !1, this.connected_ = !1);
    }, e.prototype.onTransitionEnd_ = function(t) {
      var n = t.propertyName, o = n === void 0 ? "" : n, r = Om.some(function(i) {
        return !!~o.indexOf(i);
      });
      r && this.refresh();
    }, e.getInstance = function() {
      return this.instance_ || (this.instance_ = new e()), this.instance_;
    }, e.instance_ = null, e;
  }()
), hd = function(e, t) {
  for (var n = 0, o = Object.keys(t); n < o.length; n++) {
    var r = o[n];
    Object.defineProperty(e, r, {
      value: t[r],
      enumerable: !1,
      writable: !1,
      configurable: !0
    });
  }
  return e;
}, En = function(e) {
  var t = e && e.ownerDocument && e.ownerDocument.defaultView;
  return t || Or;
}, gd = Wr(0, 0, 0, 0);
function $r(e) {
  return parseFloat(e) || 0;
}
function ys(e) {
  for (var t = [], n = 1; n < arguments.length; n++)
    t[n - 1] = arguments[n];
  return t.reduce(function(o, r) {
    var i = e["border-" + r + "-width"];
    return o + $r(i);
  }, 0);
}
function Em(e) {
  for (var t = ["top", "right", "bottom", "left"], n = {}, o = 0, r = t; o < r.length; o++) {
    var i = r[o], a = e["padding-" + i];
    n[i] = $r(a);
  }
  return n;
}
function Tm(e) {
  var t = e.getBBox();
  return Wr(0, 0, t.width, t.height);
}
function Pm(e) {
  var t = e.clientWidth, n = e.clientHeight;
  if (!t && !n)
    return gd;
  var o = En(e).getComputedStyle(e), r = Em(o), i = r.left + r.right, a = r.top + r.bottom, l = $r(o.width), c = $r(o.height);
  if (o.boxSizing === "border-box" && (Math.round(l + i) !== t && (l -= ys(o, "left", "right") + i), Math.round(c + a) !== n && (c -= ys(o, "top", "bottom") + a)), !Mm(e)) {
    var s = Math.round(l + i) - t, d = Math.round(c + a) - n;
    Math.abs(s) !== 1 && (l -= s), Math.abs(d) !== 1 && (c -= d);
  }
  return Wr(r.left, r.top, l, c);
}
var Im = function() {
  return typeof SVGGraphicsElement < "u" ? function(e) {
    return e instanceof En(e).SVGGraphicsElement;
  } : function(e) {
    return e instanceof En(e).SVGElement && typeof e.getBBox == "function";
  };
}();
function Mm(e) {
  return e === En(e).document.documentElement;
}
function Nm(e) {
  return Yi ? Im(e) ? Tm(e) : Pm(e) : gd;
}
function Am(e) {
  var t = e.x, n = e.y, o = e.width, r = e.height, i = typeof DOMRectReadOnly < "u" ? DOMRectReadOnly : Object, a = Object.create(i.prototype);
  return hd(a, {
    x: t,
    y: n,
    width: o,
    height: r,
    top: n,
    right: t + o,
    bottom: r + n,
    left: t
  }), a;
}
function Wr(e, t, n, o) {
  return { x: e, y: t, width: n, height: o };
}
var Dm = (
  /** @class */
  function() {
    function e(t) {
      this.broadcastWidth = 0, this.broadcastHeight = 0, this.contentRect_ = Wr(0, 0, 0, 0), this.target = t;
    }
    return e.prototype.isActive = function() {
      var t = Nm(this.target);
      return this.contentRect_ = t, t.width !== this.broadcastWidth || t.height !== this.broadcastHeight;
    }, e.prototype.broadcastRect = function() {
      var t = this.contentRect_;
      return this.broadcastWidth = t.width, this.broadcastHeight = t.height, t;
    }, e;
  }()
), Rm = (
  /** @class */
  function() {
    function e(t, n) {
      var o = Am(n);
      hd(this, { target: t, contentRect: o });
    }
    return e;
  }()
), Hm = (
  /** @class */
  function() {
    function e(t, n, o) {
      if (this.activeObservations_ = [], this.observations_ = new pd(), typeof t != "function")
        throw new TypeError("The callback provided as parameter 1 is not a function.");
      this.callback_ = t, this.controller_ = n, this.callbackCtx_ = o;
    }
    return e.prototype.observe = function(t) {
      if (!arguments.length)
        throw new TypeError("1 argument required, but only 0 present.");
      if (!(typeof Element > "u" || !(Element instanceof Object))) {
        if (!(t instanceof En(t).Element))
          throw new TypeError('parameter 1 is not of type "Element".');
        var n = this.observations_;
        n.has(t) || (n.set(t, new Dm(t)), this.controller_.addObserver(this), this.controller_.refresh());
      }
    }, e.prototype.unobserve = function(t) {
      if (!arguments.length)
        throw new TypeError("1 argument required, but only 0 present.");
      if (!(typeof Element > "u" || !(Element instanceof Object))) {
        if (!(t instanceof En(t).Element))
          throw new TypeError('parameter 1 is not of type "Element".');
        var n = this.observations_;
        n.has(t) && (n.delete(t), n.size || this.controller_.removeObserver(this));
      }
    }, e.prototype.disconnect = function() {
      this.clearActive(), this.observations_.clear(), this.controller_.removeObserver(this);
    }, e.prototype.gatherActive = function() {
      var t = this;
      this.clearActive(), this.observations_.forEach(function(n) {
        n.isActive() && t.activeObservations_.push(n);
      });
    }, e.prototype.broadcastActive = function() {
      if (this.hasActive()) {
        var t = this.callbackCtx_, n = this.activeObservations_.map(function(o) {
          return new Rm(o.target, o.broadcastRect());
        });
        this.callback_.call(t, n, t), this.clearActive();
      }
    }, e.prototype.clearActive = function() {
      this.activeObservations_.splice(0);
    }, e.prototype.hasActive = function() {
      return this.activeObservations_.length > 0;
    }, e;
  }()
), md = typeof WeakMap < "u" ? /* @__PURE__ */ new WeakMap() : new pd(), vd = (
  /** @class */
  function() {
    function e(t) {
      if (!(this instanceof e))
        throw new TypeError("Cannot call a class as a function.");
      if (!arguments.length)
        throw new TypeError("1 argument required, but only 0 present.");
      var n = _m.getInstance(), o = new Hm(t, n, this);
      md.set(this, o);
    }
    return e;
  }()
);
[
  "observe",
  "unobserve",
  "disconnect"
].forEach(function(e) {
  vd.prototype[e] = function() {
    var t;
    return (t = md.get(this))[e].apply(t, arguments);
  };
});
var bd = function() {
  return typeof Or.ResizeObserver < "u" ? Or.ResizeObserver : vd;
}();
const Fm = (e) => e != null && e !== "", zm = Fm, Lm = (e, t) => {
  const n = g({}, e);
  return Object.keys(t).forEach((o) => {
    const r = n[o];
    if (r)
      r.type || r.default ? r.default = t[o] : r.def ? r.def(t[o]) : n[o] = {
        type: r,
        default: t[o]
      };
    else
      throw new Error(`not have ${o} prop`);
  }), n;
}, Kr = Lm, yd = (e) => {
  const t = Object.keys(e), n = {}, o = {}, r = {};
  for (let i = 0, a = t.length; i < a; i++) {
    const l = t[i];
    pm(l) ? (n[l[2].toLowerCase() + l.slice(3)] = e[l], o[l] = e[l]) : r[l] = e[l];
  }
  return {
    onEvents: o,
    events: n,
    extraAttrs: r
  };
}, vn = (e, t) => e[t] !== void 0, jm = Symbol("skipFlatten"), tt = function() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
  const n = Array.isArray(e) ? e : [e], o = [];
  return n.forEach((r) => {
    Array.isArray(r) ? o.push(...tt(r, t)) : r && r.type === Me ? r.key === jm ? o.push(r) : o.push(...tt(r.children, t)) : r && ft(r) ? t && !wd(r) ? o.push(r) : t || o.push(r) : zm(r) && o.push(r);
  }), o;
}, Bm = function(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "default", n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  if (ft(e))
    return e.type === Me ? t === "default" ? tt(e.children) : [] : e.children && e.children[t] ? tt(e.children[t](n)) : [];
  {
    const o = e.$slots[t] && e.$slots[t](n);
    return tt(o);
  }
}, qn = (e) => {
  var t;
  let n = ((t = e == null ? void 0 : e.vnode) === null || t === void 0 ? void 0 : t.el) || e && (e.$el || e);
  for (; n && !n.tagName; )
    n = n.nextSibling;
  return n;
}, Vm = (e) => {
  const t = {};
  if (e.$ && e.$.vnode) {
    const n = e.$.vnode.props || {};
    Object.keys(e.$props).forEach((o) => {
      const r = e.$props[o], i = vm(o);
      (r !== void 0 || i in n) && (t[o] = r);
    });
  } else if (ft(e) && typeof e.type == "object") {
    const n = e.props || {}, o = {};
    Object.keys(n).forEach((i) => {
      o[gm(i)] = n[i];
    });
    const r = e.type.props || {};
    Object.keys(r).forEach((i) => {
      const a = ym(r, o, i, o[i]);
      (a !== void 0 || i in o) && (t[i] = a);
    });
  }
  return t;
}, Sd = function(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "default", n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : e, o = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !0, r;
  if (e.$) {
    const i = e[t];
    if (i !== void 0)
      return typeof i == "function" && o ? i(n) : i;
    r = e.$slots[t], r = o && r ? r(n) : r;
  } else if (ft(e)) {
    const i = e.props && e.props[t];
    if (i !== void 0 && e.props !== null)
      return typeof i == "function" && o ? i(n) : i;
    e.type === Me ? r = e.children : e.children && e.children[t] && (r = e.children[t], r = o && r ? r(n) : r);
  }
  return Array.isArray(r) && (r = tt(r), r = r.length === 1 ? r[0] : r, r = r.length === 0 ? void 0 : r), r;
};
function Ss() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, n = {};
  return e.$ ? n = g(g({}, n), e.$attrs) : n = g(g({}, n), e.props), yd(n)[t ? "onEvents" : "events"];
}
function wd(e) {
  return e && (e.type === Rt || e.type === Me && e.children.length === 0 || e.type === ja && e.children.trim() === "");
}
function Io() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
  const t = [];
  return e.forEach((n) => {
    Array.isArray(n) ? t.push(...n) : (n == null ? void 0 : n.type) === Me ? t.push(...Io(n.children)) : t.push(n);
  }), t.filter((n) => !wd(n));
}
function an(e) {
  return Array.isArray(e) && e.length === 1 && (e = e[0]), e && e.__v_isVNode && typeof e.type != "symbol";
}
function Wm(e, t) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "default";
  var o, r;
  return (o = t[n]) !== null && o !== void 0 ? o : (r = e[n]) === null || r === void 0 ? void 0 : r.call(e);
}
const Xa = /* @__PURE__ */ Z({
  compatConfig: {
    MODE: 3
  },
  name: "ResizeObserver",
  props: {
    disabled: Boolean,
    onResize: Function
  },
  emits: ["resize"],
  setup(e, t) {
    let {
      slots: n
    } = t;
    const o = Ye({
      width: 0,
      height: 0,
      offsetHeight: 0,
      offsetWidth: 0
    });
    let r = null, i = null;
    const a = () => {
      i && (i.disconnect(), i = null);
    }, l = (d) => {
      const {
        onResize: u
      } = e, f = d[0].target, {
        width: p,
        height: h
      } = f.getBoundingClientRect(), {
        offsetWidth: m,
        offsetHeight: w
      } = f, y = Math.floor(p), S = Math.floor(h);
      if (o.width !== y || o.height !== S || o.offsetWidth !== m || o.offsetHeight !== w) {
        const _ = {
          width: y,
          height: S,
          offsetWidth: m,
          offsetHeight: w
        };
        g(o, _), u && Promise.resolve().then(() => {
          u(g(g({}, _), {
            offsetWidth: m,
            offsetHeight: w
          }), f);
        });
      }
    }, c = cn(), s = () => {
      const {
        disabled: d
      } = e;
      if (d) {
        a();
        return;
      }
      const u = qn(c);
      u !== r && (a(), r = u), !i && u && (i = new bd(l), i.observe(u));
    };
    return De(() => {
      s();
    }), Eo(() => {
      s();
    }), To(() => {
      a();
    }), ae(() => e.disabled, () => {
      s();
    }, {
      flush: "post"
    }), () => {
      var d;
      return (d = n.default) === null || d === void 0 ? void 0 : d.call(n)[0];
    };
  }
});
let Cd = (e) => setTimeout(e, 16), xd = (e) => clearTimeout(e);
typeof window < "u" && "requestAnimationFrame" in window && (Cd = (e) => window.requestAnimationFrame(e), xd = (e) => window.cancelAnimationFrame(e));
let ws = 0;
const Ga = /* @__PURE__ */ new Map();
function Od(e) {
  Ga.delete(e);
}
function Oe(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
  ws += 1;
  const n = ws;
  function o(r) {
    if (r === 0)
      Od(n), e();
    else {
      const i = Cd(() => {
        o(r - 1);
      });
      Ga.set(n, i);
    }
  }
  return o(t), n;
}
Oe.cancel = (e) => {
  const t = Ga.get(e);
  return Od(t), xd(t);
};
const _r = function() {
  for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
    t[n] = arguments[n];
  return t;
}, ka = (e) => {
  const t = e;
  return t.install = function(n) {
    n.component(t.displayName || t.name, e);
  }, e;
};
function $d(e) {
  return {
    type: Object,
    default: e
  };
}
function Ge(e) {
  return {
    type: Boolean,
    default: e
  };
}
function Et(e) {
  return {
    type: Function,
    default: e
  };
}
function qi(e, t) {
  const n = {
    validator: () => !0,
    default: e
  };
  return n;
}
function Qi(e) {
  return {
    type: Array,
    default: e
  };
}
function Mt(e) {
  return {
    type: String,
    default: e
  };
}
function Er(e, t) {
  return e ? {
    type: e,
    default: t
  } : qi(t);
}
let _d = !1;
try {
  const e = Object.defineProperty({}, "passive", {
    get() {
      _d = !0;
    }
  });
  window.addEventListener("testPassive", null, e), window.removeEventListener("testPassive", null, e);
} catch {
}
const Re = _d;
function Qn(e, t, n, o) {
  if (e && e.addEventListener) {
    let r = o;
    r === void 0 && Re && (t === "touchstart" || t === "touchmove" || t === "wheel") && (r = {
      passive: !1
    }), e.addEventListener(t, n, r);
  }
  return {
    remove: () => {
      e && e.removeEventListener && e.removeEventListener(t, n);
    }
  };
}
const Km = "anticon", Ed = Symbol("configProvider"), Td = {
  getPrefixCls: (e, t) => t || (e ? `ant-${e}` : "ant"),
  iconPrefixCls: E(() => Km),
  getPopupContainer: E(() => () => document.body),
  direction: E(() => "ltr")
}, Um = () => ye(Ed, Td), Xm = Symbol("DisabledContextKey"), Pd = () => ye(Xm, oe(void 0)), Id = {
  // Options.jsx
  items_per_page: "/ page",
  jump_to: "Go to",
  jump_to_confirm: "confirm",
  page: "",
  // Pagination.jsx
  prev_page: "Previous Page",
  next_page: "Next Page",
  prev_5: "Previous 5 Pages",
  next_5: "Next 5 Pages",
  prev_3: "Previous 3 Pages",
  next_3: "Next 3 Pages"
}, Gm = {
  locale: "en_US",
  today: "Today",
  now: "Now",
  backToToday: "Back to today",
  ok: "Ok",
  clear: "Clear",
  month: "Month",
  year: "Year",
  timeSelect: "select time",
  dateSelect: "select date",
  weekSelect: "Choose a week",
  monthSelect: "Choose a month",
  yearSelect: "Choose a year",
  decadeSelect: "Choose a decade",
  yearFormat: "YYYY",
  dateFormat: "M/D/YYYY",
  dayFormat: "D",
  dateTimeFormat: "M/D/YYYY HH:mm:ss",
  monthBeforeYear: !0,
  previousMonth: "Previous month (PageUp)",
  nextMonth: "Next month (PageDown)",
  previousYear: "Last year (Control + left)",
  nextYear: "Next year (Control + right)",
  previousDecade: "Last decade",
  nextDecade: "Next decade",
  previousCentury: "Last century",
  nextCentury: "Next century"
}, km = Gm, Ym = {
  placeholder: "Select time",
  rangePlaceholder: ["Start time", "End time"]
}, Md = Ym, qm = {
  lang: g({
    placeholder: "Select date",
    yearPlaceholder: "Select year",
    quarterPlaceholder: "Select quarter",
    monthPlaceholder: "Select month",
    weekPlaceholder: "Select week",
    rangePlaceholder: ["Start date", "End date"],
    rangeYearPlaceholder: ["Start year", "End year"],
    rangeQuarterPlaceholder: ["Start quarter", "End quarter"],
    rangeMonthPlaceholder: ["Start month", "End month"],
    rangeWeekPlaceholder: ["Start week", "End week"]
  }, km),
  timePickerLocale: g({}, Md)
}, Cs = qm, je = "${label} is not a valid ${type}", Qm = {
  locale: "en",
  Pagination: Id,
  DatePicker: Cs,
  TimePicker: Md,
  Calendar: Cs,
  global: {
    placeholder: "Please select"
  },
  Table: {
    filterTitle: "Filter menu",
    filterConfirm: "OK",
    filterReset: "Reset",
    filterEmptyText: "No filters",
    filterCheckall: "Select all items",
    filterSearchPlaceholder: "Search in filters",
    emptyText: "No data",
    selectAll: "Select current page",
    selectInvert: "Invert current page",
    selectNone: "Clear all data",
    selectionAll: "Select all data",
    sortTitle: "Sort",
    expand: "Expand row",
    collapse: "Collapse row",
    triggerDesc: "Click to sort descending",
    triggerAsc: "Click to sort ascending",
    cancelSort: "Click to cancel sorting"
  },
  Tour: {
    Next: "Next",
    Previous: "Previous",
    Finish: "Finish"
  },
  Modal: {
    okText: "OK",
    cancelText: "Cancel",
    justOkText: "OK"
  },
  Popconfirm: {
    okText: "OK",
    cancelText: "Cancel"
  },
  Transfer: {
    titles: ["", ""],
    searchPlaceholder: "Search here",
    itemUnit: "item",
    itemsUnit: "items",
    remove: "Remove",
    selectCurrent: "Select current page",
    removeCurrent: "Remove current page",
    selectAll: "Select all data",
    removeAll: "Remove all data",
    selectInvert: "Invert current page"
  },
  Upload: {
    uploading: "Uploading...",
    removeFile: "Remove file",
    uploadError: "Upload error",
    previewFile: "Preview file",
    downloadFile: "Download file"
  },
  Empty: {
    description: "No data"
  },
  Icon: {
    icon: "icon"
  },
  Text: {
    edit: "Edit",
    copy: "Copy",
    copied: "Copied",
    expand: "Expand"
  },
  PageHeader: {
    back: "Back"
  },
  Form: {
    optional: "(optional)",
    defaultValidateMessages: {
      default: "Field validation error for ${label}",
      required: "Please enter ${label}",
      enum: "${label} must be one of [${enum}]",
      whitespace: "${label} cannot be a blank character",
      date: {
        format: "${label} date format is invalid",
        parse: "${label} cannot be converted to a date",
        invalid: "${label} is an invalid date"
      },
      types: {
        string: je,
        method: je,
        array: je,
        object: je,
        number: je,
        date: je,
        boolean: je,
        integer: je,
        float: je,
        regexp: je,
        email: je,
        url: je,
        hex: je
      },
      string: {
        len: "${label} must be ${len} characters",
        min: "${label} must be at least ${min} characters",
        max: "${label} must be up to ${max} characters",
        range: "${label} must be between ${min}-${max} characters"
      },
      number: {
        len: "${label} must be equal to ${len}",
        min: "${label} must be minimum ${min}",
        max: "${label} must be maximum ${max}",
        range: "${label} must be between ${min}-${max}"
      },
      array: {
        len: "Must be ${len} ${label}",
        min: "At least ${min} ${label}",
        max: "At most ${max} ${label}",
        range: "The amount of ${label} must be between ${min}-${max}"
      },
      pattern: {
        mismatch: "${label} does not match the pattern ${pattern}"
      }
    }
  },
  Image: {
    preview: "Preview"
  },
  QRCode: {
    expired: "QR code expired",
    refresh: "Refresh"
  }
}, Ji = Qm, Jm = /* @__PURE__ */ Z({
  compatConfig: {
    MODE: 3
  },
  name: "LocaleReceiver",
  props: {
    componentName: String,
    defaultLocale: {
      type: [Object, Function]
    },
    children: {
      type: Function
    }
  },
  setup(e, t) {
    let {
      slots: n
    } = t;
    const o = ye("localeData", {}), r = E(() => {
      const {
        componentName: a = "global",
        defaultLocale: l
      } = e, c = l || Ji[a || "global"], {
        antLocale: s
      } = o, d = a && s ? s[a] : {};
      return g(g({}, typeof c == "function" ? c() : c), d || {});
    }), i = E(() => {
      const {
        antLocale: a
      } = o, l = a && a.locale;
      return a && a.exist && !l ? Ji.locale : l;
    });
    return () => {
      const a = e.children || n.default, {
        antLocale: l
      } = o;
      return a == null ? void 0 : a(r.value, i.value, l);
    };
  }
});
function Zm(e, t, n) {
  const o = ye("localeData", {});
  return [E(() => {
    const {
      antLocale: i
    } = o, a = $n(t) || Ji[e || "global"], l = e && i ? i[e] : {};
    return g(g(g({}, typeof a == "function" ? a() : a), l || {}), $n(n) || {});
  })];
}
function Ya(e) {
  for (var t = 0, n, o = 0, r = e.length; r >= 4; ++o, r -= 4)
    n = e.charCodeAt(o) & 255 | (e.charCodeAt(++o) & 255) << 8 | (e.charCodeAt(++o) & 255) << 16 | (e.charCodeAt(++o) & 255) << 24, n = /* Math.imul(k, m): */
    (n & 65535) * 1540483477 + ((n >>> 16) * 59797 << 16), n ^= /* k >>> r: */
    n >>> 24, t = /* Math.imul(k, m): */
    (n & 65535) * 1540483477 + ((n >>> 16) * 59797 << 16) ^ /* Math.imul(h, m): */
    (t & 65535) * 1540483477 + ((t >>> 16) * 59797 << 16);
  switch (r) {
    case 3:
      t ^= (e.charCodeAt(o + 2) & 255) << 16;
    case 2:
      t ^= (e.charCodeAt(o + 1) & 255) << 8;
    case 1:
      t ^= e.charCodeAt(o) & 255, t = /* Math.imul(h, m): */
      (t & 65535) * 1540483477 + ((t >>> 16) * 59797 << 16);
  }
  return t ^= t >>> 13, t = /* Math.imul(h, m): */
  (t & 65535) * 1540483477 + ((t >>> 16) * 59797 << 16), ((t ^ t >>> 15) >>> 0).toString(36);
}
const xs = "%";
class ev {
  constructor(t) {
    this.cache = /* @__PURE__ */ new Map(), this.instanceId = t;
  }
  get(t) {
    return this.cache.get(Array.isArray(t) ? t.join(xs) : t) || null;
  }
  update(t, n) {
    const o = Array.isArray(t) ? t.join(xs) : t, r = this.cache.get(o), i = n(r);
    i === null ? this.cache.delete(o) : this.cache.set(o, i);
  }
}
const tv = ev, Nd = "data-token-hash", tn = "data-css-hash", nv = "data-cache-path", Sn = "__cssinjs_instance__";
function ho() {
  const e = Math.random().toString(12).slice(2);
  if (typeof document < "u" && document.head && document.body) {
    const t = document.body.querySelectorAll(`style[${tn}]`) || [], {
      firstChild: n
    } = document.head;
    Array.from(t).forEach((r) => {
      r[Sn] = r[Sn] || e, r[Sn] === e && document.head.insertBefore(r, n);
    });
    const o = {};
    Array.from(document.querySelectorAll(`style[${tn}]`)).forEach((r) => {
      var i;
      const a = r.getAttribute(tn);
      o[a] ? r[Sn] === e && ((i = r.parentNode) === null || i === void 0 || i.removeChild(r)) : o[a] = !0;
    });
  }
  return new tv(e);
}
const Ad = Symbol("StyleContextKey"), ov = () => {
  var e, t, n;
  const o = cn();
  let r;
  if (o && o.appContext) {
    const i = (n = (t = (e = o.appContext) === null || e === void 0 ? void 0 : e.config) === null || t === void 0 ? void 0 : t.globalProperties) === null || n === void 0 ? void 0 : n.__ANTDV_CSSINJS_CACHE__;
    i ? r = i : (r = ho(), o.appContext.config.globalProperties && (o.appContext.config.globalProperties.__ANTDV_CSSINJS_CACHE__ = r));
  } else
    r = ho();
  return r;
}, Dd = {
  cache: ho(),
  defaultCache: !0,
  hashPriority: "low"
}, Ur = () => {
  const e = ov();
  return ye(Ad, V(g(g({}, Dd), {
    cache: e
  })));
}, rv = (e) => {
  const t = Ur(), n = V(g(g({}, Dd), {
    cache: ho()
  }));
  return ae([() => $n(e), t], () => {
    const o = g({}, t.value), r = $n(e);
    Object.keys(r).forEach((a) => {
      const l = r[a];
      r[a] !== void 0 && (o[a] = l);
    });
    const {
      cache: i
    } = r;
    o.cache = o.cache || ho(), o.defaultCache = !i && t.value.defaultCache, n.value = o;
  }, {
    immediate: !0
  }), dt(Ad, n), n;
}, iv = () => ({
  autoClear: Ge(),
  /** @private Test only. Not work in production. */
  mock: Mt(),
  /**
   * Only set when you need ssr to extract style on you own.
   * If not provided, it will auto create <style /> on the end of Provider in server side.
   */
  cache: $d(),
  /** Tell children that this context is default generated context */
  defaultCache: Ge(),
  /** Use `:where` selector to reduce hashId css selector priority */
  hashPriority: Mt(),
  /** Tell cssinjs where to inject style in */
  container: Er(),
  /** Component wil render inline  `<style />` for fallback in SSR. Not recommend. */
  ssrInline: Ge(),
  /** Transform css before inject in document. Please note that `transformers` do not support dynamic update */
  transformers: Qi(),
  /**
   * Linters to lint css before inject in document.
   * Styles will be linted after transforming.
   * Please note that `linters` do not support dynamic update.
   */
  linters: Qi()
});
ka(/* @__PURE__ */ Z({
  name: "AStyleProvider",
  inheritAttrs: !1,
  props: iv(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    return rv(e), () => {
      var o;
      return (o = n.default) === null || o === void 0 ? void 0 : o.call(n);
    };
  }
}));
function av() {
  return !1;
}
let Zi = !1;
function lv() {
  return Zi;
}
const sv = process.env.NODE_ENV === "production" ? av : lv;
if (process.env.NODE_ENV !== "production" && typeof module < "u" && module && module.hot && typeof window < "u") {
  const e = window;
  if (typeof e.webpackHotUpdate == "function") {
    const t = e.webpackHotUpdate;
    e.webpackHotUpdate = function() {
      return Zi = !0, setTimeout(() => {
        Zi = !1;
      }, 0), t(...arguments);
    };
  }
}
function Rd(e, t, n, o) {
  const r = Ur(), i = V(""), a = V();
  ut(() => {
    i.value = [e, ...t.value].join("%");
  });
  const l = sv(), c = (s) => {
    r.value.cache.update(s, (d) => {
      const [u = 0, f] = d || [];
      return u - 1 === 0 ? (o == null || o(f, !1), null) : [u - 1, f];
    });
  };
  return ae(i, (s, d) => {
    d && c(d), r.value.cache.update(s, (u) => {
      const [f = 0, p] = u || [];
      let h = p;
      process.env.NODE_ENV !== "production" && p && l && (o == null || o(h, l), h = null);
      const m = h || n();
      return [f + 1, m];
    }), a.value = r.value.cache.get(i.value)[1];
  }, {
    immediate: !0
  }), rt(() => {
    c(i.value);
  }), a;
}
function pt() {
  return !!(typeof window < "u" && window.document && window.document.createElement);
}
function Gt(e, t) {
  return e && e.contains ? e.contains(t) : !1;
}
const Os = "data-vc-order", cv = "vc-util-key", ea = /* @__PURE__ */ new Map();
function Hd() {
  let {
    mark: e
  } = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  return e ? e.startsWith("data-") ? e : `data-${e}` : cv;
}
function Xr(e) {
  return e.attachTo ? e.attachTo : document.querySelector("head") || document.body;
}
function uv(e) {
  return e === "queue" ? "prependQueue" : e ? "prepend" : "append";
}
function Fd(e) {
  return Array.from((ea.get(e) || e).children).filter((t) => t.tagName === "STYLE");
}
function zd(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  if (!pt())
    return null;
  const {
    csp: n,
    prepend: o
  } = t, r = document.createElement("style");
  r.setAttribute(Os, uv(o)), n != null && n.nonce && (r.nonce = n == null ? void 0 : n.nonce), r.innerHTML = e;
  const i = Xr(t), {
    firstChild: a
  } = i;
  if (o) {
    if (o === "queue") {
      const l = Fd(i).filter((c) => ["prepend", "prependQueue"].includes(c.getAttribute(Os)));
      if (l.length)
        return i.insertBefore(r, l[l.length - 1].nextSibling), r;
    }
    i.insertBefore(r, a);
  } else
    i.appendChild(r);
  return r;
}
function Ld(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  const n = Xr(t);
  return Fd(n).find((o) => o.getAttribute(Hd(t)) === e);
}
function Tr(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  const n = Ld(e, t);
  n && Xr(t).removeChild(n);
}
function dv(e, t) {
  const n = ea.get(e);
  if (!n || !Gt(document, n)) {
    const o = zd("", t), {
      parentNode: r
    } = o;
    ea.set(e, r), e.removeChild(o);
  }
}
function Pr(e, t) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  var o, r, i;
  const a = Xr(n);
  dv(a, n);
  const l = Ld(t, n);
  if (l)
    return !((o = n.csp) === null || o === void 0) && o.nonce && l.nonce !== ((r = n.csp) === null || r === void 0 ? void 0 : r.nonce) && (l.nonce = (i = n.csp) === null || i === void 0 ? void 0 : i.nonce), l.innerHTML !== e && (l.innerHTML = e), l;
  const c = zd(e, n);
  return c.setAttribute(Hd(n), t), c;
}
function fv(e, t) {
  if (e.length !== t.length)
    return !1;
  for (let n = 0; n < e.length; n++)
    if (e[n] !== t[n])
      return !1;
  return !0;
}
class Tn {
  constructor() {
    this.cache = /* @__PURE__ */ new Map(), this.keys = [], this.cacheCallTimes = 0;
  }
  size() {
    return this.keys.length;
  }
  internalGet(t) {
    let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, o = {
      map: this.cache
    };
    return t.forEach((r) => {
      var i;
      o ? o = (i = o == null ? void 0 : o.map) === null || i === void 0 ? void 0 : i.get(r) : o = void 0;
    }), o != null && o.value && n && (o.value[1] = this.cacheCallTimes++), o == null ? void 0 : o.value;
  }
  get(t) {
    var n;
    return (n = this.internalGet(t, !0)) === null || n === void 0 ? void 0 : n[0];
  }
  has(t) {
    return !!this.internalGet(t);
  }
  set(t, n) {
    if (!this.has(t)) {
      if (this.size() + 1 > Tn.MAX_CACHE_SIZE + Tn.MAX_CACHE_OFFSET) {
        const [r] = this.keys.reduce((i, a) => {
          const [, l] = i;
          return this.internalGet(a)[1] < l ? [a, this.internalGet(a)[1]] : i;
        }, [this.keys[0], this.cacheCallTimes]);
        this.delete(r);
      }
      this.keys.push(t);
    }
    let o = this.cache;
    t.forEach((r, i) => {
      if (i === t.length - 1)
        o.set(r, {
          value: [n, this.cacheCallTimes++]
        });
      else {
        const a = o.get(r);
        a ? a.map || (a.map = /* @__PURE__ */ new Map()) : o.set(r, {
          map: /* @__PURE__ */ new Map()
        }), o = o.get(r).map;
      }
    });
  }
  deleteByPath(t, n) {
    var o;
    const r = t.get(n[0]);
    if (n.length === 1)
      return r.map ? t.set(n[0], {
        map: r.map
      }) : t.delete(n[0]), (o = r.value) === null || o === void 0 ? void 0 : o[0];
    const i = this.deleteByPath(r.map, n.slice(1));
    return (!r.map || r.map.size === 0) && !r.value && t.delete(n[0]), i;
  }
  delete(t) {
    if (this.has(t))
      return this.keys = this.keys.filter((n) => !fv(n, t)), this.deleteByPath(this.cache, t);
  }
}
Tn.MAX_CACHE_SIZE = 20;
Tn.MAX_CACHE_OFFSET = 5;
let ta = {};
function jd(e, t) {
  process.env.NODE_ENV !== "production" && !e && console !== void 0 && console.error(`Warning: ${t}`);
}
function pv(e, t) {
  process.env.NODE_ENV !== "production" && !e && console !== void 0 && console.warn(`Note: ${t}`);
}
function hv() {
  ta = {};
}
function Bd(e, t, n) {
  !t && !ta[n] && (e(!1, n), ta[n] = !0);
}
function Xe(e, t) {
  Bd(jd, e, t);
}
function $s(e, t) {
  Bd(pv, e, t);
}
function gv() {
}
let Vd = gv;
process.env.NODE_ENV !== "production" && (Vd = (e, t, n) => {
  Xe(e, `[ant-design-vue: ${t}] ${n}`), process.env.NODE_ENV === "test" && hv();
});
const Wd = Vd;
let _s = 0;
class Kd {
  constructor(t) {
    this.derivatives = Array.isArray(t) ? t : [t], this.id = _s, t.length === 0 && Wd(t.length > 0, "[Ant Design Vue CSS-in-JS] Theme should have at least one derivative function."), _s += 1;
  }
  getDerivativeToken(t) {
    return this.derivatives.reduce((n, o) => o(t, n), void 0);
  }
}
const hi = new Tn();
function mv(e) {
  const t = Array.isArray(e) ? e : [e];
  return hi.has(t) || hi.set(t, new Kd(t)), hi.get(t);
}
const Es = /* @__PURE__ */ new WeakMap();
function Ir(e) {
  let t = Es.get(e) || "";
  return t || (Object.keys(e).forEach((n) => {
    const o = e[n];
    t += n, o instanceof Kd ? t += o.id : o && typeof o == "object" ? t += Ir(o) : t += o;
  }), Es.set(e, t)), t;
}
function vv(e, t) {
  return Ya(`${t}_${Ir(e)}`);
}
const no = `random-${Date.now()}-${Math.random()}`.replace(/\./g, ""), Ud = "_bAmBoO_";
function bv(e, t, n) {
  var o, r;
  if (pt()) {
    Pr(e, no);
    const i = document.createElement("div");
    i.style.position = "fixed", i.style.left = "0", i.style.top = "0", t == null || t(i), document.body.appendChild(i), process.env.NODE_ENV !== "production" && (i.innerHTML = "Test", i.style.zIndex = "9999999");
    const a = n ? n(i) : (o = getComputedStyle(i).content) === null || o === void 0 ? void 0 : o.includes(Ud);
    return (r = i.parentNode) === null || r === void 0 || r.removeChild(i), Tr(no), a;
  }
  return !1;
}
let gi;
function yv() {
  return gi === void 0 && (gi = bv(`@layer ${no} { .${no} { content: "${Ud}"!important; } }`, (e) => {
    e.className = no;
  })), gi;
}
const Ts = {}, Sv = process.env.NODE_ENV !== "production" ? "css-dev-only-do-not-override" : "css", kt = /* @__PURE__ */ new Map();
function wv(e) {
  kt.set(e, (kt.get(e) || 0) + 1);
}
function Cv(e, t) {
  typeof document < "u" && document.querySelectorAll(`style[${Nd}="${e}"]`).forEach((o) => {
    var r;
    o[Sn] === t && ((r = o.parentNode) === null || r === void 0 || r.removeChild(o));
  });
}
const xv = 0;
function Ov(e, t) {
  kt.set(e, (kt.get(e) || 0) - 1);
  const n = Array.from(kt.keys()), o = n.filter((r) => (kt.get(r) || 0) <= 0);
  n.length - o.length > xv && o.forEach((r) => {
    Cv(r, t), kt.delete(r);
  });
}
const $v = (e, t, n, o) => {
  const r = n.getDerivativeToken(e);
  let i = g(g({}, r), t);
  return o && (i = o(i)), i;
};
function _v(e, t) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : oe({});
  const o = Ur(), r = E(() => g({}, ...t.value)), i = E(() => Ir(r.value)), a = E(() => Ir(n.value.override || Ts));
  return Rd("token", E(() => [n.value.salt || "", e.value.id, i.value, a.value]), () => {
    const {
      salt: c = "",
      override: s = Ts,
      formatToken: d,
      getComputedToken: u
    } = n.value, f = u ? u(r.value, s, e.value) : $v(r.value, s, e.value, d), p = vv(f, c);
    f._tokenKey = p, wv(p);
    const h = `${Sv}-${Ya(p)}`;
    return f._hashId = h, [f, h];
  }, (c) => {
    var s;
    Ov(c[0]._tokenKey, (s = o.value) === null || s === void 0 ? void 0 : s.cache.instanceId);
  });
}
var Ev = {
  animationIterationCount: 1,
  aspectRatio: 1,
  borderImageOutset: 1,
  borderImageSlice: 1,
  borderImageWidth: 1,
  boxFlex: 1,
  boxFlexGroup: 1,
  boxOrdinalGroup: 1,
  columnCount: 1,
  columns: 1,
  flex: 1,
  flexGrow: 1,
  flexPositive: 1,
  flexShrink: 1,
  flexNegative: 1,
  flexOrder: 1,
  gridRow: 1,
  gridRowEnd: 1,
  gridRowSpan: 1,
  gridRowStart: 1,
  gridColumn: 1,
  gridColumnEnd: 1,
  gridColumnSpan: 1,
  gridColumnStart: 1,
  msGridRow: 1,
  msGridRowSpan: 1,
  msGridColumn: 1,
  msGridColumnSpan: 1,
  fontWeight: 1,
  lineHeight: 1,
  opacity: 1,
  order: 1,
  orphans: 1,
  tabSize: 1,
  widows: 1,
  zIndex: 1,
  zoom: 1,
  WebkitLineClamp: 1,
  // SVG-related properties
  fillOpacity: 1,
  floodOpacity: 1,
  stopOpacity: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1,
  strokeMiterlimit: 1,
  strokeOpacity: 1,
  strokeWidth: 1
}, Xd = "comm", Gd = "rule", kd = "decl", Tv = "@import", Pv = "@keyframes", Iv = "@layer", Mv = Math.abs, qa = String.fromCharCode;
function Yd(e) {
  return e.trim();
}
function lr(e, t, n) {
  return e.replace(t, n);
}
function Nv(e, t) {
  return e.indexOf(t);
}
function go(e, t) {
  return e.charCodeAt(t) | 0;
}
function mo(e, t, n) {
  return e.slice(t, n);
}
function St(e) {
  return e.length;
}
function Av(e) {
  return e.length;
}
function ko(e, t) {
  return t.push(e), e;
}
var Gr = 1, Pn = 1, qd = 0, qe = 0, be = 0, Rn = "";
function Qa(e, t, n, o, r, i, a, l) {
  return { value: e, root: t, parent: n, type: o, props: r, children: i, line: Gr, column: Pn, length: a, return: "", siblings: l };
}
function Dv() {
  return be;
}
function Rv() {
  return be = qe > 0 ? go(Rn, --qe) : 0, Pn--, be === 10 && (Pn = 1, Gr--), be;
}
function nt() {
  return be = qe < qd ? go(Rn, qe++) : 0, Pn++, be === 10 && (Pn = 1, Gr++), be;
}
function nn() {
  return go(Rn, qe);
}
function sr() {
  return qe;
}
function kr(e, t) {
  return mo(Rn, e, t);
}
function na(e) {
  switch (e) {
    case 0:
    case 9:
    case 10:
    case 13:
    case 32:
      return 5;
    case 33:
    case 43:
    case 44:
    case 47:
    case 62:
    case 64:
    case 126:
    case 59:
    case 123:
    case 125:
      return 4;
    case 58:
      return 3;
    case 34:
    case 39:
    case 40:
    case 91:
      return 2;
    case 41:
    case 93:
      return 1;
  }
  return 0;
}
function Hv(e) {
  return Gr = Pn = 1, qd = St(Rn = e), qe = 0, [];
}
function Fv(e) {
  return Rn = "", e;
}
function mi(e) {
  return Yd(kr(qe - 1, oa(e === 91 ? e + 2 : e === 40 ? e + 1 : e)));
}
function zv(e) {
  for (; (be = nn()) && be < 33; )
    nt();
  return na(e) > 2 || na(be) > 3 ? "" : " ";
}
function Lv(e, t) {
  for (; --t && nt() && !(be < 48 || be > 102 || be > 57 && be < 65 || be > 70 && be < 97); )
    ;
  return kr(e, sr() + (t < 6 && nn() == 32 && nt() == 32));
}
function oa(e) {
  for (; nt(); )
    switch (be) {
      case e:
        return qe;
      case 34:
      case 39:
        e !== 34 && e !== 39 && oa(be);
        break;
      case 40:
        e === 41 && oa(e);
        break;
      case 92:
        nt();
        break;
    }
  return qe;
}
function jv(e, t) {
  for (; nt() && e + be !== 47 + 10; )
    if (e + be === 42 + 42 && nn() === 47)
      break;
  return "/*" + kr(t, qe - 1) + "*" + qa(e === 47 ? e : nt());
}
function Bv(e) {
  for (; !na(nn()); )
    nt();
  return kr(e, qe);
}
function Vv(e) {
  return Fv(cr("", null, null, null, [""], e = Hv(e), 0, [0], e));
}
function cr(e, t, n, o, r, i, a, l, c) {
  for (var s = 0, d = 0, u = a, f = 0, p = 0, h = 0, m = 1, w = 1, y = 1, S = 0, _ = "", C = r, x = i, O = o, b = _; w; )
    switch (h = S, S = nt()) {
      case 40:
        if (h != 108 && go(b, u - 1) == 58) {
          Nv(b += lr(mi(S), "&", "&\f"), "&\f") != -1 && (y = -1);
          break;
        }
      case 34:
      case 39:
      case 91:
        b += mi(S);
        break;
      case 9:
      case 10:
      case 13:
      case 32:
        b += zv(h);
        break;
      case 92:
        b += Lv(sr() - 1, 7);
        continue;
      case 47:
        switch (nn()) {
          case 42:
          case 47:
            ko(Wv(jv(nt(), sr()), t, n, c), c);
            break;
          default:
            b += "/";
        }
        break;
      case 123 * m:
        l[s++] = St(b) * y;
      case 125 * m:
      case 59:
      case 0:
        switch (S) {
          case 0:
          case 125:
            w = 0;
          case 59 + d:
            y == -1 && (b = lr(b, /\f/g, "")), p > 0 && St(b) - u && ko(p > 32 ? Is(b + ";", o, n, u - 1, c) : Is(lr(b, " ", "") + ";", o, n, u - 2, c), c);
            break;
          case 59:
            b += ";";
          default:
            if (ko(O = Ps(b, t, n, s, d, r, l, _, C = [], x = [], u, i), i), S === 123)
              if (d === 0)
                cr(b, t, O, O, C, i, u, l, x);
              else
                switch (f === 99 && go(b, 3) === 110 ? 100 : f) {
                  case 100:
                  case 108:
                  case 109:
                  case 115:
                    cr(e, O, O, o && ko(Ps(e, O, O, 0, 0, r, l, _, r, C = [], u, x), x), r, x, u, l, o ? C : x);
                    break;
                  default:
                    cr(b, O, O, O, [""], x, 0, l, x);
                }
        }
        s = d = p = 0, m = y = 1, _ = b = "", u = a;
        break;
      case 58:
        u = 1 + St(b), p = h;
      default:
        if (m < 1) {
          if (S == 123)
            --m;
          else if (S == 125 && m++ == 0 && Rv() == 125)
            continue;
        }
        switch (b += qa(S), S * m) {
          case 38:
            y = d > 0 ? 1 : (b += "\f", -1);
            break;
          case 44:
            l[s++] = (St(b) - 1) * y, y = 1;
            break;
          case 64:
            nn() === 45 && (b += mi(nt())), f = nn(), d = u = St(_ = b += Bv(sr())), S++;
            break;
          case 45:
            h === 45 && St(b) == 2 && (m = 0);
        }
    }
  return i;
}
function Ps(e, t, n, o, r, i, a, l, c, s, d, u) {
  for (var f = r - 1, p = r === 0 ? i : [""], h = Av(p), m = 0, w = 0, y = 0; m < o; ++m)
    for (var S = 0, _ = mo(e, f + 1, f = Mv(w = a[m])), C = e; S < h; ++S)
      (C = Yd(w > 0 ? p[S] + " " + _ : lr(_, /&\f/g, p[S]))) && (c[y++] = C);
  return Qa(e, t, n, r === 0 ? Gd : l, c, s, d, u);
}
function Wv(e, t, n, o) {
  return Qa(e, t, n, Xd, qa(Dv()), mo(e, 2, -2), 0, o);
}
function Is(e, t, n, o, r) {
  return Qa(e, t, n, kd, mo(e, 0, o), mo(e, o + 1, -1), o, r);
}
function ra(e, t) {
  for (var n = "", o = 0; o < e.length; o++)
    n += t(e[o], o, e, t) || "";
  return n;
}
function Kv(e, t, n, o) {
  switch (e.type) {
    case Iv:
      if (e.children.length)
        break;
    case Tv:
    case kd:
      return e.return = e.return || e.value;
    case Xd:
      return "";
    case Pv:
      return e.return = e.value + "{" + ra(e.children, o) + "}";
    case Gd:
      if (!St(e.value = e.props.join(",")))
        return "";
  }
  return St(n = ra(e.children, o)) ? e.return = e.value + "{" + n + "}" : "";
}
function Qd(e, t) {
  const {
    path: n,
    parentSelectors: o
  } = t;
  Xe(!1, `[Ant Design Vue CSS-in-JS] ${n ? `Error in '${n}': ` : ""}${e}${o.length ? ` Selector info: ${o.join(" -> ")}` : ""}`);
}
const Uv = (e, t, n) => {
  if (e === "content") {
    const o = /(attr|counters?|url|(((repeating-)?(linear|radial))|conic)-gradient)\(|(no-)?(open|close)-quote/;
    (typeof t != "string" || ["normal", "none", "initial", "inherit", "unset"].indexOf(t) === -1 && !o.test(t) && (t.charAt(0) !== t.charAt(t.length - 1) || t.charAt(0) !== '"' && t.charAt(0) !== "'")) && Qd(`You seem to be using a value for 'content' without quotes, try replacing it with \`content: '"${t}"'\`.`, n);
  }
}, Xv = Uv, Gv = (e, t, n) => {
  e === "animation" && n.hashId && t !== "none" && Qd(`You seem to be using hashed animation '${t}', in which case 'animationName' with Keyframe as value is recommended.`, n);
}, kv = Gv, Ms = "data-ant-cssinjs-cache-path", Yv = "_FILE_STYLE__";
let on, Jd = !0;
function qv() {
  var e;
  if (!on && (on = {}, pt())) {
    const t = document.createElement("div");
    t.className = Ms, t.style.position = "fixed", t.style.visibility = "hidden", t.style.top = "-9999px", document.body.appendChild(t);
    let n = getComputedStyle(t).content || "";
    n = n.replace(/^"/, "").replace(/"$/, ""), n.split(";").forEach((r) => {
      const [i, a] = r.split(":");
      on[i] = a;
    });
    const o = document.querySelector(`style[${Ms}]`);
    o && (Jd = !1, (e = o.parentNode) === null || e === void 0 || e.removeChild(o)), document.body.removeChild(t);
  }
}
function Qv(e) {
  return qv(), !!on[e];
}
function Jv(e) {
  const t = on[e];
  let n = null;
  if (t && pt())
    if (Jd)
      n = Yv;
    else {
      const o = document.querySelector(`style[${tn}="${on[e]}"]`);
      o ? n = o.innerHTML : delete on[e];
    }
  return [n, t];
}
const Ns = pt(), Zd = "_skip_check_", ef = "_multi_value_";
function As(e) {
  return ra(Vv(e), Kv).replace(/\{%%%\:[^;];}/g, ";");
}
function Zv(e) {
  return typeof e == "object" && e && (Zd in e || ef in e);
}
function e0(e, t, n) {
  if (!t)
    return e;
  const o = `.${t}`, r = n === "low" ? `:where(${o})` : o;
  return e.split(",").map((a) => {
    var l;
    const c = a.trim().split(/\s+/);
    let s = c[0] || "";
    const d = ((l = s.match(/^\w+/)) === null || l === void 0 ? void 0 : l[0]) || "";
    return s = `${d}${r}${s.slice(d.length)}`, [s, ...c.slice(1)].join(" ");
  }).join(",");
}
const ia = /* @__PURE__ */ new Set();
process.env.NODE_ENV;
const aa = function(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, {
    root: n,
    injectHash: o,
    parentSelectors: r
  } = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {
    root: !0,
    parentSelectors: []
  };
  const {
    hashId: i,
    layer: a,
    path: l,
    hashPriority: c,
    transformers: s = [],
    linters: d = []
  } = t;
  let u = "", f = {};
  function p(w) {
    const y = w.getName(i);
    if (!f[y]) {
      const [S] = aa(w.style, t, {
        root: !1,
        parentSelectors: r
      });
      f[y] = `@keyframes ${w.getName(i)}${S}`;
    }
  }
  function h(w) {
    let y = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
    return w.forEach((S) => {
      Array.isArray(S) ? h(S, y) : S && y.push(S);
    }), y;
  }
  if (h(Array.isArray(e) ? e : [e]).forEach((w) => {
    const y = typeof w == "string" && !n ? {} : w;
    if (typeof y == "string")
      u += `${y}
`;
    else if (y._keyframe)
      p(y);
    else {
      const S = s.reduce((_, C) => {
        var x;
        return ((x = C == null ? void 0 : C.visit) === null || x === void 0 ? void 0 : x.call(C, _)) || _;
      }, y);
      Object.keys(S).forEach((_) => {
        var C;
        const x = S[_];
        if (typeof x == "object" && x && (_ !== "animationName" || !x._keyframe) && !Zv(x)) {
          let O = !1, b = _.trim(), $ = !1;
          (n || o) && i ? b.startsWith("@") ? O = !0 : b = e0(_, i, c) : n && !i && (b === "&" || b === "") && (b = "", $ = !0);
          const [T, R] = aa(x, t, {
            root: $,
            injectHash: O,
            parentSelectors: [...r, b]
          });
          f = g(g({}, f), R), u += `${b}${T}`;
        } else {
          let O = function($, T) {
            process.env.NODE_ENV !== "production" && (typeof x != "object" || !(x != null && x[Zd])) && [Xv, kv, ...d].forEach((N) => N($, T, {
              path: l,
              hashId: i,
              parentSelectors: r
            }));
            const R = $.replace(/[A-Z]/g, (N) => `-${N.toLowerCase()}`);
            let H = T;
            !Ev[$] && typeof H == "number" && H !== 0 && (H = `${H}px`), $ === "animationName" && (T != null && T._keyframe) && (p(T), H = T.getName(i)), u += `${R}:${H};`;
          };
          const b = (C = x == null ? void 0 : x.value) !== null && C !== void 0 ? C : x;
          typeof x == "object" && (x != null && x[ef]) && Array.isArray(b) ? b.forEach(($) => {
            O(_, $);
          }) : O(_, b);
        }
      });
    }
  }), !n)
    u = `{${u}}`;
  else if (a && yv()) {
    const w = a.split(",");
    u = `@layer ${w[w.length - 1].trim()} {${u}}`, w.length > 1 && (u = `@layer ${a}{%%%:%}${u}`);
  }
  return [u, f];
};
function t0(e, t) {
  return Ya(`${e.join("%")}${t}`);
}
function Ds(e, t) {
  const n = Ur(), o = E(() => e.value.token._tokenKey), r = E(() => [o.value, ...e.value.path]);
  let i = Ns;
  return process.env.NODE_ENV !== "production" && n.value.mock !== void 0 && (i = n.value.mock === "client"), Rd(
    "style",
    r,
    // Create cache if needed
    () => {
      const {
        path: a,
        hashId: l,
        layer: c,
        nonce: s,
        clientOnly: d,
        order: u = 0
      } = e.value, f = r.value.join("|");
      if (Qv(f)) {
        const [b, $] = Jv(f);
        if (b)
          return [b, o.value, $, {}, d, u];
      }
      const p = t(), {
        hashPriority: h,
        container: m,
        transformers: w,
        linters: y,
        cache: S
      } = n.value, [_, C] = aa(p, {
        hashId: l,
        hashPriority: h,
        layer: c,
        path: a.join("-"),
        transformers: w,
        linters: y
      }), x = As(_), O = t0(r.value, x);
      if (i) {
        const b = {
          mark: tn,
          prepend: "queue",
          attachTo: m,
          priority: u
        }, $ = typeof s == "function" ? s() : s;
        $ && (b.csp = {
          nonce: $
        });
        const T = Pr(x, O, b);
        T[Sn] = S.instanceId, T.setAttribute(Nd, o.value), process.env.NODE_ENV !== "production" && T.setAttribute(nv, r.value.join("|")), Object.keys(C).forEach((R) => {
          ia.has(R) || (ia.add(R), Pr(As(C[R]), `_effect-${R}`, {
            mark: tn,
            prepend: "queue",
            attachTo: m
          }));
        });
      }
      return [x, o.value, O, C, d, u];
    },
    // Remove cache if no need
    (a, l) => {
      let [, , c] = a;
      (l || n.value.autoClear) && Ns && Tr(c, {
        mark: tn
      });
    }
  ), (a) => a;
}
class n0 {
  constructor(t, n) {
    this._keyframe = !0, this.name = t, this.style = n;
  }
  getName() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
    return t ? `${t}-${this.name}` : this.name;
  }
}
const $e = n0, o0 = "4.0.7";
function Ee(e, t) {
  r0(e) && (e = "100%");
  var n = i0(e);
  return e = t === 360 ? e : Math.min(t, Math.max(0, parseFloat(e))), n && (e = parseInt(String(e * t), 10) / 100), Math.abs(e - t) < 1e-6 ? 1 : (t === 360 ? e = (e < 0 ? e % t + t : e % t) / parseFloat(String(t)) : e = e % t / parseFloat(String(t)), e);
}
function Yo(e) {
  return Math.min(1, Math.max(0, e));
}
function r0(e) {
  return typeof e == "string" && e.indexOf(".") !== -1 && parseFloat(e) === 1;
}
function i0(e) {
  return typeof e == "string" && e.indexOf("%") !== -1;
}
function tf(e) {
  return e = parseFloat(e), (isNaN(e) || e < 0 || e > 1) && (e = 1), e;
}
function qo(e) {
  return e <= 1 ? "".concat(Number(e) * 100, "%") : e;
}
function qt(e) {
  return e.length === 1 ? "0" + e : String(e);
}
function a0(e, t, n) {
  return {
    r: Ee(e, 255) * 255,
    g: Ee(t, 255) * 255,
    b: Ee(n, 255) * 255
  };
}
function Rs(e, t, n) {
  e = Ee(e, 255), t = Ee(t, 255), n = Ee(n, 255);
  var o = Math.max(e, t, n), r = Math.min(e, t, n), i = 0, a = 0, l = (o + r) / 2;
  if (o === r)
    a = 0, i = 0;
  else {
    var c = o - r;
    switch (a = l > 0.5 ? c / (2 - o - r) : c / (o + r), o) {
      case e:
        i = (t - n) / c + (t < n ? 6 : 0);
        break;
      case t:
        i = (n - e) / c + 2;
        break;
      case n:
        i = (e - t) / c + 4;
        break;
    }
    i /= 6;
  }
  return { h: i, s: a, l };
}
function vi(e, t, n) {
  return n < 0 && (n += 1), n > 1 && (n -= 1), n < 1 / 6 ? e + (t - e) * (6 * n) : n < 1 / 2 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e;
}
function l0(e, t, n) {
  var o, r, i;
  if (e = Ee(e, 360), t = Ee(t, 100), n = Ee(n, 100), t === 0)
    r = n, i = n, o = n;
  else {
    var a = n < 0.5 ? n * (1 + t) : n + t - n * t, l = 2 * n - a;
    o = vi(l, a, e + 1 / 3), r = vi(l, a, e), i = vi(l, a, e - 1 / 3);
  }
  return { r: o * 255, g: r * 255, b: i * 255 };
}
function la(e, t, n) {
  e = Ee(e, 255), t = Ee(t, 255), n = Ee(n, 255);
  var o = Math.max(e, t, n), r = Math.min(e, t, n), i = 0, a = o, l = o - r, c = o === 0 ? 0 : l / o;
  if (o === r)
    i = 0;
  else {
    switch (o) {
      case e:
        i = (t - n) / l + (t < n ? 6 : 0);
        break;
      case t:
        i = (n - e) / l + 2;
        break;
      case n:
        i = (e - t) / l + 4;
        break;
    }
    i /= 6;
  }
  return { h: i, s: c, v: a };
}
function s0(e, t, n) {
  e = Ee(e, 360) * 6, t = Ee(t, 100), n = Ee(n, 100);
  var o = Math.floor(e), r = e - o, i = n * (1 - t), a = n * (1 - r * t), l = n * (1 - (1 - r) * t), c = o % 6, s = [n, a, i, i, l, n][c], d = [l, n, n, a, i, i][c], u = [i, i, l, n, n, a][c];
  return { r: s * 255, g: d * 255, b: u * 255 };
}
function sa(e, t, n, o) {
  var r = [
    qt(Math.round(e).toString(16)),
    qt(Math.round(t).toString(16)),
    qt(Math.round(n).toString(16))
  ];
  return o && r[0].startsWith(r[0].charAt(1)) && r[1].startsWith(r[1].charAt(1)) && r[2].startsWith(r[2].charAt(1)) ? r[0].charAt(0) + r[1].charAt(0) + r[2].charAt(0) : r.join("");
}
function c0(e, t, n, o, r) {
  var i = [
    qt(Math.round(e).toString(16)),
    qt(Math.round(t).toString(16)),
    qt(Math.round(n).toString(16)),
    qt(u0(o))
  ];
  return r && i[0].startsWith(i[0].charAt(1)) && i[1].startsWith(i[1].charAt(1)) && i[2].startsWith(i[2].charAt(1)) && i[3].startsWith(i[3].charAt(1)) ? i[0].charAt(0) + i[1].charAt(0) + i[2].charAt(0) + i[3].charAt(0) : i.join("");
}
function u0(e) {
  return Math.round(parseFloat(e) * 255).toString(16);
}
function Hs(e) {
  return Be(e) / 255;
}
function Be(e) {
  return parseInt(e, 16);
}
function d0(e) {
  return {
    r: e >> 16,
    g: (e & 65280) >> 8,
    b: e & 255
  };
}
var ca = {
  aliceblue: "#f0f8ff",
  antiquewhite: "#faebd7",
  aqua: "#00ffff",
  aquamarine: "#7fffd4",
  azure: "#f0ffff",
  beige: "#f5f5dc",
  bisque: "#ffe4c4",
  black: "#000000",
  blanchedalmond: "#ffebcd",
  blue: "#0000ff",
  blueviolet: "#8a2be2",
  brown: "#a52a2a",
  burlywood: "#deb887",
  cadetblue: "#5f9ea0",
  chartreuse: "#7fff00",
  chocolate: "#d2691e",
  coral: "#ff7f50",
  cornflowerblue: "#6495ed",
  cornsilk: "#fff8dc",
  crimson: "#dc143c",
  cyan: "#00ffff",
  darkblue: "#00008b",
  darkcyan: "#008b8b",
  darkgoldenrod: "#b8860b",
  darkgray: "#a9a9a9",
  darkgreen: "#006400",
  darkgrey: "#a9a9a9",
  darkkhaki: "#bdb76b",
  darkmagenta: "#8b008b",
  darkolivegreen: "#556b2f",
  darkorange: "#ff8c00",
  darkorchid: "#9932cc",
  darkred: "#8b0000",
  darksalmon: "#e9967a",
  darkseagreen: "#8fbc8f",
  darkslateblue: "#483d8b",
  darkslategray: "#2f4f4f",
  darkslategrey: "#2f4f4f",
  darkturquoise: "#00ced1",
  darkviolet: "#9400d3",
  deeppink: "#ff1493",
  deepskyblue: "#00bfff",
  dimgray: "#696969",
  dimgrey: "#696969",
  dodgerblue: "#1e90ff",
  firebrick: "#b22222",
  floralwhite: "#fffaf0",
  forestgreen: "#228b22",
  fuchsia: "#ff00ff",
  gainsboro: "#dcdcdc",
  ghostwhite: "#f8f8ff",
  goldenrod: "#daa520",
  gold: "#ffd700",
  gray: "#808080",
  green: "#008000",
  greenyellow: "#adff2f",
  grey: "#808080",
  honeydew: "#f0fff0",
  hotpink: "#ff69b4",
  indianred: "#cd5c5c",
  indigo: "#4b0082",
  ivory: "#fffff0",
  khaki: "#f0e68c",
  lavenderblush: "#fff0f5",
  lavender: "#e6e6fa",
  lawngreen: "#7cfc00",
  lemonchiffon: "#fffacd",
  lightblue: "#add8e6",
  lightcoral: "#f08080",
  lightcyan: "#e0ffff",
  lightgoldenrodyellow: "#fafad2",
  lightgray: "#d3d3d3",
  lightgreen: "#90ee90",
  lightgrey: "#d3d3d3",
  lightpink: "#ffb6c1",
  lightsalmon: "#ffa07a",
  lightseagreen: "#20b2aa",
  lightskyblue: "#87cefa",
  lightslategray: "#778899",
  lightslategrey: "#778899",
  lightsteelblue: "#b0c4de",
  lightyellow: "#ffffe0",
  lime: "#00ff00",
  limegreen: "#32cd32",
  linen: "#faf0e6",
  magenta: "#ff00ff",
  maroon: "#800000",
  mediumaquamarine: "#66cdaa",
  mediumblue: "#0000cd",
  mediumorchid: "#ba55d3",
  mediumpurple: "#9370db",
  mediumseagreen: "#3cb371",
  mediumslateblue: "#7b68ee",
  mediumspringgreen: "#00fa9a",
  mediumturquoise: "#48d1cc",
  mediumvioletred: "#c71585",
  midnightblue: "#191970",
  mintcream: "#f5fffa",
  mistyrose: "#ffe4e1",
  moccasin: "#ffe4b5",
  navajowhite: "#ffdead",
  navy: "#000080",
  oldlace: "#fdf5e6",
  olive: "#808000",
  olivedrab: "#6b8e23",
  orange: "#ffa500",
  orangered: "#ff4500",
  orchid: "#da70d6",
  palegoldenrod: "#eee8aa",
  palegreen: "#98fb98",
  paleturquoise: "#afeeee",
  palevioletred: "#db7093",
  papayawhip: "#ffefd5",
  peachpuff: "#ffdab9",
  peru: "#cd853f",
  pink: "#ffc0cb",
  plum: "#dda0dd",
  powderblue: "#b0e0e6",
  purple: "#800080",
  rebeccapurple: "#663399",
  red: "#ff0000",
  rosybrown: "#bc8f8f",
  royalblue: "#4169e1",
  saddlebrown: "#8b4513",
  salmon: "#fa8072",
  sandybrown: "#f4a460",
  seagreen: "#2e8b57",
  seashell: "#fff5ee",
  sienna: "#a0522d",
  silver: "#c0c0c0",
  skyblue: "#87ceeb",
  slateblue: "#6a5acd",
  slategray: "#708090",
  slategrey: "#708090",
  snow: "#fffafa",
  springgreen: "#00ff7f",
  steelblue: "#4682b4",
  tan: "#d2b48c",
  teal: "#008080",
  thistle: "#d8bfd8",
  tomato: "#ff6347",
  turquoise: "#40e0d0",
  violet: "#ee82ee",
  wheat: "#f5deb3",
  white: "#ffffff",
  whitesmoke: "#f5f5f5",
  yellow: "#ffff00",
  yellowgreen: "#9acd32"
};
function bn(e) {
  var t = { r: 0, g: 0, b: 0 }, n = 1, o = null, r = null, i = null, a = !1, l = !1;
  return typeof e == "string" && (e = h0(e)), typeof e == "object" && (vt(e.r) && vt(e.g) && vt(e.b) ? (t = a0(e.r, e.g, e.b), a = !0, l = String(e.r).substr(-1) === "%" ? "prgb" : "rgb") : vt(e.h) && vt(e.s) && vt(e.v) ? (o = qo(e.s), r = qo(e.v), t = s0(e.h, o, r), a = !0, l = "hsv") : vt(e.h) && vt(e.s) && vt(e.l) && (o = qo(e.s), i = qo(e.l), t = l0(e.h, o, i), a = !0, l = "hsl"), Object.prototype.hasOwnProperty.call(e, "a") && (n = e.a)), n = tf(n), {
    ok: a,
    format: e.format || l,
    r: Math.min(255, Math.max(t.r, 0)),
    g: Math.min(255, Math.max(t.g, 0)),
    b: Math.min(255, Math.max(t.b, 0)),
    a: n
  };
}
var f0 = "[-\\+]?\\d+%?", p0 = "[-\\+]?\\d*\\.\\d+%?", Nt = "(?:".concat(p0, ")|(?:").concat(f0, ")"), bi = "[\\s|\\(]+(".concat(Nt, ")[,|\\s]+(").concat(Nt, ")[,|\\s]+(").concat(Nt, ")\\s*\\)?"), yi = "[\\s|\\(]+(".concat(Nt, ")[,|\\s]+(").concat(Nt, ")[,|\\s]+(").concat(Nt, ")[,|\\s]+(").concat(Nt, ")\\s*\\)?"), Qe = {
  CSS_UNIT: new RegExp(Nt),
  rgb: new RegExp("rgb" + bi),
  rgba: new RegExp("rgba" + yi),
  hsl: new RegExp("hsl" + bi),
  hsla: new RegExp("hsla" + yi),
  hsv: new RegExp("hsv" + bi),
  hsva: new RegExp("hsva" + yi),
  hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
  hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
  hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
  hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
};
function h0(e) {
  if (e = e.trim().toLowerCase(), e.length === 0)
    return !1;
  var t = !1;
  if (ca[e])
    e = ca[e], t = !0;
  else if (e === "transparent")
    return { r: 0, g: 0, b: 0, a: 0, format: "name" };
  var n = Qe.rgb.exec(e);
  return n ? { r: n[1], g: n[2], b: n[3] } : (n = Qe.rgba.exec(e), n ? { r: n[1], g: n[2], b: n[3], a: n[4] } : (n = Qe.hsl.exec(e), n ? { h: n[1], s: n[2], l: n[3] } : (n = Qe.hsla.exec(e), n ? { h: n[1], s: n[2], l: n[3], a: n[4] } : (n = Qe.hsv.exec(e), n ? { h: n[1], s: n[2], v: n[3] } : (n = Qe.hsva.exec(e), n ? { h: n[1], s: n[2], v: n[3], a: n[4] } : (n = Qe.hex8.exec(e), n ? {
    r: Be(n[1]),
    g: Be(n[2]),
    b: Be(n[3]),
    a: Hs(n[4]),
    format: t ? "name" : "hex8"
  } : (n = Qe.hex6.exec(e), n ? {
    r: Be(n[1]),
    g: Be(n[2]),
    b: Be(n[3]),
    format: t ? "name" : "hex"
  } : (n = Qe.hex4.exec(e), n ? {
    r: Be(n[1] + n[1]),
    g: Be(n[2] + n[2]),
    b: Be(n[3] + n[3]),
    a: Hs(n[4] + n[4]),
    format: t ? "name" : "hex8"
  } : (n = Qe.hex3.exec(e), n ? {
    r: Be(n[1] + n[1]),
    g: Be(n[2] + n[2]),
    b: Be(n[3] + n[3]),
    format: t ? "name" : "hex"
  } : !1)))))))));
}
function vt(e) {
  return !!Qe.CSS_UNIT.exec(String(e));
}
var He = (
  /** @class */
  function() {
    function e(t, n) {
      t === void 0 && (t = ""), n === void 0 && (n = {});
      var o;
      if (t instanceof e)
        return t;
      typeof t == "number" && (t = d0(t)), this.originalInput = t;
      var r = bn(t);
      this.originalInput = t, this.r = r.r, this.g = r.g, this.b = r.b, this.a = r.a, this.roundA = Math.round(100 * this.a) / 100, this.format = (o = n.format) !== null && o !== void 0 ? o : r.format, this.gradientType = n.gradientType, this.r < 1 && (this.r = Math.round(this.r)), this.g < 1 && (this.g = Math.round(this.g)), this.b < 1 && (this.b = Math.round(this.b)), this.isValid = r.ok;
    }
    return e.prototype.isDark = function() {
      return this.getBrightness() < 128;
    }, e.prototype.isLight = function() {
      return !this.isDark();
    }, e.prototype.getBrightness = function() {
      var t = this.toRgb();
      return (t.r * 299 + t.g * 587 + t.b * 114) / 1e3;
    }, e.prototype.getLuminance = function() {
      var t = this.toRgb(), n, o, r, i = t.r / 255, a = t.g / 255, l = t.b / 255;
      return i <= 0.03928 ? n = i / 12.92 : n = Math.pow((i + 0.055) / 1.055, 2.4), a <= 0.03928 ? o = a / 12.92 : o = Math.pow((a + 0.055) / 1.055, 2.4), l <= 0.03928 ? r = l / 12.92 : r = Math.pow((l + 0.055) / 1.055, 2.4), 0.2126 * n + 0.7152 * o + 0.0722 * r;
    }, e.prototype.getAlpha = function() {
      return this.a;
    }, e.prototype.setAlpha = function(t) {
      return this.a = tf(t), this.roundA = Math.round(100 * this.a) / 100, this;
    }, e.prototype.isMonochrome = function() {
      var t = this.toHsl().s;
      return t === 0;
    }, e.prototype.toHsv = function() {
      var t = la(this.r, this.g, this.b);
      return { h: t.h * 360, s: t.s, v: t.v, a: this.a };
    }, e.prototype.toHsvString = function() {
      var t = la(this.r, this.g, this.b), n = Math.round(t.h * 360), o = Math.round(t.s * 100), r = Math.round(t.v * 100);
      return this.a === 1 ? "hsv(".concat(n, ", ").concat(o, "%, ").concat(r, "%)") : "hsva(".concat(n, ", ").concat(o, "%, ").concat(r, "%, ").concat(this.roundA, ")");
    }, e.prototype.toHsl = function() {
      var t = Rs(this.r, this.g, this.b);
      return { h: t.h * 360, s: t.s, l: t.l, a: this.a };
    }, e.prototype.toHslString = function() {
      var t = Rs(this.r, this.g, this.b), n = Math.round(t.h * 360), o = Math.round(t.s * 100), r = Math.round(t.l * 100);
      return this.a === 1 ? "hsl(".concat(n, ", ").concat(o, "%, ").concat(r, "%)") : "hsla(".concat(n, ", ").concat(o, "%, ").concat(r, "%, ").concat(this.roundA, ")");
    }, e.prototype.toHex = function(t) {
      return t === void 0 && (t = !1), sa(this.r, this.g, this.b, t);
    }, e.prototype.toHexString = function(t) {
      return t === void 0 && (t = !1), "#" + this.toHex(t);
    }, e.prototype.toHex8 = function(t) {
      return t === void 0 && (t = !1), c0(this.r, this.g, this.b, this.a, t);
    }, e.prototype.toHex8String = function(t) {
      return t === void 0 && (t = !1), "#" + this.toHex8(t);
    }, e.prototype.toHexShortString = function(t) {
      return t === void 0 && (t = !1), this.a === 1 ? this.toHexString(t) : this.toHex8String(t);
    }, e.prototype.toRgb = function() {
      return {
        r: Math.round(this.r),
        g: Math.round(this.g),
        b: Math.round(this.b),
        a: this.a
      };
    }, e.prototype.toRgbString = function() {
      var t = Math.round(this.r), n = Math.round(this.g), o = Math.round(this.b);
      return this.a === 1 ? "rgb(".concat(t, ", ").concat(n, ", ").concat(o, ")") : "rgba(".concat(t, ", ").concat(n, ", ").concat(o, ", ").concat(this.roundA, ")");
    }, e.prototype.toPercentageRgb = function() {
      var t = function(n) {
        return "".concat(Math.round(Ee(n, 255) * 100), "%");
      };
      return {
        r: t(this.r),
        g: t(this.g),
        b: t(this.b),
        a: this.a
      };
    }, e.prototype.toPercentageRgbString = function() {
      var t = function(n) {
        return Math.round(Ee(n, 255) * 100);
      };
      return this.a === 1 ? "rgb(".concat(t(this.r), "%, ").concat(t(this.g), "%, ").concat(t(this.b), "%)") : "rgba(".concat(t(this.r), "%, ").concat(t(this.g), "%, ").concat(t(this.b), "%, ").concat(this.roundA, ")");
    }, e.prototype.toName = function() {
      if (this.a === 0)
        return "transparent";
      if (this.a < 1)
        return !1;
      for (var t = "#" + sa(this.r, this.g, this.b, !1), n = 0, o = Object.entries(ca); n < o.length; n++) {
        var r = o[n], i = r[0], a = r[1];
        if (t === a)
          return i;
      }
      return !1;
    }, e.prototype.toString = function(t) {
      var n = !!t;
      t = t ?? this.format;
      var o = !1, r = this.a < 1 && this.a >= 0, i = !n && r && (t.startsWith("hex") || t === "name");
      return i ? t === "name" && this.a === 0 ? this.toName() : this.toRgbString() : (t === "rgb" && (o = this.toRgbString()), t === "prgb" && (o = this.toPercentageRgbString()), (t === "hex" || t === "hex6") && (o = this.toHexString()), t === "hex3" && (o = this.toHexString(!0)), t === "hex4" && (o = this.toHex8String(!0)), t === "hex8" && (o = this.toHex8String()), t === "name" && (o = this.toName()), t === "hsl" && (o = this.toHslString()), t === "hsv" && (o = this.toHsvString()), o || this.toHexString());
    }, e.prototype.toNumber = function() {
      return (Math.round(this.r) << 16) + (Math.round(this.g) << 8) + Math.round(this.b);
    }, e.prototype.clone = function() {
      return new e(this.toString());
    }, e.prototype.lighten = function(t) {
      t === void 0 && (t = 10);
      var n = this.toHsl();
      return n.l += t / 100, n.l = Yo(n.l), new e(n);
    }, e.prototype.brighten = function(t) {
      t === void 0 && (t = 10);
      var n = this.toRgb();
      return n.r = Math.max(0, Math.min(255, n.r - Math.round(255 * -(t / 100)))), n.g = Math.max(0, Math.min(255, n.g - Math.round(255 * -(t / 100)))), n.b = Math.max(0, Math.min(255, n.b - Math.round(255 * -(t / 100)))), new e(n);
    }, e.prototype.darken = function(t) {
      t === void 0 && (t = 10);
      var n = this.toHsl();
      return n.l -= t / 100, n.l = Yo(n.l), new e(n);
    }, e.prototype.tint = function(t) {
      return t === void 0 && (t = 10), this.mix("white", t);
    }, e.prototype.shade = function(t) {
      return t === void 0 && (t = 10), this.mix("black", t);
    }, e.prototype.desaturate = function(t) {
      t === void 0 && (t = 10);
      var n = this.toHsl();
      return n.s -= t / 100, n.s = Yo(n.s), new e(n);
    }, e.prototype.saturate = function(t) {
      t === void 0 && (t = 10);
      var n = this.toHsl();
      return n.s += t / 100, n.s = Yo(n.s), new e(n);
    }, e.prototype.greyscale = function() {
      return this.desaturate(100);
    }, e.prototype.spin = function(t) {
      var n = this.toHsl(), o = (n.h + t) % 360;
      return n.h = o < 0 ? 360 + o : o, new e(n);
    }, e.prototype.mix = function(t, n) {
      n === void 0 && (n = 50);
      var o = this.toRgb(), r = new e(t).toRgb(), i = n / 100, a = {
        r: (r.r - o.r) * i + o.r,
        g: (r.g - o.g) * i + o.g,
        b: (r.b - o.b) * i + o.b,
        a: (r.a - o.a) * i + o.a
      };
      return new e(a);
    }, e.prototype.analogous = function(t, n) {
      t === void 0 && (t = 6), n === void 0 && (n = 30);
      var o = this.toHsl(), r = 360 / n, i = [this];
      for (o.h = (o.h - (r * t >> 1) + 720) % 360; --t; )
        o.h = (o.h + r) % 360, i.push(new e(o));
      return i;
    }, e.prototype.complement = function() {
      var t = this.toHsl();
      return t.h = (t.h + 180) % 360, new e(t);
    }, e.prototype.monochromatic = function(t) {
      t === void 0 && (t = 6);
      for (var n = this.toHsv(), o = n.h, r = n.s, i = n.v, a = [], l = 1 / t; t--; )
        a.push(new e({ h: o, s: r, v: i })), i = (i + l) % 1;
      return a;
    }, e.prototype.splitcomplement = function() {
      var t = this.toHsl(), n = t.h;
      return [
        this,
        new e({ h: (n + 72) % 360, s: t.s, l: t.l }),
        new e({ h: (n + 216) % 360, s: t.s, l: t.l })
      ];
    }, e.prototype.onBackground = function(t) {
      var n = this.toRgb(), o = new e(t).toRgb(), r = n.a + o.a * (1 - n.a);
      return new e({
        r: (n.r * n.a + o.r * o.a * (1 - n.a)) / r,
        g: (n.g * n.a + o.g * o.a * (1 - n.a)) / r,
        b: (n.b * n.a + o.b * o.a * (1 - n.a)) / r,
        a: r
      });
    }, e.prototype.triad = function() {
      return this.polyad(3);
    }, e.prototype.tetrad = function() {
      return this.polyad(4);
    }, e.prototype.polyad = function(t) {
      for (var n = this.toHsl(), o = n.h, r = [this], i = 360 / t, a = 1; a < t; a++)
        r.push(new e({ h: (o + a * i) % 360, s: n.s, l: n.l }));
      return r;
    }, e.prototype.equals = function(t) {
      return this.toRgbString() === new e(t).toRgbString();
    }, e;
  }()
), Qo = 2, Fs = 0.16, g0 = 0.05, m0 = 0.05, v0 = 0.15, nf = 5, of = 4, b0 = [{
  index: 7,
  opacity: 0.15
}, {
  index: 6,
  opacity: 0.25
}, {
  index: 5,
  opacity: 0.3
}, {
  index: 5,
  opacity: 0.45
}, {
  index: 5,
  opacity: 0.65
}, {
  index: 5,
  opacity: 0.85
}, {
  index: 4,
  opacity: 0.9
}, {
  index: 3,
  opacity: 0.95
}, {
  index: 2,
  opacity: 0.97
}, {
  index: 1,
  opacity: 0.98
}];
function zs(e) {
  var t = e.r, n = e.g, o = e.b, r = la(t, n, o);
  return {
    h: r.h * 360,
    s: r.s,
    v: r.v
  };
}
function Jo(e) {
  var t = e.r, n = e.g, o = e.b;
  return "#".concat(sa(t, n, o, !1));
}
function y0(e, t, n) {
  var o = n / 100, r = {
    r: (t.r - e.r) * o + e.r,
    g: (t.g - e.g) * o + e.g,
    b: (t.b - e.b) * o + e.b
  };
  return r;
}
function Ls(e, t, n) {
  var o;
  return Math.round(e.h) >= 60 && Math.round(e.h) <= 240 ? o = n ? Math.round(e.h) - Qo * t : Math.round(e.h) + Qo * t : o = n ? Math.round(e.h) + Qo * t : Math.round(e.h) - Qo * t, o < 0 ? o += 360 : o >= 360 && (o -= 360), o;
}
function js(e, t, n) {
  if (e.h === 0 && e.s === 0)
    return e.s;
  var o;
  return n ? o = e.s - Fs * t : t === of ? o = e.s + Fs : o = e.s + g0 * t, o > 1 && (o = 1), n && t === nf && o > 0.1 && (o = 0.1), o < 0.06 && (o = 0.06), Number(o.toFixed(2));
}
function Bs(e, t, n) {
  var o;
  return n ? o = e.v + m0 * t : o = e.v - v0 * t, o > 1 && (o = 1), Number(o.toFixed(2));
}
function vo(e) {
  for (var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = [], o = bn(e), r = nf; r > 0; r -= 1) {
    var i = zs(o), a = Jo(bn({
      h: Ls(i, r, !0),
      s: js(i, r, !0),
      v: Bs(i, r, !0)
    }));
    n.push(a);
  }
  n.push(Jo(o));
  for (var l = 1; l <= of; l += 1) {
    var c = zs(o), s = Jo(bn({
      h: Ls(c, l),
      s: js(c, l),
      v: Bs(c, l)
    }));
    n.push(s);
  }
  return t.theme === "dark" ? b0.map(function(d) {
    var u = d.index, f = d.opacity, p = Jo(y0(bn(t.backgroundColor || "#141414"), bn(n[u]), f * 100));
    return p;
  }) : n;
}
var Si = {
  red: "#F5222D",
  volcano: "#FA541C",
  orange: "#FA8C16",
  gold: "#FAAD14",
  yellow: "#FADB14",
  lime: "#A0D911",
  green: "#52C41A",
  cyan: "#13C2C2",
  blue: "#1890FF",
  geekblue: "#2F54EB",
  purple: "#722ED1",
  magenta: "#EB2F96",
  grey: "#666666"
}, ur = {}, wi = {};
Object.keys(Si).forEach(function(e) {
  ur[e] = vo(Si[e]), ur[e].primary = ur[e][5], wi[e] = vo(Si[e], {
    theme: "dark",
    backgroundColor: "#141414"
  }), wi[e].primary = wi[e][5];
});
var S0 = ur.blue;
const w0 = (e) => {
  const {
    controlHeight: t
  } = e;
  return {
    controlHeightSM: t * 0.75,
    controlHeightXS: t * 0.5,
    controlHeightLG: t * 1.25
  };
}, C0 = w0;
function x0(e) {
  const {
    sizeUnit: t,
    sizeStep: n
  } = e;
  return {
    sizeXXL: t * (n + 8),
    sizeXL: t * (n + 4),
    sizeLG: t * (n + 2),
    sizeMD: t * (n + 1),
    sizeMS: t * n,
    size: t * n,
    sizeSM: t * (n - 1),
    sizeXS: t * (n - 2),
    sizeXXS: t * (n - 3)
    // 4
  };
}
const rf = {
  blue: "#1677ff",
  purple: "#722ED1",
  cyan: "#13C2C2",
  green: "#52C41A",
  magenta: "#EB2F96",
  pink: "#eb2f96",
  red: "#F5222D",
  orange: "#FA8C16",
  yellow: "#FADB14",
  volcano: "#FA541C",
  geekblue: "#2F54EB",
  gold: "#FAAD14",
  lime: "#A0D911"
}, O0 = g(g({}, rf), {
  // Color
  colorPrimary: "#1677ff",
  colorSuccess: "#52c41a",
  colorWarning: "#faad14",
  colorError: "#ff4d4f",
  colorInfo: "#1677ff",
  colorTextBase: "",
  colorBgBase: "",
  // Font
  fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
'Noto Color Emoji'`,
  fontSize: 14,
  // Line
  lineWidth: 1,
  lineType: "solid",
  // Motion
  motionUnit: 0.1,
  motionBase: 0,
  motionEaseOutCirc: "cubic-bezier(0.08, 0.82, 0.17, 1)",
  motionEaseInOutCirc: "cubic-bezier(0.78, 0.14, 0.15, 0.86)",
  motionEaseOut: "cubic-bezier(0.215, 0.61, 0.355, 1)",
  motionEaseInOut: "cubic-bezier(0.645, 0.045, 0.355, 1)",
  motionEaseOutBack: "cubic-bezier(0.12, 0.4, 0.29, 1.46)",
  motionEaseInBack: "cubic-bezier(0.71, -0.46, 0.88, 0.6)",
  motionEaseInQuint: "cubic-bezier(0.755, 0.05, 0.855, 0.06)",
  motionEaseOutQuint: "cubic-bezier(0.23, 1, 0.32, 1)",
  // Radius
  borderRadius: 6,
  // Size
  sizeUnit: 4,
  sizeStep: 4,
  sizePopupArrow: 16,
  // Control Base
  controlHeight: 32,
  // zIndex
  zIndexBase: 0,
  zIndexPopupBase: 1e3,
  // Image
  opacityImage: 1,
  // Wireframe
  wireframe: !1
}), Ja = O0;
function $0(e, t) {
  let {
    generateColorPalettes: n,
    generateNeutralColorPalettes: o
  } = t;
  const {
    colorSuccess: r,
    colorWarning: i,
    colorError: a,
    colorInfo: l,
    colorPrimary: c,
    colorBgBase: s,
    colorTextBase: d
  } = e, u = n(c), f = n(r), p = n(i), h = n(a), m = n(l), w = o(s, d);
  return g(g({}, w), {
    colorPrimaryBg: u[1],
    colorPrimaryBgHover: u[2],
    colorPrimaryBorder: u[3],
    colorPrimaryBorderHover: u[4],
    colorPrimaryHover: u[5],
    colorPrimary: u[6],
    colorPrimaryActive: u[7],
    colorPrimaryTextHover: u[8],
    colorPrimaryText: u[9],
    colorPrimaryTextActive: u[10],
    colorSuccessBg: f[1],
    colorSuccessBgHover: f[2],
    colorSuccessBorder: f[3],
    colorSuccessBorderHover: f[4],
    colorSuccessHover: f[4],
    colorSuccess: f[6],
    colorSuccessActive: f[7],
    colorSuccessTextHover: f[8],
    colorSuccessText: f[9],
    colorSuccessTextActive: f[10],
    colorErrorBg: h[1],
    colorErrorBgHover: h[2],
    colorErrorBorder: h[3],
    colorErrorBorderHover: h[4],
    colorErrorHover: h[5],
    colorError: h[6],
    colorErrorActive: h[7],
    colorErrorTextHover: h[8],
    colorErrorText: h[9],
    colorErrorTextActive: h[10],
    colorWarningBg: p[1],
    colorWarningBgHover: p[2],
    colorWarningBorder: p[3],
    colorWarningBorderHover: p[4],
    colorWarningHover: p[4],
    colorWarning: p[6],
    colorWarningActive: p[7],
    colorWarningTextHover: p[8],
    colorWarningText: p[9],
    colorWarningTextActive: p[10],
    colorInfoBg: m[1],
    colorInfoBgHover: m[2],
    colorInfoBorder: m[3],
    colorInfoBorderHover: m[4],
    colorInfoHover: m[4],
    colorInfo: m[6],
    colorInfoActive: m[7],
    colorInfoTextHover: m[8],
    colorInfoText: m[9],
    colorInfoTextActive: m[10],
    colorBgMask: new He("#000").setAlpha(0.45).toRgbString(),
    colorWhite: "#fff"
  });
}
const _0 = (e) => {
  let t = e, n = e, o = e, r = e;
  return e < 6 && e >= 5 ? t = e + 1 : e < 16 && e >= 6 ? t = e + 2 : e >= 16 && (t = 16), e < 7 && e >= 5 ? n = 4 : e < 8 && e >= 7 ? n = 5 : e < 14 && e >= 8 ? n = 6 : e < 16 && e >= 14 ? n = 7 : e >= 16 && (n = 8), e < 6 && e >= 2 ? o = 1 : e >= 6 && (o = 2), e > 4 && e < 8 ? r = 4 : e >= 8 && (r = 6), {
    borderRadius: e > 16 ? 16 : e,
    borderRadiusXS: o,
    borderRadiusSM: n,
    borderRadiusLG: t,
    borderRadiusOuter: r
  };
}, E0 = _0;
function T0(e) {
  const {
    motionUnit: t,
    motionBase: n,
    borderRadius: o,
    lineWidth: r
  } = e;
  return g({
    // motion
    motionDurationFast: `${(n + t).toFixed(1)}s`,
    motionDurationMid: `${(n + t * 2).toFixed(1)}s`,
    motionDurationSlow: `${(n + t * 3).toFixed(1)}s`,
    // line
    lineWidthBold: r + 1
  }, E0(o));
}
const bt = (e, t) => new He(e).setAlpha(t).toRgbString(), Kn = (e, t) => new He(e).darken(t).toHexString(), P0 = (e) => {
  const t = vo(e);
  return {
    1: t[0],
    2: t[1],
    3: t[2],
    4: t[3],
    5: t[4],
    6: t[5],
    7: t[6],
    8: t[4],
    9: t[5],
    10: t[6]
    // 8: colors[7],
    // 9: colors[8],
    // 10: colors[9],
  };
}, I0 = (e, t) => {
  const n = e || "#fff", o = t || "#000";
  return {
    colorBgBase: n,
    colorTextBase: o,
    colorText: bt(o, 0.88),
    colorTextSecondary: bt(o, 0.65),
    colorTextTertiary: bt(o, 0.45),
    colorTextQuaternary: bt(o, 0.25),
    colorFill: bt(o, 0.15),
    colorFillSecondary: bt(o, 0.06),
    colorFillTertiary: bt(o, 0.04),
    colorFillQuaternary: bt(o, 0.02),
    colorBgLayout: Kn(n, 4),
    colorBgContainer: Kn(n, 0),
    colorBgElevated: Kn(n, 0),
    colorBgSpotlight: bt(o, 0.85),
    colorBorder: Kn(n, 15),
    colorBorderSecondary: Kn(n, 6)
  };
};
function M0(e) {
  const t = new Array(10).fill(null).map((n, o) => {
    const r = o - 1, i = e * Math.pow(2.71828, r / 5), a = o > 1 ? Math.floor(i) : Math.ceil(i);
    return Math.floor(a / 2) * 2;
  });
  return t[1] = e, t.map((n) => {
    const o = n + 8;
    return {
      size: n,
      lineHeight: o / n
    };
  });
}
const N0 = (e) => {
  const t = M0(e), n = t.map((r) => r.size), o = t.map((r) => r.lineHeight);
  return {
    fontSizeSM: n[0],
    fontSize: n[1],
    fontSizeLG: n[2],
    fontSizeXL: n[3],
    fontSizeHeading1: n[6],
    fontSizeHeading2: n[5],
    fontSizeHeading3: n[4],
    fontSizeHeading4: n[3],
    fontSizeHeading5: n[2],
    lineHeight: o[1],
    lineHeightLG: o[2],
    lineHeightSM: o[0],
    lineHeightHeading1: o[6],
    lineHeightHeading2: o[5],
    lineHeightHeading3: o[4],
    lineHeightHeading4: o[3],
    lineHeightHeading5: o[2]
  };
}, A0 = N0;
function D0(e) {
  const t = Object.keys(rf).map((n) => {
    const o = vo(e[n]);
    return new Array(10).fill(1).reduce((r, i, a) => (r[`${n}-${a + 1}`] = o[a], r), {});
  }).reduce((n, o) => (n = g(g({}, n), o), n), {});
  return g(g(g(g(g(g(g({}, e), t), $0(e, {
    generateColorPalettes: P0,
    generateNeutralColorPalettes: I0
  })), A0(e.fontSize)), x0(e)), C0(e)), T0(e));
}
function Ci(e) {
  return e >= 0 && e <= 255;
}
function Zo(e, t) {
  const {
    r: n,
    g: o,
    b: r,
    a: i
  } = new He(e).toRgb();
  if (i < 1)
    return e;
  const {
    r: a,
    g: l,
    b: c
  } = new He(t).toRgb();
  for (let s = 0.01; s <= 1; s += 0.01) {
    const d = Math.round((n - a * (1 - s)) / s), u = Math.round((o - l * (1 - s)) / s), f = Math.round((r - c * (1 - s)) / s);
    if (Ci(d) && Ci(u) && Ci(f))
      return new He({
        r: d,
        g: u,
        b: f,
        a: Math.round(s * 100) / 100
      }).toRgbString();
  }
  return new He({
    r: n,
    g: o,
    b: r,
    a: 1
  }).toRgbString();
}
var R0 = globalThis && globalThis.__rest || function(e, t) {
  var n = {};
  for (var o in e)
    Object.prototype.hasOwnProperty.call(e, o) && t.indexOf(o) < 0 && (n[o] = e[o]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var r = 0, o = Object.getOwnPropertySymbols(e); r < o.length; r++)
      t.indexOf(o[r]) < 0 && Object.prototype.propertyIsEnumerable.call(e, o[r]) && (n[o[r]] = e[o[r]]);
  return n;
};
function H0(e) {
  const {
    override: t
  } = e, n = R0(e, ["override"]), o = g({}, t);
  Object.keys(Ja).forEach((p) => {
    delete o[p];
  });
  const r = g(g({}, n), o), i = 480, a = 576, l = 768, c = 992, s = 1200, d = 1600, u = 2e3;
  return g(g(g({}, r), {
    colorLink: r.colorInfoText,
    colorLinkHover: r.colorInfoHover,
    colorLinkActive: r.colorInfoActive,
    // ============== Background ============== //
    colorFillContent: r.colorFillSecondary,
    colorFillContentHover: r.colorFill,
    colorFillAlter: r.colorFillQuaternary,
    colorBgContainerDisabled: r.colorFillTertiary,
    // ============== Split ============== //
    colorBorderBg: r.colorBgContainer,
    colorSplit: Zo(r.colorBorderSecondary, r.colorBgContainer),
    // ============== Text ============== //
    colorTextPlaceholder: r.colorTextQuaternary,
    colorTextDisabled: r.colorTextQuaternary,
    colorTextHeading: r.colorText,
    colorTextLabel: r.colorTextSecondary,
    colorTextDescription: r.colorTextTertiary,
    colorTextLightSolid: r.colorWhite,
    colorHighlight: r.colorError,
    colorBgTextHover: r.colorFillSecondary,
    colorBgTextActive: r.colorFill,
    colorIcon: r.colorTextTertiary,
    colorIconHover: r.colorText,
    colorErrorOutline: Zo(r.colorErrorBg, r.colorBgContainer),
    colorWarningOutline: Zo(r.colorWarningBg, r.colorBgContainer),
    // Font
    fontSizeIcon: r.fontSizeSM,
    // Control
    lineWidth: r.lineWidth,
    controlOutlineWidth: r.lineWidth * 2,
    // Checkbox size and expand icon size
    controlInteractiveSize: r.controlHeight / 2,
    controlItemBgHover: r.colorFillTertiary,
    controlItemBgActive: r.colorPrimaryBg,
    controlItemBgActiveHover: r.colorPrimaryBgHover,
    controlItemBgActiveDisabled: r.colorFill,
    controlTmpOutline: r.colorFillQuaternary,
    controlOutline: Zo(r.colorPrimaryBg, r.colorBgContainer),
    lineType: r.lineType,
    borderRadius: r.borderRadius,
    borderRadiusXS: r.borderRadiusXS,
    borderRadiusSM: r.borderRadiusSM,
    borderRadiusLG: r.borderRadiusLG,
    fontWeightStrong: 600,
    opacityLoading: 0.65,
    linkDecoration: "none",
    linkHoverDecoration: "none",
    linkFocusDecoration: "none",
    controlPaddingHorizontal: 12,
    controlPaddingHorizontalSM: 8,
    paddingXXS: r.sizeXXS,
    paddingXS: r.sizeXS,
    paddingSM: r.sizeSM,
    padding: r.size,
    paddingMD: r.sizeMD,
    paddingLG: r.sizeLG,
    paddingXL: r.sizeXL,
    paddingContentHorizontalLG: r.sizeLG,
    paddingContentVerticalLG: r.sizeMS,
    paddingContentHorizontal: r.sizeMS,
    paddingContentVertical: r.sizeSM,
    paddingContentHorizontalSM: r.size,
    paddingContentVerticalSM: r.sizeXS,
    marginXXS: r.sizeXXS,
    marginXS: r.sizeXS,
    marginSM: r.sizeSM,
    margin: r.size,
    marginMD: r.sizeMD,
    marginLG: r.sizeLG,
    marginXL: r.sizeXL,
    marginXXL: r.sizeXXL,
    boxShadow: `
      0 1px 2px 0 rgba(0, 0, 0, 0.03),
      0 1px 6px -1px rgba(0, 0, 0, 0.02),
      0 2px 4px 0 rgba(0, 0, 0, 0.02)
    `,
    boxShadowSecondary: `
      0 6px 16px 0 rgba(0, 0, 0, 0.08),
      0 3px 6px -4px rgba(0, 0, 0, 0.12),
      0 9px 28px 8px rgba(0, 0, 0, 0.05)
    `,
    boxShadowTertiary: `
      0 1px 2px 0 rgba(0, 0, 0, 0.03),
      0 1px 6px -1px rgba(0, 0, 0, 0.02),
      0 2px 4px 0 rgba(0, 0, 0, 0.02)
    `,
    screenXS: i,
    screenXSMin: i,
    screenXSMax: a - 1,
    screenSM: a,
    screenSMMin: a,
    screenSMMax: l - 1,
    screenMD: l,
    screenMDMin: l,
    screenMDMax: c - 1,
    screenLG: c,
    screenLGMin: c,
    screenLGMax: s - 1,
    screenXL: s,
    screenXLMin: s,
    screenXLMax: d - 1,
    screenXXL: d,
    screenXXLMin: d,
    screenXXLMax: u - 1,
    screenXXXL: u,
    screenXXXLMin: u,
    // FIXME: component box-shadow, should be removed
    boxShadowPopoverArrow: "3px 3px 7px rgba(0, 0, 0, 0.1)",
    boxShadowCard: `
      0 1px 2px -2px ${new He("rgba(0, 0, 0, 0.16)").toRgbString()},
      0 3px 6px 0 ${new He("rgba(0, 0, 0, 0.12)").toRgbString()},
      0 5px 12px 4px ${new He("rgba(0, 0, 0, 0.09)").toRgbString()}
    `,
    boxShadowDrawerRight: `
      -6px 0 16px 0 rgba(0, 0, 0, 0.08),
      -3px 0 6px -4px rgba(0, 0, 0, 0.12),
      -9px 0 28px 8px rgba(0, 0, 0, 0.05)
    `,
    boxShadowDrawerLeft: `
      6px 0 16px 0 rgba(0, 0, 0, 0.08),
      3px 0 6px -4px rgba(0, 0, 0, 0.12),
      9px 0 28px 8px rgba(0, 0, 0, 0.05)
    `,
    boxShadowDrawerUp: `
      0 6px 16px 0 rgba(0, 0, 0, 0.08),
      0 3px 6px -4px rgba(0, 0, 0, 0.12),
      0 9px 28px 8px rgba(0, 0, 0, 0.05)
    `,
    boxShadowDrawerDown: `
      0 -6px 16px 0 rgba(0, 0, 0, 0.08),
      0 -3px 6px -4px rgba(0, 0, 0, 0.12),
      0 -9px 28px 8px rgba(0, 0, 0, 0.05)
    `,
    boxShadowTabsOverflowLeft: "inset 10px 0 8px -8px rgba(0, 0, 0, 0.08)",
    boxShadowTabsOverflowRight: "inset -10px 0 8px -8px rgba(0, 0, 0, 0.08)",
    boxShadowTabsOverflowTop: "inset 0 10px 8px -8px rgba(0, 0, 0, 0.08)",
    boxShadowTabsOverflowBottom: "inset 0 -10px 8px -8px rgba(0, 0, 0, 0.08)"
  }), o);
}
const ua = {
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis"
}, Mo = (e) => ({
  boxSizing: "border-box",
  margin: 0,
  padding: 0,
  color: e.colorText,
  fontSize: e.fontSize,
  // font-variant: @font-variant-base;
  lineHeight: e.lineHeight,
  listStyle: "none",
  // font-feature-settings: @font-feature-settings-base;
  fontFamily: e.fontFamily
}), af = () => ({
  display: "inline-flex",
  alignItems: "center",
  color: "inherit",
  fontStyle: "normal",
  lineHeight: 0,
  textAlign: "center",
  textTransform: "none",
  // for SVG icon, see https://blog.prototypr.io/align-svg-icons-to-text-and-say-goodbye-to-font-icons-d44b3d7b26b4
  verticalAlign: "-0.125em",
  textRendering: "optimizeLegibility",
  "-webkit-font-smoothing": "antialiased",
  "-moz-osx-font-smoothing": "grayscale",
  "> *": {
    lineHeight: 1
  },
  svg: {
    display: "inline-block"
  }
}), F0 = (e) => ({
  a: {
    color: e.colorLink,
    textDecoration: e.linkDecoration,
    backgroundColor: "transparent",
    outline: "none",
    cursor: "pointer",
    transition: `color ${e.motionDurationSlow}`,
    "-webkit-text-decoration-skip": "objects",
    "&:hover": {
      color: e.colorLinkHover
    },
    "&:active": {
      color: e.colorLinkActive
    },
    "&:active,\n  &:hover": {
      textDecoration: e.linkHoverDecoration,
      outline: 0
    },
    // https://github.com/ant-design/ant-design/issues/22503
    "&:focus": {
      textDecoration: e.linkFocusDecoration,
      outline: 0
    },
    "&[disabled]": {
      color: e.colorTextDisabled,
      cursor: "not-allowed"
    }
  }
}), z0 = (e, t) => {
  const {
    fontFamily: n,
    fontSize: o
  } = e, r = `[class^="${t}"], [class*=" ${t}"]`;
  return {
    [r]: {
      fontFamily: n,
      fontSize: o,
      boxSizing: "border-box",
      "&::before, &::after": {
        boxSizing: "border-box"
      },
      [r]: {
        boxSizing: "border-box",
        "&::before, &::after": {
          boxSizing: "border-box"
        }
      }
    }
  };
}, da = (e) => ({
  outline: `${e.lineWidthBold}px solid ${e.colorPrimaryBorder}`,
  outlineOffset: 1,
  transition: "outline-offset 0s, outline 0s"
}), L0 = (e) => ({
  "&:focus-visible": g({}, da(e))
});
function No(e, t, n) {
  return (o) => {
    const r = E(() => o == null ? void 0 : o.value), [i, a, l] = Yr(), {
      getPrefixCls: c,
      iconPrefixCls: s
    } = Um(), d = E(() => c()), u = E(() => ({
      theme: i.value,
      token: a.value,
      hashId: l.value,
      path: ["Shared", d.value]
    }));
    Ds(u, () => [{
      // Link
      "&": F0(a.value)
    }]);
    const f = E(() => ({
      theme: i.value,
      token: a.value,
      hashId: l.value,
      path: [e, r.value, s.value]
    }));
    return [Ds(f, () => {
      const {
        token: p,
        flush: h
      } = B0(a.value), m = typeof n == "function" ? n(p) : n, w = g(g({}, m), a.value[e]), y = `.${r.value}`, S = Fe(p, {
        componentCls: y,
        prefixCls: r.value,
        iconCls: `.${s.value}`,
        antCls: `.${d.value}`
      }, w), _ = t(S, {
        hashId: l.value,
        prefixCls: r.value,
        rootPrefixCls: d.value,
        iconPrefixCls: s.value,
        overrideComponentToken: a.value[e]
      });
      return h(e, w), [z0(a.value, r.value), _];
    }), l];
  };
}
const lf = process.env.NODE_ENV !== "production" || typeof CSSINJS_STATISTIC < "u";
let fa = !0;
function Fe() {
  for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
    t[n] = arguments[n];
  if (!lf)
    return g({}, ...t);
  fa = !1;
  const o = {};
  return t.forEach((r) => {
    Object.keys(r).forEach((a) => {
      Object.defineProperty(o, a, {
        configurable: !0,
        enumerable: !0,
        get: () => r[a]
      });
    });
  }), fa = !0, o;
}
function j0() {
}
function B0(e) {
  let t, n = e, o = j0;
  return lf && (t = /* @__PURE__ */ new Set(), n = new Proxy(e, {
    get(r, i) {
      return fa && t.add(i), r[i];
    }
  }), o = (r, i) => {
    Array.from(t);
  }), {
    token: n,
    keys: t,
    flush: o
  };
}
function sf(e) {
  if (!xe(e))
    return Ye(e);
  const t = new Proxy({}, {
    get(n, o, r) {
      return Reflect.get(e.value, o, r);
    },
    set(n, o, r) {
      return e.value[o] = r, !0;
    },
    deleteProperty(n, o) {
      return Reflect.deleteProperty(e.value, o);
    },
    has(n, o) {
      return Reflect.has(e.value, o);
    },
    ownKeys() {
      return Object.keys(e.value);
    },
    getOwnPropertyDescriptor() {
      return {
        enumerable: !0,
        configurable: !0
      };
    }
  });
  return Ye(t);
}
const V0 = mv(D0), W0 = {
  token: Ja,
  hashed: !0
}, K0 = Symbol("DesignTokenContext"), U0 = oe();
function Yr() {
  const e = ye(K0, U0.value || W0), t = E(() => `${o0}-${e.hashed || ""}`), n = E(() => e.theme || V0), o = _v(n, E(() => [Ja, e.token]), E(() => ({
    salt: t.value,
    override: g({
      override: e.token
    }, e.components),
    formatToken: H0
  })));
  return [n, E(() => o.value[0]), E(() => e.hashed ? o.value[1] : "")];
}
const cf = /* @__PURE__ */ Z({
  compatConfig: {
    MODE: 3
  },
  setup() {
    const [, e] = Yr(), t = E(() => new He(e.value.colorBgBase).toHsl().l < 0.5 ? {
      opacity: 0.65
    } : {});
    return () => v("svg", {
      style: t.value,
      width: "184",
      height: "152",
      viewBox: "0 0 184 152",
      xmlns: "http://www.w3.org/2000/svg"
    }, [v("g", {
      fill: "none",
      "fill-rule": "evenodd"
    }, [v("g", {
      transform: "translate(24 31.67)"
    }, [v("ellipse", {
      "fill-opacity": ".8",
      fill: "#F5F5F7",
      cx: "67.797",
      cy: "106.89",
      rx: "67.797",
      ry: "12.668"
    }, null), v("path", {
      d: "M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z",
      fill: "#AEB8C2"
    }, null), v("path", {
      d: "M101.537 86.214L80.63 61.102c-1.001-1.207-2.507-1.867-4.048-1.867H31.724c-1.54 0-3.047.66-4.048 1.867L6.769 86.214v13.792h94.768V86.214z",
      fill: "url(#linearGradient-1)",
      transform: "translate(13.56)"
    }, null), v("path", {
      d: "M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z",
      fill: "#F5F5F7"
    }, null), v("path", {
      d: "M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z",
      fill: "#DCE0E6"
    }, null)]), v("path", {
      d: "M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z",
      fill: "#DCE0E6"
    }, null), v("g", {
      transform: "translate(149.65 15.383)",
      fill: "#FFF"
    }, [v("ellipse", {
      cx: "20.654",
      cy: "3.167",
      rx: "2.849",
      ry: "2.815"
    }, null), v("path", {
      d: "M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z"
    }, null)])])]);
  }
});
cf.PRESENTED_IMAGE_DEFAULT = !0;
const X0 = cf, uf = /* @__PURE__ */ Z({
  compatConfig: {
    MODE: 3
  },
  setup() {
    const [, e] = Yr(), t = E(() => {
      const {
        colorFill: n,
        colorFillTertiary: o,
        colorFillQuaternary: r,
        colorBgContainer: i
      } = e.value;
      return {
        borderColor: new He(n).onBackground(i).toHexString(),
        shadowColor: new He(o).onBackground(i).toHexString(),
        contentColor: new He(r).onBackground(i).toHexString()
      };
    });
    return () => v("svg", {
      width: "64",
      height: "41",
      viewBox: "0 0 64 41",
      xmlns: "http://www.w3.org/2000/svg"
    }, [v("g", {
      transform: "translate(0 1)",
      fill: "none",
      "fill-rule": "evenodd"
    }, [v("ellipse", {
      fill: t.value.shadowColor,
      cx: "32",
      cy: "33",
      rx: "32",
      ry: "7"
    }, null), v("g", {
      "fill-rule": "nonzero",
      stroke: t.value.borderColor
    }, [v("path", {
      d: "M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"
    }, null), v("path", {
      d: "M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z",
      fill: t.value.contentColor
    }, null)])])]);
  }
});
uf.PRESENTED_IMAGE_SIMPLE = !0;
const G0 = uf, k0 = (e) => {
  const {
    componentCls: t,
    margin: n,
    marginXS: o,
    marginXL: r,
    fontSize: i,
    lineHeight: a
  } = e;
  return {
    [t]: {
      marginInline: o,
      fontSize: i,
      lineHeight: a,
      textAlign: "center",
      // 原来 &-image 没有父子结构，现在为了外层承担我们的hashId，改成父子结果
      [`${t}-image`]: {
        height: e.emptyImgHeight,
        marginBottom: o,
        opacity: e.opacityImage,
        img: {
          height: "100%"
        },
        svg: {
          height: "100%",
          margin: "auto"
        }
      },
      // 原来 &-footer 没有父子结构，现在为了外层承担我们的hashId，改成父子结果
      [`${t}-footer`]: {
        marginTop: n
      },
      "&-normal": {
        marginBlock: r,
        color: e.colorTextDisabled,
        [`${t}-image`]: {
          height: e.emptyImgHeightMD
        }
      },
      "&-small": {
        marginBlock: o,
        color: e.colorTextDisabled,
        [`${t}-image`]: {
          height: e.emptyImgHeightSM
        }
      }
    }
  };
}, Y0 = No("Empty", (e) => {
  const {
    componentCls: t,
    controlHeightLG: n
  } = e, o = Fe(e, {
    emptyImgCls: `${t}-img`,
    emptyImgHeight: n * 2.5,
    emptyImgHeightMD: n,
    emptyImgHeightSM: n * 0.875
  });
  return [k0(o)];
});
var q0 = globalThis && globalThis.__rest || function(e, t) {
  var n = {};
  for (var o in e)
    Object.prototype.hasOwnProperty.call(e, o) && t.indexOf(o) < 0 && (n[o] = e[o]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var r = 0, o = Object.getOwnPropertySymbols(e); r < o.length; r++)
      t.indexOf(o[r]) < 0 && Object.prototype.propertyIsEnumerable.call(e, o[r]) && (n[o[r]] = e[o[r]]);
  return n;
};
const df = v(X0, null, null), ff = v(G0, null, null), Q0 = () => ({
  prefixCls: String,
  imageStyle: $d(),
  image: qi(),
  description: qi()
}), Za = /* @__PURE__ */ Z({
  name: "AEmpty",
  compatConfig: {
    MODE: 3
  },
  inheritAttrs: !1,
  props: Q0(),
  setup(e, t) {
    let {
      slots: n = {},
      attrs: o
    } = t;
    const {
      direction: r,
      prefixCls: i
    } = Hn("empty", e), [a, l] = Y0(i);
    return () => {
      var c, s;
      const d = i.value, u = g(g({}, e), o), {
        image: f = ((c = n.image) === null || c === void 0 ? void 0 : c.call(n)) || df,
        description: p = ((s = n.description) === null || s === void 0 ? void 0 : s.call(n)) || void 0,
        imageStyle: h,
        class: m = ""
      } = u, w = q0(u, ["image", "description", "imageStyle", "class"]);
      return a(v(Jm, {
        componentName: "Empty",
        children: (y) => {
          const S = typeof p < "u" ? p : y.description, _ = typeof S == "string" ? S : "empty";
          let C = null;
          return typeof f == "string" ? C = v("img", {
            alt: _,
            src: f
          }, null) : C = f, v("div", U({
            class: ne(d, m, l.value, {
              [`${d}-normal`]: f === ff,
              [`${d}-rtl`]: r.value === "rtl"
            })
          }, w), [v("div", {
            class: `${d}-image`,
            style: h
          }, [C]), S && v("p", {
            class: `${d}-description`
          }, [S]), n.default && v("div", {
            class: `${d}-footer`
          }, [Io(n.default())])]);
        }
      }, null));
    };
  }
});
Za.PRESENTED_IMAGE_DEFAULT = df;
Za.PRESENTED_IMAGE_SIMPLE = ff;
const Un = ka(Za), pf = (e) => {
  const {
    prefixCls: t
  } = Hn("empty", e);
  return ((o) => {
    switch (o) {
      case "Table":
      case "List":
        return v(Un, {
          image: Un.PRESENTED_IMAGE_SIMPLE
        }, null);
      case "Select":
      case "TreeSelect":
      case "Cascader":
      case "Transfer":
      case "Mentions":
        return v(Un, {
          image: Un.PRESENTED_IMAGE_SIMPLE,
          class: `${t.value}-small`
        }, null);
      default:
        return v(Un, null, null);
    }
  })(e.componentName);
}, J0 = Symbol("SizeContextKey"), Z0 = () => ye(J0, oe(void 0)), Hn = (e, t) => {
  const n = Z0(), o = Pd(), r = ye(Ed, g(g({}, Td), {
    renderEmpty: (b) => wt(pf, {
      componentName: b
    })
  })), i = E(() => r.getPrefixCls(e, t.prefixCls)), a = E(() => {
    var b, $;
    return (b = t.direction) !== null && b !== void 0 ? b : ($ = r.direction) === null || $ === void 0 ? void 0 : $.value;
  }), l = E(() => {
    var b;
    return (b = t.iconPrefixCls) !== null && b !== void 0 ? b : r.iconPrefixCls.value;
  }), c = E(() => r.getPrefixCls()), s = E(() => {
    var b;
    return (b = r.autoInsertSpaceInButton) === null || b === void 0 ? void 0 : b.value;
  }), d = r.renderEmpty, u = r.space, f = r.pageHeader, p = r.form, h = E(() => {
    var b, $;
    return (b = t.getTargetContainer) !== null && b !== void 0 ? b : ($ = r.getTargetContainer) === null || $ === void 0 ? void 0 : $.value;
  }), m = E(() => {
    var b, $, T;
    return ($ = (b = t.getContainer) !== null && b !== void 0 ? b : t.getPopupContainer) !== null && $ !== void 0 ? $ : (T = r.getPopupContainer) === null || T === void 0 ? void 0 : T.value;
  }), w = E(() => {
    var b, $;
    return (b = t.dropdownMatchSelectWidth) !== null && b !== void 0 ? b : ($ = r.dropdownMatchSelectWidth) === null || $ === void 0 ? void 0 : $.value;
  }), y = E(() => {
    var b;
    return (t.virtual === void 0 ? ((b = r.virtual) === null || b === void 0 ? void 0 : b.value) !== !1 : t.virtual !== !1) && w.value !== !1;
  }), S = E(() => t.size || n.value), _ = E(() => {
    var b, $, T;
    return (b = t.autocomplete) !== null && b !== void 0 ? b : (T = ($ = r.input) === null || $ === void 0 ? void 0 : $.value) === null || T === void 0 ? void 0 : T.autocomplete;
  }), C = E(() => {
    var b;
    return (b = t.disabled) !== null && b !== void 0 ? b : o.value;
  }), x = E(() => {
    var b;
    return (b = t.csp) !== null && b !== void 0 ? b : r.csp;
  }), O = E(() => {
    var b;
    return (b = t.wave) !== null && b !== void 0 ? b : r.wave.value;
  });
  return {
    configProvider: r,
    prefixCls: i,
    direction: a,
    size: S,
    getTargetContainer: h,
    getPopupContainer: m,
    space: u,
    pageHeader: f,
    form: p,
    autoInsertSpaceInButton: s,
    renderEmpty: d,
    virtual: y,
    dropdownMatchSelectWidth: w,
    rootPrefixCls: c,
    getPrefixCls: r.getPrefixCls,
    autocomplete: _,
    csp: x,
    iconPrefixCls: l,
    disabled: C,
    select: r.select,
    wave: O
  };
};
function qr(e, t) {
  const n = g({}, e);
  for (let o = 0; o < t.length; o += 1) {
    const r = t[o];
    delete n[r];
  }
  return n;
}
function Vs(e, t) {
  for (var n = 0; n < t.length; n++) {
    var o = t[n];
    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o);
  }
}
function hf(e, t, n) {
  return t && Vs(e.prototype, t), n && Vs(e, n), e;
}
function dr() {
  return (dr = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var o in n)
        Object.prototype.hasOwnProperty.call(n, o) && (e[o] = n[o]);
    }
    return e;
  }).apply(this, arguments);
}
function gf(e, t) {
  e.prototype = Object.create(t.prototype), e.prototype.constructor = e, e.__proto__ = t;
}
function mf(e, t) {
  if (e == null)
    return {};
  var n, o, r = {}, i = Object.keys(e);
  for (o = 0; o < i.length; o++)
    t.indexOf(n = i[o]) >= 0 || (r[n] = e[n]);
  return r;
}
function Ws(e) {
  return ((t = e) != null && typeof t == "object" && Array.isArray(t) === !1) == 1 && Object.prototype.toString.call(e) === "[object Object]";
  var t;
}
var vf = Object.prototype, bf = vf.toString, eb = vf.hasOwnProperty, yf = /^\s*function (\w+)/;
function Ks(e) {
  var t, n = (t = e == null ? void 0 : e.type) !== null && t !== void 0 ? t : e;
  if (n) {
    var o = n.toString().match(yf);
    return o ? o[1] : "";
  }
  return "";
}
var ln = function(e) {
  var t, n;
  return Ws(e) !== !1 && typeof (t = e.constructor) == "function" && Ws(n = t.prototype) !== !1 && n.hasOwnProperty("isPrototypeOf") !== !1;
}, Sf = function(e) {
  return e;
}, Ie = Sf;
if (process.env.NODE_ENV !== "production") {
  var tb = typeof console < "u";
  Ie = tb ? function(e) {
    console.warn("[VueTypes warn]: " + e);
  } : Sf;
}
var bo = function(e, t) {
  return eb.call(e, t);
}, nb = Number.isInteger || function(e) {
  return typeof e == "number" && isFinite(e) && Math.floor(e) === e;
}, In = Array.isArray || function(e) {
  return bf.call(e) === "[object Array]";
}, Mn = function(e) {
  return bf.call(e) === "[object Function]";
}, Mr = function(e) {
  return ln(e) && bo(e, "_vueTypes_name");
}, wf = function(e) {
  return ln(e) && (bo(e, "type") || ["_vueTypes_name", "validator", "default", "required"].some(function(t) {
    return bo(e, t);
  }));
};
function el(e, t) {
  return Object.defineProperty(e.bind(t), "__original", { value: e });
}
function un(e, t, n) {
  var o;
  n === void 0 && (n = !1);
  var r = !0, i = "";
  o = ln(e) ? e : { type: e };
  var a = Mr(o) ? o._vueTypes_name + " - " : "";
  if (wf(o) && o.type !== null) {
    if (o.type === void 0 || o.type === !0 || !o.required && t === void 0)
      return r;
    In(o.type) ? (r = o.type.some(function(u) {
      return un(u, t, !0) === !0;
    }), i = o.type.map(function(u) {
      return Ks(u);
    }).join(" or ")) : r = (i = Ks(o)) === "Array" ? In(t) : i === "Object" ? ln(t) : i === "String" || i === "Number" || i === "Boolean" || i === "Function" ? function(u) {
      if (u == null)
        return "";
      var f = u.constructor.toString().match(yf);
      return f ? f[1] : "";
    }(t) === i : t instanceof o.type;
  }
  if (!r) {
    var l = a + 'value "' + t + '" should be of type "' + i + '"';
    return n === !1 ? (Ie(l), !1) : l;
  }
  if (bo(o, "validator") && Mn(o.validator)) {
    var c = Ie, s = [];
    if (Ie = function(u) {
      s.push(u);
    }, r = o.validator(t), Ie = c, !r) {
      var d = (s.length > 1 ? "* " : "") + s.join(`
* `);
      return s.length = 0, n === !1 ? (Ie(d), r) : d;
    }
  }
  return r;
}
function We(e, t) {
  var n = Object.defineProperties(t, { _vueTypes_name: { value: e, writable: !0 }, isRequired: { get: function() {
    return this.required = !0, this;
  } }, def: { value: function(r) {
    return r !== void 0 || this.default ? Mn(r) || un(this, r, !0) === !0 ? (this.default = In(r) ? function() {
      return [].concat(r);
    } : ln(r) ? function() {
      return Object.assign({}, r);
    } : r, this) : (Ie(this._vueTypes_name + ' - invalid default value: "' + r + '"'), this) : this;
  } } }), o = n.validator;
  return Mn(o) && (n.validator = el(o, n)), n;
}
function ht(e, t) {
  var n = We(e, t);
  return Object.defineProperty(n, "validate", { value: function(o) {
    return Mn(this.validator) && Ie(this._vueTypes_name + ` - calling .validate() will overwrite the current custom validator function. Validator info:
` + JSON.stringify(this)), this.validator = el(o, this), this;
  } });
}
function Us(e, t, n) {
  var o, r, i = (o = t, r = {}, Object.getOwnPropertyNames(o).forEach(function(u) {
    r[u] = Object.getOwnPropertyDescriptor(o, u);
  }), Object.defineProperties({}, r));
  if (i._vueTypes_name = e, !ln(n))
    return i;
  var a, l, c = n.validator, s = mf(n, ["validator"]);
  if (Mn(c)) {
    var d = i.validator;
    d && (d = (l = (a = d).__original) !== null && l !== void 0 ? l : a), i.validator = el(d ? function(u) {
      return d.call(this, u) && c.call(this, u);
    } : c, i);
  }
  return Object.assign(i, s);
}
function Qr(e) {
  return e.replace(/^(?!\s*$)/gm, "  ");
}
var ob = function() {
  return ht("any", {});
}, rb = function() {
  return ht("function", { type: Function });
}, ib = function() {
  return ht("boolean", { type: Boolean });
}, ab = function() {
  return ht("string", { type: String });
}, lb = function() {
  return ht("number", { type: Number });
}, sb = function() {
  return ht("array", { type: Array });
}, cb = function() {
  return ht("object", { type: Object });
}, ub = function() {
  return We("integer", { type: Number, validator: function(e) {
    return nb(e);
  } });
}, db = function() {
  return We("symbol", { validator: function(e) {
    return typeof e == "symbol";
  } });
};
function fb(e, t) {
  if (t === void 0 && (t = "custom validation failed"), typeof e != "function")
    throw new TypeError("[VueTypes error]: You must provide a function as argument");
  return We(e.name || "<<anonymous function>>", { validator: function(n) {
    var o = e(n);
    return o || Ie(this._vueTypes_name + " - " + t), o;
  } });
}
function pb(e) {
  if (!In(e))
    throw new TypeError("[VueTypes error]: You must provide an array as argument.");
  var t = 'oneOf - value should be one of "' + e.join('", "') + '".', n = e.reduce(function(o, r) {
    if (r != null) {
      var i = r.constructor;
      o.indexOf(i) === -1 && o.push(i);
    }
    return o;
  }, []);
  return We("oneOf", { type: n.length > 0 ? n : void 0, validator: function(o) {
    var r = e.indexOf(o) !== -1;
    return r || Ie(t), r;
  } });
}
function hb(e) {
  if (!In(e))
    throw new TypeError("[VueTypes error]: You must provide an array as argument");
  for (var t = !1, n = [], o = 0; o < e.length; o += 1) {
    var r = e[o];
    if (wf(r)) {
      if (Mr(r) && r._vueTypes_name === "oneOf") {
        n = n.concat(r.type);
        continue;
      }
      if (Mn(r.validator) && (t = !0), r.type !== !0 && r.type) {
        n = n.concat(r.type);
        continue;
      }
    }
    n.push(r);
  }
  return n = n.filter(function(i, a) {
    return n.indexOf(i) === a;
  }), We("oneOfType", t ? { type: n, validator: function(i) {
    var a = [], l = e.some(function(c) {
      var s = un(Mr(c) && c._vueTypes_name === "oneOf" ? c.type || null : c, i, !0);
      return typeof s == "string" && a.push(s), s === !0;
    });
    return l || Ie("oneOfType - provided value does not match any of the " + a.length + ` passed-in validators:
` + Qr(a.join(`
`))), l;
  } } : { type: n });
}
function gb(e) {
  return We("arrayOf", { type: Array, validator: function(t) {
    var n, o = t.every(function(r) {
      return (n = un(e, r, !0)) === !0;
    });
    return o || Ie(`arrayOf - value validation error:
` + Qr(n)), o;
  } });
}
function mb(e) {
  return We("instanceOf", { type: e });
}
function vb(e) {
  return We("objectOf", { type: Object, validator: function(t) {
    var n, o = Object.keys(t).every(function(r) {
      return (n = un(e, t[r], !0)) === !0;
    });
    return o || Ie(`objectOf - value validation error:
` + Qr(n)), o;
  } });
}
function bb(e) {
  var t = Object.keys(e), n = t.filter(function(r) {
    var i;
    return !!(!((i = e[r]) === null || i === void 0) && i.required);
  }), o = We("shape", { type: Object, validator: function(r) {
    var i = this;
    if (!ln(r))
      return !1;
    var a = Object.keys(r);
    if (n.length > 0 && n.some(function(c) {
      return a.indexOf(c) === -1;
    })) {
      var l = n.filter(function(c) {
        return a.indexOf(c) === -1;
      });
      return Ie(l.length === 1 ? 'shape - required property "' + l[0] + '" is not defined.' : 'shape - required properties "' + l.join('", "') + '" are not defined.'), !1;
    }
    return a.every(function(c) {
      if (t.indexOf(c) === -1)
        return i._vueTypes_isLoose === !0 || (Ie('shape - shape definition does not include a "' + c + '" property. Allowed keys: "' + t.join('", "') + '".'), !1);
      var s = un(e[c], r[c], !0);
      return typeof s == "string" && Ie('shape - "' + c + `" property validation error:
 ` + Qr(s)), s === !0;
    });
  } });
  return Object.defineProperty(o, "_vueTypes_isLoose", { writable: !0, value: !1 }), Object.defineProperty(o, "loose", { get: function() {
    return this._vueTypes_isLoose = !0, this;
  } }), o;
}
var it = function() {
  function e() {
  }
  return e.extend = function(t) {
    var n = this;
    if (In(t))
      return t.forEach(function(u) {
        return n.extend(u);
      }), this;
    var o = t.name, r = t.validate, i = r !== void 0 && r, a = t.getter, l = a !== void 0 && a, c = mf(t, ["name", "validate", "getter"]);
    if (bo(this, o))
      throw new TypeError('[VueTypes error]: Type "' + o + '" already defined');
    var s, d = c.type;
    return Mr(d) ? (delete c.type, Object.defineProperty(this, o, l ? { get: function() {
      return Us(o, d, c);
    } } : { value: function() {
      var u, f = Us(o, d, c);
      return f.validator && (f.validator = (u = f.validator).bind.apply(u, [f].concat([].slice.call(arguments)))), f;
    } })) : (s = l ? { get: function() {
      var u = Object.assign({}, c);
      return i ? ht(o, u) : We(o, u);
    }, enumerable: !0 } : { value: function() {
      var u, f, p = Object.assign({}, c);
      return u = i ? ht(o, p) : We(o, p), p.validator && (u.validator = (f = p.validator).bind.apply(f, [u].concat([].slice.call(arguments)))), u;
    }, enumerable: !0 }, Object.defineProperty(this, o, s));
  }, hf(e, null, [{ key: "any", get: function() {
    return ob();
  } }, { key: "func", get: function() {
    return rb().def(this.defaults.func);
  } }, { key: "bool", get: function() {
    return ib().def(this.defaults.bool);
  } }, { key: "string", get: function() {
    return ab().def(this.defaults.string);
  } }, { key: "number", get: function() {
    return lb().def(this.defaults.number);
  } }, { key: "array", get: function() {
    return sb().def(this.defaults.array);
  } }, { key: "object", get: function() {
    return cb().def(this.defaults.object);
  } }, { key: "integer", get: function() {
    return ub().def(this.defaults.integer);
  } }, { key: "symbol", get: function() {
    return db();
  } }]), e;
}();
function Cf(e) {
  var t;
  return e === void 0 && (e = { func: function() {
  }, bool: !0, string: "", number: 0, array: function() {
    return [];
  }, object: function() {
    return {};
  }, integer: 0 }), (t = function(n) {
    function o() {
      return n.apply(this, arguments) || this;
    }
    return gf(o, n), hf(o, null, [{ key: "sensibleDefaults", get: function() {
      return dr({}, this.defaults);
    }, set: function(r) {
      this.defaults = r !== !1 ? dr({}, r !== !0 ? r : e) : {};
    } }]), o;
  }(it)).defaults = dr({}, e), t;
}
it.defaults = {}, it.custom = fb, it.oneOf = pb, it.instanceOf = mb, it.oneOfType = hb, it.arrayOf = gb, it.objectOf = vb, it.shape = bb, it.utils = { validate: function(e, t) {
  return un(t, e, !0) === !0;
}, toType: function(e, t, n) {
  return n === void 0 && (n = !1), n ? ht(e, t) : We(e, t);
} };
(function(e) {
  function t() {
    return e.apply(this, arguments) || this;
  }
  return gf(t, e), t;
})(Cf());
const xf = Cf({
  func: void 0,
  bool: void 0,
  string: void 0,
  number: void 0,
  array: void 0,
  object: void 0,
  integer: void 0
});
xf.extend([{
  name: "looseBool",
  getter: !0,
  type: Boolean,
  default: void 0
}, {
  name: "style",
  getter: !0,
  type: [String, Object],
  default: void 0
}, {
  name: "VueNode",
  getter: !0,
  type: null
}]);
const P = xf, yb = (e, t, n) => {
  Xe(e, `[ant-design-vue: ${t}] ${n}`);
};
function Xs(e, t) {
  const {
    key: n
  } = e;
  let o;
  return "value" in e && ({
    value: o
  } = e), n ?? (o !== void 0 ? o : `rc-index-key-${t}`);
}
function Of(e, t) {
  const {
    label: n,
    value: o,
    options: r
  } = e || {};
  return {
    label: n || (t ? "children" : "label"),
    value: o || "value",
    options: r || "options"
  };
}
function Sb(e) {
  let {
    fieldNames: t,
    childrenAsData: n
  } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  const o = [], {
    label: r,
    value: i,
    options: a
  } = Of(t, !1);
  function l(c, s) {
    c.forEach((d) => {
      const u = d[r];
      if (s || !(a in d)) {
        const f = d[i];
        o.push({
          key: Xs(d, o.length),
          groupOption: s,
          data: d,
          label: u,
          value: f
        });
      } else {
        let f = u;
        f === void 0 && n && (f = d.label), o.push({
          key: Xs(d, o.length),
          group: !0,
          data: d,
          label: f
        }), l(d[a], !0);
      }
    });
  }
  return l(e, !1), o;
}
function pa(e) {
  const t = g({}, e);
  return "props" in t || Object.defineProperty(t, "props", {
    get() {
      return jd(!1, "Return type is option instead of Option instance. Please read value directly instead of reading from `props`."), t;
    }
  }), t;
}
function wb(e, t) {
  if (!t || !t.length)
    return null;
  let n = !1;
  function o(i, a) {
    let [l, ...c] = a;
    if (!l)
      return [i];
    const s = i.split(l);
    return n = n || s.length > 1, s.reduce((d, u) => [...d, ...o(u, c)], []).filter((d) => d);
  }
  const r = o(e, t);
  return n ? r : null;
}
function Cb() {
  return "";
}
function xb(e) {
  return e ? e.ownerDocument : window.document;
}
function $f() {
}
const Ob = () => ({
  action: P.oneOfType([P.string, P.arrayOf(P.string)]).def([]),
  showAction: P.any.def([]),
  hideAction: P.any.def([]),
  getPopupClassNameFromAlign: P.any.def(Cb),
  onPopupVisibleChange: Function,
  afterPopupVisibleChange: P.func.def($f),
  popup: P.any,
  popupStyle: {
    type: Object,
    default: void 0
  },
  prefixCls: P.string.def("rc-trigger-popup"),
  popupClassName: P.string.def(""),
  popupPlacement: String,
  builtinPlacements: P.object,
  popupTransitionName: String,
  popupAnimation: P.any,
  mouseEnterDelay: P.number.def(0),
  mouseLeaveDelay: P.number.def(0.1),
  zIndex: Number,
  focusDelay: P.number.def(0),
  blurDelay: P.number.def(0.15),
  getPopupContainer: Function,
  getDocument: P.func.def(xb),
  forceRender: {
    type: Boolean,
    default: void 0
  },
  destroyPopupOnHide: {
    type: Boolean,
    default: !1
  },
  mask: {
    type: Boolean,
    default: !1
  },
  maskClosable: {
    type: Boolean,
    default: !0
  },
  // onPopupAlign: PropTypes.func.def(noop),
  popupAlign: P.object.def(() => ({})),
  popupVisible: {
    type: Boolean,
    default: void 0
  },
  defaultPopupVisible: {
    type: Boolean,
    default: !1
  },
  maskTransitionName: String,
  maskAnimation: String,
  stretch: String,
  alignPoint: {
    type: Boolean,
    default: void 0
  },
  autoDestroy: {
    type: Boolean,
    default: !1
  },
  mobile: Object,
  getTriggerDOMNode: Function
}), tl = {
  visible: Boolean,
  prefixCls: String,
  zIndex: Number,
  destroyPopupOnHide: Boolean,
  forceRender: Boolean,
  // Legacy Motion
  animation: [String, Object],
  transitionName: String,
  // Measure
  stretch: {
    type: String
  },
  // Align
  align: {
    type: Object
  },
  point: {
    type: Object
  },
  getRootDomNode: {
    type: Function
  },
  getClassNameFromAlign: {
    type: Function
  },
  onMouseenter: {
    type: Function
  },
  onMouseleave: {
    type: Function
  },
  onMousedown: {
    type: Function
  },
  onTouchstart: {
    type: Function
  }
}, $b = g(g({}, tl), {
  mobile: {
    type: Object
  }
}), _b = g(g({}, tl), {
  mask: Boolean,
  mobile: {
    type: Object
  },
  maskAnimation: String,
  maskTransitionName: String
});
function _f(e) {
  let {
    prefixCls: t,
    animation: n,
    transitionName: o
  } = e;
  return n ? {
    name: `${t}-${n}`
  } : o ? {
    name: o
  } : {};
}
function Ef(e) {
  const {
    prefixCls: t,
    visible: n,
    zIndex: o,
    mask: r,
    maskAnimation: i,
    maskTransitionName: a
  } = e;
  if (!r)
    return null;
  let l = {};
  return (a || i) && (l = _f({
    prefixCls: t,
    transitionName: a,
    animation: i
  })), v(Po, U({
    appear: !0
  }, l), {
    default: () => [Dn(v("div", {
      style: {
        zIndex: o
      },
      class: `${t}-mask`
    }, null), [[ku("if"), n]])]
  });
}
Ef.displayName = "Mask";
const Eb = /* @__PURE__ */ Z({
  compatConfig: {
    MODE: 3
  },
  name: "MobilePopupInner",
  inheritAttrs: !1,
  props: $b,
  emits: ["mouseenter", "mouseleave", "mousedown", "touchstart", "align"],
  setup(e, t) {
    let {
      expose: n,
      slots: o
    } = t;
    const r = oe();
    return n({
      forceAlign: () => {
      },
      getElement: () => r.value
    }), () => {
      var i;
      const {
        zIndex: a,
        visible: l,
        prefixCls: c,
        mobile: {
          popupClassName: s,
          popupStyle: d,
          popupMotion: u = {},
          popupRender: f
        } = {}
      } = e, p = g({
        zIndex: a
      }, d);
      let h = tt((i = o.default) === null || i === void 0 ? void 0 : i.call(o));
      h.length > 1 && (h = v("div", {
        class: `${c}-content`
      }, [h])), f && (h = f(h));
      const m = ne(c, s);
      return v(Po, U({
        ref: r
      }, u), {
        default: () => [l ? v("div", {
          class: m,
          style: p
        }, [h]) : null]
      });
    };
  }
});
var Tb = globalThis && globalThis.__awaiter || function(e, t, n, o) {
  function r(i) {
    return i instanceof n ? i : new n(function(a) {
      a(i);
    });
  }
  return new (n || (n = Promise))(function(i, a) {
    function l(d) {
      try {
        s(o.next(d));
      } catch (u) {
        a(u);
      }
    }
    function c(d) {
      try {
        s(o.throw(d));
      } catch (u) {
        a(u);
      }
    }
    function s(d) {
      d.done ? i(d.value) : r(d.value).then(l, c);
    }
    s((o = o.apply(e, t || [])).next());
  });
};
const Gs = ["measure", "align", null, "motion"], Pb = (e, t) => {
  const n = V(null), o = V(), r = V(!1);
  function i(c) {
    r.value || (n.value = c);
  }
  function a() {
    Oe.cancel(o.value);
  }
  function l(c) {
    a(), o.value = Oe(() => {
      let s = n.value;
      switch (n.value) {
        case "align":
          s = "motion";
          break;
        case "motion":
          s = "stable";
          break;
      }
      i(s), c == null || c();
    });
  }
  return ae(e, () => {
    i("measure");
  }, {
    immediate: !0,
    flush: "post"
  }), De(() => {
    ae(n, () => {
      switch (n.value) {
        case "measure":
          t();
          break;
      }
      n.value && (o.value = Oe(() => Tb(void 0, void 0, void 0, function* () {
        const c = Gs.indexOf(n.value), s = Gs[c + 1];
        s && c !== -1 && i(s);
      })));
    }, {
      immediate: !0,
      flush: "post"
    });
  }), rt(() => {
    r.value = !0, a();
  }), [n, l];
}, Ib = (e) => {
  const t = V({
    width: 0,
    height: 0
  });
  function n(r) {
    t.value = {
      width: r.offsetWidth,
      height: r.offsetHeight
    };
  }
  return [E(() => {
    const r = {};
    if (e.value) {
      const {
        width: i,
        height: a
      } = t.value;
      e.value.indexOf("height") !== -1 && a ? r.height = `${a}px` : e.value.indexOf("minHeight") !== -1 && a && (r.minHeight = `${a}px`), e.value.indexOf("width") !== -1 && i ? r.width = `${i}px` : e.value.indexOf("minWidth") !== -1 && i && (r.minWidth = `${i}px`);
    }
    return r;
  }), n];
};
function ks(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    t && (o = o.filter(function(r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), n.push.apply(n, o);
  }
  return n;
}
function Ys(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? ks(Object(n), !0).forEach(function(o) {
      Mb(e, o, n[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : ks(Object(n)).forEach(function(o) {
      Object.defineProperty(e, o, Object.getOwnPropertyDescriptor(n, o));
    });
  }
  return e;
}
function ha(e) {
  "@babel/helpers - typeof";
  return ha = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ha(e);
}
function Mb(e, t, n) {
  return t in e ? Object.defineProperty(e, t, {
    value: n,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[t] = n, e;
}
var Xn, Nb = {
  Webkit: "-webkit-",
  Moz: "-moz-",
  // IE did it wrong again ...
  ms: "-ms-",
  O: "-o-"
};
function Nr() {
  if (Xn !== void 0)
    return Xn;
  Xn = "";
  var e = document.createElement("p").style, t = "Transform";
  for (var n in Nb)
    n + t in e && (Xn = n);
  return Xn;
}
function Tf() {
  return Nr() ? "".concat(Nr(), "TransitionProperty") : "transitionProperty";
}
function Jr() {
  return Nr() ? "".concat(Nr(), "Transform") : "transform";
}
function qs(e, t) {
  var n = Tf();
  n && (e.style[n] = t, n !== "transitionProperty" && (e.style.transitionProperty = t));
}
function xi(e, t) {
  var n = Jr();
  n && (e.style[n] = t, n !== "transform" && (e.style.transform = t));
}
function Ab(e) {
  return e.style.transitionProperty || e.style[Tf()];
}
function Db(e) {
  var t = window.getComputedStyle(e, null), n = t.getPropertyValue("transform") || t.getPropertyValue(Jr());
  if (n && n !== "none") {
    var o = n.replace(/[^0-9\-.,]/g, "").split(",");
    return {
      x: parseFloat(o[12] || o[4], 0),
      y: parseFloat(o[13] || o[5], 0)
    };
  }
  return {
    x: 0,
    y: 0
  };
}
var Rb = /matrix\((.*)\)/, Hb = /matrix3d\((.*)\)/;
function Fb(e, t) {
  var n = window.getComputedStyle(e, null), o = n.getPropertyValue("transform") || n.getPropertyValue(Jr());
  if (o && o !== "none") {
    var r, i = o.match(Rb);
    if (i)
      i = i[1], r = i.split(",").map(function(l) {
        return parseFloat(l, 10);
      }), r[4] = t.x, r[5] = t.y, xi(e, "matrix(".concat(r.join(","), ")"));
    else {
      var a = o.match(Hb)[1];
      r = a.split(",").map(function(l) {
        return parseFloat(l, 10);
      }), r[12] = t.x, r[13] = t.y, xi(e, "matrix3d(".concat(r.join(","), ")"));
    }
  } else
    xi(e, "translateX(".concat(t.x, "px) translateY(").concat(t.y, "px) translateZ(0)"));
}
var zb = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source, Ao;
function Qs(e) {
  var t = e.style.display;
  e.style.display = "none", e.offsetHeight, e.style.display = t;
}
function On(e, t, n) {
  var o = n;
  if (ha(t) === "object") {
    for (var r in t)
      t.hasOwnProperty(r) && On(e, r, t[r]);
    return;
  }
  if (typeof o < "u") {
    typeof o == "number" && (o = "".concat(o, "px")), e.style[t] = o;
    return;
  }
  return Ao(e, t);
}
function Lb(e) {
  var t, n, o, r = e.ownerDocument, i = r.body, a = r && r.documentElement;
  return t = e.getBoundingClientRect(), n = Math.floor(t.left), o = Math.floor(t.top), n -= a.clientLeft || i.clientLeft || 0, o -= a.clientTop || i.clientTop || 0, {
    left: n,
    top: o
  };
}
function Pf(e, t) {
  var n = e["page".concat(t ? "Y" : "X", "Offset")], o = "scroll".concat(t ? "Top" : "Left");
  if (typeof n != "number") {
    var r = e.document;
    n = r.documentElement[o], typeof n != "number" && (n = r.body[o]);
  }
  return n;
}
function If(e) {
  return Pf(e);
}
function Mf(e) {
  return Pf(e, !0);
}
function yo(e) {
  var t = Lb(e), n = e.ownerDocument, o = n.defaultView || n.parentWindow;
  return t.left += If(o), t.top += Mf(o), t;
}
function nl(e) {
  return e != null && e == e.window;
}
function Nf(e) {
  return nl(e) ? e.document : e.nodeType === 9 ? e : e.ownerDocument;
}
function jb(e, t, n) {
  var o = n, r = "", i = Nf(e);
  return o = o || i.defaultView.getComputedStyle(e, null), o && (r = o.getPropertyValue(t) || o[t]), r;
}
var Bb = new RegExp("^(".concat(zb, ")(?!px)[a-z%]+$"), "i"), Vb = /^(top|right|bottom|left)$/, Oi = "currentStyle", $i = "runtimeStyle", Vt = "left", Wb = "px";
function Kb(e, t) {
  var n = e[Oi] && e[Oi][t];
  if (Bb.test(n) && !Vb.test(t)) {
    var o = e.style, r = o[Vt], i = e[$i][Vt];
    e[$i][Vt] = e[Oi][Vt], o[Vt] = t === "fontSize" ? "1em" : n || 0, n = o.pixelLeft + Wb, o[Vt] = r, e[$i][Vt] = i;
  }
  return n === "" ? "auto" : n;
}
typeof window < "u" && (Ao = window.getComputedStyle ? jb : Kb);
function er(e, t) {
  return e === "left" ? t.useCssRight ? "right" : e : t.useCssBottom ? "bottom" : e;
}
function Js(e) {
  if (e === "left")
    return "right";
  if (e === "right")
    return "left";
  if (e === "top")
    return "bottom";
  if (e === "bottom")
    return "top";
}
function Zs(e, t, n) {
  On(e, "position") === "static" && (e.style.position = "relative");
  var o = -999, r = -999, i = er("left", n), a = er("top", n), l = Js(i), c = Js(a);
  i !== "left" && (o = 999), a !== "top" && (r = 999);
  var s = "", d = yo(e);
  ("left" in t || "top" in t) && (s = Ab(e) || "", qs(e, "none")), "left" in t && (e.style[l] = "", e.style[i] = "".concat(o, "px")), "top" in t && (e.style[c] = "", e.style[a] = "".concat(r, "px")), Qs(e);
  var u = yo(e), f = {};
  for (var p in t)
    if (t.hasOwnProperty(p)) {
      var h = er(p, n), m = p === "left" ? o : r, w = d[p] - u[p];
      h === p ? f[h] = m + w : f[h] = m - w;
    }
  On(e, f), Qs(e), ("left" in t || "top" in t) && qs(e, s);
  var y = {};
  for (var S in t)
    if (t.hasOwnProperty(S)) {
      var _ = er(S, n), C = t[S] - d[S];
      S === _ ? y[_] = f[_] + C : y[_] = f[_] - C;
    }
  On(e, y);
}
function Ub(e, t) {
  var n = yo(e), o = Db(e), r = {
    x: o.x,
    y: o.y
  };
  "left" in t && (r.x = o.x + t.left - n.left), "top" in t && (r.y = o.y + t.top - n.top), Fb(e, r);
}
function Xb(e, t, n) {
  if (n.ignoreShake) {
    var o = yo(e), r = o.left.toFixed(0), i = o.top.toFixed(0), a = t.left.toFixed(0), l = t.top.toFixed(0);
    if (r === a && i === l)
      return;
  }
  n.useCssRight || n.useCssBottom ? Zs(e, t, n) : n.useCssTransform && Jr() in document.body.style ? Ub(e, t) : Zs(e, t, n);
}
function ol(e, t) {
  for (var n = 0; n < e.length; n++)
    t(e[n]);
}
function Af(e) {
  return Ao(e, "boxSizing") === "border-box";
}
var Gb = ["margin", "border", "padding"], ga = -1, kb = 2, ma = 1, Yb = 0;
function qb(e, t, n) {
  var o = {}, r = e.style, i;
  for (i in t)
    t.hasOwnProperty(i) && (o[i] = r[i], r[i] = t[i]);
  n.call(e);
  for (i in t)
    t.hasOwnProperty(i) && (r[i] = o[i]);
}
function Jn(e, t, n) {
  var o = 0, r, i, a;
  for (i = 0; i < t.length; i++)
    if (r = t[i], r)
      for (a = 0; a < n.length; a++) {
        var l = void 0;
        r === "border" ? l = "".concat(r).concat(n[a], "Width") : l = r + n[a], o += parseFloat(Ao(e, l)) || 0;
      }
  return o;
}
var ct = {
  getParent: function(t) {
    var n = t;
    do
      n.nodeType === 11 && n.host ? n = n.host : n = n.parentNode;
    while (n && n.nodeType !== 1 && n.nodeType !== 9);
    return n;
  }
};
ol(["Width", "Height"], function(e) {
  ct["doc".concat(e)] = function(t) {
    var n = t.document;
    return Math.max(
      // firefox chrome documentElement.scrollHeight< body.scrollHeight
      // ie standard mode : documentElement.scrollHeight> body.scrollHeight
      n.documentElement["scroll".concat(e)],
      // quirks : documentElement.scrollHeight 最大等于可视窗口多一点？
      n.body["scroll".concat(e)],
      ct["viewport".concat(e)](n)
    );
  }, ct["viewport".concat(e)] = function(t) {
    var n = "client".concat(e), o = t.document, r = o.body, i = o.documentElement, a = i[n];
    return o.compatMode === "CSS1Compat" && a || r && r[n] || a;
  };
});
function ec(e, t, n) {
  var o = n;
  if (nl(e))
    return t === "width" ? ct.viewportWidth(e) : ct.viewportHeight(e);
  if (e.nodeType === 9)
    return t === "width" ? ct.docWidth(e) : ct.docHeight(e);
  var r = t === "width" ? ["Left", "Right"] : ["Top", "Bottom"], i = Math.floor(t === "width" ? e.getBoundingClientRect().width : e.getBoundingClientRect().height), a = Af(e), l = 0;
  (i == null || i <= 0) && (i = void 0, l = Ao(e, t), (l == null || Number(l) < 0) && (l = e.style[t] || 0), l = Math.floor(parseFloat(l)) || 0), o === void 0 && (o = a ? ma : ga);
  var c = i !== void 0 || a, s = i || l;
  return o === ga ? c ? s - Jn(e, ["border", "padding"], r) : l : c ? o === ma ? s : s + (o === kb ? -Jn(e, ["border"], r) : Jn(e, ["margin"], r)) : l + Jn(e, Gb.slice(o), r);
}
var Qb = {
  position: "absolute",
  visibility: "hidden",
  display: "block"
};
function tc() {
  for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
    t[n] = arguments[n];
  var o, r = t[0];
  return r.offsetWidth !== 0 ? o = ec.apply(void 0, t) : qb(r, Qb, function() {
    o = ec.apply(void 0, t);
  }), o;
}
ol(["width", "height"], function(e) {
  var t = e.charAt(0).toUpperCase() + e.slice(1);
  ct["outer".concat(t)] = function(o, r) {
    return o && tc(o, e, r ? Yb : ma);
  };
  var n = e === "width" ? ["Left", "Right"] : ["Top", "Bottom"];
  ct[e] = function(o, r) {
    var i = r;
    if (i !== void 0) {
      if (o) {
        var a = Af(o);
        return a && (i += Jn(o, ["padding", "border"], n)), On(o, e, i);
      }
      return;
    }
    return o && tc(o, e, ga);
  };
});
function Df(e, t) {
  for (var n in t)
    t.hasOwnProperty(n) && (e[n] = t[n]);
  return e;
}
var q = {
  getWindow: function(t) {
    if (t && t.document && t.setTimeout)
      return t;
    var n = t.ownerDocument || t;
    return n.defaultView || n.parentWindow;
  },
  getDocument: Nf,
  offset: function(t, n, o) {
    if (typeof n < "u")
      Xb(t, n, o || {});
    else
      return yo(t);
  },
  isWindow: nl,
  each: ol,
  css: On,
  clone: function(t) {
    var n, o = {};
    for (n in t)
      t.hasOwnProperty(n) && (o[n] = t[n]);
    var r = t.overflow;
    if (r)
      for (n in t)
        t.hasOwnProperty(n) && (o.overflow[n] = t.overflow[n]);
    return o;
  },
  mix: Df,
  getWindowScrollLeft: function(t) {
    return If(t);
  },
  getWindowScrollTop: function(t) {
    return Mf(t);
  },
  merge: function() {
    for (var t = {}, n = 0; n < arguments.length; n++)
      q.mix(t, n < 0 || arguments.length <= n ? void 0 : arguments[n]);
    return t;
  },
  viewportWidth: 0,
  viewportHeight: 0
};
Df(q, ct);
var _i = q.getParent;
function va(e) {
  if (q.isWindow(e) || e.nodeType === 9)
    return null;
  var t = q.getDocument(e), n = t.body, o, r = q.css(e, "position"), i = r === "fixed" || r === "absolute";
  if (!i)
    return e.nodeName.toLowerCase() === "html" ? null : _i(e);
  for (o = _i(e); o && o !== n && o.nodeType !== 9; o = _i(o))
    if (r = q.css(o, "position"), r !== "static")
      return o;
  return null;
}
var nc = q.getParent;
function Jb(e) {
  if (q.isWindow(e) || e.nodeType === 9)
    return !1;
  var t = q.getDocument(e), n = t.body, o = null;
  for (
    o = nc(e);
    // 修复元素位于 document.documentElement 下导致崩溃问题
    o && o !== n && o !== t;
    o = nc(o)
  ) {
    var r = q.css(o, "position");
    if (r === "fixed")
      return !0;
  }
  return !1;
}
function rl(e, t) {
  for (var n = {
    left: 0,
    right: 1 / 0,
    top: 0,
    bottom: 1 / 0
  }, o = va(e), r = q.getDocument(e), i = r.defaultView || r.parentWindow, a = r.body, l = r.documentElement; o; ) {
    if ((navigator.userAgent.indexOf("MSIE") === -1 || o.clientWidth !== 0) && // body may have overflow set on it, yet we still get the entire
    // viewport. In some browsers, el.offsetParent may be
    // document.documentElement, so check for that too.
    o !== a && o !== l && q.css(o, "overflow") !== "visible") {
      var c = q.offset(o);
      c.left += o.clientLeft, c.top += o.clientTop, n.top = Math.max(n.top, c.top), n.right = Math.min(
        n.right,
        // consider area without scrollBar
        c.left + o.clientWidth
      ), n.bottom = Math.min(n.bottom, c.top + o.clientHeight), n.left = Math.max(n.left, c.left);
    } else if (o === a || o === l)
      break;
    o = va(o);
  }
  var s = null;
  if (!q.isWindow(e) && e.nodeType !== 9) {
    s = e.style.position;
    var d = q.css(e, "position");
    d === "absolute" && (e.style.position = "fixed");
  }
  var u = q.getWindowScrollLeft(i), f = q.getWindowScrollTop(i), p = q.viewportWidth(i), h = q.viewportHeight(i), m = l.scrollWidth, w = l.scrollHeight, y = window.getComputedStyle(a);
  if (y.overflowX === "hidden" && (m = i.innerWidth), y.overflowY === "hidden" && (w = i.innerHeight), e.style && (e.style.position = s), t || Jb(e))
    n.left = Math.max(n.left, u), n.top = Math.max(n.top, f), n.right = Math.min(n.right, u + p), n.bottom = Math.min(n.bottom, f + h);
  else {
    var S = Math.max(m, u + p);
    n.right = Math.min(n.right, S);
    var _ = Math.max(w, f + h);
    n.bottom = Math.min(n.bottom, _);
  }
  return n.top >= 0 && n.left >= 0 && n.bottom > n.top && n.right > n.left ? n : null;
}
function Zb(e, t, n, o) {
  var r = q.clone(e), i = {
    width: t.width,
    height: t.height
  };
  return o.adjustX && r.left < n.left && (r.left = n.left), o.resizeWidth && r.left >= n.left && r.left + i.width > n.right && (i.width -= r.left + i.width - n.right), o.adjustX && r.left + i.width > n.right && (r.left = Math.max(n.right - i.width, n.left)), o.adjustY && r.top < n.top && (r.top = n.top), o.resizeHeight && r.top >= n.top && r.top + i.height > n.bottom && (i.height -= r.top + i.height - n.bottom), o.adjustY && r.top + i.height > n.bottom && (r.top = Math.max(n.bottom - i.height, n.top)), q.mix(r, i);
}
function il(e) {
  var t, n, o;
  if (!q.isWindow(e) && e.nodeType !== 9)
    t = q.offset(e), n = q.outerWidth(e), o = q.outerHeight(e);
  else {
    var r = q.getWindow(e);
    t = {
      left: q.getWindowScrollLeft(r),
      top: q.getWindowScrollTop(r)
    }, n = q.viewportWidth(r), o = q.viewportHeight(r);
  }
  return t.width = n, t.height = o, t;
}
function oc(e, t) {
  var n = t.charAt(0), o = t.charAt(1), r = e.width, i = e.height, a = e.left, l = e.top;
  return n === "c" ? l += i / 2 : n === "b" && (l += i), o === "c" ? a += r / 2 : o === "r" && (a += r), {
    left: a,
    top: l
  };
}
function tr(e, t, n, o, r) {
  var i = oc(t, n[1]), a = oc(e, n[0]), l = [a.left - i.left, a.top - i.top];
  return {
    left: Math.round(e.left - l[0] + o[0] - r[0]),
    top: Math.round(e.top - l[1] + o[1] - r[1])
  };
}
function rc(e, t, n) {
  return e.left < n.left || e.left + t.width > n.right;
}
function ic(e, t, n) {
  return e.top < n.top || e.top + t.height > n.bottom;
}
function ey(e, t, n) {
  return e.left > n.right || e.left + t.width < n.left;
}
function ty(e, t, n) {
  return e.top > n.bottom || e.top + t.height < n.top;
}
function nr(e, t, n) {
  var o = [];
  return q.each(e, function(r) {
    o.push(r.replace(t, function(i) {
      return n[i];
    }));
  }), o;
}
function or(e, t) {
  return e[t] = -e[t], e;
}
function ac(e, t) {
  var n;
  return /%$/.test(e) ? n = parseInt(e.substring(0, e.length - 1), 10) / 100 * t : n = parseInt(e, 10), n || 0;
}
function lc(e, t) {
  e[0] = ac(e[0], t.width), e[1] = ac(e[1], t.height);
}
function Rf(e, t, n, o) {
  var r = n.points, i = n.offset || [0, 0], a = n.targetOffset || [0, 0], l = n.overflow, c = n.source || e;
  i = [].concat(i), a = [].concat(a), l = l || {};
  var s = {}, d = 0, u = !!(l && l.alwaysByViewport), f = rl(c, u), p = il(c);
  lc(i, p), lc(a, t);
  var h = tr(p, t, r, i, a), m = q.merge(p, h);
  if (f && (l.adjustX || l.adjustY) && o) {
    if (l.adjustX && rc(h, p, f)) {
      var w = nr(r, /[lr]/gi, {
        l: "r",
        r: "l"
      }), y = or(i, 0), S = or(a, 0), _ = tr(p, t, w, y, S);
      ey(_, p, f) || (d = 1, r = w, i = y, a = S);
    }
    if (l.adjustY && ic(h, p, f)) {
      var C = nr(r, /[tb]/gi, {
        t: "b",
        b: "t"
      }), x = or(i, 1), O = or(a, 1), b = tr(p, t, C, x, O);
      ty(b, p, f) || (d = 1, r = C, i = x, a = O);
    }
    d && (h = tr(p, t, r, i, a), q.mix(m, h));
    var $ = rc(h, p, f), T = ic(h, p, f);
    if ($ || T) {
      var R = r;
      $ && (R = nr(r, /[lr]/gi, {
        l: "r",
        r: "l"
      })), T && (R = nr(r, /[tb]/gi, {
        t: "b",
        b: "t"
      })), r = R, i = n.offset || [0, 0], a = n.targetOffset || [0, 0];
    }
    s.adjustX = l.adjustX && $, s.adjustY = l.adjustY && T, (s.adjustX || s.adjustY) && (m = Zb(h, p, f, s));
  }
  return m.width !== p.width && q.css(c, "width", q.width(c) + m.width - p.width), m.height !== p.height && q.css(c, "height", q.height(c) + m.height - p.height), q.offset(c, {
    left: m.left,
    top: m.top
  }, {
    useCssRight: n.useCssRight,
    useCssBottom: n.useCssBottom,
    useCssTransform: n.useCssTransform,
    ignoreShake: n.ignoreShake
  }), {
    points: r,
    offset: i,
    targetOffset: a,
    overflow: s
  };
}
function ny(e, t) {
  var n = rl(e, t), o = il(e);
  return !n || o.left + o.width <= n.left || o.top + o.height <= n.top || o.left >= n.right || o.top >= n.bottom;
}
function al(e, t, n) {
  var o = n.target || t, r = il(o), i = !ny(o, n.overflow && n.overflow.alwaysByViewport);
  return Rf(e, r, n, i);
}
al.__getOffsetParent = va;
al.__getVisibleRectForElement = rl;
function oy(e, t, n) {
  var o, r, i = q.getDocument(e), a = i.defaultView || i.parentWindow, l = q.getWindowScrollLeft(a), c = q.getWindowScrollTop(a), s = q.viewportWidth(a), d = q.viewportHeight(a);
  "pageX" in t ? o = t.pageX : o = l + t.clientX, "pageY" in t ? r = t.pageY : r = c + t.clientY;
  var u = {
    left: o,
    top: r,
    width: 0,
    height: 0
  }, f = o >= 0 && o <= l + s && r >= 0 && r <= c + d, p = [n.points[0], "cc"];
  return Rf(e, u, Ys(Ys({}, n), {}, {
    points: p
  }), f);
}
function Nn(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0, o = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !1, r = e;
  if (Array.isArray(e) && (r = Io(e)[0]), !r)
    return null;
  const i = ot(r, t, o);
  return i.props = n ? g(g({}, i.props), t) : i.props, Wd(typeof i.props.class != "object", "class must be string"), i;
}
const ry = (e) => {
  if (!e)
    return !1;
  if (e.offsetParent)
    return !0;
  if (e.getBBox) {
    const t = e.getBBox();
    if (t.width || t.height)
      return !0;
  }
  if (e.getBoundingClientRect) {
    const t = e.getBoundingClientRect();
    if (t.width || t.height)
      return !0;
  }
  return !1;
};
function iy(e, t) {
  return e === t ? !0 : !e || !t ? !1 : "pageX" in t && "pageY" in t ? e.pageX === t.pageX && e.pageY === t.pageY : "clientX" in t && "clientY" in t ? e.clientX === t.clientX && e.clientY === t.clientY : !1;
}
function ay(e, t) {
  e !== document.activeElement && Gt(t, e) && typeof e.focus == "function" && e.focus();
}
function sc(e, t) {
  let n = null, o = null;
  function r(a) {
    let [{
      target: l
    }] = a;
    if (!document.documentElement.contains(l))
      return;
    const {
      width: c,
      height: s
    } = l.getBoundingClientRect(), d = Math.floor(c), u = Math.floor(s);
    (n !== d || o !== u) && Promise.resolve().then(() => {
      t({
        width: d,
        height: u
      });
    }), n = d, o = u;
  }
  const i = new bd(r);
  return e && i.observe(e), () => {
    i.disconnect();
  };
}
const ly = (e, t) => {
  let n = !1, o = null;
  function r() {
    clearTimeout(o);
  }
  function i(a) {
    if (!n || a === !0) {
      if (e() === !1)
        return;
      n = !0, r(), o = setTimeout(() => {
        n = !1;
      }, t.value);
    } else
      r(), o = setTimeout(() => {
        n = !1, i();
      }, t.value);
  }
  return [i, () => {
    n = !1, r();
  }];
};
function sy() {
  this.__data__ = [], this.size = 0;
}
function Hf(e, t) {
  return e === t || e !== e && t !== t;
}
function Zr(e, t) {
  for (var n = e.length; n--; )
    if (Hf(e[n][0], t))
      return n;
  return -1;
}
var cy = Array.prototype, uy = cy.splice;
function dy(e) {
  var t = this.__data__, n = Zr(t, e);
  if (n < 0)
    return !1;
  var o = t.length - 1;
  return n == o ? t.pop() : uy.call(t, n, 1), --this.size, !0;
}
function fy(e) {
  var t = this.__data__, n = Zr(t, e);
  return n < 0 ? void 0 : t[n][1];
}
function py(e) {
  return Zr(this.__data__, e) > -1;
}
function hy(e, t) {
  var n = this.__data__, o = Zr(n, e);
  return o < 0 ? (++this.size, n.push([e, t])) : n[o][1] = t, this;
}
function Ct(e) {
  var t = -1, n = e == null ? 0 : e.length;
  for (this.clear(); ++t < n; ) {
    var o = e[t];
    this.set(o[0], o[1]);
  }
}
Ct.prototype.clear = sy;
Ct.prototype.delete = dy;
Ct.prototype.get = fy;
Ct.prototype.has = py;
Ct.prototype.set = hy;
function gy() {
  this.__data__ = new Ct(), this.size = 0;
}
function my(e) {
  var t = this.__data__, n = t.delete(e);
  return this.size = t.size, n;
}
function vy(e) {
  return this.__data__.get(e);
}
function by(e) {
  return this.__data__.has(e);
}
var yy = typeof global == "object" && global && global.Object === Object && global;
const Ff = yy;
var Sy = typeof self == "object" && self && self.Object === Object && self, wy = Ff || Sy || Function("return this")();
const xt = wy;
var Cy = xt.Symbol;
const An = Cy;
var zf = Object.prototype, xy = zf.hasOwnProperty, Oy = zf.toString, Gn = An ? An.toStringTag : void 0;
function $y(e) {
  var t = xy.call(e, Gn), n = e[Gn];
  try {
    e[Gn] = void 0;
    var o = !0;
  } catch {
  }
  var r = Oy.call(e);
  return o && (t ? e[Gn] = n : delete e[Gn]), r;
}
var _y = Object.prototype, Ey = _y.toString;
function Ty(e) {
  return Ey.call(e);
}
var Py = "[object Null]", Iy = "[object Undefined]", cc = An ? An.toStringTag : void 0;
function Do(e) {
  return e == null ? e === void 0 ? Iy : Py : cc && cc in Object(e) ? $y(e) : Ty(e);
}
function Lf(e) {
  var t = typeof e;
  return e != null && (t == "object" || t == "function");
}
var My = "[object AsyncFunction]", Ny = "[object Function]", Ay = "[object GeneratorFunction]", Dy = "[object Proxy]";
function jf(e) {
  if (!Lf(e))
    return !1;
  var t = Do(e);
  return t == Ny || t == Ay || t == My || t == Dy;
}
var Ry = xt["__core-js_shared__"];
const Ei = Ry;
var uc = function() {
  var e = /[^.]+$/.exec(Ei && Ei.keys && Ei.keys.IE_PROTO || "");
  return e ? "Symbol(src)_1." + e : "";
}();
function Hy(e) {
  return !!uc && uc in e;
}
var Fy = Function.prototype, zy = Fy.toString;
function dn(e) {
  if (e != null) {
    try {
      return zy.call(e);
    } catch {
    }
    try {
      return e + "";
    } catch {
    }
  }
  return "";
}
var Ly = /[\\^$.*+?()[\]{}|]/g, jy = /^\[object .+?Constructor\]$/, By = Function.prototype, Vy = Object.prototype, Wy = By.toString, Ky = Vy.hasOwnProperty, Uy = RegExp(
  "^" + Wy.call(Ky).replace(Ly, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function Xy(e) {
  if (!Lf(e) || Hy(e))
    return !1;
  var t = jf(e) ? Uy : jy;
  return t.test(dn(e));
}
function Gy(e, t) {
  return e == null ? void 0 : e[t];
}
function Fn(e, t) {
  var n = Gy(e, t);
  return Xy(n) ? n : void 0;
}
var ky = Fn(xt, "Map");
const So = ky;
var Yy = Fn(Object, "create");
const wo = Yy;
function qy() {
  this.__data__ = wo ? wo(null) : {}, this.size = 0;
}
function Qy(e) {
  var t = this.has(e) && delete this.__data__[e];
  return this.size -= t ? 1 : 0, t;
}
var Jy = "__lodash_hash_undefined__", Zy = Object.prototype, eS = Zy.hasOwnProperty;
function tS(e) {
  var t = this.__data__;
  if (wo) {
    var n = t[e];
    return n === Jy ? void 0 : n;
  }
  return eS.call(t, e) ? t[e] : void 0;
}
var nS = Object.prototype, oS = nS.hasOwnProperty;
function rS(e) {
  var t = this.__data__;
  return wo ? t[e] !== void 0 : oS.call(t, e);
}
var iS = "__lodash_hash_undefined__";
function aS(e, t) {
  var n = this.__data__;
  return this.size += this.has(e) ? 0 : 1, n[e] = wo && t === void 0 ? iS : t, this;
}
function sn(e) {
  var t = -1, n = e == null ? 0 : e.length;
  for (this.clear(); ++t < n; ) {
    var o = e[t];
    this.set(o[0], o[1]);
  }
}
sn.prototype.clear = qy;
sn.prototype.delete = Qy;
sn.prototype.get = tS;
sn.prototype.has = rS;
sn.prototype.set = aS;
function lS() {
  this.size = 0, this.__data__ = {
    hash: new sn(),
    map: new (So || Ct)(),
    string: new sn()
  };
}
function sS(e) {
  var t = typeof e;
  return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? e !== "__proto__" : e === null;
}
function ei(e, t) {
  var n = e.__data__;
  return sS(t) ? n[typeof t == "string" ? "string" : "hash"] : n.map;
}
function cS(e) {
  var t = ei(this, e).delete(e);
  return this.size -= t ? 1 : 0, t;
}
function uS(e) {
  return ei(this, e).get(e);
}
function dS(e) {
  return ei(this, e).has(e);
}
function fS(e, t) {
  var n = ei(this, e), o = n.size;
  return n.set(e, t), this.size += n.size == o ? 0 : 1, this;
}
function fn(e) {
  var t = -1, n = e == null ? 0 : e.length;
  for (this.clear(); ++t < n; ) {
    var o = e[t];
    this.set(o[0], o[1]);
  }
}
fn.prototype.clear = lS;
fn.prototype.delete = cS;
fn.prototype.get = uS;
fn.prototype.has = dS;
fn.prototype.set = fS;
var pS = 200;
function hS(e, t) {
  var n = this.__data__;
  if (n instanceof Ct) {
    var o = n.__data__;
    if (!So || o.length < pS - 1)
      return o.push([e, t]), this.size = ++n.size, this;
    n = this.__data__ = new fn(o);
  }
  return n.set(e, t), this.size = n.size, this;
}
function Ht(e) {
  var t = this.__data__ = new Ct(e);
  this.size = t.size;
}
Ht.prototype.clear = gy;
Ht.prototype.delete = my;
Ht.prototype.get = vy;
Ht.prototype.has = by;
Ht.prototype.set = hS;
var gS = "__lodash_hash_undefined__";
function mS(e) {
  return this.__data__.set(e, gS), this;
}
function vS(e) {
  return this.__data__.has(e);
}
function Ar(e) {
  var t = -1, n = e == null ? 0 : e.length;
  for (this.__data__ = new fn(); ++t < n; )
    this.add(e[t]);
}
Ar.prototype.add = Ar.prototype.push = mS;
Ar.prototype.has = vS;
function bS(e, t) {
  for (var n = -1, o = e == null ? 0 : e.length; ++n < o; )
    if (t(e[n], n, e))
      return !0;
  return !1;
}
function yS(e, t) {
  return e.has(t);
}
var SS = 1, wS = 2;
function Bf(e, t, n, o, r, i) {
  var a = n & SS, l = e.length, c = t.length;
  if (l != c && !(a && c > l))
    return !1;
  var s = i.get(e), d = i.get(t);
  if (s && d)
    return s == t && d == e;
  var u = -1, f = !0, p = n & wS ? new Ar() : void 0;
  for (i.set(e, t), i.set(t, e); ++u < l; ) {
    var h = e[u], m = t[u];
    if (o)
      var w = a ? o(m, h, u, t, e, i) : o(h, m, u, e, t, i);
    if (w !== void 0) {
      if (w)
        continue;
      f = !1;
      break;
    }
    if (p) {
      if (!bS(t, function(y, S) {
        if (!yS(p, S) && (h === y || r(h, y, n, o, i)))
          return p.push(S);
      })) {
        f = !1;
        break;
      }
    } else if (!(h === m || r(h, m, n, o, i))) {
      f = !1;
      break;
    }
  }
  return i.delete(e), i.delete(t), f;
}
var CS = xt.Uint8Array;
const dc = CS;
function xS(e) {
  var t = -1, n = Array(e.size);
  return e.forEach(function(o, r) {
    n[++t] = [r, o];
  }), n;
}
function OS(e) {
  var t = -1, n = Array(e.size);
  return e.forEach(function(o) {
    n[++t] = o;
  }), n;
}
var $S = 1, _S = 2, ES = "[object Boolean]", TS = "[object Date]", PS = "[object Error]", IS = "[object Map]", MS = "[object Number]", NS = "[object RegExp]", AS = "[object Set]", DS = "[object String]", RS = "[object Symbol]", HS = "[object ArrayBuffer]", FS = "[object DataView]", fc = An ? An.prototype : void 0, Ti = fc ? fc.valueOf : void 0;
function zS(e, t, n, o, r, i, a) {
  switch (n) {
    case FS:
      if (e.byteLength != t.byteLength || e.byteOffset != t.byteOffset)
        return !1;
      e = e.buffer, t = t.buffer;
    case HS:
      return !(e.byteLength != t.byteLength || !i(new dc(e), new dc(t)));
    case ES:
    case TS:
    case MS:
      return Hf(+e, +t);
    case PS:
      return e.name == t.name && e.message == t.message;
    case NS:
    case DS:
      return e == t + "";
    case IS:
      var l = xS;
    case AS:
      var c = o & $S;
      if (l || (l = OS), e.size != t.size && !c)
        return !1;
      var s = a.get(e);
      if (s)
        return s == t;
      o |= _S, a.set(e, t);
      var d = Bf(l(e), l(t), o, r, i, a);
      return a.delete(e), d;
    case RS:
      if (Ti)
        return Ti.call(e) == Ti.call(t);
  }
  return !1;
}
function LS(e, t) {
  for (var n = -1, o = t.length, r = e.length; ++n < o; )
    e[r + n] = t[n];
  return e;
}
var jS = Array.isArray;
const Co = jS;
function BS(e, t, n) {
  var o = t(e);
  return Co(e) ? o : LS(o, n(e));
}
function VS(e, t) {
  for (var n = -1, o = e == null ? 0 : e.length, r = 0, i = []; ++n < o; ) {
    var a = e[n];
    t(a, n, e) && (i[r++] = a);
  }
  return i;
}
function WS() {
  return [];
}
var KS = Object.prototype, US = KS.propertyIsEnumerable, pc = Object.getOwnPropertySymbols, XS = pc ? function(e) {
  return e == null ? [] : (e = Object(e), VS(pc(e), function(t) {
    return US.call(e, t);
  }));
} : WS;
const GS = XS;
function kS(e, t) {
  for (var n = -1, o = Array(e); ++n < e; )
    o[n] = t(n);
  return o;
}
function xo(e) {
  return e != null && typeof e == "object";
}
var YS = "[object Arguments]";
function hc(e) {
  return xo(e) && Do(e) == YS;
}
var Vf = Object.prototype, qS = Vf.hasOwnProperty, QS = Vf.propertyIsEnumerable, JS = hc(function() {
  return arguments;
}()) ? hc : function(e) {
  return xo(e) && qS.call(e, "callee") && !QS.call(e, "callee");
};
const Wf = JS;
function ZS() {
  return !1;
}
var Kf = typeof exports == "object" && exports && !exports.nodeType && exports, gc = Kf && typeof module == "object" && module && !module.nodeType && module, e1 = gc && gc.exports === Kf, mc = e1 ? xt.Buffer : void 0, t1 = mc ? mc.isBuffer : void 0, n1 = t1 || ZS;
const Dr = n1;
var o1 = 9007199254740991, r1 = /^(?:0|[1-9]\d*)$/;
function i1(e, t) {
  var n = typeof e;
  return t = t ?? o1, !!t && (n == "number" || n != "symbol" && r1.test(e)) && e > -1 && e % 1 == 0 && e < t;
}
var a1 = 9007199254740991;
function Uf(e) {
  return typeof e == "number" && e > -1 && e % 1 == 0 && e <= a1;
}
var l1 = "[object Arguments]", s1 = "[object Array]", c1 = "[object Boolean]", u1 = "[object Date]", d1 = "[object Error]", f1 = "[object Function]", p1 = "[object Map]", h1 = "[object Number]", g1 = "[object Object]", m1 = "[object RegExp]", v1 = "[object Set]", b1 = "[object String]", y1 = "[object WeakMap]", S1 = "[object ArrayBuffer]", w1 = "[object DataView]", C1 = "[object Float32Array]", x1 = "[object Float64Array]", O1 = "[object Int8Array]", $1 = "[object Int16Array]", _1 = "[object Int32Array]", E1 = "[object Uint8Array]", T1 = "[object Uint8ClampedArray]", P1 = "[object Uint16Array]", I1 = "[object Uint32Array]", he = {};
he[C1] = he[x1] = he[O1] = he[$1] = he[_1] = he[E1] = he[T1] = he[P1] = he[I1] = !0;
he[l1] = he[s1] = he[S1] = he[c1] = he[w1] = he[u1] = he[d1] = he[f1] = he[p1] = he[h1] = he[g1] = he[m1] = he[v1] = he[b1] = he[y1] = !1;
function M1(e) {
  return xo(e) && Uf(e.length) && !!he[Do(e)];
}
function N1(e) {
  return function(t) {
    return e(t);
  };
}
var Xf = typeof exports == "object" && exports && !exports.nodeType && exports, oo = Xf && typeof module == "object" && module && !module.nodeType && module, A1 = oo && oo.exports === Xf, Pi = A1 && Ff.process, D1 = function() {
  try {
    var e = oo && oo.require && oo.require("util").types;
    return e || Pi && Pi.binding && Pi.binding("util");
  } catch {
  }
}();
const vc = D1;
var bc = vc && vc.isTypedArray, R1 = bc ? N1(bc) : M1;
const ll = R1;
var H1 = Object.prototype, F1 = H1.hasOwnProperty;
function z1(e, t) {
  var n = Co(e), o = !n && Wf(e), r = !n && !o && Dr(e), i = !n && !o && !r && ll(e), a = n || o || r || i, l = a ? kS(e.length, String) : [], c = l.length;
  for (var s in e)
    (t || F1.call(e, s)) && !(a && // Safari 9 has enumerable `arguments.length` in strict mode.
    (s == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
    r && (s == "offset" || s == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    i && (s == "buffer" || s == "byteLength" || s == "byteOffset") || // Skip index properties.
    i1(s, c))) && l.push(s);
  return l;
}
var L1 = Object.prototype;
function Gf(e) {
  var t = e && e.constructor, n = typeof t == "function" && t.prototype || L1;
  return e === n;
}
function j1(e, t) {
  return function(n) {
    return e(t(n));
  };
}
var B1 = j1(Object.keys, Object);
const V1 = B1;
var W1 = Object.prototype, K1 = W1.hasOwnProperty;
function kf(e) {
  if (!Gf(e))
    return V1(e);
  var t = [];
  for (var n in Object(e))
    K1.call(e, n) && n != "constructor" && t.push(n);
  return t;
}
function Yf(e) {
  return e != null && Uf(e.length) && !jf(e);
}
function U1(e) {
  return Yf(e) ? z1(e) : kf(e);
}
function yc(e) {
  return BS(e, U1, GS);
}
var X1 = 1, G1 = Object.prototype, k1 = G1.hasOwnProperty;
function Y1(e, t, n, o, r, i) {
  var a = n & X1, l = yc(e), c = l.length, s = yc(t), d = s.length;
  if (c != d && !a)
    return !1;
  for (var u = c; u--; ) {
    var f = l[u];
    if (!(a ? f in t : k1.call(t, f)))
      return !1;
  }
  var p = i.get(e), h = i.get(t);
  if (p && h)
    return p == t && h == e;
  var m = !0;
  i.set(e, t), i.set(t, e);
  for (var w = a; ++u < c; ) {
    f = l[u];
    var y = e[f], S = t[f];
    if (o)
      var _ = a ? o(S, y, f, t, e, i) : o(y, S, f, e, t, i);
    if (!(_ === void 0 ? y === S || r(y, S, n, o, i) : _)) {
      m = !1;
      break;
    }
    w || (w = f == "constructor");
  }
  if (m && !w) {
    var C = e.constructor, x = t.constructor;
    C != x && "constructor" in e && "constructor" in t && !(typeof C == "function" && C instanceof C && typeof x == "function" && x instanceof x) && (m = !1);
  }
  return i.delete(e), i.delete(t), m;
}
var q1 = Fn(xt, "DataView");
const ba = q1;
var Q1 = Fn(xt, "Promise");
const ya = Q1;
var J1 = Fn(xt, "Set");
const Sa = J1;
var Z1 = Fn(xt, "WeakMap");
const wa = Z1;
var Sc = "[object Map]", ew = "[object Object]", wc = "[object Promise]", Cc = "[object Set]", xc = "[object WeakMap]", Oc = "[object DataView]", tw = dn(ba), nw = dn(So), ow = dn(ya), rw = dn(Sa), iw = dn(wa), Ut = Do;
(ba && Ut(new ba(new ArrayBuffer(1))) != Oc || So && Ut(new So()) != Sc || ya && Ut(ya.resolve()) != wc || Sa && Ut(new Sa()) != Cc || wa && Ut(new wa()) != xc) && (Ut = function(e) {
  var t = Do(e), n = t == ew ? e.constructor : void 0, o = n ? dn(n) : "";
  if (o)
    switch (o) {
      case tw:
        return Oc;
      case nw:
        return Sc;
      case ow:
        return wc;
      case rw:
        return Cc;
      case iw:
        return xc;
    }
  return t;
});
const Ca = Ut;
var aw = 1, $c = "[object Arguments]", _c = "[object Array]", rr = "[object Object]", lw = Object.prototype, Ec = lw.hasOwnProperty;
function sw(e, t, n, o, r, i) {
  var a = Co(e), l = Co(t), c = a ? _c : Ca(e), s = l ? _c : Ca(t);
  c = c == $c ? rr : c, s = s == $c ? rr : s;
  var d = c == rr, u = s == rr, f = c == s;
  if (f && Dr(e)) {
    if (!Dr(t))
      return !1;
    a = !0, d = !1;
  }
  if (f && !d)
    return i || (i = new Ht()), a || ll(e) ? Bf(e, t, n, o, r, i) : zS(e, t, c, n, o, r, i);
  if (!(n & aw)) {
    var p = d && Ec.call(e, "__wrapped__"), h = u && Ec.call(t, "__wrapped__");
    if (p || h) {
      var m = p ? e.value() : e, w = h ? t.value() : t;
      return i || (i = new Ht()), r(m, w, n, o, i);
    }
  }
  return f ? (i || (i = new Ht()), Y1(e, t, n, o, r, i)) : !1;
}
function qf(e, t, n, o, r) {
  return e === t ? !0 : e == null || t == null || !xo(e) && !xo(t) ? e !== e && t !== t : sw(e, t, n, o, qf, r);
}
function cw(e, t) {
  return qf(e, t);
}
const uw = {
  align: Object,
  target: [Object, Function],
  onAlign: Function,
  monitorBufferTime: Number,
  monitorWindowResize: Boolean,
  disabled: Boolean
};
function Tc(e) {
  return typeof e != "function" ? null : e();
}
function Pc(e) {
  return typeof e != "object" || !e ? null : e;
}
const dw = /* @__PURE__ */ Z({
  compatConfig: {
    MODE: 3
  },
  name: "Align",
  props: uw,
  emits: ["align"],
  setup(e, t) {
    let {
      expose: n,
      slots: o
    } = t;
    const r = oe({}), i = oe(), [a, l] = ly(() => {
      const {
        disabled: f,
        target: p,
        align: h,
        onAlign: m
      } = e;
      if (!f && p && i.value) {
        const w = i.value;
        let y;
        const S = Tc(p), _ = Pc(p);
        r.value.element = S, r.value.point = _, r.value.align = h;
        const {
          activeElement: C
        } = document;
        return S && ry(S) ? y = al(w, S, h) : _ && (y = oy(w, _, h)), ay(C, w), m && y && m(w, y), !0;
      }
      return !1;
    }, E(() => e.monitorBufferTime)), c = oe({
      cancel: () => {
      }
    }), s = oe({
      cancel: () => {
      }
    }), d = () => {
      const f = e.target, p = Tc(f), h = Pc(f);
      i.value !== s.value.element && (s.value.cancel(), s.value.element = i.value, s.value.cancel = sc(i.value, a)), (r.value.element !== p || !iy(r.value.point, h) || !cw(r.value.align, e.align)) && (a(), c.value.element !== p && (c.value.cancel(), c.value.element = p, c.value.cancel = sc(p, a)));
    };
    De(() => {
      ke(() => {
        d();
      });
    }), Eo(() => {
      ke(() => {
        d();
      });
    }), ae(() => e.disabled, (f) => {
      f ? l() : a();
    }, {
      immediate: !0,
      flush: "post"
    });
    const u = oe(null);
    return ae(() => e.monitorWindowResize, (f) => {
      f ? u.value || (u.value = Qn(window, "resize", a)) : u.value && (u.value.remove(), u.value = null);
    }, {
      flush: "post"
    }), To(() => {
      c.value.cancel(), s.value.cancel(), u.value && u.value.remove(), l();
    }), n({
      forceAlign: () => a(!0)
    }), () => {
      const f = o == null ? void 0 : o.default();
      return f ? Nn(f[0], {
        ref: i
      }, !0, !0) : null;
    };
  }
});
_r("bottomLeft", "bottomRight", "topLeft", "topRight");
const fw = (e) => e !== void 0 && (e === "topLeft" || e === "topRight") ? "slide-down" : "slide-up", pw = function(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  return g(e ? {
    name: e,
    appear: !0,
    // type: 'animation',
    // appearFromClass: `${transitionName}-appear ${transitionName}-appear-prepare`,
    // appearActiveClass: `antdv-base-transtion`,
    // appearToClass: `${transitionName}-appear ${transitionName}-appear-active`,
    enterFromClass: `${e}-enter ${e}-enter-prepare ${e}-enter-start`,
    enterActiveClass: `${e}-enter ${e}-enter-prepare`,
    enterToClass: `${e}-enter ${e}-enter-active`,
    leaveFromClass: ` ${e}-leave`,
    leaveActiveClass: `${e}-leave ${e}-leave-active`,
    leaveToClass: `${e}-leave ${e}-leave-active`
  } : {
    css: !1
  }, t);
}, hw = (e, t, n) => n !== void 0 ? n : `${e}-${t}`, gw = /* @__PURE__ */ Z({
  compatConfig: {
    MODE: 3
  },
  name: "PopupInner",
  inheritAttrs: !1,
  props: tl,
  emits: ["mouseenter", "mouseleave", "mousedown", "touchstart", "align"],
  setup(e, t) {
    let {
      expose: n,
      attrs: o,
      slots: r
    } = t;
    const i = V(), a = V(), l = V(), [c, s] = Ib(at(e, "stretch")), d = () => {
      e.stretch && s(e.getRootDomNode());
    }, u = V(!1);
    let f;
    ae(() => e.visible, (O) => {
      clearTimeout(f), O ? f = setTimeout(() => {
        u.value = e.visible;
      }) : u.value = !1;
    }, {
      immediate: !0
    });
    const [p, h] = Pb(u, d), m = V(), w = () => e.point ? e.point : e.getRootDomNode, y = () => {
      var O;
      (O = i.value) === null || O === void 0 || O.forceAlign();
    }, S = (O, b) => {
      var $;
      const T = e.getClassNameFromAlign(b), R = l.value;
      l.value !== T && (l.value = T), p.value === "align" && (R !== T ? Promise.resolve().then(() => {
        y();
      }) : h(() => {
        var H;
        (H = m.value) === null || H === void 0 || H.call(m);
      }), ($ = e.onAlign) === null || $ === void 0 || $.call(e, O, b));
    }, _ = E(() => {
      const O = typeof e.animation == "object" ? e.animation : _f(e);
      return ["onAfterEnter", "onAfterLeave"].forEach((b) => {
        const $ = O[b];
        O[b] = (T) => {
          h(), p.value = "stable", $ == null || $(T);
        };
      }), O;
    }), C = () => new Promise((O) => {
      m.value = O;
    });
    ae([_, p], () => {
      !_.value && p.value === "motion" && h();
    }, {
      immediate: !0
    }), n({
      forceAlign: y,
      getElement: () => a.value.$el || a.value
    });
    const x = E(() => {
      var O;
      return !(!((O = e.align) === null || O === void 0) && O.points && (p.value === "align" || p.value === "stable"));
    });
    return () => {
      var O;
      const {
        zIndex: b,
        align: $,
        prefixCls: T,
        destroyPopupOnHide: R,
        onMouseenter: H,
        onMouseleave: N,
        onTouchstart: j = () => {
        },
        onMousedown: B
      } = e, F = p.value, L = [g(g({}, c.value), {
        zIndex: b,
        opacity: F === "motion" || F === "stable" || !u.value ? null : 0,
        // pointerEvents: statusValue === 'stable' ? null : 'none',
        pointerEvents: !u.value && F !== "stable" ? "none" : null
      }), o.style];
      let Y = tt((O = r.default) === null || O === void 0 ? void 0 : O.call(r, {
        visible: e.visible
      }));
      Y.length > 1 && (Y = v("div", {
        class: `${T}-content`
      }, [Y]));
      const re = ne(T, o.class, l.value), K = u.value || !e.visible ? pw(_.value.name, _.value) : {};
      return v(Po, U(U({
        ref: a
      }, K), {}, {
        onBeforeEnter: C
      }), {
        default: () => !R || e.visible ? Dn(v(dw, {
          target: w(),
          key: "popup",
          ref: i,
          monitorWindowResize: !0,
          disabled: x.value,
          align: $,
          onAlign: S
        }, {
          default: () => v("div", {
            class: re,
            onMouseenter: H,
            onMouseleave: N,
            onMousedown: ms(B, ["capture"]),
            [Re ? "onTouchstartPassive" : "onTouchstart"]: ms(j, ["capture"]),
            style: L
          }, [Y])
        }), [[tm, u.value]]) : null
      });
    };
  }
}), mw = /* @__PURE__ */ Z({
  compatConfig: {
    MODE: 3
  },
  name: "Popup",
  inheritAttrs: !1,
  props: _b,
  setup(e, t) {
    let {
      attrs: n,
      slots: o,
      expose: r
    } = t;
    const i = V(!1), a = V(!1), l = V(), c = V();
    return ae([() => e.visible, () => e.mobile], () => {
      i.value = e.visible, e.visible && e.mobile && (a.value = !0);
    }, {
      immediate: !0,
      flush: "post"
    }), r({
      forceAlign: () => {
        var s;
        (s = l.value) === null || s === void 0 || s.forceAlign();
      },
      getElement: () => {
        var s;
        return (s = l.value) === null || s === void 0 ? void 0 : s.getElement();
      }
    }), () => {
      const s = g(g(g({}, e), n), {
        visible: i.value
      }), d = a.value ? v(Eb, U(U({}, s), {}, {
        mobile: e.mobile,
        ref: l
      }), {
        default: o.default
      }) : v(gw, U(U({}, s), {}, {
        ref: l
      }), {
        default: o.default
      });
      return v("div", {
        ref: c
      }, [v(Ef, s, null), d]);
    };
  }
});
function vw(e, t, n) {
  return n ? e[0] === t[0] : e[0] === t[0] && e[1] === t[1];
}
function Ic(e, t, n) {
  const o = e[t] || {};
  return g(g({}, o), n);
}
function bw(e, t, n, o) {
  const {
    points: r
  } = n, i = Object.keys(e);
  for (let a = 0; a < i.length; a += 1) {
    const l = i[a];
    if (vw(e[l].points, r, o))
      return `${t}-placement-${l}`;
  }
  return "";
}
const Qf = {
  methods: {
    setState() {
      let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, t = arguments.length > 1 ? arguments[1] : void 0, n = typeof e == "function" ? e(this.$data, this.$props) : e;
      if (this.getDerivedStateFromProps) {
        const o = this.getDerivedStateFromProps(Vm(this), g(g({}, this.$data), n));
        if (o === null)
          return;
        n = g(g({}, n), o || {});
      }
      g(this.$data, n), this._.isMounted && this.$forceUpdate(), ke(() => {
        t && t();
      });
    },
    __emit() {
      const e = [].slice.call(arguments, 0);
      let t = e[0];
      t = `on${t[0].toUpperCase()}${t.substring(1)}`;
      const n = this.$props[t] || this.$attrs[t];
      if (e.length && n)
        if (Array.isArray(n))
          for (let o = 0, r = n.length; o < r; o++)
            n[o](...e.slice(1));
        else
          n(...e.slice(1));
    }
  }
}, Jf = Symbol("PortalContextKey"), Zf = function(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
    inTriggerContext: !0
  };
  dt(Jf, {
    inTriggerContext: t.inTriggerContext,
    shouldRender: E(() => {
      const {
        sPopupVisible: n,
        popupRef: o,
        forceRender: r,
        autoDestroy: i
      } = e || {};
      let a = !1;
      return (n || o || r) && (a = !0), !n && i && (a = !1), a;
    })
  });
}, yw = () => {
  Zf({}, {
    inTriggerContext: !1
  });
  const e = ye(Jf, {
    shouldRender: E(() => !1),
    inTriggerContext: !1
  });
  return {
    shouldRender: E(() => e.shouldRender.value || e.inTriggerContext === !1)
  };
}, Sw = /* @__PURE__ */ Z({
  compatConfig: {
    MODE: 3
  },
  name: "Portal",
  inheritAttrs: !1,
  props: {
    getContainer: P.func.isRequired,
    didUpdate: Function
  },
  setup(e, t) {
    let {
      slots: n
    } = t, o = !0, r;
    const {
      shouldRender: i
    } = yw();
    function a() {
      i.value && (r = e.getContainer());
    }
    Og(() => {
      o = !1, a();
    }), De(() => {
      r || a();
    });
    const l = ae(i, () => {
      i.value && !r && (r = e.getContainer()), r && l();
    });
    return Eo(() => {
      ke(() => {
        var c;
        i.value && ((c = e.didUpdate) === null || c === void 0 || c.call(e, e));
      });
    }), () => {
      var c;
      return i.value ? o ? (c = n.default) === null || c === void 0 ? void 0 : c.call(n) : r ? v(Lg, {
        to: r
      }, n) : null : null;
    };
  }
});
let Ii;
function ww(e) {
  if (typeof document > "u")
    return 0;
  if (e || Ii === void 0) {
    const t = document.createElement("div");
    t.style.width = "100%", t.style.height = "200px";
    const n = document.createElement("div"), o = n.style;
    o.position = "absolute", o.top = "0", o.left = "0", o.pointerEvents = "none", o.visibility = "hidden", o.width = "200px", o.height = "150px", o.overflow = "hidden", n.appendChild(t), document.body.appendChild(n);
    const r = t.offsetWidth;
    n.style.overflow = "scroll";
    let i = t.offsetWidth;
    r === i && (i = n.clientWidth), document.body.removeChild(n), Ii = r - i;
  }
  return Ii;
}
const Cw = `vc-util-locker-${Date.now()}`;
let Mc = 0;
function xw() {
  return document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight) && window.innerWidth > document.body.offsetWidth;
}
function Ow(e) {
  const t = E(() => !!e && !!e.value);
  Mc += 1;
  const n = `${Cw}_${Mc}`;
  ut((o) => {
    if (pt()) {
      if (t.value) {
        const r = ww(), i = xw();
        Pr(`
html body {
  overflow-y: hidden;
  ${i ? `width: calc(100% - ${r}px);` : ""}
}`, n);
      } else
        Tr(n);
      o(() => {
        Tr(n);
      });
    }
  }, {
    flush: "post"
  });
}
let Wt = 0;
const fr = pt(), Nc = (e) => {
  if (!fr)
    return null;
  if (e) {
    if (typeof e == "string")
      return document.querySelectorAll(e)[0];
    if (typeof e == "function")
      return e();
    if (typeof e == "object" && e instanceof window.HTMLElement)
      return e;
  }
  return document.body;
}, $w = /* @__PURE__ */ Z({
  compatConfig: {
    MODE: 3
  },
  name: "PortalWrapper",
  inheritAttrs: !1,
  props: {
    wrapperClassName: String,
    forceRender: {
      type: Boolean,
      default: void 0
    },
    getContainer: P.any,
    visible: {
      type: Boolean,
      default: void 0
    },
    autoLock: Ge(),
    didUpdate: Function
  },
  setup(e, t) {
    let {
      slots: n
    } = t;
    const o = V(), r = V(), i = V(), a = pt() && document.createElement("div"), l = () => {
      var p, h;
      o.value === a && ((h = (p = o.value) === null || p === void 0 ? void 0 : p.parentNode) === null || h === void 0 || h.removeChild(o.value)), o.value = null;
    };
    let c = null;
    const s = function() {
      return (arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !1) || o.value && !o.value.parentNode ? (c = Nc(e.getContainer), c ? (c.appendChild(o.value), !0) : !1) : !0;
    }, d = () => fr ? (o.value || (o.value = a, s(!0)), u(), o.value) : null, u = () => {
      const {
        wrapperClassName: p
      } = e;
      o.value && p && p !== o.value.className && (o.value.className = p);
    };
    Eo(() => {
      u(), s();
    });
    const f = cn();
    return Ow(E(() => e.autoLock && e.visible && pt() && (o.value === document.body || o.value === a))), De(() => {
      let p = !1;
      ae([() => e.visible, () => e.getContainer], (h, m) => {
        let [w, y] = h, [S, _] = m;
        fr && (c = Nc(e.getContainer), c === document.body && (w && !S ? Wt += 1 : p && (Wt -= 1))), p && (typeof y == "function" && typeof _ == "function" ? y.toString() !== _.toString() : y !== _) && l(), p = !0;
      }, {
        immediate: !0,
        flush: "post"
      }), ke(() => {
        s() || (i.value = Oe(() => {
          f.update();
        }));
      });
    }), rt(() => {
      const {
        visible: p
      } = e;
      fr && c === document.body && (Wt = p && Wt ? Wt - 1 : Wt), l(), Oe.cancel(i.value);
    }), () => {
      const {
        forceRender: p,
        visible: h
      } = e;
      let m = null;
      const w = {
        getOpenCount: () => Wt,
        getContainer: d
      };
      return (p || h || r.value) && (m = v(Sw, {
        getContainer: d,
        ref: r,
        didUpdate: e.didUpdate
      }, {
        default: () => {
          var y;
          return (y = n.default) === null || y === void 0 ? void 0 : y.call(n, w);
        }
      })), m;
    };
  }
}), _w = ["onClick", "onMousedown", "onTouchstart", "onMouseenter", "onMouseleave", "onFocus", "onBlur", "onContextmenu"], Ew = /* @__PURE__ */ Z({
  compatConfig: {
    MODE: 3
  },
  name: "Trigger",
  mixins: [Qf],
  inheritAttrs: !1,
  props: Ob(),
  setup(e) {
    const t = E(() => {
      const {
        popupPlacement: r,
        popupAlign: i,
        builtinPlacements: a
      } = e;
      return r && a ? Ic(a, r, i) : i;
    }), n = V(null), o = (r) => {
      n.value = r;
    };
    return {
      vcTriggerContext: ye("vcTriggerContext", {}),
      popupRef: n,
      setPopupRef: o,
      triggerRef: V(null),
      align: t,
      focusTime: null,
      clickOutsideHandler: null,
      contextmenuOutsideHandler1: null,
      contextmenuOutsideHandler2: null,
      touchOutsideHandler: null,
      attachId: null,
      delayTimer: null,
      hasPopupMouseDown: !1,
      preClickTime: null,
      preTouchTime: null,
      mouseDownTimeout: null,
      childOriginEvents: {}
    };
  },
  data() {
    const e = this.$props;
    let t;
    return this.popupVisible !== void 0 ? t = !!e.popupVisible : t = !!e.defaultPopupVisible, _w.forEach((n) => {
      this[`fire${n}`] = (o) => {
        this.fireEvents(n, o);
      };
    }), {
      prevPopupVisible: t,
      sPopupVisible: t,
      point: null
    };
  },
  watch: {
    popupVisible(e) {
      e !== void 0 && (this.prevPopupVisible = this.sPopupVisible, this.sPopupVisible = e);
    }
  },
  created() {
    dt("vcTriggerContext", {
      onPopupMouseDown: this.onPopupMouseDown,
      onPopupMouseenter: this.onPopupMouseenter,
      onPopupMouseleave: this.onPopupMouseleave
    }), Zf(this);
  },
  deactivated() {
    this.setPopupVisible(!1);
  },
  mounted() {
    this.$nextTick(() => {
      this.updatedCal();
    });
  },
  updated() {
    this.$nextTick(() => {
      this.updatedCal();
    });
  },
  beforeUnmount() {
    this.clearDelayTimer(), this.clearOutsideHandler(), clearTimeout(this.mouseDownTimeout), Oe.cancel(this.attachId);
  },
  methods: {
    updatedCal() {
      const e = this.$props;
      if (this.$data.sPopupVisible) {
        let n;
        !this.clickOutsideHandler && (this.isClickToHide() || this.isContextmenuToShow()) && (n = e.getDocument(this.getRootDomNode()), this.clickOutsideHandler = Qn(n, "mousedown", this.onDocumentClick)), this.touchOutsideHandler || (n = n || e.getDocument(this.getRootDomNode()), this.touchOutsideHandler = Qn(n, "touchstart", this.onDocumentClick, Re ? {
          passive: !1
        } : !1)), !this.contextmenuOutsideHandler1 && this.isContextmenuToShow() && (n = n || e.getDocument(this.getRootDomNode()), this.contextmenuOutsideHandler1 = Qn(n, "scroll", this.onContextmenuClose)), !this.contextmenuOutsideHandler2 && this.isContextmenuToShow() && (this.contextmenuOutsideHandler2 = Qn(window, "blur", this.onContextmenuClose));
      } else
        this.clearOutsideHandler();
    },
    onMouseenter(e) {
      const {
        mouseEnterDelay: t
      } = this.$props;
      this.fireEvents("onMouseenter", e), this.delaySetPopupVisible(!0, t, t ? null : e);
    },
    onMouseMove(e) {
      this.fireEvents("onMousemove", e), this.setPoint(e);
    },
    onMouseleave(e) {
      this.fireEvents("onMouseleave", e), this.delaySetPopupVisible(!1, this.$props.mouseLeaveDelay);
    },
    onPopupMouseenter() {
      const {
        vcTriggerContext: e = {}
      } = this;
      e.onPopupMouseenter && e.onPopupMouseenter(), this.clearDelayTimer();
    },
    onPopupMouseleave(e) {
      var t;
      if (e && e.relatedTarget && !e.relatedTarget.setTimeout && Gt((t = this.popupRef) === null || t === void 0 ? void 0 : t.getElement(), e.relatedTarget))
        return;
      this.delaySetPopupVisible(!1, this.$props.mouseLeaveDelay);
      const {
        vcTriggerContext: n = {}
      } = this;
      n.onPopupMouseleave && n.onPopupMouseleave(e);
    },
    onFocus(e) {
      this.fireEvents("onFocus", e), this.clearDelayTimer(), this.isFocusToShow() && (this.focusTime = Date.now(), this.delaySetPopupVisible(!0, this.$props.focusDelay));
    },
    onMousedown(e) {
      this.fireEvents("onMousedown", e), this.preClickTime = Date.now();
    },
    onTouchstart(e) {
      this.fireEvents("onTouchstart", e), this.preTouchTime = Date.now();
    },
    onBlur(e) {
      Gt(e.target, e.relatedTarget || document.activeElement) || (this.fireEvents("onBlur", e), this.clearDelayTimer(), this.isBlurToHide() && this.delaySetPopupVisible(!1, this.$props.blurDelay));
    },
    onContextmenu(e) {
      e.preventDefault(), this.fireEvents("onContextmenu", e), this.setPopupVisible(!0, e);
    },
    onContextmenuClose() {
      this.isContextmenuToShow() && this.close();
    },
    onClick(e) {
      if (this.fireEvents("onClick", e), this.focusTime) {
        let n;
        if (this.preClickTime && this.preTouchTime ? n = Math.min(this.preClickTime, this.preTouchTime) : this.preClickTime ? n = this.preClickTime : this.preTouchTime && (n = this.preTouchTime), Math.abs(n - this.focusTime) < 20)
          return;
        this.focusTime = 0;
      }
      this.preClickTime = 0, this.preTouchTime = 0, this.isClickToShow() && (this.isClickToHide() || this.isBlurToHide()) && e && e.preventDefault && e.preventDefault(), e && e.domEvent && e.domEvent.preventDefault();
      const t = !this.$data.sPopupVisible;
      (this.isClickToHide() && !t || t && this.isClickToShow()) && this.setPopupVisible(!this.$data.sPopupVisible, e);
    },
    onPopupMouseDown() {
      const {
        vcTriggerContext: e = {}
      } = this;
      this.hasPopupMouseDown = !0, clearTimeout(this.mouseDownTimeout), this.mouseDownTimeout = setTimeout(() => {
        this.hasPopupMouseDown = !1;
      }, 0), e.onPopupMouseDown && e.onPopupMouseDown(...arguments);
    },
    onDocumentClick(e) {
      if (this.$props.mask && !this.$props.maskClosable)
        return;
      const t = e.target, n = this.getRootDomNode(), o = this.getPopupDomNode();
      // mousedown on the target should also close popup when action is contextMenu.
      // https://github.com/ant-design/ant-design/issues/29853
      (!Gt(n, t) || this.isContextMenuOnly()) && !Gt(o, t) && !this.hasPopupMouseDown && this.delaySetPopupVisible(!1, 0.1);
    },
    getPopupDomNode() {
      var e;
      return ((e = this.popupRef) === null || e === void 0 ? void 0 : e.getElement()) || null;
    },
    getRootDomNode() {
      var e, t, n, o;
      const {
        getTriggerDOMNode: r
      } = this.$props;
      if (r) {
        const i = ((t = (e = this.triggerRef) === null || e === void 0 ? void 0 : e.$el) === null || t === void 0 ? void 0 : t.nodeName) === "#comment" ? null : qn(this.triggerRef);
        return qn(r(i));
      }
      try {
        const i = ((o = (n = this.triggerRef) === null || n === void 0 ? void 0 : n.$el) === null || o === void 0 ? void 0 : o.nodeName) === "#comment" ? null : qn(this.triggerRef);
        if (i)
          return i;
      } catch {
      }
      return qn(this);
    },
    handleGetPopupClassFromAlign(e) {
      const t = [], n = this.$props, {
        popupPlacement: o,
        builtinPlacements: r,
        prefixCls: i,
        alignPoint: a,
        getPopupClassNameFromAlign: l
      } = n;
      return o && r && t.push(bw(r, i, e, a)), l && t.push(l(e)), t.join(" ");
    },
    getPopupAlign() {
      const e = this.$props, {
        popupPlacement: t,
        popupAlign: n,
        builtinPlacements: o
      } = e;
      return t && o ? Ic(o, t, n) : n;
    },
    getComponent() {
      const e = {};
      this.isMouseEnterToShow() && (e.onMouseenter = this.onPopupMouseenter), this.isMouseLeaveToHide() && (e.onMouseleave = this.onPopupMouseleave), e.onMousedown = this.onPopupMouseDown, e[Re ? "onTouchstartPassive" : "onTouchstart"] = this.onPopupMouseDown;
      const {
        handleGetPopupClassFromAlign: t,
        getRootDomNode: n,
        $attrs: o
      } = this, {
        prefixCls: r,
        destroyPopupOnHide: i,
        popupClassName: a,
        popupAnimation: l,
        popupTransitionName: c,
        popupStyle: s,
        mask: d,
        maskAnimation: u,
        maskTransitionName: f,
        zIndex: p,
        stretch: h,
        alignPoint: m,
        mobile: w,
        forceRender: y
      } = this.$props, {
        sPopupVisible: S,
        point: _
      } = this.$data, C = g(g({
        prefixCls: r,
        destroyPopupOnHide: i,
        visible: S,
        point: m ? _ : null,
        align: this.align,
        animation: l,
        getClassNameFromAlign: t,
        stretch: h,
        getRootDomNode: n,
        mask: d,
        zIndex: p,
        transitionName: c,
        maskAnimation: u,
        maskTransitionName: f,
        class: a,
        style: s,
        onAlign: o.onPopupAlign || $f
      }, e), {
        ref: this.setPopupRef,
        mobile: w,
        forceRender: y
      });
      return v(mw, C, {
        default: this.$slots.popup || (() => Sd(this, "popup"))
      });
    },
    attachParent(e) {
      Oe.cancel(this.attachId);
      const {
        getPopupContainer: t,
        getDocument: n
      } = this.$props, o = this.getRootDomNode();
      let r;
      t ? (o || t.length === 0) && (r = t(o)) : r = n(this.getRootDomNode()).body, r ? r.appendChild(e) : this.attachId = Oe(() => {
        this.attachParent(e);
      });
    },
    getContainer() {
      const {
        $props: e
      } = this, {
        getDocument: t
      } = e, n = t(this.getRootDomNode()).createElement("div");
      return n.style.position = "absolute", n.style.top = "0", n.style.left = "0", n.style.width = "100%", this.attachParent(n), n;
    },
    setPopupVisible(e, t) {
      const {
        alignPoint: n,
        sPopupVisible: o,
        onPopupVisibleChange: r
      } = this;
      this.clearDelayTimer(), o !== e && (vn(this, "popupVisible") || this.setState({
        sPopupVisible: e,
        prevPopupVisible: o
      }), r && r(e)), n && t && e && this.setPoint(t);
    },
    setPoint(e) {
      const {
        alignPoint: t
      } = this.$props;
      !t || !e || this.setState({
        point: {
          pageX: e.pageX,
          pageY: e.pageY
        }
      });
    },
    handlePortalUpdate() {
      this.prevPopupVisible !== this.sPopupVisible && this.afterPopupVisibleChange(this.sPopupVisible);
    },
    delaySetPopupVisible(e, t, n) {
      const o = t * 1e3;
      if (this.clearDelayTimer(), o) {
        const r = n ? {
          pageX: n.pageX,
          pageY: n.pageY
        } : null;
        this.delayTimer = setTimeout(() => {
          this.setPopupVisible(e, r), this.clearDelayTimer();
        }, o);
      } else
        this.setPopupVisible(e, n);
    },
    clearDelayTimer() {
      this.delayTimer && (clearTimeout(this.delayTimer), this.delayTimer = null);
    },
    clearOutsideHandler() {
      this.clickOutsideHandler && (this.clickOutsideHandler.remove(), this.clickOutsideHandler = null), this.contextmenuOutsideHandler1 && (this.contextmenuOutsideHandler1.remove(), this.contextmenuOutsideHandler1 = null), this.contextmenuOutsideHandler2 && (this.contextmenuOutsideHandler2.remove(), this.contextmenuOutsideHandler2 = null), this.touchOutsideHandler && (this.touchOutsideHandler.remove(), this.touchOutsideHandler = null);
    },
    createTwoChains(e) {
      let t = () => {
      };
      const n = Ss(this);
      return this.childOriginEvents[e] && n[e] ? this[`fire${e}`] : (t = this.childOriginEvents[e] || n[e] || t, t);
    },
    isClickToShow() {
      const {
        action: e,
        showAction: t
      } = this.$props;
      return e.indexOf("click") !== -1 || t.indexOf("click") !== -1;
    },
    isContextMenuOnly() {
      const {
        action: e
      } = this.$props;
      return e === "contextmenu" || e.length === 1 && e[0] === "contextmenu";
    },
    isContextmenuToShow() {
      const {
        action: e,
        showAction: t
      } = this.$props;
      return e.indexOf("contextmenu") !== -1 || t.indexOf("contextmenu") !== -1;
    },
    isClickToHide() {
      const {
        action: e,
        hideAction: t
      } = this.$props;
      return e.indexOf("click") !== -1 || t.indexOf("click") !== -1;
    },
    isMouseEnterToShow() {
      const {
        action: e,
        showAction: t
      } = this.$props;
      return e.indexOf("hover") !== -1 || t.indexOf("mouseenter") !== -1;
    },
    isMouseLeaveToHide() {
      const {
        action: e,
        hideAction: t
      } = this.$props;
      return e.indexOf("hover") !== -1 || t.indexOf("mouseleave") !== -1;
    },
    isFocusToShow() {
      const {
        action: e,
        showAction: t
      } = this.$props;
      return e.indexOf("focus") !== -1 || t.indexOf("focus") !== -1;
    },
    isBlurToHide() {
      const {
        action: e,
        hideAction: t
      } = this.$props;
      return e.indexOf("focus") !== -1 || t.indexOf("blur") !== -1;
    },
    forcePopupAlign() {
      var e;
      this.$data.sPopupVisible && ((e = this.popupRef) === null || e === void 0 || e.forceAlign());
    },
    fireEvents(e, t) {
      this.childOriginEvents[e] && this.childOriginEvents[e](t);
      const n = this.$props[e] || this.$attrs[e];
      n && n(t);
    },
    close() {
      this.setPopupVisible(!1);
    }
  },
  render() {
    const {
      $attrs: e
    } = this, t = Io(Bm(this)), {
      alignPoint: n,
      getPopupContainer: o
    } = this.$props, r = t[0];
    this.childOriginEvents = Ss(r);
    const i = {
      key: "trigger"
    };
    this.isContextmenuToShow() ? i.onContextmenu = this.onContextmenu : i.onContextmenu = this.createTwoChains("onContextmenu"), this.isClickToHide() || this.isClickToShow() ? (i.onClick = this.onClick, i.onMousedown = this.onMousedown, i[Re ? "onTouchstartPassive" : "onTouchstart"] = this.onTouchstart) : (i.onClick = this.createTwoChains("onClick"), i.onMousedown = this.createTwoChains("onMousedown"), i[Re ? "onTouchstartPassive" : "onTouchstart"] = this.createTwoChains("onTouchstart")), this.isMouseEnterToShow() ? (i.onMouseenter = this.onMouseenter, n && (i.onMousemove = this.onMouseMove)) : i.onMouseenter = this.createTwoChains("onMouseenter"), this.isMouseLeaveToHide() ? i.onMouseleave = this.onMouseleave : i.onMouseleave = this.createTwoChains("onMouseleave"), this.isFocusToShow() || this.isBlurToHide() ? (i.onFocus = this.onFocus, i.onBlur = this.onBlur) : (i.onFocus = this.createTwoChains("onFocus"), i.onBlur = (s) => {
      s && (!s.relatedTarget || !Gt(s.target, s.relatedTarget)) && this.createTwoChains("onBlur")(s);
    });
    const a = ne(r && r.props && r.props.class, e.class);
    a && (i.class = a);
    const l = Nn(r, g(g({}, i), {
      ref: "triggerRef"
    }), !0, !0), c = v($w, {
      key: "portal",
      getContainer: o && (() => o(this.getRootDomNode())),
      didUpdate: this.handlePortalUpdate,
      visible: this.$data.sPopupVisible
    }, {
      default: this.getComponent
    });
    return v(Me, null, [l, c]);
  }
});
var Tw = globalThis && globalThis.__rest || function(e, t) {
  var n = {};
  for (var o in e)
    Object.prototype.hasOwnProperty.call(e, o) && t.indexOf(o) < 0 && (n[o] = e[o]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var r = 0, o = Object.getOwnPropertySymbols(e); r < o.length; r++)
      t.indexOf(o[r]) < 0 && Object.prototype.propertyIsEnumerable.call(e, o[r]) && (n[o[r]] = e[o[r]]);
  return n;
};
const Pw = (e) => {
  const t = e === !0 ? 0 : 1;
  return {
    bottomLeft: {
      points: ["tl", "bl"],
      offset: [0, 4],
      overflow: {
        adjustX: t,
        adjustY: 1
      }
    },
    bottomRight: {
      points: ["tr", "br"],
      offset: [0, 4],
      overflow: {
        adjustX: t,
        adjustY: 1
      }
    },
    topLeft: {
      points: ["bl", "tl"],
      offset: [0, -4],
      overflow: {
        adjustX: t,
        adjustY: 1
      }
    },
    topRight: {
      points: ["br", "tr"],
      offset: [0, -4],
      overflow: {
        adjustX: t,
        adjustY: 1
      }
    }
  };
}, Iw = /* @__PURE__ */ Z({
  name: "SelectTrigger",
  inheritAttrs: !1,
  props: {
    dropdownAlign: Object,
    visible: {
      type: Boolean,
      default: void 0
    },
    disabled: {
      type: Boolean,
      default: void 0
    },
    dropdownClassName: String,
    dropdownStyle: P.object,
    placement: String,
    empty: {
      type: Boolean,
      default: void 0
    },
    prefixCls: String,
    popupClassName: String,
    animation: String,
    transitionName: String,
    getPopupContainer: Function,
    dropdownRender: Function,
    containerWidth: Number,
    dropdownMatchSelectWidth: P.oneOfType([Number, Boolean]).def(!0),
    popupElement: P.any,
    direction: String,
    getTriggerDOMNode: Function,
    onPopupVisibleChange: Function,
    onPopupMouseEnter: Function,
    onPopupFocusin: Function,
    onPopupFocusout: Function
  },
  setup(e, t) {
    let {
      slots: n,
      attrs: o,
      expose: r
    } = t;
    const i = E(() => {
      const {
        dropdownMatchSelectWidth: l
      } = e;
      return Pw(l);
    }), a = oe();
    return r({
      getPopupElement: () => a.value
    }), () => {
      const l = g(g({}, e), o), {
        empty: c = !1
      } = l, s = Tw(l, ["empty"]), {
        visible: d,
        dropdownAlign: u,
        prefixCls: f,
        popupElement: p,
        dropdownClassName: h,
        dropdownStyle: m,
        direction: w = "ltr",
        placement: y,
        dropdownMatchSelectWidth: S,
        containerWidth: _,
        dropdownRender: C,
        animation: x,
        transitionName: O,
        getPopupContainer: b,
        getTriggerDOMNode: $,
        onPopupVisibleChange: T,
        onPopupMouseEnter: R,
        onPopupFocusin: H,
        onPopupFocusout: N
      } = s, j = `${f}-dropdown`;
      let B = p;
      C && (B = C({
        menuNode: p,
        props: e
      }));
      const F = x ? `${j}-${x}` : O, L = g({
        minWidth: `${_}px`
      }, m);
      return typeof S == "number" ? L.width = `${S}px` : S && (L.width = `${_}px`), v(Ew, U(U({}, e), {}, {
        showAction: T ? ["click"] : [],
        hideAction: T ? ["click"] : [],
        popupPlacement: y || (w === "rtl" ? "bottomRight" : "bottomLeft"),
        builtinPlacements: i.value,
        prefixCls: j,
        popupTransitionName: F,
        popupAlign: u,
        popupVisible: d,
        getPopupContainer: b,
        popupClassName: ne(h, {
          [`${j}-empty`]: c
        }),
        popupStyle: L,
        getTriggerDOMNode: $,
        onPopupVisibleChange: T
      }), {
        default: n.default,
        popup: () => v("div", {
          ref: a,
          onMouseenter: R,
          onFocusin: H,
          onFocusout: N
        }, [B])
      });
    };
  }
}), Mw = Iw, k = {
  /**
   * MAC_ENTER
   */
  MAC_ENTER: 3,
  /**
   * BACKSPACE
   */
  BACKSPACE: 8,
  /**
   * TAB
   */
  TAB: 9,
  /**
   * NUMLOCK on FF/Safari Mac
   */
  NUM_CENTER: 12,
  /**
   * ENTER
   */
  ENTER: 13,
  /**
   * SHIFT
   */
  SHIFT: 16,
  /**
   * CTRL
   */
  CTRL: 17,
  /**
   * ALT
   */
  ALT: 18,
  /**
   * PAUSE
   */
  PAUSE: 19,
  /**
   * CAPS_LOCK
   */
  CAPS_LOCK: 20,
  /**
   * ESC
   */
  ESC: 27,
  /**
   * SPACE
   */
  SPACE: 32,
  /**
   * PAGE_UP
   */
  PAGE_UP: 33,
  /**
   * PAGE_DOWN
   */
  PAGE_DOWN: 34,
  /**
   * END
   */
  END: 35,
  /**
   * HOME
   */
  HOME: 36,
  /**
   * LEFT
   */
  LEFT: 37,
  /**
   * UP
   */
  UP: 38,
  /**
   * RIGHT
   */
  RIGHT: 39,
  /**
   * DOWN
   */
  DOWN: 40,
  /**
   * PRINT_SCREEN
   */
  PRINT_SCREEN: 44,
  /**
   * INSERT
   */
  INSERT: 45,
  /**
   * DELETE
   */
  DELETE: 46,
  /**
   * ZERO
   */
  ZERO: 48,
  /**
   * ONE
   */
  ONE: 49,
  /**
   * TWO
   */
  TWO: 50,
  /**
   * THREE
   */
  THREE: 51,
  /**
   * FOUR
   */
  FOUR: 52,
  /**
   * FIVE
   */
  FIVE: 53,
  /**
   * SIX
   */
  SIX: 54,
  /**
   * SEVEN
   */
  SEVEN: 55,
  /**
   * EIGHT
   */
  EIGHT: 56,
  /**
   * NINE
   */
  NINE: 57,
  /**
   * QUESTION_MARK
   */
  QUESTION_MARK: 63,
  /**
   * A
   */
  A: 65,
  /**
   * B
   */
  B: 66,
  /**
   * C
   */
  C: 67,
  /**
   * D
   */
  D: 68,
  /**
   * E
   */
  E: 69,
  /**
   * F
   */
  F: 70,
  /**
   * G
   */
  G: 71,
  /**
   * H
   */
  H: 72,
  /**
   * I
   */
  I: 73,
  /**
   * J
   */
  J: 74,
  /**
   * K
   */
  K: 75,
  /**
   * L
   */
  L: 76,
  /**
   * M
   */
  M: 77,
  /**
   * N
   */
  N: 78,
  /**
   * O
   */
  O: 79,
  /**
   * P
   */
  P: 80,
  /**
   * Q
   */
  Q: 81,
  /**
   * R
   */
  R: 82,
  /**
   * S
   */
  S: 83,
  /**
   * T
   */
  T: 84,
  /**
   * U
   */
  U: 85,
  /**
   * V
   */
  V: 86,
  /**
   * W
   */
  W: 87,
  /**
   * X
   */
  X: 88,
  /**
   * Y
   */
  Y: 89,
  /**
   * Z
   */
  Z: 90,
  /**
   * META
   */
  META: 91,
  /**
   * WIN_KEY_RIGHT
   */
  WIN_KEY_RIGHT: 92,
  /**
   * CONTEXT_MENU
   */
  CONTEXT_MENU: 93,
  /**
   * NUM_ZERO
   */
  NUM_ZERO: 96,
  /**
   * NUM_ONE
   */
  NUM_ONE: 97,
  /**
   * NUM_TWO
   */
  NUM_TWO: 98,
  /**
   * NUM_THREE
   */
  NUM_THREE: 99,
  /**
   * NUM_FOUR
   */
  NUM_FOUR: 100,
  /**
   * NUM_FIVE
   */
  NUM_FIVE: 101,
  /**
   * NUM_SIX
   */
  NUM_SIX: 102,
  /**
   * NUM_SEVEN
   */
  NUM_SEVEN: 103,
  /**
   * NUM_EIGHT
   */
  NUM_EIGHT: 104,
  /**
   * NUM_NINE
   */
  NUM_NINE: 105,
  /**
   * NUM_MULTIPLY
   */
  NUM_MULTIPLY: 106,
  /**
   * NUM_PLUS
   */
  NUM_PLUS: 107,
  /**
   * NUM_MINUS
   */
  NUM_MINUS: 109,
  /**
   * NUM_PERIOD
   */
  NUM_PERIOD: 110,
  /**
   * NUM_DIVISION
   */
  NUM_DIVISION: 111,
  /**
   * F1
   */
  F1: 112,
  /**
   * F2
   */
  F2: 113,
  /**
   * F3
   */
  F3: 114,
  /**
   * F4
   */
  F4: 115,
  /**
   * F5
   */
  F5: 116,
  /**
   * F6
   */
  F6: 117,
  /**
   * F7
   */
  F7: 118,
  /**
   * F8
   */
  F8: 119,
  /**
   * F9
   */
  F9: 120,
  /**
   * F10
   */
  F10: 121,
  /**
   * F11
   */
  F11: 122,
  /**
   * F12
   */
  F12: 123,
  /**
   * NUMLOCK
   */
  NUMLOCK: 144,
  /**
   * SEMICOLON
   */
  SEMICOLON: 186,
  /**
   * DASH
   */
  DASH: 189,
  /**
   * EQUALS
   */
  EQUALS: 187,
  /**
   * COMMA
   */
  COMMA: 188,
  /**
   * PERIOD
   */
  PERIOD: 190,
  /**
   * SLASH
   */
  SLASH: 191,
  /**
   * APOSTROPHE
   */
  APOSTROPHE: 192,
  /**
   * SINGLE_QUOTE
   */
  SINGLE_QUOTE: 222,
  /**
   * OPEN_SQUARE_BRACKET
   */
  OPEN_SQUARE_BRACKET: 219,
  /**
   * BACKSLASH
   */
  BACKSLASH: 220,
  /**
   * CLOSE_SQUARE_BRACKET
   */
  CLOSE_SQUARE_BRACKET: 221,
  /**
   * WIN_KEY
   */
  WIN_KEY: 224,
  /**
   * MAC_FF_META
   */
  MAC_FF_META: 224,
  /**
   * WIN_IME
   */
  WIN_IME: 229,
  // ======================== Function ========================
  /**
   * whether text and modified key is entered at the same time.
   */
  isTextModifyingKeyEvent: function(t) {
    const {
      keyCode: n
    } = t;
    if (t.altKey && !t.ctrlKey || t.metaKey || // Function keys don't generate text
    n >= k.F1 && n <= k.F12)
      return !1;
    switch (n) {
      case k.ALT:
      case k.CAPS_LOCK:
      case k.CONTEXT_MENU:
      case k.CTRL:
      case k.DOWN:
      case k.END:
      case k.ESC:
      case k.HOME:
      case k.INSERT:
      case k.LEFT:
      case k.MAC_FF_META:
      case k.META:
      case k.NUMLOCK:
      case k.NUM_CENTER:
      case k.PAGE_DOWN:
      case k.PAGE_UP:
      case k.PAUSE:
      case k.PRINT_SCREEN:
      case k.RIGHT:
      case k.SHIFT:
      case k.UP:
      case k.WIN_KEY:
      case k.WIN_KEY_RIGHT:
        return !1;
      default:
        return !0;
    }
  },
  /**
   * whether character is entered.
   */
  isCharacterKey: function(t) {
    if (t >= k.ZERO && t <= k.NINE || t >= k.NUM_ZERO && t <= k.NUM_MULTIPLY || t >= k.A && t <= k.Z || window.navigator.userAgent.indexOf("WebKit") !== -1 && t === 0)
      return !0;
    switch (t) {
      case k.SPACE:
      case k.QUESTION_MARK:
      case k.NUM_PLUS:
      case k.NUM_MINUS:
      case k.NUM_PERIOD:
      case k.NUM_DIVISION:
      case k.SEMICOLON:
      case k.DASH:
      case k.EQUALS:
      case k.COMMA:
      case k.PERIOD:
      case k.SLASH:
      case k.APOSTROPHE:
      case k.SINGLE_QUOTE:
      case k.OPEN_SQUARE_BRACKET:
      case k.BACKSLASH:
      case k.CLOSE_SQUARE_BRACKET:
        return !0;
      default:
        return !1;
    }
  }
}, ee = k, ti = (e, t) => {
  let {
    slots: n
  } = t;
  var o;
  const {
    class: r,
    customizeIcon: i,
    customizeIconProps: a,
    onMousedown: l,
    onClick: c
  } = e;
  let s;
  return typeof i == "function" ? s = i(a) : s = i, v("span", {
    class: r,
    onMousedown: (d) => {
      d.preventDefault(), l && l(d);
    },
    style: {
      userSelect: "none",
      WebkitUserSelect: "none"
    },
    unselectable: "on",
    onClick: c,
    "aria-hidden": !0
  }, [s !== void 0 ? s : v("span", {
    class: r.split(/\s+/).map((d) => `${d}-icon`)
  }, [(o = n.default) === null || o === void 0 ? void 0 : o.call(n)])]);
};
ti.inheritAttrs = !1;
ti.displayName = "TransBtn";
ti.props = {
  class: String,
  customizeIcon: P.any,
  customizeIconProps: P.any,
  onMousedown: Function,
  onClick: Function
};
const Rr = ti;
function Nw(e) {
  e.target.composing = !0;
}
function Ac(e) {
  e.target.composing && (e.target.composing = !1, Aw(e.target, "input"));
}
function Aw(e, t) {
  const n = document.createEvent("HTMLEvents");
  n.initEvent(t, !0, !0), e.dispatchEvent(n);
}
function Mi(e, t, n, o) {
  e.addEventListener(t, n, o);
}
const Dw = {
  created(e, t) {
    (!t.modifiers || !t.modifiers.lazy) && (Mi(e, "compositionstart", Nw), Mi(e, "compositionend", Ac), Mi(e, "change", Ac));
  }
}, sl = Dw, Rw = {
  inputRef: P.any,
  prefixCls: String,
  id: String,
  inputElement: P.VueNode,
  disabled: {
    type: Boolean,
    default: void 0
  },
  autofocus: {
    type: Boolean,
    default: void 0
  },
  autocomplete: String,
  editable: {
    type: Boolean,
    default: void 0
  },
  activeDescendantId: String,
  value: String,
  open: {
    type: Boolean,
    default: void 0
  },
  tabindex: P.oneOfType([P.number, P.string]),
  /** Pass accessibility props to input */
  attrs: P.object,
  onKeydown: {
    type: Function
  },
  onMousedown: {
    type: Function
  },
  onChange: {
    type: Function
  },
  onPaste: {
    type: Function
  },
  onCompositionstart: {
    type: Function
  },
  onCompositionend: {
    type: Function
  },
  onFocus: {
    type: Function
  },
  onBlur: {
    type: Function
  }
}, Hw = /* @__PURE__ */ Z({
  compatConfig: {
    MODE: 3
  },
  name: "SelectInput",
  inheritAttrs: !1,
  props: Rw,
  setup(e) {
    let t = null;
    const n = ye("VCSelectContainerEvent");
    return () => {
      var o;
      const {
        prefixCls: r,
        id: i,
        inputElement: a,
        disabled: l,
        tabindex: c,
        autofocus: s,
        autocomplete: d,
        editable: u,
        activeDescendantId: f,
        value: p,
        onKeydown: h,
        onMousedown: m,
        onChange: w,
        onPaste: y,
        onCompositionstart: S,
        onCompositionend: _,
        onFocus: C,
        onBlur: x,
        open: O,
        inputRef: b,
        attrs: $
      } = e;
      let T = a || Dn(v("input", null, null), [[sl]]);
      const R = T.props || {}, {
        onKeydown: H,
        onInput: N,
        onFocus: j,
        onBlur: B,
        onMousedown: F,
        onCompositionstart: L,
        onCompositionend: Y,
        style: re
      } = R;
      return T = Nn(T, g(g(g(g(g({
        type: "search"
      }, R), {
        id: i,
        ref: b,
        disabled: l,
        tabindex: c,
        autocomplete: d || "off",
        autofocus: s,
        class: ne(`${r}-selection-search-input`, (o = T == null ? void 0 : T.props) === null || o === void 0 ? void 0 : o.class),
        role: "combobox",
        "aria-expanded": O,
        "aria-haspopup": "listbox",
        "aria-owns": `${i}_list`,
        "aria-autocomplete": "list",
        "aria-controls": `${i}_list`,
        "aria-activedescendant": f
      }), $), {
        value: u ? p : "",
        readonly: !u,
        unselectable: u ? null : "on",
        style: g(g({}, re), {
          opacity: u ? null : 0
        }),
        onKeydown: (A) => {
          h(A), H && H(A);
        },
        onMousedown: (A) => {
          m(A), F && F(A);
        },
        onInput: (A) => {
          w(A), N && N(A);
        },
        onCompositionstart(A) {
          S(A), L && L(A);
        },
        onCompositionend(A) {
          _(A), Y && Y(A);
        },
        onPaste: y,
        onFocus: function() {
          clearTimeout(t), j && j(arguments.length <= 0 ? void 0 : arguments[0]), C && C(arguments.length <= 0 ? void 0 : arguments[0]), n == null || n.focus(arguments.length <= 0 ? void 0 : arguments[0]);
        },
        onBlur: function() {
          for (var A = arguments.length, K = new Array(A), Q = 0; Q < A; Q++)
            K[Q] = arguments[Q];
          t = setTimeout(() => {
            B && B(K[0]), x && x(K[0]), n == null || n.blur(K[0]);
          }, 100);
        }
      }), T.type === "textarea" ? {} : {
        type: "search"
      }), !0, !0), T;
    };
  }
}), ep = Hw, Fw = `accept acceptcharset accesskey action allowfullscreen allowtransparency
alt async autocomplete autofocus autoplay capture cellpadding cellspacing challenge
charset checked classid classname colspan cols content contenteditable contextmenu
controls coords crossorigin data datetime default defer dir disabled download draggable
enctype form formaction formenctype formmethod formnovalidate formtarget frameborder
headers height hidden high href hreflang htmlfor for httpequiv icon id inputmode integrity
is keyparams keytype kind label lang list loop low manifest marginheight marginwidth max maxlength media
mediagroup method min minlength multiple muted name novalidate nonce open
optimum pattern placeholder poster preload radiogroup readonly rel required
reversed role rowspan rows sandbox scope scoped scrolling seamless selected
shape size sizes span spellcheck src srcdoc srclang srcset start step style
summary tabindex target title type usemap value width wmode wrap`, zw = `onCopy onCut onPaste onCompositionend onCompositionstart onCompositionupdate onKeydown
    onKeypress onKeyup onFocus onBlur onChange onInput onSubmit onClick onContextmenu onDoubleclick onDblclick
    onDrag onDragend onDragenter onDragexit onDragleave onDragover onDragstart onDrop onMousedown
    onMouseenter onMouseleave onMousemove onMouseout onMouseover onMouseup onSelect onTouchcancel
    onTouchend onTouchmove onTouchstart onTouchstartPassive onTouchmovePassive onScroll onWheel onAbort onCanplay onCanplaythrough
    onDurationchange onEmptied onEncrypted onEnded onError onLoadeddata onLoadedmetadata
    onLoadstart onPause onPlay onPlaying onProgress onRatechange onSeeked onSeeking onStalled onSuspend onTimeupdate onVolumechange onWaiting onLoad onError`, Dc = `${Fw} ${zw}`.split(/[\s\n]+/), Lw = "aria-", jw = "data-";
function Rc(e, t) {
  return e.indexOf(t) === 0;
}
function cl(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, n;
  t === !1 ? n = {
    aria: !0,
    data: !0,
    attr: !0
  } : t === !0 ? n = {
    aria: !0
  } : n = g({}, t);
  const o = {};
  return Object.keys(e).forEach((r) => {
    // Aria
    (n.aria && (r === "role" || Rc(r, Lw)) || // Data
    n.data && Rc(r, jw) || // Attr
    n.attr && (Dc.includes(r) || Dc.includes(r.toLowerCase()))) && (o[r] = e[r]);
  }), o;
}
const tp = Symbol("OverflowContextProviderKey"), xa = /* @__PURE__ */ Z({
  compatConfig: {
    MODE: 3
  },
  name: "OverflowContextProvider",
  inheritAttrs: !1,
  props: {
    value: {
      type: Object
    }
  },
  setup(e, t) {
    let {
      slots: n
    } = t;
    return dt(tp, E(() => e.value)), () => {
      var o;
      return (o = n.default) === null || o === void 0 ? void 0 : o.call(n);
    };
  }
}), Bw = () => ye(tp, E(() => null));
var Vw = globalThis && globalThis.__rest || function(e, t) {
  var n = {};
  for (var o in e)
    Object.prototype.hasOwnProperty.call(e, o) && t.indexOf(o) < 0 && (n[o] = e[o]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var r = 0, o = Object.getOwnPropertySymbols(e); r < o.length; r++)
      t.indexOf(o[r]) < 0 && Object.prototype.propertyIsEnumerable.call(e, o[r]) && (n[o[r]] = e[o[r]]);
  return n;
};
const hn = void 0, pr = /* @__PURE__ */ Z({
  compatConfig: {
    MODE: 3
  },
  name: "Item",
  props: {
    prefixCls: String,
    item: P.any,
    renderItem: Function,
    responsive: Boolean,
    itemKey: {
      type: [String, Number]
    },
    registerSize: Function,
    display: Boolean,
    order: Number,
    component: P.any,
    invalidate: Boolean
  },
  setup(e, t) {
    let {
      slots: n,
      expose: o
    } = t;
    const r = E(() => e.responsive && !e.display), i = oe();
    o({
      itemNodeRef: i
    });
    function a(l) {
      e.registerSize(e.itemKey, l);
    }
    return To(() => {
      a(null);
    }), () => {
      var l;
      const {
        prefixCls: c,
        invalidate: s,
        item: d,
        renderItem: u,
        responsive: f,
        registerSize: p,
        itemKey: h,
        display: m,
        order: w,
        component: y = "div"
      } = e, S = Vw(e, ["prefixCls", "invalidate", "item", "renderItem", "responsive", "registerSize", "itemKey", "display", "order", "component"]), _ = (l = n.default) === null || l === void 0 ? void 0 : l.call(n), C = u && d !== hn ? u(d) : _;
      let x;
      s || (x = {
        opacity: r.value ? 0 : 1,
        height: r.value ? 0 : hn,
        overflowY: r.value ? "hidden" : hn,
        order: f ? w : hn,
        pointerEvents: r.value ? "none" : hn,
        position: r.value ? "absolute" : hn
      });
      const O = {};
      return r.value && (O["aria-hidden"] = !0), v(Xa, {
        disabled: !f,
        onResize: (b) => {
          let {
            offsetWidth: $
          } = b;
          a($);
        }
      }, {
        default: () => v(y, U(U(U({
          class: ne(!s && c),
          style: x
        }, O), S), {}, {
          ref: i
        }), {
          default: () => [C]
        })
      });
    };
  }
});
var Ni = globalThis && globalThis.__rest || function(e, t) {
  var n = {};
  for (var o in e)
    Object.prototype.hasOwnProperty.call(e, o) && t.indexOf(o) < 0 && (n[o] = e[o]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var r = 0, o = Object.getOwnPropertySymbols(e); r < o.length; r++)
      t.indexOf(o[r]) < 0 && Object.prototype.propertyIsEnumerable.call(e, o[r]) && (n[o[r]] = e[o[r]]);
  return n;
};
const Ww = /* @__PURE__ */ Z({
  compatConfig: {
    MODE: 3
  },
  name: "RawItem",
  inheritAttrs: !1,
  props: {
    component: P.any,
    title: P.any,
    id: String,
    onMouseenter: {
      type: Function
    },
    onMouseleave: {
      type: Function
    },
    onClick: {
      type: Function
    },
    onKeydown: {
      type: Function
    },
    onFocus: {
      type: Function
    },
    role: String,
    tabindex: Number
  },
  setup(e, t) {
    let {
      slots: n,
      attrs: o
    } = t;
    const r = Bw();
    return () => {
      var i;
      if (!r.value) {
        const {
          component: u = "div"
        } = e, f = Ni(e, ["component"]);
        return v(u, U(U({}, f), o), {
          default: () => [(i = n.default) === null || i === void 0 ? void 0 : i.call(n)]
        });
      }
      const a = r.value, {
        className: l
      } = a, c = Ni(a, ["className"]), {
        class: s
      } = o, d = Ni(o, ["class"]);
      return v(xa, {
        value: null
      }, {
        default: () => [v(pr, U(U(U({
          class: ne(l, s)
        }, c), d), e), n)]
      });
    };
  }
});
var Kw = globalThis && globalThis.__rest || function(e, t) {
  var n = {};
  for (var o in e)
    Object.prototype.hasOwnProperty.call(e, o) && t.indexOf(o) < 0 && (n[o] = e[o]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var r = 0, o = Object.getOwnPropertySymbols(e); r < o.length; r++)
      t.indexOf(o[r]) < 0 && Object.prototype.propertyIsEnumerable.call(e, o[r]) && (n[o[r]] = e[o[r]]);
  return n;
};
const np = "responsive", op = "invalidate";
function Uw(e) {
  return `+ ${e.length} ...`;
}
const Xw = () => ({
  id: String,
  prefixCls: String,
  data: Array,
  itemKey: [String, Number, Function],
  /** Used for `responsive`. It will limit render node to avoid perf issue */
  itemWidth: {
    type: Number,
    default: 10
  },
  renderItem: Function,
  /** @private Do not use in your production. Render raw node that need wrap Item by developer self */
  renderRawItem: Function,
  maxCount: [Number, String],
  renderRest: Function,
  /** @private Do not use in your production. Render raw node that need wrap Item by developer self */
  renderRawRest: Function,
  suffix: P.any,
  component: String,
  itemComponent: P.any,
  /** @private This API may be refactor since not well design */
  onVisibleChange: Function,
  /** When set to `full`, ssr will render full items by default and remove at client side */
  ssr: String,
  onMousedown: Function
}), ni = /* @__PURE__ */ Z({
  name: "Overflow",
  inheritAttrs: !1,
  props: Xw(),
  emits: ["visibleChange"],
  setup(e, t) {
    let {
      attrs: n,
      emit: o,
      slots: r
    } = t;
    const i = E(() => e.ssr === "full"), a = V(null), l = E(() => a.value || 0), c = V(/* @__PURE__ */ new Map()), s = V(0), d = V(0), u = V(0), f = V(null), p = V(null), h = E(() => p.value === null && i.value ? Number.MAX_SAFE_INTEGER : p.value || 0), m = V(!1), w = E(() => `${e.prefixCls}-item`), y = E(() => Math.max(s.value, d.value)), S = E(() => !!(e.data.length && e.maxCount === np)), _ = E(() => e.maxCount === op), C = E(() => S.value || typeof e.maxCount == "number" && e.data.length > e.maxCount), x = E(() => {
      let F = e.data;
      return S.value ? a.value === null && i.value ? F = e.data : F = e.data.slice(0, Math.min(e.data.length, l.value / e.itemWidth)) : typeof e.maxCount == "number" && (F = e.data.slice(0, e.maxCount)), F;
    }), O = E(() => S.value ? e.data.slice(h.value + 1) : e.data.slice(x.value.length)), b = (F, L) => {
      var Y;
      return typeof e.itemKey == "function" ? e.itemKey(F) : (Y = e.itemKey && (F == null ? void 0 : F[e.itemKey])) !== null && Y !== void 0 ? Y : L;
    }, $ = E(() => e.renderItem || ((F) => F)), T = (F, L) => {
      p.value = F, L || (m.value = F < e.data.length - 1, o("visibleChange", F));
    }, R = (F, L) => {
      a.value = L.clientWidth;
    }, H = (F, L) => {
      const Y = new Map(c.value);
      L === null ? Y.delete(F) : Y.set(F, L), c.value = Y;
    }, N = (F, L) => {
      s.value = d.value, d.value = L;
    }, j = (F, L) => {
      u.value = L;
    }, B = (F) => c.value.get(b(x.value[F], F));
    return ae([l, c, d, u, () => e.itemKey, x], () => {
      if (l.value && y.value && x.value) {
        let F = u.value;
        const L = x.value.length, Y = L - 1;
        if (!L) {
          T(0), f.value = null;
          return;
        }
        for (let re = 0; re < L; re += 1) {
          const A = B(re);
          if (A === void 0) {
            T(re - 1, !0);
            break;
          }
          if (F += A, // Only one means `totalWidth` is the final width
          Y === 0 && F <= l.value || // Last two width will be the final width
          re === Y - 1 && F + B(Y) <= l.value) {
            T(Y), f.value = null;
            break;
          } else if (F + y.value > l.value) {
            T(re - 1), f.value = F - A - u.value + d.value;
            break;
          }
        }
        e.suffix && B(0) + u.value > l.value && (f.value = null);
      }
    }), () => {
      const F = m.value && !!O.value.length, {
        itemComponent: L,
        renderRawItem: Y,
        renderRawRest: re,
        renderRest: A,
        prefixCls: K = "rc-overflow",
        suffix: Q,
        component: X = "div",
        id: de,
        onMousedown: ue
      } = e, {
        class: pe,
        style: fe
      } = n, me = Kw(n, ["class", "style"]);
      let Te = {};
      f.value !== null && S.value && (Te = {
        position: "absolute",
        left: `${f.value}px`,
        top: 0
      });
      const D = {
        prefixCls: w.value,
        responsive: S.value,
        component: L,
        invalidate: _.value
      }, W = Y ? (G, ce) => {
        const ie = b(G, ce);
        return v(xa, {
          key: ie,
          value: g(g({}, D), {
            order: ce,
            item: G,
            itemKey: ie,
            registerSize: H,
            display: ce <= h.value
          })
        }, {
          default: () => [Y(G, ce)]
        });
      } : (G, ce) => {
        const ie = b(G, ce);
        return v(pr, U(U({}, D), {}, {
          order: ce,
          key: ie,
          item: G,
          renderItem: $.value,
          itemKey: ie,
          registerSize: H,
          display: ce <= h.value
        }), null);
      };
      let I = () => null;
      const M = {
        order: F ? h.value : Number.MAX_SAFE_INTEGER,
        className: `${w.value} ${w.value}-rest`,
        registerSize: N,
        display: F
      };
      if (re)
        re && (I = () => v(xa, {
          value: g(g({}, D), M)
        }, {
          default: () => [re(O.value)]
        }));
      else {
        const G = A || Uw;
        I = () => v(pr, U(U({}, D), M), {
          default: () => typeof G == "function" ? G(O.value) : G
        });
      }
      const z = () => {
        var G;
        return v(X, U({
          id: de,
          class: ne(!_.value && K, pe),
          style: fe,
          onMousedown: ue
        }, me), {
          default: () => [x.value.map(W), C.value ? I() : null, Q && v(pr, U(U({}, D), {}, {
            order: h.value,
            class: `${w.value}-suffix`,
            registerSize: j,
            display: !0,
            style: Te
          }), {
            default: () => Q
          }), (G = r.default) === null || G === void 0 ? void 0 : G.call(r)]
        });
      };
      return v(Xa, {
        disabled: !S.value,
        onResize: R
      }, {
        default: z
      });
    };
  }
});
ni.Item = Ww;
ni.RESPONSIVE = np;
ni.INVALIDATE = op;
const Gw = ni, kw = Symbol("TreeSelectLegacyContextPropsKey");
function ul() {
  return ye(kw, {});
}
const Yw = {
  id: String,
  prefixCls: String,
  values: P.array,
  open: {
    type: Boolean,
    default: void 0
  },
  searchValue: String,
  inputRef: P.any,
  placeholder: P.any,
  disabled: {
    type: Boolean,
    default: void 0
  },
  mode: String,
  showSearch: {
    type: Boolean,
    default: void 0
  },
  autofocus: {
    type: Boolean,
    default: void 0
  },
  autocomplete: String,
  activeDescendantId: String,
  tabindex: P.oneOfType([P.number, P.string]),
  removeIcon: P.any,
  choiceTransitionName: String,
  maxTagCount: P.oneOfType([P.number, P.string]),
  maxTagTextLength: Number,
  maxTagPlaceholder: P.any.def(() => (e) => `+ ${e.length} ...`),
  tagRender: Function,
  onToggleOpen: {
    type: Function
  },
  onRemove: Function,
  onInputChange: Function,
  onInputPaste: Function,
  onInputKeyDown: Function,
  onInputMouseDown: Function,
  onInputCompositionStart: Function,
  onInputCompositionEnd: Function
}, Hc = (e) => {
  e.preventDefault(), e.stopPropagation();
}, qw = /* @__PURE__ */ Z({
  name: "MultipleSelectSelector",
  inheritAttrs: !1,
  props: Yw,
  setup(e) {
    const t = V(), n = V(0), o = V(!1), r = ul(), i = E(() => `${e.prefixCls}-selection`), a = E(() => e.open || e.mode === "tags" ? e.searchValue : ""), l = E(() => e.mode === "tags" || e.showSearch && (e.open || o.value));
    De(() => {
      ae(a, () => {
        n.value = t.value.scrollWidth;
      }, {
        flush: "post",
        immediate: !0
      });
    });
    function c(f, p, h, m, w) {
      return v("span", {
        class: ne(`${i.value}-item`, {
          [`${i.value}-item-disabled`]: h
        }),
        title: typeof f == "string" || typeof f == "number" ? f.toString() : void 0
      }, [v("span", {
        class: `${i.value}-item-content`
      }, [p]), m && v(Rr, {
        class: `${i.value}-item-remove`,
        onMousedown: Hc,
        onClick: w,
        customizeIcon: e.removeIcon
      }, {
        default: () => [_n("×")]
      })]);
    }
    function s(f, p, h, m, w, y) {
      var S;
      const _ = (x) => {
        Hc(x), e.onToggleOpen(!open);
      };
      let C = y;
      return r.keyEntities && (C = ((S = r.keyEntities[f]) === null || S === void 0 ? void 0 : S.node) || {}), v("span", {
        key: f,
        onMousedown: _
      }, [e.tagRender({
        label: p,
        value: f,
        disabled: h,
        closable: m,
        onClose: w,
        option: C
      })]);
    }
    function d(f) {
      const {
        disabled: p,
        label: h,
        value: m,
        option: w
      } = f, y = !e.disabled && !p;
      let S = h;
      if (typeof e.maxTagTextLength == "number" && (typeof h == "string" || typeof h == "number")) {
        const C = String(S);
        C.length > e.maxTagTextLength && (S = `${C.slice(0, e.maxTagTextLength)}...`);
      }
      const _ = (C) => {
        var x;
        C && C.stopPropagation(), (x = e.onRemove) === null || x === void 0 || x.call(e, f);
      };
      return typeof e.tagRender == "function" ? s(m, S, p, y, _, w) : c(h, S, p, y, _);
    }
    function u(f) {
      const {
        maxTagPlaceholder: p = (m) => `+ ${m.length} ...`
      } = e, h = typeof p == "function" ? p(f) : p;
      return c(h, h, !1);
    }
    return () => {
      const {
        id: f,
        prefixCls: p,
        values: h,
        open: m,
        inputRef: w,
        placeholder: y,
        disabled: S,
        autofocus: _,
        autocomplete: C,
        activeDescendantId: x,
        tabindex: O,
        onInputChange: b,
        onInputPaste: $,
        onInputKeyDown: T,
        onInputMouseDown: R,
        onInputCompositionStart: H,
        onInputCompositionEnd: N
      } = e, j = v("div", {
        class: `${i.value}-search`,
        style: {
          width: n.value + "px"
        },
        key: "input"
      }, [v(ep, {
        inputRef: w,
        open: m,
        prefixCls: p,
        id: f,
        inputElement: null,
        disabled: S,
        autofocus: _,
        autocomplete: C,
        editable: l.value,
        activeDescendantId: x,
        value: a.value,
        onKeydown: T,
        onMousedown: R,
        onChange: b,
        onPaste: $,
        onCompositionstart: H,
        onCompositionend: N,
        tabindex: O,
        attrs: cl(e, !0),
        onFocus: () => o.value = !0,
        onBlur: () => o.value = !1
      }, null), v("span", {
        ref: t,
        class: `${i.value}-search-mirror`,
        "aria-hidden": !0
      }, [a.value, _n(" ")])]), B = v(Gw, {
        prefixCls: `${i.value}-overflow`,
        data: h,
        renderItem: d,
        renderRest: u,
        suffix: j,
        itemKey: "key",
        maxCount: e.maxTagCount,
        key: "overflow"
      }, null);
      return v(Me, null, [B, !h.length && !a.value && v("span", {
        class: `${i.value}-placeholder`
      }, [y])]);
    };
  }
}), Qw = qw, Jw = {
  inputElement: P.any,
  id: String,
  prefixCls: String,
  values: P.array,
  open: {
    type: Boolean,
    default: void 0
  },
  searchValue: String,
  inputRef: P.any,
  placeholder: P.any,
  disabled: {
    type: Boolean,
    default: void 0
  },
  mode: String,
  showSearch: {
    type: Boolean,
    default: void 0
  },
  autofocus: {
    type: Boolean,
    default: void 0
  },
  autocomplete: String,
  activeDescendantId: String,
  tabindex: P.oneOfType([P.number, P.string]),
  activeValue: String,
  backfill: {
    type: Boolean,
    default: void 0
  },
  optionLabelRender: Function,
  onInputChange: Function,
  onInputPaste: Function,
  onInputKeyDown: Function,
  onInputMouseDown: Function,
  onInputCompositionStart: Function,
  onInputCompositionEnd: Function
}, dl = /* @__PURE__ */ Z({
  name: "SingleSelector",
  setup(e) {
    const t = V(!1), n = E(() => e.mode === "combobox"), o = E(() => n.value || e.showSearch), r = E(() => {
      let s = e.searchValue || "";
      return n.value && e.activeValue && !t.value && (s = e.activeValue), s;
    }), i = ul();
    ae([n, () => e.activeValue], () => {
      n.value && (t.value = !1);
    }, {
      immediate: !0
    });
    const a = E(() => e.mode !== "combobox" && !e.open && !e.showSearch ? !1 : !!r.value), l = E(() => {
      const s = e.values[0];
      return s && (typeof s.label == "string" || typeof s.label == "number") ? s.label.toString() : void 0;
    }), c = () => {
      if (e.values[0])
        return null;
      const s = a.value ? {
        visibility: "hidden"
      } : void 0;
      return v("span", {
        class: `${e.prefixCls}-selection-placeholder`,
        style: s
      }, [e.placeholder]);
    };
    return () => {
      var s, d, u, f;
      const {
        inputElement: p,
        prefixCls: h,
        id: m,
        values: w,
        inputRef: y,
        disabled: S,
        autofocus: _,
        autocomplete: C,
        activeDescendantId: x,
        open: O,
        tabindex: b,
        optionLabelRender: $,
        onInputKeyDown: T,
        onInputMouseDown: R,
        onInputChange: H,
        onInputPaste: N,
        onInputCompositionStart: j,
        onInputCompositionEnd: B
      } = e, F = w[0];
      let L = null;
      if (F && i.customSlots) {
        const Y = (s = F.key) !== null && s !== void 0 ? s : F.value, re = ((d = i.keyEntities[Y]) === null || d === void 0 ? void 0 : d.node) || {};
        L = i.customSlots[(u = re.slots) === null || u === void 0 ? void 0 : u.title] || i.customSlots.title || F.label, typeof L == "function" && (L = L(re));
      } else
        L = $ && F ? $(F.option) : F == null ? void 0 : F.label;
      return v(Me, null, [v("span", {
        class: `${h}-selection-search`
      }, [v(ep, {
        inputRef: y,
        prefixCls: h,
        id: m,
        open: O,
        inputElement: p,
        disabled: S,
        autofocus: _,
        autocomplete: C,
        editable: o.value,
        activeDescendantId: x,
        value: r.value,
        onKeydown: T,
        onMousedown: R,
        onChange: (Y) => {
          t.value = !0, H(Y);
        },
        onPaste: N,
        onCompositionstart: j,
        onCompositionend: B,
        tabindex: b,
        attrs: cl(e, !0)
      }, null)]), !n.value && F && !a.value && v("span", {
        class: `${h}-selection-item`,
        title: l.value
      }, [v(Me, {
        key: (f = F.key) !== null && f !== void 0 ? f : F.value
      }, [L])]), c()]);
    };
  }
});
dl.props = Jw;
dl.inheritAttrs = !1;
const Zw = dl;
function eC(e) {
  return ![
    // System function button
    ee.ESC,
    ee.SHIFT,
    ee.BACKSPACE,
    ee.TAB,
    ee.WIN_KEY,
    ee.ALT,
    ee.META,
    ee.WIN_KEY_RIGHT,
    ee.CTRL,
    ee.SEMICOLON,
    ee.EQUALS,
    ee.CAPS_LOCK,
    ee.CONTEXT_MENU,
    // F1-F12
    ee.F1,
    ee.F2,
    ee.F3,
    ee.F4,
    ee.F5,
    ee.F6,
    ee.F7,
    ee.F8,
    ee.F9,
    ee.F10,
    ee.F11,
    ee.F12
  ].includes(e);
}
function rp() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 250, t = null, n;
  rt(() => {
    clearTimeout(n);
  });
  function o(r) {
    (r || t === null) && (t = r), clearTimeout(n), n = setTimeout(() => {
      t = null;
    }, e);
  }
  return [() => t, o];
}
function Oo() {
  const e = (t) => {
    e.current = t;
  };
  return e;
}
const tC = /* @__PURE__ */ Z({
  name: "Selector",
  inheritAttrs: !1,
  props: {
    id: String,
    prefixCls: String,
    showSearch: {
      type: Boolean,
      default: void 0
    },
    open: {
      type: Boolean,
      default: void 0
    },
    /** Display in the Selector value, it's not same as `value` prop */
    values: P.array,
    multiple: {
      type: Boolean,
      default: void 0
    },
    mode: String,
    searchValue: String,
    activeValue: String,
    inputElement: P.any,
    autofocus: {
      type: Boolean,
      default: void 0
    },
    activeDescendantId: String,
    tabindex: P.oneOfType([P.number, P.string]),
    disabled: {
      type: Boolean,
      default: void 0
    },
    placeholder: P.any,
    removeIcon: P.any,
    // Tags
    maxTagCount: P.oneOfType([P.number, P.string]),
    maxTagTextLength: Number,
    maxTagPlaceholder: P.any,
    tagRender: Function,
    optionLabelRender: Function,
    /** Check if `tokenSeparators` contains `\n` or `\r\n` */
    tokenWithEnter: {
      type: Boolean,
      default: void 0
    },
    // Motion
    choiceTransitionName: String,
    onToggleOpen: {
      type: Function
    },
    /** `onSearch` returns go next step boolean to check if need do toggle open */
    onSearch: Function,
    onSearchSubmit: Function,
    onRemove: Function,
    onInputKeyDown: {
      type: Function
    },
    /**
     * @private get real dom for trigger align.
     * This may be removed after React provides replacement of `findDOMNode`
     */
    domRef: Function
  },
  setup(e, t) {
    let {
      expose: n
    } = t;
    const o = Oo();
    let r = !1;
    const [i, a] = rp(0), l = (y) => {
      const {
        which: S
      } = y;
      (S === ee.UP || S === ee.DOWN) && y.preventDefault(), e.onInputKeyDown && e.onInputKeyDown(y), S === ee.ENTER && e.mode === "tags" && !r && !e.open && e.onSearchSubmit(y.target.value), eC(S) && e.onToggleOpen(!0);
    }, c = () => {
      a(!0);
    };
    let s = null;
    const d = (y) => {
      e.onSearch(y, !0, r) !== !1 && e.onToggleOpen(!0);
    }, u = () => {
      r = !0;
    }, f = (y) => {
      r = !1, e.mode !== "combobox" && d(y.target.value);
    }, p = (y) => {
      let {
        target: {
          value: S
        }
      } = y;
      if (e.tokenWithEnter && s && /[\r\n]/.test(s)) {
        const _ = s.replace(/[\r\n]+$/, "").replace(/\r\n/g, " ").replace(/[\r\n]/g, " ");
        S = S.replace(_, s);
      }
      s = null, d(S);
    }, h = (y) => {
      const {
        clipboardData: S
      } = y;
      s = S.getData("text");
    }, m = (y) => {
      let {
        target: S
      } = y;
      S !== o.current && (document.body.style.msTouchAction !== void 0 ? setTimeout(() => {
        o.current.focus();
      }) : o.current.focus());
    }, w = (y) => {
      const S = i();
      y.target !== o.current && !S && y.preventDefault(), (e.mode !== "combobox" && (!e.showSearch || !S) || !e.open) && (e.open && e.onSearch("", !0, !1), e.onToggleOpen());
    };
    return n({
      focus: () => {
        o.current.focus();
      },
      blur: () => {
        o.current.blur();
      }
    }), () => {
      const {
        prefixCls: y,
        domRef: S,
        mode: _
      } = e, C = {
        inputRef: o,
        onInputKeyDown: l,
        onInputMouseDown: c,
        onInputChange: p,
        onInputPaste: h,
        onInputCompositionStart: u,
        onInputCompositionEnd: f
      }, x = _ === "multiple" || _ === "tags" ? v(Qw, U(U({}, e), C), null) : v(Zw, U(U({}, e), C), null);
      return v("div", {
        ref: S,
        class: `${y}-selector`,
        onClick: m,
        onMousedown: w
      }, [x]);
    };
  }
}), nC = tC;
function oC(e, t, n) {
  function o(r) {
    var i, a, l;
    let c = r.target;
    c.shadowRoot && r.composed && (c = r.composedPath()[0] || c);
    const s = [(i = e[0]) === null || i === void 0 ? void 0 : i.value, (l = (a = e[1]) === null || a === void 0 ? void 0 : a.value) === null || l === void 0 ? void 0 : l.getPopupElement()];
    t.value && s.every((d) => d && !d.contains(c) && d !== c) && n(!1);
  }
  De(() => {
    window.addEventListener("mousedown", o);
  }), rt(() => {
    window.removeEventListener("mousedown", o);
  });
}
function rC() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 10;
  const t = V(!1);
  let n;
  const o = () => {
    clearTimeout(n);
  };
  return De(() => {
    o();
  }), [t, (i, a) => {
    o(), n = setTimeout(() => {
      t.value = i, a && a();
    }, e);
  }, o];
}
const ip = Symbol("BaseSelectContextKey");
function iC(e) {
  return dt(ip, e);
}
function aC() {
  return ye(ip, {});
}
const lC = () => {
  if (typeof navigator > "u" || typeof window > "u")
    return !1;
  const e = navigator.userAgent || navigator.vendor || window.opera;
  return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(e) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(e == null ? void 0 : e.substr(0, 4));
};
var sC = globalThis && globalThis.__rest || function(e, t) {
  var n = {};
  for (var o in e)
    Object.prototype.hasOwnProperty.call(e, o) && t.indexOf(o) < 0 && (n[o] = e[o]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var r = 0, o = Object.getOwnPropertySymbols(e); r < o.length; r++)
      t.indexOf(o[r]) < 0 && Object.prototype.propertyIsEnumerable.call(e, o[r]) && (n[o[r]] = e[o[r]]);
  return n;
};
const cC = ["value", "onChange", "removeIcon", "placeholder", "autofocus", "maxTagCount", "maxTagTextLength", "maxTagPlaceholder", "choiceTransitionName", "onInputKeyDown", "onPopupScroll", "tabindex", "OptionList", "notFoundContent"], uC = () => ({
  prefixCls: String,
  id: String,
  omitDomProps: Array,
  // >>> Value
  displayValues: Array,
  onDisplayValuesChange: Function,
  // >>> Active
  /** Current dropdown list active item string value */
  activeValue: String,
  /** Link search input with target element */
  activeDescendantId: String,
  onActiveValueChange: Function,
  // >>> Search
  searchValue: String,
  /** Trigger onSearch, return false to prevent trigger open event */
  onSearch: Function,
  /** Trigger when search text match the `tokenSeparators`. Will provide split content */
  onSearchSplit: Function,
  maxLength: Number,
  OptionList: P.any,
  /** Tell if provided `options` is empty */
  emptyOptions: Boolean
}), ap = () => ({
  showSearch: {
    type: Boolean,
    default: void 0
  },
  tagRender: {
    type: Function
  },
  optionLabelRender: {
    type: Function
  },
  direction: {
    type: String
  },
  // MISC
  tabindex: Number,
  autofocus: Boolean,
  notFoundContent: P.any,
  placeholder: P.any,
  onClear: Function,
  choiceTransitionName: String,
  // >>> Mode
  mode: String,
  // >>> Status
  disabled: {
    type: Boolean,
    default: void 0
  },
  loading: {
    type: Boolean,
    default: void 0
  },
  // >>> Open
  open: {
    type: Boolean,
    default: void 0
  },
  defaultOpen: {
    type: Boolean,
    default: void 0
  },
  onDropdownVisibleChange: {
    type: Function
  },
  // >>> Customize Input
  /** @private Internal usage. Do not use in your production. */
  getInputElement: {
    type: Function
  },
  /** @private Internal usage. Do not use in your production. */
  getRawInputElement: {
    type: Function
  },
  // >>> Selector
  maxTagTextLength: Number,
  maxTagCount: {
    type: [String, Number]
  },
  maxTagPlaceholder: P.any,
  // >>> Search
  tokenSeparators: {
    type: Array
  },
  // >>> Icons
  allowClear: {
    type: Boolean,
    default: void 0
  },
  showArrow: {
    type: Boolean,
    default: void 0
  },
  inputIcon: P.any,
  /** Clear all icon */
  clearIcon: P.any,
  /** Selector remove icon */
  removeIcon: P.any,
  // >>> Dropdown
  animation: String,
  transitionName: String,
  dropdownStyle: {
    type: Object
  },
  dropdownClassName: String,
  dropdownMatchSelectWidth: {
    type: [Boolean, Number],
    default: void 0
  },
  dropdownRender: {
    type: Function
  },
  dropdownAlign: Object,
  placement: {
    type: String
  },
  getPopupContainer: {
    type: Function
  },
  // >>> Focus
  showAction: {
    type: Array
  },
  onBlur: {
    type: Function
  },
  onFocus: {
    type: Function
  },
  // >>> Rest Events
  onKeyup: Function,
  onKeydown: Function,
  onMousedown: Function,
  onPopupScroll: Function,
  onInputKeyDown: Function,
  onMouseenter: Function,
  onMouseleave: Function,
  onClick: Function
}), dC = () => g(g({}, uC()), ap());
function fl(e) {
  return e === "tags" || e === "multiple";
}
const fC = /* @__PURE__ */ Z({
  compatConfig: {
    MODE: 3
  },
  name: "BaseSelect",
  inheritAttrs: !1,
  props: Kr(dC(), {
    showAction: [],
    notFoundContent: "Not Found"
  }),
  setup(e, t) {
    let {
      attrs: n,
      expose: o,
      slots: r
    } = t;
    const i = E(() => fl(e.mode)), a = E(() => e.showSearch !== void 0 ? e.showSearch : i.value || e.mode === "combobox"), l = V(!1);
    De(() => {
      l.value = lC();
    });
    const c = ul(), s = V(null), d = Oo(), u = V(null), f = V(null), p = V(null), h = oe(!1), [m, w, y] = rC();
    o({
      focus: () => {
        var I;
        (I = f.value) === null || I === void 0 || I.focus();
      },
      blur: () => {
        var I;
        (I = f.value) === null || I === void 0 || I.blur();
      },
      scrollTo: (I) => {
        var M;
        return (M = p.value) === null || M === void 0 ? void 0 : M.scrollTo(I);
      }
    });
    const C = E(() => {
      var I;
      if (e.mode !== "combobox")
        return e.searchValue;
      const M = (I = e.displayValues[0]) === null || I === void 0 ? void 0 : I.value;
      return typeof M == "string" || typeof M == "number" ? String(M) : "";
    }), x = e.open !== void 0 ? e.open : e.defaultOpen, O = V(x), b = V(x), $ = (I) => {
      O.value = e.open !== void 0 ? e.open : I, b.value = O.value;
    };
    ae(() => e.open, () => {
      $(e.open);
    });
    const T = E(() => !e.notFoundContent && e.emptyOptions);
    ut(() => {
      b.value = O.value, (e.disabled || T.value && b.value && e.mode === "combobox") && (b.value = !1);
    });
    const R = E(() => T.value ? !1 : b.value), H = (I) => {
      const M = I !== void 0 ? I : !b.value;
      b.value !== M && !e.disabled && ($(M), e.onDropdownVisibleChange && e.onDropdownVisibleChange(M));
    }, N = E(() => (e.tokenSeparators || []).some((I) => [`
`, `\r
`].includes(I))), j = (I, M, z) => {
      var G, ce;
      let ie = !0, Se = I;
      (G = e.onActiveValueChange) === null || G === void 0 || G.call(e, null);
      const te = z ? null : wb(I, e.tokenSeparators);
      return e.mode !== "combobox" && te && (Se = "", (ce = e.onSearchSplit) === null || ce === void 0 || ce.call(e, te), H(!1), ie = !1), e.onSearch && C.value !== Se && e.onSearch(Se, {
        source: M ? "typing" : "effect"
      }), ie;
    }, B = (I) => {
      var M;
      !I || !I.trim() || (M = e.onSearch) === null || M === void 0 || M.call(e, I, {
        source: "submit"
      });
    };
    ae(b, () => {
      !b.value && !i.value && e.mode !== "combobox" && j("", !1, !1);
    }, {
      immediate: !0,
      flush: "post"
    }), ae(() => e.disabled, () => {
      O.value && e.disabled && $(!1), e.disabled && !h.value && w(!1);
    }, {
      immediate: !0
    });
    const [F, L] = rp(), Y = function(I) {
      var M;
      const z = F(), {
        which: G
      } = I;
      if (G === ee.ENTER && (e.mode !== "combobox" && I.preventDefault(), b.value || H(!0)), L(!!C.value), G === ee.BACKSPACE && !z && i.value && !C.value && e.displayValues.length) {
        const te = [...e.displayValues];
        let Ke = null;
        for (let we = te.length - 1; we >= 0; we -= 1) {
          const mt = te[we];
          if (!mt.disabled) {
            te.splice(we, 1), Ke = mt;
            break;
          }
        }
        Ke && e.onDisplayValuesChange(te, {
          type: "remove",
          values: [Ke]
        });
      }
      for (var ce = arguments.length, ie = new Array(ce > 1 ? ce - 1 : 0), Se = 1; Se < ce; Se++)
        ie[Se - 1] = arguments[Se];
      b.value && p.value && p.value.onKeydown(I, ...ie), (M = e.onKeydown) === null || M === void 0 || M.call(e, I, ...ie);
    }, re = function(I) {
      for (var M = arguments.length, z = new Array(M > 1 ? M - 1 : 0), G = 1; G < M; G++)
        z[G - 1] = arguments[G];
      b.value && p.value && p.value.onKeyup(I, ...z), e.onKeyup && e.onKeyup(I, ...z);
    }, A = (I) => {
      const M = e.displayValues.filter((z) => z !== I);
      e.onDisplayValuesChange(M, {
        type: "remove",
        values: [I]
      });
    }, K = V(!1), Q = function() {
      w(!0), e.disabled || (e.onFocus && !K.value && e.onFocus(...arguments), e.showAction && e.showAction.includes("focus") && H(!0)), K.value = !0;
    }, X = oe(!1), de = function() {
      if (X.value || (h.value = !0, w(!1, () => {
        K.value = !1, h.value = !1, H(!1);
      }), e.disabled))
        return;
      const I = C.value;
      I && (e.mode === "tags" ? e.onSearch(I, {
        source: "submit"
      }) : e.mode === "multiple" && e.onSearch("", {
        source: "blur"
      })), e.onBlur && e.onBlur(...arguments);
    }, ue = () => {
      X.value = !0;
    }, pe = () => {
      X.value = !1;
    };
    dt("VCSelectContainerEvent", {
      focus: Q,
      blur: de
    });
    const fe = [];
    De(() => {
      fe.forEach((I) => clearTimeout(I)), fe.splice(0, fe.length);
    }), rt(() => {
      fe.forEach((I) => clearTimeout(I)), fe.splice(0, fe.length);
    });
    const me = function(I) {
      var M, z;
      const {
        target: G
      } = I, ce = (M = u.value) === null || M === void 0 ? void 0 : M.getPopupElement();
      if (ce && ce.contains(G)) {
        const Ke = setTimeout(() => {
          var we;
          const mt = fe.indexOf(Ke);
          mt !== -1 && fe.splice(mt, 1), y(), !l.value && !ce.contains(document.activeElement) && ((we = f.value) === null || we === void 0 || we.focus());
        });
        fe.push(Ke);
      }
      for (var ie = arguments.length, Se = new Array(ie > 1 ? ie - 1 : 0), te = 1; te < ie; te++)
        Se[te - 1] = arguments[te];
      (z = e.onMousedown) === null || z === void 0 || z.call(e, I, ...Se);
    }, Te = V(null), D = cn(), W = () => {
      D.update();
    };
    return De(() => {
      ae(R, () => {
        var I;
        if (R.value) {
          const M = Math.ceil((I = s.value) === null || I === void 0 ? void 0 : I.offsetWidth);
          Te.value !== M && !Number.isNaN(M) && (Te.value = M);
        }
      }, {
        immediate: !0,
        flush: "post"
      });
    }), oC([s, u], R, H), iC(sf(g(g({}, Kh(e)), {
      open: b,
      triggerOpen: R,
      showSearch: a,
      multiple: i,
      toggleOpen: H
    }))), () => {
      const I = g(g({}, e), n), {
        prefixCls: M,
        id: z,
        open: G,
        defaultOpen: ce,
        mode: ie,
        // Search related
        showSearch: Se,
        searchValue: te,
        onSearch: Ke,
        // Icons
        allowClear: we,
        clearIcon: mt,
        showArrow: Ro,
        inputIcon: Ho,
        // Others
        disabled: jn,
        loading: Fo,
        getInputElement: Al,
        getPopupContainer: Mp,
        placement: Np,
        // Dropdown
        animation: Ap,
        transitionName: Dp,
        dropdownStyle: Rp,
        dropdownClassName: Hp,
        dropdownMatchSelectWidth: Fp,
        dropdownRender: zp,
        dropdownAlign: Lp,
        showAction: c_,
        direction: jp,
        // Tags
        tokenSeparators: u_,
        tagRender: Bp,
        optionLabelRender: Vp,
        // Events
        onPopupScroll: d_,
        onDropdownVisibleChange: f_,
        onFocus: p_,
        onBlur: h_,
        onKeyup: g_,
        onKeydown: m_,
        onMousedown: v_,
        onClear: ii,
        omitDomProps: ai,
        getRawInputElement: Dl,
        displayValues: zo,
        onDisplayValuesChange: Wp,
        emptyOptions: Kp,
        activeDescendantId: Up,
        activeValue: Xp,
        OptionList: Gp
      } = I, kp = sC(I, ["prefixCls", "id", "open", "defaultOpen", "mode", "showSearch", "searchValue", "onSearch", "allowClear", "clearIcon", "showArrow", "inputIcon", "disabled", "loading", "getInputElement", "getPopupContainer", "placement", "animation", "transitionName", "dropdownStyle", "dropdownClassName", "dropdownMatchSelectWidth", "dropdownRender", "dropdownAlign", "showAction", "direction", "tokenSeparators", "tagRender", "optionLabelRender", "onPopupScroll", "onDropdownVisibleChange", "onFocus", "onBlur", "onKeyup", "onKeydown", "onMousedown", "onClear", "omitDomProps", "getRawInputElement", "displayValues", "onDisplayValuesChange", "emptyOptions", "activeDescendantId", "activeValue", "OptionList"]), Rl = ie === "combobox" && Al && Al() || null, Bn = typeof Dl == "function" && Dl(), li = g({}, kp);
      let Hl;
      Bn && (Hl = (Lt) => {
        H(Lt);
      }), cC.forEach((Lt) => {
        delete li[Lt];
      }), ai == null || ai.forEach((Lt) => {
        delete li[Lt];
      });
      const Fl = Ro !== void 0 ? Ro : Fo || !i.value && ie !== "combobox";
      let zl;
      Fl && (zl = v(Rr, {
        class: ne(`${M}-arrow`, {
          [`${M}-arrow-loading`]: Fo
        }),
        customizeIcon: Ho,
        customizeIconProps: {
          loading: Fo,
          searchValue: C.value,
          open: b.value,
          focused: m.value,
          showSearch: a.value
        }
      }, null));
      let Ll;
      const Yp = () => {
        ii == null || ii(), Wp([], {
          type: "clear",
          values: zo
        }), j("", !1, !1);
      };
      !jn && we && (zo.length || C.value) && (Ll = v(Rr, {
        class: `${M}-clear`,
        onMousedown: Yp,
        customizeIcon: mt
      }, {
        default: () => [_n("×")]
      }));
      const qp = v(Gp, {
        ref: p
      }, g(g({}, c.customSlots), {
        option: r.option
      })), Qp = ne(M, n.class, {
        [`${M}-focused`]: m.value,
        [`${M}-multiple`]: i.value,
        [`${M}-single`]: !i.value,
        [`${M}-allow-clear`]: we,
        [`${M}-show-arrow`]: Fl,
        [`${M}-disabled`]: jn,
        [`${M}-loading`]: Fo,
        [`${M}-open`]: b.value,
        [`${M}-customize-input`]: Rl,
        [`${M}-show-search`]: a.value
      }), jl = v(Mw, {
        ref: u,
        disabled: jn,
        prefixCls: M,
        visible: R.value,
        popupElement: qp,
        containerWidth: Te.value,
        animation: Ap,
        transitionName: Dp,
        dropdownStyle: Rp,
        dropdownClassName: Hp,
        direction: jp,
        dropdownMatchSelectWidth: Fp,
        dropdownRender: zp,
        dropdownAlign: Lp,
        placement: Np,
        getPopupContainer: Mp,
        empty: Kp,
        getTriggerDOMNode: () => d.current,
        onPopupVisibleChange: Hl,
        onPopupMouseEnter: W,
        onPopupFocusin: ue,
        onPopupFocusout: pe
      }, {
        default: () => Bn ? an(Bn) && Nn(Bn, {
          ref: d
        }, !1, !0) : v(nC, U(U({}, e), {}, {
          domRef: d,
          prefixCls: M,
          inputElement: Rl,
          ref: f,
          id: z,
          showSearch: a.value,
          mode: ie,
          activeDescendantId: Up,
          tagRender: Bp,
          optionLabelRender: Vp,
          values: zo,
          open: b.value,
          onToggleOpen: H,
          activeValue: Xp,
          searchValue: C.value,
          onSearch: j,
          onSearchSubmit: B,
          onRemove: A,
          tokenWithEnter: N.value
        }), null)
      });
      let si;
      return Bn ? si = jl : si = v("div", U(U({}, li), {}, {
        class: Qp,
        ref: s,
        onMousedown: me,
        onKeydown: Y,
        onKeyup: re
      }), [m.value && !b.value && v("span", {
        style: {
          width: 0,
          height: 0,
          position: "absolute",
          overflow: "hidden",
          opacity: 0
        },
        "aria-live": "polite"
      }, [`${zo.map((Lt) => {
        let {
          label: Bl,
          value: Jp
        } = Lt;
        return ["number", "string"].includes(typeof Bl) ? Bl : Jp;
      }).join(", ")}`]), jl, zl, Ll]), si;
    };
  }
}), oi = (e, t) => {
  let {
    height: n,
    offset: o,
    prefixCls: r,
    onInnerResize: i
  } = e, {
    slots: a
  } = t;
  var l;
  let c = {}, s = {
    display: "flex",
    flexDirection: "column"
  };
  return o !== void 0 && (c = {
    height: `${n}px`,
    position: "relative",
    overflow: "hidden"
  }, s = g(g({}, s), {
    transform: `translateY(${o}px)`,
    position: "absolute",
    left: 0,
    right: 0,
    top: 0
  })), v("div", {
    style: c
  }, [v(Xa, {
    onResize: (d) => {
      let {
        offsetHeight: u
      } = d;
      u && i && i();
    }
  }, {
    default: () => [v("div", {
      style: s,
      class: ne({
        [`${r}-holder-inner`]: r
      })
    }, [(l = a.default) === null || l === void 0 ? void 0 : l.call(a)])]
  })]);
};
oi.displayName = "Filter";
oi.inheritAttrs = !1;
oi.props = {
  prefixCls: String,
  /** Virtual filler height. Should be `count * itemMinHeight` */
  height: Number,
  /** Set offset of visible items. Should be the top of start item position */
  offset: Number,
  onInnerResize: Function
};
const pC = oi, lp = (e, t) => {
  let {
    setRef: n
  } = e, {
    slots: o
  } = t;
  var r;
  const i = tt((r = o.default) === null || r === void 0 ? void 0 : r.call(o));
  return i && i.length ? ot(i[0], {
    ref: n
  }) : i;
};
lp.props = {
  setRef: {
    type: Function,
    default: () => {
    }
  }
};
const hC = lp, gC = 20;
function Fc(e) {
  return "touches" in e ? e.touches[0].pageY : e.pageY;
}
const mC = /* @__PURE__ */ Z({
  compatConfig: {
    MODE: 3
  },
  name: "ScrollBar",
  inheritAttrs: !1,
  props: {
    prefixCls: String,
    scrollTop: Number,
    scrollHeight: Number,
    height: Number,
    count: Number,
    onScroll: {
      type: Function
    },
    onStartMove: {
      type: Function
    },
    onStopMove: {
      type: Function
    }
  },
  setup() {
    return {
      moveRaf: null,
      scrollbarRef: Oo(),
      thumbRef: Oo(),
      visibleTimeout: null,
      state: Ye({
        dragging: !1,
        pageY: null,
        startTop: null,
        visible: !1
      })
    };
  },
  watch: {
    scrollTop: {
      handler() {
        this.delayHidden();
      },
      flush: "post"
    }
  },
  mounted() {
    var e, t;
    (e = this.scrollbarRef.current) === null || e === void 0 || e.addEventListener("touchstart", this.onScrollbarTouchStart, Re ? {
      passive: !1
    } : !1), (t = this.thumbRef.current) === null || t === void 0 || t.addEventListener("touchstart", this.onMouseDown, Re ? {
      passive: !1
    } : !1);
  },
  beforeUnmount() {
    this.removeEvents(), clearTimeout(this.visibleTimeout);
  },
  methods: {
    delayHidden() {
      clearTimeout(this.visibleTimeout), this.state.visible = !0, this.visibleTimeout = setTimeout(() => {
        this.state.visible = !1;
      }, 2e3);
    },
    onScrollbarTouchStart(e) {
      e.preventDefault();
    },
    onContainerMouseDown(e) {
      e.stopPropagation(), e.preventDefault();
    },
    // ======================= Clean =======================
    patchEvents() {
      window.addEventListener("mousemove", this.onMouseMove), window.addEventListener("mouseup", this.onMouseUp), this.thumbRef.current.addEventListener("touchmove", this.onMouseMove, Re ? {
        passive: !1
      } : !1), this.thumbRef.current.addEventListener("touchend", this.onMouseUp);
    },
    removeEvents() {
      window.removeEventListener("mousemove", this.onMouseMove), window.removeEventListener("mouseup", this.onMouseUp), this.scrollbarRef.current.removeEventListener("touchstart", this.onScrollbarTouchStart, Re ? {
        passive: !1
      } : !1), this.thumbRef.current && (this.thumbRef.current.removeEventListener("touchstart", this.onMouseDown, Re ? {
        passive: !1
      } : !1), this.thumbRef.current.removeEventListener("touchmove", this.onMouseMove, Re ? {
        passive: !1
      } : !1), this.thumbRef.current.removeEventListener("touchend", this.onMouseUp)), Oe.cancel(this.moveRaf);
    },
    // ======================= Thumb =======================
    onMouseDown(e) {
      const {
        onStartMove: t
      } = this.$props;
      g(this.state, {
        dragging: !0,
        pageY: Fc(e),
        startTop: this.getTop()
      }), t(), this.patchEvents(), e.stopPropagation(), e.preventDefault();
    },
    onMouseMove(e) {
      const {
        dragging: t,
        pageY: n,
        startTop: o
      } = this.state, {
        onScroll: r
      } = this.$props;
      if (Oe.cancel(this.moveRaf), t) {
        const i = Fc(e) - n, a = o + i, l = this.getEnableScrollRange(), c = this.getEnableHeightRange(), s = c ? a / c : 0, d = Math.ceil(s * l);
        this.moveRaf = Oe(() => {
          r(d);
        });
      }
    },
    onMouseUp() {
      const {
        onStopMove: e
      } = this.$props;
      this.state.dragging = !1, e(), this.removeEvents();
    },
    // ===================== Calculate =====================
    getSpinHeight() {
      const {
        height: e,
        scrollHeight: t
      } = this.$props;
      let n = e / t * 100;
      return n = Math.max(n, gC), n = Math.min(n, e / 2), Math.floor(n);
    },
    getEnableScrollRange() {
      const {
        scrollHeight: e,
        height: t
      } = this.$props;
      return e - t || 0;
    },
    getEnableHeightRange() {
      const {
        height: e
      } = this.$props, t = this.getSpinHeight();
      return e - t || 0;
    },
    getTop() {
      const {
        scrollTop: e
      } = this.$props, t = this.getEnableScrollRange(), n = this.getEnableHeightRange();
      return e === 0 || t === 0 ? 0 : e / t * n;
    },
    // Not show scrollbar when height is large than scrollHeight
    showScroll() {
      const {
        height: e,
        scrollHeight: t
      } = this.$props;
      return t > e;
    }
  },
  render() {
    const {
      dragging: e,
      visible: t
    } = this.state, {
      prefixCls: n
    } = this.$props, o = this.getSpinHeight() + "px", r = this.getTop() + "px", i = this.showScroll(), a = i && t;
    return v("div", {
      ref: this.scrollbarRef,
      class: ne(`${n}-scrollbar`, {
        [`${n}-scrollbar-show`]: i
      }),
      style: {
        width: "8px",
        top: 0,
        bottom: 0,
        right: 0,
        position: "absolute",
        display: a ? void 0 : "none"
      },
      onMousedown: this.onContainerMouseDown,
      onMousemove: this.delayHidden
    }, [v("div", {
      ref: this.thumbRef,
      class: ne(`${n}-scrollbar-thumb`, {
        [`${n}-scrollbar-thumb-moving`]: e
      }),
      style: {
        width: "100%",
        height: o,
        top: r,
        left: 0,
        position: "absolute",
        background: "rgba(0, 0, 0, 0.5)",
        borderRadius: "99px",
        cursor: "pointer",
        userSelect: "none"
      },
      onMousedown: this.onMouseDown
    }, null)]);
  }
});
function vC(e, t, n, o) {
  const r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), a = oe(Symbol("update"));
  ae(e, () => {
    a.value = Symbol("update");
  });
  let l;
  function c() {
    Oe.cancel(l);
  }
  function s() {
    c(), l = Oe(() => {
      r.forEach((u, f) => {
        if (u && u.offsetParent) {
          const {
            offsetHeight: p
          } = u;
          i.get(f) !== p && (a.value = Symbol("update"), i.set(f, u.offsetHeight));
        }
      });
    });
  }
  function d(u, f) {
    const p = t(u), h = r.get(p);
    f ? (r.set(p, f.$el || f), s()) : r.delete(p), !h != !f && (f ? n == null || n(u) : o == null || o(u));
  }
  return To(() => {
    c();
  }), [d, s, i, a];
}
function bC(e, t, n, o, r, i, a, l) {
  let c;
  return (s) => {
    if (s == null) {
      l();
      return;
    }
    Oe.cancel(c);
    const d = t.value, u = o.itemHeight;
    if (typeof s == "number")
      a(s);
    else if (s && typeof s == "object") {
      let f;
      const {
        align: p
      } = s;
      "index" in s ? {
        index: f
      } = s : f = d.findIndex((w) => r(w) === s.key);
      const {
        offset: h = 0
      } = s, m = (w, y) => {
        if (w < 0 || !e.value)
          return;
        const S = e.value.clientHeight;
        let _ = !1, C = y;
        if (S) {
          const x = y || p;
          let O = 0, b = 0, $ = 0;
          const T = Math.min(d.length, f);
          for (let N = 0; N <= T; N += 1) {
            const j = r(d[N]);
            b = O;
            const B = n.get(j);
            $ = b + (B === void 0 ? u : B), O = $, N === f && B === void 0 && (_ = !0);
          }
          const R = e.value.scrollTop;
          let H = null;
          switch (x) {
            case "top":
              H = b - h;
              break;
            case "bottom":
              H = $ - S + h;
              break;
            default: {
              const N = R + S;
              b < R ? C = "top" : $ > N && (C = "bottom");
            }
          }
          H !== null && H !== R && a(H);
        }
        c = Oe(() => {
          _ && i(), m(w - 1, C);
        }, 2);
      };
      m(5);
    }
  };
}
const yC = typeof navigator == "object" && /Firefox/i.test(navigator.userAgent), SC = yC, sp = (e, t) => {
  let n = !1, o = null;
  function r() {
    clearTimeout(o), n = !0, o = setTimeout(() => {
      n = !1;
    }, 50);
  }
  return function(i) {
    let a = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
    const l = (
      // Pass origin wheel when on the top
      i < 0 && e.value || // Pass origin wheel when on the bottom
      i > 0 && t.value
    );
    return a && l ? (clearTimeout(o), n = !1) : (!l || n) && r(), !n && l;
  };
};
function wC(e, t, n, o) {
  let r = 0, i = null, a = null, l = !1;
  const c = sp(t, n);
  function s(u) {
    if (!e.value)
      return;
    Oe.cancel(i);
    const {
      deltaY: f
    } = u;
    r += f, a = f, !c(f) && (SC || u.preventDefault(), i = Oe(() => {
      o(r * (l ? 10 : 1)), r = 0;
    }));
  }
  function d(u) {
    e.value && (l = u.detail === a);
  }
  return [s, d];
}
const CC = 14 / 15;
function xC(e, t, n) {
  let o = !1, r = 0, i = null, a = null;
  const l = () => {
    i && (i.removeEventListener("touchmove", c), i.removeEventListener("touchend", s));
  }, c = (f) => {
    if (o) {
      const p = Math.ceil(f.touches[0].pageY);
      let h = r - p;
      r = p, n(h) && f.preventDefault(), clearInterval(a), a = setInterval(() => {
        h *= CC, (!n(h, !0) || Math.abs(h) <= 0.1) && clearInterval(a);
      }, 16);
    }
  }, s = () => {
    o = !1, l();
  }, d = (f) => {
    l(), f.touches.length === 1 && !o && (o = !0, r = Math.ceil(f.touches[0].pageY), i = f.target, i.addEventListener("touchmove", c, {
      passive: !1
    }), i.addEventListener("touchend", s));
  }, u = () => {
  };
  De(() => {
    document.addEventListener("touchmove", u, {
      passive: !1
    }), ae(e, (f) => {
      t.value.removeEventListener("touchstart", d), l(), clearInterval(a), f && t.value.addEventListener("touchstart", d, {
        passive: !1
      });
    }, {
      immediate: !0
    });
  }), rt(() => {
    document.removeEventListener("touchmove", u);
  });
}
var OC = globalThis && globalThis.__rest || function(e, t) {
  var n = {};
  for (var o in e)
    Object.prototype.hasOwnProperty.call(e, o) && t.indexOf(o) < 0 && (n[o] = e[o]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var r = 0, o = Object.getOwnPropertySymbols(e); r < o.length; r++)
      t.indexOf(o[r]) < 0 && Object.prototype.propertyIsEnumerable.call(e, o[r]) && (n[o[r]] = e[o[r]]);
  return n;
};
const $C = [], _C = {
  overflowY: "auto",
  overflowAnchor: "none"
};
function EC(e, t, n, o, r, i) {
  let {
    getKey: a
  } = i;
  return e.slice(t, n + 1).map((l, c) => {
    const s = t + c, d = r(l, s, {
      // style: status === 'MEASURE_START' ? { visibility: 'hidden' } : {},
    }), u = a(l);
    return v(hC, {
      key: u,
      setRef: (f) => o(l, f)
    }, {
      default: () => [d]
    });
  });
}
const TC = /* @__PURE__ */ Z({
  compatConfig: {
    MODE: 3
  },
  name: "List",
  inheritAttrs: !1,
  props: {
    prefixCls: String,
    data: P.array,
    height: Number,
    itemHeight: Number,
    /** If not match virtual scroll condition, Set List still use height of container. */
    fullHeight: {
      type: Boolean,
      default: void 0
    },
    itemKey: {
      type: [String, Number, Function],
      required: !0
    },
    component: {
      type: [String, Object]
    },
    /** Set `false` will always use real scroll instead of virtual one */
    virtual: {
      type: Boolean,
      default: void 0
    },
    children: Function,
    onScroll: Function,
    onMousedown: Function,
    onMouseenter: Function,
    onVisibleChange: Function
  },
  setup(e, t) {
    let {
      expose: n
    } = t;
    const o = E(() => {
      const {
        height: A,
        itemHeight: K,
        virtual: Q
      } = e;
      return !!(Q !== !1 && A && K);
    }), r = E(() => {
      const {
        height: A,
        itemHeight: K,
        data: Q
      } = e;
      return o.value && Q && K * Q.length > A;
    }), i = Ye({
      scrollTop: 0,
      scrollMoving: !1
    }), a = E(() => e.data || $C), l = V([]);
    ae(a, () => {
      l.value = J(a.value).slice();
    }, {
      immediate: !0
    });
    const c = V((A) => {
    });
    ae(() => e.itemKey, (A) => {
      typeof A == "function" ? c.value = A : c.value = (K) => K == null ? void 0 : K[A];
    }, {
      immediate: !0
    });
    const s = V(), d = V(), u = V(), f = (A) => c.value(A), p = {
      getKey: f
    };
    function h(A) {
      let K;
      typeof A == "function" ? K = A(i.scrollTop) : K = A;
      const Q = O(K);
      s.value && (s.value.scrollTop = Q), i.scrollTop = Q;
    }
    const [m, w, y, S] = vC(l, f, null, null), _ = Ye({
      scrollHeight: void 0,
      start: 0,
      end: 0,
      offset: void 0
    }), C = V(0);
    De(() => {
      ke(() => {
        var A;
        C.value = ((A = d.value) === null || A === void 0 ? void 0 : A.offsetHeight) || 0;
      });
    }), Eo(() => {
      ke(() => {
        var A;
        C.value = ((A = d.value) === null || A === void 0 ? void 0 : A.offsetHeight) || 0;
      });
    }), ae([o, l], () => {
      o.value || g(_, {
        scrollHeight: void 0,
        start: 0,
        end: l.value.length - 1,
        offset: void 0
      });
    }, {
      immediate: !0
    }), ae([o, l, C, r], () => {
      o.value && !r.value && g(_, {
        scrollHeight: C.value,
        start: 0,
        end: l.value.length - 1,
        offset: void 0
      }), s.value && (i.scrollTop = s.value.scrollTop);
    }, {
      immediate: !0
    }), ae([r, o, () => i.scrollTop, l, S, () => e.height, C], () => {
      if (!o.value || !r.value)
        return;
      let A = 0, K, Q, X;
      const de = l.value.length, ue = l.value, pe = i.scrollTop, {
        itemHeight: fe,
        height: me
      } = e, Te = pe + me;
      for (let D = 0; D < de; D += 1) {
        const W = ue[D], I = f(W);
        let M = y.get(I);
        M === void 0 && (M = fe);
        const z = A + M;
        K === void 0 && z >= pe && (K = D, Q = A), X === void 0 && z > Te && (X = D), A = z;
      }
      K === void 0 && (K = 0, Q = 0, X = Math.ceil(me / fe)), X === void 0 && (X = de - 1), X = Math.min(X + 1, de), g(_, {
        scrollHeight: A,
        start: K,
        end: X,
        offset: Q
      });
    }, {
      immediate: !0
    });
    const x = E(() => _.scrollHeight - e.height);
    function O(A) {
      let K = A;
      return Number.isNaN(x.value) || (K = Math.min(K, x.value)), K = Math.max(K, 0), K;
    }
    const b = E(() => i.scrollTop <= 0), $ = E(() => i.scrollTop >= x.value), T = sp(b, $);
    function R(A) {
      h(A);
    }
    function H(A) {
      var K;
      const {
        scrollTop: Q
      } = A.currentTarget;
      Q !== i.scrollTop && h(Q), (K = e.onScroll) === null || K === void 0 || K.call(e, A);
    }
    const [N, j] = wC(o, b, $, (A) => {
      h((K) => K + A);
    });
    xC(o, s, (A, K) => T(A, K) ? !1 : (N({
      preventDefault() {
      },
      deltaY: A
    }), !0));
    function B(A) {
      o.value && A.preventDefault();
    }
    const F = () => {
      s.value && (s.value.removeEventListener("wheel", N, Re ? {
        passive: !1
      } : !1), s.value.removeEventListener("DOMMouseScroll", j), s.value.removeEventListener("MozMousePixelScroll", B));
    };
    ut(() => {
      ke(() => {
        s.value && (F(), s.value.addEventListener("wheel", N, Re ? {
          passive: !1
        } : !1), s.value.addEventListener("DOMMouseScroll", j), s.value.addEventListener("MozMousePixelScroll", B));
      });
    }), rt(() => {
      F();
    });
    const L = bC(s, l, y, e, f, w, h, () => {
      var A;
      (A = u.value) === null || A === void 0 || A.delayHidden();
    });
    n({
      scrollTo: L
    });
    const Y = E(() => {
      let A = null;
      return e.height && (A = g({
        [e.fullHeight ? "height" : "maxHeight"]: e.height + "px"
      }, _C), o.value && (A.overflowY = "hidden", i.scrollMoving && (A.pointerEvents = "none"))), A;
    });
    return ae([() => _.start, () => _.end, l], () => {
      if (e.onVisibleChange) {
        const A = l.value.slice(_.start, _.end + 1);
        e.onVisibleChange(A, l.value);
      }
    }, {
      flush: "post"
    }), {
      state: i,
      mergedData: l,
      componentStyle: Y,
      onFallbackScroll: H,
      onScrollBar: R,
      componentRef: s,
      useVirtual: o,
      calRes: _,
      collectHeight: w,
      setInstance: m,
      sharedConfig: p,
      scrollBarRef: u,
      fillerInnerRef: d,
      delayHideScrollBar: () => {
        var A;
        (A = u.value) === null || A === void 0 || A.delayHidden();
      }
    };
  },
  render() {
    const e = g(g({}, this.$props), this.$attrs), {
      prefixCls: t = "rc-virtual-list",
      height: n,
      itemHeight: o,
      // eslint-disable-next-line no-unused-vars
      fullHeight: r,
      data: i,
      itemKey: a,
      virtual: l,
      component: c = "div",
      onScroll: s,
      children: d = this.$slots.default,
      style: u,
      class: f
    } = e, p = OC(e, ["prefixCls", "height", "itemHeight", "fullHeight", "data", "itemKey", "virtual", "component", "onScroll", "children", "style", "class"]), h = ne(t, f), {
      scrollTop: m
    } = this.state, {
      scrollHeight: w,
      offset: y,
      start: S,
      end: _
    } = this.calRes, {
      componentStyle: C,
      onFallbackScroll: x,
      onScrollBar: O,
      useVirtual: b,
      collectHeight: $,
      sharedConfig: T,
      setInstance: R,
      mergedData: H,
      delayHideScrollBar: N
    } = this;
    return v("div", U({
      style: g(g({}, u), {
        position: "relative"
      }),
      class: h
    }, p), [v(c, {
      class: `${t}-holder`,
      style: C,
      ref: "componentRef",
      onScroll: x,
      onMouseenter: N
    }, {
      default: () => [v(pC, {
        prefixCls: t,
        height: w,
        offset: y,
        onInnerResize: $,
        ref: "fillerInnerRef"
      }, {
        default: () => EC(H, S, _, R, d, T)
      })]
    }), b && v(mC, {
      ref: "scrollBarRef",
      prefixCls: t,
      scrollTop: m,
      height: n,
      scrollHeight: w,
      count: H.length,
      onScroll: O,
      onStartMove: () => {
        this.state.scrollMoving = !0;
      },
      onStopMove: () => {
        this.state.scrollMoving = !1;
      }
    }, null)]);
  }
}), PC = TC;
function IC(e, t, n) {
  const o = oe(e());
  return ae(t, (r, i) => {
    n ? n(r, i) && (o.value = e()) : o.value = e();
  }), o;
}
function MC() {
  return /(mac\sos|macintosh)/i.test(navigator.appVersion);
}
const cp = Symbol("SelectContextKey");
function NC(e) {
  return dt(cp, e);
}
function AC() {
  return ye(cp, {});
}
var DC = globalThis && globalThis.__rest || function(e, t) {
  var n = {};
  for (var o in e)
    Object.prototype.hasOwnProperty.call(e, o) && t.indexOf(o) < 0 && (n[o] = e[o]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var r = 0, o = Object.getOwnPropertySymbols(e); r < o.length; r++)
      t.indexOf(o[r]) < 0 && Object.prototype.propertyIsEnumerable.call(e, o[r]) && (n[o[r]] = e[o[r]]);
  return n;
};
function zc(e) {
  return typeof e == "string" || typeof e == "number";
}
const RC = /* @__PURE__ */ Z({
  compatConfig: {
    MODE: 3
  },
  name: "OptionList",
  inheritAttrs: !1,
  setup(e, t) {
    let {
      expose: n,
      slots: o
    } = t;
    const r = aC(), i = AC(), a = E(() => `${r.prefixCls}-item`), l = IC(() => i.flattenOptions, [() => r.open, () => i.flattenOptions], (x) => x[0]), c = Oo(), s = (x) => {
      x.preventDefault();
    }, d = (x) => {
      c.current && c.current.scrollTo(typeof x == "number" ? {
        index: x
      } : x);
    }, u = function(x) {
      let O = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
      const b = l.value.length;
      for (let $ = 0; $ < b; $ += 1) {
        const T = (x + $ * O + b) % b, {
          group: R,
          data: H
        } = l.value[T];
        if (!R && !H.disabled)
          return T;
      }
      return -1;
    }, f = Ye({
      activeIndex: u(0)
    }), p = function(x) {
      let O = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
      f.activeIndex = x;
      const b = {
        source: O ? "keyboard" : "mouse"
      }, $ = l.value[x];
      if (!$) {
        i.onActiveValue(null, -1, b);
        return;
      }
      i.onActiveValue($.value, x, b);
    };
    ae([() => l.value.length, () => r.searchValue], () => {
      p(i.defaultActiveFirstOption !== !1 ? u(0) : -1);
    }, {
      immediate: !0
    });
    const h = (x) => i.rawValues.has(x) && r.mode !== "combobox";
    ae([() => r.open, () => r.searchValue], () => {
      if (!r.multiple && r.open && i.rawValues.size === 1) {
        const x = Array.from(i.rawValues)[0], O = J(l.value).findIndex((b) => {
          let {
            data: $
          } = b;
          return $[i.fieldNames.value] === x;
        });
        O !== -1 && (p(O), ke(() => {
          d(O);
        }));
      }
      r.open && ke(() => {
        var x;
        (x = c.current) === null || x === void 0 || x.scrollTo(void 0);
      });
    }, {
      immediate: !0,
      flush: "post"
    });
    const m = (x) => {
      x !== void 0 && i.onSelect(x, {
        selected: !i.rawValues.has(x)
      }), r.multiple || r.toggleOpen(!1);
    }, w = (x) => typeof x.label == "function" ? x.label() : x.label;
    function y(x) {
      const O = l.value[x];
      if (!O)
        return null;
      const b = O.data || {}, {
        value: $
      } = b, {
        group: T
      } = O, R = cl(b, !0), H = w(O);
      return O ? v("div", U(U({
        "aria-label": typeof H == "string" && !T ? H : null
      }, R), {}, {
        key: x,
        role: T ? "presentation" : "option",
        id: `${r.id}_list_${x}`,
        "aria-selected": h($)
      }), [$]) : null;
    }
    return n({
      onKeydown: (x) => {
        const {
          which: O,
          ctrlKey: b
        } = x;
        switch (O) {
          case ee.N:
          case ee.P:
          case ee.UP:
          case ee.DOWN: {
            let $ = 0;
            if (O === ee.UP ? $ = -1 : O === ee.DOWN ? $ = 1 : MC() && b && (O === ee.N ? $ = 1 : O === ee.P && ($ = -1)), $ !== 0) {
              const T = u(f.activeIndex + $, $);
              d(T), p(T, !0);
            }
            break;
          }
          case ee.ENTER: {
            const $ = l.value[f.activeIndex];
            $ && !$.data.disabled ? m($.value) : m(void 0), r.open && x.preventDefault();
            break;
          }
          case ee.ESC:
            r.toggleOpen(!1), r.open && x.stopPropagation();
        }
      },
      onKeyup: () => {
      },
      scrollTo: (x) => {
        d(x);
      }
    }), () => {
      const {
        id: x,
        notFoundContent: O,
        onPopupScroll: b
      } = r, {
        menuItemSelectedIcon: $,
        fieldNames: T,
        virtual: R,
        listHeight: H,
        listItemHeight: N
      } = i, j = o.option, {
        activeIndex: B
      } = f, F = Object.keys(T).map((L) => T[L]);
      return l.value.length === 0 ? v("div", {
        role: "listbox",
        id: `${x}_list`,
        class: `${a.value}-empty`,
        onMousedown: s
      }, [O]) : v(Me, null, [v("div", {
        role: "listbox",
        id: `${x}_list`,
        style: {
          height: 0,
          width: 0,
          overflow: "hidden"
        }
      }, [y(B - 1), y(B), y(B + 1)]), v(PC, {
        itemKey: "key",
        ref: c,
        data: l.value,
        height: H,
        itemHeight: N,
        fullHeight: !1,
        onMousedown: s,
        onScroll: b,
        virtual: R
      }, {
        default: (L, Y) => {
          var re;
          const {
            group: A,
            groupOption: K,
            data: Q,
            value: X
          } = L, {
            key: de
          } = Q, ue = typeof L.label == "function" ? L.label() : L.label;
          if (A) {
            const we = (re = Q.title) !== null && re !== void 0 ? re : zc(ue) && ue;
            return v("div", {
              class: ne(a.value, `${a.value}-group`),
              title: we
            }, [j ? j(Q) : ue !== void 0 ? ue : de]);
          }
          const {
            disabled: pe,
            title: fe,
            children: me,
            style: Te,
            class: D,
            className: W
          } = Q, I = DC(Q, ["disabled", "title", "children", "style", "class", "className"]), M = qr(I, F), z = h(X), G = `${a.value}-option`, ce = ne(a.value, G, D, W, {
            [`${G}-grouped`]: K,
            [`${G}-active`]: B === Y && !pe,
            [`${G}-disabled`]: pe,
            [`${G}-selected`]: z
          }), ie = w(L), Se = !$ || typeof $ == "function" || z, te = typeof ie == "number" ? ie : ie || X;
          let Ke = zc(te) ? te.toString() : void 0;
          return fe !== void 0 && (Ke = fe), v("div", U(U({}, M), {}, {
            "aria-selected": z,
            class: ce,
            title: Ke,
            onMousemove: (we) => {
              I.onMousemove && I.onMousemove(we), !(B === Y || pe) && p(Y);
            },
            onClick: (we) => {
              pe || m(X), I.onClick && I.onClick(we);
            },
            style: Te
          }), [v("div", {
            class: `${G}-content`
          }, [j ? j(Q) : te]), an($) || z, Se && v(Rr, {
            class: `${a.value}-option-state`,
            customizeIcon: $,
            customizeIconProps: {
              isSelected: z
            }
          }, {
            default: () => [z ? "✓" : null]
          })]);
        }
      })]);
    };
  }
}), HC = RC;
var FC = globalThis && globalThis.__rest || function(e, t) {
  var n = {};
  for (var o in e)
    Object.prototype.hasOwnProperty.call(e, o) && t.indexOf(o) < 0 && (n[o] = e[o]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var r = 0, o = Object.getOwnPropertySymbols(e); r < o.length; r++)
      t.indexOf(o[r]) < 0 && Object.prototype.propertyIsEnumerable.call(e, o[r]) && (n[o[r]] = e[o[r]]);
  return n;
};
function zC(e) {
  const t = e, {
    key: n,
    children: o
  } = t, r = t.props, {
    value: i,
    disabled: a
  } = r, l = FC(r, ["value", "disabled"]), c = o == null ? void 0 : o.default;
  return g({
    key: n,
    value: i !== void 0 ? i : n,
    children: c,
    disabled: a || a === ""
  }, l);
}
function pl(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
  return tt(e).map((o, r) => {
    var i;
    if (!an(o) || !o.type)
      return null;
    const {
      type: {
        isSelectOptGroup: a
      },
      key: l,
      children: c,
      props: s
    } = o;
    if (t || !a)
      return zC(o);
    const d = c && c.default ? c.default() : void 0, u = (s == null ? void 0 : s.label) || ((i = c.label) === null || i === void 0 ? void 0 : i.call(c)) || l;
    return g(g({
      key: `__RC_SELECT_GRP__${l === null ? r : String(l)}__`
    }, s), {
      label: u,
      options: pl(d || [])
    });
  }).filter((o) => o);
}
function LC(e, t, n) {
  const o = V(), r = V(), i = V(), a = V([]);
  return ae([e, t], () => {
    e.value ? a.value = J(e.value).slice() : a.value = pl(t.value);
  }, {
    immediate: !0,
    deep: !0
  }), ut(() => {
    const l = a.value, c = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), d = n.value;
    function u(f) {
      let p = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
      for (let h = 0; h < f.length; h += 1) {
        const m = f[h];
        !m[d.options] || p ? (c.set(m[d.value], m), s.set(m[d.label], m)) : u(m[d.options], !0);
      }
    }
    u(l), o.value = l, r.value = c, i.value = s;
  }), {
    options: o,
    valueOptions: r,
    labelOptions: i
  };
}
let Lc = 0;
const jC = process.env.NODE_ENV !== "test" && pt();
function BC() {
  let e;
  return jC ? (e = Lc, Lc += 1) : e = "TEST_OR_SSR", e;
}
function VC() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : oe("");
  const t = `rc_select_${BC()}`;
  return e.value || t;
}
function hl(e) {
  return Array.isArray(e) ? e : e !== void 0 ? [e] : [];
}
const WC = typeof window < "u" && window.document && window.document.documentElement;
process.env.NODE_ENV;
function KC(e) {
  const {
    mode: t,
    options: n,
    children: o,
    backfill: r,
    allowClear: i,
    placeholder: a,
    getInputElement: l,
    showSearch: c,
    onSearch: s,
    defaultOpen: d,
    autofocus: u,
    labelInValue: f,
    value: p,
    inputValue: h,
    optionLabelProp: m
  } = e, w = fl(t), y = c !== void 0 ? c : w || t === "combobox", S = n || pl(o);
  if (Xe(t !== "tags" || S.every((_) => !_.disabled), "Please avoid setting option to disabled in tags mode since user can always type text as tag."), Xe(t !== "combobox" || !m, "`combobox` mode not support `optionLabelProp`. Please set `value` on Option directly."), Xe(t === "combobox" || !r, "`backfill` only works with `combobox` mode."), Xe(t === "combobox" || !l, "`getInputElement` only work with `combobox` mode."), $s(t !== "combobox" || !l || !i || !a, "Customize `getInputElement` should customize clear and placeholder logic instead of configuring `allowClear` and `placeholder`."), s && !y && t !== "combobox" && t !== "tags" && Xe(!1, "`onSearch` should work with `showSearch` instead of use alone."), $s(!d || u, "`defaultOpen` makes Select open without focus which means it will not close by click outside. You can set `autofocus` if needed."), p != null) {
    const _ = hl(p);
    Xe(!f || _.every((C) => typeof C == "object" && ("key" in C || "value" in C)), "`value` should in shape of `{ value: string | number, label?: any }` when you set `labelInValue` to `true`"), Xe(!w || Array.isArray(p), "`value` should be array when `mode` is `multiple` or `tags`");
  }
  if (o) {
    let _ = null;
    o.some((C) => {
      var x;
      if (!an(C) || !C.type)
        return !1;
      const {
        type: O
      } = C;
      return O.isSelectOption ? !1 : O.isSelectOptGroup ? !(((x = C.children) === null || x === void 0 ? void 0 : x.default()) || []).every((T) => !an(T) || !C.type || T.type.isSelectOption ? !0 : (_ = T.type, !1)) : (_ = O, !0);
    }), _ && Xe(!1, `\`children\` should be \`Select.Option\` or \`Select.OptGroup\` instead of \`${_.displayName || _.name || _}\`.`), Xe(h === void 0, "`inputValue` is deprecated, please use `searchValue` instead.");
  }
}
function Ai(e, t) {
  return hl(e).join("").toUpperCase().includes(t);
}
const UC = (e, t, n, o, r) => E(() => {
  const i = n.value, a = r == null ? void 0 : r.value, l = o == null ? void 0 : o.value;
  if (!i || l === !1)
    return e.value;
  const {
    options: c,
    label: s,
    value: d
  } = t.value, u = [], f = typeof l == "function", p = i.toUpperCase(), h = f ? l : (w, y) => a ? Ai(y[a], p) : y[c] ? Ai(y[s !== "children" ? s : "label"], p) : Ai(y[d], p), m = f ? (w) => pa(w) : (w) => w;
  return e.value.forEach((w) => {
    if (w[c]) {
      if (h(i, m(w)))
        u.push(w);
      else {
        const S = w[c].filter((_) => h(i, m(_)));
        S.length && u.push(g(g({}, w), {
          [c]: S
        }));
      }
      return;
    }
    h(i, m(w)) && u.push(w);
  }), u;
}), XC = (e, t) => {
  const n = V({
    values: /* @__PURE__ */ new Map(),
    options: /* @__PURE__ */ new Map()
  });
  return [E(() => {
    const {
      values: i,
      options: a
    } = n.value, l = e.value.map((d) => {
      var u;
      return d.label === void 0 ? g(g({}, d), {
        label: (u = i.get(d.value)) === null || u === void 0 ? void 0 : u.label
      }) : d;
    }), c = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
    return l.forEach((d) => {
      c.set(d.value, d), s.set(d.value, t.value.get(d.value) || a.get(d.value));
    }), n.value.values = c, n.value.options = s, l;
  }), (i) => t.value.get(i) || n.value.options.get(i)];
};
function jc(e, t) {
  const {
    defaultValue: n,
    value: o = oe()
  } = t || {};
  let r = typeof e == "function" ? e() : e;
  o.value !== void 0 && (r = $n(o)), n !== void 0 && (r = typeof n == "function" ? n() : n);
  const i = oe(r), a = oe(r);
  ut(() => {
    let c = o.value !== void 0 ? o.value : i.value;
    t.postState && (c = t.postState(c)), a.value = c;
  });
  function l(c) {
    const s = a.value;
    i.value = c, J(a.value) !== c && t.onChange && t.onChange(c, s);
  }
  return ae(o, () => {
    i.value = o.value;
  }), [a, l];
}
function Bc(e) {
  const t = typeof e == "function" ? e() : e, n = oe(t);
  function o(r) {
    n.value = r;
  }
  return [n, o];
}
const GC = ["inputValue"];
function up() {
  return g(g({}, ap()), {
    prefixCls: String,
    id: String,
    backfill: {
      type: Boolean,
      default: void 0
    },
    // >>> Field Names
    fieldNames: Object,
    // >>> Search
    /** @deprecated Use `searchValue` instead */
    inputValue: String,
    searchValue: String,
    onSearch: Function,
    autoClearSearchValue: {
      type: Boolean,
      default: void 0
    },
    // >>> Select
    onSelect: Function,
    onDeselect: Function,
    // >>> Options
    /**
     * In Select, `false` means do nothing.
     * In TreeSelect, `false` will highlight match item.
     * It's by design.
     */
    filterOption: {
      type: [Boolean, Function],
      default: void 0
    },
    filterSort: Function,
    optionFilterProp: String,
    optionLabelProp: String,
    options: Array,
    defaultActiveFirstOption: {
      type: Boolean,
      default: void 0
    },
    virtual: {
      type: Boolean,
      default: void 0
    },
    listHeight: Number,
    listItemHeight: Number,
    // >>> Icon
    menuItemSelectedIcon: P.any,
    mode: String,
    labelInValue: {
      type: Boolean,
      default: void 0
    },
    value: P.any,
    defaultValue: P.any,
    onChange: Function,
    children: Array
  });
}
function kC(e) {
  return !e || typeof e != "object";
}
const YC = /* @__PURE__ */ Z({
  compatConfig: {
    MODE: 3
  },
  name: "VcSelect",
  inheritAttrs: !1,
  props: Kr(up(), {
    prefixCls: "vc-select",
    autoClearSearchValue: !0,
    listHeight: 200,
    listItemHeight: 20,
    dropdownMatchSelectWidth: !0
  }),
  setup(e, t) {
    let {
      expose: n,
      attrs: o,
      slots: r
    } = t;
    const i = VC(at(e, "id")), a = E(() => fl(e.mode)), l = E(() => !!(!e.options && e.children)), c = E(() => e.filterOption === void 0 && e.mode === "combobox" ? !1 : e.filterOption), s = E(() => Of(e.fieldNames, l.value)), [d, u] = jc("", {
      value: E(() => e.searchValue !== void 0 ? e.searchValue : e.inputValue),
      postState: (D) => D || ""
    }), f = LC(at(e, "options"), at(e, "children"), s), {
      valueOptions: p,
      labelOptions: h,
      options: m
    } = f, w = (D) => hl(D).map((I) => {
      var M, z;
      let G, ce, ie, Se;
      kC(I) ? G = I : (ie = I.key, ce = I.label, G = (M = I.value) !== null && M !== void 0 ? M : ie);
      const te = p.value.get(G);
      return te && (ce === void 0 && (ce = te == null ? void 0 : te[e.optionLabelProp || s.value.label]), ie === void 0 && (ie = (z = te == null ? void 0 : te.key) !== null && z !== void 0 ? z : G), Se = te == null ? void 0 : te.disabled), {
        label: ce,
        value: G,
        key: ie,
        disabled: Se,
        option: te
      };
    }), [y, S] = jc(e.defaultValue, {
      value: at(e, "value")
    }), _ = E(() => {
      var D;
      const W = w(y.value);
      return e.mode === "combobox" && !(!((D = W[0]) === null || D === void 0) && D.value) ? [] : W;
    }), [C, x] = XC(_, p), O = E(() => {
      if (!e.mode && C.value.length === 1) {
        const D = C.value[0];
        if (D.value === null && (D.label === null || D.label === void 0))
          return [];
      }
      return C.value.map((D) => {
        var W;
        return g(g({}, D), {
          label: (W = typeof D.label == "function" ? D.label() : D.label) !== null && W !== void 0 ? W : D.value
        });
      });
    }), b = E(() => new Set(C.value.map((D) => D.value)));
    ut(() => {
      var D;
      if (e.mode === "combobox") {
        const W = (D = C.value[0]) === null || D === void 0 ? void 0 : D.value;
        W != null && u(String(W));
      }
    }, {
      flush: "post"
    });
    const $ = (D, W) => {
      const I = W ?? D;
      return {
        [s.value.value]: D,
        [s.value.label]: I
      };
    }, T = V();
    ut(() => {
      if (e.mode !== "tags") {
        T.value = m.value;
        return;
      }
      const D = m.value.slice(), W = (I) => p.value.has(I);
      [...C.value].sort((I, M) => I.value < M.value ? -1 : 1).forEach((I) => {
        const M = I.value;
        W(M) || D.push($(M, I.label));
      }), T.value = D;
    });
    const R = UC(T, s, d, c, at(e, "optionFilterProp")), H = E(() => e.mode !== "tags" || !d.value || R.value.some((D) => D[e.optionFilterProp || "value"] === d.value) ? R.value : [$(d.value), ...R.value]), N = E(() => e.filterSort ? [...H.value].sort((D, W) => e.filterSort(D, W)) : H.value), j = E(() => Sb(N.value, {
      fieldNames: s.value,
      childrenAsData: l.value
    })), B = (D) => {
      const W = w(D);
      if (S(W), e.onChange && // Trigger event only when value changed
      (W.length !== C.value.length || W.some((I, M) => {
        var z;
        return ((z = C.value[M]) === null || z === void 0 ? void 0 : z.value) !== (I == null ? void 0 : I.value);
      }))) {
        const I = e.labelInValue ? W.map((z) => g(g({}, z), {
          originLabel: z.label,
          label: typeof z.label == "function" ? z.label() : z.label
        })) : W.map((z) => z.value), M = W.map((z) => pa(x(z.value)));
        e.onChange(
          // Value
          a.value ? I : I[0],
          // Option
          a.value ? M : M[0]
        );
      }
    }, [F, L] = Bc(null), [Y, re] = Bc(0), A = E(() => e.defaultActiveFirstOption !== void 0 ? e.defaultActiveFirstOption : e.mode !== "combobox"), K = function(D, W) {
      let {
        source: I = "keyboard"
      } = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      re(W), e.backfill && e.mode === "combobox" && D !== null && I === "keyboard" && L(String(D));
    }, Q = (D, W) => {
      const I = () => {
        var M;
        const z = x(D), G = z == null ? void 0 : z[s.value.label];
        return [e.labelInValue ? {
          label: typeof G == "function" ? G() : G,
          originLabel: G,
          value: D,
          key: (M = z == null ? void 0 : z.key) !== null && M !== void 0 ? M : D
        } : D, pa(z)];
      };
      if (W && e.onSelect) {
        const [M, z] = I();
        e.onSelect(M, z);
      } else if (!W && e.onDeselect) {
        const [M, z] = I();
        e.onDeselect(M, z);
      }
    }, X = (D, W) => {
      let I;
      const M = a.value ? W.selected : !0;
      M ? I = a.value ? [...C.value, D] : [D] : I = C.value.filter((z) => z.value !== D), B(I), Q(D, M), e.mode === "combobox" ? L("") : (!a.value || e.autoClearSearchValue) && (u(""), L(""));
    }, de = (D, W) => {
      B(D), (W.type === "remove" || W.type === "clear") && W.values.forEach((I) => {
        Q(I.value, !1);
      });
    }, ue = (D, W) => {
      var I;
      if (u(D), L(null), W.source === "submit") {
        const M = (D || "").trim();
        if (M) {
          const z = Array.from(/* @__PURE__ */ new Set([...b.value, M]));
          B(z), Q(M, !0), u("");
        }
        return;
      }
      W.source !== "blur" && (e.mode === "combobox" && B(D), (I = e.onSearch) === null || I === void 0 || I.call(e, D));
    }, pe = (D) => {
      let W = D;
      e.mode !== "tags" && (W = D.map((M) => {
        const z = h.value.get(M);
        return z == null ? void 0 : z.value;
      }).filter((M) => M !== void 0));
      const I = Array.from(/* @__PURE__ */ new Set([...b.value, ...W]));
      B(I), I.forEach((M) => {
        Q(M, !0);
      });
    }, fe = E(() => e.virtual !== !1 && e.dropdownMatchSelectWidth !== !1);
    NC(sf(g(g({}, f), {
      flattenOptions: j,
      onActiveValue: K,
      defaultActiveFirstOption: A,
      onSelect: X,
      menuItemSelectedIcon: at(e, "menuItemSelectedIcon"),
      rawValues: b,
      fieldNames: s,
      virtual: fe,
      listHeight: at(e, "listHeight"),
      listItemHeight: at(e, "listItemHeight"),
      childrenAsData: l
    }))), process.env.NODE_ENV !== "production" && ut(() => {
      KC(e);
    }, {
      flush: "post"
    });
    const me = oe();
    n({
      focus() {
        var D;
        (D = me.value) === null || D === void 0 || D.focus();
      },
      blur() {
        var D;
        (D = me.value) === null || D === void 0 || D.blur();
      },
      scrollTo(D) {
        var W;
        (W = me.value) === null || W === void 0 || W.scrollTo(D);
      }
    });
    const Te = E(() => qr(e, [
      "id",
      "mode",
      "prefixCls",
      "backfill",
      "fieldNames",
      // Search
      "inputValue",
      "searchValue",
      "onSearch",
      "autoClearSearchValue",
      // Select
      "onSelect",
      "onDeselect",
      "dropdownMatchSelectWidth",
      // Options
      "filterOption",
      "filterSort",
      "optionFilterProp",
      "optionLabelProp",
      "options",
      "children",
      "defaultActiveFirstOption",
      "menuItemSelectedIcon",
      "virtual",
      "listHeight",
      "listItemHeight",
      // Value
      "value",
      "defaultValue",
      "labelInValue",
      "onChange"
    ]));
    return () => v(fC, U(U(U({}, Te.value), o), {}, {
      id: i,
      prefixCls: e.prefixCls,
      ref: me,
      omitDomProps: GC,
      mode: e.mode,
      displayValues: O.value,
      onDisplayValuesChange: de,
      searchValue: d.value,
      onSearch: ue,
      onSearchSplit: pe,
      dropdownMatchSelectWidth: e.dropdownMatchSelectWidth,
      OptionList: HC,
      emptyOptions: !j.value.length,
      activeValue: F.value,
      activeDescendantId: `${i}_list_${Y.value}`
    }), r);
  }
}), gl = () => null;
gl.isSelectOption = !0;
gl.displayName = "ASelectOption";
const qC = gl, ml = () => null;
ml.isSelectOptGroup = !0;
ml.displayName = "ASelectOptGroup";
const QC = ml;
var JC = { icon: { tag: "svg", attrs: { viewBox: "64 64 896 896", focusable: "false" }, children: [{ tag: "path", attrs: { d: "M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z" } }] }, name: "down", theme: "outlined" };
const ZC = JC;
var ex = Symbol("iconContext"), dp = function() {
  return ye(ex, {
    prefixCls: oe("anticon"),
    rootClassName: oe(""),
    csp: oe()
  });
};
function vl() {
  return !!(typeof window < "u" && window.document && window.document.createElement);
}
function tx(e, t) {
  return e && e.contains ? e.contains(t) : !1;
}
var Vc = "data-vc-order", nx = "vc-icon-key", Oa = /* @__PURE__ */ new Map();
function fp() {
  var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, t = e.mark;
  return t ? t.startsWith("data-") ? t : "data-".concat(t) : nx;
}
function bl(e) {
  if (e.attachTo)
    return e.attachTo;
  var t = document.querySelector("head");
  return t || document.body;
}
function ox(e) {
  return e === "queue" ? "prependQueue" : e ? "prepend" : "append";
}
function pp(e) {
  return Array.from((Oa.get(e) || e).children).filter(function(t) {
    return t.tagName === "STYLE";
  });
}
function hp(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  if (!vl())
    return null;
  var n = t.csp, o = t.prepend, r = document.createElement("style");
  r.setAttribute(Vc, ox(o)), n && n.nonce && (r.nonce = n.nonce), r.innerHTML = e;
  var i = bl(t), a = i.firstChild;
  if (o) {
    if (o === "queue") {
      var l = pp(i).filter(function(c) {
        return ["prepend", "prependQueue"].includes(c.getAttribute(Vc));
      });
      if (l.length)
        return i.insertBefore(r, l[l.length - 1].nextSibling), r;
    }
    i.insertBefore(r, a);
  } else
    i.appendChild(r);
  return r;
}
function rx(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = bl(t);
  return pp(n).find(function(o) {
    return o.getAttribute(fp(t)) === e;
  });
}
function ix(e, t) {
  var n = Oa.get(e);
  if (!n || !tx(document, n)) {
    var o = hp("", t), r = o.parentNode;
    Oa.set(e, r), e.removeChild(o);
  }
}
function ax(e, t) {
  var n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, o = bl(n);
  ix(o, n);
  var r = rx(t, n);
  if (r)
    return n.csp && n.csp.nonce && r.nonce !== n.csp.nonce && (r.nonce = n.csp.nonce), r.innerHTML !== e && (r.innerHTML = e), r;
  var i = hp(e, n);
  return i.setAttribute(fp(n), t), i;
}
function Wc(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? Object(arguments[t]) : {}, o = Object.keys(n);
    typeof Object.getOwnPropertySymbols == "function" && (o = o.concat(Object.getOwnPropertySymbols(n).filter(function(r) {
      return Object.getOwnPropertyDescriptor(n, r).enumerable;
    }))), o.forEach(function(r) {
      lx(e, r, n[r]);
    });
  }
  return e;
}
function lx(e, t, n) {
  return t in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function sx(e, t) {
  process.env.NODE_ENV !== "production" && !e && console !== void 0 && console.error("Warning: ".concat(t));
}
function cx(e, t) {
  sx(e, "[@ant-design/icons-vue] ".concat(t));
}
function Kc(e) {
  return typeof e == "object" && typeof e.name == "string" && typeof e.theme == "string" && (typeof e.icon == "object" || typeof e.icon == "function");
}
function $a(e, t, n) {
  return n ? wt(e.tag, Wc({
    key: t
  }, n, e.attrs), (e.children || []).map(function(o, r) {
    return $a(o, "".concat(t, "-").concat(e.tag, "-").concat(r));
  })) : wt(e.tag, Wc({
    key: t
  }, e.attrs), (e.children || []).map(function(o, r) {
    return $a(o, "".concat(t, "-").concat(e.tag, "-").concat(r));
  }));
}
function gp(e) {
  return vo(e)[0];
}
function mp(e) {
  return e ? Array.isArray(e) ? e : [e] : [];
}
var ux = `
.anticon {
  display: inline-block;
  color: inherit;
  font-style: normal;
  line-height: 0;
  text-align: center;
  text-transform: none;
  vertical-align: -0.125em;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.anticon > * {
  line-height: 1;
}

.anticon svg {
  display: inline-block;
}

.anticon::before {
  display: none;
}

.anticon .anticon-icon {
  display: block;
}

.anticon[tabindex] {
  cursor: pointer;
}

.anticon-spin::before,
.anticon-spin {
  display: inline-block;
  -webkit-animation: loadingCircle 1s infinite linear;
  animation: loadingCircle 1s infinite linear;
}

@-webkit-keyframes loadingCircle {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes loadingCircle {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
`;
function vp(e) {
  return e && e.getRootNode && e.getRootNode();
}
function dx(e) {
  return vl() ? vp(e) instanceof ShadowRoot : !1;
}
function fx(e) {
  return dx(e) ? vp(e) : null;
}
var px = function() {
  var t = dp(), n = t.prefixCls, o = t.csp, r = cn(), i = ux;
  n && (i = i.replace(/anticon/g, n.value)), ke(function() {
    if (vl()) {
      var a = r.vnode.el, l = fx(a);
      ax(i, "@ant-design-vue-icons", {
        prepend: !0,
        csp: o.value,
        attachTo: l
      });
    }
  });
}, hx = ["icon", "primaryColor", "secondaryColor"];
function gx(e, t) {
  if (e == null)
    return {};
  var n = mx(e, t), o, r;
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    for (r = 0; r < i.length; r++)
      o = i[r], !(t.indexOf(o) >= 0) && Object.prototype.propertyIsEnumerable.call(e, o) && (n[o] = e[o]);
  }
  return n;
}
function mx(e, t) {
  if (e == null)
    return {};
  var n = {}, o = Object.keys(e), r, i;
  for (i = 0; i < o.length; i++)
    r = o[i], !(t.indexOf(r) >= 0) && (n[r] = e[r]);
  return n;
}
function hr(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? Object(arguments[t]) : {}, o = Object.keys(n);
    typeof Object.getOwnPropertySymbols == "function" && (o = o.concat(Object.getOwnPropertySymbols(n).filter(function(r) {
      return Object.getOwnPropertyDescriptor(n, r).enumerable;
    }))), o.forEach(function(r) {
      vx(e, r, n[r]);
    });
  }
  return e;
}
function vx(e, t, n) {
  return t in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
var ro = Ye({
  primaryColor: "#333",
  secondaryColor: "#E6E6E6",
  calculated: !1
});
function bx(e) {
  var t = e.primaryColor, n = e.secondaryColor;
  ro.primaryColor = t, ro.secondaryColor = n || gp(t), ro.calculated = !!n;
}
function yx() {
  return hr({}, ro);
}
var zn = function(t, n) {
  var o = hr({}, t, n.attrs), r = o.icon, i = o.primaryColor, a = o.secondaryColor, l = gx(o, hx), c = ro;
  if (i && (c = {
    primaryColor: i,
    secondaryColor: a || gp(i)
  }), cx(Kc(r), "icon should be icon definiton, but got ".concat(r)), !Kc(r))
    return null;
  var s = r;
  return s && typeof s.icon == "function" && (s = hr({}, s, {
    icon: s.icon(c.primaryColor, c.secondaryColor)
  })), $a(s.icon, "svg-".concat(s.name), hr({}, l, {
    "data-icon": s.name,
    width: "1em",
    height: "1em",
    fill: "currentColor",
    "aria-hidden": "true"
  }));
};
zn.props = {
  icon: Object,
  primaryColor: String,
  secondaryColor: String,
  focusable: String
};
zn.inheritAttrs = !1;
zn.displayName = "IconBase";
zn.getTwoToneColors = yx;
zn.setTwoToneColors = bx;
const yl = zn;
function Sx(e, t) {
  return Ox(e) || xx(e, t) || Cx(e, t) || wx();
}
function wx() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Cx(e, t) {
  if (e) {
    if (typeof e == "string")
      return Uc(e, t);
    var n = Object.prototype.toString.call(e).slice(8, -1);
    if (n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set")
      return Array.from(e);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return Uc(e, t);
  }
}
function Uc(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, o = new Array(t); n < t; n++)
    o[n] = e[n];
  return o;
}
function xx(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var o = [], r = !0, i = !1, a, l;
    try {
      for (n = n.call(e); !(r = (a = n.next()).done) && (o.push(a.value), !(t && o.length === t)); r = !0)
        ;
    } catch (c) {
      i = !0, l = c;
    } finally {
      try {
        !r && n.return != null && n.return();
      } finally {
        if (i)
          throw l;
      }
    }
    return o;
  }
}
function Ox(e) {
  if (Array.isArray(e))
    return e;
}
function bp(e) {
  var t = mp(e), n = Sx(t, 2), o = n[0], r = n[1];
  return yl.setTwoToneColors({
    primaryColor: o,
    secondaryColor: r
  });
}
function $x() {
  var e = yl.getTwoToneColors();
  return e.calculated ? [e.primaryColor, e.secondaryColor] : e.primaryColor;
}
var _x = /* @__PURE__ */ Z({
  name: "InsertStyles",
  setup: function() {
    return px(), function() {
      return null;
    };
  }
}), Ex = ["class", "icon", "spin", "rotate", "tabindex", "twoToneColor", "onClick"];
function Tx(e, t) {
  return Nx(e) || Mx(e, t) || Ix(e, t) || Px();
}
function Px() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Ix(e, t) {
  if (e) {
    if (typeof e == "string")
      return Xc(e, t);
    var n = Object.prototype.toString.call(e).slice(8, -1);
    if (n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set")
      return Array.from(e);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return Xc(e, t);
  }
}
function Xc(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, o = new Array(t); n < t; n++)
    o[n] = e[n];
  return o;
}
function Mx(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var o = [], r = !0, i = !1, a, l;
    try {
      for (n = n.call(e); !(r = (a = n.next()).done) && (o.push(a.value), !(t && o.length === t)); r = !0)
        ;
    } catch (c) {
      i = !0, l = c;
    } finally {
      try {
        !r && n.return != null && n.return();
      } finally {
        if (i)
          throw l;
      }
    }
    return o;
  }
}
function Nx(e) {
  if (Array.isArray(e))
    return e;
}
function Gc(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? Object(arguments[t]) : {}, o = Object.keys(n);
    typeof Object.getOwnPropertySymbols == "function" && (o = o.concat(Object.getOwnPropertySymbols(n).filter(function(r) {
      return Object.getOwnPropertyDescriptor(n, r).enumerable;
    }))), o.forEach(function(r) {
      Zn(e, r, n[r]);
    });
  }
  return e;
}
function Zn(e, t, n) {
  return t in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Ax(e, t) {
  if (e == null)
    return {};
  var n = Dx(e, t), o, r;
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    for (r = 0; r < i.length; r++)
      o = i[r], !(t.indexOf(o) >= 0) && Object.prototype.propertyIsEnumerable.call(e, o) && (n[o] = e[o]);
  }
  return n;
}
function Dx(e, t) {
  if (e == null)
    return {};
  var n = {}, o = Object.keys(e), r, i;
  for (i = 0; i < o.length; i++)
    r = o[i], !(t.indexOf(r) >= 0) && (n[r] = e[r]);
  return n;
}
bp(S0.primary);
var Ln = function(t, n) {
  var o, r = Gc({}, t, n.attrs), i = r.class, a = r.icon, l = r.spin, c = r.rotate, s = r.tabindex, d = r.twoToneColor, u = r.onClick, f = Ax(r, Ex), p = dp(), h = p.prefixCls, m = p.rootClassName, w = (o = {}, Zn(o, m.value, !!m.value), Zn(o, h.value, !0), Zn(o, "".concat(h.value, "-").concat(a.name), !!a.name), Zn(o, "".concat(h.value, "-spin"), !!l || a.name === "loading"), o), y = s;
  y === void 0 && u && (y = -1);
  var S = c ? {
    msTransform: "rotate(".concat(c, "deg)"),
    transform: "rotate(".concat(c, "deg)")
  } : void 0, _ = mp(d), C = Tx(_, 2), x = C[0], O = C[1];
  return v("span", Gc({
    role: "img",
    "aria-label": a.name
  }, f, {
    onClick: u,
    class: [w, i],
    tabindex: y
  }), [v(yl, {
    icon: a,
    primaryColor: x,
    secondaryColor: O,
    style: S
  }, null), v(_x, null, null)]);
};
Ln.props = {
  spin: Boolean,
  rotate: Number,
  icon: Object,
  twoToneColor: [String, Array]
};
Ln.displayName = "AntdIcon";
Ln.inheritAttrs = !1;
Ln.getTwoToneColor = $x;
Ln.setTwoToneColor = bp;
const gt = Ln;
function kc(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? Object(arguments[t]) : {}, o = Object.keys(n);
    typeof Object.getOwnPropertySymbols == "function" && (o = o.concat(Object.getOwnPropertySymbols(n).filter(function(r) {
      return Object.getOwnPropertyDescriptor(n, r).enumerable;
    }))), o.forEach(function(r) {
      Rx(e, r, n[r]);
    });
  }
  return e;
}
function Rx(e, t, n) {
  return t in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
var Sl = function(t, n) {
  var o = kc({}, t, n.attrs);
  return v(gt, kc({}, o, {
    icon: ZC
  }), null);
};
Sl.displayName = "DownOutlined";
Sl.inheritAttrs = !1;
const Hx = Sl;
var Fx = { icon: { tag: "svg", attrs: { viewBox: "0 0 1024 1024", focusable: "false" }, children: [{ tag: "path", attrs: { d: "M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z" } }] }, name: "loading", theme: "outlined" };
const zx = Fx;
function Yc(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? Object(arguments[t]) : {}, o = Object.keys(n);
    typeof Object.getOwnPropertySymbols == "function" && (o = o.concat(Object.getOwnPropertySymbols(n).filter(function(r) {
      return Object.getOwnPropertyDescriptor(n, r).enumerable;
    }))), o.forEach(function(r) {
      Lx(e, r, n[r]);
    });
  }
  return e;
}
function Lx(e, t, n) {
  return t in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
var wl = function(t, n) {
  var o = Yc({}, t, n.attrs);
  return v(gt, Yc({}, o, {
    icon: zx
  }), null);
};
wl.displayName = "LoadingOutlined";
wl.inheritAttrs = !1;
const jx = wl;
var Bx = { icon: { tag: "svg", attrs: { viewBox: "64 64 896 896", focusable: "false" }, children: [{ tag: "path", attrs: { d: "M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z" } }] }, name: "check", theme: "outlined" };
const Vx = Bx;
function qc(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? Object(arguments[t]) : {}, o = Object.keys(n);
    typeof Object.getOwnPropertySymbols == "function" && (o = o.concat(Object.getOwnPropertySymbols(n).filter(function(r) {
      return Object.getOwnPropertyDescriptor(n, r).enumerable;
    }))), o.forEach(function(r) {
      Wx(e, r, n[r]);
    });
  }
  return e;
}
function Wx(e, t, n) {
  return t in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
var Cl = function(t, n) {
  var o = qc({}, t, n.attrs);
  return v(gt, qc({}, o, {
    icon: Vx
  }), null);
};
Cl.displayName = "CheckOutlined";
Cl.inheritAttrs = !1;
const Kx = Cl;
var Ux = { icon: { tag: "svg", attrs: { "fill-rule": "evenodd", viewBox: "64 64 896 896", focusable: "false" }, children: [{ tag: "path", attrs: { d: "M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z" } }] }, name: "close", theme: "outlined" };
const Xx = Ux;
function Qc(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? Object(arguments[t]) : {}, o = Object.keys(n);
    typeof Object.getOwnPropertySymbols == "function" && (o = o.concat(Object.getOwnPropertySymbols(n).filter(function(r) {
      return Object.getOwnPropertyDescriptor(n, r).enumerable;
    }))), o.forEach(function(r) {
      Gx(e, r, n[r]);
    });
  }
  return e;
}
function Gx(e, t, n) {
  return t in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
var xl = function(t, n) {
  var o = Qc({}, t, n.attrs);
  return v(gt, Qc({}, o, {
    icon: Xx
  }), null);
};
xl.displayName = "CloseOutlined";
xl.inheritAttrs = !1;
const kx = xl;
var Yx = { icon: { tag: "svg", attrs: { "fill-rule": "evenodd", viewBox: "64 64 896 896", focusable: "false" }, children: [{ tag: "path", attrs: { d: "M512 64c247.4 0 448 200.6 448 448S759.4 960 512 960 64 759.4 64 512 264.6 64 512 64zm127.98 274.82h-.04l-.08.06L512 466.75 384.14 338.88c-.04-.05-.06-.06-.08-.06a.12.12 0 00-.07 0c-.03 0-.05.01-.09.05l-45.02 45.02a.2.2 0 00-.05.09.12.12 0 000 .07v.02a.27.27 0 00.06.06L466.75 512 338.88 639.86c-.05.04-.06.06-.06.08a.12.12 0 000 .07c0 .03.01.05.05.09l45.02 45.02a.2.2 0 00.09.05.12.12 0 00.07 0c.02 0 .04-.01.08-.05L512 557.25l127.86 127.87c.04.04.06.05.08.05a.12.12 0 00.07 0c.03 0 .05-.01.09-.05l45.02-45.02a.2.2 0 00.05-.09.12.12 0 000-.07v-.02a.27.27 0 00-.05-.06L557.25 512l127.87-127.86c.04-.04.05-.06.05-.08a.12.12 0 000-.07c0-.03-.01-.05-.05-.09l-45.02-45.02a.2.2 0 00-.09-.05.12.12 0 00-.07 0z" } }] }, name: "close-circle", theme: "filled" };
const qx = Yx;
function Jc(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? Object(arguments[t]) : {}, o = Object.keys(n);
    typeof Object.getOwnPropertySymbols == "function" && (o = o.concat(Object.getOwnPropertySymbols(n).filter(function(r) {
      return Object.getOwnPropertyDescriptor(n, r).enumerable;
    }))), o.forEach(function(r) {
      Qx(e, r, n[r]);
    });
  }
  return e;
}
function Qx(e, t, n) {
  return t in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
var Ol = function(t, n) {
  var o = Jc({}, t, n.attrs);
  return v(gt, Jc({}, o, {
    icon: qx
  }), null);
};
Ol.displayName = "CloseCircleFilled";
Ol.inheritAttrs = !1;
const Jx = Ol;
var Zx = { icon: { tag: "svg", attrs: { viewBox: "64 64 896 896", focusable: "false" }, children: [{ tag: "path", attrs: { d: "M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z" } }] }, name: "search", theme: "outlined" };
const eO = Zx;
function Zc(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? Object(arguments[t]) : {}, o = Object.keys(n);
    typeof Object.getOwnPropertySymbols == "function" && (o = o.concat(Object.getOwnPropertySymbols(n).filter(function(r) {
      return Object.getOwnPropertyDescriptor(n, r).enumerable;
    }))), o.forEach(function(r) {
      tO(e, r, n[r]);
    });
  }
  return e;
}
function tO(e, t, n) {
  return t in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
var $l = function(t, n) {
  var o = Zc({}, t, n.attrs);
  return v(gt, Zc({}, o, {
    icon: eO
  }), null);
};
$l.displayName = "SearchOutlined";
$l.inheritAttrs = !1;
const nO = $l;
function oO(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  const {
    loading: n,
    multiple: o,
    prefixCls: r,
    hasFeedback: i,
    feedbackIcon: a,
    showArrow: l
  } = e, c = e.suffixIcon || t.suffixIcon && t.suffixIcon(), s = e.clearIcon || t.clearIcon && t.clearIcon(), d = e.menuItemSelectedIcon || t.menuItemSelectedIcon && t.menuItemSelectedIcon(), u = e.removeIcon || t.removeIcon && t.removeIcon(), f = s ?? v(Jx, null, null), p = (y) => v(Me, null, [l !== !1 && y, i && a]);
  let h = null;
  if (c !== void 0)
    h = p(c);
  else if (n)
    h = p(v(jx, {
      spin: !0
    }, null));
  else {
    const y = `${r}-suffix`;
    h = (S) => {
      let {
        open: _,
        showSearch: C
      } = S;
      return p(_ && C ? v(nO, {
        class: y
      }, null) : v(Hx, {
        class: y
      }, null));
    };
  }
  let m = null;
  d !== void 0 ? m = d : o ? m = v(Kx, null, null) : m = null;
  let w = null;
  return u !== void 0 ? w = u : w = v(kx, null, null), {
    clearIcon: f,
    suffixIcon: h,
    itemIcon: m,
    removeIcon: w
  };
}
function yp(e) {
  const t = Symbol("contextKey");
  return {
    useProvide: (r, i) => {
      const a = Ye({});
      return dt(t, a), ut(() => {
        g(a, r, i || {});
      }), a;
    },
    useInject: () => ye(t, e) || {}
  };
}
const eu = Symbol("ContextProps"), tu = Symbol("InternalContextProps"), nu = {
  id: E(() => {
  }),
  onFieldBlur: () => {
  },
  onFieldChange: () => {
  },
  clearValidate: () => {
  }
}, ou = {
  addFormItemField: () => {
  },
  removeFormItemField: () => {
  }
}, rO = () => {
  const e = ye(tu, ou), t = Symbol("FormItemFieldKey"), n = cn();
  return e.addFormItemField(t, n.type), rt(() => {
    e.removeFormItemField(t);
  }), dt(tu, ou), dt(eu, nu), ye(eu, nu);
}, iO = yp({});
function aO(e, t, n) {
  return ne({
    [`${e}-status-success`]: t === "success",
    [`${e}-status-warning`]: t === "warning",
    [`${e}-status-error`]: t === "error",
    [`${e}-status-validating`]: t === "validating",
    [`${e}-has-feedback`]: n
  });
}
const lO = (e, t) => t || e, sO = (e) => {
  const {
    componentCls: t
  } = e;
  return {
    [t]: {
      display: "inline-flex",
      "&-block": {
        display: "flex",
        width: "100%"
      },
      "&-vertical": {
        flexDirection: "column"
      }
    }
  };
}, cO = sO, uO = (e) => {
  const {
    componentCls: t
  } = e;
  return {
    [t]: {
      display: "inline-flex",
      "&-rtl": {
        direction: "rtl"
      },
      "&-vertical": {
        flexDirection: "column"
      },
      "&-align": {
        flexDirection: "column",
        "&-center": {
          alignItems: "center"
        },
        "&-start": {
          alignItems: "flex-start"
        },
        "&-end": {
          alignItems: "flex-end"
        },
        "&-baseline": {
          alignItems: "baseline"
        }
      },
      [`${t}-space-item`]: {
        "&:empty": {
          display: "none"
        }
      }
    }
  };
}, dO = No("Space", (e) => [uO(e), cO(e)]);
var fO = "[object Map]", pO = "[object Set]", hO = Object.prototype, gO = hO.hasOwnProperty;
function Sp(e) {
  if (e == null)
    return !0;
  if (Yf(e) && (Co(e) || typeof e == "string" || typeof e.splice == "function" || Dr(e) || ll(e) || Wf(e)))
    return !e.length;
  var t = Ca(e);
  if (t == fO || t == pO)
    return !e.size;
  if (Gf(e))
    return !kf(e).length;
  for (var n in e)
    if (gO.call(e, n))
      return !1;
  return !0;
}
const mO = () => ({
  compactSize: String,
  compactDirection: P.oneOf(_r("horizontal", "vertical")).def("horizontal"),
  isFirstItem: Ge(),
  isLastItem: Ge()
}), _l = yp(null), vO = (e, t) => {
  const n = _l.useInject(), o = E(() => {
    if (!n || Sp(n))
      return "";
    const {
      compactDirection: r,
      isFirstItem: i,
      isLastItem: a
    } = n, l = r === "vertical" ? "-vertical-" : "-";
    return ne({
      [`${e.value}-compact${l}item`]: !0,
      [`${e.value}-compact${l}first-item`]: i,
      [`${e.value}-compact${l}last-item`]: a,
      [`${e.value}-compact${l}item-rtl`]: t.value === "rtl"
    });
  });
  return {
    compactSize: E(() => n == null ? void 0 : n.compactSize),
    compactDirection: E(() => n == null ? void 0 : n.compactDirection),
    compactItemClassnames: o
  };
}, bO = () => ({
  prefixCls: String,
  size: {
    type: String
  },
  direction: P.oneOf(_r("horizontal", "vertical")).def("horizontal"),
  align: P.oneOf(_r("start", "end", "center", "baseline")),
  block: {
    type: Boolean,
    default: void 0
  }
}), yO = /* @__PURE__ */ Z({
  name: "CompactItem",
  props: mO(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    return _l.useProvide(e), () => {
      var o;
      return (o = n.default) === null || o === void 0 ? void 0 : o.call(n);
    };
  }
});
bO();
const SO = (e) => ({
  animationDuration: e,
  animationFillMode: "both"
}), wO = (e) => ({
  animationDuration: e,
  animationFillMode: "both"
}), wp = function(e, t, n, o) {
  const i = (arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : !1) ? "&" : "";
  return {
    [`
      ${i}${e}-enter,
      ${i}${e}-appear
    `]: g(g({}, SO(o)), {
      animationPlayState: "paused"
    }),
    [`${i}${e}-leave`]: g(g({}, wO(o)), {
      animationPlayState: "paused"
    }),
    [`
      ${i}${e}-enter${e}-enter-active,
      ${i}${e}-appear${e}-appear-active
    `]: {
      animationName: t,
      animationPlayState: "running"
    },
    [`${i}${e}-leave${e}-leave-active`]: {
      animationName: n,
      animationPlayState: "running",
      pointerEvents: "none"
    }
  };
}, CO = new $e("antMoveDownIn", {
  "0%": {
    transform: "translate3d(0, 100%, 0)",
    transformOrigin: "0 0",
    opacity: 0
  },
  "100%": {
    transform: "translate3d(0, 0, 0)",
    transformOrigin: "0 0",
    opacity: 1
  }
}), xO = new $e("antMoveDownOut", {
  "0%": {
    transform: "translate3d(0, 0, 0)",
    transformOrigin: "0 0",
    opacity: 1
  },
  "100%": {
    transform: "translate3d(0, 100%, 0)",
    transformOrigin: "0 0",
    opacity: 0
  }
}), OO = new $e("antMoveLeftIn", {
  "0%": {
    transform: "translate3d(-100%, 0, 0)",
    transformOrigin: "0 0",
    opacity: 0
  },
  "100%": {
    transform: "translate3d(0, 0, 0)",
    transformOrigin: "0 0",
    opacity: 1
  }
}), $O = new $e("antMoveLeftOut", {
  "0%": {
    transform: "translate3d(0, 0, 0)",
    transformOrigin: "0 0",
    opacity: 1
  },
  "100%": {
    transform: "translate3d(-100%, 0, 0)",
    transformOrigin: "0 0",
    opacity: 0
  }
}), _O = new $e("antMoveRightIn", {
  "0%": {
    transform: "translate3d(100%, 0, 0)",
    transformOrigin: "0 0",
    opacity: 0
  },
  "100%": {
    transform: "translate3d(0, 0, 0)",
    transformOrigin: "0 0",
    opacity: 1
  }
}), EO = new $e("antMoveRightOut", {
  "0%": {
    transform: "translate3d(0, 0, 0)",
    transformOrigin: "0 0",
    opacity: 1
  },
  "100%": {
    transform: "translate3d(100%, 0, 0)",
    transformOrigin: "0 0",
    opacity: 0
  }
}), TO = new $e("antMoveUpIn", {
  "0%": {
    transform: "translate3d(0, -100%, 0)",
    transformOrigin: "0 0",
    opacity: 0
  },
  "100%": {
    transform: "translate3d(0, 0, 0)",
    transformOrigin: "0 0",
    opacity: 1
  }
}), PO = new $e("antMoveUpOut", {
  "0%": {
    transform: "translate3d(0, 0, 0)",
    transformOrigin: "0 0",
    opacity: 1
  },
  "100%": {
    transform: "translate3d(0, -100%, 0)",
    transformOrigin: "0 0",
    opacity: 0
  }
}), IO = {
  "move-up": {
    inKeyframes: TO,
    outKeyframes: PO
  },
  "move-down": {
    inKeyframes: CO,
    outKeyframes: xO
  },
  "move-left": {
    inKeyframes: OO,
    outKeyframes: $O
  },
  "move-right": {
    inKeyframes: _O,
    outKeyframes: EO
  }
}, ru = (e, t) => {
  const {
    antCls: n
  } = e, o = `${n}-${t}`, {
    inKeyframes: r,
    outKeyframes: i
  } = IO[t];
  return [wp(o, r, i, e.motionDurationMid), {
    [`
        ${o}-enter,
        ${o}-appear
      `]: {
      opacity: 0,
      animationTimingFunction: e.motionEaseOutCirc
    },
    [`${o}-leave`]: {
      animationTimingFunction: e.motionEaseInOutCirc
    }
  }];
}, Cp = new $e("antSlideUpIn", {
  "0%": {
    transform: "scaleY(0.8)",
    transformOrigin: "0% 0%",
    opacity: 0
  },
  "100%": {
    transform: "scaleY(1)",
    transformOrigin: "0% 0%",
    opacity: 1
  }
}), xp = new $e("antSlideUpOut", {
  "0%": {
    transform: "scaleY(1)",
    transformOrigin: "0% 0%",
    opacity: 1
  },
  "100%": {
    transform: "scaleY(0.8)",
    transformOrigin: "0% 0%",
    opacity: 0
  }
}), Op = new $e("antSlideDownIn", {
  "0%": {
    transform: "scaleY(0.8)",
    transformOrigin: "100% 100%",
    opacity: 0
  },
  "100%": {
    transform: "scaleY(1)",
    transformOrigin: "100% 100%",
    opacity: 1
  }
}), $p = new $e("antSlideDownOut", {
  "0%": {
    transform: "scaleY(1)",
    transformOrigin: "100% 100%",
    opacity: 1
  },
  "100%": {
    transform: "scaleY(0.8)",
    transformOrigin: "100% 100%",
    opacity: 0
  }
}), MO = new $e("antSlideLeftIn", {
  "0%": {
    transform: "scaleX(0.8)",
    transformOrigin: "0% 0%",
    opacity: 0
  },
  "100%": {
    transform: "scaleX(1)",
    transformOrigin: "0% 0%",
    opacity: 1
  }
}), NO = new $e("antSlideLeftOut", {
  "0%": {
    transform: "scaleX(1)",
    transformOrigin: "0% 0%",
    opacity: 1
  },
  "100%": {
    transform: "scaleX(0.8)",
    transformOrigin: "0% 0%",
    opacity: 0
  }
}), AO = new $e("antSlideRightIn", {
  "0%": {
    transform: "scaleX(0.8)",
    transformOrigin: "100% 0%",
    opacity: 0
  },
  "100%": {
    transform: "scaleX(1)",
    transformOrigin: "100% 0%",
    opacity: 1
  }
}), DO = new $e("antSlideRightOut", {
  "0%": {
    transform: "scaleX(1)",
    transformOrigin: "100% 0%",
    opacity: 1
  },
  "100%": {
    transform: "scaleX(0.8)",
    transformOrigin: "100% 0%",
    opacity: 0
  }
}), RO = {
  "slide-up": {
    inKeyframes: Cp,
    outKeyframes: xp
  },
  "slide-down": {
    inKeyframes: Op,
    outKeyframes: $p
  },
  "slide-left": {
    inKeyframes: MO,
    outKeyframes: NO
  },
  "slide-right": {
    inKeyframes: AO,
    outKeyframes: DO
  }
}, iu = (e, t) => {
  const {
    antCls: n
  } = e, o = `${n}-${t}`, {
    inKeyframes: r,
    outKeyframes: i
  } = RO[t];
  return [wp(o, r, i, e.motionDurationMid), {
    [`
      ${o}-enter,
      ${o}-appear
    `]: {
      transform: "scale(0)",
      transformOrigin: "0% 0%",
      opacity: 0,
      animationTimingFunction: e.motionEaseOutQuint
    },
    [`${o}-leave`]: {
      animationTimingFunction: e.motionEaseInQuint
    }
  }];
}, au = (e) => {
  const {
    controlPaddingHorizontal: t
  } = e;
  return {
    position: "relative",
    display: "block",
    minHeight: e.controlHeight,
    padding: `${(e.controlHeight - e.fontSize * e.lineHeight) / 2}px ${t}px`,
    color: e.colorText,
    fontWeight: "normal",
    fontSize: e.fontSize,
    lineHeight: e.lineHeight,
    boxSizing: "border-box"
  };
}, HO = (e) => {
  const {
    antCls: t,
    componentCls: n
  } = e, o = `${n}-item`;
  return [
    {
      [`${n}-dropdown`]: g(g({}, Mo(e)), {
        position: "absolute",
        top: -9999,
        zIndex: e.zIndexPopup,
        boxSizing: "border-box",
        padding: e.paddingXXS,
        overflow: "hidden",
        fontSize: e.fontSize,
        // Fix select render lag of long text in chrome
        // https://github.com/ant-design/ant-design/issues/11456
        // https://github.com/ant-design/ant-design/issues/11843
        fontVariant: "initial",
        backgroundColor: e.colorBgElevated,
        borderRadius: e.borderRadiusLG,
        outline: "none",
        boxShadow: e.boxShadowSecondary,
        [`
            &${t}-slide-up-enter${t}-slide-up-enter-active${n}-dropdown-placement-bottomLeft,
            &${t}-slide-up-appear${t}-slide-up-appear-active${n}-dropdown-placement-bottomLeft
          `]: {
          animationName: Cp
        },
        [`
            &${t}-slide-up-enter${t}-slide-up-enter-active${n}-dropdown-placement-topLeft,
            &${t}-slide-up-appear${t}-slide-up-appear-active${n}-dropdown-placement-topLeft
          `]: {
          animationName: Op
        },
        [`&${t}-slide-up-leave${t}-slide-up-leave-active${n}-dropdown-placement-bottomLeft`]: {
          animationName: xp
        },
        [`&${t}-slide-up-leave${t}-slide-up-leave-active${n}-dropdown-placement-topLeft`]: {
          animationName: $p
        },
        "&-hidden": {
          display: "none"
        },
        "&-empty": {
          color: e.colorTextDisabled
        },
        // ========================= Options =========================
        [`${o}-empty`]: g(g({}, au(e)), {
          color: e.colorTextDisabled
        }),
        [`${o}`]: g(g({}, au(e)), {
          cursor: "pointer",
          transition: `background ${e.motionDurationSlow} ease`,
          borderRadius: e.borderRadiusSM,
          // =========== Group ============
          "&-group": {
            color: e.colorTextDescription,
            fontSize: e.fontSizeSM,
            cursor: "default"
          },
          // =========== Option ===========
          "&-option": {
            display: "flex",
            "&-content": g({
              flex: "auto"
            }, ua),
            "&-state": {
              flex: "none"
            },
            [`&-active:not(${o}-option-disabled)`]: {
              backgroundColor: e.controlItemBgHover
            },
            [`&-selected:not(${o}-option-disabled)`]: {
              color: e.colorText,
              fontWeight: e.fontWeightStrong,
              backgroundColor: e.controlItemBgActive,
              [`${o}-option-state`]: {
                color: e.colorPrimary
              }
            },
            "&-disabled": {
              [`&${o}-option-selected`]: {
                backgroundColor: e.colorBgContainerDisabled
              },
              color: e.colorTextDisabled,
              cursor: "not-allowed"
            },
            "&-grouped": {
              paddingInlineStart: e.controlPaddingHorizontal * 2
            }
          }
        }),
        // =========================== RTL ===========================
        "&-rtl": {
          direction: "rtl"
        }
      })
    },
    // Follow code may reuse in other components
    iu(e, "slide-up"),
    iu(e, "slide-down"),
    ru(e, "move-up"),
    ru(e, "move-down")
  ];
}, FO = HO, gn = 2;
function _p(e) {
  let {
    controlHeightSM: t,
    controlHeight: n,
    lineWidth: o
  } = e;
  const r = (n - t) / 2 - o, i = Math.ceil(r / 2);
  return [r, i];
}
function Di(e, t) {
  const {
    componentCls: n,
    iconCls: o
  } = e, r = `${n}-selection-overflow`, i = e.controlHeightSM, [a] = _p(e), l = t ? `${n}-${t}` : "";
  return {
    [`${n}-multiple${l}`]: {
      fontSize: e.fontSize,
      /**
       * Do not merge `height` & `line-height` under style with `selection` & `search`, since chrome
       * may update to redesign with its align logic.
       */
      // =========================== Overflow ===========================
      [r]: {
        position: "relative",
        display: "flex",
        flex: "auto",
        flexWrap: "wrap",
        maxWidth: "100%",
        "&-item": {
          flex: "none",
          alignSelf: "center",
          maxWidth: "100%",
          display: "inline-flex"
        }
      },
      // ========================= Selector =========================
      [`${n}-selector`]: {
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        // Multiple is little different that horizontal is follow the vertical
        padding: `${a - gn}px ${gn * 2}px`,
        borderRadius: e.borderRadius,
        [`${n}-show-search&`]: {
          cursor: "text"
        },
        [`${n}-disabled&`]: {
          background: e.colorBgContainerDisabled,
          cursor: "not-allowed"
        },
        "&:after": {
          display: "inline-block",
          width: 0,
          margin: `${gn}px 0`,
          lineHeight: `${i}px`,
          content: '"\\a0"'
        }
      },
      [`
        &${n}-show-arrow ${n}-selector,
        &${n}-allow-clear ${n}-selector
      `]: {
        paddingInlineEnd: e.fontSizeIcon + e.controlPaddingHorizontal
      },
      // ======================== Selections ========================
      [`${n}-selection-item`]: {
        position: "relative",
        display: "flex",
        flex: "none",
        boxSizing: "border-box",
        maxWidth: "100%",
        height: i,
        marginTop: gn,
        marginBottom: gn,
        lineHeight: `${i - e.lineWidth * 2}px`,
        background: e.colorFillSecondary,
        border: `${e.lineWidth}px solid ${e.colorSplit}`,
        borderRadius: e.borderRadiusSM,
        cursor: "default",
        transition: `font-size ${e.motionDurationSlow}, line-height ${e.motionDurationSlow}, height ${e.motionDurationSlow}`,
        userSelect: "none",
        marginInlineEnd: gn * 2,
        paddingInlineStart: e.paddingXS,
        paddingInlineEnd: e.paddingXS / 2,
        [`${n}-disabled&`]: {
          color: e.colorTextDisabled,
          borderColor: e.colorBorder,
          cursor: "not-allowed"
        },
        // It's ok not to do this, but 24px makes bottom narrow in view should adjust
        "&-content": {
          display: "inline-block",
          marginInlineEnd: e.paddingXS / 2,
          overflow: "hidden",
          whiteSpace: "pre",
          textOverflow: "ellipsis"
        },
        "&-remove": g(g({}, af()), {
          display: "inline-block",
          color: e.colorIcon,
          fontWeight: "bold",
          fontSize: 10,
          lineHeight: "inherit",
          cursor: "pointer",
          [`> ${o}`]: {
            verticalAlign: "-0.2em"
          },
          "&:hover": {
            color: e.colorIconHover
          }
        })
      },
      // ========================== Input ==========================
      [`${r}-item + ${r}-item`]: {
        [`${n}-selection-search`]: {
          marginInlineStart: 0
        }
      },
      [`${n}-selection-search`]: {
        display: "inline-flex",
        position: "relative",
        maxWidth: "100%",
        marginInlineStart: e.inputPaddingHorizontalBase - a,
        "\n          &-input,\n          &-mirror\n        ": {
          height: i,
          fontFamily: e.fontFamily,
          lineHeight: `${i}px`,
          transition: `all ${e.motionDurationSlow}`
        },
        "&-input": {
          width: "100%",
          minWidth: 4.1
          // fix search cursor missing
        },
        "&-mirror": {
          position: "absolute",
          top: 0,
          insetInlineStart: 0,
          insetInlineEnd: "auto",
          zIndex: 999,
          whiteSpace: "pre",
          visibility: "hidden"
        }
      },
      // ======================= Placeholder =======================
      [`${n}-selection-placeholder `]: {
        position: "absolute",
        top: "50%",
        insetInlineStart: e.inputPaddingHorizontalBase,
        insetInlineEnd: e.inputPaddingHorizontalBase,
        transform: "translateY(-50%)",
        transition: `all ${e.motionDurationSlow}`
      }
    }
  };
}
function zO(e) {
  const {
    componentCls: t
  } = e, n = Fe(e, {
    controlHeight: e.controlHeightSM,
    controlHeightSM: e.controlHeightXS,
    borderRadius: e.borderRadiusSM,
    borderRadiusSM: e.borderRadiusXS
  }), [, o] = _p(e);
  return [
    Di(e),
    // ======================== Small ========================
    // Shared
    Di(n, "sm"),
    // Padding
    {
      [`${t}-multiple${t}-sm`]: {
        [`${t}-selection-placeholder`]: {
          insetInlineStart: e.controlPaddingHorizontalSM - e.lineWidth,
          insetInlineEnd: "auto"
        },
        // https://github.com/ant-design/ant-design/issues/29559
        [`${t}-selection-search`]: {
          marginInlineStart: o
        }
      }
    },
    // ======================== Large ========================
    // Shared
    Di(Fe(e, {
      fontSize: e.fontSizeLG,
      controlHeight: e.controlHeightLG,
      controlHeightSM: e.controlHeight,
      borderRadius: e.borderRadiusLG,
      borderRadiusSM: e.borderRadius
    }), "lg")
  ];
}
function Ri(e, t) {
  const {
    componentCls: n,
    inputPaddingHorizontalBase: o,
    borderRadius: r
  } = e, i = e.controlHeight - e.lineWidth * 2, a = Math.ceil(e.fontSize * 1.25), l = t ? `${n}-${t}` : "";
  return {
    [`${n}-single${l}`]: {
      fontSize: e.fontSize,
      // ========================= Selector =========================
      [`${n}-selector`]: g(g({}, Mo(e)), {
        display: "flex",
        borderRadius: r,
        [`${n}-selection-search`]: {
          position: "absolute",
          top: 0,
          insetInlineStart: o,
          insetInlineEnd: o,
          bottom: 0,
          "&-input": {
            width: "100%"
          }
        },
        [`
          ${n}-selection-item,
          ${n}-selection-placeholder
        `]: {
          padding: 0,
          lineHeight: `${i}px`,
          transition: `all ${e.motionDurationSlow}`,
          // Firefox inline-block position calculation is not same as Chrome & Safari. Patch this:
          "@supports (-moz-appearance: meterbar)": {
            lineHeight: `${i}px`
          }
        },
        [`${n}-selection-item`]: {
          position: "relative",
          userSelect: "none"
        },
        [`${n}-selection-placeholder`]: {
          transition: "none",
          pointerEvents: "none"
        },
        // For common baseline align
        [[
          "&:after",
          /* For '' value baseline align */
          `${n}-selection-item:after`,
          /* For undefined value baseline align */
          `${n}-selection-placeholder:after`
        ].join(",")]: {
          display: "inline-block",
          width: 0,
          visibility: "hidden",
          content: '"\\a0"'
        }
      }),
      [`
        &${n}-show-arrow ${n}-selection-item,
        &${n}-show-arrow ${n}-selection-placeholder
      `]: {
        paddingInlineEnd: a
      },
      // Opacity selection if open
      [`&${n}-open ${n}-selection-item`]: {
        color: e.colorTextPlaceholder
      },
      // ========================== Input ==========================
      // We only change the style of non-customize input which is only support by `combobox` mode.
      // Not customize
      [`&:not(${n}-customize-input)`]: {
        [`${n}-selector`]: {
          width: "100%",
          height: e.controlHeight,
          padding: `0 ${o}px`,
          [`${n}-selection-search-input`]: {
            height: i
          },
          "&:after": {
            lineHeight: `${i}px`
          }
        }
      },
      [`&${n}-customize-input`]: {
        [`${n}-selector`]: {
          "&:after": {
            display: "none"
          },
          [`${n}-selection-search`]: {
            position: "static",
            width: "100%"
          },
          [`${n}-selection-placeholder`]: {
            position: "absolute",
            insetInlineStart: 0,
            insetInlineEnd: 0,
            padding: `0 ${o}px`,
            "&:after": {
              display: "none"
            }
          }
        }
      }
    }
  };
}
function LO(e) {
  const {
    componentCls: t
  } = e, n = e.controlPaddingHorizontalSM - e.lineWidth;
  return [
    Ri(e),
    // ======================== Small ========================
    // Shared
    Ri(Fe(e, {
      controlHeight: e.controlHeightSM,
      borderRadius: e.borderRadiusSM
    }), "sm"),
    // padding
    {
      [`${t}-single${t}-sm`]: {
        [`&:not(${t}-customize-input)`]: {
          [`${t}-selection-search`]: {
            insetInlineStart: n,
            insetInlineEnd: n
          },
          [`${t}-selector`]: {
            padding: `0 ${n}px`
          },
          // With arrow should provides `padding-right` to show the arrow
          [`&${t}-show-arrow ${t}-selection-search`]: {
            insetInlineEnd: n + e.fontSize * 1.5
          },
          [`
            &${t}-show-arrow ${t}-selection-item,
            &${t}-show-arrow ${t}-selection-placeholder
          `]: {
            paddingInlineEnd: e.fontSize * 1.5
          }
        }
      }
    },
    // ======================== Large ========================
    // Shared
    Ri(Fe(e, {
      controlHeight: e.controlHeightLG,
      fontSize: e.fontSizeLG,
      borderRadius: e.borderRadiusLG
    }), "lg")
  ];
}
function jO(e, t, n) {
  const {
    focusElCls: o,
    focus: r,
    borderElCls: i
  } = n, a = i ? "> *" : "", l = ["hover", r ? "focus" : null, "active"].filter(Boolean).map((c) => `&:${c} ${a}`).join(",");
  return {
    [`&-item:not(${t}-last-item)`]: {
      marginInlineEnd: -e.lineWidth
    },
    "&-item": g(g({
      [l]: {
        zIndex: 2
      }
    }, o ? {
      [`&${o}`]: {
        zIndex: 2
      }
    } : {}), {
      [`&[disabled] ${a}`]: {
        zIndex: 0
      }
    })
  };
}
function BO(e, t, n) {
  const {
    borderElCls: o
  } = n, r = o ? `> ${o}` : "";
  return {
    [`&-item:not(${t}-first-item):not(${t}-last-item) ${r}`]: {
      borderRadius: 0
    },
    [`&-item:not(${t}-last-item)${t}-first-item`]: {
      [`& ${r}, &${e}-sm ${r}, &${e}-lg ${r}`]: {
        borderStartEndRadius: 0,
        borderEndEndRadius: 0
      }
    },
    [`&-item:not(${t}-first-item)${t}-last-item`]: {
      [`& ${r}, &${e}-sm ${r}, &${e}-lg ${r}`]: {
        borderStartStartRadius: 0,
        borderEndStartRadius: 0
      }
    }
  };
}
function VO(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
    focus: !0
  };
  const {
    componentCls: n
  } = e, o = `${n}-compact`;
  return {
    [o]: g(g({}, jO(e, o, t)), BO(n, o, t))
  };
}
const WO = (e) => {
  const {
    componentCls: t
  } = e;
  return {
    position: "relative",
    backgroundColor: e.colorBgContainer,
    border: `${e.lineWidth}px ${e.lineType} ${e.colorBorder}`,
    transition: `all ${e.motionDurationMid} ${e.motionEaseInOut}`,
    input: {
      cursor: "pointer"
    },
    [`${t}-show-search&`]: {
      cursor: "text",
      input: {
        cursor: "auto",
        color: "inherit"
      }
    },
    [`${t}-disabled&`]: {
      color: e.colorTextDisabled,
      background: e.colorBgContainerDisabled,
      cursor: "not-allowed",
      [`${t}-multiple&`]: {
        background: e.colorBgContainerDisabled
      },
      input: {
        cursor: "not-allowed"
      }
    }
  };
}, Hi = function(e, t) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !1;
  const {
    componentCls: o,
    borderHoverColor: r,
    outlineColor: i,
    antCls: a
  } = t, l = n ? {
    [`${o}-selector`]: {
      borderColor: r
    }
  } : {};
  return {
    [e]: {
      [`&:not(${o}-disabled):not(${o}-customize-input):not(${a}-pagination-size-changer)`]: g(g({}, l), {
        [`${o}-focused& ${o}-selector`]: {
          borderColor: r,
          boxShadow: `0 0 0 ${t.controlOutlineWidth}px ${i}`,
          borderInlineEndWidth: `${t.controlLineWidth}px !important`,
          outline: 0
        },
        [`&:hover ${o}-selector`]: {
          borderColor: r,
          borderInlineEndWidth: `${t.controlLineWidth}px !important`
        }
      })
    }
  };
}, KO = (e) => {
  const {
    componentCls: t
  } = e;
  return {
    [`${t}-selection-search-input`]: {
      margin: 0,
      padding: 0,
      background: "transparent",
      border: "none",
      outline: "none",
      appearance: "none",
      "&::-webkit-search-cancel-button": {
        display: "none",
        "-webkit-appearance": "none"
      }
    }
  };
}, UO = (e) => {
  const {
    componentCls: t,
    inputPaddingHorizontalBase: n,
    iconCls: o
  } = e;
  return {
    [t]: g(g({}, Mo(e)), {
      position: "relative",
      display: "inline-block",
      cursor: "pointer",
      [`&:not(${t}-customize-input) ${t}-selector`]: g(g({}, WO(e)), KO(e)),
      // [`&:not(&-disabled):hover ${selectCls}-selector`]: {
      //   ...genHoverStyle(token),
      // },
      // ======================== Selection ========================
      [`${t}-selection-item`]: g({
        flex: 1,
        fontWeight: "normal"
      }, ua),
      // ======================= Placeholder =======================
      [`${t}-selection-placeholder`]: g(g({}, ua), {
        flex: 1,
        color: e.colorTextPlaceholder,
        pointerEvents: "none"
      }),
      // ========================== Arrow ==========================
      [`${t}-arrow`]: g(g({}, af()), {
        position: "absolute",
        top: "50%",
        insetInlineStart: "auto",
        insetInlineEnd: n,
        height: e.fontSizeIcon,
        marginTop: -e.fontSizeIcon / 2,
        color: e.colorTextQuaternary,
        fontSize: e.fontSizeIcon,
        lineHeight: 1,
        textAlign: "center",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        [o]: {
          verticalAlign: "top",
          transition: `transform ${e.motionDurationSlow}`,
          "> svg": {
            verticalAlign: "top"
          },
          [`&:not(${t}-suffix)`]: {
            pointerEvents: "auto"
          }
        },
        [`${t}-disabled &`]: {
          cursor: "not-allowed"
        },
        "> *:not(:last-child)": {
          marginInlineEnd: 8
          // FIXME: magic
        }
      }),
      // ========================== Clear ==========================
      [`${t}-clear`]: {
        position: "absolute",
        top: "50%",
        insetInlineStart: "auto",
        insetInlineEnd: n,
        zIndex: 1,
        display: "inline-block",
        width: e.fontSizeIcon,
        height: e.fontSizeIcon,
        marginTop: -e.fontSizeIcon / 2,
        color: e.colorTextQuaternary,
        fontSize: e.fontSizeIcon,
        fontStyle: "normal",
        lineHeight: 1,
        textAlign: "center",
        textTransform: "none",
        background: e.colorBgContainer,
        cursor: "pointer",
        opacity: 0,
        transition: `color ${e.motionDurationMid} ease, opacity ${e.motionDurationSlow} ease`,
        textRendering: "auto",
        "&:before": {
          display: "block"
        },
        "&:hover": {
          color: e.colorTextTertiary
        }
      },
      "&:hover": {
        [`${t}-clear`]: {
          opacity: 1
        }
      }
    }),
    // ========================= Feedback ==========================
    [`${t}-has-feedback`]: {
      [`${t}-clear`]: {
        insetInlineEnd: n + e.fontSize + e.paddingXXS
      }
    }
  };
}, XO = (e) => {
  const {
    componentCls: t
  } = e;
  return [
    {
      [t]: {
        // ==================== BorderLess ====================
        [`&-borderless ${t}-selector`]: {
          backgroundColor: "transparent !important",
          borderColor: "transparent !important",
          boxShadow: "none !important"
        },
        // ==================== In Form ====================
        [`&${t}-in-form-item`]: {
          width: "100%"
        }
      }
    },
    // =====================================================
    // ==                       LTR                       ==
    // =====================================================
    // Base
    UO(e),
    // Single
    LO(e),
    // Multiple
    zO(e),
    // Dropdown
    FO(e),
    // =====================================================
    // ==                       RTL                       ==
    // =====================================================
    {
      [`${t}-rtl`]: {
        direction: "rtl"
      }
    },
    // =====================================================
    // ==                     Status                      ==
    // =====================================================
    Hi(t, Fe(e, {
      borderHoverColor: e.colorPrimaryHover,
      outlineColor: e.controlOutline
    })),
    Hi(`${t}-status-error`, Fe(e, {
      borderHoverColor: e.colorErrorHover,
      outlineColor: e.colorErrorOutline
    }), !0),
    Hi(`${t}-status-warning`, Fe(e, {
      borderHoverColor: e.colorWarningHover,
      outlineColor: e.colorWarningOutline
    }), !0),
    // =====================================================
    // ==             Space Compact                       ==
    // =====================================================
    VO(e, {
      borderElCls: `${t}-selector`,
      focusElCls: `${t}-focused`
    })
  ];
}, GO = No("Select", (e, t) => {
  let {
    rootPrefixCls: n
  } = t;
  const o = Fe(e, {
    rootPrefixCls: n,
    inputPaddingHorizontalBase: e.paddingSM - 1
  });
  return [XO(o)];
}, (e) => ({
  zIndexPopup: e.zIndexPopupBase + 50
})), El = () => g(g({}, qr(up(), ["inputIcon", "mode", "getInputElement", "getRawInputElement", "backfill"])), {
  value: Er([Array, Object, String, Number]),
  defaultValue: Er([Array, Object, String, Number]),
  notFoundContent: P.any,
  suffixIcon: P.any,
  itemIcon: P.any,
  size: Mt(),
  mode: Mt(),
  bordered: Ge(!0),
  transitionName: String,
  choiceTransitionName: Mt(""),
  popupClassName: String,
  /** @deprecated Please use `popupClassName` instead */
  dropdownClassName: String,
  placement: Mt(),
  status: Mt(),
  "onUpdate:value": Et()
}), lu = "SECRET_COMBOBOX_MODE_DO_NOT_USE", st = /* @__PURE__ */ Z({
  compatConfig: {
    MODE: 3
  },
  name: "ASelect",
  Option: qC,
  OptGroup: QC,
  inheritAttrs: !1,
  props: Kr(El(), {
    listHeight: 256,
    listItemHeight: 24
  }),
  SECRET_COMBOBOX_MODE_DO_NOT_USE: lu,
  slots: Object,
  setup(e, t) {
    let {
      attrs: n,
      emit: o,
      slots: r,
      expose: i
    } = t;
    const a = oe(), l = rO(), c = iO.useInject(), s = E(() => lO(c.status, e.status)), d = () => {
      var X;
      (X = a.value) === null || X === void 0 || X.focus();
    }, u = () => {
      var X;
      (X = a.value) === null || X === void 0 || X.blur();
    }, f = (X) => {
      var de;
      (de = a.value) === null || de === void 0 || de.scrollTo(X);
    }, p = E(() => {
      const {
        mode: X
      } = e;
      if (X !== "combobox")
        return X === lu ? "combobox" : X;
    });
    process.env.NODE_ENV !== "production" && yb(!e.dropdownClassName, "Select", "`dropdownClassName` is deprecated. Please use `popupClassName` instead.");
    const {
      prefixCls: h,
      direction: m,
      configProvider: w,
      renderEmpty: y,
      size: S,
      getPrefixCls: _,
      getPopupContainer: C,
      disabled: x,
      select: O
    } = Hn("select", e), {
      compactSize: b,
      compactItemClassnames: $
    } = vO(h, m), T = E(() => b.value || S.value), R = Pd(), H = E(() => {
      var X;
      return (X = x.value) !== null && X !== void 0 ? X : R.value;
    }), [N, j] = GO(h), B = E(() => _()), F = E(() => e.placement !== void 0 ? e.placement : m.value === "rtl" ? "bottomRight" : "bottomLeft"), L = E(() => hw(B.value, fw(F.value), e.transitionName)), Y = E(() => ne({
      [`${h.value}-lg`]: T.value === "large",
      [`${h.value}-sm`]: T.value === "small",
      [`${h.value}-rtl`]: m.value === "rtl",
      [`${h.value}-borderless`]: !e.bordered,
      [`${h.value}-in-form-item`]: c.isFormItemInput
    }, aO(h.value, s.value, c.hasFeedback), $.value, j.value)), re = function() {
      for (var X = arguments.length, de = new Array(X), ue = 0; ue < X; ue++)
        de[ue] = arguments[ue];
      o("update:value", de[0]), o("change", ...de), l.onFieldChange();
    }, A = (X) => {
      o("blur", X), l.onFieldBlur();
    };
    i({
      blur: u,
      focus: d,
      scrollTo: f
    });
    const K = E(() => p.value === "multiple" || p.value === "tags"), Q = E(() => e.showArrow !== void 0 ? e.showArrow : e.loading || !(K.value || p.value === "combobox"));
    return () => {
      var X, de, ue, pe;
      const {
        notFoundContent: fe,
        listHeight: me = 256,
        listItemHeight: Te = 24,
        popupClassName: D,
        dropdownClassName: W,
        virtual: I,
        dropdownMatchSelectWidth: M,
        id: z = l.id.value,
        placeholder: G = (X = r.placeholder) === null || X === void 0 ? void 0 : X.call(r),
        showArrow: ce
      } = e, {
        hasFeedback: ie,
        feedbackIcon: Se
      } = c;
      let te;
      fe !== void 0 ? te = fe : r.notFoundContent ? te = r.notFoundContent() : p.value === "combobox" ? te = null : te = (y == null ? void 0 : y("Select")) || v(pf, {
        componentName: "Select"
      }, null);
      const {
        suffixIcon: Ke,
        itemIcon: we,
        removeIcon: mt,
        clearIcon: Ro
      } = oO(g(g({}, e), {
        multiple: K.value,
        prefixCls: h.value,
        hasFeedback: ie,
        feedbackIcon: Se,
        showArrow: Q.value
      }), r), Ho = qr(e, ["prefixCls", "suffixIcon", "itemIcon", "removeIcon", "clearIcon", "size", "bordered", "status"]), jn = ne(D || W, {
        [`${h.value}-dropdown-${m.value}`]: m.value === "rtl"
      }, j.value);
      return N(v(YC, U(U(U({
        ref: a,
        virtual: I,
        dropdownMatchSelectWidth: M
      }, Ho), n), {}, {
        showSearch: (de = e.showSearch) !== null && de !== void 0 ? de : (ue = O == null ? void 0 : O.value) === null || ue === void 0 ? void 0 : ue.showSearch,
        placeholder: G,
        listHeight: me,
        listItemHeight: Te,
        mode: p.value,
        prefixCls: h.value,
        direction: m.value,
        inputIcon: Ke,
        menuItemSelectedIcon: we,
        removeIcon: mt,
        clearIcon: Ro,
        notFoundContent: te,
        class: [Y.value, n.class],
        getPopupContainer: C == null ? void 0 : C.value,
        dropdownClassName: jn,
        onChange: re,
        onBlur: A,
        id: z,
        dropdownRender: Ho.dropdownRender || r.dropdownRender,
        transitionName: L.value,
        children: (pe = r.default) === null || pe === void 0 ? void 0 : pe.call(r),
        tagRender: e.tagRender || r.tagRender,
        optionLabelRender: r.optionLabel,
        maxTagPlaceholder: e.maxTagPlaceholder || r.maxTagPlaceholder,
        showArrow: ie || ce,
        disabled: H.value
      }), {
        option: r.option
      }));
    };
  }
});
st.install = function(e) {
  return e.component(st.name, st), e.component(st.Option.displayName, st.Option), e.component(st.OptGroup.displayName, st.OptGroup), e;
};
st.Option;
st.OptGroup;
const Hr = st, kO = (e) => ({
  xs: `(max-width: ${e.screenXSMax}px)`,
  sm: `(min-width: ${e.screenSM}px)`,
  md: `(min-width: ${e.screenMD}px)`,
  lg: `(min-width: ${e.screenLG}px)`,
  xl: `(min-width: ${e.screenXL}px)`,
  xxl: `(min-width: ${e.screenXXL}px)`,
  xxxl: `{min-width: ${e.screenXXXL}px}`
});
function YO() {
  const [, e] = Yr();
  return E(() => {
    const t = kO(e.value), n = /* @__PURE__ */ new Map();
    let o = -1, r = {};
    return {
      matchHandlers: {},
      dispatch(i) {
        return r = i, n.forEach((a) => a(r)), n.size >= 1;
      },
      subscribe(i) {
        return n.size || this.register(), o += 1, n.set(o, i), i(r), o;
      },
      unsubscribe(i) {
        n.delete(i), n.size || this.unregister();
      },
      unregister() {
        Object.keys(t).forEach((i) => {
          const a = t[i], l = this.matchHandlers[a];
          l == null || l.mql.removeListener(l == null ? void 0 : l.listener);
        }), n.clear();
      },
      register() {
        Object.keys(t).forEach((i) => {
          const a = t[i], l = (s) => {
            let {
              matches: d
            } = s;
            this.dispatch(g(g({}, r), {
              [i]: d
            }));
          }, c = window.matchMedia(a);
          c.addListener(l), this.matchHandlers[a] = {
            mql: c,
            listener: l
          }, l(c);
        });
      },
      responsiveMap: t
    };
  });
}
function qO() {
  const e = V({});
  let t = null;
  const n = YO();
  return De(() => {
    t = n.value.subscribe((o) => {
      e.value = o;
    });
  }), To(() => {
    n.value.unsubscribe(t);
  }), e;
}
function su() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
  for (let t = 0, n = e.length; t < n; t++)
    if (e[t] !== void 0)
      return e[t];
}
var QO = { icon: { tag: "svg", attrs: { viewBox: "64 64 896 896", focusable: "false" }, children: [{ tag: "path", attrs: { d: "M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z" } }] }, name: "right", theme: "outlined" };
const JO = QO;
function cu(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? Object(arguments[t]) : {}, o = Object.keys(n);
    typeof Object.getOwnPropertySymbols == "function" && (o = o.concat(Object.getOwnPropertySymbols(n).filter(function(r) {
      return Object.getOwnPropertyDescriptor(n, r).enumerable;
    }))), o.forEach(function(r) {
      ZO(e, r, n[r]);
    });
  }
  return e;
}
function ZO(e, t, n) {
  return t in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
var Tl = function(t, n) {
  var o = cu({}, t, n.attrs);
  return v(gt, cu({}, o, {
    icon: JO
  }), null);
};
Tl.displayName = "RightOutlined";
Tl.inheritAttrs = !1;
const uu = Tl, e$ = (e) => ({
  // Firefox
  "&::-moz-placeholder": {
    opacity: 1
  },
  "&::placeholder": {
    color: e,
    userSelect: "none"
    // https://github.com/ant-design/ant-design/pull/32639
  },
  "&:placeholder-shown": {
    textOverflow: "ellipsis"
  }
}), Ep = (e) => ({
  borderColor: e.inputBorderHoverColor,
  borderInlineEndWidth: e.lineWidth
}), t$ = (e) => ({
  borderColor: e.inputBorderHoverColor,
  boxShadow: `0 0 0 ${e.controlOutlineWidth}px ${e.controlOutline}`,
  borderInlineEndWidth: e.lineWidth,
  outline: 0
}), n$ = (e) => ({
  color: e.colorTextDisabled,
  backgroundColor: e.colorBgContainerDisabled,
  borderColor: e.colorBorder,
  boxShadow: "none",
  cursor: "not-allowed",
  opacity: 1,
  "&:hover": g({}, Ep(Fe(e, {
    inputBorderHoverColor: e.colorBorder
  })))
}), o$ = (e) => {
  const {
    inputPaddingVerticalLG: t,
    fontSizeLG: n,
    lineHeightLG: o,
    borderRadiusLG: r,
    inputPaddingHorizontalLG: i
  } = e;
  return {
    padding: `${t}px ${i}px`,
    fontSize: n,
    lineHeight: o,
    borderRadius: r
  };
}, Tp = (e) => ({
  padding: `${e.inputPaddingVerticalSM}px ${e.controlPaddingHorizontalSM - 1}px`,
  borderRadius: e.borderRadiusSM
}), r$ = (e) => g(g({
  position: "relative",
  display: "inline-block",
  width: "100%",
  minWidth: 0,
  padding: `${e.inputPaddingVertical}px ${e.inputPaddingHorizontal}px`,
  color: e.colorText,
  fontSize: e.fontSize,
  lineHeight: e.lineHeight,
  backgroundColor: e.colorBgContainer,
  backgroundImage: "none",
  borderWidth: e.lineWidth,
  borderStyle: e.lineType,
  borderColor: e.colorBorder,
  borderRadius: e.borderRadius,
  transition: `all ${e.motionDurationMid}`
}, e$(e.colorTextPlaceholder)), {
  "&:hover": g({}, Ep(e)),
  "&:focus, &-focused": g({}, t$(e)),
  "&-disabled, &[disabled]": g({}, n$(e)),
  "&-borderless": {
    "&, &:hover, &:focus, &-focused, &-disabled, &[disabled]": {
      backgroundColor: "transparent",
      border: "none",
      boxShadow: "none"
    }
  },
  // Reset height for `textarea`s
  "textarea&": {
    maxWidth: "100%",
    height: "auto",
    minHeight: e.controlHeight,
    lineHeight: e.lineHeight,
    verticalAlign: "bottom",
    transition: `all ${e.motionDurationSlow}, height 0s`,
    resize: "vertical"
  },
  // Size
  "&-lg": g({}, o$(e)),
  "&-sm": g({}, Tp(e)),
  // RTL
  "&-rtl": {
    direction: "rtl"
  },
  "&-textarea-rtl": {
    direction: "rtl"
  }
});
function i$(e) {
  return Fe(e, {
    inputAffixPadding: e.paddingXXS,
    inputPaddingVertical: Math.max(Math.round((e.controlHeight - e.fontSize * e.lineHeight) / 2 * 10) / 10 - e.lineWidth, 3),
    inputPaddingVerticalLG: Math.ceil((e.controlHeightLG - e.fontSizeLG * e.lineHeightLG) / 2 * 10) / 10 - e.lineWidth,
    inputPaddingVerticalSM: Math.max(Math.round((e.controlHeightSM - e.fontSize * e.lineHeight) / 2 * 10) / 10 - e.lineWidth, 0),
    inputPaddingHorizontal: e.paddingSM - e.lineWidth,
    inputPaddingHorizontalSM: e.paddingXS - e.lineWidth,
    inputPaddingHorizontalLG: e.controlPaddingHorizontal - e.lineWidth,
    inputBorderHoverColor: e.colorPrimaryHover,
    inputBorderActiveColor: e.colorPrimaryHover
  });
}
var a$ = { icon: { tag: "svg", attrs: { viewBox: "64 64 896 896", focusable: "false" }, children: [{ tag: "path", attrs: { d: "M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z" } }] }, name: "left", theme: "outlined" };
const l$ = a$;
function du(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? Object(arguments[t]) : {}, o = Object.keys(n);
    typeof Object.getOwnPropertySymbols == "function" && (o = o.concat(Object.getOwnPropertySymbols(n).filter(function(r) {
      return Object.getOwnPropertyDescriptor(n, r).enumerable;
    }))), o.forEach(function(r) {
      s$(e, r, n[r]);
    });
  }
  return e;
}
function s$(e, t, n) {
  return t in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
var Pl = function(t, n) {
  var o = du({}, t, n.attrs);
  return v(gt, du({}, o, {
    icon: l$
  }), null);
};
Pl.displayName = "LeftOutlined";
Pl.inheritAttrs = !1;
const fu = Pl;
function c$(e, t, n) {
  var o = n || {}, r = o.noTrailing, i = r === void 0 ? !1 : r, a = o.noLeading, l = a === void 0 ? !1 : a, c = o.debounceMode, s = c === void 0 ? void 0 : c, d, u = !1, f = 0;
  function p() {
    d && clearTimeout(d);
  }
  function h(w) {
    var y = w || {}, S = y.upcomingOnly, _ = S === void 0 ? !1 : S;
    p(), u = !_;
  }
  function m() {
    for (var w = arguments.length, y = new Array(w), S = 0; S < w; S++)
      y[S] = arguments[S];
    var _ = this, C = Date.now() - f;
    if (u)
      return;
    function x() {
      f = Date.now(), t.apply(_, y);
    }
    function O() {
      d = void 0;
    }
    !l && s && !d && x(), p(), s === void 0 && C > e ? l ? (f = Date.now(), i || (d = setTimeout(s ? O : x, e))) : x() : i !== !0 && (d = setTimeout(s ? O : x, s === void 0 ? e - C : e));
  }
  return m.cancel = h, m;
}
function u$(e, t, n) {
  var o = n || {}, r = o.atBegin, i = r === void 0 ? !1 : r;
  return c$(e, t, {
    debounceMode: i !== !1
  });
}
const d$ = new $e("antSpinMove", {
  to: {
    opacity: 1
  }
}), f$ = new $e("antRotate", {
  to: {
    transform: "rotate(405deg)"
  }
}), p$ = (e) => ({
  [`${e.componentCls}`]: g(g({}, Mo(e)), {
    position: "absolute",
    display: "none",
    color: e.colorPrimary,
    textAlign: "center",
    verticalAlign: "middle",
    opacity: 0,
    transition: `transform ${e.motionDurationSlow} ${e.motionEaseInOutCirc}`,
    "&-spinning": {
      position: "static",
      display: "inline-block",
      opacity: 1
    },
    "&-nested-loading": {
      position: "relative",
      [`> div > ${e.componentCls}`]: {
        position: "absolute",
        top: 0,
        insetInlineStart: 0,
        zIndex: 4,
        display: "block",
        width: "100%",
        height: "100%",
        maxHeight: e.contentHeight,
        [`${e.componentCls}-dot`]: {
          position: "absolute",
          top: "50%",
          insetInlineStart: "50%",
          margin: -e.spinDotSize / 2
        },
        [`${e.componentCls}-text`]: {
          position: "absolute",
          top: "50%",
          width: "100%",
          paddingTop: (e.spinDotSize - e.fontSize) / 2 + 2,
          textShadow: `0 1px 2px ${e.colorBgContainer}`
          // FIXME: shadow
        },
        [`&${e.componentCls}-show-text ${e.componentCls}-dot`]: {
          marginTop: -(e.spinDotSize / 2) - 10
        },
        "&-sm": {
          [`${e.componentCls}-dot`]: {
            margin: -e.spinDotSizeSM / 2
          },
          [`${e.componentCls}-text`]: {
            paddingTop: (e.spinDotSizeSM - e.fontSize) / 2 + 2
          },
          [`&${e.componentCls}-show-text ${e.componentCls}-dot`]: {
            marginTop: -(e.spinDotSizeSM / 2) - 10
          }
        },
        "&-lg": {
          [`${e.componentCls}-dot`]: {
            margin: -(e.spinDotSizeLG / 2)
          },
          [`${e.componentCls}-text`]: {
            paddingTop: (e.spinDotSizeLG - e.fontSize) / 2 + 2
          },
          [`&${e.componentCls}-show-text ${e.componentCls}-dot`]: {
            marginTop: -(e.spinDotSizeLG / 2) - 10
          }
        }
      },
      [`${e.componentCls}-container`]: {
        position: "relative",
        transition: `opacity ${e.motionDurationSlow}`,
        "&::after": {
          position: "absolute",
          top: 0,
          insetInlineEnd: 0,
          bottom: 0,
          insetInlineStart: 0,
          zIndex: 10,
          width: "100%",
          height: "100%",
          background: e.colorBgContainer,
          opacity: 0,
          transition: `all ${e.motionDurationSlow}`,
          content: '""',
          pointerEvents: "none"
        }
      },
      [`${e.componentCls}-blur`]: {
        clear: "both",
        opacity: 0.5,
        userSelect: "none",
        pointerEvents: "none",
        "&::after": {
          opacity: 0.4,
          pointerEvents: "auto"
        }
      }
    },
    // tip
    // ------------------------------
    "&-tip": {
      color: e.spinDotDefault
    },
    // dots
    // ------------------------------
    [`${e.componentCls}-dot`]: {
      position: "relative",
      display: "inline-block",
      fontSize: e.spinDotSize,
      width: "1em",
      height: "1em",
      "&-item": {
        position: "absolute",
        display: "block",
        width: (e.spinDotSize - e.marginXXS / 2) / 2,
        height: (e.spinDotSize - e.marginXXS / 2) / 2,
        backgroundColor: e.colorPrimary,
        borderRadius: "100%",
        transform: "scale(0.75)",
        transformOrigin: "50% 50%",
        opacity: 0.3,
        animationName: d$,
        animationDuration: "1s",
        animationIterationCount: "infinite",
        animationTimingFunction: "linear",
        animationDirection: "alternate",
        "&:nth-child(1)": {
          top: 0,
          insetInlineStart: 0
        },
        "&:nth-child(2)": {
          top: 0,
          insetInlineEnd: 0,
          animationDelay: "0.4s"
        },
        "&:nth-child(3)": {
          insetInlineEnd: 0,
          bottom: 0,
          animationDelay: "0.8s"
        },
        "&:nth-child(4)": {
          bottom: 0,
          insetInlineStart: 0,
          animationDelay: "1.2s"
        }
      },
      "&-spin": {
        transform: "rotate(45deg)",
        animationName: f$,
        animationDuration: "1.2s",
        animationIterationCount: "infinite",
        animationTimingFunction: "linear"
      }
    },
    // Sizes
    // ------------------------------
    // small
    [`&-sm ${e.componentCls}-dot`]: {
      fontSize: e.spinDotSizeSM,
      i: {
        width: (e.spinDotSizeSM - e.marginXXS / 2) / 2,
        height: (e.spinDotSizeSM - e.marginXXS / 2) / 2
      }
    },
    // large
    [`&-lg ${e.componentCls}-dot`]: {
      fontSize: e.spinDotSizeLG,
      i: {
        width: (e.spinDotSizeLG - e.marginXXS) / 2,
        height: (e.spinDotSizeLG - e.marginXXS) / 2
      }
    },
    [`&${e.componentCls}-show-text ${e.componentCls}-text`]: {
      display: "block"
    }
  })
}), h$ = No("Spin", (e) => {
  const t = Fe(e, {
    spinDotDefault: e.colorTextDescription,
    spinDotSize: e.controlHeightLG / 2,
    spinDotSizeSM: e.controlHeightLG * 0.35,
    spinDotSizeLG: e.controlHeight
  });
  return [p$(t)];
}, {
  contentHeight: 400
});
var g$ = globalThis && globalThis.__rest || function(e, t) {
  var n = {};
  for (var o in e)
    Object.prototype.hasOwnProperty.call(e, o) && t.indexOf(o) < 0 && (n[o] = e[o]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var r = 0, o = Object.getOwnPropertySymbols(e); r < o.length; r++)
      t.indexOf(o[r]) < 0 && Object.prototype.propertyIsEnumerable.call(e, o[r]) && (n[o[r]] = e[o[r]]);
  return n;
};
const m$ = () => ({
  prefixCls: String,
  spinning: {
    type: Boolean,
    default: void 0
  },
  size: String,
  wrapperClassName: String,
  tip: P.any,
  delay: Number,
  indicator: P.any
});
let gr = null;
function v$(e, t) {
  return !!e && !!t && !isNaN(Number(t));
}
function b$(e) {
  const t = e.indicator;
  gr = typeof t == "function" ? t : () => v(t, null, null);
}
const io = /* @__PURE__ */ Z({
  compatConfig: {
    MODE: 3
  },
  name: "ASpin",
  inheritAttrs: !1,
  props: Kr(m$(), {
    size: "default",
    spinning: !0,
    wrapperClassName: ""
  }),
  setup(e, t) {
    let {
      attrs: n,
      slots: o
    } = t;
    const {
      prefixCls: r,
      size: i,
      direction: a
    } = Hn("spin", e), [l, c] = h$(r), s = V(e.spinning && !v$(e.spinning, e.delay));
    let d;
    return ae([() => e.spinning, () => e.delay], () => {
      d == null || d.cancel(), d = u$(e.delay, () => {
        s.value = e.spinning;
      }), d == null || d();
    }, {
      immediate: !0,
      flush: "post"
    }), rt(() => {
      d == null || d.cancel();
    }), () => {
      var u, f;
      const {
        class: p
      } = n, h = g$(n, ["class"]), {
        tip: m = (u = o.tip) === null || u === void 0 ? void 0 : u.call(o)
      } = e, w = (f = o.default) === null || f === void 0 ? void 0 : f.call(o), y = {
        [c.value]: !0,
        [r.value]: !0,
        [`${r.value}-sm`]: i.value === "small",
        [`${r.value}-lg`]: i.value === "large",
        [`${r.value}-spinning`]: s.value,
        [`${r.value}-show-text`]: !!m,
        [`${r.value}-rtl`]: a.value === "rtl",
        [p]: !!p
      };
      function S(C) {
        const x = `${C}-dot`;
        let O = Wm(o, e, "indicator");
        return O === null ? null : (Array.isArray(O) && (O = O.length === 1 ? O[0] : O), ft(O) ? ot(O, {
          class: x
        }) : gr && ft(gr()) ? ot(gr(), {
          class: x
        }) : v("span", {
          class: `${x} ${C}-dot-spin`
        }, [v("i", {
          class: `${C}-dot-item`
        }, null), v("i", {
          class: `${C}-dot-item`
        }, null), v("i", {
          class: `${C}-dot-item`
        }, null), v("i", {
          class: `${C}-dot-item`
        }, null)]));
      }
      const _ = v("div", U(U({}, h), {}, {
        class: y,
        "aria-live": "polite",
        "aria-busy": s.value
      }), [S(r.value), m ? v("div", {
        class: `${r.value}-text`
      }, [m]) : null]);
      if (w && Io(w).length) {
        const C = {
          [`${r.value}-container`]: !0,
          [`${r.value}-blur`]: s.value
        };
        return l(v("div", {
          class: [`${r.value}-nested-loading`, e.wrapperClassName, c.value]
        }, [s.value && v("div", {
          key: "loading"
        }, [_]), v("div", {
          class: C,
          key: "container"
        }, [w])]));
      }
      return l(_);
    };
  }
});
io.setDefaultIndicator = b$;
io.install = function(e) {
  return e.component(io.name, io), e;
};
var y$ = { icon: { tag: "svg", attrs: { viewBox: "64 64 896 896", focusable: "false" }, children: [{ tag: "path", attrs: { d: "M272.9 512l265.4-339.1c4.1-5.2.4-12.9-6.3-12.9h-77.3c-4.9 0-9.6 2.3-12.6 6.1L186.8 492.3a31.99 31.99 0 000 39.5l255.3 326.1c3 3.9 7.7 6.1 12.6 6.1H532c6.7 0 10.4-7.7 6.3-12.9L272.9 512zm304 0l265.4-339.1c4.1-5.2.4-12.9-6.3-12.9h-77.3c-4.9 0-9.6 2.3-12.6 6.1L490.8 492.3a31.99 31.99 0 000 39.5l255.3 326.1c3 3.9 7.7 6.1 12.6 6.1H836c6.7 0 10.4-7.7 6.3-12.9L576.9 512z" } }] }, name: "double-left", theme: "outlined" };
const S$ = y$;
function pu(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? Object(arguments[t]) : {}, o = Object.keys(n);
    typeof Object.getOwnPropertySymbols == "function" && (o = o.concat(Object.getOwnPropertySymbols(n).filter(function(r) {
      return Object.getOwnPropertyDescriptor(n, r).enumerable;
    }))), o.forEach(function(r) {
      w$(e, r, n[r]);
    });
  }
  return e;
}
function w$(e, t, n) {
  return t in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
var Il = function(t, n) {
  var o = pu({}, t, n.attrs);
  return v(gt, pu({}, o, {
    icon: S$
  }), null);
};
Il.displayName = "DoubleLeftOutlined";
Il.inheritAttrs = !1;
const hu = Il;
var C$ = { icon: { tag: "svg", attrs: { viewBox: "64 64 896 896", focusable: "false" }, children: [{ tag: "path", attrs: { d: "M533.2 492.3L277.9 166.1c-3-3.9-7.7-6.1-12.6-6.1H188c-6.7 0-10.4 7.7-6.3 12.9L447.1 512 181.7 851.1A7.98 7.98 0 00188 864h77.3c4.9 0 9.6-2.3 12.6-6.1l255.3-326.1c9.1-11.7 9.1-27.9 0-39.5zm304 0L581.9 166.1c-3-3.9-7.7-6.1-12.6-6.1H492c-6.7 0-10.4 7.7-6.3 12.9L751.1 512 485.7 851.1A7.98 7.98 0 00492 864h77.3c4.9 0 9.6-2.3 12.6-6.1l255.3-326.1c9.1-11.7 9.1-27.9 0-39.5z" } }] }, name: "double-right", theme: "outlined" };
const x$ = C$;
function gu(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? Object(arguments[t]) : {}, o = Object.keys(n);
    typeof Object.getOwnPropertySymbols == "function" && (o = o.concat(Object.getOwnPropertySymbols(n).filter(function(r) {
      return Object.getOwnPropertyDescriptor(n, r).enumerable;
    }))), o.forEach(function(r) {
      O$(e, r, n[r]);
    });
  }
  return e;
}
function O$(e, t, n) {
  return t in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
var Ml = function(t, n) {
  var o = gu({}, t, n.attrs);
  return v(gt, gu({}, o, {
    icon: x$
  }), null);
};
Ml.displayName = "DoubleRightOutlined";
Ml.inheritAttrs = !1;
const mu = Ml, $$ = /* @__PURE__ */ Z({
  name: "MiniSelect",
  compatConfig: {
    MODE: 3
  },
  inheritAttrs: !1,
  props: El(),
  Option: Hr.Option,
  setup(e, t) {
    let {
      attrs: n,
      slots: o
    } = t;
    return () => {
      const r = g(g(g({}, e), {
        size: "small"
      }), n);
      return v(Hr, r, o);
    };
  }
}), _$ = /* @__PURE__ */ Z({
  name: "MiddleSelect",
  inheritAttrs: !1,
  props: El(),
  Option: Hr.Option,
  setup(e, t) {
    let {
      attrs: n,
      slots: o
    } = t;
    return () => {
      const r = g(g(g({}, e), {
        size: "middle"
      }), n);
      return v(Hr, r, o);
    };
  }
}), Kt = /* @__PURE__ */ Z({
  compatConfig: {
    MODE: 3
  },
  name: "Pager",
  inheritAttrs: !1,
  props: {
    rootPrefixCls: String,
    page: Number,
    active: {
      type: Boolean,
      default: void 0
    },
    last: {
      type: Boolean,
      default: void 0
    },
    locale: P.object,
    showTitle: {
      type: Boolean,
      default: void 0
    },
    itemRender: {
      type: Function,
      default: () => {
      }
    },
    onClick: {
      type: Function
    },
    onKeypress: {
      type: Function
    }
  },
  eimt: ["click", "keypress"],
  setup(e, t) {
    let {
      emit: n,
      attrs: o
    } = t;
    const r = () => {
      n("click", e.page);
    }, i = (a) => {
      n("keypress", a, r, e.page);
    };
    return () => {
      const {
        showTitle: a,
        page: l,
        itemRender: c
      } = e, {
        class: s,
        style: d
      } = o, u = `${e.rootPrefixCls}-item`, f = ne(u, `${u}-${e.page}`, {
        [`${u}-active`]: e.active,
        [`${u}-disabled`]: !e.page
      }, s);
      return v("li", {
        onClick: r,
        onKeypress: i,
        title: a ? String(l) : null,
        tabindex: "0",
        class: f,
        style: d
      }, [c({
        page: l,
        type: "page",
        originalElement: v("a", {
          rel: "nofollow"
        }, [l])
      })]);
    };
  }
}), Xt = {
  ZERO: 48,
  NINE: 57,
  NUMPAD_ZERO: 96,
  NUMPAD_NINE: 105,
  BACKSPACE: 8,
  DELETE: 46,
  ENTER: 13,
  ARROW_UP: 38,
  ARROW_DOWN: 40
}, E$ = /* @__PURE__ */ Z({
  compatConfig: {
    MODE: 3
  },
  props: {
    disabled: {
      type: Boolean,
      default: void 0
    },
    changeSize: Function,
    quickGo: Function,
    selectComponentClass: P.any,
    current: Number,
    pageSizeOptions: P.array.def(["10", "20", "50", "100"]),
    pageSize: Number,
    buildOptionText: Function,
    locale: P.object,
    rootPrefixCls: String,
    selectPrefixCls: String,
    goButton: P.any
  },
  setup(e) {
    const t = oe(""), n = E(() => !t.value || isNaN(t.value) ? void 0 : Number(t.value)), o = (c) => `${c.value} ${e.locale.items_per_page}`, r = (c) => {
      const {
        value: s,
        composing: d
      } = c.target;
      c.isComposing || d || t.value === s || (t.value = s);
    }, i = (c) => {
      const {
        goButton: s,
        quickGo: d,
        rootPrefixCls: u
      } = e;
      if (!(s || t.value === ""))
        if (c.relatedTarget && (c.relatedTarget.className.indexOf(`${u}-item-link`) >= 0 || c.relatedTarget.className.indexOf(`${u}-item`) >= 0)) {
          t.value = "";
          return;
        } else
          d(n.value), t.value = "";
    }, a = (c) => {
      t.value !== "" && (c.keyCode === Xt.ENTER || c.type === "click") && (e.quickGo(n.value), t.value = "");
    }, l = E(() => {
      const {
        pageSize: c,
        pageSizeOptions: s
      } = e;
      return s.some((d) => d.toString() === c.toString()) ? s : s.concat([c.toString()]).sort((d, u) => {
        const f = isNaN(Number(d)) ? 0 : Number(d), p = isNaN(Number(u)) ? 0 : Number(u);
        return f - p;
      });
    });
    return () => {
      const {
        rootPrefixCls: c,
        locale: s,
        changeSize: d,
        quickGo: u,
        goButton: f,
        selectComponentClass: p,
        selectPrefixCls: h,
        pageSize: m,
        disabled: w
      } = e, y = `${c}-options`;
      let S = null, _ = null, C = null;
      if (!d && !u)
        return null;
      if (d && p) {
        const x = e.buildOptionText || o, O = l.value.map((b, $) => v(p.Option, {
          key: $,
          value: b
        }, {
          default: () => [x({
            value: b
          })]
        }));
        S = v(p, {
          disabled: w,
          prefixCls: h,
          showSearch: !1,
          class: `${y}-size-changer`,
          optionLabelProp: "children",
          value: (m || l.value[0]).toString(),
          onChange: (b) => d(Number(b)),
          getPopupContainer: (b) => b.parentNode
        }, {
          default: () => [O]
        });
      }
      return u && (f && (C = typeof f == "boolean" ? v("button", {
        type: "button",
        onClick: a,
        onKeyup: a,
        disabled: w,
        class: `${y}-quick-jumper-button`
      }, [s.jump_to_confirm]) : v("span", {
        onClick: a,
        onKeyup: a
      }, [f])), _ = v("div", {
        class: `${y}-quick-jumper`
      }, [s.jump_to, Dn(v("input", {
        disabled: w,
        type: "text",
        value: t.value,
        onInput: r,
        onChange: r,
        onKeyup: a,
        onBlur: i
      }, null), [[sl]]), s.page, C])), v("li", {
        class: `${y}`
      }, [S, _]);
    };
  }
}), T$ = {
  // Options.jsx
  items_per_page: "条/页",
  jump_to: "跳至",
  jump_to_confirm: "确定",
  page: "页",
  // Pagination.jsx
  prev_page: "上一页",
  next_page: "下一页",
  prev_5: "向前 5 页",
  next_5: "向后 5 页",
  prev_3: "向前 3 页",
  next_3: "向后 3 页"
};
var P$ = globalThis && globalThis.__rest || function(e, t) {
  var n = {};
  for (var o in e)
    Object.prototype.hasOwnProperty.call(e, o) && t.indexOf(o) < 0 && (n[o] = e[o]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var r = 0, o = Object.getOwnPropertySymbols(e); r < o.length; r++)
      t.indexOf(o[r]) < 0 && Object.prototype.propertyIsEnumerable.call(e, o[r]) && (n[o[r]] = e[o[r]]);
  return n;
};
function I$(e) {
  return typeof e == "number" && isFinite(e) && Math.floor(e) === e;
}
function M$(e) {
  let {
    originalElement: t
  } = e;
  return t;
}
function yt(e, t, n) {
  const o = typeof e > "u" ? t.statePageSize : e;
  return Math.floor((n.total - 1) / o) + 1;
}
const N$ = /* @__PURE__ */ Z({
  compatConfig: {
    MODE: 3
  },
  name: "Pagination",
  mixins: [Qf],
  inheritAttrs: !1,
  props: {
    disabled: {
      type: Boolean,
      default: void 0
    },
    prefixCls: P.string.def("rc-pagination"),
    selectPrefixCls: P.string.def("rc-select"),
    current: Number,
    defaultCurrent: P.number.def(1),
    total: P.number.def(0),
    pageSize: Number,
    defaultPageSize: P.number.def(10),
    hideOnSinglePage: {
      type: Boolean,
      default: !1
    },
    showSizeChanger: {
      type: Boolean,
      default: void 0
    },
    showLessItems: {
      type: Boolean,
      default: !1
    },
    // showSizeChange: PropTypes.func.def(noop),
    selectComponentClass: P.any,
    showPrevNextJumpers: {
      type: Boolean,
      default: !0
    },
    showQuickJumper: P.oneOfType([P.looseBool, P.object]).def(!1),
    showTitle: {
      type: Boolean,
      default: !0
    },
    pageSizeOptions: P.arrayOf(P.oneOfType([P.number, P.string])),
    buildOptionText: Function,
    showTotal: Function,
    simple: {
      type: Boolean,
      default: void 0
    },
    locale: P.object.def(T$),
    itemRender: P.func.def(M$),
    prevIcon: P.any,
    nextIcon: P.any,
    jumpPrevIcon: P.any,
    jumpNextIcon: P.any,
    totalBoundaryShowSizeChanger: P.number.def(50)
  },
  data() {
    const e = this.$props;
    let t = su([this.current, this.defaultCurrent]);
    const n = su([this.pageSize, this.defaultPageSize]);
    return t = Math.min(t, yt(n, void 0, e)), {
      stateCurrent: t,
      stateCurrentInputValue: t,
      statePageSize: n
    };
  },
  watch: {
    current(e) {
      this.setState({
        stateCurrent: e,
        stateCurrentInputValue: e
      });
    },
    pageSize(e) {
      const t = {};
      let n = this.stateCurrent;
      const o = yt(e, this.$data, this.$props);
      n = n > o ? o : n, vn(this, "current") || (t.stateCurrent = n, t.stateCurrentInputValue = n), t.statePageSize = e, this.setState(t);
    },
    stateCurrent(e, t) {
      this.$nextTick(() => {
        if (this.$refs.paginationNode) {
          const n = this.$refs.paginationNode.querySelector(`.${this.prefixCls}-item-${t}`);
          n && document.activeElement === n && n.blur();
        }
      });
    },
    total() {
      const e = {}, t = yt(this.pageSize, this.$data, this.$props);
      if (vn(this, "current")) {
        const n = Math.min(this.current, t);
        e.stateCurrent = n, e.stateCurrentInputValue = n;
      } else {
        let n = this.stateCurrent;
        n === 0 && t > 0 ? n = 1 : n = Math.min(this.stateCurrent, t), e.stateCurrent = n;
      }
      this.setState(e);
    }
  },
  methods: {
    getJumpPrevPage() {
      return Math.max(1, this.stateCurrent - (this.showLessItems ? 3 : 5));
    },
    getJumpNextPage() {
      return Math.min(yt(void 0, this.$data, this.$props), this.stateCurrent + (this.showLessItems ? 3 : 5));
    },
    getItemIcon(e, t) {
      const {
        prefixCls: n
      } = this.$props;
      return Sd(this, e, this.$props) || v("button", {
        type: "button",
        "aria-label": t,
        class: `${n}-item-link`
      }, null);
    },
    getValidValue(e) {
      const t = e.target.value, n = yt(void 0, this.$data, this.$props), {
        stateCurrentInputValue: o
      } = this.$data;
      let r;
      return t === "" ? r = t : isNaN(Number(t)) ? r = o : t >= n ? r = n : r = Number(t), r;
    },
    isValid(e) {
      return I$(e) && e !== this.stateCurrent;
    },
    shouldDisplayQuickJumper() {
      const {
        showQuickJumper: e,
        pageSize: t,
        total: n
      } = this.$props;
      return n <= t ? !1 : e;
    },
    // calculatePage (p) {
    //   let pageSize = p
    //   if (typeof pageSize === 'undefined') {
    //     pageSize = this.statePageSize
    //   }
    //   return Math.floor((this.total - 1) / pageSize) + 1
    // },
    handleKeyDown(e) {
      (e.keyCode === Xt.ARROW_UP || e.keyCode === Xt.ARROW_DOWN) && e.preventDefault();
    },
    handleKeyUp(e) {
      if (e.isComposing || e.target.composing)
        return;
      const t = this.getValidValue(e), n = this.stateCurrentInputValue;
      t !== n && this.setState({
        stateCurrentInputValue: t
      }), e.keyCode === Xt.ENTER ? this.handleChange(t) : e.keyCode === Xt.ARROW_UP ? this.handleChange(t - 1) : e.keyCode === Xt.ARROW_DOWN && this.handleChange(t + 1);
    },
    changePageSize(e) {
      let t = this.stateCurrent;
      const n = t, o = yt(e, this.$data, this.$props);
      t = t > o ? o : t, o === 0 && (t = this.stateCurrent), typeof e == "number" && (vn(this, "pageSize") || this.setState({
        statePageSize: e
      }), vn(this, "current") || this.setState({
        stateCurrent: t,
        stateCurrentInputValue: t
      })), this.__emit("update:pageSize", e), t !== n && this.__emit("update:current", t), this.__emit("showSizeChange", t, e), this.__emit("change", t, e);
    },
    handleChange(e) {
      const {
        disabled: t
      } = this.$props;
      let n = e;
      if (this.isValid(n) && !t) {
        const o = yt(void 0, this.$data, this.$props);
        return n > o ? n = o : n < 1 && (n = 1), vn(this, "current") || this.setState({
          stateCurrent: n,
          stateCurrentInputValue: n
        }), this.__emit("update:current", n), this.__emit("change", n, this.statePageSize), n;
      }
      return this.stateCurrent;
    },
    prev() {
      this.hasPrev() && this.handleChange(this.stateCurrent - 1);
    },
    next() {
      this.hasNext() && this.handleChange(this.stateCurrent + 1);
    },
    jumpPrev() {
      this.handleChange(this.getJumpPrevPage());
    },
    jumpNext() {
      this.handleChange(this.getJumpNextPage());
    },
    hasPrev() {
      return this.stateCurrent > 1;
    },
    hasNext() {
      return this.stateCurrent < yt(void 0, this.$data, this.$props);
    },
    getShowSizeChanger() {
      const {
        showSizeChanger: e,
        total: t,
        totalBoundaryShowSizeChanger: n
      } = this.$props;
      return typeof e < "u" ? e : t > n;
    },
    runIfEnter(e, t) {
      if (e.key === "Enter" || e.charCode === 13) {
        for (var n = arguments.length, o = new Array(n > 2 ? n - 2 : 0), r = 2; r < n; r++)
          o[r - 2] = arguments[r];
        t(...o);
      }
    },
    runIfEnterPrev(e) {
      this.runIfEnter(e, this.prev);
    },
    runIfEnterNext(e) {
      this.runIfEnter(e, this.next);
    },
    runIfEnterJumpPrev(e) {
      this.runIfEnter(e, this.jumpPrev);
    },
    runIfEnterJumpNext(e) {
      this.runIfEnter(e, this.jumpNext);
    },
    handleGoTO(e) {
      (e.keyCode === Xt.ENTER || e.type === "click") && this.handleChange(this.stateCurrentInputValue);
    },
    renderPrev(e) {
      const {
        itemRender: t
      } = this.$props, n = t({
        page: e,
        type: "prev",
        originalElement: this.getItemIcon("prevIcon", "prev page")
      }), o = !this.hasPrev();
      return an(n) ? Nn(n, o ? {
        disabled: o
      } : {}) : n;
    },
    renderNext(e) {
      const {
        itemRender: t
      } = this.$props, n = t({
        page: e,
        type: "next",
        originalElement: this.getItemIcon("nextIcon", "next page")
      }), o = !this.hasNext();
      return an(n) ? Nn(n, o ? {
        disabled: o
      } : {}) : n;
    }
  },
  render() {
    const {
      prefixCls: e,
      disabled: t,
      hideOnSinglePage: n,
      total: o,
      locale: r,
      showQuickJumper: i,
      showLessItems: a,
      showTitle: l,
      showTotal: c,
      simple: s,
      itemRender: d,
      showPrevNextJumpers: u,
      jumpPrevIcon: f,
      jumpNextIcon: p,
      selectComponentClass: h,
      selectPrefixCls: m,
      pageSizeOptions: w
    } = this.$props, {
      stateCurrent: y,
      statePageSize: S
    } = this, _ = yd(this.$attrs).extraAttrs, {
      class: C
    } = _, x = P$(_, ["class"]);
    if (n === !0 && this.total <= S)
      return null;
    const O = yt(void 0, this.$data, this.$props), b = [];
    let $ = null, T = null, R = null, H = null, N = null;
    const j = i && i.goButton, B = a ? 1 : 2, F = y - 1 > 0 ? y - 1 : 0, L = y + 1 < O ? y + 1 : O, Y = this.hasPrev(), re = this.hasNext();
    if (s)
      return j && (typeof j == "boolean" ? N = v("button", {
        type: "button",
        onClick: this.handleGoTO,
        onKeyup: this.handleGoTO
      }, [r.jump_to_confirm]) : N = v("span", {
        onClick: this.handleGoTO,
        onKeyup: this.handleGoTO
      }, [j]), N = v("li", {
        title: l ? `${r.jump_to}${y}/${O}` : null,
        class: `${e}-simple-pager`
      }, [N])), v("ul", U({
        class: ne(`${e} ${e}-simple`, {
          [`${e}-disabled`]: t
        }, C)
      }, x), [v("li", {
        title: l ? r.prev_page : null,
        onClick: this.prev,
        tabindex: Y ? 0 : null,
        onKeypress: this.runIfEnterPrev,
        class: ne(`${e}-prev`, {
          [`${e}-disabled`]: !Y
        }),
        "aria-disabled": !Y
      }, [this.renderPrev(F)]), v("li", {
        title: l ? `${y}/${O}` : null,
        class: `${e}-simple-pager`
      }, [Dn(v("input", {
        type: "text",
        value: this.stateCurrentInputValue,
        disabled: t,
        onKeydown: this.handleKeyDown,
        onKeyup: this.handleKeyUp,
        onInput: this.handleKeyUp,
        onChange: this.handleKeyUp,
        size: "3"
      }, null), [[sl]]), v("span", {
        class: `${e}-slash`
      }, [_n("／")]), O]), v("li", {
        title: l ? r.next_page : null,
        onClick: this.next,
        tabindex: re ? 0 : null,
        onKeypress: this.runIfEnterNext,
        class: ne(`${e}-next`, {
          [`${e}-disabled`]: !re
        }),
        "aria-disabled": !re
      }, [this.renderNext(L)]), N]);
    if (O <= 3 + B * 2) {
      const de = {
        locale: r,
        rootPrefixCls: e,
        showTitle: l,
        itemRender: d,
        onClick: this.handleChange,
        onKeypress: this.runIfEnter
      };
      O || b.push(v(Kt, U(U({}, de), {}, {
        key: "noPager",
        page: 1,
        class: `${e}-item-disabled`
      }), null));
      for (let ue = 1; ue <= O; ue += 1) {
        const pe = y === ue;
        b.push(v(Kt, U(U({}, de), {}, {
          key: ue,
          page: ue,
          active: pe
        }), null));
      }
    } else {
      const de = a ? r.prev_3 : r.prev_5, ue = a ? r.next_3 : r.next_5;
      u && ($ = v("li", {
        title: this.showTitle ? de : null,
        key: "prev",
        onClick: this.jumpPrev,
        tabindex: "0",
        onKeypress: this.runIfEnterJumpPrev,
        class: ne(`${e}-jump-prev`, {
          [`${e}-jump-prev-custom-icon`]: !!f
        })
      }, [d({
        page: this.getJumpPrevPage(),
        type: "jump-prev",
        originalElement: this.getItemIcon("jumpPrevIcon", "prev page")
      })]), T = v("li", {
        title: this.showTitle ? ue : null,
        key: "next",
        tabindex: "0",
        onClick: this.jumpNext,
        onKeypress: this.runIfEnterJumpNext,
        class: ne(`${e}-jump-next`, {
          [`${e}-jump-next-custom-icon`]: !!p
        })
      }, [d({
        page: this.getJumpNextPage(),
        type: "jump-next",
        originalElement: this.getItemIcon("jumpNextIcon", "next page")
      })])), H = v(Kt, {
        locale: r,
        last: !0,
        rootPrefixCls: e,
        onClick: this.handleChange,
        onKeypress: this.runIfEnter,
        key: O,
        page: O,
        active: !1,
        showTitle: l,
        itemRender: d
      }, null), R = v(Kt, {
        locale: r,
        rootPrefixCls: e,
        onClick: this.handleChange,
        onKeypress: this.runIfEnter,
        key: 1,
        page: 1,
        active: !1,
        showTitle: l,
        itemRender: d
      }, null);
      let pe = Math.max(1, y - B), fe = Math.min(y + B, O);
      y - 1 <= B && (fe = 1 + B * 2), O - y <= B && (pe = O - B * 2);
      for (let me = pe; me <= fe; me += 1) {
        const Te = y === me;
        b.push(v(Kt, {
          locale: r,
          rootPrefixCls: e,
          onClick: this.handleChange,
          onKeypress: this.runIfEnter,
          key: me,
          page: me,
          active: Te,
          showTitle: l,
          itemRender: d
        }, null));
      }
      y - 1 >= B * 2 && y !== 1 + 2 && (b[0] = v(Kt, {
        locale: r,
        rootPrefixCls: e,
        onClick: this.handleChange,
        onKeypress: this.runIfEnter,
        key: pe,
        page: pe,
        class: `${e}-item-after-jump-prev`,
        active: !1,
        showTitle: this.showTitle,
        itemRender: d
      }, null), b.unshift($)), O - y >= B * 2 && y !== O - 2 && (b[b.length - 1] = v(Kt, {
        locale: r,
        rootPrefixCls: e,
        onClick: this.handleChange,
        onKeypress: this.runIfEnter,
        key: fe,
        page: fe,
        class: `${e}-item-before-jump-next`,
        active: !1,
        showTitle: this.showTitle,
        itemRender: d
      }, null), b.push(T)), pe !== 1 && b.unshift(R), fe !== O && b.push(H);
    }
    let A = null;
    c && (A = v("li", {
      class: `${e}-total-text`
    }, [c(o, [o === 0 ? 0 : (y - 1) * S + 1, y * S > o ? o : y * S])]));
    const K = !Y || !O, Q = !re || !O, X = this.buildOptionText || this.$slots.buildOptionText;
    return v("ul", U(U({
      unselectable: "on",
      ref: "paginationNode"
    }, x), {}, {
      class: ne({
        [`${e}`]: !0,
        [`${e}-disabled`]: t
      }, C)
    }), [A, v("li", {
      title: l ? r.prev_page : null,
      onClick: this.prev,
      tabindex: K ? null : 0,
      onKeypress: this.runIfEnterPrev,
      class: ne(`${e}-prev`, {
        [`${e}-disabled`]: K
      }),
      "aria-disabled": K
    }, [this.renderPrev(F)]), b, v("li", {
      title: l ? r.next_page : null,
      onClick: this.next,
      tabindex: Q ? null : 0,
      onKeypress: this.runIfEnterNext,
      class: ne(`${e}-next`, {
        [`${e}-disabled`]: Q
      }),
      "aria-disabled": Q
    }, [this.renderNext(L)]), v(E$, {
      disabled: t,
      locale: r,
      rootPrefixCls: e,
      selectComponentClass: h,
      selectPrefixCls: m,
      changeSize: this.getShowSizeChanger() ? this.changePageSize : null,
      current: y,
      pageSize: S,
      pageSizeOptions: w,
      buildOptionText: X || null,
      quickGo: this.shouldDisplayQuickJumper() ? this.handleChange : null,
      goButton: j
    }, null)]);
  }
}), A$ = (e) => {
  const {
    componentCls: t
  } = e;
  return {
    [`${t}-disabled`]: {
      "&, &:hover": {
        cursor: "not-allowed",
        [`${t}-item-link`]: {
          color: e.colorTextDisabled,
          cursor: "not-allowed"
        }
      },
      "&:focus-visible": {
        cursor: "not-allowed",
        [`${t}-item-link`]: {
          color: e.colorTextDisabled,
          cursor: "not-allowed"
        }
      }
    },
    [`&${t}-disabled`]: {
      cursor: "not-allowed",
      [`&${t}-mini`]: {
        [`
          &:hover ${t}-item:not(${t}-item-active),
          &:active ${t}-item:not(${t}-item-active),
          &:hover ${t}-item-link,
          &:active ${t}-item-link
        `]: {
          backgroundColor: "transparent"
        }
      },
      [`${t}-item`]: {
        cursor: "not-allowed",
        "&:hover, &:active": {
          backgroundColor: "transparent"
        },
        a: {
          color: e.colorTextDisabled,
          backgroundColor: "transparent",
          border: "none",
          cursor: "not-allowed"
        },
        "&-active": {
          borderColor: e.colorBorder,
          backgroundColor: e.paginationItemDisabledBgActive,
          "&:hover, &:active": {
            backgroundColor: e.paginationItemDisabledBgActive
          },
          a: {
            color: e.paginationItemDisabledColorActive
          }
        }
      },
      [`${t}-item-link`]: {
        color: e.colorTextDisabled,
        cursor: "not-allowed",
        "&:hover, &:active": {
          backgroundColor: "transparent"
        },
        [`${t}-simple&`]: {
          backgroundColor: "transparent",
          "&:hover, &:active": {
            backgroundColor: "transparent"
          }
        }
      },
      [`${t}-simple-pager`]: {
        color: e.colorTextDisabled
      },
      [`${t}-jump-prev, ${t}-jump-next`]: {
        [`${t}-item-link-icon`]: {
          opacity: 0
        },
        [`${t}-item-ellipsis`]: {
          opacity: 1
        }
      }
    },
    [`&${t}-simple`]: {
      [`${t}-prev, ${t}-next`]: {
        [`&${t}-disabled ${t}-item-link`]: {
          "&:hover, &:active": {
            backgroundColor: "transparent"
          }
        }
      }
    }
  };
}, D$ = (e) => {
  const {
    componentCls: t
  } = e;
  return {
    [`&${t}-mini ${t}-total-text, &${t}-mini ${t}-simple-pager`]: {
      height: e.paginationItemSizeSM,
      lineHeight: `${e.paginationItemSizeSM}px`
    },
    [`&${t}-mini ${t}-item`]: {
      minWidth: e.paginationItemSizeSM,
      height: e.paginationItemSizeSM,
      margin: 0,
      lineHeight: `${e.paginationItemSizeSM - 2}px`
    },
    [`&${t}-mini ${t}-item:not(${t}-item-active)`]: {
      backgroundColor: "transparent",
      borderColor: "transparent",
      "&:hover": {
        backgroundColor: e.colorBgTextHover
      },
      "&:active": {
        backgroundColor: e.colorBgTextActive
      }
    },
    [`&${t}-mini ${t}-prev, &${t}-mini ${t}-next`]: {
      minWidth: e.paginationItemSizeSM,
      height: e.paginationItemSizeSM,
      margin: 0,
      lineHeight: `${e.paginationItemSizeSM}px`,
      [`&:hover ${t}-item-link`]: {
        backgroundColor: e.colorBgTextHover
      },
      [`&:active ${t}-item-link`]: {
        backgroundColor: e.colorBgTextActive
      },
      [`&${t}-disabled:hover ${t}-item-link`]: {
        backgroundColor: "transparent"
      }
    },
    [`
    &${t}-mini ${t}-prev ${t}-item-link,
    &${t}-mini ${t}-next ${t}-item-link
    `]: {
      backgroundColor: "transparent",
      borderColor: "transparent",
      "&::after": {
        height: e.paginationItemSizeSM,
        lineHeight: `${e.paginationItemSizeSM}px`
      }
    },
    [`&${t}-mini ${t}-jump-prev, &${t}-mini ${t}-jump-next`]: {
      height: e.paginationItemSizeSM,
      marginInlineEnd: 0,
      lineHeight: `${e.paginationItemSizeSM}px`
    },
    [`&${t}-mini ${t}-options`]: {
      marginInlineStart: e.paginationMiniOptionsMarginInlineStart,
      "&-size-changer": {
        top: e.paginationMiniOptionsSizeChangerTop
      },
      "&-quick-jumper": {
        height: e.paginationItemSizeSM,
        lineHeight: `${e.paginationItemSizeSM}px`,
        input: g(g({}, Tp(e)), {
          width: e.paginationMiniQuickJumperInputWidth,
          height: e.controlHeightSM
        })
      }
    }
  };
}, R$ = (e) => {
  const {
    componentCls: t
  } = e;
  return {
    [`
    &${t}-simple ${t}-prev,
    &${t}-simple ${t}-next
    `]: {
      height: e.paginationItemSizeSM,
      lineHeight: `${e.paginationItemSizeSM}px`,
      verticalAlign: "top",
      [`${t}-item-link`]: {
        height: e.paginationItemSizeSM,
        backgroundColor: "transparent",
        border: 0,
        "&:hover": {
          backgroundColor: e.colorBgTextHover
        },
        "&:active": {
          backgroundColor: e.colorBgTextActive
        },
        "&::after": {
          height: e.paginationItemSizeSM,
          lineHeight: `${e.paginationItemSizeSM}px`
        }
      }
    },
    [`&${t}-simple ${t}-simple-pager`]: {
      display: "inline-block",
      height: e.paginationItemSizeSM,
      marginInlineEnd: e.marginXS,
      input: {
        boxSizing: "border-box",
        height: "100%",
        marginInlineEnd: e.marginXS,
        padding: `0 ${e.paginationItemPaddingInline}px`,
        textAlign: "center",
        backgroundColor: e.paginationItemInputBg,
        border: `${e.lineWidth}px ${e.lineType} ${e.colorBorder}`,
        borderRadius: e.borderRadius,
        outline: "none",
        transition: `border-color ${e.motionDurationMid}`,
        color: "inherit",
        "&:hover": {
          borderColor: e.colorPrimary
        },
        "&:focus": {
          borderColor: e.colorPrimaryHover,
          boxShadow: `${e.inputOutlineOffset}px 0 ${e.controlOutlineWidth}px ${e.controlOutline}`
        },
        "&[disabled]": {
          color: e.colorTextDisabled,
          backgroundColor: e.colorBgContainerDisabled,
          borderColor: e.colorBorder,
          cursor: "not-allowed"
        }
      }
    }
  };
}, H$ = (e) => {
  const {
    componentCls: t
  } = e;
  return {
    [`${t}-jump-prev, ${t}-jump-next`]: {
      outline: 0,
      [`${t}-item-container`]: {
        position: "relative",
        [`${t}-item-link-icon`]: {
          color: e.colorPrimary,
          fontSize: e.fontSizeSM,
          opacity: 0,
          transition: `all ${e.motionDurationMid}`,
          "&-svg": {
            top: 0,
            insetInlineEnd: 0,
            bottom: 0,
            insetInlineStart: 0,
            margin: "auto"
          }
        },
        [`${t}-item-ellipsis`]: {
          position: "absolute",
          top: 0,
          insetInlineEnd: 0,
          bottom: 0,
          insetInlineStart: 0,
          display: "block",
          margin: "auto",
          color: e.colorTextDisabled,
          fontFamily: "Arial, Helvetica, sans-serif",
          letterSpacing: e.paginationEllipsisLetterSpacing,
          textAlign: "center",
          textIndent: e.paginationEllipsisTextIndent,
          opacity: 1,
          transition: `all ${e.motionDurationMid}`
        }
      },
      "&:hover": {
        [`${t}-item-link-icon`]: {
          opacity: 1
        },
        [`${t}-item-ellipsis`]: {
          opacity: 0
        }
      },
      "&:focus-visible": g({
        [`${t}-item-link-icon`]: {
          opacity: 1
        },
        [`${t}-item-ellipsis`]: {
          opacity: 0
        }
      }, da(e))
    },
    [`
    ${t}-prev,
    ${t}-jump-prev,
    ${t}-jump-next
    `]: {
      marginInlineEnd: e.marginXS
    },
    [`
    ${t}-prev,
    ${t}-next,
    ${t}-jump-prev,
    ${t}-jump-next
    `]: {
      display: "inline-block",
      minWidth: e.paginationItemSize,
      height: e.paginationItemSize,
      color: e.colorText,
      fontFamily: e.paginationFontFamily,
      lineHeight: `${e.paginationItemSize}px`,
      textAlign: "center",
      verticalAlign: "middle",
      listStyle: "none",
      borderRadius: e.borderRadius,
      cursor: "pointer",
      transition: `all ${e.motionDurationMid}`
    },
    [`${t}-prev, ${t}-next`]: {
      fontFamily: "Arial, Helvetica, sans-serif",
      outline: 0,
      button: {
        color: e.colorText,
        cursor: "pointer",
        userSelect: "none"
      },
      [`${t}-item-link`]: {
        display: "block",
        width: "100%",
        height: "100%",
        padding: 0,
        fontSize: e.fontSizeSM,
        textAlign: "center",
        backgroundColor: "transparent",
        border: `${e.lineWidth}px ${e.lineType} transparent`,
        borderRadius: e.borderRadius,
        outline: "none",
        transition: `all ${e.motionDurationMid}`
      },
      [`&:focus-visible ${t}-item-link`]: g({}, da(e)),
      [`&:hover ${t}-item-link`]: {
        backgroundColor: e.colorBgTextHover
      },
      [`&:active ${t}-item-link`]: {
        backgroundColor: e.colorBgTextActive
      },
      [`&${t}-disabled:hover`]: {
        [`${t}-item-link`]: {
          backgroundColor: "transparent"
        }
      }
    },
    [`${t}-slash`]: {
      marginInlineEnd: e.paginationSlashMarginInlineEnd,
      marginInlineStart: e.paginationSlashMarginInlineStart
    },
    [`${t}-options`]: {
      display: "inline-block",
      marginInlineStart: e.margin,
      verticalAlign: "middle",
      "&-size-changer.-select": {
        display: "inline-block",
        width: "auto"
      },
      "&-quick-jumper": {
        display: "inline-block",
        height: e.controlHeight,
        marginInlineStart: e.marginXS,
        lineHeight: `${e.controlHeight}px`,
        verticalAlign: "top",
        input: g(g({}, r$(e)), {
          width: e.controlHeightLG * 1.25,
          height: e.controlHeight,
          boxSizing: "border-box",
          margin: 0,
          marginInlineStart: e.marginXS,
          marginInlineEnd: e.marginXS
        })
      }
    }
  };
}, F$ = (e) => {
  const {
    componentCls: t
  } = e;
  return {
    [`${t}-item`]: g(g({
      display: "inline-block",
      minWidth: e.paginationItemSize,
      height: e.paginationItemSize,
      marginInlineEnd: e.marginXS,
      fontFamily: e.paginationFontFamily,
      lineHeight: `${e.paginationItemSize - 2}px`,
      textAlign: "center",
      verticalAlign: "middle",
      listStyle: "none",
      backgroundColor: "transparent",
      border: `${e.lineWidth}px ${e.lineType} transparent`,
      borderRadius: e.borderRadius,
      outline: 0,
      cursor: "pointer",
      userSelect: "none",
      a: {
        display: "block",
        padding: `0 ${e.paginationItemPaddingInline}px`,
        color: e.colorText,
        transition: "none",
        "&:hover": {
          textDecoration: "none"
        }
      },
      [`&:not(${t}-item-active)`]: {
        "&:hover": {
          transition: `all ${e.motionDurationMid}`,
          backgroundColor: e.colorBgTextHover
        },
        "&:active": {
          backgroundColor: e.colorBgTextActive
        }
      }
    }, L0(e)), {
      "&-active": {
        fontWeight: e.paginationFontWeightActive,
        backgroundColor: e.paginationItemBgActive,
        borderColor: e.colorPrimary,
        a: {
          color: e.colorPrimary
        },
        "&:hover": {
          borderColor: e.colorPrimaryHover
        },
        "&:hover a": {
          color: e.colorPrimaryHover
        }
      }
    })
  };
}, z$ = (e) => {
  const {
    componentCls: t
  } = e;
  return {
    [t]: g(g(g(g(g(g(g(g({}, Mo(e)), {
      "ul, ol": {
        margin: 0,
        padding: 0,
        listStyle: "none"
      },
      "&::after": {
        display: "block",
        clear: "both",
        height: 0,
        overflow: "hidden",
        visibility: "hidden",
        content: '""'
      },
      [`${t}-total-text`]: {
        display: "inline-block",
        height: e.paginationItemSize,
        marginInlineEnd: e.marginXS,
        lineHeight: `${e.paginationItemSize - 2}px`,
        verticalAlign: "middle"
      }
    }), F$(e)), H$(e)), R$(e)), D$(e)), A$(e)), {
      // media query style
      [`@media only screen and (max-width: ${e.screenLG}px)`]: {
        [`${t}-item`]: {
          "&-after-jump-prev, &-before-jump-next": {
            display: "none"
          }
        }
      },
      [`@media only screen and (max-width: ${e.screenSM}px)`]: {
        [`${t}-options`]: {
          display: "none"
        }
      }
    }),
    // rtl style
    [`&${e.componentCls}-rtl`]: {
      direction: "rtl"
    }
  };
}, L$ = (e) => {
  const {
    componentCls: t
  } = e;
  return {
    [`${t}${t}-disabled`]: {
      "&, &:hover": {
        [`${t}-item-link`]: {
          borderColor: e.colorBorder
        }
      },
      "&:focus-visible": {
        [`${t}-item-link`]: {
          borderColor: e.colorBorder
        }
      },
      [`${t}-item, ${t}-item-link`]: {
        backgroundColor: e.colorBgContainerDisabled,
        borderColor: e.colorBorder,
        [`&:hover:not(${t}-item-active)`]: {
          backgroundColor: e.colorBgContainerDisabled,
          borderColor: e.colorBorder,
          a: {
            color: e.colorTextDisabled
          }
        },
        [`&${t}-item-active`]: {
          backgroundColor: e.paginationItemDisabledBgActive
        }
      },
      [`${t}-prev, ${t}-next`]: {
        "&:hover button": {
          backgroundColor: e.colorBgContainerDisabled,
          borderColor: e.colorBorder,
          color: e.colorTextDisabled
        },
        [`${t}-item-link`]: {
          backgroundColor: e.colorBgContainerDisabled,
          borderColor: e.colorBorder
        }
      }
    },
    [t]: {
      [`${t}-prev, ${t}-next`]: {
        "&:hover button": {
          borderColor: e.colorPrimaryHover,
          backgroundColor: e.paginationItemBg
        },
        [`${t}-item-link`]: {
          backgroundColor: e.paginationItemLinkBg,
          borderColor: e.colorBorder
        },
        [`&:hover ${t}-item-link`]: {
          borderColor: e.colorPrimary,
          backgroundColor: e.paginationItemBg,
          color: e.colorPrimary
        },
        [`&${t}-disabled`]: {
          [`${t}-item-link`]: {
            borderColor: e.colorBorder,
            color: e.colorTextDisabled
          }
        }
      },
      [`${t}-item`]: {
        backgroundColor: e.paginationItemBg,
        border: `${e.lineWidth}px ${e.lineType} ${e.colorBorder}`,
        [`&:hover:not(${t}-item-active)`]: {
          borderColor: e.colorPrimary,
          backgroundColor: e.paginationItemBg,
          a: {
            color: e.colorPrimary
          }
        },
        "&-active": {
          borderColor: e.colorPrimary
        }
      }
    }
  };
}, j$ = No("Pagination", (e) => {
  const t = Fe(e, {
    paginationItemSize: e.controlHeight,
    paginationFontFamily: e.fontFamily,
    paginationItemBg: e.colorBgContainer,
    paginationItemBgActive: e.colorBgContainer,
    paginationFontWeightActive: e.fontWeightStrong,
    paginationItemSizeSM: e.controlHeightSM,
    paginationItemInputBg: e.colorBgContainer,
    paginationMiniOptionsSizeChangerTop: 0,
    paginationItemDisabledBgActive: e.controlItemBgActiveDisabled,
    paginationItemDisabledColorActive: e.colorTextDisabled,
    paginationItemLinkBg: e.colorBgContainer,
    inputOutlineOffset: "0 0",
    paginationMiniOptionsMarginInlineStart: e.marginXXS / 2,
    paginationMiniQuickJumperInputWidth: e.controlHeightLG * 1.1,
    paginationItemPaddingInline: e.marginXXS * 1.5,
    paginationEllipsisLetterSpacing: e.marginXXS / 2,
    paginationSlashMarginInlineStart: e.marginXXS,
    paginationSlashMarginInlineEnd: e.marginSM,
    paginationEllipsisTextIndent: "0.13em"
    // magic for ui experience
  }, i$(e));
  return [z$(t), e.wireframe && L$(t)];
});
var B$ = globalThis && globalThis.__rest || function(e, t) {
  var n = {};
  for (var o in e)
    Object.prototype.hasOwnProperty.call(e, o) && t.indexOf(o) < 0 && (n[o] = e[o]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var r = 0, o = Object.getOwnPropertySymbols(e); r < o.length; r++)
      t.indexOf(o[r]) < 0 && Object.prototype.propertyIsEnumerable.call(e, o[r]) && (n[o[r]] = e[o[r]]);
  return n;
};
const V$ = () => ({
  total: Number,
  defaultCurrent: Number,
  disabled: Ge(),
  current: Number,
  defaultPageSize: Number,
  pageSize: Number,
  hideOnSinglePage: Ge(),
  showSizeChanger: Ge(),
  pageSizeOptions: Qi(),
  buildOptionText: Et(),
  showQuickJumper: Er([Boolean, Object]),
  showTotal: Et(),
  size: Mt(),
  simple: Ge(),
  locale: Object,
  prefixCls: String,
  selectPrefixCls: String,
  totalBoundaryShowSizeChanger: Number,
  selectComponentClass: String,
  itemRender: Et(),
  role: String,
  responsive: Boolean,
  showLessItems: Ge(),
  onChange: Et(),
  onShowSizeChange: Et(),
  "onUpdate:current": Et(),
  "onUpdate:pageSize": Et()
}), W$ = /* @__PURE__ */ Z({
  compatConfig: {
    MODE: 3
  },
  name: "APagination",
  inheritAttrs: !1,
  props: V$(),
  // emits: ['change', 'showSizeChange', 'update:current', 'update:pageSize'],
  setup(e, t) {
    let {
      slots: n,
      attrs: o
    } = t;
    const {
      prefixCls: r,
      configProvider: i,
      direction: a,
      size: l
    } = Hn("pagination", e), [c, s] = j$(r), d = E(() => i.getPrefixCls("select", e.selectPrefixCls)), u = qO(), [f] = Zm("Pagination", Id, at(e, "locale")), p = (h) => {
      const m = v("span", {
        class: `${h}-item-ellipsis`
      }, [_n("•••")]), w = v("button", {
        class: `${h}-item-link`,
        type: "button",
        tabindex: -1
      }, [a.value === "rtl" ? v(uu, null, null) : v(fu, null, null)]), y = v("button", {
        class: `${h}-item-link`,
        type: "button",
        tabindex: -1
      }, [a.value === "rtl" ? v(fu, null, null) : v(uu, null, null)]), S = v("a", {
        rel: "nofollow",
        class: `${h}-item-link`
      }, [v("div", {
        class: `${h}-item-container`
      }, [a.value === "rtl" ? v(mu, {
        class: `${h}-item-link-icon`
      }, null) : v(hu, {
        class: `${h}-item-link-icon`
      }, null), m])]), _ = v("a", {
        rel: "nofollow",
        class: `${h}-item-link`
      }, [v("div", {
        class: `${h}-item-container`
      }, [a.value === "rtl" ? v(hu, {
        class: `${h}-item-link-icon`
      }, null) : v(mu, {
        class: `${h}-item-link-icon`
      }, null), m])]);
      return {
        prevIcon: w,
        nextIcon: y,
        jumpPrevIcon: S,
        jumpNextIcon: _
      };
    };
    return () => {
      var h;
      const {
        itemRender: m = n.itemRender,
        buildOptionText: w = n.buildOptionText,
        selectComponentClass: y,
        responsive: S
      } = e, _ = B$(e, ["itemRender", "buildOptionText", "selectComponentClass", "responsive"]), C = l.value === "small" || !!(!((h = u.value) === null || h === void 0) && h.xs && !l.value && S), x = g(g(g(g(g({}, _), p(r.value)), {
        prefixCls: r.value,
        selectPrefixCls: d.value,
        selectComponentClass: y || (C ? $$ : _$),
        locale: f.value,
        buildOptionText: w
      }), o), {
        class: ne({
          [`${r.value}-mini`]: C,
          [`${r.value}-rtl`]: a.value === "rtl"
        }, o.class, s.value),
        itemRender: m
      });
      return c(v(N$, x, null));
    };
  }
}), K$ = ka(W$), U$ = Symbol("OverrideContext");
function X$() {
  return ye(U$, {});
}
const G$ = 10;
function k$(e) {
  const t = E(() => ({
    vertical: "bottom",
    horizontal: "right"
  }));
  Ye({
    page: 1,
    size: G$
  });
  function n(o, r) {
  }
  return {
    props: t,
    onChange: n
  };
}
const Fr = "__resize_observer_key__", Nl = "__resize_rect_key__";
function Y$(e) {
  return function(t) {
    const { target: n } = t[0], { width: o, height: r } = n.getBoundingClientRect(), { offsetWidth: i, offsetHeight: a } = n;
    Pp(
      n,
      e,
      { width: o, height: r, offsetWidth: i, offsetHeight: a },
      (n == null ? void 0 : n[Nl]) || {}
    );
  };
}
function vu(e) {
  const t = e[Fr];
  t && (t.unobserve(e), t.disconnect(), e[Fr] = null);
}
function Pp(e, t, n, o) {
  e[Nl] = {};
}
function bu(e, t) {
  const n = new ResizeObserver(Y$(t));
  n.observe(e), e[Fr] = n;
}
const Ip = {
  created(e, t) {
    const { arg: n, value: o = !0 } = t;
    o && bu(e, n);
  },
  updated(e, t) {
    const { arg: n, value: o = !0 } = t;
    o && !e[Fr] ? bu(e, n) : o || vu(e);
  },
  beforeUnmount(e, t) {
    const { arg: n, value: o = !0 } = t;
    o && Pp(e, n, {
      width: 0,
      height: 0,
      offsetHeight: 0,
      offsetWidth: 0
    }, e[Nl] || {}), vu(e);
  }
}, q$ = /* @__PURE__ */ Z({
  name: "STableHeader",
  directives: {
    resize: Ip
  },
  setup() {
    return () => "S Table Header";
  }
}), ri = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [o, r] of t)
    n[o] = r;
  return n;
};
function Q$(e, t, n, o, r, i) {
  return null;
}
const J$ = /* @__PURE__ */ ri(q$, [["render", Q$], ["__file", "/Users/Shengjie.Zhang4/Documents/code/front/table/src/table/components/header/index.vue"]]), Z$ = /* @__PURE__ */ Z({
  name: "STableBody",
  directives: {
    resize: Ip
  },
  setup() {
    const e = oe(), t = Bi(() => []), n = Bi(() => ({}));
    return {
      bodyRef: e,
      bodyClass: t,
      bodyStyle: n
    };
  }
});
const e_ = (e) => (fg("data-v-96177331"), e = e(), pg(), e), t_ = /* @__PURE__ */ e_(() => /* @__PURE__ */ Va(
  "div",
  { class: "s-table-body__inner" },
  null,
  -1
  /* HOISTED */
)), n_ = [
  t_
];
function o_(e, t, n, o, r, i) {
  const a = ku("resize");
  return Dn((Ba(), Zu(
    "div",
    {
      ref: "bodyRef",
      class: $o(["s-table-body", e.bodyClass]),
      style: jr(e.bodyStyle)
    },
    [...n_],
    6
    /* CLASS, STYLE */
  )), [
    [a, void 0, "height"]
  ]);
}
const r_ = /* @__PURE__ */ ri(Z$, [["render", o_], ["__scopeId", "data-v-96177331"], ["__file", "/Users/Shengjie.Zhang4/Documents/code/front/table/src/table/components/body/index.vue"]]), i_ = /* @__PURE__ */ Z({
  name: "SInteralTable",
  setup(e) {
    const {
      spin: t,
      pagination: n
    } = X$(), o = oe(), r = E(() => ""), i = E(() => ""), a = oe(), l = oe(), c = (t == null ? void 0 : t.component) ?? io, s = E(() => Object.assign({}, t == null ? void 0 : t.props, { spinning: !!e.loading })), d = (n == null ? void 0 : n.component) ?? K$, {
      props: u,
      onChange: f
    } = k$();
    return () => {
      const p = wt(d, {
        class: `s-pagination s-pagination-${u.value.horizontal || "right"}`,
        onChange: f,
        onShowSizeChange: f
      }), h = [];
      u.value.vertical === "top" && h.push(p);
      const m = wt(
        "div",
        {
          ref: o,
          class: r.value,
          style: i.value
        },
        [
          // TODO: 塞入表头结构。
          wt(J$, { ref: a }),
          // TODO: 塞入表体的结构
          wt(r_, { ref: l })
        ]
      );
      h.push(m);
      const w = wt(c, { ...s.value }, h);
      return u.value.vertical === "bottom" && h.push(p), [
        w
      ];
    };
  }
}), a_ = /* @__PURE__ */ ri(i_, [["__file", "/Users/Shengjie.Zhang4/Documents/code/front/table/src/table/components/InteralTable.vue"]]), l_ = /* @__PURE__ */ Z({
  name: "STable",
  __name: "Table",
  props: {
    loading: { type: Boolean, required: !1 },
    pagination: { type: [Object, Boolean], required: !1 },
    dataSource: { type: Array, required: !1 }
  },
  setup(e) {
    const t = oe(), n = oe(), o = E(() => [
      "s-table"
    ]);
    return (r, i) => (Ba(), Zu(
      "div",
      {
        ref_key: "rootRef",
        ref: t,
        class: $o(o.value)
      },
      [
        v(
          a_,
          id({
            ref_key: "interalTableRef",
            ref: n
          }, r.$props),
          Tg({
            _: 2
            /* DYNAMIC */
          }, [
            r.$slots.expandIcon ? {
              name: "expandIcon",
              fn: hg(() => [
                Pg(r.$slots, "expandIcon")
              ]),
              key: "0"
            } : void 0
          ]),
          1040
          /* FULL_PROPS, DYNAMIC_SLOTS */
        )
      ],
      2
      /* CLASS */
    ));
  }
}), _a = /* @__PURE__ */ ri(l_, [["__file", "/Users/Shengjie.Zhang4/Documents/code/front/table/src/table/Table.vue"]]), s_ = (e) => {
  e.component(_a.name, _a);
}, b_ = {
  install: s_,
  Table: _a
};
export {
  b_ as default
};
