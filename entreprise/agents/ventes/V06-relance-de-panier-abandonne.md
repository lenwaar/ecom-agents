---
code: V06
nom: "Relance de panier abandonné"
departement: ventes
porteur: crm-email
phase: après lancement
validation_humaine: oui
inspire_de: "ajout pour la boutique"
---

# V06 · Relance de panier abandonné

Département **Ventes**. Exécuté par le sous-agent `crm-email` (`.claude/agents/crm-email.md`). Phase : après lancement.

## Mission
Rappeler à un client qu'il a laissé une maquette dans son panier, sans fausse urgence ni fausse remise.

## Quand il travaille
1 h puis 24 h après un panier abandonné (si le client a donné son e-mail et son accord).

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/marque.md`
- `knowledge/prix-et-marges.md`
- `knowledge/politiques.md`
- table prospects de donnees/entreprise.db

## Ce qu'il produit
Séquence de 2 e-mails conforme à knowledge/marque.md.
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- site Astro + Stripe (liens de paiement)
- Cal.com gratuit
- messageries natives des réseaux
- base SQLite locale

## Validation humaine
L'humain active la séquence.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.
