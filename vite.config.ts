import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import icons from './icon-plugin'

export default defineConfig({
	plugins: [icons({
		hugeicons: {
			prefix: "hi",
			use: ["arrow-left-double", "arrow-right-double", "menu-01", "cancel-01", "arrow-left-01", "share-08"]
		}
	}), sveltekit()]
});
