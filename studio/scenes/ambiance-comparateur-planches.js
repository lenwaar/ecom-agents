// Ambiance « comparateur », image 1/2 : les planches prédécoupées de l'horloge murale, posées debout contre
// le mur à l'endroit exact où l'horloge sera accrochée, quelques roues déjà détachées sur le bureau.
// Même caméra, même lumière, même décor que ambiance-comparateur-monte (comparateur avant/après de l'accueil).
// T38 : recomposition. Avant, les planches étaient à plat sur le bureau et l'horloge haut sur le mur :
// avec la caméra commune, les planches n'occupaient qu'une bande en bas de l'image.
import * as THREE from 'three';
import { build as buildClock } from './horloge-murale-balancier.js';
import { nightSet, kitScene, placeCamera, looseGears } from '../lib/ambiance.js';
import { MAT } from '../lib/materials.js';
import { box } from '../lib/parts.js';

const WALL_Z = -300;
const CLOCK = [-10, 400, WALL_Z + 12]; // position de l'horloge accrochée (et du clou)
const D2R = THREE.MathUtils.degToRad;

// Planche posée debout : inclinée de `tilt` degrés par rapport au bureau, pivotée dans son plan de `spin`,
// bas de la planche posé sur le bureau, haut appuyé à la profondeur `zTop`.
function leanSheet(sheet, { x, tilt, spin = 0, zTop }) {
  const inner = new THREE.Group(); sheet.position.set(0, 0, 0); sheet.rotation.set(0, D2R(spin), 0); inner.add(sheet);
  const holder = new THREE.Group(); holder.add(inner); holder.rotation.x = D2R(tilt);
  holder.updateMatrixWorld(true);
  const b = new THREE.Box3().setFromObject(holder);
  holder.position.set(x - (b.min.x + b.max.x) / 2, -b.min.y, zTop - b.min.z);
  return holder;
}

function planchesDebout() {
  const { root } = kitScene({ maxShown: 12 });
  const sheets = root.children.slice(); // groupes « planche + pièces »
  const g = new THREE.Group();
  // planche du fond (portrait), appuyée au mur ; deux planches devant, appuyées sur elle
  if (sheets[0]) g.add(leanSheet(sheets[0], { x: -10, tilt: 76, spin: 90, zTop: WALL_Z + 1 }));
  if (sheets[1]) g.add(leanSheet(sheets[1], { x: -150, tilt: 70, spin: 2, zTop: WALL_Z + 28 }));
  if (sheets[2]) g.add(leanSheet(sheets[2], { x: 140, tilt: 70, spin: -3, zTop: WALL_Z + 30 }));
  // les autres planches restent hors champ (dans la boîte)
  // roues déjà détachées, posées devant les planches
  g.add(looseGears([
    { z: 40, m: 1.5, x: -70, zz: WALL_Z + 150, rot: 10, spokes: 4 },
    { z: 8, m: 1.5, x: 5, zz: WALL_Z + 160, rot: 0 },
    { z: 48, m: 1.5, x: 80, zz: WALL_Z + 158, rot: 25, spokes: 5 },
  ]));
  return g;
}

export function comparatorSet({ view, scene, renderer, camera, W, H }, P, mode) {
  const clock = P.root;
  clock.position.set(...CLOCK);
  const clockBox = new THREE.Box3().setFromObject(clock); // décor calé sur l'horloge dans les deux images
  if (mode === 'monte') scene.add(clock);
  else scene.add(planchesDebout());
  // clou au mur (présent dans les deux images)
  const nail = box(3, 3, 8, MAT.brassDark); nail.position.set(CLOCK[0], CLOCK[1] + 112 + 6, WALL_Z + 4); scene.add(nail);
  const rig = nightSet(renderer, scene, clockBox, {
    mode: 'wall', wallZ: WALL_Z, az: 10, el: 10, windowX: 330,
    booksAt: [470, WALL_Z + 150], notebookAt: [230, WALL_Z + 420],
    lampHead: [-470, 560, WALL_Z + 330], aim: [0, 230, WALL_Z + 60], lampIntensity: 8, exposure: 1.25,
  });
  const dist = placeCamera(camera, { pos: [110, 320, WALL_Z + 980], target: [0, 250, WALL_Z + 60], fovLand: 36, fovPort: 46, view, W, H });
  return { rig, cam: { aperture: 4, focus: dist * 0.97 }, samples: 220 };
}

export const ambiance = true;
export async function build(ctx) {
  const P = buildClock({ view: 'situation' }); // enregistre les pièces du kit de l'horloge
  return comparatorSet(ctx, P, 'planches');
}
