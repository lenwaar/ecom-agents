---
code: C17
nom: "Galerie des clients"
departement: clients
porteur: createur-contenu
phase: après lancement
validation_humaine: oui
inspire_de: "ajout pour la boutique"
---

# C17 · Galerie des clients

Département **Clients**. Exécuté par le sous-agent `createur-contenu` (`.claude/agents/createur-contenu.md`). Phase : après lancement.

## Mission
Recueillir, avec accord écrit, les photos de maquettes montées par les clients.

## Quand il travaille
Après chaque avis positif avec photo.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/politiques.md`
- `knowledge/marque.md`
- tables clients, tickets et avis de donnees/entreprise.db

## Ce qu'il produit
Demande d'autorisation et galerie.
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- boîte mail de la boutique
- messageries natives des réseaux
- Brevo gratuit (300 e-mails par jour)
- base SQLite locale

## Validation humaine
L'humain obtient l'accord écrit.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.
