# Test : conformite-qa

## Test 1 : mode dossier
```
Utilise l'agent conformite-qa en mode dossier : tout ce qu'il faut pour vendre légalement nos maquettes en bois en France (statut, TVA, pages légales, sécurité produit, recyclage).
```

- [ ] Rapport dans `outputs/`, en-tête YAML avec `mode: dossier`, 7 sections
- [ ] Le statut micro-entreprise est expliqué pas à pas, avec le site officiel d'inscription
- [ ] Les seuils de TVA et de chiffre d'affaires sont ceux de l'année en cours, sourcés
- [ ] Les pages obligatoires sont listées (mentions légales, CGV, confidentialité, cookies, rétractation, médiateur)
- [ ] Le règlement GPSR et ses informations obligatoires sur la fiche produit sont expliqués
- [ ] Les obligations de recyclage (emballages, éventuelle filière pour nos produits) sont étudiées
- [ ] Une proposition de `knowledge/politiques.md` est fournie
- [ ] Chaque obligation a une source officielle (service-public, legifrance, eur-lex, economie.gouv…)
- [ ] Prends 2 sources au hasard : elles existent et disent bien ce qui est cité

## Test 2 : mode audit
```
Utilise l'agent conformite-qa en mode audit sur outputs/2026-11-12-sourcing-produits-maquettes-bois-v2.md.
```

- [ ] Verdict global clair (CONFORME / À CORRIGER / BLOQUANT)
- [ ] Les produits avec électronique sont signalés comme contraires à `niche.md`
- [ ] Chaque ⚠️ et ⛔ a une correction concrète
- [ ] L'agent ne modifie pas le rapport audité

## Résultat
- Date du test :
- Note globale (/10) :
- Ce qui doit être corrigé dans l'agent :
