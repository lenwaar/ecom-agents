# Test : developpeur-web

## Demande à lancer dans Claude Code
```
Utilise l'agent developpeur-web : crée le squelette du site dans site/ à partir de la dernière spécification architecte-web, avec 1 produit d'exemple marqué brouillon.
```

## Critères de réussite
- [ ] `cd site && npm install && npm run build` passe sans erreur
- [ ] Versions de dépendances figées, `package-lock.json` commité
- [ ] Aucun secret dans le dépôt (`git log -p | grep -i "sk_"` ne renvoie rien)
- [ ] Le produit d'exemple vient d'un fichier dans `site/src/content/produits/`
- [ ] Pied de page avec tous les liens légaux ; page de rétractation avec bouton
- [ ] La fiche produit affiche prix TTC, délai, bloc sécurité, 14 ans et plus
- [ ] Rendu correct sur mobile (vérifié par capture ou description)
- [ ] Le rapport explique comment lancer le site en local
- [ ] Rien n'est déployé ni aucun paiement réel activé

## Résultat
- Date du test :
- Note globale (/10) :
- Ce qui doit être corrigé dans l'agent :
