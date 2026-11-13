---
agent: architecte-web
statut: validé   # toujours cette valeur
valide_par: humain
date_validation: 2026-11-13
date: 2026-11-12
version: 2 (remplace outputs/2026-11-12-architecte-web-conception-boutique.md)
suite: outputs/2026-11-12-architecte-web-conception-boutique-v2-partie-2.md (sections 5 à 10)
sources: [CLAUDE.md, docs/architecture.md, docs/site-technique.md, docs/reference/prototype-accueil.html, knowledge/marque.md, knowledge/direction-design.md (v2), knowledge/catalogue-demo.md, knowledge/niche.md, knowledge/politiques.md (proposé), knowledge/prix-et-marges.md (proposé), knowledge/contraintes.md, outputs/2026-11-12-architecte-web-conception-boutique.md (v1), outputs/2026-11-12-conformite-qa-audit-conception-boutique.md, outputs/2026-11-12-conformite-qa-dossier-vente-legale-maquettes-bois.md, .claude/agents/studio-visuel.md, documentation Stripe (section 10, consultée le 2026-11-12)]
prochaine-etape: conformite-qa puis developpeur-web
---

# Conception de la boutique, v2 : Rouage & Laiton, registre cinématique

> **Découpage du livrable** : l'outil d'ajout en fin de fichier n'est pas disponible pour cet agent ; le livrable est donc écrit en deux fichiers. Ce fichier contient les sections 1 à 4. La suite (sections 5 à 10 : fiche produit et données, pages légales et corrections de l'audit, identité visuelle, mesure, questions, sources) est dans `outputs/2026-11-12-architecte-web-conception-boutique-v2-partie-2.md`. Les deux forment un seul document et remplacent entièrement la v1.
> Nom de travail **Rouage & Laiton** (`knowledge/marque.md`) : disponibilité INPI, domaine et réseaux **non vérifiée**.
> Toutes les valeurs `À VÉRIFIER` de `knowledge/politiques.md` restent des marqueurs `[...]`. Rien n'est inventé. **[PRO]** = confirmation juridique ou comptable nécessaire.
> Tous les chiffres « dynamiques » (temps, prix, nombre de modèles, délais) sont **calculés à la construction depuis les données produit**, jamais écrits en dur.

## 1. Résumé (5 lignes)

1. **Identité unique** : piste C « Laiton » en version cinématique (nuit `#0A0F1A`, laiton `#C8A15A`, Cormorant Garamond + Inter), pistes A et B supprimées ; deux registres : cinématique (accueil, collections, atelier) et boutique claire (catalogue, fiche, aide, légal).
2. **Accueil au-dessus du prototype** : 11 sections dont 6 animées (héros engrenages, récit épinglé, comparateur avant / après, vue éclatée au défilement, cartes de collections animées, échelle de difficulté), questionnaire « Trouver ma maquette » sans compte ni cookie, section Offrir, L'atelier avec lettre d'information à double confirmation. Chaque animation a une version mobile, une version sans animation et une version sans JavaScript.
3. **Fiche produit** : galerie des 6 vues avec zoom plein écran, vue 3D tournante chargée seulement au clic, bandeau « Produit de démonstration » et achat désactivé si `demo: true`, tous les blocs de la v1 (GPSR, 14 ans et plus, prix, délai, rétractation).
4. **Les 21 corrections de l'audit sont intégrées** (tableau de suivi en partie 2, §6.0), dont les 5 prioritaires : champ piège, droits légaux présentés comme des droits, CGV (langue, archivage ≥ 120 €), encadré officiel des garanties, aucune expédition avant l'email de confirmation.
5. **Panier moyen sans tromper** : frais de livraison uniques par commande (mécanique Stripe), articles facultatifs sur la page de paiement jamais pré-ajoutés, lots à prix réel, seuil de livraison offerte calculé par formule à partir de `prix-et-marges.md` (activable seulement avec un panier, phase 2).

## 2. Parcours d'achat

Personne de 25 à 55 ans, sur téléphone, dans le navigateur intégré de TikTok, Instagram ou Pinterest (session non conservée, connexion parfois lente). Le parcours ne dépend d'aucun compte, panier mémorisé ni cookie.

| # | Étape | Ce que voit la personne | Ce qui rassure | Friction et parade |
|---|---|---|---|---|
| 1 | Vidéo | Assemblage en accéléré, mains seules, puis mécanisme qui tourne. Texte à l'écran : nom exact du modèle, temps d'assemblage | Vraie vidéo du vrai produit (jamais un rendu pour un produit vendu) | Lien introuvable : nom exact du modèle écrit dans la vidéo |
| 2 | Lien en bio | Lien direct vers la **fiche produit** du modèle (UTM, partie 2 §8), ou vers l'accueil pour une vidéo d'ambiance | Domaine propre dès son achat | Un seul lien en bio : fiche du produit mis en avant |
| 3a | Arrivée sur la fiche | Sans défiler sur 360 × 640 : photo, nom, badge « 14 ans et plus », prix final, frais et délai de livraison, bouton « Acheter » | Prix complet et délai concret tout de suite | Page lente : fiche en registre clair, sans GSAP, budget §4.0 |
| 3b | Arrivée sur l'accueil | Héros engrenages, titre, bouton « Découvrir les maquettes », ligne délai et paiement | Délai et paiement visibles dès l'écran 1 | L'animation ne bloque jamais le bouton ni la lecture |
| 3c | Hésitation | Questionnaire « Trouver ma maquette » (3 questions) → 1 à 3 maquettes recommandées, avec la raison | Recommandation expliquée par des faits (niveau, temps) | Aucune donnée demandée, aucune réponse enregistrée |
| 4 | Défilement de la fiche | Galerie 6 vues, bénéfices, description, caractéristiques, contenu de la boîte, Sécurité du produit, livraison et retours, FAQ | Informations précises, droits clairement présentés comme des droits | Bouton hors écran : barre d'achat collante (mobile) |
| 5 | « Acheter » | Page de paiement Stripe, même onglet | Phrase sous le bouton : « Paiement sur la page sécurisée de Stripe, notre prestataire de paiement. Nous ne voyons jamais vos données bancaires. » | Changement de site annoncé ; page Stripe aux couleurs de la marque |
| 6 | Page Stripe | Produit, quantité 1 à 3, articles facultatifs proposés (jamais ajoutés d'office), champ « Message cadeau » facultatif (si activé), adresse France, livraison et prix, case CGV, texte sous le bouton, bouton « Payer … € » | Total visible avant de payer ; CGV et confidentialité en lien | Portefeuilles (Apple Pay, Google Pay, Link) : libellé à capturer en recette (partie 2 §6.4) |
| 7 | `/merci/` | « Merci, votre commande est enregistrée » + étapes datées | Rappel du droit de rétractation, contact | Page statique : ne promet rien de plus que le paiement |
| 8 | Reçu Stripe | Reçu automatique en français | Preuve de paiement immédiate | Reçus activés dans Stripe |
| 9 | Email de confirmation du contrat | Récapitulatif, CGV en PDF **de la version acceptée**, formulaire type de rétractation, lien « Renoncer au contrat ici », toutes les informations précontractuelles | Support durable (audit point 14) | **Règle bloquante : aucune expédition tant que cet email n'est pas parti** (procédure `gestion-commandes` + liste de contrôle quotidienne). Envoi sous 24 h ouvrées `[À VÉRIFIER]` |
| 10 | Expédition | Email avec numéro de suivi | Suivi transporteur | Retard : prévenir, proposer annulation et remboursement sous 14 jours |
| 11 | Réception, assemblage | Colis, notice, message cadeau imprimé si demandé (option B uniquement) | Pièce manquante : une photo par email (garantie légale de conformité) | Carte dans le colis optionnelle, coût `[À VÉRIFIER]` |
| 12 | Après | « Renoncer au contrat ici » dans le pied de page de toutes les pages ; lettre de l'atelier si la personne s'est inscrite | Accusé de réception immédiat | — |

**Absents volontairement** : création de compte, pop-up, compte à rebours, compteur de stock, « X personnes regardent », fausses ventes récentes, avis (tant qu'il n'y en a pas de vrais), code promo à l'inscription.

## 3. Plan du site

| Page | URL | Registre | Objectif | Appel à l'action principal |
|---|---|---|---|---|
| Accueil | `/` | Cinématique | Donner envie et confiance, orienter | « Découvrir les maquettes » → `/maquettes/` |
| Catalogue | `/maquettes/` | Clair | Choisir un modèle | Ouvrir une fiche (carte entière cliquable) |
| Catalogue par niveau | `/maquettes/niveau/[facile\|moyen\|expert]/` | Clair | Filtrer sans JavaScript | Ouvrir une fiche |
| Collection | `/collections/[mecanique\|vehicules\|miniatures\|pour-debuter\|idees-cadeaux]/` | Cinématique puis clair | Faire rêver sur une famille, puis choisir | Ouvrir une fiche |
| Fiche produit | `/maquettes/[slug]/` | Clair | Vendre ce modèle | « Acheter » → Payment Link (désactivé si démo) |
| Lot | `/lots/[slug]/` (phase lots, partie 2 §5.6) | Clair | Vendre un lot | « Acheter le lot » |
| Trouver ma maquette | `/trouver-ma-maquette/` + étapes `/trouver-ma-maquette/[pour-qui]/`, `/[pour-qui]/[niveau]/`, `/[pour-qui]/[niveau]/[temps]/` (27 pages, noindex) | Clair | Version sans JavaScript et partageable du questionnaire | Choisir une réponse, puis ouvrir une fiche |
| L'atelier | `/atelier/` | Cinématique | Conseils d'assemblage, lettre d'information | « Recevoir la lettre » |
| Lettre : vérifiez vos emails | `/lettre/verifiez/` (noindex) | Clair | Expliquer la double confirmation | « Retour à l'accueil » |
| Lettre : confirmer | `/lettre/confirmer/?t=[jeton]` (noindex) | Clair | Confirmer l'inscription par un clic volontaire | « Confirmer mon inscription » |
| Lettre : désinscription | `/lettre/desinscription/?t=[jeton]` (noindex) | Clair | Se désinscrire en un clic | « Confirmer la désinscription » |
| Merci | `/merci/` (noindex) | Clair | Rassurer après paiement | « Voir nos vidéos d'assemblage » |
| À propos | `/a-propos/` | Clair | Qui est derrière la boutique | « Découvrir les maquettes » |
| Livraison et retours | `/livraison-et-retours/` | Clair | Délais, frais, rétractation, garanties | « Découvrir les maquettes » |
| FAQ | `/faq/` | Clair | Répondre | « Nous écrire » |
| Contact | `/contact/` | Clair | Joindre la boutique | « Écrire un email » |
| Renoncer au contrat | `/renoncer-au-contrat/` | Clair | Rétractation en ligne | « Confirmer la rétractation » |
| Rétractation enregistrée | `/renoncer-au-contrat/confirmation/` (noindex) | Clair | Accusé à l'écran | « Retour à l'accueil » |
| Mentions légales, CGV (+ PDF daté), Confidentialité, Cookies | `/mentions-legales/`, `/cgv/`, `/cgv-[AAAA-MM-JJ].pdf`, `/confidentialite/`, `/cookies/` | Clair | Obligations légales | Aucun (CGV : « Télécharger les CGV (PDF) ») |
| 404 | `/404` | Clair | Remettre sur le chemin | « Découvrir les maquettes » |

**Fonctions serveur (Cloudflare Pages Functions, offre gratuite)** : `POST /api/retractation` ; `POST /api/lettre` (inscription) ; `POST /api/lettre/confirmer` ; `POST /api/lettre/desinscrire` (+ en-tête `List-Unsubscribe-Post` pour le désabonnement en un clic des messageries). Aucune clé secrète dans le dépôt (variables d'environnement Cloudflare).

**Fichier de réglages de l'accueil** `site/src/content/reglages/accueil.yaml` (édité par l'humain ou l'orchestrateur) :

```yaml
mode_demo: true                 # bandeau global + noindex sur tout le site (partie 2, §5.3 V11)
produit_comparateur: horloge-murale-balancier   # « De la planche à l'objet »
produit_eclate: boite-engrenages-initiation      # « Dans la boîte »
selection_du_moment: [boite-engrenages-initiation, locomotive-vapeur, horloge-murale-balancier, planetaire-mecanique]
conseils_atelier: [detacher-une-piece, engrenage-qui-accroche, ranger-les-planches]   # textes À RÉDIGER
faq_apercu: [delai, difficulte, retractation, piece-manquante]
offrir:
  message_cadeau_actif: false   # true seulement en option B (expédition par l'humain), partie 2 §5.6
  date_limite_noel: null        # "AAAA-MM-JJ" fixée par l'humain ; affichée du 15/11 au 24/12 seulement
lettre:
  active: false                 # true quand le service d'emails est choisi et la confidentialité mise à jour
  frequence: "[À VÉRIFIER : une fois par mois ?]"
seuil_soirees_heures: 3         # accroche « en quelques soirées » si tous les produits en vente ≤ seuil (audit point 27)
```

## 4. Spécifications des pages

### 4.0 Règles communes

**Grille** : conception à 360 px d'abord ; ruptures 640 / 768 / 1024 / 1280 px ; conteneur 1200 px ; marges latérales `clamp(16px, 4vw, 48px)` (prototype). Zones cliquables ≥ 44 × 44 px. Texte courant 16 px minimum, interligne 1,65. Langue `fr`, lien « Aller au contenu » en premier.

**Système de mouvement** (repris du prototype, normalisé)

| Jeton | Valeur | Usage |
|---|---|---|
| `--ease-out` | `cubic-bezier(.22,1,.36,1)` ; GSAP `expo.out` | Toutes les révélations et l'interface |
| Interface | 150 à 400 ms | Survol, focus, boutons, accordéons |
| Révélation R1 « titre » | Lignes `yPercent 110 → 0`, 1,2 s, décalage 0,12 s, masque `overflow:hidden` | H1 et H2 éditoriaux |
| Révélation R2 « bloc » | `y 20 → 0`, opacité 0 → 1, 1,0 s, décalage 0,1 s | Paragraphes, boutons, listes |
| Révélation R3 « cartes » | `ScrollTrigger.batch`, départ `top 88%`, `y 24 → 0`, 0,9 s, décalage 0,08 s | Grilles de cartes |
| Déclencheur standard | `start: "top 85%"`, `once: true` (pas de rejeu en remontant) | Toutes les révélations |
| Défilement lié | `scrub: 0.6` | Sections épinglées |
| Rotation continue | linéaire (seule exception autorisée) | Engrenages |

Règles techniques :
- **Épinglage par CSS** (`position: sticky` dans un conteneur haut), comme le prototype, plutôt que l'épinglage GSAP : plus robuste dans les navigateurs intégrés des applications.
- Animer **uniquement** `transform` et `opacity` (et `clip-path` pour le comparateur). Pas de Lenis (défilement fluide) : il gêne le défilement natif sur mobile et au clavier.
- Les rotations s'arrêtent quand la section sort de l'écran (`IntersectionObserver`) ou que l'onglet est caché (`visibilitychange`).
- **Sans animation** (`prefers-reduced-motion: reduce`) **ou économie de données** (`navigator.connection.saveData`) : GSAP **n'est pas chargé du tout** (import dynamique conditionnel), aucune lecture automatique de vidéo, pas de 3D automatique. Tout le contenu reste visible et complet.
- **Sans JavaScript** : aucun contenu n'est caché par défaut. Les états initiaux masqués ne s'appliquent que sous la classe `html.js-anim`, posée par un script en ligne de 1 ligne seulement si l'animation va réellement tourner.
- Les engrenages SVG sont **calculés à la construction** (composant Astro qui génère les tracés) : ils s'affichent immobiles sans JavaScript ; le script ne fait que les tourner.
- **Production** : le prototype charge Google Fonts et GSAP depuis des CDN. **Interdit en production** : polices via Fontsource et GSAP via npm, servis depuis notre domaine (aucune requête vers un tiers).

**Budgets de performance** (mobile, 4G simulée, Lighthouse)

| Page | JS compressé au chargement | Poids au premier écran | Poids total après défilement complet | Lighthouse performance |
|---|---|---|---|---|
| Accueil, collections, atelier | ≤ 70 Ko (GSAP + ScrollTrigger ≈ 45 Ko + notre code) | ≤ 300 Ko (le héros est en SVG, aucune image) | ≤ 2 Mo (images en chargement différé) | ≥ 85 exigé, 90 visé |
| Fiche, catalogue, aide, légal | ≤ 30 Ko (sans GSAP) ; visionneuse 3D chargée seulement au clic | ≤ 400 Ko | ≤ 1,2 Mo hors vidéo et 3D | ≥ 90 (`direction-design.md`) |

LCP < 2,5 s, CLS < 0,1, INP < 200 ms. Images WebP (AVIF si le gain est net) avec `srcset` 800 / 1600 px, dimensions déclarées. Polices : Cormorant Garamond 400 et 400 italique, Inter variable, sous-ensemble latin, `font-display: swap`, préchargement des deux fichiers du premier écran.

**Navigation (toutes les pages)**
- Barre fixe minimale, hauteur 64 px (56 px mobile). Sur l'accueil et les pages cinématiques : transparente au-dessus du héros, puis fond `rgba(10,15,26,.72)` + flou 14 px + filet bas après 40 px de défilement (transition 300 ms). Sur les pages claires : fond `rgba(251,250,247,.8)` + flou, texte `#111827`.
- Gauche : logotype « Rouage **&** Laiton » en Cormorant (« & » en laiton), lien vers `/`.
- Ordinateur : « Maquettes », « Idées cadeaux », « L'atelier », « Aide » (→ `/faq/`). **Pas d'icône panier ni de recherche** au lancement (pas de panier ; 10 produits, le questionnaire remplace la recherche).
- Mobile : « Maquettes » + icône `Menu` → panneau latéral (mêmes liens + « Trouver ma maquette », « Livraison et retours », « Contact ») ; fermeture `X`, Échap, clic hors panneau ; focus piégé. Ouverture 300 ms `translateX`, instantanée sans animation.
- Fiche produit (mobile) : la barre se masque au défilement vers le bas et revient vers le haut, pour laisser la place au produit.

**Bandeau de réassurance (pages claires uniquement)**, une ligne fixe, texte non défilant, formulé comme des droits (audit point 26) :
- mobile : « Livraison en [X] à [Y] jours · Droit de rétractation 14 jours » ;
- ordinateur : « Livraison suivie en France métropolitaine en [X] à [Y] jours · Droit de rétractation 14 jours · Paiement par Stripe ».
- Valeurs issues des données produit (min et max des produits en vente).

**Bandeau mode démonstration** (si `mode_demo: true`) : au-dessus de tout, fond `#111827`, texte `#F5F1E8`, icône `Info` : « Boutique en préparation. Les maquettes présentées sont des démonstrations (rendus 3D) : rien n'est en vente pour le moment. » Non masquable. Toutes les pages en `noindex`.

**Pied de page (toutes les pages, registre sombre)**
- Au-dessus des colonnes, bouton contour toujours visible : **« Renoncer au contrat ici »** (icône `FileX`) → `/renoncer-au-contrat/`. Jamais dans un accordéon.
- Colonnes : Boutique (Maquettes, Collections, Trouver ma maquette, L'atelier, À propos) ; Aide (Livraison et retours, FAQ, Contact, Pièce manquante → `/contact/#piece-manquante`, Renoncer au contrat ici) ; Informations légales (Mentions légales, CGV, Confidentialité, Cookies).
- Ligne finale : « © [ANNÉE] Rouage & Laiton · [Prénom Nom] EI · TVA non applicable, art. 293 B du CGI · Paiement par carte géré par Stripe » ; liens texte vers les réseaux (pas de logos de marques tierces en icônes Lucide).
- Mobile : colonnes en accordéons natifs `details/summary`, sauf le bouton de rétractation.

**Composants (esprit shadcn/ui)**
- Bouton principal (un seul style « principal » par page, utilisé seulement pour l'action principale) : pilule (rayon 999 px), 48 px de haut, flèche `ArrowRight` qui glisse de 3 px au survol, pression `scale(.97)`. Sur fond sombre : fond `#F5F1E8`, texte `#0A0F1A` (17,0:1). Sur fond clair : fond `#1E3A5F`, texte blanc (11,5:1).
- Bouton secondaire : pilule contour 1 px (`rgba(245,241,232,.10)` sur sombre, `#E7E5E4` sur clair) ; survol : contour et texte laiton (`#C8A15A` sur sombre, `#8A6A3A` sur clair).
- Focus visible partout : anneau 2 px + décalage 2 px, `#C8A15A` sur sombre, `#1E3A5F` sur clair.
- Carte produit (prototype amélioré) : fond blanc, bordure `#E7E5E4`, rayon 18 px, image 4:5 sur fond `radial-gradient(70% 60% at 50% 40%, #F4EEE2, #E9E2D3)`, badge « 14 ans et plus » en haut à gauche, badge « Démonstration » en haut à droite si `demo`, nom 16 px 600, ligne `Clock` [temps] · `Gauge` [niveau], prix 20 px 600, pastille ronde flèche (décorative, `aria-hidden` : **la carte entière est un seul lien**, libellé « Voir la maquette [nom] »). Survol (ordinateur) : carte −4 px, ombre `0 18px 40px rgba(17,24,39,.08)`, l'image passe en fondu vers la vue `detail` avec `scale(1.04)` en 600 ms. Mobile : pas d'effet de survol.
- Accordéon : `details/summary`, `ChevronDown` qui pivote, ouverture animée 250 ms (désactivée sans animation).
- Icônes : **Lucide uniquement**, trait 1,75 px partout ; 20 px (16 px dans les métadonnées de carte). Laiton foncé `#8A6A3A` sur clair, laiton `#C8A15A` sur sombre. Jeu : `Truck`, `RotateCcw`, `LockKeyhole`, `ShieldCheck`, `Clock`, `Gauge`, `Ruler`, `Package`, `Mail`, `Gift`, `Wrench`, `Rotate3d`, `ZoomIn`, `Info`, `FileX`.
- Grain de film : calque fixe, opacité 0,06, uniquement sur les fonds sombres ; animation du grain arrêtée sans animation.

**Interdits sur toutes les pages** : emoji, compte à rebours, stock affiché, « X personnes regardent », fausse vente récente, faux avis ou note, prix barré sans prix antérieur réel, pop-up, bannière clignotante, dégradé criard.

### 4.1 Accueil `/` (registre cinématique)

Objectif : donner envie, rassurer, orienter. Action principale unique : « Découvrir les maquettes » (héros et rappel final). Les autres actions sont des boutons secondaires ou des liens.

Ordre et registre : 1 Héros (sombre) → 2 Récit épinglé (sombre) → 3 De la planche à l'objet (sombre) → 4 Dans la boîte (sombre) → *panneau clair qui monte* → 5 Collections → 6 Les maquettes du moment → 7 Trouver ma maquette → 8 Échelle de difficulté → 9 Offrir → *panneau sombre* → 10 L'atelier → *panneau clair* → 11 FAQ et réassurance → pied de page sombre.

**Transitions de registre** : la section suivante a des coins supérieurs arrondis de 32 px (24 px mobile) et `z-index` supérieur ; elle « monte » sur la précédente (`translateY 80 px → 0` lié au défilement, sur les 30 % finaux de la section d'avant). Sans animation : simple coin arrondi.

#### 4.1.1 Héros engrenages (repris du prototype, enrichi)

| Élément | Spécification |
|---|---|
| Contenu | Sur-titre (kicker laiton, majuscules, filet de 28 px) : « Maquettes mécaniques en bois ». H1 sur deux lignes : « La mécanique, » / « *pièce par pièce.* » (2e ligne en italique laiton). Texte : « Des engrenages découpés au laser, une notice illustrée, et ce moment où tout se met en mouvement. À assembler soi-même. Pour les 14 ans et plus. » Bouton principal « Découvrir les maquettes » → `/maquettes/`. Bouton secondaire « Trouver ma maquette » → ancre §4.1.7. Ligne de réassurance sous les boutons (14 px, `#A8A29A`, icônes `Truck` et `LockKeyhole`) : « Livraison suivie en [X] à [Y] jours · Paiement par Stripe ». Indication « Défiler » avec filet qui s'écoule (prototype). |
| Visuel | Chaîne de 4 engrenages SVG qui s'engrènent réellement (module 9, dents 36 / 18 / 24 / 12, sens alternés, rapports de vitesse selon les dents, décalage de phase : algorithme du prototype). Dégradés laiton et bois du prototype. Halos : radial laiton 16 % à droite, radial bleu nuit `#1E3A5F` 45 % en bas à gauche. Grain de film. |
| Ajouts au-dessus du prototype | (1) **Parallaxe au pointeur** (ordinateur seulement) : engrenages déplacés de ±12 px et halo laiton de ±24 px selon la position de la souris, lissage 600 ms. (2) **Tracés calculés à la construction** (affichage immédiat, rien ne « saute »). (3) Petit 5e engrenage en arrière-plan flou (`filter: blur(2px)`, opacité 0,35) pour la profondeur. (4) Pause des rotations hors écran. |
| Animation | Entrée : lignes du H1 en R1 (1,2 s, décalage 0,12 s, délai 0,15 s) ; kicker, texte, boutons en R2 (délai 0,5 s) ; engrenages `opacity 0 → 1`, `scale .9 → 1`, 1,8 s `expo.out`. Rotation continue : 0,06 °/image pour la grande roue ; **accélération au défilement** (`boost += vitesse × 0,02`, plafond 4, amorti × 0,92 par image). Sortie liée au défilement : engrenages `yPercent 0 → −30`, opacité → 0,25 ; texte `yPercent 0 → −40`, opacité → 0. |
| Déclencheur | Chargement de la page ; défilement (`scrub: true`) sur toute la hauteur du héros. |
| Durée | Entrée complète en 2 s ; aucun élément interactif n'est inutilisable pendant l'entrée (boutons cliquables dès l'affichage). |
| Mobile | Hauteur `100svh`, minimum 620 px. Engrenages en haut à droite (`right: -55vw; width: 120vw; top: 30%`), opacité 0,3 pour garantir la lecture. H1 52 px. Boutons pleine largeur, empilés. Pas de parallaxe au pointeur. Le bouton principal reste visible sans défiler sur 360 × 640. |
| Sans animation / sans JS | Engrenages immobiles (SVG statique), texte visible immédiatement, pas de grain animé ni de filet animé. |
| Accessibilité | Engrenages `aria-hidden`. Contraste texte `#F5F1E8` sur nuit 17,0:1 ; texte secondaire `#A8A29A` 7,6:1 ; ombre portée du prototype conservée sur le texte. |

#### 4.1.2 Récit épinglé « Ouvrir, Assembler, Tourner »

| Élément | Spécification |
|---|---|
| Contenu | 3 étapes (numéro « 01 / 03 » en laiton, H2 serif avec fin en italique laiton, paragraphe) : **01** « Ouvrir *la boîte.* » : « Des planches de bois prédécoupées et une notice illustrée. [Si tous les produits en vente ont `colle_necessaire: false` et `outils_necessaires` vide : « Ni colle, ni outil spécial. »] » **02** « Assembler, *sans se presser.* » : « [Si tous les produits en vente ≤ `seuil_soirees_heures` : « Quelques soirées »] [sinon : « À votre rythme, de [min] à [max] heures selon le modèle »], et le plaisir de voir l'objet prendre forme entre vos mains. » **03** « Tourner *la manivelle.* » : « Sur nos modèles mécaniques, une manivelle, un ressort ou un moteur élastique met tout en mouvement. Un objet que vous avez construit, posé sur votre bureau. » Barre de progression à 3 segments. |
| Visuel (au-dessus du prototype, qui ne faisait tourner que 2 engrenages) | SVG unique, 3 états : **(1)** une planche de bois vue de face avec les contours des engrenages gravés (trait brûlé `#5A3E22`) ; **(2)** les 3 engrenages sortent de la planche (translation vers leurs axes, rotation de 0 à 40°), la planche s'efface (opacité → 0,15) et un cadre apparaît ; **(3)** les engrenages s'engrènent et tournent (grande roue 270°, petite roue `−270 × 32/13`°), une manivelle laiton tourne avec la grande roue, halo laiton qui s'intensifie. |
| Animation | Chronologie GSAP liée au défilement (`scrub: 0.6`) : étape i apparaît (`opacity 0 → 1`, `y 30 → 0`, 0,3 unité), son segment se remplit (`scaleX 0 → 1`, 0,7 unité), puis elle sort (`opacity → 0`, `y → −30`) sauf la dernière. Visuel : `scale 1 → 1,15` sur toute la section. |
| Déclencheur | Section de 300 vh (ordinateur) / 240 vh (mobile), contenu épinglé en `sticky` sur `100svh`. Début : haut de section en haut d'écran ; fin : bas de section en bas d'écran. |
| Durée | Liée au défilement (environ 3 écrans) ; aucune durée en temps. |
| Mobile | Une colonne : visuel 300 px de large au-dessus, texte dessous ; H2 44 px. |
| Sans animation / sans JS | Section de hauteur normale, les 3 étapes empilées et visibles, chacune avec une image fixe de son état (3 SVG statiques de 240 px), barre de progression masquée. |
| Accessibilité | Les 3 étapes sont dans le DOM dans l'ordre (un lecteur d'écran lit tout) ; visuel `aria-hidden`. |

#### 4.1.3 « De la planche à l'objet » : comparateur avant / après

| Élément | Spécification |
|---|---|
| Contenu | Kicker « Avant, après ». H2 « De la planche *à l'objet.* » Texte : « À gauche, ce que vous recevez. À droite, ce que vous aurez construit : [nom du `produit_comparateur`], [nombre_pieces] pièces, [temps] heures. » Lien secondaire « Voir cette maquette » → fiche. Légende sous l'image si l'image est un rendu : « Rendu 3D de démonstration ». |
| Visuels (studio-visuel) | Deux images **cadrées à l'identique** (même caméra, même lumière, fond nuit) : `ambiance/comparateur-planches.webp` (planches à plat) et `ambiance/comparateur-monte.webp` (maquette montée). 1600 × 1000 (ordinateur), 800 × 1000 (mobile, cadrage portrait). Pour un vrai produit vendu : photos réelles uniquement. |
| Interaction | Image « après » superposée, découpée par `clip-path: inset(0 0 0 var(--pos))`. Poignée verticale : filet `#F5F1E8` 2 px + pastille ronde 44 px avec icônes `ChevronLeft` / `ChevronRight`. Pilotage : glisser (souris, doigt), clic ou toucher sur une position, clavier via un `input type="range"` superposé (0 à 100, flèches ±5, Page ±10, Début / Fin), `aria-label` « Comparer les planches et la maquette montée », `aria-valuetext` « [n] % maquette montée ». Étiquettes fixes « Avant » (gauche) et « Après » (droite), qui s'estompent quand la poignée passe dessus. |
| Animation | **Invitation unique** : à l'entrée, la poignée glisse de 50 % à 72 %, puis à 35 %, puis revient à 50 % (1,6 s au total, `power3.inOut`), seulement si l'utilisateur n'a pas encore touché le comparateur. Titre en R1, texte en R2. Le cadre entre avec `scale .96 → 1` et opacité (1 s). |
| Déclencheur | `start: "top 70%"`, une seule fois. |
| Mobile | Ratio 4:5, pleine largeur. `touch-action: pan-y` sur l'image (le défilement vertical reste libre) ; le glissement horizontal sur la poignée ou l'image déplace la découpe. |
| Sans animation | Pas d'invitation automatique ; le comparateur reste utilisable (action volontaire). |
| Sans JS | Deux figures côte à côte (empilées sur mobile) avec leurs légendes « Avant : les planches » / « Après : la maquette montée ». |

#### 4.1.4 « Dans la boîte » : vue éclatée qui se rassemble

| Élément | Spécification |
|---|---|
| Contenu | Kicker « Dans la boîte ». H2 « Tout est là. *Il ne manque que vous.* » Compteur « [nombre_pieces] pièces » (données du `produit_eclate`). Liste « Dans la boîte » générée depuis `contenu_boite`. Lien secondaire « Voir [nom] ». Légende « Rendu 3D de démonstration » si rendu. |
| Visuels (studio-visuel) | 6 à 8 calques WebP transparents, **même caméra et même cadre** (1200 × 1200), un par groupe de pièces (socle, cadre, grande roue, petite roue, axe, manivelle…), + `vue-eclatee.json` : `{ calque, fichier, dx, dy, rotation, etiquette }` (décalage en position éclatée, en % du cadre). Poids cible ≤ 60 Ko par calque. |
| Animation | Liée au défilement (`scrub: 0.6`) : départ éclaté (chaque calque à `dx, dy, rotation`, opacité 0,9), arrivée assemblée (0, 0, 0°). Ordre de rassemblement : du socle vers la manivelle, décalé (chaque calque commence 8 % après le précédent). Étiquettes fines (filet laiton + nom de la pièce, 13 px) visibles en position éclatée, qui s'effacent à mesure que leur pièce rejoint sa place. En fin de course : léger flash de halo laiton (opacité 0 → 0,4 → 0,2, 0,8 s), le compteur s'arrête sur « [n] pièces, une maquette ». |
| Déclencheur | Section de 200 vh (ordinateur) / 160 vh (mobile), visuel épinglé en `sticky`. |
| Mobile | Visuel 90 vw, étiquettes remplacées par des pastilles numérotées ; légende numérotée en liste sous le visuel. |
| Sans animation | Deux images fixes côte à côte (empilées sur mobile) : vue éclatée avec étiquettes (`ambiance/eclatee-statique.webp`) et vue assemblée, + liste du contenu. |
| Sans JS | Identique à « sans animation ». |
| Accessibilité | Visuel `aria-hidden` ; l'information (liste des pièces, contenu de la boîte) est en texte HTML. |

**Panneau clair** (fond `#FBFAF7`, texte `#111827`) pour les sections 5 à 9.

#### 4.1.5 Collections

| Élément | Spécification |
|---|---|
| Contenu | H2 « Quatre façons *de commencer.* » (italique en `#8A6A3A`). 4 grandes cartes, chacune : visuel, nom (serif 36 px), une phrase, ligne calculée « [n] modèles · de [prix min] à [prix max] » (+ « · de [min] à [max] h »), lien implicite « Voir la collection [nom] ». **Mécanique** : « Engrenages, cames et manivelles. Des objets qui bougent vraiment. » **Véhicules** : « Locomotive, voiture rétro : des roues qui tournent. » **Miniatures** : « Des scènes à poser sur une étagère, dans le détail. » **Pour débuter** : « Nos modèles de niveau Facile, pour une première maquette. » |
| Visuels et animation au survol | Chaque carte = image de fond (rendu d'ambiance, 1200 × 900, ≤ 120 Ko) + calque animé SVG ou WebP transparent. Survol ou focus clavier : **Mécanique**, un engrenage laiton tourne de 60° (800 ms `expo.out`) et un second de −120° ; **Véhicules**, les roues tournent d'un tour et la bielle suit, la locomotive avance de 12 px ; **Miniatures**, la lumière de la scène se réchauffe (calque chaud opacité 0 → 0,6, 800 ms) et léger zoom 1,04 ; **Pour débuter**, trois pièces se détachent de leur planche (`y −10 px`, rotation ±6°, décalage 80 ms). Toutes : carte −6 px, ombre légère, flèche qui glisse. Retour à l'état initial en 400 ms à la sortie. |
| Déclencheur d'entrée | Cartes en R3 (cascade). |
| Mobile | Cartes empilées pleine largeur, ratio 16:10. Pas de survol : l'animation de chaque carte se joue **une fois** quand la carte atteint 60 % de visibilité. |
| Sans animation / sans JS | Visuels fixes, cartes visibles, liens fonctionnels. |
| Données | Collection `mecanique`, `vehicules`, `miniatures`, `pour-debuter` (= tous les produits `difficulte: facile`, calculé). |

#### 4.1.6 Les maquettes du moment (repris du prototype)

H2 « Les maquettes *du moment* » + lien « Tout le catalogue » (`ArrowRight`). 4 cartes produit (§4.0) depuis `selection_du_moment`. Entrée R3. Mobile : 1 colonne (2 à partir de 640 px, 4 à partir de 1024 px). « Du moment » = sélection éditoriale, **jamais** « meilleures ventes » ou « populaires » sans données réelles.

#### 4.1.7 « Trouver ma maquette » : questionnaire en 3 questions

| Élément | Spécification |
|---|---|
| Contenu | Carte large (fond blanc, bordure, rayon 24 px). H2 « Trouver *ma maquette.* » Sous-titre : « Trois questions, une suggestion. Vos réponses ne sont ni enregistrées ni transmises. » Indicateur « Question [n] sur 3 » + 3 segments. |
| Questions | **1. Pour qui ?** « Pour moi » / « Pour offrir ». Sous les choix : « Toutes nos maquettes sont conçues pour les 14 ans et plus. » (aucune option « enfant »). **2. Quel niveau ?** « C'est ma première maquette » / « J'en ai déjà monté une ou deux » / « J'ai l'habitude ». **3. Combien de temps ?** « Une ou deux soirées (jusqu'à 3 h) » / « Un week-end (jusqu'à 7 h) » / « Je prends mon temps (plus de 7 h) ». |
| Règle de recommandation (déterministe) | Niveaux admis : première → {facile} ; une ou deux → {facile, moyen} ; habitude → {moyen, expert}. Temps : soirées → `temps_assemblage_heures_max` ≤ 3 ; week-end → ≤ 7 ; je prends mon temps → aucun filtre. Tri : soirées → temps croissant ; week-end et je prends mon temps → temps décroissant. Égalité : « Pour offrir » place d'abord les produits de la collection `idees-cadeaux`, puis champ `ordre`. Maximum 3 résultats. **Aucun résultat** : on retire le filtre de temps, tri croissant, message « Aucun modèle de ce niveau ne se monte en [3 / 7] h ou moins. Voici les plus courts. » **1 ou 2 résultats** : complétés jusqu'à 3 par le filtre de temps retiré, avec l'étiquette « Demande un peu plus de temps : [n] h ». Seuls les produits publiés (en vente ; ou `presentation` en mode démonstration). |
| Résultat | 1 à 3 cartes produit + puces de raison factuelles (« Niveau Facile », « [n] h, dans votre temps »). Si « Pour offrir » : encadré `Gift` « À offrir : [message cadeau possible au paiement si actif] · droit de rétractation de 14 jours à compter de la réception ». Liens « Modifier mes réponses » et « Lien vers ce résultat » (URL statique). Jamais « parfait pour vous », « meilleur choix ». |
| Résultats attendus avec le catalogue de démonstration (tests de recette) | première + soirées : 1, 2, 3 · première + week-end : 2, 3, 1 · première + mon temps : 2, 3, 1 (+ message « Nos modèles faciles se montent en 2 à 3 h ») · une ou deux + soirées : 1, 2, 3 · une ou deux + week-end : 7, 6, 4 · une ou deux + mon temps : 8, 7, 6 · habitude + soirées : 4, 5, 6 (message « aucun en 3 h ou moins ») · habitude + week-end : 7, 6, 4 · habitude + mon temps : 10, 9, 8. (Numéros de `knowledge/catalogue-demo.md`.) |
| Animation | Choix = grandes tuiles (radio visuelles) ; sélection : bordure `#1E3A5F` 2 px, icône `Check` qui apparaît (200 ms). Passage à la question suivante : sortie `x 0 → −24 px` + opacité, entrée `x 24 → 0` (300 ms, `expo.out`), segment rempli (400 ms). Résultats : cartes en cascade (R3 accéléré : 0,6 s, décalage 0,08 s). |
| Déclencheur | Clic, toucher ou clavier (Entrée / Espace) sur une réponse. |
| Mobile | Tuiles pleine largeur empilées, 56 px de haut minimum. Résultats en une colonne. Bouton « Précédent » en haut de la carte. |
| Sans animation | Changements instantanés. |
| Sans JS | Chaque réponse est un **lien** vers la page statique de l'étape suivante (`/trouver-ma-maquette/moi/`, puis `/moi/premiere/`, puis `/moi/premiere/soirees/` = page résultat). 1 + 2 + 6 + 18 = 27 pages générées, `noindex`. Avec JS, le même balisage est intercepté et tout se passe dans la section. |
| Accessibilité et données | `fieldset` / `legend` par question ; focus déplacé sur la légende de la question suivante ; zone `aria-live="polite"` (« Question 2 sur 3 », « 3 maquettes trouvées »). Données : JSON compact des produits publiés (slug, nom, niveau, temps, prix, collections, image 800 px) **intégré dans la page à la construction** (aucune requête). Aucun cookie, aucun `localStorage`, aucune transmission. |

#### 4.1.8 Échelle de difficulté

| Élément | Spécification |
|---|---|
| Contenu | H2 « Facile, moyen, *expert.* » Introduction : « Notre échelle, établie à partir du nombre de pièces, du temps d'assemblage et du nombre de réglages. Elle peut différer de celle du fabricant. » 3 colonnes. **Facile** : jauge 1/3 ; « Pour une première maquette. Un mécanisme simple, peu de réglages. » ; « De [min] à [max] h dans notre catalogue · [n] modèles ». **Moyen** : jauge 2/3 ; « Vous avez déjà monté une maquette. Plus de pièces et quelques réglages (jeu des engrenages, tension). » ; mêmes chiffres calculés. **Expert** : jauge 3/3 ; « Pour les habitués. Mécanismes fins, ajustements précis, plusieurs séances. » ; chiffres calculés. Sous chaque niveau : 2 vignettes de produits exemples et lien « Voir les modèles [niveau] » → `/maquettes/niveau/[niveau]/`. |
| Visuel | Jauge = 3 segments horizontaux arrondis (laiton foncé `#8A6A3A` remplis, `#E7E5E4` vides) + petit engrenage Lucide-like dessiné en SVG maison à droite (taille identique aux icônes). Le niveau est aussi écrit en texte (jamais la couleur seule). |
| Animation | À l'entrée : segments qui se remplissent un à un (`scaleX 0 → 1`, 0,8 s, décalage 0,15 s, `expo.out`), colonnes en R3. Survol ou focus d'une colonne : élévation −4 px, l'engrenage tourne de 90° (600 ms), vignettes `scale 1.03`. |
| Déclencheur | `top 80%`, une fois. |
| Mobile | Colonnes empilées ; vignettes en ligne de 2. |
| Sans animation / sans JS | Jauges remplies, tout visible. |
| Accessibilité | Jauge `role="img"` avec `aria-label` « Niveau moyen, 2 sur 3 ». |

#### 4.1.9 Offrir

| Élément | Spécification |
|---|---|
| Contenu | Deux colonnes : visuel à gauche (rendu d'ambiance « maquette montée sur un bureau, papier kraft, lampe », studio-visuel), texte à droite. H2 « Un cadeau *qui se construit.* » Liste à icônes : `Clock` « Choisissez selon le temps qu'il ou elle aime y passer : de [min] à [max] h. » ; `Gift` « Message cadeau : écrivez quelques mots au moment du paiement, nous les glissons dans le colis. » (**seulement si** `message_cadeau_actif: true`) ; `Truck` « Livré en [X] à [Y] jours. [Si `date_limite_noel` et date du jour entre le 15/11 et le 24/12 : « Pour Noël, commandez avant le [JJ/MM] » ] » ; `RotateCcw` « Droit de rétractation : 14 jours à compter de la réception, comme pour tout achat en ligne. » Boutons secondaires : « Voir les idées cadeaux » → `/collections/idees-cadeaux/` ; lien « Trouver une maquette à offrir » → questionnaire préréglé sur « Pour offrir ». |
| Règles d'honnêteté | La date limite de Noël est une **date fixe** calculée par l'humain à partir du délai maximum réel ; **aucun compte à rebours**, aucun « plus que X jours ». Pas de mention « emballage cadeau » tant que ce service n'existe pas. Pas de « colis sans prix » tant que ce n'est pas vérifié auprès de l'expéditeur. |
| Animation | Visuel : parallaxe légère (`yPercent −8 → 8` lié au défilement). Une étiquette cadeau (SVG kraft + ficelle) suspendue au coin du visuel oscille doucement à l'entrée (rotation 0 → 4° → −2° → 0, 1,6 s, `elastic.out(1, .5)`) puis au survol du visuel. Texte en R1 / R2. |
| Déclencheur | `top 80%`, une fois (oscillation d'entrée). |
| Mobile | Visuel au-dessus (4:5), texte dessous ; boutons pleine largeur. |
| Sans animation / sans JS | Visuel fixe, étiquette immobile. |

**Panneau sombre** pour la section 10.

#### 4.1.10 L'atelier : conseils et lettre d'information

| Élément | Spécification |
|---|---|
| Contenu | Kicker « L'atelier ». H2 « Les gestes *qui font la différence.* » 3 cartes de conseils (depuis `conseils_atelier`), chacune : icône `Wrench`, titre, 2 lignes, lien « Lire le conseil » → `/atelier/#[ancre]`. Titres proposés (textes **À RÉDIGER** par `redacteur-catalogue` et vérifiés sur un vrai assemblage, aucun conseil inventé) : « Détacher une pièce sans la casser », « Quand un engrenage accroche », « Ranger les planches avant de commencer ». |
| Lettre d'information (si `lettre.active: true`) | Bloc séparé par un filet. Titre « La lettre de l'atelier ». Texte : « Un conseil d'assemblage et les nouveaux modèles, [fréquence]. Pas de publicité de partenaires. » Formulaire : champ « Votre adresse email » (`type=email`, `autocomplete=email`) ; case **non cochée, obligatoire** : « J'accepte de recevoir la lettre de l'atelier de Rouage & Laiton par email. Je peux me désinscrire à tout moment par le lien présent dans chaque lettre. » ; bouton secondaire laiton « Recevoir la lettre ». Sous le bouton (13 px, `#A8A29A`) : « Responsable : [Prénom Nom] EI. Votre adresse sert uniquement à envoyer cette lettre. Vous recevrez d'abord un email pour confirmer votre inscription. En savoir plus : politique de confidentialité. » **Aucune réduction ni cadeau contre l'inscription.** Si `lettre.active: false` : les conseils seuls, sans formulaire. |
| Fonctionnement (double confirmation) | `POST /api/lettre` : champ piège (même règle que la rétractation : jamais d'échec silencieux), validation, enregistrement « en attente » (email, date et heure, version du texte de consentement), envoi d'un email « Confirmez votre inscription » avec lien `/lettre/confirmer/?t=[jeton]`. Cette page affiche un bouton « Confirmer mon inscription » (`POST`) : un simple clic sur le lien ne suffit pas, pour que les antivirus de messagerie qui ouvrent les liens ne confirment pas à la place de la personne. Confirmation enregistrée avec date et heure (preuve du consentement). Inscriptions non confirmées effacées après 7 jours `[À VALIDER conformite-qa]`. Chaque lettre contient un lien de désinscription (page avec bouton `POST`) et l'en-tête `List-Unsubscribe` / `List-Unsubscribe-Post`. Adresse déjà inscrite : même message que pour une nouvelle adresse (ne révèle pas qui est inscrit). |
| Animation | Halo laiton qui suit lentement le pointeur dans la section (ordinateur, lissage 800 ms, opacité 0,12). Cartes en R3. Envoi réussi : le formulaire laisse place (fondu 300 ms) à `MailCheck` + « Vérifiez votre boîte mail : un lien de confirmation vient de partir. » |
| Mobile | Cartes empilées ; formulaire pleine largeur ; pas de halo au pointeur. |
| Sans animation | Pas de halo, changements instantanés. |
| Sans JS | Le formulaire est un vrai `POST` ; réponse = redirection 303 vers `/lettre/verifiez/`. Erreurs : page du formulaire renvoyée avec messages et saisie conservée. |
| Accessibilité | Erreurs en texte sous le champ (icône `CircleAlert`, couleur `#F87171` sur sombre, 6,9:1), résumé `role="alert"`, focus sur le premier champ en erreur ; message de succès en `aria-live`. |

**Panneau clair** pour la section 11.

#### 4.1.11 FAQ et réassurance

| Élément | Spécification |
|---|---|
| Réassurance (4 éléments, formulés comme des droits, audit point 26) | `Truck` « Livraison suivie » / « Délai affiché sur chaque fiche, avant le paiement : [X] à [Y] jours. » ; `LockKeyhole` « Paiement sécurisé » / « Par carte bancaire, sur la page de paiement de Stripe. » ; `RotateCcw` « Droit de rétractation » / « 14 jours à compter de la réception, comme le prévoit la loi. » ; `Wrench` « Pièce manquante ou abîmée à la réception ? » / « C'est couvert par la garantie légale de conformité. Une photo par email suffit pour nous le signaler. » |
| FAQ | H2 « Questions *fréquentes.* » 4 accordéons (`faq_apercu`) : délai de livraison, difficulté, comment se rétracter (avec le lien « Renoncer au contrat ici »), pièce manquante. Réponses reprises de `/faq/` (même source). Lien « Toutes les questions » → `/faq/`. |
| Rappel final | Phrase « Prêt à tourner la manivelle ? » + **bouton principal** « Découvrir les maquettes » (même cible que le héros). |
| Animation | Éléments de réassurance en cascade (0,8 s, décalage 0,08 s, prototype) ; accordéons 250 ms. |
| Mobile | Réassurance en grille 2 × 2 ; accordéons pleine largeur ; bouton pleine largeur. |
| Sans animation / sans JS | Tout visible ; accordéons natifs. |

SEO accueil : titre « Maquettes mécaniques en bois à assembler | Rouage & Laiton » (≤ 60 caractères), description ≤ 155 caractères avec « maquette en bois », « maquette mécanique », délai de livraison. Données structurées `Organization` + `WebSite`. Image de partage 1200 × 630 (héros rendu).

### 4.2 Catalogue `/maquettes/` (registre clair)

1. Fil d'Ariane Accueil › Maquettes. H1 « Maquettes en bois à monter » + « Maquettes mécaniques, véhicules et miniatures, pour adultes et ados de 14 ans et plus. Chaque fiche indique le temps d'assemblage et la difficulté. »
2. **Filtres** (10 produits, donc activés) : rangée de puces-liens « Toutes », « Mécanique », « Véhicules », « Miniatures », « Pour débuter » (→ pages de collection) et « Facile », « Moyen », « Expert » (→ `/maquettes/niveau/[niveau]/`). Liens, pas de JavaScript obligatoire. Mobile : rangée défilante horizontalement.
3. Grille de cartes (§4.0), tri par `ordre` puis nom ; entrée R3 discrète (0,6 s). Mobile 1 colonne ; 2 dès 640 px ; 3 dès 1024 px ; 4 dès 1280 px.
4. Produit en `rupture` : badge « Indisponible pour le moment » ; « Bientôt de retour » **seulement** si `reassort_prevu` est renseigné et réel (audit point 28).
5. Bloc réassurance compact (les 4 éléments du §4.1.11).
6. Encart secondaire : « Vous hésitez ? Trouver ma maquette en 3 questions » → `/trouver-ma-maquette/`.
Données structurées `ItemList`. Pages par niveau : même gabarit, H1 « Maquettes de niveau [Facile] », texte de définition du niveau (§4.1.8).

### 4.3 Pages de collection `/collections/[slug]/` (registre cinématique, puis clair)

Objectif : faire désirer une famille de maquettes, puis choisir. Action principale : ouvrir une fiche.

| # | Section | Contenu | Animation, déclencheur, durée | Mobile | Sans animation / sans JS |
|---|---|---|---|---|---|
| 1 | Héros de collection (sombre, `80svh`) | Kicker « Collection ». H1 serif (ex. « Mécanique ») + ligne italique laiton (Mécanique : « *qui tourne vraiment.* » ; Véhicules : « *sur roues et sur rails.* » ; Miniatures : « *des mondes à poser.* » ; Pour débuter : « *une première maquette.* » ; Idées cadeaux : « *qui se construisent.* »). Phrase de présentation (celle de la carte §4.1.5). Ligne calculée : « [n] modèles · de [min] à [max] h · de [prix min] à [prix max] ». Visuel animé propre à la collection. | Entrée : H1 en R1, texte en R2. Visuel : **Mécanique** = chaîne d'engrenages (moteur du héros, autre disposition) ; **Véhicules** = roue + bielle + piston en SVG, mouvement continu lié (bielle calculée) ; **Miniatures** = rendu en 3 calques avec parallaxe au défilement (±6 %) et lumière qui se réchauffe lentement (8 s, aller-retour) ; **Pour débuter** = planche dont les pièces se détachent puis se replacent, en boucle de 6 s avec pause de 2 s ; **Idées cadeaux** = étiquette kraft qui oscille + parallaxe. Accélération au défilement comme le héros (Mécanique, Véhicules). Sortie liée au défilement : visuel `yPercent → −20`, opacité → 0,3. | Visuel en haut à 40 % d'opacité derrière le texte (ou au-dessus du texte pour Miniatures), H1 44 px | Visuel fixe ; texte visible |
| 2 | Grille produits (panneau clair qui monte) | H2 « Les [n] modèles ». Puces de filtre par niveau (avec JS : masquent les cartes et mettent à jour `?niveau=` dans l'adresse, sans stockage ; sans JS : liens vers `/maquettes/niveau/...`). Cartes §4.0. | Cartes en R3 ; filtrage : cartes sortantes `opacity → 0, scale .96` (200 ms), réorganisation par technique FLIP (300 ms) | 1 colonne, puces défilantes | Toutes les cartes affichées |
| 3 | Ce qui les réunit | 3 points factuels générés depuis les données (ex. Mécanique : « Mécanisme : [manivelle, ressort…] », « De [n] à [n] pièces », « Niveaux : [facile à expert] ») | R3 | Empilés | Visibles |
| 4 | Autres collections | 3 cartes compactes (les autres collections), même animation de survol que §4.1.5 | R3, survol | Défilement horizontal avec accroche (`scroll-snap`) | Visuels fixes |
| 5 | Réassurance compacte + « Trouver ma maquette » | Comme catalogue §4.2 (5 et 6) | — | — | — |

Collection de moins de 3 produits (aujourd'hui : Miniatures = 1, Véhicules = 2) : la grille s'affiche normalement, suivie de « Vous aimerez peut-être aussi » (2 produits d'autres collections, même niveau). **Aucune mention « bientôt d'autres modèles »** sans plan réel. SEO : titre « Maquettes [mécaniques] en bois à assembler | Rouage & Laiton » ; données structurées `CollectionPage` + `ItemList`.

### 4.4 Fiche produit `/maquettes/[slug]/`

Spécification complète en partie 2, §5 (galerie 6 vues, zoom, 3D, bandeau démonstration, ordre des blocs, données, règles de validation). Action principale : « Acheter ». Configuration des Payment Links : partie 2, §5.5.

### 4.5 L'atelier `/atelier/` (cinématique)

Héros sombre (kicker « L'atelier », H1 « Les gestes *qui font la différence.* », visuel : mains et planches en rendu, sans visage). Conseils en sections ancrées (`#detacher-une-piece`, etc.), chacun : titre H2, texte (À RÉDIGER, vérifié), image ou courte vidéo muette (sans lecture automatique sur mobile), produit concerné en lien. Bloc lettre d'information identique au §4.1.10 (action principale de la page : « Recevoir la lettre » ; si `lettre.active: false`, action principale « Découvrir les maquettes »). Révélations R1 / R2 / R3. Plus tard : un article par conseil `/atelier/[slug]/`.

### 4.6 Merci `/merci/` (noindex, inchangé sur le fond depuis la v1)

1. `CircleCheck` + H1 « Merci, votre commande est enregistrée. »
2. « Vous allez recevoir dans quelques minutes le reçu de paiement de Stripe. Pensez à vérifier vos courriers indésirables. »
3. « Et ensuite ? » : « Sous [24 h ouvrées, À VÉRIFIER] : email de confirmation avec le récapitulatif, nos conditions de vente en PDF et le formulaire de rétractation. Nous n'expédions jamais avant de vous l'avoir envoyé. » ; « Sous [délai d'expédition, À VÉRIFIER] : votre colis part, avec un numéro de suivi. » ; « Au plus tard [Y] jours après votre commande : vous recevez votre maquette. »
4. Encadré : « Une question ? [EMAIL], réponse sous [N, À VÉRIFIER] jours ouvrés. Droit de rétractation : 14 jours à compter de la réception, depuis le lien « Renoncer au contrat ici » en bas de chaque page. »
5. Bouton principal « Voir nos vidéos d'assemblage » (réseau choisi par l'humain) ; lien « Retour à l'accueil ».
Animation : `CircleCheck` qui se dessine (tracé SVG, 600 ms) ; sans animation : icône fixe. Page statique : aucun détail de commande, paramètres d'URL non exploités.

### 4.7 À propos `/a-propos/` (corrigé, audit point 26)

1. H1 « Qui est derrière Rouage & Laiton ? »
2. Texte vrai à rédiger avec l'humain : prénom, Toulouse, pourquoi les maquettes en bois, critères réels de sélection (délai ≤ 14 jours, fabricant identifié, responsable UE, pièces vérifiées sur échantillon **seulement si c'est fait**), lieu d'expédition réel (« depuis Toulouse » en option B ; sinon « depuis l'entrepôt de notre fournisseur en [pays UE] »).
3. Photos : mains, atelier, maquettes montées ; aucun visage.
4. Section **« Vos droits et notre façon de travailler »** (remplace « Nos engagements ») : (a) **Vos droits** (comme pour tout achat en ligne) : rétractation de 14 jours à compter de la réception ; annulation et remboursement si le délai de livraison n'est pas tenu ; garantie légale de conformité de 2 ans, qui couvre une pièce manquante ou défectueuse ; garantie des vices cachés. (b) **Ce que nous faisons en plus** (seulement si validé par l'humain) : par exemple « Nous renvoyons une pièce cassée pendant le montage » (décision ouverte, audit §3 point 11). Supprimé : « aucune fausse promotion ».
5. Identité légale : « [Prénom Nom] EI, SIREN [À VÉRIFIER] · Voir les mentions légales ».
6. Bouton principal « Découvrir les maquettes ».

### 4.8 Livraison et retours `/livraison-et-retours/`

1. H1, sommaire d'ancres (Livraison, Rétractation, Pièce manquante, Garanties), collé en haut sur mobile (liste horizontale défilante).
2. **Livraison** : zone France métropolitaine ; délai « [X] à [Y] jours entre la commande et la réception » (tableau par produit généré si les délais diffèrent) ; transporteur et suivi `[À VÉRIFIER]` ; frais `[FRAIS]` **par commande, quel que soit le nombre de maquettes** (mécanique Stripe, partie 2 §5.6) ; retard : annulation possible, remboursement sous 14 jours, jamais d'avoir imposé ; **email de confirmation toujours envoyé avant l'expédition**.
3. **Droit de rétractation** : 14 jours à compter de la réception, sans justification ; 3 façons (bouton « Renoncer au contrat ici », email, formulaire type) ; adresse de retour `[À VÉRIFIER]` ; frais de retour `[À VÉRIFIER : à notre charge ou à la vôtre ; à défaut d'information avant la commande, ils sont à notre charge]` ; remboursement sous 14 jours (frais de livraison standard inclus), différable jusqu'à réception du colis ou preuve d'envoi. **Kit commencé** (texte de l'audit point 5, **[PRO]**) : « Vous pouvez examiner votre maquette comme vous le feriez en magasin : ouvrir la boîte, vérifier le contenu, les planches et la notice. Si vous commencez l'assemblage (pièces détachées des planches, assemblées ou collées), vous allez au-delà de ce qui est nécessaire pour établir la nature, les caractéristiques et le bon fonctionnement du produit. Votre droit de rétractation reste entier, mais votre responsabilité peut être engagée pour la dépréciation qui en résulte : nous pourrons alors déduire du remboursement un montant correspondant à la perte de valeur réelle, que nous vous justifierons par écrit. » Jamais « kit commencé = non remboursable », jamais de décote forfaitaire. Bouton secondaire « Renoncer au contrat ici ».
4. **Pièce manquante ou abîmée à la réception** : « C'est un défaut de conformité, couvert par la garantie légale. » Signalement par email avec photo, délai de réponse `[À VÉRIFIER]`, envoi de la pièce ou remplacement. Lien `/contact/#piece-manquante`.
5. **Garanties légales** : explication simple + renvoi à l'article 10 des CGV qui contient l'encadré officiel.
6. Bouton principal « Découvrir les maquettes ».

### 4.9 FAQ, Contact, Renoncer au contrat, 404

- **FAQ `/faq/`** : comme la v1 (thèmes Avant l'achat, Commande et paiement, Livraison, Retours et rétractation, Assemblage), plus : « Puis-je ajouter un message cadeau ? » (si actif), « Que deviennent mes réponses au questionnaire ? » (« Elles ne sont ni enregistrées ni transmises. »), « Comment me désinscrire de la lettre ? », « Pourquoi certains produits portent la mention Démonstration ? » (en mode démo). Réponses depuis `politiques.md` ; `FAQPage` ; action principale « Nous écrire ».
- **Contact `/contact/`** : inchangé (v1) : H1, délai de réponse, bouton « Écrire un email » (`mailto:`), 3 raccourcis avec objet prérempli dont `#piece-manquante` (« joignez une photo de la pièce et de la boîte »), téléphone et adresse, rappel « Pour vous rétracter, utilisez plutôt le formulaire Renoncer au contrat ici : accusé de réception immédiat. »
- **Renoncer au contrat** : partie 2, §6.2 (corrections des points 6, 7, 8, 9 de l'audit).
- **404** : H1 « Cette page n'existe pas (ou plus). », petit engrenage qui tourne puis se bloque avec un léger rebond (1,2 s, une fois ; fixe sans animation), bouton principal « Découvrir les maquettes », liens « Accueil », « Nous contacter ».
