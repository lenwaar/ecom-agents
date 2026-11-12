---
agent: analyste-marche
statut: brouillon
date: 2026-11-12
sources: [docs/architecture.md, knowledge/contraintes.md, knowledge/README.md, sources web numérotées en section 8]
prochaine-etape: sourcing-produits
---

# Sélection de niches : top 3 pour le lancement de la boutique

> Document interne d'aide à la décision. Ce n'est pas un livrable public : le passage par `conformite-qa` n'est pas obligatoire à ce stade. Il le deviendra pour toute fiche produit, page ou publication tirée de ce rapport.
> Le statut est `brouillon` à la demande de l'orchestrateur. La définition de l'agent prévoit `à-valider` : c'est à l'humain d'arbitrer.

## 1. Résumé décisionnel

- **Niche recommandée : l'enrichissement du chat d'appartement**, c'est-à-dire des jeux et griffoirs pour les propriétaires dont le chat s'ennuie à l'intérieur. Score **3,9/5**, ex æquo avec le crochet. Elle passe devant au départage parce que c'est la seule des deux dont la demande en France est prouvée par des chiffres officiels : 16,6 millions de chats et 39 % des Français qui en ont un [2].
- 2e : **kits de crochet pour adultes débutants** (3,9/5). C'est le format de contenu sans visage le plus naturel et le meilleur potentiel de rachat, mais la demande n'est pas chiffrée en France.
- 3e : **pêche aux leurres en ville (street fishing)** (3,4/5). La demande est solide (1,39 million de cartes de pêche [16]), mais la marge est sous pression à cause des prix de Decathlon.
- **Confiance** : chat **moyenne** (demande prouvée, marge non prouvée), crochet **faible** (demande non chiffrée), pêche **moyenne**.
- Condition bloquante pour toutes les niches : les coûts fournisseurs sont `À VÉRIFIER` par `sourcing-produits` avant toute décision définitive.

## 2. Hypothèses et valeurs par défaut utilisées

| Sujet | Valeur retenue | Origine |
|---|---|---|
| Marché | France d'abord, puis UE | `knowledge/contraintes.md` |
| Modèle | Dropshipping, pas de stock | `knowledge/contraintes.md` |
| Budget | 0 €, pas de publicité payante | `knowledge/contraintes.md` |
| Acquisition | Organique : TikTok, Instagram, Pinterest, YouTube Shorts | `knowledge/contraintes.md` |
| Contenu | Sans visage : mains, démonstrations, textes à l'écran, voix off | `knowledge/contraintes.md` |
| Temps | Plus de 10 h par semaine | `knowledge/contraintes.md` |
| Panier moyen visé | 25 à 60 € | Valeur par défaut de l'agent (pour repère, le panier moyen e-commerce en France est de 62 € en 2025 [35]) |
| Nombre de niches | 3 | Demande de l'orchestrateur |
| Règle de marge | Prix de vente ≥ 3 × (coût produit + livraison) | Grille de l'agent |

Points à noter :
- `knowledge/marque.md`, `niche.md` et `politiques.md` **n'existent pas encore** (le dossier sera rempli en phase 1, d'après `knowledge/README.md`). Il n'existe pas non plus de rapport `analyste-marche` antérieur dans `outputs/`.
- Règle de notation que je me suis fixée pour rester cohérent. Sans chiffre français sourcé, la note Demande est plafonnée à 2, ou à 3 si la présence du produit en grande distribution est sourcée. Sans donnée d'évolution, la note Tendance est plafonnée à 2.
- Règle de départage en cas d'égalité : la meilleure note Demande l'emporte, parce que c'est le critère le plus lourd et le plus facile à prouver.
- **Sources réellement consultées** : données publiques (FACCO/I-CAD, FFT, FNPF, FFE, INSEE, VALHOR, CNL, FEVAD), Pinterest Predicts 2026 (via la presse), catalogues de concurrents (zooplus, Decathlon, Nature & Découvertes, Greenweez, Lovecrafts, boutiques de padel), textes réglementaires UE.
- **Sources non consultées** : Amazon.fr « Mouvers & Shakers » (la page a répondu HTTP 503 le 2026-11-12). Google Trends n'a pas été interrogé directement, et je n'ai pas consulté TikTok Creative Center ni Reddit. Toutes les tendances de recherche sont donc tirées d'articles et restent à confirmer dans Google Trends (`À VÉRIFIER`).
- Certains chiffres ont été lus dans des extraits de pages via le moteur de recherche, pas dans le document complet. C'est le cas des PDF FACCO, que je n'ai pas pu ouvrir. Je le signale dans les sources.

## 3. Étage 1 : exploration large (27 niches, 14 univers)

| # | Niche (problème précis, public précis) | Univers | Source de l'idée |
|---|---|---|---|
| 1 | Chat d'appartement qui s'ennuie : jeux, griffoirs, fouille | Animaux | Population féline FACCO/I-CAD [2], blog Zoomalia [6] |
| 2 | Chien citadin seul en journée : tapis de fouille, tapis de léchage, balade | Animaux | Données I-CAD chiens [3] |
| 3 | Joueurs de padel loisir : accessoires sans marque (surgrips, protège-cadre, sacs) | Sport | Croissance FFT [8][9] |
| 4 | Street fishing : pêche aux leurres en ville pour jeunes urbains | Sport / plein air | FNPF [16], ActuNautique [17] |
| 5 | Course à pied de nuit : visibilité (brassards LED, gilets lumineux) | Sport | Déduction (sécurité hivernale) |
| 6 | Adultes qui veulent apprendre le crochet : kits débutants | Loisirs créatifs | Presse « grandma hobbies » [19][20][22] |
| 7 | Diamond painting pour adultes (activité anti-écran) | Loisirs créatifs | Rapports de marché diamond painting [28] |
| 8 | Punch needle et broderie pour débutants | Loisirs créatifs | Même mouvement que le crochet [22] |
| 9 | Lecteurs BookTok : pochettes à livre, marque-pages, repose-livres | Culture / loisirs | BookTok [30], CNL [29] |
| 10 | Parents de jeunes enfants : organisation de la voiture | Auto / parents | Déduction |
| 11 | Nettoyage intérieur de la voiture (detailing amateur) | Auto | Déduction (format « satisfaisant ») |
| 12 | Télétravail dans un petit espace : gestion des câbles et rangement du bureau | Bureau | INSEE télétravail [32][42] |
| 13 | Setup gaming : éclairage LED et accessoires de bureau | Gaming | Déduction |
| 14 | Plantes d'intérieur en appartement : accessoires d'entretien | Maison / jardin | VALHOR [33] |
| 15 | Potager de balcon pour citadins | Jardin | Déduction |
| 16 | Petites cuisines : ustensiles et rangements en silicone | Cuisine | Déduction |
| 17 | Café de spécialité à la maison (V60, balances, carafes) | Cuisine | Déduction |
| 18 | Voyage en bagage cabine uniquement : organiseurs de valise | Voyage | Déduction |
| 19 | Jeunes parents : jouets d'éveil inspirés de Montessori | Bébé / parents | Déduction |
| 20 | Cheveux bouclés : coiffage sans chaleur (heatless curlers) | Beauté | Déduction (format TikTok) |
| 21 | Rituel visage : gua sha, rouleaux de massage | Beauté / bien-être | Déduction |
| 22 | Bijoux minimalistes en acier inoxydable | Mode / accessoires | Déduction |
| 23 | Cavalier·ères de loisir : accessoires de pansage | Sport / animaux | FFE [34] |
| 24 | Ménage « satisfaisant » : outils et produits de nettoyage | Maison | Déduction (cleaning content) |
| 25 | Pilates et yoga à domicile : chaussettes antidérapantes | Sport / bien-être | Déduction |
| 26 | Déco cosy : bougies parfumées | Maison | Pinterest Predicts 2026, tendance « réconfort » [38] |
| 27 | Mode « fait main » : sacs et tops en crochet prêts à porter | Mode | Presse crochet [21] |

Univers couverts : animaux, sport, plein air, loisirs créatifs, culture, auto, parents, bureau, gaming, maison, jardin, cuisine, voyage, bébé, beauté, bien-être, mode (14 distincts en regroupant). Le minimum de 6 est largement dépassé.

## 4. Étage 2 : filtres éliminatoires

| # | Niche | Éliminée ? | Motif (critère violé) |
|---|---|---|---|
| 5 | Course de nuit LED | **Oui** | Produits électriques à batterie : marquage CE non vérifiable chez un fournisseur de dropshipping. |
| 11 | Detailing voiture | **Oui** | Le cœur de l'offre, ce sont des liquides (shampoings, sprays) : logistique difficile et étiquetage des produits chimiques. Les seuls outils ne suffisent pas à faire une offre. |
| 13 | Setup gaming LED | **Oui** | Produits électriques sans marquage CE vérifiable. Risque de marques protégées (accessoires « compatibles » consoles). |
| 15 | Potager de balcon | **Oui** | Logistique difficile (bacs encombrants, terreau lourd) et saison courte. |
| 16 | Ustensiles silicone cuisine | **Oui** | Contact alimentaire : conformité difficile à vérifier pour un débutant. |
| 17 | Café de spécialité | **Oui** | Contact alimentaire et matériel fragile (verre). |
| 19 | Jouets d'éveil bébé | **Oui** | Jouets pour moins de 14 ans : réglementation jouets [27]. |
| 20 | Coiffage bouclé sans chaleur | **Oui** | L'offre glisse vite vers des produits coiffants, qui sont des cosmétiques et exigent une personne responsable UE. L'accessoire seul ne fait pas une niche. |
| 21 | Gua sha, rouleaux visage | **Oui** | Allégations santé quasi inévitables (« drainer », « dégonfler »), ce qui est interdit par `CLAUDE.md`. |
| 22 | Bijoux acier | **Oui** | Tailles multiples pour les bagues, et conformité nickel (REACH) non vérifiable chez un fournisseur de dropshipping. |
| 24 | Ménage « satisfaisant » | **Oui** | Même raison que le 11 : le cœur de l'offre, ce sont des liquides d'entretien. |
| 25 | Chaussettes pilates | **Oui** | Tailles multiples, donc retours. |
| 26 | Bougies parfumées | **Oui** | Fragile (verre), inflammable, et étiquetage des mélanges parfumés. |
| 27 | Vêtements en crochet | **Oui** | Tailles multiples (vêtements). L'idée est récupérée par la niche 6, sans tailles. |
| 1, 2, 3, 4, 6, 7, 8, 9, 10, 12, 14, 18, 23 | — | Non | Passent à l'étage 3 (13 survivantes). |

Contraintes transversales vérifiées pour les survivantes :
- Budget 0 € : aucune ne nécessite de stock ni de publicité.
- Contenu sans visage : toutes se démontrent avec les mains ou le produit seul.
- Dropshipping : toutes sont légères et sans tailles.

## 5. Étage 3 : notation des 13 survivantes

Poids : Demande 20 %, Tendance 15 %, Concurrence exploitable 15 %, Marge 15 %, Contenu organique 15 %, Récurrence / panier 10 %, Simplicité 10 %.
Les numéros entre crochets renvoient à la section 8. « Déduction » signale un raisonnement de ma part, pas un fait sourcé.

### 5.1 Tableau récapitulatif et calcul

| Rang | Niche | D | T | C | M | Co | R | S | Calcul (0,20D + 0,15T + 0,15C + 0,15M + 0,15Co + 0,10R + 0,10S) | Score |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Chat d'appartement | 5 | 3 | 3 | 3 | 5 | 4 | 4 | 1,00+0,45+0,45+0,45+0,75+0,40+0,40 = 3,90 | **3,9** |
| 2 | Crochet débutants adultes | 3 | 4 | 3 | 4 | 5 | 5 | 4 | 0,60+0,60+0,45+0,60+0,75+0,50+0,40 = 3,90 | **3,9** |
| 3 | Street fishing | 4 | 4 | 2 | 2 | 4 | 5 | 3 | 0,80+0,60+0,30+0,30+0,60+0,50+0,30 = 3,40 | **3,4** |
| 4 | Padel accessoires | 3 | 5 | 2 | 3 | 3 | 4 | 4 | 0,60+0,75+0,30+0,45+0,45+0,40+0,40 = 3,35 | 3,4 (3,35) |
| 5 | Punch needle / broderie | 2 | 2 | 3 | 4 | 5 | 4 | 4 | 0,40+0,30+0,45+0,60+0,75+0,40+0,40 = 3,30 | 3,3 |
| 6 | Chien citadin | 4 | 2 | 3 | 3 | 4 | 3 | 3 | 0,80+0,30+0,45+0,45+0,60+0,30+0,30 = 3,20 | 3,2 |
| 7 | Accessoires BookTok | 2 | 2 | 3 | 4 | 4 | 3 | 5 | 0,40+0,30+0,45+0,60+0,60+0,30+0,50 = 3,15 | 3,2 (3,15) |
| 8 | Plantes d'intérieur | 3 | 2 | 3 | 3 | 4 | 4 | 3 | 0,60+0,30+0,45+0,45+0,60+0,40+0,30 = 3,10 | 3,1 |
| 9 | Diamond painting | 2 | 2 | 2 | 4 | 4 | 4 | 4 | 0,40+0,30+0,30+0,60+0,60+0,40+0,40 = 3,00 | 3,0 |
| 10 | Équitation loisir | 3 | 2 | 2 | 3 | 4 | 3 | 4 | 0,60+0,30+0,30+0,45+0,60+0,30+0,40 = 2,95 | 3,0 (2,95) |
| 11 | Télétravail petit espace | 3 | 2 | 2 | 3 | 4 | 2 | 4 | 0,60+0,30+0,30+0,45+0,60+0,20+0,40 = 2,85 | 2,9 (2,85) |
| 12 | Voyage cabine | 2 | 2 | 2 | 3 | 3 | 2 | 5 | 0,40+0,30+0,30+0,45+0,45+0,20+0,50 = 2,60 | 2,6 |
| 13 | Voiture parents | 2 | 2 | 2 | 3 | 3 | 1 | 4 | 0,40+0,30+0,30+0,45+0,45+0,10+0,40 = 2,40 | 2,4 |

Départage des rangs 1 et 2 (égalité à 3,90) : le chat a 5 en Demande contre 3 pour le crochet, il passe donc devant.
Calculs recomptés un par un.

### 5.2 Justification de chaque note

**1. Chat d'appartement**
| Critère | Note | Justification | Source |
|---|---|---|---|
| Demande | 5 | 16,6 M de chats estimés en 2024 et 39 % des Français déclarent un chat | [2] |
| Tendance | 3 | Parc animal annoncé à 79 M en 2025 contre 75 M en 2024, mais la méthode d'enquête a changé, donc l'évolution n'est pas certaine. Google Trends `À VÉRIFIER` | [4] |
| Concurrence | 3 | Généralistes très forts (zooplus, Zoomalia) mais peu de marques françaises spécialisées « chat d'intérieur » (Homycat, Haute Pattes) | [5][6][41] |
| Marge | 3 | Prix unitaires bas chez zooplus (cannes à plumes de 2,49 à 10,29 €, griffoirs de 4,29 à 8,49 €), donc le panier de 25 € et plus passe par des lots. Coût fournisseur `À VÉRIFIER` | [5][44] |
| Contenu | 5 | Le chat qui joue est filmable sans visage, en format court natif (déduction) | — |
| Récurrence | 4 | Recharges de griffoirs en carton existantes, jouets qui s'usent | [5] |
| Simplicité | 4 | Léger et robuste si l'on exclut arbres à chat (encombrants) et jouets électriques (déduction) | — |

**2. Crochet débutants adultes**
| Critère | Note | Justification | Source |
|---|---|---|---|
| Demande | 3 | Kits présents chez Nature & Découvertes, Greenweez, Leclerc et Lovecrafts. Aucun volume chiffré en France (`À VÉRIFIER`) | [23][24][25][26] |
| Tendance | 4 | Retour durable décrit par plusieurs sources indépendantes (FR, BE, UK), avec une base de pratique « depuis une dizaine d'années ». Aucune courbe chiffrée | [19][20][21][22] |
| Concurrence | 3 | Marques établies (Hoooked, Oké, The Stitch Man, We Are Knitters) mais peu de spécialistes « débutant adulte » en français (déduction) | [23][25][26][45] |
| Marge | 4 | Kits vendus entre 29,99 et 35,99 €. Composants légers, mais coût `À VÉRIFIER` | [23][24][25] |
| Contenu | 5 | Mains seules, timelapse, avant/après « pelote vers objet » (déduction) | — |
| Récurrence | 5 | Laine de recharge, kits de niveau suivant, crochets ergonomiques (déduction) | — |
| Simplicité | 4 | Léger, incassable, sans taille. SAV pédagogique si le tutoriel est mauvais (déduction) | — |

**3. Street fishing**
| Critère | Note | Justification | Source |
|---|---|---|---|
| Demande | 4 | 1 393 920 cartes de pêche délivrées en 2023 | [16] |
| Tendance | 4 | Street fishing décrit comme « en forte progression » et entré au calendrier des compétitions. Les jeunes représentent environ 22,5 % des licenciés | [16][17][46] |
| Concurrence | 2 | Decathlon très présent, avec des leurres à environ 1,99 € et des lots entre 14,99 et 24,99 € | [18][47] |
| Marge | 2 | Les prix de référence bas compriment le × 3 (déduction à partir de [47]) | [47] |
| Contenu | 4 | Nage du leurre et prises filmées mains seules (déduction) | — |
| Récurrence | 5 | Les leurres s'accrochent et se perdent : c'est un consommable par nature (déduction, taux de perte `À VÉRIFIER`) | — |
| Simplicité | 3 | Hameçons piquants. Restriction UE du plomb en préparation, donc risque de non-conformité | [48] |

**4. Padel accessoires**
| Critère | Note | Justification | Source |
|---|---|---|---|
| Demande | 3 | Plus de 100 000 licenciés, 250 000 pratiquants affiliés : une base encore restreinte | [8][10] |
| Tendance | 5 | +42,7 % de licenciés en un an, 3 200 pistes (+311 % depuis 2020) | [8][9] |
| Concurrence | 2 | Spécialistes (Padel Market, Padel Reference) et Decathlon Kuikma (sac à 29,99 €) | [13][14][15] |
| Marge | 3 | Surgrips de 1,90 à 4,95 € : panier faible hors sacs. Coût `À VÉRIFIER` | [13][14] |
| Contenu | 3 | Il faut un terrain et un joueur. Accessoire peu spectaculaire (déduction) | — |
| Récurrence | 4 | Surgrips et protège-cadre s'usent | [13][14] |
| Simplicité | 4 | Léger. Sacs un peu volumineux (déduction) | — |

**5. Punch needle / broderie** : D 2 (aucun chiffre FR, `À VÉRIFIER`) ; T 2 (aucune donnée spécifique, seulement le mouvement général [22]) ; C 3 (Etsy et artisans, déduction) ; M 4 (kits légers, prix concurrents `À VÉRIFIER`) ; Co 5 (gestes répétitifs « satisfaisants », mains seules, déduction) ; R 4 (toiles, fils, cadres) ; S 4 (léger).

**6. Chien citadin** : D 4 (environ 9,5 M de chiens identifiés, présents dans 29 % des foyers [3]) ; T 2 (713 812 identifications en 2024 [3], sans série de comparaison) ; C 3 (mêmes généralistes que pour le chat [5]) ; M 3 (coûts `À VÉRIFIER`) ; Co 4 (le chien qui fouille est filmable, déduction) ; R 3 (les friandises seraient le vrai consommable, mais c'est de l'alimentaire, donc exclu) ; S 3 (jouets détruits, d'où réclamations, déduction).

**7. Accessoires BookTok** : D 2 (18 livres lus par an en 2025 contre 22 en 2023 [29]) ; T 2 (BookTok fort selon un blog [30], mais la lecture recule chez les 16-19 ans [43]) ; C 3 (artisans français entre 20 et 35 € [31]) ; M 4 (pochette entre 25 et 29 € [31], coût `À VÉRIFIER`) ; Co 4 (esthétique bibliothèque, déduction) ; R 3 (effet collection) ; S 5 (textile souple, sans taille).

**8. Plantes d'intérieur** : D 3 (budget moyen de 62,50 € par foyer acheteur [33]) ; T 2 (volumes en baisse de 9 % en 2024 [33]) ; C 3 (jardineries et Amazon, déduction) ; M 3 ; Co 4 (avant/après de rempotage) ; R 4 (tuteurs, pièges, accessoires ; engrais exclus, ce sont des produits réglementés) ; S 3 (pots en céramique fragiles à exclure).

**9. Diamond painting** : D 2 (aucun chiffre FR) ; T 2 (estimations mondiales contradictoires, 2,4 contre 8,2 Md$ [28], aucune preuve de croissance) ; C 2 (offre très diffuse, déduction `À VÉRIFIER`) ; M 4 (kits cités entre 6 et 12 $ en coût [28]) ; Co 4 ; R 4 ; S 4.

**10. Équitation loisir** : D 3 (625 406 licences en 2025, environ 80 % de cavalières [34]) ; T 2 (en recul, et loin du record de 2012 à 706 449 [34]) ; C 2 (Decathlon et selleries, `À VÉRIFIER`) ; M 3 ; Co 4 (il faut avoir accès à un cheval) ; R 3 ; S 4.

**11. Télétravail petit espace** : D 3 (18,2 % des salariés télétravaillent au moins un jour par semaine en 2024 [32]) ; T 2 (-0,6 point en 2024 [32]) ; C 2 (IKEA et Amazon, déduction) ; M 3 ; Co 4 (avant/après de bureau) ; R 2 ; S 4.

**12. Voyage cabine** : D 2 et T 2 (aucune donnée, `À VÉRIFIER`) ; C 2 (organiseurs de valise très répandus, déduction) ; M 3 ; Co 3 ; R 2 ; S 5.

**13. Voiture parents** : D 2 et T 2 (aucune donnée, `À VÉRIFIER`) ; C 2 (offre Amazon abondante, déduction) ; M 3 ; Co 3 ; R 1 (achat unique) ; S 4.

## 6. Étage 4 : étude approfondie du top 3

### 6.1 N°1 : enrichissement du chat d'appartement (3,9/5, confiance moyenne)

**Preuves de demande (faits sourcés)**
1. 16,6 M de chats estimés en France en 2024, dont 8,66 M identifiés au fichier I-CAD [2].
2. 39 % des Français déclarent posséder un chat (baromètre FACCO/Odoxa) [2].
3. Parc total d'animaux familiers : 79 M en 2025 contre 75 M en 2024, à lire avec prudence à cause du changement de méthode [4].
4. Les généralistes ont des rubriques dédiées au « chat d'appartement » : article de blog chez Zoomalia [6], collection dédiée chez Haute Pattes [41]. C'est le signe d'une demande de recherche identifiée (déduction).

Point non prouvé : la part des chats vivant uniquement en intérieur en France. Un chiffre de 34 % circule sans étude primaire identifiée, je ne le retiens pas (`À VÉRIFIER`). Même chose pour le « 55 % des chats d'intérieur montrent des signes d'ennui » relayé par e-sante.fr [7], non sourcé.

**Concurrents**
| Concurrent | Prix constatés | Points forts | Points faibles exploitables (déduction) |
|---|---|---|---|
| zooplus.fr | Cannes à plumes de 2,49 à 10,29 € ; griffoirs de 4,29 à 8,49 € [5][44] | Prix, choix, livraison | Catalogue immense sans guidage par problème. Plaintes clients sur la qualité des recharges en carton [5] |
| Zoomalia | `À VÉRIFIER` | Contenu SEO (blog « jeux chat appartement ») [6] | Généraliste, pas d'identité de marque « chat d'intérieur » |
| Homycat | `À VÉRIFIER` | Fabrication française, éco-responsable [41] | Gamme étroite, distribution via revendeurs |
| Haute Pattes | `À VÉRIFIER` | Positionnement « chat d'appartement » déjà pris [41] | Notoriété et présence sociale `À VÉRIFIER` |
| Nature & Découvertes (rayon chat) | `À VÉRIFIER` | Image cadeau, magasins | Gamme réduite |

**Persona (en une phrase)** : une jeune active de 25-35 ans, en appartement en ville, absente en journée, qui culpabilise de voir son chat s'ennuyer, griffer le canapé ou la réveiller la nuit.
- Ce qu'elle a déjà essayé : jouets bas prix vite délaissés, laser, griffoir unique (déduction).
- Ses objections : « mon chat ne joue avec rien », « encore un gadget », délais de livraison.
- Où elle passe du temps : TikTok et Instagram (comptes de chats), Pinterest (aménagement), groupes Facebook de propriétaires (déduction, `À VÉRIFIER`).

**Angle de différenciation (déduction)** : vendre une **routine** plutôt qu'un jouet. Par exemple « 10 minutes de jeu par jour », sous forme de lots organisés par besoin (chat qui s'ennuie, chat qui griffe le canapé, chat qui réveille la nuit), avec des recharges. Ce que n'ont pas les généralistes, c'est la pédagogie en contenu court sans visage : « ce qu'on fait, ce que fait le chat ».

**Produits phares possibles**
1. Canne à plumes et recharges de plumes. Concurrents : 2,49 à 10,29 € l'unité [44]. Vente en lot pour atteindre 25 € et plus.
2. Griffoir en carton et recharges. Concurrents : 4,29 à 8,49 € [5]. Le carton est encombrant, poids et volume `À VÉRIFIER`.
3. Jeu de fouille / tapis à friandises (sans les friandises). Prix concurrents `À VÉRIFIER`.

**Marge estimée** : pour un lot vendu 30 €, il faut un coût produit + livraison ≤ 10 € (règle du × 3). Faisable d'après les prix unitaires concurrents, **non prouvé** tant que `sourcing-produits` n'a pas chiffré (`À VÉRIFIER`).

**Risques et parades**
- Guerre des prix face à zooplus et Amazon. Parade : lots par problème, contenu éducatif, pas de vente à l'unité de jouets à 3 €.
- Sécurité des produits (GPSR, applicable depuis le 13/12/2024) : il faut un opérateur économique établi dans l'UE et des avertissements sur la fiche [37][49]. Parade : privilégier les fournisseurs avec entrepôt UE, éviter les petites pièces ingérables et les hamacs à ventouses (risque de chute).
- Aucune allégation santé ou vétérinaire (« réduit le stress », « soigne l'obésité ») : parler de jeu et d'occupation seulement.
- Délais de livraison : sans date annoncée, le délai légal par défaut est de 30 jours (Code de la consommation, art. L216-1, `À VÉRIFIER` sur Légifrance). Les délais AliExpress sont estimés à 15-25 jours par une source non fiable, `À VÉRIFIER`.
- Dépendance au contenu : il faut un chat à filmer (décision humaine).

**Saisonnalité** : pics de recherche annoncés en décembre et en août par une plateforme sans méthodologie publiée [40] (confiance faible, `À VÉRIFIER` dans Google Trends). Recommandation (déduction) : produire le contenu dès maintenant, **lancer en janvier 2027** (Noël est trop proche vu les délais de livraison) et viser les pics d'août et de décembre 2027.

### 6.2 N°2 : kits de crochet pour adultes débutants (3,9/5, confiance faible)

**Preuves de demande**
1. Kits débutants référencés par des distributeurs grand public : Nature & Découvertes (29,99 €) [23], Greenweez (33,28 à 33,53 €) [24], Leclerc (marque Oké, 19,50 €) [26], Lovecrafts (Hoooked, 8,79 à 35,99 €) [25].
2. Retour du crochet décrit par plusieurs médias indépendants : Lyon Capitale [19], RTBF (« Grandma Era », novembre 2024) [20], Connexion France [21], FashionUnited 2026 [22].
3. Tendance « réconfort et loisirs comme évasion » relevée dans Pinterest Predicts 2026 [38]. C'est un signal général, sans chiffre propre au crochet.
- **Aucun volume de ventes ou de recherche en France n'est sourcé** : c'est la raison de la confiance faible. À confirmer dans Google Trends (« kit crochet », « crochet débutant », France, 5 ans) avant tout engagement (`À VÉRIFIER`).

**Concurrents**
| Concurrent | Prix constatés | Points forts | Points faibles exploitables (déduction) |
|---|---|---|---|
| The Stitch Man (via Nature & Découvertes) | 29,99 € [23] | Tutoriels vidéo, anneau magique pré-démarré | Dépend d'un revendeur, peu de suite de progression visible |
| Hoooked (Lovecrafts) | 8,79 à 35,99 € [25] | Marque établie, fil recyclé | Positionnement déco plus qu'apprentissage |
| Oké (Leclerc) | 19,50 € [26] | Prix, grande distribution | Fiche avec avertissement jouet : cible floue enfant/adulte |
| Creativ Company / Graine Créative (Greenweez) | 28,99 à 33,53 € [24] | Kits complets | Pas de communauté ni de contenu |
| We Are Knitters | `À VÉRIFIER` [45] | Marque D2C forte en Europe | Tricot d'abord, prix `À VÉRIFIER` |

**Persona (en une phrase)** : une femme de 20-35 ans qui cherche une activité manuelle anti-écran, a vu des vidéos de crochet et n'ose pas commencer seule.
- Ce qu'elle a déjà essayé : tutoriels YouTube trop rapides, pelotes inadaptées, abandon au premier rang (déduction).
- Ses objections : « je ne suis pas manuelle », « je vais rater », « j'ai peu de temps ».
- Où elle passe du temps : TikTok, Pinterest, Instagram (déduction).

**Angle de différenciation (déduction)** : un **parcours de progression en français**, niveau 1, puis 2, puis 3, avec des vidéos mains seules, des projets réussis en moins de 2 h pour le premier kit, et des recharges de laine. Les concurrents vendent un kit, pas un chemin.

**Produits phares possibles**
1. Kit « premier projet » (petit amigurumi ou dessous-de-verre) : 19,50 à 33,53 € chez les concurrents [23][24][26].
2. Kit de crochets ergonomiques et accessoires (marqueurs, aiguille à laine) : prix concurrents `À VÉRIFIER`.
3. Lots de laine de recharge assortis aux kits : prix `À VÉRIFIER`.

**Marge estimée** : kit vendu 30 €, donc coût produit + livraison ≤ 10 €. Plausible pour des composants légers, **non prouvé** (`À VÉRIFIER`).

**Risques et parades**
- Réglementation jouets : un amigurumi présenté pour des enfants ou facilement accessible aux enfants peut être qualifié de jouet (moins de 14 ans) [27]. Parade : kits clairement destinés aux adultes, sans mise en scène d'enfants. Validation par `conformite-qa`.
- Étiquetage de la composition des fibres textiles (règlement UE 1007/2011) : `À VÉRIFIER` par `conformite-qa`.
- Qualité du fil et clarté du tutoriel : commander des échantillons (dépense à valider par l'humain, budget 0 €).
- La personne qui filme doit savoir crocheter, ou apprendre (décision humaine, temps).

**Saisonnalité (déduction, `À VÉRIFIER`)** : automne-hiver (cocooning) et cadeaux de Noël. Fenêtre « nouvelle activité » en janvier.

### 6.3 N°3 : street fishing, pêche aux leurres en ville (3,4/5, confiance moyenne)

**Preuves de demande**
1. 1 393 920 cartes de pêche délivrées par la FNPF en 2023 [16].
2. Jeunes : environ 22,5 % des licenciés [16].
3. Street fishing « en forte progression » dans les grandes villes, pratiqué par une majorité de jeunes actifs urbains [17], et intégré au calendrier des compétitions 2026 [46].
4. Les premières ventes de cartes de 2026 sont annoncées « bonnes » (donnée provisoire) [50].

**Concurrents**
| Concurrent | Prix constatés | Points forts | Points faibles exploitables (déduction) |
|---|---|---|---|
| Decathlon / Caperlan | Leurres à environ 1,99 €, lots de 14,99 à 64,99 € [47] | Prix, magasins, gamme énorme | Catalogue de plus de 6 000 références sur la rubrique leurres [47], pas de sélection « débutant urbain » |
| Reniers Fishing (BE) | Environ 4 à 6 € le leurre [18] | Spécialiste | Pas de positionnement « ville » |
| Pecheur.com, Pacific Pêche | `À VÉRIFIER` | Spécialistes reconnus | `À VÉRIFIER` |

**Persona (en une phrase)** : un homme de 18-30 ans, citadin, qui débute la pêche aux leurres sur les quais avec un matériel léger et ne sait pas quels leurres choisir.
- Ses objections : « Decathlon est moins cher », « je perds tous mes leurres ».
- Où il passe du temps : YouTube, TikTok, Instagram (déduction).

**Angle de différenciation (déduction)** : des **boîtes « spot urbain »** (quai, canal, port) prêtes à pêcher, sans plomb, avec un guide. On ne vend pas un leurre, on vend « quoi mettre au bout de la ligne ici ».

**Produits phares possibles**
1. Boîte assortie de leurres souples et têtes sans plomb : lots concurrents de 14,99 à 24,99 € [47].
2. Recharges de leurres par modèle (consommable) : environ 1,99 € l'unité chez Decathlon [47].
3. Accessoires légers (pince, porte-leurres, sacoche de ceinture) : `À VÉRIFIER`.

**Marge estimée** : elle est mauvaise si l'on vend à l'unité face à Decathlon. Elle n'est viable qu'en lots (vente à 25-35 €, coût ≤ 8-12 €, `À VÉRIFIER`).

**Risques et parades**
- Restriction UE du plomb dans les articles de pêche en préparation (projet de règlement REACH transmis au Conseil en 2026, date d'application `À VÉRIFIER`) [48]. Parade : uniquement des produits sans plomb dès le départ.
- Le contenu demande d'aller à la pêche, donc une carte de pêche (coût `À VÉRIFIER`, en conflit potentiel avec le budget de 0 €) et du temps sur place.
- Hameçons : emballage et avertissements de sécurité (GPSR [37]).

**Saisonnalité (`À VÉRIFIER`)** : l'activité dépend des dates d'ouverture des carnassiers, qui varient par département et catégorie de cours d'eau. Lancement conseillé en février-mars pour être prêt au printemps (déduction).

## 7. Recommandation finale et décisions humaines

**Lancer en premier : l'enrichissement du chat d'appartement.**
Pourquoi :
1. C'est la seule niche du top 3 dont la demande est prouvée par des données officielles (16,6 M de chats, 39 % des Français) [2].
2. Le contenu « chat » sans visage est le format le plus compatible avec un lancement à 0 € de publicité (déduction).
3. Le produit est léger, sans taille, et a des consommables (recharges).

Sa faiblesse, c'est la marge face à zooplus : il faut une offre en lots et non à l'unité.
Le crochet est un plan B solide si l'humain sait crocheter, mais il faut d'abord prouver la demande (Google Trends).
Le padel (3,35) est une alternative à la pêche si l'humain joue au padel.

**Décisions à prendre par l'humain**
1. Valider la niche n°1, et confirmer l'accès à un chat pour filmer (sinon, passer au n°2).
2. Accepter ou non un petit budget pour des échantillons : la contrainte « 0 € » interdit en théorie de tester la qualité avant de vendre.
3. Autoriser `sourcing-produits` à chiffrer les coûts réels et à filtrer les fournisseurs avec entrepôt UE et opérateur responsable UE (GPSR).
4. Faire vérifier dans Google Trends (France, 5 ans) : « jouet chat interactif », « griffoir chat », « kit crochet débutant », « street fishing ».
5. Après validation, `knowledge/niche.md` et `knowledge/persona.md` pourront être remplis. C'est à proposer par l'orchestrateur, je ne modifie pas `knowledge/`.

**Canal à étudier (fait sourcé et déduction)** : TikTok Shop est ouvert en France depuis le 31/03/2025, avec plus de 16 000 marchands après six mois [36]. L'inscription est annoncée gratuite par une source secondaire [36]. C'est un canal de vente cohérent avec la contrainte organique, à évaluer en phase 3.

## 8. Sources (consultées le 2026-11-12)

1. `knowledge/contraintes.md` (interne)
2. Statistiques.com, chats (reprise FACCO/I-CAD) : https://www.statistiques.com/divers/chats
3. SantéVet, population canine (I-CAD) : https://www.santevet.com/articles/population-canine-en-France-chiffres-et-tendances
4. FACCO/Odoxa 2025, chiffres (PDF non lisible directement, chiffre lu dans l'extrait du moteur de recherche) : https://www.facco.fr/wp-content/uploads/2025/06/2025-06-facco-chiffres-odoxa.pdf
5. zooplus.fr, griffoirs (Karlie 4,49 €, Simon's Cat 8,49 €, zooplus Basics 4,29 €, avis sur les recharges) : https://www.zooplus.fr/shop/chats/arbre_a_chat/arbre_chat_carton_ondule/2109162 , https://www.zooplus.fr/shop/chats/arbre_a_chat/hamac_griffoir_chat/griffoir_pour_chat/897318 , https://www.zooplus.fr/shop/chats/jouets_chat/jouets_a_griffer_chat/2196671 , https://www.zooplus.fr/shop/chats/jouets_chat/jouets_a_griffer_chat/742273
6. Zoomalia, blog « jeux chat appartement » : https://www.zoomalia.com/blog/article/jeux-chat-appartement.html
7. e-sante.fr (chiffre non sourcé, non retenu) : https://www.e-sante.fr/faut-il-promener-son-chat-en-laisse-pour-preserver-sa-sante/actualite/615530
8. SportBusiness.club, FFT : plus de 100 000 licenciés padel, +42,7 % : https://www.sportbusiness.club/?p=180378
9. FFT, présentation Boost padel (3 200 pistes, +311 % depuis 2020) : https://guidedudirigeant.fft.fr/wp-content/uploads/2025/10/Presentation-Boost-padel-x-clubs-VF.pdf
10. Padel Magazine, 250 000 pratiquants avec la licence multi-raquettes : https://padel-magazine.co.uk/avec-la-licence-multi-raquettes-on-atteint-les-250-000-joueurs-de-padel-reguliers/
11. SGI Europe, intérêt mondial de recherche padel +49 % : https://www.sgieurope.com/consumer/padel-hits-all-time-high-in-global-search-interest/120682.article
12. Padel Magazine, Google Trends padel/tennis : https://padel-magazine.co.uk/google-trends-le-padel-depasse-le-tennis-dans-plusieurs-pays-deurope/
13. Padel Market, accessoires : https://padelmarket.com/fr-eu/collections/accessoires
14. Padel Reference, accessoires : https://www.padelreference.com/fr/accessoires-de-padel
15. Decathlon Pro / Decathlon, sacs Kuikma : https://www.decathlonpro.fr/sac-a-dos-de-padel-14-l-kuikma-pc-190-gris-chine-id-8789061.html , https://www.decathlon.fr/tous-les-sports/padel/sacs-de-padel-paleteros
16. Figaro Nautisme, cartes de pêche 2023 et part des jeunes : https://figaronautisme.meteoconsult.fr/actus-nautisme-loisirs/2026-01-19/84825-la-peche-en-france-un-loisir-en-plein-essor-qui-seduit-toutes-les-generations
17. ActuNautique, street fishing (août 2025) : https://www.actunautique.com/2025/08/peche-en-eau-douce-avec-le-street-fishing-la-peche-urbaine-s-installe-durablement-dans-le-paysage-francais.html
18. Decathlon, leurres souples carnassiers, et Reniers Fishing : https://www.decathlon.fr/tous-les-sports/peche-des-carnassiers/leurre-souple-carnassiers , https://reniersfishing.be/fr/peche-des-carnassiers/leurres-souples/page5.html
19. Lyon Capitale, crochet : https://www.lyoncapitale.fr/?p=407147
20. RTBF, « Grandma Era » : https://www.rtbf.be/article/grandma-era-quand-la-gen-z-se-passionne-pour-les-hobbies-des-retraites-11462860
21. Connexion France, crochet : https://www.connexionfrance.com/magazine/a-colourful-comeback-for-crochet-in-france/680845
22. FashionUnited, « grandma hobbies » (2026) : https://fashionunited.com/news/fashion/why-grandma-hobbies-are-on-the-rise-among-young-consumers/2026072473586
23. Nature & Découvertes, kit Trompette l'Éléphant 29,99 € : https://www.natureetdecouvertes.com/livres-loisirs/loisirs-creatifs/kits-materiel-creatifs/trompette-l-elephant-kit-crochet-debutant-avec-videos-accessible-a-tous-93459530
24. Greenweez, kit amigurumi 33,53 € : https://www.greenweez.com/produit/kit-amigurumi-pour-faire-un-lapin-en/1GRCA0731
25. Lovecrafts FR, kits crochet (Hoooked) : https://www.lovecrafts.com/fr-fr/l/laines/packs-et-kits-multiples/kits/crochet-kits
26. E.Leclerc, kit Oké « Polly la Pieuvre » 19,50 € : https://www.e.leclerc/fp/kit-diy-polly-la-pieuvre-by-oke-3701060980420
27. Directive 2009/48/CE, sécurité des jouets (EUR-Lex) : https://eur-lex.europa.eu/eli/dir/2009/48/2022-12-05
28. Estimations diamond painting contradictoires : https://www.datamintelligence.com/research-report/diamond-art-painting-market , https://www.serif.ai/start-a-business/how-to-start-a-diamond-painting-business-2025-guide-9-steps-free-business-plan
29. Livres Hebdo, baromètre CNL 2025 : https://www.livreshebdo.fr/article/les-francais-lisent-de-moins-en-moins-selon-le-barometre-2025-les-francais-et-la-lecture
30. Sherpas (blog), chiffres BookTok, source secondaire : https://sherpas.com/blog/wp-json/wp/v2/posts/307567
31. Marques de France, pochettes à livre, et Paris Friendly, Pochette Nomade : https://www.marques-de-france.fr/produit/pochette-a-livre-paris-velo-orange/ , https://www.paris-friendly.fr/pochette-a-livre-made-in-france.html
32. INSEE Première n° 2044, télétravail 2024 : https://www.insee.fr/fr/statistiques/fichier/8391807/IP2044.pdf
33. VALHOR, consommation de végétaux 2024 : https://bo.valhor.fr/wp-content/uploads/2025/06/cp-consommation_vegetaux_2024_valhor.pdf
34. FFE, rapport moral 2025 : https://cde01.ffe.com/File/rapport_moral_2025_.doc ; FFE : https://www.ffe.com/media/17211/download
35. Ecommerce Nation, bilan FEVAD 2025 (196,4 Md€, panier moyen 62 €) : https://www.ecommerce-nation.fr/bilan-ecommerce-2025-196-milliards-baisse-panier-moyen/
36. TikTok Shop France : https://www.moneyvox.fr/votre-argent/actualites/102692/tiktok-shop-comment-marchent-la-boutique-et-ce-nouveau-bouton-achat-lances-le-31-mars-2025 , https://www.ecommerce-nation.fr/six-mois-apres-son-lancement-en-france-tiktok-shop-seduit-deja-plus-de-16-000-marchands/ , https://lancetavie.fr/developper-son-business/comment-vendre-sur-tiktok-shop/
37. GPSR, règlement (UE) 2023/988 : https://donneespersonnelles.fr/gpsr ; https://linklaters.com/insights/blogs/productliabilitylinks/2024/december/changes-through-the-new-product-safety-regulation
38. Pinterest Predicts 2026 : https://lareclame.fr/wp-content/uploads/2025/12/Pinterest-Predicts%E2%84%A2-_-Entre-affirmation-de-soi-recherche-dequilibre-et-soif-devasion-21-tendances-qui-marqueront-2026.pdf , https://www.socialmediatoday.com/news/pinterest-publishes-2026-trend-predictions-report/807452/
39. (réservé) Code de la consommation, art. L216-1 : URL Légifrance `À VÉRIFIER`
40. Accio (plateforme B2B, méthodologie non publiée, confiance faible) : https://fr.accio.com/business/jouet-chat-automatique-tendance
41. Homycat (Greenweez) et Haute Pattes : https://www.greenweez.com/marque/homycat-1 , https://hautepattes.co.uk/collections/jouets-pour-chat-dappartement
42. INSEE Analyses n° 105, télétravail : https://www.insee.fr/fr/statistiques/fichier/8379375/ia105.pdf
43. CNL, « Les jeunes Français et la lecture » 2026 : https://centrenationaldulivre.fr/sites/default/files/2026-04/%C3%89tude%202026%20-%20Les%20jeunes%20Fran%C3%A7ais%20et%20la%20lecture%20-%20Communiqu%C3%A9%20de%20presse.pdf
44. zooplus.fr, cannes à plumes (TIAKI 2,49 €, 4,99 €, 10,29 €) : https://www.zooplus.fr/shop/chats/jouets_chat/cannes_a_peche_chat/cannes_a_peche_plume/1973960 , https://www.zooplus.fr/shop/chats/jouets_chat/cannes_a_peche_chat/cannes_a_peche_plume/1791211 , https://www.zooplus.fr/shop/chats/jouets_chat/cannes_a_peche_chat/cannes_a_peche_plume/1908495
45. We Are Knitters, kits crochet : https://weareknitters.com/fr/collections/crochet-kits
46. Figaro Nautisme, compétitions de pêche 2026 : https://figaronautisme.meteoconsult.fr/actus-nautisme-loisirs/2026-09-25/92664-les-competitions-de-peche-en-france-un-sport-aux-disciplines-multiples
47. Decathlon, pêche aux leurres (prix des lots et nombre de références) : https://www.decathlon.fr/tous-les-sports/peche-des-carnassiers/peche-aux-leurres
48. Restriction du plomb dans la pêche (projet REACH) : https://www.senat.fr/europe/textes_europeens/e20785.pdf , https://figaronautisme.meteoconsult.fr/actus-nautisme-flash/2026-03-01/85359-peche-de-loisir-la-commission-europeenne-envisage-une-interdiction-progressive-du-plomb
49. Commission européenne, lignes directrices GPSR (EUR-Lex) : https://eur-lex.europa.eu/eli/C/2025/6233/oj/eng
50. Peche.com, cartes de pêche 2026 : https://www.peche.com/article/51475/des-cartes-de-peche-a-la-hausse-et-une-reflexion-a-l-etude
51. Amazon.fr Mouvers & Shakers (tentative, HTTP 503, non utilisée) : https://www.amazon.fr/gp/movers-and-shakers/
