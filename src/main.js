import Vue from 'vue'
import App from './App.vue'
import Pop from './'

import './style/main.styl'

Vue.use(Pop, {withNotif: true})
Vue.config.productionTip = false

new Vue({
	render: h => h(App),
	pop: new Pop
}).$mount('#app')
