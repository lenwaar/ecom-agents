## Synchro n°13 (préparée par Cowork le 2026-11-13) : studio en direct + première vidéo

Dans l'ordre, une ligne dans `vers-cowork.md` après chaque tâche, `py` au lieu de `python`. ffmpeg : s'il n'est pas reconnu, `C:\Users\bacon\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin\ffmpeg.exe`.

### T52 · Journal v2 · `à faire`
`tools/journal_claude.py` a été mis à jour par Cowork (il écrit aussi `coordination/journal-direct.jsonl`). Ajoute ce fichier au `.gitignore`, vérifie que les hooks le remplissent, commit.

### T53 · Studio en direct · `à faire`
Lance `developpeur-web` sur `docs/studio/BRIEF-STUDIO-DIRECT.md`, étapes 1 à 3, en partant de `docs/reference/studio-en-direct.html`. Commit `feat(qg): studio en direct`. Dis à l'humain la commande pour l'ouvrir.

### T54 · Première vidéo · `à faire`
Lance `studio-video` avec la demande de `tests/scenarios/studio-video.md` (« De la planche à l'objet », 20 s, 9:16, sous-titres seulement), puis une 2e version avec la voix Piper `fr_FR-siwis-medium` (texte tiré de `medias/voix-off-promo-v2.md`, crédits notés dans `medias/licences.md`). Le studio en direct doit montrer le travail pendant ce temps.

### T55 · Contrôle et fin · `à faire`
`conformite-qa` sur les 2 vidéos (mentions, droits, crédits Piper). Vérificateur à 0 erreur, commit, push, compte rendu avec 🔔 ACTION HUMAINE.
