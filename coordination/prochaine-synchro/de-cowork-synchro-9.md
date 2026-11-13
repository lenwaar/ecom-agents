# Synchro n°9 (préparée par Cowork, à copier dans de-cowork.md une fois la synchro n°8 terminée)

### T37 · Installer createur-contenu · `à faire`
Copie `coordination/prochaine-synchro/createur-contenu.md` vers `.claude/agents/createur-contenu.md`, puis supprime `coordination/prochaine-synchro/`. Ne le lance pas (règle permanente).

### T38 · Retouche des rendus 3D · `à faire`
Lance `studio-visuel` : sur les vues catalogue (`face`, `trois-quarts`, `dessus`), le sol présente des **taches grises irrégulières** autour du produit (ombre bruitée, visible sur la grue et la voiture). Corrige l'ombre de contact (plus douce, sans bruit, ou fond parfaitement uni avec une seule ombre portée floue), puis régénère toutes les vues concernées. Corrige aussi le petit engrenage en haut à droite de la boîte « Initiation », qui touche à peine les autres.

### T38b · Contrôle qualité automatique · `à faire`
- Les fichiers `tools/verifier_livrables.py`, `docs/retours-experience.md`, `CLAUDE.md` et `docs/templates/agent-template.md` ont été écrits ou mis à jour par Cowork : commite-les.
- Lance `python tools/verifier_livrables.py` et corrige ce qu'il signale (un seul avertissement connu : statut « brouillon » du premier rapport analyste-marche, à laisser tel quel, c'est l'historique).
- Ajoute à la commande `/cowork` (`.claude/commands/cowork.md`), juste avant l'étape de commit : « Lance `python tools/verifier_livrables.py` ; s'il y a des erreurs, corrige-les avant de commiter. »
- Donne l'outil `Edit` à `architecte-web` et `conformite-qa` (ligne `tools:` du frontmatter), comme prévu dans `knowledge/decisions.md`.

### T39 · Audit de conformité du site · `à faire`
Lance `conformite-qa` en mode audit sur le site construit (`site/`) : pages légales, fiche produit type, accueil, mentions de démonstration, bouton de rétractation, cookies. Lis les fichiers par tranches.

### T40 · Commit, push, compte rendu · `à faire`
Compte rendu dans `vers-cowork.md` avec les 🔔 ACTION HUMAINE. Puis demande à l'humain de redémarrer Claude Code (pour `createur-contenu`).
