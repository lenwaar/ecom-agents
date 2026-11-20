---
agent: developpeur-web
statut: à-valider
date: 2026-11-20
sources: [entreprise/catalogue.py, entreprise/README.md, .claude/commands/marketing.md, .claude/commands/lundi.md, marketing/calendrier.md, qg/studio/boutique.js, tools/page_lundi.py, .gitignore]
prochaine-etape: conformite-qa
---

# Boucle marketing avec validation (V2-3, synchro n°18)

## Résumé
La boucle Recherche → Contenu → Publication → Boucle tourne avec les agents existants (aucun nouvel agent). Le QG a une page `/marketing` : une file « à valider » (posts, légendes, e-mails) avec Valider / Refuser, qui changent **seulement un statut local** ; rien n'est publié ni envoyé, c'est écrit à l'écran. Le suivi des revenus par post relie un post à des **références de commandes réelles** ; la page du lundi a un bloc « Marketing ». Tout est vide aujourd'hui : aucun chiffre affiché, aucun inventé.

## Les 4 étapes et les agents déjà présents

| Étape | Fiches (code) | Sous-agents | Ce qui existe |
|---|---|---|---|
| 1. Recherche | M01, M02, M14, I04, I14 | analyste-marche, media-acquisition, createur-contenu, veille-outils | `/marketing` étape 1 (1 page de tendances) |
| 2. Contenu | M06, M07, M08, M11, M12, M17 · M03, M09, M13 · M10, M19 · M15 · M16 · contrôle M20 | createur-contenu · studio-video · studio-visuel · redacteur-catalogue · crm-email · conformite-qa | `marketing/calendrier.md`, scripts `à-valider` ; **nouveau** : dépôt dans `data/file-marketing.json` |
| 3. Publication | M03, M11, M16, M21 (« l'humain publie / envoie ») ; M04, M05 après lancement | humain seul ; media-acquisition (pubs, plus tard) | **nouveau** : page `/marketing`, Valider / Refuser, publication manuelle |
| 4. Boucle | M22 (bloc Marketing du lundi), I02, I01, M18, M17, I05 | createur-contenu, pilotage-finance, media-acquisition, cerveau | **nouveau** : `data/posts.json` + bloc 5 de la page du lundi |

## Ce qui a été fait
- **Source de la file** : `data/file-marketing.json` (hors Git, statuts locaux). Repli sur `data/file-marketing.vide.json` ; format fictif dans `data/file-marketing.exemple.json` (jamais lu). Format documenté en tête de `qg/studio/marketing.js`. `/marketing` dit aux agents d'y déposer leurs contenus.
- **Page `/marketing`** du QG (lien ajouté dans la navigation des 4 autres pages) ; API `GET /api/marketing`, `POST /api/marketing/decision` (même origine, JSON, statut `à-valider` seulement, élément d'exemple refusé, écriture protégée). Aucun appel réseau sortant.
- **Revenus par post** : `data/posts.json` (hors Git, comme `commandes.json`), repli `posts.vide.json`, exemple `posts.exemple.json`. CA TTC et marge nette calculés par `boutique.js` sur les seules commandes réelles citées ; référence inconnue ou d'exemple jamais comptée (avertissement) ; commande citée deux fois comptée une fois au total. Exemples affichés à part, badge « exemple ».
- **Page du lundi** (`tools/page_lundi.py`, bloc 5 « Ce qui a marché / Ce qui part ensuite ») ; `docs/exemples/page-du-lundi.md` régénéré.
- **Tests** : `qg/studio/tests/marketing.test.js` (calcul, séparation exemple/réel, fichiers hors Git, décision, écriture impossible, sécurité de l'API, concordance avec le Python, navigateur mobile).

## Manques (à décider ou à confier)
1. **Aucun compte de réseau social relié** : pas de vues ni de clics, M22 ne lit que les ventes. Publication et statistiques restent manuelles.
2. **Attribution post → commande manuelle** : aucun lien UTM ni métadonnée Stripe ne porte l'identifiant du post (I02, après lancement). Convention à choisir.
3. **Fiches des agents pas encore mises à jour** : createur-contenu et crm-email ne mentionnent pas `data/file-marketing.json` (seule la commande `/marketing` le fait).
4. **Aucun outil d'envoi d'e-mail** (M16, Brevo gratuit envisagé) ; **calendrier éditorial vide** ; **pas de pub** (M04, M05, M18 après lancement).
5. Le statut `publié` n'existe pas dans la file : l'humain l'indique en ajoutant le post à `data/posts.json`.

## Vérifications
`npm test` dans `qg/studio` : 63 tests, 63 réussis, 0 échec (dont 12 nouveaux). `py tools/verifier_livrables.py` : 0 erreur. Lancer en local : `cd qg/studio && npm start`, puis `http://127.0.0.1:4178/marketing`.

## Ce qui demande l'humain
Valider ce rapport après `conformite-qa` ; choisir la convention d'attribution (point 2) ; publier soi-même tout contenu validé.
