// Boîte à musique à manivelle (démonstration) : coffret à entures, couvercle ouvert sur charnières,
// mécanisme à peigne posé sur une platine (cylindre à picots, peigne en acier), manivelle sur le flanc droit
// qui entraîne le cylindre par une paire d'engrenages en laiton.
import * as THREE from 'three';
import { MAT, dowelMaterial } from '../lib/materials.js';
import { gearProfile, meshPhase, cut, cutMetal, put, rectPts, circlePts, polyPts, chaikin, fingerPanel, rod, rodX, rodZ, cap, lathe, box, V2 } from '../lib/parts.js';
import { rng } from '../lib/engine.js';

const D2R = THREE.MathUtils.degToRad;

// Mécanisme à peigne (métal) : platine, ponts, cylindre à picots, peigne de 18 lames
export function combMovement({ withGears = true } = {}) {
  const g = new THREE.Group();
  const base = cut({ outer: rectPts(70, 46, 3) }, 2, { kit: false }); put(base, [0, 1, 0], [-90, 0, 0], g);
  const axY = 14, cylR = 7.5, cylL = 30;
  for (const x of [-18, 18]) {
    const br = cutMetal({ outer: chaikin(polyPts([[-8, 0], [8, 0], [6, 14], [2, 18], [-2, 18], [-6, 14]]), 1), holes: [circlePts(1.2, 16, 0, axY - 2)] }, 1.6, MAT.brass);
    put(br, [x, 2, 0], [0, 90, 0], g);
  }
  const cyl = new THREE.Mesh(new THREE.CylinderGeometry(cylR, cylR, cylL, 64), MAT.brassPolished); cyl.rotation.z = Math.PI / 2; cyl.position.y = axY; cyl.castShadow = cyl.receiveShadow = true; g.add(cyl);
  const ax = rodX(48, 1.2, MAT.steel); ax.position.set(4, axY, 0); g.add(ax);
  // picots sur 18 pistes, angles pseudo-aléatoires (partition imaginaire)
  const rnd = rng(77); const pinGeo = new THREE.CylinderGeometry(0.32, 0.32, 1.2, 8);
  const pins = new THREE.InstancedMesh(pinGeo, MAT.steel, 18 * 9); let k = 0; const mtx = new THREE.Matrix4(); const q = new THREE.Quaternion();
  for (let i = 0; i < 18; i++) for (let j = 0; j < 9; j++) {
    const a = rnd() * Math.PI * 2; const x = -cylL / 2 + 1.2 + i * ((cylL - 2.4) / 17);
    q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, Math.cos(a), Math.sin(a)));
    mtx.compose(new THREE.Vector3(x, axY + Math.cos(a) * (cylR + 0.5), Math.sin(a) * (cylR + 0.5)), q, new THREE.Vector3(1, 1, 1)); pins.setMatrixAt(k++, mtx);
  }
  pins.castShadow = true; g.add(pins);
  // peigne : lames de longueurs décroissantes, pointes au contact du cylindre
  const comb = new THREE.Group();
  const teeth = []; const n = 18, pitch = (cylL - 2.4) / 17, w = pitch * 0.62;
  const baseZ = cylR + 18;
  const outer = [V2(-cylL / 2, baseZ + 6), V2(cylL / 2, baseZ + 6)];
  for (let i = n - 1; i >= 0; i--) {
    const x = -cylL / 2 + 1.2 + i * pitch; const tipZ = cylR + 0.9;
    outer.push(V2(x + w / 2, baseZ), V2(x + w / 2, tipZ + 0.4), V2(x, tipZ), V2(x - w / 2, tipZ + 0.4), V2(x - w / 2, baseZ));
  }
  const combMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(new THREE.Shape(outer), { depth: 0.8, bevelEnabled: false }), MAT.steel);
  combMesh.rotation.x = Math.PI / 2; combMesh.position.y = axY + 0.4; combMesh.castShadow = combMesh.receiveShadow = true; comb.add(combMesh);
  const block = box(cylL + 4, axY - 2 + 0.2, 8, MAT.brass); block.position.set(0, 2 + (axY - 2) / 2 - 0.3, baseZ + 3); comb.add(block);
  for (const x of [-9, 0, 9]) { const sc = cap(1.6, 1.0, MAT.steel); sc.position.set(x, axY + 0.4, baseZ + 3); comb.add(sc); }
  g.add(comb);
  g.userData = { axY, cylR, cylL };
  return g;
}

export function build() {
  const root = new THREE.Group();
  const W = 124, H = 74, D = 88, t = 4, FW = 10, lift = 4;
  const body = new THREE.Group(); body.position.y = lift; root.add(body);
  const frontP = fingerPanel(W, H, t, { left: 'male', right: 'male', bottom: 'male', top: 'flat' }, FW);
  const sideP = fingerPanel(D, H, t, { left: 'female', right: 'female', bottom: 'male', top: 'flat' }, FW);
  const botP = fingerPanel(W, D, t, { left: 'female', right: 'female', top: 'female', bottom: 'female' }, FW);
  // façade ajourée : frise de petits cercles
  const frise = []; for (let i = 0; i < 9; i++) frise.push(circlePts(i % 2 ? 2.2 : 3.2, 28, -40 + i * 10, 14));
  put(cut({ outer: frontP, holes: frise }, t), [0, H / 2, D / 2 - t / 2], [0, 0, 0], body);
  put(cut({ outer: frontP }, t), [0, H / 2, -D / 2 + t / 2], [0, 0, 0], body);
  const crankY = 4 + 14 + (1.2 * 42) / 2 + 0.15;
  put(cut({ outer: sideP }, t), [-W / 2 + t / 2, H / 2, 0], [0, 90, 0], body);
  put(cut({ outer: sideP, holes: [circlePts(2.8, 24, 4, crankY - H / 2)] }, t), [W / 2 - t / 2, H / 2, 0], [0, 90, 0], body);
  put(cut({ outer: botP }, t), [0, t / 2, 0], [-90, 0, 0], body);
  // pieds
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) put(cut({ outer: rectPts(14, 14, 2) }, lift, { kind: 'poplar' }), [sx * (W / 2 - 12), -lift / 2, sz * (D / 2 - 12)], [-90, 0, 0], body);

  // couvercle ouvert (charnière arrière), rosace ajourée
  const lidW = W + 4, lidD = D + 4;
  const ros = [circlePts(6, 40, 0, 0)];
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; const p = chaikin(polyPts([[0, -3.6], [16, -2.2], [20, 0], [16, 2.2], [0, 3.6]]), 2).map((v) => V2(v.x + 9, v.y)).map((v) => V2(v.x * Math.cos(a) - v.y * Math.sin(a), v.x * Math.sin(a) + v.y * Math.cos(a))); ros.push(p); }
  for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2 + Math.PI / 16; ros.push(circlePts(1.6, 16, Math.cos(a) * 33, Math.sin(a) * 33)); }
  const lid = new THREE.Group(); lid.position.set(0, H + 0.4, -D / 2 - 2); lid.rotation.x = -D2R(102); body.add(lid);
  put(cut({ outer: rectPts(lidW, lidD, 3), holes: ros }, t, { kind: 'poplar' }), [0, t / 2, lidD / 2], [-90, 0, 0], lid);
  put(cut({ outer: rectPts(W - 2 * t - 1, D - 2 * t - 1, 2), holes: [circlePts(42, 120)] }, 2), [0, -1, lidD / 2], [-90, 0, 0], lid);
  for (const x of [-34, 34]) {
    const kn = rodX(16, 2.4, MAT.brass); put(kn, [x, H + 0.4, -D / 2 - 2], [0, 0, 0], body);
    const lf = box(16, 1, 8, MAT.brass); put(lf, [x, H + 0.4, -D / 2 + 3], [0, 0, 0], body);
  }

  // mécanisme
  const mv = combMovement(); mv.position.set(14, t, -4); body.add(mv);
  const { axY } = mv.userData;
  // engrenages (plan YZ) : pignon 12 dents sur le cylindre, roue 30 dents sur l'arbre de manivelle
  const m = 1.2; const g1 = { x: 0, y: axY, z: 12, phase: 0 };
  const yC = axY + (m * (12 + 30)) / 2 + 0.15; const ph2 = meshPhase(g1, 0, yC, 30);
  const gx = 14 + 22;
  put(cutMetal(gearProfile({ z: 12, m, bore: 1.2 }), 2, MAT.brass), [gx, t + axY, -4], [0, 90, 0], body);
  put(cutMetal(gearProfile({ z: 30, m, bore: 2.4, spokes: 5, windowRound: 1 }), 2, MAT.brassPolished), [gx, t + yC, -4], [0, 90, THREE.MathUtils.radToDeg(ph2)], body);
  // palier de l'arbre de manivelle
  put(cut({ outer: chaikin(polyPts([[-8, -yC + 2], [8, -yC + 2], [6, 4], [0, 8], [-6, 4]]), 1), holes: [circlePts(2.6, 20)] }, 3), [gx - 6, t + yC, -4], [0, 90, 0], body);
  const shL = W / 2 + 6 - (gx - 10);
  const sh = rodX(shL, 2.4, MAT.brass); put(sh, [gx - 10 + shL / 2, t + yC, -4], [0, 0, 0], body);
  // ... l'arbre traverse le flanc droit à la hauteur crankY (perçage aligné)
  // manivelle
  const cx = W / 2 + 4;
  const arm = cut({ outer: chaikin(polyPts([[-5, -6], [5, -6], [4, 26], [0, 31], [-4, 26]]), 1), holes: [circlePts(2.5, 20), circlePts(2.5, 20, 0, 24)] }, 3);
  put(arm, [cx, t + yC, -4], [0, 90, 200], body);
  const ang = D2R(200); const hy = t + yC + Math.cos(ang) * 24, hz = -4 - Math.sin(ang) * 24 * -1;
  const knob = lathe([[0, 0], [3.8, 0], [4.2, 3], [4.2, 15], [3.8, 17], [0, 17]], dowelMaterial(), 40); put(knob, [cx + 1.5, hy, -4 + Math.sin(ang) * 24], [0, 0, -90], body);
  put(cap(4, 2), [cx + 18.5, hy, -4 + Math.sin(ang) * 24], [0, 0, -90], body);
  put(cap(3.4, 2), [cx + 1.5, t + yC, -4], [0, 0, -90], body);

  return {
    root,
    meta: { crankY: t + yC },
    dessus: { az: 0, el: 86 },
    detail: { target: [14, lift + t + axY + 1, -4 + 10], az: 16, el: 66, dist: 135, aperture: 1.5 },
    situation: { az: 24, el: 16 },
    kitExtras: () => {
      const g = new THREE.Group();
      const mvt = combMovement(); mvt.position.set(0, 0, 0); g.add(mvt);
      for (let i = 0; i < 2; i++) { const r = rodZ(50, 2.4, MAT.brass); r.rotation.y = Math.PI / 2; r.position.set(70, 2.4, -10 + i * 8); g.add(r); }
      return [g];
    },
  };
}
