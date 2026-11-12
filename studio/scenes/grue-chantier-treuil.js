// Grue de chantier à treuil (démonstration) : socle lesté, mât en treillis, pivot, flèche et contre-flèche
// en treillis, contrepoids, tambour de treuil à manivelle avec fil enroulé, chariot et crochet en laiton.
// Le fil passe du tambour à la poulie de pied de flèche, longe la flèche jusqu'au chariot et descend au crochet.
import * as THREE from 'three';
import { MAT, dowelMaterial } from '../lib/materials.js';
import { cut, put, rectPts, circlePts, polyPts, chaikin, trussPts, rod, rodZ, cap, lathe, torus, wire, box, sphere } from '../lib/parts.js';

const D2R = THREE.MathUtils.degToRad;
const SLEW = 68; // orientation de la flèche (degrés depuis l'avant)

export function build() {
  const root = new THREE.Group();
  const t = 3;
  // --- Socle lesté ---
  const BY = 12;
  put(cut({ outer: rectPts(150, 150, 6) }, 4), [0, BY - 2, 0], [-90, 0, 0], root);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) put(cut({ outer: rectPts(20, 20, 3) }, 8, { kind: 'poplar' }), [sx * 60, 4, sz * 60], [-90, 0, 0], root);
  for (let k = 0; k < 3; k++) for (const sx of [-1, 1]) put(cut({ outer: rectPts(34, 62, 2) }, 4, { kind: k % 2 ? 'poplar' : 'birch' }), [sx * 40, BY + 2 + k * 4, 0], [-90, 0, 0], root);
  // --- Mât : quatre panneaux en treillis ---
  const MW = 38, MH = 270, MT = BY + MH;
  for (let i = 0; i < 4; i++) {
    const w = i % 2 ? MW - 2 * t : MW;
    const p = cut(trussPts(MH, w, 3.5, 8), t, { kind: i % 2 ? 'poplar' : 'birch' });
    const g = new THREE.Group(); g.rotation.y = D2R(i * 90); g.position.y = BY + MH / 2; root.add(g);
    put(p, [0, 0, MW / 2 - t / 2], [0, 0, 90], g);
  }
  put(cut({ outer: rectPts(MW + 6, MW + 6, 2), holes: [circlePts(2.6, 20)] }, 4), [0, MT + 2, 0], [-90, 0, 0], root);

  // --- Partie tournante ---
  const top = new THREE.Group(); top.position.y = MT + 4; top.rotation.y = D2R(SLEW - 90); root.add(top);
  put(cut({ outer: circlePts(26, 120), holes: [circlePts(2.6, 20)] }, 4), [0, 2, 0], [-90, 0, 0], top);
  const y0 = 4; // dessus de la couronne
  const JL = 230, JH = 26, JZ = 12, CL = 96, CH = 20;
  for (const s of [-1, 1]) {
    put(cut(trussPts(JL, JH, 3, 9), t), [JL / 2 + 6, y0 + JH / 2, s * JZ], [0, 0, 0], top);
    put(cut(trussPts(CL, CH, 3, 4), t, { kind: 'poplar' }), [-CL / 2 - 6, y0 + CH / 2, s * JZ], [0, 0, 0], top);
  }
  // traverses (haut et bas) de la flèche
  for (let x = 14; x < JL; x += 26) for (const y of [y0 + 1.5, y0 + JH - 1.5]) put(cut({ outer: rectPts(6, 2 * JZ + t, 1) }, 3, { kit: x < 20 }), [x, y, 0], [-90, 0, 0], top);
  // plancher de contre-flèche
  put(cut({ outer: rectPts(CL, 2 * JZ + t + 6, 2) }, 3), [-CL / 2 - 6, y0 + 1.5, 0], [-90, 0, 0], top);
  // contrepoids (plaques empilées)
  for (let k = 0; k < 4; k++) put(cut({ outer: rectPts(36, 30, 2) }, 4, { kind: k % 2 ? 'birch' : 'poplar' }), [-CL - 6 + 16 + k * 4.2 - 8, y0 + 3 - 12, 0], [0, 90, 0], top);
  // pylône en A et haubans
  const PH = 62;
  for (const s of [-1, 1]) put(cut({ outer: polyPts([[-16, 0], [-10, 0], [0, PH - 8], [10, 0], [16, 0], [3, PH], [-3, PH]]) }, t), [0, y0 + JH, s * JZ], [0, 0, 0], top);
  const peak = [0, y0 + JH + PH - 2, 0];
  for (const s of [-1, 1]) {
    top.add(wire([[0, peak[1], s * (JZ - 1)], [JL - 30, y0 + JH, s * (JZ - 1)]], 0.5));
    top.add(wire([[0, peak[1], s * (JZ - 1)], [-CL + 4, y0 + CH, s * (JZ - 1)]], 0.5));
  }
  // cabine
  const cab = new THREE.Group(); cab.position.set(20, y0 - 2, JZ + 14); top.add(cab);
  put(cut({ outer: rectPts(26, 30, 2), holes: [rectPts(18, 12, 2, 0, 6)] }, 3), [0, -15, 12], [0, 0, 0], cab);
  put(cut({ outer: rectPts(26, 30, 2) }, 3), [0, -15, -12], [0, 0, 0], cab);
  for (const s of [-1, 1]) put(cut({ outer: rectPts(21, 30, 2), holes: [rectPts(13, 12, 2, 0, 6)] }, 3), [s * 11.5, -15, 0], [0, 90, 0], cab);
  put(cut({ outer: rectPts(30, 30, 2) }, 3), [0, 1.5, 0], [-90, 0, 0], cab);
  put(cut({ outer: rectPts(10, 22, 1) }, 3), [0, -4, -18], [0, 0, 0], cab); // console vers le pivot

  // --- Treuil sur la contre-flèche ---
  const wx = -46, wy = y0 + 3 + 16;
  for (const s of [-1, 1]) put(cut({ outer: chaikin(polyPts([[-14, -16], [14, -16], [10, 4], [0, 12], [-10, 4]]), 1), holes: [circlePts(2.6, 20)] }, t), [wx, wy, s * (JZ + 4)], [0, 0, 0], top);
  const drum = new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 2 * JZ - 2, 40), dowelMaterial()); drum.rotation.x = Math.PI / 2; drum.position.set(wx, wy, 0); drum.castShadow = drum.receiveShadow = true; top.add(drum);
  for (const s of [-1, 1]) put(cut({ outer: circlePts(13, 80), holes: [circlePts(2.6, 20)] }, t), [wx, wy, s * (JZ - 1)], [0, 0, 0], top);
  // fil enroulé : spires jointives sur deux couches
  for (let layer = 0; layer < 2; layer++) for (let i = 0; i < 16; i++) {
    const z = -JZ + 3 + i * 1.25 + layer * 0.6; if (z > JZ - 3) break;
    const ring = torus(6.6 + layer * 1.2, 0.62, MAT.string, 48); ring.position.set(wx, wy, z); top.add(ring);
  }
  const ax = rodZ(2 * JZ + 22, 2.4, MAT.brass); ax.position.set(wx, wy, 4); top.add(ax);
  // manivelle
  const cz = JZ + 4 + 4;
  put(cut({ outer: chaikin(polyPts([[-5, -6], [5, -6], [4, 26], [0, 31], [-4, 26]]), 1), holes: [circlePts(2.5, 20), circlePts(2.5, 20, 0, 24)] }, 3), [wx, wy, cz], [0, 0, 150], top);
  const ka = D2R(150 + 90); const kx = wx + Math.cos(ka) * 24, ky = wy + Math.sin(ka) * 24;
  put(lathe([[0, 0], [3.8, 0], [4.2, 3], [4.2, 15], [3.8, 17], [0, 17]], dowelMaterial(), 40), [kx, ky, cz + 1.5], [90, 0, 0], top);
  put(cap(4, 2), [kx, ky, cz + 18.5], [90, 0, 0], top);
  put(cap(3.4, 2), [wx, wy, cz + 1.5], [90, 0, 0], top);
  put(cap(3.4, 2), [wx, wy, -JZ - 5.5], [-90, 0, 0], top);

  // --- Chariot, fil de levage, crochet ---
  const TX = 172, HY = -150;
  put(cut({ outer: rectPts(26, 2 * JZ + 10, 2) }, 3), [TX, y0 - 2, 0], [-90, 0, 0], top);
  for (const s of [-1, 1]) put(cut({ outer: rectPts(26, 14, 2), holes: [circlePts(1.4, 16, -7, -2), circlePts(1.4, 16, 7, -2)] }, 3), [TX, y0 - 9, s * (JZ - 4)], [0, 0, 0], top);
  for (const dx of [-7, 7]) { const pul = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 4.5, 3, 32), dowelMaterial()); pul.rotation.x = Math.PI / 2; pul.position.set(TX + dx, y0 - 11, 0); pul.castShadow = true; top.add(pul); }
  // poulie de pied de flèche
  const pul0 = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 3, 32), dowelMaterial()); pul0.rotation.x = Math.PI / 2; pul0.position.set(12, y0 + 8, 0); top.add(pul0);
  top.add(wire([[wx + 1, wy + 7.6, 0], [12, y0 + 13, 0]], 0.6));
  top.add(wire([[12, y0 + 3, 0], [TX - 7, y0 - 6.5, 0]], 0.6));
  top.add(wire([[TX - 11.5, y0 - 11, 0], [TX - 11.5, HY + 10, 0]], 0.6));
  top.add(wire([[TX + 11.5, y0 - 11, 0], [TX + 11.5, HY + 10, 0]], 0.6));
  // moufle et crochet
  const blk = box(28, 16, 8, MAT.brassDark); blk.position.set(TX, HY + 2, 0); top.add(blk);
  const hookR = 7;
  const shank = rod(10, 1.6, MAT.brass); shank.position.set(TX, HY - 11, 0); top.add(shank);
  const hook = new THREE.Mesh(new THREE.TorusGeometry(hookR, 1.6, 16, 48, Math.PI * 1.45), MAT.brass); hook.position.set(TX + hookR - 0.5, HY - 16 - hookR, 0); hook.rotation.z = D2R(110); hook.castShadow = true; top.add(hook);
  const tip = sphere(1.9, MAT.brass); tip.position.copy(hook.position).add(new THREE.Vector3(Math.cos(D2R(110 + 261)) * hookR, Math.sin(D2R(110 + 261)) * hookR, 0)); top.add(tip);

  const wDrum = new THREE.Vector3(wx, wy, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), D2R(SLEW - 90)).add(new THREE.Vector3(0, MT + 4, 0));
  return {
    root,
    dessus: { az: SLEW - 90, el: 6 },
    detail: { target: wDrum.toArray(), az: 30, el: 24, dist: 150, aperture: 1.8 },
    situation: { az: -18, el: 10 },
    kitExtras: () => {
      const g = new THREE.Group();
      for (let i = 0; i < 3; i++) { const r = rodZ(60, 2.4, MAT.brass); r.rotation.y = Math.PI / 2; r.position.set(0, 2.4, i * 8); g.add(r); }
      for (let i = 0; i < 5; i++) { const r = torus(14, 0.62, MAT.string, 48); r.rotation.x = Math.PI / 2; r.position.set(70, 0.7 + i * 1.2, 8); g.add(r); }
      const hk = new THREE.Mesh(new THREE.TorusGeometry(7, 1.6, 16, 48, Math.PI * 1.45), MAT.brass); hk.rotation.x = Math.PI / 2; hk.position.set(100, 1.6, 8); g.add(hk);
      return [g];
    },
  };
}
