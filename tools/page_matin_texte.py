#!/usr/bin/env python3
"""Page du matin en texte brut, pour une lecture à voix haute (V2-6, docs/jarvis.md).

Prend la dernière page du lundi (outputs/AAAA-MM-JJ-cerveau-page-du-lundi.md, écrite par
tools/page_lundi.py) et la convertit en texte simple : sans en-tête YAML, sans balises Markdown,
tableaux lus ligne par ligne (« en-tête : valeur »). Aucun appel réseau, rien n'est envoyé.

Usage (depuis la racine du dépôt) :
  py tools/page_matin_texte.py                       affiche le texte
  py tools/page_matin_texte.py --sortie CHEMIN.txt   écrit le texte dans un fichier (UTF-8)
  py tools/page_matin_texte.py --page CHEMIN.md      convertit une page précise
"""
import pathlib, re, sys

RACINE = pathlib.Path(__file__).resolve().parent.parent


def derniere_page():
    pages = sorted((RACINE / 'outputs').glob('*-cerveau-page-du-lundi.md'))
    return pages[-1] if pages else None


def sans_balises(t):
    t = re.sub(r'`([^`]*)`', r'\1', t)
    t = re.sub(r'\*\*([^*]+)\*\*', r'\1', t)
    t = re.sub(r'\*([^*]+)\*', r'\1', t)
    t = re.sub(r'\[([^\]]+)\]\([^)]*\)', r'\1', t)
    return t.strip()


def cellules(ligne):
    return [sans_balises(c) for c in ligne.strip().strip('|').split('|')]


def en_texte(md):
    lignes = md.splitlines()
    if lignes and lignes[0].strip() == '---':  # en-tête YAML
        fin = next((i for i, l in enumerate(lignes[1:], 1) if l.strip() == '---'), 0)
        lignes = lignes[fin + 1:]
    sortie, entetes = [], None
    for l in lignes:
        s = l.strip()
        if s.startswith('|'):
            if re.fullmatch(r'\|[\s|:-]+\|', s):
                continue  # ligne de séparation du tableau
            c = cellules(s)
            if entetes is None:
                entetes = c
            else:
                sortie += [f'{e} : {v}.' for e, v in zip(entetes, c) if v]
            continue
        entetes = None
        if not s:
            if sortie and sortie[-1]:
                sortie.append('')
            continue
        s = re.sub(r'^#+\s*', '', s)
        s = re.sub(r'^>\s*', '', s)
        s = re.sub(r'^[-*]\s+(\[[ xX]\]\s+)?', '', s)
        s = sans_balises(s)
        if s and s[-1] not in '.:!?':
            s += '.'
        sortie.append(s)
    return '\n'.join(sortie).strip() + '\n'


def main(argv):
    for flux in (sys.stdout, sys.stderr):
        if hasattr(flux, 'reconfigure'):
            flux.reconfigure(encoding='utf-8')  # console Windows en cp1252 (leçon 15)
    source = pathlib.Path(argv[argv.index('--page') + 1]) if '--page' in argv else derniere_page()
    if source is None or not source.exists():
        print('Aucune page du lundi dans outputs/ : lancez d\'abord py tools/page_lundi.py (ou /lundi).')
        return 1
    try:
        texte = en_texte(source.read_text(encoding='utf-8'))
    except (OSError, UnicodeDecodeError) as e:
        print(f'Lecture impossible de {source} : {e}', file=sys.stderr)
        return 2
    if '--sortie' in argv:
        cible = pathlib.Path(argv[argv.index('--sortie') + 1])
        try:
            cible.write_text(texte, encoding='utf-8')
        except OSError as e:
            print(f'Écriture impossible dans {cible} : {e}', file=sys.stderr)
            return 2
        print(f'Texte écrit : {cible} (source : {source.name})')
    else:
        sys.stdout.write(texte)
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
