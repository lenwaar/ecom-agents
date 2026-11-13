---
agent: developpeur-web
statut: validé   # toujours cette valeur
valide_par: humain
date_validation: 2026-11-13
date: 2026-11-13
sources: [coordination/de-cowork.md (T57), outputs/2026-11-13-developpeur-web-studio-en-direct.md, docs/studio/BRIEF-STUDIO-DIRECT.md, tools/journal_claude.py, coordination/journal-direct.jsonl (lu seulement)]
prochaine-etape: conformite-qa (audit du studio) puis validation humaine
---

# Studio en direct : corrections T57 (synchro n°14)

## 1. Résumé

Les 4 corrections demandées sont faites et testées. `npm test` passe : **22 tests sur 22**, dont 11 nouveaux pour T57 (au moins un par point). Tous les tests travaillent dans des dossiers temporaires : un journal factice, de faux livrables et un dossier de coordination de test. Aucun vrai livrable n'est lu ni modifié. L'ancien test copiait le vrai journal ; il utilise maintenant un journal factice.

Le studio déjà ouvert sur le PC (`npm start`, port 4178) tourne encore avec l'ancien code. Il faut le relancer pour voir les corrections.

## 2. Ce qui a changé (aucun commit, à la demande de Claude Code)

| Point | Correction | Fichiers |
|---|---|---|
| 1. « Attend ton accord » | La lecture de l'en-tête est regroupée dans `livrables.js`. Sont reconnus : `à-valider` suivi d'un commentaire (avec ou sans espace avant `#`), entre guillemets, avec un « à » décomposé (NFD), un fichier avec BOM, des fins de ligne CRLF. Le même code sert à l'indicateur, à la colonne « À valider » et à l'état « attend ta validation ». Le bouton Valider garde le commentaire (`statut: validé   # …`). | `qg/studio/livrables.js` (nouveau), `qg/studio/serveur.js` |
| 2. Journal lisible | La page traduit chaque événement en phrase courte : « Théo lit le brief du studio », « Théo lance un rendu », « Margaux a terminé », « Tu as lancé la synchro avec Cowork », « Claude Code attend ton autorisation ». Les messages automatiques (`<task-notification>`, `<agent-message>`, `<system-reminder>`, balises de commandes) et les outils inconnus (TodoWrite, outils MCP) sont masqués. Les commandes shell et les chemins ne sont jamais affichés. Un dernier contrôle (`propre()`) masque toute phrase qui contiendrait encore une balise, un chemin ou du code. Les statuts des postes utilisent les mêmes phrases. Le JSONL reste brut. | `qg/studio/public/direct.js`, `qg/studio/public/app.js` |
| 3. Cowork au travail | Le serveur surveille `coordination/` (sous-dossiers compris, sauf `journal-direct.*`). Un fichier qui arrive ou change met Cowork au travail (« écrit les consignes de la synchro », « prépare la prochaine synchro », « dépose un fichier à installer »), sauf si le journal montre une écriture de Claude Code sur ce fichier : Write ou Edit, ou une commande Bash qui écrit (de 5 s avant à 3 min après). La décision attend 2,5 s, le temps que le hook écrive dans le journal. Cowork repasse au repos après 10 minutes sans nouveau fichier, ou quand Claude Code commence la synchro (demande `/cowork` ou contenant « synchro », lecture de `de-cowork.md` ou de `prochaine-synchro/`). | `qg/studio/cowork.js` (nouveau), `qg/studio/serveur.js`, `direct.js`, `app.js` |
| 4. `agent_id` | `tools/journal_claude.py` écrit un champ `agent_id` dans le JSONL : l'agent lancé au lancement (lu dans `tool_response.agentId`, format vérifié sur une vraie transcription : `{"isAsync":true,"status":"async_launched","agentId":"a00b…"}`), l'agent qui s'arrête à l'arrêt, sinon l'agent qui agit. Les autres champs et le journal `.md` ne changent pas. Le studio retrouve l'agent d'un `SubagentStop` par son identifiant. Un identifiant inconnu ne touche aucun poste. Sans identifiant (anciennes lignes), la page reprend l'ancienne logique. Un agent lancé au premier plan (son lancement est journalisé après sa fin) ne repasse pas au travail. | `tools/journal_claude.py`, `qg/studio/public/direct.js` |

Tests ajoutés : `tests/livrables.test.js` (point 1), `tests/direct.test.js` (points 2 et 4, 5 tests), `tests/cowork.test.js` (point 3), `tests/journal.test.js` (point 4 : le hook Python tourne avec `JOURNAL_DIRECT_DOSSIER` pointé sur un dossier temporaire). `tests/studio.test.js` vérifie les 4 points dans Chromium.

Documentation : section « Lancement » de `docs/studio/BRIEF-STUDIO-DIRECT.md`. Elle ajoute les variables `STUDIO_COORDINATION` et `JOURNAL_DIRECT_DOSSIER`, le champ `agent_id` et la nouvelle description des tests.

## 3. Écarts et points à connaître

- **Point 1** : sur le code de T53, une ligne `statut: à-valider   # …` était déjà comptée. Le test T53 le vérifiait, et les 20 livrables validés par l'humain avaient bien cette forme. Je n'ai pas pu reproduire l'erreur exacte vue par Cowork. Les cas qui échouaient vraiment étaient le BOM, les guillemets et le « à » décomposé ; ils sont corrigés et testés. Si Cowork a un fichier précis qui n'était pas compté, il faut le tester avec la nouvelle version.
- **Point 2** : quand le type de commande n'est pas reconnu, la phrase est générique (« lance une commande »). Sur le vrai journal (358 lignes au moment du contrôle), 9 commandes Bash sur 176 tombent dans ce cas, et 5 messages automatiques sont masqués.
- **Point 3** : la frontière entre Cowork et Claude Code repose sur le texte du journal. Le hook coupe une commande Bash à 160 caractères : si le nom du fichier est au-delà, l'écriture peut être attribuée à tort à Cowork. Une commande qui cite le fichier et contient un mot d'écriture (`>`, `cp`, `py`…) sans l'écrire masque Cowork. Le délai de 10 minutes est mon choix (« délai raisonnable »), à confirmer.
- **Point 4** : l'arrêt journalise maintenant le dernier message de l'agent lui-même (`agent_transcript_path`), et non celui de la session principale (c'était une erreur visible dans le journal : « AGENT TERMINÉ · » suivi du message de Claude Code). La forme de la ligne `.md` ne change pas. Le vrai journal contient une ligne JSON coupée, issue de deux écritures simultanées ; le serveur l'ignore déjà.

## 4. Vérifications faites

- `npm test` dans `qg/studio` : 22 tests, 22 réussis, 0 échec.
- Traduction du vrai `coordination/journal-direct.jsonl` (lecture seule) : aucune phrase avec balise, commande ou chemin.
- Captures dans `outputs/qg/` : `studio-direct-t57.png` (Cowork au travail sur « Écrit les consignes de la synchro », Iris « Lance un rendu », journal en phrases) et les captures finales régénérées (`studio-direct-final-ordinateur.png`, `studio-direct-final-mobile.png`).
- Un seul navigateur de test à la fois. Le serveur de test (port 4191) et Chromium sont arrêtés à la fin. Je n'ai pas arrêté les serveurs que je n'avais pas lancés (`npm start` du studio sur 4178, `astro dev` du site).

## 5. Voir le studio en local

```
cd qg/studio
npm start
```

Puis ouvrir http://127.0.0.1:4178/. Si le studio tourne déjà, l'arrêter (`Ctrl+C`) et le relancer pour charger T57. Tests : `cd qg/studio`, `npm install`, `npm test`.

## 6. Ce qui demande l'humain

- Relancer le studio pour charger les corrections.
- Le nouveau hook (`agent_id`) est pris en compte au prochain événement, sans redémarrage. Les lignes déjà écrites n'ont pas d'`agent_id` : la page utilise l'ancienne logique pour elles.
- Confirmer le délai de 10 minutes avant que Cowork repasse au repos.
