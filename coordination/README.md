# Coordination Cowork ↔ Claude Code

Deux Claude travaillent ensemble sur ce projet :

| Qui | Rôle | Où |
|---|---|---|
| **Claude Cowork** | Architecte : conçoit et corrige les agents, vérifie les rapports, prépare les tâches | Application Claude, écrit directement dans ce dossier |
| **Claude Code** | Exécutant : lance les agents, fait les commits et les push | Terminal VS Code |
| **Toi** | Direction : décisions, envois, paiements | Partout |

## Le cycle
1. Cowork écrit les tâches dans `de-cowork.md`.
2. Tu tapes **`/cowork`** dans Claude Code : il exécute, commit, push, et écrit son compte rendu dans `vers-cowork.md`.
3. Tu dis à Cowork « synchro faite » : il lit le compte rendu et prépare la suite.

Tout ce qui demande ton intervention est marqué **🔔 ACTION HUMAINE**.
