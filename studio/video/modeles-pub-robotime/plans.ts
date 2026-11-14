// Plans des 3 modèles de pub « à trous » (script corrigé : outputs/2026-11-13-createur-contenu-modeles-pub-robotime.md, audit P1 à P6).
// Une seule source de vérité pour le montage : durées, textes à l'écran, cadres « MÉDIA FOURNISSEUR n°X ».
// Les variables {NOM_PRODUIT}, {PRIX}, {FRAIS_LIVRAISON}, {DÉLAI}, {NB_PIÈCES}, {AGE}, {MENTION_MARQUE}, {MENTION_IMAGES} restent
// entre accolades tant que les props ne donnent pas de valeur (aucun chiffre inventé).

export type Ligne = {
	id?: string; // identifiant pour retirer la ligne en version finale (props.lignesRetirees)
	texte: string;
	a?: number; // apparition, en secondes depuis le début du plan
	taille?: number; // px en 1080×1920
	titre?: boolean; // Cormorant Garamond au lieu d'Inter
	laiton?: boolean;
	verif?: string; // repère « À VÉRIFIER » affiché en brouillon
};

export type Plan = {
	id: string; // A1, A2…
	debut: number; // s
	fin: number; // s
	type: 'media' | 'carton' | 'fin' | 'transition';
	media?: {nature: string; description: string}; // pour type « media »
	lignes: Ligne[];
	note?: string; // repère de plan (ex. « plan supprimé si… »)
};

export type Modele = {id: 'A' | 'B' | 'C'; nom: string; duree: number; plans: Plan[]};

export const MODELES: Modele[] = [
	{
		id: 'A',
		nom: 'Accroche',
		duree: 18,
		plans: [
			{
				id: 'A1', debut: 0, fin: 2, type: 'media',
				media: {nature: 'Vidéo officielle', description: 'Gros plan serré sur le mécanisme en mouvement (engrenage, manivelle ou rouage), plan fixe, fond neutre, sans texte incrusté'},
				lignes: [{id: 'A1-regardez', texte: 'Regardez-le tourner.', taille: 52, laiton: true, verif: '« Écoutez-le tourner. » seulement avec le vrai son du produit dans le média'}],
			},
			{
				id: 'A2', debut: 2, fin: 5, type: 'carton',
				lignes: [
					{texte: 'Vous le construisez.', taille: 60, titre: true},
					{texte: 'Étape après étape.', a: 1.4, taille: 52, laiton: true},
				],
			},
			{
				id: 'A3', debut: 5, fin: 9, type: 'media',
				media: {nature: 'Photo ou vidéo officielle', description: 'Le produit monté, vue de trois quarts, mouvement lent de caméra si la vidéo en a un'},
				lignes: [
					{texte: '{MENTION_MARQUE}', taille: 48},
					{texte: '{NOM_PRODUIT}', a: 1.6, taille: 60, titre: true, laiton: true},
				],
			},
			{
				id: 'A4', debut: 9, fin: 13, type: 'media',
				media: {nature: 'Vidéo officielle', description: 'Le même produit, le mécanisme en marche vu de près'},
				lignes: [{texte: 'Un mécanisme à observer.', taille: 52, a: 0.3}],
				note: 'Plan supprimé si le média ne montre aucun mouvement',
			},
			{
				id: 'A5', debut: 13, fin: 16, type: 'carton',
				lignes: [
					{id: 'A5-pieces', texte: '{NB_PIÈCES} pièces en bois', taille: 48, verif: 'À VÉRIFIER : ligne supprimée si la valeur manque'},
					{texte: '{PRIX} TTC, {FRAIS_LIVRAISON}.', a: 0.8, taille: 48, laiton: true},
					{texte: 'Livraison sous {DÉLAI}.', a: 1.6, taille: 48},
				],
			},
			{
				id: 'A6', debut: 16, fin: 18, type: 'fin',
				lignes: [
					{texte: 'Découvrez-le sur le site.', a: 0.4, taille: 48, verif: 'À VÉRIFIER : adresse du site (domaine non réservé)'},
					{texte: '{AGE}', a: 0.8, taille: 44, verif: 'À VÉRIFIER : marquage d’âge du fabricant'},
				],
			},
		],
	},
	{
		id: 'B',
		nom: 'Démonstration',
		duree: 25,
		plans: [
			{
				id: 'B1', debut: 0, fin: 2, type: 'media',
				media: {nature: 'Vidéo officielle', description: 'Premier tour de manivelle ou démarrage du mécanisme, plan serré'},
				lignes: [{id: 'B1-regardez', texte: 'Regardez-le tourner.', taille: 52, laiton: true, verif: '« Écoutez-le tourner. » seulement avec le vrai son du produit dans le média'}],
			},
			{
				id: 'B2', debut: 2, fin: 6, type: 'media',
				media: {nature: 'Vidéo ou photo officielle', description: 'Vue complète du produit monté, le mécanisme en marche'},
				lignes: [
					{texte: '{NOM_PRODUIT}', taille: 60, titre: true, laiton: true},
					{texte: '{MENTION_MARQUE}', a: 1.6, taille: 48},
				],
			},
			{
				id: 'B3', debut: 6, fin: 8, type: 'carton',
				lignes: [{texte: 'Comment ça se monte ?', taille: 72, titre: true}],
			},
			{
				id: 'B4', debut: 8, fin: 11, type: 'media',
				media: {nature: 'Photo ou vidéo officielle', description: 'Les planches de pièces en bois dans leur cadre, avant détachement'},
				lignes: [{texte: '1. Détacher les pièces.', taille: 52}],
				note: 'Étapes 1 à 3 à ajuster à la notice réelle',
			},
			{
				id: 'B5', debut: 11, fin: 14, type: 'media',
				media: {nature: 'Vidéo officielle', description: "Une étape d'emboîtement : des pièces qui s'assemblent"},
				lignes: [{texte: '2. Emboîter, étape par étape.', taille: 52}],
			},
			{
				id: 'B6', debut: 14, fin: 17, type: 'media',
				media: {nature: 'Vidéo officielle', description: 'Mise en place du mécanisme moteur (manivelle, ressort ou remontage, selon le produit)'},
				lignes: [{texte: '3. Monter le mécanisme.', taille: 52}],
			},
			{
				id: 'B7', debut: 17, fin: 21, type: 'media',
				media: {nature: 'Vidéo officielle', description: 'Le produit terminé en marche, plan large puis léger rapprochement'},
				lignes: [
					{texte: 'Terminé.', taille: 60, titre: true},
					{texte: 'Il fonctionne.', a: 1.4, taille: 60, titre: true, laiton: true},
				],
			},
			{
				id: 'B8', debut: 21, fin: 23, type: 'carton',
				lignes: [
					{texte: 'Étape après étape.', taille: 64, titre: true},
				],
			},
			{
				id: 'B9', debut: 23, fin: 25, type: 'fin',
				lignes: [
					{texte: '{PRIX} TTC, {FRAIS_LIVRAISON}.', a: 0.3, taille: 46},
					{texte: 'Livraison sous {DÉLAI}.', a: 0.6, taille: 46},
					{texte: '{AGE}', a: 0.9, taille: 44, verif: 'À VÉRIFIER : marquage d’âge du fabricant'},
				],
			},
		],
	},
	{
		id: 'C',
		nom: 'Avant-après',
		duree: 20,
		plans: [
			{
				id: 'C1', debut: 0, fin: 2, type: 'media',
				media: {nature: 'Photo officielle', description: 'Les planches de pièces en bois à plat (boîte ouverte si possible), vue du dessus, immobile'},
				lignes: [{texte: 'Ça, c’est avant.', taille: 52, laiton: true}],
			},
			{
				id: 'C2', debut: 2, fin: 5, type: 'media',
				media: {nature: 'Vidéo ou photo officielle', description: 'Détail des pièces découpées (engrenages, axes), plan serré'},
				lignes: [{id: 'C2-pieces', texte: '{NB_PIÈCES} pièces en bois.', taille: 52, verif: 'À VÉRIFIER : plan supprimé si la valeur manque'}],
			},
			{
				id: 'C3', debut: 5, fin: 9, type: 'carton',
				lignes: [{texte: 'Étape après étape.', taille: 64, titre: true}],
			},
			// L'ancien C4 est fusionné dans C3 : fondu laiton pendant sa dernière seconde (Voile, ModelesPub.tsx).
			{
				id: 'C5', debut: 9, fin: 13, type: 'media',
				media: {nature: 'Photo ou vidéo officielle', description: 'Le produit monté, même cadrage et même angle que le n°C1 si possible'},
				lignes: [
					{texte: 'Et ça, c’est après.', a: 0.6, taille: 52, laiton: true},
					{texte: '{NOM_PRODUIT}', a: 2.0, taille: 60, titre: true},
				],
			},
			{
				id: 'C6', debut: 13, fin: 18, type: 'media',
				media: {nature: 'Vidéo officielle', description: 'Le produit monté en marche, plan serré puis plan large'},
				lignes: [{texte: '{MENTION_MARQUE}', a: 0.4, taille: 48}],
			},
			{
				id: 'C7', debut: 18, fin: 20, type: 'fin',
				lignes: [
					{texte: '{PRIX} TTC, {FRAIS_LIVRAISON}.', a: 0.3, taille: 46},
					{texte: 'Livraison sous {DÉLAI}.', a: 0.6, taille: 46},
					{texte: '{AGE}', a: 0.9, taille: 44, verif: 'À VÉRIFIER : marquage d’âge du fabricant'},
				],
			},
		],
	},
];

// Fondu laiton de C3 (s) : monte de 8,0 à 8,8 (texte encore visible dessous), tient jusqu'à la coupe de 9,0,
// puis s'efface de 9,0 à 9,4 sur C5 (fondu enchaîné, aucune image vide).
export const VOILE_C4 = {debut: 8.0, milieu: 8.8, coupe: 9.0, fin: 9.4, max: 0.8};
