---
agent: redacteur-catalogue
statut: validé
valide_par: humain
date_validation: 2026-11-13
date: 2026-11-12
sources: [knowledge/catalogue-demo.md, knowledge/marque.md, knowledge/niche.md, knowledge/politiques.md, knowledge/prix-et-marges.md, knowledge/direction-design.md, docs/site-technique.md, outputs/2026-11-12-architecte-web-conception-boutique-v2.md, outputs/2026-11-12-architecte-web-conception-boutique-v2-partie-2.md, outputs/2026-11-12-conformite-qa-audit-conception-boutique-v2.md, outputs/2026-11-12-conformite-qa-audit-conception-boutique-v2-partie-2.md]
prochaine-etape: conformite-qa
---

# Fiches du catalogue de démonstration (10 produits)

## 1. Résumé
Les 10 fiches de `knowledge/catalogue-demo.md` sont écrites dans `site/src/content/produits/`. Toutes portent `demo: true` et `statut: presentation`, avec `lien_paiement_stripe: ""` (V11). Les seuls chiffres repris sont ceux de la source : difficulté, temps, prix de démonstration, 14 ans et plus, délai maximum de 14 jours. Tout le reste est en `À VÉRIFIER`. Chaque fiche contient une accroche, une description de 150 à 200 mots avec des intertitres H2, 3 bénéfices, les caractéristiques, le contenu de la boîte, une FAQ de 4 ou 5 questions, les textes alternatifs des 6 vues et les champs SEO.

## 2. Fiches et mots-clés
| # | Fichier | Mot-clé principal | Secondaires | Titre SEO (car.) | Méta (car.) |
|---|---|---|---|---|---|
| 1 | `boite-engrenages-initiation.md` | maquette mécanique en bois | maquette bois à monter ; kit à assembler adulte ; première maquette en bois | 57 | 150 |
| 2 | `moulin-a-vent-manivelle.md` | maquette moulin à vent en bois | maquette bois à monter ; maquette mécanique ; idée cadeau | 57 | 143 |
| 3 | `boite-a-musique-manivelle.md` | boîte à musique en bois à monter | maquette mécanique ; idée cadeau femme ; idée cadeau homme | 50 | 139 |
| 4 | `coffre-fort-combinaison.md` | coffre-fort en bois à monter | maquette mécanique adulte ; kit à assembler adulte ; idée cadeau homme | 51 | 145 |
| 5 | `grue-chantier-treuil.md` | maquette grue en bois | maquette mécanique adulte ; maquette bois à monter ; idée cadeau homme | 51 | 137 |
| 6 | `voiture-retro-moteur-elastique.md` | maquette voiture en bois | maquette voiture ancienne à monter ; kit à assembler adulte ; idée cadeau homme | 57 | 147 |
| 7 | `locomotive-vapeur.md` | maquette locomotive en bois | maquette train à monter ; maquette bois adulte ; idée cadeau homme | 54 | 129 |
| 8 | `book-nook-ruelle-horloger.md` | book nook à monter | maquette miniature en bois ; décoration bibliothèque ; idée cadeau femme | 53 | 150 |
| 9 | `planetaire-mecanique.md` | planétaire mécanique en bois | maquette système solaire à monter ; maquette mécanique adulte ; idée cadeau | 55 | 149 |
| 10 | `horloge-murale-balancier.md` | horloge en bois à monter | maquette horloge mécanique ; maquette mécanique adulte ; idée cadeau homme | 54 | 139 |

« Puzzle 3D » n'est jamais utilisé (`niche.md`). Les longueurs ont été comptées à la main : un contrôle automatique au moment de la construction (V8) reste nécessaire.

## 3. Choix de format à faire valider
- **Format retenu : celui du §5.4 de la spec v2.** Il reprend et prolonge `docs/site-technique.md` : `vues` remplace `photos`, `temps_assemblage_heures_min/max` remplace `temps_assemblage`, et `securite.fabricant` est un objet. La mise à jour de `docs/site-technique.md` doit encore être validée par l'humain.
- **Champs ajoutés** :
  - suite à l'audit N2 et N8 : `partie_mobile`, `decoupe_laser`, `notice_illustree`, `suivi` ;
  - `accroche`, exigée par l'agent mais absente du §5.4 : `architecte-web` doit lui donner une place dans les blocs ;
  - champs propres à certains produits : `melodie`, `combinaison_modifiable`, `dimensions_interieures_cm`, `fleche_orientable`, `distance_parcourue`, `astres_representes`, `eclairage`, `autonomie`, `precision_horaire`, `fixation_murale_fournie`.
- **`mecanisme`** prend les valeurs `combinaison` (n° 4) et `aucun` (n° 8), conformément à N2. Les produits n° 1, 5, 7, 9 et 10 sont en `À VÉRIFIER`, car leur mode d'entraînement ne figure pas dans la source.
- **Valeurs `"À VÉRIFIER"` dans des champs numériques ou booléens** (pièces, dimensions, poids, frais, `colle_necessaire`, `marquage_jouet`…) : c'est un choix volontaire, pour ne rien inventer. Le schéma de `developpeur-web` doit les accepter pour les produits `presentation`, ou les afficher comme « À préciser ».
- **Temps** : la source donne une seule valeur, donc min = max.
- **Collection « Idées cadeaux »** : la sélection (n° 3, 4, 6, 7, 8, 9, 10) est une proposition éditoriale à valider.
- Le bandeau, le bouton désactivé, « Prix indicatif de démonstration » (N17) et le bloc sécurité « Informations de démonstration » sont gérés par le gabarit. Ils n'apparaissent pas dans les fichiers.

## 4. Points `À VÉRIFIER` (communs aux 10 fiches)
- Livraison : frais, délai minimum, lieu d'expédition, transporteur, suivi.
- Produit : nombre de pièces, dimensions, poids, essence et épaisseur du bois, découpe laser, notice, colle, outils nécessaires et fournis, contenu exact de la boîte au-delà des planches prédécoupées, pièces de rechange.
- GPSR : fabricant, adresse, pays, email, responsable UE, importateur, référence, avertissements, marquage jouet.
- FAQ : délai de réponse du service client (`politiques.md`).
- Points propres à certains produits :
  - n° 3 : mélodie ; mécanisme livré monté ou non ;
  - n° 4 : combinaison modifiable ; volume intérieur ;
  - n° 5 : flèche orientable ; charge du crochet ;
  - n° 6 : distance parcourue ; élastiques de rechange ;
  - n° 7 : parties mobiles ; compatibilité avec des rails ;
  - n° 8 : largeur à prévoir sur l'étagère ;
  - n° 9 : nombre d'astres ; rapports des vitesses ;
  - n° 10 : source d'énergie, autonomie, précision horaire, fixation murale.

## 5. Points d'attention pour conformite-qa et studio-visuel
- Les descriptions ne décrivent que le principe propre à chaque type d'objet (engrenages qui s'entraînent, peigne et cylindre, disques d'une combinaison, tambour d'un treuil, échappement d'une horloge). Aucune mesure ni performance n'est annoncée. Des limites honnêtes sont écrites quand c'est utile : n° 4 « pas un coffre de sécurité », n° 9 « pas un instrument de mesure », n° 10 « ne remplace pas une horloge de précision ».
- Comparaisons tirées du catalogue : n° 10 « le modèle le plus long du catalogue » (12 h), n° 9 « l'un des deux modèles de niveau expert ». Ces phrases sont à mettre à jour si le catalogue change.
- Repère historique, n° 9 : « on en construisait déjà au XVIIIe siècle ». C'est un fait connu, mais il n'a pas été vérifié aujourd'hui dans une source citée. À confirmer ou à retirer.
- Les textes alternatifs commencent par « Rendu 3D ». Les vues `situation` portent la mention « Lampe et objets de décor non fournis » (N22). Quelques textes décrivent un détail que le rendu doit montrer (n° 4 « commande de la combinaison au centre de la porte », n° 6 « calandre et phares ») : `studio-visuel` doit s'y conformer, sinon il faut ajuster le texte alternatif.
- À l'arrivée d'un vrai produit, la fiche sera réécrite entièrement à partir du rapport `sourcing-produits`. Ces textes ne seront pas réutilisés tels quels.

## Auto-contrôle
- [x] Aucun emoji (recherche automatique : 0), aucun superlatif creux, vouvoiement.
- [x] Aucune caractéristique inventée : tout ce qui manque dans la source est en `À VÉRIFIER`.
- [x] Aucune allégation santé ou bien-être ; aucun mot de la liste V10 dans les textes (recherche automatique ; seul le nom de champ `marquage_jouet` correspond).
- [x] Aucun texte qui vise les enfants ; 14 ans et plus partout.
- [x] Aucun avis, stock, promotion ni urgence.
- [x] Titres ≤ 60 caractères, méta-descriptions ≤ 155.
- [x] 6 textes alternatifs par fiche ; `etiquette: null` (démonstration).
- [x] Aucun lien de paiement.

## Mise à jour 2026-11-13 (synchro n°11)
Décision de l'humain (`knowledge/decisions.md`, « Positionnement du catalogue ») : chaque produit doit avoir un mécanisme ou une partie mobile.
- **Retiré** : le n° 8 `book-nook-ruelle-horloger.md` (sans mécanisme). Les lignes qui le concernent ci-dessus (tableau §2, `mecanisme: aucun` au §3, « largeur à prévoir sur l'étagère » au §4, sélection « Idées cadeaux » au §3) sont caduques.
- **Ajouté** : `automate-manivelle.md` (n° 8), `demo: true`, `statut: presentation`, ordre 80, type Automate, difficulté moyen, 8 h, 49,90 € (prix indicatif de démonstration), 14 ans et plus, sans électronique, `mecanisme: manivelle` (transmission par cames et poussoirs), `partie_mobile: true`, aucun lien de paiement.
  - Collections : `[automates, idees-cadeaux]`. Le slug `automates` n'existe pas encore dans `site/src/content.config.ts` ni dans `site/src/lib/catalogue.ts` : la construction échouera tant que `developpeur-web` ne l'a pas ajouté.
  - Mot-clé principal : « automate en bois à monter » ; secondaires : « automate mécanique à manivelle », « maquette mécanique adulte », « idée cadeau ».
  - Titre SEO : 55 caractères ; méta-description : 137 caractères.
  - Contenu : accroche, description en 3 intertitres (environ 170 mots : montage et calage des cames, fonctionnement, pour qui), 3 bénéfices, FAQ de 5 questions, 6 textes alternatifs (vues attendues dans `site/public/produits/automate-manivelle/`, mêmes noms que les autres produits, à produire par `studio-visuel`).
  - `À VÉRIFIER` : les mêmes que les autres fiches (§4), plus le sujet de la scène animée (champ `scene_representee`). Le texte ne décrit pas la scène pour ne rien inventer.
  - Le texte alternatif `detail` montre l'arbre à cames et les poussoirs : `studio-visuel` doit les rendre visibles sur cette vue.
