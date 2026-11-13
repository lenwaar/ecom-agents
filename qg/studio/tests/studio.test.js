// Test de bout en bout : serveur + page dans Chromium (playwright-core).
// Travaille sur une COPIE du journal et un dossier de livrables de test : aucun vrai livrable n'est modifié.
// Captures écrites dans outputs/qg/.
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
const PORT = 4191;
const ORIGINE = `http://127.0.0.1:${PORT}`;
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "studio-direct-test-"));
const JOURNAL = path.join(TMP, "journal-direct-copie.jsonl");
const OUTPUTS = path.join(TMP, "outputs-test");
const FAUX = "2099-01-01-createur-contenu-faux-livrable-test.md";
const SECRET = path.join(TMP, "hors-outputs.md");
const CONTENU_FAUX = "---\nagent: createur-contenu\nstatut: à-valider   # toujours cette valeur\ndate: 2099-01-01\nsources: [test]\nprochaine-etape: conformite-qa\n---\n\n# Faux livrable de test\n\nCorps du livrable : statut: à-valider (ne doit pas changer).\n";
const CONTENU_SECRET = "---\nagent: test\nstatut: à-valider\n---\n# Hors de outputs\n";

let serveur, navigateur;

function aujourdhui() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }
function heure() { return new Date().toLocaleTimeString("fr-FR", { hour12: false }); }
function ecrire(ev) { fs.appendFileSync(JOURNAL, JSON.stringify({ heure: heure(), cible: "", outil: "", agent: "", ...ev }) + "\n", "utf8"); }
function requete(methode, chemin, corps, entetes = {}) {
  return new Promise((res, rej) => {
    const r = http.request(ORIGINE + chemin, { method: methode, headers: { "Content-Type": "application/json", Origin: ORIGINE, ...entetes } }, rep => {
      let d = ""; rep.on("data", c => d += c); rep.on("end", () => res({ code: rep.statusCode, corps: d }));
    });
    r.on("error", rej); if (corps !== undefined) r.write(typeof corps === "string" ? corps : JSON.stringify(corps)); r.end();
  });
}

test.before(async () => {
  fs.mkdirSync(CAPTURES, { recursive: true });
  fs.mkdirSync(OUTPUTS);
  const vrai = path.join(RACINE, "coordination", "journal-direct.jsonl");
  fs.writeFileSync(JOURNAL, fs.existsSync(vrai) ? fs.readFileSync(vrai) : "");     // copie du journal réel
  fs.writeFileSync(path.join(OUTPUTS, FAUX), CONTENU_FAUX, "utf8");
  fs.writeFileSync(SECRET, CONTENU_SECRET, "utf8");
  serveur = spawn(process.execPath, [path.join(__dirname, "..", "serveur.js")], {
    env: { ...process.env, STUDIO_PORT: String(PORT), STUDIO_JOURNAL: JOURNAL, STUDIO_OUTPUTS: OUTPUTS }, stdio: ["ignore", "pipe", "pipe"]
  });
  await new Promise((res, rej) => {
    serveur.stdout.on("data", d => { if (String(d).includes("Studio en direct")) res(); });
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

test("étape 1 : six événements font passer Théo au travail puis au repos", async () => {
  const page = await navigateur.newPage({ viewport: { width: 1440, height: 1000 } });
  const requetesExternes = [];
  page.on("request", r => { if (!r.url().startsWith(ORIGINE) && !r.url().startsWith("data:")) requetesExternes.push(r.url()); });
  await page.goto(ORIGINE + "/");
  await page.waitForSelector("body[data-pret=oui]");
  const theo = page.locator("#poste-montage");
  const piper = page.locator("#poste-voix");
  assert.notStrictEqual(await theo.getAttribute("data-etat"), "actif");

  ecrire({ type: "UserPromptSubmit", texte: "DEMANDE · Test du studio : produire une vidéo" });
  ecrire({ type: "PostToolUse", outil: "Agent", cible: "studio-video", texte: "Lance l'agent studio-video : montage de test" });
  ecrire({ type: "PostToolUse", agent: "studio-video", outil: "Read", texte: "[studio-video] Read docs/studio/BRIEF-STUDIO.md" });
  await page.waitForSelector('#poste-montage[data-etat="actif"]', { timeout: 5000 });
  assert.match(await page.locator("#st-montage").textContent(), /BRIEF-STUDIO/);
  assert.strictEqual(await page.locator("#k-actifs").textContent(), "1");

  ecrire({ type: "PostToolUse", agent: "studio-video", outil: "Bash", texte: "[studio-video] Bash : piper --model fr_FR-siwis-medium --output_file voix.wav" });
  await page.waitForSelector('#poste-voix[data-etat="actif"]', { timeout: 5000 });
  await page.screenshot({ path: path.join(CAPTURES, "studio-direct-theo-au-travail.png"), fullPage: true });

  ecrire({ type: "PostToolUse", agent: "studio-video", outil: "Write", texte: "[studio-video] Write medias/brouillons/test.mp4" });
  ecrire({ type: "SubagentStop", agent: "studio-video", texte: "AGENT TERMINÉ · vidéo de test rendue" });
  await page.waitForSelector('#poste-montage[data-etat="repos"]', { timeout: 5000 });
  assert.strictEqual(await piper.getAttribute("data-etat"), "repos");
  assert.strictEqual(await page.locator("#st-montage").textContent(), "Terminé");
  assert.match(await page.locator("#journal").textContent(), /Théo · Terminé/);
  await page.screenshot({ path: path.join(CAPTURES, "studio-direct-theo-au-repos.png"), fullPage: true });
  assert.deepStrictEqual(requetesExternes, [], "aucune ressource chargée hors du serveur local");
  await page.close();
});

test("étape 2 : le bouton Valider change seulement l'en-tête du faux livrable", async () => {
  const page = await navigateur.newPage({ viewport: { width: 1440, height: 1000 } });
  page.on("dialog", d => { d.dismiss(); throw new Error("boîte de dialogue du navigateur interdite"); });
  await page.goto(ORIGINE + "/");
  await page.waitForSelector("body[data-pret=oui]");
  const item = page.locator(`.ok-item[data-fichier="${FAUX}"]`);
  await item.waitFor();
  assert.strictEqual(await page.locator("#poste-script").getAttribute("data-etat"), "attend");
  await item.locator("button", { hasText: "Valider" }).click();
  await item.locator(".confirmer").waitFor();
  assert.strictEqual(fs.readFileSync(path.join(OUTPUTS, FAUX), "utf8"), CONTENU_FAUX, "rien n'est écrit avant la confirmation");
  await page.screenshot({ path: path.join(CAPTURES, "studio-direct-confirmation.png") });
  await item.locator("button", { hasText: "Confirmer la validation" }).click();
  await item.waitFor({ state: "detached" });
  const attendu = CONTENU_FAUX.replace("statut: à-valider   # toujours cette valeur\n", `statut: validé   # toujours cette valeur\nvalide_par: humain\ndate_validation: ${aujourdhui()}\n`);
  assert.strictEqual(fs.readFileSync(path.join(OUTPUTS, FAUX), "utf8"), attendu);
  await page.waitForSelector('#poste-script[data-etat="repos"]', { timeout: 5000 });
  await page.close();

  // Refus côté serveur : traversée de dossier, chemin absolu, autre origine, autre méthode.
  for (const f of ["../hors-outputs.md", "..\\hors-outputs.md", SECRET, "%2e%2e/hors-outputs.md", "sous/dossier.md", ".md", "a.txt", 42])
    assert.ok([400, 403, 404].includes((await requete("POST", "/api/valider", { fichier: f })).code), `refusé : ${f}`);
  assert.strictEqual((await requete("POST", "/api/valider", { fichier: FAUX }, { Origin: "http://exemple.test" })).code, 403);
  assert.strictEqual((await requete("POST", "/api/valider", { fichier: FAUX })).code, 409, "déjà validé");
  assert.strictEqual((await requete("GET", "/api/valider")).code, 405);
  assert.strictEqual((await requete("GET", "/..%2f..%2fserveur.js")).code, 403);
  assert.strictEqual((await requete("GET", "/medias/..%2flicences.md")).code, 403);
  assert.strictEqual((await requete("GET", "/", undefined, { Host: "exemple.test" })).code, 421);
  assert.strictEqual(fs.readFileSync(SECRET, "utf8"), CONTENU_SECRET, "le fichier hors de outputs/ n'a pas bougé");
});

test("étape 3 : indicateurs, calendrier, dernière vidéo ; captures finales", async () => {
  const mp4 = fs.readdirSync(path.join(RACINE, "medias")).filter(n => n.toLowerCase().endsWith(".mp4")).length;
  for (const [nom, viewport] of [["ordinateur", { width: 1440, height: 1000 }], ["mobile", { width: 390, height: 844 }]]) {
    const page = await navigateur.newPage({ viewport });
    await page.goto(ORIGINE + "/");
    await page.waitForSelector("body[data-pret=oui]");
    await page.waitForFunction(() => document.getElementById("k-videos").textContent !== "—" || !document.querySelector("#vign video"));
    assert.strictEqual(await page.locator("#k-videos").textContent(), String(mp4));
    assert.strictEqual(await page.locator("#k-cout").textContent(), "—");
    assert.strictEqual(await page.locator("#k-abonnes").textContent(), "—");
    assert.strictEqual(await page.locator("#k-ok").textContent(), "0");
    assert.match(await page.locator("#nb-creneaux").textContent(), /prévu|calendrier absent/);
    if (mp4) await page.waitForFunction(() => /s,/.test(document.getElementById("duree-video").textContent), null, { timeout: 8000 });
    assert.strictEqual(await page.locator("button", { hasText: /Publier|Envoyer|Payer|Activer/ }).count(), 0, "aucun bouton qui publie, envoie, paie ou active");
    await page.screenshot({ path: path.join(CAPTURES, `studio-direct-final-${nom}.png`), fullPage: true });
    await page.close();
  }
});

test("mode Simulation toujours disponible", async () => {
  const page = await navigateur.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(ORIGINE + "/");
  await page.waitForSelector("body[data-pret=oui]");
  await page.click("#m-sim");
  await page.waitForSelector('#poste-veille[data-etat="actif"]', { timeout: 5000 });
  assert.strictEqual(await page.locator("#etat-lien").textContent(), "simulation");
  await page.click("#m-reel");
  await page.waitForFunction(() => document.getElementById("etat-lien").textContent === "en direct");
  await page.close();
});
