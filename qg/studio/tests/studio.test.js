// Test de bout en bout : serveur + page dans Chromium (playwright-core).
// Travaille sur un journal FACTICE, un dossier de livrables de test et un dossier de coordination de test,
// tous dans un dossier temporaire : aucun vrai fichier du dépôt n'est lu ni modifié (sauf les captures).
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
const JOURNAL = path.join(TMP, "journal-direct-factice.jsonl");
const OUTPUTS = path.join(TMP, "outputs-test");
const COORDINATION = path.join(TMP, "coordination-test");
const FAUX2 = "2099-01-02-studio-video-faux-livrable-test.md";
const FAUX3 = "2099-01-03-conformite-qa-faux-livrable-test.md";
const FAUX = "2099-01-01-createur-contenu-faux-livrable-test.md";
const SECRET = path.join(TMP, "hors-outputs.md");
const CONTENU_FAUX = "---\nagent: createur-contenu\nstatut: à-valider   # toujours cette valeur\ndate: 2099-01-01\nsources: [test]\nprochaine-etape: conformite-qa\n---\n\n# Faux livrable de test\n\nCorps du livrable : statut: à-valider (ne doit pas changer).\n";
const CONTENU_FAUX2 = "---\nagent: studio-video\nstatut: \"à-valider\"   # doit passer par conformite-qa, puis validation humaine\ndate: 2099-01-02\n---\n\n# Deuxième faux livrable\n";
const CONTENU_FAUX3 = "---\nagent: conformite-qa\nstatut: à-valider # commentaire court\ndate: 2099-01-03\n---\n\n# Troisième faux livrable\n";
// Journal factice : mêmes formes que les vraies lignes (messages XML automatiques, ancien format sans agent_id).
const FACTICE = [
  { heure: "09:00:00", type: "UserPromptSubmit", agent: "", outil: "", cible: "", texte: "DEMANDE · /cowork" },
  { heure: "09:00:05", type: "PostToolUse", agent: "", outil: "Bash", cible: "", texte: "Bash : cd \"C:/depot/coordination\" && tail -c 1 de-cowork.md | od -c" },
  { heure: "09:00:09", type: "UserPromptSubmit", agent: "", outil: "", cible: "", texte: "DEMANDE · <task-notification> <task-id>b1</task-id> <output-file>C:\\Users\\x\\b1.output</output-file>" },
  { heure: "09:00:10", type: "UserPromptSubmit", agent: "", outil: "", cible: "", texte: "DEMANDE · <agent-message from=\"a00b\"> [Subagent hand-back] The text below" },
  { heure: "09:00:12", type: "Notification", agent: "", outil: "", cible: "", texte: "ATTEND L'HUMAIN · Claude is waiting for your input" }
].map(e => JSON.stringify(e)).join("\n") + "\n";
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
  fs.mkdirSync(COORDINATION);
  fs.writeFileSync(JOURNAL, FACTICE, "utf8");
  fs.writeFileSync(path.join(OUTPUTS, FAUX), CONTENU_FAUX, "utf8");
  fs.writeFileSync(path.join(OUTPUTS, FAUX2), CONTENU_FAUX2, "utf8");
  fs.writeFileSync(path.join(OUTPUTS, FAUX3), CONTENU_FAUX3, "utf8");
  fs.writeFileSync(SECRET, CONTENU_SECRET, "utf8");
  serveur = spawn(process.execPath, [path.join(__dirname, "..", "serveur.js")], {
    env: { ...process.env, STUDIO_PORT: String(PORT), STUDIO_JOURNAL: JOURNAL, STUDIO_OUTPUTS: OUTPUTS, STUDIO_COORDINATION: COORDINATION }, stdio: ["ignore", "pipe", "pipe"]
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
  await page.goto(ORIGINE + "/studio");
  await page.waitForSelector("body[data-pret=oui]");
  const theo = page.locator("#poste-montage");
  const piper = page.locator("#poste-voix");
  assert.notStrictEqual(await theo.getAttribute("data-etat"), "actif");

  ecrire({ type: "UserPromptSubmit", texte: "DEMANDE · Test du studio : produire une vidéo" });
  ecrire({ type: "PostToolUse", outil: "Agent", cible: "studio-video", agent_id: "a-test-theo", texte: "Lance l'agent studio-video : Tâche T99 montage de test" });
  ecrire({ type: "PostToolUse", agent: "studio-video", outil: "Read", texte: "[studio-video] Read C:\\depot\\docs\\studio\\BRIEF-STUDIO.md" });
  await page.waitForSelector('#poste-montage[data-etat="actif"]', { timeout: 5000 });
  assert.strictEqual(await page.locator("#st-montage").textContent(), "Lit le brief du studio");
  assert.strictEqual(await page.locator("#k-actifs").textContent(), "1");

  ecrire({ type: "PostToolUse", agent: "studio-video", outil: "Bash", texte: "[studio-video] Bash : piper --model fr_FR-siwis-medium --output_file voix.wav" });
  await page.waitForSelector('#poste-voix[data-etat="actif"]', { timeout: 5000 });
  await page.screenshot({ path: path.join(CAPTURES, "studio-direct-theo-au-travail.png"), fullPage: true });

  ecrire({ type: "PostToolUse", agent: "studio-video", outil: "Write", texte: "[studio-video] Write medias/brouillons/test.mp4" });
  // T57, point 4 : l'arrêt ne donne que l'agent_id ; la page retrouve Théo grâce au lancement.
  ecrire({ type: "SubagentStop", agent: "", agent_id: "a-test-theo", texte: "AGENT TERMINÉ · <b>vidéo</b> de test rendue dans `medias/`" });
  await page.waitForSelector('#poste-montage[data-etat="attend"]', { timeout: 5000 });   // FAUX2 attend sa validation
  assert.strictEqual(await piper.getAttribute("data-etat"), "repos");
  const texteJournal = await page.locator("#journal").textContent();
  for (const attendu of ["Théo a terminé", "Théo génère la voix", "Théo écrit une vidéo", "Théo lit le brief du studio", "Théo se met au travail (tâche T99)",
    "Tu as demandé : « Test du studio : produire une vidéo »", "Tu as lancé la synchro avec Cowork", "Claude Code parcourt les fichiers", "Claude Code attend ta réponse"])
    assert.ok(texteJournal.includes(attendu), `journal : « ${attendu} »`);
  // T57, point 2 : ni XML, ni commande brute, ni chemin dans le journal affiché.
  assert.doesNotMatch(texteJournal, /[<>`\\]|Bash :|task-notification|agent-message|\/\w+\/|AGENT TERMINÉ|DEMANDE ·/);
  await page.screenshot({ path: path.join(CAPTURES, "studio-direct-theo-au-repos.png"), fullPage: true });
  assert.deepStrictEqual(requetesExternes, [], "aucune ressource chargée hors du serveur local");
  await page.close();
});

test("étape 2 : le bouton Valider change seulement l'en-tête du faux livrable", async () => {
  const page = await navigateur.newPage({ viewport: { width: 1440, height: 1000 } });
  page.on("dialog", d => { d.dismiss(); throw new Error("boîte de dialogue du navigateur interdite"); });
  await page.goto(ORIGINE + "/studio");
  await page.waitForSelector("body[data-pret=oui]");
  const item = page.locator(`.ok-item[data-fichier="${FAUX}"]`);
  await item.waitFor();
  assert.strictEqual(await page.locator("#poste-script").getAttribute("data-etat"), "attend");
  // T57, point 1 : les trois faux livrables comptent (commentaire, guillemets, commentaire court).
  assert.strictEqual(await page.locator("#k-ok").textContent(), "3");
  assert.strictEqual(await page.locator("#poste-controle").getAttribute("data-etat"), "attend");
  assert.strictEqual(await page.locator(`.ok-item[data-fichier="${FAUX2}"]`).count(), 1);
  await item.locator("button", { hasText: "Valider" }).click();
  await item.locator(".confirmer").waitFor();
  assert.strictEqual(fs.readFileSync(path.join(OUTPUTS, FAUX), "utf8"), CONTENU_FAUX, "rien n'est écrit avant la confirmation");
  await page.screenshot({ path: path.join(CAPTURES, "studio-direct-confirmation.png") });
  await item.locator("button", { hasText: "Confirmer la validation" }).click();
  await item.waitFor({ state: "detached" });
  const attendu = CONTENU_FAUX.replace("statut: à-valider   # toujours cette valeur\n", `statut: validé   # toujours cette valeur\nvalide_par: humain\ndate_validation: ${aujourdhui()}\n`);
  assert.strictEqual(fs.readFileSync(path.join(OUTPUTS, FAUX), "utf8"), attendu);
  await page.waitForSelector('#poste-script[data-etat="repos"]', { timeout: 5000 });
  assert.strictEqual(await page.locator("#k-ok").textContent(), "2");
  // Valider la ligne entre guillemets garde son commentaire.
  const item2 = page.locator(`.ok-item[data-fichier="${FAUX2}"]`);
  await item2.locator("button", { hasText: "Valider" }).click();
  await item2.locator("button", { hasText: "Confirmer la validation" }).click();
  await item2.waitFor({ state: "detached" });
  assert.strictEqual(fs.readFileSync(path.join(OUTPUTS, FAUX2), "utf8"), CONTENU_FAUX2.replace("statut: \"à-valider\"   # doit", "statut: validé   # doit").replace("humaine\n", `humaine\nvalide_par: humain\ndate_validation: ${aujourdhui()}\n`));
  assert.strictEqual(await page.locator("#k-ok").textContent(), "1");
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
    await page.goto(ORIGINE + "/studio");
    await page.waitForSelector("body[data-pret=oui]");
    await page.waitForFunction(() => document.getElementById("k-videos").textContent !== "—" || !document.querySelector("#vign video"));
    assert.strictEqual(await page.locator("#k-videos").textContent(), String(mp4));
    assert.strictEqual(await page.locator("#k-cout").textContent(), "—");
    assert.strictEqual(await page.locator("#k-abonnes").textContent(), "—");
    assert.strictEqual(await page.locator("#k-ok").textContent(), "1", "reste le faux livrable de conformite-qa");
    assert.match(await page.locator("#nb-creneaux").textContent(), /prévu|calendrier absent/);
    if (mp4) await page.waitForFunction(() => /s,/.test(document.getElementById("duree-video").textContent), null, { timeout: 8000 });
    assert.strictEqual(await page.locator("button", { hasText: /Publier|Envoyer|Payer|Activer/ }).count(), 0, "aucun bouton qui publie, envoie, paie ou active");
    await page.screenshot({ path: path.join(CAPTURES, `studio-direct-final-${nom}.png`), fullPage: true });
    await page.close();
  }
});

test("T57-3 : un fichier écrit par Cowork dans coordination/ met Cowork au travail", async () => {
  const page = await navigateur.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(ORIGINE + "/studio");
  await page.waitForSelector("body[data-pret=oui]");
  // Écrit par Claude Code (journalisé juste après) : Cowork reste au repos.
  fs.writeFileSync(path.join(COORDINATION, "vers-cowork.md"), "compte rendu");
  ecrire({ type: "PostToolUse", outil: "Write", texte: "Write " + path.join(COORDINATION, "vers-cowork.md") });
  await new Promise(r => setTimeout(r, 4500));
  assert.notStrictEqual(await page.locator("#poste-pub").getAttribute("data-etat"), "actif");
  // Écrit par Cowork (rien dans le journal) : Cowork au travail.
  fs.writeFileSync(path.join(COORDINATION, "de-cowork.md"), "## Synchro de test");
  await page.waitForSelector('#poste-pub[data-etat="actif"]', { timeout: 8000 });
  assert.strictEqual(await page.locator("#st-pub").textContent(), "Écrit les consignes de la synchro");
  assert.match(await page.locator("#journal").textContent(), /Cowork écrit les consignes de la synchro/);
  ecrire({ type: "PostToolUse", agent: "studio-visuel", outil: "Bash", texte: "[studio-visuel] Bash : blender -b scene.blend -o //rendu/ -a" });
  await page.waitForSelector('#poste-visuels[data-etat="actif"]', { timeout: 5000 });
  await page.screenshot({ path: path.join(CAPTURES, "studio-direct-t57.png"), fullPage: true });
  // Claude Code commence la synchro : Cowork repasse au repos.
  ecrire({ type: "UserPromptSubmit", texte: "DEMANDE · /cowork" });
  await page.waitForSelector('#poste-pub:not([data-etat="actif"])', { timeout: 8000 });
  await page.close();
});

test("mode Simulation toujours disponible", async () => {
  const page = await navigateur.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(ORIGINE + "/studio");
  await page.waitForSelector("body[data-pret=oui]");
  await page.click("#m-sim");
  await page.waitForSelector('#poste-veille[data-etat="actif"]', { timeout: 5000 });
  assert.strictEqual(await page.locator("#etat-lien").textContent(), "simulation");
  await page.click("#m-reel");
  await page.waitForFunction(() => document.getElementById("etat-lien").textContent === "en direct");
  await page.close();
});
