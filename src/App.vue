<template>
	<div class="app">
		<transition name="fade-up">
			<pop-view name="notif"/>
		</transition>
	</div>
</template>

<script>
export default {
	name: 'app',

	created() {

		console.log(this.$pop)
		this.$notif.done('hello')
	}
}
</script>

<style lang="stylus" scoped>
@keyframes fade-out
	0%
		opacity: 0
		transform: scale(1.1)
	100%
		opacity: 1
		transform: none

.fade-out-enter-active
	animation: fade-out .2s
.fade-out-leave-active
	animation: fade-out .2s reverse

@keyframes fade-up
	0%
		opacity: 0
		transform: translateY(-8px)
	100%
		opacity: 1
		transform: none

.fade-up-enter-active
	animation: fade-up .2s
.fade-up-leave-active
	animation: fade-up .2s reverse
</style>