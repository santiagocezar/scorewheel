<script lang="ts">
import { BASE_RADIUS } from "./Base.svelte";

let open = $state(false)

function onPress(ev: PointerEvent) {
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
    r={BASE_RADIUS / 4}
    fill="#dde"
    onpointerdown={onPress} />
