import React from 'react';
import {Composition} from 'remotion';
import {TestRendu} from './TestRendu';

// 3 s à 30 i/s, format vertical 1080×1920 (TikTok, Reels, Shorts)
export const Racine: React.FC = () => (
	<Composition
		id="TestRendu"
		component={TestRendu}
		durationInFrames={90}
		fps={30}
		width={1080}
		height={1920}
	/>
);
