import { L as Loader, F as FileLoader, S as ShapePath, E as ExtrudeGeometry, M as MathUtils, a as Material, b as Scene, C as Color, U as Uniform, T as Texture, c as TorusKnotGeometry, d as Mesh, B as BufferGeometry, e as MeshBasicMaterial, f as MeshPhysicalMaterial, W as WebGLRenderTarget, O as OrthographicCamera, V as Vector3, D as DoubleSide } from "./three.js";
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
        asset: {
          onLoad: (assetsFactory) => {
          }
        },
        loadFont: (fontName) => {
        },
        loadResourceAsBase64: async (id) => "",
        loadGLTF: (id, onLoad) => {
        },
        loadTexture: (id, onLoad) => {
        },
        loadRGBE: (id, onLoad) => {
        },
        getResourceURL: (id) => "",
        forceRefresh: () => {
        },
        getAudioSampleRate: () => 48e3,
        getAudioFrequencyPower: (frequency) => 0,
        getAudioFrequenciesPower: () => new Uint8Array(1024),
        getMIDIBender: (input) => 0,
        getMIDINoteVelocity: (input, key) => 0,
        getMIDIControlVelocity: (input, key) => 0,
        getMIDINotesVelocity: (input) => [],
        getMIDIControlsVelocity: (input) => [],
        getThreeWebGLRenderer: () => {
        },
        getThreeCamera: () => {
        },
        getThreeScene: () => {
        },
        getThreeOrbitControls: () => {
        },
        getRapierWorld: () => {
        },
        getRapierInstance: () => {
        },
        updateMaterial: (mesh, property, value, previousValue) => {
        },
        setEnvironmentMap: (resourceId, alsoBackground) => {
        }
      };
    }
  }
  static loadAsset(factory) {
    var _a, _b;
    (_b = (_a = Helper.getGlobal()) == null ? void 0 : _a.asset) == null ? void 0 : _b.onLoad(factory);
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
class AssetGeneralData {
}
class AssetEntityData {
}
class AssetPropertyClass {
  constructor(definition) {
    this.definition = definition;
  }
  getDefinition() {
    return this.definition;
  }
  group(group) {
    this.definition.group = group;
    return this;
  }
  setter(method) {
    this.definition.setter = method;
    return this;
  }
  getter(method) {
    this.definition.getter = method;
    return this;
  }
}
class Asset {
  constructor() {
    this.labels = {};
    this.entities = /* @__PURE__ */ new Map();
    this.generalProperties = /* @__PURE__ */ new Map();
    this.entityProperties = /* @__PURE__ */ new Map();
    this.gap = { x: 1, y: 0, z: 0 };
    this.viewerWidth = 0;
    this.viewerHeight = 0;
    this.entitiesPosition = /* @__PURE__ */ new Map();
  }
  getGeneralProperties() {
    return Array.from(this.generalProperties.values()).map((property) => property.getDefinition());
  }
  getEntityProperties() {
    return Array.from(this.entityProperties.values()).map((property) => property.getDefinition());
  }
  getPropertyDefinition(entity, id) {
    const properties = entity ? this.getEntityProperties() : this.getGeneralProperties();
    return properties.find((property) => property.id === id);
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
  needsMIDI() {
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
    const propertyClass = new AssetPropertyClass(property);
    if (general) {
      this.generalProperties.set(property.id, propertyClass);
    } else {
      this.entityProperties.set(property.id, propertyClass);
    }
    return propertyClass;
  }
  addPropertyXYZ(general, id, canLinkValues, x, y, z) {
    const defaultValue = {
      x: x ?? 0,
      y: y ?? 0,
      z: z ?? 0
    };
    const property = {
      id,
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
    return this.addProperty(general, property);
  }
  addPropertyXY(general, id, x, y) {
    const defaultValue = {
      x: x ?? 0,
      y: y ?? 0
    };
    const property = {
      id,
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
    return this.addProperty(general, property);
  }
  addPropertySize(general, id, defaultValue) {
    const property = {
      id,
      type: "multiNumber",
      maximum: 100,
      minimum: 0,
      decimals: 0,
      step: 1,
      defaultValue,
      general,
      keys: ["w", "h"],
      icons: ["SwapHoriz", "SwapVert"]
    };
    return this.addProperty(general, property);
  }
  addPropertyNumber(general, id, minimum, maximum, decimals, step, defaultValue) {
    const property = {
      id,
      type: "number",
      maximum,
      minimum,
      decimals,
      step,
      defaultValue,
      general
    };
    return this.addProperty(general, property);
  }
  addPropertyString(general, id, defaultValue) {
    const property = {
      id,
      type: "string",
      defaultValue,
      general
    };
    return this.addProperty(general, property);
  }
  addPropertyImage(general, id, defaultValue) {
    const property = {
      id,
      type: "image",
      defaultValue,
      general
    };
    return this.addProperty(general, property);
  }
  addPropertyObject3D(general, id, defaultValue) {
    const property = {
      id,
      type: "object3d",
      defaultValue,
      general
    };
    return this.addProperty(general, property);
  }
  addPropertyFont(general, id, defaultValue) {
    const property = {
      id,
      type: "font",
      defaultValue,
      general
    };
    return this.addProperty(general, property);
  }
  addPropertyMaterial(general, id, defaultValue) {
    const property = {
      id,
      type: "material",
      defaultValue,
      general
    };
    return this.addProperty(general, property);
  }
  addPropertyMIDI(general, id, defaultValue) {
    const property = {
      id,
      type: "midi",
      defaultValue,
      general
    };
    return this.addProperty(general, property);
  }
  addPropertyColor(general, id, defaultValue) {
    const property = {
      id,
      type: "color",
      defaultValue,
      general
    };
    return this.addProperty(general, property);
  }
  addPropertyBoolean(general, id, defaultValue) {
    const property = {
      id,
      type: "boolean",
      defaultValue: defaultValue ?? false,
      general
    };
    return this.addProperty(general, property);
  }
  addPropertyOptions(general, id, defaultValue, keys, icons) {
    const property = {
      id,
      type: "options",
      defaultValue,
      general,
      keys,
      icons
    };
    return this.addProperty(general, property);
  }
  addPropertyDropdown(general, id, defaultValue, keys) {
    const property = {
      id,
      type: "dropdown",
      defaultValue,
      general,
      keys
    };
    return this.addProperty(general, property);
  }
  addPropertyPosition(general) {
    return this.addPropertyXYZ(
      general,
      "position"
      /* POSITION */
    );
  }
  addPropertyScale(general) {
    return this.addPropertyXYZ(general, "scale", true, 1, 1, 1);
  }
  addPropertyRotation(general) {
    return this.addPropertyXYZ(
      general,
      "rotation"
      /* ROTATION */
    );
  }
  addPropertyGap(general) {
    return this.addPropertyXYZ(general, "gap", false, 1);
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
  getContainer(extraInfo) {
    return this.generalData.container;
  }
  getGeneralData() {
    return this.generalData;
  }
  setGeneralData(data) {
    this.generalData = data;
  }
  setViewerSize(width, height) {
    this.viewerWidth = width;
    this.viewerHeight = height;
  }
  setLabels(labels2) {
    this.labels = labels2;
  }
  getLabel(id, language) {
    if (this.labels[id] && this.labels[id][language]) {
      return this.labels[id][language];
    }
    return id;
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
  addEntity(id, data, position = { x: 0, y: 0, z: 0 }) {
    this.entities.set(id, data);
    this.entitiesPosition.set(id, position);
  }
  updateEntity(id, data) {
    this.entities.set(id, data);
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
    var _a;
    if (entity) {
      this.updatePropertyCommon(entity, (_a = this.getEntity(entity)) == null ? void 0 : _a.component, property, value, nextUpdate);
    } else {
      this.updatePropertyCommon(entity, this.getContainer(), property, value, nextUpdate);
    }
  }
  getProperty(entity, property) {
    var _a;
    if (entity) {
      return this.getPropertyCommon(entity, (_a = this.getEntity(entity)) == null ? void 0 : _a.component, property);
    }
    return this.getPropertyCommon(entity, this.getContainer(), property);
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
    this.entities.forEach((data, id) => {
      this.updatePropertyCommon(id, data.component, "position", this.getPropertyPosition(id, data.component), nextUpdate);
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
  // Rapier utility functions. TO REVIEW
}
class DigoAssetThree extends Asset {
  getContainer() {
    return super.getContainer();
  }
  deleteEntity(id) {
    var _a;
    this.getContainer().remove((_a = this.getEntity(id)) == null ? void 0 : _a.component);
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
  updatePropertyColor(object, color) {
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
  getPropertyColor(object) {
    var _a, _b;
    return Number.parseInt(`${(_b = (_a = object == null ? void 0 : object.material) == null ? void 0 : _a.color) == null ? void 0 : _b.getHex().toString(16)}ff`, 16);
  }
  updateProperty(entity, propertyId, value, nextUpdate = 0) {
    let setterCalled = false;
    const splittedProperties = propertyId.split("/");
    const property = this.getPropertyDefinition(entity, splittedProperties[0]);
    if (property && property.setter) {
      const data = entity ? this.getEntity(entity) : this.getGeneralData();
      if (data) {
        if (splittedProperties.length === 2 && property.getter) {
          const objectValue = JSON.parse(JSON.stringify(property.getter(data)));
          objectValue[splittedProperties[1]] = value;
          property.setter(data, objectValue, propertyId, nextUpdate);
        } else {
          property.setter(data, value, propertyId, nextUpdate);
        }
        setterCalled = true;
      }
    }
    if (!setterCalled) {
      super.updateProperty(entity, propertyId, value, nextUpdate);
    }
  }
  getProperty(entity, propertyId) {
    const splittedProperties = propertyId.split("/");
    const property = this.getPropertyDefinition(entity, splittedProperties[0]);
    if (property && property.getter) {
      const data = entity ? this.getEntity(entity) : this.getGeneralData();
      if (data) {
        return property.getter(data);
      }
    }
    return super.getProperty(entity, propertyId);
  }
  loadGLTF(id, onLoad) {
    var _a;
    (_a = Helper.getGlobal()) == null ? void 0 : _a.loadGLTF(id, onLoad);
  }
  loadTexture(id, onLoad) {
    var _a;
    (_a = Helper.getGlobal()) == null ? void 0 : _a.loadTexture(id, onLoad);
  }
  loadRGBE(id, onLoad) {
    var _a;
    (_a = Helper.getGlobal()) == null ? void 0 : _a.loadRGBE(id, onLoad);
  }
  updateMaterial(mesh, object, field, property, value) {
    var _a;
    (_a = Helper.getGlobal()) == null ? void 0 : _a.updateMaterial(mesh, property, value, object[field]);
    const [_, subProperty] = property.split("/");
    if (subProperty) {
      object[field][subProperty] = value[subProperty];
    } else {
      Object.keys(value).forEach((key) => {
        object[field][key] = value[key];
      });
    }
  }
  setEnvironmentMap(id, alsoBackground) {
    var _a;
    (_a = Helper.getGlobal()) == null ? void 0 : _a.setEnvironmentMap(id, alsoBackground);
  }
  tick(parameters) {
  }
}
class FontLoader extends Loader {
  constructor(manager) {
    super(manager);
  }
  load(url, onLoad, onProgress, onError) {
    const scope = this;
    const loader = new FileLoader(this.manager);
    loader.setPath(this.path);
    loader.setRequestHeader(this.requestHeader);
    loader.setWithCredentials(this.withCredentials);
    loader.load(url, function(text) {
      const font = scope.parse(JSON.parse(text));
      if (onLoad)
        onLoad(font);
    }, onProgress, onError);
  }
  parse(json) {
    return new Font(json);
  }
}
class Font {
  constructor(data) {
    this.isFont = true;
    this.type = "Font";
    this.data = data;
  }
  generateShapes(text, size = 100) {
    const shapes = [];
    const paths = createPaths(text, size, this.data);
    for (let p = 0, pl = paths.length; p < pl; p++) {
      shapes.push(...paths[p].toShapes());
    }
    return shapes;
  }
}
function createPaths(text, size, data) {
  const chars = Array.from(text);
  const scale = size / data.resolution;
  const line_height = (data.boundingBox.yMax - data.boundingBox.yMin + data.underlineThickness) * scale;
  const paths = [];
  let offsetX = 0, offsetY = 0;
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    if (char === "\n") {
      offsetX = 0;
      offsetY -= line_height;
    } else {
      const ret = createPath(char, scale, offsetX, offsetY, data);
      offsetX += ret.offsetX;
      paths.push(ret.path);
    }
  }
  return paths;
}
function createPath(char, scale, offsetX, offsetY, data) {
  const glyph = data.glyphs[char] || data.glyphs["?"];
  if (!glyph) {
    console.error('THREE.Font: character "' + char + '" does not exists in font family ' + data.familyName + ".");
    return;
  }
  const path = new ShapePath();
  let x, y, cpx, cpy, cpx1, cpy1, cpx2, cpy2;
  if (glyph.o) {
    const outline = glyph._cachedOutline || (glyph._cachedOutline = glyph.o.split(" "));
    for (let i = 0, l = outline.length; i < l; ) {
      const action = outline[i++];
      switch (action) {
        case "m":
          x = outline[i++] * scale + offsetX;
          y = outline[i++] * scale + offsetY;
          path.moveTo(x, y);
          break;
        case "l":
          x = outline[i++] * scale + offsetX;
          y = outline[i++] * scale + offsetY;
          path.lineTo(x, y);
          break;
        case "q":
          cpx = outline[i++] * scale + offsetX;
          cpy = outline[i++] * scale + offsetY;
          cpx1 = outline[i++] * scale + offsetX;
          cpy1 = outline[i++] * scale + offsetY;
          path.quadraticCurveTo(cpx1, cpy1, cpx, cpy);
          break;
        case "b":
          cpx = outline[i++] * scale + offsetX;
          cpy = outline[i++] * scale + offsetY;
          cpx1 = outline[i++] * scale + offsetX;
          cpy1 = outline[i++] * scale + offsetY;
          cpx2 = outline[i++] * scale + offsetX;
          cpy2 = outline[i++] * scale + offsetY;
          path.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, cpx, cpy);
          break;
      }
    }
  }
  return { offsetX: glyph.ha * scale, path };
}
class TextGeometry extends ExtrudeGeometry {
  constructor(text, parameters = {}) {
    const font = parameters.font;
    if (font === void 0) {
      super();
    } else {
      const shapes = font.generateShapes(text, parameters.size);
      if (parameters.depth === void 0 && parameters.height !== void 0) {
        console.warn("THREE.TextGeometry: .height is now depreciated. Please use .depth instead");
      }
      parameters.depth = parameters.depth !== void 0 ? parameters.depth : parameters.height !== void 0 ? parameters.height : 50;
      if (parameters.bevelThickness === void 0)
        parameters.bevelThickness = 10;
      if (parameters.bevelSize === void 0)
        parameters.bevelSize = 8;
      if (parameters.bevelEnabled === void 0)
        parameters.bevelEnabled = false;
      super(shapes, parameters);
    }
    this.type = "TextGeometry";
  }
}
var torus_vertex_default = "varying vec2 vUv;\nvarying vec3 vPosition;\n\nuniform float uTime;\n\nvoid main() {\n  vUv = uv;\n  vPosition = position;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);\n}";
var torus_fragment_default = "varying vec2 vUv;\nvarying vec3 vPosition;\n\nuniform float uTime;\nuniform float uSpeed;\nuniform sampler2D uTexture;\nuniform float uRepeatX;\nuniform float uRepeatY;\n\nvoid main() {\n  float time = uTime * uSpeed * -1.0;\n\n  vec2 repeat = -vec2(uRepeatX, uRepeatY);\n  vec2 uv = fract(vUv * repeat - vec2(time, 0.));\n  csm_DiffuseColor = texture2D(uTexture, uv);\n  \n}";
const glyphs = {
  "0": {
    x_min: 73,
    x_max: 715,
    ha: 792,
    o: "m 394 -29 q 153 129 242 -29 q 73 479 73 272 q 152 829 73 687 q 394 989 241 989 q 634 829 545 989 q 715 479 715 684 q 635 129 715 270 q 394 -29 546 -29 m 394 89 q 546 211 489 89 q 598 479 598 322 q 548 748 598 640 q 394 871 491 871 q 241 748 298 871 q 190 479 190 637 q 239 211 190 319 q 394 89 296 89 "
  },
  "1": {
    x_min: 215.671875,
    x_max: 574,
    ha: 792,
    o: "m 574 0 l 442 0 l 442 697 l 215 697 l 215 796 q 386 833 330 796 q 475 986 447 875 l 574 986 l 574 0 "
  },
  "2": {
    x_min: 59,
    x_max: 731,
    ha: 792,
    o: "m 731 0 l 59 0 q 197 314 59 188 q 457 487 199 315 q 598 691 598 580 q 543 819 598 772 q 411 867 488 867 q 272 811 328 867 q 209 630 209 747 l 81 630 q 182 901 81 805 q 408 986 271 986 q 629 909 536 986 q 731 694 731 826 q 613 449 731 541 q 378 316 495 383 q 201 122 235 234 l 731 122 l 731 0 "
  },
  "3": {
    x_min: 54,
    x_max: 737,
    ha: 792,
    o: "m 737 284 q 635 55 737 141 q 399 -25 541 -25 q 156 52 248 -25 q 54 308 54 140 l 185 308 q 245 147 185 202 q 395 96 302 96 q 539 140 484 96 q 602 280 602 190 q 510 429 602 390 q 324 454 451 454 l 324 565 q 487 584 441 565 q 565 719 565 617 q 515 835 565 791 q 395 879 466 879 q 255 824 307 879 q 203 661 203 769 l 78 661 q 166 909 78 822 q 387 992 250 992 q 603 921 513 992 q 701 723 701 844 q 669 607 701 656 q 578 524 637 558 q 696 434 655 499 q 737 284 737 369 "
  },
  "4": {
    x_min: 48,
    x_max: 742.453125,
    ha: 792,
    o: "m 742 243 l 602 243 l 602 0 l 476 0 l 476 243 l 48 243 l 48 368 l 476 958 l 602 958 l 602 354 l 742 354 l 742 243 m 476 354 l 476 792 l 162 354 l 476 354 "
  },
  "5": {
    x_min: 54.171875,
    x_max: 738,
    ha: 792,
    o: "m 738 314 q 626 60 738 153 q 382 -23 526 -23 q 155 47 248 -23 q 54 256 54 125 l 183 256 q 259 132 204 174 q 382 91 314 91 q 533 149 471 91 q 602 314 602 213 q 538 469 602 411 q 386 528 475 528 q 284 506 332 528 q 197 439 237 484 l 81 439 l 159 958 l 684 958 l 684 840 l 254 840 l 214 579 q 306 627 258 612 q 407 643 354 643 q 636 552 540 643 q 738 314 738 457 "
  },
  "6": {
    x_min: 53,
    x_max: 739,
    ha: 792,
    o: "m 739 312 q 633 62 739 162 q 400 -31 534 -31 q 162 78 257 -31 q 53 439 53 206 q 178 859 53 712 q 441 986 284 986 q 643 912 559 986 q 732 713 732 833 l 601 713 q 544 830 594 786 q 426 875 494 875 q 268 793 331 875 q 193 517 193 697 q 301 597 240 570 q 427 624 362 624 q 643 540 552 624 q 739 312 739 451 m 603 298 q 540 461 603 400 q 404 516 484 516 q 268 461 323 516 q 207 300 207 401 q 269 137 207 198 q 405 83 325 83 q 541 137 486 83 q 603 298 603 197 "
  },
  "7": {
    x_min: 58.71875,
    x_max: 730.953125,
    ha: 792,
    o: "m 730 839 q 469 448 560 641 q 335 0 378 255 l 192 0 q 328 441 235 252 q 593 830 421 630 l 58 830 l 58 958 l 730 958 l 730 839 "
  },
  "8": {
    x_min: 55,
    x_max: 736,
    ha: 792,
    o: "m 571 527 q 694 424 652 491 q 736 280 736 358 q 648 71 736 158 q 395 -26 551 -26 q 142 69 238 -26 q 55 279 55 157 q 96 425 55 359 q 220 527 138 491 q 120 615 153 562 q 88 726 88 668 q 171 904 88 827 q 395 986 261 986 q 618 905 529 986 q 702 727 702 830 q 670 616 702 667 q 571 527 638 565 m 394 565 q 519 610 475 565 q 563 717 563 655 q 521 823 563 781 q 392 872 474 872 q 265 824 312 872 q 224 720 224 783 q 265 613 224 656 q 394 565 312 565 m 395 91 q 545 150 488 91 q 597 280 597 204 q 546 408 597 355 q 395 465 492 465 q 244 408 299 465 q 194 280 194 356 q 244 150 194 203 q 395 91 299 91 "
  },
  "9": {
    x_min: 53,
    x_max: 739,
    ha: 792,
    o: "m 739 524 q 619 94 739 241 q 362 -32 516 -32 q 150 47 242 -32 q 59 244 59 126 l 191 244 q 246 129 191 176 q 373 82 301 82 q 526 161 466 82 q 597 440 597 255 q 363 334 501 334 q 130 432 216 334 q 53 650 53 521 q 134 880 53 786 q 383 986 226 986 q 659 841 566 986 q 739 524 739 719 m 388 449 q 535 514 480 449 q 585 658 585 573 q 535 805 585 744 q 388 873 480 873 q 242 809 294 873 q 191 658 191 745 q 239 514 191 572 q 388 449 292 449 "
  },
  "ο": {
    x_min: 0,
    x_max: 712,
    ha: 815,
    o: "m 356 -25 q 96 88 192 -25 q 0 368 0 201 q 92 642 0 533 q 356 761 192 761 q 617 644 517 761 q 712 368 712 533 q 619 91 712 201 q 356 -25 520 -25 m 356 85 q 527 175 465 85 q 583 369 583 255 q 528 562 583 484 q 356 651 466 651 q 189 560 250 651 q 135 369 135 481 q 187 177 135 257 q 356 85 250 85 "
  },
  S: {
    x_min: 0,
    x_max: 788,
    ha: 890,
    o: "m 788 291 q 662 54 788 144 q 397 -26 550 -26 q 116 68 226 -26 q 0 337 0 168 l 131 337 q 200 152 131 220 q 384 85 269 85 q 557 129 479 85 q 650 270 650 183 q 490 429 650 379 q 194 513 341 470 q 33 739 33 584 q 142 964 33 881 q 388 1041 242 1041 q 644 957 543 1041 q 756 716 756 867 l 625 716 q 561 874 625 816 q 395 933 497 933 q 243 891 309 933 q 164 759 164 841 q 325 609 164 656 q 625 526 475 568 q 788 291 788 454 "
  },
  "¦": {
    x_min: 343,
    x_max: 449,
    ha: 792,
    o: "m 449 462 l 343 462 l 343 986 l 449 986 l 449 462 m 449 -242 l 343 -242 l 343 280 l 449 280 l 449 -242 "
  },
  "/": {
    x_min: 183.25,
    x_max: 608.328125,
    ha: 792,
    o: "m 608 1041 l 266 -129 l 183 -129 l 520 1041 l 608 1041 "
  },
  "Τ": {
    x_min: -0.4375,
    x_max: 777.453125,
    ha: 839,
    o: "m 777 893 l 458 893 l 458 0 l 319 0 l 319 892 l 0 892 l 0 1013 l 777 1013 l 777 893 "
  },
  y: {
    x_min: 0,
    x_max: 684.78125,
    ha: 771,
    o: "m 684 738 l 388 -83 q 311 -216 356 -167 q 173 -279 252 -279 q 97 -266 133 -279 l 97 -149 q 132 -155 109 -151 q 168 -160 155 -160 q 240 -114 213 -160 q 274 -26 248 -98 l 0 738 l 137 737 l 341 139 l 548 737 l 684 738 "
  },
  "Π": {
    x_min: 0,
    x_max: 803,
    ha: 917,
    o: "m 803 0 l 667 0 l 667 886 l 140 886 l 140 0 l 0 0 l 0 1012 l 803 1012 l 803 0 "
  },
  "ΐ": {
    x_min: -111,
    x_max: 339,
    ha: 361,
    o: "m 339 800 l 229 800 l 229 925 l 339 925 l 339 800 m -1 800 l -111 800 l -111 925 l -1 925 l -1 800 m 284 3 q 233 -10 258 -5 q 182 -15 207 -15 q 85 26 119 -15 q 42 200 42 79 l 42 737 l 167 737 l 168 215 q 172 141 168 157 q 226 101 183 101 q 248 103 239 101 q 284 112 257 104 l 284 3 m 302 1040 l 113 819 l 30 819 l 165 1040 l 302 1040 "
  },
  g: {
    x_min: 0,
    x_max: 686,
    ha: 838,
    o: "m 686 34 q 586 -213 686 -121 q 331 -306 487 -306 q 131 -252 216 -306 q 31 -84 31 -190 l 155 -84 q 228 -174 166 -138 q 345 -207 284 -207 q 514 -109 454 -207 q 564 89 564 -27 q 461 6 521 36 q 335 -23 401 -23 q 88 100 184 -23 q 0 370 0 215 q 87 634 0 522 q 330 758 183 758 q 457 728 398 758 q 564 644 515 699 l 564 737 l 686 737 l 686 34 m 582 367 q 529 560 582 481 q 358 652 468 652 q 189 561 250 652 q 135 369 135 482 q 189 176 135 255 q 361 85 251 85 q 529 176 468 85 q 582 367 582 255 "
  },
  "²": {
    x_min: 0,
    x_max: 442,
    ha: 539,
    o: "m 442 383 l 0 383 q 91 566 0 492 q 260 668 176 617 q 354 798 354 727 q 315 875 354 845 q 227 905 277 905 q 136 869 173 905 q 99 761 99 833 l 14 761 q 82 922 14 864 q 232 974 141 974 q 379 926 316 974 q 442 797 442 878 q 351 635 442 704 q 183 539 321 611 q 92 455 92 491 l 442 455 l 442 383 "
  },
  "–": {
    x_min: 0,
    x_max: 705.5625,
    ha: 803,
    o: "m 705 334 l 0 334 l 0 410 l 705 410 l 705 334 "
  },
  "Κ": {
    x_min: 0,
    x_max: 819.5625,
    ha: 893,
    o: "m 819 0 l 650 0 l 294 509 l 139 356 l 139 0 l 0 0 l 0 1013 l 139 1013 l 139 526 l 626 1013 l 809 1013 l 395 600 l 819 0 "
  },
  "ƒ": {
    x_min: -46.265625,
    x_max: 392,
    ha: 513,
    o: "m 392 651 l 259 651 l 79 -279 l -46 -278 l 134 651 l 14 651 l 14 751 l 135 751 q 151 948 135 900 q 304 1041 185 1041 q 334 1040 319 1041 q 392 1034 348 1039 l 392 922 q 337 931 360 931 q 271 883 287 931 q 260 793 260 853 l 260 751 l 392 751 l 392 651 "
  },
  e: {
    x_min: 0,
    x_max: 714,
    ha: 813,
    o: "m 714 326 l 140 326 q 200 157 140 227 q 359 87 260 87 q 488 130 431 87 q 561 245 545 174 l 697 245 q 577 48 670 123 q 358 -26 484 -26 q 97 85 195 -26 q 0 363 0 197 q 94 642 0 529 q 358 765 195 765 q 626 627 529 765 q 714 326 714 503 m 576 429 q 507 583 564 522 q 355 650 445 650 q 206 583 266 650 q 140 429 152 522 l 576 429 "
  },
  "ό": {
    x_min: 0,
    x_max: 712,
    ha: 815,
    o: "m 356 -25 q 94 91 194 -25 q 0 368 0 202 q 92 642 0 533 q 356 761 192 761 q 617 644 517 761 q 712 368 712 533 q 619 91 712 201 q 356 -25 520 -25 m 356 85 q 527 175 465 85 q 583 369 583 255 q 528 562 583 484 q 356 651 466 651 q 189 560 250 651 q 135 369 135 481 q 187 177 135 257 q 356 85 250 85 m 576 1040 l 387 819 l 303 819 l 438 1040 l 576 1040 "
  },
  J: {
    x_min: 0,
    x_max: 588,
    ha: 699,
    o: "m 588 279 q 287 -26 588 -26 q 58 73 126 -26 q 0 327 0 158 l 133 327 q 160 172 133 227 q 288 96 198 96 q 426 171 391 96 q 449 336 449 219 l 449 1013 l 588 1013 l 588 279 "
  },
  "»": {
    x_min: -1,
    x_max: 503,
    ha: 601,
    o: "m 503 302 l 280 136 l 281 256 l 429 373 l 281 486 l 280 608 l 503 440 l 503 302 m 221 302 l 0 136 l 0 255 l 145 372 l 0 486 l -1 608 l 221 440 l 221 302 "
  },
  "©": {
    x_min: -3,
    x_max: 1008,
    ha: 1106,
    o: "m 502 -7 q 123 151 263 -7 q -3 501 -3 294 q 123 851 -3 706 q 502 1011 263 1011 q 881 851 739 1011 q 1008 501 1008 708 q 883 151 1008 292 q 502 -7 744 -7 m 502 60 q 830 197 709 60 q 940 501 940 322 q 831 805 940 681 q 502 944 709 944 q 174 805 296 944 q 65 501 65 680 q 173 197 65 320 q 502 60 294 60 m 741 394 q 661 246 731 302 q 496 190 591 190 q 294 285 369 190 q 228 497 228 370 q 295 714 228 625 q 499 813 370 813 q 656 762 588 813 q 733 625 724 711 l 634 625 q 589 704 629 673 q 498 735 550 735 q 377 666 421 735 q 334 504 334 597 q 374 340 334 408 q 490 272 415 272 q 589 304 549 272 q 638 394 628 337 l 741 394 "
  },
  "ώ": {
    x_min: 0,
    x_max: 922,
    ha: 1030,
    o: "m 687 1040 l 498 819 l 415 819 l 549 1040 l 687 1040 m 922 339 q 856 97 922 203 q 650 -26 780 -26 q 538 9 587 -26 q 461 103 489 44 q 387 12 436 46 q 277 -22 339 -22 q 69 97 147 -22 q 0 338 0 202 q 45 551 0 444 q 161 737 84 643 l 302 737 q 175 552 219 647 q 124 336 124 446 q 155 179 124 248 q 275 88 197 88 q 375 163 341 88 q 400 294 400 219 l 400 572 l 524 572 l 524 294 q 561 135 524 192 q 643 88 591 88 q 762 182 719 88 q 797 341 797 257 q 745 555 797 450 q 619 737 705 637 l 760 737 q 874 551 835 640 q 922 339 922 444 "
  },
  "^": {
    x_min: 193.0625,
    x_max: 598.609375,
    ha: 792,
    o: "m 598 772 l 515 772 l 395 931 l 277 772 l 193 772 l 326 1013 l 462 1013 l 598 772 "
  },
  "«": {
    x_min: 0,
    x_max: 507.203125,
    ha: 604,
    o: "m 506 136 l 284 302 l 284 440 l 506 608 l 507 485 l 360 371 l 506 255 l 506 136 m 222 136 l 0 302 l 0 440 l 222 608 l 221 486 l 73 373 l 222 256 l 222 136 "
  },
  D: {
    x_min: 0,
    x_max: 828,
    ha: 935,
    o: "m 389 1013 q 714 867 593 1013 q 828 521 828 729 q 712 161 828 309 q 382 0 587 0 l 0 0 l 0 1013 l 389 1013 m 376 124 q 607 247 523 124 q 681 510 681 355 q 607 771 681 662 q 376 896 522 896 l 139 896 l 139 124 l 376 124 "
  },
  "∙": {
    x_min: 0,
    x_max: 142,
    ha: 239,
    o: "m 142 585 l 0 585 l 0 738 l 142 738 l 142 585 "
  },
  "ÿ": {
    x_min: 0,
    x_max: 47,
    ha: 125,
    o: "m 47 3 q 37 -7 47 -7 q 28 0 30 -7 q 39 -4 32 -4 q 45 3 45 -1 l 37 0 q 28 9 28 0 q 39 19 28 19 l 47 16 l 47 19 l 47 3 m 37 1 q 44 8 44 1 q 37 16 44 16 q 30 8 30 16 q 37 1 30 1 m 26 1 l 23 22 l 14 0 l 3 22 l 3 3 l 0 25 l 13 1 l 22 25 l 26 1 "
  },
  w: {
    x_min: 0,
    x_max: 1009.71875,
    ha: 1100,
    o: "m 1009 738 l 783 0 l 658 0 l 501 567 l 345 0 l 222 0 l 0 738 l 130 738 l 284 174 l 432 737 l 576 738 l 721 173 l 881 737 l 1009 738 "
  },
  $: {
    x_min: 0,
    x_max: 700,
    ha: 793,
    o: "m 664 717 l 542 717 q 490 825 531 785 q 381 872 450 865 l 381 551 q 620 446 540 522 q 700 241 700 370 q 618 45 700 116 q 381 -25 536 -25 l 381 -152 l 307 -152 l 307 -25 q 81 62 162 -25 q 0 297 0 149 l 124 297 q 169 146 124 204 q 307 81 215 89 l 307 441 q 80 536 148 469 q 13 725 13 603 q 96 910 13 839 q 307 982 180 982 l 307 1077 l 381 1077 l 381 982 q 574 917 494 982 q 664 717 664 845 m 307 565 l 307 872 q 187 831 233 872 q 142 724 142 791 q 180 618 142 656 q 307 565 218 580 m 381 76 q 562 237 562 96 q 517 361 562 313 q 381 423 472 409 l 381 76 "
  },
  "\\": {
    x_min: -0.015625,
    x_max: 425.0625,
    ha: 522,
    o: "m 425 -129 l 337 -129 l 0 1041 l 83 1041 l 425 -129 "
  },
  "µ": {
    x_min: 0,
    x_max: 697.21875,
    ha: 747,
    o: "m 697 -4 q 629 -14 658 -14 q 498 97 513 -14 q 422 9 470 41 q 313 -23 374 -23 q 207 4 258 -23 q 119 81 156 32 l 119 -278 l 0 -278 l 0 738 l 124 738 l 124 343 q 165 173 124 246 q 308 83 216 83 q 452 178 402 83 q 493 359 493 255 l 493 738 l 617 738 l 617 214 q 623 136 617 160 q 673 92 637 92 q 697 96 684 92 l 697 -4 "
  },
  "Ι": {
    x_min: 42,
    x_max: 181,
    ha: 297,
    o: "m 181 0 l 42 0 l 42 1013 l 181 1013 l 181 0 "
  },
  "Ύ": {
    x_min: 0,
    x_max: 1144.5,
    ha: 1214,
    o: "m 1144 1012 l 807 416 l 807 0 l 667 0 l 667 416 l 325 1012 l 465 1012 l 736 533 l 1004 1012 l 1144 1012 m 277 1040 l 83 799 l 0 799 l 140 1040 l 277 1040 "
  },
  "’": {
    x_min: 0,
    x_max: 139,
    ha: 236,
    o: "m 139 851 q 102 737 139 784 q 0 669 65 690 l 0 734 q 59 787 42 741 q 72 873 72 821 l 0 873 l 0 1013 l 139 1013 l 139 851 "
  },
  "Ν": {
    x_min: 0,
    x_max: 801,
    ha: 915,
    o: "m 801 0 l 651 0 l 131 822 l 131 0 l 0 0 l 0 1013 l 151 1013 l 670 191 l 670 1013 l 801 1013 l 801 0 "
  },
  "-": {
    x_min: 8.71875,
    x_max: 350.390625,
    ha: 478,
    o: "m 350 317 l 8 317 l 8 428 l 350 428 l 350 317 "
  },
  Q: {
    x_min: 0,
    x_max: 968,
    ha: 1072,
    o: "m 954 5 l 887 -79 l 744 35 q 622 -11 687 2 q 483 -26 556 -26 q 127 130 262 -26 q 0 504 0 279 q 127 880 0 728 q 484 1041 262 1041 q 841 884 708 1041 q 968 507 968 735 q 933 293 968 398 q 832 104 899 188 l 954 5 m 723 191 q 802 330 777 248 q 828 499 828 412 q 744 790 828 673 q 483 922 650 922 q 228 791 322 922 q 142 505 142 673 q 227 221 142 337 q 487 91 323 91 q 632 123 566 91 l 520 215 l 587 301 l 723 191 "
  },
  "ς": {
    x_min: 1,
    x_max: 676.28125,
    ha: 740,
    o: "m 676 460 l 551 460 q 498 595 542 546 q 365 651 448 651 q 199 578 263 651 q 136 401 136 505 q 266 178 136 241 q 508 106 387 142 q 640 -50 640 62 q 625 -158 640 -105 q 583 -278 611 -211 l 465 -278 q 498 -182 490 -211 q 515 -80 515 -126 q 381 12 515 -15 q 134 91 197 51 q 1 388 1 179 q 100 651 1 542 q 354 761 199 761 q 587 680 498 761 q 676 460 676 599 "
  },
  M: {
    x_min: 0,
    x_max: 954,
    ha: 1067,
    o: "m 954 0 l 819 0 l 819 869 l 537 0 l 405 0 l 128 866 l 128 0 l 0 0 l 0 1013 l 200 1013 l 472 160 l 757 1013 l 954 1013 l 954 0 "
  },
  "Ψ": {
    x_min: 0,
    x_max: 1006,
    ha: 1094,
    o: "m 1006 678 q 914 319 1006 429 q 571 200 814 200 l 571 0 l 433 0 l 433 200 q 92 319 194 200 q 0 678 0 429 l 0 1013 l 139 1013 l 139 679 q 191 417 139 492 q 433 326 255 326 l 433 1013 l 571 1013 l 571 326 l 580 326 q 813 423 747 326 q 868 679 868 502 l 868 1013 l 1006 1013 l 1006 678 "
  },
  C: {
    x_min: 0,
    x_max: 886,
    ha: 944,
    o: "m 886 379 q 760 87 886 201 q 455 -26 634 -26 q 112 136 236 -26 q 0 509 0 283 q 118 882 0 737 q 469 1041 245 1041 q 748 955 630 1041 q 879 708 879 859 l 745 708 q 649 862 724 805 q 473 920 573 920 q 219 791 312 920 q 136 509 136 675 q 217 229 136 344 q 470 99 311 99 q 672 179 591 99 q 753 379 753 259 l 886 379 "
  },
  "!": {
    x_min: 0,
    x_max: 138,
    ha: 236,
    o: "m 138 684 q 116 409 138 629 q 105 244 105 299 l 33 244 q 16 465 33 313 q 0 684 0 616 l 0 1013 l 138 1013 l 138 684 m 138 0 l 0 0 l 0 151 l 138 151 l 138 0 "
  },
  "{": {
    x_min: 0,
    x_max: 480.5625,
    ha: 578,
    o: "m 480 -286 q 237 -213 303 -286 q 187 -45 187 -159 q 194 48 187 -15 q 201 141 201 112 q 164 264 201 225 q 0 314 118 314 l 0 417 q 164 471 119 417 q 201 605 201 514 q 199 665 201 644 q 193 772 193 769 q 241 941 193 887 q 480 1015 308 1015 l 480 915 q 336 866 375 915 q 306 742 306 828 q 310 662 306 717 q 314 577 314 606 q 288 452 314 500 q 176 365 256 391 q 289 275 257 337 q 314 143 314 226 q 313 84 314 107 q 310 -11 310 -5 q 339 -131 310 -94 q 480 -182 377 -182 l 480 -286 "
  },
  X: {
    x_min: -0.015625,
    x_max: 854.15625,
    ha: 940,
    o: "m 854 0 l 683 0 l 423 409 l 166 0 l 0 0 l 347 519 l 18 1013 l 186 1013 l 428 637 l 675 1013 l 836 1013 l 504 520 l 854 0 "
  },
  "#": {
    x_min: 0,
    x_max: 963.890625,
    ha: 1061,
    o: "m 963 690 l 927 590 l 719 590 l 655 410 l 876 410 l 840 310 l 618 310 l 508 -3 l 393 -2 l 506 309 l 329 310 l 215 -2 l 102 -3 l 212 310 l 0 310 l 36 410 l 248 409 l 312 590 l 86 590 l 120 690 l 347 690 l 459 1006 l 573 1006 l 462 690 l 640 690 l 751 1006 l 865 1006 l 754 690 l 963 690 m 606 590 l 425 590 l 362 410 l 543 410 l 606 590 "
  },
  "ι": {
    x_min: 42,
    x_max: 284,
    ha: 361,
    o: "m 284 3 q 233 -10 258 -5 q 182 -15 207 -15 q 85 26 119 -15 q 42 200 42 79 l 42 738 l 167 738 l 168 215 q 172 141 168 157 q 226 101 183 101 q 248 103 239 101 q 284 112 257 104 l 284 3 "
  },
  "Ά": {
    x_min: 0,
    x_max: 906.953125,
    ha: 982,
    o: "m 283 1040 l 88 799 l 5 799 l 145 1040 l 283 1040 m 906 0 l 756 0 l 650 303 l 251 303 l 143 0 l 0 0 l 376 1012 l 529 1012 l 906 0 m 609 421 l 452 866 l 293 421 l 609 421 "
  },
  ")": {
    x_min: 0,
    x_max: 318,
    ha: 415,
    o: "m 318 365 q 257 25 318 191 q 87 -290 197 -141 l 0 -290 q 140 21 93 -128 q 193 360 193 189 q 141 704 193 537 q 0 1024 97 850 l 87 1024 q 257 706 197 871 q 318 365 318 542 "
  },
  "ε": {
    x_min: 0,
    x_max: 634.71875,
    ha: 714,
    o: "m 634 234 q 527 38 634 110 q 300 -25 433 -25 q 98 29 183 -25 q 0 204 0 93 q 37 314 0 265 q 128 390 67 353 q 56 460 82 419 q 26 555 26 505 q 114 712 26 654 q 295 763 191 763 q 499 700 416 763 q 589 515 589 631 l 478 515 q 419 618 464 580 q 307 657 374 657 q 207 630 253 657 q 151 547 151 598 q 238 445 151 469 q 389 434 280 434 l 389 331 l 349 331 q 206 315 255 331 q 125 210 125 287 q 183 107 125 145 q 302 76 233 76 q 436 117 379 76 q 509 234 493 159 l 634 234 "
  },
  "Δ": {
    x_min: 0,
    x_max: 952.78125,
    ha: 1028,
    o: "m 952 0 l 0 0 l 400 1013 l 551 1013 l 952 0 m 762 124 l 476 867 l 187 124 l 762 124 "
  },
  "}": {
    x_min: 0,
    x_max: 481,
    ha: 578,
    o: "m 481 314 q 318 262 364 314 q 282 136 282 222 q 284 65 282 97 q 293 -58 293 -48 q 241 -217 293 -166 q 0 -286 174 -286 l 0 -182 q 143 -130 105 -182 q 171 -2 171 -93 q 168 81 171 22 q 165 144 165 140 q 188 275 165 229 q 306 365 220 339 q 191 455 224 391 q 165 588 165 505 q 168 681 165 624 q 171 742 171 737 q 141 865 171 827 q 0 915 102 915 l 0 1015 q 243 942 176 1015 q 293 773 293 888 q 287 675 293 741 q 282 590 282 608 q 318 466 282 505 q 481 417 364 417 l 481 314 "
  },
  "‰": {
    x_min: -3,
    x_max: 1672,
    ha: 1821,
    o: "m 846 0 q 664 76 732 0 q 603 244 603 145 q 662 412 603 344 q 846 489 729 489 q 1027 412 959 489 q 1089 244 1089 343 q 1029 76 1089 144 q 846 0 962 0 m 845 103 q 945 143 910 103 q 981 243 981 184 q 947 340 981 301 q 845 385 910 385 q 745 342 782 385 q 709 243 709 300 q 742 147 709 186 q 845 103 781 103 m 888 986 l 284 -25 l 199 -25 l 803 986 l 888 986 m 241 468 q 58 545 126 468 q -3 715 -3 615 q 56 881 -3 813 q 238 958 124 958 q 421 881 353 958 q 483 712 483 813 q 423 544 483 612 q 241 468 356 468 m 241 855 q 137 811 175 855 q 100 710 100 768 q 136 612 100 653 q 240 572 172 572 q 344 614 306 572 q 382 713 382 656 q 347 810 382 771 q 241 855 308 855 m 1428 0 q 1246 76 1314 0 q 1185 244 1185 145 q 1244 412 1185 344 q 1428 489 1311 489 q 1610 412 1542 489 q 1672 244 1672 343 q 1612 76 1672 144 q 1428 0 1545 0 m 1427 103 q 1528 143 1492 103 q 1564 243 1564 184 q 1530 340 1564 301 q 1427 385 1492 385 q 1327 342 1364 385 q 1291 243 1291 300 q 1324 147 1291 186 q 1427 103 1363 103 "
  },
  a: {
    x_min: 0,
    x_max: 698.609375,
    ha: 794,
    o: "m 698 0 q 661 -12 679 -7 q 615 -17 643 -17 q 536 12 564 -17 q 500 96 508 41 q 384 6 456 37 q 236 -25 312 -25 q 65 31 130 -25 q 0 194 0 88 q 118 390 0 334 q 328 435 180 420 q 488 483 476 451 q 495 523 495 504 q 442 619 495 584 q 325 654 389 654 q 209 617 257 654 q 152 513 161 580 l 33 513 q 123 705 33 633 q 332 772 207 772 q 528 712 448 772 q 617 531 617 645 l 617 163 q 624 108 617 126 q 664 90 632 90 l 698 94 l 698 0 m 491 262 l 491 372 q 272 329 350 347 q 128 201 128 294 q 166 113 128 144 q 264 83 205 83 q 414 130 346 83 q 491 262 491 183 "
  },
  "—": {
    x_min: 0,
    x_max: 941.671875,
    ha: 1039,
    o: "m 941 334 l 0 334 l 0 410 l 941 410 l 941 334 "
  },
  "=": {
    x_min: 8.71875,
    x_max: 780.953125,
    ha: 792,
    o: "m 780 510 l 8 510 l 8 606 l 780 606 l 780 510 m 780 235 l 8 235 l 8 332 l 780 332 l 780 235 "
  },
  N: {
    x_min: 0,
    x_max: 801,
    ha: 914,
    o: "m 801 0 l 651 0 l 131 823 l 131 0 l 0 0 l 0 1013 l 151 1013 l 670 193 l 670 1013 l 801 1013 l 801 0 "
  },
  "ρ": {
    x_min: 0,
    x_max: 712,
    ha: 797,
    o: "m 712 369 q 620 94 712 207 q 362 -26 521 -26 q 230 2 292 -26 q 119 83 167 30 l 119 -278 l 0 -278 l 0 362 q 91 643 0 531 q 355 764 190 764 q 617 647 517 764 q 712 369 712 536 m 583 366 q 530 559 583 480 q 359 651 469 651 q 190 562 252 651 q 135 370 135 483 q 189 176 135 257 q 359 85 250 85 q 528 175 466 85 q 583 366 583 254 "
  },
  "¯": {
    x_min: 0,
    x_max: 941.671875,
    ha: 938,
    o: "m 941 1033 l 0 1033 l 0 1109 l 941 1109 l 941 1033 "
  },
  Z: {
    x_min: 0,
    x_max: 779,
    ha: 849,
    o: "m 779 0 l 0 0 l 0 113 l 621 896 l 40 896 l 40 1013 l 779 1013 l 778 887 l 171 124 l 779 124 l 779 0 "
  },
  u: {
    x_min: 0,
    x_max: 617,
    ha: 729,
    o: "m 617 0 l 499 0 l 499 110 q 391 10 460 45 q 246 -25 322 -25 q 61 58 127 -25 q 0 258 0 136 l 0 738 l 125 738 l 125 284 q 156 148 125 202 q 273 82 197 82 q 433 165 369 82 q 493 340 493 243 l 493 738 l 617 738 l 617 0 "
  },
  k: {
    x_min: 0,
    x_max: 612.484375,
    ha: 697,
    o: "m 612 738 l 338 465 l 608 0 l 469 0 l 251 382 l 121 251 l 121 0 l 0 0 l 0 1013 l 121 1013 l 121 402 l 456 738 l 612 738 "
  },
  "Η": {
    x_min: 0,
    x_max: 803,
    ha: 917,
    o: "m 803 0 l 667 0 l 667 475 l 140 475 l 140 0 l 0 0 l 0 1013 l 140 1013 l 140 599 l 667 599 l 667 1013 l 803 1013 l 803 0 "
  },
  "Α": {
    x_min: 0,
    x_max: 906.953125,
    ha: 985,
    o: "m 906 0 l 756 0 l 650 303 l 251 303 l 143 0 l 0 0 l 376 1013 l 529 1013 l 906 0 m 609 421 l 452 866 l 293 421 l 609 421 "
  },
  s: {
    x_min: 0,
    x_max: 604,
    ha: 697,
    o: "m 604 217 q 501 36 604 104 q 292 -23 411 -23 q 86 43 166 -23 q 0 238 0 114 l 121 237 q 175 122 121 164 q 300 85 223 85 q 415 112 363 85 q 479 207 479 147 q 361 309 479 276 q 140 372 141 370 q 21 544 21 426 q 111 708 21 647 q 298 761 190 761 q 492 705 413 761 q 583 531 583 643 l 462 531 q 412 625 462 594 q 298 657 363 657 q 199 636 242 657 q 143 558 143 608 q 262 454 143 486 q 484 394 479 397 q 604 217 604 341 "
  },
  B: {
    x_min: 0,
    x_max: 778,
    ha: 876,
    o: "m 580 546 q 724 469 670 535 q 778 311 778 403 q 673 83 778 171 q 432 0 575 0 l 0 0 l 0 1013 l 411 1013 q 629 957 541 1013 q 732 768 732 892 q 691 633 732 693 q 580 546 650 572 m 393 899 l 139 899 l 139 588 l 379 588 q 521 624 462 588 q 592 744 592 667 q 531 859 592 819 q 393 899 471 899 m 419 124 q 566 169 504 124 q 635 303 635 219 q 559 436 635 389 q 402 477 494 477 l 139 477 l 139 124 l 419 124 "
  },
  "…": {
    x_min: 0,
    x_max: 614,
    ha: 708,
    o: "m 142 0 l 0 0 l 0 151 l 142 151 l 142 0 m 378 0 l 236 0 l 236 151 l 378 151 l 378 0 m 614 0 l 472 0 l 472 151 l 614 151 l 614 0 "
  },
  "?": {
    x_min: 0,
    x_max: 607,
    ha: 704,
    o: "m 607 777 q 543 599 607 674 q 422 474 482 537 q 357 272 357 391 l 236 272 q 297 487 236 395 q 411 619 298 490 q 474 762 474 691 q 422 885 474 838 q 301 933 371 933 q 179 880 228 933 q 124 706 124 819 l 0 706 q 94 963 0 872 q 302 1044 177 1044 q 511 973 423 1044 q 607 777 607 895 m 370 0 l 230 0 l 230 151 l 370 151 l 370 0 "
  },
  H: {
    x_min: 0,
    x_max: 803,
    ha: 915,
    o: "m 803 0 l 667 0 l 667 475 l 140 475 l 140 0 l 0 0 l 0 1013 l 140 1013 l 140 599 l 667 599 l 667 1013 l 803 1013 l 803 0 "
  },
  "ν": {
    x_min: 0,
    x_max: 675,
    ha: 761,
    o: "m 675 738 l 404 0 l 272 0 l 0 738 l 133 738 l 340 147 l 541 738 l 675 738 "
  },
  c: {
    x_min: 1,
    x_max: 701.390625,
    ha: 775,
    o: "m 701 264 q 584 53 681 133 q 353 -26 487 -26 q 91 91 188 -26 q 1 370 1 201 q 92 645 1 537 q 353 761 190 761 q 572 688 479 761 q 690 493 666 615 l 556 493 q 487 606 545 562 q 356 650 428 650 q 186 563 246 650 q 134 372 134 487 q 188 179 134 258 q 359 88 250 88 q 492 136 437 88 q 566 264 548 185 l 701 264 "
  },
  "¶": {
    x_min: 0,
    x_max: 566.671875,
    ha: 678,
    o: "m 21 892 l 52 892 l 98 761 l 145 892 l 176 892 l 178 741 l 157 741 l 157 867 l 108 741 l 88 741 l 40 871 l 40 741 l 21 741 l 21 892 m 308 854 l 308 731 q 252 691 308 691 q 227 691 240 691 q 207 696 213 695 l 207 712 l 253 706 q 288 733 288 706 l 288 763 q 244 741 279 741 q 193 797 193 741 q 261 860 193 860 q 287 860 273 860 q 308 854 302 855 m 288 842 l 263 843 q 213 796 213 843 q 248 756 213 756 q 288 796 288 756 l 288 842 m 566 988 l 502 988 l 502 -1 l 439 -1 l 439 988 l 317 988 l 317 -1 l 252 -1 l 252 602 q 81 653 155 602 q 0 805 0 711 q 101 989 0 918 q 309 1053 194 1053 l 566 1053 l 566 988 "
  },
  "β": {
    x_min: 0,
    x_max: 660,
    ha: 745,
    o: "m 471 550 q 610 450 561 522 q 660 280 660 378 q 578 64 660 151 q 367 -22 497 -22 q 239 5 299 -22 q 126 82 178 32 l 126 -278 l 0 -278 l 0 593 q 54 903 0 801 q 318 1042 127 1042 q 519 964 436 1042 q 603 771 603 887 q 567 644 603 701 q 471 550 532 586 m 337 79 q 476 138 418 79 q 535 279 535 198 q 427 437 535 386 q 226 477 344 477 l 226 583 q 398 620 329 583 q 486 762 486 668 q 435 884 486 833 q 312 935 384 935 q 169 861 219 935 q 126 698 126 797 l 126 362 q 170 169 126 242 q 337 79 224 79 "
  },
  "Μ": {
    x_min: 0,
    x_max: 954,
    ha: 1068,
    o: "m 954 0 l 819 0 l 819 868 l 537 0 l 405 0 l 128 865 l 128 0 l 0 0 l 0 1013 l 199 1013 l 472 158 l 758 1013 l 954 1013 l 954 0 "
  },
  "Ό": {
    x_min: 0.109375,
    x_max: 1120,
    ha: 1217,
    o: "m 1120 505 q 994 132 1120 282 q 642 -29 861 -29 q 290 130 422 -29 q 167 505 167 280 q 294 883 167 730 q 650 1046 430 1046 q 999 882 868 1046 q 1120 505 1120 730 m 977 504 q 896 784 977 669 q 644 915 804 915 q 391 785 484 915 q 307 504 307 669 q 391 224 307 339 q 644 95 486 95 q 894 224 803 95 q 977 504 977 339 m 277 1040 l 83 799 l 0 799 l 140 1040 l 277 1040 "
  },
  "Ή": {
    x_min: 0,
    x_max: 1158,
    ha: 1275,
    o: "m 1158 0 l 1022 0 l 1022 475 l 496 475 l 496 0 l 356 0 l 356 1012 l 496 1012 l 496 599 l 1022 599 l 1022 1012 l 1158 1012 l 1158 0 m 277 1040 l 83 799 l 0 799 l 140 1040 l 277 1040 "
  },
  "•": {
    x_min: 0,
    x_max: 663.890625,
    ha: 775,
    o: "m 663 529 q 566 293 663 391 q 331 196 469 196 q 97 294 194 196 q 0 529 0 393 q 96 763 0 665 q 331 861 193 861 q 566 763 469 861 q 663 529 663 665 "
  },
  "¥": {
    x_min: 0.1875,
    x_max: 819.546875,
    ha: 886,
    o: "m 563 561 l 697 561 l 696 487 l 520 487 l 482 416 l 482 380 l 697 380 l 695 308 l 482 308 l 482 0 l 342 0 l 342 308 l 125 308 l 125 380 l 342 380 l 342 417 l 303 487 l 125 487 l 125 561 l 258 561 l 0 1013 l 140 1013 l 411 533 l 679 1013 l 819 1013 l 563 561 "
  },
  "(": {
    x_min: 0,
    x_max: 318.0625,
    ha: 415,
    o: "m 318 -290 l 230 -290 q 61 23 122 -142 q 0 365 0 190 q 62 712 0 540 q 230 1024 119 869 l 318 1024 q 175 705 219 853 q 125 360 125 542 q 176 22 125 187 q 318 -290 223 -127 "
  },
  U: {
    x_min: 0,
    x_max: 796,
    ha: 904,
    o: "m 796 393 q 681 93 796 212 q 386 -25 566 -25 q 101 95 208 -25 q 0 393 0 211 l 0 1013 l 138 1013 l 138 391 q 204 191 138 270 q 394 107 276 107 q 586 191 512 107 q 656 391 656 270 l 656 1013 l 796 1013 l 796 393 "
  },
  "γ": {
    x_min: 0.5,
    x_max: 744.953125,
    ha: 822,
    o: "m 744 737 l 463 54 l 463 -278 l 338 -278 l 338 54 l 154 495 q 104 597 124 569 q 13 651 67 651 l 0 651 l 0 751 l 39 753 q 168 711 121 753 q 242 594 207 676 l 403 208 l 617 737 l 744 737 "
  },
  "α": {
    x_min: 0,
    x_max: 765.5625,
    ha: 809,
    o: "m 765 -4 q 698 -14 726 -14 q 564 97 586 -14 q 466 7 525 40 q 337 -26 407 -26 q 88 98 186 -26 q 0 369 0 212 q 88 637 0 525 q 337 760 184 760 q 465 728 407 760 q 563 637 524 696 l 563 739 l 685 739 l 685 222 q 693 141 685 168 q 748 94 708 94 q 765 96 760 94 l 765 -4 m 584 371 q 531 562 584 485 q 360 653 470 653 q 192 566 254 653 q 135 379 135 489 q 186 181 135 261 q 358 84 247 84 q 528 176 465 84 q 584 371 584 260 "
  },
  F: {
    x_min: 0,
    x_max: 683.328125,
    ha: 717,
    o: "m 683 888 l 140 888 l 140 583 l 613 583 l 613 458 l 140 458 l 140 0 l 0 0 l 0 1013 l 683 1013 l 683 888 "
  },
  "­": {
    x_min: 0,
    x_max: 705.5625,
    ha: 803,
    o: "m 705 334 l 0 334 l 0 410 l 705 410 l 705 334 "
  },
  ":": {
    x_min: 0,
    x_max: 142,
    ha: 239,
    o: "m 142 585 l 0 585 l 0 738 l 142 738 l 142 585 m 142 0 l 0 0 l 0 151 l 142 151 l 142 0 "
  },
  "Χ": {
    x_min: 0,
    x_max: 854.171875,
    ha: 935,
    o: "m 854 0 l 683 0 l 423 409 l 166 0 l 0 0 l 347 519 l 18 1013 l 186 1013 l 427 637 l 675 1013 l 836 1013 l 504 521 l 854 0 "
  },
  "*": {
    x_min: 116,
    x_max: 674,
    ha: 792,
    o: "m 674 768 l 475 713 l 610 544 l 517 477 l 394 652 l 272 478 l 178 544 l 314 713 l 116 766 l 153 876 l 341 812 l 342 1013 l 446 1013 l 446 811 l 635 874 l 674 768 "
  },
  "†": {
    x_min: 0,
    x_max: 777,
    ha: 835,
    o: "m 458 804 l 777 804 l 777 683 l 458 683 l 458 0 l 319 0 l 319 681 l 0 683 l 0 804 l 319 804 l 319 1015 l 458 1013 l 458 804 "
  },
  "°": {
    x_min: 0,
    x_max: 347,
    ha: 444,
    o: "m 173 802 q 43 856 91 802 q 0 977 0 905 q 45 1101 0 1049 q 173 1153 90 1153 q 303 1098 255 1153 q 347 977 347 1049 q 303 856 347 905 q 173 802 256 802 m 173 884 q 238 910 214 884 q 262 973 262 937 q 239 1038 262 1012 q 173 1064 217 1064 q 108 1037 132 1064 q 85 973 85 1010 q 108 910 85 937 q 173 884 132 884 "
  },
  V: {
    x_min: 0,
    x_max: 862.71875,
    ha: 940,
    o: "m 862 1013 l 505 0 l 361 0 l 0 1013 l 143 1013 l 434 165 l 718 1012 l 862 1013 "
  },
  "Ξ": {
    x_min: 0,
    x_max: 734.71875,
    ha: 763,
    o: "m 723 889 l 9 889 l 9 1013 l 723 1013 l 723 889 m 673 463 l 61 463 l 61 589 l 673 589 l 673 463 m 734 0 l 0 0 l 0 124 l 734 124 l 734 0 "
  },
  " ": {
    x_min: 0,
    x_max: 0,
    ha: 853
  },
  "Ϋ": {
    x_min: 0.328125,
    x_max: 819.515625,
    ha: 889,
    o: "m 588 1046 l 460 1046 l 460 1189 l 588 1189 l 588 1046 m 360 1046 l 232 1046 l 232 1189 l 360 1189 l 360 1046 m 819 1012 l 482 416 l 482 0 l 342 0 l 342 416 l 0 1012 l 140 1012 l 411 533 l 679 1012 l 819 1012 "
  },
  "”": {
    x_min: 0,
    x_max: 347,
    ha: 454,
    o: "m 139 851 q 102 737 139 784 q 0 669 65 690 l 0 734 q 59 787 42 741 q 72 873 72 821 l 0 873 l 0 1013 l 139 1013 l 139 851 m 347 851 q 310 737 347 784 q 208 669 273 690 l 208 734 q 267 787 250 741 q 280 873 280 821 l 208 873 l 208 1013 l 347 1013 l 347 851 "
  },
  "@": {
    x_min: 0,
    x_max: 1260,
    ha: 1357,
    o: "m 1098 -45 q 877 -160 1001 -117 q 633 -203 752 -203 q 155 -29 327 -203 q 0 360 0 127 q 176 802 0 616 q 687 1008 372 1008 q 1123 854 969 1008 q 1260 517 1260 718 q 1155 216 1260 341 q 868 82 1044 82 q 772 106 801 82 q 737 202 737 135 q 647 113 700 144 q 527 82 594 82 q 367 147 420 82 q 314 312 314 212 q 401 565 314 452 q 639 690 498 690 q 810 588 760 690 l 849 668 l 938 668 q 877 441 900 532 q 833 226 833 268 q 853 182 833 198 q 902 167 873 167 q 1088 272 1012 167 q 1159 512 1159 372 q 1051 793 1159 681 q 687 925 925 925 q 248 747 415 925 q 97 361 97 586 q 226 26 97 159 q 627 -122 370 -122 q 856 -87 737 -122 q 1061 8 976 -53 l 1098 -45 m 786 488 q 738 580 777 545 q 643 615 700 615 q 483 517 548 615 q 425 322 425 430 q 457 203 425 250 q 552 156 490 156 q 722 273 665 156 q 786 488 738 309 "
  },
  "Ί": {
    x_min: 0,
    x_max: 499,
    ha: 613,
    o: "m 277 1040 l 83 799 l 0 799 l 140 1040 l 277 1040 m 499 0 l 360 0 l 360 1012 l 499 1012 l 499 0 "
  },
  i: {
    x_min: 14,
    x_max: 136,
    ha: 275,
    o: "m 136 873 l 14 873 l 14 1013 l 136 1013 l 136 873 m 136 0 l 14 0 l 14 737 l 136 737 l 136 0 "
  },
  "Β": {
    x_min: 0,
    x_max: 778,
    ha: 877,
    o: "m 580 545 q 724 468 671 534 q 778 310 778 402 q 673 83 778 170 q 432 0 575 0 l 0 0 l 0 1013 l 411 1013 q 629 957 541 1013 q 732 768 732 891 q 691 632 732 692 q 580 545 650 571 m 393 899 l 139 899 l 139 587 l 379 587 q 521 623 462 587 q 592 744 592 666 q 531 859 592 819 q 393 899 471 899 m 419 124 q 566 169 504 124 q 635 302 635 219 q 559 435 635 388 q 402 476 494 476 l 139 476 l 139 124 l 419 124 "
  },
  "υ": {
    x_min: 0,
    x_max: 617,
    ha: 725,
    o: "m 617 352 q 540 94 617 199 q 308 -24 455 -24 q 76 94 161 -24 q 0 352 0 199 l 0 739 l 126 739 l 126 355 q 169 185 126 257 q 312 98 220 98 q 451 185 402 98 q 492 355 492 257 l 492 739 l 617 739 l 617 352 "
  },
  "]": {
    x_min: 0,
    x_max: 275,
    ha: 372,
    o: "m 275 -281 l 0 -281 l 0 -187 l 151 -187 l 151 920 l 0 920 l 0 1013 l 275 1013 l 275 -281 "
  },
  m: {
    x_min: 0,
    x_max: 1019,
    ha: 1128,
    o: "m 1019 0 l 897 0 l 897 454 q 860 591 897 536 q 739 660 816 660 q 613 586 659 660 q 573 436 573 522 l 573 0 l 447 0 l 447 455 q 412 591 447 535 q 294 657 372 657 q 165 586 213 657 q 122 437 122 521 l 122 0 l 0 0 l 0 738 l 117 738 l 117 640 q 202 730 150 697 q 316 763 254 763 q 437 730 381 763 q 525 642 494 697 q 621 731 559 700 q 753 763 682 763 q 943 694 867 763 q 1019 512 1019 625 l 1019 0 "
  },
  "χ": {
    x_min: 8.328125,
    x_max: 780.5625,
    ha: 815,
    o: "m 780 -278 q 715 -294 747 -294 q 616 -257 663 -294 q 548 -175 576 -227 l 379 133 l 143 -277 l 9 -277 l 313 254 l 163 522 q 127 586 131 580 q 36 640 91 640 q 8 637 27 640 l 8 752 l 52 757 q 162 719 113 757 q 236 627 200 690 l 383 372 l 594 737 l 726 737 l 448 250 l 625 -69 q 670 -153 647 -110 q 743 -188 695 -188 q 780 -184 759 -188 l 780 -278 "
  },
  "ί": {
    x_min: 42,
    x_max: 326.71875,
    ha: 361,
    o: "m 284 3 q 233 -10 258 -5 q 182 -15 207 -15 q 85 26 119 -15 q 42 200 42 79 l 42 737 l 167 737 l 168 215 q 172 141 168 157 q 226 101 183 101 q 248 102 239 101 q 284 112 257 104 l 284 3 m 326 1040 l 137 819 l 54 819 l 189 1040 l 326 1040 "
  },
  "Ζ": {
    x_min: 0,
    x_max: 779.171875,
    ha: 850,
    o: "m 779 0 l 0 0 l 0 113 l 620 896 l 40 896 l 40 1013 l 779 1013 l 779 887 l 170 124 l 779 124 l 779 0 "
  },
  R: {
    x_min: 0,
    x_max: 781.953125,
    ha: 907,
    o: "m 781 0 l 623 0 q 587 242 590 52 q 407 433 585 433 l 138 433 l 138 0 l 0 0 l 0 1013 l 396 1013 q 636 946 539 1013 q 749 731 749 868 q 711 597 749 659 q 608 502 674 534 q 718 370 696 474 q 729 207 722 352 q 781 26 736 62 l 781 0 m 373 551 q 533 594 465 551 q 614 731 614 645 q 532 859 614 815 q 373 896 465 896 l 138 896 l 138 551 l 373 551 "
  },
  o: {
    x_min: 0,
    x_max: 713,
    ha: 821,
    o: "m 357 -25 q 94 91 194 -25 q 0 368 0 202 q 93 642 0 533 q 357 761 193 761 q 618 644 518 761 q 713 368 713 533 q 619 91 713 201 q 357 -25 521 -25 m 357 85 q 528 175 465 85 q 584 369 584 255 q 529 562 584 484 q 357 651 467 651 q 189 560 250 651 q 135 369 135 481 q 187 177 135 257 q 357 85 250 85 "
  },
  K: {
    x_min: 0,
    x_max: 819.46875,
    ha: 906,
    o: "m 819 0 l 649 0 l 294 509 l 139 355 l 139 0 l 0 0 l 0 1013 l 139 1013 l 139 526 l 626 1013 l 809 1013 l 395 600 l 819 0 "
  },
  ",": {
    x_min: 0,
    x_max: 142,
    ha: 239,
    o: "m 142 -12 q 105 -132 142 -82 q 0 -205 68 -182 l 0 -138 q 57 -82 40 -124 q 70 0 70 -51 l 0 0 l 0 151 l 142 151 l 142 -12 "
  },
  d: {
    x_min: 0,
    x_max: 683,
    ha: 796,
    o: "m 683 0 l 564 0 l 564 93 q 456 6 516 38 q 327 -25 395 -25 q 87 100 181 -25 q 0 365 0 215 q 90 639 0 525 q 343 763 187 763 q 564 647 486 763 l 564 1013 l 683 1013 l 683 0 m 582 373 q 529 562 582 484 q 361 653 468 653 q 190 561 253 653 q 135 365 135 479 q 189 175 135 254 q 358 85 251 85 q 529 178 468 85 q 582 373 582 258 "
  },
  "¨": {
    x_min: -109,
    x_max: 247,
    ha: 232,
    o: "m 247 1046 l 119 1046 l 119 1189 l 247 1189 l 247 1046 m 19 1046 l -109 1046 l -109 1189 l 19 1189 l 19 1046 "
  },
  E: {
    x_min: 0,
    x_max: 736.109375,
    ha: 789,
    o: "m 736 0 l 0 0 l 0 1013 l 725 1013 l 725 889 l 139 889 l 139 585 l 677 585 l 677 467 l 139 467 l 139 125 l 736 125 l 736 0 "
  },
  Y: {
    x_min: 0,
    x_max: 820,
    ha: 886,
    o: "m 820 1013 l 482 416 l 482 0 l 342 0 l 342 416 l 0 1013 l 140 1013 l 411 534 l 679 1012 l 820 1013 "
  },
  '"': {
    x_min: 0,
    x_max: 299,
    ha: 396,
    o: "m 299 606 l 203 606 l 203 988 l 299 988 l 299 606 m 96 606 l 0 606 l 0 988 l 96 988 l 96 606 "
  },
  "‹": {
    x_min: 17.984375,
    x_max: 773.609375,
    ha: 792,
    o: "m 773 40 l 18 376 l 17 465 l 773 799 l 773 692 l 159 420 l 773 149 l 773 40 "
  },
  "„": {
    x_min: 0,
    x_max: 364,
    ha: 467,
    o: "m 141 -12 q 104 -132 141 -82 q 0 -205 67 -182 l 0 -138 q 56 -82 40 -124 q 69 0 69 -51 l 0 0 l 0 151 l 141 151 l 141 -12 m 364 -12 q 327 -132 364 -82 q 222 -205 290 -182 l 222 -138 q 279 -82 262 -124 q 292 0 292 -51 l 222 0 l 222 151 l 364 151 l 364 -12 "
  },
  "δ": {
    x_min: 1,
    x_max: 710,
    ha: 810,
    o: "m 710 360 q 616 87 710 196 q 356 -28 518 -28 q 99 82 197 -28 q 1 356 1 192 q 100 606 1 509 q 355 703 199 703 q 180 829 288 754 q 70 903 124 866 l 70 1012 l 643 1012 l 643 901 l 258 901 q 462 763 422 794 q 636 592 577 677 q 710 360 710 485 m 584 365 q 552 501 584 447 q 451 602 521 555 q 372 611 411 611 q 197 541 258 611 q 136 355 136 472 q 190 171 136 245 q 358 85 252 85 q 528 173 465 85 q 584 365 584 252 "
  },
  "έ": {
    x_min: 0,
    x_max: 634.71875,
    ha: 714,
    o: "m 634 234 q 527 38 634 110 q 300 -25 433 -25 q 98 29 183 -25 q 0 204 0 93 q 37 313 0 265 q 128 390 67 352 q 56 459 82 419 q 26 555 26 505 q 114 712 26 654 q 295 763 191 763 q 499 700 416 763 q 589 515 589 631 l 478 515 q 419 618 464 580 q 307 657 374 657 q 207 630 253 657 q 151 547 151 598 q 238 445 151 469 q 389 434 280 434 l 389 331 l 349 331 q 206 315 255 331 q 125 210 125 287 q 183 107 125 145 q 302 76 233 76 q 436 117 379 76 q 509 234 493 159 l 634 234 m 520 1040 l 331 819 l 248 819 l 383 1040 l 520 1040 "
  },
  "ω": {
    x_min: 0,
    x_max: 922,
    ha: 1031,
    o: "m 922 339 q 856 97 922 203 q 650 -26 780 -26 q 538 9 587 -26 q 461 103 489 44 q 387 12 436 46 q 277 -22 339 -22 q 69 97 147 -22 q 0 339 0 203 q 45 551 0 444 q 161 738 84 643 l 302 738 q 175 553 219 647 q 124 336 124 446 q 155 179 124 249 q 275 88 197 88 q 375 163 341 88 q 400 294 400 219 l 400 572 l 524 572 l 524 294 q 561 135 524 192 q 643 88 591 88 q 762 182 719 88 q 797 342 797 257 q 745 556 797 450 q 619 738 705 638 l 760 738 q 874 551 835 640 q 922 339 922 444 "
  },
  "´": {
    x_min: 0,
    x_max: 96,
    ha: 251,
    o: "m 96 606 l 0 606 l 0 988 l 96 988 l 96 606 "
  },
  "±": {
    x_min: 11,
    x_max: 781,
    ha: 792,
    o: "m 781 490 l 446 490 l 446 255 l 349 255 l 349 490 l 11 490 l 11 586 l 349 586 l 349 819 l 446 819 l 446 586 l 781 586 l 781 490 m 781 21 l 11 21 l 11 115 l 781 115 l 781 21 "
  },
  "|": {
    x_min: 343,
    x_max: 449,
    ha: 792,
    o: "m 449 462 l 343 462 l 343 986 l 449 986 l 449 462 m 449 -242 l 343 -242 l 343 280 l 449 280 l 449 -242 "
  },
  "ϋ": {
    x_min: 0,
    x_max: 617,
    ha: 725,
    o: "m 482 800 l 372 800 l 372 925 l 482 925 l 482 800 m 239 800 l 129 800 l 129 925 l 239 925 l 239 800 m 617 352 q 540 93 617 199 q 308 -24 455 -24 q 76 93 161 -24 q 0 352 0 199 l 0 738 l 126 738 l 126 354 q 169 185 126 257 q 312 98 220 98 q 451 185 402 98 q 492 354 492 257 l 492 738 l 617 738 l 617 352 "
  },
  "§": {
    x_min: 0,
    x_max: 593,
    ha: 690,
    o: "m 593 425 q 554 312 593 369 q 467 233 516 254 q 537 83 537 172 q 459 -74 537 -12 q 288 -133 387 -133 q 115 -69 184 -133 q 47 96 47 -6 l 166 96 q 199 7 166 40 q 288 -26 232 -26 q 371 -5 332 -26 q 420 60 420 21 q 311 201 420 139 q 108 309 210 255 q 0 490 0 383 q 33 602 0 551 q 124 687 66 654 q 75 743 93 712 q 58 812 58 773 q 133 984 58 920 q 300 1043 201 1043 q 458 987 394 1043 q 529 814 529 925 l 411 814 q 370 908 404 877 q 289 939 336 939 q 213 911 246 939 q 180 841 180 883 q 286 720 180 779 q 484 612 480 615 q 593 425 593 534 m 467 409 q 355 544 467 473 q 196 630 228 612 q 146 587 162 609 q 124 525 124 558 q 239 387 124 462 q 398 298 369 315 q 448 345 429 316 q 467 409 467 375 "
  },
  b: {
    x_min: 0,
    x_max: 685,
    ha: 783,
    o: "m 685 372 q 597 99 685 213 q 347 -25 501 -25 q 219 5 277 -25 q 121 93 161 36 l 121 0 l 0 0 l 0 1013 l 121 1013 l 121 634 q 214 723 157 692 q 341 754 272 754 q 591 637 493 754 q 685 372 685 526 m 554 356 q 499 550 554 470 q 328 644 437 644 q 162 556 223 644 q 108 369 108 478 q 160 176 108 256 q 330 83 221 83 q 498 169 435 83 q 554 356 554 245 "
  },
  q: {
    x_min: 0,
    x_max: 683,
    ha: 876,
    o: "m 683 -278 l 564 -278 l 564 97 q 474 8 533 39 q 345 -23 415 -23 q 91 93 188 -23 q 0 364 0 203 q 87 635 0 522 q 337 760 184 760 q 466 727 408 760 q 564 637 523 695 l 564 737 l 683 737 l 683 -278 m 582 375 q 527 564 582 488 q 358 652 466 652 q 190 565 253 652 q 135 377 135 488 q 189 179 135 261 q 361 84 251 84 q 530 179 469 84 q 582 375 582 260 "
  },
  "Ω": {
    x_min: -0.171875,
    x_max: 969.5625,
    ha: 1068,
    o: "m 969 0 l 555 0 l 555 123 q 744 308 675 194 q 814 558 814 423 q 726 812 814 709 q 484 922 633 922 q 244 820 334 922 q 154 567 154 719 q 223 316 154 433 q 412 123 292 199 l 412 0 l 0 0 l 0 124 l 217 124 q 68 327 122 210 q 15 572 15 444 q 144 911 15 781 q 484 1041 274 1041 q 822 909 691 1041 q 953 569 953 777 q 899 326 953 443 q 750 124 846 210 l 969 124 l 969 0 "
  },
  "ύ": {
    x_min: 0,
    x_max: 617,
    ha: 725,
    o: "m 617 352 q 540 93 617 199 q 308 -24 455 -24 q 76 93 161 -24 q 0 352 0 199 l 0 738 l 126 738 l 126 354 q 169 185 126 257 q 312 98 220 98 q 451 185 402 98 q 492 354 492 257 l 492 738 l 617 738 l 617 352 m 535 1040 l 346 819 l 262 819 l 397 1040 l 535 1040 "
  },
  z: {
    x_min: -0.015625,
    x_max: 613.890625,
    ha: 697,
    o: "m 613 0 l 0 0 l 0 100 l 433 630 l 20 630 l 20 738 l 594 738 l 593 636 l 163 110 l 613 110 l 613 0 "
  },
  "™": {
    x_min: 0,
    x_max: 894,
    ha: 1e3,
    o: "m 389 951 l 229 951 l 229 503 l 160 503 l 160 951 l 0 951 l 0 1011 l 389 1011 l 389 951 m 894 503 l 827 503 l 827 939 l 685 503 l 620 503 l 481 937 l 481 503 l 417 503 l 417 1011 l 517 1011 l 653 580 l 796 1010 l 894 1011 l 894 503 "
  },
  "ή": {
    x_min: 0.78125,
    x_max: 697,
    ha: 810,
    o: "m 697 -278 l 572 -278 l 572 454 q 540 587 572 536 q 425 650 501 650 q 271 579 337 650 q 206 420 206 509 l 206 0 l 81 0 l 81 489 q 73 588 81 562 q 0 644 56 644 l 0 741 q 68 755 38 755 q 158 721 124 755 q 200 630 193 687 q 297 726 234 692 q 434 761 359 761 q 620 692 544 761 q 697 516 697 624 l 697 -278 m 479 1040 l 290 819 l 207 819 l 341 1040 l 479 1040 "
  },
  "Θ": {
    x_min: 0,
    x_max: 960,
    ha: 1056,
    o: "m 960 507 q 833 129 960 280 q 476 -32 698 -32 q 123 129 255 -32 q 0 507 0 280 q 123 883 0 732 q 476 1045 255 1045 q 832 883 696 1045 q 960 507 960 732 m 817 500 q 733 789 817 669 q 476 924 639 924 q 223 792 317 924 q 142 507 142 675 q 222 222 142 339 q 476 89 315 89 q 730 218 636 89 q 817 500 817 334 m 716 449 l 243 449 l 243 571 l 716 571 l 716 449 "
  },
  "®": {
    x_min: -3,
    x_max: 1008,
    ha: 1106,
    o: "m 503 532 q 614 562 566 532 q 672 658 672 598 q 614 747 672 716 q 503 772 569 772 l 338 772 l 338 532 l 503 532 m 502 -7 q 123 151 263 -7 q -3 501 -3 294 q 123 851 -3 706 q 502 1011 263 1011 q 881 851 739 1011 q 1008 501 1008 708 q 883 151 1008 292 q 502 -7 744 -7 m 502 60 q 830 197 709 60 q 940 501 940 322 q 831 805 940 681 q 502 944 709 944 q 174 805 296 944 q 65 501 65 680 q 173 197 65 320 q 502 60 294 60 m 788 146 l 678 146 q 653 316 655 183 q 527 449 652 449 l 338 449 l 338 146 l 241 146 l 241 854 l 518 854 q 688 808 621 854 q 766 658 766 755 q 739 563 766 607 q 668 497 713 519 q 751 331 747 472 q 788 164 756 190 l 788 146 "
  },
  "~": {
    x_min: 0,
    x_max: 833,
    ha: 931,
    o: "m 833 958 q 778 753 833 831 q 594 665 716 665 q 402 761 502 665 q 240 857 302 857 q 131 795 166 857 q 104 665 104 745 l 0 665 q 54 867 0 789 q 237 958 116 958 q 429 861 331 958 q 594 765 527 765 q 704 827 670 765 q 729 958 729 874 l 833 958 "
  },
  "Ε": {
    x_min: 0,
    x_max: 736.21875,
    ha: 778,
    o: "m 736 0 l 0 0 l 0 1013 l 725 1013 l 725 889 l 139 889 l 139 585 l 677 585 l 677 467 l 139 467 l 139 125 l 736 125 l 736 0 "
  },
  "³": {
    x_min: 0,
    x_max: 450,
    ha: 547,
    o: "m 450 552 q 379 413 450 464 q 220 366 313 366 q 69 414 130 366 q 0 567 0 470 l 85 567 q 126 470 85 504 q 225 437 168 437 q 320 467 280 437 q 360 552 360 498 q 318 632 360 608 q 213 657 276 657 q 195 657 203 657 q 176 657 181 657 l 176 722 q 279 733 249 722 q 334 815 334 752 q 300 881 334 856 q 220 907 267 907 q 133 875 169 907 q 97 781 97 844 l 15 781 q 78 926 15 875 q 220 972 135 972 q 364 930 303 972 q 426 817 426 888 q 344 697 426 733 q 421 642 392 681 q 450 552 450 603 "
  },
  "[": {
    x_min: 0,
    x_max: 273.609375,
    ha: 371,
    o: "m 273 -281 l 0 -281 l 0 1013 l 273 1013 l 273 920 l 124 920 l 124 -187 l 273 -187 l 273 -281 "
  },
  L: {
    x_min: 0,
    x_max: 645.828125,
    ha: 696,
    o: "m 645 0 l 0 0 l 0 1013 l 140 1013 l 140 126 l 645 126 l 645 0 "
  },
  "σ": {
    x_min: 0,
    x_max: 803.390625,
    ha: 894,
    o: "m 803 628 l 633 628 q 713 368 713 512 q 618 93 713 204 q 357 -25 518 -25 q 94 91 194 -25 q 0 368 0 201 q 94 644 0 533 q 356 761 194 761 q 481 750 398 761 q 608 739 564 739 l 803 739 l 803 628 m 360 85 q 529 180 467 85 q 584 374 584 262 q 527 566 584 490 q 352 651 463 651 q 187 559 247 651 q 135 368 135 478 q 189 175 135 254 q 360 85 251 85 "
  },
  "ζ": {
    x_min: 0,
    x_max: 573,
    ha: 642,
    o: "m 573 -40 q 553 -162 573 -97 q 510 -278 543 -193 l 400 -278 q 441 -187 428 -219 q 462 -90 462 -132 q 378 -14 462 -14 q 108 45 197 -14 q 0 290 0 117 q 108 631 0 462 q 353 901 194 767 l 55 901 l 55 1012 l 561 1012 l 561 924 q 261 669 382 831 q 128 301 128 489 q 243 117 128 149 q 458 98 350 108 q 573 -40 573 80 "
  },
  "θ": {
    x_min: 0,
    x_max: 674,
    ha: 778,
    o: "m 674 496 q 601 160 674 304 q 336 -26 508 -26 q 73 153 165 -26 q 0 485 0 296 q 72 840 0 683 q 343 1045 166 1045 q 605 844 516 1045 q 674 496 674 692 m 546 579 q 498 798 546 691 q 336 935 437 935 q 178 798 237 935 q 126 579 137 701 l 546 579 m 546 475 l 126 475 q 170 233 126 348 q 338 80 230 80 q 504 233 447 80 q 546 475 546 346 "
  },
  "Ο": {
    x_min: 0,
    x_max: 958,
    ha: 1054,
    o: "m 485 1042 q 834 883 703 1042 q 958 511 958 735 q 834 136 958 287 q 481 -26 701 -26 q 126 130 261 -26 q 0 504 0 279 q 127 880 0 729 q 485 1042 263 1042 m 480 98 q 731 225 638 98 q 815 504 815 340 q 733 783 815 670 q 480 913 640 913 q 226 785 321 913 q 142 504 142 671 q 226 224 142 339 q 480 98 319 98 "
  },
  "Γ": {
    x_min: 0,
    x_max: 705.28125,
    ha: 749,
    o: "m 705 886 l 140 886 l 140 0 l 0 0 l 0 1012 l 705 1012 l 705 886 "
  },
  " ": {
    x_min: 0,
    x_max: 0,
    ha: 375
  },
  "%": {
    x_min: -3,
    x_max: 1089,
    ha: 1186,
    o: "m 845 0 q 663 76 731 0 q 602 244 602 145 q 661 412 602 344 q 845 489 728 489 q 1027 412 959 489 q 1089 244 1089 343 q 1029 76 1089 144 q 845 0 962 0 m 844 103 q 945 143 909 103 q 981 243 981 184 q 947 340 981 301 q 844 385 909 385 q 744 342 781 385 q 708 243 708 300 q 741 147 708 186 q 844 103 780 103 m 888 986 l 284 -25 l 199 -25 l 803 986 l 888 986 m 241 468 q 58 545 126 468 q -3 715 -3 615 q 56 881 -3 813 q 238 958 124 958 q 421 881 353 958 q 483 712 483 813 q 423 544 483 612 q 241 468 356 468 m 241 855 q 137 811 175 855 q 100 710 100 768 q 136 612 100 653 q 240 572 172 572 q 344 614 306 572 q 382 713 382 656 q 347 810 382 771 q 241 855 308 855 "
  },
  P: {
    x_min: 0,
    x_max: 726,
    ha: 806,
    o: "m 424 1013 q 640 931 555 1013 q 726 719 726 850 q 637 506 726 587 q 413 426 548 426 l 140 426 l 140 0 l 0 0 l 0 1013 l 424 1013 m 379 889 l 140 889 l 140 548 l 372 548 q 522 589 459 548 q 593 720 593 637 q 528 845 593 801 q 379 889 463 889 "
  },
  "Έ": {
    x_min: 0,
    x_max: 1078.21875,
    ha: 1118,
    o: "m 1078 0 l 342 0 l 342 1013 l 1067 1013 l 1067 889 l 481 889 l 481 585 l 1019 585 l 1019 467 l 481 467 l 481 125 l 1078 125 l 1078 0 m 277 1040 l 83 799 l 0 799 l 140 1040 l 277 1040 "
  },
  "Ώ": {
    x_min: 0.125,
    x_max: 1136.546875,
    ha: 1235,
    o: "m 1136 0 l 722 0 l 722 123 q 911 309 842 194 q 981 558 981 423 q 893 813 981 710 q 651 923 800 923 q 411 821 501 923 q 321 568 321 720 q 390 316 321 433 q 579 123 459 200 l 579 0 l 166 0 l 166 124 l 384 124 q 235 327 289 210 q 182 572 182 444 q 311 912 182 782 q 651 1042 441 1042 q 989 910 858 1042 q 1120 569 1120 778 q 1066 326 1120 443 q 917 124 1013 210 l 1136 124 l 1136 0 m 277 1040 l 83 800 l 0 800 l 140 1041 l 277 1040 "
  },
  _: {
    x_min: 0,
    x_max: 705.5625,
    ha: 803,
    o: "m 705 -334 l 0 -334 l 0 -234 l 705 -234 l 705 -334 "
  },
  "Ϊ": {
    x_min: -110,
    x_max: 246,
    ha: 275,
    o: "m 246 1046 l 118 1046 l 118 1189 l 246 1189 l 246 1046 m 18 1046 l -110 1046 l -110 1189 l 18 1189 l 18 1046 m 136 0 l 0 0 l 0 1012 l 136 1012 l 136 0 "
  },
  "+": {
    x_min: 23,
    x_max: 768,
    ha: 792,
    o: "m 768 372 l 444 372 l 444 0 l 347 0 l 347 372 l 23 372 l 23 468 l 347 468 l 347 840 l 444 840 l 444 468 l 768 468 l 768 372 "
  },
  "½": {
    x_min: 0,
    x_max: 1050,
    ha: 1149,
    o: "m 1050 0 l 625 0 q 712 178 625 108 q 878 277 722 187 q 967 385 967 328 q 932 456 967 429 q 850 484 897 484 q 759 450 798 484 q 721 352 721 416 l 640 352 q 706 502 640 448 q 851 551 766 551 q 987 509 931 551 q 1050 385 1050 462 q 976 251 1050 301 q 829 179 902 215 q 717 68 740 133 l 1050 68 l 1050 0 m 834 985 l 215 -28 l 130 -28 l 750 984 l 834 985 m 224 422 l 142 422 l 142 811 l 0 811 l 0 867 q 104 889 62 867 q 164 973 157 916 l 224 973 l 224 422 "
  },
  "Ρ": {
    x_min: 0,
    x_max: 720,
    ha: 783,
    o: "m 424 1013 q 637 933 554 1013 q 720 723 720 853 q 633 508 720 591 q 413 426 546 426 l 140 426 l 140 0 l 0 0 l 0 1013 l 424 1013 m 378 889 l 140 889 l 140 548 l 371 548 q 521 589 458 548 q 592 720 592 637 q 527 845 592 801 q 378 889 463 889 "
  },
  "'": {
    x_min: 0,
    x_max: 139,
    ha: 236,
    o: "m 139 851 q 102 737 139 784 q 0 669 65 690 l 0 734 q 59 787 42 741 q 72 873 72 821 l 0 873 l 0 1013 l 139 1013 l 139 851 "
  },
  "ª": {
    x_min: 0,
    x_max: 350,
    ha: 397,
    o: "m 350 625 q 307 616 328 616 q 266 631 281 616 q 247 673 251 645 q 190 628 225 644 q 116 613 156 613 q 32 641 64 613 q 0 722 0 669 q 72 826 0 800 q 247 866 159 846 l 247 887 q 220 934 247 916 q 162 953 194 953 q 104 934 129 953 q 76 882 80 915 l 16 882 q 60 976 16 941 q 166 1011 104 1011 q 266 979 224 1011 q 308 891 308 948 l 308 706 q 311 679 308 688 q 331 670 315 670 l 350 672 l 350 625 m 247 757 l 247 811 q 136 790 175 798 q 64 726 64 773 q 83 682 64 697 q 132 667 103 667 q 207 690 174 667 q 247 757 247 718 "
  },
  "΅": {
    x_min: 0,
    x_max: 450,
    ha: 553,
    o: "m 450 800 l 340 800 l 340 925 l 450 925 l 450 800 m 406 1040 l 212 800 l 129 800 l 269 1040 l 406 1040 m 110 800 l 0 800 l 0 925 l 110 925 l 110 800 "
  },
  T: {
    x_min: 0,
    x_max: 777,
    ha: 835,
    o: "m 777 894 l 458 894 l 458 0 l 319 0 l 319 894 l 0 894 l 0 1013 l 777 1013 l 777 894 "
  },
  "Φ": {
    x_min: 0,
    x_max: 915,
    ha: 997,
    o: "m 527 0 l 389 0 l 389 122 q 110 231 220 122 q 0 509 0 340 q 110 785 0 677 q 389 893 220 893 l 389 1013 l 527 1013 l 527 893 q 804 786 693 893 q 915 509 915 679 q 805 231 915 341 q 527 122 696 122 l 527 0 m 527 226 q 712 310 641 226 q 779 507 779 389 q 712 705 779 627 q 527 787 641 787 l 527 226 m 389 226 l 389 787 q 205 698 275 775 q 136 505 136 620 q 206 308 136 391 q 389 226 276 226 "
  },
  "⁋": {
    x_min: 0,
    x_max: 0,
    ha: 694
  },
  j: {
    x_min: -77.78125,
    x_max: 167,
    ha: 349,
    o: "m 167 871 l 42 871 l 42 1013 l 167 1013 l 167 871 m 167 -80 q 121 -231 167 -184 q -26 -278 76 -278 l -77 -278 l -77 -164 l -41 -164 q 26 -143 11 -164 q 42 -65 42 -122 l 42 737 l 167 737 l 167 -80 "
  },
  "Σ": {
    x_min: 0,
    x_max: 756.953125,
    ha: 819,
    o: "m 756 0 l 0 0 l 0 107 l 395 523 l 22 904 l 22 1013 l 745 1013 l 745 889 l 209 889 l 566 523 l 187 125 l 756 125 l 756 0 "
  },
  "›": {
    x_min: 18.0625,
    x_max: 774,
    ha: 792,
    o: "m 774 376 l 18 40 l 18 149 l 631 421 l 18 692 l 18 799 l 774 465 l 774 376 "
  },
  "<": {
    x_min: 17.984375,
    x_max: 773.609375,
    ha: 792,
    o: "m 773 40 l 18 376 l 17 465 l 773 799 l 773 692 l 159 420 l 773 149 l 773 40 "
  },
  "£": {
    x_min: 0,
    x_max: 704.484375,
    ha: 801,
    o: "m 704 41 q 623 -10 664 5 q 543 -26 583 -26 q 359 15 501 -26 q 243 36 288 36 q 158 23 197 36 q 73 -21 119 10 l 6 76 q 125 195 90 150 q 175 331 175 262 q 147 443 175 383 l 0 443 l 0 512 l 108 512 q 43 734 43 623 q 120 929 43 854 q 358 1010 204 1010 q 579 936 487 1010 q 678 729 678 857 l 678 684 l 552 684 q 504 838 552 780 q 362 896 457 896 q 216 852 263 896 q 176 747 176 815 q 199 627 176 697 q 248 512 217 574 l 468 512 l 468 443 l 279 443 q 297 356 297 398 q 230 194 297 279 q 153 107 211 170 q 227 133 190 125 q 293 142 264 142 q 410 119 339 142 q 516 96 482 96 q 579 105 550 96 q 648 142 608 115 l 704 41 "
  },
  t: {
    x_min: 0,
    x_max: 367,
    ha: 458,
    o: "m 367 0 q 312 -5 339 -2 q 262 -8 284 -8 q 145 28 183 -8 q 108 143 108 64 l 108 638 l 0 638 l 0 738 l 108 738 l 108 944 l 232 944 l 232 738 l 367 738 l 367 638 l 232 638 l 232 185 q 248 121 232 140 q 307 102 264 102 q 345 104 330 102 q 367 107 360 107 l 367 0 "
  },
  "¬": {
    x_min: 0,
    x_max: 706,
    ha: 803,
    o: "m 706 411 l 706 158 l 630 158 l 630 335 l 0 335 l 0 411 l 706 411 "
  },
  "λ": {
    x_min: 0,
    x_max: 750,
    ha: 803,
    o: "m 750 -7 q 679 -15 716 -15 q 538 59 591 -15 q 466 214 512 97 l 336 551 l 126 0 l 0 0 l 270 705 q 223 837 247 770 q 116 899 190 899 q 90 898 100 899 l 90 1004 q 152 1011 125 1011 q 298 938 244 1011 q 373 783 326 901 l 605 192 q 649 115 629 136 q 716 95 669 95 l 736 95 q 750 97 745 97 l 750 -7 "
  },
  W: {
    x_min: 0,
    x_max: 1263.890625,
    ha: 1351,
    o: "m 1263 1013 l 995 0 l 859 0 l 627 837 l 405 0 l 265 0 l 0 1013 l 136 1013 l 342 202 l 556 1013 l 701 1013 l 921 207 l 1133 1012 l 1263 1013 "
  },
  ">": {
    x_min: 18.0625,
    x_max: 774,
    ha: 792,
    o: "m 774 376 l 18 40 l 18 149 l 631 421 l 18 692 l 18 799 l 774 465 l 774 376 "
  },
  v: {
    x_min: 0,
    x_max: 675.15625,
    ha: 761,
    o: "m 675 738 l 404 0 l 272 0 l 0 738 l 133 737 l 340 147 l 541 737 l 675 738 "
  },
  "τ": {
    x_min: 0.28125,
    x_max: 644.5,
    ha: 703,
    o: "m 644 628 l 382 628 l 382 179 q 388 120 382 137 q 436 91 401 91 q 474 94 447 91 q 504 97 501 97 l 504 0 q 454 -9 482 -5 q 401 -14 426 -14 q 278 67 308 -14 q 260 233 260 118 l 260 628 l 0 628 l 0 739 l 644 739 l 644 628 "
  },
  "ξ": {
    x_min: 0,
    x_max: 624.9375,
    ha: 699,
    o: "m 624 -37 q 608 -153 624 -96 q 563 -278 593 -211 l 454 -278 q 491 -183 486 -200 q 511 -83 511 -126 q 484 -23 511 -44 q 370 1 452 1 q 323 0 354 1 q 283 -1 293 -1 q 84 76 169 -1 q 0 266 0 154 q 56 431 0 358 q 197 538 108 498 q 94 613 134 562 q 54 730 54 665 q 77 823 54 780 q 143 901 101 867 l 27 901 l 27 1012 l 576 1012 l 576 901 l 380 901 q 244 863 303 901 q 178 745 178 820 q 312 600 178 636 q 532 582 380 582 l 532 479 q 276 455 361 479 q 118 281 118 410 q 165 173 118 217 q 274 120 208 133 q 494 101 384 110 q 624 -37 624 76 "
  },
  "&": {
    x_min: -3,
    x_max: 894.25,
    ha: 992,
    o: "m 894 0 l 725 0 l 624 123 q 471 0 553 40 q 306 -41 390 -41 q 168 -7 231 -41 q 62 92 105 26 q 14 187 31 139 q -3 276 -3 235 q 55 433 -3 358 q 248 581 114 508 q 170 689 196 640 q 137 817 137 751 q 214 985 137 922 q 384 1041 284 1041 q 548 988 483 1041 q 622 824 622 928 q 563 666 622 739 q 431 556 516 608 l 621 326 q 649 407 639 361 q 663 493 653 426 l 781 493 q 703 229 781 352 l 894 0 m 504 818 q 468 908 504 877 q 384 940 433 940 q 293 907 331 940 q 255 818 255 875 q 289 714 255 767 q 363 628 313 678 q 477 729 446 682 q 504 818 504 771 m 556 209 l 314 499 q 179 395 223 449 q 135 283 135 341 q 146 222 135 253 q 183 158 158 192 q 333 80 241 80 q 556 209 448 80 "
  },
  "Λ": {
    x_min: 0,
    x_max: 862.5,
    ha: 942,
    o: "m 862 0 l 719 0 l 426 847 l 143 0 l 0 0 l 356 1013 l 501 1013 l 862 0 "
  },
  I: {
    x_min: 41,
    x_max: 180,
    ha: 293,
    o: "m 180 0 l 41 0 l 41 1013 l 180 1013 l 180 0 "
  },
  G: {
    x_min: 0,
    x_max: 921,
    ha: 1011,
    o: "m 921 0 l 832 0 l 801 136 q 655 15 741 58 q 470 -28 568 -28 q 126 133 259 -28 q 0 499 0 284 q 125 881 0 731 q 486 1043 259 1043 q 763 957 647 1043 q 905 709 890 864 l 772 709 q 668 866 747 807 q 486 926 589 926 q 228 795 322 926 q 142 507 142 677 q 228 224 142 342 q 483 94 323 94 q 712 195 625 94 q 796 435 796 291 l 477 435 l 477 549 l 921 549 l 921 0 "
  },
  "ΰ": {
    x_min: 0,
    x_max: 617,
    ha: 725,
    o: "m 524 800 l 414 800 l 414 925 l 524 925 l 524 800 m 183 800 l 73 800 l 73 925 l 183 925 l 183 800 m 617 352 q 540 93 617 199 q 308 -24 455 -24 q 76 93 161 -24 q 0 352 0 199 l 0 738 l 126 738 l 126 354 q 169 185 126 257 q 312 98 220 98 q 451 185 402 98 q 492 354 492 257 l 492 738 l 617 738 l 617 352 m 489 1040 l 300 819 l 216 819 l 351 1040 l 489 1040 "
  },
  "`": {
    x_min: 0,
    x_max: 138.890625,
    ha: 236,
    o: "m 138 699 l 0 699 l 0 861 q 36 974 0 929 q 138 1041 72 1020 l 138 977 q 82 931 95 969 q 69 839 69 893 l 138 839 l 138 699 "
  },
  "·": {
    x_min: 0,
    x_max: 142,
    ha: 239,
    o: "m 142 585 l 0 585 l 0 738 l 142 738 l 142 585 "
  },
  "Υ": {
    x_min: 0.328125,
    x_max: 819.515625,
    ha: 889,
    o: "m 819 1013 l 482 416 l 482 0 l 342 0 l 342 416 l 0 1013 l 140 1013 l 411 533 l 679 1013 l 819 1013 "
  },
  r: {
    x_min: 0,
    x_max: 355.5625,
    ha: 432,
    o: "m 355 621 l 343 621 q 179 569 236 621 q 122 411 122 518 l 122 0 l 0 0 l 0 737 l 117 737 l 117 604 q 204 719 146 686 q 355 753 262 753 l 355 621 "
  },
  x: {
    x_min: 0,
    x_max: 675,
    ha: 764,
    o: "m 675 0 l 525 0 l 331 286 l 144 0 l 0 0 l 256 379 l 12 738 l 157 737 l 336 473 l 516 738 l 661 738 l 412 380 l 675 0 "
  },
  "μ": {
    x_min: 0,
    x_max: 696.609375,
    ha: 747,
    o: "m 696 -4 q 628 -14 657 -14 q 498 97 513 -14 q 422 8 470 41 q 313 -24 374 -24 q 207 3 258 -24 q 120 80 157 31 l 120 -278 l 0 -278 l 0 738 l 124 738 l 124 343 q 165 172 124 246 q 308 82 216 82 q 451 177 402 82 q 492 358 492 254 l 492 738 l 616 738 l 616 214 q 623 136 616 160 q 673 92 636 92 q 696 95 684 92 l 696 -4 "
  },
  h: {
    x_min: 0,
    x_max: 615,
    ha: 724,
    o: "m 615 472 l 615 0 l 490 0 l 490 454 q 456 590 490 535 q 338 654 416 654 q 186 588 251 654 q 122 436 122 522 l 122 0 l 0 0 l 0 1013 l 122 1013 l 122 633 q 218 727 149 694 q 362 760 287 760 q 552 676 484 760 q 615 472 615 600 "
  },
  ".": {
    x_min: 0,
    x_max: 142,
    ha: 239,
    o: "m 142 0 l 0 0 l 0 151 l 142 151 l 142 0 "
  },
  "φ": {
    x_min: -2,
    x_max: 878,
    ha: 974,
    o: "m 496 -279 l 378 -279 l 378 -17 q 101 88 204 -17 q -2 367 -2 194 q 68 626 -2 510 q 283 758 151 758 l 283 646 q 167 537 209 626 q 133 373 133 462 q 192 177 133 254 q 378 93 259 93 l 378 758 q 445 764 426 763 q 476 765 464 765 q 765 659 653 765 q 878 377 878 553 q 771 96 878 209 q 496 -17 665 -17 l 496 -279 m 496 93 l 514 93 q 687 183 623 93 q 746 380 746 265 q 691 569 746 491 q 522 658 629 658 l 496 656 l 496 93 "
  },
  ";": {
    x_min: 0,
    x_max: 142,
    ha: 239,
    o: "m 142 585 l 0 585 l 0 738 l 142 738 l 142 585 m 142 -12 q 105 -132 142 -82 q 0 -206 68 -182 l 0 -138 q 58 -82 43 -123 q 68 0 68 -56 l 0 0 l 0 151 l 142 151 l 142 -12 "
  },
  f: {
    x_min: 0,
    x_max: 378,
    ha: 472,
    o: "m 378 638 l 246 638 l 246 0 l 121 0 l 121 638 l 0 638 l 0 738 l 121 738 q 137 935 121 887 q 290 1028 171 1028 q 320 1027 305 1028 q 378 1021 334 1026 l 378 908 q 323 918 346 918 q 257 870 273 918 q 246 780 246 840 l 246 738 l 378 738 l 378 638 "
  },
  "“": {
    x_min: 1,
    x_max: 348.21875,
    ha: 454,
    o: "m 140 670 l 1 670 l 1 830 q 37 943 1 897 q 140 1011 74 990 l 140 947 q 82 900 97 940 q 68 810 68 861 l 140 810 l 140 670 m 348 670 l 209 670 l 209 830 q 245 943 209 897 q 348 1011 282 990 l 348 947 q 290 900 305 940 q 276 810 276 861 l 348 810 l 348 670 "
  },
  A: {
    x_min: 0.03125,
    x_max: 906.953125,
    ha: 1008,
    o: "m 906 0 l 756 0 l 648 303 l 251 303 l 142 0 l 0 0 l 376 1013 l 529 1013 l 906 0 m 610 421 l 452 867 l 293 421 l 610 421 "
  },
  "‘": {
    x_min: 1,
    x_max: 139.890625,
    ha: 236,
    o: "m 139 670 l 1 670 l 1 830 q 37 943 1 897 q 139 1011 74 990 l 139 947 q 82 900 97 940 q 68 810 68 861 l 139 810 l 139 670 "
  },
  "ϊ": {
    x_min: -70,
    x_max: 283,
    ha: 361,
    o: "m 283 800 l 173 800 l 173 925 l 283 925 l 283 800 m 40 800 l -70 800 l -70 925 l 40 925 l 40 800 m 283 3 q 232 -10 257 -5 q 181 -15 206 -15 q 84 26 118 -15 q 41 200 41 79 l 41 737 l 166 737 l 167 215 q 171 141 167 157 q 225 101 182 101 q 247 103 238 101 q 283 112 256 104 l 283 3 "
  },
  "π": {
    x_min: -0.21875,
    x_max: 773.21875,
    ha: 857,
    o: "m 773 -7 l 707 -11 q 575 40 607 -11 q 552 174 552 77 l 552 226 l 552 626 l 222 626 l 222 0 l 97 0 l 97 626 l 0 626 l 0 737 l 773 737 l 773 626 l 676 626 l 676 171 q 695 103 676 117 q 773 90 714 90 l 773 -7 "
  },
  "ά": {
    x_min: 0,
    x_max: 765.5625,
    ha: 809,
    o: "m 765 -4 q 698 -14 726 -14 q 564 97 586 -14 q 466 7 525 40 q 337 -26 407 -26 q 88 98 186 -26 q 0 369 0 212 q 88 637 0 525 q 337 760 184 760 q 465 727 407 760 q 563 637 524 695 l 563 738 l 685 738 l 685 222 q 693 141 685 168 q 748 94 708 94 q 765 95 760 94 l 765 -4 m 584 371 q 531 562 584 485 q 360 653 470 653 q 192 566 254 653 q 135 379 135 489 q 186 181 135 261 q 358 84 247 84 q 528 176 465 84 q 584 371 584 260 m 604 1040 l 415 819 l 332 819 l 466 1040 l 604 1040 "
  },
  O: {
    x_min: 0,
    x_max: 958,
    ha: 1057,
    o: "m 485 1041 q 834 882 702 1041 q 958 512 958 734 q 834 136 958 287 q 481 -26 702 -26 q 126 130 261 -26 q 0 504 0 279 q 127 880 0 728 q 485 1041 263 1041 m 480 98 q 731 225 638 98 q 815 504 815 340 q 733 783 815 669 q 480 912 640 912 q 226 784 321 912 q 142 504 142 670 q 226 224 142 339 q 480 98 319 98 "
  },
  n: {
    x_min: 0,
    x_max: 615,
    ha: 724,
    o: "m 615 463 l 615 0 l 490 0 l 490 454 q 453 592 490 537 q 331 656 410 656 q 178 585 240 656 q 117 421 117 514 l 117 0 l 0 0 l 0 738 l 117 738 l 117 630 q 218 728 150 693 q 359 764 286 764 q 552 675 484 764 q 615 463 615 593 "
  },
  l: {
    x_min: 41,
    x_max: 166,
    ha: 279,
    o: "m 166 0 l 41 0 l 41 1013 l 166 1013 l 166 0 "
  },
  "¤": {
    x_min: 40.09375,
    x_max: 728.796875,
    ha: 825,
    o: "m 728 304 l 649 224 l 512 363 q 383 331 458 331 q 256 363 310 331 l 119 224 l 40 304 l 177 441 q 150 553 150 493 q 184 673 150 621 l 40 818 l 119 898 l 267 749 q 321 766 291 759 q 384 773 351 773 q 447 766 417 773 q 501 749 477 759 l 649 898 l 728 818 l 585 675 q 612 618 604 648 q 621 553 621 587 q 591 441 621 491 l 728 304 m 384 682 q 280 643 318 682 q 243 551 243 604 q 279 461 243 499 q 383 423 316 423 q 487 461 449 423 q 525 553 525 500 q 490 641 525 605 q 384 682 451 682 "
  },
  "κ": {
    x_min: 0,
    x_max: 632.328125,
    ha: 679,
    o: "m 632 0 l 482 0 l 225 384 l 124 288 l 124 0 l 0 0 l 0 738 l 124 738 l 124 446 l 433 738 l 596 738 l 312 466 l 632 0 "
  },
  p: {
    x_min: 0,
    x_max: 685,
    ha: 786,
    o: "m 685 364 q 598 96 685 205 q 350 -23 504 -23 q 121 89 205 -23 l 121 -278 l 0 -278 l 0 738 l 121 738 l 121 633 q 220 726 159 691 q 351 761 280 761 q 598 636 504 761 q 685 364 685 522 m 557 371 q 501 560 557 481 q 330 651 437 651 q 162 559 223 651 q 108 366 108 479 q 162 177 108 254 q 333 87 224 87 q 502 178 441 87 q 557 371 557 258 "
  },
  "‡": {
    x_min: 0,
    x_max: 777,
    ha: 835,
    o: "m 458 238 l 458 0 l 319 0 l 319 238 l 0 238 l 0 360 l 319 360 l 319 681 l 0 683 l 0 804 l 319 804 l 319 1015 l 458 1013 l 458 804 l 777 804 l 777 683 l 458 683 l 458 360 l 777 360 l 777 238 l 458 238 "
  },
  "ψ": {
    x_min: 0,
    x_max: 808,
    ha: 907,
    o: "m 465 -278 l 341 -278 l 341 -15 q 87 102 180 -15 q 0 378 0 210 l 0 739 l 133 739 l 133 379 q 182 195 133 275 q 341 98 242 98 l 341 922 l 465 922 l 465 98 q 623 195 563 98 q 675 382 675 278 l 675 742 l 808 742 l 808 381 q 720 104 808 213 q 466 -13 627 -13 l 465 -278 "
  },
  "η": {
    x_min: 0.78125,
    x_max: 697,
    ha: 810,
    o: "m 697 -278 l 572 -278 l 572 454 q 540 587 572 536 q 425 650 501 650 q 271 579 337 650 q 206 420 206 509 l 206 0 l 81 0 l 81 489 q 73 588 81 562 q 0 644 56 644 l 0 741 q 68 755 38 755 q 158 720 124 755 q 200 630 193 686 q 297 726 234 692 q 434 761 359 761 q 620 692 544 761 q 697 516 697 624 l 697 -278 "
  }
};
const cssFontWeight = "normal";
const ascender = 1189;
const underlinePosition = -100;
const cssFontStyle = "normal";
const boundingBox = {
  yMin: -334,
  xMin: -111,
  yMax: 1189,
  xMax: 1672
};
const resolution = 1e3;
const original_font_information = {
  postscript_name: "Helvetiker-Regular",
  version_string: "Version 1.00 2004 initial release",
  vendor_url: "http://www.magenta.gr/",
  full_font_name: "Helvetiker",
  font_family_name: "Helvetiker",
  copyright: "Copyright (c) Μagenta ltd, 2004",
  description: "",
  trademark: "",
  designer: "",
  designer_url: "",
  unique_font_identifier: "Μagenta ltd:Helvetiker:22-10-104",
  license_url: "http://www.ellak.gr/fonts/MgOpen/license.html",
  license_description: 'Copyright (c) 2004 by MAGENTA Ltd. All Rights Reserved.\r\n\r\nPermission is hereby granted, free of charge, to any person obtaining a copy of the fonts accompanying this license ("Fonts") and associated documentation files (the "Font Software"), to reproduce and distribute the Font Software, including without limitation the rights to use, copy, merge, publish, distribute, and/or sell copies of the Font Software, and to permit persons to whom the Font Software is furnished to do so, subject to the following conditions: \r\n\r\nThe above copyright and this permission notice shall be included in all copies of one or more of the Font Software typefaces.\r\n\r\nThe Font Software may be modified, altered, or added to, and in particular the designs of glyphs or characters in the Fonts may be modified and additional glyphs or characters may be added to the Fonts, only if the fonts are renamed to names not containing the word "MgOpen", or if the modifications are accepted for inclusion in the Font Software itself by the each appointed Administrator.\r\n\r\nThis License becomes null and void to the extent applicable to Fonts or Font Software that has been modified and is distributed under the "MgOpen" name.\r\n\r\nThe Font Software may be sold as part of a larger software package but no copy of one or more of the Font Software typefaces may be sold by itself. \r\n\r\nTHE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL MAGENTA OR PERSONS OR BODIES IN CHARGE OF ADMINISTRATION AND MAINTENANCE OF THE FONT SOFTWARE BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM OTHER DEALINGS IN THE FONT SOFTWARE.',
  manufacturer_name: "Μagenta ltd",
  font_sub_family_name: "Regular"
};
const descender = -334;
const familyName = "Helvetiker";
const lineHeight = 1522;
const underlineThickness = 50;
const fontJSON = {
  glyphs,
  cssFontWeight,
  ascender,
  underlinePosition,
  cssFontStyle,
  boundingBox,
  resolution,
  original_font_information,
  descender,
  familyName,
  lineHeight,
  underlineThickness
};
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
const labels = {
  color: {
    en: "Color",
    es: "Color"
  },
  mesh: {
    en: "Mesh",
    es: "Objeto"
  },
  metalness: {
    en: "Metalness",
    es: "Metálico"
  },
  p: {
    en: "P",
    es: "P"
  },
  q: {
    en: "Q",
    es: "Q"
  },
  radialSegments: {
    en: "Radial segments",
    es: "Segmentos radiales"
  },
  radius: {
    en: "Radius",
    es: "Radio"
  },
  repeatX: {
    en: "Repeat X",
    es: "Repetir X"
  },
  repeatY: {
    en: "Repeat Y",
    es: "Repetir Y"
  },
  roughness: {
    en: "Roughness",
    es: "Rugosidad"
  },
  size: {
    en: "Size",
    es: "Tamaño"
  },
  speed: {
    en: "Speed",
    es: "Velocidad"
  },
  text: {
    en: "Text",
    es: "Texto"
  },
  torus: {
    en: "Torus",
    es: "Torus"
  },
  tube: {
    en: "Tube",
    es: "Tubo"
  },
  tubularSegments: {
    en: "Tubular segments",
    es: "Segmentos tubulares"
  },
  word: {
    en: "Word",
    es: "Palabra"
  }
};
const DEFAULTS = {
  time: 0,
  speed: 0.4,
  repeatX: 1,
  repeatY: 3,
  radius: 1,
  tube: 0.32,
  tubularSegments: 740,
  radialSegments: 3,
  p: 4,
  q: 3,
  word: "ENDLESS",
  textColor: 16777215,
  textSize: 1,
  fontFile: "assets/kinetic-typo/fonts/helvetiker-regular.typeface.json",
  meshColor: 16711680,
  metalness: 0,
  roughness: 0
};
class GeneralData extends AssetGeneralData {
}
class EntityData extends AssetEntityData {
  constructor() {
    super(...arguments);
    this.properties = {
      time: new Uniform(DEFAULTS.time),
      texture: new Uniform(new Texture()),
      speed: new Uniform(DEFAULTS.speed),
      repeatX: new Uniform(DEFAULTS.repeatX),
      repeatY: new Uniform(DEFAULTS.repeatY),
      radius: DEFAULTS.radius,
      tube: DEFAULTS.tube,
      tubularSegments: DEFAULTS.tubularSegments,
      radialSegments: DEFAULTS.radialSegments,
      p: DEFAULTS.p,
      q: DEFAULTS.q,
      word: DEFAULTS.word,
      textColor: DEFAULTS.textColor,
      textSize: DEFAULTS.textSize,
      fontFile: DEFAULTS.fontFile,
      meshColor: DEFAULTS.meshColor,
      geometry: new TorusKnotGeometry(1, 0.32, 740, 3, 4, 3),
      metalness: DEFAULTS.metalness,
      roughness: DEFAULTS.roughness,
      vertexShader: torus_vertex_default,
      fragmentShader: torus_fragment_default
    };
    this.fontLoader = new FontLoader();
    this.textMesh = new Mesh(new BufferGeometry(), new MeshBasicMaterial({ color: new Color(this.properties.textColor) }));
    this.mesh = new Mesh(new BufferGeometry(), new CustomShaderMaterial({ baseMaterial: new MeshPhysicalMaterial() }));
    this.renderTarget = {
      rt: new WebGLRenderTarget(window.innerWidth, window.innerHeight),
      camera: new OrthographicCamera(),
      scene: new Scene()
    };
  }
  init() {
    this.setRenderTargetScene();
    this.updateTextGeometry();
    this.updateMeshGeometry();
    this.updateMeshMaterial();
    this.mesh.lookAt(new Vector3());
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;
    this.mesh.onBeforeRender = (renderer) => {
      renderer.setRenderTarget(this.renderTarget.rt);
      renderer.render(this.renderTarget.scene, this.renderTarget.camera);
      renderer.setRenderTarget(null);
    };
  }
  setRenderTargetScene() {
    this.renderTarget.camera.position.z = 1;
    this.renderTarget.scene.background = new Color(this.properties.meshColor);
    this.properties.texture.value = this.renderTarget.rt.texture;
    this.renderTarget.scene.add(this.textMesh);
  }
  updateTextGeometry() {
    var _a;
    if ((_a = this.textMesh) == null ? void 0 : _a.geometry) {
      this.textMesh.geometry.dispose();
    }
    const font = this.fontLoader.parse(fontJSON);
    const geometry = new TextGeometry(this.properties.word, { font, size: 1, depth: 0, curveSegments: 10 });
    geometry.center();
    this.textMesh.geometry = geometry;
    this.updateSize();
  }
  updateMeshGeometry() {
    var _a;
    if ((_a = this.mesh) == null ? void 0 : _a.geometry) {
      this.mesh.geometry.dispose();
    }
    const geometry = new TorusKnotGeometry(this.properties.radius, this.properties.tube, this.properties.tubularSegments, this.properties.radialSegments, this.properties.p, this.properties.q);
    this.mesh.geometry = geometry;
  }
  updateSize() {
    const bbox = this.textMesh.geometry.boundingBox;
    const width = bbox.max.x - bbox.min.x;
    const height = bbox.max.y - bbox.min.y;
    this.renderTarget.camera.left = bbox.min.x;
    this.renderTarget.camera.right = bbox.max.x;
    this.renderTarget.camera.top = bbox.max.y;
    this.renderTarget.camera.bottom = bbox.min.y;
    this.renderTarget.camera.updateProjectionMatrix();
    const resolution2 = 500;
    this.renderTarget.rt.setSize(width * resolution2, height * resolution2);
  }
  updateMeshMaterial() {
    const material = new CustomShaderMaterial({
      vertexShader: this.properties.vertexShader,
      fragmentShader: this.properties.fragmentShader,
      uniforms: {
        uTime: this.properties.time,
        uTexture: this.properties.texture,
        uSpeed: this.properties.speed,
        uRepeatX: this.properties.repeatX,
        uRepeatY: this.properties.repeatY
      },
      defines: { PI: Math.PI },
      silent: true,
      baseMaterial: MeshPhysicalMaterial,
      metalness: this.properties.metalness,
      roughness: this.properties.roughness,
      side: DoubleSide
    });
    this.mesh.material = material;
  }
}
class KineticTypo extends DigoAssetThree {
  constructor(entities) {
    super();
    this.setLabels(labels);
    this.addDefaultProperties(true, true);
    this.addTextProperties();
    this.addMeshProperties();
    this.addTorusProperties();
    const generalData = new GeneralData();
    generalData.container = new Scene();
    this.setGeneralData(generalData);
    entities.forEach((entity) => {
      this.createEntity(entity);
    });
  }
  createEntity(id) {
    const entityData = new EntityData();
    entityData.init();
    const mesh = entityData.mesh;
    entityData.component = mesh;
    this.addEntity(id, entityData);
    this.getContainer().add(mesh);
  }
  addTorusProperties() {
    this.addPropertyNumber(ENTITY_PROPERTY, "radius", 0, 10, 2, 0.01, DEFAULTS.radius).group("torus").setter((data, value) => {
      data.properties.radius = value;
      data.updateMeshGeometry();
    }).getter((data) => data.properties.radius);
    this.addPropertyNumber(ENTITY_PROPERTY, "tube", 0, 2, 2, 0.01, DEFAULTS.tube).group("torus").setter((data, value) => {
      data.properties.tube = value;
      data.updateMeshGeometry();
    }).getter((data) => data.properties.tube);
    this.addPropertyNumber(ENTITY_PROPERTY, "tubularSegments", 3, 1e3, 0, 0.1, DEFAULTS.tubularSegments).group("torus").setter((data, value) => {
      data.properties.tubularSegments = value;
      data.updateMeshGeometry();
    }).getter((data) => data.properties.tubularSegments);
    this.addPropertyNumber(ENTITY_PROPERTY, "radialSegments", 3, 1e3, 0, 0.1, DEFAULTS.radialSegments).group("torus").setter((data, value) => {
      data.properties.radialSegments = value;
      data.updateMeshGeometry();
    }).getter((data) => data.properties.radialSegments);
    this.addPropertyNumber(ENTITY_PROPERTY, "p", 1, 100, 0, 1, DEFAULTS.p).group("torus").setter((data, value) => {
      data.properties.p = value;
      data.updateMeshGeometry();
    }).getter((data) => data.properties.p);
    this.addPropertyNumber(ENTITY_PROPERTY, "q", 0, 100, 0, 1, DEFAULTS.q).group("torus").setter((data, value) => {
      data.properties.q = value;
      data.updateMeshGeometry();
    }).getter((data) => data.properties.q);
  }
  addTextProperties() {
    this.addPropertyString(ENTITY_PROPERTY, "word", DEFAULTS.word).group("text").setter((data, value) => {
      data.properties.word = value;
      data.updateTextGeometry();
    }).getter((data) => data.properties.word);
    this.addPropertyNumber(ENTITY_PROPERTY, "size", 0, 1, 2, 0.01, DEFAULTS.textSize).group("text").setter((data, value) => {
      data.properties.textSize = value;
      data.updateSize();
    }).getter((data) => data.properties.textSize);
    this.addPropertyColor(ENTITY_PROPERTY, "textColor", DEFAULTS.textColor).group("text").setter((data, value) => {
      data.textMesh.material.color = new Color(value >>> 8);
    }).getter((data) => Number.parseInt(`${data.textMesh.material.color.getHex().toString(16)}ff`, 16));
    this.addPropertyNumber(ENTITY_PROPERTY, "speed", 0, 1, 2, 0.01, DEFAULTS.speed).group("text").setter((data, value) => {
      data.properties.speed.value = value;
    }).getter((data) => data.properties.speed.value);
    this.addPropertyNumber(ENTITY_PROPERTY, "repeatX", 1, 100, 0, 0.01, DEFAULTS.repeatX).group("text").setter((data, value) => {
      data.properties.repeatX.value = value;
    }).getter((data) => data.properties.repeatX.value);
    this.addPropertyNumber(ENTITY_PROPERTY, "repeatY", 1, 100, 0, 0.01, DEFAULTS.repeatY).group("text").setter((data, value) => {
      data.properties.repeatY.value = value;
    }).getter((data) => data.properties.repeatY.value);
  }
  addMeshProperties() {
    this.addPropertyColor(ENTITY_PROPERTY, "meshColor", DEFAULTS.meshColor).group("mesh").setter((data, value) => {
      data.renderTarget.scene.background = new Color(value >>> 8);
    }).getter((data) => Number.parseInt(`${data.renderTarget.scene.background.getHex().toString(16)}ff`, 16));
    this.addPropertyNumber(ENTITY_PROPERTY, "metalness", 0, 1, 2, 0.01, DEFAULTS.metalness).group("mesh").setter((data, value) => {
      data.component.material.metalness = value;
    }).getter((data) => data.component.material.metalness);
    this.addPropertyNumber(ENTITY_PROPERTY, "roughness", 0, 1, 2, 0.01, DEFAULTS.roughness).group("mesh").setter((data, value) => {
      data.component.material.roughness = value;
    }).getter((data) => data.component.material.roughness);
  }
  tick(parameters) {
    this.getEntities().forEach((entityName) => {
      const entityData = this.getEntity(entityName);
      entityData.properties.time.value = parameters.elapsedTime;
    });
    super.tick(parameters);
  }
}
const digoAssetData = {
  info: {
    name: {
      en: "Kinetic Typo",
      es: "Tipografía Kinética"
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
    return new KineticTypo(entities || []);
  }
};
Helper.loadAsset(digoAssetData);
