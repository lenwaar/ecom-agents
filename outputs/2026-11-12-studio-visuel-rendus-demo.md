---
agent: studio-visuel
statut: à-valider
date: 2026-11-12
sources: [tests/scenarios/studio-visuel.md, knowledge/catalogue-demo.md, knowledge/marque.md, knowledge/direction-design.md, site/src/content/produits/, outputs/2026-11-12-architecte-web-conception-boutique-v2.md, outputs/2026-11-12-architecte-web-conception-boutique-v2-partie-2.md]
prochaine-etape: validation humaine (planche contact), puis developpeur-web (T34, T35)
---

# Rendus 3D des 10 produits de démonstration et visuels d'ambiance

## 1. Résumé
L'atelier de rendu `studio/` (Three.js + Playwright + sharp) produit **60 vues produits** (6 vues × 10 produits) et **3 visuels d'ambiance** pour l'accueil, chacun en WebP 1600 px et 800 px : **126 fichiers, 5,7 Mo** au total dans `site/public/`. Tout est généré par le code : aucune photo, aucune image téléchargée, aucun logo ni design d'une marque existante. Ce sont des **rendus de démonstration** : ils ne représentent aucun produit réel sourcé (à remplacer par des photos ou des rendus fidèles au produit du fournisseur avant toute vente).

Planche contact : `outputs/planches/2026-11-12-studio-visuel-planche-contact.jpg` (une ligne par produit, une colonne par vue, plus la ligne des ambiances).

## 2. Fichiers produits
| Dossier | Contenu |
|---|---|
| `site/public/produits/<slug>/` | `face`, `trois-quarts`, `detail`, `dessus`, `situation`, `boite`, chacune en `-1600.webp` (1600 × 2000) et `-800.webp` (800 × 1000), format 4:5 |
| `site/public/ambiance/` | `bureau-nuit`, `comparateur-planches`, `comparateur-monte` : `-1600.webp` paysage 1600 × 1000 (ordinateur) et `-800.webp` portrait 800 × 1000 (mobile, cadrage dédié) |
| `outputs/planches/` | planche contact JPEG |
| `studio/` | code source de l'atelier (voir §4) ; `studio/.cache/` (PNG haute définition) et `node_modules/` ne sont pas versionnés |

Les noms des vues correspondent au champ `vues:` des fiches de `site/src/content/produits/` (textes alternatifs déjà écrits par `redacteur-catalogue`).

## 3. Les vues
| Vue | Rôle | Réglage |
|---|---|---|
| face | vignette catalogue, première image | fond clair blanc cassé, lumière studio identique pour les 10 produits |
| trois-quarts | volume | même fond, même lumière, caméra en biais |
| detail | gros plan sur le mécanisme | faible profondeur de champ (flou d'objectif) |
| dessus | lecture du plan ou du profil | vue plongeante ou de profil selon le produit |
| situation | registre « nuit et laiton » | bureau de nuit, lampe, livres, fenêtre étoilée ; décor non fourni (le dit le texte alternatif) |
| boite | contenu du kit | planches prédécoupées à plat, pièces en laiton et accessoires |

Ambiances de l'accueil :
- `bureau-nuit` : boîte à musique sur le bureau de nuit (héros ou section « L'atelier »).
- `comparateur-planches` / `comparateur-monte` : **même caméra, même lumière**, pour le comparateur glissant « De la planche à l'objet » (section 3 de la spec v2) : planches de l'horloge sur le bureau, puis l'horloge montée au mur.

## 4. L'atelier `studio/`
- `lib/materials.js` : contreplaqué de peuplier et bouleau procéduraux (veinage, nœuds), **chants de découpe laser brûlés plus foncés**, laiton brossé / poli / foncé, papier kraft.
- `lib/parts.js` : pièces découpées (profils extrudés avec trous), profils d'engrenages à développante, assemblages à créneaux, tiges et capuchons.
- `lib/rigs.js` : éclairage studio (fond clair) et décor de nuit ; mise à plat des pièces pour la vue `boite`.
- `lib/engine.js`, `lib/main.js` : accumulation d'échantillons (anticrénelage, profondeur de champ, ombres douces).
- `scenes/<slug>.js` : un fichier par produit, mécanismes engrenés (pas et entraxes calculés), plus 3 scènes d'ambiance.
- `render.js` : rendu automatisé dans Chromium sans interface, export PNG puis WebP. `contact.js` : planche contact.

Commandes :
```
cd studio
npm install          # installe aussi Chromium pour Playwright
npm run render       # régénère tout (mesuré ici : ~20 s par vue produit, ~1 min par ambiance, soit ~25 min)
node render.js --only moulin-a-vent-manivelle --views detail   # une seule vue
npm run planche      # planche contact seule
npm run preview      # visionneuse locale
```
Sans carte graphique : `STUDIO_GL=swiftshader npm run render` (rendu logiciel, beaucoup plus lent).

## 5. Contrôle qualité (fait sur la planche et en gros plan)
- Cohérence catalogue : même fond, même lumière, même cadrage 4:5 pour les vues `face` et `trois-quarts` des 10 produits.
- Bois : veinage et chants foncés visibles sur toutes les pièces ; laiton crédible sur les axes, capuchons, peigne et cylindre de la boîte à musique.
- Mécanismes : engrenages engrenés, visibles en vue `detail` pour la boîte d'initiation, l'horloge, la locomotive, le planétaire et maintenant le moulin.
- Corrections faites en fin de tâche :
  1. Vue `boite` de la boîte à musique : manquait, rendue.
  2. Vue `detail` du moulin : gros plan flou sans sujet (caméra derrière un montant du socle). Nouveau cadrage bas, à hauteur du socle ajouré : pignon de la manivelle, roue à couronne et arbres en laiton. Le texte alternatif de la fiche (« transmission entre la manivelle et l'axe des ailes ») correspond.
  3. Ambiance `comparateur-planches` : les planches sortaient du cadre (on ne voyait que le mur). Planches rapprochées du mur, champ élargi, caméra commune aux deux images du comparateur, donc `comparateur-monte` refait aussi : l'horloge y est entière.

## 6. Limites et points à revoir
- **Rendus de démonstration** : formes et proportions inventées pour illustrer le catalogue de démonstration. Ils ne doivent pas servir à vendre un produit réel (risque de pratique commerciale trompeuse si le produit livré diffère). À remplacer produit par produit après sourcing.
- Vues `detail` de la voiture rétro et du coffre-fort : correctes mais moins parlantes que les autres (carrosserie et porte au premier plan) ; à reprendre si le temps le permet.
- Vue `boite` : les planches sont lisibles mais petites en vignette 800 px pour les grosses maquettes (grue, locomotive).
- Aucune `etiquette` (photo d'étiquette GPSR) : impossible sans produit réel, le champ reste `null`.
- Le niveau visuel est à juger par l'humain sur la planche contact, par rapport à `docs/reference/prototype-accueil-v2.html`.

## 7. Retouches T38 (2026-11-13)
Statut inchangé : `à-valider`. Rendus de démonstration uniquement, aucun produit réel, rien de publié.

### Corrections
1. **Taches grises au sol (vues `face`, `trois-quarts`, `dessus`, et aussi `detail` et `boite`, qui utilisent le même studio)**. Cause : le sol recevait l'ombre d'une lumière « dôme » tirée au hasard à chaque échantillon (96 ombres dures superposées, d'où le bruit en paquets, très visible en vue plongeante). Correction (`studio/lib/rigs.js`, `bakeGroundShadow`) : le sol ne reçoit plus d'ombre en temps réel. On projette l'objet une seule fois sur le plan du sol (ou du mur pour l'horloge), en trois couches floutées par un flou gaussien : contact serré, occlusion douce, ombre portée de la lumière principale. Résultat : fond parfaitement uni, une seule ombre douce, sans bruit, identique dans toutes les vues catalogue. Le dôme reste utilisé pour l'occlusion sur l'objet lui-même, avec des directions stratifiées (Halton) au lieu du hasard.
2. **Vues `dessus`** (boîte à musique, planétaire en particulier) : même correction, vérifiées une par une.
3. **Engrenages de la boîte « Initiation »**. Cause : dans `meshPhase` (`studio/lib/parts.js`), le signe du rapport de transmission était inversé ; le calage ne tombait juste que par hasard. Formule corrigée ; l'entraxe reste la somme des rayons primitifs plus 0,15 mm de jeu. Vérifié sur les profils réels par `studio/verifier-engrenages.js` : 0 interférence et jeu minimal de 0,05 mm pour les 3 paires de l'Initiation, mais aussi pour l'horloge (3 paires), le planétaire (4 paires) et la boîte à musique (1 paire), qui utilisent la même fonction et sont donc corrigés aussi.
4. **Ambiance `comparateur-planches`**. Recomposition avec une nouvelle caméra commune, plus serrée, pour les deux images du comparateur. Les planches de l'horloge sont posées debout contre le mur, à l'endroit exact où l'horloge est accrochée dans `comparateur-monte`. L'horloge est descendue de 120 mm, et trois roues déjà détachées sont posées sur le bureau. Lampe, livres et carnet déplacés pour dégager le sujet. Mêmes dimensions (1600 × 1000 et 800 × 1000), même point de vue, même lumière dans les deux images. Le site les utilise aussi en fond décoratif (alt vide) sur la page atelier, ce qui reste compatible.
5. **Fiabilité du rendu** (`studio/render.js`) : lors d'une perte du contexte WebGL (pilote graphique), certaines images sortaient vides ou fausses sans erreur (8 vues vides, plus 2 vues « bois plein cadre » au premier passage). Désormais, toute perte de contexte signalée par la page, ou une image uniforme, invalide le rendu et relance un essai. Toutes les vues concernées ont été refaites et contrôlées.

### Fichiers régénérés
- Les 60 vues produits (10 × 6, WebP 1600 et 800 px), car le sol, les engrenages et l'occlusion changent presque partout. Les 3 ambiances (`bureau-nuit`, `comparateur-planches`, `comparateur-monte`). Mêmes noms, formats et dimensions ; `site/src/` non modifié ; `npm run build` passe (58 pages).
- Planche contact régénérée au même emplacement : `outputs/planches/2026-11-12-studio-visuel-planche-contact.jpg`.
- Poids total : 5,4 Mo (produits) + 0,2 Mo (ambiances).

### Commandes
```
cd studio
npm run render                    # tout (~30 min ici)
node verifier-engrenages.js       # contrôle d'engrènement (entraxe, interférence, jeu)
node render.js --only boite-engrenages-initiation --views face,dessus
node apercu.js <slug>             # aperçu 3 × 2 des vues d'un produit (studio/.cache/)
```

### Ce qui reste imparfait
- Horloge murale : l'ombre portée sur le mur reste très discrète, car la platine n'est qu'à 12 mm du mur. C'est physiquement juste, mais l'horloge peut sembler un peu détachée du fond.
- Comparateur, version portrait (800 px) : le tiers supérieur de `comparateur-planches` est du mur vide. C'est le prix de l'alignement avec l'horloge, plus haute que les planches.
- Les pertes de contexte WebGL restent fréquentes sur cette machine (7 nouveaux essais pendant le rendu complet) : elles sont maintenant détectées et refaites, mais le rendu complet prend environ 30 min.
- Les limites du §6 restent valables (rendus de démonstration à remplacer par des photos réelles avant toute vente).

## 8. Synchro n°11 : automate à manivelle
Date : 2026-11-13 (T44, partie 2/2). Statut inchangé : `à-valider`. Rendus de démonstration uniquement : ils ne représentent aucun produit réel, aucun logo ni design de marque, rien n'est publié.

### Ce qui change
- **Nouvelle scène** `studio/scenes/automate-manivelle.js`. Elle reprend les mêmes rigs, matériaux, réglages catalogue, la même manivelle que le moulin et les mêmes entures que la boîte à musique. L'automate est un caisson à entures de 150 × 90 × 100 mm, ouvert en façade, avec un hublot dans le dos et une fenêtre cintrée sur chaque flanc. Un arbre à cames en laiton est entraîné par une manivelle sur le flanc droit. Il porte trois cames en bois de 6 mm, maintenues par des bagues d'arrêt en laiton : une came en poire au centre, et deux excentriques en opposition de phase. Trois poussoirs à plateau traversent une réglette de guidage puis le plateau supérieur.
- **Sujet de la scène** (choix neutre de l'atelier, puisque la fiche indique « À VÉRIFIER ») : un petit voilier porté par le poussoir central, entre deux vagues mobiles portées par les poussoirs latéraux. Derrière, une vague fixe et un soleil découpé sur un mât. Pas de personnage, ni de marque, ni d'élément tiré d'un produit existant.
- **Cohérence mécanique** : la hauteur de chaque poussoir est calculée à partir du profil réel de sa came. Le calcul prend le point le plus haut de la came sous le plateau de 8 mm, à l'angle de la manivelle. L'arbre, les cames et la manivelle tournent du même angle (-28°). Les plateaux touchent donc leurs cames, ce qui se vérifie en vue `detail`. Les pièces portées gardent au moins 3 mm de jeu au-dessus du plateau au point bas de leur came.
- **6 vues rendues** : `face`, `trois-quarts`, `detail` (arbre à cames et poussoirs vus de biais par la façade ouverte), `dessus` (profil côté manivelle, conforme au texte alternatif de la fiche), `situation`, `boite`. Elles sont dans `site/public/produits/automate-manivelle/`, en `-1600.webp` (1600 × 2000) et `-800.webp` (800 × 1000), pour 497 Ko au total. Les autres produits n'ont pas été régénérés.
- **Book nook retiré** : suppression du dossier `site/public/produits/book-nook-ruelle-horloger/`, de la scène `studio/scenes/book-nook-ruelle-horloger.js` et de son cache (`studio/.cache/png/book-nook-ruelle-horloger/`, `studio/.cache/apercu-book-nook-ruelle-horloger.jpg`). La fonction `standingBook` de `studio/lib/rigs.js` ne servait qu'au book nook : elle est supprimée, tout comme la mention du mode `shelf`. Les livres du bureau de nuit (`book()`, `booksAt`) restent en place, et les ambiances ne sont pas touchées.
- **Planche contact** régénérée au même emplacement : `outputs/planches/2026-11-12-studio-visuel-planche-contact.jpg`. Elle compte 10 produits, l'automate en première ligne (ordre alphabétique des dossiers), plus les ambiances. Contrôles faits sur la planche : sols unis, automate lisible, cames visibles en vue détail.

### Commandes
```
cd studio
node render.js --only automate-manivelle       # les 6 vues de l'automate et la planche contact (~2,5 min ici)
node apercu.js automate-manivelle              # aperçu 3 × 2 dans studio/.cache/
npm run render                                 # tout depuis zéro (10 produits + ambiances)
```

### Limites
- Vue `face` : la caméra est commune à tout le catalogue, donc les cames y sont vues par la tranche. Leur profil se lit en `trois-quarts` et en `detail`.
- Vue `dessus` (profil) : la scène du dessus est vue par la tranche. Elle est moins parlante que les autres vues, mais conforme au texte alternatif (« vu de profil, avec la manivelle au premier plan »).
- Vue `boite` : trois planches en colonne, assez petites en vignette 800 px (même limite que la grue et la locomotive).
- Le sujet de la scène (voilier) et toutes les dimensions sont inventés pour la démonstration. Ils sont à remplacer par les photos du modèle réel après sourcing.
- Une perte de contexte WebGL a eu lieu pendant le rendu. Elle a été détectée, et la vue a été refaite automatiquement.
