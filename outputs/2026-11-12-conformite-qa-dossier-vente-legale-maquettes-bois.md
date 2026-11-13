---
agent: conformite-qa
statut: validé   # toujours cette valeur
valide_par: humain
date_validation: 2026-11-13
date: 2026-11-12
mode: dossier
sources: [CLAUDE.md, docs/architecture.md, knowledge/README.md, knowledge/niche.md, knowledge/contraintes.md, outputs/2026-11-12-sourcing-produits-maquettes-bois-v2.md, sources officielles de la section 7 (consultées le 2026-11-12)]
prochaine-etape: validation humaine des décisions (section 6), puis rendez-vous expert-comptable / juriste sur les points marqués, puis rédaction des pages légales par architecte-web et nouvel audit conformite-qa
---

# Dossier réglementaire : vendre légalement nos maquettes en bois en France

> Document interne. Je ne suis pas avocat : je liste les obligations et je cite les textes officiels. Les points marqués **[PRO]** doivent être confirmés par un expert-comptable ou un juriste avant d'agir.
> `knowledge/marque.md` et `knowledge/politiques.md` n'existent pas encore. Le ton et le nom de la boutique sont donc laissés en `À VÉRIFIER`.
> Sources consultées le **2026-11-12**. Sur les pages officielles, la mention « vérifié le » indique la date du dernier contrôle de la page par l'administration.

## 1. Résumé (5 lignes)

1. **Statut** : la micro-entreprise (activité de vente de marchandises) convient. L'inscription est gratuite sur le guichet unique (formalites.entreprises.gouv.fr). Les cotisations sont de 12,3 % du chiffre d'affaires, ou 13,3 % avec le versement libératoire de l'impôt. Le plafond 2026 est de 203 100 € de chiffre d'affaires.
2. **TVA** : la franchise en base reste applicable en 2026 sous 85 000 € de ventes (seuil majoré : 93 500 €). Le seuil unique de 25 000 € envisagé en 2025 a été abandonné. Les factures portent alors la mention « TVA non applicable, art. 293 B du CGI ».
3. **Pages légales** : il faut des mentions légales, des CGV, une politique de confidentialité, un bandeau cookies (« Tout refuser » aussi visible que « Tout accepter »), le formulaire de rétractation et, **depuis le 19 juin 2026, un bouton de rétractation en ligne** (« renoncer au contrat ici »). Il faut aussi un médiateur de la consommation désigné. Le lien vers la plateforme européenne RLL n'est plus exigé : la plateforme a fermé en 2025.
4. **Sécurité produit (GPSR)** : chaque fiche produit affiche le fabricant (nom, adresse postale et électronique), la personne responsable dans l'UE si le fabricant est hors UE, une photo, la référence et les avertissements en français. Si nous importons nous-mêmes d'un pays hors UE, notre nom doit figurer sur le produit ou son emballage.
5. **Recyclage (point nouveau et important)** : en droit français, **les maquettes entrent dans la filière REP « jouets » quel que soit l'âge indiqué** (article R543-320 du code de l'environnement). Nous devons donc adhérer à un éco-organisme pour les jouets (Ecomaison) **et** à un éco-organisme pour les emballages (Citeo ou Léko). Chaque adhésion donne un identifiant unique (IDU), à afficher dans les CGV et sur le site. Le logo Triman et l'info-tri sont à vérifier sur les produits. Ces adhésions ont un coût annuel qui pèse sur le budget de 150 à 500 €.

## 2. Obligations

| # | Sujet | Obligation | Ce que ça implique pour nous | Source |
|---|---|---|---|---|
| O1 | Statut | Toute vente régulière de marchandises exige une immatriculation. Le guichet des formalités des entreprises est le seul canal, et la démarche est gratuite | Créer une entreprise individuelle au régime micro avant la **première vente** (et avant le test de juin 2027). L'adresse de domicile à Toulouse est possible. On peut demander à l'Insee de ne pas publier l'adresse personnelle | [S1] |
| O2 | Plafond micro | 203 100 € HT de chiffre d'affaires en 2026 pour la vente de marchandises. On ne sort du régime qu'après **deux années consécutives** de dépassement | Aucun risque à notre échelle | [S2] [S4] |
| O3 | Cotisations sociales | 12,3 % du CA (vente de marchandises) ; 13,3 % avec versement libératoire. Rien n'est dû si le CA est nul | À intégrer dans `prix-et-marges.md`. La marge de 10 € par commande doit être calculée **après** ces 12,3 % (ou 13,3 %) **[PRO]** | [S3] |
| O4 | Impôt sur le revenu | Soit barème progressif après abattement de 71 %, soit versement libératoire de 1 % du CA (sous condition de revenu du foyer N-2, ex. 29 579 € pour une personne seule). L'option se prend dans les 3 mois suivant la fin du mois de création | Choix à faire selon la situation fiscale de l'humain (rattachement au foyer des parents ou non) **[PRO]** | [S4] |
| O5 | Obligations comptables | Livre des recettes, registre des achats (vente de marchandises), factures avec mentions obligatoires, déclaration du CA à l'Urssaf (mensuelle ou trimestrielle), formulaire 2042-C PRO chaque année. Compte bancaire dédié au-delà d'un certain CA | Tenir un tableur dès la première vente. Le seuil du compte dédié est `À VÉRIFIER` sur [S4] | [S3] [S4] |
| O6 | CFE | Rien à payer l'année de création, à condition de déposer le formulaire 1447-C-SD avant le 31 décembre de cette année. Base réduite de moitié l'année suivante. Exonération de la cotisation minimum si le CA de référence est ≤ 5 000 € | Une démarche à ne pas oublier | [S5] [S6] |
| O7 | TVA (franchise) | Franchise en base 2026 : 85 000 € (base), 93 500 € (majoré, TVA due dès le dépassement). Seuils inchangés pour 2026 | Prix affichés TTC = prix sans TVA à reverser. Mention « TVA non applicable, art. 293 B du CGI » sur les factures et dans les CGV **[PRO : formule exacte]**. On ne récupère pas la TVA payée sur les achats | [S7] |
| O8 | TVA ventes UE (plus tard) | Au-delà de 10 000 € HT par an de ventes à distance vers d'autres pays de l'UE, la TVA du pays du client s'applique (déclaration via le guichet unique OSS) | Rien à faire tant qu'on vend en France. À revoir avant l'ouverture à l'UE **[PRO]** | [S8] |
| O9 | Mentions légales | Pour une entreprise individuelle : nom, prénom, adresse, SIREN, email et téléphone, hébergeur (nom, adresse, téléphone). Sanction : 1 an de prison et 75 000 € d'amende | Page « Mentions légales » à rédiger dès l'immatriculation | [S9] [S10] |
| O10 | CGV et informations avant la commande | CGV obligatoires sur le site : caractéristiques essentielles, prix total TTC, frais, date ou délai de livraison, garanties légales (conformité, vices cachés), droit de rétractation et formulaire type, médiation, tribunal compétent. Sanction : 3 000 € (entreprise individuelle) | CGV + fiche produit complète. **Ajout propre à nous : les IDU des filières REP (O18)** | [S9] |
| O11 | Parcours de commande | Récapitulatif modifiable, bouton « Commande avec obligation de paiement » (ou formule sans ambiguïté), accusé de réception électronique, archivage si la commande atteint 120 €, aucun frais lié au moyen de paiement | À vérifier sur la plateforme choisie en phase 3 | [S9] |
| O12 | Livraison | Indiquer une date ou un délai précis. Sans indication : 30 jours maximum. En cas de retard, le client peut annuler et doit être remboursé sous 14 jours, sans avoir imposé | Annoncer le délai réel du fournisseur, dans la limite de 14 jours fixée par `contraintes.md` | [S9] |
| O13 | Rétractation | 14 jours sans motif. Formulaire type. Remboursement sous 14 jours. **Depuis le 19 juin 2026 : fonctionnalité de rétractation en ligne**, libellée « renoncer au contrat ici » (ou formule analogue), visible pendant tout le délai, puis bouton « confirmer la rétractation » et accusé de réception sur support durable (date et heure) | La plateforme boutique doit proposer ce bouton, ou il faut le construire. **Critère de choix de plateforme en phase 3** | [S9] [S11] [S12] |
| O14 | Médiateur | Désigner **un seul** médiateur inscrit sur la liste de la CECMC, compétent pour notre secteur, et afficher ses coordonnées et son site | Choisir un médiateur (coût `À VÉRIFIER`). Coordonnées dans les CGV et les mentions légales | [S13] [S14] |
| O15 | Plateforme RLL | L'ancienne plateforme européenne de règlement en ligne des litiges a fermé (règlement abrogé au 20 juillet 2025) | **Ne pas** recopier l'ancien lien RLL présent dans beaucoup de modèles de CGV | [S15] |
| O16 | Données personnelles et cookies | Informer sur les traitements (responsable, finalités, base légale, durée, droits, réclamation CNIL). Consentement explicite pour les emails commerciaux et les cookies non essentiels, sans case pré-cochée. Refuser doit être aussi simple qu'accepter | Politique de confidentialité + bandeau cookies avec « Tout refuser » au même niveau que « Tout accepter ». Collecter le minimum de données | [S9] [S16] |
| O17 | Sécurité produit (GPSR) | Règlement (UE) 2023/988, applicable depuis le 13 décembre 2024. Vente en ligne : afficher de façon claire et visible le fabricant (nom ou marque, adresse postale et électronique), la personne responsable dans l'UE si le fabricant n'y est pas établi, les éléments d'identification du produit (photo, type, référence) et les avertissements en français. Un importateur indique son nom et ses coordonnées sur le produit (ou à défaut l'emballage). Les opérateurs doivent assurer la traçabilité (fournisseurs, clients professionnels) et agir sans délai si un produit est dangereux | Chaque fiche produit doit porter un bloc « Sécurité du produit ». **Un produit sans fabricant identifiable ni responsable UE ne peut pas être vendu** | [S17] [S18] |
| O18 | Jouets (sécurité) | La réglementation jouets vise les produits destinés au jeu des enfants de **moins de 14 ans** (décret 2010-166, directive 2009/48/CE ; le nouveau règlement (UE) 2025/2509 s'appliquera en août 2030) | Confirme la règle de `niche.md` : seulement des produits marqués « 14 ans et plus », sans visuel ni texte qui vise les enfants. **[PRO]** : une maquette marquée 14+ mais présentée comme un jeu d'enfant pourrait être requalifiée en jouet | [S19] [S20] |
| O19 | Recyclage : REP jouets | La filière REP « jouets » couvre « les maquettes, les puzzles, les jeux de société » **en plus** des jouets au sens du décret 2010-166. Le producteur est celui qui fabrique en France, importe, assemble ou **introduit pour la première fois sur le marché national** | Si nous sommes les premiers à mettre la maquette sur le marché français (achat à un fournisseur hors de France, dans ou hors UE), nous devons adhérer à Ecomaison et payer l'éco-participation. **[PRO]** : qui est producteur en dropshipping, et si le fournisseur a déjà adhéré pour le même produit | [S21] [S22] [S23] |
| O20 | Recyclage : REP emballages | Les emballages des produits vendus aux ménages relèvent de la filière emballages ménagers. Obligation dès le premier emballage, quel que soit le volume | Option B (stock chez l'humain, expédition depuis Toulouse) : nous mettons sur le marché nos cartons d'expédition, donc adhésion Citeo ou Léko. Forfait Citeo 2026 sous 10 000 unités : **110 € HT/an** selon le guide tarifaire 2026 (`À VÉRIFIER` à l'adhésion : je n'ai pu lire qu'un extrait du PDF). Option A (dropshipping) : **[PRO]** | [S24] [S25] |
| O21 | IDU | Chaque filière REP donne un identifiant unique (IDU) délivré via l'éco-organisme. Il doit figurer dans les CGV et sur le site. Amende administrative jusqu'à 30 000 € en cas d'absence | Prévoir deux IDU (jouets + emballages) dans les CGV et les mentions légales | [S24] [S26] |
| O22 | Triman et info-tri | Tout produit vendu aux ménages et soumis à une REP porte le logo Triman accolé à l'info-tri, sur le produit, l'emballage ou à défaut un document fourni. Amende jusqu'à 3 000 € (personne physique) | Vérifier si les boîtes des maquettes portent déjà Triman + info-tri. Sinon, autocollant ou notice ajoutée. **[PRO]** : qui doit l'apposer quand le fabricant est étranger | [S27] [S28] |
| O23 | Électronique | Hors périmètre : `niche.md` exclut toute électronique au lancement (sinon marquage CE, REP équipements électriques et piles) | Les 3 produits « en sursis » avec LED ou musique du rapport de sourcing v2 sont **incompatibles** avec la décision actuelle | `knowledge/niche.md`, [S23] |

## 3. Démarches pas à pas

Ordre conseillé. Rien n'est engagé sans accord de l'humain.

**Étape 1. Avant de créer l'entreprise (0 €)**
1. Rendez-vous gratuit conseillé : CCI, Urssaf, ou un expert-comptable (souvent un premier rendez-vous offert, `À VÉRIFIER`). Questions à poser : liste de la section 6.
2. Choisir un nom commercial (facultatif). Le nom légal reste « Prénom Nom EI ».
3. Vérifier les conditions de l'ACRE (réduction de cotisations la première année) sur entreprendre.service-public.gouv.fr. Éligibilité `À VÉRIFIER`.

**Étape 2. Créer la micro-entreprise (0 €)** [S1]
1. Aller sur **formalites.entreprises.gouv.fr** (guichet unique, seul site officiel ; méfiance envers les sites payants qui imitent la démarche).
2. Déclarer une activité commerciale de vente à distance de marchandises (maquettes en bois). Domicile à Toulouse comme adresse ; cocher la non-diffusion de l'adresse si souhaité.
3. Pièces : pièce d'identité, justificatif de domicile, déclaration sur l'honneur de non-condamnation.
4. Options au moment de l'inscription : versement libératoire (oui/non) et ACRE.
5. Recevoir l'attestation d'inscription au RNE avec le SIREN et le code APE.
6. Créer l'espace professionnel sur impots.gouv.fr et le compte sur autoentrepreneur.urssaf.fr.
7. Avant le 31 décembre de l'année de création : formulaire 1447-C-SD pour la CFE [S5].

**Étape 3. Préparer les produits (pendant le sourcing)**
1. Pour chaque produit retenu, obtenir du fournisseur : nom et coordonnées du fabricant, personne responsable dans l'UE, référence, photo, avertissements en français, âge « 14 ans et plus », présence ou non de Triman/info-tri, adhésion REP jouets du fournisseur en France.
2. Écarter tout produit sans ces informations (bloquant GPSR).

**Étape 4. Recyclage (avant la première vente)**
1. Faire le test « Avez-vous besoin d'un IDU ? » sur ecomaison.com (filière jouets) [S23].
2. Adhérer à Citeo ou Léko pour les emballages (option B certaine, option A à confirmer) [S25].
3. Noter les deux IDU dans `knowledge/politiques.md`, les CGV et les mentions légales.

**Étape 5. Médiateur**
1. Choisir un médiateur dans la liste par secteurs de la CECMC [S14] (secteur commerce en ligne / commerce de détail). Comparer les tarifs.
2. Signer la convention et récupérer les coordonnées et le site.

**Étape 6. Pages légales et boutique (phase 3)**
1. architecte-web rédige : mentions légales, CGV, politique de confidentialité, politique cookies, page livraison et retours, formulaire de rétractation, bouton « renoncer au contrat ici ».
2. Vérifier sur la plateforme : bouton « Commande avec obligation de paiement », bandeau cookies conforme, fonction de rétractation en ligne.
3. Passage en mode audit de conformite-qa avant toute mise en ligne.

**Étape 7. Après le lancement**
1. Déclarer le CA à l'Urssaf (mensuel ou trimestriel), même à 0 €.
2. Tenir le livre des recettes et le registre des achats.
3. Déclarer chaque année les quantités aux éco-organismes.
4. Surveiller le seuil de 10 000 € de ventes vers l'UE avant l'ouverture européenne.

## 4. Coûts et délais

| Poste | Coût | Délai | Source |
|---|---|---|---|
| Immatriculation micro-entreprise | 0 € | `À VÉRIFIER` (en général quelques jours à quelques semaines) | [S1] |
| Cotisations sociales | 12,3 % du CA (13,3 % avec versement libératoire) ; 0 € si CA nul | Mensuel ou trimestriel, première déclaration au moins 90 jours après le début | [S3] |
| Impôt (option versement libératoire) | 1 % du CA | Avec les cotisations | [S4] |
| CFE | 0 € l'année de création ; ensuite `À VÉRIFIER` (base réduite de moitié la 2e année, pas de cotisation minimum si CA ≤ 5 000 €) | Formulaire avant le 31/12 de l'année de création | [S5] [S6] |
| Adhésion emballages (Citeo, forfait < 10 000 unités) | **110 € HT/an** (2026, `À VÉRIFIER` à l'adhésion) | Avant la première vente | [S25] |
| Adhésion REP jouets (Ecomaison) | `À VÉRIFIER` (barème 2026 par produit ; aucun forfait petit producteur trouvé sur la page lue) | Avant la première vente | [S23] |
| Médiateur de la consommation | `À VÉRIFIER` (variable selon le médiateur) | Avant la mise en ligne | [S14] |
| Hébergement / plateforme | 0 € (plateforme gratuite selon `contraintes.md`) | Phase 3 | `knowledge/contraintes.md` |
| Assurance responsabilité civile professionnelle | Non obligatoire pour cette activité à ma connaissance, mais conseillée par [S1] (« assurance adaptée ») ; coût `À VÉRIFIER` **[PRO]** | — | [S1] |

**Alerte budget** : les frais fixes de conformité (emballages au moins 110 € HT, plus Ecomaison et médiateur `À VÉRIFIER`) peuvent consommer une grosse partie du budget de lancement de 150 à 500 €. Ils doivent être intégrés avant de commander le stock léger. Ces frais annuels ne sont pas dans les calculs de marge du sourcing v2.

## 5. Propositions de fichiers pour `knowledge/`

Texte prêt à valider par l'humain. Je ne crée pas le fichier : c'est à l'humain de le copier dans `knowledge/politiques.md` après validation.

```markdown
# Politiques de la boutique

**Statut : proposition conformite-qa du 2026-11-12, à valider par l'humain.**
Les valeurs `À VÉRIFIER` doivent être remplies avant toute mise en ligne.

## Identité du vendeur
- Entreprise individuelle : `À VÉRIFIER` (Prénom Nom EI), SIREN `À VÉRIFIER`.
- Adresse : `À VÉRIFIER` (domicile Toulouse ou domiciliation).
- Contact : email `À VÉRIFIER`, téléphone `À VÉRIFIER`.
- TVA : franchise en base. Mention « TVA non applicable, art. 293 B du CGI » (formule à confirmer par un professionnel).
- Hébergeur du site : `À VÉRIFIER` (phase 3).
- IDU REP jouets (Ecomaison) : `À VÉRIFIER`.
- IDU REP emballages (Citeo ou Léko) : `À VÉRIFIER`.
- Médiateur de la consommation : `À VÉRIFIER` (nom, adresse, site).

## Produits
- Produits pour adultes, mention « 14 ans et plus » sur chaque fiche. Aucun visuel ni texte qui vise les enfants.
- Aucune électronique au lancement.
- Chaque fiche affiche un bloc « Sécurité du produit » : fabricant (nom, adresse postale, email), personne responsable dans l'UE si le fabricant est hors UE, référence, photo, avertissements en français.
- Produit sans ces informations = produit non vendable.

## Prix
- Prix affichés TTC. Frais de livraison annoncés sur la fiche et avant la validation de la commande.
- Aucun frais supplémentaire selon le moyen de paiement.
- Prix barré : uniquement le prix le plus bas pratiqué dans les 30 jours précédant la réduction.

## Livraison
- Zone : France métropolitaine (UE plus tard).
- Délai annoncé : délai réel du fournisseur ou de l'envoi depuis Toulouse, **14 jours maximum** de la commande à la réception (`contraintes.md`). Délai précis par produit : `À VÉRIFIER`.
- Frais de livraison : `À VÉRIFIER`.
- En cas de retard au-delà du délai annoncé, le client peut annuler ; remboursement sous 14 jours, jamais d'avoir imposé.

## Droit de rétractation
- 14 jours à compter de la réception, sans motif.
- Le client peut se rétracter par le formulaire type, par email, ou par le bouton « renoncer au contrat ici » sur le site, visible pendant tout le délai.
- Accusé de réception envoyé par email (date et heure).
- Frais de retour : `À VÉRIFIER` (à notre charge ou à celle du client ; si à la charge du client, le dire avant la commande).
- Remboursement de toutes les sommes versées, frais de livraison initiaux inclus (livraison standard), dans les 14 jours suivant la rétractation. Remboursement différable jusqu'à la récupération du produit ou la preuve d'expédition.
- Le client peut être tenu responsable d'une dépréciation due à des manipulations autres que celles nécessaires pour constater la nature du produit (ex. kit assemblé). Formulation exacte à faire valider.

## Garanties
- Garantie légale de conformité : 2 ans à compter de la livraison (réparation ou remplacement, à défaut réduction du prix ou remboursement).
- Garantie des vices cachés (articles 1641 et suivants du Code civil).
- Pièces manquantes ou cassées à la réception : signalement par email avec photo ; envoi de la pièce ou remplacement. Délai de réponse : `À VÉRIFIER`.

## Service client et litiges
- Réponse sous `À VÉRIFIER` jours ouvrés.
- En cas de litige non résolu : médiateur de la consommation désigné ci-dessus.
- Pas de lien vers l'ancienne plateforme européenne RLL (fermée en 2025).

## Données personnelles
- Données minimales : nom, adresse de livraison, email, téléphone si nécessaire au transporteur.
- Emails commerciaux uniquement avec consentement (case non pré-cochée), lien de désinscription dans chaque email.
- Cookies non essentiels seulement après consentement ; « Tout refuser » aussi visible que « Tout accepter ».
- Durées de conservation : `À VÉRIFIER` (à fixer avec la politique de confidentialité).
```

## 6. Ce qui doit être revu par un professionnel

**Expert-comptable (ou rendez-vous gratuit CCI / Urssaf)**
1. Versement libératoire ou non, selon le foyer fiscal de l'humain (étudiant rattaché ou non) et l'éligibilité ACRE.
2. Prise en compte des 12,3 % de cotisations et des frais REP dans la marge minimale de 10 € (impact sur tous les calculs du sourcing v2).
3. Formule exacte de la mention de franchise de TVA, et seuil du compte bancaire dédié.
4. Avant l'ouverture à l'UE : TVA des ventes à distance (seuil de 10 000 €, OSS).

**Juriste ou éco-organismes (questions écrites à Ecomaison et Citeo)**
5. **Qui est « producteur » REP jouets et REP emballages dans chaque option** : (A) dropshipping depuis un entrepôt UE ou depuis la Chine ; (B) stock acheté à Robotime Europe (Bulgarie, selon le sourcing v2) et expédié de Toulouse. Le fournisseur a-t-il déjà adhéré en France pour ces produits ?
6. Montant réel de l'éco-participation Ecomaison pour quelques dizaines de maquettes par an.
7. Triman et info-tri : qui les appose si la boîte du fabricant ne les porte pas.
8. Rôle GPSR exact dans chaque option : distributeur (achat à une entité UE) ou importateur (achat direct hors UE, avec obligation de mettre notre nom sur le produit).
9. Risque de requalification en jouet d'une maquette marquée 14+ (présentation, visuels, design).
10. Rédaction finale des CGV, en particulier la dépréciation d'un kit déjà commencé en cas de rétractation, et le bouton de rétractation en ligne.

**Décisions qui reviennent à l'humain**
- Option A ou B (impact direct sur REP emballages, rôle GPSR et coûts fixes).
- Date de création de l'entreprise (au plus tard avant la première vente, idéalement avant le test de juin 2027).
- Budget des frais fixes de conformité (adhésions, médiateur) dans les 150 à 500 €.
- Copie de la proposition `knowledge/politiques.md` après validation.

**Limite de ce dossier** : je n'ai pas pu lire directement le texte du règlement GPSR sur EUR-Lex (pages vides à la lecture automatique). Le contenu des articles 9, 11, 16 et 19 cité en O17 vient des extraits EUR-Lex renvoyés par la recherche. Les numéros d'articles sont à confirmer sur [S17] avant de les reprendre dans un texte public. Même chose pour le forfait Citeo 2026 (PDF non lisible en entier).

## 7. Sources

Toutes consultées le 2026-11-12.

| # | Source | Ce qu'elle établit |
|---|---|---|
| S1 | entreprendre.service-public.gouv.fr, « Comment devenir micro-entrepreneur », F23961 (vérifié le 15/09/2025) : https://entreprendre.service-public.gouv.fr/vosdroits/F23961 | Étapes, guichet des formalités gratuit, pièces, attestation RNE, non-diffusion de l'adresse |
| S2 | entreprendre.service-public.gouv.fr, F32353 (vérifié le 21/02/2026) : https://entreprendre.service-public.gouv.fr/vosdroits/F32353 | Plafond 2026 de 203 100 €, sortie après 2 années de dépassement |
| S3 | entreprendre.service-public.gouv.fr, cotisations du micro-entrepreneur, F36232 (vérifié le 01/01/2026) : https://entreprendre.service-public.gouv.fr/vosdroits/F36232 | 12,3 % / 13,3 %, déclaration Urssaf, ACRE |
| S4 | entreprendre.service-public.gouv.fr, régime fiscal du micro-entrepreneur, F23267 (vérifié le 13/05/2026) : https://entreprendre.service-public.gouv.fr/vosdroits/F23267 | Abattement 71 %, versement libératoire 1 %, condition de revenu, registres, compte dédié |
| S5 | impots.gouv.fr, « Je suis micro-entrepreneur, dois-je payer une CFE ? » : https://www.impots.gouv.fr/professionnel/questions/je-suis-micro-entrepreneur-dois-je-payer-une-cotisation-fonciere-des | CFE nulle l'année de création, formulaire 1447-C-SD |
| S6 | entreprendre.service-public.gouv.fr, F23999 : https://entreprendre.service-public.gouv.fr/vosdroits/F23999 | CFE du micro-entrepreneur, exonération de cotisation minimum ≤ 5 000 € |
| S7 | entreprendre.service-public.gouv.fr, franchise en base de TVA, F21746 (vérifié le 01/01/2026) : https://entreprendre.service-public.gouv.fr/vosdroits/F21746 | Seuils 85 000 / 93 500 € inchangés en 2026 ; seuil de 25 000 € abandonné |
| S8 | impots.gouv.fr, guichet unique de TVA : https://www.impots.gouv.fr/professionnel/je-minscris-au-service-du-guichet-unique-de-tva et BOFiP BOI-TVA-CHAMP-20-20-30 : https://bofip.impots.gouv.fr/bofip/13159-PGP.html/identifiant=BOI-TVA-CHAMP-20-20-30-20240724 | Seuil UE de 10 000 €, OSS |
| S9 | entreprendre.service-public.gouv.fr, « Faire du commerce en ligne : règles à respecter », F23455 (vérifié le 19/06/2026) : https://entreprendre.service-public.gouv.fr/vosdroits/F23455 | Mentions légales, CGV, parcours de commande, livraison 30 j, rétractation et fonction en ligne, données personnelles, sanctions |
| S10 | economie.gouv.fr, « Mentions sur votre site internet : les obligations à respecter » : https://www.economie.gouv.fr/entreprises/developper-son-entreprise/innover-et-numeriser-son-entreprise/mentions-sur-votre-site-internet-les-obligations-respecter | Mentions légales |
| S11 | legifrance.gouv.fr, article D221-5 du code de la consommation (en vigueur le 19/06/2026, créé par le décret n° 2026-3) : https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000053303365/2026-09-08 | « renoncer au contrat ici », « confirmer la rétractation », accusé de réception |
| S12 | eur-lex.europa.eu, directive (UE) 2023/2673 : https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32023L2673 | Origine européenne de la fonction de rétractation (article 11 bis de la directive 2011/83) |
| S13 | economie.gouv.fr, médiation de la consommation, « Vos principales obligations » : https://www.economie.gouv.fr/mediation-conso/vous-etes-un-professionnel/vos-principales-obligations-0 et fiche pratique CECMC (mise à jour 06/01/2026) : https://www.economie.gouv.fr/files/files/directions_services/mediation-conso/Fiche%20pratique%20professionnels.pdf | Obligation de désigner un médiateur inscrit (art. L612-1 code de la consommation), information du consommateur |
| S14 | economie.gouv.fr, liste des médiateurs par secteur : https://www.economie.gouv.fr/files/files/directions_services/mediation-conso/Liste_par_secteurs_d_activit%C3%A9__M%C3%A9diateurs_conso.pdf | Choix du médiateur |
| S15 | eur-lex.europa.eu, règlement (UE) 2024/3228 : https://eur-lex.europa.eu/eli/reg/2024/3228/oj | Abrogation du règlement RLL 524/2013 au 20/07/2025 |
| S16 | cnil.fr, « Cookies et traceurs : que dit la loi ? » : https://www.cnil.fr/fr/cookies-et-autres-traceurs/que-dit-la-loi et « Refuser les cookies doit être aussi simple qu'accepter » : https://www.cnil.fr/fr/refuser-cookies-doit-etre-aussi-simple-accepter-cnil-poursuit-action-adresse-mises-en-demeure | Consentement, symétrie accepter/refuser |
| S17 | eur-lex.europa.eu, règlement (UE) 2023/988 (GPSR) : https://eur-lex.europa.eu/eli/reg/2023/988/oj?locale=fr et version consolidée : https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX%3A02023R0988-20260529 | Informations de vente en ligne (art. 19), importateur (art. 11), personne responsable (art. 16) |
| S18 | economie.gouv.fr, « Consommation : ce qui a changé en 2025 » : https://www.economie.gouv.fr/dgccrf/actualites-dgccrf/consommation-ce-qui-change-en-2025 | Entrée en application du GPSR le 13/12/2024, traçabilité, rappels |
| S19 | legifrance.gouv.fr, décret n° 2010-166 relatif à la sécurité des jouets : https://www.legifrance.gouv.fr/loda/id/JORFTEXT000021865465 et eur-lex, directive 2009/48/CE : https://eur-lex.europa.eu/legal-content/FR/ALL/?uri=CELEX:32009L0048 | Définition du jouet (moins de 14 ans) |
| S20 | eur-lex.europa.eu, règlement (UE) 2025/2509 : https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=OJ%3AL_202502509 | Nouveau règlement jouets, application au 1er août 2030 |
| S21 | legifrance.gouv.fr, article R543-320 du code de l'environnement : https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000044095934 | REP jouets : « les maquettes, les puzzles, les jeux de société » ; définition du producteur |
| S22 | ecologie.gouv.fr, filière jouets : https://www.ecologie.gouv.fr/jouets | Cadre de la filière (L541-10-1 12°, R543-320) |
| S23 | Ecomaison (éco-organisme agréé), REP jouets : https://ecomaison.com/en/professionnels/nos-filieres/jouets/ et guide de l'adhérent : https://espace-services.ecomaison.com/cms/sites/default/files/2022-05/Guide%20de%20l'adh%C3%A9rent%20Jouets%202022.pdf | Maquettes couvertes même pour 14 ans et plus ; exclusion des EEE ; test IDU |
| S24 | entreprendre.service-public.gouv.fr, filières REP, F37937 (vérifié le 04/08/2025) : https://entreprendre.service-public.gouv.fr/vosdroits/F37937 et legifrance, article R541-173 du code de l'environnement : https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000042584493/2022-01-01 | Liste des filières, vendeurs à distance concernés, IDU dans les CGV et sur le site |
| S25 | Citeo (éco-organisme agréé), guide du tarif emballages ménagers 2026 : https://clients-cms.citeo.com/uploads/guide_du_tarif_des_emballages_menagers_2026_f9e4c5b4e6.pdf et « Adhérer à Citeo » : https://www.citeo.com/en/why-join-citeo/ | Forfait 110 € HT sous 10 000 unités (extrait), obligation dès le premier emballage |
| S26 | Citeo, fiche réflexe identifiant unique : https://cdn.citeo.com/mkt/CITEO_ADMIN/20211126_FICHE_REFLEXE_ID_UNIQUE_FR.pdf | Amende jusqu'à 30 000 € en cas d'absence d'IDU |
| S27 | legifrance.gouv.fr, article L541-9-3 du code de l'environnement : https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000041556010 et décret n° 2021-835 : https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000043714227 | Triman + info-tri sur les produits soumis à REP |
| S28 | ecologie.gouv.fr, FAQ Triman : https://www.ecologie.gouv.fr/sites/default/files/documents/FAQ%20Triman%20et%20frises.pdf | Mise en œuvre, amende (art. L541-9-4) |

### Auto-contrôle
- [x] Chaque obligation a une source officielle datée (O23 renvoie à `niche.md`, décision interne).
- [x] Seuils et montants vérifiés pour 2026 (TVA, plafond micro, cotisations, versement libératoire). Forfait Citeo 2026 marqué `À VÉRIFIER` (lecture partielle).
- [x] Pas de ⚠️ ni ⛔ (mode dossier) ; chaque point incertain renvoie à une question précise en section 6.
- [x] Interprétations signalées **[PRO]** ; aucun montant inventé (coûts inconnus en `À VÉRIFIER`).
