// Suivi de Cowork : il passe « au travail » quand un fichier qu'il a écrit arrive ou change
// dans coordination/, mais pas quand c'est Claude Code qui l'écrit (repéré dans le journal).
// Il repasse au repos après un délai ou quand Claude Code commence la synchro.
// Logique sans minuterie : serveur.js appelle examiner() régulièrement ; les tests aussi.
"use strict";
const fs = require("node:fs");
const path = require("node:path");

const DELAI_REPOS_MS = 10 * 60 * 1000;   // sans nouveau fichier pendant 10 min : Cowork au repos
const ATTENTE_JOURNAL_MS = 2500;          // le hook écrit le journal juste après l'outil : on l'attend
const AVANT_MS = 5000;                    // l'heure du journal est à la seconde près
const APRES_MS = 180000;                  // une longue commande Bash est journalisée à sa fin
const IGNORES = /^journal-direct\./;      // le journal lui-même est écrit par le hook, pas par Cowork

// Heure « HH:MM:SS » du journal -> millisecondes (le journal ne donne pas la date).
function tempsEvenement(heure, maintenant) {
  const m = /^(\d{2}):(\d{2}):(\d{2})/.exec(heure || "");
  if (!m) return maintenant;
  const d = new Date(maintenant);
  d.setHours(+m[1], +m[2], +m[3], 0);
  let t = d.getTime();
  if (t - maintenant > 60000) t -= 24 * 3600 * 1000;           // heure « future » : la veille
  return t;
}

const normaliser = t => String(t || "").replace(/\\/g, "/").toLowerCase();
const COMMANDE_QUI_ECRIT = /(>|\btee\b|\bcp\b|\bmv\b|\brm\b|\btouch\b|sed\s+-i|\bpy\b|\bpython3?\b|\bnode\b|set-content|out-file|add-content|copy-item|move-item|\bgit\s+(checkout|restore|reset|stash|pull|merge|rebase|switch))/;

// L'événement du journal est-il une écriture de Claude Code (ou d'un de ses agents) sur ce fichier ?
function ecritSurFichier(ev, rel) {
  const texte = normaliser(ev.texte);
  const r = normaliser(rel), base = r.split("/").pop();
  if (ev.type !== "PostToolUse") return false;
  if (["Write", "Edit", "MultiEdit", "NotebookEdit"].includes(ev.outil)) return texte.endsWith("coordination/" + r) || texte.endsWith("/" + base) || texte.endsWith(" " + base);
  if (ev.outil === "Bash") {
    if (/\bgit\s+(checkout|restore|reset|stash|pull|merge|rebase|switch)\b/.test(texte)) return true;
    return (texte.includes(base) || texte.includes("coordination")) && COMMANDE_QUI_ECRIT.test(texte);
  }
  return false;
}

// Claude Code commence la synchro : la demande la lance (« /cowork », « synchro ») ou il lit les consignes.
function debutSynchro(ev) {
  if (ev.type === "UserPromptSubmit") {
    const t = String(ev.texte || "");
    if (/^DEMANDE · </.test(t)) return false;                     // messages automatiques (agents, tâches)
    return /(^|\s)\/cowork\b|synchro/i.test(t);
  }
  if (ev.type === "PostToolUse" && ev.outil === "Read") return /de-cowork\.md$|prochaine-synchro\//.test(normaliser(ev.texte));
  return false;
}

function libelle(rel) {
  const r = normaliser(rel);
  if (r === "de-cowork.md") return "écrit les consignes de la synchro";
  if (r.startsWith("prochaine-synchro/")) return "prépare la prochaine synchro";
  if (r.startsWith("a-installer/")) return "dépose un fichier à installer";
  return "met à jour la coordination";
}

function listerFichiers(dossier, prefixe = "", profondeur = 0, sortie = {}) {
  let entrees = [];
  try { entrees = fs.readdirSync(dossier, { withFileTypes: true }); } catch { return sortie; }
  for (const e of entrees) {
    if (e.name.startsWith(".") || (!prefixe && IGNORES.test(e.name))) continue;
    const rel = prefixe + e.name;
    if (e.isDirectory()) { if (profondeur < 2) listerFichiers(path.join(dossier, e.name), rel + "/", profondeur + 1, sortie); continue; }
    try { sortie[rel] = fs.statSync(path.join(dossier, e.name)).mtimeMs; } catch { /* fichier disparu */ }
  }
  return sortie;
}

function creerSuivi({ dossier, delai = DELAI_REPOS_MS, attente = ATTENTE_JOURNAL_MS, maintenant = Date.now() } = {}) {
  const connus = listerFichiers(dossier);
  // Au démarrage, les fichiers récents sont examinés comme des changements (serveur relancé pendant que Cowork écrit).
  const attenteDecision = {};
  for (const [rel, mtime] of Object.entries(connus)) if (maintenant - mtime < delai) attenteDecision[rel] = { mtime, vu: maintenant - attente };
  let cowork = {};                 // rel -> mtime des fichiers attribués à Cowork
  let actif = false, depuis = 0, dernier = 0;

  function ecritParClaude(rel, mtime, evenements, ref) {
    return evenements.some(ev => {
      if (!ecritSurFichier(ev, rel)) return false;
      const t = tempsEvenement(ev.heure, ref);
      return t >= mtime - AVANT_MS && t <= mtime + APRES_MS;
    });
  }

  // À appeler régulièrement (et à chaque nouvel événement du journal). Renvoie true si l'état a changé.
  function examiner(evenements, ref = Date.now()) {
    const avant = JSON.stringify(etat());
    const actuels = listerFichiers(dossier);
    for (const [rel, mtime] of Object.entries(actuels))
      if (connus[rel] !== mtime) attenteDecision[rel] = { mtime, vu: ref };
    Object.assign(connus, actuels);
    for (const rel of Object.keys(connus)) if (!(rel in actuels)) delete connus[rel];

    for (const [rel, a] of Object.entries(attenteDecision)) {
      if (ref - a.vu < attente) continue;
      delete attenteDecision[rel];
      if (ecritParClaude(rel, a.mtime, evenements, ref)) continue;
      cowork[rel] = a.mtime;
      if (!actif) depuis = a.mtime;
      actif = true; dernier = Math.max(dernier, a.mtime, ref - attente);
    }
    if (actif) {
      // Correction tardive : une commande longue de Claude Code journalisée après la décision.
      for (const [rel, mtime] of Object.entries(cowork)) if (ecritParClaude(rel, mtime, evenements, ref)) delete cowork[rel];
      const debut = evenements.some(ev => debutSynchro(ev) && tempsEvenement(ev.heure, ref) >= dernier - AVANT_MS);
      if (!Object.keys(cowork).length || debut || ref - dernier > delai) { actif = false; cowork = {}; }
    }
    return JSON.stringify(etat()) !== avant;
  }

  function etat() {
    const fichiers = Object.keys(cowork).sort((a, b) => cowork[b] - cowork[a]);
    return actif ? { actif: true, fichiers, texte: libelle(fichiers[0] || ""), depuis: new Date(depuis).toISOString() } : { actif: false, fichiers: [], texte: "", depuis: null };
  }

  return { examiner, etat };
}

module.exports = { creerSuivi, tempsEvenement, ecritSurFichier, debutSynchro, libelle, DELAI_REPOS_MS };
