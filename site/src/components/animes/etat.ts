// Conditions communes aux îlots animés (V2-2).
// Le rendu serveur est toujours la version statique ; l'animation n'est montée qu'après l'hydratation,
// et seulement si html.js-anim est présent (posé par Base.astro : ni mouvement réduit, ni économie de données)
// et si prefers-reduced-motion ne demande pas moins de mouvement.
import { useEffect, useState } from 'react';

export function animationPermise(): boolean {
  if (typeof window === 'undefined') return false;
  if (!document.documentElement.classList.contains('js-anim')) return false;
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Vrai après le montage si l'animation est permise. Suit prefers-reduced-motion ET la classe html.js-anim :
 * si GSAP ne se charge pas, scripts/accueil.ts retire js-anim (et le bouton Pause n'apparaît pas) ;
 * les îlots repassent alors en version statique (Aurora démonté), sans mouvement impossible à arrêter.
 */
export function useAnimationPermise(): boolean {
  const [permise, setPermise] = useState(false);
  useEffect(() => {
    const requete = window.matchMedia('(prefers-reduced-motion: reduce)');
    const maj = () => setPermise(animationPermise());
    maj();
    requete.addEventListener('change', maj);
    const observateur = new MutationObserver(maj);
    observateur.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => {
      requete.removeEventListener('change', maj);
      observateur.disconnect();
    };
  }, []);
  return permise;
}

/** Vrai quand le visiteur a demandé la pause des animations (bouton de l'accueil : html.anim-pause). */
export function usePauseDemandee(): boolean {
  const [pause, setPause] = useState(false);
  useEffect(() => {
    const html = document.documentElement;
    const maj = () => setPause(html.classList.contains('anim-pause'));
    maj();
    const observateur = new MutationObserver(maj);
    observateur.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => observateur.disconnect();
  }, []);
  return pause;
}
