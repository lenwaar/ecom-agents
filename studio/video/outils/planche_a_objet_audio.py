"""Bande son de « De la planche à l'objet » (20 s).

  py outils/planche_a_objet_audio.py

Sorties (hors Git, .cache/audio/) :
  v1.wav : mélodie de boîte à musique (fabriquée par le code) + bruitages, sans voix
  v2.wav : voix Piper siwis + mélodie 15 dB sous la voix + bruitages
  voix.wav : la voix seule (pour faster-whisper)
"""
import json
import os
import numpy as np
import son

ICI = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(ICI, '..', '.cache')
os.makedirs(os.path.join(CACHE, 'audio'), exist_ok=True)
DUREE = 20.0
N = int(DUREE * son.SR)

# Répliques (texte de medias/voix/de-la-planche-a-l-objet.md) et instant de départ (s)
REPLIQUES = [
    (0.20, 'l1.wav'), (2.25, 'l2.wav'), (4.90, 'l3.wav'), (8.25, 'l4.wav'),
    (11.05, 'l5.wav'), (13.65, 'l6.wav'), (16.95, 'l7.wav'),  # l7 : « Rouage et Laiton. Suivez-nous. » (T56)
]
COUPES = [2.0, 4.6, 8.0, 10.8, 13.4, 16.8]

# --- voix
voix = np.zeros(N)
for t, f in REPLIQUES:
    son.placer(voix, son.lire_wav(os.path.join(CACHE, 'voix', f)), t)
voix *= 0.9 / max(np.abs(voix).max(), 1e-9)

# --- musique : mélodie originale, entrée en fondu, sortie en fondu
musique = son.melodie(DUREE, tempo=92, depart=0.05)
t = np.arange(N) / son.SR
fondu = np.clip(t / 0.4, 0, 1) * np.clip((DUREE - t) / 1.2, 0, 1)
musique *= fondu

# --- bruitages
sfx = np.zeros(N)
for c in COUPES:
    if c in (13.4,):
        continue
    son.placer(sfx, son.souffle(0.5, 0.5), c - 0.32)
for k in range(9):                       # cliquet pendant le balayage planche -> objet (5,6 à 6,9 s)
    son.placer(sfx, son.cliquet(0.9), 5.6 + k * 0.15)
for k in range(6):                       # tics d'engrenage pendant l'orbite
    son.placer(sfx, son.cliquet(0.5), 8.3 + k * 0.42)
son.placer(sfx, son.clic(1.0), 13.38)    # interrupteur : « Éteignez les lumières »
for k, d in enumerate([0.0, 0.35, 0.7]):  # cartes en verre qui se posent
    son.placer(sfx, son.cliquet(0.35), 14.2 + d)
for nom, dt in [('C5', 0.0), ('E5', 0.04), ('G5', 0.08), ('C6', 0.12)]:  # accord du logo
    son.placer(sfx, son.lame(son.note(nom), duree=2.5, force=0.7), 16.82 + dt)


def normaliser(x, crete=0.89):
    return x * crete / max(np.abs(x).max(), 1e-9)


def rms_actif(x, seuil_db=-40):
    bloc = int(0.05 * son.SR)
    b = x[: len(x) // bloc * bloc].reshape(-1, bloc)
    r = np.sqrt((b ** 2).mean(axis=1))
    actifs = r[20 * np.log10(r + 1e-12) > 20 * np.log10(r.max()) + seuil_db]
    return 20 * np.log10(np.sqrt((actifs ** 2).mean()))


# v1 : musique au premier plan (pas de voix), bruitages par-dessus
v1 = normaliser(musique) * 0.55 + sfx * 0.5
son.ecrire_wav(os.path.join(CACHE, 'audio', 'v1.wav'), normaliser(v1))

# v2 : musique réglée à 15 dB sous la voix (niveaux RMS mesurés sur les passages actifs)
voix_db = rms_actif(voix)
musique_n = normaliser(musique)
gain = 10 ** ((voix_db - 15 - rms_actif(musique_n)) / 20)
musique_v2 = musique_n * gain
sfx_v2 = sfx * 0.30
v2 = voix + musique_v2 + sfx_v2
v2 = normaliser(v2)
son.ecrire_wav(os.path.join(CACHE, 'audio', 'v2.wav'), v2)
son.ecrire_wav(os.path.join(CACHE, 'audio', 'voix.wav'), voix)

mesures = {
    'voix_rms_actif_db': round(voix_db, 1),
    'musique_rms_actif_db_v2': round(rms_actif(musique_v2), 1),
    'ecart_voix_musique_db': round(voix_db - rms_actif(musique_v2), 1),
    'bruitages_rms_actif_db_v2': round(rms_actif(sfx_v2), 1),
}
json.dump(mesures, open(os.path.join(CACHE, 'audio', 'mesures.json'), 'w'), indent=2)
print(mesures)
