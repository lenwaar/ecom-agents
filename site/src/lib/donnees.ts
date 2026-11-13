// Accès aux données de la boutique (réglages, informations légales, produits).
// Toutes les pages passent par ces fonctions : aucun chiffre ni texte légal en dur.
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export const MARQUEUR_A_VALIDER = '[À VALIDER]';

export type Boutique = CollectionEntry<'boutique'>['data'];
export type Produit = CollectionEntry<'produits'>;

/** Vrai si la valeur n'est pas encore connue. */
export function estAValider(valeur: unknown): boolean {
  return typeof valeur !== 'string' || valeur.trim() === '' || valeur.includes('À VALIDER') || valeur.includes('À VÉRIFIER');
}

export async function getBoutique(): Promise<Boutique> {
  const entree = await getEntry('boutique', 'boutique');
  if (!entree) throw new Error('src/content/reglages/boutique.yaml est introuvable.');
  return entree.data;
}

export async function getModeDemo(): Promise<boolean> {
  const entree = await getEntry('reglages', 'accueil');
  if (!entree) throw new Error('src/content/reglages/accueil.yaml est introuvable.');
  return entree.data.mode_demo;
}

/** Produits visibles sur le site : jamais les brouillons ; les démonstrations seulement en mode démo (V11). */
export async function getProduitsPublies(): Promise<Produit[]> {
  const modeDemo = await getModeDemo();
  const produits = await getCollection('produits', ({ data }) => {
    if (data.statut === 'brouillon') return false;
    if (data.statut === 'presentation') return modeDemo;
    return true;
  });
  // V15 (audit N17) : mode démonstration => aucun produit en vente.
  if (modeDemo && produits.some((p) => p.data.statut === 'en-vente')) {
    throw new Error('V15 : mode_demo est vrai alors qu\'un produit est « en-vente ». Désactivez le mode démonstration ou retirez la vente.');
  }
  return produits.sort((a, b) => a.data.ordre - b.data.ordre || a.data.nom.localeCompare(b.data.nom, 'fr'));
}

/**
 * Délais de livraison affichables (bandeau de réassurance, page Livraison) :
 * min et max des produits réellement en vente, sinon null (rien n'est en vente).
 */
export async function getDelaisEnVente(): Promise<{ min: number; max: number } | null> {
  const enVente = (await getProduitsPublies()).filter((p) => p.data.statut === 'en-vente');
  const mins = enVente.map((p) => p.data.delai_livraison_min_jours).filter((v): v is number => typeof v === 'number');
  if (enVente.length === 0 || mins.length !== enVente.length) return null;
  return { min: Math.min(...mins), max: Math.max(...enVente.map((p) => p.data.delai_livraison_max_jours)) };
}

export function formatPrix(euros: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(euros);
}

/** Lien mailto seulement si l'adresse est connue. */
export function lienEmail(email: string, objet?: string): string | undefined {
  if (estAValider(email)) return undefined;
  return `mailto:${email}${objet ? `?subject=${encodeURIComponent(objet)}` : ''}`;
}
