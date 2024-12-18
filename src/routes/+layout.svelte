<script>
import resetSheet from '$lib/styles/reset.css?url'
import globalSheet from '$lib/styles/global.css?url'
import symbols from 'icons:hugeicons?prefix=hi&use=arrow-left-double,arrow-right-double,menu-01,cancel-01'
console.log(symbols)

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

<svg style="display: none;">
  <defs>
    {@html symbols}
  </defs>
</svg>
{@render children?.()}
