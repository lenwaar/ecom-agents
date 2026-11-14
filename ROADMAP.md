# Feuille de route

## Phase 0 : Fondations ✅
- [x] Architecture et organigramme (`docs/architecture.md`)
- [x] Règles communes (`CLAUDE.md`) et gabarit d'agent
- [x] Orchestrateur (commande `/orchestre`)
- [x] Dépôt GitHub créé
- [ ] Dépôt connecté à Graphify

## Phase 1 : Stratégie (définir QUOI vendre) 🔄 en cours
- [x] `analyste-marche` v1.1 + test (validé : 3 études, niche choisie)
- [x] `sourcing-produits` + test, v1.3 (UE, 14 j, marge 10 €, stock 100, note 4,5/5) : aucun produit validé, piste revendeur officiel en cours
- [x] sourcing-produits v1.4 (corrections de l'audit conformite-qa)
- [x] `knowledge/niche.md` : maquettes en bois pour adultes
- [ ] Valider knowledge/prix-et-marges.md et knowledge/politiques.md
- [ ] Réponse des fournisseurs officiels (remise revendeur, dropshipping, photos, responsable UE)
- [ ] Statut micro-entreprise (obligatoire avant la première vente et pour ouvrir un compte revendeur)
- [ ] `knowledge/persona.md`, `marque.md`, `prix-et-marges.md`

## Phase 2 : Contrôle qualité
- [x] `conformite-qa` + test (à lancer et valider)

## Phase 3 : Boutique
- [x] Choix de la plateforme gratuite : site maison Astro + Cloudflare + Stripe
- [x] architecte-web + test (à lancer)
- [x] developpeur-web + test (à lancer après architecte-web)
- [ ] redacteur-catalogue (quand les produits seront choisis)

## Phase 4 : Marketing
- [ ] `createur-contenu`, `crm-email`, `media-acquisition`

## Phase 5 : Opérations et pilotage
- [ ] `gestion-commandes`, `service-client`, `analyste-performance`

## Phase 5 bis : Entreprise à 137 agents
- [x] 137 fiches d'agents en 7 départements + Cerveau (`entreprise/`)
- [x] Sous-agents `ventes`, `partenariats`, `cerveau` + tests
- [x] Base SQLite `donnees/entreprise.db`, file des validations, page du lundi
- [ ] Lancer les 3 tests (`tests/scenarios/ventes.md`, `partenariats.md`, `cerveau.md`) après redémarrage de Claude Code
- [ ] `tools/verifier_stock_prix.py` (O07) et `tools/delais_reels.py` (O13)
- [ ] Planifier `/lundi` chaque lundi à 8 h

## Phase 6 : Autonomie
- [ ] Tâches planifiées (rapport hebdo, veille)
- [ ] Portage des agents clés en Claude Agent SDK
