---
agent: sourcing-produits
statut: validé   # toujours cette valeur
valide_par: humain
date_validation: 2026-11-14
date: 2026-11-14
fiche: P11
version: v3
suite-de: outputs/2026-11-12-sourcing-produits-maquettes-bois-v2.md, outputs/2026-11-13-cowork-releve-aliexpress.md
sources: [knowledge/niche.md, knowledge/contraintes.md, knowledge/prix-et-marges.md, knowledge/decisions.md, fiches AliExpress citées (relevé du 2026-11-14, adresse France, EUR), tools/calcul_marge.py]
prochaine-etape: humain (décision sur le prix revendeur Robotime), puis conformite-qa
---

# Sourcing v3 : maquettes Robotime ROKR sur AliExpress qui passent les règles de `knowledge/`

## 1. Résumé décisionnel

- **21 fiches Robotime relevées** le 2026-11-14 (18 nouvelles, plus 3 du relevé Cowork du 13/11), dans le navigateur, adresse France, prix en euros.
- **1 seule fiche passe toutes les règles strictes** : **Coffee Factory (EAB02)**. Elle est vendue par la boutique officielle, expédiée depuis l'Espagne, livrée en 7 jours, notée 5,0 sur 26 avis, avec 273 en stock et sans électronique déclarée.
- **Mais son prix ne tient pas** : la marge de 15 € oblige à vendre **108,90 €** (101,90 € pour 10 €), alors que le client voit le même kit à **72,39 €** sur AliExpress. C'est 50 % plus cher pour le même produit : **invendable**. C'est le même blocage que Cowork avait relevé le 13/11.
- **Recommandation : ne retenir aucun produit au prix public.** La seule voie reste le **prix revendeur du programme de dropshipping Robotime**, à demander dans les messages à Robotime (fiche P11). Il faudrait un prix d'achat d'environ **44 €** pour vendre la Coffee Factory autour de 72 € avec 15 € de marge (calcul en section 3).
- Confiance : **moyenne**. Le stock n'est pas affiché sur 9 fiches, et 3 fiches viennent de boutiques « Robotime Local Store » et « Robotime Global Store » dont le lien avec Robotime n'est pas prouvé.

## 2. Hypothèses

Règles appliquées (`contraintes.md`, `niche.md`, `decisions.md`) : vendu par la **boutique officielle Robotime** (store 2884002) · **expédié depuis l'UE** · livraison **≤ 14 jours** · note **≥ 4,5 avec ≥ 20 avis** · stock **≥ 100** · **mécanisme ou partie mobile** · **aucune électronique** (LED, lumière, moteur, pile, musique électronique) · âge 14+ · marge nette **≥ 10 €** (objectif 15 €).

Marge : `tools/calcul_marge.py`, paramètres par défaut (Stripe 1,5 % + 0,25 €, `À VÉRIFIER` ; cotisations 12,3 % ; SAV 5 % ; éco-participation `À VÉRIFIER`, comptée 0 €). Délai : jours entre le relevé (14/11) et la date de livraison la plus tardive affichée. Prix relevés pendant une promotion (fin le 18/11) : les prix normaux sont environ 10 % plus hauts.

## 3. Le seul produit qui passe, et pourquoi il ne suffit pas

| Coffee Factory EAB02 | Valeur | Source |
|---|---|---|
| Vendeur | Robotime Official Store | fiche 1005011556920650 |
| Prix AliExpress | 72,39 € TTC, livraison gratuite | idem, 14/11 |
| Expédition, délai | Espagne, livré du 16 au 21 nov. (7 j) | idem |
| Note, ventes, stock | 5,0 (26 avis), 117 vendus, 273 disponibles | idem |
| Électronique | « Is Electric : no », modèle manuel | idem ; lumière `À VÉRIFIER` sur la notice |
| Prix pour 10 € de marge | 101,90 € | `calcul_marge.py` |
| Prix pour 15 € de marge | 108,90 € (marge 15,79 €) | idem |
| Prix d'achat qui permet de vendre 72,90 € avec 15 € de marge | environ 44 € (39 % de remise) | calcul : 72,90 × 0,812 − 0,25 − 15 = 43,94 € |

Le prix de vente conseillé dépasse aussi la fourchette indicative de 25 à 60 €.

## 4. Candidats et éliminations

| # | Fiche AliExpress | Modèle | Prix (€) | Vendeur | Expédié de | Délai | Note (avis) | Stock | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 1005011556920650 | Coffee Factory EAB02 | 72,39 | Officiel | Espagne | 7 j | 5,0 (26) | 273 | **Passe les règles**, prix invendable |
| 2 | 1005008158267980 | Dream Gift Factory EAB01 | 59,99 | Officiel | Espagne | 8 j | 4,9 (99) | 1 159 | Exclu : vendu ailleurs « with Light and Music » (lumière = électronique), `À VÉRIFIER` |
| 3 | 1005010337637747 | A-Frame Cabin | 56,69 | Officiel | France | 6 j | ? (18) | 33 | Exclu : sans mécanisme, stock < 100, avis < 20 |
| 4 | 1005008378077258 | Locomotive à vapeur LKA01 | 58,39 | Global Store | Espagne | 7 j | 4,9 (33) | non affiché | Exclu : canal officiel non prouvé, stock `À VÉRIFIER` |
| 5 | 1005008146405817 | The Last City (circuit à billes) | 54,69 | Local Store | Espagne | 7 j | ? (99) | non affiché | Exclu : « Automatic » (moteur), canal non prouvé |
| 6 | 1005006987307894 | Circuits à billes, 5 modèles | 33,99 | Local Store | Espagne | 7 j | ? (9) | non affiché | Exclu : avis < 20, canal non prouvé |
| 7 | 1005011691677587 | Cuckoo Clock | 63,69 | Local Store | Espagne | 7 j | — | non affiché | Exclu : 9 ventes, aucun avis, canal non prouvé |
| 8 | 1005011774972125 | Space Shuttle LKA02 | 55,39 | ? | ? | 8 j | 5,0 (23) | ? | Exclu : « with Lighting » (électronique) |
| 9 | 1005010628019446 | Hip-Hop Street MR03S | 58,39 | ? | ? | 8 j | 5,0 (20) | ? | Exclu : vendeur et pays non confirmés, moteur `À VÉRIFIER` |
| 10 | 1005007031974479 | Magic Amusement Park EA | 41,99 | ? | ? | 8 j | 4,8 (18) | ? | Exclu : avis < 20 |
| 11 | 1005007101327850 | Swing Ride EA02 | 48,59 | ? | ? | 7 j | 4,9 (12) | 25 (Cowork) | Exclu : avis < 20, stock < 100 |
| 12 | 1005007203130084 | Steampunk Clock STLC601 | 54,69 | ? | ? | 7 j | 5,0 (5) | ? | Exclu : mouvement à quartz (pile) |
| 13 | 1005008869787696 | Seahouse Barque | 34,19 | ? | ? | 8 j | 4,9 (152) | ? | Exclu : décor sans mécanisme |
| 14 | 1005008455131565 | Luminous Globe | 54,39 | ? | ? | 7 j | — | ? | Exclu : LED |
| 15 | 1005008379455269 | Emperor Scorpion MI04 | 54,69 | Global Store | Allemagne | 7 j | ? (7) | non affiché | Exclu : LED, métal |
| 16 | 1005008544495801 | Insectes MI (plastique) | 61,99 | Officiel | Chine | 16 j | — | 15 | Exclu : délai, plastique, stock |
| 17 | 1005002442165595 | Circuits à billes, 5 modèles | 41,19 | Officiel | Chine | 16 j | 4,0 (4) | ? | Exclu : délai, note |
| 18 | 1005006658370901 | Circuits à billes, 3 modèles | 35,19 | ? | ? | 8 j | — (0) | ? | Exclu : aucun avis |
| 19 | 1005010500391938 | Machine à billes à manivelle LGX01 | 20,59 | Officiel | Chine | 16 j | 5,0 (2) | 11 | Exclu : délai, avis, stock |
| 20 | 1005006682522092 | Stagecoach Music Box | 37,19 | Officiel | Espagne | 10 j | 4,x (37) | 46 | Exclu : stock < 100 (Cowork, 13/11) |
| 21 | 1005006123983658 | Classic City Tram Car | 51,69 | Officiel | Allemagne | 10 j | 5,0 (14) | non affiché | Exclu : avis < 20 (Cowork, 13/11) |

« ? » : information non chargée par la fiche lors du relevé. Ces produits sont de toute façon exclus pour une autre raison.

## 5. Grille pour `tools/calcul_marge.py`

| N° | Modèle | Réf. | Prix officiel (€) | Lien AliExpress | Prix AliExpress (€) | Livraison (€) | Expédié depuis | Délai (jours) | Note | Ventes | Stock |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Coffee Factory | EAB02 | À VÉRIFIER | aliexpress.com/item/1005011556920650.html | 72,39 | 0 | Espagne | 7 | 5,0 | 117 | 273 |
| 2 | Dream Gift Factory | EAB01 | À VÉRIFIER | aliexpress.com/item/1005008158267980.html | 59,99 | 0 | Espagne | 8 | 4,9 | 600 | 1159 |
| 4 | Locomotive à vapeur | LKA01 | À VÉRIFIER | aliexpress.com/item/1005008378077258.html | 58,39 | 0 | Espagne | 7 | 4,9 | 243 | non affiché |
| 20 | Stagecoach Music Box | EA | À VÉRIFIER | aliexpress.com/item/1005006682522092.html | 37,19 | 0 | Espagne | 10 | 4,5 | 37 | 46 |

Date du relevé AliExpress : 2026-11-14

## 6. Décisions à prendre par l'humain

1. **Accepter la conclusion : aucun produit au prix public.** Le lancement dépend du prix revendeur Robotime.
2. **Ajouter aux messages à Robotime** (corrections R1 à R5 en cours) : prix revendeur ou de dropshipping pour EAB02, EAB01 et LKA01 ; stock en Espagne ; confirmation que « Robotime Local Store » et « Robotime Global Store » sont bien exploitées par Robotime.
3. **Dream Gift Factory** : regarder la notice ou demander à Robotime si EAB01 contient une lumière. Si non, c'est le meilleur candidat (4,9 sur 99 avis, 1 159 en stock).

## 7. Vérifications à faire par l'humain

- Fiche 1005011556920650 : description et photos de la boîte, pour l'âge 14+ imprimé, l'absence de lumière et le fabricant ou responsable UE (GPSR).
- Fiche 1005008158267980 : présence ou non d'une lumière dans EAB01.
- Fiche 1005008378077258 : stock et identité de « Robotime Global Store ».

## 8. Sources (consultées le 2026-11-14, navigateur, adresse France, EUR)

Fiches `fr.aliexpress.com/item/<numéro>.html` du tableau de la section 4. Recherche « robotime rokr » avec le filtre d'expédition depuis l'Espagne. Relevé Cowork du 2026-11-13 pour les lignes 20 et 21.

## Annexe : résultat de `py -3 tools/calcul_marge.py` sur la grille de la section 5

| N° | Modèle | Coût (€) | Prix conseillé (€) | Marge (€) | Plancher 10 € (€) | Verdict de l'outil |
|---|---|---|---|---|---|---|
| 1 | Coffee Factory | 72,39 | 108,90 | 15,79 | 101,90 | RETENU (seuils fournisseur) |
| 2 | Dream Gift Factory | 59,99 | 92,90 | 15,19 | 86,90 | RETENU par l'outil, **exclu ici** pour la lumière probable (l'outil ne contrôle pas l'électronique) |
| 4 | Locomotive à vapeur | 58,39 | 90,90 | 15,17 | 84,90 | ÉCARTÉ : stock non renseigné |
| 20 | Stagecoach Music Box | 37,19 | 64,90 | 15,26 | 58,90 | ÉCARTÉ : stock 46 < 100 |

Frais Stripe et éco-participation `À VÉRIFIER` (éco-participation comptée 0 € : marge surestimée d'autant).
