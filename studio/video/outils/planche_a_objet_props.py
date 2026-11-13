"""Props Remotion de « De la planche à l'objet » : sous-titres mot à mot.

  py outils/planche_a_objet_props.py .cache/sous-titres/mots-v2.json

Les temps viennent de faster-whisper (large-v3) sur la voix Piper ; l'orthographe vient du texte écrit
(medias/voix/de-la-planche-a-l-objet.md), pour qu'aucune faute de transcription n'apparaisse à l'écran.
Les deux versions (muette et avec voix) utilisent les mêmes temps : la version muette garde le rythme de la voix.
Sorties : .cache/sous-titres/props-v1.json, props-v2.json, et medias/voix/de-la-planche-a-l-objet.json/.srt
"""
import difflib
import json
import os
import re
import sys
import unicodedata

ICI = os.path.dirname(os.path.abspath(__file__))
VIDEO = os.path.join(ICI, '..')
DEPOT = os.path.abspath(os.path.join(VIDEO, '..', '..'))
NBSP = ' '

# « | » ouvre un nouveau groupe de sous-titres
TEXTE = [
    "De la planche… à l'objet.",
    "|Ça, c'est ce qu'il y a |dans la boîte.",
    "|Une boîte à musique, |à manivelle.",
    f"|Un écran de plus{NBSP}? |Non.",
    "|Un objet à construire.",
    "|Éteignez les lumières… |et laissez briller |le laiton.",
    "|Rouage et Laiton. |Suivez-nous.",
]
# Départ de chaque réplique dans la bande son (planche_a_objet_audio.py, REPLIQUES) : faster-whisper
# fait souvent commencer le premier mot d'une phrase dans le silence qui la précède ; on le recale.
DEPARTS = [0.20, 2.25, 4.90, 8.25, 11.05, 13.65, 16.95]
DEBUT_SOUS_TITRES = 1.9   # le titre de l'accroche porte déjà le texte de 0 à 2 s
FIN_SOUS_TITRES = 16.8    # la carte de fin porte le nom


def norm(m):
    m = unicodedata.normalize('NFD', m.lower())
    m = ''.join(c for c in m if unicodedata.category(c) != 'Mn')
    return re.sub(r"[^a-z']", '', m.replace('’', "'"))


ecrits = []
for n, ligne in enumerate(TEXTE):
    for k, brut in enumerate(x for x in ligne.split(' ') if x):
        ecrits.append({'mot': brut.lstrip('|'), 'page': brut.startswith('|'), 'premier': n if k == 0 else None})

entendus = json.load(open(sys.argv[1], encoding='utf-8'))
a = [norm(m['mot']) for m in ecrits]
b = [norm(m['mot']) for m in entendus]
sm = difflib.SequenceMatcher(a=a, b=b, autojunk=False)
temps = [None] * len(ecrits)
for op, i1, i2, j1, j2 in sm.get_opcodes():
    if op == 'equal' or (op == 'replace' and i2 - i1 == j2 - j1):
        for k in range(i2 - i1):
            temps[i1 + k] = (entendus[j1 + k]['debut'], entendus[j1 + k]['fin'])
    elif op == 'replace':
        # n mots écrits pour m mots entendus : on répartit la durée totale
        d0, d1 = entendus[j1]['debut'], entendus[j2 - 1]['fin']
        for k in range(i2 - i1):
            temps[i1 + k] = (d0 + (d1 - d0) * k / (i2 - i1), d0 + (d1 - d0) * (k + 1) / (i2 - i1))
manquants = [ecrits[i]['mot'] for i, t in enumerate(temps) if t is None]
# mots écrits non entendus : interpolés entre voisins
for i, t in enumerate(temps):
    if t is None:
        prev = next((temps[j][1] for j in range(i - 1, -1, -1) if temps[j]), 0)
        nxt = next((temps[j][0] for j in range(i + 1, len(temps)) if temps[j]), prev + 0.3)
        temps[i] = (prev, max(prev + 0.05, nxt))

mots = []
for m, (d, f) in zip(ecrits, temps):
    if m['premier'] is not None:
        d = min(max(d, DEPARTS[m['premier']] + 0.08), f - 0.05)
    mots.append({'mot': m['mot'], 'debut': round(d, 3), 'fin': round(f, 3), 'page': m['page']})

visibles = [m for m in mots if DEBUT_SOUS_TITRES <= m['debut'] < FIN_SOUS_TITRES]
if visibles:
    visibles[0]['page'] = True

os.makedirs(os.path.join(VIDEO, '.cache', 'sous-titres'), exist_ok=True)
json.dump({'mots': visibles, 'mention': 'Rendus 3D de démonstration,\nproduit non vendu'},
          open(os.path.join(VIDEO, '.cache', 'sous-titres', 'props-v1.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
json.dump({'mots': visibles, 'mention': 'Rendus 3D de démonstration,\nproduit non vendu,\nvoix de synthèse (IA)'},
          open(os.path.join(VIDEO, '.cache', 'sous-titres', 'props-v2.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

# Fichiers légers commités avec la voix : temps par mot (.json) et sous-titres classiques (.srt)
voix = os.path.join(DEPOT, 'medias', 'voix')
os.makedirs(voix, exist_ok=True)
json.dump(mots, open(os.path.join(voix, 'de-la-planche-a-l-objet.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)


def hms(t):
    ms = int(round(t * 1000))
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


groupes, cur = [], []
for m in mots:
    if m['page'] and cur:
        groupes.append(cur)
        cur = []
    cur.append(m)
groupes.append(cur)
with open(os.path.join(voix, 'de-la-planche-a-l-objet.srt'), 'w', encoding='utf-8') as s:
    for n, g in enumerate(groupes, 1):
        s.write(f"{n}\n{hms(g[0]['debut'])} --> {hms(g[-1]['fin'])}\n{' '.join(x['mot'] for x in g)}\n\n")

print(f"{len(entendus)} mots entendus, {len(ecrits)} mots écrits, non retrouvés : {manquants or 'aucun'}")
for m in mots:
    print(m)
