// Exemples de 3 s des effets du catalogue (studio/video/effets/README.md).
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {AccrocheTexte} from '../effets/AccrocheTexte';
import {CartesVerre} from '../effets/CartesVerre';
import {C, chargerPolices, Mention} from '../effets/commun';
import {FinAppel} from '../effets/FinAppel';
import {OrbiteProduit} from '../effets/OrbiteProduit';
import {PlancheAObjet} from '../effets/PlancheAObjet';
import {SousTitres} from '../effets/SousTitres';

chargerPolices();
const M = 'Rendus 3D de démonstration,\nproduit non vendu';

export const ExAccroche: React.FC = () => (
	<AbsoluteFill style={{background: C.nuit}}>
		<AccrocheTexte mots={[{texte: 'De'}, {texte: 'la'}, {texte: 'planche'}, {texte: 'à', retour: true}, {texte: "l'objet.", laiton: true}]} haut={760} />
	</AbsoluteFill>
);

export const ExSousTitres: React.FC = () => (
	<AbsoluteFill style={{background: C.nuit2}}>
		<SousTitres
			mots={[
				{mot: 'Un', debut: 0.2, fin: 0.4},
				{mot: 'écran', debut: 0.4, fin: 0.8},
				{mot: 'de', debut: 0.8, fin: 0.95},
				{mot: 'plus ?', debut: 0.95, fin: 1.4},
				{mot: 'Non.', debut: 1.7, fin: 2.2},
			]}
		/>
	</AbsoluteFill>
);

export const ExPlanche: React.FC = () => (
	<AbsoluteFill>
		<PlancheAObjet avant="img/boite-1600.webp" apres="img/trois-quarts-1600.webp" debut={20} duree={40} />
		<Mention texte={M} />
	</AbsoluteFill>
);

export const ExOrbite: React.FC = () => (
	<AbsoluteFill>
		<OrbiteProduit dossier="orbite/boite-a-musique" images={90} duree={90} />
		<Mention texte={M} />
	</AbsoluteFill>
);

export const ExCartes: React.FC = () => (
	<AbsoluteFill style={{background: C.nuit}}>
		<Img src={staticFile('img/situation-1600.webp')} style={{position: 'absolute', left: -228, top: 0, width: 1536, height: 1920}} />
		<CartesVerre cartes={[{titre: 'Niveau', valeur: 'Facile'}, {titre: 'Mécanisme', valeur: 'À peigne'}, {titre: 'Entraînement', valeur: 'Manivelle'}]} haut={500} />
		<Mention texte={M} />
	</AbsoluteFill>
);

export const ExFin: React.FC = () => <FinAppel appel="Suivez-nous" mention="Produit de démonstration, non vendu." />;
