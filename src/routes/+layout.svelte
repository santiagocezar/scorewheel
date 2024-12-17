<script>
import resetSheet from '$lib/styles/reset.css?url'
import globalSheet from '$lib/styles/global.css?url'

const { children } = $props()
</script>

<svelte:head>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&family=Poppins:wght@700;900&display=swap"
    rel="stylesheet"
/>
<link rel="stylesheet" href={resetSheet}>
<link rel="stylesheet" href={globalSheet}>
</svelte:head>

{@render children?.()}
