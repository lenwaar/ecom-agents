// Titre du héros de l'accueil (V2-2, composant 2) : SplitText de React Bits, révélation ligne par ligne.
// Le texte vient de HerosAccueil.astro (jamais un texte d'origine du composant).
// Rendu serveur, sans JS et mouvement réduit : titre affiché d'un bloc, sans découpage.
// Lecteurs d'écran : GSAP pose aria-label (phrase entière) et masque les morceaux (option aria: 'auto').
import SplitText from './SplitText';

interface Props {
  ligne1: string;
  /** Deuxième ligne, affichée en italique (laiton, via .titre-serif em). */
  ligne2: string;
  className?: string;
}

export default function TitreHeros({ ligne1, ligne2, className = '' }: Props) {
  return (
    <SplitText
      id="titre-heros"
      tag="h1"
      text={`${ligne1} ${ligne2}`}
      className={`block ${className}`}
      splitType="lines"
      effect="rise"
      mask={true}
      duration={1.0}
      delay={120}
      ease="expo.out"
      trigger="load"
      loop={false}
      hoverEffect="none"
      textAlign="left"
    >
      {ligne1}
      {/* Espace avant le retour à la ligne : aria-label lu « La mécanique, pièce par pièce. ». */}
      {' '}
      <br />
      <em>{ligne2}</em>
    </SplitText>
  );
}
