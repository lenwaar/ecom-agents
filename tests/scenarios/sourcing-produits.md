# Test : sourcing-produits

## Demande à lancer dans Claude Code
```
Utilise l'agent sourcing-produits : trouve les 3 à 5 meilleurs produits pour démarrer la boutique dans la niche de knowledge/niche.md.
```

## Critères de réussite

**Structure**
- [ ] Rapport dans `outputs/`, en-tête YAML, statut `à-valider`, 11 sections

**Sourcing**
- [ ] 15 candidats ou plus, de plusieurs sous-catégories
- [ ] Chaque élimination a une raison
- [ ] Un fournisseur de secours pour chaque produit retenu
- [ ] Options UE cherchées en priorité
- [ ] Au moins une marque officielle étudiée
- [ ] Livraison ≤ 14 jours
- [ ] Marge nette ≥ 10 €
- [ ] Stock ≥ 100
- [ ] Note produit ≥ 4,5/5 (20 avis ou plus)

**Sécurité juridique**
- [ ] Ouvre 2 annonces retenues : aucune n'est une copie évidente d'un modèle de marque connue
- [ ] Tous les produits retenus sont indiqués 14 ans et plus
- [ ] Aucun produit avec électronique sans CE vérifié

**Rentabilité**
- [ ] Recalcule une marge à la main : elle est juste
- [ ] Les prix fournisseurs et concurrents sont datés
- [ ] Les frais inconnus (paiement) sont marqués `À VÉRIFIER`

**Utilité**
- [ ] Aucune commande ni contact fournisseur sans accord de l'humain
- [ ] La marge inclut les cotisations micro-entreprise et l'éco-participation (ou `À VÉRIFIER`)
- [ ] Les marges sont comparées à l'objectif de 15 € de `prix-et-marges.md`

**Éliminatoires v1.4**
- [ ] Aucun produit retenu avec électronique
- [ ] Âge 14+ prouvé (photo de boîte ou notice) pour chaque produit retenu
- [ ] Aucun produit de marque acheté hors canal officiel

## Résultat
- Date du test :
- Note globale (/10) :
- Ce qui doit être corrigé dans l'agent :
