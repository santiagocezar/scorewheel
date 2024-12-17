<script lang="ts">
	import { range } from "$lib/utils.svelte";
import Wheel from "$lib/wheel/Wheel.svelte";

let diffPreview = $state(false)
let score = $state(0)
let diff = $state(0)
let slice = $state(0)

const colors = ["red", "orange", "royalblue", "aquamarine"]
const names = ["Santi", "Flor", "Papá", "Mamá"]
let rounds: number[][] = $state([])
let total: number[] = $derived(rounds.reduce((prev, curr) => prev.map((c, i) => c + prev[i])))
let currentRound = $state(0)

rounds.push(names.map(() => 0))

function wheelPressed(s: number) {
    diffPreview = true
    slice = s
}
function wheelReleased(d: number) {
    rounds[currentRound][slice] += d
    diffPreview = false
    diff = d
}
</script>

<div class="view">
    <div data-hidden={!diffPreview} class="preview" style="--c: {colors[slice]}">
        <p class="name">{names[slice]}</p>
        <p class="diff">
            <span>{rounds[currentRound][slice]}</span>
            <span>{diff < 0 ? '-' : '+'}</span>
            <span>{Math.abs(diff)}</span>
        </p>
        <p class="result">
            {rounds[currentRound][slice] + diff}
        </p>
    </div>
    <div data-hidden={diffPreview} class="standings" style="--rows: {names.length}">
        <div class="column score-panel">
            {#each range(names.length) as i}
                <div class="name" style="--c: {colors[i]}">
                    {names[i]}
                </div>
            {/each}
        </div>
        <div class="column scores">
            {#snippet col()}
            {/snippet}
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
    <div class="wheel-wrapper">
        <Wheel {colors} {names} bind:previewValue={diff} slices={4} onpress={wheelPressed} onrelease={wheelReleased} />
    </div>
</div>

<style>
.view {
    display: grid;
    width: 100%;
    height: 100%;
    grid-template-rows: 1fr auto;
}
.standings, .preview {
    grid-area: 1 / 1;
}
.standings {
    display: grid;
    grid-template-rows: repeat(var(--rows), auto) auto;
    grid-auto-flow: column;
    grid-template-columns: auto 0.8fr 0.2fr;
    align-content: center;
    font-size: 1.25rem;
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
    & .column {
        justify-items: center;

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
.wheel-wrapper {
    width: 100%;
    aspect-ratio: 1 / 1;
    padding: 1rem;
}
[data-hidden="true"] {
    opacity: 0;
}
[data-hidden] {
    transition: opacity .1s linear;
}
</style>
