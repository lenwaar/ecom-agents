// Comparateur avant / après (§4.1.3). Fonctionne avec ou sans animation : c'est une action volontaire.
// Sans JavaScript, les deux images restent côte à côte (rien n'est caché).
// Pointeur (souris, doigt, stylet) : glisser ou toucher une position ; clavier : input range.

export function poserPosition(comparateur: HTMLElement, valeur: number): void {
  const v = Math.max(0, Math.min(100, valeur));
  comparateur.style.setProperty('--pos', `${v}%`);
  const curseur = comparateur.querySelector<HTMLInputElement>('input[type="range"]');
  if (curseur) {
    curseur.value = String(Math.round(v));
    curseur.setAttribute('aria-valuetext', `${Math.round(100 - v)} % maquette montée`);
  }
  // Les étiquettes « Avant » / « Après » s'estompent quand la poignée passe dessus.
  comparateur.querySelector('.image-avant .etiquette')?.classList.toggle('estompee', v < 18);
  comparateur.querySelector('.image-apres .etiquette')?.classList.toggle('estompee', v > 82);
}

export function initialiserComparateurs(): void {
  document.querySelectorAll<HTMLElement>('[data-comparateur]').forEach((comparateur) => {
    if (comparateur.classList.contains('actif')) return;
    const curseur = comparateur.querySelector<HTMLInputElement>('input[type="range"]');
    const poignee = comparateur.querySelector<HTMLElement>('.poignee');
    if (!curseur || !poignee) return;

    comparateur.classList.add('actif');
    curseur.hidden = false;
    poignee.hidden = false;
    poserPosition(comparateur, 50);

    const depuisPointeur = (e: PointerEvent) => {
      const r = comparateur.getBoundingClientRect();
      poserPosition(comparateur, ((e.clientX - r.left) / r.width) * 100);
    };

    let actif = false;
    let depart: { x: number; y: number } | null = null;
    comparateur.addEventListener('pointerdown', (e) => {
      comparateur.dataset.touche = '1';
      depart = { x: e.clientX, y: e.clientY };
      if (e.pointerType === 'mouse') {
        actif = true;
        comparateur.setPointerCapture(e.pointerId);
        comparateur.classList.add('glisse');
        depuisPointeur(e);
      }
    });
    comparateur.addEventListener('pointermove', (e) => {
      if (!actif && depart && e.pointerType !== 'mouse') {
        // Doigt : on ne prend la main que si le geste est plutôt horizontal (le défilement vertical reste libre).
        const dx = Math.abs(e.clientX - depart.x);
        const dy = Math.abs(e.clientY - depart.y);
        if (dx > 6 && dx > dy) {
          actif = true;
          comparateur.setPointerCapture(e.pointerId);
          comparateur.classList.add('glisse');
        }
      }
      if (actif) depuisPointeur(e);
    });
    const fin = (e: PointerEvent) => {
      // Simple toucher (sans glisser) : la poignée va à cette position.
      if (!actif && depart && e.type === 'pointerup' && Math.abs(e.clientX - depart.x) < 6 && Math.abs(e.clientY - depart.y) < 6) {
        depuisPointeur(e);
      }
      actif = false;
      depart = null;
      comparateur.classList.remove('glisse');
    };
    comparateur.addEventListener('pointerup', fin);
    comparateur.addEventListener('pointercancel', fin);

    curseur.addEventListener('input', () => {
      comparateur.dataset.touche = '1';
      poserPosition(comparateur, Number(curseur.value));
    });
    // Page précédente / suivante : ±10 (le pas natif est de 5).
    curseur.addEventListener('keydown', (e) => {
      if (e.key === 'PageUp' || e.key === 'PageDown') {
        e.preventDefault();
        comparateur.dataset.touche = '1';
        poserPosition(comparateur, Number(curseur.value) + (e.key === 'PageUp' ? 10 : -10));
      }
    });
  });
}
