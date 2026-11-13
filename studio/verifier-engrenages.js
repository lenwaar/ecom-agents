// Vérifie l'engrènement de paires de roues (profils 2D réels) : entraxe, interférence, jeu minimal.
//   node verifier-engrenages.js
import { gearProfile, meshPhase } from './lib/parts.js';
import { gears } from './scenes/boite-engrenages-initiation.js';

function place(g, m) {
  const p = gearProfile({ z: g.z, m, bore: 0 });
  const c = Math.cos(g.phase), s = Math.sin(g.phase);
  return { ...p, pts: p.outer.map((v) => [g.x + c * v.x - s * v.y, g.y + s * v.x + c * v.y]) };
}
function inside(pt, poly) {
  let ins = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) ins = !ins;
  }
  return ins;
}
function segDist(p, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1]; const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
}
export function checkPair(A, B, m) {
  const pa = place(A, m), pb = place(B, m);
  const d = Math.hypot(B.x - A.x, B.y - A.y), th = (m * (A.z + B.z)) / 2;
  let pen = 0, minGap = Infinity;
  const near = (pts, o) => pts.filter((p) => Math.hypot(p[0] - o.x, p[1] - o.y) < o.ra + 0.01);
  const pbN = near(pb.pts, { ...A, ra: pa.ra }), paN = near(pa.pts, { ...B, ra: pb.ra });
  for (const p of pbN) { if (inside(p, pa.pts)) pen++; }
  for (const p of paN) { if (inside(p, pb.pts)) pen++; }
  for (const p of pbN) for (let i = 0; i < pa.pts.length; i++) minGap = Math.min(minGap, segDist(p, pa.pts[i], pa.pts[(i + 1) % pa.pts.length]));
  for (const p of paN) for (let i = 0; i < pb.pts.length; i++) minGap = Math.min(minGap, segDist(p, pb.pts[i], pb.pts[(i + 1) % pb.pts.length]));
  return { entraxe: +d.toFixed(3), theorique: th, interference: pen, jeuMin: +minGap.toFixed(3) };
}

const G = gears();
for (let i = 0; i < G.length - 1; i++) console.log(`initiation roue ${i + 1} / roue ${i + 2}`, checkPair(G[i], G[i + 1], 2));

// Autres scènes qui utilisent meshPhase (mêmes calculs que dans les fichiers de scène)
import { meshPos } from './lib/parts.js';
const D2R = (d) => (d * Math.PI) / 180;
{
  const M = 1.5;
  const C = { x: 0, y: 0, z: 48, phase: 0.1 };
  const G = { z: 60, x: 0, y: -(M * 70) / 2 - 0.15 };
  const [tx, ty] = meshPos({ x: 0, y: 0, z: 48 }, 8, M, D2R(58));
  const [ex, ey] = meshPos({ x: tx, y: ty, z: 40 }, 8, M, D2R(128));
  const pinC = { x: 0, y: 0, z: 10, phase: 0.2 };
  G.phase = meshPhase(pinC, G.x, G.y, 60);
  const pinT = { x: tx, y: ty, z: 8, phase: meshPhase(C, tx, ty, 8) };
  const wheelT = { x: tx, y: ty, z: 40, phase: 0.3 };
  const E = { x: ex, y: ey, z: 8, phase: meshPhase(wheelT, ex, ey, 8) };
  console.log('horloge pignon 10 / roue 60', checkPair(pinC, G, M));
  console.log('horloge roue 48 / pignon 8', checkPair(C, pinT, M));
  console.log('horloge roue 40 / pignon 8', checkPair(wheelT, E, M));
}
{
  const m = 1.5, d = 36;
  [[30, 18], [24, 24], [18, 30], [12, 36]].forEach(([za, zb], k) => {
    const t = { x: 0, y: 0, z: zb, phase: D2R(k * 17) };
    console.log(`planetaire ${zb}/${za}`, checkPair(t, { x: d, y: 0, z: za, phase: meshPhase(t, d, 0, za) }, m));
  });
}
{
  const m = 1.2, g1 = { x: 0, y: 0, z: 12, phase: 0 }; const yC = (m * 42) / 2 + 0.15;
  console.log('boite a musique 12/30', checkPair(g1, { x: 0, y: yC, z: 30, phase: meshPhase(g1, 0, yC, 30) }, m));
}
