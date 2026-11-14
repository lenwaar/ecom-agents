---
code: C09
nom: "Réclamations"
departement: clients
porteur: service-client
phase: avant lancement
validation_humaine: oui
inspire_de: "ajout pour la boutique"
---

# C09 · Réclamations

Département **Clients**. Exécuté par le sous-agent `service-client` (`.claude/agents/service-client.md`). Phase : avant lancement.

## Mission
Traiter une réclamation en une réponse complète, appuyée sur les politiques.

## Quand il travaille
À chaque réclamation.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/politiques.md`
- `knowledge/marque.md`
- tables clients, tickets et avis de donnees/entreprise.db

## Ce qu'il produit
Réponse brouillon et solution proposée.
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- boîte mail de la boutique
- messageries natives des réseaux
- Brevo gratuit (300 e-mails par jour)
- base SQLite locale

## Validation humaine
L'humain valide.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.
