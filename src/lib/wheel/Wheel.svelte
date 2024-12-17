<script lang="ts">
import { range, sizeObserver } from "$lib/utils.svelte";
import { BASE_RADIUS, BALL_RADIUS, TEXT_RADIUS, BALL_SIZE } from "./Base.svelte";
import { bindController } from "./bindController.svelte";

interface Props {
    previewValue: number
    slices: number
    onpress: (slice: number) => void
    onrelease: (value: number) => void
    colors: string[]
    names: string[]
}

let { colors, names, previewValue = $bindable(0), slices, onpress, onrelease }: Props = $props()

let ref: (HTMLElement & SVGElement) | undefined = $state()

const size = sizeObserver(() => ref)

const scale = $derived(
    Math.min(size.width, size.height)
    / (BASE_RADIUS * 2)
)

let selectedSlice: number | null = $state(null)

const phiRef = bindController(() => ref, () => BASE_RADIUS * scale, () => BASE_RADIUS * scale)

let prevPhi: number | null = null
let prevTime = 0

const SPEED_RANGE_BUF_SIZE = 8
let speedRangeBuf = Array.from({ length: SPEED_RANGE_BUF_SIZE }).fill(0) as number[]
let bufPointer = 0

let instantSpeed = $state(0)
let averageSpeed = $state(0)
let accum = 0
const ACCUM_MAX = 10

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

            instantSpeed = speedRangeBuf[bufPointer++] = deltaPhi / deltaT * 1000
            if (bufPointer == SPEED_RANGE_BUF_SIZE)
                bufPointer = 0;

            let sum = 0
            for (let i = 0; i < SPEED_RANGE_BUF_SIZE; i++) {
                sum += speedRangeBuf[i]
            }

            averageSpeed = sum / SPEED_RANGE_BUF_SIZE

            accum += averageSpeed
            if (Math.abs(accum) > ACCUM_MAX) {
                const count = Math.floor(Math.abs(accum) / ACCUM_MAX)
                previewValue -= count * Math.sign(accum)
                accum -= count * Math.sign(accum) * ACCUM_MAX
            }
        } else { // released
            onrelease(previewValue)
            speedRangeBuf.fill(0)
            previewValue = 0
            averageSpeed = 0
            selectedSlice = null
        }
    } else if (phi !== null) { // pressed
        previewValue = 0
        selectedSlice = Math.floor((phi + Math.PI * (9 / 4)) / (2 * Math.PI / slices)) % slices
        //                                ^ 360° + 45°
        onpress(selectedSlice)
    }
    prevPhi = phi
    requestAnimationFrame(updateSpeed)
}

$effect(() => {
    requestAnimationFrame(updateSpeed)
})

const TO_DEG = 180 / Math.PI
const lineWidth = $derived(BALL_SIZE * Math.exp(-Math.abs(averageSpeed) / 15))
const tailLength = $derived(Math.abs(averageSpeed) * TO_DEG / 60 * SPEED_RANGE_BUF_SIZE)
const dasharray = $derived(averageSpeed > 0 ? `${tailLength} 360` : `0 ${360 - tailLength} 360`)

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
            stroke="#dde" stroke-width="1"
            fill={selectedSlice === null ? "none" : colors[selectedSlice]} />
        <!--<circle
            cx={BASE_RADIUS * Math.cos(phiRef.value)} cy={BASE_RADIUS * Math.sin(phiRef.value)}
            r={Math.abs(speed)}
            fill="blue" />-->
        <circle
            cx="0" cy="0"
            r={BASE_RADIUS / 4}
            fill="#dde" />
<!--         <use href="#baseline"/> -->
        
        {#each range(slices).map(i => [i, selectedSlice === null || selectedSlice === i] as const) as [i, selected]}
            <g class="player" opacity={selected ? 1 : 0}>
                <circle
                    cx="0" cy="0"
                    r={BALL_RADIUS}
                    transform="rotate({selected && phiRef.value !== null ? phiRef.value * TO_DEG : 360 / slices * i})"
                    stroke={selectedSlice !== null && selected ? "white" : colors[i]} stroke-width={selected ? lineWidth : BALL_SIZE} fill="none"
                    stroke-linecap="round" pathLength="360" stroke-dasharray={selected ? dasharray : "0 360 360"} />
                    
                <text transform="rotate({360 / slices * i})">
                    <textPath
                        startOffset="50%"
                        text-anchor="middle"
                        lengthAdjust="spacingAndGlyphs"
                        alignment-baseline="baseline"
                        href="#baseline"
                        fill={colors[i]}
                    >
                        {names[i]}
                    </textPath>
                </text>
            </g>
        {/each}
            

    </g>
</svg>

<style>
svg {
    height: 100%;
    width: 100%;
    font: inherit;
}
.player {
    transition: opacity .2s linear;
}
text {
    font-size: 1rem;
    font-weight: bold;
}
</style>
