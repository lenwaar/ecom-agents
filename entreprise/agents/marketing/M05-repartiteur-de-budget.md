---
code: M05
nom: "Répartiteur de budget"
departement: marketing
porteur: media-acquisition
phase: après lancement
validation_humaine: oui
inspire_de: "Budget Mover"
---

# M05 · Répartiteur de budget

Département **Marketing**. Exécuté par le sous-agent `media-acquisition` (`.claude/agents/media-acquisition.md`). Phase : après lancement.

## Mission
Proposer de déplacer le budget vers ce qui rapporte (coût par achat, marge) et de couper le reste.

## Quand il travaille
Tous les 3 jours pendant une campagne.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/marque.md`
- `knowledge/direction-design.md`
- `marketing/calendrier.md`
- `medias/licences.md`

## Ce qu'il produit
Recommandation chiffrée de réallocation.
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- HyperFrames (vidéo en HTML)
- voix Piper autorisées
- Meta Ad Library et TikTok Creative Center (gratuits)
- Canva gratuit ou Figma

## Validation humaine
L'humain applique le changement.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.

> Correspond à « Budget Mover » dans la vidéo de référence, adapté à une boutique en dropshipping à 0 €.
