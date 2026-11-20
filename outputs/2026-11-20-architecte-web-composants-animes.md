---
agent: architecte-web
statut: à-valider
date: 2026-11-20
sources:
  - https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md
  - https://github.com/DavidHDev/react-bits (README, package.json)
  - https://raw.githubusercontent.com/DavidHDev/react-bits/main/src/ts-tailwind/Backgrounds/Aurora/Aurora.tsx
  - https://raw.githubusercontent.com/DavidHDev/react-bits/main/src/ts-tailwind/Backgrounds/LightRays/LightRays.tsx
  - https://raw.githubusercontent.com/DavidHDev/react-bits/main/src/ts-tailwind/TextAnimations/SplitText/SplitText.tsx
  - https://raw.githubusercontent.com/DavidHDev/react-bits/main/src/ts-tailwind/Components/ScrollStack/ScrollStack.tsx
  - https://raw.githubusercontent.com/DavidHDev/react-bits/main/src/ts-tailwind/Components/Carousel/Carousel.tsx
  - https://skiper-ui.com/docs/terms-of-service
  - https://skiper-ui.com/pricing
  - https://raw.githubusercontent.com/Ashutoshx7/VengenceUI/main/LICENSE
  - https://www.vengenceui.com/docs
  - https://gsap.com/standard-license
  - https://registry.npmjs.org/@astrojs/react/latest
  - https://registry.npmjs.org/@gsap/react/latest
  - https://registry.npmjs.org/react-dom/latest
  - https://registry.npmjs.org/lucide-react/latest
  - docs/site-technique.md
  - knowledge/direction-design.md
  - site/src/styles/global.css
  - site/src/components/accueil/HerosAccueil.astro
  - site/src/components/accueil/MaquettesDuMoment.astro
  - site/src/components/produit-modele/FicheProduit.astro
prochaine-etape: developpeur-web
---

# Composants animés premium (V2-2) : spécification

## Résultats (1 page)

**Recommandation : 4 composants, tous issus de React Bits (version gratuite).** Le cinquième emplacement reste vide : aucun autre composant n'apporte de quoi vendre davantage.

| # | Composant | Où | Pourquoi il aide à vendre | Version sans animation (`prefers-reduced-motion`) |
|---|---|---|---|---|
| 1 | **Aurora** (fond) | Accueil, fond du héros | Ambiance « premium » dès le premier écran, sans image lourde | Fond CSS actuel du héros (dégradés radiaux), aucun canvas |
| 2 | **SplitText** (titre) | Accueil, `h1` du héros | Le regard va d'abord sur la promesse | Titre affiché d'un bloc, sans découpage |
| 3 | **ScrollStack** (cartes empilées) | Accueil, section « Sélection » | Montre les produits un par un, chacun avec son prix et son lien | Grille actuelle de `CarteProduit` |
| 4 | **Carousel** | Fiche produit, visuels | Sur téléphone, les captures du tableur se parcourent au pouce, au-dessus du prix | Visuels empilés en colonne, comme aujourd'hui |

**Licences (vérifiées sur la source le 2026-11-20)**
- React Bits : **MIT + Commons Clause**. L'usage commercial dans un site est autorisé. Il est interdit de vendre ou de redistribuer les composants eux-mêmes. Preuve : https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md. React Bits Pro est payant : refusé.
- GSAP et `@gsap/react` : licence standard GSAP, gratuite y compris en usage commercial, SplitText compris (https://gsap.com/standard-license). GSAP est déjà dans le site.
- **Skiper UI : refusé.** Les conditions disent « All intellectual property rights are reserved » et « for your own personal use ». Les composants « Premium » coûtent 129 $.
- **Vengeance UI : licence MIT valable, aucun composant retenu.** La bibliothèque est faite pour Next.js et Framer Motion, et React Bits couvre déjà les 4 besoins.

**Garde-fous communs**
- Seuls ces 4 composants sont des îlots React `client:visible`.
- Aucun effet ne passe sur le prix, le bouton d'achat ou la barre d'achat mobile.
- Couleurs prises uniquement dans `global.css`, icônes Lucide, aucun emoji.
- Le bouton Pause de l'accueil arrête le fond animé.

**Poids** : `@astrojs/react` pèse 19 679 octets décompressé et `@gsap/react` 19 128 octets (registre npm). Ce sont des tailles de paquet, pas le poids envoyé au navigateur. Le poids JS réel par page (React compris) reste **À VÉRIFIER** : `developpeur-web` le mesure sur la build avant et après.

**Décisions pour l'humain**
1. **Ajouter React au site.** C'est le prix des 4 îlots, et il pèse sur les pages qui en ont un. Recommandation : oui, si la mesure garde Lighthouse mobile à 90 ou plus (objectif de `direction-design.md`). Sinon, on garde le héros actuel et on ne conserve que le carrousel.
2. **ScrollStack remplace le rail horizontal épinglé** de « Les maquettes du moment ». Recommandation : oui, il garde un seul effet par section.
3. **SplitText remplace l'entrée ligne par ligne actuelle du `h1`** (GSAP), sans s'y ajouter. Recommandation : oui, ou ne pas le retenir du tout si vous jugez l'effet actuel suffisant.
4. **Le fond Aurora ne tourne pas sous 768 px** : canvas non monté, fond CSS à la place. C'est une recommandation pour la batterie et la vitesse. À confirmer.

---

## Annexe A : règles d'intégration communes

1. **Installation** : `npx astro add react`, puis versions figées dans `site/package.json`, comme les autres paquets : `@astrojs/react` 7.1.9, `react` et `react-dom` 19.3.1, `@gsap/react` 2.1.2, `lucide-react`. Pour `lucide-react`, prendre la version la plus proche de `@lucide/astro` 1.72.0 (dernière publiée : 1.77.0, licence ISC), pour que les icônes soient identiques. La compatibilité de `@astrojs/react` 7.1.9 avec Astro 6.4.8 est **À VÉRIFIER** à l'installation : la build doit passer sans avertissement.
2. **Emplacement** : `site/src/components/animes/` avec un fichier par composant (`Aurora.tsx`, `SplitText.tsx`, `ScrollStack.tsx`, `Carousel.tsx`), plus les enveloppes décrites ci-dessous. Prendre la variante **TS-TW** (TypeScript + Tailwind) : `npx jsrepo@latest add https://reactbits.dev/r/<Nom>-TS-TW`, ou recopie depuis l'URL brute de l'annexe B.
3. **En-tête de chaque fichier recopié** :
   `// Adapté de React Bits (https://reactbits.dev), <URL du fichier>, commit <SHA>. Licence MIT + Commons Clause, Copyright (c) 2026 David Haz. Modifications : <liste>.`
   Noter le SHA du commit lu, pour figer la version.
4. **Chargement** : `client:visible` uniquement. Aucun `client:load`, aucun autre composant React.
5. **Mouvement réduit** : chaque enveloppe lit `matchMedia('(prefers-reduced-motion: reduce)')` et rend la version statique décrite pour chaque composant. Elle suit aussi `html.js-anim`, la convention actuelle : sans cette classe, version statique.
6. **Sans JavaScript** : le HTML rendu au serveur doit déjà être complet et visible. Aucun `visibility: hidden` ni `opacity: 0` dans le rendu serveur.
7. **Textes** : tous en français (libellés ARIA compris). Aucun texte de démonstration d'origine ne reste.
8. **Emoji** : `tools/verifier_livrables.py` ne contrôle que `.md`, `.astro`, `.html`, `.ts`, `.js`, `.css` et `.json`, pas `.tsx`. Vérifier les `.tsx` à la main (recherche d'emoji) et proposer à l'humain d'ajouter `.tsx` et `.jsx` au vérificateur.
9. **Couleurs** : uniquement les variables de `global.css`. Hex autorisés en prop WebGL seulement s'ils recopient une variable, avec le nom de la variable en commentaire.
10. **Mesures pour le rapport** : JS par page (accueil, une fiche produit, une page légale) avant et après ; Lighthouse mobile ; captures 390 et 1280 px avant et après, normales et en mouvement réduit, dans `outputs/captures/2026-11-20-animations/`.

## Annexe B : détail par composant

### 1. Aurora (fond du héros)
- **Source** : page https://reactbits.dev/backgrounds/aurora ; fichier https://raw.githubusercontent.com/DavidHDev/react-bits/main/src/ts-tailwind/Backgrounds/Aurora/Aurora.tsx
- **Dépendances** : `react` seul (WebGL natif, aucun `ogl` dans la version lue). Poids : **À VÉRIFIER**.
- **Comportement d'origine (lu dans le code)**
  - Pause hors écran (IntersectionObserver) et onglet caché.
  - Prop `paused`.
  - En mouvement réduit : horloge figée, pointeur ignoré, pas d'intro.
  - Canvas `aria-hidden="true"`.
- **Placement** : dans `HerosAccueil.astro`, calque absolu `inset-0` entre le fond CSS et les engrenages. Enveloppe `FondHeros.tsx` avec `aria-hidden="true"` sur la `div`, et `pointer-events-none`.
- **Props imposées** :
  - `colorStops={['#1E3A5F', '#C8A15A', '#0A0F1A']}` : `--action-bleu-nuit`, `--accent-laiton`, `--fond-nuit`.
  - `amplitude={0.6}`, `blend={0.6}`, `speed={0.4}` (mouvement lent : la direction design demande un mouvement « continu et subtil »).
  - `opacity={0.45}`, `mouseInteraction={false}`, `intro={true}`, `lightMode={false}`, `dpr={1.5}`.
  - `paused` relié à `pause.active` (`scripts/etat-animation.ts`) par `pause.ecouter`.
  - Valeurs de départ à ajuster à l'œil sur capture, sans dépasser `opacity` 0,5.
- **Version statique** (mouvement réduit, moins de 768 px, pas de WebGL2 ou pas de JS) : on ne monte pas de canvas. Le fond CSS actuel de `.heros` (dégradés radiaux laiton et bleu nuit) suffit.
- **Accessibilité** :
  - Contraste : le texte `#F5F1E8` doit rester à 4,5:1 au moins sur le point le plus clair du fond animé. Avec `opacity` 0,45, ce point est **À VÉRIFIER** au compte-gouttes sur la capture. L'ombre `.ombre-texte` est conservée.
  - Aucun élément focalisable.
- **Interdits** : rien par-dessus les boutons « Découvrir » et « Trouver » ni la ligne de livraison (`z-index` du texte supérieur, déjà `z-[1]`).
- **Solution de rechange documentée** : LightRays (https://raw.githubusercontent.com/DavidHDev/react-bits/main/src/ts-tailwind/Backgrounds/LightRays/LightRays.tsx). Non retenu : pas de prop `paused`, il continue d'animer à 35 % de vitesse en mouvement réduit, et il suit la souris par défaut.

### 2. SplitText (titre du héros)
- **Source** : page https://reactbits.dev/text-animations/split-text ; fichier https://raw.githubusercontent.com/DavidHDev/react-bits/main/src/ts-tailwind/TextAnimations/SplitText/SplitText.tsx
- **Dépendances** : `gsap` (déjà présent, 3.15.1), plugins `gsap/ScrollTrigger` et `gsap/SplitText` (inclus dans `gsap`), `@gsap/react` 2.1.2. Poids ajouté : **À VÉRIFIER**.
- **Comportement d'origine** :
  - Attend `document.fonts.ready`.
  - Masque l'élément (`visibility: hidden`) jusqu'au découpage.
  - En mouvement réduit, aucun découpage.
  - `revert()` au démontage.
  - Aucun attribut ARIA ajouté par le composant.
- **Placement** : remplace le `h1#titre-heros` de `HerosAccueil.astro`, en gardant l'`id`, les classes de taille et les deux lignes (« La mécanique, » puis la ligne en italique `em`). Le texte reste le texte calculé du site, jamais un texte d'origine. Supprimer l'entrée `[data-ligne]` du `h1` dans `scripts/accueil.ts` pour éviter une double animation.
- **Props imposées** :
  - `tag="h1"`, `splitType="lines"` (révélation ligne par ligne, celle de la direction design ; pas de lettres une à une).
  - `effect="rise"`, `mask={true}`, `duration={1.0}`, `delay={120}`, `ease="expo.out"`.
  - `trigger="load"` (le titre est déjà à l'écran), `loop={false}`, `hoverEffect="none"`, `textAlign="left"`.
  - Pas de `color` : la couleur vient des classes du thème, et l'italique en laiton de `.titre-serif em`.
- **Modifications obligatoires** :
  - Le rendu serveur et le rendu sans JS montrent le titre visible. Le `visibility: hidden` ne s'applique que si `html.js-anim` est présent.
  - Passer l'option `aria: 'auto'` à `SplitText.create` pour que les lecteurs d'écran lisent la phrase entière et non des morceaux. Le support de cette option par GSAP 3.15.1 est **À VÉRIFIER** dans la documentation GSAP ; sinon, mettre `aria-label` sur le `h1` avec le texte complet, et `aria-hidden="true"` sur les lignes découpées.
  - Durée totale de l'animation de 1,5 s au plus : aucun mouvement de plus de 5 s, donc pas besoin de bouton Pause.
- **Version statique** : titre affiché d'un bloc, sans découpage, à l'identique du rendu actuel sans animation.
- **Risque** : le `h1` est probablement l'élément LCP de l'accueil. Mesurer le LCP avant et après ; si le LCP mobile se dégrade de façon visible, abandonner SplitText (décision 3).

### 3. ScrollStack (cartes produit empilées)
- **Source** : page https://reactbits.dev/components/scroll-stack ; fichier https://raw.githubusercontent.com/DavidHDev/react-bits/main/src/ts-tailwind/Components/ScrollStack/ScrollStack.tsx
- **Dépendances** : `react` seul (pas de Lenis dans la version lue : lissage maison). Poids : **À VÉRIFIER**.
- **Placement** : section `data-moment` de `MaquettesDuMoment.astro` (titre « Sélection »), à la place du rail épinglé, à toutes les largeurs. Le titre, la mention « Rendus 3D de démonstration » et le lien « Tout le catalogue » restent en Astro, hors de l'îlot.
- **Données** : l'enveloppe `PileProduits.tsx` reçoit des props sérialisables, calculées en Astro depuis la même sélection (`selection_du_moment`) :
  `[{ slug, nom, prixTexte, lien, visuel: { src, alt }, demo, accroche }]`
  - `prixTexte` est formaté comme dans `CarteProduit` (« TTC » compris), ou « À définir » pour une démonstration.
  - Chaque `ScrollStackItem` contient une carte React `CarteEmpilee.tsx` qui reprend à l'identique le contenu et les styles de `CarteProduit.astro` : visuel, nom, prix, badge Démonstration, lien vers la fiche.
- **Props imposées** :
  - `useWindowScroll={true}` (jamais de zone de défilement interne).
  - `smoothScroll={false}` : on ne détourne pas la molette, le défilement reste celui du système.
  - `blurAmount={0}`, `tiltAmount={0}`, `rotationAmount={0}`, `dimAmount={0.15}`.
  - `itemDistance={100}`, `itemStackDistance={24}`, `stackPosition="15%"`, `baseScale={0.9}`, `itemScale={0.03}`, `snap={false}`.
- **Garde-fou prix** :
  - La carte du dessus est toujours entière, nette et sans assombrissement.
  - Une carte recouverte garde visible une bande de 24 px (son haut), et on a déjà vu son prix.
  - Prix et lien sont dans le corps de chaque carte, jamais dans une partie qui sera recouverte avant d'avoir été vue en entier.
  - Au plus 5 cartes ; au-delà, le lien « Tout le catalogue » suffit.
- **Clavier** :
  - Chaque carte n'a qu'un lien (toute la carte), avec focus visible (anneau de `global.css`).
  - Ordre de tabulation dans l'ordre visuel.
  - Quand une carte reçoit le focus, elle doit être entièrement visible : `scrollIntoView` dans l'enveloppe si le composant ne le fait pas (**À VÉRIFIER** au test clavier).
- **Version statique** (mouvement réduit, sans JS, sans `html.js-anim`) : l'enveloppe rend la grille actuelle (1 colonne, 2 dès 640 px, 4 dès 1024 px) avec les mêmes `CarteEmpilee`, sans `ScrollStack`. Le rendu serveur est cette grille.

### 4. Carousel (visuels de la fiche produit)
- **Source** : page https://reactbits.dev/components/carousel ; fichier https://raw.githubusercontent.com/DavidHDev/react-bits/main/src/ts-tailwind/Components/Carousel/Carousel.tsx
- **Dépendances** : `react` ; `@hugeicons/react` et `@hugeicons/core-free-icons` **supprimés** et remplacés par `lucide-react` (`ChevronLeft`, `ChevronRight`, taille et épaisseur identiques au reste du site : `stroke-width` 1.75). Les icônes de démonstration (`CommandIcon`, `Timer02Icon`, etc.) et les 5 éléments de démonstration sont supprimés. Poids : **À VÉRIFIER**.
- **Comportement d'origine (lu dans le code)** :
  - Flèches gauche et droite, Début et Fin au clavier.
  - Rôles `region`, `group` et `aria-roledescription`.
  - `aria-live="polite"` hors lecture automatique.
  - Saut sans ressort en mouvement réduit.
- **Placement** : `FicheProduit.astro`, bloc « Visuels », **seulement si `visuels.length >= 2`** (sinon l'`img` actuelle). Le bloc Achat (titre, prix TTC, bouton, réassurance), `BarreAchatMobile` et le bloc GPSR restent hors de l'îlot et ne sont jamais recouverts.
- **Props imposées** :
  - `items={visuels.map(v => ({ image: v.src, alt: v.alt }))}` : l'`alt` vient de la fiche produit, jamais vide.
  - `effect="slide"` (ni tilt ni cube), `indicator="dots"`, `arrows={true}`.
  - `autoplay={false}` (jamais de lecture automatique), `loop={false}`, `draggable={true}`.
  - `theme="light"`, `frame={false}`, `radius={18}` (`--radius-carte`), `aspectRatio={1}`, `peek={0}`.
  - `baseWidth` : la largeur de la colonne (mesurée par l'enveloppe, `ResizeObserver`).
- **Libellés à traduire dans le code** :
  - `aria-label="Carousel"` → « Visuels du produit ».
  - « Previous slide » / « Next slide » → « Visuel précédent » / « Visuel suivant ».
  - « Go to slide N » → « Afficher le visuel N ».
  - « 1 of 5 » → « 1 sur 5 ».
- **Accessibilité** :
  - Zone tactile des flèches et des points de 44 × 44 px au moins.
  - Flèches en `--action-bleu-nuit` sur `--fond-carte` (contraste **À VÉRIFIER** sur capture, attendu 4,5:1 au moins).
  - Point actif signalé autrement que par la couleur seule (taille ou forme).
- **Version statique et sans JS** : rendu serveur = les visuels en colonne, comme aujourd'hui (premier visuel `loading="eager"`, les autres `lazy`). En mouvement réduit, le carrousel reste utilisable, sans animation (comportement d'origine).
- **Démonstration** : aucun changement aux règles actuelles (bandeau, `noindex`, bouton inactif). Mention « Rendus 3D de démonstration » si les visuels sont des rendus.

## Annexe C : critères d'acceptation (pour developpeur-web puis conformite-qa)
- [ ] `npm run build` sans erreur ni avertissement ; 0 lien cassé ; `npm test` vert.
- [ ] Seuls les 4 composants sont des îlots React, tous en `client:visible`.
- [ ] Sans JS, en mouvement réduit et à 390 px : tout le contenu est visible, prix et boutons compris.
- [ ] Le bouton Pause de l'accueil arrête Aurora.
- [ ] Aucun emoji dans les `.tsx` ; icônes Lucide seulement ; aucun texte anglais visible ni lu par un lecteur d'écran.
- [ ] Prix, bouton d'achat et barre d'achat mobile jamais couverts, à aucune position de défilement (captures à 3 positions).
- [ ] En-tête de licence présent dans chaque fichier recopié ; poids JS par page et Lighthouse mobile notés dans le rapport.
