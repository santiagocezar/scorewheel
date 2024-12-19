<script lang="ts">
import { range, sizeObserver } from "$lib/utils.svelte";
import ActionButton from "./ActionButton.svelte";
import { BASE_RADIUS, BALL_RADIUS, TEXT_RADIUS, BALL_SIZE, BASE_BORDER, BASE_FULL_RADIUS } from "./const";
import { bindController } from "./bindController.svelte";

interface Props {
    previewValue: number
    slices: number
    onpress: (slice: number) => void
    onrelease: (value: number) => void
    onaction: (id: string) => void
    colors: string[]
    names: string[]
}

let { colors, names, previewValue = $bindable(0), slices, onpress: emitPress, onrelease: emitRelease, onaction }: Props = $props()

let svgRef: (HTMLElement & SVGElement) | undefined = $state()
let groupRef: SVGElement | undefined = $state()

const size = sizeObserver(() => svgRef)

const scale = $derived(
    Math.min(size.width, size.height)
    / (BASE_FULL_RADIUS * 2)
)

let selectedSlice: number | null = $state(null)

const phiRef = bindController(() => svgRef, () => BASE_RADIUS * scale, () => BASE_RADIUS * scale)

let prevPhi = phiRef.value
let prevTime = 0

const SPEED_RANGE_BUF_SIZE = 8
let speedRangeBuf = Array.from({ length: SPEED_RANGE_BUF_SIZE }).fill(0) as number[]
let bufPointer = 0

let instantSpeed = $state(0)
let averageSpeed = $state(0)
let accum = 0
const ACCUM_MAX = 10

function onPress(ev: PointerEvent) {
    ev.preventDefault()
    
    document.addEventListener('pointerup', onRelease, { once: true })
    previewValue = 0
    selectedSlice = Math.floor((phiRef.value + Math.PI * 2 + Math.PI / slices) / (2 * Math.PI / slices)) % slices

    emitPress(selectedSlice)
}

function onRelease(ev: PointerEvent) {
    ev.preventDefault()
    
    emitRelease(previewValue)
    
    selectedSlice = null
    previewValue = 0
    averageSpeed = 0
    speedRangeBuf.fill(0)
}

function updateSpeed(time: number) {
    const phi = phiRef.value
    if (selectedSlice !== null) {
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

<svg bind:this={svgRef}>
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
        transform="translate({BASE_FULL_RADIUS * scale}, {BASE_FULL_RADIUS * scale}) scale({scale})"
    >
        <circle
            cx="0" cy="0"
            r={BASE_RADIUS}
            stroke="var(--bg3)" stroke-width={BASE_BORDER}
            fill="var(--bg0)"
            onpointerdown={onPress} />
        <!--<circle
            cx={BASE_RADIUS * Math.cos(phiRef.value)} cy={BASE_RADIUS * Math.sin(phiRef.value)}
            r={Math.abs(speed)}
            fill="blue" />-->

<!--         <use href="#baseline"/> -->

        {#snippet player(slice: number, phi: number, selected: boolean, visible: boolean)}
            <g class="player pal-{colors[slice]}" transform="scale({visible ? 1 : 1.75})">
                <circle
                    class="player-ball"
                    cx={selected ? 0 : BALL_RADIUS} cy="0" z="0"
                    r={visible ? selected ? BASE_RADIUS : BALL_SIZE / 2 : 0}
                    fill="var(--p50)"
                    transform="rotate({selected ? phi : 360 / slices * slice})" />
                    
                <circle
                    cx="0" cy="0"
                    r={BALL_RADIUS}
                    fill="none"
                    class="player-stroke"
                    stroke="var(--contrast)"
                    stroke-width={selected ? lineWidth : 0}
                    stroke-linecap="round"
                    stroke-dasharray={selected ? dasharray : "0 360 360"}
                    pathLength="360"
                    transform="rotate({selected ? phi : 360 / slices * slice})" />
                <text class="pal-{colors[slice]}" transform="rotate({360 / slices * slice})">
                    <textPath
                        startOffset="50%"
                        text-anchor="middle"
                        lengthAdjust="spacingAndGlyphs"
                        alignment-baseline="baseline"
                        href="#baseline"
                        fill={selected ? "var(--contrast)" : "var(--p50)"}
                    >
                        {names[slice]}
                    </textPath>
                </text>
            </g>
        {/snippet}

        {#each range(slices) as i}
            {@render player(
                i,
                (phiRef.value ?? 0) * TO_DEG,
                selectedSlice === i,
                selectedSlice === null || selectedSlice === i
            )}
        {/each}

        <ActionButton
            phi={phiRef.value}
            actions={[
                { id: "next", label: "Ronda\nsiguiente", icon: "#hi-arrow-right-double" },
                { id: "prev", label: "Ronda\nanterior",  icon: "#hi-arrow-left-double" },
            ]}
            {onaction}
        />

    </g>
</svg>

<style>
svg {
    height: 100%;
    width: 100%;
    font: inherit;
    user-select: none;
    touch-action: none;
}
.player {
    pointer-events: none;
    transition: transform .3s cubic-bezier(.17,.67,.12,1);
}
.player-ball {
    transition: cx .3s cubic-bezier(.17,.67,.12,1), r .3s cubic-bezier(.17,.67,.12,1);
}
.player-stroke {
    transition: stroke .3s cubic-bezier(.17,.67,.12,1);
}
text {
    font-size: 1rem;
    font-weight: bold;
}
</style>
