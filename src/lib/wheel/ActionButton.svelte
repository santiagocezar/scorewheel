<script lang="ts">
import { Spring } from "svelte/motion";
import { ACTION_BUTTON_RADIUS, ACTION_DIAL_RADIUS } from "./const";
import { range } from "$lib/utils.svelte";

const ACTIONS = [
    { label: "Ronda anterior" },
    { label: "Ronda siguiente" },
]
const SLICE = 2 * Math.PI / ACTIONS.length

let open = $state(false)
const r = Spring.of(() => open ? ACTION_DIAL_RADIUS : 0, {
    stiffness: 0.1,
    damping: 0.8
})

function onPress(ev: PointerEvent) {
    ev.preventDefault()
    document.addEventListener('pointerup', onRelease, { once: true })
    open = true
}

function onRelease() {
    open = false
}

$effect(() => () => {
    document.removeEventListener('pointerup', onRelease)
})

$inspect(open)
</script>

<circle
    cx="0" cy="0"
    r={ACTION_BUTTON_RADIUS}
    fill="#dde"
    onpointerdown={onPress} />

{#each range(ACTIONS.length) as i}
<g 
    transform="translate({r.current * Math.cos(SLICE * i)}, {r.current * Math.sin(SLICE * i)})"
>
    <circle
        cx="0" cy="0"
        r={ACTION_BUTTON_RADIUS}
        fill="#dde"
        onpointerdown={onPress} />
    <text
        x="0" y="10"
        text-anchor="middle"
    >
        {ACTIONS[i].label}
    </text>
</g>
{/each}
