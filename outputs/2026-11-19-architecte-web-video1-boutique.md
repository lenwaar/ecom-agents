---
agent: architecte-web
statut: à-valider
date: 2026-11-19
sources: [CLAUDE.md, knowledge/memo.md, knowledge/decisions.md, knowledge/politiques.md, docs/retours-experience.md, docs/site-technique.md, tools/calcul_marge.py, site/src/pages/contact.astro, site/src/pages/renoncer-au-contrat.astro, site/src/components/produit/BlocAchat.astro, site/src/components/atelier/LettreAtelier.astro, site/src/content/reglages/boutique.yaml]
prochaine-etape: conformite-qa puis developpeur-web
---

# Vidéo 1 : admin de boutique (tâche V1)

## 1. Résumé
- Quatre fonctionnalités : une page produit modèle, une section Avis, un tableau de bord `/boutique` dans le QG, une page `/modules` dans le QG.
- Produit et fournisseur non décidés : tout repose sur un produit de démonstration, sans prix, sans délai, sans lien de paiement.
- Les données vivent dans `data/` (créé ce jour). Les vrais fichiers sont vides ; les exemples sont séparés, étiquetés, jamais additionnés aux vrais.
- Les 5 modules sont « à venir » : aucun ne fonctionne réellement aujourd'hui (détail en §3).
- Nouvelle règle dans `CLAUDE.md` : pas d'avis sans référence de commande réelle.

## 2. Les 4 fonctionnalités

**A. Page produit modèle** (site, données `data/produits/exemple-demo.json`)
- Mobile d'abord, une colonne. Ordre : bandeau, visuel, nom, description, prix, délai, bouton, « 14 ans et plus », Sécurité du produit, Avis.
- Bandeau fixe en haut, contraste AA : « Page de démonstration, produit non vendu ».
- `<meta name="robots" content="noindex, nofollow">` ; page absente du plan du site et des données structurées Product.
- Prix, frais de port, délai à `null` : la ligne n'est pas affichée (leçon 10). Jamais « 0 € », jamais « À VÉRIFIER » visible.
- Bouton « Acheter » affiché désactivé (`disabled`, `aria-disabled="true"`) avec la mention « Paiement non disponible : produit de démonstration ». Il ne s'active que si `demo` vaut `false`, `paiement.actif` vaut `true` et `paiement.lien` commence par `https://buy.stripe.com/`.
- Sécurité du produit : sur une démo, texte « Produit de démonstration, non vendu : il n'a pas de fabricant. » (décision du 2026-11-13).
- Visuel : illustration neutre `/images/exemple-demo/illustration.svg`, aucune photo de marque.

**B. Section Avis** (site, données `data/avis.json`)
- Un avis s'affiche seulement si sa `reference_commande` existe dans `data/commandes.json`, avec `statut` « payee », et si son `produit` est celui de la page. Sinon il est ignoré et la construction affiche un avertissement.
- Les fichiers d'exemple ne sont jamais lus par cette section.
- Liste vide : « Aucun avis pour le moment. Seuls les clients ayant commandé peuvent en laisser un. » Pas de note moyenne, pas d'étoiles vides, pas de données structurées Review.
- Avec avis : note sur 5 en texte (« 4 sur 5 ») et en étoiles masquées aux lecteurs d'écran, prénom et initiale, date, mention « Achat vérifié ». Ordre : du plus récent au plus ancien. Aucun tri qui cache les mauvaises notes.

**C. Tableau de bord `/boutique` du QG** (données `data/commandes.json`)
- Quatre chiffres : ventes (somme des `montant_ttc` des commandes « payee »), commandes payées, visiteurs, marge nette réelle. Puis la liste des commandes et les remboursements à part.
- `visiteurs` à `null` : afficher « Non mesuré », pas 0.
- Marge nette par commande, formule de `tools/calcul_marge.py`, avec P = `montant_ttc` :
  `marge = P − cout_fournisseur − (1,5 % × P + 0,25 €) − 12,3 % × P − 5 % × P`
  (frais Stripe, cotisations, provision retours). Si `frais_stripe_reels` est renseigné, il remplace l'estimation Stripe. Sinon, la valeur est marquée « estimée » et le tarif Stripe reste « à vérifier ».
- `cout_fournisseur` à `null` : marge de la commande « À VÉRIFIER », exclue du total. Afficher « marge calculée sur N commandes sur M ».
- Une commande « remboursee » ne compte ni dans les ventes ni dans la marge ; elle apparaît dans un bloc Remboursements.
- Bouton « Voir avec des exemples » : charge `data/commandes.exemple.json` dans un bloc séparé, bordure et titre « Exemple : chiffres fictifs », jamais mélangé aux vrais chiffres. Par défaut, les vrais chiffres (vides) s'affichent : « Aucune commande importée ».
- Repère de calcul, exemple EXEMPLE-001 (fictif) : P = 30 €, coût 12 € → 30 − 12 − 0,70 − 3,69 − 1,50 = **12,11 €**.

**D. Page `/modules` du QG** (données `data/modules.json`)
- Une carte par module : nom, état (« Actif » ou « À venir », texte et couleur, pas la couleur seule), description, lien vers le fichier `preuve`.
- Aucune date, aucun « bientôt », aucune promesse.

## 3. Format des données
| Fichier | Contenu aujourd'hui | Règle |
|---|---|---|
| `data/produits/exemple-demo.json` | démo, nombres `null`, textes « À VÉRIFIER » | `demo: true` = jamais achetable |
| `data/avis.json` | `{"avis": []}` | avis : `reference_commande` (obligatoire, commande réelle), `date` AAAA-MM-JJ, `auteur` « Prénom I. », `note` 1 à 5, `texte`, `produit` (slug) |
| `data/commandes.json` | vide, `visiteurs: null` | commande : `reference` (Stripe), `date`, `produit`, `quantite`, `montant_ttc`, `cout_fournisseur`, `frais_stripe_reels`, `statut` « payee » ou « remboursee ». Aucune donnée personnelle |
| `data/commandes.exemple.json` | 3 commandes `EXEMPLE-00x`, `exemple: true` partout | affichage d'exemple seulement |
| `data/modules.json` | 5 modules, tous « a-venir » | « actif » seulement si le module fonctionne vraiment ; `preuve` = fichier qui montre l'état |

État des modules : **paiement** (aucun lien Stripe réel), **avis** (aucune commande réelle), **contact** (pas de formulaire, liens email désactivés car l'email de la boutique est « [À VALIDER] »), **lettre d'information** (formulaire désactivé, aucun service d'emails), **SAV** (les pages existent, mais formulaire de rétractation désactivé et aucun email : aucune demande ne peut être reçue).

## 4. Questions pour l'humain
1. **Contradiction de niche** : `knowledge/memo.md` et `knowledge/decisions.md` disent que la boutique vend des tableurs numériques depuis le 2026-11-14. La tâche V1 suppose un produit physique (GPSR, 14 ans et plus, frais de port, coût fournisseur). Laquelle fait foi ? Pour un produit numérique, le taux de cotisation passe de 12,3 % à 21,2 % (memo) et le bloc GPSR ne s'applique pas.
2. **`data/commandes.json` hors de Git ?** Le dépôt est sur GitHub. Même sans données personnelles, les références Stripe et le chiffre d'affaires y deviendraient visibles. Proposition : l'ajouter à `.gitignore` dès le premier import réel, et ne garder dans Git que le fichier vide et l'exemple.
3. **Remboursements** : Stripe garde-t-il ses frais sur une commande remboursée ? À vérifier sur votre compte ; si oui, ils s'imputent à la marge.
4. **Visiteurs** : quel outil de mesure sans cookie non essentiel ? Tant qu'il n'y en a pas, le chiffre reste « Non mesuré ».
5. **Âge minimum 14 ans** : règle de `knowledge/politiques.md` pour les maquettes. Faut-il la garder pour le prochain produit ?
