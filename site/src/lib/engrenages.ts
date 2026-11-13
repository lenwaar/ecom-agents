// Engrenages SVG calculés à la construction (§4.0 : ils s'affichent immobiles sans JavaScript ;
// le script ne fait que les tourner). Profil simplifié (dents trapézoïdales), suffisant à l'écran.
// Une chaîne d'engrenages engrenés : chaque roue touche la précédente au cercle primitif,
// avec la phase calculée pour que les dents tombent dans les creux.

export interface Engrenage {
  cx: number;
  cy: number;
  dents: number;
  rayon: number; // rayon primitif
  phase: number; // rotation initiale (degrés)
  rapport: number; // vitesse relative à la première roue (signe = sens)
  trace: string; // attribut d du <path>
}

/** Tracé d'une roue dentée centrée en (0, 0), avec moyeu évidé (fill-rule evenodd). */
export function traceEngrenage(dents: number, rayon: number, module: number): string {
  const rTete = rayon + module;
  const rPied = rayon - 1.25 * module;
  const pas = (2 * Math.PI) / dents;
  const points: string[] = [];
  for (let i = 0; i < dents; i++) {
    const a = i * pas;
    // Pied, flanc montant, tête, flanc descendant (largeurs en fraction du pas).
    const angles: [number, number][] = [
      [a - pas * 0.5, rPied],
      [a - pas * 0.3, rPied],
      [a - pas * 0.17, rTete],
      [a + pas * 0.17, rTete],
      [a + pas * 0.3, rPied],
    ];
    for (const [ang, r] of angles) points.push(`${(r * Math.cos(ang)).toFixed(2)} ${(r * Math.sin(ang)).toFixed(2)}`);
  }
  const moyeu = Math.max(module * 1.6, rayon * 0.18);
  const cercle = `M ${moyeu} 0 A ${moyeu} ${moyeu} 0 1 0 ${-moyeu} 0 A ${moyeu} ${moyeu} 0 1 0 ${moyeu} 0 Z`;
  return `M ${points.join(' L ')} Z ${cercle}`;
}

/** Première roue d'un train d'engrenages, posée en (x, y). */
export function premiereRoue(x: number, y: number, dents: number, module: number, phase = 0): Engrenage {
  const rayon = (module * dents) / 2;
  return { cx: x, cy: y, dents, rayon, phase, rapport: 1, trace: traceEngrenage(dents, rayon, module) };
}

/**
 * Roue qui engrène avec `parent`, placée dans la direction `angle` (degrés) : centre au contact
 * des cercles primitifs, phase calculée pour que ses dents tombent dans les creux du parent,
 * sens et vitesse opposés selon le rapport des dents. Permet des trains ramifiés (prototype v2).
 */
export function roueVoisine(parent: Engrenage, dents: number, angle: number, module: number): Engrenage {
  const rayon = (module * dents) / 2;
  const t = (angle * Math.PI) / 180;
  const u = (angle - parent.phase) / (360 / parent.dents);
  return {
    cx: parent.cx + (parent.rayon + rayon) * Math.cos(t),
    cy: parent.cy + (parent.rayon + rayon) * Math.sin(t),
    dents,
    rayon,
    phase: angle + 180 - (360 / dents) * (0.5 - u),
    rapport: -parent.rapport * (parent.dents / dents),
    trace: traceEngrenage(dents, rayon, module),
  };
}

/**
 * Tracé d'une roue ajourée (style du prototype v2) : denture, jante évidée, moyeu.
 * Les bras sont dessinés à part (rectangles) par le composant.
 */
export function traceRoueAjouree(dents: number, rayon: number, module: number): { contour: string; jante: number; moyeu: number } {
  const rTete = rayon + module;
  const rPied = rayon - 1.25 * module;
  const pas = (2 * Math.PI) / dents;
  const points: string[] = [];
  for (let i = 0; i < dents; i++) {
    const a = i * pas;
    const angles: [number, number][] = [
      [a - pas * 0.5, rPied],
      [a - pas * 0.3, rPied],
      [a - pas * 0.17, rTete],
      [a + pas * 0.17, rTete],
      [a + pas * 0.3, rPied],
    ];
    for (const [ang, r] of angles) points.push(`${(r * Math.cos(ang)).toFixed(2)} ${(r * Math.sin(ang)).toFixed(2)}`);
  }
  const jante = Math.max(rPied - Math.max(module * 1.4, rayon * 0.14), rayon * 0.35);
  const evidement = `M ${jante} 0 A ${jante} ${jante} 0 1 0 ${-jante} 0 A ${jante} ${jante} 0 1 0 ${jante} 0 Z`;
  return { contour: `M ${points.join(' L ')} Z ${evidement}`, jante, moyeu: Math.max(rayon * 0.18, module * 1.2) };
}

/**
 * Chaîne d'engrenages : `roues` = nombre de dents de chaque roue, `angles` = direction (degrés)
 * de chaque roue par rapport à la précédente. Même module pour toutes (sinon elles n'engrènent pas).
 */
export function chaineEngrenages(depart: { x: number; y: number }, roues: number[], angles: number[], module: number): Engrenage[] {
  const resultat: Engrenage[] = [];
  roues.forEach((dents, i) => {
    const rayon = (module * dents) / 2;
    if (i === 0) {
      resultat.push({ cx: depart.x, cy: depart.y, dents, rayon, phase: 0, rapport: 1, trace: traceEngrenage(dents, rayon, module) });
      return;
    }
    const prec = resultat[i - 1];
    const theta = angles[i - 1];
    const t = (theta * Math.PI) / 180;
    const cx = prec.cx + (prec.rayon + rayon) * Math.cos(t);
    const cy = prec.cy + (prec.rayon + rayon) * Math.sin(t);
    // Position de la dent de la roue précédente au point de contact, en nombre de pas.
    const u = (theta - prec.phase) / (360 / prec.dents);
    const phase = theta + 180 - (360 / dents) * (0.5 - u);
    resultat.push({
      cx,
      cy,
      dents,
      rayon,
      phase,
      rapport: -prec.rapport * (prec.dents / dents),
      trace: traceEngrenage(dents, rayon, module),
    });
  });
  return resultat;
}
