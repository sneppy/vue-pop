import vue from 'rollup-plugin-vue'
import postcss from 'rollup-plugin-postcss'

import pkg from './package.json'

export default {
	input: pkg.input,
	plugins: [
		postcss({
			minimize: true,
			extract: true
		}),
		vue()
	],
	external: [
		'vue'
	],
	output: [{
		file: pkg.module,
		format: 'es'
	}, {
		file: pkg.main,
		format: 'umd',
		name: 'VueMenu',
		sourcemap: true,
		globals: {
			'vue': 'Vue'
		}
	}]
}
