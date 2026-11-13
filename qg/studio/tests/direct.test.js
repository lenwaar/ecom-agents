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

// ---------- T57, point 2 : le journal n'affiche que des phrases lisibles ----------
const { propre } = require("../public/direct.js");
const ev = (o) => ({ heure: "10:00:00", type: "PostToolUse", agent: "", outil: "", cible: "", texte: "", ...o });

test("T57-2 : les événements deviennent des phrases courtes en français", () => {
  const e = creerEtat();
  const phrase = o => { const r = appliquer(e, ev(o)).journal; return r && r.phrase; };
  assert.strictEqual(phrase({ outil: "Agent", cible: "studio-video", texte: "Lance l'agent studio-video : Tâche T54 de la synchro n°13. Lis `CLAUDE.md`" }), "Théo se met au travail (tâche T54)");
  assert.strictEqual(phrase({ agent: "studio-video", outil: "Read", texte: "[studio-video] Read C:\\Users\\x\\ecom-agents\\docs\\studio\\BRIEF-STUDIO.md" }), "Théo lit le brief du studio");
  assert.strictEqual(phrase({ agent: "studio-video", outil: "Bash", texte: "[studio-video] Bash : cd \"C:/Users/x/studio/video\" && FF=/c/ffmpeg/bin/ffmpeg.exe && $FF -y -i a.mp4 -vf scale=1080:1920 b.mp4" }), "Théo lance un rendu");
  assert.strictEqual(phrase({ agent: "studio-video", outil: "Write", texte: "[studio-video] Write C:/Users/x/outputs/2026-11-13-studio-video-x.md" }), "Théo écrit un livrable");
  assert.strictEqual(phrase({ type: "SubagentStop", agent: "analyste-marche", texte: "[analyste-marche] AGENT TERMINÉ · <b>rapport</b> dans `outputs/`" }), "Margaux a terminé");
  assert.strictEqual(phrase({ type: "Notification", texte: "ATTEND L'HUMAIN · Claude needs your permission to use Bash" }), "Claude Code attend ton autorisation");
  assert.strictEqual(phrase({ type: "UserPromptSubmit", texte: "DEMANDE · /cowork" }), "Tu as lancé la synchro avec Cowork");
  assert.match(phrase({ type: "UserPromptSubmit", texte: "DEMANDE · <pasted_content id=\"e267\"> Synchro n°14, voir `coordination/de-cowork.md`" }), /^Tu as demandé : « Synchro n°14, voir … »$/);
});

test("T57-2 : XML, commandes brutes, chemins longs et outils inconnus sont masqués", () => {
  const e = creerEtat();
  const sorties = [
    ev({ type: "UserPromptSubmit", texte: "DEMANDE · <task-notification> <task-id>bbaj</task-id> <output-file>C:\\Users\\a\\b.output</output-file>" }),
    ev({ type: "UserPromptSubmit", texte: "DEMANDE · <agent-message from=\"a00b47850a12c1c7c\"> [Subagent hand-back] The text below" }),
    ev({ type: "UserPromptSubmit", texte: "DEMANDE · <system-reminder>rappel</system-reminder>" }),
    ev({ type: "UserPromptSubmit", texte: "DEMANDE · <command-name>/clear</command-name>" }),
    ev({ outil: "TodoWrite", texte: "TodoWrite" }),
    ev({ outil: "mcp__serveur__outil", texte: "mcp__serveur__outil" }),
    ev({ type: "PreCompact", texte: "x" })
  ].map(x => appliquer(e, x).journal);
  assert.deepStrictEqual(sorties, [null, null, null, null, null, null, null]);
  // Tout ce qui s'affiche passe le contrôle de propreté : ni balise, ni commande, ni chemin.
  const brut = ["Bash : git -C /c/a/b log --oneline | head", "Read /tmp/a/b/c/d.txt", "Bash : until [ -f /c/x/y.png ]; do sleep 3; done"];
  for (const t of brut) {
    const r = appliquer(e, ev({ agent: "studio-video", outil: t.startsWith("Read") ? "Read" : "Bash", texte: "[studio-video] " + t })).journal;
    assert.ok(r && propre(r.phrase) && !/[<>`\/\\]/.test(r.phrase), `phrase propre pour ${t} : ${r && r.phrase}`);
  }
  assert.strictEqual(propre("<task-notification>"), false);
  assert.strictEqual(propre("Théo lit C:/Users/x/y"), false);
  assert.strictEqual(e.postes.montage.st, "Attend la fin d'un travail en cours", "le statut du poste est aussi une phrase");
});

// ---------- T57, point 4 : SubagentStop retrouve l'agent par son agent_id ----------
test("T57-4 : un SubagentStop avec agent_id arrête le bon agent, même lancé avant un autre", () => {
  const e = creerEtat();
  appliquer(e, { ...lance("studio-visuel"), agent_id: "a111" });
  appliquer(e, { ...lance("studio-video"), agent_id: "a222" });
  appliquer(e, { ...fin(""), agent_id: "a111" });              // Claude Code ne donne que l'identifiant
  assert.strictEqual(e.postes.visuels.e, "repos", "Iris (a111) s'arrête");
  assert.strictEqual(e.postes.montage.e, "actif", "Théo (a222) continue");
  assert.strictEqual(appliquer(e, { ...fin(""), agent_id: "a222" }).journal.phrase, "Théo a terminé");
  assert.strictEqual(e.postes.montage.e, "repos");
});

test("T57-4 : un identifiant inconnu ne touche à aucun poste ; sans identifiant, repli sur l'ancienne logique", () => {
  const e = creerEtat();
  appliquer(e, { ...lance("studio-video"), agent_id: "a222" });
  const r = appliquer(e, { ...fin(""), agent_id: "zzz-inconnu" });
  assert.strictEqual(e.postes.montage.e, "actif", "un autre agent (inconnu) s'arrête : Théo continue");
  assert.strictEqual(r.journal.phrase, "Un agent a terminé");
  appliquer(e, fin(""));                                       // ancien format, sans agent_id
  assert.strictEqual(e.postes.montage.e, "repos");
});

test("T57-4 : agent au premier plan (lancement journalisé après sa fin) : il ne repasse pas au travail", () => {
  const e = creerEtat();
  appliquer(e, { ...action("conformite-qa", "Read outputs/a.md", "Read"), agent_id: "a333" });
  assert.strictEqual(e.postes.controle.e, "actif");
  appliquer(e, { ...fin("conformite-qa"), agent_id: "a333" });
  appliquer(e, { ...lance("conformite-qa"), agent_id: "a333" });
  assert.strictEqual(e.postes.controle.e, "repos");
});
