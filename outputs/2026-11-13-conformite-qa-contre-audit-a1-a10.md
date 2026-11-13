---
agent: conformite-qa
statut: à-valider
date: 2026-11-13
mode: audit
verdict: CONFORME
sources: [outputs/2026-11-13-conformite-qa-audit-site.md, outputs/2026-11-13-developpeur-web-corrections-a1-a10.md, knowledge/decisions.md, knowledge/catalogue-demo.md, docs/retours-experience.md, site/src/, site/dist/, legifrance.gouv.fr (annexe R221-1, D221-5, L217-9 : références de l'audit du site, consultées le 2026-11-13)]
prochaine-etape: validation humaine ; avant tout aperçu en ligne, l'humain met en place la protection d'accès (A10) ; les points 2.2 de l'audit du site restent à traiter avant l'ouverture
---

# Contre-audit des points A1 à A10 de l'audit du site (T46, synchro n°11)

Périmètre : uniquement les points A1 à A10 (§2.1 de `outputs/2026-11-13-conformite-qa-audit-site.md`), vérifiés dans `site/src/` et dans le HTML construit `site/dist/`. Je n'ai pas relancé la construction : `dist/` est pris tel quel, annoncé à jour par le développeur. Je n'ai modifié aucun fichier du site ni de `knowledge/`.

## 1. Verdict global

**CONFORME** pour A1 à A10 : 10 points CORRIGÉS, 0 À REPRENDRE. Il reste une condition hors code (A10) : protéger l'accès avant toute mise en ligne. Je relève aussi 2 remarques secondaires, qui ne bloquent pas l'aperçu (§3).

## 2. Tableau des points

| # | Constat (src et dist) | Verdict |
|---|---|---|
| A1 | `boutique.yaml` l. 56 `en_ligne_active: false`, booléen dans `content.config.ts` l. 210. `renoncer-au-contrat.astro` l. 35-38 : texte proposé repris mot pour mot. `contact.astro` l. 101 : « Pour vous rétracter, utilisez la page Renoncer au contrat ici. » `livraison-et-retours.astro` l. 55 et `QuestionFaq.astro` l. 56 : la mention de l'accusé de réception est retirée quand la valeur est `false`. Dans `dist/`, aucun « immédiatement » ni « accusé » sur contact, livraison et FAQ. Sur renoncer-au-contrat, il n'en reste que dans l'encadré « pas encore actif » et dans le libellé du champ du formulaire désactivé, ce qui est exact | CORRIGÉ |
| A2 | `FormulaireTypeRetractation.astro` l. 16 : « Modèle de formulaire de rétractation ». l. 23 : « Je/nous (*) vous notifie/notifions (*)… », identique à l'annexe R221-1. l. 34 : marqueur réduit à `version PDF imprimable à fournir`. Mêmes textes dans `dist/cgv/` et `dist/renoncer-au-contrat/` | CORRIGÉ |
| A3 | `catalogue.ts` l. 130 : « (prix indicatifs de démonstration) » ajouté si tous les produits sont des démonstrations. La mention est présente dans `dist/index.html` (4 cartes) et dans les 5 pages de collection. `BarreAchatMobile.astro` l. 32 : « Prix indicatif de démonstration » | CORRIGÉ |
| A4 | `collections/[slug].astro` l. 49, 126, 131 et 140 : la condition `toutDemo` est appliquée comme proposé. Dans `dist/collections/*`, le seul `[À VALIDER]` restant est « Prénom Nom EI » dans le pied de page : c'est une donnée de boutique, ce qui est correct | CORRIGÉ |
| A5 | `Galerie.astro` l. 139 et `Zoom.astro` l. 47 : « Rendus 3D de démonstration. » La mention est présente sous la galerie et dans le zoom de `dist/maquettes/automate-manivelle/` | CORRIGÉ |
| A6 | `a-propos.astro` l. 37 : « Vos droits, prévus par la loi pour les achats à distance ». La phrase est présente dans `dist/a-propos/` | CORRIGÉ |
| A7 | `a-propos.astro` l. 17 : accroche calculée. `dist/` affiche « un objet en bois », car la locomotive a `partie_mobile: "À VÉRIFIER"`. Le texte affiché est exact. Passer à « un objet qui bouge » est un choix de l'humain : il faut d'abord renseigner ce champ | CORRIGÉ |
| A8 | Décision de l'humain : `BlocSecurite.astro` l. 38 affiche « Produit de démonstration, non vendu : il n'a pas de fabricant. », texte identique à `decisions.md` l. 20. Ce texte ne promet aucune mise en vente et concorde avec les CGV art. 3 (`cgv.astro` l. 68 : « ils ne sont pas en vente »). `MaquettesDuMoment` l. 32 et `DansLaBoite` l. 85 reprennent les textes proposés. Dans `dist/`, plus aucune trace de « dès la mise en vente », « remplaceront » ou « jamais vendus » | CORRIGÉ |
| A9 | `Offrir.astro` l. 65 : « Rendu 3D de démonstration. Paquet, lampe et objets de décor non fournis. » La phrase est présente dans `dist/index.html` | CORRIGÉ |
| A10 | `site/public/_headers` est copié dans `dist/_headers` : `/*` puis `X-Robots-Tag: noindex, nofollow`. La balise `noindex` reste dans `Base.astro`. La protection d'accès (Cloudflare Access ou mot de passe) n'est pas encore en place : c'est à l'humain de la faire avant toute mise en ligne. Le site reste local pour l'instant | CORRIGÉ (partie code) ; protection d'accès à faire par l'humain avant toute mise en ligne |

**Nouvelle fiche `automate-manivelle`** (`dist/maquettes/automate-manivelle/`) : elle est conforme sur les points demandés. Elle affiche le bandeau « rendus 3D, pas des photos d'un produit réel », « Rendus 3D de démonstration. » sous la galerie et dans le zoom, et « Prix indicatif de démonstration » (49,90 €, comme dans `catalogue-demo.md` l. 22). Le bloc Sécurité affiche le texte décidé par l'humain. Aucun « À VÉRIFIER » n'est visible : 0 occurrence dans tout `dist/*.html`. Les mentions `mecanisme: manivelle` et `partie_mobile: true` sont cohérentes avec la collection Automates. Plus aucune trace de book nook ni de `/collections/miniatures/` dans `dist/`.

## 3. Remarques (hors périmètre A1 à A10, ne bloquent pas l'aperçu)

1. **CGV art. 10** (`cgv.astro` l. 122) : « Nous vous envoyons un accusé de réception par email » s'affiche sans condition, alors que `en_ligne_active` vaut `false`. Ce point est déjà couvert par le bloquant d'ouverture B3 de l'audit du site (fonction de rétractation active, art. D221-5). Correction possible dès maintenant : conditionner cette phrase sur `b.retractation.en_ligne_active`, comme pour A1.
2. **FAQ des fiches** (8 fiches, dont l'automate, et ce n'était pas une nouveauté) : « Nous vous faisons parvenir la pièce ou un kit de remplacement : c'est la garantie légale de conformité. » Cette phrase peut laisser croire que le vendeur choisit seul la solution. Or, dans le cadre de la garantie légale de conformité, c'est le consommateur qui choisit d'abord entre réparation et remplacement (art. L217-9). Correction proposée : « Envoyez-nous une photo par email. Au titre de la garantie légale de conformité, vous pouvez demander la réparation (envoi de la pièce) ou le remplacement de la maquette. » Formulation à faire valider par un juriste avec les clauses [PRO] avant l'ouverture.

## 4. Sources

- Audit de référence : `outputs/2026-11-13-conformite-qa-audit-site.md` §2.1, avec ses sources Légifrance [L1] (art. D221-5) et [L2] (annexe à l'art. R221-1), consultées le 2026-11-13.
- Code de la consommation, art. L217-9 (choix entre réparation et remplacement), Légifrance : https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069565/LEGISCTA000044142422/ (section L217-1 et suivants), consulté le 2026-11-13.
- `knowledge/decisions.md` l. 20 et 25-27 ; `knowledge/catalogue-demo.md` l. 22-28 ; `docs/retours-experience.md` n° 10 et 11.
