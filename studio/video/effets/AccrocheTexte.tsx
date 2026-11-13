// Effet 1 « accroche-texte » : gros titre mot par mot, mot clé en laiton (italique).
// Principes : anticipation (le mot part un peu plus bas), slow in/slow out, overshoot léger (exagération),
// chevauchement (chaque mot démarre avant la fin du précédent).
import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, TITRE, lerp} from './commun';

export type MotTitre = {texte: string; laiton?: boolean; retour?: boolean};

export const AccrocheTexte: React.FC<{
	mots: MotTitre[];
	debut?: number; // image de départ
	cadence?: number; // images entre deux mots
	taille?: number;
	haut?: number; // position verticale du bloc
	sortieA?: number; // image où le titre commence à partir (facultatif)
}> = ({mots, debut = 3, cadence = 5, taille = 132, haut = 520, sortieA}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const lignes: MotTitre[][] = [[]];
	mots.forEach((m) => {
		if (m.retour) lignes.push([]);
		lignes[lignes.length - 1].push(m);
	});
	let k = 0;
	const depart = sortieA ? lerp(f, sortieA, sortieA + 10, 0, 1) : 0;
	return (
		<div
			style={{
				position: 'absolute',
				top: haut,
				left: 60,
				right: 60,
				textAlign: 'center',
				fontFamily: TITRE,
				fontWeight: 500,
				fontSize: taille,
				lineHeight: 1.02,
				color: C.texte,
				opacity: 1 - depart,
				transform: `translateY(${-depart * 60}px) scale(${1 + depart * 0.04})`,
			}}
		>
			{lignes.map((ligne, li) => (
				<div key={li} style={{whiteSpace: 'nowrap'}}>
					{ligne.map((m) => {
						const i = k++;
						const s = spring({frame: f - debut - i * cadence, fps, config: {damping: 11, stiffness: 140, mass: 0.7}});
						const flou = (1 - Math.min(s, 1)) * 14;
						return (
							<span
								key={i}
								style={{
									display: 'inline-block',
									margin: '0 0.12em',
									opacity: Math.min(1, s * 1.6),
									transform: `translateY(${(1 - s) * 70}px) scale(${0.9 + 0.1 * s})`,
									filter: `blur(${flou}px)`,
									color: m.laiton ? C.laiton : C.texte,
									fontStyle: m.laiton ? 'italic' : 'normal',
								}}
							>
								{m.texte}
							</span>
						);
					})}
				</div>
			))}
		</div>
	);
};
