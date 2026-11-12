// Outils communs aux visuels d'ambiance (accueil) : comparateur planches / maquette montée et bureau de nuit.
import * as THREE from 'three';
import { nightSet, kitScene } from './rigs.js';
import { MAT } from './materials.js';
import { box, torus, rod, put, cut, rectPts, gearProfile, KIT } from './parts.js';

// Caméra fixe : même position et même cible pour les deux images d'un comparateur.
export function placeCamera(camera, { pos, target, fovLand, fovPort, view, W, H }) {
  camera.aspect = W / H;
  camera.fov = view === 'portrait' ? fovPort : fovLand;
  camera.position.set(...pos); camera.lookAt(new THREE.Vector3(...target));
  camera.near = 10; camera.far = 20000; camera.updateProjectionMatrix(); camera.updateMatrixWorld(true);
  return camera.position.distanceTo(new THREE.Vector3(...target));
}

// Paquet cadeau en papier kraft, ficelle croisée, étiquette vierge (aucun texte, aucun logo)
export function kraftParcel(w = 120, h = 60, d = 90) {
  const g = new THREE.Group();
  const b = box(w, h, d, MAT.kraft); b.position.y = h / 2; g.add(b);
  const tw = new THREE.MeshStandardMaterial({ color: new THREE.Color('#E9DFC9'), roughness: 0.9 });
  const s1 = box(w + 0.8, h + 0.8, 2.2, tw); s1.position.y = h / 2; g.add(s1);
  const s2 = box(2.2, h + 0.8, d + 0.8, tw); s2.position.y = h / 2; g.add(s2);
  const knot = torus(5, 1.1, tw, 32); knot.position.set(0, h + 1.2, 0); knot.rotation.x = Math.PI / 2; g.add(knot);
  const loop1 = torus(9, 1.1, tw, 32); loop1.position.set(-8, h + 1.4, 3); loop1.rotation.set(Math.PI / 2.4, 0, 0.4); g.add(loop1);
  const loop2 = torus(9, 1.1, tw, 32); loop2.position.set(8, h + 1.4, -2); loop2.rotation.set(Math.PI / 2.4, 0, -0.5); g.add(loop2);
  const tag = box(28, 0.6, 44, MAT.paper); tag.position.set(w * 0.28, h + 1.2, d * 0.18); tag.rotation.y = 0.5; g.add(tag);
  return g;
}

// Quelques roues dentées sorties de leur planche, posées à plat
export function looseGears(specs) {
  const g = new THREE.Group();
  for (const s of specs) { const m = cut(gearProfile({ z: s.z, m: s.m ?? 2, bore: 2.6, spokes: s.spokes ?? 0 }), 3, { kit: false }); put(m, [s.x, 1.5 + (s.y ?? 0), s.zz], [-90, 0, s.rot ?? 0], g); }
  return g;
}

export { nightSet, kitScene, KIT };
