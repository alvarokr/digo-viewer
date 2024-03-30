import { M as MathUtils, a as Material, U as Uniform, C as Color, S as Scene, I as IcosahedronGeometry, b as MeshPhysicalMaterial, c as MeshDepthMaterial, R as RGBADepthPacking, d as Mesh } from "./three.js";
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
        getAudioFrequencyPower: (frequency) => 0,
        getAudioFrequenciesPower: () => new Uint8Array(1024)
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
const ENTITY_PROPERTY = false;
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
    return ((_a = Helper.getGlobal()) == null ? void 0 : _a.getAudioFrequencyPower(frequency)) || 0;
  }
  getAudioFrequencies() {
    var _a;
    return ((_a = Helper.getGlobal()) == null ? void 0 : _a.getAudioFrequenciesPower()) || new Uint8Array(1024);
  }
  addProperty(general, property) {
    if (general) {
      this.generalProperties.set(property.id, property);
    } else {
      this.entityProperties.set(property.id, property);
    }
  }
  addPropertyXYZ(general, id, canLinkValues, x, y, z, group) {
    const defaultValue = {
      x: x ?? 0,
      y: y ?? 0,
      z: z ?? 0
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
  addPropertyXY(general, id, x, y, group) {
    const defaultValue = {
      x: x ?? 0,
      y: y ?? 0
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
  addPropertyBoolean(general, id, defaultValue, group) {
    const property = {
      id,
      group,
      type: "boolean",
      defaultValue: defaultValue ?? false,
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
class DigoAssetThree extends Asset {
  getScene() {
    return super.getScene();
  }
  setScene(scene) {
    return super.setScene(scene);
  }
  deleteEntity(id) {
    this.getScene().remove(this.getEntity(id));
    super.deleteEntity(id);
  }
  updateXYZ(entity, object, property, value, nextUpdate) {
    if (object[property]) {
      const x = value.x ?? object[property].x;
      const y = value.y ?? object[property].y;
      const z = value.z ?? object[property].z;
      object[property].x = x;
      object[property].y = y;
      object[property].z = z;
    }
  }
  getXYZ(entity, object, property) {
    var _a, _b, _c;
    const result = {
      x: ((_a = object[property]) == null ? void 0 : _a.x) ?? 0,
      y: ((_b = object[property]) == null ? void 0 : _b.y) ?? 0,
      z: ((_c = object[property]) == null ? void 0 : _c.z) ?? 0
    };
    if (entity && property === AssetPropertyId.POSITION) {
      result.x -= this.gap.x;
      result.y -= this.gap.y;
      result.z -= this.gap.z;
    }
    return result;
  }
  updatePropertyPosition(entity, object, value, nextUpdate) {
    if (entity) {
      const finalPosition = {
        x: value.x === void 0 ? void 0 : value.x + this.getEntityIndex(entity) * this.gap.x,
        y: value.y === void 0 ? void 0 : value.y + this.getEntityIndex(entity) * this.gap.y,
        z: value.z === void 0 ? void 0 : value.z + this.getEntityIndex(entity) * this.gap.z
      };
      this.setEntityPosition(entity, value);
      this.updateXYZ(entity, object, AssetPropertyId.POSITION, finalPosition, nextUpdate);
    } else {
      this.updateXYZ(entity, object, AssetPropertyId.POSITION, value, nextUpdate);
    }
  }
  updatePropertyRotation(entity, object, value, nextUpdate) {
    this.updateXYZ(entity, object, AssetPropertyId.ROTATION, value, nextUpdate);
  }
  updatePropertyScale(entity, object, value, nextUpdate) {
    this.updateXYZ(entity, object, AssetPropertyId.SCALE, value, nextUpdate);
  }
  updatePropertyColor(entity, object, color) {
    var _a;
    if ((_a = object == null ? void 0 : object.material) == null ? void 0 : _a.color) {
      object.material.color.setHex(color >>> 8);
    }
  }
  getPropertyPosition(entity, object) {
    if (entity) {
      const xyz = { ...this.getEntityPosition(entity) ?? { x: 0, y: 0, z: 0 } };
      xyz.x = xyz.x ?? 0;
      xyz.y = xyz.y ?? 0;
      xyz.z = xyz.z ?? 0;
      return xyz;
    }
    return this.getXYZ(entity, object, AssetPropertyId.POSITION);
  }
  getPropertyRotation(entity, object) {
    return this.getXYZ(entity, object, AssetPropertyId.ROTATION);
  }
  getPropertyScale(entity, object) {
    return this.getXYZ(entity, object, AssetPropertyId.SCALE);
  }
  getPropertyColor(entity, object) {
    var _a, _b;
    return Number.parseInt(`${(_b = (_a = object == null ? void 0 : object.material) == null ? void 0 : _a.color) == null ? void 0 : _b.getHex().toString(16)}ff`, 16);
  }
  tick(parameters) {
  }
}
class AssetBase extends DigoAssetThree {
  constructor() {
    super();
  }
}
var vertex_default = "uniform float uTime;\nuniform float uPositionFrequency;\nuniform float uTimeFrequency;\nuniform float uStrength;\nuniform float uWarpPositionFrequency;\nuniform float uWarpTimeFrequency;\nuniform float uWarpStrength;\n\nattribute vec4 tangent;\n\nvarying float vWobble;\n\nvec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}\nfloat permute(float x){return floor(mod(((x*34.0)+1.0)*x, 289.0));}\nvec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}\nfloat taylorInvSqrt(float r){return 1.79284291400159 - 0.85373472095314 * r;}\n\nvec4 grad4(float j, vec4 ip)\n{\n  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);\n  vec4 p,s;\n\n  p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;\n  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);\n  s = vec4(lessThan(p, vec4(0.0)));\n  p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www; \n\n  return p;\n}\n\nfloat simplexNoise4d(vec4 v)\n{\n  const vec2  C = vec2( 0.138196601125010504,  \n                        0.309016994374947451); \n  \n  vec4 i  = floor(v + dot(v, C.yyyy) );\n  vec4 x0 = v -   i + dot(i, C.xxxx);\n\n  \n\n  \n  vec4 i0;\n\n  vec3 isX = step( x0.yzw, x0.xxx );\n  vec3 isYZ = step( x0.zww, x0.yyz );\n  \n  i0.x = isX.x + isX.y + isX.z;\n  i0.yzw = 1.0 - isX;\n\n  \n  i0.y += isYZ.x + isYZ.y;\n  i0.zw += 1.0 - isYZ.xy;\n\n  i0.z += isYZ.z;\n  i0.w += 1.0 - isYZ.z;\n\n  \n  vec4 i3 = clamp( i0, 0.0, 1.0 );\n  vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );\n  vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );\n\n  \n  vec4 x1 = x0 - i1 + 1.0 * C.xxxx;\n  vec4 x2 = x0 - i2 + 2.0 * C.xxxx;\n  vec4 x3 = x0 - i3 + 3.0 * C.xxxx;\n  vec4 x4 = x0 - 1.0 + 4.0 * C.xxxx;\n\n  \n  i = mod(i, 289.0); \n  float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);\n  vec4 j1 = permute( permute( permute( permute (\n             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))\n           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))\n           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))\n           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));\n  \n  \n  \n\n  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;\n\n  vec4 p0 = grad4(j0,   ip);\n  vec4 p1 = grad4(j1.x, ip);\n  vec4 p2 = grad4(j1.y, ip);\n  vec4 p3 = grad4(j1.z, ip);\n  vec4 p4 = grad4(j1.w, ip);\n\n  \n  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n  p0 *= norm.x;\n  p1 *= norm.y;\n  p2 *= norm.z;\n  p3 *= norm.w;\n  p4 *= taylorInvSqrt(dot(p4,p4));\n\n  \n  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);\n  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);\n  m0 = m0 * m0;\n  m1 = m1 * m1;\n  return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))\n               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;\n\n}\n\nfloat getWobble(vec3 position)\n{\n    vec3 warpedPosition = position;\n    warpedPosition += simplexNoise4d(\n        vec4(\n            position * uWarpPositionFrequency,\n            uTime * uWarpTimeFrequency\n        )\n    ) * uWarpStrength;\n\n    return simplexNoise4d(vec4(\n        warpedPosition * uPositionFrequency, \n        uTime * uTimeFrequency         \n    )) * uStrength;\n}\n\nvoid main()\n{\n    vec3 biTangent = cross(normal, tangent.xyz);\n\n    \n    float shift = 0.01;\n    vec3 positionA = csm_Position + tangent.xyz * shift;\n    vec3 positionB = csm_Position + biTangent * shift;\n\n    \n    float wobble = getWobble(csm_Position);\n    csm_Position += wobble * normal;\n    positionA    += getWobble(positionA) * normal;\n    positionB    += getWobble(positionB) * normal;\n\n    \n    vec3 toA = normalize(positionA - csm_Position);\n    vec3 toB = normalize(positionB - csm_Position);\n    csm_Normal = cross(toA, toB);\n\n    \n    vWobble = wobble / uStrength;\n}";
var fragment_default = "uniform vec3 uColorA;\nuniform vec3 uColorB;\n\nvarying float vWobble;\n\nvoid main()\n{\n    float colorMix = smoothstep(- 1.0, 1.0, vWobble);\n    csm_DiffuseColor.rgb = mix(uColorA, uColorB, colorMix);\n\n    \n    \n    \n\n    \n    csm_Roughness = 1.0 - colorMix;\n}";
function commonjsRequire(path) {
  throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var object_hashExports = {};
var object_hash = {
  get exports() {
    return object_hashExports;
  },
  set exports(v) {
    object_hashExports = v;
  }
};
(function(module, exports) {
  !function(e) {
    module.exports = e();
  }(function() {
    return function r(o, i, u) {
      function s(n, e2) {
        if (!i[n]) {
          if (!o[n]) {
            var t = "function" == typeof commonjsRequire && commonjsRequire;
            if (!e2 && t)
              return t(n, true);
            if (a)
              return a(n, true);
            throw new Error("Cannot find module '" + n + "'");
          }
          e2 = i[n] = { exports: {} };
          o[n][0].call(e2.exports, function(e3) {
            var t2 = o[n][1][e3];
            return s(t2 || e3);
          }, e2, e2.exports, r, o, i, u);
        }
        return i[n].exports;
      }
      for (var a = "function" == typeof commonjsRequire && commonjsRequire, e = 0; e < u.length; e++)
        s(u[e]);
      return s;
    }({ 1: [function(w, b, m) {
      !function(e, n, s, c, d, h, p, g, y) {
        var r = w("crypto");
        function t(e2, t2) {
          t2 = u(e2, t2);
          var n2;
          return void 0 === (n2 = "passthrough" !== t2.algorithm ? r.createHash(t2.algorithm) : new l()).write && (n2.write = n2.update, n2.end = n2.update), f(t2, n2).dispatch(e2), n2.update || n2.end(""), n2.digest ? n2.digest("buffer" === t2.encoding ? void 0 : t2.encoding) : (e2 = n2.read(), "buffer" !== t2.encoding ? e2.toString(t2.encoding) : e2);
        }
        (m = b.exports = t).sha1 = function(e2) {
          return t(e2);
        }, m.keys = function(e2) {
          return t(e2, { excludeValues: true, algorithm: "sha1", encoding: "hex" });
        }, m.MD5 = function(e2) {
          return t(e2, { algorithm: "md5", encoding: "hex" });
        }, m.keysMD5 = function(e2) {
          return t(e2, { algorithm: "md5", encoding: "hex", excludeValues: true });
        };
        var o = r.getHashes ? r.getHashes().slice() : ["sha1", "md5"], i = (o.push("passthrough"), ["buffer", "hex", "binary", "base64"]);
        function u(e2, t2) {
          var n2 = {};
          if (n2.algorithm = (t2 = t2 || {}).algorithm || "sha1", n2.encoding = t2.encoding || "hex", n2.excludeValues = !!t2.excludeValues, n2.algorithm = n2.algorithm.toLowerCase(), n2.encoding = n2.encoding.toLowerCase(), n2.ignoreUnknown = true === t2.ignoreUnknown, n2.respectType = false !== t2.respectType, n2.respectFunctionNames = false !== t2.respectFunctionNames, n2.respectFunctionProperties = false !== t2.respectFunctionProperties, n2.unorderedArrays = true === t2.unorderedArrays, n2.unorderedSets = false !== t2.unorderedSets, n2.unorderedObjects = false !== t2.unorderedObjects, n2.replacer = t2.replacer || void 0, n2.excludeKeys = t2.excludeKeys || void 0, void 0 === e2)
            throw new Error("Object argument required.");
          for (var r2 = 0; r2 < o.length; ++r2)
            o[r2].toLowerCase() === n2.algorithm.toLowerCase() && (n2.algorithm = o[r2]);
          if (-1 === o.indexOf(n2.algorithm))
            throw new Error('Algorithm "' + n2.algorithm + '"  not supported. supported values: ' + o.join(", "));
          if (-1 === i.indexOf(n2.encoding) && "passthrough" !== n2.algorithm)
            throw new Error('Encoding "' + n2.encoding + '"  not supported. supported values: ' + i.join(", "));
          return n2;
        }
        function a(e2) {
          if ("function" == typeof e2)
            return null != /^function\s+\w*\s*\(\s*\)\s*{\s+\[native code\]\s+}$/i.exec(Function.prototype.toString.call(e2));
        }
        function f(o2, t2, i2) {
          i2 = i2 || [];
          function u2(e2) {
            return t2.update ? t2.update(e2, "utf8") : t2.write(e2, "utf8");
          }
          return { dispatch: function(e2) {
            return this["_" + (null === (e2 = o2.replacer ? o2.replacer(e2) : e2) ? "null" : typeof e2)](e2);
          }, _object: function(t3) {
            var n2, e2 = Object.prototype.toString.call(t3), r2 = /\[object (.*)\]/i.exec(e2);
            r2 = (r2 = r2 ? r2[1] : "unknown:[" + e2 + "]").toLowerCase();
            if (0 <= (e2 = i2.indexOf(t3)))
              return this.dispatch("[CIRCULAR:" + e2 + "]");
            if (i2.push(t3), void 0 !== s && s.isBuffer && s.isBuffer(t3))
              return u2("buffer:"), u2(t3);
            if ("object" === r2 || "function" === r2 || "asyncfunction" === r2)
              return e2 = Object.keys(t3), o2.unorderedObjects && (e2 = e2.sort()), false === o2.respectType || a(t3) || e2.splice(0, 0, "prototype", "__proto__", "constructor"), o2.excludeKeys && (e2 = e2.filter(function(e3) {
                return !o2.excludeKeys(e3);
              })), u2("object:" + e2.length + ":"), n2 = this, e2.forEach(function(e3) {
                n2.dispatch(e3), u2(":"), o2.excludeValues || n2.dispatch(t3[e3]), u2(",");
              });
            if (!this["_" + r2]) {
              if (o2.ignoreUnknown)
                return u2("[" + r2 + "]");
              throw new Error('Unknown object type "' + r2 + '"');
            }
            this["_" + r2](t3);
          }, _array: function(e2, t3) {
            t3 = void 0 !== t3 ? t3 : false !== o2.unorderedArrays;
            var n2 = this;
            if (u2("array:" + e2.length + ":"), !t3 || e2.length <= 1)
              return e2.forEach(function(e3) {
                return n2.dispatch(e3);
              });
            var r2 = [], t3 = e2.map(function(e3) {
              var t4 = new l(), n3 = i2.slice();
              return f(o2, t4, n3).dispatch(e3), r2 = r2.concat(n3.slice(i2.length)), t4.read().toString();
            });
            return i2 = i2.concat(r2), t3.sort(), this._array(t3, false);
          }, _date: function(e2) {
            return u2("date:" + e2.toJSON());
          }, _symbol: function(e2) {
            return u2("symbol:" + e2.toString());
          }, _error: function(e2) {
            return u2("error:" + e2.toString());
          }, _boolean: function(e2) {
            return u2("bool:" + e2.toString());
          }, _string: function(e2) {
            u2("string:" + e2.length + ":"), u2(e2.toString());
          }, _function: function(e2) {
            u2("fn:"), a(e2) ? this.dispatch("[native]") : this.dispatch(e2.toString()), false !== o2.respectFunctionNames && this.dispatch("function-name:" + String(e2.name)), o2.respectFunctionProperties && this._object(e2);
          }, _number: function(e2) {
            return u2("number:" + e2.toString());
          }, _xml: function(e2) {
            return u2("xml:" + e2.toString());
          }, _null: function() {
            return u2("Null");
          }, _undefined: function() {
            return u2("Undefined");
          }, _regexp: function(e2) {
            return u2("regex:" + e2.toString());
          }, _uint8array: function(e2) {
            return u2("uint8array:"), this.dispatch(Array.prototype.slice.call(e2));
          }, _uint8clampedarray: function(e2) {
            return u2("uint8clampedarray:"), this.dispatch(Array.prototype.slice.call(e2));
          }, _int8array: function(e2) {
            return u2("int8array:"), this.dispatch(Array.prototype.slice.call(e2));
          }, _uint16array: function(e2) {
            return u2("uint16array:"), this.dispatch(Array.prototype.slice.call(e2));
          }, _int16array: function(e2) {
            return u2("int16array:"), this.dispatch(Array.prototype.slice.call(e2));
          }, _uint32array: function(e2) {
            return u2("uint32array:"), this.dispatch(Array.prototype.slice.call(e2));
          }, _int32array: function(e2) {
            return u2("int32array:"), this.dispatch(Array.prototype.slice.call(e2));
          }, _float32array: function(e2) {
            return u2("float32array:"), this.dispatch(Array.prototype.slice.call(e2));
          }, _float64array: function(e2) {
            return u2("float64array:"), this.dispatch(Array.prototype.slice.call(e2));
          }, _arraybuffer: function(e2) {
            return u2("arraybuffer:"), this.dispatch(new Uint8Array(e2));
          }, _url: function(e2) {
            return u2("url:" + e2.toString());
          }, _map: function(e2) {
            u2("map:");
            e2 = Array.from(e2);
            return this._array(e2, false !== o2.unorderedSets);
          }, _set: function(e2) {
            u2("set:");
            e2 = Array.from(e2);
            return this._array(e2, false !== o2.unorderedSets);
          }, _file: function(e2) {
            return u2("file:"), this.dispatch([e2.name, e2.size, e2.type, e2.lastModfied]);
          }, _blob: function() {
            if (o2.ignoreUnknown)
              return u2("[blob]");
            throw Error('Hashing Blob objects is currently not supported\n(see https://github.com/puleos/object-hash/issues/26)\nUse "options.replacer" or "options.ignoreUnknown"\n');
          }, _domwindow: function() {
            return u2("domwindow");
          }, _bigint: function(e2) {
            return u2("bigint:" + e2.toString());
          }, _process: function() {
            return u2("process");
          }, _timer: function() {
            return u2("timer");
          }, _pipe: function() {
            return u2("pipe");
          }, _tcp: function() {
            return u2("tcp");
          }, _udp: function() {
            return u2("udp");
          }, _tty: function() {
            return u2("tty");
          }, _statwatcher: function() {
            return u2("statwatcher");
          }, _securecontext: function() {
            return u2("securecontext");
          }, _connection: function() {
            return u2("connection");
          }, _zlib: function() {
            return u2("zlib");
          }, _context: function() {
            return u2("context");
          }, _nodescript: function() {
            return u2("nodescript");
          }, _httpparser: function() {
            return u2("httpparser");
          }, _dataview: function() {
            return u2("dataview");
          }, _signal: function() {
            return u2("signal");
          }, _fsevent: function() {
            return u2("fsevent");
          }, _tlswrap: function() {
            return u2("tlswrap");
          } };
        }
        function l() {
          return { buf: "", write: function(e2) {
            this.buf += e2;
          }, end: function(e2) {
            this.buf += e2;
          }, read: function() {
            return this.buf;
          } };
        }
        m.writeToStream = function(e2, t2, n2) {
          return void 0 === n2 && (n2 = t2, t2 = {}), f(t2 = u(e2, t2), n2).dispatch(e2);
        };
      }.call(this, w("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, w("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/fake_9a5aa49d.js", "/");
    }, { buffer: 3, crypto: 5, lYpoI2: 11 }], 2: [function(e, t, f) {
      !function(e2, t2, n, r, o, i, u, s, a) {
        !function(e3) {
          var a2 = "undefined" != typeof Uint8Array ? Uint8Array : Array, t3 = "+".charCodeAt(0), n2 = "/".charCodeAt(0), r2 = "0".charCodeAt(0), o2 = "a".charCodeAt(0), i2 = "A".charCodeAt(0), u2 = "-".charCodeAt(0), s2 = "_".charCodeAt(0);
          function f2(e4) {
            e4 = e4.charCodeAt(0);
            return e4 === t3 || e4 === u2 ? 62 : e4 === n2 || e4 === s2 ? 63 : e4 < r2 ? -1 : e4 < r2 + 10 ? e4 - r2 + 26 + 26 : e4 < i2 + 26 ? e4 - i2 : e4 < o2 + 26 ? e4 - o2 + 26 : void 0;
          }
          e3.toByteArray = function(e4) {
            var t4, n3;
            if (0 < e4.length % 4)
              throw new Error("Invalid string. Length must be a multiple of 4");
            var r3 = e4.length, r3 = "=" === e4.charAt(r3 - 2) ? 2 : "=" === e4.charAt(r3 - 1) ? 1 : 0, o3 = new a2(3 * e4.length / 4 - r3), i3 = 0 < r3 ? e4.length - 4 : e4.length, u3 = 0;
            function s3(e5) {
              o3[u3++] = e5;
            }
            for (t4 = 0; t4 < i3; t4 += 4, 0)
              s3((16711680 & (n3 = f2(e4.charAt(t4)) << 18 | f2(e4.charAt(t4 + 1)) << 12 | f2(e4.charAt(t4 + 2)) << 6 | f2(e4.charAt(t4 + 3)))) >> 16), s3((65280 & n3) >> 8), s3(255 & n3);
            return 2 == r3 ? s3(255 & (n3 = f2(e4.charAt(t4)) << 2 | f2(e4.charAt(t4 + 1)) >> 4)) : 1 == r3 && (s3((n3 = f2(e4.charAt(t4)) << 10 | f2(e4.charAt(t4 + 1)) << 4 | f2(e4.charAt(t4 + 2)) >> 2) >> 8 & 255), s3(255 & n3)), o3;
          }, e3.fromByteArray = function(e4) {
            var t4, n3, r3, o3, i3 = e4.length % 3, u3 = "";
            function s3(e5) {
              return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e5);
            }
            for (t4 = 0, r3 = e4.length - i3; t4 < r3; t4 += 3)
              n3 = (e4[t4] << 16) + (e4[t4 + 1] << 8) + e4[t4 + 2], u3 += s3((o3 = n3) >> 18 & 63) + s3(o3 >> 12 & 63) + s3(o3 >> 6 & 63) + s3(63 & o3);
            switch (i3) {
              case 1:
                u3 = (u3 += s3((n3 = e4[e4.length - 1]) >> 2)) + s3(n3 << 4 & 63) + "==";
                break;
              case 2:
                u3 = (u3 = (u3 += s3((n3 = (e4[e4.length - 2] << 8) + e4[e4.length - 1]) >> 10)) + s3(n3 >> 4 & 63)) + s3(n3 << 2 & 63) + "=";
            }
            return u3;
          };
        }(void 0 === f ? this.base64js = {} : f);
      }.call(this, e("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, e("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/base64-js/lib/b64.js", "/node_modules/gulp-browserify/node_modules/base64-js/lib");
    }, { buffer: 3, lYpoI2: 11 }], 3: [function(O, e, H) {
      !function(e2, n, f, r, h, p, g, y, w) {
        var a = O("base64-js"), i = O("ieee754");
        function f(e3, t2, n2) {
          if (!(this instanceof f))
            return new f(e3, t2, n2);
          var r2, o2, i2, u2, s2 = typeof e3;
          if ("base64" === t2 && "string" == s2)
            for (e3 = (u2 = e3).trim ? u2.trim() : u2.replace(/^\s+|\s+$/g, ""); e3.length % 4 != 0; )
              e3 += "=";
          if ("number" == s2)
            r2 = j(e3);
          else if ("string" == s2)
            r2 = f.byteLength(e3, t2);
          else {
            if ("object" != s2)
              throw new Error("First argument needs to be a number, array or string.");
            r2 = j(e3.length);
          }
          if (f._useTypedArrays ? o2 = f._augment(new Uint8Array(r2)) : ((o2 = this).length = r2, o2._isBuffer = true), f._useTypedArrays && "number" == typeof e3.byteLength)
            o2._set(e3);
          else if (C(u2 = e3) || f.isBuffer(u2) || u2 && "object" == typeof u2 && "number" == typeof u2.length)
            for (i2 = 0; i2 < r2; i2++)
              f.isBuffer(e3) ? o2[i2] = e3.readUInt8(i2) : o2[i2] = e3[i2];
          else if ("string" == s2)
            o2.write(e3, 0, t2);
          else if ("number" == s2 && !f._useTypedArrays && !n2)
            for (i2 = 0; i2 < r2; i2++)
              o2[i2] = 0;
          return o2;
        }
        function b(e3, t2, n2, r2) {
          return f._charsWritten = c(function(e4) {
            for (var t3 = [], n3 = 0; n3 < e4.length; n3++)
              t3.push(255 & e4.charCodeAt(n3));
            return t3;
          }(t2), e3, n2, r2);
        }
        function m(e3, t2, n2, r2) {
          return f._charsWritten = c(function(e4) {
            for (var t3, n3, r3 = [], o2 = 0; o2 < e4.length; o2++)
              n3 = e4.charCodeAt(o2), t3 = n3 >> 8, n3 = n3 % 256, r3.push(n3), r3.push(t3);
            return r3;
          }(t2), e3, n2, r2);
        }
        function v(e3, t2, n2) {
          var r2 = "";
          n2 = Math.min(e3.length, n2);
          for (var o2 = t2; o2 < n2; o2++)
            r2 += String.fromCharCode(e3[o2]);
          return r2;
        }
        function o(e3, t2, n2, r2) {
          r2 || (d("boolean" == typeof n2, "missing or invalid endian"), d(null != t2, "missing offset"), d(t2 + 1 < e3.length, "Trying to read beyond buffer length"));
          var o2, r2 = e3.length;
          if (!(r2 <= t2))
            return n2 ? (o2 = e3[t2], t2 + 1 < r2 && (o2 |= e3[t2 + 1] << 8)) : (o2 = e3[t2] << 8, t2 + 1 < r2 && (o2 |= e3[t2 + 1])), o2;
        }
        function u(e3, t2, n2, r2) {
          r2 || (d("boolean" == typeof n2, "missing or invalid endian"), d(null != t2, "missing offset"), d(t2 + 3 < e3.length, "Trying to read beyond buffer length"));
          var o2, r2 = e3.length;
          if (!(r2 <= t2))
            return n2 ? (t2 + 2 < r2 && (o2 = e3[t2 + 2] << 16), t2 + 1 < r2 && (o2 |= e3[t2 + 1] << 8), o2 |= e3[t2], t2 + 3 < r2 && (o2 += e3[t2 + 3] << 24 >>> 0)) : (t2 + 1 < r2 && (o2 = e3[t2 + 1] << 16), t2 + 2 < r2 && (o2 |= e3[t2 + 2] << 8), t2 + 3 < r2 && (o2 |= e3[t2 + 3]), o2 += e3[t2] << 24 >>> 0), o2;
        }
        function _(e3, t2, n2, r2) {
          if (r2 || (d("boolean" == typeof n2, "missing or invalid endian"), d(null != t2, "missing offset"), d(t2 + 1 < e3.length, "Trying to read beyond buffer length")), !(e3.length <= t2))
            return r2 = o(e3, t2, n2, true), 32768 & r2 ? -1 * (65535 - r2 + 1) : r2;
        }
        function E(e3, t2, n2, r2) {
          if (r2 || (d("boolean" == typeof n2, "missing or invalid endian"), d(null != t2, "missing offset"), d(t2 + 3 < e3.length, "Trying to read beyond buffer length")), !(e3.length <= t2))
            return r2 = u(e3, t2, n2, true), 2147483648 & r2 ? -1 * (4294967295 - r2 + 1) : r2;
        }
        function I(e3, t2, n2, r2) {
          return r2 || (d("boolean" == typeof n2, "missing or invalid endian"), d(t2 + 3 < e3.length, "Trying to read beyond buffer length")), i.read(e3, t2, n2, 23, 4);
        }
        function A(e3, t2, n2, r2) {
          return r2 || (d("boolean" == typeof n2, "missing or invalid endian"), d(t2 + 7 < e3.length, "Trying to read beyond buffer length")), i.read(e3, t2, n2, 52, 8);
        }
        function s(e3, t2, n2, r2, o2) {
          o2 || (d(null != t2, "missing value"), d("boolean" == typeof r2, "missing or invalid endian"), d(null != n2, "missing offset"), d(n2 + 1 < e3.length, "trying to write beyond buffer length"), Y(t2, 65535));
          o2 = e3.length;
          if (!(o2 <= n2))
            for (var i2 = 0, u2 = Math.min(o2 - n2, 2); i2 < u2; i2++)
              e3[n2 + i2] = (t2 & 255 << 8 * (r2 ? i2 : 1 - i2)) >>> 8 * (r2 ? i2 : 1 - i2);
        }
        function l(e3, t2, n2, r2, o2) {
          o2 || (d(null != t2, "missing value"), d("boolean" == typeof r2, "missing or invalid endian"), d(null != n2, "missing offset"), d(n2 + 3 < e3.length, "trying to write beyond buffer length"), Y(t2, 4294967295));
          o2 = e3.length;
          if (!(o2 <= n2))
            for (var i2 = 0, u2 = Math.min(o2 - n2, 4); i2 < u2; i2++)
              e3[n2 + i2] = t2 >>> 8 * (r2 ? i2 : 3 - i2) & 255;
        }
        function B(e3, t2, n2, r2, o2) {
          o2 || (d(null != t2, "missing value"), d("boolean" == typeof r2, "missing or invalid endian"), d(null != n2, "missing offset"), d(n2 + 1 < e3.length, "Trying to write beyond buffer length"), F(t2, 32767, -32768)), e3.length <= n2 || s(e3, 0 <= t2 ? t2 : 65535 + t2 + 1, n2, r2, o2);
        }
        function L(e3, t2, n2, r2, o2) {
          o2 || (d(null != t2, "missing value"), d("boolean" == typeof r2, "missing or invalid endian"), d(null != n2, "missing offset"), d(n2 + 3 < e3.length, "Trying to write beyond buffer length"), F(t2, 2147483647, -2147483648)), e3.length <= n2 || l(e3, 0 <= t2 ? t2 : 4294967295 + t2 + 1, n2, r2, o2);
        }
        function U(e3, t2, n2, r2, o2) {
          o2 || (d(null != t2, "missing value"), d("boolean" == typeof r2, "missing or invalid endian"), d(null != n2, "missing offset"), d(n2 + 3 < e3.length, "Trying to write beyond buffer length"), D(t2, 34028234663852886e22, -34028234663852886e22)), e3.length <= n2 || i.write(e3, t2, n2, r2, 23, 4);
        }
        function x(e3, t2, n2, r2, o2) {
          o2 || (d(null != t2, "missing value"), d("boolean" == typeof r2, "missing or invalid endian"), d(null != n2, "missing offset"), d(n2 + 7 < e3.length, "Trying to write beyond buffer length"), D(t2, 17976931348623157e292, -17976931348623157e292)), e3.length <= n2 || i.write(e3, t2, n2, r2, 52, 8);
        }
        H.Buffer = f, H.SlowBuffer = f, H.INSPECT_MAX_BYTES = 50, f.poolSize = 8192, f._useTypedArrays = function() {
          try {
            var e3 = new ArrayBuffer(0), t2 = new Uint8Array(e3);
            return t2.foo = function() {
              return 42;
            }, 42 === t2.foo() && "function" == typeof t2.subarray;
          } catch (e4) {
            return false;
          }
        }(), f.isEncoding = function(e3) {
          switch (String(e3).toLowerCase()) {
            case "hex":
            case "utf8":
            case "utf-8":
            case "ascii":
            case "binary":
            case "base64":
            case "raw":
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return true;
            default:
              return false;
          }
        }, f.isBuffer = function(e3) {
          return !(null == e3 || !e3._isBuffer);
        }, f.byteLength = function(e3, t2) {
          var n2;
          switch (e3 += "", t2 || "utf8") {
            case "hex":
              n2 = e3.length / 2;
              break;
            case "utf8":
            case "utf-8":
              n2 = T(e3).length;
              break;
            case "ascii":
            case "binary":
            case "raw":
              n2 = e3.length;
              break;
            case "base64":
              n2 = M(e3).length;
              break;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              n2 = 2 * e3.length;
              break;
            default:
              throw new Error("Unknown encoding");
          }
          return n2;
        }, f.concat = function(e3, t2) {
          if (d(C(e3), "Usage: Buffer.concat(list, [totalLength])\nlist should be an Array."), 0 === e3.length)
            return new f(0);
          if (1 === e3.length)
            return e3[0];
          if ("number" != typeof t2)
            for (o2 = t2 = 0; o2 < e3.length; o2++)
              t2 += e3[o2].length;
          for (var n2 = new f(t2), r2 = 0, o2 = 0; o2 < e3.length; o2++) {
            var i2 = e3[o2];
            i2.copy(n2, r2), r2 += i2.length;
          }
          return n2;
        }, f.prototype.write = function(e3, t2, n2, r2) {
          isFinite(t2) ? isFinite(n2) || (r2 = n2, n2 = void 0) : (a2 = r2, r2 = t2, t2 = n2, n2 = a2), t2 = Number(t2) || 0;
          var o2, i2, u2, s2, a2 = this.length - t2;
          switch ((!n2 || a2 < (n2 = Number(n2))) && (n2 = a2), r2 = String(r2 || "utf8").toLowerCase()) {
            case "hex":
              o2 = function(e4, t3, n3, r3) {
                n3 = Number(n3) || 0;
                var o3 = e4.length - n3;
                (!r3 || o3 < (r3 = Number(r3))) && (r3 = o3), d((o3 = t3.length) % 2 == 0, "Invalid hex string"), o3 / 2 < r3 && (r3 = o3 / 2);
                for (var i3 = 0; i3 < r3; i3++) {
                  var u3 = parseInt(t3.substr(2 * i3, 2), 16);
                  d(!isNaN(u3), "Invalid hex string"), e4[n3 + i3] = u3;
                }
                return f._charsWritten = 2 * i3, i3;
              }(this, e3, t2, n2);
              break;
            case "utf8":
            case "utf-8":
              i2 = this, u2 = t2, s2 = n2, o2 = f._charsWritten = c(T(e3), i2, u2, s2);
              break;
            case "ascii":
            case "binary":
              o2 = b(this, e3, t2, n2);
              break;
            case "base64":
              i2 = this, u2 = t2, s2 = n2, o2 = f._charsWritten = c(M(e3), i2, u2, s2);
              break;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              o2 = m(this, e3, t2, n2);
              break;
            default:
              throw new Error("Unknown encoding");
          }
          return o2;
        }, f.prototype.toString = function(e3, t2, n2) {
          var r2, o2, i2, u2, s2 = this;
          if (e3 = String(e3 || "utf8").toLowerCase(), t2 = Number(t2) || 0, (n2 = void 0 !== n2 ? Number(n2) : s2.length) === t2)
            return "";
          switch (e3) {
            case "hex":
              r2 = function(e4, t3, n3) {
                var r3 = e4.length;
                (!t3 || t3 < 0) && (t3 = 0);
                (!n3 || n3 < 0 || r3 < n3) && (n3 = r3);
                for (var o3 = "", i3 = t3; i3 < n3; i3++)
                  o3 += k(e4[i3]);
                return o3;
              }(s2, t2, n2);
              break;
            case "utf8":
            case "utf-8":
              r2 = function(e4, t3, n3) {
                var r3 = "", o3 = "";
                n3 = Math.min(e4.length, n3);
                for (var i3 = t3; i3 < n3; i3++)
                  e4[i3] <= 127 ? (r3 += N(o3) + String.fromCharCode(e4[i3]), o3 = "") : o3 += "%" + e4[i3].toString(16);
                return r3 + N(o3);
              }(s2, t2, n2);
              break;
            case "ascii":
            case "binary":
              r2 = v(s2, t2, n2);
              break;
            case "base64":
              o2 = s2, u2 = n2, r2 = 0 === (i2 = t2) && u2 === o2.length ? a.fromByteArray(o2) : a.fromByteArray(o2.slice(i2, u2));
              break;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              r2 = function(e4, t3, n3) {
                for (var r3 = e4.slice(t3, n3), o3 = "", i3 = 0; i3 < r3.length; i3 += 2)
                  o3 += String.fromCharCode(r3[i3] + 256 * r3[i3 + 1]);
                return o3;
              }(s2, t2, n2);
              break;
            default:
              throw new Error("Unknown encoding");
          }
          return r2;
        }, f.prototype.toJSON = function() {
          return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) };
        }, f.prototype.copy = function(e3, t2, n2, r2) {
          if (t2 = t2 || 0, (r2 = r2 || 0 === r2 ? r2 : this.length) !== (n2 = n2 || 0) && 0 !== e3.length && 0 !== this.length) {
            d(n2 <= r2, "sourceEnd < sourceStart"), d(0 <= t2 && t2 < e3.length, "targetStart out of bounds"), d(0 <= n2 && n2 < this.length, "sourceStart out of bounds"), d(0 <= r2 && r2 <= this.length, "sourceEnd out of bounds"), r2 > this.length && (r2 = this.length);
            var o2 = (r2 = e3.length - t2 < r2 - n2 ? e3.length - t2 + n2 : r2) - n2;
            if (o2 < 100 || !f._useTypedArrays)
              for (var i2 = 0; i2 < o2; i2++)
                e3[i2 + t2] = this[i2 + n2];
            else
              e3._set(this.subarray(n2, n2 + o2), t2);
          }
        }, f.prototype.slice = function(e3, t2) {
          var n2 = this.length;
          if (e3 = S(e3, n2, 0), t2 = S(t2, n2, n2), f._useTypedArrays)
            return f._augment(this.subarray(e3, t2));
          for (var r2 = t2 - e3, o2 = new f(r2, void 0, true), i2 = 0; i2 < r2; i2++)
            o2[i2] = this[i2 + e3];
          return o2;
        }, f.prototype.get = function(e3) {
          return console.log(".get() is deprecated. Access using array indexes instead."), this.readUInt8(e3);
        }, f.prototype.set = function(e3, t2) {
          return console.log(".set() is deprecated. Access using array indexes instead."), this.writeUInt8(e3, t2);
        }, f.prototype.readUInt8 = function(e3, t2) {
          if (t2 || (d(null != e3, "missing offset"), d(e3 < this.length, "Trying to read beyond buffer length")), !(e3 >= this.length))
            return this[e3];
        }, f.prototype.readUInt16LE = function(e3, t2) {
          return o(this, e3, true, t2);
        }, f.prototype.readUInt16BE = function(e3, t2) {
          return o(this, e3, false, t2);
        }, f.prototype.readUInt32LE = function(e3, t2) {
          return u(this, e3, true, t2);
        }, f.prototype.readUInt32BE = function(e3, t2) {
          return u(this, e3, false, t2);
        }, f.prototype.readInt8 = function(e3, t2) {
          if (t2 || (d(null != e3, "missing offset"), d(e3 < this.length, "Trying to read beyond buffer length")), !(e3 >= this.length))
            return 128 & this[e3] ? -1 * (255 - this[e3] + 1) : this[e3];
        }, f.prototype.readInt16LE = function(e3, t2) {
          return _(this, e3, true, t2);
        }, f.prototype.readInt16BE = function(e3, t2) {
          return _(this, e3, false, t2);
        }, f.prototype.readInt32LE = function(e3, t2) {
          return E(this, e3, true, t2);
        }, f.prototype.readInt32BE = function(e3, t2) {
          return E(this, e3, false, t2);
        }, f.prototype.readFloatLE = function(e3, t2) {
          return I(this, e3, true, t2);
        }, f.prototype.readFloatBE = function(e3, t2) {
          return I(this, e3, false, t2);
        }, f.prototype.readDoubleLE = function(e3, t2) {
          return A(this, e3, true, t2);
        }, f.prototype.readDoubleBE = function(e3, t2) {
          return A(this, e3, false, t2);
        }, f.prototype.writeUInt8 = function(e3, t2, n2) {
          n2 || (d(null != e3, "missing value"), d(null != t2, "missing offset"), d(t2 < this.length, "trying to write beyond buffer length"), Y(e3, 255)), t2 >= this.length || (this[t2] = e3);
        }, f.prototype.writeUInt16LE = function(e3, t2, n2) {
          s(this, e3, t2, true, n2);
        }, f.prototype.writeUInt16BE = function(e3, t2, n2) {
          s(this, e3, t2, false, n2);
        }, f.prototype.writeUInt32LE = function(e3, t2, n2) {
          l(this, e3, t2, true, n2);
        }, f.prototype.writeUInt32BE = function(e3, t2, n2) {
          l(this, e3, t2, false, n2);
        }, f.prototype.writeInt8 = function(e3, t2, n2) {
          n2 || (d(null != e3, "missing value"), d(null != t2, "missing offset"), d(t2 < this.length, "Trying to write beyond buffer length"), F(e3, 127, -128)), t2 >= this.length || (0 <= e3 ? this.writeUInt8(e3, t2, n2) : this.writeUInt8(255 + e3 + 1, t2, n2));
        }, f.prototype.writeInt16LE = function(e3, t2, n2) {
          B(this, e3, t2, true, n2);
        }, f.prototype.writeInt16BE = function(e3, t2, n2) {
          B(this, e3, t2, false, n2);
        }, f.prototype.writeInt32LE = function(e3, t2, n2) {
          L(this, e3, t2, true, n2);
        }, f.prototype.writeInt32BE = function(e3, t2, n2) {
          L(this, e3, t2, false, n2);
        }, f.prototype.writeFloatLE = function(e3, t2, n2) {
          U(this, e3, t2, true, n2);
        }, f.prototype.writeFloatBE = function(e3, t2, n2) {
          U(this, e3, t2, false, n2);
        }, f.prototype.writeDoubleLE = function(e3, t2, n2) {
          x(this, e3, t2, true, n2);
        }, f.prototype.writeDoubleBE = function(e3, t2, n2) {
          x(this, e3, t2, false, n2);
        }, f.prototype.fill = function(e3, t2, n2) {
          if (t2 = t2 || 0, n2 = n2 || this.length, d("number" == typeof (e3 = "string" == typeof (e3 = e3 || 0) ? e3.charCodeAt(0) : e3) && !isNaN(e3), "value is not a number"), d(t2 <= n2, "end < start"), n2 !== t2 && 0 !== this.length) {
            d(0 <= t2 && t2 < this.length, "start out of bounds"), d(0 <= n2 && n2 <= this.length, "end out of bounds");
            for (var r2 = t2; r2 < n2; r2++)
              this[r2] = e3;
          }
        }, f.prototype.inspect = function() {
          for (var e3 = [], t2 = this.length, n2 = 0; n2 < t2; n2++)
            if (e3[n2] = k(this[n2]), n2 === H.INSPECT_MAX_BYTES) {
              e3[n2 + 1] = "...";
              break;
            }
          return "<Buffer " + e3.join(" ") + ">";
        }, f.prototype.toArrayBuffer = function() {
          if ("undefined" == typeof Uint8Array)
            throw new Error("Buffer.toArrayBuffer not supported in this browser");
          if (f._useTypedArrays)
            return new f(this).buffer;
          for (var e3 = new Uint8Array(this.length), t2 = 0, n2 = e3.length; t2 < n2; t2 += 1)
            e3[t2] = this[t2];
          return e3.buffer;
        };
        var t = f.prototype;
        function S(e3, t2, n2) {
          return "number" != typeof e3 ? n2 : t2 <= (e3 = ~~e3) ? t2 : 0 <= e3 || 0 <= (e3 += t2) ? e3 : 0;
        }
        function j(e3) {
          return (e3 = ~~Math.ceil(+e3)) < 0 ? 0 : e3;
        }
        function C(e3) {
          return (Array.isArray || function(e4) {
            return "[object Array]" === Object.prototype.toString.call(e4);
          })(e3);
        }
        function k(e3) {
          return e3 < 16 ? "0" + e3.toString(16) : e3.toString(16);
        }
        function T(e3) {
          for (var t2 = [], n2 = 0; n2 < e3.length; n2++) {
            var r2 = e3.charCodeAt(n2);
            if (r2 <= 127)
              t2.push(e3.charCodeAt(n2));
            else
              for (var o2 = n2, i2 = (55296 <= r2 && r2 <= 57343 && n2++, encodeURIComponent(e3.slice(o2, n2 + 1)).substr(1).split("%")), u2 = 0; u2 < i2.length; u2++)
                t2.push(parseInt(i2[u2], 16));
          }
          return t2;
        }
        function M(e3) {
          return a.toByteArray(e3);
        }
        function c(e3, t2, n2, r2) {
          for (var o2 = 0; o2 < r2 && !(o2 + n2 >= t2.length || o2 >= e3.length); o2++)
            t2[o2 + n2] = e3[o2];
          return o2;
        }
        function N(e3) {
          try {
            return decodeURIComponent(e3);
          } catch (e4) {
            return String.fromCharCode(65533);
          }
        }
        function Y(e3, t2) {
          d("number" == typeof e3, "cannot write a non-number as a number"), d(0 <= e3, "specified a negative value for writing an unsigned value"), d(e3 <= t2, "value is larger than maximum value for type"), d(Math.floor(e3) === e3, "value has a fractional component");
        }
        function F(e3, t2, n2) {
          d("number" == typeof e3, "cannot write a non-number as a number"), d(e3 <= t2, "value larger than maximum allowed value"), d(n2 <= e3, "value smaller than minimum allowed value"), d(Math.floor(e3) === e3, "value has a fractional component");
        }
        function D(e3, t2, n2) {
          d("number" == typeof e3, "cannot write a non-number as a number"), d(e3 <= t2, "value larger than maximum allowed value"), d(n2 <= e3, "value smaller than minimum allowed value");
        }
        function d(e3, t2) {
          if (!e3)
            throw new Error(t2 || "Failed assertion");
        }
        f._augment = function(e3) {
          return e3._isBuffer = true, e3._get = e3.get, e3._set = e3.set, e3.get = t.get, e3.set = t.set, e3.write = t.write, e3.toString = t.toString, e3.toLocaleString = t.toString, e3.toJSON = t.toJSON, e3.copy = t.copy, e3.slice = t.slice, e3.readUInt8 = t.readUInt8, e3.readUInt16LE = t.readUInt16LE, e3.readUInt16BE = t.readUInt16BE, e3.readUInt32LE = t.readUInt32LE, e3.readUInt32BE = t.readUInt32BE, e3.readInt8 = t.readInt8, e3.readInt16LE = t.readInt16LE, e3.readInt16BE = t.readInt16BE, e3.readInt32LE = t.readInt32LE, e3.readInt32BE = t.readInt32BE, e3.readFloatLE = t.readFloatLE, e3.readFloatBE = t.readFloatBE, e3.readDoubleLE = t.readDoubleLE, e3.readDoubleBE = t.readDoubleBE, e3.writeUInt8 = t.writeUInt8, e3.writeUInt16LE = t.writeUInt16LE, e3.writeUInt16BE = t.writeUInt16BE, e3.writeUInt32LE = t.writeUInt32LE, e3.writeUInt32BE = t.writeUInt32BE, e3.writeInt8 = t.writeInt8, e3.writeInt16LE = t.writeInt16LE, e3.writeInt16BE = t.writeInt16BE, e3.writeInt32LE = t.writeInt32LE, e3.writeInt32BE = t.writeInt32BE, e3.writeFloatLE = t.writeFloatLE, e3.writeFloatBE = t.writeFloatBE, e3.writeDoubleLE = t.writeDoubleLE, e3.writeDoubleBE = t.writeDoubleBE, e3.fill = t.fill, e3.inspect = t.inspect, e3.toArrayBuffer = t.toArrayBuffer, e3;
        };
      }.call(this, O("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, O("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/buffer/index.js", "/node_modules/gulp-browserify/node_modules/buffer");
    }, { "base64-js": 2, buffer: 3, ieee754: 10, lYpoI2: 11 }], 4: [function(c, d, e) {
      !function(e2, t, a, n, r, o, i, u, s) {
        var a = c("buffer").Buffer, f = 4, l = new a(f);
        l.fill(0);
        d.exports = { hash: function(e3, t2, n2, r2) {
          for (var o2 = t2(function(e4, t3) {
            e4.length % f != 0 && (n3 = e4.length + (f - e4.length % f), e4 = a.concat([e4, l], n3));
            for (var n3, r3 = [], o3 = t3 ? e4.readInt32BE : e4.readInt32LE, i3 = 0; i3 < e4.length; i3 += f)
              r3.push(o3.call(e4, i3));
            return r3;
          }(e3 = a.isBuffer(e3) ? e3 : new a(e3), r2), 8 * e3.length), t2 = r2, i2 = new a(n2), u2 = t2 ? i2.writeInt32BE : i2.writeInt32LE, s2 = 0; s2 < o2.length; s2++)
            u2.call(i2, o2[s2], 4 * s2, true);
          return i2;
        } };
      }.call(this, c("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, c("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/crypto-browserify/helpers.js", "/node_modules/gulp-browserify/node_modules/crypto-browserify");
    }, { buffer: 3, lYpoI2: 11 }], 5: [function(v, e, _) {
      !function(l, c, u, d, h, p, g, y, w) {
        var u = v("buffer").Buffer, e2 = v("./sha"), t = v("./sha256"), n = v("./rng"), b = { sha1: e2, sha256: t, md5: v("./md5") }, s = 64, a = new u(s);
        function r(e3, n2) {
          var r2 = b[e3 = e3 || "sha1"], o2 = [];
          return r2 || i("algorithm:", e3, "is not yet supported"), { update: function(e4) {
            return u.isBuffer(e4) || (e4 = new u(e4)), o2.push(e4), e4.length, this;
          }, digest: function(e4) {
            var t2 = u.concat(o2), t2 = n2 ? function(e5, t3, n3) {
              u.isBuffer(t3) || (t3 = new u(t3)), u.isBuffer(n3) || (n3 = new u(n3)), t3.length > s ? t3 = e5(t3) : t3.length < s && (t3 = u.concat([t3, a], s));
              for (var r3 = new u(s), o3 = new u(s), i2 = 0; i2 < s; i2++)
                r3[i2] = 54 ^ t3[i2], o3[i2] = 92 ^ t3[i2];
              return n3 = e5(u.concat([r3, n3])), e5(u.concat([o3, n3]));
            }(r2, n2, t2) : r2(t2);
            return o2 = null, e4 ? t2.toString(e4) : t2;
          } };
        }
        function i() {
          var e3 = [].slice.call(arguments).join(" ");
          throw new Error([e3, "we accept pull requests", "http://github.com/dominictarr/crypto-browserify"].join("\n"));
        }
        a.fill(0), _.createHash = function(e3) {
          return r(e3);
        }, _.createHmac = r, _.randomBytes = function(e3, t2) {
          if (!t2 || !t2.call)
            return new u(n(e3));
          try {
            t2.call(this, void 0, new u(n(e3)));
          } catch (e4) {
            t2(e4);
          }
        };
        var o, f = ["createCredentials", "createCipher", "createCipheriv", "createDecipher", "createDecipheriv", "createSign", "createVerify", "createDiffieHellman", "pbkdf2"], m = function(e3) {
          _[e3] = function() {
            i("sorry,", e3, "is not implemented yet");
          };
        };
        for (o in f)
          m(f[o]);
      }.call(this, v("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, v("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/crypto-browserify/index.js", "/node_modules/gulp-browserify/node_modules/crypto-browserify");
    }, { "./md5": 6, "./rng": 7, "./sha": 8, "./sha256": 9, buffer: 3, lYpoI2: 11 }], 6: [function(w, b, e) {
      !function(e2, r, o, i, u, a, f, l, y) {
        var t = w("./helpers");
        function n(e3, t2) {
          e3[t2 >> 5] |= 128 << t2 % 32, e3[14 + (t2 + 64 >>> 9 << 4)] = t2;
          for (var n2 = 1732584193, r2 = -271733879, o2 = -1732584194, i2 = 271733878, u2 = 0; u2 < e3.length; u2 += 16) {
            var s2 = n2, a2 = r2, f2 = o2, l2 = i2, n2 = c(n2, r2, o2, i2, e3[u2 + 0], 7, -680876936), i2 = c(i2, n2, r2, o2, e3[u2 + 1], 12, -389564586), o2 = c(o2, i2, n2, r2, e3[u2 + 2], 17, 606105819), r2 = c(r2, o2, i2, n2, e3[u2 + 3], 22, -1044525330);
            n2 = c(n2, r2, o2, i2, e3[u2 + 4], 7, -176418897), i2 = c(i2, n2, r2, o2, e3[u2 + 5], 12, 1200080426), o2 = c(o2, i2, n2, r2, e3[u2 + 6], 17, -1473231341), r2 = c(r2, o2, i2, n2, e3[u2 + 7], 22, -45705983), n2 = c(n2, r2, o2, i2, e3[u2 + 8], 7, 1770035416), i2 = c(i2, n2, r2, o2, e3[u2 + 9], 12, -1958414417), o2 = c(o2, i2, n2, r2, e3[u2 + 10], 17, -42063), r2 = c(r2, o2, i2, n2, e3[u2 + 11], 22, -1990404162), n2 = c(n2, r2, o2, i2, e3[u2 + 12], 7, 1804603682), i2 = c(i2, n2, r2, o2, e3[u2 + 13], 12, -40341101), o2 = c(o2, i2, n2, r2, e3[u2 + 14], 17, -1502002290), n2 = d(n2, r2 = c(r2, o2, i2, n2, e3[u2 + 15], 22, 1236535329), o2, i2, e3[u2 + 1], 5, -165796510), i2 = d(i2, n2, r2, o2, e3[u2 + 6], 9, -1069501632), o2 = d(o2, i2, n2, r2, e3[u2 + 11], 14, 643717713), r2 = d(r2, o2, i2, n2, e3[u2 + 0], 20, -373897302), n2 = d(n2, r2, o2, i2, e3[u2 + 5], 5, -701558691), i2 = d(i2, n2, r2, o2, e3[u2 + 10], 9, 38016083), o2 = d(o2, i2, n2, r2, e3[u2 + 15], 14, -660478335), r2 = d(r2, o2, i2, n2, e3[u2 + 4], 20, -405537848), n2 = d(n2, r2, o2, i2, e3[u2 + 9], 5, 568446438), i2 = d(i2, n2, r2, o2, e3[u2 + 14], 9, -1019803690), o2 = d(o2, i2, n2, r2, e3[u2 + 3], 14, -187363961), r2 = d(r2, o2, i2, n2, e3[u2 + 8], 20, 1163531501), n2 = d(n2, r2, o2, i2, e3[u2 + 13], 5, -1444681467), i2 = d(i2, n2, r2, o2, e3[u2 + 2], 9, -51403784), o2 = d(o2, i2, n2, r2, e3[u2 + 7], 14, 1735328473), n2 = h(n2, r2 = d(r2, o2, i2, n2, e3[u2 + 12], 20, -1926607734), o2, i2, e3[u2 + 5], 4, -378558), i2 = h(i2, n2, r2, o2, e3[u2 + 8], 11, -2022574463), o2 = h(o2, i2, n2, r2, e3[u2 + 11], 16, 1839030562), r2 = h(r2, o2, i2, n2, e3[u2 + 14], 23, -35309556), n2 = h(n2, r2, o2, i2, e3[u2 + 1], 4, -1530992060), i2 = h(i2, n2, r2, o2, e3[u2 + 4], 11, 1272893353), o2 = h(o2, i2, n2, r2, e3[u2 + 7], 16, -155497632), r2 = h(r2, o2, i2, n2, e3[u2 + 10], 23, -1094730640), n2 = h(n2, r2, o2, i2, e3[u2 + 13], 4, 681279174), i2 = h(i2, n2, r2, o2, e3[u2 + 0], 11, -358537222), o2 = h(o2, i2, n2, r2, e3[u2 + 3], 16, -722521979), r2 = h(r2, o2, i2, n2, e3[u2 + 6], 23, 76029189), n2 = h(n2, r2, o2, i2, e3[u2 + 9], 4, -640364487), i2 = h(i2, n2, r2, o2, e3[u2 + 12], 11, -421815835), o2 = h(o2, i2, n2, r2, e3[u2 + 15], 16, 530742520), n2 = p(n2, r2 = h(r2, o2, i2, n2, e3[u2 + 2], 23, -995338651), o2, i2, e3[u2 + 0], 6, -198630844), i2 = p(i2, n2, r2, o2, e3[u2 + 7], 10, 1126891415), o2 = p(o2, i2, n2, r2, e3[u2 + 14], 15, -1416354905), r2 = p(r2, o2, i2, n2, e3[u2 + 5], 21, -57434055), n2 = p(n2, r2, o2, i2, e3[u2 + 12], 6, 1700485571), i2 = p(i2, n2, r2, o2, e3[u2 + 3], 10, -1894986606), o2 = p(o2, i2, n2, r2, e3[u2 + 10], 15, -1051523), r2 = p(r2, o2, i2, n2, e3[u2 + 1], 21, -2054922799), n2 = p(n2, r2, o2, i2, e3[u2 + 8], 6, 1873313359), i2 = p(i2, n2, r2, o2, e3[u2 + 15], 10, -30611744), o2 = p(o2, i2, n2, r2, e3[u2 + 6], 15, -1560198380), r2 = p(r2, o2, i2, n2, e3[u2 + 13], 21, 1309151649), n2 = p(n2, r2, o2, i2, e3[u2 + 4], 6, -145523070), i2 = p(i2, n2, r2, o2, e3[u2 + 11], 10, -1120210379), o2 = p(o2, i2, n2, r2, e3[u2 + 2], 15, 718787259), r2 = p(r2, o2, i2, n2, e3[u2 + 9], 21, -343485551), n2 = g(n2, s2), r2 = g(r2, a2), o2 = g(o2, f2), i2 = g(i2, l2);
          }
          return Array(n2, r2, o2, i2);
        }
        function s(e3, t2, n2, r2, o2, i2) {
          return g((t2 = g(g(t2, e3), g(r2, i2))) << o2 | t2 >>> 32 - o2, n2);
        }
        function c(e3, t2, n2, r2, o2, i2, u2) {
          return s(t2 & n2 | ~t2 & r2, e3, t2, o2, i2, u2);
        }
        function d(e3, t2, n2, r2, o2, i2, u2) {
          return s(t2 & r2 | n2 & ~r2, e3, t2, o2, i2, u2);
        }
        function h(e3, t2, n2, r2, o2, i2, u2) {
          return s(t2 ^ n2 ^ r2, e3, t2, o2, i2, u2);
        }
        function p(e3, t2, n2, r2, o2, i2, u2) {
          return s(n2 ^ (t2 | ~r2), e3, t2, o2, i2, u2);
        }
        function g(e3, t2) {
          var n2 = (65535 & e3) + (65535 & t2);
          return (e3 >> 16) + (t2 >> 16) + (n2 >> 16) << 16 | 65535 & n2;
        }
        b.exports = function(e3) {
          return t.hash(e3, n, 16);
        };
      }.call(this, w("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, w("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/crypto-browserify/md5.js", "/node_modules/gulp-browserify/node_modules/crypto-browserify");
    }, { "./helpers": 4, buffer: 3, lYpoI2: 11 }], 7: [function(e, l, t) {
      !function(e2, t2, n, r, o, i, u, s, f) {
        l.exports = function(e3) {
          for (var t3, n2 = new Array(e3), r2 = 0; r2 < e3; r2++)
            0 == (3 & r2) && (t3 = 4294967296 * Math.random()), n2[r2] = t3 >>> ((3 & r2) << 3) & 255;
          return n2;
        };
      }.call(this, e("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, e("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/crypto-browserify/rng.js", "/node_modules/gulp-browserify/node_modules/crypto-browserify");
    }, { buffer: 3, lYpoI2: 11 }], 8: [function(c, d, e) {
      !function(e2, t, n, r, o, s, a, f, l) {
        var i = c("./helpers");
        function u(l2, c2) {
          l2[c2 >> 5] |= 128 << 24 - c2 % 32, l2[15 + (c2 + 64 >> 9 << 4)] = c2;
          for (var e3, t2, n2, r2 = Array(80), o2 = 1732584193, i2 = -271733879, u2 = -1732584194, s2 = 271733878, d2 = -1009589776, h = 0; h < l2.length; h += 16) {
            for (var p = o2, g = i2, y = u2, w = s2, b = d2, a2 = 0; a2 < 80; a2++) {
              r2[a2] = a2 < 16 ? l2[h + a2] : v(r2[a2 - 3] ^ r2[a2 - 8] ^ r2[a2 - 14] ^ r2[a2 - 16], 1);
              var f2 = m(m(v(o2, 5), (f2 = i2, t2 = u2, n2 = s2, (e3 = a2) < 20 ? f2 & t2 | ~f2 & n2 : !(e3 < 40) && e3 < 60 ? f2 & t2 | f2 & n2 | t2 & n2 : f2 ^ t2 ^ n2)), m(m(d2, r2[a2]), (e3 = a2) < 20 ? 1518500249 : e3 < 40 ? 1859775393 : e3 < 60 ? -1894007588 : -899497514)), d2 = s2, s2 = u2, u2 = v(i2, 30), i2 = o2, o2 = f2;
            }
            o2 = m(o2, p), i2 = m(i2, g), u2 = m(u2, y), s2 = m(s2, w), d2 = m(d2, b);
          }
          return Array(o2, i2, u2, s2, d2);
        }
        function m(e3, t2) {
          var n2 = (65535 & e3) + (65535 & t2);
          return (e3 >> 16) + (t2 >> 16) + (n2 >> 16) << 16 | 65535 & n2;
        }
        function v(e3, t2) {
          return e3 << t2 | e3 >>> 32 - t2;
        }
        d.exports = function(e3) {
          return i.hash(e3, u, 20, true);
        };
      }.call(this, c("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, c("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/crypto-browserify/sha.js", "/node_modules/gulp-browserify/node_modules/crypto-browserify");
    }, { "./helpers": 4, buffer: 3, lYpoI2: 11 }], 9: [function(c, d, e) {
      !function(e2, t, n, r, u, s, a, f, l) {
        function b(e3, t2) {
          var n2 = (65535 & e3) + (65535 & t2);
          return (e3 >> 16) + (t2 >> 16) + (n2 >> 16) << 16 | 65535 & n2;
        }
        function o(e3, l2) {
          var c2, d2 = new Array(1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298), t2 = new Array(1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225), n2 = new Array(64);
          e3[l2 >> 5] |= 128 << 24 - l2 % 32, e3[15 + (l2 + 64 >> 9 << 4)] = l2;
          for (var r2, o2, h = 0; h < e3.length; h += 16) {
            for (var i2 = t2[0], u2 = t2[1], s2 = t2[2], p = t2[3], a2 = t2[4], g = t2[5], y = t2[6], w = t2[7], f2 = 0; f2 < 64; f2++)
              n2[f2] = f2 < 16 ? e3[f2 + h] : b(b(b((o2 = n2[f2 - 2], m(o2, 17) ^ m(o2, 19) ^ v(o2, 10)), n2[f2 - 7]), (o2 = n2[f2 - 15], m(o2, 7) ^ m(o2, 18) ^ v(o2, 3))), n2[f2 - 16]), c2 = b(b(b(b(w, m(o2 = a2, 6) ^ m(o2, 11) ^ m(o2, 25)), a2 & g ^ ~a2 & y), d2[f2]), n2[f2]), r2 = b(m(r2 = i2, 2) ^ m(r2, 13) ^ m(r2, 22), i2 & u2 ^ i2 & s2 ^ u2 & s2), w = y, y = g, g = a2, a2 = b(p, c2), p = s2, s2 = u2, u2 = i2, i2 = b(c2, r2);
            t2[0] = b(i2, t2[0]), t2[1] = b(u2, t2[1]), t2[2] = b(s2, t2[2]), t2[3] = b(p, t2[3]), t2[4] = b(a2, t2[4]), t2[5] = b(g, t2[5]), t2[6] = b(y, t2[6]), t2[7] = b(w, t2[7]);
          }
          return t2;
        }
        var i = c("./helpers"), m = function(e3, t2) {
          return e3 >>> t2 | e3 << 32 - t2;
        }, v = function(e3, t2) {
          return e3 >>> t2;
        };
        d.exports = function(e3) {
          return i.hash(e3, o, 32, true);
        };
      }.call(this, c("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, c("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/crypto-browserify/sha256.js", "/node_modules/gulp-browserify/node_modules/crypto-browserify");
    }, { "./helpers": 4, buffer: 3, lYpoI2: 11 }], 10: [function(e, t, f) {
      !function(e2, t2, n, r, o, i, u, s, a) {
        f.read = function(e3, t3, n2, r2, o2) {
          var i2, u2, l = 8 * o2 - r2 - 1, c = (1 << l) - 1, d = c >> 1, s2 = -7, a2 = n2 ? o2 - 1 : 0, f2 = n2 ? -1 : 1, o2 = e3[t3 + a2];
          for (a2 += f2, i2 = o2 & (1 << -s2) - 1, o2 >>= -s2, s2 += l; 0 < s2; i2 = 256 * i2 + e3[t3 + a2], a2 += f2, s2 -= 8)
            ;
          for (u2 = i2 & (1 << -s2) - 1, i2 >>= -s2, s2 += r2; 0 < s2; u2 = 256 * u2 + e3[t3 + a2], a2 += f2, s2 -= 8)
            ;
          if (0 === i2)
            i2 = 1 - d;
          else {
            if (i2 === c)
              return u2 ? NaN : 1 / 0 * (o2 ? -1 : 1);
            u2 += Math.pow(2, r2), i2 -= d;
          }
          return (o2 ? -1 : 1) * u2 * Math.pow(2, i2 - r2);
        }, f.write = function(e3, t3, l, n2, r2, c) {
          var o2, i2, u2 = 8 * c - r2 - 1, s2 = (1 << u2) - 1, a2 = s2 >> 1, d = 23 === r2 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, f2 = n2 ? 0 : c - 1, h = n2 ? 1 : -1, c = t3 < 0 || 0 === t3 && 1 / t3 < 0 ? 1 : 0;
          for (t3 = Math.abs(t3), isNaN(t3) || t3 === 1 / 0 ? (i2 = isNaN(t3) ? 1 : 0, o2 = s2) : (o2 = Math.floor(Math.log(t3) / Math.LN2), t3 * (n2 = Math.pow(2, -o2)) < 1 && (o2--, n2 *= 2), 2 <= (t3 += 1 <= o2 + a2 ? d / n2 : d * Math.pow(2, 1 - a2)) * n2 && (o2++, n2 /= 2), s2 <= o2 + a2 ? (i2 = 0, o2 = s2) : 1 <= o2 + a2 ? (i2 = (t3 * n2 - 1) * Math.pow(2, r2), o2 += a2) : (i2 = t3 * Math.pow(2, a2 - 1) * Math.pow(2, r2), o2 = 0)); 8 <= r2; e3[l + f2] = 255 & i2, f2 += h, i2 /= 256, r2 -= 8)
            ;
          for (o2 = o2 << r2 | i2, u2 += r2; 0 < u2; e3[l + f2] = 255 & o2, f2 += h, o2 /= 256, u2 -= 8)
            ;
          e3[l + f2 - h] |= 128 * c;
        };
      }.call(this, e("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, e("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/ieee754/index.js", "/node_modules/gulp-browserify/node_modules/ieee754");
    }, { buffer: 3, lYpoI2: 11 }], 11: [function(e, h, t) {
      !function(e2, t2, n, r, o, f, l, c, d) {
        var i, u, s;
        function a() {
        }
        (e2 = h.exports = {}).nextTick = (u = "undefined" != typeof window && window.setImmediate, s = "undefined" != typeof window && window.postMessage && window.addEventListener, u ? function(e3) {
          return window.setImmediate(e3);
        } : s ? (i = [], window.addEventListener("message", function(e3) {
          var t3 = e3.source;
          t3 !== window && null !== t3 || "process-tick" !== e3.data || (e3.stopPropagation(), 0 < i.length && i.shift()());
        }, true), function(e3) {
          i.push(e3), window.postMessage("process-tick", "*");
        }) : function(e3) {
          setTimeout(e3, 0);
        }), e2.title = "browser", e2.browser = true, e2.env = {}, e2.argv = [], e2.on = a, e2.addListener = a, e2.once = a, e2.off = a, e2.removeListener = a, e2.removeAllListeners = a, e2.emit = a, e2.binding = function(e3) {
          throw new Error("process.binding is not supported");
        }, e2.cwd = function() {
          return "/";
        }, e2.chdir = function(e3) {
          throw new Error("process.chdir is not supported");
        };
      }.call(this, e("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, e("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/process/browser.js", "/node_modules/gulp-browserify/node_modules/process");
    }, { buffer: 3, lYpoI2: 11 }] }, {}, [1])(1);
  });
})(object_hash);
const objectHash = object_hashExports;
var literals = [
  // current
  "precision",
  "highp",
  "mediump",
  "lowp",
  "attribute",
  "const",
  "uniform",
  "varying",
  "break",
  "continue",
  "do",
  "for",
  "while",
  "if",
  "else",
  "in",
  "out",
  "inout",
  "float",
  "int",
  "uint",
  "void",
  "bool",
  "true",
  "false",
  "discard",
  "return",
  "mat2",
  "mat3",
  "mat4",
  "vec2",
  "vec3",
  "vec4",
  "ivec2",
  "ivec3",
  "ivec4",
  "bvec2",
  "bvec3",
  "bvec4",
  "sampler1D",
  "sampler2D",
  "sampler3D",
  "samplerCube",
  "sampler1DShadow",
  "sampler2DShadow",
  "struct",
  "asm",
  "class",
  "union",
  "enum",
  "typedef",
  "template",
  "this",
  "packed",
  "goto",
  "switch",
  "default",
  "inline",
  "noinline",
  "volatile",
  "public",
  "static",
  "extern",
  "external",
  "interface",
  "long",
  "short",
  "double",
  "half",
  "fixed",
  "unsigned",
  "input",
  "output",
  "hvec2",
  "hvec3",
  "hvec4",
  "dvec2",
  "dvec3",
  "dvec4",
  "fvec2",
  "fvec3",
  "fvec4",
  "sampler2DRect",
  "sampler3DRect",
  "sampler2DRectShadow",
  "sizeof",
  "cast",
  "namespace",
  "using"
];
var operators$1 = [
  "<<=",
  ">>=",
  "++",
  "--",
  "<<",
  ">>",
  "<=",
  ">=",
  "==",
  "!=",
  "&&",
  "||",
  "+=",
  "-=",
  "*=",
  "/=",
  "%=",
  "&=",
  "^^",
  "^=",
  "|=",
  "(",
  ")",
  "[",
  "]",
  ".",
  "!",
  "~",
  "*",
  "/",
  "%",
  "+",
  "-",
  "<",
  ">",
  "&",
  "^",
  "|",
  "?",
  ":",
  "=",
  ",",
  ";",
  "{",
  "}"
];
var builtins = [
  // Keep this list sorted
  "abs",
  "acos",
  "all",
  "any",
  "asin",
  "atan",
  "ceil",
  "clamp",
  "cos",
  "cross",
  "dFdx",
  "dFdy",
  "degrees",
  "distance",
  "dot",
  "equal",
  "exp",
  "exp2",
  "faceforward",
  "floor",
  "fract",
  "gl_BackColor",
  "gl_BackLightModelProduct",
  "gl_BackLightProduct",
  "gl_BackMaterial",
  "gl_BackSecondaryColor",
  "gl_ClipPlane",
  "gl_ClipVertex",
  "gl_Color",
  "gl_DepthRange",
  "gl_DepthRangeParameters",
  "gl_EyePlaneQ",
  "gl_EyePlaneR",
  "gl_EyePlaneS",
  "gl_EyePlaneT",
  "gl_Fog",
  "gl_FogCoord",
  "gl_FogFragCoord",
  "gl_FogParameters",
  "gl_FragColor",
  "gl_FragCoord",
  "gl_FragData",
  "gl_FragDepth",
  "gl_FragDepthEXT",
  "gl_FrontColor",
  "gl_FrontFacing",
  "gl_FrontLightModelProduct",
  "gl_FrontLightProduct",
  "gl_FrontMaterial",
  "gl_FrontSecondaryColor",
  "gl_LightModel",
  "gl_LightModelParameters",
  "gl_LightModelProducts",
  "gl_LightProducts",
  "gl_LightSource",
  "gl_LightSourceParameters",
  "gl_MaterialParameters",
  "gl_MaxClipPlanes",
  "gl_MaxCombinedTextureImageUnits",
  "gl_MaxDrawBuffers",
  "gl_MaxFragmentUniformComponents",
  "gl_MaxLights",
  "gl_MaxTextureCoords",
  "gl_MaxTextureImageUnits",
  "gl_MaxTextureUnits",
  "gl_MaxVaryingFloats",
  "gl_MaxVertexAttribs",
  "gl_MaxVertexTextureImageUnits",
  "gl_MaxVertexUniformComponents",
  "gl_ModelViewMatrix",
  "gl_ModelViewMatrixInverse",
  "gl_ModelViewMatrixInverseTranspose",
  "gl_ModelViewMatrixTranspose",
  "gl_ModelViewProjectionMatrix",
  "gl_ModelViewProjectionMatrixInverse",
  "gl_ModelViewProjectionMatrixInverseTranspose",
  "gl_ModelViewProjectionMatrixTranspose",
  "gl_MultiTexCoord0",
  "gl_MultiTexCoord1",
  "gl_MultiTexCoord2",
  "gl_MultiTexCoord3",
  "gl_MultiTexCoord4",
  "gl_MultiTexCoord5",
  "gl_MultiTexCoord6",
  "gl_MultiTexCoord7",
  "gl_Normal",
  "gl_NormalMatrix",
  "gl_NormalScale",
  "gl_ObjectPlaneQ",
  "gl_ObjectPlaneR",
  "gl_ObjectPlaneS",
  "gl_ObjectPlaneT",
  "gl_Point",
  "gl_PointCoord",
  "gl_PointParameters",
  "gl_PointSize",
  "gl_Position",
  "gl_ProjectionMatrix",
  "gl_ProjectionMatrixInverse",
  "gl_ProjectionMatrixInverseTranspose",
  "gl_ProjectionMatrixTranspose",
  "gl_SecondaryColor",
  "gl_TexCoord",
  "gl_TextureEnvColor",
  "gl_TextureMatrix",
  "gl_TextureMatrixInverse",
  "gl_TextureMatrixInverseTranspose",
  "gl_TextureMatrixTranspose",
  "gl_Vertex",
  "greaterThan",
  "greaterThanEqual",
  "inversesqrt",
  "length",
  "lessThan",
  "lessThanEqual",
  "log",
  "log2",
  "matrixCompMult",
  "max",
  "min",
  "mix",
  "mod",
  "normalize",
  "not",
  "notEqual",
  "pow",
  "radians",
  "reflect",
  "refract",
  "sign",
  "sin",
  "smoothstep",
  "sqrt",
  "step",
  "tan",
  "texture2D",
  "texture2DLod",
  "texture2DProj",
  "texture2DProjLod",
  "textureCube",
  "textureCubeLod",
  "texture2DLodEXT",
  "texture2DProjLodEXT",
  "textureCubeLodEXT",
  "texture2DGradEXT",
  "texture2DProjGradEXT",
  "textureCubeGradEXT"
];
var v100$1 = literals;
var literals300es$1 = v100$1.slice().concat([
  "layout",
  "centroid",
  "smooth",
  "case",
  "mat2x2",
  "mat2x3",
  "mat2x4",
  "mat3x2",
  "mat3x3",
  "mat3x4",
  "mat4x2",
  "mat4x3",
  "mat4x4",
  "uvec2",
  "uvec3",
  "uvec4",
  "samplerCubeShadow",
  "sampler2DArray",
  "sampler2DArrayShadow",
  "isampler2D",
  "isampler3D",
  "isamplerCube",
  "isampler2DArray",
  "usampler2D",
  "usampler3D",
  "usamplerCube",
  "usampler2DArray",
  "coherent",
  "restrict",
  "readonly",
  "writeonly",
  "resource",
  "atomic_uint",
  "noperspective",
  "patch",
  "sample",
  "subroutine",
  "common",
  "partition",
  "active",
  "filter",
  "image1D",
  "image2D",
  "image3D",
  "imageCube",
  "iimage1D",
  "iimage2D",
  "iimage3D",
  "iimageCube",
  "uimage1D",
  "uimage2D",
  "uimage3D",
  "uimageCube",
  "image1DArray",
  "image2DArray",
  "iimage1DArray",
  "iimage2DArray",
  "uimage1DArray",
  "uimage2DArray",
  "image1DShadow",
  "image2DShadow",
  "image1DArrayShadow",
  "image2DArrayShadow",
  "imageBuffer",
  "iimageBuffer",
  "uimageBuffer",
  "sampler1DArray",
  "sampler1DArrayShadow",
  "isampler1D",
  "isampler1DArray",
  "usampler1D",
  "usampler1DArray",
  "isampler2DRect",
  "usampler2DRect",
  "samplerBuffer",
  "isamplerBuffer",
  "usamplerBuffer",
  "sampler2DMS",
  "isampler2DMS",
  "usampler2DMS",
  "sampler2DMSArray",
  "isampler2DMSArray",
  "usampler2DMSArray"
]);
var v100 = builtins;
v100 = v100.slice().filter(function(b) {
  return !/^(gl\_|texture)/.test(b);
});
var builtins300es$1 = v100.concat([
  // the updated gl_ constants
  "gl_VertexID",
  "gl_InstanceID",
  "gl_Position",
  "gl_PointSize",
  "gl_FragCoord",
  "gl_FrontFacing",
  "gl_FragDepth",
  "gl_PointCoord",
  "gl_MaxVertexAttribs",
  "gl_MaxVertexUniformVectors",
  "gl_MaxVertexOutputVectors",
  "gl_MaxFragmentInputVectors",
  "gl_MaxVertexTextureImageUnits",
  "gl_MaxCombinedTextureImageUnits",
  "gl_MaxTextureImageUnits",
  "gl_MaxFragmentUniformVectors",
  "gl_MaxDrawBuffers",
  "gl_MinProgramTexelOffset",
  "gl_MaxProgramTexelOffset",
  "gl_DepthRangeParameters",
  "gl_DepthRange",
  "trunc",
  "round",
  "roundEven",
  "isnan",
  "isinf",
  "floatBitsToInt",
  "floatBitsToUint",
  "intBitsToFloat",
  "uintBitsToFloat",
  "packSnorm2x16",
  "unpackSnorm2x16",
  "packUnorm2x16",
  "unpackUnorm2x16",
  "packHalf2x16",
  "unpackHalf2x16",
  "outerProduct",
  "transpose",
  "determinant",
  "inverse",
  "texture",
  "textureSize",
  "textureProj",
  "textureLod",
  "textureOffset",
  "texelFetch",
  "texelFetchOffset",
  "textureProjOffset",
  "textureLodOffset",
  "textureProjLod",
  "textureProjLodOffset",
  "textureGrad",
  "textureGradOffset",
  "textureProjGrad",
  "textureProjGradOffset"
]);
var glslTokenizer = tokenize$1;
var literals100 = literals, operators = operators$1, builtins100 = builtins, literals300es = literals300es$1, builtins300es = builtins300es$1;
var NORMAL = 999, TOKEN = 9999, BLOCK_COMMENT = 0, LINE_COMMENT = 1, PREPROCESSOR = 2, OPERATOR = 3, INTEGER = 4, FLOAT = 5, IDENT = 6, BUILTIN = 7, KEYWORD = 8, WHITESPACE = 9, EOF = 10, HEX = 11;
var map = [
  "block-comment",
  "line-comment",
  "preprocessor",
  "operator",
  "integer",
  "float",
  "ident",
  "builtin",
  "keyword",
  "whitespace",
  "eof",
  "integer"
];
function tokenize$1(opt) {
  var i = 0, total = 0, mode = NORMAL, c, last, content = [], tokens = [], line = 1, col = 0, start = 0, isnum = false, isoperator = false, input = "", len;
  opt = opt || {};
  var allBuiltins = builtins100;
  var allLiterals = literals100;
  if (opt.version === "300 es") {
    allBuiltins = builtins300es;
    allLiterals = literals300es;
  }
  var builtinsDict = {}, literalsDict = {};
  for (var i = 0; i < allBuiltins.length; i++) {
    builtinsDict[allBuiltins[i]] = true;
  }
  for (var i = 0; i < allLiterals.length; i++) {
    literalsDict[allLiterals[i]] = true;
  }
  return function(data) {
    tokens = [];
    if (data !== null)
      return write(data);
    return end();
  };
  function token(data) {
    if (data.length) {
      tokens.push({
        type: map[mode],
        data,
        position: start,
        line,
        column: col
      });
    }
  }
  function write(chunk) {
    i = 0;
    if (chunk.toString)
      chunk = chunk.toString();
    input += chunk.replace(/\r\n/g, "\n");
    len = input.length;
    var last2;
    while (c = input[i], i < len) {
      last2 = i;
      switch (mode) {
        case BLOCK_COMMENT:
          i = block_comment();
          break;
        case LINE_COMMENT:
          i = line_comment();
          break;
        case PREPROCESSOR:
          i = preprocessor();
          break;
        case OPERATOR:
          i = operator();
          break;
        case INTEGER:
          i = integer();
          break;
        case HEX:
          i = hex();
          break;
        case FLOAT:
          i = decimal();
          break;
        case TOKEN:
          i = readtoken();
          break;
        case WHITESPACE:
          i = whitespace();
          break;
        case NORMAL:
          i = normal();
          break;
      }
      if (last2 !== i) {
        switch (input[last2]) {
          case "\n":
            col = 0;
            ++line;
            break;
          default:
            ++col;
            break;
        }
      }
    }
    total += i;
    input = input.slice(i);
    return tokens;
  }
  function end(chunk) {
    if (content.length) {
      token(content.join(""));
    }
    mode = EOF;
    token("(eof)");
    return tokens;
  }
  function normal() {
    content = content.length ? [] : content;
    if (last === "/" && c === "*") {
      start = total + i - 1;
      mode = BLOCK_COMMENT;
      last = c;
      return i + 1;
    }
    if (last === "/" && c === "/") {
      start = total + i - 1;
      mode = LINE_COMMENT;
      last = c;
      return i + 1;
    }
    if (c === "#") {
      mode = PREPROCESSOR;
      start = total + i;
      return i;
    }
    if (/\s/.test(c)) {
      mode = WHITESPACE;
      start = total + i;
      return i;
    }
    isnum = /\d/.test(c);
    isoperator = /[^\w_]/.test(c);
    start = total + i;
    mode = isnum ? INTEGER : isoperator ? OPERATOR : TOKEN;
    return i;
  }
  function whitespace() {
    if (/[^\s]/g.test(c)) {
      token(content.join(""));
      mode = NORMAL;
      return i;
    }
    content.push(c);
    last = c;
    return i + 1;
  }
  function preprocessor() {
    if ((c === "\r" || c === "\n") && last !== "\\") {
      token(content.join(""));
      mode = NORMAL;
      return i;
    }
    content.push(c);
    last = c;
    return i + 1;
  }
  function line_comment() {
    return preprocessor();
  }
  function block_comment() {
    if (c === "/" && last === "*") {
      content.push(c);
      token(content.join(""));
      mode = NORMAL;
      return i + 1;
    }
    content.push(c);
    last = c;
    return i + 1;
  }
  function operator() {
    if (last === "." && /\d/.test(c)) {
      mode = FLOAT;
      return i;
    }
    if (last === "/" && c === "*") {
      mode = BLOCK_COMMENT;
      return i;
    }
    if (last === "/" && c === "/") {
      mode = LINE_COMMENT;
      return i;
    }
    if (c === "." && content.length) {
      while (determine_operator(content))
        ;
      mode = FLOAT;
      return i;
    }
    if (c === ";" || c === ")" || c === "(") {
      if (content.length)
        while (determine_operator(content))
          ;
      token(c);
      mode = NORMAL;
      return i + 1;
    }
    var is_composite_operator = content.length === 2 && c !== "=";
    if (/[\w_\d\s]/.test(c) || is_composite_operator) {
      while (determine_operator(content))
        ;
      mode = NORMAL;
      return i;
    }
    content.push(c);
    last = c;
    return i + 1;
  }
  function determine_operator(buf) {
    var j = 0, idx, res;
    do {
      idx = operators.indexOf(buf.slice(0, buf.length + j).join(""));
      res = operators[idx];
      if (idx === -1) {
        if (j-- + buf.length > 0)
          continue;
        res = buf.slice(0, 1).join("");
      }
      token(res);
      start += res.length;
      content = content.slice(res.length);
      return content.length;
    } while (1);
  }
  function hex() {
    if (/[^a-fA-F0-9]/.test(c)) {
      token(content.join(""));
      mode = NORMAL;
      return i;
    }
    content.push(c);
    last = c;
    return i + 1;
  }
  function integer() {
    if (c === ".") {
      content.push(c);
      mode = FLOAT;
      last = c;
      return i + 1;
    }
    if (/[eE]/.test(c)) {
      content.push(c);
      mode = FLOAT;
      last = c;
      return i + 1;
    }
    if (c === "x" && content.length === 1 && content[0] === "0") {
      mode = HEX;
      content.push(c);
      last = c;
      return i + 1;
    }
    if (/[^\d]/.test(c)) {
      token(content.join(""));
      mode = NORMAL;
      return i;
    }
    content.push(c);
    last = c;
    return i + 1;
  }
  function decimal() {
    if (c === "f") {
      content.push(c);
      last = c;
      i += 1;
    }
    if (/[eE]/.test(c)) {
      content.push(c);
      last = c;
      return i + 1;
    }
    if ((c === "-" || c === "+") && /[eE]/.test(last)) {
      content.push(c);
      last = c;
      return i + 1;
    }
    if (/[^\d]/.test(c)) {
      token(content.join(""));
      mode = NORMAL;
      return i;
    }
    content.push(c);
    last = c;
    return i + 1;
  }
  function readtoken() {
    if (/[^\d\w_]/.test(c)) {
      var contentstr = content.join("");
      if (literalsDict[contentstr]) {
        mode = KEYWORD;
      } else if (builtinsDict[contentstr]) {
        mode = BUILTIN;
      } else {
        mode = IDENT;
      }
      token(content.join(""));
      mode = NORMAL;
      return i;
    }
    content.push(c);
    last = c;
    return i + 1;
  }
}
var tokenize = glslTokenizer;
var string = tokenizeString;
function tokenizeString(str, opt) {
  var generator = tokenize(opt);
  var tokens = [];
  tokens = tokens.concat(generator(str));
  tokens = tokens.concat(generator(null));
  return tokens;
}
var glslTokenString = toString;
function toString(tokens) {
  var output = [];
  for (var i = 0; i < tokens.length; i++) {
    if (tokens[i].type === "eof")
      continue;
    output.push(tokens[i].data);
  }
  return output.join("");
}
var glslTokenFunctions = functions;
function functions(tokens) {
  var returnType = null;
  var defnName = null;
  var braceDepth = 0;
  var braceStart = 0;
  var defnStart = 0;
  var argFinish = 0;
  var argStart = 0;
  var output = [];
  var i, j, token;
  for (i = 0, j; i < tokens.length; i++) {
    token = tokens[i];
    if (token.data === "{") {
      if (braceDepth && braceDepth++)
        continue;
      j = findPrevious(i, findOp(")"), findOp());
      if (j < 0)
        continue;
      argFinish = j;
      j = findPrevious(j, findOp("("), findOp(")"));
      if (j < 0)
        continue;
      argStart = j;
      j = findPrevious(j, findGlyph);
      if (j < 0)
        continue;
      if (tokens[j].type !== "ident")
        continue;
      defnName = tokens[j].data;
      j = findPrevious(j, findGlyph);
      if (j < 0)
        continue;
      braceDepth = 1;
      braceStart = i;
      returnType = tokens[j].data;
      defnStart = j;
      var k = findPrevious(j, findGlyph);
      switch (tokens[k] && tokens[k].data) {
        case "lowp":
        case "highp":
        case "mediump":
          defnStart = k;
      }
    } else if (braceDepth && token.data === "}") {
      if (--braceDepth)
        continue;
      output.push({
        name: defnName,
        type: returnType,
        body: [braceStart + 1, i],
        args: [argStart, argFinish + 1],
        outer: [defnStart, i + 1]
      });
    }
  }
  for (i = 0; i < tokens.length; i++) {
    token = tokens[i];
    if (token.data === ";") {
      j = findPrevious(i, findOp(")"), findOp());
      if (j < 0)
        continue;
      argFinish = j;
      j = findPrevious(j, findOp("("), findOp(")"));
      if (j < 0)
        continue;
      argStart = j;
      j = findPrevious(j, findGlyph);
      if (j < 0)
        continue;
      if (tokens[j].type !== "ident")
        continue;
      defnName = tokens[j].data;
      j = findPrevious(j, findGlyph);
      if (j < 0)
        continue;
      if (tokens[j].type === "operator")
        continue;
      if (tokens[j].data === "return")
        continue;
      returnType = tokens[j].data;
      output.push({
        name: defnName,
        type: returnType,
        body: false,
        args: [argStart, argFinish + 1],
        outer: [j, i + 1]
      });
    }
  }
  return output.sort(function(a, b) {
    return a.outer[0] - b.outer[0];
  });
  function findPrevious(start, match, bail) {
    for (var i2 = start - 1; i2 >= 0; i2--) {
      if (match(tokens[i2]))
        return i2;
      if (bail && bail(tokens[i2]))
        return -1;
    }
    return -1;
  }
}
function findOp(data) {
  return function(token) {
    return token.type === "operator" && (!data || token.data === data);
  };
}
function findGlyph(token) {
  return token.type !== "whitespace";
}
function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null)
    return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== void 0) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object")
      return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), true).forEach(function(key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null)
    return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0)
      continue;
    target[key] = source[key];
  }
  return target;
}
function _objectWithoutProperties(source, excluded) {
  if (source == null)
    return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0)
        continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key))
        continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _assertThisInitialized(self2) {
  if (self2 === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self2;
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf(o, p);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass)
    _setPrototypeOf(subClass, superClass);
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf(o);
}
function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct)
    return false;
  if (Reflect.construct.sham)
    return false;
  if (typeof Proxy === "function")
    return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
    return true;
  } catch (e) {
    return false;
  }
}
function _possibleConstructorReturn(self2, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self2);
}
function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived), result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  };
}
var keywords = {
  position: "csm_Position",
  positionRaw: "csm_PositionRaw",
  pointSize: "csm_PointSize",
  fragColor: "csm_FragColor",
  // PBR
  diffuseColor: "csm_DiffuseColor",
  // Color + alpha
  normal: "csm_Normal",
  // Normal
  roughness: "csm_Roughness",
  // Roughness
  metalness: "csm_Metalness",
  // Metalness
  emissive: "csm_Emissive",
  // Emissive
  ao: "csm_AO",
  // AO
  bump: "csm_Bump",
  // Bump
  depthAlpha: "csm_DepthAlpha"
  // Depth
};
var _defaultPatchMap, _shaderMaterial_Patch;
var defaultPatchMap = (_defaultPatchMap = {}, _defineProperty(_defaultPatchMap, "".concat(keywords.normal), {
  "#include <beginnormal_vertex>": "\n    vec3 objectNormal = ".concat(keywords.normal, ";\n    #ifdef USE_TANGENT\n	    vec3 objectTangent = vec3( tangent.xyz );\n    #endif\n    ")
}), _defineProperty(_defaultPatchMap, "".concat(keywords.position), {
  "#include <begin_vertex>": "\n    vec3 transformed = ".concat(keywords.position, ";\n  ")
}), _defineProperty(_defaultPatchMap, "".concat(keywords.positionRaw), {
  "#include <begin_vertex>": "\n    vec4 csm_internal_positionUnprojected = ".concat(keywords.positionRaw, ";\n    mat4x4 csm_internal_unprojectMatrix = projectionMatrix * modelViewMatrix;\n    #ifdef USE_INSTANCING\n      csm_internal_unprojectMatrix = csm_internal_unprojectMatrix * instanceMatrix;\n    #endif\n    csm_internal_positionUnprojected = inverse(csm_internal_unprojectMatrix) * csm_internal_positionUnprojected;\n    vec3 transformed = csm_internal_positionUnprojected.xyz;\n  ")
}), _defineProperty(_defaultPatchMap, "".concat(keywords.pointSize), {
  "gl_PointSize = size;": "\n    gl_PointSize = ".concat(keywords.pointSize, ";\n    ")
}), _defineProperty(_defaultPatchMap, "".concat(keywords.diffuseColor), {
  "#include <color_fragment>": "\n    #include <color_fragment>\n    diffuseColor = ".concat(keywords.diffuseColor, ";\n  ")
}), _defineProperty(_defaultPatchMap, "".concat(keywords.fragColor), {
  "#include <dithering_fragment>": "\n    #include <dithering_fragment>\n    gl_FragColor  = ".concat(keywords.fragColor, ";\n  ")
}), _defineProperty(_defaultPatchMap, "".concat(keywords.emissive), {
  "vec3 totalEmissiveRadiance = emissive;": "\n    vec3 totalEmissiveRadiance = ".concat(keywords.emissive, ";\n    ")
}), _defineProperty(_defaultPatchMap, "".concat(keywords.roughness), {
  "#include <roughnessmap_fragment>": "\n    #include <roughnessmap_fragment>\n    roughnessFactor = ".concat(keywords.roughness, ";\n    ")
}), _defineProperty(_defaultPatchMap, "".concat(keywords.metalness), {
  "#include <metalnessmap_fragment>": "\n    #include <metalnessmap_fragment>\n    metalnessFactor = ".concat(keywords.metalness, ";\n    ")
}), _defineProperty(_defaultPatchMap, "".concat(keywords.ao), {
  "#include <aomap_fragment>": "\n    #include <aomap_fragment>\n    reflectedLight.indirectDiffuse *= 1. - ".concat(keywords.ao, ";\n    ")
}), _defineProperty(_defaultPatchMap, "".concat(keywords.bump), {
  "#include <normal_fragment_maps>": "\n    #include <normal_fragment_maps>\n\n    vec3 csm_internal_orthogonal = ".concat(keywords.bump, " - (dot(").concat(keywords.bump, ", normal) * normal);\n    vec3 csm_internal_projectedbump = mat3(csm_internal_vModelViewMatrix) * csm_internal_orthogonal;\n    normal = normalize(normal - csm_internal_projectedbump);\n    ")
}), _defineProperty(_defaultPatchMap, "".concat(keywords.depthAlpha), {
  "gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );": "\n      gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity * ".concat(keywords.depthAlpha, " );\n    "),
  "gl_FragColor = packDepthToRGBA( fragCoordZ );": "\n      gl_FragColor = packDepthToRGBA( fragCoordZ );\n      gl_FragColor.a *= ".concat(keywords.depthAlpha, ";\n    ")
}), _defaultPatchMap);
var shaderMaterial_PatchMap = (_shaderMaterial_Patch = {}, _defineProperty(_shaderMaterial_Patch, "".concat(keywords.position), {
  "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );": "\n    gl_Position = projectionMatrix * modelViewMatrix * vec4( ".concat(keywords.position, ", 1.0 );\n  ")
}), _defineProperty(_shaderMaterial_Patch, "".concat(keywords.positionRaw), {
  "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );": "\n    gl_Position = ".concat(keywords.position, ";\n  ")
}), _defineProperty(_shaderMaterial_Patch, "".concat(keywords.diffuseColor), {
  "gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );": "\n    gl_FragColor = ".concat(keywords.diffuseColor, ";\n  ")
}), _defineProperty(_shaderMaterial_Patch, "".concat(keywords.fragColor), {
  "gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );": "\n    gl_FragColor = ".concat(keywords.fragColor, ";\n  ")
}), _shaderMaterial_Patch);
var defaultDefinitions = (
  /* glsl */
  "\n\n#ifdef IS_VERTEX\n    // csm_Position & csm_PositionRaw\n    #ifdef IS_UNKNOWN\n        vec3 csm_Position = vec3(0.0);\n        vec4 csm_PositionRaw = vec4(0.0);\n        vec3 csm_Normal = vec3(0.0);\n    #else\n        vec3 csm_Position = position;\n        vec4 csm_PositionRaw = projectionMatrix * modelViewMatrix * vec4(position, 1.);\n        vec3 csm_Normal = normal;\n    #endif\n\n    // csm_PointSize\n    #ifdef IS_POINTSMATERIAL\n        float csm_PointSize = size;\n    #endif\n#else\n    // csm_DiffuseColor & csm_FragColor\n    #if defined IS_UNKNOWN || defined IS_SHADERMATERIAL || defined IS_MESHDEPTHMATERIAL || defined IS_MESHNORMALMATERIAL || defined IS_SHADOWMATERIAL\n        vec4 csm_DiffuseColor = vec4(1.0, 0.0, 1.0, 1.0);\n        vec4 csm_FragColor = vec4(1.0, 0.0, 1.0, 1.0);\n    #else\n        #ifdef USE_MAP\n            vec4 _csm_sampledDiffuseColor = texture2D(map, vMapUv);\n\n            #ifdef DECODE_VIDEO_TEXTURE\n            // inline sRGB decode (TODO: Remove this code when https://crbug.com/1256340 is solved)\n            _csm_sampledDiffuseColor = vec4(mix(pow(_csm_sampledDiffuseColor.rgb * 0.9478672986 + vec3(0.0521327014), vec3(2.4)), _csm_sampledDiffuseColor.rgb * 0.0773993808, vec3(lessThanEqual(_csm_sampledDiffuseColor.rgb, vec3(0.04045)))), _csm_sampledDiffuseColor.w);\n            #endif\n\n            vec4 csm_DiffuseColor = vec4(diffuse, opacity) * _csm_sampledDiffuseColor;\n            vec4 csm_FragColor = vec4(diffuse, opacity) * _csm_sampledDiffuseColor;\n        #else\n            vec4 csm_DiffuseColor = vec4(diffuse, opacity);\n            vec4 csm_FragColor = vec4(diffuse, opacity);\n        #endif\n    #endif\n\n    // csm_Emissive, csm_Roughness, csm_Metalness\n    #if defined IS_MESHSTANDARDMATERIAL || defined IS_MESHPHYSICALMATERIAL\n        vec3 csm_Emissive = emissive;\n        float csm_Roughness = roughness;\n        float csm_Metalness = metalness;\n    #endif\n\n    // csm_AO\n    #if defined IS_MESHSTANDARDMATERIAL || defined IS_MESHPHYSICALMATERIAL || defined IS_MESHBASICMATERIAL || defined IS_MESHLAMBERTMATERIAL || defined IS_MESHPHONGMATERIAL || defined IS_MESHTOONMATERIAL\n        float csm_AO = 0.0;\n    #endif\n\n    // csm_Bump\n    #if defined IS_MESHLAMBERTMATERIAL || defined IS_MESHMATCAPMATERIAL || defined IS_MESHNORMALMATERIAL || defined IS_MESHPHONGMATERIAL || defined IS_MESHPHYSICALMATERIAL || defined IS_MESHSTANDARDMATERIAL || defined IS_MESHTOONMATERIAL || defined IS_SHADOWMATERIAL \n        vec3 csm_Bump = vec3(0.0);\n    #endif\n\n    float csm_DepthAlpha = 1.0;\n#endif\n"
);
var defaultVertDefinitions = (
  /* glsl */
  "\n    varying mat4 csm_internal_vModelViewMatrix;\n"
);
var defaultVertMain = (
  /* glsl */
  "\n    csm_internal_vModelViewMatrix = modelViewMatrix;\n"
);
var defaultFragDefinitions = (
  /* glsl */
  "\n    varying mat4 csm_internal_vModelViewMatrix;\n"
);
var defaultFragMain = (
  /* glsl */
  "\n    \n"
);
var _defaultAvailabilityM;
var defaultAvailabilityMap = (_defaultAvailabilityM = {}, _defineProperty(_defaultAvailabilityM, "".concat(keywords.position), "*"), _defineProperty(_defaultAvailabilityM, "".concat(keywords.positionRaw), "*"), _defineProperty(_defaultAvailabilityM, "".concat(keywords.normal), "*"), _defineProperty(_defaultAvailabilityM, "".concat(keywords.pointSize), ["PointsMaterial"]), _defineProperty(_defaultAvailabilityM, "".concat(keywords.diffuseColor), "*"), _defineProperty(_defaultAvailabilityM, "".concat(keywords.fragColor), "*"), _defineProperty(_defaultAvailabilityM, "".concat(keywords.emissive), ["MeshStandardMaterial", "MeshPhysicalMaterial"]), _defineProperty(_defaultAvailabilityM, "".concat(keywords.roughness), ["MeshStandardMaterial", "MeshPhysicalMaterial"]), _defineProperty(_defaultAvailabilityM, "".concat(keywords.metalness), ["MeshStandardMaterial", "MeshPhysicalMaterial"]), _defineProperty(_defaultAvailabilityM, "".concat(keywords.ao), ["MeshStandardMaterial", "MeshPhysicalMaterial", "MeshBasicMaterial", "MeshLambertMaterial", "MeshPhongMaterial", "MeshToonMaterial"]), _defineProperty(_defaultAvailabilityM, "".concat(keywords.bump), ["MeshLambertMaterial", "MeshMatcapMaterial", "MeshNormalMaterial", "MeshPhongMaterial", "MeshPhysicalMaterial", "MeshStandardMaterial", "MeshToonMaterial", "ShadowMaterial"]), _defineProperty(_defaultAvailabilityM, "".concat(keywords.depthAlpha), "*"), _defaultAvailabilityM);
var _excluded = ["baseMaterial", "fragmentShader", "vertexShader", "uniforms", "patchMap", "cacheKey", "silent"];
var replaceAll = function replaceAll2(str, find, rep) {
  return str.split(find).join(rep);
};
var escapeRegExpMatch = function escapeRegExpMatch2(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
};
var isExactMatch = function isExactMatch2(str, match) {
  return new RegExp("\\b".concat(escapeRegExpMatch(match), "\\b")).test(str);
};
function isConstructor(f) {
  try {
    new f();
  } catch (err) {
    if (err.message.indexOf("is not a constructor") >= 0) {
      return false;
    }
  }
  return true;
}
function copyObject(target, source) {
  var silent = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
  Object.assign(target, source);
  var proto = Object.getPrototypeOf(source);
  Object.entries(Object.getOwnPropertyDescriptors(proto)).filter(function(e) {
    var isGetter = typeof e[1].get === "function";
    var isSetter = typeof e[1].set === "function";
    var isFunction = typeof e[1].value === "function";
    var isConstructor2 = e[0] === "constructor";
    return (isGetter || isSetter || isFunction) && !isConstructor2;
  }).forEach(function(val) {
    if (typeof target[val[0]] === "function") {
      if (!silent)
        console.warn("Function ".concat(val[0], " already exists on CSM, renaming to base_").concat(val[0]));
      var baseName = "base_".concat(val[0]);
      target[baseName] = val[1].value.bind(target);
      return;
    }
    Object.defineProperty(target, val[0], val[1]);
  });
}
function isFunctionEmpty(fn) {
  var fnString = fn.toString().trim();
  var fnBody = fnString.substring(fnString.indexOf("{") + 1, fnString.lastIndexOf("}"));
  return fnBody.trim().length === 0;
}
function stripSpaces(str) {
  return str.replace(/\s/g, "");
}
function replaceLastOccurrence(str, find, rep) {
  var index = str.lastIndexOf(find);
  if (index === -1) {
    return str;
  }
  return str.substring(0, index) + rep + str.substring(index + find.length);
}
var CustomShaderMaterial = /* @__PURE__ */ function(_THREE$Material) {
  _inherits(CustomShaderMaterial2, _THREE$Material);
  var _super = _createSuper(CustomShaderMaterial2);
  function CustomShaderMaterial2(_ref) {
    var _this;
    var baseMaterial = _ref.baseMaterial, fragmentShader = _ref.fragmentShader, vertexShader = _ref.vertexShader, uniforms = _ref.uniforms, patchMap = _ref.patchMap, cacheKey = _ref.cacheKey, silent = _ref.silent, opts = _objectWithoutProperties(_ref, _excluded);
    _classCallCheck(this, CustomShaderMaterial2);
    var base;
    if (isConstructor(baseMaterial)) {
      base = new baseMaterial(opts);
    } else {
      base = baseMaterial;
      Object.assign(base, opts);
    }
    if (base.type === "RawShaderMaterial") {
      throw new Error("CustomShaderMaterial does not support RawShaderMaterial");
    }
    _this = _super.call(this);
    copyObject(_assertThisInitialized(_this), base, silent);
    _this.__csm = {
      patchMap: patchMap || {},
      fragmentShader: fragmentShader || "",
      vertexShader: vertexShader || "",
      cacheKey,
      baseMaterial,
      instanceID: MathUtils.generateUUID(),
      type: base.type,
      isAlreadyExtended: !isFunctionEmpty(base.onBeforeCompile),
      cacheHash: "",
      silent
    };
    _this.uniforms = _objectSpread2(_objectSpread2({}, _this.uniforms || {}), uniforms || {});
    {
      var _this$__csm = _this.__csm, _fragmentShader = _this$__csm.fragmentShader, _vertexShader = _this$__csm.vertexShader;
      var _uniforms = _this.uniforms;
      _this.__csm.cacheHash = _this.getCacheHash();
      _this.generateMaterial(_fragmentShader, _vertexShader, _uniforms);
    }
    return _this;
  }
  _createClass(CustomShaderMaterial2, [{
    key: "update",
    value: function update() {
      var opts = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      this.uniforms = opts.uniforms || this.uniforms;
      Object.assign(this.__csm, opts);
      var _this$__csm2 = this.__csm, fragmentShader = _this$__csm2.fragmentShader, vertexShader = _this$__csm2.vertexShader;
      var uniforms = this.uniforms;
      var newHash = this.getCacheHash();
      this.__csm.cacheHash = newHash;
      this.generateMaterial(fragmentShader, vertexShader, uniforms);
    }
    /**
     * Returns a new instance of this material with the same options.
     *
     * @returns A clone of this material.
     */
  }, {
    key: "clone",
    value: function clone() {
      var opts = {
        baseMaterial: this.__csm.baseMaterial,
        fragmentShader: this.__csm.fragmentShader,
        vertexShader: this.__csm.vertexShader,
        uniforms: this.uniforms,
        silent: this.__csm.silent,
        patchMap: this.__csm.patchMap,
        cacheKey: this.__csm.cacheKey
      };
      var clone2 = new this.constructor(opts);
      Object.assign(this, clone2);
      return clone2;
    }
    /**
     * Internally calculates the cache key for this instance of CSM.
     * If no specific CSM inputs are provided, the cache key is the same as the default
     * cache key, i.e. `baseMaterial.onBeforeCompile.toString()`. Not meant to be called directly.
     *
     * This method is quite expensive owing to the hashing function and string manip.
     *
     * TODO:
     * - Optimize string manip.
     * - Find faster hash function
     *
     * @returns {string} A cache key for this instance of CSM.
     */
  }, {
    key: "getCacheHash",
    value: function getCacheHash() {
      var _this$__csm3 = this.__csm, fragmentShader = _this$__csm3.fragmentShader, vertexShader = _this$__csm3.vertexShader;
      var uniforms = this.uniforms;
      var serializedUniforms = Object.values(uniforms).reduce(function(prev, _ref2) {
        var value = _ref2.value;
        return prev + JSON.stringify(value);
      }, "");
      var hashInp = stripSpaces(fragmentShader) + stripSpaces(vertexShader) + serializedUniforms;
      return hashInp.trim().length > 0 ? objectHash(hashInp) : this.customProgramCacheKey();
    }
    /**
     * Does the internal shader generation. Not meant to be called directly.
     *
     * @param fragmentShader
     * @param vertexShader
     * @param uniforms
     */
  }, {
    key: "generateMaterial",
    value: function generateMaterial(fragmentShader, vertexShader, uniforms) {
      var _this2 = this;
      var parsedFragmentShader = this.parseShader(fragmentShader);
      var parsedVertexShader = this.parseShader(vertexShader);
      this.uniforms = uniforms || {};
      this.customProgramCacheKey = function() {
        return _this2.__csm.cacheHash;
      };
      var customOnBeforeCompile = function customOnBeforeCompile2(shader) {
        try {
          if (parsedFragmentShader) {
            var patchedFragmentShader = _this2.patchShader(parsedFragmentShader, shader.fragmentShader, true);
            shader.fragmentShader = _this2.getMaterialDefine() + patchedFragmentShader;
          }
          if (parsedVertexShader) {
            var patchedVertexShader = _this2.patchShader(parsedVertexShader, shader.vertexShader);
            shader.vertexShader = "#define IS_VERTEX;\n" + patchedVertexShader;
            shader.vertexShader = _this2.getMaterialDefine() + shader.vertexShader;
          }
          shader.uniforms = _objectSpread2(_objectSpread2({}, shader.uniforms), _this2.uniforms);
          _this2.uniforms = shader.uniforms;
        } catch (error) {
          console.error(error);
        }
      };
      if (this.__csm.isAlreadyExtended) {
        var prevOnBeforeCompile = this.onBeforeCompile;
        this.onBeforeCompile = function(shader, renderer) {
          prevOnBeforeCompile(shader, renderer);
          customOnBeforeCompile(shader);
        };
      } else {
        this.onBeforeCompile = customOnBeforeCompile;
      }
      this.needsUpdate = true;
    }
    /**
     * Patches input shader with custom shader. Not meant to be called directly.
     * @param customShader
     * @param shader
     * @param isFrag
     * @returns
     */
  }, {
    key: "patchShader",
    value: function patchShader(customShader, shader, isFrag) {
      var _this3 = this;
      var patchedShader = shader;
      var patchMap = _objectSpread2(_objectSpread2({}, this.getPatchMapForMaterial()), this.__csm.patchMap);
      Object.keys(patchMap).forEach(function(name) {
        Object.keys(patchMap[name]).forEach(function(key) {
          var availableIn = defaultAvailabilityMap[name];
          var type = _this3.__csm.type;
          if (name === "*" || isExactMatch(customShader.main, name)) {
            if (!availableIn || Array.isArray(availableIn) && availableIn.includes(type) || availableIn === "*") {
              patchedShader = replaceAll(patchedShader, key, patchMap[name][key]);
            } else {
              throw new Error("CSM: ".concat(name, " is not available in ").concat(type, ". Shader cannot compile."));
            }
          }
        });
      });
      patchedShader = patchedShader.replace("void main() {", "\n        #ifndef CSM_IS_HEAD_DEFAULTS_DEFINED\n          ".concat(isFrag ? defaultFragDefinitions : defaultVertDefinitions, "\n          #define CSM_IS_HEAD_DEFAULTS_DEFINED 1\n        #endif\n\n        ").concat(customShader.header, "\n        \n        void main() {\n          #ifndef CSM_IS_DEFAULTS_DEFINED\n            ").concat(defaultDefinitions, "\n            #define CSM_IS_DEFAULTS_DEFINED 1\n          #endif\n          \n          #ifndef CSM_IS_MAIN_DEFAULTS_DEFINED\n            ").concat(isFrag ? defaultFragMain : defaultVertMain, "\n            #define CSM_IS_MAIN_DEFAULTS_DEFINED 1\n          #endif\n\n          // CSM_START\n      "));
      var needsCustomInjectionOrder = this.__csm.isAlreadyExtended;
      var hasCSMEndMark = patchedShader.includes("// CSM_END");
      if (needsCustomInjectionOrder && hasCSMEndMark) {
        patchedShader = replaceLastOccurrence(patchedShader, "// CSM_END", "\n          // CSM_END\n          ".concat(customShader.main, "\n          // CSM_END\n        "));
      } else {
        patchedShader = patchedShader.replace("// CSM_START", "\n        // CSM_START\n        ".concat(customShader.main, "\n        // CSM_END\n          "));
      }
      patchedShader = customShader.defines + patchedShader;
      return patchedShader;
    }
    /**
     * This method is expensive owing to the tokenization and parsing of the shader.
     *
     * TODO:
     * - Replace tokenization with regex
     *
     * @param shader
     * @returns
     */
  }, {
    key: "parseShader",
    value: function parseShader(shader) {
      if (!shader)
        return;
      var s = shader.replace(/\/\*\*(.*?)\*\/|\/\/(.*?)\n/gm, "");
      var tokens = string(s);
      var funcs = glslTokenFunctions(tokens);
      var mainIndex = funcs.map(function(e) {
        return e.name;
      }).indexOf("main");
      var variables = glslTokenString(tokens.slice(0, mainIndex >= 0 ? funcs[mainIndex].outer[0] : void 0));
      var mainBody = mainIndex >= 0 ? this.getShaderFromIndex(tokens, funcs[mainIndex].body) : "";
      return {
        defines: "",
        header: variables,
        main: mainBody
      };
    }
    /**
     * Gets the material type as a string. Not meant to be called directly.
     * @returns
     */
  }, {
    key: "getMaterialDefine",
    value: function getMaterialDefine() {
      var type = this.__csm.type;
      return type ? "#define IS_".concat(type.toUpperCase(), ";\n") : "#define IS_UNKNOWN;\n";
    }
    /**
     * Gets the right patch map for the material. Not meant to be called directly.
     * @returns
     */
  }, {
    key: "getPatchMapForMaterial",
    value: function getPatchMapForMaterial() {
      switch (this.__csm.type) {
        case "ShaderMaterial":
          return shaderMaterial_PatchMap;
        default:
          return defaultPatchMap;
      }
    }
    /**
     * Gets the shader from the tokens. Not meant to be called directly.
     * @param tokens
     * @param index
     * @returns
     */
  }, {
    key: "getShaderFromIndex",
    value: function getShaderFromIndex(tokens, index) {
      return glslTokenString(tokens.slice(index[0], index[1]));
    }
  }]);
  return CustomShaderMaterial2;
}(Material);
const WOBBLY_UNIFORMS = {
  shaderUniforms: {
    uTime: new Uniform(0),
    uPositionFrequency: new Uniform(0.5),
    uTimeFrequency: new Uniform(0.4),
    uStrength: new Uniform(0.3),
    uWarpPositionFrequency: new Uniform(0.38),
    uWarpTimeFrequency: new Uniform(0.12),
    uWarpStrength: new Uniform(1.7),
    uColorA: new Uniform(new Color(16777215)),
    uColorB: new Uniform(new Color(16777215))
  },
  materialProps: {
    roughness: 0.5,
    metalness: 0.5,
    transmission: 0,
    ior: 0,
    thickness: 1
  }
};
class WobblySphere extends AssetBase {
  constructor(entities) {
    super();
    this.entitiesProps = /* @__PURE__ */ new Map();
    this.addLabel("frequency", "en", "Frequency");
    this.addLabel("frequency", "es", "Frecuencia");
    this.addLabel("speed", "en", "Speed");
    this.addLabel("speed", "es", "Velocidad");
    this.addLabel("strength", "en", "Strength");
    this.addLabel("strength", "es", "Fuerza");
    this.addLabel("warp", "en", "Warp");
    this.addLabel("warp", "es", "Deformacion");
    this.addLabel("warpSpeed", "en", "Warp Speed");
    this.addLabel("warpSpeed", "es", "Velocidad deformación");
    this.addLabel("warpStrength", "en", "Warp Strength");
    this.addLabel("warpStrength", "es", "Fuerza deformación");
    this.addLabel("firstColor", "en", "First Color");
    this.addLabel("firstColor", "es", "Primer Color");
    this.addLabel("secondColor", "en", "Second Color");
    this.addLabel("secondColor", "es", "Segundo Color");
    this.addLabel("metalness", "en", "Metalness");
    this.addLabel("metalness", "es", "Metalidad");
    this.addLabel("roughness", "en", "Roughness");
    this.addLabel("roughness", "es", "Rugosidad");
    this.addLabel("transmission", "en", "Transmission");
    this.addLabel("transmission", "es", "Transmisión");
    this.addLabel("ior", "en", "Ior");
    this.addLabel("ior", "es", "Ior");
    this.addLabel("thickness", "en", "Thickness");
    this.addLabel("thickness", "es", "Grosor");
    this.addDefaultProperties(true, true);
    this.addPropertyNumber(ENTITY_PROPERTY, "frequency", 0, 2, 2, 0.01, WOBBLY_UNIFORMS.shaderUniforms.uPositionFrequency.value);
    this.addPropertyNumber(ENTITY_PROPERTY, "speed", 0, 2, 2, 0.01, WOBBLY_UNIFORMS.shaderUniforms.uTimeFrequency.value);
    this.addPropertyNumber(ENTITY_PROPERTY, "strength", 0, 2, 2, 0.01, WOBBLY_UNIFORMS.shaderUniforms.uStrength.value);
    this.addPropertyNumber(ENTITY_PROPERTY, "warp", 0, 2, 2, 0.01, WOBBLY_UNIFORMS.shaderUniforms.uWarpPositionFrequency.value);
    this.addPropertyNumber(ENTITY_PROPERTY, "warpSpeed", 0, 2, 2, 0.01, WOBBLY_UNIFORMS.shaderUniforms.uWarpTimeFrequency.value);
    this.addPropertyNumber(ENTITY_PROPERTY, "warpStrength", 0, 2, 2, 0.01, WOBBLY_UNIFORMS.shaderUniforms.uWarpStrength.value);
    this.addPropertyColor(ENTITY_PROPERTY, "firstColor", WOBBLY_UNIFORMS.shaderUniforms.uColorA.value.getHex());
    this.addPropertyColor(ENTITY_PROPERTY, "secondColor", WOBBLY_UNIFORMS.shaderUniforms.uColorB.value.getHex());
    this.addPropertyNumber(ENTITY_PROPERTY, "metalness", 0, 1, 2, 0.01, WOBBLY_UNIFORMS.materialProps.metalness);
    this.addPropertyNumber(ENTITY_PROPERTY, "roughness", 0, 1, 2, 0.01, WOBBLY_UNIFORMS.materialProps.roughness);
    this.addPropertyNumber(ENTITY_PROPERTY, "transmission", 0, 1, 2, 0.01, WOBBLY_UNIFORMS.materialProps.transmission);
    this.addPropertyNumber(ENTITY_PROPERTY, "ior", 0, 10, 2, 0.01, WOBBLY_UNIFORMS.materialProps.ior);
    this.addPropertyNumber(ENTITY_PROPERTY, "thickness", 0, 10, 2, 0.01, WOBBLY_UNIFORMS.materialProps.thickness);
    this.setScene(new Scene());
    entities.forEach((entity) => {
      this.createEntity(entity);
    });
  }
  createEntity(id) {
    var _a, _b, _c, _d, _e, _f, _g;
    this.entitiesProps.set(id, JSON.parse(JSON.stringify(WOBBLY_UNIFORMS)));
    let geometry = new IcosahedronGeometry(2.5, 50);
    geometry.computeTangents();
    const material = new CustomShaderMaterial({
      // CSM
      baseMaterial: MeshPhysicalMaterial,
      vertexShader: vertex_default,
      fragmentShader: fragment_default,
      uniforms: (_a = this.entitiesProps.get(id)) == null ? void 0 : _a.shaderUniforms,
      silent: true,
      // MeshPhysicalMaterial
      metalness: (_b = this.entitiesProps.get(id)) == null ? void 0 : _b.materialProps.metalness,
      roughness: (_c = this.entitiesProps.get(id)) == null ? void 0 : _c.materialProps.roughness,
      color: "#ffffff",
      transmission: (_d = this.entitiesProps.get(id)) == null ? void 0 : _d.materialProps.transmission,
      ior: (_e = this.entitiesProps.get(id)) == null ? void 0 : _e.materialProps.ior,
      thickness: (_f = this.entitiesProps.get(id)) == null ? void 0 : _f.materialProps.thickness,
      transparent: true,
      wireframe: false
    });
    const depthMaterial = new CustomShaderMaterial({
      // CSM
      baseMaterial: MeshDepthMaterial,
      vertexShader: vertex_default,
      uniforms: (_g = this.entitiesProps.get(id)) == null ? void 0 : _g.shaderUniforms,
      silent: true,
      // MeshDepthMaterial
      depthPacking: RGBADepthPacking
    });
    const mesh = new Mesh(geometry, material);
    mesh.customDepthMaterial = depthMaterial;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    this.addEntity(id, mesh);
    this.getScene().add(mesh);
  }
  // update properties
  updateProperty(entity, property, value, nextUpdate = 0) {
    if (entity) {
      switch (property) {
        case "frequency":
          this.entitiesProps.get(entity).shaderUniforms.uPositionFrequency.value = value;
          break;
        case "speed":
          this.entitiesProps.get(entity).shaderUniforms.uTimeFrequency.value = value;
          break;
        case "strength":
          this.entitiesProps.get(entity).shaderUniforms.uStrength.value = value;
          break;
        case "warp":
          this.entitiesProps.get(entity).shaderUniforms.uWarpPositionFrequency.value = value;
          break;
        case "warpSpeed":
          this.entitiesProps.get(entity).shaderUniforms.uWarpTimeFrequency.value = value;
          break;
        case "warpStrength":
          this.entitiesProps.get(entity).shaderUniforms.uWarpStrength.value = value;
          break;
        case "metalness":
          if (this.getEntity(entity).material.metalness != void 0) {
            this.getEntity(entity).material.metalness = value;
            this.entitiesProps.get(entity).materialProps.metalness = value;
          }
          break;
        case "roughness":
          if (this.getEntity(entity).material.roughness != void 0) {
            this.getEntity(entity).material.roughness = value;
            this.entitiesProps.get(entity).materialProps.roughness = value;
          }
          break;
        case "transmission":
          if (this.getEntity(entity).material.transmission != void 0) {
            this.getEntity(entity).material.transmission = value;
            this.entitiesProps.get(entity).materialProps.transmission = value;
          }
          break;
        case "ior":
          if (this.getEntity(entity).material.ior != void 0) {
            this.getEntity(entity).material.ior = value;
            this.entitiesProps.get(entity).materialProps.ior = value;
          }
          break;
        case "thickness":
          if (this.getEntity(entity).material.thickness != void 0) {
            this.getEntity(entity).material.thickness = value;
            this.entitiesProps.get(entity).materialProps.thickness = value;
          }
          break;
        case "firstColor":
          this.entitiesProps.get(entity).shaderUniforms.uColorA.value = new Color(value >>> 8);
          break;
        case "secondColor":
          this.entitiesProps.get(entity).shaderUniforms.uColorB.value = new Color(value >>> 8);
          break;
        default:
          super.updateProperty(entity, property, value, nextUpdate);
      }
    } else {
      super.updateProperty(entity, property, value, nextUpdate);
    }
  }
  // get Properties
  getProperty(entity, property) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
    if (entity) {
      switch (property) {
        case "frequency":
          return (_a = this.entitiesProps.get(entity)) == null ? void 0 : _a.shaderUniforms.uPositionFrequency.value;
        case "speed":
          return (_b = this.entitiesProps.get(entity)) == null ? void 0 : _b.shaderUniforms.uTimeFrequency.value;
        case "strength":
          return (_c = this.entitiesProps.get(entity)) == null ? void 0 : _c.shaderUniforms.uStrength.value;
        case "warp":
          return (_d = this.entitiesProps.get(entity)) == null ? void 0 : _d.shaderUniforms.uWarpPositionFrequency.value;
        case "warpSpeed":
          return (_e = this.entitiesProps.get(entity)) == null ? void 0 : _e.shaderUniforms.uWarpTimeFrequency.value;
        case "warpStrength":
          return (_f = this.entitiesProps.get(entity)) == null ? void 0 : _f.shaderUniforms.uWarpStrength.value;
        case "firstColor":
          return ((((_g = this.entitiesProps.get(entity)) == null ? void 0 : _g.shaderUniforms.uColorA.value) || 0) << 8) + 255;
        case "secondColor":
          return ((((_h = this.entitiesProps.get(entity)) == null ? void 0 : _h.shaderUniforms.uColorB.value) || 0) << 8) + 255;
        case "metalness":
          return (_i = this.entitiesProps.get(entity)) == null ? void 0 : _i.materialProps.metalnes;
        case "roughness":
          return (_j = this.entitiesProps.get(entity)) == null ? void 0 : _j.materialProps.roughness;
        case "transmission":
          return (_k = this.entitiesProps.get(entity)) == null ? void 0 : _k.materialProps.transmission;
        case "ior":
          return (_l = this.entitiesProps.get(entity)) == null ? void 0 : _l.materialProps.ior;
        case "thickness":
          return (_m = this.entitiesProps.get(entity)) == null ? void 0 : _m.materialProps.thickness;
      }
    }
    return super.getProperty(entity, property);
  }
  // tick
  tick(parameters) {
    this.getEntities().forEach((entityName) => {
      if (this.getEntity(entityName)) {
        this.entitiesProps.get(entityName).shaderUniforms.uTime.value = parameters.elapsedTime;
      }
    });
    super.tick(parameters);
  }
}
const digoAssetData = {
  info: {
    name: {
      en: "Wobbly Sphere",
      es: "Esfera amorfa"
    },
    category: "objects",
    icon: "AutoAwesome",
    vendor: "Digo",
    license: "MIT",
    version: "1.0",
    module: {
      type: "threejs",
      version: "0.158.0"
    }
  },
  create: (entities) => {
    return new WobblySphere(entities || []);
  }
};
console.log("Wobbly sphere asset loaded");
Helper.loadAsset(digoAssetData);
