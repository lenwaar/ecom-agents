# Décisions en cours (à lire par tous les agents)

Décisions prises par Cowork le 2026-11-12 pour ne pas bloquer la construction du site. L'humain peut les changer à tout moment.

## Modèle d'approvisionnement (décision de l'humain du 2026-11-13, synchro n°16)
- **Dropshipping, 0 € d'avance** : aucun stock acheté à l'avance ; on commande au fournisseur seulement après le paiement du client (toujours avec l'accord de l'humain).
- **Fournisseur prioritaire** : la boutique officielle Robotime sur AliExpress (robotime.aliexpress.com, store 2884002). Produits visés : collection ROKR de Robotime, sans électronique.
- **Offres expédiées depuis un entrepôt de l'UE seulement** : livraison de 14 jours maximum, pas de droits de douane de 3 € par article. Une offre expédiée depuis la Chine est écartée.
- **Règles inchangées** : marge nette ≥ 10 € (objectif 15 €, cotisations 12,3 % et SAV compris), note ≥ 4,5, stock ≥ 100.
- **Conséquences** : on revend des maquettes **officielles** Robotime (pas de copie ni de contrefaçon). Les photos et vidéos officielles ne servent dans nos pubs et sur le site **qu'après accord écrit de Robotime** (leçon n° 8 de `docs/retours-experience.md` : un vendeur de marketplace ne peut pas l'autoriser seul). AliExpress bloque les robots : les relevés de prix, de délais et de stock sont faits par l'humain dans son navigateur.

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

## Nom de marque (décision de l'humain du 2026-11-14)
- La vérification A16 ne montre aucun conflit pour « Rouage & Laiton » (`outputs/2026-11-14-conformite-qa-nom-de-marque-rouage-et-laiton.md`).
- L'humain veut une **recherche de similitude professionnelle** (INPI ou conseil en propriété industrielle) **avant** de garder le nom. D'ici là, le nom reste **provisoire** et le point A1 des vidéos reste **bloquant** : rien n'est publié avec ce nom.
- Validation n° 4 de la base : en attente du résultat de cette recherche.
- **Comptes réseaux créés par l'humain le 2026-11-14** : TikTok, Instagram et Pinterest, identifiant `rouageetlaiton` sur les trois. Raison : bloquer l'identifiant pendant la recherche de similitude. Les comptes restent **sans publication** tant que le point A1 n'est pas levé ; si le nom change, ils seront renommés ou supprimés par l'humain. Les identifiants de connexion ne sont jamais notés dans le dépôt.

## Plus tard
- Donner l'outil `Edit` à `architecte-web` et `conformite-qa` (frontmatter), pour écrire les gros livrables dans un seul fichier.
