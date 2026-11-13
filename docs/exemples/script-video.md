# Voix off · « De la planche à l'objet » (20 s, boîte à musique à manivelle)

Source : `medias/voix-off-promo-v2.md`, adapté au storyboard de la vidéo (rapport `outputs/2026-11-13-studio-video-de-la-planche-a-l-objet.md`). Aucun chiffre, aucune promesse ajoutés.
Voix : synthèse locale Piper, voix `fr_FR-siwis-medium` (CC BY 4.0, crédit obligatoire : voir `medias/licences.md`), vitesse `--length-scale 1.08`.
Statut : `à-valider` (texte et voix à écouter par l'humain). Mis à jour le 2026-11-13 (T56, synchro n°14) : dernière réplique et temps des mots.

| Départ | Plan | Texte dit | Origine dans la v2 |
|---|---|---|---|
| 0,20 s | Accroche (titre) | « De la planche… à l'objet. » | ligne 10,4 – 13,6 s, reprise telle quelle |
| 2,25 s | Les planches | « Ça, c'est ce qu'il y a dans la boîte. » | adapté de « Ça, c'est ce que vous recevez. » (le produit de démonstration n'est pas vendu : on ne promet pas un envoi) |
| 4,90 s | Comparateur planche → objet | « Une boîte à musique, à manivelle. » | « Une boîte à musique. » + nom du produit (fiche `boite-a-musique-manivelle`) |
| 8,25 s | Orbite | « Un écran de plus ? Non. » | ligne 17,0 – 19,8 s, première moitié |
| 11,05 s | Détail du mécanisme | « Un objet à construire. » | ligne 17,0 – 19,8 s, seconde moitié |
| 13,65 s | Nuit + cartes en verre | « Éteignez les lumières… et laissez briller le laiton. » | lignes 6,6 – 10,4 s réunies |
| 16,95 s | Carte de fin | « Rouage et Laiton. Suivez-nous. » | ligne 19,8 – 24,5 s, première moitié (« Laquelle vous tente ? » retiré : un seul produit ici) ; « Suivez-nous. » ajouté en T56 (appel final demandé par l'audit, A3 ; réplique regénérée avec Piper, mêmes réglages) |

Fichiers : `de-la-planche-a-l-objet.mp3` (voix seule), `de-la-planche-a-l-objet.json` (temps de chaque mot, faster-whisper `large-v3` + orthographe du texte ci-dessus), `de-la-planche-a-l-objet.srt`.
Contrôle : sur la piste complète, faster-whisper a d'abord entendu « puce » pour « plus » ; la réplique seule est bien transcrite « Un écran de plus ? Non. » (test refait le 2026-11-13). Les sous-titres prennent l'orthographe du texte ci-dessus. Écoute humaine conseillée.

## Garde-fous (T56, audit `outputs/2026-11-13-conformite-qa-videos-planche-a-objet.md`)

- **Réplique « laissez briller le laiton » réservée à la démonstration** : à ne réutiliser pour un vrai produit que si la fiche fabricant prouve des pièces en laiton visibles (point A5 ; aujourd'hui la fiche porte « Mécanisme à peigne (matériau : À VÉRIFIER) »).
- **Appel final** : « Suivez-nous » remplace « Suivez l'atelier » (point A3 : la boutique revend des kits, elle ne les fabrique pas). « Atelier » ne revient que si l'humain fabrique ou assemble réellement quelque chose (décision à noter dans `knowledge/marque.md`).
- **Musique** : la mélodie est une création de synthèse, ce n'est pas l'air réel de la boîte (point A4) ; la légende de publication le dit.
