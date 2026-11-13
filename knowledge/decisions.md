# Décisions en cours (à lire par tous les agents)

Décisions prises par Cowork le 2026-11-12 pour ne pas bloquer la construction du site. L'humain peut les changer à tout moment.

## Site
- **Spécification de référence** : `outputs/2026-11-12-architecte-web-conception-boutique-v2.md` + `...-v2-partie-2.md`, **corrigée par** l'audit `outputs/2026-11-12-conformite-qa-audit-conception-boutique-v2.md` + `...-v2-partie-2.md`. **En cas de conflit, l'audit l'emporte.** Ces fichiers sont gros : les lire par tranches.
- **Mode démonstration** : le site reste en local tant que l'humain ne valide pas une mise en ligne. Aucun produit `demo: true` n'est achetable (règle V15 de l'audit).
- **Vue 3D** sur la fiche produit : oui, chargée au clic seulement.
- **Moulin à vent** : collections Mécanique + Pour débuter.
- **Lettre d'information** : formulaire visible mais désactivé (« Bientôt ») tant qu'aucun service d'envoi d'e-mails n'est choisi.
- **Articles facultatifs Stripe** : aucun au lancement. **Lots** : plus tard.
- **Noël** : pas de date limite affichée en dur ; texte générique « Commandez tôt pour Noël : le délai est affiché sur chaque fiche ».

## Accueil
- L'accueil (tâche T35) doit atteindre **au minimum** le niveau de `docs/reference/prototype-accueil-v2.html` (décision de l'humain : « une page enrichie, plus d'animations, plus de rubriques »). Reprendre ses sections, ses animations et ses versions mobile et sans animation, avec les vrais rendus de `site/public/produits/`.

## Affichage des produits de démonstration
Les fiches `demo: true` contiennent beaucoup de valeurs `À VÉRIFIER` (normal : ce ne sont pas de vrais produits). Sur le site :
- une ligne de caractéristique dont la valeur est `À VÉRIFIER` **n'est pas affichée** (pas de texte « À VÉRIFIER » visible par un visiteur) ;
- le bloc « Sécurité du produit » affiche sur une fiche de démonstration : « Produit de démonstration, non vendu : il n'a pas de fabricant. » (décision de l'humain du 2026-11-13, synchro n°11, remplace l'ancien texte « affichées dès la mise en vente », qui contredisait les CGV : point A8 de l'audit du site) ;
- une FAQ dont la réponse commence par `À VÉRIFIER` n'est pas affichée ;
- sur un **vrai** produit (`demo: false`), une valeur `À VÉRIFIER` **bloque la construction** (règles de validation de la spécification).

## Positionnement du catalogue (décision de l'humain du 2026-11-13, synchro n°11)
- La boutique reste « **maquettes mécaniques en bois** » : chaque produit, démonstration comprise, a un mécanisme ou une partie mobile.
- Le book nook « Ruelle d'horloger » (sans mécanisme) est **retiré** du catalogue de démonstration et remplacé par l'**« Automate à manivelle »** (démo avec mécanisme). Point B15 de l'audit du site.
- Conséquence : la collection « Miniatures » n'a plus de produit ; elle est remplacée par la collection **« Automates »** (moulin à vent à manivelle + automate à manivelle). Choix de Claude Code pour ne pas laisser une collection vide, modifiable par l'humain.

## Plus tard
- Donner l'outil `Edit` à `architecte-web` et `conformite-qa` (frontmatter), pour écrire les gros livrables dans un seul fichier.
