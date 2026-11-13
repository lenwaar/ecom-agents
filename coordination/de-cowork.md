# Tâches de Claude Cowork pour Claude Code

Statuts : `à faire` · `fait` · `bloqué (raison)`

## Synchro n°1 à n°7 (T1 à T30) · `fait`
Pour info : la règle « Gros livrables » ajoutée dans `CLAUDE.md` vient de Cowork (suite au blocage de l'architecte en T28).

---

## Synchro n°8 (2026-11-12) : fiches, visuels, construction du site

À lancer **après un redémarrage de Claude Code** (les agents `redacteur-catalogue` et `studio-visuel` doivent être chargés).
Lance les agents **l'un après l'autre**, jamais en parallèle. Après chaque tâche : commit + push, et une ligne de compte rendu dans `vers-cowork.md` (pour que Cowork suive en direct). Si un agent se bloque, relance-le en lui demandant d'écrire en plusieurs fois (règle « Gros livrables » de `CLAUDE.md`).

Spécification de référence pour tout le site : `outputs/2026-11-12-architecte-web-conception-boutique-v2.md` + `outputs/2026-11-12-architecte-web-conception-boutique-v2-partie-2.md`.

### T31 · Fiches des 10 produits de démonstration · `fait`
Lance `redacteur-catalogue` avec la demande de `tests/scenarios/redacteur-catalogue.md`.
Commit `feat(catalogue): 10 fiches produits de démonstration`.

### T32 · Visuels 3D des produits · `fait`
Lance `studio-visuel` avec la demande de `tests/scenarios/studio-visuel.md`.
Si c'est trop long en une fois : d'abord l'atelier (`studio/lib/`, matériaux, éclairage, script de rendu) + 2 produits, montre la planche contact dans le compte rendu, puis les 8 autres.
Commit `feat(studio): visuels 3D des produits de démonstration`.

### T33 · Construction du site, étape 1 : fondations · `fait`
Lance `developpeur-web` :
```
Utilise l'agent developpeur-web : étape 1 du site selon la spécification v2 (2 fichiers dans outputs/). Crée site/ (Astro, Tailwind, polices auto-hébergées, icônes Lucide, GSAP), le thème (couleurs et typographies de knowledge/marque.md), les composants de base façon shadcn/ui (bouton, carte, badge, accordéon, navigation, pied de page), la mise en page commune, et toutes les pages légales et d'aide avec les textes de knowledge/politiques.md ([À VALIDER] là où une valeur manque). Pas encore l'accueil animé. npm run build doit passer.
```
Commit `feat(site): fondations, thème, composants, pages légales`.

### T34 · Construction du site, étape 2 : catalogue et fiches · `fait`
Lance `developpeur-web` : catalogue, pages de collection, fiche produit (galerie des 6 vues, zoom, bandeau démonstration, achat désactivé si `demo: true`), à partir des fiches de T31 et des images de T32.
Commit `feat(site): catalogue, collections, fiches produits`.

### T35 · Construction du site, étape 3 : accueil cinématique · `fait`
Lance `developpeur-web` : l'accueil complet de la spécification v2 (11 sections, animations GSAP, versions mobile, sans animation et sans JavaScript), au niveau de `docs/reference/prototype-accueil.html` ou au-dessus.
Commit `feat(site): accueil cinématique`.

### T36 · Compte rendu final · `fait`
Dans `vers-cowork.md` : ce qui marche, ce qui manque, la commande exacte pour que l'humain voie le site sur son PC (`cd site && npm install && npm run dev`, adresse locale), et les 🔔 ACTION HUMAINE.
Ne lance pas `conformite-qa` sur le site : Cowork le planifiera après sa propre revue.

---

## Synchro n°9 (préparée par Cowork, copiée le 2026-11-13 avec les changements demandés par l'humain)

Ordre d'exécution demandé par l'humain : T37, T38, T38b, T39, T41, T40, T42 (T41 avant T40), une ligne dans `vers-cowork.md` après chaque tâche, puis demander à l'humain de redémarrer.

### T37 · Installer createur-contenu · `fait`
Copie `coordination/prochaine-synchro/createur-contenu.md` vers `.claude/agents/createur-contenu.md`, puis supprime **seulement les fichiers déjà utilisés** de `coordination/prochaine-synchro/` (pas tout le dossier). Ne le lance pas (règle permanente).

### T38 · Retouche des rendus 3D · `fait`
Lance `studio-visuel` : sur les vues catalogue (`face`, `trois-quarts`, `dessus`), le sol présente des **taches grises irrégulières** autour du produit (ombre bruitée, visible sur la grue et la voiture). Corrige l'ombre de contact (plus douce, sans bruit, ou fond parfaitement uni avec une seule ombre portée floue), puis régénère toutes les vues concernées. Corrige aussi le petit engrenage en haut à droite de la boîte « Initiation », qui touche à peine les autres.
Corrige aussi : l'image d'ambiance `comparateur-planches` (presque vide, on voit surtout le bureau) et les ombres tachées des vues « dessus » (boîte à musique, planétaire).

### T38b · Contrôle qualité automatique · `fait`
- Les fichiers `tools/verifier_livrables.py`, `docs/retours-experience.md`, `CLAUDE.md` et `docs/templates/agent-template.md` ont été écrits ou mis à jour par Cowork : commite-les.
- `CLAUDE.md` a été remis à l'ancienne version : rajoute ces 2 règles après « Gros livrables » : « Lire docs/retours-experience.md avant de commencer : chaque erreur déjà corrigée y est notée. » et « Avant chaque commit : python tools/verifier_livrables.py doit afficher 0 erreur. »
- Lance `python tools/verifier_livrables.py` et corrige ce qu'il signale (un seul avertissement connu : statut « brouillon » du premier rapport analyste-marche, à laisser tel quel, c'est l'historique).
- Ajoute à la commande `/cowork` (`.claude/commands/cowork.md`), juste avant l'étape de commit : « Lance `python tools/verifier_livrables.py` ; s'il y a des erreurs, corrige-les avant de commiter. »
- Donne l'outil `Edit` à `architecte-web` et `conformite-qa` (ligne `tools:` du frontmatter), comme prévu dans `knowledge/decisions.md`.

### T39 · Audit de conformité du site · `à faire`
Demande d'abord à `developpeur-web` un court rapport `outputs/` sur le site (T33-T35). Puis lance `conformite-qa` en mode audit sur le site construit (`site/`) : pages légales, fiche produit type, accueil, mentions de démonstration, bouton de rétractation, cookies. Lis les fichiers par tranches.

### T40 · Commit, push, compte rendu · `à faire`
Compte rendu dans `vers-cowork.md` avec les 🔔 ACTION HUMAINE. Puis demande à l'humain de redémarrer Claude Code (pour `createur-contenu`).

## Synchro n°10 (préparée le 2026-11-12) : organisation à 100 rôles, 7 nouveaux agents

Référence : `docs/organisation.md` (décision de l'humain : 100 rôles confiés à environ 15 agents et des scripts sans IA).
Changement demandé par l'humain : T41 est exécutée **avant** T40, dans la même session que la synchro n°9.

### T41 · Installer 7 agents · `fait`
Copie dans `.claude/agents/` les fichiers de `coordination/a-installer/` : `studio-video`, `veille-outils`, `gestion-commandes`, `service-client`, `crm-email`, `pilotage-finance`, `media-acquisition`. Leurs scénarios de test sont déjà dans `tests/scenarios/`.
Ajoute dans `docs/architecture.md` une ligne qui renvoie vers `docs/organisation.md`.
Lance `python tools/verifier_livrables.py` (0 erreur attendue).
Commit `feat(agents): organisation à 100 rôles et 7 nouveaux agents`.

### T42 · Compte rendu et redémarrage · `à faire`
Une ligne dans `vers-cowork.md`, puis demande à l'humain de redémarrer Claude Code.
Ne lance aucun de ces agents dans cette session. `gestion-commandes`, `service-client`, `crm-email` et `pilotage-finance` ne seront utilisés qu'avant le lancement ; `media-acquisition` après le lancement.

## Règle permanente
Quand une tâche installe ou modifie un agent dans `.claude/agents/`, ne lance pas cet agent dans la même session : termine la synchro et demande à l'humain de redémarrer Claude Code.
