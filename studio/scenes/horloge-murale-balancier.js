// Horloge murale à balancier (démonstration) : horloge squelette à poids. Rouage entre deux platines reliées par
// des piliers en laiton : roue de tambour 60 dents -> pignon 10 (roue de centre 48) -> pignon 8 (roue moyenne 40)
// -> pignon 8 (roue d'échappement à rochet 30 dents). Ancre au-dessus de la roue d'échappement ; le balancier
// pend derrière la platine arrière (entre platine et mur). Poids suspendu au tambour. Cadran annulaire, aiguilles.
import * as THREE from 'three';
import { MAT, dowelMaterial } from '../lib/materials.js';
import { gearProfile, meshPos, meshPhase, cut, cutMetal, put, rectPts, circlePts, polyPts, chaikin, arcPts, rod, rodZ, cap, lathe, torus, wire, sphere, box, V2 } from '../lib/parts.js';

const D2R = THREE.MathUtils.degToRad;
const M = 1.5;

function ratchetProfile({ n = 30, ro = 27, ri = 23, bore = 2.4, spokes = 5 }) {
  const pts = []; const p = (Math.PI * 2) / n;
  for (let i = 0; i < n; i++) { const a = i * p; pts.push(V2(Math.cos(a) * ro, Math.sin(a) * ro), V2(Math.cos(a + p * 0.18) * (ro - 0.6), Math.sin(a + p * 0.18) * (ro - 0.6)), V2(Math.cos(a + p * 0.92) * ri, Math.sin(a + p * 0.92) * ri)); }
  const holes = [circlePts(bore, 24)];
  const rIn = ri - 4, hub = 6;
  for (let i = 0; i < spokes; i++) { const a0 = (i / spokes) * Math.PI * 2, a1 = ((i + 1) / spokes) * Math.PI * 2; holes.push(chaikin([...arcPts(rIn, a0 + 0.14, a1 - 0.14, 12), ...arcPts(hub, a1 - 0.35, a0 + 0.35, 4)], 2)); }
  return { outer: pts, holes };
}

export function build() {
  const root = new THREE.Group();
  // Repère : origine = axe de la roue de centre ; plaques dans le plan XY ; mur derrière (z = -12)
  const ZB = 0, ZF = 34, T = 4;
  const C = { x: 0, y: 0, z: 48, phase: 0.1 };
  const G = { z: 60 }; [G.x, G.y] = [0, -(M * (60 + 10)) / 2 - 0.15];
  const Tw = { z: 40 }; const [tx, ty] = meshPos({ x: 0, y: 0, z: 48 }, 8, M, D2R(58)); Tw.x = tx; Tw.y = ty;
  const [ex, ey] = meshPos({ x: tx, y: ty, z: 40 }, 8, M, D2R(128)); const E = { x: ex, y: ey };
  const A = { x: E.x, y: E.y + 36 };
  const L = { L1: 12, L2: 17.5, L3: 23, L4: 28.5 };
  // phases (engrènements)
  const pinC = { x: 0, y: 0, z: 10, phase: 0.2 };
  const phG = meshPhase(pinC, G.x, G.y, 60);
  const phTp = meshPhase(C, Tw.x, Tw.y, 8);
  const pinT = { x: Tw.x, y: Tw.y, z: 8, phase: phTp };
  const wheelT = { x: Tw.x, y: Tw.y, z: 40, phase: 0.3 };
  const phEp = meshPhase(wheelT, E.x, E.y, 8);

  // --- Platines ---
  const backOuter = chaikin(polyPts([[-86, -132], [86, -132], [86, 40], [60, 100], [30, 122], [0, 128], [-30, 122], [-60, 100], [-86, 40]]), 3);
  const backHoles = [
    chaikin([...arcPts(70, D2R(200), D2R(340), 20, 0, -40), ...arcPts(40, D2R(340), D2R(200), 14, 0, -40)], 2),
    chaikin(polyPts([[-70, 6], [-26, 6], [-26, 70], [-50, 84], [-70, 52]]), 3),
    chaikin(polyPts([[34, -10], [72, -10], [72, 46], [52, 84], [34, 70]]), 3),
    ...[G, C, Tw, E, A].map((p) => circlePts(2.6, 20, p.x, p.y)),
  ];
  put(cut({ outer: backOuter, holes: backHoles }, T), [0, 0, ZB], [0, 0, 0], root);
  const frontOuter = chaikin(polyPts([[-62, -108], [62, -108], [62, 30], [44, 46], [-44, 46], [-62, 30]]), 3);
  const frontHoles = [
    chaikin(polyPts([[-50, -96], [-10, -96], [-10, -70], [-50, -42]]), 3),
    chaikin(polyPts([[10, -96], [50, -96], [50, -42], [10, -70]]), 3),
    chaikin(polyPts([[-50, -26], [-14, -26], [-14, 30], [-50, 22]]), 3),
    chaikin(polyPts([[32, -26], [50, -26], [50, 20], [34, 22]]), 3),
    ...[G, C, Tw].map((p) => circlePts(2.6, 20, p.x, p.y)),
  ];
  put(cut({ outer: frontOuter, holes: frontHoles }, T, { kind: 'poplar' }), [0, 0, ZF], [0, 0, 0], root);
  // piliers laiton
  for (const [x, y] of [[-56, -100], [56, -100], [-48, 28], [48, 28]]) {
    const p = rodZ(ZF - ZB - T, 3.2, MAT.brass); p.position.set(x, y, (ZB + ZF) / 2); root.add(p);
    for (const z of [ZB - T / 2, ZF + T / 2]) { const c = cap(4.2, 2, MAT.brassPolished); c.position.set(x, y, z); c.rotation.x = z > 10 ? Math.PI / 2 : -Math.PI / 2; root.add(c); }
  }
  // entretoises vers le mur
  for (const [x, y] of [[-60, -110], [60, -110], [0, 112]]) put(cut({ outer: rectPts(14, 14, 2) }, 10, { kind: 'poplar' }), [x, y, ZB - T / 2 - 5], [0, 0, 0], root);

  // --- Rouage ---
  const gear = (prof, pos, z, ph, kind = 'birch') => put(cut(prof, 3, { kind }), [pos.x, pos.y, z], [0, 0, THREE.MathUtils.radToDeg(ph)], root);
  gear(gearProfile({ z: 60, m: M, bore: 2.6, spokes: 6 }), G, L.L1, phG);
  gear(gearProfile({ z: 10, m: M, bore: 2.6 }), C, L.L1, pinC.phase, 'poplar');
  gear(gearProfile({ z: 48, m: M, bore: 2.6, spokes: 5 }), C, L.L2, C.phase, 'poplar');
  gear(gearProfile({ z: 8, m: M, bore: 2.4 }), Tw, L.L2, phTp);
  gear(gearProfile({ z: 40, m: M, bore: 2.6, spokes: 4 }), Tw, L.L3, wheelT.phase);
  gear(gearProfile({ z: 8, m: M, bore: 2.4 }), E, L.L3, phEp, 'poplar');
  put(cut(ratchetProfile({}), 3), [E.x, E.y, L.L4], [0, 0, 4], root);
  // ancre (palettes dans la denture de la roue d'échappement)
  const anchorOuter = chaikin(polyPts([[-6, 5], [6, 5], [7.5, -2], [22, -22], [25.5, -31], [21, -29.5], [19, -25], [5, -8], [-5, -8], [-19, -25], [-21, -29.5], [-25.5, -31], [-22, -22], [-7.5, -2]]), 1);
  put(cut({ outer: anchorOuter, holes: [circlePts(2.4, 20)] }, 3, { kind: 'poplar' }), [A.x, A.y, L.L4 + 3.4], [0, 0, 0], root);
  // palettes à chevilles : elles plongent dans la denture de la roue d'échappement
  for (const sx of [-1, 1]) { const pp = rodZ(6, 1.1, MAT.steel); pp.position.set(A.x + sx * 23.4, A.y - 29.2, L.L4 + 1); root.add(pp); }
  // arbres
  for (const p of [G, C, Tw]) { const a = rodZ(ZF - ZB + T + 4, 2.4, MAT.brass); a.position.set(p.x, p.y, (ZB + ZF) / 2); root.add(a); }
  for (const p of [E, A]) { const top = p === A ? L.L4 + 5.2 : L.L4 + 2; const a = rodZ(top - (ZB - T / 2 - 2), 2.4, MAT.brass); a.position.set(p.x, p.y, (top + ZB - T / 2 - 2) / 2); root.add(a); const c = cap(3.4, 2); c.rotation.x = Math.PI / 2; c.position.set(p.x, p.y, top - 0.4); root.add(c); }
  // tambour et poids
  const drum = new THREE.Mesh(new THREE.CylinderGeometry(9, 9, 6, 40), dowelMaterial()); drum.rotation.x = Math.PI / 2; drum.position.set(G.x, G.y, 6); drum.castShadow = drum.receiveShadow = true; root.add(drum);
  for (let i = 0; i < 4; i++) { const r = torus(9.5, 0.55, MAT.string, 48); r.position.set(G.x, G.y, 3.8 + i * 1.3); root.add(r); }
  const wY = -235;
  root.add(wire([[G.x - 9.5, G.y, 6], [G.x - 9.5, wY + 46, 6]], 0.55));
  const weight = lathe([[0, 0], [11, 0], [11.5, 2], [11.5, 40], [11, 42], [3, 44], [3, 46], [0, 46]], MAT.brass, 48); weight.position.set(G.x - 9.5, wY, 6); root.add(weight);
  // --- Balancier (derrière la platine arrière) ---
  const pz = ZB - T / 2 - 6.5;
  const crutch = rodZ(10, 1.4, MAT.brass); crutch.position.set(A.x, A.y, pz + 3); root.add(crutch);
  const bobY = -330;
  put(cut({ outer: chaikin(polyPts([[-3, 0], [3, 0], [3, A.y - bobY - 10], [-3, A.y - bobY - 10]]), 0) }, 3, { kind: 'poplar' }), [A.x, bobY + 10, pz], [0, 0, 0], root);
  const bob = lathe([[0, -2.5], [24, -2.5], [27, 0], [24, 2.5], [0, 2.5]], MAT.brassPolished, 72); bob.rotation.x = Math.PI / 2; bob.position.set(A.x, bobY, pz); root.add(bob);
  put(cut({ outer: circlePts(20, 80), holes: [] }, 2), [A.x, bobY, pz + 3.6], [0, 0, 0], root);

  // --- Cadran et aiguilles ---
  const zD = ZF + T / 2 + 1.5;
  put(cut({ outer: circlePts(64, 160), holes: [circlePts(48, 140)] }, 3), [0, 0, zD], [0, 0, 0], root);
  const bez = torus(64, 1.1, MAT.brass, 160); bez.position.z = zD + 1.5; root.add(bez);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; const mk = i % 3 === 0 ? box(2.4, 9, 1, MAT.brassPolished) : sphere(1.9, MAT.brass, 16); mk.position.set(Math.sin(a) * 56, Math.cos(a) * 56, zD + 2); mk.rotation.z = -a; root.add(mk); }
  const hour = cutMetal({ outer: chaikin(polyPts([[-2.2, -8], [2.2, -8], [1.6, 30], [4, 34], [0, 40], [-4, 34], [-1.6, 30]]), 1), holes: [circlePts(1.6, 16, 0, 35)] }, 1, MAT.blackMetal);
  put(hour, [0, 0, zD + 5], [0, 0, -305], root);
  const minute = cutMetal({ outer: chaikin(polyPts([[-1.8, -12], [1.8, -12], [1.2, 50], [0, 56], [-1.2, 50]]), 1) }, 1, MAT.blackMetal);
  put(minute, [0, 0, zD + 6.5], [0, 0, -58], root);
  const hc = cap(3.6, 2, MAT.brassPolished); hc.rotation.x = Math.PI / 2; hc.position.z = zD + 7; root.add(hc);

  // décalage : le dos des entretoises touche le mur (z = -12)
  root.position.y = 340; root.position.z = 12 + 0;
  const wallZ = 0 - 0; // mur de présentation (repère monde)
  const world = (x, y, z) => [x, y + 340, z + 12];
  return {
    root,
    wall: { z: 0 },
    dessus: { az: 66, el: 6 },
    detail: { target: world(E.x - 2, E.y + 18, L.L4), az: 22, el: 24, dist: 200, aperture: 1.8 },
    situation: {
      mode: 'wall', wallZ: 0, az: 18, el: 6, deskY: 0, margin: 0.12,
      place: (r) => { r.position.y = 560; r.position.z = 12; },
      framePoints: [[0, 0, 140], [-160, 0, 60], [160, 0, 60]],
      window: true, windowX: 260,
    },
    kitExtras: () => {
      const g = new THREE.Group();
      for (let i = 0; i < 5; i++) { const r = rodZ(46, 2.4, MAT.brass); r.rotation.y = Math.PI / 2; r.position.set(0, 2.4, i * 7); g.add(r); }
      for (let i = 0; i < 4; i++) { const r = rodZ(30, 3.2, MAT.brass); r.rotation.y = Math.PI / 2; r.position.set(0, 3.2, 40 + i * 9); g.add(r); }
      const wt = lathe([[0, 0], [11, 0], [11.5, 2], [11.5, 40], [11, 42], [3, 44], [3, 46], [0, 46]], MAT.brass, 48); wt.rotation.z = Math.PI / 2; wt.position.set(80, 11.5, 20); g.add(wt);
      const bb = lathe([[0, -2.5], [24, -2.5], [27, 0], [24, 2.5], [0, 2.5]], MAT.brassPolished, 72); bb.position.set(140, 2.5, 20); g.add(bb);
      for (let i = 0; i < 5; i++) { const r = torus(12, 0.55, MAT.string, 48); r.rotation.x = Math.PI / 2; r.position.set(190, 0.6 + i * 1.1, 20); g.add(r); }
      return [g];
    },
  };
}
