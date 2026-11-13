#!/bin/sh
# Assemblage final de « De la planche à l'objet » : image Remotion (muette) + bande son normalisée à -14 LUFS.
#   sh outils/planche_a_objet_assembler.sh      (depuis studio/video, après les deux rendus Remotion)
# Normalisation : outils/normaliser_lufs.py (gain mesuré + limiteur, crête vraie sous -1 dBTP), puis contrôle
# de la piste finale du MP4 (ebur128) : -14 LUFS ± 1 exigé (grille §5 du brief).
set -e
FF=${FFMPEG:-ffmpeg}
M=../../medias
for v in v1 v2; do
  py outils/normaliser_lufs.py .cache/audio/$v.wav .cache/audio/$v-14lufs.wav -14
  $FF -y -hide_banner -loglevel error -i .cache/rendus/$v.mp4 -i .cache/audio/$v-14lufs.wav \
    -map 0:v -map 1:a -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -r 30 -movflags +faststart \
    -c:a aac -b:a 192k -ar 48000 -ac 2 -shortest .cache/rendus/$v-final.mp4
done
cp .cache/rendus/v1-final.mp4 $M/de-la-planche-a-l-objet-9x16.mp4
cp .cache/rendus/v2-final.mp4 $M/de-la-planche-a-l-objet-9x16-voix.mp4
for f in $M/de-la-planche-a-l-objet-9x16.mp4 $M/de-la-planche-a-l-objet-9x16-voix.mp4; do
  echo "$f"; $FF -hide_banner -nostats -i "$f" -af ebur128=peak=true -f null - 2>&1 | sed -n '/Summary/,$p' | grep -E "I:|Peak:"
done
