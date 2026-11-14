---
code: P18
nom: "Historique des accords"
departement: offres
porteur: partenariats
phase: maintenant
validation_humaine: non
inspire_de: "ajout pour la boutique"
---

# P18 · Historique des accords

Département **Offres et partenariats**. Exécuté par le sous-agent `partenariats` (`.claude/agents/partenariats.md`). Phase : maintenant.

## Mission
Tenir l'historique de chaque accord : qui, quoi, quand, conditions obtenues.

## Quand il travaille
À chaque changement d'un accord.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/prix-et-marges.md`
- `knowledge/politiques.md`
- `knowledge/decisions.md`
- table partenariats de donnees/entreprise.db

## Ce qu'il produit
Table partenariats à jour.
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- Google Docs ou Markdown pour les propositions
- Stripe (acompte, créé par l'humain)
- base SQLite locale

## Validation humaine
Aucune action extérieure : travail interne, relu par le porteur.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.
