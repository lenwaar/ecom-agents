---
agent: architecte-web
statut: validé   # toujours cette valeur
valide_par: humain
date_validation: 2026-11-13
date: 2026-11-12
version: 2, partie 2 (suite de outputs/2026-11-12-architecte-web-conception-boutique-v2.md)
sources: [voir la partie 1 et la section 10 ci-dessous]
prochaine-etape: conformite-qa puis developpeur-web
---

# Conception de la boutique, v2 (partie 2 : sections 5 à 10)

> Suite directe de `outputs/2026-11-12-architecte-web-conception-boutique-v2.md` (sections 1 à 4). Mêmes conventions : `[...]` = valeur à fournir, **[PRO]** = confirmation juridique ou comptable.

## 5. Fiche produit type et format des données produit

Registre **boutique claire** : la clarté passe avant l'animation (`direction-design.md`). Pas de GSAP sur la fiche ; seules des transitions CSS de 150 à 400 ms.

### 5.1 Bandeau « Produit de démonstration » (si `demo: true`)

- Position : sous la barre de navigation, au-dessus du fil d'Ariane, pleine largeur, non masquable. Fond `#F1F0EB`, bordure gauche 3 px `#8A6A3A`, icône `Info`, texte `#111827` 15 px.
- Texte : « **Produit de démonstration.** Ce modèle sert à présenter la boutique : il n'est pas en vente. Les images sont des rendus 3D, pas des photos d'un produit réel. »
- Bouton d'achat remplacé par un bouton désactivé (`aria-disabled="true"`, sans `href`, opacité 50 %, curseur interdit) : « Non disponible : produit de démonstration ». Barre collante mobile : même bouton désactivé.
- Badge « Démonstration » sur toutes les cartes de ce produit (catalogue, collections, questionnaire, autres maquettes).
- Données structurées : **aucune** `Offer` pour un produit de démonstration (pas de prix dans les résultats de recherche).
- Le bloc « Sécurité du produit » affiche « Informations de démonstration » à la place des données du fabricant tant que `demo: true`.

### 5.2 Ordre des blocs (mobile, de haut en bas)

| # | Bloc | Contenu et règles | Champs |
|---|---|---|---|
| 0 | Bandeau démonstration | §5.1, seulement si `demo: true` | `demo` |
| 1 | Fil d'Ariane | Accueil › [Collection principale] › [nom] (masqué sous 360 px, gardé en données structurées) | `nom`, `collections[0]` |
| 2 | **Galerie** | §5.3 : 6 vues (+ étiquette pour un vrai produit), zoom plein écran, vue 3D en option. Ordinateur : galerie à gauche (60 %), colonne d'achat collante à droite (40 %) avec les blocs 3 à 7 | `vues`, `modele_3d` |
| 3 | Titre et badges | H1 = `nom` (« Maquette en bois [nom] à assembler »). Badges : « 14 ans et plus » (texte complet, pas seulement « 14+ »), niveau (jauge 1 à 3 + texte), `Clock` « [min] à [max] h » | `nom`, `age_minimum`, `difficulte`, `temps_assemblage_*` |
| 4 | Prix | Prix final 28 px 600 : « 39,90 € ». Dessous, 14 px : « Prix final. TVA non applicable, art. 293 B du CGI » (validé, audit point 17). Promotion valide seulement selon §5.7 | `prix_ttc`, `promotion` |
| 5 | Livraison | `Truck` « Livraison suivie : [FRAIS] € par commande, quel que soit le nombre de maquettes (ou « offerte ») · reçue en [X] à [Y] jours après votre commande » ; « Expédiée depuis [lieu] » si renseigné | `frais_livraison_ttc`, `delai_livraison_*`, `expedie_depuis` |
| 6 | Bouton d'achat | Bouton principal pleine largeur « Acheter » (bleu nuit). Dessous : `LockKeyhole` « Paiement sur la page sécurisée de Stripe, notre prestataire. Nous ne voyons jamais vos données bancaires. » ; liens « CGV » et « Livraison et retours ». Rupture : bouton désactivé « Indisponible pour le moment » (« Bientôt de retour » seulement si `reassort_prevu`), lien « Voir les autres maquettes ». Démonstration : §5.1 | `lien_paiement_stripe`, `statut`, `reassort_prevu` |
| 7 | Réassurance (droits formulés comme des droits) | `RotateCcw` « Droit de rétractation : 14 jours après réception, comme pour tout achat en ligne » ; `Wrench` « Pièce manquante ou abîmée à la réception : garantie légale de conformité, une photo par email suffit » ; `Gift` « Message cadeau possible au paiement » (si actif) ; `Mail` « Une question ? [EMAIL] » | réglages |
| 8 | Ce que vous allez fabriquer | Exactement 3 bénéfices (titre + 1 phrase), sans superlatif ni allégation bien-être | `benefices` |
| 9 | Description | 150 à 300 mots, intertitres H2 (`redacteur-catalogue`) | corps |
| 10 | Vidéo du mécanisme | Muette, 5 à 15 s, affiche, contrôles, lecture au toucher (jamais automatique sur la fiche). Démonstration : animation rendue, légende « Animation de démonstration » | `video` |
| 11 | Caractéristiques | Tableau : niveau (avec la définition de notre échelle et lien vers l'échelle), temps, nombre de pièces, dimensions monté (L × l × h cm), poids, matériaux, mécanisme, colle nécessaire, outils nécessaires, outils fournis | champs produit |
| 12 | Contenu de la boîte | Liste à puces + lien « Voir la vue Dans la boîte » (ouvre la galerie sur la vue `boite`) | `contenu_boite` |
| 13 | **Sécurité du produit** (GPSR) | Toujours ouvert, `ShieldCheck`, H2. « Âge : 14 ans et plus. Ne convient pas aux enfants de moins de 14 ans. » ; fabricant (nom ou marque, adresse postale, email) ; personne responsable dans l'UE si fabricant hors UE ; importateur si c'est nous ; référence (modèle, lot) ; avertissements en français (textes exacts du fabricant) ; lien « Voir la photo de l'étiquette » (vue `etiquette`) | `securite.*` |
| 14 | Marque (produit de marque authentique seulement) | Texte de l'audit point 20 : « Maquette de la marque [Marque], achetée auprès de [fabricant / distributeur de la marque dans l'UE]. Rouage & Laiton est un revendeur indépendant : nous ne sommes ni la marque, ni son représentant, ni son partenaire. » Marque en texte seulement : pas de logo ni de visuel de la marque sans autorisation écrite | `marque` |
| 15 | Livraison et retours | 4 lignes (zone, délai, frais par commande, droit de rétractation 14 jours + frais de retour) + lien | réglages + produit |
| 16 | FAQ du produit | 3 à 6 accordéons | `faq` |
| 17 | Avis | **Absent** tant qu'il n'y a pas de vrais avis (modalités futures : v1 §5.5, inchangées) | — |
| 18 | Pour aller plus loin | (a) « Après celle-ci » : 1 produit de la même collection au niveau suivant (fait : niveau et temps) ; (b) lot contenant ce produit s'il existe (§5.6) ; (c) 2 autres maquettes de la même collection. Cartes secondaires, aucun bouton principal | `collections`, `difficulte`, `lots` |

**Barre d'achat collante (mobile)** : apparaît quand le bouton du bloc 6 sort de l'écran (`IntersectionObserver`), disparaît quand il revient ou que le pied de page est visible. Contenu : vignette 40 px, `nom_court`, prix, bouton « Acheter ». 64 px + zone de sécurité de l'encoche. Entrée `translateY(100%) → 0` 250 ms (instantanée sans animation). Sans JS : pas de barre.

**Lien « Acheter »** : `lien_paiement_stripe` + `?locale=fr&utm_content=[slug]` ; `utm_source`, `utm_medium`, `utm_campaign` recopiés seulement s'ils sont dans l'URL de la page (filtrés : lettres, chiffres, tirets, soulignés, 150 caractères maximum). Aucun stockage.

**SEO** : `seo.titre` ≤ 60, `seo.description` ≤ 155, URL canonique, image de partage = vue `trois-quarts` 1200 × 630. `Product` + `offers` (prix, EUR, disponibilité, `shippingDetails`, `hasMerchantReturnPolicy`), `brand` seulement pour une marque, **jamais** `aggregateRating` ni `review` sans vrais avis, aucune `Offer` en démonstration.

### 5.3 Galerie, zoom et vue 3D

**Vues et ordre** (noms de `catalogue-demo.md`, fichiers `site/public/produits/[slug]/[vue]-800.webp` et `-1600.webp`) :

| Ordre | Vue | Texte alternatif type (obligatoire, ≥ 10 caractères) |
|---|---|---|
| 1 (principale) | `trois-quarts` | « [Nom] monté, vu de trois-quarts sur fond clair » |
| 2 | `face` | « [Nom] monté, vu de face » |
| 3 | `detail` | « Gros plan sur [les engrenages / l'assemblage] de [nom] » |
| 4 | `dessus` | « [Nom] vu de dessus (ou de profil) » |
| 5 | `situation` | « [Nom] posé sur un bureau sous une lampe » |
| 6 | `boite` | « Planches de bois prédécoupées de [nom], à plat » |
| 7 (vrai produit uniquement, obligatoire) | `etiquette` | « Étiquette de la boîte de [nom] : fabricant, référence, âge 14 ans et plus » |

Pour un vrai produit : **photos réelles** (officielles avec autorisation écrite, ou prises par l'humain) ; un rendu ne remplace jamais une photo de produit vendu.

**Mobile** : carrousel en `scroll-snap` horizontal (fonctionne sans JavaScript), ratio 4:5, compteur « 1 / 6 » en haut à droite, points indicateurs, boutons précédent / suivant (44 px) accessibles au clavier ; la première image est chargée en priorité (`fetchpriority="high"`), les autres en différé.
**Ordinateur** : vignettes verticales à gauche (72 px), image principale à droite ; survol d'une vignette = aperçu, clic = sélection ; changement d'image en fondu 200 ms.

**Zoom plein écran** : icône `ZoomIn` en bas à droite de l'image + toucher ou clic sur l'image → `<dialog>` modal plein écran (fond `#0A0F1A` à 96 %), image 1600 px.
- Ouverture : l'image grandit depuis sa position (technique FLIP, 300 ms `expo.out`) ; instantanée sans animation.
- Dans le zoom : double-toucher ou clic = bascule ×2 centrée sur le point touché ; pincement natif autorisé (`touch-action: pinch-zoom`) ; déplacement au doigt ou à la souris quand l'image est agrandie ; ordinateur : en ×2, l'image suit la souris.
- Navigation : flèches ←/→, balayage horizontal (si non agrandi), compteur, bouton fermer `X` 44 px, Échap ; focus piégé, retour du focus sur l'image d'origine à la fermeture.
- Sans JS : l'image est un lien vers le fichier 1600 px.

**Vue 3D tournante (option, si `modele_3d` est renseigné)** :
- Vignette supplémentaire « 3D » (icône `Rotate3d`) en dernière position + bouton secondaire « Voir en 3D » sous la galerie. **Rien n'est chargé avant le clic** (ni Three.js ni le modèle).
- Au clic : chargement dynamique de Three.js (GLTFLoader + OrbitControls, servis depuis notre domaine) et du fichier `.glb` (≤ 1,5 Mo, compressé) ; indicateur `Loader2` + « Chargement du modèle 3D ([poids] Mo) ».
- Visionneuse dans la zone de la galerie, fond clair identique aux vues catalogue, éclairage studio. Rotation automatique lente (un tour en 20 s) **jusqu'au premier contact** ; glisser = tourner, pincer / molette = zoom (borné 0,8 à 2), double-clic = recentrer. Boutons : « Arrêter la rotation », « Réinitialiser », « Revenir aux photos ». Clavier : flèches = rotation de 15°, `+`/`−` = zoom.
- Sans animation : pas de rotation automatique. WebGL indisponible : message « La vue 3D n'est pas disponible sur cet appareil » et retour aux images.
- Légende obligatoire : démonstration → « Modèle 3D de démonstration » ; vrai produit → « Modèle 3D indicatif, réalisé à partir des dimensions réelles. Référez-vous aux photos. » **[À valider par conformite-qa]**.
- **Écart à `direction-design.md`** (WebGL réservé à l'accueil) : la 3D sur la fiche n'est acceptable que parce qu'elle est chargée seulement sur demande. Décision de l'humain (section 9).

### 5.4 Format des données produit

Un fichier par produit : `site/src/content/produits/[slug].md`. Ce format fusionne celui de `docs/site-technique.md` et celui de la v1 (proposition de mise à jour de `docs/site-technique.md`, à valider par l'humain).

```yaml
---
# Identité
nom: "Maquette en bois [nom] à assembler"   # H1, 70 caractères max
nom_court: "[nom]"                # 30 caractères max
slug: "[slug]"                    # = nom du fichier
collections: [mecanique]          # mecanique | vehicules | miniatures | idees-cadeaux ("pour-debuter" est calculé : difficulte facile)
ordre: 10
statut: brouillon                 # brouillon | presentation | en-vente | rupture
demo: false                       # true <=> statut: presentation (V11)
reassort_prevu: null              # "AAAA-MM-JJ" réel, sinon null (audit point 28)

# Prix
prix_ttc: 0.00
historique_prix:
  - { date: "AAAA-MM-JJ", prix_ttc: 0.00 }
promotion: null                   # §5.7
quantite_max: 3

# Livraison
frais_livraison_ttc: 0.00         # par commande ; 0 = offerte
delai_livraison_min_jours: 0
delai_livraison_max_jours: 14
expedie_depuis: ""
transporteur: ""

# Produit
age_minimum: 14
difficulte: ""                    # facile | moyen | expert (aligné sur catalogue-demo.md ; « intermédiaire » de la v1 abandonné)
temps_assemblage_heures_min: 0
temps_assemblage_heures_max: 0
nombre_pieces: 0
dimensions_cm: { longueur: 0, largeur: 0, hauteur: 0 }
poids_g: 0
materiaux: []
mecanisme: ""                     # manivelle | ressort | moteur-elastique | peigne | aucun
colle_necessaire: false
outils_necessaires: []
outils_fournis: []
contenu_boite: []
benefices:                        # exactement 3
  - { titre: "", texte: "" }
marque: null                      # ou { nom: "", fournisseur_officiel: "", canal_officiel: true }

# Médias
vues:                             # fichiers site/public/produits/[slug]/[vue]-800.webp et -1600.webp
  trois-quarts: { alt: "" }       # principale
  face: { alt: "" }
  detail: { alt: "" }
  dessus: { alt: "" }
  situation: { alt: "" }
  boite: { alt: "" }
  etiquette: null                 # obligatoire si demo: false et statut en-vente : { alt: "" }
modele_3d: ""                     # optionnel : fichier .glb
video: null                       # ou { src: "", poster: "", description: "" }

# Paiement
lien_paiement_stripe: ""          # vide si demo: true (V11)

# Sécurité du produit (GPSR)
securite:
  fabricant: { nom: "", adresse: "", pays: "", email: "" }   # pays = code ISO, obligatoire (audit point 22)
  responsable_ue: null            # obligatoire si fabricant.pays hors UE
  importateur: null
  reference: ""
  avertissements: []
  preuve_age_14: ""               # chemin interne (non publié)
  marquage_jouet: false           # true si la boîte porte un marquage CE jouet ou « ne convient pas aux moins de 3 ans » (audit point 24)

# Contenus
faq:
  - { question: "", reponse: "" }
seo: { titre: "", description: "" }
audit_conformite: ""              # date de l'audit conformite-qa qui valide la fiche
---
Description (redacteur-catalogue), 150 à 300 mots, intertitres H2.
```

### 5.5 Règles de validation (la construction échoue si une règle est violée ; `brouillon` jamais publié)

| # | Règle |
|---|---|
| V1 | `age_minimum` ≥ 14 |
| V2 | `statut: en-vente` exige : fabricant complet **avec `pays`**, référence, ≥ 1 avertissement, vue `etiquette`, `preuve_age_14`, lien Stripe en `https://buy.stripe.com/` (ou domaine personnalisé déclaré), `audit_conformite`, `demo: false` |
| V3 | `fabricant.pays` hors UE ⇒ `responsable_ue` complet (audit point 22) |
| V4 | `delai_livraison_max_jours` ≤ 14 et ≥ min |
| V5 | `prix_ttc` > 0 ; dernière entrée de `historique_prix` cohérente avec le prix affiché |
| V6 | Promotions §5.7, **y compris les réductions successives** (audit point 19) |
| V7 | Les 6 vues présentes, chaque `alt` ≥ 10 caractères ; `etiquette` en plus pour un vrai produit en vente |
| V8 | `benefices` = 3 ; `seo.titre` ≤ 60 ; `seo.description` ≤ 155 |
| V9 | Aucun emoji dans aucun champ |
| V10 | Mots interdits (liste v1 + audit point 27) : « anti-stress », « thérapeutique », « thérapie », « méditation », « relaxant », « apaisant », « zen », « bien-être », « déstressant », « officiel », « authentique », « certifié », « garanti à vie », « derniers exemplaires », « stock limité », « jouet », « pour enfants », « dès [n] ans » avec n < 14, « n° 1 », « meilleur », « 100 % », « écologique », « respectueux de l'environnement », « biodégradable », « éco-responsable », « fait main », « artisanal » (sauf preuve et validation conformite-qa ; « officiel » / « authentique » seulement si `marque.canal_officiel: true` et validation) |
| V11 | `demo: true` ⇔ `statut: presentation` ; `presentation` ⇒ `lien_paiement_stripe` vide ; si `mode_demo: false` dans les réglages, **aucun produit `presentation` n'est publié** (pas de produits fictifs sur la boutique ouverte) |
| V12 | `securite.marquage_jouet: true` ⇒ `en-vente` interdit (renvoi à conformite-qa, audit point 24) |
| V13 | Textes globaux (accroches « en quelques soirées », « sans colle ni outil ») générés seulement si vrais pour **tous** les produits publiés (audit point 27) |
| V14 | Lot (§5.6) : chaque produit du lot `en-vente` ; prix du lot < somme des prix unitaires actuels ; marge du lot renseignée et ≥ 15 € |

### 5.6 Augmenter le panier moyen sans tromper

Contraintes vérifiées dans la documentation Stripe (2026-11-12) : un tarif de livraison est **un montant fixe pour l'ensemble de la commande**, indépendant du nombre d'articles ; un Payment Link accepte **jusqu'à 10 articles facultatifs** que le client choisit d'ajouter ; un champ personnalisé texte accepte **255 caractères**. Un seuil de livraison offerte **automatique n'est pas possible avec un Payment Link** : il faut un panier (Stripe Checkout créé par une fonction serveur), donc la phase 2.

| # | Levier | Phase | Règles d'honnêteté | Contrôle de marge |
|---|---|---|---|---|
| 1 | **Frais de livraison uniques par commande**, quantité 1 à 3 | Lancement | Phrase factuelle sur la fiche : « [FRAIS] € de livraison par commande, quel que soit le nombre de maquettes. » Vrai par construction (tarif fixe Stripe) | Vérifier le coût réel d'envoi de 2 et 3 boîtes : marge ≥ 15 € par commande à chaque quantité, sinon baisser `quantite_max` |
| 2 | **Articles facultatifs sur la page de paiement** (« Ajouter à votre commande ») : 1 à 3 par lien, choisis pour être cohérents (modèle « Après celle-ci », même niveau, accessoire réel s'il est sourcé) | Lancement | **Jamais pré-ajoutés** : le client clique pour ajouter (consentement exprès à tout paiement supplémentaire, règle à reconfirmer par conformite-qa **[PRO]**) ; recette : capture prouvant qu'aucun article n'est ajouté par défaut. Chaque article facultatif a sa propre fiche avec bloc GPSR sur le site | Marge de la commande « produit + article facultatif » ≥ 15 € avec le coût réel du colis plus lourd |
| 3 | **Lots** (`/lots/[slug]/`, ex. « Duo pour débuter » : n° 1 + n° 2) | Dès 2 produits réels en vente | Prix du lot = prix réel du lot. Affichage factuel : « Achetées séparément : [somme des prix actuels] €. En lot : [prix] €, livraison [offerte / X €]. » Pas de pourcentage, pas de prix barré, pas de « promo ». Statut juridique de l'affichage « achetées séparément » au regard de l'article L112-1-1 : **[PRO]**. La page du lot affiche le bloc « Sécurité du produit » de **chaque** maquette du lot | Formule ci-dessous, V14 |
| 4 | **Message cadeau** (champ texte facultatif Stripe, « Message cadeau (facultatif, 255 caractères) ») | Option B seulement | Gratuit ; activé seulement si l'humain expédie lui-même ; mentionné dans la confidentialité (§6.5) | Coût d'impression `[À VÉRIFIER]` |
| 5 | **Seuil de livraison offerte** (« Livraison offerte dès [S] € ») | Phase 2 (panier Stripe Checkout + fonction Cloudflare qui calcule `shipping_options` selon le sous-total) | Seuil fixe, affiché partout pareil ; indication factuelle dans le panier « Il vous manque [n] € pour la livraison offerte » (sans minuteur ni urgence) | Formule ci-dessous |
| 6 | Progression « Après celle-ci » sur la fiche et le questionnaire | Lancement | Fondée sur des faits (niveau, temps) ; jamais « les clients ont aussi acheté » sans données réelles | — |

Écartés : code promo à l'inscription à la lettre, cartes cadeaux (règles spécifiques, plus tard), « offre limitée ».

**Formule du seuil (et de la marge d'un lot)**, d'après `prix-et-marges.md` : frais de paiement 3 % + 0,30 € (hypothèse prudente ; Stripe annonce 1,5 % + 0,25 € pour les cartes standard de l'EEE, `docs/site-technique.md`), provision SAV 5 %, cotisations 12,3 % (13,3 % avec versement libératoire), coefficient ≥ 2,5 donc coût des produits ≤ 40 % du prix.

Marge d'une commande de valeur V avec livraison offerte = V × (1 − 0,40 − 0,03 − 0,05 − 0,123) − 0,30 − L − E − R = **0,397 × V − 0,30 − L − E − R**,
avec L = coût réel d'envoi du colis, E = emballage, R = éco-participation REP jouets (`À VÉRIFIER`).
Objectif 15 € ⇒ **S ≥ (15,30 + L + E + R) ÷ 0,397**, arrondi au prix rond supérieur. (Avec versement libératoire : diviser par 0,387.)

Sensibilité, **valeurs de L + E + R purement illustratives, à remplacer par les coûts réels** :

| L + E + R | Seuil minimal S |
|---|---|
| 6 € | 53,65 € |
| 8 € | 58,69 € |
| 10 € | 63,73 € |
| 12 € | 68,77 € |

Lecture : avec des prix de 29,90 à 59,90 €, le seuil se situera probablement au niveau de « deux maquettes », ce qui pousse au panier à 2 articles. Pour un panier de 2 boîtes, utiliser le L du colis de 2 boîtes. Le seuil ne sera fixé qu'une fois les frais réels connus (section 9).

### 5.7 Promotions (règle des 30 jours, corrigée)

Pas de promotion au lancement. Objet `promotion` : `prix_promo_ttc`, `prix_anterieur_ttc` (plus bas prix de `historique_prix` sur les 30 jours avant `debut`), `debut`, `fin` facultative. La construction recalcule et échoue en cas d'écart ; pourcentage calculé sur ce prix, arrondi à l'entier inférieur. **Ajout (audit point 19)** : « En cas de réductions successives sur une même période, le prix antérieur reste celui pratiqué avant la première réduction » (champ `reduction_precedente_debut` pour le contrôle). Aucun prix barré avant 30 jours de vente au prix de référence **[PRO]**. Aucun compte à rebours. Le Payment Link pointe vers un prix Stripe identique au prix affiché.

### 5.8 Configuration de chaque Payment Link (liste de contrôle pour l'humain, `gestion-commandes`, `developpeur-web`)

| Réglage | Valeur |
|---|---|
| Produit | Même nom, même image principale, même prix que la fiche |
| Langue | `locale=fr` |
| Quantité ajustable | 1 à `quantite_max` |
| Adresses | Facturation et livraison ; pays autorisé : `FR` (Corse incluse, DROM et Monaco exclus de fait : à tester) |
| Livraison | Un tarif « Livraison suivie en France métropolitaine », `[FRAIS]` ou 0 €, délai estimé [X] à [Y] jours |
| Téléphone | Désactivé sauf exigence du transporteur |
| Nom | Collecté |
| CGV | Acceptation obligatoire (`consent_collection.terms_of_service = required`), URL de la **version en vigueur**, mise à jour à chaque nouvelle version ; **recette : la case bloque aussi Apple Pay, Google Pay et Link** (audit point 12) |
| Texte près du bouton | « En cliquant sur Payer, vous passez une commande avec obligation de paiement. Vous pourrez vous rétracter pendant 14 jours après réception, depuis notre site (lien « Renoncer au contrat ici »). » |
| Bouton | `submit_type = pay` ; **recette : capture mobile en `locale=fr` montrant « Payer … € »**, jamais « Réserver », « Faire un don », « S'abonner », « Commander » seul ; portefeuilles : capturer le libellé réel, logo seul ⇒ **[PRO]** avant de les garder (audit point 11) |
| Articles facultatifs | 0 à 3, jamais pré-ajoutés (§5.6) |
| Champ personnalisé | « Message cadeau (facultatif, 255 caractères) », texte, facultatif, seulement si `message_cadeau_actif` |
| Codes promo | Désactivés |
| Consentement marketing Stripe | Désactivé (la lettre passe par notre formulaire à double confirmation) |
| Enregistrer le moyen de paiement | Désactivé |
| Après paiement | Redirection `https://[DOMAINE]/merci/` |
| Reçus | Automatiques, en français |
| Image de marque | Logo Rouage & Laiton, couleur d'accent `#1E3A5F`, police la plus proche disponible |
| Politiques | Email de support, liens CGV, retours, confidentialité |
| Lien désactivé | « Ce modèle est momentanément indisponible. Retrouvez nos autres maquettes sur [DOMAINE]. » |

## 6. Pages légales, rétractation, cookies

### 6.0 Suivi des corrections de l'audit (21 points, dont 5 prioritaires « P »)

| Point | Correction | Où |
|---|---|---|
| 2 | SIREN **et** RCS si applicable ; hébergeur = entité Cloudflare exacte (raison sociale, adresse, téléphone) | §6.3 |
| 3 **P** | Article « Conclusion du contrat en ligne » : langue française, archivage des commandes ≥ 120 € et accès | §6.4 art. 6 |
| 4 **P** | Encadré officiel, annexe D. 211-2 partie A, recopié mot pour mot depuis Légifrance | §6.4 art. 11 |
| 5 | Texte « kit commencé » (dépréciation) **[PRO]** | Partie 1 §4.8 ; §6.4 art. 10 |
| 6 (remarque) | Identification acceptée aussi par le seul « produit concerné » | §6.2 |
| 7 **P** | Champ piège : on enregistre quand même, drapeau « suspect », message neutre, alerte | §6.2 étape 1 |
| 8 | Limite portée à 20 envois / IP / heure, message explicite, saisie conservée | §6.2 étape 1 |
| 9 | Procédure en cas d'échec de l'accusé : 3 essais en 15 min, alerte, envoi manuel ≤ 24 h **[PRO]**, trace, impression PDF, test mensuel | §6.2 étape 9 |
| 10 | Durées de conservation proposées **[PRO]** | §6.5 |
| 11 | Bouton « Payer » : capture de recette ; portefeuilles | §5.8 |
| 12 | Case CGV bloquant aussi les portefeuilles ; URL à jour | §5.8 |
| 14 **P** | Aucune expédition avant l'email de confirmation ; PDF de la version acceptée ; liste de contrôle quotidienne | Partie 1 §2 étape 9, §4.6, §4.8 ; §6.7 |
| 15 | Inventaire réel des traceurs après déploiement ; cookies de sécurité Cloudflare listés ; aucun script Stripe sur notre site | §6.6 |
| 16 | **Pas de script Cloudflare Web Analytics au lancement** : statistiques côté serveur + Stripe + Lighthouse | §6.6, §8 |
| 19 | Réductions successives | §5.7 |
| 20 | Texte « revendeur indépendant », pas de logo | §5.2 bloc 14 |
| 22 | `fabricant.pays` obligatoire | §5.4, V2, V3 |
| 24 | `marquage_jouet` | §5.4, V12 |
| 26 **P** | Droits légaux présentés comme des droits (bandeau, réassurance, fiche, À propos) ; « aucune fausse promotion » supprimé | Partie 1 §4.0, §4.1.9, §4.1.11, §4.7 ; §5.2 bloc 7 |
| 27 | Accroches globales calculées ; liste V10 complétée | Partie 1 §4.1.2 ; V10, V13 |
| 28 | « Indisponible pour le moment » par défaut ; `reassort_prevu` | Partie 1 §4.2 ; §5.2 bloc 6 |
| 31 | Confidentialité : UTM transmis à Stripe, IP anti-abus, rôle de Stripe et Cloudflare, transferts (+ lettre et message cadeau, nouveaux) | §6.5 |

### 6.1 Pages obligatoires et accès

| Obligation (dossier conformite-qa) | Page | Accès |
|---|---|---|
| O9 Mentions légales | `/mentions-legales/` | Pied de page |
| O10 CGV et infos précontractuelles | `/cgv/` + PDF daté ; résumé sur chaque fiche | Pied de page, sous « Acheter », case Stripe |
| O11 Parcours de commande | Fiche + Payment Link (§5.8) | — |
| O12 Livraison | Fiche bloc 5, `/livraison-et-retours/`, CGV | — |
| O13 Rétractation + bouton en ligne | `/renoncer-au-contrat/`, formulaire type (CGV, page, email) | Pied de page de toutes les pages, Merci, Livraison et retours, Contact, FAQ, accueil (FAQ), email de confirmation, carte colis |
| O14 Médiateur | CGV, mentions légales, livraison et retours | — |
| O15 Pas de lien RLL | Aucune page | Contrôle |
| O16 Données et cookies | `/confidentialite/`, `/cookies/` | Pied de page, sous le formulaire de la lettre, Stripe |
| O17 GPSR | Bloc « Sécurité du produit » de chaque fiche et de chaque lot | — |
| O18 14 ans et plus | Badge et bloc sécurité ; questionnaire sans option « enfant » ; aucun visuel d'enfant | — |
| O21 IDU REP | CGV + mentions légales | — |
| O22 Triman / info-tri | Produit ou emballage ; FAQ si l'information existe | — |

Mise en page commune des pages légales (registre clair) : H1, « Version du [JJ/MM/AAAA] », sommaire d'ancres, titres numérotés, 16 px, aucun texte replié, lien « Haut de page », aucune animation, aucun appel à l'action commercial.

### 6.2 Bouton « Renoncer au contrat ici » (article D221-5)

**Emplacements** (libellé identique partout) : pied de page de toutes les pages (hors accordéon), Merci, Livraison et retours, Contact, FAQ (et aperçu FAQ de l'accueil), CGV art. 10, email de confirmation, carte dans le colis.

**Page `/renoncer-au-contrat/`** (registre clair, aucune animation sauf le focus)
1. H1 « Renoncer au contrat ». « Vous avez 14 jours à compter de la réception de votre commande pour changer d'avis, sans avoir à vous justifier. Remplissez ce formulaire : vous recevrez immédiatement un accusé de réception par email. »
2. Formulaire HTML natif, sans JavaScript requis, `POST /api/retractation` : Prénom* ; Nom* ; Email pour l'accusé* ; Numéro de commande ou de reçu ; Date de la commande ; Produit(s) concerné(s) ; Date de réception ; Commentaire (facultatif, 1 000 caractères, « vous n'avez pas à vous justifier ») ; champ piège au nom non sémantique (ex. `champ_b7`), caché aux humains, `tabindex="-1"`, `autocomplete="off"`.
   **Identification** : au moins un des trois champs numéro de commande, date de commande ou produit(s) concerné(s) (audit point 6). Pas de captcha.
3. Bouton principal unique **« Confirmer la rétractation »** ; dessous : « En cliquant, vous envoyez votre déclaration de rétractation. »
4. « Vous préférez une autre méthode ? » : email, ou courrier avec le formulaire type (texte de l'annexe à l'article R221-1 reproduit intégralement + PDF).
5. « Et ensuite ? » : renvoi sous 14 jours à `[ADRESSE]`, frais de retour `[À VÉRIFIER]`, remboursement sous 14 jours.
Erreurs : sous le champ, en texte, `CircleAlert`, résumé `role="alert"`, focus sur le premier champ en erreur, saisie conservée.

**Fonction `POST /api/retractation`**
1. **Champ piège rempli** (audit point 7) : la déclaration est **enregistrée quand même** avec un drapeau `suspect`, aucun email automatique, message neutre : « Votre demande est enregistrée sous la référence [REF]. Si vous ne recevez pas d'accusé de réception dans l'heure, écrivez-nous à [EMAIL]. » ; alerte à la boutique, qui vérifie et envoie l'accusé à la main si la demande est réelle. **Limite** (audit point 8) : 20 envois par IP et par heure ; au-delà, jamais d'échec silencieux : « Trop de demandes depuis votre connexion. Votre rétractation reste possible : écrivez-nous à [EMAIL] ou réessayez dans quelques minutes », saisie conservée. L'IP n'est pas conservée au-delà du contrôle.
2. Validation (longueurs, email, identification).
3. Horodatage serveur : heure de Paris + UTC.
4. Référence `RT-AAAAMMJJ-HHMM-XXXX`.
5. Enregistrement (D1 ou KV) : référence, horodatage, champs, drapeau.
6. Accusé de réception par email : objet « Accusé de réception de votre rétractation [REF] » ; « Nous avons bien reçu votre déclaration de rétractation le [JJ/MM/AAAA] à [HH:MM] (heure de Paris). » + reprise intégrale de la déclaration + étapes suivantes + coordonnées + « Conservez cet email : il fait foi de votre demande. »
7. Copie à la boutique.
8. Redirection 303 vers `/renoncer-au-contrat/confirmation/?ref=[REF]`.
9. **Échec d'envoi** (audit point 9) : (1) 3 nouveaux essais automatiques en 15 minutes ; (2) alerte immédiate à la boutique ; (3) envoi manuel du même contenu, le jour même, **au plus tard sous 24 h** **[PRO]** ; (4) date et heure de l'envoi manuel enregistrées ; (5) la page de confirmation affiche la déclaration complète avec date et heure et un bouton « Imprimer / enregistrer en PDF » (complément, pas substitut) ; (6) test d'envoi mensuel.

**Page de confirmation** (noindex) : `CircleCheck`, « Votre rétractation est enregistrée. », référence (texte brut, jamais interprétée), déclaration complète, date et heure, message sur l'accusé (ou message d'échec du point 9), étapes suivantes, bouton « Retour à l'accueil ».
**Recette** : envoi depuis un téléphone, accusé reçu avec déclaration et heure, enregistrement présent, cas champ piège, cas limite dépassée, cas échec d'envoi, sans JavaScript, clavier, lecteur d'écran.
Variables d'environnement : `EMAIL_API_KEY`, `EMAIL_FROM`, `EMAIL_BOUTIQUE`, liaisons `RETRACTATIONS` et `LETTRE`.

### 6.3 Mentions légales `/mentions-legales/` (corrigé, audit point 2)

1. Éditeur : « [Prénom Nom] EI », nom commercial « Rouage & Laiton », adresse, **SIREN [ ] et, si l'immatriculation en donne un, RCS [ville du greffe] [numéro]** **[PRO : selon l'attestation]**, email, téléphone.
2. Directeur de la publication : [Prénom Nom].
3. Hébergeur : **raison sociale, adresse et téléphone de l'entité Cloudflare qui fournit Pages au titre du contrat**, relevés dans les conditions de Cloudflare au moment de la publication.
4. TVA non applicable, art. 293 B du CGI.
5. IDU REP jouets et emballages.
6. Médiateur : nom, adresse, site.
7. Propriété intellectuelle : textes, photos, vidéos et rendus de la boutique ; visuels de tiers seulement avec autorisation écrite ; aucun logo de marque tierce.
8. Crédits : Cormorant Garamond et Inter (SIL Open Font License), icônes Lucide (ISC), GSAP (licence standard GSAP), Three.js (MIT).
9. Liens vers confidentialité et cookies.

### 6.4 CGV `/cgv/` et PDF daté (corrigé)

Version datée, PDF identique, anciennes versions conservées en interne avec les reçus correspondants.
1. Objet et champ d'application. 2. Vendeur. 3. Produits (caractéristiques sur chaque fiche ; 14 ans et plus ; GPSR ; produits de démonstration jamais vendus). 4. Prix (prix final, TVA non applicable, frais de livraison **par commande**, aucun frais selon le moyen de paiement, règle des prix barrés et des réductions successives ; lots : prix propre du lot). 5. Commande (fiche → page Stripe → récapitulatif, quantité, articles facultatifs ajoutés seulement par le client → acceptation des CGV → bouton « Payer » qui vaut commande avec obligation de paiement → reçu → email de confirmation ; correction possible avant de payer). **6. Conclusion du contrat en ligne (nouveau, audit point 3)** : « Le contrat est conclu en français. Pour toute commande d'un montant égal ou supérieur à 120 €, nous archivons le contrat (commande, version des CGV acceptée, confirmation) pendant [durée légale, À VÉRIFIER sur Légifrance, art. L213-1 et suivants : 10 ans selon la lecture de conformite-qa] et vous y donnons accès sur simple demande à [EMAIL]. » 7. Paiement (Stripe ; moyens acceptés `[À VÉRIFIER]`). 8. Livraison (zone, délais par produit, suivi, retard et annulation, remboursement sous 14 jours, réserves ; **l'email de confirmation est envoyé avant toute expédition**). 9. Transfert des risques **[PRO]**. 10. Droit de rétractation (14 jours à compter de la réception ; bouton « Renoncer au contrat ici », email, formulaire type ; accusé ; retour sous 14 jours ; frais de retour ; remboursement ; texte « kit commencé » de l'audit point 5 **[PRO]**). **11. Garanties légales** : explication + **encadré de la partie A de l'annexe à l'article D. 211-2 (« Encadré inséré dans les conditions générales de vente de biens (hors animaux domestiques) »), recopié mot pour mot depuis Légifrance** (https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000045981314/2026-11-12) au moment de la rédaction ; jamais l'encadré D. 211-4 ni un modèle de blog ; conformite-qa contrôle au mot près. 12. Pièce manquante ou abîmée à la réception (garantie légale de conformité ; procédure). 13. Service client. 14. Données personnelles. 15. Médiation (sans lien RLL). 16. REP (IDU). 17. Droit applicable. Annexe : formulaire type de rétractation (texte officiel intégral).

### 6.5 Confidentialité `/confidentialite/` (corrigé, audit points 10 et 31)

1. Responsable : [Prénom Nom] EI.
2. Traitements, données, finalités, bases : **commande** (nom, email, adresse ; téléphone seulement si exigé ; collectés par Stripe ; contrat) ; **message cadeau** (texte saisi au paiement, imprimé puis supprimé `[durée À VALIDER]` ; contrat) ; **source de visite** : « paramètres de campagne de l'adresse (par exemple tiktok) transmis à notre prestataire de paiement avec votre commande, pour mesurer l'efficacité de nos contenus. Base : intérêt légitime. Vous pouvez vous y opposer à [EMAIL]. » ; **rétractation** (champs du formulaire ; obligation légale et preuve) ; **adresse IP** « utilisée quelques instants pour limiter les envois abusifs des formulaires, puis effacée » ; **lettre de l'atelier** (email, date et heure d'inscription et de confirmation, version du texte de consentement ; base : consentement ; désinscription à tout moment) ; **échanges par email** ; **questionnaire** : « Vos réponses ne sont ni enregistrées ni transmises par nous. Seules les pages consultées apparaissent, de façon agrégée, dans les statistiques de fréquentation de notre hébergeur. » ; **statistiques** : côté serveur, agrégées, sans script ni cookie.
3. Destinataires : Stripe, Cloudflare, service d'envoi d'emails `[À VÉRIFIER]`, transporteur, fournisseur expéditeur (option A). **Rôle de Stripe et de Cloudflare** (sous-traitant et/ou responsable distinct, notamment lutte contre la fraude pour Stripe) et **base des transferts vers les États-Unis** : à lire dans leurs accords de traitement, sans supposition **[PRO si doute]**.
4. Durées proposées **[PRO]** : déclarations de rétractation et échanges liés = durée de la relation commerciale + 5 ans ; pièces comptables = 10 ans ; IP du contrôle anti-abus = non conservée ; lettre = jusqu'à la désinscription, puis effacement (preuve du consentement conservée `[durée À VALIDER conformite-qa]`) ; inscriptions non confirmées = 7 jours `[À VALIDER]`.
5. Droits, exercice par email, réponse sous un mois, réclamation CNIL. 6. Renvoi à `/cookies/`.

### 6.6 Cookies `/cookies/` et bandeau (corrigé, audit points 15 et 16)

- **Lancement : aucun traceur non exempté, donc pas de bandeau.** Pas de pixel publicitaire, pas de Google Analytics, pas de vidéo YouTube intégrée, polices et scripts (GSAP, Three.js) servis depuis notre domaine, **aucun script Stripe sur notre site** (Payment Links sur le domaine de Stripe), **pas de script Cloudflare Web Analytics** (recommandation de l'audit suivie ; statistiques côté serveur à la place), questionnaire sans stockage, aucun `localStorage`.
- **Inventaire réel après déploiement** (obligatoire avant ouverture) : outils du navigateur, toutes les pages, mobile ; cookies, stockage local, requêtes vers des tiers. Les cookies de sécurité que Cloudflare peut déposer selon les options (`__cf_bm`, `cf_clearance`, `_cfuvid`…) sont exemptés mais **figurent dans le tableau** de `/cookies/`.
- Page `/cookies/` : définition ; tableau (nom, émetteur, finalité, durée, consentement requis oui / non) ; cookies de Stripe sur sa page de paiement (lien vers sa politique) ; paramétrage du navigateur ; date de mise à jour.
- **Bandeau (composant prêt, inactif)** si un traceur non exempté est ajouté un jour : panneau bas non bloquant ; **« Tout refuser » et « Tout accepter » au même niveau, même taille, même style, même couleur** (refuser à gauche ou au-dessus) ; « Personnaliser » avec interrupteurs désactivés par défaut ; fermer = refuser ; rien chargé avant accord ; choix conservé 6 mois et modifiable via « Gérer les cookies » ; focus sur le premier bouton, contrastes AA. Registre clair sur toutes les pages (y compris cinématiques) pour la lisibilité.

### 6.7 Page de paiement et emails

- Page Stripe : §5.8.
- Email de confirmation du contrat (`crm-email`, envoyé par l'humain) : identité du vendeur, récapitulatif (produits, articles facultatifs, quantité, prix, frais, total), délai, adresse de livraison, message cadeau s'il y en a, **PDF des CGV de la version acceptée à la date de commande**, formulaire type de rétractation, lien « Renoncer au contrat ici », garanties, contact, médiateur. **Envoyé avant toute expédition** (liste de contrôle quotidienne de `gestion-commandes`).
- Emails de la lettre : expéditeur identifié, lien de désinscription visible, en-têtes `List-Unsubscribe`, aucun contenu promotionnel qui ne respecte pas §5.7.

## 7. Identité visuelle : piste C « Laiton », version cinématique

Décision de l'humain du 2026-11-12 (`knowledge/marque.md`). **Les pistes A et B sont supprimées.**

### 7.1 Palette et contrastes vérifiés

Ratios calculés pour ce livrable (définition WCAG 2.x). Seuils : 4,5:1 texte normal, 3:1 grand texte (≥ 24 px, ou ≥ 18,66 px gras) et éléments d'interface. À revérifier sur le rendu réel (grain et halos baissent légèrement le contraste).

| Rôle | Couleur | Contraste | Usage autorisé |
|---|---|---|---|
| Nuit (fond cinématique) | `#0A0F1A` | — | Fonds sombres |
| Nuit 2 (surfaces sombres) | `#111827` | — | Cartes et pied de page sombres |
| Texte sur nuit | `#F5F1E8` | 17,0:1 sur nuit ; 15,7:1 sur nuit 2 | Tout texte |
| Texte secondaire sur nuit | `#A8A29A` | 7,6:1 sur nuit ; 7,0:1 sur nuit 2 | Tout texte |
| Laiton | `#C8A15A` | 8,0:1 sur nuit ; 7,4:1 sur nuit 2 ; **2,3:1 sur papier** | Accents, italiques, focus sur sombre ; **interdit comme texte ou icône sur fond clair** |
| Laiton foncé | `#8A6A3A` | 4,8:1 sur papier ; 5,0:1 sur blanc ; 3,8:1 sur nuit | Icônes et texte sur clair ; sur sombre : grand texte et icônes seulement |
| Papier (fond clair) | `#FBFAF7` | — | Registre clair |
| Texte sur papier | `#111827` | 17,0:1 | Tout texte |
| Secondaire sur papier | `#6B7280` | 4,6:1 sur papier ; 4,8:1 sur blanc | Texte ≥ 14 px (en dessous, utiliser `#4B5563`, 7,2:1 : **proposition d'ajout à `marque.md`**) |
| Bleu nuit (action sur clair) | `#1E3A5F` | Blanc dessus 11,5:1 ; sur papier 11,0:1 | Bouton principal et liens sur clair, focus sur clair |
| Bordure claire | `#E7E5E4` | Décorative | Cartes, séparateurs |
| Contour de champ sur clair | `#6B7280` | 4,6:1 | Champs de formulaire |
| Erreur sur clair / sur sombre | `#B91C1C` / `#F87171` | ≥ 6,0:1 / 6,9:1 sur nuit | Toujours avec icône et texte (proposition d'ajout à `marque.md`) |
| Succès sur clair / sur sombre | `#15803D` / `#4ADE80` | ≥ 4,6:1 / 11,0:1 sur nuit | Idem |

Une seule couleur d'action par registre : crème `#F5F1E8` sur sombre, bleu nuit `#1E3A5F` sur clair. Dégradés autorisés : uniquement les dégradés « laiton » et « bois » des engrenages et les halos radiaux du prototype.

### 7.2 Typographie

- Titres : **Cormorant Garamond** 400 et 400 italique (italiques en laiton sur sombre, laiton foncé sur clair). Le 500 n'est pas chargé (poids).
- Texte et interface : **Inter** (fichier variable, 400 à 600).
- Auto-hébergées via Fontsource, sous-ensemble latin.

| Niveau | Mobile | Ordinateur |
|---|---|---|
| H1 héros | 52 px / 0,92 | `clamp(52px, 9vw, 128px)` |
| H1 pages | 40 px / 1,0 | 64 px |
| H2 éditorial | 40 px / 1,0 | `clamp(40px, 6vw, 84px)` |
| H2 boutique (Inter 600) | 22 px / 1,3 | 28 px |
| Texte | 16 px / 1,65 | 17 px / 1,65 |
| Kicker | 12 px, majuscules, interlettrage 0,22 em, laiton | idem |
| Prix | 28 px Inter 600 (fiche), 20 px (carte) | idem |

### 7.3 Formes, matière, photo

- Rayons : sections 32 px (24 mobile), cartes 18 px, champs 12 px, boutons et badges en pilule.
- Ombres : uniquement au survol, `0 18px 40px rgba(17,24,39,.08)`.
- Matière : grain de film 6 % sur sombre ; halos laiton et bleu nuit ; reflets du dégradé laiton.
- Visuels (studio-visuel) : vues catalogue sur fond clair uni, lumière studio 3 points, même caméra ; vues d'ambiance nuit + lampe de bureau chaude ; bois découpé au laser avec chants brûlés ; macro sur les engrenages ; mains sans visage. Démonstration : rendus 3D signalés comme tels. Produits vendus : vraies photos.
- **Liste des visuels à commander à `studio-visuel`** : 6 vues × 10 produits ; `comparateur-planches` / `comparateur-monte` (produit 10) ; calques de vue éclatée + `vue-eclatee.json` + `eclatee-statique` (produit 1) ; 4 fonds de cartes de collection + calques animés ; 5 visuels de héros de collection (calques pour Miniatures) ; visuel « Offrir » + étiquette kraft SVG ; visuel du héros de l'atelier ; image de partage 1200 × 630 ; `.glb` des produits phares (optionnel).

### 7.4 Ton éditorial

Précis, chaleureux, un peu horloger, vouvoiement, phrases courtes, aucun emoji, aucun superlatif creux, aucune fausse urgence. Structure de titre récurrente : affirmation simple + fin en italique (« Tout est là. *Il ne manque que vous.* »). Exemple de référence : « Engrenages découpés au laser, axe en bois, aucune colle. Comptez deux soirées. » (seulement si vrai pour le produit).

## 8. Indicateurs de mesure

**Outils, sans aucun script de mesure ni cookie** (audit point 16) : statistiques **côté serveur** de Cloudflare (requêtes par page, référents ; niveau de détail disponible sur l'offre gratuite **à vérifier par developpeur-web**) ; statistiques des Payment Links Stripe (vues, ventes, revenus, articles ; données différées jusqu'à 18 h) ; Lighthouse en laboratoire pour la vitesse ; base de la lettre (D1).

| Indicateur | Définition | Source | Fréquence |
|---|---|---|---|
| Visites par page | Requêtes de pages HTML | Cloudflare (serveur) | Hebdo |
| Sources | Référents ; UTM vus côté Stripe | Cloudflare / Stripe | Hebdo |
| Taux de passage au paiement | Vues du Payment Link ÷ visites de la fiche | Stripe / Cloudflare | Hebdo, par produit |
| Taux de paiement | Ventes ÷ vues du Payment Link | Stripe | Hebdo |
| Conversion globale | Commandes ÷ visites | Stripe / Cloudflare | Hebdo |
| **Panier moyen** | Revenus ÷ commandes | Stripe | Mensuel |
| **Part des commandes à 2 articles ou plus** | Commandes avec quantité ≥ 2 ou article facultatif ÷ commandes | Stripe | Mensuel |
| **Taux d'ajout d'article facultatif** | Commandes avec article facultatif ÷ commandes du lien | Stripe | Mensuel |
| Part des lots | Commandes de lots ÷ commandes | Stripe | Mensuel |
| Marge réelle par commande | Selon `prix-et-marges.md`, avec coûts d'envoi réels | `analyste-performance` | Mensuel ; alerte si < 15 € |
| Questionnaire | Vues des pages résultat statiques (chemin sans JavaScript ou lien partagé) ; l'usage dans l'accueil n'est **pas** mesuré (limite assumée : pas de script) | Cloudflare | Mensuel |
| Lettre | Inscriptions confirmées ; taux de confirmation (confirmées ÷ demandes) ; désinscriptions | D1 | Mensuel |
| Rétractations | Déclarations ÷ commandes | D1 / Stripe | Mensuel |
| Pièces manquantes ou abîmées | Signalements ÷ commandes | Boîte email | Mensuel |
| Délai réel de livraison | Moyenne et maximum | `gestion-commandes` | Mensuel ; alerte si dépassement |
| Vitesse | Lighthouse mobile par gabarit (accueil, collection, fiche, catalogue) | Laboratoire | À chaque mise en ligne + mensuel |

**Convention UTM** (inchangée) : `utm_source` = `tiktok` | `instagram` | `pinterest` | `youtube` ; `utm_medium` = `social` ; `utm_campaign` = `AAAAMMJJ-sujet`. Transmis au lien Stripe s'ils sont dans l'URL de la page, sans mémorisation (une visite sur plusieurs pages perd l'attribution : limite acceptée). Rapport hebdomadaire : `analyste-performance`.

## 9. Questions et décisions pour l'humain

**Bloquant pour developpeur-web**
1. **Mode démonstration** : site de démonstration publié sur une adresse d'aperçu en `noindex` (proposé) ou non publié ? À l'ouverture, les produits de démonstration sont dépubliés (règle V11, proposée).
2. **Vue 3D sur la fiche** : accepter cet écart à `direction-design.md` (chargée seulement au clic) ?
3. **Collections** : le Moulin à vent (« Automate ») va-t-il en Mécanique ? Quels produits forment « Idées cadeaux » ? Sélection « du moment » proposée : n° 1, 7, 10, 9.
4. **Lettre de l'atelier** : la lancer dès l'ouverture (nécessite le service d'envoi d'emails, déjà nécessaire pour la rétractation, et un domaine) ? Fréquence ?
5. **Seuil « quelques soirées »** pour les accroches globales (proposé : 3 h).

**Panier moyen**
6. **Articles facultatifs Stripe** : les activer, et lesquels pour chaque produit ?
7. **Lots** : lesquels, à quel prix ? (marge ≥ 15 € par la formule §5.6, **[PRO]** sur l'affichage « achetées séparément »).
8. **Seuil de livraison offerte** : décision reportée à la phase 2 (panier) et à la connaissance des frais réels L, E, R.
9. **Message cadeau** : seulement en option B ; carte imprimée ou manuscrite ? Coût ?
10. **Date limite de Noël** : à fixer chaque année à partir du délai réel.

**Repris de la v1, toujours ouverts**
11. Disponibilité du nom « Rouage & Laiton » (INPI, domaine, réseaux). 12. Niveau de présentation sur la page À propos. 13. Réseau principal pour la page Merci. 14. Quantité maximale (proposé : 3). 15. Valeurs de `politiques.md` : frais de livraison, transporteur, délais, frais et adresse de retour, délais de réponse et d'envoi de la confirmation, identité légale, SIREN / RCS, IDU, médiateur. 16. Service d'envoi d'emails. 17. Apple Pay, Google Pay, Link : garder après capture du libellé réel ? 18. Politique « pièce cassée pendant le montage » (seul engagement au-delà de la loi). 19. Confirmer « pas de script Cloudflare Web Analytics » (recommandation de l'audit, suivie ici).

**[PRO] (juriste / expert-comptable)**
20. Texte « kit commencé ». 21. Plafond de 24 h pour l'accusé manuel. 22. Durées de conservation (y compris preuve de consentement de la lettre et message cadeau). 23. Libellé des boutons des portefeuilles. 24. Prix de référence d'un produit vendu depuis moins de 30 jours. 25. Allégations environnementales (V10). 26. Rôle de Stripe et transferts hors UE. 27. Affichage d'un lot face aux prix séparés. 28. Consentement exprès aux articles facultatifs (règle et article exact). 29. Mentions des factures en franchise de TVA. 30. Mention « Modèle 3D indicatif » sur un vrai produit.

**Propositions de modification (je ne modifie pas ces fichiers)**
31. `docs/site-technique.md` : remplacer le format de fiche par §5.4 ; ajouter les fonctions `/api/lettre*` et les variables d'environnement ; préciser « GSAP et Three.js via npm, aucun CDN ».
32. `knowledge/marque.md` : ajouter le secondaire `#4B5563` pour les petits textes, les couleurs d'erreur et de succès sur fond sombre, et la règle « laiton `#C8A15A` interdit comme texte sur fond clair ».
33. `knowledge/direction-design.md` : retirer Lenis de la pile (§4.0) et noter l'exception de la 3D au clic.

## 10. Sources

**Internes** (lues le 2026-11-12) : `CLAUDE.md` ; `docs/architecture.md` ; `docs/site-technique.md` ; `docs/reference/prototype-accueil.html` ; `knowledge/marque.md`, `knowledge/direction-design.md` (v2), `knowledge/catalogue-demo.md`, `knowledge/niche.md`, `knowledge/politiques.md` (proposé), `knowledge/prix-et-marges.md` (proposé), `knowledge/contraintes.md` ; `.claude/agents/studio-visuel.md` ; `outputs/2026-11-12-architecte-web-conception-boutique.md` (v1) ; `outputs/2026-11-12-conformite-qa-audit-conception-boutique.md` (21 corrections, sources S1 à S11) ; `outputs/2026-11-12-conformite-qa-dossier-vente-legale-maquettes-bois.md` (obligations O9 à O22).

**Externes** (consultées le 2026-11-12) :
- Stripe, personnaliser les Payment Links (champs personnalisés texte jusqu'à 255 caractères, quantité ajustable, acceptation des conditions, adresses, image de marque, paramètres d'URL) : https://docs.stripe.com/payment-links/customize
- Stripe, codes promotionnels, ventes incitatives et articles facultatifs (jusqu'à 10 articles facultatifs par lien ; ventes croisées par produit, masquées si le lien définit ses propres articles facultatifs) : https://docs.stripe.com/payment-links/promotions
- Stripe, articles facultatifs et ventes croisées de Checkout : https://docs.stripe.com/payments/checkout/optional-items et https://docs.stripe.com/payments/checkout/cross-sells
- Stripe, facturer la livraison (« Les frais de livraison ne prennent en charge que des valeurs de montant fixe pour l'ensemble de la commande » ; mise à jour dynamique selon la valeur de commande seulement avec Checkout, en version bêta) : https://docs.stripe.com/payments/during-payment/charge-shipping
- Stripe, paramètres d'URL et suivi (UTM, 150 caractères) : https://docs.stripe.com/payment-links/url-parameters ; après paiement (redirection, reçus, statistiques) : https://docs.stripe.com/payment-links/post-payment
- Légifrance, annexe à l'article D. 211-2 du code de la consommation (encadré des garanties). **Limite** : mon outil de lecture n'a fourni qu'un résumé, pas le texte intégral ; le texte doit être recopié mot pour mot à la rédaction des CGV : https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000045981314/2026-11-12
- Légifrance, article D221-5 (rétractation en ligne), via l'audit conformite-qa (S2) : https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000053303365/2026-09-08
- W3C, calcul des contrastes (WCAG 2.x) : https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html

### Auto-contrôle

- [x] Chaque page obligatoire du dossier conformite-qa est prévue (tableau §6.1), et les 21 corrections de l'audit sont tracées (§6.0).
- [x] Le bouton de rétractation en ligne est spécifié : emplacements, libellés, champs, fonction corrigée (piège, limite, échec d'envoi), accusé horodaté (§6.2).
- [x] La fiche produit contient le bloc GPSR toujours ouvert et la mention « 14 ans et plus », avec blocages à la construction (V1 à V3, V12) ; le questionnaire n'a pas d'option « enfant ».
- [x] Aucune technique de vente trompeuse : pas de compte à rebours (date de Noël fixe), pas de stock, pas de faux avis, articles facultatifs jamais pré-ajoutés, lots sans pourcentage ni prix barré, « du moment » éditorial, rendus signalés, droits légaux présentés comme des droits.
- [x] Chaque page a une seule action principale (tableau partie 1 §3 ; style « principal » réservé à cette action).
- [x] Faisable avec la pile de `docs/site-technique.md` : Astro statique, Tailwind, Lucide, GSAP + ScrollTrigger, Three.js (au clic), Payment Links (articles facultatifs et champ personnalisé natifs), fonctions Cloudflare gratuites. Seul le seuil de livraison offerte exige la phase 2 (panier Checkout), signalé comme tel.
- [x] Aucun code écrit ; `knowledge/` non modifié (propositions en section 9).
