---
agent: veille-outils
statut: à-valider
date: 2026-11-13
mode: veille (T49, synchro n°12)
sources: [docs/studio/BRIEF-STUDIO.md, knowledge/contraintes.md, docs/retours-experience.md, https://github.com/remotion-dev/remotion/blob/main/LICENSE.md, https://www.remotion.dev/docs/license/pricing, https://www.remotion.dev/docs/license/faq, https://github.com/heygen-com/hyperframes, https://github.com/heygen-com/hyperframes/blob/main/LICENSE, https://gsap.com/licensing/, https://github.com/SYSTRAN/faster-whisper, https://huggingface.co/Systran/faster-whisper-large-v3, https://github.com/openai/whisper, https://github.com/rhasspy/piper, https://github.com/OHF-Voice/piper1-gpl, https://pypi.org/project/piper-tts/, https://huggingface.co/rhasspy/piper-voices, https://elevenlabs.io/pricing, https://elevenlabs.io/terms-of-use, https://elevenlabs.io/docs/help-center/legal/can-i-publish-the-content-i-generate-on-the-platform, https://ffmpeg.org/legal.html (toutes consultées le 2026-11-13)]
prochaine-etape: validation humaine, puis T50 (installation des seuls outils gratuits sans compte)
---

# Licences et coûts des outils du studio vidéo (T49)

Contexte : micro-entreprise d'une seule personne, vidéos produit courtes (TikTok, Reels, Shorts), budget de construction 0 € (`knowledge/contraintes.md`). Toutes les sources ont été consultées le **2026-11-13**. Rien n'a été installé.

Les sources ne sont pas des avis juridiques ; ce rapport ne l'est pas non plus.

## 1. Synthèse

| Outil | Licence (vérifiée sur la source) | Coût pour nous | Compte requis ? | Usage commercial | Verdict |
|---|---|---|---|---|---|
| Remotion | Licence propre à Remotion (pas open source) : « Free License » | 0 € (1 personne) | Non mentionné dans la licence (`À VÉRIFIER` à l'installation) | Oui, illimité, tant que l'effectif est de 3 personnes au plus | **(a) installable** |
| HyperFrames (cœur) | Apache 2.0, « Copyright 2026 HeyGen, Inc. » | 0 € | Non pour créer et rendre en local ; oui pour partager (`auth login`) | Oui, « no per-render fees or commercial-use thresholds » | **(a) installable, sans `auth login` ni skills Pro** |
| GSAP (utilisé par HyperFrames) | « Standard No Charge GSAP License » (Webflow) | 0 € | Non | Oui | **(a)** |
| FFmpeg | LGPL 2.1+ (GPL 2+ si options GPL) | 0 € | Non | Pas de restriction sur les vidéos produites | **(a)** |
| faster-whisper | MIT (code) ; modèles Systran sur Hugging Face : MIT ; Whisper (code et poids) : MIT | 0 € | Non | Oui | **(a)** |
| Piper (`piper-tts`, dépôt OHF-Voice/piper1-gpl) | GPL-3.0-or-later (code) | 0 € | Non | Code : oui ; **voix : au cas par cas** | **(a)** avec 2 voix françaises seulement |
| ElevenLabs gratuit | Conditions ElevenLabs | 0 € | Oui | **Non** (« cannot be used for any commercial purpose ») | Exclu |
| ElevenLabs Starter | Conditions ElevenLabs | 6 $/mois hors taxes (1 $ le premier mois) ; montant en euros `À VÉRIFIER` | Oui + carte | Oui (« Commercial License ») | **(b) décision humaine** |

## 2. Fiches outil par outil

### 2.1 Remotion (remotion-dev/remotion)

- **Sert à** : monter les vidéos en React (texte animé, sous-titres, rendus 3D), rendu local.
- **Licence** (LICENSE.md du dépôt, consulté le 2026-11-13) : la « Free License » couvre « an individual » et « a for-profit organization with up to 3 employees ». Usage permis : vidéos et images, « commercially or not ». Interdit : copier ou modifier le code de Remotion pour le vendre, le louer ou le sous-licencier.
- **Décompte des personnes** (FAQ, 2026-11-13) : « as long as your total headcount is 3 or less » ; les freelances ou agences qui manipulent le même projet Remotion **s'additionnent** à notre effectif. Si on livre seulement un fichier vidéo à un client, son effectif ne compte pas.
- **Coût sinon** (page des prix, 2026-11-13) : « Remotion for Creators » 25 $ par siège et par mois ; « Remotion for Automators » 0,01 $ par rendu, minimum 100 $ par mois. Montants en euros `À VÉRIFIER`.
- **Évolution annoncée** : la licence change « slightly » avec Remotion 5.0 ; la FAQ précise que la télémétrie devient obligatoire pour les clients « Automators » mais « remains voluntary for Free License users ».
- **Maintenance** : dernière version v4.0.543 publiée un 11 novembre (année non affichée sur la page, `À VÉRIFIER`, très probablement 2026). Nombre de contributeurs non relevé (`À VÉRIFIER`).
- **Risques** : licence non open source, conditionnée à l'effectif ; si l'entreprise dépasse 3 personnes ou fait appel à un prestataire sur le projet, il faut payer. Dépendance à Node.js et à Chrome headless (non vérifié ici, `À VÉRIFIER` dans la doc d'installation).
- **Notes /5** : utilité 5, coût 5, risque 4, effort d'intégration 3.

### 2.2 HyperFrames (heygen-com/hyperframes)

- **Sert à** : motion design en HTML + GSAP (cartes en verre, typographie animée), rendu image par image dans Chrome headless.
- **Licence** : fichier LICENSE = Apache License 2.0, « Copyright 2026 HeyGen, Inc. » (consulté le 2026-11-13). Le README annonce « no per-render fees or commercial-use thresholds ».
- **Compte HeyGen** : non requis pour `init`, `preview`, `render`. Le **partage** demande `npx hyperframes auth login` (5 projets gratuits par espace). L'app Studio est gratuite ; son offre Pro ajoute les modèles HeyGen. Les skills `/reverse-any-video` et `/style-sampling` sont marquées « HyperFrames Pro ». `/media-use` fonctionne « with HeyGen or free local tools ». Aucune clé d'API mentionnée pour le cœur.
- **Prérequis** : Node.js 22+, FFmpeg, Chrome headless.
- **GSAP** (gsap.com/licensing, 2026-11-13) : « Standard No Charge GSAP License », usage commercial couvert. Interdit : s'en servir pour fabriquer un outil d'animation sans code concurrent de Webflow (pas notre cas). Licence en vigueur depuis le 30 avril 2025, modifiée le 30 mai 2025.
- **Maintenance** : v0.9.41 publiée le 13 novembre 2026 ; 83,6 k étoiles, 7 107 commits. Version 0.x : l'interface peut encore changer.
- **Risques** : dépendance commerciale à HeyGen (fonctions Pro poussées dans les skills) ; ne jamais lancer `auth login` ni les skills Pro sans accord de l'humain. Le dépôt utilise Git LFS (cloner avec `GIT_LFS_SKIP_SMUDGE=1` si on clone, sinon passer par `npx`).
- **Notes /5** : utilité 4, coût 5, risque 4, effort 3.

### 2.3 faster-whisper (SYSTRAN/faster-whisper)

- **Sert à** : temps de chaque mot pour les sous-titres mot à mot, en local.
- **Licence du code** : MIT (dépôt, 2026-11-13).
- **Licence des modèles** : les modèles téléchargés automatiquement sont des conversions CTranslate2 publiées par Systran sur Hugging Face ; la fiche `Systran/faster-whisper-large-v3` affiche « License: mit ». Le README d'openai/whisper dit : « Whisper's code and model weights are released under the MIT License ». Autres tailles (small, medium, turbo, distil) : licence de chaque fiche `À VÉRIFIER` au moment du téléchargement.
- **Prérequis** : Python 3.9+ ; FFmpeg pas nécessaire (PyAV inclus) ; GPU NVIDIA optionnel (CUDA 12 + cuDNN 9), sinon CPU.
- **Maintenance** : dernière version 1.2.1, publiée un 31 octobre (année `À VÉRIFIER`).
- **Risques** : faibles ; données traitées en local, rien n'est envoyé. Téléchargement de modèles de plusieurs centaines de Mo à 3 Go selon la taille (`À VÉRIFIER` selon le modèle choisi).
- **Notes /5** : utilité 5, coût 5, risque 5, effort 4.

### 2.4 Piper (synthèse vocale locale)

- **Dépôt officiel actuel** : `rhasspy/piper` est **archivé depuis le 6 octobre 2025** ; « Development has moved » vers **`OHF-Voice/piper1-gpl`** (Open Home Foundation). Le README indique « Looking for Maintainers ».
- **Licence du code** : GPL-3.0-or-later (dépôt piper1-gpl et paquet PyPI `piper-tts` 1.8.0 du 4 septembre 2026, roue Windows x86-64 disponible). L'ancien dépôt rhasspy/piper était sous MIT. La GPL s'applique au logiciel quand on le **redistribue** ; l'utiliser en local pour fabriquer un fichier audio ne nous impose rien sur l'audio (lecture de la GPL, pas un avis juridique).
- **Licence des voix** (docs/LICENSING.md, 2026-11-13) : Piper n'accorde aucune licence sur les voix ; les droits viennent des données d'entraînement. La ligne « License » d'une fiche MODEL_CARD ne couvre **que le jeu de données de la voix elle-même**, pas celui de la voix de base dont elle est dérivée. Beaucoup de voix dérivent de la base « lessac », dont la licence « excludes commercial use of the resulting synthesis ».
- **Voix françaises** présentes sur `huggingface.co/rhasspy/piper-voices` (dossier fr/fr_FR) : gilles, mls, mls_1840, siwis, tom, upmc.

| Voix | Liste « usage commercial » de docs/COMMERCIAL_USE.md | Fiche MODEL_CARD | Obligation | Verdict |
|---|---|---|---|---|
| `fr_FR-siwis-medium` | Oui (groupe hifi_tts_92) | Jeu SIWIS, CC-BY 4.0 ; « Finetuned from the U.S. English hifi_tts_92 base model » ; Piper 1.5 ou plus | Créditer SIWIS **et** Hi-Fi TTS | **Utilisable** |
| `fr_FR-mls-medium` | Oui (« trained from scratch ») | Jeu MLS (openslr.org/94), CC-BY 4.0, 125 locuteurs | Créditer MLS (URL dans la fiche) | **Utilisable** |
| siwis (autres qualités), gilles, tom, upmc, mls_1840 | Non listées | Non vérifiées | — | **Exclues** (`À VÉRIFIER` avant tout usage) |

- **Point d'attention** : la page indique que des voix ont été « retrained in late 2026 » ; une ancienne copie portant le même nom peut ne pas être couverte. Vérifier dans la MODEL_CARD téléchargée que la section Training cite bien la base hifi_tts_92 (siwis) ou « Trained from scratch » (mls), et garder la MODEL_CARD avec le fichier `.onnx`.
- **Mention à prévoir** dans la description de la vidéo et dans `medias/licences.md` : crédit des jeux de données (CC BY 4.0) + mention « contenu généré par IA » (grille de qualité §5 du brief).
- **Risques** : projet en recherche de mainteneurs ; qualité de voix inférieure aux voix commerciales (non mesurée, `À VÉRIFIER` à l'écoute).
- **Notes /5** : utilité 3, coût 5, risque 4, effort 4.

### 2.5 ElevenLabs

- **Offre gratuite** (centre d'aide officiel, 2026-11-13) : « The free plan does not include a commercial license and cannot be used for any commercial purpose. » En cas de publication non commerciale, mention « elevenlabs.io » ou « 11.ai » obligatoire dans le titre. Les conditions d'utilisation (mises à jour le 9 octobre 2026) réservent les comptes gratuits à un usage non commercial. **Donc interdit pour la boutique.**
- **Offres payantes** : « All paid plans include a commercial license, provided you're not using Beta Services. » Le contenu généré pendant l'abonnement reste utilisable commercialement après résiliation. Les conditions ne contiennent pas d'obligation d'attribution pour les payants.
- **Plus petite offre commerciale** : **Starter, 6 $ par mois** hors taxes (1 $ le premier mois, offre promotionnelle), 30 000 crédits par mois (environ 1 crédit par caractère en synthèse vocale, selon le modèle). Soit 72 $ par an hors taxes. Montant en euros TTC `À VÉRIFIER` (devise affichée en dollars même sur la page française).
- **Risques** : compte et carte bancaire ; données (textes) envoyées à un service tiers ; les fonctions « Beta » sont exclues de la licence commerciale ; voix clonées soumises à la politique d'usage interdit.
- **Notes /5** : utilité 5, coût 3, risque 3, effort 5.

### 2.6 FFmpeg

- Licence LGPL 2.1 ou plus, GPL 2 ou plus si des options GPL sont compilées (ffmpeg.org/legal.html, 2026-11-13). Pas de restriction sur les vidéos produites ; la page signale un risque théorique de réclamation de brevets (MPEG) pour les **produits** commercialisés qui intègrent FFmpeg, ce qui n'est pas notre cas (usage local).

## 3. Recommandation

### (a) Gratuit, sans compte, utilisable commercialement tout de suite (périmètre de T50)

1. **Remotion** (Free License : 1 personne).
2. **HyperFrames** cœur (`init`, `preview`, `render`) avec **GSAP**, **sans** `auth login`, sans app Studio Pro, sans les skills « Pro ».
3. **FFmpeg**.
4. **faster-whisper** avec un modèle Systran affichant « License: mit » sur sa fiche Hugging Face.
5. **Piper** (`piper-tts`, OHF-Voice/piper1-gpl) avec **uniquement** les voix `fr_FR-siwis-medium` et `fr_FR-mls-medium`, MODEL_CARD conservée, crédits CC BY notés dans `medias/licences.md`.

Remotion ou HyperFrames : les deux sont gratuits pour nous. Remotion est plus mûr (v4) mais sa gratuité dépend de l'effectif ; HyperFrames est Apache 2.0 sans condition mais encore en 0.x. Les installer tous les deux ne coûte rien ; le brief prévoit Remotion comme modèle principal.

### (b) Demande un paiement ou un compte : décision de l'humain

- **ElevenLabs Starter** (6 $ HT par mois, 1 $ le premier mois) pour une voix off de meilleure qualité utilisable commercialement. À ne prendre qu'au lancement (budget 150 à 500 €), si les voix Piper ne suffisent pas à l'écoute.
- **Compte HeyGen / HyperFrames** (`auth login`, partage, Pro) : pas nécessaire.
- **Remotion Company License** : seulement si l'effectif dépasse 3 personnes ou si un prestataire travaille sur le projet Remotion.

### Coût total recommandé

- Phase actuelle : **0 € par mois**.
- Option voix ElevenLabs : 6 $ HT par mois, soit 72 $ HT par an (`À VÉRIFIER` en euros TTC).

## 4. Propositions d'évolution

| Problème constaté | Solution | Coût | Risque | Comment l'annuler |
|---|---|---|---|---|
| Le brief (§2, étape 4) cite « Piper en local » sans dire quelles voix sont autorisées | Ajouter dans le brief et dans `medias/licences.md` : seules `fr_FR-siwis-medium` et `fr_FR-mls-medium` sont autorisées, avec leurs crédits | 0 € | Aucun | Retirer la ligne |
| Le brief cite `rhasspy/piper`, archivé | Remplacer par `OHF-Voice/piper1-gpl` / paquet `piper-tts` | 0 € | Aucun | Revenir au texte précédent |
| La voix off ElevenLabs est prévue « offre payante » sans montant | Inscrire 6 $ HT par mois dans le budget de lancement, décision de l'humain | 6 $ HT/mois | Abonnement oublié | Résilier ; le contenu déjà généré reste utilisable |

Leçon ajoutée à `docs/retours-experience.md` : la licence d'une voix Piper se vérifie sur toute la chaîne d'entraînement, pas seulement sur la ligne « License » de sa fiche.

## 5. Auto-contrôle

- [x] Chaque affirmation sur un outil a une source datée (2026-11-13).
- [x] Licence vérifiée sur le dépôt lui-même (LICENSE de Remotion et HyperFrames ; licence affichée des dépôts faster-whisper, whisper, piper1-gpl ; MODEL_CARD des voix).
- [x] Coût exprimé par mois et par an ; conversion en euros marquée `À VÉRIFIER` car les sources affichent des dollars.

## ACTION HUMAINE

1. Valider ou non la liste (a) pour que T50 l'installe.
2. Décider plus tard (au lancement) de l'abonnement ElevenLabs Starter ; vérifier le prix en euros TTC au moment de payer.
3. Ne pas lancer `npx hyperframes auth login` ni les skills HyperFrames Pro sans décision explicite.
4. Écouter les voix `fr_FR-siwis-medium` et `fr_FR-mls-medium` (rhasspy.github.io/piper-samples) pour juger si elles suffisent.
5. Faire relire par `conformite-qa` la mention de crédit CC BY 4.0 avant la première vidéo publiée avec une voix Piper.
