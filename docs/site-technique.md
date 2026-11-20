# Site de la boutique : choix techniques

**Décision de l'humain du 2026-11-12 : site maison + paiement Stripe**, plutôt qu'une plateforme fermée, pour que l'équipe d'agents puisse construire et gérer toute la boutique par le code.

## Pile technique
| Brique | Choix | Pourquoi |
|---|---|---|
| Générateur de site | **Astro** (version stable figée dans `site/package.json`) | Site statique très rapide ; produits gérés comme des fichiers de contenu |
| Style | **Tailwind CSS** + composants dans l'esprit **shadcn/ui** + icônes **Lucide** (aucun emoji) | Exigence de l'humain : voir `knowledge/direction-design.md` |
| Animations | **GSAP + ScrollTrigger** (narration au défilement), Lenis en option ; WebGL seulement sur l'accueil, chargé en différé | Direction design v2 ; prototype de référence `docs/reference/prototype-accueil.html` |
| Visuels 3D | **Three.js** dans `studio/`, rendu automatisé avec Playwright | Visuels de démonstration et d'ambiance, voir `studio-visuel` |
| Hébergement | **Cloudflare** (hébergement de site statique gratuit) | 0 €/mois, rapide, déjà utilisé par l'humain |
| Paiement | **Stripe Payment Links** au lancement (un lien de paiement par produit) ; panier avec Stripe Checkout plus tard si besoin | Pas d'abonnement ; 1,5 % + 0,25 € par carte standard de l'EEE (tarif Stripe consulté le 2026-11-12) |
| Formulaires (rétractation, contact) | À définir par `architecte-web` et `developpeur-web` (fonction serverless gratuite ou service de formulaire) | Le bouton de rétractation en ligne est obligatoire |
| Nom de domaine | Plus tard (sous-domaine gratuit en attendant) | Coût annuel à valider par l'humain |

## Spécification à suivre
Voir `knowledge/decisions.md` : spécification v2 de `architecte-web` **corrigée par** l'audit v2 de `conformite-qa` (l'audit l'emporte), décisions en cours et affichage des produits de démonstration. Le format réel des fiches produits est celui du §5.4 de la spécification v2 (le format ci-dessous n'est qu'un résumé).

## Organisation
```
site/                      code du site (Astro)
site/src/content/produits/ une fiche produit = un fichier
site/src/pages/            pages (maquettes/, maquettes/niveau/, collections/ : catalogue, étape 2)
site/src/components/produit/    carte, grille, galerie, zoom, bloc d'achat, sécurité du produit
site/src/components/collection/ héros et visuels animés des collections
site/src/lib/catalogue.ts  collections, niveaux, statistiques calculées, état d'achat
site/src/components/accueil/    sections de l'accueil cinématique (étape 3, T35)
site/src/components/questionnaire/ étapes et résultats de « Trouver ma maquette »
site/src/components/atelier/    bloc « La lettre de l'atelier » (désactivé tant que lettre.active: false)
site/src/components/aide/       questions de FAQ partagées entre /faq/ et l'accueil
site/src/lib/accueil.ts    réglages de l'accueil et accroches globales calculées (vraies pour tous les produits publiés)
site/src/lib/questionnaire.ts   règle de recommandation (pure, utilisée à la construction et dans le navigateur)
site/src/lib/atelier.ts    titres des conseils (textes à rédiger)
site/src/scripts/accueil*.ts    animations GSAP de l'accueil (chargées seulement si l'animation est permise)
site/src/content/reglages/boutique.yaml données de la boutique ; `retractation.en_ligne_active` (false tant que le formulaire de rétractation n'envoie rien)
site/src/content/reglages/accueil.yaml  produits mis en avant, sélection du moment, FAQ, lettre, Offrir (schéma validé)
site/public/               images et fichiers statiques (produits/<slug>/<vue>.webp, ambiance/, _headers : X-Robots-Tag noindex)
site/outils/verifier-liens.mjs  lanceur de tools/verifier_liens.py après la construction (postbuild)
tools/verifier_liens.py    vérification des liens internes et des ancres de site/dist/ (Python standard)
studio/                    production des visuels 3D (Three.js + rendu automatisé), voir agent studio-visuel
data/                      données partagées site + QG (racine du dépôt), lues par le site à la construction (node:fs)
data/produits/<slug>.json  un produit du modèle de page (V1-1) ; exemple-demo.json = produit de démonstration
data/avis.json             avis clients (V1-2), [] au départ ; champ produit = slug
site/src/pages/produits/[slug].astro   route /produits/<slug>/ : une page par fichier de data/produits/
site/src/components/produit-modele/    FicheProduit, BlocGpsr, Avis, Coordonnees, ADefinir
site/src/lib/produit-modele.ts  validation pure d'un produit (erreursProduit)
site/src/lib/avis.ts       filtrage pur des avis (avisDuProduit, raisonRejet, noteMoyenne)
site/src/lib/donnees-partagees.ts  lecture de data/ (remonte depuis le dossier courant ; BOUTIQUE_DATA pour forcer)
site/outils/verifier-produit-avis.test.mjs  tests (npm test)
site/outils/captures-produit.mjs  captures pleine page 390 et 1280 px (npm run captures)
site/outils/captures-animations.mjs  captures avant/après des composants animés et poids JS par page (V2-2)
site/src/components/animes/  îlots React (V2-2) : 4 copies React Bits (Aurora, SplitText, ScrollStack, Carousel) et leurs enveloppes
```

## Produits du modèle de page (data/produits/)
Champs : `slug` (= nom du fichier), `nom`, `demo`, `prix_ttc` (nombre ou null), `frais_port_ttc` (nombre, null ou « sans objet »), `delai`, `age_minimum`, `gpsr` { `fabricant` {nom, adresse, contact}, `personne_responsable_ue` {…}, `avertissements` [liste], `reference` }, `description`, `visuels` [{src, alt}], `paiement` {actif, url}. Inconnu = `null`.
- La construction échoue si un produit `demo: false` a un champ obligatoire à null, `paiement.actif` faux ou pas d'url https ; ou si un produit `demo: true` a `paiement.actif: true` ou une url.
- Démonstration : bandeau « Page de démonstration, produit non vendu », `noindex, nofollow`, bouton de paiement inactif (aria-disabled, sans lien), valeur null affichée « À définir », aucun avis.
- Avis affiché seulement si : `reference_commande` non vide et sans « exemple », « demo », « test » ; note entière 1 à 5 ; texte ; date ISO réelle ; auteur = prénom et/ou initiale. Un avis écarté est signalé en console à la construction. Sans avis : « Aucun avis pour le moment. Seuls les clients ayant commandé peuvent en laisser un. » et un lien « Comment nous vérifions les avis », ni note moyenne ni étoiles.

## Format d'une fiche produit (première version, à affiner par architecte-web)
```yaml
---
nom: ""
slug: ""
prix_ttc: 0          # en euros
statut: brouillon    # brouillon | en-vente | rupture
demo: false          # true = produit de démonstration (jamais en vente, bandeau affiché)
collections: []      # mecanique | vehicules | automates | idees-cadeaux | pour-debuter
delai_livraison_max_jours: 14
age_minimum: 14
difficulte: ""       # facile | moyen | expert
temps_assemblage: ""
dimensions: ""
contenu_boite: []
lien_paiement_stripe: ""   # Payment Link, jamais de clé secrète
photos: []          # vues : face, trois-quarts, detail, dessus, situation, boite
modele_3d: ""       # optionnel : fichier .glb pour la vue 3D tournante
securite:
  fabricant: ""
  adresse_fabricant: ""
  email_fabricant: ""
  responsable_ue: ""
  reference: ""
  avertissements: []
---
Description du produit (rédigée par redacteur-catalogue).
```

## Règles
- Aucun secret dans le dépôt : un Payment Link est public, une clé secrète Stripe ne l'est jamais.
- Rien n'est mis en ligne ni encaissé sans l'accord de l'humain (compte Stripe et SIRET nécessaires pour encaisser).

## Vérifier le site en local
```
cd site
npm install
npm run build       # doit passer sans erreur ni avertissement (59 pages avec /produits/exemple-demo/)
npm run preview     # aperçu de dist/ sur http://localhost:4321/
npm test            # règles des produits et des avis (node --test, Node 22.18+)
npm run captures -- exemple-demo 2026-11-19   # après la build : outputs/captures/<date>-produit-demo-390.png et -1280.png
node outils/captures-animations.mjs apres --reduit --positions   # après la build : captures V2-2 et poids-js.json
```
Captures : `site/outils/captures-produit.mjs` sert `dist/` sur un port libre et utilise `playwright-core` de `qg/studio/node_modules` (Chromium installé par Playwright, comme `qg/studio/tests/qg-page.test.js`) ; depuis un worktree sans ces dépendances, il prend celles du dépôt principal. Il échoue si la page déborde horizontalement ou lève une erreur JavaScript.
Une fiche `demo: false` qui contient encore « À VÉRIFIER » fait échouer `npm run build` (le message liste les champs à compléter). Sur une fiche `demo: true`, ces valeurs ne sont pas affichées.

**Vérification des liens** : `npm run build` lance ensuite `tools/verifier_liens.py` (script `postbuild`), qui parcourt `site/dist/` et échoue s'il trouve un lien interne (href, src, srcset) vers une page ou un fichier absent, ou une ancre `#id` absente de la page cible.
À la main : `npm run verifier-liens` dans `site/`, ou `py tools/verifier_liens.py` depuis la racine. Interpréteur essayé : `py`, puis `python3`, puis `python`.
Sans Python, la vérification est sautée avec un avertissement ; `VERIFIER_LIENS_OBLIGATOIRE=1` en fait un échec.

## Composants animés (V2-2)
Choix de `architecte-web` du 2026-11-20 (statut : à valider). Spécification complète : `outputs/2026-11-20-architecte-web-composants-animes.md`.
- **4 composants retenus, tous de React Bits** (version gratuite, jamais React Bits Pro, qui est payant).
- Intégration : `@astrojs/react` ; chaque composant est un îlot React chargé en `client:visible`. Le reste du site reste en Astro et en GSAP sans React.
- Règles : `prefers-reduced-motion` donne une version statique complète ; le bouton Pause de l'accueil arrête le fond animé ; aucun emoji ; icônes Lucide (`lucide-react`) à la place des icônes d'origine ; couleurs prises dans les variables de `site/src/styles/global.css` ; aucun effet ne couvre le prix ni le bouton d'achat.
- Chaque fichier recopié garde en commentaire d'en-tête la source, la licence « MIT + Commons Clause », la mention « Copyright (c) 2026 David Haz » et le commit d'origine.
- Commons Clause : on peut utiliser les composants dans le site, y compris pour vendre nos produits. On ne peut **pas** vendre ni redistribuer les composants eux-mêmes (pas de pack de composants ni de modèle de site revendu).
- Le poids JS par page se mesure sur la build et va dans le rapport de `developpeur-web`. Les poids ci-dessous non mesurés restent « À VÉRIFIER ».

| Composant | Source | Licence | URL de preuve (lue le 2026-11-20) | Dépendances npm | Place sur le site |
|---|---|---|---|---|---|
| Aurora (fond) | React Bits, https://reactbits.dev/backgrounds/aurora | MIT + Commons Clause, usage commercial autorisé | https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md | `react` seul (WebGL natif) | Accueil, fond du héros |
| SplitText (texte) | React Bits, https://reactbits.dev/text-animations/split-text | MIT + Commons Clause, usage commercial autorisé | même URL ; GSAP : https://gsap.com/standard-license | `gsap` (déjà présent, 3.15.1), `@gsap/react` 2.1.2 (licence standard GSAP, gratuite en usage commercial) | Accueil, titre du héros |
| ScrollStack (cartes empilées) | React Bits, https://reactbits.dev/components/scroll-stack | MIT + Commons Clause, usage commercial autorisé | même URL | `react` seul | Accueil, sélection de produits |
| Carousel | React Bits, https://reactbits.dev/components/carousel | MIT + Commons Clause, usage commercial autorisé | même URL | `react` ; icônes d'origine `@hugeicons/*` **remplacées** par `lucide-react` (ISC) | Fiche produit, visuels |
| Socle | `@astrojs/react` **5.0.7** (et non 7.1.9, voir ci-dessous), `react` et `react-dom` 19.3.1, `@gsap/react` 2.1.2, `lucide-react` 1.72.0 ; `@types/react` et `@types/react-dom` 19.3.0 en dépendances de développement | MIT (lucide-react : ISC) | https://registry.npmjs.org/@astrojs/react/5.0.7 | `@vitejs/plugin-react` 5.2.0 (installé par `@astrojs/react`) | Toutes les pages qui ont un îlot |

Mise en œuvre (`developpeur-web`, 2026-11-20) :
- **Version de `@astrojs/react`** : 7.x et 6.x dépendent de Vite 8 (`@vitejs/plugin-react` 6, ou `vite` ^8 directement) et vont avec Astro 7. Avec Astro 6.4.8 et Vite 7.3.8 figés, la bonne version est **5.0.7** (`vite` ^7.3.2, même `@astrojs/internal-helpers` 0.10.0 qu'Astro 6.4.8). Build sans avertissement.
- `astro.config.mjs` : `react({ include: ['**/components/animes/**'] })` ; `tsconfig.json` : `jsx: react-jsx`.
- Îlots : `FondHeros`, `TitreHeros`, `PileProduits` (accueil) et `CarrouselVisuels` (fiche `/produits/<slug>/`, seulement à partir de 2 visuels). Leur rendu serveur est toujours la version statique ; l'animation n'est montée qu'après hydratation, si `html.js-anim` est présent et sans mouvement réduit (`components/animes/etat.ts`).
- La pause de l'accueil est lue sur la classe `html.anim-pause` (MutationObserver), sans dépendre du module `scripts/etat-animation.ts`.
- `PileProduits` reçoit les `CarteProduit` d'Astro en emplacements nommés `carte0` à `carte4` (noms fixes : Astro refuse un nom calculé).
- Fiche produit : un script en ligne pose `html.js-visuels` ; avec JavaScript, seul le premier visuel est montré avant le montage du carrousel (place des commandes réservée) : décalage de mise en page mesuré à 0.

Sources écartées :
| Source | Licence lue | URL de preuve | Décision |
|---|---|---|---|
| Skiper UI (skiper-ui.com) | Aucune licence ouverte. Conditions d'utilisation : « All intellectual property rights are reserved », usage « for your own personal use », redistribution interdite. Composants « Premium » payants (129 $) | https://skiper-ui.com/docs/terms-of-service, https://skiper-ui.com/pricing | **Refusé** : pas d'usage commercial clairement autorisé |
| Vengeance UI (vengenceui.com) | MIT, « Copyright (c) 2025-2026 Ashutoshx7 » | https://raw.githubusercontent.com/Ashutoshx7/VengenceUI/main/LICENSE | Licence acceptable, mais **aucun composant retenu** : prévu pour Next.js et Framer Motion (une dépendance de plus), et React Bits couvre déjà les 4 besoins |
| React Bits Pro | Offre payante | https://github.com/DavidHDev/react-bits (README) | **Refusé** (payant) |
