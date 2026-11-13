// Lecture de la synchro en cours dans coordination/de-cowork.md.
// Logique pure, sans accès disque : utilisée par serveur.js et par les tests.
//
// Format attendu (celui de Cowork) :
//   ## Synchro n°15 (transmise par l'humain le 2026-11-13) : QG en direct
//   ### T60 · QG en direct · `à faire`
//   Texte de la tâche…
// Statuts reconnus : `à faire` · `fait` · `bloqué (raison)`. Tout autre statut est gardé tel quel (« autre »).
"use strict";

const TITRE_SYNCHRO = /^##\s+Synchro\s+n°\s*(\d+)\b(.*)$/i;
const TITRE_SECTION = /^##\s/;
const TITRE_TACHE = /^###\s+(T\d+[a-z]?)\b\s*(.*)$/i;

// « `bloqué (le fournisseur ne répond pas)` » -> { statut: "bloque", raison: "le fournisseur ne répond pas" }
function lireStatut(brut) {
  const s = String(brut || "").normalize("NFC").trim();
  if (!s) return { statut: "inconnu", libelle: "—", raison: "" };
  const bas = s.toLowerCase();
  if (bas === "fait") return { statut: "fait", libelle: "fait", raison: "" };
  if (/^(à|a) faire$/.test(bas)) return { statut: "afaire", libelle: "à faire", raison: "" };
  const b = /^bloqu(é|e)\s*(?:\((.*)\))?\s*$/.exec(bas);
  if (b) {
    const debut = s.indexOf("("), fin = s.lastIndexOf(")");
    const raison = debut >= 0 && fin > debut ? s.slice(debut + 1, fin).trim() : "";
    return { statut: "bloque", libelle: "bloqué", raison };
  }
  return { statut: "autre", libelle: s, raison: "" };
}

// Retire la mise en forme Markdown simple pour un résumé lisible.
function texteSimple(t) {
  return String(t || "")
    .replace(/\*\*([^*]+)\*\*/g, "$1").replace(/`([^`]*)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/\s+/g, " ").trim();
}
function court(t, n) { return t.length <= n ? t : t.slice(0, n - 1).trimEnd() + "…"; }

// Ligne de titre d'une tâche : « T60 · QG en direct · `à faire` ».
function lireTitreTache(id, reste) {
  let titre = reste.replace(/^\s*·\s*/, "");
  let statutBrut = "";
  const m = /\s*·\s*`([^`]*)`\s*$/.exec(titre) || /\s*·\s*(fait|à faire|a faire|bloqu[ée].*)\s*$/i.exec(titre);
  if (m) { statutBrut = m[1]; titre = titre.slice(0, m.index); }
  return { id: id.toUpperCase(), titre: texteSimple(titre), ...lireStatut(statutBrut) };
}

// Renvoie la dernière section « Synchro n°… » et ses tâches, ou null s'il n'y en a pas.
// agentsConnus : noms techniques (ex. « developpeur-web ») cherchés dans le texte de chaque tâche.
function lireSynchro(texte, agentsConnus = []) {
  if (typeof texte !== "string") return null;
  const lignes = texte.replace(/^﻿/, "").split(/\r?\n/);
  let debut = -1;
  lignes.forEach((l, i) => { if (TITRE_SYNCHRO.test(l)) debut = i; });
  if (debut < 0) return null;
  let fin = lignes.length;
  for (let i = debut + 1; i < lignes.length; i++) if (TITRE_SECTION.test(lignes[i])) { fin = i; break; }

  const m = TITRE_SYNCHRO.exec(lignes[debut]);
  // Après le numéro : précision facultative entre parenthèses, puis « : titre » facultatif.
  // « (transmise le 2026-11-13) : QG en direct », « : suivante » et « (test) » sont tous acceptés.
  const suite = m[2].trim();
  const parts = /^(?:\(([^)]*)\))?\s*(?::\s*(.*))?$/.exec(suite);
  const precision = parts ? parts[1] || "" : suite;
  const titre = parts ? parts[2] || "" : "";
  const synchro = {
    numero: Number(m[1]),
    titre: texteSimple(titre),
    precision: texteSimple(precision),
    taches: []
  };
  let tache = null;
  const terminer = () => {
    if (!tache) return;
    const corps = texteSimple(tache.corps.join(" "));
    tache.texte = court(corps, 220);
    tache.agents = agentsConnus.filter(a => new RegExp(`(^|[^a-z-])${a.replace(/[-]/g, "\\-")}($|[^a-z-])`).test(tache.corps.join(" ")));
    delete tache.corps;
    synchro.taches.push(tache);
  };
  for (let i = debut + 1; i < fin; i++) {
    const t = TITRE_TACHE.exec(lignes[i]);
    if (t) { terminer(); tache = { ...lireTitreTache(t[1], t[2]), corps: [] }; continue; }
    if (tache && lignes[i].trim()) tache.corps.push(lignes[i].trim());
  }
  terminer();
  const compte = { fait: 0, afaire: 0, bloque: 0, autre: 0, inconnu: 0 };
  synchro.taches.forEach(x => { compte[x.statut]++; });
  synchro.compte = compte;
  return synchro;
}

module.exports = { lireSynchro, lireStatut };
