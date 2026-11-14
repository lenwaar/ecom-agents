---
code: V04
nom: "Prise de rendez-vous"
departement: ventes
porteur: ventes
phase: avant lancement
validation_humaine: oui
inspire_de: "Meeting Booker"
---

# V04 · Prise de rendez-vous

Département **Ventes**. Exécuté par le sous-agent `ventes` (`.claude/agents/ventes.md`). Phase : avant lancement.

## Mission
Proposer un créneau d'échange aux professionnels intéressés, dans les heures où l'humain est libre (hors cours).

## Quand il travaille
Quand un prospect professionnel répond positivement.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/marque.md`
- `knowledge/prix-et-marges.md`
- `knowledge/politiques.md`
- table prospects de donnees/entreprise.db

## Ce qu'il produit
Réponse avec lien Cal.com et créneaux compatibles avec l'emploi du temps de l'humain.
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- site Astro + Stripe (liens de paiement)
- Cal.com gratuit
- messageries natives des réseaux
- base SQLite locale

## Validation humaine
L'humain confirme ses disponibilités.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.

> Correspond à « Meeting Booker » dans la vidéo de référence, adapté à une boutique en dropshipping à 0 €.
