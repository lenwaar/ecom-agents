---
agent: conformite-qa
statut: à-valider
date: 2026-11-20
mode: audit
verdict: À CORRIGER
sources:
  - https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/ (RGAA 4.1.2, consulté le 2026-11-20)
  - https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32019L0882 (directive 2019/882, art. 3 et 4, texte non relu le 2026-11-20 : page vide au chargement)
  - https://gsap.com/docs/v3/Plugins/SplitText/ (option aria, v3.13+, consulté le 2026-11-20)
  - https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md (licence citée par la spec)
  - outputs/2026-11-20-developpeur-web-composants-animes.md, outputs/2026-11-20-architecte-web-composants-animes.md
  - outputs/captures/2026-11-20-animations/ (apres/heros-1280-ecran, apres/selection-390-position-2 et 3)
prochaine-etape: developpeur-web applique les 8 corrections, puis nouveau contrôle conformite-qa (test clavier et lecteur d'écran réels)
---

# Accessibilité des composants animés V2-2

## 1. Verdict : À CORRIGER
**10 conformes, 8 à corriger (dont 1 à vérifier), 0 bloquant.** Rien n'empêche de continuer en local. Les 8 points doivent être réglés avant toute mise en ligne. Contrôle fait sur le code et les captures. Je n'ai pas fait de build ni de test au lecteur d'écran (pas d'accès au terminal).

## 2. Points contrôlés
| Composant | Point | Niveau | Correction proposée | Source |
|---|---|---|---|---|
| Héros | Contraste du titre `#F5F1E8` sur Aurora : au moins 8,0:1 selon la mesure du développeur. Les captures concordent. | ✅ | — | RGAA 3.2 |
| Héros | **1,54:1 là où le titre croise les engrenages laiton.** C'est sous le 3:1 exigé pour un gros texte. Le défaut existait avant V2-2, mais il reste non conforme. Le rapport n'indique pas à quelle largeur ni sur quelle capture il apparaît. | ⚠️ | Donner la largeur et la capture. Puis, au choix : (a) un voile derrière le texte, `[data-texte-heros]::before` avec `radial-gradient(60% 60% at 20% 50%, rgba(10,15,26,.75), transparent)` ; (b) baisser `.engrenages` à `opacity: .25` aux largeurs où il croise le titre. Mesurer de nouveau : 3:1 au moins partout. | RGAA 3.2 |
| Héros | Mouvement réduit, sans JS ou sous 768 px : aucun canvas, le fond CSS d'origine reste. | ✅ | — | RGAA 13.8 |
| Héros | Le bouton Pause fige Aurora : `paused` lu sur `html.anim-pause`, 0 rendu mesuré pendant la pause. | ✅ | — | RGAA 13.8 |
| Héros | **Si GSAP ne se charge pas**, `accueil.ts` retire `js-anim` et n'affiche pas le bouton Pause. Mais Aurora, déjà monté, continue de tourner, car `useAnimationPermise` ne suit que `matchMedia`. On a alors un mouvement de plus de 5 s sans moyen de l'arrêter. | ⚠️ | Dans `etat.ts`, faire suivre aussi la classe de `<html>` à `useAnimationPermise` (même `MutationObserver` que `usePauseDemandee`). Aurora se démonte alors dès que `js-anim` disparaît. | RGAA 13.8 |
| Titre | Lecteurs d'écran : GSAP 3.15.1 avec `aria: 'auto'` pose `aria-label` = « La mécanique, pièce par pièce. » et masque les lignes découpées. Sans découpage, le texte est lu normalement. | ✅ | — | doc GSAP, RGAA 7.1 |
| Titre | Sur `heros-1280-ecran.png`, les accents de « pièce » semblent décalés. | ⚠️ À VÉRIFIER | Comparer en taille réelle avec la capture en mouvement réduit (sans découpage). Si le décalage vient du découpage, normaliser le texte en NFC (`text.normalize('NFC')`) dans `TitreHeros`. | lisibilité |
| Sélection | Prix vu en entier avant que la carte soit recouverte (390 px, positions 1 à 3). Le bouton Pause ne couvre que brièvement le coin droit d'une carte : le prix est à gauche. | ✅ | — | spec, garde-fou prix |
| Sélection | Clavier : la fonction `degager()` existe, mais **aucun test clavier n'est rapporté**. | ⚠️ | Faire un test réel à 390 et 1280 px : Tab sur les 5 cartes, chaque carte doit être entière avec un anneau de focus visible, dans l'ordre visuel. Joindre 2 captures. | RGAA 10.7, 12.8 |
| Sélection | La version animée perd la sémantique de liste : `ul`/`li` devient une suite de `div`. | ⚠️ | Mettre `role="list"` sur la `div` interne de `ScrollStack` et `role="listitem"` sur chaque `data-stack-slot`. | RGAA 9.3 |
| Carrousel | Libellés en français (« Visuels du produit », « Visuel suivant », « Afficher le visuel 2 », « 2 sur 3 »). Flèches, Début et Fin fonctionnent. Zones de 44 px. Point actif en forme de trait. Focus visible (contour bleu nuit, marge de 8 px). | ✅ | — | RGAA 10.7, 11.9 |
| Carrousel | Contraste : flèche `#1E3A5F` sur blanc à 11,5:1, point `#6B7280` sur blanc à 4,8:1 (calculés). | ✅ | — | RGAA 3.3 |
| Carrousel | **Perte du focus** : au dernier visuel, « Visuel suivant » reçoit `disabled` alors qu'il a le focus, et le focus repart en haut de la page. Même chose pour « Visuel précédent » au premier visuel. | ⚠️ | Remplacer `disabled` par `aria-disabled={atEnd}`, ignorer le clic dans ce cas, et passer le style de `disabled:` à `aria-disabled:opacity-35`. | RGAA 12.8 |
| Carrousel | Les visuels non affichés restent lus par les lecteurs d'écran : `visibility` est `visible` pour les voisins rognés. | ⚠️ | Ajouter `aria-hidden={index !== active}` sur chaque diapositive (elles ne contiennent aucun élément focalisable). | RGAA 7.1 |
| Fiche | Le bloc Achat (prix, bouton), `BarreAchatMobile` et le bloc GPSR sont hors de l'îlot et jamais recouverts. | ✅ | — | code `FicheProduit.astro` |
| Fiche | `html.js-visuels` masque les visuels 2 et suivants avant le montage. **Si l'îlot ne se monte jamais** (erreur JS, bloqueur), ces visuels restent cachés. | ⚠️ | Dans le script en ligne, ajouter une sécurité : `setTimeout(() => { if (document.querySelector('[data-visuels-statiques]')) document.documentElement.classList.remove('js-visuels') }, 4000)`. | robustesse, RGAA 7.1 |
| Tous | Aucun emoji (recherche Unicode dans `src/components/`). | ✅ | — | `CLAUDE.md` |
| Tous | Licence : en-tête MIT + Commons Clause, URL source et SHA du commit présents dans les 4 fichiers recopiés (Aurora, SplitText, ScrollStack, Carousel). Les enveloppes sont du code maison. | ✅ | — | LICENSE React Bits |

## 3. À faire revoir par un professionnel
- **Obligation légale.** L'Acte européen sur l'accessibilité (directive 2019/882, applicable depuis le 28/06/2025) exempte les microentreprises qui fournissent des services (moins de 10 personnes, chiffre d'affaires ou bilan de 2 M€ au plus). Le texte n'a pas pu être relu aujourd'hui : à faire confirmer par un juriste. Le RGAA reste la bonne référence de qualité.
- **Hors périmètre V2-2, à trancher avant toute publication.** Le site affiche encore les maquettes en bois (« 14 ans et plus », livraison, engrenages). Or `knowledge/memo.md` indique des tableurs numériques depuis le 2026-11-14.

## 4. Sources
Voir l'en-tête YAML. Toutes les pages ont été consultées le 2026-11-20.
