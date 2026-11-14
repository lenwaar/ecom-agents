---
agent: studio-video
date: 2026-11-13
statut: validé
valide_par: humain
date_validation: 2026-11-14
mode: brouillon 540×960 (T73 partie 2, synchro n°16)
sources: [outputs/2026-11-13-createur-contenu-modeles-pub-robotime.md, docs/studio/BRIEF-STUDIO.md, docs/retours-experience.md, knowledge/decisions.md, knowledge/memo.md, medias/licences.md]
prochaine-etape: conformite-qa (brouillon), puis version finale après accord écrit de Robotime
---

# Modèles de pub Robotime : brouillons 540×960

## Résultat
Les 3 modèles sont rendus en brouillon : 540×960, 30 i/s, H.264 et AAC, durées exactes du script. Chaque « MÉDIA FOURNISSEUR n°X » est un cadre gris `#111827` tramé, avec le numéro, la nature, la durée et la description du média attendu. Les variables restent affichées entre accolades, soulignées en laiton. Les lignes « À VÉRIFIER » portent un repère visible, et le filigrane « BROUILLON : modèle à compléter » est présent sur toute la durée. Pas de voix, pas de visage. Le son vient uniquement d'une mélodie et de bruitages fabriqués par le code (`outils/son.py`).

| Modèle | MP4 (hors Git) | Planche contact | Son mesuré sur le MP4 |
|---|---|---|---|
| A Accroche, 18 s | `medias/brouillons/modeles-pub-robotime/modele-pub-robotime-A-accroche-brouillon-540x960.mp4` | `medias/apercus/modeles-pub-robotime/planche-contact-A-brouillon.jpg` | -14,6 LUFS, crête -2,1 dBTP |
| B Démonstration, 25 s | `…-B-demonstration-brouillon-540x960.mp4` | `…/planche-contact-B-brouillon.jpg` | -14,6 LUFS, crête -2,0 dBTP |
| C Avant/après, 20 s | `…-C-avant-apres-brouillon-540x960.mp4` | `…/planche-contact-C-brouillon.jpg` | -14,6 LUFS, crête -2,3 dBTP |

Il y a aussi une image clé par plan : `medias/apercus/modeles-pub-robotime/brouillon-<plan>.jpg`. Les sources sont dans `studio/video/modeles-pub-robotime/` : `plans.ts`, `ModelesPub.tsx`, `props/`, `audio.py`, `assembler.sh`, `images_cles.py`, `README.md` et `medias/ATTENDUS.md`. Les compositions `modele-pub-A|B|C` sont déclarées dans `src/Racine.tsx`.

## Grille §5 (sur le brouillon ; à refaire sur la version finale, §11)
- [x] L'accroche est lisible sans le son en moins de 2 s (texte posé dès 0,1 s).
- [ ] Un changement visuel toutes les 1,5 à 3 s : pas tout à fait. Les plans A3, A4, B2, B7, C5 et C6 durent 4 à 5 s et n'ont qu'un ou deux temps de texte. C3 tient 3,5 s. Ce sont les médias officiels qui apporteront le mouvement.
- [x] Sous-titres : sans objet, il n'y a pas de voix. Le texte à l'écran est entre y = 340 et y = 1490, en 36 px minimum à l'échelle 1080×1920.
- [x] Pas de saturation. Il n'y a pas de voix, donc pas de mixage voix-musique à contrôler.
- [x] Mouvements : entrées en courbe douce, positions au pixel entier à l'arrêt, aucune rotation en mouvement.
- [x] Couleurs et polices de la marque, aucun emoji.
- [ ] Mentions : `{MENTION_IMAGES}` figure sur chaque plan fournisseur, mais aucune mention « publicité » n'est prévue (voir les défauts du script).
- [x] Droits : une ligne T73 est ajoutée dans `medias/licences.md` (polices OFL, son de création interne, aucune image).
- [x] Aucun chiffre, prix, délai ou avis inventé.
- [x] Images clés exportées. J'ai regardé les trois planches contact et une image en taille réelle (B8) : rien de coupé, rien de flou, rien hors de la zone sûre.
- [x] Aucun plan vide. Le fondu laiton de 1 s du plan C4 passe par-dessus C3 puis découvre C5 : le voile n'est jamais seul à l'écran.
- [x] Son entre -14 ± 1 LUFS et crête sous -1 dBTP, mesurés avec `ebur128` sur chaque MP4.

## Défauts du script à corriger (createur-contenu)
1. `{DÉLAI_MONTAGE}` (plan B8) n'est pas déclarée dans le tableau des variables.
2. Aucune mention « publicité » n'est prévue, alors que la grille §5 la demande pour une pub.
3. C4 est un plan de 1 s sans contenu, ce que la grille §5 interdit : je l'ai monté en voile superposé (à valider).
4. La voix de B8, « une ou deux soirées », est une durée sans source.
5. Le §6.1 demande du 1080×1920 alors qu'un brouillon se rend en 540×960 (§11).
6. La version avec voix n'est pas faite : on ne peut pas la générer tant que les variables ne sont pas remplies.

## Reste à faire pour la version finale
Déposer les médias `A1.mp4`, `A3.jpg`, etc. dans `studio/video/modeles-pub-robotime/medias/A|B|C/`. Créer `props/<M>-final.json` avec `brouillon: false`, les médias, la valeur de chaque variable relevée sur la fiche, et les lignes ou plans retirés. Lancer ensuite `sh modeles-pub-robotime/assembler.sh final` (1080×1920), puis repasser la grille §5 et la mesure du son sur le fichier final. Facultatif : une voix Piper `fr_FR-siwis-medium` avec son crédit CC BY 4.0.

## ACTION HUMAINE
- Obtenir l'accord écrit de Robotime sur les médias officiels, sur la formule `{MENTION_OFFICIELLE}` et sur l'usage du son d'origine des vidéos.
- Relever le prix, le délai et le nombre de pièces de chaque produit sur la fiche AliExpress.
- Valider le fondu C4 superposé et décider de la mention « publicité ».
