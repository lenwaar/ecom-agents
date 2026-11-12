// Moulin à vent à manivelle (démonstration) : socle ajouré qui laisse voir la transmission (manivelle latérale,
// pignon qui engrène une roue à couronne horizontale), arbre vertical jusqu'au chapeau, second renvoi d'angle
// vers l'arbre des ailes. Tour tronconique en quatre panneaux, chapeau à deux pentes, quatre ailes en treillis.
import * as THREE from 'three';
import { MAT, dowelMaterial } from '../lib/materials.js';
import { gearProfile, cut, put, rectPts, circlePts, polyPts, chaikin, arcPts, rod, rodX, rodZ, cap, lathe, V2 } from '../lib/parts.js';

const D2R = THREE.MathUtils.degToRad;

// Roue à couronne : disque + dents rapportées debout sur la face supérieure
function crownGear(parent, { y, R = 30, n = 24, toothH = 7, phase = 0, discR = 36 }) {
  const g = new THREE.Group(); g.position.y = y; parent.add(g);
  put(cut({ outer: circlePts(discR, 140), holes: [circlePts(2.6, 24), ...[0, 1, 2, 3].map((k) => chaikin([...arcPts(discR - 12, k * Math.PI / 2 + 0.25, (k + 1) * Math.PI / 2 - 0.25, 10), ...arcPts(10, (k + 1) * Math.PI / 2 - 0.5, k * Math.PI / 2 + 0.5, 4)], 2))] }, 4), [0, 0, 0], [-90, 0, 0], g);
  for (let i = 0; i < n; i++) {
    const a = phase + (i / n) * Math.PI * 2;
    const tooth = cut({ outer: chaikin(polyPts([[-3.4, 0], [3.4, 0], [3.4, toothH - 1.2], [2.4, toothH], [-2.4, toothH], [-3.4, toothH - 1.2]]), 1) }, 2.6, { kit: i < 1 });
    // dent radiale : son plan contient le rayon
    put(tooth, [Math.cos(a) * R, 2, -Math.sin(a) * R], [0, THREE.MathUtils.radToDeg(a), 0], g);
  }
  return g;
}

export function build() {
  const root = new THREE.Group();
  const t = 4;
  // --- Socle ajouré ---
  const PB = 132, PH = 52;
  put(cut({ outer: rectPts(PB, PB, 4) }, t), [0, t / 2, 0], [-90, 0, 0], root);
  put(cut({ outer: rectPts(PB, PB, 4), holes: [circlePts(2.8, 24)] }, t), [0, PH - t / 2, 0], [-90, 0, 0], root);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const px = sx * (PB / 2 - 10), pz = sz * (PB / 2 - 10);
    put(cut({ outer: rectPts(16, PH - 2 * t) }, 3), [px, PH / 2, pz], [0, 0, 0], root);
    put(cut({ outer: rectPts(16, PH - 2 * t) }, 3), [px, PH / 2, pz], [0, 90, 0], root);
  }
  // paliers de l'arbre de manivelle (flasques ajourées)
  const Rc = 30; const crownY = 8;
  const nC0 = 24, m0 = (2 * Math.PI * Rc) / nC0 / Math.PI, zp0 = 10;
  const yc = crownY + 4 / 2 + 7 / 2 + 2 + (m0 * zp0) / 2 - 2.2;
  for (const x of [Rc + 14, PB / 2 - 4]) {
    put(cut({ outer: chaikin(polyPts([[-9, -yc + t], [9, -yc + t], [5, -4], [5, 3], [3, 6], [-3, 6], [-5, 3], [-5, -4]]), 1), holes: [circlePts(2.7, 24)] }, 3), [x, yc, 0], [0, 90, 0], root);
  }
  // roue à couronne sur l'arbre vertical
  const nC = 24;
  crownGear(root, { y: crownY, R: Rc, n: nC, phase: Math.PI / nC });
  // pignon sur l'arbre de manivelle (plan YZ, axe X), dent du bas entre deux dents de la couronne
  const m = (2 * Math.PI * Rc) / nC / Math.PI; const zp = 10;
  const pin = gearProfile({ z: zp, m, bore: 2.6, pa: 20 });
  const pinY = crownY + 4 / 2 + 7 / 2 + 2 + (m * zp) / 2 - 2.2;
  put(cut(pin, 4), [Rc, pinY, 0], [0, 90, -90], root);
  // arbre de manivelle
  const shaftL = PB / 2 + 22 - (Rc - 6);
  const sh = rodX(shaftL, 2.5, MAT.brass); put(sh, [(Rc - 6) + shaftL / 2, pinY, 0], [0, 0, 0], root);
  // manivelle extérieure
  const cx = PB / 2 + 12;
  const arm = cut({ outer: chaikin(polyPts([[-6, -7], [6, -7], [5, 30], [0, 36], [-5, 30]]), 1), holes: [circlePts(2.6, 20), circlePts(2.6, 20, 0, 28)] }, 4);
  put(arm, [cx, pinY, 0], [0, 90, -18], root);
  const hx = cx + 2, hz = -Math.sin(D2R(18)) * 28, hy = pinY + Math.cos(D2R(18)) * 28;
  const knob = lathe([[0, 0], [4.2, 0], [4.6, 3], [4.6, 17], [4.2, 19], [0, 19]], dowelMaterial(), 40); put(knob, [hx, hy, hz], [0, 0, -90], root);
  const kc = cap(4.4, 2.2); put(kc, [hx + 19, hy, hz], [0, 0, -90], root);
  const c2 = cap(3.6, 2.2); put(c2, [cx + 2, pinY, 0], [0, 0, -90], root);

  // --- Tour tronconique ---
  const TH = 176, bw = 92, tw = 62; const y0 = PH; const lean = Math.atan(((bw - tw) / 2) / TH); const L = TH / Math.cos(lean);
  const trap = (w0, w1, holes = []) => ({ outer: polyPts([[-w0 / 2, 0], [w0 / 2, 0], [w1 / 2, L], [-w1 / 2, L]]), holes });
  const doorArch = chaikin([...polyPts([[-12, 6], [12, 6]]), ...arcPts(12, 0, Math.PI, 16, 0, 34)], 1);
  const win = (y, w = 14, h = 22) => chaikin([...polyPts([[-w / 2, y], [w / 2, y]]), ...arcPts(w / 2, 0, Math.PI, 10, 0, y + h - w / 2)], 1);
  const panelSpecs = [
    { ry: 0, holes: [doorArch, win(92), win(140, 12, 18)] },
    { ry: 90, holes: [win(60, 16, 26), win(122)] },
    { ry: 180, holes: [win(70), win(130, 12, 18)] },
    { ry: -90, holes: [win(60, 16, 26), win(122)] },
  ];
  panelSpecs.forEach((p, i) => {
    const inset = i % 2 === 0 ? 6 : 0; // façades entre les flancs
    const g = new THREE.Group(); g.rotation.y = D2R(p.ry); g.position.y = y0; root.add(g);
    const pm = cut(trap(bw - inset, tw - inset, p.holes), 3, { kind: i % 2 ? 'birch' : 'poplar' });
    const tilt = new THREE.Group(); tilt.position.z = bw / 2 - 1.5; tilt.rotation.x = -lean; tilt.add(pm); g.add(tilt);
  });
  // plancher haut + arbre vertical
  const yTop = y0 + TH;
  put(cut({ outer: rectPts(tw + 8, tw + 8, 3), holes: [circlePts(2.8, 24)] }, 4), [0, yTop + 2, 0], [-90, 0, 0], root);
  const vs = rod(yTop + 14 - crownY, 2.5, MAT.brass); put(vs, [0, crownY + (yTop + 14 - crownY) / 2, 0], [0, 0, 0], root);

  // --- Chapeau à deux pentes (le renvoi d'angle haut est logé dedans) ---
  const capW = 86, capD = 96, capH = 52; const yc0 = yTop + 4;
  const gable = { outer: polyPts([[-capW / 2, 0], [capW / 2, 0], [0, capH]]), holes: [circlePts(3, 24, 0, 20)] };
  put(cut(gable, 4), [0, yc0, capD / 2 - 2], [0, 0, 0], root);
  put(cut({ outer: gable.outer }, 4), [0, yc0, -capD / 2 + 2], [0, 0, 0], root);
  const slope = Math.atan2(capH, capW / 2); const rl = Math.hypot(capW / 2, capH) + 6;
  for (const s of [-1, 1]) {
    const rp = cut({ outer: rectPts(rl, capD + 10, 2) }, 3);
    const g = new THREE.Group(); g.position.set(s * capW / 4, yc0 + capH / 2 + 1.5, 0); g.rotation.z = s * -slope; root.add(g);
    rp.rotation.x = -Math.PI / 2; g.add(rp);
  }
  // arbre des ailes
  const hubZ = capD / 2 + 14; const hubY = yc0 + 20;
  const ss = rodZ(hubZ + 6, 2.5, MAT.brass); put(ss, [0, hubY, hubZ / 2 - 2], [0, 0, 0], root);

  // --- Ailes en treillis ---
  const hub = cut({ outer: circlePts(15, 80), holes: [circlePts(2.6, 20)] }, 4); put(hub, [0, hubY, hubZ], [0, 0, 0], root);
  const hubC = cap(5, 3, MAT.brassPolished); put(hubC, [0, hubY, hubZ + 2], [90, 0, 0], root);
  const SL = 116, SW = 30;
  for (let k = 0; k < 4; k++) {
    const a = 45 + k * 90;
    const holes = []; const cols = 6, rows = 2;
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) holes.push(rectPts((SL - 34) / cols - 3, (SW - 9) / rows - 3, 0.8, 30 + (i + 0.5) * ((SL - 34) / cols), -SW / 2 + 6 + (j + 0.5) * ((SW - 9) / rows)));
    const sail = cut({ outer: polyPts([[10, -3], [26, -3], [26, -SW / 2], [SL, -SW / 2], [SL, SW / 2 - 4], [26, SW / 2 - 4], [26, 3], [10, 3]]), holes }, 3, { kind: 'poplar' });
    put(sail, [0, hubY, hubZ - 3.5], [0, 0, a], root);
  }

  return {
    root,
    dessus: 'profil',
    detail: { target: [Rc - 4, crownY + 11, 0], az: 60, el: 2, dist: 210, aperture: 2.2 },
    situation: { az: 22, el: 11 },
    kitExtras: () => {
      const g = new THREE.Group();
      for (let i = 0; i < 3; i++) { const r = rodZ([240, 110, 80][i], 2.5, MAT.brass); r.rotation.y = Math.PI / 2; r.position.set(0, 2.5, i * 8); g.add(r); }
      for (let i = 0; i < 4; i++) { const c = cap(3.6, 2.4); c.position.set(130 + i * 10, 0, 26); g.add(c); }
      return [g];
    },
  };
}
