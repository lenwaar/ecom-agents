---
agent: analyste-marche
statut: à-valider
date: 2026-11-12
sources: [CLAUDE.md, docs/architecture.md, knowledge/README.md, knowledge/contraintes.md, outputs/2026-11-12-analyste-marche-top3-niches.md, sources web numérotées en section 9]
prochaine-etape: sourcing-produits
---

# Sélection de niches v3 : top 3 compatible « seul, chez soi, avec le produit uniquement »

> Document interne d'aide à la décision, pas un livrable public. Toute fiche produit, page ou publication tirée de ce rapport passera par `conformite-qa`.
> Ce rapport remplace la recommandation du rapport v1 (`outputs/2026-11-12-analyste-marche-top3-niches.md`), dont le top 3 (chat d'appartement, crochet, street fishing) et le padel sont écartés par l'humain dans `knowledge/contraintes.md`. Aucune de ces niches n'est re-proposée, ni sous une autre forme : pas de produit pour animaux, pas de travail du fil (tricot, broderie, punch needle), pas de pêche, pas de sport de raquette.

## 1. Résumé décisionnel

- **Niche recommandée : les kits déco à assembler soi-même pour adultes** (maquettes mécaniques en bois, miniatures « book nook » sans électronique). Score **3,8/5**.
- Pourquoi : c'est la seule niche dont la demande est prouvée par des **ventes** en France (données Circana) : la construction a progressé de 32 % en 2025, les adultes de 12 ans et plus pèsent 33 % du marché du jouet [4][3]. Le contenu se tourne seul au bureau, mains seules : on montre l'assemblage, puis l'objet fini qui fonctionne.
- 2e : **journaling et papeterie créative pour adultes** (3,6/5). 3e : **coin lecture cosy, accessoires de lecture** (3,3/5).
- **Confiance** : kits **moyenne**, journaling **faible**, coin lecture **faible**. Google Trends n'a pas pu être interrogé (HTTP 429) : les notes Tendance sont provisoires.
- **Points bloquants** : coût fournisseur et accès légal en dropshipping aux kits (marques Rokr, Ugears, Rolife ou modèles génériques originaux), statut réglementaire « jouet ou non », et un budget d'échantillon pour acheter au moins un kit à filmer. Tout cela est `À VÉRIFIER`.

## 2. Hypothèses et valeurs par défaut utilisées

| Sujet | Valeur retenue | Origine |
|---|---|---|
| Marché | France d'abord, puis UE | `knowledge/contraintes.md` |
| Modèle | Dropshipping, sans stock | `knowledge/contraintes.md` |
| Budget | 0 €, aucune publicité payante | `knowledge/contraintes.md` |
| Acquisition | Organique : TikTok, Instagram, Pinterest, YouTube Shorts | `knowledge/contraintes.md` |
| Contenu | Sans visage : mains, produit, texte à l'écran, voix off | `knowledge/contraintes.md` |
| **Ressources pour filmer** | **Aucune** : pas d'animal, pas de sport ou loisir pratiqué hors de chez soi, personne pour filmer. Tournage seul, chez soi (bureau, chambre, cuisine, salle de bain), avec le produit uniquement | `knowledge/contraintes.md` |
| Échantillons | 0 € pour l'instant | `knowledge/contraintes.md` |
| Temps | Plus de 10 h par semaine | `knowledge/contraintes.md` |
| Niches écartées | Chat d'appartement, padel, street fishing, crochet | `knowledge/contraintes.md` |
| Panier moyen visé | 25 à 60 € | Valeur par défaut de l'agent (repère : panier moyen e-commerce FR de 62 € en 2025 [35]) |
| Nombre de niches | 3 | Demande de l'orchestrateur |
| Règle de marge | Prix de vente ≥ 3 × (coût produit + livraison) | Grille de l'agent |

**Règles de notation que je me fixe, plus strictes qu'en v1 :**
- **Demande.** 5 exige des ventes ou des recherches chiffrées en France sur le produit lui-même. 4 : ventes françaises chiffrées sur la catégorie mère, et présence du sous-segment chez plusieurs distributeurs français. 3 : présence en grande distribution sourcée, ou hausse de recherches Pinterest sans chiffre de ventes. 2 : aucun chiffre français. Une taille de population ne compte pas comme une preuve d'achat.
- **Tendance.** 4 exige au moins deux années de données chiffrées dans le même sens. Une hausse Pinterest sur une seule saison plafonne la note à 3. Faute de Google Trends, **toutes les notes Tendance sont provisoires**.
- **Filtre « tournage seul chez soi ».** Il est éliminatoire. Une niche est éliminée si le contenu exige un animal, un lieu extérieur, une pratique sportive, une autre personne, de porter le produit sur soi comme un modèle (bijoux, accessoires cheveux), ou une compétence manuelle que l'humain n'a pas déclarée.
- **Départage** en cas d'égalité : la meilleure note Demande l'emporte.

**Sources réellement consultées** : données Circana relayées par Xerfi, Republik Retail, La Gazette France et Global Toy News ; rapports Pinterest (Predicts 2026, printemps 2026, loisirs 2026) ; Livres Hebdo ; fiches de distributeurs (Nature & Découvertes, Truffaut, Greenweez, Ludum, IKEA, Marques de France, Paris Friendly) ; articles de Gens d'Internet et SeLoger.

**Sources tentées sans succès le 2026-11-12** : Google Trends (HTTP 429) ; Amazon.fr « Meilleures ventes » et « Mouvers & Shakers » (HTTP 503) ; Action, Kaufland, Bricomarché (HTTP 403) ; La Réclame (HTTP 403) ; PaperWrld et Ugears (HTTP 429). Les prix de ces sites viennent des **extraits du moteur de recherche** et sont signalés comme tels. TikTok Creative Center et Reddit n'ont pas été consultés.

**Repris du rapport v1** : la méthode, les sources réglementaires (directive jouets, GPSR), les notes de diamond painting, télétravail, voyage cabine et accessoires de lecture, ajustées quand des données nouvelles existent.

## 3. Étage 1 : exploration large (27 niches, 15 univers)

| # | Niche (problème précis, public précis) | Univers | Source de l'idée |
|---|---|---|---|
| 1 | Adultes qui veulent une activité manuelle anti-écran débouchant sur un objet déco : maquettes mécaniques en bois 3D | Loisirs / kidult | Circana via Xerfi [3], Republik [4] |
| 2 | Adultes amateurs de lecture et de miniatures : kits « book nook » (diorama à glisser dans une étagère) | Loisirs / kidult | Gamme Rolife en France [12][13], Pinterest loisirs « création de pièce miniature » [17] |
| 3 | Adultes qui veulent des fleurs qui ne fanent pas : bouquets en briques à construire | Déco / kidult | LEGO Botanique dans le top des ventes [5][6] |
| 4 | Adultes qui cherchent une activité calme du soir : puzzles 1 000 pièces design | Jeux | Catégorie jeux et puzzles Circana [4][5] |
| 5 | Étudiantes et jeunes actives qui veulent s'organiser sans appli : journaling, bullet journal (carnets, washi, stickers) | Papeterie / bureau | Pinterest loisirs [17], Lénadorable [19][20] |
| 6 | Adultes qui redécouvrent la correspondance manuscrite : papier à lettres, tampons, cachets | Papeterie | Pinterest Predicts 2026, « Club Courrier » [15] |
| 7 | Lecteurs qui veulent un coin lecture douillet : pochettes à livre, repose-livres, marque-pages | Culture / maison | Pinterest printemps 2026, « idées de coin lecture » [16] |
| 8 | Locataires qui ne peuvent pas percer : rangement sans perçage pour salle de bain et placard | Maison | SeLoger [30], Pinterest printemps 2026 [16] |
| 9 | Personnes qui veulent un frigo « organisé et esthétique » : bacs et boîtes de frigo | Cuisine | Pinterest printemps 2026 [16] |
| 10 | Petits logements avec un coin buanderie : organisation buanderie | Maison | Pinterest printemps 2026 [16] |
| 11 | Adeptes du « reset » ménager : outils de nettoyage sans produit liquide (brosses, raclettes, microfibres) | Maison / entretien | Pinterest printemps 2026 [16] |
| 12 | Jeunes qui personnalisent leur chambre : affiches déco imprimées à la demande | Déco | Pinterest printemps 2026, « ma chambre, mes règles » [16] |
| 13 | Étudiants et télétravailleurs dans un petit espace : organisation du bureau et des câbles (sans électronique) | Bureau | INSEE (v1) [40] |
| 14 | Adultes qui cherchent une activité créative sans savoir dessiner : diamond painting | Loisirs créatifs | Rapport v1 [41] |
| 15 | Même public : peinture par numéros | Loisirs créatifs | Déduction |
| 16 | Débutants en broderie ou punch needle | Loisirs créatifs | Pinterest loisirs [17] |
| 17 | Citadins sans jardin : kits de terrarium à faire soi-même | Jardin / déco | Pinterest loisirs [17] |
| 18 | Coiffures rapides : pinces crabe, chouchous | Beauté / accessoires | Déduction |
| 19 | Sacs à main en désordre : organiseurs de sac | Mode / accessoires | Déduction |
| 20 | Voyageurs en bagage cabine : organiseurs de valise | Voyage | Rapport v1 |
| 21 | Adultes qui veulent un calendrier de l'Avent original : calendriers à remplir | Cadeaux | Déduction |
| 22 | Setup gaming : éclairage LED | Gaming | Rapport v1 |
| 23 | Plantes d'intérieur en appartement : accessoires d'entretien | Jardin | Rapport v1 [VALHOR] |
| 24 | Parents : organisation de la voiture | Auto / parents | Rapport v1 |
| 25 | Café de spécialité à la maison | Cuisine | Rapport v1 |
| 26 | Jeunes parents : jouets d'éveil Montessori | Bébé | Rapport v1 |
| 27 | Chien citadin seul en journée : jeux de fouille | Animaux | Rapport v1 |

**Univers couverts (15)** : loisirs/kidult, déco, jeux, papeterie, bureau, culture, maison, entretien, cuisine, jardin, beauté, mode, voyage, cadeaux, gaming, auto/parents, bébé, animaux. Le minimum de 6 est largement dépassé.

## 4. Étage 2 : filtres éliminatoires

Filtres appliqués dans l'ordre : niche déjà écartée, tournage seul chez soi, produit réglementé, contrefaçon, logistique, tailles, mode éphémère.

| # | Niche | Éliminée ? | Motif (critère violé) |
|---|---|---|---|
| — | Chat d'appartement, padel, street fishing, crochet | **Oui** | **Déjà écartées** par l'humain. Non ré-explorées. |
| 27 | Chien citadin | **Oui** | **Contenu infaisable** : il faut un animal. C'est aussi un détour par l'univers « animaux », proche de la niche chat écartée. |
| 24 | Voiture parents | **Oui** | **Contenu infaisable** : il faut une voiture et des enfants. |
| 23 | Plantes d'intérieur | **Oui** | **Contenu infaisable** sans plantes vivantes (ressource non déclarée, achat contraire au budget de 0 €). Recul des volumes en 2024 (v1). |
| 16 | Broderie / punch needle | **Oui** | **Compétence manuelle requise**, non déclarée par l'humain. De plus, c'est un travail du fil très proche du crochet, écarté pour demande faible. La seule donnée de hausse (Pinterest) a un périmètre canadien probable [17]. |
| 18 | Accessoires cheveux | **Oui** | **Contenu infaisable** au sens strict : il faut porter le produit sur soi, donc servir de modèle (cheveux, nuque). Ce n'est plus « le produit uniquement ». |
| 3 | Fleurs en briques à construire | **Oui** | **Marque protégée au cœur de l'offre** : la demande est tirée par LEGO Botanique [5][6]. Les alternatives de dropshipping copient souvent les modèles LEGO, ou se vendent comme « compatibles LEGO » : risque de contrefaçon et d'usage illicite de la marque. |
| 9 | Organisation frigo | **Oui** | **Contact alimentaire** : conformité des bacs difficile à vérifier pour un débutant. |
| 25 | Café de spécialité | **Oui** | **Contact alimentaire et verre fragile** (v1). |
| 26 | Jouets Montessori | **Oui** | **Jouets pour moins de 14 ans** : directive jouets [33]. |
| 22 | Setup gaming LED | **Oui** | **Électrique** : marquage CE non vérifiable chez un fournisseur de dropshipping. |
| 15 | Peinture par numéros | **Oui** | **Liquides** (pots de peinture acrylique) : logistique et étiquetage des mélanges chimiques `À VÉRIFIER`. |
| 17 | Kits terrarium | **Oui** | **Vivant et fragile** : mousses ou plantes, contenant en verre. |
| 10 | Organisation buanderie | **Oui** | **Encombrant** (étagères, paniers). **Contenu probablement infaisable** : il faut avoir une buanderie (`À VÉRIFIER` auprès de l'humain). |
| 21 | Calendrier de l'Avent | **Oui** | **Mode éphémère** : un seul pic annuel, sans base durable. |
| 1, 2, 4, 5, 6, 7, 8, 11, 12, 13, 14, 19, 20 | — | Non | Passent à l'étage 3. Les niches 1 et 2 sont **regroupées** en une seule (même acheteur, même contenu, même usage) : « kits déco à assembler pour adultes ». Il reste donc **12 niches**. |

**Contrôle « tournage seul chez soi » pour les survivantes** (déduction) : toutes se filment sur un bureau, un lit, une étagère, dans une salle de bain ou une cuisine, avec les mains et le produit seulement. Point commun à toutes : pour filmer, **il faut posséder au moins un exemplaire du produit**, ce qui se heurte au budget échantillons de 0 € (décision humaine, section 7).

## 5. Étage 3 : notation des 12 survivantes

Poids : Demande 20 %, Tendance 15 %, Concurrence exploitable 15 %, Marge 15 %, Contenu organique 15 %, Récurrence / panier 10 %, Simplicité 10 %.
« Déduction » signale un raisonnement de ma part, pas un fait sourcé. Les notes Tendance sont **toutes provisoires** (Google Trends non interrogé).

### 5.1 Tableau récapitulatif et calcul

| Rang | Niche | D | T | C | M | Co | R | S | Calcul (0,20D + 0,15T + 0,15C + 0,15M + 0,15Co + 0,10R + 0,10S) | Score |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Kits déco à assembler pour adultes | 4 | 4 | 3 | 3 | 5 | 4 | 3 | 0,80+0,60+0,45+0,45+0,75+0,40+0,30 = 3,75 | **3,8** |
| 2 | Journaling et papeterie créative adultes | 3 | 3 | 2 | 3 | 5 | 5 | 5 | 0,60+0,45+0,30+0,45+0,75+0,50+0,50 = 3,55 | **3,6** |
| 3 | Coin lecture cosy (accessoires de lecture) | 2 | 3 | 3 | 4 | 4 | 3 | 5 | 0,40+0,45+0,45+0,60+0,60+0,30+0,50 = 3,30 | **3,3** |
| 4 | Outils de ménage « reset » sans liquide | 3 | 3 | 2 | 2 | 5 | 4 | 4 | 0,60+0,45+0,30+0,30+0,75+0,40+0,40 = 3,20 | 3,2 |
| 5 | Correspondance manuscrite | 2 | 3 | 3 | 3 | 4 | 3 | 5 | 0,40+0,45+0,45+0,45+0,60+0,30+0,50 = 3,15 | 3,2 (3,15) |
| 6 | Puzzles adultes 1 000 pièces | 3 | 3 | 2 | 3 | 4 | 4 | 3 | 0,60+0,45+0,30+0,45+0,60+0,40+0,30 = 3,10 | 3,1 |
| 7 | Rangement sans perçage pour locataires | 3 | 3 | 2 | 2 | 5 | 3 | 3 | 0,60+0,45+0,30+0,30+0,75+0,30+0,30 = 3,00 | 3,0 |
| 8 | Diamond painting adultes | 2 | 2 | 2 | 4 | 4 | 4 | 4 | 0,40+0,30+0,30+0,60+0,60+0,40+0,40 = 3,00 | 3,0 |
| 9 | Affiches déco chambre | 2 | 3 | 2 | 3 | 4 | 3 | 4 | 0,40+0,45+0,30+0,45+0,60+0,30+0,40 = 2,90 | 2,9 |
| 10 | Bureau petit espace (sans électronique) | 3 | 2 | 2 | 3 | 4 | 2 | 4 | 0,60+0,30+0,30+0,45+0,60+0,20+0,40 = 2,85 | 2,9 (2,85) |
| 11 | Voyage cabine | 2 | 2 | 2 | 3 | 3 | 2 | 5 | 0,40+0,30+0,30+0,45+0,45+0,20+0,50 = 2,60 | 2,6 |
| 12 | Organiseurs de sac à main | 2 | 2 | 2 | 3 | 3 | 2 | 5 | 0,40+0,30+0,30+0,45+0,45+0,20+0,50 = 2,60 | 2,6 |

Départages :
- Rangs 7 et 8 (3,00) : le rangement passe devant, avec 3 en Demande contre 2.
- Rangs 9 et 10 (2,90 contre 2,85) : pas d'égalité, l'ordre suit le score exact.
- Rangs 11 et 12 (2,60) : égalité complète en Demande, l'ordre est indifférent.

Calculs recomptés ligne par ligne.

### 5.2 Justification de chaque note

**1. Kits déco à assembler pour adultes** (maquettes mécaniques en bois, book nooks sans électronique)
| Critère | Note | Justification | Source |
|---|---|---|---|
| Demande | 4 | Ventes chiffrées sur la catégorie mère : construction +32 % en 2025, marché du jouet record à 4,7 Md€. Sous-segment présent chez plusieurs distributeurs français (Nature & Découvertes, Truffaut, Greenweez, Ludum). Pas de 5 : aucun chiffre propre aux maquettes en bois | [4][8][9][10][12] |
| Tendance | 4 | Part des adultes passée de 26 % (2021) à 33 % (2025) ; construction +31 % sur les 7 premiers mois puis +32 % sur l'année 2025. Provisoire, Google Trends `À VÉRIFIER` | [3][4][5] |
| Concurrence | 3 | Marques fortes (Ugears, Rokr/Robotime, Rolife) mais vendues surtout via marketplaces et généralistes. Sur Nature & Découvertes, la note vendeur affichée est de 1,00 sur 2 avis. Un spécialiste français existe (Ludum) | [8][10][12][13] |
| Marge | 3 | Prix publics de 34 à 91 € (cœur à 37-46 €), donc dans le panier visé. Mais revendre une marque laisse une marge de revendeur, pas un × 3. Coût fournisseur `À VÉRIFIER` | [8][9][10][11][12] |
| Contenu | 5 | Timelapse de l'assemblage puis mécanisme qui tourne : filmable au bureau, mains seules, sans compétence préalable (déduction) | — |
| Récurrence | 4 | Effet collection : 14 modèles Rolife et plusieurs Ugears référencés en France. Accessoires possibles (vitrine anti-poussière) `À VÉRIFIER` | [12][13] |
| Simplicité | 3 | Léger et plat, mais petites pièces (pièce manquante = SAV), statut jouet ambigu (fiche Truffaut : « 14+ » et « 12 ans » en même temps), modèles à LED à exclure | [9][13][33] |

**2. Journaling et papeterie créative pour adultes**
| Critère | Note | Justification | Source |
|---|---|---|---|
| Demande | 3 | Kit bullet journal vendu par Action (extrait, page belge), agenda d'influenceuse en rupture en moins de 48 h (2024). Aucun volume de ventes FR. Les agendas datés reculent de 10 % en 2025 chez un éditeur | [18][20][21] |
| Tendance | 3 | Pinterest : « journal de suivi » +1 264 % (périmètre probablement canadien), « jolis tampons » +105 % (France). Une saison seulement. Provisoire | [15][17] |
| Concurrence | 2 | Action en entrée de gamme (4,98 € le kit, extrait), PaperWrld en haut de gamme, papetiers français établis (Papier Tigre, Season Paper) | [18][21][22] |
| Marge | 3 | Coûts unitaires bas probables, mais prix de référence très bas chez Action : il faut vendre des kits à 25 € et plus. Coût `À VÉRIFIER` | [21] |
| Contenu | 5 | « Plan with me » vu de dessus, ASMR, page blanche puis page décorée : format natif sans visage (déduction) | — |
| Récurrence | 5 | Consommables par nature : stickers, washi, carnets à remplir (déduction) | — |
| Simplicité | 5 | Léger, incassable, sans taille, sans électricité (déduction) | — |

**3. Coin lecture cosy (accessoires de lecture)**
| Critère | Note | Justification | Source |
|---|---|---|---|
| Demande | 2 | Aucun chiffre de ventes. La lecture recule : 18 livres par an en 2025 contre 22 en 2023 | [27][28] |
| Tendance | 3 | Pinterest printemps 2026 : « idées de coin lecture » +245 %, « fauteuil de lecture douillet petits espaces » +455 % (périmètre non précisé). Une saison. Provisoire | [16] |
| Concurrence | 3 | Surtout des artisans, sans marque dominante | [25][26][19] |
| Marge | 4 | Pochettes vendues 21 à 35 € par les artisans, alors qu'un textile rembourré coûte probablement peu (coût `À VÉRIFIER`) | [19][25][26] |
| Contenu | 4 | Mise en scène lit, livre et pochette, avant/après d'un coin de chambre. Moins de « waouh » que les kits (déduction) | — |
| Récurrence | 3 | Effet collection (motifs), ventes croisées marque-pages et repose-livres (déduction) | — |
| Simplicité | 5 | Textile souple, sans taille, incassable | — |

**4. Outils de ménage « reset » sans liquide** : D 3 (hausses Pinterest : « avant/après nettoyage » +60 %, « reset ménage » +60 %, « nettoyage naturel » +545 %, mais pas de ventes FR [16]) ; T 3 (une saison, provisoire [16]) ; C 2 (Action et grandes surfaces à bas prix, déduction `À VÉRIFIER`) ; M 2 (prix de référence très bas, déduction) ; Co 5 (avant/après dans sa propre salle de bain ou cuisine) ; R 4 (microfibres et têtes de brosse de rechange) ; S 4 (léger, robuste).

**5. Correspondance manuscrite** : D 2 (aucune donnée de ventes) ; T 3 (Pinterest Predicts FR : « idées de correspondance » +90 %, « lettres manuscrites » +45 % [15]) ; C 3 (papetiers d'auteur, déduction) ; M 3 ; Co 4 (écriture et cachet à la cire en gros plan ; la cire chauffée demande de la prudence) ; R 3 ; S 5.

**6. Puzzles adultes** : D 3 (catégorie jeux et puzzles estimée à 1,1 Md€ en France en 2025, mais tirée aussi par les cartes à collectionner [4][7]) ; T 3 (+35 % sur les 7 premiers mois de 2025 pour jeux et puzzles réunis [5]) ; C 2 (Ravensburger, Clementoni, Nature & Découvertes, déduction) ; M 3 ; Co 4 (timelapse) ; R 4 (collection) ; S 3 (boîtes d'environ 1 kg, pièces manquantes, déduction).

**7. Rangement sans perçage pour locataires** : D 3 (gamme sans perçage Wenko en GSB [31], articles « locataire » SeLoger [30] ; aucun volume FR) ; T 3 (Pinterest printemps 2026 : « réorganisation de la garde-robe » +140 % [16] ; marché du meuble à -1,8 % en 2025 [32]) ; C 2 (IKEA : boîtes de 1,99 à 14,99 € [29]) ; M 2 (ancrage prix IKEA) ; Co 5 (avant/après) ; R 3 (pièce par pièce) ; S 3 (adhésifs qui lâchent = SAV et litiges, déduction).

**8. Diamond painting** : notes reprises du v1 (D 2, T 2, C 2, M 4, Co 4, R 4, S 4). Aucune donnée nouvelle.

**9. Affiches déco** : D 2 (aucun chiffre FR) ; T 3 (« ma chambre, mes règles » +415 % [16]) ; C 2 (Desenio, Juniqe, IKEA, Etsy, déduction) ; M 3 (impression à la demande, coût `À VÉRIFIER`) ; Co 4 (avant/après d'un mur) ; R 3 (murs de cadres) ; S 4 (tube carton ; cadres en verre exclus). Il faut des visuels originaux (droit d'auteur).

**10. Bureau petit espace** : notes reprises du v1 (D 3 : 18,2 % des salariés télétravaillent au moins un jour par semaine [40] ; T 2 : -0,6 point [40] ; C 2 ; M 3 ; Co 4 ; R 2 ; S 4).

**11. Voyage cabine** : notes reprises du v1 (D 2, T 2, C 2, M 3, Co 3 : on peut faire une valise dans sa chambre, R 2, S 5).

**12. Organiseurs de sac** : D 2 et T 2 (aucune donnée, `À VÉRIFIER`) ; C 2 (offre Amazon abondante, déduction) ; M 3 ; Co 3 ; R 2 ; S 5 (format quasi unique).

## 6. Étage 4 : étude approfondie du top 3

### 6.1 N°1 : kits déco à assembler pour adultes (3,8/5, confiance moyenne)

**Périmètre retenu** : maquettes mécaniques en bois sans moteur ni pile (boîte à bijoux, horloge à remontoir, véhicules, coffres à secrets), et miniatures « book nook » **sans LED**, ou avec LED seulement si le marquage CE et la documentation sont vérifiés.
**Exclus** : fleurs en briques (risque LEGO), modèles à LED, moteur ou boîte à musique électronique non documentés.

**Preuves de demande (faits sourcés)**
1. Le marché français du jeu et du jouet atteint un record de **4,7 Md€ en 2025 (+7,1 %)**. La **construction progresse de 32 %**, et les consommateurs de 12 ans et plus représentent **33 % du chiffre d'affaires (+16 %)**. Source : panel Circana, relayé par Republik Retail le 19/01/2026 [4].
2. La part des « kidultes » est passée de **26 % en 2021 à 33 % en 2025**, soit plus de **1,4 Md€** (Circana). Les 20-55 ans dépensent **près de 200 € par an** en jeux et jouets pour eux-mêmes (étude JuniorCity, janvier 2025). Source : Xerfi, 23/02/2026 [3].
3. Au premier semestre 2025, la construction représente **18 % des ventes de jouets en France** (+31 % depuis le début de l'année), et **deux produits LEGO Botanique figurent dans le top 10** des ventes [5]. La Gazette France (08/12/2025) cite la gamme Botanique en 2e place des licences, et un segment ados-adultes en hausse de 22 % [6]. La source [4] donne +16 % : l'écart vient sans doute de la période ou du périmètre.
4. Le sous-segment « bois mécanique » est distribué en France par Nature & Découvertes, Truffaut, Greenweez, Kaufland et Ludum [8][9][10][11][12].

Ce qui n'est **pas** prouvé : le volume propre aux maquettes en bois ou aux book nooks en France. C'est la raison de la confiance moyenne. Déduction : la demande « adultes qui assemblent un objet déco » est prouvée, mais elle est captée en grande partie par LEGO.

**Concurrents** (prix vus le 2026-11-12)
| Concurrent | Prix constatés | Points forts | Points faibles exploitables (déduction) |
|---|---|---|---|
| Ugears via Nature & Découvertes (vendeurs tiers) | Pick-up Bûcheron, 460 pièces : 72,90 € + 0,89 € de livraison, ou 73,99 € livraison offerte [8] | Marque premium, notoriété | Vendu par des tiers ; note vendeur affichée de 1,00 sur 2 avis ; indisponible en magasin |
| Ugears via Truffaut | Train V-Express, 538 pièces : 90,68 €, **indisponible en ligne** [9] | Enseigne connue | Ruptures ; âge affiché incohérent (14+ et 12 ans) |
| Rokr (Robotime) via Greenweez et Kaufland | Télescope : 37,69 € (Greenweez, en stock) [10]. Coffre au trésor 34,13 €, harpe 47,10 € (Kaufland, **extrait moteur**, page non ouverte) [11] | Gamme large, positionnement « adultes » | Distribution éclatée sur des marketplaces, aucune pédagogie en français visible |
| Ludum.fr (spécialiste FR des puzzles 3D) | Book nook Rolife « Library of Wonders » : 44,90 €, « plus que 3 ex. », 0 avis [12] | Spécialiste, livraison en 24-72 h | Site catalogue, peu de contenu social visible (`À VÉRIFIER`) |
| LEGO Botanique (substitut, pas imitable) | Bouquet de roses 10328 : 49,99 € chez Auchan (**extrait moteur**) [14] | Marque n°1, top des ventes | Prix élevé par rapport au temps de montage ; on ne l'affronte pas sur son terrain |

**Persona**
- **Qui** : d'après JuniorCity (via Xerfi), les plus gros dépensiers parmi les kidultes sont les **hommes de 26 à 35 ans, urbains, de catégorie moyenne supérieure** [3]. Déduction `À VÉRIFIER` : les book nooks visent plutôt des femmes de 20 à 40 ans lectrices.
- **Son problème** (déduction) : décrocher des écrans le soir avec une activité qui produit un résultat visible, à exposer chez soi ou à offrir.
- **Ce qu'il a déjà essayé** (déduction) : LEGO (cher, 49,99 à 109,99 € pour les bouquets [14]), puzzles, jeux vidéo.
- **Ses objections** (déduction) : « trop compliqué », « il manquera une pièce », « ça va casser », « livraison trop longue pour un cadeau ».
- **Où il passe du temps en ligne** (déduction, `À VÉRIFIER`) : YouTube (montages longs), TikTok et Shorts (timelapses), Pinterest (déco), Reddit.

**Angle de différenciation (déduction)** : être **le guide français du « premier kit »**, pas un catalogue.
- Une sélection classée par **temps de montage et difficulté** (« niveau 1 : une soirée »).
- Une fiche « ce que vous aurez à la fin » avec la place dans la maison.
- Des vidéos courtes des étapes difficiles.
- Une politique claire sur les pièces manquantes, avec un fournisseur à entrepôt UE.
- Un positionnement **cadeau** (« pour quelqu'un qui a déjà tout »).

Les concurrents (marketplaces, généralistes) vendent une boîte, sans accompagnement.

**3 produits phares possibles** (fourchettes constatées chez les concurrents)
1. Maquette mécanique d'entrée de gamme (coffre à secrets, petit véhicule, télescope) : 34,13 à 37,69 € [10][11].
2. Book nook sans électronique, ou avec LED si conformité vérifiée : 43,99 à 44,90 € [12][13].
3. Maquette « pièce maîtresse » (horloge à remontoir, véhicule de 460 pièces et plus) : 72,90 à 90,68 € [8][9], au-dessus du panier visé, à réserver pour les packs cadeaux.

**Marge** : pour vendre 40 € avec la règle du × 3, il faut un coût produit + livraison ≤ 13,30 €. C'est **peu probable avec des produits de marque** au prix revendeur (déduction), et plus plausible avec des modèles génériques **à design original** (`À VÉRIFIER` par `sourcing-produits`). Si la règle du × 3 est intenable, l'humain devra décider d'accepter une marge plus faible pour cette niche.

**Risques et parades**
- **Statut jouet** : un produit conçu pour le jeu d'enfants de moins de 14 ans relève de la directive jouets [33]. Plusieurs fiches affichent « 14+ », mais Nature & Découvertes écrit « ou plus jeune avec l'aide d'un adulte » [13], et Truffaut mentionne 12 ans [9]. Parades : ne retenir que des produits avec marquage CE et documentation, positionnement exclusivement adulte, validation par `conformite-qa`.
- **Électronique** : le book nook Rolife de Nature & Découvertes a des LED sur 2 piles AAA [13]. Parade : modèles sans électronique, ou conformité CE vérifiée.
- **Contrefaçon** : ne jamais vendre de copies de modèles Ugears, Rokr ou LEGO. Deux options seulement : revendre des produits authentiques via un canal autorisé (`À VÉRIFIER`), ou des modèles génériques à design original.
- **GPSR** : il faut un opérateur économique établi dans l'UE et des avertissements (petites pièces) [34].
- **SAV « pièces manquantes »** : choisir un fournisseur qui envoie les pièces de rechange (`À VÉRIFIER`).
- **Délais** : sans date annoncée, le délai légal par défaut est de 30 jours (art. L216-1 du Code de la consommation, `À VÉRIFIER` sur Légifrance). Préférer un entrepôt UE (Ludum livre en 24-72 h [12], ce qui montre le niveau d'attente du marché).

**Saisonnalité** (déduction, `À VÉRIFIER` dans Google Trends) : le marché du jouet est concentré sur le 4e trimestre. Nous sommes le 12/11/2026 : trop tard pour un lancement fiable avant Noël 2026 (boutique non construite, délais). Recommandation :
- tourner le contenu dès que le premier kit est disponible ;
- **lancer fin janvier 2027** (activité anti-écran de début d'année, cadeaux de Saint-Valentin et de fête des pères) ;
- préparer le pic de **septembre à décembre 2027**.

**3 idées de vidéos tournables seul, chez soi, avec le produit**
1. **« 4 heures en 30 secondes »** : caméra fixée au-dessus du bureau, timelapse des planches de bois jusqu'à l'objet fini. Dernier plan en temps réel : le mécanisme tourne pour la première fois. Texte à l'écran : temps réel, nombre de pièces, niveau.
2. **« Une étape par soir »** : une série en épisodes. Gros plan sur les mains, son ASMR des pièces qu'on détache et qu'on emboîte, voix off qui donne une astuce par épisode (« 3 erreurs du débutant »).
3. **Avant/après étagère** : une étagère vide de la chambre, puis la même avec le book nook glissé entre les livres. Lumière tamisée, zoom lent dans le diorama. Le format est adapté à Pinterest et aux Shorts.

### 6.2 N°2 : journaling et papeterie créative pour adultes (3,6/5, confiance faible)

**Preuves de demande**
1. Le kit bullet journal d'Action (33 pièces, dont 10 feutres double pointe) est vendu 4,98 €. Il s'agit de la page **belge**, lue dans l'**extrait du moteur de recherche**, la page ayant répondu HTTP 403. La présence en France est `À VÉRIFIER` [21].
2. L'agenda « Rise&Shine » de l'influenceuse Lénadorable a été en rupture moins de 48 h après sa mise en ligne en 2024, selon l'**extrait** de l'article [20]. Son journal A5 se vend 20 € (avril 2025) [19]. Aucun chiffre de ventes n'est publié.
3. Pinterest :
   - « journal de suivi » +1 264 %, « journal de lecture » +482 % (rapport loisirs d'août 2026, **page fr-ca**, donc périmètre probablement canadien) [17] ;
   - « jolis tampons » +105 %, « idées de correspondance » +90 % (Predicts 2026, France) [15].
4. Signal contraire : un éditeur indique un recul de 10 % de ses agendas datés en 2025 [18]. Les fournitures scolaires progressent de 3 % en volume à la rentrée 2025 (NielsenIQ, **extrait**) [23], mais ce n'est pas la papeterie créative.

Confiance **faible** : aucune preuve de ventes en France sur le journaling lui-même. C'est le même niveau de preuve que le crochet, mais avec un contenu et une récurrence supérieurs. Il faut une vérification Google Trends **avant** tout engagement.

**Concurrents**
| Concurrent | Prix constatés | Points forts | Points faibles exploitables (déduction) |
|---|---|---|---|
| Action | Kit bullet journal 4,98 € (fr-be, extrait moteur, vu le 2026-11-12) [21] | Prix imbattable, trafic en magasin | Aucun accompagnement, qualité basique |
| PaperWrld | Mini kit de journaling vintage 78,99 € au lieu de 86,99 € ; lot de 12 washi 12,13 € (extraits moteur ; pages en HTTP 429 ; URL produit exacte `À VÉRIFIER`) [22] | Esthétique forte, boîtes thématiques | Prix élevé : un créneau 25-40 € reste libre (déduction) |
| Rise&Shine (Lénadorable) | Journal A5 20 € (prix d'avril 2025, non revu) [19] | Communauté d'influenceuse | Produit unique, dépendant d'une personne |
| Papier Tigre, Season Paper | `À VÉRIFIER` [18] | Marques françaises reconnues | Positionnement carnet plutôt que kit |

**Persona** (déduction, `À VÉRIFIER`) : une étudiante ou jeune active de 18 à 30 ans qui veut une routine d'organisation sans appli et un moment calme sans écran.
- Ce qu'elle a déjà essayé : les applis, un kit Action, des carnets abandonnés au bout de deux semaines.
- Ses objections : « je ne sais pas dessiner », « je n'ai pas le temps », « mes pages sont moches ».
- Où elle passe du temps : Pinterest, TikTok, YouTube.

**Angle de différenciation (déduction)** : des **kits « zéro talent requis »** par thème et par mois, avec des gabarits et stickers prêts à coller. On vend « une jolie page en 10 minutes », entre Action (bas de gamme) et PaperWrld (cher).

**3 produits phares possibles**
1. Kit de démarrage (carnet pointillé, washi, stickers, gabarits) : de 4,98 € (Action) à 78,99 € (PaperWrld) chez les concurrents [21][22]. Cible : 25-35 € (déduction).
2. Lots de washi tape thématiques : 12,13 € les 12 chez PaperWrld [22].
3. Recharges mensuelles de stickers et gabarits par saison : prix `À VÉRIFIER`.

**Risques et parades**
- Guerre des prix avec Action. Parade : on vend un **système** (kit, contenu, recharges), pas des articles à l'unité.
- Propriété intellectuelle : pas de personnages sous licence sur les stickers.
- Panier faible. Parade : kits et packs pour atteindre 25 € et plus.
- Feutres et encres : conformité `À VÉRIFIER` par `conformite-qa`.

**Saisonnalité** (déduction, `À VÉRIFIER`) : janvier (nouvelle année, bonnes résolutions) et septembre (rentrée). Lancement conseillé : début janvier 2027.

**3 idées de vidéos tournables seul, chez soi**
1. **« Plan with me » de la semaine** : vue de dessus, mains seules, ASMR de la washi qu'on déchire, timelapse de la page blanche à la page finie.
2. **« Reset du dimanche »** : un rituel de 60 secondes (bougie éteinte en déco, thé, carnet), avec la checklist de la semaine à l'écran. Ce format reprend la tendance Pinterest « checklist reset du dimanche » (+65 % [16]).
3. **« Je ne sais pas dessiner : 3 pages en 10 minutes avec un seul kit »** : démonstration avec un chronomètre à l'écran.

### 6.3 N°3 : coin lecture cosy, accessoires de lecture (3,3/5, confiance faible)

**Preuves de demande**
1. Pinterest printemps 2026 : « idées de coin lecture » +245 %, « fauteuil de lecture douillet petits espaces » +455 %, « coin lecture pour adultes placard » +55 %. Le périmètre géographique n'est pas précisé [16].
2. Des artisans français vendent des pochettes à livre de 21 à 35 € [19][25][26]. Le marché existe, mais il n'est pas chiffré.
3. Signal contraire : les Français lisent moins (18 livres par an en 2025 contre 22 en 2023, baromètre CNL [27]), et la lecture recule chez les jeunes [28].

Confiance **faible**. Si Google Trends ne montre pas mieux que « kit crochet », cette niche doit céder sa place au n°4 (outils de ménage « reset »).

**Concurrents**
| Concurrent | Prix constatés (vus le 2026-11-12) | Points forts | Points faibles exploitables (déduction) |
|---|---|---|---|
| Maron Bouillie (via Marques de France) | Pochette « Vélo Orange » : 35 €, prix indicatif, stock non affiché [25] | Visuels photo, fabrication française | Prix élevé, vente sur un site externe |
| Pochette Nomade (Paris Friendly) | 25 à 29 € selon le modèle [26] | Laine bio, coton déperlant, fabrication française | Gamme étroite |
| La Fabrique de Marie | Pochette seule 21 €, pack avec agenda 46 € (avril 2025) [19] | Collaboration avec une influenceuse | Petite capacité artisanale |
| Etsy (vendeurs multiples) | `À VÉRIFIER` | Choix énorme | Expérience hétérogène |

**Persona** (déduction, `À VÉRIFIER`) : une femme de 20 à 35 ans, lectrice « BookTok », qui transporte ses livres et veut les protéger.
- Ce qu'elle cherche : un coin lecture photogénique dans une petite chambre.
- Ses objections : « c'est juste un bout de tissu », le prix face à l'artisanat français.

**Angle de différenciation (déduction)** : le **« kit coin lecture »** (pochette, marque-pages, repose-livre) assorti par ambiance. Les artisans vendent une pièce, pas une ambiance. Attention : face au « fabriqué en France » des concurrents, un produit de dropshipping importé devra se battre sur le design et le prix, pas sur l'origine.

**3 produits phares possibles**
1. Pochette à livre rembourrée : 21 à 35 € chez les concurrents [19][25][26].
2. Lot de marque-pages (aimantés ou en tissu) : prix `À VÉRIFIER`.
3. Repose-livre ou serre-livres en bois : prix `À VÉRIFIER`. Les lampes de lecture sont exclues (produit électrique).

**Risques et parades**
- Demande non prouvée : vérifier Google Trends d'abord.
- Étiquetage de la composition textile (règlement UE 1007/2011) : `À VÉRIFIER` par `conformite-qa`.
- Panier faible : vendre en kits.

**Saisonnalité** (déduction) : automne-hiver (cocooning) et cadeaux de fin d'année. Lancement possible en septembre 2027 si la niche est retenue.

**3 idées de vidéos tournables seul, chez soi**
1. **« Un coin de chambre devient un coin lecture avec 3 objets »** : avant/après en plan fixe.
2. **« Ce qu'il y a dans mon sac de lecture »** : mains seules, le livre qui glisse dans la pochette, son ASMR du tissu.
3. **« Lecture du mois »** : le livre posé sur le repose-livre, la pochette assortie, le titre et l'ambiance en texte à l'écran. C'est un format récurrent.

## 7. Recommandation finale et décisions humaines

**Lancer en premier : les kits déco à assembler pour adultes (3,8/5, confiance moyenne).**
Pourquoi :
1. C'est la seule niche du classement dont la demande est prouvée par des **ventes** en France, avec plusieurs années de croissance : construction +32 % en 2025, adultes passés de 26 % à 33 % du marché entre 2021 et 2025 (Circana) [3][4].
2. C'est le contenu le plus compatible avec « seul, chez soi, avec le produit » : un bureau, deux mains, un objet qui prend vie. Aucune compétence préalable n'est requise.
3. Les concurrents directs sont des marketplaces et des généralistes sans accompagnement, ce qui laisse une place au « guide du premier kit ».

Sa faiblesse : la marge, si l'on revend des marques. La niche n'est viable qu'avec des modèles génériques à design original, ou en acceptant une marge inférieure au × 3. C'est le premier chiffrage à demander à `sourcing-produits`.
Plan B : le journaling (contenu et récurrence excellents, demande à prouver).

**Décisions à prendre par l'humain**
1. **Valider la niche n°1**, ou demander d'abord les vérifications Google Trends de la section 8.
2. **Budget échantillons** : il faut au moins **un kit physique** pour tourner (de 34 à 45 € pour un modèle d'entrée de gamme [10][11][12]). La contrainte « 0 € » bloque toute production de contenu, quelle que soit la niche. Décider d'un petit budget, ou d'une demande d'échantillon gratuit auprès d'un fournisseur (`À VÉRIFIER`).
3. **Autoriser `sourcing-produits`** à chiffrer, puis à filtrer selon les critères suivants :
   - coût et livraison de kits génériques à design original et de kits de marque (canal revendeur autorisé ?) ;
   - entrepôt UE ;
   - opérateur responsable UE (GPSR) et marquage CE ;
   - envoi des pièces de rechange.
4. **Accepter ou non une marge inférieure au × 3** si les kits de marque sont la seule offre de qualité.
5. Confirmer que l'humain n'a **pas** de buanderie (niche 10 éliminée sur cette hypothèse) : sans impact sur le top 3.
6. Après validation, l'orchestrateur pourra proposer le contenu de `knowledge/niche.md` et `knowledge/persona.md`. Je ne modifie pas `knowledge/`.

**Canal à étudier en phase 3** : TikTok Shop, ouvert en France depuis le 31/03/2025 [36] (repris du v1). Il colle bien aux timelapses d'assemblage (déduction).

## 8. Vérifications à faire par l'humain

**Google Trends** (France, 5 dernières années, catégorie « Toutes catégories », recherche Web puis YouTube). Le crochet a été écarté pour demande trop faible : **« kit crochet » sert donc de référence**. Une niche dont les requêtes restent sous « kit crochet » doit être rétrogradée.

| Niche | Requêtes à comparer (jusqu'à 5 par graphique) | Ce qu'on attend |
|---|---|---|
| N°1 kits | « puzzle 3d bois », « maquette bois », « book nook », « ugears », « kit crochet » | Au-dessus de « kit crochet », courbe stable ou en hausse hors pics de Noël |
| N°1 (bis) | « rokr », « maquette en bois adulte », « puzzle 3d », « kit crochet » | Idem |
| N°2 journaling | « bullet journal », « washi tape », « journaling », « stickers journal », « kit crochet » | Au-dessus de « kit crochet », pic de janvier qui revient chaque année |
| N°3 coin lecture | « pochette livre », « coin lecture », « serre livre », « marque page », « kit crochet » | Au moins au niveau de « kit crochet », sinon remplacer par le n°4 |
| N°4 (remplaçant) | « brosse nettoyage », « raclette douche », « chiffon microfibre », « kit crochet » | Idem |

Les notes Tendance du tableau 5.1 seront à corriger d'après ces courbes.

**Autres vérifications**
- Amazon.fr, catégorie « Puzzles 3D » : relever le classement des meilleures ventes et les prix (la page a répondu HTTP 503 à l'agent).
- Action.fr : le kit bullet journal est-il vendu en France, et à quel prix ?
- Prix exacts de PaperWrld (pages en HTTP 429 pour l'agent).
- Article L216-1 du Code de la consommation (délai de livraison par défaut) sur Légifrance.

## 9. Sources (consultées le 2026-11-12 sauf mention)

1. `knowledge/contraintes.md` (interne)
2. Rapport v1 : `outputs/2026-11-12-analyste-marche-top3-niches.md` (interne)
3. Xerfi, « Les kidultes tirent la croissance du marché des jeux et jouets », 23/02/2026 (Circana, JuniorCity) : https://www.xerfi.com/blog/les-kidultes-tirent-la-croissance-du-marche-des-jeux-et-jouets_2396
4. Republik Retail, « Jeux et jouets : pourquoi le marché français signe une année record en 2025 », 19/01/2026 (panel Circana) : https://www.republik-retail.fr/strategie-retail/enseignes/pratiques/jeux-et-jouets-pourquoi-le-marche-francais-signe-une-annee-record-en-2025.html (redirigé vers https://www.republikgroup.com/articles/eccb9913-b7b2-f111-a6a7-6045bd9f5987/)
5. Global Toy News, « Update From the French Toy Industry – First Half 2025 », 02/10/2025 : https://globaltoynews.com/2025/10/02/update-from-the-french-toy-industry-first-half-2025/
6. La Gazette France, bilan de la filière jouet, 08/12/2025 (bilan arrêté au 16/11/2025) : https://www.lagazettefrance.fr/article/les-bons-plans-de-la-filiere-jouet-vers-une-annee-record
7. Toute la Franchise, chiffres du marché du jouet, mis à jour le 08/12/2025 : https://www.toute-la-franchise.com/vie-de-la-franchise-A32954-marche-jouet-tendances-chiffres-noel.html
8. Nature & Découvertes, Ugears Pick-up Bûcheron : https://www.natureetdecouvertes.com/enfant/jeux-construction/maquettes/pick-up-bucheron-puzzle-3d-bois-98646790
9. Truffaut, Ugears train à vapeur V-Express : https://www.truffaut.com/maquette-en-bois-3d-train-a-vapeur.html
10. Greenweez, marque Rokr : https://www.greenweez.com/marque/rokr
11. Kaufland.fr, Rokr (prix lus dans l'extrait du moteur de recherche, page en HTTP 403) : https://www.kaufland.fr/product/543237234/
12. Ludum, book nook Rolife « Library of Wonders » : https://www.ludum.fr/puzzles-3d/book-nook-rolife-library-of-wonders-258-pieces-15184
13. Nature & Découvertes, Rolife « Coin de lecture silencieux » : https://www.natureetdecouvertes.com/enfant/jeux-construction/jeux-mecanique/coin-de-lecture-silencieux-93239730
14. Auchan, LEGO Botanicals 10328 (prix lu dans l'extrait du moteur de recherche) : https://www.auchan.fr/lego-lego-botanicals-10328-le-bouquet-de-roses-set-de-fleurs-artificielles-cadeau-adulte/pr-C1768975
15. Pinterest Newsroom FR, Pinterest Predicts 2026 (publié le 09/12/2025) : https://newsroom.pinterest.com/fr/news/pinterest-predicts-nonconformity-self-preservation-and-escapism-drive-21-trends-for-2026/
16. Pinterest Newsroom FR, rapport de tendances printemps 2026 (17/03/2026, périmètre géographique non précisé) : https://newsroom.pinterest.com/fr/news/spring-trend-report-2026/
17. Pinterest Newsroom fr-ca, rapport loisirs 2026 (25/08/2026, périmètre probablement canadien) : https://newsroom.pinterest.com/fr-ca/news/2026-pinterest-hobbies-trend-report/
18. Livres Hebdo, « La papeterie, nouveau relais de croissance pour le monde du livre », 20/08/2026 : https://www.livreshebdo.fr/article/la-papeterie-nouveau-relais-de-croissance-pour-le-monde-du-livre
19. Gens d'Internet, journal Rise&Shine de Lénadorable et pochette La Fabrique de Marie, 25/04/2025 : https://gensdinternet.fr/2025/04/25/apres-lagenda-linfluenceuse-lenadorable-devoile-son-journal-avec-sa-methode-riseshine/
20. Gens d'Internet, agenda Rise&Shine, 18/01/2024 (rupture en moins de 48 h, lue dans l'extrait du moteur de recherche) : https://gensdinternet.fr/2024/01/18/avec-son-agenda-riseshine-lenadorable-partage-ses-conseils-en-organisation
21. Action (Belgique), kit bullet journal 4,98 € (extrait du moteur de recherche, page en HTTP 403) : https://www.action.com/fr-be/p/3218376/kit-bullet-journal/
22. PaperWrld (extraits du moteur de recherche, pages en HTTP 429 ; URL produit exacte du mini kit `À VÉRIFIER`) : https://paperwrld.com/fr-fr/products/letter-from-flowers-vintage-scrapbooking-box
23. LSA, rentrée scolaire 2025 (NielsenIQ pour l'AIPB, extrait du moteur de recherche) : https://www.lsa-conso.fr/rentree-scolaire-2025-le-marche-des-fournitures-scolaires-renoue-avec-la-croissance,461935
24. Livres Hebdo, agendas scolaires (1,17 M d'exemplaires en 2021, extrait du moteur de recherche, cité pour le contexte) : https://www.livreshebdo.fr/article/agendas-scolaires-pour-les-editeurs-un-marche-qui-arrive-maturation
25. Marques de France, pochette à livre Maron Bouillie : https://www.marques-de-france.fr/produit/pochette-a-livre-paris-velo-orange/
26. Paris Friendly, Pochette Nomade : https://www.paris-friendly.fr/pochette-a-livre-made-in-france.html
27. Livres Hebdo, baromètre CNL 2025 (repris du v1) : https://www.livreshebdo.fr/article/les-francais-lisent-de-moins-en-moins-selon-le-barometre-2025-les-francais-et-la-lecture
28. CNL, « Les jeunes Français et la lecture » 2026 (repris du v1) : https://centrenationaldulivre.fr/sites/default/files/2026-04/%C3%89tude%202026%20-%20Les%20jeunes%20Fran%C3%A7ais%20et%20la%20lecture%20-%20Communiqu%C3%A9%20de%20presse.pdf
29. IKEA France, boîtes et paniers : https://www.ikea.com/fr/fr/cat/boites-et-paniers-10550/
30. SeLoger, « Locataire : 8 solutions pour aménager sans percer » : https://edito.seloger.com/materiaux-equipements/travaux/locataire-8-solutions-amenager-logement-percer-murs-article-23350
31. Bricomarché, étagère Wenko Turbo-Loc (extrait du moteur de recherche, page en HTTP 403) : https://www.bricomarche.com/p/etagere-d-angle-2-niveaux-turbo-loc/4008838189146
32. Ameublement français, dossier de presse 2026 (meuble -1,8 % en 2025, extrait du moteur de recherche) : https://www.ameublement.com/uploads/attachments/confrence-ameublement-26---dossier-de-presse-v30012026.pdf
33. Directive 2009/48/CE, sécurité des jouets (repris du v1) : https://eur-lex.europa.eu/eli/dir/2009/48/2022-12-05
34. GPSR, règlement (UE) 2023/988 et lignes directrices (repris du v1) : https://donneespersonnelles.fr/gpsr ; https://eur-lex.europa.eu/eli/C/2025/6233/oj/eng
35. Ecommerce Nation, bilan FEVAD 2025 (panier moyen de 62 €, repris du v1) : https://www.ecommerce-nation.fr/bilan-ecommerce-2025-196-milliards-baisse-panier-moyen/
36. TikTok Shop France (repris du v1) : https://www.ecommerce-nation.fr/six-mois-apres-son-lancement-en-france-tiktok-shop-seduit-deja-plus-de-16-000-marchands/
37. Google Trends (tentative, HTTP 429, non utilisé) : https://trends.google.com/trends/explore?date=today%205-y&geo=FR
38. Amazon.fr Meilleures ventes et Mouvers & Shakers (tentatives, HTTP 503, non utilisés) : https://www.amazon.fr/gp/bestsellers/ , https://www.amazon.fr/gp/movers-and-shakers/
39. Ugears, site officiel (tentative, HTTP 429, non utilisé) : https://ugearsmodels.com/fr/products/treasure-box
40. INSEE Première n° 2044, télétravail 2024 (repris du v1) : https://www.insee.fr/fr/statistiques/fichier/8391807/IP2044.pdf
41. Estimations diamond painting (repris du v1) : https://www.datamintelligence.com/research-report/diamond-art-painting-market
