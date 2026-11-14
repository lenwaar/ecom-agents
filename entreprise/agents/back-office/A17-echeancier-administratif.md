---
code: A17
nom: "Échéancier administratif"
departement: back-office
porteur: pilotage-finance
phase: avant lancement
validation_humaine: non
inspire_de: "ajout pour la boutique"
---

# A17 · Échéancier administratif

Département **Back office**. Exécuté par le sous-agent `pilotage-finance` (`.claude/agents/pilotage-finance.md`). Phase : avant lancement.

## Mission
Tenir les dates à ne pas rater : déclarations, cotisations, renouvellements.

## Quand il travaille
Chaque mois.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/prix-et-marges.md`
- `knowledge/politiques.md`
- tables argent et factures de donnees/entreprise.db

## Ce qu'il produit
Échéancier des 3 mois suivants.
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- Stripe (tableau de bord, exports)
- autoentrepreneur.urssaf.fr
- base SQLite locale
- tableur gratuit

## Validation humaine
Aucune action extérieure : travail interne, relu par le porteur.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.
