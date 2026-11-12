// Voiture rétro à moteur élastique (démonstration, dessin générique sans référence à un constructeur) :
// roues à rayons avec bandage en caoutchouc, flancs découpés, capot et poupe en contreplaqué cintré,
// ailes cintrées et marchepieds, calandre à lames, phares en laiton. Moteur : élastique tendu sous le
// châssis entre un crochet avant et l'essieu arrière (qu'on remonte en faisant reculer la voiture).
import * as THREE from 'three';
import { MAT, dowelMaterial } from '../lib/materials.js';
import { cut, cutMetal, put, rectPts, circlePts, polyPts, chaikin, arcPts, wheelProfile, bentSheet, rod, rodX, rodZ, cap, lathe, torus, wire, box, V2 } from '../lib/parts.js';

const D2R = THREE.MathUtils.degToRad;
const tyreMat = new THREE.MeshStandardMaterial({ color: new THREE.Color('#2B2522'), roughness: 0.75 });
const lensMat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#F1EEE6'), roughness: 0.08, clearcoat: 1, metalness: 0 });

export function wheel(r = 26, t = 4, spokes = 10) {
  const g = new THREE.Group();
  put(cut(wheelProfile({ r, spokes, rimW: 4.5, hubR: 6.5, bore: 2.5, spokeW: 2.4 }), t), [0, 0, 0], [0, 0, 0], g);
  put(cut({ outer: circlePts(8, 48), holes: [circlePts(2.5, 20)] }, 2, { kind: 'poplar' }), [0, 0, t / 2 + 1], [0, 0, 0], g);
  const tyre = torus(r + 1.6, 2.3, tyreMat, 128); g.add(tyre);
  const hc = cap(4.2, 2.6, MAT.brassPolished); put(hc, [0, 0, t / 2 + 2], [90, 0, 0], g);
  return g; // plan XY, axe Z
}

export function build() {
  const root = new THREE.Group();
  const R = 26, AY = R + 1.6 + 2.3; // rayon roulant
  const ZF = 62, ZR = -58, TX = 45;
  // --- Roues et essieux ---
  for (const z of [ZF, ZR]) {
    for (const s of [-1, 1]) { const w = wheel(R); w.rotation.y = s * Math.PI / 2; w.position.set(s * TX, AY, z); root.add(w); }
    const ax = rodX(2 * TX + 6, 2.4, MAT.brass); ax.position.set(0, AY, z); root.add(ax);
  }
  // --- Châssis ---
  for (const s of [-1, 1]) put(cut({ outer: rectPts(168, 12, 2), holes: [circlePts(2.6, 20, -ZF + 6, AY - 25), circlePts(2.6, 20, -ZR + 6, AY - 25)] }, 3), [s * 20, 25, 6], [0, 90, 0], root);
  for (const z of [80, 20, -40]) put(cut({ outer: rectPts(37, 10, 1), holes: z > -60 && z < 75 ? [rectPts(12, 5, 1.5, 0, -1)] : [] }, 3, { kit: z === 80 }), [0, 24, z], [0, 0, 0], root);
  // --- Flancs de caisse ---
  const sideProf = (s) => {
    const pts = [[86, 33], [86, 43], [14, 45], [10, 45], [6, 41], [-34, 41], [-37, 46], [-40, 58]];
    for (let i = 1; i <= 10; i++) { const a = (i / 10) * Math.PI / 2; pts.push([-40 - 52 * Math.sin(a), 34 + 24 * Math.cos(a)]); }
    pts.push([-94, 33]);
    return { outer: chaikin(polyPts(pts.map(([z, y]) => [-z, y])), 1), holes: [0, 1, 2, 3].map((k) => chaikin(polyPts([[-72 + k * 11, 36], [-65 + k * 11, 36], [-65 + k * 11, 40], [-72 + k * 11, 40]]), 1)) };
  };
  for (const s of [-1, 1]) put(cut(sideProf(s), 3, { kind: 'poplar' }), [s * 28.5, 0, 0], [0, 90, 0], root);
  // plancher
  put(cut({ outer: rectPts(54, 170, 3) }, 3), [0, 34, -4], [-90, 0, 0], root);
  // --- Capot cintré (arc transversal) ---
  const hoodC = []; for (let i = 0; i <= 24; i++) { const a = D2R(152 - (i / 24) * 124); hoodC.push(V2(Math.cos(a) * 33, 26 + Math.sin(a) * 33)); }
  const hood = bentSheet(hoodC, 69, 1.6); hood.rotation.y = -Math.PI / 2; hood.position.set(0, 0, 48.5); root.add(hood);
  // tablier (cloison entre capot et habitacle)
  const dashOuter = [V2(-29, 41), V2(29, 41), ...hoodC.map((p) => V2(p.x, p.y)).reverse().filter((p) => Math.abs(p.x) <= 29)];
  put(cut({ outer: dashOuter.length > 3 ? dashOuter : rectPts(58, 20) }, 3), [0, 0, 12.5], [0, 0, 0], root);
  // --- Poupe arrondie ---
  const tail = []; for (let i = 0; i <= 18; i++) { const a = (i / 18) * Math.PI / 2; tail.push(V2(-(-40 - 54 * Math.sin(a)), 33 + 25.6 * Math.cos(a))); }
  const deck = bentSheet(tail, 58, 1.6); root.add(deck);
  // banquette
  put(cut({ outer: rectPts(52, 22, 3) }, 4), [0, 37.5, -27], [-90, 0, 0], root);
  put(cut({ outer: rectPts(52, 22, 5) }, 4, { kind: 'poplar' }), [0, 41.5, -27], [-90, 0, 0], root);
  put(cut({ outer: chaikin(polyPts([[-26, 0], [26, 0], [26, 14], [20, 18], [-20, 18], [-26, 14]]), 1) }, 4, { kind: 'poplar' }), [0, 42, -37], [-8, 0, 0], root);
  // --- Calandre, phares, pare-brise ---
  const grilleOuter = chaikin([...polyPts([[-19, 0], [19, 0], [19, 22]]), ...arcPts(19, 0, Math.PI, 18, 0, 22), V2(-19, 22)], 1);
  const slots = []; for (let i = 0; i < 9; i++) slots.push(rectPts(2, 30, 1, -14 + i * 3.5, 21));
  put(cut({ outer: grilleOuter, holes: slots }, 3), [0, 25, 87.5], [0, 0, 0], root);
  put(cut({ outer: grilleOuter }, 3, { kind: 'poplar' }), [0, 25, 84.5], [0, 0, 0], root);
  const surround = cutMetal({ outer: offsetOutline(grilleOuter, 2.2), holes: [grilleOuter] }, 2.2, MAT.brassPolished); put(surround, [0, 25, 89.4], [0, 0, 0], root);
  const capR = cap(3.2, 6, MAT.brassPolished); put(capR, [0, 25 + 22 + 19 + 2, 87], [0, 0, 0], root);
  const barY = 52;
  const bar = rodX(80, 1.6, MAT.brass); bar.position.set(0, barY, 82); root.add(bar);
  for (const s of [-1, 1]) {
    const lamp = new THREE.Group(); lamp.position.set(s * 38, 64, 84); root.add(lamp);
    const shell = lathe([[0, -9], [6, -8.5], [8.5, -5], [9, 0], [9.3, 1.5], [0, 1.5]], MAT.brass, 48); shell.rotation.x = Math.PI / 2; lamp.add(shell);
    const lens = new THREE.Mesh(new THREE.CircleGeometry(8.2, 48), lensMat); lens.position.z = 1.6; lamp.add(lens);
    const ring = torus(8.6, 0.9, MAT.brassPolished, 64); ring.position.z = 1.6; lamp.add(ring);
    const stem = rod(12, 1.4, MAT.brass); stem.position.set(0, -9.5, -2); lamp.add(stem);
  }
  // pare-brise : cadre laiton et verre
  const wsY0 = 46, wsH = 26, wsW = 50, wsZ = 14;
  for (const s of [-1, 1]) { const p = rod(35, 1.3, MAT.brass); p.position.set(s * wsW / 2, 64.5, wsZ); root.add(p); }
  const topBar = rodX(wsW, 1.3, MAT.brass); topBar.position.set(0, wsY0 + wsH + 8, wsZ); root.add(topBar);
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(wsW - 2, 21), MAT.glass); glass.position.set(0, 70.5, wsZ); root.add(glass);
  // volant
  const wheelS = torus(10, 1.2, dowelMaterial(), 48); wheelS.position.set(-10, 54, 2); wheelS.rotation.x = D2R(-50); root.add(wheelS);
  const col = rod(22, 1.3, MAT.brass); col.position.set(-10, 47, 8); col.rotation.x = D2R(40); root.add(col);

  // --- Ailes cintrées et marchepieds ---
  const fenderArc = (zc, a0, a1) => { const c = []; for (let i = 0; i <= 26; i++) { const a = D2R(a0 + (a1 - a0) * (i / 26)); c.push(V2(-(zc + Math.cos(a) * (R + 7)), AY + Math.sin(a) * (R + 7))); } return c; };
  for (const s of [-1, 1]) {
    const ff = bentSheet(fenderArc(ZF, 168, 12), 15, 1.6); ff.position.x = s * TX; root.add(ff);
    const rf = bentSheet(fenderArc(ZR, 168, 12), 15, 1.6); rf.position.x = s * TX; root.add(rf);
    const fz0 = ZF + Math.cos(D2R(168)) * (R + 7), fz1 = ZR + Math.cos(D2R(12)) * (R + 7);
    const by = AY + Math.sin(D2R(168)) * (R + 7);
    put(cut({ outer: rectPts(18, fz0 - fz1 + 4, 2) }, 3), [s * (TX - 2), by - 1.5, (fz0 + fz1) / 2], [-90, 0, 0], root);
    // pattes de fixation des marchepieds
    for (const z of [fz0 - 8, fz1 + 8]) put(cut({ outer: rectPts(14, 6, 1) }, 3), [s * 34, by - 4, z], [0, 90, 0], root);
  }
  // roue de secours sur la poupe

  // --- Moteur élastique ---
  const hookZ = 70, hookY = 21;
  const hk = rodX(14, 1.2, MAT.brass); hk.position.set(0, hookY, hookZ); root.add(hk);
  for (const dx of [-2.2, 2.2]) root.add(wire([[dx, hookY, hookZ], [dx * 0.6, AY - 2.6, ZR + 2.6]], 1.15, MAT.rubber));
  const peg = rod(8, 2.6, MAT.brassDark); peg.position.set(0, AY, ZR); peg.rotation.z = Math.PI / 2; root.add(peg);

  return {
    root,
    dessus: 'profil',
    detail: { target: [0, AY - 5, ZR + 20], az: 196, el: 2, dist: 205, aperture: 1.8 },
    situation: { az: 30, el: 14 },
    kitExtras: () => {
      const g = new THREE.Group();
      for (let i = 0; i < 2; i++) { const r = rodX(96, 2.4, MAT.brass); r.position.set(48, 2.4, i * 8); g.add(r); }
      for (let i = 0; i < 4; i++) { const ty = torus(27.6, 2.3, tyreMat, 96); ty.rotation.x = Math.PI / 2; ty.position.set(130 + (i % 2) * 64, 2.3, 20 + Math.floor(i / 2) * 0.1 - 10); if (i < 2) g.add(ty); }
      const band = torus(22, 0.9, MAT.rubber, 64); band.rotation.x = Math.PI / 2; band.position.set(250, 0.9, 10); g.add(band);
      for (let i = 0; i < 2; i++) { const l = lathe([[0, -9], [6, -8.5], [8.5, -5], [9, 0], [9.3, 1.5], [0, 1.5]], MAT.brass, 48); l.position.set(300 + i * 24, 9, 10); g.add(l); }
      return [g];
    },
  };
}

function offsetOutline(pts, d) {
  // contour décalé vers l'extérieur (approximation par normales moyennes)
  const n = pts.length; const out = [];
  let area = 0; for (let i = 0; i < n; i++) { const a = pts[i], b = pts[(i + 1) % n]; area += a.x * b.y - b.x * a.y; }
  const sgn = area > 0 ? 1 : -1;
  for (let i = 0; i < n; i++) {
    const a = pts[(i - 1 + n) % n], b = pts[i], c = pts[(i + 1) % n];
    const n1 = V2(b.y - a.y, -(b.x - a.x)).normalize(), n2 = V2(c.y - b.y, -(c.x - b.x)).normalize();
    const m = n1.add(n2).normalize().multiplyScalar(d * sgn); out.push(b.clone().add(m));
  }
  return out;
}
