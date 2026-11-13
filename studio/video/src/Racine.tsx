import React from 'react';
import {Composition} from 'remotion';
import {TestRendu} from './TestRendu';
import {DeLaPlancheALObjet, PropsPlanche} from './DeLaPlancheALObjet';
import {ExAccroche, ExCartes, ExFin, ExOrbite, ExPlanche, ExSousTitres} from './Exemples';

const V = {fps: 30, width: 1080, height: 1920} as const;

// Format vertical 1080×1920 à 30 i/s (TikTok, Reels, Shorts)
export const Racine: React.FC = () => (
	<>
		<Composition id="TestRendu" component={TestRendu} durationInFrames={90} {...V} />
		<Composition
			id="DeLaPlancheALObjet"
			component={DeLaPlancheALObjet as React.FC<Record<string, unknown>>}
			durationInFrames={600}
			{...V}
			defaultProps={{mots: [], mention: 'Rendus 3D de démonstration,\nproduit non vendu'} satisfies PropsPlanche}
		/>
		{/* Exemples de 3 s du catalogue d'effets */}
		<Composition id="ex-accroche-texte" component={ExAccroche} durationInFrames={90} {...V} />
		<Composition id="ex-sous-titres-mot-a-mot" component={ExSousTitres} durationInFrames={90} {...V} />
		<Composition id="ex-planche-a-objet" component={ExPlanche} durationInFrames={90} {...V} />
		<Composition id="ex-orbite-produit" component={ExOrbite} durationInFrames={90} {...V} />
		<Composition id="ex-cartes-verre" component={ExCartes} durationInFrames={90} {...V} />
		<Composition id="ex-fin-appel" component={ExFin} durationInFrames={90} {...V} />
	</>
);
