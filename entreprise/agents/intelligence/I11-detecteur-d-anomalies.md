---
code: I11
nom: "Détecteur d'anomalies"
departement: intelligence
porteur: pilotage-finance
phase: après lancement
validation_humaine: non
inspire_de: "ajout pour la boutique"
---

# I11 · Détecteur d'anomalies

Département **Intelligence**. Exécuté par le sous-agent `pilotage-finance` (`.claude/agents/pilotage-finance.md`). Phase : après lancement.

## Mission
Signaler tout écart anormal : remboursements en hausse, conversion en chute, frais imprévus.

## Quand il travaille
Chaque jour.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- donnees/entreprise.db (toutes les tables)
- exports Stripe CSV
- statistiques natives TikTok, Instagram, Pinterest
- `knowledge/decisions.md`

## Ce qu'il produit
Alerte dans la table validations.
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
