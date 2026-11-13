// Effet 5 « cartes-verre » : cartes translucides (verre dépoli) qui se posent puis flottent.
// Principes : arcs (entrée en courbe), overshoot léger, chevauchement (décalage entre cartes),
// action secondaire (reflet qui glisse sur le verre), flottement lent et non linéaire.
// Aucune valeur chiffrée sans source : n'y mettre que des valeurs vérifiées (fiche produit réelle).
import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, douce, TEXTE, TITRE} from './commun';

export type Carte = {titre: string; valeur: string};

export const CartesVerre: React.FC<{
	cartes: Carte[];
	debut?: number;
	decalage?: number;
	haut?: number;
}> = ({cartes, debut = 10, decalage = 10, haut = 400}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const largeur = 300;
	const ecart = 24;
	const total = cartes.length * largeur + (cartes.length - 1) * ecart;
	const x0 = (1080 - total) / 2;
	return (
		<>
			{cartes.map((c, i) => {
				const s = spring({frame: f - debut - i * decalage, fps, config: {damping: 12, stiffness: 120, mass: 0.8}});
				const flotte = Math.sin((f - i * 9) / 17) * 6;
				// arc : la carte vient d'en bas et du côté, en tournant légèrement
				const dx = (1 - s) * (i - (cartes.length - 1) / 2) * 90;
				const dy = (1 - s) * 160 + flotte;
				const rot = (1 - s) * (i % 2 ? 8 : -8);
				// reflet : un passage par cycle de 50 images, avec ralenti au départ et à l'arrivée (pas de balayage linéaire)
				const cycle = (((f - debut - i * decalage) % 50) + 50) % 50;
				const reflet = -300 + 900 * douce(Math.min(1, cycle / 32));
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: x0 + i * (largeur + ecart),
							top: haut,
							width: largeur,
							height: 190,
							opacity: Math.min(1, s * 1.4),
							transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`,
							borderRadius: 28,
							background: 'linear-gradient(150deg, rgba(245,241,232,0.20), rgba(245,241,232,0.06))',
							border: '1.5px solid rgba(245,241,232,0.35)',
							boxShadow: '0 24px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.25)',
							backdropFilter: 'blur(18px) saturate(1.2)',
							WebkitBackdropFilter: 'blur(18px) saturate(1.2)',
							overflow: 'hidden',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							padding: '0 28px',
						}}
					>
						<div style={{position: 'absolute', top: -40, left: reflet, width: 90, height: 300, transform: 'rotate(25deg)', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)'}} />
						<div style={{fontFamily: TEXTE, fontWeight: 500, fontSize: 30, color: C.texte2, letterSpacing: 1.5, textTransform: 'uppercase'}}>{c.titre}</div>
						<div style={{fontFamily: TITRE, fontWeight: 500, fontSize: 62, color: C.laiton, lineHeight: 1.1, marginTop: 6}}>{c.valeur}</div>
					</div>
				);
			})}
		</>
	);
};
