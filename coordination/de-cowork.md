# Tâches de Claude Cowork pour Claude Code

Statuts : `à faire` · `fait` · `bloqué (raison)`

## Synchro n°1 à n°7 (T1 à T30) · `fait`
Pour info : la règle « Gros livrables » ajoutée dans `CLAUDE.md` vient de Cowork (suite au blocage de l'architecte en T28).

---

## Synchro n°8 (2026-11-12) : fiches, visuels, construction du site

À lancer **après un redémarrage de Claude Code** (les agents `redacteur-catalogue` et `studio-visuel` doivent être chargés).
Lance les agents **l'un après l'autre**, jamais en parallèle. Après chaque tâche : commit + push, et une ligne de compte rendu dans `vers-cowork.md` (pour que Cowork suive en direct). Si un agent se bloque, relance-le en lui demandant d'écrire en plusieurs fois (règle « Gros livrables » de `CLAUDE.md`).

Spécification de référence pour tout le site : `outputs/2026-11-12-architecte-web-conception-boutique-v2.md` + `outputs/2026-11-12-architecte-web-conception-boutique-v2-partie-2.md`.

### T31 · Fiches des 10 produits de démonstration · `fait`
Lance `redacteur-catalogue` avec la demande de `tests/scenarios/redacteur-catalogue.md`.
Commit `feat(catalogue): 10 fiches produits de démonstration`.

### T32 · Visuels 3D des produits · `fait`
Lance `studio-visuel` avec la demande de `tests/scenarios/studio-visuel.md`.
Si c'est trop long en une fois : d'abord l'atelier (`studio/lib/`, matériaux, éclairage, script de rendu) + 2 produits, montre la planche contact dans le compte rendu, puis les 8 autres.
Commit `feat(studio): visuels 3D des produits de démonstration`.

### T33 · Construction du site, étape 1 : fondations · `fait`
Lance `developpeur-web` :
```
Utilise l'agent developpeur-web : étape 1 du site selon la spécification v2 (2 fichiers dans outputs/). Crée site/ (Astro, Tailwind, polices auto-hébergées, icônes Lucide, GSAP), le thème (couleurs et typographies de knowledge/marque.md), les composants de base façon shadcn/ui (bouton, carte, badge, accordéon, navigation, pied de page), la mise en page commune, et toutes les pages légales et d'aide avec les textes de knowledge/politiques.md ([À VALIDER] là où une valeur manque). Pas encore l'accueil animé. npm run build doit passer.
```
Commit `feat(site): fondations, thème, composants, pages légales`.

### T34 · Construction du site, étape 2 : catalogue et fiches · `fait`
Lance `developpeur-web` : catalogue, pages de collection, fiche produit (galerie des 6 vues, zoom, bandeau démonstration, achat désactivé si `demo: true`), à partir des fiches de T31 et des images de T32.
Commit `feat(site): catalogue, collections, fiches produits`.

### T35 · Construction du site, étape 3 : accueil cinématique · `fait`
Lance `developpeur-web` : l'accueil complet de la spécification v2 (11 sections, animations GSAP, versions mobile, sans animation et sans JavaScript), au niveau de `docs/reference/prototype-accueil.html` ou au-dessus.
Commit `feat(site): accueil cinématique`.

### T36 · Compte rendu final · `fait`
Dans `vers-cowork.md` : ce qui marche, ce qui manque, la commande exacte pour que l'humain voie le site sur son PC (`cd site && npm install && npm run dev`, adresse locale), et les 🔔 ACTION HUMAINE.
Ne lance pas `conformite-qa` sur le site : Cowork le planifiera après sa propre revue.

---

## Synchro n°9 (préparée par Cowork, copiée le 2026-11-13 avec les changements demandés par l'humain)

Ordre d'exécution demandé par l'humain : T37, T38, T38b, T39, T41, T40, T42 (T41 avant T40), une ligne dans `vers-cowork.md` après chaque tâche, puis demander à l'humain de redémarrer.

### T37 · Installer createur-contenu · `fait`
Copie `coordination/prochaine-synchro/createur-contenu.md` vers `.claude/agents/createur-contenu.md`, puis supprime **seulement les fichiers déjà utilisés** de `coordination/prochaine-synchro/` (pas tout le dossier). Ne le lance pas (règle permanente).

### T38 · Retouche des rendus 3D · `fait`
Lance `studio-visuel` : sur les vues catalogue (`face`, `trois-quarts`, `dessus`), le sol présente des **taches grises irrégulières** autour du produit (ombre bruitée, visible sur la grue et la voiture). Corrige l'ombre de contact (plus douce, sans bruit, ou fond parfaitement uni avec une seule ombre portée floue), puis régénère toutes les vues concernées. Corrige aussi le petit engrenage en haut à droite de la boîte « Initiation », qui touche à peine les autres.
Corrige aussi : l'image d'ambiance `comparateur-planches` (presque vide, on voit surtout le bureau) et les ombres tachées des vues « dessus » (boîte à musique, planétaire).

### T38b · Contrôle qualité automatique · `fait`
- Les fichiers `tools/verifier_livrables.py`, `docs/retours-experience.md`, `CLAUDE.md` et `docs/templates/agent-template.md` ont été écrits ou mis à jour par Cowork : commite-les.
- `CLAUDE.md` a été remis à l'ancienne version : rajoute ces 2 règles après « Gros livrables » : « Lire docs/retours-experience.md avant de commencer : chaque erreur déjà corrigée y est notée. » et « Avant chaque commit : python tools/verifier_livrables.py doit afficher 0 erreur. »
- Lance `python tools/verifier_livrables.py` et corrige ce qu'il signale (un seul avertissement connu : statut « brouillon » du premier rapport analyste-marche, à laisser tel quel, c'est l'historique).
- Ajoute à la commande `/cowork` (`.claude/commands/cowork.md`), juste avant l'étape de commit : « Lance `python tools/verifier_livrables.py` ; s'il y a des erreurs, corrige-les avant de commiter. »
- Donne l'outil `Edit` à `architecte-web` et `conformite-qa` (ligne `tools:` du frontmatter), comme prévu dans `knowledge/decisions.md`.

### T39 · Audit de conformité du site · `fait`
Demande d'abord à `developpeur-web` un court rapport `outputs/` sur le site (T33-T35). Puis lance `conformite-qa` en mode audit sur le site construit (`site/`) : pages légales, fiche produit type, accueil, mentions de démonstration, bouton de rétractation, cookies. Lis les fichiers par tranches.

### T40 · Commit, push, compte rendu · `fait`
Compte rendu dans `vers-cowork.md` avec les 🔔 ACTION HUMAINE. Puis demande à l'humain de redémarrer Claude Code (pour `createur-contenu`).

## Synchro n°10 (préparée le 2026-11-12) : organisation à 100 rôles, 7 nouveaux agents

Référence : `docs/organisation.md` (décision de l'humain : 100 rôles confiés à environ 15 agents et des scripts sans IA).
Changement demandé par l'humain : T41 est exécutée **avant** T40, dans la même session que la synchro n°9.

### T41 · Installer 7 agents · `fait`
Copie dans `.claude/agents/` les fichiers de `coordination/a-installer/` : `studio-video`, `veille-outils`, `gestion-commandes`, `service-client`, `crm-email`, `pilotage-finance`, `media-acquisition`. Leurs scénarios de test sont déjà dans `tests/scenarios/`.
Ajoute dans `docs/architecture.md` une ligne qui renvoie vers `docs/organisation.md`.
Lance `python tools/verifier_livrables.py` (0 erreur attendue).
Commit `feat(agents): organisation à 100 rôles et 7 nouveaux agents`.

### T42 · Compte rendu et redémarrage · `fait`
Une ligne dans `vers-cowork.md`, puis demande à l'humain de redémarrer Claude Code.
Ne lance aucun de ces agents dans cette session. `gestion-commandes`, `service-client`, `crm-email` et `pilotage-finance` ne seront utilisés qu'avant le lancement ; `media-acquisition` après le lancement.

## Synchro n°11 (demandée par l'humain le 2026-11-13)

Dans l'ordre, une ligne dans `vers-cowork.md` après chaque tâche ; utiliser `py` (pas `python`) sur ce PC.

### T43 · Décisions : bloc sécurité des démos et automate à manivelle · `fait`
Ajouter dans `knowledge/decisions.md` : (1) bloc sécurité des démos = « Produit de démonstration, non vendu : il n'a pas de fabricant. » ; (2) la boutique reste « maquettes mécaniques en bois » : le book nook est remplacé par une démo avec mécanisme, « Automate à manivelle ». Mettre à jour `knowledge/catalogue-demo.md`.

### T44 · Fiche et visuels de l'automate à manivelle · `fait`
`redacteur-catalogue` : fiche démo de l'automate à manivelle, suppression de la fiche book nook. Puis `studio-visuel` : ses 6 vues, suppression des images du book nook, planche contact.

### T45 · Corrections A1 à A10 du site · `fait`
`developpeur-web` : corriger A1 à A10 de `outputs/2026-11-13-conformite-qa-audit-site.md` avec la phrase de T43, et ajouter un script de vérification des liens reproductible dans `tools/` lancé après chaque build. `npm run build` doit passer.

### T46 · Contre-audit A1 à A10 · `fait`
`conformite-qa` : contre-audit court de A1 à A10 seulement.

### T47 · Clôture · `fait`
Vider `coordination/a-installer/`, lancer le vérificateur, commit, push, compte rendu avec les 🔔 ACTION HUMAINE.

## Synchro n°12 (préparée par Cowork le 2026-11-13) : le studio vidéo

Référence : `docs/studio/BRIEF-STUDIO.md`. Dans l'ordre, une ligne dans `vers-cowork.md` après chaque tâche, `py` au lieu de `python`. Ne lance pas un agent modifié dans la même session (règle permanente) : T48 installe, l'humain redémarre, puis la synchro n°13 produira la première vidéo.

### T48 · Installer le studio · `fait`
- Copie `coordination/a-installer/studio-video.md` et `media-acquisition.md` dans `.claude/agents/` (ils remplacent les versions actuelles).
- Copie `coordination/a-installer/skills/*` dans `.claude/skills/` et `coordination/a-installer/commands/marketing.md` dans `.claude/commands/`.
- `tests/scenarios/studio-video.md` est déjà à jour : vérifie seulement qu'il existe.
- Crée `studio/video/` (avec `effets/`, `.cache/`), `medias/voix/`, `medias/apercus/`, `medias/licences.md` (vide avec un en-tête), `marketing/calendrier.md` (en-tête seulement).
- `.gitignore` : `studio/video/.cache/`, `studio/video/_vendor/`, `studio/video/node_modules/`, les fichiers `*.wav`, et les MP4 de plus de 20 Mo (à défaut, `medias/brouillons/`).
- Vide ensuite `coordination/a-installer/` (garde le `.gitkeep`).

### T49 · Licences et choix des outils · `fait`
Lance `veille-outils` : vérifie sur les dépôts officiels la licence et le coût de Remotion, HyperFrames (heygen-com/hyperframes), faster-whisper, Piper, et l'usage commercial des voix ElevenLabs. Recommande la combinaison pour une micro-entreprise d'une personne. Rapport dans `outputs/`.

### T50 · Socle technique · `fait`
Selon la recommandation de T49 (sans rien qui exige un paiement) : dans `studio/video/`, installe ce qui est retenu (Remotion et/ou les skills HyperFrames avec `npx skills add heygen-com/hyperframes`, faster-whisper avec `py -m pip`), et vérifie ffmpeg. Un rendu de test de 3 s doit marcher. Note les commandes dans `docs/studio/BRIEF-STUDIO.md` (nouvelle section « Commandes »).

### T51 · Commit, compte rendu, redémarrage · `fait`
Vérificateur à 0 erreur, commit `feat(studio): studio vidéo, skills et pilote marketing`, push, compte rendu avec 🔔 ACTION HUMAINE, puis demande à l'humain de redémarrer Claude Code.

## Synchro n°13 (préparée par Cowork le 2026-11-13) : studio en direct + première vidéo

Dans l'ordre, une ligne dans `vers-cowork.md` après chaque tâche, `py` au lieu de `python`. ffmpeg : s'il n'est pas reconnu, `C:\Users\bacon\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin\ffmpeg.exe`.

### T52 · Journal v2 · `fait`
`tools/journal_claude.py` a été mis à jour par Cowork (il écrit aussi `coordination/journal-direct.jsonl`). Ajoute ce fichier au `.gitignore`, vérifie que les hooks le remplissent, commit.

### T53 · Studio en direct · `fait`
Lance `developpeur-web` sur `docs/studio/BRIEF-STUDIO-DIRECT.md`, étapes 1 à 3, en partant de `docs/reference/studio-en-direct.html`. Commit `feat(qg): studio en direct`. Dis à l'humain la commande pour l'ouvrir.

### T54 · Première vidéo · `fait`
Lance `studio-video` avec la demande de `tests/scenarios/studio-video.md` (« De la planche à l'objet », 20 s, 9:16, sous-titres seulement), puis une 2e version avec la voix Piper `fr_FR-siwis-medium` (texte tiré de `medias/voix-off-promo-v2.md`, crédits notés dans `medias/licences.md`). Le studio en direct doit montrer le travail pendant ce temps.

### T55 · Contrôle et fin · `fait`
`conformite-qa` sur les 2 vidéos (mentions, droits, crédits Piper). Vérificateur à 0 erreur, commit, push, compte rendu avec 🔔 ACTION HUMAINE.

## Synchro n°14 (transmise par l'humain le 2026-11-13) : corrections des vidéos et du studio en direct

Dans l'ordre, une ligne dans `vers-cowork.md` après chaque tâche, `py` au lieu de `python`.

### T56 · Corrections des 2 vidéos · `fait`
`studio-video` : corrige les 2 vidéos « De la planche à l'objet » selon `outputs/2026-11-13-conformite-qa-videos-planche-a-objet.md` : appel final « Suivez-nous » à la place de « Suivez l'atelier » ; mention « Rendus 3D de démonstration, produit non vendu » plus grande et dans la zone sûre (pas dans les 15 % du haut) ; supprime le plan presque vide avant le logo ; carte en verre « Entraînement » nette et entière ; son normalisé autour de -14 LUFS. Ajoute ces 4 points à la grille de qualité du brief et une leçon dans `docs/retours-experience.md`. Écris aussi la légende de publication avec la mention « Produit de démonstration, non vendu ».

### T57 · Studio en direct · `fait`
`developpeur-web` : « Attend ton accord » doit compter les statuts `à-valider` même suivis d'un commentaire (`# …`) ; le journal n'affiche que des phrases lisibles (pas de XML ni de texte technique) ; Cowork passe au travail quand un fichier écrit par Cowork arrive dans `coordination/` ; `SubagentStop` retrouve l'agent par son `agent_id`. `npm test` doit passer.

### T58 · Contre-audit · `fait`
`conformite-qa` : contre-audit court des 2 vidéos corrigées (le point du nom de marque reste ouvert, l'humain vérifie l'INPI).

### T59 · Clôture · `fait`
Vérificateur, commit, push, compte rendu avec 🔔 ACTION HUMAINE.

## Synchro n°15 (transmise par l'humain le 2026-11-13) : vitesse et qualité

Une ligne dans `vers-cowork.md` après chaque tâche, `py` au lieu de `python`. T67 tourne en parallèle de T61 à T66. L'ancienne T60 (QG en direct, commencée dans une session précédente) est reprise dans T67.

### T61 · Travail en parallèle · `fait`
Dans `CLAUDE.md` et `.claude/commands/cowork.md`, remplace la règle « un agent à la fois » par : les tâches qui ne touchent pas les mêmes fichiers se lancent en parallèle (agents en arrière-plan) ; on n'attend que pour les tâches qui dépendent d'une autre.

### T62 · Modèles · `fait`
Passe en `model: sonnet` les agents redacteur-catalogue, createur-contenu, service-client, crm-email, gestion-commandes, media-acquisition. Les autres restent en `inherit`.

### T63 · Fiche-mémo · `fait`
Écris `knowledge/memo.md` (2 Ko maximum) qui résume les règles indispensables de tout `knowledge/` et de `decisions.md`. Dans chaque agent, « Avant d'agir » devient : lire `CLAUDE.md`, `knowledge/memo.md`, `docs/retours-experience.md`, puis seulement les fichiers utiles à SA tâche.

### T64 · Rapports courts · `fait`
Dans `docs/templates/agent-template.md` et chaque agent : un rapport = 1 page de résultats et de décisions pour l'humain, le détail en annexe seulement s'il est demandé.

### T65 · Exemples · `fait`
Crée `docs/exemples/` avec le meilleur livrable existant pour chaque type (rapport d'audit, fiche produit, script vidéo, rapport de veille), et ajoute dans chaque agent « inspire-toi de docs/exemples/ ».

### T66 · Studio en mode brouillon · `fait`
`studio-video` fait les essais en 540x960 avec Whisper small, la version finale seulement en 1080x1920 avec large-v3. À noter dans le brief et dans l'agent.

### T67 · QG en direct (en parallèle de T61 à T66) · `fait`
`developpeur-web` étend `qg/studio` en « QG en direct » pour toute l'équipe, sur le modèle de `docs/reference/qg-en-direct.html` (12 pièces, 15 agents, filtres, synchro en cours lue dans `de-cowork.md`). Le bouton Valider ne change que le statut. Garde l'onglet Studio. `npm test` doit passer.

### T68 · Clôture · `fait`
Vérificateur, commit, push, compte rendu, puis demander à l'humain de redémarrer.

---

## Synchro n°16 (2026-11-13) « AliExpress »

En parallèle quand c'est possible, une ligne dans `vers-cowork.md` après chaque tâche.

### T69 · Nouveau modèle dans les décisions · `fait`
`knowledge/decisions.md` : nouveau modèle décidé par l'humain : dropshipping, 0 € d'avance ; fournisseur prioritaire = boutique officielle Robotime sur AliExpress (robotime.aliexpress.com, store 2884002), offres expédiées depuis un entrepôt UE seulement (livraison ≤ 14 j, pas de droits de 3 €/article) ; règles existantes inchangées (marge ≥ 10 €, note ≥ 4,5, stock ≥ 100). Mets à jour `knowledge/memo.md`.

### T70 · Grille AliExpress · `fait`
`sourcing-produits` : AliExpress bloque les robots, donc pars du catalogue officiel robotimeonline.com (collection ROKR, sans électronique) : liste 15 modèles candidats avec prix officiel, puis prépare `outputs/…-grille-aliexpress.md` : un tableau que l'humain remplit en 10 min dans son navigateur (lien AliExpress, prix, « expédié depuis », délai, note, ventes, stock), avec la marche à suivre.

### T71 · Calcul de marge · `fait`
`pilotage-finance` : un script `tools/calcul_marge.py` qui prend ce tableau rempli et sort la marge réelle de chaque produit (Stripe, cotisations, retours) et le prix de vente conseillé.

### T72 · Messages à Robotime · `fait`
`redacteur-catalogue` : brouillon de message à la boutique Robotime AliExpress et à Robotime Europe : accord pour le dropshipping et droit d'utiliser leurs photos et vidéos officielles dans nos pubs. Rien n'est envoyé.

### T73 · Modèles de pub · `fait` (6 brouillons rendus le 2026-11-13)
`createur-contenu` + `studio-video` : 3 modèles de pub (accroche, démonstration, avant/après) prêts à recevoir les médias officiels, rendus en brouillon avec des cadres vides marqués « média fournisseur ».

### T74 · Clôture · `fait` (reprise dans la clôture de la synchro n°18)
Vérificateur, commit, push, compte rendu avec 🔔 ACTION HUMAINE.

## Règle permanente
Quand une tâche installe ou modifie un agent dans `.claude/agents/`, ne lance pas cet agent dans la même session : termine la synchro et demande à l'humain de redémarrer Claude Code.

---

## Synchro n°17 (2026-11-19, demandée par l'humain) : V1, admin de boutique (vidéo 1)

Produit et fournisseur non décidés (Robotime refuse le dropshipping, minimum 1 000 €) : tout se construit avec un produit de démonstration.

### V1-1 · Page produit modèle (Astro, data/produits/*.json, exemple-demo) · `fait`
### V1-2 · Section avis clients (data/avis.json vide, règle dans CLAUDE.md) · `fait`
### V1-3 · Route /boutique du QG (data/commandes.json, marge de tools/calcul_marge.py) · `fait`
### V1-4 · Page Modules (data/modules.json) · `fait`
### V1-5 · Contrôle conformite-qa et rapport outputs/2026-11-19-developpeur-web-video1-boutique.md · `fait`

---

## Synchro n°18 (2026-11-20, demandée par l'humain) : fonctionnalités des vidéos 2 à 7

Contexte : la vidéo 1 (admin de boutique) est faite (synchro n°17) et la vidéo « 137 agents » aussi (synchro du 2026-11-14). Il reste 6 vidéos utiles. Une vidéo de la série n'a rien à installer : c'est un tutoriel de montage, repris en V2-5.
Produit et niche toujours pas décidés : rien ne se met en ligne, rien n'est publié, rien n'est payé. Pas de tickets GitHub : tout le suivi se fait dans ce fichier et dans `vers-cowork.md`.

Règles pour toute la synchro :
- **Skills tiers** : avant d'installer un skill venu de GitHub, lire son `SKILL.md` et ses scripts en entier. Noter dans le rapport ce qu'ils exécutent et quels réseaux ils appellent. Refuser tout script qui envoie des données ailleurs sans que ce soit dit.
- **Règle permanente** : un skill ou un agent installé ou modifié n'est pas lancé dans la même session. Terminer la synchro, puis demander à l'humain de redémarrer Claude Code. Les tâches marquées « après redémarrage » se font dans la session suivante.
- Coût : 0 €. Pas d'abonnement, pas de clé API payante.
- Une ligne dans `coordination/vers-cowork.md` après chaque tâche. Un commit par tâche.

### V2-1 · Tester l'entreprise avant de lancer (vidéo « Founder skill ») · `fait` (11 skills dans .claude/skills/, revue : outputs/2026-11-20-claude-code-revue-skills-tiers.md)
Dépôt : https://github.com/Jakeschincariol/founder-skill (MIT, 11 skills : `/founder-board`, `/founder-marketing`, `/founder-cfo`, `/founder-consumer` avec un panel de 100 acheteurs simulés, `/founder-plan`, etc.).
- Installer dans `.claude/skills/` du projet (pas en global). Lire le README et chaque `SKILL.md` avant.

### V2-1b · Passage des 2 idées dans le pipeline Founder · `à faire (après redémarrage)`
- Passer les 2 idées en concurrence dans le pipeline complet : (A) produits numériques (tableurs de budget en français) et (B) marque de tech fleece. Utiliser les chiffres réels de `knowledge/` et `tools/calcul_marge.py` (cotisations 21,2 % pour le numérique). Ne rien inventer : si un chiffre manque, écrire « À VÉRIFIER ».
- Livrable : `outputs/2026-11-20-founder-test-niches.md`. Verdict par idée, marge par commande, point mort, objections du panel. Préciser que le taux d'achat du panel est un maximum et non une prévision : ce sont des clients simulés.
- Sert à trancher la question ouverte de la niche (décision finale : l'humain).

### V2-2 · Composants animés premium pour le site (vidéo « 3 librairies ») · `fait` (4 composants React Bits en local ; audit conformite-qa À CORRIGER, 8 points corrigés)
Sources : React Bits (reactbits.dev), Skiper UI (skiper-ui.com), Vengeance UI (vengenceui.com).
- `architecte-web` : choisir au plus 5 composants qui servent la conversion (fond du héros, texte animé du titre, cartes empilées au scroll pour les produits, carrousel). Vérifier la licence de chaque composant et la noter dans `docs/site-technique.md`.
- `developpeur-web` : ajouter l'intégration React d'Astro (`@astrojs/react`) en îlots `client:visible` uniquement sur ces composants. Respecter `prefers-reduced-motion`, sans emojis (règle de design existante). Le poids JS par page est noté dans le rapport.
- Tests : build OK, 0 lien cassé, captures 390 et 1280 px avant/après dans `outputs/captures/2026-11-20-animations/`.
- `conformite-qa` : contrôle accessibilité (contraste, mouvement réduit, clavier).

### V2-3 · Boucle marketing avec validation (vidéo « 36 agents, 0 employé ») · `fait` (rapport : outputs/2026-11-20-developpeur-web-boucle-marketing.md)
Principe : Recherche → Contenu → Publication → Boucle (quels posts rapportent), et rien ne sort sans l'accord de l'humain.
- Partir de l'existant (`marketing/`, `/marketing`, département marketing des 137 agents). Ne pas recréer 36 agents : tableau de correspondance des 4 étapes avec les agents déjà présents, et liste des manques.
- Page `/marketing` dans le QG : file « à valider » (posts, légendes, e-mails) avec boutons Valider / Refuser. Rien ne se publie automatiquement : la publication reste manuelle par l'humain tant qu'aucun compte n'est relié.
- « Suivi des revenus par post » (`data/posts.json`, hors Git comme `commandes.json`) qui relie un post à des commandes réelles. Vide au départ, exemples séparés comme pour `/boutique`.
- Page du lundi (page du matin) : ajouter un bloc marketing (ce qui a marché, ce qui part ensuite).

### V2-4 · Équipe YouTube / vidéos courtes : installation (vidéo « YouTube Agent Skill ») · `fait` (11 skills, aucune ne demande de clé API)
Dépôt : https://github.com/Jakeschincariol/youtube-agent-skill (MIT, 11 skills : `/yt-script`, `/yt-package`, `/yt-edit`, `/yt-plan`, `/yt-viral`, `/yt-retention`, réponses aux commentaires…).
- Installer dans `.claude/skills/` après lecture. Noter quelles skills ont besoin d'une clé API YouTube : celles-là restent inactives.

### V2-4b · Branchement sur le studio vidéo, sans /yt-viral · `à faire (après redémarrage)`
- Adapter au format de la boutique (vidéos courtes 9:16 TikTok / Instagram / Shorts, sans visage, produit seul). Brancher `/yt-script` et `/yt-package` (21 accroches, titres) sur l'agent `studio-video`.
- `/yt-viral` n'est pas branché dans cette synchro (la niche n'est pas choisie) : il le sera sur la veille concurrentielle une fois la niche décidée.
- Livrable : `outputs/2026-11-20-studio-video-skills-youtube.md` avec un exemple de script et 5 accroches pour un produit de démonstration.

### V2-5 · Style de montage « viral » dans le studio vidéo (vidéo « Style viral étape par étape ») · `fait` (rapport : outputs/2026-11-20-studio-video-montage-4-couches.md)
Pas d'outil à installer. Montage en 4 couches : 1. Brute (la prise seule) ; 2. B-roll + suivi + netteté ; 3. Sous-titres mot à mot + masquage (texte derrière le sujet) ; 4. Animations + effets sonores + musique de fond.
- `studio-video` : ajouter ces 4 couches comme étapes dans `docs/studio/BRIEF-STUDIO.md` et dans la grille de qualité §5. Créer un effet réutilisable « sous-titres mot à mot » dans `studio/video/effets/` (faster-whisper est déjà installé).
- Rendre une version test sur `medias/de-la-planche-a-l-objet-9x16.mp4` avec les 4 couches, en gardant la mention « Produit de démonstration, non vendu ». Sons et musique : uniquement des sources libres, notées dans `medias/licences.md`.

### V2-6 · Briefing du matin vocal en local (vidéo « OpenJarvis ») · `fait` (optionnel ; docs/jarvis.md et tools/page_matin_texte.py, rien d'installé)
Projet : https://github.com/open-jarvis/OpenJarvis (Stanford, Apache 2.0, local, sans abonnement).
- **Ne pas l'installer depuis Claude Code.** L'humain lance l'installateur lui-même s'il le veut (plusieurs Go, modèles locaux via Ollama).
- Écrire `docs/jarvis.md` (installation, preset `morning-digest`, connexion Gmail/Agenda par OAuth faite par l'humain) et un petit script qui exporte la page du matin du QG en texte brut, pour que Jarvis puisse la lire à voix haute.

### Fin de synchro · `fait`
Vérificateur `py tools/verifier_livrables.py` à 0 erreur. Tests QG et site verts. Compte rendu dans `vers-cowork.md` avec une section 🔔 ACTION HUMAINE, puis demander à l'humain de redémarrer Claude Code pour V2-1b et V2-4b.
