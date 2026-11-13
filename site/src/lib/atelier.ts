// Conseils de L'atelier (§4.1.10 et §4.5 de la spécification v2).
// Titres proposés par la spécification ; les TEXTES sont « À RÉDIGER » par redacteur-catalogue
// et doivent être vérifiés sur un vrai assemblage : aucun conseil n'est inventé ici.
// L'ordre et la liste affichés viennent de accueil.yaml (conseils_atelier).

export interface Conseil {
  ancre: string;
  titre: string;
  /** Texte validé ; vide tant qu'il n'est pas rédigé (affiché « [À VALIDER] »). */
  texte: string;
}

export const CONSEILS: Record<string, Conseil> = {
  'detacher-une-piece': { ancre: 'detacher-une-piece', titre: 'Détacher une pièce sans la casser', texte: '' },
  'engrenage-qui-accroche': { ancre: 'engrenage-qui-accroche', titre: 'Quand un engrenage accroche', texte: '' },
  'ranger-les-planches': { ancre: 'ranger-les-planches', titre: 'Ranger les planches avant de commencer', texte: '' },
};

export function conseils(slugs: string[]): Conseil[] {
  return slugs.map((slug) => {
    const c = CONSEILS[slug];
    if (!c) throw new Error(`accueil.yaml, conseils_atelier : conseil inconnu « ${slug} » (voir src/lib/atelier.ts).`);
    return c;
  });
}
