# CLAUDE.md : règles du projet

Ce dépôt contient une équipe de sous-agents Claude Code qui gère une boutique e-commerce.
Lis `docs/architecture.md` avant toute tâche.

## Règles pour tous les agents

- Toujours lire `knowledge/` (marque, niche, politiques) avant de produire quoi que ce soit.
- Écrire en français, ton défini dans `knowledge/marque.md`.
- Ne jamais inventer un chiffre (prix, délai, stock, avis, statistique) : citer la source ou écrire `À VÉRIFIER`.
- Ne jamais inventer d'avis clients, de témoignages ou de fausses promos (« -70 % » sans prix de référence réel) : c'est illégal en France (pratiques commerciales trompeuses).
- Aucune allégation santé/médicale sur les produits beauté/bien-être.
- Chaque livrable va dans `outputs/` avec l'en-tête YAML décrit dans l'architecture.
- Tout livrable public passe par `conformite-qa` avant validation humaine.
- Rien n'est publié, envoyé ou payé sans l'accord explicite de l'humain.
- **Gros livrables** : un rapport de plus de 40 Ko environ s'écrit en plusieurs fois (créer le fichier avec les premières sections, puis ajouter les suivantes une par une). Un seul très gros écriture peut bloquer l'agent.
- Lire docs/retours-experience.md avant de commencer : chaque erreur déjà corrigée y est notée.
- Avant chaque commit : python tools/verifier_livrables.py doit afficher 0 erreur.

## Conventions du dépôt

- Un agent = un fichier `.claude/agents/<nom>.md`, construit depuis `docs/templates/agent-template.md`.
- Un agent = au moins un scénario de test dans `tests/scenarios/<nom>.md`.
- Commits en français, format : `feat(agent): ...`, `docs: ...`, `fix(agent): ...`.
