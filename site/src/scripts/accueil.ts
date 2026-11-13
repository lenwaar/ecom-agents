// Animations de l'accueil (§4.0 et §4.1 de la spécification v2 ; niveau du prototype v2).
// - Ne fait RIEN sans html.js-anim (posée par Base.astro seulement si ni prefers-reduced-motion,
//   ni économie de données) : GSAP n'est alors même pas téléchargé. Tout reste visible.
// - GSAP et ScrollTrigger viennent du paquet npm, servis depuis notre domaine (aucun CDN).
// - Si GSAP ne se charge pas, la classe js-anim est retirée : rien ne reste caché.
// - Mouvements continus arrêtés hors écran, onglet caché, ou par le bouton pause (audit N4).
// Les révélations R2 « bloc » et R3 « cartes » sont gérées par scripts/mouvement.ts (Base.astro).
import { animerSections } from './accueil-sections';

import { pause, pointeurFin, type Gsap, type ScrollTriggerType } from './etat-animation';

export async function animerAccueil(): Promise<void> {
  const html = document.documentElement;
  if (!html.classList.contains('js-anim')) return;

  let gsap: Gsap;
  let ScrollTrigger: ScrollTriggerType;
  try {
    [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
  } catch {
    html.classList.remove('js-anim');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  boutonPause();
  const heros = animerHeros(gsap, ScrollTrigger);
  animerSections(gsap, ScrollTrigger);
  revelations(gsap);
  barreProgression(gsap);
  panneaux(gsap);
  aimants();
  heros?.();
  ScrollTrigger.refresh();
}

/** Bouton « Mettre en pause les animations » : html.anim-pause pendant la visite, aucun stockage. */
function boutonPause() {
  const bouton = document.querySelector<HTMLButtonElement>('[data-pause-global]');
  if (!bouton) return;
  bouton.hidden = false;
  bouton.addEventListener('click', () => {
    pause.active = !pause.active;
    document.documentElement.classList.toggle('anim-pause', pause.active);
    bouton.setAttribute('aria-pressed', String(pause.active));
    bouton.querySelector('[data-libelle]')!.textContent = pause.active ? 'Reprendre les animations' : 'Mettre en pause les animations';
    bouton.querySelector('[data-icone-pause]')?.classList.toggle('hidden', pause.active);
    bouton.querySelector('[data-icone-lecture]')?.classList.toggle('hidden', !pause.active);
    pause.ecouteurs.forEach((f) => f(pause.active));
  });
}

/**
 * Héros (§4.1.1) : entrée R1 / R2, roues qui apparaissent (scale .9 → 1, 1,8 s), rotation continue
 * (0,06° par image pour la grande roue, accélérée par la vitesse de défilement : boost += vitesse × 0,02,
 * plafond 4, amorti × 0,92), parallaxe au pointeur (±12 px roues, ±24 px halo, lissage 600 ms),
 * sortie liée au défilement. Renvoie la fonction qui démarre la rotation.
 */
function animerHeros(gsap: Gsap, ScrollTrigger: ScrollTriggerType): (() => void) | undefined {
  const heros = document.querySelector<HTMLElement>('[data-heros]');
  if (!heros) return;
  const engrenages = heros.querySelector<HTMLElement>('[data-engrenages]')!;
  const texte = heros.querySelector<HTMLElement>('[data-texte-heros]')!;
  const halo = heros.querySelector<HTMLElement>('[data-halo]')!;

  gsap.fromTo(heros.querySelectorAll('[data-ligne] > span'), { y: 0, yPercent: 110 }, { yPercent: 0, duration: 1.2, stagger: 0.12, delay: 0.15, ease: 'expo.out' });
  gsap.fromTo(heros.querySelectorAll('[data-entree-bloc]'), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.1, delay: 0.5, ease: 'expo.out' });
  gsap.fromTo(heros.querySelector('[data-entree-roues]'), { opacity: 0, scale: 0.9, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 1.8, ease: 'expo.out' });

  // Sortie liée au défilement.
  const sortie = { trigger: heros, start: 'top top', end: 'bottom top', scrub: true };
  gsap.to(engrenages, { yPercent: -30, opacity: window.innerWidth < 768 ? 0.1 : 0.25, ease: 'none', scrollTrigger: sortie });
  gsap.to(texte, { yPercent: -40, opacity: 0, ease: 'none', scrollTrigger: sortie });

  // Parallaxe au pointeur (ordinateur seulement).
  if (pointeurFin()) {
    const svg = engrenages.querySelector('svg')!;
    const rx = gsap.quickTo(svg, 'x', { duration: 0.6, ease: 'power3.out' });
    const ry = gsap.quickTo(svg, 'y', { duration: 0.6, ease: 'power3.out' });
    const hx = gsap.quickTo(halo, 'x', { duration: 0.6, ease: 'power3.out' });
    const hy = gsap.quickTo(halo, 'y', { duration: 0.6, ease: 'power3.out' });
    heros.addEventListener('pointermove', (e) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      rx(x * -24);
      ry(y * -24);
      hx(x * 48);
      hy(y * 48);
    });
  }

  // Rotation continue.
  const roues = [...heros.querySelectorAll<SVGGElement>('[data-roue-heros]')].map((el) => ({
    el,
    phase: Number(el.dataset.phase),
    rapport: Number(el.dataset.rapport),
  }));
  const fond = heros.querySelector<SVGGElement>('[data-roue-fond]');
  const phaseFond = Number(fond?.dataset.phase ?? 0);
  let angle = 0;
  let boost = 0;
  let enVue = true;
  let requete = 0;
  ScrollTrigger.create({
    trigger: heros,
    start: 'top top',
    end: 'bottom top',
    onUpdate: (st) => (boost = Math.min(4, boost + Math.abs(st.getVelocity()) * 0.02 * (1 / 60))),
  });
  const image = () => {
    angle += 0.06 + boost;
    boost *= 0.92;
    for (const r of roues) r.el.setAttribute('transform', `rotate(${(r.phase + r.rapport * angle).toFixed(3)})`);
    fond?.setAttribute('transform', `rotate(${(phaseFond - angle * 0.4).toFixed(3)})`);
    requete = requestAnimationFrame(image);
  };
  const maj = () => {
    cancelAnimationFrame(requete);
    if (enVue && !pause.active && !document.hidden) requete = requestAnimationFrame(image);
  };
  new IntersectionObserver(([e]) => {
    enVue = e.isIntersecting;
    maj();
  }).observe(heros);
  document.addEventListener('visibilitychange', maj);
  pause.ecouter(maj);
  return maj;
}

/** R1 « titre » (lignes yPercent 110 → 0, 1,2 s, décalage 0,12 s) et entrée des cadres (scale .96 → 1). */
function revelations(gsap: Gsap) {
  gsap.utils.toArray<HTMLElement>('[data-revele="titre"]').forEach((titre) => {
    gsap.fromTo(titre.querySelectorAll('[data-ligne] > span'), { y: 0, yPercent: 110 }, {
      yPercent: 0,
      duration: 1.2,
      stagger: 0.12,
      ease: 'expo.out',
      scrollTrigger: { trigger: titre, start: 'top 85%', once: true },
    });
  });
  gsap.utils.toArray<HTMLElement>('[data-revele="cadre"]').forEach((cadre) => {
    gsap.to(cadre, { scale: 1, opacity: 1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: cadre, start: 'top 85%', once: true } });
  });
}

/** Barre de progression de lecture (prototype v2). */
function barreProgression(gsap: Gsap) {
  const barre = document.querySelector('[data-progression-page]');
  if (!barre) return;
  gsap.to(barre, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 } });
}

/** Transitions de registre : le panneau suivant « monte » sur le précédent (translateY 80 px → 0). */
function panneaux(gsap: Gsap) {
  gsap.utils.toArray<HTMLElement>('[data-panneau]').forEach((panneau) => {
    gsap.fromTo(panneau, { y: 80 }, { y: 0, ease: 'none', scrollTrigger: { trigger: panneau, start: 'top bottom', end: 'top 55%', scrub: 0.6 } });
  });
}

/** Boutons « aimantés » du prototype v2 (ordinateur seulement, léger). */
function aimants() {
  if (!pointeurFin()) return;
  document.querySelectorAll<HTMLElement>('.aimant').forEach((b) => {
    b.addEventListener('pointermove', (e) => {
      const r = b.getBoundingClientRect();
      b.style.translate = `${((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1)}px ${((e.clientY - r.top - r.height / 2) * 0.28).toFixed(1)}px`;
    });
    b.addEventListener('pointerleave', () => (b.style.translate = ''));
  });
}
