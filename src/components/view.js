import Wrapper from './wrapper'

export default {
	name: 'pop-view',
	
	/// Functional component
	functional: true,

	/**
	 * Vue render function
	 */
	render(h, ref) {

		// Use parent render function
		const parent = ref.parent
		h = parent.$createElement
		
		// Get props
		const props = ref.props

		// Get reference to pop
		const pop = parent.$options.pop || parent.$pop
		const top = pop.top(props.name)

		// Nothing to draw
		if (!top) return h()

		// Incoming data
		const data = ref.data

		// Add props
		data.props = {...(props || {}), ...(data.props || {}), ...(top.props || {})}

		// Add event listeners
		data.on = {...(data.on || {}), ...(top.on || {})}

		// Draw component or wrapper
		return h(top.comp || Wrapper, data)
	}
}