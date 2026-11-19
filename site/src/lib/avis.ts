// Avis clients (V1-2) : data/avis.json à la racine du dépôt.
// Fonction pure, sans import : testée par site/outils/verifier-produit-avis.test.mjs (node --test).
// Un avis n'est affiché que s'il vient d'une commande réelle : aucun faux avis (CLAUDE.md, pratiques
// commerciales trompeuses). Sur un produit de démonstration, aucun avis n'est jamais affiché.

export interface Avis {
  reference_commande: string;
  produit: string;
  note: 1 | 2 | 3 | 4 | 5;
  texte: string;
  date: string;
  auteur: string;
}

export interface ResultatAvis {
  /** Avis valides du produit, du plus récent au plus ancien. */
  valides: Avis[];
  /** Avis du produit écartés, avec la raison (avertissement à la construction). */
  ignores: { index: number; raison: string }[];
}

/** Références de commande qui ne sont pas réelles (comparées sans accents ni majuscules). */
const REFERENCES_INTERDITES = ['exemple', 'demo', 'test'];

const sansAccents = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

/** Prénom seul, initiale seule, ou prénom + initiale (« Marie », « M. », « Marie L. », « Jean-Luc »). */
const AUTEUR = /^\p{L}[\p{L}'’-]*\.?( \p{L}\.)?$/u;

/** Date ISO (AAAA-MM-JJ, heure facultative) qui existe vraiment. */
function estDateIso(v: unknown): v is string {
  if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})?)?$/.test(v)) return false;
  const d = new Date(v.length === 10 ? `${v}T00:00:00Z` : v);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v.slice(0, 10);
}

/** Raison du rejet d'un avis, ou null s'il est valide. */
export function raisonRejet(a: unknown): string | null {
  if (!a || typeof a !== 'object') return 'pas un objet';
  const v = a as Record<string, unknown>;
  const ref = v.reference_commande;
  if (typeof ref !== 'string' || ref.trim() === '') return 'référence de commande absente';
  if (REFERENCES_INTERDITES.some((mot) => sansAccents(ref).includes(mot))) return `référence de commande non réelle (« ${ref} »)`;
  if (typeof v.produit !== 'string' || v.produit.trim() === '') return 'produit absent';
  if (!Number.isInteger(v.note) || (v.note as number) < 1 || (v.note as number) > 5) return 'note entière de 1 à 5 attendue';
  if (typeof v.texte !== 'string' || v.texte.trim() === '') return 'texte absent';
  if (!estDateIso(v.date)) return 'date ISO (AAAA-MM-JJ) attendue';
  if (typeof v.auteur !== 'string' || !AUTEUR.test(v.auteur.trim())) return 'auteur : prénom ou initiale attendu';
  return null;
}

/**
 * Avis à afficher pour un produit. Produit de démonstration : toujours aucun avis.
 * Les avis d'autres produits sont simplement filtrés ; ceux du produit qui sont invalides sont signalés.
 */
export function avisDuProduit(tous: unknown, slug: string, demo: boolean): ResultatAvis {
  const resultat: ResultatAvis = { valides: [], ignores: [] };
  if (!Array.isArray(tous)) {
    resultat.ignores.push({ index: -1, raison: 'data/avis.json doit contenir une liste' });
    return resultat;
  }
  tous.forEach((a, index) => {
    const pourCeProduit = !!a && typeof a === 'object' && (a as Record<string, unknown>).produit === slug;
    if (!pourCeProduit) return;
    if (demo) {
      resultat.ignores.push({ index, raison: 'produit de démonstration : aucun avis affiché' });
      return;
    }
    const raison = raisonRejet(a);
    if (raison) resultat.ignores.push({ index, raison });
    else resultat.valides.push(a as Avis);
  });
  resultat.valides.sort((x, y) => (x.date < y.date ? 1 : x.date > y.date ? -1 : 0));
  return resultat;
}

/** Note moyenne arrondie au dixième, ou null s'il n'y a aucun avis (jamais de note par défaut). */
export function noteMoyenne(avis: Avis[]): number | null {
  if (avis.length === 0) return null;
  return Math.round((avis.reduce((s, a) => s + a.note, 0) / avis.length) * 10) / 10;
}
