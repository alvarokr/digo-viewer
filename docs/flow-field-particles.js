import { S as Scene, C as Camera, M as Mesh, P as PlaneGeometry, a as ShaderMaterial, W as WebGLRenderTarget, R as RGBAFormat, D as DataTexture, F as FloatType, N as NearestFilter, b as ClampToEdgeWrapping, V as Vector2, c as SphereGeometry, U as Uniform, d as MeshBasicMaterial, B as BufferGeometry, e as BufferAttribute, T as Texture, f as Points } from "./three.js";
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
        getAudioFrequenciesPower: () => new Uint8Array(1024),
        getMIDIBender: (input) => 0,
        getMIDINoteVelocity: (input, key) => 0,
        getMIDIControlVelocity: (input, key) => 0,
        getMIDINotesVelocity: (input) => [],
        getMIDIControlsVelocity: (input) => []
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
  addPropertyFont(general, id, defaultValue) {
    const property = {
      id,
      type: "font",
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
  setGlobalData(data) {
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
var vertex_default = "uniform vec2 uResolution;\nuniform float uSize;\nuniform sampler2D uParticlesTexture;\n\nattribute vec2 aParticlesUv;\nattribute vec3 aColor;\nattribute float aSize;\n\nvarying vec3 vColor;\n\nvoid main()\n{\n    vec4 particle = texture(uParticlesTexture, aParticlesUv);\n\n    \n    vec4 modelPosition = modelMatrix * vec4(particle.xyz, 1.0);\n    vec4 viewPosition = viewMatrix * modelPosition;\n    vec4 projectedPosition = projectionMatrix * viewPosition;\n    gl_Position = projectedPosition;\n\n    \n    float sizeIn = smoothstep(0.0, 0.1, particle.a);\n    float sizeOut = 1.0 - smoothstep(0.7, 1.0, particle.a);\n    float size = min(sizeIn, sizeOut);\n\n    gl_PointSize = size * aSize * uSize * uResolution.y;\n    gl_PointSize *= (1.0 / - viewPosition.z);\n\n    \n    vColor = aColor;\n}";
var fragment_default = "varying vec3 vColor;\n\nvoid main()\n{\n    float distanceToCenter = length(gl_PointCoord - 0.5);\n    if(distanceToCenter > 0.5)\n        discard;\n    \n    gl_FragColor = vec4(vColor, 1.0);\n\n    #include <tonemapping_fragment>\n    #include <colorspace_fragment>\n}";
var particles_default = "uniform float uTime;\nuniform float uDeltaTime;\nuniform sampler2D uBase;\nuniform float uFlowFieldInfluence;\nuniform float uFlowFieldStrength;\nuniform float uFlowFieldFrequency;\n\nvec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}\nfloat permute(float x){return floor(mod(((x*34.0)+1.0)*x, 289.0));}\nvec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}\nfloat taylorInvSqrt(float r){return 1.79284291400159 - 0.85373472095314 * r;}\n\nvec4 grad4(float j, vec4 ip){\n  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);\n  vec4 p,s;\n\n  p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;\n  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);\n  s = vec4(lessThan(p, vec4(0.0)));\n  p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www; \n\n  return p;\n}\n\nfloat simplexNoise4d(vec4 v){\n  const vec2  C = vec2( 0.138196601125010504,  \n                        0.309016994374947451); \n\n  vec4 i  = floor(v + dot(v, C.yyyy) );\n  vec4 x0 = v -   i + dot(i, C.xxxx);\n\n  vec4 i0;\n\n  vec3 isX = step( x0.yzw, x0.xxx );\n  vec3 isYZ = step( x0.zww, x0.yyz );\n\n  i0.x = isX.x + isX.y + isX.z;\n  i0.yzw = 1.0 - isX;\n\n  i0.y += isYZ.x + isYZ.y;\n  i0.zw += 1.0 - isYZ.xy;\n\n  i0.z += isYZ.z;\n  i0.w += 1.0 - isYZ.z;\n\n  \n  vec4 i3 = clamp( i0, 0.0, 1.0 );\n  vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );\n  vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );\n\n  \n  vec4 x1 = x0 - i1 + 1.0 * C.xxxx;\n  vec4 x2 = x0 - i2 + 2.0 * C.xxxx;\n  vec4 x3 = x0 - i3 + 3.0 * C.xxxx;\n  vec4 x4 = x0 - 1.0 + 4.0 * C.xxxx;\n\n  i = mod(i, 289.0); \n  float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);\n  vec4 j1 = permute( permute( permute( permute (\n             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))\n           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))\n           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))\n           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));\n\n  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;\n\n  vec4 p0 = grad4(j0,   ip);\n  vec4 p1 = grad4(j1.x, ip);\n  vec4 p2 = grad4(j1.y, ip);\n  vec4 p3 = grad4(j1.z, ip);\n  vec4 p4 = grad4(j1.w, ip);\n\n  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n  p0 *= norm.x;\n  p1 *= norm.y;\n  p2 *= norm.z;\n  p3 *= norm.w;\n  p4 *= taylorInvSqrt(dot(p4,p4));\n\n  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);\n  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);\n  m0 = m0 * m0;\n  m1 = m1 * m1;\n  return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))\n               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;\n\n}\n\nvoid main()\n{\n    float time = uTime * 0.2;\n    vec2 uv = gl_FragCoord.xy / resolution.xy;\n    vec4 particle = texture(uParticles, uv);\n    vec4 base = texture(uBase, uv);\n    \n    \n    if(particle.a >= 1.0)\n    {\n        particle.a = mod(particle.a, 1.0);\n        particle.xyz = base.xyz;\n    }\n\n    \n    else\n    {\n        \n        float strength = simplexNoise4d(vec4(base.xyz * 0.2, time + 1.0));\n        float influence = (uFlowFieldInfluence - 0.5) * (- 2.0);\n        strength = smoothstep(influence, 1.0, strength);\n\n        \n        vec3 flowField = vec3(\n            simplexNoise4d(vec4(particle.xyz * uFlowFieldFrequency + 0.0, time)),\n            simplexNoise4d(vec4(particle.xyz * uFlowFieldFrequency + 1.0, time)),\n            simplexNoise4d(vec4(particle.xyz * uFlowFieldFrequency + 2.0, time))\n        );\n        flowField = normalize(flowField);\n        particle.xyz += flowField * uDeltaTime * strength * uFlowFieldStrength;\n\n        \n        particle.a += uDeltaTime * 0.3;\n    }\n    \n    gl_FragColor = particle;\n}";
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
          const objectValue = property.getter(data);
          objectValue[splittedProperties[1]] = value;
          property.setter(data, objectValue, nextUpdate);
        } else {
          property.setter(data, value, nextUpdate);
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
  tick(parameters) {
  }
}
const labels = {
  property: {
    en: "Property",
    es: "Propiedad"
  }
};
class GeneralData extends AssetGeneralData {
}
class EntityData extends AssetEntityData {
  constructor() {
    super(...arguments);
    this.baseGeometry = {};
    this.gpgpu = {};
    this.particles = {};
  }
}
class FlowFieldParticles extends DigoAssetThree {
  constructor(entities) {
    super();
    this.webGLRenderer = Helper.getGlobal().getThreeWebGLRenderer();
    this.size = this.webGLRenderer.getSize(new Vector2());
    this.pixelRatio = this.webGLRenderer.getPixelRatio();
    this.previousTime = 0;
    this.deltaTime = 0;
    this.setLabels(labels);
    this.addDefaultProperties(true, true);
    this.addPropertyNumber(ENTITY_PROPERTY, "property", 0, 1, 2, 0.01, 0.5).setter((data, value) => {
    });
    const globalData = new GeneralData();
    globalData.container = new Scene();
    this.setGlobalData(globalData);
    entities.forEach((entity) => {
      this.createEntity(entity);
    });
  }
  createEntity(id) {
    const entityData = new EntityData();
    entityData.baseGeometry.instance = new SphereGeometry(1, 500, 500);
    entityData.baseGeometry.count = entityData.baseGeometry.instance.attributes.position.count;
    entityData.gpgpu.size = Math.ceil(Math.sqrt(entityData.baseGeometry.count));
    entityData.gpgpu.computation = new GPUComputationRenderer(entityData.gpgpu.size, entityData.gpgpu.size, this.webGLRenderer);
    const baseParticlesTexture = entityData.gpgpu.computation.createTexture();
    for (let i = 0; i < entityData.baseGeometry.count; i++) {
      const i3 = i * 3;
      const i4 = i * 4;
      baseParticlesTexture.image.data[i4 + 0] = entityData.baseGeometry.instance.attributes.position.array[i3 + 0];
      baseParticlesTexture.image.data[i4 + 1] = entityData.baseGeometry.instance.attributes.position.array[i3 + 1];
      baseParticlesTexture.image.data[i4 + 2] = entityData.baseGeometry.instance.attributes.position.array[i3 + 2];
      baseParticlesTexture.image.data[i4 + 3] = Math.random();
    }
    entityData.gpgpu.particlesVariable = entityData.gpgpu.computation.addVariable("uParticles", particles_default, baseParticlesTexture);
    entityData.gpgpu.computation.setVariableDependencies(entityData.gpgpu.particlesVariable, [entityData.gpgpu.particlesVariable]);
    entityData.gpgpu.particlesVariable.material.uniforms.uTime = new Uniform(0);
    entityData.gpgpu.particlesVariable.material.uniforms.uDeltaTime = new Uniform(0);
    entityData.gpgpu.particlesVariable.material.uniforms.uBase = new Uniform(baseParticlesTexture);
    entityData.gpgpu.particlesVariable.material.uniforms.uFlowFieldInfluence = new Uniform(0.5);
    entityData.gpgpu.particlesVariable.material.uniforms.uFlowFieldStrength = new Uniform(2);
    entityData.gpgpu.particlesVariable.material.uniforms.uFlowFieldFrequency = new Uniform(0.5);
    entityData.gpgpu.computation.init();
    entityData.gpgpu.debug = new Mesh(
      new PlaneGeometry(3, 3),
      new MeshBasicMaterial({ map: entityData.gpgpu.computation.getCurrentRenderTarget(entityData.gpgpu.particlesVariable).texture })
    );
    entityData.gpgpu.debug.position.x = 3;
    entityData.gpgpu.debug.visible = true;
    this.getContainer().add(entityData.gpgpu.debug);
    const particlesUvArray = new Float32Array(entityData.baseGeometry.count * 2);
    const sizesArray = new Float32Array(entityData.baseGeometry.count);
    for (let y = 0; y < entityData.gpgpu.size; y++) {
      for (let x = 0; x < entityData.gpgpu.size; x++) {
        const i = y * entityData.gpgpu.size + x;
        const i2 = i * 2;
        const uvX = (x + 0.5) / entityData.gpgpu.size;
        const uvY = (y + 0.5) / entityData.gpgpu.size;
        particlesUvArray[i2 + 0] = uvX;
        particlesUvArray[i2 + 1] = uvY;
        sizesArray[i] = Math.random();
      }
    }
    entityData.particles.geometry = new BufferGeometry();
    entityData.particles.geometry.setDrawRange(0, entityData.baseGeometry.count);
    entityData.particles.geometry.setAttribute("aParticlesUv", new BufferAttribute(particlesUvArray, 2));
    entityData.particles.geometry.setAttribute("aSize", new BufferAttribute(sizesArray, 1));
    console.log(entityData.particles.geometry.attributes);
    entityData.particles.material = new ShaderMaterial({
      vertexShader: vertex_default,
      fragmentShader: fragment_default,
      uniforms: {
        uSize: new Uniform(0.07),
        uResolution: new Uniform(this.size.multiplyScalar(this.pixelRatio)),
        uParticlesTexture: new Uniform(new Texture())
      }
    });
    entityData.particles.points = new Points(entityData.particles.geometry, entityData.particles.material);
    this.getContainer().add(entityData.particles.points);
    entityData.component = entityData.particles.points;
    this.addEntity(id, entityData);
  }
  tick(parameters) {
    this.deltaTime = parameters.elapsedTime - this.previousTime;
    this.previousTime = parameters.elapsedTime;
    this.getEntities().forEach((entityName) => {
      const entityData = this.getEntity(entityName);
      entityData.gpgpu.particlesVariable.material.uniforms.uTime.value = parameters.elapsedTime;
      entityData.gpgpu.particlesVariable.material.uniforms.uDeltaTime.value = this.deltaTime;
      entityData.gpgpu.computation.compute();
      entityData.particles.material.uniforms.uParticlesTexture.value = entityData.gpgpu.computation.getCurrentRenderTarget(entityData.gpgpu.particlesVariable).texture;
    });
    super.tick(parameters);
  }
}
const digoAssetData = {
  info: {
    name: {
      en: "Flow Field Particles",
      es: "Partículas Caóticas"
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
    return new FlowFieldParticles(entities || []);
  }
};
console.log("Flow field particles asset loaded");
Helper.loadAsset(digoAssetData);
