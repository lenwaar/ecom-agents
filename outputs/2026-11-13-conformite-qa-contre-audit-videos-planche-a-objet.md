---
agent: conformite-qa
statut: validé
valide_par: humain
date_validation: 2026-11-13
date: 2026-11-13
mode: audit
verdict: BLOQUANT   # uniquement à cause de A1 (ouvert, vérification INPI par l'humain) ; hors A1 : CONFORME
verdict_hors_A1: CONFORME
sources: [outputs/2026-11-13-conformite-qa-videos-planche-a-objet.md, outputs/2026-11-13-studio-video-corrections-planche-a-objet.md, https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032227301, https://creativecommons.org/licenses/by/4.0/legalcode.fr (sources de l'audit T55, consultées le 2026-11-13, non reconsultées)]
prochaine-etape: humain, vérifier le nom « Rouage & Laiton » (A1), écouter les deux MP4 (P3), valider les légendes du §4 du rapport de corrections, puis décider et donner l'accord de publication
---

# Contre-audit court : vidéos corrigées « De la planche à l'objet » (v1 et v2)

Tâche T58, synchro n°14. Base : l'audit T55 (`outputs/2026-11-13-conformite-qa-videos-planche-a-objet.md`, points A1 à A7) et le rapport de corrections T56 (`outputs/2026-11-13-studio-video-corrections-planche-a-objet.md`).

Contrôlé : planches contact `planche-contact-v1.jpg` et `planche-contact-v2.jpg` (14 images chacune, regardées une par une), en taille réelle 1080×1920 `v1-06b-cartes-verre.jpg`, `v2-06b-cartes-verre.jpg`, `v2-06c-enchainement-fin.jpg`, `v2-07-fin.jpg` ; `medias/voix/de-la-planche-a-l-objet.md` et `.srt` ; `medias/licences.md` ; légendes du §4 du rapport de corrections.

Limites : je n'ai pas d'accès à ffmpeg dans cette session (aucun terminal disponible). Les niveaux sonores sont **repris du rapport T56**, pas remesurés. Je ne peux pas écouter : la voix « Suivez-nous » est jugée sur le `.srt` et le fichier voix.

## 1. Verdict global

**Hors A1 : CONFORME.** Les points A2 à A7 et les cinq demandes de l'humain sont corrigés.
**Publication : toujours BLOQUANT**, uniquement à cause de A1 (nom « Rouage & Laiton » non vérifié). A1 reste ouvert ; l'analyse n'est pas refaite.

| Niveau | Nombre |
|---|---|
| ⛔ bloquant | 1 (A1, ouvert, hors périmètre de ce contre-audit) |
| ⚠️ à corriger | 0 |
| ✅ conforme | 11 |

## 2. Tableau des points

| # | Livrable | Point | Niveau | Constat / correction | Source |
|---|---|---|---|---|---|
| A1 | v1 et v2 (carte de fin, voix, sous-titre 12) | Nom « Rouage & Laiton » non vérifié | ⛔ (ouvert) | Inchangé : vérification INPI, TMview, domaine et comptes par l'humain. Si le nom change, nouveau rendu et nouveau contre-audit. | Audit T55, A1 ; `knowledge/marque.md` |
| D1 | v1 et v2, carte de fin et voix | « Suivez-nous » à la place de « Suivez l'atelier » (A3) | ✅ | Bouton « Suivez-nous » vu sur `v2-07-fin.jpg` et sur la dernière image des deux planches. Voix v2 : « Rouage et Laiton. Suivez-nous. » (fichier voix, départ 16,95 s) ; `.srt` n° 13 « Suivez-nous. » de 18,22 à 18,92 s. Le mot « atelier » n'apparaît plus nulle part à l'écran ni dans le texte dit. Netteté à l'oreille : P3. | Code de la consommation, art. L121-2 2° b |
| D2 | v1 et v2, pastille | Mention « Rendus 3D de démonstration, produit non vendu » lisible et dans la zone sûre (A2) | ✅ | Présente sur les 14 images de chaque planche (0 à 20 s). En taille réelle, le cadre commence à y ≈ 320 px, sous la limite des 15 % (288 px) ; texte blanc gras d'environ 36 px sur fond sombre, centré, lisible aussi sur fond clair (planches) et sur la carte de fin. v2 : 3e ligne « voix de synthèse (IA) ». La pastille ne chevauche ni les étiquettes du comparateur ni les cartes en verre (y ≈ 500). | Code de la consommation, art. L121-2 2° b ; leçon 11 de `docs/retours-experience.md` |
| D3 | v1 et v2, fin | Plus de plan presque vide avant le logo | ✅ | `v2-06c-enchainement-fin.jpg` : fondu enchaîné, le logo est déjà net par-dessus la scène de nuit. Sur les planches, l'image 13 montre logo et sous-titre de marque, l'image 14 ajoute le bouton : aucun fond seul. Seule l'image 0,0 s (ouverture) est presque noire : ce n'est pas avant le logo ; ne pas la prendre comme couverture (rapport T56, §6). | Demande de l'humain ; grille §5 du brief |
| D4 | v1 et v2, cartes en verre | Carte « Entraînement » nette et entière | ✅ | `v1-06b` et `v2-06b` en taille réelle : « ENTRAÎNEMENT / Manivelle » entier, avec marge, net ; les trois cartes sont droites et alignées, dans le cadre (x ≈ 54 à 1026). | Demande de l'humain |
| D5 | v1 et v2, son | Autour de -14 LUFS | ✅ (repris du rapport) | Rapport T56, mesure `ebur128` sur les MP4 finaux : v1 -14,0 LUFS, crête -4,8 dBTP ; v2 -14,2 LUFS, crête -4,9 dBTP ; écart voix-musique 15,0 dB. Non remesuré ici (pas de ffmpeg). Contrôle d'oreille par l'humain (P3). | Rapport T56, §1 |
| D6 | Légendes v1 et v2, version courte | Commencent par « Produit de démonstration, non vendu » | ✅ | Les trois textes du §4 du rapport T56 commencent par « Produit de démonstration, non vendu. ». | Code de la consommation, art. L121-2 2° b |
| A4 | Légendes, fichier voix | Mélodie qui n'est pas l'air du produit | ✅ | Phrase « Musique : mélodie originale de synthèse, ce n'est pas l'enregistrement du produit. » dans les deux légendes ; garde-fou dans le fichier voix ; la version courte dit « Musique de synthèse, pas l'enregistrement du produit ». | Code de la consommation, art. L121-2 2° b |
| A5 | Fichier voix | « laissez briller le laiton » | ✅ | Garde-fou présent dans `medias/voix/de-la-planche-a-l-objet.md` (réservé à la démonstration, à ne réutiliser que si la fiche fabricant prouve des pièces en laiton visibles). Vidéos inchangées sur ce point, comme demandé. | Code de la consommation, art. L121-2 2° b |
| A6 | Crédit de la voix | Version courte avec auteurs et lien de licence | ✅ | La version courte cite les auteurs SIWIS, « Bakhturina et al. » pour Hi-Fi TTS, les liens DOI et OpenSLR et le lien CC BY 4.0. La version complète reste la règle. `medias/licences.md` renvoie vers la légende v2 du rapport T56. Ne plus utiliser la version courte du rapport d'origine. | CC BY 4.0, art. 3(a)(1) et 3(a)(2) |
| A7 | Légendes | Légendes prêtes v1 et v2 | ✅ | Écrites au §4 du rapport T56 ; elles reprennent A2, A4 et le crédit complet (v2). Longueur v2 environ 730 caractères : limite de chaque plateforme `À VÉRIFIER` à la publication. | Points A2, A4, A6 |
| C | v1, v2, voix, `.srt` | Pas de nouveau risque introduit | ✅ | Aucun chiffre, prix, promo, avis ni allégation santé ajouté ; aucun nouveau média tiers (`medias/licences.md` à jour). Sous-titres conformes au texte dit. | `CLAUDE.md` |

## 3. Ce qui doit être revu par un professionnel ou par l'humain

- **A1 (humain, conseil en propriété industrielle recommandé)** : vérification du nom, toujours bloquante.
- **P3 (humain, à l'écoute)** : netteté de « Suivez-nous », niveau ressenti, absence de pompage du limiteur, mélodie qui ne rappelle pas un air connu.
- **P4 (humain)** : décision de publier un produit de démonstration non vendu et accord explicite avant toute publication ; activer l'étiquette « contenu généré par IA » pour la v2 ; couverture choisie après 1 s.

## 4. Sources

- Audit T55 et ses sources officielles (Code de la consommation art. L121-2 : https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032227301 ; CC BY 4.0 : https://creativecommons.org/licenses/by/4.0/legalcode.fr), consultées le 2026-11-13, non reconsultées pour ce contre-audit court.
- Rapport T56 : `outputs/2026-11-13-studio-video-corrections-planche-a-objet.md` (mesures sonores).
- Fichiers contrôlés : `medias/apercus/de-la-planche-a-l-objet/` (planches contact v1 et v2, `v1-06b`, `v2-06b`, `v2-06c`, `v2-07`), `medias/voix/de-la-planche-a-l-objet.md`, `medias/voix/de-la-planche-a-l-objet.srt`, `medias/licences.md`.
