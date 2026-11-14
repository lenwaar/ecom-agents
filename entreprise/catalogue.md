# Catalogue des agents de l'entreprise

**137 agents** répartis en 7 départements et un Cerveau. Fichier généré par `python tools/generer_entreprise.py` depuis `entreprise/catalogue.py` : ne pas le modifier à la main.

## Par département

| Département | Code | Agents | Rôle |
|---|---|---|---|
| Ventes | V | 22 | Transformer l'intérêt en commandes : visiteurs du site, messages des réseaux, acheteurs professionnels. |
| Offres et partenariats | P | 18 | Conclure les accords : créateurs de contenu, revendeurs officiels, entreprises, fournisseurs. |
| Marketing | M | 22 | Faire connaître la boutique : contenu organique sans visage, vidéos, visuels, e-mails, puis publicité quand le budget existera. |
| Opérations | O | 20 | Fabriquer, tester et livrer les produits numériques ; les fiches de logistique physique sont en pause depuis le passage au numérique (2026-11-14). |
| Intelligence | I | 16 | Mesurer, comprendre et prévoir : d'où vient l'argent, ce qui est à risque, ce qu'il faut faire ensuite. |
| Clients | C | 20 | Rendre chaque client content après l'achat : réponses, retours, avis, fidélité. |
| Back office | A | 18 | Tenir l'administratif d'une micro-entreprise : factures, paiements, déclarations, juridique, sauvegardes. |
| Cerveau de l'entreprise | X | 1 | Mémoire commune et aiguillage : chaque agent lit le Cerveau, le Cerveau sait qui fait quoi et ce qui attend l'humain. |

## Qui exécute quoi

Un sous-agent Claude Code porte plusieurs fiches : au-delà de 20 à 25 sous-agents, Claude Code choisit mal (voir `docs/organisation.md`).

| Porteur | Fiches |
|---|---|
| `pilotage-finance` | 20 |
| `ventes` | 16 |
| `partenariats` | 15 |
| `service-client` | 12 |
| `crm-email` | 9 |
| `createur-contenu` | 9 |
| `conformite-qa` | 8 |
| `gestion-commandes` | 8 |
| `sourcing-produits` | 5 |
| `analyste-marche` | 5 |
| `media-acquisition` | 4 |
| `createur-produits-numeriques` | 4 |
| `cerveau` | 4 |
| `redacteur-catalogue` | 3 |
| `studio-video` | 3 |
| `script` | 3 |
| `architecte-web` | 2 |
| `studio-visuel` | 2 |
| `developpeur-web` | 2 |
| `veille-outils` | 2 |
| `humain` | 1 |

## Ventes (22)

| Code | Agent | Vu dans la vidéo | Porteur | Phase | Validation |
|---|---|---|---|---|---|
| V01 | [Éclaireur d'intention](agents/ventes/V01-eclaireur-d-intention.md) | Buyer Intent Scout | `ventes` | maintenant | non |
| V02 | [Réponse en 60 secondes](agents/ventes/V02-reponse-en-60-secondes.md) | 60-Second Caller | `ventes` | maintenant | oui |
| V03 | [Approche personnalisée](agents/ventes/V03-approche-personnalisee.md) | Personal Outreach | `ventes` | avant lancement | oui |
| V04 | [Prise de rendez-vous](agents/ventes/V04-prise-de-rendez-vous.md) | Meeting Booker | `ventes` | avant lancement | oui |
| V05 | [Moteur de relance](agents/ventes/V05-moteur-de-relance.md) | Follow-Up Engine | `ventes` | maintenant | oui |
| V06 | [Relance de panier abandonné](agents/ventes/V06-relance-de-panier-abandonne.md) | - | `crm-email` | après lancement | oui |
| V07 | [Optimiseur de page produit](agents/ventes/V07-optimiseur-de-page-produit.md) | - | `architecte-web` | après lancement | oui |
| V08 | [Assistant de choix](agents/ventes/V08-assistant-de-choix.md) | - | `ventes` | maintenant | non |
| V09 | [Ventes complémentaires](agents/ventes/V09-ventes-complementaires.md) | - | `ventes` | avant lancement | non |
| V10 | [Calendrier des temps forts](agents/ventes/V10-calendrier-des-temps-forts.md) | - | `ventes` | maintenant | non |
| V11 | [Offres cadeaux](agents/ventes/V11-offres-cadeaux.md) | - | `ventes` | avant lancement | oui |
| V12 | [Pages d'atterrissage](agents/ventes/V12-pages-d-atterrissage.md) | - | `architecte-web` | après lancement | oui |
| V13 | [Préparateur de devis](agents/ventes/V13-preparateur-de-devis.md) | - | `ventes` | avant lancement | oui |
| V14 | [Qualificateur de prospects](agents/ventes/V14-qualificateur-de-prospects.md) | - | `ventes` | maintenant | non |
| V15 | [Fiche prospect](agents/ventes/V15-fiche-prospect.md) | - | `ventes` | avant lancement | non |
| V16 | [Réponses aux objections](agents/ventes/V16-reponses-aux-objections.md) | - | `redacteur-catalogue` | maintenant | non |
| V17 | [Conseiller avant-vente](agents/ventes/V17-conseiller-avant-vente.md) | - | `ventes` | maintenant | non |
| V18 | [Boutiques des réseaux](agents/ventes/V18-boutiques-des-reseaux.md) | - | `ventes` | après lancement | oui |
| V19 | [Parrainage](agents/ventes/V19-parrainage.md) | - | `ventes` | après lancement | oui |
| V20 | [Reconquête](agents/ventes/V20-reconquete.md) | - | `crm-email` | après lancement | oui |
| V21 | [Rapport de ventes](agents/ventes/V21-rapport-de-ventes.md) | - | `ventes` | maintenant | non |
| V22 | [Seuil de livraison offerte](agents/ventes/V22-seuil-de-livraison-offerte.md) | - | `pilotage-finance` | avant lancement | oui |

## Offres et partenariats (18)

| Code | Agent | Vu dans la vidéo | Porteur | Phase | Validation |
|---|---|---|---|---|---|
| P01 | [Préparation d'échange](agents/offres/P01-preparation-d-echange.md) | Meeting Prep | `partenariats` | maintenant | non |
| P02 | [Coach d'échange](agents/offres/P02-coach-d-echange.md) | Call Coach | `partenariats` | maintenant | non |
| P03 | [Radar des accords à risque](agents/offres/P03-radar-des-accords-a-risque.md) | Deal Risk Radar | `partenariats` | maintenant | non |
| P04 | [Rédacteur de propositions](agents/offres/P04-redacteur-de-propositions.md) | Proposal Writer | `partenariats` | avant lancement | oui |
| P05 | [Bon de commande et acompte](agents/offres/P05-bon-de-commande-et-acompte.md) | Contract & Deposit | `partenariats` | avant lancement | oui |
| P06 | [Chasseur de créateurs](agents/offres/P06-chasseur-de-createurs.md) | - | `partenariats` | maintenant | non |
| P07 | [Brief créateur](agents/offres/P07-brief-createur.md) | - | `partenariats` | après lancement | oui |
| P08 | [Suivi des collaborations](agents/offres/P08-suivi-des-collaborations.md) | - | `partenariats` | après lancement | non |
| P09 | [Programme d'affiliation](agents/offres/P09-programme-d-affiliation.md) | - | `partenariats` | après lancement | oui |
| P10 | [Négociateur fournisseur](agents/offres/P10-negociateur-fournisseur.md) | - | `sourcing-produits` | maintenant | oui |
| P11 | [Revendeurs officiels](agents/offres/P11-revendeurs-officiels.md) | - | `sourcing-produits` | avant lancement | oui |
| P12 | [Partenariats de contenu](agents/offres/P12-partenariats-de-contenu.md) | - | `partenariats` | après lancement | oui |
| P13 | [Coffrets et box](agents/offres/P13-coffrets-et-box.md) | - | `partenariats` | après lancement | oui |
| P14 | [Cadeaux d'entreprise](agents/offres/P14-cadeaux-d-entreprise.md) | - | `partenariats` | avant lancement | oui |
| P15 | [Ateliers et événements](agents/offres/P15-ateliers-et-evenements.md) | - | `partenariats` | après lancement | oui |
| P16 | [Grille de remises](agents/offres/P16-grille-de-remises.md) | - | `pilotage-finance` | avant lancement | oui |
| P17 | [Lecteur de clauses](agents/offres/P17-lecteur-de-clauses.md) | Unusual contract clause | `conformite-qa` | maintenant | oui |
| P18 | [Historique des accords](agents/offres/P18-historique-des-accords.md) | - | `partenariats` | maintenant | non |

## Marketing (22)

| Code | Agent | Vu dans la vidéo | Porteur | Phase | Validation |
|---|---|---|---|---|---|
| M01 | [Cartographe d'audience](agents/marketing/M01-cartographe-d-audience.md) | Audience Mapper | `analyste-marche` | maintenant | oui |
| M02 | [Espion des pubs concurrentes](agents/marketing/M02-espion-des-pubs-concurrentes.md) | Competitor Ad Spy | `media-acquisition` | maintenant | non |
| M03 | [Fabricant de vidéos publicitaires](agents/marketing/M03-fabricant-de-videos-publicitaires.md) | Video Ad Maker | `studio-video` | maintenant | oui |
| M04 | [Constructeur de campagnes](agents/marketing/M04-constructeur-de-campagnes.md) | Campaign Builder | `media-acquisition` | après lancement | oui |
| M05 | [Répartiteur de budget](agents/marketing/M05-repartiteur-de-budget.md) | Budget Mover | `media-acquisition` | après lancement | oui |
| M06 | [Scénariste vidéo](agents/marketing/M06-scenariste-video.md) | - | `createur-contenu` | maintenant | non |
| M07 | [Calendrier éditorial](agents/marketing/M07-calendrier-editorial.md) | - | `createur-contenu` | maintenant | non |
| M08 | [Atelier d'accroches](agents/marketing/M08-atelier-d-accroches.md) | - | `createur-contenu` | maintenant | non |
| M09 | [Déclinaisons de formats](agents/marketing/M09-declinaisons-de-formats.md) | - | `studio-video` | maintenant | non |
| M10 | [Visuels et miniatures](agents/marketing/M10-visuels-et-miniatures.md) | - | `studio-visuel` | maintenant | non |
| M11 | [Épingles Pinterest](agents/marketing/M11-epingles-pinterest.md) | - | `createur-contenu` | maintenant | oui |
| M12 | [Légendes et mots-clés](agents/marketing/M12-legendes-et-mots-cles.md) | - | `createur-contenu` | maintenant | non |
| M13 | [Voix off et sous-titres](agents/marketing/M13-voix-off-et-sous-titres.md) | - | `studio-video` | maintenant | non |
| M14 | [Veille des formats](agents/marketing/M14-veille-des-formats.md) | - | `createur-contenu` | maintenant | non |
| M15 | [Articles de blog](agents/marketing/M15-articles-de-blog.md) | - | `redacteur-catalogue` | avant lancement | oui |
| M16 | [Lettre d'information](agents/marketing/M16-lettre-d-information.md) | - | `crm-email` | après lancement | oui |
| M17 | [Recyclage de contenu](agents/marketing/M17-recyclage-de-contenu.md) | - | `createur-contenu` | maintenant | non |
| M18 | [Tests créatifs](agents/marketing/M18-tests-creatifs.md) | - | `media-acquisition` | après lancement | non |
| M19 | [Bibliothèque de marque](agents/marketing/M19-bibliotheque-de-marque.md) | - | `studio-visuel` | maintenant | non |
| M20 | [Contrôle des droits et mentions IA](agents/marketing/M20-controle-des-droits-et-mentions-ia.md) | - | `conformite-qa` | maintenant | non |
| M21 | [Relations presse](agents/marketing/M21-relations-presse.md) | - | `partenariats` | après lancement | oui |
| M22 | [Analyste des publications](agents/marketing/M22-analyste-des-publications.md) | - | `createur-contenu` | maintenant | non |

## Opérations (20)

| Code | Agent | Vu dans la vidéo | Porteur | Phase | Validation |
|---|---|---|---|---|---|
| O01 | [Ouverture de commande](agents/operations/O01-ouverture-de-commande.md) | Project Setup | `gestion-commandes` | avant lancement | non |
| O02 | [Fabricant de produits numériques](agents/operations/O02-fabricant-de-produits-numeriques.md) | Kickoff Builder | `createur-produits-numeriques` | maintenant | oui |
| O03 | [Gardien des délais](agents/operations/O03-gardien-des-delais.md) | Deadline Watcher | `gestion-commandes` | avant lancement | non |
| O04 | [Nouvelles au client](agents/operations/O04-nouvelles-au-client.md) | Client Update Writer | `gestion-commandes` | avant lancement | oui |
| O05 | [Déclencheur de facture](agents/operations/O05-declencheur-de-facture.md) | Invoice Trigger | `gestion-commandes` | avant lancement | non |
| O06 | [Livraison des fichiers](agents/operations/O06-livraison-des-fichiers.md) | - | `developpeur-web` | avant lancement | non |
| O07 | [Contrôle des formules](agents/operations/O07-controle-des-formules.md) | - | `createur-produits-numeriques` | maintenant | non |
| O08 | [Fournisseur de secours](agents/operations/O08-fournisseur-de-secours.md) | - | `sourcing-produits` | maintenant | non |
| O09 | [Incidents de livraison](agents/operations/O09-incidents-de-livraison.md) | - | `gestion-commandes` | avant lancement | oui |
| O10 | [Retours logistiques](agents/operations/O10-retours-logistiques.md) | - | `gestion-commandes` | avant lancement | oui |
| O11 | [Test utilisateur](agents/operations/O11-test-utilisateur.md) | - | `createur-produits-numeriques` | maintenant | non |
| O12 | [Fiche fournisseur](agents/operations/O12-fiche-fournisseur.md) | - | `sourcing-produits` | avant lancement | non |
| O13 | [Versions et mises à jour](agents/operations/O13-versions-et-mises-a-jour.md) | - | `createur-produits-numeriques` | avant lancement | non |
| O14 | [Conformité produit](agents/operations/O14-conformite-produit.md) | - | `conformite-qa` | maintenant | non |
| O15 | [Catalogue à jour](agents/operations/O15-catalogue-a-jour.md) | - | `developpeur-web` | après lancement | oui |
| O16 | [Procédures](agents/operations/O16-procedures.md) | - | `gestion-commandes` | avant lancement | non |
| O17 | [Notice en français](agents/operations/O17-notice-en-francais.md) | - | `redacteur-catalogue` | avant lancement | non |
| O18 | [Pièces manquantes](agents/operations/O18-pieces-manquantes.md) | - | `gestion-commandes` | avant lancement | oui |
| O19 | [Semaine de l'humain](agents/operations/O19-semaine-de-l-humain.md) | - | `cerveau` | maintenant | non |
| O20 | [Périodes de fermeture](agents/operations/O20-periodes-de-fermeture.md) | - | `sourcing-produits` | maintenant | non |

## Intelligence (16)

| Code | Agent | Vu dans la vidéo | Porteur | Phase | Validation |
|---|---|---|---|---|---|
| I01 | [Collecteur de données](agents/intelligence/I01-collecteur-de-donnees.md) | Data Puller | `pilotage-finance` | avant lancement | oui |
| I02 | [Contenu vers chiffre d'affaires](agents/intelligence/I02-contenu-vers-chiffre-d-affaires.md) | Ad-to-Revenue Matcher | `pilotage-finance` | après lancement | non |
| I03 | [Prédicteur de décrochage](agents/intelligence/I03-predicteur-de-decrochage.md) | Churn Predictor | `pilotage-finance` | après lancement | non |
| I04 | [Suivi des concurrents](agents/intelligence/I04-suivi-des-concurrents.md) | Competitor Tracker | `analyste-marche` | maintenant | non |
| I05 | [Page du lundi](agents/intelligence/I05-page-du-lundi.md) | Monday Page | `cerveau` | maintenant | non |
| I06 | [Tableau de bord](agents/intelligence/I06-tableau-de-bord.md) | - | `script` | maintenant | non |
| I07 | [Marge réelle par commande](agents/intelligence/I07-marge-reelle-par-commande.md) | - | `pilotage-finance` | avant lancement | non |
| I08 | [Analyse des avis](agents/intelligence/I08-analyse-des-avis.md) | - | `analyste-marche` | maintenant | non |
| I09 | [Tendances de recherche](agents/intelligence/I09-tendances-de-recherche.md) | - | `analyste-marche` | maintenant | non |
| I10 | [Prévisions](agents/intelligence/I10-previsions.md) | - | `pilotage-finance` | après lancement | non |
| I11 | [Détecteur d'anomalies](agents/intelligence/I11-detecteur-d-anomalies.md) | - | `pilotage-finance` | après lancement | non |
| I12 | [Entonnoir de conversion](agents/intelligence/I12-entonnoir-de-conversion.md) | - | `pilotage-finance` | après lancement | non |
| I13 | [Score des produits](agents/intelligence/I13-score-des-produits.md) | - | `analyste-marche` | après lancement | oui |
| I14 | [Veille des outils gratuits](agents/intelligence/I14-veille-des-outils-gratuits.md) | - | `veille-outils` | maintenant | non |
| I15 | [Gardien du 0 €](agents/intelligence/I15-gardien-du-0.md) | - | `veille-outils` | maintenant | non |
| I16 | [Journal des décisions](agents/intelligence/I16-journal-des-decisions.md) | - | `cerveau` | maintenant | oui |

## Clients (20)

| Code | Agent | Vu dans la vidéo | Porteur | Phase | Validation |
|---|---|---|---|---|---|
| C01 | [Assistant 24 h sur 24](agents/clients/C01-assistant-24-h-sur-24.md) | 24/7 Support Chat | `service-client` | avant lancement | non |
| C02 | [Support par messagerie](agents/clients/C02-support-par-messagerie.md) | Phone Support | `service-client` | avant lancement | oui |
| C03 | [Score de satisfaction client](agents/clients/C03-score-de-satisfaction-client.md) | Health Score | `service-client` | après lancement | non |
| C04 | [Demande d'avis](agents/clients/C04-demande-d-avis.md) | Review Asker | `crm-email` | après lancement | oui |
| C05 | [Repérage de rachat](agents/clients/C05-reperage-de-rachat.md) | Upsell Spotter | `crm-email` | après lancement | oui |
| C06 | [Tri des messages](agents/clients/C06-tri-des-messages.md) | - | `service-client` | avant lancement | non |
| C07 | [Rétractations](agents/clients/C07-retractations.md) | - | `service-client` | avant lancement | oui |
| C08 | [Remboursements](agents/clients/C08-remboursements.md) | - | `service-client` | avant lancement | oui |
| C09 | [Réclamations](agents/clients/C09-reclamations.md) | - | `service-client` | avant lancement | oui |
| C10 | [Réponse aux avis négatifs](agents/clients/C10-reponse-aux-avis-negatifs.md) | Bad review posted | `service-client` | après lancement | oui |
| C11 | [Aide à l'assemblage](agents/clients/C11-aide-a-l-assemblage.md) | - | `service-client` | avant lancement | non |
| C12 | [Pièces de rechange](agents/clients/C12-pieces-de-rechange.md) | - | `service-client` | avant lancement | non |
| C13 | [Bienvenue après achat](agents/clients/C13-bienvenue-apres-achat.md) | - | `crm-email` | avant lancement | oui |
| C14 | [E-mails de suivi](agents/clients/C14-e-mails-de-suivi.md) | - | `crm-email` | avant lancement | non |
| C15 | [Segmentation](agents/clients/C15-segmentation.md) | - | `crm-email` | après lancement | non |
| C16 | [Fidélité](agents/clients/C16-fidelite.md) | - | `crm-email` | après lancement | oui |
| C17 | [Galerie des clients](agents/clients/C17-galerie-des-clients.md) | - | `createur-contenu` | après lancement | oui |
| C18 | [Données personnelles](agents/clients/C18-donnees-personnelles.md) | - | `conformite-qa` | avant lancement | oui |
| C19 | [Passage à l'humain](agents/clients/C19-passage-a-l-humain.md) | Customer wants a person | `service-client` | avant lancement | oui |
| C20 | [Base de connaissances SAV](agents/clients/C20-base-de-connaissances-sav.md) | - | `service-client` | avant lancement | non |

## Back office (18)

| Code | Agent | Vu dans la vidéo | Porteur | Phase | Validation |
|---|---|---|---|---|---|
| A01 | [Émetteur de factures](agents/back-office/A01-emetteur-de-factures.md) | Invoice Sender | `pilotage-finance` | avant lancement | oui |
| A02 | [Rapprochement des paiements](agents/back-office/A02-rapprochement-des-paiements.md) | Payment Matcher | `pilotage-finance` | avant lancement | non |
| A03 | [Relance des impayés](agents/back-office/A03-relance-des-impayes.md) | Collections Reminder | `pilotage-finance` | après lancement | oui |
| A04 | [Recherche d'aide ponctuelle](agents/back-office/A04-recherche-d-aide-ponctuelle.md) | Recruiter | `pilotage-finance` | après lancement | oui |
| A05 | [Déclaration URSSAF](agents/back-office/A05-declaration-urssaf.md) | Payroll Prep | `pilotage-finance` | avant lancement | oui |
| A06 | [Livre des recettes](agents/back-office/A06-livre-des-recettes.md) | - | `script` | avant lancement | non |
| A07 | [Registre des achats](agents/back-office/A07-registre-des-achats.md) | - | `pilotage-finance` | avant lancement | non |
| A08 | [Suivi des dépenses](agents/back-office/A08-suivi-des-depenses.md) | - | `pilotage-finance` | maintenant | non |
| A09 | [Seuils et franchise de TVA](agents/back-office/A09-seuils-et-franchise-de-tva.md) | - | `pilotage-finance` | avant lancement | non |
| A10 | [Frais Stripe](agents/back-office/A10-frais-stripe.md) | - | `pilotage-finance` | avant lancement | non |
| A11 | [CGV et mentions légales](agents/back-office/A11-cgv-et-mentions-legales.md) | - | `conformite-qa` | maintenant | oui |
| A12 | [Registre RGPD](agents/back-office/A12-registre-rgpd.md) | - | `conformite-qa` | avant lancement | non |
| A13 | [Accès et comptes](agents/back-office/A13-acces-et-comptes.md) | - | `humain` | maintenant | oui |
| A14 | [Sauvegardes](agents/back-office/A14-sauvegardes.md) | - | `script` | maintenant | non |
| A15 | [Statut et assurance](agents/back-office/A15-statut-et-assurance.md) | - | `conformite-qa` | avant lancement | oui |
| A16 | [Nom de marque](agents/back-office/A16-nom-de-marque.md) | - | `conformite-qa` | avant lancement | oui |
| A17 | [Échéancier administratif](agents/back-office/A17-echeancier-administratif.md) | - | `pilotage-finance` | avant lancement | non |
| A18 | [Archivage des justificatifs](agents/back-office/A18-archivage-des-justificatifs.md) | - | `pilotage-finance` | avant lancement | non |

## Cerveau de l'entreprise (1)

| Code | Agent | Vu dans la vidéo | Porteur | Phase | Validation |
|---|---|---|---|---|---|
| X01 | [Cerveau de l'entreprise](agents/cerveau/X01-cerveau-de-l-entreprise.md) | The Company Brain | `cerveau` | maintenant | oui |
