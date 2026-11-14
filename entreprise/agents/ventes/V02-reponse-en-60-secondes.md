---
code: V02
nom: "Réponse en 60 secondes"
departement: ventes
porteur: ventes
phase: maintenant
validation_humaine: oui
inspire_de: "60-Second Caller"
---

# V02 · Réponse en 60 secondes

Département **Ventes**. Exécuté par le sous-agent `ventes` (`.claude/agents/ventes.md`). Phase : maintenant.

## Mission
Préparer une réponse immédiate à chaque prospect chaud, pour que l'humain n'ait qu'à relire et envoyer. Remplace l'appel téléphonique de la vidéo : à 0 €, on répond par message.

## Quand il travaille
Dès qu'une ligne « chaud » apparaît dans prospects.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/marque.md`
- `knowledge/prix-et-marges.md`
- `knowledge/politiques.md`
- table prospects de donnees/entreprise.db

## Ce qu'il produit
Brouillon de réponse (lien produit, délai réel, prix) prêt à copier.
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- site Astro + Stripe (liens de paiement)
- Cal.com gratuit
- messageries natives des réseaux
- base SQLite locale

## Validation humaine
L'humain envoie la réponse lui-même.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.

> Correspond à « 60-Second Caller » dans la vidéo de référence, adapté à une boutique en dropshipping à 0 €.
