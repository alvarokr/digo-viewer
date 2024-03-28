(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity)
      fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy)
      fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
class Helper {
  static getGlobal() {
    return window.digoAPI;
  }
  static createGlobal() {
    if (!Helper.getGlobal()) {
      window.digoAPI = {
        asset: {},
        loadFont: (fontName) => {
        },
        forceRefresh: () => {
        },
        getAudioSampleRate: () => 48e3,
        getAudioFrequency: (frequency) => 0,
        getAudioFrequencies: () => new Uint8Array(1024)
      };
    }
  }
  static loadAsset(factory) {
    var _a, _b;
    (_b = (_a = Helper.getGlobal()) == null ? void 0 : _a.asset) == null ? void 0 : _b.onLoad(factory);
  }
  static getCanvas() {
    return document.querySelector("canvas.digo-scene");
  }
  static getAsset(code, onLoad) {
    Helper.createGlobal();
    Helper.getGlobal().asset = {
      onLoad
    };
    new Function(code)();
  }
  static getAssetFromString(assetString, onLoad) {
    Helper.createGlobal();
    Helper.getGlobal().asset = {
      onLoad
    };
    let code = assetString;
    while (code.startsWith("import")) {
      code = code.substring(code.indexOf(";"));
    }
    try {
      new Function(code)();
    } catch (error) {
      onLoad(void 0);
    }
  }
}
var LayoutPosition = /* @__PURE__ */ ((LayoutPosition2) => {
  LayoutPosition2["BELOW"] = "below";
  LayoutPosition2["ABOVE"] = "above";
  return LayoutPosition2;
})(LayoutPosition || {});
var AssetPropertyId = /* @__PURE__ */ ((AssetPropertyId2) => {
  AssetPropertyId2["POSITION"] = "position";
  AssetPropertyId2["SCALE"] = "scale";
  AssetPropertyId2["ROTATION"] = "rotation";
  AssetPropertyId2["SIZE"] = "size";
  AssetPropertyId2["GAP"] = "gap";
  AssetPropertyId2["LAYOUT_POSITION"] = "layoutPosition";
  AssetPropertyId2["Z_INDEX"] = "zIndex";
  return AssetPropertyId2;
})(AssetPropertyId || {});
class Asset {
  constructor() {
    this.labels = /* @__PURE__ */ new Map();
    this.entities = /* @__PURE__ */ new Map();
    this.generalProperties = /* @__PURE__ */ new Map();
    this.entityProperties = /* @__PURE__ */ new Map();
    this.gap = { x: 1, y: 0, z: 0 };
    this.viewerWidth = 0;
    this.viewerHeight = 0;
    this.entitiesPosition = /* @__PURE__ */ new Map();
  }
  getGeneralProperties() {
    return Array.from(this.generalProperties.values());
  }
  getEntityProperties() {
    return Array.from(this.entityProperties.values());
  }
  getLayoutPosition() {
    return "below";
  }
  getZIndex() {
    return 0;
  }
  needsAudio() {
    return false;
  }
  getAudioSampleRate() {
    var _a;
    return ((_a = Helper.getGlobal()) == null ? void 0 : _a.getAudioSampleRate()) || 48e3;
  }
  getAudioFrequency(frequency) {
    var _a;
    return ((_a = Helper.getGlobal()) == null ? void 0 : _a.getAudioFrequency(frequency)) || 0;
  }
  getAudioFrequencies() {
    var _a;
    return ((_a = Helper.getGlobal()) == null ? void 0 : _a.getAudioFrequencies()) || new Uint8Array(1024);
  }
  addProperty(general, property) {
    if (general) {
      this.generalProperties.set(property.id, property);
    } else {
      this.entityProperties.set(property.id, property);
    }
  }
  addPropertyXYZ(general, id, canLinkValues, x2, y2, z2, group) {
    const defaultValue = {
      x: x2 ?? 0,
      y: y2 ?? 0,
      z: z2 ?? 0
    };
    const property = {
      id,
      group,
      canLinkValues,
      type: "multiNumber",
      maximum: 1e3,
      minimum: -1e3,
      decimals: 2,
      step: 0.1,
      keys: ["x", "y", "z"],
      names: ["X", "Y", "Z"],
      defaultValue,
      general
    };
    this.addProperty(general, property);
  }
  addPropertyXY(general, id, x2, y2, group) {
    const defaultValue = {
      x: x2 ?? 0,
      y: y2 ?? 0
    };
    const property = {
      id,
      group,
      type: "multiNumber",
      maximum: 100,
      minimum: -100,
      decimals: 0,
      step: 1,
      keys: ["x", "y"],
      names: ["X", "Y"],
      defaultValue,
      general
    };
    this.addProperty(general, property);
  }
  addPropertySize(general, id, defaultValue, group, other) {
    const property = {
      id,
      group,
      type: "multiNumber",
      maximum: 100,
      minimum: 0,
      decimals: 0,
      step: 1,
      defaultValue,
      general,
      keys: ["w", "h"],
      icons: ["SwapHoriz", "SwapVert"],
      ...other
    };
    this.addProperty(general, property);
  }
  addPropertyNumber(general, id, minimum, maximum, decimals, step, defaultValue, group) {
    const property = {
      id,
      group,
      type: "number",
      maximum,
      minimum,
      decimals,
      step,
      defaultValue,
      general
    };
    this.addProperty(general, property);
  }
  addPropertyString(general, id, defaultValue, group) {
    const property = {
      id,
      group,
      type: "string",
      defaultValue,
      general
    };
    this.addProperty(general, property);
  }
  addPropertyImage(general, id, defaultValue, group) {
    const property = {
      id,
      group,
      type: "image",
      defaultValue,
      general
    };
    this.addProperty(general, property);
  }
  addPropertyFont(general, id, defaultValue, group) {
    const property = {
      id,
      group,
      type: "font",
      defaultValue,
      general
    };
    this.addProperty(general, property);
  }
  addPropertyColor(general, id, defaultValue, group) {
    const property = {
      id,
      group,
      type: "color",
      defaultValue,
      general
    };
    this.addProperty(general, property);
  }
  addPropertyOptions(general, id, defaultValue, keys, icons, group) {
    const property = {
      id,
      group,
      type: "options",
      defaultValue,
      general,
      keys,
      icons
    };
    this.addProperty(general, property);
  }
  addPropertyPosition(general) {
    this.addPropertyXYZ(
      general,
      "position"
      /* POSITION */
    );
  }
  addPropertyScale(general) {
    this.addPropertyXYZ(general, "scale", true, 1, 1, 1);
  }
  addPropertyRotation(general) {
    this.addPropertyXYZ(
      general,
      "rotation"
      /* ROTATION */
    );
  }
  addPropertyGap(general) {
    this.addPropertyXYZ(general, "gap", false, 1);
  }
  addDefaultProperties(general, entity) {
    if (general) {
      this.addPropertyPosition(true);
      this.addPropertyScale(true);
      this.addPropertyRotation(true);
      this.addPropertyGap(true);
    }
    if (entity) {
      this.addPropertyPosition(false);
      this.addPropertyScale(false);
      this.addPropertyRotation(false);
    }
  }
  getScene(extraInfo) {
    return this.scene;
  }
  setScene(scene) {
    this.scene = scene;
  }
  setViewerSize(width, height) {
    this.viewerWidth = width;
    this.viewerHeight = height;
  }
  addLabel(id, language, label) {
    this.labels.set(`${id}-${language}`, label);
  }
  getLabel(id, language) {
    return this.labels.get(`${id}-${language}`) || id;
  }
  createEntity(id) {
  }
  deleteEntity(id) {
    this.entities.delete(id);
  }
  renameEntity(id, newId) {
    const newEntities = /* @__PURE__ */ new Map();
    this.entities.forEach((value, key) => {
      newEntities.set(key === id ? newId : key, value);
    });
    this.entities = newEntities;
  }
  addEntity(id, object, position = { x: 0, y: 0, z: 0 }) {
    this.entities.set(id, object);
    this.entitiesPosition.set(id, position);
  }
  updateEntity(id, object) {
    this.entities.set(id, object);
  }
  getEntity(id) {
    return this.entities.get(id);
  }
  getEntityPosition(id) {
    return this.entitiesPosition.get(id) || { x: 0, y: 0, z: 0 };
  }
  setEntityPosition(id, value) {
    const position = this.getEntityPosition(id);
    this.entitiesPosition.set(id, {
      x: value.x === void 0 ? position.x : value.x,
      y: value.y === void 0 ? position.y : value.y,
      z: value.z === void 0 ? position.z : value.z
    });
  }
  getEntities() {
    return Array.from(this.entities.keys());
  }
  getEntityIndex(entity) {
    return (this.getEntities() || []).findIndex((value) => value === entity);
  }
  updateProperty(entity, property, value, nextUpdate = 0) {
    if (entity) {
      this.updatePropertyCommon(entity, this.getEntity(entity), property, value, nextUpdate);
    } else {
      this.updatePropertyCommon(entity, this.scene, property, value, nextUpdate);
    }
  }
  getProperty(entity, property) {
    if (entity) {
      return this.getPropertyCommon(entity, this.getEntity(entity), property);
    }
    return this.getPropertyCommon(entity, this.scene, property);
  }
  updatePropertyCommon(entity, object, property, value, nextUpdate = 0) {
    if (object) {
      switch (property) {
        case "position":
          this.updatePropertyPosition(entity, object, value, nextUpdate);
          break;
        case "scale":
          this.updatePropertyScale(entity, object, value, nextUpdate);
          break;
        case "rotation":
          this.updatePropertyRotation(entity, object, value, nextUpdate);
          break;
        case "gap":
          this.updatePropertyGap(entity, object, value, nextUpdate);
          break;
      }
    }
  }
  getPropertyCommon(entity, object, property) {
    if (object) {
      switch (property) {
        case "position":
          if (entity) {
            return this.getEntityPosition(entity);
          }
          return this.getPropertyPosition(entity, object);
        case "scale":
          return this.getPropertyScale(entity, object);
        case "rotation":
          return this.getPropertyRotation(entity, object);
        case "gap":
          return this.getPropertyGap(entity, object);
      }
    }
    return void 0;
  }
  updatePropertyPosition(entity, object, value, nextUpdate) {
  }
  updatePropertyRotation(entity, object, value, nextUpdate) {
  }
  updatePropertyScale(entity, object, value, nextUpdate) {
  }
  updatePropertyGap(entity, object, value, nextUpdate) {
    this.gap = { ...value };
    this.entities.forEach((object2, id) => {
      this.updatePropertyCommon(id, object2, "position", this.getPropertyPosition(id, object2), nextUpdate);
    });
  }
  getPropertyPosition(entity, object) {
    return { x: 0, y: 0, z: 0 };
  }
  getPropertyRotation(entity, object) {
    return { x: 0, y: 0, z: 0 };
  }
  getPropertyScale(entity, object) {
    return { x: 0, y: 0, z: 0 };
  }
  getPropertyGap(entity, object) {
    return this.gap;
  }
  tick(parameters) {
  }
}
var n, l, u, i, o, r, f, c = {}, s = [], a = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, h = Array.isArray;
function v(n2, l2) {
  for (var u2 in l2)
    n2[u2] = l2[u2];
  return n2;
}
function p(n2) {
  var l2 = n2.parentNode;
  l2 && l2.removeChild(n2);
}
function y(l2, u2, t) {
  var i2, o2, r2, f2 = {};
  for (r2 in u2)
    "key" == r2 ? i2 = u2[r2] : "ref" == r2 ? o2 = u2[r2] : f2[r2] = u2[r2];
  if (arguments.length > 2 && (f2.children = arguments.length > 3 ? n.call(arguments, 2) : t), "function" == typeof l2 && null != l2.defaultProps)
    for (r2 in l2.defaultProps)
      void 0 === f2[r2] && (f2[r2] = l2.defaultProps[r2]);
  return d(l2, f2, i2, o2, null);
}
function d(n2, t, i2, o2, r2) {
  var f2 = { type: n2, props: t, key: i2, ref: o2, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, constructor: void 0, __v: null == r2 ? ++u : r2, __i: -1, __u: 0 };
  return null == r2 && null != l.vnode && l.vnode(f2), f2;
}
function g(n2) {
  return n2.children;
}
function b(n2, l2) {
  this.props = n2, this.context = l2;
}
function m(n2, l2) {
  if (null == l2)
    return n2.__ ? m(n2.__, n2.__i + 1) : null;
  for (var u2; l2 < n2.__k.length; l2++)
    if (null != (u2 = n2.__k[l2]) && null != u2.__e)
      return u2.__e;
  return "function" == typeof n2.type ? m(n2) : null;
}
function w(n2, u2, t) {
  var i2, o2 = n2.__v, r2 = o2.__e, f2 = n2.__P;
  if (f2)
    return (i2 = v({}, o2)).__v = o2.__v + 1, l.vnode && l.vnode(i2), M(f2, i2, o2, n2.__n, void 0 !== f2.ownerSVGElement, 32 & o2.__u ? [r2] : null, u2, null == r2 ? m(o2) : r2, !!(32 & o2.__u), t), i2.__v = o2.__v, i2.__.__k[i2.__i] = i2, i2.__d = void 0, i2.__e != r2 && k(i2), i2;
}
function k(n2) {
  var l2, u2;
  if (null != (n2 = n2.__) && null != n2.__c) {
    for (n2.__e = n2.__c.base = null, l2 = 0; l2 < n2.__k.length; l2++)
      if (null != (u2 = n2.__k[l2]) && null != u2.__e) {
        n2.__e = n2.__c.base = u2.__e;
        break;
      }
    return k(n2);
  }
}
function x(n2) {
  (!n2.__d && (n2.__d = true) && i.push(n2) && !C.__r++ || o !== l.debounceRendering) && ((o = l.debounceRendering) || r)(C);
}
function C() {
  var n2, u2, t, o2 = [], r2 = [];
  for (i.sort(f); n2 = i.shift(); )
    n2.__d && (t = i.length, u2 = w(n2, o2, r2) || u2, 0 === t || i.length > t ? (j(o2, u2, r2), r2.length = o2.length = 0, u2 = void 0, i.sort(f)) : u2 && l.__c && l.__c(u2, s));
  u2 && j(o2, u2, r2), C.__r = 0;
}
function P(n2, l2, u2, t, i2, o2, r2, f2, e, a2, h2) {
  var v2, p2, y2, d2, _, g2 = t && t.__k || s, b2 = l2.length;
  for (u2.__d = e, S(u2, l2, g2), e = u2.__d, v2 = 0; v2 < b2; v2++)
    null != (y2 = u2.__k[v2]) && "boolean" != typeof y2 && "function" != typeof y2 && (p2 = -1 === y2.__i ? c : g2[y2.__i] || c, y2.__i = v2, M(n2, y2, p2, i2, o2, r2, f2, e, a2, h2), d2 = y2.__e, y2.ref && p2.ref != y2.ref && (p2.ref && N(p2.ref, null, y2), h2.push(y2.ref, y2.__c || d2, y2)), null == _ && null != d2 && (_ = d2), 65536 & y2.__u || p2.__k === y2.__k ? e = $(y2, e, n2) : "function" == typeof y2.type && void 0 !== y2.__d ? e = y2.__d : d2 && (e = d2.nextSibling), y2.__d = void 0, y2.__u &= -196609);
  u2.__d = e, u2.__e = _;
}
function S(n2, l2, u2) {
  var t, i2, o2, r2, f2, e = l2.length, c2 = u2.length, s2 = c2, a2 = 0;
  for (n2.__k = [], t = 0; t < e; t++)
    r2 = t + a2, null != (i2 = n2.__k[t] = null == (i2 = l2[t]) || "boolean" == typeof i2 || "function" == typeof i2 ? null : "string" == typeof i2 || "number" == typeof i2 || "bigint" == typeof i2 || i2.constructor == String ? d(null, i2, null, null, null) : h(i2) ? d(g, { children: i2 }, null, null, null) : void 0 === i2.constructor && i2.__b > 0 ? d(i2.type, i2.props, i2.key, i2.ref ? i2.ref : null, i2.__v) : i2) ? (i2.__ = n2, i2.__b = n2.__b + 1, f2 = I(i2, u2, r2, s2), i2.__i = f2, o2 = null, -1 !== f2 && (s2--, (o2 = u2[f2]) && (o2.__u |= 131072)), null == o2 || null === o2.__v ? (-1 == f2 && a2--, "function" != typeof i2.type && (i2.__u |= 65536)) : f2 !== r2 && (f2 === r2 + 1 ? a2++ : f2 > r2 ? s2 > e - r2 ? a2 += f2 - r2 : a2-- : f2 < r2 ? f2 == r2 - 1 && (a2 = f2 - r2) : a2 = 0, f2 !== t + a2 && (i2.__u |= 65536))) : (o2 = u2[r2]) && null == o2.key && o2.__e && 0 == (131072 & o2.__u) && (o2.__e == n2.__d && (n2.__d = m(o2)), O(o2, o2, false), u2[r2] = null, s2--);
  if (s2)
    for (t = 0; t < c2; t++)
      null != (o2 = u2[t]) && 0 == (131072 & o2.__u) && (o2.__e == n2.__d && (n2.__d = m(o2)), O(o2, o2));
}
function $(n2, l2, u2) {
  var t, i2;
  if ("function" == typeof n2.type) {
    for (t = n2.__k, i2 = 0; t && i2 < t.length; i2++)
      t[i2] && (t[i2].__ = n2, l2 = $(t[i2], l2, u2));
    return l2;
  }
  n2.__e != l2 && (u2.insertBefore(n2.__e, l2 || null), l2 = n2.__e);
  do {
    l2 = l2 && l2.nextSibling;
  } while (null != l2 && 8 === l2.nodeType);
  return l2;
}
function I(n2, l2, u2, t) {
  var i2 = n2.key, o2 = n2.type, r2 = u2 - 1, f2 = u2 + 1, e = l2[u2];
  if (null === e || e && i2 == e.key && o2 === e.type && 0 == (131072 & e.__u))
    return u2;
  if (t > (null != e && 0 == (131072 & e.__u) ? 1 : 0))
    for (; r2 >= 0 || f2 < l2.length; ) {
      if (r2 >= 0) {
        if ((e = l2[r2]) && 0 == (131072 & e.__u) && i2 == e.key && o2 === e.type)
          return r2;
        r2--;
      }
      if (f2 < l2.length) {
        if ((e = l2[f2]) && 0 == (131072 & e.__u) && i2 == e.key && o2 === e.type)
          return f2;
        f2++;
      }
    }
  return -1;
}
function T(n2, l2, u2) {
  "-" === l2[0] ? n2.setProperty(l2, null == u2 ? "" : u2) : n2[l2] = null == u2 ? "" : "number" != typeof u2 || a.test(l2) ? u2 : u2 + "px";
}
function A(n2, l2, u2, t, i2) {
  var o2;
  n:
    if ("style" === l2)
      if ("string" == typeof u2)
        n2.style.cssText = u2;
      else {
        if ("string" == typeof t && (n2.style.cssText = t = ""), t)
          for (l2 in t)
            u2 && l2 in u2 || T(n2.style, l2, "");
        if (u2)
          for (l2 in u2)
            t && u2[l2] === t[l2] || T(n2.style, l2, u2[l2]);
      }
    else if ("o" === l2[0] && "n" === l2[1])
      o2 = l2 !== (l2 = l2.replace(/(PointerCapture)$|Capture$/i, "$1")), l2 = l2.toLowerCase() in n2 ? l2.toLowerCase().slice(2) : l2.slice(2), n2.l || (n2.l = {}), n2.l[l2 + o2] = u2, u2 ? t ? u2.u = t.u : (u2.u = Date.now(), n2.addEventListener(l2, o2 ? L : D, o2)) : n2.removeEventListener(l2, o2 ? L : D, o2);
    else {
      if (i2)
        l2 = l2.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
      else if ("width" !== l2 && "height" !== l2 && "href" !== l2 && "list" !== l2 && "form" !== l2 && "tabIndex" !== l2 && "download" !== l2 && "rowSpan" !== l2 && "colSpan" !== l2 && "role" !== l2 && l2 in n2)
        try {
          n2[l2] = null == u2 ? "" : u2;
          break n;
        } catch (n3) {
        }
      "function" == typeof u2 || (null == u2 || false === u2 && "-" !== l2[4] ? n2.removeAttribute(l2) : n2.setAttribute(l2, u2));
    }
}
function D(n2) {
  if (this.l) {
    var u2 = this.l[n2.type + false];
    if (n2.t) {
      if (n2.t <= u2.u)
        return;
    } else
      n2.t = Date.now();
    return u2(l.event ? l.event(n2) : n2);
  }
}
function L(n2) {
  if (this.l)
    return this.l[n2.type + true](l.event ? l.event(n2) : n2);
}
function M(n2, u2, t, i2, o2, r2, f2, e, c2, s2) {
  var a2, p2, y2, d2, _, m2, w2, k2, x2, C2, S2, $2, H, I2, T2, A2 = u2.type;
  if (void 0 !== u2.constructor)
    return null;
  128 & t.__u && (c2 = !!(32 & t.__u), r2 = [e = u2.__e = t.__e]), (a2 = l.__b) && a2(u2);
  n:
    if ("function" == typeof A2)
      try {
        if (k2 = u2.props, x2 = (a2 = A2.contextType) && i2[a2.__c], C2 = a2 ? x2 ? x2.props.value : a2.__ : i2, t.__c ? w2 = (p2 = u2.__c = t.__c).__ = p2.__E : ("prototype" in A2 && A2.prototype.render ? u2.__c = p2 = new A2(k2, C2) : (u2.__c = p2 = new b(k2, C2), p2.constructor = A2, p2.render = q), x2 && x2.sub(p2), p2.props = k2, p2.state || (p2.state = {}), p2.context = C2, p2.__n = i2, y2 = p2.__d = true, p2.__h = [], p2._sb = []), null == p2.__s && (p2.__s = p2.state), null != A2.getDerivedStateFromProps && (p2.__s == p2.state && (p2.__s = v({}, p2.__s)), v(p2.__s, A2.getDerivedStateFromProps(k2, p2.__s))), d2 = p2.props, _ = p2.state, p2.__v = u2, y2)
          null == A2.getDerivedStateFromProps && null != p2.componentWillMount && p2.componentWillMount(), null != p2.componentDidMount && p2.__h.push(p2.componentDidMount);
        else {
          if (null == A2.getDerivedStateFromProps && k2 !== d2 && null != p2.componentWillReceiveProps && p2.componentWillReceiveProps(k2, C2), !p2.__e && (null != p2.shouldComponentUpdate && false === p2.shouldComponentUpdate(k2, p2.__s, C2) || u2.__v === t.__v)) {
            for (u2.__v !== t.__v && (p2.props = k2, p2.state = p2.__s, p2.__d = false), u2.__e = t.__e, u2.__k = t.__k, u2.__k.forEach(function(n3) {
              n3 && (n3.__ = u2);
            }), S2 = 0; S2 < p2._sb.length; S2++)
              p2.__h.push(p2._sb[S2]);
            p2._sb = [], p2.__h.length && f2.push(p2);
            break n;
          }
          null != p2.componentWillUpdate && p2.componentWillUpdate(k2, p2.__s, C2), null != p2.componentDidUpdate && p2.__h.push(function() {
            p2.componentDidUpdate(d2, _, m2);
          });
        }
        if (p2.context = C2, p2.props = k2, p2.__P = n2, p2.__e = false, $2 = l.__r, H = 0, "prototype" in A2 && A2.prototype.render) {
          for (p2.state = p2.__s, p2.__d = false, $2 && $2(u2), a2 = p2.render(p2.props, p2.state, p2.context), I2 = 0; I2 < p2._sb.length; I2++)
            p2.__h.push(p2._sb[I2]);
          p2._sb = [];
        } else
          do {
            p2.__d = false, $2 && $2(u2), a2 = p2.render(p2.props, p2.state, p2.context), p2.state = p2.__s;
          } while (p2.__d && ++H < 25);
        p2.state = p2.__s, null != p2.getChildContext && (i2 = v(v({}, i2), p2.getChildContext())), y2 || null == p2.getSnapshotBeforeUpdate || (m2 = p2.getSnapshotBeforeUpdate(d2, _)), P(n2, h(T2 = null != a2 && a2.type === g && null == a2.key ? a2.props.children : a2) ? T2 : [T2], u2, t, i2, o2, r2, f2, e, c2, s2), p2.base = u2.__e, u2.__u &= -161, p2.__h.length && f2.push(p2), w2 && (p2.__E = p2.__ = null);
      } catch (n3) {
        u2.__v = null, c2 || null != r2 ? (u2.__e = e, u2.__u |= c2 ? 160 : 32, r2[r2.indexOf(e)] = null) : (u2.__e = t.__e, u2.__k = t.__k), l.__e(n3, u2, t);
      }
    else
      null == r2 && u2.__v === t.__v ? (u2.__k = t.__k, u2.__e = t.__e) : u2.__e = z(t.__e, u2, t, i2, o2, r2, f2, c2, s2);
  (a2 = l.diffed) && a2(u2);
}
function j(n2, u2, t) {
  for (var i2 = 0; i2 < t.length; i2++)
    N(t[i2], t[++i2], t[++i2]);
  l.__c && l.__c(u2, n2), n2.some(function(u3) {
    try {
      n2 = u3.__h, u3.__h = [], n2.some(function(n3) {
        n3.call(u3);
      });
    } catch (n3) {
      l.__e(n3, u3.__v);
    }
  });
}
function z(l2, u2, t, i2, o2, r2, f2, e, s2) {
  var a2, v2, y2, d2, _, g2, b2, w2 = t.props, k2 = u2.props, x2 = u2.type;
  if ("svg" === x2 && (o2 = true), null != r2) {
    for (a2 = 0; a2 < r2.length; a2++)
      if ((_ = r2[a2]) && "setAttribute" in _ == !!x2 && (x2 ? _.localName === x2 : 3 === _.nodeType)) {
        l2 = _, r2[a2] = null;
        break;
      }
  }
  if (null == l2) {
    if (null === x2)
      return document.createTextNode(k2);
    l2 = o2 ? document.createElementNS("http://www.w3.org/2000/svg", x2) : document.createElement(x2, k2.is && k2), r2 = null, e = false;
  }
  if (null === x2)
    w2 === k2 || e && l2.data === k2 || (l2.data = k2);
  else {
    if (r2 = r2 && n.call(l2.childNodes), w2 = t.props || c, !e && null != r2)
      for (w2 = {}, a2 = 0; a2 < l2.attributes.length; a2++)
        w2[(_ = l2.attributes[a2]).name] = _.value;
    for (a2 in w2)
      _ = w2[a2], "children" == a2 || ("dangerouslySetInnerHTML" == a2 ? y2 = _ : "key" === a2 || a2 in k2 || A(l2, a2, null, _, o2));
    for (a2 in k2)
      _ = k2[a2], "children" == a2 ? d2 = _ : "dangerouslySetInnerHTML" == a2 ? v2 = _ : "value" == a2 ? g2 = _ : "checked" == a2 ? b2 = _ : "key" === a2 || e && "function" != typeof _ || w2[a2] === _ || A(l2, a2, _, w2[a2], o2);
    if (v2)
      e || y2 && (v2.__html === y2.__html || v2.__html === l2.innerHTML) || (l2.innerHTML = v2.__html), u2.__k = [];
    else if (y2 && (l2.innerHTML = ""), P(l2, h(d2) ? d2 : [d2], u2, t, i2, o2 && "foreignObject" !== x2, r2, f2, r2 ? r2[0] : t.__k && m(t, 0), e, s2), null != r2)
      for (a2 = r2.length; a2--; )
        null != r2[a2] && p(r2[a2]);
    e || (a2 = "value", void 0 !== g2 && (g2 !== l2[a2] || "progress" === x2 && !g2 || "option" === x2 && g2 !== w2[a2]) && A(l2, a2, g2, w2[a2], false), a2 = "checked", void 0 !== b2 && b2 !== l2[a2] && A(l2, a2, b2, w2[a2], false));
  }
  return l2;
}
function N(n2, u2, t) {
  try {
    "function" == typeof n2 ? n2(u2) : n2.current = u2;
  } catch (n3) {
    l.__e(n3, t);
  }
}
function O(n2, u2, t) {
  var i2, o2;
  if (l.unmount && l.unmount(n2), (i2 = n2.ref) && (i2.current && i2.current !== n2.__e || N(i2, null, u2)), null != (i2 = n2.__c)) {
    if (i2.componentWillUnmount)
      try {
        i2.componentWillUnmount();
      } catch (n3) {
        l.__e(n3, u2);
      }
    i2.base = i2.__P = null, n2.__c = void 0;
  }
  if (i2 = n2.__k)
    for (o2 = 0; o2 < i2.length; o2++)
      i2[o2] && O(i2[o2], u2, t || "function" != typeof n2.type);
  t || null == n2.__e || p(n2.__e), n2.__ = n2.__e = n2.__d = void 0;
}
function q(n2, l2, u2) {
  return this.constructor(n2, u2);
}
function B(u2, t, i2) {
  var o2, r2, f2, e;
  l.__ && l.__(u2, t), r2 = (o2 = "function" == typeof i2) ? null : i2 && i2.__k || t.__k, f2 = [], e = [], M(t, u2 = (!o2 && i2 || t).__k = y(g, null, [u2]), r2 || c, c, void 0 !== t.ownerSVGElement, !o2 && i2 ? [i2] : r2 ? null : t.firstChild ? n.call(t.childNodes) : null, f2, !o2 && i2 ? i2 : r2 ? r2.__e : t.firstChild, o2, e), u2.__d = void 0, j(f2, u2, e);
}
n = s.slice, l = { __e: function(n2, l2, u2, t) {
  for (var i2, o2, r2; l2 = l2.__; )
    if ((i2 = l2.__c) && !i2.__)
      try {
        if ((o2 = i2.constructor) && null != o2.getDerivedStateFromError && (i2.setState(o2.getDerivedStateFromError(n2)), r2 = i2.__d), null != i2.componentDidCatch && (i2.componentDidCatch(n2, t || {}), r2 = i2.__d), r2)
          return i2.__E = i2;
      } catch (l3) {
        n2 = l3;
      }
  throw n2;
} }, u = 0, b.prototype.setState = function(n2, l2) {
  var u2;
  u2 = null != this.__s && this.__s !== this.state ? this.__s : this.__s = v({}, this.state), "function" == typeof n2 && (n2 = n2(v({}, u2), this.props)), n2 && v(u2, n2), null != n2 && this.__v && (l2 && this._sb.push(l2), x(this));
}, b.prototype.forceUpdate = function(n2) {
  this.__v && (this.__e = true, n2 && this.__h.push(n2), x(this));
}, b.prototype.render = g, i = [], r = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, f = function(n2, l2) {
  return n2.__v.__b - l2.__v.__b;
}, C.__r = 0;
function DigoAssetHTMLComponent({ assetRenderer }) {
  return assetRenderer();
}
class DigoAssetHTML extends Asset {
  constructor(properties) {
    super();
    this.htmlSceneElement = null;
    this.needsRender = true;
    this.layoutPosition = LayoutPosition.BELOW;
    this.zIndex = 0;
    this.images = /* @__PURE__ */ new Map();
    this.childProperties = JSON.parse(JSON.stringify(properties));
    this.addPropertyOptions(true, AssetPropertyId.LAYOUT_POSITION, "below", ["below", "above"], ["MoveDown", "MoveUp"]);
    this.addPropertyNumber(true, AssetPropertyId.Z_INDEX, -100, 100, 0, 1, this.zIndex);
    this.initialize(this.childProperties);
    setInterval(() => {
      if (this.htmlSceneElement && this.needsRender) {
        this.needsRender = false;
        this.render();
      }
    }, 1e3 / 60);
  }
  forceRender() {
    this.needsRender = true;
  }
  deleteEntity(id) {
    super.deleteEntity(id);
    this.forceRender();
  }
  getCSSColor(value) {
    return `#${value.toString(16)}`;
  }
  getFontStyles(font, width) {
    if (font) {
      return {
        fontFamily: font.family,
        fontSize: width * font.size / 100,
        fontWeight: font.weight,
        fontStyle: font.italic ? "italic" : "normal",
        fontVariantNumeric: "tabular-nums",
        color: this.getCSSColor(font.color ?? 0)
      };
    }
    return {};
  }
  getScene(elementId) {
    this.htmlSceneElement = document.getElementById(elementId);
    this.forceRender();
    return this.htmlSceneElement;
  }
  setViewerSize(width, height) {
    super.setViewerSize(width, height);
    this.childProperties.viewerWidth = width;
    this.childProperties.viewerHeight = height;
    this.forceRender();
  }
  getLayoutPosition() {
    return this.layoutPosition;
  }
  getZIndex() {
    return this.zIndex;
  }
  async loadImage(propertyId, id, value) {
    var _a;
    if (value) {
      this.images.set(propertyId, value);
    } else if (id) {
      (_a = Helper.getGlobal()) == null ? void 0 : _a.loadImage(id).then((imageData) => {
        this.images.set(propertyId, imageData);
        this.forceRender();
      });
    } else {
      this.images.set(propertyId, "");
    }
  }
  getImage(propertyId) {
    return this.images.get(propertyId);
  }
  addPropertyImage(general, id, defaultValue, group) {
    super.addPropertyImage(general, id, defaultValue, group);
    this.loadImage(id, "", defaultValue);
  }
  updateProperty(entity, property, value, nextUpdate = 0) {
    var _a, _b, _c, _d;
    if (property === AssetPropertyId.LAYOUT_POSITION) {
      this.layoutPosition = value;
      (_a = Helper.getGlobal()) == null ? void 0 : _a.forceRefresh();
    }
    if (property === AssetPropertyId.Z_INDEX) {
      this.zIndex = value;
      (_b = Helper.getGlobal()) == null ? void 0 : _b.forceRefresh();
    } else {
      const splittedProperties = property.split("/");
      let currentProperty = entity ? this.getEntity(entity) : this.childProperties.general;
      splittedProperties.forEach((id, index) => {
        if (currentProperty) {
          if (index + 1 === splittedProperties.length) {
            if (typeof value === "object") {
              currentProperty[id] = { ...currentProperty[id], ...value };
            } else {
              currentProperty[id] = value;
            }
          } else {
            currentProperty = currentProperty[id];
          }
        }
      });
      if (property.endsWith("/family") && property.toLowerCase().indexOf("font") !== 0) {
        (_c = Helper.getGlobal()) == null ? void 0 : _c.loadFont(value);
      } else if (value && value.family && property.toLowerCase().indexOf("font") !== 0) {
        (_d = Helper.getGlobal()) == null ? void 0 : _d.loadFont(value.family);
      }
      if (this.images.has(property)) {
        this.loadImage(property, value);
      }
      this.forceRender();
    }
  }
  getProperty(entity, property) {
    if (property === AssetPropertyId.LAYOUT_POSITION) {
      return this.layoutPosition;
    }
    if (property === AssetPropertyId.Z_INDEX) {
      return this.zIndex;
    }
    const splittedProperties = property.split("/");
    let currentProperty = entity ? this.getEntity(entity) : this.childProperties.general;
    for (let i2 = 0; i2 < splittedProperties.length; i2++) {
      if (currentProperty) {
        if (i2 + 1 === splittedProperties.length) {
          return currentProperty[splittedProperties[i2]];
        }
        currentProperty = currentProperty[splittedProperties[i2]];
      }
    }
    return 0;
  }
}
const defaultProperties = {
  viewerWidth: 0,
  viewerHeight: 0,
  general: {
    color: 13421772,
    image: void 0,
    imageOpacity: 100,
    position: {
      x: 0,
      y: 0
    },
    size: {
      w: 100,
      h: 100
    }
  }
};
class BasicBackground extends DigoAssetHTML {
  constructor(entities) {
    super(defaultProperties);
    this.image = "";
  }
  initialize(properties) {
    this.properties = properties;
    this.addLabel("color", "en", "Color");
    this.addLabel("color", "es", "Color");
    this.addLabel("image", "en", "Image");
    this.addLabel("image", "es", "Imagen");
    this.addLabel("imageOpacity", "en", "Image opacity");
    this.addLabel("imageOpacity", "es", "Opacidad de la imagen");
    this.addPropertyXY(true, AssetPropertyId.POSITION, this.properties.general.position.x, this.properties.general.position.y);
    this.addPropertySize(true, AssetPropertyId.SIZE, { w: this.properties.general.size.w, h: this.properties.general.size.h });
    this.addPropertyColor(true, "color", this.properties.general.color);
    this.addPropertyImage(true, "image", this.properties.general.image);
    this.addPropertyNumber(true, "imageOpacity", 0, 100, 0, 1, this.properties.general.imageOpacity);
  }
  render() {
    B(/* @__PURE__ */ y(DigoAssetHTMLComponent, { assetRenderer: () => this.renderComponent() }), this.htmlSceneElement);
  }
  renderComponent() {
    const width = `${this.properties.viewerWidth * (this.properties.general.size.w / 100)}px`;
    const height = `${this.properties.viewerHeight * (this.properties.general.size.h / 100)}px`;
    return /* @__PURE__ */ y("div", { style: {
      position: "relative",
      backgroundColor: this.getCSSColor(this.properties.general.color),
      opacity: this.properties.general.imageOpacity / 100,
      width,
      height,
      left: this.properties.viewerWidth * (this.properties.general.position.x / 100),
      top: this.properties.viewerHeight * (this.properties.general.position.y / 100),
      backgroundImage: `url(data:image;base64,${this.getImage("image")})`,
      backgroundSize: `${width} ${height}`
    } });
  }
}
const digoAssetData = {
  info: {
    name: {
      en: "Basic background",
      es: "Fondo básico"
    },
    category: "legends",
    icon: "Panorama",
    vendor: "Digo",
    license: "MIT",
    version: "1.0",
    module: {
      type: "html",
      version: "5"
    }
  },
  create: (entities) => {
    return new BasicBackground(entities || []);
  }
};
console.log("Basic background asset loaded");
Helper.loadAsset(digoAssetData);
