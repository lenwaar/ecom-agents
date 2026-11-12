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
- [ ] Le budget de 0 € est respecté (aucune commande, qualité évaluée par les avis)
- [ ] Une proposition de `knowledge/prix-et-marges.md` est faite

## Résultat
- Date du test :
- Note globale (/10) :
- Ce qui doit être corrigé dans l'agent :
