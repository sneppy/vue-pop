import { defineComponent, h, reactive, computed } from 'vue'

// TODO
export default defineComponent({
	name: 'PopWrapper',

	props: {
		comp: {
			type: Object,
			required: true
		},

		/// View name
		'viewName': {
			type: String,
			default: 'default'
		}
	},

	setup(props, { attrs, emit }) {

		// Get component
		let comp = computed(() => props.comp)

		// Get view name
		let name = computed(() => props.viewName)
		
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
})