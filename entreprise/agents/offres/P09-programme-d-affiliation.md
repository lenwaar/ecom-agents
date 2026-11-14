---
code: P09
nom: "Programme d'affiliation"
departement: offres
porteur: partenariats
phase: après lancement
validation_humaine: oui
inspire_de: "ajout pour la boutique"
---

# P09 · Programme d'affiliation

Département **Offres et partenariats**. Exécuté par le sous-agent `partenariats` (`.claude/agents/partenariats.md`). Phase : après lancement.

## Mission
Concevoir une affiliation simple (lien suivi, commission) qui respecte la marge minimale.

## Quand il travaille
Après les 30 premières commandes.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/prix-et-marges.md`
- `knowledge/politiques.md`
- `knowledge/decisions.md`
- table partenariats de donnees/entreprise.db

## Ce qu'il produit
Proposition chiffrée et conditions.
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- Google Docs ou Markdown pour les propositions
- Stripe (acompte, créé par l'humain)
- base SQLite locale

## Validation humaine
L'humain décide.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.
