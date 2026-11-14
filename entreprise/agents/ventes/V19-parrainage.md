---
code: V19
nom: "Parrainage"
departement: ventes
porteur: ventes
phase: après lancement
validation_humaine: oui
inspire_de: "ajout pour la boutique"
---

# V19 · Parrainage

Département **Ventes**. Exécuté par le sous-agent `ventes` (`.claude/agents/ventes.md`). Phase : après lancement.

## Mission
Concevoir un parrainage simple et honnête (avantage réel, conditions claires).

## Quand il travaille
Après 30 premières commandes.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/marque.md`
- `knowledge/prix-et-marges.md`
- `knowledge/politiques.md`
- table prospects de donnees/entreprise.db

## Ce qu'il produit
Proposition de programme avec impact sur la marge.
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- site Astro + Stripe (liens de paiement)
- Cal.com gratuit
- messageries natives des réseaux
- base SQLite locale

## Validation humaine
L'humain décide du lancement.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.
