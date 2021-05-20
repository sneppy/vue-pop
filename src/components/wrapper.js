import { computed, defineComponent, h, reactive } from 'vue'

// TODO
export default {
	props: {
		/** The wrapped component */
		comp: {
			type: Object,
			required: true
		},

		/** The name of the view */
		'viewName': {
			type: String,
			default: 'default'
		}
	},

	/** Called before component is mounted */
	setup(props, { attrs, emit }) {

		// Get component
		let comp = computed(() => props.comp)

		// Get view name
		let name = computed(() => props.viewName)
		
		// Return the render function
		return () => {
			
			// Dont' draw if component is null
			if (!comp.value) return null

			// Get props to pass to component
			let props = reactive({})
			for (let key in attrs) props[key] = attrs[key]
			
			// Register overlay click
			let onClick = () => emit('close')

			console.log(name.value)

			// Draw wrapper
			return h('div', { 'class': 'pop-wrapper', 'view-name': name.value }, [
				h('div', { 'class': 'pop-overlay', onClick }),
				h('div', { 'class': 'pop-content' }, [
					h(comp.value, props)
				])
			])
		}
	}
}