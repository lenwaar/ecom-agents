---
description: Synchronise avec Claude Cowork : lit les tâches de coordination/de-cowork.md, les exécute, rend compte dans coordination/vers-cowork.md
---

Tu travailles en binôme avec Claude Cowork (l'architecte du projet, qui tourne dans l'application Claude). Cowork écrit directement dans ce dossier.

1. Lis `coordination/de-cowork.md`. Exécute toutes les tâches de statut `à faire`. **Travail en parallèle** : les tâches qui ne touchent pas les mêmes fichiers se lancent en parallèle (agents en arrière-plan) ; on n'attend que pour les tâches qui dépendent d'une autre (ou si la synchro impose un ordre). Cette règle remplace l'ancienne consigne « un agent à la fois ».
2. Respecte `CLAUDE.md` : rien n'est publié, envoyé, payé ou commandé sans accord explicite de l'humain.
3. Après chaque tâche, passe-la en `fait` (ou `bloqué` avec la raison) dans `coordination/de-cowork.md`.
4. Écris ton compte rendu en HAUT de `coordination/vers-cowork.md` (le plus récent en premier) :
   - date et heure, tâches faites, fichiers modifiés, commits poussés ;
   - résumé de chaque rapport d'agent produit (5 lignes max) + chemin du fichier ;
   - **🔔 ACTION HUMAINE** : liste claire de ce que l'humain doit faire ou décider, s'il y en a.
5. Lance `py tools/verifier_livrables.py` ; s'il y a des erreurs, corrige-les avant de commiter.
6. `git add -A`, commit `chore(coordination): <résumé>`, `git push`.
7. Termine par un message à l'humain : « Synchro terminée. » + les 🔔 ACTION HUMAINE s'il y en a, sinon « Rien à faire de ton côté : dis à Cowork que la synchro est faite. »
