---
code: P17
nom: "Lecteur de clauses"
departement: offres
porteur: conformite-qa
phase: maintenant
validation_humaine: oui
inspire_de: "Unusual contract clause"
---

# P17 · Lecteur de clauses

Département **Offres et partenariats**. Exécuté par le sous-agent `conformite-qa` (`.claude/agents/conformite-qa.md`). Phase : maintenant.

## Mission
Relire chaque contrat ou conditions de partenaire et signaler toute clause inhabituelle (exclusivité, pénalité, cession de droits).

## Quand il travaille
Avant toute signature.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/prix-et-marges.md`
- `knowledge/politiques.md`
- `knowledge/decisions.md`
- table partenariats de donnees/entreprise.db

## Ce qu'il produit
Liste des clauses à risque et question à poser.
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- Google Docs ou Markdown pour les propositions
- Stripe (acompte, créé par l'humain)
- base SQLite locale

## Validation humaine
L'humain décide de signer.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.

> Correspond à « Unusual contract clause » dans la vidéo de référence, adapté à une boutique en dropshipping à 0 €.
