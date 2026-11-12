// Ambiance « bureau de nuit » (accueil : section Offrir / L'atelier) : boîte à musique montée sous la lampe,
// paquet en papier kraft, roues dentées sorties de leur planche, carnet. Lumière chaude de lampe, nuit bleue.
import * as THREE from 'three';
import { build as buildBox } from './boite-a-musique-manivelle.js';
import { nightSet, placeCamera, kraftParcel, looseGears } from '../lib/ambiance.js';

export const ambiance = true;
export async function build({ view, scene, renderer, camera, W, H }) {
  const P = buildBox({ view: 'situation' });
  const root = P.root; root.rotation.y = THREE.MathUtils.degToRad(-18); root.position.set(0, 0, 0); scene.add(root);
  const parcel = kraftParcel(130, 62, 96); parcel.position.set(-175, 0, -70); parcel.rotation.y = THREE.MathUtils.degToRad(24); scene.add(parcel);
  const gears = looseGears([
    { z: 24, x: 120, zz: 70, spokes: 5, rot: 10 }, { z: 14, x: 158, zz: 96, rot: 30 }, { z: 18, x: 96, zz: 120, spokes: 4, rot: 5 },
  ]);
  scene.add(gears);
  const bb = new THREE.Box3().setFromObject(root);
  const rig = nightSet(renderer, scene, bb, {
    az: 20, el: 12, windowX: -60, lampHead: [-150, 330, 120], aim: [-10, 40, 0], lampIntensity: 8.5, exposure: 1.2,
  });
  const dist = placeCamera(camera, { pos: [200, 170, 520], target: [-20, 70, -10], fovLand: 30, fovPort: 44, view, W, H });
  return { rig, cam: { aperture: 7, focus: dist * 0.97 }, samples: 220 };
}
