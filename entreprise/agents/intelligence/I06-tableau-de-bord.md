---
code: I06
nom: "Tableau de bord"
departement: intelligence
porteur: script
phase: maintenant
validation_humaine: non
inspire_de: "ajout pour la boutique"
---

# I06 · Tableau de bord

Département **Intelligence**. Exécuté par un script sans IA de `tools/` (gratuit, hors ligne). Phase : maintenant.

## Mission
Afficher les indicateurs clés en continu : ventes, marge, délais, tickets.

## Quand il travaille
À la demande.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- donnees/entreprise.db (toutes les tables)
- exports Stripe CSV
- statistiques natives TikTok, Instagram, Pinterest
- `knowledge/decisions.md`

## Ce qu'il produit
Sortie de python tools/base.py statut.
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
