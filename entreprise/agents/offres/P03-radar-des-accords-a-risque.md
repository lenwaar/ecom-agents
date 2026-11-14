---
code: P03
nom: "Radar des accords à risque"
departement: offres
porteur: partenariats
phase: maintenant
validation_humaine: non
inspire_de: "Deal Risk Radar"
---

# P03 · Radar des accords à risque

Département **Offres et partenariats**. Exécuté par le sous-agent `partenariats` (`.claude/agents/partenariats.md`). Phase : maintenant.

## Mission
Repérer les accords qui s'enlisent : pas de réponse depuis 7 jours, échantillon non reçu, condition changée.

## Quand il travaille
Chaque matin.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/prix-et-marges.md`
- `knowledge/politiques.md`
- `knowledge/decisions.md`
- table partenariats de donnees/entreprise.db

## Ce qu'il produit
Liste des accords à risque avec action conseillée, envoyée à la page du lundi.
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- Google Docs ou Markdown pour les propositions
- Stripe (acompte, créé par l'humain)
- base SQLite locale

## Validation humaine
Aucune action extérieure : travail interne, relu par le porteur.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.

> Correspond à « Deal Risk Radar » dans la vidéo de référence, adapté à une boutique en dropshipping à 0 €.
