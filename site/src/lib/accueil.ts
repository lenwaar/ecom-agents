// Données de l'accueil (§4.1 de la spécification v2, corrigée par l'audit v2).
// Toutes les accroches « globales » sont CALCULÉES depuis les fiches produits publiées :
// une phrase n'est affichée que si elle est vraie pour chaque produit concerné (audit N2, N8, V13).
// Aucun produit, chiffre ou délai n'est écrit en dur ici.
import { getEntry, type CollectionEntry } from 'astro:content';
import type { Produit } from './donnees';
import { formatPrix } from './donnees';

export type ReglagesAccueil = CollectionEntry<'reglages'>['data'];

export async function getReglagesAccueil(): Promise<ReglagesAccueil> {
  const entree = await getEntry('reglages', 'accueil');
  if (!entree) throw new Error('src/content/reglages/accueil.yaml est introuvable.');
  return entree.data;
}

/** Produit publié désigné par son slug dans accueil.yaml ; erreur claire s'il n'existe pas. */
export function produitParSlug(produits: Produit[], slug: string, reglage: string): Produit {
  const p = produits.find((x) => x.data.slug === slug);
  if (!p) throw new Error(`accueil.yaml, ${reglage} : « ${slug} » n'est pas un produit publié.`);
  return p;
}

const tousVrai = (produits: Produit[], test: (p: Produit) => boolean) => produits.length > 0 && produits.every(test);

/** Heures d'assemblage min et max des produits donnés. */
export function plageHeures(produits: Produit[]): { min: number; max: number } {
  return {
    min: Math.min(...produits.map((p) => p.data.temps_assemblage_heures_min)),
    max: Math.max(...produits.map((p) => p.data.temps_assemblage_heures_max)),
  };
}

export function plagePrix(produits: Produit[]): string {
  const prix = produits.map((p) => p.data.prix_ttc);
  const min = Math.min(...prix);
  const max = Math.max(...prix);
  return min === max ? formatPrix(min) : `de ${formatPrix(min)} à ${formatPrix(max)}`;
}

/** « de 2 à 12 h » ou « 3 h ». */
export function texteHeures(min: number, max: number): string {
  return min === max ? `${min} h` : `de ${min} à ${max} h`;
}

const MOTEURS: Record<string, string> = {
  manivelle: 'une manivelle',
  ressort: 'un ressort',
  'moteur-elastique': 'un moteur élastique',
};

function listeOu(elements: string[]): string {
  if (elements.length <= 1) return elements.join('');
  return `${elements.slice(0, -1).join(', ')} ou ${elements[elements.length - 1]}`;
}

/** Faits vrais pour TOUS les produits publiés (audit N2 : chaque accroche globale dépend d'un champ). */
export function faitsGlobaux(produits: Produit[]) {
  const predecoupe = tousVrai(produits, (p) => p.data.contenu_boite.some((c) => c.startsWith('Planches de bois prédécoupées')));
  const laser = tousVrai(produits, (p) => p.data.decoupe_laser === true);
  const notice = tousVrai(produits, (p) => p.data.notice_illustree === true);
  const mobile = tousVrai(produits, (p) => p.data.partie_mobile === true);
  const sansColleNiOutil = tousVrai(
    produits,
    (p) => p.data.colle_necessaire === false && p.data.outils_necessaires.length === 0,
  );
  const suivie = tousVrai(produits, (p) => p.data.suivi === true);
  const ageMin = Math.min(...produits.map((p) => p.data.age_minimum));
  const ageMax = Math.max(...produits.map((p) => p.data.age_minimum));
  return { predecoupe, laser, notice, mobile, sansColleNiOutil, suivie, age: ageMin === ageMax ? ageMin : null };
}

/** Textes du héros et du récit « Ouvrir, Assembler, Tourner » (§4.1.1, §4.1.2, audit N2). */
export function textesRecit(produits: Produit[], seuilSoirees: number) {
  const f = faitsGlobaux(produits);
  const h = plageHeures(produits);
  const age = f.age ? `pour les ${f.age} ans et plus` : "à partir de l'âge indiqué sur chaque fiche";

  // Héros : « Des pièces de bois découpées au laser » seulement si c'est vrai pour chaque produit (N2 c).
  const pieces = f.laser ? 'Des pièces de bois découpées au laser' : f.predecoupe ? 'Des pièces de bois prédécoupées' : 'Des pièces de bois';
  const heros =
    `${pieces}${f.notice ? ', une notice illustrée' : ''}, ` +
    (f.mobile ? 'et ce moment où tout se met en mouvement. ' : "et le plaisir de voir l'objet prendre forme entre vos mains. ") +
    `À assembler soi-même, ${age}.`;

  // 01 Ouvrir la boîte.
  const planches = f.predecoupe ? 'Des planches de bois prédécoupées' : 'Des planches de bois';
  const ouvrir =
    `${planches}${f.notice ? ' et une notice illustrée' : ''}. ` +
    (f.sansColleNiOutil ? 'Ni colle, ni outil spécial.' : 'Chaque fiche détaille le contenu de la boîte.');

  // 02 Assembler : « Quelques soirées » seulement si tous les produits sont sous le seuil (V13).
  const assembler =
    (h.max <= seuilSoirees ? 'Quelques soirées' : `À votre rythme, ${texteHeures(h.min, h.max).replace(' h', ' heures')} selon le modèle`) +
    ", et le plaisir de voir l'objet prendre forme entre vos mains.";

  // 03 Tourner : liste générée depuis les valeurs réelles de `mecanisme` (N2 d).
  const mecaniques = produits.filter((p) => (p.data.collections as string[]).includes('mecanique'));
  const moteurs = [...new Set(produits.map((p) => p.data.mecanisme).filter((m): m is string => typeof m === 'string' && m in MOTEURS))];
  const tousMotorises = tousVrai(mecaniques, (p) => typeof p.data.mecanisme === 'string' && p.data.mecanisme in MOTEURS);
  const manivelle = moteurs.includes('manivelle');
  const tourner =
    moteurs.length === 0
      ? 'Un objet que vous avez construit, posé sur votre bureau.'
      : `${tousMotorises ? 'Sur nos modèles mécaniques' : 'Sur certains de nos modèles'}, ${listeOu(moteurs.map((m) => MOTEURS[m]))} met tout en mouvement. Un objet que vous avez construit, posé sur votre bureau.`;

  return {
    heros,
    etapes: [
      { numero: '01', titre: 'Ouvrir', italique: 'la boîte.', texte: ouvrir },
      { numero: '02', titre: 'Assembler,', italique: 'sans se presser.', texte: assembler },
      manivelle
        ? { numero: '03', titre: 'Tourner', italique: 'la manivelle.', texte: tourner }
        : { numero: '03', titre: 'Le poser,', italique: 'le regarder.', texte: tourner },
    ],
    rappel: manivelle ? { debut: 'Prêt à tourner', italique: 'la manivelle ?' } : { debut: 'Prêt à', italique: 'commencer ?' },
    faits: f,
    heures: h,
  };
}

/**
 * Bande défilante (prototype v2) : uniquement des faits vrais pour tout le catalogue publié
 * ou des droits légaux, chacun avec son icône Lucide.
 */
export function elementsBande(produits: Produit[]): { icone: string; texte: string }[] {
  const f = faitsGlobaux(produits);
  const h = plageHeures(produits);
  const niveaux = new Set(produits.map((p) => p.data.difficulte));
  const liste: { icone: string; texte: string }[] = [];
  if (f.laser) liste.push({ icone: 'scissors', texte: 'Découpé au laser' });
  if (f.sansColleNiOutil) liste.push({ icone: 'check', texte: 'Sans colle ni outil' });
  if (f.age) liste.push({ icone: 'shield-check', texte: `${f.age} ans et plus` });
  liste.push({ icone: 'clock', texte: `${texteHeures(h.min, h.max).replace(/^de /, 'De ')} de montage` });
  if (niveaux.size === 3) liste.push({ icone: 'gauge', texte: 'Facile, moyen ou expert' });
  liste.push({ icone: 'gift', texte: 'Un cadeau qui se construit' });
  liste.push({ icone: 'truck', texte: 'Délai affiché avant le paiement' });
  liste.push({ icone: 'rotate-ccw', texte: 'Droit de rétractation de 14 jours' });
  liste.push({ icone: 'wrench', texte: 'Pièce manquante : garantie légale' });
  return liste;
}

/** Groupes de pièces de l'illustration « Dans la boîte » (vue éclatée de principe, pas le contenu d'un kit). */
export const PIECES_ILLUSTRATION = ['Le socle', 'La grande roue', 'Les pignons', 'Les axes'];

/** Produits publiés au format compact du questionnaire (JSON intégré à la page, aucune requête). */
export function versQuiz(produits: Produit[]): import('./questionnaire').ProduitQuiz[] {
  return produits.map((p) => ({
    slug: p.data.slug,
    nom: p.data.nom_court,
    niveau: p.data.difficulte,
    hMin: p.data.temps_assemblage_heures_min,
    hMax: p.data.temps_assemblage_heures_max,
    prix: formatPrix(p.data.prix_ttc),
    cadeau: (p.data.collections as string[]).includes('idees-cadeaux'),
    ordre: p.data.ordre,
    demo: p.data.demo,
    image: `/produits/${p.data.slug}/face-800.webp`,
    alt: p.data.vues.face.alt,
  }));
}
