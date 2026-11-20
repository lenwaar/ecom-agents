#!/usr/bin/env python3
"""Page du lundi (fiche I05) : une seule page pour l'humain, chaque lundi.

Usage (depuis la racine du dépôt) :
  python tools/page_lundi.py                    écrit outputs/AAAA-MM-JJ-cerveau-page-du-lundi.md
  python tools/page_lundi.py --exemple          version de démonstration (données fictives) dans docs/exemples/
Option : --jour AAAA-MM-JJ pour une autre date de référence.
Le sous-agent `cerveau` complète ensuite la section « À faire » à partir des rapports de la semaine.

Bloc 5 « Marketing » (V2-3, fiche M22) : lit data/posts.json, data/commandes.json et data/file-marketing.json
(hors Git ; repli sur les modèles *.vide.json). Revenu d'un post = CA TTC des seules commandes réelles payées
qu'il cite ; aucun chiffre estimé. Même règle que qg/studio/marketing.js (test de concordance dans qg/studio/tests).
"""
import datetime as dt, json, pathlib, sys
from decimal import Decimal
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import base

def _lire(dossier, nom, exemple):
    """nom.json (hors Git), sinon nom.vide.json ; en mode exemple, nom.exemple.json seulement."""
    noms = [f'{nom}.exemple.json'] if exemple else [f'{nom}.json', f'{nom}.vide.json']
    for n in noms:
        f = pathlib.Path(dossier) / n
        if f.exists():
            try:
                return json.loads(f.read_text(encoding='utf-8-sig')), f'data/{n}'
            except ValueError:
                return None, f'data/{n}'
    return None, f'data/{noms[0]}'

def _eur(d):
    return f'{d:,.2f}'.replace(',', ' ').replace('.', ',') + ' €'

def bloc_marketing(dossier, exemple=False):
    """Lignes du bloc « Ce qui a marché / Ce qui part ensuite ». Vide -> message clair, aucun chiffre inventé."""
    posts, f_posts = _lire(dossier, 'posts', exemple)
    cmds, f_cmds = _lire(dossier, 'commandes', exemple)
    file_m, f_file = _lire(dossier, 'file-marketing', exemple)
    garder = (lambda o: o.get('exemple') is True) if exemple else (lambda o: o.get('exemple') is not True)
    commandes = {c['id']: c for c in (cmds or {}).get('commandes', []) or []
                 if isinstance(c, dict) and isinstance(c.get('id'), str) and garder(c)
                 and c.get('statut') == 'payee' and isinstance(c.get('montant_ttc'), (int, float)) and not isinstance(c.get('montant_ttc'), bool)}
    marche = []
    for po in (posts or {}).get('posts', []) or []:
        if not isinstance(po, dict) or not po.get('id') or not garder(po): continue
        refs = [r for r in po.get('references_commandes') or [] if r in commandes]
        if not refs: continue
        ca = sum((Decimal(str(commandes[r]['montant_ttc'])) for r in refs), Decimal('0'))
        marche.append((ca, len(refs), po))
    marche.sort(key=lambda x: (-x[0], str(x[2]['id'])))
    l = ['## 5. Marketing', '', '### Ce qui a marché', '']
    if marche:
        for ca, n, po in marche[:3]:
            nom = po.get('sujet') or po['id']
            l.append(f'- {po.get("plateforme") or "?"} · {nom} (`{po["id"]}`) : {_eur(ca)} TTC, {n} commande(s) payée(s)')
        l.append(f'- Source : `{f_posts}` relié à `{f_cmds}` (' + ("commandes d'exemple seulement, aucun chiffre réel" if exemple else 'commandes réelles seulement') + ').')
    else:
        l.append(f"- Aucun post relié à une commande réelle payée pour l'instant (`{f_posts}`). Aucun revenu n'est estimé.")
    elements = [e for e in (file_m or {}).get('elements', []) or [] if isinstance(e, dict) and e.get('id') and garder(e)]
    statut = lambda e: str(e.get('statut', '')).strip().lower()
    prets = [e for e in elements if statut(e) == 'validé']
    attente = [e for e in elements if statut(e) == 'à-valider']
    l += ['', '### Ce qui part ensuite', '']
    if not prets and not attente:
        l.append(f'- Rien dans la file marketing (`{f_file}`). Les agents y déposent posts, légendes et e-mails à valider.')
    def nom_el(e):
        t, pf = e.get('type') or 'post', e.get('plateforme') or ''
        return f'{t}{" " + pf if pf and pf.lower() != t.lower() else ""} « {e.get("titre") or e["id"]} »'
    for e in prets[:5]:
        l.append(f'- Validé, à publier à la main : {nom_el(e)} ({e.get("code") or "?"})')
    for e in attente[:5]:
        l.append(f'- En attente de votre décision : {nom_el(e)} ({e.get("code") or "?"})')
    if prets or attente:
        l.append("- Décider : page `/marketing` du QG (`cd qg/studio && npm start`). Rien n'est publié ni envoyé automatiquement.")
    return l

def page(i, exemple=False, dossier_data=None):
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
          *bloc_marketing(dossier_data or base.RACINE / 'data', exemple), '',
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
