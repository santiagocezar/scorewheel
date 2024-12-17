<script lang="ts">
import { sizeObserver } from "$lib/utils.svelte";
import { BASE_RADIUS } from "$lib/wheel/Base.svelte";
import Controller from "$lib/wheel/Controller.svelte";

let ref: SVGElement | undefined = $state()

let phi: number | null = $state(null)

let prevPhi = null
let prevTime = 0
let score = $state(0)

const SPEED_RANGE_BUF_SIZE = 8
let speedRangeBuf = Array.from({ length: SPEED_RANGE_BUF_SIZE }).fill(0)
let bufPointer = 0

let speed = $state(0)
let accum = 0
const ACCUM_MAX = 20

function updateSpeed(time: number) {
    if (prevPhi !== null) {
        /* not using an && because when `phi` is null   *
         * but `prevPhi` is not, then it means the user *
         * has JUST released the spinner                */
        if (phi !== null) {
            // https://stackoverflow.com/questions/1878907/how-can-i-find-the-smallest-difference-between-two-angles-around-a-point#comment119528981_7869457
            const deltaPhi = (prevPhi - phi + 3 * Math.PI) % (2 * Math.PI) - Math.PI
            const deltaT = time - prevTime
            prevPhi = phi
            prevTime = time

            speedRangeBuf[bufPointer++] = deltaPhi / deltaT * 1000
            if (bufPointer == SPEED_RANGE_BUF_SIZE)
                bufPointer = 0;

            let sum = 0
            for (let i = 0; i < SPEED_RANGE_BUF_SIZE; i++) {
                sum += speedRangeBuf[i]
            }

            speed = sum / SPEED_RANGE_BUF_SIZE
            
            accum += speed * speed * Math.sign(speed)
            if (Math.abs(accum) > ACCUM_MAX) {
                const count = Math.floor(Math.abs(accum) / ACCUM_MAX)
                score -= count * Math.sign(accum)
                accum -= count * Math.sign(accum) * ACCUM_MAX
            }
        } else {
            speedRangeBuf.fill(0)
            speed = 0
        }
    }
    prevPhi = phi
    requestAnimationFrame(updateSpeed)
}

$effect(() => {
    requestAnimationFrame(updateSpeed)
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

{score}
<div class="wrapper">
    <svg bind:this={ref}>
        <g
            class="wrapper"
            transform="translate({BASE_RADIUS * scale}, {BASE_RADIUS * scale}) scale({scale})"
        >
            <circle
                cx="0" cy="0"
                r={BASE_RADIUS - 2.5}
                stroke="gray" stroke-width="5"
                fill="transparent"></circle>
            <circle
                cx={BASE_RADIUS * Math.cos(phi)} cy={BASE_RADIUS * Math.sin(phi)}
                r={Math.abs(speed)}
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
}
</style>
