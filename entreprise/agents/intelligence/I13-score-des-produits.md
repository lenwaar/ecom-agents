---
code: I13
nom: "Score des produits"
departement: intelligence
porteur: analyste-marche
phase: après lancement
validation_humaine: oui
inspire_de: "ajout pour la boutique"
---

# I13 · Score des produits

Département **Intelligence**. Exécuté par le sous-agent `analyste-marche` (`.claude/agents/analyste-marche.md`). Phase : après lancement.

## Mission
Noter chaque produit en vente : garder, pousser ou retirer.

## Quand il travaille
Chaque mois.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- donnees/entreprise.db (toutes les tables)
- exports Stripe CSV
- statistiques natives TikTok, Instagram, Pinterest
- `knowledge/decisions.md`

## Ce qu'il produit
Classement des produits avec raisons.
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- Python + SQLite (scripts de tools/)
- Google Trends
- Google Search Console
- statistiques natives des réseaux

## Validation humaine
L'humain décide des retraits.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.
