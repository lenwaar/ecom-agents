# Tâches de Claude Cowork pour Claude Code

Statuts : `à faire` · `fait` · `bloqué (raison)`

## Synchro n°1 à n°6 (T1 à T25) · `fait`
Réponse à ta question de la synchro n°6 : oui, `knowledge/direction-design.md` et la ligne Style de `docs/site-technique.md` viennent de Cowork. Ils ont depuis été remplacés par une **v2** (voir T27).

---

## Synchro n°7 (2026-11-12) : identité validée, enrichissement, catalogue de démonstration

Décisions de l'humain : **piste C « Laiton » en version cinématique** (prototype `docs/reference/prototype-accueil.html`), **10 produits de démonstration** avec plusieurs vues, **plusieurs sections animées**, une boutique « vraiment attractive ».

### T26 · Installer deux agents · `fait`
- `coordination/a-installer/redacteur-catalogue.md` → `.claude/agents/redacteur-catalogue.md`
- `coordination/a-installer/studio-visuel.md` → `.claude/agents/studio-visuel.md`
- Copies identiques, puis supprime `coordination/a-installer/`.

### T27 · Fichiers écrits par Cowork, à commiter tels quels · `fait`
- `knowledge/marque.md` (nouveau : piste C, couleurs, typographies, ton, nom de travail provisoire)
- `knowledge/catalogue-demo.md` (nouveau : 10 produits de démonstration et leurs règles)
- `knowledge/direction-design.md` (v2 : registres cinématique et boutique claire, mouvement, GSAP)
- `docs/site-technique.md` (animations GSAP, visuels 3D Three.js, champs `demo`, `collections`, `modele_3d`)
- `docs/reference/prototype-accueil.html` (prototype de référence)
- `tests/scenarios/redacteur-catalogue.md` et `tests/scenarios/studio-visuel.md` (nouveaux)

### T28 · Lancer architecte-web : version 2 de la conception · `fait`
`architecte-web` est déjà chargé : tu peux le lancer dans cette session. Demande exacte :
```
Utilise l'agent architecte-web : produis la v2 de la conception de la boutique, dans un nouveau fichier outputs/AAAA-MM-JJ-architecte-web-conception-boutique-v2.md.
1. Identité : piste C retenue (knowledge/marque.md), en version cinématique selon knowledge/direction-design.md v2 ; supprime les pistes A et B.
2. Accueil au niveau du prototype docs/reference/prototype-accueil.html ou au-dessus, avec ces sections animées (à spécifier en détail : contenu, animation, déclencheur, durée, version mobile, version sans animation) :
   - héros engrenages (repris du prototype) ;
   - récit épinglé « Ouvrir, Assembler, Tourner » ;
   - « De la planche à l'objet » : comparateur avant / après glissant (planches à plat → maquette montée) ;
   - « Dans la boîte » : vue éclatée qui se rassemble au défilement ;
   - collections (Mécanique, Véhicules, Miniatures, Pour débuter) en grandes cartes avec visuel qui s'anime au survol ;
   - « Trouver ma maquette » : mini-questionnaire en 3 questions (pour qui, niveau, temps disponible) qui recommande des produits, sans compte ni cookie ;
   - échelle de difficulté expliquée visuellement ;
   - section « Offrir » (idée cadeau, message cadeau si possible) ;
   - « L'atelier » : conseils d'assemblage, inscription à une lettre d'information avec consentement ;
   - aperçu FAQ et réassurance.
3. Fiche produit : galerie des 6 vues (knowledge/catalogue-demo.md) avec zoom, vue 3D tournante en option, bandeau « Produit de démonstration » si demo: true, tout le reste de la v1.
4. Pages de collection animées dans le registre cinématique.
5. Intègre toutes les corrections de l'audit outputs/2026-11-12-conformite-qa-audit-conception-boutique.md (en priorité les 5 prioritaires).
6. Propositions pour augmenter le panier moyen sans tromper (lots, seuil de livraison offerte compatible avec knowledge/prix-et-marges.md).
```

### T29 · Audit de la v2 · `fait`
Lance `conformite-qa` en mode audit sur la v2 produite en T28.

### T30 · Commit, push, compte rendu · `fait`
- Commit `feat: agents redacteur-catalogue et studio-visuel, conception v2, identité Laiton`, puis push.
- Compte rendu dans `vers-cowork.md` (résumé de la v2, liste des sections animées, verdict de l'audit, 🔔 ACTION HUMAINE).
- Ne lance pas `redacteur-catalogue` ni `studio-visuel` (installés pendant cette session) : demande à l'humain de redémarrer Claude Code. La synchro n°8 lancera fiches, visuels et construction du site.

## Règle permanente
Quand une tâche installe ou modifie un agent dans `.claude/agents/`, ne lance pas cet agent dans la même session : termine la synchro et demande à l'humain de redémarrer Claude Code.
