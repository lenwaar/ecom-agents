---
agent: conformite-qa
statut: à-valider   # toujours cette valeur
date: 2026-11-12
mode: audit
verdict: BLOQUANT
sources: [CLAUDE.md, docs/architecture.md, knowledge/README.md, knowledge/niche.md, knowledge/contraintes.md, outputs/2026-11-12-sourcing-produits-maquettes-bois-v2.md (livrable audité), outputs/2026-11-12-sourcing-produits-maquettes-bois.md (v1, pour les sources reprises), outputs/2026-11-12-conformite-qa-dossier-vente-legale-maquettes-bois.md, sources officielles de la section 4 (consultées le 2026-11-12)]
prochaine-etape: l'humain décide s'il demande une v3 à sourcing-produits avec les corrections ci-dessous (n°1, 3 et 4 retirés, n°2 sous conditions), puis nouvel audit conformite-qa sur la v3
---

# Audit conformité : sourcing v2, maquettes en bois (2026-11-12)

> Livrable audité : `outputs/2026-11-12-sourcing-produits-maquettes-bois-v2.md` (agent sourcing-produits, statut à-valider). **Il n'a pas été modifié** : les corrections sont proposées ici. Seul l'humain décide de les faire appliquer.
> Nature du livrable : document **interne** d'aide à la décision. Rien n'y est destiné à être publié tel quel. Les points « Pages et parcours d'achat » et « Emails et données » de la grille sont donc sans objet. J'ai contrôlé ce qui, dans ce document, conditionnera des textes ou des choix publics : produits retenus, canal d'achat, prix, photos, règles proposées pour `knowledge/prix-et-marges.md`, brouillons de messages.
> Contexte important : `knowledge/niche.md` a été mis à jour **après** la rédaction de la v2 (décisions humaines du 2026-11-12 : aucune électronique au lancement ; produits de marque authentiques seulement via un canal officiel). Plusieurs points bloquants viennent de ce décalage, pas d'une erreur de calcul de l'agent.
> Je ne suis pas avocat. Les points marqués **[PRO]** sont des interprétations à faire confirmer.

## 1. Verdict global

**BLOQUANT.** En l'état, 3 des 4 produits « en sursis » (n°1, 3 et 4) ne peuvent pas être retenus. Le seul produit encore possible est le n°2 (circuit à billes à manivelle), et uniquement si les conditions des points 3 à 6 sont remplies.

| Niveau | Nombre |
|---|---|
| ⛔ Bloquant | 2 |
| ⚠️ À corriger | 11 |
| ✅ Conforme | 5 |
| Sans objet | 4 |

## 2. Tableau des points

Livrable : `outputs/2026-11-12-sourcing-produits-maquettes-bois-v2.md` (abrégé « v2 »).

### Produit et sécurité

| # | Point (endroit dans la v2) | Niveau | Constat | Correction proposée | Source |
|---|---|---|---|---|---|
| 1 | **Électronique** : n°1 boîte à musique (lumière, recharge USB-C, mélodies), n°3 usine à café (musique, LED), n°4 horloge à coucou (quartz, LED, son, piles AAA ou USB-C). §1, §5, §6 | ⛔ | Contraire à la décision de `niche.md` : « Sans électronique au lancement (pas de LED, musique, moteur ni pile) ». La v2 les traite encore comme acceptables « si le CE est vérifié », règle remplacée depuis | Retirer les n°1, 3 et 4 de la liste « en sursis » et les passer en section 4 avec le motif : « Électronique : exclu par `niche.md` (décision du 2026-11-12) ». Supprimer la décision n°2 de la section 10, qui est déjà tranchée. Garder les fiches en annexe « à réévaluer plus tard » si l'humain le souhaite. Ajouter à l'élimination de U16, U17, U19 (« circuit électrique ») le même motif | `knowledge/niche.md` ; dossier conformite-qa, O23 |
| 2 | **Canal d'achat des produits de marque** : n°1, 3, 4 et secours U2 achetés auprès de vendeurs AliExpress (filtre « Expédié depuis : France / Espagne »), dont l'identité et le statut de revendeur agréé ne sont pas connus. §1, §3.2, §5 | ⛔ | `niche.md` n'autorise les produits de marque que « s'ils sont achetés via un canal officiel (fabricant ou distributeur agréé) ». En droit des marques, la revente libre d'un produit marqué suppose qu'il ait été mis dans le commerce **dans l'UE ou l'EEE** par le titulaire ou avec son consentement (épuisement des droits). Un entrepôt en France ou en Espagne ne prouve pas cette première mise sur le marché UE : un lot importé de Chine sans accord de la marque n'en bénéficie pas. Ce motif bloquerait ces produits même s'ils étaient sans électronique | Règle à ajouter à la méthode : « Produit de marque = seulement si le fournisseur est la marque elle-même (ex. Robotime Europe, O1) ou un distributeur dont l'agrément est **confirmé par écrit par la marque** ». Les annonces AliExpress de produits de marque passent en « Éliminé : canal non officiel ». Pour les gammes **sans électronique** de la marque leader, le canal O1 reste la seule piste (voir point 13). **[PRO]** juriste en propriété intellectuelle avant toute revente de produit de marque | `knowledge/niche.md` ; article L713-4 du code de la propriété intellectuelle [L1] |
| 3 | **Âge du n°2** : l'annonce dit « pour adultes et adolescents », sans âge chiffré. §5 n°2 | ⚠️ | Un produit sans mention « 14 ans et plus », ou marqué moins de 14 ans, relève de la réglementation jouets et est exclu par `niche.md`. « Adolescents » ne suffit pas | Rendre le critère **éliminatoire et prouvé** : photo de la boîte ou de la notice montrant « 14+ » (ou « 14 ans et plus »), à joindre à la fiche. Sans cette preuve, le n°2 est éliminé. Ajouter cette ligne à la section 8 (vérifications humaines) | `knowledge/niche.md` ; décret n° 2010-166 [J1] ; directive 2009/48/CE [J2] |
| 4 | **Positionnement « enfant » des prix concurrents** : la justification du prix du n°2 s'appuie sur des circuits à billes vendus dans la rubrique « /enfant/jeux-construction » de Nature & Découvertes (sources v1 [C4][C12]). §5 n°2 | ⚠️ | Pas illégal en soi, mais c'est un signal : le même type de produit est présenté comme un jeu pour enfants par un grand revendeur. Si nos visuels ou textes reprennent ce positionnement, le produit risque d'être considéré comme un jouet | Dans la v3, ajouter à la fiche n°2 : « Comparables vendus en rayon enfant : nos photos, vidéos et textes ne montrent ni enfant, ni usage de jeu, ni univers enfantin ». Chercher au moins un prix concurrent dans une rubrique adulte (loisirs créatifs, déco, cadeau). **[PRO]** risque de requalification en jouet | `knowledge/niche.md` ; dossier conformite-qa, O18 |
| 5 | **GPSR du n°2** : fabricant, personne responsable dans l'UE, référence et avertissements `À VÉRIFIER`. §5 n°2, §6 | ⚠️ (⛔ à la publication si non obtenu) | Le règlement GPSR exige, pour la vente en ligne, l'affichage du fabricant, de la personne responsable établie dans l'UE si le fabricant est hors UE, de l'identification du produit et des avertissements. Pour un produit générique expédié de Chine, ces informations manquent souvent, et nous pourrions être considérés comme importateur (notre nom sur l'emballage) | Dans la méthode de sourcing, passer « fabricant identifié + responsable UE + avertissements en français » de `À VÉRIFIER` à **critère éliminatoire**, avec une colonne dédiée dans le tableau §6. Ajouter à la section 8 : « photo de l'étiquette ou de la boîte montrant le nom et l'adresse du fabricant et d'un responsable UE ». Avertissement minimal à prévoir pour le n°2 : présence de billes et de petites pièces (formulation exacte à valider). **[PRO]** rôle d'importateur en dropshipping depuis la Chine | Règlement (UE) 2023/988, art. 16 et 19 [G1] ; `niche.md` ; dossier conformite-qa, O17 |
| 6 | **Copie de modèle (n°2)** : originalité « `À VÉRIFIER` » par rapport aux circuits à billes des deux marques leaders. §5 n°2 | ⚠️ | `niche.md` interdit toute copie de modèles de marque. Un circuit générique très proche d'un modèle de marque peut aussi poser un problème de droit d'auteur ou de dessins et modèles | Rendre la comparaison **éliminatoire** : si la forme, le mécanisme et la présentation reprennent un modèle de marque identifiable, le produit est exclu. Garder dans la fiche la capture des deux produits comparés. **[PRO]** en cas de doute | `knowledge/niche.md` ; article L122-4 du code de la propriété intellectuelle [L2] |
| 7 | **Recyclage (REP jouets et emballages) absent de la v2** | ⚠️ | Les maquettes et puzzles entrent dans la filière REP « jouets » quel que soit l'âge indiqué. Le premier metteur sur le marché français doit adhérer à un éco-organisme, et l'emballage relève de la REP emballages. La v2 ne mentionne ni l'éco-participation, ni l'adhésion, ni le logo Triman | Ajouter dans chaque fiche une ligne « REP jouets : le fournisseur a-t-il un IDU en France ? Triman + info-tri sur la boîte ? » et, dans le coût, une ligne « éco-participation (`À VÉRIFIER`) ». Ajouter ces questions aux brouillons B, C et D de la section 9. **[PRO]** qui est producteur dans chaque option (A ou B de `contraintes.md`) | Article R543-320 du code de l'environnement [E1] ; dossier conformite-qa, O19 à O22 |

### Textes commerciaux, prix, marques, images

| # | Point (endroit dans la v2) | Niveau | Constat | Correction proposée | Source |
|---|---|---|---|---|---|
| 8 | **Mention « produit authentique »** pour n°1, 3, 4 et U1 à U10. §1, §3.2, §5 | ⚠️ | L'authenticité n'est pas établie : elle repose sur le titre de l'annonce. Si cette mention passait telle quelle dans une fiche ou une vidéo, ce serait une allégation invérifiable | Remplacer par « présenté comme authentique par le vendeur, non vérifié ». Interdire dans tout texte public le mot « authentique » ou « officiel » sans preuve écrite du canal (facture de la marque ou de son distributeur agréé). La décision n°1 de la §10 est déjà tranchée dans `niche.md` : la remplacer par un renvoi à cette règle | `knowledge/niche.md` ; CLAUDE.md (aucune allégation non sourcée) |
| 9 | **Photos et vidéos** : la v2 envisage les médias de la marque et le brouillon C demande aux **vendeurs AliExpress** l'autorisation de réutiliser « leurs » photos. §5 « Médias », §9 C | ⚠️ | Seul le titulaire des droits peut autoriser une reproduction. Un revendeur ne peut pas autoriser l'usage de photos qui appartiennent à la marque ou à un photographe | Corriger le brouillon C : « Are you the owner of the rights on these photos and videos? If so, may I reuse them on my website and social media? Please confirm in writing. » Ajouter la règle : « Photos de marque = autorisation écrite de la marque ; photos de vendeur = confirmation écrite qu'il en est l'auteur ; sinon, photos et vidéos tournées par nous avec l'échantillon ». La v2 propose déjà ce contenu propre (timelapse), c'est la solution la plus sûre | Article L122-4 du code de la propriété intellectuelle [L2] |
| 10 | **Taxes d'import « 5 € par colis »**. §2, §5 n°2, §7 | ⚠️ | La douane indique : droit forfaitaire de 3 € (depuis le 1er juillet 2026, envois ≤ 150 €) et frais de traitement de 2 € (depuis le 1er novembre 2026, sans seuil de valeur), **par catégorie d'article**, pas par colis. Pour une commande d'un seul article, le total reste 5 € : les marges du n°2 sont justes | Remplacer « 5 € par colis » par « 3 € de droit + 2 € de frais de traitement **par catégorie d'article** (5 € pour une commande d'un seul produit ; 10 € si deux produits de catégories différentes) » dans §2, §5 et dans la proposition `prix-et-marges.md` | douane.gouv.fr [D1] |
| 11 | **Proposition `prix-et-marges.md`, ligne prix barré** : « Ne jamais afficher de prix barré sans prix de référence réel (30 jours) ». §7 | ⚠️ | Formulation trop vague. La loi exige d'indiquer le prix antérieur, c'est-à-dire **le prix le plus bas pratiqué par la boutique** dans les 30 jours précédant la réduction. La réduction affichée se calcule sur ce prix | Remplacer par : « Toute annonce de réduction (prix barré, "-X %") indique le prix antérieur = le prix le plus bas que nous avons pratiqué dans les 30 jours précédant la réduction. Le pourcentage se calcule sur ce prix. Pour des réductions successives, le prix antérieur est celui d'avant la première réduction. Jamais de prix barré basé sur le prix d'un concurrent ou d'AliExpress. » **[PRO]** cas d'un produit vendu depuis moins de 30 jours | Article L112-1-1 du code de la consommation [C1] ; DAJ, arrêt CJUE du 26/09/2024 [C2] |
| 12 | **Proposition `prix-et-marges.md`, calcul de marge** | ⚠️ | Le coût de revient n'intègre pas les cotisations sociales de la micro-entreprise (12,3 % du chiffre d'affaires, 13,3 % avec versement libératoire) ni les frais REP. La marge de 10 € n'est donc pas une marge « nette » au sens de `contraintes.md`. Exemple pour le n°2 à 26,90 € : 12,3 % = 3,309 €, marge 12,258 − 3,309 = **8,95 €**, sous 10 €. **Le n°2 tomberait sous le seuil** (à confirmer selon le statut et l'option fiscale) | Ajouter dans la formule : « + cotisations sociales (12,3 % du prix de vente, 13,3 % avec versement libératoire) + éco-participation REP (`À VÉRIFIER`) ». Nouveau raccourci (frais de paiement 3 % + 0,30 €, SAV 5 %, cotisations 12,3 %) : achat + livraison + taxes ≤ 0,797 × prix de vente − 10,30 €. Le n°2 aurait besoin d'un prix d'environ 28,90 € (vérification à refaire dans la v3). Remplacer « TVA : statut à préciser » par « franchise en base tant que le chiffre d'affaires reste sous 85 000 € (2026) ». **[PRO]** expert-comptable | entreprendre.service-public.gouv.fr F36232 [U1] et F21746 [U2] ; dossier conformite-qa, O3 et O7 |
| 13 | **Brouillon A (Robotime Europe)**, §9 | ⚠️ | La question 4 sur le CE des produits avec LED ou son n'a plus d'objet. Il manque les questions qui permettent de prouver le canal officiel et de remplir les obligations françaises | Remplacer la question 4 par : « Who is the economic operator responsible in the EU (GPSR) for your models without electronics, and is it printed on the box? » Ajouter : « 7. Can you confirm in writing that we would be an authorised reseller, and that the products you ship were first placed on the EU market by you? 8. Are you registered with a French toy EPR scheme (Ecomaison) with a unique identifier (IDU), and do the boxes carry the Triman logo? » Cibler les références **sans électronique** du catalogue (ex. « Forest Tea Party » AMT03 seulement si elle n'a ni lumière ni musique, `À VÉRIFIER`) | `niche.md` ; [G1] ; [L1] ; [E1] |
| 14 | **Allégations santé ou bien-être** | ✅ | Aucune allégation santé, médicale ou bien-être dans la v2 | — | CLAUDE.md |
| 15 | **Noms de marques** dans un document interne | ✅ | Les noms servent uniquement à l'analyse, avec un avertissement en tête. Aucun texte public proposé ne cite une marque | Garder l'avertissement dans la v3 | `knowledge/niche.md` |
| 16 | **Avis clients** | ✅ | Les notes et ventes AliExpress servent seulement au tri des fournisseurs. Aucun affichage d'avis n'est proposé | Règle préventive à ajouter dans la v3 : « Ne jamais reprendre sur la boutique les notes ou avis AliExpress : seuls nos propres avis clients, avec l'information sur leur contrôle, pourront être affichés » | Article L111-7-2 du code de la consommation [C3] ; DGCCRF, faux avis [C4] |
| 17 | **Prix TTC et cohérence des calculs** | ✅ | Prix d'achat relevés TTC et datés ; prix de vente conseillés exprimés TTC ; calculs recomptés ligne par ligne (j'ai refait les marges des n°1 à 4 : exactes, hors points 10 et 12) | — | `contraintes.md` |
| 18 | **Délai de livraison** | ✅ | Le délai de 14 jours de `contraintes.md` est appliqué comme critère éliminatoire (n°2 éliminé si le délai annoncé dépasse 14 jours). Juridiquement, le délai annoncé au client devra être respecté ; à défaut d'indication, c'est 30 jours maximum | Dans la v3, relever le délai **maximum** affiché sur l'annonce (pas une source tierce comme [S9]) | entreprendre.service-public.gouv.fr F23455 [U3] |

### Points sans objet pour ce livrable

| Point de la grille | Pourquoi |
|---|---|
| Promotions publiées | Aucune promotion proposée (seule la règle de `prix-et-marges.md` est contrôlée, point 11) |
| Influence commerciale | Aucun contenu avec créateur ou partenariat |
| Pages légales et parcours d'achat (mentions légales, CGV, rétractation, garanties, médiateur) | Document interne ; traité dans le dossier conformite-qa du même jour |
| Emails et données | Les brouillons de la §9 sont des messages professionnels à des fournisseurs, sans données de clients ; ils contiennent seulement des champs à remplir |

### Ce qu'il reste après correction

| Produit | Situation |
|---|---|
| n°1, n°3, n°4 | **Éliminés** (points 1 et 2). À réévaluer seulement si l'humain lève l'interdiction de l'électronique **et** si le canal est officiel |
| n°2 | **En sursis renforcé** : âge 14+ prouvé (3), positionnement adulte (4), GPSR complet (5), pas de copie (6), délai ≤ 14 jours sur l'annonce, et marge à recalculer avec les cotisations (12) |
| Piste O1 (canal officiel, gammes sans électronique) | Seule voie compatible avec `niche.md` pour des produits de marque ; dépend de la réponse au brouillon A corrigé (13) et de l'accord de l'humain pour l'envoyer |

## 3. Ce qui doit être revu par un professionnel

**Juriste en propriété intellectuelle**
1. Revente de produits de marque achetés hors du réseau officiel : portée de l'épuisement des droits (L713-4) et preuve de la première mise sur le marché UE.
2. Usage du nom de la marque pour décrire un produit authentique (titres, mots-clés, publicité) sans laisser croire à un partenariat.
3. Circuit à billes générique : risque de contrefaçon de dessin ou de droit d'auteur par rapport aux modèles des marques leaders.

**Juriste en droit de la consommation ou sécurité des produits**
4. Rôle GPSR (importateur ou distributeur) en dropshipping depuis la Chine ; obligation de mettre notre nom sur l'emballage.
5. Risque de requalification en jouet d'un produit marqué 14+ vendu ailleurs en rayon enfant.
6. Prix antérieur pour un produit vendu depuis moins de 30 jours (règle L112-1-1).

**Expert-comptable**
7. Intégration des cotisations sociales (12,3 % ou 13,3 %) et des frais REP dans la marge minimale de 10 €, et choix du versement libératoire.

**Éco-organismes (questions écrites, gratuites)**
8. Qui est producteur REP jouets et emballages dans chaque option (dropshipping ou stock léger), et si le fournisseur a déjà un IDU en France.

## 4. Sources

Toutes consultées le 2026-11-12.

**Internes**
- `knowledge/niche.md` (décisions du 2026-11-12 : électronique, produits de marque), `knowledge/contraintes.md`, `CLAUDE.md`.
- `outputs/2026-11-12-conformite-qa-dossier-vente-legale-maquettes-bois.md` (dossier du même jour ; ses sources officielles [S3], [S7], [S9], [S17], [S19], [S21] à [S28] sont reprises ici).

**Officielles**
- [L1] legifrance.gouv.fr, article L713-4 du code de la propriété intellectuelle (épuisement des droits de marque ; version en vigueur depuis le 15/12/2019) : https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000039381595
- [L2] legifrance.gouv.fr, article L122-4 du code de la propriété intellectuelle (reproduction sans consentement illicite) : https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006278911/2022-04-22
- [C1] legifrance.gouv.fr, article L112-1-1 du code de la consommation (prix antérieur, 30 jours ; en vigueur depuis le 28/05/2022) : https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000044549592
- [C2] economie.gouv.fr, Lettre de la DAJ, « La CJUE juge qu'une réduction de prix annoncée dans une publicité doit être… » (arrêt du 26/09/2024) : https://www.economie.gouv.fr/daj/lettre-de-la-daj-la-cjue-juge-quune-reduction-de-prix-annoncee-dans-une-publicite-doit-etre
- [C3] legifrance.gouv.fr, article L111-7-2 du code de la consommation (information sur les avis en ligne) : https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000049571119
- [C4] economie.gouv.fr (DGCCRF), « Avis en ligne : attention aux faux commentaires » : https://www.economie.gouv.fr/dgccrf/les-fiches-pratiques/avis-en-ligne-attention-aux-faux-commentaires
- [D1] douane.gouv.fr, « Petits colis : ce qui change pour vos achats en ligne » (3 € par catégorie d'article depuis le 01/07/2026 ; 2 € de frais de traitement par catégorie d'article depuis le 01/11/2026 ; page sans date de mise à jour) : https://www.douane.gouv.fr/petits-colis-ce-qui-change-pour-vos-achats-en-ligne
- [G1] eur-lex.europa.eu, règlement (UE) 2023/988 (GPSR), art. 16 et 19 : https://eur-lex.europa.eu/eli/reg/2023/988/oj?locale=fr (numéros d'articles repris du dossier conformite-qa, dont la limite de lecture est signalée en §6)
- [J1] legifrance.gouv.fr, décret n° 2010-166 relatif à la sécurité des jouets : https://www.legifrance.gouv.fr/loda/id/JORFTEXT000021865465
- [J2] eur-lex.europa.eu, directive 2009/48/CE : https://eur-lex.europa.eu/legal-content/FR/ALL/?uri=CELEX:32009L0048
- [E1] legifrance.gouv.fr, article R543-320 du code de l'environnement (REP jouets : « les maquettes, les puzzles, les jeux de société ») : https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000044095934
- [U1] entreprendre.service-public.gouv.fr, cotisations du micro-entrepreneur, F36232 : https://entreprendre.service-public.gouv.fr/vosdroits/F36232
- [U2] entreprendre.service-public.gouv.fr, franchise en base de TVA, F21746 : https://entreprendre.service-public.gouv.fr/vosdroits/F21746
- [U3] entreprendre.service-public.gouv.fr, « Faire du commerce en ligne : règles à respecter », F23455 : https://entreprendre.service-public.gouv.fr/vosdroits/F23455

### Auto-contrôle
- [x] Chaque obligation a une source officielle datée (ou renvoie à une décision interne de `niche.md` / `contraintes.md`).
- [x] Montants à jour au 2026-11-12 : taxes d'import (douane, dont les 2 € en vigueur depuis le 01/11/2026), cotisations 12,3 % / 13,3 % et seuil de franchise TVA 85 000 € (repris du dossier du jour, sources vérifiées le même jour).
- [x] Chaque ⚠️ et ⛔ a une correction concrète.
- [x] Interprétations marquées **[PRO]** ; le livrable audité n'a pas été modifié.
