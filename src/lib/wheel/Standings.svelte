<script lang="ts">
	import { range } from "$lib/utils.svelte";

interface Props {
    colors: string[]
    names: string[]
    rounds: number[][]
}

const { colors, names, rounds }: Props = $props();

let total: number[] = $derived(rounds.reduce((prev, curr) => prev.map((c, i) => c + prev[i])))
</script>

<div class="standings" style="--rows: {names.length}">
    <div class="column score-panel">
        {#each range(names.length) as i}
            <div class="name" style="--c: {colors[i]}">
                {names[i]}
            </div>
        {/each}
    </div>
    <div class="column scores">
        {#each range(rounds.length) as i}
            <div class="column">
                {#each rounds[i] as score}
                    <div class="score">
                        {score}
                    </div>
                {/each}
                <small>{i + 1}</small>
            </div>
        {/each}
    </div>
    <div class="column score-panel">
        {#each range(total.length) as i}
            <div class="name" style="--c: {colors[i]}">
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
    padding: .5em;
}
.score-panel {
    background-color: white;
    border-radius: .5rem;
    box-shadow: 0 0 0 1px #0014;
    grid-row: 1 / -2;
    &:first-child {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        justify-items: end;
    }
    &:last-child {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        justify-items: center;
    }
}
.scores {
    grid-auto-columns: 25%;
    overflow-x: auto;
    font-variant: tabular-nums;
    padding: 0;
    scroll-snap-type: x mandatory;
    & .column {
        justify-items: center;
        scroll-snap-align: end;

        &:not(:first-child) {
            border-left: 1px solid #0014;
        }
    }
    & .score {
        font-weight: bold;
    }
}
.name {
    color: var(--c);
    font-weight: bold;
}
</style>
