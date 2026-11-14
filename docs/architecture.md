# Architecture de l'équipe d'agents

## Principes

1. **Un orchestrateur, des spécialistes.** Seul l'orchestrateur parle à l'humain et distribue le travail. Chaque spécialiste a UN métier.
2. **Indépendant de la plateforme.** Les agents produisent des livrables standardisés (fiches produits JSON/Markdown, pages, campagnes). La plateforme choisie est un site maison (voir `docs/site-technique.md`) : `developpeur-web` transforme ces livrables en pages.
3. **Une source de vérité partagée : `knowledge/`.** Marque, niche, cible, ton, politiques, prix. Tous les agents la lisent avant d'agir ; seuls l'orchestrateur et l'humain la modifient.
4. **Rien ne part en ligne sans validation.** Tout ce qui est public (page, pub, mail client, prix) passe par l'agent Conformité-QA puis par l'humain.
5. **Chaque agent est testé.** Un scénario dans `tests/scenarios/` décrit une demande type et les critères d'un bon livrable.

## Couche « entreprise » : 137 agents (2026-11-14)

Au-dessus des sous-agents, l'entreprise est découpée en **137 fiches d'agents** : 7 départements (Ventes 22, Offres et partenariats 18, Marketing 22, Opérations 20, Intelligence 16, Clients 20, Back office 18) et un Cerveau. Chaque fiche dit qui l'exécute (un sous-agent, un script sans IA ou l'humain). Carte et mode d'emploi : `entreprise/README.md`. Catalogue : `entreprise/catalogue.md`.

- Nouveaux sous-agents : `ventes`, `partenariats`, `cerveau` (18 au total, sous la limite de 20-25).
- Système de référence : `donnees/entreprise.db` (SQLite, schéma `donnees/schema.sql`).
- Ce qui interrompt la boucle : `entreprise/interruptions.md`.
- Commandes : `/agent <code> <demande>` et `/lundi`.

## Organigramme (12 agents, 5 pôles)

> Organisation complète à 100 rôles (environ 15 agents et des scripts sans IA) : voir `docs/organisation.md`.

```
                         ┌──────────────────┐
                         │   Toi (direction) │
                         └────────┬─────────┘
                         ┌────────▼─────────┐
                         │  orchestrateur   │  chef d'orchestre, planifie, délègue, synthétise
                         └────────┬─────────┘
   ┌──────────────┬───────────────┼───────────────┬──────────────────┐
   ▼              ▼               ▼               ▼                  ▼
STRATÉGIE      BOUTIQUE        MARKETING       OPÉRATIONS          PILOTAGE
analyste-      redacteur-      createur-       gestion-            analyste-
marche         catalogue       contenu         commandes           performance
sourcing-      architecte-     media-          service-            conformite-qa
produits       web             acquisition     client
                               crm-email
                               (+ developpeur-web, pôle Boutique)
```

| # | Agent | Mission | Livrables |
|---|-------|---------|-----------|
| 0 | `orchestrateur` (commande `/orchestre`) | Comprend la demande, découpe, délègue, contrôle, synthétise | Plan d'action, compte rendu |
| 1 | `analyste-marche` | Niches, tendances, concurrents, persona client | Rapport de niche noté, fiche persona |
| 2 | `sourcing-produits` | Trouver produits et fournisseurs, calculer marges, évaluer fiabilité et délais | Fiche produit candidat + calcul de marge |
| 3 | `redacteur-catalogue` | Fiches produits qui convertissent + SEO | Titre, description, bénéfices, FAQ, balises SEO |
| 4 | `architecte-web` | Structure de la boutique, pages, parcours d'achat, optimisation de conversion | Plan du site, spécifications des pages, identité visuelle |
| 4b | `developpeur-web` | Code du site maison (Astro + Stripe), tests, préparation du déploiement | Code dans `site/`, rapport de livraison |
| 5 | `createur-contenu` | Contenu organique TikTok / Instagram / Pinterest / Shorts (sans visage) | Scripts vidéo, légendes, calendrier éditorial |
| 6 | `media-acquisition` | Publicité payante (Meta, TikTok, Google) quand le budget existera | Plans de campagne, ciblages, variantes d'annonces |
| 7 | `crm-email` | Fidélisation : emails, segmentation, relances panier | Séquences email, segments |
| 8 | `gestion-commandes` | Traitement commandes, suivi fournisseur, incidents de livraison | Procédures, suivi, alertes |
| 9 | `service-client` | Réponses clients, retours, remboursements, avis | Réponses prêtes à envoyer, macros SAV |
| 10 | `analyste-performance` | KPIs, rapports hebdo, recommandations chiffrées | Tableau de bord, rapport hebdo |
| 11 | `conformite-qa` | Droit FR/UE (CGV, rétractation 14 j, RGPD, cosmétiques), contrôle qualité de tous les livrables publics | Verdict OK / à corriger + liste précise |

## Flux type : lancer un produit

```
analyste-marche → sourcing-produits → redacteur-catalogue → conformite-qa
      → architecte-web (mise en page) → createur-contenu (lancement)
      → [toi : validation] → developpeur-web (mise en ligne)
      → analyste-performance (suivi J+7)
```

## Pourquoi l'orchestrateur est une commande et pas un sous-agent

Dans Claude Code, un sous-agent ne peut pas lancer d'autres sous-agents. L'orchestrateur tourne donc dans la session principale via la commande `/orchestre`, et c'est lui qui délègue aux 11 spécialistes de `.claude/agents/`.

## Format d'échange entre agents

Chaque livrable est un fichier dans `outputs/<date>-<agent>-<sujet>.md` avec un en-tête :

```yaml
agent: redacteur-catalogue
statut: brouillon | à-valider | validé
sources: [knowledge/marque.md, outputs/...]
prochaine-etape: conformite-qa
```

## Limite à connaître

Les sous-agents Claude Code travaillent **quand on les lance** (depuis Claude Code), ils ne tournent pas seuls 24 h/24. Les tâches récurrentes (rapport hebdo, veille) pourront être planifiées plus tard, ou portées en Claude Agent SDK quand la boutique rapportera de quoi payer l'API.
