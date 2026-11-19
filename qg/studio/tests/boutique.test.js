// V1-3 et V1-4 : indicateurs de /boutique et liste de /modules.
// Données en mémoire et dossiers temporaires (os.tmpdir) seulement : les vrais data/ et outputs/ ne sont jamais lus ni écrits.
"use strict";
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const http = require("node:http");
const { spawn, execFileSync } = require("node:child_process");
const b = require("../boutique.js");

const RACINE = path.resolve(__dirname, "..", "..", "..");
const ok = donnees => ({ etat: "ok", donnees });
const cmd = (o = {}) => ({ reference: "R1", date: "2099-01-01", produit: "Produit test", quantite: 1, montant_ttc: 40, cout_fournisseur: 10, frais_stripe_reels: null, statut: "payee", ...o });

function dossierTemp() { return fs.mkdtempSync(path.join(os.tmpdir(), "qg-boutique-test-")); }

test("lecture tolérante : fichier absent, vide, JSON invalide", () => {
  const d = dossierTemp();
  try {
    assert.strictEqual(b.lireJson(path.join(d, "commandes.json")).etat, "absent");
    fs.writeFileSync(path.join(d, "vide.json"), "  \n");
    assert.strictEqual(b.lireJson(path.join(d, "vide.json")).etat, "vide");
    fs.writeFileSync(path.join(d, "casse.json"), "{ commandes: [");
    assert.strictEqual(b.lireJson(path.join(d, "casse.json")).etat, "invalide");
    fs.writeFileSync(path.join(d, "bom.json"), "﻿{\"commandes\":[]}");
    assert.strictEqual(b.lireJson(path.join(d, "bom.json")).etat, "ok");
    const r = b.donneesBoutique(d);
    assert.strictEqual(r.reel.etat, "absent");
    assert.strictEqual(r.exemple.etat, "absent");
    const page = b.renduBoutique(r);
    assert.match(page, /Aucune commande importée pour l'instant/);
    assert.doesNotMatch(page, /0,00 €/, "aucun zéro présenté comme une performance");
  } finally { fs.rmSync(d, { recursive: true, force: true }); }
});

test("fichier sans commande : « Aucune commande importée », pas de zéro trompeur", () => {
  const r = b.calculerBoutique(ok({ source: "export Stripe", visiteurs: null, commandes: [] }));
  assert.strictEqual(r.etat, "vide");
  const page = b.renduBoutique({ reel: r, exemple: b.calculerBoutique({ etat: "absent" }, { exemple: true }) });
  assert.match(page, /Aucune commande importée pour l'instant/);
  assert.doesNotMatch(page, /Ventes TTC/);
  const casse = b.calculerBoutique({ etat: "invalide", erreur: "Unexpected token" });
  assert.match(b.renduBoutique({ reel: casse, exemple: casse }), /Fichier illisible/);
  assert.strictEqual(b.calculerBoutique(ok([1, 2])).etat, "invalide", "un tableau à la racine est refusé");
});

test("payées et remboursées : la remboursée compte 0 en ventes et sort de la marge", () => {
  const r = b.calculerBoutique(ok({ visiteurs: null, commandes: [
    cmd({ reference: "A", montant_ttc: 40, cout_fournisseur: 10 }),
    cmd({ reference: "B", montant_ttc: 29.9, cout_fournisseur: 5 }),
    cmd({ reference: "C", montant_ttc: 50, cout_fournisseur: 10, statut: "remboursee" })
  ] }));
  assert.strictEqual(r.etat, "ok");
  assert.strictEqual(r.nbPayees, 2);
  assert.strictEqual(r.nbRemboursees, 1);
  assert.strictEqual(r.ventesCentimes, 6990);
  // A : 40 - 10 - (0,60 + 0,25) - 4,92 - 2 = 22,23 ; B : 29,90 - 5 - (0,4485 + 0,25) - 3,6777 - 1,495 = 19,0288
  assert.strictEqual(r.commandes[0].margeCentimes, 2223);
  assert.strictEqual(r.commandes[1].margeCentimes, 1903);
  assert.strictEqual(r.margeCentimes, 4126, "total calculé avant arrondi : 22,23 + 19,0288 = 41,2588");
  assert.strictEqual(r.commandes[2].margeCentimes, null);
  assert.strictEqual(r.objectifAtteint, 2);
});

test("coût fournisseur null : marge incalculable, exclue du total, compteur visible", () => {
  const r = b.calculerBoutique(ok({ visiteurs: null, commandes: [
    cmd({ reference: "A", montant_ttc: 40, cout_fournisseur: 10 }),
    cmd({ reference: "B", montant_ttc: 40, cout_fournisseur: null })
  ] }));
  assert.strictEqual(r.ventesCentimes, 8000, "la vente compte quand même");
  assert.strictEqual(r.nbIncalculables, 1);
  assert.strictEqual(r.nbMargeCalculee, 1);
  assert.strictEqual(r.margeCentimes, 2223);
  const page = b.renduBoutique({ reel: r, exemple: b.calculerBoutique({ etat: "absent" }, { exemple: true }) });
  assert.match(page, /1 incalculable\(s\) exclue\(s\)/);
  assert.match(page, /incalculable/);
  const seule = b.calculerBoutique(ok({ commandes: [cmd({ cout_fournisseur: null })] }));
  assert.strictEqual(seule.margeCentimes, null, "aucune marge inventée quand aucun coût n'est connu");
});

test("frais Stripe réels : remplacent l'estimation et sont signalés", () => {
  const r = b.calculerBoutique(ok({ commandes: [cmd({ montant_ttc: 40, cout_fournisseur: 10, frais_stripe_reels: 1.2 })] }));
  // 40 - 10 - 1,20 - 4,92 - 2 = 21,88
  assert.strictEqual(r.commandes[0].margeCentimes, 2188);
  assert.strictEqual(r.commandes[0].fraisReels, true);
  assert.strictEqual(r.nbFraisReels, 1);
  assert.match(r.commandes[0].note, /frais Stripe réels/);
  const page = b.renduBoutique({ reel: r, exemple: b.calculerBoutique({ etat: "absent" }, { exemple: true }) });
  assert.match(page, /remplacent l'estimation/);
  assert.match(page, /Frais Stripe et éco-participation À VÉRIFIER/);
  assert.match(page, /Plancher <b>10,00 €<\/b> · objectif <b>15,00 €<\/b>/);
});

test("seuils par commande : plancher 10 €, objectif 15 €", () => {
  assert.strictEqual(b.niveauMarge(1500), "objectif");
  assert.strictEqual(b.niveauMarge(1499), "plancher");
  assert.strictEqual(b.niveauMarge(1000), "plancher");
  assert.strictEqual(b.niveauMarge(999), "sous-plancher");
  assert.strictEqual(b.niveauMarge(-50), "sous-plancher");
});

test("visiteurs null : « Non mesuré », pas de taux de conversion ; visiteurs connus : taux calculé", () => {
  const sans = b.calculerBoutique(ok({ visiteurs: null, commandes: [cmd()] }));
  assert.strictEqual(sans.tauxConversion, null);
  const page = b.renduBoutique({ reel: sans, exemple: b.calculerBoutique({ etat: "absent" }, { exemple: true }) });
  assert.match(page, /Non mesuré/);
  assert.match(page, /aucun outil de mesure installé/);
  const avec = b.calculerBoutique(ok({ visiteurs: 200, commandes: [cmd(), cmd({ reference: "R2", statut: "remboursee" })] }));
  assert.strictEqual(avec.tauxConversion, 1 / 200);
  assert.match(b.renduBoutique({ reel: avec, exemple: sans }), /0,5 %/);
});

test("séparation exemple / réel : jamais additionnés, chaque chiffre d'exemple étiqueté", () => {
  const d = dossierTemp();
  try {
    fs.writeFileSync(path.join(d, "commandes.json"), JSON.stringify({ source: "test", visiteurs: null, commandes: [cmd({ montant_ttc: 40 })] }));
    fs.writeFileSync(path.join(d, "commandes.exemple.json"), JSON.stringify({ exemple: true, source: "exemple", visiteurs: 1000, commandes: [
      cmd({ reference: "EX-1", montant_ttc: 100, exemple: true }), cmd({ reference: "EX-2", montant_ttc: 60, exemple: true })
    ] }));
    const r = b.donneesBoutique(d);
    assert.strictEqual(r.reel.ventesCentimes, 4000, "le réel ne contient que commandes.json");
    assert.strictEqual(r.exemple.ventesCentimes, 16000);
    assert.strictEqual(r.reel.exemple, false);
    assert.strictEqual(r.exemple.exemple, true);
    const page = b.renduBoutique(r);
    const [reel, exemple] = page.split('class="panneau bloc-exemple"');
    assert.doesNotMatch(reel, /200,00|160,00/, "aucune somme réel + exemple");
    assert.doesNotMatch(reel, /tag-exemple/);
    assert.match(exemple, /exemple<\/span> Données fictives, jamais additionnées aux chiffres réels/);
    const tuiles = exemple.match(/<div class="panneau kpi[^"]*"><div class="etiq">[^<]*<span class="tag-exemple">exemple<\/span>/g) || [];
    assert.strictEqual(tuiles.length, 5, "les 5 indicateurs d'exemple portent l'étiquette");
    assert.match(exemple, /160,00 €/);
  } finally { fs.rmSync(d, { recursive: true, force: true }); }
});

test("garde-fous : commande d'exemple dans le vrai fichier refusée, lignes invalides ignorées et comptées", () => {
  const r = b.calculerBoutique(ok({ commandes: [
    cmd({ reference: "OK" }), cmd({ reference: "EX", exemple: true }), cmd({ reference: "S", statut: "en-cours" }),
    cmd({ reference: "M", montant_ttc: "40" }), null
  ] }));
  assert.strictEqual(r.nbPayees, 1);
  assert.strictEqual(r.ignorees.length, 4);
  assert.strictEqual(b.calculerBoutique(ok({ exemple: true, commandes: [cmd()] })).etat, "invalide", "un fichier réel marqué exemple n'est pas compté");
  const ex = b.calculerBoutique(ok({ exemple: true, commandes: [cmd({ exemple: true }), cmd({ reference: "VRAI" })] }), { exemple: true });
  assert.strictEqual(ex.nbPayees, 1, "le fichier d'exemple n'accepte que des commandes marquées exemple");
  const page = b.renduBoutique({ reel: b.calculerBoutique(ok({ commandes: [cmd({ produit: "<script>x</script>" })] })), exemple: ex });
  assert.doesNotMatch(page, /<script>x/, "texte échappé");
});

test("arrondis en centimes exacts (pas d'erreur de virgule flottante)", () => {
  assert.strictEqual(b.centimes(0.1 + 0.2), 30);
  assert.strictEqual(b.centimes(29.9), 2990);
  assert.strictEqual(b.centimes(1.005), 101);
  assert.strictEqual(b.arrondiCentimes(1500), 2);
  assert.strictEqual(b.arrondiCentimes(-1500), -2, "demi vers l'extérieur, comme ROUND_HALF_UP");
  assert.strictEqual(b.euros(123456), "1 234,56 €");
  assert.strictEqual(b.euros(-5), "-0,05 €");
});

test("parité avec tools/calcul_marge.py (ignoré si py est absent)", t => {
  const cas = [[40, 10], [29.9, 5], [19.9, 12.35], [9.9, 0], [149.9, 63.17], [5, 9.99], [24.9, 7.77]];
  let py;
  const script = [
    "import sys, json; sys.path.insert(0, 'tools'); import calcul_marge as m",
    "from decimal import Decimal, ROUND_HALF_UP",
    "p = m.parametres()",
    "cas = json.loads(sys.argv[1])",
    "print(json.dumps([int((m.marge_nette(Decimal(str(a)), Decimal(str(c)), p) * 100).quantize(Decimal('1'), rounding=ROUND_HALF_UP)) for a, c in cas]))"
  ].join("\n");
  try {
    py = execFileSync("py", ["-c", script, JSON.stringify(cas)], { cwd: RACINE, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: 30000 });
  } catch (e) {
    if (e.code === "ENOENT") return t.skip("py introuvable : test de parité ignoré");
    throw e;
  }
  const attendu = JSON.parse(py.trim());
  const obtenu = cas.map(([a, c]) => b.margeCommande(b.centimes(a), b.centimes(c)).centimes);
  assert.deepStrictEqual(obtenu, attendu);
});

test("modules : Actif / À venir, description telle quelle, fichier absent ou invalide", () => {
  const r = b.lireModules(ok({ modules: [
    { id: "boutique", nom: "Tableau de la boutique", etat: "actif", description: "Ventes et marge lues dans data/.", preuve: "qg/studio/boutique.js" },
    { id: "avis", nom: "Avis clients", etat: "a-venir", description: "Pas encore construit.", preuve: "" },
    { id: "x", etat: "actif" }
  ] }));
  assert.strictEqual(r.modules.length, 2);
  assert.strictEqual(r.ignores, 1);
  assert.deepStrictEqual(r.modules.map(m => m.libelle), ["Actif", "À venir"]);
  const page = b.renduModules(r);
  assert.match(page, />Actif</);
  assert.match(page, />À venir</);
  assert.match(page, /Ventes et marge lues dans data\/\./);
  assert.match(page, /href="\/boutique"/);
  assert.match(b.renduModules(b.lireModules({ etat: "absent" })), /Aucun module listé/);
  assert.match(b.renduModules(b.lireModules({ etat: "invalide", erreur: "x" })), /Fichier illisible/);
  assert.strictEqual(b.lireModules(ok({ modules: [] })).etat, "vide");
  assert.strictEqual(b.lireModules(ok({})).etat, "invalide");
});

// ---------- Routes HTTP, serveur lancé sur un dossier de données temporaire ----------
const PORT = 4193;
const ORIGINE = `http://127.0.0.1:${PORT}`;
function obtenir(chemin) {
  return new Promise((res, rej) => {
    http.get(ORIGINE + chemin, rep => { let d = ""; rep.on("data", c => d += c); rep.on("end", () => res({ code: rep.statusCode, type: rep.headers["content-type"], corps: d })); }).on("error", rej);
  });
}

test("routes /boutique, /api/boutique, /modules, /api/modules (STUDIO_DATA temporaire)", async () => {
  const tmp = dossierTemp();
  const data = path.join(tmp, "data");
  fs.mkdirSync(data);
  fs.writeFileSync(path.join(data, "commandes.json"), JSON.stringify({ source: "test", visiteurs: null, commandes: [] }));
  fs.writeFileSync(path.join(data, "modules.json"), JSON.stringify({ modules: [{ id: "m", nom: "Module test", etat: "a-venir", description: "Description test.", preuve: "" }] }));
  const vide = path.join(tmp, "vide");
  [vide, path.join(tmp, "outputs"), path.join(tmp, "coordination"), path.join(tmp, "agents")].forEach(d => fs.mkdirSync(d));
  const serveur = spawn(process.execPath, [path.join(__dirname, "..", "serveur.js")], {
    env: { ...process.env, STUDIO_PORT: String(PORT), STUDIO_DATA: data, STUDIO_RACINE: tmp, STUDIO_JOURNAL: path.join(tmp, "journal.jsonl"),
      STUDIO_OUTPUTS: path.join(tmp, "outputs"), STUDIO_COORDINATION: path.join(tmp, "coordination"), STUDIO_AGENTS: path.join(tmp, "agents"),
      STUDIO_CALENDRIER: path.join(tmp, "calendrier.md"), STUDIO_MEDIAS: path.join(tmp, "medias") },
    stdio: ["ignore", "pipe", "pipe"]
  });
  try {
    await new Promise((res, rej) => {
      serveur.stdout.on("data", d => { if (String(d).includes("QG en direct")) res(); });
      serveur.on("exit", c => rej(new Error("serveur arrêté : " + c)));
      setTimeout(() => rej(new Error("serveur non démarré")), 10000);
    });
    const page = await obtenir("/boutique");
    assert.strictEqual(page.code, 200);
    assert.match(page.type, /text\/html/);
    assert.match(page.corps, /Aucune commande importée pour l'instant/);
    assert.match(page.corps, /href="\/modules"/);
    assert.doesNotMatch(page.corps, /<script/, "page sans script");
    const api = JSON.parse((await obtenir("/api/boutique")).corps);
    assert.strictEqual(api.reel.etat, "vide");
    assert.strictEqual(api.exemple.etat, "absent");
    const mod = await obtenir("/modules");
    assert.match(mod.corps, /Module test/);
    assert.match(mod.corps, /À venir/);
    assert.strictEqual(JSON.parse((await obtenir("/api/modules")).corps).modules[0].libelle, "À venir");
    const qg = await obtenir("/");
    assert.match(qg.corps, /<a href="\/boutique">Boutique<\/a>/, "lien depuis la page QG");
  } finally {
    serveur.kill();
    await new Promise(r => serveur.exitCode !== null ? r() : serveur.once("exit", r));
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
