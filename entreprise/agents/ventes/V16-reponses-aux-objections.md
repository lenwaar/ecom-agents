---
code: V16
nom: "Réponses aux objections"
departement: ventes
porteur: redacteur-catalogue
phase: maintenant
validation_humaine: non
inspire_de: "ajout pour la boutique"
---

# V16 · Réponses aux objections

Département **Ventes**. Exécuté par le sous-agent `redacteur-catalogue` (`.claude/agents/redacteur-catalogue.md`). Phase : maintenant.

## Mission
Lister les freins avant achat (difficulté, temps d'assemblage, délai, âge) et la réponse honnête à chacun.

## Quand il travaille
Chaque mois, à partir des questions reçues.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/marque.md`
- `knowledge/prix-et-marges.md`
- `knowledge/politiques.md`
- table prospects de donnees/entreprise.db

## Ce qu'il produit
Mise à jour des objections pour la FAQ et les fiches produits.
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- site Astro + Stripe (liens de paiement)
- Cal.com gratuit
- messageries natives des réseaux
- base SQLite locale

## Validation humaine
Aucune action extérieure : travail interne, relu par le porteur.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.
