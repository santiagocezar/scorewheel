<script lang="ts">
	import { resize } from '$lib/utils.svelte';
	import { BASE_RADIUS, TEXT_RADIUS, BASE_BORDER, BASE_FULL_RADIUS } from './const';
	import { fiddle } from './fiddle.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		phi: number;
		children?: Snippet;
	}

	let { phi = $bindable(0), children }: Props = $props();

	let scale = $state(0);
	function onResize(entry: ResizeObserverEntry) {
		scale = Math.min(entry.contentRect.width, entry.contentRect.height) / (BASE_FULL_RADIUS * 2);
		console.log(scale);
	}

	function updatePhi(x: number, y: number) {
		phi = Math.atan2(y - BASE_RADIUS * scale, x - BASE_RADIUS * scale);
	}
</script>

<div class="wheel-wrapper">
	<svg use:fiddle={updatePhi} use:resize={onResize}>
		<defs>
			<path
				id="baseline"
				stroke="red"
				stroke-width="1"
				fill="none"
				d="M {-TEXT_RADIUS},0
				a {TEXT_RADIUS} {TEXT_RADIUS} 90 1 1 {TEXT_RADIUS * 2},0
				a {TEXT_RADIUS} {TEXT_RADIUS} 90 1 1 {-TEXT_RADIUS * 2},0"
			></path>
		</defs>
		<mask id="base">
			<circle
				cx="0"
				cy="0"
				r={BASE_RADIUS}
				stroke="black"
				stroke-width={BASE_BORDER}
				fill="white"
			/>
		</mask>
		<g
			class="wrapper"
			transform="translate({BASE_FULL_RADIUS * scale}, {BASE_FULL_RADIUS * scale}) scale({scale})"
			mask="url(#base)"
		>
			<circle
				cx="0"
				cy="0"
				r={BASE_RADIUS}
				stroke="var(--bg3)"
				stroke-width={BASE_BORDER}
				fill="var(--bg0)"
			/>

			{@render children?.()}
		</g>
	</svg>
</div>

<style>
	svg {
		height: 100%;
		width: 100%;
		font: inherit;
		user-select: none;
		touch-action: none;
	}

	.wheel-wrapper {
		place-self: center;
		height: 100%;
		aspect-ratio: 1 / 1;
		height: 50vh;
		padding: 1rem;
	}
</style>
