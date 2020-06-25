import { h, inject, reactive, defineComponent } from 'vue'
import { popKey } from '../'
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

	setup(props, { attrs }) {

		// Get pop instance
		const pop = inject(popKey)

		// Reactive data
		let data = reactive({})

		// New render function
		return () => {

			// Get top
			const top = pop.top(props.name || 'default')
			if (!top) return null

			// Merge props
			data = Object.assign(data, attrs, top.props)
			
			// Attach events
			for (let key in (top.on || {}))
			{
				let name = 'on' + key[0].toUpperCase() + key.slice(1)
				data[name] = top.on[key]
			}

			// Register close event with default behaviour
			if (!('onClose' in data)) data.onClose = () => pop.pop(props.name)

			if ('comp' in top)
			{
				// Draw provided component
				return h(top.comp, data)
			}
			else
			{
				// Draw wrapper
				return h(Wrapper, data)
			}
		}
	}
})