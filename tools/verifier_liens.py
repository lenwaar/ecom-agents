#!/usr/bin/env python3
"""Vérification des liens internes du site construit (Python standard, aucune dépendance).

Usage : py tools/verifier_liens.py [dossier]      (par défaut : site/dist)
Lancé automatiquement après `npm run build` (script postbuild de site/package.json).

Contrôle chaque page HTML du dossier :
- href, src, srcset, poster, action internes vers une page ou un fichier inexistant ;
- ancres #id absentes de la page cible (même page ou autre page).
Ignore les liens externes (http, https, //), mailto:, tel:, data:, javascript:.
Code de sortie 0 = aucun lien cassé, 1 = au moins un lien cassé (ou dossier absent).
"""
import pathlib
import sys
from html.parser import HTMLParser
from urllib.parse import unquote, urlsplit

RACINE = pathlib.Path(__file__).resolve().parent.parent
ATTRIBUTS = {'href', 'src', 'poster', 'action'}
IGNORES = ('http:', 'https:', '//', 'mailto:', 'tel:', 'data:', 'javascript:', 'blob:')


class Lecteur(HTMLParser):
    """Relève les liens et les identifiants (id, name) d'une page."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.liens = []   # (ligne, attribut, valeur)
        self.ids = set()

    def handle_starttag(self, balise, attrs):
        ligne = self.getpos()[0]
        for nom, valeur in attrs:
            if valeur is None:
                continue
            if nom in ('id', 'name') and balise != 'meta':
                self.ids.add(valeur)
            # <link rel="canonical"> et assimilés pointent vers des URL absolues : couverts par IGNORES.
            if nom in ATTRIBUTS:
                self.liens.append((ligne, nom, valeur.strip()))
            elif nom in ('srcset', 'imagesrcset'):
                for morceau in valeur.split(','):
                    url = morceau.strip().split(' ')[0]
                    if url:
                        self.liens.append((ligne, nom, url))

    handle_startendtag = handle_starttag


def lire(page):
    lecteur = Lecteur()
    lecteur.feed(page.read_text(encoding='utf-8'))
    return lecteur


def cible(dist, page, chemin):
    """Fichier visé par un chemin (absolu depuis dist ou relatif à la page), ou None s'il n'existe pas."""
    base = dist if chemin.startswith('/') else page.parent
    p = (base / chemin.lstrip('/')).resolve()
    try:
        p.relative_to(dist)
    except ValueError:
        return None
    candidats = [p / 'index.html'] if chemin.endswith('/') else [p, p / 'index.html', p.with_name(p.name + '.html')]
    return next((c for c in candidats if c.is_file()), None)


def main():
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    dist = pathlib.Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else RACINE / 'site' / 'dist'
    if not dist.is_dir():
        print(f'Dossier introuvable : {dist} (lancer d\'abord la construction du site).')
        return 1

    pages = sorted(dist.rglob('*.html'))
    cache = {}

    def lecteur(p):
        if p not in cache:
            cache[p] = lire(p)
        return cache[p]

    erreurs, verifies = [], 0
    for page in pages:
        lp = lecteur(page)
        nom_page = page.relative_to(dist).as_posix()
        for ligne, attr, valeur in lp.liens:
            if not valeur or valeur.lower().startswith(IGNORES):
                continue
            verifies += 1
            morceaux = urlsplit(valeur)
            chemin, ancre = unquote(morceaux.path), unquote(morceaux.fragment)
            fichier = page if chemin == '' else cible(dist, page, chemin)
            if fichier is None:
                erreurs.append(f'{nom_page}:{ligne} : {attr}="{valeur}" → page ou fichier introuvable')
                continue
            if ancre and fichier.suffix == '.html' and ancre not in lecteur(fichier).ids:
                erreurs.append(f'{nom_page}:{ligne} : {attr}="{valeur}" → ancre #{ancre} absente de {fichier.relative_to(dist).as_posix()}')

    for e in erreurs:
        print('ERREUR', e)
    print(f'Liens internes : {verifies} vérifiés dans {len(pages)} pages, {len(erreurs)} cassé(s).')
    return 1 if erreurs else 0


if __name__ == '__main__':
    sys.exit(main())
