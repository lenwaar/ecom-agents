# Prix et marges (produits numériques)

> **Statut : proposition de Claude du 2026-11-14, sur mandat de l'humain.** Ancienne version (maquettes) dans `archives/prix-et-marges-maquettes.md`.

## Coût d'une vente
Il n'y a ni achat de marchandise ni livraison. Une vente coûte :

| Élément | Valeur retenue | Source |
|---|---|---|
| Cotisations micro-entreprise : **prestations de services commerciales (BIC)**, catégorie des produits numériques | 21,2 % du chiffre d'affaires (22,9 % avec versement libératoire) | service-public.gouv.fr (F36232) ; URSSAF, taux 2026 |
| Frais Stripe, cartes européennes | `À VÉRIFIER` sur stripe.com/fr/pricing (hypothèse de travail : 1,5 % + 0,25 €) | à vérifier |
| Provision remboursements et litiges | 5 % du prix | hypothèse prudente |

Exemple pour un produit à 12 € : 12 − 2,54 (21,2 %) − 0,43 (Stripe, hypothèse) − 0,60 (provision) = **environ 8,43 € net**. Calcul à refaire avec les vrais frais Stripe.

## Seuils
- L'ancien plancher « 10 € de marge par commande » ne s'applique plus tel quel : il visait des produits physiques. Nouvelle règle : **au moins 70 % du prix de vente reste après cotisations, frais et provision.**
- Plafond de chiffre d'affaires micro-entreprise pour les services : 83 600 € par an (relevé en février 2026, `À VÉRIFIER` sur le site de l'URSSAF au moment de l'immatriculation).

## Prix proposés (à tester)
| Produit | Prix | Repère |
|---|---|---|
| Budget mensuel | 12 € | modèles seuls vendus entre 9 et 49 $ (Enter, guide 2026) |
| Budget étudiant | 9 € | public au budget serré |
| Remboursement de dettes, Objectifs d'épargne | 12 € chacun | |
| Pack complet (4 produits) | 29 € | packs entre 29 et 149 $ (même source) |

Prix revus après 30 ventes ou 1 000 visites de la page produit.

## TVA
- Franchise en base : « TVA non applicable, art. 293 B du CGI » tant que le seuil des prestations de services n'est pas dépassé (seuil 2026 : `À VÉRIFIER` sur impots.gouv.fr).
- Ventes à des particuliers d'autres pays de l'UE : en dessous de 10 000 € par an pour toute l'UE, règles françaises ; au-delà, TVA du pays du client via le guichet unique (OSS). Au lancement, vente en France seulement.

## Promotions
- Prix barré : uniquement le prix le plus bas pratiqué dans les 30 jours précédents (article L112-1-1 du code de la consommation). Jamais de fausse promotion permanente ni de compte à rebours trompeur.
