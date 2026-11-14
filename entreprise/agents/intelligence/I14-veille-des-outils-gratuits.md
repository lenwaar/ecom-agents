---
code: I14
nom: "Veille des outils gratuits"
departement: intelligence
porteur: veille-outils
phase: maintenant
validation_humaine: non
inspire_de: "ajout pour la boutique"
---

# I14 · Veille des outils gratuits

Département **Intelligence**. Exécuté par le sous-agent `veille-outils` (`.claude/agents/veille-outils.md`). Phase : maintenant.

## Mission
Repérer les outils et modèles gratuits qui feraient gagner du temps, avec leur licence.

## Quand il travaille
Chaque mois.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- donnees/entreprise.db (toutes les tables)
- exports Stripe CSV
- statistiques natives TikTok, Instagram, Pinterest
- `knowledge/decisions.md`

## Ce qu'il produit
Rapport de veille (propositions, jamais d'installation automatique).
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- Python + SQLite (scripts de tools/)
- Google Trends
- Google Search Console
- statistiques natives des réseaux

## Validation humaine
Aucune action extérieure : travail interne, relu par le porteur.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.
