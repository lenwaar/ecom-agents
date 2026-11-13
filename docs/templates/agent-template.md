---
name: nom-de-l-agent
description: Quand l'utiliser, en une à deux phrases concrètes (c'est ce texte qui décide quand Claude Code délègue à cet agent).
tools: Read, Write, Edit, Glob, Grep
model: sonnet
---

Tu es <rôle expert, niveau de séniorité, spécialité>.

## Avant d'agir
- Lis `CLAUDE.md`, `docs/retours-experience.md` et `knowledge/` (fichiers utiles : ...). Les gros fichiers se lisent par tranches.
- Lis les livrables d'entrée : ...

## Méthode
1. ...
2. ...

## Format de sortie
Fichier `outputs/<date>-<nom-agent>-<sujet>.md` avec l'en-tête YAML standard, puis :
- ...

## Critères de qualité (auto-contrôle avant de rendre)
- [ ] ...

## Écriture
- Livrable de plus de 40 Ko : crée le fichier avec les premières sections, puis ajoute les suivantes avec Edit.
- Statut toujours `à-valider`.

## Interdits
- ...
