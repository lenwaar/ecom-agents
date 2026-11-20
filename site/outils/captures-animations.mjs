// Captures et mesures des composants animés (V2-2), après `npm run build`.
// Sert site/dist/ en local (aucune dépendance), puis Chromium via playwright-core de qg/studio
// (même chargeur que captures-produit.mjs).
//
// Usage (dans site/) : node outils/captures-animations.mjs <dossier> [--reduit] [--positions] [--slug <slug>]
//   <dossier>    : sous-dossier de sortie dans outputs/captures/2026-11-20-animations/ (ex. avant, apres)
//   --reduit     : ajoute les captures avec prefers-reduced-motion: reduce émulé
//   --positions  : ajoute 3 captures d'écran de la section « Sélection » à 3 positions de défilement
//   --slug       : fiche produit à capturer (défaut : exemple-demo)
// Écrit aussi <dossier>/poids-js.json : fichiers JS chargés par page (accueil, fiche, page légale),
// taille brute et gzip lues dans dist/.
// Échoue si une page déborde horizontalement ou lève une erreur JavaScript.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const SITE = fileURLToPath(new URL('..', import.meta.url));
const RACINE = path.resolve(SITE, '..');
const DIST = path.join(SITE, 'dist');
const args = process.argv.slice(2);
const dossier = args.find((a) => !a.startsWith('--') && args[args.indexOf(a) - 1] !== '--slug') ?? 'avant';
const reduit = args.includes('--reduit');
const positions = args.includes('--positions');
const slug = args.includes('--slug') ? args[args.indexOf('--slug') + 1] : 'exemple-demo';
const SORTIE = path.join(RACINE, 'outputs', 'captures', '2026-11-20-animations', dossier);
const LARGEURS = [390, 1280];
const PAGES = [
  { nom: 'accueil', url: '/' },
  { nom: slug === 'exemple-demo' ? 'produit-demo' : `produit-${slug}`, url: `/produits/${slug}/` },
];
const PAGE_LEGALE = { nom: 'mentions-legales', url: '/mentions-legales/' };

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

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.json': 'application/json', '.glb': 'model/gltf-binary' };

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

/** Défile toute la page par pas d'un écran pour déclencher les révélations et les îlots client:visible. */
async function parcourir(page) {
  await page.evaluate(async () => {
    const pause = (ms) => new Promise((r) => setTimeout(r, ms));
    const pas = Math.round(window.innerHeight * 0.7);
    for (let y = 0; y < document.documentElement.scrollHeight; y += pas) {
      window.scrollTo(0, y);
      await pause(120);
    }
    window.scrollTo(0, 0);
    await pause(300);
  });
  await page.waitForTimeout(1500);
}

if (!fs.existsSync(path.join(DIST, 'index.html'))) {
  console.error("dist/ absent : lancez d'abord `npm run build`.");
  process.exit(1);
}

const { chromium } = chargerPlaywright();
const serveur = await servir();
const origine = `http://127.0.0.1:${serveur.address().port}`;
fs.mkdirSync(SORTIE, { recursive: true });
const navigateur = await chromium.launch();
let erreurs = 0;
const poids = {};

async function ouvrir(largeur, mouvement, url, etiquette) {
  const page = await navigateur.newPage({ viewport: { width: largeur, height: 900 }, reducedMotion: mouvement });
  const js = new Set();
  page.on('pageerror', (e) => {
    erreurs++;
    console.error(`[${etiquette}] erreur JavaScript : ${e.message}`);
  });
  page.on('response', (r) => {
    const u = new URL(r.url());
    if (u.origin === origine && /\.m?js$/.test(u.pathname)) js.add(u.pathname);
  });
  await page.goto(`${origine}${url}`, { waitUntil: 'networkidle' });
  await parcourir(page);
  await page.waitForLoadState('networkidle');
  const debord = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (debord > 0) {
    erreurs++;
    console.error(`[${etiquette}] la page déborde horizontalement de ${debord} px.`);
  }
  return { page, js };
}

function mesurer(fichiers) {
  const liste = [...fichiers].sort().map((f) => {
    const contenu = fs.readFileSync(path.join(DIST, f));
    return { fichier: f, brut: contenu.length, gzip: zlib.gzipSync(contenu, { level: 9 }).length };
  });
  return {
    fichiers: liste,
    total_brut: liste.reduce((s, f) => s + f.brut, 0),
    total_gzip: liste.reduce((s, f) => s + f.gzip, 0),
  };
}

try {
  const modes = [['no-preference', 'normal'], ...(reduit ? [['reduce', 'mouvement-reduit']] : [])];
  for (const [mouvement, suffixe] of modes) {
    for (const p of PAGES) {
      for (const largeur of LARGEURS) {
        const etiquette = `${p.nom}-${largeur}-${suffixe}`;
        const { page, js } = await ouvrir(largeur, mouvement, p.url, etiquette);
        const fichier = path.join(SORTIE, `${etiquette}.png`);
        await page.screenshot({ path: fichier, fullPage: true });
        console.log(`Capture : ${path.relative(RACINE, fichier)}`);
        if (mouvement === 'no-preference') poids[`${p.nom}-${largeur}`] = mesurer(js);
        await page.close();
      }
    }
  }
  // Poids JS d'une page légale (aucun îlot attendu).
  for (const largeur of LARGEURS) {
    const { page, js } = await ouvrir(largeur, 'no-preference', PAGE_LEGALE.url, `${PAGE_LEGALE.nom}-${largeur}`);
    poids[`${PAGE_LEGALE.nom}-${largeur}`] = mesurer(js);
    await page.close();
  }
  // Section « Sélection » à 3 positions de défilement (le prix ne doit jamais être couvert).
  if (positions) {
    for (const largeur of LARGEURS) {
      const { page } = await ouvrir(largeur, 'no-preference', '/', `selection-${largeur}`);
      const haut = await page.evaluate(() => {
        const s = document.querySelector('[data-moment]');
        return s.getBoundingClientRect().top + window.scrollY;
      });
      const hauteur = await page.evaluate(() => document.querySelector('[data-moment]').offsetHeight);
      const reperes = [0.15, 0.45, 0.75];
      for (const [i, r] of reperes.entries()) {
        await page.evaluate((y) => window.scrollTo(0, y), Math.round(haut + hauteur * r - 200));
        await page.waitForTimeout(900);
        const fichier = path.join(SORTIE, `selection-${largeur}-position-${i + 1}.png`);
        await page.screenshot({ path: fichier });
        console.log(`Capture : ${path.relative(RACINE, fichier)}`);
      }
      await page.close();
    }
  }
} finally {
  await navigateur.close();
  serveur.close();
}
fs.writeFileSync(path.join(SORTIE, 'poids-js.json'), JSON.stringify(poids, null, 2) + '\n');
for (const [nom, m] of Object.entries(poids)) console.log(`JS ${nom} : ${m.fichiers.length} fichier(s), ${m.total_brut} o brut, ${m.total_gzip} o gzip`);
process.exit(erreurs ? 1 : 0);
