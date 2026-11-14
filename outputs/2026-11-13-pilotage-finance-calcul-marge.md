---
agent: pilotage-finance
statut: validé
valide_par: humain
date_validation: 2026-11-14
date: 2026-11-13
mode: outil
sources: [knowledge/memo.md, knowledge/decisions.md (Modèle d'approvisionnement), knowledge/prix-et-marges.md, knowledge/contraintes.md, knowledge/politiques.md, docs/site-technique.md (tarif Stripe consulté le 2026-11-12), docs/retours-experience.md (leçons 4 et 5)]
prochaine-etape: l'humain remplit la grille AliExpress, lance le script, puis valide les prix proposés
---

# Outil de calcul de marge pour la grille AliExpress (T71, synchro n°16)

**Verdict** : l'outil `tools/calcul_marge.py` est prêt et testé (4 tests sur 4 réussis, `tests/test_calcul_marge.py`). Deux constantes restent `À VÉRIFIER` (les frais Stripe et l'éco-participation) : l'outil les signale dans chaque sortie.

## Comment lancer
```
py tools/calcul_marge.py outputs/2026-11-13-sourcing-produits-grille-aliexpress.md
py tools/calcul_marge.py <grille.md> --sortie resultat.md      # écrit aussi le tableau dans un fichier
  options : --frais-prudents (paiement 3 % + 0,30 €), --versement-liberatoire (cotisations 13,3 %)
```
L'outil trouve le tableau grâce à ses 12 en-têtes exacts et ignore les lignes sans prix AliExpress. Il accepte la virgule ou le point, « 7-12 » pour un délai (il retient alors 12, le pire cas) et « 4,8/5 » pour une note. Il rend ensuite un tableau avec ces colonnes : Modèle, coût, prix conseillé, marge à ce prix, prix plancher, prix officiel, verdict RETENU/ÉCARTÉ et la raison.

## Formule (pour une commande d'un article, en dropshipping)
- **Coût fournisseur** = prix AliExpress + livraison vers la France (le fournisseur livre directement le client).
- **Marge nette** = P − coût − (1,5 % × P + 0,25 €) − 12,3 % × P − 5 % × P − éco-participation.
- **Prix conseillé** = le plus petit prix en ,90 qui donne une marge nette d'au moins 15 €. **Prix plancher** = le même calcul pour 10 €. L'outil signale aussi quand le prix conseillé dépasse le prix officiel Robotime.
- **ÉCARTÉ** dans chacun de ces cas : pays d'expédition hors UE, délai > 14 j, note < 4,5, stock < 100. Une valeur manquante écarte aussi la ligne, avec la mention `À VÉRIFIER`.
- Exemple fictif tiré du test : coût 35,00 € → prix conseillé 61,90 € (marge 15,01 €) et prix plancher 55,90 € (marge 10,14 €).

## Constantes et sources (en tête du script)
| Constante | Valeur | Source |
|---|---|---|
| Frais Stripe | 1,5 % + 0,25 € | `docs/site-technique.md`, tarif consulté le 2026-11-12. **À VÉRIFIER sur stripe.com/fr/pricing** |
| Frais prudents (option) | 3 % + 0,30 € | `knowledge/prix-et-marges.md`, hypothèse `À VÉRIFIER` |
| Cotisations micro-entreprise | 12,3 % (13,3 % avec le versement libératoire) | `knowledge/prix-et-marges.md`, leçon 4. À confirmer par l'URSSAF ou un expert-comptable |
| Provision retours et SAV | 5 % du prix | `knowledge/memo.md` |
| Livraison au client en plus | 0 € (livraison offerte, déjà comprise dans le port fournisseur) | `knowledge/politiques.md` : frais de livraison `À VÉRIFIER` |
| Emballage | 0 € | Dropshipping (`knowledge/decisions.md`) |
| Éco-participation REP jouets | 0 € | **`À VÉRIFIER`** (`knowledge/prix-et-marges.md`) : la marge est surestimée d'autant |
| Droits d'import | 0 € | Offres UE seulement ; une offre hors UE est écartée sans calcul des droits (leçon 5 non appliquée) |

## Limites
- Le calcul vaut pour une commande d'un seul article. Il ne compte ni le coût d'acquisition (publicité), ni les coûts fixes annuels (`knowledge/prix-et-marges.md`).
- Les cartes hors EEE ou professionnelles coûtent plus cher chez Stripe : `--frais-prudents` donne une borne haute.
- Le pays d'expédition doit être écrit en clair (par exemple « Espagne », « Spain » ou « ES »). Un pays non reconnu est écarté.
- Le seuil de franchise de TVA (85 000 €/an, `knowledge/prix-et-marges.md`) ne concerne pas cet outil : il se surveille dans le rapport hebdomadaire.

## ACTION HUMAINE
1. Vérifier le tarif Stripe sur stripe.com/fr/pricing et me donner la valeur à jour.
2. Trouver le barème de l'éco-participation REP jouets (éco-organisme), à reporter dans `ECO_PARTICIPATION`.
3. Décider si la livraison est offerte ou facturée au client (`knowledge/politiques.md`).
4. Remplir la grille, lancer l'outil, puis valider les prix proposés : aucun prix n'est appliqué sans votre accord.
