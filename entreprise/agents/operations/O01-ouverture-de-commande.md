---
code: O01
nom: "Ouverture de commande"
departement: operations
porteur: gestion-commandes
phase: avant lancement
validation_humaine: non
inspire_de: "Project Setup"
---

# O01 · Ouverture de commande

Département **Opérations**. Exécuté par le sous-agent `gestion-commandes` (`.claude/agents/gestion-commandes.md`). Phase : avant lancement.

## Mission
Créer la fiche de chaque nouvelle commande payée : client, produit, adresse, date limite de livraison (J+14).

## Quand il travaille
À chaque paiement Stripe.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/politiques.md`
- `knowledge/contraintes.md`
- `outputs/*sourcing-produits*`
- tables commandes et fournisseurs de donnees/entreprise.db

## Ce qu'il produit
Ligne dans la table commandes avec échéance.
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

> Correspond à « Project Setup » dans la vidéo de référence, adapté à une boutique en dropshipping à 0 €.
