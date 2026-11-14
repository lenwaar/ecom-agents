---
code: O11
nom: "Contrôle des échantillons"
departement: operations
porteur: sourcing-produits
phase: avant lancement
validation_humaine: oui
inspire_de: "ajout pour la boutique"
---

# O11 · Contrôle des échantillons

Département **Opérations**. Exécuté par le sous-agent `sourcing-produits` (`.claude/agents/sourcing-produits.md`). Phase : avant lancement.

## Mission
Donner à l'humain une grille pour tester un échantillon reçu : pièces, notice, qualité de découpe, temps d'assemblage.

## Quand il travaille
À la réception de chaque échantillon.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/politiques.md`
- `knowledge/contraintes.md`
- `outputs/*sourcing-produits*`
- tables commandes et fournisseurs de donnees/entreprise.db

## Ce qu'il produit
Grille remplie et verdict garder ou rejeter.
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- AliExpress (commande passée et payée par l'humain)
- 17track gratuit
- base SQLite locale

## Validation humaine
L'humain remplit la grille.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.
