// Boîte à engrenages « Initiation » (démonstration) : platine verticale sur socle, chaîne de quatre roues
// à développante (module 2) engrenées, manivelle sur la grande roue, aiguille en laiton sur le pignon rapide.
import * as THREE from 'three';
import { MAT, dowelMaterial } from '../lib/materials.js';
import {
  gearProfile, arcPts, meshPhase, meshPos, cut, put, rectPts, circlePts, polyPts, chaikin, rodZ, cap, lathe, sphere, dowel, fingerPanel, KIT, V2,
} from '../lib/parts.js';

const M = 2; // module des engrenages (mm)

export function gears() {
  const g1 = { z: 36, x: -46, y: 66, phase: 0.05 };
  const g2 = { z: 18 }; [g2.x, g2.y] = meshPos(g1, g2.z, M, THREE.MathUtils.degToRad(22)); g2.phase = meshPhase(g1, g2.x, g2.y, g2.z);
  const g3 = { z: 28 }; [g3.x, g3.y] = meshPos(g2, g3.z, M, THREE.MathUtils.degToRad(-38)); g3.phase = meshPhase(g2, g3.x, g3.y, g3.z);
  const g4 = { z: 14 }; [g4.x, g4.y] = meshPos(g3, g4.z, M, THREE.MathUtils.degToRad(62)); g4.phase = meshPhase(g3, g4.x, g4.y, g4.z);
  return [g1, g2, g3, g4];
}

export function build() {
  const root = new THREE.Group();
  const baseY = 20; // dessus du socle
  // --- Socle : plateau, tabliers à entures ---
  const W = 210, D = 96, t = 4;
  const slotW = 26;
  const top = cut({ outer: rectPts(W, D, 4), holes: [rectPts(slotW + 0.3, t + 0.3, 0, -50, 15), rectPts(slotW + 0.3, t + 0.3, 0, 50, 15), rectPts(3.3, 12.3, 0, -70, 23), rectPts(3.3, 12.3, 0, 70, 23)] }, t);
  put(top, [0, baseY - t / 2, 0], [-90, 0, 0], root);
  const apron = fingerPanel(W - 8, 16, 3, { left: 'male', right: 'male' }, 8);
  const rail = fingerPanel(D - 8, 16, 3, { left: 'female', right: 'female' }, 8);
  const ah = 16;
  put(cut({ outer: apron }, 3), [0, ah / 2, D / 2 - 4 - 1.5 + 0.0], [0, 0, 0], root);
  put(cut({ outer: apron }, 3), [0, ah / 2, -D / 2 + 4 + 1.5], [0, 0, 0], root);
  put(cut({ outer: rail }, 3), [W / 2 - 4 - 1.5 - (W - 8) / 2 + (W - 8) / 2 - 0, ah / 2, 0], [0, 90, 0], root).position.x = (W - 8) / 2 - 1.5;
  put(cut({ outer: rail }, 3), [-(W - 8) / 2 + 1.5, ah / 2, 0], [0, 90, 0], root);

  // --- Platine verticale (z = -15) avec tenons dans le plateau ---
  const PH = 132, PW = 196, pz = -15 + 0;
  const plateOuter = chaikin(polyPts([[-PW / 2, 0], [-slotW / 2 - 50, 0], [-slotW / 2 - 50, -t], [slotW / 2 - 50, -t], [slotW / 2 - 50, 0], [-slotW / 2 + 50, 0], [-slotW / 2 + 50, -t], [slotW / 2 + 50, -t], [slotW / 2 + 50, 0], [PW / 2, 0]]), 0).concat(arcPts(PW / 2, 0, Math.PI, 90, 0, PH - PW / 2).map((p) => V2(p.x, Math.min(p.y, PH))));
  const G = gears();
  const plateHoles = G.map((g) => circlePts(2.6, 32, g.x, g.y));
  // fenêtres décoratives
  for (const k of [-1, 0, 1]) plateHoles.push(circlePts(k ? 3 : 4.5, 32, k * 14, PH - 12));
  const plate = cut({ outer: plateOuter, holes: plateHoles }, t);
  put(plate, [0, baseY, pz], [0, 0, 0], root);
  // jambes de force arrière (tenons dans le plateau)
  for (const sx of [-70, 70]) {
    const br = cut({ outer: polyPts([[0, -3], [12, -3], [12, 0], [38, 0], [6, 92], [0, 92]]) }, 3);
    put(br, [sx, baseY, pz - t / 2], [0, 90, 0], root);
  }

  // --- Roues ---
  const gz = pz + t / 2 + 1.5 + 1.5; // plan des roues (épaisseur 3, rondelle 1,5)
  const specs = [
    { spokes: 6, t: 3 }, { spokes: 4, t: 3 }, { spokes: 5, t: 3 }, { spokes: 0, t: 3 },
  ];
  G.forEach((g, i) => {
    const prof = gearProfile({ z: g.z, m: M, bore: 2.6, spokes: specs[i].spokes, pa: 20 });
    const mesh = cut(prof, 3, { kind: i % 2 ? 'poplar' : 'birch' });
    put(mesh, [g.x, baseY + g.y, gz], [0, 0, THREE.MathUtils.radToDeg(g.phase)], root);
    // rondelle entre platine et roue
    const washer = cut({ outer: circlePts(5, 40), holes: [circlePts(2.6, 24)] }, 1.5);
    put(washer, [g.x, baseY + g.y, pz + t / 2 + 0.75], [0, 0, 0], root);
    // axe laiton + capuchon
    const capZ = i === 0 ? gz + 4.5 : i === 3 ? gz + 2.5 : gz + 1.5;
    const z0 = pz - t / 2 - 1.5, z1 = capZ + 1.2;
    const ax = rodZ(z1 - z0, 2.5, MAT.brass); put(ax, [g.x, baseY + g.y, (z0 + z1) / 2], [0, 0, 0], root);
    const c = cap(3.6, 2.6); put(c, [g.x, baseY + g.y, capZ], [90, 0, 0], root);
    const cb = cap(3.6, 2.6); put(cb, [g.x, baseY + g.y, pz - t / 2], [-90, 0, 0], root);
  });
  // manivelle sur la grande roue
  const g1 = G[0];
  const armL = 30;
  const arm = cut({ outer: chaikin(polyPts([[-7, -6], [armL, -5], [armL + 6, 0], [armL, 5], [-7, 6], [-10, 0]]), 2), holes: [circlePts(2.6, 24), circlePts(2.6, 24, armL, 0)] }, 3);
  const ang = 35;
  put(arm, [g1.x, baseY + g1.y, gz + 3], [0, 0, ang], root);
  const a = THREE.MathUtils.degToRad(ang);
  const kx = g1.x + Math.cos(a) * armL, ky = baseY + g1.y + Math.sin(a) * armL;
  const knob = new THREE.Group(); const hd = lathe([[0, 0], [4.2, 0], [4.6, 3], [4.6, 17], [4.2, 19], [0, 19]], dowelMaterial(), 48); knob.add(hd); const kc = cap(4.4, 2.4); kc.position.y = 19; knob.add(kc);
  put(knob, [kx, ky, gz + 4.5], [90, 0, 0], root);
  // aiguille laiton sur le pignon rapide
  const g4 = G[3];
  const needle = new THREE.Mesh(new THREE.ExtrudeGeometry(new THREE.Shape(chaikin(polyPts([[-8, -2], [26, -0.8], [28, 0], [26, 0.8], [-8, 2], [-10, 0]]), 1)), { depth: 0.8, bevelEnabled: false }), MAT.brassPolished);
  needle.castShadow = true; put(needle, [g4.x, baseY + g4.y, gz + 1.6], [0, 0, 118], root);

  return {
    root,
    dessus: { az: 0, el: 56 },
    detail: { target: [G[0].x + Math.cos(Math.atan2(G[1].y - G[0].y, G[1].x - G[0].x)) * 36, baseY + G[0].y + Math.sin(Math.atan2(G[1].y - G[0].y, G[1].x - G[0].x)) * 36, gz + 1], az: 24, el: 14, dist: 175, aperture: 2.6 },
    situation: { az: 22, el: 13 },
    kitExtras: () => axleBundle(5, 26),
  };
}

// Accessoires dans la boîte : axes laiton alignés + capuchons
export function axleBundle(n = 5, len = 26) {
  const g = new THREE.Group();
  for (let i = 0; i < n; i++) { const r = rodZ(len, 2.5, MAT.brass); r.rotation.y = Math.PI / 2; r.position.set(0, 2.5, i * 7); g.add(r); }
  for (let i = 0; i < n; i++) { const c = cap(3.6, 2.6); c.position.set(len / 2 + 10 + (i % 2) * 9, 0, i * 7); g.add(c); }
  return [g];
}
