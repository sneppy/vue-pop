import { createApp } from 'vue';
import { Pop, Notif } from './'
import App from './App.vue'

import './style/scss/index.scss'

export let pop = new Pop
export let notif = new Notif(pop)

createApp(App)
	.use(pop)
	.mount('#app')
