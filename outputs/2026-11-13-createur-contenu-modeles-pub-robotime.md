---
agent: createur-contenu
date: 2026-11-13
statut: validé
valide_par: humain
date_validation: 2026-11-14
sources: [knowledge/marque.md, knowledge/memo.md, knowledge/decisions.md, docs/retours-experience.md, docs/exemples/script-video.md, docs/studio/BRIEF-STUDIO.md, outputs/2026-11-13-conformite-qa-audit-modele-robotime.md]
prochaine-etape: studio-video (rendu brouillon) puis conformite-qa
---

# Modèles de pub vidéo « à trous » : maquettes ROKR de Robotime (T73, partie 1, version corrigée)

Corrigé selon l'audit (P1 à P6) et le rendu brouillon : prix toujours avec frais de livraison, formule de marque sans « officielle », variante sans marque, son réel seulement pour « Écoutez-le tourner », promesses de durée et « sans colle » retirées, âge et ciblage 18 ans et plus, crédit Piper dans toutes les légendes, mention « Publicité », plan C4 fusionné, variable `{DÉLAI_MONTAGE}` supprimée, brouillon 540 x 960.

## 1. Résumé et décisions pour l'humain

Trois modèles verticaux (9:16) : **A. Accroche (18 s)**, **B. Démonstration (25 s)**, **C. Avant/après (20 s)**. Chaque plan qui montre un média officiel est un cadre vide `MÉDIA FOURNISSEUR n°X`, décrit avec précision. Aucun chiffre, prix, délai, frais ou avis n'est écrit : tout passe par des variables.

À décider par l'humain :
1. **Accord écrit de Robotime** : sans lui, aucun média, et aucune publication.
2. **Marque nommée ou non** : avec accord écrit, `{MENTION_MARQUE}` = « Maquette ROKR, marque Robotime ». « Officielle » n'est utilisé que si l'accord le dit mot pour mot ; « revendeur officiel » et « partenaire » ne sont jamais écrits. Sans accord : variante sans marque. **Sur TikTok, la marque n'est citée (vidéo, légende) qu'avec l'accord écrit** (politique publicitaire TikTok, d'après l'audit).
3. **Légendes** (section 6) à valider ; rien n'est publié sans votre accord.
4. Nom « Rouage & Laiton » toujours provisoire (INPI non vérifié).

## 2. Variables et règles communes

| Variable | Contenu | Règle |
|---|---|---|
| `{NOM_PRODUIT}` | nom exact de la fiche | jamais reformulé |
| `{PRIX}` | prix TTC de la fiche | À VÉRIFIER (relevé humain) ; prix barré seulement si c'est le prix le plus bas des 30 derniers jours |
| `{FRAIS_LIVRAISON}` | « livraison offerte » ou « + X de livraison » selon la fiche | **toujours affiché à côté de `{PRIX}`** (L221-5) ; À VÉRIFIER |
| `{DÉLAI}` | délai de livraison de la fiche | 14 jours maximum, offre UE seulement ; À VÉRIFIER (mesuré par commande test) |
| `{NB_PIÈCES}` | nombre de pièces du fabricant | À VÉRIFIER ; plan supprimé si absent |
| `{AGE}` | « Dès 14 ans » | repris du marquage du fabricant, À VÉRIFIER |
| `{MENTION_MARQUE}` | « Maquette ROKR, marque Robotime » | **seulement avec l'accord écrit de Robotime** ; variante sans marque : « Maquette mécanique en bois » |
| `{MENTION_IMAGES}` | « Images : Robotime » | sur chaque plan contenant un média fournisseur ; absente en variante sans marque (il n'y a alors aucun média Robotime) |
| `{MENTION_PUB}` | « Publicité » | voir règle ci-dessous |

Règle `{MENTION_PUB}` (grille §5 du brief studio) : sur toute vidéo diffusée en publicité payante ou en collaboration, afficher « Publicité » (ou « Collaboration commerciale » pour un créateur) du début à la fin, **et** activer le libellé natif de la plateforme (« Contenu de marque » ou équivalent). Position : y ≈ 310 à 360, centré à gauche, 36 px min (en final 1080 x 1920), `#A8A29A`. Publication organique de la boutique : pas de mention, mais la légende garde le crédit des images.

Règles de rendu (leçon n° 14, grille §5) :
- **Formats** : brouillon en **540 x 960** (toutes les tailles en px ci-dessous divisées par 2 : 18 px min pour les mentions, 24 px pour les textes) ; **final en 1080 x 1920**. Les tailles du tableau sont celles du final.
- Texte à l'écran : **48 px minimum** pour tout texte lu (sous-titres), **36 px minimum** pour les mentions (`{MENTION_IMAGES}`, `{MENTION_PUB}`, `{AGE}` en carton de fin à 44 px). Inter 600, texte `#F5F1E8`, accent laiton `#C8A15A`, fond nuit `#0A0F1A`, titres Cormorant Garamond. Marge de 40 px minimum, rien de coupé.
- **Zone sûre** : rien sous y = 288 px (15 % du haut), rien sous y = 1536 px (20 % du bas). Texte principal entre y = 330 et y = 1400. `{MENTION_IMAGES}` : y ≈ 1440 à 1490.
- Un changement visuel toutes les 1,5 à 3 s ; aucun plan vide.
- Vouvoiement, aucun emoji, aucun superlatif creux, aucune fausse urgence ni promo ni avis, aucune allégation santé, aucun visage. Aucun visuel ni mot-clé qui vise des enfants.
- **Ciblage publicitaire : 18 ans et plus uniquement** (maquettes pour adultes ; âge de la maquette `{AGE}`).
- Aucun média fournisseur n'est recadré pour masquer un logo ou une mention.
- Voix off facultative : Piper `fr_FR-siwis-medium`, `--length-scale 1.08` ; **si une voix est utilisée, le crédit figure dans la légende** (leçon n° 13).
- Son : musique de la bibliothèque commerciale du réseau ; bruitages synthétiques ou de bibliothèque libre. Cible -14 LUFS ± 1 mesurée sur le MP4 final (`studio/video/outils/normaliser_lufs.py`).
- Rendu brouillon : non publiable.

## 3. Modèle A : « Accroche » (18 s, objectif visibilité)

Plans modifiés par la correction : A1, A2, A4, A5, A6.

| # | Durée | Cadre | T. écran | Voix (facultative) | Son |
|---|---|---|---|---|---|
| A1 | 0,0 à 2,0 s | **MÉDIA FOURNISSEUR n°A1** : vidéo officielle, gros plan serré sur le mécanisme en mouvement, plan fixe, 2 s, sans texte incrusté | **Condition (P3)** : si le média a le vrai son du produit : « Écoutez-le tourner. » ; sinon : « Regardez-le tourner. » (52 px, laiton, y ≈ 400) | « Regardez-le tourner. » (ou « Écoutez-le tourner. » avec le vrai son) | vrai son du média si disponible ; sinon aucun son d'ambiance imité, silence puis musique en A2 |
| A2 | 2,0 à 5,0 s | Carton texte, fond nuit | « Vous le construisez. » puis « Étape après étape. » (**« sans colle » retiré** ; ajouté seulement si la fiche fabricant le dit, source notée) | « Vous le construisez vous-même. » | entrée discrète de la musique (bibliothèque commerciale) |
| A3 | 5,0 à 9,0 s | **MÉDIA FOURNISSEUR n°A3** : photo ou vidéo officielle du produit monté, trois quarts, 4 s | `{MENTION_MARQUE}` (48 px) puis `{NOM_PRODUIT}` (Cormorant Garamond, 56 px) | « {NOM_PRODUIT}. » | musique seule |
| A4 | 9,0 à 13,0 s | **MÉDIA FOURNISSEUR n°A4** : vidéo officielle, mécanisme en marche vu de près, 4 s | « Un mécanisme à observer. » (plan supprimé si le média ne montre aucun mouvement) | « À assembler, puis à regarder tourner. » | **musique seule** (le son du média n'est gardé que s'il est réel et couvert par l'accord ; aucune synthèse imitant le produit) |
| A5 | 13,0 à 16,0 s | Carton texte, fond nuit | `{NB_PIÈCES}` pièces en bois (si vérifié) ; « {PRIX} TTC, {FRAIS_LIVRAISON}. » ; « Livraison sous {DÉLAI}. » (48 px) | « {PRIX} TTC, {FRAIS_LIVRAISON}. Livraison sous {DÉLAI}. » | musique |
| A6 | 16,0 à 18,0 s | Carton de fin, logo Rouage & Laiton | « Découvrez-le sur le site. » ; `{AGE}` (44 px) ; adresse du site À VÉRIFIER | « Rouage et Laiton. Découvrez-le sur le site. » | musique qui s'arrête nette |

`{MENTION_IMAGES}` sur A1, A3, A4. `{MENTION_PUB}` sur A1 à A6 si diffusée en pub.
Variante sans marque : A3 prend « Maquette mécanique en bois » + `{NOM_PRODUIT}`, médias remplacés par des cartons texte ou des médias libres de droits ; aucune mention de Robotime.

## 4. Modèle B : « Démonstration » (25 s, objectif confiance)

Plans modifiés : B1, B2, B8, B9.

| # | Durée | Cadre | T. écran | Voix (facultative) | Son |
|---|---|---|---|---|---|
| B1 | 0,0 à 2,0 s | **MÉDIA FOURNISSEUR n°B1** : vidéo officielle, premier tour de manivelle ou démarrage du mécanisme en plan serré, 2 s | **Condition (P3)** : « Écoutez-le tourner. » seulement avec le vrai son du produit dans le média ; sinon « Regardez-le tourner. » (52 px) | aucune | vrai son du média seul, sans musique ; sans vrai son : silence |
| B2 | 2,0 à 6,0 s | **MÉDIA FOURNISSEUR n°B2** : vidéo ou photo officielle, vue complète du produit monté en marche, 4 s | `{NOM_PRODUIT}` ; `{MENTION_MARQUE}` | « Voici {NOM_PRODUIT}. » | musique douce en entrée |
| B3 | 6,0 à 8,0 s | Carton texte | « Comment ça se monte ? » | « Comment ça se monte ? » | musique |
| B4 | 8,0 à 11,0 s | **MÉDIA FOURNISSEUR n°B4** : photo ou vidéo officielle, planches de pièces en bois dans leur cadre, 3 s | « 1. Détacher les pièces. » | « D'abord, on détache les pièces. » | bruitage de bois (bibliothèque libre) |
| B5 | 11,0 à 14,0 s | **MÉDIA FOURNISSEUR n°B5** : vidéo officielle d'une étape d'emboîtement, 3 s | « 2. Emboîter, étape par étape. » | « Puis on emboîte, étape par étape. » | clic de bois, musique basse |
| B6 | 14,0 à 17,0 s | **MÉDIA FOURNISSEUR n°B6** : vidéo officielle, mise en place du mécanisme (manivelle, ressort ou remontage selon le produit), 3 s | « 3. Monter le mécanisme. » | « Enfin, le mécanisme. » | bruitage de rouage |
| B7 | 17,0 à 21,0 s | **MÉDIA FOURNISSEUR n°B7** : vidéo officielle, produit terminé en fonctionnement, plan large puis léger rapprochement, 4 s | « Terminé. Il fonctionne. » | « Et il fonctionne. » | musique en crescendo |
| B8 | 21,0 à 23,0 s | Carton texte | « Étape après étape. » (**aucune durée ni voix sur la durée** ; « une ou deux soirées » retiré ; la ligne « Notice du fabricant fournie » seulement si la notice existe en français, source notée) | aucune | musique |
| B9 | 23,0 à 25,0 s | Carton de fin | « {PRIX} TTC, {FRAIS_LIVRAISON}. » ; « Livraison sous {DÉLAI}. » ; `{AGE}` ; « Rouage & Laiton » | « Rouage et Laiton. » | musique qui s'arrête |

`{MENTION_IMAGES}` sur B1, B2, B4 à B7. `{MENTION_PUB}` sur B1 à B9 si diffusée en pub. Étapes 1 à 3 à ajuster à la notice réelle du produit.
Variante sans marque : B2 prend « Maquette mécanique en bois » ; les médias Robotime ne sont pas utilisés.

## 5. Modèle C : « Avant / après » (20 s, objectif partage et enregistrements)

Plans modifiés : C3 (fusion avec l'ancien C4), C6, C7. Le plan C4 (1 s sans contenu) est supprimé ; la transition fondu laiton est intégrée à la dernière seconde de C3, et les plans suivants gardent leur numéro (C5 à C7).

| # | Durée | Cadre | T. écran | Voix (facultative) | Son |
|---|---|---|---|---|---|
| C1 | 0,0 à 2,0 s | **MÉDIA FOURNISSEUR n°C1** : photo officielle, planches de pièces en bois à plat (boîte ouverte si disponible), vue du dessus, 2 s | « Ça, c'est avant. » (52 px, y ≈ 400) | « Avant. » | silence puis un clic de bois |
| C2 | 2,0 à 5,0 s | **MÉDIA FOURNISSEUR n°C2** : vidéo ou photo officielle, détail des pièces découpées (engrenages, axes), plan serré, 3 s | « {NB_PIÈCES} pièces en bois. » (plan supprimé si À VÉRIFIER) | « {NB_PIÈCES} pièces en bois. » | bruitage léger de bois |
| C3 | 5,0 à 9,0 s | Carton texte nuit pendant 3 s, puis **fondu enchaîné laiton `#C8A15A` pendant la dernière seconde** vers C5 (sur 4 s au total : 3 s texte + 1 s de fondu avec le texte encore visible) | « Étape après étape. » (**« quelques soirées plus tard » retiré**, aucune durée sans source du fabricant) | « Étape après étape. » | montée de musique ; « tchak » unique sur le fondu |
| C5 | 9,0 à 13,0 s | **MÉDIA FOURNISSEUR n°C5** : photo ou vidéo officielle du produit monté, même cadrage et angle que C1 si possible, 4 s | « Et ça, c'est après. » ; `{NOM_PRODUIT}` | « Après. {NOM_PRODUIT}. » | musique |
| C6 | 13,0 à 18,0 s | **MÉDIA FOURNISSEUR n°C6** : vidéo officielle, produit monté en mouvement, plan serré puis large, 5 s | `{MENTION_MARQUE}` ; **pas de texte « écoutez »** | « Maintenant, il bouge. » | son du média seulement s'il est réel ; sinon musique seule |
| C7 | 18,0 à 20,0 s | Carton de fin | « {PRIX} TTC, {FRAIS_LIVRAISON}. » ; « Livraison sous {DÉLAI}. » ; `{AGE}` ; « Rouage & Laiton » | « Rouage et Laiton. » | musique qui s'arrête |

`{MENTION_IMAGES}` sur C1, C2, C5, C6 (et pendant le fondu de C3 si une image fournisseur y reste visible). `{MENTION_PUB}` sur C1 à C7 si diffusée en pub.
Variante sans marque : C6 prend « Maquette mécanique en bois ».

## 6. Légendes de publication (à valider ; jamais publiées sans accord)

Pas d'emoji. 3 à 6 hashtags, aucune allégation santé. Si diffusée en publicité : « Publicité » en début de légende. Les crédits de voix et d'images sont à garder dans chaque légende.

- **A** : « {NOM_PRODUIT} : une maquette mécanique en bois à assembler soi-même. {PRIX} TTC, {FRAIS_LIVRAISON}. Livraison sous {DÉLAI}. {AGE}. {MENTION_MARQUE}. Images : Robotime. Voix de synthèse (Piper, voix siwis, CC BY 4.0). #maquettebois #maquettemecanique #DIY #cadeauoriginal »
- **B** : « Détacher, emboîter, monter le mécanisme : les trois grandes étapes de {NOM_PRODUIT}. {PRIX} TTC, {FRAIS_LIVRAISON}. {AGE}. {MENTION_MARQUE}. Images : Robotime. Voix de synthèse (Piper, voix siwis, CC BY 4.0). #maquettebois #satisfying #assemblage #mecanisme »
- **C** : « Des planches de bois, puis un objet qui bouge. {NOM_PRODUIT}, {PRIX} TTC, {FRAIS_LIVRAISON}. {AGE}. {MENTION_MARQUE}. Images : Robotime. Voix de synthèse (Piper, voix siwis, CC BY 4.0). #avantapres #maquettebois #construire #cadeauoriginal »

Règles : la ligne de voix n'est gardée que si une voix off est utilisée. Sans accord écrit de la marque, retirer `{MENTION_MARQUE}` et « Images : Robotime » (légendes TikTok comprises), les remplacer par « Maquette mécanique en bois ». Si la musique est une synthèse maison, le dire en légende.

## 7. Consignes pour studio-video (rendu brouillon)

1. **Brouillon en 540 x 960** (30 i/s, MP4 H.264 + AAC), durées exactes des tableaux ; **final en 1080 x 1920** après accord. Tailles de texte du tableau = final ; divisées par 2 en brouillon.
2. Chaque `MÉDIA FOURNISSEUR n°X` devient un **cadre gris `#111827`** avec « MÉDIA FOURNISSEUR n°X » et la description du média, lisibles (18 px min en brouillon), plus en bas « Brouillon : médias en attente d'accord de Robotime ». Aucun rendu 3D ne remplace ce cadre (leçon n° 11).
3. Variables non renseignées : afficher le nom de la variable entre accolades. Lignes À VÉRIFIER : repère visible en brouillon, supprimées en final si la donnée manque.
4. Afficher `{MENTION_PUB}` du début à la fin pour les versions « diffusion en pub ».
5. Rendre les **variantes « avec marque » et « sans marque »** pour A, B et C si l'accord n'est pas connu (le texte du brouillon avec marque porte la mention « sous réserve d'accord écrit »).
6. Contrôle avant rendu (leçon n° 14, grille §5) : planche contact + une image clé en taille réelle, loudness -14 LUFS ± 1 mesuré sur le MP4 final.
7. Statut de sortie : brouillon, à soumettre à `conformite-qa`.

## 8. Contrôle

- [x] Aucun visage ; médias fournisseur et cartons texte seulement
- [x] Accroche dans les 2 premières secondes pour A, B, C
- [x] Aucun chiffre inventé ; prix toujours avec `{FRAIS_LIVRAISON}`
- [x] Vouvoiement, aucun emoji, aucun superlatif, aucune fausse urgence, promo ou avis
- [x] Pas de « officielle », « revendeur officiel », « partenaire » ; variante sans marque prévue
- [x] « Écoutez » uniquement avec le vrai son du produit
- [x] Pas de durée de montage ni de « sans colle » par défaut
- [x] `{AGE}` affiché, ciblage 18 ans et plus, crédit Piper dans les trois légendes, mention « Publicité »
- [ ] Après accord : vérifier que « Images : Robotime » suffit aux conditions de Robotime (À VÉRIFIER) ; formulations de marque à faire valider par un professionnel (audit [PRO])
