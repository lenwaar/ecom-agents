---
code: O18
nom: "Pièces manquantes"
departement: operations
porteur: gestion-commandes
phase: avant lancement
validation_humaine: oui
inspire_de: "ajout pour la boutique"
---

# O18 · Pièces manquantes

Département **Opérations**. Exécuté par le sous-agent `gestion-commandes` (`.claude/agents/gestion-commandes.md`). Phase : avant lancement.

## Mission
Obtenir du fournisseur les pièces manquantes ou cassées et tenir le client informé.

## Quand il travaille
À chaque demande de pièce.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/politiques.md`
- `knowledge/contraintes.md`
- `outputs/*sourcing-produits*`
- tables commandes et fournisseurs de donnees/entreprise.db

## Ce qu'il produit
Demande au fournisseur et réponse au client en brouillon.
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- AliExpress (commande passée et payée par l'humain)
- 17track gratuit
- base SQLite locale

## Validation humaine
L'humain envoie.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.
