import { B as BufferGeometry, a as BufferAttribute, M as Material, b as Mesh, V as Vector3, c as Matrix4, S as Scene, C as Color, U as Uniform, d as Vector2, I as InstancedMesh, e as MeshPhysicalMaterial, W as WebGLRenderTarget, O as OrthographicCamera, f as ShaderMaterial, P as PlaneGeometry, D as DoubleSide, g as Object3D, h as InstancedBufferAttribute } from "./three.js";
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
function mergeGeometries(geometries, useGroups = false) {
  const isIndexed = geometries[0].index !== null;
  const attributesUsed = new Set(Object.keys(geometries[0].attributes));
  const morphAttributesUsed = new Set(Object.keys(geometries[0].morphAttributes));
  const attributes = {};
  const morphAttributes = {};
  const morphTargetsRelative = geometries[0].morphTargetsRelative;
  const mergedGeometry = new BufferGeometry();
  let offset = 0;
  for (let i = 0; i < geometries.length; ++i) {
    const geometry = geometries[i];
    let attributesCount = 0;
    if (isIndexed !== (geometry.index !== null)) {
      console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + i + ". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.");
      return null;
    }
    for (const name in geometry.attributes) {
      if (!attributesUsed.has(name)) {
        console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + i + '. All geometries must have compatible attributes; make sure "' + name + '" attribute exists among all geometries, or in none of them.');
        return null;
      }
      if (attributes[name] === void 0)
        attributes[name] = [];
      attributes[name].push(geometry.attributes[name]);
      attributesCount++;
    }
    if (attributesCount !== attributesUsed.size) {
      console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + i + ". Make sure all geometries have the same number of attributes.");
      return null;
    }
    if (morphTargetsRelative !== geometry.morphTargetsRelative) {
      console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + i + ". .morphTargetsRelative must be consistent throughout all geometries.");
      return null;
    }
    for (const name in geometry.morphAttributes) {
      if (!morphAttributesUsed.has(name)) {
        console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + i + ".  .morphAttributes must be consistent throughout all geometries.");
        return null;
      }
      if (morphAttributes[name] === void 0)
        morphAttributes[name] = [];
      morphAttributes[name].push(geometry.morphAttributes[name]);
    }
    if (useGroups) {
      let count;
      if (isIndexed) {
        count = geometry.index.count;
      } else if (geometry.attributes.position !== void 0) {
        count = geometry.attributes.position.count;
      } else {
        console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + i + ". The geometry must have either an index or a position attribute");
        return null;
      }
      mergedGeometry.addGroup(offset, count, i);
      offset += count;
    }
  }
  if (isIndexed) {
    let indexOffset = 0;
    const mergedIndex = [];
    for (let i = 0; i < geometries.length; ++i) {
      const index = geometries[i].index;
      for (let j = 0; j < index.count; ++j) {
        mergedIndex.push(index.getX(j) + indexOffset);
      }
      indexOffset += geometries[i].attributes.position.count;
    }
    mergedGeometry.setIndex(mergedIndex);
  }
  for (const name in attributes) {
    const mergedAttribute = mergeAttributes(attributes[name]);
    if (!mergedAttribute) {
      console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the " + name + " attribute.");
      return null;
    }
    mergedGeometry.setAttribute(name, mergedAttribute);
  }
  for (const name in morphAttributes) {
    const numMorphTargets = morphAttributes[name][0].length;
    if (numMorphTargets === 0)
      break;
    mergedGeometry.morphAttributes = mergedGeometry.morphAttributes || {};
    mergedGeometry.morphAttributes[name] = [];
    for (let i = 0; i < numMorphTargets; ++i) {
      const morphAttributesToMerge = [];
      for (let j = 0; j < morphAttributes[name].length; ++j) {
        morphAttributesToMerge.push(morphAttributes[name][j][i]);
      }
      const mergedMorphAttribute = mergeAttributes(morphAttributesToMerge);
      if (!mergedMorphAttribute) {
        console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the " + name + " morphAttribute.");
        return null;
      }
      mergedGeometry.morphAttributes[name].push(mergedMorphAttribute);
    }
  }
  return mergedGeometry;
}
function mergeAttributes(attributes) {
  let TypedArray;
  let itemSize;
  let normalized;
  let gpuType = -1;
  let arrayLength = 0;
  for (let i = 0; i < attributes.length; ++i) {
    const attribute = attributes[i];
    if (TypedArray === void 0)
      TypedArray = attribute.array.constructor;
    if (TypedArray !== attribute.array.constructor) {
      console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.");
      return null;
    }
    if (itemSize === void 0)
      itemSize = attribute.itemSize;
    if (itemSize !== attribute.itemSize) {
      console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.");
      return null;
    }
    if (normalized === void 0)
      normalized = attribute.normalized;
    if (normalized !== attribute.normalized) {
      console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.");
      return null;
    }
    if (gpuType === -1)
      gpuType = attribute.gpuType;
    if (gpuType !== attribute.gpuType) {
      console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes.");
      return null;
    }
    arrayLength += attribute.count * itemSize;
  }
  const array = new TypedArray(arrayLength);
  const result = new BufferAttribute(array, itemSize, normalized);
  let offset = 0;
  for (let i = 0; i < attributes.length; ++i) {
    const attribute = attributes[i];
    if (attribute.isInterleavedBufferAttribute) {
      const tupleOffset = offset / itemSize;
      for (let j = 0, l = attribute.count; j < l; j++) {
        for (let c = 0; c < itemSize; c++) {
          const value = attribute.getComponent(j, c);
          result.setComponent(j + tupleOffset, c, value);
        }
      }
    } else {
      array.set(attribute.array, offset);
    }
    offset += attribute.count * itemSize;
  }
  if (gpuType !== void 0) {
    result.gpuType = gpuType;
  }
  return result;
}
function getModelMesh(id, desiredSize, onLoad) {
  Helper.getGlobal().loadGLTF(id, (gltf) => {
    const geometries = [];
    let material = new Material();
    gltf.scene.traverse((node) => {
      if (node instanceof Mesh) {
        const mesh = node;
        const geometry = mesh.geometry.clone();
        geometry.applyMatrix4(mesh.matrixWorld);
        geometries.push(geometry);
        material = mesh.material;
      }
    });
    const mergedGeometry = mergeGeometries(geometries);
    mergedGeometry.computeVertexNormals();
    mergedGeometry.computeBoundingSphere();
    mergedGeometry.computeTangents();
    mergedGeometry.computeBoundingBox();
    const size = mergedGeometry.boundingBox.getSize(new Vector3());
    const scaleFactor = 1 / Math.max(size.x, size.y, size.z);
    const scaleMatrix = new Matrix4().makeScale(scaleFactor, scaleFactor, scaleFactor);
    mergedGeometry.applyMatrix4(scaleMatrix);
    mergedGeometry.scale(desiredSize, desiredSize, desiredSize);
    onLoad(new Mesh(mergedGeometry, material));
  });
}
const labels = {
  columns: {
    en: "Columns",
    es: "Columnas"
  },
  displacement: {
    en: "Displacement",
    es: "Desplazamiento"
  },
  frequency: {
    en: "Frequency",
    es: "Frecuencia"
  },
  geometry: {
    en: "Geometry",
    es: "Geometría"
  },
  grid: {
    en: "Grid",
    es: "Grid"
  },
  highlightedColor: {
    en: "Highlighted Color",
    es: "Color en Activo"
  },
  influence: {
    en: "Influence",
    es: "Influencia"
  },
  influenceNumber: {
    en: "Quantity",
    es: "Cantidad"
  },
  material: {
    en: "Material",
    es: "Material"
  },
  mesh: {
    en: "Mesh",
    es: "Objeto"
  },
  noise: {
    en: "Noise",
    es: "Ruido"
  },
  noiseFrequency: {
    en: "Frequency",
    es: "Frecencia"
  },
  noiseSpeed: {
    en: "Speed",
    es: "Velocidad"
  },
  percentage: {
    en: "Percentage",
    es: "Porcenta"
  },
  pivotPoint: {
    en: "Pivot point",
    es: "Pivote"
  },
  rotateFactor: {
    en: "Rotate factor",
    es: "Factor de rotación"
  },
  rows: {
    en: "Rows",
    es: "Filas"
  },
  scaleFactor: {
    en: "Scale factor",
    es: "Factor de escala"
  },
  size: {
    en: "Size",
    es: "Tamaño"
  },
  space: {
    en: "Space",
    es: "Espacio"
  },
  speed: {
    en: "Speed",
    es: "Velocidad"
  },
  translateFactor: {
    en: "Translate factor",
    es: "Factor de translación"
  },
  waveDisplacement: {
    en: "Wave Displacement",
    es: "Desplazamiento de Ola"
  }
};
const easingFunctions = `
// Linear
float linear(float t) {
    return t;
}

// Ease In Quad
float easeInQuad(float t) {
    return t * t;
}

// Ease Out Quad
float easeOutQuad(float t) {
    return -1.0 * t * (t - 2.0);
}

// Ease In Out Quad
float easeInOutQuad(float t) {
    t *= 2.0;
    if (t < 1.0) return 0.5 * t * t;
    t--;
    return -0.5 * (t * (t - 2.0) - 1.0);
}

// Ease In Cubic
float easeInCubic(float t) {
    return t * t * t;
}

// Ease Out Cubic
float easeOutCubic(float t) {
    t--;
    return t * t * t + 1.0;
}

// Ease In Out Cubic
float easeInOutCubic(float t) {
    t *= 2.0;
    if (t < 1.0) return 0.5 * t * t * t;
    t -= 2.0;
    return 0.5 * (t * t * t + 2.0);
}

// Ease In Quart
float easeInQuart(float t) {
    return t * t * t * t;
}

// Ease Out Quart
float easeOutQuart(float t) {
    t--;
    return -1.0 * (t * t * t * t - 1.0);
}

// Ease In Out Quart
float easeInOutQuart(float t) {
    t *= 2.0;
    if (t < 1.0) return 0.5 * t * t * t * t;
    t -= 2.0;
    return -0.5 * (t * t * t * t - 2.0);
}

// Ease In Quint
float easeInQuint(float t) {
    return t * t * t * t * t;
}

// Ease Out Quint
float easeOutQuint(float t) {
    t--;
    return t * t * t * t * t + 1.0;
}

// Ease In Out Quint
float easeInOutQuint(float t) {
    t *= 2.0;
    if (t < 1.0) return 0.5 * t * t * t * t * t;
    t -= 2.0;
    return 0.5 * (t * t * t * t * t + 2.0);
}
`;
const noiseFunctions = `
//Classic Perlin 3D Noise 
//by Stefan Gustavson
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec3 P){
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}
`;
const GROW_KEYS = ["linear", "circular"];
const GROW_ICONS = ["FormatAlignLeft", "FormatAlignCenter"];
const DEFAULTS = {
  columns: 10,
  rows: 10,
  maxColumns: 100,
  maxRows: 100,
  size: 1,
  space: 0,
  percentage: 0,
  influence: 2,
  influenceNumber: 5,
  noise: 2,
  noiseFrequency: 5,
  noiseSpeed: 0.4,
  decay: 0,
  center: { x: 0.5, y: 0.5 },
  positionStart: { x: 0, y: 0, z: 0 },
  positionEnd: { x: 0, y: 0, z: 0 },
  rotationStart: { x: 0, y: 0, z: 0 },
  rotationEnd: { x: 0, y: 0, z: 0 },
  scaleStart: { x: 1, y: 1, z: 1 },
  scaleEnd: { x: 1, y: 2, z: 1 },
  pivotPoint: { x: 0, y: 0, z: 0 },
  material: { digoType: "physical", color: 16777215 },
  highlightedColor: 16711680,
  growIndex: 0
};
class GeneralData extends AssetGeneralData {
}
class EntityData extends AssetEntityData {
  constructor() {
    super();
    this.properties = {
      columns: new Uniform(DEFAULTS.columns),
      rows: new Uniform(DEFAULTS.rows),
      size: DEFAULTS.size,
      space: DEFAULTS.space,
      time: new Uniform(0),
      percentage: new Uniform(DEFAULTS.percentage),
      highlightedColor: new Uniform(new Color(DEFAULTS.highlightedColor)),
      influence: new Uniform(DEFAULTS.influence),
      influenceNumber: new Uniform(DEFAULTS.influenceNumber),
      noiseFrequency: new Uniform(DEFAULTS.noiseFrequency),
      noiseSpeed: new Uniform(DEFAULTS.noiseSpeed),
      noise: new Uniform(DEFAULTS.noise),
      decay: new Uniform(DEFAULTS.decay),
      center: new Uniform(new Vector2(DEFAULTS.center.x, DEFAULTS.center.y)),
      positionStart: new Uniform(new Vector3(DEFAULTS.positionStart.x, DEFAULTS.positionStart.y, DEFAULTS.positionStart.z)),
      positionEnd: new Uniform(new Vector3(DEFAULTS.positionEnd.x, DEFAULTS.positionEnd.y, DEFAULTS.positionEnd.z)),
      rotationStart: new Uniform(new Vector3(DEFAULTS.rotationEnd.x, DEFAULTS.rotationEnd.y, DEFAULTS.rotationEnd.z)),
      rotationEnd: new Uniform(new Vector3(DEFAULTS.rotationEnd.x, DEFAULTS.rotationEnd.y, DEFAULTS.rotationEnd.z)),
      scaleStart: new Uniform(new Vector3(DEFAULTS.scaleStart.x, DEFAULTS.scaleStart.y, DEFAULTS.scaleStart.z)),
      scaleEnd: new Uniform(new Vector3(DEFAULTS.scaleEnd.x, DEFAULTS.scaleEnd.y, DEFAULTS.scaleEnd.z)),
      pivotPoint: DEFAULTS.pivotPoint,
      objectId: "",
      material: { digoType: "physical", color: 16777215 },
      growIndex: new Uniform(DEFAULTS.growIndex)
    };
    this.gridInstances = new InstancedMesh(
      new BufferGeometry(),
      new MeshPhysicalMaterial({ name: `${Math.random()}` }),
      DEFAULTS.maxColumns * DEFAULTS.maxRows
    );
    this.fbo = {
      renderTarget: new WebGLRenderTarget(100, 100),
      camera: new OrthographicCamera(-1, 1, 1, -1, -1, 1),
      material: new ShaderMaterial(),
      geometry: new PlaneGeometry(2, 2),
      mesh: new Mesh(),
      scene: new Scene()
    };
    this.debug = new Mesh(new PlaneGeometry(1, 1), new MeshPhysicalMaterial({ map: this.fbo.renderTarget.texture, side: DoubleSide }));
    this.originalGeometry = new BufferGeometry();
    this.updateGrid();
    this.setupMaterial();
    this.setupInstances();
  }
  updateGrid() {
    const w = this.properties.space + this.properties.size;
    const x = this.properties.columns.value;
    const y = this.properties.rows.value;
    const instances = x * y;
    this.gridInstances.count = instances;
    const dummy = new Object3D();
    const instanceUV = new Float32Array(instances * 3);
    let instanceIndex = 0;
    for (let i = 0; i < x; i++) {
      for (let j = 0; j < y; j++) {
        const u = x === 1 ? 0 : i / (x - 1);
        const v = y === 1 ? 0 : j / (y - 1);
        instanceUV.set([u, v, instanceIndex + 1], instanceIndex * 3);
        dummy.position.set(
          w * (i + 0.5 - x / 2),
          0,
          w * (j + 0.5 - y / 2)
        );
        dummy.updateMatrix();
        this.gridInstances.setMatrixAt(instanceIndex, dummy.matrix);
        instanceIndex++;
      }
    }
    this.gridInstances.instanceMatrix.needsUpdate = true;
    this.gridInstances.geometry.setAttribute("instanceUV", new InstancedBufferAttribute(instanceUV, 3));
  }
  setupInstances() {
    this.gridInstances.receiveShadow = true;
    this.gridInstances.castShadow = true;
    this.gridInstances.computeBoundingSphere();
  }
  setupMaterial() {
    const uniforms = {
      time: this.properties.time,
      uHighlightedColor: this.properties.highlightedColor,
      uPercentage: this.properties.percentage,
      uInfluence: this.properties.influence,
      uInfluenceNumber: this.properties.influenceNumber,
      uNoiseFrequency: this.properties.noiseFrequency,
      uNoiseSpeed: this.properties.noiseSpeed,
      uNoise: this.properties.noise,
      uPositionStart: this.properties.positionStart,
      uPositionEnd: this.properties.positionEnd,
      uRotationStart: this.properties.rotationStart,
      uRotationEnd: this.properties.rotationEnd,
      uScaleStart: this.properties.scaleStart,
      uScaleEnd: this.properties.scaleEnd,
      uGrowIndex: this.properties.growIndex,
      uColumns: this.properties.columns,
      uRows: this.properties.rows,
      uCenter: this.properties.center,
      uDecay: this.properties.decay
    };
    this.gridInstances.material.onBeforeCompile = (shader) => {
      shader.uniforms = Object.assign(shader.uniforms, uniforms);
      shader.vertexShader = easingFunctions + noiseFunctions + shader.vertexShader.replace(
        "#include <common>",
        `
        uniform float time;
        uniform float uPercentage;
        uniform float uColumns;
        uniform float uRows;
        uniform float uInfluenceNumber;
        uniform float uInfluence;
        uniform float uNoise;
        uniform float uNoiseFrequency;
        uniform float uNoiseSpeed;
        uniform float uDecay;
        uniform int uGrowIndex;
        uniform vec2 uCenter;
        uniform vec3 uPositionStart;
        uniform vec3 uPositionEnd;
        uniform vec3 uRotationStart;
        uniform vec3 uRotationEnd;
        uniform vec3 uScaleStart;
        uniform vec3 uScaleEnd;
        attribute vec3 instanceUV;
        varying float vDisplacementFactor;
        varying float vHeightUV;

        `
      );
      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        `
        #include <begin_vertex>

        float noise = (cnoise(vec3(instanceUV.x * uNoiseFrequency, instanceUV.y * uNoiseFrequency , time * uNoiseSpeed)) + 1.0) * 0.5 * uNoise;
        float displacement = 0.0;
        
        if (uGrowIndex == 0){
          
          float firstActiveInstance = uPercentage * uColumns * uRows / 100.0;

          float firstActiveInstanceFraction = fract(firstActiveInstance);

          float firstActiveInstanceIndex = floor(firstActiveInstance + 1.0);

          float influenceFactor = 1.0 - abs((firstActiveInstance + 1.0 - uInfluenceNumber * 0.5) - instanceUV.z) / (uInfluenceNumber * 0.5);

          if(instanceUV.z > firstActiveInstanceIndex){
            displacement = 0.0;
          } else if (instanceUV.z == firstActiveInstanceIndex){
            displacement = (1.0 + noise) * firstActiveInstanceFraction;
          } else if (instanceUV.z < firstActiveInstanceIndex && instanceUV.z > firstActiveInstanceIndex - uInfluenceNumber ) {
            displacement =  1.0 + easeInOutCubic(influenceFactor) * uInfluence + noise;
          } else {
            displacement = 1.0 + noise;
          }
        } else {

          vec2 corner1 = vec2(0, 0);
          vec2 corner2 = vec2(0, 1);
          vec2 corner3 = vec2(1, 0);
          vec2 corner4 = vec2(1, 1);
          float maxDistance1 = max(distance(uCenter, corner1), distance(uCenter, corner2));
          float maxDistance2 = max(distance(uCenter, corner3), distance(uCenter, corner4));
          float maxDistance = max(maxDistance1, maxDistance2);

          float distanceFromCenter = distance(instanceUV.xy, uCenter);
          float threshold = (uPercentage / 100.0) * maxDistance;

          
          float range = (uInfluenceNumber / 100.0) * threshold;

          float offset = range * uPercentage/100.0;

          float upperEdge = threshold + offset;
          float lowerEdge = threshold - range + offset;
          float midpoint = (lowerEdge + upperEdge) / 2.0;
          float influenceFactor = smoothstep(lowerEdge, midpoint, distanceFromCenter) * (1.0 - smoothstep(midpoint, upperEdge, distanceFromCenter));

          if (distanceFromCenter <= upperEdge && distanceFromCenter >= midpoint) {
            displacement = easeInOutCubic(influenceFactor) * (uInfluence + 1.0 + noise);
          } else if(distanceFromCenter < midpoint && distanceFromCenter >= lowerEdge){
            displacement = 1.0 + easeInOutCubic(influenceFactor) * uInfluence + noise;
          } else if(distanceFromCenter <= lowerEdge){
            displacement = 1.0 + noise;
          } else {
            displacement = 0.0;
          }
        }

        transformed.x *= displacement * (uScaleEnd.x - uScaleStart.x) + uScaleStart.x;
        transformed.y *= displacement * (uScaleEnd.y - uScaleStart.y) + uScaleStart.y;
        transformed.z *= displacement * (uScaleEnd.z - uScaleStart.z) + uScaleStart.z;

        transformed.x += displacement * (uPositionEnd.x - uPositionStart.x) + uPositionStart.x;
        transformed.y += displacement * (uPositionEnd.y - uPositionStart.x) + uPositionStart.y;
        transformed.z += displacement * (uPositionEnd.z - uPositionStart.x) + uPositionStart.z;

        float angleX = displacement * (uRotationEnd.x - uRotationStart.x) + uRotationStart.x;
        float angleY = displacement * (uRotationEnd.y - uRotationStart.y) + uRotationStart.y;
        float angleZ = displacement * (uRotationEnd.z - uRotationStart.z) + uRotationStart.z;

        float cosX = cos(angleX);
        float sinX = sin(angleX);
        float cosY = cos(angleY);
        float sinY = sin(angleY);
        float cosZ = cos(angleZ);
        float sinZ = sin(angleZ);

        mat3 rotationMatrixX = mat3(
          1.0, 0.0, 0.0,
          0.0, cosX, -sinX,
          0.0, sinX, cosX
        );

        mat3 rotationMatrixY = mat3(
          cosY, 0.0, sinY,
          0.0, 1.0, 0.0,
          -sinY, 0.0, cosY
        );

        mat3 rotationMatrixZ = mat3(
          cosZ, -sinZ, 0.0,
          sinZ, cosZ, 0.0,
          0.0, 0.0, 1.0
        );

        transformed *= rotationMatrixX;
        transformed *= rotationMatrixY;
        transformed *= rotationMatrixZ;

        float totalDisplacement = 1.0 + uNoise + uInfluence;

        vDisplacementFactor = displacement / totalDisplacement;

        vHeightUV = clamp(transformed.y-1.0, 0.0, 1.0);

        `
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <common>",
        `
        #include <common>
        uniform vec3 uHighlightedColor;
        varying float vDisplacementFactor;
        varying float vHeightUV;
        
        `
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <color_fragment>",
        `#include <color_fragment>
        
        diffuseColor.rgb = mix(diffuseColor.rgb, uHighlightedColor, vHeightUV);
        diffuseColor.rgb = mix(diffuseColor.rgb, uHighlightedColor, vDisplacementFactor);

        `
      );
    };
  }
}
class GridInstances extends DigoAssetThree {
  constructor(entities) {
    super();
    this.webGLRenderer = Helper.getGlobal().getThreeWebGLRenderer();
    this.setLabels(labels);
    this.addDefaultProperties(true, true);
    this.addProperties();
    const generalData = new GeneralData();
    generalData.container = new Scene();
    this.setGeneralData(generalData);
    entities.forEach((entity) => {
      this.createEntity(entity);
    });
  }
  updateGeometry(entityData) {
    const previousSize = entityData.properties.size;
    getModelMesh(entityData.properties.objectId, entityData.properties.size, (mesh) => {
      entityData.gridInstances.geometry = mesh.geometry;
      entityData.originalGeometry = mesh.geometry;
      const scaleFactor = entityData.properties.size / previousSize;
      entityData.gridInstances.geometry.scale(scaleFactor, scaleFactor, scaleFactor);
      this.updatePivotPoint(entityData);
    });
  }
  updatePivotPoint(data) {
    if (!data.originalGeometry) {
      data.originalGeometry = data.gridInstances.geometry.clone();
    }
    const geometry = data.originalGeometry.clone();
    const pivotPoint = data.properties.pivotPoint;
    const size = new Vector3();
    if (geometry.boundingBox) {
      geometry.boundingBox.getSize(size);
      const translation = new Vector3();
      translation.copy(size).multiplyScalar(-0.5).add(pivotPoint);
      const translationMatrix = new Matrix4().makeTranslation(translation.x, translation.y, translation.z);
      geometry.applyMatrix4(translationMatrix);
      data.gridInstances.geometry = geometry;
      data.updateGrid();
    }
  }
  createEntity(id) {
    const entityData = new EntityData();
    const component = entityData.gridInstances;
    entityData.component = component;
    this.addEntity(id, entityData);
    this.getContainer().add(component);
  }
  addProperties() {
    this.addPropertyObject3D(ENTITY_PROPERTY, "geometry").group("mesh").setter((data, value) => {
      data.properties.objectId = value;
      this.updateGeometry(data);
    }).getter((data) => data.properties.objectId);
    this.addPropertyMaterial(ENTITY_PROPERTY, "material", DEFAULTS.material).group("mesh").setter((data, value, property) => this.updateMaterial(data.gridInstances, data.properties, "material", property, value)).getter((data) => data.properties.material);
    this.addPropertyColor(ENTITY_PROPERTY, "highlightedColor", DEFAULTS.highlightedColor).group("mesh").setter((data, value) => {
      data.properties.highlightedColor.value = new Color(value >>> 8);
    }).getter((data) => Number.parseInt(`${data.properties.highlightedColor.value.getHex().toString(16)}ff`, 16));
    this.addPropertyNumber(ENTITY_PROPERTY, "columns", 1, DEFAULTS.maxColumns, 0, 1, DEFAULTS.columns).group("grid").setter((data, value) => {
      data.properties.columns.value = value;
      data.updateGrid();
    }).getter((data) => data.properties.columns.value);
    this.addPropertyNumber(ENTITY_PROPERTY, "rows", 1, DEFAULTS.maxRows, 0, 1, DEFAULTS.rows).group("grid").setter((data, value) => {
      data.properties.rows.value = value;
      data.updateGrid();
    }).getter((data) => data.properties.rows.value);
    this.addPropertyNumber(ENTITY_PROPERTY, "size", 0.01, Infinity, 2, 0.01, DEFAULTS.size).group("grid").setter((data, value) => {
      const scaleFactor = value / data.properties.size;
      data.properties.size = value;
      data.gridInstances.geometry.scale(scaleFactor, scaleFactor, scaleFactor);
      data.updateGrid();
    }).getter((data) => data.properties.size);
    this.addPropertyNumber(ENTITY_PROPERTY, "space", 1e-3, Infinity, 2, 0.01, DEFAULTS.space).group("grid").setter((data, value) => {
      data.properties.space = value;
      data.updateGrid();
    }).getter((data) => data.properties.space);
    this.addPropertyNumber(ENTITY_PROPERTY, "percentage", 0, 100, 2, 0.01, DEFAULTS.percentage).group("displacement").setter((data, value) => {
      data.updateGrid();
      data.properties.percentage.value = value;
    }).getter((data) => data.properties.percentage.value);
    this.addPropertyOptions(ENTITY_PROPERTY, "grow", GROW_KEYS[DEFAULTS.growIndex], GROW_KEYS, GROW_ICONS).group("displacement").setter((data, value) => {
      data.properties.growIndex.value = GROW_KEYS.findIndex((element) => element === value);
    }).getter((data) => GROW_KEYS[data.properties.growIndex.value]);
    this.addPropertyNumber(ENTITY_PROPERTY, "decay", 0, 100, 2, 0.01, DEFAULTS.decay).group("displacement").setter((data, value) => {
      data.properties.decay.value = value;
    }).getter((data) => data.properties.decay.value);
    this.addPropertyXY(ENTITY_PROPERTY, "center", DEFAULTS.center.x, DEFAULTS.center.y).group("displacement").setter((data, value) => {
      data.properties.center.value = value;
    }).getter((data) => data.properties.center.value);
    this.addPropertyXYZ(ENTITY_PROPERTY, "pivotPoint", true, DEFAULTS.pivotPoint.x, DEFAULTS.pivotPoint.y, DEFAULTS.pivotPoint.z).group("displacement").setter((data, value) => {
      data.properties.pivotPoint = value;
      this.updatePivotPoint(data);
    }).getter((data) => data.properties.pivotPoint);
    this.addPropertyXYZ(ENTITY_PROPERTY, "positionStart", false, DEFAULTS.positionStart.x, DEFAULTS.positionStart.y, DEFAULTS.positionStart.z).group("displacement").setter((data, value) => {
      data.properties.positionStart.value = value;
    }).getter((data) => data.properties.positionStart.value);
    this.addPropertyXYZ(ENTITY_PROPERTY, "positionEnd", false, DEFAULTS.positionEnd.x, DEFAULTS.positionEnd.y, DEFAULTS.positionEnd.z).group("displacement").setter((data, value) => {
      data.properties.positionEnd.value = value;
    }).getter((data) => data.properties.positionEnd.value);
    this.addPropertyXYZ(ENTITY_PROPERTY, "rotationStart", false, DEFAULTS.rotationStart.x, DEFAULTS.rotationStart.y, DEFAULTS.rotationStart.z).group("displacement").setter((data, value) => {
      data.properties.rotationStart.value = value;
    }).getter((data) => data.properties.rotationStart.value);
    this.addPropertyXYZ(ENTITY_PROPERTY, "rotationEnd", false, DEFAULTS.rotationEnd.x, DEFAULTS.rotationEnd.y, DEFAULTS.rotationEnd.z).group("displacement").setter((data, value) => {
      data.properties.rotationEnd.value = value;
    }).getter((data) => data.properties.rotationEnd.value);
    this.addPropertyXYZ(ENTITY_PROPERTY, "scaleStart", true, DEFAULTS.scaleStart.x, DEFAULTS.scaleStart.y, DEFAULTS.scaleStart.z).group("displacement").setter((data, value) => {
      data.properties.scaleStart.value = value;
    }).getter((data) => data.properties.scaleStart.value);
    this.addPropertyXYZ(ENTITY_PROPERTY, "scaleEnd", true, DEFAULTS.scaleEnd.x, DEFAULTS.scaleEnd.y, DEFAULTS.scaleEnd.z).group("displacement").setter((data, value) => {
      data.properties.scaleEnd.value = value;
    }).getter((data) => data.properties.scaleEnd.value);
    this.addPropertyNumber(ENTITY_PROPERTY, "influence", 0, 10, 2, 0.01, DEFAULTS.influence).group("influence").setter((data, value) => {
      data.properties.influence.value = value;
    }).getter((data) => data.properties.influence.value);
    this.addPropertyNumber(ENTITY_PROPERTY, "influenceNumber", 0, 100, 2, 0.01, DEFAULTS.influenceNumber).group("influence").setter((data, value) => {
      data.properties.influenceNumber.value = value;
    }).getter((data) => data.properties.influenceNumber.value);
    this.addPropertyNumber(ENTITY_PROPERTY, "noise", 0, 10, 2, 0.01, DEFAULTS.noise).group("noise").setter((data, value) => {
      data.properties.noise.value = value;
    }).getter((data) => data.properties.noise.value);
    this.addPropertyNumber(ENTITY_PROPERTY, "noiseFrequency", 0, 10, 2, 0.01, DEFAULTS.noiseFrequency).group("noise").setter((data, value) => {
      data.properties.noiseFrequency.value = value;
    }).getter((data) => data.properties.noiseFrequency.value);
    this.addPropertyNumber(ENTITY_PROPERTY, "noiseSpeed", 0, 2, 2, 0.01, DEFAULTS.noiseSpeed).group("noise").setter((data, value) => {
      data.properties.noiseSpeed.value = value;
    }).getter((data) => data.properties.noiseSpeed.value);
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
      en: "Grid Instances",
      es: "Grid de Instancias"
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
    return new GridInstances(entities || []);
  }
};
Helper.loadAsset(digoAssetData);
