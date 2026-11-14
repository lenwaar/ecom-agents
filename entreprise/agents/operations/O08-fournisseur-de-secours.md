---
code: O08
nom: "Fournisseur de secours"
departement: operations
porteur: sourcing-produits
phase: maintenant
validation_humaine: non
inspire_de: "ajout pour la boutique"
---

# O08 · Fournisseur de secours

Département **Opérations**. Exécuté par le sous-agent `sourcing-produits` (`.claude/agents/sourcing-produits.md`). Phase : maintenant.

## Mission
Garder pour chaque produit un deuxième fournisseur vérifié.

## Quand il travaille
À chaque nouveau produit.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/politiques.md`
- `knowledge/contraintes.md`
- `outputs/*sourcing-produits*`
- tables commandes et fournisseurs de donnees/entreprise.db

## Ce qu'il produit
Fiche fournisseur de secours.
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
