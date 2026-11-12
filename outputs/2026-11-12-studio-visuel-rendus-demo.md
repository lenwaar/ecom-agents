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
