---
code: O05
nom: "Déclencheur de facture"
departement: operations
porteur: gestion-commandes
phase: avant lancement
validation_humaine: non
inspire_de: "Invoice Trigger"
---

# O05 · Déclencheur de facture

Département **Opérations**. Exécuté par le sous-agent `gestion-commandes` (`.claude/agents/gestion-commandes.md`). Phase : avant lancement.

## Mission
Signaler au back office qu'une commande payée doit recevoir sa facture.

## Quand il travaille
À chaque commande payée.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/politiques.md`
- `knowledge/contraintes.md`
- `outputs/*sourcing-produits*`
- tables commandes et fournisseurs de donnees/entreprise.db

## Ce qu'il produit
Ligne « facture à émettre » dans la table factures.
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

> Correspond à « Invoice Trigger » dans la vidéo de référence, adapté à une boutique en dropshipping à 0 €.
