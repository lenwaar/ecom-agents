---
agent: cerveau
statut: à-valider
date: 2026-11-14
sources: [knowledge/niche.md, knowledge/prix-et-marges.md, knowledge/contraintes.md, produits/README.md, outputs/2026-11-14-sourcing-produits-maquettes-bois-v3.md]
prochaine-etape: analyste-marche (I09), conformite-qa (A16 nom), developpeur-web (vente de fichiers)
---

# Plan de lancement : tableurs de budget en français

## 1. Où on en est
- Niche et modèle changés le 2026-11-14 : produits 100 % numériques, tableurs de budget en français. `knowledge/` est à jour.
- **Produit n°1 construit** : « Budget mensuel » (`produits/fichiers/budget-mensuel.xlsx`) : 5 onglets, 1 814 formules, 0 erreur au recalcul, totaux vérifiés à la main. Prix proposé : 12 €.
- Nouvel agent `createur-produits-numeriques` ; les fiches de logistique physique sont en pause ou réaffectées (O02, O06, O07, O11, O13).

## 2. Ce que les agents font ensuite (sans vous)
| Ordre | Travail | Fiche, porteur |
|---|---|---|
| 1 | Mesurer la demande en France (Google Trends : « tableau budget », « budget excel », « gérer son budget ») | I09, `analyste-marche` |
| 2 | Choisir le nom : vérifier les 3 pistes (INPI, domaines, comptes) | A16, `conformite-qa` |
| 3 | Adapter le site : nouvelle identité, page produit, paiement Stripe, page de téléchargement, case « accès immédiat » obligatoire | D, `architecte-web` puis `developpeur-web` |
| 4 | CGV et mentions pour des fichiers numériques (accès immédiat, licence personnelle, pas de conseil financier) | A11, `conformite-qa` |
| 5 | Budget étudiant (produit n°2), puis dettes, épargne, pack | O02, `createur-produits-numeriques` |
| 6 | 10 premières vidéos en capture d'écran, calendrier de publication | M06, M07, `createur-contenu` et `studio-video` |

Livraison des fichiers : lien de paiement Stripe qui renvoie vers une page de téléchargement privée, avec la case d'accord pour l'accès immédiat dans les conditions du paiement. Sans abonnement payant. `developpeur-web` confirme la faisabilité.

## 3. Ce que vous seul pouvez faire (votre identité ou votre argent)
1. **Déclarer la micro-entreprise** sur autoentrepreneur.urssaf.fr (gratuit). Activité : vente de produits numériques, catégorie prestations de services commerciales (BIC). C'est obligatoire avant la première vente.
2. **Ouvrir le compte Stripe** avec votre SIREN, votre pièce d'identité et votre IBAN.
3. **Renommer les comptes** TikTok, Instagram et Pinterest quand le nom sera choisi.
4. **Publier les vidéos** préparées : environ 10 minutes par jour. Les agents écrivent, montent et planifient ; vous appuyez sur « publier ».

## 4. Ce qui reste incertain
- La demande française n'est pas encore mesurée (étape 1). Si elle est faible, plan B : kits Canva pour petits commerces.
- Aucun chiffre de ventes n'est promis : il dépendra des vidéos qui prennent ou non.
- Frais Stripe exacts et seuil de TVA des services 2026 : `À VÉRIFIER`.

## ACTION HUMAINE
- Valider ou refuser ce plan.
- Faire les actions 1 et 2 de la section 3 dès que possible : sans elles, aucune vente n'est possible.
