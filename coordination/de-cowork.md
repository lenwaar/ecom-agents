# Tâches de Claude Cowork pour Claude Code

Statuts : `à faire` · `fait` · `bloqué (raison)`

## Synchro n°1 (T1 à T4) et n°2 (T5 à T10) · `fait` (voir vers-cowork.md)

---

## Synchro n°3 (2026-11-12)

### T11 · Installer sourcing-produits v1.4 · `fait`
Copie `coordination/a-installer/sourcing-produits.md` vers `.claude/agents/sourcing-produits.md` (remplace l'ancien, copie identique), puis supprime `coordination/a-installer/`.
Corrections issues de l'audit conformite-qa : cotisations micro et éco-participation dans la marge, taxes d'import par catégorie d'article, électronique / âge 14+ non prouvé / copie / produit de marque hors canal officiel devenus éliminatoires, délai relevé sur l'annonce, règles sur les photos, la mention « authentique » et les avis.

### T12 · Prendre en compte prix-et-marges.md · `fait`
`knowledge/prix-et-marges.md` a été écrit par Cowork (statut : proposition à valider par l'humain). Ajoute dans `knowledge/README.md` que ce fichier existe et qu'il est « proposé, à valider ».

### T13 · Feuille de route · `fait`
Dans `ROADMAP.md`, phase 1 : ajoute `- [x] sourcing-produits v1.4 (corrections de l'audit conformite-qa)` et `- [ ] Valider knowledge/prix-et-marges.md et knowledge/politiques.md`.

### T14 · Commit et push · `fait`
Commit `fix(agent): sourcing-produits v1.4 + proposition prix-et-marges`, puis push.

### T15 · Ne lance aucun agent · `fait` (aucun agent lancé)
La v3 du sourcing attendra la réponse de Robotime (vérifiée par Cowork le 16/11). Termine la synchro en rappelant à l'humain de redémarrer Claude Code (`/exit` puis `claude`) pour charger la v1.4.

## Règle permanente
Quand une tâche installe ou modifie un agent dans `.claude/agents/`, ne lance pas cet agent dans la même session : termine la synchro et demande à l'humain de redémarrer Claude Code.
