// Lecture de l'en-tête YAML des livrables et réécriture du statut (bouton « Valider »).
// Logique pure, sans accès disque : utilisée par serveur.js et par les tests.
"use strict";

const A_VALIDER = "à-valider";

// Valeur d'un champ YAML simple : retire le commentaire (« # » précédé d'un espace),
// les guillemets et normalise les accents (« à » composé ou décomposé).
function valeurChamp(brut) {
  let v = String(brut).normalize("NFC");
  v = v.replace(/(^|\s)#.*$/, "$1").trim();
  const q = /^(["'])(.*)\1$/.exec(v);
  if (q) v = q[2].trim();
  return v;
}

function estAValider(valeur) {
  // « à-valider#commentaire » (sans espace) compte aussi, comme avant T57.
  return /^à-valider(?=\s|#|$)/.test(valeurChamp(valeur || "").toLowerCase());
}

// En-tête YAML simple (clé: valeur) d'un livrable. Accepte un BOM UTF-8 et les fins de ligne CRLF.
function entete(texte) {
  const m = /^(?:\uFEFF)?---\r?\n([\s\S]*?)\r?\n---/.exec(texte || "");
  if (!m) return null;
  const champs = {};
  for (const ligne of m[1].split(/\r?\n/)) {
    const i = ligne.indexOf(":");
    if (i > 0 && !/^\s/.test(ligne)) champs[ligne.slice(0, i).trim()] = valeurChamp(ligne.slice(i + 1));
  }
  const debutBloc = m.index + m[0].indexOf(m[1]);
  return { champs, debut: m.index, fin: m.index + m[0].length, bloc: m[1], debutBloc };
}

// Ligne « statut: à-valider » (avec ou sans guillemets, avec ou sans commentaire).
const LIGNE_STATUT = /^statut:\s*(["']?)(?:à|a\u0300)-valider\1(?=\s|#|$)/i;

// Renvoie le texte complet avec le statut passé à « validé », ou null si la ligne est introuvable.
// Le commentaire éventuel de la ligne est gardé ; « valide_par: humain » et la date sont ajoutés.
function texteValide(texte, h, date) {
  const fin = /\r\n/.test(h.bloc) ? "\r\n" : "\n";
  const lignes = h.bloc.split(/\r?\n/);
  const i = lignes.findIndex(l => LIGNE_STATUT.test(l.normalize("NFC")) || LIGNE_STATUT.test(l));
  if (i < 0) return null;
  const commentaire = /#.*$/.exec(lignes[i].normalize("NFC").replace(LIGNE_STATUT, ""));
  lignes[i] = "statut: validé" + (commentaire ? "   " + commentaire[0].trim() : "");
  const ajouts = [];
  if (!lignes.some(l => /^valide_par:/.test(l))) ajouts.push("valide_par: humain");
  ajouts.push(`date_validation: ${date}`);
  lignes.splice(i + 1, 0, ...ajouts);
  return texte.slice(0, h.debutBloc) + lignes.join(fin) + texte.slice(h.debutBloc + h.bloc.length);
}

module.exports = { entete, valeurChamp, estAValider, texteValide, A_VALIDER };
