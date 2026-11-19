// V1-3 et V1-4 : calcul de la boutique (concordance avec tools/calcul_marge.py), séparation exemple/réel,
// fichiers vide, absent ou invalide, API et pages /boutique et /modules.
// Toutes les données de test vivent dans un dossier temporaire (STUDIO_DATA) : rien n'est écrit dans data/ ni outputs/.
"use strict";
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const http = require("node:http");
const { spawn, spawnSync } = require("node:child_process");
const b = require("../boutique.js");

const RACINE = path.resolve(__dirname, "..", "..", "..");
const PORT = 4193;
const ORIGINE = `http://127.0.0.1:${PORT}`;
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "qg-boutique-test-"));
const PYTHON = ["py", "python3", "python"].find(c => spawnSync(c, ["--version"], { encoding: "utf8" }).status === 0);

function dossier(nom, commandes, modules) {
  const d = path.join(TMP, nom);
  fs.mkdirSync(d, { recursive: true });
  if (commandes !== undefined) fs.writeFileSync(path.join(d, "commandes.json"), typeof commandes === "string" ? commandes : JSON.stringify(commandes));
  if (modules !== undefined) fs.writeFileSync(path.join(d, "modules.json"), typeof modules === "string" ? modules : JSON.stringify(modules));
  return d;
}
const cmd = (id, montant, statut = "payee", extra = {}) => ({ id, date: "2099-01-01", montant_ttc: montant, frais_stripe: null, cout_produit: 0, cout_port: 0, statut, exemple: false, ...extra });

test.after(() => fs.rmSync(TMP, { recursive: true, force: true }));

// ---------- Calcul ----------
test("marge nette : formule de tools/calcul_marge.py, arrondie au centime", () => {
  // Cotisations 21,2 %. 9,90 € sans coût : 9,90 - (0,1485 + 0,25) - 2,0988 - 0,495 = 6,9077 -> 6,91
  assert.strictEqual(b.margeNette(9.9, 0), 6.91);
  // 29,90 € avec 12,40 € de coût : 29,90 - 12,40 - 0,6985 - 6,3388 - 1,495 = 8,9677 -> 8,97
  assert.strictEqual(b.margeNette(29.9, 12.4), 8.97);
  // Frais Stripe réel : remplace l'estimation. 9,90 - 0,40 - 2,0988 - 0,495 = 6,9062 -> 6,91
  assert.strictEqual(b.margeNette(9.9, 0, b.parametres(), 0.4), 6.91);
  assert.strictEqual(b.margeNette(10, 0, b.parametres(), 0.5), 6.88);   // 10 - 0,50 - 2,12 - 0,50
});

test("concordance avec tools/calcul_marge.py (py)", { skip: PYTHON ? false : "py, python3 ou python absent" }, () => {
  const cas = [[9.9, 0], [4.9, 0], [19.9, 0], [29.9, 12.4], [14.9, 3.75], [1, 2.5], [0.5, 0], [99.9, 41.37], [7.33, 1.11]];
  const variantes = [[false, false], [true, false], [false, true], [true, true]];
  const script = [
    "import sys, json",
    `sys.path.insert(0, ${JSON.stringify(path.join(RACINE, "tools"))})`,
    "import calcul_marge as m",
    "from decimal import Decimal, ROUND_HALF_UP",
    "cas, variantes = json.loads(sys.argv[1]), json.loads(sys.argv[2])",
    "out = []",
    "for fp, vl in variantes:",
    "    p = m.parametres(fp, vl)",
    "    for prix, cout in cas:",
    "        r = m.marge_nette(Decimal(str(prix)), Decimal(str(cout)), p)",
    "        out.append(str(r.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)))",
    "print(json.dumps(out))"
  ].join("\n");
  const r = spawnSync(PYTHON, ["-X", "utf8", "-c", script, JSON.stringify(cas), JSON.stringify(variantes)], { encoding: "utf8" });
  assert.strictEqual(r.status, 0, r.stderr);
  const attendu = JSON.parse(r.stdout).map(Number);
  const obtenu = [];
  for (const [fp, vl] of variantes) for (const [prix, cout] of cas) obtenu.push(b.margeNette(prix, cout, b.parametres(fp, vl)));
  assert.deepStrictEqual(obtenu, attendu);
});

test("totaux : CA, panier moyen, remboursement, frais réel", () => {
  const p = b.parametres();
  const t = b.totaux([cmd("a", 9.9), cmd("b", 19.9, "payee", { frais_stripe: 0.55 }), cmd("c", 9.9, "remboursee")], p);
  assert.strictEqual(t.commandes, 3);
  assert.strictEqual(t.payees, 2);
  assert.strictEqual(t.ca_ttc, 29.8);
  assert.strictEqual(t.panier_moyen, 14.9);
  assert.deepStrictEqual(t.remboursements, { nombre: 1, montant: 9.9 });
  // a : 6,9077 ; b : 19,90 - 0,55 - 4,2188 - 0,995 = 14,1362 ; c (remboursée) : -0,25 => 20,7939 -> 20,79
  assert.strictEqual(t.marge_nette_totale, 20.79);
  assert.strictEqual(t.marge_par_commande, 6.93);  // 20,7939 / 3 = 6,9313 -> 6,93
  // Remboursée avec frais réel connu et coût engagé : - (0,40 + 1,00)
  assert.strictEqual(b.totaux([cmd("d", 9.9, "remboursee", { frais_stripe: 0.4, cout_produit: 1 })], p).marge_nette_totale, -1.4);
});

// ---------- Lecture des fichiers ----------
test("exemple et réel séparés : les exemples ne sont jamais additionnés", () => {
  const d = dossier("separe", { source: "test", importe_le: "2099-01-02", commandes: [cmd("r1", 9.9), cmd("e1", 100, "payee", { exemple: true }), cmd("e2", 50, "remboursee", { exemple: true })] });
  const r = b.lireBoutique(d);
  assert.strictEqual(r.etat, "ok");
  assert.strictEqual(r.reel.commandes, 1);
  assert.strictEqual(r.reel.ca_ttc, 9.9);
  assert.strictEqual(r.reel.marge_nette_totale, 6.91);
  assert.strictEqual(r.exemple.commandes, 2);
  assert.strictEqual(r.exemple.ca_ttc, 100);
  assert.strictEqual(r.source, "test");
});

test("seulement des exemples : vrais chiffres à 0 et message d'import", () => {
  const r = b.lireBoutique(dossier("que-exemples", { source: "test", importe_le: null, commandes: [cmd("e1", 100, "payee", { exemple: true })] }));
  assert.strictEqual(r.etat, "vide");
  assert.strictEqual(r.reel.ca_ttc, 0);
  assert.strictEqual(r.exemple.ca_ttc, 100);
});

test("fichier vide (modèle de data/) : tout à 0, message, visiteurs sans source", () => {
  const r = b.lireBoutique(dossier("vide", { source: "aucune", importe_le: null, commandes: [] }));
  assert.strictEqual(r.etat, "vide");
  assert.strictEqual(r.message, "Aucune commande importée. Import manuel d'un export Stripe prévu plus tard.");
  assert.deepStrictEqual(r.reel, { commandes: 0, payees: 0, ca_ttc: 0, panier_moyen: null, remboursements: { nombre: 0, montant: 0 }, marge_nette_totale: 0, marge_par_commande: null });
  assert.strictEqual(r.exemple, null);
  assert.deepStrictEqual(r.visiteurs, { valeur: null, note: "Aucune source de mesure" });
  assert.ok(r.hypotheses.some(h => h.includes("À VÉRIFIER")));
});

test("data/commandes.vide.json du dépôt : modèle vide versionné", () => {
  const vide = JSON.parse(fs.readFileSync(path.join(RACINE, "data", "commandes.vide.json"), "utf8"));
  assert.deepStrictEqual(vide.commandes, []);
});

test("data/commandes.exemple.json du dépôt : toutes les lignes marquées exemple, jamais lu comme vraies commandes", () => {
  const ex = JSON.parse(fs.readFileSync(path.join(RACINE, "data", "commandes.exemple.json"), "utf8"));
  assert.ok(ex.commandes.length > 0 && ex.commandes.every(c => c.exemple === true));
  // Même placé seul dans un dossier de données, le fichier d'exemple n'est pas lu (seuls commandes.json et commandes.vide.json le sont).
  const d = dossier("exemple-seul");
  fs.copyFileSync(path.join(RACINE, "data", "commandes.exemple.json"), path.join(d, "commandes.exemple.json"));
  assert.strictEqual(b.lireBoutique(d).etat, "absent");
});

test("commandes.json absent (hors Git) : repli sur commandes.vide.json", () => {
  const d = dossier("repli");
  fs.writeFileSync(path.join(d, "commandes.vide.json"), JSON.stringify({ source: "aucune", importe_le: null, commandes: [] }));
  const r = b.lireBoutique(d);
  assert.strictEqual(r.etat, "vide");
  assert.strictEqual(r.fichier, "data/commandes.vide.json");
  // Dès que commandes.json existe, il est prioritaire.
  fs.writeFileSync(path.join(d, "commandes.json"), JSON.stringify({ source: "t", importe_le: null, commandes: [cmd("r1", 9.9)] }));
  assert.strictEqual(b.lireBoutique(d).reel.ca_ttc, 9.9);
});

test("fichier absent ou JSON invalide : message lisible, pas d'exception", () => {
  const absent = b.lireBoutique(dossier("absent"));
  assert.strictEqual(absent.etat, "absent");
  assert.match(absent.message, /introuvable/);
  assert.strictEqual(absent.reel.ca_ttc, 0);
  const invalide = b.lireBoutique(dossier("invalide", "{ pas du json"));
  assert.strictEqual(invalide.etat, "invalide");
  assert.match(invalide.message, /JSON invalide/);
  const malForme = b.lireBoutique(dossier("mal-forme", { source: "x" }));
  assert.strictEqual(malForme.etat, "invalide");
});

test("lignes douteuses : statut inconnu ou montant invalide ignorés et signalés", () => {
  const r = b.lireBoutique(dossier("douteux", { source: "t", importe_le: null, commandes: [cmd("ok", 9.9), cmd("x", 9.9, "en_attente"), cmd("y", "9,90"), { id: "z", montant_ttc: 5, statut: "payee" }] }));
  assert.strictEqual(r.reel.commandes, 2);
  assert.strictEqual(r.avertissements.length, 3);
});

test("modules : badge actif ou à venir, statut inconnu = à venir", () => {
  const r = b.lireModules(dossier("modules", undefined, { modules: [{ id: "a", nom: "A", statut: "actif", description: "x" }, { id: "b", nom: "B", statut: "bientôt" }, { id: "c", nom: "C" }] }));
  assert.deepStrictEqual(r.modules.map(m => m.statut), ["actif", "à venir", "à venir"]);
  assert.strictEqual(b.lireModules(dossier("modules-absent")).etat, "absent");
  assert.strictEqual(b.lireModules(dossier("modules-invalide", undefined, "[")).etat, "invalide");
});

test("data/modules.json du dépôt : cinq modules, statuts honnêtes, aucune date", () => {
  const r = b.lireModules(path.join(RACINE, "data"));
  assert.strictEqual(r.etat, "ok");
  const statuts = Object.fromEntries(r.modules.map(m => [m.id, m.statut]));
  assert.deepStrictEqual(statuts, { paiement: "à venir", avis: "actif", contact: "à venir", "lettre-information": "à venir", sav: "à venir" });
  for (const m of r.modules) assert.ok(!/\b(20\d\d|janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre|bientôt|prochainement)\b/i.test(m.description), m.id);
});

// ---------- Serveur ----------
function obtenir(chemin) {
  return new Promise((res, rej) => {
    http.get(ORIGINE + chemin, rep => { let d = ""; rep.on("data", c => d += c); rep.on("end", () => res({ code: rep.statusCode, type: rep.headers["content-type"], csp: rep.headers["content-security-policy"], corps: d })); }).on("error", rej);
  });
}

test("API et pages sur un serveur lancé avec STUDIO_DATA temporaire", async t => {
  const data = dossier("serveur", { source: "test", importe_le: null, commandes: [cmd("r1", 19.9), cmd("e1", 9.9, "payee", { exemple: true })] },
    { modules: [{ id: "paiement", nom: "Paiement", statut: "à venir", description: "Aucun compte de paiement configuré." }] });
  const vide = path.join(TMP, "vide-serveur"); fs.mkdirSync(vide);
  const serveur = spawn(process.execPath, [path.join(__dirname, "..", "serveur.js")], {
    env: { ...process.env, STUDIO_PORT: String(PORT), STUDIO_DATA: data, STUDIO_JOURNAL: path.join(vide, "j.jsonl"), STUDIO_OUTPUTS: vide, STUDIO_COORDINATION: vide, STUDIO_AGENTS: vide, STUDIO_MEDIAS: vide, STUDIO_CALENDRIER: path.join(vide, "c.md") },
    stdio: ["ignore", "pipe", "pipe"]
  });
  t.after(async () => { serveur.kill(); await new Promise(r => serveur.once("exit", r)); });
  await new Promise((res, rej) => {
    serveur.stdout.on("data", d => { if (String(d).includes("QG en direct")) res(); });
    serveur.on("exit", c => rej(new Error("serveur arrêté : " + c)));
    setTimeout(() => rej(new Error("serveur non démarré")), 10000);
  });

  const api = await obtenir("/api/boutique");
  assert.strictEqual(api.code, 200);
  const d = JSON.parse(api.corps);
  assert.strictEqual(d.reel.ca_ttc, 19.9);
  assert.strictEqual(d.exemple.ca_ttc, 9.9);
  assert.strictEqual(d.visiteurs.valeur, null);

  const mods = JSON.parse((await obtenir("/api/modules")).corps);
  assert.strictEqual(mods.modules[0].statut, "à venir");

  for (const chemin of ["/boutique", "/modules", "/boutique.js", "/modules.js", "/boutique.css"]) {
    const r = await obtenir(chemin);
    assert.strictEqual(r.code, 200, chemin);
    assert.match(r.csp, /script-src 'self'/);
  }
  const page = (await obtenir("/boutique")).corps;
  assert.match(page, /href="\/modules"/);
  assert.match(page, /href="\/"/);
  assert.ok(!/<script>|style="/.test(page), "pas de script en ligne");
  const accueil = (await obtenir("/")).corps;
  assert.match(accueil, /href="\/boutique">Boutique</);
  assert.match(accueil, /href="\/modules">Modules</);
});
