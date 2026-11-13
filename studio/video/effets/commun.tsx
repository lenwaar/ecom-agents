// Socle commun des effets du studio vidéo : couleurs et polices de knowledge/marque.md, courbes,
// chargement des polices auto-hébergées (Fontsource, OFL-1.1), mention de démonstration.
import React from 'react';
import {continueRender, delayRender, Easing, interpolate, staticFile} from 'remotion';

export const C = {
	nuit: '#0A0F1A',
	nuit2: '#111827',
	texte: '#F5F1E8',
	texte2: '#A8A29A',
	laiton: '#C8A15A',
	laitonFonce: '#8A6A3A',
	papier: '#FBFAF7',
	creme: '#F2ECE1', // fond des rendus catalogue (studio/lib/rigs.js, bgA/bgB)
};

export const TITRE = '"Cormorant Garamond", Georgia, serif';
export const TEXTE = 'Inter, "Segoe UI", Arial, sans-serif';

// Zone sûre 1080×1920 : rien d'important dans les 15 % du haut (288 px) ni les 20 % du bas (384 px).
export const ZONE = {haut: 288, bas: 1920 - 384};

// Courbes (jamais de mouvement linéaire)
export const sortie = Easing.bezier(0.16, 1, 0.3, 1); // entrée rapide, arrivée douce
export const douce = Easing.bezier(0.65, 0, 0.35, 1); // ralenti au départ et à l'arrivée

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const lerp = (f: number, a: number, b: number, v0: number, v1: number, easing = douce) =>
	interpolate(f, [a, b], [v0, v1], {...clamp, easing});

// --- polices (chargées une seule fois, le rendu attend qu'elles soient prêtes)
const POLICES: [string, string, FontFaceDescriptors][] = [
	['Cormorant Garamond', 'polices/cormorant-garamond-latin-400-normal.woff2', {weight: '400', style: 'normal'}],
	['Cormorant Garamond', 'polices/cormorant-garamond-latin-500-normal.woff2', {weight: '500', style: 'normal'}],
	['Cormorant Garamond', 'polices/cormorant-garamond-latin-400-italic.woff2', {weight: '400', style: 'italic'}],
	['Cormorant Garamond', 'polices/cormorant-garamond-latin-500-italic.woff2', {weight: '500', style: 'italic'}],
	['Inter', 'polices/inter-latin-wght-normal.woff2', {weight: '100 900', style: 'normal'}],
];
let charge = false;
export const chargerPolices = () => {
	if (charge || typeof document === 'undefined') return;
	charge = true;
	const h = delayRender('polices');
	Promise.all(
		POLICES.map(([nom, fichier, desc]) => {
			const f = new FontFace(nom, `url(${staticFile(fichier)}) format('woff2')`, desc);
			return f.load().then((x) => document.fonts.add(x));
		}),
	)
		.then(() => continueRender(h))
		.catch((e) => {
			console.error(e);
			continueRender(h);
		});
};

// --- mention obligatoire (leçons 11 et 14 de docs/retours-experience.md) : visible pendant toute la vidéo,
// lisible (36 px), dans la zone sûre (sous les 15 % du haut) et hors des zones d'interface des plateformes
// (barre d'onglets en haut, colonne de boutons à droite à partir d'environ y = 900, légende en bas).
// Une ligne par élément séparé par un saut de ligne. La pastille tient entre x = 110 et x = 970.
export const MENTION = {haut: 320, taille: 36, largeurMax: 860};
export const Mention: React.FC<{texte: string; sombre?: boolean}> = ({texte, sombre = true}) => {
	if (MENTION.haut < ZONE.haut) throw new Error('Mention hors zone sûre');
	return (
		<div
			style={{
				position: 'absolute',
				top: MENTION.haut,
				left: 0,
				right: 0,
				display: 'flex',
				justifyContent: 'center',
				pointerEvents: 'none',
			}}
		>
			<div
				style={{
					maxWidth: MENTION.largeurMax,
					textAlign: 'center',
					fontFamily: TEXTE,
					fontWeight: 600,
					fontSize: MENTION.taille,
					lineHeight: 1.22,
					letterSpacing: 0.2,
					color: sombre ? C.texte : C.nuit,
					background: sombre ? 'rgba(10,15,26,0.78)' : 'rgba(251,250,247,0.85)',
					padding: '12px 30px',
					borderRadius: 26,
					border: `1.5px solid ${sombre ? 'rgba(200,161,90,0.6)' : 'rgba(138,106,58,0.5)'}`,
					boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
				}}
			>
				{texte.split('\n').map((l, i) => (
					<div key={i} style={{whiteSpace: 'nowrap'}}>
						{l}
					</div>
				))}
			</div>
		</div>
	);
};
