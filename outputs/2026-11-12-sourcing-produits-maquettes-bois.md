---
agent: sourcing-produits
statut: à-valider   # doit passer par conformite-qa, puis validation humaine
date: 2026-11-12
sources: [CLAUDE.md, docs/architecture.md, knowledge/README.md, knowledge/niche.md, knowledge/contraintes.md, outputs/2026-11-12-analyste-marche-top3-niches-v3.md, outputs/2026-11-12-analyste-marche-top3-niches.md, sources web en section 9]
prochaine-etape: conformite-qa
---

# Sourcing : maquettes en bois à assembler pour adultes, sélection de départ

> Document interne d'aide à la décision, pas un livrable public. Les noms de marques y figurent **uniquement pour l'analyse** (repérer les copies, comparer les prix). Ils ne doivent apparaître dans aucun texte de la boutique.
> `knowledge/marque.md`, `knowledge/politiques.md` et `knowledge/prix-et-marges.md` n'existent pas encore : les règles par défaut de l'agent sont appliquées, et une proposition de `prix-et-marges.md` figure en section 7.

## 1. Résumé décisionnel

**Le constat d'abord : aucun produit ne passe tous les filtres de façon vérifiée.** Trois raisons :
1. **Les fiches produit AliExpress sont illisibles pour l'agent.** Elles ne renvoient que la navigation du site. Seules les pages de résultats de recherche sont lisibles : prix, nombre de ventes, note. Il manque donc la note et l'ancienneté du vendeur, l'entrepôt, le délai, l'âge indiqué, les infos GPSR, les avis avec photos et la comparaison visuelle avec les catalogues de marque. Tout cela est `À VÉRIFIER`.
2. **Les droits et frais de douane rognent la marge.** Depuis le 1er juillet 2026, un droit de douane de 3 € s'applique par catégorie d'article pour les envois de 150 € ou moins venant de pays hors UE. Depuis le 1er novembre 2026, il s'y ajoute 2 € de frais de traitement [D1][D2]. En dropshipping depuis la Chine, cela fait **jusqu'à 5 € de plus par commande**, sauf s'ils sont déjà inclus dans le prix payé (`À VÉRIFIER` au paiement).
3. **Ce qui se vend sur AliExpress, c'est surtout la marque leader, ou des modèles qui lui ressemblent.** Sur 9 recherches, la majorité des annonces sont de la marque Robotime / Rokr / Rolife, vendue à peu près au prix public français, donc avec un coefficient de 1 à 1,5. Les petits kits génériques très vendus (5 à 12 €) ressemblent souvent à la gamme « classique » de cette marque. Exemple : la « voiture vintage 164 pièces » est revendue 12,90 à 22,99 € en Europe sous la marque [C10][C11].

**Présélection conditionnelle** : 3 produits. Ils sont à confirmer par l'humain en ouvrant les annonces (checklist en section 8, environ 15 minutes, sans contacter personne).

| Rang | Produit (description générique) | Achat (2026-11-12) | Prix de vente conseillé | Marge nette / commande | Coefficient | Note /10 | Statut |
|---|---|---|---|---|---|---|---|
| 1 | Puzzle mécanique en spirale à billes (manivelle) | 7,19 € | 26,90 € | **12,25 €** (livraison `À VÉRIFIER`) | 3,74 | **6,9** | Conforme aux règles **si** les vérifications passent |
| 2 | Locomotive à vapeur avec pont ferroviaire | 11,44 € | 27,90 € | **8,92 €** | 2,44 | **5,2** | **Exception à valider** (marge < 10 €, coefficient < 2,5) |
| 3 | Maison dans les arbres miniature (déco) | 9,71 € | 24,90 € | **7,89 €** (livraison `À VÉRIFIER`) | 2,56 | **4,6** | **Exception à valider** (prix < 25 €, marge < 10 €) |

- **Marge nette moyenne** : (12,25 + 8,92 + 7,89) / 3 = **9,69 €**. C'est le scénario prudent, avec 5 € de droits et frais de douane comptés à chaque commande. S'ils sont déjà inclus dans le prix AliExpress (mention « frais de douanes offerts » sur certaines annonces), la marge monte de 5 € par commande.
- **Niveau de confiance : faible.** Les données vendeur, la qualité, l'âge, l'originalité et le GPSR n'ont pas été vérifiés.
- **Recommandation** : vérifier en priorité le **n°1**, qui est le seul à tenir les règles par défaut. Les n°2 et n°3 ne valent que si l'humain accepte des exceptions. Si le n°1 échoue aux vérifications, voir les pistes de la section 8 : fournisseur européen avec stock, règles assouplies ou plan B.

## 2. Hypothèses

| Sujet | Valeur retenue | Origine |
|---|---|---|
| Prix fournisseur | Prix affiché sur fr.aliexpress.com le 2026-11-12, supposé TTC (TVA à l'import perçue par AliExpress via IOSS sous 150 €) | Page de recherche. Inclusion de la TVA **`À VÉRIFIER`** au paiement |
| Livraison | 0 € si l'annonce indique « Livraison gratuite » ou si le prix dépasse 10 € avec « Livraison gratuite dès 10 € ». Sinon **`À VÉRIFIER`** | Pages de recherche AliExpress |
| Délai vers la France | **`À VÉRIFIER`** par annonce. Sources non officielles : 7 à 15 jours pour l'offre « Choice », 15 à 45 jours hors Choice [S9] | Pas de source officielle trouvée |
| Droits et frais de douane | **5,00 € par commande** (3 € de droit et 2 € de frais de traitement, une seule catégorie d'article), à compter seulement pour les envois hors UE. Peut-être déjà inclus (« frais de douanes offerts ») : **`À VÉRIFIER`** | [D1][D2] |
| Frais de paiement | **`À VÉRIFIER`** (plateforme non choisie). Hypothèse : 3 % du prix de vente + 0,30 € | Règle par défaut |
| Provision SAV / casse | 5 % du prix de vente | Règle par défaut |
| TVA sur nos ventes | Hypothèse de **franchise en base de TVA** (micro-entreprise) : pas de TVA collectée, TVA d'import non récupérable. Statut **`À VÉRIFIER`**. Si la boutique est assujettie, la marge baisse d'environ prix de vente ÷ 6 moins la TVA d'import récupérée, soit environ −3 € sur le n°1 | Statut juridique absent de `knowledge/` |
| Acquisition | 0 € (contenu organique seulement, `contraintes.md`). Le coût en temps n'est pas chiffré. Le coût par commande en publicité payante est **`À VÉRIFIER`** quand un budget existera | `knowledge/contraintes.md` |
| Retours (rétractation de 14 jours) | Couverts par la provision SAV de 5 %. Le coût d'un retour vers la Chine est **`À VÉRIFIER`** : la politique de retour reste à écrire (`politiques.md` absent) | — |
| Seuils de fiabilité | Note ≥ 4,6, ancienneté ≥ 1 an, ≥ 100 ventes. **Adaptation signalée** : seuls la note et les ventes **de l'annonce** sont visibles, donc ils servent de critère provisoire. La note et l'ancienneté de la boutique restent `À VÉRIFIER` | Règle par défaut, adaptée |
| Règles de marge | Coefficient ≥ 2,5, marge nette ≥ 10 €, prix de vente entre 25 et 60 € | Règle par défaut |

## 3. Candidats (36 annonces relevées le 2026-11-12)

URL d'une annonce : `https://fr.aliexpress.com/item/<ID>.html`. Pages de recherche : [A1] à [A13]. « Ventes » et « Note » sont les valeurs affichées sur l'annonce, pas sur la boutique.

| # | Produit (résumé) | Sous-catégorie | ID annonce | Prix | Ventes | Note | Marque (titre) | Recherche | Décision |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Puzzle mécanique en spirale à billes, « adultes et adolescents » | Mécanique | 1005006030347254 | 7,19 € | 5 000+ | 4,7 | — | A12 | **Retenu (n°1)** |
| 2 | Puzzle en spirale à billes (même type) | Mécanique | 1005006994244114 | 8,13 € | 5 000+ | 4,9 | — | A7, A13 | **Secours du n°1** |
| 3 | Locomotive à vapeur avec pont ferroviaire | Véhicules | 1005007535078456 | 11,44 € | 1 000+ | 4,7 | Ury | A5, A6 | **Retenu (n°2)** |
| 4 | Locomotive, modèle à l'échelle | Véhicules | 1005007039632379 | 10,44 € | 900+ | 4,9 | — | A5 | **Secours du n°2** |
| 5 | Maison dans les arbres à assembler | Miniatures déco | 1005010688762060 | 9,71 € | 800+ | 4,6 | — | A12 | **Retenu (n°3)** |
| 6 | Harpe mécanique AMK71 | Mécanique | 1005013158560264 | 35,19 € | 210 | 5 | Robotime | A1, A2 | Éliminé |
| 7 | Usine à café cinétique | Mécanique | 1005012910429712 | 52,39 € | 1 000+ | 5 | Robotime | A1 | Éliminé |
| 8 | Horloge à coucou mécanique | Mécanique | 1005012873098546 | 46,99 € | 1 000+ | 4,9 | Rokr | A3 | Éliminé |
| 9 | Bateau (kit) | Véhicules | 1005012865757933 | 32,39 € | 1 000+ | 4,9 | Rokr | A8 | Éliminé |
| 10 | Boîte à musique « Dream Gift Factory » | Mécanique | 1005008158905544 | 55,39 € | 872 | 4,9 | Rokr | A4 | Éliminé |
| 11 | Ruelle japonaise miniature | Miniatures déco | 1005012297137600 | 41,39 € | 1 000+ | 4,9 | Robotime | A9 | Éliminé |
| 12 | Coin d'étude « book nook » | Miniatures déco | 1005012297209339 | 35,39 € | 297 | 4,9 | Rolife | A9 | Éliminé |
| 13 | Book nook « café magique rétro » | Miniatures déco | 1005009110761269 | 44,59 € | 21 | 4,4 | — | A9 | Éliminé |
| 14 | Book nook avec LED | Miniatures déco | 1005012359831027 | 35,59 € | 1 | — | Cutebee | A9 | Éliminé |
| 15 | Boutique de wagashi miniature | Miniatures déco | 1005012939967276 | 34,99 € | 20 | 4,9 | — | A9 | Éliminé |
| 16 | Voiture 3D, modèle à l'échelle | Véhicules | 1005006995419017 | 8,39 € | 3 000+ | 4,9 | — | A12 | Éliminé |
| 17 | Voiture 3D (même gamme) | Véhicules | 1005006741122308 | 7,79 € | 2 000+ | 4,7 | — | A3 | Éliminé |
| 18 | Voiture « dirigeable » 3D | Véhicules | 1005006907412784 | 5,89 € | 2 000+ | 4,7 | — | A3 | Éliminé |
| 19 | Voiture 3D (même gamme) | Véhicules | 1005007257377918 | 9,33 € | 116 | 4,7 | — | A4 | Éliminé |
| 20 | Calendrier perpétuel et porte-stylo, « Age 14+ » | Mécanique | 1005006029228705 | 6,16 € | 700+ | 4,7 | — | A12 | Éliminé |
| 21 | Boîte au trésor à monter | Mécanique | 1005008634188743 | 12,03 € | 500+ | 4,8 | — | A12 | Éliminé |
| 22 | Coffre-fort mécanique 3D | Mécanique | 1005013228495562 | 11,40 € | 12 | — | — | A6 | Éliminé |
| 23 | Boîte secrète vintage (objet fini) | Déco | 1005010386035496 | 4,87 € | 800+ | 4,7 | — | A6 | Éliminé |
| 24 | Robot « mangeur de pièces » STEM | Mécanique | 1005007344982513 | 7,79 € | 5 000+ | 4,9 | — | A13 | Éliminé |
| 25 | Petite voiture de course télécommandée en bois | Véhicules | 1005009497738088 | 19,76 € | 3 000+ | 4,8 | — | A13 | Éliminé |
| 26 | Circuit de billes « électrique » avec catapulte | Mécanique | 1005009120970954 | 33,03 € | 2 000+ | 4,7 | Ury | A13 | Éliminé |
| 27 | Circuit de billes à chaîne | Mécanique | 1005010184864167 | 35,19 € | 150 | 4,7 | Ury | A10 | Éliminé |
| 28 | Kit de piste à billes mécanique | Mécanique | 1005010632660873 | 25,79 € | 24 | 5 | — | A10 | Éliminé |
| 29 | Moulin à vent hollandais | Architecture | 1005010763754423 | 13,77 € | 58 | 4,5 | — | A11 | Éliminé |
| 30 | Maison à éolienne solaire « pour enfants » | Architecture | 1005010529942912 | 7,59 € | 626 | 4,9 | — | A11 | Éliminé |
| 31 | Pont de Londres | Architecture | 1005013215700882 | 25,97 € | 14 | — | — | A7 | Éliminé |
| 32 | Château avec veilleuses « pour enfants » | Architecture | 1005006017067778 | 12,25 € | 900+ | 4,6 | — | A12 | Éliminé |
| 33 | Voilier classique au 1/200 | Véhicules | 1005011915587847 | 27,41 € | 71 | 4,0 | — | A8 | Éliminé |
| 34 | Boîte à musique à manivelle « piano » | Mécanique | 1005008970157643 | 6,39 € | 52 | 4,5 | — | A6 | Éliminé |
| 35 | Moteur V8 en briques (plusieurs annonces) | Mécanique | 1005009101733505 et autres | 28,99 à 170,99 € | jusqu'à 2 000+ | 4,7 | Mould King (une annonce) | A14 | Éliminé |
| 36 | Vélo « père et fils » | Véhicules | 1005006907429089 | 11,34 € | 500+ | 4,7 | — | A12 | En réserve |

Sous-catégories couvertes : mécanique, véhicules, miniatures déco (book nooks, maisons), architecture.

## 4. Éliminations motivées

| # | Raison (critère) |
|---|---|
| 6 à 12 | **Marque leader revendue, et marge impossible.** Le prix AliExpress est proche du prix public français : harpe à 35,19 € contre 47,10 € sur Kaufland [C7], soit un coefficient de 1,34 au mieux. Le garde-fou de `niche.md` interdit en outre tout nom de marque dans nos textes, ce qui rend la revente sans intérêt. Les annonces 9 et 10 sont aussi de la même marque. |
| 12, 14 | Book nooks **avec LED** (piles), marquage CE non vérifiable. S'y ajoutent la marque pour le 12 et 1 seule vente pour le 14. |
| 13 | Note de 4,4, sous 4,6. 21 ventes seulement. Coefficient impossible (44,59 € d'achat). |
| 15 | 20 ventes, sous 100. Coefficient impossible : il faudrait un prix de vente de 87,48 €. |
| 16 à 19 | **Originalité douteuse, donc exclus** : la gamme « voiture 3D, modèle à l'échelle » reprend le titre-type et le format de la gamme classique de la marque leader. La « voiture vintage 164 pièces » de cette marque se vend 12,90 à 22,99 € en Europe [C10][C11] et 16,82 € sur Cdiscount [C5]. Même si le modèle est authentique, un prix de 25 € ou plus est indéfendable. |
| 20 | **Ressemblance avec le calendrier perpétuel LK201** de la marque leader, vendu sous ce nom sur AliExpress (A4). Dans le doute : exclu. |
| 21, 22 | **Ressemblance avec des modèles de marque** : « boîte au trésor » (LK502, A6) et « coffre-fort » (179 pièces, vendu 67,90 € sur Nature & Découvertes [C3]). Dans le doute : exclu. Le n°22 a aussi trop peu de ventes (12). |
| 23 | Objet fini, pas un kit à assembler : hors niche. Prix trop bas pour un panier de 25 € ou plus. |
| 24, 30, 32 | **Jouet** : public enfant explicite (« STEM », « pour enfants, expériences scientifiques », « veilleuses pour enfants »). Le n°32 contient aussi un éclairage, donc de l'électronique sans CE vérifié. |
| 25, 26 | **Électronique** (télécommande, circuit « électrique ») sans CE vérifiable. Le n°25 vise aussi les enfants. |
| 27, 28 | **Coefficient impossible** : pour 2,5, il faudrait 87,98 € et 64,48 € de prix de vente, hors fourchette de 25 à 60 €. Le n°28 a trop peu de ventes (24). |
| 29 | Note de 4,5, sous 4,6. 58 ventes. |
| 31 | 14 ventes. Coefficient de 2,5 à 64,93 €, hors fourchette. |
| 33 | Note de 4,0. 71 ventes. |
| 34 | Note de 4,5. 52 ventes. |
| 35 | **Hors niche** (briques plastiques, pas du bois). « MOC » ou marque de briques : risque d'usage d'une marque tierce. Certaines annonces ont un moteur électrique. |
| 36 | **En réserve, non retenu** : aucun prix concurrent français trouvé, donc le prix de vente n'est pas justifiable. Originalité `À VÉRIFIER`. |

Recherches également écartées : horloges murales « à quartz » (mouvement à pile, donc électronique), dont l'horloge dragon (1005013133431108, 42,79 €, aucune vente). Maquettes de bateaux d'arsenal de 92 à 208 € : hors fourchette, et seulement 2 à 7 ventes [A8].

## 5. Fiches des produits retenus (présélection conditionnelle)

### N°1 : Puzzle mécanique en spirale à billes (à manivelle)

**Fournisseurs**
- **Principal** : annonce 1005006030347254, 7,19 € (6,89 € l'unité à partir de 2), 5 000+ ventes, note 4,7, « pour adultes et adolescents », relevé le 2026-11-12 [A12].
- **Secours** : annonce 1005006994244114, 8,13 €, 5 000+ ventes, note 4,9, « 3+, frais de douanes offerts » (offre par lot, sens exact `À VÉRIFIER`) [A7][A13].
- Boutique, note de la boutique, ancienneté, entrepôt, délai, nombre de pièces, dimensions : **`À VÉRIFIER`**.

**Tableau de marge** (prix de vente 26,90 €)
| Ligne | Montant | Calcul |
|---|---|---|
| Prix fournisseur TTC | 7,19 € | Affiché le 2026-11-12, TVA incluse `À VÉRIFIER` |
| Livraison | **`À VÉRIFIER`** (0 € dans le calcul) | Moins de 10 € d'achat : la livraison gratuite n'est pas garantie |
| Droit et frais de douane | 5,00 € | 3 € + 2 € [D1][D2], `À VÉRIFIER` si déjà inclus |
| Frais de paiement | 1,11 € | 3 % × 26,90 = 0,807 ; + 0,30 = 1,107 € |
| Provision SAV / casse | 1,35 € | 5 % × 26,90 = 1,345 € |
| **Coût de revient** | **14,65 €** | 7,19 + 0 + 5,00 + 1,11 + 1,35 |
| Prix de vente conseillé | 26,90 € | Sous tous les circuits à billes concurrents relevés (voir ci-dessous) |
| **Coefficient** | **3,74** | 26,90 ÷ 7,19 |
| **Marge nette** | **12,25 €** | 26,90 − 14,65. Reste au-dessus de 10 € tant que la livraison ne dépasse pas 2,25 € |
| Avec le fournisseur de secours (8,13 €) | Marge de 11,31 €, coefficient de 3,31 | — |

**Justification du prix** (relevés du 2026-11-12) : circuit de billes de 254 pièces vendu sous marque de distributeur à 44,95 € chez Nature & Découvertes, en rupture [C4] ; « Coffret puzzle 3D course de billes » à 42,99 € sur Cdiscount [C5] ; circuit à billes d'une marque à 47,29 € et 57,99 € chez Nature & Découvertes (extrait du moteur de recherche) [C12]. **Réserve** : notre kit est probablement bien plus petit (nombre de pièces `À VÉRIFIER`). Le prix de 26,90 € n'est défendable que si l'objet fini a une taille et un effet comparables. Sinon, il faut descendre à 24,90 € : marge de 10,31 €, mais exception à la fourchette de prix.

**Qualité et confiance** : volume de ventes très élevé et notes de 4,7 et 4,9, ce qui est un signal positif. Les avis avec photos n'ont pas pu être lus : défauts récurrents `À VÉRIFIER` (pièces manquantes, brûlures de découpe laser, notice). **Confiance moyenne-faible.** Un échantillon permettrait de vérifier la fluidité de la manivelle, la qualité des billes, la notice et la taille réelle.

**Conformité (pré-contrôle)** : âge « 14 ans et plus » non confirmé. Le titre dit « adultes et adolescents », sans âge chiffré : **`À VÉRIFIER`**. Billes et petites pièces : avertissement « petites pièces, ne convient pas aux enfants de moins de 3 ans » nécessaire. Sans électronique. Fabricant, responsable UE (GPSR) et référence : **`À VÉRIFIER`**. Validation finale par `conformite-qa`.

**Originalité** : aucun nom de marque dans le titre. Comparaison visuelle avec les catalogues Ugears et Rokr (circuits et palans à billes) **`À VÉRIFIER`** avant toute mise en ligne.

**Médias** : photos et vidéos du vendeur, et droit de les réutiliser : **`À VÉRIFIER`** (demander l'accord au vendeur, avec l'accord de l'humain). Le contenu idéal reste notre propre vidéo de la bille qui monte puis descend, à tourner avec le premier exemplaire.

**Risques** : petit format perçu comme « gadget » face aux kits à 45 € ; douane ; délai inconnu ; copie possible d'une marque.

### N°2 : Locomotive à vapeur avec pont ferroviaire (exception à valider)

**Fournisseurs**
- **Principal** : annonce 1005007535078456, 11,44 €, 1 000+ ventes, note 4,7, marque Ury dans le titre (fabricant hors garde-fous, mais le nom ne doit pas apparaître dans nos textes), « frais de douanes offerts » [A5][A6].
- **Secours (produit de substitution)** : annonce 1005007039632379, locomotive modèle à l'échelle, 10,44 €, 900+ ventes, note 4,9 [A5]. Ce n'est pas le même modèle : la fiche produit devra être adaptée.
- Boutique, ancienneté, entrepôt, délai, pièces, dimensions : **`À VÉRIFIER`**.

**Tableau de marge** (prix de vente 27,90 €)
| Ligne | Montant | Calcul |
|---|---|---|
| Prix fournisseur TTC | 11,44 € | 2026-11-12 |
| Livraison | 0 € | Au-dessus de 10 €, offre « Choice » probable : `À VÉRIFIER` |
| Droit et frais de douane | 5,00 € | « Frais de douanes offerts » : si c'est confirmé, mettre 0 € |
| Frais de paiement | 1,14 € | 3 % × 27,90 = 0,837 ; + 0,30 = 1,137 € |
| Provision SAV / casse | 1,40 € | 5 % × 27,90 = 1,395 € |
| **Coût de revient** | **18,98 €** | 11,44 + 0 + 5,00 + 1,14 + 1,40 |
| **Coefficient** | **2,44** | 27,90 ÷ 11,44 |
| **Marge nette** | **8,92 €** | 27,90 − 18,98. **13,92 €** si la douane est réellement offerte |
| Avec le fournisseur de secours (10,44 €) | Marge de 9,92 €, coefficient de 2,67 | — |

**Justification du prix** (2026-11-12) : mini-locomotive de marque de 172 pièces à 25,80 € chez Truffaut, indisponible en ligne, ou 22,90 € + 6,90 € de livraison chez un vendeur partenaire [C2] ; train à vapeur de 227 pièces à 49,99 € sur Cdiscount [C5] ; train à vapeur de 538 pièces à 36,15 € soldé sur Rue du Commerce (extrait du moteur de recherche) [C9]. Un prix de 29,90 € donnerait 10,76 € de marge et un coefficient de 2,61, mais il dépasserait le prix livré de la mini-locomotive de marque (29,80 €). C'est pourquoi 27,90 € est conseillé.

**Qualité et confiance** : 1 000+ ventes et note de 4,7. Avis non lus. **Confiance faible.**

**Conformité** : **signal d'alerte**, le titre contient « cadeau pour enfants ». Si l'annonce ou la boîte indique moins de 14 ans, le produit est **exclu** (réglementation jouets). Âge, GPSR, avertissements : `À VÉRIFIER`.

**Originalité** : comparaison avec les locomotives Ugears (mini-locomotive, V-Express) et Rokr à faire : `À VÉRIFIER`.

**Médias** : `À VÉRIFIER`. Modèle statique, donc moins de mouvement à filmer que le n°1. Le contenu passe par le timelapse d'assemblage et la mise en scène sur une étagère.

**Risques** : âge, marge sous les seuils, comparaison défavorable avec une marque connue au même prix.

### N°3 : Maison dans les arbres miniature (exception à valider)

**Fournisseurs**
- **Principal** : annonce 1005010688762060, 9,71 €, 800+ ventes, note 4,6 (pile au seuil), « frais de douanes offerts » [A12].
- **Secours** : **non identifié**. Aucune seconde annonce comparable avec plus de 100 ventes n'a été trouvée : `À VÉRIFIER`. C'est un manque au regard de la méthode.

**Tableau de marge** (prix de vente 24,90 €)
| Ligne | Montant | Calcul |
|---|---|---|
| Prix fournisseur TTC | 9,71 € | 2026-11-12 |
| Livraison | **`À VÉRIFIER`** (0 € dans le calcul) | Moins de 10 € d'achat |
| Droit et frais de douane | 5,00 € | `À VÉRIFIER` si offerts |
| Frais de paiement | 1,05 € | 3 % × 24,90 = 0,747 ; + 0,30 = 1,047 € |
| Provision SAV / casse | 1,25 € | 5 % × 24,90 = 1,245 € |
| **Coût de revient** | **17,01 €** | 9,71 + 0 + 5,00 + 1,05 + 1,25 |
| **Coefficient** | **2,56** | 24,90 ÷ 9,71 |
| **Marge nette** | **7,89 €** | 24,90 − 17,01 |

**Justification du prix** (2026-11-12) : miniatures génériques sur Cdiscount à 20,00 € (vitrine de boulangerie) et 21,19 € (chat porte-bonheur) ; book nooks de 46,79 à 52,99 € [C5]. Le prix de 24,90 € est **au-dessus** des miniatures génériques comparables : argument faible.

**Qualité** : note limite (4,6). **Confiance faible.** **Conformité** : « jouet créatif » dans le titre, âge absent : `À VÉRIFIER`, exclu si moins de 14 ans. Originalité `À VÉRIFIER` (gamme de maisons miniatures Rolife). **Risques** : cumul de trois exceptions. **Priorité basse.**

## 6. Tableau comparatif final (classé par marge nette, scénario prudent)

Note sur 10 = 2 × (0,30 Marge + 0,25 Conformité et originalité + 0,20 Fiabilité + 0,15 Contenu + 0,10 Prix face aux concurrents), chaque critère noté sur 5.

| Rang | Produit | Achat | Prix de vente | Coût de revient | Marge nette | Coeff. | M | C/O | F | Co | P | Note /10 | Recommandation |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Spirale à billes | 7,19 € | 26,90 € | 14,65 € | 12,25 € | 3,74 | 4 | 2 | 3 | 5 | 4 | **6,9** | À vérifier en priorité, puis retenir |
| 2 | Locomotive et pont | 11,44 € | 27,90 € | 18,98 € | 8,92 € | 2,44 | 2 | 2 | 3 | 4 | 3 | **5,2** | Exception : à retenir seulement si l'âge est de 14+ et la douane offerte (marge de 13,92 €) |
| 3 | Maison dans les arbres | 9,71 € | 24,90 € | 17,01 € | 7,89 € | 2,56 | 2 | 2 | 2 | 4 | 2 | **4,6** | Exception, priorité basse |

Calculs des notes : n°1 = 2 × (1,20 + 0,50 + 0,60 + 0,75 + 0,40) = 2 × 3,45 = 6,9 ; n°2 = 2 × (0,60 + 0,50 + 0,60 + 0,60 + 0,30) = 2 × 2,60 = 5,2 ; n°3 = 2 × (0,60 + 0,50 + 0,40 + 0,60 + 0,20) = 2 × 2,30 = 4,6. Toutes les marges ont été recomptées ligne par ligne.

## 7. Proposition de `knowledge/prix-et-marges.md` (à valider par l'humain)

```markdown
# Prix et marges

## Coût de revient (par commande)
prix fournisseur TTC + livraison + droit et frais de douane (5 € par catégorie d'article si l'envoi vient de hors UE,
0 € si l'envoi part d'un entrepôt UE ou si les frais sont inclus et prouvés) + frais de paiement + provision SAV de 5 % du prix de vente

## Seuils
- Coefficient = prix de vente ÷ (prix fournisseur + livraison + droit et frais de douane) ≥ 2,5
  (la douane entre dans le dénominateur : c'est désormais un coût d'achat)
- Marge nette ≥ 10 € par commande
- Prix de vente entre 25 et 60 €, arrondi en ,90
- Une exception est possible si elle est écrite et validée par l'humain

## Frais
- Paiement : 3 % + 0,30 € tant que la plateforme n'est pas choisie (À VÉRIFIER)
- TVA : statut à préciser (franchise en base ou assujetti) ; recalculer toutes les marges si la boutique est assujettie

## Prix concurrents
- Chaque prix doit avoir moins de 30 jours, avec l'URL et la date ; distinguer « page consultée » et « extrait du moteur de recherche »
- Ne jamais afficher un prix barré sans prix de référence réel (30 jours)

## Révision
- Revoir tous les prix à chaque changement de douane ou de plateforme, et au moins une fois par trimestre
```

Changement important par rapport aux règles par défaut : la douane entre dans le calcul du coefficient. Avec cette règle, le n°1 tombe à 26,90 ÷ 12,19 = **2,21** et ne passe plus. Il faudrait 30,90 € (30,90 ÷ 12,19 = 2,53) ou un entrepôt UE. C'est à l'humain de trancher.

## 8. Décisions à prendre par l'humain

1. **Contrôle des annonces dans un navigateur** (environ 15 minutes, sans commander ni contacter). Pour les annonces 1005006030347254, 1005006994244114, 1005007535078456, 1005007039632379 et 1005010688762060, relever :
   - le nom, la note et l'ancienneté de la boutique ;
   - le pays d'expédition (« Expédié depuis ») ;
   - le délai et les frais de livraison vers la France pour 1 unité ;
   - si le droit de 3 € et les frais de 2 € sont inclus ou ajoutés au paiement ;
   - l'âge indiqué ;
   - le nombre de pièces et les dimensions ;
   - les infos GPSR (fabricant, responsable UE) ;
   - les 20 derniers avis avec photos (pièces manquantes, bois brûlé, notice) ;
   - une comparaison des photos avec les catalogues Ugears et Rokr / Robotime.
   Dès qu'un point échoue, le produit est exclu.
2. **Accepter ou refuser les exceptions** pour les n°2 et n°3.
3. **Trancher la règle du coefficient** : douane incluse ou non (section 7).
4. **Préciser le statut TVA** de la future entreprise.
5. **Si la présélection échoue**, choisir une piste :
   - (a) **fabricants européens de designs originaux** (exemples : un fabricant polonais vendu 29,76 € sur Cdiscount [C5], une marque de kits mécaniques en gros sur Faire [E2]). Il y a une seule catégorie de conformité et un responsable UE facile, mais il faut un achat de stock : c'est incompatible avec le budget de 0 €, à garder pour après les premières ventes ;
   - (b) assouplir les règles de marge ;
   - (c) basculer vers le plan B (crochet).
6. **Autoriser ou non un contact vendeur** (rien n'a été fait) pour : réutilisation des médias, envoi de pièces de rechange, responsable UE.

## 9. Sources (consultées le 2026-11-12)

**AliExpress, pages de recherche** (les fiches produit, de forme `https://fr.aliexpress.com/item/<ID>.html`, ne renvoient aucune donnée exploitable à l'agent) :
- [A1] https://www.aliexpress.com/w/wholesale-wooden-mechanical-model-kit.html
- [A2] https://fr.aliexpress.com/w/wholesale-maquette-bois-mecanique.html
- [A3] https://fr.aliexpress.com/w/wholesale-puzzle-3d-bois-m%C3%A9canique-adulte.html
- [A4] https://fr.aliexpress.com/w/wholesale-maquette-bois-adulte.html?shipFromCountry=ES (filtre « Espagne » probable, non confirmé)
- [A5] https://fr.aliexpress.com/w/wholesale-maquette-bois-locomotive-vapeur.html
- [A6] https://fr.aliexpress.com/w/wholesale-ury-puzzle-3d-bois.html ; https://fr.aliexpress.com/w/wholesale-coffre-secret-bois-puzzle-3d.html ; https://fr.aliexpress.com/w/wholesale-boite-a-musique-manivelle-bois-kit-assembler.html
- [A7] https://fr.aliexpress.com/w/wholesale-maquette-bois-architecture-kit.html ; https://fr.aliexpress.com/w/wholesale-circuit-billes-bois-kit-3d-adulte.html
- [A8] https://fr.aliexpress.com/w/wholesale-maquette-bateau-bois-kit-adulte.html
- [A9] https://fr.aliexpress.com/w/wholesale-book-nook-bois.html ; https://fr.aliexpress.com/w/wholesale-puzzle-3d-bois-m%C3%A9canique.html?shipFromCountry=FR (aucune annonce n'y indique une expédition depuis la France)
- [A10] https://fr.aliexpress.com/w/wholesale-circuit-billes-bois-kit-3d-adulte.html
- [A11] https://fr.aliexpress.com/w/wholesale-moulin-%C3%A0-vent-bois-puzzle-3d-m%C3%A9canique.html ; https://fr.aliexpress.com/w/wholesale-horloge-m%C3%A9canique-bois-kit.html
- [A12] https://fr.aliexpress.com/w/wholesale-puzzle-3d-bois-adulte.html?SortType=total_tranpro_desc (tri par ventes)
- [A13] https://fr.aliexpress.com/w/wholesale-maquette-bois-m%C3%A9canique-14-ans.html?SortType=total_tranpro_desc
- [A14] https://fr.aliexpress.com/w/wholesale-maquette-bois-moteur-v8-m%C3%A9canique.html ; https://fr.aliexpress.com/w/wholesale-kit-maquette-bois-voiture-adulte.html

**Concurrents (prix du 2026-11-12)**
- [C2] Truffaut, mini-locomotive (page consultée) : https://www.truffaut.com/puzzle-3d-mini-locomotive.html ; cabriolet de 735 pièces à 79,99 € : https://www.truffaut.com/maquette-en-bois-3d-cabriolet-americain.html
- [C3] Nature & Découvertes, coffre-fort (page consultée) : https://www.natureetdecouvertes.com/enfant/jeux-construction/maquettes/coffre-fort-puzzle-3d-bois-98646580
- [C4] Nature & Découvertes, parcours de billes de 254 pièces (page consultée) : https://www.natureetdecouvertes.com/enfant/jeux-construction/maquettes/maquette-parcours-de-billes-en-bois-42004850
- [C5] Cdiscount, recherche « maquette bois adulte » (page consultée) : https://www.cdiscount.com/juniors/r-maquette+bois+adulte.html
- [C7] Kaufland.fr (extrait du moteur de recherche, repris du rapport v3) : https://www.kaufland.fr/product/543237234/
- [C9] Rue du Commerce, train à vapeur de 538 pièces (extrait du moteur de recherche) : https://www.rueducommerce.fr/p/m24070076192.html
- [C10] Kidero, voiture historique de 164 pièces, 12,90 € (extrait du moteur de recherche) : https://kidero.be/en/product/1145-3d-houten-puzzel-historische-auto
- [C11] Scientific-MHD, voiture vintage TG504, 19,95 € (extrait du moteur de recherche) : https://scientific-mhd.eu/gb/easy-mechanical-3d-puzzle-for-vintage-carpet-s058tg504-11350.html
- [C12] Nature & Découvertes, circuits à billes de marque (extraits du moteur de recherche) : https://www.natureetdecouvertes.com/enfant/jeux-construction/maquettes/maquette-3d-circuit-a-billes-climber-97218670 ; https://www.natureetdecouvertes.com/enfant/jeux-construction/jeux-mecanique/puzzle-3d-ugears-le-circuit-a-billes-97870310
- Pages hors stock, sans prix : https://www.natureetdecouvertes.com/enfant/jeux-construction/maquettes/maquette-en-bois-3d-avec-mouvement-mecanique-design-de-train-a-vapeur.-92968030

**Douane**
- [D1] Douane française, « Petits colis : ce qui change » : https://www.douane.gouv.fr/petits-colis-ce-qui-change-pour-vos-achats-en-ligne
- [D2] Toute l'Europe, article du 02/11/2026 : https://www.touteleurope.eu/economie-et-social/petits-colis-importes-hors-ue-ce-que-change-le-droit-de-douane-europeen-de-3-euros-sur-les-achats-de-moins-de-150-euros/

**Délais AliExpress (sources non officielles)**
- [S9] https://www.dealabs.com/discussions/aliexpress-les-produits-choice-cest-quoi-livraison-rapide-et-gratuite-des-10eur-5-retours-gratuits-par-mois-3023365 ; https://www.alidrop.co/fr/blogs/quest-ce-qualiexpress-choice

**Fournisseurs européens (piste a)**
- [E1] Fabricant polonais de designs originaux (revendeurs) : https://www.speedcube.nl/en/modeling/wooden-city-en/
- [E2] Marque de kits mécaniques en gros sur Faire : https://www.faire.com/brand/b_gtppmf64bk

**Tentatives sans succès** : fiches produit AliExpress (contenu vide ou redirection vers la connexion), CJdropshipping (page de vérification anti-robot), Amazon.fr (HTTP 503), lamaquetteenbois.fr et ecocraft.fr (HTTP 429), economie.gouv.fr (HTTP 403).
