<template lang="pug">
div(class="notif-component")
	div(class="notif-message" :class="[type, pos].join(' ')") {{ message }}
</template>

<script>
import { computed } from 'vue'

export default {
	name: 'NotifComponent',
	props: {
		message: {
			type: [String, Error],
			required: true
		},
		type: {
			type: String,
			default: 'info'
		},
		pos: {
			type: String,
			default: 'fill top'
		}
	},
	setup(props) {

		/* The verbosity of the notification */
		let type = computed(() => 'type-' + props.type)

		/* The computed position of the notification */
		let pos = computed(() => props.pos.split(' ').map((pos) => 'pos-' + pos).join(' '))

		return { type, pos }
	}
}
</script>
