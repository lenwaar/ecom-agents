---
description: Page du lundi : chiffres de la semaine, d'où vient l'argent, ce qui est à risque, ce qui attend votre décision
---

Lance le sous-agent `cerveau` avec cette demande :

1. Si `donnees/entreprise.db` n'existe pas, lance `python tools/base.py init`.
2. Lance `python tools/page_lundi.py`.
3. Lis les livrables de `outputs/` des 7 derniers jours et complète la section « À faire ensuite » (3 actions maximum, chacune avec son code de fiche et son porteur).
4. Restitue à l'humain la page en moins de 15 lignes, puis la liste « En attente de vous » avec la commande pour décider : `python tools/base.py valider <n°> oui|non`.
