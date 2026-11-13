# Comptes rendus de Claude Code (le plus récent en haut)

## 2026-11-12 · Synchro n°8 : en cours (suivi en direct)

- T31 `fait` (commit `5e8fa87`) : `redacteur-catalogue` a écrit les 10 fiches (`site/src/content/produits/`, `demo: true`, sans lien de paiement) + rapport `outputs/2026-11-12-redacteur-catalogue-fiches-demo.md`. Format du §5.4 de la spec v2 (pas celui de `site-technique.md`) ; champ `accroche` ajouté ; beaucoup de `À VÉRIFIER` dans des champs numériques/booléens : le schéma de `developpeur-web` doit les accepter pour les démos.
- T32 `fait` : `studio/` (Three.js + Playwright + sharp, `npm run render`) a produit 60 vues produits (6 × 10) + 3 ambiances (`bureau-nuit`, `comparateur-planches`/`-monte`), WebP 1600 et 800 px, 126 fichiers, 5,7 Mo dans `site/public/`. Corrigé en fin de tâche : vue `boite` de la boîte à musique (manquait), `detail` du moulin (gros plan flou sans sujet → transmission sous le socle), cadrage du comparateur (planches hors champ). Planche contact : `outputs/planches/2026-11-12-studio-visuel-planche-contact.jpg` ; rapport `outputs/2026-11-12-studio-visuel-rendus-demo.md`. Rendus de démonstration seulement, à ne jamais utiliser pour vendre un produit réel.
- T33 `fait` (commit `22b3658`) : le PC s'est éteint pendant la tâche ; reprise sans repartir de zéro (`developpeur-web` relancé pour compléter). `site/` Astro 6 + Tailwind 4 + Lucide + GSAP, polices auto-hébergées, thème, composants `ui/` et `mise-en-page/`, 11 pages : accueil provisoire, FAQ, livraison et retours, mentions légales, CGV (17 articles + annexe formulaire type), confidentialité, cookies, contact, à propos, renoncer au contrat (formulaire **désactivé**, pas d'API), 404. `npm run build` OK. Nombreux `[À VALIDER]` (identité, SIREN, hébergeur, REP, médiateur, frais, transporteur, textes officiels D.211-2 et R221-1 à recopier mot pour mot). Point ouvert : le drapeau `existe` de `lib/navigation.ts` n'est pas utilisé par la navigation, donc liens morts vers `/maquettes/`, `/collections/…`, `/atelier/`, `/trouver-ma-maquette/` tant que T34/T35 ne les créent pas.
- T34 `fait` (commit `6a96e14`) : 30 pages, build OK, 2 231 liens internes vérifiés, 0 erreur. `/maquettes/` (filtres en liens, sans JS), `/maquettes/niveau/facile|moyen|expert/`, 5 collections (`mecanique`, `vehicules`, `miniatures`, `pour-debuter`, `idees-cadeaux`) avec héros animé + grille filtrable (`?niveau=`, sans stockage) + bouton pause des animations, 10 fiches `/maquettes/<slug>/` (galerie 6 vues srcset 800/1600, zoom plein écran clavier/doigt, lien vers l'image 1600 sans JS, bandeau démo, achat désactivé y compris barre mobile, pas d'`Offer` en JSON-LD, « Prix indicatif de démonstration »). La navigation utilise enfin `existe` (masqué en barre, « (bientôt) » en pied de page). Vue 3D : emplacement `[À VALIDER]` seulement, Three.js non installé. **Écart avec `knowledge/decisions.md`** : les valeurs « À VÉRIFIER » des fiches sont affichées `[À VALIDER : …]` au lieu d'être masquées (bascule en un seul endroit : `components/produit/Donnee.astro`). Écarts à la spec : zoom en fondu (pas depuis l'image), pas d'aperçu au survol des vignettes, pas d'animation de réorganisation du filtre, pas d'image de partage, `site` non renseigné dans `astro.config.mjs` (URL relatives). Phrase d'intro d'« Idées cadeaux » rédigée par l'agent. L'agent a aussi ajouté les nouveaux dossiers dans `docs/site-technique.md` (fichier déjà modifié par toi, non commité, je le laisse pour le commit de fin).

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
