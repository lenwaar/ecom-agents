// Effet 7 « planche-a-objet » : comparateur animé, la planche de bois devient l'objet monté.
// Principes : anticipation (le curseur recule avant de balayer), slow in/slow out, follow through
// (l'étiquette « L'objet » arrive après le curseur), action secondaire (lueur laiton du curseur).
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {C, TEXTE, lerp, sortie} from './commun';

export const FondCreme: React.FC = () => (
	<AbsoluteFill style={{background: `radial-gradient(120% 70% at 50% 52%, #F5F0E6 0%, #E7DFD1 100%)`}} />
);

// Image catalogue 4:5 posée sur toute la largeur, bords haut et bas fondus dans le fond crème
export const ImageCatalogue: React.FC<{src: string; echelle?: number; dy?: number; style?: React.CSSProperties}> = ({
	src,
	echelle = 1,
	dy = 0,
	style,
}) => (
	<Img
		src={staticFile(src)}
		style={{
			position: 'absolute',
			left: 0,
			top: 285 + dy,
			width: 1080,
			height: 1350,
			transform: `scale(${echelle})`,
			transformOrigin: '50% 50%',
			WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, #000 7%, #000 93%, transparent 100%)',
			...style,
		}}
	/>
);

const Etiquette: React.FC<{texte: string; x: number; y: number; o: number; laiton?: boolean}> = ({texte, x, y, o, laiton}) => (
	<div
		style={{
			position: 'absolute',
			left: x,
			top: y,
			opacity: o,
			transform: `translateY(${(1 - o) * 18}px)`,
			fontFamily: TEXTE,
			fontWeight: 600,
			fontSize: 40,
			color: laiton ? C.nuit : C.texte,
			background: laiton ? C.laiton : 'rgba(10,15,26,0.8)',
			padding: '10px 24px',
			borderRadius: 999,
		}}
	>
		{texte}
	</div>
);

export const PlancheAObjet: React.FC<{
	avant: string;
	apres: string;
	debut?: number; // image où le balayage commence
	duree?: number; // durée du balayage (images)
	etiquetteAvant?: string;
	etiquetteApres?: string;
}> = ({avant, apres, debut = 30, duree = 40, etiquetteAvant = 'La planche', etiquetteApres = "L'objet"}) => {
	const f = useCurrentFrame();
	// anticipation : petit recul vers la droite, puis balayage vers la gauche
	const recul = lerp(f, debut - 10, debut, 0, 1, sortie);
	const balayage = lerp(f, debut, debut + duree, 0, 1);
	const x = 1080 - 40 + 40 * recul - 1120 * balayage;
	const xc = Math.max(-20, Math.min(1100, x));
	const pousse = lerp(f, 0, debut + duree + 60, 1.0, 1.06);
	const visible = f > debut - 12 && balayage < 0.999;
	const lueur = Math.sin(Math.min(1, balayage) * Math.PI);
	return (
		<AbsoluteFill>
			<FondCreme />
			<ImageCatalogue src={avant} echelle={pousse} />
			<div style={{position: 'absolute', inset: 0, clipPath: `inset(0 0 0 ${Math.max(0, xc)}px)`}}>
				<FondCreme />
				<ImageCatalogue src={apres} echelle={pousse * 1.02} />
			</div>
			{visible && (
				<div style={{position: 'absolute', left: xc - 3, top: 380, width: 6, height: 1210, background: C.laiton, boxShadow: `0 0 ${20 + 40 * lueur}px rgba(200,161,90,${0.5 + 0.4 * lueur})`}}>
					<div
						style={{
							position: 'absolute',
							left: -37,
							top: 540,
							width: 80,
							height: 80,
							borderRadius: 40,
							background: C.nuit,
							border: `5px solid ${C.laiton}`,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 10,
						}}
					>
						<div style={{width: 0, height: 0, borderTop: '11px solid transparent', borderBottom: '11px solid transparent', borderRight: `14px solid ${C.laiton}`}} />
						<div style={{width: 0, height: 0, borderTop: '11px solid transparent', borderBottom: '11px solid transparent', borderLeft: `14px solid ${C.laiton}`}} />
					</div>
				</div>
			)}
			<Etiquette texte={etiquetteAvant} x={70} y={420} o={lerp(f, 4, 16, 0, 1, sortie) * (1 - lerp(f, debut + duree * 0.3, debut + duree * 0.6, 0, 1))} />
			<Etiquette texte={etiquetteApres} x={70} y={420} o={lerp(f, debut + duree * 0.8, debut + duree + 8, 0, 1, sortie)} laiton />
		</AbsoluteFill>
	);
};
