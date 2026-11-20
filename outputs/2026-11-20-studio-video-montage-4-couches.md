---
agent: studio-video
statut: à-valider
date: 2026-11-20
mode: production (V2-5, synchro n°18)
sources: [docs/studio/BRIEF-STUDIO.md, docs/retours-experience.md, medias/licences.md, medias/voix/de-la-planche-a-l-objet.md, studio/video/src/DeLaPlancheALObjet.tsx, studio/video/outils/son.py, studio/video/outils/normaliser_lufs.py, https://github.com/SYSTRAN/faster-whisper, https://github.com/python-pillow/Pillow (LICENSE, consulté le 2026-11-20)]
prochaine-etape: conformite-qa
---

# Montage « viral » en 4 couches : effet et version test (V2-5)

## Verdict
Le style est en place et documenté : 4 couches dans le brief (§2 bis) et dans la grille §5, un effet réutilisable de sous-titres mot à mot en Python, et une version test de 20 s sur « De la planche à l'objet » à **-14,3 LUFS** mesuré sur le MP4 final. C'est un **brouillon de démonstration** : non publiable (ancienne marque « Rouage & Laiton » sur la carte de fin et dans la voix, produit non vendu).

## Ce qui a été livré
| Élément | Chemin |
|---|---|
| 4 couches comme étapes + cases de la grille §5 | `docs/studio/BRIEF-STUDIO.md` (§2 bis et fin du §5) |
| Effet « sous-titres mot à mot » (transcription faster-whisper `large-v3` + mots qui apparaissent un par un, mot actif en laiton, titre derrière le sujet), usage en tête de fichier | `studio/video/effets/sous_titres_mot_a_mot.py` ; catalogue mis à jour dans `studio/video/effets/README.md` |
| Script du montage en 4 couches (couches 1 à 4, son, mesure, planche contact) | `studio/video/outils/montage_viral_4_couches.py` |
| Vidéo test 1080×1920, 30 i/s, **20,0 s** | `medias/brouillons/montage-4-couches/de-la-planche-a-l-objet-viral-test-9x16.mp4` (10,7 Mo, **hors Git** : `.gitignore` ligne 17) |
| Planche contact (18 images), couches 1 à 4 côte à côte, 3 images clés en taille réelle | `medias/apercus/montage-4-couches/` |

Les 4 couches sur cette vidéo : 1) prise brute (composition Remotion re-rendue **sans** sous-titres, car ceux de `medias/de-la-planche-a-l-objet-9x16.mp4` sont incrustés ; le fichier d'origine n'est pas modifié) ; 2) deux plans de coupe (vue de dessus sur « dans la boîte », manivelle sur « à manivelle »), recadrage qui suit le sujet sur les planches, accentuage léger ; 3) sous-titres mot à mot (Inter 800, 76 px, y = 1240, dans la zone sûre, aucun en double du titre d'accroche) et « OBJET » qui passe derrière le couvercle pendant l'orbite ; 4) coups de zoom sur 5 mots forts, transitions filées aux coupes, bruitages et musique de fond.

## Contrôles (leçon 14, grille §5)
- Son : **-14,3 LUFS intégrés**, crête vraie **-4,9 dBTP**, LRA 3,8 LU (`ebur128` sur le MP4 final) ; musique **15 dB** sous la voix.
- Mention « Rendus 3D, voix de synthèse (IA) / Produit de démonstration, non vendu » : 36 px, y = 320, du début à la fin, posée après tout zoom (jamais recadrée) ; lue en taille réelle sur `image-cle-sous-titres.jpg`.
- Planche contact regardée : aucun plan vide, aucun texte coupé ; 1er défaut corrigé (sous-titres en double du titre d'accroche), 2e corrigé (« OBJET » trop caché par le couvercle : cadre descendu de 280 px pendant l'orbite).

## Licences (toutes notées dans `medias/licences.md`, 0 € dépensé)
Musique de fond et bruitages : **synthèse par le code** (`son.py` + script), aucun téléchargement. Voix Piper `fr_FR-siwis-medium` (CC BY 4.0, crédit obligatoire si publiée), polices Inter et Cormorant Garamond (OFL-1.1), faster-whisper `large-v3` (MIT), Pillow 13.0.0 (MIT-CMU, ajouté à `requirements.txt`).

## Limites
- **Masquage simple, pas un vrai détourage** : fond estimé sur les bords + distance de couleur. Marche sur fond uni (orbite, planches), rate sur fond chargé (plan de nuit, gros plan du mécanisme). Un modèle de segmentation local reste à choisir par `veille-outils` (licence d'abord).
- Whisper entend « puce » pour « plus » et « Roi Gélétan » pour « Rouage et Laiton » : l'effet recale l'orthographe sur le texte validé de la voix off (les temps restent ceux de whisper) ; les sous-titres s'arrêtent avant la carte de fin.
- Plans de coupe tirés des 5 rendus déjà existants (la manivelle est un recadrage agrandi, un peu moins net).
- Test en 1080×1920 directement (pas de brouillon 540×960) car un seul rendu était demandé.

## ACTION HUMAINE
- Regarder la vidéo test et dire si le style (sous-titres sans boîte, coups de zoom, « OBJET » derrière le couvercle) convient avant de l'appliquer à une vraie vidéo.
- Aucune publication : brouillon de démonstration avec l'ancienne marque.
