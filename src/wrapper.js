import { h, reactive } from 'vue'

// TODO
export default {
	name: 'PopWrapperComponent',
	props: {
		comp: {
			type: Object,
			required: true
		}
	},
	/** Called before component is mounted */
	setup(props, { attrs, emit }) {

		// Return the render function
		return () => {

			// Dont' draw if component is null
			if (!comp.value) return null

			// Get data to pass to component
			let data = reactive({})
			for (let key in attrs)
				data[key] = attrs[key]

			// Register overlay click
			let onClick = () => emit('close')

			// Draw wrapper
			return h('div', {class: 'pop-wrapper-component',}, [
				h('div', {class: 'pop-wrapper-overlay', onClick}),
				h('div', {class: 'pop-wrapper-content'}, [
					h(props.comp, data)
				])
			])
		}
	}
}