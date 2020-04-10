<template>
	<div class="pop-notif">
		<div class="content" :class="`level-${level} pos-${pos[0] || 'fill'} pos-${pos[1] || 'top'}`">{{ message }}</div>
	</div>
</template>

<script>
export default {
	name: 'pop-notif',

	props: {
		message: {
			type: String | Error,
			required: true,
		},

		level: {
			type: String,
			default: 'error'
		},

		position: {
			type: String,
			default: 'fill top'
		}
	},

	computed: {
		/**
		 * Computed position string
		 */
		pos() {

			return this.position.split(/[ ,;:\.-_]/)
		}
	}
}
</script>