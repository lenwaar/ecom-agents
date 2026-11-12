# Comptes rendus de Claude Code (le plus récent en haut)

## 2026-11-12 11:15 · Synchro n°2

**Tâches faites** : T5 à T10 (toutes `fait`).
- T5 : `coordination/a-installer/conformite-qa.md` copié vers `.claude/agents/conformite-qa.md` (copie identique vérifiée), dossier `a-installer/` supprimé.
- T6 : `knowledge/niche.md` (tes modifications) et `tests/scenarios/conformite-qa.md` commités tels quels ; `ROADMAP.md` phase 2 : `conformite-qa` coché « + test (à lancer et valider) ».
- T7 : commit `7f2c968` feat(agent): conformite-qa + décisions marques et électronique, poussé.
- T8 : test 1 lancé avec la demande exacte. ⚠️ **Exécuté par l'agent généraliste** qui suivait `.claude/agents/conformite-qa.md` à la lettre : l'agent, installé en cours de session, n'était pas encore chargé. Résultat proche mais pas un test strict de l'agent : à relancer si tu veux une validation stricte.
- T9 : test 2 lancé avec la demande exacte, **par le vrai agent `conformite-qa`** (chargé entre-temps). Rapport audité vérifié intact (`git diff` vide).
- T10 : commit `d645a53` docs(outputs): conformite-qa dossier lancement légal + audit sourcing v2, poussé. Grille de test non cochée.

**Fichiers modifiés** : `.claude/agents/conformite-qa.md` (nouveau), `knowledge/niche.md`, `tests/scenarios/conformite-qa.md`, `ROADMAP.md`, `coordination/`, 2 rapports dans `outputs/`.

**Rapport 1 (dossier)** : `outputs/2026-11-12-conformite-qa-dossier-vente-legale-maquettes-bois.md`
- Micro-entreprise de vente de marchandises : inscription gratuite (formalites.entreprises.gouv.fr), cotisations 12,3 % du CA (13,3 % avec versement libératoire), plafond 203 100 €, formulaire CFE 1447-C-SD avant le 31/12.
- TVA : franchise en base 85 000 € (seuil majoré 93 500 €) ; le seuil unique de 25 000 € a été abandonné.
- Pages : mentions légales, CGV, confidentialité, cookies (« Tout refuser » aussi visible), rétractation avec **bouton en ligne obligatoire depuis le 19/06/2026**, médiateur ; retirer le lien vers la plateforme européenne de litiges (fermée).
- GPSR : fabricant, responsable UE, photo, référence, avertissements en français sur chaque fiche. **Recyclage : les maquettes relèvent de la filière jouets (R543-320) même en 14+** → 2 adhésions payantes (Ecomaison + Citeo/Léko), IDU, Triman.
- Limites : articles GPSR cités d'après extraits (EUR-Lex illisible), coût Citeo (110 € HT/an), Ecomaison et médiateur `À VÉRIFIER`. Proposition de `knowledge/politiques.md` en section 5.

**Rapport 2 (audit)** : `outputs/2026-11-12-conformite-qa-audit-sourcing-maquettes-bois-v2.md`, verdict **BLOQUANT** (2 ⛔, 11 ⚠️, 5 ✅, 4 sans objet).
- ⛔ n°1, 3, 4 éliminés : électronique (contraire au nouveau `niche.md`) et canal non officiel (vendeurs AliExpress, épuisement des droits L713-4 CPI non prouvé).
- Reste le circuit à billes n°2 sous 4 conditions : preuve écrite 14+, positionnement adulte, infos GPSR, absence de copie.
- **Marge** : la formule oublie les cotisations micro (12,3 %) et l'éco-participation. Avec cotisations, le n°2 à 26,90 € tombe à 8,95 € (recompté : 12,26 − 3,31) → prix minimal 28,90 € (fournisseur principal), 29,90 € (secours).
- Autres ⚠️ : taxes d'import par catégorie d'article et non par colis ; règle du prix barré à réécrire (prix le plus bas des 30 jours, L112-1-1) ; photos de marque non autorisables par un vendeur AliExpress ; mention « authentique » non prouvée ; brouillon A à corriger (statut de revendeur agréé, responsable UE, recyclage, modèles sans électronique uniquement).

**Remarques pour Cowork** :
- L'agent `sourcing-produits` ne connaît ni les cotisations micro ni l'éco-participation dans sa formule de marge, ni la règle « taxes par catégorie d'article » : correction de l'agent à prévoir (via une tâche ici, puisque `.claude/` passe par moi).
- La section 3 de la grille d'audit dit « Aucune électronique (décision de `niche.md`) » : cohérent.

**🔔 ACTION HUMAINE**
1. Décider : demander une **v3 à `sourcing-produits`** avec les corrections de l'audit (après correction de l'agent par Cowork), puis un nouvel audit.
2. Décider : envoyer ou non le **brouillon A corrigé** à Robotime Europe (seule piste « marque » compatible avec `niche.md`). Rien n'a été envoyé.
3. Choisir **option A ou B** (dropshipping ou stock léger) : ça décide qui adhère aux filières de recyclage et ton rôle GPSR (distributeur ou importateur).
4. Fixer la **date de création de la micro-entreprise** (avant toute vente, idéalement avant juin 2027) ; décider versement libératoire, ACRE, non-publication de l'adresse.
5. Prévoir dans le budget de 150 à 500 € : adhésion emballages (environ 110 € HT/an, `À VÉRIFIER`), Ecomaison, médiateur.
6. Rendez-vous **expert-comptable / CCI / Urssaf** et questions à un **juriste** (revente de marque, copie, statut importateur, risque de requalification en jouet) et aux **éco-organismes** (qui doit adhérer).
7. Valider la proposition de `knowledge/politiques.md` (section 5 du dossier).

## 2026-11-12 10:55 · Synchro n°1

**Tâches faites** : T1, T2, T3, T4 (toutes `fait`).
- T1 : `coordination/cowork-command.md` copié vers `.claude/commands/cowork.md` (copie identique vérifiée), puis supprimé. Ligne `coordination/` ajoutée dans la section Structure de `README.md`.
- T2 : le rapport v2 était déjà commité (`0c9188e`), rien à ajouter.
- T3 : `ROADMAP.md`, phase 1 : ligne `sourcing-produits` mise à jour, 2 cases ajoutées (réponse des fournisseurs officiels, statut micro-entreprise).
- T4 : commit `chore(coordination): mise en place de /cowork + feuille de route`, poussé sur `origin/main`.

**Fichiers modifiés** : `.claude/commands/cowork.md` (nouveau), `coordination/` (ajouté au dépôt, `cowork-command.md` retiré), `README.md`, `ROADMAP.md`.

**Commits poussés plus tôt aujourd'hui (hors tâches Cowork, à la demande de l'humain)** :
- `0a4b36c` fix(agent): sourcing-produits v1.3 (UE en priorité, 14 jours max, marge 10 €, stock 100, note 4,5/5). Règles v1.1 à v1.3 reportées à la main, car le patch v1.1 était introuvable.
- `b247815` docs(knowledge): budget de lancement 150-500 €, option stock léger. Lignes Modèle, Budget et Échantillons de `contraintes.md` ; calcul option B (stock léger, mise de départ ≤ 500 €) ajouté dans l'agent.
- `0c9188e` docs(outputs): sourcing maquettes bois v2 (règles v1.3).

**Rapport d'agent** : `outputs/2026-11-12-sourcing-produits-maquettes-bois-v2.md`
- Aucun produit validé avec les règles v1.3. 4 produits « en sursis » (marge ≥ 10 € sur le papier, vérifications en attente). Confiance faible.
- 3 des 4 sont des produits authentiques de la marque leader (électronique, revente au prix officiel) : en conflit avec le garde-fou « aucun nom de marque » et « sans électronique de préférence ».
- Le seul générique sans électronique : circuit à billes en spirale (achat 7,19 €, vente 26,90 €, marge 12,26 € taxes comprises). Expédié de Chine probablement, donc délai ≤ 14 j `À VÉRIFIER`.
- Piste la plus sérieuse : site B2B européen de la marque leader. Pas de minimum de commande, mais port de 60 € sous 1 000 € de commande et remise revendeur inconnue (il faudrait environ 23 à 25 %).
- Calculé **avant** la décision « option B stock léger » : l'option B n'est pas chiffrée dans ce rapport.

**Remarques pour Cowork** :
- Le brouillon de message au fabricant (section 9-A du rapport v2) ne pose que des questions sur le dropshipping. Il faudrait ajouter : port pour 10 à 15 unités, conditions de paiement, remise dès cette quantité.
- Le rapport v2 n'est pas encore passé par `conformite-qa` (agent pas encore créé, phase 2).

**🔔 ACTION HUMAINE**
1. Décider : produits de marque authentiques (vendre en citant la marque, sans la citer, ou refuser) et électronique avec marquage CE vérifié (oui/non).
2. Valider ou modifier le brouillon de message au fabricant (avec ou sans les questions sur l'option B), puis l'envoyer toi-même si tu le décides.
3. Faire les vérifications navigateur de la section 8 du rapport v2 (environ 30 min, surtout pour le circuit à billes).
4. Démarches micro-entreprise (statut TVA : toutes les marges en dépendent).
5. Valider la proposition de `knowledge/prix-et-marges.md` (section 7 du rapport v2).
