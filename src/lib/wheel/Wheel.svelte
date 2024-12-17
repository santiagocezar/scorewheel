<script lang="ts">
import { sizeObserver } from "$lib/utils.svelte";
import { BASE_RADIUS, TEXT_RADIUS } from "./Base.svelte";
import { bindController } from "./bindController.svelte";

interface Props {
    previewValue: number
    slices: number
    onpress: (slice: number) => void
    onrelease: (value: number) => void
}

let { previewValue = $bindable(0), slices, onpress, onrelease }: Props = $props()
let ref: SVGElement | undefined = $state()

const size = sizeObserver(() => ref)

const scale = $derived(
    Math.min(size.width, size.height)
    / (BASE_RADIUS * 2)
)

const phiRef = bindController(() => ref, () => BASE_RADIUS * scale, () => BASE_RADIUS * scale)


let prevPhi: number | null = null
let prevTime = 0

const SPEED_RANGE_BUF_SIZE = 8
let speedRangeBuf = Array.from({ length: SPEED_RANGE_BUF_SIZE }).fill(0) as number[]
let bufPointer = 0

let speed = $state(0)
let accum = 0
const ACCUM_MAX = 20

function updateSpeed(time: number) {
    const phi = phiRef.value
    /* not using an && because when `phi` is null    *
     * but `prevPhi` is not, then it means the user  *
     * has JUST released the spinner (and viceversa) */
    if (prevPhi !== null) {
        if (phi !== null) { // holding

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
                previewValue -= count * Math.sign(accum)
                accum -= count * Math.sign(accum) * ACCUM_MAX
            }
        } else { // released
            onrelease(previewValue)
            speedRangeBuf.fill(0)
            previewValue = 0
            speed = 0

        }
    } else if (phi !== null) { // pressed
        previewValue = 0
        onpress(Math.floor((phi + Math.PI * (9 / 4)) / (2 * Math.PI / slices)) % slices)
        //                        ^ 360° + 45°
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

</script>

<svg bind:this={ref}>
    <defs>
        <path
            id="baseline"
            stroke="red" stroke-width="1" fill="none"
            d="
                M {-TEXT_RADIUS},0
                a {TEXT_RADIUS} {TEXT_RADIUS} 90 1 1 {TEXT_RADIUS * 2},0
                a {TEXT_RADIUS} {TEXT_RADIUS} 90 1 1 {-TEXT_RADIUS * 2},0
            "></path>
    </defs>
    <g
        class="wrapper"
        transform="translate({BASE_RADIUS * scale}, {BASE_RADIUS * scale}) scale({scale})"
    >
        <circle
            cx="0" cy="0"
            r={BASE_RADIUS - .5}
            stroke="gray" stroke-width="1"
            fill="transparent" />
        <!--<circle
            cx={BASE_RADIUS * Math.cos(phiRef.value)} cy={BASE_RADIUS * Math.sin(phiRef.value)}
            r={Math.abs(speed)}
            fill="blue" />-->
        <circle
            cx="0" cy="0"
            r={BASE_RADIUS / 3}
            fill="gray" />
<!--         <use href="#baseline"/> -->
<!--
        <circle
            cx="0" cy="0"
            r={TEXT_RADIUS}
            transform="rotate({phiRef.value / Math.PI * 180}) scale(Math.sign(speed))"
            stroke="blue" stroke-width="5"
            pathLength="360" stroke-dasharray="0 {360 - Math.abs(speed) / Math.PI * 180 / 60} 360" />-->
<!--
        <path
            stroke="red" stroke-width="1" fill="none"
            d="
                M {TEXT_RADIUS * Math.cos(phiRef.value ?? 0)},{TEXT_RADIUS * Math.sin(phiRef.value ?? 0)}
                a {TEXT_RADIUS} {TEXT_RADIUS} 10 0 1
                  {TEXT_RADIUS * Math.cos(phiRef.value ?? 0 + speed)},{TEXT_RADIUS * Math.sin(phiRef.value ?? 0 + speed)}
            "></path>-->

        <text>
            <textPath
                startOffset="50%"
                text-anchor="middle"
                lengthAdjust="spacingAndGlyphs"
                alignment-baseline="baseline"
                href="#baseline"
            >
                Dangerous Curves Ahead
            </textPath>
        </text>

    </g>
</svg>

<style>
svg {
    height: 100%;
    width: 100%;
    font: inherit;
}
text {
    font-size: .75rem;
}
</style>
