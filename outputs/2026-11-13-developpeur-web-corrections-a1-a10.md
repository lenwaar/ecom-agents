---
agent: developpeur-web
statut: à-valider
date: 2026-11-13
sources: [outputs/2026-11-13-conformite-qa-audit-site.md, knowledge/decisions.md, knowledge/catalogue-demo.md, docs/site-technique.md, docs/retours-experience.md]
prochaine-etape: conformite-qa (contre-audit des corrections A1 à A10 et de la collection Automates) puis validation humaine
---

# Corrections A1 à A10 de l'audit du site, collection Automates, vérification des liens (T45, synchro n°11)

## 1. Résumé

- `npm run build` passe : 58 pages, aucun avertissement, puis la vérification des liens : **4 255 liens internes vérifiés dans 58 pages, 0 cassé**.
- `py tools/verifier_livrables.py` : 0 erreur.
- Les 10 points « avant aperçu protégé » (A1 à A10) sont corrigés. La collection « Miniatures » est remplacée par « Automates ». Il ne reste aucune référence au book nook ni à `/collections/miniatures/` dans `site/src`.
- Rien n'est commité (consigne de la tâche).

## 2. Collection « Automates »

| Fichier | Modification |
|---|---|
| `site/src/content.config.ts` l. 45 | enum : `'mecanique', 'vehicules', 'automates', 'idees-cadeaux'` |
| `site/src/lib/catalogue.ts` l. 9, 170-171, 198-209, 234 | `SlugCollection`, entrée de collection, `COLLECTIONS_PRINCIPALES` |
| `site/src/components/collection/HerosCollection.astro`, `VisuelCollection.astro`, `scripts/collection.ts` | le traitement « rendu en calques + parallaxe » passe de `miniatures` à `automates` |
| `site/src/components/accueil/CarteCollectionAccueil.astro`, `scripts/accueil-sections.ts` | les maisons aux fenêtres éclairées sont remplacées par une came excentrée, une manivelle et un poussoir. Au survol, la manivelle fait un tour et le poussoir suit le contact exact de la came. Le calque chaud, devenu inutile, est retiré |
| `site/src/components/produit/FiltresCatalogue.astro` l. 23 | lien « Automates » vers `/collections/automates/` |
| `site/src/pages/index.astro` l. 35, `pages/maquettes/index.astro` l. 14 et 16, `pages/collections/[slug].astro` l. 3 | méta-descriptions et intro : « véhicules et automates (à manivelle) » |
| `site/src/content/produits/moulin-a-vent-manivelle.md` l. 7 | `collections: [mecanique, automates]` |
| `site/src/content/produits/automate-manivelle.md` l. 7 | commentaire « slug à ajouter au schéma » retiré (le slug existe) |

Textes de la collection :
- nom : « Automates » ;
- ligne italique : « à la manivelle. » ;
- phrase : « Une manivelle à tourner, et la scène se met en mouvement. ». Ces deux textes ne s'affichent que si chaque produit de la collection a `partie_mobile: true`. Sinon le site affiche « à assembler. » et « Des automates en bois à manivelle, à assembler. » (règle N2) ;
- titre SEO : « Automates en bois à manivelle à assembler | Rouage & Laiton » ;
- description SEO : « Automates en bois à manivelle à assembler soi-même, pour adultes, à partir de 14 ans. Temps d'assemblage et difficulté indiqués sur chaque fiche. »

Résultat sur la page de collection : « 2 modèles · de 3 à 8 h · de 32,90 € à 49,90 € (prix indicatifs de démonstration) ».

## 3. Points A1 à A10

| # | Fichier(s) et ligne(s) | Texte final |
|---|---|---|
| A1 | `content.config.ts` l. 210 (`retractation.en_ligne_active`, booléen) ; `content/reglages/boutique.yaml` l. 55-56 (`false`) ; `pages/renoncer-au-contrat.astro` l. 28-40 ; `pages/contact.astro` l. 99-101 ; `pages/livraison-et-retours.astro` l. 55 ; `components/aide/QuestionFaq.astro` l. 54-57 | Tant que la valeur est `false` : « Vous avez 14 jours à compter de la réception de votre commande pour changer d'avis, sans avoir à vous justifier. Le formulaire en ligne ci-dessous sera actif avant l'ouverture de la boutique ; en attendant, écrivez-nous par email ou utilisez le formulaire type. » La page Contact affiche « Pour vous rétracter, utilisez la page Renoncer au contrat ici. » La page Livraison et retours et la FAQ n'affichent plus aucune mention d'accusé de réception. Quand la valeur passera à `true`, le texte devient « vous recevrez un accusé de réception par email », sans « immédiatement » : ce mot ne sera ajouté que si l'envoi est automatique et testé |
| A2 | `components/legal/FormulaireTypeRetractation.astro` l. 16, 23, 34 | « Modèle de formulaire de rétractation » ; « Je/nous (*) vous notifie/notifions (*)… » ; marqueur réduit à `[À VALIDER : version PDF imprimable à fournir]` |
| A3 | `lib/catalogue.ts` l. 128-130 (`ligneStatistiques`) ; `components/produit/BarreAchatMobile.astro` l. 32 | Si tous les produits sont des démonstrations : « … · de 29,90 € à 59,90 € (prix indicatifs de démonstration) ». Barre mobile, sous le prix : « Prix indicatif de démonstration » |
| A4 | `pages/collections/[slug].astro` l. 48-49 (`toutDemo`), 126-153 | Sur une collection de démonstration, le marqueur `[À VALIDER]` n'apparaît plus. La carte Mécanisme est masquée si aucun mécanisme n'est connu ; la carte Nombre de pièces est masquée si le nombre est inconnu. Sur de vrais produits, le comportement reste le même qu'avant |
| A5 | `components/produit/Galerie.astro` l. 139 ; `components/produit/Zoom.astro` l. 13, 19-23, 47 ; `pages/maquettes/[slug].astro` (`<Zoom demo={…} />`) | « Rendus 3D de démonstration. » s'affiche sous la galerie et dans le zoom plein écran |
| A6 | `pages/a-propos.astro` l. 37 | « Vos droits, prévus par la loi pour les achats à distance » |
| A7 | `pages/a-propos.astro` l. 12-17 et 26 | Le texte est calculé : `faitsGlobaux(produits).mobile ? 'un objet qui bouge' : 'un objet en bois'`. **Le site affiche aujourd'hui « un objet en bois »**, car la locomotive a `partie_mobile: "À VÉRIFIER"`. Le calcul fait donc son travail. Pour obtenir « un objet qui bouge », il faut renseigner ce champ dans la fiche |
| A8 | `components/produit/BlocSecurite.astro` l. 38 (commentaire l. 5-6) ; `components/accueil/MaquettesDuMoment.astro` l. 32 ; `components/accueil/DansLaBoite.astro` l. 85 ; `pages/cgv.astro` l. 68 | Bloc sécurité : « Produit de démonstration, non vendu : il n'a pas de fabricant. » (texte de `decisions.md`) ; Maquettes du moment : « Rendus 3D de démonstration. Un produit mis en vente est toujours présenté avec ses vraies photos. » ; Dans la boîte : « Produit de démonstration : pas de contenu de boîte réel à présenter. » ; CGV art. 3 : « Les produits marqués « Démonstration » servent à présenter la boutique : ils ne sont pas en vente. » |
| A9 | `components/accueil/Offrir.astro` l. 65 | « Rendu 3D de démonstration. Paquet, lampe et objets de décor non fournis. » |
| A10 | `site/public/_headers` (nouveau) | `/*` puis `  X-Robots-Tag: noindex, nofollow`. Le fichier est copié dans `dist/_headers`. La balise `noindex` reste aussi présente dans `Base.astro` |

## 4. Vérification des liens

- Le script `tools/verifier_liens.py` est écrit en Python standard, sans dépendance. Il parcourt `site/dist/` et contrôle les attributs href, src, srcset, poster et action internes : il signale une page ou un fichier absent, ou une ancre `#id` absente de la page cible. Il renvoie le code 1 s'il trouve une erreur.
- Lancement automatique : script `postbuild` de `site/package.json`, qui exécute `node outils/verifier-liens.mjs`. Ce lanceur essaie `py`, puis `python3`, puis `python`. Sans Python, il affiche un avertissement et la vérification est sautée ; avec `VERIFIER_LIENS_OBLIGATOIRE=1`, l'absence de Python fait échouer la construction. Lancement à la main : `npm run verifier-liens`.
- Contrôle du script : sur une page de test contenant 3 erreurs volontaires (une ancre absente, une image absente, une entrée srcset absente), il a trouvé les 3 et renvoyé le code 1. Sur le site : **4 255 liens vérifiés, 58 pages, 0 cassé**.
- Documentation : `docs/site-technique.md`, sections « Organisation » et « Vérifier le site en local ».

## 5. Vérifications faites

- `cd site && npm run build` : code de sortie 0, aucun avertissement, vérification des liens comprise.
- Dans `dist/` : aucune occurrence de « miniature » ni de « book » ; les dossiers `collections/` sont automates, idees-cadeaux, mecanique, pour-debuter et vehicules ; les textes A1, A3, A5, A7 et A8 sont présents sur les pages construites. La seule occurrence de `[À VALIDER]` sur les pages de collection est celle du pied de page (nom du vendeur, donnée de la boutique).
- Captures Playwright de la carte « Automates » de l'accueil (animation au survol) et de `/collections/automates/` en 1440 px et en 390 px : rendu correct.
- `py tools/verifier_livrables.py` : 0 erreur.

## 6. Ce qui reste à l'humain

- **A10** : avant tout aperçu en ligne, mettre en place une protection d'accès (Cloudflare Access ou mot de passe) réservée à l'humain et aux testeurs. Je ne l'ai pas configurée.
- **A7** : renseigner `partie_mobile` dans la fiche de la locomotive, ou laisser le texte neutre « un objet en bois ».
- **Collection « Automates »** : nom et textes à valider. C'est un choix de Claude Code, modifiable.
- Passer `retractation.en_ligne_active` à `true` seulement quand l'envoi du formulaire et l'accusé de réception par email fonctionnent.
- Points 2.2 de l'audit (4 bloquants avant ouverture) : non traités, ils sont hors du périmètre de T45.
