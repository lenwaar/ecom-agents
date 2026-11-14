#!/usr/bin/env python3
"""Page du lundi (fiche I05) : une seule page pour l'humain, chaque lundi.

Usage (depuis la racine du dépôt) :
  python tools/page_lundi.py                    écrit outputs/AAAA-MM-JJ-cerveau-page-du-lundi.md
  python tools/page_lundi.py --exemple          version de démonstration (données fictives) dans docs/exemples/
Option : --jour AAAA-MM-JJ pour une autre date de référence.
Le sous-agent `cerveau` complète ensuite la section « À faire » à partir des rapports de la semaine.
"""
import datetime as dt, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import base

def page(i, exemple=False):
    semaine = dt.date.fromisoformat(i['jour']).isocalendar()[1]
    l = ['---', 'agent: cerveau', 'statut: à-valider', 'sources: [donnees/entreprise.db, entreprise/interruptions.md]',
         'prochaine-etape: humain', '---', '', f'# Votre page du lundi · semaine {semaine}', '']
    if exemple:
        l += ['> EXEMPLE : données fictives de `donnees/exemple.db`, pour montrer la forme. Aucun chiffre réel.', '']
    l += [f'Période : du {i["debut"]} au {i["jour"]}.', '',
          '| Chiffre d\'affaires | Marge nette | Commandes | Livrées à temps | En attente de vous |', '|---|---|---|---|---|',
          f'| {base.euros(i["ca"])} | {base.euros(i["marge"])} | {i["commandes"]} | {i["a_temps"]} / {i["livrees"]} | {i["attente"]} |', '',
          '## 1. D\'où vient l\'argent', '']
    if i['sources']:
        total = sum(s['montant'] for s in i['sources']) or 1
        for s in i['sources']:
            l.append(f'- {s["source"]} : {base.euros(s["montant"])} ({round(100 * s["montant"] / total)} %)')
    else:
        l.append('- Aucune vente cette semaine.')
    l += ['', '## 2. Ce qui est à risque', '']
    l += [f'- **{c}** {t}' for c, t in i['risques']] or ['- Rien à signaler.']
    l += ['', '## 3. En attente de vous', '']
    l += [f'- [ ] [{v["id"]}] {v["sujet"]} ({v["agent"]}, priorité {v["priorite"]})' + (f' : `{v["fichier"]}`' if v['fichier'] else '')
          for v in i['a_valider']] or ['- Rien.']
    l += ['', '## 4. À faire ensuite', '', '- À compléter par le sous-agent `cerveau` (3 actions maximum, chacune liée à une fiche).', '',
          '## Autres chiffres', '',
          f'- Tickets résolus : {i["tickets"]}', f'- Factures payées : {i["factures"]}',
          f'- Nouveaux prospects : {i["prospects"]}', f'- Dépenses : {base.euros(i["depenses"])}', '',
          'Décider : `python tools/base.py valider <n°> oui|non`.']
    return '\n'.join(l) + '\n'

def main(argv):
    jour = argv[argv.index('--jour') + 1] if '--jour' in argv else None
    if '--exemple' in argv:
        cx = base.exemple(); jour = jour or '2026-11-16'
        cible = base.RACINE / 'docs/exemples/page-du-lundi.md'
        cible.write_text(page(base.indicateurs(cx, jour), exemple=True), encoding='utf-8')
    else:
        cx = base.connecter(); jour = jour or dt.date.today().isoformat()
        cible = base.RACINE / 'outputs' / f'{jour}-cerveau-page-du-lundi.md'
        cible.write_text(page(base.indicateurs(cx, jour)), encoding='utf-8')
    print(f'Page du lundi écrite : {cible.relative_to(base.RACINE)}')

if __name__ == '__main__':
    main(sys.argv[1:])
