import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';

// Rendu de test du socle (T50) : un titre qui entre avec un ressort, puis s'efface.
export const TestRendu: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const entree = spring({frame, fps, config: {damping: 14}});
	const sortie = interpolate(frame, [70, 90], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.in(Easing.cubic),
	});
	return (
		<AbsoluteFill style={{backgroundColor: '#1f1a16', justifyContent: 'center', alignItems: 'center'}}>
			<div
				style={{
					color: '#c9a227',
					fontFamily: 'Georgia, serif',
					fontSize: 120,
					opacity: sortie,
					transform: `translateY(${(1 - entree) * 200}px) scale(${0.8 + entree * 0.2})`,
				}}
			>
				Test studio
			</div>
		</AbsoluteFill>
	);
};
