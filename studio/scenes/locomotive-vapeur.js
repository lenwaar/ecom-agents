// Locomotive à vapeur (démonstration, dessin générique) : châssis à longerons, trois essieux moteurs couplés
// par bielles en laiton (manetons en phase), essieu porteur avant, cylindres et bielles motrices,
// chaudière cintrée cerclée de laiton, boîte à fumée, cheminée, dôme, cabine. Présentée sur un tronçon de voie.
import * as THREE from 'three';
import { MAT, dowelMaterial } from '../lib/materials.js';
import { cut, cutMetal, put, rectPts, circlePts, polyPts, chaikin, arcPts, wheelProfile, bentSheet, rod, rodX, rodZ, cap, lathe, torus, box, sphere, V2 } from '../lib/parts.js';

const D2R = THREE.MathUtils.degToRad;

function barBetween(a, b, w, h, mat) {
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b);
  const m = box(w, h, A.distanceTo(B), mat); m.position.copy(A).lerp(B, 0.5); m.lookAt(B); return m;
}

export function build() {
  const root = new THREE.Group();
  // --- Voie de présentation ---
  const RT = 10, RX = 22; // dessus de rail, écartement
  for (let z = -96; z <= 96; z += 24) put(cut({ outer: rectPts(74, 9, 1.5) }, 4, { kind: 'poplar', kit: z === -96 }), [0, 2, z], [-90, 0, 0], root);
  for (const s of [-1, 1]) put(cut({ outer: rectPts(214, 6, 0.5) }, 4), [s * RX, 4 + 3, 0], [0, 90, 0], root);
  // --- Roues ---
  const R = 21, AY = RT + R, PHI = D2R(-35), PIN = 9;
  const drivers = [-50, -6, 38];
  const wheelX = RX - 0.6; // plan de roulement
  const mkWheel = (r, spokes) => {
    const g = new THREE.Group();
    put(cut(wheelProfile({ r, spokes, rimW: 3.5, hubR: 6, bore: 2.5, spokeW: 2.4 }), 3), [0, 0, 0], [0, 0, 0], g);
    put(cut({ outer: circlePts(r + 2.4, 120), holes: [circlePts(r - 3.2, 100)] }, 1.5, { kind: 'poplar' }), [0, 0, -2.25], [0, 0, 0], g); // boudin
    return g;
  };
  for (const z of drivers) for (const s of [-1, 1]) {
    const w = mkWheel(R, 12); w.rotation.y = s * Math.PI / 2; w.position.set(s * wheelX, AY, z); root.add(w);
    // contrepoids et maneton
    const pin = rodX(5, 1.8, MAT.brass); pin.position.set(s * (wheelX + 3.5), AY + Math.sin(PHI) * PIN, z + Math.cos(PHI) * PIN); root.add(pin);
  }
  for (const z of drivers) { const ax = rodX(2 * wheelX + 4, 2.4, MAT.brass); ax.position.set(0, AY, z); root.add(ax); }
  const PR = 11, PAY = RT + PR, PZ = 80;
  for (const s of [-1, 1]) { const w = mkWheel(PR, 6); w.rotation.y = s * Math.PI / 2; w.position.set(s * wheelX, PAY, PZ); root.add(w); }
  const pax = rodX(2 * wheelX + 2, 2.2, MAT.brass); pax.position.set(0, PAY, PZ); root.add(pax);
  // bielles d'accouplement (laiton) et bielles motrices
  for (const s of [-1, 1]) {
    const y = AY + Math.sin(PHI) * PIN, dz = Math.cos(PHI) * PIN;
    root.add(barBetween([s * (wheelX + 4.5), y, drivers[0] + dz - 4], [s * (wheelX + 4.5), y, drivers[2] + dz + 4], 1.6, 4.5, MAT.brass));
    for (const z of drivers) { const boss = rodX(2, 3.2, MAT.brassPolished); boss.position.set(s * (wheelX + 4.5), y, z + dz); root.add(boss); }
    const cylY = 46, cz0 = 62;
    root.add(barBetween([s * (wheelX + 7), cylY - 4, cz0 - 4], [s * (wheelX + 7), y, drivers[1] + dz], 1.6, 4, MAT.brassDark));
    // glissière et tige de piston
    root.add(barBetween([s * (wheelX + 7), cylY - 4, cz0 - 6], [s * (wheelX + 7), cylY - 4, cz0 + 8], 1.2, 1.6, MAT.steel));
    // cylindre
    const cyl = lathe([[0, 0], [8.5, 0], [8.5, 2], [8, 3], [8, 19], [8.5, 20], [8.5, 22], [0, 22]], MAT.brass, 40);
    cyl.rotation.x = Math.PI / 2; cyl.position.set(s * (wheelX + 6), cylY, cz0 + 2); root.add(cyl);
  }
  // --- Châssis ---
  const FY = 24;
  for (const s of [-1, 1]) {
    const holes = [...drivers.map((z) => circlePts(2.6, 20, 4 - z, AY - FY)), circlePts(2.4, 20, 4 - PZ, PAY - FY)];
    put(cut({ outer: chaikin(polyPts([[-96, -8], [96, -8], [96, 29], [-96, 29]]), 0), holes }, 3), [s * 15, FY, 4], [0, 90, 0], root);
  }
  // traverses tampons
  for (const z of [98, -88]) {
    put(cut({ outer: rectPts(64, 16, 2) }, 4, { kind: 'poplar' }), [0, FY + 2, z], [0, 0, 0], root);
    for (const s of [-1, 1]) { const b = lathe([[0, 0], [3, 0], [3, 6], [5.5, 7], [6, 9], [0, 9]], MAT.brass, 32); b.rotation.x = Math.sign(z) * Math.PI / 2; b.position.set(s * 20, FY + 2, z + Math.sign(z) * 2); root.add(b); }
  }
  // tabliers
  for (const s of [-1, 1]) put(cut({ outer: rectPts(18, 186, 2) }, 3), [s * 27, 54.5, 6], [-90, 0, 0], root);
  put(cut({ outer: rectPts(36, 186, 2) }, 3), [0, 54.5, 6], [-90, 0, 0], root);

  // --- Chaudière cintrée et boîte à fumée ---
  const BR = 22, BY = 56 + BR, bz0 = -26, bz1 = 82;
  const circ = []; for (let i = 0; i <= 64; i++) { const a = -Math.PI / 2 + 0.06 + (i / 64) * (Math.PI * 2 - 0.12); circ.push(V2(Math.cos(a) * BR, Math.sin(a) * BR)); }
  const boiler = bentSheet(circ, bz1 - bz0, 1.6, { kind: 'birch' }); boiler.rotation.y = -Math.PI / 2; boiler.position.set(0, BY, (bz0 + bz1) / 2); root.add(boiler);
  for (const z of [bz0 + 22, bz0 + 52, bz1 - 26]) { const band = torus(BR + 1.7, 1.1, MAT.brass, 96); band.position.set(0, BY, z); root.add(band); }
  put(cut({ outer: circlePts(BR + 3, 96) }, 4, { kind: 'poplar' }), [0, BY, bz1 + 2], [0, 0, 0], root);
  put(cut({ outer: circlePts(BR - 5, 80) }, 3), [0, BY, bz1 + 5.5], [0, 0, 0], root);
  const ring = torus(BR - 5, 0.9, MAT.brass, 80); ring.position.set(0, BY, bz1 + 7); root.add(ring);
  const handle = sphere(2.2, MAT.brassPolished); handle.position.set(BR - 10, BY, bz1 + 8); root.add(handle);
  for (const y of [-8, 8]) { const hg = rod(5, 1.6, MAT.brass); hg.position.set(-BR + 6, BY + y, bz1 + 7.6); root.add(hg); }
  // cheminée, dôme, sablière, lanterne
  const top = BY + BR;
  const stack = lathe([[0, 0], [9, 0], [8, 2], [7, 3], [7, 22], [9, 26], [10.5, 30], [10.5, 32], [7, 32], [7, 20], [0, 20]], dowelMaterial(), 48);
  stack.position.set(0, top - 3, bz1 - 16); root.add(stack);
  const capS = torus(9.6, 1.2, MAT.brass, 48); capS.rotation.x = Math.PI / 2; capS.position.set(0, top - 3 + 31, bz1 - 16); root.add(capS);
  const dome = lathe([[0, 0], [11, 0], [10, 3], [9, 8], [8.5, 12], [6, 16], [0, 17]], MAT.brassPolished, 48); dome.position.set(0, top - 4, bz0 + 40); root.add(dome);
  const sand = lathe([[0, 0], [8, 0], [7.5, 4], [6, 9], [0, 10]], dowelMaterial(), 40); sand.position.set(0, top - 3, bz0 + 66); root.add(sand);
  const lamp = lathe([[0, 0], [4, 0], [4.5, 8], [3, 10], [0, 11]], MAT.brass, 24); lamp.position.set(0, top - 1, bz1 + 1); root.add(lamp);
  const lens = new THREE.Mesh(new THREE.CircleGeometry(2.6, 24), new THREE.MeshPhysicalMaterial({ color: '#F3EBD8', roughness: 0.1, clearcoat: 1 })); lens.position.set(0, top + 4, bz1 + 5.1); root.add(lens);

  // --- Cabine ---
  const cz = bz0 - 2, cd = 52, ch = 64, cw = 60; const cy0 = 56;
  const fw2 = cw / 2 - 3; const frontWall = { outer: chaikin(polyPts([[-fw2, 0], [fw2, 0], [fw2, ch - 8], [fw2 - 10, ch], [-fw2 + 10, ch], [-fw2, ch - 8]]), 1), holes: [circlePts(7, 40, -17, ch - 18), circlePts(7, 40, 17, ch - 18), circlePts(BR + 1.5, 80, 0, BY - cy0)] };
  put(cut(frontWall, 3), [0, cy0, cz], [0, 0, 0], root);
  for (const s of [-1, 1]) {
    const sw = { outer: polyPts([[0, 0], [cd, 0], [cd, ch - 8], [0, ch - 8]]), holes: [chaikin(polyPts([[8, 26], [cd - 14, 26], [cd - 14, ch - 16], [8, ch - 16]]), 2), chaikin(polyPts([[cd - 8, 0], [cd - 2, 0], [cd - 2, 30], [cd - 8, 30]]), 0)] };
    put(cut(sw, 3, { kind: 'poplar' }), [s * (cw / 2 - 1.5), cy0, cz], [0, 90, 0], root);
  }
  const roofC = []; for (let i = 0; i <= 20; i++) { const a = D2R(124 - i * 3.4); roofC.push(V2(Math.cos(a) * 59.5, Math.sin(a) * 59.5)); }
  const roof = bentSheet(roofC, cd + 10, 1.6); roof.rotation.y = -Math.PI / 2; roof.position.set(0, cy0 + ch - 8 - 59.5 * Math.sin(D2R(56)), cz - cd / 2 + 2); root.add(roof);
  put(cut({ outer: rectPts(cw - 6, cd - 4, 2) }, 3), [0, cy0 + 1.5, cz - cd / 2], [-90, 0, 0], root);

  return {
    root,
    dessus: 'profil',
    detail: { target: [wheelX + 3, AY + 2, -6], az: 64, el: 9, dist: 190, aperture: 2.2 },
    situation: { az: 32, el: 11 },
    kitExtras: () => {
      const g = new THREE.Group();
      for (let i = 0; i < 4; i++) { const r = rodX(52, 2.4, MAT.brass); r.position.set(26, 2.4, i * 7); g.add(r); }
      for (let i = 0; i < 2; i++) { const b = box(1.6, 4.5, 100, MAT.brass); b.rotation.y = Math.PI / 2; b.rotation.z = Math.PI / 2; b.position.set(110, 0.8, i * 8); g.add(b); }
      const d = lathe([[0, 0], [11, 0], [10, 3], [9, 8], [8.5, 12], [6, 16], [0, 17]], MAT.brassPolished, 48); d.position.set(180, 0, 8); g.add(d);
      for (let i = 0; i < 3; i++) { const t = torus(23.7, 1.1, MAT.brass, 64); t.rotation.x = Math.PI / 2; t.position.set(240, 1.1 + i * 2.2, 8); g.add(t); }
      return [g];
    },
  };
}
