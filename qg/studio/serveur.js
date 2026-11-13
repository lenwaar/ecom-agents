// Studio en direct : serveur local du tableau de bord des agents vidéo.
// Node seul, sans framework ni dépendance. Écoute uniquement sur 127.0.0.1.
//
// Variables d'environnement (toutes facultatives) :
//   STUDIO_PORT     port d'écoute (4178 par défaut)
//   STUDIO_RACINE   racine du dépôt (deux dossiers au-dessus par défaut)
//   STUDIO_JOURNAL  journal JSONL lu en continu (coordination/journal-direct.jsonl par défaut)
//   STUDIO_OUTPUTS  dossier des livrables (outputs/ par défaut)
//   STUDIO_CALENDRIER, STUDIO_MEDIAS  calendrier éditorial et dossier des vidéos
"use strict";
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const HOTE = "127.0.0.1";
const PORT = Number(process.env.STUDIO_PORT) || 4178;
const RACINE = path.resolve(process.env.STUDIO_RACINE || path.join(__dirname, "..", ".."));
const JOURNAL = path.resolve(process.env.STUDIO_JOURNAL || path.join(RACINE, "coordination", "journal-direct.jsonl"));
const OUTPUTS = path.resolve(process.env.STUDIO_OUTPUTS || path.join(RACINE, "outputs"));
const CALENDRIER = path.resolve(process.env.STUDIO_CALENDRIER || path.join(RACINE, "marketing", "calendrier.md"));
const MEDIAS = path.resolve(process.env.STUDIO_MEDIAS || path.join(RACINE, "medias"));
const PUBLIC = path.join(__dirname, "public");
const HISTORIQUE = 300;      // nombre d'événements renvoyés à l'ouverture de la page
const ORIGINE = `http://${HOTE}:${PORT}`;

const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".woff2": "font/woff2", ".txt": "text/plain; charset=utf-8", ".mp4": "video/mp4", ".png": "image/png",
  ".jpg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml"
};

// ---------- Outils ----------
function dansDossier(dossier, cible) {
  const rel = path.relative(dossier, cible);
  return rel !== "" && !rel.startsWith("..") && !path.isAbsolute(rel);
}
function lireTexte(p) { try { return fs.readFileSync(p, "utf8"); } catch { return null; } }
function json(res, code, objet) {
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(JSON.stringify(objet));
}
function dateDuJour() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// En-tête YAML simple (clé: valeur) d'un livrable.
function entete(texte) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(texte);
  if (!m) return null;
  const champs = {};
  for (const ligne of m[1].split(/\r?\n/)) {
    const i = ligne.indexOf(":");
    if (i > 0 && !/^\s/.test(ligne)) champs[ligne.slice(0, i).trim()] = ligne.slice(i + 1).split("#")[0].trim();
  }
  return { champs, debut: m.index, fin: m.index + m[0].length, bloc: m[1] };
}

// ---------- Journal : lecture continue ----------
let evenements = [];          // { id, ...ligne JSON }
let position = 0, reste = "", compteur = 0;
const abonnes = new Set();

function lireNouveautes() {
  let taille;
  try { taille = fs.statSync(JOURNAL).size; } catch { return; }
  if (taille < position) { position = 0; reste = ""; }          // fichier vidé ou remplacé
  if (taille === position) return;
  const fd = fs.openSync(JOURNAL, "r");
  const tampon = Buffer.alloc(taille - position);
  fs.readSync(fd, tampon, 0, tampon.length, position);
  fs.closeSync(fd);
  position = taille;
  const lignes = (reste + tampon.toString("utf8")).split("\n");
  reste = lignes.pop();                                           // ligne pas encore terminée
  for (const l of lignes) {
    if (!l.trim()) continue;
    let ev;
    try { ev = JSON.parse(l); } catch { continue; }
    ev.id = ++compteur;
    evenements.push(ev);
    if (evenements.length > 2000) evenements = evenements.slice(-HISTORIQUE);
    for (const res of abonnes) envoyer(res, "evenement", ev, ev.id);
  }
}
function envoyer(res, type, donnees, id) {
  res.write((id ? `id: ${id}\n` : "") + `event: ${type}\ndata: ${JSON.stringify(donnees)}\n\n`);
}
lireNouveautes();
fs.watchFile(JOURNAL, { interval: 400 }, lireNouveautes);       // surveillance fiable sous Windows
try { fs.watch(path.dirname(JOURNAL), () => lireNouveautes()); } catch { /* dossier absent : watchFile suffit */ }

// ---------- Livrables, calendrier, vidéos ----------
function livrablesAValider() {
  let noms = [];
  try { noms = fs.readdirSync(OUTPUTS).filter(n => n.endsWith(".md")); } catch { return []; }
  const liste = [];
  for (const nom of noms) {
    const p = path.join(OUTPUTS, nom);
    const h = entete(lireTexte(p) || "");
    if (!h || h.champs.statut !== "à-valider") continue;
    const titre = /^#\s+(.+)$/m.exec(lireTexte(p).slice(h.fin));
    liste.push({ fichier: nom, agent: h.champs.agent || "", date: h.champs.date || nom.slice(0, 10), titre: titre ? titre[1].trim() : nom });
  }
  return liste.sort((a, b) => b.fichier.localeCompare(a.fichier));
}

function calendrier() {
  const texte = lireTexte(CALENDRIER);
  if (texte === null) return { source: false, lignes: [] };
  const lignes = [];
  let entetes = null;
  for (const l of texte.split(/\r?\n/)) {
    if (!l.trim().startsWith("|")) { entetes = null; continue; }
    const cases = l.trim().replace(/^\||\|$/g, "").split("|").map(c => c.trim());
    if (cases.every(c => /^:?-+:?$/.test(c))) continue;
    if (!entetes) { entetes = cases.map(c => c.toLowerCase()); continue; }
    const o = {}; entetes.forEach((e, i) => { o[e] = cases[i] || ""; });
    lignes.push({ date: o.date || "", plateforme: o.plateforme || "", sujet: o.sujet || "", script: o.script || "", statut: o.statut || "", video: o["vidéo"] || o.video || "" });
  }
  return { source: true, lignes };
}

function videos() {
  let noms = [];
  try { noms = fs.readdirSync(MEDIAS).filter(n => n.toLowerCase().endsWith(".mp4")); } catch { return { nombre: null, derniere: null }; }
  const liste = noms.map(n => ({ fichier: n, date: fs.statSync(path.join(MEDIAS, n)).mtimeMs })).sort((a, b) => b.date - a.date);
  return { nombre: liste.length, derniere: liste[0] ? { fichier: liste[0].fichier, modifiee: new Date(liste[0].date).toISOString() } : null };
}

function rapportStudioVideo() {
  let noms = [];
  try { noms = fs.readdirSync(OUTPUTS).filter(n => /-studio-video-.*\.md$/.test(n)).sort(); } catch { return null; }
  if (!noms.length) return null;
  const nom = noms[noms.length - 1];
  const h = entete(lireTexte(path.join(OUTPUTS, nom)) || "");
  return { fichier: nom, statut: h ? h.champs.statut || "" : "" };
}

function etat() {
  return {
    livrables: livrablesAValider(),
    calendrier: calendrier(),
    videos: videos(),
    rapportVideo: rapportStudioVideo(),
    // Aucune source réelle pour l'instant : le client affiche « — ».
    cout: null,
    abonnes: null,
    sources: { journal: path.relative(RACINE, JOURNAL) || JOURNAL, outputs: path.relative(RACINE, OUTPUTS) || OUTPUTS }
  };
}

// Prévenir la page quand les livrables, le calendrier ou les vidéos changent.
let signature = "";
setInterval(() => {
  const s = JSON.stringify(etat());
  if (s !== signature) { signature = s; for (const res of abonnes) envoyer(res, "etat", JSON.parse(s)); }
}, 2000).unref();

// ---------- Validation d'un livrable ----------
// Change seulement « statut: à-valider » en « statut: validé » dans l'en-tête,
// et ajoute « valide_par: humain » et « date_validation: AAAA-MM-JJ ». Rien d'autre.
function valider(fichier) {
  if (typeof fichier !== "string" || fichier !== path.basename(fichier) || !/^[^\\/:*?"<>|]+\.md$/.test(fichier) || fichier.startsWith("."))
    return { code: 400, erreur: "Nom de fichier refusé : un livrable de outputs/ seulement." };
  const cible = path.resolve(OUTPUTS, fichier);
  if (!dansDossier(OUTPUTS, cible) || path.dirname(cible) !== OUTPUTS) return { code: 403, erreur: "Chemin hors de outputs/ refusé." };
  let reel;
  try { reel = fs.realpathSync(cible); } catch { return { code: 404, erreur: "Livrable introuvable." }; }
  if (path.dirname(reel) !== fs.realpathSync(OUTPUTS)) return { code: 403, erreur: "Chemin hors de outputs/ refusé." };
  const texte = lireTexte(reel);
  const h = texte && entete(texte);
  if (!h) return { code: 422, erreur: "En-tête YAML absent." };
  if (h.champs.statut !== "à-valider") return { code: 409, erreur: `Statut actuel « ${h.champs.statut || "?"} » : rien à valider.` };
  const fin = /\r\n/.test(h.bloc) ? "\r\n" : "\n";
  const lignes = h.bloc.split(/\r?\n/);
  const i = lignes.findIndex(l => /^statut:\s*à-valider\b/.test(l));
  if (i < 0) return { code: 422, erreur: "Ligne de statut introuvable." };
  const commentaire = /#.*$/.exec(lignes[i]);
  lignes[i] = "statut: validé" + (commentaire ? "   " + commentaire[0] : "");
  const ajouts = [];
  if (!lignes.some(l => /^valide_par:/.test(l))) ajouts.push("valide_par: humain");
  ajouts.push(`date_validation: ${dateDuJour()}`);
  lignes.splice(i + 1, 0, ...ajouts);
  const debutBloc = texte.indexOf(h.bloc, h.debut);
  const nouveau = texte.slice(0, debutBloc) + lignes.join(fin) + texte.slice(debutBloc + h.bloc.length);
  fs.writeFileSync(reel, nouveau, "utf8");
  return { code: 200, ok: true, fichier, date: dateDuJour() };
}

// ---------- Serveur HTTP ----------
function fichierStatique(req, res, dossier, chemin) {
  let rel;
  try { rel = decodeURIComponent(chemin); } catch { res.writeHead(400); return res.end(); }
  const cible = path.resolve(dossier, "." + path.sep + rel);
  if (!dansDossier(dossier, cible)) { res.writeHead(403); return res.end(); }
  fs.stat(cible, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }); return res.end("Introuvable"); }
    const type = TYPES[path.extname(cible).toLowerCase()] || "application/octet-stream";
    const plage = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || "");
    if (plage && (plage[1] || plage[2])) {                        // lecture partielle (vidéos)
      let debut = plage[1] ? Number(plage[1]) : st.size - Number(plage[2]);
      let fin = plage[1] && plage[2] ? Number(plage[2]) : st.size - 1;
      debut = Math.max(0, debut); fin = Math.min(fin, st.size - 1);
      if (debut > fin) { res.writeHead(416, { "Content-Range": `bytes */${st.size}` }); return res.end(); }
      res.writeHead(206, { "Content-Type": type, "Content-Length": fin - debut + 1, "Content-Range": `bytes ${debut}-${fin}/${st.size}`, "Accept-Ranges": "bytes" });
      if (req.method === "HEAD") return res.end();
      return fs.createReadStream(cible, { start: debut, end: fin }).pipe(res);
    }
    res.writeHead(200, { "Content-Type": type, "Content-Length": st.size, "Cache-Control": "no-cache", "Accept-Ranges": "bytes" });
    if (req.method === "HEAD") return res.end();
    fs.createReadStream(cible).pipe(res);
  });
}

const serveur = http.createServer((req, res) => {
  // Protection contre les sites tiers (rebinding DNS, requêtes croisées).
  if (req.headers.host !== `${HOTE}:${PORT}` && req.headers.host !== `localhost:${PORT}`) { res.writeHead(421); return res.end(); }
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Content-Security-Policy", "default-src 'self'; img-src 'self' data:; media-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'");
  const url = new URL(req.url, ORIGINE);

  if (req.method === "GET" && url.pathname === "/api/direct") {
    res.writeHead(200, { "Content-Type": "text/event-stream; charset=utf-8", "Cache-Control": "no-store", Connection: "keep-alive" });
    const dernier = Number(req.headers["last-event-id"]) || 0;
    envoyer(res, "etat", etat());
    const aEnvoyer = dernier ? evenements.filter(e => e.id > dernier) : evenements.slice(-HISTORIQUE);
    envoyer(res, "historique", aEnvoyer);
    abonnes.add(res);
    const battement = setInterval(() => res.write(": battement\n\n"), 20000);
    req.on("close", () => { clearInterval(battement); abonnes.delete(res); });
    return;
  }
  if (req.method === "GET" && url.pathname === "/api/etat") return json(res, 200, etat());
  if (url.pathname === "/api/valider") {
    if (req.method !== "POST") return json(res, 405, { erreur: "POST seulement." });
    const origine = req.headers.origin;
    if (origine !== ORIGINE && origine !== `http://localhost:${PORT}`) return json(res, 403, { erreur: "Origine refusée." });
    if (!/^application\/json/.test(req.headers["content-type"] || "")) return json(res, 415, { erreur: "JSON attendu." });
    let corps = "";
    req.on("data", d => { corps += d; if (corps.length > 4096) req.destroy(); });
    req.on("end", () => {
      let donnees;
      try { donnees = JSON.parse(corps); } catch { return json(res, 400, { erreur: "JSON invalide." }); }
      let r;
      try { r = valider(donnees.fichier); } catch (e) { r = { code: 500, erreur: "Écriture impossible." }; }
      json(res, r.code, r);
    });
    return;
  }
  if (req.method !== "GET" && req.method !== "HEAD") { res.writeHead(405); return res.end(); }
  if (url.pathname.startsWith("/medias/")) {
    if (!/\.(mp4|png|jpg|webp)$/i.test(url.pathname)) { res.writeHead(403); return res.end(); }
    return fichierStatique(req, res, MEDIAS, url.pathname.slice("/medias/".length));
  }
  return fichierStatique(req, res, PUBLIC, url.pathname === "/" ? "index.html" : url.pathname.slice(1));
});

serveur.listen(PORT, HOTE, () => {
  console.log(`Studio en direct : ${ORIGINE}/`);
  console.log(`Journal lu en continu : ${JOURNAL}`);
  console.log(`Livrables : ${OUTPUTS}`);
  console.log("Arrêt : Ctrl+C");
});
function arret() { fs.unwatchFile(JOURNAL); serveur.close(); for (const r of abonnes) r.end(); process.exit(0); }
process.on("SIGINT", arret);
process.on("SIGTERM", arret);
