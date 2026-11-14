#!/usr/bin/env python3
"""Génère les 137 fiches d'agents et l'index à partir de entreprise/catalogue.py.

Usage : python tools/generer_entreprise.py   (depuis la racine du dépôt, aucune dépendance)
Ne jamais modifier les fiches à la main : modifier catalogue.py puis relancer ce script.
"""
import importlib.util, pathlib, re, shutil, sys, unicodedata
from collections import Counter

RACINE = pathlib.Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location('catalogue', RACINE / 'entreprise/catalogue.py')
cat = importlib.util.module_from_spec(spec); spec.loader.exec_module(cat)

def slug(texte):
    t = unicodedata.normalize('NFKD', texte).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', t).strip('-')

def porteur_txt(p):
    if p == 'script': return 'un script sans IA de `tools/` (gratuit, hors ligne)'
    if p == 'humain': return "l'humain (les agents ne font que rappeler)"
    return f'le sous-agent `{p}` (`.claude/agents/{p}.md`)'

INTERDITS = [
    "Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.",
    "Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.",
    "Fausse promotion, fausse urgence, faux avis, allégation trompeuse.",
    "Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.",
]

def fiche(d, code, nom, video, mission, quand, sortie, porteur, phase, validation):
    dep = cat.DEPARTEMENTS[d]
    l = ['---', f'code: {code}', f'nom: "{nom}"', f'departement: {d}', f'porteur: {porteur}',
         f'phase: {phase}', f'validation_humaine: {"oui" if validation else "non"}',
         f'inspire_de: "{video or "ajout pour la boutique"}"', '---', '',
         f'# {code} · {nom}', '',
         f'Département **{dep["nom"]}**. Exécuté par {porteur_txt(porteur)}. Phase : {phase}.', '',
         '## Mission', mission, '',
         '## Quand il travaille', quand, '',
         '## Ce qu\'il lit',
         '- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`']
    l += [f'- `{x}`' if '/' in x and ' ' not in x else f'- {x}' for x in dep['lit']]
    l += ['', '## Ce qu\'il produit', sortie,
          'Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l\'en-tête YAML standard, statut `à-valider`.', '',
          '## Outils (0 €)'] + [f'- {o}' for o in dep['outils']]
    l += ['', '## Validation humaine', validation or 'Aucune action extérieure : travail interne, relu par le porteur.', '',
          '## Interdits'] + [f'- {x}' for x in INTERDITS]
    if video: l += ['', f'> Correspond à « {video} » dans la vidéo de référence, adapté à une boutique en dropshipping à 0 €.']
    return '\n'.join(l) + '\n'

def main():
    codes = [a[1] for a in cat.AGENTS]
    if len(codes) != len(set(codes)): sys.exit('Codes en double dans catalogue.py')
    dossier = RACINE / 'entreprise/agents'
    if dossier.exists(): shutil.rmtree(dossier)
    lignes_index = []
    for a in cat.AGENTS:
        d, code, nom = a[0], a[1], a[2]
        p = dossier / d / f'{code}-{slug(nom)}.md'
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(fiche(*a), encoding='utf-8')
        lignes_index.append((d, code, nom, a[3], a[7], a[8], 'oui' if a[9] else 'non', p.relative_to(RACINE / 'entreprise').as_posix()))

    par_dep = Counter(a[0] for a in cat.AGENTS)
    par_porteur = Counter(a[7] for a in cat.AGENTS)
    out = ['# Catalogue des agents de l\'entreprise', '',
           f'**{len(cat.AGENTS)} agents** répartis en {len(cat.DEPARTEMENTS) - 1} départements et un Cerveau. '
           'Fichier généré par `python tools/generer_entreprise.py` depuis `entreprise/catalogue.py` : ne pas le modifier à la main.', '',
           '## Par département', '', '| Département | Code | Agents | Rôle |', '|---|---|---|---|']
    for k, dep in cat.DEPARTEMENTS.items():
        out.append(f'| {dep["nom"]} | {dep["code"]} | {par_dep[k]} | {dep["role"]} |')
    out += ['', '## Qui exécute quoi', '',
            'Un sous-agent Claude Code porte plusieurs fiches : au-delà de 20 à 25 sous-agents, Claude Code choisit mal (voir `docs/organisation.md`).', '',
            '| Porteur | Fiches |', '|---|---|']
    for p, n in sorted(par_porteur.items(), key=lambda x: -x[1]):
        out.append(f'| `{p}` | {n} |')
    for k, dep in cat.DEPARTEMENTS.items():
        out += ['', f'## {dep["nom"]} ({par_dep[k]})', '', '| Code | Agent | Vu dans la vidéo | Porteur | Phase | Validation |', '|---|---|---|---|---|---|']
        for d, code, nom, video, porteur, phase, valid, chemin in lignes_index:
            if d == k:
                out.append(f'| {code} | [{nom}]({chemin}) | {video or "-"} | `{porteur}` | {phase} | {valid} |')
    (RACINE / 'entreprise/catalogue.md').write_text('\n'.join(out) + '\n', encoding='utf-8')

    inter = ['# Ce qui interrompt la boucle', '',
             'Les agents travaillent seuls tant que rien ne sort de la boutique. Ces cas remontent **toujours** à l\'humain, '
             'dans la table `validations` de `donnees/entreprise.db` et dans la section « En attente de vous » de la page du lundi.', '',
             '| Situation | Fiche qui la détecte | Ce que vous faites |', '|---|---|---|']
    for s, code, action in cat.INTERRUPTIONS:
        inter.append(f'| {s} | {code} | {action} |')
    inter += ['', '## Validation humaine (« You approve »)', '',
              '- **Vous** : toute publication, tout envoi, tout paiement, tout remboursement, toute commande fournisseur.',
              '- **Votre équipe** : aucune pour l\'instant ; la fiche A04 prépare une annonce le jour où il en faut une.',
              '- **Les clients** : ils ne parlent jamais à un agent sans que vous ayez validé le modèle de réponse.',
              '', 'Canal à 0 € : la file `validations` + la page du lundi. Une alerte Telegram (bot gratuit) pourra être ajoutée plus tard, sur votre accord.']
    (RACINE / 'entreprise/interruptions.md').write_text('\n'.join(inter) + '\n', encoding='utf-8')
    print(f'{len(cat.AGENTS)} fiches générées dans entreprise/agents/')

if __name__ == '__main__':
    main()
