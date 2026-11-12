---
agent: architecte-web
statut: à-valider   # toujours cette valeur
date: 2026-11-12
sources: [CLAUDE.md, docs/architecture.md, docs/site-technique.md, knowledge/niche.md, knowledge/politiques.md (proposé), knowledge/prix-et-marges.md (proposé), knowledge/contraintes.md, knowledge/direction-design.md, outputs/2026-11-12-conformite-qa-dossier-vente-legale-maquettes-bois.md, outputs/2026-11-12-conformite-qa-audit-sourcing-maquettes-bois-v2.md, outputs/2026-11-12-sourcing-produits-maquettes-bois-v2.md, tests/scenarios/architecte-web.md, sources externes de la section 10 (consultées le 2026-11-12)]
prochaine-etape: conformite-qa puis developpeur-web
---

# Conception de la boutique : maquettes en bois pour adultes

> `knowledge/marque.md` n'existe pas : le nom, la couleur et le ton définitifs sont remplacés par les marqueurs `[NOM DE LA BOUTIQUE]`, `[COULEUR PRINCIPALE]`, etc. Trois pistes d'identité sont proposées en section 7.
> Aucun produit n'est encore validé (sourcing v2 : seul le n°2 reste « en sursis renforcé »). Les données produit sont donc des marqueurs.
> Toute valeur `À VÉRIFIER` de `knowledge/politiques.md` (frais de livraison, délais, frais de retour, identité, IDU, médiateur) reste un marqueur ici. Rien n'est inventé.
> Les points marqués **[PRO]** relèvent d'une confirmation juridique, à faire par conformite-qa ou un professionnel.

## 1. Résumé (5 lignes)

1. **Parcours court, pensé téléphone** : vidéo TikTok / Instagram / Pinterest → fiche produit → bouton « Acheter » → page de paiement Stripe (Payment Link) → page « Merci » sur notre site → reçu Stripe → email de confirmation avec CGV en PDF.
2. **15 pages, une action principale chacune** : accueil, catalogue, fiche produit, merci, à propos, livraison et retours, FAQ, contact, renoncer au contrat (+ confirmation), mentions légales, CGV, confidentialité, cookies, 404.
3. **Conformité intégrée** : bloc « Sécurité du produit » (GPSR) toujours ouvert et badge « 14 ans et plus » sur chaque fiche ; lien « Renoncer au contrat ici » dans le pied de page de toutes les pages, formulaire puis bouton « Confirmer la rétractation », et accusé de réception horodaté par email via une petite fonction Cloudflare ; prix final, frais de livraison et délai affichés avant le bouton.
4. **Aucun cookie non essentiel au lancement** : mesure d'audience sans cookie (Cloudflare Web Analytics, à valider par conformite-qa) et statistiques intégrées aux Payment Links. Le bandeau cookies est spécifié mais ne s'active que si un outil non essentiel est ajouté. Polices auto-hébergées (aucune requête vers Google).
5. **Trois pistes d'identité** (Atelier / noyer, Sapin / vert forêt, Laiton / bleu nuit), contrastes WCAG AA vérifiés. L'humain doit en choisir une avant tout travail de `developpeur-web`.

## 2. Parcours d'achat

Hypothèse de départ : une personne de 25 à 55 ans regarde sur son téléphone une vidéo d'assemblage (mains seules, mécanisme en mouvement), dans l'application TikTok ou Instagram. Le navigateur intégré de l'application est souvent plus lent et ne garde pas de session : le parcours ne dépend d'aucune connexion ni d'aucun panier mémorisé.

| # | Étape | Ce que voit la personne | Ce qui rassure à cette étape | Risque de friction et parade |
|---|---|---|---|---|
| 1 | Vidéo | Timelapse d'assemblage, puis mécanisme qui tourne. Texte à l'écran : nom du modèle, temps d'assemblage, « lien en bio » | Produit réel filmé par nous (pas de visuel fournisseur retouché) | La personne ne trouve pas le lien → chaque vidéo indique en texte le nom exact du modèle |
| 2 | Lien en bio ou autocollant lien | Lien direct vers la **fiche produit** du modèle de la vidéo, avec paramètres UTM (section 8) | Nom de domaine propre (dès que le domaine est acheté) | Un seul lien en bio : pointer vers la fiche du produit mis en avant, ou vers `/maquettes/` s'il y a plusieurs produits mis en avant |
| 3 | Arrivée sur la fiche | Au-dessus de la ligne de flottaison sur mobile : photo, nom, badge « 14 ans et plus », prix final, frais et délai de livraison, bouton « Acheter » | Prix complet affiché tout de suite, délai concret « reçu en [X] à [Y] jours » | Page lente → budget de poids (section 4.0), première photo prioritaire, aucun script bloquant |
| 4 | Défilement | Ce que vous allez fabriquer (bénéfices), contenu de la boîte, difficulté et temps, dimensions, vidéo courte du mécanisme, bloc Sécurité du produit, livraison et retours, FAQ | Infos précises (nombre de pièces, outils nécessaires, temps), qui est derrière la boutique, retours 14 jours | Le bouton sort de l'écran → barre d'achat collante en bas sur mobile |
| 5 | Clic sur « Acheter » | Ouverture de la page de paiement Stripe (même onglet) | Phrase sous le bouton : « Paiement sur la page sécurisée de Stripe, notre prestataire de paiement. Nous ne voyons jamais vos données bancaires. » | Surprise de changer de site → la phrase l'annonce ; la page Stripe porte notre nom, logo et couleur |
| 6 | Page de paiement Stripe | Produit, quantité (1 à 3), email, adresse de livraison (France), mode de livraison et prix, case « J'accepte les CGV », texte d'information, bouton « Payer » | Montant total visible avant de payer, CGV et politique de confidentialité en lien, texte sous le bouton rappelant l'obligation de paiement et le droit de rétractation | Apple Pay / Google Pay parfois indisponibles dans les navigateurs intégrés : la carte reste toujours possible |
| 7 | Retour sur notre site : `/merci/` | « Merci, votre commande est enregistrée » + ce qui va se passer, avec des délais | Étapes datées, adresse de contact, rappel du droit de rétractation | Ne rien promettre de plus que ce que Stripe confirme (la page est statique) |
| 8 | Reçu Stripe (automatique) | Email de reçu en français, au nom de la boutique | Preuve immédiate du paiement | Activer les reçus automatiques dans Stripe (section 4.3) |
| 9 | Email de confirmation du contrat (envoyé par l'humain, modèle rédigé par `crm-email`) | Récapitulatif, délai, CGV en PDF datées, formulaire type de rétractation, lien « Renoncer au contrat ici » | Support durable exigé (art. L221-13 du code de la consommation) **[PRO : délai d'envoi et pièce jointe PDF jugée suffisante]** | Délai d'envoi : `À VÉRIFIER` (proposition : sous 24 h ouvrées) |
| 10 | Expédition | Email « Votre colis est parti » avec numéro de suivi (modèle `gestion-commandes`) | Suivi transporteur | Retard au-delà du délai annoncé : prévenir avant le client, proposer l'annulation et le remboursement sous 14 jours (`politiques.md`) |
| 11 | Réception et assemblage | Colis, notice, éventuellement carte glissée dans le colis (lien vers FAQ montage, adresse pour pièce manquante, rappel rétractation) | Procédure « pièce manquante » simple : email avec photo | Carte imprimée : coût `À VÉRIFIER`, optionnelle |
| 12 | Après | Possibilité de se rétracter 14 jours à compter de la réception, via le pied de page | Bouton toujours visible, accusé de réception immédiat | — |

**Ce qui est volontairement absent** : création de compte, panier multi-produits (un Payment Link = un produit au lancement ; quantité ajustable 1 à 3), pop-up d'inscription, compte à rebours, compteur de stock, avis clients (tant qu'il n'y a pas de vrais avis).

## 3. Plan du site

| Page | URL | Objectif | Appel à l'action principal |
|---|---|---|---|
| Accueil | `/` | Comprendre en 5 secondes ce qu'on vend, pour qui, et pourquoi faire confiance | « Voir les maquettes » → `/maquettes/` |
| Catalogue | `/maquettes/` | Choisir un modèle | « Voir la maquette » (une carte = un lien vers la fiche) |
| Fiche produit | `/maquettes/[slug]/` | Vendre ce modèle | « Acheter » → Payment Link Stripe |
| Merci | `/merci/` (noindex) | Rassurer après le paiement, annoncer la suite | « Voir nos vidéos d'assemblage » → compte TikTok ou YouTube `[À VÉRIFIER]` |
| À propos | `/a-propos/` | Dire qui est derrière la boutique | « Voir les maquettes » |
| Livraison et retours | `/livraison-et-retours/` | Lever les doutes sur délai, frais, retours, garanties | « Voir les maquettes » |
| FAQ | `/faq/` | Répondre aux questions avant et après achat | « Nous écrire » → `/contact/` |
| Contact | `/contact/` | Joindre la boutique | « Écrire un email » (lien `mailto:` prérempli) |
| Renoncer au contrat | `/renoncer-au-contrat/` | Exercer le droit de rétractation en ligne | « Confirmer la rétractation » |
| Rétractation enregistrée | `/renoncer-au-contrat/confirmation/` (noindex) | Afficher l'accusé à l'écran | « Retour à l'accueil » |
| Mentions légales | `/mentions-legales/` | Obligation LCEN | Aucun (page d'information ; lien discret « Nous écrire ») |
| CGV | `/cgv/` + `/cgv-[AAAA-MM-JJ].pdf` | Contrat de vente | « Télécharger les CGV (PDF) » |
| Confidentialité | `/confidentialite/` | Information RGPD | Aucun (lien « Nous écrire » pour exercer ses droits) |
| Cookies | `/cookies/` | Information traceurs | « Gérer mes choix » (visible seulement si le bandeau est actif) |
| Page introuvable | `/404` | Remettre sur le chemin | « Voir les maquettes » |

Fichiers techniques : `/sitemap.xml` (sans les pages noindex), `/robots.txt`, `/favicon.svg`, image de partage par défaut `/og-default.jpg` (1200 × 630).

Fonction serveur (Cloudflare Pages Functions, offre gratuite) : `POST /api/retractation` (section 6.2). C'est le seul code côté serveur au lancement.

## 4. Spécifications des pages

### 4.0 Règles communes à toutes les pages

**Grille et tailles**
- Conception à 360 px de large d'abord ; points de rupture 640, 768, 1024, 1280 px. Conteneur maximum 1200 px, marges latérales 16 px (mobile) / 24 px (tablette) / 32 px (ordinateur).
- Zones cliquables d'au moins 44 × 44 px. Texte courant 16 px minimum sur mobile (17 px sur ordinateur), interligne 1,6. Longueur de ligne maximum 70 caractères.
- Langue `fr` déclarée. Lien d'évitement « Aller au contenu » en premier élément focusable.

**Performance (budget, mesuré en 4G simulée sur mobile)**
- LCP < 2,5 s, CLS < 0,1, INP < 200 ms.
- Poids de la page d'accueil < 600 Ko au premier chargement (images comprises), fiche produit < 900 Ko hors vidéo. JavaScript total < 30 Ko compressé par page (hors bandeau cookies inactif).
- Images en AVIF/WebP avec `srcset`, dimensions déclarées, chargement différé sauf la première image. Vidéos en MP4 H.264 muettes, < 2 Mo, `preload="none"`, image d'affiche (poster).
- Polices auto-hébergées (paquets Fontsource), 2 graisses maximum par famille, `font-display: swap`. **Aucune requête vers Google Fonts** (transfert d'adresse IP à un tiers).

**En-tête (toutes les pages)**
- Bandeau de réassurance au-dessus de l'en-tête, une ligne, texte fixe (pas de défilement automatique), fond « surface atténuée » :
  - mobile : « Livraison en [X] à [Y] jours · Retours 14 jours » ;
  - ordinateur : « Livraison en France métropolitaine en [X] à [Y] jours · 14 jours pour changer d'avis · Paiement sécurisé par Stripe ».
  - Si les délais diffèrent selon les produits : « Livraison en [Y max] jours maximum ». Valeurs tirées des données produit, jamais écrites en dur.
- En-tête : `[NOM DE LA BOUTIQUE]` (logotype texte) à gauche, lien vers `/`. Ordinateur : liens « Les maquettes », « Livraison et retours », « À propos », « FAQ ». Mobile : lien « Maquettes » + icône Lucide `Menu` qui ouvre un panneau latéral (feuille) avec les mêmes liens + « Contact » ; fermeture par `X`, touche Échap, clic hors panneau ; focus piégé dans le panneau tant qu'il est ouvert.
- Pas d'icône panier (pas de panier au lancement). En-tête non collant (on garde la hauteur d'écran pour le produit).

**Pied de page (toutes les pages)**
- Bouton-lien bien visible, au-dessus des colonnes : **« Renoncer au contrat ici »** (icône Lucide `FileX`), lien vers `/renoncer-au-contrat/`. Style bouton secondaire (bordure), jamais masqué ni grisé.
- Colonne « Boutique » : Les maquettes, À propos, FAQ, Contact.
- Colonne « Aide » : Livraison et retours, Renoncer au contrat ici, Pièce manquante (→ `/contact/#piece-manquante`).
- Colonne « Informations légales » : Mentions légales, CGV, Politique de confidentialité, Cookies, et « Gérer les cookies » (seulement si le bandeau est actif).
- Ligne finale : « © [ANNÉE] [NOM DE LA BOUTIQUE] · [Prénom Nom] EI · TVA non applicable, art. 293 B du CGI » **[PRO : formule]** · « Paiement par carte géré par Stripe » · liens vers les comptes TikTok, Instagram, Pinterest, YouTube (icônes sans emoji ; Lucide ne fournit plus les logos de marques : utiliser des liens texte ou des pictogrammes officiels en SVG monochrome, `À VÉRIFIER` par developpeur-web).
- Mobile : colonnes empilées, chaque colonne en accordéon natif (`details/summary`) **sauf** le bouton « Renoncer au contrat ici » qui reste toujours visible hors accordéon.

**Composants (esprit shadcn/ui, `knowledge/direction-design.md`)**
- Bouton principal : fond `[COULEUR PRINCIPALE]`, texte blanc, hauteur 48 px mobile, rayon de la piste, pleine largeur sur mobile dans la fiche produit. États : survol (accent foncé), focus (anneau 2 px accent + décalage 2 px), désactivé (opacité 50 %, curseur interdit, `aria-disabled`), chargement (icône `Loader2` qui tourne, sauf animation réduite).
- Bouton secondaire : fond transparent, bordure 1 px couleur « bordure de champ », texte principal.
- Carte produit : photo 4:5, bordure fine décorative, rayon de la piste, ombre très légère au survol (ordinateur seulement), toute la carte cliquable (un seul lien).
- Badge : fond « surface atténuée », texte principal, 13 px, majuscule initiale seulement.
- Accordéon : `details/summary` natif (accessible au clavier sans script), icône `ChevronDown` qui pivote.
- Icônes : Lucide uniquement, 20 px, trait 1,5 px, couleur texte secondaire (ou laiton foncé dans la piste C). Jeu d'icônes de réassurance : `Truck` (livraison), `RotateCcw` (retours), `LockKeyhole` (paiement), `ShieldCheck` (sécurité produit), `Clock` (temps d'assemblage), `Gauge` (difficulté), `Ruler` (dimensions), `Package` (contenu), `Mail` (contact). « 14 ans et plus » : badge texte « 14+ », pas d'icône enfant.
- Animations : 150 à 200 ms, opacité et translation de 8 px maximum. Toutes désactivées si `prefers-reduced-motion: reduce` (et vidéos non lues automatiquement dans ce cas).
- Mode sombre : **pas au lancement** (simplicité, photos calibrées sur fond clair). Variables de couleur prévues pour l'ajouter plus tard.

**Interdits sur toutes les pages** (rappel `CLAUDE.md` et `direction-design.md`) : emoji, compte à rebours, « plus que X en stock », « X personnes regardent ce produit », faux avis ou note, prix barré sans prix antérieur réel, pop-up d'entrée ou de sortie, notification de « vente récente », dégradés criards, bannière clignotante.

### 4.1 Accueil `/`

Objectif : comprendre l'offre et faire confiance en 5 secondes. Action principale : « Voir les maquettes ».

| # | Section | Contenu | Mobile |
|---|---|---|---|
| 1 | Accroche (hero) | Titre H1 : « Des maquettes en bois à assembler, pour adultes. » Sous-titre : « Des mécanismes qui tournent vraiment, à monter en quelques soirées. Livrées en [X] à [Y] jours. » Bouton principal « Voir les maquettes ». Lien texte secondaire : « Comment ça marche » (ancre section 4). Visuel : photo d'un modèle monté sur un bureau (ou image d'affiche de la vidéo du mécanisme). | Texte d'abord, puis visuel en 4:3 pleine largeur. Le bouton est visible sans défiler sur un écran de 360 × 640 |
| 2 | Réassurance | 4 éléments icône + texte court : `Truck` « Livraison en [X] à [Y] jours en France métropolitaine » ; `RotateCcw` « 14 jours pour changer d'avis » ; `LockKeyhole` « Paiement sécurisé par Stripe » ; badge « 14+ » « Conçues pour les adultes et les ados de 14 ans et plus » | Grille 2 × 2 |
| 3 | Les maquettes | Titre H2 « Nos maquettes ». Cartes produits (section 4.2), seulement `statut: en-vente` ou `rupture`. Si plus de 6 produits : 6 cartes + lien « Voir toutes les maquettes » | 1 colonne (2 colonnes à partir de 640 px, 3 à partir de 1024 px) |
| 4 | Comment ça marche | H2 « Comment ça marche ». 3 étapes numérotées : 1. « Choisissez un modèle selon le temps dont vous disposez » ; 2. « Recevez-le chez vous en [X] à [Y] jours » ; 3. « Assemblez-le sans colle ni outil spécial » (**seulement si vrai pour tous les produits** ; sinon « Assemblez-le en suivant la notice illustrée ») | Étapes empilées |
| 5 | Le mécanisme en vidéo | Vidéo muette en boucle (5 à 10 s) d'un mécanisme en mouvement, tournée par nous. Lecture automatique seulement si l'utilisateur n'a pas demandé moins d'animations ; sinon image d'affiche + bouton lecture. Légende texte décrivant la vidéo (accessibilité) | Pleine largeur, ratio 4:5 |
| 6 | Qui est derrière | H2 « Une petite boutique indépendante ». Texte : « [NOM DE LA BOUTIQUE] est tenue par [Prénom], depuis Toulouse. [Phrase vraie sur la sélection : par exemple « J'assemble chaque modèle avant de le proposer », **seulement si c'est fait**]. » Photo : mains + atelier, pas de visage. Lien « En savoir plus » → `/a-propos/` | Texte puis photo |
| 7 | Questions fréquentes | 3 questions en accordéon (délai, difficulté, retours), réponses courtes tirées de la FAQ. Lien « Toutes les questions » → `/faq/` | Accordéons pleine largeur |
| 8 | Rappel final | Phrase courte + bouton principal « Voir les maquettes » (même cible que le hero) | Bouton pleine largeur |

Pas de section avis tant qu'aucun avis réel n'existe (section 5.5).

SEO : titre « Maquettes en bois à assembler pour adultes | [NOM DE LA BOUTIQUE] » (≤ 60 caractères), description ≤ 155 caractères reprenant « maquette en bois », « maquette mécanique », délai de livraison. Données structurées `Organization` + `WebSite`.

### 4.2 Catalogue `/maquettes/`

Objectif : choisir. Action principale : ouvrir une fiche.

1. Fil d'Ariane : Accueil › Maquettes.
2. H1 « Maquettes en bois à monter » + 1 phrase : « Maquettes mécaniques et miniatures déco, pour adultes et ados de 14 ans et plus. Chaque fiche indique le temps d'assemblage et la difficulté. »
3. Grille de cartes. Une carte contient, dans cet ordre : photo principale (4:5, texte alternatif du produit), nom (H2), ligne de badges « Facile / Intermédiaire / Expert » + `Clock` « [temps] », prix final « 29,90 € », lien implicite (toute la carte) libellé pour les lecteurs d'écran « Voir la maquette [nom] ». Produit en `rupture` : badge « Bientôt de retour », prix conservé, carte toujours cliquable.
4. Filtres : **aucun** au lancement. À partir de 7 produits : filtres simples par catégorie (mécanique, déco, véhicule) et difficulté, en liens (pas de JavaScript obligatoire).
5. Tri par défaut : ordre manuel (`ordre` dans les données), puis nom.
6. Bloc réassurance compact (les 4 éléments de l'accueil, en une ligne sur ordinateur).

Mobile : 1 colonne, cartes pleine largeur. Données structurées `ItemList`.

### 4.3 Fiche produit `/maquettes/[slug]/`

Spécification complète en section 5 (ordre des blocs, données, règles d'affichage). Action principale : « Acheter ».

**Configuration de chaque Payment Link Stripe (faite par l'humain dans le tableau de bord, liste de contrôle pour `gestion-commandes` et `developpeur-web`)**

| Réglage Stripe | Valeur | Pourquoi |
|---|---|---|
| Produit | Même nom, même photo principale, même prix que la fiche | Cohérence de l'information avant commande |
| Langue | `locale=fr` ajouté à l'URL | Page de paiement en français |
| Quantité ajustable | Oui, 1 à `quantite_max` (proposition : 3) | Achat de plusieurs exemplaires sans panier |
| Adresse | Facturation et livraison ; pays autorisés : France (`FR`) uniquement | Zone de livraison de `politiques.md`. **À VÉRIFIER** : la Corse est incluse dans `FR` ; les DROM ont des codes pays distincts et sont donc exclus de fait |
| Mode de livraison | Un tarif « Livraison suivie en France métropolitaine », montant `[FRAIS DE LIVRAISON]` ou 0 € si offerte, délai estimé [X] à [Y] jours | Frais et délai visibles avant de payer |
| Téléphone | Désactivé, sauf si le transporteur choisi l'exige (`À VÉRIFIER`) | Minimisation des données |
| Nom du client | Collecté (obligatoire) | Livraison et identification de la commande |
| Acceptation des CGV | Obligatoire (`consent_collection.terms_of_service = required`), URL des CGV et de la politique de confidentialité renseignées dans les informations publiques du compte | Acceptation explicite, case non pré-cochée |
| Texte près du bouton de paiement (texte personnalisé) | « En cliquant sur Payer, vous passez une commande avec obligation de paiement. Vous pourrez vous rétracter pendant 14 jours après réception, depuis notre site (lien « Renoncer au contrat ici »). » | Information claire au moment de l'engagement |
| Libellé du bouton | Type « Payer » (`submit_type = pay`, `À VÉRIFIER` dans le tableau de bord) | Formule non ambiguë **[PRO : confirmer que « Payer » vaut « commande avec obligation de paiement »]** |
| Codes promo | Désactivés au lancement | Pas de promotion sans règle des 30 jours appliquée |
| Consentement emails promotionnels | Désactivé au lancement (pas de newsletter) | Pas de collecte inutile |
| Enregistrer le moyen de paiement | Désactivé | Minimisation |
| Après le paiement | Redirection vers `https://[DOMAINE]/merci/` | Page de remerciement à nos couleurs |
| Reçus automatiques | Activés, en français (paramètres emails du compte) | Accusé de paiement immédiat |
| Image de marque | Logo, couleur d'accent et police de la piste choisie | Continuité visuelle, confiance |
| Coordonnées et politiques | Email de support, liens CGV, retours, confidentialité (paramètres Checkout) | Infos visibles sur la page de paiement |
| Lien désactivé (rupture) | Message : « Ce modèle est momentanément indisponible. Retrouvez nos autres maquettes sur [DOMAINE]. » | Pas de paiement possible sur un produit sans stock |

### 4.4 Merci `/merci/` (noindex)

Objectif : rassurer et annoncer la suite. Action principale : « Voir nos vidéos d'assemblage ».

1. Icône `CircleCheck` (couleur succès) + H1 « Merci, votre commande est enregistrée. »
2. Texte : « Vous allez recevoir dans quelques minutes le reçu de paiement de Stripe à l'adresse indiquée. Pensez à vérifier vos courriers indésirables. »
3. « Et ensuite ? » en 3 étapes datées relativement :
   - « Sous [24 h ouvrées, À VÉRIFIER] : email de confirmation avec le récapitulatif et nos conditions de vente. »
   - « Sous [délai d'expédition, À VÉRIFIER] : votre colis part, avec un numéro de suivi. »
   - « Au plus tard [Y] jours après votre commande : vous recevez votre maquette. »
4. Encadré : « Un souci, une question ? Écrivez-nous à [EMAIL], nous répondons sous [N, À VÉRIFIER] jours ouvrés. Vous pouvez aussi renoncer à votre commande pendant 14 jours après réception : lien « Renoncer au contrat ici » en bas de chaque page. »
5. Bouton principal « Voir nos vidéos d'assemblage » (lien vers le compte du réseau choisi). Lien secondaire « Retour à l'accueil ».

La page est statique : elle n'affiche aucun détail de commande et ne confirme rien de plus que le paiement. Les paramètres UTM transmis par Stripe ne sont pas exploités ni stockés.

### 4.5 À propos `/a-propos/`

Objectif : qui est derrière la boutique. Action principale : « Voir les maquettes ».

1. H1 « Qui est derrière [NOM DE LA BOUTIQUE] ? »
2. Texte vrai, à rédiger avec l'humain (marqueurs) : qui (prénom, ville : Toulouse), pourquoi les maquettes en bois, comment les modèles sont choisis (critères réels : délai ≤ 14 jours, fabricant identifié, pièces vérifiées sur échantillon **si c'est fait**), d'où partent les colis (« depuis Toulouse » seulement en option B de `contraintes.md`, sinon « depuis l'entrepôt de notre fournisseur en [pays UE] »).
3. Photos : atelier, mains, maquettes montées. Pas de visage (`contraintes.md`).
4. « Nos engagements » : 4 lignes factuelles (délai annoncé respecté ou remboursement, retours 14 jours, pièce manquante remplacée, aucune fausse promotion). Pas de mots « officiel », « authentique », « certifié », « artisanal » sans preuve.
5. Identité légale en une ligne : « [Prénom Nom] EI, SIREN [À VÉRIFIER] · Voir les mentions légales ».
6. Bouton principal « Voir les maquettes ».

### 4.6 Livraison et retours `/livraison-et-retours/`

Objectif : lever les doutes. Action principale : « Voir les maquettes ». Toutes les valeurs viennent de `knowledge/politiques.md` une fois validé.

1. H1 « Livraison et retours ».
2. Sommaire d'ancres (4 liens).
3. **Livraison** : zone (France métropolitaine), délai « [X] à [Y] jours entre votre commande et la réception » (par produit si différent : tableau produit / délai généré depuis les données), transporteur et suivi `[À VÉRIFIER]`, frais `[FRAIS DE LIVRAISON]`, ce qui se passe en cas de retard (annulation possible, remboursement sous 14 jours, jamais d'avoir imposé).
4. **Changer d'avis (rétractation)** : 14 jours à compter de la réception, sans justification ; les 3 façons de faire (bouton « Renoncer au contrat ici », email, formulaire type) ; adresse de retour `[À VÉRIFIER]` ; frais de retour `[À VÉRIFIER : à notre charge ou à la vôtre]` ; remboursement sous 14 jours, frais de livraison standard inclus, différable jusqu'à réception du colis ou preuve d'envoi ; dépréciation si le kit a été assemblé au-delà de ce qui est nécessaire pour l'examiner **[PRO : formulation]**. Bouton secondaire « Renoncer au contrat ici ».
5. **Pièce manquante ou cassée** : signalement par email avec photo, délai de réponse `[À VÉRIFIER]`, envoi de la pièce ou remplacement. Lien vers `/contact/#piece-manquante`.
6. **Garanties légales** : garantie légale de conformité (2 ans) et garantie des vices cachés, en langage simple, avec renvoi à l'article des CGV.
7. Bouton principal « Voir les maquettes ».

Mobile : sections empilées, ancres collées en haut sous forme de liste horizontale défilante.

### 4.7 FAQ `/faq/`

Objectif : répondre. Action principale : « Nous écrire ».

- H1 « Questions fréquentes ». Questions groupées par thème (H2) en accordéons natifs : Avant l'achat (à qui s'adressent ces maquettes, difficulté, outils, colle, temps, dimensions, cadeau : emballage et prix sur le colis `[À VÉRIFIER]`), Commande et paiement (moyens de paiement acceptés `[À VÉRIFIER selon activation Stripe]`, sécurité, facture : « reçu Stripe + facture sur demande » `[À VÉRIFIER]`), Livraison, Retours et rétractation, Assemblage (notice, pièce manquante, pièce cassée pendant le montage `[politique À VÉRIFIER]`).
- Toutes les réponses viennent de `politiques.md` et des données produit ; `redacteur-catalogue` rédige, `conformite-qa` valide.
- Données structurées `FAQPage`.
- En bas : « Vous n'avez pas trouvé ? » + bouton principal « Nous écrire ».

### 4.8 Contact `/contact/`

Objectif : joindre la boutique. Action principale : « Écrire un email ».

1. H1 « Nous contacter ». Délai de réponse : « Nous répondons sous [N, À VÉRIFIER] jours ouvrés. »
2. Bouton principal « Écrire un email » (`mailto:[EMAIL]`).
3. Trois raccourcis (liens `mailto:` avec objet prérempli) : « Question avant achat », « Suivi de ma commande » (« pensez à indiquer votre numéro de reçu »), et, avec l'ancre `#piece-manquante`, « Pièce manquante ou cassée » (« joignez une photo de la pièce et de la boîte »).
4. Téléphone `[À VÉRIFIER]` et adresse postale (renvoi aux mentions légales si l'humain ne souhaite pas la répéter).
5. Lien « Renoncer au contrat ici » rappelé : « Pour vous rétracter, utilisez plutôt ce formulaire : vous recevrez un accusé de réception immédiat. »

Pas de formulaire de contact au lancement : un `mailto:` ne demande ni serveur, ni stockage, ni anti-spam. Formulaire possible plus tard avec la même fonction que la rétractation.

### 4.9 Renoncer au contrat et confirmation

Spécification complète en section 6.2.

### 4.10 Pages légales (mentions légales, CGV, confidentialité, cookies)

Structure en section 6. Mise en page commune : H1, date de mise à jour visible en haut (« Version du [JJ/MM/AAAA] »), sommaire d'ancres cliquables, titres numérotés, texte 16 px, pas de bloc replié (le texte légal doit être lisible sans action), lien « Haut de page ». Pas d'appel à l'action commercial.

### 4.11 Page 404

H1 « Cette page n'existe pas (ou plus). » Texte : « Le lien est peut-être ancien. » Bouton principal « Voir les maquettes », liens « Accueil » et « Nous contacter ».

## 5. Fiche produit type et format des données produit

### 5.1 Ordre des blocs (mobile, de haut en bas)

| # | Bloc | Contenu et règles | Champ(s) de données |
|---|---|---|---|
| 1 | Fil d'Ariane | Accueil › Maquettes › [nom] (masqué sous 360 px, conservé en données structurées) | `nom` |
| 2 | Galerie photos | Photo principale 4:5 pleine largeur, puis défilement horizontal par balayage (points indicateurs + boutons précédent / suivant accessibles au clavier). Ordre : principale, mécanisme ou détail, échelle (objet monté à côté d'un objet courant : tasse, livre), contenu de la boîte, étiquette ou boîte montrant fabricant et âge. 5 à 8 photos. Texte alternatif descriptif obligatoire pour chaque photo. Sur ordinateur : galerie à gauche (60 %), colonne d'achat collante à droite (40 %) contenant les blocs 3 à 6 | `photos[]` |
| 3 | Titre et badges | H1 = nom du produit (« Maquette en bois mécanique [nom] à assembler »). Badges sous le titre : « 14+ » (texte accessible « Pour adultes et ados de 14 ans et plus »), difficulté, temps d'assemblage | `nom`, `age_minimum`, `difficulte`, `temps_assemblage_*` |
| 4 | Prix | Prix final en grand : « 29,90 € ». Juste dessous, en petit : « Prix final. TVA non applicable, art. 293 B du CGI » **[PRO : formule]**. Si promotion valide (section 5.4) : prix promo, prix antérieur barré avec la mention « Prix le plus bas des 30 derniers jours : [prix] », pourcentage calculé sur ce prix, date de fin si elle existe | `prix_ttc`, `promotion` |
| 5 | Livraison (au-dessus du bouton) | `Truck` « Livraison suivie : [FRAIS] € (ou « offerte ») · reçue en [X] à [Y] jours après votre commande » ; ligne « Expédiée depuis [lieu] » seulement si `expedie_depuis` est renseigné | `frais_livraison_ttc`, `delai_livraison_min_jours`, `delai_livraison_max_jours`, `expedie_depuis` |
| 6 | Bouton d'achat | Bouton principal pleine largeur « Acheter ». Dessous, `LockKeyhole` + « Paiement sur la page sécurisée de Stripe, notre prestataire. Nous ne voyons jamais vos données bancaires. » Puis liens discrets « CGV » et « Livraison et retours ». En `rupture` : bouton remplacé par un bouton désactivé « Bientôt de retour » + lien « Voir les autres maquettes » ; pas de collecte d'email au lancement | `lien_paiement_stripe`, `statut` |
| 7 | Réassurance | 3 lignes icône + texte : `RotateCcw` « 14 jours pour changer d'avis après réception » ; `Package` « Pièce manquante ? On vous la renvoie » (seulement quand la politique est validée) ; `Mail` « Une question ? [EMAIL] » | (politiques) |
| 8 | Ce que vous allez fabriquer | 3 bénéfices concrets, titre + 1 phrase chacun, sans superlatif non prouvé ni allégation bien-être (« anti-stress », « méditatif » interdits : allégation santé) | `benefices[]` |
| 9 | Description | Texte de `redacteur-catalogue` (corps du fichier), 150 à 300 mots, intertitres H2 | corps Markdown |
| 10 | Vidéo du mécanisme | Vidéo muette 5 à 15 s, poster, contrôles visibles, lecture au toucher (pas d'autolecture sur la fiche pour économiser les données mobiles) | `video` |
| 11 | Caractéristiques (tableau) | Difficulté (avec définition : « Facile : première maquette » / « Intermédiaire : un peu de patience » / « Expert : déjà assemblé plusieurs maquettes »), temps d'assemblage (« [min] à [max] h »), nombre de pièces, dimensions une fois monté (L × l × h en cm), poids, matériaux, mécanisme (« manivelle », « ressort », « aucun »), colle nécessaire (oui / non), outils nécessaires, outils fournis | `difficulte`, `temps_assemblage_*`, `nombre_pieces`, `dimensions_cm`, `poids_g`, `materiaux`, `mecanisme`, `colle_necessaire`, `outils_necessaires`, `outils_fournis` |
| 12 | Contenu de la boîte | Liste à puces | `contenu_boite[]` |
| 13 | **Sécurité du produit** (GPSR) | Bloc **toujours ouvert** (pas d'accordéon), icône `ShieldCheck`, titre H2 « Sécurité du produit ». Contenu : « Âge : 14 ans et plus. Ne convient pas aux enfants de moins de 14 ans. » ; Fabricant : nom ou marque, adresse postale, email ; Personne responsable dans l'UE (si fabricant hors UE) : nom, adresse postale, email ; Importateur (si c'est nous) : `[Prénom Nom] EI, [adresse]` ; Référence du produit (modèle, et lot si disponible) ; Avertissements en français (liste exacte fournie par le fabricant, par exemple petites pièces, pièces en bois découpées au laser à manipuler avec précaution) ; lien « Voir la photo de l'étiquette » (photo du type `etiquette`) | `securite.*` |
| 14 | Marque (seulement si produit de marque authentique) | « Marque : [marque]. [NOM DE LA BOUTIQUE] est un revendeur indépendant, sans lien de partenariat avec la marque. » **[PRO : formulation]**. Jamais pour un produit générique | `marque` |
| 15 | Livraison et retours | Résumé en 4 lignes (zone, délai, frais, rétractation 14 jours + frais de retour) + lien vers `/livraison-et-retours/` | (politiques + produit) |
| 16 | FAQ du produit | 3 à 6 questions en accordéons | `faq[]` |
| 17 | Avis | **Absent** tant qu'il n'y a pas d'avis réels collectés par nous. Le jour où ils existent : afficher comment ils sont collectés et contrôlés (art. L111-7-2 du code de la consommation), jamais les notes AliExpress ou fournisseur | — |
| 18 | Autres maquettes | 2 à 3 cartes (même catégorie, sinon les plus récentes). Pas d'autre appel à l'action fort | `categorie`, `ordre` |

**Barre d'achat collante (mobile uniquement)** : apparaît quand le bouton du bloc 6 sort de l'écran (observateur d'intersection, quelques lignes de JavaScript), disparaît quand il revient ou quand le pied de page est visible. Contenu : nom court tronqué, prix, bouton « Acheter » (même lien). Hauteur 64 px, fond blanc, bordure haute fine, `padding-bottom` qui respecte la zone de sécurité de l'écran (encoche). Sans JavaScript : pas de barre, le bouton principal reste disponible.

**Lien « Acheter »** : `href` = `lien_paiement_stripe` + `?locale=fr&utm_content=[slug]`. Un script de quelques lignes ajoute, si et seulement si ils sont présents dans l'URL de la page, `utm_source`, `utm_medium` et `utm_campaign` (valeurs filtrées : lettres, chiffres, tirets, soulignés, 150 caractères maximum, comme l'exige Stripe). Aucun stockage sur l'appareil.

**SEO de la fiche** : titre ≤ 60 caractères (`seo.titre`), description ≤ 155 caractères (`seo.description`), URL canonique, image de partage = photo principale 1200 × 630. Données structurées `Product` avec `offers` (prix, `priceCurrency: EUR`, disponibilité, `shippingDetails`, `hasMerchantReturnPolicy` 14 jours), `brand` seulement si produit de marque, **jamais `aggregateRating` ni `review`** sans vrais avis.

### 5.2 Format des données produit

Un fichier Markdown par produit dans `site/src/content/produits/[slug].md`. Ce format **étend** celui de `docs/site-technique.md` (les champs existants gardent leur nom ; `dimensions` texte devient `dimensions_cm` structuré, `temps_assemblage` texte devient deux nombres). Proposition de mise à jour de `docs/site-technique.md` à valider par l'humain.

```yaml
---
# Identité
nom: "Maquette en bois mécanique [nom] à assembler"   # = titre H1, 70 caractères max
nom_court: "[nom]"                # barre collante et cartes, 30 caractères max
slug: "[slug]"                    # minuscules, tirets, sans accent ; = nom du fichier
categorie: mecanique              # mecanique | deco | vehicule
ordre: 10                         # tri manuel dans le catalogue
statut: brouillon                 # brouillon | en-vente | rupture

# Prix (euros, prix final payé par le client)
prix_ttc: 0.00
historique_prix:                  # une ligne à chaque changement de prix ; sert à la règle des 30 jours
  - { date: "AAAA-MM-JJ", prix_ttc: 0.00 }
promotion: null                   # ou l'objet décrit en 5.4
quantite_max: 3                   # même valeur que dans le Payment Link

# Livraison (jours calendaires, de la commande à la réception)
frais_livraison_ttc: 0.00         # 0 = « offerte »
delai_livraison_min_jours: 0
delai_livraison_max_jours: 14     # 14 maximum (contraintes.md)
expedie_depuis: ""                # ex. "Toulouse" ; vide = non affiché
transporteur: ""                  # ex. nom du service suivi ; vide = non affiché

# Produit
age_minimum: 14                   # 14 minimum, sinon refus à la construction
difficulte: ""                    # facile | intermediaire | expert
temps_assemblage_heures_min: 0
temps_assemblage_heures_max: 0
nombre_pieces: 0
dimensions_cm: { longueur: 0, largeur: 0, hauteur: 0 }   # une fois monté
poids_g: 0
materiaux: []                     # ex. ["contreplaqué de bouleau", "métal (axe)"]
mecanisme: ""                     # ex. "manivelle" ; "aucun" pour une miniature déco
colle_necessaire: false
outils_necessaires: []
outils_fournis: []
contenu_boite: []
benefices:                        # exactement 3
  - { titre: "", texte: "" }
marque: null                      # ou { nom: "", canal_officiel: true } ; null = produit générique

# Médias (fichiers dans site/src/assets/produits/[slug]/)
photos:                           # 5 à 8 ; une seule "principale" ; au moins une "etiquette"
  - { src: "", alt: "", type: principale }   # principale | detail | echelle | boite | etiquette | situation
video: null                       # ou { src: "", poster: "", description: "" }

# Paiement
lien_paiement_stripe: ""          # https://buy.stripe.com/... ; jamais de clé secrète

# Sécurité du produit (GPSR) : tout est obligatoire pour statut en-vente
securite:
  fabricant: { nom: "", adresse: "", email: "" }
  responsable_ue: null            # obligatoire si fabricant hors UE : { nom: "", adresse: "", email: "" }
  importateur: null               # si nous importons nous-mêmes hors UE : { nom: "", adresse: "", email: "" }
  reference: ""                   # modèle ; lot si disponible
  avertissements: []              # en français, textes exacts du fabricant
  preuve_age_14: ""               # chemin interne de la photo boîte/notice « 14+ » (non publiée)

# Contenus
faq:
  - { question: "", reponse: "" }
seo: { titre: "", description: "" }

# Contrôle
audit_conformite: ""              # date de l'audit conformite-qa qui valide cette fiche
---
Description du produit (redacteur-catalogue), 150 à 300 mots, intertitres H2.
```

### 5.3 Règles de validation à appliquer à la construction du site

`developpeur-web` les traduit en schéma de collection Astro. Un fichier qui viole une règle **fait échouer la construction** (sauf en `brouillon`, qui n'est jamais publié).

| # | Règle | Si non respectée |
|---|---|---|
| V1 | `age_minimum` ≥ 14 | Échec |
| V2 | `statut: en-vente` exige : `securite.fabricant` complet, `securite.reference`, au moins 1 avertissement, au moins une photo `etiquette`, `preuve_age_14` renseigné, `lien_paiement_stripe` commençant par `https://buy.stripe.com/` (ou le domaine personnalisé déclaré), `audit_conformite` renseigné | Échec |
| V3 | Si l'adresse du fabricant n'est pas dans l'UE : `responsable_ue` complet | Échec (`developpeur-web` peut demander un champ `fabricant.pays` en code ISO pour automatiser ce test : à ajouter) |
| V4 | `delai_livraison_max_jours` ≤ 14 et ≥ `delai_livraison_min_jours` | Échec |
| V5 | `prix_ttc` > 0 ; dernière entrée de `historique_prix` = `prix_ttc` (ou `promotion.prix_promo_ttc` si promotion active) | Échec |
| V6 | Promotion : voir 5.4 | Échec |
| V7 | `photos` : 5 à 8, exactement une `principale`, chaque `alt` non vide (≥ 10 caractères) | Échec |
| V8 | `benefices` : exactement 3 ; `seo.titre` ≤ 60 ; `seo.description` ≤ 155 | Échec |
| V9 | Aucun emoji dans aucun champ texte | Échec |
| V10 | Liste de mots interdits dans les textes : « anti-stress », « thérapeutique », « méditation », « officiel », « authentique », « certifié », « garanti à vie », « derniers exemplaires », « stock limité » (liste à compléter par conformite-qa) | Échec ; dérogation possible pour « authentique » / « officiel » seulement si `marque.canal_officiel: true` **et** validation conformite-qa |

### 5.4 Promotions (règle des 30 jours)

Pas de promotion au lancement. Quand il y en aura une :

```yaml
promotion:
  prix_promo_ttc: 0.00
  prix_anterieur_ttc: 0.00   # = plus bas prix de historique_prix sur les 30 jours avant debut
  debut: "AAAA-MM-JJ"
  fin: "AAAA-MM-JJ"          # facultatif ; si présent, affiché tel quel
```

- La construction recalcule `prix_anterieur_ttc` à partir de `historique_prix` et échoue en cas d'écart (V6). Le pourcentage affiché est calculé sur ce prix et arrondi à l'entier inférieur.
- Produit vendu depuis moins de 30 jours : pas de prix barré au lancement **[PRO]** (point ouvert de l'audit conformite-qa).
- Hors période `debut`–`fin`, la promotion n'est pas affichée (construction quotidienne ou manuelle à la fin de la promo : à prévoir par `developpeur-web`). Le Payment Link doit pointer vers un prix Stripe identique au prix affiché : changer le prix = nouveau lien ou mise à jour du lien, contrôlée par l'humain.
- Aucun compte à rebours.

### 5.5 Avis clients (plus tard)

Pas de bloc ni de note au lancement. Spécification future (à valider par conformite-qa) : avis demandés par email après réception, publication de tous les avis (positifs et négatifs), date de l'avis et de l'achat, mention « Avis collectés par nos soins auprès de clients ayant acheté le produit ; nous vérifions que chaque avis correspond à une commande », aucun avis offert contre réduction sans le signaler.

## 6. Pages légales, rétractation, cookies

Les textes définitifs sont rédigés à partir de `knowledge/politiques.md` **validé** ; tout ce qui manque reste `[À VALIDER]`. `conformite-qa` audite chaque page avant publication.

### 6.1 Liste des pages obligatoires et où elles sont accessibles

| Obligation (dossier conformite-qa) | Page | Accès |
|---|---|---|
| O9 Mentions légales | `/mentions-legales/` | Pied de page de toutes les pages |
| O10 CGV et infos avant commande | `/cgv/` + PDF daté ; résumé sur chaque fiche | Pied de page, sous le bouton « Acheter », case Stripe |
| O11 Parcours de commande | Fiche + Payment Link (section 4.3) | — |
| O12 Livraison | Fiche (bloc 5), `/livraison-et-retours/`, CGV | — |
| O13 Rétractation + bouton en ligne | `/renoncer-au-contrat/`, formulaire type (CGV, page de rétractation, email de confirmation) | Pied de page de toutes les pages, page Merci, livraison et retours, contact, FAQ, email de confirmation |
| O14 Médiateur | CGV + mentions légales + livraison et retours | — |
| O15 Pas de lien RLL | Aucune page | Contrôle conformite-qa |
| O16 Données et cookies | `/confidentialite/`, `/cookies/`, bandeau (si actif) | Pied de page ; lien de Stripe vers la politique |
| O17 GPSR | Bloc « Sécurité du produit » de chaque fiche | — |
| O18 14 ans et plus | Badge + bloc sécurité de chaque fiche ; aucun visuel enfant | — |
| O21 IDU REP jouets et emballages | CGV (article dédié) + mentions légales | — |
| O22 Triman / info-tri | Sur le produit ou l'emballage (hors site) ; rappel dans la FAQ « Comment trier l'emballage ? » si l'info existe | — |

### 6.2 Bouton « Renoncer au contrat ici » (rétractation en ligne)

Base : article D221-5 du code de la consommation, en vigueur depuis le 19 juin 2026 : fonctionnalité intitulée « renoncer au contrat ici » (ou formule analogue sans ambiguïté), visible, directement et facilement accessible pendant tout le délai ; déclaration permettant de donner ou confirmer nom et prénom, de quoi identifier le contrat, et le moyen électronique pour recevoir l'accusé ; envoi par une fonctionnalité « confirmer la rétractation » ; accusé de réception sur support durable, dans un délai raisonnable, mentionnant le contenu de la déclaration, la date et l'heure de son envoi.

**Emplacements du lien « Renoncer au contrat ici »** (libellé exact, identique partout) : pied de page de toutes les pages (hors accordéon, toujours visible), page Merci, page Livraison et retours, page Contact, FAQ (question « Comment me rétracter ? »), CGV (article rétractation), email de confirmation du contrat, carte glissée dans le colis (adresse écrite en clair).

**Page `/renoncer-au-contrat/`**

1. H1 « Renoncer au contrat ». Texte : « Vous avez 14 jours à compter de la réception de votre commande pour changer d'avis, sans avoir à vous justifier. Remplissez ce formulaire : vous recevrez immédiatement un accusé de réception par email. »
2. Formulaire (HTML natif, fonctionne sans JavaScript, `method="post" action="/api/retractation"`) :

| Champ | Type | Obligatoire | Aide affichée |
|---|---|---|---|
| Prénom | texte, `autocomplete="given-name"` | Oui | — |
| Nom | texte, `autocomplete="family-name"` | Oui | — |
| Adresse email pour recevoir l'accusé de réception | email | Oui | « Idéalement celle utilisée pour la commande » |
| Numéro de commande ou de reçu | texte | Non (mais un des deux champs d'identification requis) | « Il figure sur le reçu de paiement Stripe reçu par email » |
| Date de la commande | date | Non (mais un des deux champs d'identification requis) | — |
| Produit(s) concerné(s) | texte | Non | « Laissez vide si vous renoncez à toute la commande » |
| Date de réception | date | Non | — |
| Commentaire | zone de texte, 1 000 caractères max | Non | « Facultatif : vous n'avez pas à vous justifier » |
| Champ piège anti-robots | texte caché aux humains (`aria-hidden`, hors écran, `tabindex="-1"`) | — | — |

   Règle d'identification : au moins le numéro de commande **ou** la date de commande. Pas de captcha (ne jamais compliquer l'exercice du droit) ; anti-spam = champ piège + limitation à 5 envois par adresse IP et par heure côté fonction (l'IP n'est pas conservée au-delà de ce contrôle).
3. Bouton principal (seul bouton du formulaire) : **« Confirmer la rétractation »**. Sous le bouton : « En cliquant, vous envoyez votre déclaration de rétractation. »
4. Sous le formulaire, section « Vous préférez une autre méthode ? » : par email à `[EMAIL]`, ou par courrier avec le formulaire type (texte de l'annexe à l'article R221-1 reproduit intégralement, avec un lien « Télécharger le formulaire (PDF) »).
5. Section « Et ensuite ? » : renvoyer le produit sous 14 jours à `[ADRESSE DE RETOUR]`, frais de retour `[À VÉRIFIER]`, remboursement sous 14 jours par le même moyen de paiement.

Messages d'erreur : sous le champ concerné, en texte (pas seulement en rouge), icône `CircleAlert`, focus déplacé sur le premier champ en erreur ; résumé des erreurs en haut du formulaire (`role="alert"`). Les saisies sont conservées.

**Fonction `POST /api/retractation` (Cloudflare Pages Functions)**

1. Vérifie le champ piège (rempli = réponse de succès factice, rien n'est envoyé) et la limite d'envois.
2. Valide les champs (longueurs, email, au moins un identifiant de commande). En erreur : renvoie la page du formulaire avec les messages et les valeurs saisies.
3. Horodate côté serveur : date et heure en heure de Paris (`Europe/Paris`) + UTC.
4. Crée une référence unique : `RT-AAAAMMJJ-HHMM-XXXX` (4 caractères aléatoires).
5. Enregistre la déclaration (référence, horodatage, champs saisis) dans un stockage Cloudflare gratuit (D1 ou KV, au choix de `developpeur-web`), pour preuve. Durée de conservation : `[À VÉRIFIER avec conformite-qa]`, à indiquer dans la politique de confidentialité.
6. Envoie **l'accusé de réception** au client par un service d'envoi d'emails transactionnels (clé dans une variable d'environnement Cloudflare, jamais dans le dépôt) :
   - Objet : « Accusé de réception de votre rétractation [RÉFÉRENCE] »
   - Contenu : « Nous avons bien reçu votre déclaration de rétractation le [JJ/MM/AAAA] à [HH:MM] (heure de Paris). » + **reprise intégrale de la déclaration** (tous les champs saisis) + étapes suivantes (adresse et délai de retour, frais de retour, délai de remboursement) + coordonnées de la boutique + mention « Conservez cet email : il fait foi de votre demande. »
   - Expéditeur : `[NOM DE LA BOUTIQUE] <[EMAIL D'ENVOI]>`, réponse vers `[EMAIL]`.
7. Envoie une copie à la boutique (`[EMAIL]`) pour traitement par `service-client` / `gestion-commandes`.
8. Redirige (303) vers `/renoncer-au-contrat/confirmation/?ref=[RÉFÉRENCE]`.
9. Si l'envoi d'email échoue : la déclaration est quand même enregistrée, la page de confirmation l'indique (« Votre demande est enregistrée sous la référence [RÉFÉRENCE] le [date heure]. L'email d'accusé n'a pas pu partir : nous vous l'envoyons manuellement, ou écrivez-nous à [EMAIL]. ») et la boutique reçoit une alerte. **[PRO : est-ce suffisant comme « délai raisonnable » ?]**

Variables d'environnement à déclarer dans `docs/site-technique.md` : `EMAIL_API_KEY`, `EMAIL_FROM`, `EMAIL_BOUTIQUE`, liaison de stockage `RETRACTATIONS`.

Service d'envoi d'emails : décision de l'humain (section 9). Contraintes : offre gratuite suffisante pour quelques dizaines d'emails par mois, hébergement des données dans l'UE de préférence, domaine d'envoi vérifié (SPF, DKIM). Tarifs et limites `À VÉRIFIER` au moment du choix.

**Page `/renoncer-au-contrat/confirmation/`** (noindex)

- Icône `CircleCheck` + H1 « Votre rétractation est enregistrée. »
- « Référence : [ref] » (lue dans l'URL, affichée comme texte, jamais interprétée comme HTML ; si absente : texte générique).
- « Un accusé de réception reprenant votre déclaration, la date et l'heure de son envoi vient de vous être envoyé par email. Pensez à vérifier vos courriers indésirables. »
- Étapes suivantes (retour, remboursement), contact.
- Bouton principal « Retour à l'accueil ».

**Test de recette (pour `developpeur-web` et `conformite-qa`)** : envoi complet depuis un téléphone, réception de l'accusé avec la déclaration intégrale et l'heure, enregistrement présent dans le stockage, fonctionnement sans JavaScript, navigation au clavier, lecteur d'écran.

### 6.3 Mentions légales `/mentions-legales/`

1. Éditeur du site : `[Prénom Nom] EI` (et nom commercial `[NOM DE LA BOUTIQUE]`), adresse `[À VÉRIFIER]`, SIREN `[À VÉRIFIER]`, email, téléphone `[À VÉRIFIER]`.
2. Directeur de la publication : `[Prénom Nom]`.
3. Hébergeur : Cloudflare (raison sociale, adresse, téléphone `[À VÉRIFIER sur le site de Cloudflare au moment de la publication]`).
4. TVA : « TVA non applicable, art. 293 B du CGI » **[PRO]**.
5. Recyclage : IDU REP jouets `[À VÉRIFIER]`, IDU REP emballages `[À VÉRIFIER]`.
6. Médiateur de la consommation : nom, adresse, site `[À VÉRIFIER]`.
7. Propriété intellectuelle : textes, photos et vidéos de la boutique ; photos de tiers seulement avec autorisation écrite (audit conformite-qa, point 9).
8. Crédits : polices (licence SIL Open Font License), icônes Lucide (licence ISC).
9. Liens : Données personnelles → `/confidentialite/`, Cookies → `/cookies/`.

### 6.4 CGV `/cgv/` (et PDF daté)

Version datée en haut, PDF identique téléchargeable (`/cgv-[AAAA-MM-JJ].pdf`), anciennes versions conservées en interne (preuve de la version acceptée à la date de chaque commande).

1. Objet et champ d'application (vente à des consommateurs, France métropolitaine).
2. Identité du vendeur (renvoi aux mentions légales + coordonnées complètes).
3. Produits : caractéristiques essentielles sur chaque fiche ; produits pour adultes et ados de 14 ans et plus ; informations de sécurité (GPSR).
4. Prix : en euros, prix final, TVA non applicable (art. 293 B du CGI), frais de livraison indiqués sur la fiche et avant paiement, aucun frais selon le moyen de paiement ; règle des prix barrés.
5. Commande : étapes (fiche → page de paiement Stripe → vérification du récapitulatif et de la quantité → acceptation des CGV → bouton « Payer », qui vaut commande avec obligation de paiement → reçu de paiement → email de confirmation avec les CGV) ; possibilité de corriger avant de payer.
6. Paiement : par Stripe ; moyens acceptés `[À VÉRIFIER]` ; débit à la commande ; sécurité.
7. Livraison : zone, délais par produit (renvoi à la fiche), suivi, retard et droit d'annulation, remboursement sous 14 jours, jamais d'avoir imposé ; réception et réserves (colis abîmé).
8. Transfert des risques : à la prise de possession par le client ou un tiers qu'il désigne **[PRO]**.
9. Droit de rétractation : délai de 14 jours à compter de la réception ; exercice par le bouton « Renoncer au contrat ici » (lien), par email, par le formulaire type ; accusé de réception ; retour du produit sous 14 jours, adresse, frais de retour `[À VÉRIFIER]` ; remboursement sous 14 jours (frais de livraison standard inclus), différable jusqu'à récupération ou preuve d'envoi ; responsabilité en cas de dépréciation (kit assemblé) **[PRO : formulation]**.
10. Garanties légales : garantie légale de conformité (2 ans) et garantie des vices cachés, avec **l'encadré d'information standardisé imposé par la réglementation, reproduit mot pour mot** **[PRO / conformite-qa : fournir le texte officiel exact]**.
11. Pièces manquantes ou cassées à la réception : procédure (email + photo), délai de réponse.
12. Service client : coordonnées, délai de réponse.
13. Données personnelles : renvoi à `/confidentialite/`.
14. Médiation de la consommation : nom, adresse, site du médiateur, conditions de saisine (réclamation écrite préalable). **Aucun lien vers l'ancienne plateforme RLL.**
15. Recyclage et filières REP : IDU jouets et IDU emballages.
16. Droit applicable et litiges.
17. Annexe : formulaire type de rétractation (texte officiel intégral).

### 6.5 Politique de confidentialité `/confidentialite/`

1. Responsable du traitement : `[Prénom Nom] EI`, coordonnées.
2. Données collectées, par traitement : commande (nom, email, adresse, téléphone seulement si nécessaire au transporteur : collectés par Stripe), rétractation (champs du formulaire), échanges par email, mesure d'audience (statistiques agrégées sans cookie : à décrire précisément après validation de l'outil).
3. Finalités et bases légales : exécution du contrat (commande, livraison, SAV, rétractation) ; obligations légales (comptabilité, preuve de la rétractation) ; intérêt légitime (statistiques agrégées, sécurité).
4. Destinataires et sous-traitants : Stripe (paiement), Cloudflare (hébergement, fonction de rétractation, stockage), service d'envoi d'emails `[À VÉRIFIER]`, transporteur `[À VÉRIFIER]`, fournisseur expéditeur en option A `[À VÉRIFIER]`, messagerie de la boutique `[À VÉRIFIER]`.
5. Transferts hors UE : Stripe et Cloudflare (États-Unis) : base juridique du transfert `[À VÉRIFIER : cadre de protection des données UE–États-Unis ou clauses contractuelles types]`.
6. Durées de conservation par catégorie : `[À VÉRIFIER avec conformite-qa]` (pièces comptables, données clients, déclarations de rétractation, emails).
7. Droits (accès, rectification, effacement, opposition, limitation, portabilité), comment les exercer (email), délai de réponse d'un mois, réclamation auprès de la CNIL.
8. Pas de prospection commerciale au lancement ; si une newsletter est créée : consentement explicite, case non pré-cochée, désinscription dans chaque email.
9. Renvoi à `/cookies/`.

### 6.6 Cookies `/cookies/` et bandeau

**Situation proposée au lancement : aucun cookie ni traceur non essentiel sur notre site.**
- Pas de pixel publicitaire (Meta, TikTok, Pinterest), pas de Google Analytics, pas de vidéo YouTube intégrée (vidéos hébergées sur le site), pas de Google Fonts distantes.
- Mesure d'audience : Cloudflare Web Analytics, présenté par Cloudflare comme n'utilisant ni cookie, ni stockage local, ni empreinte de l'appareil **[À VALIDER par conformite-qa : exemption de consentement selon les critères de la CNIL ; certains acteurs le classent par prudence parmi les outils soumis à consentement]**. Si conformite-qa ne valide pas l'exemption : on retire l'outil et on s'appuie sur les statistiques Stripe (section 8), plutôt que d'ajouter un bandeau.
- Stripe dépose ses propres cookies sur ses pages de paiement (prévention de la fraude) : ils relèvent de Stripe, sur le domaine de Stripe ; la page cookies l'indique avec un lien vers la politique de Stripe.
- Conséquence : **pas de bandeau affiché au lancement** **[À VALIDER par conformite-qa]**.

**Page `/cookies/`** : ce qu'est un cookie ; liste exhaustive des traceurs de notre site (tableau : nom, émetteur, finalité, durée, consentement requis oui / non) ; cookies de Stripe sur la page de paiement ; comment paramétrer son navigateur ; date de mise à jour. Si le bandeau est actif : bouton « Gérer mes choix ».

**Bandeau (composant prêt, activé seulement si un traceur non essentiel est ajouté plus tard)**
- Position : panneau en bas d'écran, n'empêche ni la lecture ni la navigation (pas de mur de cookies), ne masque pas le bouton « Acheter » sur mobile de façon durable.
- Texte : « Nous utilisons des cookies pour [finalité précise, par exemple mesurer l'efficacité de nos publicités]. Vous pouvez accepter, refuser ou choisir. Votre choix est conservé [6 mois] et modifiable à tout moment depuis « Gérer les cookies » en bas de page. »
- Boutons au même niveau, même taille, même style, même couleur : **« Tout refuser »** et **« Tout accepter »** (ordre : refuser à gauche ou au-dessus). Lien « Personnaliser » qui ouvre la liste des finalités avec des interrupteurs **désactivés par défaut**.
- Fermer le bandeau sans choisir = refus. Aucun traceur non essentiel chargé avant un « accepter ».
- Choix enregistré localement (stockage essentiel), redemandé après [6 mois, À VÉRIFIER] ou si les finalités changent.
- Accessible : focus clavier sur le premier bouton à l'ouverture, pas de piège, contrastes de la piste.

### 6.7 Mentions sur la page de paiement et dans les emails

- Page de paiement Stripe : nom de la boutique, produit, quantité, prix, frais de livraison, total, case d'acceptation des CGV (lien), lien politique de confidentialité, texte sous le bouton (section 4.3), bouton « Payer ».
- Email de confirmation du contrat (modèle à rédiger par `crm-email`, envoyé par l'humain) : identité du vendeur, récapitulatif (produit, quantité, prix, frais, total), délai de livraison, adresse de livraison, CGV en PDF de la version en vigueur, formulaire type de rétractation, lien « Renoncer au contrat ici », garanties, contact, médiateur.

## 7. Identité visuelle (3 pistes à choisir)

Méthode de vérification : ratio de contraste WCAG 2.x, luminance relative calculée à partir des valeurs sRGB. Seuils : 4,5:1 pour le texte normal, 3:1 pour le grand texte et les contours de composants (champs, icônes porteuses de sens). Tous les ratios ci-dessous ont été calculés pour ce livrable ; `developpeur-web` les revérifie avec un outil (par exemple l'audit d'accessibilité du navigateur) sur le rendu réel.

Points communs aux trois pistes :
- Fond clair légèrement chaud, texte presque noir, **une seule couleur d'accent** réservée aux actions et aux liens.
- Couleurs d'état communes : erreur `#B91C1C` (contraste ≥ 6,0:1 sur les trois fonds), succès `#15803D` (≥ 4,6:1 sur les trois fonds). Toujours accompagnées d'une icône et d'un texte.
- Surfaces blanches `#FFFFFF` pour les cartes : tous les contrastes y sont supérieurs à ceux du fond.
- Aucune couleur primaire vive ni palette « jouet » (évite toute lecture « produit pour enfant », audit conformite-qa point 4).
- Polices auto-hébergées via Fontsource, licence SIL Open Font License.
- Échelle typographique (mobile → ordinateur) : H1 30/38 px → 44/52 px ; H2 24/32 → 32/40 ; H3 19/28 → 22/30 ; texte 16/26 → 17/28 ; petit texte 14/20 (jamais pour une information essentielle comme le prix, le délai ou les frais). Prix : 24 px, graisse 600.

### Piste A : « Atelier » (noyer, chaleur artisanale)

Ambiance : établi en bois, lumière de fin de journée, papier kraft. Rassurante, chaleureuse, idée cadeau.

| Rôle | Couleur | Contraste vérifié |
|---|---|---|
| Fond | `#FAF8F5` blanc cassé chaud | — |
| Texte principal | `#1C1917` | 16,5:1 sur le fond |
| Texte secondaire | `#57534E` | 7,2:1 sur le fond ; 6,5:1 sur la surface atténuée |
| Accent `[COULEUR PRINCIPALE]` (boutons, liens, focus) | `#8B4513` noyer | Texte blanc sur l'accent 7,1:1 ; accent sur le fond 6,7:1 |
| Surface atténuée (bandeau, badges) | `#EFECE8` | Texte principal dessus 14,9:1 |
| Contour des champs | `#78716C` | 4,5:1 sur le fond |
| Bordure décorative (cartes, séparateurs) | `#E7E5E4` | Décorative, sans exigence |

- Typographie : **Inter** (titres 600, texte 400).
- Rayon : 10 px (cartes, boutons), 6 px (badges, champs).
- Photos : lumière naturelle chaude, fond bois clair ou lin, mains en action, une plante ou une tasse pour l'échelle.
- Ton : chaleureux et précis, vouvoiement. Exemple : « Comptez deux soirées tranquilles. La notice illustrée vous guide pièce par pièce. »
- Idées de nom (non vérifiées : INPI, domaine, réseaux sociaux à contrôler) : « Copeau & Cie », « L'Atelier du Soir ».

### Piste B : « Sapin » (vert forêt, nature et calme)

Ambiance : bois clair et feuillage, sobriété scandinave. Moderne, apaisante sans allégation bien-être.

| Rôle | Couleur | Contraste vérifié |
|---|---|---|
| Fond | `#F7F7F5` | — |
| Texte principal | `#18181B` | 16,5:1 sur le fond |
| Texte secondaire | `#52525B` | 7,2:1 sur le fond ; 6,7:1 sur la surface atténuée |
| Accent `[COULEUR PRINCIPALE]` | `#1E5B3F` vert sapin | Texte blanc sur l'accent 8,0:1 ; accent sur le fond 7,5:1 |
| Surface atténuée | `#EFEFEC` | Texte principal dessus 15,4:1 |
| Contour des champs | `#71717A` | 4,5:1 sur le fond |
| Bordure décorative | `#E4E4E7` | Décorative |

- Typographie : **Geist** (titres 600, texte 400).
- Rayon : 8 px (cartes, boutons), 6 px (badges, champs).
- Photos : fond blanc cassé uni, lumière douce du jour, bois clair très lisible, cadrages serrés sur les engrenages.
- Ton : simple, direct, vouvoiement. Exemple : « 168 pièces, 3 heures, aucune colle. Une manivelle, et tout se met en mouvement. » (chiffres réels du produit uniquement)
- Attention : le succès (`#15803D`) est proche de l'accent ; les messages de succès gardent toujours icône + texte.
- Idées de nom (non vérifiées) : « Sapin & Rouage », « Bois Moteur ».

### Piste C : « Laiton » (bleu nuit et laiton, mécanique horlogère)

Ambiance : cabinet de curiosités, horlogerie, engrenages. Premium, plutôt masculine-mixte, adaptée à l'angle « idée cadeau homme / femme » et aux maquettes mécaniques.

| Rôle | Couleur | Contraste vérifié |
|---|---|---|
| Fond | `#FBFAF7` | — |
| Texte principal | `#111827` | 17,0:1 sur le fond |
| Texte secondaire | `#4B5563` | 7,2:1 sur le fond ; 6,6:1 sur la surface atténuée |
| Accent `[COULEUR PRINCIPALE]` | `#1E3A5F` bleu nuit | Texte blanc sur l'accent 11,5:1 ; accent sur le fond 11,0:1 |
| Laiton foncé (icônes de réassurance, filets) | `#8A6A3A` | 4,8:1 sur le fond (utilisable pour les icônes et le grand texte) |
| Laiton clair (décor seulement) | `#B08D57` | 2,96:1 : **interdit** pour le texte et les icônes porteuses de sens |
| Surface atténuée | `#F1F0EB` | Texte principal dessus 15,5:1 |
| Contour des champs | `#6B7280` | 4,6:1 sur le fond |
| Bordure décorative | `#E5E7EB` | Décorative |

- Typographie : **Manrope** pour les titres (700), **Inter** pour le texte (400).
- Rayon : 6 px partout (plus « précis »).
- Photos : fond uni clair pour les fiches ; ambiance plus sombre (bleu nuit, lampe de bureau) réservée aux visuels d'accueil et aux réseaux.
- Ton : précis, un peu technique, vouvoiement. Exemple : « Engrenages découpés au laser, axe métallique, mouvement entraîné par une manivelle. »
- Idées de nom (non vérifiées) : « Rouage & Laiton », « Le Cabinet Mécanique ».

### Recommandation

**Piste C** si la boutique met surtout en avant des maquettes mécaniques et l'angle cadeau adulte (cohérent avec le positionnement adulte exigé par la règle des 14 ans) ; **piste A** si l'assortiment penche vers les miniatures déco. La piste B est la plus neutre. Le choix revient à l'humain ; il conditionne la configuration de marque de la page Stripe et le lancement de `developpeur-web`.

## 8. Indicateurs de mesure

Outils sans cookie non essentiel : **Cloudflare Web Analytics** (sous réserve de la validation de conformite-qa, section 6.6) et **statistiques des Payment Links Stripe** (vues du lien, ventes, revenus ; données différées jusqu'à 18 h selon Stripe). Rien n'est stocké sur l'appareil du visiteur pour la mesure.

| Indicateur | Définition | Source | Fréquence |
|---|---|---|---|
| Visites | Visites du site, par page | Cloudflare Web Analytics | Hebdo |
| Sources de trafic | Référents + paramètres UTM | Cloudflare Web Analytics | Hebdo |
| Visites des fiches produit | Visites de `/maquettes/[slug]/` | Cloudflare Web Analytics | Hebdo |
| Taux de passage au paiement | Vues du Payment Link ÷ visites de la fiche | Stripe (vues) / Cloudflare | Hebdo, par produit |
| Taux de paiement | Ventes ÷ vues du Payment Link | Stripe | Hebdo, par produit |
| Taux de conversion global | Commandes ÷ visites du site | Stripe / Cloudflare | Hebdo |
| Panier moyen | Revenus ÷ commandes | Stripe | Mensuel |
| Ventes par source | Ventes par `utm_source` / `utm_campaign` | Stripe (UTM transmis à la session de paiement) | Hebdo |
| Taux de rétractation | Déclarations ÷ commandes | Stockage rétractations / Stripe | Mensuel |
| Pièces manquantes ou cassées | Signalements ÷ commandes | Boîte email (`service-client`) | Mensuel |
| Délai réel de livraison | Moyenne et maximum commande → réception | Suivi transporteur (`gestion-commandes`) | Mensuel ; alerte si un envoi dépasse le délai annoncé |
| Vitesse du site | LCP, CLS, INP sur mobile | Cloudflare Web Analytics (Core Web Vitals) | Mensuel |

**Convention UTM** (pour `createur-contenu`) : `utm_source` = `tiktok` | `instagram` | `pinterest` | `youtube` ; `utm_medium` = `social` ; `utm_campaign` = identifiant court de la vidéo ou de l'épingle (`AAAAMMJJ-sujet`). Lettres minuscules, chiffres, tirets uniquement. Le site transmet ces paramètres au lien Stripe s'ils sont présents dans l'URL de la page (section 5.1), sans les mémoriser : une visite qui passe par plusieurs pages perd son attribution, limite acceptée.

Rapport hebdomadaire : `analyste-performance`.

## 9. Questions et décisions pour l'humain

**Décisions de conception**
1. **Choisir la piste d'identité** (A Atelier, B Sapin, C Laiton) et le **nom de la boutique** (les idées de noms ne sont pas vérifiées : INPI, domaine, réseaux). Bloquant pour `developpeur-web`.
2. **Vouvoiement** proposé partout : d'accord ?
3. **Page « À propos »** : quel niveau de présentation personnelle (prénom, ville, phrase sur vos études) ? Aucun visage dans tous les cas.
4. **Réseau principal** pour le bouton de la page Merci (TikTok, Instagram, YouTube).
5. **Quantité maximale** par commande (proposition : 3).

**Valeurs à fournir avant la mise en ligne (`politiques.md`)**
6. Frais de livraison (ou livraison offerte intégrée au prix), transporteur, délai d'expédition, délai de livraison par produit.
7. Frais de retour en cas de rétractation (à notre charge ou à celle du client) et adresse de retour.
8. Délai de réponse du service client et d'envoi de l'email de confirmation.
9. Identité légale, SIREN, téléphone, adresse publique (domicile ou domiciliation), IDU, médiateur, durées de conservation.

**Choix techniques à valider (gratuits au lancement, tarifs `À VÉRIFIER`)**
10. **Service d'envoi d'emails** pour l'accusé de réception de rétractation (offre gratuite, données dans l'UE de préférence). Une adresse email sur un domaine propre est nécessaire, donc le nom de domaine devient utile dès le lancement.
11. **Cloudflare Web Analytics** : accepté sous réserve de l'avis de conformite-qa ?
12. Stripe « Link » (paiement en un clic de Stripe) : le garder activé ou non.

**Points à faire confirmer par conformite-qa ou un professionnel [PRO]**
13. Bouton Stripe « Payer » = formule non ambiguë équivalente à « commande avec obligation de paiement ».
14. Email de confirmation avec CGV en PDF = support durable suffisant ; délai d'envoi.
15. Absence de bandeau cookies si aucun traceur non essentiel (et statut de Cloudflare Web Analytics).
16. Formule de prix « Prix final. TVA non applicable, art. 293 B du CGI ».
17. Texte officiel exact de l'encadré sur les garanties légales dans les CGV, et formulation de la dépréciation d'un kit assemblé.
18. Formulation de la mention « revendeur indépendant » pour un produit de marque.
19. Conduite à tenir si l'accusé de réception de rétractation ne part pas automatiquement.

**Proposition de modification (à valider, je ne modifie pas ces fichiers)**
20. Mettre à jour le format de fiche produit de `docs/site-technique.md` avec la section 5.2, et ajouter les variables d'environnement de la fonction de rétractation.

## 10. Sources

Internes (lues le 2026-11-12) : `CLAUDE.md` ; `docs/architecture.md` ; `docs/site-technique.md` ; `knowledge/niche.md`, `knowledge/politiques.md` (proposé), `knowledge/prix-et-marges.md` (proposé), `knowledge/contraintes.md`, `knowledge/direction-design.md` ; `outputs/2026-11-12-conformite-qa-dossier-vente-legale-maquettes-bois.md` (obligations O1 à O23) ; `outputs/2026-11-12-conformite-qa-audit-sourcing-maquettes-bois-v2.md` (points 4, 9, 11, 16) ; `outputs/2026-11-12-sourcing-produits-maquettes-bois-v2.md` ; `tests/scenarios/architecte-web.md`.

Externes (consultées le 2026-11-12) :
- Légifrance, article D221-5 du code de la consommation (fonction de rétractation en ligne, en vigueur depuis le 19/06/2026) : https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000053303365/2026-09-08
- Stripe, personnaliser les Payment Links (adresses, téléphone, acceptation des conditions, champs, quantité ajustable, image de marque, paramètres d'URL) : https://docs.stripe.com/payment-links/customize
- Stripe, suivre un lien de paiement (UTM : caractères autorisés et 150 caractères maximum ; `client_reference_id`) : https://docs.stripe.com/payment-links/url-parameters
- Stripe, après un paiement (redirection, reçus, statistiques vues / ventes / revenus, délai des données jusqu'à 18 h) : https://docs.stripe.com/payment-links/post-payment
- Cloudflare, « Free, privacy-first analytics for a better web » (pas de cookie, pas de stockage local, pas d'empreinte) : https://blog.cloudflare.com/free-privacy-first-analytics-for-a-better-web/
- ConsentStack, fiche Cloudflare Web Analytics (avis prudent : à gérer sous consentement) : https://www.consentstack.io/vendors/cloudflare-web-analytics
- ctrl.blog, revue technique de Cloudflare Web Analytics : https://www.ctrl.blog/entry/review-cloudflare-analytics/
- Sources officielles reprises du dossier conformite-qa : F23455 (commerce en ligne), CNIL cookies (S16), règlement GPSR 2023/988 (S17), article L112-1-1 (prix antérieur), article L111-7-2 (avis en ligne).
- Ratios de contraste : calculés pour ce livrable selon la définition WCAG 2.x de la luminance relative et du ratio de contraste (W3C, « Understanding Success Criterion 1.4.3 ») : https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html

### Auto-contrôle

- [x] Chaque page obligatoire du dossier conformite-qa est prévue (mentions légales, CGV, confidentialité, cookies, rétractation et formulaire type, médiateur, IDU, GPSR) : tableau 6.1.
- [x] Le bouton de rétractation en ligne est spécifié : emplacements, libellés « Renoncer au contrat ici » / « Confirmer la rétractation », champs, fonction, accusé de réception horodaté reprenant la déclaration (6.2).
- [x] La fiche produit contient le bloc GPSR toujours ouvert et la mention 14 ans et plus, avec blocage à la construction si manquants (5.1, 5.3).
- [x] Aucune technique de vente trompeuse : pas de compte à rebours, de stock affiché, de faux avis, de prix barré sans prix antérieur calculé (4.0, 5.4, 5.5).
- [x] Chaque page a un seul appel à l'action principal (tableau 3).
- [x] Tout est faisable avec la pile de `docs/site-technique.md` : Astro statique, Tailwind, Lucide, Payment Links Stripe, une fonction Cloudflare gratuite pour la rétractation (prévue par le document) ; aucune clé secrète Stripe nécessaire.
