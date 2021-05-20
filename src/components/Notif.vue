<template>
	<div class="pop-notif">
		<div class="message" :class="[type, position].join(' ')">{{ message }}</div>
	</div>
</template>

<script>
import { computed } from 'vue'

export default {
	props: {
		/** Message displayed or error */
		message: {
			type: [String, Error],
			required: true
		},

		/** Notification type */
		type: {
			type: String,
			default: 'info'
		},

		/** Position of the notification */
		position: {
			type: String,
			default: 'fill top'
		}
	},

	setup(props) {
		
		/** Type of the notification */
		let type = computed(() => 'type-' + props.type)

		/** The computed position of the notification */
		let position = computed(() => props.position.split(' ').map((pos) => 'pos-' + pos).join(' '))

		return { type, position }
	}
}
</script>
