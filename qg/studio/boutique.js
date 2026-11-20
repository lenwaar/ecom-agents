// Boutique et modules du QG (V1-3, V1-4) : chiffres de vente et marge nette réelle, état des modules.
// Node seul, sans dépendance. Lit data/commandes.json et data/modules.json (dossier STUDIO_DATA).
//
// ---------- Format de data/commandes.json ----------
// Prévu pour un import MANUEL d'un export Stripe (aucun import automatique, aucune clé ici).
//   {
//     "source": "aucune" | "export Stripe du AAAA-MM-JJ" | ...,   d'où viennent les commandes
//     "importe_le": null | "AAAA-MM-JJ",                         date de l'import manuel
//     "commandes": [
//       {
//         "id": "ch_...",              identifiant (celui de Stripe)
//         "date": "AAAA-MM-JJ",
//         "montant_ttc": 9.9,          prix payé par le client, en euros TTC
//         "frais_stripe": null | 0.4,  frais réels lus dans l'export ; null = inconnu (estimation utilisée)
//         "cout_produit": 0,           coût d'achat du produit (0 pour un fichier numérique)
//         "cout_port": 0,              coût d'envoi payé par la boutique (0 pour un fichier numérique)
//         "statut": "payee" | "remboursee",
//         "exemple": false             true = commande d'exemple (tests seulement), jamais additionnée au réel
//       }
//     ]
//   }
// Les commandes d'exemple n'existent que dans les tests (dossier temporaire via STUDIO_DATA), jamais dans data/.
//
// ---------- Calcul ----------
// Formules et constantes reprises EXACTEMENT de tools/calcul_marge.py (marge_nette, parametres).
// Les constantes doivent rester alignées avec ce fichier : tests/boutique.test.js compare les deux.
//   marge nette = P - coût - (STRIPE_TAUX * P + STRIPE_FIXE) - COTISATIONS * P - PROVISION_RETOURS * P
//                 - LIVRAISON_CLIENT_EN_PLUS - EMBALLAGE - ECO_PARTICIPATION
//   coût = cout_produit + cout_port ; un frais_stripe réel remplace l'estimation (STRIPE_TAUX * P + STRIPE_FIXE).
// Commande remboursée (règle simple) : chiffre d'affaires 0 ; marge = -(frais Stripe perdus + coût engagé),
//   frais perdus = frais_stripe réel s'il est connu, sinon la part fixe STRIPE_FIXE ; coût = cout_produit + cout_port.
//   Les cotisations et la provision ne s'appliquent pas (pas de chiffre d'affaires).
// Calcul exact en entiers (dix-millièmes de centime), puis arrondi au centime, demi vers l'extérieur
// (ROUND_HALF_UP de Python).
"use strict";
const fs = require("node:fs");
const path = require("node:path");

// Constantes de tools/calcul_marge.py (sources dans ce fichier). À garder alignées.
const STRIPE_TAUX = 0.015;            // À VÉRIFIER sur stripe.com/fr/pricing
const STRIPE_FIXE = 0.25;
const STRIPE_TAUX_PRUDENT = 0.03;
const STRIPE_FIXE_PRUDENT = 0.30;
const COTISATIONS = 0.212;            // services BIC, produits numériques (knowledge/prix-et-marges.md) ; à confirmer (URSSAF)
const COTISATIONS_VL = 0.229;
const PROVISION_RETOURS = 0.05;
const LIVRAISON_CLIENT_EN_PLUS = 0.00;
const EMBALLAGE = 0.00;
const ECO_PARTICIPATION = 0.00;       // À VÉRIFIER

function parametres(fraisPrudents = false, versementLiberatoire = false) {
  return {
    stripe_taux: fraisPrudents ? STRIPE_TAUX_PRUDENT : STRIPE_TAUX,
    stripe_fixe: fraisPrudents ? STRIPE_FIXE_PRUDENT : STRIPE_FIXE,
    cotisations: versementLiberatoire ? COTISATIONS_VL : COTISATIONS
  };
}

// Unités entières : 1 € = 100 centimes ; 1 taux = 10 000 dix-millièmes.
const ECHELLE = 10000;
const centimes = e => Math.round(Number(e) * 100);
const taux = t => Math.round(t * ECHELLE);
function arrondi(unites) {             // unités = centimes × ECHELLE -> euros arrondis au centime
  const s = unites < 0 ? -1 : 1;
  return s * Math.floor((Math.abs(unites) + ECHELLE / 2) / ECHELLE) / 100;
}
const u = euros => centimes(euros) * ECHELLE;   // euros -> unités

// Marge nette d'une commande payée, en unités entières. fraisReel : null ou euros.
function margeUnites(prix, cout, p, fraisReel = null) {
  const P = centimes(prix);
  const frais = fraisReel === null || fraisReel === undefined ? taux(p.stripe_taux) * P + u(p.stripe_fixe) : u(fraisReel);
  return P * ECHELLE - u(cout) - frais - taux(p.cotisations) * P - taux(PROVISION_RETOURS) * P
    - u(LIVRAISON_CLIENT_EN_PLUS) - u(EMBALLAGE) - u(ECO_PARTICIPATION);
}
// Équivalent de marge_nette(prix, cout, p) de tools/calcul_marge.py, arrondi au centime.
function margeNette(prix, cout, p = parametres(), fraisReel = null) { return arrondi(margeUnites(prix, cout, p, fraisReel)); }

function margeRembourseeUnites(cout, p, fraisReel = null) {
  const perdus = fraisReel === null || fraisReel === undefined ? u(p.stripe_fixe) : u(fraisReel);
  return -(perdus + u(cout));
}

const estNombre = v => typeof v === "number" && Number.isFinite(v);

function totaux(commandes, p) {
  let ca = 0, marge = 0, payees = 0, remboursees = 0, montantRembourse = 0;
  for (const c of commandes) {
    const cout = (estNombre(c.cout_produit) ? c.cout_produit : 0) + (estNombre(c.cout_port) ? c.cout_port : 0);
    const frais = estNombre(c.frais_stripe) ? c.frais_stripe : null;
    if (c.statut === "payee") {
      payees++; ca += centimes(c.montant_ttc); marge += margeUnites(c.montant_ttc, cout, p, frais);
    } else {
      remboursees++; montantRembourse += centimes(c.montant_ttc); marge += margeRembourseeUnites(cout, p, frais);
    }
  }
  const n = payees + remboursees;
  return {
    commandes: n,
    payees,
    ca_ttc: ca / 100,
    panier_moyen: payees ? arrondi(ca * ECHELLE / payees) : null,
    remboursements: { nombre: remboursees, montant: montantRembourse / 100 },
    marge_nette_totale: arrondi(marge),
    marge_par_commande: n ? arrondi(marge / n) : null
  };
}

function hypotheses(p) {
  const pc = t => String(Math.round(t * 1000) / 10).replace(".", ",") + " %";
  const eur = e => e.toFixed(2).replace(".", ",") + " €";
  return [
    `Frais Stripe estimés : ${pc(p.stripe_taux)} + ${eur(p.stripe_fixe)} par commande (À VÉRIFIER sur stripe.com/fr/pricing), remplacés par le frais réel quand l'export le donne.`,
    `Cotisations : ${pc(p.cotisations)} du chiffre d'affaires (taux de tools/calcul_marge.py, À VÉRIFIER).`,
    `Provision retours et SAV : ${pc(PROVISION_RETOURS)} du prix.`,
    `Livraison en plus ${eur(LIVRAISON_CLIENT_EN_PLUS)}, emballage ${eur(EMBALLAGE)}, éco-participation ${eur(ECO_PARTICIPATION)} (À VÉRIFIER).`,
    "Commande remboursée : chiffre d'affaires 0, marge = - (frais Stripe perdus + coût engagé) ; frais perdus = frais réel s'il est connu, sinon la part fixe.",
    "Constantes reprises de tools/calcul_marge.py : les deux doivent rester alignées."
  ];
}

// Lit data/commandes.json (repli sur commandes.vide.json) et sépare les lignes valides.
// Ne lève jamais. Utilisée par lireBoutique et par marketing.js (revenus par post).
function chargerCommandes(dossierData) {
  // data/commandes.json (vraies commandes) est hors de Git (.gitignore). S'il n'existe pas encore,
  // on lit le modèle vide versionné data/commandes.vide.json : 0 commande, aucun chiffre inventé.
  let fichier = path.join(dossierData, "commandes.json");
  if (!fs.existsSync(fichier) && fs.existsSync(path.join(dossierData, "commandes.vide.json"))) fichier = path.join(dossierData, "commandes.vide.json");
  const nomFichier = "data/" + path.basename(fichier);
  let texte;
  try { texte = fs.readFileSync(fichier, "utf8"); } catch {
    return { fichier: nomFichier, etat: "absent", message: "Fichier data/commandes.json introuvable : aucun chiffre ne peut être affiché.", donnees: null, valides: [], avertissements: [] };
  }
  let donnees;
  try { donnees = JSON.parse(texte.replace(/^﻿/, "")); } catch (e) {
    return { fichier: nomFichier, etat: "invalide", message: "Fichier data/commandes.json illisible (JSON invalide) : corrigez-le ou remettez le modèle vide.", donnees: null, valides: [], avertissements: [] };
  }
  if (!donnees || typeof donnees !== "object" || !Array.isArray(donnees.commandes)) {
    return { fichier: nomFichier, etat: "invalide", message: "Fichier data/commandes.json mal formé : la liste « commandes » est absente.", donnees: null, valides: [], avertissements: [] };
  }
  const avertissements = [];
  const valides = [];
  donnees.commandes.forEach((c, i) => {
    const nom = c && c.id ? `« ${c.id} »` : `n° ${i + 1}`;
    if (!c || typeof c !== "object") return avertissements.push(`Commande ${nom} ignorée : format inconnu.`);
    if (c.statut !== "payee" && c.statut !== "remboursee") return avertissements.push(`Commande ${nom} ignorée : statut « ${c.statut} » inconnu (payee ou remboursee attendu).`);
    if (!estNombre(c.montant_ttc) || c.montant_ttc < 0) return avertissements.push(`Commande ${nom} ignorée : montant_ttc absent ou invalide.`);
    if (!estNombre(c.cout_produit) || !estNombre(c.cout_port)) avertissements.push(`Commande ${nom} : coût produit ou port absent, compté 0 € (À VÉRIFIER).`);
    valides.push(c);
  });
  return { fichier: nomFichier, etat: "ok", message: "", donnees, valides, avertissements };
}

// Lit et calcule. Ne lève jamais : un fichier absent ou invalide donne un état lisible.
function lireBoutique(dossierData, p = parametres()) {
  const ch = chargerCommandes(dossierData);
  const base = { fichier: ch.fichier, hypotheses: hypotheses(p), visiteurs: { valeur: null, note: "Aucune source de mesure" } };
  if (ch.etat !== "ok") return { ...base, etat: ch.etat, message: ch.message, reel: totaux([], p), exemple: null, avertissements: [] };
  const donnees = ch.donnees;
  const reelles = ch.valides.filter(c => c.exemple !== true);
  const exemples = ch.valides.filter(c => c.exemple === true);
  return {
    ...base,
    etat: reelles.length ? "ok" : "vide",
    message: reelles.length ? "" : "Aucune commande importée. Import manuel d'un export Stripe prévu plus tard.",
    source: typeof donnees.source === "string" ? donnees.source : "aucune",
    importe_le: typeof donnees.importe_le === "string" ? donnees.importe_le : null,
    reel: totaux(reelles, p),
    exemple: exemples.length ? totaux(exemples, p) : null,
    avertissements: ch.avertissements
  };
}

// ---------- Modules (data/modules.json) ----------
// Format : { "modules": [ { "id", "nom", "statut": "actif" | "à venir", "description" } ] }
// Tout statut autre que « actif » est affiché « à venir ».
function lireModules(dossierData) {
  let texte;
  try { texte = fs.readFileSync(path.join(dossierData, "modules.json"), "utf8"); } catch {
    return { etat: "absent", message: "Fichier data/modules.json introuvable.", modules: [] };
  }
  let donnees;
  try { donnees = JSON.parse(texte.replace(/^﻿/, "")); } catch {
    return { etat: "invalide", message: "Fichier data/modules.json illisible (JSON invalide).", modules: [] };
  }
  const liste = donnees && Array.isArray(donnees.modules) ? donnees.modules : null;
  if (!liste) return { etat: "invalide", message: "Fichier data/modules.json mal formé : la liste « modules » est absente.", modules: [] };
  const modules = liste.filter(m => m && typeof m === "object").map(m => ({
    id: String(m.id || ""),
    nom: String(m.nom || m.id || "Module"),
    statut: m.statut === "actif" ? "actif" : "à venir",
    description: typeof m.description === "string" ? m.description : ""
  }));
  return { etat: "ok", message: "", modules };
}

module.exports = {
  STRIPE_TAUX, STRIPE_FIXE, STRIPE_TAUX_PRUDENT, STRIPE_FIXE_PRUDENT, COTISATIONS, COTISATIONS_VL,
  PROVISION_RETOURS, LIVRAISON_CLIENT_EN_PLUS, EMBALLAGE, ECO_PARTICIPATION,
  parametres, margeNette, totaux, chargerCommandes, lireBoutique, lireModules
};
