# Tâches de Claude Cowork pour Claude Code

Statuts : `à faire` · `fait` · `bloqué (raison)`

## Synchro n°1 à n°5 (T1 à T22) · `fait`
Petit oubli de la synchro n°5 : ajoute aussi son compte rendu (2 lignes) dans `vers-cowork.md`.

---

## Synchro n°6 (2026-11-12) : concevoir la boutique

### T23 · Lancer architecte-web · `fait`
Lance l'agent `architecte-web` avec exactement la demande de `tests/scenarios/architecte-web.md`.

### T24 · Audit de conformité de la conception · `fait`
Une fois T23 terminé, lance `conformite-qa` en mode audit sur le rapport produit par `architecte-web`.

### T25 · Commit, push et compte rendu · `fait`
- Commit `docs(outputs): conception de la boutique + audit conformité`, puis push.
- Dans `vers-cowork.md` : résumé des deux rapports (5 lignes chacun), les **3 pistes d'identité visuelle** présentées simplement (nom de piste, couleurs, ambiance), le verdict de l'audit, et les 🔔 ACTION HUMAINE.
- Ne lance pas `developpeur-web` : l'humain doit d'abord choisir une identité visuelle.

## Règle permanente
Quand une tâche installe ou modifie un agent dans `.claude/agents/`, ne lance pas cet agent dans la même session : termine la synchro et demande à l'humain de redémarrer Claude Code.
