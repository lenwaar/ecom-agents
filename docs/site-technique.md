# Site de la boutique : choix techniques

**Décision de l'humain du 2026-11-12 : site maison + paiement Stripe**, plutôt qu'une plateforme fermée, pour que l'équipe d'agents puisse construire et gérer toute la boutique par le code.

## Pile technique
| Brique | Choix | Pourquoi |
|---|---|---|
| Générateur de site | **Astro** (version stable figée dans `site/package.json`) | Site statique très rapide ; produits gérés comme des fichiers de contenu |
| Style | **Tailwind CSS** + composants dans l'esprit **shadcn/ui** + icônes **Lucide** (aucun emoji) | Exigence de l'humain : voir `knowledge/direction-design.md` |
| Hébergement | **Cloudflare** (hébergement de site statique gratuit) | 0 €/mois, rapide, déjà utilisé par l'humain |
| Paiement | **Stripe Payment Links** au lancement (un lien de paiement par produit) ; panier avec Stripe Checkout plus tard si besoin | Pas d'abonnement ; 1,5 % + 0,25 € par carte standard de l'EEE (tarif Stripe consulté le 2026-11-12) |
| Formulaires (rétractation, contact) | À définir par `architecte-web` et `developpeur-web` (fonction serverless gratuite ou service de formulaire) | Le bouton de rétractation en ligne est obligatoire |
| Nom de domaine | Plus tard (sous-domaine gratuit en attendant) | Coût annuel à valider par l'humain |

## Organisation
```
site/                      code du site (Astro)
site/src/content/produits/ une fiche produit = un fichier
site/src/pages/            pages
site/public/               images et fichiers statiques
```

## Format d'une fiche produit (première version, à affiner par architecte-web)
```yaml
---
nom: ""
slug: ""
prix_ttc: 0          # en euros
statut: brouillon    # brouillon | en-vente | rupture
delai_livraison_max_jours: 14
age_minimum: 14
difficulte: ""       # facile | moyen | expert
temps_assemblage: ""
dimensions: ""
contenu_boite: []
lien_paiement_stripe: ""   # Payment Link, jamais de clé secrète
photos: []
securite:
  fabricant: ""
  adresse_fabricant: ""
  email_fabricant: ""
  responsable_ue: ""
  reference: ""
  avertissements: []
---
Description du produit (rédigée par redacteur-catalogue).
```

## Règles
- Aucun secret dans le dépôt : un Payment Link est public, une clé secrète Stripe ne l'est jamais.
- Rien n'est mis en ligne ni encaissé sans l'accord de l'humain (compte Stripe et SIRET nécessaires pour encaisser).
