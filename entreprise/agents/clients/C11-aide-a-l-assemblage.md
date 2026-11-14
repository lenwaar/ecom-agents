---
code: C11
nom: "Aide à l'assemblage"
departement: clients
porteur: service-client
phase: avant lancement
validation_humaine: non
inspire_de: "ajout pour la boutique"
---

# C11 · Aide à l'assemblage

Département **Clients**. Exécuté par le sous-agent `service-client` (`.claude/agents/service-client.md`). Phase : avant lancement.

## Mission
Aider le client bloqué à une étape, avec guides et vidéos d'étapes.

## Quand il travaille
À chaque demande d'aide.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/politiques.md`
- `knowledge/marque.md`
- tables clients, tickets et avis de donnees/entreprise.db

## Ce qu'il produit
Réponse avec étape précise et lien d'aide.
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- boîte mail de la boutique
- messageries natives des réseaux
- Brevo gratuit (300 e-mails par jour)
- base SQLite locale

## Validation humaine
Aucune action extérieure : travail interne, relu par le porteur.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.
