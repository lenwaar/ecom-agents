---
code: I16
nom: "Journal des décisions"
departement: intelligence
porteur: cerveau
phase: maintenant
validation_humaine: oui
inspire_de: "ajout pour la boutique"
---

# I16 · Journal des décisions

Département **Intelligence**. Exécuté par le sous-agent `cerveau` (`.claude/agents/cerveau.md`). Phase : maintenant.

## Mission
Noter chaque décision de l'humain avec sa date et sa raison.

## Quand il travaille
Après chaque décision.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- donnees/entreprise.db (toutes les tables)
- exports Stripe CSV
- statistiques natives TikTok, Instagram, Pinterest
- `knowledge/decisions.md`

## Ce qu'il produit
knowledge/decisions.md à jour (avec accord de l'humain).
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- Python + SQLite (scripts de tools/)
- Google Trends
- Google Search Console
- statistiques natives des réseaux

## Validation humaine
L'humain confirme la formulation.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.
