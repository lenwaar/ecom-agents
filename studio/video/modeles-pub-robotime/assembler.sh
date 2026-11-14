#!/bin/sh
# Modèles de pub Robotime (T73) : rendu image, bande son à -14 LUFS, assemblage, mesure, aperçus.
#   sh modeles-pub-robotime/assembler.sh brouillon     (540×960, --scale=0.5, props/<M>-<variante>-brouillon.json)
#   sh modeles-pub-robotime/assembler.sh final         (1080×1920, props/<M>-<variante>-final.json à créer)
# Variantes : avec-marque, sans-marque (une variante sans fichier de props est sautée).
# Depuis studio/video. Fichiers lourds hors Git. SANS_RENDU=1 : réassemble sans relancer Remotion.
set -e
MODE=${1:-brouillon}
RACINE=../..
if [ "$MODE" = final ]; then ECHELLE=1; SUFFIXE=9x16; SORTIE=$RACINE/medias; else ECHELLE=0.5; SUFFIXE=brouillon-540x960; SORTIE=$RACINE/medias/brouillons/modeles-pub-robotime; fi
APERCUS=$RACINE/medias/apercus/modeles-pub-robotime
mkdir -p .cache/rendus/modeles-pub "$SORTIE" "$APERCUS"
py modeles-pub-robotime/audio.py
for M in A B C; do
	case $M in A) NOM=accroche;; B) NOM=demonstration;; C) NOM=avant-apres;; esac
	py outils/normaliser_lufs.py .cache/audio/modeles-pub/$M-brut.wav .cache/audio/modeles-pub/$M.wav
	for V in avec-marque sans-marque; do
		[ -f modeles-pub-robotime/props/$M-$V-$MODE.json ] || continue
		R=.cache/rendus/modeles-pub/$M-$V-$MODE.mp4
		[ -n "$SANS_RENDU" ] || npx remotion render src/index.ts modele-pub-$M $R --scale=$ECHELLE --muted \
			--public-dir=.cache/public --props=modeles-pub-robotime/props/$M-$V-$MODE.json
		F=$SORTIE/modele-pub-robotime-$M-$NOM-$V-$SUFFIXE.mp4
		# -0,5 dB : marge pour la crête vraie après l'encodage AAC (reste dans -14 ± 1 LUFS)
		ffmpeg -y -hide_banner -loglevel error -i $R -i .cache/audio/modeles-pub/$M.wav \
			-map 0:v -map 1:a -c:v copy -af volume=-0.5dB -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart "$F"
		echo "== $F"; ffmpeg -hide_banner -nostats -i "$F" -af ebur128=peak=true -f null - 2>&1 | sed -n '/Summary/,$p' | grep -E "I:|Peak:"
		# planche contact : une image par seconde, 4 colonnes
		ffmpeg -y -hide_banner -loglevel error -i "$F" -vf "fps=1,scale=270:-1,tile=4x$(( ($(ffprobe -v error -show_entries format=duration -of csv=p=0 "$F" | cut -d. -f1) + 3) / 4 ))" -frames:v 1 -q:v 3 "$APERCUS/planche-contact-$M-$V-$MODE.jpg"
	done
done
py modeles-pub-robotime/images_cles.py "$MODE"
