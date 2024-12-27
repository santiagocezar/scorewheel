<script lang="ts">
	import type { Player } from '$lib/game/data.svelte';
	import { sliced } from '$lib/utils.svelte';
	import { SPEED_BUF_SIZE, BASE_RADIUS, TO_DEG } from './const';
	import PlayerBall from './PlayerBall.svelte';

	const ACCUM_MAX = 10;

	interface Props {
		players: Player[];
		phi: number;
		onpress: (slice: number) => void;
		onrelease: (value: number) => void;
		value: number;
	}

	let {
		players,
		phi,
		onpress: emitPress,
		onrelease: emitRelease,
		value = $bindable(0)
	}: Props = $props();

	let lastPhi: number | null = null;
	let lastTime = 0;

	let speedBuf: number[] = $state(Array(SPEED_BUF_SIZE).fill(0));
	let cursor = 0;

	let averageSpeed = $state(0);

	let accum = 0;

	let selectedSlice: number | null = $state(null);

	function onPress(ev: PointerEvent) {
		ev.preventDefault();

		document.addEventListener('pointerup', onRelease, { once: true });
		value = 0;
		selectedSlice = sliced(phi, players.length, 1);

		emitPress(selectedSlice);
		requestAnimationFrame(updateSpeed);
	}

	function onRelease(ev: PointerEvent) {
		ev.preventDefault();

		emitRelease(value);

		selectedSlice = null;
		value = 0;
		lastPhi = null;
		averageSpeed = 0;
		speedBuf.fill(0);
	}

	function updateSpeed(time: number) {
		if (selectedSlice !== null) {
			// TODO: THIS IS PRONE TO BREAK i think?
			// say, if the animation frame runs, but phi hasn't updated yet

			if (lastPhi === null) lastPhi = phi;
			// https://stackoverflow.com/questions/1878907/how-can-i-find-the-smallest-difference-between-two-angles-around-a-point#comment119528981_7869457
			const deltaPhi = ((lastPhi - phi + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;
			const deltaT = time - lastTime;

			lastPhi = phi;
			lastTime = time;

			speedBuf[cursor++] = (deltaPhi / deltaT) * 1000;
			if (cursor == SPEED_BUF_SIZE) cursor = 0;

			averageSpeed = speedBuf.reduce((a, b) => a + b) / SPEED_BUF_SIZE;

			accum += averageSpeed;

			if (Math.abs(accum) > ACCUM_MAX) {
				const count = Math.floor(Math.abs(accum) / ACCUM_MAX);
				value -= count * Math.sign(accum);
				accum -= count * Math.sign(accum) * ACCUM_MAX;
			}
			requestAnimationFrame(updateSpeed);
		}
	}
</script>

{#each players as player, i}
	<PlayerBall
		{player}
		phi={phi * TO_DEG}
		rotate={((2 * i - 1) * 180) / players.length}
		selected={selectedSlice === i}
		visible={selectedSlice === null || selectedSlice === i}
		speed={averageSpeed}
	/>
{/each}

<circle cx="0" cy="0" r={BASE_RADIUS} fill="transparent" onpointerdown={onPress} />
