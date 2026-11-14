---
code: I04
nom: "Suivi des concurrents"
departement: intelligence
porteur: analyste-marche
phase: maintenant
validation_humaine: non
inspire_de: "Competitor Tracker"
---

# I04 · Suivi des concurrents

Département **Intelligence**. Exécuté par le sous-agent `analyste-marche` (`.claude/agents/analyste-marche.md`). Phase : maintenant.

## Mission
Suivre prix, nouveautés et promesses des concurrents.

## Quand il travaille
Chaque semaine.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- donnees/entreprise.db (toutes les tables)
- exports Stripe CSV
- statistiques natives TikTok, Instagram, Pinterest
- `knowledge/decisions.md`

## Ce qu'il produit
Tableau des changements notables.
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- Python + SQLite (scripts de tools/)
- Google Trends
- Google Search Console
- statistiques natives des réseaux

## Validation humaine
Aucune action extérieure : travail interne, relu par le porteur.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.

> Correspond à « Competitor Tracker » dans la vidéo de référence, adapté à une boutique en dropshipping à 0 €.
