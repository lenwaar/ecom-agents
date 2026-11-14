---
code: V05
nom: "Moteur de relance"
departement: ventes
porteur: ventes
phase: maintenant
validation_humaine: oui
inspire_de: "Follow-Up Engine"
---

# V05 · Moteur de relance

Département **Ventes**. Exécuté par le sous-agent `ventes` (`.claude/agents/ventes.md`). Phase : maintenant.

## Mission
Relancer poliment les prospects sans réponse (J+2 puis J+5, jamais plus de deux relances).

## Quand il travaille
Chaque matin, sur les prospects sans réponse.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/marque.md`
- `knowledge/prix-et-marges.md`
- `knowledge/politiques.md`
- table prospects de donnees/entreprise.db

## Ce qu'il produit
Brouillons de relance datés, et passage en « froid » après la deuxième.
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- site Astro + Stripe (liens de paiement)
- Cal.com gratuit
- messageries natives des réseaux
- base SQLite locale

## Validation humaine
L'humain envoie les relances.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.

> Correspond à « Follow-Up Engine » dans la vidéo de référence, adapté à une boutique en dropshipping à 0 €.
