<script lang="ts">
import { Spring } from "svelte/motion";
import { ACTION_BUTTON_RADIUS, ACTION_DIAL_RADIUS } from "./const";
import { range } from "$lib/utils.svelte";

const ACTIONS = 4
const SLICE = 2 * Math.PI / ACTIONS

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

{#each range(4) as i}

<circle
    cx={r.current * Math.cos(SLICE * i)} cy={r.current * Math.sin(SLICE * i)}
    r={ACTION_BUTTON_RADIUS}
    fill="#dde"
    onpointerdown={onPress} />
{/each}
