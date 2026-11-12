// Book nook « Ruelle d'horloger » (démonstration, sans éclairage) : caisson étroit à glisser entre deux livres,
// ruelle pavée en perspective, façades en plusieurs plans, vitrine d'horloger avec cadrans en laiton,
// enseigne en forme de montre de poche, passerelle en arc, cadran sur la façade du fond.
import * as THREE from 'three';
import { MAT } from '../lib/materials.js';
import { standingBook } from '../lib/rigs.js';
import { cut, put, rectPts, circlePts, polyPts, chaikin, arcPts, rod, rodX, rodZ, cap, lathe, torus, box, sphere, V2 } from '../lib/parts.js';

const D2R = THREE.MathUtils.degToRad;
const WINDOW_DARK = new THREE.MeshStandardMaterial({ color: new THREE.Color('#2A2522'), roughness: 0.9 });
const W = 104, H = 236, D = 176, T = 4;

const archWin = (cx, y, w, h) => chaikin([...polyPts([[cx - w / 2, y], [cx + w / 2, y]]), ...arcPts(w / 2, 0, Math.PI, 12, cx, y + h - w / 2)], 1);
const rectWin = (cx, y, w, h) => rectPts(w, h, 1, cx, y + h / 2);

// Petit cadran en laiton (aiguilles incluses), face vers +z local
function dial(r, parent, pos, rotY = 0) {
  const g = new THREE.Group(); g.position.set(...pos); g.rotation.y = rotY; parent.add(g);
  const face = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.8, 48), MAT.paper); face.rotation.x = Math.PI / 2; g.add(face);
  const rim = torus(r, Math.max(0.5, r * 0.09), MAT.brass, 64); rim.position.z = 0.3; g.add(rim);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; const tk = box(0.5, r * 0.18, 0.2, MAT.engrave); tk.position.set(Math.sin(a) * r * 0.78, Math.cos(a) * r * 0.78, 0.5); tk.rotation.z = -a; tk.castShadow = false; g.add(tk); }
  const h1 = box(0.7, r * 0.5, 0.3, MAT.blackMetal); h1.position.set(Math.sin(D2R(300)) * r * 0.22, Math.cos(D2R(300)) * r * 0.22, 0.7); h1.rotation.z = -D2R(300); g.add(h1);
  const h2 = box(0.5, r * 0.75, 0.3, MAT.blackMetal); h2.position.set(Math.sin(D2R(60)) * r * 0.34, Math.cos(D2R(60)) * r * 0.34, 0.8); h2.rotation.z = -D2R(60); g.add(h2);
  return g;
}

// Bâtiment adossé à une paroi latérale : façade parallèle au mur + deux retours. side = -1 (gauche) / 1 (droite)
function building(root, side, { z0, z1, h, depth, windows = [], kind = 'birch', roof = true }) {
  const xw = side * (W / 2 - T); const xf = xw - side * depth;
  const L = z0 - z1;
  const prof = { outer: polyPts([[0, 0], [L, 0], [L, h], [0, h]]), holes: windows.map((f) => f(L)) };
  // plan YZ : x local -> -z (rotation Y 90°) ; on positionne le bord z0
  put(cut(prof, 3, { kind }), [xf + side * 1.5, T, z0], [0, 90, 0], root);
  for (const z of [z0 - 1.5, z1 + 1.5]) put(cut({ outer: rectPts(depth, h) }, 3, { kind }), [xw - side * depth / 2, T + h / 2, z], [0, 0, 0], root);
  // corniche (plaque horizontale en débord) et fond sombre derrière les fenêtres
  if (roof) put(cut({ outer: rectPts(depth + 5, L - 1, 1) }, 2.5, { kind: 'poplar' }), [xw - side * (depth + 5) / 2, T + h + 1.25, (z0 + z1) / 2], [-90, 0, 0], root);
  const back = new THREE.Mesh(new THREE.PlaneGeometry(L - 4, h - 4), WINDOW_DARK); back.position.set(xf + side * 4, T + h / 2, (z0 + z1) / 2); back.rotation.y = -side * Math.PI / 2; root.add(back);
  return { xf };
}

export function build() {
  const root = new THREE.Group();
  // --- Caisson ---
  const sideDeco = [rectPts(W * 0 + D - 40, H - 40, 6)];
  put(cut({ outer: rectPts(D, H, 2) }, T), [-W / 2 + T / 2, H / 2, 0], [0, 90, 0], root);
  put(cut({ outer: rectPts(D, H, 2) }, T), [W / 2 - T / 2, H / 2, 0], [0, 90, 0], root);
  // moulures en applique sur les flancs extérieurs
  // flancs extérieurs : cadre mouluré et silhouette de toits en applique
  const sky = [[-62, -90], [62, -90], [62, 20], [50, 34], [38, 20], [38, 52], [26, 60], [14, 52], [14, 30], [0, 44], [-14, 30], [-14, 72], [-20, 80], [-26, 72], [-26, 38], [-40, 50], [-54, 38], [-62, 38]];
  const skyHoles = [rectPts(7, 10, 1, 26, 40), rectPts(7, 10, 1, 50, 6), rectPts(6, 9, 1, -20, 54), rectPts(7, 10, 1, -40, 26), rectPts(7, 10, 1, 0, 14), rectPts(8, 12, 1, -40, -20), rectPts(8, 12, 1, 26, -20), chaikin([...polyPts([[-8, -90], [8, -90]]), ...arcPts(8, 0, Math.PI, 10, 0, -70)], 1)];
  for (const s of [-1, 1]) {
    put(cut({ outer: rectPts(D - 24, H - 24, 4), holes: [rectPts(D - 40, H - 40, 4)] }, 2, { kind: 'poplar' }), [s * (W / 2 + 1), H / 2, 0], [0, 90, 0], root);
    put(cut({ outer: polyPts(sky), holes: skyHoles }, 2), [s * (W / 2 + 1), H / 2 - 8, 0], [0, 90, 0], root);
  }
  put(cut({ outer: rectPts(W - 2 * T, D, 0) }, T), [0, T / 2, 0], [-90, 0, 0], root);
  put(cut({ outer: rectPts(W - 2 * T, D, 0) }, T), [0, H - T / 2, 0], [-90, 0, 0], root);
  // façade du fond : maison avec cadran et porte en arc
  const backZ = -D / 2 + T / 2;
  put(cut({ outer: rectPts(W - 2 * T, H - 2 * T), holes: [archWin(0, 0, 22, 40), rectWin(-22, 70, 12, 18), rectWin(22, 70, 12, 18), rectWin(-22, 110, 12, 18), rectWin(22, 110, 12, 18)].map((h) => h.map((p) => V2(p.x, p.y - (H - 2 * T) / 2))) }, T, { kind: 'poplar' }), [0, H / 2, backZ], [0, 0, 0], root);
  dial(14, root, [0, T + 168, backZ + T / 2 + 0.6]);
  // fond derrière les ouvertures du fond (plan sombre)
  put(cut({ outer: rectPts(W - 2 * T, H - 2 * T) }, 2, { kind: 'poplar', kit: false }), [0, H / 2, backZ - T / 2 - 1.2], [0, 0, 0], root);

  // --- Pavés ---
  put(cut({ outer: rectPts(W - 2 * T, D - T, 0) }, 2), [0, T + 1, T / 2], [-90, 0, 0], root);
  const rows = Math.floor((D - 10) / 7);
  for (let r = 0; r < rows; r++) {
    const z = D / 2 - 6 - r * 7; const off = r % 2 ? 4.5 : 0;
    for (let x = -W / 2 + T + 6 + off; x < W / 2 - T - 4; x += 9) put(cut({ outer: rectPts(8, 6, 1.6) }, 1.2, { kit: false, kind: (r * 7 + Math.round(x)) % 3 ? 'birch' : 'poplar' }), [x, T + 2 + 0.6, z], [-90, 0, 0], root);
  }

  // --- Façades gauches ---
  building(root, -1, { z0: D / 2 - 2, z1: 30, h: 150, depth: 14, windows: [(L) => archWin(L * 0.3, 12, 16, 34), (L) => rectWin(L * 0.72, 18, 14, 22), (L) => rectWin(L * 0.3, 70, 14, 22), (L) => rectWin(L * 0.72, 70, 14, 22), (L) => rectWin(L * 0.5, 112, 16, 20)] });
  building(root, -1, { z0: 30, z1: -22, h: 124, depth: 22, kind: 'poplar', windows: [(L) => archWin(L * 0.5, 0, 18, 34), (L) => rectWin(L * 0.5, 54, 18, 24), (L) => rectWin(L * 0.5, 92, 14, 18)] });
  building(root, -1, { z0: -22, z1: -D / 2 + T, h: 176, depth: 12, windows: [(L) => rectWin(L * 0.5, 30, 14, 22), (L) => rectWin(L * 0.5, 80, 14, 22), (L) => archWin(L * 0.5, 128, 14, 24)] });
  // --- Façades droites : l'horloger au premier plan ---
  const shop = building(root, 1, { z0: D / 2 - 2, z1: 22, h: 132, depth: 26, kind: 'poplar', windows: [(L) => rectPts(40, 34, 2, L * 0.42, 34), (L) => archWin(L * 0.86, 0, 13, 36), (L) => rectWin(L * 0.3, 74, 14, 22), (L) => rectWin(L * 0.7, 74, 14, 22)] });
  building(root, 1, { z0: 22, z1: -30, h: 168, depth: 14, windows: [(L) => archWin(L * 0.5, 0, 16, 30), (L) => rectWin(L * 0.5, 50, 16, 22), (L) => rectWin(L * 0.5, 96, 16, 22), (L) => rectWin(L * 0.5, 138, 12, 16)] });
  building(root, 1, { z0: -30, z1: -D / 2 + T, h: 140, depth: 20, kind: 'poplar', windows: [(L) => rectWin(L * 0.5, 22, 14, 22), (L) => rectWin(L * 0.5, 72, 14, 22)] });
  // vitrine : croisillons, tablette, cadrans
  const L0 = D / 2 - 2 - 22; const wz = D / 2 - 2 - L0 * 0.42; const wy = T + 34;
  const xf = shop.xf;
  for (const dz of [-6.7, 6.7]) { const m = box(1, 34, 1, MAT.brassDark); m.position.set(xf - 1, wy, wz + dz); root.add(m); }
  { const m = box(1, 1, 40, MAT.brassDark); m.position.set(xf - 1, wy + 6, wz); root.add(m); }
  put(cut({ outer: rectPts(22, 44, 1) }, 2), [xf + 11, wy - 15, wz], [-90, 0, 0], root);
  dial(6.5, root, [xf + 8, wy - 7, wz - 10], -Math.PI / 2);
  dial(5, root, [xf + 9, wy - 9, wz + 9], -Math.PI / 2);
  dial(8, root, [xf + 14, wy + 8, wz + 1], -Math.PI / 2);
  // enseigne en forme de montre de poche, en saillie
  const sy = T + 104, sz = D / 2 - 18;
  const arm = rodX(22, 0.9, MAT.brass); arm.position.set(xf - 11, sy + 14, sz); root.add(arm);
  const sign = new THREE.Group(); sign.position.set(xf - 18, sy, sz); root.add(sign);
  put(cut({ outer: [...circlePts(10.5, 64)], holes: [] }, 2.4, { kind: 'poplar' }), [0, 0, 0], [0, 0, 0], sign);
  const bow = torus(3, 0.8, MAT.brass, 32); bow.position.set(0, 13.6, 0); sign.add(bow);
  const crown = rod(2.4, 1.4, MAT.brass); crown.position.set(0, 11.4, 0); sign.add(crown);
  for (const z of [-1.5, 1.5]) dial(8, sign, [0, 0, z * 1.05], z < 0 ? Math.PI : 0);
  for (const dx of [-3, 3]) { const ch = rod(3.4, 0.35, MAT.brass); ch.position.set(dx, 15.4, 0); sign.add(ch); }
  // lanternes (décor, sans lumière)
  for (const [x, y, z] of [[-W / 2 + T + 14 + 6, T + 96, 34], [-W / 2 + T + 12 + 6, T + 70, -60], [W / 2 - T - 14 - 6, T + 120, -10]]) {
    const s = Math.sign(x);
    const br = rodX(8, 0.7, MAT.blackMetal); br.position.set(x + s * 1, y + 8, z); root.add(br);
    const l = lathe([[0, 0], [3.2, 0], [3.6, 6], [2.4, 8], [0.6, 9.5], [0, 9.5]], MAT.brass, 6); l.position.set(x - s * 3, y, z); root.add(l);
    const glassL = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 3, 5, 6), MAT.glass); glassL.position.set(x - s * 3, y + 3.2, z); root.add(glassL);
  }
  // passerelle en arc au fond
  const bz = -40;
  put(cut({ outer: rectPts(W - 2 * T, 44), holes: [chaikin([...polyPts([[-30, -22], [30, -22]]), ...arcPts(30, 0, Math.PI, 20, 0, -2)], 1), rectWin(-10, 12, 7, 8), rectWin(10, 12, 7, 8)] }, 3, { kind: 'poplar' }), [0, T + 150, bz], [0, 0, 0], root);
  put(cut({ outer: rectPts(W - 2 * T, 20) }, 3), [0, T + 172 + 1.5, bz - 8.5], [-90, 0, 0], root);

  return {
    root,
    dessus: 'profil',
    detail: { target: [xf - 2, wy + 6, wz + 4], az: -32, el: 6, dist: 190, aperture: 1.8 },
    situation: {
      az: 22, el: 6, props: false, mat: false, margin: 0.18,
      extra: () => {
        const g = new THREE.Group();
        const colors = ['#6B4A36', '#2E4A66', '#8A5A3E', '#4A5E46', '#9A8463', '#5A3440'];
        let x = -W / 2 - 0.5; let k = 0;
        for (let i = 0; i < 4; i++) { const w = 26 + (i % 3) * 7, h = 210 + (i * 13) % 40; const b = standingBook(w, h, 160, colors[k++ % 6]); b.position.x = x - w / 2; b.position.z = 0; g.add(b); x -= w + 0.5; }
        x = W / 2 + 0.5;
        for (let i = 0; i < 4; i++) { const w = 24 + (i % 2) * 9, h = 220 - (i * 17) % 50; const b = standingBook(w, h, 160, colors[k++ % 6]); b.position.x = x + w / 2; g.add(b); x += w + 0.5; }
        return [g];
      },
    },
    kitExtras: () => {
      const g = new THREE.Group();
      for (let i = 0; i < 3; i++) { const d = dial(8, g, [i * 22, 0.4, 0]); d.rotation.x = -Math.PI / 2; }
      const pv = box(60, 1.2, 30, MAT.kraft); pv.position.set(110, 0.6, 0); g.add(pv);
      return [g];
    },
  };
}
