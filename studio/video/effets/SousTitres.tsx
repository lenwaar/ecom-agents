// Effet 2 « sous-titres-mot-a-mot » : style TikTok, mot actif surligné en laiton, zone sûre respectée.
// Entrée : liste de mots avec leurs temps (faster-whisper, ou temps calés à la main pour une version muette).
// Groupes de 4 mots au plus, coupés aux pauses et à la ponctuation. Taille 64 px (minimum 48 px exigé).
import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, TEXTE, ZONE} from './commun';

// `page: true` force un nouveau groupe sur ce mot (coupes choisies au sens, pas au hasard).
export type Mot = {mot: string; debut: number; fin: number; page?: boolean};

export const grouper = (mots: Mot[], max = 4, pause = 0.28): Mot[][] => {
	const pages: Mot[][] = [];
	let cur: Mot[] = [];
	if (mots.some((m) => m.page)) {
		mots.forEach((m) => {
			if (m.page && cur.length) {
				pages.push(cur);
				cur = [];
			}
			cur.push(m);
		});
		if (cur.length) pages.push(cur);
		return pages;
	}
	mots.forEach((m, i) => {
		const prec = mots[i - 1];
		const coupe = cur.length >= max || (prec && (m.debut - prec.fin > pause || /[.?!…]$/.test(prec.mot)));
		if (coupe && cur.length) {
			pages.push(cur);
			cur = [];
		}
		cur.push(m);
	});
	if (cur.length) pages.push(cur);
	return pages;
};

export const SousTitres: React.FC<{mots: Mot[]; y?: number; taille?: number; masquerApres?: number}> = ({
	mots,
	y = 1290,
	taille = 64,
	masquerApres = Infinity,
}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = f / fps;
	if (t >= masquerApres) return null;
	const pages = grouper(mots);
	const idx = pages.findIndex((p, i) => {
		const fin = i + 1 < pages.length ? Math.min(pages[i + 1][0].debut, p[p.length - 1].fin + 0.6) : p[p.length - 1].fin + 0.6;
		return t >= p[0].debut - 0.05 && t < fin;
	});
	if (idx < 0) return null;
	const page = pages[idx];
	const entree = spring({frame: f - Math.round((page[0].debut - 0.05) * fps), fps, config: {damping: 13, stiffness: 180, mass: 0.6}});
	if (y < ZONE.haut || y + 200 > ZONE.bas) throw new Error('Sous-titres hors zone sûre');
	return (
		<div style={{position: 'absolute', top: y, left: 70, right: 70, display: 'flex', justifyContent: 'center'}}>
			<div
				style={{
					display: 'flex',
					flexWrap: 'wrap',
					justifyContent: 'center',
					gap: '4px 24px',
					padding: '18px 30px',
					borderRadius: 26,
					background: 'rgba(10,15,26,0.80)',
					boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
					transform: `translateY(${(1 - entree) * 30}px) scale(${0.92 + 0.08 * entree})`,
					opacity: Math.min(1, entree * 1.6),
				}}
			>
				{page.map((m, i) => {
					const actif = t >= m.debut - 0.03 && (t < m.fin + 0.05 || (i === page.length - 1 && true)) && !(page[i + 1] && t >= page[i + 1].debut - 0.03);
					const dit = t >= m.debut - 0.03;
					const pop = spring({frame: f - Math.round((m.debut - 0.03) * fps), fps, config: {damping: 12, stiffness: 220, mass: 0.5}});
					return (
						<span
							key={i}
							style={{
								fontFamily: TEXTE,
								fontWeight: 700,
								fontSize: taille,
								lineHeight: 1.15,
								color: actif ? C.laiton : C.texte,
								opacity: dit ? 1 : 0.45,
								display: 'inline-block',
								transform: `scale(${actif ? 1 + 0.05 * pop : 1})`,
							}}
						>
							{m.mot}
						</span>
					);
				})}
			</div>
		</div>
	);
};
