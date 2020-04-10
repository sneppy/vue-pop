export default {
	name: 'pop-wrapper',
	
	/// Functional component
	functional: true,

	/**
	 * Vue render function
	 */
	render(h, ref) {

		// Use parent render function
		const parent = ref.parent
		h = parent.$createElement

		// Get pop reference
		const pop = parent.$pop
		
		// Get props
		const props = ref.props

		// Incoming data
		const data = ref.data

		// Click handler
		const click = (data.on['close'] || (() => pop.pop(props.name)))

		return h('div', {class: 'pop-wrapper'}, [
			h('div', {class: 'pop-overlay', on: {click}}),
			h(props.comp, {...data, class: 'pop-content'})
		])
	}
}