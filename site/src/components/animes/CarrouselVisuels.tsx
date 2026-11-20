// Visuels de la fiche produit (V2-2, composant 4) : Carousel de React Bits, parcours au pouce, aux flèches
// et au clavier (flèches, Début, Fin). Jamais de lecture automatique.
// Rendu serveur et sans JS : les visuels en colonne, comme avant (premier visuel prioritaire, les autres différés).
// En mouvement réduit, le carrousel reste utilisable, sans ressort (comportement d'origine du composant).
// Le bloc Achat (prix, bouton) est hors de cet îlot et n'est jamais recouvert.
import { useEffect, useRef, useState } from 'react';
import Carousel from './Carousel';

interface Visuel {
  src: string;
  alt: string;
}

interface Props {
  visuels: Visuel[];
}

const CLASSE_IMAGE = 'aspect-square w-full rounded-carte border border-bordure bg-encart object-cover';

export default function CarrouselVisuels({ visuels }: Props) {
  const [monte, setMonte] = useState(false);
  const [largeur, setLargeur] = useState(0);
  const cadre = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMonte(true);
    const el = cadre.current;
    if (!el) return undefined;
    const observateur = new ResizeObserver(([e]) => setLargeur(Math.round(e.contentRect.width)));
    observateur.observe(el);
    return () => observateur.disconnect();
  }, []);

  return (
    <div
      ref={cadre}
      className="grid gap-4 lg:self-start"
      data-visuels
      data-visuels-statiques={monte && largeur > 0 ? undefined : ''}
    >
      {monte && largeur > 0 ? (
        // Coupe la marge débordante du carrousel (« bleed ») au bord de la colonne : aucun défilement horizontal.
        // 8 px de marge gardent visible l'anneau de focus.
        <div className="-mx-2 overflow-x-clip px-2 py-2">
        <Carousel
          items={visuels.map((v) => ({ image: v.src, alt: v.alt }))}
          baseWidth={largeur}
          effect="slide"
          indicator="dots"
          arrows={true}
          autoplay={false}
          loop={false}
          draggable={true}
          theme="light"
          frame={false}
          radius={18}
          aspectRatio={1}
          peek={0}
        />
        </div>
      ) : (
        visuels.map((v, i) => (
          <img
            key={v.src + i}
            src={v.src}
            alt={v.alt}
            width={800}
            height={800}
            loading={i === 0 ? 'eager' : 'lazy'}
            decoding="async"
            className={CLASSE_IMAGE}
          />
        ))
      )}
    </div>
  );
}
