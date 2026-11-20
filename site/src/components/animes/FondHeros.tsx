// Fond animé du héros de l'accueil (V2-2, composant 1) : Aurora de React Bits.
// Version statique (rendu serveur, sans JS, mouvement réduit, moins de 768 px, pas de WebGL2) :
// aucun canvas, le fond CSS de .heros (HerosAccueil.astro) suffit.
// Le bouton « Mettre en pause les animations » de l'accueil fige le fond (prop paused).
import { useEffect, useState } from 'react';
import Aurora from './Aurora';
import { useAnimationPermise, usePauseDemandee } from './etat';

const ORDINATEUR = '(min-width: 768px)';

function webgl2Disponible(): boolean {
  try {
    return Boolean(document.createElement('canvas').getContext('webgl2'));
  } catch {
    return false;
  }
}

export default function FondHeros() {
  const permise = useAnimationPermise();
  const pause = usePauseDemandee();
  const [assezLarge, setAssezLarge] = useState(false);
  const [webgl, setWebgl] = useState(false);

  useEffect(() => {
    const requete = window.matchMedia(ORDINATEUR);
    const maj = () => setAssezLarge(requete.matches);
    maj();
    setWebgl(webgl2Disponible());
    requete.addEventListener('change', maj);
    return () => requete.removeEventListener('change', maj);
  }, []);

  const actif = permise && assezLarge && webgl;
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true" data-fond-heros>
      {actif && (
        <Aurora
          // --action-bleu-nuit, --fond-nuit, --accent-laiton (global.css). Ordre ajusté à l'œil : le noir nuit
          // au milieu évite que le dégradé OKLCH du bleu au laiton passe par le vert et le magenta.
          colorStops={['#1E3A5F', '#0A0F1A', '#C8A15A']}
          amplitude={0.6}
          blend={0.6}
          speed={0.4}
          opacity={0.45}
          mouseInteraction={false}
          intro={true}
          lightMode={false}
          dpr={1.5}
          paused={pause}
        />
      )}
    </div>
  );
}
