// Animations des sections 2 à 10 de l'accueil (§4.1.2 à §4.1.10). Appelé par scripts/accueil.ts
// seulement quand l'animation est permise (html.js-anim). Animations : transform et opacity
// (attribut transform pour les SVG), clip-path pour le comparateur.
import { pause, pointeurFin, type Gsap, type ScrollTriggerType } from './etat-animation';
import { poserPosition } from './comparateur';

const borne = (v: number) => Math.max(0, Math.min(1, v));
const sortieExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

export function animerSections(gsap: Gsap, ScrollTrigger: ScrollTriggerType): void {
  // Les sections dont la hauteur change passent en premier (le rail horizontal), avant les autres déclencheurs.
  maquettesDuMoment(gsap, ScrollTrigger);
  recit(gsap);
  comparateur(gsap);
  eclate(gsap);
  collections(gsap);
  echelle(gsap);
  offrir(gsap);
  atelier(gsap);
}

/** 2. Récit épinglé : une étape à la fois, barre à 3 segments, visuel de la planche aux roues qui tournent. */
function recit(gsap: Gsap) {
  const section = document.querySelector<HTMLElement>('[data-recit]');
  const svg = section?.querySelector<SVGSVGElement>('[data-visuel-recit]');
  if (!section || !svg) return;
  const etapes = section.querySelectorAll<HTMLElement>('[data-recit-etape]');
  const barres = section.querySelectorAll<HTMLElement>('[data-recit-barre]');
  const roues = [...svg.querySelectorAll<SVGGElement>('[data-recit-roue]')].map((g) => ({
    g,
    dx: Number(g.dataset.dx),
    dy: Number(g.dataset.dy),
    tourne: g.querySelector<SVGGElement>('[data-roue-recit]')!,
  }));
  const tournants = roues.map((r) => ({ el: r.tourne, phase: Number(r.tourne.dataset.phase), rapport: Number(r.tourne.dataset.rapport) }));
  const bras = svg.querySelector('[data-recit-bras]');

  // Un seul « avancement » 0 → 3 piloté par le défilement ; le visuel en est déduit.
  const etat = { t: 0 };
  const dessiner = () => {
    const t = etat.t;
    const sortie = sortieExpo(borne((t - 0.75) / 1.0)); // les roues quittent la planche (étape 2)
    const angle = 40 * sortie + 270 * borne((t - 1.9) / 1.3); // puis tournent (étape 3)
    roues.forEach((r) => {
      r.g.setAttribute('transform', `translate(${(r.dx * (1 - sortie)).toFixed(2)} ${(r.dy * (1 - sortie)).toFixed(2)})`);
      r.g.setAttribute('opacity', String(borne((t - 0.6) / 0.4)));
    });
    tournants.forEach((r) => r.el.setAttribute('transform', `rotate(${(r.phase + r.rapport * angle).toFixed(2)})`));
    bras?.setAttribute('transform', `rotate(${angle.toFixed(2)})`);
    svg.querySelector('[data-recit-planche]')?.setAttribute('opacity', String(1 - 0.85 * sortie));
    svg.querySelector('[data-recit-cadre]')?.setAttribute('opacity', String(sortie));
    svg.querySelector('[data-recit-manivelle]')?.setAttribute('opacity', String(borne((t - 1.9) / 0.3)));
    svg.querySelector('[data-recit-halo]')?.setAttribute('opacity', String(0.25 + 0.65 * borne((t - 1.9) / 1.3)));
  };

  const tl = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top top', end: 'bottom bottom', scrub: 0.6 } });
  tl.to(etat, { t: 3, duration: 3, ease: 'none', onUpdate: dessiner }, 0);
  tl.fromTo(svg, { scale: 1 }, { scale: 1.15, duration: 3, ease: 'none', transformOrigin: '50% 50%' }, 0);
  etapes.forEach((etape, i) => {
    const debut = i;
    if (i > 0) tl.fromTo(etape, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, debut);
    if (barres[i]) tl.fromTo(barres[i], { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'none' }, debut + 0.2);
    if (i < etapes.length - 1) tl.to(etape, { opacity: 0, y: -30, duration: 0.2, ease: 'power2.in' }, debut + 0.8);
  });
  dessiner();
}

/** 3. Comparateur : invitation unique à l'entrée (50 → 72 → 35 → 50 %, 1,6 s), si personne n'y a touché. */
function comparateur(gsap: Gsap) {
  const comp = document.querySelector<HTMLElement>('[data-comparateur]');
  if (!comp) return;
  const position = { v: 50 };
  gsap
    .timeline({
      paused: true,
      scrollTrigger: {
        trigger: comp,
        start: 'top 70%',
        once: true,
        onEnter: (st) => {
          if (comp.dataset.touche || !comp.classList.contains('actif')) st.animation?.kill();
        },
      },
      onUpdate: () => {
        if (!comp.dataset.touche) poserPosition(comp, position.v);
      },
    })
    .to(position, { v: 72, duration: 0.55, ease: 'power3.inOut' }, 0.4)
    .to(position, { v: 35, duration: 0.6, ease: 'power3.inOut' })
    .to(position, { v: 50, duration: 0.45, ease: 'power3.inOut' });
}

/** 4. Vue éclatée : les pièces se rassemblent du socle vers les axes, étiquettes qui s'effacent, flash final. */
function eclate(gsap: Gsap) {
  const piste = document.querySelector<HTMLElement>('[data-eclate] .eclate');
  const svg = piste?.querySelector<SVGSVGElement>('[data-visuel-eclate]');
  if (!piste || !svg) return;
  const pieces = [...svg.querySelectorAll<SVGGElement>('[data-eclate-piece]')].map((g) => ({
    g,
    dx: Number(g.dataset.dx),
    dy: Number(g.dataset.dy),
    rot: Number(g.dataset.rot),
  }));
  const etiquettes = svg.querySelectorAll<SVGGElement>('[data-eclate-etiquette]');
  const legende = document.querySelectorAll<HTMLElement>('[data-eclate-legende]');
  const compteur = document.querySelector<HTMLElement>('[data-eclate-compteur]');
  const halo = svg.querySelector('[data-eclate-halo]');
  let flash = false;

  const etat = { p: 0 };
  const dessiner = () => {
    pieces.forEach((piece, i) => {
      // Chaque pièce commence 8 % après la précédente.
      const k = sortieExpo(borne((etat.p - i * 0.08) / 0.62));
      piece.g.setAttribute('transform', `translate(${(piece.dx * (1 - k)).toFixed(2)} ${(piece.dy * (1 - k)).toFixed(2)}) rotate(${(piece.rot * (1 - k)).toFixed(2)} 320 300)`);
      piece.g.setAttribute('opacity', String(0.9 + 0.1 * k));
      etiquettes[i]?.setAttribute('opacity', String(1 - k));
      legende[i]?.classList.toggle('en-place', k > 0.97);
    });
    const fini = etat.p > 0.97;
    if (compteur) {
      compteur.dataset.debut ??= compteur.textContent ?? '';
      compteur.textContent = fini ? compteur.dataset.final! : compteur.dataset.debut;
    }
    if (fini && !flash && halo) {
      flash = true;
      gsap.timeline().to(halo, { attr: { opacity: 0.55 }, duration: 0.3 }).to(halo, { attr: { opacity: 0.3 }, duration: 0.5 });
    }
    if (!fini) flash = false;
  };
  gsap.to(etat, { p: 1, ease: 'none', onUpdate: dessiner, scrollTrigger: { trigger: piste, start: 'top top', end: 'bottom bottom', scrub: 0.6 } });
  dessiner();
}

/** 5. Cartes de collection : animation propre à chaque collection au survol / focus, une fois à 60 % sur tactile. */
function collections(gsap: Gsap) {
  const cartes = document.querySelectorAll<HTMLElement>('[data-carte-collection]');
  const survol = pointeurFin();
  cartes.forEach((carte) => {
    const type = carte.dataset.carteCollection;
    let jouer: () => void = () => {};
    let revenir: () => void = () => {};

    if (type === 'mecanique') {
      const roues = [...carte.querySelectorAll<SVGGElement>('[data-carte-roue]')].map((el) => ({
        el,
        phase: Number(el.dataset.phase),
        rapport: Number(el.dataset.rapport),
      }));
      const a = { v: 0 };
      const maj = () => roues.forEach((r) => r.el.setAttribute('transform', `rotate(${(r.phase + r.rapport * a.v).toFixed(2)})`));
      jouer = () => gsap.to(a, { v: 60, duration: 0.8, ease: 'expo.out', onUpdate: maj, overwrite: true });
      revenir = () => gsap.to(a, { v: 0, duration: 0.4, ease: 'power2.out', onUpdate: maj, overwrite: true });
    }

    if (type === 'vehicules') {
      const groupe = carte.querySelector<SVGGElement>('[data-carte-vehicule]')!;
      const v = JSON.parse(groupe.dataset.bielle!) as { cx: number; cy: number; r: number; L: number };
      const roue = groupe.querySelector('[data-carte-roue-vehicule]')!;
      const tige = groupe.querySelector('[data-tige]')!;
      const maneton = groupe.querySelector('[data-maneton]')!;
      const piston = groupe.querySelector('[data-piston]')!;
      const a = { v: 0, x: 0 };
      const maj = () => {
        const rad = (a.v * Math.PI) / 180;
        const px = v.cx + v.r * Math.cos(rad);
        const py = v.cy + v.r * Math.sin(rad);
        const xp = px - Math.sqrt(v.L ** 2 - (py - v.cy) ** 2); // bielle de longueur constante
        roue.setAttribute('transform', `rotate(${a.v.toFixed(2)} ${v.cx} ${v.cy})`);
        tige.setAttribute('x1', px.toFixed(2));
        tige.setAttribute('y1', py.toFixed(2));
        tige.setAttribute('x2', xp.toFixed(2));
        maneton.setAttribute('cx', px.toFixed(2));
        maneton.setAttribute('cy', py.toFixed(2));
        piston.setAttribute('x', (xp - 24).toFixed(2));
        groupe.setAttribute('transform', `translate(${a.x.toFixed(2)} 0)`);
      };
      jouer = () => gsap.to(a, { v: 360, x: 12, duration: 1.2, ease: 'power2.inOut', onUpdate: maj, overwrite: true });
      revenir = () => gsap.to(a, { v: 0, x: 0, duration: 0.4, ease: 'power2.out', onUpdate: maj, overwrite: true });
    }

    if (type === 'automates') {
      // Un tour de manivelle : la came excentrée tourne, le poussoir monte et descend (contact exact).
      const groupe = carte.querySelector<SVGGElement>('[data-carte-automate]')!;
      const c = JSON.parse(groupe.dataset.came!) as { cx: number; cy: number; R: number; e: number };
      const came = groupe.querySelector('[data-carte-came]')!;
      const poussoir = groupe.querySelector('[data-carte-poussoir]')!;
      const image = carte.querySelector('[data-carte-image]');
      const contact = (deg: number) => {
        const t = (deg * Math.PI) / 180;
        return c.cy + c.e * Math.sin(t) - Math.sqrt(c.R ** 2 - (c.e * Math.cos(t)) ** 2);
      };
      const a = { v: 0 };
      const maj = () => {
        came.setAttribute('transform', `rotate(${a.v.toFixed(2)} ${c.cx} ${c.cy})`);
        poussoir.setAttribute('transform', `translate(0 ${(contact(a.v) - contact(0)).toFixed(2)})`);
      };
      jouer = () => {
        gsap.to(a, { v: 360, duration: 1.4, ease: 'power2.inOut', onUpdate: maj, overwrite: true });
        gsap.to(image, { scale: 1.04, duration: 0.8, ease: 'expo.out', overwrite: true });
      };
      revenir = () => {
        gsap.to(a, { v: 0, duration: 0.5, ease: 'power2.out', onUpdate: maj, overwrite: true });
        gsap.to(image, { scale: 1, duration: 0.4, overwrite: true });
      };
    }

    if (type === 'pour-debuter') {
      const pieces = carte.querySelectorAll('[data-carte-piece]');
      gsap.set(pieces, { transformOrigin: '50% 50%' });
      jouer = () =>
        gsap.to(pieces, { y: -10, rotation: (i: number) => (i % 2 ? -6 : 6), duration: 0.6, stagger: 0.08, ease: 'expo.out', overwrite: true });
      revenir = () => gsap.to(pieces, { y: 0, rotation: 0, duration: 0.4, ease: 'power2.out', overwrite: true });
    }

    if (survol) {
      carte.addEventListener('pointerenter', jouer);
      carte.addEventListener('focus', jouer);
      carte.addEventListener('pointerleave', revenir);
      carte.addEventListener('blur', revenir);
    } else {
      // Écran tactile : l'animation se joue une fois quand la carte est visible à 60 %.
      const obs = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            jouer();
            obs.disconnect();
          }
        },
        { threshold: 0.6 },
      );
      obs.observe(carte);
    }
  });
}

/** 6. Les maquettes du moment : rail horizontal épinglé (ordinateur, écran assez haut). */
function maquettesDuMoment(gsap: Gsap, ScrollTrigger: ScrollTriggerType) {
  const section = document.querySelector<HTMLElement>('[data-moment]');
  const rail = section?.querySelector<HTMLElement>('[data-moment-rail]');
  if (!section || !rail) return;
  const ok = window.matchMedia('(min-width: 1024px)').matches && window.innerHeight >= 680;
  if (!ok) return;
  section.classList.add('horizontal');
  rail.querySelector<HTMLElement>('.fin-rail')?.classList.remove('hidden');
  const distance = () => Math.max(0, rail.scrollWidth - (rail.parentElement?.clientWidth ?? window.innerWidth) + 48);
  const hauteur = () => {
    section.style.height = `${window.innerHeight + distance()}px`;
  };
  hauteur();
  ScrollTrigger.addEventListener('refreshInit', hauteur);
  gsap.to(rail, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: { trigger: section, start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true },
  });
  const barre = section.querySelector('[data-moment-barre]');
  if (barre) gsap.to(barre, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: section, start: 'top top', end: 'bottom bottom', scrub: 0.6 } });
}

/** 8. Échelle : segments qui se remplissent un à un (0,8 s, décalage 0,15 s), une fois à 80 %. */
function echelle(gsap: Gsap) {
  const echelle = document.querySelector('[data-echelle]');
  if (!echelle) return;
  gsap.to(echelle.querySelectorAll('[data-jauge-segment]'), {
    scaleX: 1,
    duration: 0.8,
    stagger: 0.15,
    ease: 'expo.out',
    scrollTrigger: { trigger: echelle, start: 'top 80%', once: true },
  });
}

/** 9. Offrir : parallaxe légère du visuel, étiquette kraft qui oscille à l'entrée puis au survol. */
function offrir(gsap: Gsap) {
  const visuel = document.querySelector<HTMLElement>('[data-offrir-visuel]');
  if (!visuel) return;
  const image = visuel.querySelector('[data-offrir-image]');
  const etiquette = visuel.querySelector('[data-offrir-etiquette]');
  if (image) gsap.fromTo(image, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: visuel, start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
  if (!etiquette) return;
  const osciller = () =>
    !pause.active &&
    gsap.fromTo(
      etiquette,
      { rotation: 0 },
      { keyframes: [{ rotation: 4 }, { rotation: -2 }, { rotation: 0 }], duration: 1.6, ease: 'elastic.out(1, .5)', transformOrigin: '50% 0%', overwrite: true },
    );
  gsap.timeline({ scrollTrigger: { trigger: visuel, start: 'top 80%', once: true, onEnter: () => osciller() } });
  visuel.addEventListener('pointerenter', () => osciller());
}

/** 10. L'atelier : halo laiton qui suit lentement le pointeur (ordinateur, lissage 800 ms). */
function atelier(gsap: Gsap) {
  const section = document.querySelector<HTMLElement>('[data-atelier]');
  const halo = section?.querySelector<HTMLElement>('[data-atelier-halo]');
  if (!section || !halo || !pointeurFin()) return;
  const x = gsap.quickTo(halo, 'x', { duration: 0.8, ease: 'power3.out' });
  const y = gsap.quickTo(halo, 'y', { duration: 0.8, ease: 'power3.out' });
  section.addEventListener('pointermove', (e) => {
    if (pause.active) return;
    const r = section.getBoundingClientRect();
    x(e.clientX - r.left);
    y(e.clientY - r.top);
  });
}
