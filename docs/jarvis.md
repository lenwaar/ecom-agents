# Briefing du matin vocal en local (V2-6, optionnel)

OpenJarvis (Stanford, licence Apache-2.0) est un assistant personnel pour tout le PC, pas un élément du dépôt. **Claude Code ne l'installe pas.** Si vous le voulez, vous lancez l'installateur vous-même. Sources lues le 2026-11-20 : README https://github.com/open-jarvis/OpenJarvis, script https://open-jarvis.github.io/OpenJarvis/install.ps1, pages « installation », « morning-digest », « channels-and-connectors » et « telemetry » de https://open-jarvis.github.io/OpenJarvis/. Une partie de ces pages n'a été lue qu'en résumé : vérifiez chaque commande sur la page avant de la lancer.

## Ce que le dépôt fournit

`tools/page_matin_texte.py` convertit la dernière page du lundi (`outputs/AAAA-MM-JJ-cerveau-page-du-lundi.md`) en texte brut, lisible à voix haute : sans en-tête, sans balises, tableaux lus « en-tête : valeur ». Aucun appel réseau.

```
py tools/page_lundi.py                                          (ou la commande /lundi)
py tools/page_matin_texte.py --sortie %USERPROFILE%\page-du-matin.txt
```

Le fichier texte reste sur votre PC, hors du dépôt.

## Lecture à voix haute sans rien installer (0 €, recommandé)

Windows a une synthèse vocale locale. Après la commande ci-dessus :

```
powershell -Command "Add-Type -AssemblyName System.Speech; $v = New-Object System.Speech.Synthesis.SpeechSynthesizer; $v.Speak((Get-Content -Raw -Encoding UTF8 $env:USERPROFILE\page-du-matin.txt))"
```

Une voix française doit être installée dans Windows (Paramètres > Heure et langue > Voix). Rien ne quitte le PC.

## Installer OpenJarvis (fait par l'humain, s'il le veut)

- Prérequis relevés dans `install.ps1` : Windows 10 version 1809 ou plus, Python 3.11 à 3.13 (**3.14 n'est pas pris en charge** ; ce PC a Python 3.14.7, le script installera 3.13 par winget), Git, outils de compilation Microsoft (MSVC Build Tools, plusieurs Go, à installer à part : le script s'arrête et donne la commande).
- Le script télécharge depuis github.com, astral.sh (uv), ollama.com (Ollama, environ 150 Mo) puis le modèle `qwen3.5:2b` (1 à 1,5 Go selon la source). Modèles plus gros selon la mémoire : 4b, 9b (celui de la doc du briefing), 27b ; 1,1 à 14,9 Go.
- Installation dans `%LOCALAPPDATA%\OpenJarvis`. Commande (README) : `irm https://open-jarvis.github.io/OpenJarvis/install.ps1 | iex`. Variante sans tâche planifiée : télécharger le script avec `-OutFile install.ps1`, le lire, puis `.\install.ps1 -SkipService`.
- Ensuite, dans un nouveau PowerShell : `jarvis doctor` (état), puis `jarvis`.
- Désinstallation : non documentée (À VÉRIFIER).

## Le briefing du matin (preset `morning-digest`)

- Le README cite `morning-digest-mac`, `morning-digest-linux` et `morning-digest-minimal` ; **aucun preset Windows**. Essayer `morning-digest-minimal` (À VÉRIFIER).
- Commandes documentées : `jarvis digest --fresh`, `jarvis digest --text-only`, `jarvis digest --schedule "0 7 * * 1"` (le lundi à 7 h), réglages dans `~/.openjarvis/config.toml`, section `[digest]` (mettre `timezone = "Europe/Paris"`).
- **Voix : les deux moteurs documentés (Cartesia, OpenAI) sont des services en ligne avec clé API**, donc payants et le texte du briefing part chez eux. C'est contraire à la règle « 0 €, pas de clé API payante » : utiliser `--text-only` et la lecture Windows ci-dessus. Synthèse vocale locale dans OpenJarvis : non trouvée.
- Lire notre fichier texte : aucune option documentée pour donner un fichier local au briefing. Piste non vérifiée : `jarvis memory index <dossier>` (À VÉRIFIER).

## Gmail et Agenda (fait par l'humain uniquement)

Les pages se contredisent ; à vérifier sur place.
- README : `jarvis connect gdrive`, un seul accord OAuth pour Gmail, Agenda et Tâches.
- Page « connecteurs » : Gmail par IMAP avec un mot de passe d'application (validation en deux étapes, puis `jarvis connect gmail_imap`) ; Drive et Agenda par OAuth avec votre propre projet Google Cloud (identifiant « Desktop app », vous-même comme utilisateur test, retour vers `http://localhost:8789/callback`), en lecture seule.
- Identifiants rangés dans `~/.openjarvis/connectors/`. Ne jamais les mettre dans ce dépôt, ni les donner à Claude Code.

## Ce qui sort du PC

- Télémétrie : stockée localement (`~/.openjarvis/telemetry.db`, requêtes et réponses comprises) ; aucun envoi mentionné ; arrêt de la collecte non documenté (À VÉRIFIER, page « data-boundary-scan » non lue).
- Connecteurs (Gmail, Agenda, météo, actualités) : requêtes vers ces services, seulement si vous les activez.
- Moteurs en ligne : facultatifs, à laisser désactivés.
