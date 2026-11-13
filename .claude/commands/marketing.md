---
description: Pilote marketing de la semaine : tendances, calendrier, scripts, vidéos, lettre, pubs, bilan chiffré, décisions pour l'humain
---

Tu fais tourner le cycle marketing de la semaine décrit dans `docs/studio/BRIEF-STUDIO.md` (§7). Lance les agents **l'un après l'autre** (ils ne peuvent pas s'appeler entre eux) et saute une étape si elle n'a pas de matière.

1. `analyste-marche` : tendances, saison et pubs concurrentes de la semaine, 1 page maximum.
2. `createur-contenu` : met à jour `marketing/calendrier.md` (4 semaines glissantes) et écrit les scripts de la semaine au statut `à-valider`.
3. `studio-video` : produit les vidéos dont le script est au statut `validé` (jamais les autres).
4. `crm-email` : lettre de la semaine, seulement si un outil d'envoi est en place.
5. `media-acquisition` : bilan des pubs en cours (si elles existent) et propositions chiffrées.
6. `pilotage-finance` : coût par vente comparé à la marge, alertes.
7. Écris `marketing/semaine-AAAA-SS.md` : ce qui a été produit, les chiffres (avec source), et la liste **DÉCISIONS POUR L'HUMAIN** (scripts à valider, vidéos à publier, budgets à approuver).
8. Lance `py tools/verifier_livrables.py`, commit `chore(marketing): semaine AAAA-SS`, push, et une ligne dans `coordination/vers-cowork.md`.

Rien n'est publié, envoyé, payé ni activé sans l'accord explicite de l'humain.
