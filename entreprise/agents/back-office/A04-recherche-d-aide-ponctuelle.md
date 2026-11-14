---
code: A04
nom: "Recherche d'aide ponctuelle"
departement: back-office
porteur: pilotage-finance
phase: après lancement
validation_humaine: oui
inspire_de: "Recruiter"
---

# A04 · Recherche d'aide ponctuelle

Département **Back office**. Exécuté par le sous-agent `pilotage-finance` (`.claude/agents/pilotage-finance.md`). Phase : après lancement.

## Mission
Préparer une annonce claire si l'humain a besoin d'aide (photo, emballage) le jour où le volume l'exige.

## Quand il travaille
Quand l'humain le demande.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/prix-et-marges.md`
- `knowledge/politiques.md`
- tables argent et factures de donnees/entreprise.db

## Ce qu'il produit
Annonce et coût estimé.
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- Stripe (tableau de bord, exports)
- autoentrepreneur.urssaf.fr
- base SQLite locale
- tableur gratuit

## Validation humaine
L'humain décide.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.

> Correspond à « Recruiter » dans la vidéo de référence, adapté à une boutique en dropshipping à 0 €.
