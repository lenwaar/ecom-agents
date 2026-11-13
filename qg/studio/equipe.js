// L'équipe vue par le QG : agents installés (.claude/agents/*.md) et livrables de outputs/ par agent.
// Lecture seule. Utilisé par serveur.js et par les tests (sur des dossiers temporaires).
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const { entete, estAValider } = require("./livrables.js");

function lireTexte(p) { try { return fs.readFileSync(p, "utf8"); } catch { return null; } }

// Agents installés : nom (champ « name » de l'en-tête, sinon nom du fichier) et description courte.
function listerAgents(dossier) {
  let noms = [];
  try { noms = fs.readdirSync(dossier).filter(n => n.endsWith(".md") && !n.startsWith(".")); } catch { return null; }
  return noms.map(n => {
    const h = entete(lireTexte(path.join(dossier, n)) || "");
    const nom = (h && h.champs.name) || n.slice(0, -3);
    const desc = h && h.champs.description ? h.champs.description.split(/\.\s/)[0].slice(0, 160) : "";
    return { nom, description: desc };
  }).sort((a, b) => a.nom.localeCompare(b.nom));
}

// Tous les livrables .md de outputs/ (premier niveau) qui ont un en-tête YAML.
function lireLivrables(dossier) {
  let noms = [];
  try { noms = fs.readdirSync(dossier).filter(n => n.endsWith(".md")); } catch { return []; }
  const liste = [];
  for (const nom of noms) {
    const texte = lireTexte(path.join(dossier, nom));
    const h = texte && entete(texte);
    if (!h) continue;
    const titre = /^#\s+(.+)$/m.exec(texte.slice(h.fin));
    liste.push({
      fichier: nom, agent: h.champs.agent || "", statut: h.champs.statut || "",
      aValider: estAValider(h.champs.statut), date: h.champs.date || nom.slice(0, 10),
      titre: titre ? titre[1].trim() : nom
    });
  }
  return liste.sort((a, b) => b.fichier.localeCompare(a.fichier));
}

// Résumé par agent : nombre total, livrables à valider, dernier livrable ; et livrables datés du jour.
function resumeLivrables(liste, aujourdhui) {
  const parAgent = {};
  for (const l of liste) {
    if (!l.agent) continue;
    const r = parAgent[l.agent] || (parAgent[l.agent] = { total: 0, aValider: [], dernier: null });
    r.total++;
    if (l.aValider) r.aValider.push({ fichier: l.fichier, titre: l.titre, date: l.date });
    if (!r.dernier || l.fichier > r.dernier.fichier) r.dernier = { fichier: l.fichier, date: l.date, statut: l.statut };
  }
  const duJour = aujourdhui ? liste.filter(l => l.date === aujourdhui).length : null;
  return { parAgent, duJour };
}

module.exports = { listerAgents, lireLivrables, resumeLivrables };
