# L'entreprise : 137 agents, un Cerveau

Architecture reprise de la vidéo « 137 AI agents that run your entire company » (ReStructure AI), adaptée à la boutique de maquettes en bois en dropshipping, **à 0 €** : sous-agents Claude Code, fichiers Markdown, SQLite et outils gratuits. Aucune API payante, aucun abonnement.

## La carte

```
 SOURCES (signaux)          VOUS : RÈGLES UNE FOIS            CONNAISSANCES
 site, TikTok, Instagram,   knowledge/ + decisions.md         knowledge/ (marque, niche,
 Pinterest, Stripe,         (vous seul validez)               politiques, prix, persona...)
 AliExpress, e-mails
          │                          │                                 │
          ▼                          ▼                                 ▼
 SYSTÈME DE RÉFÉRENCE  ───►  ┌──────────────────────────────┐  ◄── entreprise/catalogue.md
 donnees/entreprise.db       │   LE CERVEAU (X01, cerveau)  │      (qui fait quoi)
 prospects, clients,         │   aiguillage + mémoire       │
 commandes, argent,          └──────────────┬───────────────┘
 validations...                             │
   ┌──────────┬───────────┬──────────┬──────┴─────┬─────────────┬───────────┬─────────────┐
   ▼          ▼           ▼          ▼            ▼             ▼           ▼
 VENTES    OFFRES ET    MARKETING  OPÉRATIONS  INTELLIGENCE   CLIENTS    BACK OFFICE
 22 (V)    PARTENARIATS 22 (M)     20 (O)      16 (I)         20 (C)     18 (A)
           18 (P)
   └──────────┴───────────┴──────────┴────────────┴─────────────┴───────────┘
                                    │
          ┌─────────────────────────┼──────────────────────────────┐
          ▼                         ▼                              ▼
 CE QUI INTERROMPT LA BOUCLE   VALIDATION HUMAINE            PAGE DU LUNDI (I05)
 entreprise/interruptions.md   table validations             /lundi, 8 h
                               (vous approuvez)              chiffres, argent, risques,
                                                             en attente de vous
```

22 + 18 + 22 + 20 + 16 + 20 + 18 + 1 Cerveau = **137 agents**.

## Comment c'est construit

| Élément de la vidéo | Ici | Coût |
|---|---|---|
| 137 agents | 137 fiches dans `entreprise/agents/<département>/`, générées depuis `entreprise/catalogue.py` | 0 € |
| Agents qui tournent | 18 sous-agents Claude Code portent les fiches (au-delà de 20-25 sous-agents, Claude Code choisit mal) + scripts sans IA + l'humain | 0 € |
| The Company Brain | sous-agent `cerveau` + `knowledge/` + `entreprise/` | 0 € |
| leads.db, customers.db, projects.db, money.db | une base SQLite : `donnees/entreprise.db` (schéma `donnees/schema.sql`) | 0 € |
| Serveurs de signaux, de rendu, d'agents | exports natifs saisis dans `signaux` ; HyperFrames + Piper pour le rendu ; `journal_agents` + git pour les traces | 0 € |
| HubSpot, n8n, ElevenLabs, Higgsfield, Zendesk, QuickBooks | remplacés par la base SQLite, les sous-agents, Piper, HyperFrames, Brevo gratuit et Stripe | 0 € |
| Human handoff (Slack, Telegram) | table `validations` + page du lundi ; Telegram plus tard sur votre accord | 0 € |
| Monday page | `python tools/page_lundi.py` ou `/lundi` | 0 € |

Les 35 agents nommés dans la vidéo (5 par département) sont tous présents, adaptés : par exemple « 60-Second Caller » devient V02 « Réponse en 60 secondes » (un message plutôt qu'un appel), « Payroll Prep » devient A05 « Déclaration URSSAF » (micro-entreprise sans salarié). Les 102 autres sont propres à une boutique en dropshipping.

## S'en servir

| Je veux... | Commande |
|---|---|
| Faire travailler un agent précis | `/agent V02 répondre aux commentaires d'hier` |
| Voir ma page du lundi | `/lundi` |
| Voir les chiffres tout de suite | `python tools/base.py statut` |
| Voir ce qui attend ma décision | `python tools/base.py attente` |
| Approuver ou refuser | `python tools/base.py valider 3 oui` |
| Créer la base la première fois | `python tools/base.py init` |
| Tester avec des données fictives | `python tools/page_lundi.py --exemple` |
| Ajouter ou modifier un agent | éditer `entreprise/catalogue.py`, puis `python tools/generer_entreprise.py` |
| Grand projet multi-départements | `/orchestre <demande>` (inchangé) |

## Phases

Chaque fiche a une phase : **maintenant** (pendant la construction), **avant lancement** (à activer avant la première vente), **après lancement** (quand il y a des commandes ou un budget). Une fiche « avant » ou « après » existe déjà, elle attend juste son moment.

## Scripts sans IA

| Script | Fiches | État |
|---|---|---|
| `tools/base.py` | I06, A06, A14, file des validations | fait |
| `tools/page_lundi.py` | I05 | fait |
| `tools/generer_entreprise.py` | catalogue | fait |
| `tools/verifier_stock_prix.py` | O07 | à créer (API fournisseur officielle seulement) |
| `tools/delais_reels.py` | O13 | à créer après les premières livraisons |

## Règles qui ne changent pas

Rien n'est publié, envoyé, payé, remboursé ou commandé sans votre accord. Aucun chiffre inventé. La base de données ne va jamais dans Git (données clients).
