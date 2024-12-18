import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

function icons() {
	const virtualModuleId = 'virtual:icons'
	const resolvedVirtualModuleId = '\0' + virtualModuleId
	
	return {
		name: 'icons', // required, will show up in warnings and errors
		resolveId(id: string) {
			if (id === virtualModuleId) {
				return resolvedVirtualModuleId
			}
		},
		load(id: string) {
			if (id === resolvedVirtualModuleId) {
				return `export const msg = "from virtual module"`
			}
		},
	}
}

export default defineConfig({
	plugins: [sveltekit()]
});
