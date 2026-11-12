# ecom-agents

Une équipe de 12 agents IA (sous-agents Claude Code) qui gère une boutique e-commerce de A à Z : étude de marché, sourcing, catalogue, site, contenu, publicité, emails, commandes, SAV, analyse et conformité légale.

## Comment ça marche
- L'**orchestrateur** reçoit une demande business, la découpe et la délègue aux spécialistes.
- Les agents partagent une **source de vérité** (`knowledge/`) et rendent leurs livrables dans `outputs/`.
- Tout contenu public passe par l'agent **conformité-QA** puis par une validation humaine.

Détails : [`docs/architecture.md`](docs/architecture.md) · Avancement : [`ROADMAP.md`](ROADMAP.md)

## Utilisation
```bash
cd ecom-agents
claude
> /orchestre <ta demande>
```

## Structure
```
.claude/commands/ /orchestre : le chef d'orchestre
.claude/agents/   un fichier par agent spécialiste
knowledge/        marque, niche, persona, politiques
outputs/          livrables produits par les agents
tests/scenarios/  un scénario de test par agent
docs/             architecture, gabarits
```
