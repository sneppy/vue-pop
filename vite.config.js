import path from 'path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [vue()],
	build: {
		lib: {
			entry: path.resolve(__dirname, 'src/index.js'),
			name: 'vue-pop'
		},
		rollupOptions: {
			// Specify external dependencies
			external: ['vue'],
			output: {
				// Provide global variables to use in the
				// UMD build for externalized deps
				globals: {
					vue: 'vue'
				}
			}
		}
	}
})