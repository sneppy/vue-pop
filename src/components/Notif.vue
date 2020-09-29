<template>
	<div class="pop-notif">
		<div class="message"
			:class="[type, position].join(' ')">{{ message }}</div>
	</div>
</template>

<script>
import { computed } from 'vue'

export default {
	name: 'PopNotif',

	props: {
		/// Message displayed or error
		message: {
			type: [String, Error],
			required: true
		},

		/// Notification type
		type: {
			type: String,
			default: 'info'
		},

		/// Position of the notification
		position: {
			type: String,
			default: 'fill top'
		}
	},

	setup(props) {
		
		// Notification type
		let type = computed(() => 'type-' + props.type)

		// Notification position
		let position = computed(() => props.position.split(' ').map((pos) => 'pos-' + pos).join(' '))

		return {type, position}
	}
}
</script>