---
agent: studio-video
statut: validé
valide_par: humain
date_validation: 2026-11-13
date: 2026-11-13
mode: production (T54, synchro n°13)
sources: [tests/scenarios/studio-video.md, docs/studio/BRIEF-STUDIO.md, docs/retours-experience.md, medias/voix-off-promo-v2.md, knowledge/marque.md, knowledge/catalogue-demo.md, site/src/content/produits/boite-a-musique-manivelle.md, outputs/2026-11-13-veille-outils-licences-studio-video.md, https://huggingface.co/rhasspy/piper-voices (MODEL_CARD siwis medium), https://datashare.ed.ac.uk/handle/10283/2353, https://www.openslr.org/109/ (consultées le 2026-11-13)]
prochaine-etape: conformite-qa, puis validation humaine (écoute de la voix, choix de publication)
---

# Vidéo « De la planche à l'objet » (boîte à musique, 20 s, 9:16)

Demande : la demande exacte du scénario `tests/scenarios/studio-video.md` (v1, sous-titres seulement) puis la même vidéo avec une voix off Piper `fr_FR-siwis-medium` (v2).
Produit : **Boîte à musique à manivelle**, produit de **démonstration** (`demo: true`, non vendu). Toutes les images sont des rendus 3D : mention « Rendus 3D de démonstration » visible du début à la fin (leçon 11).
Entrée : il n'existe pas de script `validé` de `createur-contenu` pour cette vidéo ; la demande précise de l'humain (scénario de test, tâche T54) en tient lieu. Le texte vient de `medias/voix-off-promo-v2.md`, adapté.

## 1. Storyboard seconde par seconde (écrit avant le rendu)

30 images par seconde, 600 images. Zone sûre : rien d'important dans les 288 px du haut ni les 384 px du bas. Sous-titres à y = 1290 px (pavé de 1290 à environ 1400 px).

| Temps | Plan | Effet du catalogue (§4) | Image | Texte à l'écran | Voix (v2 seulement) | Son |
|---|---|---|---|---|---|---|
| 0,0 – 2,0 s | 1. Accroche | `accroche-texte` | Fond nuit `#0A0F1A`, lueur laiton ; carte « planches » (vue `boite`) qui monte, recule (anticipation) puis grandit vers le plan 2 | Titre mot par mot, Cormorant 132 px : « De la planche / à *l'objet.* » (« l'objet » en laiton italique), lisible dès 0,6 s | « De la planche… à l'objet. » (0,2 s) | Mélodie de boîte à musique (entrée en fondu 0,4 s), souffle à 1,7 s |
| 2,0 – 4,6 s | 2. Les planches | (plan image, travelling avant) | Planches prédécoupées en plein cadre, fond crème, zoom 1,04 → 1,14 | Sous-titres : « Ça, c'est ce qu'il y a » / « dans la boîte. » | « Ça, c'est ce qu'il y a dans la boîte. » (2,25 s) | souffle à 4,3 s |
| 4,6 – 5,5 s | 3a. Comparateur, avant | `planche-a-objet` | Planches, étiquette « La planche » | « Une boîte à musique, » | « Une boîte à musique, à manivelle. » (4,9 s) | |
| 5,5 – 6,9 s | 3b. Balayage | `planche-a-objet` | Curseur laiton (recul puis balayage droite → gauche) : les planches deviennent la boîte montée (vue trois-quarts) | « à manivelle. » | | 9 tics de cliquet pendant le balayage |
| 6,9 – 8,0 s | 3c. Comparateur, après | `planche-a-objet` | Boîte montée, étiquette laiton « L'objet », léger zoom | (aucun) | | souffle à 7,7 s |
| 8,0 – 10,8 s | 4. Orbite | `orbite-produit` | Caméra 3D qui tourne de −20° à 70° autour de la boîte (lumière fixe, 90 images rendues par `studio/orbite.js`) | « Un écran de plus ? » / « Non. » | « Un écran de plus ? Non. » (8,25 s) | 6 tics d'engrenage, souffle à 10,5 s |
| 10,8 – 13,4 s | 5. Détail | (plan image, travelling avant + rotation) | Gros plan du cylindre à goupilles et du peigne (vue `detail`), vignette | « Un objet à construire. » | « Un objet à construire. » (11,05 s) | |
| 13,4 – 14,2 s | 6a. Lumière éteinte | `projecteur` (simplifié) | Noir franc, puis la scène de nuit s'allume en douceur | « Éteignez les lumières… » | « Éteignez les lumières… et laissez briller le laiton. » (13,65 s) | clic d'interrupteur à 13,38 s |
| 14,2 – 16,8 s | 6b. Cartes en verre | `cartes-verre` | Boîte sur le bureau la nuit (vue `situation`) ; 3 cartes de verre se posent en arc à 14,2 / 14,5 / 14,9 s puis flottent | Cartes : « Niveau : Facile », « Mécanisme : À peigne », « Entraînement : Manivelle » ; sous-titres « et laissez briller » / « le laiton. » | | 3 petits tics (cartes qui se posent) |
| 16,8 – 20,0 s | 7. Fin | `fin-appel` | Fond nuit, lueur laiton | « Rouage *&* Laiton », filet laiton, « Maquettes mécaniques en bois à assembler », bouton « Suivez l'atelier », « Produit de démonstration, non vendu. » | « Rouage et Laiton. » (17,1 s) | accord de boîte à musique (do-mi-sol-do) à 16,95 s, fondu de sortie 1,2 s |

Pendant toute la vidéo : pastille « Rendus 3D de démonstration » en haut (y = 300 px, juste sous les 15 %) ; en v2 : « Rendus 3D de démonstration · voix de synthèse (IA) ».

### Choix et sources du texte
- Valeurs des cartes : `difficulte: facile` et `mecanisme: peigne  # actionné par manivelle` de la fiche `site/src/content/produits/boite-a-musique-manivelle.md`. **Aucun chiffre** à l'écran : ni prix (produit non vendu), ni temps d'assemblage (3 h est une valeur de démonstration), ni nombre de pièces (`À VÉRIFIER`).
- « Ça, c'est ce que vous recevez. » (v2 d'origine) devient « Ça, c'est ce qu'il y a dans la boîte. » : le produit n'est pas en vente, on ne promet pas un envoi.
- « Maquettes mécaniques en bois à assembler » : promesse de `knowledge/marque.md`.
- « Suivez l'atelier » : appel à l'action sans promesse ni urgence (pas de lien de vente : la boutique n'est pas en ligne).
- Le détail du texte dit, réplique par réplique, est dans `medias/voix/de-la-planche-a-l-objet.md`.

### Principes d'animation appliqués (skill `motion-foundations`)
- **Anticipation** : la carte de l'accroche recule (0,97) avant de grandir ; le curseur du comparateur recule de 40 px avant de balayer.
- **Slow in / slow out** : toutes les courbes sont des Bézier (`0.16,1,0.3,1` et `0.65,0,0.35,1`) ou des ressorts ; l'orbite suit une courbe cubique ; aucun mouvement linéaire.
- **Follow through / chevauchement** : les mots du titre démarrent toutes les 5 images avant la fin du précédent ; l'étiquette « L'objet » arrive après le curseur ; cartes décalées de 10 images ; filet puis signature puis bouton dans la fin.
- **Arcs** : les cartes en verre entrent en courbe (décalage latéral + rotation qui se résorbe).
- **Exagération** : léger dépassement des ressorts (titre, cartes, bouton, mot actif des sous-titres agrandi de 5 %).
- **Action secondaire** : lueur laiton du curseur, reflet qui glisse sur les cartes, flottement lent, halo qui respire sur la fin.
- **Mise en scène** : une idée par plan, le titre disparaît avant que la carte n'envahisse le cadre.

## 2. Résultat

| Version | Fichier | Image | Durée | Taille | Son |
|---|---|---|---|---|---|
| v1 (sous-titres seulement) | `medias/de-la-planche-a-l-objet-9x16.mp4` | 1080×1920, 30 i/s, 600 images, H.264 | 20,0 s | 9 032 387 octets (8,6 Mo) | mélodie de boîte à musique + bruitages (fabriqués par le code), -14,0 LUFS |
| v2 (voix off Piper) | `medias/de-la-planche-a-l-objet-9x16-voix.mp4` | 1080×1920, 30 i/s, 600 images, H.264 | 20,0 s | 9 111 303 octets (8,7 Mo) | voix `fr_FR-siwis-medium` + mélodie 15 dB dessous + bruitages, -14,9 LUFS |

Les deux fichiers font moins de 20 Mo : ils restent dans `medias/` (pas de copie dans `medias/brouillons/`). Audio AAC 192 kb/s stéréo 48 kHz, crête sous -1,5 dBTP (normalisation `loudnorm` en deux passes).

Images clés : `medias/apercus/de-la-planche-a-l-objet/` : 11 images par version (`v1-…`, `v2-…`, une par plan et par temps fort) + `planche-contact-v1.jpg` et `planche-contact-v2.jpg` (une image toutes les 1,6 s). Toutes regardées avant de conclure.

Fichiers de la voix (légers, commitables) : `medias/voix/de-la-planche-a-l-objet.md` (texte et origine de chaque réplique), `.mp3` (voix seule), `.json` (temps de chaque mot), `.srt`.

### Corrections faites après la relecture des images clés
1. Sous-titres coupés au hasard (« y a dans la ») : coupes choisies au sens (« Ça, c'est ce qu'il y a » / « dans la boîte. »), espace entre les mots agrandi (le mot actif agrandi mangeait l'espace : « àmanivelle »).
2. Titre d'accroche lisible en entier trop peu de temps (0,5 s) : mots plus rapides (toutes les 4 images, dès l'image 0), sortie repoussée à 1,67 s. Le titre est complet et net dès 0,9 s.
3. Premier mot de chaque réplique placé trop tôt par faster-whisper (il le fait commencer dans le silence qui précède) : recalé sur le départ réel de la réplique.
4. Curseur du comparateur qui passait sous la pastille de mention : abaissé.
5. Reflet des cartes en verre qui glissait de façon linéaire : remplacé par un passage avec ralenti (grille §5, « aucun mouvement linéaire »).
6. Rendu d'orbite interrompu une fois (« contexte WebGL perdu » pendant un rendu Remotion simultané) : reprise automatique, images avant et après la coupure identiques de réglage.

## 3. Grille de qualité §5 (cochée point par point)

- [x] **Accroche lisible en moins de 2 s, sans le son** : « De la planche à *l'objet.* » en 132 px sur fond nuit, complet à 0,9 s, visible jusqu'à 1,67 s ; la carte des planches sous le titre montre déjà le sujet.
- [x] **Un changement visuel toutes les 1,5 à 3 s** : coupes ou événements à 0 ; 2,0 ; 4,6 ; 5,5 (balayage) ; 6,9 (étiquette « L'objet ») ; 8,0 ; 10,8 ; 13,4 ; 14,2 (cartes) ; 16,8 s. Plus long intervalle : 2,6 s (2,0 – 4,6 s, avec travelling continu et changement de sous-titre à 3,6 s).
- [x] **Sous-titres lisibles et dans la zone sûre** : Inter 700, 64 px (minimum 48 px), pavé de y = 1290 à environ 1400 px, donc entre 288 px (15 % du haut) et 1536 px (20 % du bas). Le composant refuse de se rendre hors zone. Masqués pendant l'accroche (le titre porte le texte) et la carte de fin (le logo porte le nom).
- [x] **Voix nette, musique 12 à 18 dB sous la voix, pas de saturation** (v2) : écart mesuré 15,0 dB (niveau RMS des passages actifs : voix -15,0 dB, musique -30,0 dB avant normalisation), crête finale sous -1,5 dBTP. Netteté de la voix Piper : **à confirmer à l'écoute par l'humain** (je ne peux pas écouter ; contrôle indirect : sur la piste complète, faster-whisper `large-v3` ne se trompe que sur un mot, « puce » pour « plus », et retranscrit correctement cette réplique quand elle est isolée). v1 : pas de voix, la mélodie est le son principal.
- [x] **12 principes d'animation, aucun mouvement linéaire** : voir la liste du §1 ; toutes les animations passent par des courbes de Bézier, des ressorts ou des sinus (flottement), l'orbite par une courbe cubique.
- [x] **Couleurs et polices de `knowledge/marque.md`, aucun emoji** : nuit `#0A0F1A`, laiton `#C8A15A`, texte `#F5F1E8` / `#A8A29A` ; Cormorant Garamond (titres, logo, valeurs des cartes) et Inter (sous-titres, étiquettes, mention), auto-hébergées. Les flèches du curseur sont des triangles dessinés, pas des caractères.
- [x] **Mentions** : « Rendus 3D de démonstration » visible de 0 à 20 s (pastille en haut) + « Produit de démonstration, non vendu. » sur la fin ; v2 : « Rendus 3D de démonstration · voix de synthèse (IA) ». « Publicité » : sans objet (ce n'est pas une pub ; à ajouter si la vidéo est un jour sponsorisée).
- [x] **Droits notés** pour chaque son, musique, police, image et voix : `medias/licences.md` (voir §4).
- [x] **Aucune promesse chiffrée sans source, aucune fausse promo, aucun faux avis** : aucun chiffre à l'écran ni dans la voix (pas de prix, de temps d'assemblage, de nombre de pièces, de délai) ; cartes tirées de la fiche (`facile`, `peigne`, manivelle) ; aucun avis, aucune réduction, aucune urgence.
- [x] **Images clés exportées** dans `medias/apercus/de-la-planche-a-l-objet/`.

Critères du scénario `tests/scenarios/studio-video.md` : storyboard avant le rendu (§1, écrit avant le premier rendu) ; MP4 1080×1920, 30 i/s, 20 s ; images clés ; grille cochée ; mention visible et licences notées ; rapport au statut `à-valider` ; rien n'est publié.

## 4. Licences notées (`medias/licences.md`)

| Média | Licence | Crédit obligatoire |
|---|---|---|
| Police Cormorant Garamond (Christian Thalmann, via Fontsource) | SIL OFL 1.1 | Non |
| Police Inter (Rasmus Andersson, via Fontsource) | SIL OFL 1.1 | Non |
| Voix `fr_FR-siwis-medium` : jeu « The SIWIS French Speech Synthesis Database », Junichi Yamagishi, Pierre-Edouard Honnet, Philip Garner, Alexandros Lazaridis (University of Edinburgh, CSTR, 2017), https://doi.org/10.7488/ds/1705 | CC BY 4.0 | **Oui** |
| Voix de base (MODEL_CARD : « Finetuned from the U.S. English hifi_tts_92 base model », lectrice 92 Cori Samuel) : « Hi-Fi Multi-Speaker English TTS Dataset », Evelina Bakhturina, Vitaly Lavrukhin, Boris Ginsburg, Yang Zhang (2021), https://www.openslr.org/109/ | CC BY 4.0 | **Oui** (leçon 13 : toute la chaîne) |
| Piper `piper-tts` 1.8.0 (OHF-Voice/piper1-gpl), outil | GPL-3.0-or-later (logiciel, pas l'audio produit) | Non pour l'audio |
| faster-whisper 1.2.1 + modèle `Systran/faster-whisper-large-v3`, outil | MIT | Non |
| Mélodie de boîte à musique et bruitages (`studio/video/outils/son.py`) | Création interne (composée et synthétisée par le code, aucun échantillon, aucune reprise) | Non |
| Rendus 3D (`site/public/produits/boite-a-musique-manivelle/`, orbite `studio/orbite.js`) | Création interne, produit de démonstration | Non (mention « Rendus 3D de démonstration » obligatoire) |

**Musique sous licence tierce : aucune.** Aucune musique à licence vérifiée n'est disponible dans le dépôt ; la seule musique est une mélodie originale fabriquée par le code. Si l'humain veut un son tendance, il le choisit dans la bibliothèque commerciale de la plateforme au moment de publier (et le note dans `medias/licences.md`), en publiant alors une version sans la mélodie intégrée (à demander).

La MODEL_CARD de la voix (non fournie par `piper.download_voices`, piège noté au §11 du brief) a été récupérée et gardée à côté du modèle : `studio/video/.cache/voix-piper/fr_FR-siwis-medium.MODEL_CARD`. Sa section « Training » cite bien la base `hifi_tts_92` : la copie utilisée correspond à la liste « usage commercial » vérifiée en T49.

### Où placer le crédit de la voix (v2) à la publication
CC BY 4.0 exige : le nom des auteurs, le titre, la licence avec son lien, et l'indication des modifications. La vidéo porte déjà « voix de synthèse (IA) », mais le crédit complet est trop long pour l'image : il va **dans la description de chaque publication** (légende TikTok, légende Instagram Reels, description YouTube Shorts, description de l'épingle Pinterest), à la fin du texte. Si la limite de caractères d'une plateforme est atteinte, mettre la version courte dans la description et la version complète dans le premier commentaire épinglé par le compte, puis plus tard sur une page « Crédits » du site.

Version complète (à copier telle quelle) :
```
Voix de synthèse (IA) générée avec Piper, voix fr_FR-siwis-medium. Données d'entraînement : « The SIWIS French Speech Synthesis Database », J. Yamagishi, P.-E. Honnet, P. Garner, A. Lazaridis, University of Edinburgh (doi.org/10.7488/ds/1705) et « Hi-Fi Multi-Speaker English TTS Dataset », E. Bakhturina, V. Lavrukhin, B. Ginsburg, Y. Zhang (openslr.org/109), sous licence CC BY 4.0 (creativecommons.org/licenses/by/4.0). Voix utilisée pour lire un texte original. Images : rendus 3D de démonstration.
```
Version courte :
```
Voix IA : Piper fr_FR-siwis-medium, données SIWIS (Univ. of Edinburgh) et Hi-Fi TTS, CC BY 4.0. Rendus 3D de démonstration.
```
Sur TikTok et Instagram, activer aussi l'étiquette « contenu généré par IA » de la plateforme pour la v2 (voix de synthèse).

## 5. Ce qui a été fabriqué dans le studio (réutilisable)

- **Catalogue d'effets** `studio/video/effets/` (Remotion) : `accroche-texte`, `sous-titres-mot-a-mot`, `orbite-produit`, `cartes-verre`, `planche-a-objet`, `fin-appel` + socle `commun.tsx` (couleurs, polices, courbes, zone sûre, pastille de mention). Catalogue et commandes : `studio/video/effets/README.md`. Exemple de 3 s pour chacun (compositions `ex-…` de `src/Racine.tsx`), rendus dans `studio/video/.cache/effets/` (hors Git).
- **Orbite 3D** : `studio/orbite.js` + vue `orbite` ajoutée dans `studio/lib/main.js` (lumière fixe, caméra qui tourne, distance constante, courbe douce). Les vues catalogue existantes ne changent pas.
- **Son** : `studio/video/outils/son.py` (lame de boîte à musique, mélodie originale, souffle, clic, cliquet) et `planche_a_objet_audio.py` (mixage, écart voix et musique mesuré).
- **Sous-titres** : `outils/whisper_mots.py` (faster-whisper `large-v3`, langue forcée en français) et `outils/planche_a_objet_props.py` (temps de whisper + orthographe du texte écrit, coupes au sens, `.json` et `.srt`).
- **Assemblage** : `outils/planche_a_objet_assembler.sh` (ffmpeg : H.264 CRF 18, AAC 192 kb/s stéréo, normalisation -14 LUFS en deux passes).
- Le modèle faster-whisper `large-v3` (environ 3 Go) est maintenant dans `studio/video/.cache/hf/` (hors Git).
- `studio/video/tsconfig.json` inclut maintenant le dossier `effets`.

Limites connues : l'effet `projecteur` n'existe qu'en version simple dans le plan « Nuit » (noir puis lumière qui monte) ; dans l'exemple de 3 s de `cartes-verre`, les cartes passent sur le couvercle clair (dans la vidéo, l'image est décalée vers le bas et le problème n'existe pas).

## 6. Statut et suite

Statut : `à-valider`. Prochaine étape : `conformite-qa` (mentions, droits, allégations), puis validation par l'humain. Rien n'a été publié, envoyé ni payé ; aucun commit, aucun push ; `coordination/` n'a pas été touché.

## ACTION HUMAINE

1. **Regarder et écouter** les deux vidéos : `medias/de-la-planche-a-l-objet-9x16.mp4` et `medias/de-la-planche-a-l-objet-9x16-voix.mp4`. Points à juger à l'oreille : netteté et naturel de la voix Piper (qualité « medium », 22 kHz), prononciation de « plus » dans « Un écran de plus ? », niveau de la mélodie de boîte à musique.
2. **Valider le texte adapté** (`medias/voix/de-la-planche-a-l-objet.md`) : « Ça, c'est ce qu'il y a dans la boîte. » remplace « Ça, c'est ce que vous recevez. », et « Laquelle vous tente ? » est retiré ; appel final « Suivez l'atelier ».
3. **Décider de la publication** : le produit est une démonstration non vendue. Publier quand même (contenu d'image de marque, avec la mention) ou attendre un vrai produit. Le nom « Rouage & Laiton » n'est pas encore vérifié (INPI, domaine, réseaux : `knowledge/marque.md`).
4. **À la publication de la v2** : coller le crédit CC BY 4.0 du §4 dans la description et activer l'étiquette « contenu généré par IA » de la plateforme.
5. **Musique** : aucune musique tierce. Si un son tendance est voulu, le choisir dans la bibliothèque commerciale de la plateforme au moment de publier et le noter dans `medias/licences.md`.
6. **Commit** (Claude Code ou l'humain, après `py tools/verifier_livrables.py`, 0 erreur au moment du rapport) : les MP4 font 8,6 et 8,7 Mo (moins de 20 Mo), ils peuvent être commités.
