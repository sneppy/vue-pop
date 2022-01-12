import { computed, h, inject, reactive } from 'vue'

import PopWrapperComponent from './wrapper'

/* The key used to inject the pop instance. */
export const popKey = Symbol('__vue_pop_key')

/* The key that identifies the main view. */
export const mainViewSym = Symbol('__vue_pop_main_view')

export default {
	name: 'PopView',
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

		// Name of the view
		let name = computed(() => props.name || mainViewSym)

		// Render function
		return () => {

			// Get the topmost popup
			const top = pop.top(name.value)
			if (!top)
				return null

			// Merge props
			data = Object.assign(data, attrs, top.props)

			if (!('onClose' in data))
			{
				// Register close event with default behaviour
				data['onClose'] = () => pop.pop(name.value)
			}

			if ('comp' in top)
			{
				// Draw provided component
				return h(top.comp, data)
			}
			else
			{
				// Draw wrapper
				return h(PopWrapperComponent, data)
			}
		}
	}
}