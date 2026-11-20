---
agent: cerveau
statut: à-valider
sources: [donnees/entreprise.db, entreprise/interruptions.md]
prochaine-etape: humain
---

# Votre page du lundi · semaine 47

> EXEMPLE : données fictives de `donnees/exemple.db`, pour montrer la forme. Aucun chiffre réel.

Période : du 2026-11-09 au 2026-11-16.

| Chiffre d'affaires | Marge nette | Commandes | Livrées à temps | En attente de vous |
|---|---|---|---|---|
| 84,00 € | 20,40 € | 2 | 2 / 2 | 3 |

## 1. D'où vient l'argent

- video-coffre : 45,00 € (54 %)
- pinterest : 39,00 € (46 %)

## 2. Ce qui est à risque

- **O03** Commande n°4 (EXEMPLE Planétaire) : échéance de livraison dépassée (2026-11-15)
- **P03** Accord « EXEMPLE Créatrice déco » sans nouvelles depuis le 2026-11-07
- **C10** Avis 3/5 n°1 sans réponse
- **V02** 1 prospect(s) chaud(s) sans réponse

## 3. En attente de vous

- [ ] [1] Réponse publique à un avis 3/5 (EXEMPLE) (C10, priorité haute)
- [ ] [3] Commande fournisseur n°5 à passer (EXEMPLE) (O02, priorité haute)
- [ ] [2] Vidéo « Horloge à balancier » prête à publier (EXEMPLE) (M03, priorité normale) : `medias/EXEMPLE.mp4`

## 4. À faire ensuite

- À compléter par le sous-agent `cerveau` (3 actions maximum, chacune liée à une fiche).

## 5. Marketing

### Ce qui a marché

- TikTok · EXEMPLE vidéo du tableur Budget mensuel (`EXEMPLE-post-tiktok-01`) : 10,00 € TTC, 1 commande(s) payée(s)
- Source : `data/posts.exemple.json` relié à `data/commandes.exemple.json` (commandes d'exemple seulement, aucun chiffre réel).

### Ce qui part ensuite

- En attente de votre décision : post TikTok « EXEMPLE script court » (M06)
- En attente de votre décision : e-mail « EXEMPLE lettre d'information » (M16)
- Décider : page `/marketing` du QG (`cd qg/studio && npm start`). Rien n'est publié ni envoyé automatiquement.

## Autres chiffres

- Tickets résolus : 1
- Factures payées : 0
- Nouveaux prospects : 0
- Dépenses : 0,00 €

Décider : `python tools/base.py valider <n°> oui|non`.
