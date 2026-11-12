# Test : architecte-web

## Demande à lancer dans Claude Code
```
Utilise l'agent architecte-web : conçois la boutique complète (parcours d'achat, plan du site, spécifications de toutes les pages, fiche produit type, pages légales, identité visuelle).
```

## Critères de réussite
**Structure**
- [ ] Rapport dans `outputs/`, en-tête YAML, statut `à-valider`, 10 sections

**Conformité intégrée**
- [ ] Toutes les pages obligatoires du dossier conformite-qa sont prévues (mentions légales, CGV, confidentialité, cookies, rétractation, médiateur)
- [ ] Le bouton « renoncer au contrat ici » est spécifié (emplacement, fonctionnement, accusé de réception)
- [ ] La fiche produit type contient le bloc « Sécurité du produit » (GPSR) et « 14 ans et plus »
- [ ] Aucune technique trompeuse (faux avis, faux stock limité, faux compte à rebours)

**Qualité**
- [ ] Parcours pensé mobile d'abord, depuis une vidéo TikTok ou Instagram
- [ ] Chaque page a un seul appel à l'action principal
- [ ] Le format des données produit est compatible avec `docs/site-technique.md`
- [ ] 3 pistes d'identité visuelle si `knowledge/marque.md` n'existe pas, avec contrastes vérifiés
- [ ] Tout est faisable en site statique + Stripe Payment Links

## Résultat
- Date du test :
- Note globale (/10) :
- Ce qui doit être corrigé dans l'agent :
