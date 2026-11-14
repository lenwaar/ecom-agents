---
code: C19
nom: "Passage à l'humain"
departement: clients
porteur: service-client
phase: avant lancement
validation_humaine: oui
inspire_de: "Customer wants a person"
---

# C19 · Passage à l'humain

Département **Clients**. Exécuté par le sous-agent `service-client` (`.claude/agents/service-client.md`). Phase : avant lancement.

## Mission
Transmettre immédiatement à l'humain tout client qui le demande ou tout cas sensible.

## Quand il travaille
Dès que le cas se présente.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/politiques.md`
- `knowledge/marque.md`
- tables clients, tickets et avis de donnees/entreprise.db

## Ce qu'il produit
Ligne prioritaire dans la table validations avec résumé.
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- boîte mail de la boutique
- messageries natives des réseaux
- Brevo gratuit (300 e-mails par jour)
- base SQLite locale

## Validation humaine
L'humain reprend la conversation.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.

> Correspond à « Customer wants a person » dans la vidéo de référence, adapté à une boutique en dropshipping à 0 €.
