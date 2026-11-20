"""Montage « viral » en 4 couches (V2-5, synchro n°18) sur « De la planche à l'objet ».

  py outils/montage_viral_4_couches.py video   # rendu complet (4 couches) + son -14 LUFS + mesure finale
  py outils/montage_viral_4_couches.py apercus # images clés couche par couche + planche contact

Couches (docs/studio/BRIEF-STUDIO.md, §2 bis) :
  1. Brute : la prise seule (.cache/viral/brute.mp4 = composition Remotion `DeLaPlancheALObjet` rendue
     SANS sous-titres, mêmes images et même minutage que medias/de-la-planche-a-l-objet-9x16.mp4, dont les
     anciens sous-titres sont incrustés et ne peuvent pas être retirés proprement).
  2. B-roll + suivi + netteté : 2 plans de coupe (rendus 3D du catalogue), recadrage qui suit le sujet
     (centre du masque, lissé) sur les plans à fond uni, léger accentuage (unsharp luma).
  3. Sous-titres mot à mot (effets/sous_titres_mot_a_mot.py) + titre « L'objet » qui passe derrière la boîte
     pendant l'orbite (masque simple, voir l'en-tête de l'effet).
  4. Animations (coups de zoom sur les mots forts, transitions filées aux coupes) + bruitages + musique de fond,
     tout fabriqué par le code (outils/son.py), musique 15 dB sous la voix, puis -14 LUFS (normaliser_lufs.py).

Entrées (hors Git) : .cache/viral/brute.mp4, .cache/audio/voix.wav, .cache/viral/mots-cales.json
Sorties : medias/brouillons/montage-4-couches/*.mp4 (hors Git), medias/apercus/montage-4-couches/*.jpg
"""
import json
import os
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ICI = os.path.dirname(os.path.abspath(__file__))
VIDEO = os.path.abspath(os.path.join(ICI, '..'))
RACINE = os.path.abspath(os.path.join(VIDEO, '..', '..'))
sys.path.insert(0, os.path.join(VIDEO, 'effets'))
sys.path.insert(0, ICI)
import son  # noqa: E402
import sous_titres_mot_a_mot as stm  # noqa: E402

CACHE = os.path.join(VIDEO, '.cache', 'viral')
BRUTE = os.path.join(CACHE, 'brute.mp4')
MOTS = os.path.join(CACHE, 'mots-cales.json')
VOIX = os.path.join(VIDEO, '.cache', 'audio', 'voix.wav')
IMG = os.path.join(VIDEO, '.cache', 'public', 'img')
SORTIE_DIR = os.path.join(RACINE, 'medias', 'brouillons', 'montage-4-couches')
APERCUS = os.path.join(RACINE, 'medias', 'apercus', 'montage-4-couches')
NOM = 'de-la-planche-a-l-objet-viral-test-9x16'

L, H, FPS, N = 1080, 1920, 30, 600
MENTION = 'Rendus 3D, voix de synthèse (IA)\nProduit de démonstration, non vendu'
COUPES = [2.0, 4.6, 8.0, 10.8, 13.4, 16.8]           # coupes de la composition (PLANS, en s)
FIN_SOUS_TITRES = 16.8                               # carte de fin : pas de sous-titres
# plans à fond uni où le masque simple marche (suivi du sujet) : planches et orbite
SUIVI = [(2.0, 4.6)]
# orbite : le cadre descend de 280 px (haut complété par le fond uni) pour laisser au titre la place de
# passer derrière le couvercle sans être mangé par lui ; la descente se pose en 0,5 s (courbe douce)
DESCENTE = (8.0, 10.8, 280)
# plans de coupe : (début, fin, image, zone du rendu à montrer (x0, y0, x1, y1 en fraction), zoom de fin)
BROLL = [
    (3.75, 4.50, 'dessus-1600.webp', (0.0, 0.0, 1.0, 1.0), 1.10),       # « dans la boîte. » : vue de dessus
    (6.95, 7.65, 'dessus-1600.webp', (0.40, 0.30, 0.95, 0.80), 1.08),   # « à manivelle. » : la manivelle
]
TITRE = ('OBJET', 8.3, 10.75, 440, 240)           # texte, début, fin, y (px), taille (px) : derrière la boîte
MOTS_FORTS = ['boîte.', 'musique,', 'Non.', 'construire.', 'laiton.']


def mouv(x):
    return stm.sortie_douce(x)


# ------------------------------------------------------------------ mention (redessinée au-dessus de tout)
def calque_mention():
    k = H / 1920
    f = stm.police(stm.INTER, 36 * k, 600)
    lignes = MENTION.split('\n')
    lw = max(f.getlength(l) for l in lignes)
    lh = 36 * 1.22 * k
    w, h = lw + 60 * k, lh * len(lignes) + 24 * k
    if w > 860 * k:
        raise ValueError('Mention trop large')
    x0, y0 = (L - w) / 2, 320 * k
    c = Image.new('RGBA', (L, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(c)
    d.rounded_rectangle([x0, y0, x0 + w, y0 + h], radius=26 * k, fill=(10, 15, 26, 205),
                        outline=(200, 161, 90, 160), width=2)
    for i, l in enumerate(lignes):
        d.text(((L - f.getlength(l)) / 2, y0 + 12 * k + i * lh), l, font=f, fill=stm.CREME + (255,))
    return c


# ------------------------------------------------------------------ couche 2 : suivi du sujet (pré-calcul)
def piste_suivi():
    """Centre du sujet image par image (masque simple sur une version réduite), lissé dans le temps."""
    pw, ph = 270, 480
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', BRUTE, '-vf', f'scale={pw}:{ph}', '-f', 'rawvideo',
                          '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
    centres = []
    for i in range(N):
        b = p.stdout.read(pw * ph * 3)
        if len(b) < pw * ph * 3:
            break
        a = np.frombuffer(b, np.uint8).reshape(ph, pw, 3)
        a = a[int(ph * 0.25):]  # sous la mention
        m = stm.masque_sujet(a, douceur=3, bord=8)
        if m.sum() > 50:
            ys, xs = np.mgrid[0:m.shape[0], 0:m.shape[1]]
            cx, cy = (m * xs).sum() / m.sum() / pw, ((m * ys).sum() / m.sum() + ph * 0.25) / ph
        else:
            cx, cy = 0.5, 0.55
        centres.append((cx, cy))
    p.stdout.close()
    if p.wait() != 0 and not centres:
        sys.exit(f'ffmpeg en échec en lisant {BRUTE} (code {p.returncode}).')
    c = np.array(centres)
    lisse = c.copy()
    for i in range(1, len(c)):  # lissage exponentiel (pas de saccade), remis à zéro à chaque coupe
        t = i / FPS
        if any(abs(t - x) < 0.5 / FPS for x in COUPES):
            lisse[i] = c[i]
        else:
            lisse[i] = lisse[i - 1] * 0.88 + c[i] * 0.12
    return lisse


def dans(t, plages):
    return any(a <= t < b for a, b in plages)


def zoom_recadre(img, z, cx, cy):
    if z <= 1.0005:
        return img
    w, h = L / z, H / z
    x0 = min(max(cx * L - w / 2, 0), L - w)
    y0 = min(max(cy * H - h / 2, 0), H - h)
    return img.resize((L, H), Image.LANCZOS, box=(x0, y0, x0 + w, y0 + h))


def descendre(img, dy):
    dy = int(round(dy))
    if dy <= 0:
        return img
    a = np.asarray(img)
    return Image.fromarray(np.concatenate([np.repeat(a[:1], dy, axis=0), a[:-dy]], axis=0))


_cache_broll = {}


def image_broll(nom, zone, t_rel, zfin):
    if nom not in _cache_broll:
        _cache_broll[nom] = Image.open(os.path.join(IMG, nom)).convert('RGB')
    src = _cache_broll[nom]
    W, Hh = src.size
    x0, y0, x1, y1 = zone[0] * W, zone[1] * Hh, zone[2] * W, zone[3] * Hh
    # recadrage au format 9:16 dans la zone, puis lente poussée (Ken Burns, courbe douce)
    zw, zh = x1 - x0, y1 - y0
    if zw / zh > L / H:
        nw, nh = zh * L / H, zh
    else:
        nw, nh = zw, zw * H / L
    z = 1 + (zfin - 1) * mouv(t_rel)
    nw, nh = nw / z, nh / z
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    return src.resize((L, H), Image.LANCZOS, box=(cx - nw / 2, cy - nh / 2, cx + nw / 2, cy + nh / 2))


# ------------------------------------------------------------------ couche 4 : coups de zoom et transitions
def instants_forts(mots):
    return [m['debut'] for m in mots if m['mot'] in MOTS_FORTS and m['debut'] < FIN_SOUS_TITRES]


def coup_de_zoom(t, forts):
    z = 1.0
    for d in forts:
        x = t - d
        if 0 <= x < 0.12:
            z = max(z, 1 + 0.045 * mouv(x / 0.12))
        elif 0.12 <= x < 0.6:
            z = max(z, 1 + 0.045 * (1 - stm.sortie_douce((x - 0.12) / 0.48)))
    return z


def filé(img, t):
    """Transition filée : 2 images de flou de mouvement vertical autour de chaque coupe (pas de noir)."""
    for c in COUPES[:-1]:
        x = t - c
        if -2 / FPS <= x < 2 / FPS:
            force = 1 - abs(x) * FPS / 2.5
            r = int(14 * force) + 1
            decal = int(40 * force) * (1 if x < 0 else -1)
            a = np.asarray(img, np.float32)
            acc = np.zeros_like(a)
            for k in range(-r, r + 1):
                acc += np.roll(a, decal + k * 3, axis=0)
            return Image.fromarray((acc / (2 * r + 1)).astype(np.uint8))
    return img


# ------------------------------------------------------------------ une image
class Montage:
    def __init__(self, avec_suivi=True):
        self.mots = stm.charger_mots(MOTS)
        # l'accroche (0-2 s) affiche déjà « De la planche à l'objet » en titre : pas de sous-titres en double
        vus = [m for m in self.mots if m['debut'] >= COUPES[0]]
        self.st = stm.SousTitresMotAMot(vus, L, H, y=1240, taille=76, masquer_apres=FIN_SOUS_TITRES)
        self.mention = calque_mention()
        self.forts = instants_forts(self.mots)
        self.suivi = piste_suivi() if avec_suivi else None

    def image(self, fr, i, couches):
        t = i / FPS
        img = Image.fromarray(fr)
        if couches >= 2:
            broll = next((b for b in BROLL if b[0] <= t < b[1]), None)
            if broll:
                img = image_broll(broll[2], broll[3], (t - broll[0]) / (broll[1] - broll[0]), broll[4])
            else:
                z, (cx, cy) = 1.0, (0.5, 0.55)
                if dans(t, SUIVI) and self.suivi is not None:
                    z, (cx, cy) = 1.06, self.suivi[min(i, len(self.suivi) - 1)]
                if couches >= 4:
                    z *= coup_de_zoom(t, self.forts)
                img = zoom_recadre(img, z, cx, cy)
                if DESCENTE[0] <= t < DESCENTE[1]:
                    img = descendre(img, DESCENTE[2] * (0.35 + 0.65 * mouv((t - DESCENTE[0]) / 0.5)))
        if couches >= 3:
            te, a, b, y, taille = TITRE
            if a <= t < b + 0.3:
                app = (t - a) / 0.35 if t < b else max(0.0, 1 - (t - b) / 0.3)
                masque = stm.masque_sujet(np.asarray(img))
                img = stm.titre_derriere(img, te, y, taille, app, masque)
        if couches >= 4:
            img = filé(img, t)
        if couches >= 3:
            img = self.st.dessiner(img, t)
        if couches >= 1:  # mention légale posée sur toutes les couches, jamais zoomée ni recadrée
            base = img.convert('RGBA')
            base.alpha_composite(self.mention)
            img = base.convert('RGB')
        return img


NETTETE = 'unsharp=5:5:0.55:5:5:0.0'


# ------------------------------------------------------------------ son (couche 4)
def bande_son(chemin):
    duree = N / FPS
    n = int(duree * son.SR)
    t = np.arange(n) / son.SR
    voix = np.zeros(n)
    v = son.lire_wav(VOIX)[:n]
    voix[:len(v)] = v
    # musique de fond originale : mélodie de boîte à musique + nappe douce + pulsation grave (tempo 92)
    mel = son.melodie(duree, tempo=92, depart=0.05)
    nappe = np.zeros(n)
    accords = [('C3', 'E3', 'G3'), ('F3', 'A3', 'C4'), ('G3', 'B3', 'D4'), ('C3', 'E3', 'G3')]
    mesure = 60 / 92 * 4
    for k in range(int(duree / mesure) + 1):
        deb, fin = int(k * mesure * son.SR), min(n, int((k + 1) * mesure * son.SR))
        if deb >= n:
            break
        tt = np.arange(fin - deb) / son.SR
        env = np.clip(tt / 0.4, 0, 1) * np.clip((mesure - tt) / 0.4, 0, 1)
        for nom in accords[k % 4]:
            f0 = son.note(nom)
            nappe[deb:fin] += (np.sin(2 * np.pi * f0 * tt) + 0.3 * np.sin(2 * np.pi * 2.001 * f0 * tt)) * env
    pulse = np.zeros(n)
    noire = 60 / 92
    for k in range(int(duree / noire)):
        nn = int(0.25 * son.SR)
        tt = np.arange(nn) / son.SR
        coup = np.sin(2 * np.pi * (48 + 60 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 14)
        son.placer(pulse, coup * (1.0 if k % 2 == 0 else 0.6), 0.05 + k * noire)
    musique = (mel / max(np.abs(mel).max(), 1e-9)) * 0.6 + (nappe / max(np.abs(nappe).max(), 1e-9)) * 0.25 \
        + (pulse / max(np.abs(pulse).max(), 1e-9)) * 0.35
    musique *= np.clip(t / 0.4, 0, 1) * np.clip((duree - t) / 1.2, 0, 1)
    # bruitages
    sfx = np.zeros(n)
    for c in COUPES:
        son.placer(sfx, son.souffle(0.45, 0.55), c - 0.28)
    for b in BROLL:
        son.placer(sfx, son.souffle(0.35, 0.4), b[0] - 0.2)
        son.placer(sfx, son.clic(0.5), b[0])
    for k in range(9):                                   # cliquet pendant le balayage planche -> objet
        son.placer(sfx, son.cliquet(0.9), 5.6 + k * 0.15)
    son.placer(sfx, son.clic(1.0), 13.38)                # interrupteur
    for d in instants_forts(stm.charger_mots(MOTS)):     # impact grave sous les coups de zoom
        nn = int(0.35 * son.SR)
        tt = np.arange(nn) / son.SR
        son.placer(sfx, np.sin(2 * np.pi * (40 + 90 * np.exp(-tt * 25)) * tt) * np.exp(-tt * 9) * 0.7, d)
    for p in stm.grouper(stm.charger_mots(MOTS)):        # petit « tic » discret à chaque groupe de mots
        if p[0]['debut'] < FIN_SOUS_TITRES:
            son.placer(sfx, son.clic(0.18), p[0]['debut'])
    son.placer(sfx, son.souffle(0.5, 0.45), TITRE[1] - 0.1)  # le titre glisse derrière la boîte
    for nom, dt in [('C5', 0.0), ('E5', 0.04), ('G5', 0.08), ('C6', 0.12)]:  # accord du logo
        son.placer(sfx, son.lame(son.note(nom), duree=2.5, force=0.7), 16.82 + dt)

    def rms_actif(x):
        bloc = int(0.05 * son.SR)
        b = x[: len(x) // bloc * bloc].reshape(-1, bloc)
        r = np.sqrt((b ** 2).mean(axis=1))
        act = r[r > r.max() * 10 ** (-40 / 20)]
        return 20 * np.log10(np.sqrt((act ** 2).mean()))

    voix *= 0.9 / max(np.abs(voix).max(), 1e-9)
    ecart = 15.0                                         # musique 15 dB sous la voix (grille §5 : 12 à 18)
    musique *= 10 ** ((rms_actif(voix) - ecart - rms_actif(musique)) / 20)
    sfx *= 10 ** ((rms_actif(voix) - 10 - rms_actif(sfx)) / 20)
    mix = voix + musique + sfx
    mix *= 0.89 / max(np.abs(mix).max(), 1e-9)
    son.ecrire_wav(chemin, mix)
    return {'ecart_musique_voix_db': round(rms_actif(voix) - rms_actif(musique), 1)}


def mesurer_mp4(chemin):
    r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', chemin, '-af', 'ebur128=peak=true', '-f',
                        'null', '-'], capture_output=True, text=True, encoding='utf-8', errors='replace').stderr
    bloc = r[r.rindex('Summary:'):]
    import re
    return {'lufs_integres': float(re.search(r'I:\s+(-?[\d.]+) LUFS', bloc).group(1)),
            'crete_vraie_dbtp': float(re.search(r'Peak:\s+(-?[\d.]+) dBFS', bloc).group(1))}


# ------------------------------------------------------------------ commandes
def rendre_video():
    os.makedirs(SORTIE_DIR, exist_ok=True)
    m = Montage()
    muet = os.path.join(CACHE, 'image-4-couches.mp4')
    out = stm.ecrire_video(muet, L, H, FPS, filtre=NETTETE)
    for i, fr in enumerate(stm.lire_video(BRUTE, L, H)):
        out.ecrire(m.image(fr, i, 4))
        if i % 60 == 0:
            print('image', i, flush=True)
    out.fermer()
    mix = os.path.join(CACHE, 'mix.wav')
    info = bande_son(mix)
    norm = os.path.join(CACHE, 'mix-14lufs.wav')
    subprocess.run([sys.executable, os.path.join(ICI, 'normaliser_lufs.py'), mix, norm, '-14'], check=True)
    final = os.path.join(SORTIE_DIR, NOM + '.mp4')
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', muet, '-i', norm, '-map', '0:v', '-map', '1:a',
                    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2',
                    '-movflags', '+faststart', '-shortest', final], check=True)
    info.update(mesurer_mp4(final))
    info['fichier'] = os.path.relpath(final, RACINE).replace('\\', '/')
    with open(os.path.join(CACHE, 'mesures.json'), 'w', encoding='utf-8') as f:
        json.dump(info, f, ensure_ascii=False, indent=1)
    print(json.dumps(info, ensure_ascii=False))


def apercus():
    """Couches 1 à 4 côte à côte sur 4 instants, puis planche contact de la vidéo finale."""
    os.makedirs(APERCUS, exist_ok=True)
    m = Montage()
    instants = [3.0, 4.0, 9.3, 11.9]
    lignes = []
    for t in instants:
        i = int(round(t * FPS))
        fr = np.asarray(Image.open(extraire(BRUTE, t)).convert('RGB'))
        lignes.append([m.image(fr, i, c) for c in (1, 2, 3, 4)])
    w, h = 270, 480
    pl = Image.new('RGB', (w * 4, h * len(lignes)), (10, 15, 26))
    for r, ligne in enumerate(lignes):
        for c, im in enumerate(ligne):
            pl.paste(im.resize((w, h), Image.LANCZOS), (c * w, r * h))
    pl.save(os.path.join(APERCUS, 'couches-1-a-4.jpg'), quality=90)


def extraire(video, t, dest=None):
    dest = dest or os.path.join(CACHE, f'img-{t:.2f}.png')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.3f}', '-i', video, '-frames:v', '1', dest], check=True)
    return dest


def planche_contact():
    final = os.path.join(SORTIE_DIR, NOM + '.mp4')
    instants = [0.5, 1.5, 2.6, 3.4, 4.1, 5.0, 6.3, 7.3, 8.6, 9.6, 10.4, 11.4, 12.8, 14.2, 15.6, 16.2, 17.5, 19.5]
    w, h, col = 240, 427, 9
    pl = Image.new('RGB', (w * col, h * 2), (10, 15, 26))
    for k, t in enumerate(instants):
        im = Image.open(extraire(final, t)).convert('RGB')
        pl.paste(im.resize((w, h), Image.LANCZOS), ((k % col) * w, (k // col) * h))
    pl.save(os.path.join(APERCUS, 'planche-contact.jpg'), quality=90)
    for t, nom in [(9.6, 'image-cle-titre-derriere'), (14.9, 'image-cle-sous-titres'), (4.1, 'image-cle-broll')]:
        Image.open(extraire(final, t)).convert('RGB').save(os.path.join(APERCUS, nom + '.jpg'), quality=92)


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    if cmd == 'video':
        rendre_video()
        planche_contact()
    elif cmd == 'apercus':
        apercus()
    else:
        print(__doc__)
