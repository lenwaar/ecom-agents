"""Normalise une bande son à -14 LUFS intégrés, crête vraie sous -1 dBTP, sans saturation (T56).

  py outils/normaliser_lufs.py <entree.wav> <sortie.wav> [cible_lufs]

Pourquoi pas `loudnorm` en mode linéaire : quand le gain nécessaire ferait dépasser la crête, ffmpeg
abandonne la cible (la v2 de T54 était restée à -14,9 LUFS). Ici : gain mesuré (EBU R128), puis limiteur
doux à -2 dBFS sur un signal suréchantillonné 4 fois (crête vraie), deux itérations, puis mesure finale.
"""
import json, re, subprocess, sys

FF = 'ffmpeg'


def mesurer(fichier):
    r = subprocess.run([FF, '-hide_banner', '-nostats', '-i', fichier, '-af', 'ebur128=peak=true', '-f', 'null', '-'],
                       capture_output=True, text=True, encoding='utf-8', errors='replace').stderr
    bloc = r[r.rindex('Summary:'):]
    i = float(re.search(r'I:\s+(-?[\d.]+) LUFS', bloc).group(1))
    tp = float(re.search(r'Peak:\s+(-?[\d.]+|-inf) dBFS', bloc).group(1))
    return i, tp


def appliquer(entree, sortie, gain_db):
    filtre = (f'aresample=192000,volume={gain_db:.2f}dB,'
              'alimiter=limit=0.794:attack=2:release=60:level=false,aresample=48000')
    subprocess.run([FF, '-y', '-hide_banner', '-loglevel', 'error', '-i', entree, '-af', filtre,
                    '-ar', '48000', '-c:a', 'pcm_s24le', sortie], check=True)


if __name__ == '__main__':
    entree, sortie = sys.argv[1], sys.argv[2]
    cible = float(sys.argv[3]) if len(sys.argv) > 3 else -14.0
    i0, tp0 = mesurer(entree)
    gain = cible - i0
    for _ in range(3):
        appliquer(entree, sortie, gain)
        i, tp = mesurer(sortie)
        if abs(i - cible) <= 0.2:
            break
        gain += cible - i
    print(json.dumps({'entree_lufs': i0, 'entree_crete_vraie_dbtp': tp0, 'gain_db': round(gain, 2),
                      'sortie_lufs': i, 'sortie_crete_vraie_dbtp': tp}))
