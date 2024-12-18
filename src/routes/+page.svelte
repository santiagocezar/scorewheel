<script lang="ts">
	import { range } from "$lib/utils.svelte";
	import Standings from "$lib/wheel/Standings.svelte";
import Wheel from "$lib/wheel/Wheel.svelte";

let diffPreview = $state(false)
let score = $state(0)
let diff = $state(0)
let slice = $state(0)

const colors = ["red", "orange", "royalblue", "aquamarine"]
const names = ["Santi", "Flor", "Papá", "Mamá"]
let rounds: number[][] = $state([])
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
    <div data-hidden={diffPreview} class="standings">
        <Standings {colors} {names} {rounds} />
    </div>
    <div class="wheel-wrapper">
        <Wheel
            {colors} {names}
            bind:previewValue={diff}
            slices={4}
            onpress={wheelPressed}
            onrelease={wheelReleased} />
    </div>
</div>

<style>
.standings, .preview {
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
