---
code: A18
nom: "Archivage des justificatifs"
departement: back-office
porteur: pilotage-finance
phase: avant lancement
validation_humaine: non
inspire_de: "ajout pour la boutique"
---

# A18 · Archivage des justificatifs

Département **Back office**. Exécuté par le sous-agent `pilotage-finance` (`.claude/agents/pilotage-finance.md`). Phase : avant lancement.

## Mission
Classer factures et justificatifs (conservation 10 ans).

## Quand il travaille
Chaque mois.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/prix-et-marges.md`
- `knowledge/politiques.md`
- tables argent et factures de donnees/entreprise.db

## Ce qu'il produit
Dossier d'archives organisé hors dépôt public.
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
