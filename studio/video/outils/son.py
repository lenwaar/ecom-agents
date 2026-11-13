"""Sons fabriqués par le code pour le studio vidéo (aucun échantillon tiers, aucune licence à payer).

- lame()      : note de boîte à musique (lame de peigne : partiels inharmoniques, attaque sèche)
- melodie()   : petite mélodie originale de boîte à musique (composée ici, pas une reprise)
- souffle()   : « whoosh » de transition (bruit filtré qui monte et retombe)
- clic()      : clic d'interrupteur
- cliquet()   : tic d'engrenage / cliquet de manivelle
- ecrire_wav(), lire_wav(), placer() : outils de montage simples (mono 48 kHz, flottants)

Utilisation : voir `planche_a_objet_audio.py`.
"""
import wave
import numpy as np

SR = 48000
rng = np.random.default_rng(7)


def _env(n, attaque, chute):
    t = np.arange(n) / SR
    a = np.clip(t / max(attaque, 1e-4), 0, 1)
    return a * np.exp(-t / chute)


def lame(freq, duree=2.2, force=1.0):
    """Lame d'acier pincée par une goupille : fondamentale + partiels à 5,4 et 13,8 fois (inharmoniques)."""
    n = int(duree * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * freq * t) * _env(n, 0.002, 0.9)
    s += 0.25 * np.sin(2 * np.pi * freq * 5.4 * t) * _env(n, 0.001, 0.18)
    s += 0.08 * np.sin(2 * np.pi * freq * 13.8 * t) * _env(n, 0.0005, 0.05)
    clic = rng.standard_normal(n) * _env(n, 0.0002, 0.004) * 0.15
    return (s + clic) * force * 0.5


def note(nom):
    noms = {'C': -9, 'D': -7, 'E': -5, 'F': -4, 'G': -2, 'A': 0, 'B': 2}
    base, octave = nom[0], int(nom[-1])
    demi = noms[base] + (1 if '#' in nom else 0) + (octave - 4) * 12
    return 440.0 * 2 ** (demi / 12)


def melodie(duree, tempo=96, depart=0.0):
    """Mélodie originale (composée pour ce projet) en do majeur, jouée en boucle sur `duree` secondes."""
    motif = [
        ('E5', 1), ('G5', 1), ('C6', 2), ('B5', 1), ('G5', 1), ('A5', 2),
        ('F5', 1), ('A5', 1), ('D6', 2), ('C6', 1), ('B5', 1), ('G5', 2),
        ('E5', 1), ('G5', 1), ('C6', 2), ('D6', 1), ('E6', 1), ('C6', 2),
        ('A5', 1), ('F5', 1), ('G5', 1), ('B5', 1), ('C6', 4),
    ]
    basse = ['C4', 'F4', 'G4', 'C4']
    croche = 60.0 / tempo / 2
    out = np.zeros(int((duree + 3) * SR))
    t = depart
    i = 0
    while t < duree:
        nom, d = motif[i % len(motif)]
        placer(out, lame(note(nom), force=0.8 + 0.2 * rng.random()), t)
        if i % 6 == 0:
            placer(out, lame(note(basse[(i // 6) % 4]), duree=2.6, force=0.55), t)
        t += d * croche
        i += 1
    return out[: int(duree * SR)]


def souffle(duree=0.6, force=1.0):
    n = int(duree * SR)
    bruit = rng.standard_normal(n)
    # filtre passe-bas à fréquence qui monte puis descend (filtre à un pôle, coefficient variable)
    t = np.linspace(0, 1, n)
    courbe = np.sin(np.pi * t) ** 1.5
    a = 0.02 + 0.25 * courbe
    y = np.zeros(n)
    acc = 0.0
    for k in range(n):
        acc += a[k] * (bruit[k] - acc)
        y[k] = acc
    return y * courbe * force * 1.6


def clic(force=1.0):
    n = int(0.06 * SR)
    t = np.arange(n) / SR
    s = rng.standard_normal(n) * _env(n, 0.0002, 0.003)
    s += 0.6 * np.sin(2 * np.pi * 2300 * t) * _env(n, 0.0002, 0.006)
    s += 0.4 * np.sin(2 * np.pi * 180 * t) * _env(n, 0.001, 0.02)
    return s * force * 0.6


def cliquet(force=1.0):
    n = int(0.05 * SR)
    t = np.arange(n) / SR
    s = rng.standard_normal(n) * _env(n, 0.0001, 0.002)
    s += 0.5 * np.sin(2 * np.pi * 3400 * t) * _env(n, 0.0001, 0.004)
    s += 0.3 * np.sin(2 * np.pi * 900 * t) * _env(n, 0.0005, 0.01)
    return s * force * 0.45


def placer(piste, son, t):
    i = int(round(t * SR))
    if i >= len(piste):
        return
    fin = min(len(piste), i + len(son))
    piste[i:fin] += son[: fin - i]


def lire_wav(chemin):
    with wave.open(chemin, 'rb') as w:
        sr, n, ch, sw = w.getframerate(), w.getnframes(), w.getnchannels(), w.getsampwidth()
        brut = np.frombuffer(w.readframes(n), dtype=np.int16).astype(np.float64) / 32768
    if ch > 1:
        brut = brut.reshape(-1, ch).mean(axis=1)
    if sr != SR:
        x_old = np.arange(len(brut)) / sr
        x_new = np.arange(int(len(brut) * SR / sr)) / SR
        brut = np.interp(x_new, x_old, brut)
    return brut


def ecrire_wav(chemin, signal):
    s = np.clip(signal, -1, 1)
    with wave.open(chemin, 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((s * 32767).astype(np.int16).tobytes())


def db(x):
    return 20 * np.log10(max(np.sqrt(np.mean(x ** 2)), 1e-9))
