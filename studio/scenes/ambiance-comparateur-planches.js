// Ambiance « comparateur », image 1/2 : les planches prédécoupées de l'horloge murale posées sur le bureau,
// le mur encore vide. Même caméra, même lumière, même décor que ambiance-comparateur-monte.
import * as THREE from 'three';
import { build as buildClock } from './horloge-murale-balancier.js';
import { nightSet, kitScene, placeCamera } from '../lib/ambiance.js';
import { KIT } from '../lib/parts.js';
import { MAT } from '../lib/materials.js';
import { box } from '../lib/parts.js';

const WALL_Z = -300;

export function comparatorSet({ view, scene, renderer, camera, W, H }, P, mode) {
  const clock = P.root;
  clock.position.set(-10, 520, WALL_Z + 12);
  const clockBox = new THREE.Box3().setFromObject(clock); // décor calé sur l'horloge dans les deux images
  if (mode === 'monte') scene.add(clock);
  else {
    const { root } = kitScene({ maxShown: 2 });
    root.rotation.y = THREE.MathUtils.degToRad(-9); root.position.set(10, 0, WALL_Z + 130);
    scene.add(root);
  }
  // clou au mur (présent dans les deux images)
  const nail = box(3, 3, 8, MAT.brassDark); nail.position.set(-10, 520 + 112 + 6, WALL_Z + 4); scene.add(nail);
  const rig = nightSet(renderer, scene, clockBox, {
    mode: 'wall', wallZ: WALL_Z, az: 14, el: 8, windowX: 230,
    lampHead: [-300, 420, WALL_Z + 330], aim: [0, 260, WALL_Z + 120], lampIntensity: 8, exposure: 1.25,
  });
  const dist = placeCamera(camera, { pos: [190, 330, 720], target: [10, 270, WALL_Z + 60], fovLand: 46, fovPort: 60, view, W, H });
  return { rig, cam: { aperture: 5, focus: dist * 0.98 }, samples: 220 };
}

export const ambiance = true;
export async function build(ctx) {
  const P = buildClock({ view: 'situation' }); // enregistre les pièces du kit de l'horloge
  return comparatorSet(ctx, P, 'planches');
}
