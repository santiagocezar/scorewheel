<script lang="ts">
import { Spring } from "svelte/motion";
import { ACTION_BUTTON_RADIUS, ACTION_DIAL_RADIUS, BASE_BORDER, BASE_RADIUS } from "./const";
import { range } from "$lib/utils.svelte";

const ACTIONS = [
    { label: "Ronda\nsiguiente", icon: "#hi-arrow-right-double", ux: 0, uy: 0 },
    { label: "Ronda\nanterior",  icon: "#hi-arrow-left-double", ux: 0, uy: 0 },
]
const SLICE = 2 * Math.PI / ACTIONS.length

let i = 0
for (const action of ACTIONS) {
    action.ux = Math.cos(SLICE * i)
    action.uy = Math.sin(SLICE * i)
    i++
}

let open = $state(false)
let keepOpen = $state(false)
const r = $derived(open ? ACTION_DIAL_RADIUS : 0)

function onPress(ev: PointerEvent) {
    ev.preventDefault()
    document.addEventListener('pointerup', onRelease, { once: true })
    if (open) {
        keepOpen = false
    } else {
        open = true
        keepOpen = true
    }
}

function onLeave() {
    keepOpen = false
}

function onRelease() {
    if (!keepOpen) open = false
}

$effect(() => () => {
    document.removeEventListener('pointerup', onRelease)
})

$inspect(open)
</script>

<circle
    class="bg"
    cx="0" cy="0"
    r={open ? BASE_RADIUS : ACTION_BUTTON_RADIUS}
    fill="#000"
    onpointerdown={onPress} />

{#each ACTIONS as action}
<g 
    class="action"
    transform="rotate({open ? 0 : 20}) translate({r * action.ux}, {r * action.uy}) scale({open ? 1 : 0.5})"
>
    <use href="{action.icon}" width="30" height="30" x="-15" y="-20" />
    <text
        x="0" y="10"
        text-anchor="middle"
        font-size="8"
        fill="currentColor"
    >
        {#each action.label.split('\n') as line}
            <tspan x="0" dy="1.2em">{line}</tspan>
        {/each}
    </text>
</g>

<circle
    cx="0" cy="0"
    r={ACTION_BUTTON_RADIUS}
    fill="#000"
    onpointerdown={onPress}
    onpointerleave={onLeave} />

<use class="menu-icon" href="#hi-menu-01" width="30" height="30" transform="scale({open ? 0 : 1})" x="-15" y="-15" />

<circle
    class="bg"
    cx="0" cy="0"
    r={open ? ACTION_BUTTON_RADIUS : 0}
    fill="#fff"
    onpointerdown={onPress} />

<use class="close-icon" href="#hi-cancel-01" width="30" height="30" transform="scale({open ? 1 : 0})" x="-15" y="-15" />
{/each}

<style>
.close-icon, .menu-icon, .action {
    transition: transform .3s cubic-bezier(.17,.67,.12,1);
    pointer-events: none;
}
.menu-icon, .action {
    color: white;
}
.bg {
    transition: r .3s cubic-bezier(.17,.67,.12,1);
}
</style>
