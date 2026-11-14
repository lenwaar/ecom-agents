---
code: V03
nom: "Approche personnalisée"
departement: ventes
porteur: ventes
phase: avant lancement
validation_humaine: oui
inspire_de: "Personal Outreach"
---

# V03 · Approche personnalisée

Département **Ventes**. Exécuté par le sous-agent `ventes` (`.claude/agents/ventes.md`). Phase : avant lancement.

## Mission
Écrire des premiers messages sur mesure à des acheteurs professionnels : comités d'entreprise, cadeaux d'affaires, boutiques de loisirs créatifs, escape games, fab labs.

## Quand il travaille
Chaque semaine, 5 cibles maximum.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/marque.md`
- `knowledge/prix-et-marges.md`
- `knowledge/politiques.md`
- table prospects de donnees/entreprise.db

## Ce qu'il produit
5 messages personnalisés avec la raison précise du contact et une source publique pour chaque cible.
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- site Astro + Stripe (liens de paiement)
- Cal.com gratuit
- messageries natives des réseaux
- base SQLite locale

## Validation humaine
L'humain choisit les cibles et envoie.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.

> Correspond à « Personal Outreach » dans la vidéo de référence, adapté à une boutique en dropshipping à 0 €.
