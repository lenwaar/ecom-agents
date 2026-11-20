---
agent: developpeur-web
statut: à-valider
date: 2026-11-20
sources: [outputs/2026-11-20-architecte-web-composants-animes.md, outputs/2026-11-20-conformite-qa-accessibilite-animations.md, docs/site-technique.md, https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md, https://registry.npmjs.org/@astrojs/react/5.0.7, outputs/captures/2026-11-20-animations/]
prochaine-etape: conformite-qa (nouveau contrôle, lecteur d'écran réel) puis validation humaine
---

# Composants animés V2-2 : mise en œuvre

## Résumé
Les 4 composants React Bits sont intégrés, en local seulement (rien n'est en ligne ni commité). Ce sont des îlots React `client:visible` : 3 sur l'accueil (fond Aurora, titre SplitText, cartes ScrollStack), 1 sur la fiche produit (carrousel, à partir de 2 visuels). Le rendu serveur de chaque îlot est la version statique. Le mouvement réduit donne la page d'avant, sans canvas et sans découpage du titre. La build passe sans avertissement, avec 0 lien cassé sur 3 512, et les 15 tests sont verts. Le poids JS de l'accueil est multiplié par 2,5 : c'est la décision n°1.

## Poids JS par page (fichiers chargés après défilement complet, lus dans `dist/`, gzip niveau 9 calculé en local)
| Page | Avant | Après | Écart gzip |
|---|---|---|---|
| Accueil | 8 fichiers, 137 400 o brut, 54 506 o gzip | 14 fichiers, 387 774 o brut, 136 865 o gzip | **+82 359 o** (dont environnement React : 66 870 o) |
| Fiche démo `/produits/exemple-demo/` (1 visuel) | 0 | 0 | 0 (pas de carrousel sous 2 visuels) |
| Fiche à 3 visuels (build de test, données copiées hors dépôt) | 0 | 4 fichiers, 244 905 o brut, 78 437 o gzip | **+78 437 o** |
| Page légale `/mentions-legales/` | 0 | 0 | 0 |

Le détail par fichier est dans `poids-js.json` (dossiers `avant/`, `apres/` et `apres-carrousel-test/`). Le Lighthouse mobile n'a pas été mesuré : aucun outil Lighthouse n'est installé, donc **À VÉRIFIER** avant la mise en ligne.

## Vérifications faites
- **Build et tests** : `npm run build` passe sans avertissement. `verifier_liens` trouve 0 lien cassé, `npm test` donne 15 sur 15, et `py tools/verifier_livrables.py` affiche 0 erreur.
- **Îlots** : l'accueil en a 3, tous `client="visible"`. La fiche démo et la page légale n'en ont aucun. Aucun `client:load`.
- **Captures** : `outputs/captures/2026-11-20-animations/` contient `avant/` et `apres/`, à 390 et 1280 px, en mouvement normal et en mouvement réduit émulé. La section Sélection est capturée à 3 positions de défilement. Il y a aussi le héros à l'écran et le dossier `apres-carrousel-test/`. Les captures ne montrent ni erreur JS ni débordement horizontal.
- **Mouvement réduit** : pas de canvas, titre visible et non découpé, grille statique des cartes.
- **Pause** : Aurora fait 0 rendu pendant la pause et reprend ensuite (mesure sur `drawArrays`).
- **Prix et boutons** : ils ne sont jamais couverts. Chaque carte empilée est entière, prix compris, avant d'être recouverte : la largeur est bornée par la hauteur d'écran. Les boutons du héros restent au-dessus du fond. Le bloc Achat est hors de l'îlot du carrousel.
- **Clavier et ARIA du carrousel** : les flèches, Début et Fin fonctionnent. Les libellés sont en français (« Visuel suivant », « Afficher le visuel 2 », « 2 sur 3 »). Flèches et points mesurent 44 × 44 px. Le point actif a une forme de trait.
- **Titre** : le `aria-label` est « La mécanique, pièce par pièce. » et les morceaux découpés sont masqués aux lecteurs d'écran.
- **Contraste** : le titre (`#F5F1E8`) atteint au moins **9,8:1** sous ses lettres, à toutes les largeurs. Mesure glyphe par glyphe, voir « Corrections après conformite-qa ».
- **Décalage de mise en page (CLS)** : 0 sur la fiche, après correction (il était à 0,183). Sur l'accueil, il est de 0,002 à 0,004.
- **Emoji et licence** : aucun emoji dans les `.tsx`. L'en-tête MIT + Commons Clause, la source et le commit sont présents dans les 4 copies.

## Écarts avec la spécification
1. **`@astrojs/react` est en 5.0.7, pas en 7.1.9.** Les versions 7.x et 6.x exigent Vite 8 (Astro 7). La version 5.0.7 va avec Astro 6.4.8 et Vite 7.3.8.
2. **Couleurs d'Aurora réordonnées (bleu nuit, noir nuit, laiton)**, réglage à l'œil permis par la spec. Dans l'ordre prévu, le dégradé passait par le vert et le magenta.
3. **La Pause est lue sur la classe `html.anim-pause`**, et non via `pause.ecouter`. Le résultat est le même, sans lien au module du script.
4. **Avec JavaScript, la fiche montre seulement le 1er visuel avant le montage du carrousel.** C'est ce qui évite le décalage de mise en page. Sans JS, tous les visuels restent en colonne, comme prévu.
5. **Pas de vrai produit avec 2 visuels ou plus.** Le carrousel n'a été vérifié que sur une build de test : copie de `data/` en dossier temporaire, dist reconstruit ensuite avec les vraies données.

## Corrections après conformite-qa (verdict À CORRIGER, 8 points)
Les vérifications ont été faites au navigateur (Playwright). Les captures sont dans `outputs/captures/2026-11-20-animations/corrections-qa/`.

1. **Contraste « 1,54:1 » : c'était une erreur de mesure, pas un défaut du site.** Cette valeur venait de ma première mesure, faite à 1280 px sur toute la boîte du `h1`. Cette boîte englobe les engrenages, qui sont à droite du texte, hors des lettres (`fond-titre.png`, dossier temporaire). Mesuré lettre par lettre, en lisant le pixel le plus clair sous chaque glyphe, le contraste minimal est de 9,83:1 à 390 px, 13,83 à 768, 13,67 à 1024, 13,61 à 1280, 12,50 à 1440 et 12,91 à 1920 (`fond-titre-<largeur>.png`). L'objectif est de 3:1 pour un gros texte. Aucun voile n'a été ajouté : il n'était pas nécessaire.
2. **Aurora suit aussi `html.js-anim`.** `useAnimationPermise` observe la classe de `<html>` (fichier `etat.ts`). Test avec GSAP bloqué : `js-anim` est retiré, aucun canvas n'est monté, le bouton Pause reste caché et le titre est visible.
3. **Carrousel : les flèches utilisent `aria-disabled` au lieu de `disabled`.** Le clic est ignoré au bout de la série et le style passe à `aria-disabled:opacity-35`. Le focus reste sur « Visuel suivant » au dernier visuel et sur « Visuel précédent » au premier, à 390 et à 1280 px.
4. **`aria-hidden` sur les diapositives inactives** (lecture : 1 et 2 masquées, 3 lue). `inert` n'est pas utilisé, car il empêcherait de cliquer sur un visuel voisin, et les diapositives ne contiennent aucun élément focalisable.
5. **Fiche : sécurité de 4 s.** Test avec tout le JavaScript des îlots bloqué : à 1 s, `js-visuels` est présent et 1 visuel est affiché ; à 5 s, la classe est retirée et les 3 visuels sont affichés.
6. **ScrollStack : `role="list"` et `role="listitem"`.** On compte 4 éléments de liste pour 4 cartes.
7. **Test clavier réel à 390 et 1280 px.** Tab puis Maj+Tab sur les 4 cartes : chaque carte est entière à l'écran et non recouverte (contrôle `elementFromPoint` aux 4 coins et sur le prix). L'anneau de focus est visible (2 px plein laiton) et l'ordre est l'ordre visuel. Captures : `clavier-<largeur>-tab-carte-1/4.png` et `clavier-<largeur>-maj-tab-carte-1.png`.
8. **Accents de « pièce » : aucune correction nécessaire.** En taille réelle (×2), le rendu est identique avec et sans découpage (`accents-normal.png`, `accents-reduit.png`). Le texte est déjà en NFC (é et è précomposés, U+E9 et U+E8). L'accent grave très redressé est le dessin de l'italique de Cormorant Garamond, déjà visible sur la capture `avant/`.

Après ces corrections : `npm run build` passe sans avertissement avec 0 lien cassé sur 3 512, `npm test` donne 15 sur 15, et `verifier_livrables` affiche 0 erreur. L'accueil charge maintenant 136 874 o gzip, soit +9 o.

## Voir en local
`cd site`, puis `npm install`, `npm run build` et `npm run preview` (http://localhost:4321/). Pour les captures et le poids JS : `node outils/captures-animations.mjs apres --reduit --positions`.

## Décisions pour l'humain
1. **Garder React sur l'accueil (+82 Ko gzip, ×2,5) ?** Recommandation : oui, seulement si le Lighthouse mobile mesuré reste à 90 ou plus. Sinon, retirer les îlots de l'accueil.
2. **Carrousel de la fiche (+78 Ko gzip dès 2 visuels).** Une alternative en CSS pur (défilement accroché, 0 Ko) ferait le même service au pouce. Recommandation : l'étudier avant le premier vrai produit.
3. **SplitText cache le titre (le LCP probable) jusqu'à l'hydratation**, avec un secours qui l'affiche à 3 s au plus. Faut-il le garder ? À trancher avec la mesure LCP.
4. **ScrollStack en colonne centrée de 340 px sur ordinateur** (captures `selection-1280-*`). Le rendu vous convient-il ?
5. **Aurora est très discrète** (opacité 0,45). On peut monter jusqu'à 0,5 au plus.
6. **Ajouter `.tsx` et `.jsx` au contrôle d'emoji de `tools/verifier_livrables.py`** ? Aujourd'hui ce contrôle se fait à la main.

## Fichiers modifiés ou créés
Dans `site/` :
- configuration : `package.json`, `package-lock.json`, `astro.config.mjs`, `tsconfig.json` ;
- composants : `src/components/animes/` (Aurora, SplitText, ScrollStack, Carousel, FondHeros, TitreHeros, PileProduits, CarrouselVisuels, etat), `src/components/accueil/HerosAccueil.astro`, `src/components/accueil/MaquettesDuMoment.astro`, `src/components/produit-modele/FicheProduit.astro` ;
- scripts : `src/scripts/accueil.ts`, `src/scripts/accueil-sections.ts` ;
- outils : `outils/captures-animations.mjs`.

Hors de `site/` : `docs/site-technique.md`.
