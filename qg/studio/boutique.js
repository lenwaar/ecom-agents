// Boutique (V1-3) et modules (V1-4) : fonctions pures, testables sans serveur ni navigateur.
// Les vrais chiffres viennent UNIQUEMENT de data/commandes.json ; ceux de data/commandes.exemple.json
// sont calculés à part et jamais additionnés aux vrais. Aucune donnée inventée : un fichier absent,
// vide ou invalide est dit tel quel.
//
// Contrat de données (écrit par architecte-web) :
//   commandes.json : { source, visiteurs: number|null, commandes: [ { reference, date "AAAA-MM-JJ", produit,
//                      quantite, montant_ttc, cout_fournisseur: number|null, frais_stripe_reels: number|null,
//                      statut: "payee"|"remboursee" } ] }
//   commandes.exemple.json : même format avec "exemple": true (racine et commandes)
//   modules.json : { modules: [ { id, nom, etat: "actif"|"a-venir", description, preuve } ] }
"use strict";
const fs = require("node:fs");
const path = require("node:path");

// ---------------------------------------------------------------------------
// Constantes de marge, reprises de tools/calcul_marge.py (mêmes sources)
// Tous les calculs se font en millièmes de centime (entiers) : les taux en pour mille
// tombent juste, et l'arrondi au centime (demi vers l'extérieur, comme ROUND_HALF_UP)
// n'a lieu qu'à l'affichage. Aucune erreur d'arrondi des nombres à virgule.
// ---------------------------------------------------------------------------
const MC = 1000;   // millièmes de centime par centime

// Frais Stripe, carte standard de l'EEE : 1,5 % + 0,25 €.
// Source : docs/site-technique.md (« tarif Stripe consulté le 2026-11-12 ») via tools/calcul_marge.py
// (STRIPE_TAUX, STRIPE_FIXE). À VÉRIFIER sur stripe.com/fr/pricing.
const STRIPE_TAUX_PM = 15;            // 0,015 = 15 pour mille
const STRIPE_FIXE_CENTIMES = 25;      // 0,25 €
// Cotisations micro-entreprise : 12,3 % (tools/calcul_marge.py COTISATIONS ; knowledge/prix-et-marges.md,
// leçon 4 de docs/retours-experience.md). Taux à confirmer par l'URSSAF ou un expert-comptable.
const COTISATIONS_PM = 123;
// Provision retours/SAV : 5 % (tools/calcul_marge.py PROVISION_RETOURS ; knowledge/memo.md).
const PROVISION_PM = 50;
// Livraison au client en plus : 0 € (tools/calcul_marge.py LIVRAISON_CLIENT_EN_PLUS).
const LIVRAISON_CENTIMES = 0;
// Emballage : 0 € (tools/calcul_marge.py EMBALLAGE).
const EMBALLAGE_CENTIMES = 0;
// Éco-participation : 0 € en attendant le barème, À VÉRIFIER (tools/calcul_marge.py ECO_PARTICIPATION).
const ECO_CENTIMES = 0;
// Seuils par commande (tools/calcul_marge.py MARGE_PLANCHER, MARGE_OBJECTIF ; knowledge/decisions.md).
const PLANCHER_CENTIMES = 1000;
const OBJECTIF_CENTIMES = 1500;

const MENTION = "Frais Stripe et éco-participation À VÉRIFIER : la marge est une estimation tant qu'ils ne sont pas confirmés.";

// ---------- Conversions ----------
function estNombre(v) { return typeof v === "number" && Number.isFinite(v); }
function centimes(euros) { return Math.round(Number((euros * 100).toFixed(4))); }
// Millièmes de centime -> centimes, demi vers l'extérieur (identique à Decimal ROUND_HALF_UP).
function arrondiCentimes(m) { const s = m < 0 ? -1 : 1; return s * Math.floor((Math.abs(m) + MC / 2) / MC); }
function euros(c) {
  if (c === null || c === undefined) return "—";
  const s = c < 0 ? "-" : "", a = Math.abs(c);
  const ent = String(Math.floor(a / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${s}${ent},${String(a % 100).padStart(2, "0")} €`;
}

// ---------- Marge d'une commande ----------
// marge = P - coût - frais Stripe - 12,3 % P - 5 % P - livraison - emballage - éco-participation
// Renvoie { millicentimes, centimes, fraisStripeMc, fraisReels } ou null si le coût fournisseur manque.
function margeCommande(prixCentimes, coutCentimes, fraisReelsCentimes = null) {
  if (!Number.isInteger(prixCentimes) || !Number.isInteger(coutCentimes)) return null;
  const fraisReels = Number.isInteger(fraisReelsCentimes);
  const fraisStripeMc = fraisReels ? fraisReelsCentimes * MC : STRIPE_TAUX_PM * prixCentimes + STRIPE_FIXE_CENTIMES * MC;
  const mc = prixCentimes * MC - coutCentimes * MC - fraisStripeMc
    - COTISATIONS_PM * prixCentimes - PROVISION_PM * prixCentimes
    - (LIVRAISON_CENTIMES + EMBALLAGE_CENTIMES + ECO_CENTIMES) * MC;
  return { millicentimes: mc, centimes: arrondiCentimes(mc), fraisStripeMc, fraisReels };
}
function niveauMarge(c) { return c >= OBJECTIF_CENTIMES ? "objectif" : c >= PLANCHER_CENTIMES ? "plancher" : "sous-plancher"; }

// ---------- Lecture tolérante d'un fichier JSON ----------
// { etat: "absent" | "vide" | "invalide" | "ok", donnees, erreur }
function lireJson(fichier) {
  let texte;
  try { texte = fs.readFileSync(fichier, "utf8"); } catch { return { etat: "absent", donnees: null }; }
  texte = texte.replace(/^﻿/, "");
  if (!texte.trim()) return { etat: "vide", donnees: null };
  try { return { etat: "ok", donnees: JSON.parse(texte) }; } catch (e) { return { etat: "invalide", donnees: null, erreur: e.message }; }
}

// ---------- Indicateurs ----------
// lecture : résultat de lireJson ; exemple : true pour le fichier d'exemple (les commandes non marquées
// « exemple » y sont refusées), false pour le vrai fichier (les commandes marquées « exemple » y sont refusées).
function calculerBoutique(lecture, { exemple = false } = {}) {
  const r = {
    exemple, etat: lecture.etat, erreur: lecture.erreur || null, source: null,
    visiteurs: null, commandes: [], ignorees: [],
    nbPayees: 0, nbRemboursees: 0, ventesCentimes: 0, margeCentimes: null, margeMoyenneCentimes: null,
    nbMargeCalculee: 0, nbIncalculables: 0, nbFraisReels: 0, tauxConversion: null,
    sousPlancher: 0, entrePlancherEtObjectif: 0, objectifAtteint: 0, mention: MENTION,
    seuils: { plancherCentimes: PLANCHER_CENTIMES, objectifCentimes: OBJECTIF_CENTIMES }
  };
  if (lecture.etat !== "ok") return r;
  const d = lecture.donnees;
  if (!d || typeof d !== "object" || Array.isArray(d) || (d.commandes !== undefined && !Array.isArray(d.commandes))) {
    r.etat = "invalide"; r.erreur = "format inattendu : un objet avec une liste « commandes » est attendu"; return r;
  }
  r.source = typeof d.source === "string" ? d.source : null;
  if (!exemple && d.exemple === true) { r.etat = "invalide"; r.erreur = "ce fichier est marqué « exemple » : ses chiffres ne sont pas comptés comme réels"; return r; }
  r.visiteurs = Number.isInteger(d.visiteurs) && d.visiteurs >= 0 ? d.visiteurs : null;
  const liste = d.commandes || [];
  if (!liste.length) { r.etat = "vide"; return r; }

  let margeMc = 0;
  liste.forEach((c, i) => {
    const ref = c && typeof c.reference === "string" ? c.reference : `ligne ${i + 1}`;
    const refus = raison => r.ignorees.push({ reference: ref, raison });
    if (!c || typeof c !== "object") return refus("ligne illisible");
    if (!exemple && c.exemple === true) return refus("commande marquée « exemple » dans le fichier réel");
    if (exemple && c.exemple !== true) return refus("commande non marquée « exemple »");
    if (c.statut !== "payee" && c.statut !== "remboursee") return refus(`statut inconnu « ${c.statut} »`);
    if (!estNombre(c.montant_ttc) || c.montant_ttc < 0) return refus("montant TTC absent ou invalide");
    if (c.cout_fournisseur !== null && c.cout_fournisseur !== undefined && !estNombre(c.cout_fournisseur)) return refus("coût fournisseur invalide");
    if (c.frais_stripe_reels !== null && c.frais_stripe_reels !== undefined && !estNombre(c.frais_stripe_reels)) return refus("frais Stripe réels invalides");
    const ligne = {
      reference: ref, date: typeof c.date === "string" ? c.date : "", produit: typeof c.produit === "string" ? c.produit : "",
      quantite: Number.isInteger(c.quantite) ? c.quantite : null, statut: c.statut, montantCentimes: centimes(c.montant_ttc),
      margeCentimes: null, fraisStripeCentimes: null, fraisReels: false, niveau: null, note: ""
    };
    if (c.statut === "remboursee") {
      r.nbRemboursees++;
      ligne.note = "remboursée : comptée 0 en ventes et hors marge";
    } else {
      r.nbPayees++;
      r.ventesCentimes += ligne.montantCentimes;
      const cout = estNombre(c.cout_fournisseur) ? centimes(c.cout_fournisseur) : null;
      const frais = estNombre(c.frais_stripe_reels) ? centimes(c.frais_stripe_reels) : null;
      const m = cout === null ? null : margeCommande(ligne.montantCentimes, cout, frais);
      if (!m) {
        r.nbIncalculables++;
        ligne.note = "marge incalculable : coût fournisseur inconnu";
      } else {
        margeMc += m.millicentimes;
        r.nbMargeCalculee++;
        if (m.fraisReels) r.nbFraisReels++;
        ligne.margeCentimes = m.centimes;
        ligne.fraisStripeCentimes = arrondiCentimes(m.fraisStripeMc);
        ligne.fraisReels = m.fraisReels;
        ligne.niveau = niveauMarge(m.centimes);
        if (ligne.niveau === "objectif") r.objectifAtteint++; else if (ligne.niveau === "plancher") r.entrePlancherEtObjectif++; else r.sousPlancher++;
        ligne.note = m.fraisReels ? "frais Stripe réels" : "frais Stripe estimés (1,5 % + 0,25 €)";
      }
    }
    r.commandes.push(ligne);
  });
  if (r.nbMargeCalculee) {
    r.margeCentimes = arrondiCentimes(margeMc);
    r.margeMoyenneCentimes = arrondiCentimes(Math.round(margeMc / r.nbMargeCalculee));
  }
  if (r.visiteurs) r.tauxConversion = r.nbPayees / r.visiteurs;
  if (!r.commandes.length) r.etat = "vide";
  return r;
}

function lireModules(lecture) {
  const r = { etat: lecture.etat, erreur: lecture.erreur || null, modules: [], ignores: 0 };
  if (lecture.etat !== "ok") return r;
  const d = lecture.donnees;
  if (!d || typeof d !== "object" || !Array.isArray(d.modules)) { r.etat = "invalide"; r.erreur = "format inattendu : une liste « modules » est attendue"; return r; }
  for (const m of d.modules) {
    if (!m || typeof m !== "object" || typeof m.nom !== "string" || !m.nom.trim()) { r.ignores++; continue; }
    const etat = m.etat === "actif" ? "actif" : m.etat === "a-venir" ? "a-venir" : "inconnu";
    r.modules.push({
      id: typeof m.id === "string" ? m.id : "", nom: m.nom, etat,
      libelle: etat === "actif" ? "Actif" : etat === "a-venir" ? "À venir" : "État non renseigné",
      description: typeof m.description === "string" ? m.description : "",
      preuve: typeof m.preuve === "string" ? m.preuve : ""
    });
  }
  if (!r.modules.length) r.etat = "vide";
  return r;
}

function donneesBoutique(dossier) {
  return {
    reel: calculerBoutique(lireJson(path.join(dossier, "commandes.json")), { exemple: false }),
    exemple: calculerBoutique(lireJson(path.join(dossier, "commandes.exemple.json")), { exemple: true })
  };
}
function donneesModules(dossier) { return lireModules(lireJson(path.join(dossier, "modules.json"))); }

// ---------------------------------------------------------------------------
// Rendu HTML (serveur) : aucun script, tout le texte est échappé.
// ---------------------------------------------------------------------------
function echapper(t) {
  return String(t).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function pourcent(x) { return (Math.round(x * 1000) / 10).toFixed(1).replace(".", ",") + " %"; }

function gabarit(titre, actif, sousTitre, corps) {
  const lien = (href, nom) => `<a href="${href}"${href === actif ? ' aria-current="page"' : ""}>${nom}</a>`;
  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${echapper(titre)}</title>
<link rel="stylesheet" href="/qg.css">
<link rel="stylesheet" href="/boutique.css">
</head><body>
<div class="page">
  <header class="tete">
    <div>
      <h1>${titre === "Boutique" ? "Boutique <em>en chiffres</em>" : "Modules <em>de l'admin</em>"}</h1>
      <p>${sousTitre}</p>
    </div>
    <div class="outils-tete">
      <nav class="onglets" aria-label="Pages du tableau de bord">${lien("/", "QG")}${lien("/studio", "Studio")}${lien("/boutique", "Boutique")}${lien("/modules", "Modules")}</nav>
    </div>
  </header>
${corps}
</div>
</body></html>
`;
}

const MOTS_ETAT = {
  absent: "Fichier absent",
  invalide: "Fichier illisible",
  vide: "Aucune commande importée pour l'instant"
};

function messageEtat(r, nomFichier) {
  if (r.etat === "absent") return `<p class="vide-boutique"><strong>Aucune commande importée pour l'instant.</strong> Le fichier <code>${nomFichier}</code> n'existe pas encore.</p>`;
  if (r.etat === "invalide") return `<p class="vide-boutique alerte"><strong>Fichier illisible : aucun chiffre affiché.</strong> <code>${nomFichier}</code> : ${echapper(r.erreur || "JSON invalide")}.</p>`;
  return `<p class="vide-boutique"><strong>Aucune commande importée pour l'instant.</strong> <code>${nomFichier}</code> ne contient aucune commande. Les indicateurs s'afficheront après l'import d'un export Stripe.</p>`;
}

function kpis(r) {
  const ex = r.exemple ? '<span class="tag-exemple">exemple</span>' : "";
  const tuile = (etiq, valeur, sous, classe = "") => `<div class="panneau kpi ${classe}"><div class="etiq">${etiq}${ex}</div><div class="v">${valeur}</div><div class="s">${sous}</div></div>`;
  const visiteurs = r.visiteurs === null
    ? tuile("Visiteurs", "Non mesuré", "aucun outil de mesure installé", "non-mesure")
    : tuile("Visiteurs", String(r.visiteurs), "champ « visiteurs » du fichier");
  const conversion = r.tauxConversion === null
    ? tuile("Taux de conversion", "—", r.visiteurs === null ? "impossible sans mesure des visiteurs" : "aucun visiteur compté", "non-mesure")
    : tuile("Taux de conversion", pourcent(r.tauxConversion), "commandes payées / visiteurs");
  const marge = r.margeCentimes === null
    ? tuile("Marge nette réelle", "—", `${r.nbIncalculables} commande(s) incalculable(s)`, "non-mesure")
    : tuile("Marge nette réelle", euros(r.margeCentimes), `sur ${r.nbMargeCalculee} commande(s) ; ${r.nbIncalculables} incalculable(s) exclue(s)`);
  return `<section class="kpis kpis-boutique" aria-label="Indicateurs${r.exemple ? " d'exemple" : ""}">
    ${tuile("Ventes TTC", euros(r.ventesCentimes), "commandes payées ; remboursées comptées 0")}
    ${tuile("Commandes", `${r.nbPayees} · ${r.nbRemboursees}`, "payée(s) · remboursée(s)")}
    ${visiteurs}
    ${conversion}
    ${marge}
  </section>`;
}

function seuils(r) {
  const ex = r.exemple ? " (exemple)" : "";
  const moyenne = r.margeMoyenneCentimes === null ? "—" : euros(r.margeMoyenneCentimes);
  return `<div class="seuils">
    <span>Marge moyenne par commande${ex} : <b>${moyenne}</b></span>
    <span>Plancher <b>10,00 €</b> · objectif <b>15,00 €</b> par commande</span>
    <span class="niv objectif">${r.objectifAtteint} à l'objectif</span>
    <span class="niv plancher">${r.entrePlancherEtObjectif} entre plancher et objectif</span>
    <span class="niv sous-plancher">${r.sousPlancher} sous le plancher</span>
    <span class="niv incalculable">${r.nbIncalculables} incalculable(s)</span>
    ${r.nbFraisReels ? `<span>${r.nbFraisReels} avec frais Stripe réels (remplacent l'estimation)</span>` : ""}
  </div>`;
}

function tableau(r) {
  const ex = r.exemple ? ' <span class="tag-exemple">exemple</span>' : "";
  const niveau = { objectif: "objectif atteint", plancher: "entre plancher et objectif", "sous-plancher": "sous le plancher" };
  const lignes = r.commandes.map(c => `<tr>
      <td>${echapper(c.reference)}</td><td>${echapper(c.date)}</td><td>${echapper(c.produit)}</td>
      <td class="num">${c.quantite === null ? "—" : c.quantite}</td>
      <td>${c.statut === "payee" ? "payée" : "remboursée"}</td>
      <td class="num">${c.statut === "payee" ? euros(c.montantCentimes) + ex : `<s>${euros(c.montantCentimes)}</s> 0,00 €${ex}`}</td>
      <td class="num">${c.fraisStripeCentimes === null ? "—" : euros(c.fraisStripeCentimes) + (c.fraisReels ? " <small>réels</small>" : " <small>estimés</small>")}</td>
      <td class="num ${c.niveau || "incalculable"}">${c.margeCentimes === null ? (c.statut === "payee" ? "incalculable" : "—") : euros(c.margeCentimes) + ex}</td>
      <td>${echapper(c.niveau ? niveau[c.niveau] + " · " + c.note : c.note)}</td>
    </tr>`).join("\n");
  const ignorees = r.ignorees.length
    ? `<p class="ignorees">${r.ignorees.length} ligne(s) ignorée(s), non comptée(s) : ${r.ignorees.map(i => `${echapper(i.reference)} (${echapper(i.raison)})`).join(" ; ")}.</p>` : "";
  return `<div class="table-defile"><table class="commandes">
    <caption>Commandes${r.exemple ? " d'exemple" : ""}, une ligne par commande</caption>
    <thead><tr><th scope="col">Référence</th><th scope="col">Date</th><th scope="col">Produit</th><th scope="col">Qté</th><th scope="col">Statut</th><th scope="col">Montant TTC</th><th scope="col">Frais Stripe</th><th scope="col">Marge nette</th><th scope="col">Note</th></tr></thead>
    <tbody>${lignes}</tbody>
  </table></div>${ignorees}`;
}

function section(r, nomFichier) {
  if (r.etat !== "ok") return messageEtat(r, nomFichier) + (r.ignorees.length ? `<p class="ignorees">${r.ignorees.length} ligne(s) ignorée(s) : ${r.ignorees.map(i => `${echapper(i.reference)} (${echapper(i.raison)})`).join(" ; ")}.</p>` : "");
  return kpis(r) + seuils(r) + tableau(r);
}

function renduBoutique(donnees) {
  const { reel, exemple } = donnees;
  const source = reel.source ? ` · ${echapper(reel.source)}` : "";
  const corps = `
  <p class="mention-verif" role="note"><strong>À VÉRIFIER.</strong> ${MENTION} Marge par commande = prix TTC − coût fournisseur − frais Stripe (1,5 % + 0,25 €, ou frais réels s'ils sont fournis) − cotisations 12,3 % − provision retours 5 % − livraison 0 € − emballage 0 € − éco-participation 0 € (même formule que <code>tools/calcul_marge.py</code>).</p>

  <section class="panneau bloc-reel" aria-labelledby="titre-reel">
    <div class="tete-bloc"><h2 id="titre-reel">Chiffres réels</h2><p class="source-bloc">data/commandes.json${source}</p></div>
    ${section(reel, "data/commandes.json")}
  </section>

  <section class="panneau bloc-exemple" aria-labelledby="titre-exemple">
    <div class="tete-bloc"><h2 id="titre-exemple"><span class="tag-exemple">exemple</span> Données fictives, jamais additionnées aux chiffres réels</h2><p class="source-bloc">data/commandes.exemple.json</p></div>
    <p class="avert-exemple">Cette section montre à quoi ressembleront les indicateurs. Aucun de ces chiffres n'est une vente.</p>
    ${section(exemple, "data/commandes.exemple.json")}
  </section>

  <p class="note-bas">Page en lecture seule. Les chiffres réels viennent uniquement de data/commandes.json (import manuel d'un export Stripe). Rien n'est écrit, envoyé ni payé depuis cette page. <a href="/modules">Voir les modules de l'admin</a>.</p>`;
  return gabarit("Boutique", "/boutique", "Ventes, commandes et marge nette réelle de la boutique, lues dans data/.", corps);
}

function renduModules(r) {
  let liste;
  if (r.etat === "absent") liste = `<p class="vide-boutique"><strong>Aucun module listé pour l'instant.</strong> Le fichier <code>data/modules.json</code> n'existe pas encore.</p>`;
  else if (r.etat === "invalide") liste = `<p class="vide-boutique alerte"><strong>Fichier illisible.</strong> <code>data/modules.json</code> : ${echapper(r.erreur || "JSON invalide")}.</p>`;
  else if (r.etat === "vide") liste = `<p class="vide-boutique"><strong>Aucun module listé pour l'instant.</strong> <code>data/modules.json</code> ne contient aucun module.</p>`;
  else liste = `<ul class="modules">${r.modules.map(m => `<li class="panneau module ${m.etat}">
      <div class="module-tete"><h2>${echapper(m.nom)}</h2><span class="etat-module ${m.etat}">${m.libelle}</span></div>
      <p>${echapper(m.description)}</p>
      ${m.preuve ? `<p class="preuve">Preuve : ${echapper(m.preuve)}</p>` : ""}
    </li>`).join("\n")}</ul>`;
  const actifs = r.modules.filter(m => m.etat === "actif").length;
  const compte = r.etat === "ok" ? `<p class="compte-modules">${actifs} actif(s), ${r.modules.length - actifs} à venir ou non renseigné(s).${r.ignores ? ` ${r.ignores} entrée(s) sans nom ignorée(s).` : ""}</p>` : "";
  const corps = `
  <section class="panneau" aria-label="Liste des modules">
    <div class="etiq">Modules <b>data/modules.json</b></div>
    ${compte}
    ${liste}
  </section>
  <p class="note-bas">Liste lue dans data/modules.json, affichée telle quelle. <a href="/boutique">Retour à la boutique</a>.</p>`;
  return gabarit("Modules", "/modules", "Ce que l'admin sait faire aujourd'hui, et ce qui n'existe pas encore.", corps);
}

module.exports = {
  STRIPE_TAUX_PM, STRIPE_FIXE_CENTIMES, COTISATIONS_PM, PROVISION_PM, PLANCHER_CENTIMES, OBJECTIF_CENTIMES, MENTION, MOTS_ETAT,
  centimes, arrondiCentimes, euros, margeCommande, niveauMarge, lireJson, calculerBoutique, lireModules,
  donneesBoutique, donneesModules, echapper, renduBoutique, renduModules
};
