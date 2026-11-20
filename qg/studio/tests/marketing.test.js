// V2-3 : boucle marketing. File « à valider » (statut local seulement), revenus par post reliés aux seules
// commandes réelles, exemples séparés, fichiers hors Git, page /marketing, bloc marketing de la page du lundi.
// Toutes les données de test vivent dans un dossier temporaire (STUDIO_DATA) : rien n'est écrit dans data/ ni outputs/.
"use strict";
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const http = require("node:http");
const { spawn, spawnSync } = require("node:child_process");
const m = require("../marketing.js");

const RACINE = path.resolve(__dirname, "..", "..", "..");
const PORT = 4194;
const ORIGINE = `http://127.0.0.1:${PORT}`;
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "qg-marketing-test-"));
const PYTHON = ["py", "python3", "python"].find(c => spawnSync(c, ["--version"], { encoding: "utf8" }).status === 0);
test.after(() => fs.rmSync(TMP, { recursive: true, force: true }));

function dossier(nom, fichiers = {}) {
  const d = path.join(TMP, nom);
  fs.mkdirSync(d, { recursive: true });
  for (const [f, v] of Object.entries(fichiers)) fs.writeFileSync(path.join(d, f), typeof v === "string" ? v : JSON.stringify(v, null, 2));
  return d;
}
const cmd = (id, montant, statut = "payee", extra = {}) => ({ id, date: "2099-01-01", montant_ttc: montant, frais_stripe: null, cout_produit: 0, cout_port: 0, statut, exemple: false, ...extra });
const post = (id, refs, extra = {}) => ({ id, plateforme: "TikTok", date: "2099-01-01", sujet: "Sujet " + id, lien: null, references_commandes: refs, exemple: false, ...extra });
const elem = (id, statut = "à-valider", extra = {}) => ({ id, type: "post", plateforme: "TikTok", titre: "Titre " + id, texte: "Texte", agent: "createur-contenu", code: "M12", livrable: null, statut, date_decision: null, exemple: false, ...extra });

// ---------- Revenus par post ----------
test("revenu d'un post : seulement les commandes réelles qu'il cite, calcul de boutique.js", () => {
  const d = dossier("revenus", {
    "commandes.json": { source: "t", importe_le: null, commandes: [cmd("c1", 9.9), cmd("c2", 19.9), cmd("c3", 9.9, "remboursee"), cmd("e1", 50, "payee", { exemple: true })] },
    "posts.json": { source: "saisie manuelle", mis_a_jour: "2099-01-03", posts: [post("p1", ["c1", "c3"]), post("p2", ["c2", "inconnue"]), post("p3", ["e1"]), post("px", ["e1"], { exemple: true })] }
  });
  const r = m.lirePosts(d);
  assert.strictEqual(r.etat, "ok");
  const par = Object.fromEntries(r.reel.map(p => [p.id, p]));
  assert.strictEqual(par.p1.ca_ttc, 9.9);              // c3 remboursée : CA 0
  assert.strictEqual(par.p1.commandes, 2);
  assert.strictEqual(par.p1.payees, 1);
  assert.strictEqual(par.p1.marge_nette, 6.66);        // 6,9077 - 0,25 = 6,6577 -> 6,66
  assert.strictEqual(par.p2.ca_ttc, 19.9);             // « inconnue » n'est jamais comptée
  assert.strictEqual(par.p3.ca_ttc, 0);                // commande d'exemple jamais reliée à un vrai post
  assert.strictEqual(par.p3.marge_nette, null);
  assert.deepStrictEqual(r.reel.map(p => p.id), ["p2", "p1", "p3"]);   // trié par CA décroissant
  assert.strictEqual(r.exemple.length, 1);
  assert.strictEqual(r.exemple[0].ca_ttc, 50);         // exemple relié à l'exemple, affiché à part
  assert.strictEqual(r.total_reel.ca_ttc, 29.8);       // jamais les 50 € d'exemple
  assert.ok(r.avertissements.some(a => a.includes("inconnue")));
  assert.ok(r.avertissements.some(a => a.includes("jamais comptée dans les vrais chiffres")));
});

test("commande citée par deux posts : comptée une seule fois dans le total", () => {
  const d = dossier("double", { "commandes.json": { source: "t", importe_le: null, commandes: [cmd("c1", 9.9)] }, "posts.json": { posts: [post("a", ["c1"]), post("b", ["c1"])] } });
  const r = m.lirePosts(d);
  assert.strictEqual(r.total_reel.ca_ttc, 9.9);
  assert.ok(r.avertissements.some(a => a.includes("plusieurs posts")));
});

test("posts.json absent : repli sur posts.vide.json ; vide : message, aucun chiffre", () => {
  const d = dossier("posts-repli", { "posts.vide.json": { source: "aucune", mis_a_jour: null, posts: [] } });
  const r = m.lirePosts(d);
  assert.strictEqual(r.etat, "vide");
  assert.strictEqual(r.fichier, "data/posts.vide.json");
  assert.match(r.message, /aucun revenu n'est estimé/);
  assert.deepStrictEqual(r.reel, []);
  assert.strictEqual(r.total_reel.ca_ttc, 0);
  assert.strictEqual(m.lirePosts(dossier("posts-absent")).etat, "absent");
  assert.strictEqual(m.lirePosts(dossier("posts-invalide", { "posts.json": "{ pas du json" })).etat, "invalide");
  assert.strictEqual(m.lirePosts(dossier("posts-mal-forme", { "posts.json": { source: "x" } })).etat, "invalide");
});

test("fichiers du dépôt : posts.json et file-marketing.json hors Git, modèles vides et exemples marqués", () => {
  for (const f of ["data/posts.json", "data/file-marketing.json"]) {
    const r = spawnSync("git", ["check-ignore", "-q", f], { cwd: RACINE });
    assert.strictEqual(r.status, 0, f + " doit être ignoré par Git");
  }
  assert.deepStrictEqual(JSON.parse(fs.readFileSync(path.join(RACINE, "data", "posts.vide.json"), "utf8")).posts, []);
  assert.deepStrictEqual(JSON.parse(fs.readFileSync(path.join(RACINE, "data", "file-marketing.vide.json"), "utf8")).elements, []);
  const px = JSON.parse(fs.readFileSync(path.join(RACINE, "data", "posts.exemple.json"), "utf8"));
  assert.ok(px.posts.length && px.posts.every(p => p.exemple === true && p.id.startsWith("EXEMPLE")));
  const fx = JSON.parse(fs.readFileSync(path.join(RACINE, "data", "file-marketing.exemple.json"), "utf8"));
  assert.ok(fx.elements.length && fx.elements.every(e => e.exemple === true));
  // Les fichiers d'exemple seuls ne sont jamais lus.
  const d = dossier("exemples-seuls");
  for (const f of ["posts.exemple.json", "file-marketing.exemple.json"]) fs.copyFileSync(path.join(RACINE, "data", f), path.join(d, f));
  assert.strictEqual(m.lirePosts(d).etat, "absent");
  assert.strictEqual(m.lireFile(d).etat, "absent");
});

// ---------- File à valider ----------
test("file : à valider, décidés et exemples séparés ; lignes douteuses signalées", () => {
  const d = dossier("file", { "file-marketing.json": { elements: [elem("a1"), elem("v1", "validé"), elem("r1", "refusé"), elem("x1", "à-valider", { exemple: true }), elem("a1"), elem("z", "publié"), { titre: "sans id" }] } });
  const r = m.lireFile(d);
  assert.strictEqual(r.etat, "ok");
  assert.deepStrictEqual(r.compte, { a_valider: 1, valides: 1, refuses: 1 });
  assert.deepStrictEqual(r.exemples.map(e => e.id), ["x1"]);
  assert.strictEqual(r.avertissements.length, 3);
  assert.match(r.note, /rien n'est publié ni envoyé/);
});

test("décider : change seulement le statut, ajoute date et décideur, refuse le reste", () => {
  const d = dossier("decider", { "file-marketing.json": { elements: [elem("a1", "à-valider", { texte: "Texte exact" }), elem("a2"), elem("x1", "à-valider", { exemple: true })] } });
  const avant = JSON.parse(fs.readFileSync(path.join(d, "file-marketing.json"), "utf8"));
  assert.strictEqual(m.decider(d, "a1", "validé", "2099-01-05").code, 200);
  assert.strictEqual(m.decider(d, "a2", "refusé", "2099-01-05").code, 200);
  const apres = JSON.parse(fs.readFileSync(path.join(d, "file-marketing.json"), "utf8"));
  assert.deepStrictEqual(apres.elements[0], { ...avant.elements[0], statut: "validé", date_decision: "2099-01-05", decide_par: "humain" });
  assert.strictEqual(apres.elements[1].statut, "refusé");
  assert.strictEqual(m.decider(d, "a1", "refusé", "2099-01-06").code, 409);   // déjà décidé
  assert.strictEqual(m.decider(d, "x1", "validé", "2099-01-06").code, 409);   // exemple
  assert.strictEqual(m.decider(d, "inconnu", "validé", "2099-01-06").code, 404);
  assert.strictEqual(m.decider(d, "a1", "publié", "2099-01-06").code, 400);
  assert.strictEqual(m.decider(d, "../x", "validé", "2099-01-06").code, 400);
  // Sans file-marketing.json (seulement le modèle vide), rien à décider et le modèle n'est jamais réécrit.
  const v = dossier("decider-vide", { "file-marketing.vide.json": { elements: [] } });
  assert.strictEqual(m.decider(v, "a1", "validé", "2099-01-06").code, 404);
  assert.strictEqual(m.lireFile(v).etat, "vide");
});

test("décider : écriture impossible -> code 500 lisible, pas d'exception, fichier inchangé", () => {
  const d = dossier("decider-lecture-seule", { "file-marketing.json": { elements: [elem("a1")] } });
  const f = path.join(d, "file-marketing.json");
  const avant = fs.readFileSync(f, "utf8");
  fs.chmodSync(f, 0o444);                       // lecture seule : writeFileSync échoue (Windows et Unix)
  try {
    const r = m.decider(d, "a1", "validé", "2099-01-05");
    assert.deepStrictEqual(r, { code: 500, erreur: "Écriture impossible dans data/file-marketing.json" });
    assert.strictEqual(fs.readFileSync(f, "utf8"), avant);
  } finally { fs.chmodSync(f, 0o644); }
});

test("aucun appel réseau sortant dans le code marketing", () => {
  for (const f of ["marketing.js", "public/marketing.js"]) {
    const t = fs.readFileSync(path.join(__dirname, "..", f), "utf8");
    assert.ok(!/require\(["']node:(https?|net|dns|tls)["']\)|https?:\/\//.test(t), f);
    for (const appel of t.match(/fetch\(\s*["'][^"']*["']/g) || []) assert.match(appel, /fetch\(\s*["']\/api\/marketing/, f);
  }
});

// ---------- Page du lundi (Python) ----------
function blocLundi(d, exemple = false) {
  const script = ["import sys, json", `sys.path.insert(0, ${JSON.stringify(path.join(RACINE, "tools"))})`, "import page_lundi as p",
    `print(json.dumps(p.bloc_marketing(sys.argv[1], ${exemple ? "True" : "False"})))`].join("\n");
  const r = spawnSync(PYTHON, ["-X", "utf8", "-c", script, d], { encoding: "utf8" });
  assert.strictEqual(r.status, 0, r.stderr);
  return JSON.parse(r.stdout).join("\n");
}

test("page du lundi : bloc marketing vide, sans chiffre inventé", { skip: PYTHON ? false : "py absent" }, () => {
  const t = blocLundi(dossier("lundi-vide", { "posts.vide.json": { posts: [] }, "commandes.vide.json": { commandes: [] }, "file-marketing.vide.json": { elements: [] } }));
  assert.match(t, /### Ce qui a marché/);
  assert.match(t, /### Ce qui part ensuite/);
  assert.match(t, /Aucun post relié à une commande réelle/);
  assert.match(t, /Rien dans la file marketing/);
  assert.ok(!/€/.test(t), "aucun montant quand rien n'est relié");
});

test("page du lundi : mêmes revenus que le QG, exemples exclus, file résumée", { skip: PYTHON ? false : "py absent" }, () => {
  const d = dossier("lundi", {
    "commandes.json": { commandes: [cmd("c1", 9.9), cmd("c2", 19.9), cmd("c3", 9.9, "remboursee"), cmd("e1", 50, "payee", { exemple: true })] },
    "posts.json": { posts: [post("p1", ["c1", "c3"]), post("p2", ["c2", "inconnue"]), post("p3", ["e1"]), post("px", ["e1"], { exemple: true })] },
    "file-marketing.json": { elements: [elem("v1", "validé"), elem("a1"), elem("x1", "à-valider", { exemple: true })] }
  });
  const t = blocLundi(d);
  const qg = m.lirePosts(d).reel.filter(p => p.ca_ttc > 0);
  for (const p of qg) assert.ok(t.includes(`(\`${p.id}\`) : ${p.ca_ttc.toFixed(2).replace(".", ",")} €`), p.id);
  assert.ok(!t.includes("px") && !t.includes("50,00"), "exemple jamais dans les vrais chiffres");
  assert.ok(!t.includes("`p3`"), "post sans commande réelle absent de « Ce qui a marché »");
  assert.match(t, /Validé, à publier à la main : post TikTok « Titre v1 »/);
  assert.match(t, /En attente de votre décision : post TikTok « Titre a1 »/);
  assert.ok(!t.includes("x1"));
});

// ---------- Serveur et page ----------
function requete(methode, chemin, corps, entetes = {}) {
  return new Promise((res, rej) => {
    const r = http.request(ORIGINE + chemin, { method: methode, headers: entetes }, rep => {
      let d = ""; rep.on("data", c => d += c); rep.on("end", () => res({ code: rep.statusCode, csp: rep.headers["content-security-policy"], corps: d }));
    });
    r.on("error", rej);
    if (corps) r.write(corps);
    r.end();
  });
}

test("API /api/marketing, décision protégée et page /marketing (serveur avec STUDIO_DATA temporaire)", async t => {
  const data = dossier("serveur", {
    "commandes.json": { source: "t", importe_le: null, commandes: [cmd("c1", 9.9)] },
    "posts.json": { posts: [post("p1", ["c1"])] },
    "file-marketing.json": { elements: [elem("a1"), elem("a2")] }
  });
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

  const api = JSON.parse((await requete("GET", "/api/marketing")).corps);
  assert.strictEqual(api.file.compte.a_valider, 2);
  assert.strictEqual(api.posts.reel[0].ca_ttc, 9.9);

  const json = { "Content-Type": "application/json", Origin: ORIGINE };
  const corps = JSON.stringify({ id: "a1", decision: "validé" });
  assert.strictEqual((await requete("POST", "/api/marketing/decision", corps, { "Content-Type": "application/json", Origin: "http://evil.example" })).code, 403);
  assert.strictEqual((await requete("POST", "/api/marketing/decision", corps, { "Content-Type": "text/plain", Origin: ORIGINE })).code, 415);
  assert.strictEqual((await requete("GET", "/api/marketing/decision")).code, 405);
  const ok = await requete("POST", "/api/marketing/decision", corps, json);
  assert.strictEqual(ok.code, 200, ok.corps);
  assert.strictEqual(JSON.parse(fs.readFileSync(path.join(data, "file-marketing.json"), "utf8")).elements[0].statut, "validé");
  assert.strictEqual((await requete("POST", "/api/marketing/decision", corps, json)).code, 409);

  for (const chemin of ["/marketing", "/marketing.js", "/marketing.css"]) {
    const r = await requete("GET", chemin);
    assert.strictEqual(r.code, 200, chemin);
    assert.match(r.csp, /connect-src 'self'/);
  }
  const page = (await requete("GET", "/marketing")).corps;
  assert.match(page, /Publication manuelle/);
  assert.match(page, /rien n'est publié ni envoyé/);
  assert.match(page, /href="\/marketing" aria-current="page">Marketing</);
  assert.ok(!/<script>|style="/.test(page), "pas de script ni de style en ligne");
  for (const p of ["/", "/studio", "/boutique", "/modules"]) assert.match((await requete("GET", p)).corps, /href="\/marketing">Marketing</, p);
});

test("page /marketing dans un vrai navigateur : Valider change le statut, sans emoji", async t => {
  const { chromium } = require("playwright-core");
  const data = dossier("navigateur", { "file-marketing.json": { elements: [elem("a1"), elem("x1", "à-valider", { exemple: true })] }, "posts.vide.json": { posts: [] } });
  const vide = path.join(TMP, "vide-nav"); fs.mkdirSync(vide);
  const port = PORT + 10;
  const serveur = spawn(process.execPath, [path.join(__dirname, "..", "serveur.js")], {
    env: { ...process.env, STUDIO_PORT: String(port), STUDIO_DATA: data, STUDIO_JOURNAL: path.join(vide, "j.jsonl"), STUDIO_OUTPUTS: vide, STUDIO_COORDINATION: vide, STUDIO_AGENTS: vide, STUDIO_MEDIAS: vide, STUDIO_CALENDRIER: path.join(vide, "c.md") },
    stdio: ["ignore", "pipe", "pipe"]
  });
  t.after(async () => { serveur.kill(); await new Promise(r => serveur.once("exit", r)); });
  await new Promise((res, rej) => { serveur.stdout.on("data", d => { if (String(d).includes("QG en direct")) res(); }); setTimeout(() => rej(new Error("serveur non démarré")), 10000); });
  const nav = await chromium.launch();
  t.after(() => nav.close());
  const page = await nav.newPage({ viewport: { width: 390, height: 844 } });
  const sortants = [];
  page.on("request", r => { if (!r.url().startsWith(`http://127.0.0.1:${port}/`)) sortants.push(r.url()); });
  await page.goto(`http://127.0.0.1:${port}/marketing`);
  await page.waitForSelector("body[data-pret='oui']");
  assert.strictEqual(await page.locator("#file li").count(), 1);
  assert.strictEqual(await page.locator("#bloc-exemple button").count(), 0, "exemple sans bouton");
  await page.click("#file li[data-id='a1'] button.valider");
  await page.waitForFunction(() => document.querySelectorAll("#decides li").length === 1);
  assert.strictEqual(JSON.parse(fs.readFileSync(path.join(data, "file-marketing.json"), "utf8")).elements[0].statut, "validé");
  const texte = await page.locator("body").innerText();
  assert.ok(!/[\u{1F300}-\u{1FAFF}\u2600-\u27BF]/u.test(texte), "aucun emoji");
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), "pas de défilement horizontal sur mobile");
  assert.deepStrictEqual(sortants, [], "aucune requête hors du serveur local");
});
