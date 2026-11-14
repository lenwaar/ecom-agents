"""Une image clé par plan (0,35 s avant la fin du plan : tous les textes posés), lue dans plans.ts.

  py modeles-pub-robotime/images_cles.py brouillon|final     (depuis studio/video)
Sortie : medias/apercus/modeles-pub-robotime/<mode>-<variante>-<plan>.jpg
"""
import os
import re
import subprocess
import sys

ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.join(ICI, '..', '..', '..')
MODE = sys.argv[1] if len(sys.argv) > 1 else 'brouillon'
NOMS = {'A': 'accroche', 'B': 'demonstration', 'C': 'avant-apres'}
if MODE == 'final':
    DOSSIER, SUFFIXE = os.path.join(RACINE, 'medias'), '9x16'
else:
    DOSSIER, SUFFIXE = os.path.join(RACINE, 'medias', 'brouillons', 'modeles-pub-robotime'), 'brouillon-540x960'
APERCUS = os.path.join(RACINE, 'medias', 'apercus', 'modeles-pub-robotime')
os.makedirs(APERCUS, exist_ok=True)

texte = open(os.path.join(ICI, 'plans.ts'), encoding='utf-8').read()
for pid, debut, fin in re.findall(r"id: '([ABC]\d)', debut: ([\d.]+), fin: ([\d.]+)", texte):
    m = pid[0]
    for v in ('avec-marque', 'sans-marque'):
        video = os.path.join(DOSSIER, f'modele-pub-robotime-{m}-{NOMS[m]}-{v}-{SUFFIXE}.mp4')
        if not os.path.exists(video):
            continue
        t = float(fin) - 0.35
        sortie = os.path.join(APERCUS, f'{MODE}-{v}-{pid}.jpg')
        subprocess.run(['ffmpeg', '-y', '-hide_banner', '-loglevel', 'error', '-ss', f'{t:.2f}', '-i', video,
                        '-frames:v', '1', '-q:v', '2', sortie], check=True)
        print(sortie)
