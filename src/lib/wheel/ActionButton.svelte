<script lang="ts">
import { BASE_RADIUS } from "./Base.svelte";

let open = $state(false)

$inspect(open)
</script>

<circle
    cx="0" cy="0"
    r={BASE_RADIUS / 4}
    fill="#dde" onpointerdowncapture={() => open = true} onpointerup={() => open = false} />
