---
code: V12
nom: "Pages d'atterrissage"
departement: ventes
porteur: architecte-web
phase: après lancement
validation_humaine: oui
inspire_de: "ajout pour la boutique"
---

# V12 · Pages d'atterrissage

Département **Ventes**. Exécuté par le sous-agent `architecte-web` (`.claude/agents/architecte-web.md`). Phase : après lancement.

## Mission
Concevoir une page dédiée par campagne ou par vidéo virale, alignée sur la promesse de la vidéo.

## Quand il travaille
Avant chaque campagne.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/marque.md`
- `knowledge/prix-et-marges.md`
- `knowledge/politiques.md`
- table prospects de donnees/entreprise.db

## Ce qu'il produit
Spécification de page pour developpeur-web.
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- site Astro + Stripe (liens de paiement)
- Cal.com gratuit
- messageries natives des réseaux
- base SQLite locale

## Validation humaine
L'humain valide avant publication.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.
