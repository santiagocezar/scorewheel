<script lang="ts">
import { sizeObserver } from "$lib/utils.svelte";
import { BASE_RADIUS } from "$lib/wheel/Base.svelte";
import Controller from "$lib/wheel/Controller.svelte";

let ref: SVGElement | undefined = $state()

let phi: number | null = $state(0)

let prevPhi = 0
let prevTime = 0

const V_PHI_MEAN_COUNT = 8
let lastVPhi = Array.from({ length: V_PHI_MEAN_COUNT }).fill(0)
let lastAssigned = 0

let vPhi = $state(0)

function calcVPhi(time: number) {
    const deltaPhi = (prevPhi - phi + 3 * Math.PI) % (2 * Math.PI) - Math.PI
    const deltaT = time - prevTime
    prevPhi = phi // cool side effect
    prevTime = time


    lastVPhi[lastAssigned++] = deltaPhi / deltaT * 1000
    if (lastAssigned == V_PHI_MEAN_COUNT)
        lastAssigned = 0;

    let total = 0

    for (let i = 0; i < V_PHI_MEAN_COUNT; i++) {
        total += lastVPhi[i]
    }

    vPhi = total / V_PHI_MEAN_COUNT

    requestAnimationFrame(calcVPhi)
}

$effect(() => {
    requestAnimationFrame(calcVPhi)
})
/*
const vPhi = $derived.by(() => {
    const deltaPhi = (prevPhi - phi + 3 * Math.PI) % (2 * Math.PI) - Math.PI
    const deltaT = document.timeline.currentTime - prevTime
    prevPhi = phi // cool side effect
    prevTime = document.timeline.currentTime
    return deltaPhi / deltaT * 1000
})*/

const size = sizeObserver(() => ref)

const scale = $derived(
    Math.min(size.width, size.height)
    / (BASE_RADIUS * 2)
)
</script>

{vPhi}
<div class="wrapper">
    <svg bind:this={ref}>
        <g
            class="wrapper"
            transform="translate({BASE_RADIUS * scale}, {BASE_RADIUS * scale}) scale({scale})"
        >
            <circle
                cx="0" cy="0"
                r={BASE_RADIUS - 2.5}
                stroke="red" stroke-width="5"
                fill="transparent"></circle>
            <circle
                cx={BASE_RADIUS * Math.cos(phi)} cy={BASE_RADIUS * Math.sin(phi)}
                r={Math.abs(vPhi)}
                fill="blue"></circle>
        </g>
    </svg>
    <Controller bind:phi={phi} centerX={BASE_RADIUS * scale} centerY={BASE_RADIUS * scale} />
</div>

<style>
.wrapper {
    position: relative;
    height: 100%;
    width: 100%;
}
svg {
    height: 100%;
    width: 100%;
    background-color: gray;
}
</style>
