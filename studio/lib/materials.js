// Matériaux procéduraux : contreplaqué de bouleau découpé au laser (faces à fibres fines, chants brûlés),
// laiton, acier, fil, élastique, et matières de décor (bureau en noyer, mur nuit, papier).
import * as THREE from 'three';
import { rng } from './engine.js';

// ---------- Bruit de valeur périodique (textures raccordables) ----------
function makeLattice(nx, ny, rand) { const g = new Float32Array(nx * ny); for (let i = 0; i < g.length; i++) g[i] = rand(); return { g, nx, ny }; }
function sampleLattice(L, x, y) {
  const { g, nx, ny } = L;
  const xi = Math.floor(x), yi = Math.floor(y); const fx = x - xi, fy = y - yi;
  const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
  const x0 = ((xi % nx) + nx) % nx, y0 = ((yi % ny) + ny) % ny, x1 = (x0 + 1) % nx, y1 = (y0 + 1) % ny;
  const a = g[y0 * nx + x0], b = g[y0 * nx + x1], c = g[y1 * nx + x0], d = g[y1 * nx + x1];
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
}
// fbm périodique : u, v dans [0,1), fréquences entières fx, fy
function makeFbm(fx, fy, octaves, rand) {
  const ls = []; for (let o = 0; o < octaves; o++) ls.push(makeLattice(fx << o, fy << o, rand));
  return (u, v) => { let s = 0, amp = 0.5, n = 0; for (let o = 0; o < octaves; o++) { s += amp * sampleLattice(ls[o], u * (fx << o), v * (fy << o)); n += amp; amp *= 0.5; } return s / n; };
}

const PALETTES = {
  // bouleau découpé au laser : beige clair légèrement rosé
  birch: { base: [224, 202, 168], dark: [184, 150, 110], fleck: [150, 112, 76], figure: 0.15, fiber: 0.1 },
  // peuplier (variante plus pâle et plus jaune, pour quelques pièces)
  poplar: { base: [228, 210, 172], dark: [196, 170, 128], fleck: [160, 124, 86], figure: 0.14, fiber: 0.08 },
  // noyer du bureau (décor)
  walnut: { base: [92, 60, 40], dark: [52, 32, 22], fleck: [40, 24, 16], figure: 0.35, fiber: 0.12 },
  // chêne fumé des étagères (décor)
  oak: { base: [120, 88, 60], dark: [80, 56, 38], fleck: [60, 40, 26], figure: 0.3, fiber: 0.12 },
};

const texCache = new Map();
export function woodTexture(kind = 'birch', size = 2048, seed = 11) {
  const key = kind + size + seed; if (texCache.has(key)) return texCache.get(key);
  const P = PALETTES[kind]; const rand = rng(seed);
  const fiber = makeFbm(12, 220, 3, rand);   // fibres fines le long de x
  const warp = makeFbm(3, 4, 4, rand);      // ondulation du fil
  const blotch = makeFbm(4, 5, 3, rand);    // variations de teinte
  const knots = []; for (let i = 0; i < 5; i++) knots.push([rand(), rand(), 0.004 + rand() * 0.006]);
  const cv = document.createElement('canvas'); cv.width = cv.height = size;
  const ctx = cv.getContext('2d'); const img = ctx.createImageData(size, size); const d = img.data;
  const bump = new Uint8ClampedArray(size * size);
  for (let y = 0; y < size; y++) {
    const v = y / size;
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const w = warp(u, v);
      const ring = 0.5 + 0.5 * Math.sin(2 * Math.PI * (v * 9 + 1.6 * w));
      const band = Math.pow(ring, 3.5) * 0.7 + Math.pow(0.5 + 0.5 * Math.sin(2 * Math.PI * (v * 23 + 2.4 * w)), 8) * 0.5;
      const f = fiber(u, v + 0.04 * w);
      const b = blotch(u, v);
      let fl = 0; for (const [kx, ky, kr] of knots) { let dx = Math.abs(u - kx); dx = Math.min(dx, 1 - dx); let dy = Math.abs(v - ky); dy = Math.min(dy, 1 - dy); const q = (dx * dx) / (kr * kr * 9) + (dy * dy) / (kr * kr); if (q < 1) fl = Math.max(fl, 1 - q); }
      let t = P.figure * band + P.fiber * (f - 0.5) * 2 + 0.06 * (b - 0.5);
      t = Math.max(0, Math.min(1, t + 0.04));
      const k = (y * size + x) * 4;
      for (let c = 0; c < 3; c++) {
        let val = P.base[c] + (P.dark[c] - P.base[c]) * t * 2.2;
        val = val + (P.fleck[c] - val) * Math.min(1, fl);
        val *= 0.97 + 0.06 * b;
        d[k + c] = val;
      }
      d[k + 3] = 255;
      bump[y * size + x] = 128 + 60 * (f - 0.5) - 50 * band;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace; tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  // carte de relief (fibres)
  const bc = document.createElement('canvas'); bc.width = bc.height = size;
  const bctx = bc.getContext('2d'); const bi = bctx.createImageData(size, size);
  for (let i = 0; i < size * size; i++) { bi.data[i * 4] = bi.data[i * 4 + 1] = bi.data[i * 4 + 2] = bump[i]; bi.data[i * 4 + 3] = 255; }
  bctx.putImageData(bi, 0, 0);
  const btex = new THREE.CanvasTexture(bc); btex.wrapS = btex.wrapT = THREE.RepeatWrapping; btex.anisotropy = 8;
  const res = { map: tex, bump: btex };
  texCache.set(key, res); return res;
}

// Chant découpé au laser : brun brûlé, trois plis visibles, légères stries verticales du faisceau
function edgeCanvas(seed = 3) {
  const rand = rng(seed); const W = 256, H = 64;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d'); const img = ctx.createImageData(W, H); const d = img.data;
  const n = makeFbm(32, 4, 3, rand); const s = makeFbm(64, 1, 2, rand);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const v = y / H, u = x / W;
    const ply = Math.floor(v * 3); const pv = (v * 3) % 1;
    const glue = Math.exp(-Math.pow((pv) / 0.05, 2)) + Math.exp(-Math.pow((1 - pv) / 0.05, 2));
    let base = [74, 46, 28];
    if (ply === 1) base = [84, 54, 33];
    const t = 0.75 + 0.35 * n(u, v) + 0.12 * (s(u, 0) - 0.5) - 0.35 * glue;
    const k = (y * W + x) * 4;
    d[k] = base[0] * t; d[k + 1] = base[1] * t; d[k + 2] = base[2] * t; d[k + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return cv;
}

let _edgeCanvas = null;
const edgeCache = new Map();
export function edgeMaterial(t = 3) {
  const key = t.toFixed(2); if (edgeCache.has(key)) return edgeCache.get(key);
  if (!_edgeCanvas) _edgeCanvas = edgeCanvas();
  const tex = new THREE.CanvasTexture(_edgeCanvas);
  tex.colorSpace = THREE.SRGBColorSpace; tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  // UV des chants (ExtrudeGeometry) : u = abscisse en mm, v = 1 - profondeur en mm
  tex.repeat.set(1 / 40, 1 / t);
  tex.offset.set(0, -((1 - t) / t) % 1);
  const m = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.92, metalness: 0, envMapIntensity: 0.6 });
  edgeCache.set(key, m); return m;
}

const faceCache = new Map();
// Face de contreplaqué : chaque pièce reçoit un décalage et une orientation du fil propres.
export function woodFace(kind = 'birch', rand = Math.random, { rotate = null, scale = 1 } = {}) {
  const { map, bump } = woodTexture(kind);
  const ox = rand(), oy = rand();
  const rot = rotate ?? (rand() < 0.75 ? 0 : Math.PI / 2);
  const span = (kind === 'walnut' || kind === 'oak' ? 900 : 220) * scale; // mm couverts par la texture
  const m1 = map.clone(); const b1 = bump.clone();
  for (const t of [m1, b1]) { t.repeat.set(1 / span, 1 / span); t.offset.set(ox, oy); t.rotation = rot; t.needsUpdate = true; }
  const isDecor = kind === 'walnut' || kind === 'oak';
  return new THREE.MeshStandardMaterial({
    map: m1, bumpMap: b1, bumpScale: isDecor ? 0.6 : 0.35,
    roughness: isDecor ? 0.55 : 0.78, metalness: 0, envMapIntensity: isDecor ? 0.8 : 0.5,
  });
}

// Bois en long (axes et chevilles en bois) : fil parallèle à la longueur du cylindre
export function dowelMaterial(rand = Math.random) {
  const { map } = woodTexture('birch');
  const m1 = map.clone(); m1.repeat.set(0.4, 3); m1.rotation = Math.PI / 2; m1.offset.set(rand(), rand()); m1.needsUpdate = true;
  return new THREE.MeshStandardMaterial({ map: m1, roughness: 0.7, color: new THREE.Color(0.93, 0.9, 0.86) });
}

export const MAT = {};
export function initMaterials() {
  MAT.brass = new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#D9B26A'), metalness: 1, roughness: 0.3, envMapIntensity: 1.2 });
  MAT.brassPolished = new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#E3BE76'), metalness: 1, roughness: 0.16, envMapIntensity: 1.3 });
  MAT.brassDark = new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#A8813F'), metalness: 1, roughness: 0.42, envMapIntensity: 1.1 });
  MAT.steel = new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#C9CCD1'), metalness: 1, roughness: 0.22, envMapIntensity: 1.1 });
  MAT.blackMetal = new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#1B1D22'), metalness: 0.6, roughness: 0.45 });
  MAT.string = new THREE.MeshStandardMaterial({ color: new THREE.Color('#EDE6D8'), roughness: 0.95 });
  MAT.rubber = new THREE.MeshStandardMaterial({ color: new THREE.Color('#B9824A'), roughness: 0.55 });
  MAT.glass = new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#ffffff'), metalness: 0, roughness: 0.05, transmission: 0, transparent: true, opacity: 0.18, envMapIntensity: 1.5 });
  MAT.paper = new THREE.MeshStandardMaterial({ color: new THREE.Color('#EFE8DA'), roughness: 0.9 });
  MAT.kraft = new THREE.MeshStandardMaterial({ color: new THREE.Color('#B48A5C'), roughness: 0.92 });
  MAT.wallNight = new THREE.MeshStandardMaterial({ color: new THREE.Color('#24324D'), roughness: 0.95 });
  MAT.leather = new THREE.MeshStandardMaterial({ color: new THREE.Color('#2A2320'), roughness: 0.7 });
  MAT.lampShade = new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#15181E'), metalness: 0.7, roughness: 0.35, side: THREE.DoubleSide });
  MAT.lampInner = new THREE.MeshStandardMaterial({ color: new THREE.Color('#F2E2C4'), roughness: 0.6, side: THREE.BackSide });
  MAT.bulb = new THREE.MeshBasicMaterial({ color: new THREE.Color(6, 4.2, 2.4) });
  MAT.windowGlow = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.05, 0.08, 0.16) });
  MAT.bokehWarm = new THREE.MeshBasicMaterial({ color: new THREE.Color(3.5, 2.2, 1.0) });
  MAT.bokehCool = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.8, 1.1, 2.2) });
  MAT.shadow = new THREE.ShadowMaterial({ opacity: 0.32 });
  MAT.engrave = new THREE.MeshStandardMaterial({ color: new THREE.Color('#5A3A22'), roughness: 0.95 });
  for (const k of ['brass', 'brassPolished', 'brassDark']) MAT[k].userData.envK = 3.2;
  MAT.steel.userData.envK = 2.6; MAT.blackMetal.userData.envK = 2; MAT.lampShade.userData.envK = 2;
  return MAT;
}
