// Moteur de rendu de l'atelier Rouage & Laiton.
// Rendu progressif par accumulation : chaque échantillon décale la caméra d'une fraction de pixel
// (anticrénelage), déplace les lumières dans leur surface (ombres douces), échantillonne une
// lumière de dôme (occlusion ambiante) et, si demandé, l'ouverture de l'objectif (profondeur de champ).
import * as THREE from 'three';

const FS_VERT = /* glsl */`
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

const RESOLVE_FRAG = /* glsl */`
precision highp float;
varying vec2 vUv;
uniform sampler2D tSrc;
uniform float uWeight, uExposure, uAspect, uBgRadius;
uniform int uTone;
uniform vec3 uBgA, uBgB;
uniform vec2 uBgCenter;

vec3 RRTAndODTFit(vec3 v){ vec3 a = v*(v+0.0245786)-0.000090537; vec3 b = v*(0.983729*v+0.4329510)+0.238081; return a/b; }
vec3 aces(vec3 color){
  const mat3 IN = mat3(vec3(0.59719,0.07600,0.02840), vec3(0.35458,0.90834,0.13383), vec3(0.04823,0.01566,0.83777));
  const mat3 OUT = mat3(vec3(1.60475,-0.10208,-0.00327), vec3(-0.53108,1.10813,-0.07276), vec3(-0.07367,-0.00605,1.07602));
  color *= 1.0/0.6; color = IN*color; color = RRTAndODTFit(color); color = OUT*color; return clamp(color,0.0,1.0);
}
vec3 neutral(vec3 color){
  const float StartCompression = 0.8 - 0.04; const float Desaturation = 0.15;
  float x = min(color.r, min(color.g, color.b));
  float offset = x < 0.08 ? x - 6.25*x*x : 0.04;
  color -= offset;
  float peak = max(color.r, max(color.g, color.b));
  if (peak < StartCompression) return color;
  float d = 1.0 - StartCompression;
  float newPeak = 1.0 - d*d/(peak + d - StartCompression);
  color *= newPeak/peak;
  float g = 1.0 - 1.0/(Desaturation*(peak - newPeak) + 1.0);
  return mix(color, vec3(newPeak), g);
}
vec3 toSRGB(vec3 c){ c = clamp(c,0.0,1.0); return mix(c*12.92, 1.055*pow(c, vec3(1.0/2.4)) - 0.055, step(0.0031308, c)); }
void main(){
  vec4 s = texture2D(tSrc, vUv);
  float a = clamp(s.a, 0.0, 1.0);
  vec3 obj = s.rgb / max(a, 1e-4) * uExposure;
  obj = uTone == 1 ? aces(obj) : neutral(obj);
  vec3 c = toSRGB(obj);
  vec2 p = (vUv - uBgCenter) * vec2(uAspect, 1.0);
  float d = clamp(length(p) / uBgRadius, 0.0, 1.0);
  vec3 bg = mix(uBgA, uBgB, smoothstep(0.0, 1.0, d));
  vec3 outc = mix(bg, c, a);
  gl_FragColor = vec4(outc * uWeight, uWeight);
}`;

const BRIGHT_FRAG = /* glsl */`
precision highp float; varying vec2 vUv; uniform sampler2D tSrc; uniform float uThreshold;
void main(){ vec3 c = texture2D(tSrc, vUv).rgb; float l = dot(c, vec3(0.2126,0.7152,0.0722));
  float k = smoothstep(uThreshold, 1.0, l); gl_FragColor = vec4(c*k, 1.0); }`;

const BLUR_FRAG = /* glsl */`
precision highp float; varying vec2 vUv; uniform sampler2D tSrc; uniform vec2 uDir;
void main(){ vec3 s = vec3(0.0); float wsum = 0.0;
  for (int i = -12; i <= 12; i++){ float fi = float(i); float w = exp(-fi*fi/50.0); s += texture2D(tSrc, vUv + uDir*fi).rgb*w; wsum += w; }
  gl_FragColor = vec4(s/wsum, 1.0); }`;

const FINAL_FRAG = /* glsl */`
precision highp float; varying vec2 vUv;
uniform sampler2D tAcc, tBloom; uniform float uBloom, uGrain, uVignette, uSeed; uniform vec2 uRes;
float hash(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32+uSeed); return fract(p.x*p.y); }
void main(){
  vec3 c = texture2D(tAcc, vUv).rgb;
  c += texture2D(tBloom, vUv).rgb * uBloom;
  vec2 q = vUv - 0.5; c *= 1.0 - uVignette * dot(q, q) * 2.0;
  float n = hash(vUv*uRes) + hash(vUv*uRes + 17.0) - 1.0;
  c += n * uGrain + (hash(vUv*uRes*1.7) - 0.5)/255.0;
  gl_FragColor = vec4(clamp(c,0.0,1.0), 1.0);
}`;

function fsMaterial(frag, uniforms, extra = {}) {
  return new THREE.ShaderMaterial({ vertexShader: FS_VERT, fragmentShader: frag, uniforms, depthTest: false, depthWrite: false, ...extra });
}

// Suites quasi aléatoires (Halton) pour un échantillonnage régulier
export function halton(i, b) { let f = 1, r = 0; while (i > 0) { f /= b; r += f * (i % b); i = Math.floor(i / b); } return r; }

// Générateur pseudo-aléatoire déterministe (rendus reproductibles)
export function rng(seed = 1) {
  let s = seed >>> 0 || 1;
  return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
}

export class Studio {
  constructor(canvas, width, height) {
    this.w = width; this.h = height;
    const r = this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, preserveDrawingBuffer: true, alpha: false, powerPreference: 'high-performance' });
    r.setPixelRatio(1); r.setSize(width, height, false); r.autoClear = false;
    r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFShadowMap;
    r.toneMapping = THREE.NoToneMapping;
    r.outputColorSpace = THREE.LinearSRGBColorSpace;
    const fl = r.extensions.has('EXT_float_blend');
    this.sceneRT = new THREE.WebGLRenderTarget(width, height, { type: THREE.HalfFloatType, samples: 4, colorSpace: THREE.LinearSRGBColorSpace });
    this.accRT = new THREE.WebGLRenderTarget(width, height, { type: fl ? THREE.FloatType : THREE.HalfFloatType, depthBuffer: false });
    const bw = Math.round(width / 4), bh = Math.round(height / 4);
    this.bloomA = new THREE.WebGLRenderTarget(bw, bh, { type: THREE.HalfFloatType, depthBuffer: false });
    this.bloomB = new THREE.WebGLRenderTarget(bw, bh, { type: THREE.HalfFloatType, depthBuffer: false });
    this.quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
    this.quad.frustumCulled = false;
    this.quadScene = new THREE.Scene(); this.quadScene.add(this.quad);
    this.resolveMat = fsMaterial(RESOLVE_FRAG, {
      tSrc: { value: this.sceneRT.texture }, uWeight: { value: 1 }, uExposure: { value: 1 }, uTone: { value: 0 },
      uBgA: { value: new THREE.Color() }, uBgB: { value: new THREE.Color() }, uBgCenter: { value: new THREE.Vector2(0.5, 0.55) },
      uBgRadius: { value: 0.9 }, uAspect: { value: width / height },
    }, { blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor, blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneFactor, transparent: true });
    this.brightMat = fsMaterial(BRIGHT_FRAG, { tSrc: { value: null }, uThreshold: { value: 0.75 } });
    this.blurMat = fsMaterial(BLUR_FRAG, { tSrc: { value: null }, uDir: { value: new THREE.Vector2() } });
    this.finalMat = fsMaterial(FINAL_FRAG, {
      tAcc: { value: this.accRT.texture }, tBloom: { value: this.bloomB.texture }, uBloom: { value: 0 }, uGrain: { value: 0 },
      uVignette: { value: 0 }, uSeed: { value: 0.37 }, uRes: { value: new THREE.Vector2(width, height) },
    });
  }

  pass(mat, target) {
    this.quad.material = mat;
    this.renderer.setRenderTarget(target);
    this.renderer.render(this.quadScene, this.quadCam);
  }

  // look : { exposure, tone:'neutral'|'aces', bgA, bgB (sRGB hex), bgCenter, bgRadius, bloom, bloomThreshold, grain, vignette }
  // jitter(i, rand) est appelé avant chaque échantillon (lumières de surface, dôme).
  render({ scene, camera, cam, samples = 64, look = {}, jitter = () => {}, seed = 7 }) {
    const r = this.renderer, W = this.w, H = this.h;
    const rand = rng(seed);
    const U = this.resolveMat.uniforms;
    U.uExposure.value = look.exposure ?? 1;
    U.uTone.value = look.tone === 'aces' ? 1 : 0;
    // couleurs de fond données en sRGB : on garde les valeurs brutes (composition en espace écran)
    U.uBgA.value.setRGB(...hexToSRGB(look.bgA ?? '#F4EEE2'));
    U.uBgB.value.setRGB(...hexToSRGB(look.bgB ?? '#E6DED0'));
    U.uBgCenter.value.set(...(look.bgCenter ?? [0.5, 0.55]));
    U.uBgRadius.value = look.bgRadius ?? 0.95;
    U.uWeight.value = 1 / samples;

    r.setRenderTarget(this.accRT); r.setClearColor(0x000000, 0); r.clear(true, true, true);

    // Paramètres de la caméra (lentille mince)
    const near = camera.near, far = camera.far;
    const top0 = near * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
    const height = 2 * top0, width = height * camera.aspect;
    const basePos = camera.position.clone(); const baseQuat = camera.quaternion.clone();
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(baseQuat);
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(baseQuat);
    const aperture = cam?.aperture ?? 0; const focus = cam?.focus ?? 1;

    for (let i = 0; i < samples; i++) {
      // filtre en tente sur ±1 pixel
      const tent = (u) => { u *= 2; return u < 1 ? Math.sqrt(u) - 1 : 1 - Math.sqrt(2 - u); };
      const jx = tent(halton(i + 1, 2)), jy = tent(halton(i + 1, 3));
      let lx = 0, ly = 0;
      if (aperture > 0) {
        const a = 2 * Math.PI * halton(i + 1, 5), rr = Math.sqrt(halton(i + 1, 7)) * aperture;
        lx = Math.cos(a) * rr; ly = Math.sin(a) * rr;
      }
      camera.position.copy(basePos).addScaledVector(right, lx).addScaledVector(up, ly);
      camera.quaternion.copy(baseQuat);
      camera.updateMatrixWorld(true);
      const pxw = width / W, pxh = height / H;
      const left = -width / 2 + jx * pxw - lx * near / focus;
      const tp = top0 + jy * pxh - ly * near / focus;
      camera.projectionMatrix.makePerspective(left, left + width, tp, tp - height, near, far);
      camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();

      jitter(i, rand);
      r.setRenderTarget(this.sceneRT);
      r.setClearColor(0x000000, 0); r.clear(true, true, true);
      r.render(scene, camera);
      this.pass(this.resolveMat, this.accRT);
    }
    camera.position.copy(basePos); camera.updateProjectionMatrix();

    // Halo (bloom) léger sur les hautes lumières
    const FU = this.finalMat.uniforms;
    FU.uBloom.value = look.bloom ?? 0; FU.uGrain.value = look.grain ?? 0.006; FU.uVignette.value = look.vignette ?? 0;
    if (FU.uBloom.value > 0) {
      this.brightMat.uniforms.tSrc.value = this.accRT.texture; this.brightMat.uniforms.uThreshold.value = look.bloomThreshold ?? 0.7;
      this.pass(this.brightMat, this.bloomB);
      const bw = this.bloomA.width, bh = this.bloomA.height;
      for (let k = 0; k < 3; k++) {
        const s = 1 + k * 1.5;
        this.blurMat.uniforms.tSrc.value = this.bloomB.texture; this.blurMat.uniforms.uDir.value.set(s / bw, 0); this.pass(this.blurMat, this.bloomA);
        this.blurMat.uniforms.tSrc.value = this.bloomA.texture; this.blurMat.uniforms.uDir.value.set(0, s / bh); this.pass(this.blurMat, this.bloomB);
      }
    }
    this.pass(this.finalMat, null);
    r.setRenderTarget(null);
  }
}

export function hexToSRGB(hex) {
  const h = hex.replace('#', ''); return [0, 2, 4].map((k) => parseInt(h.slice(k, k + 2), 16) / 255);
}

// ---------- Caméra ----------
// az : azimut en degrés depuis l'avant (+z) vers la droite (+x) ; el : élévation en degrés.
export function dirFromAngles(az, el) {
  const a = THREE.MathUtils.degToRad(az), e = THREE.MathUtils.degToRad(el);
  return new THREE.Vector3(Math.sin(a) * Math.cos(e), Math.sin(e), Math.cos(a) * Math.cos(e));
}

// Place la caméra pour que la boîte englobante tienne dans le cadre avec une marge donnée.
export function frameBox(camera, box, { az, el, margin = 0.12, offsetY = 0, target } = {}) {
  const dir = dirFromAngles(az, el);
  const center = target ? target.clone() : box.getCenter(new THREE.Vector3());
  center.y += offsetY;
  const corners = [];
  for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) corners.push(new THREE.Vector3(x, y, z));
  const tanV = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * (1 - margin);
  const tanH = tanV * camera.aspect;
  const fits = (d) => {
    camera.position.copy(center).addScaledVector(dir, d);
    camera.up.set(0, 1, 0);
    camera.lookAt(center); camera.updateMatrixWorld(true);
    const inv = camera.matrixWorldInverse;
    for (const c of corners) {
      const p = c.clone().applyMatrix4(inv); const z = -p.z;
      if (z <= camera.near) return false;
      if (Math.abs(p.x / z) > tanH || Math.abs(p.y / z) > tanV) return false;
    }
    return true;
  };
  let lo = 1, hi = 1e5;
  for (let k = 0; k < 60; k++) { const mid = (lo + hi) / 2; if (fits(mid)) hi = mid; else lo = mid; }
  fits(hi);
  // recentrage : on centre la projection réelle de la boîte dans le cadre
  const inv = camera.matrixWorldInverse;
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const c of corners) { const p = c.clone().applyMatrix4(inv); const z = -p.z; minX = Math.min(minX, p.x / z); maxX = Math.max(maxX, p.x / z); minY = Math.min(minY, p.y / z); maxY = Math.max(maxY, p.y / z); }
  const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
  const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
  const up = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
  const shift = right.multiplyScalar(cx * hi).add(up.multiplyScalar(cy * hi));
  camera.position.add(shift);
  camera.near = hi / 20; camera.far = hi * 30; camera.updateProjectionMatrix();
  camera.updateMatrixWorld(true);
  return { distance: hi, center: center.clone().add(shift) };
}
