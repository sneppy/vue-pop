import { defineComponent, h, reactive } from 'vue'

// TODO
export default defineComponent({
	name: 'PopWrapper',

	setup(_, { attrs, emit }) {
		
		return () => {

			// Get inner component
			let comp = attrs.comp
			if (!comp) return null

			// Get props
			let props = reactive({})
			for (let key in attrs)
				if (key !== 'comp')
					props[key] = attrs[key]
			
			// Register overlay click
			let onClick = () => emit('close')

			return h('div', { class: 'pop-wrapper' }, [
				h('div', { class: 'pop-overlay', onClick }),
				h('div', { class: 'pop-content' }, [
					h(comp, props)
				])
			])
		}
	}
})