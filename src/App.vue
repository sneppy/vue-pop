<template>
	<div id="app">
		<button @click="onClick">Show</button>
		<pop-view name="notif" position="fill bottom"></pop-view>
	</div>
</template>

<script>
import {notif} from './main'

export default {
	name: 'App',

	setup() {

		const onClick = () => notif.done('Hello, world!')
		return {onClick}
	}
}
</script>