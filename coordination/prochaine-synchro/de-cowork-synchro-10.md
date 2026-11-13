## Synchro n°10 (préparée le 2026-11-12) : organisation à 100 rôles, 7 nouveaux agents

À lancer après la synchro n°9 et un redémarrage de Claude Code.
Référence : `docs/organisation.md` (décision de l'humain : 100 rôles confiés à environ 15 agents et des scripts sans IA).

### T41 · Installer 7 agents · `à faire`
Copie dans `.claude/agents/` les fichiers de `coordination/a-installer/` : `studio-video`, `veille-outils`, `gestion-commandes`, `service-client`, `crm-email`, `pilotage-finance`, `media-acquisition`. Leurs scénarios de test sont déjà dans `tests/scenarios/`.
Ajoute dans `docs/architecture.md` une ligne qui renvoie vers `docs/organisation.md`.
Lance `python tools/verifier_livrables.py` (0 erreur attendue).
Commit `feat(agents): organisation à 100 rôles et 7 nouveaux agents`.

### T42 · Compte rendu et redémarrage · `à faire`
Une ligne dans `vers-cowork.md`, puis demande à l'humain de redémarrer Claude Code.
Ne lance aucun de ces agents dans cette session. `gestion-commandes`, `service-client`, `crm-email` et `pilotage-finance` ne seront utilisés qu'avant le lancement ; `media-acquisition` après le lancement.
