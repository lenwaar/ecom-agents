---
agent: developpeur-web
statut: à-valider
date: 2026-11-19
sources: [outputs/2026-11-19-architecte-web-video1-boutique.md, outputs/2026-11-19-conformite-qa-video1-boutique.md, docs/site-technique.md, tools/calcul_marge.py]
prochaine-etape: validation humaine (décisions ci-dessous)
---

# Vidéo 1 : admin de boutique (V1-1 à V1-4)

## Résumé
Les 4 fonctionnalités sont en place, en démonstration seulement : rien n'est vendu, publié ni payé. Aucune donnée n'est inventée : le produit `exemple-demo` n'a ni prix, ni délai, ni fabricant (affichés « Prix non fixé », « Non communiqué »), et aucun avis n'existe. Travail mené en parallèle par architecte-web (spécification et données), deux developpeur-web (site, QG), puis conformite-qa.

**Verdict conformite-qa : À CORRIGER** (0 bloquant, 5 points à corriger, 11 conformes). Les corrections restantes portent sur des décisions de marque et de modèle, listées plus bas.

## Livré
| Code | Fonction | Où |
|---|---|---|
| V1-1 | Page produit modèle alimentée par `data/produits/*.json` : bandeau « Page de démonstration, produit non vendu », `noindex, nofollow`, bouton de paiement désactivé sans lien, bloc Sécurité du produit (GPSR), 14 ans et plus. Le build refuse une démo avec lien de paiement, un vrai produit avec « À VÉRIFIER » ou prix vide, un âge sous 14 ans. | `site/src/pages/produit/[slug].astro`, `components/produit/FicheProduitJson.astro`, `lib/produits-json.ts` |
| V1-2 | Section Avis lue depuis `data/avis.json` (vide) : « Aucun avis pour l'instant ». Un avis n'est affiché que si sa référence correspond à une commande payée de `data/commandes.json`. Règle écrite dans `CLAUDE.md`. | `components/produit/Avis.astro` |
| V1-3 | QG `/boutique` (et `/api/boutique`) : ventes, commandes, visiteurs (« Non mesuré »), marge nette réelle selon la formule de `tools/calcul_marge.py` (parité vérifiée par test). Vrais chiffres = `data/commandes.json` seul (vide) ; exemples dans une section séparée, chaque chiffre étiqueté « exemple ». | `qg/studio/boutique.js`, `serveur.js` |
| V1-4 | QG `/modules` : paiement, avis, contact, lettre d'information, SAV, tous « À venir » (aucun ne fonctionne réellement aujourd'hui), sans date ni promesse. | `data/modules.json` |

## Vérifications
- `npm run build` (site) : 59 pages, 4 303 liens, 0 cassé.
- `npm test` (QG) : 50/50, dont 13 nouveaux. Les tests n'écrivent plus dans `outputs/` : deux anciens tests réécrivaient les captures `outputs/qg/` à chaque lancement, ils utilisent désormais un dossier temporaire.
- Captures Playwright regardées, sans débordement : `outputs/captures/2026-11-19-video1/` (produit 390 et 1280 px, QG boutique et modules 1280 px).
- `py tools/verifier_livrables.py` : 0 erreur (1 avertissement ancien).

## Ce que l'humain doit décider
1. **Produit physique ou numérique ?** `knowledge/memo.md` (mis à jour le 14/11) parle de tableurs numériques ; la tâche V1 suppose un produit physique (GPSR, port, coût fournisseur, cotisations 12,3 %). En numérique : cotisations 21,2 %, GPSR et port sans objet.
2. **Marque à l'écran** : en-tête et pied de page affichent encore « Rouage & Laiton, maquettes mécaniques en bois » et « Paiement par Stripe » (conformite-qa point 1). À neutraliser avant tout tournage ?
3. **`data/commandes.json` dans Git** : à ajouter à `.gitignore` avant le premier import réel (dépôt sur GitHub).
4. **Texte vide des avis** : garder « Aucun avis pour l'instant » (votre consigne) ou « Aucun avis pour le moment. Seuls les clients ayant commandé peuvent en laisser un. » (conformite-qa). Avant le premier avis réel : page « Comment nous vérifions les avis », à faire relire.
5. Bloc d'exemple de `/boutique` : toujours visible (actuel) ou replié derrière un bouton.

## Voir en local
```
cd site && npm run build && npm run preview      -> http://localhost:4321/produit/exemple-demo/
cd qg/studio && npm start                        -> http://127.0.0.1:4178/boutique  et  /modules
```
