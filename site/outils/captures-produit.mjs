// Captures pleine page d'une page produit à 390 px et 1280 px de large (après `npm run build`).
// Sert site/dist/ avec un petit serveur local (aucune dépendance), puis Chromium via playwright-core,
// celui de qg/studio/node_modules (même navigateur que qg/studio/tests/qg-page.test.js : chromium.launch()).
// Depuis un worktree sans node_modules dans qg/studio, le dépôt principal est essayé.
//
// Usage (dans site/) : npm run captures [-- <slug> [AAAA-MM-JJ]]
//   défaut : exemple-demo, date du jour ; sortie : outputs/captures/<date>-produit-demo-<largeur>.png
//   (slug autre que exemple-demo : outputs/captures/<date>-produit-<slug>-<largeur>.png)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const SITE = fileURLToPath(new URL('..', import.meta.url));
const RACINE = path.resolve(SITE, '..');
const DIST = path.join(SITE, 'dist');
const slug = process.argv[2] ?? 'exemple-demo';
const date = process.argv[3] ?? new Date().toISOString().slice(0, 10);
const nom = slug === 'exemple-demo' ? 'produit-demo' : `produit-${slug}`;
const SORTIE = path.join(RACINE, 'outputs', 'captures');
const LARGEURS = [390, 1280];

function chargerPlaywright() {
  const racines = [RACINE];
  try {
    const commun = execFileSync('git', ['rev-parse', '--path-format=absolute', '--git-common-dir'], { cwd: RACINE, encoding: 'utf8' }).trim();
    racines.push(path.dirname(commun));
  } catch {
    /* pas de git : on garde la racine courante */
  }
  for (const r of racines) {
    try {
      return createRequire(path.join(r, 'qg', 'studio', 'package.json'))('playwright-core');
    } catch {
      /* essai suivant */
    }
  }
  throw new Error('playwright-core introuvable : lancez `npm install` dans qg/studio/.');
}

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.json': 'application/json', '.glb': 'model/gltf-binary' };

function servir() {
  const serveur = http.createServer((req, res) => {
    const chemin = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let fichier = path.normalize(path.join(DIST, chemin));
    if (!fichier.startsWith(DIST)) return res.writeHead(403).end();
    if (fs.existsSync(fichier) && fs.statSync(fichier).isDirectory()) fichier = path.join(fichier, 'index.html');
    if (!fs.existsSync(fichier)) return res.writeHead(404).end('introuvable');
    res.writeHead(200, { 'content-type': TYPES[path.extname(fichier)] ?? 'application/octet-stream' });
    fs.createReadStream(fichier).pipe(res);
  });
  return new Promise((ok) => serveur.listen(0, '127.0.0.1', () => ok(serveur)));
}

if (!fs.existsSync(path.join(DIST, 'produits', slug, 'index.html'))) {
  console.error(`dist/produits/${slug}/ absent : lancez d'abord \`npm run build\`.`);
  process.exit(1);
}

const { chromium } = chargerPlaywright();
const serveur = await servir();
const origine = `http://127.0.0.1:${serveur.address().port}`;
fs.mkdirSync(SORTIE, { recursive: true });
const navigateur = await chromium.launch();
let erreurs = 0;
try {
  for (const largeur of LARGEURS) {
    const page = await navigateur.newPage({ viewport: { width: largeur, height: 900 }, reducedMotion: 'reduce' });
    page.on('pageerror', (e) => {
      erreurs++;
      console.error(`[${largeur}px] erreur JavaScript : ${e.message}`);
    });
    await page.goto(`${origine}/produits/${slug}/`, { waitUntil: 'networkidle' });
    const debord = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (debord > 0) {
      erreurs++;
      console.error(`[${largeur}px] la page déborde horizontalement de ${debord} px.`);
    }
    const fichier = path.join(SORTIE, `${date}-${nom}-${largeur}.png`);
    await page.screenshot({ path: fichier, fullPage: true });
    console.log(`Capture : ${path.relative(RACINE, fichier)}`);
    await page.close();
  }
} finally {
  await navigateur.close();
  serveur.close();
}
process.exit(erreurs ? 1 : 0);
