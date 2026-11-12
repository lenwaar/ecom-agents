// Planétaire mécanique (démonstration) : socle ajouré à deux plateaux. La manivelle latérale entraîne, par un
// pignon et une roue à couronne, un arbre de renvoi qui porte quatre roues ; chacune engrène la roue d'un tube
// concentrique (entraxe commun 36 mm, module 1,5 : 30/18, 24/24, 18/30, 12/36 dents). Chaque tube porte un bras
// et sa planète ; le Soleil en laiton est fixe au sommet de l'axe central. Orbites gravées sur le plateau.
import * as THREE from 'three';
import { MAT, dowelMaterial } from '../lib/materials.js';
import { gearProfile, meshPhase, cut, put, rectPts, circlePts, polyPts, chaikin, arcPts, rod, rodX, cap, lathe, torus, sphere, box, V2 } from '../lib/parts.js';

const D2R = THREE.MathUtils.degToRad;

function crown(parent, { y, x, R = 16, n = 16, toothH = 6, discR = 20 }) {
  const g = new THREE.Group(); g.position.set(x, y, 0); parent.add(g);
  put(cut({ outer: circlePts(discR, 100), holes: [circlePts(2.6, 20)] }, 4), [0, 0, 0], [-90, 0, 0], g);
  for (let i = 0; i < n; i++) {
    const a = Math.PI / n + (i / n) * Math.PI * 2;
    put(cut({ outer: chaikin(polyPts([[-3, 0], [3, 0], [3, toothH - 1], [2, toothH], [-2, toothH], [-3, toothH - 1]]), 1) }, 2.4, { kit: i < 1 }), [Math.cos(a) * R, 2, -Math.sin(a) * R], [0, THREE.MathUtils.radToDeg(a), 0], g);
  }
}

export function build() {
  const root = new THREE.Group();
  const BR = 80, BH = 70, t = 4, lift = 8;
  const base = new THREE.Group(); base.position.y = lift; root.add(base);
  // pieds tournés
  for (let k = 0; k < 3; k++) { const a = D2R(30 + k * 120); const f = lathe([[0, 0], [8, 0], [8.5, 2], [6.5, 5], [7, lift], [0, lift]], dowelMaterial(), 40); f.position.set(Math.cos(a) * (BR - 16), 0, Math.sin(a) * (BR - 16)); root.add(f); }
  // plateaux
  put(cut({ outer: circlePts(BR, 200), holes: [circlePts(2.6, 20, 36, 0)] }, t), [0, t / 2, 0], [-90, 0, 0], base);
  const ringHoles = [circlePts(6.2, 32)];
  put(cut({ outer: circlePts(BR, 200), holes: ringHoles }, t, { kind: 'poplar' }), [0, BH - t / 2, 0], [-90, 0, 0], base);
  // orbites gravées
  for (const r of [38, 58, 74]) { const o = torus(r, 0.45, MAT.engrave, 160); o.rotation.x = Math.PI / 2; o.scale.z = 0.4; o.position.y = BH + 0.05; o.castShadow = false; base.add(o); }
  // colonnes ajourées
  for (let k = 0; k < 3; k++) {
    const a = 90 + k * 120; const r = BR - 12;
    const post = cut({ outer: rectPts(14, BH - 2 * t, 1), holes: [rectPts(6, BH - 2 * t - 16, 3)] }, t);
    put(post, [Math.cos(D2R(a)) * r, BH / 2, -Math.sin(D2R(a)) * r], [0, a + 90, 0], base);
  }
  // --- Train d'engrenages ---
  const m = 1.5, d = 36;
  const pairs = [[30, 18], [24, 24], [18, 30], [12, 36]]; // [arbre de renvoi, tube]
  const layers = [36, 42, 48, 54];
  pairs.forEach(([za, zb], k) => {
    const y = layers[k];
    const tubeG = { x: 0, y: 0, z: zb, phase: D2R(k * 17) };
    const phA = meshPhase(tubeG, d, 0, za);
    put(cut(gearProfile({ z: zb, m, bore: 3 + k * 0.8, spokes: zb >= 24 ? 5 : 0, windowRound: 2 }), 3, { kind: k % 2 ? 'poplar' : 'birch' }), [0, y, 0], [-90, 0, THREE.MathUtils.radToDeg(tubeG.phase)], base);
    put(cut(gearProfile({ z: za, m, bore: 2.6, spokes: za >= 24 ? 4 : 0 }), 3, { kind: k % 2 ? 'birch' : 'poplar' }), [d, y, 0], [-90, 0, THREE.MathUtils.radToDeg(phA)], base);
  });
  const offShaft = rod(BH - 2, 2.4, MAT.brass); offShaft.position.set(d, BH / 2, 0); base.add(offShaft);
  // renvoi d'angle : roue à couronne + pignon de manivelle
  crown(base, { y: t + 2, x: d });
  const pz = 8; const pm = (2 * Math.PI * 16) / 16 / Math.PI; const pY = t + 2 + 2 + 3 + 2 + (pm * pz) / 2 - 2;
  put(cut(gearProfile({ z: pz, m: pm, bore: 2.4 }), 4), [d + 16, pY, 0], [0, 90, -90], base);
  const cs = rodX(BR + 16 - (d + 10), 2.4, MAT.brass); cs.position.set((d + 10 + BR + 16) / 2, pY, 0); base.add(cs);
  put(cut({ outer: chaikin(polyPts([[-9, -pY + t], [9, -pY + t], [5, -4], [5, 3], [3, 6], [-3, 6], [-5, 3], [-5, -4]]), 1), holes: [circlePts(2.6, 20)] }, 3), [BR - 18, pY, 0], [0, 90, 0], base);
  const cx = BR + 14;
  put(cut({ outer: chaikin(polyPts([[-6, -7], [6, -7], [5, 28], [0, 34], [-5, 28]]), 1), holes: [circlePts(2.5, 20), circlePts(2.5, 20, 0, 26)] }, 4), [cx, pY, 0], [0, 90, 60], base);
  const ka = D2R(60); const ky = pY + Math.cos(ka) * 26, kz = -Math.sin(ka) * 26 * -1;
  put(lathe([[0, 0], [4.2, 0], [4.6, 3], [4.6, 17], [4.2, 19], [0, 19]], dowelMaterial(), 40), [cx + 2, ky, Math.sin(ka) * 26], [0, 0, -90], base);
  put(cap(4.4, 2.2), [cx + 21, ky, Math.sin(ka) * 26], [0, 0, -90], base);

  // --- Tubes concentriques, bras, planètes ---
  const armY = [118, 106, 94, 82]; // planète 0 (la plus rapide, tube intérieur) ... planète 3 (tube extérieur)
  const armR = [38, 58, 80, 104];
  const angles = [200, 320, 70, 140];
  const planetR = [5, 7.5, 6.5, 8];
  const planetMat = [MAT.brassDark, dowelMaterial(), MAT.brass, dowelMaterial()];
  const sunShaft = rod(140 - 2, 2.4, MAT.steel); sunShaft.position.y = 2 + 69; base.add(sunShaft);
  for (let k = 0; k < 4; k++) {
    const r = 3.2 + k * 0.8; const y0 = layers[k] - 1.5; const y1 = armY[k] - BH + BH; // tube du plan de sa roue au bras
    const tube = rod(armY[k] + 2 - y0, r, MAT.brass, 32); tube.position.y = (y0 + armY[k] + 2) / 2; base.add(tube);
    const R = armR[k];
    const arm = cut({ outer: chaikin([...arcPts(8, D2R(100), D2R(260), 10), V2(R - 4, -3), ...arcPts(5.5, D2R(-90), D2R(90), 10, R, 0), V2(R - 4, 3)], 1), holes: [circlePts(r, 24)] }, 3, { kind: k % 2 ? 'poplar' : 'birch' });
    put(arm, [0, armY[k], 0], [-90, 0, angles[k]], base);
    const a = D2R(angles[k]); const px = Math.cos(a) * R, pzz = -Math.sin(a) * R;
    const pin = rod(14, 1.2, MAT.brass); pin.position.set(px, armY[k] + 1.5 + 7, pzz); base.add(pin);
    const pl = sphere(planetR[k], planetMat[k]); pl.position.set(px, armY[k] + 1.5 + 14 + planetR[k] - 1, pzz); base.add(pl);
    if (k === 3) { const ringP = torus(planetR[k] + 5, 1.1, MAT.brassPolished, 64); ringP.position.copy(pl.position); ringP.rotation.set(D2R(70), 0, D2R(20)); ringP.scale.z = 0.35; base.add(ringP); }
    if (k === 2) { const moonArm = rod(14, 0.6, MAT.brass); moonArm.rotation.z = Math.PI / 2; moonArm.position.copy(pl.position).add(new THREE.Vector3(9, 0, 0)); base.add(moonArm); const moon = sphere(2.2, MAT.paper); moon.position.copy(pl.position).add(new THREE.Vector3(16, 0, 0)); base.add(moon); }
  }
  const sun = sphere(17, MAT.brassPolished, 64); sun.position.y = 140 + 15; base.add(sun);

  return {
    root,
    dessus: { az: 0, el: 88 },
    detail: { target: [d * 0.6, layers[1] + 2, 6], az: -24, el: 12, dist: 230, aperture: 2.4 },
    situation: { az: 24, el: 14 },
    kitExtras: () => {
      const g = new THREE.Group();
      for (let i = 0; i < 5; i++) { const r = rodX(90 - i * 10, 2.4 + i * 0.8, i ? MAT.brass : MAT.steel); r.position.set(45, 2.4 + i * 0.8, i * 12); g.add(r); }
      const s = sphere(17, MAT.brassPolished, 64); s.position.set(130, 17, 20); g.add(s);
      for (let i = 0; i < 4; i++) { const p = sphere([5, 7.5, 6.5, 8][i], i % 2 ? dowelMaterial() : MAT.brass); p.position.set(170 + i * 22, [5, 7.5, 6.5, 8][i], 20); g.add(p); }
      return [g];
    },
  };
}
