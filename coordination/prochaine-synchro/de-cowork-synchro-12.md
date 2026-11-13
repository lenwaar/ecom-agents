## Synchro n°12 (préparée par Cowork le 2026-11-13) : le studio vidéo

Référence : `docs/studio/BRIEF-STUDIO.md`. Dans l'ordre, une ligne dans `vers-cowork.md` après chaque tâche, `py` au lieu de `python`. Ne lance pas un agent modifié dans la même session (règle permanente) : T48 installe, l'humain redémarre, puis la synchro n°13 produira la première vidéo.

### T48 · Installer le studio · `à faire`
- Copie `coordination/a-installer/studio-video.md` et `media-acquisition.md` dans `.claude/agents/` (ils remplacent les versions actuelles).
- Copie `coordination/a-installer/skills/*` dans `.claude/skills/` et `coordination/a-installer/commands/marketing.md` dans `.claude/commands/`.
- `tests/scenarios/studio-video.md` est déjà à jour : vérifie seulement qu'il existe.
- Crée `studio/video/` (avec `effets/`, `.cache/`), `medias/voix/`, `medias/apercus/`, `medias/licences.md` (vide avec un en-tête), `marketing/calendrier.md` (en-tête seulement).
- `.gitignore` : `studio/video/.cache/`, `studio/video/_vendor/`, `studio/video/node_modules/`, les fichiers `*.wav`, et les MP4 de plus de 20 Mo (à défaut, `medias/brouillons/`).
- Vide ensuite `coordination/a-installer/` (garde le `.gitkeep`).

### T49 · Licences et choix des outils · `à faire`
Lance `veille-outils` : vérifie sur les dépôts officiels la licence et le coût de Remotion, HyperFrames (heygen-com/hyperframes), faster-whisper, Piper, et l'usage commercial des voix ElevenLabs. Recommande la combinaison pour une micro-entreprise d'une personne. Rapport dans `outputs/`.

### T50 · Socle technique · `à faire`
Selon la recommandation de T49 (sans rien qui exige un paiement) : dans `studio/video/`, installe ce qui est retenu (Remotion et/ou les skills HyperFrames avec `npx skills add heygen-com/hyperframes`, faster-whisper avec `py -m pip`), et vérifie ffmpeg. Un rendu de test de 3 s doit marcher. Note les commandes dans `docs/studio/BRIEF-STUDIO.md` (nouvelle section « Commandes »).

### T51 · Commit, compte rendu, redémarrage · `à faire`
Vérificateur à 0 erreur, commit `feat(studio): studio vidéo, skills et pilote marketing`, push, compte rendu avec 🔔 ACTION HUMAINE, puis demande à l'humain de redémarrer Claude Code.
