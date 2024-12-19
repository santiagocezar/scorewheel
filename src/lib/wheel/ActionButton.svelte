<script lang="ts">
import { Spring } from "svelte/motion";
import { ACTION_BUTTON_RADIUS, ACTION_DIAL_RADIUS, BASE_BORDER, BASE_RADIUS } from "./const";
import { range } from "$lib/utils.svelte";
import { path } from "rambda";

interface Props {
    phi: number
    actions: { id: string, label: string, icon: string }[]
    onaction: (id: string) => void
}

const { phi, actions, onaction }: Props = $props()

const actionsWithPos = $derived.by(() => {
    const slices = 2 * Math.PI / actions.length

    return actions.map((action, i) => (
        { ux: Math.cos(slices * i), uy: Math.sin(slices * i), ...action }
    ))
})

let open = $state(false)
let keepOpen = $state(false)
const r = $derived(open ? ACTION_DIAL_RADIUS : 0)

function onPress(ev: PointerEvent) {
    ev.preventDefault()
    document.addEventListener('pointerup', onRelease, { once: true })
    if (open) {
        open = false
        keepOpen = false
    } else {
        open = true
        keepOpen = true
    }
}

function onPressMiddle(ev: PointerEvent) {
    ev.preventDefault()
    document.addEventListener('pointerup', onRelease, { once: true })
    if (open) {
        open = false
        keepOpen = true
    } else {
        open = true
        keepOpen = true
    }
}

function onLeave(ev: PointerEvent) {
    console.log(ev.type)
    ev.preventDefault()
    keepOpen = false
}

function onRelease(ev: PointerEvent) {
    ev.preventDefault()
    if (!keepOpen) {
        const selectedAction = Math.floor((phi + Math.PI * 2 + Math.PI / actions.length) / (2 * Math.PI / actions.length)) % actions.length
        onaction(actions[selectedAction].id)
        open = false
    }
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

{#each actionsWithPos as action, i}
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
    
    <path
        d="M {ACTION_DIAL_RADIUS - 20},0 l 40,0"
        stroke="white" 
        stroke-width="1" 
        transform="rotate({180 / actionsWithPos.length * (i * 2 + 1)}) scale({open ? 1 : 0})"/>

    <circle
        cx="0" cy="0"
        r={ACTION_BUTTON_RADIUS}
        fill="#000" />

    <use class="menu-icon" href="#hi-menu-01" width="30" height="30" transform="scale({open ? 0 : 1})" x="-15" y="-15" />

    <circle
        class="bg"
        cx="0" cy="0"
        r={open ? ACTION_BUTTON_RADIUS : 0}
        fill="#fff" />

    <use class="close-icon" href="#hi-cancel-01" width="30" height="30" transform="scale({open ? 1 : 0})" x="-15" y="-15" />

    <circle
        cx="0" cy="0"
        r={ACTION_BUTTON_RADIUS}
        fill="transparent"
        onpointerdown={onPressMiddle}
        onpointerout={onLeave}
        ongotpointercapture={e => (e.target as SVGElement).releasePointerCapture(e.pointerId) }/>
    
{/each}
<style>
.close-icon, .menu-icon, .action, path {
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
