#!/usr/bin/env python3
"""Contrôle qualité automatique du dépôt ecom-agents (aucune dépendance externe).

Usage : python tools/verifier_livrables.py        (depuis la racine du dépôt)
Code de sortie 0 = tout est conforme, 1 = au moins une erreur.
"""
import re, sys, pathlib

RACINE = pathlib.Path(__file__).resolve().parent.parent
EMOJI = re.compile('[\U0001F300-\U0001FAFF☀-➿]')
EXCEPTIONS_EMOJI = {'coordination'}          # les comptes rendus peuvent contenir les marqueurs 🔔
erreurs, avertissements = [], []

def entete(texte):
    m = re.match(r'^---\n(.*?)\n---', texte, re.S)
    if not m: return None
    champs = {}
    for ligne in m.group(1).splitlines():
        if ':' in ligne and not ligne.startswith(' '):
            cle, val = ligne.split(':', 1); champs[cle.strip()] = val.split('#')[0].strip()
    return champs

def rel(p): return p.relative_to(RACINE).as_posix()

# 1. Agents : frontmatter complet
for p in sorted((RACINE / '.claude/agents').glob('*.md')):
    h = entete(p.read_text(encoding='utf-8'))
    if not h: erreurs.append(f'{rel(p)} : frontmatter absent'); continue
    for cle in ('name', 'description', 'tools', 'model'):
        if not h.get(cle): erreurs.append(f'{rel(p)} : champ « {cle} » manquant')
    if h.get('name') and h['name'] != p.stem: erreurs.append(f'{rel(p)} : name « {h["name"]} » différent du nom de fichier')
    if not (RACINE / 'tests/scenarios' / f'{p.stem}.md').exists(): avertissements.append(f'{rel(p)} : aucun scénario de test')

# 2. Livrables : en-tête standard
for p in sorted((RACINE / 'outputs').glob('*.md')):
    h = entete(p.read_text(encoding='utf-8'))
    if not h: erreurs.append(f'{rel(p)} : en-tête YAML absent'); continue
    if not h.get('agent'): erreurs.append(f'{rel(p)} : champ « agent » manquant')
    if h.get('statut') not in ('à-valider', 'validé', 'brouillon'): erreurs.append(f'{rel(p)} : statut « {h.get("statut")} » invalide')
    elif h.get('statut') == 'brouillon': avertissements.append(f'{rel(p)} : statut « brouillon » (la règle est « à-valider »)')

# 3. Fiches produits : démonstration jamais en vente
for p in sorted((RACINE / 'site/src/content/produits').glob('*.md')):
    t = p.read_text(encoding='utf-8'); h = entete(t) or {}
    demo = h.get('demo', '').lower() == 'true'
    lien = re.search(r'^lien_paiement_stripe:\s*"?([^"\n]*)', t, re.M)
    if demo and lien and lien.group(1).strip(): erreurs.append(f'{rel(p)} : produit de démonstration avec un lien de paiement')
    if not demo and 'À VÉRIFIER' in t: erreurs.append(f'{rel(p)} : vrai produit avec des valeurs « À VÉRIFIER »')
    if re.search(r'^age_minimum:\s*(\d+)', t, re.M) and int(re.search(r'^age_minimum:\s*(\d+)', t, re.M).group(1)) < 14:
        erreurs.append(f'{rel(p)} : âge minimum inférieur à 14 ans')

# 4. Aucun emoji dans les contenus de la marque (site et knowledge)
for dossier in ('knowledge', 'site/src'):   # contenus de la marque ; les rapports internes peuvent utiliser ✅ ⚠️ ⛔
    for p in (RACINE / dossier).rglob('*'):
        if p.is_file() and p.suffix in ('.md', '.astro', '.html', '.ts', '.js', '.css', '.json'):
            if any(part in EXCEPTIONS_EMOJI for part in p.parts): continue
            if EMOJI.search(p.read_text(encoding='utf-8', errors='ignore')): erreurs.append(f'{rel(p)} : contient un emoji')

# 5. Aucun secret commité
for p in RACINE.rglob('*'):
    if p.is_file() and '.git' not in p.parts and 'node_modules' not in p.parts and p.suffix in ('.md', '.js', '.ts', '.astro', '.json', '.env', '.py'):
        if re.search(r'sk_(live|test)_[0-9A-Za-z]{10,}', p.read_text(encoding='utf-8', errors='ignore')): erreurs.append(f'{rel(p)} : clé secrète Stripe détectée')

print(f'Contrôle qualité ecom-agents : {len(erreurs)} erreur(s), {len(avertissements)} avertissement(s)')
for e in erreurs: print('  ERREUR       ', e)
for a in avertissements: print('  AVERTISSEMENT', a)
sys.exit(1 if erreurs else 0)
