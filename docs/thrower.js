import { B as BufferGeometry, a as BufferAttribute, L as LineSegments, b as LineBasicMaterial, c as BoxGeometry, S as SphereGeometry, I as IcosahedronGeometry, V as Vector3, Q as Quaternion, E as Euler, d as Scene, M as Material, e as Mesh, f as Matrix4, g as InstancedMesh, h as MeshPhysicalMaterial, D as DynamicDrawUsage, i as MathUtils } from "./three.js";
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
  addPropertyXYZ(general, id, canLinkValues, x2, y2, z2) {
    const defaultValue = {
      x: x2 ?? 0,
      y: y2 ?? 0,
      z: z2 ?? 0
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
  addPropertyXY(general, id, x2, y2) {
    const defaultValue = {
      x: x2 ?? 0,
      y: y2 ?? 0
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
      const x2 = value.x ?? object[property].x;
      const y2 = value.y ?? object[property].y;
      const z2 = value.z ?? object[property].z;
      object[property].x = x2;
      object[property].y = y2;
      object[property].z = z2;
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
  loadRGBE(id, onLoad) {
    var _a;
    (_a = Helper.getGlobal()) == null ? void 0 : _a.loadRGBE(id, onLoad);
  }
  updateMaterial(mesh, object, field, property, value) {
    var _a;
    (_a = Helper.getGlobal()) == null ? void 0 : _a.updateMaterial(mesh, property, value, object[field]);
    const [_2, subProperty] = property.split("/");
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
  for (let i2 = 0; i2 < geometries.length; ++i2) {
    const geometry = geometries[i2];
    let attributesCount = 0;
    if (isIndexed !== (geometry.index !== null)) {
      console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + i2 + ". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.");
      return null;
    }
    for (const name in geometry.attributes) {
      if (!attributesUsed.has(name)) {
        console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + i2 + '. All geometries must have compatible attributes; make sure "' + name + '" attribute exists among all geometries, or in none of them.');
        return null;
      }
      if (attributes[name] === void 0)
        attributes[name] = [];
      attributes[name].push(geometry.attributes[name]);
      attributesCount++;
    }
    if (attributesCount !== attributesUsed.size) {
      console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + i2 + ". Make sure all geometries have the same number of attributes.");
      return null;
    }
    if (morphTargetsRelative !== geometry.morphTargetsRelative) {
      console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + i2 + ". .morphTargetsRelative must be consistent throughout all geometries.");
      return null;
    }
    for (const name in geometry.morphAttributes) {
      if (!morphAttributesUsed.has(name)) {
        console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + i2 + ".  .morphAttributes must be consistent throughout all geometries.");
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
        console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + i2 + ". The geometry must have either an index or a position attribute");
        return null;
      }
      mergedGeometry.addGroup(offset, count, i2);
      offset += count;
    }
  }
  if (isIndexed) {
    let indexOffset = 0;
    const mergedIndex = [];
    for (let i2 = 0; i2 < geometries.length; ++i2) {
      const index = geometries[i2].index;
      for (let j2 = 0; j2 < index.count; ++j2) {
        mergedIndex.push(index.getX(j2) + indexOffset);
      }
      indexOffset += geometries[i2].attributes.position.count;
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
    for (let i2 = 0; i2 < numMorphTargets; ++i2) {
      const morphAttributesToMerge = [];
      for (let j2 = 0; j2 < morphAttributes[name].length; ++j2) {
        morphAttributesToMerge.push(morphAttributes[name][j2][i2]);
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
  for (let i2 = 0; i2 < attributes.length; ++i2) {
    const attribute = attributes[i2];
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
  for (let i2 = 0; i2 < attributes.length; ++i2) {
    const attribute = attributes[i2];
    if (attribute.isInterleavedBufferAttribute) {
      const tupleOffset = offset / itemSize;
      for (let j2 = 0, l2 = attribute.count; j2 < l2; j2++) {
        for (let c2 = 0; c2 < itemSize; c2++) {
          const value = attribute.getComponent(j2, c2);
          result.setComponent(j2 + tupleOffset, c2, value);
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
let A;
const I = new Array(128).fill(void 0);
I.push(void 0, null, true, false);
let g = I.length;
function C(A2) {
  g === I.length && I.push(I.length + 1);
  const C2 = g;
  return g = I[C2], I[C2] = A2, C2;
}
function B(A2) {
  return I[A2];
}
function Q(A2) {
  const C2 = B(A2);
  return function(A3) {
    A3 < 132 || (I[A3] = g, g = A3);
  }(A2), C2;
}
function E(A2) {
  return null == A2;
}
let i = null;
function D() {
  return null !== i && 0 !== i.byteLength || (i = new Float64Array(A.memory.buffer)), i;
}
let o = null;
function G() {
  return null !== o && 0 !== o.byteLength || (o = new Int32Array(A.memory.buffer)), o;
}
const w = "undefined" != typeof TextDecoder ? new TextDecoder("utf-8", { ignoreBOM: true, fatal: true }) : { decode: () => {
  throw Error("TextDecoder not available");
} };
"undefined" != typeof TextDecoder && w.decode();
let S = null;
function k(I2, g2) {
  return I2 >>>= 0, w.decode((null !== S && 0 !== S.byteLength || (S = new Uint8Array(A.memory.buffer)), S).subarray(I2, I2 + g2));
}
function U(A2, I2) {
  if (!(A2 instanceof I2))
    throw new Error(`expected instance of ${I2.name}`);
  return A2.ptr;
}
let a = null;
function K() {
  return null !== a && 0 !== a.byteLength || (a = new Float32Array(A.memory.buffer)), a;
}
let h = 128;
function J(A2) {
  if (1 == h)
    throw new Error("out of js stack");
  return I[--h] = A2, h;
}
function y(A2, I2) {
  return A2 >>>= 0, K().subarray(A2 / 4, A2 / 4 + I2);
}
let M = null;
function N() {
  return null !== M && 0 !== M.byteLength || (M = new Uint32Array(A.memory.buffer)), M;
}
let F = 0;
function R(A2, I2) {
  const g2 = I2(4 * A2.length, 4) >>> 0;
  return K().set(A2, g2 / 4), F = A2.length, g2;
}
function q(A2, I2) {
  const g2 = I2(4 * A2.length, 4) >>> 0;
  return N().set(A2, g2 / 4), F = A2.length, g2;
}
function s(I2, g2) {
  try {
    return I2.apply(this, g2);
  } catch (I3) {
    A.__wbindgen_exn_store(C(I3));
  }
}
const c = Object.freeze({ Ball: 0, 0: "Ball", Cuboid: 1, 1: "Cuboid", Capsule: 2, 2: "Capsule", Segment: 3, 3: "Segment", Polyline: 4, 4: "Polyline", Triangle: 5, 5: "Triangle", TriMesh: 6, 6: "TriMesh", HeightField: 7, 7: "HeightField", Compound: 8, 8: "Compound", ConvexPolyhedron: 9, 9: "ConvexPolyhedron", Cylinder: 10, 10: "Cylinder", Cone: 11, 11: "Cone", RoundCuboid: 12, 12: "RoundCuboid", RoundTriangle: 13, 13: "RoundTriangle", RoundCylinder: 14, 14: "RoundCylinder", RoundCone: 15, 15: "RoundCone", RoundConvexPolyhedron: 16, 16: "RoundConvexPolyhedron", HalfSpace: 17, 17: "HalfSpace" }), Y = Object.freeze({ X: 0, 0: "X", Y: 1, 1: "Y", Z: 2, 2: "Z", AngX: 3, 3: "AngX", AngY: 4, 4: "AngY", AngZ: 5, 5: "AngZ" });
const l = Object.freeze({ Revolute: 0, 0: "Revolute", Fixed: 1, 1: "Fixed", Prismatic: 2, 2: "Prismatic", Rope: 3, 3: "Rope", Spring: 4, 4: "Spring", Spherical: 5, 5: "Spherical", Generic: 6, 6: "Generic" });
class H {
  static __wrap(A2) {
    A2 >>>= 0;
    const I2 = Object.create(H.prototype);
    return I2.__wbg_ptr = A2, I2;
  }
  __destroy_into_raw() {
    const A2 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, A2;
  }
  free() {
    const I2 = this.__destroy_into_raw();
    A.__wbg_rawbroadphase_free(I2);
  }
  constructor() {
    const I2 = A.rawbroadphase_new();
    return this.__wbg_ptr = I2 >>> 0, this;
  }
}
class L {
  __destroy_into_raw() {
    const A2 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, A2;
  }
  free() {
    const I2 = this.__destroy_into_raw();
    A.__wbg_rawccdsolver_free(I2);
  }
  constructor() {
    const I2 = A.rawccdsolver_new();
    return this.__wbg_ptr = I2 >>> 0, this;
  }
}
class t {
  __destroy_into_raw() {
    const A2 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, A2;
  }
  free() {
    const I2 = this.__destroy_into_raw();
    A.__wbg_rawcharactercollision_free(I2);
  }
  constructor() {
    const I2 = A.rawcharactercollision_new();
    return this.__wbg_ptr = I2 >>> 0, this;
  }
  handle() {
    return A.rawcharactercollision_handle(this.__wbg_ptr);
  }
  translationDeltaApplied() {
    const I2 = A.rawcharactercollision_translationDeltaApplied(this.__wbg_ptr);
    return DA.__wrap(I2);
  }
  translationDeltaRemaining() {
    const I2 = A.rawcharactercollision_translationDeltaRemaining(this.__wbg_ptr);
    return DA.__wrap(I2);
  }
  toi() {
    return A.rawcharactercollision_toi(this.__wbg_ptr);
  }
  worldWitness1() {
    const I2 = A.rawcharactercollision_worldWitness1(this.__wbg_ptr);
    return DA.__wrap(I2);
  }
  worldWitness2() {
    const I2 = A.rawcharactercollision_worldWitness2(this.__wbg_ptr);
    return DA.__wrap(I2);
  }
  worldNormal1() {
    const I2 = A.rawcharactercollision_worldNormal1(this.__wbg_ptr);
    return DA.__wrap(I2);
  }
  worldNormal2() {
    const I2 = A.rawcharactercollision_worldNormal2(this.__wbg_ptr);
    return DA.__wrap(I2);
  }
}
class p {
  static __wrap(A2) {
    A2 >>>= 0;
    const I2 = Object.create(p.prototype);
    return I2.__wbg_ptr = A2, I2;
  }
  __destroy_into_raw() {
    const A2 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, A2;
  }
  free() {
    const I2 = this.__destroy_into_raw();
    A.__wbg_rawcolliderset_free(I2);
  }
  coTranslation(I2) {
    const g2 = A.rawcolliderset_coTranslation(this.__wbg_ptr, I2);
    return DA.__wrap(g2);
  }
  coRotation(I2) {
    const g2 = A.rawcolliderset_coRotation(this.__wbg_ptr, I2);
    return gA.__wrap(g2);
  }
  coSetTranslation(I2, g2, C2, B2) {
    A.rawcolliderset_coSetTranslation(this.__wbg_ptr, I2, g2, C2, B2);
  }
  coSetTranslationWrtParent(I2, g2, C2, B2) {
    A.rawcolliderset_coSetTranslationWrtParent(this.__wbg_ptr, I2, g2, C2, B2);
  }
  coSetRotation(I2, g2, C2, B2, Q2) {
    A.rawcolliderset_coSetRotation(this.__wbg_ptr, I2, g2, C2, B2, Q2);
  }
  coSetRotationWrtParent(I2, g2, C2, B2, Q2) {
    A.rawcolliderset_coSetRotationWrtParent(this.__wbg_ptr, I2, g2, C2, B2, Q2);
  }
  coIsSensor(I2) {
    return 0 !== A.rawcolliderset_coIsSensor(this.__wbg_ptr, I2);
  }
  coShapeType(I2) {
    return A.rawcolliderset_coShapeType(this.__wbg_ptr, I2);
  }
  coHalfspaceNormal(I2) {
    const g2 = A.rawcolliderset_coHalfspaceNormal(this.__wbg_ptr, I2);
    return 0 === g2 ? void 0 : DA.__wrap(g2);
  }
  coHalfExtents(I2) {
    const g2 = A.rawcolliderset_coHalfExtents(this.__wbg_ptr, I2);
    return 0 === g2 ? void 0 : DA.__wrap(g2);
  }
  coSetHalfExtents(I2, g2) {
    U(g2, DA), A.rawcolliderset_coSetHalfExtents(this.__wbg_ptr, I2, g2.__wbg_ptr);
  }
  coRadius(I2) {
    try {
      const B2 = A.__wbindgen_add_to_stack_pointer(-16);
      A.rawcolliderset_coRadius(B2, this.__wbg_ptr, I2);
      var g2 = G()[B2 / 4 + 0], C2 = K()[B2 / 4 + 1];
      return 0 === g2 ? void 0 : C2;
    } finally {
      A.__wbindgen_add_to_stack_pointer(16);
    }
  }
  coSetRadius(I2, g2) {
    A.rawcolliderset_coSetRadius(this.__wbg_ptr, I2, g2);
  }
  coHalfHeight(I2) {
    try {
      const B2 = A.__wbindgen_add_to_stack_pointer(-16);
      A.rawcolliderset_coHalfHeight(B2, this.__wbg_ptr, I2);
      var g2 = G()[B2 / 4 + 0], C2 = K()[B2 / 4 + 1];
      return 0 === g2 ? void 0 : C2;
    } finally {
      A.__wbindgen_add_to_stack_pointer(16);
    }
  }
  coSetHalfHeight(I2, g2) {
    A.rawcolliderset_coSetHalfHeight(this.__wbg_ptr, I2, g2);
  }
  coRoundRadius(I2) {
    try {
      const B2 = A.__wbindgen_add_to_stack_pointer(-16);
      A.rawcolliderset_coRoundRadius(B2, this.__wbg_ptr, I2);
      var g2 = G()[B2 / 4 + 0], C2 = K()[B2 / 4 + 1];
      return 0 === g2 ? void 0 : C2;
    } finally {
      A.__wbindgen_add_to_stack_pointer(16);
    }
  }
  coSetRoundRadius(I2, g2) {
    A.rawcolliderset_coSetRoundRadius(this.__wbg_ptr, I2, g2);
  }
  coVertices(I2) {
    try {
      const B2 = A.__wbindgen_add_to_stack_pointer(-16);
      A.rawcolliderset_coVertices(B2, this.__wbg_ptr, I2);
      var g2 = G()[B2 / 4 + 0], C2 = G()[B2 / 4 + 1];
      let Q2;
      return 0 !== g2 && (Q2 = y(g2, C2).slice(), A.__wbindgen_free(g2, 4 * C2, 4)), Q2;
    } finally {
      A.__wbindgen_add_to_stack_pointer(16);
    }
  }
  coIndices(I2) {
    try {
      const B2 = A.__wbindgen_add_to_stack_pointer(-16);
      A.rawcolliderset_coIndices(B2, this.__wbg_ptr, I2);
      var g2 = G()[B2 / 4 + 0], C2 = G()[B2 / 4 + 1];
      let Q2;
      return 0 !== g2 && (Q2 = function(A2, I3) {
        return A2 >>>= 0, N().subarray(A2 / 4, A2 / 4 + I3);
      }(g2, C2).slice(), A.__wbindgen_free(g2, 4 * C2, 4)), Q2;
    } finally {
      A.__wbindgen_add_to_stack_pointer(16);
    }
  }
  coTriMeshFlags(I2) {
    try {
      const B2 = A.__wbindgen_add_to_stack_pointer(-16);
      A.rawcolliderset_coTriMeshFlags(B2, this.__wbg_ptr, I2);
      var g2 = G()[B2 / 4 + 0], C2 = G()[B2 / 4 + 1];
      return 0 === g2 ? void 0 : C2 >>> 0;
    } finally {
      A.__wbindgen_add_to_stack_pointer(16);
    }
  }
  coHeightFieldFlags(I2) {
    try {
      const B2 = A.__wbindgen_add_to_stack_pointer(-16);
      A.rawcolliderset_coHeightFieldFlags(B2, this.__wbg_ptr, I2);
      var g2 = G()[B2 / 4 + 0], C2 = G()[B2 / 4 + 1];
      return 0 === g2 ? void 0 : C2 >>> 0;
    } finally {
      A.__wbindgen_add_to_stack_pointer(16);
    }
  }
  coHeightfieldHeights(I2) {
    try {
      const B2 = A.__wbindgen_add_to_stack_pointer(-16);
      A.rawcolliderset_coHeightfieldHeights(B2, this.__wbg_ptr, I2);
      var g2 = G()[B2 / 4 + 0], C2 = G()[B2 / 4 + 1];
      let Q2;
      return 0 !== g2 && (Q2 = y(g2, C2).slice(), A.__wbindgen_free(g2, 4 * C2, 4)), Q2;
    } finally {
      A.__wbindgen_add_to_stack_pointer(16);
    }
  }
  coHeightfieldScale(I2) {
    const g2 = A.rawcolliderset_coHeightfieldScale(this.__wbg_ptr, I2);
    return 0 === g2 ? void 0 : DA.__wrap(g2);
  }
  coHeightfieldNRows(I2) {
    try {
      const B2 = A.__wbindgen_add_to_stack_pointer(-16);
      A.rawcolliderset_coHeightfieldNRows(B2, this.__wbg_ptr, I2);
      var g2 = G()[B2 / 4 + 0], C2 = G()[B2 / 4 + 1];
      return 0 === g2 ? void 0 : C2 >>> 0;
    } finally {
      A.__wbindgen_add_to_stack_pointer(16);
    }
  }
  coHeightfieldNCols(I2) {
    try {
      const B2 = A.__wbindgen_add_to_stack_pointer(-16);
      A.rawcolliderset_coHeightfieldNCols(B2, this.__wbg_ptr, I2);
      var g2 = G()[B2 / 4 + 0], C2 = G()[B2 / 4 + 1];
      return 0 === g2 ? void 0 : C2 >>> 0;
    } finally {
      A.__wbindgen_add_to_stack_pointer(16);
    }
  }
  coParent(I2) {
    try {
      const B2 = A.__wbindgen_add_to_stack_pointer(-16);
      A.rawcolliderset_coParent(B2, this.__wbg_ptr, I2);
      var g2 = G()[B2 / 4 + 0], C2 = D()[B2 / 8 + 1];
      return 0 === g2 ? void 0 : C2;
    } finally {
      A.__wbindgen_add_to_stack_pointer(16);
    }
  }
  coSetEnabled(I2, g2) {
    A.rawcolliderset_coSetEnabled(this.__wbg_ptr, I2, g2);
  }
  coIsEnabled(I2) {
    return 0 !== A.rawcolliderset_coIsEnabled(this.__wbg_ptr, I2);
  }
  coSetContactSkin(I2, g2) {
    A.rawcolliderset_coSetContactSkin(this.__wbg_ptr, I2, g2);
  }
  coContactSkin(I2) {
    return A.rawcolliderset_coContactSkin(this.__wbg_ptr, I2);
  }
  coFriction(I2) {
    return A.rawcolliderset_coFriction(this.__wbg_ptr, I2);
  }
  coRestitution(I2) {
    return A.rawcolliderset_coRestitution(this.__wbg_ptr, I2);
  }
  coDensity(I2) {
    return A.rawcolliderset_coDensity(this.__wbg_ptr, I2);
  }
  coMass(I2) {
    return A.rawcolliderset_coMass(this.__wbg_ptr, I2);
  }
  coVolume(I2) {
    return A.rawcolliderset_coVolume(this.__wbg_ptr, I2);
  }
  coCollisionGroups(I2) {
    return A.rawcolliderset_coCollisionGroups(this.__wbg_ptr, I2) >>> 0;
  }
  coSolverGroups(I2) {
    return A.rawcolliderset_coSolverGroups(this.__wbg_ptr, I2) >>> 0;
  }
  coActiveHooks(I2) {
    return A.rawcolliderset_coActiveHooks(this.__wbg_ptr, I2) >>> 0;
  }
  coActiveCollisionTypes(I2) {
    return A.rawcolliderset_coActiveCollisionTypes(this.__wbg_ptr, I2);
  }
  coActiveEvents(I2) {
    return A.rawcolliderset_coActiveEvents(this.__wbg_ptr, I2) >>> 0;
  }
  coContactForceEventThreshold(I2) {
    return A.rawcolliderset_coContactForceEventThreshold(this.__wbg_ptr, I2);
  }
  coContainsPoint(I2, g2) {
    U(g2, DA);
    return 0 !== A.rawcolliderset_coContainsPoint(this.__wbg_ptr, I2, g2.__wbg_ptr);
  }
  coCastShape(I2, g2, C2, B2, Q2, E2, i2, D2, o2) {
    U(g2, DA), U(C2, QA), U(B2, DA), U(Q2, gA), U(E2, DA);
    const G2 = A.rawcolliderset_coCastShape(this.__wbg_ptr, I2, g2.__wbg_ptr, C2.__wbg_ptr, B2.__wbg_ptr, Q2.__wbg_ptr, E2.__wbg_ptr, i2, D2, o2);
    return 0 === G2 ? void 0 : EA.__wrap(G2);
  }
  coCastCollider(I2, g2, C2, B2, Q2, E2, i2) {
    U(g2, DA), U(B2, DA);
    const D2 = A.rawcolliderset_coCastCollider(this.__wbg_ptr, I2, g2.__wbg_ptr, C2, B2.__wbg_ptr, Q2, E2, i2);
    return 0 === D2 ? void 0 : e.__wrap(D2);
  }
  coIntersectsShape(I2, g2, C2, B2) {
    U(g2, QA), U(C2, DA), U(B2, gA);
    return 0 !== A.rawcolliderset_coIntersectsShape(this.__wbg_ptr, I2, g2.__wbg_ptr, C2.__wbg_ptr, B2.__wbg_ptr);
  }
  coContactShape(I2, g2, C2, B2, Q2) {
    U(g2, QA), U(C2, DA), U(B2, gA);
    const E2 = A.rawcolliderset_coContactShape(this.__wbg_ptr, I2, g2.__wbg_ptr, C2.__wbg_ptr, B2.__wbg_ptr, Q2);
    return 0 === E2 ? void 0 : iA.__wrap(E2);
  }
  coContactCollider(I2, g2, C2) {
    const B2 = A.rawcolliderset_coContactCollider(this.__wbg_ptr, I2, g2, C2);
    return 0 === B2 ? void 0 : iA.__wrap(B2);
  }
  coProjectPoint(I2, g2, C2) {
    U(g2, DA);
    const B2 = A.rawcolliderset_coProjectPoint(this.__wbg_ptr, I2, g2.__wbg_ptr, C2);
    return z.__wrap(B2);
  }
  coIntersectsRay(I2, g2, C2, B2) {
    U(g2, DA), U(C2, DA);
    return 0 !== A.rawcolliderset_coIntersectsRay(this.__wbg_ptr, I2, g2.__wbg_ptr, C2.__wbg_ptr, B2);
  }
  coCastRay(I2, g2, C2, B2, Q2) {
    U(g2, DA), U(C2, DA);
    return A.rawcolliderset_coCastRay(this.__wbg_ptr, I2, g2.__wbg_ptr, C2.__wbg_ptr, B2, Q2);
  }
  coCastRayAndGetNormal(I2, g2, C2, B2, Q2) {
    U(g2, DA), U(C2, DA);
    const E2 = A.rawcolliderset_coCastRayAndGetNormal(this.__wbg_ptr, I2, g2.__wbg_ptr, C2.__wbg_ptr, B2, Q2);
    return 0 === E2 ? void 0 : AA.__wrap(E2);
  }
  coSetSensor(I2, g2) {
    A.rawcolliderset_coSetSensor(this.__wbg_ptr, I2, g2);
  }
  coSetRestitution(I2, g2) {
    A.rawcolliderset_coSetRestitution(this.__wbg_ptr, I2, g2);
  }
  coSetFriction(I2, g2) {
    A.rawcolliderset_coSetFriction(this.__wbg_ptr, I2, g2);
  }
  coFrictionCombineRule(I2) {
    return A.rawcolliderset_coFrictionCombineRule(this.__wbg_ptr, I2) >>> 0;
  }
  coSetFrictionCombineRule(I2, g2) {
    A.rawcolliderset_coSetFrictionCombineRule(this.__wbg_ptr, I2, g2);
  }
  coRestitutionCombineRule(I2) {
    return A.rawcolliderset_coRestitutionCombineRule(this.__wbg_ptr, I2) >>> 0;
  }
  coSetRestitutionCombineRule(I2, g2) {
    A.rawcolliderset_coSetRestitutionCombineRule(this.__wbg_ptr, I2, g2);
  }
  coSetCollisionGroups(I2, g2) {
    A.rawcolliderset_coSetCollisionGroups(this.__wbg_ptr, I2, g2);
  }
  coSetSolverGroups(I2, g2) {
    A.rawcolliderset_coSetSolverGroups(this.__wbg_ptr, I2, g2);
  }
  coSetActiveHooks(I2, g2) {
    A.rawcolliderset_coSetActiveHooks(this.__wbg_ptr, I2, g2);
  }
  coSetActiveEvents(I2, g2) {
    A.rawcolliderset_coSetActiveEvents(this.__wbg_ptr, I2, g2);
  }
  coSetActiveCollisionTypes(I2, g2) {
    A.rawcolliderset_coSetActiveCollisionTypes(this.__wbg_ptr, I2, g2);
  }
  coSetShape(I2, g2) {
    U(g2, QA), A.rawcolliderset_coSetShape(this.__wbg_ptr, I2, g2.__wbg_ptr);
  }
  coSetContactForceEventThreshold(I2, g2) {
    A.rawcolliderset_coSetContactForceEventThreshold(this.__wbg_ptr, I2, g2);
  }
  coSetDensity(I2, g2) {
    A.rawcolliderset_coSetDensity(this.__wbg_ptr, I2, g2);
  }
  coSetMass(I2, g2) {
    A.rawcolliderset_coSetMass(this.__wbg_ptr, I2, g2);
  }
  coSetMassProperties(I2, g2, C2, B2, Q2) {
    U(C2, DA), U(B2, DA), U(Q2, gA), A.rawcolliderset_coSetMassProperties(this.__wbg_ptr, I2, g2, C2.__wbg_ptr, B2.__wbg_ptr, Q2.__wbg_ptr);
  }
  constructor() {
    const I2 = A.rawcolliderset_new();
    return this.__wbg_ptr = I2 >>> 0, this;
  }
  len() {
    return A.rawcolliderset_len(this.__wbg_ptr) >>> 0;
  }
  contains(I2) {
    return 0 !== A.rawcolliderset_contains(this.__wbg_ptr, I2);
  }
  createCollider(I2, g2, C2, B2, Q2, E2, i2, o2, w2, S2, k2, a2, K2, h2, J2, y2, M2, N2, F2, R2, q2, s2, c2, Y2, l2) {
    try {
      const t2 = A.__wbindgen_add_to_stack_pointer(-16);
      U(g2, QA), U(C2, DA), U(B2, gA), U(i2, DA), U(o2, DA), U(w2, gA), U(l2, IA), A.rawcolliderset_createCollider(t2, this.__wbg_ptr, I2, g2.__wbg_ptr, C2.__wbg_ptr, B2.__wbg_ptr, Q2, E2, i2.__wbg_ptr, o2.__wbg_ptr, w2.__wbg_ptr, S2, k2, a2, K2, h2, J2, y2, M2, N2, F2, R2, q2, s2, c2, Y2, l2.__wbg_ptr);
      var H2 = G()[t2 / 4 + 0], L2 = D()[t2 / 8 + 1];
      return 0 === H2 ? void 0 : L2;
    } finally {
      A.__wbindgen_add_to_stack_pointer(16);
    }
  }
  remove(I2, g2, C2, B2) {
    U(g2, m), U(C2, IA), A.rawcolliderset_remove(this.__wbg_ptr, I2, g2.__wbg_ptr, C2.__wbg_ptr, B2);
  }
  isHandleValid(I2) {
    return 0 !== A.rawcolliderset_contains(this.__wbg_ptr, I2);
  }
  forEachColliderHandle(g2) {
    try {
      A.rawcolliderset_forEachColliderHandle(this.__wbg_ptr, J(g2));
    } finally {
      I[h++] = void 0;
    }
  }
}
class e {
  static __wrap(A2) {
    A2 >>>= 0;
    const I2 = Object.create(e.prototype);
    return I2.__wbg_ptr = A2, I2;
  }
  __destroy_into_raw() {
    const A2 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, A2;
  }
  free() {
    const I2 = this.__destroy_into_raw();
    A.__wbg_rawcollidershapecasthit_free(I2);
  }
  colliderHandle() {
    return A.rawcharactercollision_handle(this.__wbg_ptr);
  }
  time_of_impact() {
    return A.rawcollidershapecasthit_time_of_impact(this.__wbg_ptr);
  }
  witness1() {
    const I2 = A.rawcollidershapecasthit_witness1(this.__wbg_ptr);
    return DA.__wrap(I2);
  }
  witness2() {
    const I2 = A.rawcollidershapecasthit_witness2(this.__wbg_ptr);
    return DA.__wrap(I2);
  }
  normal1() {
    const I2 = A.rawcharactercollision_translationDeltaApplied(this.__wbg_ptr);
    return DA.__wrap(I2);
  }
  normal2() {
    const I2 = A.rawcharactercollision_translationDeltaRemaining(this.__wbg_ptr);
    return DA.__wrap(I2);
  }
}
class r {
  static __wrap(A2) {
    A2 >>>= 0;
    const I2 = Object.create(r.prototype);
    return I2.__wbg_ptr = A2, I2;
  }
  __destroy_into_raw() {
    const A2 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, A2;
  }
  free() {
    const I2 = this.__destroy_into_raw();
    A.__wbg_rawcontactforceevent_free(I2);
  }
  collider1() {
    return A.rawcharactercollision_handle(this.__wbg_ptr);
  }
  collider2() {
    return A.rawcontactforceevent_collider2(this.__wbg_ptr);
  }
  total_force() {
    const I2 = A.rawcontactforceevent_total_force(this.__wbg_ptr);
    return DA.__wrap(I2);
  }
  total_force_magnitude() {
    return A.rawcontactforceevent_total_force_magnitude(this.__wbg_ptr);
  }
  max_force_direction() {
    const I2 = A.rawcontactforceevent_max_force_direction(this.__wbg_ptr);
    return DA.__wrap(I2);
  }
  max_force_magnitude() {
    return A.rawcontactforceevent_max_force_magnitude(this.__wbg_ptr);
  }
}
class d {
  static __wrap(A2) {
    A2 >>>= 0;
    const I2 = Object.create(d.prototype);
    return I2.__wbg_ptr = A2, I2;
  }
  __destroy_into_raw() {
    const A2 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, A2;
  }
  free() {
    const I2 = this.__destroy_into_raw();
    A.__wbg_rawcontactmanifold_free(I2);
  }
  normal() {
    const I2 = A.rawcontactmanifold_normal(this.__wbg_ptr);
    return DA.__wrap(I2);
  }
  local_n1() {
    const I2 = A.rawcontactmanifold_local_n1(this.__wbg_ptr);
    return DA.__wrap(I2);
  }
  local_n2() {
    const I2 = A.rawcontactmanifold_local_n2(this.__wbg_ptr);
    return DA.__wrap(I2);
  }
  subshape1() {
    return A.rawcontactmanifold_subshape1(this.__wbg_ptr) >>> 0;
  }
  subshape2() {
    return A.rawcontactmanifold_subshape2(this.__wbg_ptr) >>> 0;
  }
  num_contacts() {
    return A.rawcontactmanifold_num_contacts(this.__wbg_ptr) >>> 0;
  }
  contact_local_p1(I2) {
    const g2 = A.rawcontactmanifold_contact_local_p1(this.__wbg_ptr, I2);
    return 0 === g2 ? void 0 : DA.__wrap(g2);
  }
  contact_local_p2(I2) {
    const g2 = A.rawcontactmanifold_contact_local_p2(this.__wbg_ptr, I2);
    return 0 === g2 ? void 0 : DA.__wrap(g2);
  }
  contact_dist(I2) {
    return A.rawcontactmanifold_contact_dist(this.__wbg_ptr, I2);
  }
  contact_fid1(I2) {
    return A.rawcontactmanifold_contact_fid1(this.__wbg_ptr, I2) >>> 0;
  }
  contact_fid2(I2) {
    return A.rawcontactmanifold_contact_fid2(this.__wbg_ptr, I2) >>> 0;
  }
  contact_impulse(I2) {
    return A.rawcontactmanifold_contact_impulse(this.__wbg_ptr, I2);
  }
  contact_tangent_impulse_x(I2) {
    return A.rawcontactmanifold_contact_tangent_impulse_x(this.__wbg_ptr, I2);
  }
  contact_tangent_impulse_y(I2) {
    return A.rawcontactmanifold_contact_tangent_impulse_y(this.__wbg_ptr, I2);
  }
  num_solver_contacts() {
    return A.rawcontactmanifold_num_solver_contacts(this.__wbg_ptr) >>> 0;
  }
  solver_contact_point(I2) {
    const g2 = A.rawcontactmanifold_solver_contact_point(this.__wbg_ptr, I2);
    return 0 === g2 ? void 0 : DA.__wrap(g2);
  }
  solver_contact_dist(I2) {
    return A.rawcontactmanifold_solver_contact_dist(this.__wbg_ptr, I2);
  }
  solver_contact_friction(I2) {
    return A.rawcontactmanifold_solver_contact_friction(this.__wbg_ptr, I2);
  }
  solver_contact_restitution(I2) {
    return A.rawcontactmanifold_solver_contact_restitution(this.__wbg_ptr, I2);
  }
  solver_contact_tangent_velocity(I2) {
    const g2 = A.rawcontactmanifold_solver_contact_tangent_velocity(this.__wbg_ptr, I2);
    return DA.__wrap(g2);
  }
}
class T {
  static __wrap(A2) {
    A2 >>>= 0;
    const I2 = Object.create(T.prototype);
    return I2.__wbg_ptr = A2, I2;
  }
  __destroy_into_raw() {
    const A2 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, A2;
  }
  free() {
    const I2 = this.__destroy_into_raw();
    A.__wbg_rawcontactpair_free(I2);
  }
  collider1() {
    return A.rawcontactpair_collider1(this.__wbg_ptr);
  }
  collider2() {
    return A.rawcontactpair_collider2(this.__wbg_ptr);
  }
  numContactManifolds() {
    return A.rawcontactpair_numContactManifolds(this.__wbg_ptr) >>> 0;
  }
  contactManifold(I2) {
    const g2 = A.rawcontactpair_contactManifold(this.__wbg_ptr, I2);
    return 0 === g2 ? void 0 : d.__wrap(g2);
  }
}
class O {
  __destroy_into_raw() {
    const A2 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, A2;
  }
  free() {
    const I2 = this.__destroy_into_raw();
    A.__wbg_rawdebugrenderpipeline_free(I2);
  }
  constructor() {
    const I2 = A.rawdebugrenderpipeline_new();
    return this.__wbg_ptr = I2 >>> 0, this;
  }
  vertices() {
    return Q(A.rawdebugrenderpipeline_vertices(this.__wbg_ptr));
  }
  colors() {
    return Q(A.rawdebugrenderpipeline_colors(this.__wbg_ptr));
  }
  render(I2, g2, C2, B2, Q2) {
    U(I2, IA), U(g2, p), U(C2, W), U(B2, V), U(Q2, X), A.rawdebugrenderpipeline_render(this.__wbg_ptr, I2.__wbg_ptr, g2.__wbg_ptr, C2.__wbg_ptr, B2.__wbg_ptr, Q2.__wbg_ptr);
  }
}
class n {
  static __wrap(A2) {
    A2 >>>= 0;
    const I2 = Object.create(n.prototype);
    return I2.__wbg_ptr = A2, I2;
  }
  __destroy_into_raw() {
    const A2 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, A2;
  }
  free() {
    const I2 = this.__destroy_into_raw();
    A.__wbg_rawdeserializedworld_free(I2);
  }
  takeGravity() {
    const I2 = A.rawdeserializedworld_takeGravity(this.__wbg_ptr);
    return 0 === I2 ? void 0 : DA.__wrap(I2);
  }
  takeIntegrationParameters() {
    const I2 = A.rawdeserializedworld_takeIntegrationParameters(this.__wbg_ptr);
    return 0 === I2 ? void 0 : j.__wrap(I2);
  }
  takeIslandManager() {
    const I2 = A.rawdeserializedworld_takeIslandManager(this.__wbg_ptr);
    return 0 === I2 ? void 0 : m.__wrap(I2);
  }
  takeBroadPhase() {
    const I2 = A.rawdeserializedworld_takeBroadPhase(this.__wbg_ptr);
    return 0 === I2 ? void 0 : H.__wrap(I2);
  }
  takeNarrowPhase() {
    const I2 = A.rawdeserializedworld_takeNarrowPhase(this.__wbg_ptr);
    return 0 === I2 ? void 0 : X.__wrap(I2);
  }
  takeBodies() {
    const I2 = A.rawdeserializedworld_takeBodies(this.__wbg_ptr);
    return 0 === I2 ? void 0 : IA.__wrap(I2);
  }
  takeColliders() {
    const I2 = A.rawdeserializedworld_takeColliders(this.__wbg_ptr);
    return 0 === I2 ? void 0 : p.__wrap(I2);
  }
  takeImpulseJoints() {
    const I2 = A.rawdeserializedworld_takeImpulseJoints(this.__wbg_ptr);
    return 0 === I2 ? void 0 : W.__wrap(I2);
  }
  takeMultibodyJoints() {
    const I2 = A.rawdeserializedworld_takeMultibodyJoints(this.__wbg_ptr);
    return 0 === I2 ? void 0 : V.__wrap(I2);
  }
}
class Z {
  __destroy_into_raw() {
    const A2 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, A2;
  }
  free() {
    const I2 = this.__destroy_into_raw();
    A.__wbg_rawdynamicraycastvehiclecontroller_free(I2);
  }
  constructor(I2) {
    const g2 = A.rawdynamicraycastvehiclecontroller_new(I2);
    return this.__wbg_ptr = g2 >>> 0, this;
  }
  current_vehicle_speed() {
    return A.rawdynamicraycastvehiclecontroller_current_vehicle_speed(this.__wbg_ptr);
  }
  chassis() {
    return A.rawdynamicraycastvehiclecontroller_chassis(this.__wbg_ptr);
  }
  index_up_axis() {
    return A.rawdynamicraycastvehiclecontroller_index_up_axis(this.__wbg_ptr) >>> 0;
  }
  set_index_up_axis(I2) {
    A.rawdynamicraycastvehiclecontroller_set_index_up_axis(this.__wbg_ptr, I2);
  }
  index_forward_axis() {
    return A.rawdynamicraycastvehiclecontroller_index_forward_axis(this.__wbg_ptr) >>> 0;
  }
  set_index_forward_axis(I2) {
    A.rawdynamicraycastvehiclecontroller_set_index_forward_axis(this.__wbg_ptr, I2);
  }
  add_wheel(I2, g2, C2, B2, Q2) {
    U(I2, DA), U(g2, DA), U(C2, DA), A.rawdynamicraycastvehiclecontroller_add_wheel(this.__wbg_ptr, I2.__wbg_ptr, g2.__wbg_ptr, C2.__wbg_ptr, B2, Q2);
  }
  num_wheels() {
    return A.rawdynamicraycastvehiclecontroller_num_wheels(this.__wbg_ptr) >>> 0;
  }
  update_vehicle(g2, C2, B2, Q2, i2, D2, o2) {
    try {
      U(C2, IA), U(B2, p), U(Q2, v), A.rawdynamicraycastvehiclecontroller_update_vehicle(this.__wbg_ptr, g2, C2.__wbg_ptr, B2.__wbg_ptr, Q2.__wbg_ptr, i2, !E(D2), E(D2) ? 0 : D2, J(o2));
    } finally {
      I[h++] = void 0;
    }
  }
  wheel_chassis_connection_point_cs(I2) {
    const g2 = A.rawdynamicraycastvehiclecontroller_wheel_chassis_connection_point_cs(this.__wbg_ptr, I2);
    return 0 === g2 ? void 0 : DA.__wrap(g2);
  }
  set_wheel_chassis_connection_point_cs(I2, g2) {
    U(g2, DA), A.rawdynamicraycastvehiclecontroller_set_wheel_chassis_connection_point_cs(this.__wbg_ptr, I2, g2.__wbg_ptr);
  }
  wheel_suspension_rest_length(I2) {
    try {
      const B2 = A.__wbindgen_add_to_stack_pointer(-16);
      A.rawdynamicraycastvehiclecontroller_wheel_suspension_rest_length(B2, this.__wbg_ptr, I2);
      var g2 = G()[B2 / 4 + 0], C2 = K()[B2 / 4 + 1];
      return 0 === g2 ? void 0 : C2;
    } finally {
      A.__wbindgen_add_to_stack_pointer(16);
    }
  }
  set_wheel_suspension_rest_length(I2, g2) {
    A.rawdynamicraycastvehiclecontroller_set_wheel_suspension_rest_length(this.__wbg_ptr, I2, g2);
  }
  wheel_max_suspension_travel(I2) {
    try {
      const B2 = A.__wbindgen_add_to_stack_pointer(-16);
      A.rawdynamicraycastvehiclecontroller_wheel_max_suspension_travel(B2, this.__wbg_ptr, I2);
      var g2 = G()[B2 / 4 + 0], C2 = K()[B2 / 4 + 1];
      return 0 === g2 ? void 0 : C2;
    } finally {
      A.__wbindgen_add_to_stack_pointer(16);
    }
  }
  set_wheel_max_suspension_travel(I2, g2) {
    A.rawdynamicraycastvehiclecontroller_set_wheel_max_suspension_travel(this.__wbg_ptr, I2, g2);
  }
  wheel_radius(I2) {
    try {
      const B2 = A.__wbindgen_add_to_stack_pointer(-16);
      A.rawdynamicraycastvehiclecontroller_wheel_radius(B2, this.__wbg_ptr, I2);
      var g2 = G()[B2 / 4 + 0], C2 = K()[B2 / 4 + 1];
      return 0 === g2 ? void 0 : C2;
    } finally {
      A.__wbindgen_add_to_stack_pointer(16);
    }
  }
  set_wheel_radius(I2, g2) {
    A.rawdynamicraycastvehiclecontroller_set_wheel_radius(this.__wbg_ptr, I2, g2);
  }
  wheel_suspension_stiffness(I2) {
    try {
      const B2 = A.__wbindgen_add_to_stack_pointer(-16);
      A.rawdynamicraycastvehiclecontroller_wheel_suspension_stiffness(B2, this.__wbg_ptr, I2);
      var g2 = G()[B2 / 4 + 0], C2 = K()[B2 / 4 + 1];
      return 0 === g2 ? void 0 : C2;
    } finally {
      A.__wbindgen_add_to_stack_pointer(16);
    }
  }
  set_wheel_suspension_stiffness(I2, g2) {
    A.rawdynamicraycastvehiclecontroller_set_wheel_suspension_stiffness(this.__wbg_ptr, I2, g2);
  }
  wheel_suspension_compression(I2) {
    try {
      const B2 = A.__wbindgen_add_to_stack_pointer(-16);
      A.rawdynamicraycastvehiclecontroller_wheel_suspension_compression(B2, this.__wbg_ptr, I2);
      var g2 = G()[B2 / 4 + 0], C2 = K()[B2 / 4 + 1];
      return 0 === g2 ? void 0 : C2;
    } finally {
      A.__wbindgen_add_to_stack_pointer(16);
    }
  }
  set_wheel_suspension_compression(I2, g2) {
    A.rawdynamicraycastvehiclecontroller_set_wheel_suspension_compression(this.__wbg_ptr, I2, g2);
  }
  wheel_suspension_relaxation(I2) {
    try {
      const B2 = A.__wbindgen_add_to_stack_pointer(-16);
      A.rawdynamicraycastvehiclecontroller_wheel_suspension_relaxation(B2, this.__wbg_ptr, I2);
      var g2 = G()[B2 / 4 + 0], C2 = K()[B2 / 4 + 1];
      return 0 === g2 ? void 0 : C2;
    } finally {
      A.__wbindgen_add_to_stack_pointer(16);
    }
  }
  set_wheel_suspension_relaxation(I2, g2) {
    A.rawdynamicraycastvehiclecontroller_set_wheel_suspension_relaxation(this.__wbg_ptr, I2, g2);
  }
  wheel_max_suspension_force(I2) {
    try {
      const B2 = A.__wbindgen_add_to_stack_pointer(-16);
      A.rawdynamicraycastvehiclecontroller_wheel_max_suspension_force(B2, this.__wbg_ptr, I2);
      var g2 = G()[B2 / 4 + 0], C2 = K()[B2 / 4 + 1];
      return 0 === g2 ? void 0 : C2;
    } finally {
      A.__wbindgen_add_to_stack_pointer(16);
    }
  }
  set_wheel_max_suspension_force(I2, g2) {
    A.rawdynamicraycastvehiclecontroller_set_wheel_max_suspension_force(this.__wbg_ptr, I2, g2);
  }
  wheel_brake(I2) {
    try {
      const B2 = A.__wbindgen_add_to_stack_pointer(-16);
      A.rawdynamicraycastvehiclecontroller_wheel_brake(B2, this.__wbg_ptr, I2);
      var g2 = G()[B2 / 4 + 0], C2 = K()[B2 / 4 + 1];
      return 0 === g2 ? void 0 : C2;
    } finally {
      A.__wbindgen_add_to_stack_pointer(16);
    }
  }
  set_wheel_brake(I2, g2) {
    A.rawdynamicraycastvehiclecontroller_set_wheel_brake(this.__wbg_ptr, I2, g2);
  }
  wheel_steering(I2) {
    try {
      const B2 = A.__wbindgen_add_to_stack_pointer(-16);
      A.rawdynamicraycastvehiclecontroller_wheel_steering(B2, this.__wbg_ptr, I2);
      var g2 = G()[B2 / 4 + 0], C2 = K()[B2 / 4 + 1];
      return 0 === g2 ? void 0 : C2;
    } finally {
      A.__wbindgen_add_to_stack_pointer(16);
    }
  }
  set_wheel_steering(I2, g2) {
    A.rawdynamicraycastvehiclecontroller_set_wheel_steering(this.__wbg_ptr, I2, g2);
  }
  wheel_engine_force(I2) {
    try {
      const B2 = A.__wbindgen_add_to_stack_pointer(-16);
      A.rawdynamicraycastvehiclecontroller_wheel_engine_force(B2, this.__wbg_ptr, I2);
      var g2 = G()[B2 / 4 + 0], C2 = K()[B2 / 4 + 1];
      return 0 === g2 ? void 0 : C2;
    } finally {
      A.__wbindgen_add_to_stack_pointer(16);
    }
  }
  set_wheel_engine_force(I2, g2) {
    A.rawdynamicraycastvehiclecontroller_set_wheel_engine_force(this.__wbg_ptr, I2, g2);
  }
  wheel_direction_cs(I2) {
    const g2 = A.rawdynamicraycastvehiclecontroller_wheel_direction_cs(this.__wbg_ptr, I2);
    return 0 === g2 ? void 0 : DA.__wrap(g2);
  }
  set_wheel_direction_cs(I2, g2) {
    U(g2, DA), A.rawdynamicraycastvehiclecontroller_set_wheel_direction_cs(this.__wbg_ptr, I2, g2.__wbg_ptr);
  }
  wheel_axle_cs(I2) {
    const g2 = A.rawdynamicraycastvehiclecontroller_wheel_axle_cs(this.__wbg_ptr, I2);
    return 0 === g2 ? void 0 : DA.__wrap(g2);
  }
  set_wheel_axle_cs(I2, g2) {
    U(g2, DA), A.rawdynamicraycastvehiclecontroller_set_wheel_axle_cs(this.__wbg_ptr, I2, g2.__wbg_ptr);
  }
  wheel_friction_slip(I2) {
    try {
      const B2 = A.__wbindgen_add_to_stack_pointer(-16);
      A.rawdynamicraycastvehiclecontroller_wheel_friction_slip(B2, this.__wbg_ptr, I2);
      var g2 = G()[B2 / 4 + 0], C2 = K()[B2 / 4 + 1];
      return 0 === g2 ? void 0 : C2;
    } finally {
      A.__wbindgen_add_to_stack_pointer(16);
    }
  }
  set_wheel_friction_slip(I2, g2) {
    A.rawdynamicraycastvehiclecontroller_set_wheel_friction_slip(this.__wbg_ptr, I2, g2);
  }
  wheel_side_friction_stiffness(I2) {
    try {
      const B2 = A.__wbindgen_add_to_stack_pointer(-16);
      A.rawdynamicraycastvehiclecontroller_wheel_side_friction_stiffness(B2, this.__wbg_ptr, I2);
      var g2 = G()[B2 / 4 + 0], C2 = K()[B2 / 4 + 1];
      return 0 === g2 ? void 0 : C2;
    } finally {
      A.__wbindgen_add_to_stack_pointer(16);
    }
  }
  set_wheel_side_friction_stiffness(I2, g2) {
    A.rawdynamicraycastvehiclecontroller_set_wheel_side_friction_stiffness(this.__wbg_ptr, I2, g2);
  }
  wheel_rotation(I2) {
    try {
      const B2 = A.__wbindgen_add_to_stack_pointer(-16);
      A.rawdynamicraycastvehiclecontroller_wheel_rotation(B2, this.__wbg_ptr, I2);
      var g2 = G()[B2 / 4 + 0], C2 = K()[B2 / 4 + 1];
      return 0 === g2 ? void 0 : C2;
    } finally {
      A.__wbindgen_add_to_stack_pointer(16);
    }
  }
  wheel_forward_impulse(I2) {
    try {
      const B2 = A.__wbindgen_add_to_stack_pointer(-16);
      A.rawdynamicraycastvehiclecontroller_wheel_forward_impulse(B2, this.__wbg_ptr, I2);
      var g2 = G()[B2 / 4 + 0], C2 = K()[B2 / 4 + 1];
      return 0 === g2 ? void 0 : C2;
    } finally {
      A.__wbindgen_add_to_stack_pointer(16);
    }
  }
  wheel_side_impulse(I2) {
    try {
      const B2 = A.__wbindgen_add_to_stack_pointer(-16);
      A.rawdynamicraycastvehiclecontroller_wheel_side_impulse(B2, this.__wbg_ptr, I2);
      var g2 = G()[B2 / 4 + 0], C2 = K()[B2 / 4 + 1];
      return 0 === g2 ? void 0 : C2;
    } finally {
      A.__wbindgen_add_to_stack_pointer(16);
    }
  }
  wheel_suspension_force(I2) {
    try {
      const B2 = A.__wbindgen_add_to_stack_pointer(-16);
      A.rawdynamicraycastvehiclecontroller_wheel_suspension_force(B2, this.__wbg_ptr, I2);
      var g2 = G()[B2 / 4 + 0], C2 = K()[B2 / 4 + 1];
      return 0 === g2 ? void 0 : C2;
    } finally {
      A.__wbindgen_add_to_stack_pointer(16);
    }
  }
  wheel_contact_normal_ws(I2) {
    const g2 = A.rawdynamicraycastvehiclecontroller_wheel_contact_normal_ws(this.__wbg_ptr, I2);
    return 0 === g2 ? void 0 : DA.__wrap(g2);
  }
  wheel_contact_point_ws(I2) {
    const g2 = A.rawdynamicraycastvehiclecontroller_wheel_contact_point_ws(this.__wbg_ptr, I2);
    return 0 === g2 ? void 0 : DA.__wrap(g2);
  }
  wheel_suspension_length(I2) {
    try {
      const B2 = A.__wbindgen_add_to_stack_pointer(-16);
      A.rawdynamicraycastvehiclecontroller_wheel_suspension_length(B2, this.__wbg_ptr, I2);
      var g2 = G()[B2 / 4 + 0], C2 = K()[B2 / 4 + 1];
      return 0 === g2 ? void 0 : C2;
    } finally {
      A.__wbindgen_add_to_stack_pointer(16);
    }
  }
  wheel_hard_point_ws(I2) {
    const g2 = A.rawdynamicraycastvehiclecontroller_wheel_hard_point_ws(this.__wbg_ptr, I2);
    return 0 === g2 ? void 0 : DA.__wrap(g2);
  }
  wheel_is_in_contact(I2) {
    return 0 !== A.rawdynamicraycastvehiclecontroller_wheel_is_in_contact(this.__wbg_ptr, I2);
  }
  wheel_ground_object(I2) {
    try {
      const B2 = A.__wbindgen_add_to_stack_pointer(-16);
      A.rawdynamicraycastvehiclecontroller_wheel_ground_object(B2, this.__wbg_ptr, I2);
      var g2 = G()[B2 / 4 + 0], C2 = D()[B2 / 8 + 1];
      return 0 === g2 ? void 0 : C2;
    } finally {
      A.__wbindgen_add_to_stack_pointer(16);
    }
  }
}
class b {
  __destroy_into_raw() {
    const A2 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, A2;
  }
  free() {
    const I2 = this.__destroy_into_raw();
    A.__wbg_raweventqueue_free(I2);
  }
  constructor(I2) {
    const g2 = A.raweventqueue_new(I2);
    return this.__wbg_ptr = g2 >>> 0, this;
  }
  drainCollisionEvents(g2) {
    try {
      A.raweventqueue_drainCollisionEvents(this.__wbg_ptr, J(g2));
    } finally {
      I[h++] = void 0;
    }
  }
  drainContactForceEvents(g2) {
    try {
      A.raweventqueue_drainContactForceEvents(this.__wbg_ptr, J(g2));
    } finally {
      I[h++] = void 0;
    }
  }
  clear() {
    A.raweventqueue_clear(this.__wbg_ptr);
  }
}
class x {
  static __wrap(A2) {
    A2 >>>= 0;
    const I2 = Object.create(x.prototype);
    return I2.__wbg_ptr = A2, I2;
  }
  __destroy_into_raw() {
    const A2 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, A2;
  }
  free() {
    const I2 = this.__destroy_into_raw();
    A.__wbg_rawgenericjoint_free(I2);
  }
  static generic(I2, g2, C2, B2) {
    U(I2, DA), U(g2, DA), U(C2, DA);
    const Q2 = A.rawgenericjoint_generic(I2.__wbg_ptr, g2.__wbg_ptr, C2.__wbg_ptr, B2);
    return 0 === Q2 ? void 0 : x.__wrap(Q2);
  }
  static spring(I2, g2, C2, B2, Q2) {
    U(B2, DA), U(Q2, DA);
    const E2 = A.rawgenericjoint_spring(I2, g2, C2, B2.__wbg_ptr, Q2.__wbg_ptr);
    return x.__wrap(E2);
  }
  static rope(I2, g2, C2) {
    U(g2, DA), U(C2, DA);
    const B2 = A.rawgenericjoint_rope(I2, g2.__wbg_ptr, C2.__wbg_ptr);
    return x.__wrap(B2);
  }
  static spherical(I2, g2) {
    U(I2, DA), U(g2, DA);
    const C2 = A.rawgenericjoint_spherical(I2.__wbg_ptr, g2.__wbg_ptr);
    return x.__wrap(C2);
  }
  static prismatic(I2, g2, C2, B2, Q2, E2) {
    U(I2, DA), U(g2, DA), U(C2, DA);
    const i2 = A.rawgenericjoint_prismatic(I2.__wbg_ptr, g2.__wbg_ptr, C2.__wbg_ptr, B2, Q2, E2);
    return 0 === i2 ? void 0 : x.__wrap(i2);
  }
  static fixed(I2, g2, C2, B2) {
    U(I2, DA), U(g2, gA), U(C2, DA), U(B2, gA);
    const Q2 = A.rawgenericjoint_fixed(I2.__wbg_ptr, g2.__wbg_ptr, C2.__wbg_ptr, B2.__wbg_ptr);
    return x.__wrap(Q2);
  }
  static revolute(I2, g2, C2) {
    U(I2, DA), U(g2, DA), U(C2, DA);
    const B2 = A.rawgenericjoint_revolute(I2.__wbg_ptr, g2.__wbg_ptr, C2.__wbg_ptr);
    return 0 === B2 ? void 0 : x.__wrap(B2);
  }
}
class W {
  static __wrap(A2) {
    A2 >>>= 0;
    const I2 = Object.create(W.prototype);
    return I2.__wbg_ptr = A2, I2;
  }
  __destroy_into_raw() {
    const A2 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, A2;
  }
  free() {
    const I2 = this.__destroy_into_raw();
    A.__wbg_rawimpulsejointset_free(I2);
  }
  jointType(I2) {
    return A.rawimpulsejointset_jointType(this.__wbg_ptr, I2);
  }
  jointBodyHandle1(I2) {
    return A.rawimpulsejointset_jointBodyHandle1(this.__wbg_ptr, I2);
  }
  jointBodyHandle2(I2) {
    return A.rawimpulsejointset_jointBodyHandle2(this.__wbg_ptr, I2);
  }
  jointFrameX1(I2) {
    const g2 = A.rawimpulsejointset_jointFrameX1(this.__wbg_ptr, I2);
    return gA.__wrap(g2);
  }
  jointFrameX2(I2) {
    const g2 = A.rawimpulsejointset_jointFrameX2(this.__wbg_ptr, I2);
    return gA.__wrap(g2);
  }
  jointAnchor1(I2) {
    const g2 = A.rawimpulsejointset_jointAnchor1(this.__wbg_ptr, I2);
    return DA.__wrap(g2);
  }
  jointAnchor2(I2) {
    const g2 = A.rawimpulsejointset_jointAnchor2(this.__wbg_ptr, I2);
    return DA.__wrap(g2);
  }
  jointSetAnchor1(I2, g2) {
    U(g2, DA), A.rawimpulsejointset_jointSetAnchor1(this.__wbg_ptr, I2, g2.__wbg_ptr);
  }
  jointSetAnchor2(I2, g2) {
    U(g2, DA), A.rawimpulsejointset_jointSetAnchor2(this.__wbg_ptr, I2, g2.__wbg_ptr);
  }
  jointContactsEnabled(I2) {
    return 0 !== A.rawimpulsejointset_jointContactsEnabled(this.__wbg_ptr, I2);
  }
  jointSetContactsEnabled(I2, g2) {
    A.rawimpulsejointset_jointSetContactsEnabled(this.__wbg_ptr, I2, g2);
  }
  jointLimitsEnabled(I2, g2) {
    return 0 !== A.rawimpulsejointset_jointLimitsEnabled(this.__wbg_ptr, I2, g2);
  }
  jointLimitsMin(I2, g2) {
    return A.rawimpulsejointset_jointLimitsMin(this.__wbg_ptr, I2, g2);
  }
  jointLimitsMax(I2, g2) {
    return A.rawimpulsejointset_jointLimitsMax(this.__wbg_ptr, I2, g2);
  }
  jointSetLimits(I2, g2, C2, B2) {
    A.rawimpulsejointset_jointSetLimits(this.__wbg_ptr, I2, g2, C2, B2);
  }
  jointConfigureMotorModel(I2, g2, C2) {
    A.rawimpulsejointset_jointConfigureMotorModel(this.__wbg_ptr, I2, g2, C2);
  }
  jointConfigureMotorVelocity(I2, g2, C2, B2) {
    A.rawimpulsejointset_jointConfigureMotorVelocity(this.__wbg_ptr, I2, g2, C2, B2);
  }
  jointConfigureMotorPosition(I2, g2, C2, B2, Q2) {
    A.rawimpulsejointset_jointConfigureMotorPosition(this.__wbg_ptr, I2, g2, C2, B2, Q2);
  }
  jointConfigureMotor(I2, g2, C2, B2, Q2, E2) {
    A.rawimpulsejointset_jointConfigureMotor(this.__wbg_ptr, I2, g2, C2, B2, Q2, E2);
  }
  constructor() {
    const I2 = A.rawimpulsejointset_new();
    return this.__wbg_ptr = I2 >>> 0, this;
  }
  createJoint(I2, g2, C2, B2) {
    U(I2, x);
    return A.rawimpulsejointset_createJoint(this.__wbg_ptr, I2.__wbg_ptr, g2, C2, B2);
  }
  remove(I2, g2) {
    A.rawimpulsejointset_remove(this.__wbg_ptr, I2, g2);
  }
  len() {
    return A.rawimpulsejointset_len(this.__wbg_ptr) >>> 0;
  }
  contains(I2) {
    return 0 !== A.rawimpulsejointset_contains(this.__wbg_ptr, I2);
  }
  forEachJointHandle(g2) {
    try {
      A.rawimpulsejointset_forEachJointHandle(this.__wbg_ptr, J(g2));
    } finally {
      I[h++] = void 0;
    }
  }
  forEachJointAttachedToRigidBody(g2, C2) {
    try {
      A.rawimpulsejointset_forEachJointAttachedToRigidBody(this.__wbg_ptr, g2, J(C2));
    } finally {
      I[h++] = void 0;
    }
  }
}
class j {
  static __wrap(A2) {
    A2 >>>= 0;
    const I2 = Object.create(j.prototype);
    return I2.__wbg_ptr = A2, I2;
  }
  __destroy_into_raw() {
    const A2 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, A2;
  }
  free() {
    const I2 = this.__destroy_into_raw();
    A.__wbg_rawintegrationparameters_free(I2);
  }
  constructor() {
    const I2 = A.rawintegrationparameters_new();
    return this.__wbg_ptr = I2 >>> 0, this;
  }
  get dt() {
    return A.rawintegrationparameters_dt(this.__wbg_ptr);
  }
  get erp() {
    return A.rawintegrationparameters_erp(this.__wbg_ptr);
  }
  get normalizedAllowedLinearError() {
    return A.rawdynamicraycastvehiclecontroller_current_vehicle_speed(this.__wbg_ptr);
  }
  get normalizedPredictionDistance() {
    return A.rawcontactforceevent_max_force_magnitude(this.__wbg_ptr);
  }
  get numSolverIterations() {
    return A.rawintegrationparameters_numSolverIterations(this.__wbg_ptr) >>> 0;
  }
  get numAdditionalFrictionIterations() {
    return A.rawdynamicraycastvehiclecontroller_index_up_axis(this.__wbg_ptr) >>> 0;
  }
  get numInternalPgsIterations() {
    return A.rawdynamicraycastvehiclecontroller_index_forward_axis(this.__wbg_ptr) >>> 0;
  }
  get minIslandSize() {
    return A.rawimpulsejointset_len(this.__wbg_ptr) >>> 0;
  }
  get maxCcdSubsteps() {
    return A.rawintegrationparameters_maxCcdSubsteps(this.__wbg_ptr) >>> 0;
  }
  get lengthUnit() {
    return A.rawintegrationparameters_lengthUnit(this.__wbg_ptr);
  }
  set dt(I2) {
    A.rawintegrationparameters_set_dt(this.__wbg_ptr, I2);
  }
  set erp(I2) {
    A.rawintegrationparameters_set_erp(this.__wbg_ptr, I2);
  }
  set normalizedAllowedLinearError(I2) {
    A.rawintegrationparameters_set_normalizedAllowedLinearError(this.__wbg_ptr, I2);
  }
  set normalizedPredictionDistance(I2) {
    A.rawintegrationparameters_set_normalizedPredictionDistance(this.__wbg_ptr, I2);
  }
  set numSolverIterations(I2) {
    A.rawintegrationparameters_set_numSolverIterations(this.__wbg_ptr, I2);
  }
  set numAdditionalFrictionIterations(I2) {
    A.rawdynamicraycastvehiclecontroller_set_index_up_axis(this.__wbg_ptr, I2);
  }
  set numInternalPgsIterations(I2) {
    A.rawdynamicraycastvehiclecontroller_set_index_forward_axis(this.__wbg_ptr, I2);
  }
  set minIslandSize(I2) {
    A.rawintegrationparameters_set_minIslandSize(this.__wbg_ptr, I2);
  }
  set maxCcdSubsteps(I2) {
    A.rawintegrationparameters_set_maxCcdSubsteps(this.__wbg_ptr, I2);
  }
  set lengthUnit(I2) {
    A.rawintegrationparameters_set_lengthUnit(this.__wbg_ptr, I2);
  }
  switchToStandardPgsSolver() {
    A.rawintegrationparameters_switchToStandardPgsSolver(this.__wbg_ptr);
  }
  switchToSmallStepsPgsSolver() {
    A.rawintegrationparameters_switchToSmallStepsPgsSolver(this.__wbg_ptr);
  }
  switchToSmallStepsPgsSolverWithoutWarmstart() {
    A.rawintegrationparameters_switchToSmallStepsPgsSolverWithoutWarmstart(this.__wbg_ptr);
  }
}
class m {
  static __wrap(A2) {
    A2 >>>= 0;
    const I2 = Object.create(m.prototype);
    return I2.__wbg_ptr = A2, I2;
  }
  __destroy_into_raw() {
    const A2 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, A2;
  }
  free() {
    const I2 = this.__destroy_into_raw();
    A.__wbg_rawislandmanager_free(I2);
  }
  constructor() {
    const I2 = A.rawislandmanager_new();
    return this.__wbg_ptr = I2 >>> 0, this;
  }
  forEachActiveRigidBodyHandle(g2) {
    try {
      A.rawislandmanager_forEachActiveRigidBodyHandle(this.__wbg_ptr, J(g2));
    } finally {
      I[h++] = void 0;
    }
  }
}
class f {
  __destroy_into_raw() {
    const A2 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, A2;
  }
  free() {
    const I2 = this.__destroy_into_raw();
    A.__wbg_rawkinematiccharactercontroller_free(I2);
  }
  constructor(I2) {
    const g2 = A.rawkinematiccharactercontroller_new(I2);
    return this.__wbg_ptr = g2 >>> 0, this;
  }
  up() {
    const I2 = A.rawcharactercollision_translationDeltaApplied(this.__wbg_ptr);
    return DA.__wrap(I2);
  }
  setUp(I2) {
    U(I2, DA), A.rawkinematiccharactercontroller_setUp(this.__wbg_ptr, I2.__wbg_ptr);
  }
  normalNudgeFactor() {
    return A.rawkinematiccharactercontroller_normalNudgeFactor(this.__wbg_ptr);
  }
  setNormalNudgeFactor(I2) {
    A.rawkinematiccharactercontroller_setNormalNudgeFactor(this.__wbg_ptr, I2);
  }
  offset() {
    return A.rawintegrationparameters_dt(this.__wbg_ptr);
  }
  setOffset(I2) {
    A.rawkinematiccharactercontroller_setOffset(this.__wbg_ptr, I2);
  }
  slideEnabled() {
    return 0 !== A.rawkinematiccharactercontroller_slideEnabled(this.__wbg_ptr);
  }
  setSlideEnabled(I2) {
    A.rawkinematiccharactercontroller_setSlideEnabled(this.__wbg_ptr, I2);
  }
  autostepMaxHeight() {
    try {
      const C2 = A.__wbindgen_add_to_stack_pointer(-16);
      A.rawkinematiccharactercontroller_autostepMaxHeight(C2, this.__wbg_ptr);
      var I2 = G()[C2 / 4 + 0], g2 = K()[C2 / 4 + 1];
      return 0 === I2 ? void 0 : g2;
    } finally {
      A.__wbindgen_add_to_stack_pointer(16);
    }
  }
  autostepMinWidth() {
    try {
      const C2 = A.__wbindgen_add_to_stack_pointer(-16);
      A.rawkinematiccharactercontroller_autostepMinWidth(C2, this.__wbg_ptr);
      var I2 = G()[C2 / 4 + 0], g2 = K()[C2 / 4 + 1];
      return 0 === I2 ? void 0 : g2;
    } finally {
      A.__wbindgen_add_to_stack_pointer(16);
    }
  }
  autostepIncludesDynamicBodies() {
    const I2 = A.rawkinematiccharactercontroller_autostepIncludesDynamicBodies(this.__wbg_ptr);
    return 16777215 === I2 ? void 0 : 0 !== I2;
  }
  autostepEnabled() {
    return 0 !== A.rawkinematiccharactercontroller_autostepEnabled(this.__wbg_ptr);
  }
  enableAutostep(I2, g2, C2) {
    A.rawkinematiccharactercontroller_enableAutostep(this.__wbg_ptr, I2, g2, C2);
  }
  disableAutostep() {
    A.rawkinematiccharactercontroller_disableAutostep(this.__wbg_ptr);
  }
  maxSlopeClimbAngle() {
    return A.rawkinematiccharactercontroller_maxSlopeClimbAngle(this.__wbg_ptr);
  }
  setMaxSlopeClimbAngle(I2) {
    A.rawkinematiccharactercontroller_setMaxSlopeClimbAngle(this.__wbg_ptr, I2);
  }
  minSlopeSlideAngle() {
    return A.rawkinematiccharactercontroller_minSlopeSlideAngle(this.__wbg_ptr);
  }
  setMinSlopeSlideAngle(I2) {
    A.rawkinematiccharactercontroller_setMinSlopeSlideAngle(this.__wbg_ptr, I2);
  }
  snapToGroundDistance() {
    try {
      const C2 = A.__wbindgen_add_to_stack_pointer(-16);
      A.rawkinematiccharactercontroller_snapToGroundDistance(C2, this.__wbg_ptr);
      var I2 = G()[C2 / 4 + 0], g2 = K()[C2 / 4 + 1];
      return 0 === I2 ? void 0 : g2;
    } finally {
      A.__wbindgen_add_to_stack_pointer(16);
    }
  }
  enableSnapToGround(I2) {
    A.rawkinematiccharactercontroller_enableSnapToGround(this.__wbg_ptr, I2);
  }
  disableSnapToGround() {
    A.rawkinematiccharactercontroller_disableSnapToGround(this.__wbg_ptr);
  }
  snapToGroundEnabled() {
    return 0 !== A.rawkinematiccharactercontroller_snapToGroundEnabled(this.__wbg_ptr);
  }
  computeColliderMovement(g2, C2, B2, Q2, i2, D2, o2, G2, w2, S2, k2) {
    try {
      U(C2, IA), U(B2, p), U(Q2, v), U(D2, DA), A.rawkinematiccharactercontroller_computeColliderMovement(this.__wbg_ptr, g2, C2.__wbg_ptr, B2.__wbg_ptr, Q2.__wbg_ptr, i2, D2.__wbg_ptr, o2, !E(G2), E(G2) ? 0 : G2, w2, !E(S2), E(S2) ? 0 : S2, J(k2));
    } finally {
      I[h++] = void 0;
    }
  }
  computedMovement() {
    const I2 = A.rawkinematiccharactercontroller_computedMovement(this.__wbg_ptr);
    return DA.__wrap(I2);
  }
  computedGrounded() {
    return 0 !== A.rawkinematiccharactercontroller_computedGrounded(this.__wbg_ptr);
  }
  numComputedCollisions() {
    return A.rawkinematiccharactercontroller_numComputedCollisions(this.__wbg_ptr) >>> 0;
  }
  computedCollision(I2, g2) {
    U(g2, t);
    return 0 !== A.rawkinematiccharactercontroller_computedCollision(this.__wbg_ptr, I2, g2.__wbg_ptr);
  }
}
class V {
  static __wrap(A2) {
    A2 >>>= 0;
    const I2 = Object.create(V.prototype);
    return I2.__wbg_ptr = A2, I2;
  }
  __destroy_into_raw() {
    const A2 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, A2;
  }
  free() {
    const I2 = this.__destroy_into_raw();
    A.__wbg_rawmultibodyjointset_free(I2);
  }
  jointType(I2) {
    return A.rawmultibodyjointset_jointType(this.__wbg_ptr, I2);
  }
  jointFrameX1(I2) {
    const g2 = A.rawmultibodyjointset_jointFrameX1(this.__wbg_ptr, I2);
    return gA.__wrap(g2);
  }
  jointFrameX2(I2) {
    const g2 = A.rawmultibodyjointset_jointFrameX2(this.__wbg_ptr, I2);
    return gA.__wrap(g2);
  }
  jointAnchor1(I2) {
    const g2 = A.rawmultibodyjointset_jointAnchor1(this.__wbg_ptr, I2);
    return DA.__wrap(g2);
  }
  jointAnchor2(I2) {
    const g2 = A.rawmultibodyjointset_jointAnchor2(this.__wbg_ptr, I2);
    return DA.__wrap(g2);
  }
  jointContactsEnabled(I2) {
    return 0 !== A.rawmultibodyjointset_jointContactsEnabled(this.__wbg_ptr, I2);
  }
  jointSetContactsEnabled(I2, g2) {
    A.rawmultibodyjointset_jointSetContactsEnabled(this.__wbg_ptr, I2, g2);
  }
  jointLimitsEnabled(I2, g2) {
    return 0 !== A.rawmultibodyjointset_jointLimitsEnabled(this.__wbg_ptr, I2, g2);
  }
  jointLimitsMin(I2, g2) {
    return A.rawmultibodyjointset_jointLimitsMin(this.__wbg_ptr, I2, g2);
  }
  jointLimitsMax(I2, g2) {
    return A.rawmultibodyjointset_jointLimitsMax(this.__wbg_ptr, I2, g2);
  }
  constructor() {
    const I2 = A.rawmultibodyjointset_new();
    return this.__wbg_ptr = I2 >>> 0, this;
  }
  createJoint(I2, g2, C2, B2) {
    U(I2, x);
    return A.rawmultibodyjointset_createJoint(this.__wbg_ptr, I2.__wbg_ptr, g2, C2, B2);
  }
  remove(I2, g2) {
    A.rawmultibodyjointset_remove(this.__wbg_ptr, I2, g2);
  }
  contains(I2) {
    return 0 !== A.rawmultibodyjointset_contains(this.__wbg_ptr, I2);
  }
  forEachJointHandle(g2) {
    try {
      A.rawmultibodyjointset_forEachJointHandle(this.__wbg_ptr, J(g2));
    } finally {
      I[h++] = void 0;
    }
  }
  forEachJointAttachedToRigidBody(g2, C2) {
    try {
      A.rawmultibodyjointset_forEachJointAttachedToRigidBody(this.__wbg_ptr, g2, J(C2));
    } finally {
      I[h++] = void 0;
    }
  }
}
class X {
  static __wrap(A2) {
    A2 >>>= 0;
    const I2 = Object.create(X.prototype);
    return I2.__wbg_ptr = A2, I2;
  }
  __destroy_into_raw() {
    const A2 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, A2;
  }
  free() {
    const I2 = this.__destroy_into_raw();
    A.__wbg_rawnarrowphase_free(I2);
  }
  constructor() {
    const I2 = A.rawnarrowphase_new();
    return this.__wbg_ptr = I2 >>> 0, this;
  }
  contact_pairs_with(I2, g2) {
    A.rawnarrowphase_contact_pairs_with(this.__wbg_ptr, I2, C(g2));
  }
  contact_pair(I2, g2) {
    const C2 = A.rawnarrowphase_contact_pair(this.__wbg_ptr, I2, g2);
    return 0 === C2 ? void 0 : T.__wrap(C2);
  }
  intersection_pairs_with(I2, g2) {
    A.rawnarrowphase_intersection_pairs_with(this.__wbg_ptr, I2, C(g2));
  }
  intersection_pair(I2, g2) {
    return 0 !== A.rawnarrowphase_intersection_pair(this.__wbg_ptr, I2, g2);
  }
}
class P {
  __destroy_into_raw() {
    const A2 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, A2;
  }
  free() {
    const I2 = this.__destroy_into_raw();
    A.__wbg_rawphysicspipeline_free(I2);
  }
  constructor() {
    const I2 = A.rawphysicspipeline_new();
    return this.__wbg_ptr = I2 >>> 0, this;
  }
  step(I2, g2, C2, B2, Q2, E2, i2, D2, o2, G2) {
    U(I2, DA), U(g2, j), U(C2, m), U(B2, H), U(Q2, X), U(E2, IA), U(i2, p), U(D2, W), U(o2, V), U(G2, L), A.rawphysicspipeline_step(this.__wbg_ptr, I2.__wbg_ptr, g2.__wbg_ptr, C2.__wbg_ptr, B2.__wbg_ptr, Q2.__wbg_ptr, E2.__wbg_ptr, i2.__wbg_ptr, D2.__wbg_ptr, o2.__wbg_ptr, G2.__wbg_ptr);
  }
  stepWithEvents(I2, g2, B2, Q2, E2, i2, D2, o2, G2, w2, S2, k2, a2, K2) {
    U(I2, DA), U(g2, j), U(B2, m), U(Q2, H), U(E2, X), U(i2, IA), U(D2, p), U(o2, W), U(G2, V), U(w2, L), U(S2, b), A.rawphysicspipeline_stepWithEvents(this.__wbg_ptr, I2.__wbg_ptr, g2.__wbg_ptr, B2.__wbg_ptr, Q2.__wbg_ptr, E2.__wbg_ptr, i2.__wbg_ptr, D2.__wbg_ptr, o2.__wbg_ptr, G2.__wbg_ptr, w2.__wbg_ptr, S2.__wbg_ptr, C(k2), C(a2), C(K2));
  }
}
class u {
  static __wrap(A2) {
    A2 >>>= 0;
    const I2 = Object.create(u.prototype);
    return I2.__wbg_ptr = A2, I2;
  }
  __destroy_into_raw() {
    const A2 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, A2;
  }
  free() {
    const I2 = this.__destroy_into_raw();
    A.__wbg_rawpointcolliderprojection_free(I2);
  }
  colliderHandle() {
    return A.rawpointcolliderprojection_colliderHandle(this.__wbg_ptr);
  }
  point() {
    const I2 = A.rawpointcolliderprojection_point(this.__wbg_ptr);
    return DA.__wrap(I2);
  }
  isInside() {
    return 0 !== A.rawpointcolliderprojection_isInside(this.__wbg_ptr);
  }
  featureType() {
    return A.rawpointcolliderprojection_featureType(this.__wbg_ptr);
  }
  featureId() {
    try {
      const C2 = A.__wbindgen_add_to_stack_pointer(-16);
      A.rawpointcolliderprojection_featureId(C2, this.__wbg_ptr);
      var I2 = G()[C2 / 4 + 0], g2 = G()[C2 / 4 + 1];
      return 0 === I2 ? void 0 : g2 >>> 0;
    } finally {
      A.__wbindgen_add_to_stack_pointer(16);
    }
  }
}
class z {
  static __wrap(A2) {
    A2 >>>= 0;
    const I2 = Object.create(z.prototype);
    return I2.__wbg_ptr = A2, I2;
  }
  __destroy_into_raw() {
    const A2 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, A2;
  }
  free() {
    const I2 = this.__destroy_into_raw();
    A.__wbg_rawpointprojection_free(I2);
  }
  point() {
    const I2 = A.rawpointprojection_point(this.__wbg_ptr);
    return DA.__wrap(I2);
  }
  isInside() {
    return 0 !== A.rawpointprojection_isInside(this.__wbg_ptr);
  }
}
class v {
  __destroy_into_raw() {
    const A2 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, A2;
  }
  free() {
    const I2 = this.__destroy_into_raw();
    A.__wbg_rawquerypipeline_free(I2);
  }
  constructor() {
    const I2 = A.rawquerypipeline_new();
    return this.__wbg_ptr = I2 >>> 0, this;
  }
  update(I2, g2) {
    U(I2, IA), U(g2, p), A.rawquerypipeline_update(this.__wbg_ptr, I2.__wbg_ptr, g2.__wbg_ptr);
  }
  castRay(g2, C2, B2, Q2, i2, D2, o2, G2, w2, S2, k2) {
    try {
      U(g2, IA), U(C2, p), U(B2, DA), U(Q2, DA);
      const a2 = A.rawquerypipeline_castRay(this.__wbg_ptr, g2.__wbg_ptr, C2.__wbg_ptr, B2.__wbg_ptr, Q2.__wbg_ptr, i2, D2, o2, !E(G2), E(G2) ? 0 : G2, !E(w2), E(w2) ? 0 : w2, !E(S2), E(S2) ? 0 : S2, J(k2));
      return 0 === a2 ? void 0 : _.__wrap(a2);
    } finally {
      I[h++] = void 0;
    }
  }
  castRayAndGetNormal(g2, C2, B2, Q2, i2, D2, o2, G2, w2, S2, k2) {
    try {
      U(g2, IA), U(C2, p), U(B2, DA), U(Q2, DA);
      const a2 = A.rawquerypipeline_castRayAndGetNormal(this.__wbg_ptr, g2.__wbg_ptr, C2.__wbg_ptr, B2.__wbg_ptr, Q2.__wbg_ptr, i2, D2, o2, !E(G2), E(G2) ? 0 : G2, !E(w2), E(w2) ? 0 : w2, !E(S2), E(S2) ? 0 : S2, J(k2));
      return 0 === a2 ? void 0 : $.__wrap(a2);
    } finally {
      I[h++] = void 0;
    }
  }
  intersectionsWithRay(g2, C2, B2, Q2, i2, D2, o2, G2, w2, S2, k2, a2) {
    try {
      U(g2, IA), U(C2, p), U(B2, DA), U(Q2, DA), A.rawquerypipeline_intersectionsWithRay(this.__wbg_ptr, g2.__wbg_ptr, C2.__wbg_ptr, B2.__wbg_ptr, Q2.__wbg_ptr, i2, D2, J(o2), G2, !E(w2), E(w2) ? 0 : w2, !E(S2), E(S2) ? 0 : S2, !E(k2), E(k2) ? 0 : k2, J(a2));
    } finally {
      I[h++] = void 0, I[h++] = void 0;
    }
  }
  intersectionWithShape(g2, C2, B2, Q2, i2, o2, w2, S2, k2, a2) {
    try {
      const M2 = A.__wbindgen_add_to_stack_pointer(-16);
      U(g2, IA), U(C2, p), U(B2, DA), U(Q2, gA), U(i2, QA), A.rawquerypipeline_intersectionWithShape(M2, this.__wbg_ptr, g2.__wbg_ptr, C2.__wbg_ptr, B2.__wbg_ptr, Q2.__wbg_ptr, i2.__wbg_ptr, o2, !E(w2), E(w2) ? 0 : w2, !E(S2), E(S2) ? 0 : S2, !E(k2), E(k2) ? 0 : k2, J(a2));
      var K2 = G()[M2 / 4 + 0], y2 = D()[M2 / 8 + 1];
      return 0 === K2 ? void 0 : y2;
    } finally {
      A.__wbindgen_add_to_stack_pointer(16), I[h++] = void 0;
    }
  }
  projectPoint(g2, C2, B2, Q2, i2, D2, o2, G2, w2) {
    try {
      U(g2, IA), U(C2, p), U(B2, DA);
      const S2 = A.rawquerypipeline_projectPoint(this.__wbg_ptr, g2.__wbg_ptr, C2.__wbg_ptr, B2.__wbg_ptr, Q2, i2, !E(D2), E(D2) ? 0 : D2, !E(o2), E(o2) ? 0 : o2, !E(G2), E(G2) ? 0 : G2, J(w2));
      return 0 === S2 ? void 0 : u.__wrap(S2);
    } finally {
      I[h++] = void 0;
    }
  }
  projectPointAndGetFeature(g2, C2, B2, Q2, i2, D2, o2, G2) {
    try {
      U(g2, IA), U(C2, p), U(B2, DA);
      const w2 = A.rawquerypipeline_projectPointAndGetFeature(this.__wbg_ptr, g2.__wbg_ptr, C2.__wbg_ptr, B2.__wbg_ptr, Q2, !E(i2), E(i2) ? 0 : i2, !E(D2), E(D2) ? 0 : D2, !E(o2), E(o2) ? 0 : o2, J(G2));
      return 0 === w2 ? void 0 : u.__wrap(w2);
    } finally {
      I[h++] = void 0;
    }
  }
  intersectionsWithPoint(g2, C2, B2, Q2, i2, D2, o2, G2, w2) {
    try {
      U(g2, IA), U(C2, p), U(B2, DA), A.rawquerypipeline_intersectionsWithPoint(this.__wbg_ptr, g2.__wbg_ptr, C2.__wbg_ptr, B2.__wbg_ptr, J(Q2), i2, !E(D2), E(D2) ? 0 : D2, !E(o2), E(o2) ? 0 : o2, !E(G2), E(G2) ? 0 : G2, J(w2));
    } finally {
      I[h++] = void 0, I[h++] = void 0;
    }
  }
  castShape(g2, C2, B2, Q2, i2, D2, o2, G2, w2, S2, k2, a2, K2, y2) {
    try {
      U(g2, IA), U(C2, p), U(B2, DA), U(Q2, gA), U(i2, DA), U(D2, QA);
      const M2 = A.rawquerypipeline_castShape(this.__wbg_ptr, g2.__wbg_ptr, C2.__wbg_ptr, B2.__wbg_ptr, Q2.__wbg_ptr, i2.__wbg_ptr, D2.__wbg_ptr, o2, G2, w2, S2, !E(k2), E(k2) ? 0 : k2, !E(a2), E(a2) ? 0 : a2, !E(K2), E(K2) ? 0 : K2, J(y2));
      return 0 === M2 ? void 0 : e.__wrap(M2);
    } finally {
      I[h++] = void 0;
    }
  }
  intersectionsWithShape(g2, C2, B2, Q2, i2, D2, o2, G2, w2, S2, k2) {
    try {
      U(g2, IA), U(C2, p), U(B2, DA), U(Q2, gA), U(i2, QA), A.rawquerypipeline_intersectionsWithShape(this.__wbg_ptr, g2.__wbg_ptr, C2.__wbg_ptr, B2.__wbg_ptr, Q2.__wbg_ptr, i2.__wbg_ptr, J(D2), o2, !E(G2), E(G2) ? 0 : G2, !E(w2), E(w2) ? 0 : w2, !E(S2), E(S2) ? 0 : S2, J(k2));
    } finally {
      I[h++] = void 0, I[h++] = void 0;
    }
  }
  collidersWithAabbIntersectingAabb(g2, C2, B2) {
    try {
      U(g2, DA), U(C2, DA), A.rawquerypipeline_collidersWithAabbIntersectingAabb(this.__wbg_ptr, g2.__wbg_ptr, C2.__wbg_ptr, J(B2));
    } finally {
      I[h++] = void 0;
    }
  }
}
class _ {
  static __wrap(A2) {
    A2 >>>= 0;
    const I2 = Object.create(_.prototype);
    return I2.__wbg_ptr = A2, I2;
  }
  __destroy_into_raw() {
    const A2 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, A2;
  }
  free() {
    const I2 = this.__destroy_into_raw();
    A.__wbg_rawraycolliderhit_free(I2);
  }
  colliderHandle() {
    return A.rawcharactercollision_handle(this.__wbg_ptr);
  }
  timeOfImpact() {
    return A.rawcollidershapecasthit_time_of_impact(this.__wbg_ptr);
  }
}
class $ {
  static __wrap(A2) {
    A2 >>>= 0;
    const I2 = Object.create($.prototype);
    return I2.__wbg_ptr = A2, I2;
  }
  __destroy_into_raw() {
    const A2 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, A2;
  }
  free() {
    const I2 = this.__destroy_into_raw();
    A.__wbg_rawraycolliderintersection_free(I2);
  }
  colliderHandle() {
    return A.rawpointcolliderprojection_colliderHandle(this.__wbg_ptr);
  }
  normal() {
    const I2 = A.rawcollidershapecasthit_witness1(this.__wbg_ptr);
    return DA.__wrap(I2);
  }
  time_of_impact() {
    return A.rawcollidershapecasthit_time_of_impact(this.__wbg_ptr);
  }
  featureType() {
    return A.rawpointcolliderprojection_featureType(this.__wbg_ptr);
  }
  featureId() {
    try {
      const C2 = A.__wbindgen_add_to_stack_pointer(-16);
      A.rawpointcolliderprojection_featureId(C2, this.__wbg_ptr);
      var I2 = G()[C2 / 4 + 0], g2 = G()[C2 / 4 + 1];
      return 0 === I2 ? void 0 : g2 >>> 0;
    } finally {
      A.__wbindgen_add_to_stack_pointer(16);
    }
  }
}
class AA {
  static __wrap(A2) {
    A2 >>>= 0;
    const I2 = Object.create(AA.prototype);
    return I2.__wbg_ptr = A2, I2;
  }
  __destroy_into_raw() {
    const A2 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, A2;
  }
  free() {
    const I2 = this.__destroy_into_raw();
    A.__wbg_rawrayintersection_free(I2);
  }
  normal() {
    const I2 = A.rawcollidershapecasthit_witness1(this.__wbg_ptr);
    return DA.__wrap(I2);
  }
  time_of_impact() {
    return A.rawcollidershapecasthit_time_of_impact(this.__wbg_ptr);
  }
  featureType() {
    return A.rawpointcolliderprojection_featureType(this.__wbg_ptr);
  }
  featureId() {
    try {
      const C2 = A.__wbindgen_add_to_stack_pointer(-16);
      A.rawpointcolliderprojection_featureId(C2, this.__wbg_ptr);
      var I2 = G()[C2 / 4 + 0], g2 = G()[C2 / 4 + 1];
      return 0 === I2 ? void 0 : g2 >>> 0;
    } finally {
      A.__wbindgen_add_to_stack_pointer(16);
    }
  }
}
class IA {
  static __wrap(A2) {
    A2 >>>= 0;
    const I2 = Object.create(IA.prototype);
    return I2.__wbg_ptr = A2, I2;
  }
  __destroy_into_raw() {
    const A2 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, A2;
  }
  free() {
    const I2 = this.__destroy_into_raw();
    A.__wbg_rawrigidbodyset_free(I2);
  }
  rbTranslation(I2) {
    const g2 = A.rawrigidbodyset_rbTranslation(this.__wbg_ptr, I2);
    return DA.__wrap(g2);
  }
  rbRotation(I2) {
    const g2 = A.rawrigidbodyset_rbRotation(this.__wbg_ptr, I2);
    return gA.__wrap(g2);
  }
  rbSleep(I2) {
    A.rawrigidbodyset_rbSleep(this.__wbg_ptr, I2);
  }
  rbIsSleeping(I2) {
    return 0 !== A.rawrigidbodyset_rbIsSleeping(this.__wbg_ptr, I2);
  }
  rbIsMoving(I2) {
    return 0 !== A.rawrigidbodyset_rbIsMoving(this.__wbg_ptr, I2);
  }
  rbNextTranslation(I2) {
    const g2 = A.rawrigidbodyset_rbNextTranslation(this.__wbg_ptr, I2);
    return DA.__wrap(g2);
  }
  rbNextRotation(I2) {
    const g2 = A.rawrigidbodyset_rbNextRotation(this.__wbg_ptr, I2);
    return gA.__wrap(g2);
  }
  rbSetTranslation(I2, g2, C2, B2, Q2) {
    A.rawrigidbodyset_rbSetTranslation(this.__wbg_ptr, I2, g2, C2, B2, Q2);
  }
  rbSetRotation(I2, g2, C2, B2, Q2, E2) {
    A.rawrigidbodyset_rbSetRotation(this.__wbg_ptr, I2, g2, C2, B2, Q2, E2);
  }
  rbSetLinvel(I2, g2, C2) {
    U(g2, DA), A.rawrigidbodyset_rbSetLinvel(this.__wbg_ptr, I2, g2.__wbg_ptr, C2);
  }
  rbSetAngvel(I2, g2, C2) {
    U(g2, DA), A.rawrigidbodyset_rbSetAngvel(this.__wbg_ptr, I2, g2.__wbg_ptr, C2);
  }
  rbSetNextKinematicTranslation(I2, g2, C2, B2) {
    A.rawrigidbodyset_rbSetNextKinematicTranslation(this.__wbg_ptr, I2, g2, C2, B2);
  }
  rbSetNextKinematicRotation(I2, g2, C2, B2, Q2) {
    A.rawrigidbodyset_rbSetNextKinematicRotation(this.__wbg_ptr, I2, g2, C2, B2, Q2);
  }
  rbRecomputeMassPropertiesFromColliders(I2, g2) {
    U(g2, p), A.rawrigidbodyset_rbRecomputeMassPropertiesFromColliders(this.__wbg_ptr, I2, g2.__wbg_ptr);
  }
  rbSetAdditionalMass(I2, g2, C2) {
    A.rawrigidbodyset_rbSetAdditionalMass(this.__wbg_ptr, I2, g2, C2);
  }
  rbSetAdditionalMassProperties(I2, g2, C2, B2, Q2, E2) {
    U(C2, DA), U(B2, DA), U(Q2, gA), A.rawrigidbodyset_rbSetAdditionalMassProperties(this.__wbg_ptr, I2, g2, C2.__wbg_ptr, B2.__wbg_ptr, Q2.__wbg_ptr, E2);
  }
  rbLinvel(I2) {
    const g2 = A.rawrigidbodyset_rbLinvel(this.__wbg_ptr, I2);
    return DA.__wrap(g2);
  }
  rbAngvel(I2) {
    const g2 = A.rawrigidbodyset_rbAngvel(this.__wbg_ptr, I2);
    return DA.__wrap(g2);
  }
  rbLockTranslations(I2, g2, C2) {
    A.rawrigidbodyset_rbLockTranslations(this.__wbg_ptr, I2, g2, C2);
  }
  rbSetEnabledTranslations(I2, g2, C2, B2, Q2) {
    A.rawrigidbodyset_rbSetEnabledTranslations(this.__wbg_ptr, I2, g2, C2, B2, Q2);
  }
  rbLockRotations(I2, g2, C2) {
    A.rawrigidbodyset_rbLockRotations(this.__wbg_ptr, I2, g2, C2);
  }
  rbSetEnabledRotations(I2, g2, C2, B2, Q2) {
    A.rawrigidbodyset_rbSetEnabledRotations(this.__wbg_ptr, I2, g2, C2, B2, Q2);
  }
  rbDominanceGroup(I2) {
    return A.rawrigidbodyset_rbDominanceGroup(this.__wbg_ptr, I2);
  }
  rbSetDominanceGroup(I2, g2) {
    A.rawrigidbodyset_rbSetDominanceGroup(this.__wbg_ptr, I2, g2);
  }
  rbEnableCcd(I2, g2) {
    A.rawrigidbodyset_rbEnableCcd(this.__wbg_ptr, I2, g2);
  }
  rbSetSoftCcdPrediction(I2, g2) {
    A.rawrigidbodyset_rbSetSoftCcdPrediction(this.__wbg_ptr, I2, g2);
  }
  rbMass(I2) {
    return A.rawrigidbodyset_rbMass(this.__wbg_ptr, I2);
  }
  rbInvMass(I2) {
    return A.rawrigidbodyset_rbInvMass(this.__wbg_ptr, I2);
  }
  rbEffectiveInvMass(I2) {
    const g2 = A.rawrigidbodyset_rbEffectiveInvMass(this.__wbg_ptr, I2);
    return DA.__wrap(g2);
  }
  rbLocalCom(I2) {
    const g2 = A.rawrigidbodyset_rbLocalCom(this.__wbg_ptr, I2);
    return DA.__wrap(g2);
  }
  rbWorldCom(I2) {
    const g2 = A.rawrigidbodyset_rbWorldCom(this.__wbg_ptr, I2);
    return DA.__wrap(g2);
  }
  rbInvPrincipalInertiaSqrt(I2) {
    const g2 = A.rawrigidbodyset_rbInvPrincipalInertiaSqrt(this.__wbg_ptr, I2);
    return DA.__wrap(g2);
  }
  rbPrincipalInertiaLocalFrame(I2) {
    const g2 = A.rawrigidbodyset_rbPrincipalInertiaLocalFrame(this.__wbg_ptr, I2);
    return gA.__wrap(g2);
  }
  rbPrincipalInertia(I2) {
    const g2 = A.rawrigidbodyset_rbPrincipalInertia(this.__wbg_ptr, I2);
    return DA.__wrap(g2);
  }
  rbEffectiveWorldInvInertiaSqrt(I2) {
    const g2 = A.rawrigidbodyset_rbEffectiveWorldInvInertiaSqrt(this.__wbg_ptr, I2);
    return CA.__wrap(g2);
  }
  rbEffectiveAngularInertia(I2) {
    const g2 = A.rawrigidbodyset_rbEffectiveAngularInertia(this.__wbg_ptr, I2);
    return CA.__wrap(g2);
  }
  rbWakeUp(I2) {
    A.rawrigidbodyset_rbWakeUp(this.__wbg_ptr, I2);
  }
  rbIsCcdEnabled(I2) {
    return 0 !== A.rawrigidbodyset_rbIsCcdEnabled(this.__wbg_ptr, I2);
  }
  rbSoftCcdPrediction(I2) {
    return A.rawrigidbodyset_rbSoftCcdPrediction(this.__wbg_ptr, I2);
  }
  rbNumColliders(I2) {
    return A.rawrigidbodyset_rbNumColliders(this.__wbg_ptr, I2) >>> 0;
  }
  rbCollider(I2, g2) {
    return A.rawrigidbodyset_rbCollider(this.__wbg_ptr, I2, g2);
  }
  rbBodyType(I2) {
    return A.rawrigidbodyset_rbBodyType(this.__wbg_ptr, I2);
  }
  rbSetBodyType(I2, g2, C2) {
    A.rawrigidbodyset_rbSetBodyType(this.__wbg_ptr, I2, g2, C2);
  }
  rbIsFixed(I2) {
    return 0 !== A.rawrigidbodyset_rbIsFixed(this.__wbg_ptr, I2);
  }
  rbIsKinematic(I2) {
    return 0 !== A.rawrigidbodyset_rbIsKinematic(this.__wbg_ptr, I2);
  }
  rbIsDynamic(I2) {
    return 0 !== A.rawrigidbodyset_rbIsDynamic(this.__wbg_ptr, I2);
  }
  rbLinearDamping(I2) {
    return A.rawrigidbodyset_rbLinearDamping(this.__wbg_ptr, I2);
  }
  rbAngularDamping(I2) {
    return A.rawrigidbodyset_rbAngularDamping(this.__wbg_ptr, I2);
  }
  rbSetLinearDamping(I2, g2) {
    A.rawrigidbodyset_rbSetLinearDamping(this.__wbg_ptr, I2, g2);
  }
  rbSetAngularDamping(I2, g2) {
    A.rawrigidbodyset_rbSetAngularDamping(this.__wbg_ptr, I2, g2);
  }
  rbSetEnabled(I2, g2) {
    A.rawrigidbodyset_rbSetEnabled(this.__wbg_ptr, I2, g2);
  }
  rbIsEnabled(I2) {
    return 0 !== A.rawrigidbodyset_rbIsEnabled(this.__wbg_ptr, I2);
  }
  rbGravityScale(I2) {
    return A.rawrigidbodyset_rbGravityScale(this.__wbg_ptr, I2);
  }
  rbSetGravityScale(I2, g2, C2) {
    A.rawrigidbodyset_rbSetGravityScale(this.__wbg_ptr, I2, g2, C2);
  }
  rbResetForces(I2, g2) {
    A.rawrigidbodyset_rbResetForces(this.__wbg_ptr, I2, g2);
  }
  rbResetTorques(I2, g2) {
    A.rawrigidbodyset_rbResetTorques(this.__wbg_ptr, I2, g2);
  }
  rbAddForce(I2, g2, C2) {
    U(g2, DA), A.rawrigidbodyset_rbAddForce(this.__wbg_ptr, I2, g2.__wbg_ptr, C2);
  }
  rbApplyImpulse(I2, g2, C2) {
    U(g2, DA), A.rawrigidbodyset_rbApplyImpulse(this.__wbg_ptr, I2, g2.__wbg_ptr, C2);
  }
  rbAddTorque(I2, g2, C2) {
    U(g2, DA), A.rawrigidbodyset_rbAddTorque(this.__wbg_ptr, I2, g2.__wbg_ptr, C2);
  }
  rbApplyTorqueImpulse(I2, g2, C2) {
    U(g2, DA), A.rawrigidbodyset_rbApplyTorqueImpulse(this.__wbg_ptr, I2, g2.__wbg_ptr, C2);
  }
  rbAddForceAtPoint(I2, g2, C2, B2) {
    U(g2, DA), U(C2, DA), A.rawrigidbodyset_rbAddForceAtPoint(this.__wbg_ptr, I2, g2.__wbg_ptr, C2.__wbg_ptr, B2);
  }
  rbApplyImpulseAtPoint(I2, g2, C2, B2) {
    U(g2, DA), U(C2, DA), A.rawrigidbodyset_rbApplyImpulseAtPoint(this.__wbg_ptr, I2, g2.__wbg_ptr, C2.__wbg_ptr, B2);
  }
  rbAdditionalSolverIterations(I2) {
    return A.rawrigidbodyset_rbAdditionalSolverIterations(this.__wbg_ptr, I2) >>> 0;
  }
  rbSetAdditionalSolverIterations(I2, g2) {
    A.rawrigidbodyset_rbSetAdditionalSolverIterations(this.__wbg_ptr, I2, g2);
  }
  rbUserData(I2) {
    return A.rawrigidbodyset_rbUserData(this.__wbg_ptr, I2) >>> 0;
  }
  rbSetUserData(I2, g2) {
    A.rawrigidbodyset_rbSetUserData(this.__wbg_ptr, I2, g2);
  }
  constructor() {
    const I2 = A.rawrigidbodyset_new();
    return this.__wbg_ptr = I2 >>> 0, this;
  }
  createRigidBody(I2, g2, C2, B2, Q2, E2, i2, D2, o2, G2, w2, S2, k2, a2, K2, h2, J2, y2, M2, N2, F2, R2, q2, s2, c2, Y2) {
    U(g2, DA), U(C2, gA), U(i2, DA), U(D2, DA), U(o2, DA), U(G2, DA), U(w2, gA);
    return A.rawrigidbodyset_createRigidBody(this.__wbg_ptr, I2, g2.__wbg_ptr, C2.__wbg_ptr, B2, Q2, E2, i2.__wbg_ptr, D2.__wbg_ptr, o2.__wbg_ptr, G2.__wbg_ptr, w2.__wbg_ptr, S2, k2, a2, K2, h2, J2, y2, M2, N2, F2, R2, q2, s2, c2, Y2);
  }
  remove(I2, g2, C2, B2, Q2) {
    U(g2, m), U(C2, p), U(B2, W), U(Q2, V), A.rawrigidbodyset_remove(this.__wbg_ptr, I2, g2.__wbg_ptr, C2.__wbg_ptr, B2.__wbg_ptr, Q2.__wbg_ptr);
  }
  len() {
    return A.rawcolliderset_len(this.__wbg_ptr) >>> 0;
  }
  contains(I2) {
    return 0 !== A.rawrigidbodyset_contains(this.__wbg_ptr, I2);
  }
  forEachRigidBodyHandle(g2) {
    try {
      A.rawrigidbodyset_forEachRigidBodyHandle(this.__wbg_ptr, J(g2));
    } finally {
      I[h++] = void 0;
    }
  }
  propagateModifiedBodyPositionsToColliders(I2) {
    U(I2, p), A.rawrigidbodyset_propagateModifiedBodyPositionsToColliders(this.__wbg_ptr, I2.__wbg_ptr);
  }
}
class gA {
  static __wrap(A2) {
    A2 >>>= 0;
    const I2 = Object.create(gA.prototype);
    return I2.__wbg_ptr = A2, I2;
  }
  __destroy_into_raw() {
    const A2 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, A2;
  }
  free() {
    const I2 = this.__destroy_into_raw();
    A.__wbg_rawrotation_free(I2);
  }
  constructor(I2, g2, C2, B2) {
    const Q2 = A.rawrotation_new(I2, g2, C2, B2);
    return this.__wbg_ptr = Q2 >>> 0, this;
  }
  static identity() {
    const I2 = A.rawrotation_identity();
    return gA.__wrap(I2);
  }
  get x() {
    return A.rawrotation_x(this.__wbg_ptr);
  }
  get y() {
    return A.rawintegrationparameters_dt(this.__wbg_ptr);
  }
  get z() {
    return A.rawcollidershapecasthit_time_of_impact(this.__wbg_ptr);
  }
  get w() {
    return A.rawintegrationparameters_erp(this.__wbg_ptr);
  }
}
class CA {
  static __wrap(A2) {
    A2 >>>= 0;
    const I2 = Object.create(CA.prototype);
    return I2.__wbg_ptr = A2, I2;
  }
  __destroy_into_raw() {
    const A2 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, A2;
  }
  free() {
    const I2 = this.__destroy_into_raw();
    A.__wbg_rawsdpmatrix3_free(I2);
  }
  elements() {
    return Q(A.rawsdpmatrix3_elements(this.__wbg_ptr));
  }
}
class BA {
  __destroy_into_raw() {
    const A2 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, A2;
  }
  free() {
    const I2 = this.__destroy_into_raw();
    A.__wbg_rawserializationpipeline_free(I2);
  }
  constructor() {
    const I2 = A.rawserializationpipeline_new();
    return this.__wbg_ptr = I2 >>> 0, this;
  }
  serializeAll(I2, g2, C2, B2, E2, i2, D2, o2, G2) {
    U(I2, DA), U(g2, j), U(C2, m), U(B2, H), U(E2, X), U(i2, IA), U(D2, p), U(o2, W), U(G2, V);
    return Q(A.rawserializationpipeline_serializeAll(this.__wbg_ptr, I2.__wbg_ptr, g2.__wbg_ptr, C2.__wbg_ptr, B2.__wbg_ptr, E2.__wbg_ptr, i2.__wbg_ptr, D2.__wbg_ptr, o2.__wbg_ptr, G2.__wbg_ptr));
  }
  deserializeAll(I2) {
    const g2 = A.rawserializationpipeline_deserializeAll(this.__wbg_ptr, C(I2));
    return 0 === g2 ? void 0 : n.__wrap(g2);
  }
}
class QA {
  static __wrap(A2) {
    A2 >>>= 0;
    const I2 = Object.create(QA.prototype);
    return I2.__wbg_ptr = A2, I2;
  }
  __destroy_into_raw() {
    const A2 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, A2;
  }
  free() {
    const I2 = this.__destroy_into_raw();
    A.__wbg_rawshape_free(I2);
  }
  static cuboid(I2, g2, C2) {
    const B2 = A.rawshape_cuboid(I2, g2, C2);
    return QA.__wrap(B2);
  }
  static roundCuboid(I2, g2, C2, B2) {
    const Q2 = A.rawshape_roundCuboid(I2, g2, C2, B2);
    return QA.__wrap(Q2);
  }
  static ball(I2) {
    const g2 = A.rawshape_ball(I2);
    return QA.__wrap(g2);
  }
  static halfspace(I2) {
    U(I2, DA);
    const g2 = A.rawshape_halfspace(I2.__wbg_ptr);
    return QA.__wrap(g2);
  }
  static capsule(I2, g2) {
    const C2 = A.rawshape_capsule(I2, g2);
    return QA.__wrap(C2);
  }
  static cylinder(I2, g2) {
    const C2 = A.rawshape_cylinder(I2, g2);
    return QA.__wrap(C2);
  }
  static roundCylinder(I2, g2, C2) {
    const B2 = A.rawshape_roundCylinder(I2, g2, C2);
    return QA.__wrap(B2);
  }
  static cone(I2, g2) {
    const C2 = A.rawshape_cone(I2, g2);
    return QA.__wrap(C2);
  }
  static roundCone(I2, g2, C2) {
    const B2 = A.rawshape_roundCone(I2, g2, C2);
    return QA.__wrap(B2);
  }
  static polyline(I2, g2) {
    const C2 = R(I2, A.__wbindgen_malloc), B2 = F, Q2 = q(g2, A.__wbindgen_malloc), E2 = F, i2 = A.rawshape_polyline(C2, B2, Q2, E2);
    return QA.__wrap(i2);
  }
  static trimesh(I2, g2, C2) {
    const B2 = R(I2, A.__wbindgen_malloc), Q2 = F, E2 = q(g2, A.__wbindgen_malloc), i2 = F, D2 = A.rawshape_trimesh(B2, Q2, E2, i2, C2);
    return QA.__wrap(D2);
  }
  static heightfield(I2, g2, C2, B2, Q2) {
    const E2 = R(C2, A.__wbindgen_malloc), i2 = F;
    U(B2, DA);
    const D2 = A.rawshape_heightfield(I2, g2, E2, i2, B2.__wbg_ptr, Q2);
    return QA.__wrap(D2);
  }
  static segment(I2, g2) {
    U(I2, DA), U(g2, DA);
    const C2 = A.rawshape_segment(I2.__wbg_ptr, g2.__wbg_ptr);
    return QA.__wrap(C2);
  }
  static triangle(I2, g2, C2) {
    U(I2, DA), U(g2, DA), U(C2, DA);
    const B2 = A.rawshape_triangle(I2.__wbg_ptr, g2.__wbg_ptr, C2.__wbg_ptr);
    return QA.__wrap(B2);
  }
  static roundTriangle(I2, g2, C2, B2) {
    U(I2, DA), U(g2, DA), U(C2, DA);
    const Q2 = A.rawshape_roundTriangle(I2.__wbg_ptr, g2.__wbg_ptr, C2.__wbg_ptr, B2);
    return QA.__wrap(Q2);
  }
  static convexHull(I2) {
    const g2 = R(I2, A.__wbindgen_malloc), C2 = F, B2 = A.rawshape_convexHull(g2, C2);
    return 0 === B2 ? void 0 : QA.__wrap(B2);
  }
  static roundConvexHull(I2, g2) {
    const C2 = R(I2, A.__wbindgen_malloc), B2 = F, Q2 = A.rawshape_roundConvexHull(C2, B2, g2);
    return 0 === Q2 ? void 0 : QA.__wrap(Q2);
  }
  static convexMesh(I2, g2) {
    const C2 = R(I2, A.__wbindgen_malloc), B2 = F, Q2 = q(g2, A.__wbindgen_malloc), E2 = F, i2 = A.rawshape_convexMesh(C2, B2, Q2, E2);
    return 0 === i2 ? void 0 : QA.__wrap(i2);
  }
  static roundConvexMesh(I2, g2, C2) {
    const B2 = R(I2, A.__wbindgen_malloc), Q2 = F, E2 = q(g2, A.__wbindgen_malloc), i2 = F, D2 = A.rawshape_roundConvexMesh(B2, Q2, E2, i2, C2);
    return 0 === D2 ? void 0 : QA.__wrap(D2);
  }
  castShape(I2, g2, C2, B2, Q2, E2, i2, D2, o2, G2) {
    U(I2, DA), U(g2, gA), U(C2, DA), U(B2, QA), U(Q2, DA), U(E2, gA), U(i2, DA);
    const w2 = A.rawshape_castShape(this.__wbg_ptr, I2.__wbg_ptr, g2.__wbg_ptr, C2.__wbg_ptr, B2.__wbg_ptr, Q2.__wbg_ptr, E2.__wbg_ptr, i2.__wbg_ptr, D2, o2, G2);
    return 0 === w2 ? void 0 : EA.__wrap(w2);
  }
  intersectsShape(I2, g2, C2, B2, Q2) {
    U(I2, DA), U(g2, gA), U(C2, QA), U(B2, DA), U(Q2, gA);
    return 0 !== A.rawshape_intersectsShape(this.__wbg_ptr, I2.__wbg_ptr, g2.__wbg_ptr, C2.__wbg_ptr, B2.__wbg_ptr, Q2.__wbg_ptr);
  }
  contactShape(I2, g2, C2, B2, Q2, E2) {
    U(I2, DA), U(g2, gA), U(C2, QA), U(B2, DA), U(Q2, gA);
    const i2 = A.rawshape_contactShape(this.__wbg_ptr, I2.__wbg_ptr, g2.__wbg_ptr, C2.__wbg_ptr, B2.__wbg_ptr, Q2.__wbg_ptr, E2);
    return 0 === i2 ? void 0 : iA.__wrap(i2);
  }
  containsPoint(I2, g2, C2) {
    U(I2, DA), U(g2, gA), U(C2, DA);
    return 0 !== A.rawshape_containsPoint(this.__wbg_ptr, I2.__wbg_ptr, g2.__wbg_ptr, C2.__wbg_ptr);
  }
  projectPoint(I2, g2, C2, B2) {
    U(I2, DA), U(g2, gA), U(C2, DA);
    const Q2 = A.rawshape_projectPoint(this.__wbg_ptr, I2.__wbg_ptr, g2.__wbg_ptr, C2.__wbg_ptr, B2);
    return z.__wrap(Q2);
  }
  intersectsRay(I2, g2, C2, B2, Q2) {
    U(I2, DA), U(g2, gA), U(C2, DA), U(B2, DA);
    return 0 !== A.rawshape_intersectsRay(this.__wbg_ptr, I2.__wbg_ptr, g2.__wbg_ptr, C2.__wbg_ptr, B2.__wbg_ptr, Q2);
  }
  castRay(I2, g2, C2, B2, Q2, E2) {
    U(I2, DA), U(g2, gA), U(C2, DA), U(B2, DA);
    return A.rawshape_castRay(this.__wbg_ptr, I2.__wbg_ptr, g2.__wbg_ptr, C2.__wbg_ptr, B2.__wbg_ptr, Q2, E2);
  }
  castRayAndGetNormal(I2, g2, C2, B2, Q2, E2) {
    U(I2, DA), U(g2, gA), U(C2, DA), U(B2, DA);
    const i2 = A.rawshape_castRayAndGetNormal(this.__wbg_ptr, I2.__wbg_ptr, g2.__wbg_ptr, C2.__wbg_ptr, B2.__wbg_ptr, Q2, E2);
    return 0 === i2 ? void 0 : AA.__wrap(i2);
  }
}
class EA {
  static __wrap(A2) {
    A2 >>>= 0;
    const I2 = Object.create(EA.prototype);
    return I2.__wbg_ptr = A2, I2;
  }
  __destroy_into_raw() {
    const A2 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, A2;
  }
  free() {
    const I2 = this.__destroy_into_raw();
    A.__wbg_rawshapecasthit_free(I2);
  }
  time_of_impact() {
    return A.rawrotation_x(this.__wbg_ptr);
  }
  witness1() {
    const I2 = A.rawshapecasthit_witness1(this.__wbg_ptr);
    return DA.__wrap(I2);
  }
  witness2() {
    const I2 = A.rawcontactforceevent_total_force(this.__wbg_ptr);
    return DA.__wrap(I2);
  }
  normal1() {
    const I2 = A.rawshapecasthit_normal1(this.__wbg_ptr);
    return DA.__wrap(I2);
  }
  normal2() {
    const I2 = A.rawshapecasthit_normal2(this.__wbg_ptr);
    return DA.__wrap(I2);
  }
}
class iA {
  static __wrap(A2) {
    A2 >>>= 0;
    const I2 = Object.create(iA.prototype);
    return I2.__wbg_ptr = A2, I2;
  }
  __destroy_into_raw() {
    const A2 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, A2;
  }
  free() {
    const I2 = this.__destroy_into_raw();
    A.__wbg_rawshapecontact_free(I2);
  }
  distance() {
    return A.rawkinematiccharactercontroller_maxSlopeClimbAngle(this.__wbg_ptr);
  }
  point1() {
    const I2 = A.rawpointprojection_point(this.__wbg_ptr);
    return DA.__wrap(I2);
  }
  point2() {
    const I2 = A.rawcollidershapecasthit_witness1(this.__wbg_ptr);
    return DA.__wrap(I2);
  }
  normal1() {
    const I2 = A.rawcollidershapecasthit_witness2(this.__wbg_ptr);
    return DA.__wrap(I2);
  }
  normal2() {
    const I2 = A.rawcharactercollision_translationDeltaApplied(this.__wbg_ptr);
    return DA.__wrap(I2);
  }
}
class DA {
  static __wrap(A2) {
    A2 >>>= 0;
    const I2 = Object.create(DA.prototype);
    return I2.__wbg_ptr = A2, I2;
  }
  __destroy_into_raw() {
    const A2 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, A2;
  }
  free() {
    const I2 = this.__destroy_into_raw();
    A.__wbg_rawvector_free(I2);
  }
  static zero() {
    const I2 = A.rawvector_zero();
    return DA.__wrap(I2);
  }
  constructor(I2, g2, C2) {
    const B2 = A.rawvector_new(I2, g2, C2);
    return this.__wbg_ptr = B2 >>> 0, this;
  }
  get x() {
    return A.rawrotation_x(this.__wbg_ptr);
  }
  set x(I2) {
    A.rawvector_set_x(this.__wbg_ptr, I2);
  }
  get y() {
    return A.rawintegrationparameters_dt(this.__wbg_ptr);
  }
  set y(I2) {
    A.rawintegrationparameters_set_dt(this.__wbg_ptr, I2);
  }
  get z() {
    return A.rawcollidershapecasthit_time_of_impact(this.__wbg_ptr);
  }
  set z(I2) {
    A.rawvector_set_z(this.__wbg_ptr, I2);
  }
  xyz() {
    const I2 = A.rawvector_xyz(this.__wbg_ptr);
    return DA.__wrap(I2);
  }
  yxz() {
    const I2 = A.rawvector_yxz(this.__wbg_ptr);
    return DA.__wrap(I2);
  }
  zxy() {
    const I2 = A.rawvector_zxy(this.__wbg_ptr);
    return DA.__wrap(I2);
  }
  xzy() {
    const I2 = A.rawvector_xzy(this.__wbg_ptr);
    return DA.__wrap(I2);
  }
  yzx() {
    const I2 = A.rawvector_yzx(this.__wbg_ptr);
    return DA.__wrap(I2);
  }
  zyx() {
    const I2 = A.rawvector_zyx(this.__wbg_ptr);
    return DA.__wrap(I2);
  }
}
async function oA(I2) {
  if (void 0 !== A)
    return A;
  void 0 === I2 && (I2 = new URL("rapier_wasm3d_bg.wasm", "<deleted>"));
  const g2 = function() {
    const I3 = { wbg: {} };
    return I3.wbg.__wbindgen_number_new = function(A2) {
      return C(A2);
    }, I3.wbg.__wbindgen_boolean_get = function(A2) {
      const I4 = B(A2);
      return "boolean" == typeof I4 ? I4 ? 1 : 0 : 2;
    }, I3.wbg.__wbindgen_object_drop_ref = function(A2) {
      Q(A2);
    }, I3.wbg.__wbindgen_number_get = function(A2, I4) {
      const g3 = B(I4), C2 = "number" == typeof g3 ? g3 : void 0;
      D()[A2 / 8 + 1] = E(C2) ? 0 : C2, G()[A2 / 4 + 0] = !E(C2);
    }, I3.wbg.__wbindgen_is_function = function(A2) {
      return "function" == typeof B(A2);
    }, I3.wbg.__wbg_rawraycolliderintersection_new = function(A2) {
      return C($.__wrap(A2));
    }, I3.wbg.__wbg_rawcontactforceevent_new = function(A2) {
      return C(r.__wrap(A2));
    }, I3.wbg.__wbg_call_01734de55d61e11d = function() {
      return s(function(A2, I4, g3) {
        return C(B(A2).call(B(I4), B(g3)));
      }, arguments);
    }, I3.wbg.__wbg_call_4c92f6aec1e1d6e6 = function() {
      return s(function(A2, I4, g3, Q2) {
        return C(B(A2).call(B(I4), B(g3), B(Q2)));
      }, arguments);
    }, I3.wbg.__wbg_call_776890ca77946e2f = function() {
      return s(function(A2, I4, g3, Q2, E2) {
        return C(B(A2).call(B(I4), B(g3), B(Q2), B(E2)));
      }, arguments);
    }, I3.wbg.__wbg_bind_60a9a80cada2f33c = function(A2, I4, g3, Q2) {
      return C(B(A2).bind(B(I4), B(g3), B(Q2)));
    }, I3.wbg.__wbg_buffer_085ec1f694018c4f = function(A2) {
      return C(B(A2).buffer);
    }, I3.wbg.__wbg_newwithbyteoffsetandlength_6da8e527659b86aa = function(A2, I4, g3) {
      return C(new Uint8Array(B(A2), I4 >>> 0, g3 >>> 0));
    }, I3.wbg.__wbg_new_8125e318e6245eed = function(A2) {
      return C(new Uint8Array(B(A2)));
    }, I3.wbg.__wbg_set_5cf90238115182c3 = function(A2, I4, g3) {
      B(A2).set(B(I4), g3 >>> 0);
    }, I3.wbg.__wbg_length_72e2208bbc0efc61 = function(A2) {
      return B(A2).length;
    }, I3.wbg.__wbg_newwithbyteoffsetandlength_69193e31c844b792 = function(A2, I4, g3) {
      return C(new Float32Array(B(A2), I4 >>> 0, g3 >>> 0));
    }, I3.wbg.__wbg_set_6146c51d49a2c0df = function(A2, I4, g3) {
      B(A2).set(B(I4), g3 >>> 0);
    }, I3.wbg.__wbg_length_d7327c75a759af37 = function(A2) {
      return B(A2).length;
    }, I3.wbg.__wbg_newwithlength_68d29ab115d0099c = function(A2) {
      return C(new Float32Array(A2 >>> 0));
    }, I3.wbg.__wbindgen_throw = function(A2, I4) {
      throw new Error(k(A2, I4));
    }, I3.wbg.__wbindgen_memory = function() {
      return C(A.memory);
    }, I3;
  }();
  ("string" == typeof I2 || "function" == typeof Request && I2 instanceof Request || "function" == typeof URL && I2 instanceof URL) && (I2 = fetch(I2));
  const { instance: w2, module: U2 } = await async function(A2, I3) {
    if ("function" == typeof Response && A2 instanceof Response) {
      if ("function" == typeof WebAssembly.instantiateStreaming)
        try {
          return await WebAssembly.instantiateStreaming(A2, I3);
        } catch (I4) {
          if ("application/wasm" == A2.headers.get("Content-Type"))
            throw I4;
          console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", I4);
        }
      const g3 = await A2.arrayBuffer();
      return await WebAssembly.instantiate(g3, I3);
    }
    {
      const g3 = await WebAssembly.instantiate(A2, I3);
      return g3 instanceof WebAssembly.Instance ? { instance: g3, module: A2 } : g3;
    }
  }(await I2, g2);
  return function(I3, g3) {
    return A = I3.exports, oA.__wbindgen_wasm_module = g3, a = null, i = null, o = null, M = null, S = null, A;
  }(w2, U2);
}
class GA {
  constructor(A2, I2, g2) {
    this.x = A2, this.y = I2, this.z = g2;
  }
}
class wA {
  static new(A2, I2, g2) {
    return new GA(A2, I2, g2);
  }
  static intoRaw(A2) {
    return new DA(A2.x, A2.y, A2.z);
  }
  static zeros() {
    return wA.new(0, 0, 0);
  }
  static fromRaw(A2) {
    if (!A2)
      return null;
    let I2 = wA.new(A2.x, A2.y, A2.z);
    return A2.free(), I2;
  }
  static copy(A2, I2) {
    A2.x = I2.x, A2.y = I2.y, A2.z = I2.z;
  }
}
class SA {
  constructor(A2, I2, g2, C2) {
    this.x = A2, this.y = I2, this.z = g2, this.w = C2;
  }
}
class kA {
  static identity() {
    return new SA(0, 0, 0, 1);
  }
  static fromRaw(A2) {
    if (!A2)
      return null;
    let I2 = new SA(A2.x, A2.y, A2.z, A2.w);
    return A2.free(), I2;
  }
  static intoRaw(A2) {
    return new gA(A2.x, A2.y, A2.z, A2.w);
  }
  static copy(A2, I2) {
    A2.x = I2.x, A2.y = I2.y, A2.z = I2.z, A2.w = I2.w;
  }
}
class UA {
  constructor(A2) {
    this.elements = A2;
  }
  get m11() {
    return this.elements[0];
  }
  get m12() {
    return this.elements[1];
  }
  get m21() {
    return this.m12;
  }
  get m13() {
    return this.elements[2];
  }
  get m31() {
    return this.m13;
  }
  get m22() {
    return this.elements[3];
  }
  get m23() {
    return this.elements[4];
  }
  get m32() {
    return this.m23;
  }
  get m33() {
    return this.elements[5];
  }
}
class aA {
  static fromRaw(A2) {
    const I2 = new UA(A2.elements());
    return A2.free(), I2;
  }
}
var KA, hA, JA, yA, MA, NA, FA, RA, qA, sA, cA, YA, lA, HA, LA;
!function(A2) {
  A2[A2.Dynamic = 0] = "Dynamic", A2[A2.Fixed = 1] = "Fixed", A2[A2.KinematicPositionBased = 2] = "KinematicPositionBased", A2[A2.KinematicVelocityBased = 3] = "KinematicVelocityBased";
}(KA || (KA = {}));
class tA {
  constructor(A2, I2, g2) {
    this.rawSet = A2, this.colliderSet = I2, this.handle = g2;
  }
  finalizeDeserialization(A2) {
    this.colliderSet = A2;
  }
  isValid() {
    return this.rawSet.contains(this.handle);
  }
  lockTranslations(A2, I2) {
    return this.rawSet.rbLockTranslations(this.handle, A2, I2);
  }
  lockRotations(A2, I2) {
    return this.rawSet.rbLockRotations(this.handle, A2, I2);
  }
  setEnabledTranslations(A2, I2, g2, C2) {
    return this.rawSet.rbSetEnabledTranslations(this.handle, A2, I2, g2, C2);
  }
  restrictTranslations(A2, I2, g2, C2) {
    this.setEnabledTranslations(A2, I2, g2, C2);
  }
  setEnabledRotations(A2, I2, g2, C2) {
    return this.rawSet.rbSetEnabledRotations(this.handle, A2, I2, g2, C2);
  }
  restrictRotations(A2, I2, g2, C2) {
    this.setEnabledRotations(A2, I2, g2, C2);
  }
  dominanceGroup() {
    return this.rawSet.rbDominanceGroup(this.handle);
  }
  setDominanceGroup(A2) {
    this.rawSet.rbSetDominanceGroup(this.handle, A2);
  }
  additionalSolverIterations() {
    return this.rawSet.rbAdditionalSolverIterations(this.handle);
  }
  setAdditionalSolverIterations(A2) {
    this.rawSet.rbSetAdditionalSolverIterations(this.handle, A2);
  }
  enableCcd(A2) {
    this.rawSet.rbEnableCcd(this.handle, A2);
  }
  setSoftCcdPrediction(A2) {
    this.rawSet.rbSetSoftCcdPrediction(this.handle, A2);
  }
  softCcdPrediction() {
    return this.rawSet.rbSoftCcdPrediction(this.handle);
  }
  translation() {
    let A2 = this.rawSet.rbTranslation(this.handle);
    return wA.fromRaw(A2);
  }
  rotation() {
    let A2 = this.rawSet.rbRotation(this.handle);
    return kA.fromRaw(A2);
  }
  nextTranslation() {
    let A2 = this.rawSet.rbNextTranslation(this.handle);
    return wA.fromRaw(A2);
  }
  nextRotation() {
    let A2 = this.rawSet.rbNextRotation(this.handle);
    return kA.fromRaw(A2);
  }
  setTranslation(A2, I2) {
    this.rawSet.rbSetTranslation(this.handle, A2.x, A2.y, A2.z, I2);
  }
  setLinvel(A2, I2) {
    let g2 = wA.intoRaw(A2);
    this.rawSet.rbSetLinvel(this.handle, g2, I2), g2.free();
  }
  gravityScale() {
    return this.rawSet.rbGravityScale(this.handle);
  }
  setGravityScale(A2, I2) {
    this.rawSet.rbSetGravityScale(this.handle, A2, I2);
  }
  setRotation(A2, I2) {
    this.rawSet.rbSetRotation(this.handle, A2.x, A2.y, A2.z, A2.w, I2);
  }
  setAngvel(A2, I2) {
    let g2 = wA.intoRaw(A2);
    this.rawSet.rbSetAngvel(this.handle, g2, I2), g2.free();
  }
  setNextKinematicTranslation(A2) {
    this.rawSet.rbSetNextKinematicTranslation(this.handle, A2.x, A2.y, A2.z);
  }
  setNextKinematicRotation(A2) {
    this.rawSet.rbSetNextKinematicRotation(this.handle, A2.x, A2.y, A2.z, A2.w);
  }
  linvel() {
    return wA.fromRaw(this.rawSet.rbLinvel(this.handle));
  }
  angvel() {
    return wA.fromRaw(this.rawSet.rbAngvel(this.handle));
  }
  mass() {
    return this.rawSet.rbMass(this.handle);
  }
  effectiveInvMass() {
    return wA.fromRaw(this.rawSet.rbEffectiveInvMass(this.handle));
  }
  invMass() {
    return this.rawSet.rbInvMass(this.handle);
  }
  localCom() {
    return wA.fromRaw(this.rawSet.rbLocalCom(this.handle));
  }
  worldCom() {
    return wA.fromRaw(this.rawSet.rbWorldCom(this.handle));
  }
  invPrincipalInertiaSqrt() {
    return wA.fromRaw(this.rawSet.rbInvPrincipalInertiaSqrt(this.handle));
  }
  principalInertia() {
    return wA.fromRaw(this.rawSet.rbPrincipalInertia(this.handle));
  }
  principalInertiaLocalFrame() {
    return kA.fromRaw(this.rawSet.rbPrincipalInertiaLocalFrame(this.handle));
  }
  effectiveWorldInvInertiaSqrt() {
    return aA.fromRaw(this.rawSet.rbEffectiveWorldInvInertiaSqrt(this.handle));
  }
  effectiveAngularInertia() {
    return aA.fromRaw(this.rawSet.rbEffectiveAngularInertia(this.handle));
  }
  sleep() {
    this.rawSet.rbSleep(this.handle);
  }
  wakeUp() {
    this.rawSet.rbWakeUp(this.handle);
  }
  isCcdEnabled() {
    return this.rawSet.rbIsCcdEnabled(this.handle);
  }
  numColliders() {
    return this.rawSet.rbNumColliders(this.handle);
  }
  collider(A2) {
    return this.colliderSet.get(this.rawSet.rbCollider(this.handle, A2));
  }
  setEnabled(A2) {
    this.rawSet.rbSetEnabled(this.handle, A2);
  }
  isEnabled() {
    return this.rawSet.rbIsEnabled(this.handle);
  }
  bodyType() {
    return this.rawSet.rbBodyType(this.handle);
  }
  setBodyType(A2, I2) {
    return this.rawSet.rbSetBodyType(this.handle, A2, I2);
  }
  isSleeping() {
    return this.rawSet.rbIsSleeping(this.handle);
  }
  isMoving() {
    return this.rawSet.rbIsMoving(this.handle);
  }
  isFixed() {
    return this.rawSet.rbIsFixed(this.handle);
  }
  isKinematic() {
    return this.rawSet.rbIsKinematic(this.handle);
  }
  isDynamic() {
    return this.rawSet.rbIsDynamic(this.handle);
  }
  linearDamping() {
    return this.rawSet.rbLinearDamping(this.handle);
  }
  angularDamping() {
    return this.rawSet.rbAngularDamping(this.handle);
  }
  setLinearDamping(A2) {
    this.rawSet.rbSetLinearDamping(this.handle, A2);
  }
  recomputeMassPropertiesFromColliders() {
    this.rawSet.rbRecomputeMassPropertiesFromColliders(this.handle, this.colliderSet.raw);
  }
  setAdditionalMass(A2, I2) {
    this.rawSet.rbSetAdditionalMass(this.handle, A2, I2);
  }
  setAdditionalMassProperties(A2, I2, g2, C2, B2) {
    let Q2 = wA.intoRaw(I2), E2 = wA.intoRaw(g2), i2 = kA.intoRaw(C2);
    this.rawSet.rbSetAdditionalMassProperties(this.handle, A2, Q2, E2, i2, B2), Q2.free(), E2.free(), i2.free();
  }
  setAngularDamping(A2) {
    this.rawSet.rbSetAngularDamping(this.handle, A2);
  }
  resetForces(A2) {
    this.rawSet.rbResetForces(this.handle, A2);
  }
  resetTorques(A2) {
    this.rawSet.rbResetTorques(this.handle, A2);
  }
  addForce(A2, I2) {
    const g2 = wA.intoRaw(A2);
    this.rawSet.rbAddForce(this.handle, g2, I2), g2.free();
  }
  applyImpulse(A2, I2) {
    const g2 = wA.intoRaw(A2);
    this.rawSet.rbApplyImpulse(this.handle, g2, I2), g2.free();
  }
  addTorque(A2, I2) {
    const g2 = wA.intoRaw(A2);
    this.rawSet.rbAddTorque(this.handle, g2, I2), g2.free();
  }
  applyTorqueImpulse(A2, I2) {
    const g2 = wA.intoRaw(A2);
    this.rawSet.rbApplyTorqueImpulse(this.handle, g2, I2), g2.free();
  }
  addForceAtPoint(A2, I2, g2) {
    const C2 = wA.intoRaw(A2), B2 = wA.intoRaw(I2);
    this.rawSet.rbAddForceAtPoint(this.handle, C2, B2, g2), C2.free(), B2.free();
  }
  applyImpulseAtPoint(A2, I2, g2) {
    const C2 = wA.intoRaw(A2), B2 = wA.intoRaw(I2);
    this.rawSet.rbApplyImpulseAtPoint(this.handle, C2, B2, g2), C2.free(), B2.free();
  }
}
class pA {
  constructor(A2) {
    this.enabled = true, this.status = A2, this.translation = wA.zeros(), this.rotation = kA.identity(), this.gravityScale = 1, this.linvel = wA.zeros(), this.mass = 0, this.massOnly = false, this.centerOfMass = wA.zeros(), this.translationsEnabledX = true, this.translationsEnabledY = true, this.angvel = wA.zeros(), this.principalAngularInertia = wA.zeros(), this.angularInertiaLocalFrame = kA.identity(), this.translationsEnabledZ = true, this.rotationsEnabledX = true, this.rotationsEnabledY = true, this.rotationsEnabledZ = true, this.linearDamping = 0, this.angularDamping = 0, this.canSleep = true, this.sleeping = false, this.ccdEnabled = false, this.softCcdPrediction = 0, this.dominanceGroup = 0, this.additionalSolverIterations = 0;
  }
  static dynamic() {
    return new pA(KA.Dynamic);
  }
  static kinematicPositionBased() {
    return new pA(KA.KinematicPositionBased);
  }
  static kinematicVelocityBased() {
    return new pA(KA.KinematicVelocityBased);
  }
  static fixed() {
    return new pA(KA.Fixed);
  }
  static newDynamic() {
    return new pA(KA.Dynamic);
  }
  static newKinematicPositionBased() {
    return new pA(KA.KinematicPositionBased);
  }
  static newKinematicVelocityBased() {
    return new pA(KA.KinematicVelocityBased);
  }
  static newStatic() {
    return new pA(KA.Fixed);
  }
  setDominanceGroup(A2) {
    return this.dominanceGroup = A2, this;
  }
  setAdditionalSolverIterations(A2) {
    return this.additionalSolverIterations = A2, this;
  }
  setEnabled(A2) {
    return this.enabled = A2, this;
  }
  setTranslation(A2, I2, g2) {
    if ("number" != typeof A2 || "number" != typeof I2 || "number" != typeof g2)
      throw TypeError("The translation components must be numbers.");
    return this.translation = { x: A2, y: I2, z: g2 }, this;
  }
  setRotation(A2) {
    return kA.copy(this.rotation, A2), this;
  }
  setGravityScale(A2) {
    return this.gravityScale = A2, this;
  }
  setAdditionalMass(A2) {
    return this.mass = A2, this.massOnly = true, this;
  }
  setLinvel(A2, I2, g2) {
    if ("number" != typeof A2 || "number" != typeof I2 || "number" != typeof g2)
      throw TypeError("The linvel components must be numbers.");
    return this.linvel = { x: A2, y: I2, z: g2 }, this;
  }
  setAngvel(A2) {
    return wA.copy(this.angvel, A2), this;
  }
  setAdditionalMassProperties(A2, I2, g2, C2) {
    return this.mass = A2, wA.copy(this.centerOfMass, I2), wA.copy(this.principalAngularInertia, g2), kA.copy(this.angularInertiaLocalFrame, C2), this.massOnly = false, this;
  }
  enabledTranslations(A2, I2, g2) {
    return this.translationsEnabledX = A2, this.translationsEnabledY = I2, this.translationsEnabledZ = g2, this;
  }
  restrictTranslations(A2, I2, g2) {
    return this.enabledTranslations(A2, I2, g2);
  }
  lockTranslations() {
    return this.enabledTranslations(false, false, false);
  }
  enabledRotations(A2, I2, g2) {
    return this.rotationsEnabledX = A2, this.rotationsEnabledY = I2, this.rotationsEnabledZ = g2, this;
  }
  restrictRotations(A2, I2, g2) {
    return this.enabledRotations(A2, I2, g2);
  }
  lockRotations() {
    return this.restrictRotations(false, false, false);
  }
  setLinearDamping(A2) {
    return this.linearDamping = A2, this;
  }
  setAngularDamping(A2) {
    return this.angularDamping = A2, this;
  }
  setCanSleep(A2) {
    return this.canSleep = A2, this;
  }
  setSleeping(A2) {
    return this.sleeping = A2, this;
  }
  setCcdEnabled(A2) {
    return this.ccdEnabled = A2, this;
  }
  setSoftCcdPrediction(A2) {
    return this.softCcdPrediction = A2, this;
  }
  setUserData(A2) {
    return this.userData = A2, this;
  }
}
class eA {
  constructor() {
    this.fconv = new Float64Array(1), this.uconv = new Uint32Array(this.fconv.buffer), this.data = new Array(), this.size = 0;
  }
  set(A2, I2) {
    let g2 = this.index(A2);
    for (; this.data.length <= g2; )
      this.data.push(null);
    null == this.data[g2] && (this.size += 1), this.data[g2] = I2;
  }
  len() {
    return this.size;
  }
  delete(A2) {
    let I2 = this.index(A2);
    I2 < this.data.length && (null != this.data[I2] && (this.size -= 1), this.data[I2] = null);
  }
  clear() {
    this.data = new Array();
  }
  get(A2) {
    let I2 = this.index(A2);
    return I2 < this.data.length ? this.data[I2] : null;
  }
  forEach(A2) {
    for (const I2 of this.data)
      null != I2 && A2(I2);
  }
  getAll() {
    return this.data.filter((A2) => null != A2);
  }
  index(A2) {
    return this.fconv[0] = A2, this.uconv[0];
  }
}
class rA {
  constructor(A2) {
    this.raw = A2 || new IA(), this.map = new eA(), A2 && A2.forEachRigidBodyHandle((I2) => {
      this.map.set(I2, new tA(A2, null, I2));
    });
  }
  free() {
    this.raw && this.raw.free(), this.raw = void 0, this.map && this.map.clear(), this.map = void 0;
  }
  finalizeDeserialization(A2) {
    this.map.forEach((I2) => I2.finalizeDeserialization(A2));
  }
  createRigidBody(A2, I2) {
    let g2 = wA.intoRaw(I2.translation), C2 = kA.intoRaw(I2.rotation), B2 = wA.intoRaw(I2.linvel), Q2 = wA.intoRaw(I2.centerOfMass), E2 = wA.intoRaw(I2.angvel), i2 = wA.intoRaw(I2.principalAngularInertia), D2 = kA.intoRaw(I2.angularInertiaLocalFrame), o2 = this.raw.createRigidBody(I2.enabled, g2, C2, I2.gravityScale, I2.mass, I2.massOnly, Q2, B2, E2, i2, D2, I2.translationsEnabledX, I2.translationsEnabledY, I2.translationsEnabledZ, I2.rotationsEnabledX, I2.rotationsEnabledY, I2.rotationsEnabledZ, I2.linearDamping, I2.angularDamping, I2.status, I2.canSleep, I2.sleeping, I2.softCcdPrediction, I2.ccdEnabled, I2.dominanceGroup, I2.additionalSolverIterations);
    g2.free(), C2.free(), B2.free(), Q2.free(), E2.free(), i2.free(), D2.free();
    const G2 = new tA(this.raw, A2, o2);
    return G2.userData = I2.userData, this.map.set(o2, G2), G2;
  }
  remove(A2, I2, g2, C2, B2) {
    for (let I3 = 0; I3 < this.raw.rbNumColliders(A2); I3 += 1)
      g2.unmap(this.raw.rbCollider(A2, I3));
    C2.forEachJointHandleAttachedToRigidBody(A2, (A3) => C2.unmap(A3)), B2.forEachJointHandleAttachedToRigidBody(A2, (A3) => B2.unmap(A3)), this.raw.remove(A2, I2.raw, g2.raw, C2.raw, B2.raw), this.map.delete(A2);
  }
  len() {
    return this.map.len();
  }
  contains(A2) {
    return null != this.get(A2);
  }
  get(A2) {
    return this.map.get(A2);
  }
  forEach(A2) {
    this.map.forEach(A2);
  }
  forEachActiveRigidBody(A2, I2) {
    A2.forEachActiveRigidBodyHandle((A3) => {
      I2(this.get(A3));
    });
  }
  getAll() {
    return this.map.getAll();
  }
}
class dA {
  constructor(A2) {
    this.raw = A2 || new j();
  }
  free() {
    this.raw && this.raw.free(), this.raw = void 0;
  }
  get dt() {
    return this.raw.dt;
  }
  get erp() {
    return this.raw.erp;
  }
  get lengthUnit() {
    return this.raw.lengthUnit;
  }
  get normalizedAllowedLinearError() {
    return this.raw.normalizedAllowedLinearError;
  }
  get normalizedPredictionDistance() {
    return this.raw.normalizedPredictionDistance;
  }
  get numSolverIterations() {
    return this.raw.numSolverIterations;
  }
  get numAdditionalFrictionIterations() {
    return this.raw.numAdditionalFrictionIterations;
  }
  get numInternalPgsIterations() {
    return this.raw.numInternalPgsIterations;
  }
  get minIslandSize() {
    return this.raw.minIslandSize;
  }
  get maxCcdSubsteps() {
    return this.raw.maxCcdSubsteps;
  }
  set dt(A2) {
    this.raw.dt = A2;
  }
  set erp(A2) {
    this.raw.erp = A2;
  }
  set lengthUnit(A2) {
    this.raw.lengthUnit = A2;
  }
  set normalizedAllowedLinearError(A2) {
    this.raw.normalizedAllowedLinearError = A2;
  }
  set normalizedPredictionDistance(A2) {
    this.raw.normalizedPredictionDistance = A2;
  }
  set numSolverIterations(A2) {
    this.raw.numSolverIterations = A2;
  }
  set numAdditionalFrictionIterations(A2) {
    this.raw.numAdditionalFrictionIterations = A2;
  }
  set numInternalPgsIterations(A2) {
    this.raw.numInternalPgsIterations = A2;
  }
  set minIslandSize(A2) {
    this.raw.minIslandSize = A2;
  }
  set maxCcdSubsteps(A2) {
    this.raw.maxCcdSubsteps = A2;
  }
  switchToStandardPgsSolver() {
    this.raw.switchToStandardPgsSolver();
  }
  switchToSmallStepsPgsSolver() {
    this.raw.switchToSmallStepsPgsSolver();
  }
  switchToSmallStepsPgsSolverWithoutWarmstart() {
    this.raw.switchToSmallStepsPgsSolverWithoutWarmstart();
  }
}
!function(A2) {
  A2[A2.Revolute = 0] = "Revolute", A2[A2.Fixed = 1] = "Fixed", A2[A2.Prismatic = 2] = "Prismatic", A2[A2.Rope = 3] = "Rope", A2[A2.Spring = 4] = "Spring", A2[A2.Spherical = 5] = "Spherical", A2[A2.Generic = 6] = "Generic";
}(hA || (hA = {})), function(A2) {
  A2[A2.AccelerationBased = 0] = "AccelerationBased", A2[A2.ForceBased = 1] = "ForceBased";
}(JA || (JA = {})), function(A2) {
  A2[A2.X = 1] = "X", A2[A2.Y = 2] = "Y", A2[A2.Z = 4] = "Z", A2[A2.AngX = 8] = "AngX", A2[A2.AngY = 16] = "AngY", A2[A2.AngZ = 32] = "AngZ";
}(yA || (yA = {}));
class TA {
  constructor(A2, I2, g2) {
    this.rawSet = A2, this.bodySet = I2, this.handle = g2;
  }
  static newTyped(A2, I2, g2) {
    switch (A2.jointType(g2)) {
      case l.Revolute:
        return new WA(A2, I2, g2);
      case l.Prismatic:
        return new xA(A2, I2, g2);
      case l.Fixed:
        return new nA(A2, I2, g2);
      case l.Spring:
        return new bA(A2, I2, g2);
      case l.Rope:
        return new ZA(A2, I2, g2);
      case l.Spherical:
        return new mA(A2, I2, g2);
      case l.Generic:
        return new jA(A2, I2, g2);
      default:
        return new TA(A2, I2, g2);
    }
  }
  finalizeDeserialization(A2) {
    this.bodySet = A2;
  }
  isValid() {
    return this.rawSet.contains(this.handle);
  }
  body1() {
    return this.bodySet.get(this.rawSet.jointBodyHandle1(this.handle));
  }
  body2() {
    return this.bodySet.get(this.rawSet.jointBodyHandle2(this.handle));
  }
  type() {
    return this.rawSet.jointType(this.handle);
  }
  frameX1() {
    return kA.fromRaw(this.rawSet.jointFrameX1(this.handle));
  }
  frameX2() {
    return kA.fromRaw(this.rawSet.jointFrameX2(this.handle));
  }
  anchor1() {
    return wA.fromRaw(this.rawSet.jointAnchor1(this.handle));
  }
  anchor2() {
    return wA.fromRaw(this.rawSet.jointAnchor2(this.handle));
  }
  setAnchor1(A2) {
    const I2 = wA.intoRaw(A2);
    this.rawSet.jointSetAnchor1(this.handle, I2), I2.free();
  }
  setAnchor2(A2) {
    const I2 = wA.intoRaw(A2);
    this.rawSet.jointSetAnchor2(this.handle, I2), I2.free();
  }
  setContactsEnabled(A2) {
    this.rawSet.jointSetContactsEnabled(this.handle, A2);
  }
  contactsEnabled() {
    return this.rawSet.jointContactsEnabled(this.handle);
  }
}
class OA extends TA {
  limitsEnabled() {
    return this.rawSet.jointLimitsEnabled(this.handle, this.rawAxis());
  }
  limitsMin() {
    return this.rawSet.jointLimitsMin(this.handle, this.rawAxis());
  }
  limitsMax() {
    return this.rawSet.jointLimitsMax(this.handle, this.rawAxis());
  }
  setLimits(A2, I2) {
    this.rawSet.jointSetLimits(this.handle, this.rawAxis(), A2, I2);
  }
  configureMotorModel(A2) {
    this.rawSet.jointConfigureMotorModel(this.handle, this.rawAxis(), A2);
  }
  configureMotorVelocity(A2, I2) {
    this.rawSet.jointConfigureMotorVelocity(this.handle, this.rawAxis(), A2, I2);
  }
  configureMotorPosition(A2, I2, g2) {
    this.rawSet.jointConfigureMotorPosition(this.handle, this.rawAxis(), A2, I2, g2);
  }
  configureMotor(A2, I2, g2, C2) {
    this.rawSet.jointConfigureMotor(this.handle, this.rawAxis(), A2, I2, g2, C2);
  }
}
class nA extends TA {
}
class ZA extends TA {
}
class bA extends TA {
}
class xA extends OA {
  rawAxis() {
    return Y.X;
  }
}
class WA extends OA {
  rawAxis() {
    return Y.AngX;
  }
}
class jA extends TA {
}
class mA extends TA {
}
class fA {
  constructor() {
  }
  static fixed(A2, I2, g2, C2) {
    let B2 = new fA();
    return B2.anchor1 = A2, B2.anchor2 = g2, B2.frame1 = I2, B2.frame2 = C2, B2.jointType = hA.Fixed, B2;
  }
  static spring(A2, I2, g2, C2, B2) {
    let Q2 = new fA();
    return Q2.anchor1 = C2, Q2.anchor2 = B2, Q2.length = A2, Q2.stiffness = I2, Q2.damping = g2, Q2.jointType = hA.Spring, Q2;
  }
  static rope(A2, I2, g2) {
    let C2 = new fA();
    return C2.anchor1 = I2, C2.anchor2 = g2, C2.length = A2, C2.jointType = hA.Rope, C2;
  }
  static generic(A2, I2, g2, C2) {
    let B2 = new fA();
    return B2.anchor1 = A2, B2.anchor2 = I2, B2.axis = g2, B2.axesMask = C2, B2.jointType = hA.Generic, B2;
  }
  static spherical(A2, I2) {
    let g2 = new fA();
    return g2.anchor1 = A2, g2.anchor2 = I2, g2.jointType = hA.Spherical, g2;
  }
  static prismatic(A2, I2, g2) {
    let C2 = new fA();
    return C2.anchor1 = A2, C2.anchor2 = I2, C2.axis = g2, C2.jointType = hA.Prismatic, C2;
  }
  static revolute(A2, I2, g2) {
    let C2 = new fA();
    return C2.anchor1 = A2, C2.anchor2 = I2, C2.axis = g2, C2.jointType = hA.Revolute, C2;
  }
  intoRaw() {
    let A2, I2, g2 = wA.intoRaw(this.anchor1), C2 = wA.intoRaw(this.anchor2), B2 = false, Q2 = 0, E2 = 0;
    switch (this.jointType) {
      case hA.Fixed:
        let i2 = kA.intoRaw(this.frame1), D2 = kA.intoRaw(this.frame2);
        I2 = x.fixed(g2, i2, C2, D2), i2.free(), D2.free();
        break;
      case hA.Spring:
        I2 = x.spring(this.length, this.stiffness, this.damping, g2, C2);
        break;
      case hA.Rope:
        I2 = x.rope(this.length, g2, C2);
        break;
      case hA.Prismatic:
        A2 = wA.intoRaw(this.axis), this.limitsEnabled && (B2 = true, Q2 = this.limits[0], E2 = this.limits[1]), I2 = x.prismatic(g2, C2, A2, B2, Q2, E2), A2.free();
        break;
      case hA.Generic:
        A2 = wA.intoRaw(this.axis);
        let o2 = this.axesMask;
        I2 = x.generic(g2, C2, A2, o2);
        break;
      case hA.Spherical:
        I2 = x.spherical(g2, C2);
        break;
      case hA.Revolute:
        A2 = wA.intoRaw(this.axis), I2 = x.revolute(g2, C2, A2), A2.free();
    }
    return g2.free(), C2.free(), I2;
  }
}
class VA {
  constructor(A2) {
    this.raw = A2 || new W(), this.map = new eA(), A2 && A2.forEachJointHandle((I2) => {
      this.map.set(I2, TA.newTyped(A2, null, I2));
    });
  }
  free() {
    this.raw && this.raw.free(), this.raw = void 0, this.map && this.map.clear(), this.map = void 0;
  }
  finalizeDeserialization(A2) {
    this.map.forEach((I2) => I2.finalizeDeserialization(A2));
  }
  createJoint(A2, I2, g2, C2, B2) {
    const Q2 = I2.intoRaw(), E2 = this.raw.createJoint(Q2, g2, C2, B2);
    Q2.free();
    let i2 = TA.newTyped(this.raw, A2, E2);
    return this.map.set(E2, i2), i2;
  }
  remove(A2, I2) {
    this.raw.remove(A2, I2), this.unmap(A2);
  }
  forEachJointHandleAttachedToRigidBody(A2, I2) {
    this.raw.forEachJointAttachedToRigidBody(A2, I2);
  }
  unmap(A2) {
    this.map.delete(A2);
  }
  len() {
    return this.map.len();
  }
  contains(A2) {
    return null != this.get(A2);
  }
  get(A2) {
    return this.map.get(A2);
  }
  forEach(A2) {
    this.map.forEach(A2);
  }
  getAll() {
    return this.map.getAll();
  }
}
class XA {
  constructor(A2, I2) {
    this.rawSet = A2, this.handle = I2;
  }
  static newTyped(A2, I2) {
    switch (A2.jointType(I2)) {
      case l.Revolute:
        return new vA(A2, I2);
      case l.Prismatic:
        return new zA(A2, I2);
      case l.Fixed:
        return new uA(A2, I2);
      case l.Spherical:
        return new _A(A2, I2);
      default:
        return new XA(A2, I2);
    }
  }
  isValid() {
    return this.rawSet.contains(this.handle);
  }
  setContactsEnabled(A2) {
    this.rawSet.jointSetContactsEnabled(this.handle, A2);
  }
  contactsEnabled() {
    return this.rawSet.jointContactsEnabled(this.handle);
  }
}
class PA extends XA {
}
class uA extends XA {
}
class zA extends PA {
  rawAxis() {
    return Y.X;
  }
}
class vA extends PA {
  rawAxis() {
    return Y.AngX;
  }
}
class _A extends XA {
}
class $A {
  constructor(A2) {
    this.raw = A2 || new V(), this.map = new eA(), A2 && A2.forEachJointHandle((A3) => {
      this.map.set(A3, XA.newTyped(this.raw, A3));
    });
  }
  free() {
    this.raw && this.raw.free(), this.raw = void 0, this.map && this.map.clear(), this.map = void 0;
  }
  createJoint(A2, I2, g2, C2) {
    const B2 = A2.intoRaw(), Q2 = this.raw.createJoint(B2, I2, g2, C2);
    B2.free();
    let E2 = XA.newTyped(this.raw, Q2);
    return this.map.set(Q2, E2), E2;
  }
  remove(A2, I2) {
    this.raw.remove(A2, I2), this.map.delete(A2);
  }
  unmap(A2) {
    this.map.delete(A2);
  }
  len() {
    return this.map.len();
  }
  contains(A2) {
    return null != this.get(A2);
  }
  get(A2) {
    return this.map.get(A2);
  }
  forEach(A2) {
    this.map.forEach(A2);
  }
  forEachJointHandleAttachedToRigidBody(A2, I2) {
    this.raw.forEachJointAttachedToRigidBody(A2, I2);
  }
  getAll() {
    return this.map.getAll();
  }
}
!function(A2) {
  A2[A2.Average = 0] = "Average", A2[A2.Min = 1] = "Min", A2[A2.Multiply = 2] = "Multiply", A2[A2.Max = 3] = "Max";
}(MA || (MA = {}));
class AI {
  constructor(A2) {
    this.raw = A2 || new L();
  }
  free() {
    this.raw && this.raw.free(), this.raw = void 0;
  }
}
class II {
  constructor(A2) {
    this.raw = A2 || new m();
  }
  free() {
    this.raw && this.raw.free(), this.raw = void 0;
  }
  forEachActiveRigidBodyHandle(A2) {
    this.raw.forEachActiveRigidBodyHandle(A2);
  }
}
class gI {
  constructor(A2) {
    this.raw = A2 || new H();
  }
  free() {
    this.raw && this.raw.free(), this.raw = void 0;
  }
}
class CI {
  constructor(A2) {
    this.raw = A2 || new X(), this.tempManifold = new BI(null);
  }
  free() {
    this.raw && this.raw.free(), this.raw = void 0;
  }
  contactPairsWith(A2, I2) {
    this.raw.contact_pairs_with(A2, I2);
  }
  intersectionPairsWith(A2, I2) {
    this.raw.intersection_pairs_with(A2, I2);
  }
  contactPair(A2, I2, g2) {
    const C2 = this.raw.contact_pair(A2, I2);
    if (C2) {
      const I3 = C2.collider1() != A2;
      let B2;
      for (B2 = 0; B2 < C2.numContactManifolds(); ++B2)
        this.tempManifold.raw = C2.contactManifold(B2), this.tempManifold.raw && g2(this.tempManifold, I3), this.tempManifold.free();
      C2.free();
    }
  }
  intersectionPair(A2, I2) {
    return this.raw.intersection_pair(A2, I2);
  }
}
class BI {
  constructor(A2) {
    this.raw = A2;
  }
  free() {
    this.raw && this.raw.free(), this.raw = void 0;
  }
  normal() {
    return wA.fromRaw(this.raw.normal());
  }
  localNormal1() {
    return wA.fromRaw(this.raw.local_n1());
  }
  localNormal2() {
    return wA.fromRaw(this.raw.local_n2());
  }
  subshape1() {
    return this.raw.subshape1();
  }
  subshape2() {
    return this.raw.subshape2();
  }
  numContacts() {
    return this.raw.num_contacts();
  }
  localContactPoint1(A2) {
    return wA.fromRaw(this.raw.contact_local_p1(A2));
  }
  localContactPoint2(A2) {
    return wA.fromRaw(this.raw.contact_local_p2(A2));
  }
  contactDist(A2) {
    return this.raw.contact_dist(A2);
  }
  contactFid1(A2) {
    return this.raw.contact_fid1(A2);
  }
  contactFid2(A2) {
    return this.raw.contact_fid2(A2);
  }
  contactImpulse(A2) {
    return this.raw.contact_impulse(A2);
  }
  contactTangentImpulseX(A2) {
    return this.raw.contact_tangent_impulse_x(A2);
  }
  contactTangentImpulseY(A2) {
    return this.raw.contact_tangent_impulse_y(A2);
  }
  numSolverContacts() {
    return this.raw.num_solver_contacts();
  }
  solverContactPoint(A2) {
    return wA.fromRaw(this.raw.solver_contact_point(A2));
  }
  solverContactDist(A2) {
    return this.raw.solver_contact_dist(A2);
  }
  solverContactFriction(A2) {
    return this.raw.solver_contact_friction(A2);
  }
  solverContactRestitution(A2) {
    return this.raw.solver_contact_restitution(A2);
  }
  solverContactTangentVelocity(A2) {
    return wA.fromRaw(this.raw.solver_contact_tangent_velocity(A2));
  }
}
class QI {
  constructor(A2, I2, g2, C2, B2) {
    this.distance = A2, this.point1 = I2, this.point2 = g2, this.normal1 = C2, this.normal2 = B2;
  }
  static fromRaw(A2) {
    if (!A2)
      return null;
    const I2 = new QI(A2.distance(), wA.fromRaw(A2.point1()), wA.fromRaw(A2.point2()), wA.fromRaw(A2.normal1()), wA.fromRaw(A2.normal2()));
    return A2.free(), I2;
  }
}
!function(A2) {
  A2[A2.Vertex = 0] = "Vertex", A2[A2.Edge = 1] = "Edge", A2[A2.Face = 2] = "Face", A2[A2.Unknown = 3] = "Unknown";
}(NA || (NA = {}));
class EI {
  constructor(A2, I2) {
    this.point = A2, this.isInside = I2;
  }
  static fromRaw(A2) {
    if (!A2)
      return null;
    const I2 = new EI(wA.fromRaw(A2.point()), A2.isInside());
    return A2.free(), I2;
  }
}
class iI {
  constructor(A2, I2, g2, C2, B2) {
    this.featureType = NA.Unknown, this.featureId = void 0, this.collider = A2, this.point = I2, this.isInside = g2, void 0 !== B2 && (this.featureId = B2), void 0 !== C2 && (this.featureType = C2);
  }
  static fromRaw(A2, I2) {
    if (!I2)
      return null;
    const g2 = new iI(A2.get(I2.colliderHandle()), wA.fromRaw(I2.point()), I2.isInside(), I2.featureType(), I2.featureId());
    return I2.free(), g2;
  }
}
class DI {
  constructor(A2, I2) {
    this.origin = A2, this.dir = I2;
  }
  pointAt(A2) {
    return { x: this.origin.x + this.dir.x * A2, y: this.origin.y + this.dir.y * A2, z: this.origin.z + this.dir.z * A2 };
  }
}
class oI {
  constructor(A2, I2, g2, C2) {
    this.featureType = NA.Unknown, this.featureId = void 0, this.timeOfImpact = A2, this.normal = I2, void 0 !== C2 && (this.featureId = C2), void 0 !== g2 && (this.featureType = g2);
  }
  static fromRaw(A2) {
    if (!A2)
      return null;
    const I2 = new oI(A2.time_of_impact(), wA.fromRaw(A2.normal()), A2.featureType(), A2.featureId());
    return A2.free(), I2;
  }
}
class GI {
  constructor(A2, I2, g2, C2, B2) {
    this.featureType = NA.Unknown, this.featureId = void 0, this.collider = A2, this.timeOfImpact = I2, this.normal = g2, void 0 !== B2 && (this.featureId = B2), void 0 !== C2 && (this.featureType = C2);
  }
  static fromRaw(A2, I2) {
    if (!I2)
      return null;
    const g2 = new GI(A2.get(I2.colliderHandle()), I2.time_of_impact(), wA.fromRaw(I2.normal()), I2.featureType(), I2.featureId());
    return I2.free(), g2;
  }
}
class wI {
  constructor(A2, I2) {
    this.collider = A2, this.timeOfImpact = I2;
  }
  static fromRaw(A2, I2) {
    if (!I2)
      return null;
    const g2 = new wI(A2.get(I2.colliderHandle()), I2.timeOfImpact());
    return I2.free(), g2;
  }
}
class SI {
  constructor(A2, I2, g2, C2, B2) {
    this.time_of_impact = A2, this.witness1 = I2, this.witness2 = g2, this.normal1 = C2, this.normal2 = B2;
  }
  static fromRaw(A2, I2) {
    if (!I2)
      return null;
    const g2 = new SI(I2.time_of_impact(), wA.fromRaw(I2.witness1()), wA.fromRaw(I2.witness2()), wA.fromRaw(I2.normal1()), wA.fromRaw(I2.normal2()));
    return I2.free(), g2;
  }
}
class kI extends SI {
  constructor(A2, I2, g2, C2, B2, Q2) {
    super(I2, g2, C2, B2, Q2), this.collider = A2;
  }
  static fromRaw(A2, I2) {
    if (!I2)
      return null;
    const g2 = new kI(A2.get(I2.colliderHandle()), I2.time_of_impact(), wA.fromRaw(I2.witness1()), wA.fromRaw(I2.witness2()), wA.fromRaw(I2.normal1()), wA.fromRaw(I2.normal2()));
    return I2.free(), g2;
  }
}
class UI {
  static fromRaw(A2, I2) {
    const g2 = A2.coShapeType(I2);
    let C2, B2, Q2, E2, i2, D2, o2;
    switch (g2) {
      case c.Ball:
        return new aI(A2.coRadius(I2));
      case c.Cuboid:
        return C2 = A2.coHalfExtents(I2), new hI(C2.x, C2.y, C2.z);
      case c.RoundCuboid:
        return C2 = A2.coHalfExtents(I2), B2 = A2.coRoundRadius(I2), new JI(C2.x, C2.y, C2.z, B2);
      case c.Capsule:
        return i2 = A2.coHalfHeight(I2), D2 = A2.coRadius(I2), new yI(i2, D2);
      case c.Segment:
        return Q2 = A2.coVertices(I2), new MI(wA.new(Q2[0], Q2[1], Q2[2]), wA.new(Q2[3], Q2[4], Q2[5]));
      case c.Polyline:
        return Q2 = A2.coVertices(I2), E2 = A2.coIndices(I2), new RI(Q2, E2);
      case c.Triangle:
        return Q2 = A2.coVertices(I2), new NI(wA.new(Q2[0], Q2[1], Q2[2]), wA.new(Q2[3], Q2[4], Q2[5]), wA.new(Q2[6], Q2[7], Q2[8]));
      case c.RoundTriangle:
        return Q2 = A2.coVertices(I2), B2 = A2.coRoundRadius(I2), new FI(wA.new(Q2[0], Q2[1], Q2[2]), wA.new(Q2[3], Q2[4], Q2[5]), wA.new(Q2[6], Q2[7], Q2[8]), B2);
      case c.HalfSpace:
        return o2 = wA.fromRaw(A2.coHalfspaceNormal(I2)), new KI(o2);
      case c.TriMesh:
        Q2 = A2.coVertices(I2), E2 = A2.coIndices(I2);
        const G2 = A2.coTriMeshFlags(I2);
        return new qI(Q2, E2, G2);
      case c.HeightField:
        const w2 = A2.coHeightfieldScale(I2), S2 = A2.coHeightfieldHeights(I2), k2 = A2.coHeightfieldNRows(I2), U2 = A2.coHeightfieldNCols(I2), a2 = A2.coHeightFieldFlags(I2);
        return new YI(k2, U2, S2, w2, a2);
      case c.ConvexPolyhedron:
        return Q2 = A2.coVertices(I2), E2 = A2.coIndices(I2), new sI(Q2, E2);
      case c.RoundConvexPolyhedron:
        return Q2 = A2.coVertices(I2), E2 = A2.coIndices(I2), B2 = A2.coRoundRadius(I2), new cI(Q2, E2, B2);
      case c.Cylinder:
        return i2 = A2.coHalfHeight(I2), D2 = A2.coRadius(I2), new lI(i2, D2);
      case c.RoundCylinder:
        return i2 = A2.coHalfHeight(I2), D2 = A2.coRadius(I2), B2 = A2.coRoundRadius(I2), new HI(i2, D2, B2);
      case c.Cone:
        return i2 = A2.coHalfHeight(I2), D2 = A2.coRadius(I2), new LI(i2, D2);
      case c.RoundCone:
        return i2 = A2.coHalfHeight(I2), D2 = A2.coRadius(I2), B2 = A2.coRoundRadius(I2), new tI(i2, D2, B2);
      default:
        throw new Error("unknown shape type: " + g2);
    }
  }
  castShape(A2, I2, g2, C2, B2, Q2, E2, i2, D2, o2) {
    let G2 = wA.intoRaw(A2), w2 = kA.intoRaw(I2), S2 = wA.intoRaw(g2), k2 = wA.intoRaw(B2), U2 = kA.intoRaw(Q2), a2 = wA.intoRaw(E2), K2 = this.intoRaw(), h2 = C2.intoRaw(), J2 = SI.fromRaw(null, K2.castShape(G2, w2, S2, h2, k2, U2, a2, i2, D2, o2));
    return G2.free(), w2.free(), S2.free(), k2.free(), U2.free(), a2.free(), K2.free(), h2.free(), J2;
  }
  intersectsShape(A2, I2, g2, C2, B2) {
    let Q2 = wA.intoRaw(A2), E2 = kA.intoRaw(I2), i2 = wA.intoRaw(C2), D2 = kA.intoRaw(B2), o2 = this.intoRaw(), G2 = g2.intoRaw(), w2 = o2.intersectsShape(Q2, E2, G2, i2, D2);
    return Q2.free(), E2.free(), i2.free(), D2.free(), o2.free(), G2.free(), w2;
  }
  contactShape(A2, I2, g2, C2, B2, Q2) {
    let E2 = wA.intoRaw(A2), i2 = kA.intoRaw(I2), D2 = wA.intoRaw(C2), o2 = kA.intoRaw(B2), G2 = this.intoRaw(), w2 = g2.intoRaw(), S2 = QI.fromRaw(G2.contactShape(E2, i2, w2, D2, o2, Q2));
    return E2.free(), i2.free(), D2.free(), o2.free(), G2.free(), w2.free(), S2;
  }
  containsPoint(A2, I2, g2) {
    let C2 = wA.intoRaw(A2), B2 = kA.intoRaw(I2), Q2 = wA.intoRaw(g2), E2 = this.intoRaw(), i2 = E2.containsPoint(C2, B2, Q2);
    return C2.free(), B2.free(), Q2.free(), E2.free(), i2;
  }
  projectPoint(A2, I2, g2, C2) {
    let B2 = wA.intoRaw(A2), Q2 = kA.intoRaw(I2), E2 = wA.intoRaw(g2), i2 = this.intoRaw(), D2 = EI.fromRaw(i2.projectPoint(B2, Q2, E2, C2));
    return B2.free(), Q2.free(), E2.free(), i2.free(), D2;
  }
  intersectsRay(A2, I2, g2, C2) {
    let B2 = wA.intoRaw(I2), Q2 = kA.intoRaw(g2), E2 = wA.intoRaw(A2.origin), i2 = wA.intoRaw(A2.dir), D2 = this.intoRaw(), o2 = D2.intersectsRay(B2, Q2, E2, i2, C2);
    return B2.free(), Q2.free(), E2.free(), i2.free(), D2.free(), o2;
  }
  castRay(A2, I2, g2, C2, B2) {
    let Q2 = wA.intoRaw(I2), E2 = kA.intoRaw(g2), i2 = wA.intoRaw(A2.origin), D2 = wA.intoRaw(A2.dir), o2 = this.intoRaw(), G2 = o2.castRay(Q2, E2, i2, D2, C2, B2);
    return Q2.free(), E2.free(), i2.free(), D2.free(), o2.free(), G2;
  }
  castRayAndGetNormal(A2, I2, g2, C2, B2) {
    let Q2 = wA.intoRaw(I2), E2 = kA.intoRaw(g2), i2 = wA.intoRaw(A2.origin), D2 = wA.intoRaw(A2.dir), o2 = this.intoRaw(), G2 = oI.fromRaw(o2.castRayAndGetNormal(Q2, E2, i2, D2, C2, B2));
    return Q2.free(), E2.free(), i2.free(), D2.free(), o2.free(), G2;
  }
}
!function(A2) {
  A2[A2.Ball = 0] = "Ball", A2[A2.Cuboid = 1] = "Cuboid", A2[A2.Capsule = 2] = "Capsule", A2[A2.Segment = 3] = "Segment", A2[A2.Polyline = 4] = "Polyline", A2[A2.Triangle = 5] = "Triangle", A2[A2.TriMesh = 6] = "TriMesh", A2[A2.HeightField = 7] = "HeightField", A2[A2.ConvexPolyhedron = 9] = "ConvexPolyhedron", A2[A2.Cylinder = 10] = "Cylinder", A2[A2.Cone = 11] = "Cone", A2[A2.RoundCuboid = 12] = "RoundCuboid", A2[A2.RoundTriangle = 13] = "RoundTriangle", A2[A2.RoundCylinder = 14] = "RoundCylinder", A2[A2.RoundCone = 15] = "RoundCone", A2[A2.RoundConvexPolyhedron = 16] = "RoundConvexPolyhedron", A2[A2.HalfSpace = 17] = "HalfSpace";
}(FA || (FA = {})), function(A2) {
  A2[A2.FIX_INTERNAL_EDGES = 1] = "FIX_INTERNAL_EDGES";
}(RA || (RA = {})), function(A2) {
  A2[A2.DELETE_BAD_TOPOLOGY_TRIANGLES = 4] = "DELETE_BAD_TOPOLOGY_TRIANGLES", A2[A2.ORIENTED = 8] = "ORIENTED", A2[A2.MERGE_DUPLICATE_VERTICES = 16] = "MERGE_DUPLICATE_VERTICES", A2[A2.DELETE_DEGENERATE_TRIANGLES = 32] = "DELETE_DEGENERATE_TRIANGLES", A2[A2.DELETE_DUPLICATE_TRIANGLES = 64] = "DELETE_DUPLICATE_TRIANGLES", A2[A2.FIX_INTERNAL_EDGES = 152] = "FIX_INTERNAL_EDGES";
}(qA || (qA = {}));
class aI extends UI {
  constructor(A2) {
    super(), this.type = FA.Ball, this.radius = A2;
  }
  intoRaw() {
    return QA.ball(this.radius);
  }
}
class KI extends UI {
  constructor(A2) {
    super(), this.type = FA.HalfSpace, this.normal = A2;
  }
  intoRaw() {
    let A2 = wA.intoRaw(this.normal), I2 = QA.halfspace(A2);
    return A2.free(), I2;
  }
}
class hI extends UI {
  constructor(A2, I2, g2) {
    super(), this.type = FA.Cuboid, this.halfExtents = wA.new(A2, I2, g2);
  }
  intoRaw() {
    return QA.cuboid(this.halfExtents.x, this.halfExtents.y, this.halfExtents.z);
  }
}
class JI extends UI {
  constructor(A2, I2, g2, C2) {
    super(), this.type = FA.RoundCuboid, this.halfExtents = wA.new(A2, I2, g2), this.borderRadius = C2;
  }
  intoRaw() {
    return QA.roundCuboid(this.halfExtents.x, this.halfExtents.y, this.halfExtents.z, this.borderRadius);
  }
}
class yI extends UI {
  constructor(A2, I2) {
    super(), this.type = FA.Capsule, this.halfHeight = A2, this.radius = I2;
  }
  intoRaw() {
    return QA.capsule(this.halfHeight, this.radius);
  }
}
class MI extends UI {
  constructor(A2, I2) {
    super(), this.type = FA.Segment, this.a = A2, this.b = I2;
  }
  intoRaw() {
    let A2 = wA.intoRaw(this.a), I2 = wA.intoRaw(this.b), g2 = QA.segment(A2, I2);
    return A2.free(), I2.free(), g2;
  }
}
class NI extends UI {
  constructor(A2, I2, g2) {
    super(), this.type = FA.Triangle, this.a = A2, this.b = I2, this.c = g2;
  }
  intoRaw() {
    let A2 = wA.intoRaw(this.a), I2 = wA.intoRaw(this.b), g2 = wA.intoRaw(this.c), C2 = QA.triangle(A2, I2, g2);
    return A2.free(), I2.free(), g2.free(), C2;
  }
}
class FI extends UI {
  constructor(A2, I2, g2, C2) {
    super(), this.type = FA.RoundTriangle, this.a = A2, this.b = I2, this.c = g2, this.borderRadius = C2;
  }
  intoRaw() {
    let A2 = wA.intoRaw(this.a), I2 = wA.intoRaw(this.b), g2 = wA.intoRaw(this.c), C2 = QA.roundTriangle(A2, I2, g2, this.borderRadius);
    return A2.free(), I2.free(), g2.free(), C2;
  }
}
class RI extends UI {
  constructor(A2, I2) {
    super(), this.type = FA.Polyline, this.vertices = A2, this.indices = null != I2 ? I2 : new Uint32Array(0);
  }
  intoRaw() {
    return QA.polyline(this.vertices, this.indices);
  }
}
class qI extends UI {
  constructor(A2, I2, g2) {
    super(), this.type = FA.TriMesh, this.vertices = A2, this.indices = I2, this.flags = g2;
  }
  intoRaw() {
    return QA.trimesh(this.vertices, this.indices, this.flags);
  }
}
class sI extends UI {
  constructor(A2, I2) {
    super(), this.type = FA.ConvexPolyhedron, this.vertices = A2, this.indices = I2;
  }
  intoRaw() {
    return this.indices ? QA.convexMesh(this.vertices, this.indices) : QA.convexHull(this.vertices);
  }
}
class cI extends UI {
  constructor(A2, I2, g2) {
    super(), this.type = FA.RoundConvexPolyhedron, this.vertices = A2, this.indices = I2, this.borderRadius = g2;
  }
  intoRaw() {
    return this.indices ? QA.roundConvexMesh(this.vertices, this.indices, this.borderRadius) : QA.roundConvexHull(this.vertices, this.borderRadius);
  }
}
class YI extends UI {
  constructor(A2, I2, g2, C2, B2) {
    super(), this.type = FA.HeightField, this.nrows = A2, this.ncols = I2, this.heights = g2, this.scale = C2, this.flags = B2;
  }
  intoRaw() {
    let A2 = wA.intoRaw(this.scale), I2 = QA.heightfield(this.nrows, this.ncols, this.heights, A2, this.flags);
    return A2.free(), I2;
  }
}
class lI extends UI {
  constructor(A2, I2) {
    super(), this.type = FA.Cylinder, this.halfHeight = A2, this.radius = I2;
  }
  intoRaw() {
    return QA.cylinder(this.halfHeight, this.radius);
  }
}
class HI extends UI {
  constructor(A2, I2, g2) {
    super(), this.type = FA.RoundCylinder, this.borderRadius = g2, this.halfHeight = A2, this.radius = I2;
  }
  intoRaw() {
    return QA.roundCylinder(this.halfHeight, this.radius, this.borderRadius);
  }
}
class LI extends UI {
  constructor(A2, I2) {
    super(), this.type = FA.Cone, this.halfHeight = A2, this.radius = I2;
  }
  intoRaw() {
    return QA.cone(this.halfHeight, this.radius);
  }
}
class tI extends UI {
  constructor(A2, I2, g2) {
    super(), this.type = FA.RoundCone, this.halfHeight = A2, this.radius = I2, this.borderRadius = g2;
  }
  intoRaw() {
    return QA.roundCone(this.halfHeight, this.radius, this.borderRadius);
  }
}
class pI {
  constructor(A2) {
    this.raw = A2 || new P();
  }
  free() {
    this.raw && this.raw.free(), this.raw = void 0;
  }
  step(A2, I2, g2, C2, B2, Q2, E2, i2, D2, o2, G2, w2) {
    let S2 = wA.intoRaw(A2);
    G2 ? this.raw.stepWithEvents(S2, I2.raw, g2.raw, C2.raw, B2.raw, Q2.raw, E2.raw, i2.raw, D2.raw, o2.raw, G2.raw, w2, w2 ? w2.filterContactPair : null, w2 ? w2.filterIntersectionPair : null) : this.raw.step(S2, I2.raw, g2.raw, C2.raw, B2.raw, Q2.raw, E2.raw, i2.raw, D2.raw, o2.raw), S2.free();
  }
}
!function(A2) {
  A2[A2.EXCLUDE_FIXED = 1] = "EXCLUDE_FIXED", A2[A2.EXCLUDE_KINEMATIC = 2] = "EXCLUDE_KINEMATIC", A2[A2.EXCLUDE_DYNAMIC = 4] = "EXCLUDE_DYNAMIC", A2[A2.EXCLUDE_SENSORS = 8] = "EXCLUDE_SENSORS", A2[A2.EXCLUDE_SOLIDS = 16] = "EXCLUDE_SOLIDS", A2[A2.ONLY_DYNAMIC = 3] = "ONLY_DYNAMIC", A2[A2.ONLY_KINEMATIC = 5] = "ONLY_KINEMATIC", A2[A2.ONLY_FIXED = 6] = "ONLY_FIXED";
}(sA || (sA = {}));
class eI {
  constructor(A2) {
    this.raw = A2 || new v();
  }
  free() {
    this.raw && this.raw.free(), this.raw = void 0;
  }
  update(A2, I2) {
    this.raw.update(A2.raw, I2.raw);
  }
  castRay(A2, I2, g2, C2, B2, Q2, E2, i2, D2, o2) {
    let G2 = wA.intoRaw(g2.origin), w2 = wA.intoRaw(g2.dir), S2 = wI.fromRaw(I2, this.raw.castRay(A2.raw, I2.raw, G2, w2, C2, B2, Q2, E2, i2, D2, o2));
    return G2.free(), w2.free(), S2;
  }
  castRayAndGetNormal(A2, I2, g2, C2, B2, Q2, E2, i2, D2, o2) {
    let G2 = wA.intoRaw(g2.origin), w2 = wA.intoRaw(g2.dir), S2 = GI.fromRaw(I2, this.raw.castRayAndGetNormal(A2.raw, I2.raw, G2, w2, C2, B2, Q2, E2, i2, D2, o2));
    return G2.free(), w2.free(), S2;
  }
  intersectionsWithRay(A2, I2, g2, C2, B2, Q2, E2, i2, D2, o2, G2) {
    let w2 = wA.intoRaw(g2.origin), S2 = wA.intoRaw(g2.dir);
    this.raw.intersectionsWithRay(A2.raw, I2.raw, w2, S2, C2, B2, (A3) => Q2(GI.fromRaw(I2, A3)), E2, i2, D2, o2, G2), w2.free(), S2.free();
  }
  intersectionWithShape(A2, I2, g2, C2, B2, Q2, E2, i2, D2, o2) {
    let G2 = wA.intoRaw(g2), w2 = kA.intoRaw(C2), S2 = B2.intoRaw(), k2 = this.raw.intersectionWithShape(A2.raw, I2.raw, G2, w2, S2, Q2, E2, i2, D2, o2);
    return G2.free(), w2.free(), S2.free(), k2;
  }
  projectPoint(A2, I2, g2, C2, B2, Q2, E2, i2, D2) {
    let o2 = wA.intoRaw(g2), G2 = iI.fromRaw(I2, this.raw.projectPoint(A2.raw, I2.raw, o2, C2, B2, Q2, E2, i2, D2));
    return o2.free(), G2;
  }
  projectPointAndGetFeature(A2, I2, g2, C2, B2, Q2, E2, i2) {
    let D2 = wA.intoRaw(g2), o2 = iI.fromRaw(I2, this.raw.projectPointAndGetFeature(A2.raw, I2.raw, D2, C2, B2, Q2, E2, i2));
    return D2.free(), o2;
  }
  intersectionsWithPoint(A2, I2, g2, C2, B2, Q2, E2, i2, D2) {
    let o2 = wA.intoRaw(g2);
    this.raw.intersectionsWithPoint(A2.raw, I2.raw, o2, C2, B2, Q2, E2, i2, D2), o2.free();
  }
  castShape(A2, I2, g2, C2, B2, Q2, E2, i2, D2, o2, G2, w2, S2, k2) {
    let U2 = wA.intoRaw(g2), a2 = kA.intoRaw(C2), K2 = wA.intoRaw(B2), h2 = Q2.intoRaw(), J2 = kI.fromRaw(I2, this.raw.castShape(A2.raw, I2.raw, U2, a2, K2, h2, E2, i2, D2, o2, G2, w2, S2, k2));
    return U2.free(), a2.free(), K2.free(), h2.free(), J2;
  }
  intersectionsWithShape(A2, I2, g2, C2, B2, Q2, E2, i2, D2, o2, G2) {
    let w2 = wA.intoRaw(g2), S2 = kA.intoRaw(C2), k2 = B2.intoRaw();
    this.raw.intersectionsWithShape(A2.raw, I2.raw, w2, S2, k2, Q2, E2, i2, D2, o2, G2), w2.free(), S2.free(), k2.free();
  }
  collidersWithAabbIntersectingAabb(A2, I2, g2) {
    let C2 = wA.intoRaw(A2), B2 = wA.intoRaw(I2);
    this.raw.collidersWithAabbIntersectingAabb(C2, B2, g2), C2.free(), B2.free();
  }
}
class rI {
  constructor(A2) {
    this.raw = A2 || new BA();
  }
  free() {
    this.raw && this.raw.free(), this.raw = void 0;
  }
  serializeAll(A2, I2, g2, C2, B2, Q2, E2, i2, D2) {
    let o2 = wA.intoRaw(A2);
    const G2 = this.raw.serializeAll(o2, I2.raw, g2.raw, C2.raw, B2.raw, Q2.raw, E2.raw, i2.raw, D2.raw);
    return o2.free(), G2;
  }
  deserializeAll(A2) {
    return bI.fromRaw(this.raw.deserializeAll(A2));
  }
}
class dI {
  constructor(A2, I2) {
    this.vertices = A2, this.colors = I2;
  }
}
class TI {
  constructor(A2) {
    this.raw = A2 || new O();
  }
  free() {
    this.raw && this.raw.free(), this.raw = void 0, this.vertices = void 0, this.colors = void 0;
  }
  render(A2, I2, g2, C2, B2) {
    this.raw.render(A2.raw, I2.raw, g2.raw, C2.raw, B2.raw), this.vertices = this.raw.vertices(), this.colors = this.raw.colors();
  }
}
class OI {
}
class nI {
  constructor(A2, I2, g2, C2, B2) {
    this.params = I2, this.bodies = g2, this.colliders = C2, this.queries = B2, this.raw = new f(A2), this.rawCharacterCollision = new t(), this._applyImpulsesToDynamicBodies = false, this._characterMass = null;
  }
  free() {
    this.raw && (this.raw.free(), this.rawCharacterCollision.free()), this.raw = void 0, this.rawCharacterCollision = void 0;
  }
  up() {
    return this.raw.up();
  }
  setUp(A2) {
    let I2 = wA.intoRaw(A2);
    return this.raw.setUp(I2);
  }
  applyImpulsesToDynamicBodies() {
    return this._applyImpulsesToDynamicBodies;
  }
  setApplyImpulsesToDynamicBodies(A2) {
    this._applyImpulsesToDynamicBodies = A2;
  }
  characterMass() {
    return this._characterMass;
  }
  setCharacterMass(A2) {
    this._characterMass = A2;
  }
  offset() {
    return this.raw.offset();
  }
  setOffset(A2) {
    this.raw.setOffset(A2);
  }
  normalNudgeFactor() {
    return this.raw.normalNudgeFactor();
  }
  setNormalNudgeFactor(A2) {
    this.raw.setNormalNudgeFactor(A2);
  }
  slideEnabled() {
    return this.raw.slideEnabled();
  }
  setSlideEnabled(A2) {
    this.raw.setSlideEnabled(A2);
  }
  autostepMaxHeight() {
    return this.raw.autostepMaxHeight();
  }
  autostepMinWidth() {
    return this.raw.autostepMinWidth();
  }
  autostepIncludesDynamicBodies() {
    return this.raw.autostepIncludesDynamicBodies();
  }
  autostepEnabled() {
    return this.raw.autostepEnabled();
  }
  enableAutostep(A2, I2, g2) {
    this.raw.enableAutostep(A2, I2, g2);
  }
  disableAutostep() {
    return this.raw.disableAutostep();
  }
  maxSlopeClimbAngle() {
    return this.raw.maxSlopeClimbAngle();
  }
  setMaxSlopeClimbAngle(A2) {
    this.raw.setMaxSlopeClimbAngle(A2);
  }
  minSlopeSlideAngle() {
    return this.raw.minSlopeSlideAngle();
  }
  setMinSlopeSlideAngle(A2) {
    this.raw.setMinSlopeSlideAngle(A2);
  }
  snapToGroundDistance() {
    return this.raw.snapToGroundDistance();
  }
  enableSnapToGround(A2) {
    this.raw.enableSnapToGround(A2);
  }
  disableSnapToGround() {
    this.raw.disableSnapToGround();
  }
  snapToGroundEnabled() {
    return this.raw.snapToGroundEnabled();
  }
  computeColliderMovement(A2, I2, g2, C2, B2) {
    let Q2 = wA.intoRaw(I2);
    this.raw.computeColliderMovement(this.params.dt, this.bodies.raw, this.colliders.raw, this.queries.raw, A2.handle, Q2, this._applyImpulsesToDynamicBodies, this._characterMass, g2, C2, this.colliders.castClosure(B2)), Q2.free();
  }
  computedMovement() {
    return wA.fromRaw(this.raw.computedMovement());
  }
  computedGrounded() {
    return this.raw.computedGrounded();
  }
  numComputedCollisions() {
    return this.raw.numComputedCollisions();
  }
  computedCollision(A2, I2) {
    if (this.raw.computedCollision(A2, this.rawCharacterCollision)) {
      let A3 = this.rawCharacterCollision;
      return (I2 = null != I2 ? I2 : new OI()).translationDeltaApplied = wA.fromRaw(A3.translationDeltaApplied()), I2.translationDeltaRemaining = wA.fromRaw(A3.translationDeltaRemaining()), I2.toi = A3.toi(), I2.witness1 = wA.fromRaw(A3.worldWitness1()), I2.witness2 = wA.fromRaw(A3.worldWitness2()), I2.normal1 = wA.fromRaw(A3.worldNormal1()), I2.normal2 = wA.fromRaw(A3.worldNormal2()), I2.collider = this.colliders.get(A3.handle()), I2;
    }
    return null;
  }
}
class ZI {
  constructor(A2, I2, g2, C2) {
    this.raw = new Z(A2.handle), this.bodies = I2, this.colliders = g2, this.queries = C2, this._chassis = A2;
  }
  free() {
    this.raw && this.raw.free(), this.raw = void 0;
  }
  updateVehicle(A2, I2, g2, C2) {
    this.raw.update_vehicle(A2, this.bodies.raw, this.colliders.raw, this.queries.raw, I2, g2, this.colliders.castClosure(C2));
  }
  currentVehicleSpeed() {
    return this.raw.current_vehicle_speed();
  }
  chassis() {
    return this._chassis;
  }
  get indexUpAxis() {
    return this.raw.index_up_axis();
  }
  set indexUpAxis(A2) {
    this.raw.set_index_up_axis(A2);
  }
  get indexForwardAxis() {
    return this.raw.index_forward_axis();
  }
  set setIndexForwardAxis(A2) {
    this.raw.set_index_forward_axis(A2);
  }
  addWheel(A2, I2, g2, C2, B2) {
    let Q2 = wA.intoRaw(A2), E2 = wA.intoRaw(I2), i2 = wA.intoRaw(g2);
    this.raw.add_wheel(Q2, E2, i2, C2, B2), Q2.free(), E2.free(), i2.free();
  }
  numWheels() {
    return this.raw.num_wheels();
  }
  wheelChassisConnectionPointCs(A2) {
    return wA.fromRaw(this.raw.wheel_chassis_connection_point_cs(A2));
  }
  setWheelChassisConnectionPointCs(A2, I2) {
    let g2 = wA.intoRaw(I2);
    this.raw.set_wheel_chassis_connection_point_cs(A2, g2), g2.free();
  }
  wheelSuspensionRestLength(A2) {
    return this.raw.wheel_suspension_rest_length(A2);
  }
  setWheelSuspensionRestLength(A2, I2) {
    this.raw.set_wheel_suspension_rest_length(A2, I2);
  }
  wheelMaxSuspensionTravel(A2) {
    return this.raw.wheel_max_suspension_travel(A2);
  }
  setWheelMaxSuspensionTravel(A2, I2) {
    this.raw.set_wheel_max_suspension_travel(A2, I2);
  }
  wheelRadius(A2) {
    return this.raw.wheel_radius(A2);
  }
  setWheelRadius(A2, I2) {
    this.raw.set_wheel_radius(A2, I2);
  }
  wheelSuspensionStiffness(A2) {
    return this.raw.wheel_suspension_stiffness(A2);
  }
  setWheelSuspensionStiffness(A2, I2) {
    this.raw.set_wheel_suspension_stiffness(A2, I2);
  }
  wheelSuspensionCompression(A2) {
    return this.raw.wheel_suspension_compression(A2);
  }
  setWheelSuspensionCompression(A2, I2) {
    this.raw.set_wheel_suspension_compression(A2, I2);
  }
  wheelSuspensionRelaxation(A2) {
    return this.raw.wheel_suspension_relaxation(A2);
  }
  setWheelSuspensionRelaxation(A2, I2) {
    this.raw.set_wheel_suspension_relaxation(A2, I2);
  }
  wheelMaxSuspensionForce(A2) {
    return this.raw.wheel_max_suspension_force(A2);
  }
  setWheelMaxSuspensionForce(A2, I2) {
    this.raw.set_wheel_max_suspension_force(A2, I2);
  }
  wheelBrake(A2) {
    return this.raw.wheel_brake(A2);
  }
  setWheelBrake(A2, I2) {
    this.raw.set_wheel_brake(A2, I2);
  }
  wheelSteering(A2) {
    return this.raw.wheel_steering(A2);
  }
  setWheelSteering(A2, I2) {
    this.raw.set_wheel_steering(A2, I2);
  }
  wheelEngineForce(A2) {
    return this.raw.wheel_engine_force(A2);
  }
  setWheelEngineForce(A2, I2) {
    this.raw.set_wheel_engine_force(A2, I2);
  }
  wheelDirectionCs(A2) {
    return wA.fromRaw(this.raw.wheel_direction_cs(A2));
  }
  setWheelDirectionCs(A2, I2) {
    let g2 = wA.intoRaw(I2);
    this.raw.set_wheel_direction_cs(A2, g2), g2.free();
  }
  wheelAxleCs(A2) {
    return wA.fromRaw(this.raw.wheel_axle_cs(A2));
  }
  setWheelAxleCs(A2, I2) {
    let g2 = wA.intoRaw(I2);
    this.raw.set_wheel_axle_cs(A2, g2), g2.free();
  }
  wheelFrictionSlip(A2) {
    return this.raw.wheel_friction_slip(A2);
  }
  setWheelFrictionSlip(A2, I2) {
    this.raw.set_wheel_friction_slip(A2, I2);
  }
  wheelSideFrictionStiffness(A2) {
    return this.raw.wheel_side_friction_stiffness(A2);
  }
  setWheelSideFrictionStiffness(A2, I2) {
    this.raw.set_wheel_side_friction_stiffness(A2, I2);
  }
  wheelRotation(A2) {
    return this.raw.wheel_rotation(A2);
  }
  wheelForwardImpulse(A2) {
    return this.raw.wheel_forward_impulse(A2);
  }
  wheelSideImpulse(A2) {
    return this.raw.wheel_side_impulse(A2);
  }
  wheelSuspensionForce(A2) {
    return this.raw.wheel_suspension_force(A2);
  }
  wheelContactNormal(A2) {
    return wA.fromRaw(this.raw.wheel_contact_normal_ws(A2));
  }
  wheelContactPoint(A2) {
    return wA.fromRaw(this.raw.wheel_contact_point_ws(A2));
  }
  wheelSuspensionLength(A2) {
    return this.raw.wheel_suspension_length(A2);
  }
  wheelHardPoint(A2) {
    return wA.fromRaw(this.raw.wheel_hard_point_ws(A2));
  }
  wheelIsInContact(A2) {
    return this.raw.wheel_is_in_contact(A2);
  }
  wheelGroundObject(A2) {
    return this.colliders.get(this.raw.wheel_ground_object(A2));
  }
}
class bI {
  constructor(A2, I2, g2, C2, B2, Q2, E2, i2, D2, o2, G2, w2, S2, k2) {
    this.gravity = A2, this.integrationParameters = new dA(I2), this.islands = new II(g2), this.broadPhase = new gI(C2), this.narrowPhase = new CI(B2), this.bodies = new rA(Q2), this.colliders = new fI(E2), this.impulseJoints = new VA(i2), this.multibodyJoints = new $A(D2), this.ccdSolver = new AI(o2), this.queryPipeline = new eI(G2), this.physicsPipeline = new pI(w2), this.serializationPipeline = new rI(S2), this.debugRenderPipeline = new TI(k2), this.characterControllers = /* @__PURE__ */ new Set(), this.vehicleControllers = /* @__PURE__ */ new Set(), this.impulseJoints.finalizeDeserialization(this.bodies), this.bodies.finalizeDeserialization(this.colliders), this.colliders.finalizeDeserialization(this.bodies);
  }
  free() {
    this.integrationParameters.free(), this.islands.free(), this.broadPhase.free(), this.narrowPhase.free(), this.bodies.free(), this.colliders.free(), this.impulseJoints.free(), this.multibodyJoints.free(), this.ccdSolver.free(), this.queryPipeline.free(), this.physicsPipeline.free(), this.serializationPipeline.free(), this.debugRenderPipeline.free(), this.characterControllers.forEach((A2) => A2.free()), this.vehicleControllers.forEach((A2) => A2.free()), this.integrationParameters = void 0, this.islands = void 0, this.broadPhase = void 0, this.narrowPhase = void 0, this.bodies = void 0, this.colliders = void 0, this.ccdSolver = void 0, this.impulseJoints = void 0, this.multibodyJoints = void 0, this.queryPipeline = void 0, this.physicsPipeline = void 0, this.serializationPipeline = void 0, this.debugRenderPipeline = void 0, this.characterControllers = void 0, this.vehicleControllers = void 0;
  }
  static fromRaw(A2) {
    return A2 ? new bI(wA.fromRaw(A2.takeGravity()), A2.takeIntegrationParameters(), A2.takeIslandManager(), A2.takeBroadPhase(), A2.takeNarrowPhase(), A2.takeBodies(), A2.takeColliders(), A2.takeImpulseJoints(), A2.takeMultibodyJoints()) : null;
  }
  takeSnapshot() {
    return this.serializationPipeline.serializeAll(this.gravity, this.integrationParameters, this.islands, this.broadPhase, this.narrowPhase, this.bodies, this.colliders, this.impulseJoints, this.multibodyJoints);
  }
  static restoreSnapshot(A2) {
    return new rI().deserializeAll(A2);
  }
  debugRender() {
    return this.debugRenderPipeline.render(this.bodies, this.colliders, this.impulseJoints, this.multibodyJoints, this.narrowPhase), new dI(this.debugRenderPipeline.vertices, this.debugRenderPipeline.colors);
  }
  step(A2, I2) {
    this.physicsPipeline.step(this.gravity, this.integrationParameters, this.islands, this.broadPhase, this.narrowPhase, this.bodies, this.colliders, this.impulseJoints, this.multibodyJoints, this.ccdSolver, A2, I2), this.queryPipeline.update(this.bodies, this.colliders);
  }
  propagateModifiedBodyPositionsToColliders() {
    this.bodies.raw.propagateModifiedBodyPositionsToColliders(this.colliders.raw);
  }
  updateSceneQueries() {
    this.propagateModifiedBodyPositionsToColliders(), this.queryPipeline.update(this.bodies, this.colliders);
  }
  get timestep() {
    return this.integrationParameters.dt;
  }
  set timestep(A2) {
    this.integrationParameters.dt = A2;
  }
  get lengthUnit() {
    return this.integrationParameters.lengthUnit;
  }
  set lengthUnit(A2) {
    this.integrationParameters.lengthUnit = A2;
  }
  get numSolverIterations() {
    return this.integrationParameters.numSolverIterations;
  }
  set numSolverIterations(A2) {
    this.integrationParameters.numSolverIterations = A2;
  }
  get numAdditionalFrictionIterations() {
    return this.integrationParameters.numAdditionalFrictionIterations;
  }
  set numAdditionalFrictionIterations(A2) {
    this.integrationParameters.numAdditionalFrictionIterations = A2;
  }
  get numInternalPgsIterations() {
    return this.integrationParameters.numInternalPgsIterations;
  }
  set numInternalPgsIterations(A2) {
    this.integrationParameters.numInternalPgsIterations = A2;
  }
  switchToStandardPgsSolver() {
    this.integrationParameters.switchToStandardPgsSolver();
  }
  switchToSmallStepsPgsSolver() {
    this.integrationParameters.switchToSmallStepsPgsSolver();
  }
  switchToSmallStepsPgsSolverWithoutWarmstart() {
    this.integrationParameters.switchToSmallStepsPgsSolverWithoutWarmstart();
  }
  createRigidBody(A2) {
    return this.bodies.createRigidBody(this.colliders, A2);
  }
  createCharacterController(A2) {
    let I2 = new nI(A2, this.integrationParameters, this.bodies, this.colliders, this.queryPipeline);
    return this.characterControllers.add(I2), I2;
  }
  removeCharacterController(A2) {
    this.characterControllers.delete(A2), A2.free();
  }
  createVehicleController(A2) {
    let I2 = new ZI(A2, this.bodies, this.colliders, this.queryPipeline);
    return this.vehicleControllers.add(I2), I2;
  }
  removeVehicleController(A2) {
    this.vehicleControllers.delete(A2), A2.free();
  }
  createCollider(A2, I2) {
    let g2 = I2 ? I2.handle : void 0;
    return this.colliders.createCollider(this.bodies, A2, g2);
  }
  createImpulseJoint(A2, I2, g2, C2) {
    return this.impulseJoints.createJoint(this.bodies, A2, I2.handle, g2.handle, C2);
  }
  createMultibodyJoint(A2, I2, g2, C2) {
    return this.multibodyJoints.createJoint(A2, I2.handle, g2.handle, C2);
  }
  getRigidBody(A2) {
    return this.bodies.get(A2);
  }
  getCollider(A2) {
    return this.colliders.get(A2);
  }
  getImpulseJoint(A2) {
    return this.impulseJoints.get(A2);
  }
  getMultibodyJoint(A2) {
    return this.multibodyJoints.get(A2);
  }
  removeRigidBody(A2) {
    this.bodies && this.bodies.remove(A2.handle, this.islands, this.colliders, this.impulseJoints, this.multibodyJoints);
  }
  removeCollider(A2, I2) {
    this.colliders && this.colliders.remove(A2.handle, this.islands, this.bodies, I2);
  }
  removeImpulseJoint(A2, I2) {
    this.impulseJoints && this.impulseJoints.remove(A2.handle, I2);
  }
  removeMultibodyJoint(A2, I2) {
    this.impulseJoints && this.multibodyJoints.remove(A2.handle, I2);
  }
  forEachCollider(A2) {
    this.colliders.forEach(A2);
  }
  forEachRigidBody(A2) {
    this.bodies.forEach(A2);
  }
  forEachActiveRigidBody(A2) {
    this.bodies.forEachActiveRigidBody(this.islands, A2);
  }
  castRay(A2, I2, g2, C2, B2, Q2, E2, i2) {
    return this.queryPipeline.castRay(this.bodies, this.colliders, A2, I2, g2, C2, B2, Q2 ? Q2.handle : null, E2 ? E2.handle : null, this.colliders.castClosure(i2));
  }
  castRayAndGetNormal(A2, I2, g2, C2, B2, Q2, E2, i2) {
    return this.queryPipeline.castRayAndGetNormal(this.bodies, this.colliders, A2, I2, g2, C2, B2, Q2 ? Q2.handle : null, E2 ? E2.handle : null, this.colliders.castClosure(i2));
  }
  intersectionsWithRay(A2, I2, g2, C2, B2, Q2, E2, i2, D2) {
    this.queryPipeline.intersectionsWithRay(this.bodies, this.colliders, A2, I2, g2, C2, B2, Q2, E2 ? E2.handle : null, i2 ? i2.handle : null, this.colliders.castClosure(D2));
  }
  intersectionWithShape(A2, I2, g2, C2, B2, Q2, E2, i2) {
    let D2 = this.queryPipeline.intersectionWithShape(this.bodies, this.colliders, A2, I2, g2, C2, B2, Q2 ? Q2.handle : null, E2 ? E2.handle : null, this.colliders.castClosure(i2));
    return null != D2 ? this.colliders.get(D2) : null;
  }
  projectPoint(A2, I2, g2, C2, B2, Q2, E2) {
    return this.queryPipeline.projectPoint(this.bodies, this.colliders, A2, I2, g2, C2, B2 ? B2.handle : null, Q2 ? Q2.handle : null, this.colliders.castClosure(E2));
  }
  projectPointAndGetFeature(A2, I2, g2, C2, B2, Q2) {
    return this.queryPipeline.projectPointAndGetFeature(this.bodies, this.colliders, A2, I2, g2, C2 ? C2.handle : null, B2 ? B2.handle : null, this.colliders.castClosure(Q2));
  }
  intersectionsWithPoint(A2, I2, g2, C2, B2, Q2, E2) {
    this.queryPipeline.intersectionsWithPoint(this.bodies, this.colliders, A2, this.colliders.castClosure(I2), g2, C2, B2 ? B2.handle : null, Q2 ? Q2.handle : null, this.colliders.castClosure(E2));
  }
  castShape(A2, I2, g2, C2, B2, Q2, E2, i2, D2, o2, G2, w2) {
    return this.queryPipeline.castShape(this.bodies, this.colliders, A2, I2, g2, C2, B2, Q2, E2, i2, D2, o2 ? o2.handle : null, G2 ? G2.handle : null, this.colliders.castClosure(w2));
  }
  intersectionsWithShape(A2, I2, g2, C2, B2, Q2, E2, i2, D2) {
    this.queryPipeline.intersectionsWithShape(this.bodies, this.colliders, A2, I2, g2, this.colliders.castClosure(C2), B2, Q2, E2 ? E2.handle : null, i2 ? i2.handle : null, this.colliders.castClosure(D2));
  }
  collidersWithAabbIntersectingAabb(A2, I2, g2) {
    this.queryPipeline.collidersWithAabbIntersectingAabb(A2, I2, this.colliders.castClosure(g2));
  }
  contactPairsWith(A2, I2) {
    this.narrowPhase.contactPairsWith(A2.handle, this.colliders.castClosure(I2));
  }
  intersectionPairsWith(A2, I2) {
    this.narrowPhase.intersectionPairsWith(A2.handle, this.colliders.castClosure(I2));
  }
  contactPair(A2, I2, g2) {
    this.narrowPhase.contactPair(A2.handle, I2.handle, g2);
  }
  intersectionPair(A2, I2) {
    return this.narrowPhase.intersectionPair(A2.handle, I2.handle);
  }
}
!function(A2) {
  A2[A2.NONE = 0] = "NONE", A2[A2.COLLISION_EVENTS = 1] = "COLLISION_EVENTS", A2[A2.CONTACT_FORCE_EVENTS = 2] = "CONTACT_FORCE_EVENTS";
}(cA || (cA = {}));
class xI {
  free() {
    this.raw && this.raw.free(), this.raw = void 0;
  }
  collider1() {
    return this.raw.collider1();
  }
  collider2() {
    return this.raw.collider2();
  }
  totalForce() {
    return wA.fromRaw(this.raw.total_force());
  }
  totalForceMagnitude() {
    return this.raw.total_force_magnitude();
  }
  maxForceDirection() {
    return wA.fromRaw(this.raw.max_force_direction());
  }
  maxForceMagnitude() {
    return this.raw.max_force_magnitude();
  }
}
class WI {
  constructor(A2, I2) {
    this.raw = I2 || new b(A2);
  }
  free() {
    this.raw && this.raw.free(), this.raw = void 0;
  }
  drainCollisionEvents(A2) {
    this.raw.drainCollisionEvents(A2);
  }
  drainContactForceEvents(A2) {
    let I2 = new xI();
    this.raw.drainContactForceEvents((g2) => {
      I2.raw = g2, A2(I2), I2.free();
    });
  }
  clear() {
    this.raw.clear();
  }
}
!function(A2) {
  A2[A2.NONE = 0] = "NONE", A2[A2.FILTER_CONTACT_PAIRS = 1] = "FILTER_CONTACT_PAIRS", A2[A2.FILTER_INTERSECTION_PAIRS = 2] = "FILTER_INTERSECTION_PAIRS";
}(YA || (YA = {})), function(A2) {
  A2[A2.EMPTY = 0] = "EMPTY", A2[A2.COMPUTE_IMPULSE = 1] = "COMPUTE_IMPULSE";
}(lA || (lA = {})), function(A2) {
  A2[A2.DYNAMIC_DYNAMIC = 1] = "DYNAMIC_DYNAMIC", A2[A2.DYNAMIC_KINEMATIC = 12] = "DYNAMIC_KINEMATIC", A2[A2.DYNAMIC_FIXED = 2] = "DYNAMIC_FIXED", A2[A2.KINEMATIC_KINEMATIC = 52224] = "KINEMATIC_KINEMATIC", A2[A2.KINEMATIC_FIXED = 8704] = "KINEMATIC_FIXED", A2[A2.FIXED_FIXED = 32] = "FIXED_FIXED", A2[A2.DEFAULT = 15] = "DEFAULT", A2[A2.ALL = 60943] = "ALL";
}(HA || (HA = {}));
class jI {
  constructor(A2, I2, g2, C2) {
    this.colliderSet = A2, this.handle = I2, this._parent = g2, this._shape = C2;
  }
  finalizeDeserialization(A2) {
    null != this.handle && (this._parent = A2.get(this.colliderSet.raw.coParent(this.handle)));
  }
  ensureShapeIsCached() {
    this._shape || (this._shape = UI.fromRaw(this.colliderSet.raw, this.handle));
  }
  get shape() {
    return this.ensureShapeIsCached(), this._shape;
  }
  isValid() {
    return this.colliderSet.raw.contains(this.handle);
  }
  translation() {
    return wA.fromRaw(this.colliderSet.raw.coTranslation(this.handle));
  }
  rotation() {
    return kA.fromRaw(this.colliderSet.raw.coRotation(this.handle));
  }
  isSensor() {
    return this.colliderSet.raw.coIsSensor(this.handle);
  }
  setSensor(A2) {
    this.colliderSet.raw.coSetSensor(this.handle, A2);
  }
  setShape(A2) {
    let I2 = A2.intoRaw();
    this.colliderSet.raw.coSetShape(this.handle, I2), I2.free(), this._shape = A2;
  }
  setEnabled(A2) {
    this.colliderSet.raw.coSetEnabled(this.handle, A2);
  }
  isEnabled() {
    return this.colliderSet.raw.coIsEnabled(this.handle);
  }
  setRestitution(A2) {
    this.colliderSet.raw.coSetRestitution(this.handle, A2);
  }
  setFriction(A2) {
    this.colliderSet.raw.coSetFriction(this.handle, A2);
  }
  frictionCombineRule() {
    return this.colliderSet.raw.coFrictionCombineRule(this.handle);
  }
  setFrictionCombineRule(A2) {
    this.colliderSet.raw.coSetFrictionCombineRule(this.handle, A2);
  }
  restitutionCombineRule() {
    return this.colliderSet.raw.coRestitutionCombineRule(this.handle);
  }
  setRestitutionCombineRule(A2) {
    this.colliderSet.raw.coSetRestitutionCombineRule(this.handle, A2);
  }
  setCollisionGroups(A2) {
    this.colliderSet.raw.coSetCollisionGroups(this.handle, A2);
  }
  setSolverGroups(A2) {
    this.colliderSet.raw.coSetSolverGroups(this.handle, A2);
  }
  contactSkin() {
    return this.colliderSet.raw.coContactSkin(this.handle);
  }
  setContactSkin(A2) {
    return this.colliderSet.raw.coSetContactSkin(this.handle, A2);
  }
  activeHooks() {
    return this.colliderSet.raw.coActiveHooks(this.handle);
  }
  setActiveHooks(A2) {
    this.colliderSet.raw.coSetActiveHooks(this.handle, A2);
  }
  activeEvents() {
    return this.colliderSet.raw.coActiveEvents(this.handle);
  }
  setActiveEvents(A2) {
    this.colliderSet.raw.coSetActiveEvents(this.handle, A2);
  }
  activeCollisionTypes() {
    return this.colliderSet.raw.coActiveCollisionTypes(this.handle);
  }
  setContactForceEventThreshold(A2) {
    return this.colliderSet.raw.coSetContactForceEventThreshold(this.handle, A2);
  }
  contactForceEventThreshold() {
    return this.colliderSet.raw.coContactForceEventThreshold(this.handle);
  }
  setActiveCollisionTypes(A2) {
    this.colliderSet.raw.coSetActiveCollisionTypes(this.handle, A2);
  }
  setDensity(A2) {
    this.colliderSet.raw.coSetDensity(this.handle, A2);
  }
  setMass(A2) {
    this.colliderSet.raw.coSetMass(this.handle, A2);
  }
  setMassProperties(A2, I2, g2, C2) {
    let B2 = wA.intoRaw(I2), Q2 = wA.intoRaw(g2), E2 = kA.intoRaw(C2);
    this.colliderSet.raw.coSetMassProperties(this.handle, A2, B2, Q2, E2), B2.free(), Q2.free(), E2.free();
  }
  setTranslation(A2) {
    this.colliderSet.raw.coSetTranslation(this.handle, A2.x, A2.y, A2.z);
  }
  setTranslationWrtParent(A2) {
    this.colliderSet.raw.coSetTranslationWrtParent(this.handle, A2.x, A2.y, A2.z);
  }
  setRotation(A2) {
    this.colliderSet.raw.coSetRotation(this.handle, A2.x, A2.y, A2.z, A2.w);
  }
  setRotationWrtParent(A2) {
    this.colliderSet.raw.coSetRotationWrtParent(this.handle, A2.x, A2.y, A2.z, A2.w);
  }
  shapeType() {
    return this.colliderSet.raw.coShapeType(this.handle);
  }
  halfExtents() {
    return wA.fromRaw(this.colliderSet.raw.coHalfExtents(this.handle));
  }
  setHalfExtents(A2) {
    const I2 = wA.intoRaw(A2);
    this.colliderSet.raw.coSetHalfExtents(this.handle, I2);
  }
  radius() {
    return this.colliderSet.raw.coRadius(this.handle);
  }
  setRadius(A2) {
    this.colliderSet.raw.coSetRadius(this.handle, A2);
  }
  roundRadius() {
    return this.colliderSet.raw.coRoundRadius(this.handle);
  }
  setRoundRadius(A2) {
    this.colliderSet.raw.coSetRoundRadius(this.handle, A2);
  }
  halfHeight() {
    return this.colliderSet.raw.coHalfHeight(this.handle);
  }
  setHalfHeight(A2) {
    this.colliderSet.raw.coSetHalfHeight(this.handle, A2);
  }
  vertices() {
    return this.colliderSet.raw.coVertices(this.handle);
  }
  indices() {
    return this.colliderSet.raw.coIndices(this.handle);
  }
  heightfieldHeights() {
    return this.colliderSet.raw.coHeightfieldHeights(this.handle);
  }
  heightfieldScale() {
    let A2 = this.colliderSet.raw.coHeightfieldScale(this.handle);
    return wA.fromRaw(A2);
  }
  heightfieldNRows() {
    return this.colliderSet.raw.coHeightfieldNRows(this.handle);
  }
  heightfieldNCols() {
    return this.colliderSet.raw.coHeightfieldNCols(this.handle);
  }
  parent() {
    return this._parent;
  }
  friction() {
    return this.colliderSet.raw.coFriction(this.handle);
  }
  restitution() {
    return this.colliderSet.raw.coRestitution(this.handle);
  }
  density() {
    return this.colliderSet.raw.coDensity(this.handle);
  }
  mass() {
    return this.colliderSet.raw.coMass(this.handle);
  }
  volume() {
    return this.colliderSet.raw.coVolume(this.handle);
  }
  collisionGroups() {
    return this.colliderSet.raw.coCollisionGroups(this.handle);
  }
  solverGroups() {
    return this.colliderSet.raw.coSolverGroups(this.handle);
  }
  containsPoint(A2) {
    let I2 = wA.intoRaw(A2), g2 = this.colliderSet.raw.coContainsPoint(this.handle, I2);
    return I2.free(), g2;
  }
  projectPoint(A2, I2) {
    let g2 = wA.intoRaw(A2), C2 = EI.fromRaw(this.colliderSet.raw.coProjectPoint(this.handle, g2, I2));
    return g2.free(), C2;
  }
  intersectsRay(A2, I2) {
    let g2 = wA.intoRaw(A2.origin), C2 = wA.intoRaw(A2.dir), B2 = this.colliderSet.raw.coIntersectsRay(this.handle, g2, C2, I2);
    return g2.free(), C2.free(), B2;
  }
  castShape(A2, I2, g2, C2, B2, Q2, E2, i2) {
    let D2 = wA.intoRaw(A2), o2 = wA.intoRaw(g2), G2 = kA.intoRaw(C2), w2 = wA.intoRaw(B2), S2 = I2.intoRaw(), k2 = SI.fromRaw(this.colliderSet, this.colliderSet.raw.coCastShape(this.handle, D2, S2, o2, G2, w2, Q2, E2, i2));
    return D2.free(), o2.free(), G2.free(), w2.free(), S2.free(), k2;
  }
  castCollider(A2, I2, g2, C2, B2, Q2) {
    let E2 = wA.intoRaw(A2), i2 = wA.intoRaw(g2), D2 = kI.fromRaw(this.colliderSet, this.colliderSet.raw.coCastCollider(this.handle, E2, I2.handle, i2, C2, B2, Q2));
    return E2.free(), i2.free(), D2;
  }
  intersectsShape(A2, I2, g2) {
    let C2 = wA.intoRaw(I2), B2 = kA.intoRaw(g2), Q2 = A2.intoRaw(), E2 = this.colliderSet.raw.coIntersectsShape(this.handle, Q2, C2, B2);
    return C2.free(), B2.free(), Q2.free(), E2;
  }
  contactShape(A2, I2, g2, C2) {
    let B2 = wA.intoRaw(I2), Q2 = kA.intoRaw(g2), E2 = A2.intoRaw(), i2 = QI.fromRaw(this.colliderSet.raw.coContactShape(this.handle, E2, B2, Q2, C2));
    return B2.free(), Q2.free(), E2.free(), i2;
  }
  contactCollider(A2, I2) {
    return QI.fromRaw(this.colliderSet.raw.coContactCollider(this.handle, A2.handle, I2));
  }
  castRay(A2, I2, g2) {
    let C2 = wA.intoRaw(A2.origin), B2 = wA.intoRaw(A2.dir), Q2 = this.colliderSet.raw.coCastRay(this.handle, C2, B2, I2, g2);
    return C2.free(), B2.free(), Q2;
  }
  castRayAndGetNormal(A2, I2, g2) {
    let C2 = wA.intoRaw(A2.origin), B2 = wA.intoRaw(A2.dir), Q2 = oI.fromRaw(this.colliderSet.raw.coCastRayAndGetNormal(this.handle, C2, B2, I2, g2));
    return C2.free(), B2.free(), Q2;
  }
}
!function(A2) {
  A2[A2.Density = 0] = "Density", A2[A2.Mass = 1] = "Mass", A2[A2.MassProps = 2] = "MassProps";
}(LA || (LA = {}));
class mI {
  constructor(A2) {
    this.enabled = true, this.shape = A2, this.massPropsMode = LA.Density, this.density = 1, this.friction = 0.5, this.restitution = 0, this.rotation = kA.identity(), this.translation = wA.zeros(), this.isSensor = false, this.collisionGroups = 4294967295, this.solverGroups = 4294967295, this.frictionCombineRule = MA.Average, this.restitutionCombineRule = MA.Average, this.activeCollisionTypes = HA.DEFAULT, this.activeEvents = cA.NONE, this.activeHooks = YA.NONE, this.mass = 0, this.centerOfMass = wA.zeros(), this.contactForceEventThreshold = 0, this.contactSkin = 0, this.principalAngularInertia = wA.zeros(), this.angularInertiaLocalFrame = kA.identity();
  }
  static ball(A2) {
    const I2 = new aI(A2);
    return new mI(I2);
  }
  static capsule(A2, I2) {
    const g2 = new yI(A2, I2);
    return new mI(g2);
  }
  static segment(A2, I2) {
    const g2 = new MI(A2, I2);
    return new mI(g2);
  }
  static triangle(A2, I2, g2) {
    const C2 = new NI(A2, I2, g2);
    return new mI(C2);
  }
  static roundTriangle(A2, I2, g2, C2) {
    const B2 = new FI(A2, I2, g2, C2);
    return new mI(B2);
  }
  static polyline(A2, I2) {
    const g2 = new RI(A2, I2);
    return new mI(g2);
  }
  static trimesh(A2, I2, g2) {
    const C2 = new qI(A2, I2, g2);
    return new mI(C2);
  }
  static cuboid(A2, I2, g2) {
    const C2 = new hI(A2, I2, g2);
    return new mI(C2);
  }
  static roundCuboid(A2, I2, g2, C2) {
    const B2 = new JI(A2, I2, g2, C2);
    return new mI(B2);
  }
  static heightfield(A2, I2, g2, C2, B2) {
    const Q2 = new YI(A2, I2, g2, C2, B2);
    return new mI(Q2);
  }
  static cylinder(A2, I2) {
    const g2 = new lI(A2, I2);
    return new mI(g2);
  }
  static roundCylinder(A2, I2, g2) {
    const C2 = new HI(A2, I2, g2);
    return new mI(C2);
  }
  static cone(A2, I2) {
    const g2 = new LI(A2, I2);
    return new mI(g2);
  }
  static roundCone(A2, I2, g2) {
    const C2 = new tI(A2, I2, g2);
    return new mI(C2);
  }
  static convexHull(A2) {
    const I2 = new sI(A2, null);
    return new mI(I2);
  }
  static convexMesh(A2, I2) {
    const g2 = new sI(A2, I2);
    return new mI(g2);
  }
  static roundConvexHull(A2, I2) {
    const g2 = new cI(A2, null, I2);
    return new mI(g2);
  }
  static roundConvexMesh(A2, I2, g2) {
    const C2 = new cI(A2, I2, g2);
    return new mI(C2);
  }
  setTranslation(A2, I2, g2) {
    if ("number" != typeof A2 || "number" != typeof I2 || "number" != typeof g2)
      throw TypeError("The translation components must be numbers.");
    return this.translation = { x: A2, y: I2, z: g2 }, this;
  }
  setRotation(A2) {
    return kA.copy(this.rotation, A2), this;
  }
  setSensor(A2) {
    return this.isSensor = A2, this;
  }
  setEnabled(A2) {
    return this.enabled = A2, this;
  }
  setContactSkin(A2) {
    return this.contactSkin = A2, this;
  }
  setDensity(A2) {
    return this.massPropsMode = LA.Density, this.density = A2, this;
  }
  setMass(A2) {
    return this.massPropsMode = LA.Mass, this.mass = A2, this;
  }
  setMassProperties(A2, I2, g2, C2) {
    return this.massPropsMode = LA.MassProps, this.mass = A2, wA.copy(this.centerOfMass, I2), wA.copy(this.principalAngularInertia, g2), kA.copy(this.angularInertiaLocalFrame, C2), this;
  }
  setRestitution(A2) {
    return this.restitution = A2, this;
  }
  setFriction(A2) {
    return this.friction = A2, this;
  }
  setFrictionCombineRule(A2) {
    return this.frictionCombineRule = A2, this;
  }
  setRestitutionCombineRule(A2) {
    return this.restitutionCombineRule = A2, this;
  }
  setCollisionGroups(A2) {
    return this.collisionGroups = A2, this;
  }
  setSolverGroups(A2) {
    return this.solverGroups = A2, this;
  }
  setActiveHooks(A2) {
    return this.activeHooks = A2, this;
  }
  setActiveEvents(A2) {
    return this.activeEvents = A2, this;
  }
  setActiveCollisionTypes(A2) {
    return this.activeCollisionTypes = A2, this;
  }
  setContactForceEventThreshold(A2) {
    return this.contactForceEventThreshold = A2, this;
  }
}
class fI {
  constructor(A2) {
    this.raw = A2 || new p(), this.map = new eA(), A2 && A2.forEachColliderHandle((A3) => {
      this.map.set(A3, new jI(this, A3, null));
    });
  }
  free() {
    this.raw && this.raw.free(), this.raw = void 0, this.map && this.map.clear(), this.map = void 0;
  }
  castClosure(A2) {
    return (I2) => A2 ? A2(this.get(I2)) : void 0;
  }
  finalizeDeserialization(A2) {
    this.map.forEach((I2) => I2.finalizeDeserialization(A2));
  }
  createCollider(A2, I2, g2) {
    let C2 = null != g2 && null != g2;
    if (C2 && isNaN(g2))
      throw Error("Cannot create a collider with a parent rigid-body handle that is not a number.");
    let B2 = I2.shape.intoRaw(), Q2 = wA.intoRaw(I2.translation), E2 = kA.intoRaw(I2.rotation), i2 = wA.intoRaw(I2.centerOfMass), D2 = wA.intoRaw(I2.principalAngularInertia), o2 = kA.intoRaw(I2.angularInertiaLocalFrame), G2 = this.raw.createCollider(I2.enabled, B2, Q2, E2, I2.massPropsMode, I2.mass, i2, D2, o2, I2.density, I2.friction, I2.restitution, I2.frictionCombineRule, I2.restitutionCombineRule, I2.isSensor, I2.collisionGroups, I2.solverGroups, I2.activeCollisionTypes, I2.activeHooks, I2.activeEvents, I2.contactForceEventThreshold, I2.contactSkin, C2, C2 ? g2 : 0, A2.raw);
    B2.free(), Q2.free(), E2.free(), i2.free(), D2.free(), o2.free();
    let w2 = C2 ? A2.get(g2) : null, S2 = new jI(this, G2, w2, I2.shape);
    return this.map.set(G2, S2), S2;
  }
  remove(A2, I2, g2, C2) {
    this.raw.remove(A2, I2.raw, g2.raw, C2), this.unmap(A2);
  }
  unmap(A2) {
    this.map.delete(A2);
  }
  get(A2) {
    return this.map.get(A2);
  }
  len() {
    return this.map.len();
  }
  contains(A2) {
    return null != this.get(A2);
  }
  forEach(A2) {
    this.map.forEach(A2);
  }
  getAll() {
    return this.map.getAll();
  }
}
function VI(A2, I2, g2, C2) {
  return new (g2 || (g2 = Promise))(function(B2, Q2) {
    function E2(A3) {
      try {
        D2(C2.next(A3));
      } catch (A4) {
        Q2(A4);
      }
    }
    function i2(A3) {
      try {
        D2(C2.throw(A3));
      } catch (A4) {
        Q2(A4);
      }
    }
    function D2(A3) {
      var I3;
      A3.done ? B2(A3.value) : (I3 = A3.value, I3 instanceof g2 ? I3 : new g2(function(A4) {
        A4(I3);
      })).then(E2, i2);
    }
    D2((C2 = C2.apply(A2, I2 || [])).next());
  });
}
for (var XI = { byteLength: function(A2) {
  var I2 = Ag(A2), g2 = I2[0], C2 = I2[1];
  return 3 * (g2 + C2) / 4 - C2;
}, toByteArray: function(A2) {
  var I2, g2, C2 = Ag(A2), B2 = C2[0], Q2 = C2[1], E2 = new zI(function(A3, I3, g3) {
    return 3 * (I3 + g3) / 4 - g3;
  }(0, B2, Q2)), i2 = 0, D2 = Q2 > 0 ? B2 - 4 : B2;
  for (g2 = 0; g2 < D2; g2 += 4)
    I2 = uI[A2.charCodeAt(g2)] << 18 | uI[A2.charCodeAt(g2 + 1)] << 12 | uI[A2.charCodeAt(g2 + 2)] << 6 | uI[A2.charCodeAt(g2 + 3)], E2[i2++] = I2 >> 16 & 255, E2[i2++] = I2 >> 8 & 255, E2[i2++] = 255 & I2;
  2 === Q2 && (I2 = uI[A2.charCodeAt(g2)] << 2 | uI[A2.charCodeAt(g2 + 1)] >> 4, E2[i2++] = 255 & I2);
  1 === Q2 && (I2 = uI[A2.charCodeAt(g2)] << 10 | uI[A2.charCodeAt(g2 + 1)] << 4 | uI[A2.charCodeAt(g2 + 2)] >> 2, E2[i2++] = I2 >> 8 & 255, E2[i2++] = 255 & I2);
  return E2;
}, fromByteArray: function(A2) {
  for (var I2, g2 = A2.length, C2 = g2 % 3, B2 = [], Q2 = 16383, E2 = 0, i2 = g2 - C2; E2 < i2; E2 += Q2)
    B2.push(Ig(A2, E2, E2 + Q2 > i2 ? i2 : E2 + Q2));
  1 === C2 ? (I2 = A2[g2 - 1], B2.push(PI[I2 >> 2] + PI[I2 << 4 & 63] + "==")) : 2 === C2 && (I2 = (A2[g2 - 2] << 8) + A2[g2 - 1], B2.push(PI[I2 >> 10] + PI[I2 >> 4 & 63] + PI[I2 << 2 & 63] + "="));
  return B2.join("");
} }, PI = [], uI = [], zI = "undefined" != typeof Uint8Array ? Uint8Array : Array, vI = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", _I = 0, $I = vI.length; _I < $I; ++_I)
  PI[_I] = vI[_I], uI[vI.charCodeAt(_I)] = _I;
function Ag(A2) {
  var I2 = A2.length;
  if (I2 % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var g2 = A2.indexOf("=");
  return -1 === g2 && (g2 = I2), [g2, g2 === I2 ? 0 : 4 - g2 % 4];
}
function Ig(A2, I2, g2) {
  for (var C2, B2, Q2 = [], E2 = I2; E2 < g2; E2 += 3)
    C2 = (A2[E2] << 16 & 16711680) + (A2[E2 + 1] << 8 & 65280) + (255 & A2[E2 + 2]), Q2.push(PI[(B2 = C2) >> 18 & 63] + PI[B2 >> 12 & 63] + PI[B2 >> 6 & 63] + PI[63 & B2]);
  return Q2.join("");
}
function gg() {
  return VI(this, void 0, void 0, function* () {
  });
}
function Cg() {
  return function() {
    let I2, g2;
    try {
      const Q2 = A.__wbindgen_add_to_stack_pointer(-16);
      A.version(Q2);
      var C2 = G()[Q2 / 4 + 0], B2 = G()[Q2 / 4 + 1];
      return I2 = C2, g2 = B2, k(C2, B2);
    } finally {
      A.__wbindgen_add_to_stack_pointer(16), A.__wbindgen_free(I2, g2, 1);
    }
  }();
}
uI["-".charCodeAt(0)] = 62, uI["_".charCodeAt(0)] = 63;
var Bg = Object.freeze({ __proto__: null, version: Cg, Vector3: GA, VectorOps: wA, Quaternion: SA, RotationOps: kA, SdpMatrix3: UA, SdpMatrix3Ops: aA, get RigidBodyType() {
  return KA;
}, RigidBody: tA, RigidBodyDesc: pA, RigidBodySet: rA, IntegrationParameters: dA, get JointType() {
  return hA;
}, get MotorModel() {
  return JA;
}, get JointAxesMask() {
  return yA;
}, ImpulseJoint: TA, UnitImpulseJoint: OA, FixedImpulseJoint: nA, RopeImpulseJoint: ZA, SpringImpulseJoint: bA, PrismaticImpulseJoint: xA, RevoluteImpulseJoint: WA, GenericImpulseJoint: jA, SphericalImpulseJoint: mA, JointData: fA, ImpulseJointSet: VA, MultibodyJoint: XA, UnitMultibodyJoint: PA, FixedMultibodyJoint: uA, PrismaticMultibodyJoint: zA, RevoluteMultibodyJoint: vA, SphericalMultibodyJoint: _A, MultibodyJointSet: $A, get CoefficientCombineRule() {
  return MA;
}, CCDSolver: AI, IslandManager: II, BroadPhase: gI, NarrowPhase: CI, TempContactManifold: BI, Shape: UI, get ShapeType() {
  return FA;
}, get HeightFieldFlags() {
  return RA;
}, get TriMeshFlags() {
  return qA;
}, Ball: aI, HalfSpace: KI, Cuboid: hI, RoundCuboid: JI, Capsule: yI, Segment: MI, Triangle: NI, RoundTriangle: FI, Polyline: RI, TriMesh: qI, ConvexPolyhedron: sI, RoundConvexPolyhedron: cI, Heightfield: YI, Cylinder: lI, RoundCylinder: HI, Cone: LI, RoundCone: tI, get ActiveCollisionTypes() {
  return HA;
}, Collider: jI, get MassPropsMode() {
  return LA;
}, ColliderDesc: mI, ColliderSet: fI, get FeatureType() {
  return NA;
}, Ray: DI, RayIntersection: oI, RayColliderIntersection: GI, RayColliderHit: wI, PointProjection: EI, PointColliderProjection: iI, ShapeCastHit: SI, ColliderShapeCastHit: kI, ShapeContact: QI, World: bI, PhysicsPipeline: pI, SerializationPipeline: rI, get ActiveEvents() {
  return cA;
}, TempContactForceEvent: xI, EventQueue: WI, get ActiveHooks() {
  return YA;
}, get SolverFlags() {
  return lA;
}, DebugRenderBuffers: dI, DebugRenderPipeline: TI, get QueryFilterFlags() {
  return sA;
}, QueryPipeline: eI, init: gg, CharacterCollision: OI, KinematicCharacterController: nI, DynamicRayCastVehicleController: ZI });
class RapierUtils {
  constructor(scene, world, rapier) {
    this.mesh = new LineSegments(new BufferGeometry(), new LineBasicMaterial({ color: 16777215, vertexColors: true }));
    this.world = world;
    this.rapier = rapier;
    this.mesh.frustumCulled = false;
    scene.add(this.mesh);
  }
  updateDebug(debug) {
    if (debug) {
      const { vertices, colors } = this.world.debugRender();
      this.mesh.geometry.setAttribute("position", new BufferAttribute(vertices, 3));
      this.mesh.geometry.setAttribute("color", new BufferAttribute(colors, 4));
      this.mesh.visible = true;
    } else {
      this.mesh.visible = false;
    }
  }
  getColliderDesc(geometry) {
    if (geometry instanceof BoxGeometry) {
      const sx = geometry.parameters.width !== void 0 ? geometry.parameters.width / 2 : 0.5;
      const sy = geometry.parameters.height !== void 0 ? geometry.parameters.height / 2 : 0.5;
      const sz = geometry.parameters.depth !== void 0 ? geometry.parameters.depth / 2 : 0.5;
      return this.rapier.ColliderDesc.cuboid(sx, sy, sz);
    }
    if (geometry instanceof SphereGeometry || geometry instanceof IcosahedronGeometry) {
      const radius = geometry.parameters.radius !== void 0 ? geometry.parameters.radius : 1;
      return this.rapier.ColliderDesc.ball(radius);
    }
    if (geometry instanceof BufferGeometry) {
      const points = new Float32Array(geometry.attributes.position.array);
      const colliderDesc = this.rapier.ColliderDesc.convexHull(points);
      return colliderDesc;
    }
    return void 0;
  }
  createInstanceRigidBody(instancedMesh, index) {
    const array = instancedMesh.instanceMatrix.array;
    const translation = new Vector3();
    translation.fromArray(array, index * 16 + 12);
    const quaternion = new Quaternion(0, 0, 0, 1);
    const rigidBody = this.createRigidBody(false, translation, quaternion);
    return rigidBody;
  }
  createRigidBody(fixed, position, quaternion) {
    const desc = fixed ? this.rapier.RigidBodyDesc.fixed() : Bg.RigidBodyDesc.dynamic();
    desc.setTranslation(...position.toArray());
    desc.setRotation(quaternion);
    const rigidBody = this.world.createRigidBody(desc);
    return rigidBody;
  }
  createCollider(colliderDesc, rigidBody) {
    if (colliderDesc) {
      const collider = this.world.createCollider(colliderDesc, rigidBody);
      return collider;
    }
    return void 0;
  }
  addInstancePhysics(instancedMesh, index) {
    const colliderDesc = this.getColliderDesc(instancedMesh.geometry);
    const rigidBody = this.createInstanceRigidBody(instancedMesh, index);
    const collider = this.createCollider(colliderDesc, rigidBody);
    const instancePhysics = {
      colliderDesc,
      rigidBody,
      collider
    };
    return instancePhysics;
  }
  removeInstancePhysics(instancePhysics) {
    if (instancePhysics.rigidBody) {
      this.world.removeRigidBody(instancePhysics.rigidBody);
    }
    if (instancePhysics.collider) {
      this.world.removeCollider(instancePhysics.collider, false);
    }
  }
  removeMeshPhysics(meshPhysics) {
    if (meshPhysics.rigidBody) {
      this.world.removeRigidBody(meshPhysics.rigidBody);
    }
    if (meshPhysics.collider) {
      this.world.removeCollider(meshPhysics.collider, false);
    }
  }
  addMeshPhysics(mesh, fixed) {
    const scaledMeshGeometry = new BufferGeometry();
    scaledMeshGeometry.copy(mesh.geometry);
    const scale = new Vector3();
    mesh.getWorldScale(scale);
    scaledMeshGeometry.scale(scale.x, scale.y, scale.z);
    const colliderDesc = this.getColliderDesc(scaledMeshGeometry);
    const rigidBody = this.createRigidBody(fixed, mesh.position, mesh.quaternion);
    let collider;
    if (colliderDesc) {
      collider = this.createCollider(colliderDesc, rigidBody);
    }
    const meshPhysics = {
      colliderDesc,
      rigidBody,
      collider
    };
    return meshPhysics;
  }
  setRigidBodyRotation(rigidBody, rotation) {
    const quaternion = new Quaternion().setFromEuler(new Euler(rotation.x, rotation.y, rotation.z));
    rigidBody.setRotation(quaternion, true);
  }
  attractToPoint(rigidBody, targetPoint, forceMagnitude) {
    const bodyPosition = new Vector3(rigidBody.translation().x, rigidBody.translation().y, rigidBody.translation().z);
    const direction = new Vector3().subVectors(targetPoint, bodyPosition);
    const distance = direction.length();
    direction.normalize();
    const scaleFactor = 1;
    const scaledForceMagnitude = forceMagnitude * distance * scaleFactor;
    const attractionImpulse = direction.multiplyScalar(scaledForceMagnitude);
    this.applyLinearImpulse(rigidBody, attractionImpulse);
  }
  applyLinearImpulse(rigidBody, linearImpulse) {
    const linearImpulseMultiplier = 1e-3;
    const finalImpulse = new Vector3(linearImpulse.x, linearImpulse.y, linearImpulse.z).multiplyScalar(linearImpulseMultiplier);
    rigidBody.applyImpulse(finalImpulse, true);
  }
  applyAngularImpulse(rigidBody, angularImpulse) {
    const linearImpulseMultiplier = 1e-6;
    const finalImpulse = new Vector3(angularImpulse.x, angularImpulse.y, angularImpulse.z).multiplyScalar(linearImpulseMultiplier);
    rigidBody.applyTorqueImpulse(finalImpulse, true);
  }
  getRandomPosition(position, randomness) {
    const finalPostion = new Vector3(
      position.x + (Math.random() - 0.5) * randomness.x,
      position.y + (Math.random() - 0.5) * randomness.y,
      position.z + (Math.random() - 0.5) * randomness.z
    );
    return finalPostion;
  }
}
const labels = {
  angularDamping: {
    en: "Angular Damping",
    es: "Amortiguación Angular"
  },
  angularInertia: {
    en: "Angular Inertia",
    es: "Inercia Angular"
  },
  angularImpulse: {
    en: "Angular Impulse",
    es: "Impulso Angular"
  },
  attractor: {
    en: "Attractor",
    es: "Atractor"
  },
  attractorPosition: {
    en: "Position",
    es: "Posición"
  },
  attractorForce: {
    en: "Force",
    es: "Fuerza"
  },
  bounciness: {
    en: "Bounciness",
    es: "Rebote"
  },
  centerOfGravity: {
    en: "Center of Gravity",
    es: "Centro de Gravedad"
  },
  count: {
    en: "Count",
    es: "Cuenta"
  },
  debug: {
    en: "Debug",
    es: "Debug"
  },
  fadeTime: {
    en: "Fade Time",
    es: "Tiempo Desaparición"
  },
  forces: {
    en: "Forces",
    es: "Fuerzas"
  },
  friction: {
    en: "Friction",
    es: "Fricción"
  },
  gravity: {
    en: "Gravity",
    es: "Gravedad"
  },
  geometry: {
    en: "Geometry",
    es: "Geometría"
  },
  lifeTime: {
    en: "Life Time (s)",
    es: "Ciclo de vida (s)"
  },
  linearDamping: {
    en: "Linear Damping",
    es: "Amortiguación Linear"
  },
  linearImpulse: {
    en: "Linear Impulse",
    es: "Impulso Linear"
  },
  mass: {
    en: "Mass",
    es: "Peso"
  },
  material: {
    en: "Material",
    es: "Material"
  },
  mesh: {
    en: "Mesh",
    es: "Objeto"
  },
  physics: {
    en: "Physics",
    es: "Físicas"
  },
  restitution: {
    en: "Bouncinness",
    es: "Rebote"
  },
  size: {
    en: "Size",
    es: "Tamaño"
  },
  thrower: {
    en: "Thrower",
    es: "Disparador"
  },
  throwTime: {
    en: "Throw Time",
    es: "Tiempo de disparo"
  },
  trigger: {
    en: "Trigger",
    es: "Trigger"
  },
  spawn: {
    en: "Spawn",
    es: "Disparo"
  },
  spawnPosition: {
    en: "Position",
    es: "Posición"
  },
  spawnRandomness: {
    en: "Randomness",
    es: "Aleatoriedad"
  }
};
let RAPIER_UTILS;
const DEFAULTS = {
  maxCount: 1e3,
  customMaterial: false,
  material: { digoType: "physical", color: 16777215 },
  objectId: "",
  spawnPosition: new Vector3(0, 2, 0),
  spawnRandomness: new Vector3(0.5, 0.5, 0.5),
  count: 100,
  lifeTime: 10,
  throwTime: 10,
  fadeTime: 0.5,
  trigger: 1,
  size: 1,
  mass: 1,
  angularInertia: 0.4,
  angularInertiaMultiplier: 10,
  linearDamping: 0,
  angularDamping: 0,
  restitution: 0.2,
  friction: 0.5,
  attractorPosition: new Vector3(0, 0, 0),
  attractorForce: 0,
  linearImpulse: new Vector3(0, 0, 0),
  angularImpulse: new Vector3(0, 0, 0)
};
class GeneralData extends AssetGeneralData {
}
class EntityData extends AssetEntityData {
  constructor() {
    super();
    this.properties = {
      objectId: DEFAULTS.objectId,
      material: { digoType: "physical", color: 16777215 },
      customMaterial: DEFAULTS.customMaterial,
      spawnPosition: DEFAULTS.spawnPosition,
      spawnRandomness: DEFAULTS.spawnRandomness,
      count: DEFAULTS.count,
      lifeTime: DEFAULTS.lifeTime,
      throwTime: DEFAULTS.throwTime,
      fadeTime: DEFAULTS.fadeTime,
      trigger: DEFAULTS.trigger,
      size: DEFAULTS.size,
      mass: DEFAULTS.mass,
      angularInertia: DEFAULTS.angularInertia,
      linearDamping: DEFAULTS.linearDamping,
      angularDamping: DEFAULTS.angularDamping,
      restitution: DEFAULTS.restitution,
      friction: DEFAULTS.friction,
      angularImpulse: DEFAULTS.angularImpulse,
      linearImpulse: DEFAULTS.linearImpulse,
      attractorPosition: DEFAULTS.attractorPosition,
      attractorForce: DEFAULTS.attractorForce
    };
    this.instancedMesh = new InstancedMesh(
      new BoxGeometry(0.05, 0.05, 0.05),
      new MeshPhysicalMaterial({ name: `${Math.random()}` }),
      DEFAULTS.maxCount
    );
    this.originalMaterial = new Material();
    this.material = new MeshPhysicalMaterial({ name: `${Math.random()}` });
    this.instances = [];
    this.throwerProperties = {
      previousTrigger: 0,
      lastActive: 0
    };
    this.setInstancedMesh();
  }
  createInstance() {
    return {
      physics: {},
      properties: {
        lifeTime: 0,
        throwTime: 0,
        state: 0
        /* sleeping */
      }
    };
  }
  setInstancedMesh() {
    const positionMatrix = new Matrix4();
    const position = new Vector3();
    const quaternion = new Quaternion();
    const scale = new Vector3();
    for (let i2 = 0; i2 < this.instancedMesh.count; i2++) {
      const startPosition = RAPIER_UTILS.getRandomPosition(DEFAULTS.spawnPosition, DEFAULTS.spawnRandomness);
      positionMatrix.setPosition(startPosition);
      positionMatrix.decompose(position, quaternion, scale);
      scale.set(0, 0, 0);
      positionMatrix.compose(position, quaternion, scale);
      this.instancedMesh.setMatrixAt(i2, positionMatrix);
      const instance = this.createInstance();
      this.instances.push(instance);
    }
    this.instancedMesh.instanceMatrix.setUsage(DynamicDrawUsage);
    this.instancedMesh.castShadow = true;
    this.instancedMesh.receiveShadow = true;
    this.instancedMesh.geometry.computeBoundingSphere();
    this.instancedMesh.geometry.computeBoundingBox();
  }
  setCustomMaterial(customMaterial) {
    this.instancedMesh.material = customMaterial ? this.material : this.originalMaterial;
  }
  throwInstance(index) {
    const instance = this.instances[index];
    instance.physics = RAPIER_UTILS.addInstancePhysics(this.instancedMesh, index);
    const translation = RAPIER_UTILS.getRandomPosition(this.properties.spawnPosition, this.properties.spawnRandomness);
    const rigidBody = instance.physics.rigidBody;
    this.setPhysicsProperties(instance);
    rigidBody.setTranslation(translation, true);
    const rotation = new Vector3(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    );
    RAPIER_UTILS.setRigidBodyRotation(rigidBody, rotation);
    instance.properties.lifeTime = 0;
    instance.properties.throwTime = 0;
    instance.properties.state = 2;
    RAPIER_UTILS.applyLinearImpulse(rigidBody, this.properties.linearImpulse);
    RAPIER_UTILS.applyAngularImpulse(rigidBody, this.properties.angularImpulse);
  }
  activeInstance(index, deltaTime) {
    const instance = this.instances[index];
    instance.properties.lifeTime += deltaTime;
    if (instance.properties.lifeTime >= this.properties.lifeTime && this.properties.lifeTime !== 0) {
      instance.properties.state = 3;
    } else {
      this.moveInstance(instance, index);
      RAPIER_UTILS.attractToPoint(instance.physics.rigidBody, this.properties.attractorPosition, this.properties.attractorForce);
    }
  }
  killInstance(index) {
    const instance = this.instances[index];
    this.fadeInstance(index, this.properties.fadeTime * 1e3);
    RAPIER_UTILS.removeInstancePhysics(instance.physics);
    instance.properties.lifeTime = 0;
    instance.properties.throwTime = 0;
    instance.properties.state = 0;
  }
  fadeInstance(index, milliseconds) {
    const startTime = Date.now();
    const position = new Vector3();
    const quaternion = new Quaternion();
    const scale = new Vector3();
    const instanceMatrix = new Matrix4();
    this.instancedMesh.getMatrixAt(index, instanceMatrix);
    instanceMatrix.decompose(position, quaternion, scale);
    const targetScale = new Vector3(0, 0, 0);
    const intervalId = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime >= milliseconds) {
        clearInterval(intervalId);
      }
      const progress = MathUtils.smoothstep(elapsedTime, 0, milliseconds);
      scale.lerp(targetScale, progress);
      const matrix = new Matrix4();
      matrix.compose(position, quaternion, scale);
      this.instancedMesh.setMatrixAt(index, matrix);
      this.instancedMesh.instanceMatrix.needsUpdate = true;
    }, 10);
  }
  moveInstance(instance, index) {
    const rigidBody = instance.physics.rigidBody;
    const quaternion = new Quaternion();
    const position = new Vector3();
    const scale = new Vector3(1, 1, 1);
    const matrix = new Matrix4();
    const array = this.instancedMesh.instanceMatrix.array;
    position.copy(rigidBody.translation());
    quaternion.copy(rigidBody.rotation());
    matrix.compose(position, quaternion, scale).toArray(array, index * 16);
  }
  setPhysicsProperties(instance) {
    const collider = instance.physics.collider;
    collider.setRestitution(this.properties.restitution);
    collider.setFriction(this.properties.friction);
    const rigidBody = instance.physics.rigidBody;
    const geometry = this.instancedMesh.geometry;
    Math.sqrt(geometry.boundingSphere.radius);
    const mass = this.properties.mass;
    const angularInertiaValue = this.properties.angularInertia;
    const angularInertia = new Vector3(angularInertiaValue, angularInertiaValue, angularInertiaValue);
    const centerOfMass = geometry.boundingBox.getCenter(new Vector3());
    const angularInertiaLocalFrame = new Bg.Quaternion(0, 0, 0, 1);
    rigidBody.setAdditionalMassProperties(mass, centerOfMass, angularInertia, angularInertiaLocalFrame, true);
    rigidBody.setAngularDamping(this.properties.angularDamping);
    rigidBody.setLinearDamping(this.properties.linearDamping);
  }
}
class Thrower extends DigoAssetThree {
  constructor(entities) {
    var _a, _b, _c;
    super();
    this.previousTime = 0;
    this.deltaTime = 0;
    const scene = (_a = Helper.getGlobal()) == null ? void 0 : _a.getThreeScene();
    const rapierWorld = (_b = Helper.getGlobal()) == null ? void 0 : _b.getRapierWorld();
    const rapierInstance = (_c = Helper.getGlobal()) == null ? void 0 : _c.getRapierInstance();
    const rapierUtils = new RapierUtils(scene, rapierWorld, rapierInstance);
    RAPIER_UTILS = rapierUtils;
    this.setLabels(labels);
    const generalData = new GeneralData();
    generalData.container = new Scene();
    this.setGeneralData(generalData);
    this.addDefaultProperties(true, true);
    this.addProperties();
    entities.forEach((entity) => {
      this.createEntity(entity);
    });
  }
  createEntity(id) {
    const entityData = new EntityData();
    const component = entityData.instancedMesh;
    entityData.component = component;
    this.addEntity(id, entityData);
    this.getContainer().add(component);
  }
  addProperties() {
    this.addMeshProperties();
    this.addThrowerProperties();
    this.addPhysicsProperties();
    this.addAttractorProperties();
  }
  addAttractorProperties() {
    this.addPropertyXYZ(ENTITY_PROPERTY, "attractorPosition", false, DEFAULTS.attractorPosition.x, DEFAULTS.attractorPosition.y, DEFAULTS.attractorPosition.z).group("attractor").setter((data, value) => {
      data.properties.attractorPosition = value;
    }).getter((data) => data.properties.attractorPosition);
    this.addPropertyNumber(ENTITY_PROPERTY, "attractorForce", 0, 1e3, 2, 0.01, DEFAULTS.attractorForce).group("attractor").setter((data, value) => {
      data.properties.attractorForce = value;
    }).getter((data) => data.properties.attractorForce);
  }
  addThrowerProperties() {
    this.addPropertyXYZ(ENTITY_PROPERTY, "spawnPosition", false, DEFAULTS.spawnPosition.x, DEFAULTS.spawnPosition.y, DEFAULTS.spawnPosition.z).group("thrower").setter((data, value) => {
      data.properties.spawnPosition = value;
    }).getter((data) => data.properties.spawnPosition);
    this.addPropertyXYZ(ENTITY_PROPERTY, "spawnRandomness", false, DEFAULTS.spawnRandomness.x, DEFAULTS.spawnRandomness.y, DEFAULTS.spawnRandomness.z).group("thrower").setter((data, value) => {
      data.properties.spawnRandomness = value;
    }).getter((data) => data.properties.spawnRandomness);
    this.addPropertyNumber(ENTITY_PROPERTY, "count", 1, DEFAULTS.maxCount, 0, 1, DEFAULTS.count).group("thrower").setter((data, value) => {
      data.properties.count = value;
    }).getter((data) => data.properties.count);
    this.addPropertyNumber(ENTITY_PROPERTY, "lifeTime", 0, 60, 2, 0.01, DEFAULTS.lifeTime).group("thrower").setter((data, value) => {
      data.properties.lifeTime = value;
    }).getter((data) => data.properties.lifeTime);
    this.addPropertyNumber(ENTITY_PROPERTY, "throwTime", 0, 60, 2, 0.01, DEFAULTS.throwTime).group("thrower").setter((data, value) => {
      data.properties.throwTime = value;
    }).getter((data) => data.properties.throwTime);
    this.addPropertyNumber(ENTITY_PROPERTY, "fadeTime", 0, 2, 2, 0.01, DEFAULTS.fadeTime).group("thrower").setter((data, value) => {
      data.properties.fadeTime = value;
    }).getter((data) => data.properties.fadeTime);
    this.addPropertyNumber(ENTITY_PROPERTY, "trigger", 0, 1, 2, 0.01, DEFAULTS.trigger).group("thrower").setter((data, value) => {
      data.properties.trigger = value;
    }).getter((data) => data.properties.trigger);
    this.addPropertyXYZ(ENTITY_PROPERTY, "linearImpulse", false, DEFAULTS.linearImpulse.x, DEFAULTS.linearImpulse.y, DEFAULTS.linearImpulse.z).group("thrower").setter((data, value) => {
      data.properties.linearImpulse = value;
    }).getter((data) => data.properties.linearImpulse);
    this.addPropertyXYZ(ENTITY_PROPERTY, "angularImpulse", false, DEFAULTS.angularImpulse.x, DEFAULTS.angularImpulse.y, DEFAULTS.angularImpulse.z).group("thrower").setter((data, value) => {
      data.properties.angularImpulse = value;
    }).getter((data) => data.properties.angularImpulse);
  }
  addMeshProperties() {
    this.addPropertyObject3D(ENTITY_PROPERTY, "geometry").group("mesh").setter((data, value) => {
      this.updateGeometry(data, value);
    }).getter((data) => data.properties.objectId);
    this.addPropertyBoolean(ENTITY_PROPERTY, "customMaterial", DEFAULTS.customMaterial).group("mesh").setter((data, value) => {
      data.properties.customMaterial = value;
      data.setCustomMaterial(value);
    }).getter((data) => data.properties.customMaterial);
    this.addPropertyMaterial(ENTITY_PROPERTY, "material", DEFAULTS.material).group("mesh").setter((data, value, property) => this.updateMaterial(data, data.properties, "material", property, value)).getter((data) => data.properties.material);
  }
  addPhysicsProperties() {
    this.addPropertyNumber(ENTITY_PROPERTY, "size", 0.01, 100, 2, 0.01, DEFAULTS.size).group("physics").setter((data, value) => {
      data.instancedMesh.geometry.scale(1 / data.properties.size, 1 / data.properties.size, 1 / data.properties.size);
      data.properties.size = value;
      data.instancedMesh.geometry.scale(data.properties.size, data.properties.size, data.properties.size);
      data.instancedMesh.geometry.computeVertexNormals();
      data.instancedMesh.geometry.computeBoundingSphere();
      data.instancedMesh.geometry.computeTangents();
      data.instancedMesh.geometry.computeBoundingBox();
    }).getter((data) => data.properties.size);
    this.addPropertyNumber(ENTITY_PROPERTY, "mass", 0, 100, 2, 0.01, DEFAULTS.mass).group("physics").setter((data, value) => {
      data.properties.mass = value;
    }).getter((data) => data.properties.mass);
    this.addPropertyNumber(ENTITY_PROPERTY, "angularInertia", 0, 2, 2, 0.01, DEFAULTS.angularInertia).group("physics").setter((data, value) => {
      data.properties.angularInertia = value / DEFAULTS.angularInertiaMultiplier;
    }).getter((data) => data.properties.angularInertia * DEFAULTS.angularInertiaMultiplier);
    this.addPropertyNumber(ENTITY_PROPERTY, "linearDamping", 0, 100, 2, 0.01, DEFAULTS.linearDamping).group("physics").setter((data, value) => {
      data.properties.linearDamping = value;
    }).getter((data) => data.properties.linearDamping);
    this.addPropertyNumber(ENTITY_PROPERTY, "angularDamping", 0, 100, 2, 0.01, DEFAULTS.angularDamping).group("physics").setter((data, value) => {
      data.properties.angularDamping = value;
    }).getter((data) => data.properties.angularDamping);
    this.addPropertyNumber(ENTITY_PROPERTY, "friction", 0, 10, 2, 0.01, DEFAULTS.friction).group("physics").setter((data, value) => {
      data.properties.friction = value;
    }).getter((data) => data.properties.friction);
    this.addPropertyNumber(ENTITY_PROPERTY, "restitution", 0, 10, 2, 0.01, DEFAULTS.restitution).group("physics").setter((data, value) => {
      data.properties.restitution = value;
    }).getter((data) => data.properties.restitution);
  }
  updateGeometry(data, id) {
    this.loadGLTF(id, (gltf) => {
      const geometries = [];
      let material = new Material();
      gltf.scene.traverse((node) => {
        if (node instanceof Mesh) {
          const mesh = node;
          geometries.push(mesh.geometry);
          material = node.material;
        }
      });
      const mergedGeometry = mergeGeometries(geometries);
      mergedGeometry.computeVertexNormals();
      mergedGeometry.computeBoundingSphere();
      mergedGeometry.computeTangents();
      mergedGeometry.computeBoundingBox();
      const size = mergedGeometry.boundingBox.getSize(new Vector3());
      const scaleFactor = 1 / Math.max(size.x, size.y, size.z) / 10;
      const scaleMatrix = new Matrix4().makeScale(scaleFactor, scaleFactor, scaleFactor);
      mergedGeometry.applyMatrix4(scaleMatrix);
      mergedGeometry.scale(data.properties.size, data.properties.size, data.properties.size);
      data.instancedMesh.geometry = mergedGeometry;
      data.originalMaterial = material;
      data.setCustomMaterial(data.properties.customMaterial);
    });
    data.properties.objectId = id;
  }
  tick(parameters) {
    this.deltaTime = parameters.elapsedTime - this.previousTime;
    this.previousTime = parameters.elapsedTime;
    this.getEntities().forEach(
      (entityName) => {
        const entityData = this.getEntity(entityName);
        const instances = entityData.instances;
        const properties = entityData.properties;
        const throwerProperties = entityData.throwerProperties;
        const count = entityData.instancedMesh.count;
        if (properties.trigger > 0.5 && throwerProperties.previousTrigger <= 0.5) {
          for (let i2 = 0; i2 < properties.count; i2++) {
            if (entityData.throwerProperties.lastActive >= count) {
              entityData.throwerProperties.lastActive = 0;
            }
            const instance = instances[entityData.throwerProperties.lastActive];
            const throwTime = parameters.elapsedTime + properties.throwTime * i2 / properties.count;
            instance.properties.lifeTime = 0;
            instance.properties.throwTime = throwTime;
            instance.properties.state = 1;
            entityData.throwerProperties.lastActive += 1;
          }
        }
        entityData.throwerProperties.previousTrigger = properties.trigger;
        for (let index = 0; index < count; index++) {
          const state = instances[index].properties.state;
          const throwTime = instances[index].properties.throwTime;
          if (state === 1 && throwTime <= parameters.elapsedTime && throwTime !== 0) {
            entityData.throwInstance(index);
          }
          if (state === 2) {
            entityData.activeInstance(index, this.deltaTime);
          }
          if (state === 3) {
            entityData.killInstance(index);
          }
        }
        entityData.instancedMesh.instanceMatrix.needsUpdate = true;
        entityData.instancedMesh.computeBoundingSphere();
      }
    );
    super.tick(parameters);
  }
}
const digoAssetData = {
  info: {
    name: {
      en: "Thrower",
      es: "Disparador"
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
    return new Thrower(entities || []);
  }
};
Helper.loadAsset(digoAssetData);