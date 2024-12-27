<script lang="ts">
	import { type Player } from '$lib/game/data.svelte';
	import { BALL_RADIUS, BALL_SIZE, BASE_RADIUS } from '$lib/wheel/const';

	import Base from '$lib/wheel/Base.svelte';
	import Players from '$lib/wheel/Players.svelte';
	import Actions from '$lib/wheel/Actions.svelte';
	import { sliced } from '$lib/utils.svelte';
	import PlayerBall from '$lib/wheel/PlayerBall.svelte';

	let players: Player[] = $state([]);

	let phi = $state(0);

	let selected = $state(null);

	function handleAction() {}
	function onPress() {
		let s = sliced(phi, players.length + 1, 1);
		if (s == 0) {
			players.push({
				name: `Jugador ${players.length + 1}`,
				color: 0
			});
			s = players.length;
		}
		selected = s;
	}
</script>

<div class="view">
	<div data-hidden={selected === null} class="preview">
		{#if selected !== null}
			<input
				type="text"
				bind:value={players[selected].name}
				class="pal-{players[selected].color}"
			/>
		{/if}
		<!--
		<p class="name">{game.players[slice].name}</p>
		<p class="diff">
			<span>{getScore(game, slice)}</span>
			<span>{diff < 0 ? '-' : '+'}</span>
			<span>{Math.abs(diff)}</span>
		</p>
		<p class="result">
			{getScore(game, slice) + diff}
		</p>
		-->
	</div>
	<div data-hidden={selected !== null} class="standings">
		<button>Empezar</button>
	</div>
	<Base bind:phi>
		<g class="add" transform="rotate({(-1 * 180) / (players.length + 1)})">
			<circle
				class="player-ball"
				cx={BALL_RADIUS}
				cy="0"
				z="0"
				r={BALL_SIZE / 2}
				fill="var(--p50)"
			/>

			<text>
				<textPath
					startOffset="50%"
					text-anchor="middle"
					lengthAdjust="spacingAndGlyphs"
					alignment-baseline="baseline"
					href="#baseline"
					fill="var(--p50)"
				>
					Agregar
				</textPath>
			</text>
		</g>

		{#each players as player, i}
			<PlayerBall
				{player}
				phi={0}
				rotate={((2 * i + 1) * 180) / (players.length + 1)}
				selected={false}
				visible={true}
				speed={0}
			/>
		{/each}

		<circle cx="0" cy="0" r={BASE_RADIUS} fill="transparent" onpointerdown={onPress} />

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
	.add {
		transition: transform 0.3s cubic-bezier(0.17, 0.67, 0.12, 1);
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
