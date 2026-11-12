// Éclairages et décors : studio (vues catalogue), nuit et lampe de bureau (vues d'ambiance),
// et mise à plat des planches prédécoupées (vue « Dans la boîte »).
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { dirFromAngles } from './engine.js';
import { MAT, woodFace } from './materials.js';
import { KIT, offsetPoly, bounds, transformPts, toShape, ccw, rectPts, box, put, rod, lathe, sphere, V2 } from './parts.js';
import { edgeMaterial } from './materials.js';

const D2R = THREE.MathUtils.degToRad;

function shadowCam(light, center, R, mapSize = 4096) {
  light.castShadow = true;
  light.shadow.mapSize.set(mapSize, mapSize);
  const c = light.shadow.camera; c.left = -R; c.right = R; c.top = R; c.bottom = -R; c.near = 1; c.far = R * 8;
  c.updateProjectionMatrix();
  light.shadow.bias = -0.0003; light.shadow.normalBias = 0.25;
  light.target.position.copy(center);
}

// Échantillon d'une direction de l'hémisphère supérieur (pondérée par le cosinus)
function hemiDir(rand, minEl = 8, n = 3) {
  for (;;) {
    const u = rand(), v = rand(); const y = Math.pow(u, 1 / (n + 1)); const r = Math.sqrt(1 - y * y), a = 2 * Math.PI * v;
    const d = new THREE.Vector3(r * Math.cos(a), y, r * Math.sin(a));
    if (Math.asin(d.y) > D2R(minEl)) return d;
  }
}

// ---------- Studio : catalogue ----------
// Lumière fixe par rapport à la caméra (le produit tourne, pas l'éclairage), fond clair uni.
// Applique la carte d'environnement à chaque matériau (permet un dosage par matière : userData.envK)
export function applyEnv(scene, tex, intensity, rotY = 0) {
  scene.traverse((o) => {
    if (!o.isMesh) return;
    for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
      if (!m || !m.isMeshStandardMaterial) continue;
      m.envMap = tex; m.envMapIntensity = intensity * (m.userData.envK ?? 1); m.envMapRotation.set(0, rotY, 0); m.needsUpdate = true;
    }
  });
}

export function studioRig(renderer, scene, objBox, { az = 0, wall = null, shadowOpacity = 0.34 } = {}) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.03).texture;
  applyEnv(scene, envTex, 0.42, D2R(az));
  const center = objBox.getCenter(new THREE.Vector3());
  const R = objBox.getSize(new THREE.Vector3()).length() * 0.5;

  const key = new THREE.DirectionalLight(new THREE.Color(1.0, 0.95, 0.88), 2.3);
  const fill = new THREE.DirectionalLight(new THREE.Color(0.86, 0.9, 1.0), 0.45);
  const rim = new THREE.DirectionalLight(new THREE.Color(1, 0.98, 0.95), 1.5);
  const dome = new THREE.DirectionalLight(new THREE.Color(1, 0.99, 0.97), 1.0);
  shadowCam(key, center, R * 1.9); shadowCam(dome, center, R * 2.6);
  const keyDir = dirFromAngles(az - 42, 46), fillDir = dirFromAngles(az + 65, 18), rimDir = dirFromAngles(az + 155, 38);
  for (const [l, d] of [[key, keyDir], [fill, fillDir], [rim, rimDir], [dome, new THREE.Vector3(0, 1, 0)]]) {
    l.position.copy(center).addScaledVector(d, R * 4); l.target.position.copy(center); scene.add(l, l.target);
  }
  if (!wall) {
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(20000, 20000), MAT.shadow);
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  } else {
    const w = new THREE.Mesh(new THREE.PlaneGeometry(20000, 20000), MAT.shadow);
    w.position.z = wall.z; w.receiveShadow = true; scene.add(w);
  }
  MAT.shadow.opacity = shadowOpacity;
  const t1 = new THREE.Vector3(), t2 = new THREE.Vector3();
  const jitter = (i, rand) => {
    // lumière principale : source de surface (≈ 9°)
    t1.set(rand() - 0.5, rand() - 0.5, rand() - 0.5).multiplyScalar(0.32);
    key.position.copy(center).addScaledVector(t2.copy(keyDir).add(t1).normalize(), R * 4);
    // dôme : direction aléatoire (occlusion ambiante, ombres de contact)
    let d = hemiDir(rand, 28);
    if (wall) { d.z = Math.abs(d.z); }
    dome.position.copy(center).addScaledVector(d, R * 4);
  };
  return { jitter, look: { exposure: 1.0, tone: 'neutral', bgA: '#F5F0E6', bgB: '#E7DFD1', bgCenter: [0.5, 0.56], bgRadius: 0.95, grain: 0.004, vignette: 0 } };
}

// ---------- Nuit : bureau, lampe chaude, fenêtre bleue ----------
function nightEnv(renderer) {
  const s = new THREE.Scene();
  const room = new THREE.Mesh(new THREE.SphereGeometry(50, 32, 16), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.012, 0.016, 0.03), side: THREE.BackSide }));
  s.add(room);
  const warm = new THREE.Mesh(new THREE.PlaneGeometry(14, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color(5, 3.2, 1.6), side: THREE.DoubleSide }));
  warm.position.set(-22, 26, 10); warm.lookAt(0, 0, 0); s.add(warm);
  const cool = new THREE.Mesh(new THREE.PlaneGeometry(30, 22), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.25, 0.36, 0.7), side: THREE.DoubleSide }));
  cool.position.set(30, 14, -30); cool.lookAt(0, 0, 0); s.add(cool);
  const pmrem = new THREE.PMREMGenerator(renderer);
  return pmrem.fromScene(s, 0.04).texture;
}

function book(w, h, d, cover) {
  const g = new THREE.Group();
  const coverMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(cover), roughness: 0.75 });
  const pages = box(w - 4, h - 3, d - 3, MAT.paper); pages.position.set(1.5, 0, 0); g.add(pages);
  const c1 = box(w, 1.5, d, coverMat); c1.position.y = h / 2 - 0.75; g.add(c1);
  const c2 = box(w, 1.5, d, coverMat); c2.position.y = -h / 2 + 0.75; g.add(c2);
  const sp = box(2, h, d, coverMat); sp.position.x = -w / 2 + 1; g.add(sp);
  return g;
}

// Livre debout (étagère / book nook) : dos vers l'avant (+z)
export function standingBook(w, h, d, cover) {
  const g = new THREE.Group();
  const coverMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(cover), roughness: 0.75 });
  const pages = box(w - 3, h - 4, d - 3, MAT.paper); pages.position.set(0, 0, -1.5); g.add(pages);
  for (const s of [-1, 1]) { const c = box(1.5, h, d, coverMat); c.position.x = s * (w / 2 - 0.75); g.add(c); }
  const sp = box(w, h, 2, coverMat); sp.position.z = d / 2 - 1; g.add(sp);
  const band = box(w + 0.2, 3, 2.2, MAT.brassDark); band.position.set(0, h * 0.32, d / 2 - 1); g.add(band);
  const band2 = band.clone(); band2.position.y = -h * 0.32; g.add(band2);
  g.position.y = h / 2;
  return g;
}

// Lampe de bureau articulée générique (aucun modèle de marque) : socle, deux bras, abat-jour conique.
function deskLamp(head, base) {
  const g = new THREE.Group();
  const b = lathe([[0, 0], [62, 0], [62, 10], [55, 16], [16, 18], [0, 18]], MAT.blackMetal); b.position.copy(base); g.add(b);
  const joint1 = base.clone().add(new THREE.Vector3(0, 22, 0));
  const elbow = new THREE.Vector3((base.x + head.x) / 2 - 40, Math.max(head.y, 200) + 120, (base.z + head.z) / 2 - 30);
  const arm = (a, c) => {
    for (const off of [-7, 7]) {
      const r = rod(a.distanceTo(c), 3.2, MAT.blackMetal, 16);
      const dir = c.clone().sub(a).normalize(); const side = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 0, 1)).normalize();
      r.position.copy(a).lerp(c, 0.5).addScaledVector(side, off * 0.3).add(new THREE.Vector3(0, 0, off));
      r.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir); g.add(r);
    }
    const j = sphere(7, MAT.brass); j.position.copy(c); g.add(j);
  };
  arm(joint1, elbow); arm(elbow, head);
  const j0 = sphere(8, MAT.brass); j0.position.copy(joint1); g.add(j0);
  return g;
}

// Décor de nuit. opts : { bbox, mode:'desk'|'wall'|'shelf', camAz, props:true, window:true }
export function nightSet(renderer, scene, objBox, opts = {}) {
  const envTex = nightEnv(renderer);
  const size = objBox.getSize(new THREE.Vector3()); const center = objBox.getCenter(new THREE.Vector3());
  const S = Math.max(size.x, size.y, size.z);
  const deskY = opts.deskY ?? 0;
  const wallZ = opts.wallZ ?? Math.min(objBox.min.z - 120 - S * 0.4, -260);
  const g = new THREE.Group(); scene.add(g);

  // Bureau en noyer
  const deskW = 2600, deskD = 1100;
  const top = new THREE.Mesh(new THREE.BoxGeometry(deskW, 36, deskD), [edgeMaterial(3), edgeMaterial(3), woodFace('walnut', Math.random, { rotate: 0 }), edgeMaterial(3), edgeMaterial(3), edgeMaterial(3)]);
  top.material[0] = top.material[1] = top.material[3] = top.material[4] = top.material[5] = new THREE.MeshStandardMaterial({ color: new THREE.Color('#2B1B12'), roughness: 0.6 });
  top.position.set(0, deskY - 18, wallZ + deskD / 2); top.receiveShadow = true; g.add(top);
  // Sous-main en cuir sombre sous l'objet (si posé sur le bureau)
  if (opts.mode !== 'wall' && opts.mat !== false) {
    const mw = Math.max(size.x * 1.6, 420), md = Math.max(size.z * 1.5, 300);
    const mat = box(mw, 2, md, MAT.leather); mat.position.set(center.x + 30, deskY + 1, center.z + 10); mat.receiveShadow = true; g.add(mat);
    opts._mat = 2;
  }
  // Mur bleu nuit avec fenêtre
  const wallH = 2400, wx = opts.windowX ?? (center.x - S * 0.5 - 100); const win = opts.window === false ? null : { x0: wx, x1: wx + 820, y0: deskY + 170, y1: deskY + 1400 };
  const wallMat = MAT.wallNight;
  const addWall = (x0, x1, y0, y1) => { const w = box(x1 - x0, y1 - y0, 40, wallMat); w.position.set((x0 + x1) / 2, (y0 + y1) / 2, wallZ - 20); w.receiveShadow = true; g.add(w); };
  if (win) {
    addWall(-3000, win.x0, deskY - 600, deskY + wallH); addWall(win.x1, 3000, deskY - 600, deskY + wallH);
    addWall(win.x0, win.x1, deskY - 600, win.y0); addWall(win.x0, win.x1, win.y1, deskY + wallH);
    // menuiseries
    const fr = (w, h, x, y) => { const b = box(w, h, 50, MAT.blackMetal); b.position.set(x, y, wallZ - 10); g.add(b); };
    fr(win.x1 - win.x0, 24, (win.x0 + win.x1) / 2, win.y0 + 12); fr(win.x1 - win.x0, 24, (win.x0 + win.x1) / 2, win.y1 - 12);
    fr(24, win.y1 - win.y0, win.x0 + 12, (win.y0 + win.y1) / 2); fr(24, win.y1 - win.y0, win.x1 - 12, (win.y0 + win.y1) / 2);
    fr(16, win.y1 - win.y0, (win.x0 + win.x1) / 2, (win.y0 + win.y1) / 2); fr(win.x1 - win.x0, 16, (win.x0 + win.x1) / 2, (win.y0 * 0.4 + win.y1 * 0.6));
    // ciel de nuit et lumières lointaines (flou d'arrière-plan)
    const sky = new THREE.Mesh(new THREE.PlaneGeometry(9000, 6000), new THREE.ShaderMaterial({
      uniforms: {}, vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
      fragmentShader: 'varying vec2 vUv; void main(){ vec3 a = vec3(0.010,0.016,0.040); vec3 b = vec3(0.045,0.075,0.17); gl_FragColor = vec4(mix(b, a, smoothstep(0.35,0.75,vUv.y)), 1.0); }',
    }));
    sky.position.set(0, 1500, wallZ - 3200); g.add(sky);
    let s = 9; const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    for (let i = 0; i < 46; i++) {
      const warm = rnd() < 0.7; const m = sphere(6 + rnd() * 10, warm ? MAT.bokehWarm : MAT.bokehCool, 12); m.castShadow = false; m.receiveShadow = false;
      const dz = 700 + rnd() * 900; const ta = Math.tan(D2R(opts.az ?? 24)), te = Math.tan(D2R(opts.el ?? 12));
      m.position.set(win.x0 - 60 + rnd() * (win.x1 - win.x0 + 120) - dz * ta, win.y0 + 40 + rnd() * (win.y1 - win.y0) * 0.75 - dz * te, wallZ - dz);
      g.add(m);
    }
  } else addWall(-3000, 3000, deskY - 600, deskY + wallH);

  // Plinthe d'étagère, objets de décor
  const props = [];
  if (opts.props !== false) {
    // pile de livres à gauche en arrière
    const bx = opts.mode === 'wall' ? center.x - 230 : objBox.min.x - 150 - S * 0.15, bz = Math.max(wallZ + 140, opts.mode === 'wall' ? wallZ + 140 : objBox.min.z - 60);
    const b1 = book(210, 34, 150, '#2F3B2E'); b1.position.set(bx, deskY + 17, bz); b1.rotation.y = D2R(8); g.add(b1);
    const b2 = book(190, 28, 136, '#5A2A24'); b2.position.set(bx + 6, deskY + 34 + 14, bz + 4); b2.rotation.y = D2R(-4); g.add(b2);
    const b3 = book(176, 22, 128, '#1E2B44'); b3.position.set(bx + 2, deskY + 62 + 11, bz - 2); b3.rotation.y = D2R(14); g.add(b3);
    // carnet et crayon à droite devant
    const nx = opts.mode === 'wall' ? center.x + 60 : objBox.max.x + 80 + S * 0.1, nz = opts.mode === 'wall' ? wallZ + 330 : objBox.max.z - 10;
    const nb = box(120, 8, 170, MAT.kraft); nb.position.set(nx + 60, deskY + 2 + 4, nz - 40); nb.rotation.y = D2R(-12); g.add(nb);
    const nbp = box(116, 6.6, 166, MAT.paper); nbp.position.set(nx + 62, deskY + 2 + 4, nz - 40); nbp.rotation.y = D2R(-12); g.add(nbp);
    const pencil = new THREE.Group();
    const body = rod(150, 3.6, new THREE.MeshStandardMaterial({ color: '#1F2A3A', roughness: 0.5 }), 6); pencil.add(body);
    const ferr = rod(10, 3.7, MAT.brass, 16); ferr.position.y = 80; pencil.add(ferr);
    const tip = lathe([[3.6, 0], [0.4, 18], [0, 19]], woodFace('birch', Math.random)); tip.position.y = -75; tip.rotation.x = Math.PI; pencil.add(tip);
    pencil.rotation.set(0, 0, Math.PI / 2); pencil.rotation.y = D2R(30);
    pencil.position.set(nx + 40, deskY + 10 + 3.6, nz + 40); g.add(pencil);
  }

  // Lampe : tête au-dessus et en avant à gauche du sujet
  const head = opts.lampHead ? new THREE.Vector3(...opts.lampHead) : new THREE.Vector3(objBox.min.x - 50 - S * 0.2, (opts.mode === 'wall' ? center.y + size.y * 0.25 : objBox.max.y) + 120 + S * 0.25, center.z + 90 + S * 0.2);
  const baseP = new THREE.Vector3(head.x - 140 - S * 0.1, deskY, Math.max(wallZ + 150, center.z - 120));
  if (opts.lamp !== false) g.add(deskLamp(head, baseP));
  const aim = opts.aim ? new THREE.Vector3(...opts.aim) : opts.mode === 'wall' ? center.clone() : new THREE.Vector3(center.x + 10, objBox.min.y + size.y * 0.35, center.z);
  const shadeDir = aim.clone().sub(head).normalize();
  const prof = []; for (let i = 0; i <= 16; i++) { const k = i / 16; prof.push([10 + 52 * Math.sin(k * Math.PI / 2), 8 - 62 * (1 - Math.cos(k * Math.PI / 2)) - 6 * k]); }
  prof.push([63, -62]);
  const shade = lathe(prof, MAT.lampShade, 64);
  const rimRing = new THREE.Mesh(new THREE.TorusGeometry(62.6, 1.6, 12, 96), MAT.brass); rimRing.rotation.x = Math.PI / 2; rimRing.position.y = -62;
  const shadeIn = lathe(prof.map(([x, y]) => [x - 1.2, y - 0.6]), MAT.lampInner, 64);
  const shadeGrp = new THREE.Group(); shadeGrp.add(shade, shadeIn, rimRing);
  const bulb = sphere(22, MAT.bulb, 24); bulb.castShadow = false; bulb.position.y = -30; shadeGrp.add(bulb);
  shadeGrp.position.copy(head); shadeGrp.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), shadeDir);
  if (opts.lamp !== false) g.add(shadeGrp);

  const spot = new THREE.SpotLight(new THREE.Color(1.0, 0.74, 0.44), opts.lampIntensity ?? 7, 0, D2R(46), 0.75, 0);
  const spotPos = head.clone().addScaledVector(shadeDir, 36);
  spot.position.copy(spotPos); spot.target.position.copy(aim); spot.castShadow = true;
  spot.shadow.mapSize.set(4096, 4096); spot.shadow.bias = -0.0002; spot.shadow.normalBias = 0.3; spot.shadow.camera.near = 20; spot.shadow.camera.far = 6000;
  scene.add(spot, spot.target);

  // Lumière de la fenêtre (lune et ville)
  const moon = new THREE.DirectionalLight(new THREE.Color(0.42, 0.55, 1.0), opts.moon ?? 0.9);
  const moonDir = new THREE.Vector3(0.75, 0.55, -0.6).normalize();
  moon.position.copy(center).addScaledVector(moonDir, 2000); moon.target.position.copy(center);
  shadowCam(moon, center, S * 2.2, 2048); moon.shadow.camera.far = 6000; scene.add(moon, moon.target);
  // reflet bleu de la nuit sur le mur et les faces tournées vers la fenêtre (sans ombre)
  const wash = new THREE.DirectionalLight(new THREE.Color(0.35, 0.48, 0.9), opts.wash ?? 0.35); wash.position.set(center.x + 600, center.y + 400, center.z + 900); wash.target.position.copy(center); scene.add(wash, wash.target);
  const hemi = new THREE.HemisphereLight(new THREE.Color(0.2, 0.28, 0.5), new THREE.Color(0.05, 0.035, 0.025), opts.ambient ?? 0.55); scene.add(hemi);
  // contre-jour chaud discret pour détacher les contours
  const rim = new THREE.DirectionalLight(new THREE.Color(1.0, 0.8, 0.55), opts.rim ?? 0.35);
  rim.position.copy(center).add(new THREE.Vector3(300, 500, -900)); rim.target.position.copy(center); scene.add(rim, rim.target);

  applyEnv(scene, envTex, opts.envIntensity ?? 0.55);
  const u = new THREE.Vector3(), v = new THREE.Vector3(), t = new THREE.Vector3();
  u.crossVectors(shadeDir, new THREE.Vector3(0, 1, 0)).normalize(); v.crossVectors(u, shadeDir).normalize();
  const jitter = (i, rand) => {
    const a = rand() * Math.PI * 2, r = Math.sqrt(rand()) * 18;
    spot.position.copy(spotPos).addScaledVector(u, Math.cos(a) * r).addScaledVector(v, Math.sin(a) * r);
    t.set(rand() - 0.5, rand() - 0.5, rand() - 0.5).multiplyScalar(0.12);
    moon.position.copy(center).addScaledVector(moonDir.clone().add(t).normalize(), 2000);
  };
  return { jitter, wallZ, head, look: { exposure: opts.exposure ?? 1.2, tone: 'aces', bgA: '#0A0F1A', bgB: '#05070C', grain: 0.016, vignette: 0.42, bloom: 0.45, bloomThreshold: 0.62 } };
}

// ---------- Planches prédécoupées (vue « Dans la boîte ») ----------
// Range les profils enregistrés dans KIT sur des planches 300 × 200 mm (rangement par étagères).
export function kitLayout({ sheetW = 300, sheetH = 200, gap = 3.5, margin = 7, maxSheets = 6 } = {}) {
  const items = KIT.pieces.map((p, i) => {
    const b = bounds(p.prof.outer); let rot = 0;
    if (b.h > b.w * 1.15) rot = Math.PI / 2;
    const w = rot ? b.h : b.w, h = rot ? b.w : b.h;
    return { ...p, i, b, rot, w, h };
  }).sort((a, b) => b.h - a.h || b.w - a.w);
  const sheets = [];
  const newSheet = (minW, minH) => { const s = { w: Math.max(sheetW, minW + 2 * margin), h: Math.max(sheetH, minH + 2 * margin), items: [], shelves: [] }; sheets.push(s); return s; };
  for (const it of items) {
    let placed = false;
    for (const s of sheets) {
      for (const sh of s.shelves) {
        if (it.h <= sh.h + 0.01 && sh.x + it.w <= s.w - margin) { it.x = sh.x; it.y = sh.y; sh.x += it.w + gap; s.items.push(it); placed = true; break; }
      }
      if (placed) break;
      const used = s.shelves.reduce((a, sh) => Math.max(a, sh.y + sh.h + gap), margin);
      if (used + it.h <= s.h - margin && margin + it.w <= s.w - margin) { const sh = { y: used, h: it.h, x: margin + it.w + gap }; s.shelves.push(sh); it.x = margin; it.y = used; s.items.push(it); placed = true; break; }
    }
    if (!placed) { const s = newSheet(it.w, it.h); const sh = { y: margin, h: it.h, x: margin + it.w + gap }; s.shelves.push(sh); it.x = margin; it.y = margin; s.items.push(it); }
  }
  return sheets;
}

// Construit la scène des planches (à plat, posées sur le fond) + accessoires (KIT.extras)
export function kitScene(opts = {}) {
  const sheets = kitLayout(opts);
  const root = new THREE.Group();
  const kerf = 0.55;
  const meshes = [];
  sheets.forEach((s) => {
    const sg = new THREE.Group();
    const t = s.items[0]?.t ?? 3;
    const holes = []; const parts = [];
    for (const it of s.items) {
      const tf = (pts) => {
        const b = it.b; let q = transformPts(pts, { x: -(b.minX + b.maxX) / 2, y: -(b.minY + b.maxY) / 2 });
        q = transformPts(q, { rot: it.rot });
        return transformPts(q, { x: it.x + it.w / 2 - s.w / 2, y: it.y + it.h / 2 - s.h / 2 });
      };
      const outer = tf(it.prof.outer);
      holes.push(outer);
      parts.push({ outer: offsetPoly(outer, -kerf), holes: (it.prof.holes || []).map(tf), t: it.t, kind: it.kind });
    }
    const sheetProf = { outer: rectPts(s.w, s.h), holes };
    const geo = new THREE.ExtrudeGeometry(toShape(sheetProf), { depth: t, bevelEnabled: false, curveSegments: 8 });
    const sheetMesh = new THREE.Mesh(geo, [woodFace('birch', KIT.rand, { rotate: 0 }), edgeMaterial(t)]);
    sheetMesh.castShadow = sheetMesh.receiveShadow = true;
    sheetMesh.rotation.x = -Math.PI / 2; sg.add(sheetMesh);
    for (const p of parts) {
      const pg = new THREE.ExtrudeGeometry(toShape(p), { depth: t, bevelEnabled: false, curveSegments: 8 });
      const pm = new THREE.Mesh(pg, [woodFace(p.kind, KIT.rand, { rotate: 0 }), edgeMaterial(t)]);
      pm.castShadow = pm.receiveShadow = true; pm.rotation.x = -Math.PI / 2; sg.add(pm);
    }
    meshes.push({ g: sg, w: s.w, h: s.h, t });
  });
  // Disposition : grille de 2 colonnes au plus ; au-delà de maxSheets, les planches s'empilent
  const maxShown = opts.maxShown ?? 6;
  const shown = meshes.slice(0, maxShown), stacked = meshes.slice(maxShown);
  const cw = Math.max(...shown.map((m) => m.w)), ch = Math.max(...shown.map((m) => m.h));
  let cols = 1, best = Infinity;
  for (let c = 1; c <= Math.min(3, shown.length); c++) { const rr = Math.ceil(shown.length / c); const asp = (c * cw) / (rr * ch * 0.85 + 60); const e = Math.abs(Math.log(asp / (opts.aspect ?? 0.8))); if (e < best) { best = e; cols = c; } }
  const rows = Math.ceil(shown.length / cols);
  const sp = 22;
  let s = 5; const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  shown.forEach((m, k) => {
    const c = k % cols, r = Math.floor(k / cols);
    const x = (c - (cols - 1) / 2) * (cw + sp) + (rnd() - 0.5) * 6;
    const z = (r - (rows - 1) / 2) * (ch + sp) + (rnd() - 0.5) * 6;
    // planches empilées dessous (si trop nombreuses)
    let y = 0; const under = stacked.filter((_, j) => j % shown.length === k);
    under.forEach((u, j) => { u.g.position.set(x + 2 + j * 1.5, y, z + 3 + j * 2); u.g.rotation.y = D2R((rnd() - 0.5) * 2); root.add(u.g); y += u.t; });
    m.g.position.set(x, y, z); m.g.rotation.y = D2R((rnd() - 0.5) * 2.5); root.add(m.g);
  });
  // Accessoires : posés en rangée sous les planches
  const bb = new THREE.Box3().setFromObject(root);
  let ex = bb.min.x + 10; const ez = bb.max.z + 34;
  for (const e of KIT.extras) {
    const eb = new THREE.Box3().setFromObject(e); const es = eb.getSize(new THREE.Vector3());
    e.position.x += ex - eb.min.x; e.position.z += ez - (eb.min.z + eb.max.z) / 2; e.position.y -= eb.min.y;
    root.add(e); ex += es.x + 18;
  }
  return { root, sheets: sheets.length };
}
