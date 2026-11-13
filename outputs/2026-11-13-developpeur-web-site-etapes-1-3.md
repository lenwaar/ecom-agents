---
agent: developpeur-web
statut: à-valider
date: 2026-11-13
sources: [outputs/2026-11-12-architecte-web-conception-boutique-v2.md, outputs/2026-11-12-architecte-web-conception-boutique-v2-partie-2.md, outputs/2026-11-12-conformite-qa-audit-conception-boutique-v2.md, knowledge/decisions.md, docs/site-technique.md, coordination/vers-cowork.md, site/src/]
prochaine-etape: conformite-qa (audit du site) puis validation humaine
---

# Site de la boutique : étapes 1 à 3 (T33, T34, T35)

Rapport rétrospectif écrit à partir du code réel (`site/src/`, `git log -- site`) et des comptes rendus de la synchro n°8. Aucun fichier de `site/src/` modifié, rien commité.

## 1. Résumé

- **Fonctionne** : 58 pages statiques, `npm run build` OK le 2026-11-13 après la régénération des images (T38) : 0 erreur, 0 avertissement. Liens internes de `site/dist/` : 3 937 vérifiés, 0 cassé (mon comptage ; la synchro n°8 en annonçait 4 242 avec un autre script, non commité).
- **Mode démonstration actif** : rien n'est achetable, aucun prix n'est présenté comme une offre, aucune valeur « À VÉRIFIER » ne s'affiche.
- **Manque** : vue 3D au clic, vrais calques de la vue éclatée, formulaires actifs (rétractation, lettre), toutes les données de la boutique (identité, SIREN, livraison…) encore `[À VALIDER]`.

Commits : `22b3658` (T33 fondations, thème, composants, pages légales), `6a96e14` (T34 catalogue, collections, fiches), `8f26527` (T35 accueil cinématique, questionnaire, atelier) ; images régénérées dans `4f4f641` (T38, studio).

## 2. Pile et commandes

Astro 6.4.8 (statique, `trailingSlash: 'always'`), Tailwind 4.3.5 (`@tailwindcss/vite`), `@lucide/astro` 1.72.0, GSAP 3.15.1 (local), polices auto-hébergées (`@fontsource-variable/inter`, `@fontsource/cormorant-garamond`). Versions figées dans `site/package.json`, `package-lock.json` commité. Three.js **non installé** dans le site.

```
cd site
npm install
npm run dev        # http://localhost:4321/
npm run build      # 58 pages dans dist/ ; échoue si une fiche demo: false contient « À VÉRIFIER »
npm run preview    # aperçu de dist/ sur http://localhost:4321/
npm run check      # astro check (types)
```

**Vérification des liens** : aucun script dans le dépôt (écart, voir §5). Contrôle fait avec un script temporaire hors dépôt : il lit tous les `href`, `src` et `srcset` commençant par `/` dans `dist/**/*.html` et vérifie que le fichier ou le `index.html` existe. Contrôle complémentaire : `grep -rl "À VÉRIFIER" site/dist` doit renvoyer rien (vérifié : rien).

## 3. Routes (58 pages)

| Type | Routes | Fichiers sources principaux |
|---|---|---|
| Accueil (1) | `/` | `pages/index.astro`, `components/accueil/*` (11 sections), `scripts/accueil.ts`, `scripts/accueil-sections.ts`, `scripts/comparateur.ts`, `lib/accueil.ts`, `content/reglages/accueil.yaml` |
| Légal (6) | `/mentions-legales/`, `/cgv/`, `/confidentialite/`, `/cookies/`, `/livraison-et-retours/`, `/renoncer-au-contrat/` | `pages/*.astro`, `layouts/PageTexte.astro`, `components/legal/FormulaireTypeRetractation.astro`, `content/reglages/boutique.yaml` |
| Aide et marque (4) | `/faq/`, `/contact/`, `/a-propos/`, `/atelier/` | `pages/*.astro`, `components/aide/QuestionFaq.astro`, `components/atelier/LettreAtelier.astro`, `lib/atelier.ts` |
| Catalogue (4) | `/maquettes/`, `/maquettes/niveau/facile|moyen|expert/` | `pages/maquettes/index.astro`, `pages/maquettes/niveau/[niveau].astro`, `layouts/PageCatalogue.astro`, `components/produit/FiltresCatalogue.astro`, `GrilleProduits.astro`, `CarteProduit.astro` |
| Collections (5) | `/collections/mecanique|vehicules|miniatures|pour-debuter|idees-cadeaux/` | `pages/collections/[slug].astro`, `components/collection/*`, `scripts/collection.ts` |
| Fiches produits (10) | `/maquettes/<slug>/` (10 fiches de `content/produits/*.md`, toutes `demo: true`) | `pages/maquettes/[slug].astro`, `components/produit/*` (Galerie, Zoom, BlocAchat, BarreAchatMobile, BlocSecurite, Caracteristiques, Donnee, DonneesStructurees, Vue3D) |
| Questionnaire (27) | `/trouver-ma-maquette/` + 26 étapes et résultats (`moi|offrir` / `premiere|une-ou-deux|habitude` / `soirees|week-end|mon-temps`), toutes `noindex` | `pages/trouver-ma-maquette/[...etapes].astro`, `components/questionnaire/*`, `lib/questionnaire.ts`, `scripts/questionnaire.ts` |
| Erreur (1) | `404.html` | `pages/404.astro` |

Communs : `layouts/Base.astro`, `components/mise-en-page/` (Navigation, PiedDePage, BandeauDemo, BandeauReassurance, Polices), `lib/navigation.ts` (drapeau `existe` : une page absente n'est jamais liée), `lib/catalogue.ts`, `lib/donnees.ts`, `content.config.ts` (schémas). Le pied de page lie les 6 pages légales (vérifié dans `dist/index.html`).

## 4. Mécanismes de conformité dans le code

| Mécanisme | Où | Comportement |
|---|---|---|
| Mode démo global | `content/reglages/accueil.yaml` (`mode_demo`), `lib/donnees.ts` | Le build échoue (« V15 ») si `mode_demo: true` alors qu'un produit est `en-vente`. |
| Bandeau démo | `components/mise-en-page/BandeauDemo.astro` | Non masquable, en haut de toutes les pages : « Boutique en préparation… rien n'est en vente pour le moment. » |
| Cohérence démo | `content.config.ts` (règle V11) | `demo: true` exige `statut: presentation`, et inversement. |
| Achat désactivé | `lib/catalogue.ts` `etatAchat()`, `components/produit/BlocAchat.astro`, `BarreAchatMobile.astro` | Lien d'achat seulement si `demo: false` + `en-vente` + lien `https://buy.stripe.com/`. Sinon bouton désactivé « Non disponible : produit de démonstration ». Aucune clé ni SDK Stripe. |
| Pas d'`Offer` en JSON-LD | `pages/maquettes/[slug].astro` (l. 268 et suivantes), `components/produit/DonneesStructurees.astro` | `Product` sans `offers` sur les démos ; 0 occurrence de `offers` dans `dist/maquettes/`. URL relatives (pas de `site`). |
| « Prix indicatif de démonstration » | `BlocAchat.astro` l. 69, `CarteProduit.astro` l. 95, `accueil/QuestionnaireAccueil.astro` l. 98 | Sous chaque prix de démo. |
| Mention rendus 3D | `accueil/Comparateur.astro`, `MaquettesDuMoment.astro`, `Offrir.astro` ; fiches : textes alternatifs « Rendu 3D de… » et phrase « rendus 3D, pas des photos d'un produit réel » | Accueil : « Rendu(s) 3D de démonstration ». Sur la fiche, la formule exacte « Rendus 3D de démonstration » (leçon n° 11) n'apparaît pas : à contrôler. |
| « À VÉRIFIER » masqués sur les démos | `components/produit/Donnee.astro`, `lib/catalogue.ts` (`contientAVerifier`, `texteDemo`) | Valeur absente ou phrase retirée ; ligne masquée par le parent. Bloc sécurité : « Informations du fabricant affichées dès la mise en vente de ce produit. » (`BlocSecurite.astro`). |
| Build bloqué si `demo: false` | `content.config.ts` l. 137-146 | Fiche réelle non brouillon avec « À VÉRIFIER » : échec avec la liste des champs. Doublé par `tools/verifier_livrables.py` (contrôle 3). |
| `[À VALIDER]` boutique | `components/ui/Valeur.astro` (+ `lib/donnees.ts` `estAValider`) | Valeur de `boutique.yaml` inconnue : `<mark class="a-valider">[À VALIDER : note]</mark>`. |
| Textes légaux manquants | `components/ui/AValider.astro` | Marqueur en ligne ou encadré (`bloc`) qui dit quoi fournir et où (aucun texte légal inventé). |
| Rétractation | `pages/renoncer-au-contrat.astro` | Formulaire visible mais `<fieldset disabled>`, sans `action` ni API ; renvoi vers email / courrier / formulaire type. |
| Lettre de l'atelier | `components/atelier/LettreAtelier.astro` | `lettre.active: false` : champ et bouton `disabled`, « Bientôt », « aucune adresse n'est collectée ». Aucune contrepartie. |
| Aucun cookie ni stockage | `scripts/*.ts`, `BoutonPause.astro`, `QuestionnaireAccueil.astro` | 0 `localStorage`, `sessionStorage`, `document.cookie`, `indexedDB` dans `src/`. Filtres en paramètres d'URL. Aucun script de suivi. |
| Aucune ressource externe | `dist/` | Seuls 3 liens sortants cliquables : Légifrance (CGV), cnil.fr, politique cookies de Stripe. Polices et GSAP servis localement. |
| Reduced-motion et sans JS | `layouts/Base.astro` l. 44, `styles/global.css` l. 103 et 211, `scripts/mouvement.ts`, `scripts/accueil.ts`, `scripts/collection.ts` | Classe `js-anim` posée seulement sans `prefers-reduced-motion: reduce` ni économie de données ; sinon GSAP n'est pas chargé et tout le contenu est visible. Questionnaire : 27 pages de repli sans JS. Zoom : lien vers l'image 1600 px sans JS. |
| Bouton pause | `components/accueil/BoutonPause.astro` (`data-pause-global`), `collection/HerosCollection.astro` (`data-pause-animations`), `scripts/etat-animation.ts` | « Mettre en pause les animations » sur l'accueil et les collections ; état non mémorisé. |

## 5. Ce qui manque et écarts à la spécification

1. **Vue 3D au clic** (décidée dans `knowledge/decisions.md`) : non faite. `components/produit/Vue3D.astro` n'est qu'un emplacement (affiché si `modele_3d` est renseigné, aucun ne l'est). Ni Three.js ni modèles `.glb` exportés depuis `studio/`. Décision humaine attendue (construire ou abandonner pour le lancement).
2. **Vue éclatée** : SVG « Illustration de principe » (`accueil/VisuelEclate.astro`) au lieu des calques WebP et de `vue-eclatee.json` de la spec.
3. **Accroches calculées (audit N2)** : héros « Des pièces de bois prédécoupées… » au lieu de « découpés au laser » (non vrai pour tous les produits) ; compteur de pièces masqué (`nombre_pieces` inconnu) ; « Livraison suivie » absente (`livraison.suivi` inconnu).
4. **Fiche produit** : zoom en fondu (pas depuis l'image), un toucher = x2 (pas de double-toucher), pas d'aperçu au survol des vignettes, barre d'achat mobile non masquée au défilement, pas d'image de partage, `site` vide dans `astro.config.mjs` (URL relatives en JSON-LD et canoniques).
5. **Catalogue** : pas d'animation de réorganisation des filtres (filtres en liens, sans JS).
6. **`/atelier/`** : héros avec les planches du comparateur (rendu « mains et planches » absent) ; 3 conseils en `[À VALIDER]`.
7. **Formulaires** : rétractation et lettre non branchés (pas d'API, pas de service d'emails). Pas de page `/merci/`.
8. **Pas de script de vérification des liens** dans `site/` (à ajouter, par exemple `npm run liens`).
9. **Textes rédigés par les agents à relire** : intro d'« Idées cadeaux », 2 raccourcis de `/contact/` (« Une question avant l'achat », « Ma commande »).
10. **CGV** : formulaire type de rétractation écrit de mémoire (marqué « à contrôler mot pour mot ») ; encadré D. 211-2 non reproduit (lien Légifrance) ; PDF des CGV à produire.

## 6. `[À VALIDER]` restants

Décompte des occurrences dans `dist/` : CGV 36, mentions légales 19, confidentialité 19, rétractation 12, livraison et retours 12, FAQ 10, contact 10, accueil 6, cookies 6, à propos 6, atelier 5, chaque fiche 3, collections 2 ou 3, les autres pages 1 (le nom de l'EI en pied de page).

- **Données boutique** (`content/reglages/boutique.yaml`, toutes `[À VALIDER]`) : nom de l'EI, SIREN, RCS, adresse, email, téléphone, directeur de publication ; hébergeur (raison sociale, adresse, téléphone) ; IDU REP jouets et emballages ; médiateur (nom, adresse, site) ; livraison (frais, transporteur, suivi, délai d'expédition) ; retours (adresse, frais) ; délais de réponse du service client ; délai de l'email de confirmation ; moyens de paiement ; durée d'archivage ; service d'emails ; date de version des textes légaux. Seules valeurs renseignées : zone « France métropolitaine », délai maximal 14 jours, mention TVA (à confirmer par un professionnel).
- **Textes** (`AValider`) : encadré D. 211-2 (CGV) ; formulaire type R221-1 et sa version PDF ; PDF des CGV ; clause de juridiction ; formulation du remboursement (CGV) ; texte « À propos » et engagements ; base légale, durées de conservation, rôle de Stripe et Cloudflare et transferts hors UE (confidentialité) ; tableau des cookies après inventaire du site déployé ; adresse de la politique cookies de Stripe ; formulation des mentions légales.
- **Contenus** : 3 conseils de l'atelier (`lib/atelier.ts`), fréquence de la lettre, délai de réponse dans la FAQ (aussi sur l'accueil).
- **Collections** (`pages/collections/[slug].astro` l. 131 et 146) : « mécanisme de N modèles » et « nombre de pièces » affichés en `[À VALIDER]`.

## 7. À faire vérifier en priorité par conformite-qa

1. **`/collections/*`** (`pages/collections/[slug].astro` l. 120-150) : les statistiques du héros affichent `[À VALIDER : nombre de pièces]` et `[À VALIDER : mécanisme de N modèles]` alors que les produits sont des démos. Incohérence possible avec la règle de `decisions.md` (valeurs inconnues masquées sur les démos). À trancher : masquer ou garder.
2. **`/renoncer-au-contrat/`** et **`components/legal/FormulaireTypeRetractation.astro`** : formulaire désactivé (est-ce acceptable tant que rien n'est en vente ?), formulaire type à comparer mot pour mot à l'annexe R221-1, accès en un clic depuis le pied de page.
3. **`/cgv/`** (36 marqueurs) : 17 articles, absence de l'encadré D. 211-2, clauses « avis d'un professionnel » ; **`/mentions-legales/`** et **`/confidentialite/`**.
4. **Une fiche produit**, par exemple `/maquettes/locomotive-vapeur/` (`BlocAchat.astro`, `BarreAchatMobile.astro`, `BlocSecurite.astro`, `Caracteristiques.astro`, `Donnee.astro`) : prix TTC + mention démo, bouton désactivé (aussi sur mobile), 14 ans et plus avec avertissements, délai, bloc sécurité, aucun « À VÉRIFIER », aucune `offers` dans le JSON-LD, mention des rendus 3D (formule exacte de la leçon n° 11 absente).
5. **Accueil** (`components/accueil/HerosAccueil.astro`, `Offrir.astro`, `RecitEpingle.astro`, `lib/accueil.ts`) : chaque accroche vraie pour tous les produits (audit N2), aucune promesse de date de Noël, aucune fausse urgence.
6. **`/cookies/`** et absence réelle de traceurs : confirmer que `dist/` ne charge rien d'externe et ne dépose aucun cookie (le tableau reste à remplir après déploiement Cloudflare).
7. **Questionnaire** (`lib/questionnaire.ts`) : résultats sans pression commerciale, pages `noindex`, aucun stockage.
8. **Textes rédigés par les agents** : intro d'« Idées cadeaux » (`pages/collections/[slug].astro` / collection dans `lib/catalogue.ts`), raccourcis de `/contact/`, FAQ (`components/aide/QuestionFaq.astro`, « échelle établie à partir du nombre de pièces… »).
9. **Accessibilité** : contrastes du bandeau démo et des marqueurs `a-valider`, navigation au clavier du zoom (`Zoom.astro`) et du comparateur (`Comparateur.astro`), bouton pause.

## 8. Ce qui demande l'humain

- Valeurs de `boutique.yaml` (identité de l'EI, SIREN, adresse, médiateur, REP, hébergeur, livraison, retours).
- Décision sur la vue 3D au clic.
- Compte Stripe (Payment Links), service d'emails (rétractation, lettre), hébergement Cloudflare, nom de domaine (puis `site` dans `astro.config.mjs`). Rien n'est déployé ni encaissable aujourd'hui.
- Relecture juridique des clauses marquées « avis d'un professionnel ».
