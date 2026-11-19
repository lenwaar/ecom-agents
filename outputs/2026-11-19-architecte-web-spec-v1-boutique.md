---
agent: architecte-web
statut: à-valider
date: 2026-11-19
sources: [CLAUDE.md, knowledge/memo.md, docs/retours-experience.md, knowledge/politiques.md (proposé), docs/site-technique.md, tools/calcul_marge.py, outputs/2026-11-12-architecte-web-conception-boutique-v2.md, Règlement (UE) 2023/988 (GPSR) art. 9, 16 et 19, Directive 2009/48/CE art. 11 et annexe V, Code de la consommation art. L111-7-2, D111-16 à D111-19, L121-4 (21° et 22°), Directive (UE) 2019/2161 (Omnibus)]
prochaine-etape: conformite-qa puis developpeur-web
---

# Spécification V1 : page produit modèle, avis, /boutique, Modules

> Produit et fournisseur non décidés : tout repose sur `exemple-demo`, sans prix réel, sans lien de paiement, sans donnée inventée. **Point d'attention** : `knowledge/memo.md` (2026-11-14) annonce des produits 100 % numériques, alors que la demande V1 prévoit des champs physiques (port, âge, GPSR). Le modèle couvre les deux : tout champ physique accepte la valeur `"sans objet"` (produit numérique), distincte de `"À VÉRIFIER"` (qui bloque la mise en ligne d'un vrai produit, retour d'expérience n°10).

## 1. Fiche produit (`data/produits/<slug>.json`)

**Champs** : `slug`, `nom`, `type` (`physique` | `numerique`), `demo` (booléen), `prix_ttc`, `port` (montant | `"sans objet"`), `delai` (texte | « Accès immédiat après paiement » si numérique), `age_minimum` (nombre | `"sans objet"`), `gpsr` (objet du §2 | `"sans objet"`), `description`, `visuels` (fichier + texte alternatif + `rendu_3d` booléen), `paiement_url` (vide si `demo`).
**Si `demo: true`** : bandeau fixe en haut « Page de démonstration, produit non vendu », balise `noindex, nofollow`, bouton « Acheter » désactivé (`aria-disabled`, libellé « Paiement inactif »), valeurs `À VÉRIFIER` masquées.

| Ordre mobile 390 px (une colonne) | Ordinateur (≥ 1024 px, deux colonnes) |
|---|---|
| 1. Bandeau démo (si `demo`) · 2. Visuel principal + vignettes défilantes · 3. Nom · 4. Prix TTC + mention TVA · 5. Port et délai (ou « Accès immédiat ») · 6. Badge âge (si applicable) · 7. **Bouton d'achat** (seul appel à l'action) + phrase Stripe · 8. Description · 9. Bloc « Sécurité du produit » (GPSR, replié par défaut, titre visible) · 10. Livraison, rétractation, garanties (liens) · 11. Avis · barre d'achat collante en bas dès que le bouton 7 sort de l'écran | Gauche (60 %) : 1 en pleine largeur au-dessus, puis 2 en galerie. Droite (40 %, collante) : 3 à 7. Sous les deux colonnes, pleine largeur : 8 à 11. Pas de barre collante |

## 2. Mentions GPSR (produit physique uniquement)

Source : Règlement (UE) 2023/988, **art. 19** (vente à distance : informations « clairement et visiblement » sur l'offre), renvoyant aux art. 9 et 16. À afficher dans le bloc « Sécurité du produit » :
1. **Fabricant** : nom, raison sociale ou marque déposée ; adresse postale ; adresse électronique (art. 19 a).
2. **Personne responsable dans l'UE** (art. 16) si le fabricant est établi hors UE : nom, adresse postale, adresse électronique (art. 19 b).
3. **Identification du produit** : **image**, type, et lot ou numéro de série ou autre identifiant (art. 19 c).
4. **Avertissements et informations de sécurité** apposés sur le produit ou l'emballage, **en français** (art. 19 d ; langue fixée par l'État membre).

**À VÉRIFIER** : le contenu de chaque champ (aucun fabricant choisi) ; la langue d'origine des avertissements fabricant ; si le produit relève d'une législation sectorielle (jouets). **Jouets, seulement si le produit en est un** (point à vérifier, pas une règle générale) : Directive 2009/48/CE, art. 11 (les avertissements d'âge déterminants pour l'achat visibles **avant l'achat, y compris en ligne**) et annexe V (ex. « Ne convient pas aux enfants de moins de 36 mois » + danger précis). Un produit pour adultes (« 14 ans et plus », `politiques.md`) n'est pas forcément hors champ : qualification à confirmer [PRO]. Produit numérique : bloc remplacé par « sans objet », non affiché.

## 3. Section avis (`data/avis.json`)

- Fichier vide : afficher « Aucun avis pour l'instant. » Aucune note moyenne, aucune étoile, aucun compteur.
- Un avis n'est affiché que s'il porte un champ `commande` correspondant à une **commande réelle payée** (référence Stripe) ; sinon rejeté au contrôle. Champs : `commande`, `prenom_initiale`, `note`, `texte`, `date_experience`, `date_publication`, `reponse` (facultatif).
- **Dès le premier vrai avis**, afficher à côté des avis (art. L111-7-2 et D111-17) : « Avis contrôlés : seuls les clients ayant passé commande peuvent laisser un avis » ; la **date de publication** et la **date de l'expérience** de chaque avis ; le **critère de classement** (« du plus récent au plus ancien »). Sur une page « Comment nous traitons les avis » liée (D111-18) : absence de contrepartie, délai maximal de publication et durée de conservation (`À VÉRIFIER`), motifs de refus. Auteur prévenu en cas de refus (D111-19).
- Interdits (L121-4, 21° et 22°, issus de la directive Omnibus) : faux avis, avis commandés ou filtrés pour ne garder que les bons, se dire « vérifiés » sans contrôle réel.

## 4. Tableau `/boutique` du QG (local)

| Indicateur | Définition | Source |
|---|---|---|
| CA TTC | Somme des paiements réussis, moins les remboursements, sur la période | Export Stripe (aucun compte : `—`) |
| Commandes | Nombre de paiements réussis non remboursés | Idem |
| Panier moyen | CA TTC ÷ commandes (`—` si 0 commande) | Calculé |
| Visiteurs | **Aucune source pour l'instant** : afficher « Non mesuré », jamais 0 | Outil à choisir (§5) |
| Marge nette réelle | CA − frais Stripe réels − coût produit − port réel − cotisations − remboursements | `tools/calcul_marge.py` + export Stripe |

Les chiffres d'exemple vivent dans un bloc séparé, titré « EXEMPLE, chiffres fictifs », fond hachuré, **jamais additionnés** aux vrais. Sans données réelles, chaque carte affiche `—` et « Aucune vente ».
**Page Modules** : Paiement, Avis, Contact, Lettre d'information, SAV ; statut `Actif` (seulement si branché et testé) ou `À venir` sans date ni promesse ; aujourd'hui Paiement = « À venir (compte Stripe à ouvrir par l'humain) », Avis = « Actif, aucun avis ».

## 5. Décisions pour l'humain

1. **Physique ou numérique ?** Le mémo dit numérique ; V1 prépare les deux. Confirmer pour figer les champs obligatoires.
2. **Taux de cotisations** : `calcul_marge.py` utilise 12,3 % (vente de marchandises) ; le mémo indique 21,2 % (services BIC, numérique). Choisir le taux, sinon la marge affichée sera fausse.
3. **`calcul_marge.py` lit une grille de prix, pas des commandes** : valider l'ajout d'un mode « commandes réelles » (export Stripe CSV).
4. **Mesure des visiteurs** : outil sans cookie (ex. Cloudflare Web Analytics, déjà sur la pile) ou rien.
5. Délai de publication et durée de conservation des avis (`À VÉRIFIER`).
