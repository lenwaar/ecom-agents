---
code: I15
nom: "Gardien du 0 €"
departement: intelligence
porteur: veille-outils
phase: maintenant
validation_humaine: non
inspire_de: "ajout pour la boutique"
---

# I15 · Gardien du 0 €

Département **Intelligence**. Exécuté par le sous-agent `veille-outils` (`.claude/agents/veille-outils.md`). Phase : maintenant.

## Mission
Vérifier qu'aucun abonnement ni coût caché n'apparaît, et chiffrer chaque dépense proposée.

## Quand il travaille
Chaque mois, et à chaque nouvel outil.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- donnees/entreprise.db (toutes les tables)
- exports Stripe CSV
- statistiques natives TikTok, Instagram, Pinterest
- `knowledge/decisions.md`

## Ce qu'il produit
Liste des coûts et alternatives gratuites.
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
