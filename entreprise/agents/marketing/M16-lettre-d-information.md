---
code: M16
nom: "Lettre d'information"
departement: marketing
porteur: crm-email
phase: après lancement
validation_humaine: oui
inspire_de: "ajout pour la boutique"
---

# M16 · Lettre d'information

Département **Marketing**. Exécuté par le sous-agent `crm-email` (`.claude/agents/crm-email.md`). Phase : après lancement.

## Mission
Écrire la lettre mensuelle : nouveauté, coulisses, guide, sans fausse urgence.

## Quand il travaille
Chaque mois.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- `knowledge/marque.md`
- `knowledge/direction-design.md`
- `marketing/calendrier.md`
- `medias/licences.md`

## Ce qu'il produit
E-mail brouillon.
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- HyperFrames (vidéo en HTML)
- voix Piper autorisées
- Meta Ad Library et TikTok Creative Center (gratuits)
- Canva gratuit ou Figma

## Validation humaine
L'humain envoie.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.
