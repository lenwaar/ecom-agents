// Produits du modèle de page (V1-1) : données dans data/produits/<slug>.json à la racine du dépôt.
// Fonctions pures, sans import : testées par site/outils/verifier-produit-avis.test.mjs (node --test).
//
// Règles (la construction échoue sinon) :
// - type « numerique » (modèle de la boutique depuis le 2026-11-14) : frais_port_ttc, age_minimum et gpsr valent
//   « sans objet » (le règlement GPSR (UE) 2023/988 vise les produits physiques) ; format obligatoire une fois vendu ;
// - type « physique » : âge minimum et mentions GPSR obligatoires une fois vendu (« sans objet » refusé) ;
// - produit vendu (demo: false) : aucun champ obligatoire à null, paiement actif avec une url https ;
// - produit de démonstration (demo: true) : paiement.actif doit valoir false et paiement.url null.

export const SANS_OBJET = 'sans objet';

export interface Coordonnees {
  nom: string | null;
  adresse: string | null;
  contact: string | null;
}

export interface Gpsr {
  fabricant: Coordonnees;
  personne_responsable_ue: Coordonnees;
  avertissements: string[] | null;
  reference: string | null;
}

export interface ProduitModele {
  slug: string;
  nom: string;
  type: 'numerique' | 'physique';
  demo: boolean;
  /** Numérique : format du fichier (ex. tableur Excel et Google Sheets). Physique : null ou « sans objet ». */
  format: string | null | typeof SANS_OBJET;
  prix_ttc: number | null;
  frais_port_ttc: number | null | typeof SANS_OBJET;
  delai: string | null;
  age_minimum: number | null | typeof SANS_OBJET;
  gpsr: Gpsr | typeof SANS_OBJET;
  description: string;
  visuels: { src: string; alt: string }[];
  paiement: { actif: boolean; url: string | null };
}

const estObjet = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const estTexte = (v: unknown): v is string => typeof v === 'string' && v.trim() !== '';
const texteOuNull = (v: unknown) => v === null || estTexte(v);
const nombreOuNull = (v: unknown) => v === null || (typeof v === 'number' && Number.isFinite(v) && v >= 0);

/**
 * Vérifie un produit lu dans data/produits/<fichier>. Renvoie la liste des erreurs (vide si tout va bien).
 * `fichier` sert aux messages et au contrôle « slug = nom du fichier ».
 */
export function erreursProduit(brut: unknown, fichier: string): string[] {
  const e: string[] = [];
  if (!estObjet(brut)) return [`${fichier} : le fichier doit contenir un objet JSON.`];
  const p = brut;
  const attendu = fichier.replace(/\.json$/, '');

  // Forme
  if (!estTexte(p.slug) || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug)) e.push('slug : minuscules, chiffres et tirets.');
  else if (p.slug !== attendu) e.push(`slug : « ${p.slug} » ne correspond pas au nom du fichier (« ${attendu} »).`);
  if (!estTexte(p.nom)) e.push('nom : texte obligatoire.');
  if (p.type !== 'numerique' && p.type !== 'physique') e.push('type : « numerique » ou « physique ».');
  if (typeof p.demo !== 'boolean') e.push('demo : true ou false.');
  if (!(texteOuNull(p.format))) e.push(`format : texte, null ou « ${SANS_OBJET} ».`);
  if (!nombreOuNull(p.prix_ttc)) e.push('prix_ttc : nombre positif ou null.');
  if (!(nombreOuNull(p.frais_port_ttc) || p.frais_port_ttc === SANS_OBJET)) e.push(`frais_port_ttc : nombre, null ou « ${SANS_OBJET} ».`);
  if (!texteOuNull(p.delai)) e.push('delai : texte ou null.');
  if (!(p.age_minimum === null || p.age_minimum === SANS_OBJET || (Number.isInteger(p.age_minimum) && (p.age_minimum as number) >= 0)))
    e.push(`age_minimum : entier, null ou « ${SANS_OBJET} ».`);
  if (!estTexte(p.description)) e.push('description : texte obligatoire.');

  const g = p.gpsr;
  if (g === SANS_OBJET) {
    /* produit numérique : pas de mentions GPSR */
  } else if (!estObjet(g)) e.push(`gpsr : objet ou « ${SANS_OBJET} ».`);
  else {
    for (const cle of ['fabricant', 'personne_responsable_ue'] as const) {
      const c = g[cle];
      if (!estObjet(c)) e.push(`gpsr.${cle} : objet { nom, adresse, contact }.`);
      else for (const champ of ['nom', 'adresse', 'contact']) if (!texteOuNull(c[champ])) e.push(`gpsr.${cle}.${champ} : texte ou null.`);
    }
    if (!(g.avertissements === null || (Array.isArray(g.avertissements) && g.avertissements.every(estTexte))))
      e.push('gpsr.avertissements : liste de textes ou null.');
    if (!texteOuNull(g.reference)) e.push('gpsr.reference : texte ou null.');
  }

  if (!Array.isArray(p.visuels) || !p.visuels.every((v) => estObjet(v) && estTexte(v.src) && estTexte(v.alt)))
    e.push('visuels : liste de { src, alt } (alt obligatoire).');

  const pay = p.paiement;
  if (!estObjet(pay) || typeof pay.actif !== 'boolean' || !(pay.url === null || estTexte(pay.url)))
    e.push('paiement : { actif: booléen, url: texte ou null }.');
  if (e.length) return e.map((m) => `${fichier} : ${m}`);

  // Règles du type de produit
  const produit = p as unknown as ProduitModele;
  if (produit.type === 'numerique') {
    if (produit.frais_port_ttc !== SANS_OBJET) e.push(`produit numérique : frais_port_ttc doit valoir « ${SANS_OBJET} ».`);
    if (produit.age_minimum !== SANS_OBJET) e.push(`produit numérique : age_minimum doit valoir « ${SANS_OBJET} ».`);
    if (produit.gpsr !== SANS_OBJET) e.push(`produit numérique : gpsr doit valoir « ${SANS_OBJET} ».`);
  } else {
    if (produit.age_minimum === SANS_OBJET) e.push(`produit physique : age_minimum ne peut pas valoir « ${SANS_OBJET} ».`);
    if (produit.gpsr === SANS_OBJET) e.push(`produit physique : gpsr ne peut pas valoir « ${SANS_OBJET} ».`);
  }
  if (e.length) return e.map((m) => `${fichier} : ${m}`);

  // Règles de vente
  if (produit.demo) {
    if (produit.paiement.actif) e.push('produit de démonstration : paiement.actif doit valoir false.');
    if (produit.paiement.url !== null) e.push('produit de démonstration : paiement.url doit valoir null.');
  } else {
    const manquants = champsManquants(produit);
    if (manquants.length) e.push(`produit vendu : champs obligatoires à compléter : ${manquants.join(', ')}.`);
    if (!produit.paiement.actif) e.push('produit vendu : paiement.actif doit valoir true.');
    if (!produit.paiement.url || !/^https:\/\//.test(produit.paiement.url)) e.push('produit vendu : paiement.url (https) obligatoire.');
    if (produit.visuels.length === 0) e.push('produit vendu : au moins un visuel.');
  }
  return e.map((m) => `${fichier} : ${m}`);
}

/** Champs obligatoires d'un produit vendu encore à null (« sans objet » accepté là où le type l'autorise). */
export function champsManquants(p: ProduitModele): string[] {
  const m: string[] = [];
  if (p.prix_ttc === null) m.push('prix_ttc');
  if (p.delai === null) m.push('delai');
  if (p.type === 'numerique') {
    if (p.format === null || p.format === SANS_OBJET) m.push('format');
    return m;
  }
  if (p.frais_port_ttc === null) m.push('frais_port_ttc');
  if (p.age_minimum === null) m.push('age_minimum');
  if (p.gpsr !== SANS_OBJET) {
    for (const cle of ['fabricant', 'personne_responsable_ue'] as const)
      for (const champ of ['nom', 'adresse', 'contact'] as const) if (p.gpsr[cle][champ] === null) m.push(`gpsr.${cle}.${champ}`);
    if (p.gpsr.avertissements === null) m.push('gpsr.avertissements');
    if (p.gpsr.reference === null) m.push('gpsr.reference');
  }
  return m;
}

/** Prix en euros, format français (« 12,90 € »). */
export function formatEuros(euros: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(euros);
}
