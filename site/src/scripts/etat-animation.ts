// État partagé des animations de l'accueil : pause demandée par le visiteur (audit N4, sans stockage)
// et détection d'un pointeur précis (souris) pour les effets réservés à l'ordinateur.
export type Gsap = typeof import('gsap').gsap;
export type ScrollTriggerType = typeof import('gsap/ScrollTrigger').ScrollTrigger;

export const pause = {
  active: false,
  ecouteurs: [] as ((enPause: boolean) => void)[],
  ecouter(f: (enPause: boolean) => void) {
    this.ecouteurs.push(f);
  },
};

export const pointeurFin = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;
