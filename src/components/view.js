import {
	h,
	inject,
	reactive,
	defineComponent
} from 'vue'
import {popKey} from '../'
import Wrapper from './wrapper'

export default defineComponent({
	name: 'PopView',

	functional: true,
	
	props: {
		name: {
			type: String,
			default: 'default'
		}
	},

	setup(props, {attrs}) {

		// Get pop instance
		const pop = inject(popKey)

		// Reactive data
		let data = reactive({})

		// New render function
		return () => {

			// Get top
			const top = pop.top(props.name || 'default')
			if (!top) return null
			console.log(top)

			// Merge props
			data = Object.assign(data, props, top.props)

			if ('comp' in top)
				// Draw provided component
				return h(top.comp, data)
			else
				// Draw wrapper
				return h(Wrapper, data)
		}
	}
})