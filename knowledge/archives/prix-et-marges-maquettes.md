# Prix et marges

> **Statut : proposition de Cowork du 2026-11-12, à valider par l'humain.** Construite à partir du rapport sourcing v2 (section 7), de l'audit conformite-qa et du dossier légal du même jour. Les agents l'appliquent en attendant, en signalant les valeurs `À VÉRIFIER`.

## Coût de revient par commande
Prix d'achat + livraison (fournisseur et/ou envoi au client) + taxes d'import éventuelles + emballage + frais de paiement + provision SAV (5 % du prix de vente) + **cotisations micro-entreprise** + **éco-participation REP jouets**.

| Élément | Valeur retenue | Source |
|---|---|---|
| Cotisations micro-entreprise (vente de marchandises) | 12,3 % du prix de vente (13,3 % avec versement libératoire) | Dossier conformite-qa du 2026-11-12 |
| TVA | Non facturée (franchise en base, sous 85 000 € de ventes annuelles) : mention « TVA non applicable, art. 293 B du CGI » | Idem |
| Frais de paiement | 3 % + 0,30 € par commande | Hypothèse, `À VÉRIFIER` quand la plateforme sera choisie |
| Taxes import (hors UE) | 3 € + 2 € par catégorie d'article | douane.gouv.fr |
| Éco-participation REP jouets | `À VÉRIFIER` (barème de l'éco-organisme) | Dossier conformite-qa |

## Seuils (décisions de l'humain, `contraintes.md`)
- Marge nette ≥ 10 € par commande, **cotisations comprises** : plancher strict.
- **Objectif : 15 € ou plus par commande** (décision de l'humain du 2026-11-12 : viser plus que le plancher pour être rentable). On fixe le prix de vente pour atteindre l'objectif, tant qu'il reste cohérent avec les prix concurrents.
- Livraison ≤ 14 jours.
- Repères indicatifs : coefficient ≥ 2,5 ; prix de vente entre 25 et 60 €.

## Coûts fixes annuels (hors marge par commande)
| Poste | Estimation | Statut |
|---|---|---|
| Adhésion emballages (Citeo ou Léko) | environ 110 € HT/an | `À VÉRIFIER` à l'adhésion |
| Adhésion REP jouets | inconnue | `À VÉRIFIER` |
| Médiateur de la consommation | inconnue | `À VÉRIFIER` |
| Plateforme de la boutique | 0 € visé | Phase 3 |

**Seuil de rentabilité** : nombre de ventes par an pour couvrir les coûts fixes = total des coûts fixes ÷ marge nette moyenne par commande. Exemple : 250 € de coûts fixes ÷ 10 € = 25 ventes par an.

## Promotions et prix barrés
- Un prix barré affiche comme prix de référence **le prix le plus bas pratiqué par la boutique dans les 30 jours précédant la réduction** (article L112-1-1 du code de la consommation). La réduction se calcule sur ce prix.
- Jamais de fausse promotion permanente ni de compte à rebours trompeur.

## Révision
À revoir dès que la plateforme, le fournisseur officiel et les adhésions sont connus.
