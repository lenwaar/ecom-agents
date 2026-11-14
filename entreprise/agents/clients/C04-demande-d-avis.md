---
code: C04
nom: "Demande d'avis"
departement: clients
porteur: crm-email
phase: après lancement
validation_humaine: oui
inspire_de: "Review Asker"
---

# C04 · Demande d'avis

Département **Clients**. Exécuté par le sous-agent `crm-email` (`.claude/agents/crm-email.md`). Phase : après lancement.

## Mission
Demander un avis honnête après livraison, sans contrepartie et sans filtrer les avis négatifs.

## Quand il travaille
7 jours après la livraison.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/politiques.md`
- `knowledge/marque.md`
- tables clients, tickets et avis de donnees/entreprise.db

## Ce qu'il produit
E-mail brouillon de demande d'avis.
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- boîte mail de la boutique
- messageries natives des réseaux
- Brevo gratuit (300 e-mails par jour)
- base SQLite locale

## Validation humaine
L'humain active l'envoi.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.

> Correspond à « Review Asker » dans la vidéo de référence, adapté à une boutique en dropshipping à 0 €.
