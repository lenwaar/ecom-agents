# Organisation de l'équipe : 100 rôles, 15 agents

Décision de l'humain du 2026-11-12 : les 100 rôles de l'organisation cible sont **conservés avec leurs codes**, mais confiés à une quinzaine d'agents spécialisés plutôt qu'à 100 fichiers. Raison : Claude Code choisit un agent d'après sa description ; au-delà de 20 à 25 agents il se trompe plus souvent, et chaque fichier coûte en maintenance et en tokens.

Les rôles mécaniques deviennent des **scripts sans IA** (gratuits, utilisables hors ligne). Les rôles de direction sont tenus par Cowork, la commande `/orchestre` et l'humain, qui garde le dernier mot.

> Mise à jour du 2026-11-14 : l'humain a demandé la version complète à 137 agents (vidéo ReStructure AI). Les 100 rôles ci-dessous restent valables ; les 137 fiches de `entreprise/agents/` les détaillent par département, toujours portées par une vingtaine de sous-agents. Voir `entreprise/README.md`.

## Les agents

| Agent | Pôles | État |
|---|---|---|
| `analyste-marche` | B | installé |
| `sourcing-produits` | C | installé |
| `conformite-qa` | A06, D09, D12, E09, F08, F12, J | installé |
| `architecte-web` | D, E06 | installé |
| `developpeur-web` | D | installé |
| `redacteur-catalogue` | E | installé |
| `studio-visuel` | D02, E03, F09 | installé |
| `createur-contenu` | F01, F10, G02, G03, G08 | prêt (synchro 9) |
| `studio-video` | F02 à F07, F11 | prêt (synchro 10) |
| `veille-outils` | B10, K | prêt (synchro 10) |
| `gestion-commandes` | C04 à C07, H03 | prêt, activé avant lancement |
| `service-client` | H | prêt, activé avant lancement |
| `crm-email` | G07, newsletter | prêt, activé avant lancement |
| `pilotage-finance` | A04, A07, B07, E07, G06, I | prêt, activé avant lancement |
| `media-acquisition` | G01, G04, G05, G10 | prêt, activé après lancement |
| `localisation` | E02, E10 | créé à l'ouverture UE |
| `ventes` | fiches V de `entreprise/` | prêt (2026-11-14) |
| `partenariats` | fiches P de `entreprise/` | prêt (2026-11-14) |
| `cerveau` | X01, I05, I16, O19 de `entreprise/` | prêt (2026-11-14) |

## Les scripts sans IA

| Script | Rôles | État |
|---|---|---|
| `tools/verifier_livrables.py` | A06, J05 | fait |
| `tools/calcul_marge.py` | B07, I01 | à créer (developpeur-web) |
| `tools/verifier_stock_prix.py` | C09 | à créer, API fournisseur officielle seulement |
| `tools/tableau_de_bord.py` | G09, I04 | à créer après lancement |
| `tools/base.py` | base SQLite, statut, validations, sauvegarde | fait (2026-11-14) |
| `tools/page_lundi.py` | page du lundi | fait (2026-11-14) |
| `tools/generer_entreprise.py` | 137 fiches d'agents | fait (2026-11-14) |

## Les 100 rôles

### A. Direction et coordination (8)

| Code | Rôle | Assuré par | Phase |
|---|---|---|---|
| A01 | Orchestrateur central | Cowork + /orchestre | maintenant |
| A02 | Planificateur | Cowork (de-cowork.md) | maintenant |
| A03 | Attributaire de tâches | /orchestre | maintenant |
| A04 | Suivi des objectifs (KPI) | pilotage-finance | avant lancement |
| A05 | Arbitre | humain (Cowork propose) | maintenant |
| A06 | Contrôle qualité global | conformite-qa + script verifier_livrables | maintenant |
| A07 | Reporting | pilotage-finance | avant lancement |
| A08 | Gestion des priorités | Cowork | maintenant |

### B. Marché, niches et produits (10)

| Code | Rôle | Assuré par | Phase |
|---|---|---|---|
| B01 | Veille tendances | analyste-marche | maintenant |
| B02 | Analyse concurrence | analyste-marche | maintenant |
| B03 | Analyse de la demande | analyste-marche | maintenant |
| B04 | Saisonnalité | analyste-marche | maintenant |
| B05 | Analyse des avis clients | analyste-marche | maintenant |
| B06 | Validation produit (go/no-go) | analyste-marche + humain | maintenant |
| B07 | Estimation de rentabilité | script calcul_marge (à créer) + pilotage-finance | avant lancement |
| B08 | Recherche de niches | analyste-marche | maintenant |
| B09 | Scoring produits | analyste-marche | maintenant |
| B10 | Alertes marché | veille-outils | maintenant |

### C. Fournisseurs, achats et logistique (10)

| Code | Rôle | Assuré par | Phase |
|---|---|---|---|
| C01 | Recherche fournisseurs (API autorisées) | sourcing-produits | maintenant |
| C02 | Vérification de fiabilité (preuves datées) | sourcing-produits | maintenant |
| C03 | Comparaison des prix | sourcing-produits | maintenant |
| C04 | Gestion des stocks | gestion-commandes | avant lancement |
| C05 | Suivi des délais | gestion-commandes | avant lancement |
| C06 | Suivi des commandes | gestion-commandes | avant lancement |
| C07 | Gestion des retours (logistique) | gestion-commandes | avant lancement |
| C08 | Fournisseurs de secours | sourcing-produits | maintenant |
| C09 | Vérification stock et prix en temps réel | script verifier_stock_prix (à créer) | avant lancement |
| C10 | Contrôle documents et conformité fournisseur | sourcing-produits + conformite-qa | maintenant |

### D. Boutique et développement web (12)

| Code | Rôle | Assuré par | Phase |
|---|---|---|---|
| D01 | Création de boutiques | architecte-web + developpeur-web | maintenant |
| D02 | Identité visuelle | studio-visuel (+ Figma) | maintenant |
| D03 | Pages produits | developpeur-web | maintenant |
| D04 | Optimisation mobile | developpeur-web | maintenant |
| D05 | Recherche interne | developpeur-web | maintenant |
| D06 | Panier et checkout | developpeur-web (Stripe) | avant lancement |
| D07 | Intégrations (paiement, logistique) | developpeur-web | avant lancement |
| D08 | Performance | developpeur-web | maintenant |
| D09 | Accessibilité | conformite-qa | maintenant |
| D10 | Maintenance technique | developpeur-web | après lancement |
| D11 | SEO technique | developpeur-web | maintenant |
| D12 | Tests et recette | conformite-qa + tests Playwright | maintenant |

### E. Catalogue et contenus (10)

| Code | Rôle | Assuré par | Phase |
|---|---|---|---|
| E01 | Fiches produits | redacteur-catalogue | maintenant |
| E02 | Traduction | localisation (créé à l'ouverture UE) | expansion UE |
| E03 | Images et visuels | studio-visuel | maintenant |
| E04 | Vérification des caractéristiques | redacteur-catalogue + conformite-qa | maintenant |
| E05 | SEO contenu | redacteur-catalogue | maintenant |
| E06 | Catégories et navigation | architecte-web | maintenant |
| E07 | Gestion des prix | pilotage-finance (validation humaine) | avant lancement |
| E08 | Mises à jour catalogue | redacteur-catalogue | après lancement |
| E09 | Contrôle qualité contenu | conformite-qa | maintenant |
| E10 | Localisation (FR puis UE) | localisation (créé à l'ouverture UE) | expansion UE |

### F. Création publicitaire et audiovisuelle (12)

| Code | Rôle | Assuré par | Phase |
|---|---|---|---|
| F01 | Scripts publicitaires | createur-contenu | maintenant |
| F02 | Voix off | studio-video | maintenant |
| F03 | Avatars synthétiques (originaux, labellisés IA) | studio-video (sur accord humain) | après lancement |
| F04 | Démonstrations produit | studio-video | maintenant |
| F05 | Montage vidéo | studio-video | maintenant |
| F06 | Sous-titres | studio-video | maintenant |
| F07 | Déclinaisons multi-formats | studio-video | maintenant |
| F08 | Contrôle qualité audiovisuel | conformite-qa | maintenant |
| F09 | Visuels produits | studio-visuel | maintenant |
| F10 | Variantes par canal | createur-contenu | maintenant |
| F11 | Étiquette « contenu généré par IA » | studio-video + conformite-qa | maintenant |
| F12 | Vérification des droits (voix, images, musique) | conformite-qa | maintenant |

### G. Acquisition et croissance (10)

| Code | Rôle | Assuré par | Phase |
|---|---|---|---|
| G01 | SEO naturel | media-acquisition | après lancement |
| G02 | Réseaux sociaux | createur-contenu | maintenant |
| G03 | Calendrier éditorial | createur-contenu | maintenant |
| G04 | Campagnes (organique d'abord) | media-acquisition | après lancement |
| G05 | Tests créatifs | media-acquisition | après lancement |
| G06 | Analyse des conversions | pilotage-finance | après lancement |
| G07 | Fidélisation | crm-email | après lancement |
| G08 | Contenu organique | createur-contenu | maintenant |
| G09 | Monitoring des canaux | script tableau_de_bord (à créer) | après lancement |
| G10 | Optimisation continue | media-acquisition | après lancement |

### H. Relation client et e-mails (10)

| Code | Rôle | Assuré par | Phase |
|---|---|---|---|
| H01 | Tri des messages | service-client | avant lancement |
| H02 | Réponses (brouillons) | service-client | avant lancement |
| H03 | Suivi de livraison | gestion-commandes | avant lancement |
| H04 | Gestion des retours (client) | service-client | avant lancement |
| H05 | Remboursements | service-client propose, humain valide | avant lancement |
| H06 | Réclamations | service-client | avant lancement |
| H07 | Escalade des cas sensibles | service-client vers humain | avant lancement |
| H08 | Mode brouillon / validation | règle CLAUDE.md | maintenant |
| H09 | Prévention du spam | outil e-mail (filtre), sans IA | avant lancement |
| H10 | Gestion des désinscriptions | outil e-mail (automatique), sans IA | avant lancement |

### I. Finance et pilotage (6)

| Code | Rôle | Assuré par | Phase |
|---|---|---|---|
| I01 | Marges réelles | pilotage-finance + script calcul_marge | avant lancement |
| I02 | Suivi des dépenses | pilotage-finance | maintenant |
| I03 | Rapprochements | pilotage-finance | après lancement |
| I04 | Tableaux de bord | script tableau_de_bord (à créer) | après lancement |
| I05 | Prévisions | pilotage-finance | avant lancement |
| I06 | Anomalies financières | pilotage-finance | après lancement |

### J. Sécurité, conformité et fiabilité (6)

| Code | Rôle | Assuré par | Phase |
|---|---|---|---|
| J01 | Gestion des accès | humain (Cowork rappelle) | maintenant |
| J02 | Données personnelles (RGPD) | conformite-qa | maintenant |
| J03 | Sécurité des produits (GPSR) | conformite-qa | maintenant |
| J04 | Allégations commerciales | conformite-qa | maintenant |
| J05 | Audit et journaux | git + script verifier_livrables | maintenant |
| J06 | Gestion des incidents | Cowork + humain | maintenant |

### K. Recherche technique et amélioration (6)

| Code | Rôle | Assuré par | Phase |
|---|---|---|---|
| K01 | Veille GitHub / outils | veille-outils | maintenant |
| K02 | Évaluation des outils et licences | veille-outils | maintenant |
| K03 | Tests en environnement isolé | veille-outils (bac à sable de Cowork) | maintenant |
| K04 | Suivi des modèles IA | veille-outils | maintenant |
| K05 | Optimisation des coûts | veille-outils + pilotage-finance | maintenant |
| K06 | Propositions d'évolution (jamais auto-déployées) | veille-outils vers docs/retours-experience.md | maintenant |

## Règles qui ne changent pas
- Rien n'est publié, envoyé, payé, remboursé ou commandé sans l'accord explicite de l'humain.
- Un rôle ne devient un agent séparé que si l'agent qui le porte se trompe ou déborde plusieurs fois (noté dans `docs/retours-experience.md`).
- `veille-outils` propose des évolutions ; il ne les installe jamais lui-même.
