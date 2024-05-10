import { B as BufferGeometry, a as BufferAttribute, S as ShaderMaterial, N as NoBlending, P as Points, b as BackSide, c as Scene, C as Camera, M as Mesh, d as PlaneGeometry, W as WebGLRenderTarget, R as RGBAFormat, D as DataTexture, F as FloatType, e as NearestFilter, f as ClampToEdgeWrapping, g as MeshBasicMaterial, O as Object3D, A as AmbientLight, h as PointLight, i as DirectionalLight, j as Color, U as Uniform, T as Texture, V as Vector3, k as Vector2 } from "./three.js";
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
const labels = {
  amount: {
    en: "Amount",
    es: "Cantidad"
  },
  speed: {
    en: "Speed",
    es: "Velocidad"
  },
  dieSpeed: {
    en: "Die Speed",
    es: "Desvanecimiento"
  },
  radius: {
    en: "Radius",
    es: "Radio"
  },
  curlSize: {
    en: "Curl Size",
    es: "Turbulencias"
  },
  attraction: {
    en: "Attraction",
    es: "Atracción"
  },
  baseColor: {
    en: "Base Color",
    es: "Color"
  },
  fadeColor: {
    en: "Fade Color",
    es: "Color Desvanecimiento"
  },
  shadow: {
    en: "Shadow",
    es: "Sombra"
  }
};
var particles_vertex_default = "uniform sampler2D texturePosition;\n\nvarying float vLife;\n\nvoid main() {\n\n    vec4 positionInfo = texture2D( texturePosition, position.xy );\n\n    vec4 worldPosition = modelMatrix * vec4( positionInfo.xyz, 1.0 );\n    vec4 mvPosition = viewMatrix * worldPosition;\n\n    \n\n    vLife = positionInfo.w;\n    gl_PointSize = 10.0 / length( mvPosition.xyz ) * smoothstep(0.0, 0.2, positionInfo.w);\n\n    gl_Position = projectionMatrix * mvPosition;\n\n}";
var particles_fragment_default = "varying float vLife;\nuniform vec3 color1;\nuniform vec3 color2;\n\nvoid main() {\n\n    vec3 outgoingLight = mix(color2, color1, smoothstep(0.0, 0.7, vLife));\n\n    \n\n    \n\n    \n    \n\n    gl_FragColor = vec4( outgoingLight, 1.0 );\n\n}";
var particles_distance_vertex_default = "uniform sampler2D texturePosition;\n\nvarying vec4 vWorldPosition;\n\nvoid main() {\n\n    vec4 positionInfo = texture2D( texturePosition, position.xy );\n\n    vec4 worldPosition = modelMatrix * vec4( positionInfo.xyz, 1.0 );\n    vec4 mvPosition = viewMatrix * worldPosition;\n\n    gl_PointSize = 50.0 / length( mvPosition.xyz );\n\n    vWorldPosition = worldPosition;\n\n    gl_Position = projectionMatrix * mvPosition;\n\n}";
var particles_distance_fragment_default = "uniform vec3 lightPos;\nvarying vec4 vWorldPosition;\n\nvec4 pack1K ( float depth ) {\n\n   depth /= 1000.0;\n   const vec4 bitSh = vec4( 256.0 * 256.0 * 256.0, 256.0 * 256.0, 256.0, 1.0 );\n   const vec4 bitMsk = vec4( 0.0, 1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0 );\n   vec4 res = fract( depth * bitSh );\n   res -= res.xxyz * bitMsk;\n   return res;\n\n}\n\nfloat unpack1K ( vec4 color ) {\n\n   const vec4 bitSh = vec4( 1.0 / ( 256.0 * 256.0 * 256.0 ), 1.0 / ( 256.0 * 256.0 ), 1.0 / 256.0, 1.0 );\n   return dot( color, bitSh ) * 1000.0;\n\n}\n\nvoid main () {\n\n   gl_FragColor = pack1K( length( vWorldPosition.xyz - lightPos.xyz ) );\n   \n\n}";
function initializeParticles(entityData, container) {
  const particleMesh = createParticleMesh(entityData);
  container.add(particleMesh);
}
function createParticleMesh(entityData) {
  const width = DEFAULTS.resolution.width;
  const height = DEFAULTS.resolution.height;
  const amount = width * height;
  const position = new Float32Array(amount * 3);
  let i3;
  for (let i = 0; i < amount; i++) {
    i3 = i * 3;
    position[i3 + 0] = i % width / width;
    position[i3 + 1] = ~~(i / width) / height;
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(position, 3));
  const material = new ShaderMaterial({
    uniforms: {
      texturePosition: entityData.settings.texturePosition,
      color1: entityData.settings.color1,
      color2: entityData.settings.color2
    },
    vertexShader: particles_vertex_default,
    fragmentShader: particles_fragment_default,
    blending: NoBlending
  });
  const mesh = new Points(geometry, material);
  mesh.customDistanceMaterial = new ShaderMaterial({
    uniforms: {
      lightPos: entityData.settings.lightPosition,
      texturePosition: entityData.settings.texturePosition
    },
    vertexShader: particles_distance_vertex_default,
    fragmentShader: particles_distance_fragment_default,
    depthTest: true,
    depthWrite: true,
    side: BackSide,
    blending: NoBlending
  });
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}
var position_fragment_default = "uniform sampler2D textureDefaultPosition;\nuniform float time;\nuniform vec2  res;\nuniform float speed;\nuniform float dieSpeed;\nuniform float radius;\nuniform float curlSize;\nuniform float attraction;\nuniform float initAnimation;\nuniform vec3 mouse3d;\n\nvec4 mod289(vec4 x) {\n    return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nfloat mod289(float x) {\n    return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 permute(vec4 x) {\n    return mod289(((x*34.0)+1.0)*x);\n}\n\nfloat permute(float x) {\n    return mod289(((x*34.0)+1.0)*x);\n}\n\nvec4 taylorInvSqrt(vec4 r) {\n    return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nfloat taylorInvSqrt(float r) {\n    return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nvec4 grad4(float j, vec4 ip) {\n    const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);\n    vec4 p,s;\n\n    p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;\n    p.w = 1.5 - dot(abs(p.xyz), ones.xyz);\n    s = vec4(lessThan(p, vec4(0.0)));\n    p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;\n\n    return p;\n}\n\n#define F4 0.309016994374947451\n\nvec4 simplexNoiseDerivatives (vec4 v) {\n    const vec4  C = vec4( 0.138196601125011,0.276393202250021,0.414589803375032,-0.447213595499958);\n\n    vec4 i  = floor(v + dot(v, vec4(F4)) );\n    vec4 x0 = v -   i + dot(i, C.xxxx);\n\n    vec4 i0;\n    vec3 isX = step( x0.yzw, x0.xxx );\n    vec3 isYZ = step( x0.zww, x0.yyz );\n    i0.x = isX.x + isX.y + isX.z;\n    i0.yzw = 1.0 - isX;\n    i0.y += isYZ.x + isYZ.y;\n    i0.zw += 1.0 - isYZ.xy;\n    i0.z += isYZ.z;\n    i0.w += 1.0 - isYZ.z;\n\n    vec4 i3 = clamp( i0, 0.0, 1.0 );\n    vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );\n    vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );\n\n    vec4 x1 = x0 - i1 + C.xxxx;\n    vec4 x2 = x0 - i2 + C.yyyy;\n    vec4 x3 = x0 - i3 + C.zzzz;\n    vec4 x4 = x0 + C.wwww;\n\n    i = mod289(i);\n    float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);\n    vec4 j1 = permute( permute( permute( permute (\n             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))\n           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))\n           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))\n           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));\n\n    vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;\n\n    vec4 p0 = grad4(j0,   ip);\n    vec4 p1 = grad4(j1.x, ip);\n    vec4 p2 = grad4(j1.y, ip);\n    vec4 p3 = grad4(j1.z, ip);\n    vec4 p4 = grad4(j1.w, ip);\n\n    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n    p0 *= norm.x;\n    p1 *= norm.y;\n    p2 *= norm.z;\n    p3 *= norm.w;\n    p4 *= taylorInvSqrt(dot(p4,p4));\n\n    vec3 values0 = vec3(dot(p0, x0), dot(p1, x1), dot(p2, x2)); \n    vec2 values1 = vec2(dot(p3, x3), dot(p4, x4));\n\n    vec3 m0 = max(0.5 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0); \n    vec2 m1 = max(0.5 - vec2(dot(x3,x3), dot(x4,x4)), 0.0);\n\n    vec3 temp0 = -6.0 * m0 * m0 * values0;\n    vec2 temp1 = -6.0 * m1 * m1 * values1;\n\n    vec3 mmm0 = m0 * m0 * m0;\n    vec2 mmm1 = m1 * m1 * m1;\n\n    float dx = temp0[0] * x0.x + temp0[1] * x1.x + temp0[2] * x2.x + temp1[0] * x3.x + temp1[1] * x4.x + mmm0[0] * p0.x + mmm0[1] * p1.x + mmm0[2] * p2.x + mmm1[0] * p3.x + mmm1[1] * p4.x;\n    float dy = temp0[0] * x0.y + temp0[1] * x1.y + temp0[2] * x2.y + temp1[0] * x3.y + temp1[1] * x4.y + mmm0[0] * p0.y + mmm0[1] * p1.y + mmm0[2] * p2.y + mmm1[0] * p3.y + mmm1[1] * p4.y;\n    float dz = temp0[0] * x0.z + temp0[1] * x1.z + temp0[2] * x2.z + temp1[0] * x3.z + temp1[1] * x4.z + mmm0[0] * p0.z + mmm0[1] * p1.z + mmm0[2] * p2.z + mmm1[0] * p3.z + mmm1[1] * p4.z;\n    float dw = temp0[0] * x0.w + temp0[1] * x1.w + temp0[2] * x2.w + temp1[0] * x3.w + temp1[1] * x4.w + mmm0[0] * p0.w + mmm0[1] * p1.w + mmm0[2] * p2.w + mmm1[0] * p3.w + mmm1[1] * p4.w;\n\n    return vec4(dx, dy, dz, dw) * 49.0;\n}\n\nvec3 curl( in vec3 p, in float noiseTime, in float persistence ) {\n\n    vec4 xNoisePotentialDerivatives = vec4(0.0);\n    vec4 yNoisePotentialDerivatives = vec4(0.0);\n    vec4 zNoisePotentialDerivatives = vec4(0.0);\n\n    for (int i = 0; i < 3; ++i) {\n\n        float twoPowI = pow(2.0, float(i));\n        float scale = 0.5 * twoPowI * pow(persistence, float(i));\n\n        xNoisePotentialDerivatives += simplexNoiseDerivatives(vec4(p * twoPowI, noiseTime)) * scale;\n        yNoisePotentialDerivatives += simplexNoiseDerivatives(vec4((p + vec3(123.4, 129845.6, -1239.1)) * twoPowI, noiseTime)) * scale;\n        zNoisePotentialDerivatives += simplexNoiseDerivatives(vec4((p + vec3(-9519.0, 9051.0, -123.0)) * twoPowI, noiseTime)) * scale;\n    }\n\n    return vec3(\n        zNoisePotentialDerivatives[1] - yNoisePotentialDerivatives[2],\n        xNoisePotentialDerivatives[2] - zNoisePotentialDerivatives[0],\n        yNoisePotentialDerivatives[0] - xNoisePotentialDerivatives[1]\n    );\n\n}\n\nvoid main() {\n\n    vec2 uv = gl_FragCoord.xy / res.xy;\n\n    vec4 positionInfo = texture2D( texturePosition, uv );\n    vec3 position = mix(vec3(0.0, -200.0, 0.0), positionInfo.xyz, smoothstep(0.0, 0.3, initAnimation));\n    float life = positionInfo.a - dieSpeed;\n\n    vec3 followPosition = mix(vec3(0.0, -(1.0 - initAnimation) * 200.0, 0.0), mouse3d, smoothstep(0.2, 0.7, initAnimation));\n\n    if(life < 0.0) {\n        positionInfo = texture2D( textureDefaultPosition, uv );\n        position = positionInfo.xyz * (1.0 + sin(time * 15.0) * 0.2 + (1.0 - initAnimation)) * 0.4 * radius;\n        position += followPosition;\n        life = 0.5 + fract(positionInfo.w * 21.4131 + time);\n    } else {\n        vec3 delta = followPosition - position;\n        position += delta * (0.005 + life * 0.01) * attraction * (1.0 - smoothstep(50.0, 350.0, length(delta))) *speed;\n        position += curl(position * curlSize, time, 0.1 + (1.0 - life) * 0.1) *speed;\n    }\n\n    gl_FragColor = vec4(position, life);\n    \n\n}";
class GPUComputationRenderer {
  constructor(sizeX, sizeY, renderer) {
    this.variables = [];
    this.currentTextureIndex = 0;
    let dataType = FloatType;
    const scene = new Scene();
    const camera = new Camera();
    camera.position.z = 1;
    const passThruUniforms = {
      passThruTexture: { value: null }
    };
    const passThruShader = createShaderMaterial(getPassThroughFragmentShader(), passThruUniforms);
    const mesh = new Mesh(new PlaneGeometry(2, 2), passThruShader);
    scene.add(mesh);
    this.setDataType = function(type) {
      dataType = type;
      return this;
    };
    this.addVariable = function(variableName, computeFragmentShader, initialValueTexture) {
      const material = this.createShaderMaterial(computeFragmentShader);
      const variable = {
        name: variableName,
        initialValueTexture,
        material,
        dependencies: null,
        renderTargets: [],
        wrapS: null,
        wrapT: null,
        minFilter: NearestFilter,
        magFilter: NearestFilter
      };
      this.variables.push(variable);
      return variable;
    };
    this.setVariableDependencies = function(variable, dependencies) {
      variable.dependencies = dependencies;
    };
    this.init = function() {
      if (renderer.capabilities.isWebGL2 === false && renderer.extensions.has("OES_texture_float") === false) {
        return "No OES_texture_float support for float textures.";
      }
      if (renderer.capabilities.maxVertexTextures === 0) {
        return "No support for vertex shader textures.";
      }
      for (let i = 0; i < this.variables.length; i++) {
        const variable = this.variables[i];
        variable.renderTargets[0] = this.createRenderTarget(sizeX, sizeY, variable.wrapS, variable.wrapT, variable.minFilter, variable.magFilter);
        variable.renderTargets[1] = this.createRenderTarget(sizeX, sizeY, variable.wrapS, variable.wrapT, variable.minFilter, variable.magFilter);
        this.renderTexture(variable.initialValueTexture, variable.renderTargets[0]);
        this.renderTexture(variable.initialValueTexture, variable.renderTargets[1]);
        const material = variable.material;
        const uniforms = material.uniforms;
        if (variable.dependencies !== null) {
          for (let d = 0; d < variable.dependencies.length; d++) {
            const depVar = variable.dependencies[d];
            if (depVar.name !== variable.name) {
              let found = false;
              for (let j = 0; j < this.variables.length; j++) {
                if (depVar.name === this.variables[j].name) {
                  found = true;
                  break;
                }
              }
              if (!found) {
                return "Variable dependency not found. Variable=" + variable.name + ", dependency=" + depVar.name;
              }
            }
            uniforms[depVar.name] = { value: null };
            material.fragmentShader = "\nuniform sampler2D " + depVar.name + ";\n" + material.fragmentShader;
          }
        }
      }
      this.currentTextureIndex = 0;
      return null;
    };
    this.compute = function() {
      const currentTextureIndex = this.currentTextureIndex;
      const nextTextureIndex = this.currentTextureIndex === 0 ? 1 : 0;
      for (let i = 0, il = this.variables.length; i < il; i++) {
        const variable = this.variables[i];
        if (variable.dependencies !== null) {
          const uniforms = variable.material.uniforms;
          for (let d = 0, dl = variable.dependencies.length; d < dl; d++) {
            const depVar = variable.dependencies[d];
            uniforms[depVar.name].value = depVar.renderTargets[currentTextureIndex].texture;
          }
        }
        this.doRenderTarget(variable.material, variable.renderTargets[nextTextureIndex]);
      }
      this.currentTextureIndex = nextTextureIndex;
    };
    this.getCurrentRenderTarget = function(variable) {
      return variable.renderTargets[this.currentTextureIndex];
    };
    this.getAlternateRenderTarget = function(variable) {
      return variable.renderTargets[this.currentTextureIndex === 0 ? 1 : 0];
    };
    this.dispose = function() {
      mesh.geometry.dispose();
      mesh.material.dispose();
      const variables = this.variables;
      for (let i = 0; i < variables.length; i++) {
        const variable = variables[i];
        if (variable.initialValueTexture)
          variable.initialValueTexture.dispose();
        const renderTargets = variable.renderTargets;
        for (let j = 0; j < renderTargets.length; j++) {
          const renderTarget = renderTargets[j];
          renderTarget.dispose();
        }
      }
    };
    function addResolutionDefine(materialShader) {
      materialShader.defines.resolution = "vec2( " + sizeX.toFixed(1) + ", " + sizeY.toFixed(1) + " )";
    }
    this.addResolutionDefine = addResolutionDefine;
    function createShaderMaterial(computeFragmentShader, uniforms) {
      uniforms = uniforms || {};
      const material = new ShaderMaterial({
        name: "GPUComputationShader",
        uniforms,
        vertexShader: getPassThroughVertexShader(),
        fragmentShader: computeFragmentShader
      });
      addResolutionDefine(material);
      return material;
    }
    this.createShaderMaterial = createShaderMaterial;
    this.createRenderTarget = function(sizeXTexture, sizeYTexture, wrapS, wrapT, minFilter, magFilter) {
      sizeXTexture = sizeXTexture || sizeX;
      sizeYTexture = sizeYTexture || sizeY;
      wrapS = wrapS || ClampToEdgeWrapping;
      wrapT = wrapT || ClampToEdgeWrapping;
      minFilter = minFilter || NearestFilter;
      magFilter = magFilter || NearestFilter;
      const renderTarget = new WebGLRenderTarget(sizeXTexture, sizeYTexture, {
        wrapS,
        wrapT,
        minFilter,
        magFilter,
        format: RGBAFormat,
        type: dataType,
        depthBuffer: false
      });
      return renderTarget;
    };
    this.createTexture = function() {
      const data = new Float32Array(sizeX * sizeY * 4);
      const texture = new DataTexture(data, sizeX, sizeY, RGBAFormat, FloatType);
      texture.needsUpdate = true;
      return texture;
    };
    this.renderTexture = function(input, output) {
      passThruUniforms.passThruTexture.value = input;
      this.doRenderTarget(passThruShader, output);
      passThruUniforms.passThruTexture.value = null;
    };
    this.doRenderTarget = function(material, output) {
      const currentRenderTarget = renderer.getRenderTarget();
      const currentXrEnabled = renderer.xr.enabled;
      const currentShadowAutoUpdate = renderer.shadowMap.autoUpdate;
      renderer.xr.enabled = false;
      renderer.shadowMap.autoUpdate = false;
      mesh.material = material;
      renderer.setRenderTarget(output);
      renderer.render(scene, camera);
      mesh.material = passThruShader;
      renderer.xr.enabled = currentXrEnabled;
      renderer.shadowMap.autoUpdate = currentShadowAutoUpdate;
      renderer.setRenderTarget(currentRenderTarget);
    };
    function getPassThroughVertexShader() {
      return "void main()	{\n\n	gl_Position = vec4( position, 1.0 );\n\n}\n";
    }
    function getPassThroughFragmentShader() {
      return "uniform sampler2D passThruTexture;\n\nvoid main() {\n\n	vec2 uv = gl_FragCoord.xy / resolution.xy;\n\n	gl_FragColor = texture2D( passThruTexture, uv );\n\n}\n";
    }
  }
}
function initializeSimulator(entityData, container) {
  const amount = DEFAULTS.resolution.width * DEFAULTS.resolution.height;
  const renderer = Helper.getGlobal().getThreeWebGLRenderer();
  entityData.gpgpu.size = Math.ceil(Math.sqrt(amount));
  entityData.gpgpu.computation = new GPUComputationRenderer(entityData.gpgpu.size, entityData.gpgpu.size, renderer);
  const baseParticlesTexture = entityData.gpgpu.computation.createTexture();
  setPositionTexture(baseParticlesTexture, amount);
  entityData.settings.textureDefaultPosition.value = baseParticlesTexture;
  entityData.gpgpu.particlesVariable = entityData.gpgpu.computation.addVariable("texturePosition", position_fragment_default, baseParticlesTexture);
  entityData.gpgpu.computation.setVariableDependencies(entityData.gpgpu.particlesVariable, [entityData.gpgpu.particlesVariable]);
  entityData.gpgpu.particlesVariable.material.uniforms = {
    res: entityData.settings.resolution,
    textureDefaultPosition: entityData.settings.textureDefaultPosition,
    mouse3d: entityData.settings.followPosition,
    speed: entityData.parameters.speed,
    dieSpeed: entityData.parameters.dieSpeed,
    radius: entityData.parameters.radius,
    curlSize: entityData.parameters.curlSize,
    attraction: entityData.parameters.attraction,
    time: entityData.settings.time,
    initAnimation: entityData.settings.initAnimation
  };
  entityData.gpgpu.computation.init();
  entityData.gpgpu.debug = new Mesh(
    new PlaneGeometry(1, 1),
    new MeshBasicMaterial({ map: entityData.gpgpu.computation.getCurrentRenderTarget(entityData.gpgpu.particlesVariable).texture })
  );
  entityData.gpgpu.debug.position.x = 3;
  entityData.gpgpu.debug.visible = false;
  container.add(entityData.gpgpu.debug);
}
function setPositionTexture(texture, amount) {
  for (let i = 0; i < amount; i++) {
    const i4 = i * 4;
    const r = (0.5 + Math.random() * 0.5) * 1;
    const phi = (Math.random() - 0.5) * Math.PI;
    const theta = Math.random() * Math.PI * 2;
    texture.image.data[i4 + 0] = r * Math.cos(theta) * Math.cos(phi);
    texture.image.data[i4 + 1] = r * Math.sin(phi);
    texture.image.data[i4 + 2] = r * Math.sin(theta) * Math.cos(phi);
    texture.image.data[i4 + 3] = Math.random();
  }
  return texture;
}
function initializeLights(entityData, container) {
  Helper.getGlobal().getThreeWebGLRenderer().shadowMap.enabled = true;
  const lightsContainer = new Object3D();
  lightsContainer.position.set(0, 500, 0);
  const ambient = new AmbientLight(3355443);
  container.add(ambient);
  const pointLight = new PointLight(16777215, 1, 700);
  pointLight.castShadow = true;
  pointLight.shadow.camera.near = 10;
  pointLight.shadow.camera.far = 700;
  pointLight.shadow.camera.fov = 90;
  pointLight.shadow.bias = 0.1;
  pointLight.intensity = 0.5;
  pointLight.shadow.mapSize.set(4096, 2048);
  lightsContainer.add(pointLight);
  entityData.lights.pointLight = pointLight;
  const directionalLight = new DirectionalLight(12225419, 0.5);
  directionalLight.position.set(1, 1, 1);
  lightsContainer.add(directionalLight);
  const directionalLight2 = new DirectionalLight(9157300, 0.3);
  directionalLight2.position.set(1, 1, -1);
  lightsContainer.add(directionalLight2);
  container.add(lightsContainer);
}
const DEFAULTS = {
  speed: 10,
  speedMultiplier: 5e-4,
  dieSpeed: 20,
  dieSpeedMultiplier: 5e-4,
  radius: 30,
  radiusMultiplier: 0.05,
  curlSize: 40,
  curlSizeMultiplier: 0.01,
  attraction: 10,
  attractionMultiplier: 0.1,
  baseColor: 0,
  fadeColor: 13684944,
  shadow: 0.45,
  resolution: {
    width: 256,
    height: 256
  }
};
class GeneralData extends AssetGeneralData {
}
class EntityData extends AssetEntityData {
  constructor() {
    super(...arguments);
    this.parameters = {
      speed: new Uniform(DEFAULTS.speed * DEFAULTS.speedMultiplier),
      dieSpeed: new Uniform(DEFAULTS.dieSpeed * DEFAULTS.dieSpeed),
      radius: new Uniform(DEFAULTS.radius * DEFAULTS.radius),
      curlSize: new Uniform(DEFAULTS.curlSize * DEFAULTS.curlSize),
      attraction: new Uniform(DEFAULTS.attraction * DEFAULTS.attraction),
      baseColor: new Uniform(new Color(DEFAULTS.baseColor)),
      fadeColor: new Uniform(new Color(DEFAULTS.fadeColor)),
      shadow: DEFAULTS.shadow
    };
    this.settings = {
      texturePosition: new Uniform(new Texture()),
      textureDefaultPosition: new Uniform(new Texture()),
      lightPosition: new Uniform(new Vector3()),
      time: new Uniform(0),
      initAnimation: new Uniform(0),
      resolution: new Uniform(new Vector2(DEFAULTS.resolution.width, DEFAULTS.resolution.height)),
      position: new Uniform(new Vector3()),
      followPosition: new Uniform(new Vector3()),
      color1: new Uniform(new Color(DEFAULTS.baseColor)),
      color2: new Uniform(new Color(DEFAULTS.fadeColor))
    };
    this.gpgpu = {};
    this.lights = {};
  }
}
class TheSpirit extends DigoAssetThree {
  constructor(entities) {
    super();
    this.previousTime = 0;
    this.deltaTime = 0;
    this.setLabels(labels);
    this.addDefaultProperties(true, true);
    this.addPropertyNumber(ENTITY_PROPERTY, "speed", 0, 100, 0, 1, DEFAULTS.speed).setter((data, value) => {
      data.parameters.speed.value = value * DEFAULTS.speedMultiplier;
    }).getter((data) => data.parameters.speed.value / DEFAULTS.speedMultiplier);
    this.addPropertyNumber(ENTITY_PROPERTY, "dieSpeed", 0, 100, 0, 1, DEFAULTS.dieSpeed).setter((data, value) => {
      data.parameters.dieSpeed.value = value * DEFAULTS.dieSpeedMultiplier;
    }).getter((data) => data.parameters.dieSpeed.value / DEFAULTS.dieSpeedMultiplier);
    this.addPropertyNumber(ENTITY_PROPERTY, "radius", 1, 100, 0, 1, DEFAULTS.radius).setter((data, value) => {
      data.parameters.radius.value = value * DEFAULTS.radiusMultiplier;
    }).getter((data) => data.parameters.radius.value / DEFAULTS.radiusMultiplier);
    this.addPropertyNumber(ENTITY_PROPERTY, "curlSize", 0, 100, 0, 1, DEFAULTS.curlSize).setter((data, value) => {
      data.parameters.curlSize.value = value * DEFAULTS.curlSizeMultiplier;
    }).getter((data) => data.parameters.curlSize.value / DEFAULTS.curlSizeMultiplier);
    this.addPropertyNumber(ENTITY_PROPERTY, "attraction", 0, 100, 0, 1, DEFAULTS.attraction).setter((data, value) => {
      data.parameters.attraction.value = value * DEFAULTS.attractionMultiplier;
    }).getter((data) => data.parameters.attraction.value / DEFAULTS.attractionMultiplier);
    this.addPropertyColor(ENTITY_PROPERTY, "baseColor", DEFAULTS.baseColor).setter((data, value) => {
      data.parameters.baseColor.value = new Color(value >>> 8);
    }).getter((data) => Number.parseInt(`${data.parameters.baseColor.value.getHex().toString(16)}ff`, 16));
    this.addPropertyColor(ENTITY_PROPERTY, "fadeColor", DEFAULTS.fadeColor).setter((data, value) => {
      data.parameters.fadeColor.value = new Color(value >>> 8);
    }).getter((data) => Number.parseInt(`${data.parameters.fadeColor.value.getHex().toString(16)}ff`, 16));
    this.addPropertyNumber(ENTITY_PROPERTY, "shadow", 0, 1, 2, 0.01, DEFAULTS.shadow).setter((data, value) => {
      data.parameters.shadow = value;
    }).getter((data) => data.parameters.shadow);
    const generalData = new GeneralData();
    generalData.container = new Scene();
    this.setGeneralData(generalData);
    entities.forEach((entity) => {
      this.createEntity(entity);
    });
  }
  createEntity(id) {
    const entityData = new EntityData();
    const container = new Object3D();
    initializeParticles(entityData, container);
    initializeSimulator(entityData, container);
    initializeLights(entityData, container);
    entityData.component = container;
    this.addEntity(id, entityData);
    this.getContainer().add(container);
  }
  tick(parameters) {
    this.deltaTime = (parameters.elapsedTime - this.previousTime) * 1e3;
    this.previousTime = parameters.elapsedTime;
    this.deltaTime / 16.6667;
    this.getEntities().forEach((entityName) => {
      const entityData = this.getEntity(entityName);
      entityData.settings.color1.value.lerp(entityData.parameters.baseColor.value, 0.05);
      entityData.settings.color2.value.lerp(entityData.parameters.fadeColor.value, 0.05);
      entityData.settings.initAnimation.value = Math.min(entityData.settings.initAnimation.value + this.deltaTime * 25e-5, 1);
      entityData.settings.time.value = parameters.elapsedTime;
      entityData.gpgpu.computation.compute();
      entityData.settings.texturePosition.value = entityData.gpgpu.computation.getCurrentRenderTarget(entityData.gpgpu.particlesVariable).texture;
      entityData.lights.pointLight.intensity = entityData.parameters.shadow;
    });
    super.tick(parameters);
  }
}
const digoAssetData = {
  info: {
    name: {
      en: "The Spirit",
      es: "El Espíritu"
    },
    category: "particles",
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
    return new TheSpirit(entities || []);
  }
};
console.log("The Spirit asset loaded");
Helper.loadAsset(digoAssetData);
