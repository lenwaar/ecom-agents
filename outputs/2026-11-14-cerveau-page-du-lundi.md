---
agent: cerveau
statut: validé
valide_par: humain
date_validation: 2026-11-14
sources: [donnees/entreprise.db, entreprise/interruptions.md]
prochaine-etape: humain
---

# Votre page du lundi · semaine 46

Période : du 2026-11-07 au 2026-11-14.

| Chiffre d'affaires | Marge nette | Commandes | Livrées à temps | En attente de vous |
|---|---|---|---|---|
| 0,00 € | 0,00 € | 0 | 0 / 0 | 0 |

## 1. D'où vient l'argent

- Aucune vente cette semaine.

## 2. Ce qui est à risque

- Rien à signaler.

## 3. En attente de vous

- Rien.

## 4. À faire ensuite

1. **Vérifier le nom « Rouage & Laiton »** (INPI, EUIPO, domaine, comptes réseaux). C'est le seul point qui bloque la publication des vidéos « planche à objet » (contre-audit du 2026-11-13 : conforme hors A1). Fiche **M20** · porteur : **humain**, puis `conformite-qa`.
2. **Remplir la grille AliExpress** (15 maquettes ROKR, `outputs/2026-11-13-sourcing-produits-grille-aliexpress.md`) puis lancer `py tools/calcul_marge.py` pour obtenir les prix. Les frais Stripe et l'éco-participation restent `À VÉRIFIER`. Fiche **P10** · porteur : **humain**, puis `pilotage-finance`.
3. **Corriger les messages à Robotime** (R1 à R5 : une phrase fausse, plus les demandes de facture, de retours et de documents de sécurité), les faire valider, puis l'humain les envoie. Fiche **P11** · porteur : `redacteur-catalogue`, envoi par l'**humain**.

Sources : `outputs/` du 2026-11-12 au 2026-11-14 (33 livrables). Rien n'a été publié, envoyé ni payé.

## Autres chiffres

- Tickets résolus : 0
- Factures payées : 0
- Nouveaux prospects : 0
- Dépenses : 0,00 €

Décider : `python tools/base.py valider <n°> oui|non`.
