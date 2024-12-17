<script lang="ts">
import Wheel from "$lib/wheel/Wheel.svelte";

let score = $state(0)
let slice = $state(0)
</script>

<p>{score}</p>
<p>{slice}</p>
<Wheel bind:previewValue={score} slices={4} onpress={s => {slice = s}} onrelease={() => {}} />
