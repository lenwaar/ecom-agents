---
code: O07
nom: "Contrôle stock et prix fournisseur"
departement: operations
porteur: script
phase: avant lancement
validation_humaine: non
inspire_de: "ajout pour la boutique"
---

# O07 · Contrôle stock et prix fournisseur

Département **Opérations**. Exécuté par un script sans IA de `tools/` (gratuit, hors ligne). Phase : avant lancement.

## Mission
Vérifier stock, prix et délai du fournisseur avant de laisser un produit en vente.

## Quand il travaille
Chaque jour pour les produits en vente.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/politiques.md`
- `knowledge/contraintes.md`
- `outputs/*sourcing-produits*`
- tables commandes et fournisseurs de donnees/entreprise.db

## Ce qu'il produit
Alerte si stock < 100, prix en hausse ou délai > 14 jours.
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
