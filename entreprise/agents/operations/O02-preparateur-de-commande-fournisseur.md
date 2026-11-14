---
code: O02
nom: "Préparateur de commande fournisseur"
departement: operations
porteur: gestion-commandes
phase: avant lancement
validation_humaine: oui
inspire_de: "Kickoff Builder"
---

# O02 · Préparateur de commande fournisseur

Département **Opérations**. Exécuté par le sous-agent `gestion-commandes` (`.claude/agents/gestion-commandes.md`). Phase : avant lancement.

## Mission
Préparer la commande chez le fournisseur : produit exact, variante, adresse du client, option de livraison rapide.

## Quand il travaille
Dans les 24 h après le paiement.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/politiques.md`
- `knowledge/contraintes.md`
- `outputs/*sourcing-produits*`
- tables commandes et fournisseurs de donnees/entreprise.db

## Ce qu'il produit
Récapitulatif prêt à saisir sur AliExpress.
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- AliExpress (commande passée et payée par l'humain)
- 17track gratuit
- base SQLite locale

## Validation humaine
L'humain passe et paye la commande.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.

> Correspond à « Kickoff Builder » dans la vidéo de référence, adapté à une boutique en dropshipping à 0 €.
