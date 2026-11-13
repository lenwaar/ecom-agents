---
agent: developpeur-web
statut: à-valider
date: 2026-11-13
sources: [coordination/de-cowork.md (T67), docs/reference/qg-en-direct.html, outputs/2026-11-13-developpeur-web-studio-en-direct-t57.md, coordination/journal-direct.jsonl (lu seulement)]
prochaine-etape: conformite-qa (audit du QG) puis validation humaine
---

# QG en direct (T67) : toute l'équipe sur une page

## Ce qui marche
- Page « QG » (`/`) sur le modèle de `docs/reference/qg-en-direct.html` : 12 pièces (A à K + Automates), 15 agents lus dans `.claude/agents/` (« 15 sur 15 installés »), Cowork, toi, Piper et les 2 scripts.
- Filtres par pôle (A à Q) et par état (tous, au travail, à valider, au repos).
- État de chaque agent : au travail d'après le journal `coordination/journal-direct.jsonl`, en attente s'il a un livrable `à-valider` dans `outputs/`, sinon au repos (dernier livrable) ou « prêt, pas encore utilisé ».
- Synchro en cours lue dans `coordination/de-cowork.md` (dernière section « Synchro n°… ») : titre, précision, statut de chaque tâche, raison des blocages. La page se met à jour seule quand le fichier change. Vérifié sur le vrai fichier : « synchro n°15 · vitesse et qualité », T61 à T68 « à faire » (T67 « en cours » d'après le journal).
- Bouton Valider : change seulement le statut (`validé`, `valide_par: humain`, `date_validation`), après confirmation. Les chemins hors de `outputs/` sont refusés.
- Onglet Studio (`/studio`) inchangé. Même serveur, sur 127.0.0.1:4178 seulement. Aucune ressource externe (polices locales).

## Cause de l'échec du test (corrigé dans le code)
`synchro.js` ne trouvait le titre que s'il y avait une précision entre parenthèses avant (« (…) : titre »). Un en-tête du type « ## Synchro n°10 : suivante » donnait un titre vide : la page n'affichait jamais « synchro n°10 · suivante ». Le test était juste, c'est le code qui était faux. Corrigé, avec un test unitaire en plus. Tous les tests utilisent des dossiers temporaires, jamais les vrais fichiers.

## Résultat de `npm test`
37 réussis sur 37 (`qg/studio`).

## Écarts avec la référence
- Ajouts : compteur « 15 sur 15 installés », indicateur « en direct / simulation », case « Ventes, chiffre » qui affiche « — » tant que la boutique n'est pas ouverte (pas de chiffre inventé).
- La simulation d'une journée reste disponible, mais seulement si tu cliques dessus. Le mode par défaut est « En direct ».

## Pour l'ouvrir
```
cd qg/studio
npm start
```
Puis ouvre http://127.0.0.1:4178/ (le Studio est sur http://127.0.0.1:4178/studio).

Captures : `outputs/qg/qg-direct-ordinateur.png`, `qg-direct-mobile.png`, `qg-direct-au-travail.png`, `qg-direct-filtre-a-valider.png`.
