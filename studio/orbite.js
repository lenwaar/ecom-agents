// Séquence d'orbite pour le studio vidéo (effet « orbite-produit ») : rend N images PNG d'une caméra
// qui tourne autour d'un produit, lumière fixe, distance constante.
//
//   node orbite.js --scene boite-a-musique-manivelle --frames 90 --az0 -10 --az1 80 --el 20 \
//                  --w 1080 --h 1920 --samples 48 --zoom 1.05 --out video/.cache/orbite/boite
//
// Les PNG vont dans un dossier ignoré par Git (studio/video/.cache/). Aucune donnée n'est envoyée.
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { startServer } from './server.js';

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const scene = opt('--scene', 'boite-a-musique-manivelle');
const frames = +opt('--frames', 90), az0 = +opt('--az0', -10), az1 = +opt('--az1', 80);
const el0 = +opt('--el', 20), el1 = +opt('--el1', opt('--el', 20));
const W = +opt('--w', 1080), H = +opt('--h', 1920), samples = +opt('--samples', 48);
const zoom = +opt('--zoom', 1), rigaz = +opt('--rigaz', 35), dy = +opt('--dy', 0);
const out = path.resolve(opt('--out', 'video/.cache/orbite/' + scene));
const from = +opt('--from', 0), to = +opt('--to', frames);
fs.mkdirSync(out, { recursive: true });

// Courbe douce (ralenti au départ et à l'arrivée) : aucun mouvement linéaire.
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const server = await startServer(0);
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'] });
const t0 = Date.now();
for (let i = from; i < to; i++) {
  const file = path.join(out, `f${String(i).padStart(4, '0')}.png`);
  if (fs.existsSync(file)) continue;
  const t = ease(frames > 1 ? i / (frames - 1) : 0);
  const az = az0 + (az1 - az0) * t, el = el0 + (el1 - el0) * t;
  const page = await browser.newPage({ viewport: { width: 800, height: 1000 } });
  page.on('pageerror', (e) => console.error('erreur page :', e.message));
  await page.goto(`${base}/viewer.html?scene=${scene}&view=orbite&az=${az.toFixed(3)}&el=${el.toFixed(3)}&rigaz=${rigaz}&zoom=${zoom}&dy=${dy}&w=${W}&h=${H}&samples=${samples}`);
  await page.waitForFunction(() => window.__done === true, null, { timeout: 10 * 60 * 1000, polling: 200 });
  const err = await page.evaluate(() => window.__error || null);
  if (err) throw new Error(err);
  const dataUrl = await page.evaluate(() => document.getElementById('c').toDataURL('image/png'));
  fs.writeFileSync(file, Buffer.from(dataUrl.split(',')[1], 'base64'));
  await page.close();
  console.log(`image ${i + 1}/${frames} (az ${az.toFixed(1)}°) ${((Date.now() - t0) / 1000).toFixed(0)} s`);
}
await browser.close();
server.close();
