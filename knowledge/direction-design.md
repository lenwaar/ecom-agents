# Direction design de la boutique (v2)

**Exigences de l'humain (2026-11-12)** : une boutique au niveau des meilleurs sites actuels, qui donne envie de cliquer. Références montrées par l'humain : sites « cinématiques » récents (horlogerie avec engrenages en gros plan, automobile sombre et éditoriale, parfumerie avec effets de fumée, agences web soignées). Base de composants propre dans l'esprit **shadcn/ui**.
**Prototype de référence à égaler ou dépasser : `docs/reference/prototype-accueil.html`** (ouvrir dans un navigateur).
S'applique à `architecte-web`, `developpeur-web` et à tout visuel produit par l'équipe.

## Règles absolues
- **Aucun emoji** dans l'interface et les textes du site. **Icônes Lucide** uniquement, même taille et même épaisseur partout.
- Jamais de look « template gratuit » : pas de dégradés criards, d'ombres lourdes, de pop-up agressives, de bannières clignotantes.
- L'effet « waouh » ne doit **jamais** gêner l'achat : sur les fiches produit et le parcours de paiement, la clarté passe avant l'animation.

## Deux registres
| Registre | Où | Style |
|---|---|---|
| **Cinématique** | Accueil, pages de collection, « L'atelier », landing de campagne | Fond sombre profond, grande typographie éditoriale, visuels plein écran, narration au défilement, mouvement continu et subtil |
| **Boutique claire** | Catalogue, fiche produit, pages d'aide et légales | Fond clair chaud, cartes nettes façon shadcn/ui, beaucoup d'air, informations lisibles d'un coup d'œil |
La transition entre les deux registres est soignée (ex. section claire qui « monte » sur le fond sombre avec de grands coins arrondis, comme dans le prototype).

## Style
| Élément | Direction |
|---|---|
| Typographie | **Titres : serif éditoriale** à grand contraste (type Cormorant Garamond, avec italiques en couleur d'accent) en très grande taille. **Texte et interface : sans-serif moderne** (type Inter ou Geist) |
| Couleurs | Registre sombre : bleu nuit presque noir + **laiton** comme accent. Registre clair : blanc cassé chaud + texte presque noir. Une seule couleur d'action |
| Matière | Léger grain de film sur les fonds sombres, halos de lumière doux, reflets métalliques sur le laiton |
| Visuels | Macro-photographie ou rendus 3D : engrenages, bois découpé au laser, mains qui assemblent, lumière de lampe de bureau. Même direction artistique partout |
| Composants | Coins arrondis réguliers, bordures fines, ombres très légères, boutons en pilule avec flèche qui glisse au survol |
| Navigation | Barre fixe minimale, qui devient translucide et floutée au défilement |

## Mouvement
- **Narration au défilement** : sections épinglées où le texte change étape par étape pendant qu'un visuel (engrenages, maquette) tourne ou se construit.
- **Révélations** : titres qui montent ligne par ligne, cartes en cascade, parallaxe légère.
- **Micro-interactions** : survol des cartes (léger soulèvement, rotation du visuel), boutons (flèche qui glisse, pression), états de focus visibles.
- Durées : interface 150 à 400 ms ; révélations 0,8 à 1,2 s avec courbe « expo out » ; jamais de mouvement linéaire sauf rotation continue.
- **Respect de `prefers-reduced-motion`** : tout le contenu reste lisible et complet sans animation.
- Performance : animer seulement `transform` et `opacity` ; mesurer avec Lighthouse (objectif ≥ 90 en performance sur mobile pour les pages boutique).

## Pile technique associée
- Tailwind CSS (thème en variables), composants Astro dans l'esprit shadcn/ui, icônes Lucide.
- **GSAP + ScrollTrigger** pour la narration au défilement (gratuit, licence standard GSAP), défilement fluide optionnel (Lenis).
- Effets 3D ou WebGL (fumée, particules, modèle 3D) seulement sur l'accueil, chargés en différé, avec une image fixe de repli.

## Contrôle qualité visuel
Avant de valider une page : captures mobile et ordinateur à plusieurs positions de défilement, comparaison avec le prototype de référence, aucun emoji, contrastes WCAG AA, test avec animations réduites, score Lighthouse.
