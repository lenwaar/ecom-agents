---
agent: conformite-qa
statut: validé
valide_par: humain
date_validation: 2026-11-14
date: 2026-11-13
mode: audit
verdict: À CORRIGER
sources: [outputs/2026-11-13-createur-contenu-modeles-pub-robotime.md, outputs/2026-11-13-redacteur-catalogue-messages-robotime.md, knowledge/decisions.md, knowledge/memo.md, knowledge/marque.md, docs/retours-experience.md, legifrance.gouv.fr (C. conso. L221-5, consulté le 2026-11-13), ads.tiktok.com (politique propriété intellectuelle, mise à jour avril 2026, consultée le 2026-11-13), transparency.meta.com (droits d'auteur et marques, consulté le 2026-11-13), eur-lex.europa.eu (règlement 2023/988), economie.gouv.fr (fiche DGCCRF dropshipping)]
prochaine-etape: l'humain valide les corrections ; createur-contenu corrige P1 à P6 et redacteur-catalogue corrige R1 à R5 ; les messages ne partent qu'après ce contrôle ; les conditions M1 à M6 sont à lever avant la première vente
---

# Audit du modèle Robotime : pubs « à trous » et messages au fournisseur (synchro n°16)

Je n'ai modifié aucun des deux livrables, ni `knowledge/`, ni `coordination/`. Je ne suis pas juriste : les points marqués [PRO] sont à faire valider par un professionnel.

## 1. Verdicts

| Livrable | Verdict | Points |
|---|---|---|
| Modèles de pub vidéo Robotime | **À CORRIGER** | 6 à corriger, 0 bloquant. Le modèle « à trous » est sain : aucun chiffre inventé, pas de fausse promo, « officielle » soumis à un accord. Mais il n'est **pas publiable** tant que Robotime n'a pas donné son accord écrit. |
| Messages à Robotime | **À CORRIGER** | 5 à corriger, 0 bloquant. Une phrase est fausse (R1). Il manque 3 demandes nécessaires : facture, retours, documents de sécurité dans le message 1. |
| Modèle dropshipping (pour information) | **6 conditions bloquantes avant la 1re vente** | Ce ne sont pas des défauts des livrables, mais des risques que vous devez connaître (M1 à M6). |

## 2. Corrections

**Pubs (`createur-contenu`)**

| # | Plan | Problème | Correction exacte |
|---|---|---|---|
| P1 | A5, B9, C7, légendes A et C | Le prix est annoncé sans les frais de livraison. Les frais doivent être indiqués avec le prix (L221-5). | Ajouter une variable `{FRAIS_LIVRAISON}` : « {PRIX} TTC, livraison offerte » ou « {PRIX} TTC + {FRAIS_LIVRAISON} de livraison ». |
| P2 | `{MENTION_OFFICIELLE}` | « Maquette officielle Robotime ROKR » peut laisser croire que la boutique est un revendeur officiel. Revendre un produit authentique permet de citer la marque pour le décrire, pas de laisser croire à un partenariat. TikTok refuse aussi toute marque tierce utilisée sans autorisation. | Valeur après accord écrit : « Maquette ROKR, marque Robotime ». N'utiliser « officielle » que si l'accord le dit mot pour mot. Ne jamais écrire « revendeur officiel » ni « partenaire ». Sur TikTok, ne citer la marque, même dans la légende, qu'avec l'accord écrit. |
| P3 | A1, A4, B1, C6 | « Écoutez-le tourner » est accompagné d'un son qui peut être synthétique (A4 : « sinon synthèse légère »). Le client croirait entendre le vrai produit. | N'utiliser que le son réel du média officiel. Sans ce son : en B1, remplacer le texte par « Regardez-le tourner. » ; en A4, mettre la musique seule. |
| P4 | A2, B8, C3 | Le texte par défaut contient des promesses non vérifiées : « Prévoyez une ou deux soirées » (voix B8), « Quelques soirées plus tard », « Sans colle ». | Par défaut : « Étape après étape », sans voix sur la durée et sans « sans colle ». Ajouter une durée ou « sans colle » seulement si la fiche du fabricant le dit, avec la source notée. Et « Notice du fabricant fournie » seulement si la notice existe en français. |
| P5 | Cartons de fin, légendes | Aucune mention d'âge dans les pubs. | Ajouter « Dès 14 ans » (à reprendre du marquage du fabricant, `À VÉRIFIER`) et cibler les pubs sur les 18 ans et plus. Aucun visuel ni mot-clé qui vise les enfants. |
| P6 | Légendes A et C | La voix off est facultative dans les trois modèles, mais le crédit CC BY 4.0 n'est prévu que dans la légende B (leçon n° 13). | Ajouter dans chaque légende, si une voix est utilisée : « Voix de synthèse (Piper, voix siwis, CC BY 4.0). » |

**Messages (`redacteur-catalogue`)**

| # | Où | Problème | Correction exacte |
|---|---|---|---|
| R1 | Message 2, avant-dernier paragraphe (EN et FR) | Phrase fausse : « using the shop name only to describe them » (« le nom de la boutique »). On parle de **leur** marque. | « …and to use your brand names (Robotime, ROKR) only to describe your genuine products, without suggesting any official partnership unless you agree to one. » En français : « …et à n'utiliser vos marques (Robotime, ROKR) que pour décrire vos produits authentiques… » |
| R2 | Messages 1 et 2 | Rien sur l'usage du **nom** et du logo de la marque, ni sur l'authenticité (leçon n° 8). | Ajouter : « May I use the names Robotime and ROKR (and your logo) on my website and in my ads, and may I describe the models as "official" or "genuine"? Can you confirm that store 2884002 is operated or authorised by Robotime? » |
| R3 | Q4 des deux messages | « Confirm the CE marking » : si le modèle n'est pas un jouet, il n'a pas forcément de marquage CE. La question pousse à répondre « oui » sans preuve. Le message 1 ne demande pas les informations de sécurité (GPSR). | Remplacer par : « For each model: which EU rules does it comply with (Toy Safety Directive or General Product Safety Regulation 2023/988)? Please send the manufacturer's name, postal and e-mail address, the EU responsible person (name, address, e-mail), the product reference, the age marking, the warnings, and the instructions in French. If the model is a toy, please also send the EU declaration of conformity. » |
| R4 | Messages 1 et 2 | La demande de colis sans facture AliExpress est faite, mais rien ne demande **notre** facture d'achat. | Ajouter : « Can you issue, for each order, an invoice in my business name (with company number and address), showing the VAT, and tell me which company issues it (name and country)? » |
| R5 | Message 1 (absent), message 2 Q5 (incomplet) | Rien sur les retours, alors que nous devons accepter la rétractation de 14 jours et la garantie de conformité de 2 ans. | Ajouter : « When my customer withdraws within 14 days or a kit is defective or incomplete: do you accept returns to an EU address, who pays the return, how and when are we refunded, and can you send replacement parts? » |

Remarque mineure : l'en-tête du fichier des messages n'a pas de `date`. Ce champ n'est pas exigé par `docs/architecture.md`, mais il serait utile de l'ajouter.

## 3. Le modèle dropshipping : 6 conditions avant la première vente

| # | Risque | Ce qu'il faut avant de vendre |
|---|---|---|
| M1 | **Sécurité des produits (GPSR)** : nous sommes **distributeur**. Pour la vente en ligne, chaque fiche doit afficher le fabricant, la personne responsable dans l'UE, la référence, les avertissements et une photo du produit. | Si Robotime ne fournit pas de personne responsable dans l'UE pour une maquette, cette maquette n'est **pas vendable**. [PRO] : qui est l'importateur du stock de l'entrepôt UE ? |
| M2 | **Responsabilité de plein droit** (L221-15) : le vendeur répond de la livraison même si c'est le fournisseur qui expédie. Le risque de perte reste à notre charge jusqu'à la remise au client (L216-2). | Le délai annoncé doit être le délai réel. Faire 1 ou 2 commandes test, payées par vous, pour mesurer ce délai. Délai ≤ 14 jours : `À VÉRIFIER`. Les colis perdus sont à notre charge. |
| M3 | **Rétractation de 14 jours** : elle compte à partir de la réception. Nous remboursons au plus tard 14 jours après la décision du client (L221-24). Les règles de retour d'AliExpress ne nous dispensent pas de cette obligation. | Il faut une adresse de retour, ce qui crée un petit stock de retours, contraire au « 0 € d'avance ». Les frais de retour ne sont à la charge du client que si les CGV le disent. Les 5 % prévus pour le SAV suffisent-ils ? `À VÉRIFIER`. |
| M4 | **Colis et facture AliExpress** : si le client reçoit un emballage ou une facture AliExpress, il ne sait plus qui est son vendeur, et il voit notre prix d'achat. | Envoyer notre propre confirmation de commande et notre facture, avec la mention 293 B. Conserver la facture d'achat (R4). [PRO] expert-comptable. |
| M5 | **Données personnelles (RGPD)** : le nom et l'adresse du client sont transmis à AliExpress, avec un possible transfert hors de l'UE. | Le dire dans la politique de confidentialité et vérifier l'encadrement du transfert. [PRO] juriste. |
| M6 | **Conditions d'utilisation d'AliExpress** : un compte acheteur a-t-il le droit d'acheter pour revendre et de faire livrer un tiers ? | `À VÉRIFIER` dans les conditions d'AliExpress, avant la première commande. |

**À faire valider par un professionnel** : M1 (qui est l'opérateur responsable), M4 (factures et TVA en franchise), M5 (transfert de données), la formulation de P2 et de R2 (usage de la marque).

## 4. Sources (consultées le 2026-11-13)

- Code de la consommation, art. L221-5 (informations précontractuelles : prix, frais, délai, rétractation), version en vigueur depuis le 19/06/2026 (ord. n° 2026-2) : https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032226876 (lu).
- Code de la consommation, art. L221-15, L216-1, L216-2, L221-18, L221-23, L221-24 : https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006069565 (contenu repéré par recherche, texte **non relu sur Légifrance** le 2026-11-13 : à relire).
- Règlement (UE) 2023/988 (GPSR), art. 16 (opérateur responsable dans l'UE) et art. 19 (vente à distance) : https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32023R0988 (page illisible par l'outil : articles à relire par l'humain).
- Code de la propriété intellectuelle, art. L713-4 (épuisement des droits) : https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006069414 ; CJCE, 23/02/1999, BMW, C-63/97 (citer une marque sans laisser croire à un lien commercial) : https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:61997CJ0063 (non relus en ligne : à relire).
- Loi n° 94-665 (loi Toubon), art. 2 (mode d'emploi en français) : https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000349929 (non relu en ligne).
- TikTok, politique publicitaire « Intellectual Property Infringement », mise à jour d'avril 2026 : « We do not allow the use of third-party brands without authorization. » https://ads.tiktok.com/help/article/tiktok-ads-policy-intellectual-property-infringement?lang=en (lu).
- Meta, normes publicitaires « Droits d'auteur et marques » (pas de confusion sur l'origine, le parrainage ou l'affiliation) : https://transparency.meta.com/fr-fr/policies/ad-standards/intellectual-property-infringement/copyright-and-trademarks/ (repéré par recherche, page non lue en entier).
- DGCCRF, « Dropshipping : comment respecter la réglementation » : https://www.economie.gouv.fr/dgccrf/les-fiches-pratiques-et-les-faq/dropshipping-comment-respecter-la-reglementation (accès refusé à l'outil, erreur 403 : à lire par l'humain).
