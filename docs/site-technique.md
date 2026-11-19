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
data/produits/*.json       (racine du dépôt) produits lus par la page /produit/<slug>/ (format ci-dessous)
data/avis.json             (racine) avis clients { avis: [...] } ; vide tant qu'il n'y a pas de vrai avis
data/commandes.json        (racine) commandes réelles importées de Stripe ; seule source qui valide un avis
site/src/lib/produits-json.ts   lecture de data/ à la construction (node:fs), validation, filtrage des avis
site/src/pages/produit/[slug].astro  page produit modèle (V1-1), une par fichier de data/produits/
site/src/components/produit/FicheProduitJson.astro, Avis.astro  fiche et avis de cette page
```

## Page produit modèle /produit/<slug>/ (données de data/)
Format d'un fichier `data/produits/<slug>.json` : `slug, demo, nom, description, prix_ttc (nombre ou null), frais_port_ttc, delai_livraison_jours {min,max}, age_minimum, gpsr {fabricant, responsable_ue : {nom, adresse, email}, reference, avertissements[]}, visuels [{src, alt, type: illustration|photo|rendu-3d}], paiement {lien, actif}`. Texte inconnu : « À VÉRIFIER » ; nombre inconnu : null.

`npm run build` **échoue** (message listant les champs) si : un produit `demo: true` a un lien de paiement ou `paiement.actif: true` ; un produit `demo: false` contient « À VÉRIFIER » ou a un prix, des frais de port ou un délai maximum à null, ou un paiement actif sans lien `https://buy.stripe.com/` ; `age_minimum` est inférieur à 14 ; le JSON est mal formé. Dossier ou fichier absent ou vide : aucune page, pas d'erreur. Le site ne lit jamais `data/commandes.exemple.json`.

Sur une démonstration : bandeau « Page de démonstration, produit non vendu », `noindex, nofollow` (prop `noindex` de `Base.astro`), bouton `<button disabled aria-disabled="true">` sans lien, valeurs inconnues affichées « Prix non fixé » ou « Non communiqué ». Mention « Illustration » ou « Rendu 3D de démonstration » sous chaque visuel de ce type. Le site n'a pas de sitemap.

**Règle des avis** : un avis de `data/avis.json` n'est affiché que si sa `reference_commande` est non vide et correspond à une commande `statut: "payee"` de `data/commandes.json` portant sur le même produit, avec une note entière de 1 à 5. Sinon il est ignoré et un avertissement `[avis] ...` s'écrit dans la console de construction. Aucun avis : « Aucun avis pour l'instant ». Avis affichés : mention « lié à une commande vérifiée », note écrite en toutes lettres (pas d'étoiles).

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
npm run build       # doit passer sans erreur ni avertissement (59 pages avec /produit/exemple-demo/)
npm run preview     # aperçu de dist/ sur http://localhost:4321/
```
Une fiche `demo: false` qui contient encore « À VÉRIFIER » fait échouer `npm run build` (le message liste les champs à compléter). Sur une fiche `demo: true`, ces valeurs ne sont pas affichées.

**Vérification des liens** : `npm run build` lance ensuite `tools/verifier_liens.py` (script `postbuild`), qui parcourt `site/dist/` et échoue s'il trouve un lien interne (href, src, srcset) vers une page ou un fichier absent, ou une ancre `#id` absente de la page cible.
À la main : `npm run verifier-liens` dans `site/`, ou `py tools/verifier_liens.py` depuis la racine. Interpréteur essayé : `py`, puis `python3`, puis `python`.
Sans Python, la vérification est sautée avec un avertissement ; `VERIFIER_LIENS_OBLIGATOIRE=1` en fait un échec.
