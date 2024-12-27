<script lang="ts">
	import { addScore, getScore, initialState, nextRound, prevRound } from '$lib/game/data.svelte';
	import { range } from '$lib/utils.svelte';

	import Standings from '$lib/game/Standings.svelte';

	import Base from '$lib/wheel/Base.svelte';
	import Players from '$lib/wheel/Players.svelte';
	import Actions from '$lib/wheel/Actions.svelte';

	let diffPreview = $state(false);
	let score = $state(0);
	let diff = $state(0);
	let slice = $state(0);

	let phi = $state(0);

	const game = $state(
		initialState([
			{ name: 'Santi', color: 7 },
			{ name: 'Mamá', color: 1 },
			{ name: 'Papá', color: 5 },
			{ name: 'Flor', color: 3 }
		])
	);

	function wheelPressed(s: number) {
		diffPreview = true;
		slice = s;
	}
	function wheelReleased(d: number) {
		addScore(game, slice, d);
		diffPreview = false;
		diff = d;
	}
	function handleAction(id: string) {
		if (id == 'next') {
			nextRound(game);
		} else {
			prevRound(game);
		}
	}
</script>

<div class="view">
	<div data-hidden={!diffPreview} class="preview pal-{game.players[slice].color}">
		<p class="name">{game.players[slice].name}</p>
		<p class="diff">
			<span>{getScore(game, slice)}</span>
			<span>{diff < 0 ? '-' : '+'}</span>
			<span>{Math.abs(diff)}</span>
		</p>
		<p class="result">
			{getScore(game, slice) + diff}
		</p>
	</div>
	<div data-hidden={diffPreview} class="standings">
		<Standings {game} />
	</div>
	<Base bind:phi>
		<Players
			{phi}
			players={game.players}
			bind:value={diff}
			onpress={wheelPressed}
			onrelease={wheelReleased}
		/>
		<Actions
			{phi}
			actions={[
				{ id: 'next', label: 'Ronda\nsiguiente', icon: '#hi-arrow-right-double' },
				{ id: 'prev', label: 'Ronda\nanterior', icon: '#hi-arrow-left-double' }
			]}
			onaction={handleAction}
		/>
	</Base>
</div>

<style>
	.standings,
	.preview {
		grid-area: 1 / 1;
	}
	.view {
		display: grid;
		width: 100%;
		height: 100%;
		grid-template-rows: 1fr auto;
	}
	.preview {
		text-align: center;
		place-content: center;
		line-height: 1.1;
		pointer-events: none;

		& .name {
			font-size: 3rem;
		}
		& .diff {
			font-size: 2rem;
			font-weight: bold;
			font-variant: tabular-nums;

			& :first-child {
				font-weight: normal;
			}
		}
		& .result {
			font-variant: tabular-nums;
			font-size: 4rem;
		}
	}
	[data-hidden='true'] {
		opacity: 0;
	}
	[data-hidden] {
		transition: opacity 0.1s linear;
	}
</style>
