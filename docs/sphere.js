import { D as DataTextureLoader, H as HalfFloatType, F as FloatType, a as DataUtils, L as LinearSRGBColorSpace, b as LinearFilter, S as Scene, M as MeshPhysicalMaterial, c as SphereGeometry, d as Mesh, E as EquirectangularReflectionMapping } from "./three.js";
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
        updateMaterial: (mesh, property, value, previousValue) => {
        },
        setEnvironmentMap: (map) => {
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
  updateMaterial(mesh, object, field, property, value) {
    var _a;
    (_a = Helper.getGlobal()) == null ? void 0 : _a.updateMaterial(mesh, property, value, object[field]);
    object[field] = value;
  }
  tick(parameters) {
  }
}
class RGBELoader extends DataTextureLoader {
  constructor(manager) {
    super(manager);
    this.type = HalfFloatType;
  }
  // adapted from http://www.graphics.cornell.edu/~bjw/rgbe.html
  parse(buffer) {
    const rgbe_read_error = 1, rgbe_write_error = 2, rgbe_format_error = 3, rgbe_memory_error = 4, rgbe_error = function(rgbe_error_code, msg) {
      switch (rgbe_error_code) {
        case rgbe_read_error:
          throw new Error("THREE.RGBELoader: Read Error: " + (msg || ""));
        case rgbe_write_error:
          throw new Error("THREE.RGBELoader: Write Error: " + (msg || ""));
        case rgbe_format_error:
          throw new Error("THREE.RGBELoader: Bad File Format: " + (msg || ""));
        default:
        case rgbe_memory_error:
          throw new Error("THREE.RGBELoader: Memory Error: " + (msg || ""));
      }
    }, RGBE_VALID_PROGRAMTYPE = 1, RGBE_VALID_FORMAT = 2, RGBE_VALID_DIMENSIONS = 4, NEWLINE = "\n", fgets = function(buffer2, lineLimit, consume) {
      const chunkSize = 128;
      lineLimit = !lineLimit ? 1024 : lineLimit;
      let p = buffer2.pos, i = -1, len = 0, s = "", chunk = String.fromCharCode.apply(null, new Uint16Array(buffer2.subarray(p, p + chunkSize)));
      while (0 > (i = chunk.indexOf(NEWLINE)) && len < lineLimit && p < buffer2.byteLength) {
        s += chunk;
        len += chunk.length;
        p += chunkSize;
        chunk += String.fromCharCode.apply(null, new Uint16Array(buffer2.subarray(p, p + chunkSize)));
      }
      if (-1 < i) {
        if (false !== consume)
          buffer2.pos += len + i + 1;
        return s + chunk.slice(0, i);
      }
      return false;
    }, RGBE_ReadHeader = function(buffer2) {
      const magic_token_re = /^#\?(\S+)/, gamma_re = /^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/, exposure_re = /^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/, format_re = /^\s*FORMAT=(\S+)\s*$/, dimensions_re = /^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/, header = {
        valid: 0,
        /* indicate which fields are valid */
        string: "",
        /* the actual header string */
        comments: "",
        /* comments found in header */
        programtype: "RGBE",
        /* listed at beginning of file to identify it after "#?". defaults to "RGBE" */
        format: "",
        /* RGBE format, default 32-bit_rle_rgbe */
        gamma: 1,
        /* image has already been gamma corrected with given gamma. defaults to 1.0 (no correction) */
        exposure: 1,
        /* a value of 1.0 in an image corresponds to <exposure> watts/steradian/m^2. defaults to 1.0 */
        width: 0,
        height: 0
        /* image dimensions, width/height */
      };
      let line, match;
      if (buffer2.pos >= buffer2.byteLength || !(line = fgets(buffer2))) {
        rgbe_error(rgbe_read_error, "no header found");
      }
      if (!(match = line.match(magic_token_re))) {
        rgbe_error(rgbe_format_error, "bad initial token");
      }
      header.valid |= RGBE_VALID_PROGRAMTYPE;
      header.programtype = match[1];
      header.string += line + "\n";
      while (true) {
        line = fgets(buffer2);
        if (false === line)
          break;
        header.string += line + "\n";
        if ("#" === line.charAt(0)) {
          header.comments += line + "\n";
          continue;
        }
        if (match = line.match(gamma_re)) {
          header.gamma = parseFloat(match[1]);
        }
        if (match = line.match(exposure_re)) {
          header.exposure = parseFloat(match[1]);
        }
        if (match = line.match(format_re)) {
          header.valid |= RGBE_VALID_FORMAT;
          header.format = match[1];
        }
        if (match = line.match(dimensions_re)) {
          header.valid |= RGBE_VALID_DIMENSIONS;
          header.height = parseInt(match[1], 10);
          header.width = parseInt(match[2], 10);
        }
        if (header.valid & RGBE_VALID_FORMAT && header.valid & RGBE_VALID_DIMENSIONS)
          break;
      }
      if (!(header.valid & RGBE_VALID_FORMAT)) {
        rgbe_error(rgbe_format_error, "missing format specifier");
      }
      if (!(header.valid & RGBE_VALID_DIMENSIONS)) {
        rgbe_error(rgbe_format_error, "missing image size specifier");
      }
      return header;
    }, RGBE_ReadPixels_RLE = function(buffer2, w2, h2) {
      const scanline_width = w2;
      if (
        // run length encoding is not allowed so read flat
        scanline_width < 8 || scanline_width > 32767 || // this file is not run length encoded
        (2 !== buffer2[0] || 2 !== buffer2[1] || buffer2[2] & 128)
      ) {
        return new Uint8Array(buffer2);
      }
      if (scanline_width !== (buffer2[2] << 8 | buffer2[3])) {
        rgbe_error(rgbe_format_error, "wrong scanline width");
      }
      const data_rgba = new Uint8Array(4 * w2 * h2);
      if (!data_rgba.length) {
        rgbe_error(rgbe_memory_error, "unable to allocate buffer space");
      }
      let offset = 0, pos = 0;
      const ptr_end = 4 * scanline_width;
      const rgbeStart = new Uint8Array(4);
      const scanline_buffer = new Uint8Array(ptr_end);
      let num_scanlines = h2;
      while (num_scanlines > 0 && pos < buffer2.byteLength) {
        if (pos + 4 > buffer2.byteLength) {
          rgbe_error(rgbe_read_error);
        }
        rgbeStart[0] = buffer2[pos++];
        rgbeStart[1] = buffer2[pos++];
        rgbeStart[2] = buffer2[pos++];
        rgbeStart[3] = buffer2[pos++];
        if (2 != rgbeStart[0] || 2 != rgbeStart[1] || (rgbeStart[2] << 8 | rgbeStart[3]) != scanline_width) {
          rgbe_error(rgbe_format_error, "bad rgbe scanline format");
        }
        let ptr = 0, count;
        while (ptr < ptr_end && pos < buffer2.byteLength) {
          count = buffer2[pos++];
          const isEncodedRun = count > 128;
          if (isEncodedRun)
            count -= 128;
          if (0 === count || ptr + count > ptr_end) {
            rgbe_error(rgbe_format_error, "bad scanline data");
          }
          if (isEncodedRun) {
            const byteValue = buffer2[pos++];
            for (let i = 0; i < count; i++) {
              scanline_buffer[ptr++] = byteValue;
            }
          } else {
            scanline_buffer.set(buffer2.subarray(pos, pos + count), ptr);
            ptr += count;
            pos += count;
          }
        }
        const l = scanline_width;
        for (let i = 0; i < l; i++) {
          let off = 0;
          data_rgba[offset] = scanline_buffer[i + off];
          off += scanline_width;
          data_rgba[offset + 1] = scanline_buffer[i + off];
          off += scanline_width;
          data_rgba[offset + 2] = scanline_buffer[i + off];
          off += scanline_width;
          data_rgba[offset + 3] = scanline_buffer[i + off];
          offset += 4;
        }
        num_scanlines--;
      }
      return data_rgba;
    };
    const RGBEByteToRGBFloat = function(sourceArray, sourceOffset, destArray, destOffset) {
      const e = sourceArray[sourceOffset + 3];
      const scale = Math.pow(2, e - 128) / 255;
      destArray[destOffset + 0] = sourceArray[sourceOffset + 0] * scale;
      destArray[destOffset + 1] = sourceArray[sourceOffset + 1] * scale;
      destArray[destOffset + 2] = sourceArray[sourceOffset + 2] * scale;
      destArray[destOffset + 3] = 1;
    };
    const RGBEByteToRGBHalf = function(sourceArray, sourceOffset, destArray, destOffset) {
      const e = sourceArray[sourceOffset + 3];
      const scale = Math.pow(2, e - 128) / 255;
      destArray[destOffset + 0] = DataUtils.toHalfFloat(Math.min(sourceArray[sourceOffset + 0] * scale, 65504));
      destArray[destOffset + 1] = DataUtils.toHalfFloat(Math.min(sourceArray[sourceOffset + 1] * scale, 65504));
      destArray[destOffset + 2] = DataUtils.toHalfFloat(Math.min(sourceArray[sourceOffset + 2] * scale, 65504));
      destArray[destOffset + 3] = DataUtils.toHalfFloat(1);
    };
    const byteArray = new Uint8Array(buffer);
    byteArray.pos = 0;
    const rgbe_header_info = RGBE_ReadHeader(byteArray);
    const w = rgbe_header_info.width, h = rgbe_header_info.height, image_rgba_data = RGBE_ReadPixels_RLE(byteArray.subarray(byteArray.pos), w, h);
    let data, type;
    let numElements;
    switch (this.type) {
      case FloatType:
        numElements = image_rgba_data.length / 4;
        const floatArray = new Float32Array(numElements * 4);
        for (let j = 0; j < numElements; j++) {
          RGBEByteToRGBFloat(image_rgba_data, j * 4, floatArray, j * 4);
        }
        data = floatArray;
        type = FloatType;
        break;
      case HalfFloatType:
        numElements = image_rgba_data.length / 4;
        const halfArray = new Uint16Array(numElements * 4);
        for (let j = 0; j < numElements; j++) {
          RGBEByteToRGBHalf(image_rgba_data, j * 4, halfArray, j * 4);
        }
        data = halfArray;
        type = HalfFloatType;
        break;
      default:
        throw new Error("THREE.RGBELoader: Unsupported type: " + this.type);
    }
    return {
      width: w,
      height: h,
      data,
      header: rgbe_header_info.string,
      gamma: rgbe_header_info.gamma,
      exposure: rgbe_header_info.exposure,
      type
    };
  }
  setDataType(value) {
    this.type = value;
    return this;
  }
  load(url, onLoad, onProgress, onError) {
    function onLoadCallback(texture, texData) {
      switch (texture.type) {
        case FloatType:
        case HalfFloatType:
          texture.colorSpace = LinearSRGBColorSpace;
          texture.minFilter = LinearFilter;
          texture.magFilter = LinearFilter;
          texture.generateMipmaps = false;
          texture.flipY = true;
          break;
      }
      if (onLoad)
        onLoad(texture, texData);
    }
    return super.load(url, onLoadCallback, onProgress, onError);
  }
}
const labels = {
  yourPropertyId: {
    en: "English",
    es: "Spanish"
  }
};
class GeneralData extends AssetGeneralData {
}
class EntityData extends AssetEntityData {
  constructor() {
    super(...arguments);
    this.material = {};
  }
}
class Cube extends DigoAssetThree {
  constructor(entities) {
    super();
    this.setLabels(labels);
    this.addDefaultProperties(true, true);
    this.addPropertyMaterial(ENTITY_PROPERTY, "material", {}).setter((data, value, property) => {
      this.updateMaterial(data.component, data, "material", property, value);
    }).getter((data) => data.material);
    const generalData = new GeneralData();
    generalData.container = new Scene();
    this.setGeneralData(generalData);
    entities.forEach((entity) => {
      this.createEntity(entity);
    });
  }
  createMaterial(data) {
    data.material.digoType = "physical";
    data.material.color = Math.floor(Math.random() * 16777215);
    return new MeshPhysicalMaterial({ name: `${Math.random()}`, color: data.material.color });
  }
  createEntity(id) {
    var _a;
    const entityData = new EntityData();
    this.createMaterial(entityData);
    const geometry = new SphereGeometry(2, 100, 100);
    const mesh = new Mesh(geometry, this.createMaterial(entityData));
    mesh.position.x = 0;
    entityData.component = mesh;
    this.addEntity(id, entityData);
    this.getContainer().add(mesh);
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load(
      ((_a = Helper.getGlobal()) == null ? void 0 : _a.getResourceURL("1a57b2db-aaf7-4b21-9c7c-310c0f229ce0")) ?? "",
      (map) => {
        var _a2;
        console.log("Environemnt loaded!!");
        map.mapping = EquirectangularReflectionMapping;
        (_a2 = Helper.getGlobal()) == null ? void 0 : _a2.setEnvironmentMap(map);
      },
      () => console.log("progress"),
      (error) => console.log("error:", error)
    );
  }
}
const digoAssetData = {
  info: {
    name: {
      en: "Sphere",
      es: "Esfera"
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
console.log("Sphere asset loaded");
Helper.loadAsset(digoAssetData);
