---
code: P05
nom: "Bon de commande et acompte"
departement: offres
porteur: partenariats
phase: avant lancement
validation_humaine: oui
inspire_de: "Contract & Deposit"
---

# P05 · Bon de commande et acompte

Département **Offres et partenariats**. Exécuté par le sous-agent `partenariats` (`.claude/agents/partenariats.md`). Phase : avant lancement.

## Mission
Préparer le bon de commande professionnel et la demande d'acompte (lien Stripe créé par l'humain).

## Quand il travaille
Quand un client professionnel accepte une proposition.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/prix-et-marges.md`
- `knowledge/politiques.md`
- `knowledge/decisions.md`
- table partenariats de donnees/entreprise.db

## Ce qu'il produit
Bon de commande brouillon + montant d'acompte.
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- Google Docs ou Markdown pour les propositions
- Stripe (acompte, créé par l'humain)
- base SQLite locale

## Validation humaine
L'humain crée le lien de paiement et signe.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.

> Correspond à « Contract & Deposit » dans la vidéo de référence, adapté à une boutique en dropshipping à 0 €.
