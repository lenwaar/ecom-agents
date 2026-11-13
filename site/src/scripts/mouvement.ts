// Système de mouvement des pages cinématiques (§4.0 de la spécification v2).
// - GSAP n'est chargé (import dynamique) que si l'animation va réellement tourner :
//   jamais avec prefers-reduced-motion: reduce ni avec l'économie de données.
// - Sans JavaScript, rien n'est caché : les états initiaux masqués n'existent que sous html.js-anim,
//   classe posée par le script en ligne de la mise en page (Base.astro).
// - Révélations : R2 « bloc » sur [data-revele="bloc"], R3 « cartes » sur [data-revele="cartes"] > *.
// Utilisé à partir de l'accueil animé (étape suivante) ; les pages claires ne le chargent pas.

export function animationAutorisee(): boolean {
  const moinsDeMouvement = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const connexion = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return !moinsDeMouvement && !connexion?.saveData;
}

export async function demarrerMouvement(): Promise<void> {
  if (!document.documentElement.classList.contains('js-anim')) return;

  const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
  gsap.registerPlugin(ScrollTrigger);

  // R2 « bloc » : y 20 → 0, opacité 0 → 1, 1,0 s, déclenché à 85 %, une seule fois.
  gsap.utils.toArray<HTMLElement>('[data-revele="bloc"]').forEach((element) => {
    gsap.to(element, {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'expo.out',
      scrollTrigger: { trigger: element, start: 'top 85%', once: true },
    });
  });

  // R3 « cartes » : cascade, départ à 88 %, décalage 0,08 s.
  ScrollTrigger.batch('[data-revele="cartes"] > *', {
    start: 'top 88%',
    once: true,
    onEnter: (lot) => gsap.to(lot, { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.08 }),
  });
}
