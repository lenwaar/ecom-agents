# Brief : le QG 3D de l'équipe Rouage & Laiton

Rédigé par Cowork le 2026-11-13, à la demande de l'humain (inspiré d'une vidéo « Mon QG en 3D · 31 agents IA »).
À placer dans `docs/qg/BRIEF-QG.md`. Claude Code construit, l'humain valide chaque étape sur capture.

## 1. L'idée

Une application 3D **locale** qui montre toute l'équipe d'agents de la boutique comme un vrai QG :
un bâtiment sur une petite île, une pièce par pôle, chaque agent est un personnage qui travaille, se déplace, attend une validation.
On peut se promener, cliquer sur un agent, **discuter** avec lui ou lui **confier une tâche**, ce qui lance une **vraie session Claude Code** sur le dépôt.

Ce n'est pas un jouet : c'est le tableau de bord vivant du projet. Tout ce qui est affiché vient des fichiers réels du dépôt.

Différence avec la vidéo : notre QG est lui-même **une maquette mécanique en bois**, comme nos produits. Bois clair découpé, laiton, engrenages visibles dans les murs qui tournent quand un agent travaille. Le QG devient aussi une vitrine de la marque (et un contenu vidéo sans visage, par simple capture d'écran).

## 2. Identité visuelle

- Couleurs et polices de `knowledge/marque.md` : Nuit `#0A0F1A`, Laiton `#C8A15A`, Laiton foncé `#8A6A3A`, Papier `#FBFAF7` ; Cormorant Garamond pour les titres, Inter pour l'interface.
- Style « low-poly bois » : contreplaqué clair, tranches plus foncées (comme une découpe laser), pièces de laiton. Ciel de nuit étoilé possible en mode nuit.
- Interface façon shadcn/ui : panneaux clairs arrondis, étiquettes sobres, icônes Lucide. **Aucun emoji.**
- Tout est modélisé par le code (formes simples, instanciation). Aucun modèle ou texture téléchargé sans licence vérifiée.

## 3. Le plan du QG

| Pièce | Pôle (codes de `docs/organisation.md`) | Occupants |
|---|---|---|
| Salle du conseil | A · Direction | Cowork (chef d'orchestre), le bureau de l'humain, grande table de réunion |
| Salle des cartes | B · Marché | `analyste-marche` |
| Entrepôt et quai | C · Fournisseurs, logistique | `sourcing-produits`, `gestion-commandes` |
| Atelier web | D · Boutique | `architecte-web`, `developpeur-web` |
| Bibliothèque | E · Catalogue | `redacteur-catalogue` |
| Studio | F · Création | `studio-visuel`, `studio-video`, `createur-contenu` |
| Salle de croissance | G · Acquisition | `media-acquisition` |
| Accueil et courrier | H · Relation client | `service-client`, `crm-email` |
| Coffre | I · Finance | `pilotage-finance` |
| Greffe | J · Conformité | `conformite-qa` |
| Laboratoire | K · Recherche | `veille-outils` |
| Quai des automates | Scripts sans IA | petits automates : `verifier_livrables`, `calcul_marge`, `verifier_stock_prix`, `tableau_de_bord` |
| Communs | | hall d'entrée, couloir central (« la rue des pôles »), salle de pause |

Chaque pièce porte une étiquette avec son nom et son pôle. Les agents ont un prénom affiché en plus de leur nom technique (proposer des prénoms, l'humain choisit).

## 4. L'état en direct (lu dans le dépôt)

Un petit serveur local lit ces fichiers toutes les 10 secondes (ou surveille leurs changements) :

| Source | Ce qu'on en tire |
|---|---|
| `.claude/agents/*.md` | agents installés, description, outils |
| `coordination/a-installer/*.md` | agents pas encore installés (affichés en gris, « arrive bientôt ») |
| `docs/organisation.md` | rôles de chaque agent (codes A01 à K06) |
| `coordination/de-cowork.md` | tâches de la synchro en cours et leur statut |
| `coordination/vers-cowork.md` | dernier compte rendu |
| `outputs/` (en-tête YAML) | derniers livrables par agent et leur statut |
| `git log` | derniers commits |
| sessions lancées par le QG | qui travaille en ce moment |

États d'un agent, visibles sur son étiquette et par son animation :
- **au travail** : une session est en cours (il est à son bureau, les engrenages de la pièce tournent) ;
- **attend ta validation** : il a un livrable au statut `à-valider` (étiquette laiton, il se tient près de la porte) ;
- **au repos** : rien en cours (il se promène, va en salle de pause) ;
- **pas encore installé** : silhouette grise.

## 5. Ce qu'on peut faire

1. **Vue d'ensemble** isométrique, rotation et zoom à la souris ou au doigt.
2. **Cliquer sur une pièce** : la caméra s'y rend ; liste des occupants et des tâches du pôle.
3. **Cliquer sur un agent** : panneau avec ses rôles, ses derniers livrables (lien vers le fichier), ses tâches, et deux onglets :
   - **Discuter** : session Claude Code en **lecture seule** (outils `Read`, `Glob`, `Grep`), pour poser une question à l'agent sur son travail ;
   - **Confier une tâche** : session Claude Code qui **utilise cet agent** et peut écrire dans le dépôt (ses outils déclarés, sans `Bash` ni git), avec confirmation avant lancement.
4. **Réunion** : choisir plusieurs agents, donner un sujet ; une session produit une note commune dans `outputs/`.
5. **Onglets en haut** : Vue d'ensemble, Pôles, Agents, Tâches, Livrables, Automates, Réunion, Journal.
6. **Se promener** (étape finale) : vue à la première personne (flèches ou ZQSD, souris), s'approcher d'un agent pour lui parler.

## 6. Lancer une vraie session Claude Code

- Le serveur écoute **uniquement sur 127.0.0.1**.
- Commande (Windows : `claude.cmd`) lancée à la racine du dépôt :
  `claude -p "Utilise l'agent <nom> : <demande de l'humain>" --output-format stream-json --allowedTools "<outils de l'agent sauf Bash>"`
- La sortie s'affiche en direct dans le panneau (ce que l'agent lit, écrit, conclut).
- Chaque session est enregistrée dans `qg/journal/AAAA-MM-JJ-HHMM-<agent>.md` (demande, outils utilisés, fichiers modifiés, résumé).
- **Une seule session à la fois** (quota Claude Pro), bouton **Arrêter**, compteur des sessions du jour.

## 7. Règles de sécurité (non négociables)

- Le QG ne fait **jamais** de commit, de push, de publication, d'envoi, de paiement ou de commande.
- Aucune session sans clic de l'humain ; confirmation avant toute session qui peut écrire.
- Pas de `Bash` dans les sessions lancées par le QG (donc pas de commande système, pas de git).
- Aucun secret ni clé dans `qg/` ; le journal ne contient aucune donnée client.
- Fonctionne hors ligne (hors sessions Claude) : Three.js et polices installés en local.

## 8. Technique

- Dossier `qg/` : `package.json` (Three.js à la même version que `studio/`), `serveur.js` (Node, sans framework si possible), `public/` (page, scripts en modules, styles).
- Lancement : `cd qg`, `npm install`, `npm start`, puis ouvrir l'adresse affichée.
- Performances : 60 images/s sur un PC portable ; instanciation des objets répétés ; ombres simples.
- Accessibilité : chaque action possible au clavier ; option « réduire les animations ».
- Tests : captures Playwright de chaque étape dans `outputs/qg/`, et un test qui vérifie que le serveur refuse toute connexion hors 127.0.0.1.

## 9. Étapes (une capture validée par l'humain à la fin de chacune)

1. **Questions et maquette** : questions à l'humain une par une (prénoms des agents, jour ou nuit, pièces bonus), puis une maquette 2D vue de dessus du plan. Aucun code 3D avant validation.
2. **Le bâtiment** : île, bâtiment, pièces, étiquettes, agents immobiles. Captures vue d'ensemble et trois pièces.
3. **La vie** : déplacements, animations de travail, engrenages, jour et nuit.
4. **L'état en direct** : serveur, lecture des fichiers, états des agents, onglets Tâches, Livrables, Journal.
5. **Discuter** : sessions en lecture seule.
6. **Confier une tâche** : sessions réelles, journal, sécurité testée.
7. **Réunion et promenade** : première personne, réunion, finitions.

## 10. Prompts dans l'ordre (à coller dans Claude Code)

1. `Lis docs/qg/BRIEF-QG.md. Pose-moi tes questions une par une, puis montre-moi une maquette du plan avant de coder.`
2. `Maquette validée. Fais l'étape 2 du brief et montre-moi les captures.`
3. `Étape 3 du brief, puis captures.`
4. `Étape 4 du brief, puis captures.`
5. `Étape 5 du brief. Teste en demandant à analyste-marche de résumer son dernier rapport.`
6. `Étape 6 du brief. Teste en confiant à redacteur-catalogue une tâche sans risque, puis montre le journal.`
7. `Étape 7 du brief, puis captures et un commit feat(qg): ...`

Après chaque étape : commit, une ligne dans `coordination/vers-cowork.md`, et `python tools/verifier_livrables.py`.
