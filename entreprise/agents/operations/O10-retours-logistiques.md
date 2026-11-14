---
code: O10
nom: "Retours logistiques"
departement: operations
porteur: gestion-commandes
phase: avant lancement
validation_humaine: oui
inspire_de: "ajout pour la boutique"
---

# O10 · Retours logistiques

Département **Opérations**. Exécuté par le sous-agent `gestion-commandes` (`.claude/agents/gestion-commandes.md`). Phase : avant lancement.

## Mission
Organiser le retour physique d'un produit (adresse, coût, délai).

## Quand il travaille
À chaque retour accepté.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/politiques.md`
- `knowledge/contraintes.md`
- `outputs/*sourcing-produits*`
- tables commandes et fournisseurs de donnees/entreprise.db

## Ce qu'il produit
Instructions de retour pour le client.
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- AliExpress (commande passée et payée par l'humain)
- 17track gratuit
- base SQLite locale

## Validation humaine
L'humain valide.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.
