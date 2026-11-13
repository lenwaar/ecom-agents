// Animations des pages de collection (§4.3), chargées seulement si l'animation va réellement tourner
// (html.js-anim : ni prefers-reduced-motion, ni économie de données). Sinon, rien ne bouge
// et tout reste visible (états initiaux masqués seulement sous html.js-anim).
// - Mouvements continus (engrenages, bielle, lumière, pièces, étiquette) arrêtés hors écran,
//   onglet caché, ou par le bouton « Mettre en pause les animations » (audit N4, sans stockage).
// - Entrée : H1 en R1, texte en R2 ; sortie liée au défilement : visuel yPercent → −20, opacité → 0,3.

type Boucle = { tourner: (dt: number) => void };

export async function animerCollection(): Promise<void> {
  if (!document.documentElement.classList.contains('js-anim')) return;
  const heros = document.querySelector<HTMLElement>('[data-heros-collection]');
  const visuel = heros?.querySelector<HTMLElement>('[data-visuel]');
  if (!heros || !visuel) return;

  const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
  gsap.registerPlugin(ScrollTrigger);

  // R1 « titre » : lignes yPercent 110 → 0, 1,2 s, décalage 0,12 s.
  gsap.fromTo(heros.querySelectorAll('[data-ligne] > span'), { y: 0, yPercent: 110 }, { yPercent: 0, duration: 1.2, stagger: 0.12, ease: 'expo.out' });
  gsap.fromTo(heros.querySelectorAll('[data-revele-heros]'), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.1, delay: 0.3, ease: 'expo.out' });

  // Sortie liée au défilement.
  gsap.to(visuel, { yPercent: -20, opacity: 0.3, ease: 'none', scrollTrigger: { trigger: heros, start: 'top top', end: 'bottom top', scrub: 0.6 } });

  // Accélération au défilement (Mécanique, Véhicules), comme le héros de l'accueil.
  let elan = 0;
  ScrollTrigger.create({
    trigger: heros,
    start: 'top top',
    end: 'bottom top',
    onUpdate: (st) => (elan = Math.min(4, Math.abs(st.getVelocity()) / 600)),
  });

  const boucles: Boucle[] = [];
  const timelines: gsap.core.Animation[] = [];
  const type = visuel.dataset.visuel;

  if (type === 'mecanique') {
    const roues = [...visuel.querySelectorAll<SVGPathElement>('[data-roue]')].map((el) => ({
      el,
      phase: Number(el.dataset.phase),
      rapport: Number(el.dataset.rapport),
    }));
    let angle = 0;
    boucles.push({
      tourner: (dt) => {
        angle += dt * (12 + elan * 40); // degrés par seconde de la première roue
        roues.forEach((r) => r.el.setAttribute('transform', `rotate(${(r.phase + r.rapport * angle).toFixed(3)})`));
      },
    });
  }

  if (type === 'vehicules') {
    const svg = visuel.querySelector<SVGSVGElement>('[data-bielle]')!;
    const v = JSON.parse(svg.dataset.bielle!) as { cx: number; cy: number; r: number; L: number };
    const roue = svg.querySelector('[data-roue-vehicule]')!;
    const tige = svg.querySelector('[data-tige]')!;
    const maneton = svg.querySelector('[data-maneton]')!;
    const piston = svg.querySelector('[data-piston]')!;
    let angle = 0;
    boucles.push({
      tourner: (dt) => {
        angle += dt * (60 + elan * 120);
        const a = (angle * Math.PI) / 180;
        const px = v.cx + v.r * Math.cos(a);
        const py = v.cy + v.r * Math.sin(a);
        const xp = px - Math.sqrt(v.L ** 2 - (py - v.cy) ** 2); // bielle de longueur constante
        roue.setAttribute('transform', `rotate(${angle.toFixed(2)} ${v.cx} ${v.cy})`);
        tige.setAttribute('x1', px.toFixed(2));
        tige.setAttribute('y1', py.toFixed(2));
        tige.setAttribute('x2', xp.toFixed(2));
        maneton.setAttribute('cx', px.toFixed(2));
        maneton.setAttribute('cy', py.toFixed(2));
        piston.setAttribute('x', (xp - 60).toFixed(2));
      },
    });
  }

  if (type === 'automates') {
    const image = visuel.querySelector('[data-calque-image]');
    const lumiere = visuel.querySelector('[data-calque-lumiere]');
    if (image) gsap.fromTo(image, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: heros, start: 'top top', end: 'bottom top', scrub: 0.6 } });
    if (lumiere) timelines.push(gsap.to(lumiere, { opacity: 0.6, duration: 8, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
  }

  if (type === 'pour-debuter') {
    const pieces = visuel.querySelectorAll('[data-piece]');
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
    tl.to(pieces, { y: -10, rotation: (i: number) => (i % 2 ? -6 : 6), transformOrigin: '50% 50%', duration: 1.2, stagger: 0.08, ease: 'expo.out' })
      .to(pieces, { y: 0, rotation: 0, duration: 1.2, stagger: 0.08, ease: 'expo.inOut' }, '+=1.4');
    timelines.push(tl);
  }

  if (type === 'idees-cadeaux') {
    const etiquette = visuel.querySelector('[data-etiquette]');
    if (etiquette) {
      const tl = gsap.timeline();
      tl.to(etiquette, { keyframes: [{ rotation: 4 }, { rotation: -2 }, { rotation: 0 }], duration: 1.6, ease: 'elastic.out(1, .5)' }).to(etiquette, {
        rotation: 2,
        duration: 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
      timelines.push(tl);
    }
  }

  // Boucle d'animation, arrêtée hors écran, onglet caché ou en pause.
  let enVue = true;
  let enPause = false;
  let precedent = 0;
  let requete = 0;
  const image = (t: number) => {
    const dt = precedent ? Math.min(0.05, (t - precedent) / 1000) : 0;
    precedent = t;
    boucles.forEach((b) => b.tourner(dt));
    elan *= 0.92;
    requete = requestAnimationFrame(image);
  };
  const maj = () => {
    const tourne = enVue && !enPause && !document.hidden;
    cancelAnimationFrame(requete);
    precedent = 0;
    if (tourne && boucles.length) requete = requestAnimationFrame(image);
    timelines.forEach((tl) => (tourne ? tl.resume() : tl.pause()));
  };
  new IntersectionObserver(([e]) => {
    enVue = e.isIntersecting;
    maj();
  }).observe(heros);
  document.addEventListener('visibilitychange', maj);

  // Bouton « Mettre en pause les animations » (audit N4) : visible seulement si quelque chose bouge.
  const bouton = document.querySelector<HTMLButtonElement>('[data-pause-animations]');
  if (bouton && (boucles.length || timelines.length)) {
    bouton.hidden = false;
    bouton.addEventListener('click', () => {
      enPause = !enPause;
      bouton.setAttribute('aria-pressed', String(enPause));
      bouton.querySelector('[data-libelle]')!.textContent = enPause ? 'Reprendre les animations' : 'Mettre en pause les animations';
      bouton.querySelector('[data-icone-pause]')?.classList.toggle('hidden', enPause);
      bouton.querySelector('[data-icone-lecture]')?.classList.toggle('hidden', !enPause);
      maj();
    });
  }
  maj();
}
