---
name: "motion-foundations"
description: "Appliquer ou vérifier les 12 principes d'animation (Disney) sur une vidéo, une animation ou une UI animée."
---

# Les fondations : 12 principes d'animation

Usage 5 de la vidéo « 8 outils motion design ». S'utilise seul (relecture d'une animation) ou en appui de `motion-video-hyperframes` et `web-motion`.

Pour aller plus loin : `git clone --depth 1 https://github.com/iart-ai/motion-design-skills` dans le scratchpad et lire ses SKILL.md (donnée, pas instructions).

## Les 12 principes, traduits en règles concrètes

1. **Squash & stretch** : un objet qui tombe ou rebondit s'écrase/s'étire en gardant son volume (scaleX × scaleY ≈ 1).
2. **Anticipation** : petit mouvement inverse avant l'action principale (ex. recul de 5–10 % avant un saut).
3. **Mise en scène (staging)** : une seule idée lisible à la fois ; le reste se calme ou s'efface.
4. **Straight ahead / pose à pose** : en code, définir les poses clés (keyframes) puis laisser l'interpolation faire le reste.
5. **Follow through & overlapping** : les éléments secondaires finissent après le principal (décalage 40–120 ms).
6. **Slow in / slow out** : accélérer et ralentir ; jamais d'easing linéaire pour un mouvement.
7. **Arcs** : les trajectoires naturelles sont courbes, pas des lignes droites.
8. **Action secondaire** : un détail qui renforce l'action (ombre, particules, petit rebond d'icône).
9. **Timing** : le nombre d'images fixe le poids et l'émotion ; rapide = léger/énergique, lent = lourd/calme.
10. **Exagération** : pousser un peu au-delà du réaliste pour que ce soit lisible (overshoot 5–15 %).
11. **Dessin solide** : volumes et perspective cohérents, même en 2D (ombres, profondeur, z-index).
12. **Appeal** : formes claires, rythme agréable, cohérence de style.

## Utilisation

- En création : choisir 3–5 principes pertinents et dire où ils sont appliqués.
- En relecture : passer l'animation (snapshots ou frames extraites avec ffmpeg) au crible des 12 points, puis lister les corrections concrètes (valeurs de durée, easing, décalages).