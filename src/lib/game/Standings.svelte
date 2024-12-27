<script lang="ts">
import type { GameState } from "$lib/game/data.svelte";
import { range } from "$lib/utils.svelte";

interface Props {
    game: GameState
}

const { game }: Props = $props();

let total: number[] = $derived(
    game.rounds.reduce(
        (totalScores, round) =>
            totalScores.map(
                (total, i) => total + round[i]
            )
    )
)

let order: number[] = $derived(
    total
        .map((v, i) => [v, i])
        .sort(([a], [b]) => b - a)
        .map(([_, i]) => i)
)

function autoscroll(node: HTMLElement, enabled: boolean) {
    $effect(() => {
        if (enabled) node.scrollIntoView({
            behavior: 'smooth'
        })
    })
}
</script>

<div class="standings" style="--rows: {game.players.length}">
    <div class="column score-panel names">
        {#each order as i (i)}
            <div class="name pal-{game.players[i].color}">
                {game.players[i].name}
            </div>
        {/each}
    </div>
    <div class="column scores">
        {#each game.rounds as round, n}
            <div class="column" use:autoscroll={n == game.current} data-current={n == game.current}>
                {#each order as i (i)}
                    <div class="score">
                        {round[i]}
                    </div>
                {/each}
                <small>{n + 1}</small>
            </div>
        {/each}
    </div>
    <div class="column score-panel totals">
        {#each order as i (i)}
            <div class="name pal-{game.players[i].color}">
                {total[i]}
            </div>
        {/each}
    </div>
</div>

<style>
.standings {
    display: grid;
    grid-template-rows: repeat(var(--rows), auto) auto;
    grid-auto-flow: column;
    grid-template-columns: auto 0.8fr 0.2fr;
    align-content: center;
    font-size: 1.25rem;
    width: 100%;
    height: 100%;
}
.column {
    display: grid;
    grid-template-rows: subgrid;
    grid-row: 1 / -1;
    padding: .5em 0;
}
.score-panel {
    background-color: var(--bg2);
    border-radius: .5rem;
    grid-row: 1 / -2;

    & .name{
        padding: 0 .5em;
        width: 100%;
    }

    & .name:first-child {
        color: var(--contrast);
        background-color: var(--p50);
    }
}
.names {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    justify-items: end;
    text-align: right;

}
.totals {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    text-align: center;
}
.scores {
    grid-auto-columns: 25%;
    overflow-x: auto;
    font-variant: tabular-nums;
    padding: 0;
    scroll-snap-type: x mandatory;
    z-index: 1;

    .column:not(.column[data-current="true"] + .column):not(:first-child) {
        border-color: #0014;
    }
    & .column {
        justify-items: center;
        scroll-snap-align: end;
        transition: background-color .2s ease, border-radius 0s .2s;
        border-radius: 0;
        box-sizing: border-box;
        border-left: 1px solid transparent;

        &[data-current="true"] {
            background-color: var(--text);
            color: var(--bg1);
            border-radius: 1rem;
            transition: background-color .2s ease;
        }
    }
    & .score {
        font-weight: bold;
    }
}
</style>
