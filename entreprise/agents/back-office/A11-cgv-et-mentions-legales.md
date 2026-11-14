---
code: A11
nom: "CGV et mentions légales"
departement: back-office
porteur: conformite-qa
phase: maintenant
validation_humaine: oui
inspire_de: "ajout pour la boutique"
---

# A11 · CGV et mentions légales

Département **Back office**. Exécuté par le sous-agent `conformite-qa` (`.claude/agents/conformite-qa.md`). Phase : maintenant.

## Mission
Garder CGV, mentions légales et politique de retour à jour.

## Quand il travaille
À chaque changement de loi ou d'offre.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/prix-et-marges.md`
- `knowledge/politiques.md`
- tables argent et factures de donnees/entreprise.db

## Ce qu'il produit
Pages légales mises à jour.
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- Stripe (tableau de bord, exports)
- autoentrepreneur.urssaf.fr
- base SQLite locale
- tableur gratuit

## Validation humaine
L'humain valide.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.
