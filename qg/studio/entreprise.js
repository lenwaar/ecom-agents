// L'entreprise vue par le QG : les 137 fiches d'agents (entreprise/agents/<département>/*.md)
// et la file « en attente de vous » de donnees/entreprise.db. Lecture seule.
// La base est lue avec node:sqlite (Node 22.13 et plus) ; sans ce module, la file vaut null et la page affiche « — ».
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const { entete } = require("./livrables.js");

const DEPARTEMENTS = [
  { id: "ventes", nom: "Ventes", code: "V" },
  { id: "offres", nom: "Offres et partenariats", code: "P" },
  { id: "marketing", nom: "Marketing", code: "M" },
  { id: "operations", nom: "Opérations", code: "O" },
  { id: "intelligence", nom: "Intelligence", code: "I" },
  { id: "clients", nom: "Clients", code: "C" },
  { id: "back-office", nom: "Back office", code: "A" },
  { id: "cerveau", nom: "Cerveau", code: "X" }
];
const PHASES = { "maintenant": "maintenant", "avant lancement": "avant", "après lancement": "apres" };

function lireTexte(p) { try { return fs.readFileSync(p, "utf8"); } catch { return null; } }

// Fiches par département : total, répartition par phase, porteurs (sous-agent, script, humain).
function lireFiches(dossier) {
  if (!fs.existsSync(dossier)) return null;
  const departements = DEPARTEMENTS.map(d => {
    let noms = [];
    try { noms = fs.readdirSync(path.join(dossier, d.id)).filter(n => n.endsWith(".md")).sort(); } catch { noms = []; }
    const r = { ...d, total: 0, phases: { maintenant: 0, avant: 0, apres: 0 }, porteurs: {}, fiches: [] };
    for (const n of noms) {
      const h = entete(lireTexte(path.join(dossier, d.id, n)) || "");
      if (!h) continue;
      const c = h.champs;
      const nom = (c.nom || "").replace(/^"|"$/g, "");
      r.total++;
      const ph = PHASES[c.phase];
      if (ph) r.phases[ph]++;
      if (c.porteur) r.porteurs[c.porteur] = (r.porteurs[c.porteur] || 0) + 1;
      r.fiches.push({ code: c.code || n.slice(0, 3), nom, porteur: c.porteur || "", phase: c.phase || "", validation: c.validation_humaine === "oui" });
    }
    return r;
  });
  return { total: departements.reduce((s, d) => s + d.total, 0), departements };
}

// File « en attente de vous » (table validations), de la plus urgente à la moins urgente.
function lireValidations(base) {
  if (!fs.existsSync(base)) return null;
  let DatabaseSync;
  try { ({ DatabaseSync } = require("node:sqlite")); } catch { return null; }
  let db;
  try {
    db = new DatabaseSync(base, { readOnly: true });
    return db.prepare("SELECT id, agent, sujet, fichier, priorite FROM validations WHERE statut = 'en attente' " +
      "ORDER BY CASE priorite WHEN 'haute' THEN 0 WHEN 'normale' THEN 1 ELSE 2 END, cree_le").all()
      .map(v => ({ id: v.id, agent: v.agent, sujet: v.sujet, fichier: v.fichier || "", priorite: v.priorite }));
  } catch { return null; } finally { try { db && db.close(); } catch { /* déjà fermée */ } }
}

function lireEntreprise(racine) {
  const fiches = lireFiches(path.join(racine, "entreprise", "agents"));
  if (!fiches) return null;
  return { ...fiches, validations: lireValidations(path.join(racine, "donnees", "entreprise.db")) };
}

module.exports = { DEPARTEMENTS, lireFiches, lireValidations, lireEntreprise };
