"""Effet « sous-titres mot à mot » en Python (style viral, couche 3 du montage en 4 couches, V2-5).

Version Python de l'effet n° 2 du catalogue (la version Remotion reste `SousTitres.tsx`). Elle sert quand on
monte sur une vidéo déjà rendue (MP4) au lieu d'une composition Remotion.

Ce que fait l'effet
- Transcription locale avec faster-whisper, langue forcée en français, **temps de chaque mot**
  (`transcrire`). Modèle `large-v3` (licence MIT vérifiée en T49) ; `small` seulement pour un brouillon.
- Rendu : les mots **apparaissent un par un** au moment où ils sont dits (groupes de 3 mots au plus, coupés
  aux pauses et à la ponctuation), le mot dit à l'instant est en laiton `#C8A15A` avec un petit « pop »
  (courbe douce, jamais linéaire), les autres en crème `#F5F1E8`, contour sombre pour rester lisible
  sur fond clair comme sur fond sombre. Police Inter (OFL-1.1), graisse 800.
- Zone sûre (leçon 14, grille §5) : le bloc reste sous y = 288 px et au-dessus de y = 1536 px en
  1080×1920 ; taille au moins 48 px (le code refuse moins de 36 px, minimum absolu du dépôt).
  Les valeurs se mettent à l'échelle si la vidéo n'est pas en 1920 de haut (brouillon 540×960).
- **Texte derrière le sujet** (`masque_sujet` + `titre_derriere`) : VERSION SIMPLE, pas un vrai
  détourage. Le fond est estimé sur les bords de l'image (médiane), chaque pixel trop proche de cette
  couleur est classé « fond », le masque est lissé ; le titre est posé sur l'image puis le sujet est
  recollé par-dessus. Marche sur un fond uni et un sujet bien contrasté (rendus 3D sur fond crème ou nuit),
  rate sur un fond chargé ou un sujet de la même couleur que le fond. Un vrai détourage (modèle de
  segmentation) n'est pas installé : à décider avec `veille-outils` (licence d'abord).

Usage
  # 1. transcription (une fois) -> liste de mots {mot, debut, fin, proba}
  #    texte.txt (facultatif) = texte validé de la voix off : corrige l'orthographe, garde les temps
  py effets/sous_titres_mot_a_mot.py transcrire <voix.wav> <mots.json> [large-v3|small] [texte.txt]
  # 2. incrustation sur une vidéo (sans son ; le son se monte ensuite avec ffmpeg)
  py effets/sous_titres_mot_a_mot.py incruster <entree.mp4> <mots.json> <sortie.mp4> [y=1240] [taille=76]
  # en Python (montage) : voir outils/montage_viral_4_couches.py
  from sous_titres_mot_a_mot import SousTitresMotAMot, charger_mots
  st = SousTitresMotAMot(charger_mots('mots.json'), largeur=1080, hauteur=1920)
  image_pil = st.dessiner(image_pil, t)      # t en secondes

Dépendances : faster-whisper (requirements.txt), Pillow, numpy, ffmpeg dans le PATH.
Polices : `studio/video/.cache/public/polices/` (préparées par le README des effets).
"""
import json
import os
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ICI = os.path.dirname(os.path.abspath(__file__))
POLICES = os.path.join(ICI, '..', '.cache', 'public', 'polices')
INTER = os.path.join(POLICES, 'inter-latin-wght-normal.woff2')
CORMORANT = os.path.join(POLICES, 'cormorant-garamond-latin-500-normal.woff2')

# Couleurs de studio/video/effets/commun.tsx (knowledge/marque.md)
LAITON = (200, 161, 90)
CREME = (245, 241, 232)
NUIT = (10, 15, 26)

ZONE_HAUT, ZONE_BAS = 288, 1920 - 384  # en 1080×1920


class ErreurEffet(Exception):
    """Erreur expliquée en français ; la ligne de commande l'affiche et sort avec le code 1."""


def _verifier_fichier(chemin, quoi):
    if not os.path.isfile(chemin):
        raise ErreurEffet(f'{quoi} introuvable : {chemin}')


def _lire_texte(chemin, quoi):
    _verifier_fichier(chemin, quoi)
    try:
        with open(chemin, encoding='utf-8') as f:
            return f.read()
    except (OSError, UnicodeDecodeError) as e:
        raise ErreurEffet(f'{quoi} illisible ({chemin}) : {e}') from e


# ---------------------------------------------------------------- transcription
def transcrire(audio, sortie_json, modele='large-v3', invite=None, texte_reference=None):
    _verifier_fichier(audio, 'Fichier audio')
    os.environ.setdefault('HF_HOME', os.path.abspath(os.path.join(ICI, '..', '.cache', 'hf')))
    os.environ.setdefault('HF_HUB_DISABLE_TELEMETRY', '1')
    from faster_whisper import WhisperModel
    m = WhisperModel(modele, device='cpu', compute_type='int8')
    segs, _ = m.transcribe(audio, language='fr', word_timestamps=True, beam_size=5, initial_prompt=invite)
    mots = fusionner([{'mot': w.word.strip(), 'debut': round(w.start, 3), 'fin': round(w.end, 3),
                       'proba': round(w.probability, 3)} for s in segs for w in s.words if w.word.strip()])
    if texte_reference:
        mots = caler_sur_texte(mots, texte_reference)
    try:
        with open(sortie_json, 'w', encoding='utf-8') as f:
            json.dump(mots, f, ensure_ascii=False, indent=1)
    except OSError as e:
        raise ErreurEffet(f'Impossible d\'écrire {sortie_json} : {e}') from e
    return mots


def fusionner(mots):
    """Recolle ce que whisper découpe en français : « l » + « 'objet », « suivez » + « -nous », « ? » seul."""
    out = []
    for m in mots:
        w = m['mot']
        if out and (w[:1] in "'’-" or all(c in '.,;:?!…' for c in w) or out[-1]['mot'][-1:] in "'’"):
            prec = out[-1]
            sep = ' ' if w in ('?', '!', ':', ';') else ''
            prec['mot'] = prec['mot'] + sep + w
            prec['fin'] = m['fin']
        else:
            out.append(dict(m))
    return out


def _norm(w):
    import unicodedata
    w = unicodedata.normalize('NFD', w.lower())
    return ''.join(c for c in w if c.isalnum())


def caler_sur_texte(mots, texte):
    """Garde les temps de whisper mais remplace l'orthographe par le texte validé de la voix off
    (whisper entend « puce » pour « plus »). Alignement mot à mot (difflib) ; un mot non retrouvé garde
    la graphie whisper et est signalé dans la sortie."""
    import difflib
    ref = [x['mot'] for x in fusionner([{'mot': w, 'debut': 0, 'fin': 0} for w in texte.split()])]
    a, b = [_norm(m['mot']) for m in mots], [_norm(w) for w in ref]
    out = [dict(m) for m in mots]
    sm = difflib.SequenceMatcher(a=a, b=b, autojunk=False)
    for op, i1, i2, j1, j2 in sm.get_opcodes():
        if op == 'equal' or (op == 'replace' and i2 - i1 == j2 - j1):
            for k in range(i2 - i1):
                out[i1 + k]['mot'] = ref[j1 + k]
        elif op != 'insert':
            for k in range(i1, i2):
                out[k]['non_cale'] = True
    return out


def charger_mots(chemin):
    contenu = _lire_texte(chemin, 'Fichier de mots (JSON)')
    try:
        mots = json.loads(contenu)
    except json.JSONDecodeError as e:
        raise ErreurEffet(f'JSON invalide dans {chemin} (ligne {e.lineno}) : {e.msg}') from e
    if not isinstance(mots, list) or not all(isinstance(m, dict) and {'mot', 'debut', 'fin'} <= m.keys() for m in mots):
        raise ErreurEffet(f'{chemin} : liste de mots attendue, chacun avec « mot », « debut » et « fin »')
    return mots


def grouper(mots, maxi=3, pause=0.28):
    pages, cur = [], []
    for i, m in enumerate(mots):
        prec = mots[i - 1] if i else None
        coupe = len(cur) >= maxi or (prec and (m['debut'] - prec['fin'] > pause or prec['mot'][-1:] in '.?!…,'))
        if coupe and cur:
            pages.append(cur)
            cur = []
        cur.append(m)
    if cur:
        pages.append(cur)
    return pages


# ---------------------------------------------------------------- courbes
def sortie_douce(x):
    """Entrée rapide, arrivée douce (équivalent de bezier(0.16, 1, 0.3, 1))."""
    x = min(max(x, 0.0), 1.0)
    return 1 - (1 - x) ** 4


def rebond(x):
    """Petit dépassement puis retour (pop) : 0 -> 1,08 -> 1."""
    x = min(max(x, 0.0), 1.0)
    return 1 + 0.08 * np.sin(np.pi * x) * (1 - x) * 2.2 if x < 1 else 1.0


def police(chemin, taille, graisse=None):
    _verifier_fichier(chemin, 'Police (préparer .cache/public/polices, voir effets/README.md)')
    f = ImageFont.truetype(chemin, int(round(taille)))
    if graisse is not None:
        try:
            f.set_variation_by_axes([graisse])
        except OSError:
            pass  # police non variable : on garde sa graisse d'origine
    return f


# ---------------------------------------------------------------- sous-titres
class SousTitresMotAMot:
    def __init__(self, mots, largeur=1080, hauteur=1920, y=1240, taille=76, masquer_apres=None, maxi=3):
        self.k = hauteur / 1920
        if taille < 36:
            raise ValueError('Sous-titres sous 36 px : illisibles (leçon 14)')
        self.L, self.H = largeur, hauteur
        self.taille = taille * self.k
        self.y = y * self.k
        bloc = self.taille * 1.25 * 2 + 40 * self.k  # deux lignes au plus
        if self.y < ZONE_HAUT * self.k or self.y + bloc > ZONE_BAS * self.k:
            raise ValueError('Sous-titres hors zone sûre (grille §5)')
        self.pages = grouper(mots, maxi=maxi)
        self.masquer_apres = masquer_apres
        self.f = police(INTER, self.taille, 800)
        self.contour = max(2, int(round(6 * self.k)))

    def _page(self, t):
        for i, p in enumerate(self.pages):
            fin = p[-1]['fin'] + 0.5
            if i + 1 < len(self.pages):
                fin = min(fin, self.pages[i + 1][0]['debut'] - 0.02)
            if p[0]['debut'] - 0.05 <= t < fin:
                return p
        return None

    def dessiner(self, img, t):
        if self.masquer_apres is not None and t >= self.masquer_apres:
            return img
        page = self._page(t)
        if not page:
            return img
        dits = [m for m in page if t >= m['debut'] - 0.04]
        if not dits:
            return img
        # mise en page sur toute la page (les mots à venir gardent leur place : pas de saut de ligne en cours)
        esp = self.taille * 0.32
        largeurs = [self.f.getlength(m['mot']) for m in page]
        lignes, cur, lc = [], [], 0.0
        for m, w in zip(page, largeurs):
            if cur and lc + esp + w > self.L - 2 * 80 * self.k:
                lignes.append(cur)
                cur, lc = [], 0.0
            cur.append((m, w))
            lc += (esp if len(cur) > 1 else 0) + w
        lignes.append(cur)
        calque = Image.new('RGBA', img.size, (0, 0, 0, 0))
        ombre = Image.new('RGBA', img.size, (0, 0, 0, 0))
        d, do = ImageDraw.Draw(calque), ImageDraw.Draw(ombre)
        hl = self.taille * 1.22
        actif = dits[-1]
        for li, ligne in enumerate(lignes):
            total = sum(w for _, w in ligne) + esp * (len(ligne) - 1)
            x = (self.L - total) / 2
            yb = self.y + li * hl
            for m, w in ligne:
                if t >= m['debut'] - 0.04:
                    a = (t - (m['debut'] - 0.04)) / 0.16
                    montee = (1 - sortie_douce(a)) * 18 * self.k
                    couleur = LAITON if m is actif else CREME
                    s = rebond(a) if m is actif else 1.0
                    f = self.f if s == 1.0 else police(INTER, self.taille * s, 800)
                    dx = (w - f.getlength(m['mot'])) / 2
                    pos = (x + dx, yb + montee - (self.taille * (s - 1)) / 2)
                    alpha = int(255 * min(1.0, a * 2.5))
                    d.text(pos, m['mot'], font=f, fill=couleur + (alpha,),
                           stroke_width=self.contour, stroke_fill=NUIT + (int(alpha * 0.92),))
                    do.text((pos[0], pos[1] + 6 * self.k), m['mot'], font=f, fill=(0, 0, 0, int(alpha * 0.55)),
                            stroke_width=self.contour)
                x += w + esp
        ombre = ombre.filter(ImageFilter.GaussianBlur(8 * self.k))
        base = img.convert('RGBA')
        base.alpha_composite(ombre)
        base.alpha_composite(calque)
        return base.convert('RGB')


# ---------------------------------------------------------------- texte derrière le sujet (version simple)
def _flou_boite(a, r):
    if r <= 0:
        return a
    k = 2 * r + 1
    c = np.cumsum(np.pad(a, ((r + 1, r), (0, 0)), mode='edge'), axis=0)
    a = (c[k:] - c[:-k]) / k
    c = np.cumsum(np.pad(a, ((0, 0), (r + 1, r)), mode='edge'), axis=1)
    return (c[:, k:] - c[:, :-k]) / k


def masque_sujet(rgb, seuil=34.0, douceur=6, bord=24, fond=None):
    """Masque 0..1 du sujet (1 = sujet) par distance à la couleur du fond estimée sur les bords.
    VERSION SIMPLE (voir en-tête) : fond uni seulement."""
    x = rgb.astype(np.float32)
    if fond is None:
        bords = np.concatenate([x[:bord].reshape(-1, 3), x[-bord:].reshape(-1, 3),
                                x[:, :bord].reshape(-1, 3), x[:, -bord:].reshape(-1, 3)])
        fond = np.median(bords, axis=0)
    dist = np.sqrt(((x - np.asarray(fond, np.float32)) ** 2).sum(axis=2))
    m = np.clip((dist - seuil) / 18.0, 0, 1)
    # lissage : on comble les petits trous puis on adoucit le bord
    m = _flou_boite(m, douceur)
    m = np.clip((m - 0.35) / 0.3, 0, 1)
    return _flou_boite(m, max(1, douceur // 2))


def titre_derriere(img, texte, y, taille, apparition, masque, couleur=LAITON, police_chemin=INTER, graisse=800):
    """Pose un grand titre centré à la hauteur y (px), puis recolle le sujet par-dessus (masque 0..1).
    `apparition` 0..1 : le titre monte et apparaît (courbe douce)."""
    if apparition <= 0:
        return img
    L, H = img.size
    k = H / 1920
    f = police(police_chemin, taille * k, graisse)
    a = sortie_douce(apparition)
    calque = Image.new('RGBA', img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(calque)
    w = f.getlength(texte)
    d.text(((L - w) / 2, y * k + (1 - a) * 40 * k), texte, font=f, fill=couleur + (int(255 * a),))
    base = img.convert('RGBA')
    base.alpha_composite(calque)
    avant = np.asarray(img.convert('RGB'), np.float32)
    apres = np.asarray(base.convert('RGB'), np.float32)
    m = masque[..., None]
    return Image.fromarray((apres * (1 - m) + avant * m).astype(np.uint8))


# ---------------------------------------------------------------- lecture / écriture vidéo (ffmpeg)
def _lancer(cmd, **kw):
    try:
        return subprocess.Popen(cmd, stderr=subprocess.PIPE, **kw)
    except FileNotFoundError as e:
        raise ErreurEffet(f'{cmd[0]} introuvable : installer ffmpeg et le mettre dans le PATH') from e


def _verifier_fin(p, quoi):
    err = p.stderr.read().decode('utf-8', 'replace').strip() if p.stderr else ''
    if p.wait() != 0:
        raise ErreurEffet(f'ffmpeg en échec ({quoi}, code {p.returncode}) : {err[-600:]}')


def lire_video(chemin, L, H):
    """Images RGB (numpy) d'une vidéo ; ErreurEffet si le fichier manque ou si ffmpeg échoue."""
    _verifier_fichier(chemin, 'Vidéo')
    p = _lancer(['ffmpeg', '-v', 'error', '-i', chemin, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
                stdout=subprocess.PIPE)
    n = L * H * 3
    lues = 0
    while True:
        b = p.stdout.read(n)
        if len(b) < n:
            break
        lues += 1
        yield np.frombuffer(b, np.uint8).reshape(H, L, 3)
    _verifier_fin(p, f'lecture de {chemin}')
    if lues == 0:
        raise ErreurEffet(f'Aucune image lue dans {chemin} (taille attendue {L}x{H})')


class EcritureVideo:
    """Encodeur H.264 alimenté image par image ; `fermer()` vérifie le code de retour de ffmpeg."""

    def __init__(self, chemin, L, H, fps=30, filtre=None):
        cmd = ['ffmpeg', '-y', '-v', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{L}x{H}',
               '-r', str(fps), '-i', '-']
        if filtre:
            cmd += ['-vf', filtre]
        cmd += ['-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', chemin]
        self.chemin = chemin
        self.p = _lancer(cmd, stdin=subprocess.PIPE)

    def ecrire(self, image):
        try:
            self.p.stdin.write(np.asarray(image, np.uint8).tobytes())
        except (BrokenPipeError, OSError):
            self.p.stdin = None
            _verifier_fin(self.p, f'écriture de {self.chemin}')
            raise ErreurEffet(f"ffmpeg s'est arrêté pendant l'écriture de {self.chemin}")

    def fermer(self):
        if self.p.stdin:
            self.p.stdin.close()
        _verifier_fin(self.p, f'écriture de {self.chemin}')


def ecrire_video(chemin, L, H, fps=30, filtre=None):
    return EcritureVideo(chemin, L, H, fps, filtre)


def _principal(argv):
    if len(argv) >= 4 and argv[1] == 'transcrire':
        ref = _lire_texte(argv[5], 'Texte de référence') if len(argv) > 5 else None
        mots = transcrire(argv[2], argv[3], argv[4] if len(argv) > 4 else 'large-v3', texte_reference=ref)
        print(len(mots), 'mots ->', argv[3])
    elif len(argv) >= 5 and argv[1] == 'incruster':
        entree, mots, sortie = argv[2], charger_mots(argv[3]), argv[4]
        try:
            y = int(argv[5]) if len(argv) > 5 else 1240
            taille = int(argv[6]) if len(argv) > 6 else 76
        except ValueError as e:
            raise ErreurEffet('y et taille doivent être des nombres entiers de pixels') from e
        _verifier_fichier(entree, 'Vidéo')
        try:
            sonde = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries',
                                    'stream=width,height', '-of', 'csv=p=0', entree],
                                   capture_output=True, text=True)
        except FileNotFoundError as e:
            raise ErreurEffet('ffprobe introuvable : installer ffmpeg et le mettre dans le PATH') from e
        if sonde.returncode != 0 or ',' not in sonde.stdout:
            raise ErreurEffet(f'ffprobe ne lit pas {entree} : {sonde.stderr.strip()[-400:]}')
        L, H = map(int, sonde.stdout.strip().split(',')[:2])
        st = SousTitresMotAMot(mots, L, H, y=y, taille=taille)
        out = ecrire_video(sortie, L, H)
        for i, fr in enumerate(lire_video(entree, L, H)):
            out.ecrire(st.dessiner(Image.fromarray(fr), i / 30))
        out.fermer()
        print('écrit :', sortie)
    else:
        print(__doc__)
        return 2
    return 0


if __name__ == '__main__':
    try:
        sys.exit(_principal(sys.argv))
    except ErreurEffet as e:
        print('Erreur :', e, file=sys.stderr)
        sys.exit(1)
    except ValueError as e:  # zone sûre, taille sous 36 px
        print('Erreur :', e, file=sys.stderr)
        sys.exit(1)
