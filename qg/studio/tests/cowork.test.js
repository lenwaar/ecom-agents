// T57, point 3 : Cowork passe au travail quand un fichier qu'il écrit arrive dans coordination/,
// pas quand c'est Claude Code. Dossier de coordination factice dans un dossier temporaire.
"use strict";
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { creerSuivi, debutSynchro } = require("../cowork.js");

const MINUIT = new Date(2099, 0, 1, 0, 0, 0).getTime();
const T0 = MINUIT + 10 * 3600 * 1000;                      // 10:00:00
const hh = t => new Date(t).toTimeString().slice(0, 8);
let n = 0;

function dossier() {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), `studio-cowork-test-${n++}-`));
  fs.mkdirSync(path.join(d, "prochaine-synchro"));
  fs.writeFileSync(path.join(d, "de-cowork.md"), "ancien");
  fs.utimesSync(path.join(d, "de-cowork.md"), new Date(T0 - 3600e3), new Date(T0 - 3600e3));
  return d;
}
function ecrire(d, rel, t) {
  fs.writeFileSync(path.join(d, rel), "contenu " + t);
  fs.utimesSync(path.join(d, rel), new Date(t), new Date(t));
}

test("T57-3 : un fichier écrit par Cowork le met au travail, puis au repos après le délai", () => {
  const d = dossier();
  try {
    const suivi = creerSuivi({ dossier: d, maintenant: T0, delai: 600000, attente: 2000 });
    assert.strictEqual(suivi.etat().actif, false, "rien de récent au démarrage");
    ecrire(d, "prochaine-synchro/de-cowork-synchro-15.md", T0 + 1000);
    suivi.examiner([], T0 + 1500);
    assert.strictEqual(suivi.etat().actif, false, "on attend le journal avant de décider");
    suivi.examiner([], T0 + 4000);
    assert.deepStrictEqual(suivi.etat().fichiers, ["prochaine-synchro/de-cowork-synchro-15.md"]);
    assert.strictEqual(suivi.etat().texte, "prépare la prochaine synchro");
    suivi.examiner([], T0 + 4000 + 600001);
    assert.strictEqual(suivi.etat().actif, false, "repos après 10 minutes sans nouveau fichier");
  } finally { fs.rmSync(d, { recursive: true, force: true }); }
});

test("T57-3 : un fichier écrit par Claude Code (Write, Edit ou Bash juste avant) ne met pas Cowork au travail", () => {
  const d = dossier();
  try {
    const suivi = creerSuivi({ dossier: d, maintenant: T0, attente: 2000 });
    const journal = [];
    ecrire(d, "de-cowork.md", T0 + 1000);
    journal.push({ heure: hh(T0 + 1000), type: "PostToolUse", agent: "", outil: "Edit", texte: "Edit C:\\depot\\coordination\\de-cowork.md" });
    ecrire(d, "vers-cowork.md", T0 + 2000);
    journal.push({ heure: hh(T0 + 2000), type: "PostToolUse", agent: "", outil: "Bash", texte: "Bash : cd depot && printf 'T57 fait' >> coordination/vers-cowork.md" });
    ecrire(d, "journal-direct.jsonl", T0 + 2000);                // écrit par le hook : ignoré
    suivi.examiner(journal, T0 + 3000); suivi.examiner(journal, T0 + 5000);
    assert.strictEqual(suivi.etat().actif, false);

    // Une lecture par Claude Code n'est pas une écriture : là, c'est bien Cowork.
    ecrire(d, "de-cowork.md", T0 + 10000);
    journal.push({ heure: hh(T0 + 9000), type: "PostToolUse", agent: "", outil: "Bash", texte: "Bash : cat coordination/de-cowork.md" });
    suivi.examiner(journal, T0 + 11000); suivi.examiner(journal, T0 + 13000);
    assert.strictEqual(suivi.etat().actif, true);
    assert.strictEqual(suivi.etat().texte, "écrit les consignes de la synchro");
  } finally { fs.rmSync(d, { recursive: true, force: true }); }
});

test("T57-3 : Cowork repasse au repos quand Claude Code commence la synchro", () => {
  const d = dossier();
  try {
    const suivi = creerSuivi({ dossier: d, maintenant: T0, attente: 2000 });
    fs.mkdirSync(path.join(d, "a-installer"));
    ecrire(d, "a-installer/agent.md", T0 + 1000);
    suivi.examiner([], T0 + 2000); suivi.examiner([], T0 + 4000);
    assert.strictEqual(suivi.etat().actif, true);
    const journal = [{ heure: hh(T0 + 60000), type: "UserPromptSubmit", agent: "", outil: "", texte: "DEMANDE · /cowork" }];
    suivi.examiner(journal, T0 + 61000);
    assert.strictEqual(suivi.etat().actif, false);
    assert.ok(debutSynchro({ type: "PostToolUse", outil: "Read", texte: "Read C:\\depot\\coordination\\de-cowork.md" }));
    assert.ok(!debutSynchro({ type: "UserPromptSubmit", texte: "DEMANDE · <agent-message> synchro" }), "message automatique");
  } finally { fs.rmSync(d, { recursive: true, force: true }); }
});
