"""Bandes son des modèles de pub Robotime (T73), sans voix : mélodie et bruitages fabriqués par le code
(outils/son.py, création interne, aucune licence tierce). Indications « Son » des tableaux du script.

  py modeles-pub-robotime/audio.py          (depuis studio/video)

Sorties (hors Git) : .cache/audio/modeles-pub/{A,B,C}-brut.wav, à normaliser ensuite à -14 LUFS
avec outils/normaliser_lufs.py (voir assembler.sh).
Version finale : si l'accord Robotime couvre le son d'origine des vidéos, ou si l'humain choisit une musique
de la bibliothèque commerciale du réseau, remplacer la mélodie ici (et noter la licence dans medias/licences.md).
"""
import os
import sys
import numpy as np

ICI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(ICI, '..', 'outils'))
import son  # noqa: E402

SORTIE = os.path.join(ICI, '..', '.cache', 'audio', 'modeles-pub')
os.makedirs(SORTIE, exist_ok=True)
SR = son.SR


def piste(duree):
    return np.zeros(int(duree * SR))


def rouage(p, debut, fin, pas=0.14, force=0.8):
    """Mécanisme qui tourne : cliquets réguliers, léger accent toutes les 4 dents."""
    t, k = debut, 0
    while t < fin:
        son.placer(p, son.cliquet(force * (1.0 if k % 4 == 0 else 0.65)), t)
        t += pas
        k += 1


def bois(p, instants, force=0.9):
    for t in instants:
        son.placer(p, son.clic(force), t)


def musique(duree, entree, fin, fondu_entree=0.6, gain=1.0, montees=()):
    """Mélodie originale de boîte à musique, entrée en fondu, arrêt net (fondu de 30 ms) à `fin`."""
    m = son.melodie(duree, tempo=88, depart=entree)
    t = np.arange(len(m)) / SR
    env = np.clip((t - entree) / fondu_entree, 0, 1) * np.clip((fin - t) / 0.03, 0, 1) * gain
    for (a, b, g) in montees:  # (début, fin, gain) : pic de musique
        env *= 1 + (g - 1) * np.clip((t - a) / 0.4, 0, 1) * np.clip((b - t) / 0.4, 0, 1)
    return m * env


def ecrire(nom, p):
    p = p / max(np.abs(p).max(), 1e-9) * 0.7
    son.ecrire_wav(os.path.join(SORTIE, f'{nom}-brut.wav'), p)


# Script corrigé (P3) : aucune synthèse qui imite le son du produit sur les plans du mécanisme (A1, A4, B1,
# B7, C6) ; le vrai son du média n'y sera mis que s'il existe et que l'accord le couvre.
# Restent : bruitages de bois et de rouage demandés pour B4 à B6, clics de C1 et C2, « tchak » du fondu C3.

# --- A Accroche (18 s) : silence en A1, musique à 2 s, arrêt net à 18 s
d = 18.0
a = piste(d)
a += 0.55 * musique(d, 2.0, d)
son.placer(a, son.souffle(0.5, 0.35), 4.8)
son.placer(a, son.souffle(0.5, 0.3), 12.8)
ecrire('A', a)

# --- B Démonstration (25 s) : silence en B1, musique douce à 2 s, crescendo en B7, arrêt à 25 s
d = 25.0
b = piste(d)
b += 0.5 * musique(d, 2.0, d, fondu_entree=1.2, montees=[(17.0, 21.0, 1.6)])
bois(b, [8.4, 9.3, 10.1])  # B4 : pièces de bois
bois(b, [11.3, 11.9, 12.6, 13.2], force=0.8)  # B5 : clics d'emboîtement
rouage(b, 14.0, 17.0, pas=0.2, force=0.6)  # B6 : bruitage de rouage
ecrire('B', b)

# --- C Avant/après (20 s) : silence puis un clic, bois léger, montée de musique à 5 s, « tchak » sur le fondu
d = 20.0
c = piste(d)
bois(c, [0.8], force=1.0)
bois(c, [2.4, 3.3, 4.2], force=0.55)
c += 0.55 * musique(d, 5.0, d, fondu_entree=3.0)
son.placer(c, son.souffle(0.8, 0.6), 8.2)
son.placer(c, son.clic(1.3), 9.0)
ecrire('C', c)
print('ok', SORTIE)
