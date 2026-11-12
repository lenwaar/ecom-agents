// Aperçu de contrôle : assemble les 6 vues PNG d'un produit (studio/.cache/png/<slug>/) en une image 3 × 2.
//   node apercu.js <slug> [sortie.jpg]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
const ROOT = path.dirname(fileURLToPath(import.meta.url));
const slug = process.argv[2]; const out = process.argv[3] || path.join(ROOT, '.cache', `apercu-${slug}.jpg`);
const views = ['face', 'trois-quarts', 'detail', 'dessus', 'situation', 'boite'];
const w = 600, h = 750; const comps = [];
for (let i = 0; i < views.length; i++) {
  const f = path.join(ROOT, '.cache', 'png', slug, `${views[i]}.png`);
  if (!fs.existsSync(f)) continue;
  comps.push({ input: await sharp(f).resize(w, h).toBuffer(), left: (i % 3) * w, top: Math.floor(i / 3) * h });
}
await sharp({ create: { width: w * 3, height: h * 2, channels: 3, background: '#000' } }).composite(comps).jpeg({ quality: 88 }).toFile(out);
console.log(out);
