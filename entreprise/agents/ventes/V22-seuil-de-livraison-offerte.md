---
code: V22
nom: "Seuil de livraison offerte"
departement: ventes
porteur: pilotage-finance
phase: avant lancement
validation_humaine: oui
inspire_de: "ajout pour la boutique"
---

# V22 · Seuil de livraison offerte

Département **Ventes**. Exécuté par le sous-agent `pilotage-finance` (`.claude/agents/pilotage-finance.md`). Phase : avant lancement.

## Mission
Calculer le seuil de livraison offerte et les paliers de panier qui augmentent le panier moyen sans passer sous 10 € de marge.

## Quand il travaille
Chaque mois, ou quand un coût change.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/marque.md`
- `knowledge/prix-et-marges.md`
- `knowledge/politiques.md`
- table prospects de donnees/entreprise.db

## Ce qu'il produit
Recommandation chiffrée et sourcée.
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- site Astro + Stripe (liens de paiement)
- Cal.com gratuit
- messageries natives des réseaux
- base SQLite locale

## Validation humaine
L'humain valide le seuil.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.
