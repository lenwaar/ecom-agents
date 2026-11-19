---
agent: developpeur-web
statut: à-valider
date: 2026-11-19
sources: [CLAUDE.md, knowledge/memo.md, knowledge/politiques.md, knowledge/prix-et-marges.md, tools/calcul_marge.py, outputs/2026-11-19-architecte-web-spec-v1-boutique.md, outputs/2026-11-19-conformite-qa-audit-v1-boutique.md]
prochaine-etape: humain (vérification à l'écran, décisions M2 et M6), puis juriste avant toute mise en ligne
---

# V1 : admin de boutique (vidéo 1), V1 bis et modèle numérique

Produit et fournisseur non décidés : tout est construit avec un produit de démonstration. Aucun prix réel, aucun lien de paiement, aucun avis, aucune donnée inventée. Rien n'est publié, envoyé ni payé.

## Résultats

| Fonction | Où | État |
|---|---|---|
| V1-1 Page produit modèle | `data/produits/exemple-demo.json`, `site/src/pages/produits/[slug].astro`, `site/src/components/produit-modele/` | Faite. Type `numerique` ou `physique` ; numérique = port, âge et GPSR « sans objet » ; la build échoue sur une démo avec paiement ou un produit vendu incomplet. Bandeau démo, noindex, paiement inactif sans lien. |
| V1-2 Avis | `data/avis.json` (vide), `Avis.astro`, `/verification-des-avis/` | Fait. Seul un avis avec référence de commande réelle s'affiche ; jamais sur une démo. Texte vide et page de vérification « à faire relire par un juriste ». Règle écrite dans `CLAUDE.md`. |
| V1-3 Tableau /boutique (QG) | `qg/studio/boutique.js`, `public/boutique.*` | Fait. CA, commandes, panier moyen, remboursements, marge nette réelle ; visiteurs « Aucune source de mesure ». Exemples dans un bloc séparé, jamais additionnés. `data/commandes.json` hors Git, repli sur `data/commandes.vide.json`. |
| V1-4 Page Modules (QG) | `public/modules.*`, `data/modules.json` | Faite. Avis actif ; paiement, contact, lettre d'information, SAV à venir. Sans date ni promesse. |
| Cotisations | `tools/calcul_marge.py`, `qg/studio/boutique.js` | 21,2 % (22,9 % avec versement libératoire), source `knowledge/prix-et-marges.md`. Concordance Python/JS testée. |
| Politique | `knowledge/politiques.md` | Rétractation : accès immédiat seulement avec case non pré-cochée et confirmation par e-mail (L221-28, 13°). |
| Site global | navigation, bandeau, pied de page | « [Nom de marque à choisir] », « Boutique en préparation : rien n'est en vente pour le moment. », Stripe retiré, liens du catalogue maquettes retirés, bande de réassurance masquée en démo. |
| Sécurité | `qg/studio/serveur.js` | `pousserSiChange()` protégé par try/catch. Aucun secret trouvé dans les fichiers de la V1. |

Tests : QG 51/51 (`npm test`), site 15/15, build 60 pages et 0 lien cassé, vérificateur 0 erreur. Captures 390 et 1280 px : `outputs/captures/2026-11-19-produit-demo-390.png` et `-1280.png`.

## Verdict conformite-qa

`outputs/2026-11-19-conformite-qa-audit-v1-boutique.md` : **À CORRIGER pour la démo locale, aucun point bloquant**. D1 (réassurance), D2 (encadré d'accès immédiat) et D3 (liens maquettes) sont corrigés. **BLOQUANT pour une mise en ligne** :
- M1 : CGV, livraison et retours, renoncer au contrat, FAQ, contact encore écrits pour des produits physiques.
- M2 : case d'accord exprès, horodatage et e-mail de confirmation inexistants dans le parcours de paiement.
- M3 (dès le premier avis) : date de l'expérience, critère de classement, référence comparée aux vraies commandes payées.
- M4 à M9 : compléments de la page avis, références de la spec à corriger (D111-9 à D111-12 ; L121-4 27° et 28°), autres sections physiques de `politiques.md`, `data/avis.json` (données personnelles) à sortir de Git avant le premier avis, mention TVA et libellé du bouton de paiement à confirmer.

## Décisions pour l'humain
1. Sans la case d'accord exprès : accès différé à 14 jours ou paiement impossible (M6, à trancher avec un juriste).
2. Calendrier de réécriture des pages physiques (M1) et du parcours de paiement (M2) : rien ne sera mis en ligne avant.
