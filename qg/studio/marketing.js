// Boucle marketing du QG (V2-3) : file « à valider » et suivi des revenus par post.
// Node seul, sans dépendance, sans aucun appel réseau. Lit et écrit seulement dans le dossier STUDIO_DATA (data/).
//
// ---------- Source de la file : data/file-marketing.json ----------
// Hors de Git (statuts locaux de l'humain), comme data/commandes.json. Versionnés à côté :
//   data/file-marketing.vide.json     modèle vide, lu tant que file-marketing.json n'existe pas
//   data/file-marketing.exemple.json  format fictif, jamais lu par le QG
// Les agents marketing (createur-contenu : M06, M08, M11, M12 ; crm-email : M16) y ajoutent chaque post,
// légende ou e-mail prêt, au statut « à-valider », avec le livrable de outputs/ d'où il vient.
//   {
//     "elements": [
//       {
//         "id": "2026-11-20-tiktok-budget-01",   identifiant unique (lettres, chiffres, tirets)
//         "type": "post" | "légende" | "e-mail",
//         "plateforme": "TikTok" | "Instagram" | "Pinterest" | "YouTube Shorts" | "E-mail" | ...,
//         "titre": "...", "texte": "...",        ce qui sera publié ou envoyé, tel quel
//         "agent": "createur-contenu", "code": "M12",
//         "livrable": "outputs/AAAA-MM-JJ-....md" | null,
//         "statut": "à-valider" | "validé" | "refusé",
//         "date_decision": null | "AAAA-MM-JJ", "decide_par": null | "humain",
//         "exemple": false                        true = ligne d'exemple, affichée à part, jamais décidable
//       }
//     ]
//   }
// Valider ou Refuser change SEULEMENT le statut (et ajoute la date) dans ce fichier : rien n'est publié
// ni envoyé. La publication reste manuelle, par l'humain, tant qu'aucun compte n'est relié.
//
// ---------- Revenus par post : data/posts.json ----------
// Hors de Git, comme data/commandes.json ; repli sur data/posts.vide.json ; data/posts.exemple.json jamais lu.
//   { "source": "aucune" | "saisie manuelle", "mis_a_jour": null | "AAAA-MM-JJ",
//     "posts": [ { "id", "plateforme", "date", "sujet", "lien": null | adresse publique du post (texte),
//                  "references_commandes": ["ch_..."], "exemple": false } ] }
// Revenu d'un post = chiffre d'affaires TTC et marge nette des commandes RÉELLES de data/commandes.json
// dont l'identifiant figure dans « references_commandes » (calcul de boutique.js, donc de tools/calcul_marge.py).
// Une référence absente de commandes.json n'est jamais comptée (avertissement). Un post d'exemple ne se relie
// qu'à des commandes d'exemple, un vrai post qu'à de vraies commandes : les deux ne se mélangent jamais.
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const { chargerCommandes, totaux, parametres } = require("./boutique.js");

const STATUTS = ["à-valider", "validé", "refusé"];
const ID_VALIDE = /^[A-Za-z0-9][A-Za-z0-9._-]{0,99}$/;
const NOTE_PUBLICATION = "Publication manuelle : aucun compte de réseau social ni outil d'envoi n'est relié. Valider ou Refuser change seulement un statut dans data/file-marketing.json sur cet ordinateur ; rien n'est publié ni envoyé. Vous publiez vous-même.";

function lireJson(dossierData, nom) {
  // nom.json (hors Git) d'abord, sinon le modèle vide versionné nom.vide.json.
  let fichier = path.join(dossierData, nom + ".json");
  if (!fs.existsSync(fichier) && fs.existsSync(path.join(dossierData, nom + ".vide.json"))) fichier = path.join(dossierData, nom + ".vide.json");
  const rel = "data/" + path.basename(fichier);
  let texte;
  try { texte = fs.readFileSync(fichier, "utf8"); } catch { return { fichier: rel, chemin: fichier, etat: "absent", donnees: null }; }
  try { return { fichier: rel, chemin: fichier, etat: "ok", donnees: JSON.parse(texte.replace(/^﻿/, "")) }; }
  catch { return { fichier: rel, chemin: fichier, etat: "invalide", donnees: null }; }
}
const texteOu = (v, defaut = "") => typeof v === "string" ? v : defaut;
const normStatut = s => String(s || "").normalize("NFC").trim().toLowerCase();

// ---------- File à valider ----------
function lireFile(dossierData) {
  const l = lireJson(dossierData, "file-marketing");
  const base = { fichier: l.fichier, note: NOTE_PUBLICATION };
  if (l.etat === "absent") return { ...base, etat: "absent", message: "Fichier data/file-marketing.json introuvable : rien à valider pour l'instant.", elements: [], exemples: [], avertissements: [] };
  if (l.etat === "invalide") return { ...base, etat: "invalide", message: "Fichier data/file-marketing.json illisible (JSON invalide) : corrigez-le ou remettez le modèle vide.", elements: [], exemples: [], avertissements: [] };
  const liste = l.donnees && Array.isArray(l.donnees.elements) ? l.donnees.elements : null;
  if (!liste) return { ...base, etat: "invalide", message: "Fichier data/file-marketing.json mal formé : la liste « elements » est absente.", elements: [], exemples: [], avertissements: [] };
  const avertissements = [], elements = [], exemples = [], vus = new Set();
  liste.forEach((e, i) => {
    if (!e || typeof e !== "object") return avertissements.push(`Élément n° ${i + 1} ignoré : format inconnu.`);
    const id = texteOu(e.id);
    if (!ID_VALIDE.test(id)) return avertissements.push(`Élément n° ${i + 1} ignoré : identifiant absent ou invalide.`);
    if (vus.has(id)) return avertissements.push(`Élément « ${id} » en double : seul le premier est gardé.`);
    vus.add(id);
    const statut = normStatut(e.statut);
    if (!STATUTS.includes(statut)) return avertissements.push(`Élément « ${id} » ignoré : statut « ${e.statut} » inconnu (à-valider, validé ou refusé attendu).`);
    const el = {
      id, statut,
      type: texteOu(e.type, "post"), plateforme: texteOu(e.plateforme), titre: texteOu(e.titre), texte: texteOu(e.texte),
      agent: texteOu(e.agent), code: texteOu(e.code), livrable: texteOu(e.livrable, null),
      date_decision: texteOu(e.date_decision, null), exemple: e.exemple === true
    };
    (el.exemple ? exemples : elements).push(el);
  });
  const enAttente = elements.filter(e => e.statut === "à-valider").length;
  return {
    ...base, etat: elements.length ? "ok" : "vide",
    message: elements.length ? "" : "File vide : aucun post, aucune légende, aucun e-mail en attente.",
    compte: { a_valider: enAttente, valides: elements.filter(e => e.statut === "validé").length, refuses: elements.filter(e => e.statut === "refusé").length },
    elements, exemples, avertissements
  };
}

// Change seulement le statut d'un élément « à-valider » en « validé » ou « refusé ».
// Écrit uniquement data/file-marketing.json (jamais le modèle vide). Aucun appel réseau.
function decider(dossierData, id, decision, date) {
  if (typeof id !== "string" || !ID_VALIDE.test(id)) return { code: 400, erreur: "Identifiant refusé." };
  if (decision !== "validé" && decision !== "refusé") return { code: 400, erreur: "Décision attendue : « validé » ou « refusé »." };
  const fichier = path.join(dossierData, "file-marketing.json");
  let texte;
  try { texte = fs.readFileSync(fichier, "utf8"); } catch { return { code: 404, erreur: "data/file-marketing.json introuvable : rien à décider." }; }
  let donnees;
  try { donnees = JSON.parse(texte.replace(/^﻿/, "")); } catch { return { code: 422, erreur: "data/file-marketing.json illisible (JSON invalide)." }; }
  const liste = donnees && Array.isArray(donnees.elements) ? donnees.elements : null;
  if (!liste) return { code: 422, erreur: "data/file-marketing.json mal formé." };
  const el = liste.find(e => e && typeof e === "object" && e.id === id);
  if (!el) return { code: 404, erreur: "Élément introuvable." };
  if (el.exemple === true) return { code: 409, erreur: "Élément d'exemple : il ne se décide pas." };
  if (normStatut(el.statut) !== "à-valider") return { code: 409, erreur: `Statut actuel « ${el.statut} » : rien à décider.` };
  el.statut = decision;
  el.date_decision = date;
  el.decide_par = "humain";
  try { fs.writeFileSync(fichier, JSON.stringify(donnees, null, 2) + "\n", "utf8"); }
  catch { return { code: 500, erreur: "Écriture impossible dans data/file-marketing.json" }; }
  return { code: 200, ok: true, id, statut: decision, date };
}

// ---------- Revenus par post ----------
function lirePosts(dossierData, p = parametres()) {
  const l = lireJson(dossierData, "posts");
  const base = { fichier: l.fichier };
  const vide = { reel: [], exemple: [], total_reel: totaux([], p), avertissements: [] };
  if (l.etat === "absent") return { ...base, ...vide, etat: "absent", message: "Fichier data/posts.json introuvable : aucun revenu par post ne peut être affiché." };
  if (l.etat === "invalide") return { ...base, ...vide, etat: "invalide", message: "Fichier data/posts.json illisible (JSON invalide) : corrigez-le ou remettez le modèle vide." };
  const liste = l.donnees && Array.isArray(l.donnees.posts) ? l.donnees.posts : null;
  if (!liste) return { ...base, ...vide, etat: "invalide", message: "Fichier data/posts.json mal formé : la liste « posts » est absente." };

  const ch = chargerCommandes(dossierData);
  const parId = new Map(ch.valides.map(c => [c.id, c]));
  const avertissements = [];
  if (ch.etat !== "ok") avertissements.push(`${ch.message} Les revenus par post restent à 0.`);
  const reel = [], exemple = [], attribuees = new Map();
  liste.forEach((po, i) => {
    if (!po || typeof po !== "object" || !texteOu(po.id)) return avertissements.push(`Post n° ${i + 1} ignoré : identifiant absent.`);
    const estExemple = po.exemple === true;
    const refs = Array.isArray(po.references_commandes) ? po.references_commandes.filter(r => typeof r === "string") : [];
    const liees = [];
    for (const r of refs) {
      const c = parId.get(r);
      if (!c) { avertissements.push(`Post « ${po.id} » : commande « ${r} » introuvable dans ${ch.fichier}, non comptée.`); continue; }
      if ((c.exemple === true) !== estExemple) {
        avertissements.push(estExemple ? `Post d'exemple « ${po.id} » : la commande réelle « ${r} » n'est jamais reliée à un exemple.` : `Post « ${po.id} » : la commande d'exemple « ${r} » n'est jamais comptée dans les vrais chiffres.`);
        continue;
      }
      liees.push(c);
      if (!estExemple) attribuees.set(r, (attribuees.get(r) || []).concat(po.id));
    }
    const t = totaux(liees, p);
    const ligne = { id: po.id, plateforme: texteOu(po.plateforme), date: texteOu(po.date), sujet: texteOu(po.sujet), lien: texteOu(po.lien, null),
      commandes: liees.length, payees: t.payees, ca_ttc: t.ca_ttc, marge_nette: liees.length ? t.marge_nette_totale : null };
    (estExemple ? exemple : reel).push(ligne);
  });
  for (const [r, posts] of attribuees) if (posts.length > 1) avertissements.push(`Commande « ${r} » reliée à plusieurs posts (${posts.join(", ")}) : comptée une seule fois dans le total.`);
  const tri = (a, b) => b.ca_ttc - a.ca_ttc || a.id.localeCompare(b.id);
  reel.sort(tri); exemple.sort(tri);
  const distinctes = [...attribuees.keys()].map(r => parId.get(r));
  return {
    ...base, etat: reel.length ? "ok" : "vide",
    message: reel.length ? "" : "Aucun post enregistré. Un post se relie à des références de commandes réelles de data/commandes.json ; aucun revenu n'est estimé.",
    source: texteOu(l.donnees.source, "aucune"), mis_a_jour: texteOu(l.donnees.mis_a_jour, null),
    reel, exemple, total_reel: totaux(distinctes, p), avertissements
  };
}

module.exports = { lireFile, decider, lirePosts, NOTE_PUBLICATION, STATUTS };
