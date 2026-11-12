// Primitives réutilisables de l'atelier : profils 2D découpés au laser puis extrudés (épaisseur du contreplaqué).
// Unités : millimètres. Une pièce est créée dans le plan XY, épaisseur selon Z, centrée en Z.
import * as THREE from 'three';
import { woodFace, edgeMaterial, dowelMaterial, MAT } from './materials.js';
import { rng } from './engine.js';

const V2 = (x, y) => new THREE.Vector2(x, y);
export const TAU = Math.PI * 2;

// Registre des pièces découpées (sert à la vue « Dans la boîte »)
export const KIT = { pieces: [], extras: [], rand: rng(4242) };
export function resetKit(seed = 4242) { KIT.pieces.length = 0; KIT.extras.length = 0; KIT.rand = rng(seed); }

// ---------- Outils 2D ----------
export function circlePts(r, n = 96, cx = 0, cy = 0, a0 = 0) {
  const p = []; for (let i = 0; i < n; i++) { const a = a0 + (i / n) * TAU; p.push(V2(cx + Math.cos(a) * r, cy + Math.sin(a) * r)); } return p;
}
export function arcPts(r, a1, a2, n, cx = 0, cy = 0) {
  const p = []; for (let i = 0; i <= n; i++) { const a = a1 + (a2 - a1) * (i / n); p.push(V2(cx + Math.cos(a) * r, cy + Math.sin(a) * r)); } return p;
}
export function rectPts(w, h, r = 0, cx = 0, cy = 0) {
  if (r <= 0) return [V2(cx - w / 2, cy - h / 2), V2(cx + w / 2, cy - h / 2), V2(cx + w / 2, cy + h / 2), V2(cx - w / 2, cy + h / 2)];
  r = Math.min(r, w / 2, h / 2); const p = []; const n = 8;
  const cs = [[w / 2 - r, -h / 2 + r, -Math.PI / 2], [w / 2 - r, h / 2 - r, 0], [-w / 2 + r, h / 2 - r, Math.PI / 2], [-w / 2 + r, -h / 2 + r, Math.PI]];
  for (const [x, y, a0] of cs) for (let i = 0; i <= n; i++) { const a = a0 + (i / n) * (Math.PI / 2); p.push(V2(cx + x + Math.cos(a) * r, cy + y + Math.sin(a) * r)); }
  return p;
}
export function polyPts(arr) { return arr.map(([x, y]) => V2(x, y)); }
export function area(p) { let s = 0; for (let i = 0; i < p.length; i++) { const a = p[i], b = p[(i + 1) % p.length]; s += a.x * b.y - b.x * a.y; } return s / 2; }
export function ccw(p) { return area(p) < 0 ? p.slice().reverse() : p; }
export function chaikin(p, it = 2, closed = true) {
  let q = p;
  for (let k = 0; k < it; k++) {
    const r = []; const n = q.length;
    for (let i = 0; i < (closed ? n : n - 1); i++) { const a = q[i], b = q[(i + 1) % n]; r.push(a.clone().lerp(b, 0.25), a.clone().lerp(b, 0.75)); }
    if (!closed) { r.unshift(q[0].clone()); r.push(q[n - 1].clone()); }
    q = r;
  }
  return q;
}
// Décalage d'un polygone (d > 0 : vers l'extérieur d'un polygone anti-horaire)
export function offsetPoly(p, d) {
  p = ccw(p); const n = p.length; const out = [];
  for (let i = 0; i < n; i++) {
    const a = p[(i - 1 + n) % n], b = p[i], c = p[(i + 1) % n];
    const n1 = V2(b.y - a.y, -(b.x - a.x)).normalize(); const n2 = V2(c.y - b.y, -(c.x - b.x)).normalize();
    const m = n1.clone().add(n2); const len = m.length();
    if (len < 1e-6) { out.push(b.clone().addScaledVector(n1, d)); continue; }
    m.divideScalar(len); const cos = m.dot(n1); const k = d / Math.max(cos, 0.3);
    out.push(b.clone().addScaledVector(m, k));
  }
  return out;
}
export function transformPts(p, { x = 0, y = 0, rot = 0, sx = 1, sy = 1 } = {}) {
  const c = Math.cos(rot), s = Math.sin(rot);
  return p.map((q) => V2(x + (q.x * sx) * c - (q.y * sy) * s, y + (q.x * sx) * s + (q.y * sy) * c));
}
export function bounds(p) {
  let a = Infinity, b = Infinity, c = -Infinity, d = -Infinity;
  for (const q of p) { a = Math.min(a, q.x); b = Math.min(b, q.y); c = Math.max(c, q.x); d = Math.max(d, q.y); }
  return { minX: a, minY: b, maxX: c, maxY: d, w: c - a, h: d - b };
}
// Secteur annulaire (fenêtre d'allègement entre deux rayons), coins adoucis
export function sectorPts(r1, r2, a1, a2, round = 2) {
  const n = Math.max(6, Math.ceil(((a2 - a1) * r2) / 3));
  const p = [...arcPts(r2, a1, a2, n), ...arcPts(r1, a2, a1, Math.max(3, Math.ceil(n * r1 / r2)))];
  return round ? chaikin(p, round) : p;
}

// Profil = { outer: Vector2[], holes: Vector2[][] }
export function profile(outer, holes = []) { return { outer, holes }; }

// ---------- Engrenage à développante ----------
// z dents, module m (mm). Option : alésage, rayons d'allègement, trous de goupille.
export function gearProfile({ z, m = 2, bore = 2.6, spokes = 0, rim = null, hub = null, pa = 20, extraHoles = [], boreShape = 'round', windowRound = 2 }) {
  const rp = (m * z) / 2, rb = rp * Math.cos(THREE.MathUtils.degToRad(pa));
  const ra = rp + m, rf = Math.max(rp - 1.25 * m, bore + 1);
  const inv = (a) => Math.tan(a) - a;
  const paR = THREE.MathUtils.degToRad(pa);
  const half = (r) => { const rr = Math.max(r, rb); return Math.PI / (2 * z) + inv(paR) - inv(Math.acos(Math.min(1, rb / rr))); };
  const pts = []; const NF = 7;
  for (let k = 0; k < z; k++) {
    const c = (k / z) * TAU;
    const rStart = Math.max(rf, rb * 0.999);
    // fond de dent (arc sur le cercle de pied)
    const prevEnd = c - TAU / z + half(rStart), thisStart = c - half(rStart);
    const nr = 4;
    for (let i = 1; i < nr; i++) { const a = prevEnd + (thisStart - prevEnd) * (i / nr); pts.push(V2(Math.cos(a) * rf, Math.sin(a) * rf)); }
    // flanc montant
    for (let i = 0; i <= NF; i++) { const r = rf + (ra - rf) * (i / NF); const a = c - half(r); pts.push(V2(Math.cos(a) * r, Math.sin(a) * r)); }
    // sommet
    const ht = half(ra);
    for (let i = 1; i < 3; i++) { const a = c - ht + (2 * ht) * (i / 3); pts.push(V2(Math.cos(a) * ra, Math.sin(a) * ra)); }
    // flanc descendant
    for (let i = NF; i >= 0; i--) { const r = rf + (ra - rf) * (i / NF); const a = c + half(r); pts.push(V2(Math.cos(a) * r, Math.sin(a) * r)); }
  }
  const holes = [];
  if (bore > 0) holes.push(boreShape === 'square' ? rectPts(bore * 1.8, bore * 1.8) : circlePts(bore, 40));
  if (spokes > 0) {
    const rimIn = rim ?? Math.max(rf - Math.max(3, m * 1.6), bore + 4);
    const hubR = hub ?? Math.max(bore + 3.5, rimIn * 0.32);
    if (rimIn - hubR > 4) {
      const sw = Math.max(2.6, rimIn * 0.12); // largeur des bras
      for (let i = 0; i < spokes; i++) {
        const a0 = (i / spokes) * TAU, a1 = ((i + 1) / spokes) * TAU;
        const daOut = sw / 2 / rimIn, daIn = sw / 2 / hubR;
        const p = [...arcPts(rimIn, a0 + daOut, a1 - daOut, 16), ...arcPts(hubR, a1 - daIn, a0 + daIn, 6)];
        holes.push(windowRound ? chaikin(p, windowRound) : p);
      }
    }
  }
  for (const h of extraHoles) holes.push(h);
  return { outer: pts, holes, rp, ra, rf, m, z };
}

// Phase de la seconde roue pour un engrènement correct (dent dans le creux).
// g1 : { x, y, z, phase } ; position de g2 (x2, y2), z2 dents. Retourne la phase de g2 (radians).
export function meshPhase(g1, x2, y2, z2) {
  const al = Math.atan2(y2 - g1.y, x2 - g1.x);
  return al + Math.PI + Math.PI / z2 - (g1.z / z2) * (al - g1.phase);
}
// Position de la roue menée à l'angle `ang` autour de g1 (entraxe théorique + jeu de 0,15 mm)
export function meshPos(g1, z2, m, ang, play = 0.15) {
  const d = (m * (g1.z + z2)) / 2 + play; return [g1.x + Math.cos(ang) * d, g1.y + Math.sin(ang) * d];
}

// ---------- Roue à rayons ----------
export function wheelProfile({ r, spokes = 6, rimW = 4, hubR = 7, bore = 2.6, spokeW = 3, round = 2 }) {
  const outer = circlePts(r, 160);
  const holes = [circlePts(bore, 32)];
  const ri = r - rimW;
  for (let i = 0; i < spokes; i++) {
    const a0 = (i / spokes) * TAU, a1 = ((i + 1) / spokes) * TAU;
    const p = [...arcPts(ri, a0 + spokeW / 2 / ri, a1 - spokeW / 2 / ri, 20), ...arcPts(hubR, a1 - spokeW / 2 / hubR, a0 + spokeW / 2 / hubR, 6)];
    holes.push(chaikin(p, round));
  }
  return { outer, holes };
}

// ---------- Panneau à entures (assemblage à tenons des boîtes découpées au laser) ----------
// w, h : dimensions extérieures ; t : épaisseur ; edges : { bottom, right, top, left } parmi
// 'flat' (bord droit), 'inset' (bord retiré de t), 'male' (tenons aux segments pairs), 'female' (tenons aux segments impairs).
export function fingerPanel(w, h, t, edges = {}, fw = 10) {
  const E = { bottom: 'flat', right: 'flat', top: 'flat', left: 'flat', ...edges };
  const corners = [V2(-w / 2, -h / 2), V2(w / 2, -h / 2), V2(w / 2, h / 2), V2(-w / 2, h / 2)];
  const names = ['bottom', 'right', 'top', 'left'];
  const info = names.map((nm, e) => {
    const A = corners[e], B = corners[(e + 1) % 4];
    const dir = B.clone().sub(A); const L = dir.length(); dir.normalize();
    const inward = V2(-dir.y, dir.x);
    const mode = E[nm];
    let D;
    if (mode === 'flat') D = [0]; else if (mode === 'inset') D = [t];
    else { let n = Math.max(3, Math.round(L / fw)); if (n % 2 === 0) n += 1; D = []; for (let i = 0; i < n; i++) D.push((mode === 'male' ? i % 2 === 0 : i % 2 === 1) ? 0 : t); }
    return { A, dir, inward, L, D };
  });
  const pts = [];
  for (let e = 0; e < 4; e++) {
    const I = info[e], P = info[(e + 3) % 4];
    pts.push(I.A.clone().addScaledVector(P.inward, P.D[P.D.length - 1]).addScaledVector(I.inward, I.D[0]));
    const n = I.D.length, seg = I.L / n;
    for (let j = 1; j < n; j++) if (I.D[j] !== I.D[j - 1]) {
      pts.push(I.A.clone().addScaledVector(I.dir, j * seg).addScaledVector(I.inward, I.D[j - 1]));
      pts.push(I.A.clone().addScaledVector(I.dir, j * seg).addScaledVector(I.inward, I.D[j]));
    }
  }
  return pts;
}

// Panneau en treillis (Warren) : rectangle avec fenêtres triangulaires
export function trussPts(len, h, bar = 4, n = null) {
  n = n ?? Math.max(2, Math.round(len / h));
  const holes = []; const step = len / n; const x0 = -len / 2;
  for (let i = 0; i < n; i++) {
    const xa = x0 + i * step, xb = xa + step, xm = xa + step / 2;
    const y0 = -h / 2 + bar, y1 = h / 2 - bar;
    // triangle pointe en haut et triangle pointe en bas, réduits de la largeur de barre
    const up = [V2(xa + bar * 1.6, y0), V2(xb - bar * 1.6, y0), V2(xm, y1 - bar * 0.8)];
    holes.push(chaikin(up, 1));
    if (i < n - 1) { const dn = [V2(xm + bar * 1.6, y1), V2(xm + step - bar * 1.6, y1), V2(xb, y0 + bar * 0.8)].reverse(); holes.push(chaikin(dn, 1)); }
  }
  return { outer: rectPts(len, h), holes };
}

// ---------- Extrusion ----------
const geoCache = new WeakMap();
export function toShape(prof) {
  const s = new THREE.Shape(ccw(prof.outer));
  for (const h of prof.holes || []) s.holes.push(new THREE.Path(ccw(h).slice().reverse()));
  return s;
}
// Découpe une pièce de contreplaqué. opts : { kind:'birch'|'poplar', kit:true, rotate }
export function cut(prof, t = 3, opts = {}) {
  const { kind = 'birch', kit = true, rotate = null, count = 1 } = opts;
  const geo = new THREE.ExtrudeGeometry(toShape(prof), { depth: t, bevelEnabled: false, curveSegments: 12, steps: 1 });
  geo.translate(0, 0, -t / 2);
  const mesh = new THREE.Mesh(geo, [woodFace(kind, KIT.rand, { rotate }), edgeMaterial(t)]);
  mesh.castShadow = true; mesh.receiveShadow = true;
  mesh.userData.profile = prof; mesh.userData.t = t;
  if (kit) for (let i = 0; i < count; i++) KIT.pieces.push({ prof, t, kind });
  return mesh;
}
// Pièce en métal (laiton) extrudée depuis un profil
export function cutMetal(prof, t = 1, mat = MAT.brass) {
  const geo = new THREE.ExtrudeGeometry(toShape(prof), { depth: t, bevelEnabled: true, bevelThickness: Math.min(0.3, t * 0.2), bevelSize: Math.min(0.3, t * 0.2), bevelSegments: 2, curveSegments: 12 });
  geo.translate(0, 0, -t / 2);
  const mesh = new THREE.Mesh(geo, mat); mesh.castShadow = mesh.receiveShadow = true; return mesh;
}

// Nappe cintrée (contreplaqué souple / charnière vivante) : épaisseur t suivant une courbe 2D (plan YZ), largeur w selon X.
// curve : Vector2[] (y = hauteur, x = profondeur). La pièce est centrée en X.
export function bentSheet(curve, w, t = 1.5, opts = {}) {
  const inner = curve; const outer = [];
  const n = curve.length;
  for (let i = 0; i < n; i++) {
    const a = curve[Math.max(0, i - 1)], b = curve[Math.min(n - 1, i + 1)];
    const d = b.clone().sub(a).normalize(); outer.push(curve[i].clone().add(V2(-d.y, d.x).multiplyScalar(t)));
  }
  const prof = { outer: [...inner, ...outer.reverse()], holes: [] };
  const geo = new THREE.ExtrudeGeometry(toShape(prof), { depth: w, bevelEnabled: false, steps: 1 });
  geo.translate(0, 0, -w / 2);
  // matériaux : faces latérales (chants) = groupe 0 (caps) ; la surface cintrée = groupe 1 (sidewalls)
  const mesh = new THREE.Mesh(geo, [edgeMaterial(t), woodFace(opts.kind || 'birch', KIT.rand, { rotate: 0 })]);
  mesh.rotation.y = Math.PI / 2; // la profondeur x de la courbe devient z, la largeur devient x
  mesh.castShadow = mesh.receiveShadow = true;
  if (opts.kit !== false) {
    // à plat dans la boîte : rectangle de longueur développée
    let L = 0; for (let i = 1; i < n; i++) L += curve[i].distanceTo(curve[i - 1]);
    const slits = []; // charnière vivante : fentes alternées
    if (opts.hinge !== false) {
      const step = 2.4; const k = Math.floor(L / step);
      for (let i = 1; i < k; i++) {
        const x = -L / 2 + i * step; const off = i % 2 ? 0 : w / 4;
        for (let y = -w / 2 + 3 + off; y < w / 2 - 3 - w / 4; y += w / 2) slits.push(rectPts(0.5, w / 2 - 4, 0, x, y + w / 4 - 1));
      }
    }
    KIT.pieces.push({ prof: { outer: rectPts(L, w), holes: slits.slice(0, 400) }, t, kind: opts.kind || 'birch' });
  }
  const g = new THREE.Group(); g.add(mesh); return g;
}

// ---------- Volumes simples ----------
export function rod(len, r, mat = MAT.brass, seg = 32) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, seg), mat);
  m.castShadow = m.receiveShadow = true; return m; // axe selon Y
}
export function rodZ(len, r, mat = MAT.brass, seg = 32) { const m = rod(len, r, mat, seg); m.rotation.x = Math.PI / 2; const g = new THREE.Group(); g.add(m); return g; }
export function rodX(len, r, mat = MAT.brass, seg = 32) { const m = rod(len, r, mat, seg); m.rotation.z = Math.PI / 2; const g = new THREE.Group(); g.add(m); return g; }
export function dowel(len, r) { return rod(len, r, dowelMaterial(KIT.rand), 24); }
export function box(w, h, d, mat) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.castShadow = m.receiveShadow = true; return m; }
export function sphere(r, mat, seg = 48) { const m = new THREE.Mesh(new THREE.SphereGeometry(r, seg, seg / 2), mat); m.castShadow = m.receiveShadow = true; return m; }
export function lathe(pts, mat, seg = 64) { const m = new THREE.Mesh(new THREE.LatheGeometry(pts.map(([x, y]) => V2(x, y)), seg), mat); m.castShadow = m.receiveShadow = true; return m; }
export function torus(R, r, mat, seg = 96) { const m = new THREE.Mesh(new THREE.TorusGeometry(R, r, 16, seg), mat); m.castShadow = m.receiveShadow = true; return m; }
// Fil tendu entre des points (cylindres successifs)
export function wire(points, r = 0.5, mat = MAT.string) {
  const g = new THREE.Group();
  for (let i = 1; i < points.length; i++) {
    const a = new THREE.Vector3(...points[i - 1]), b = new THREE.Vector3(...points[i]);
    const L = a.distanceTo(b); const m = rod(L, r, mat, 12);
    m.position.copy(a).lerp(b, 0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    g.add(m);
  }
  return g;
}
// Écrou / capuchon d'axe en laiton
export function cap(r = 3.2, h = 2.4, mat = MAT.brass) { return lathe([[0, 0], [r, 0], [r, h * 0.7], [r * 0.8, h], [0, h]], mat, 32); }

// Placement : position [x,y,z], rotation [rx,ry,rz] en degrés
export function put(obj, pos = [0, 0, 0], rot = [0, 0, 0], parent = null) {
  obj.position.set(...pos); obj.rotation.set(...rot.map((d) => THREE.MathUtils.degToRad(d)));
  if (parent) parent.add(obj); return obj;
}
// Pièce posée à plat (plan XZ), face vers le haut, épaisseur vers Y
export function flat(mesh, y = 0) { const g = new THREE.Group(); mesh.rotation.x = -Math.PI / 2; mesh.position.y = y; g.add(mesh); return g; }
// Pièce dans le plan latéral YZ (épaisseur selon X)
export function side(mesh) { const g = new THREE.Group(); mesh.rotation.y = Math.PI / 2; g.add(mesh); return g; }

export { V2 };
