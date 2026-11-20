// Sélection de l'accueil (V2-2, composant 3) : cartes produit empilées au défilement (ScrollStack de React Bits).
// Les cartes sont les CarteProduit d'Astro, reçues en emplacements nommés (carte0 à carte4) : même contenu,
// mêmes styles, même lien unique par carte, prix compris.
// Rendu serveur, sans JS et mouvement réduit : la grille actuelle (1 colonne, 2 dès 640 px, 4 dès 1024 px).
// Garde-fous : défilement du système (pas de lissage), aucune inclinaison ni flou, carte du dessus jamais
// assombrie, cartes assez petites pour être vues en entier (prix compris) avant d'être recouvertes.
// Clavier : une carte qui reçoit le focus est dégagée des cartes qui la recouvrent.
import { useEffect, useRef, type ReactNode } from 'react';
import ScrollStack, { ScrollStackItem } from './ScrollStack';
import { useAnimationPermise } from './etat';

interface Props {
  nombre: number;
  carte0?: ReactNode;
  carte1?: ReactNode;
  carte2?: ReactNode;
  carte3?: ReactNode;
  carte4?: ReactNode;
}

const MAX_CARTES = 5;

/** Remonte la page tant qu'une carte suivante recouvre la carte qui a le focus. */
function degager(carte: HTMLElement, racine: HTMLElement) {
  const emplacements = [...racine.querySelectorAll<HTMLElement>('[data-stack-slot]')];
  const index = emplacements.findIndex((e) => e.contains(carte));
  if (index < 0) return;
  for (let essai = 0; essai < 10; essai++) {
    const r = emplacements[index].getBoundingClientRect();
    let recouvre = 0;
    for (const suivant of emplacements.slice(index + 1)) {
      const s = suivant.getBoundingClientRect();
      if (s.top < r.bottom && s.bottom > r.top) recouvre = Math.max(recouvre, r.bottom - s.top);
    }
    if (recouvre > 0) {
      window.scrollBy({ top: -(recouvre + 16), behavior: 'instant' });
      continue;
    }
    if (r.bottom > window.innerHeight) window.scrollBy({ top: r.bottom - window.innerHeight + 16, behavior: 'instant' });
    else if (r.top < 0) window.scrollBy({ top: r.top - 16, behavior: 'instant' });
    return;
  }
}

export default function PileProduits(props: Props) {
  const anime = useAnimationPermise();
  const racine = useRef<HTMLDivElement>(null);
  const cartes = [props.carte0, props.carte1, props.carte2, props.carte3, props.carte4].slice(0, Math.min(props.nombre, MAX_CARTES));

  useEffect(() => {
    const el = racine.current;
    if (!anime || !el) return undefined;
    const surFocus = (e: FocusEvent) => {
      const cible = e.target as HTMLElement;
      requestAnimationFrame(() => degager(cible, el));
    };
    el.addEventListener('focusin', surFocus);
    return () => el.removeEventListener('focusin', surFocus);
  }, [anime]);

  if (!anime) {
    return (
      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4" data-pile-statique>
        {cartes.map((carte, i) => (
          <li key={i}>{carte}</li>
        ))}
      </ul>
    );
  }

  return (
    <div ref={racine} data-pile-animee>
      <ScrollStack
        useWindowScroll={true}
        smoothScroll={false}
        blurAmount={0}
        tiltAmount={0}
        rotationAmount={0}
        dimAmount={0.15}
        itemDistance={100}
        itemStackDistance={24}
        stackPosition="15%"
        baseScale={0.9}
        itemScale={0.03}
        snap={false}
      >
        {cartes.map((carte, i) => (
          // Largeur bornée par la hauteur d'écran : la carte entière (prix compris) tient sous le point d'empilement.
          <ScrollStackItem key={i} itemClassName="mx-auto max-w-[min(340px,calc((85svh_-_230px)_*_0.8))]">
            {carte}
          </ScrollStackItem>
        ))}
      </ScrollStack>
    </div>
  );
}
