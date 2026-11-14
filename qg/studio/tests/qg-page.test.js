// Test de bout en bout du QG en direct : serveur + page dans Chromium (playwright-core).
// Journal factice, livrables de test, agents de test et de-cowork.md de test, tous dans un dossier temporaire :
// aucun vrai fichier du dépôt n'est lu pour l'état ni modifié (sauf les captures dans outputs/qg/).
"use strict";
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const http = require("node:http");
const { spawn } = require("node:child_process");
const { chromium } = require("playwright-core");

const RACINE = path.resolve(__dirname, "..", "..", "..");
const CAPTURES = path.join(RACINE, "outputs", "qg");
const PORT = 4192;
const ORIGINE = `http://127.0.0.1:${PORT}`;
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "qg-direct-test-"));
const JOURNAL = path.join(TMP, "journal-direct-factice.jsonl");
const OUTPUTS = path.join(TMP, "outputs-test");
const COORDINATION = path.join(TMP, "coordination-test");
const AGENTS = path.join(TMP, "agents-test");
const DE_COWORK = path.join(COORDINATION, "de-cowork.md");
const QUINZE = ["analyste-marche", "architecte-web", "conformite-qa", "createur-contenu", "crm-email", "developpeur-web", "gestion-commandes",
  "media-acquisition", "pilotage-finance", "redacteur-catalogue", "service-client", "sourcing-produits", "studio-video", "studio-visuel", "veille-outils"];
const TOUS = [...QUINZE, "cerveau", "createur-produits-numeriques", "partenariats", "ventes"];   // + 3 agents de l'entreprise (2026-11-14)

function aujourdhui() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }
function heure() { return new Date().toLocaleTimeString("fr-FR", { hour12: false }); }
function ecrire(ev) { fs.appendFileSync(JOURNAL, JSON.stringify({ heure: heure(), cible: "", outil: "", agent: "", ...ev }) + "\n", "utf8"); }
function requete(methode, chemin, corps) {
  return new Promise((res, rej) => {
    const r = http.request(ORIGINE + chemin, { method: methode, headers: { "Content-Type": "application/json", Origin: ORIGINE } }, rep => {
      let d = ""; rep.on("data", c => d += c); rep.on("end", () => res({ code: rep.statusCode, corps: d }));
    });
    r.on("error", rej); if (corps !== undefined) r.write(JSON.stringify(corps)); r.end();
  });
}

const LIV_MARCHE = "2099-01-01-analyste-marche-faux-livrable-test.md";
const CONTENU_MARCHE = "---\nagent: analyste-marche\nstatut: à-valider   # toujours cette valeur\ndate: 2099-01-01\n---\n\n# Faux rapport de marché\n\nstatut: à-valider (corps : ne doit pas changer)\n";
const LIV_QA = "2099-01-02-conformite-qa-faux-livrable-test.md";
const LIV_DEV = `${aujourdhui()}-developpeur-web-faux-livrable-test.md`;
const synchro = (t41, fin = "") => [
  "# Tâches de test", "", "## Synchro n°8 : ancienne", "### T31 · Ancienne · `fait`", "",
  "## Synchro n°9 (test du 2099-01-01) : synchro de test", "",
  "### T40 · Comparer les fournisseurs · `fait`", "Lance `sourcing-produits`.", "",
  `### T41 · Mettre la fiche en ligne en local · \`${t41}\``, "`developpeur-web` intègre la fiche.", "",
  "### T42 · Vidéo de lancement · `bloqué (attente de l'humain : nom de marque à vérifier)`", "`studio-video` attend la décision.", "",
  "## Règle permanente", "Rien.", fin
].join("\n");

let serveur, navigateur;

test.before(async () => {
  fs.mkdirSync(CAPTURES, { recursive: true });
  [OUTPUTS, COORDINATION, AGENTS].forEach(d => fs.mkdirSync(d));
  TOUS.forEach(n => fs.writeFileSync(path.join(AGENTS, n + ".md"), `---\nname: ${n}\ndescription: Agent de test ${n}. Suite.\n---\n`));
  fs.writeFileSync(path.join(OUTPUTS, LIV_MARCHE), CONTENU_MARCHE);
  fs.writeFileSync(path.join(OUTPUTS, LIV_QA), "---\nagent: conformite-qa\nstatut: à-valider # court\ndate: 2099-01-02\n---\n\n# Faux audit\n");
  fs.writeFileSync(path.join(OUTPUTS, LIV_DEV), `---\nagent: developpeur-web\nstatut: validé\ndate: ${aujourdhui()}\n---\n\n# Faux rapport validé\n`);
  fs.writeFileSync(DE_COWORK, synchro("à faire"));
  const ancien = new Date(Date.now() - 3600 * 1000);
  fs.utimesSync(DE_COWORK, ancien, ancien);        // écrit « il y a une heure » : Cowork au repos au démarrage
  fs.writeFileSync(JOURNAL, JSON.stringify({ heure: "09:00:00", type: "UserPromptSubmit", agent: "", outil: "", cible: "", texte: "DEMANDE · /cowork" }) + "\n");
  serveur = spawn(process.execPath, [path.join(__dirname, "..", "serveur.js")], {
    env: { ...process.env, STUDIO_PORT: String(PORT), STUDIO_JOURNAL: JOURNAL, STUDIO_OUTPUTS: OUTPUTS, STUDIO_COORDINATION: COORDINATION, STUDIO_AGENTS: AGENTS },
    stdio: ["ignore", "pipe", "pipe"]
  });
  await new Promise((res, rej) => {
    serveur.stdout.on("data", d => { if (String(d).includes("QG en direct")) res(); });
    serveur.on("exit", c => rej(new Error("serveur arrêté : " + c)));
    setTimeout(() => rej(new Error("serveur non démarré")), 10000);
  });
  navigateur = await chromium.launch();
});

test.after(async () => {
  if (navigateur) await navigateur.close();
  if (serveur) { serveur.kill(); await new Promise(r => serveur.once("exit", r)); }
  fs.rmSync(TMP, { recursive: true, force: true });
});

async function ouvrir(viewport = { width: 1440, height: 1000 }) {
  const page = await navigateur.newPage({ viewport });
  const externes = [];
  page.on("request", r => { if (!r.url().startsWith(ORIGINE) && !r.url().startsWith("data:")) externes.push(r.url()); });
  page.on("dialog", d => { d.dismiss(); throw new Error("boîte de dialogue du navigateur interdite"); });
  await page.goto(ORIGINE + "/");
  await page.waitForSelector("body[data-pret=oui]");
  await page.waitForFunction(() => document.getElementById("nom-synchro").textContent !== "—");
  return { page, externes };
}
const etatDe = (page, id) => page.locator("#membre-" + id).getAttribute("data-etat");

test("QG : 13 pièces, 19 agents, synchro en cours, états tirés des livrables", async () => {
  const { page, externes } = await ouvrir();
  assert.strictEqual(await page.locator(".piece").count(), 13);
  assert.strictEqual(await page.locator('.membre[data-type="agent"]').count(), 19);
  assert.strictEqual(await page.locator("#nb-agents").textContent(), "19 sur 19 installés");
  assert.strictEqual(await etatDe(page, "analyste-marche"), "attend");
  assert.strictEqual(await page.locator("#st-analyste-marche").textContent(), "1 livrable à valider");
  assert.strictEqual(await etatDe(page, "conformite-qa"), "attend");
  assert.strictEqual(await etatDe(page, "developpeur-web"), "repos");
  assert.strictEqual(await etatDe(page, "gestion-commandes"), "pret");
  assert.strictEqual(await etatDe(page, "toi"), "attend");
  assert.strictEqual(await page.locator("#k-ok").textContent(), "2");
  assert.strictEqual(await page.locator("#k-liv").textContent(), "1", "un livrable daté d'aujourd'hui");
  assert.strictEqual(await page.locator("#k-ventes").textContent(), "—");
  // Synchro : la dernière section, ses tâches et leurs statuts.
  assert.strictEqual(await page.locator("#nom-synchro").textContent(), "synchro n°9 · synchro de test");
  assert.deepStrictEqual(await page.locator(".tache").evaluateAll(t => t.map(x => x.dataset.tache + ":" + x.dataset.statut)), ["T40:fait", "T41:afaire", "T42:bloque"]);
  assert.match(await page.locator('.tache[data-tache="T42"]').textContent(), /bloqué[\s\S]*Raison : attente de l'humain : nom de marque à vérifier/);
  assert.match(await page.locator('.tache[data-tache="T41"]').textContent(), /Nils \(developpeur-web\)/);
  assert.strictEqual(await page.locator("button", { hasText: /Publier|Envoyer|Payer|Activer/ }).count(), 0, "aucun bouton qui publie, envoie, paie ou active");
  assert.deepStrictEqual(externes, [], "aucune ressource chargée hors du serveur local");
  await page.close();
});

test("QG : le journal met un agent au travail, la synchro suit de-cowork.md en direct", async () => {
  const { page } = await ouvrir();
  ecrire({ type: "PostToolUse", outil: "Agent", cible: "developpeur-web", agent_id: "id-nils", texte: "Lance l'agent developpeur-web : Tâche T41" });
  ecrire({ type: "PostToolUse", agent: "developpeur-web", agent_id: "id-nils", outil: "Read", texte: "[developpeur-web] Read C:\\depot\\docs\\qg\\BRIEF-QG.md" });
  await page.waitForSelector('#membre-developpeur-web[data-etat="actif"]', { timeout: 5000 });
  assert.strictEqual(await page.locator("#st-developpeur-web").textContent(), "Lit le brief du QG");
  assert.strictEqual(await page.locator("#k-actifs").textContent(), "1");
  assert.strictEqual(await page.locator("#k-pieces").textContent(), "1");
  assert.strictEqual(await page.locator("#pc-D").textContent(), "1 au travail");
  await page.waitForSelector('.tache[data-tache="T41"][data-statut="encours"]', { timeout: 5000 });
  assert.match(await page.locator("#journal").textContent(), /Nils se met au travail \(tâche T41\)/);
  await page.screenshot({ path: path.join(CAPTURES, "qg-direct-au-travail.png"), fullPage: true });

  // Cowork (ou Claude Code) passe la tâche à « fait » : la page suit sans rechargement.
  fs.writeFileSync(DE_COWORK, synchro("fait"));
  await page.waitForSelector('.tache[data-tache="T41"][data-statut="fait"]', { timeout: 8000 });
  assert.match(await page.locator("#compte-synchro").textContent(), /2 faites sur 3 · 1 bloquée/);
  // Nouvelle synchro ajoutée en fin de fichier : elle devient la synchro en cours.
  fs.writeFileSync(DE_COWORK, synchro("fait").replace("## Règle permanente", "## Synchro n°10 : suivante\n### T43 · Nouvelle tâche · `à faire`\nTexte.\n\n## Règle permanente"));
  await page.waitForFunction(() => document.getElementById("nom-synchro").textContent === "synchro n°10 · suivante", null, { timeout: 8000 });

  ecrire({ type: "SubagentStop", agent: "", agent_id: "id-nils", texte: "AGENT TERMINÉ · fini" });
  await page.waitForSelector('#membre-developpeur-web[data-etat="repos"]', { timeout: 5000 });
  assert.strictEqual(await page.locator("#st-developpeur-web").textContent(), "Terminé");
  assert.strictEqual(await page.locator("#k-actifs").textContent(), "0");
  await page.close();
});

test("QG : filtres par pôle et par état", async () => {
  const { page } = await ouvrir();
  const visibles = sel => page.locator(sel + '[data-visible="oui"]').evaluateAll(l => l.map(x => x.id).sort());
  await page.click('#filtres button[data-f="F"]');
  assert.deepStrictEqual(await visibles(".piece"), ["piece-F"]);
  assert.deepStrictEqual(await visibles(".membre"), ["membre-createur-contenu", "membre-piper", "membre-studio-video", "membre-studio-visuel"]);
  assert.strictEqual(await page.locator('#filtres button[data-f="F"]').getAttribute("aria-pressed"), "true");
  await page.click('#filtres button[data-f="attend"]');
  assert.deepStrictEqual(await visibles(".membre"), ["membre-analyste-marche", "membre-conformite-qa", "membre-toi"]);
  assert.deepStrictEqual(await visibles(".piece"), ["piece-A", "piece-B", "piece-J"]);
  await page.screenshot({ path: path.join(CAPTURES, "qg-direct-filtre-a-valider.png"), fullPage: true });
  await page.click('#filtres button[data-f="tous"]');
  assert.strictEqual((await visibles(".piece")).length, 13);
  await page.close();
});

test("QG : Valider ne change que l'en-tête du livrable, chemins hors outputs/ refusés", async () => {
  const { page } = await ouvrir();
  const item = page.locator(`.ok-item[data-fichier="${LIV_MARCHE}"]`);
  assert.match(await item.textContent(), /Margaux · analyste-marche/);
  await item.locator("button", { hasText: "Valider" }).click();
  await item.locator(".confirmer").waitFor();
  assert.strictEqual(fs.readFileSync(path.join(OUTPUTS, LIV_MARCHE), "utf8"), CONTENU_MARCHE, "rien n'est écrit avant la confirmation");
  await item.locator("button", { hasText: "Confirmer la validation" }).click();
  await item.waitFor({ state: "detached" });
  const attendu = CONTENU_MARCHE.replace("statut: à-valider   # toujours cette valeur\n", `statut: validé   # toujours cette valeur\nvalide_par: humain\ndate_validation: ${aujourdhui()}\n`);
  assert.strictEqual(fs.readFileSync(path.join(OUTPUTS, LIV_MARCHE), "utf8"), attendu);
  await page.waitForSelector('#membre-analyste-marche[data-etat="repos"]', { timeout: 5000 });
  assert.strictEqual(await page.locator("#k-ok").textContent(), "1");
  await page.close();
  for (const f of ["../de-cowork.md", "..\\coordination-test\\de-cowork.md", DE_COWORK, "%2e%2e/x.md", "sous/dossier.md"])
    assert.ok([400, 403, 404].includes((await requete("POST", "/api/valider", { fichier: f })).code), `refusé : ${f}`);
  assert.strictEqual(fs.readFileSync(DE_COWORK, "utf8").includes("Synchro n°10"), true, "de-cowork.md intact");
});

test("navigation QG / Studio : l'onglet Studio fonctionne toujours", async () => {
  const { page } = await ouvrir();
  await page.click('nav.onglets a[href="/studio"]');
  await page.waitForURL(ORIGINE + "/studio");
  await page.waitForSelector("body[data-pret=oui]");
  assert.strictEqual(await page.locator("h1").textContent(), "Studio en direct");
  assert.strictEqual(await page.locator(".poste").count(), 8);
  assert.strictEqual(await page.locator('nav.onglets a[aria-current="page"]').textContent(), "Studio");
  assert.strictEqual(await page.locator("#poste-controle").getAttribute("data-etat"), "attend", "même source de livrables que le QG");
  await page.click('nav.onglets a[href="/"]');
  await page.waitForSelector("body[data-pret=oui]");
  assert.strictEqual(await page.locator("h1").textContent(), "QG en direct");
  await page.close();
});

test("QG : mode Simulation, puis captures ordinateur et mobile", async () => {
  const { page } = await ouvrir();
  await page.click("#m-sim");
  await page.waitForSelector('#membre-cowork[data-etat="actif"]', { timeout: 5000 });
  assert.strictEqual(await page.locator("#etat-lien").textContent(), "simulation");
  await page.click("#m-reel");
  await page.waitForFunction(() => document.getElementById("etat-lien").textContent === "en direct");
  await page.waitForSelector("#membre-conformite-qa[data-etat=attend]");
  await page.close();
  for (const [nom, viewport] of [["ordinateur", { width: 1440, height: 1000 }], ["mobile", { width: 390, height: 844 }]]) {
    const { page: p, externes } = await ouvrir(viewport);
    ecrire({ type: "PostToolUse", outil: "Agent", cible: "studio-visuel", agent_id: "id-iris-" + nom, texte: "Lance l'agent studio-visuel : capture" });
    await p.waitForSelector('#membre-studio-visuel[data-etat="actif"]', { timeout: 5000 });
    const largeur = await p.evaluate(() => document.documentElement.scrollWidth);
    assert.ok(largeur <= viewport.width, `pas de défilement horizontal (${largeur} px)`);
    await p.screenshot({ path: path.join(CAPTURES, `qg-direct-${nom}.png`), fullPage: true });
    ecrire({ type: "SubagentStop", agent_id: "id-iris-" + nom, texte: "AGENT TERMINÉ" });
    assert.deepStrictEqual(externes, []);
    await p.close();
  }
});
