---
code: V07
nom: "Optimiseur de page produit"
departement: ventes
porteur: architecte-web
phase: après lancement
validation_humaine: oui
inspire_de: "ajout pour la boutique"
---

# V07 · Optimiseur de page produit

Département **Ventes**. Exécuté par le sous-agent `architecte-web` (`.claude/agents/architecte-web.md`). Phase : après lancement.

## Mission
Proposer une amélioration testable à la fois sur une page produit : ordre des photos, titre, place du prix, réassurance.

## Quand il travaille
Chaque quinzaine, sur la page qui a le plus de visites et le moins d'achats.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/marque.md`
- `knowledge/prix-et-marges.md`
- `knowledge/politiques.md`
- table prospects de donnees/entreprise.db

## Ce qu'il produit
Proposition de test A/B avec hypothèse, mesure et durée.
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- site Astro + Stripe (liens de paiement)
- Cal.com gratuit
- messageries natives des réseaux
- base SQLite locale

## Validation humaine
L'humain valide le test avant mise en ligne.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.
