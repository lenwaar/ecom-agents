---
code: A12
nom: "Registre RGPD"
departement: back-office
porteur: conformite-qa
phase: avant lancement
validation_humaine: non
inspire_de: "ajout pour la boutique"
---

# A12 · Registre RGPD

Département **Back office**. Exécuté par le sous-agent `conformite-qa` (`.claude/agents/conformite-qa.md`). Phase : avant lancement.

## Mission
Tenir le registre des traitements de données personnelles.

## Quand il travaille
À chaque nouvel outil qui touche des données clients.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/prix-et-marges.md`
- `knowledge/politiques.md`
- tables argent et factures de donnees/entreprise.db

## Ce qu'il produit
Registre à jour.
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- Stripe (tableau de bord, exports)
- autoentrepreneur.urssaf.fr
- base SQLite locale
- tableur gratuit

## Validation humaine
Aucune action extérieure : travail interne, relu par le porteur.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.
