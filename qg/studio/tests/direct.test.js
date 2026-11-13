// Tests unitaires de la correspondance journal -> postes (sans navigateur).
"use strict";
const test = require("node:test");
const assert = require("node:assert");
const { creerEtat, appliquer, appliquerLivrables } = require("../public/direct.js");

const lance = cible => ({ heure: "10:00:00", type: "PostToolUse", agent: "", outil: "Agent", cible, texte: `Lance l'agent ${cible} : test` });
const action = (agent, texte, outil = "Bash") => ({ heure: "10:00:01", type: "PostToolUse", agent, outil, cible: "", texte: `[${agent}] ${texte}` });
const fin = agent => ({ heure: "10:00:02", type: "SubagentStop", agent, outil: "", cible: "", texte: "AGENT TERMINÉ · fini" });

test("lancer puis terminer studio-video met Théo au travail puis au repos", () => {
  const e = creerEtat();
  assert.deepStrictEqual(appliquer(e, lance("studio-video")).changes, ["montage"]);
  assert.strictEqual(e.postes.montage.e, "actif");
  appliquer(e, fin("studio-video"));
  assert.strictEqual(e.postes.montage.e, "repos");
});

test("un SubagentStop sans nom d'agent arrête le dernier agent lancé", () => {
  const e = creerEtat();
  appliquer(e, lance("studio-visuel"));
  appliquer(e, lance("studio-video"));
  appliquer(e, fin(""));
  assert.strictEqual(e.postes.montage.e, "repos");
  assert.strictEqual(e.postes.visuels.e, "actif");
});

test("un agent hors des 8 postes ne dérègle pas les postes", () => {
  const e = creerEtat();
  appliquer(e, lance("studio-video"));
  appliquer(e, lance("developpeur-web"));
  appliquer(e, fin(""));                      // c'est developpeur-web qui s'arrête
  assert.strictEqual(e.postes.montage.e, "actif");
});

test("une commande piper allume Piper, la commande suivante du même agent l'éteint", () => {
  const e = creerEtat();
  appliquer(e, lance("studio-video"));
  appliquer(e, action("studio-video", "Bash : piper --model fr_FR-siwis-medium"));
  assert.strictEqual(e.postes.voix.e, "actif");
  appliquer(e, action("studio-video", "Bash : ffmpeg -i a.mp4"));
  assert.strictEqual(e.postes.voix.e, "repos");
});

test("une carte vole entre la fin d'un agent et le lancement du suivant", () => {
  const e = creerEtat();
  appliquer(e, lance("createur-contenu"));
  appliquer(e, fin("createur-contenu"));
  assert.deepStrictEqual(appliquer(e, lance("studio-visuel")).vol, { de: "script", vers: "visuels", texte: "livrable" });
});

test("un livrable à-valider met le poste en attente, l'activité passe avant", () => {
  const e = creerEtat();
  appliquerLivrables(e, [{ agent: "createur-contenu", fichier: "x.md" }]);
  assert.strictEqual(e.postes.script.e, "attend");
  appliquer(e, lance("createur-contenu"));
  assert.strictEqual(e.postes.script.e, "actif");
  appliquer(e, fin("createur-contenu"));
  assert.strictEqual(e.postes.script.e, "attend");
  appliquerLivrables(e, []);
  assert.strictEqual(e.postes.script.e, "repos");
});
