// « De la planche à l'objet » : 20 s, 9:16, boîte à musique à manivelle (produit de démonstration).
// Storyboard : outputs/2026-11-13-studio-video-de-la-planche-a-l-objet.md
import React from 'react';
import {AbsoluteFill, Img, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AccrocheTexte} from '../effets/AccrocheTexte';
import {CartesVerre} from '../effets/CartesVerre';
import {C, chargerPolices, lerp, Mention, sortie} from '../effets/commun';
import {FinAppel} from '../effets/FinAppel';
import {OrbiteProduit} from '../effets/OrbiteProduit';
import {FondCreme, ImageCatalogue, PlancheAObjet} from '../effets/PlancheAObjet';
import {Mot, SousTitres} from '../effets/SousTitres';

chargerPolices();

export type PropsPlanche = {mots: Mot[]; mention: string};

// Plans (images à 30 i/s)
export const PLANS = {
	accroche: [0, 60],
	planches: [60, 138],
	comparateur: [138, 240],
	orbite: [240, 324],
	detail: [324, 402],
	nuit: [402, 510], // chevauche la fin de 6 images (fondu enchaîné vers le logo)
	fin: [504, 600],
} as const;

// Entrée de plan : léger zoom qui se pose (coupe franche mais vivante)
const Entree: React.FC<{children: React.ReactNode; depuis?: number}> = ({children, depuis = 1.06}) => {
	const f = useCurrentFrame();
	const e = lerp(f, 0, 9, depuis, 1, sortie);
	return <AbsoluteFill style={{transform: `scale(${e})`}}>{children}</AbsoluteFill>;
};

const Accroche: React.FC = () => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const monte = spring({frame: f - 8, fps, config: {damping: 15, stiffness: 90}});
	// anticipation puis agrandissement vers le plan suivant
	const recul = lerp(f, 44, 50, 1, 0.97, sortie);
	const grandit = lerp(f, 50, 60, 1, 1.55);
	const y = 1010 + (1 - monte) * 300 - lerp(f, 50, 60, 0, 200);
	return (
		<AbsoluteFill style={{background: C.nuit}}>
			<AbsoluteFill style={{background: 'radial-gradient(70% 45% at 50% 30%, rgba(200,161,90,0.16) 0%, rgba(10,15,26,0) 70%)'}} />
			<div
				style={{
					position: 'absolute',
					left: 190,
					top: y,
					width: 700,
					height: 875,
					borderRadius: 30,
					overflow: 'hidden',
					opacity: Math.min(1, monte * 1.5),
					transform: `scale(${recul * grandit})`,
					boxShadow: '0 40px 90px rgba(0,0,0,0.6), 0 0 0 2px rgba(200,161,90,0.5)',
				}}
			>
				<Img src={staticFile('img/boite-1600.webp')} style={{width: 700, height: 875}} />
			</div>
			<AccrocheTexte
				mots={[{texte: 'De'}, {texte: 'la'}, {texte: 'planche'}, {texte: 'à', retour: true}, {texte: "l'objet.", laiton: true}]}
				debut={0}
				cadence={4}
				haut={500}
				sortieA={50}
			/>
		</AbsoluteFill>
	);
};

const Planches: React.FC = () => {
	const f = useCurrentFrame();
	const e = lerp(f, 0, 78, 1.04, 1.14);
	return (
		<AbsoluteFill>
			<FondCreme />
			<ImageCatalogue src="img/boite-1600.webp" echelle={e} dy={lerp(f, 0, 78, 20, -30)} />
		</AbsoluteFill>
	);
};

const Detail: React.FC = () => {
	const f = useCurrentFrame();
	const e = lerp(f, 0, 78, 1.0, 1.12);
	const r = lerp(f, 0, 78, -1.5, 1);
	return (
		<AbsoluteFill style={{background: '#E9DFC9', overflow: 'hidden'}}>
			<Img src={staticFile('img/detail-1600.webp')} style={{position: 'absolute', left: -228, top: 0, width: 1536, height: 1920, transform: `scale(${e}) rotate(${r}deg)`}} />
			<AbsoluteFill style={{background: 'radial-gradient(85% 60% at 50% 45%, rgba(10,15,26,0) 55%, rgba(10,15,26,0.45) 100%)'}} />
		</AbsoluteFill>
	);
};

const Nuit: React.FC = () => {
	const f = useCurrentFrame();
	// « Éteignez les lumières » : noir franc, puis la lampe s'allume (lumière qui monte en douceur)
	const allume = lerp(f, 2, 18, 0, 1, sortie);
	const e = lerp(f, 0, 102, 1.08, 1.0);
	return (
		<AbsoluteFill style={{background: C.nuit, overflow: 'hidden'}}>
			<Img
				src={staticFile('img/situation-1600.webp')}
				style={{
					position: 'absolute',
					left: -151,
					top: 330,
					width: 1382,
					height: 1728,
					opacity: allume,
					filter: `brightness(${0.4 + 0.6 * allume})`,
					transform: `scale(${e})`,
					WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, #000 14%)',
				}}
			/>
			<CartesVerre
				cartes={[
					{titre: 'Niveau', valeur: 'Facile'},
					{titre: 'Mécanisme', valeur: 'À peigne'},
					{titre: 'Entraînement', valeur: 'Manivelle'},
				]}
				debut={24}
				decalage={10}
				haut={500}
			/>
		</AbsoluteFill>
	);
};

// Fin : fondu enchaîné de 6 images depuis la scène de nuit, logo déjà présent à la coupe (pas de plan vide).
// La mention « produit non vendu » est portée par la pastille du haut pendant toute la vidéo.
const FinEnchainee: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{opacity: lerp(f, 0, 6, 0, 1, sortie)}}>
			<FinAppel appel="Suivez-nous" avance={8} />
		</AbsoluteFill>
	);
};

const Vignette: React.FC = () => (
	<AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(120% 80% at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.22) 100%)'}} />
);

export const DeLaPlancheALObjet: React.FC<PropsPlanche> = ({mots, mention}) => {
	const P = PLANS;
	const d = (p: readonly [number, number]) => p[1] - p[0];
	return (
		<AbsoluteFill style={{background: C.nuit}}>
			<Sequence from={P.accroche[0]} durationInFrames={d(P.accroche)}>
				<Accroche />
			</Sequence>
			<Sequence from={P.planches[0]} durationInFrames={d(P.planches)}>
				<Entree depuis={1.1}>
					<Planches />
				</Entree>
			</Sequence>
			<Sequence from={P.comparateur[0]} durationInFrames={d(P.comparateur)}>
				<Entree>
					<PlancheAObjet avant="img/boite-1600.webp" apres="img/trois-quarts-1600.webp" debut={27} duree={40} />
				</Entree>
			</Sequence>
			<Sequence from={P.orbite[0]} durationInFrames={d(P.orbite)}>
				<Entree>
					<OrbiteProduit dossier="orbite/boite-a-musique" images={90} duree={d(P.orbite)} />
				</Entree>
			</Sequence>
			<Sequence from={P.detail[0]} durationInFrames={d(P.detail)}>
				<Entree depuis={1.12}>
					<Detail />
				</Entree>
			</Sequence>
			<Sequence from={P.nuit[0]} durationInFrames={d(P.nuit)}>
				<Nuit />
			</Sequence>
			<Sequence from={P.fin[0]} durationInFrames={d(P.fin)}>
				<FinEnchainee />
			</Sequence>
			<Vignette />
			<SousTitres mots={mots} masquerApres={P.fin[0] / 30} />
			<Mention texte={mention} />
		</AbsoluteFill>
	);
};
