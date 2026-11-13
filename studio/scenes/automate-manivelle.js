// Automate à manivelle (démonstration, synchro n°11) : caisson à entures ouvert en façade pour montrer
// l'arbre à cames, manivelle sur le flanc droit. Trois cames en bois (une came en poire au centre, deux
// excentriques en opposition) soulèvent trois poussoirs à plateau qui traversent une réglette de guidage
// et le plateau supérieur. Sujet de la scène (choix neutre, la fiche dit « À VÉRIFIER ») : un petit voilier
// qui monte et descend entre deux vagues mobiles, devant une vague fixe et un soleil découpé.
// Cohérence mécanique : la hauteur de chaque poussoir est calculée à partir du profil réel de sa came
// (point le plus haut de la came sous le plateau du poussoir, à l'angle de la manivelle) ; les poussoirs
// touchent donc leurs cames dans toutes les vues.
import * as THREE from 'three';
import { MAT, dowelMaterial } from '../lib/materials.js';
import { cut, put, rectPts, circlePts, polyPts, chaikin, fingerPanel, transformPts, rodX, dowel, cap, lathe, V2, TAU } from '../lib/parts.js';

const D2R = THREE.MathUtils.degToRad;

// Profils de came (repère de l'arbre, origine sur l'axe)
function eccentricCam(r = 15, e = 6) {
  return { outer: circlePts(r, 120, 0, e), holes: [circlePts(2.5, 24), circlePts(3.2, 24, 0, e + 7)] };
}
function pearCam(r0 = 12, lift = 11) {
  const pts = [];
  for (let i = 0; i < 160; i++) {
    const a = (i / 160) * TAU; const c = Math.max(0, Math.cos(a - Math.PI / 2));
    const r = r0 + lift * Math.pow(c, 2.2);
    pts.push(V2(Math.cos(a) * r, Math.sin(a) * r));
  }
  return { outer: pts, holes: [circlePts(2.5, 24), circlePts(2.4, 20, 0, r0 + lift * 0.45)] };
}
// Hauteur de contact d'un poussoir à plateau (rayon rf) posé sur une came tournée de l'angle a :
// point le plus haut du profil dont l'abscisse tombe sous le plateau.
function contact(prof, a, rf) {
  let m = -Infinity;
  for (const p of transformPts(prof.outer, { rot: a })) if (Math.abs(p.x) <= rf && p.y > m) m = p.y;
  return m;
}
function contactRange(prof, rf) {
  let lo = Infinity, hi = -Infinity;
  for (let i = 0; i < 360; i++) { const c = contact(prof, (i / 360) * TAU, rf); lo = Math.min(lo, c); hi = Math.max(hi, c); }
  return { lo, hi };
}
// Vague découpée : bord inférieur droit, crête ondulée (x0 → x1)
function wavePts(x0, x1, h, amp, n, ph = 0) {
  const top = [];
  const N = Math.max(24, n * 14);
  for (let i = 0; i <= N; i++) {
    const u = i / N; const x = x0 + (x1 - x0) * u;
    const s = Math.sin(u * n * TAU + ph);
    // crêtes un peu pointues, creux arrondis
    top.push([x, h + amp * Math.sign(s) * Math.pow(Math.abs(s), 0.7)]);
  }
  return chaikin(polyPts([[x1, 0], [x0, 0], ...top]), 1);
}

export function build() {
  const root = new THREE.Group();
  const W = 150, D = 90, H = 100, t = 4, FW = 10;
  const yS = 36;            // hauteur de l'arbre à cames
  const crank = -28;        // angle de la manivelle (degrés) : l'arbre et les cames tournent du même angle
  const phi = D2R(crank);

  // --- Caisson ouvert en façade (entures sur les arêtes) ---
  const backP = fingerPanel(W, H, t, { left: 'male', right: 'male', bottom: 'male', top: 'male' }, FW);
  const sideP = fingerPanel(D, H, t, { left: 'flat', right: 'female', bottom: 'male', top: 'male' }, FW);
  const plateP = fingerPanel(W, D, t, { left: 'female', right: 'female', top: 'female', bottom: 'flat' }, FW);
  // dos : deux hublots qui laissent passer la lumière derrière les cames
  put(cut({ outer: backP, holes: [circlePts(13, 64, -40, yS - H / 2 + 4), circlePts(13, 64, 40, yS - H / 2 + 4)] }, t, { kind: 'poplar' }), [0, H / 2, -D / 2 + t / 2], [0, 0, 0], root);
  // flancs : fenêtre cintrée au-dessus de l'arbre, perçage de l'arbre (repère local : x → -z monde)
  const sideWin = chaikin(polyPts([[-26, 46 - H / 2], [26, 46 - H / 2], [26, 62 - H / 2], [0, 72 - H / 2], [-26, 62 - H / 2]]), 2);
  put(cut({ outer: sideP, holes: [sideWin, circlePts(2.8, 24, 0, yS - H / 2)] }, t), [-W / 2 + t / 2, H / 2, 0], [0, 90, 0], root);
  put(cut({ outer: sideP, holes: [sideWin, circlePts(2.8, 24, 0, yS - H / 2)] }, t), [W / 2 - t / 2, H / 2, 0], [0, 90, 0], root);
  put(cut({ outer: plateP }, t, { kind: 'poplar' }), [0, t / 2, 0], [-90, 0, 0], root);

  // --- Arbre à cames ---
  const camX = [-45, 0, 45];
  const rf = 8; // rayon du plateau des poussoirs
  const cams = [
    { prof: eccentricCam(15, 6), ph: 0, kind: 'birch' },
    { prof: pearCam(12, 11), ph: D2R(70), kind: 'poplar' },
    { prof: eccentricCam(15, 6), ph: Math.PI, kind: 'birch' },
  ];
  const cx = W / 2 + 7; // plan de la manivelle
  const shaftL = (cx + 2) - (-W / 2 - 1);
  put(rodX(shaftL, 2.5, MAT.brass), [(-W / 2 - 1 + cx + 2) / 2, yS, 0], [0, 0, 0], root);
  put(cap(3.6, 2.2), [-W / 2 - 1, yS, 0], [0, 0, 90], root);
  const lifts = cams.map((c, i) => {
    const a = phi + c.ph;
    const prof = { outer: transformPts(c.prof.outer, { rot: a }), holes: c.prof.holes.map((h) => transformPts(h, { rot: a })) };
    put(cut(prof, 6, { kind: c.kind }), [camX[i], yS, 0], [0, 90, 0], root);
    // bagues d'arrêt en laiton de part et d'autre de la came
    for (const s of [-1, 1]) put(rodX(2.5, 4.4, MAT.brassDark), [camX[i] + s * (3 + 1.25), yS, 0], [0, 0, 0], root);
    // repère de calage : position du profil dans le plan YZ (x local → -z monde)
    return { c: contact(c.prof, a, rf), range: contactRange(c.prof, rf) };
  });

  // --- Réglette de guidage et plateau supérieur ---
  const gY = 80;
  put(cut({ outer: rectPts(W - 2 * t, 16, 1.5), holes: camX.map((x) => circlePts(2.6, 20, x, 0)) }, t), [0, gY, 0], [-90, 0, 0], root);
  const topHoles = [...camX.map((x) => circlePts(2.6, 20, x, 0)), circlePts(2.2, 20, 50, 36.5)];
  // plateau : y local → -z monde ; trou du mât du soleil à z = -36,5
  put(cut({ outer: plateP, holes: topHoles }, t, { kind: 'birch' }), [0, H - t / 2, 0], [-90, 0, 0], root);

  // --- Poussoirs ---
  const gap = 3; const insert = 4;
  // bas de la pièce portée ; le voilier (poussoir central) monte plus haut pour dépasser des vagues
const bottoms = lifts.map((l, i) => H + (i === 1 ? 13 : gap) + (l.c - l.range.lo));
  lifts.forEach((l, i) => {
    const yc = yS + l.c; // contact came / plateau
    put(cut({ outer: circlePts(rf, 64), holes: [] }, 4, { kind: 'poplar' }), [camX[i], yc + 2, 0], [-90, 0, 0], root);
    const yTopRod = bottoms[i] + insert; // le poussoir entre de 4 mm dans la coque ou dans le taquet
    const y0 = yc + 4; const L = yTopRod - y0;
    put(dowel(L, 2), [camX[i], y0 + L / 2, 0], [0, 0, 0], root);
  });

  // --- Scène : vagues mobiles en façade (portées par les poussoirs latéraux) ---
  const zW = 16;
  [[-72, -2, 0.4], [2, 72, 2.1]].forEach(([x0, x1, ph], k) => {
    const i = k === 0 ? 0 : 2; const yb = bottoms[i];
    // taquet : reçoit le poussoir (z = 0) et porte la vague (z = 14)
    put(cut({ outer: rectPts(10, 16, 1.5) }, 8, { kind: 'poplar' }), [camX[i], yb + 4, 6], [-90, 0, 0], root);
    put(cut({ outer: wavePts(x0, x1, 12, 4, 2.5, ph) }, t, { kind: 'birch' }), [0, yb, zW], [0, 0, 0], root);
  });

  // --- Voilier (poussoir central) : coque en trois épaisseurs collées, mât, deux voiles ---
  const yb = bottoms[1];
  const boat = new THREE.Group(); boat.position.set(0, yb, 0); root.add(boat);
  const hull = chaikin(polyPts([[-24, 0], [20, 0], [34, 15], [12, 13], [-30, 13], [-31, 8]]), 1);
  put(cut({ outer: hull }, 3, { kind: 'poplar' }), [0, 0, 0], [0, 0, 0], boat);
  for (const s of [-1, 1]) put(cut({ outer: hull, holes: [-16, -6, 4, 14].map((x) => circlePts(1.5, 16, x, 8.5)) }, 3, { kind: 'birch' }), [0, 0, s * 3], [0, 0, 0], boat);
  const mastX = -2, mastH = 50;
  put(dowel(mastH, 1.4), [mastX, 13 + mastH / 2 - 2, 0], [0, 0, 0], boat);
  put(cut({ outer: chaikin(polyPts([[0, 0], [24, 0], [0.5, 40]]), 1) }, 2, { kind: 'birch' }), [mastX + 1.6, 14, 0], [0, 0, 0], boat);
  put(cut({ outer: chaikin(polyPts([[0, 0], [-20, 0], [-0.5, 32]]), 1) }, 2, { kind: 'birch' }), [mastX - 1.6, 16, 0], [0, 0, 0], boat);
  put(cut({ outer: polyPts([[0, 0], [9, -2.5], [0, -5]]) }, 1.5, { kind: 'poplar' }), [mastX + 1.2, 13 + mastH - 2, 0], [0, 0, 0], boat);

  // --- Décor fixe : vague de fond et soleil découpé sur un mât ---
  put(cut({ outer: wavePts(-72, 72, 26, 5, 3.5, 1.2) }, t, { kind: 'poplar' }), [0, H, -22], [0, 0, 0], root);
  const sunY = H + 66, sunX = 50, sunZ = -30, poleZ = sunZ - 6.5; // mât collé au dos des rayons
  put(dowel(sunY - H + 2, 2), [sunX, H + (sunY - H + 2) / 2 - 2, poleZ], [0, 0, 0], root);
  const rays = [];
  for (let i = 0; i < 12; i++) { const a = (i / 12) * TAU; const r1 = 15, r2 = i % 2 ? 21 : 24; rays.push([Math.cos(a - 0.12) * r1, Math.sin(a - 0.12) * r1], [Math.cos(a) * r2, Math.sin(a) * r2], [Math.cos(a + 0.12) * r1, Math.sin(a + 0.12) * r1]); }
  put(cut({ outer: chaikin(polyPts(rays), 1), holes: [circlePts(8, 48)] }, 3, { kind: 'birch' }), [sunX, sunY, sunZ - 3], [0, 0, 0], root);
  put(cut({ outer: circlePts(10, 64) }, 3, { kind: 'poplar' }), [sunX, sunY, sunZ], [0, 0, 0], root);

  // --- Manivelle extérieure (même dessin que le moulin) ---
  const arm = cut({ outer: chaikin(polyPts([[-6, -7], [6, -7], [5, 30], [0, 36], [-5, 30]]), 1), holes: [circlePts(2.6, 20), circlePts(2.6, 20, 0, 28)] }, 4);
  put(arm, [cx, yS, 0], [0, 90, crank], root);
  const hx = cx + 2, hz = -Math.sin(phi) * 28, hy = yS + Math.cos(phi) * 28;
  put(lathe([[0, 0], [4.2, 0], [4.6, 3], [4.6, 17], [4.2, 19], [0, 19]], dowelMaterial(), 40), [hx, hy, hz], [0, 0, -90], root);
  put(cap(4.4, 2.2), [hx + 19, hy, hz], [0, 0, -90], root);
  put(cap(3.6, 2.2), [cx + 2, yS, 0], [0, 0, -90], root);

  return {
    root,
    meta: { yS, lifts: lifts.map((l) => +l.c.toFixed(2)) },
    dessus: 'profil',
    // gros plan : arbre à cames et poussoirs, par la façade ouverte, légèrement plongeant
    detail: { target: [-8, yS + 16, 0], az: 46, el: 14, dist: 330, aperture: 1.4 },
    situation: { az: 26, el: 12 },
    kitExtras: () => {
      const g = new THREE.Group();
      const r = rodX(170, 2.5, MAT.brass); r.position.set(85, 2.5, 0); g.add(r);
      for (let i = 0; i < 4; i++) { const d = dowel([120, 120, 120, 60][i], 2); d.rotation.z = Math.PI / 2; d.position.set(60, 2, 10 + i * 7); g.add(d); }
      for (let i = 0; i < 6; i++) { const b = rodX(2.5, 4.4, MAT.brassDark); b.position.set(10 + i * 12, 4.4, 44); g.add(b); }
      for (let i = 0; i < 3; i++) { const c = cap(3.6, 2.2); c.position.set(90 + i * 10, 0, 44); g.add(c); }
      return [g];
    },
  };
}
