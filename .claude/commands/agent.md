---
description: Fait travailler un des 137 agents de l'entreprise par son code (ex. /agent V02 répondre aux commentaires d'hier)
argument-hint: <code> <demande>
---

Demande : $ARGUMENTS

1. Le premier mot est un code de fiche (V, P, M, O, I, C, A ou X suivi de deux chiffres). Trouve la fiche dans `entreprise/agents/` (`Glob entreprise/agents/**/<code>-*.md`). Si le code n'existe pas, montre les fiches les plus proches de la demande dans `entreprise/catalogue.md`.
2. Lis la fiche : son `porteur` dit qui exécute.
   - Un sous-agent : délègue-lui la demande en lui donnant le chemin de la fiche, qu'il doit appliquer exactement.
   - `script` : lance le script indiqué dans la fiche ou dans `tools/`.
   - `humain` : explique à l'humain ce qu'il doit faire, en 3 étapes maximum.
3. Si la fiche demande une validation humaine, ajoute une ligne dans la table `validations` de `donnees/entreprise.db` et rappelle que rien ne part sans accord.
4. Restitue : livrable produit, statut, décision attendue.
