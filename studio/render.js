// Rendu automatisé : ouvre chaque scène dans Chromium sans interface (Playwright), exporte un PNG
// haute définition, puis les WebP 1600 px et 800 px dans site/public/.
//
//   npm run render                               tout régénérer (10 produits × 6 vues + ambiances + planches contact)
//   node render.js --only coffre-fort-combinaison --views face,detail
//   node render.js --samples 16                  aperçu rapide (qualité réduite)
//   node render.js --no-ambiance | --ambiance-only | --no-planche
//   STUDIO_GL=swiftshader node render.js         rendu logiciel si aucun GPU n'est disponible (lent)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import sharp from 'sharp';
import { startServer } from './server.js';
import { buildContactSheets } from './contact.js';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(ROOT, '..');
const OUT_PRODUITS = path.join(REPO, 'site', 'public', 'produits');
const OUT_AMBIANCE = path.join(REPO, 'site', 'public', 'ambiance');
const CACHE = path.join(ROOT, '.cache', 'png');

export const PRODUCT_VIEWS = ['face', 'trois-quarts', 'detail', 'dessus', 'situation', 'boite'];

const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true) : null; };
const only = opt('--only') ? String(opt('--only')).split(',') : null;
const viewsOnly = opt('--views') ? String(opt('--views')).split(',') : null;
const samples = opt('--samples') ? +opt('--samples') : null;

const scenes = fs.readdirSync(path.join(ROOT, 'scenes')).filter((f) => f.endsWith('.js')).map((f) => f.replace(/\.js$/, '')).sort();
const products = scenes.filter((s) => !s.startsWith('ambiance-')).filter((s) => !only || only.includes(s));
const ambiances = scenes.filter((s) => s.startsWith('ambiance-')).filter((s) => !only || only.includes(s));

function launchArgs() {
  if (process.env.STUDIO_GL === 'swiftshader') return ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'];
  return ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'];
}

async function renderOne(browser, base, scene, view, w, h) {
  const page = await browser.newPage({ viewport: { width: 800, height: 1000 } });
  page.on('pageerror', (e) => console.error(`  [${scene}/${view}] erreur page :`, e.message));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.error(`  [${scene}/${view}] ${m.type()} : ${m.text().slice(0, 300)}`); });
  const url = `${base}/viewer.html?scene=${scene}&view=${view}&w=${w}&h=${h}${samples ? `&samples=${samples}` : ''}`;
  await page.goto(url);
  await page.waitForFunction(() => window.__done === true, null, { timeout: 15 * 60 * 1000, polling: 250 });
  const err = await page.evaluate(() => window.__error || null);
  if (err) { await page.close(); throw new Error(`${scene}/${view} : ${err}`); }
  const stats = await page.evaluate(() => window.__stats);
  const dataUrl = await page.evaluate(() => document.getElementById('c').toDataURL('image/png'));
  await page.close();
  return { png: Buffer.from(dataUrl.split(',')[1], 'base64'), stats };
}

async function writeWebp(png, file, width, height, quality) {
  await sharp(png).resize(width, height, { kernel: 'lanczos3', fit: 'cover' }).webp({ quality, effort: 6, smartSubsample: true }).toFile(file);
  return fs.statSync(file).size;
}

async function main() {
  fs.mkdirSync(CACHE, { recursive: true });
  const server = await startServer(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  let browser = await chromium.launch({ args: launchArgs() });
  // en cas de perte du contexte WebGL (pilote graphique), on relance le navigateur et on réessaie
  let count = 0;
  const shot = async (scene, view, w, h) => {
    // navigateur relancé régulièrement : libère la mémoire graphique
    if (++count % 6 === 0) { await browser.close().catch(() => {}); browser = await chromium.launch({ args: launchArgs() }); }
    for (let k = 0; ; k++) {
      try { return await renderOne(browser, base, scene, view, w, h); } catch (e) {
        if (k >= 2) throw e;
        console.error(`  nouvel essai ${scene}/${view} : ${String(e.message).split('\n')[0].slice(0, 160)}`);
        await browser.close().catch(() => {}); browser = await chromium.launch({ args: launchArgs() });
      }
    }
  };
  const t0 = Date.now(); const report = [];
  try {
    if (!args.includes('--ambiance-only')) {
      for (const slug of products) {
        const dir = path.join(OUT_PRODUITS, slug); fs.mkdirSync(dir, { recursive: true });
        fs.mkdirSync(path.join(CACHE, slug), { recursive: true });
        for (const view of PRODUCT_VIEWS.filter((v) => !viewsOnly || viewsOnly.includes(v))) {
          const t = Date.now();
          const { png, stats } = await shot(slug, view, 1600, 2000);
          fs.writeFileSync(path.join(CACHE, slug, `${view}.png`), png);
          const s1 = await writeWebp(png, path.join(dir, `${view}-1600.webp`), 1600, 2000, 86);
          const s2 = await writeWebp(png, path.join(dir, `${view}-800.webp`), 800, 1000, 82);
          report.push({ slug, view, s1, s2 });
          console.log(`${slug}/${view} : ${((Date.now() - t) / 1000).toFixed(1)} s (${stats.samples} échantillons) · ${(s1 / 1024).toFixed(0)} Ko / ${(s2 / 1024).toFixed(0)} Ko`);
        }
      }
    }
    if (!args.includes('--no-ambiance')) {
      fs.mkdirSync(OUT_AMBIANCE, { recursive: true }); fs.mkdirSync(path.join(CACHE, 'ambiance'), { recursive: true });
      for (const scene of ambiances) {
        const nom = scene.replace(/^ambiance-/, '');
        const t = Date.now();
        // paysage 1600 × 1000 (ordinateur) et portrait 800 × 1000 (mobile, cadrage dédié)
        const land = await shot(scene, 'paysage', 1600, 1000);
        fs.writeFileSync(path.join(CACHE, 'ambiance', `${nom}-paysage.png`), land.png);
        const s1 = await writeWebp(land.png, path.join(OUT_AMBIANCE, `${nom}-1600.webp`), 1600, 1000, 84);
        const port = await shot(scene, 'portrait', 1600, 2000);
        fs.writeFileSync(path.join(CACHE, 'ambiance', `${nom}-portrait.png`), port.png);
        const s2 = await writeWebp(port.png, path.join(OUT_AMBIANCE, `${nom}-800.webp`), 800, 1000, 82);
        report.push({ slug: 'ambiance', view: nom, s1, s2 });
        console.log(`ambiance/${nom} : ${((Date.now() - t) / 1000).toFixed(1)} s · ${(s1 / 1024).toFixed(0)} Ko / ${(s2 / 1024).toFixed(0)} Ko`);
      }
    }
  } finally {
    await browser.close(); server.close();
  }
  if (!args.includes('--no-planche')) await buildContactSheets();
  console.log(`Terminé en ${((Date.now() - t0) / 60000).toFixed(1)} min, ${report.length} visuels.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
