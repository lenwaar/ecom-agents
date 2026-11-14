# Test : createur-produits-numeriques

## Demande
```
Utilise l'agent createur-produits-numeriques : fais une variante « Budget étudiant » du produit n°1 (catégories adaptées : bourse, job étudiant, aide des parents, loyer CROUS...), construite par un script dans produits/sources/, recalculée sans erreur.
```

## Critères de réussite
- [ ] Script dans `produits/sources/`, fichier dans `produits/fichiers/`
- [ ] Recalcul : 0 erreur ; 3 totaux vérifiés à la main dans le rapport
- [ ] Onglet « Commencer ici », cellules à remplir en jaune, exemples marqués
- [ ] Aucune fonction interdite (XLOOKUP, FILTER, SORT, UNIQUE, LET, macros)
- [ ] Livrable dans `outputs/` avec en-tête YAML, statut `à-valider`
