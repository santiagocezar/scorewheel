<script lang="ts">
	import { untrack } from "svelte";

let target: HTMLElement | undefined = $state();

interface Props {
    phi?: number
    centerX: number
    centerY: number
}

let { phi = $bindable(0), centerX, centerY }: Props = $props()

let originX = 0, originY = 0;
let moving = false;

function stopMoving(ev: PointerEvent) {
    moving = false
    ev.preventDefault()
}

function startMoving(ev: PointerEvent) {
    moving = true
    ev.preventDefault()

    const rect = target!.getBoundingClientRect();
    originX = rect.left;
    originY = rect.top;

    mapClientPosition(ev.clientX, ev.clientY);
}

function keepMoving(ev: PointerEvent) {
    if (!moving) return;

    ev.preventDefault()
    mapClientPosition(ev.clientX, ev.clientY)
}

function mapClientPosition(clientX: number, clientY: number) {
    untrack(() => {
        phi = Math.atan2(clientY - originY - centerY, clientX - originX - centerX)
    })
}
</script>

<svelte:document
    onpointermove={keepMoving}
    onpointerup={stopMoving}
/>

<div bind:this={target} onpointerdown={startMoving} role="none"></div>

<style>
div {
    position: absolute;
    inset: 0;
}
</style>
