---
code: P11
nom: "Revendeurs officiels"
departement: offres
porteur: sourcing-produits
phase: avant lancement
validation_humaine: oui
inspire_de: "ajout pour la boutique"
---

# P11 · Revendeurs officiels

Département **Offres et partenariats**. Exécuté par le sous-agent `sourcing-produits` (`.claude/agents/sourcing-produits.md`). Phase : avant lancement.

## Mission
Ouvrir les comptes revendeurs des marques authentiques (canal officiel uniquement, aucune copie).

## Quand il travaille
Quand une marque est retenue par sourcing-produits.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/prix-et-marges.md`
- `knowledge/politiques.md`
- `knowledge/decisions.md`
- table partenariats de donnees/entreprise.db

## Ce qu'il produit
Dossier de demande de compte revendeur.
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- Google Docs ou Markdown pour les propositions
- Stripe (acompte, créé par l'humain)
- base SQLite locale

## Validation humaine
L'humain dépose la demande.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.
