---
agent: conformite-qa
statut: validé
valide_par: humain
date_validation: 2026-11-13
date: 2026-11-13
mode: audit
verdict: BLOQUANT
sources: [https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032227301, https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069414/LEGISCTA000006161708/, https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000047663185, https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000032292155, https://ai-act-service-desk.ec.europa.eu/fr/ai-act/article-50, https://creativecommons.org/licenses/by/4.0/legalcode.fr, https://datashare.ed.ac.uk/handle/10283/2353, https://datashare.ed.ac.uk/bitstream/handle/10283/2353/README.txt, https://www.openslr.org/109/, https://huggingface.co/rhasspy/piper-voices/blob/main/fr/fr_FR/siwis/medium/MODEL_CARD, https://www.gnu.org/licenses/gpl-3.0.html, https://www.inpi.fr/realiser-demarches/propriete-intellectuelle/deposant-et-cout-dune-marque, https://data.inpi.fr, https://www.tmdn.org/tmview/ (consultées le 2026-11-13)]
prochaine-etape: humain, vérifier la marque « Rouage & Laiton » (INPI, EUIPO, domaine, comptes), puis studio-video applique les corrections A2 à A7 ; nouvel audit court avant toute publication
---

# Audit de conformité : vidéos « De la planche à l'objet » (v1 et v2)

Tâche T55, synchro n°13. Livrables audités :
- `medias/de-la-planche-a-l-objet-9x16.mp4` (v1, sous-titres seulement) ;
- `medias/de-la-planche-a-l-objet-9x16-voix.mp4` (v2, voix Piper `fr_FR-siwis-medium`) ;
- `outputs/2026-11-13-studio-video-de-la-planche-a-l-objet.md` (storyboard, textes, crédits du §4) ;
- `medias/apercus/de-la-planche-a-l-objet/` (planches contact v1 et v2 regardées image par image, plus `v1-06b-cartes-verre.jpg` et `v2-07-fin.jpg` en taille réelle) ;
- `medias/voix/de-la-planche-a-l-objet.md` et `.srt` ;
- `medias/licences.md`.

Je ne peux pas écouter l'audio : la voix, la mélodie et les bruitages sont jugés sur le texte, les sous-titres, le code (`studio/video/outils/son.py`) et le rapport. Une écoute humaine reste nécessaire (point P3).

## 1. Verdict global

**BLOQUANT pour une publication en l'état.** Un seul point bloque : le nom « Rouage & Laiton », affiché et prononcé, n'a pas été vérifié (INPI, EUIPO, domaine, comptes). `knowledge/marque.md` impose cette vérification « avant toute mise en ligne publique ». Une vidéo publiée sur TikTok ou Instagram est une mise en ligne publique.

Tout le reste tient : la mention des rendus 3D est visible du début à la fin, il n'y a aucun chiffre, aucune promo, aucun avis ni allégation santé, et les licences sont exactes. Six points sont à corriger ; un seul (A3) demande un nouveau rendu.

Si la marque est vérifiée et que les points A2 à A7 sont corrigés, la v1 et la v2 pourront être publiées comme contenus d'image de marque, après l'accord de l'humain.

| Niveau | Nombre |
|---|---|
| ⛔ bloquant | 1 |
| ⚠️ à corriger | 6 |
| ✅ conforme | 13 |

## 2. Tableau des points

### 2.1 Points bloquants et à corriger

| # | Livrable | Point | Niveau | Correction proposée | Source |
|---|---|---|---|---|---|
| A1 | v1 et v2 (carte de fin, voix à 17,1 s, sous-titre 12), rapport §1 | **Nom « Rouage & Laiton » non vérifié.** Il est utilisé comme signature commerciale. S'il existe une marque antérieure identique ou similaire pour des produits proches (jeux et jouets, maquettes, classe 28 ; vente en ligne, classe 35), publier expose à une action en contrefaçon. Il faudrait alors retirer les vidéos et changer de nom. | ⛔ | Avant toute publication : 1) recherche d'antériorité gratuite sur data.inpi.fr (marques françaises) et sur TMview (marques de l'UE et internationales), sur le nom exact et ses variantes (« Rouage et Laiton », « Rouage », « Laiton ») en classes 28, 35, et 16 et 20 si des accessoires sont prévus ; 2) disponibilité du domaine et des noms de compte TikTok, Instagram, Pinterest et YouTube ; 3) si le nom est libre : dépôt INPI à envisager (190 € pour une classe, 40 € par classe en plus, tarif du 2 juillet 2026). L'humain note le résultat dans `knowledge/marque.md`. Si le nom n'est pas libre : studio-video refait les deux vidéos avec le nouveau nom (carte de fin, voix, `.srt`). | `knowledge/marque.md` ; CPI art. L713-2 et L716-4 (legifrance) ; INPI, coût d'un dépôt (inpi.fr) ; data.inpi.fr ; tmdn.org/tmview |
| A2 | v1 et v2, rapport §4 | **« Produit de démonstration, non vendu. » n'apparaît que sur les 3,2 dernières secondes** (16,8 à 20 s), en petit et en gris. Beaucoup de spectateurs ne voient pas la fin d'une vidéo courte. La pastille « Rendus 3D de démonstration » dit que les images sont des rendus, pas que l'objet n'est pas vendu. Un spectateur peut croire le produit disponible. | ⚠️ | Pas de nouveau rendu exigé. Commencer la légende de **chaque** publication (v1 et v2, sur chaque plateforme) par : `Produit de démonstration, non vendu pour l'instant. Images : rendus 3D de démonstration.` Au prochain rendu (voir A3), écrire aussi dans la pastille de la v2 : « Rendus 3D · produit de démonstration non vendu · voix de synthèse (IA) », si la largeur le permet. | Code de la consommation, art. L121-2 2° b (caractéristiques essentielles, disponibilité du bien) ; leçon 11 de `docs/retours-experience.md` |
| A3 | v1 et v2 (bouton de fin « Suivez l'atelier »), rapport §1 | **« Atelier »** laisse entendre que la boutique fabrique elle-même ses maquettes. Or le modèle prévu (`knowledge/contraintes.md`) est la revente de kits achetés à un fournisseur, et le mode de fabrication est une caractéristique essentielle. Le risque est faible pour une démonstration, mais le mot reviendra sur les vrais produits. | ⚠️ | Remplacer par « Suivez la suite » ou « Suivez-nous », puis nouveau rendu des deux vidéos par studio-video. On peut garder « atelier » seulement si l'humain assemble ou fabrique réellement quelque chose : c'est à lui d'en décider, et la décision va dans `knowledge/marque.md`. | Code de la consommation, art. L121-2 2° b (« mode et date de fabrication ») |
| A4 | v1 et v2 (bande son), `medias/licences.md` | **La mélodie sonne comme le produit, mais n'est pas le son du produit.** Une mélodie de boîte à musique passe sur les images de la boîte : le spectateur la prend pour l'air de l'objet. Or l'air réel est `À VÉRIFIER` (fiche, champ `melodie`). | ⚠️ | Ajouter à la légende de chaque publication : `Musique : mélodie originale de synthèse, ce n'est pas l'enregistrement du produit.` Pour un vrai produit, utiliser l'enregistrement réel de la boîte, ou garder cette mention. | Code de la consommation, art. L121-2 2° b ; fiche `site/src/content/produits/boite-a-musique-manivelle.md` |
| A5 | v2 (voix à 13,65 s), v1 et v2 (sous-titres 10 et 11), plan 5 (cylindre doré) | **« Laissez briller le laiton »** affirme une matière. Elle n'est pas prouvée : la fiche porte « Mécanisme à peigne (matériau : À VÉRIFIER) ». Le jeu de mots est acceptable sur une démonstration signalée comme telle (charnières et cylindre de couleur laiton sur les rendus). Il deviendrait trompeur sur un vrai produit sans pièce en laiton. | ⚠️ | Ne pas modifier les vidéos de démonstration. Ajouter dans `medias/voix/de-la-planche-a-l-objet.md` (fichier de studio-video, c'est lui qui l'écrit) la note : « Réplique "laissez briller le laiton" réservée à la démonstration : à ne réutiliser pour un vrai produit que si la fiche fabricant prouve des pièces en laiton visibles. » Le même garde-fou peut aller dans `knowledge/marque.md` (proposition à valider par l'humain). | Code de la consommation, art. L121-2 2° b (composition) ; `CLAUDE.md` (aucun chiffre ni fait inventé) |
| A6 | Rapport §4, version courte du crédit | **La version courte ne cite ni les auteurs ni le lien de la licence.** CC BY 4.0 demande l'identification des auteurs et le texte, l'URI ou le lien de la licence (art. 3(a)(1)(A) et (C)). Une forme raisonnable selon le support est admise (art. 3(a)(2)), mais il n'existe encore aucune page « Crédits » vers laquelle renvoyer. | ⚠️ | Utiliser la version complète partout où elle tient (elle fait environ 600 caractères). Remplacer la version courte par celle du §2.3. Ne pas compter sur le premier commentaire épinglé, sauf si la plateforme refuse la longueur. | CC BY 4.0, art. 3(a)(1) et 3(a)(2) (creativecommons.org, texte français) |
| A7 | Rapport §4 | **Il n'y a pas de légende prête pour la v1**, et la légende de la v2 ne reprend pas les mentions A2 et A4. | ⚠️ | Utiliser les légendes prêtes du §2.3 (v1 et v2). | Points A2, A4, A6 |

### 2.2 Points conformes

| # | Livrable | Point | Niveau | Constat | Source |
|---|---|---|---|---|---|
| C1 | v1 et v2 | Mention « Rendus 3D de démonstration » | ✅ | Présente sur les 12 images de chaque planche contact (0 à 20 s), lisible (environ 30 px sur 1080 px de large, fond contrasté), sous les 15 % du haut. En v2 : « Rendus 3D de démonstration · voix de synthèse (IA) ». | Leçon 11 de `docs/retours-experience.md` |
| C2 | v2 | Voix de synthèse signalée | ✅ | Mention « voix de synthèse (IA) » à l'écran pendant toute la vidéo, et étiquette « contenu généré par IA » de la plateforme à activer (rapport §4 et ACTION HUMAINE 4). Une voix Piper qui lit un texte de marque n'imite pas une personne réelle identifiable : ce n'est a priori pas un « hypertrucage » au sens de l'art. 50(4) du règlement IA. La mention va de toute façon au-delà de ce qu'exige cet article (interprétation : voir P1). | Règlement (UE) 2024/1689, art. 50 (service d'assistance de la Commission sur le règlement IA) |
| C3 | v1, v2, voix, `.srt` | Aucun chiffre ni fausse promo | ✅ | Ni prix, ni réduction, ni délai, ni nombre de pièces, ni temps d'assemblage, ni urgence. « Ça, c'est ce qu'il y a dans la boîte » remplace « ce que vous recevez » : il n'y a plus de promesse d'envoi. Le contenu (planches et mécanisme) correspond à `contenu_boite` de la fiche. | Code de la consommation, art. L121-2 et L121-4 |
| C4 | v1 et v2 (cartes en verre) | Caractéristiques affichées | ✅ | « Niveau : Facile », « Mécanisme : À peigne », « Entraînement : Manivelle » : reprises de la fiche (`difficulte`, `mecanisme`). « Facile » renvoie à l'échelle interne de la boutique, ce qui est acceptable. | Fiche produit |
| C5 | v1, v2, voix | Aucun avis, aucune allégation santé ou bien-être, aucun superlatif creux | ✅ | « Un écran de plus ? Non. » est un positionnement, pas une allégation santé. | `CLAUDE.md` ; `knowledge/marque.md` (ton) |
| C6 | v1 et v2 | Public visé : adultes | ✅ | Aucun visuel ni texte qui vise les enfants (décor de bureau, ton adulte). La mention « 14 ans et plus » n'est pas nécessaire sur une vidéo sans offre. Elle le sera sur les contenus d'un vrai produit (recommandation). | `knowledge/politiques.md` ; `knowledge/niche.md` |
| C7 | v1 et v2 | Aucune électronique | ✅ | Boîte à peigne et manivelle (FAQ de la fiche : « Aucune électronique »). La lumière de la scène de nuit vient d'une source hors champ ; la boîte n'éclaire pas. | `knowledge/niche.md` |
| C8 | v1 et v2 | Prix TTC, frais de livraison, GPSR | ✅ (sans objet) | Il n'y a aucune offre : pas de prix, pas de lien d'achat. Les informations de l'art. 19 du règlement GPSR sont dues sur les offres de vente à distance, pas ici. | Règlement (UE) 2023/988, art. 19 |
| C9 | v1 et v2 | Publicité identifiable | ✅ | Les vidéos seront publiées par le compte de la marque elle-même : l'annonceur est identifiable. La loi « influence » de 2023 ne s'applique pas (pas de créateur, pas de partenariat, pas de visage ni de silhouette retouchés ou générés). Si un jour la vidéo est sponsorisée ou confiée à un créateur, ajouter « Publicité » ou « Collaboration commerciale ». | LCEN, art. 20 ; loi n° 2023-451 du 9 juin 2023 |
| C10 | `medias/licences.md`, rapport §4 | Polices Cormorant Garamond et Inter | ✅ | SIL OFL 1.1 (fichier `LICENSE` présent dans `site/node_modules/@fontsource/cormorant-garamond/` : « Copyright 2015 The Cormorant Project Authors »). La licence autorise l'usage dans une vidéo (texte rendu en pixels) sans crédit. Garder la licence avec les fichiers de police s'ils sont redistribués. | Licence OFL fournie avec les polices |
| C11 | `medias/licences.md`, rapport §4 | Voix siwis et voix de base hifi_tts_92 | ✅ | Vérifié sur les sources officielles. **SIWIS** : titre « The SIWIS French Speech Synthesis Database », auteurs Yamagishi, Honnet, Garner, Lazaridis, éditeur University of Edinburgh, School of Informatics, CSTR, 2017, DOI 10.7488/ds/1705. Le README du dépôt dit : « usable for any purpose, under the Creative Commons Attribution 4.0 International (CC BY 4.0) licence ». **Hi-Fi TTS (SLR109)** : auteurs Bakhturina, Lavrukhin, Ginsburg, Zhang (2021), CC BY 4.0, enregistrements tirés de livres audio LibriVox. **MODEL_CARD Hugging Face** identique à la copie locale (« Finetuned from the U.S. English hifi_tts_92 base model »). Le crédit complet du §4 contient les auteurs, les titres, les liens, la licence avec son lien et la mention de l'usage (« données d'entraînement »). Il est complet et exact. Seule la version courte est à corriger (A6). | datashare.ed.ac.uk (page et README) ; openslr.org/109 ; huggingface.co (MODEL_CARD) ; CC BY 4.0, art. 3 |
| C12 | `medias/licences.md` | Piper GPL-3.0 | ✅ | La GPL couvre le programme. Le son produit n'est couvert que s'il contient lui-même une partie du programme (GPL v3, section 2 : la sortie n'est couverte que si, par son contenu, elle constitue une œuvre couverte). Le fichier audio n'est donc pas soumis à la GPL ; seul le crédit CC BY de la voix s'applique. | gnu.org, GPL v3, section 2 |
| C13 | `medias/licences.md` | faster-whisper, mélodie, bruitages, rendus 3D | ✅ | faster-whisper (MIT, vérifié en T49) ne sert qu'à caler les sous-titres : rien de lui ne reste dans la vidéo. La mélodie et les bruitages sont produits par `son.py` : motif écrit dans le code, synthèse sans échantillon, aucun fichier audio tiers lu. Les rendus 3D sont une création interne. Ressemblance éventuelle avec un air existant : je ne peux pas l'exclure sans écoute (P3). | `studio/video/outils/son.py` (lignes 1 à 63) |

### 2.3 Textes corrigés prêts à copier (proposition, à valider par l'humain)

**Légende v1** (en tête de légende, sur toutes les plateformes) :
```
Produit de démonstration, non vendu pour l'instant. Images : rendus 3D de démonstration. Musique : mélodie originale de synthèse, ce n'est pas l'enregistrement du produit.
```

**Légende v2**, à placer à la fin de la description, en plus des deux premières phrases ci-dessus en tête :
```
Produit de démonstration, non vendu pour l'instant. Images : rendus 3D de démonstration. Musique : mélodie originale de synthèse, ce n'est pas l'enregistrement du produit.
Voix de synthèse (IA) générée avec Piper, voix fr_FR-siwis-medium. Données d'entraînement : « The SIWIS French Speech Synthesis Database », J. Yamagishi, P.-E. Honnet, P. Garner, A. Lazaridis, University of Edinburgh (doi.org/10.7488/ds/1705) et « Hi-Fi Multi-Speaker English TTS Dataset », E. Bakhturina, V. Lavrukhin, B. Ginsburg, Y. Zhang (openslr.org/109), sous licence CC BY 4.0 (creativecommons.org/licenses/by/4.0). Voix utilisée pour lire un texte original.
```

**Version courte corrigée du crédit** (seulement si la limite de caractères est atteinte) :
```
Voix IA : Piper fr_FR-siwis-medium. Données : SIWIS (Yamagishi, Honnet, Garner, Lazaridis, Univ. of Edinburgh, doi.org/10.7488/ds/1705) et Hi-Fi TTS (Bakhturina et al., openslr.org/109), CC BY 4.0 (creativecommons.org/licenses/by/4.0). Rendus 3D de démonstration, produit non vendu.
```

Sur TikTok et Instagram, activer en plus l'étiquette « contenu généré par IA » pour la v2. C'est une règle de plateforme, à vérifier dans l'interface au moment de publier.

## 3. Ce qui doit être revu par un professionnel ou par l'humain

- **P1 (juriste, facultatif)** : dire si une voix de synthèse construite à partir de la voix d'une comédienne réelle (le jeu SIWIS) relève de l'obligation d'information de l'art. 50(4) du règlement IA. Ma lecture, prudente : la mention à l'écran et l'étiquette de la plateforme suffisent dans tous les cas. Le calendrier de l'art. 50, modifié par l'« omnibus numérique », est à revérifier au Journal officiel au moment de publier.
- **P2 (conseil en propriété industrielle, recommandé)** : la recherche d'antériorité sur « Rouage & Laiton » (A1) et le choix des classes avant un dépôt. Une recherche à l'identique sur data.inpi.fr ne détecte pas les marques seulement similaires.
- **P3 (humain, à l'écoute)** : vérifier que la mélodie ne rappelle pas un air connu protégé. Vérifier aussi que la voix est nette et que « plus » se prononce bien dans « Un écran de plus ? ».
- **P4 (humain)** : la décision de publier un produit de démonstration non vendu (rapport studio-video, ACTION HUMAINE 3), puis l'accord explicite avant toute publication.

## 4. Sources (consultées le 2026-11-13)

- Code de la consommation, art. L121-2 (pratiques commerciales trompeuses) et L121-4 : https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032227301 et https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069414/LEGISCTA000006161708/
- Code de la propriété intellectuelle, art. L713-2 et L716-4 (contrefaçon de marque) : https://www.legifrance.gouv.fr
- Loi n° 2023-451 du 9 juin 2023 (influence commerciale) : https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000047663185
- LCEN, art. 20 (publicité identifiable) : https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000032292155
- Règlement (UE) 2024/1689 sur l'IA, art. 50 : https://ai-act-service-desk.ec.europa.eu/fr/ai-act/article-50 (texte consolidé au 27 juillet 2026 selon la page)
- Règlement (UE) 2023/988 (GPSR), art. 19 : https://eur-lex.europa.eu/eli/reg/2023/988/oj
- Licence CC BY 4.0, texte juridique français : https://creativecommons.org/licenses/by/4.0/legalcode.fr
- SIWIS, page du jeu de données et README (licence CC BY 4.0) : https://datashare.ed.ac.uk/handle/10283/2353 ; https://datashare.ed.ac.uk/bitstream/handle/10283/2353/README.txt
- Hi-Fi TTS (SLR109) : https://www.openslr.org/109/
- MODEL_CARD de la voix siwis medium : https://huggingface.co/rhasspy/piper-voices/blob/main/fr/fr_FR/siwis/medium/MODEL_CARD
- GPL v3 : https://www.gnu.org/licenses/gpl-3.0.html
- INPI, coût d'un dépôt de marque (190 € pour une classe, 40 € par classe en plus ; grille tarifaire applicable au 2 juillet 2026) : https://www.inpi.fr/realiser-demarches/propriete-intellectuelle/deposant-et-cout-dune-marque
- Recherche de marques : https://data.inpi.fr ; https://www.tmdn.org/tmview/
- Fichiers internes : `knowledge/marque.md`, `knowledge/politiques.md`, `knowledge/niche.md`, `knowledge/contraintes.md`, `knowledge/decisions.md`, `docs/retours-experience.md` (leçons 10, 11, 13), fiche `site/src/content/produits/boite-a-musique-manivelle.md`, `studio/video/.cache/voix-piper/fr_FR-siwis-medium.MODEL_CARD`.
