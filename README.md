# Pop

> A Vue plugin that makes managing pop-ups and notifications a breeze

Contributors
------------

- Sneppy @ [sneppy](https://github.com/sneppy)
- Me @ [sneppy](https://github.com/sneppy)
- Myself @ [sneppy](https://github.com/sneppy)

Basic usage
-----------

Install the plugin:

```bash
$ npm i @sneppy/vue-pop
```

In your entry point file, import the plugin and tell Vue to setup it up:

```javascript
import Vue from 'vue'
import Pop from '@sneppy/pop'

Vue.use(Pop)
```

Just like `vue-router`, you need to define an instance of `Pop` on the root component:

```javascript
new Vue({
	pop: new Pop,
	// ...
	render: h => h(App)
}).$mount('#app')
```

Finally, place a `pop-view` in any top-level component, e.g. `App.vue`:

```vue
<template>
	<div class="app">
		<transition name="fade-up">
			<!-- ... -->
			<pop-view/>
		</transition>
	</div>
</template>
```

Now you can use `this.$pop.push` inside any component to push a new component on the stack:

```vue
<script>
export default {
	name: 'app',

	created() {
		
		this.$pop.push({
			comp: () => import('@/components/PopUpWindow)
		})
	}
}
</script>
```

Notif
-----

To get an immediate feeling of the plugin, it may be easier to use the `Notif` utility, a simple wrapper around `vue-pop` that allows you to show simple text notifications.

First of all, you need to pass `withNotif: true` in the plugin options in order to have access to the Vue property `this.$notif`:

```javascript
import Vue from 'vue'
import Pop from '@sneppy/pop'

Vue.use(Pop, {withNotif: true})
```

Notif also needs its very own `pop-view`:

```vue
<template>
	<div class="app">
		<transition name="fade-up">
			<!-- ... -->
			<pop-view/>
			<pop-view name="notif">
		</transition>
	</div>
</template>
```

Then inside any component:

```javascript
this.$notif.push('Hello world!')
```

It is possible to specify the type of the notification and a duration time (default to 2 seconds):

```javascript
this.$notif.push('Failure!', 'error', 5000) // in milliseconds
```

The duration can a falsy value (e.g. `null`, `false`, `undefined`) in which case the notification is shown until the an explicit call to `Notif.pop` is made.

Notif has a few built-in notification types:

- `'done'`;
- `'error`';
- `'warn'`;
- `'log'`;

in which case you can use the omonymous methods, `Notif.done`, `Notif.error`, `Notif.warn` and `Notif.log` respectively.

The top notification can be explicitly closed using `Notif.pop`:

```javascript
this.$notif.pop() // Pops current notification, if any
```

Advanced usage
--------------

`Pop.push` is used to push a new component onto the stack. The first argument is an object with the following properties:

| prop | description | example |
| - | - | - |
| `comp` | A Vue component, may be async. | `comp: () => import('@/components/Notification')` |
| `props` | Props data passed to the component | `props: {title: 'Notif', text: 'This is a notification'}` |
| `on` | Vue event listeners | `on: {'click': () => console.log('clicked')}` |
| `timeout` | A duration (in ms) after which the component is popped | `timeout: 3000` |

The second argument is the name of the view, which defaults to `'default'`. The plugin supports multiple named views, making it possible to display multiple components simultaneously. Each view needs a corresponding `pop-view`:

```vue
<template>
	<div class="app">
		<transition name="fade-up">
			<!-- ... -->
			<pop-view/> <!-- name="default" -->
			<pop-view name="foo">
			<pop-view name="bar">
			<pop-view name="notif">
		</transition>
	</div>
</template>
```

Each view must be initialized by calling `Pop.initView` or by passing an array of strings to the constructor:

```javascript
new Vue({
	pop: new Pop(['foo', 'bar']),
	// ...
	render: h => h(App)
}).$mount('#app')

// Or inside a component
{
	// ...

	beforeCreate() {

		this.$pop.initView('temp')
	},

	created() {

		this.$pop.push({comp}, 'temp') // Push on temp stack
	}

	destroyed() {

		// Called to destroy the view stack
		this.$pop.releaseView('temp')
	}
}
```

The component you push onto the stack is not wrapped inside any kind of container, so you need to write a lot of style to make it look like an actual popup (e.g. fill screen, blur background, center in screen).

While it is extremely flexible, it is also tedious, in particular if you need to write many different components. Fortunately the plugin comes with a wrapper that kicks in if the `comp` property is not specified. The wrapper accepts the component as a prop:

```javascript
this.$pop.push({props: {comp: () => import('@/components/Window')}})
```