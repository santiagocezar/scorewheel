<script>
import resetSheet from '$lib/styles/reset.css?url'
import globalSheet from '$lib/styles/global.css?url'

const { children } = $props()
</script>

<svelte:head>
<link rel="stylesheet" href={resetSheet}>
<link rel="stylesheet" href={globalSheet}>
</svelte:head>

{@render children?.()}
