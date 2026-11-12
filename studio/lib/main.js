// Point d'entrée du navigateur : construit une scène produit (ou d'ambiance) et produit une vue.
// URL : viewer.html?scene=<slug>&view=<vue>&w=1600&h=2000&samples=96
import * as THREE from 'three';
import { Studio, frameBox, dirFromAngles } from './engine.js';
import { initMaterials } from './materials.js';
import { resetKit, KIT } from './parts.js';
import { studioRig, nightSet, kitScene } from './rigs.js';

// Réglages communs à toutes les vues catalogue : même focale, même marge, même lumière, même fond.
export const CATALOGUE = { fov: 24, margin: 0.16 };
export const VIEWS = {
  face: { az: 0, el: 7 },
  'trois-quarts': { az: 35, el: 22 },
  dessus: { az: 0, el: 88 },
  profil: { az: 90, el: 7 },
  boite: { az: 0, el: 58 },
};

const q = new URLSearchParams(location.search);
const slug = q.get('scene'), view = q.get('view') || 'trois-quarts';
const W = +(q.get('w') || 1600), H = +(q.get('h') || 2000);
const samplesQ = q.get('samples');
const canvas = document.getElementById('c');
canvas.width = W; canvas.height = H;
canvas.addEventListener('webglcontextlost', () => { window.__error = 'Contexte WebGL perdu'; window.__done = true; });

async function run() {
  const studio = new Studio(canvas, W, H);
  initMaterials();
  resetKit();
  const mod = await import(`../scenes/${slug}.js`);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(CATALOGUE.fov, W / H, 1, 10000);
  let rig, cam = {}, samples = 96;

  if (mod.ambiance) {
    // Scène d'ambiance : la scène fournit tout (objets, caméra, réglages)
    const res = await mod.build({ view, scene, renderer: studio.renderer, camera, W, H });
    rig = res.rig; cam = res.cam || {}; samples = res.samples || 192;
  } else {
    const P = await mod.build({ view });
    const V = { ...VIEWS, ...(P.views || {}) };
    if (view === 'boite') {
      const extra = P.kitExtras ? P.kitExtras() : [];
      for (const e of extra) KIT.extras.push(e);
      const { root } = kitScene(P.kitOptions || {});
      scene.add(root);
      const bb = new THREE.Box3().setFromObject(root);
      rig = studioRig(studio.renderer, scene, bb, { az: 0 });
      frameBox(camera, bb, { ...V.boite, margin: 0.1 });
    } else if (view === 'situation') {
      const S = P.situation || {};
      const root = P.root;
      if (S.place) S.place(root);
      scene.add(root);
      if (S.extra) for (const e of S.extra()) scene.add(e);
      const bb = new THREE.Box3().setFromObject(root);
      rig = nightSet(studio.renderer, scene, bb, S);
      camera.fov = S.fov ?? 30; camera.updateProjectionMatrix();
      const fb = bb.clone(); if (S.frameExpand) fb.expandByVector(new THREE.Vector3(...S.frameExpand));
      // l'abat-jour de la lampe entre dans le cadre (en partie), sauf si la scène le refuse
      if (S.framePoints) for (const p of S.framePoints) fb.expandByPoint(new THREE.Vector3(...p));
      if (S.showLamp === true && rig.head) fb.expandByPoint(rig.head.clone().add(new THREE.Vector3(30, 10, 0)));
      const f = frameBox(camera, fb, { az: S.az ?? 24, el: S.el ?? 12, margin: S.margin ?? 0.3, offsetY: S.offsetY ?? 0 });
      const c = bb.getCenter(new THREE.Vector3());
      cam = { aperture: S.aperture ?? f.distance * 0.012, focus: camera.position.distanceTo(c) };
      samples = 200;
    } else {
      const root = P.root; scene.add(root);
      const bb = new THREE.Box3().setFromObject(root);
      let vv = V[view];
      if (view === 'dessus' && typeof P.dessus === 'string') vv = V[P.dessus];
      else if (view === 'dessus' && P.dessus) vv = P.dessus;
      if (view === 'detail') {
        const d = P.detail;
        rig = studioRig(studio.renderer, scene, bb, { az: d.az, wall: P.wall });
        const dir = dirFromAngles(d.az, d.el); const target = new THREE.Vector3(...d.target);
        camera.position.copy(target).addScaledVector(dir, d.dist); camera.lookAt(target);
        camera.near = d.dist / 20; camera.far = d.dist * 40; camera.updateProjectionMatrix();
        cam = { aperture: d.aperture ?? d.dist * 0.018, focus: d.dist };
        samples = 160;
      } else {
        rig = studioRig(studio.renderer, scene, bb, { az: vv.az, wall: P.wall, shadowOpacity: vv.el > 60 ? 0.22 : undefined });
        frameBox(camera, bb, { ...vv, margin: CATALOGUE.margin });
      }
    }
  }
  if (samplesQ) samples = +samplesQ;
  const t0 = performance.now();
  studio.render({ scene, camera, cam, samples, look: rig.look, jitter: rig.jitter });
  window.__stats = { ms: Math.round(performance.now() - t0), samples, kitSheets: KIT.pieces.length };
  if (studio.renderer.getContext().isContextLost()) window.__error = 'Contexte WebGL perdu';
  window.__done = true;
}

run().catch((e) => { console.error(e); window.__error = String(e && e.stack || e); window.__done = true; });
