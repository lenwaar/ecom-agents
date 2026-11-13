// Tests unitaires du QG en direct (sans navigateur) : lecture de la synchro, état des 15 agents
// depuis un journal factice, filtres par pôle et par état, livrables à valider par agent,
// aucune ressource externe. Tout se passe en mémoire ou dans un dossier temporaire.
"use strict";
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { lireSynchro, lireStatut } = require("../synchro.js");
const { listerAgents, lireLivrables, resumeLivrables } = require("../equipe.js");
const Q = require("../public/qg-direct.js");

const QUINZE = ["analyste-marche", "architecte-web", "conformite-qa", "createur-contenu", "crm-email", "developpeur-web", "gestion-commandes",
  "media-acquisition", "pilotage-finance", "redacteur-catalogue", "service-client", "sourcing-produits", "studio-video", "studio-visuel", "veille-outils"];

const DE_COWORK = [
  "# Tâches de Claude Cowork pour Claude Code", "", "Statuts : `à faire` · `fait` · `bloqué (raison)`", "",
  "## Synchro n°1 à n°7 (T1 à T30) · `fait`", "",
  "## Synchro n°8 (2026-11-12) : ancienne synchro", "### T31 · Ancienne tâche · `fait`", "Ne doit pas apparaître.", "",
  "## Synchro n°9 (transmise par l'humain le 2099-01-01) : synchro de test", "",
  "Dans l'ordre, une ligne dans `vers-cowork.md` après chaque tâche.", "",
  "### T40 · Première tâche · `fait`", "Lance `sourcing-produits` sur **trois** fournisseurs.", "",
  "### T41 · Deuxième tâche · `à faire`", "`developpeur-web` puis `conformite-qa` : contre-audit.", "",
  "### T42 · Troisième tâche · `bloqué (attente de l'humain (INPI), voir vers-cowork.md)`", "`studio-video` attend.", "",
  "### T43 · Statut libre · `en pause`", "Texte.", "",
  "## Règle permanente", "### T99 · Hors synchro · `fait`", "Ne doit pas apparaître."
].join("\r\n");

test("synchro : dernière section « Synchro n°… », tâches et statuts (fait, à faire, bloqué avec raison)", () => {
  const s = lireSynchro(DE_COWORK, QUINZE);
  assert.strictEqual(s.numero, 9);
  assert.strictEqual(s.titre, "synchro de test");
  assert.strictEqual(s.precision, "transmise par l'humain le 2099-01-01");
  assert.deepStrictEqual(s.taches.map(t => t.id), ["T40", "T41", "T42", "T43"]);
  assert.deepStrictEqual(s.taches.map(t => t.statut), ["fait", "afaire", "bloque", "autre"]);
  assert.strictEqual(s.taches[0].titre, "Première tâche");
  assert.strictEqual(s.taches[0].texte, "Lance sourcing-produits sur trois fournisseurs.");
  assert.deepStrictEqual(s.taches[0].agents, ["sourcing-produits"]);
  assert.deepStrictEqual(s.taches[1].agents, ["conformite-qa", "developpeur-web"]);
  assert.strictEqual(s.taches[2].raison, "attente de l'humain (INPI), voir vers-cowork.md");
  assert.strictEqual(s.taches[3].libelle, "en pause");
  assert.deepStrictEqual(s.compte, { fait: 1, afaire: 1, bloque: 1, autre: 1, inconnu: 0 });
});

test("synchro : statuts isolés, fichier sans synchro, texte absent", () => {
  assert.deepStrictEqual(lireStatut("bloqué (le fournisseur ne répond pas)"), { statut: "bloque", libelle: "bloqué", raison: "le fournisseur ne répond pas" });
  assert.deepStrictEqual(lireStatut("bloque"), { statut: "bloque", libelle: "bloqué", raison: "" });
  assert.strictEqual(lireStatut("A faire").statut, "afaire");
  assert.strictEqual(lireStatut("").libelle, "—");
  assert.strictEqual(lireSynchro("# Rien\n## Règle permanente\n"), null);
  assert.strictEqual(lireSynchro(null), null);
  const sans = lireSynchro("## Synchro n°3 : vide\n### T5 · Sans statut\nTexte.\n");
  assert.strictEqual(sans.taches[0].statut, "inconnu");
  assert.strictEqual(sans.taches[0].libelle, "—");
  // Titre sans précision entre parenthèses (cause de l'échec du test de bout en bout « synchro n°10 · suivante »).
  const simple = lireSynchro("## Synchro n°10 : suivante\n### T43 · Nouvelle tâche · `à faire`\n");
  assert.strictEqual(simple.titre, "suivante");
  assert.strictEqual(simple.precision, "");
  const sansTitre = lireSynchro("## Synchro n°11 (test du 2099-01-02)\n### T44 · X · `fait`\n");
  assert.strictEqual(sansTitre.titre, "");
  assert.strictEqual(sansTitre.precision, "test du 2099-01-02");
});

test("synchro : le vrai coordination/de-cowork.md se lit sans erreur (lecture seule)", () => {
  const p = path.resolve(__dirname, "..", "..", "..", "coordination", "de-cowork.md");
  if (!fs.existsSync(p)) return;
  const s = lireSynchro(fs.readFileSync(p, "utf8"), QUINZE);
  assert.ok(s && s.numero > 0 && s.taches.length > 0);
  s.taches.forEach(t => assert.match(t.id, /^T\d+/));
});

test("plan du QG : 12 pièces, 15 agents (ceux de .claude/agents/), chacun dans sa pièce", () => {
  assert.strictEqual(Q.PIECES.length, 12);
  assert.deepStrictEqual([...Q.AGENTS].sort(), QUINZE);
  const vrais = path.resolve(__dirname, "..", "..", "..", ".claude", "agents");
  if (fs.existsSync(vrais)) assert.deepStrictEqual(listerAgents(vrais).map(a => a.nom), QUINZE, "correspondance avec les fichiers installés");
  const attendu = { "analyste-marche": "B", "sourcing-produits": "C", "gestion-commandes": "C", "architecte-web": "D", "developpeur-web": "D", "redacteur-catalogue": "E",
    "createur-contenu": "F", "studio-visuel": "F", "studio-video": "F", "media-acquisition": "G", "service-client": "H", "crm-email": "H",
    "pilotage-finance": "I", "conformite-qa": "J", "veille-outils": "K" };
  for (const [agent, piece] of Object.entries(attendu)) assert.strictEqual(Q.EQUIPE.find(a => a.id === agent).p, piece, agent);
  Q.PIECES.forEach(p => assert.ok(Q.EQUIPE.some(a => a.p === p.id), `pièce ${p.id} occupée`));
});

// Journal factice : mêmes formes que coordination/journal-direct.jsonl.
const ev = (o) => ({ heure: "10:00:00", type: "PostToolUse", agent: "", outil: "", cible: "", texte: "", ...o });
function etatFactice() {
  const e = Q.creerEtat();
  Q.appliquerEquipe(e, {
    agents: QUINZE.filter(n => n !== "crm-email").map(nom => ({ nom })),       // crm-email pas encore installé
    parAgent: {
      "analyste-marche": { total: 2, aValider: [{ fichier: "a.md" }], dernier: { fichier: "a.md", date: "2099-01-01" } },
      "conformite-qa": { total: 3, aValider: [{ fichier: "b.md" }, { fichier: "c.md" }], dernier: { fichier: "c.md", date: "2099-01-02" } },
      "architecte-web": { total: 1, aValider: [], dernier: { fichier: "d.md", date: "2099-01-03" } }
    }
  }, [{ fichier: "a.md" }, { fichier: "b.md" }, { fichier: "c.md" }]);
  const journal = [
    ev({ type: "UserPromptSubmit", texte: "DEMANDE · /cowork" }),
    ev({ outil: "Agent", cible: "sourcing-produits", agent_id: "id-hugo", texte: "Lance l'agent sourcing-produits : Tâche T41" }),
    ev({ agent: "sourcing-produits", agent_id: "id-hugo", outil: "Read", texte: "[sourcing-produits] Read knowledge/niche.md" }),
    ev({ outil: "Agent", cible: "studio-video", agent_id: "id-theo", texte: "Lance l'agent studio-video : montage" }),
    ev({ agent: "studio-video", agent_id: "id-theo", outil: "Bash", texte: "[studio-video] Bash : piper --model fr_FR-siwis-medium" }),
    ev({ outil: "Agent", cible: "redacteur-catalogue", agent_id: "id-clara", texte: "Lance l'agent redacteur-catalogue : fiche" }),
    ev({ type: "SubagentStop", agent_id: "id-clara", texte: "AGENT TERMINÉ · fiche" }),
    ev({ outil: "Bash", texte: "Bash : py tools/verifier_livrables.py" }),
    // Agent lancé au premier plan : l'arrêt arrive avant le lancement dans le journal.
    ev({ type: "SubagentStop", agent_id: "id-ada", agent: "veille-outils", texte: "AGENT TERMINÉ · licences" }),
    ev({ outil: "Agent", cible: "veille-outils", agent_id: "id-ada", texte: "Lance l'agent veille-outils : licences" })
  ];
  const sorties = journal.map(x => Q.appliquer(e, x));
  return { e, sorties };
}

test("état des 15 agents depuis un journal factice et des livrables à valider", () => {
  const { e, sorties } = etatFactice();
  const etats = Q.tous(e);
  const attendu = {
    "analyste-marche": "attend", "architecte-web": "repos", "conformite-qa": "attend", "createur-contenu": "pret", "crm-email": "absent",
    "developpeur-web": "pret", "gestion-commandes": "pret", "media-acquisition": "pret", "pilotage-finance": "pret", "redacteur-catalogue": "repos",
    "service-client": "pret", "sourcing-produits": "actif", "studio-video": "actif", "studio-visuel": "pret", "veille-outils": "repos"
  };
  assert.deepStrictEqual(Object.fromEntries(QUINZE.map(id => [id, etats[id].e])), attendu);
  assert.strictEqual(etats["sourcing-produits"].st, "Lit la base de connaissances");
  assert.strictEqual(etats["conformite-qa"].st, "2 livrables à valider");
  assert.strictEqual(etats["analyste-marche"].st, "1 livrable à valider");
  assert.strictEqual(etats["redacteur-catalogue"].st, "Terminé");
  assert.strictEqual(etats["architecte-web"].st, "dernier livrable : 2099-01-03");
  assert.strictEqual(etats["crm-email"].st, "pas encore installé");
  assert.strictEqual(etats.piper.e, "actif", "Piper au travail pendant la commande de voix");
  assert.strictEqual(etats["auto-verif"].e, "actif", "le vérificateur tourne");
  assert.strictEqual(etats.toi.e, "attend");
  assert.strictEqual(etats.toi.st, "3 livrables à valider");
  assert.ok(sorties.some(s => s.journal && s.journal.phrase === "Hugo se met au travail (tâche T41)"));
  assert.ok(sorties.some(s => s.journal && s.journal.phrase === "Clara a terminé"));

  const r = Q.resume(etats);
  assert.strictEqual(r.agentsActifs, 2);
  assert.strictEqual(r.piecesActives, 3, "C, F et Q");
  assert.strictEqual(r.pieces.F.texte, "2 au travail");
  assert.strictEqual(r.pieces.J.texte, "1 attend");

  // Fin de Théo : lui et Piper repassent au repos ; la tâche T41 de Hugo est « en cours ».
  Q.appliquer(e, ev({ type: "SubagentStop", agent_id: "id-theo", texte: "AGENT TERMINÉ" }));
  assert.strictEqual(Q.etatDe(e, "studio-video").e, "repos");
  assert.strictEqual(Q.etatDe(e, "piper").e, "repos");
  const synchro = lireSynchro(DE_COWORK, QUINZE);
  assert.deepStrictEqual(Q.tachesAffichees(e, synchro).map(t => t.affiche), ["fait", "encours", "bloque", "autre"]);
  Q.appliquer(e, ev({ type: "SubagentStop", agent_id: "id-hugo", texte: "AGENT TERMINÉ" }));
  assert.strictEqual(Q.tachesAffichees(e, synchro)[1].affiche, "afaire");
});

test("Cowork au travail puis au repos avec le résumé de la synchro", () => {
  const e = Q.creerEtat();
  const synchro = { source: true, synchro: lireSynchro(DE_COWORK, QUINZE) };
  const a = Q.appliquerCowork(e, { actif: true, texte: "écrit les consignes de la synchro" }, synchro);
  assert.deepStrictEqual(a.changes, ["cowork"]);
  assert.strictEqual(a.journal.phrase, "Cowork écrit les consignes de la synchro");
  assert.strictEqual(Q.etatDe(e, "cowork").e, "actif");
  Q.appliquerCowork(e, { actif: false }, synchro);
  assert.deepStrictEqual(Q.etatDe(e, "cowork"), { e: "repos", st: "synchro n°9 : 1 sur 4 faites" });
});

test("filtres par pôle et par état", () => {
  const { e } = etatFactice();
  const etats = Q.tous(e);
  const visibles = f => { const r = Q.filtrer(etats, f); return { m: Object.keys(r.membres).filter(k => r.membres[k]).sort(), p: Object.keys(r.pieces).filter(k => r.pieces[k]).sort() }; };
  assert.strictEqual(visibles("tous").m.length, Q.EQUIPE.length);
  assert.strictEqual(visibles("tous").p.length, 12);
  assert.deepStrictEqual(visibles("F").m, ["createur-contenu", "piper", "studio-video", "studio-visuel"]);
  assert.deepStrictEqual(visibles("F").p, ["F"]);
  assert.deepStrictEqual(visibles("H").m, ["crm-email", "service-client"]);
  assert.deepStrictEqual(visibles("actif").m, ["auto-verif", "piper", "sourcing-produits", "studio-video"]);
  assert.deepStrictEqual(visibles("actif").p, ["C", "F", "Q"]);
  assert.deepStrictEqual(visibles("attend").m, ["analyste-marche", "conformite-qa", "toi"]);
  assert.deepStrictEqual(visibles("attend").p, ["A", "B", "J"]);
  const repos = visibles("repos").m;
  assert.ok(repos.includes("crm-email") && repos.includes("gestion-commandes") && repos.includes("architecte-web"), "repos inclut prêt et pas encore installé");
  assert.ok(!repos.includes("studio-video") && !repos.includes("conformite-qa"));
  assert.deepStrictEqual(visibles("Z").m, [], "filtre inconnu : rien");
});

test("livrables à valider par agent (dossier temporaire, jamais les vrais livrables)", () => {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), "qg-livrables-test-"));
  try {
    const f = (nom, agent, statut, date) => fs.writeFileSync(path.join(d, nom), `---\nagent: ${agent}\nstatut: ${statut}\ndate: ${date}\n---\n\n# Titre ${nom}\n`);
    f("2099-01-01-analyste-marche-a.md", "analyste-marche", "à-valider   # toujours cette valeur", "2099-01-01");
    f("2099-01-02-analyste-marche-b.md", "analyste-marche", "validé", "2099-01-02");
    f("2099-01-03-conformite-qa-c.md", "conformite-qa", "\"à-valider\"", "2099-01-03");
    f("2099-01-04-conformite-qa-d.md", "conformite-qa", "à-valider#court", "2099-01-04");
    f("2099-01-05-developpeur-web-e.md", "developpeur-web", "validé", "2099-01-05");
    fs.writeFileSync(path.join(d, "sans-entete.md"), "# Pas d'en-tête\n");
    fs.writeFileSync(path.join(d, "note.txt"), "---\nagent: x\nstatut: à-valider\n---\n");
    const liste = lireLivrables(d);
    assert.strictEqual(liste.length, 5);
    const { parAgent, duJour } = resumeLivrables(liste, "2099-01-02");
    assert.deepStrictEqual(parAgent["analyste-marche"].aValider.map(l => l.fichier), ["2099-01-01-analyste-marche-a.md"]);
    assert.strictEqual(parAgent["analyste-marche"].total, 2);
    assert.strictEqual(parAgent["analyste-marche"].dernier.fichier, "2099-01-02-analyste-marche-b.md");
    assert.deepStrictEqual(parAgent["conformite-qa"].aValider.map(l => l.fichier), ["2099-01-04-conformite-qa-d.md", "2099-01-03-conformite-qa-c.md"]);
    assert.deepStrictEqual(parAgent["developpeur-web"].aValider, []);
    assert.strictEqual(parAgent["conformite-qa"].aValider[1].titre, "Titre 2099-01-03-conformite-qa-c.md");
    assert.strictEqual(duJour, 1);
    assert.strictEqual(resumeLivrables(liste, null).duJour, null, "pas de date : « — »");
    // Agents installés : nom de l'en-tête, sinon nom du fichier ; dossier absent : null.
    const ag = path.join(d, "agents"); fs.mkdirSync(ag);
    fs.writeFileSync(path.join(ag, "a.md"), "---\nname: analyste-marche\ndescription: Étude de marché. Suite.\n---\n");
    fs.writeFileSync(path.join(ag, "veille-outils.md"), "Sans en-tête\n");
    assert.deepStrictEqual(listerAgents(ag), [{ nom: "analyste-marche", description: "Étude de marché" }, { nom: "veille-outils", description: "" }]);
    assert.strictEqual(listerAgents(path.join(d, "absent")), null);
  } finally { fs.rmSync(d, { recursive: true, force: true }); }
});

test("aucune ressource externe dans les pages, styles et scripts servis", () => {
  const pub = path.join(__dirname, "..", "public");
  for (const nom of fs.readdirSync(pub).filter(n => /\.(html|css|js)$/.test(n))) {
    const t = fs.readFileSync(path.join(pub, nom), "utf8");
    assert.doesNotMatch(t, /(https?:)?\/\/(?!\/)[a-z0-9-]+\.[a-z]{2,}/i, `${nom} : adresse externe`);
    assert.doesNotMatch(t, /@import|fonts\.googleapis|cdn\./i, `${nom} : import externe`);
  }
});
