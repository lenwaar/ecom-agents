---
agent: sourcing-produits
statut: validé
valide_par: humain
date_validation: 2026-11-14
date: 2026-11-13
sources: [knowledge/memo.md, knowledge/decisions.md, docs/retours-experience.md, https://www.robotimeonline.com/blog/rokr-assembly-guide-q-a-part-1]
prochaine-etape: pilotage-finance (py tools/calcul_marge.py), puis conformite-qa
---

# Grille de relevé AliExpress : 15 maquettes ROKR à vérifier (tâche T70)

## Résultat

- **15 modèles ROKR candidats** listés ci-dessous, tous avec un mécanisme ou une partie mobile, aucun avec électronique connue.
- **0 prix officiel relevé** : robotimeonline.com a refusé toutes les lectures automatiques le 2026-11-13 (erreur 429 « trop de requêtes » sur les pages de collection, en, uk, es et fr ; erreur 500 sur rokr.robotime.com et store.robotime.com). Seule la page de blog officielle a pu être lue (références des modèles). Tous les prix officiels sont donc `À VÉRIFIER` : l'humain les relève en même temps que la grille (colonne « Prix officiel (€) »).
- **5 modèles écartés** d'office pour électronique (voir plus bas).
- Les mécanismes « sans pile » de plusieurs candidats restent à confirmer sur la fiche (colonne « Point à vérifier » du tableau des candidats).

## Décisions pour l'humain

1. Faire le relevé (10 min, marche à suivre ci-dessous), puis lancer `py tools/calcul_marge.py outputs/2026-11-13-sourcing-produits-grille-aliexpress.md`.
2. Relever aussi le prix officiel en euros sur robotimeonline.com (sélecteur de pays : France, devise EUR) pour chaque modèle : il sert de prix de référence de vente.

## Marche à suivre (navigateur, 10 minutes environ)

1. Ouvrir **robotime.aliexpress.com** (boutique officielle Robotime, store 2884002). Vérifier en haut de page que le nom de la boutique et le numéro 2884002 correspondent.
2. Pour chaque ligne de la grille : taper le nom anglais du modèle et sa référence (ex. « LK504 ») dans la recherche **de la boutique** (pas la recherche générale d'AliExpress).
3. Sur la fiche, choisir la variante exacte (attention : certaines fiches regroupent plusieurs modèles, ou une version « D » électrique).
4. Dans **« Expédié depuis » / « Ships from »** (au-dessus du bouton d'achat, à côté des variantes), choisir un pays de l'UE : France, Espagne, Pologne, Allemagne, Italie, République tchèque, Belgique... Si la liste ne propose que « China » ou aucun pays de l'UE : écrire `aucun stock UE` dans « Expédié depuis » et **laisser le reste de la ligne vide**.
5. Relever, avec l'adresse de livraison réglée sur la France :
   - **Lien AliExpress** : l'adresse de la fiche (s'arrêter à `.html`).
   - **Prix AliExpress (€)** : prix de l'article affiché pour la variante UE choisie, TTC (celui payé, hors coupons personnels ou promo « nouvel utilisateur »).
   - **Livraison (€)** : frais de port vers la France, bloc « Livraison » à droite ; `0` si « Livraison gratuite ».
   - **Délai (jours)** : nombre de jours **maximal** du bloc « Livraison » (ex. « livré entre le 18 et le 22 nov. » : compter jusqu'au 22 depuis la date du relevé).
   - **Note** : la note du produit sur 5, sous le titre (étoiles).
   - **Ventes** : le nombre « vendus » sous le titre.
   - **Stock** : « X disponibles » près du sélecteur de quantité (si rien ne s'affiche, écrire `non affiché`).
6. Écrire les nombres sans symbole € (virgule ou point acceptés). Noter la date du relevé en bas du fichier.

## Seuils (règles strictes)

Expédié depuis l'UE · délai ≤ 14 jours · note ≥ 4,5/5 · stock ≥ 100 · marge nette ≥ 10 € (objectif 15 €, cotisations 12,3 % et SAV 5 % compris), calculée par `py tools/calcul_marge.py outputs/2026-11-13-sourcing-produits-grille-aliexpress.md`.

## Grille à remplir

| N° | Modèle | Réf. | Prix officiel (€) | Lien AliExpress | Prix AliExpress (€) | Livraison (€) | Expédié depuis | Délai (jours) | Note | Ventes | Stock |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Pendulum Clock | LK501 | À VÉRIFIER | | | | | | | | |
| 2 | Treasure Box | LK502 | À VÉRIFIER | | | | | | | | |
| 3 | Cruiser Motorcycle | LK504 | À VÉRIFIER | | | | | | | | |
| 4 | Open Closed Sign | LK506 | À VÉRIFIER | | | | | | | | |
| 5 | Tractor | LK401 | À VÉRIFIER | | | | | | | | |
| 6 | Locomotive | LK701 | À VÉRIFIER | | | | | | | | |
| 7 | Air Vehicle | LK702 | À VÉRIFIER | | | | | | | | |
| 8 | Space Shuttle | LKA02 | À VÉRIFIER | | | | | | | | |
| 9 | Classic Gramophone (version à manivelle) | LKB01 | À VÉRIFIER | | | | | | | | |
| 10 | Classic Printing Press | LK602 | À VÉRIFIER | | | | | | | | |
| 11 | Marble Climber | LG504 | À VÉRIFIER | | | | | | | | |
| 12 | Waterwheel Coaster | LG501 | À VÉRIFIER | | | | | | | | |
| 13 | 3D Pinball Machine | EG01 | À VÉRIFIER | | | | | | | | |
| 14 | Grand Prix Car 1:16 | MC401 | À VÉRIFIER | | | | | | | | |
| 15 | Diva Gramophone (boîte à musique) | AMK82 | À VÉRIFIER | | | | | | | | |

Date du relevé AliExpress : `À REMPLIR`

## Points de vigilance

- **Photos et vidéos (leçon n° 8)** : la boutique AliExpress ne peut pas autoriser l'usage des photos Robotime. Aucune photo ni vidéo officielle sur le site ou en publicité avant l'**accord écrit de Robotime** (demande préparée en T72).
- **Conformité** (pour chaque modèle retenu, sur la fiche ou la photo de la boîte) : marquage CE jouet présent ou non, âge **14 ans et plus** imprimé sur la boîte (« adultes et adolescents » ne suffit pas), avertissement petites pièces, fabricant et opérateur responsable dans l'UE (GPSR). Validation finale par `conformite-qa`.
- **Électronique** : refuser toute variante avec lumière, moteur, pile, câble USB ou musique électronique (ex. gramophone `LKB01D`). Une boîte à musique mécanique à manivelle ou à remontoir reste admise.
- **Originalité** : ce sont des modèles de la marque, achetés à sa boutique officielle ; ne jamais écrire « authentique » sans preuve que le store 2884002 est bien exploité par Robotime (à confirmer dans la demande T72).

## Annexe : détail des candidats

Pièces et temps : seules quelques valeurs ont été vues, via un moteur de recherche, sur des pages non ouvertes ; elles sont à confirmer sur la fiche officielle.

| N° | Réf. | Mécanisme / partie mobile | Pièces | Temps annoncé | Point à vérifier |
|---|---|---|---|---|---|
| 1 | LK501 | Horloge à balancier et engrenages | À VÉRIFIER | À VÉRIFIER | Mouvement sans pile |
| 2 | LK502 | Coffre à combinaison, engrenages | 123 (notice, manuals.plus) | À VÉRIFIER | |
| 3 | LK504 | Moto à engrenages, roues et moteur à pistons animés | 420 (rokr.robotime.com) | environ 5 h (rokr.robotime.com) | |
| 4 | LK506 | Panneau « ouvert / fermé » tourné par une manivelle | À VÉRIFIER | À VÉRIFIER | |
| 5 | LK401 | Tracteur à ressort | À VÉRIFIER | À VÉRIFIER | |
| 6 | LK701 | Locomotive à remontoir (ressort) | À VÉRIFIER | À VÉRIFIER | |
| 7 | LK702 | Véhicule aérien à engrenages | À VÉRIFIER | À VÉRIFIER | Type d'entraînement |
| 8 | LKA02 | Navette avec séquence de lancement mécanique | À VÉRIFIER | À VÉRIFIER | Absence de lumière |
| 9 | LKB01 | Gramophone à manivelle | À VÉRIFIER | À VÉRIFIER | Ne pas confondre avec LKB01D (électrique) |
| 10 | LK602 | Presse d'imprimerie à levier | À VÉRIFIER | À VÉRIFIER | |
| 11 | LG504 | Circuit à billes à manivelle, sans moteur | 233 (store.robotime.com) | environ 6 h (store.robotime.com) | |
| 12 | LG501 | Circuit à billes avec roue à aubes | À VÉRIFIER | À VÉRIFIER | Manivelle ou moteur |
| 13 | EG01 | Flipper mécanique | À VÉRIFIER | À VÉRIFIER | Absence de lumière et de son |
| 14 | MC401 | Voiture à l'échelle 1:16, pièces mobiles | À VÉRIFIER | À VÉRIFIER | Présence réelle d'un mécanisme |
| 15 | AMK82 | Boîte à musique mécanique | À VÉRIFIER | À VÉRIFIER | Manivelle ou remontoir, sans électronique |

**Écartés (électronique)** : Owl Clock LK503 (présentée avec pile sur le blog officiel), Vitascope LK601 (génératrice à manivelle et ampoule), Classic Gramophone LKB01D (version électrique), Marble Spaceport (moteur intégré), Marble Night City (câble USB-C). Zodiac Wall Clock LC601 écartée par prudence (mouvement d'horloge probablement à pile, `À VÉRIFIER`).

## Sources (consultées le 2026-11-13)

- Blog officiel Robotime, références ROKR : https://www.robotimeonline.com/blog/rokr-assembly-guide-q-a-part-1
- Pages officielles inaccessibles (429) : https://www.robotimeonline.com/collections/rokr, https://www.robotimeonline.com/collections/mechanical-gears
- Résultats de recherche (pages non ouvertes) : https://rokr.robotime.com/product/rokr-cruiser-motorcycle-lk504/, https://rokr.robotime.com/?p=3146, https://manuals.plus/asin/B07HDLTDTY
