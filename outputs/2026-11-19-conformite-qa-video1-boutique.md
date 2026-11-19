---
agent: conformite-qa
statut: à-valider
date: 2026-11-19
mode: audit
verdict: À CORRIGER
sources: [CLAUDE.md, knowledge/memo.md, knowledge/politiques.md, docs/retours-experience.md, outputs/2026-11-19-architecte-web-video1-boutique.md, tools/calcul_marge.py, "Règlement (UE) 2023/988 (GPSR), art. 19, https://eur-lex.europa.eu/eli/reg/2023/988/oj (non reconsulté ce jour)", "Code de la consommation, art. L111-7-2, https://www.legifrance.gouv.fr (non reconsulté ce jour)"]
prochaine-etape: humain tranche la niche (numérique ou physique) ; developpeur-web applique les 5 corrections ⚠️ puis reconstruit le site ; nouvelle passe conformite-qa avant tournage
---

# Audit V1 : admin de boutique (vidéo 1)

Contrôle interne avant validation humaine. Rien n'est publié.

## 1. Verdict global
**À CORRIGER** : 0 ⛔, 5 ⚠️, 11 ✅. Aucun point bloquant : aucune vente possible, aucune donnée inventée affichée comme réelle, aucun avis, aucun secret. Les corrections portent sur la cohérence de ce qui sera filmé.

Vérifié : HTML construit, captures 390 px et 1280 px, `/boutique`, `/modules`, tests du QG (13/13 réussis, dont la parité avec `tools/calcul_marge.py`), recherche de clés (`sk_`, `pk_`, `whsec_`, liens `buy.stripe.com`) : rien trouvé.

## 2. Points contrôlés

| Livrable | Point | Niveau | Correction proposée |
|---|---|---|---|
| Page produit | Bandeau « Page de démonstration, produit non vendu » visible en haut (mobile et ordinateur) | ✅ | - |
| Page produit | `<meta name="robots" content="noindex, nofollow">` dans le HTML construit ; pas de sitemap, page liée nulle part | ✅ | - |
| Page produit | Bouton `<button disabled aria-disabled="true">`, aucun `href` ; lien refusé par le chargeur si `demo: true` | ✅ | - |
| Page produit | Prix, port, délai `null` : « Prix non fixé », « Non communiqué » ; aucun « À VÉRIFIER » ni « 0 € » visible (leçon 10) | ✅ | - |
| Page produit | « 14 ans et plus » (badge + bloc sécurité) ; bloc GPSR complet en structure (fabricant, responsable UE, référence, avertissements, visuel) ; un vrai produit incomplet fait échouer la construction | ✅ | - |
| Page produit | Visuel : illustration neutre, légendée « Illustration », aucune photo de marque | ✅ | - |
| Page produit (en-tête et pied, filmés) | Marque abandonnée « Rouage & Laiton », « Maquettes mécaniques en bois », « rendus 3D », « Paiement par Stripe » : contredit `memo.md` et la page elle-même | ⚠️ | Pour la vidéo, remplacer le nom par « [Nom de marque à choisir] », retirer la phrase « Maquettes mécaniques… », mettre le bandeau global à « Boutique en préparation : rien n'est en vente pour le moment. » et retirer « Paiement par Stripe » de la bande de réassurance et du pied tant qu'aucun compte n'existe |
| `site/dist` | HTML construit périmé : `alt` « Illustration neutre d'un colis » alors que le JSON dit « engrenage » | ⚠️ | Relancer `npm run build` dans `site/` avant toute capture ou tournage |
| Avis | Filtre strict : avis retenu seulement si `reference_commande` = commande « payee » de `data/commandes.json` pour ce produit ; fichier d'exemple jamais lu ; `avis.json` vide ; aucune étoile, aucune note moyenne, aucune donnée structurée Review ; règle ajoutée dans `CLAUDE.md` | ✅ | - |
| Avis | Textes en écart avec la spécification ; information sur le contrôle des avis à prévoir avant le premier avis (L111-7-2) | ⚠️ | Message vide : « Aucun avis pour le moment. Seuls les clients ayant commandé peuvent en laisser un. » ; avant le premier avis réel, ajouter un lien « Comment nous vérifions les avis » (commande payée exigée, aucun avis supprimé pour sa note, ordre chronologique). À faire relire par un juriste |
| QG `/boutique` | Exemple dans un bloc séparé, bordure pointillée, titre « Exemple », étiquette « exemple » sur les 5 indicateurs et chaque montant ; fichier réel marqué exemple refusé ; vrais chiffres vides = « Aucune commande importée » ; visiteurs `null` = « Non mesuré » | ✅ | Écart de spécification sans risque : le bloc d'exemple s'affiche toujours au lieu d'un bouton « Voir avec des exemples ». À garder ou corriger selon le choix de l'humain |
| QG `/boutique` | Formule de marge identique à `tools/calcul_marge.py` (Stripe 1,5 % + 0,25 €, 12,3 %, 5 %, livraison, emballage, éco-participation à 0 €) ; recalcul : 12,11 € et 24,47 €, total 36,58 €, conversion 2/500 = 0,4 % ; mention « À VÉRIFIER » visible | ✅ | - |
| QG `/modules` | 5 modules « À venir » (texte + couleur), aucune date, aucun « bientôt », descriptions factuelles | ✅ | - |
| `data/commandes.json` | Schéma sans aucune donnée personnelle (référence, date, produit, montants, statut) | ✅ | - |
| `data/commandes.json` | Fichier destiné à GitHub : références Stripe et chiffre d'affaires y deviendraient visibles | ⚠️ | Ajouter `data/commandes.json` à `.gitignore` avant le premier import réel ; garder dans Git un `data/commandes.vide.json` et l'exemple |
| QG | Serveur sur 127.0.0.1, routes en lecture seule (GET), texte échappé ; aucun secret | ✅ | - |

## 3. Contradiction à trancher (non tranchée ici)
`knowledge/memo.md` (2026-11-14) : boutique **100 % numérique** (tableurs de budget), sans fournisseur, stock ni livraison. La tâche V1 suppose un **produit physique** (GPSR, 14 ans et plus, frais de port, délai, coût fournisseur, cotisations 12,3 %). Conséquences si le numérique fait foi : cotisations 21,2 % au lieu de 12,3 % dans la formule ; bloc GPSR, âge et frais de port sans objet ; rétractation remplacée par l'accord exprès + renonciation pour le téléchargement immédiat ; `knowledge/politiques.md` (rédigé pour les maquettes) à réécrire. **L'humain doit trancher avant le tournage.**

## 4. À faire revoir par un professionnel
- Taux de cotisations (12,3 % ou 21,2 %) selon la nature réelle de l'activité : expert-comptable ou URSSAF.
- Texte de la page « Comment nous vérifions les avis » : juriste, avant le premier avis.
- Les sources européennes et françaises citées n'ont pas été reconsultées ce jour : vérifier la version en vigueur avant toute mise en ligne.
