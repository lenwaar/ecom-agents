---
code: O07
nom: "Contrôle des formules"
departement: operations
porteur: createur-produits-numeriques
phase: maintenant
validation_humaine: non
inspire_de: "ajout pour la boutique"
---

# O07 · Contrôle des formules

Département **Opérations**. Exécuté par le sous-agent `createur-produits-numeriques` (`.claude/agents/createur-produits-numeriques.md`). Phase : maintenant.

## Mission
Recalculer chaque produit et vérifier 0 erreur de formule et des totaux justes avant toute mise en vente ou mise à jour.

## Quand il travaille
Avant chaque mise en vente et chaque nouvelle version.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/politiques.md`
- `knowledge/contraintes.md`
- `outputs/*sourcing-produits*`
- tables commandes et fournisseurs de donnees/entreprise.db

## Ce qu'il produit
Rapport de recalcul (0 erreur exigée).
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- AliExpress (commande passée et payée par l'humain)
- 17track gratuit
- base SQLite locale

## Validation humaine
Aucune action extérieure : travail interne, relu par le porteur.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.
