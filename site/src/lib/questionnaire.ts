// « Trouver ma maquette » (§4.1.7 de la spécification v2, audit N7, N9, N10).
// Logique PURE (aucun import Astro) : utilisée à la construction (pages statiques de repli)
// et dans le navigateur (scripts/questionnaire.ts). Recommandation déterministe, expliquée par des faits.
// Aucun cookie, aucun stockage, aucune requête : les données sont intégrées à la page.

export type PourQui = 'moi' | 'offrir';
export type Experience = 'premiere' | 'une-ou-deux' | 'habitude';
export type Temps = 'soirees' | 'week-end' | 'mon-temps';
export type Niveau = 'facile' | 'moyen' | 'expert';

/** Produit sous forme compacte (JSON intégré à la page). */
export interface ProduitQuiz {
  slug: string;
  nom: string;
  niveau: Niveau;
  hMin: number;
  hMax: number;
  prix: string;
  cadeau: boolean;
  ordre: number;
  demo: boolean;
  image: string;
  alt: string;
}

export interface Choix<T extends string> {
  valeur: T;
  libelle: string;
  icone: string;
}

export const QUESTIONS = {
  pourQui: {
    legende: 'Pour qui ?',
    note: "Toutes nos maquettes sont destinées aux 14 ans et plus, selon l'âge indiqué par le fabricant.",
    choix: [
      { valeur: 'moi', libelle: 'Pour moi', icone: 'user' },
      { valeur: 'offrir', libelle: 'Pour offrir', icone: 'gift' },
    ] as Choix<PourQui>[],
  },
  experience: {
    legende: 'Quel niveau ?',
    note: '',
    choix: [
      { valeur: 'premiere', libelle: "C'est ma première maquette", icone: 'sprout' },
      { valeur: 'une-ou-deux', libelle: "J'en ai déjà monté une ou deux", icone: 'gauge' },
      { valeur: 'habitude', libelle: "J'ai l'habitude", icone: 'flame' },
    ] as Choix<Experience>[],
  },
  temps: {
    legende: 'Combien de temps ?',
    note: '',
    choix: [
      { valeur: 'soirees', libelle: "Une ou deux soirées (jusqu'à 3 h)", icone: 'moon' },
      { valeur: 'week-end', libelle: "Un week-end (jusqu'à 7 h)", icone: 'calendar' },
      { valeur: 'mon-temps', libelle: 'Je prends mon temps (plus de 7 h)', icone: 'layers' },
    ] as Choix<Temps>[],
  },
} as const;

export const NIVEAUX_ADMIS: Record<Experience, Niveau[]> = {
  premiere: ['facile'],
  'une-ou-deux': ['facile', 'moyen'],
  habitude: ['moyen', 'expert'],
};

export const TEMPS_MAX: Record<Temps, number | null> = { soirees: 3, 'week-end': 7, 'mon-temps': null };

const LIBELLE_NIVEAU: Record<Niveau, string> = { facile: 'Facile', moyen: 'Moyen', expert: 'Expert' };

export interface Resultat {
  produit: ProduitQuiz;
  raisons: string[];
  /** Ajouté pour compléter jusqu'à 3 : « Demande un peu plus de temps : [n] h ». */
  plusLong: boolean;
}

export interface Recommandation {
  resultats: Resultat[];
  message: string | null;
}

/** Recommandation déterministe (§4.1.7, règle et tests de recette). */
export function recommander(produits: ProduitQuiz[], pourQui: PourQui, experience: Experience, temps: Temps): Recommandation {
  const niveaux = NIVEAUX_ADMIS[experience];
  const max = TEMPS_MAX[temps];
  const candidats = produits.filter((p) => niveaux.includes(p.niveau));

  // Égalité : « Pour offrir » place d'abord la collection idees-cadeaux, puis le champ `ordre`.
  const departage = (a: ProduitQuiz, b: ProduitQuiz) =>
    (pourQui === 'offrir' ? Number(b.cadeau) - Number(a.cadeau) : 0) || a.ordre - b.ordre;
  const croissant = (a: ProduitQuiz, b: ProduitQuiz) => a.hMax - b.hMax || departage(a, b);
  const decroissant = (a: ProduitQuiz, b: ProduitQuiz) => b.hMax - a.hMax || departage(a, b);

  const dansLeTemps = max === null ? candidats : candidats.filter((p) => p.hMax <= max);
  const tries = [...dansLeTemps].sort(temps === 'soirees' ? croissant : decroissant).slice(0, 3);

  const raisons = (p: ProduitQuiz, plusLong: boolean) => {
    const r = [`Niveau ${LIBELLE_NIVEAU[p.niveau]}`];
    if (plusLong) r.push(`Demande un peu plus de temps : ${p.hMax} h`);
    else r.push(max === null ? `${p.hMax} h d'assemblage` : `${p.hMax} h, dans votre temps`);
    if (pourQui === 'offrir' && p.cadeau) r.push('Dans nos idées cadeaux');
    return r;
  };

  let message: string | null = null;
  let resultats: Resultat[];

  if (tries.length === 0) {
    // Aucun résultat : on retire le filtre de temps, tri croissant.
    resultats = [...candidats].sort(croissant).slice(0, 3).map((p) => ({ produit: p, raisons: raisons(p, true), plusLong: true }));
    message = `Aucun modèle de ce niveau ne se monte en ${max} h ou moins. Voici les plus courts.`;
  } else {
    resultats = tries.map((p) => ({ produit: p, raisons: raisons(p, false), plusLong: false }));
    if (resultats.length < 3) {
      // 1 ou 2 résultats : compléter jusqu'à 3, filtre de temps retiré (les plus courts d'abord).
      const pris = new Set(resultats.map((r) => r.produit.slug));
      const complements = [...candidats].filter((p) => !pris.has(p.slug)).sort(croissant).slice(0, 3 - resultats.length);
      resultats.push(...complements.map((p) => ({ produit: p, raisons: raisons(p, true), plusLong: true })));
    }
    // « Je prends mon temps » sur une première maquette : on dit la durée réelle des modèles faciles.
    if (max === null && niveaux.length === 1 && candidats.length > 0) {
      const hMin = Math.min(...candidats.map((p) => p.hMin));
      const hMax = Math.max(...candidats.map((p) => p.hMax));
      const plage = hMin === hMax ? `${hMin} h` : `${hMin} à ${hMax} h`;
      message = `Nos modèles ${LIBELLE_NIVEAU[niveaux[0]].toLowerCase()}s se montent en ${plage}.`;
    }
  }
  return { resultats, message };
}

/** Adresse de la page statique d'une étape (version sans JavaScript, partageable). */
export function cheminEtape(pourQui?: PourQui, experience?: Experience, temps?: Temps): string {
  return '/trouver-ma-maquette/' + [pourQui, experience, temps].filter(Boolean).map((s) => `${s}/`).join('');
}

export function libelleChoix(question: keyof typeof QUESTIONS, valeur: string): string {
  return (QUESTIONS[question].choix as readonly Choix<string>[]).find((c) => c.valeur === valeur)?.libelle ?? valeur;
}
