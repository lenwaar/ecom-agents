// Catalogue : collections, niveaux, statistiques calculées et chemins d'images.
// Sources : §4.1.5, §4.1.8, §4.2, §4.3 de la spécification v2 (partie 1) et §5.3 (partie 2),
// corrigés par l'audit v2 (N2 : accroches globales vraies pour chaque produit ; N8 : « suivie »).
// Aucun produit n'est écrit ici : tout vient de src/content/produits/ via lib/donnees.ts.
import type { Produit } from './donnees';
import { formatPrix } from './donnees';

export type Niveau = 'facile' | 'moyen' | 'expert';
export type SlugCollection = 'mecanique' | 'vehicules' | 'automates' | 'pour-debuter' | 'idees-cadeaux';
export type NomVue = 'trois-quarts' | 'face' | 'detail' | 'dessus' | 'situation' | 'boite';

/** Ordre de la galerie (§5.3) : la première vue est la principale. */
export const VUES: NomVue[] = ['trois-quarts', 'face', 'detail', 'dessus', 'situation', 'boite'];

/** Dimensions réelles des rendus (rapport studio-visuel : 4:5, 800 × 1000 et 1600 × 2000). */
export const LARGEURS_IMAGE = [800, 1600] as const;
export const RATIO_IMAGE = 5 / 4;

export function cheminVue(slug: string, vue: NomVue, largeur: 800 | 1600): string {
  return `/produits/${slug}/${vue}-${largeur}.webp`;
}

export function srcsetVue(slug: string, vue: NomVue): string {
  return LARGEURS_IMAGE.map((l) => `${cheminVue(slug, vue, l)} ${l}w`).join(', ');
}

// ---------------------------------------------------------------------------
// Niveaux (§4.1.8)
// ---------------------------------------------------------------------------

export const NIVEAUX: { slug: Niveau; libelle: string; rang: 1 | 2 | 3; definition: string }[] = [
  { slug: 'facile', libelle: 'Facile', rang: 1, definition: 'Pour une première maquette. Un mécanisme simple, peu de réglages.' },
  {
    slug: 'moyen',
    libelle: 'Moyen',
    rang: 2,
    definition: 'Vous avez déjà monté une maquette. Plus de pièces et quelques réglages (jeu des engrenages, tension).',
  },
  { slug: 'expert', libelle: 'Expert', rang: 3, definition: 'Pour les habitués. Mécanismes fins, ajustements précis, plusieurs séances.' },
];

export const INTRO_ECHELLE =
  "Notre échelle, établie à partir du nombre de pièces, du temps d'assemblage et du nombre de réglages. Elle peut différer de celle du fabricant.";

export function niveau(slug: Niveau) {
  const n = NIVEAUX.find((x) => x.slug === slug);
  if (!n) throw new Error(`Niveau inconnu : ${slug}`);
  return n;
}

// ---------------------------------------------------------------------------
// Libellés des champs produit
// ---------------------------------------------------------------------------

export const LIBELLES_MECANISME: Record<string, string> = {
  manivelle: 'Manivelle',
  ressort: 'Ressort',
  'moteur-elastique': 'Moteur élastique',
  peigne: 'Peigne musical',
  combinaison: 'Serrure à combinaison',
  autre: 'Autre',
  aucun: 'Aucun (scène fixe)',
};

/** Vrai si la valeur est connue (ni « À VÉRIFIER », ni vide). */
export function estConnu<T>(valeur: T | string | null | undefined): valeur is T {
  if (valeur === null || valeur === undefined) return false;
  if (typeof valeur === 'string') return valeur.trim() !== '' && !valeur.includes('À VÉRIFIER') && !valeur.includes('À VALIDER');
  return true;
}

// ---------------------------------------------------------------------------
// Valeurs « À VÉRIFIER » sur les produits de démonstration (knowledge/decisions.md)
// ---------------------------------------------------------------------------

export const MARQUEUR_A_VERIFIER = 'À VÉRIFIER';

/** Vrai si la valeur est vide ou contient « À VÉRIFIER » (y compris dans une liste ou un objet). */
export function contientAVerifier(valeur: unknown): boolean {
  if (valeur === null || valeur === undefined) return true;
  if (typeof valeur === 'string') return valeur.trim() === '' || valeur.includes(MARQUEUR_A_VERIFIER);
  if (Array.isArray(valeur)) return valeur.some(contientAVerifier);
  if (typeof valeur === 'object') return Object.values(valeur).some(contientAVerifier);
  return false;
}

/**
 * Produit de démonstration : retire d'un texte chaque phrase qui contient « À VÉRIFIER ».
 * Renvoie '' s'il ne reste rien (la ligne n'est alors pas affichée).
 * « Notice d'assemblage : À VÉRIFIER » → '' ; « Écrivez-nous. Délai : À VÉRIFIER. » → « Écrivez-nous. »
 */
export function texteDemo(texte: string): string {
  if (!texte.includes(MARQUEUR_A_VERIFIER)) return texte.trim();
  return texte
    .split(/(?<=[.!?])\s+/)
    .filter((phrase) => !phrase.includes(MARQUEUR_A_VERIFIER))
    .join(' ')
    .trim();
}

/** Liste de textes d'un produit de démonstration, sans les éléments inconnus. */
export function listeDemo(valeurs: string[]): string[] {
  return valeurs.map(texteDemo).filter((v) => v !== '');
}

export function formatHeures(min: number, max: number): string {
  return min === max ? `${min} h` : `${min} à ${max} h`;
}

function fourchette(valeurs: number[], format: (n: number) => string): string {
  const min = Math.min(...valeurs);
  const max = Math.max(...valeurs);
  return min === max ? format(min) : `de ${format(min)} à ${format(max)}`;
}

/** Ligne calculée « [n] modèles · de [min] à [max] h · de [prix min] à [prix max] » (§4.3). */
export function ligneStatistiques(produits: Produit[]): string {
  if (produits.length === 0) return 'Aucun modèle pour le moment';
  const n = produits.length;
  const heures = fourchette(
    produits.flatMap((p) => [p.data.temps_assemblage_heures_min, p.data.temps_assemblage_heures_max]),
    (h) => `${h}`,
  );
  const prix = fourchette(
    produits.map((p) => p.data.prix_ttc),
    formatPrix,
  );
  // Audit site A3 : fourchette de prix de démonstration toujours signalée comme indicative.
  const demo = produits.every((p) => p.data.demo);
  return `${n} modèle${n > 1 ? 's' : ''} · ${heures} h · ${prix}` + (demo ? ' (prix indicatifs de démonstration)' : '');
}

// ---------------------------------------------------------------------------
// Collections (§4.1.5 et §4.3)
// ---------------------------------------------------------------------------

export interface Collection {
  slug: SlugCollection;
  nom: string;
  /** Ligne italique laiton du héros (§4.3). */
  ligneItalique: string;
  /** Phrase de présentation (carte §4.1.5). */
  phrase: string;
  titreSeo: string;
  descriptionSeo: string;
  /** Produit dont la vue « situation » illustre la carte compacte de la collection. */
  visuel: NomVue;
}

const tous = (produits: Produit[], test: (p: Produit) => boolean) => produits.length > 0 && produits.every(test);

/**
 * Produits d'une collection. « pour-debuter » est calculé (difficulte: facile, §4.1.5) ;
 * les autres viennent du champ `collections` de chaque fiche.
 */
export function produitsDeCollection(produits: Produit[], slug: SlugCollection): Produit[] {
  if (slug === 'pour-debuter') return produits.filter((p) => p.data.difficulte === 'facile');
  return produits.filter((p) => (p.data.collections as string[]).includes(slug));
}

/**
 * Textes des collections. Les phrases qui affirment un mouvement ne sont générées que si elles
 * sont vraies pour CHAQUE produit publié de la collection (audit N2, e) ; sinon texte neutre.
 */
export function collections(produits: Produit[]): Collection[] {
  const meca = produitsDeCollection(produits, 'mecanique');
  const vehi = produitsDeCollection(produits, 'vehicules');
  const mecaBouge = tous(meca, (p) => p.data.partie_mobile === true);
  const vehiRoule = tous(vehi, (p) => p.data.partie_mobile === true);
  const auto = produitsDeCollection(produits, 'automates');
  const autoBouge = tous(auto, (p) => p.data.partie_mobile === true);

  return [
    {
      slug: 'mecanique',
      nom: 'Mécanique',
      ligneItalique: mecaBouge ? 'qui tourne vraiment.' : 'à assembler.',
      phrase: mecaBouge
        ? 'Engrenages, cames et mécanismes à assembler. Des objets qui bougent vraiment.'
        : 'Engrenages, cames et mécanismes à assembler.',
      titreSeo: 'Maquettes mécaniques en bois à assembler | Rouage & Laiton',
      descriptionSeo:
        "Maquettes mécaniques en bois à assembler soi-même, pour adultes, à partir de 14 ans. Temps d'assemblage et difficulté indiqués sur chaque fiche.",
      visuel: 'situation',
    },
    {
      slug: 'vehicules',
      nom: 'Véhicules',
      ligneItalique: 'sur roues et sur rails.',
      phrase: vehiRoule
        ? 'Locomotive, voiture rétro : des roues qui tournent.'
        : 'Locomotive, voiture rétro : des véhicules en bois à assembler.',
      titreSeo: 'Maquettes de véhicules en bois à assembler | Rouage & Laiton',
      descriptionSeo:
        "Maquettes de véhicules en bois à assembler soi-même, pour adultes, à partir de 14 ans. Temps d'assemblage et difficulté sur chaque fiche.",
      visuel: 'situation',
    },
    {
      slug: 'automates',
      nom: 'Automates',
      ligneItalique: autoBouge ? 'à la manivelle.' : 'à assembler.',
      phrase: autoBouge
        ? 'Une manivelle à tourner, et la scène se met en mouvement.'
        : 'Des automates en bois à manivelle, à assembler.',
      titreSeo: 'Automates en bois à manivelle à assembler | Rouage & Laiton',
      descriptionSeo:
        "Automates en bois à manivelle à assembler soi-même, pour adultes, à partir de 14 ans. Temps d'assemblage et difficulté indiqués sur chaque fiche.",
      visuel: 'situation',
    },
    {
      slug: 'pour-debuter',
      nom: 'Pour débuter',
      ligneItalique: 'une première maquette.',
      phrase: 'Nos modèles de niveau Facile, pour une première maquette.',
      titreSeo: 'Maquettes en bois faciles pour débuter | Rouage & Laiton',
      descriptionSeo:
        "Maquettes en bois de niveau Facile, pour une première maquette. Pour adultes, à partir de 14 ans. Temps d'assemblage indiqué sur chaque fiche.",
      visuel: 'situation',
    },
    {
      slug: 'idees-cadeaux',
      nom: 'Idées cadeaux',
      ligneItalique: 'qui se construisent.',
      phrase: "Une sélection de maquettes à offrir. Chaque fiche indique le temps d'assemblage et la difficulté.",
      titreSeo: 'Idées cadeaux : maquettes en bois à assembler | Rouage & Laiton',
      descriptionSeo:
        "Maquettes en bois à offrir, à assembler soi-même. Pour adultes, à partir de 14 ans. Temps d'assemblage et difficulté indiqués sur chaque fiche.",
      visuel: 'situation',
    },
  ];
}

/** Les 4 grandes collections présentées en cartes (§4.1.5) ; « Idées cadeaux » est transversale. */
export const COLLECTIONS_PRINCIPALES: SlugCollection[] = ['mecanique', 'vehicules', 'automates', 'pour-debuter'];

/** Libellé de la collection principale d'un produit (fil d'Ariane, §5.2 bloc 1). */
export function collectionPrincipale(produit: Produit, liste: Collection[]): Collection {
  const slug = produit.data.collections[0] as SlugCollection;
  const c = liste.find((x) => x.slug === slug);
  if (!c) throw new Error(`Collection inconnue « ${slug} » dans ${produit.id}.`);
  return c;
}

// ---------------------------------------------------------------------------
// Achat (§5.1, §5.2 bloc 6, V11, V15)
// ---------------------------------------------------------------------------

/**
 * Lien « Acheter » seulement pour un vrai produit en vente avec un Payment Link Stripe public ;
 * sinon libellé du bouton désactivé. Aucune clé, aucune intégration Stripe : un simple lien.
 */
export function etatAchat(produit: Produit): { lienAchat?: string; libelleDesactive: string } {
  const p = produit.data;
  const enVente = !p.demo && p.statut === 'en-vente' && p.lien_paiement_stripe.startsWith('https://buy.stripe.com/');
  if (enVente) {
    return {
      lienAchat: `${p.lien_paiement_stripe}?locale=fr&utm_content=${encodeURIComponent(p.slug)}`,
      libelleDesactive: '',
    };
  }
  const reassort = typeof p.reassort_prevu === 'string' && p.reassort_prevu.trim() !== '';
  if (p.demo) return { libelleDesactive: 'Non disponible : produit de démonstration' };
  if (p.statut === 'rupture') return { libelleDesactive: reassort ? 'Bientôt de retour' : 'Indisponible pour le moment' };
  return { libelleDesactive: 'Non disponible' };
}
