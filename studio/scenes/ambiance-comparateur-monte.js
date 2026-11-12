// Ambiance « comparateur », image 2/2 : l'horloge murale montée, accrochée au-dessus du bureau, de nuit.
// Même caméra, même lumière, même décor que ambiance-comparateur-planches.
import * as THREE from 'three';
import { build as buildClock } from './horloge-murale-balancier.js';
import { comparatorSet } from './ambiance-comparateur-planches.js';

export const ambiance = true;
export async function build(ctx) {
  const P = buildClock({ view: 'situation' });
  return comparatorSet(ctx, P, 'monte');
}
