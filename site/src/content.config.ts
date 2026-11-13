// Collections de contenu de la boutique.
// Format des fiches produits : §5.4 de la spécification v2 (architecte-web),
// corrigé par l'audit v2 (conformite-qa). Les fiches de démonstration contiennent
// des valeurs « À VÉRIFIER » dans des champs numériques ou booléens : le schéma
// les accepte, mais les interdit sur un vrai produit publié (knowledge/decisions.md).
// Les règles de validation complètes (V1 à V15) seront ajoutées à l'étape 2 (catalogue).
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const MARQUEUR = 'À VÉRIFIER';

/** Valeur pas encore connue : chaîne qui commence par « À VÉRIFIER ». */
const aVerifier = z.string().startsWith(MARQUEUR);
const nombre = z.union([z.number(), aVerifier]);
const booleen = z.union([z.boolean(), aVerifier]);

const personne = z.object({
  nom: z.string(),
  adresse: z.string(),
  pays: z.string().optional(),
  email: z.string(),
});

const vue = z.object({ alt: z.string().min(10) });

/** Liste les champs qui contiennent un marqueur « À VÉRIFIER » (ex. « securite.fabricant.nom », « faq[1].reponse »). */
function champsAVerifier(valeur: unknown, chemin = ''): string[] {
  if (typeof valeur === 'string') return valeur.includes(MARQUEUR) ? [chemin || '(racine)'] : [];
  if (Array.isArray(valeur)) return valeur.flatMap((v, i) => champsAVerifier(v, `${chemin}[${i}]`));
  if (valeur && typeof valeur === 'object')
    return Object.entries(valeur).flatMap(([cle, v]) => champsAVerifier(v, chemin ? `${chemin}.${cle}` : cle));
  return [];
}

const produits = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/produits' }),
  schema: z
    .looseObject({
      // Identité
      nom: z.string().max(70),
      nom_court: z.string().max(30),
      slug: z.string(),
      accroche: z.string().optional(),
      collections: z.array(z.enum(['mecanique', 'vehicules', 'automates', 'idees-cadeaux'])).min(1),
      ordre: z.number().int(),
      statut: z.enum(['brouillon', 'presentation', 'en-vente', 'rupture']),
      demo: z.boolean(),
      reassort_prevu: z.string().nullable(),

      // Prix
      prix_ttc: z.number(),
      historique_prix: z.array(z.object({ date: z.string(), prix_ttc: z.number() })).min(1),
      promotion: z.unknown().nullable(),
      quantite_max: z.number().int().min(1),

      // Livraison
      frais_livraison_ttc: nombre,
      delai_livraison_min_jours: nombre,
      delai_livraison_max_jours: z.number().int().max(14), // V4 (partiel)
      expedie_depuis: z.string(),
      transporteur: z.string(),
      suivi: booleen,

      // Produit
      age_minimum: z.number().int().min(14), // V1
      difficulte: z.enum(['facile', 'moyen', 'expert']),
      temps_assemblage_heures_min: z.number(),
      temps_assemblage_heures_max: z.number(),
      nombre_pieces: nombre,
      dimensions_cm: z.union([
        z.object({ longueur: z.number(), largeur: z.number(), hauteur: z.number() }),
        aVerifier,
      ]),
      poids_g: nombre,
      materiaux: z.array(z.string()),
      mecanisme: z.union([
        z.enum(['manivelle', 'ressort', 'moteur-elastique', 'peigne', 'combinaison', 'autre', 'aucun']),
        aVerifier,
      ]),
      partie_mobile: booleen,
      decoupe_laser: booleen,
      notice_illustree: booleen,
      colle_necessaire: booleen,
      outils_necessaires: z.array(z.string()),
      outils_fournis: z.array(z.string()),
      contenu_boite: z.array(z.string()),
      benefices: z.array(z.object({ titre: z.string(), texte: z.string() })).length(3), // V8
      marque: z
        .object({ nom: z.string(), fournisseur_officiel: z.string(), canal_officiel: z.boolean() })
        .nullable(),

      // Médias
      vues: z.object({
        'trois-quarts': vue,
        face: vue,
        detail: vue,
        dessus: vue,
        situation: vue,
        boite: vue,
        etiquette: vue.nullable(),
      }),
      modele_3d: z.string(),
      video: z.object({ src: z.string(), poster: z.string(), description: z.string() }).nullable(),

      // Paiement
      lien_paiement_stripe: z.string(),

      // Sécurité du produit (GPSR)
      securite: z.object({
        fabricant: personne,
        responsable_ue: z.union([personne, aVerifier]).nullable(),
        importateur: z.union([personne, aVerifier]).nullable(),
        reference: z.string(),
        avertissements: z.array(z.string()),
        preuve_age_14: z.string(),
        marquage_jouet: booleen,
      }),

      // Contenus
      faq: z.array(z.object({ question: z.string(), reponse: z.string() })),
      seo: z.object({ titre: z.string().max(60), description: z.string().max(155) }), // V8
      audit_conformite: z.string(),
    })
    .superRefine((p, ctx) => {
      // V11 : démonstration <=> statut « presentation », et jamais de lien de paiement.
      if (p.demo !== (p.statut === 'presentation')) {
        ctx.addIssue({ code: 'custom', message: 'V11 : demo: true exige statut: presentation (et inversement).' });
      }
      if (p.statut === 'presentation' && p.lien_paiement_stripe !== '') {
        ctx.addIssue({ code: 'custom', message: 'V11 : un produit de démonstration ne peut pas avoir de lien de paiement.' });
      }
      // V4 : délai minimum <= délai maximum quand il est connu.
      if (typeof p.delai_livraison_min_jours === 'number' && p.delai_livraison_min_jours > p.delai_livraison_max_jours) {
        ctx.addIssue({ code: 'custom', message: 'V4 : delai_livraison_min_jours dépasse delai_livraison_max_jours.' });
      }
      // knowledge/decisions.md : sur un vrai produit publié, une valeur « À VÉRIFIER » bloque la construction.
      // (Les fiches de démonstration gardent leurs « À VÉRIFIER » : le site ne les affiche pas.)
      if (!p.demo && p.statut !== 'brouillon') {
        const champs = champsAVerifier(p);
        if (champs.length > 0) {
          ctx.addIssue({
            code: 'custom',
            message:
              `Produit réel « ${p.slug} » (demo: false) avec ${champs.length} valeur(s) « À VÉRIFIER » : ${champs.join(', ')}. ` +
              'Complétez ces champs avec les informations du fournisseur, ou repassez la fiche en statut « brouillon », avant de construire le site.',
          });
        }
      }
    }),
});

/** Réglages de l'accueil et du mode démonstration (§3 de la spécification v2). */
const reglages = defineCollection({
  loader: glob({ pattern: 'accueil.yaml', base: './src/content/reglages' }),
  schema: z.looseObject({
    mode_demo: z.boolean(),
    // Accueil (§4.1) : produits choisis par leur slug ; un slug inconnu fait échouer la construction (lib/accueil.ts).
    produit_comparateur: z.string(),
    produit_eclate: z.string(),
    selection_du_moment: z.array(z.string()).min(1).max(8),
    conseils_atelier: z.array(z.string()),
    faq_apercu: z.array(z.enum(['delai', 'difficulte', 'retractation', 'piece-manquante'])),
    offrir: z.object({
      message_cadeau_actif: z.boolean(),
      // knowledge/decisions.md : aucune date limite de Noël affichée en dur ; la valeur doit rester null.
      date_limite_noel: z.null(),
    }),
    lettre: z.object({ active: z.boolean(), frequence: z.string() }),
    seuil_soirees_heures: z.number().positive(),
  }),
});

/**
 * Informations de la boutique (identité du vendeur, livraison, retours, médiateur…),
 * reprises de knowledge/politiques.md. Toute valeur inconnue vaut « [À VALIDER] ».
 */
const texte = z.string();
const boutique = defineCollection({
  loader: glob({ pattern: 'boutique.yaml', base: './src/content/reglages' }),
  schema: z.object({
    nom_commercial: texte,
    vendeur: z.object({
      nom_ei: texte,
      siren: texte,
      rcs: texte,
      adresse: texte,
      email: texte,
      telephone: texte,
      directeur_publication: texte,
    }),
    tva_mention: texte,
    hebergeur: z.object({ raison_sociale: texte, adresse: texte, telephone: texte }),
    idu_rep_jouets: texte,
    idu_rep_emballages: texte,
    mediateur: z.object({ nom: texte, adresse: texte, site: texte }),
    livraison: z.object({
      zone: texte,
      delai_max_jours: z.number().int().max(14),
      frais: texte,
      transporteur: texte,
      suivi: texte,
      delai_expedition: texte,
    }),
    retours: z.object({ adresse: texte, frais: texte }),
    service_client: z.object({ delai_reponse_jours_ouvres: texte, delai_reponse_piece_manquante: texte }),
    commande: z.object({ delai_email_confirmation: texte, moyens_paiement: texte, duree_archivage: texte }),
    donnees: z.object({ service_emails: texte }),
    // Audit site A1 : tant que false, aucun texte ne promet d'accusé de réception du formulaire en ligne.
    retractation: z.object({ en_ligne_active: z.boolean() }),
    textes: z.object({ version_legale: texte }),
  }),
});

export const collections = { produits, reglages, boutique };
