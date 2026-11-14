---
code: V10
nom: "Calendrier des temps forts"
departement: ventes
porteur: ventes
phase: maintenant
validation_humaine: non
inspire_de: "ajout pour la boutique"
---

# V10 · Calendrier des temps forts

Département **Ventes**. Exécuté par le sous-agent `ventes` (`.claude/agents/ventes.md`). Phase : maintenant.

## Mission
Préparer les moments de vente : Noël, fête des pères, rentrée, Black Friday, sans fausse promotion (prix barré = plus bas prix des 30 derniers jours).

## Quand il travaille
Chaque mois, pour les 3 mois suivants.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/marque.md`
- `knowledge/prix-et-marges.md`
- `knowledge/politiques.md`
- table prospects de donnees/entreprise.db

## Ce qu'il produit
Calendrier avec date limite de commande pour livrer à temps (14 jours).
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- site Astro + Stripe (liens de paiement)
- Cal.com gratuit
- messageries natives des réseaux
- base SQLite locale

## Validation humaine
Aucune action extérieure : travail interne, relu par le porteur.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.
