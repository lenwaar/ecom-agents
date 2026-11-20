---
agent: claude-code
statut: à-valider
date: 2026-11-20
sources: [https://github.com/Jakeschincariol/founder-skill (commit fd9385b, 2026-10-06), https://github.com/Jakeschincariol/youtube-agent-skill (commit a2feb21, 2026-09-16)]
prochaine-etape: humain (accord pour copier les deux packs dans .claude/skills/), puis redémarrage de Claude Code
---

# Revue des skills tiers avant installation (V2-1 et V2-4)

Les deux dépôts ont été téléchargés dans un dossier temporaire, hors du projet. Tous les `SKILL.md`, le README et les scripts ont été lus avant toute installation, comme le demande la synchro n°18. Rien n'a été exécuté depuis ces dépôts.

## Résultat

| Pack | Licence | Skills | Scripts | Réseau appelé par les scripts | Clé API | Verdict |
|---|---|---|---|---|---|---|
| founder-skill | MIT | 11 (`founder-board`, `-competitors`, `-consumer`, `-pricing`, `-offer`, `-cfo`, `-marketing`, `-brand`, `-ops`, `-launch`, `-plan`) | 4 en Python, bibliothèque standard seule : `unit_economics.py`, `panel.py`, `van_westendorp.py`, `compile.py` | Aucun | Aucune | Installable |
| youtube-agent-skill | MIT | 11 (`yt-script`, `-package`, `-edit`, `-plan`, `-viral`, `-retention`, `-comment`, `-shorts`, `-seo`, `-chapters`, `-audit`) | 6 en Python, bibliothèque standard seule : `hookscore.py`, `title.py`, `deadair.py`, `chapters.py`, `retention.py`, `swipe.py` | Aucun | Aucune (aucune skill n'utilise l'API YouTube) | Installable |

Contrôle fait : recherche dans tous les fichiers de `requests`, `urllib`, `http`, `socket`, `subprocess`, `os.system`, `curl`, `wget`, `fetch`, clés et jetons. Aucune occurrence dans les scripts. Les seules URL sont dans le README et les fichiers de plugin (liens vers GitHub et le site de l'auteur).

## Ce que font les scripts

- Ils lisent et écrivent des fichiers locaux uniquement : `founder/` à la racine du projet pour Founder (idée, panel, chiffres, plan), la sortie écran ou un fichier choisi pour YouTube.
- `compile.py` charge `unit_economics.py` de son dossier voisin (fichier local, pas de téléchargement).
- `panel.py` ne répond jamais à la place d'un acheteur simulé : il distribue les profils, écrit les consignes et compte les réponses.

## Points d'attention pour l'usage (après redémarrage)

1. **Panel de 100 acheteurs simulés** (`/founder-consumer`) : 100 sous-agents, donc une consommation importante. Commencer par `--quick` (20 acheteurs). Le taux d'achat est un maximum, pas une prévision ; les réponses ne sont jamais des témoignages.
2. **`/founder-competitors`, `/founder-ops`, `/founder-brand`** lisent des pages publiques par la recherche web de Claude (pas par les scripts). Sources liées, aucune collecte automatisée.
3. **Montants en dollars** dans les rapports des scripts Founder (`$`) : les chiffres restent ceux saisis, à lire en euros ; à signaler dans le livrable V2-1b.
4. **Fichier de voix YouTube** : les skills `yt-*` lisent `~/.claude/youtube/voice.md` (dossier global de l'utilisateur, hors du dépôt) et proposent de l'écrire s'il manque. Pour la boutique, le modèle est copié dans `.claude/skills/yt-script/voice.modele.md` ; la voix doit suivre `knowledge/marque.md` (vouvoiement, sans emoji, sans fausse urgence). À régler en V2-4b.
5. **`/yt-viral`** suggère `yt-dlp` pour collecter des listes publiques. Non branché dans cette synchro (niche non choisie).
6. Les hooks d'exemple de `hooks.json` sont en anglais et contiennent des chiffres d'exemple : ils ne doivent jamais être repris tels quels.

## Installation

Une première copie a été refusée par le contrôle automatique de Claude Code (mode auto) : installer des skills change les prochaines sessions. L'humain a donné son accord explicite le 2026-11-20 ; les 22 dossiers ont alors été copiés tels quels dans `.claude/skills/` (licences : `founder-board/LICENSE-founder-skill`, `yt-script/LICENSE-youtube-agent-skill` ; modèle de voix : `yt-script/voice.modele.md`). Aucune skill n'a été lancée dans cette session : elles servent après le redémarrage (V2-1b et V2-4b).
