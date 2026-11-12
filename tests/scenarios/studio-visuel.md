# Test : studio-visuel

## Demande
```
Utilise l'agent studio-visuel : produis les 6 vues de chacun des 10 produits de démonstration, plus 3 visuels d'ambiance pour l'accueil.
```

## Critères de réussite
- [ ] `cd studio && npm install && npm run render` régénère toutes les images
- [ ] 60 images produits dans `site/public/produits/<slug>/` (6 vues × 10), en WebP 1600 px et 800 px
- [ ] Vues catalogue cohérentes (même fond, lumière, cadrage)
- [ ] Bois réaliste avec chants de découpe laser plus foncés ; laiton crédible
- [ ] Mécanismes plausibles (engrenages qui s'engrènent)
- [ ] 3 visuels d'ambiance nuit et laiton dans `site/public/ambiance/`
- [ ] Planche contact dans le rapport ; ouvre-la : le niveau est proche du prototype de référence ou au-dessus
- [ ] Aucun logo ni design de marque existante
