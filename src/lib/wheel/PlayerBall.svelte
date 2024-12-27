<script lang="ts">
	import type { Player } from '$lib/game/data.svelte';
	import { BASE_RADIUS, BALL_RADIUS, BALL_SIZE, SPEED_BUF_SIZE, TO_DEG } from './const';

	interface Props {
		player: Player;
		selected: boolean;
		phi: number;
		rotate: number;
		visible: boolean;
		speed: number;
	}

	const { player, selected, phi, rotate, visible, speed }: Props = $props();

	const lineWidth = $derived(BALL_SIZE * Math.exp(-Math.abs(speed) / 15));
	const tailLength = $derived((Math.abs(speed) * TO_DEG * SPEED_BUF_SIZE) / 60);
	//          speed is taken as an average over 8 frames ^
	const dasharray = $derived(speed > 0 ? `${tailLength} 360` : `0 ${360 - tailLength} 360`);
</script>

<g class="player pal-{player.color}" transform="scale({visible ? 1 : 2.5})">
	<circle
		class="player-ball"
		cx={selected ? 0 : BALL_RADIUS}
		cy="0"
		z="0"
		r={selected ? BASE_RADIUS : BALL_SIZE / 2}
		fill="var(--p50)"
		transform="rotate({rotate})"
	/>

	<circle
		cx="0"
		cy="0"
		r={BALL_RADIUS}
		fill="none"
		class="player-stroke"
		stroke="var(--contrast)"
		stroke-width={selected ? lineWidth : 0}
		stroke-linecap="round"
		stroke-dasharray={selected ? dasharray : '0 360 360'}
		pathLength="360"
		transform="rotate({selected ? phi : rotate})"
	/>
	<text class="pal-{player.color}" transform="rotate({rotate})">
		<textPath
			startOffset="50%"
			text-anchor="middle"
			lengthAdjust="spacingAndGlyphs"
			alignment-baseline="baseline"
			href="#baseline"
			fill={selected ? 'var(--contrast)' : 'var(--p50)'}
		>
			{player.name}
		</textPath>
	</text>
</g>

<style>
	.player {
		pointer-events: none;
		transition: transform 0.3s cubic-bezier(0.17, 0.67, 0.12, 1);
	}
	.player-ball {
		transition:
			cx 0.3s cubic-bezier(0.17, 0.67, 0.12, 1),
			r 0.3s cubic-bezier(0.17, 0.67, 0.12, 1);
	}
	.player-stroke {
		transition: stroke 0.3s cubic-bezier(0.17, 0.67, 0.12, 1);
	}
	text {
		font-size: 1rem;
		font-weight: bold;
		transition: transform 0.3s cubic-bezier(0.17, 0.67, 0.12, 1);
	}
</style>
