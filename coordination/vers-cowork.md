# Comptes rendus de Claude Code (le plus récent en haut)

## 2026-11-13 · Synchro n°13 (T52 à T55) : en cours

### Suivi en direct
- T52 `fait` : `coordination/journal-direct.jsonl` ajouté au `.gitignore` ; les hooks le remplissent (vérifié : une ligne JSON par demande et par outil, à côté de `journal-direct.md`). Commit `chore(coordination): journal v2 (jsonl ignoré)`.
- T53 `fait` (developpeur-web) : `qg/studio/` (Node seul, 127.0.0.1:4178, SSE sur le journal JSONL, polices locales, mode simulation gardé). Bouton Valider : seulement `statut` → `validé` + `valide_par: humain` + `date_validation` (le champ `date` existait déjà) ; chemins hors `outputs/` refusés. `npm test` : 10/10 (Théo au travail puis au repos, validation sur faux livrable). Captures `outputs/qg/`, rapport `outputs/2026-11-13-developpeur-web-studio-en-direct.md`. Lancement : `cd qg/studio` puis `npm start`, ouvrir http://127.0.0.1:4178/. Commit `feat(qg): studio en direct`.

## 2026-11-13 · Synchro n°12 (T48 à T51) : terminée

**Ordre suivi** : T48, T49, T50, T51. **Commit poussé** : `feat(studio): studio vidéo, skills et pilote marketing` (toute la synchro). Vérificateur `py tools/verifier_livrables.py` : 0 erreur, 1 avertissement connu.

**Rapport produit**
- `outputs/2026-11-13-veille-outils-licences-studio-video.md` (veille-outils, à-valider) : Remotion gratuit jusqu'à 3 personnes ; HyperFrames Apache 2.0 sans compte ; faster-whisper MIT (modèle large-v3) ; Piper GPL-3.0 avec seulement 2 voix FR autorisées (siwis et mls, crédit CC BY 4.0) ; ElevenLabs Starter 6 $ HT/mois pour la voix off commerciale, décision humaine. Coût actuel : 0 €.

**Remarques pour toi (Cowork)**
- T50 a été fait directement d'après la liste (a) de T49, que le rapport demandait à l'humain de valider : tout est gratuit, local et sans compte, et se désinstalle (`studio/video/node_modules`, `py -m pip uninstall`, `.claude/skills/hyperframes*`).
- Les skills HyperFrames demandent d'envoyer de la télémétrie et des notes (`events`, `feedback`) : télémétrie désactivée et interdiction notée dans le brief (section 11). La skill `motion-video-hyperframes` déjà installée recouvre en partie la skill officielle `hyperframes` : à toi de dire laquelle `studio-video` doit lire en premier.
- Exemples de test gardés dans le dépôt : `studio/video/src/TestRendu.tsx` (Remotion) et `studio/video/exemples/test-hyperframes/` ; les rendus restent dans `.cache/` (hors Git).

**🔔 ACTION HUMAINE**
1. **Redémarre Claude Code** (`/exit` puis `claude`) : charge `studio-video`, `media-acquisition`, les skills et `/marketing`.
2. Écouter la voix Piper `fr_FR-siwis-medium` (fichier `studio/video/.cache/test-voix.wav`) et dire si elle suffit, ou s'il faudra ElevenLabs Starter (6 $ HT/mois) au lancement.
3. Valider après coup l'installation des outils gratuits de la liste (a) de T49 (point 1 de son ACTION HUMAINE).


### Suivi en direct
- T48 `fait` : `studio-video.md` et `media-acquisition.md` copiés dans `.claude/agents/` (remplacent les anciens), skills `motion-foundations` et `motion-video-hyperframes` dans `.claude/skills/`, `marketing.md` dans `.claude/commands/` (copies identiques, vérifiées par `cmp`/`diff`). `tests/scenarios/studio-video.md` existe (version mise à jour par toi). Créés : `studio/video/effets/`, `studio/video/.cache/`, `medias/voix/`, `medias/apercus/`, `medias/licences.md` (en-tête + tableau vide), `marketing/calendrier.md` (en-tête). `.gitignore` : `.cache`, `_vendor`, `node_modules` du studio vidéo, `*.wav`, `medias/brouillons/` (Git ne sait pas filtrer par taille : les MP4 de plus de 20 Mo vont dans `medias/brouillons/`). `coordination/a-installer/` vidé (`.gitkeep` gardé). **Agents non lancés** (règle permanente).
- T49 `fait` (veille-outils) : `outputs/2026-11-13-veille-outils-licences-studio-video.md` (à-valider). Remotion gratuit en commercial jusqu'à 3 personnes (sinon 25 $/siège/mois) ; HyperFrames Apache 2.0, local sans compte (partage et skills Pro via HeyGen) ; faster-whisper MIT (modèle Systran large-v3 MIT, autres tailles À VÉRIFIER) ; Piper archivé → OHF-Voice/piper1-gpl (GPL-3.0), seules voix FR commerciales : fr_FR-siwis-medium et fr_FR-mls-medium (CC BY 4.0, crédit obligatoire) ; ElevenLabs gratuit interdit en commercial, Starter 6 $ HT/mois (décision humaine). Leçon n° 13 ajoutée à `docs/retours-experience.md`.
- T50 `fait` : socle installé selon la recommandation (a) de T49, rien de payant, aucun compte. `studio/video/` : Remotion 4.0.543 + HyperFrames 0.9.41 (npm, versions figées), skills HyperFrames de base (`hyperframes`, `hyperframes-cli`, `hyperframes-registry`) dans `.claude/skills/` (pas `media-use` ni les skills Pro ; verrou `skills-lock.json`), télémétrie HyperFrames désactivée. Python : faster-whisper 1.2.1 + piper-tts 1.8.0 (`studio/video/requirements.txt` ; PyAV figé en 18.1.0, la 19 casse faster-whisper), voix `fr_FR-siwis-medium` dans `.cache/`. ffmpeg 9.0.2 déjà présent. **Rendus de test de 3 s OK** avec les deux moteurs (1080×1920, images regardées), voix Piper de 3,2 s générée puis transcrite mot à mot (modèle `tiny`, licence À VÉRIFIER, test seulement). Commandes : section 11 de `docs/studio/BRIEF-STUDIO.md`.
- T51 `fait` : vérificateur 0 erreur, commit et push.

## 2026-11-13 · Synchro n°11 : terminée (T43 à T47)

**Ordre suivi** : T43, T44, T45, T46, T47. **Commit poussé** : `9ee2584` (toute la synchro), plus un commit de correction : ce compte rendu et les statuts T46/T47 avaient été oubliés (une commande de clôture avait échoué). Vérificateur `py tools/verifier_livrables.py` : 0 erreur, 1 avertissement connu. `npm run build` : OK, 58 pages, 4 255 liens internes, 0 cassé.

**Rapports produits**
- `outputs/2026-11-13-developpeur-web-corrections-a1-a10.md` : A1-A10 corrigés point par point, collection Automates, script de liens `tools/verifier_liens.py` lancé en `postbuild`.
- `outputs/2026-11-13-conformite-qa-contre-audit-a1-a10.md` · **verdict CONFORME** : les 10 points sont corrigés (sources et `dist/`) ; A8 s'accorde avec les CGV art. 3 ; fiche automate conforme (« Rendus 3D de démonstration », prix indicatif, aucun « À VÉRIFIER » visible, plus de book nook ni de miniatures). Hors périmètre : `cgv.astro` l. 122 annonce un accusé de réception sans condition (à conditionner comme A1, couvert par B3) ; FAQ « kit de remplacement : c'est la garantie légale » des 8 fiches à reformuler (le consommateur choisit d'abord, L217-9), à valider par un juriste.
- Sections ajoutées : `outputs/2026-11-12-redacteur-catalogue-fiches-demo.md` (mise à jour synchro n°11), `outputs/2026-11-12-studio-visuel-rendus-demo.md` (section 8).

**Remarques pour toi (Cowork)**
- Collection « Miniatures » remplacée par « Automates » : choix de ma part, pour ne pas laisser une collection vide.
- Sujet de l'automate (voilier sur les vagues) choisi par studio-visuel ; la fiche garde `scene_representee: "À VÉRIFIER"` et ne décrit pas la scène.
- A7 : « un objet en bois » s'affiche sur À propos tant que la locomotive a `partie_mobile: "À VÉRIFIER"`.
- `coordination/a-installer/` vidé en T47 (7 copies identiques aux agents installés, vérifié par `cmp`).
- Synchro n°12 copiée dans `de-cowork.md` à la demande de l'humain (non exécutée).

**🔔 ACTION HUMAINE**
1. Valider (ou changer) : la collection « Automates » à la place de « Miniatures », et le sujet « voilier » de l'automate de démonstration.
2. Avant tout aperçu en ligne : protéger l'accès (Cloudflare Access ou mot de passe), point A10.
3. Toujours en attente (bloquant B1) : identité de l'EI, SIREN/RCS, adresse, email, téléphone, hébergeur, identifiants REP, médiateur, livraison et retours ; relecture juriste (dont la FAQ garantie légale et la phrase des CGV l. 122) et expert-comptable.

### Suivi en direct
- T43 `fait` : `knowledge/decisions.md` : bloc sécurité des démos = « Produit de démonstration, non vendu : il n'a pas de fabricant. » ; nouvelle section « Positionnement du catalogue » (boutique « maquettes mécaniques en bois », book nook retiré, remplacé par l'« Automate à manivelle »). `knowledge/catalogue-demo.md` : ligne 8 remplacée (Automate, Moyen, 8 h, 49,90 € indicatif repris du book nook), règle « mécanisme ou partie mobile » ajoutée. **Choix de ma part** : la collection « Miniatures » devenait vide, je l'ai remplacée par « Automates » (moulin à vent + automate) ; à changer si tu préfères autre chose.
- T44 (1/2) `fait` (redacteur-catalogue) : fiche `site/src/content/produits/automate-manivelle.md` (demo, ordre 80, moyen, 8 h, 49,90 € indicatif, `mecanisme: manivelle`, `partie_mobile: true`, `collections: [automates, idees-cadeaux]`, champ `scene_representee: "À VÉRIFIER"` : le sujet de la scène n'est défini nulle part). Fiche book nook supprimée (par moi, l'agent n'a pas d'outil de suppression). Section « Mise à jour 2026-11-13 » ajoutée à `outputs/2026-11-12-redacteur-catalogue-fiches-demo.md`. Le build échouera tant que developpeur-web n'a pas ajouté `automates` (T45).
- T44 (2/2) `fait` (studio-visuel) : scène `studio/scenes/automate-manivelle.js` (caisson ouvert, arbre à cames en laiton, 3 cames et 3 poussoirs calculés sur le profil réel des cames, manivelle à droite ; sujet choisi : voilier entre deux vagues, soleil découpé, inventé pour la démo). 6 vues dans `site/public/produits/automate-manivelle/` (1600 et 800 px, 497 Ko). Supprimés : images, scène et cache du book nook, fonction `standingBook` de `studio/lib/rigs.js`. Planche contact `outputs/planches/2026-11-12-studio-visuel-planche-contact.jpg` refaite, regardée par moi : sols propres, cames visibles en vue détail. Limites : cames vues par la tranche en vue face, vue dessus peu parlante. Rapport : section 8 de `outputs/2026-11-12-studio-visuel-rendus-demo.md`.
- T45 `fait` (developpeur-web) : collection `automates` à la place de `miniatures` partout (schéma, `catalogue.ts`, composants, scripts, pages ; moulin en `[mecanique, automates]`, nouvelle animation de carte d'accueil came/manivelle/poussoir). A1 à A10 corrigés (A1 : `retractation.en_ligne_active: false` dans `boutique.yaml` ; A8 : bloc Sécurité = phrase exacte de T43, 3 autres endroits selon l'audit ; A10 : `site/public/_headers`). Nouveau `tools/verifier_liens.py`, lancé en `postbuild` par `site/outils/verifier-liens.mjs` (essaie `py`, `python3`, `python`), doc dans `docs/site-technique.md`. Build revérifié par moi : 58 pages, 4 255 liens internes, 0 cassé. A7 : « un objet en bois » s'affiche car la locomotive a `partie_mobile: "À VÉRIFIER"`. Rapport : `outputs/2026-11-13-developpeur-web-corrections-a1-a10.md`.
- T46 `fait` (conformite-qa) : contre-audit **CONFORME**, `outputs/2026-11-13-conformite-qa-contre-audit-a1-a10.md`.
- T47 `fait` : `coordination/a-installer/` vidé, vérificateur 0 erreur, commit `9ee2584` poussé.

## 2026-11-13 · Synchros n°9 + n°10 : terminées (T37 à T42)

**Ordre suivi** : T37, T38, T38b, T39, T41, T40, T42 (changements demandés par l'humain). **Commits poussés** : `d44a5f4` (T37), `4f4f641` (T38), `150c430` (T38b), `4995358` (T41 + rapport développeur), plus le commit de fin (audit, compte rendu, `docs/qg/`, `tests/scenarios/createur-contenu.md` arrivés de ton côté pendant la synchro).
Vérificateur `py tools/verifier_livrables.py` : 0 erreur, 1 avertissement connu.

**Rapport T39 · conformite-qa audit du site** : `outputs/2026-11-13-conformite-qa-audit-site.md` · **verdict : À CORRIGER** (4 bloquants pour l'ouverture, 10 corrections avant aperçu protégé A1-A10, 13 avant ouverture, 26 points conformes)
1. Mode démo bien verrouillé (V11/V15 bloquent le build, achat désactivé y compris mobile, pas d'`offers`, ni « À VÉRIFIER », ni ressource externe, ni stockage, ni cookie).
2. Formulaire R221-1 comparé mot pour mot à Légifrance : identique sauf le titre et « Je/nous » (A2) ; « Renoncer au contrat ici » conforme à D221-5, en un clic partout.
3. Avant aperçu : textes qui promettent un « accusé de réception immédiat » alors que le formulaire est désactivé (A1) ; « Prix indicatif de démonstration » absent des fourchettes des collections et de l'accueil (A3) ; masquer les `[À VALIDER]` des héros de collection sur les démos (A4) ; mention « Rendus 3D de démonstration » absente de la galerie (A5) ; À propos : « comme pour tout achat en ligne » (N31) et « un objet qui bouge », faux pour le book nook (A6, A7).
4. Bloquants pour l'ouverture : B1 données boutique `[À VALIDER]` ; B2 encadré D.211-2 à recopier dans les CGV ; B3 rétractation en ligne à rendre fonctionnelle avec accusé horodaté (L221-21, D221-5, en vigueur depuis le 19/06/2026) ; B4 politique de confidentialité incomplète (bases légales, durées, prestataires, transferts hors UE). CGV aussi : archivage 10 ans (D213-2), choix réparation/remplacement sous 30 jours (L217-9/10), colis multiples (L221-18) ; brancher V6 et V10 dans le build.
5. Limites : agent sans outil shell (ni build ni vérificateur lancés par lui ; je l'ai lancé ensuite : 0 erreur) ; contrastes et clavier non mesurés ; lancé avec l'ancienne version de l'agent (sans `Edit`), sur accord de l'humain.

**Remarques pour toi (Cowork)**
- Le texte du bloc Sécurité des démos de `decisions.md` (« affichées dès la mise en vente de ce produit ») contredit les CGV (« jamais vendus ») : l'audit propose une formulation en A8, `knowledge/` non modifié.
- `tests/scenarios/createur-contenu.md` est apparu pendant la synchro : commité, l'avertissement du vérificateur a disparu.
- `python` sur ce PC = raccourci Microsoft Store ; utiliser `py` dans les demandes tant que l'humain n'a pas changé ce réglage.
- Il n'y a pas de script de vérification des liens dans le dépôt (scripts temporaires hors dépôt, d'où 4 242 vs 3 937 liens selon le script) : à ajouter dans `site/` ou `tools/` si tu veux un contrôle reproductible.
- `coordination/a-installer/` est laissé en place (copies installées) : à vider si tu le souhaites.

**🔔 ACTION HUMAINE**
1. **Redémarre Claude Code** (`/exit` puis `claude`) : charge `createur-contenu`, les 7 nouveaux agents, et `Edit` pour `architecte-web` et `conformite-qa`.
2. Décider : formulation du bloc Sécurité des démos (A8 de l'audit) ; garder ou non « Maquettes mécaniques en bois » pour toute la boutique alors que le book nook n'a pas de mécanisme (B15).
3. Facultatif : désactiver l'alias `python.exe` (Paramètres > Applications > Paramètres avancés des applications > Alias d'exécution d'application) pour que `python tools/verifier_livrables.py` marche comme écrit dans `CLAUDE.md`.
4. Toujours en attente (bloquant B1) : identité de l'EI, SIREN/RCS, adresse, email, téléphone, hébergeur, identifiants REP, médiateur, frais et délais de livraison, transporteur, frais de retour ; relecture juriste (dépréciation, juridiction, bouton « Payer » Stripe L221-14, durées RGPD) et expert-comptable (TVA, facturation).

### Suivi en direct des synchros n°9 et n°10

Copiées dans `de-cowork.md` avec les changements de l'humain (T37 partiel, T38 élargi, T38b + 2 règles `CLAUDE.md`, T39 précédé d'un rapport `developpeur-web`, T41 avant T40).
- T37 `fait` : `createur-contenu.md` copié dans `.claude/agents/` (identique, vérifié par `cmp`). Supprimés de `prochaine-synchro/` : `createur-contenu.md`, `de-cowork-synchro-9.md`, `de-cowork-synchro-10.md` (tous utilisés) ; dossier gardé avec un `.gitkeep`. **Non lancé.** Il n'existe pas de `tests/scenarios/createur-contenu.md` (règle « un agent = au moins un scénario » de `CLAUDE.md`) : à écrire.
- T38 `fait` (studio-visuel) : taches au sol = 96 ombres dures d'une lumière « dôme » aléatoire → ombre du sol précalculée en une seule fois (`bakeGroundShadow` dans `studio/lib/rigs.js`), fond uni + une ombre douce sur toutes les vues (dessus de la boîte à musique et du planétaire compris). Engrenages : signe du rapport inversé dans `meshPhase` (`studio/lib/parts.js`), corrigé pour l'Initiation et aussi horloge, planétaire, boîte à musique ; nouveau `studio/verifier-engrenages.js` (0 chevauchement, ~0,05 mm de jeu). `comparateur-planches` recomposé (planches de l'horloge debout au mur à l'emplacement de l'horloge, même caméra que `comparateur-monte`). `render.js` détecte les pertes de contexte WebGL (images vides refaites). 60 vues + 3 ambiances régénérées, mêmes noms et tailles ; planche contact refaite, que j'ai regardée : sols propres. Rapport : section 7 de `outputs/2026-11-12-studio-visuel-rendus-demo.md`. Limites : ombre de l'horloge sur le mur très discrète ; tiers haut de `comparateur-planches` en portrait = mur vide ; rendu complet ≈ 30 min sur ce PC. Le shell paraissait bloqué : c'était le rendu, lent mais actif ; j'ai arrêté deux serveurs devenus inutiles (`npm run dev` 4321, aperçu 4329).
- T38b `fait` : `tools/verifier_livrables.py`, `docs/retours-experience.md`, `docs/templates/agent-template.md` étaient déjà commités (commit de fin de synchro n°8, `a061aa5`). `CLAUDE.md` : 2 règles ajoutées après « Gros livrables » (lire `docs/retours-experience.md` ; vérificateur à 0 erreur avant chaque commit). `/cowork` : étape « Lance `python tools/verifier_livrables.py`… » ajoutée avant le commit. `Edit` ajouté à `architecte-web` et `conformite-qa` (effectif au prochain redémarrage). Vérificateur : 0 erreur, 1 avertissement connu (statut « brouillon » du premier rapport analyste-marche, laissé tel quel). **Attention** : sur ce PC, `python` ouvre le raccourci du Microsoft Store ; seul `py` fonctionne (Python 3.14.7). Les agents qui tapent `python …` échoueront (studio-visuel n'a pas pu le lancer).
- T39 (1/2) : rapport `developpeur-web` écrit, `outputs/2026-11-13-developpeur-web-site-etapes-1-3.md` (~15 Ko) : pile et commandes, 58 routes, mécanismes de conformité avec fichiers et lignes, manques (vue 3D, vue éclatée SVG, `/merci/`, formulaires non branchés, R221-1 de mémoire, D.211-2 absent, `site` vide), [À VALIDER] (CGV 36, mentions et confidentialité 19 chacune), priorités pour l'audit. Build OK après T38, 0 lien cassé. Il signale 2 points : héros de `/collections/*` qui affichent `[À VALIDER : nombre de pièces]` sur des démos (contraire à `decisions.md`) et absence de la formule « Rendus 3D de démonstration » (leçon n° 11) sur les fiches. Audit `conformite-qa` lancé avec la version chargée de l'agent (sans `Edit`), sur accord de l'humain (règle permanente : agent modifié en T38b).
- T41 `fait` (exécutée avant la fin de T39, pendant l'audit, sans fichier commun) : 7 agents copiés dans `.claude/agents/` (`crm-email`, `gestion-commandes`, `media-acquisition`, `pilotage-finance`, `service-client`, `studio-video`, `veille-outils`), copies identiques (`cmp`), scénarios tous présents. Ligne vers `docs/organisation.md` ajoutée dans `docs/architecture.md`. Vérificateur : 0 erreur. **Non lancés.** `coordination/a-installer/` laissé en place (T41 ne demande pas de le supprimer).

## 2026-11-13 07:35 · Synchro n°8 : terminée (T31 à T36)

### T36 · Compte rendu final

**Commits poussés** : `5e8fa87` (T31), `36bb2e1` (T32), `22b3658` (T33), `6a96e14` (T34), `8f26527` (T35), plus les commits `chore(coordination)` de suivi.
**Aucun rapport `outputs/` produit par `developpeur-web`** pour T33-T35 (comptes rendus brefs demandés) ; à prévoir avant l'audit `conformite-qa` si tu le souhaites. `conformite-qa` **non lancé** sur le site, comme demandé.

**Ce qui marche** (vérifié par moi après chaque tâche : `npm run build` OK, script de liens sur `site/dist/`)
- 58 pages statiques, 4 242 liens internes, 0 erreur ; aucun « À VÉRIFIER » visible dans `dist/`.
- Accueil 11 sections (GSAP local, ~55 Ko JS compressé, budget 70 Ko) : héros engrenages, récit épinglé, comparateur (doigt, souris, clavier), vue éclatée, 4 cartes collections animées, maquettes du moment (rail épinglé ≥ 1024×680), questionnaire, échelle de difficulté, Offrir (texte Noël générique de `decisions.md`, aucune date), atelier + lettre **désactivée** « Bientôt », FAQ. Bouton « Mettre en pause les animations ». Versions `reduced-motion` (GSAP jamais chargé) et sans JS contrôlées par captures Playwright 375/1280 px par l'agent.
- « Trouver ma maquette » : 3 questions, 27 pages statiques de repli `noindex`, sans cookie ni stockage ; 9 cas de recette §4.1.7 OK. `/atelier/` créé.
- Catalogue, 3 pages de niveau, 5 collections, 10 fiches (galerie 6 vues, zoom, bandeau démo, achat désactivé, pas d'`Offer`).
- Pages légales et d'aide (T33), 404.
- `decisions.md` appliqué en T35 : sur une fiche démo, lignes et FAQ « À VÉRIFIER » masquées, bloc sécurité « Informations du fabricant affichées dès la mise en vente de ce produit. » ; un produit `demo: false` avec « À VÉRIFIER » **fait échouer le build** (testé, message listant les champs).

**Ce qui manque / écarts**
- **Vue 3D au clic** (décidée dans `decisions.md`) : pas faite. Seul un emplacement `Vue3D.astro` existe (affiché si `modele_3d` renseigné, aucun ne l'est) ; Three.js pas en dépendance du site, pas de modèles exportés depuis `studio/`.
- Vue éclatée : SVG « Illustration de principe » (les calques WebP et `vue-eclatee.json` de la spec n'existent pas).
- Accroches calculées produit par produit (audit N2) : héros « Des pièces de bois prédécoupées… » au lieu de « découpés au laser » ; compteur de pièces masqué (`nombre_pieces` inconnu) ; « Livraison suivie » nulle part.
- Fiche : zoom en fondu (pas depuis l'image), un toucher = ×2 (pas double-toucher), pas d'aperçu au survol des vignettes, pas d'animation de réorganisation des filtres, barre non masquée au défilement sur mobile, pas d'image de partage, `site` vide dans `astro.config.mjs`.
- `/atelier/` : héros avec les planches du comparateur, faute du rendu « mains et planches ». Textes des 3 conseils de l'atelier en `[À VALIDER]` (à faire rédiger par `redacteur-catalogue`).
- Textes rédigés par les agents à relire : intro d'« Idées cadeaux », 2 raccourcis de la page Contact (« Une question avant l'achat », « Ma commande »).
- Formulaire type de rétractation écrit de mémoire (marqué « à contrôler mot pour mot » avec l'annexe à R221-1) ; encadré D.211-2 non reproduit (lien Légifrance) ; PDF des CGV à produire.
- `docs/site-technique.md` complété par l'agent (dossiers, commandes) par-dessus tes modifications non commitées ; tout est commité ensemble dans le commit de fin.

**Voir le site sur le PC**
```
cd site
npm install
npm run dev
```
puis ouvrir http://localhost:4321/ (adresse affichée par Astro). Version construite comme en production : `npm run build` puis `npm run preview` (http://localhost:4321/ aussi).

**🔔 ACTION HUMAINE**
1. Regarder le site en local (commande ci-dessus) et dire à Cowork ce qui plaît ou non, surtout l'accueil.
2. Décider : vue 3D au clic sur la fiche (à construire : export des modèles depuis `studio/` + Three.js local) ou abandon pour le lancement.
3. Toujours en attente (rien n'est publiable sans) : identité de l'EI, SIREN/RCS, adresse, email, téléphone, médiateur, identifiants REP, hébergeur, frais et délais de livraison, transporteur, frais de retour, service d'emails pour la lettre, Cloudflare Web Analytics, Apple Pay / Google Pay / Link, politique « pièce cassée au montage ».
4. Faire relire par un juriste les points listés par l'audit (n° 20, 21, 23, 26) et les clauses marquées « avis d'un professionnel » (assemblage commencé, juridiction, durées de conservation, transferts Stripe/Cloudflare).

### Suivi en direct de la synchro n°8

- T31 `fait` (commit `5e8fa87`) : `redacteur-catalogue` a écrit les 10 fiches (`site/src/content/produits/`, `demo: true`, sans lien de paiement) + rapport `outputs/2026-11-12-redacteur-catalogue-fiches-demo.md`. Format du §5.4 de la spec v2 (pas celui de `site-technique.md`) ; champ `accroche` ajouté ; beaucoup de `À VÉRIFIER` dans des champs numériques/booléens : le schéma de `developpeur-web` doit les accepter pour les démos.
- T32 `fait` : `studio/` (Three.js + Playwright + sharp, `npm run render`) a produit 60 vues produits (6 × 10) + 3 ambiances (`bureau-nuit`, `comparateur-planches`/`-monte`), WebP 1600 et 800 px, 126 fichiers, 5,7 Mo dans `site/public/`. Corrigé en fin de tâche : vue `boite` de la boîte à musique (manquait), `detail` du moulin (gros plan flou sans sujet → transmission sous le socle), cadrage du comparateur (planches hors champ). Planche contact : `outputs/planches/2026-11-12-studio-visuel-planche-contact.jpg` ; rapport `outputs/2026-11-12-studio-visuel-rendus-demo.md`. Rendus de démonstration seulement, à ne jamais utiliser pour vendre un produit réel.
- T33 `fait` (commit `22b3658`) : le PC s'est éteint pendant la tâche ; reprise sans repartir de zéro (`developpeur-web` relancé pour compléter). `site/` Astro 6 + Tailwind 4 + Lucide + GSAP, polices auto-hébergées, thème, composants `ui/` et `mise-en-page/`, 11 pages : accueil provisoire, FAQ, livraison et retours, mentions légales, CGV (17 articles + annexe formulaire type), confidentialité, cookies, contact, à propos, renoncer au contrat (formulaire **désactivé**, pas d'API), 404. `npm run build` OK. Nombreux `[À VALIDER]` (identité, SIREN, hébergeur, REP, médiateur, frais, transporteur, textes officiels D.211-2 et R221-1 à recopier mot pour mot). Point ouvert : le drapeau `existe` de `lib/navigation.ts` n'est pas utilisé par la navigation, donc liens morts vers `/maquettes/`, `/collections/…`, `/atelier/`, `/trouver-ma-maquette/` tant que T34/T35 ne les créent pas.
- T34 `fait` (commit `6a96e14`) : 30 pages, build OK, 2 231 liens internes vérifiés, 0 erreur. `/maquettes/` (filtres en liens, sans JS), `/maquettes/niveau/facile|moyen|expert/`, 5 collections (`mecanique`, `vehicules`, `miniatures`, `pour-debuter`, `idees-cadeaux`) avec héros animé + grille filtrable (`?niveau=`, sans stockage) + bouton pause des animations, 10 fiches `/maquettes/<slug>/` (galerie 6 vues srcset 800/1600, zoom plein écran clavier/doigt, lien vers l'image 1600 sans JS, bandeau démo, achat désactivé y compris barre mobile, pas d'`Offer` en JSON-LD, « Prix indicatif de démonstration »). La navigation utilise enfin `existe` (masqué en barre, « (bientôt) » en pied de page). Vue 3D : emplacement `[À VALIDER]` seulement, Three.js non installé. **Écart avec `knowledge/decisions.md`** : les valeurs « À VÉRIFIER » des fiches sont affichées `[À VALIDER : …]` au lieu d'être masquées (bascule en un seul endroit : `components/produit/Donnee.astro`). Écarts à la spec : zoom en fondu (pas depuis l'image), pas d'aperçu au survol des vignettes, pas d'animation de réorganisation du filtre, pas d'image de partage, `site` non renseigné dans `astro.config.mjs` (URL relatives). Phrase d'intro d'« Idées cadeaux » rédigée par l'agent. L'agent a aussi ajouté les nouveaux dossiers dans `docs/site-technique.md` (fichier déjà modifié par toi, non commité, je le laisse pour le commit de fin).
- T35 `fait` (commit `8f26527`) : accueil 11 sections + questionnaire (27 pages de repli) + `/atelier/` ; 58 pages, 4 242 liens, 0 erreur. Correction `decisions.md` appliquée (valeurs « À VÉRIFIER » masquées sur les démos, build bloqué si `demo: false`). Détails dans le compte rendu final ci-dessus.
- T36 `fait` : compte rendu final ci-dessus.

## 2026-11-12 18:43 · Synchro n°7 : identité Laiton, conception v2, audit

**Tâches faites** : T26 à T30 (toutes `fait`).
- T26 : `redacteur-catalogue` et `studio-visuel` copiés dans `.claude/agents/` (copies identiques vérifiées par `cmp`), `a-installer/` supprimé. **Non lancés** (règle permanente).
- T27 : `knowledge/marque.md`, `knowledge/catalogue-demo.md`, `knowledge/direction-design.md` v2, `docs/site-technique.md`, `docs/reference/prototype-accueil.html`, les 2 scénarios de test commités tels quels. La ligne « Gros livrables » ajoutée à `CLAUDE.md` (sans doute par toi) est commitée aussi.
- T28 : `architecte-web` lancé avec la demande exacte. 1er essai bloqué au moment d'écrire (aucun fichier), relancé avec la consigne d'écrire en plusieurs fois. L'agent n'a pas l'outil Edit (seulement Write) : **v2 livrée en deux fichiers** qui se renvoient l'un à l'autre.
- T29 : `conformite-qa` en mode audit sur les deux fichiers. Même blocage (lecture des ~110 Ko), relancé avec lecture par tranches ; rapport aussi en deux fichiers. Fichiers audités non modifiés (horodatages 14:27 / 14:30, audit à 18:38-18:41).
- T30 : commit `0295921` feat: agents redacteur-catalogue et studio-visuel, conception v2, identité Laiton, poussé.

**Rapport 1 · architecte-web v2** : `outputs/2026-11-12-architecte-web-conception-boutique-v2.md` (§1-4) + `…-v2-partie-2.md` (§5-10)
1. Piste C « Laiton » seule, version cinématique ; contrastes recalculés : le laiton `#C8A15A` (2,3:1) est interdit comme texte sur fond clair.
2. Accueil en 11 sections, chaque animation spécifiée (contenu, déclencheur, durée, mobile, sans animation, sans JS) ; questionnaire sans cookie ni stockage, avec 27 pages statiques en repli.
3. Fiche produit : galerie 6 vues + zoom, vue 3D chargée au clic seulement, bandeau « Produit de démonstration » avec achat désactivé ; pages de collection avec héros animé puis grille claire filtrable.
4. Les 21 corrections de l'audit v1 sont tracées une par une (§6.0 partie 2).
5. Panier moyen : livraison fixe par commande, articles facultatifs Stripe jamais pré-ajoutés, lots au prix réel sans prix barré ; seuil de livraison offerte **impossible avec les Payment Links** (phase 2), formule seuil ≥ (15,30 + L + E + R) ÷ 0,397. Propose (sans appliquer) des modifs de `site-technique.md`, `marque.md`, `direction-design.md` (GSAP/Three.js servis localement, retirer Lenis, gris plus foncé).

**Sections animées de l'accueil** : 1. héros engrenages (parallaxe au pointeur) · 2. récit épinglé « Ouvrir, Assembler, Tourner » · 3. « De la planche à l'objet » (comparateur glissant, doigt et clavier) · 4. « Dans la boîte » (vue éclatée qui se rassemble) · 5. Collections (4 grandes cartes animées au survol) · 6. Les maquettes du moment · 7. « Trouver ma maquette » (3 questions) · 8. échelle de difficulté · 9. Offrir (date limite de Noël fixe, jamais de compte à rebours) · 10. L'atelier + lettre d'information à double confirmation · 11. FAQ et réassurance.

**Rapport 2 · conformite-qa audit v2** : `outputs/2026-11-12-conformite-qa-audit-conception-boutique-v2.md` + `…-v2-partie-2.md` · **verdict : À CORRIGER** (aucun point bloquant)
1. Les 21 corrections v1 sont bien intégrées (vérifiées dans le texte), aucune régression.
2. Nouveautés v2 : 11 conformes, 20 à corriger dont 5 prioritaires : accroches globales fausses pour certains produits (N2) ; date limite de Noël sur site statique + risque « condition essentielle » (N5) ; règle V15 mode démo (rien en vente si `mode_demo`) (N17) ; légende de la 3D « indicatif » insuffisante, bannir « non contractuel » (N19) ; articles facultatifs Stripe sans infos GPSR (N24).
3. Panier moyen : recommande **aucun article facultatif au lancement** ; lots : « achetées séparément » = somme des prix les plus bas sur 30 jours (règle V14 bis).
4. Points pro : n° 24, 28, 30 et l'article 9 des CGV tranchés par texte officiel ; restent pour un juriste n° 20, 21, 23, 26, pour un expert-comptable n° 29.
5. Limite : quota de recherche web atteint, plusieurs sources marquées « à reconfirmer » (CNIL, LCEN, L121-2, L221-23/24, directive 2024/825).

**Remarques pour toi (Cowork)**
- Les agents `architecte-web` et `conformite-qa` n'ont pas l'outil `Edit` : la règle « Gros livrables » de `CLAUDE.md` ne peut pas s'appliquer par ajout, d'où les livrables en deux fichiers. À corriger dans leur frontmatter si tu veux un fichier unique (modifier un agent = redémarrage).
- Deux blocages de 10 min cette synchro (écriture d'un très gros fichier, lecture de ~110 Ko d'un coup) : prévoir dans les demandes « lire par tranches ».

**🔔 ACTION HUMAINE**
1. **Redémarre Claude Code** (`/exit` puis `claude`) pour charger `redacteur-catalogue` et `studio-visuel` avant la synchro n°8.
2. Décisions de la v2 (section 9, partie 2) : mode démonstration (aperçu protégé par accès, produits démo retirés à l'ouverture) ; vue 3D sur la fiche (écart à `direction-design.md`) ; rangement du Moulin à vent et contenu « Idées cadeaux » ; lettre d'information dès l'ouverture ou non ; articles facultatifs et lots (l'audit recommande aucun article facultatif au lancement).
3. Toujours en attente depuis la synchro n°6 : Cloudflare Web Analytics, Apple Pay / Google Pay / Link, politique « pièce cassée au montage », et les valeurs `À VÉRIFIER` de `politiques.md` (identité, SIREN, médiateur, IDU, frais et délais de livraison, frais de retour). Rien n'est publiable sans elles.
4. Points pour un juriste (n° 20, 21, 23, 26) et un expert-comptable (n° 29) : à garder en liste pour une consultation.

## 2026-11-12 11:53 · Synchro n°6 : conception de la boutique

**Tâches faites** : T23 à T25 (toutes `fait`).
- T23 : `architecte-web` lancé avec la demande exacte du test. Premier lancement arrêté à la demande de l'humain (aucun fichier produit), puis relancé ; rapport complet (YAML, statut `à-valider`, 10 sections).
- T24 : `conformite-qa` lancé en mode audit sur ce rapport. Livrable audité non modifié (horodatage antérieur à l'audit).
- T25 : commit `7b5e14b` docs(outputs): conception de la boutique + audit conformité, poussé. `developpeur-web` **non lancé**.

**Fichiers modifiés** : `outputs/2026-11-12-architecte-web-conception-boutique.md` (nouveau), `outputs/2026-11-12-conformite-qa-audit-conception-boutique.md` (nouveau), `coordination/`. Également commités tels quels dans le commit de synchro : `knowledge/direction-design.md` (nouveau) et `docs/site-technique.md` (ligne « Style : Tailwind + shadcn/ui + Lucide »), apparus à 11:31 pendant le premier lancement : je suppose qu'ils viennent de toi, **confirme-le** (sinon ils viennent de l'agent arrêté et sont à revoir).

**Rapport 1 · architecte-web** : `outputs/2026-11-12-architecte-web-conception-boutique.md`
1. Parcours mobile en 12 étapes : vidéo → lien en bio → fiche produit → « Acheter » → Stripe Payment Link → `/merci/` → email avec CGV en PDF. Ni compte, ni panier, ni pop-up.
2. 15 pages, une action principale chacune ; réglages Stripe détaillés (France seule, case CGV, quantité 1 à 3, pas de codes promo).
3. Fiche produit en 18 blocs, bloc GPSR toujours ouvert, badge 14+, aucun bloc d'avis ; 10 règles qui bloquent la construction du site si une fiche est non conforme.
4. Bouton « Renoncer au contrat ici » selon D221-5 : lien en pied de page, formulaire sans JS, fonction Cloudflare qui horodate et envoie l'accusé de réception.
5. Aucun cookie non essentiel au lancement (bandeau spécifié mais inactif) ; 12 indicateurs + convention UTM. Propose (sans l'appliquer) une mise à jour de `docs/site-technique.md`.

**Les 3 pistes d'identité visuelle** (contrastes WCAG AA calculés, à revérifier sur le rendu réel)
| Piste | Couleurs | Ambiance | Police |
|---|---|---|---|
| **A · Atelier** | fond blanc cassé chaud `#FAF8F5`, accent **noyer** `#8B4513`, texte `#1C1917` | établi en bois, lumière de fin de journée, kraft : chaleureuse, idée cadeau | Inter |
| **B · Sapin** | fond `#F7F7F5`, accent **vert sapin** `#1E5B3F`, texte `#18181B` | bois clair et feuillage, sobriété scandinave : moderne, apaisante | Geist |
| **C · Laiton** | fond `#FBFAF7`, accent **bleu nuit** `#1E3A5F` + laiton foncé `#8A6A3A` pour les icônes | horlogerie, engrenages, cabinet de curiosités : premium, mixte | Manrope + Inter |

Recommandation de l'agent : **C** si l'offre met en avant les maquettes mécaniques et l'angle cadeau adulte, **A** si elle penche vers les miniatures déco ; B est la plus neutre. Idées de noms proposées par piste, **non vérifiées** (INPI, domaine, réseaux).

**Rapport 2 · conformite-qa (audit)** : `outputs/2026-11-12-conformite-qa-audit-conception-boutique.md` · **verdict : À CORRIGER** (aucun point bloquant dans la conception ; 14 conformes, 21 à corriger dont 5 prioritaires)
1. Conformes : toutes les pages obligatoires, bouton de rétractation D221-5, GPSR + 14+, aucune technique trompeuse, prix barrés sur 30 jours.
2. Prioritaires : champ anti-robots de la rétractation (ne jamais afficher un faux succès sans enregistrer) ; droits légaux présentés comme avantages (« Retours 14 jours », L121-4 10°) ; CGV : langue du contrat + archivage (> 120 € possible) ; encadré garanties à recopier mot pour mot (annexe D. 211-2) ; aucune expédition avant l'envoi de l'email avec CGV.
3. Points 13 à 19 : bouton Stripe « Payer » probablement conforme (à capturer en français, Apple/Google Pay/Link à vérifier) ; PDF par email = support durable ; Cloudflare Web Analytics **non validé** en l'état (recommande de ne pas mettre de script au lancement) ; « TVA non applicable, art. 293 B du CGI » conforme sur le site.
4. Limites : plusieurs articles lus via sources secondaires (« à reconfirmer ») ; durée d'archivage de 10 ans `À VÉRIFIER`.
5. Rien n'est publiable tant que les valeurs vides (identité, SIREN, médiateur, IDU, frais de retour…) ne sont pas remplies.

**Grille de test** `tests/scenarios/architecte-web.md` : non cochée (à faire par toi ou l'humain).

**🔔 ACTION HUMAINE**
1. **Choisir la piste d'identité visuelle** (A Atelier, B Sapin, C Laiton) et le **nom de la boutique** : bloque `developpeur-web`.
2. Trancher les décisions de l'audit : Cloudflare Web Analytics (oui / non au lancement), paiements Apple Pay / Google Pay / Link (garder ou non), politique « pièce cassée pendant le montage ».
3. Répondre aux questions de conception (section 9 du rapport architecte-web) : vouvoiement, contenu de la page « À propos », réseau principal, quantité max (3 proposé), service d'envoi d'emails (implique un nom de domaine dès le lancement).
4. Fournir les valeurs de `politiques.md` encore `À VÉRIFIER` : frais et délais de livraison, frais de retour, identité légale, SIREN, médiateur, IDU.
5. Confirmer que `knowledge/direction-design.md` et la modification de `docs/site-technique.md` viennent bien de Cowork.

## 2026-11-12 11:27 · Synchro n°5 (compte rendu oublié)

**Tâches faites** : installation de `architecte-web` et `developpeur-web` (+ tests), plateforme « site maison Astro + Cloudflare + Stripe » actée (`docs/site-technique.md`, `architecture.md`, `contraintes.md`, `ROADMAP.md`). Commit `786b76f` feat(agent): architecte-web + developpeur-web, plateforme site maison, poussé ; aucun agent lancé (règle permanente).

## 2026-11-12 11:26 · Synchro n°4

**Tâches faites** : T16 à T18 (toutes `fait`). Aucun agent lancé (règle permanente).
- T16 : v1.5 copiée vers `.claude/agents/sourcing-produits.md` (copie identique vérifiée par `cmp`), `a-installer/` supprimé. Vérifié par diff avec la v1.4 : mes points 1 à 6 sont corrigés, objectif de 15 € ajouté (plancher 10 € inchangé, classement par marge nette).
- T17 : `knowledge/politiques.md`, `prix-et-marges.md`, `contraintes.md` et `tests/scenarios/sourcing-produits.md` commités tels quels ; `knowledge/README.md` : `politiques.md` marqué « **Proposé, à valider** ».
- T18 : commit `62f2255` fix(agent): sourcing-produits v1.5 + politiques.md + objectif de marge 15 €, poussé.

**Fichiers modifiés** : `.claude/agents/sourcing-produits.md`, `knowledge/politiques.md` (nouveau), `knowledge/prix-et-marges.md`, `knowledge/contraintes.md`, `knowledge/README.md`, `tests/scenarios/sourcing-produits.md`, `coordination/`.

**Rapports d'agent** : aucun.

**Restes mineurs repérés (rien de bloquant)** :
1. `tests/scenarios/sourcing-produits.md`, ligne 27 : « Aucun produit avec électronique sans CE vérifié » contredit la nouvelle case « Aucun produit retenu avec électronique » (ligne 40) : supprimer l'ancienne.
2. `knowledge/contraintes.md`, ligne Approvisionnement : « 3 € + 2 € … **par colis** hors UE » alors que l'agent et `prix-et-marges.md` disent « par catégorie d'article ». C'est un fichier que seul l'humain modifie : à lui faire valider.
3. La case « Utilité » du test ne vérifie plus la proposition de `prix-et-marges.md` : cohérent avec la v1.5 (fichier existant).

**🔔 ACTION HUMAINE**
1. **Redémarre Claude Code** (`/exit` puis `claude`) pour charger `sourcing-produits` v1.5.
2. Valide (ou corrige) `knowledge/politiques.md` et `knowledge/prix-et-marges.md`, et confirme la correction « par catégorie d'article » dans `contraintes.md`.
3. Message à Robotime : la v3 du sourcing attend leur réponse ; l'envoi reste à faire par toi si ce n'est pas déjà fait.

## 2026-11-12 11:22 · Synchro n°3

**Tâches faites** : T11 à T15 (toutes `fait`). Aucun agent lancé (T15 et règle permanente notée).
- T11 : `coordination/a-installer/sourcing-produits.md` copié vers `.claude/agents/sourcing-produits.md` (copie identique vérifiée par `cmp`), dossier `a-installer/` supprimé. Le calcul de l'option B (stock léger) est bien conservé.
- T12 : `knowledge/prix-et-marges.md` commité tel quel ; ligne mise à jour dans `knowledge/README.md` : « **Proposé, à valider** (proposition de Cowork du 2026-11-12) ».
- T13 : `ROADMAP.md` phase 1 : 2 lignes ajoutées.
- T14 : commit `2cbe74e` fix(agent): sourcing-produits v1.4 + proposition prix-et-marges, poussé.

**Fichiers modifiés** : `.claude/agents/sourcing-produits.md`, `knowledge/prix-et-marges.md` (nouveau), `knowledge/README.md`, `ROADMAP.md`, `coordination/`.

**Rapports d'agent** : aucun.

**Incohérences repérées dans la v1.4 (installée telle quelle, à corriger par une prochaine tâche)** :
1. Section 2 : l'ancienne ligne « Électronique sans CE vérifiable » est restée à côté de la nouvelle « Électronique » (éliminatoire sans exception). Elles se contredisent ; l'interdit final tranche, mais autant supprimer l'ancienne.
2. Section 2 : deux critères de copie (« Copie ou contrefaçon » et « Copie ») : à fusionner.
3. Section 1, point 4 : « 5 € de taxes **par colis** » alors que la section 3 dit « par catégorie d'article ».
4. Section 5 : « Marquage CE si électronique » n'a plus d'objet.
5. Section 1 point 2 et titre de la section 4 parlent encore d'un « budget de 0 € », alors que `contraintes.md` prévoit 150 à 500 € au lancement (dont échantillons).
6. « Avant d'agir » point 3 et section 7 du rapport (« proposer `prix-et-marges.md` ») : maintenant que le fichier existe, préciser « proposer des modifications ».
7. `tests/scenarios/sourcing-produits.md` n'a pas de cases pour les nouveaux éliminatoires (électronique, âge 14+ prouvé, canal officiel, cotisations dans la marge).
8. `knowledge/politiques.md` n'existe pas encore : la case ROADMAP « Valider … politiques.md » suppose de le créer à partir de la section 5 du dossier conformite-qa.

**🔔 ACTION HUMAINE**
1. **Redémarre Claude Code** (`/exit` puis `claude`) pour charger `sourcing-produits` v1.4.
2. Relis et valide (ou corrige) `knowledge/prix-et-marges.md` : surtout le taux de cotisations (12,3 % ou 13,3 % selon versement libératoire) et la mention TVA.
3. La v3 du sourcing attend la réponse de Robotime : si le brouillon A corrigé n'est pas encore envoyé, c'est à toi de l'envoyer.

## 2026-11-12 11:15 · Synchro n°2

**Tâches faites** : T5 à T10 (toutes `fait`).
- T5 : `coordination/a-installer/conformite-qa.md` copié vers `.claude/agents/conformite-qa.md` (copie identique vérifiée), dossier `a-installer/` supprimé.
- T6 : `knowledge/niche.md` (tes modifications) et `tests/scenarios/conformite-qa.md` commités tels quels ; `ROADMAP.md` phase 2 : `conformite-qa` coché « + test (à lancer et valider) ».
- T7 : commit `7f2c968` feat(agent): conformite-qa + décisions marques et électronique, poussé.
- T8 : test 1 lancé avec la demande exacte. ⚠️ **Exécuté par l'agent généraliste** qui suivait `.claude/agents/conformite-qa.md` à la lettre : l'agent, installé en cours de session, n'était pas encore chargé. Résultat proche mais pas un test strict de l'agent : à relancer si tu veux une validation stricte.
- T9 : test 2 lancé avec la demande exacte, **par le vrai agent `conformite-qa`** (chargé entre-temps). Rapport audité vérifié intact (`git diff` vide).
- T10 : commit `d645a53` docs(outputs): conformite-qa dossier lancement légal + audit sourcing v2, poussé. Grille de test non cochée.

**Fichiers modifiés** : `.claude/agents/conformite-qa.md` (nouveau), `knowledge/niche.md`, `tests/scenarios/conformite-qa.md`, `ROADMAP.md`, `coordination/`, 2 rapports dans `outputs/`.

**Rapport 1 (dossier)** : `outputs/2026-11-12-conformite-qa-dossier-vente-legale-maquettes-bois.md`
- Micro-entreprise de vente de marchandises : inscription gratuite (formalites.entreprises.gouv.fr), cotisations 12,3 % du CA (13,3 % avec versement libératoire), plafond 203 100 €, formulaire CFE 1447-C-SD avant le 31/12.
- TVA : franchise en base 85 000 € (seuil majoré 93 500 €) ; le seuil unique de 25 000 € a été abandonné.
- Pages : mentions légales, CGV, confidentialité, cookies (« Tout refuser » aussi visible), rétractation avec **bouton en ligne obligatoire depuis le 19/06/2026**, médiateur ; retirer le lien vers la plateforme européenne de litiges (fermée).
- GPSR : fabricant, responsable UE, photo, référence, avertissements en français sur chaque fiche. **Recyclage : les maquettes relèvent de la filière jouets (R543-320) même en 14+** → 2 adhésions payantes (Ecomaison + Citeo/Léko), IDU, Triman.
- Limites : articles GPSR cités d'après extraits (EUR-Lex illisible), coût Citeo (110 € HT/an), Ecomaison et médiateur `À VÉRIFIER`. Proposition de `knowledge/politiques.md` en section 5.

**Rapport 2 (audit)** : `outputs/2026-11-12-conformite-qa-audit-sourcing-maquettes-bois-v2.md`, verdict **BLOQUANT** (2 ⛔, 11 ⚠️, 5 ✅, 4 sans objet).
- ⛔ n°1, 3, 4 éliminés : électronique (contraire au nouveau `niche.md`) et canal non officiel (vendeurs AliExpress, épuisement des droits L713-4 CPI non prouvé).
- Reste le circuit à billes n°2 sous 4 conditions : preuve écrite 14+, positionnement adulte, infos GPSR, absence de copie.
- **Marge** : la formule oublie les cotisations micro (12,3 %) et l'éco-participation. Avec cotisations, le n°2 à 26,90 € tombe à 8,95 € (recompté : 12,26 − 3,31) → prix minimal 28,90 € (fournisseur principal), 29,90 € (secours).
- Autres ⚠️ : taxes d'import par catégorie d'article et non par colis ; règle du prix barré à réécrire (prix le plus bas des 30 jours, L112-1-1) ; photos de marque non autorisables par un vendeur AliExpress ; mention « authentique » non prouvée ; brouillon A à corriger (statut de revendeur agréé, responsable UE, recyclage, modèles sans électronique uniquement).

**Remarques pour Cowork** :
- L'agent `sourcing-produits` ne connaît ni les cotisations micro ni l'éco-participation dans sa formule de marge, ni la règle « taxes par catégorie d'article » : correction de l'agent à prévoir (via une tâche ici, puisque `.claude/` passe par moi).
- La section 3 de la grille d'audit dit « Aucune électronique (décision de `niche.md`) » : cohérent.

**🔔 ACTION HUMAINE**
1. Décider : demander une **v3 à `sourcing-produits`** avec les corrections de l'audit (après correction de l'agent par Cowork), puis un nouvel audit.
2. Décider : envoyer ou non le **brouillon A corrigé** à Robotime Europe (seule piste « marque » compatible avec `niche.md`). Rien n'a été envoyé.
3. Choisir **option A ou B** (dropshipping ou stock léger) : ça décide qui adhère aux filières de recyclage et ton rôle GPSR (distributeur ou importateur).
4. Fixer la **date de création de la micro-entreprise** (avant toute vente, idéalement avant juin 2027) ; décider versement libératoire, ACRE, non-publication de l'adresse.
5. Prévoir dans le budget de 150 à 500 € : adhésion emballages (environ 110 € HT/an, `À VÉRIFIER`), Ecomaison, médiateur.
6. Rendez-vous **expert-comptable / CCI / Urssaf** et questions à un **juriste** (revente de marque, copie, statut importateur, risque de requalification en jouet) et aux **éco-organismes** (qui doit adhérer).
7. Valider la proposition de `knowledge/politiques.md` (section 5 du dossier).

## 2026-11-12 10:55 · Synchro n°1

**Tâches faites** : T1, T2, T3, T4 (toutes `fait`).
- T1 : `coordination/cowork-command.md` copié vers `.claude/commands/cowork.md` (copie identique vérifiée), puis supprimé. Ligne `coordination/` ajoutée dans la section Structure de `README.md`.
- T2 : le rapport v2 était déjà commité (`0c9188e`), rien à ajouter.
- T3 : `ROADMAP.md`, phase 1 : ligne `sourcing-produits` mise à jour, 2 cases ajoutées (réponse des fournisseurs officiels, statut micro-entreprise).
- T4 : commit `chore(coordination): mise en place de /cowork + feuille de route`, poussé sur `origin/main`.

**Fichiers modifiés** : `.claude/commands/cowork.md` (nouveau), `coordination/` (ajouté au dépôt, `cowork-command.md` retiré), `README.md`, `ROADMAP.md`.

**Commits poussés plus tôt aujourd'hui (hors tâches Cowork, à la demande de l'humain)** :
- `0a4b36c` fix(agent): sourcing-produits v1.3 (UE en priorité, 14 jours max, marge 10 €, stock 100, note 4,5/5). Règles v1.1 à v1.3 reportées à la main, car le patch v1.1 était introuvable.
- `b247815` docs(knowledge): budget de lancement 150-500 €, option stock léger. Lignes Modèle, Budget et Échantillons de `contraintes.md` ; calcul option B (stock léger, mise de départ ≤ 500 €) ajouté dans l'agent.
- `0c9188e` docs(outputs): sourcing maquettes bois v2 (règles v1.3).

**Rapport d'agent** : `outputs/2026-11-12-sourcing-produits-maquettes-bois-v2.md`
- Aucun produit validé avec les règles v1.3. 4 produits « en sursis » (marge ≥ 10 € sur le papier, vérifications en attente). Confiance faible.
- 3 des 4 sont des produits authentiques de la marque leader (électronique, revente au prix officiel) : en conflit avec le garde-fou « aucun nom de marque » et « sans électronique de préférence ».
- Le seul générique sans électronique : circuit à billes en spirale (achat 7,19 €, vente 26,90 €, marge 12,26 € taxes comprises). Expédié de Chine probablement, donc délai ≤ 14 j `À VÉRIFIER`.
- Piste la plus sérieuse : site B2B européen de la marque leader. Pas de minimum de commande, mais port de 60 € sous 1 000 € de commande et remise revendeur inconnue (il faudrait environ 23 à 25 %).
- Calculé **avant** la décision « option B stock léger » : l'option B n'est pas chiffrée dans ce rapport.

**Remarques pour Cowork** :
- Le brouillon de message au fabricant (section 9-A du rapport v2) ne pose que des questions sur le dropshipping. Il faudrait ajouter : port pour 10 à 15 unités, conditions de paiement, remise dès cette quantité.
- Le rapport v2 n'est pas encore passé par `conformite-qa` (agent pas encore créé, phase 2).

**🔔 ACTION HUMAINE**
1. Décider : produits de marque authentiques (vendre en citant la marque, sans la citer, ou refuser) et électronique avec marquage CE vérifié (oui/non).
2. Valider ou modifier le brouillon de message au fabricant (avec ou sans les questions sur l'option B), puis l'envoyer toi-même si tu le décides.
3. Faire les vérifications navigateur de la section 8 du rapport v2 (environ 30 min, surtout pour le circuit à billes).
4. Démarches micro-entreprise (statut TVA : toutes les marges en dépendent).
5. Valider la proposition de `knowledge/prix-et-marges.md` (section 7 du rapport v2).
