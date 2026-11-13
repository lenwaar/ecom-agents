---
agent: developpeur-web
statut: validé   # toujours cette valeur
valide_par: humain
date_validation: 2026-11-13
date: 2026-11-13
sources: [docs/studio/BRIEF-STUDIO-DIRECT.md, docs/reference/studio-en-direct.html, tools/journal_claude.py, coordination/journal-direct.jsonl]
prochaine-etape: conformite-qa (audit du studio) puis validation humaine
---

# Studio en direct : étapes 1 à 3 (T53, synchro n°13)

## 1. Résumé

Le tableau de bord tourne en local dans `qg/studio/`. Il reprend la maquette validée et la branche sur les vrais fichiers. Il lit le journal de Claude Code en continu (Server-Sent Events), les livrables `à-valider` de `outputs/`, le calendrier et les vidéos de `medias/`. Le seul bouton qui écrit est « Valider ». Le mode « Simulation d'un cycle » reste disponible. 10 tests sur 10 passent.

Ce qui manque encore : rien ne fait travailler le poste Cowork (aucune source dans le journal), aucune vraie progression en pourcentage, et pas de compteurs d'abonnés ni de coût réel (affichés « — »).

## 2. Fonctionnalités livrées

Aucun commit (demande de Claude Code : c'est lui qui commite, avec le message `feat(qg): studio en direct`).

| Étape | Livré |
|---|---|
| 1. Journal | `serveur.js` (Node seul, sans dépendance, 127.0.0.1 uniquement) lit `coordination/journal-direct.jsonl` en continu (`fs.watchFile` + `fs.watch`), garde les lignes incomplètes, repart de zéro si le fichier est vidé, renvoie les 300 derniers événements à l'ouverture et reprend avec `Last-Event-ID` après une coupure. `public/direct.js` contient la correspondance (logique pure, testée) ; `public/app.js` affiche l'équipe, la salle et le journal. |
| 2. À valider | `POST /api/valider` remplace seulement `statut: à-valider` par `statut: validé` dans l'en-tête, en gardant le commentaire de la ligne. Il ajoute `valide_par: humain` et `date_validation: AAAA-MM-JJ`. La confirmation se fait dans la page, sans `confirm()`. Le calendrier (vidéos prêtes, scripts) s'affiche **sans bouton**, avec la mention « à faire par toi ou par Cowork sur ton accord ». |
| 3. Indicateurs | Vidéos produites = nombre de MP4 dans `medias/`. Agents au travail = journal. Attend ton accord = livrables `à-valider`. Coût et abonnés : « — ». Compteurs des plateformes et semaine = `marketing/calendrier.md` (vide aujourd'hui, donc 0). Dernière vidéo = MP4 le plus récent, avec aperçu, durée et taille lues dans le fichier, lien vers le fichier, et statut du dernier rapport `studio-video` (« aucun » aujourd'hui). |

Correspondance avec le journal :
- un lancement d'agent (`outil` Agent ou Task, `cible` = agent) met le poste au travail ;
- toute action d'un agent (`agent` renseigné) le garde au travail, et son statut affiche l'action ;
- `SubagentStop` remet l'agent au repos, ou en « attend ta validation » s'il a un livrable `à-valider` ;
- une commande qui contient `piper` ou `whisper` allume Piper ;
- quand un agent se termine puis que le suivant est lancé, une carte vole de l'un à l'autre.

Sécurité :
- en-tête `Host` vérifié (protection contre le rebinding DNS) ;
- `Origin` exigé sur le POST ;
- nom de fichier simple seulement, ni `..`, ni sous-dossier, ni chemin absolu, avec vérification par `realpath` ;
- politique CSP `'self'` ;
- `/medias/` limité aux images et aux vidéos.

## 3. Écarts avec le brief et pourquoi

1. **Cowork (Publication)** reste au repos en direct, avec la mention « avec ton accord » : le journal ne contient aucun événement de Cowork. Il ne s'anime qu'en simulation.
2. **Barre de progression** : le journal ne donne aucun avancement. Quand l'agent travaille, la barre est donc animée sans pourcentage. Elle est pleine quand l'agent a terminé.
3. **`SubagentStop` sans nom d'agent** : c'est le cas dans le journal réel (`agent` vide). Le studio arrête alors le dernier agent lancé, y compris s'il est hors des 8 postes (par exemple `developpeur-web`). Si plusieurs agents tournent en parallèle, il peut se tromper d'agent. À corriger dans `tools/journal_claude.py` si Claude Code fournit `agent_type` à l'arrêt (fichier non modifié ici).
4. **Agent sans événement de fin** : il repasse au repos après 30 minutes sans nouvelles. Le journal ne donne que l'heure, pas la date : son ancienneté est donc estimée.
5. **Date ajoutée** : la ligne s'appelle `date_validation`, car le champ `date` existe déjà (date de création du livrable).
6. **Simulation** : le bouton « Publier » de la maquette est retiré, même en simulation. Il est remplacé par la mention « à faire par toi ou par Cowork sur ton accord ». Le bouton de la simulation s'appelle « Valider (simulation) » et n'appelle jamais le serveur.
7. **Coût du studio** : il affiche « — », car aucune source de dépenses n'existe. La veille des licences parle de 0 €, mais il s'agit d'un livrable `à-valider` et pas d'un relevé de dépenses.
8. **Polices** : copiées dans `public/polices/` avec leur licence OFL : Cormorant Garamond 600, Inter variable et JetBrains Mono 400/600, en version Fontsource 5.3.0, sous-ensemble latin.
9. **En direct, plusieurs postes sont en « attend ta validation »** (Margaux, Iris, Louise) : 18 livrables sont réellement `à-valider` dans `outputs/`. C'est l'état réel du dépôt.

## 4. Vérifications faites

- `npm test` : 10 tests sur 10 réussis.
  - 6 tests unitaires de correspondance.
  - Étape 1 : 6 événements écrits dans une **copie** du journal font passer Théo au travail (avec Piper), puis au repos. Le test vérifie aussi qu'aucune requête ne sort du serveur local.
  - Étape 2 : le faux livrable est dans un dossier temporaire. Le fichier ne change pas avant la confirmation ; après, son contenu est exactement celui attendu. Les requêtes suivantes sont refusées : traversée (`../`, `..\`), chemin absolu, sous-dossier, autre origine, autre hôte, déjà validé. Le fichier hors du dossier de test n'a pas bougé.
  - Étape 3 : indicateurs, « — », aucun bouton Publier, Envoyer, Payer ou Activer ; captures sur ordinateur et sur mobile.
  - Mode simulation, puis retour au direct.
- Contrôle sur le vrai dépôt, en lecture seule : écoute sur `127.0.0.1:4178` seulement ; un `Host` étranger reçoit une réponse 421. Le serveur a ensuite été arrêté : aucun processus ne reste en tâche de fond.
- Aucun vrai livrable n'a été validé ni modifié.
- Captures : `outputs/qg/studio-direct-theo-au-travail.png`, `studio-direct-theo-au-repos.png`, `studio-direct-confirmation.png`, `studio-direct-final-ordinateur.png`, `studio-direct-final-mobile.png`.

## 5. Comment voir le studio en local

```
cd qg/studio
npm start
```
Ouvrir http://127.0.0.1:4178/. Pour lancer les tests : `npm install` puis `npm test`.

## 6. Ce qui demande l'humain

- Valider ce rapport après l'audit de `conformite-qa`.
- Le bouton « Valider » modifie de vrais livrables : à n'utiliser qu'en connaissance de cause.
- Plus tard : brancher les statistiques des plateformes et un relevé des dépenses quand ils existeront.
