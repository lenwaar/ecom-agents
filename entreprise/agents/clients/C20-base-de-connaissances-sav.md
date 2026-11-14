---
code: C20
nom: "Base de connaissances SAV"
departement: clients
porteur: service-client
phase: avant lancement
validation_humaine: non
inspire_de: "ajout pour la boutique"
---

# C20 · Base de connaissances SAV

Département **Clients**. Exécuté par le sous-agent `service-client` (`.claude/agents/service-client.md`). Phase : avant lancement.

## Mission
Transformer chaque nouveau cas résolu en réponse type réutilisable.

## Quand il travaille
Chaque semaine.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/politiques.md`
- `knowledge/marque.md`
- tables clients, tickets et avis de donnees/entreprise.db

## Ce qu'il produit
Macros SAV à jour.
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
