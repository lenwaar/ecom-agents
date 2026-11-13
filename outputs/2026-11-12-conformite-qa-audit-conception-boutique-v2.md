---
agent: conformite-qa
statut: validé   # toujours cette valeur
valide_par: humain
date_validation: 2026-11-13
date: 2026-11-12
mode: audit
verdict: À CORRIGER
suite: outputs/2026-11-12-conformite-qa-audit-conception-boutique-v2-partie-2.md (nouveautés v2, panier moyen, points [PRO], sources)
sources: [CLAUDE.md, knowledge/ (niche, contraintes, politiques proposé, prix-et-marges proposé, marque, direction-design, catalogue-demo), outputs/2026-11-12-conformite-qa-audit-conception-boutique.md (audit v1, S1 à S11), outputs/2026-11-12-architecte-web-conception-boutique-v2.md, outputs/2026-11-12-architecte-web-conception-boutique-v2-partie-2.md, Légifrance code de la consommation art. L112-1-1, L121-17, L216-1 à L216-8, L217-5, L221-15 ; code de l'environnement art. L541-9-1 ; directive (UE) 2024/825 (consultés le 2026-11-12, détail en partie 2 §6)]
prochaine-etape: architecte-web intègre les 20 corrections de la v2 (dont 5 prioritaires) dans une v3 ou un correctif ; l'humain tranche les décisions de la partie 2 §5 ; puis rédaction des textes définitifs, audit des pages rédigées et recette (rétractation, Stripe, mode démonstration) avant toute mise en ligne
---

# Audit conformité : conception de la boutique v2 (architecte-web, 2026-11-12)

> Livrable audité, lu en entier comme un seul document : `outputs/2026-11-12-architecte-web-conception-boutique-v2.md` (sections 1 à 4) et `outputs/2026-11-12-architecte-web-conception-boutique-v2-partie-2.md` (sections 5 à 10). Aucun des deux n'a été modifié.
> Ce rapport est lui aussi en deux fichiers : ce fichier (verdict, synthèse, suivi des 21 corrections) et `outputs/2026-11-12-conformite-qa-audit-conception-boutique-v2-partie-2.md` (nouveautés de la v2, panier moyen, réponses aux points [PRO], professionnel, sources).
> Je ne suis pas avocat : j'identifie les obligations et je cite les textes. **[PRO]** = à confirmer par un juriste ou un expert-comptable. Les références [S1] à [S11] renvoient aux sources de l'audit v1 ; [T1] à [T9] aux sources lues aujourd'hui (partie 2 §6).

## 1. Verdict global

**À CORRIGER.** Aucun point bloquant dans la conception.

- **Les 21 corrections de l'audit v1 sont toutes intégrées**, dont les 5 prioritaires, et correctement (§3 ci-dessous). Le travail de suivi (tableau §6.0 de la partie 2 du livrable) est exact : chaque correction se retrouve bien à l'endroit annoncé.
- **Les nouveautés de la v2 sont saines sur le fond** : aucun compte à rebours, aucune urgence artificielle, aucun stock affiché, questionnaire sans cookie ni stockage, lettre d'information à double confirmation sans contrepartie, produits de démonstration non achetables et non indexés, lots sans prix barré, articles facultatifs jamais pré-ajoutés.
- Il reste **20 corrections nouvelles**, dont **5 prioritaires (P)** :
  1. **N24 P** : articles facultatifs sur la page Stripe : informations précontractuelles et informations de sécurité (GPSR) absentes de la page où le client les ajoute ;
  2. **N5 P** : date limite de Noël : elle doit disparaître dès qu'elle est passée, et elle peut rendre la date de livraison « essentielle » (résolution immédiate du contrat si elle n'est pas tenue) ;
  3. **N17 P** : mode démonstration : interdire toute vente réelle tant que le bandeau « rien n'est en vente » est affiché ;
  4. **N19 P** : légende de la vue 3D d'un vrai produit : « indicatif » ne protège pas ; ce qui est montré compte pour la conformité ;
  5. **N2 P** : accroches globales non couvertes par la règle V13 (« engrenages découpés au laser », « notice illustrée », « manivelle, ressort ou moteur élastique ») alors que le catalogue contient un book nook sans engrenage et un coffre-fort sans manivelle.

| Niveau | Suivi des 21 corrections v1 (§3) | Nouveaux points v2 (partie 2) | Total |
|---|---|---|---|
| ✅ conforme | 21 (+ la remarque du point 6, intégrée) | 11 | 32 |
| ⚠️ à corriger | 0 (une remarque mineure reprise en N31) | 20 (dont 5 prioritaires) | 20 |
| ⛔ bloquant | 0 | 0 | 0 |

**Rien n'est publiable en l'état** : les prérequis bloquants de l'audit v1 (identité, SIREN, médiateur, IDU, frais et délais réels, encadré D. 211-2 recopié, bloc sécurité de chaque vrai produit, recette de la rétractation, inventaire des traceurs, textes définitifs audités) restent tous à remplir. Ce n'est pas un défaut de conception. Ils sont repris en partie 2 §4 avec 3 ajouts propres à la v2.

## 2. Synthèse par thème

| Thème | Constat | Renvoi |
|---|---|---|
| Corrections v1 | 21 / 21 intégrées, les 5 prioritaires au mot près (champ piège, droits présentés comme des droits, CGV langue et archivage, encadré officiel, aucune expédition avant l'email de confirmation) | §3 |
| Accueil animé | Pas de technique trompeuse. À corriger : accroches globales (N2), visuels d'ambiance d'un vrai produit (N3), bouton pause des animations en boucle (N4), date limite de Noël (N5) | Partie 2, §1.1 |
| Questionnaire | Conforme (aucun cookie, aucun `localStorage`, recommandation déterministe et expliquée). Une phrase à ajuster (« ni transmises », N10) | Partie 2, §1.2 |
| Offrir, message cadeau | Règles d'honnêteté conformes. Données du message cadeau et engagement d'insertion à préciser (N12) | Partie 2, §1.3 |
| Lettre d'information | Mécanique conforme (case non cochée, double confirmation par bouton, aucune contrepartie, désinscription en un clic). Texte de consentement à préciser (N14), durées à faire valider (N15) | Partie 2, §1.4 |
| Démonstration | Bandeau, achat désactivé, aucune `Offer`, `noindex` : conforme. Ajouter une règle d'exclusion « démonstration ⇔ aucune vente » (N17) et protéger l'adresse d'aperçu (N18) | Partie 2, §1.5 |
| 3D, galerie, visuels | Chargement au clic conforme. Légende de la 3D (N19) et interdiction des formules « non contractuel » (N22) | Partie 2, §1.6 |
| Panier moyen | Frais uniques et lots sans prix barré : bonne base. Articles facultatifs à compléter (N24), affichage des lots à sécuriser (N25), rétractation partielle et seuil (N26) | Partie 2, §2 |
| Points [PRO] | 11 points listés par le livrable (n° 20 à 30) : 4 tranchés avec un texte officiel (24, 28, 30, + transfert des risques de l'art. 9 des CGV), 3 tranchés en partie (25, 27, 22), 5 restent pour un professionnel (20, 21, 23, 26, 29) | Partie 2, §3 |

## 3. Suivi des 21 corrections de l'audit v1

Colonne « v2 » : où la correction se trouve dans le livrable (P1 = partie 1, P2 = partie 2). Vérification faite sur le texte du livrable, pas seulement sur le tableau §6.0.

| Point v1 | Correction demandée | Où dans la v2 | Contrôle | Niveau |
|---|---|---|---|---|
| 2 | SIREN et RCS si applicable ; hébergeur = entité Cloudflare exacte | P2 §6.3 (1) et (3) | Texte conforme à la correction, **[PRO]** sur le RCS conservé | ✅ |
| **3 P** | CGV : langue, archivage des commandes de 120 € ou plus et accès | P2 §6.4 art. 6 | Texte repris mot pour mot. La durée reste « [durée légale, À VÉRIFIER…] » : c'est un marqueur à remplir avant publication, je n'ai pas pu relire aujourd'hui l'article fixant la durée (voir prérequis, partie 2 §4) | ✅ |
| **4 P** | Encadré officiel de l'annexe D. 211-2, partie A, recopié mot pour mot | P2 §6.4 art. 11 ; P1 §4.8 (5) | Bonne annexe, bon lien Légifrance, interdiction de l'encadré D. 211-4 et des modèles de blog. Contrôle au mot près à l'audit des pages rédigées | ✅ |
| 5 | Texte « kit commencé » | P1 §4.8 (3) ; P2 §6.4 art. 10 | Texte identique à celui proposé, interdits rappelés, **[PRO]** conservé | ✅ |
| 6 (remarque) | Identification acceptée par le seul « produit concerné » | P2 §6.2 (2) | « au moins un des trois champs » | ✅ |
| **7 P** | Champ piège : enregistrer quand même, drapeau, message neutre, alerte | P2 §6.2 fonction (1) | Conforme, nom non sémantique, `autocomplete="off"`, `tabindex="-1"` | ✅ |
| 8 | Limite 20 envois / IP / heure, message explicite, saisie conservée | P2 §6.2 fonction (1) | Conforme ; IP non conservée | ✅ |
| 9 | Échec de l'accusé : 3 essais, alerte, envoi manuel ≤ 24 h, trace, PDF, test mensuel | P2 §6.2 fonction (9) | Conforme, **[PRO]** sur les 24 h conservé | ✅ |
| 10 | Durées de conservation | P2 §6.5 (4) | Reprises, **[PRO]** ; nouvelles durées (lettre, message cadeau) traitées en N12 et N15 | ✅ |
| 11 | Bouton « Payer », capture de recette, portefeuilles | P2 §5.8 | `submit_type = pay`, capture mobile `locale=fr`, libellés interdits, portefeuilles **[PRO]** si logo seul | ✅ |
| 12 | Case CGV bloquant aussi les portefeuilles ; URL à jour | P2 §5.8 | Conforme (recette prévue) | ✅ |
| **14 P** | Aucune expédition avant l'email de confirmation ; PDF de la version acceptée ; liste de contrôle | P1 §2 étape 9, §4.6, §4.8 ; P2 §6.4 art. 8, §6.7 | Règle présente à 5 endroits, y compris dans les CGV et la page Merci | ✅ |
| 15 | Inventaire réel des traceurs ; cookies Cloudflare listés ; aucun script Stripe | P2 §6.6 | Conforme. Nouveaux scripts de la v2 (GSAP, Three.js) servis depuis notre domaine : aucun traceur ajouté | ✅ |
| 16 | Pas de Cloudflare Web Analytics au lancement | P2 §6.6, §8 | Recommandation suivie, limite de mesure du questionnaire assumée | ✅ |
| 19 | Réductions successives | P2 §5.5 V6, §5.7 | Conforme, et confirmé aujourd'hui par le texte de l'article L112-1-1 [T1] | ✅ |
| 20 | « Revendeur indépendant », pas de logo | P2 §5.2 bloc 14 | Texte repris, marque en texte seulement | ✅ |
| 22 | `fabricant.pays` obligatoire | P2 §5.4, V2, V3 | Conforme | ✅ |
| 24 | `marquage_jouet` | P2 §5.4, V12 | Conforme | ✅ |
| **26 P** | Droits légaux présentés comme des droits | P1 §4.0 bandeau, §4.1.9, §4.1.11, §4.7 ; P2 §5.2 bloc 7 | Conforme partout : « Droit de rétractation 14 jours », « Vos droits et notre façon de travailler », pièce manquante = garantie légale, « aucune fausse promotion » supprimé. Remarque mineure sur « comme pour tout achat en ligne » : N31 | ✅ |
| 27 | Accroches globales calculées ; liste V10 complétée | P1 §4.1.2 ; P2 V10, V13 | Liste V10 complétée comme demandé. V13 couvre « quelques soirées » et « sans colle ni outil ». **Mais** la v2 ajoute d'autres accroches globales non couvertes : nouveau point N2 | ✅ (pour la correction v1) |
| 28 | « Indisponible pour le moment » ; `reassort_prevu` | P1 §4.2 (4) ; P2 §5.2 bloc 6, §5.4 | Conforme | ✅ |
| 31 | Confidentialité : UTM, IP, rôle de Stripe et Cloudflare, transferts | P2 §6.5 | Conforme, et étendu aux nouveaux traitements (lettre, message cadeau, questionnaire) | ✅ |

**Conclusion du suivi** : 21 corrections sur 21 intégrées. Aucune régression constatée sur les points déjà conformes en v1 (pages obligatoires, bouton « Renoncer au contrat ici », bloc GPSR toujours ouvert, 14 ans et plus, absence de compte à rebours, de stock et de faux avis, prix final et mention 293 B).

La suite (nouveautés de la v2, panier moyen, réponses aux points [PRO], ce qui doit être revu par un professionnel, sources) est dans `outputs/2026-11-12-conformite-qa-audit-conception-boutique-v2-partie-2.md`.
