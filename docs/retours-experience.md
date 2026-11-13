# Retours d'expérience de l'équipe

Leçons tirées des synchros, à appliquer par **tous les agents et par Claude Code**. On ajoute une ligne à chaque fois qu'une erreur est corrigée, pour ne jamais la refaire.

| # | Leçon | D'où elle vient |
|---|---|---|
| 1 | Un livrable de plus de 40 Ko s'écrit **en plusieurs fois** (création puis ajouts). Un seul très gros fichier bloque l'agent. | Blocage de l'architecte (synchro n°7) |
| 2 | Un gros fichier se **lit par tranches**, jamais d'un coup. | Blocage de l'audit (synchro n°7) |
| 3 | Un agent installé ou modifié n'est chargé **qu'au redémarrage** de Claude Code. | Synchro n°2 |
| 4 | La marge nette inclut **toujours** les cotisations micro-entreprise (12,3 %) et l'éco-participation. | Audit du sourcing v2 |
| 5 | Les taxes d'import (3 € + 2 €) se comptent **par catégorie d'article**, pas par colis. | Audit du sourcing v2 |
| 6 | Une niche doit être **tournable par l'humain** (ressources pour filmer) avant d'être notée. | Analyste-marche v1 (chat d'appartement) |
| 7 | Mesurer la **demande d'achat**, pas la taille d'une population ; vérifier Google Trends avec des mots-clés produit. | Analyste-marche v1 et capture du padel |
| 8 | Un fournisseur de marketplace ne peut **ni prouver l'authenticité ni autoriser l'usage de photos de marque**. | Audit du sourcing v2 |
| 9 | Ne jamais réécrire `coordination/de-cowork.md` depuis une copie ancienne : **relire le fichier juste avant** de mettre à jour un statut. | Décisions de Cowork perdues (synchro n°8) |
| 10 | Les valeurs `À VÉRIFIER` d'un produit de démonstration sont **masquées** sur le site ; sur un vrai produit, elles **bloquent** la mise en ligne. | Fiches de démonstration (synchro n°8) |
| 11 | Un rendu 3D ne remplace **jamais** la photo d'un produit réellement vendu ; mention « Rendus 3D de démonstration » visible. | Règles studio-visuel et vidéos |
| 12 | Lancer `python tools/verifier_livrables.py` **avant chaque commit** : 0 erreur exigée. | Mis en place par Cowork |
