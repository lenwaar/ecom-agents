# Tâches de Claude Cowork pour Claude Code

Statuts : `à faire` · `fait` · `bloqué (raison)`

## T1 · Mettre en place la coordination · `fait`
- Copie `coordination/cowork-command.md` vers `.claude/commands/cowork.md` (Cowork ne peut pas écrire dans `.claude/`), puis supprime `coordination/cowork-command.md`.
- Désormais, toute modification d'un fichier dans `.claude/` demandée par Cowork se fera via une tâche ici, avec le contenu exact.
- Ajoute une ligne dans `README.md` (section Structure) : `coordination/     échanges entre Claude Cowork et Claude Code (/cowork)`.

## T2 · Enregistrer les rapports · `fait` (déjà commité : 0c9188e)
- Vérifie que `outputs/2026-11-12-sourcing-produits-maquettes-bois-v2.md` est commité ; sinon, ajoute-le.

## T3 · Mettre à jour la feuille de route · `fait`
Dans `ROADMAP.md`, phase 1 :
- coche `sourcing-produits` avec la mention : `v1.3 (UE, 14 j, marge 10 €, stock 100, note 4,5/5) : aucun produit validé, piste revendeur officiel en cours`
- ajoute : `- [ ] Réponse des fournisseurs officiels (remise revendeur, dropshipping, photos, responsable UE)`
- ajoute : `- [ ] Statut micro-entreprise (obligatoire avant la première vente et pour ouvrir un compte revendeur)`

## T4 · Commit et push · `fait`
Commit `chore(coordination): mise en place de /cowork + feuille de route`, puis push.
