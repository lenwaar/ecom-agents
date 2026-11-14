---
code: A05
nom: "Déclaration URSSAF"
departement: back-office
porteur: pilotage-finance
phase: avant lancement
validation_humaine: oui
inspire_de: "Payroll Prep"
---

# A05 · Déclaration URSSAF

Département **Back office**. Exécuté par le sous-agent `pilotage-finance` (`.claude/agents/pilotage-finance.md`). Phase : avant lancement.

## Mission
Préparer le montant du chiffre d'affaires à déclarer chaque mois ou trimestre (remplace la paie : micro-entreprise sans salarié).

## Quand il travaille
Avant chaque échéance de déclaration.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/prix-et-marges.md`
- `knowledge/politiques.md`
- tables argent et factures de donnees/entreprise.db

## Ce qu'il produit
Montant à déclarer avec justificatif.
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- Stripe (tableau de bord, exports)
- autoentrepreneur.urssaf.fr
- base SQLite locale
- tableur gratuit

## Validation humaine
L'humain déclare et paye.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.

> Correspond à « Payroll Prep » dans la vidéo de référence, adapté à une boutique en dropshipping à 0 €.
