// Modèles de pub « à trous » Robotime ROKR (T73) : A Accroche, B Démonstration, C Avant/après.
// Composé en 1080×1920 ; le brouillon se rend avec --scale=0.5 (540×960, même cadrage, §11 du brief).
// Version finale : donner dans les props les médias officiels (props.medias) et les valeurs des variables
// (props.variables) ; les cadres « MÉDIA FOURNISSEUR n°X » sont alors remplacés, rien d'autre à toucher.
import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, TEXTE, TITRE, chargerPolices, lerp, sortie, douce} from '../effets/commun';
import {Ligne, MODELES, Modele, Plan, VOILE_C4} from './plans';

export type PropsModele = {
	modele: 'A' | 'B' | 'C';
	brouillon: boolean; // filigrane, repères À VÉRIFIER, mention « médias en attente »
	marque: boolean; // true : variante « avec marque » (médias Robotime, {MENTION_IMAGES}) ; false : « sans marque »
	publicite: boolean; // true : mention « Publicité » du début à la fin (diffusion payante ou collaboration)
	medias: Record<string, string>; // ex. {"A1": "modeles-pub-robotime/A/A1.mp4"} (chemin dans --public-dir)
	variables: Record<string, string>; // ex. {"PRIX": "…"} ; une variable absente reste affichée {PRIX}
	lignesRetirees: string[]; // identifiants de lignes à retirer en version finale (ex. "A2-colle")
	plansRetires: string[]; // plans supprimés (ex. "A4") : le plan précédent est prolongé
};

const VAR = /\{([A-ZÉÈÀÙÂÊÎÔÛÇ_]+)\}/g;

// Texte avec variables : valeur des props si fournie, sinon le nom entre accolades, souligné en brouillon.
const TexteVar: React.FC<{texte: string; vars: Record<string, string>; brouillon: boolean}> = ({texte, vars, brouillon}) => {
	const morceaux: React.ReactNode[] = [];
	let i = 0;
	let m: RegExpExecArray | null;
	VAR.lastIndex = 0;
	while ((m = VAR.exec(texte))) {
		if (m.index > i) morceaux.push(texte.slice(i, m.index));
		const val = vars[m[1]];
		morceaux.push(
			val !== undefined ? (
				val
			) : (
				<span key={m.index} style={{color: C.laiton, borderBottom: brouillon ? `3px dashed ${C.laiton}` : undefined}}>
					{m[0]}
				</span>
			),
		);
		i = m.index + m[0].length;
	}
	if (i < texte.length) morceaux.push(texte.slice(i));
	return <>{morceaux}</>;
};

const Repere: React.FC<{texte: string; op: number}> = ({texte, op}) => (
	<div
		style={{
			display: 'inline-block',
			marginTop: 14,
			maxWidth: 820,
			fontFamily: TEXTE,
			fontWeight: 600,
			fontSize: 36,
			lineHeight: 1.25,
			color: C.laiton,
			border: `2px dashed ${C.laiton}`,
			borderRadius: 14,
			padding: '8px 20px',
			background: 'rgba(10,15,26,0.85)',
			opacity: op,
		}}
	>
		{texte}
	</div>
);

// Une ligne de texte à l'écran : entrée douce (montée de 28 px, opacité), position entière à l'arrêt.
const LigneTexte: React.FC<{l: Ligne; f: number; fps: number; p: PropsModele; fond?: boolean}> = ({l, f, fps, p, fond}) => {
	const d = Math.round((l.a ?? 0) * fps) + 2;
	const e = lerp(f, d, d + 14, 0, 1, sortie);
	const dy = Math.round((1 - e) * 28);
	return (
		<div style={{opacity: e, transform: `translateY(${dy}px)`, textAlign: 'center', marginBottom: 22}}>
			<div
				style={{
					display: 'inline-block',
					maxWidth: 860,
					fontFamily: l.titre ? TITRE : TEXTE,
					fontWeight: l.titre ? 500 : 600,
					fontSize: (l.taille ?? 48) * (l.titre ? 1.12 : 1),
					lineHeight: 1.2,
					color: l.laiton ? C.laiton : C.texte,
					background: fond ? 'rgba(10,15,26,0.72)' : undefined,
					padding: fond ? '12px 30px' : undefined,
					borderRadius: fond ? 22 : undefined,
				}}
			>
				<TexteVar texte={l.texte} vars={p.variables} brouillon={p.brouillon} />
			</div>
			{p.brouillon && (l.verif || (p.marque && l.texte.includes('{MENTION_MARQUE}'))) && (
				<div>
					<Repere texte={l.verif ?? 'Sous réserve d’accord écrit de Robotime'} op={1} />
				</div>
			)}
		</div>
	);
};

const lignesVisibles = (pl: Plan, p: PropsModele) => pl.lignes.filter((l) => !(l.id && p.lignesRetirees.includes(l.id)));

// Cadre vide « MÉDIA FOURNISSEUR n°X » (gris #111827 + trame), ou le média officiel s'il est fourni.
const CadreMedia: React.FC<{pl: Plan; p: PropsModele}> = ({pl, p}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const src = p.medias[pl.id];
	const duree = pl.fin - pl.debut;
	if (src) {
		const video = /\.(mp4|mov|webm)$/i.test(src);
		const zoom = 1 + 0.04 * lerp(f, 0, duree * fps, 0, 1, douce); // léger mouvement si c'est une photo
		return video ? (
			<OffthreadVideo src={staticFile(src)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
		) : (
			<Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})`}} />
		);
	}
	const entree = lerp(f, 0, 10, 0, 1, sortie);
	const derive = Math.round(18 * Math.sin((f / fps) * 1.3)); // la trame respire (pas de mouvement linéaire)
	const progres = lerp(f, 0, duree * fps, 0, 1, (x) => x);
	return (
		<AbsoluteFill style={{background: C.nuit2}}>
			<AbsoluteFill
				style={{
					backgroundImage: 'repeating-linear-gradient(45deg, rgba(245,241,232,0.045) 0 3px, transparent 3px 34px)',
					backgroundPosition: `${derive}px 0px`,
				}}
			/>
			<div style={{position: 'absolute', inset: 40, border: `3px dashed rgba(200,161,90,0.55)`, borderRadius: 30}} />
			<div
				style={{
					position: 'absolute',
					top: 740,
					left: 110,
					right: 110,
					textAlign: 'center',
					opacity: entree,
					transform: `translateY(${Math.round((1 - entree) * 20)}px)`,
				}}
			>
				<div style={{fontFamily: TEXTE, fontWeight: 700, fontSize: 52, letterSpacing: 1, color: C.laiton}}>
					{p.marque ? `MÉDIA FOURNISSEUR n°${pl.id}` : `MÉDIA LIBRE DE DROITS n°${pl.id}`}
				</div>
				<div style={{fontFamily: TEXTE, fontWeight: 500, fontSize: 38, color: C.texte2, marginTop: 14}}>
					{p.marque ? pl.media!.nature : pl.media!.nature.replace(' officielle', '')} · {String(duree).replace('.', ',')} s
				</div>
				<div style={{margin: '28px auto', width: 300, height: 3, background: 'rgba(200,161,90,0.6)'}} />
				<div style={{fontFamily: TEXTE, fontWeight: 400, fontSize: 40, lineHeight: 1.32, color: C.texte}}>{pl.media!.description}</div>
				{pl.note && (
					<div>
						<Repere texte={pl.note} op={1} />
					</div>
				)}
				{/* durée du plan : la barre avance pour figurer le temps du média */}
				<div style={{margin: '34px auto 0', width: 500, height: 8, borderRadius: 4, background: 'rgba(245,241,232,0.12)'}}>
					<div style={{width: Math.round(500 * progres), height: 8, borderRadius: 4, background: C.laiton}} />
				</div>
			</div>
			<div style={{position: 'absolute', top: 1340, left: 110, right: 110, textAlign: 'center', fontFamily: TEXTE, fontWeight: 500, fontSize: 36, color: C.texte2}}>
				{p.marque ? 'Brouillon : médias en attente d’accord de Robotime' : 'Brouillon : média libre de droits ou carton texte, à choisir'}
			</div>
		</AbsoluteFill>
	);
};

const PlanMedia: React.FC<{pl: Plan; p: PropsModele}> = ({pl, p}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	return (
		<AbsoluteFill>
			<CadreMedia pl={pl} p={p} />
			<div style={{position: 'absolute', top: 400, left: 0, right: 0}}>
				{lignesVisibles(pl, p).map((l, i) => (
					<LigneTexte key={i} l={l} f={f} fps={fps} p={p} fond />
				))}
			</div>
			{/* {MENTION_IMAGES} : sur chaque plan fournisseur (variante avec marque), y ≈ 1440 à 1490, 36 px, centrée */}
			{p.marque && <div style={{position: 'absolute', top: 1444, left: 0, right: 0, textAlign: 'center', fontFamily: TEXTE, fontWeight: 500, fontSize: 36, color: C.texte2}}>
				<span style={{background: 'rgba(10,15,26,0.7)', padding: '4px 18px', borderRadius: 12}}>
					<TexteVar texte="{MENTION_IMAGES}" vars={p.variables} brouillon={p.brouillon} />
				</span>
			</div>}
		</AbsoluteFill>
	);
};

const PlanCarton: React.FC<{pl: Plan; p: PropsModele}> = ({pl, p}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const halo = 0.5 + 0.12 * Math.sin(f / 14);
	return (
		<AbsoluteFill style={{background: C.nuit}}>
			<AbsoluteFill style={{background: `radial-gradient(70% 40% at 50% 48%, rgba(200,161,90,${0.16 * halo}) 0%, rgba(10,15,26,0) 70%)`}} />
			<div style={{position: 'absolute', top: 300, bottom: 1920 - 1420, left: 0, right: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
				{lignesVisibles(pl, p).map((l, i) => (
					<LigneTexte key={i} l={l} f={f} fps={fps} p={p} />
				))}
			</div>
		</AbsoluteFill>
	);
};

// Carton de fin : nom de la marque (déjà posé à la coupe : pas de plan vide), filet, ligne d'appel.
const PlanFin: React.FC<{pl: Plan; p: PropsModele}> = ({pl, p}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const logo = lerp(f, 0, 12, 0.6, 1, sortie);
	const filet = lerp(f, 4, 20, 0, 1, sortie);
	return (
		<AbsoluteFill style={{background: C.nuit}}>
			<AbsoluteFill style={{background: 'radial-gradient(60% 35% at 50% 42%, rgba(200,161,90,0.13) 0%, rgba(10,15,26,0) 70%)'}} />
			<div style={{position: 'absolute', top: 600, left: 0, right: 0, textAlign: 'center'}}>
				<div style={{fontFamily: TITRE, fontWeight: 500, fontSize: 128, color: C.texte, opacity: logo, transform: `translateY(${Math.round((1 - logo) * 40)}px)`}}>
					Rouage <span style={{color: C.laiton, fontStyle: 'italic'}}>&amp;</span> Laiton
				</div>
				<div style={{margin: '24px auto 56px', width: Math.round(420 * filet), height: 3, background: C.laiton}} />
				{lignesVisibles(pl, p).map((l, i) => (
					<LigneTexte key={i} l={l} f={f} fps={fps} p={p} />
				))}
			</div>
		</AbsoluteFill>
	);
};

// Voile laiton de C4 : monte sur la fin de C3, redescend sur C5 (aucune image vide).
const Voile: React.FC = () => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = f / fps;
	const V = VOILE_C4;
	const op = t < V.coupe ? lerp(t, V.debut, V.milieu, 0, V.max) : lerp(t, V.coupe, V.fin, V.max, 0);
	if (op <= 0) return null;
	return <AbsoluteFill style={{background: C.laiton, opacity: op}} />;
};

// « Publicité » : y ≈ 310 à 360, à gauche (hors colonne de boutons à droite), 36 px, du début à la fin.
const MentionPub: React.FC = () => (
	<div style={{position: 'absolute', top: 304, left: 60, fontFamily: TEXTE, fontWeight: 600, fontSize: 36, color: C.texte2}}>
		<span style={{background: 'rgba(10,15,26,0.72)', padding: '4px 16px', borderRadius: 10}}>Publicité</span>
	</div>
);

const Filigrane: React.FC = () => (
	<AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
		{[560, 1000, 1440].map((y) => (
			<div
				key={y}
				style={{
					position: 'absolute',
					top: y,
					left: -200,
					right: -200,
					textAlign: 'center',
					transform: 'rotate(-24deg)',
					fontFamily: TEXTE,
					fontWeight: 700,
					fontSize: 64,
					letterSpacing: 4,
					color: 'rgba(245,241,232,0.07)',
					whiteSpace: 'nowrap',
				}}
			>
				BROUILLON : modèle à compléter
			</div>
		))}
	</AbsoluteFill>
);

export const ModelePub: React.FC<PropsModele> = (p) => {
	chargerPolices();
	const {fps} = useVideoConfig();
	const modele = MODELES.find((m) => m.id === p.modele) as Modele;
	// un plan retiré : le plan précédent est prolongé jusqu'à la fin du plan retiré
	const plans: Plan[] = [];
	modele.plans.forEach((pl) => {
		if (p.plansRetires.includes(pl.id)) {
			if (plans.length) plans[plans.length - 1] = {...plans[plans.length - 1], fin: pl.fin};
		} else plans.push(pl);
	});
	return (
		<AbsoluteFill style={{background: C.nuit}}>
			{plans.map((pl) => (
				<Sequence key={pl.id} from={Math.round(pl.debut * fps)} durationInFrames={Math.round((pl.fin - pl.debut) * fps)} name={pl.id}>
					{pl.type === 'media' ? <PlanMedia pl={pl} p={p} /> : pl.type === 'fin' ? <PlanFin pl={pl} p={p} /> : <PlanCarton pl={pl} p={p} />}
				</Sequence>
			))}
			{p.modele === 'C' && <Voile />}
			{p.publicite && <MentionPub />}
			{p.brouillon && <Filigrane />}
		</AbsoluteFill>
	);
};

export const DUREES = Object.fromEntries(MODELES.map((m) => [m.id, m.duree])) as Record<'A' | 'B' | 'C', number>;
