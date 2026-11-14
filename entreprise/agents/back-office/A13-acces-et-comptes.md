---
code: A13
nom: "Accès et comptes"
departement: back-office
porteur: humain
phase: maintenant
validation_humaine: oui
inspire_de: "ajout pour la boutique"
---

# A13 · Accès et comptes

Département **Back office**. Exécuté par l'humain (les agents ne font que rappeler). Phase : maintenant.

## Mission
Rappeler à l'humain de sécuriser ses comptes (double authentification) ; aucun mot de passe n'est stocké dans le dépôt.

## Quand il travaille
Chaque trimestre.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/prix-et-marges.md`
- `knowledge/politiques.md`
- tables argent et factures de donnees/entreprise.db

## Ce qu'il produit
Liste de contrôle des accès.
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- Stripe (tableau de bord, exports)
- autoentrepreneur.urssaf.fr
- base SQLite locale
- tableur gratuit

## Validation humaine
L'humain gère ses accès.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.
