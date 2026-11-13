// T57, point 1 : « à-valider » est reconnu même suivi d'un commentaire, et Valider garde le commentaire.
// Faux en-têtes en mémoire seulement : aucun vrai livrable n'est lu ni modifié.
"use strict";
const test = require("node:test");
const assert = require("node:assert");
const { entete, estAValider, texteValide } = require("../livrables.js");

const corps = statut => `---\nagent: studio-video   # Théo\n${statut}\ndate: 2099-01-01\n---\n\n# Titre\n\nstatut: à-valider (dans le corps, ne bouge pas)\n`;

test("T57-1 : toutes les formes de « à-valider » comptent, avec ou sans commentaire", () => {
  const formes = [
    "statut: à-valider",
    "statut: à-valider   # toujours cette valeur",
    "statut: à-valider # doit passer par conformite-qa, puis validation humaine",
    "statut: à-valider\t# tabulation",
    "statut: à-valider#collé",
    "statut: \"à-valider\"   # entre guillemets",
    "statut: 'à-valider'",
    "statut:  a\u0300-valider   # « à » décomposé (NFD)"
  ];
  for (const f of formes) {
    const h = entete(corps(f));
    assert.ok(h && estAValider(h.champs.statut), `reconnu : ${f}`);
    assert.strictEqual(h.champs.agent, "studio-video", "le commentaire de l'agent est retiré aussi");
  }
  assert.ok(estAValider(entete("\uFEFF" + corps("statut: à-valider   # BOM")).champs.statut), "fichier avec BOM");
  assert.ok(estAValider(entete(corps("statut: à-valider   # CRLF").replace(/\n/g, "\r\n")).champs.statut), "fins de ligne CRLF");
  for (const f of ["statut: validé   # toujours cette valeur", "statut: brouillon # à-valider plus tard", "statut: # à-valider"])
    assert.ok(!estAValider(entete(corps(f)).champs.statut), `non reconnu : ${f}`);
});

test("T57-1 : Valider garde le commentaire et ne touche qu'à l'en-tête", () => {
  const cas = [
    ["statut: à-valider   # toujours cette valeur", "statut: validé   # toujours cette valeur"],
    ["statut: à-valider # doit passer par conformite-qa", "statut: validé   # doit passer par conformite-qa"],
    ["statut: \"à-valider\"   # guillemets", "statut: validé   # guillemets"],
    ["statut: à-valider", "statut: validé"]
  ];
  for (const [avant, apres] of cas) {
    const texte = corps(avant);
    const nouveau = texteValide(texte, entete(texte), "2099-12-31");
    assert.strictEqual(nouveau, corps(`${apres}\nvalide_par: humain\ndate_validation: 2099-12-31`), avant);
  }
  const crlf = corps("statut: à-valider   # CRLF").replace(/\n/g, "\r\n");
  assert.strictEqual(texteValide(crlf, entete(crlf), "2099-12-31"), corps("statut: validé   # CRLF\nvalide_par: humain\ndate_validation: 2099-12-31").replace(/\n/g, "\r\n"));
});
