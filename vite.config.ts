import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import icons from './icon-plugin'

export default defineConfig({
	plugins: [icons(), sveltekit()]
});
