# Direction design de la boutique

**Exigence de l'humain (2026-11-12)** : une boutique au niveau des meilleures interfaces modernes, qui donne envie de cliquer. Référence de style : les interfaces type **shadcn/ui** et les sites soignés générés par les meilleurs outils d'IA. S'applique à `architecte-web`, `developpeur-web` et à tout visuel produit par l'équipe.

## Règles absolues
- **Aucun emoji** dans l'interface, les textes du site ou les boutons. **Des icônes à la place** : bibliothèque **Lucide** (trait fin et cohérent), une seule bibliothèque pour tout le site.
- Aucun look « template gratuit » : pas de dégradés criards, d'ombres lourdes, de polices fantaisie, de bannières clignotantes ou de pop-up agressives.

## Style visuel attendu
| Élément | Direction |
|---|---|
| Ambiance | Épurée, premium, artisanale et moderne à la fois (le bois et la mécanique mis en valeur) |
| Couleurs | Fond neutre (blanc cassé ou très légèrement chaud), texte presque noir, **une seule couleur d'accent** pour les actions ; mode sombre en option |
| Typographie | Une police sans-serif moderne et très lisible (type Inter ou Geist, Google Fonts ou auto-hébergée), hiérarchie nette entre titres et texte |
| Composants | Esprit shadcn/ui : coins arrondis réguliers, bordures fines et discrètes, ombres très légères, cartes produit propres, badges sobres, boutons aux états clairs (survol, focus, désactivé) |
| Espacement | Généreux, grille régulière, beaucoup d'air autour des photos |
| Photos | Grandes, lumineuses, fond uni ou en situation sur un bureau ; même style sur toutes les fiches |
| Animations | Micro-interactions discrètes et rapides (survol de carte, apparition au défilement, transition de bouton), désactivées si l'utilisateur préfère réduire les animations |
| Icônes | Lucide, même taille et même épaisseur partout ; icônes de réassurance (livraison, retours, paiement sécurisé, 14+) |

## Pile technique associée
- **Tailwind CSS** pour le style, avec les couleurs et rayons définis comme variables (thème).
- Composants dans l'esprit **shadcn/ui** (reproduits en composants Astro, ou via îlots React si nécessaire).
- Icônes **Lucide**.

## Contrôle qualité visuel
Avant de valider une page : capture mobile et ordinateur, comparaison avec cette direction, aucun emoji, contrastes conformes (WCAG AA), icônes cohérentes.
