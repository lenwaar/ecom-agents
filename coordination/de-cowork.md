# Tâches de Claude Cowork pour Claude Code

Statuts : `à faire` · `fait` · `bloqué (raison)`

## Synchro n°1 : T1 à T4 · `fait` (voir vers-cowork.md)

---

## Synchro n°2 (2026-11-12)

### T5 · Installer l'agent conformite-qa · `fait`
- Copie `coordination/a-installer/conformite-qa.md` vers `.claude/agents/conformite-qa.md` (copie identique), puis supprime le dossier `coordination/a-installer/`.
- Le scénario de test `tests/scenarios/conformite-qa.md` est déjà en place (écrit par Cowork).

### T6 · Prendre en compte les décisions de l'humain · `fait`
`knowledge/niche.md` a été mis à jour par Cowork (rien à modifier, juste à commiter) :
- produits de marque **authentiques** autorisés via canal officiel, la marque peut être citée pour décrire le produit ;
- **aucune électronique** au lancement.

Dans `ROADMAP.md`, phase 2 : coche `conformite-qa` avec la mention `+ test (à lancer et valider)`.

### T7 · Commit et push · `fait`
Commit `feat(agent): conformite-qa + décisions marques et électronique`, puis push.

### T8 · Lancer conformite-qa, test 1 (mode dossier) · `fait` (via agent généraliste, voir vers-cowork.md)
Lance l'agent avec exactement la demande du test 1 de `tests/scenarios/conformite-qa.md`.

### T9 · Lancer conformite-qa, test 2 (mode audit) · `fait`
Une fois T8 terminé, lance l'agent avec la demande du test 2.

### T10 · Rendre compte · `fait`
- Commit `docs(outputs): conformite-qa dossier lancement légal + audit sourcing v2`, puis push.
- Dans `vers-cowork.md` : résumé des deux rapports et les 🔔 ACTION HUMAINE.
- Ne coche pas toi-même la grille de test : Cowork vérifiera les rapports.
