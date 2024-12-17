<script lang="ts">
import Wheel from "$lib/wheel/Wheel.svelte";

let diffPreview = $state(false)
let score = $state(0)
let diff = $state(0)
let slice = $state(0)

const colors = ["red", "orange", "royalblue", "aquamarine"]
const names = ["Santi", "Flor", "Papá", "Mamá"]

function wheelPressed(s: number) {
    diffPreview = true
    slice = s
}
function wheelReleased(d: number) {
    diffPreview = false
    diff = d
}
</script>

<div class="view">
    <div data-hidden={diffPreview} class="standings">
        {score}
    </div>
    <div data-hidden={!diffPreview} class="preview">
        <h2 style="color: {colors[slice]}">{names[slice]}</h2>
        {score}{diff < 0 ? '-' : '+'}{Math.abs(diff)}
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
