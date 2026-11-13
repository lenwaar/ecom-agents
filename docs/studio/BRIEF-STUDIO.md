# Brief : le studio vidéo et le pilote marketing

Rédigé par Cowork le 2026-11-13, à la demande de l'humain, d'après 7 vidéos de référence (un « directeur marketing » IA qui gère pubs, réseaux, e-mails et SEO ; du montage automatique piloté par Claude ; du motion design calculé en code ; un site avec animation 3D au défilement).
Il complète `docs/qg/BRIEF-QG.md` (le studio est la pièce F du QG) et `docs/organisation.md`.

## 1. Objectif

L'équipe sait produire seule, de bout en bout, des **vidéos courtes de qualité professionnelle** pour TikTok, Reels, Shorts et Pinterest :
script, voix off, texte animé, sous-titres mot à mot, bruitages, musique sous licence, motion design, mouvements de caméra sur nos rendus et (plus tard) sur les vraies photos et vidéos des produits.
Puis elle **prépare et pilote les publicités** Meta (Facebook, Instagram) et TikTok, toujours sous le contrôle de l'humain.

Contrainte permanente : **aucun visage, aucune personne filmée**. Tout est tourné seul au bureau (mains, objets, écran) ou fabriqué par le code.

## 2. La chaîne de production (une vidéo)

| Étape | Qui | Sortie |
|---|---|---|
| 1. Idée et angle (tendance, saison, produit) | `createur-contenu` (+ `analyste-marche`) | ligne dans `marketing/calendrier.md` |
| 2. Script seconde par seconde : accroche en moins de 2 s, plans, texte à l'écran, voix, appel à l'action | `createur-contenu` | `outputs/…-createur-contenu-script-<nom>.md` |
| 3. Validation du script | humain | statut `validé` |
| 4. Voix off | `studio-video` prépare le texte ; génération ElevenLabs par Cowork ou l'humain (offre payante pour usage commercial), ou Piper en local | `medias/voix/<nom>.mp3` |
| 5. Sous-titres mot à mot | `studio-video` (faster-whisper en local ou transcription ElevenLabs) | `medias/voix/<nom>.srt` + `.json` (temps par mot) |
| 6. Montage et motion design | `studio-video` (Remotion ou HyperFrames, rendus 3D de `studio/`) | `medias/<nom>-9x16.mp4` |
| 7. Contrôle | `conformite-qa` (mentions, droits, allégations) + grille de qualité §5 | rapport |
| 8. Déclinaisons 1:1, 16:9, 4:5 | `studio-video` | fichiers |
| 9. Publication | **l'humain** (ou Cowork sur son accord explicite) | |

## 3. Les outils du studio

Tout est dans `studio/video/` (le dossier `studio/` sert déjà aux rendus 3D).

- **Remotion** (vidéo en React, rendu local) : modèle principal. Licence gratuite pour un particulier ou une entreprise de 3 personnes au plus (`À VÉRIFIER` par `veille-outils` avant installation).
- **HyperFrames de HeyGen** (vidéo en HTML + GSAP) : motion design, cartes en verre, typographie animée. Skills officielles : `npx skills add heygen-com/hyperframes` (licence `À VÉRIFIER`).
- **ffmpeg** : assemblage, sous-titres incrustés, mixage, formats.
- **faster-whisper** (local) : temps de chaque mot pour les sous-titres et pour caler les coupes sur la voix.
- **Rendus 3D** de `studio/` (Three.js) : plans produits, orbites, vues éclatées animées, comparateur avant/après.
- **Son** : bruitages fabriqués par le code (tic d'engrenage, cliquet, bois, souffle) + musique de la bibliothèque commerciale de chaque plateforme, ou musique libre de droits avec licence notée dans `medias/licences.md`.
- **Skills Claude Code** (installées par Cowork dans `.claude/skills/`) : `motion-foundations` (12 principes d'animation) et `motion-video-hyperframes` (méthode HyperFrames).

## 4. Le catalogue d'effets (modèles réutilisables)

Chaque effet est un composant réutilisable dans `studio/video/effets/`, avec une vidéo d'exemple de 3 s :

1. `accroche-texte` : gros titre mot par mot, mot clé en laiton.
2. `sous-titres-mot-a-mot` : style TikTok, mot actif surligné, zone sûre respectée.
3. `orbite-produit` : caméra qui tourne autour du produit 3D.
4. `projecteur` : noir, puis un faisceau éclaire le produit.
5. `cartes-verre` : cartes translucides (prix, temps d'assemblage, difficulté) qui flottent.
6. `vue-eclatee` : les pièces s'écartent puis se rassemblent.
7. `planche-a-objet` : la planche de bois devient l'objet monté (comparateur animé).
8. `coupes-rythmees` : coupes calées sur les temps forts de la musique ou de la voix.
9. `boite-commentaire` : réponse à un commentaire (texte tapé), comme sur TikTok.
10. `barre-prix` : prix barré seulement avec un vrai prix de référence (règle des 30 jours).
11. `fin-appel` : logo, nom, appel à l'action, mention « Visuel de démonstration » si besoin.
12. `ecran-site` : défilement du site réel enregistré par Playwright, avec mouvement de caméra 2,5D.

## 5. Grille de qualité (à cocher avant de rendre une vidéo)

- [ ] Accroche lisible et compréhensible en moins de 2 secondes, sans le son.
- [ ] Un changement visuel toutes les 1,5 à 3 secondes.
- [ ] Sous-titres lisibles (au moins 48 px en 1080×1920), dans la zone sûre (ni dans les 15 % du haut ni dans les 20 % du bas).
- [ ] Voix nette, musique 12 à 18 dB sous la voix, pas de saturation.
- [ ] Les 12 principes d'animation respectés (skill `motion-foundations`), aucun mouvement linéaire.
- [ ] Couleurs et polices de `knowledge/marque.md`, aucun emoji.
- [ ] Mentions : « Visuel de démonstration » sur un rendu 3D ; « contenu généré par IA » si voix ou image générée ; « publicité » quand c'est une pub.
- [ ] Droits notés pour chaque son, musique, police et image.
- [ ] Aucune promesse chiffrée sans source, aucune fausse promo, aucun faux avis.
- [ ] Images clés exportées dans `medias/apercus/<nom>/` pour la relecture.

## 6. Photos d'ambiance (« shooting numérique »)

Autorisé : une **vraie photo** du produit (quand on aura les échantillons), détourée, posée dans un décor généré ou modélisé, avec la mention « décor généré par IA ».
Interdit : générer une fausse photo du produit lui-même, ou laisser croire qu'un rendu 3D est une photo.
Outils : Adobe (détourage, Firefly) ou ElevenLabs Image, utilisés par Cowork sur accord de l'humain.

## 7. Le pilote marketing (commande `/marketing`)

Une commande Claude Code qui fait tourner le cycle de la semaine, agent par agent (les sous-agents ne peuvent pas s'appeler entre eux) :

1. `analyste-marche` : tendances et saison de la semaine (court).
2. `createur-contenu` : met à jour `marketing/calendrier.md` (3 vidéos et 5 épingles par semaine au départ) et écrit les scripts.
3. `studio-video` : produit les vidéos dont le script est `validé`.
4. `crm-email` : lettre de la semaine (quand l'outil d'envoi existe).
5. `media-acquisition` : bilan des pubs (si elles tournent) et propositions.
6. `pilotage-finance` : coût par vente comparé à la marge.
7. Compte rendu dans `marketing/semaine-AAAA-SS.md` avec les décisions à prendre par l'humain.

## 8. Les publicités

- Connecteur **Adspirer Social Ads**, branché par l'humain sur claude.ai : un compte Meta Ads est connecté, TikTok Ads pas encore. Quota de l'offre actuelle : environ 15 actions par mois, donc à garder pour les vraies actions.
- C'est **Cowork** qui l'utilise (il est branché à claude.ai, pas forcément à Claude Code) ; `media-acquisition` prépare les plans, les textes, les ciblages et les budgets dans `outputs/`.
- Règles : rien avant le lancement de la boutique (SIRET, Stripe, vrai produit) ; campagnes **toujours créées en pause** ; l'humain les active ; budget journalier et plafond total écrits avant ; ciblage 18 ans et plus ; mention « publicité » ; contenu IA signalé ; jamais de faux avis ni de fausse urgence.
- À prévoir par l'humain : un **compte publicitaire professionnel** rattaché à la page de la boutique (le compte connecté aujourd'hui est un compte personnel).

## 9. L'accueil du site façon « animation au défilement »

Idée tirée d'une des vidéos : une séquence d'images rendue par `studio/` (le produit qui se construit pièce par pièce) jouée au défilement de l'accueil. À traiter par `architecte-web` et `developpeur-web` après le studio, avec un poids limité (images WebP, chargement progressif, version fixe sans animation).

## 10. Étapes (une validation de l'humain à la fin de chacune)

1. Installation : outils (`veille-outils` vérifie les licences d'abord), skills, dossiers, `.gitignore` pour les gros fichiers.
2. Les 12 effets, chacun avec son exemple de 3 s et une planche d'aperçus.
3. Première vraie vidéo de 20 s : « De la planche à l'objet » (boîte à musique), sous-titres seulement.
4. Même vidéo avec voix off (texte de `medias/voix-off-promo-v2.md`, génération par Cowork sur accord).
5. Commande `/marketing` et `marketing/calendrier.md` des 4 prochaines semaines.
6. Plan de publicité des 60 premiers jours (`media-acquisition`), rien n'est lancé.

## 11. Commandes (installées en T50, synchro n°12, le 2026-11-13)

Choix suivi : recommandation (a) de `outputs/2026-11-13-veille-outils-licences-studio-video.md`, rien de payant, aucun compte.

### Installation (une fois par PC)
```
cd studio/video
npm install                                          # Remotion 4.0.543, HyperFrames 0.9.41, React 19.2.0 (versions figées)
npx hyperframes telemetry disable                     # pas de télémétrie HeyGen
py -m pip install --user -r requirements.txt          # faster-whisper 1.2.1, PyAV 18.1.0, piper-tts 1.8.0
py -m piper.download_voices fr_FR-siwis-medium --download-dir .cache/voix-piper
```
- ffmpeg 9.0.2 est déjà installé (winget, `ffmpeg -version`).
- Skills HyperFrames de base (`hyperframes`, `hyperframes-cli`, `hyperframes-registry`) installées dans `.claude/skills/` avec `npx skills add heygen-com/hyperframes -s hyperframes -s hyperframes-cli -s hyperframes-registry -a claude-code --copy -y` (verrou : `skills-lock.json`). Non installées : `media-use`, `reverse-any-video` et `style-sampling` (Pro), `figma`, `slideshow`, `remotion-to-hyperframes`.
- **Interdits sans accord de l'humain** : `npx hyperframes auth login`, `share`, `publish`, `cloud`, les skills Pro, `feedback` et `events` (télémétrie demandée par les skills : ne pas l'envoyer).
- Mettre `HYPERFRAMES_NO_TELEMETRY=1` dans l'environnement avant chaque commande HyperFrames.

### Rendus de test (3 s, 1080×1920, vérifiés le 2026-11-13)
```
cd studio/video
npm run test-rendu        # Remotion  -> .cache/test-rendu.mp4  (src/TestRendu.tsx)
npm run test-hf           # HyperFrames -> .cache/test-hf.mp4    (exemples/test-hyperframes/index.html)
npm run studio            # éditeur Remotion dans le navigateur
npm run hf-preview        # aperçu HyperFrames dans le navigateur
```

### Voix off et sous-titres en local
```
py -m piper -m .cache/voix-piper/fr_FR-siwis-medium.onnx -f ../../medias/voix/<nom>.wav -- "Texte de la voix off."
ffmpeg -i ../../medias/voix/<nom>.wav -c:a libmp3lame -q:a 2 ../../medias/voix/<nom>.mp3
```
Temps par mot (faster-whisper, langue forcée en français) :
```python
from faster_whisper import WhisperModel
m = WhisperModel("large-v3", device="cpu", compute_type="int8")   # modèle Systran, licence MIT vérifiée en T49
segments, _ = m.transcribe("../../medias/voix/<nom>.wav", language="fr", word_timestamps=True)
```
- Le test a été fait avec le modèle `tiny` (petit, rapide) : sa licence est `À VÉRIFIER`, ne pas l'utiliser pour une vidéo publiée.
- Cache des modèles : `HF_HOME=studio/video/.cache/hf` (hors Git).
- Les fichiers `*.wav` sont ignorés par Git : garder le `.mp3`.

### Pièges connus
- PyAV 19 casse faster-whisper 1.2.1 (`metadata_errors`) : garder `av==18.1.0`.
- `py -I` (mode isolé) ne voit pas les paquets installés avec `--user` : lancer `py` sans `-I` pour ces outils.
- La MODEL_CARD de la voix Piper n'est pas téléchargée par `piper.download_voices` : la récupérer sur huggingface.co/rhasspy/piper-voices avant la première vidéo publiée, et noter le crédit CC BY 4.0 dans `medias/licences.md`.
- `npm install` signale que le script d'installation d'`esbuild` n'est pas autorisé : sans effet, les deux rendus marchent.
