# Brief : « Studio en direct », le tableau de bord des agents vidéo

Rédigé par Cowork le 2026-11-13, à la demande de l'humain, d'après une vidéo de référence (« My AI employees need permission » : une salle où chaque agent travaille à son bureau, les livrables passent de l'un à l'autre, et une colonne « Needs your OK » attend l'humain).

**Référence visuelle validée** : `docs/reference/studio-en-direct.html` (maquette en ligne, données simulées). La version à construire est la même interface, mais branchée sur les vrais fichiers du dépôt. C'est la pièce F (Studio) du QG : `docs/qg/BRIEF-QG.md` s'appuiera dessus.

## 1. Ce que l'humain voit

| Zone | Contenu | Source réelle |
|---|---|---|
| Indicateurs (haut) | vidéos produites, agents au travail, validations en attente, coût du studio, abonnés et vues | `medias/*.mp4`, journal, livrables `à-valider`, budget de `knowledge/`, plus tard les statistiques des plateformes (vide tant qu'aucun compte n'existe : afficher « — », jamais de chiffre inventé) |
| L'équipe (gauche) | 8 postes : Margaux (analyste-marche), Jade (createur-contenu), Iris (studio-visuel), Théo (studio-video), Piper (voix et sous-titres, outil local), Louise (conformite-qa), Malo (media-acquisition), Cowork (publication) ; statut en une ligne et barre de progression | journal en direct |
| Chaîne de production (centre) | compteurs TikTok, Reels, Shorts, Pinterest ; la salle avec les 8 bureaux, l'écran de chaque agent qui s'anime quand il travaille ; une carte qui vole d'un bureau à l'autre quand un livrable passe | `marketing/calendrier.md`, journal |
| À valider (droite) | chaque élément qui attend l'humain, avec un bouton | livrables au statut `à-valider` dans `outputs/`, scripts, vidéos prêtes à publier, pubs en pause |
| Journal en direct (droite) | les événements, le plus récent en haut | `coordination/journal-direct.jsonl` |
| Cette semaine (bas) | créneaux de publication prévus | `marketing/calendrier.md` |
| Dernière vidéo (bas) | vignette, durée, statut, lien vers le fichier | `medias/`, rapport `studio-video` le plus récent |

## 2. Le direct

- `tools/journal_claude.py` (mis à jour par Cowork) écrit maintenant aussi `coordination/journal-direct.jsonl` : une ligne JSON par événement avec `heure`, `type`, `agent` (le sous-agent qui agit, quand Claude Code le donne), `outil`, `cible` (l'agent lancé) et `texte`.
- Correspondance : « Lance l'agent X » met X au travail ; « AGENT TERMINÉ » le remet au repos ; un livrable `à-valider` le met en « attend ta validation » ; un événement entre la fin d'un agent et le lancement du suivant fait voler une carte de l'un à l'autre.
- Le serveur lit le fichier JSONL en continu (surveillance du fichier) et pousse les événements à la page (Server-Sent Events, sans bibliothèque).

## 3. Le bouton « Valider »

- Il change **seulement** le statut dans l'en-tête YAML du livrable (`à-valider` vers `validé`) et ajoute une ligne `valide_par: humain` et la date. Rien d'autre.
- Il n'existe **aucun** bouton qui publie, envoie, paie ou active une pub : ces éléments s'affichent avec la mention « à faire par toi ou par Cowork sur ton accord ».
- Confirmation dans la page avant chaque validation (pas de `confirm()` du navigateur).

## 4. Technique

- Dossier `qg/studio/` : `serveur.js` (Node, sans framework), `public/index.html` repris de la maquette, `public/app.js` qui remplace la simulation par le flux réel. Un mode « Simulation » reste disponible pour la démonstration.
- Écoute **uniquement sur 127.0.0.1**. Lancement : `cd qg/studio`, `npm start`, puis ouvrir l'adresse affichée.
- Aucune dépendance externe au chargement (polices en local), fonctionne hors ligne.
- `coordination/journal-direct.jsonl` est ajouté au `.gitignore`.
- Test : un script qui écrit 6 événements factices dans une copie du journal et vérifie que la page passe Théo au travail puis au repos (Playwright, capture dans `outputs/qg/`).

## 5. Étapes

1. Serveur et page branchés sur le journal (équipe, salle, journal en direct). Capture.
2. « À valider » branché sur `outputs/` avec le bouton Valider. Test sur un faux livrable dans un dossier de test.
3. Calendrier, dernière vidéo, indicateurs. Capture finale, commit `feat(qg): studio en direct`.

## Lancement

Construit par `developpeur-web` (T53, synchro n°13). Il faut Node 20 ou plus récent.

```
cd qg/studio
npm start
```

Ouvrir ensuite **http://127.0.0.1:4178/** (l'adresse s'affiche aussi dans le terminal). Pour arrêter : `Ctrl+C`.

- Aucune installation n'est nécessaire pour `npm start` : le serveur n'utilise que Node. `npm install` ne sert qu'aux tests (`playwright-core`, en dépendance de développement).
- Tests : `cd qg/studio`, `npm install`, puis `npm test` (copie du journal et faux livrable dans un dossier temporaire ; captures dans `outputs/qg/`).
- Variables facultatives : `STUDIO_PORT` (4178 par défaut), `STUDIO_JOURNAL`, `STUDIO_OUTPUTS`, `STUDIO_CALENDRIER`, `STUDIO_MEDIAS`, `STUDIO_RACINE`.
