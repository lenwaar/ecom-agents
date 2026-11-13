// Effet 11 « fin-appel » : logo, nom, appel à l'action, mention « Visuel de démonstration » si besoin.
// Principes : mise en scène (une idée à la fois), slow in/slow out, follow through (filet puis texte),
// appeal (fond nuit, lueur laiton, typographies de la marque).
import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, TEXTE, TITRE, lerp, sortie} from './commun';

export const FinAppel: React.FC<{
	appel: string;
	signature?: string;
	mention?: string;
}> = ({appel, signature = 'Maquettes mécaniques en bois à assembler', mention}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const logo = spring({frame: f - 2, fps, config: {damping: 14, stiffness: 110}});
	const filet = lerp(f, 10, 28, 0, 1, sortie);
	const sign = lerp(f, 18, 32, 0, 1, sortie);
	const cta = spring({frame: f - 30, fps, config: {damping: 10, stiffness: 150, mass: 0.7}});
	const halo = 0.55 + 0.1 * Math.sin(f / 12);
	return (
		<AbsoluteFill style={{background: C.nuit}}>
			<AbsoluteFill style={{background: `radial-gradient(60% 35% at 50% 46%, rgba(200,161,90,${0.22 * halo}) 0%, rgba(10,15,26,0) 70%)`}} />
			<div style={{position: 'absolute', top: 700, left: 0, right: 0, textAlign: 'center'}}>
				<div
					style={{
						fontFamily: TITRE,
						fontWeight: 500,
						fontSize: 136,
						color: C.texte,
						opacity: Math.min(1, logo * 1.5),
						transform: `translateY(${(1 - logo) * 50}px) scale(${0.94 + 0.06 * logo})`,
						filter: `blur(${(1 - Math.min(1, logo)) * 10}px)`,
					}}
				>
					Rouage <span style={{color: C.laiton, fontStyle: 'italic'}}>&amp;</span> Laiton
				</div>
				<div style={{margin: '26px auto 0', width: 420 * filet, height: 3, background: C.laiton}} />
				<div style={{fontFamily: TEXTE, fontWeight: 400, fontSize: 40, color: C.texte2, marginTop: 30, opacity: sign, transform: `translateY(${(1 - sign) * 16}px)`}}>
					{signature}
				</div>
				<div
					style={{
						display: 'inline-block',
						marginTop: 70,
						fontFamily: TEXTE,
						fontWeight: 600,
						fontSize: 48,
						color: C.nuit,
						background: C.laiton,
						padding: '22px 52px',
						borderRadius: 999,
						opacity: Math.min(1, cta * 1.5),
						transform: `scale(${0.85 + 0.15 * cta})`,
					}}
				>
					{appel}
				</div>
			</div>
			{mention && (
				<div style={{position: 'absolute', top: 1440, left: 0, right: 0, textAlign: 'center', fontFamily: TEXTE, fontSize: 30, color: C.texte2, opacity: sign}}>
					{mention}
				</div>
			)}
		</AbsoluteFill>
	);
};
