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

### T32 · Visuels 3D des produits · `à faire`
Lance `studio-visuel` avec la demande de `tests/scenarios/studio-visuel.md`.
Si c'est trop long en une fois : d'abord l'atelier (`studio/lib/`, matériaux, éclairage, script de rendu) + 2 produits, montre la planche contact dans le compte rendu, puis les 8 autres.
Commit `feat(studio): visuels 3D des produits de démonstration`.

### T33 · Construction du site, étape 1 : fondations · `à faire`
Lance `developpeur-web` :
```
Utilise l'agent developpeur-web : étape 1 du site selon la spécification v2 (2 fichiers dans outputs/). Crée site/ (Astro, Tailwind, polices auto-hébergées, icônes Lucide, GSAP), le thème (couleurs et typographies de knowledge/marque.md), les composants de base façon shadcn/ui (bouton, carte, badge, accordéon, navigation, pied de page), la mise en page commune, et toutes les pages légales et d'aide avec les textes de knowledge/politiques.md ([À VALIDER] là où une valeur manque). Pas encore l'accueil animé. npm run build doit passer.
```
Commit `feat(site): fondations, thème, composants, pages légales`.

### T34 · Construction du site, étape 2 : catalogue et fiches · `à faire`
Lance `developpeur-web` : catalogue, pages de collection, fiche produit (galerie des 6 vues, zoom, bandeau démonstration, achat désactivé si `demo: true`), à partir des fiches de T31 et des images de T32.
Commit `feat(site): catalogue, collections, fiches produits`.

### T35 · Construction du site, étape 3 : accueil cinématique · `à faire`
Lance `developpeur-web` : l'accueil complet de la spécification v2 (11 sections, animations GSAP, versions mobile, sans animation et sans JavaScript), au niveau de `docs/reference/prototype-accueil.html` ou au-dessus.
Commit `feat(site): accueil cinématique`.

### T36 · Compte rendu final · `à faire`
Dans `vers-cowork.md` : ce qui marche, ce qui manque, la commande exacte pour que l'humain voie le site sur son PC (`cd site && npm install && npm run dev`, adresse locale), et les 🔔 ACTION HUMAINE.
Ne lance pas `conformite-qa` sur le site : Cowork le planifiera après sa propre revue.

## Règle permanente
Quand une tâche installe ou modifie un agent dans `.claude/agents/`, ne lance pas cet agent dans la même session : termine la synchro et demande à l'humain de redémarrer Claude Code.
