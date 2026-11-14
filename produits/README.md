# Produits numériques de la boutique

Chaque produit est construit par un script (`sources/`) : on corrige le script et on reconstruit, jamais le fichier à la main.
Fabriqués et testés par l'agent `createur-produits-numeriques` (fiches O02, O07, O11, O13).

| N° | Produit | Script | Fichier | Version | Prix | État |
|---|---|---|---|---|---|---|
| 1 | Budget mensuel (Excel et Google Sheets) | `sources/budget_mensuel.py` | `fichiers/budget-mensuel.xlsx` | 1.0 (2026-11-14) | voir `knowledge/prix-et-marges.md` | construit, recalculé sans erreur, à valider |

## Gamme prévue (ordre de sortie)
1. Budget mensuel : produit d'appel, le plus large.
2. Budget étudiant : bourse, job, CROUS, aide des parents.
3. Plan de remboursement de dettes (méthode boule de neige ou avalanche, sans conseil personnalisé).
4. Objectifs d'épargne (vacances, permis, apport) avec suivi visuel.
5. Pack complet (1 à 4) à prix réduit.

## Reconstruire un produit
```
py produits/sources/budget_mensuel.py produits/fichiers/budget-mensuel.xlsx
```
Puis contrôle : recalcul sans erreur (skill xlsx, `recalc.py`) et 3 totaux vérifiés à la main.

## Journal des versions
- Budget mensuel 1.0 (2026-11-14) : première version. Contrôle : 1 814 formules, 0 erreur ; totaux du mois d'exemple vérifiés à la main (dépenses 945,25 €, courses 181,85 €, reste à vivre 554,75 €).
