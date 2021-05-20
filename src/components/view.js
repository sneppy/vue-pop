import { h, inject, reactive } from 'vue'
import { popKey } from '../'
import Wrapper from './wrapper'

export default {

	functional: true,
	props: {
		name: {
			type: String,
			default: 'default'
		}
	},

	/** Called before component is mounted */
	setup(props, { attrs }) {

		// Get pop instance
		const pop = inject(popKey)

		// Reactive data
		let data = reactive({})

		// Render function
		return () => {

			// Get top
			const top = pop.top(props.name || 'default')
			if (!top) return null

			// Merge props
			data = Object.assign(data, attrs, top.props, {
				'view-name': props.name
			})
			
			// Attach events
			for (let key in (top.on || {}))
			{
				let name = 'on' + key[0].toUpperCase() + key.slice(1)
				data[name] = (...args) => {
					
					// Apply method
					if (top.on[key](...args) === true)
					{
						// Close if handler returns true
						pop.pop(props.name || 'default')
					}
				}
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
}