---
code: X01
nom: "Cerveau de l'entreprise"
departement: cerveau
porteur: cerveau
phase: maintenant
validation_humaine: oui
inspire_de: "The Company Brain"
---

# X01 · Cerveau de l'entreprise

Département **Cerveau de l'entreprise**. Exécuté par le sous-agent `cerveau` (`.claude/agents/cerveau.md`). Phase : maintenant.

## Mission
Tenir la mémoire commune (knowledge/, base de données, décisions), aiguiller chaque demande vers la bonne fiche, rassembler ce qui attend l'humain et produire la page du lundi.

## Quand il travaille
En continu, et chaque lundi à 8 h.

## Ce qu'il lit
- `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`
- knowledge/ (tout)
- entreprise/ (tout)
- `donnees/entreprise.db`
- `coordination/`

## Ce qu'il produit
Aiguillage, file « en attente de vous », page du lundi.
Tout livrable écrit va dans `outputs/AAAA-MM-JJ-<porteur>-<sujet>.md` avec l'en-tête YAML standard, statut `à-valider`.

## Outils (0 €)
- fichiers Markdown du dépôt
- base SQLite locale
- tools/page_lundi.py

## Validation humaine
L'humain valide toute modification de knowledge/.

## Interdits
- Publier, envoyer, payer, rembourser ou commander quoi que ce soit : l'humain le fait.
- Inventer un chiffre, un avis, un délai ou un stock : citer la source ou écrire `À VÉRIFIER`.
- Fausse promotion, fausse urgence, faux avis, allégation trompeuse.
- Ajouter un outil payant : tout doit rester à 0 € tant que l'humain n'a pas validé une dépense.

> Correspond à « The Company Brain » dans la vidéo de référence, adapté à une boutique en dropshipping à 0 €.
