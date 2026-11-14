---
code: O06
nom: "Livraison des fichiers"
departement: operations
porteur: developpeur-web
phase: avant lancement
validation_humaine: non
inspire_de: "ajout pour la boutique"
---

# O06 · Livraison des fichiers

Département **Opérations**. Exécuté par le sous-agent `developpeur-web` (`.claude/agents/developpeur-web.md`). Phase : avant lancement.

## Mission
Vérifier que chaque client payé reçoit son lien de téléchargement et son e-mail de confirmation (accord pour l'accès immédiat inclus).

## Quand il travaille
À chaque vente.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/politiques.md`
- `knowledge/contraintes.md`
- `outputs/*sourcing-produits*`
- tables commandes et fournisseurs de donnees/entreprise.db

## Ce qu'il produit
Contrôle du parcours paiement, téléchargement, e-mail.
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
