#!/bin/sh
# Assemblage final de « De la planche à l'objet » : image Remotion (muette) + bande son, normalisation à -14 LUFS.
#   sh outils/planche_a_objet_assembler.sh      (depuis studio/video, après les deux rendus Remotion)
set -e
FF=${FFMPEG:-ffmpeg}
M=../../medias
for v in v1 v2; do
  # deux passes loudnorm : mesure, puis correction linéaire (-14 LUFS, crête vraie -1,5 dBTP)
  mes=$($FF -hide_banner -i .cache/audio/$v.wav -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/{/,/}/p')
  get() { echo "$mes" | grep "\"$1\"" | sed 's/.*: "\(.*\)".*/\1/'; }
  $FF -y -hide_banner -loglevel error -i .cache/rendus/$v.mp4 -i .cache/audio/$v.wav \
    -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(get input_i):measured_TP=$(get input_tp):measured_LRA=$(get input_lra):measured_thresh=$(get input_thresh):offset=$(get target_offset):linear=true,aresample=48000" \
    -map 0:v -map 1:a -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -r 30 -movflags +faststart \
    -c:a aac -b:a 192k -ar 48000 -ac 2 -shortest .cache/rendus/$v-final.mp4
done
cp .cache/rendus/v1-final.mp4 $M/de-la-planche-a-l-objet-9x16.mp4
cp .cache/rendus/v2-final.mp4 $M/de-la-planche-a-l-objet-9x16-voix.mp4
