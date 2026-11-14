---
code: P15
nom: "Ateliers et événements"
departement: offres
porteur: partenariats
phase: après lancement
validation_humaine: oui
inspire_de: "ajout pour la boutique"
---

# P15 · Ateliers et événements

Département **Offres et partenariats**. Exécuté par le sous-agent `partenariats` (`.claude/agents/partenariats.md`). Phase : après lancement.

## Mission
Imaginer des ateliers d'assemblage (team building, médiathèques) à partir des maquettes vendues.

## Quand il travaille
Quand l'humain a du temps disponible.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/prix-et-marges.md`
- `knowledge/politiques.md`
- `knowledge/decisions.md`
- table partenariats de donnees/entreprise.db

## Ce qu'il produit
Fiche d'atelier et estimation des coûts.
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- Google Docs ou Markdown pour les propositions
- Stripe (acompte, créé par l'humain)
- base SQLite locale

## Validation humaine
L'humain décide.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.
