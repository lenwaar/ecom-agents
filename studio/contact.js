// Planche contact : une ligne par produit (6 vues), plus une ligne pour les visuels d'ambiance.
// Sortie : outputs/planches/2026-11-12-studio-visuel-planche-contact.jpg (+ une planche par produit dans studio/.cache/planches/)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(ROOT, '..');
const VIEWS = ['face', 'trois-quarts', 'detail', 'dessus', 'situation', 'boite'];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
function label(text, w, h, { size = 22, color = '#F5F1E8', bg = '#0A0F1A', anchor = 'start', x = 16 } = {}) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="${bg}"/><text x="${anchor === 'middle' ? w / 2 : x}" y="${h / 2 + size * 0.35}" font-family="Georgia, serif" font-size="${size}" fill="${color}" text-anchor="${anchor}">${esc(text)}</text></svg>`);
}

export async function buildContactSheets({ date = '2026-11-12' } = {}) {
  const prodDir = path.join(REPO, 'site', 'public', 'produits');
  const ambDir = path.join(REPO, 'site', 'public', 'ambiance');
  const slugs = fs.existsSync(prodDir) ? fs.readdirSync(prodDir).filter((d) => fs.statSync(path.join(prodDir, d)).isDirectory()).sort() : [];
  const cw = 280, ch = 350, gap = 8, head = 44, colHead = 34, pad = 24;
  const ambs = fs.existsSync(ambDir) ? fs.readdirSync(ambDir).filter((f) => f.endsWith('-1600.webp')).sort() : [];
  const ambH = 260, ambW = Math.round(ambH * 1.6);
  const W = pad * 2 + VIEWS.length * cw + (VIEWS.length - 1) * gap;
  const H = pad + 70 + colHead + slugs.length * (head + ch + gap) + (ambs.length ? head + ambH + pad : 0) + pad;
  const comps = [];
  comps.push({ input: label('Rouage & Laiton · planche contact des rendus 3D de démonstration (aucun produit réel)', W, 70, { size: 28, color: '#C8A15A' }), left: 0, top: 0 });
  VIEWS.forEach((v, i) => comps.push({ input: label(v, cw, colHead, { size: 18, color: '#A8A29A', anchor: 'middle' }), left: pad + i * (cw + gap), top: 70 }));
  let y = 70 + colHead;
  for (const slug of slugs) {
    comps.push({ input: label(slug, W, head, { size: 22, x: pad }), left: 0, top: y }); y += head;
    for (let i = 0; i < VIEWS.length; i++) {
      const f = path.join(prodDir, slug, `${VIEWS[i]}-800.webp`);
      if (!fs.existsSync(f)) continue;
      comps.push({ input: await sharp(f).resize(cw, ch).toBuffer(), left: pad + i * (cw + gap), top: y });
    }
    y += ch + gap;
  }
  if (ambs.length) {
    comps.push({ input: label('ambiance (accueil)', W, head, { size: 22, x: pad }), left: 0, top: y }); y += head;
    let x = pad;
    for (const a of ambs) { comps.push({ input: await sharp(path.join(ambDir, a)).resize(ambW, ambH).toBuffer(), left: x, top: y }); x += ambW + gap; }
    y += ambH + pad;
  }
  const outDir = path.join(REPO, 'outputs', 'planches'); fs.mkdirSync(outDir, { recursive: true });
  const out = path.join(outDir, `${date}-studio-visuel-planche-contact.jpg`);
  await sharp({ create: { width: W, height: Math.max(H, y + pad), channels: 3, background: '#0A0F1A' } }).composite(comps).jpeg({ quality: 84, mozjpeg: true }).toFile(out);
  console.log(`Planche contact : ${path.relative(REPO, out)}`);
  return out;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) await buildContactSheets();
