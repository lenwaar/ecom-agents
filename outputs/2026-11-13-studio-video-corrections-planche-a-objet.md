---
agent: studio-video
statut: validé
valide_par: humain
date_validation: 2026-11-13
date: 2026-11-13
mode: production (T56, synchro n°14)
sources: [outputs/2026-11-13-conformite-qa-videos-planche-a-objet.md, outputs/2026-11-13-studio-video-de-la-planche-a-l-objet.md, docs/studio/BRIEF-STUDIO.md, docs/retours-experience.md, knowledge/marque.md, medias/licences.md, medias/voix/de-la-planche-a-l-objet.md, site/src/content/produits/boite-a-musique-manivelle.md]
prochaine-etape: conformite-qa (contre-audit court T58), puis humain (vérification INPI du nom, écoute, accord de publication)
---

# Corrections des vidéos « De la planche à l'objet » (v1 et v2)

Tâche T56, synchro n°14. Base : l'audit `outputs/2026-11-13-conformite-qa-videos-planche-a-objet.md` (verdict BLOQUANT) et les remarques de l'humain transmises par Cowork. Le rapport d'origine (`outputs/2026-11-13-studio-video-de-la-planche-a-l-objet.md`, validé) n'est pas modifié ; ce rapport le complète.

Rien n'est publié. Aucun commit, aucun push. Le nom « Rouage & Laiton » (A1) n'est pas changé : l'humain vérifie l'INPI.

## 1. Résultat

| Version | Fichier (même nom qu'avant) | Image | Durée | Taille | Son (mesuré sur le MP4 final, `ebur128`) |
|---|---|---|---|---|---|
| v1, sous-titres seulement | `medias/de-la-planche-a-l-objet-9x16.mp4` | 1080×1920, 30 i/s, 600 images, H.264 | 20,0 s | 8 410 699 octets (8,0 Mo) | **-14,0 LUFS**, crête -4,8 dBTP, LRA 3,0 LU |
| v2, voix Piper | `medias/de-la-planche-a-l-objet-9x16-voix.mp4` | 1080×1920, 30 i/s, 600 images, H.264 | 20,0 s | 8 442 305 octets (8,1 Mo) | **-14,2 LUFS**, crête -4,9 dBTP, LRA 3,9 LU |

Avant : v1 -14,0 LUFS, v2 **-14,9 LUFS** (à la limite de la tolérance ± 1 : la cible n'était pas atteinte). Aucune saturation : la crête vraie reste sous -1 dBTP. Audio AAC 192 kb/s stéréo 48 kHz. Écart voix et musique en v2 : 15,0 dB (voix -14,7 dB, musique -29,7 dB en RMS des passages actifs, avant normalisation).

## 2. Corrections faites

| # | Demande | Ce qui a changé | Où |
|---|---|---|---|
| 1 | Appel final « Suivez-nous » (A3) | Bouton de fin « Suivez-nous » dans les deux versions. En v2, la dernière réplique Piper a été regénérée (même voix `fr_FR-siwis-medium`, `--length-scale 1.08`) : « Rouage et Laiton. Suivez-nous. », départ avancé de 17,10 à 16,95 s pour finir avant le fondu de sortie (fin de la voix à 19,2 s). Temps des mots recalculés avec faster-whisper `large-v3` sur la nouvelle piste ; `.json` et `.srt` refaits (13 groupes, dernier : « Suivez-nous. » de 18,22 à 18,92 s). Les sous-titres restent masqués sur la carte de fin (le logo et le bouton portent le texte). | `src/DeLaPlancheALObjet.tsx`, `outils/planche_a_objet_audio.py`, `outils/planche_a_objet_props.py`, `medias/voix/de-la-planche-a-l-objet.{md,mp3,json,srt}` |
| 2 | Mention plus grande, dans la zone sûre (A2) | Pastille de 30 à **36 px** (Inter 600, texte crème sur fond nuit à 78 %, filet laiton), posée à **y = 320 px** (sous les 288 px des 15 % du haut), centrée entre x = 110 et 970 : hors de la barre d'onglets en haut, hors de la colonne de boutons à droite (elle commence vers y = 900) et hors de la légende du bas. Texte v1 : « Rendus 3D de démonstration, / produit non vendu ». Texte v2 : « Rendus 3D de démonstration, / produit non vendu, / voix de synthèse (IA) ». Le composant refuse de se rendre au-dessus de la zone sûre. Pour laisser la place : étiquettes du comparateur « La planche » / « L'objet » descendues à y = 520, curseur raccourci (500 à 1530 px), cartes en verre à y = 500, scène de nuit descendue de 100 px. | `effets/commun.tsx` (`Mention`, `MENTION`), `effets/PlancheAObjet.tsx`, `src/DeLaPlancheALObjet.tsx` |
| 3 | Plan presque vide avant le logo | La carte de fin arrivait par un fond nuit seul pendant environ 0,3 s (logo encore transparent et flou). Maintenant : **fondu enchaîné de 6 images** depuis la scène de nuit, et le logo est déjà présent à la coupe (animation avancée de 8 images). Durée totale inchangée : 20,0 s, aucun trou (voir `v2-06c-enchainement-fin.jpg`). Le petit texte gris « Produit de démonstration, non vendu. » du bas de la fin est retiré : la pastille du haut le dit en plus grand pendant toute la vidéo. | `src/DeLaPlancheALObjet.tsx` (`FinEnchainee`), `effets/FinAppel.tsx` (option `avance`) |
| 4 | Carte « Entraînement » nette et entière | Cause : le titre « ENTRAÎNEMENT » (30 px, interlettrage 1,5) dépassait la largeur utile de la carte et était coupé ; les cartes tournées ou placées au demi-pixel étaient rendues floues. Correction : cartes de 312 px, écart 18 px, marge de 54 px de chaque côté ; titres en 26 px, crème, sans retour à la ligne ; déplacements arrondis au pixel entier et rotation nulle dès que la carte est posée. Vérifié en taille réelle : les trois cartes sont nettes et entières. | `effets/CartesVerre.tsx` |
| 5 | Son autour de -14 LUFS | Nouvel outil `outils/normaliser_lufs.py` : mesure EBU R128, gain, limiteur doux à -2 dBFS sur signal suréchantillonné, deux itérations, mesure de contrôle. L'ancien `loudnorm` linéaire abandonnait la cible quand la crête limitait le gain (v2 restée à -14,9). L'assemblage mesure ensuite la piste du MP4 final. | `outils/normaliser_lufs.py`, `outils/planche_a_objet_assembler.sh` |
| A4 | Mélodie qui n'est pas l'air du produit | Phrase dans les deux légendes (§4) ; note dans `medias/voix/de-la-planche-a-l-objet.md`. | §4, fichier voix |
| A5 | « laissez briller le laiton » | Note ajoutée dans `medias/voix/de-la-planche-a-l-objet.md` : réplique réservée à la démonstration, à ne réutiliser pour un vrai produit que si la fiche fabricant prouve des pièces en laiton visibles. Vidéos inchangées sur ce point (comme le demande l'audit). | fichier voix |
| A6 | Version courte du crédit | Remplacée par la version de l'audit (auteurs et lien de la licence). La version complète va partout où elle tient. | §4 |
| A7 | Légendes prêtes v1 et v2 | Écrites au §4. | §4 |
| A2 (légende) | « non vendu » en tête | Les deux légendes commencent par « Produit de démonstration, non vendu. » | §4 |

Autres fichiers mis à jour : `medias/licences.md` (renvoi du crédit de la voix vers la légende v2 de ce rapport), `studio/video/effets/README.md` (commande d'assemblage), `src/Exemples.tsx` et `src/Racine.tsx` (mention et appel à jour ; exemples de 3 s `ex-cartes-verre` et `ex-fin-appel` rendus à nouveau dans `.cache/effets/`).

Ajouts demandés :
- **Grille §5 du brief** (`docs/studio/BRIEF-STUDIO.md`) : 4 points ajoutés (mention en zone sûre et lisible, aucun plan vide, cartes et textes nets et entiers, son à -14 LUFS ± 1 mesuré sur le MP4 final).
- **Leçon n° 14** dans `docs/retours-experience.md`.

## 3. Grille de qualité §5 recochée (sur les nouveaux MP4)

- [x] **Accroche lisible en moins de 2 s, sans le son** : « De la planche à *l'objet.* », complet à 0,9 s (inchangé). Seule la toute première image (0,0 s) est encore sombre, avant le premier mot (moins de 0,15 s) : choisir une image de couverture après 1 s à la publication.
- [x] **Un changement visuel toutes les 1,5 à 3 s** : coupes ou événements à 0 ; 2,0 ; 4,6 ; 5,5 ; 6,9 ; 8,0 ; 10,8 ; 13,4 ; 14,2 ; 16,8 s. Plus long intervalle 2,6 s.
- [x] **Sous-titres lisibles et en zone sûre** : Inter 700, 64 px, à y = 1290 px (inchangés).
- [x] **Voix nette, musique 12 à 18 dB sous la voix, pas de saturation** : écart 15,0 dB ; crête -4,9 dBTP. Netteté de la nouvelle réplique « Suivez-nous » : faster-whisper la transcrit sans erreur (probabilité 0,999 et 1,0) ; écoute humaine toujours conseillée.
- [x] **12 principes d'animation, aucun mouvement linéaire** : inchangés ; le fondu enchaîné de la fin suit une courbe d'arrivée douce.
- [x] **Couleurs et polices de `knowledge/marque.md`, aucun emoji**.
- [x] **Mentions** : « Rendus 3D de démonstration, produit non vendu » de 0 à 20 s ; en v2, « voix de synthèse (IA) » en plus. « Publicité » : sans objet (pas une pub).
- [x] **Droits notés** : `medias/licences.md` (aucun nouveau média tiers ; la réplique regénérée utilise la même voix sous CC BY 4.0).
- [x] **Aucune promesse chiffrée, fausse promo ni faux avis** : aucun chiffre ajouté.
- [x] **Images clés exportées** : `medias/apercus/de-la-planche-a-l-objet/` (12 images par version, dont la nouvelle `06c-enchainement-fin`, et `planche-contact-v1.jpg` / `planche-contact-v2.jpg`, 14 images chacune, une toutes les 1,43 s). Toutes regardées.
- [x] **Mention en zone sûre et lisible** (nouveau point) : 36 px, y = 320 à environ 480 px en v2, centrée, hors des zones d'interface.
- [x] **Aucun plan vide** (nouveau point) : la planche contact ne montre plus de fond seul avant le logo ; le noir de « Éteignez les lumières » est un effet voulu de 2 images (0,07 s).
- [x] **Cartes et textes nets et entiers** (nouveau point) : vérifié sur une image en taille réelle (15,3 s) et sur `v1-06b` / `v2-06b`.
- [x] **Son à -14 LUFS ± 1** (nouveau point) : v1 -14,0, v2 -14,2 LUFS, mesurés sur les MP4 finaux.

## 4. Légendes de publication prêtes à copier (proposition, à valider par l'humain)

Textes repris de l'audit (§2.3), avec « non vendu. » en tête comme demandé. Aucun hashtag ni lien ajouté : à compléter par l'humain ou `createur-contenu` si besoin, sans chiffre ni promesse.

**Légende v1** (`de-la-planche-a-l-objet-9x16.mp4`, toutes plateformes) :
```
Produit de démonstration, non vendu. Images : rendus 3D de démonstration. Musique : mélodie originale de synthèse, ce n'est pas l'enregistrement du produit.
```

**Légende v2** (`de-la-planche-a-l-objet-9x16-voix.mp4`, toutes plateformes ; le crédit de la voix fait partie de la légende) :
```
Produit de démonstration, non vendu. Images : rendus 3D de démonstration. Musique : mélodie originale de synthèse, ce n'est pas l'enregistrement du produit.
Voix de synthèse (IA) générée avec Piper, voix fr_FR-siwis-medium. Données d'entraînement : « The SIWIS French Speech Synthesis Database », J. Yamagishi, P.-E. Honnet, P. Garner, A. Lazaridis, University of Edinburgh (doi.org/10.7488/ds/1705) et « Hi-Fi Multi-Speaker English TTS Dataset », E. Bakhturina, V. Lavrukhin, B. Ginsburg, Y. Zhang (openslr.org/109), sous licence CC BY 4.0 (creativecommons.org/licenses/by/4.0). Voix utilisée pour lire un texte original.
```
Longueur : environ 730 caractères, sous les limites de légende de TikTok, Instagram et YouTube (`À VÉRIFIER` dans l'interface au moment de publier).

**Version courte du crédit** (remplace celle du rapport d'origine ; seulement si une plateforme refuse la longueur) :
```
Produit de démonstration, non vendu. Voix IA : Piper fr_FR-siwis-medium. Données : SIWIS (Yamagishi, Honnet, Garner, Lazaridis, Univ. of Edinburgh, doi.org/10.7488/ds/1705) et Hi-Fi TTS (Bakhturina et al., openslr.org/109), CC BY 4.0 (creativecommons.org/licenses/by/4.0). Rendus 3D de démonstration. Musique de synthèse, pas l'enregistrement du produit.
```

Pour la v2, activer aussi l'étiquette « contenu généré par IA » de TikTok et d'Instagram (règle de plateforme, à vérifier dans l'interface).

## 5. Commandes (refaire les deux vidéos)

```
cd studio/video
py -m piper -m .cache/voix-piper/fr_FR-siwis-medium.onnx --length-scale 1.08 -f .cache/voix/l7.wav -- "Rouage et Laiton. Suivez-nous."
py outils/planche_a_objet_audio.py
py outils/whisper_mots.py .cache/audio/voix.wav .cache/sous-titres/mots-v2.json
py outils/planche_a_objet_props.py .cache/sous-titres/mots-v2.json
npx remotion render src/index.ts DeLaPlancheALObjet .cache/rendus/v1.mp4 --public-dir=.cache/public --props=.cache/sous-titres/props-v1.json --muted
npx remotion render src/index.ts DeLaPlancheALObjet .cache/rendus/v2.mp4 --public-dir=.cache/public --props=.cache/sous-titres/props-v2.json --muted
sh outils/planche_a_objet_assembler.sh
```
Un seul rendu à la fois (mémoire du PC limitée), jamais pendant `orbite.js`.

## 6. Limites connues

- Image 0 (0,0 s) sombre avant le premier mot du titre : sans effet à la lecture, mais à éviter comme couverture (choisir une image après 1 s).
- Exemple de 3 s `ex-cartes-verre` (catalogue, hors vidéo) : les cartes passent sur le couvercle clair et se lisent mal ; dans la vidéo, l'image est décalée et le problème n'existe pas (déjà noté en T54).
- Je ne peux pas écouter : niveau ressenti, netteté de « Suivez-nous » et absence de pompage du limiteur restent à confirmer à l'oreille.

## 7. Statut et suite

Statut : `à-valider`. Prochaine étape : contre-audit court de `conformite-qa` (T58). Le point A1 (nom « Rouage & Laiton » non vérifié) reste **bloquant pour toute publication** tant que l'humain n'a pas vérifié l'INPI, TMview, le domaine et les comptes.

## ACTION HUMAINE

1. **Vérifier le nom « Rouage & Laiton »** (A1) : data.inpi.fr et TMview, classes 28 et 35, domaine et noms de compte ; noter le résultat dans `knowledge/marque.md`. S'il n'est pas libre, studio-video refait les deux vidéos (carte de fin, voix, `.srt`).
2. **Regarder et écouter** les deux MP4 : nouvelle réplique « Rouage et Laiton. Suivez-nous. », niveau sonore, fondu vers le logo, taille de la pastille.
3. **Valider le texte** : ajout de « Suivez-nous. » dit par la voix en v2 (`medias/voix/de-la-planche-a-l-objet.md`).
4. **Valider les légendes du §4** et, à la publication (seulement après ton accord), activer l'étiquette « contenu généré par IA » pour la v2 et choisir une couverture après 1 s.
5. **Décider de publier ou non** un produit de démonstration non vendu (rien n'est publié).
