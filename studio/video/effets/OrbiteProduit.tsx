// Effet 3 « orbite-produit » : caméra qui tourne autour du produit 3D.
// Les images viennent de `studio/orbite.js` (rendu Three.js, lumière fixe, distance constante, courbe douce).
// Ici : lecture de la séquence + léger travelling avant (slow in/slow out) pour donner du poids au plan.
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {lerp} from './commun';

export const OrbiteProduit: React.FC<{dossier: string; images: number; duree: number; poussee?: number}> = ({dossier, images, duree, poussee = 0.05}) => {
	const f = useCurrentFrame();
	const total = Math.max(1, duree - 1);
	const i = Math.min(images - 1, Math.round((f / total) * (images - 1)));
	const e = lerp(f, 0, duree, 1, 1 + poussee);
	return (
		<AbsoluteFill style={{background: '#EEE7DB'}}>
			<Img
				src={staticFile(`${dossier}/f${String(i).padStart(4, '0')}.png`)}
				style={{width: 1080, height: 1920, transform: `scale(${e})`, transformOrigin: '50% 48%'}}
			/>
		</AbsoluteFill>
	);
};
