// Coffre-fort à combinaison (démonstration) : caisse à entures, porte en applique sur deux charnières,
// cadran de combinaison au centre de la porte, poignée à trois branches. Derrière la porte : trois disques
// à encoche sur l'axe du cadran, levier de barrière et pêne coulissant dans ses guides.
import * as THREE from 'three';
import { MAT, dowelMaterial } from '../lib/materials.js';
import { arcPts, V2, cut, put, rectPts, circlePts, fingerPanel, chaikin, polyPts, rod, rodZ, cap, lathe, sphere, torus, box, gearProfile, KIT } from '../lib/parts.js';

const D2R = THREE.MathUtils.degToRad;

export function build({ view } = {}) {
  const doorAngle = view === 'detail' ? 108 : view === 'dessus' ? 34 : 0;
  const root = new THREE.Group();
  const W = 150, H = 160, D = 140, t = 4, FW = 12;
  const lift = 8; // pieds
  const body = new THREE.Group(); body.position.y = lift; root.add(body);

  // --- Caisse à entures ---
  const sideP = fingerPanel(D, H, t, { top: 'male', bottom: 'male', left: 'female', right: 'female' }, FW);
  const topP = fingerPanel(W, D, t, { top: 'female', bottom: 'female', left: 'female', right: 'female' }, FW);
  const backP = fingerPanel(W, H, t, { top: 'male', bottom: 'male', left: 'male', right: 'male' }, FW);
  const openW = W - 34, openH = H - 34;
  put(cut({ outer: sideP }, t), [-W / 2 + t / 2, H / 2, 0], [0, 90, 0], body);
  put(cut({ outer: sideP }, t), [W / 2 - t / 2, H / 2, 0], [0, 90, 0], body);
  put(cut({ outer: topP }, t), [0, H - t / 2, 0], [-90, 0, 0], body);
  put(cut({ outer: topP }, t), [0, t / 2, 0], [-90, 0, 0], body);
  put(cut({ outer: backP }, t), [0, H / 2, -D / 2 + t / 2], [0, 0, 0], body);
  // façade avec ouverture et gâche du pêne
  put(cut({ outer: backP, holes: [rectPts(openW, openH, 3)] }, t), [0, H / 2, D / 2 - t / 2], [0, 0, 0], body);
  // tablette intérieure
  put(cut({ outer: rectPts(W - 2 * t - 0.4, D - 2 * t - 0.4, 0) }, 3), [0, H * 0.42, 0], [-90, 0, 0], body);

  // pieds tournés
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const f = lathe([[0, 0], [7.5, 0], [8, 2], [6.5, 6], [7, lift], [0, lift]], dowelMaterial(), 40);
    put(f, [sx * (W / 2 - 15), 0, sz * (D / 2 - 15)], [0, 0, 0], root);
  }

  // --- Porte (pivot sur l'axe des charnières, côté gauche) ---
  const Wd = W - 22, Hd = H - 22, td = 5;
  const hingeX = -Wd / 2 - 3.5, zDoor = D / 2 + 0.6 + td / 2;
  const door = new THREE.Group(); door.position.set(hingeX, H / 2, zDoor); body.add(door);
  door.rotation.y = -D2R(doorAngle);
  const dx = Wd / 2 + 3.5; // centre de la porte dans le repère du pivot
  // porte : deux couches (panneau + cadre décoratif en applique)
  put(cut({ outer: rectPts(Wd, Hd, 3) }, td, { kind: 'poplar' }), [dx, 0, 0], [0, 0, 0], door);
  put(cut({ outer: rectPts(Wd - 10, Hd - 10, 4), holes: [rectPts(Wd - 26, Hd - 26, 6)] }, 2), [dx, 0, td / 2 + 1], [0, 0, 0], door);
  // charnières : nœuds en laiton sur l'axe
  for (const y of [-Hd / 2 + 22, Hd / 2 - 22]) {
    for (const k of [-1, 0, 1]) { const kn = rod(7.6, 3, k === 0 ? MAT.brassDark : MAT.brass); put(kn, [0, y + k * 8, 0], [0, 0, 0], door); }
    const pin = rod(26, 1.2, MAT.brass); put(pin, [0, y, 0], [0, 0, 0], door);
    const leaf = box(10, 22, 1.2, MAT.brass); put(leaf, [6, y, td / 2 + 0.6], [0, 0, 0], door);
  }
  // pattes fixes des charnières sur la façade
  for (const y of [-Hd / 2 + 22, Hd / 2 - 22]) { const lf = box(9, 22, 1.2, MAT.brass); put(lf, [hingeX - 1, H / 2 + y, D / 2 + 0.6], [0, 0, 0], body); }

  // Cadran de combinaison
  const dialY = 6; const dz = td / 2;
  put(cut({ outer: circlePts(27, 120) }, 3), [dx, dialY, dz + 1.5], [0, 0, 0], door);
  const bezel = torus(27.2, 1.3, MAT.brass); put(bezel, [dx, dialY, dz + 2.2], [0, 0, 0], door);
  for (let i = 0; i < 40; i++) {
    const a = (i / 40) * Math.PI * 2; const long = i % 5 === 0;
    const L = long ? 6 : 3.4; const r = 25 - L / 2;
    const tick = box(long ? 1.1 : 0.7, L, 0.3, MAT.engrave);
    tick.castShadow = false;
    put(tick, [dx + Math.sin(a) * r, dialY + Math.cos(a) * r, dz + 3.06], [0, 0, -THREE.MathUtils.radToDeg(a)], door);
  }
  // bouton cranté
  const knobPts = [[0, 0], [13, 0], [13, 1.5]];
  for (let i = 0; i < 6; i++) knobPts.push([12.4, 2 + i * 1.6], [13, 2.8 + i * 1.6]);
  knobPts.push([12, 13], [9, 14.5], [0, 14.5]);
  const knob = lathe(knobPts, dowelMaterial(), 48); put(knob, [dx, dialY, dz + 3], [90, 0, 0], door);
  const kc = cap(4, 1.6, MAT.brassPolished); put(kc, [dx, dialY, dz + 3 + 14.4], [90, 0, 0], door);
  // repère
  const idx = new THREE.Mesh(new THREE.ExtrudeGeometry(new THREE.Shape(polyPts([[-3, 0], [3, 0], [0, -5]])), { depth: 1, bevelEnabled: false }), MAT.brassPolished);
  idx.castShadow = true; put(idx, [dx, dialY + 36, dz + 0.1], [0, 0, 0], door);
  // poignée à trois branches
  const hx = dx + 42, hy = dialY - 30;
  const hub = rodZ(9, 5.2, MAT.brass); put(hub, [hx, hy, dz + 4.5], [0, 0, 0], door);
  const rosette = cut({ outer: circlePts(9, 60) }, 2, { kit: true }); put(rosette, [hx, hy, dz + 1], [0, 0, 0], door);
  for (let i = 0; i < 3; i++) {
    const a = D2R(90 + i * 120 + 20);
    const sp = rod(18, 1.6, MAT.brass); sp.position.set(hx + Math.cos(a) * 9, hy + Math.sin(a) * 9, dz + 7); sp.rotation.z = a - Math.PI / 2; door.add(sp);
    const ball = sphere(3.4, MAT.brassPolished); ball.position.set(hx + Math.cos(a) * 18.5, hy + Math.sin(a) * 18.5, dz + 7); door.add(ball);
  }

  // --- Mécanisme derrière la porte ---
  const iz = -td / 2;
  // trois disques à encoche + came d'entraînement
  for (let k = 0; k < 3; k++) {
    const notchA = D2R(90 + [0, 40, -25][k]);
    const wheelOuter = [...arcPts(21, notchA + 0.13, notchA + Math.PI * 2 - 0.13, 120), V2(Math.cos(notchA - 0.13) * 15.5, Math.sin(notchA - 0.13) * 15.5), V2(Math.cos(notchA + 0.13) * 15.5, Math.sin(notchA + 0.13) * 15.5)];
    const wheel = cut({ outer: wheelOuter, holes: [circlePts(2.6, 24), circlePts(3, 20, 11 * Math.cos(notchA + 2), 11 * Math.sin(notchA + 2))] }, 3, { kind: k % 2 ? 'poplar' : 'birch' });
    put(wheel, [dx, dialY, iz - 2.5 - k * 4.4], [0, 0, 0], door);
    if (k < 2) { const sp = cut({ outer: circlePts(5, 30), holes: [circlePts(2.6, 20)] }, 1.4); put(sp, [dx, dialY, iz - 2.5 - k * 4.4 - 2.2], [0, 0, 0], door); }
  }
  const axle = rodZ(20, 2.5, MAT.brass); put(axle, [dx, dialY, iz - 8], [0, 0, 0], door);
  const ac = cap(3.6, 2.4); put(ac, [dx, dialY, iz - 15.5], [-90, 0, 0], door);
  // guides et pêne : le pêne coulisse derrière la façade (verrouillé) ou rentre dans la porte (ouvert)
  const locked = doorAngle === 0;
  for (const gx of [dx + 40, dx + 52]) {
    put(cut({ outer: rectPts(9, 22, 1) }, 4.5), [gx, dialY, iz - 2.25], [0, 0, 0], door);
    put(cut({ outer: rectPts(9, 22, 1.5), holes: [rectPts(9.4, 8.4, 0)] }, 4), [gx, dialY, iz - 6.5], [0, 0, 0], door);
  }
  const bolt = cut({ outer: rectPts(34, 8, 1) }, 3, { kind: 'poplar' });
  put(bolt, [dx + (locked ? 53 : 40), dialY, iz - 6.5], [0, 0, 0], door);
  // levier de barrière : plaque derrière les disques, tige en laiton posée sur leur tranche
  put(cut({ outer: chaikin(polyPts([[-24, -4], [8, -4], [30, -1], [30, 3], [8, 4], [-24, 4], [-27, 0]]), 1), holes: [circlePts(1.6, 16, -20, 0)] }, 3), [dx, dialY + 26, iz - 17], [0, 0, -4], door);
  const fpin = rodZ(17.5, 1.6, MAT.brass); put(fpin, [dx - 20, dialY + 26, iz - 8.6], [0, 0, 0], door);
  const fence = rodZ(15, 1.6, MAT.brassDark); put(fence, [dx + 2, dialY + 21 + 1.6, iz - 9.5], [0, 0, 0], door);
  // gâche (renfort côté façade)
  put(cut({ outer: rectPts(8, 26, 1), holes: [rectPts(5, 9, 0)] }, 3), [W / 2 - 12, H / 2 + dialY, D / 2 - t - 1.5], [0, 0, 0], body);

  const dTarget = new THREE.Vector3(dx + 14, dialY + 4, iz - 6).applyMatrix4(new THREE.Matrix4().makeRotationY(-D2R(doorAngle))).add(new THREE.Vector3(hingeX, lift + H / 2, zDoor));
  return {
    root,
    dessus: { az: -78, el: 8 },
    detail: { target: dTarget.clone().lerp(new THREE.Vector3(0, lift + H / 2, D / 2), 0.3).toArray(), az: 36, el: 18, dist: 430, aperture: 2.4 },
    situation: { az: 26, el: 12 },
    kitExtras: () => {
      const g = new THREE.Group();
      for (let i = 0; i < 3; i++) { const r = rodZ(26, i ? 1.2 : 2.5, MAT.brass); r.rotation.y = Math.PI / 2; r.position.set(0, 2.5, i * 7); g.add(r); }
      for (let i = 0; i < 6; i++) { const k = rod(7.6, 3, MAT.brass); k.rotation.z = Math.PI / 2; k.position.set(36 + (i % 3) * 10, 3, Math.floor(i / 3) * 8); g.add(k); }
      for (let i = 0; i < 3; i++) { const b = sphere(3.4, MAT.brassPolished); b.position.set(70 + i * 9, 3.4, 4); g.add(b); }
      return [g];
    },
  };
}
