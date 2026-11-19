// Produits, avis et commandes lus dans le dossier data/ à la racine du dépôt (../data/ depuis site/).
// Lecture au moment de la construction (node:fs) : rien n'est lu dans le navigateur.
// Un fichier absent ou vide n'arrête pas la construction (liste vide) ; un fichier mal formé
// ou un produit qui viole une règle de vente l'arrête, avec un message qui dit quoi corriger.
// Ne lit JAMAIS data/commandes.exemple.json (données d'exemple, pas des commandes réelles).
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

export const MARQUEUR = 'À VÉRIFIER';
export const AGE_MINIMUM_LEGAL = 14;

export interface PersonneGpsr {
  nom: string;
  adresse: string;
  email: string;
}

export interface Visuel {
  src: string;
  alt: string;
  type: 'illustration' | 'photo' | 'rendu-3d';
}

export interface ProduitJson {
  slug: string;
  demo: boolean;
  nom: string;
  description: string;
  prix_ttc: number | null;
  frais_port_ttc: number | null;
  delai_livraison_jours: { min: number | null; max: number | null };
  age_minimum: number;
  gpsr: {
    fabricant: PersonneGpsr;
    responsable_ue: PersonneGpsr;
    reference: string;
    avertissements: string[];
  };
  visuels: Visuel[];
  paiement: { lien: string | null; actif: boolean };
}

export interface Avis {
  reference_commande: string;
  date: string;
  auteur: string;
  note: number;
  texte: string;
  produit: string;
}

interface Commande {
  reference: string;
  produit: string;
  statut: string;
}

/** Dossier data/ du dépôt. La construction se lance depuis site/ (npm run build). */
export function dossierData(): string {
  const candidats = [resolve(process.cwd(), '..', 'data'), resolve(process.cwd(), 'data')];
  return candidats.find((c) => existsSync(c)) ?? candidats[0];
}

/** Lit un JSON ; renvoie null si le fichier est absent ou vide. Erreur claire s'il est mal formé. */
function lireJson(chemin: string): unknown {
  if (!existsSync(chemin)) return null;
  const texte = readFileSync(chemin, 'utf-8').replace(/^﻿/, '').trim();
  if (texte === '') return null;
  try {
    return JSON.parse(texte);
  } catch (e) {
    throw new Error(`${chemin} : JSON invalide (${(e as Error).message}).`);
  }
}

/** Vrai si la valeur (texte, liste ou objet, en profondeur) contient « À VÉRIFIER ». */
export function contientMarqueur(valeur: unknown): boolean {
  if (typeof valeur === 'string') return valeur.includes(MARQUEUR);
  if (Array.isArray(valeur)) return valeur.some(contientMarqueur);
  if (valeur && typeof valeur === 'object') return Object.values(valeur).some(contientMarqueur);
  return false;
}

/** Texte affichable : null si vide ou « À VÉRIFIER » (masqué sur une démonstration, leçon 10). */
export function texteConnu(v: unknown): string | null {
  if (typeof v !== 'string') return null;
  const t = v.trim();
  return t === '' || t.includes(MARQUEUR) ? null : t;
}

const estTexte = (v: unknown): v is string => typeof v === 'string';
const estNombreOuNull = (v: unknown): v is number | null => v === null || (typeof v === 'number' && Number.isFinite(v) && v >= 0);

function validerPersonne(v: unknown, champ: string, erreurs: string[]) {
  if (!v || typeof v !== 'object') return erreurs.push(`${champ} doit être un objet { nom, adresse, email }`);
  const p = v as Record<string, unknown>;
  for (const k of ['nom', 'adresse', 'email']) if (!estTexte(p[k])) erreurs.push(`${champ}.${k} doit être un texte`);
}

/** Vérifie le format et les règles de vente d'un produit ; lève une erreur listant tous les problèmes. */
export function validerProduit(brut: unknown, fichier: string): ProduitJson {
  const erreurs: string[] = [];
  if (!brut || typeof brut !== 'object' || Array.isArray(brut)) throw new Error(`${fichier} : un produit doit être un objet JSON.`);
  const p = brut as Record<string, unknown>;

  // Format
  if (!estTexte(p.slug) || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug)) erreurs.push('slug : minuscules, chiffres et tirets seulement');
  if (typeof p.demo !== 'boolean') erreurs.push('demo doit valoir true ou false');
  if (!estTexte(p.nom)) erreurs.push('nom doit être un texte');
  if (!estTexte(p.description)) erreurs.push('description doit être un texte');
  if (!estNombreOuNull(p.prix_ttc)) erreurs.push('prix_ttc : nombre positif ou null');
  if (!estNombreOuNull(p.frais_port_ttc)) erreurs.push('frais_port_ttc : nombre positif ou null');
  const d = p.delai_livraison_jours as Record<string, unknown> | undefined;
  if (!d || typeof d !== 'object' || !estNombreOuNull(d.min) || !estNombreOuNull(d.max)) {
    erreurs.push('delai_livraison_jours : { min, max } (nombres ou null)');
  } else if (typeof d.min === 'number' && typeof d.max === 'number' && d.min > d.max) {
    erreurs.push('delai_livraison_jours : min est plus grand que max');
  }
  if (typeof p.age_minimum !== 'number' || !Number.isFinite(p.age_minimum)) erreurs.push('age_minimum doit être un nombre');
  else if (p.age_minimum < AGE_MINIMUM_LEGAL) erreurs.push(`age_minimum vaut ${p.age_minimum} : ${AGE_MINIMUM_LEGAL} au minimum`);
  const g = p.gpsr as Record<string, unknown> | undefined;
  if (!g || typeof g !== 'object') erreurs.push('gpsr doit être un objet');
  else {
    validerPersonne(g.fabricant, 'gpsr.fabricant', erreurs);
    validerPersonne(g.responsable_ue, 'gpsr.responsable_ue', erreurs);
    if (!estTexte(g.reference)) erreurs.push('gpsr.reference doit être un texte');
    if (!Array.isArray(g.avertissements) || !g.avertissements.every(estTexte)) erreurs.push('gpsr.avertissements : liste de textes');
  }
  if (!Array.isArray(p.visuels)) erreurs.push('visuels doit être une liste');
  else
    p.visuels.forEach((v: unknown, i: number) => {
      const x = v as Record<string, unknown>;
      if (!x || !estTexte(x.src) || !x.src.startsWith('/')) erreurs.push(`visuels[${i}].src : chemin commençant par « / » (dans site/public/)`);
      if (!x || !estTexte(x.alt)) erreurs.push(`visuels[${i}].alt doit être un texte`);
      if (!x || !['illustration', 'photo', 'rendu-3d'].includes(x.type as string)) erreurs.push(`visuels[${i}].type : illustration, photo ou rendu-3d`);
    });
  const pay = p.paiement as Record<string, unknown> | undefined;
  if (!pay || typeof pay !== 'object' || !(pay.lien === null || estTexte(pay.lien)) || typeof pay.actif !== 'boolean') {
    erreurs.push('paiement : { lien: texte ou null, actif: true ou false }');
  }

  // Règles de vente (seulement si le format est bon, pour des messages lisibles)
  if (erreurs.length === 0) {
    const pr = p as unknown as ProduitJson;
    const lien = pr.paiement.lien?.trim() ?? '';
    if (pr.demo) {
      if (lien !== '') erreurs.push('produit de démonstration avec un lien de paiement : le retirer (paiement.lien: null)');
      if (pr.paiement.actif) erreurs.push('produit de démonstration avec paiement.actif true : mettre false');
    } else {
      if (contientMarqueur(pr)) erreurs.push(`vrai produit (demo: false) qui contient encore « ${MARQUEUR} » : compléter toutes les valeurs`);
      if (pr.prix_ttc === null) erreurs.push('vrai produit sans prix (prix_ttc: null)');
      if (pr.frais_port_ttc === null) erreurs.push('vrai produit sans frais de port (frais_port_ttc: null)');
      if (pr.delai_livraison_jours.max === null) erreurs.push('vrai produit sans délai de livraison maximum');
      if (pr.paiement.actif && !lien.startsWith('https://buy.stripe.com/')) erreurs.push('paiement actif sans lien https://buy.stripe.com/');
    }
  }

  if (erreurs.length > 0) throw new Error(`${fichier} refusé :\n  - ${erreurs.join('\n  - ')}`);
  return p as unknown as ProduitJson;
}

/** Tous les produits de data/produits/*.json, validés, triés par slug. Dossier absent : liste vide. */
export function chargerProduits(): ProduitJson[] {
  const dossier = join(dossierData(), 'produits');
  if (!existsSync(dossier)) return [];
  const produits: ProduitJson[] = [];
  for (const nom of readdirSync(dossier).filter((f) => f.endsWith('.json')).sort()) {
    const brut = lireJson(join(dossier, nom));
    if (brut === null) continue;
    produits.push(validerProduit(brut, `data/produits/${nom}`));
  }
  const slugs = new Set<string>();
  for (const p of produits) {
    if (slugs.has(p.slug)) throw new Error(`data/produits : slug « ${p.slug} » en double.`);
    slugs.add(p.slug);
  }
  return produits.sort((a, b) => a.slug.localeCompare(b.slug));
}

const avertis = new Set<string>();
function avertir(message: string) {
  if (avertis.has(message)) return;
  avertis.add(message);
  console.warn(`[avis] ${message}`);
}

/**
 * Avis affichables pour un produit. Un avis n'est retenu QUE si sa reference_commande est
 * non vide et correspond à une commande « payee » de data/commandes.json, pour ce même produit.
 * Tout autre avis est ignoré, avec un avertissement dans la console de construction.
 */
export function avisVerifies(slug: string): Avis[] {
  const dossier = dossierData();
  const brutAvis = lireJson(join(dossier, 'avis.json')) as { avis?: unknown } | null;
  const brutCommandes = lireJson(join(dossier, 'commandes.json')) as { commandes?: unknown } | null;
  const listeAvis = Array.isArray(brutAvis?.avis) ? (brutAvis.avis as Record<string, unknown>[]) : [];
  const commandes = (Array.isArray(brutCommandes?.commandes) ? brutCommandes.commandes : []) as Partial<Commande>[];
  const payees = new Map<string, Partial<Commande>>();
  for (const c of commandes) if (c && estTexte(c.reference) && c.reference.trim() !== '' && c.statut === 'payee') payees.set(c.reference.trim(), c);

  const retenus: Avis[] = [];
  listeAvis.forEach((a, i) => {
    if (!a || a.produit !== slug) return;
    const ref = estTexte(a.reference_commande) ? a.reference_commande.trim() : '';
    const id = `avis n°${i + 1} (${slug})`;
    if (ref === '') return avertir(`${id} ignoré : reference_commande vide.`);
    const commande = payees.get(ref);
    if (!commande) return avertir(`${id} ignoré : aucune commande payée « ${ref} » dans data/commandes.json.`);
    if (commande.produit !== slug) return avertir(`${id} ignoré : la commande « ${ref} » porte sur un autre produit.`);
    const note = a.note;
    if (typeof note !== 'number' || !Number.isInteger(note) || note < 1 || note > 5) return avertir(`${id} ignoré : note hors de 1 à 5.`);
    if (!estTexte(a.texte) || a.texte.trim() === '' || !estTexte(a.auteur) || !estTexte(a.date)) return avertir(`${id} ignoré : texte, auteur ou date manquant.`);
    retenus.push({ reference_commande: ref, date: a.date, auteur: a.auteur.trim(), note, texte: a.texte.trim(), produit: slug });
  });
  return retenus.sort((a, b) => b.date.localeCompare(a.date));
}
