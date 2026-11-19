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
```
Captures : `site/outils/captures-produit.mjs` sert `dist/` sur un port libre et utilise `playwright-core` de `qg/studio/node_modules` (Chromium installé par Playwright, comme `qg/studio/tests/qg-page.test.js`) ; depuis un worktree sans ces dépendances, il prend celles du dépôt principal. Il échoue si la page déborde horizontalement ou lève une erreur JavaScript.
Une fiche `demo: false` qui contient encore « À VÉRIFIER » fait échouer `npm run build` (le message liste les champs à compléter). Sur une fiche `demo: true`, ces valeurs ne sont pas affichées.

**Vérification des liens** : `npm run build` lance ensuite `tools/verifier_liens.py` (script `postbuild`), qui parcourt `site/dist/` et échoue s'il trouve un lien interne (href, src, srcset) vers une page ou un fichier absent, ou une ancre `#id` absente de la page cible.
À la main : `npm run verifier-liens` dans `site/`, ou `py tools/verifier_liens.py` depuis la racine. Interpréteur essayé : `py`, puis `python3`, puis `python`.
Sans Python, la vérification est sautée avec un avertissement ; `VERIFIER_LIENS_OBLIGATOIRE=1` en fait un échec.
