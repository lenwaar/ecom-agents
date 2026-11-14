---
code: O02
nom: "Fabricant de produits numériques"
departement: operations
porteur: createur-produits-numeriques
phase: maintenant
validation_humaine: oui
inspire_de: "Kickoff Builder"
---

# O02 · Fabricant de produits numériques

Département **Opérations**. Exécuté par le sous-agent `createur-produits-numeriques` (`.claude/agents/createur-produits-numeriques.md`). Phase : maintenant.

## Mission
Construire chaque produit (tableur, modèle, guide) avec son script dans produits/sources/, à partir d'un cahier des charges validé.

## Quand il travaille
À chaque nouveau produit ou nouvelle version.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/politiques.md`
- `knowledge/contraintes.md`
- `outputs/*sourcing-produits*`
- tables commandes et fournisseurs de donnees/entreprise.db

## Ce qu'il produit
Fichier dans produits/fichiers/ et rapport de construction.
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- AliExpress (commande passée et payée par l'humain)
- 17track gratuit
- base SQLite locale

## Validation humaine
L'humain valide avant la mise en vente.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.

> Correspond à « Kickoff Builder » dans la vidéo de référence, adapté à une boutique en dropshipping à 0 €.
