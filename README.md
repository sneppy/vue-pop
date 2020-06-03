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

```console
pop@vue:~$ npm i @sneppy/vue-pop
```

In your entry point file, import the plugin and tell Vue to setup it up:

```javascript
import { createApp } from 'vue'
import App from './App'
import Pop from '@sneppy/pop'

export const pop = new Pop

createApp(App).use(pop).mount('#app')
```

Place a `pop-view` in any top-level component, e.g. `App.vue`:

```vue
<template>
	<div class="app">
		<!-- ... -->
		<transition name="fade-up">
			<pop-view/>
		</transition>
	</div>
</template>
```

Now you can import it and use `pop.push` inside any component to push a new component on the stack:

```vue
<script>
import { onMounted } from 'vue'
import { pop } from '@/main'

export default {
	name: 'app',

	setup() {
		
		onMounted(() => pop.push({ comp: () => import('@/components/PopUpWindow) }))
	}
}
</script>
```

Notif
-----

To get an immediate feeling of the plugin, it may be easier to use the `Notif` utility, a simple wrapper around `vue-pop` that allows you to show simple text notifications.

First of all, create a new instance of notif:

```javascript
import Vue from 'vue'
import Pop from '@sneppy/pop'

export const pop = new Pop
export const nofif = new Notif(Pop)
```

Notif also needs its very own `pop-view`:

```vue
<template>
	<div class="app">
		<!-- ... -->
		<transition name="fade-up">
			<pop-view name="notif">
		</transition>
	</div>
</template>
```

Then inside any component:

```javascript
notif.push('Hello world!')
```

It is possible to specify the type of the notification and a duration time (default to 2 seconds):

```javascript
notif.push('Failure!', 'error', 5000) // in milliseconds
```

The duration can be a falsy value (e.g. `null`, `false`, `undefined`) in which case the notification is shown until the an explicit call to `Notif.pop` is made.

Notif has a few built-in notification types:

- `'done'`;
- `'error`';
- `'warn'`;
- `'log'`;

in which case you can use the omonymous methods, `Notif.done`, `Notif.error`, `Notif.warn` and `Notif.log` respectively.

The top notification can be explicitly closed using `Notif.pop`:

```javascript
notif.pop() // Pops current notification, if any
```

It is possible to change the position of the notifications from the `pop-view`:

```vue
<pop-view name="notif" position="top right">
```

Any combination of `fill|left|center|right` and `top|middle|bottom` is valid (e.g. `fill bottom`, `center middle`, `left top`).

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
		<!-- ... -->
		<pop-view/> <!-- name="default" -->
		<pop-view name="foo">
		<pop-view name="bar">
		<pop-view name="notif">
	</div>
</template>
```

The component you push onto the stack is not wrapped inside any kind of container, so you need to write a lot of style to make it look like an actual popup (e.g. fill screen, blur background, center in screen).

While it is extremely flexible, it is also tedious, in particular if you need to write many different components. Fortunately the plugin comes with a wrapper that kicks in if the `comp` property is not specified. The wrapper accepts the component as a prop:

```javascript
pop.push({
	props: {
		comp: () => import('@/components/Window'),
		// Other props ...
	}
})
```

`Pop.pop` is used to close the current popup:

```javascript
pop.pop()
pop.pop('temp')
pop.pop('notif') // Same as notif.pop()
```

`Pop.replace` works like `Pop.push` but replaces the current component with the given one.

```javascript
pop.replace({comp})
```

It is possible to wrap a `pop-view` inside a `transition` in order to control the pop-animation:

```html
<transition name="fade">
	<pop-view>
</transition>

<transition name="up">
	<pop-view name="notif">
</transition>
```

Demo
----

WIP