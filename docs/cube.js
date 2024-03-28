import { S as Scene, B as BoxGeometry, M as MeshStandardMaterial, a as Mesh } from "./three.js";
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
class Cube extends AssetBase {
  constructor(entities) {
    super();
    this.addDefaultProperties(true, true);
    this.addPropertyColor(ENTITY_PROPERTY, "color", -1);
    this.setScene(new Scene());
    entities.forEach((entity) => {
      this.createEntity(entity);
    });
  }
  createEntity(id) {
    const geometry = new BoxGeometry(0.8, 0.8, 0.8);
    const material = new MeshStandardMaterial({ name: `${Math.random()}`, color: Math.floor(Math.random() * 16777215) });
    const mesh = new Mesh(geometry, material);
    mesh.position.x = 0;
    this.addEntity(id, mesh);
    this.getScene().add(mesh);
  }
  updateProperty(entity, property, value, nextUpdate = 0) {
    if (entity && property === "color") {
      this.updatePropertyColor(entity, this.getEntity(entity), value);
    } else {
      super.updateProperty(entity, property, value, nextUpdate);
    }
  }
  getProperty(entity, property) {
    if (entity && property === "color") {
      return this.getPropertyColor(entity, this.getEntity(entity));
    }
    return super.getProperty(entity, property);
  }
}
const digoAssetData = {
  info: {
    name: {
      en: "Cube",
      es: "Cubo"
    },
    category: "objects",
    icon: "ViewInAr",
    vendor: "Digo",
    license: "MIT",
    version: "1.0",
    module: {
      type: "threejs",
      version: "0.158.0"
    }
  },
  create: (entities) => {
    return new Cube(entities || []);
  }
};
console.log("Cube asset loaded");
Helper.loadAsset(digoAssetData);
