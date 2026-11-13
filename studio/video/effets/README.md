# Catalogue d'effets du studio vidéo

Effets réutilisables (composants Remotion, format 1080×1920 à 30 i/s), numérotés comme le §4 de `docs/studio/BRIEF-STUDIO.md`.
Socle commun : `commun.tsx` (couleurs et polices de `knowledge/marque.md`, courbes douces, zone sûre, pastille de mention).
Chaque effet a un exemple de 3 s (composition `ex-<effet>` dans `src/Racine.tsx`), rendu dans `.cache/effets/` (hors Git).

| N° | Effet | Fichier | Exemple de 3 s | État |
|---|---|---|---|---|
| 1 | `accroche-texte` | `AccrocheTexte.tsx` | `ex-accroche-texte` | fait (T54) |
| 2 | `sous-titres-mot-a-mot` | `SousTitres.tsx` | `ex-sous-titres-mot-a-mot` | fait (T54) |
| 3 | `orbite-produit` | `OrbiteProduit.tsx` + rendu `studio/orbite.js` | `ex-orbite-produit` | fait (T54) |
| 4 | `projecteur` | (version simple dans `src/DeLaPlancheALObjet.tsx`, plan « Nuit ») | à faire | à faire |
| 5 | `cartes-verre` | `CartesVerre.tsx` | `ex-cartes-verre` | fait (T54) |
| 6 | `vue-eclatee` | | | à faire |
| 7 | `planche-a-objet` | `PlancheAObjet.tsx` | `ex-planche-a-objet` | fait (T54) |
| 8 | `coupes-rythmees` | | | à faire |
| 9 | `boite-commentaire` | | | à faire |
| 10 | `barre-prix` | | | à faire (prix barré seulement avec un vrai prix de référence) |
| 11 | `fin-appel` | `FinAppel.tsx` | `ex-fin-appel` | fait (T54) |
| 12 | `ecran-site` | | | à faire |

Sons fabriqués par le code (aucune licence tierce) : `outils/son.py` (lame de boîte à musique, mélodie originale, souffle, clic, cliquet).

## Préparer les fichiers (une fois)
```
# depuis la racine du dépôt (Git Bash) : images, polices, séquence d'orbite dans .cache/public (hors Git)
P=studio/video/.cache/public; mkdir -p $P/img $P/polices $P/orbite
cp site/public/produits/boite-a-musique-manivelle/{boite,trois-quarts,detail,situation,dessus}-1600.webp $P/img/
cp site/node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-{400,500}-{normal,italic}.woff2 $P/polices/
cp site/node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2 $P/polices/
cd studio && node orbite.js --frames 90 --az0 -20 --az1 70 --el 24 --el1 14 --samples 48 --zoom 1.3 --out video/.cache/public/orbite/boite-a-musique
```
`orbite.js` : environ 10 s par image sur ce PC ; ne pas lancer de rendu Remotion en même temps (contexte WebGL perdu ; le script reprend là où il s'est arrêté).

## Rendre un exemple
```
cd studio/video
npx remotion render src/index.ts ex-cartes-verre .cache/effets/cartes-verre.mp4 --public-dir=.cache/public
```

## « De la planche à l'objet » (T54)
```
cd studio/video
py outils/planche_a_objet_audio.py                     # bandes son v1, v2, voix seule (.cache/audio)
py outils/whisper_mots.py .cache/audio/voix.wav .cache/sous-titres/mots-v2.json   # faster-whisper large-v3
py outils/planche_a_objet_props.py .cache/sous-titres/mots-v2.json                     # props + .json/.srt dans medias/voix
npx remotion render src/index.ts DeLaPlancheALObjet .cache/rendus/v1.mp4 --public-dir=.cache/public --props=.cache/sous-titres/props-v1.json --muted
npx remotion render src/index.ts DeLaPlancheALObjet .cache/rendus/v2.mp4 --public-dir=.cache/public --props=.cache/sous-titres/props-v2.json --muted
sh outils/planche_a_objet_assembler.sh                  # assemblage ffmpeg + son à -14 LUFS (outils/normaliser_lufs.py), mesure finale
```
