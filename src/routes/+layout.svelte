<script>
	import resetSheet from '$lib/styles/reset.css?url';
	import paletteSheet from '$lib/styles/palette.scss?url';
	import globalSheet from '$lib/styles/global.css?url';
	import Icon from '$lib/Icon.svelte';

	import symbols from 'icons:symbols';

	const { children } = $props();
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&family=Poppins:wght@700;900&display=swap"
		rel="stylesheet"
	/>
	<link rel="stylesheet" href={resetSheet} />
	<link rel="stylesheet" href={paletteSheet} />
	<link rel="stylesheet" href={globalSheet} />
</svelte:head>

<svg style="display: none;">
	<defs>
		{@html symbols}
	</defs>
</svg>
<div class="wrapper">
	<header>
		<button onclick={() => history.back()} class="button back">
			<Icon use="hi-arrow-left-01" />
		</button>
		<a href="/" class="logo">
			<img src="/logoo.svg" alt="Score" />
			<span>scorewheel</span>
		</a>
		<button class="button" id="share">
			<Icon use="hi-share-08" />
		</button>
	</header>
	{@render children?.()}
</div>

<!--
<script>
  import { shareGameData } from "../lib/bxx.svelte";

  const shareBtn = document.getElementById("share");
  if (shareBtn instanceof HTMLButtonElement) {
    shareBtn.addEventListener("click", async (btn) => {
      const url = new URL(location.href);
      const id = url.searchParams.get("id")!;
      await shareGameData(id)
    });
  }
</script>-->

<style>
	.wrapper {
		display: grid;
		grid-template-rows: auto 1fr;
		height: 100%;
		max-height: 100vh;
		overflow: hidden;
	}
	header {
		display: flex;
		align-items: center;
		padding: 0 0.5rem;
		height: 4rem;
		flex-shrink: 0;
		border-bottom: 1px solid var(--p30);
		justify-content: space-between;
	}

	.logo {
		display: flex;
		flex-direction: row;
		gap: 0.5em;
		justify-content: center;
		align-items: center;
		height: 6rem;
		text-align: center;
		font-family: 'Poppins';
		font-size: 1rem;
		flex-shrink: 0;
		user-select: none;

		& img {
			height: 1.5rem;
		}
	}
	.button {
		display: flex;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		gap: 0.5rem;
		align-items: center;

		& svg {
			width: 1.5rem;
			height: 1.5rem;
		}
	}
	.back {
		background: none;
		color: inherit;
	}
	#share {
		background-color: var(--blue);
		color: white;
	}
</style>
