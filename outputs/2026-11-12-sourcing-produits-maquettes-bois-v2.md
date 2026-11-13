---
agent: sourcing-produits
statut: validé   # doit passer par conformite-qa, puis validation humaine
valide_par: humain
date_validation: 2026-11-13
date: 2026-11-12
sources: [CLAUDE.md, docs/architecture.md, knowledge/README.md, knowledge/niche.md, knowledge/contraintes.md, .claude/agents/sourcing-produits.md (v1.3), outputs/2026-11-12-sourcing-produits-maquettes-bois.md, outputs/2026-11-12-analyste-marche-top3-niches-v3.md, sources web en section 11]
prochaine-etape: conformite-qa
---

# Sourcing v2 : maquettes en bois à assembler pour adultes (règles v1.3)

> Document interne d'aide à la décision, pas un livrable public. Les noms de marques y figurent **uniquement pour l'analyse** (repérer les copies, comparer les prix, identifier les canaux officiels). Ils ne doivent apparaître dans aucun texte de la boutique tant que l'humain n'a pas tranché la décision n°1 (section 10).
> `knowledge/marque.md`, `knowledge/politiques.md` et `knowledge/prix-et-marges.md` n'existent pas encore. Les règles de l'agent v1.3 (fichier `.claude/agents/sourcing-produits.md`) et `knowledge/contraintes.md` font foi.
> Aucun fournisseur n'a été contacté, rien n'a été commandé. Tous les prix ont été relevés le **2026-11-12**.

## 1. Résumé décisionnel

**Le constat, franchement : aucun produit ne passe toutes les règles v1.3 de façon vérifiée.** Je ne recommande donc pas encore 3 à 5 produits pour la boutique de départ. Quatre produits sont **en sursis** : ils tiennent la marge nette de 10 € sur le papier, mais chacun a au moins un point bloquant non vérifié (pays d'expédition sur l'annonce, délai, stock, nombre d'avis, CE, fournisseur de secours). Je n'ai assoupli aucune règle pour atteindre le chiffre de 3.

| Rang | Produit (description générique) | Fournisseur / zone | Achat TTC | Prix de vente conseillé | Marge nette | Délai | Stock | Note produit | Statut |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Boîte à musique « voyage sous les cerisiers » (lumière et musique, USB-C), produit authentique de la marque leader | Annonce AliExpress filtrée « Expédié depuis : France » ; secours filtré « Espagne » | 44,59 € | 62,90 € | **12,98 €** (secours : 11,38 €) | `À VÉRIFIER` (UE) | `À VÉRIFIER` (stock officiel UE : 8) | 4,9 (534 ventes), nb d'avis `À VÉRIFIER` | **En sursis** : électronique (CE `À VÉRIFIER`), expédition UE non confirmée sur l'annonce, garde-fou « nom de marque » |
| 2 | Circuit à billes en spirale à manivelle (générique, sans électronique) | AliExpress, Chine probable (non confirmé) | 7,19 € | 26,90 € | **12,26 €** (secours : 11,32 €) | `À VÉRIFIER` (doit être ≤ 14 j) | `À VÉRIFIER` | 4,7 (5 000+ ventes), nb d'avis `À VÉRIFIER` | **En sursis** : pays et délai non confirmés (éliminatoire si > 14 j), originalité et âge `À VÉRIFIER` |
| 3 | Usine à café mécanique (musique et LED), produit authentique de la marque leader | AliExpress filtré « France » | 52,39 € | 69,90 € | **11,62 €** | `À VÉRIFIER` | `À VÉRIFIER` (rupture chez la marque en UE) | 5 (1 000+ ventes), nb d'avis `À VÉRIFIER` | **En sursis, sans secours valable** : électronique, aucun 2e fournisseur à ≥ 10 € de marge |
| 4 | Horloge à coucou mécanique (LED, son, quartz), produit authentique de la marque leader | AliExpress filtré « France » | 48,19 € | 64,90 € | **11,22 €** | `À VÉRIFIER` | `À VÉRIFIER` (rupture chez la marque en UE) | 4,9 (1 000+ ventes), nb d'avis `À VÉRIFIER` | **En sursis, sans secours valable** : électronique, aucun 2e fournisseur à ≥ 10 € de marge |

- **Marge nette moyenne des 4 produits en sursis** : (12,98 + 12,26 + 11,62 + 11,22) ÷ 4 = 48,08 ÷ 4 = **12,02 €**. Ce chiffre ne vaut que si toutes les vérifications passent.
- **Niveau de confiance : faible.** Les fiches produit AliExpress restent illisibles pour l'agent (seules les pages de recherche le sont), et les pages des marques ne donnent ni remise revendeur ni conditions de dropshipping.
- **Piste la plus solide pour la suite** : le canal **officiel** européen de la marque leader (site B2B Robotime Europe, sans minimum de commande affiché, stocks par référence affichés). C'est le seul canal qui élimine à la fois le risque de contrefaçon et le problème du fournisseur de secours. Mais ses conditions (remise, dropshipping, droit sur les photos, responsable UE) sont inconnues : un brouillon de message est prêt en section 9. Calcul utile : pour tenir 10 € de marge en vendant au prix public, il faut un coût d'achat livré ≤ **0,92 × prix de vente − 10,30 €**, soit une remise d'environ **23 à 25 %** sur le prix public si la livraison est offerte (détail en section 5).

### Ce qui change par rapport à la v1

| Sujet | v1 (anciennes règles) | v2 (règles v1.3) |
|---|---|---|
| Ordre de recherche | AliExpress d'abord | Marques officielles, puis grossistes UE, puis marketplaces avec entrepôt UE, Chine en dernier recours |
| Marge | 10 € « par défaut », exceptions possibles | 10 € **sans exception** ; coefficient et fourchette 25-60 € seulement indicatifs |
| Douane hors UE | 5 € comptés, « peut-être offerts » | 5 € **toujours comptés** pour la Chine (`contraintes.md`) |
| Délai | 20 jours | **14 jours** maximum, délai le plus long annoncé |
| Nouveaux filtres | — | Stock ≥ 100, note **produit** ≥ 4,5 sur ≥ 20 avis, pays d'expédition confirmé |
| Locomotive et pont (v1 n°2) | Exception à valider (8,92 €) | **Éliminée** (marge < 10 € au prix défendable, signal « enfants ») |
| Maison dans les arbres (v1 n°3) | Exception à valider (7,89 €) | **Éliminée** (marge < 10 €, aucun secours) |
| Spirale à billes (v1 n°1) | Retenue sous conditions | **En sursis** : marge recalculée à 12,26 €, mais délai Chine ≤ 14 j non prouvé |
| Produits de la marque leader | Tous éliminés (« marge impossible », coefficient < 2,5) | Réévalués : le coefficient n'est plus éliminatoire. Trois produits authentiques expédiés depuis l'UE dégagent ≥ 10 € de marge **en restant sous le prix officiel européen** |
| Canal officiel | Non étudié | Site B2B européen de la marque leader trouvé (section 3, ligne O1) |

## 2. Hypothèses

| Sujet | Valeur retenue | Origine |
|---|---|---|
| Prix d'achat | Prix affiché sur fr.aliexpress.com le 2026-11-12, TTC. Annonces UE : pas de TVA d'import ni de douane (« sans frais d'importation » affiché). Annonce Chine : TVA incluse via IOSS, **`À VÉRIFIER`** au paiement | Pages de recherche [A15] à [A19], [A12] |
| Livraison | 0 € quand la page affiche « Livraison gratuite ». Sinon `À VÉRIFIER` | Pages de recherche |
| Taxes import (hors UE) | **5,00 € par colis** (3 € de droit + 2 € de frais de traitement), comptés même si l'annonce dit « frais de douanes offerts » | `contraintes.md`, [D1][D2] |
| Taxes import (UE) | 0 € | Échanges intra-UE |
| Frais de paiement | **`À VÉRIFIER`** (plateforme non choisie). Hypothèse : 3 % du prix de vente + 0,30 € | Règle de l'agent |
| Provision SAV / casse | 5 % du prix de vente | Règle de l'agent |
| TVA sur nos ventes | Hypothèse de franchise en base (micro-entreprise), reprise de la v1. **`À VÉRIFIER`** : si la boutique est assujettie, toutes les marges baissent | v1, section 2 |
| Pays d'expédition | Le filtre « Expédié depuis » de la page de recherche ne vaut **pas** confirmation : la règle exige que l'annonce elle-même l'indique. Statut `À VÉRIFIER` tant que l'humain n'a pas ouvert l'annonce | Règle v1.3, étape 1.3 |
| Délai maximum | 14 jours de la commande à la réception, délai le plus long annoncé | `contraintes.md` |
| Stock | ≥ 100 unités ; stock non affiché = `À VÉRIFIER`, à confirmer avant validation | Règle v1.3 |
| Note produit | ≥ 4,5/5 sur ≥ 20 avis. AliExpress affiche la note et les **ventes** en page de recherche, pas le nombre d'avis : `À VÉRIFIER` | Règle v1.3 |
| Fiabilité vendeur | Note boutique ≥ 4,6, ancienneté ≥ 1 an, ≥ 100 ventes. Seules les ventes de l'annonce sont visibles ; note et ancienneté de la boutique `À VÉRIFIER` | Règle v1.3 |
| Prix de vente des produits authentiques | **Jamais au-dessus du prix officiel européen de la marque** relevé le même jour (sinon le client achète chez la marque) | Choix de l'agent, proposé en section 7 |
| Seuils indicatifs | Coefficient ≥ 2,5 ; prix de vente 25-60 €. Signalés mais non éliminatoires | Règle v1.3 |

## 3. Candidats (36 lignes : 9 canaux officiels ou UE étudiés, 19 lignes d'annonces avec entrepôt UE, 8 lignes reprises de la v1)

URL d'une annonce AliExpress : `https://fr.aliexpress.com/item/<ID>.html`. « Ventes » et « Note » = valeurs de la page de recherche, pas de la boutique. Tous relevés le 2026-11-12.

### 3.1 Marques officielles, grossistes et plateformes UE (ordre de préférence 1 et 2)

| # | Canal | Pays | Ce qui a été trouvé | Conditions relevées | Décision |
|---|---|---|---|---|---|
| O1 | **Robotime Europe** (site B2B officiel de la marque leader : gammes mécanique, miniatures, fleurs) [B1][B2][B3][B4] | Expédition depuis l'Europe (« livraison rapide sous une semaine ») ; société indiquée en Chine en pied de page ; entité « Robotime Europe Ltd » à Sofia selon un salon professionnel [B6] | 385 références ; stock affiché par référence (ex. boîte à musique cerisiers AMT02 : 8 ; « Forest Tea Party » AMT03 : 1 924 ; usine à café EAB02 et horloges coucou LC901/LC901C : rupture) | Pas de minimum de commande ; port de 60 € sous 1 000 € ; acompte ou paiement intégral ; compte activé sous 72 h ; pièces de rechange via le SAV ; **dropshipping non mentionné**, remise non publiée, droit sur les photos et responsable UE non mentionnés | **Piste prioritaire, bloquée** : achat de stock incompatible avec 0 € ; dropshipping `À VÉRIFIER` (brouillon §9) |
| O2 | Wooden.City (fabricant de designs originaux) [B7][B8] | Pologne (UE) | Boîtes à énigmes 39,90 €, horloge 69,90 € (prix publics) | Livraison France 14,90 €, 3 à 7 jours ouvrés ; aucun programme revendeur publié | `À VÉRIFIER` (brouillon §9). Aucun prix d'achat connu |
| O3 | Wood Trick (fabricant) [B9][B10] | Marque ukrainienne, site UE « livraison 3 à 6 jours dans l'UE » | Prix affichés en livres sterling sur la page lue | Gros via Faire (achat de stock) ; aucun dropshipping trouvé | Bloqué par le budget (achat de stock) |
| O4 | Ugears [B11][B12] | Ukraine (hors UE) | Revendeurs UE au détail (ex. 14,90 à 159,90 € [B13]) | Programme d'affiliation à 7 % (source tierce, peut-être périmé) ; distributeur nord-américain sur Faire ; aucun dropshipping UE trouvé | Non retenu : pas de canal revendeur UE trouvé. L'affiliation (≈ 7 % d'un panier) ne donne pas 10 € par commande sous 143 € de panier (10 ÷ 0,07) |
| O5 | Graine Créative (kits mécaniques, sur Faire) [B10] | Probablement France, `À VÉRIFIER` | Lion mécanique en bois | Minimum de commande 218 $ (Faire) | Bloqué par le budget |
| O6 | DAM Electronics (grossiste-vendeur) [B14][B15] | Espagne | Puzzles 3D en bois, dont des modèles mécaniques (168 à 183 pièces) | Fiche lue : âge **8 ans et plus**, note 3,9 incohérente | **Éliminé** : jouet (< 14 ans) ; variantes avec LED et musique |
| O7 | Scientific-MHD (importateur-distributeur historique de la marque leader) [B16] | France / Belgique | Distribue la marque leader sous ses propres références | Aucune offre revendeur ni dropshipping publiée | `À VÉRIFIER` (secours possible si O1 renvoie vers un distributeur national) |
| O8 | Robotoys.eu (revendeur) [B17] | Slovaquie (UE) | Horloge coucou LC901C : 61,90 € HT, 14 en stock, « 14 ans et plus », LED + quartz + 3 piles AAA ou USB-C | Remises de 10 % dès 200 € et 15 % dès 300 € ; lien « Wholesale » mort (HTTP 404) | Stock < 100 ; pas de dropshipping connu. Non retenu |
| O9 | Plateformes de dropshipping UE : BigBuy, Droppery [B18][B19] | Espagne, Pays-Bas | BigBuy : page inaccessible (HTTP 403), puzzles 2D visibles en recherche ; Droppery : catalogue maison et déco, aucun fabricant de maquettes trouvé | BigBuy : abonnement payant | **Bloqué par le budget** (BigBuy) ; Droppery : rien dans la niche |

Places de marché de gros (Faire, Ankorstore) : achat de stock obligatoire, donc bloquées par le budget de 0 €.

### 3.2 Annonces avec entrepôt UE (ordre de préférence 3)

Pages : [A15] filtre France, mots-clés « maquette bois adulte » ; [A16] filtre France, « puzzle 3D bois adulte », tri par ventes ; [A17] filtre Espagne, « puzzle 3D bois adulte », tri par ventes ; [A18] filtre Espagne, « puzzle 3D bois mécanique » ; [A19] filtre Pologne. **Constat** : sur les filtres France et Espagne, presque toutes les annonces vendues en volume sont des **produits authentiques de la marque leader**. Les annonces génériques n'apparaissent qu'avec le filtre Pologne, et toutes ont moins de 20 ventes.

| # | Produit (résumé) | Sous-catégorie | ID | Filtre | Prix | Ventes | Note | Décision |
|---|---|---|---|---|---|---|---|---|
| U1 | Boîte à musique « voyage sous les cerisiers » (AMT02) | Miniatures déco | 1005013040714032 | FR | 44,59 € | 534 | 4,9 | **En sursis (n°1)** |
| U2 | Même produit | Miniatures déco | 1005010017003236 | ES | 46,19 € | 271 | 4,9 | **Secours du n°1** |
| U3 | Usine à café mécanique (EAB02) | Mécanique | 1005012910429712 | FR | 52,39 € | 1 000+ | 5 | **En sursis (n°3)** |
| U4 | Usine à café (2e annonce) | Mécanique | 1005012804714242 | FR | 57,99 € | 211 | 5 | Éliminé (secours insuffisant) |
| U5 | Usine à café (3e annonce) | Mécanique | 1005012670970884 | ES | 58,99 € | 803 | 5 | Éliminé (secours insuffisant) |
| U6 | Horloge à coucou « forêt noire » | Mécanique | 1005012873098546 | FR | 48,19 € | 1 000+ | 4,9 | **En sursis (n°4)** |
| U7 | Horloge à coucou de Noël | Mécanique | 1005013565173133 | FR | 54,99 € | 209 | 4,9 | Éliminé |
| U8 | Usine à cadeaux, boîte à musique | Mécanique | 1005008158905544 | ES | 55,39 € | 872 | 4,9 | Éliminé |
| U9 | Navette spatiale avec éclairage | Véhicules | 1005013497626051 | FR | 48,39 € | 426 | 4,9 | Éliminé |
| U10 | Harpe mécanique AMK71 | Mécanique | 1005013158560264 | FR | 39,79 € | 210 | 5 | Éliminé |
| U11 | Bateau (titre avec le nom d'un manga) | Véhicules | 1005012865757933 / 1005008869787696 | FR / ES | 33,19 € / 35,39 € | 1 000+ / 843 | 4,9 | Éliminé |
| U12 | Maison miniature « coin livre » | Miniatures déco | 1005007001131332 | ES | 33,79 € | 225 | 5 | Éliminé (provisoire) |
| U13 | Miniature « coucher de soleil carnaval » | Miniatures déco | 1005006987416559 | ES | 34,59 € | 195 | 4,8 | Éliminé (provisoire) |
| U14 | Voitures classiques | Véhicules | 1005007202055514 | ES | 14,59 € | 188 | 4,7 | Éliminé |
| U15 | Petite guitare électrique (maquette) | Mécanique | 1005007101794936 | ES | 14,39 € | 185 | 4,6 | Éliminé |
| U16 | Circuit à billes « spaceport » | Mécanique | 1005006960027561 | ES | 18,39 € | 376 | 4,8 | Éliminé |
| U17 | Boîte à musique avec LED, marque illisible | Mécanique | 1005013031445679 | FR | 52,69 € | 740 | 4,9 | Éliminé |
| U18 | Flipper mécanique 3D | Mécanique | 1005013031367942 | FR | 139,99 € | 455 | 4,9 | Éliminé |
| U19 | Annonces génériques filtre Pologne (circuits à billes, téléphone rétro, carrousel, book nooks, pont) | Divers | 1005013023358718, 1005012948953992, 1005013157503929, 1005012582803475, 1005013392877829 et autres | PL | 16,19 à 40,59 € | 0 à 18 | 5 ou non affichée | Éliminé |

### 3.3 Candidats repris de la v1 (Chine, ordre de préférence 4)

Source : v1, section 3 (`outputs/2026-11-12-sourcing-produits-maquettes-bois.md`), pages [A5][A7][A12][A13].

| # | Produit (résumé) | v1 # | ID | Prix | Ventes | Note | Décision v2 |
|---|---|---|---|---|---|---|---|
| C1 | Circuit à billes en spirale à manivelle | 1 | 1005006030347254 | 7,19 € | 5 000+ | 4,7 | **En sursis (n°2)** |
| C2 | Même type | 2 | 1005006994244114 | 8,13 € | 5 000+ | 4,9 | **Secours du n°2** |
| C3 | Locomotive à vapeur et pont | 3 | 1005007535078456 | 11,44 € | 1 000+ | 4,7 | Éliminé |
| C4 | Locomotive à l'échelle | 4 | 1005007039632379 | 10,44 € | 900+ | 4,9 | Éliminé |
| C5 | Maison dans les arbres | 5 | 1005010688762060 | 9,71 € | 800+ | 4,6 | Éliminé |
| C6 | Vélo « père et fils » | 36 | 1005006907429089 | 11,34 € | 500+ | 4,7 | Éliminé |
| C7 | Autres annonces v1 n°6 à 35 | 6-35 | voir v1 | — | — | — | Éliminations v1 maintenues (section 4) |
| C8 | Voilier, moulin, boîte à musique « piano » (v1 n°29, 33, 34) | — | voir v1 | — | 52 à 71 | 4,0 à 4,5 | Éliminés (ventes < 100 et, pour le n°33, note < 4,5) |

Sous-catégories couvertes : mécanique, miniatures déco, véhicules, architecture (v1 et filtre Pologne).

## 4. Éliminations motivées

| # | Raison (critère) |
|---|---|
| O4 | Pas de canal revendeur UE trouvé ; marque hors UE (droits de douane) ; affiliation qui ne peut pas atteindre 10 € par commande sur un panier de 25 à 60 €. |
| O6 | **Jouet** : « 8 ans et plus » sur la fiche lue [B15]. Variantes avec lumière et musique sans CE vérifiable. |
| O8 | **Stock** de 14 unités, sous 100. Revendeur au détail, pas de dropshipping connu. |
| O3, O5, O9 (BigBuy) | **Bloqués par le budget** (achat de stock ou abonnement), non éliminés : à rouvrir après les premières ventes. |
| U4, U5 | **Marge < 10 €** au prix plafond de 69,90 € (prix officiel UE 69,99 €) : 69,90 − (57,99 + 2,397 + 3,495) = **6,02 €** ; 69,90 − (58,99 + 2,397 + 3,495) = **5,02 €**. Ne peuvent donc pas servir de secours. |
| U7 | **Marge impossible** : la marque vend ce modèle **33,00 €** sur son site européen (LCB01, rupture) [B5] ; l'annonce est à 54,99 €. |
| U8 | **Marge < 10 €** : 64,90 − (55,39 + 2,247 + 3,245) = **4,02 €** ; prix public relevé 64,99 € [P1]. |
| U9 | **Marge < 10 €** : 54,90 − (48,39 + 1,947 + 2,745) = **1,82 €** ; prix public 54,99 € [P1]. Électronique (éclairage). |
| U10 | **Marge impossible** : le site européen de la marque affiche 21,50 € (786 en stock) [B3] contre 39,79 € sur l'annonce. |
| U11 | **Doute sur l'usage d'une marque tierce** : le titre cite un manga célèbre, alors qu'aucune licence de ce manga n'a été trouvée chez ce fabricant [W1]. Dans le doute : exclu. Modèle exact inconnu. |
| U12, U13 | **Prix de vente non justifiable** : modèle exact non identifié depuis la page de recherche, donc aucun prix officiel ou concurrent comparable. À rouvrir si l'humain relève la référence (section 8). Repère : un book nook de la même gamme est vendu 44,90 € chez un spécialiste français [P4] ; à 44,90 €, la marge de U12 serait 44,90 − (33,79 + 1,647 + 2,245) = **7,22 €**, sous 10 €. |
| U14, U15 | **Marge < 10 €** : prix publics européens de 12,90 à 22,99 € pour ce type de petit véhicule (v1 [C10][C11]). |
| U16 | **Électronique** (moteur USB) [P2] ; le prix de 18,39 € correspond probablement à une variante (le kit complet est vendu 59,99 € [P1]). |
| U17 | **Marque illisible** dans le titre et LED : doute sur l'origine, CE non vérifiable. Exclu. |
| U18 | Hors fourchette de prix (139,99 € d'achat), aucun prix concurrent relevé : marge non chiffrable. |
| U19 | **Note produit** : 0 à 18 ventes, donc moins de 20 avis. Le circuit « électrique » a aussi un moteur (CE). |
| C3 | **Marge < 10 €** au prix défendable : 27,90 − (11,44 + 5,00 + 1,14 + 1,40) = **8,92 €** (v1). À 29,90 €, la marge passerait à 10,77 €, mais le prix dépasserait le prix livré d'une mini-locomotive de marque (29,80 €, v1 [C2]) : indéfendable. Le titre contient aussi « cadeau pour enfants » (risque jouet). |
| C4 | **Marge < 10 €** à 27,90 € : 27,90 − (10,44 + 5,00 + 1,137 + 1,395) = **9,93 €** (la v1 affichait 9,92 € avec des lignes arrondies). Même problème de prix à 29,90 €. |
| C5 | **Marge < 10 €** : 7,89 € à 24,90 € (v1). À 27,90 €, le prix dépasse les miniatures génériques comparables à 20,00 et 21,19 € (v1 [C5]). Aucun fournisseur de secours. |
| C6 | Aucun prix concurrent français : prix de vente non justifiable (v1). |
| C7, C8 | Éliminations de la v1 maintenues (copies probables de la marque leader, jouets, électronique, ventes < 100, note < 4,5) : voir v1, section 4. **Seul changement** : les produits authentiques de la marque leader (v1 n°6 à 12) ne sont plus éliminés d'office pour « coefficient < 2,5 ». Ils sont recalculés ici via les annonces UE (U1 à U10). Ceux vendus depuis la Chine restent éliminés : ils ajoutent 5 € de taxes à un prix déjà proche du prix public. |

## 5. Fiches des produits en sursis

Rappel du calcul (règle de l'agent) : coût de revient = achat + livraison + taxes import + frais de paiement (3 % × prix de vente + 0,30 €, `À VÉRIFIER`) + SAV (5 % × prix de vente). Marge nette = prix de vente − coût de revient. Montants intermédiaires gardés à 3 décimales, arrondis à la fin.

**Formule de seuil, utile pour négocier avec un canal officiel** : marge ≥ 10 € ⇔ achat + livraison + taxes ≤ PV − 10 − 0,03 × PV − 0,30 − 0,05 × PV = **0,92 × PV − 10,30 €**. Exemples : à 62,90 €, coût livré maximal de 47,57 € (remise de 24,5 % sur 62,99 €) ; à 64,90 €, 49,41 € (24,0 % sur 64,99 €) ; à 69,90 €, 54,01 € (22,8 % sur 69,99 €).

### N°1 : Boîte à musique « voyage sous les cerisiers » (produit authentique de la marque leader)

**Fournisseurs**
- **Principal** : annonce 1005013040714032, 44,59 €, 534 ventes, note 4,9, « Livraison gratuite, sans frais d'importation », filtre « Expédié depuis : France » [A16].
- **Secours** : annonce 1005010017003236, 46,19 €, 271 ventes, note 4,9, filtre « Espagne » [A17].
- **Secours officiel possible** : Robotime Europe (réf. AMT02, prix affiché 62,99 €, **stock : 8**) [B3] ; prix d'achat revendeur `À VÉRIFIER`.
- Boutique, note et ancienneté de la boutique, pays d'expédition **sur l'annonce**, délai, stock : `À VÉRIFIER`.

**Tableau de marge** (prix de vente 62,90 €, sous le prix officiel UE de 62,99 €)
| Ligne | Principal | Secours | Calcul |
|---|---|---|---|
| Prix d'achat TTC | 44,59 € | 46,19 € | Relevé le 2026-11-12 |
| Livraison | 0 € | 0 € | « Livraison gratuite » |
| Taxes import | 0 € | 0 € | UE (si l'expédition UE est confirmée) |
| Frais de paiement | 2,187 € | 2,187 € | 3 % × 62,90 = 1,887 ; + 0,30 (`À VÉRIFIER`) |
| Provision SAV | 3,145 € | 3,145 € | 5 % × 62,90 |
| **Coût de revient** | **49,92 €** | **51,52 €** | 44,59 + 2,187 + 3,145 = 49,922 ; 46,19 + 2,187 + 3,145 = 51,522 |
| **Marge nette** | **12,98 €** | **11,38 €** | 62,90 − 49,922 = 12,978 ; 62,90 − 51,522 = 11,378 |
| Coefficient (indicatif) | 1,41 | 1,36 | 62,90 ÷ 44,59 ; 62,90 ÷ 46,19 (sous 2,5) |
| Fourchette 25-60 € | Hors fourchette (62,90 €) | | Indicatif |

À 59,90 €, le principal donnerait 10,22 € et le secours 8,62 € (sous 10 €). 62,90 € est donc le seul prix où les deux fournisseurs tiennent la règle.

**Justification du prix** : prix officiel européen 62,99 € (2026-11-12) [B3]. Aucun autre prix français relevé : `À VÉRIFIER` (Amazon.fr, Nature & Découvertes). Si un revendeur français vend nettement moins cher, le produit tombe.

**Qualité et confiance** : produit de marque, ventes et notes élevées sur les deux annonces. Selon les fiches revendeurs : environ 4 h de montage, difficulté 4 sur 6, 24,3 × 14,2 × 18,5 cm, nombre de pièces contradictoire (283 ou 203) [W2]. Avis avec photos non lus : `À VÉRIFIER`. **Confiance moyenne sur la qualité, faible sur le canal.** Un échantillon permettrait de vérifier la boîte à musique, la lumière, la recharge et la notice en français.

**Conformité (pré-contrôle)** : **électronique** (éclairage, recharge USB-C, deux mélodies) [W2]. Marquage CE à vérifier sur la boîte ou la notice : **obligatoire** (`niche.md`). Âge : aucun âge trouvé dans les sources, `À VÉRIFIER`, exclu si < 14 ans. GPSR : fabricant identifié (Chine), **responsable UE `À VÉRIFIER`** (le site européen n'en cite aucun [B2]). Validation finale par `conformite-qa`.

**Originalité** : produit authentique. Le risque de copie est nul si le vendeur est bien la marque ou un revendeur autorisé (`À VÉRIFIER`). Conflit avec le garde-fou « aucun nom de marque dans nos textes » : décision humaine n°1.

**Médias** : photos et vidéos de la marque, droit de réutilisation `À VÉRIFIER` (brouillon §9). Contenu propre possible : timelapse du montage, puis lumière et musique dans une chambre sombre.

**Risques** : stock officiel UE très bas (8) ; le client trouve facilement le produit moins cher sur AliExpress ; prix plafonné par la marque ; électronique ; dépendance totale à une seule marque.

### N°2 : Circuit à billes en spirale à manivelle (générique, Chine)

**Fournisseurs** (repris de la v1, section 5)
- **Principal** : annonce 1005006030347254, 7,19 €, 5 000+ ventes, note 4,7, « pour adultes et adolescents » [A12].
- **Secours** : annonce 1005006994244114, 8,13 €, 5 000+ ventes, note 4,9 [A7][A13].
- Aucun équivalent avec entrepôt UE trouvé (le filtre Pologne ne montre que des circuits à billes de 28,99 à 40,59 € avec moins de 20 ventes [A19]).

**Tableau de marge** (prix de vente 26,90 €)
| Ligne | Principal | Secours | Calcul |
|---|---|---|---|
| Prix d'achat TTC | 7,19 € | 8,13 € | 2026-11-12, TVA IOSS incluse `À VÉRIFIER` |
| Livraison | `À VÉRIFIER` (0 € dans le calcul) | `À VÉRIFIER` | Moins de 10 € d'achat : livraison gratuite non garantie |
| Taxes import | 5,00 € | 5,00 € | 3 € + 2 € par colis [D1][D2] |
| Frais de paiement | 1,107 € | 1,107 € | 3 % × 26,90 = 0,807 ; + 0,30 |
| Provision SAV | 1,345 € | 1,345 € | 5 % × 26,90 |
| **Coût de revient** | **14,64 €** | **15,58 €** | 7,19 + 5 + 1,107 + 1,345 = 14,642 ; 8,13 + 5 + 1,107 + 1,345 = 15,582 |
| **Marge nette** | **12,26 €** | **11,32 €** | 26,90 − 14,642 = 12,258 ; 26,90 − 15,582 = 11,318 |
| Coefficient (indicatif) | 3,74 | 3,31 | 26,90 ÷ 7,19 ; 26,90 ÷ 8,13 |

La v1 affichait 12,25 € (lignes arrondies) : écart de 0,01 €. La marge reste ≥ 10 € tant que la livraison ne dépasse pas **2,25 €** (principal) ou **1,31 €** (secours).

**Justification du prix** : circuits à billes concurrents de 42,99 à 57,99 € (v1 [C4][C5][C12]). Réserve de la v1 maintenue : le kit est probablement plus petit (nombre de pièces `À VÉRIFIER`).

**Qualité** : volume de ventes très élevé. Avis non lus. **Confiance moyenne-faible.**
**Conformité** : sans électronique. Âge chiffré absent (« adultes et adolescents ») : `À VÉRIFIER`. Billes et petites pièces : avertissement nécessaire. GPSR : `À VÉRIFIER`.
**Originalité** : comparaison avec les circuits à billes des deux marques leaders `À VÉRIFIER` (v1).
**Délai** : **point bloquant**. Sources non officielles : 7 à 15 jours pour l'offre « Choice » (v1 [S9]). Si l'annonce affiche un délai maximum de plus de 14 jours, le produit est **éliminé**.
**Médias** : `À VÉRIFIER`. Très bon sujet vidéo (bille qui monte puis redescend).
**Risques** : délai, taxes, petit format perçu comme un gadget, copie possible.

### N°3 : Usine à café mécanique (produit authentique de la marque leader)

**Fournisseurs**
- **Principal** : annonce 1005012910429712, 52,39 €, 1 000+ ventes, note 5, filtre « France » [A15][A16].
- **Secours** : **aucun valable**. Les deux autres annonces (57,99 € et 58,99 €) donnent 6,02 € et 5,02 € de marge (section 4). Robotime Europe : réf. EAB02, 69,99 €, **rupture** [B4] ; prix revendeur `À VÉRIFIER`. **Manque au regard de la méthode.**

**Tableau de marge** (prix de vente 69,90 €, sous le prix officiel UE de 69,99 €)
| Ligne | Montant | Calcul |
|---|---|---|
| Prix d'achat TTC | 52,39 € | 2026-11-12 |
| Livraison / taxes | 0 € / 0 € | « Livraison gratuite, sans frais d'importation » ; UE à confirmer |
| Frais de paiement | 2,397 € | 3 % × 69,90 = 2,097 ; + 0,30 |
| Provision SAV | 3,495 € | 5 % × 69,90 |
| **Coût de revient** | **58,28 €** | 52,39 + 2,397 + 3,495 = 58,282 |
| **Marge nette** | **11,62 €** | 69,90 − 58,282 = 11,618 |
| Coefficient (indicatif) | 1,33 | 69,90 ÷ 52,39 |

**Prix concurrents** : prix officiel UE 69,99 € (rupture) [B4]. Un extrait Kaufland.fr donne 78,25 € + 3,99 € de port, mais un second extrait attribue un prix de 70,35 € à un autre modèle : **non fiable, `À VÉRIFIER`** [P3].
**Conformité** : **électronique** (musique et LED, selon les fiches revendeurs) : CE obligatoire, `À VÉRIFIER`. 593 pièces, difficulté 6, environ 7 h (fiche revendeur [P3]). Âge, GPSR : `À VÉRIFIER`.
**Confiance : faible** (pas de secours, prix concurrent incertain). **Risques** : produit au-dessus de 60 € ; rupture chez la marque ; l'écart de prix avec AliExpress (17,51 €) est visible pour le client.

### N°4 : Horloge à coucou mécanique (produit authentique de la marque leader)

**Fournisseurs**
- **Principal** : annonce 1005012873098546, 48,19 €, 1 000+ ventes, note 4,9, filtre « France » [A16]. La v1 relevait la même annonce à 46,99 € sans filtre : le prix varie.
- **Secours** : **aucun valable** (l'horloge de Noël U7 est un autre produit, vendu 33,00 € par la marque). Robotime Europe : réf. LC901 à 64,99 € et LC901C à 69,99 €, **rupture** [B5]. Revendeur slovaque : 61,90 € HT, 14 en stock [B17].

**Tableau de marge** (prix de vente 64,90 €, sous le prix officiel UE de 64,99 € pour la version bois)
| Ligne | Montant | Calcul |
|---|---|---|
| Prix d'achat TTC | 48,19 € | 2026-11-12 |
| Livraison / taxes | 0 € / 0 € | Idem n°3 |
| Frais de paiement | 2,247 € | 3 % × 64,90 = 1,947 ; + 0,30 |
| Provision SAV | 3,245 € | 5 % × 64,90 |
| **Coût de revient** | **53,68 €** | 48,19 + 2,247 + 3,245 = 53,682 |
| **Marge nette** | **11,22 €** | 64,90 − 53,682 = 11,218 |
| Coefficient (indicatif) | 1,35 | 64,90 ÷ 48,19 |

**Prix concurrents (2026-11-12)** : 69,99 € TTC chez un revendeur européen, retour en stock annoncé le 23 novembre [P1b] ; 64,99 € et 69,99 € chez la marque (rupture) [B5]. Version exacte de l'annonce (bois naturel ou teintée) : `À VÉRIFIER`.
**Conformité** : **électronique** : mouvement à quartz, LED, coucou sonore, 3 piles AAA ou USB-C [P1b][B17]. « 14 ans et plus » chez un revendeur [B17]. 435 pièces, 21,2 × 17 × 34 cm [P1b]. CE et responsable UE : `À VÉRIFIER`.
**Confiance : faible** (pas de secours, électronique). **Risques** : identiques au n°3.

## 6. Tableau comparatif final (classé par marge nette, aucun produit validé)

| Rang | Produit | Zone | Achat | Prix de vente | Coût de revient | Marge nette | Coeff. | Secours valable | Électronique | Points bloquants |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Boîte à musique cerisiers | UE (filtre FR / ES) | 44,59 € | 62,90 € | 49,92 € | **12,98 €** | 1,41 | Oui (11,38 €) | Oui | Expédition UE sur l'annonce, délai, stock, nb d'avis, CE, âge, responsable UE, nom de marque |
| 2 | Spirale à billes | Chine (non confirmé) | 7,19 € | 26,90 € | 14,64 € | **12,26 €** | 3,74 | Oui (11,32 €) | Non | Pays, délai ≤ 14 j, livraison, stock, nb d'avis, âge, originalité, GPSR |
| 3 | Usine à café | UE (filtre FR) | 52,39 € | 69,90 € | 58,28 € | **11,62 €** | 1,33 | **Non** | Oui | Secours, CE, prix concurrent, et les mêmes points que le n°1 |
| 4 | Horloge à coucou | UE (filtre FR) | 48,19 € | 64,90 € | 53,68 € | **11,22 €** | 1,35 | **Non** | Oui | Secours, CE, et les mêmes points que le n°1 |

Toutes les marges ont été recomptées ligne par ligne. Le n°2 est le seul produit sans électronique et sans conflit de marque, mais il dépend d'un délai depuis la Chine non prouvé.

## 7. Proposition de `knowledge/prix-et-marges.md` (à valider par l'humain)

```markdown
# Prix et marges

## Coût de revient (par commande)
prix d'achat TTC + livraison + taxes import (5 € par colis si l'envoi vient de hors UE, toujours comptés ;
0 € si l'expédition UE est confirmée sur l'annonce ou par le fournisseur) + frais de paiement + provision SAV de 5 % du prix de vente

## Seuils
- Marge nette ≥ 10 € par commande : règle stricte, aucune exception
- Raccourci : achat + livraison + taxes ≤ 0,92 × prix de vente − 10,30 € (avec 3 % + 0,30 € de frais de paiement)
- Coefficient ≥ 2,5 et prix de vente entre 25 et 60 € : indicatifs, à signaler s'ils ne sont pas tenus
- Prix arrondis en ,90

## Produits de marque authentiques
- Prix de vente jamais au-dessus du prix officiel de la marque dans l'UE, relevé le même jour
- Revérifier ce prix officiel chaque semaine (une baisse de la marque peut effacer la marge)

## Frais
- Paiement : 3 % + 0,30 € tant que la plateforme n'est pas choisie (À VÉRIFIER)
- TVA : statut à préciser (franchise en base ou assujetti) ; recalculer toutes les marges si la boutique est assujettie

## Prix concurrents
- Moins de 30 jours, avec URL et date ; distinguer « page consultée » et « extrait du moteur de recherche »
- Ne jamais afficher de prix barré sans prix de référence réel (30 jours)

## Révision
- À chaque changement de douane, de plateforme ou de prix fournisseur, et au moins une fois par trimestre
```

## 8. Vérifications à faire par l'humain (sans commander ni contacter)

Dès qu'un point échoue, le produit est exclu. Environ 30 minutes au total.

| Quoi | URL | Infos précises à relever |
|---|---|---|
| Annonces n°1 (principal et secours) | https://fr.aliexpress.com/item/1005013040714032.html ; https://fr.aliexpress.com/item/1005010017003236.html | « Expédié depuis » (pays affiché sur l'annonce), délai maximum vers la France, stock disponible, **nombre d'avis** et note du produit, nom, note et ancienneté de la boutique (boutique officielle de la marque ?), âge indiqué, logo CE sur les photos de la boîte, présence d'un responsable UE |
| Annonce n°2 et secours | https://fr.aliexpress.com/item/1005006030347254.html ; https://fr.aliexpress.com/item/1005006994244114.html | Mêmes infos, plus : frais de livraison pour 1 unité, taxes (3 € + 2 €) ajoutées ou non au paiement, nombre de pièces et dimensions, 20 derniers avis avec photos (pièces manquantes, bois brûlé, notice), comparaison des photos avec les circuits à billes des deux marques leaders |
| Annonces n°3 et n°4 | https://fr.aliexpress.com/item/1005012910429712.html ; https://fr.aliexpress.com/item/1005012873098546.html | Mêmes infos que le n°1, plus : version exacte (référence de la marque, couleur) |
| Prix français des 4 produits | Amazon.fr, Nature & Découvertes, Fnac, Cultura (recherche par nom de modèle) | Prix TTC et frais de port du jour : si un revendeur français vend sous notre prix conseillé, le produit tombe |
| Prix officiel | https://www.rolifeonline.com/en-fr/products/rolife-diy-music-box-sakura-dreamy-tour-amt02 (HTTP 403 pour l'agent) | Prix en euros pour la France, stock, âge indiqué |
| Annonces U12 et U13 | https://fr.aliexpress.com/item/1005007001131332.html ; https://fr.aliexpress.com/item/1005006987416559.html | Référence exacte du modèle (pour chercher son prix officiel), électronique ou non |
| Site B2B officiel | https://robotime-eu.com/b2b-world/ et https://robotime-eu.com/services/ | Les prix affichés sont-ils publics ou revendeurs, HT ou TTC ? Rubrique dropshipping après création de compte (créer un compte n'engage à rien, mais demande l'accord de l'humain) |
| Fabricant polonais | https://wooden.city/contact-us/ | Existe-t-il un formulaire revendeur ou dropshipping ? |
| Pages inaccessibles pour l'agent | https://www.kaufland.fr/product/562152405/ (403) ; https://www.bigbuy.eu (403) ; https://www.robotimeonline.com/collections/rokr (429) ; https://www.rokronline.com (403) | Prix et disponibilité des n°3 et n°4 ; présence de maquettes en bois et coût de l'abonnement BigBuy |

## 9. Brouillons de messages aux fournisseurs (à envoyer par l'humain, seulement s'il le décide)

Les champs entre crochets sont à remplir par l'humain. Aucun message n'a été envoyé.

**A. Robotime Europe** (office-eu@robotime.com ou eu@robotime.com) [B1], en anglais

> Subject: New online retailer in France – dropshipping and reseller terms
>
> Hello,
> I am launching an online store in France dedicated to wooden model kits for adults, and I would like to sell Robotime / ROKR / Rolife products.
> Could you tell me:
> 1. Do you offer dropshipping from your European stock (shipping directly to my customers in France)? If so, what are the fees per order, the delivery time to France, and is there any subscription or minimum?
> 2. What is the reseller discount on your public prices (for example AMT02, EAB02, LC901, LC901C)?
> 3. May I use your official product photos and videos on my website and social media?
> 4. Who is the economic operator responsible in the EU (GPSR) for these products, and do the products with LEDs or sound carry the CE marking with a declaration of conformity?
> 5. How are missing or broken parts handled for end customers?
> 6. What is the recommended minimum age on the packaging of these models?
> Thank you,
> [Prénom Nom], [nom de la boutique], [e-mail professionnel]

**B. Wooden.City** (formulaire https://wooden.city/contact-us/), en anglais

> Hello,
> I am preparing an online store in France for wooden mechanical kits for adults, and your original designs would fit it well. Do you work with resellers or offer dropshipping within the EU? If so, could you share the reseller discount, minimum order, shipping cost and time to France, the right to use your product photos, and the recommended age on your packaging?
> Kind regards, [Prénom Nom], [nom de la boutique]

**C. Vendeurs AliExpress des n°1 à 4** (messagerie AliExpress), en anglais

> Hello, before ordering for my store I need to confirm:
> (1) the country this item ships from and the maximum delivery time to France;
> (2) the available stock;
> (3) the age indicated on the box, and whether the box shows the CE marking and the name and address of an EU responsible person;
> (4) whether I may reuse your product photos and videos;
> (5) whether you send replacement parts if a piece is missing.
> Thank you.

**D. Wood Trick** (page Contacts du site UE) : même contenu que B, en ajoutant « Your EU website mentions 3-6 day delivery within the EU: which country do you ship from? »

## 10. Décisions à prendre par l'humain

1. **Garde-fou « aucun nom de marque »** (`niche.md`). Il a été écrit contre les copies, or les n°1, 3 et 4 sont des produits **authentiques** de la marque leader. Trois options : (a) autoriser la revente de produits authentiques en citant la marque (à faire valider par `conformite-qa` : droit des marques, photos) ; (b) les vendre sans citer la marque (peu crédible, la marque est sur la boîte) ; (c) les refuser. Seul l'humain peut modifier `niche.md`.
2. **Électronique** : les n°1, 3 et 4 ont de la lumière ou du son. `niche.md` ne les tolère que si le CE est vérifié. Faut-il accepter ce type de produit, ou réserver la boutique de départ aux modèles sans électronique (il ne reste alors que le n°2) ?
3. **Autoriser ou non les contacts** de la section 9 (A en priorité). Sans réponse de la marque, les n°3 et n°4 n'ont pas de fournisseur de secours et ne peuvent pas être validés.
4. **Prix au-dessus de 60 €** (n°1, 3, 4) : la fourchette 25-60 € est indicative. Faut-il l'accepter pour ces modèles ?
5. **Budget** : le canal officiel en gros (port de 60 € sous 1 000 €, paiement d'avance) et les places de marché de gros demandent un achat de stock. Le budget reste-t-il à 0 € ? Si un petit stock devenait possible après les premières ventes, ce serait la voie la plus sûre (zéro contrefaçon, secours garanti).
6. **Statut TVA** de la future entreprise (franchise ou assujettie) : toutes les marges en dépendent.
7. **Si les vérifications échouent** : (a) attendre les réponses des fabricants UE (O1, O2, O3) ; (b) passer au plan B crochet (`niche.md`) ; ou (c) relancer un sourcing ciblé sur des fabricants européens de designs originaux, en acceptant l'achat de stock plus tard.
8. **Valider ou modifier** la proposition de `knowledge/prix-et-marges.md` (section 7), notamment la règle « jamais au-dessus du prix officiel ».

## 11. Sources (consultées le 2026-11-12)

**Repris de la v1** (`outputs/2026-11-12-sourcing-produits-maquettes-bois.md`, section 9) : [A5] à [A14] (pages de recherche AliExpress), [C2] à [C12] (prix concurrents), [D1] [D2] (douane), [S9] (délais AliExpress non officiels), [E1] [E2].
- [D1] Douane française, « Petits colis : ce qui change » : https://www.douane.gouv.fr/petits-colis-ce-qui-change-pour-vos-achats-en-ligne
- [D2] Toute l'Europe, 02/11/2026 : https://www.touteleurope.eu/economie-et-social/petits-colis-importes-hors-ue-ce-que-change-le-droit-de-douane-europeen-de-3-euros-sur-les-achats-de-moins-de-150-euros/

**AliExpress, pages de recherche avec filtre d'expédition** (les fiches produit ne renvoient que la navigation ; testé à nouveau sur 1005006960027561)
- [A15] https://fr.aliexpress.com/w/wholesale-maquette-bois-adulte.html?shipFromCountry=FR
- [A16] https://fr.aliexpress.com/w/wholesale-puzzle-3d-bois-adulte.html?shipFromCountry=FR&SortType=total_tranpro_desc
- [A17] https://fr.aliexpress.com/w/wholesale-puzzle-3d-bois-adulte.html?shipFromCountry=ES&SortType=total_tranpro_desc
- [A18] https://fr.aliexpress.com/w/wholesale-puzzle-3d-bois-m%C3%A9canique.html?shipFromCountry=ES
- [A19] https://fr.aliexpress.com/w/wholesale-puzzle-3d-bois-m%C3%A9canique.html?shipFromCountry=PL

**Marques et canaux officiels ou UE**
- [B1] Robotime Europe, accueil : https://robotime-eu.com/
- [B2] Robotime Europe, services : https://robotime-eu.com/services/ ; conditions B2B : https://robotime-eu.com/b2b-world/ ; partenaires : https://robotime-eu.com/partner-store/
- [B3] Robotime Europe, catalogue (pages 1 et 2) : https://robotime-eu.com/robotime-all-products/ ; https://robotime-eu.com/robotime-all-products/page/2/
- [B4] Robotime Europe, catégorie de la gamme mécanique : https://robotime-eu.com/product-category/rokr/
- [B5] Robotime Europe, recherche « cuckoo » : https://robotime-eu.com/?s=cuckoo&post_type=product
- [B6] Kielce, salon Kids' Time 2025, exposant Robotime Europe Ltd (extrait du moteur de recherche, page en 404) : https://www.targikielce.pl/en/kids-time-2025/list-of-exhibitors/robotime-europe-ltd,2855422
- [B7] Wooden.City, accueil : https://wooden.city/en/
- [B8] Wooden.City, paiement et livraison : https://wooden.city/payment-delivery/
- [B9] Wood Trick, site UE : https://eu.woodtrick.com/en-gb
- [B10] Faire : Wood Trick https://www.faire.com/brand/b_6ys9jckamc ; recherche kits mécaniques (Graine Créative, Timberkits) https://www.faire.com/product/p_mzp2mdrqpg
- [B11] Ugears, affiliation (source tierce) : https://www.revshare.so/programs/advertiser/ugears
- [B12] Ugears, distributeur nord-américain sur Faire : https://www.faire.com/brand/b_db6auxbw35
- [B13] Les Jouets en Bois, marque Ugears : https://www.lesjouetsenbois.eu/brands/ugears
- [B14] Ankorstore, DAM Electronics (extrait du moteur de recherche, page en 403) : https://www.ankorstore.com/brand/dam-electronics-31465/maqueta-de-madera-3d-diseno-rail-para-perlas-con-movimiento-mecanico-168-piezas-color-madera-5856014
- [B15] PcComponentes, puzzle 3D DAM Electronics : https://www.pccomponentes.fr/puzzle-3d-dam-electronics-parc-marin-dauphins
- [B16] Scientific-MHD, historique : https://www.scientific-mhd.eu/gb/page/4-about-sfmhd-/
- [B17] Robotoys.eu, horloge coucou LC901C : https://robotoys.eu/wooden-3d-puzzle/clocks-calendars/wooden-mechanical-3d-puzzle-cuckoo-clock-rokr-lc901c-p198
- [B18] BigBuy (page en 403 ; extrait du moteur de recherche) : https://bigbuy.eu/en/puzzle-educa-france-3000-pcs_281122.html
- [B19] Droppery, présentation : https://droppery.helpscoutdocs.com/article/39-what-is-droppery
- Contact dropshipping de la maison mère (extrait du moteur de recherche, page en HTTP 500) : https://rokr.robotime.com/?p=264

**Prix concurrents et fiches produit**
- [P1] 3DJake, gamme mécanique de la marque leader (page consultée) : https://www.3djake.com/rokr
- [P1b] 3DJake, horloge à coucou LC901C (page consultée) : https://www.3djake.com/rokr/cuckoo-clock
- [P2] 3DJake, circuit « spaceport » (extrait du moteur de recherche) : https://www.3djake.com/rokr/marble-spaceport
- [P3] Kaufland.fr, usine à café EAB02 (extraits contradictoires, page en 403) : https://www.kaufland.fr/product/562152405/
- [P4] Ludum, book nook de la même gamme, 44,90 € (repris du rapport analyste-marche v3, source [12]) : https://www.ludum.fr/puzzles-3d/book-nook-rolife-library-of-wonders-258-pieces-15184
- [W1] Recherche d'une licence du manga chez le fabricant : aucun résultat ne relie ce fabricant à la licence ; kits sous licence trouvés chez d'autres fabricants, par exemple https://store.boardgamebarrister.com/one-piece-thousand-sunny-diy-wood-model/
- [W2] Fiches revendeurs de la boîte à musique AMT02 (éclairage, USB-C, dimensions) : https://www.jbhifi.com.au/products/robotime-music-box-sakura-dreamy-tour ; https://robotimeonline.com/products/rolife-sakura-dreamy-tour-diy-music-box-3d-wooden-puzzle-amt02 ; https://ca.manuals.plus/ae/1005009457464503

**Tentatives sans succès le 2026-11-12** : fiches produit AliExpress (contenu vide) ; rolifeonline.com (403) ; robotimeonline.com (429) ; rokronline.com (403) ; rokr.robotime.com (500) ; Ankorstore (403) ; Kaufland.fr (403) ; BigBuy (403) ; ugearsmodels.com/pages/shipping (404) ; robotoys.eu/wholesale (404) ; digitec.ch (délai dépassé).
