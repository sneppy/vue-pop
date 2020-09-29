<template>
	<div id="App">
		<button @click="onClick">Show</button>
		<button @click="onNotif">Notif</button>
		<pop-view name="adventure"></pop-view>
		<pop-view name="notif" position="left bottom"></pop-view>
	</div>
</template>

<script>
import { defineComponent, h } from 'vue'
import { pop, notif } from './main'

export default {
	name: 'App',

	setup() {

		const popupWindow = defineComponent({
			name: 'PopupWindow',

			props: {
				message: {
					type: String,
					required: true
				}
			},

			setup(props, { emit }) {

				let onClick = () => emit('event-two')
				
				return () => {

					return h('div', { class: 'popup-window', onClick }, [
						h('div', { class: 'message' }, props.message)
					])
				}
			}
		})

		const onClick = () => pop.push({
			props: {
				comp: popupWindow,
				message: 'Hello, world!'
			},
			on: {
				'event-two': () => console.log('clicked')
			}
		}, 'adventure')

		const onNotif = () => notif.done('All done here')

		return { onClick, onNotif }
	}
}
</script>