# Modèles de pub « à trous » Robotime ROKR (T73)

Script corrigé (audit P1 à P6) : `outputs/2026-11-13-createur-contenu-modeles-pub-robotime.md` (A Accroche 18 s, B Démonstration 25 s, C Avant/après 20 s).
Deux variantes par modèle : **avec marque** (médias Robotime, `{MENTION_MARQUE}`, `{MENTION_IMAGES}`, sous réserve d'accord écrit) et **sans marque** (médias libres de droits ou cartons, « Maquette mécanique en bois », aucune mention de Robotime). Option `publicite` : mention « Publicité » du début à la fin.
Composition Remotion `modele-pub-A|B|C` (déclarée dans `src/Racine.tsx`), composée en 1080×1920, 30 i/s.

| Fichier | Rôle |
|---|---|
| `plans.ts` | les plans (durées, textes à l'écran, description de chaque « MÉDIA FOURNISSEUR n°X ») |
| `ModelesPub.tsx` | le montage : cadres vides, cartons, fin, voile C4, filigrane de brouillon |
| `props/<M>-<avec-marque|sans-marque>-brouillon.json` | brouillon : aucun média ; seules `AGE` (« Dès 14 ans », À VÉRIFIER) et, sans marque, `MENTION_MARQUE` sont renseignées |
| `medias/A|B|C/` | dépôt des médias officiels (hors Git), voir `medias/ATTENDUS.md` |
| `audio.py` | bande son sans voix (mélodie et bruitages fabriqués par le code, `outils/son.py`) |
| `assembler.sh` | rendu + son à -14 LUFS + assemblage + mesure + planches contact + images clés |

## Brouillon (fait)
```
cd studio/video
sh modeles-pub-robotime/assembler.sh brouillon
```
MP4 dans `medias/brouillons/modeles-pub-robotime/` (hors Git), aperçus dans `medias/apercus/modeles-pub-robotime/`.

## Version finale (après accord écrit de Robotime)
1. Déposer chaque média sous son nom de cadre : `medias/A/A1.mp4`, `medias/A/A3.jpg`… (liste : `medias/ATTENDUS.md`), puis les copier dans le dossier public : `cp -r modeles-pub-robotime/medias/* .cache/public/modeles-pub-robotime/`.
2. Créer `props/<M>-<variante>-final.json` à partir du brouillon :
   - `"brouillon": false` (retire filigrane, repères À VÉRIFIER et mention « médias en attente ») ; `"publicite"` : true pour une diffusion payante, false en organique ;
   - `"medias": {"A1": "modeles-pub-robotime/A/A1.mp4", …}` : chaque cadre fourni remplace le cadre vide ;
   - `"variables": {"NOM_PRODUIT": "…", "PRIX": "…", "FRAIS_LIVRAISON": "…", "DÉLAI": "…", "NB_PIÈCES": "…", "AGE": "…", "MENTION_MARQUE": "…", "MENTION_IMAGES": "Images : Robotime"}` : valeurs relevées sur la fiche, jamais inventées ;
   - `"lignesRetirees"` (ex. `"A5-pieces"` ; « Écoutez-le tourner. » au lieu de « Regardez-le tourner. » en A1 et B1 : à changer dans `plans.ts`, seulement avec le vrai son du produit) et `"plansRetires"` (ex. `"A4"`, `"C2"`) pour ce qui n'est pas vérifié.
3. `sh modeles-pub-robotime/assembler.sh final` puis grille §5 du brief sur les MP4 de `medias/`.
4. Les vidéos fournisseur sont muettes par défaut (`muted`) : leur son d'origine seulement s'il est couvert par l'accord.
