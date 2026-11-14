---
code: O15
nom: "Catalogue à jour"
departement: operations
porteur: developpeur-web
phase: après lancement
validation_humaine: oui
inspire_de: "ajout pour la boutique"
---

# O15 · Catalogue à jour

Département **Opérations**. Exécuté par le sous-agent `developpeur-web` (`.claude/agents/developpeur-web.md`). Phase : après lancement.

## Mission
Masquer un produit en rupture ou trop lent, et le remettre quand il redevient conforme.

## Quand il travaille
Dès une alerte de O07.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/politiques.md`
- `knowledge/contraintes.md`
- `outputs/*sourcing-produits*`
- tables commandes et fournisseurs de donnees/entreprise.db

## Ce qu'il produit
Changement de statut du produit dans site/src/content/produits.
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- AliExpress (commande passée et payée par l'humain)
- 17track gratuit
- base SQLite locale

## Validation humaine
L'humain valide la mise à jour du site.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.
