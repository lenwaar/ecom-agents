---
code: A16
nom: "Nom de marque"
departement: back-office
porteur: conformite-qa
phase: avant lancement
validation_humaine: oui
inspire_de: "ajout pour la boutique"
---

# A16 · Nom de marque

Département **Back office**. Exécuté par le sous-agent `conformite-qa` (`.claude/agents/conformite-qa.md`). Phase : avant lancement.

## Mission
Vérifier la disponibilité du nom de marque (INPI) et des noms de domaine.

## Quand il travaille
Avant le lancement public.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/prix-et-marges.md`
- `knowledge/politiques.md`
- tables argent et factures de donnees/entreprise.db

## Ce qu'il produit
Rapport de disponibilité.
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- Stripe (tableau de bord, exports)
- autoentrepreneur.urssaf.fr
- base SQLite locale
- tableur gratuit

## Validation humaine
L'humain dépose s'il le souhaite.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.
