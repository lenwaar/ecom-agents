# Tâches de Claude Cowork pour Claude Code

Statuts : `à faire` · `fait` · `bloqué (raison)`

## Synchro n°1 à n°3 (T1 à T15) · `fait` (voir vers-cowork.md)

---

## Synchro n°4 (2026-11-12)

### T16 · Installer sourcing-produits v1.5 · `fait`
Copie `coordination/a-installer/sourcing-produits.md` vers `.claude/agents/sourcing-produits.md` (remplace, copie identique), puis supprime `coordination/a-installer/`.
Corrige tes 8 incohérences de la v1.4 (merci) + ajoute l'**objectif de marge de 15 €** (plancher 10 € inchangé), décision de l'humain.

### T17 · Fichiers déjà écrits par Cowork, à commiter tels quels · `fait`
- `knowledge/politiques.md` : copie exacte de la section 5 du dossier conformite-qa (statut : proposition à valider). Ajoute-le dans `knowledge/README.md` (« proposé, à valider »).
- `knowledge/prix-et-marges.md` et `knowledge/contraintes.md` : objectif de marge de 15 € ajouté.
- `tests/scenarios/sourcing-produits.md` : cases pour les éliminatoires v1.4 et l'objectif de 15 €.

### T18 · Commit et push · `fait` (aucun agent lancé)
Commit `fix(agent): sourcing-produits v1.5 + politiques.md + objectif de marge 15 €`, puis push. Ne lance aucun agent (règle permanente).

## Règle permanente
Quand une tâche installe ou modifie un agent dans `.claude/agents/`, ne lance pas cet agent dans la même session : termine la synchro et demande à l'humain de redémarrer Claude Code.
