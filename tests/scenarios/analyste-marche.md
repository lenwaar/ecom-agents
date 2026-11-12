# Test : analyste-marche

## Demande à lancer dans Claude Code
```
Utilise l'agent analyste-marche : trouve les 3 meilleures niches pour lancer notre boutique, en respectant knowledge/contraintes.md.
```

## Critères de réussite

Coche chaque case en lisant le rapport produit dans `outputs/`.

**Structure**
- [ ] Le fichier existe dans `outputs/` avec le bon nom et l'en-tête YAML
- [ ] Les 8 sections sont présentes, dans l'ordre

**Exploration**
- [ ] 20 niches ou plus, venant de 6 univers ou plus
- [ ] Chaque niche est un problème précis pour un public précis (pas juste « cuisine »)

**Rigueur**
- [ ] Aucune niche réglementée à risque dans le top 3 (compléments, jouets enfants, allégations santé…)
- [ ] Aucune niche à tailles multiples dans le top 3
- [ ] Chaque note a une justification
- [ ] Les scores pondérés sont justes (vérifie-en 2 à la main)
- [ ] Chaque chiffre a une source ou la mention `À VÉRIFIER`
- [ ] Prends 3 URL au hasard et ouvre-les : elles existent et disent bien ce qui est cité

**Utilité**
- [ ] Le top 3 est compatible avec un budget de 0 € et du contenu sans visage
- [ ] Chaque niche du top 3 a des concurrents réels, un persona et un angle de différenciation
- [ ] La recommandation finale est claire

## Résultat
- Date du test :
- Note globale (/10) :
- Ce qui doit être corrigé dans l'agent :
