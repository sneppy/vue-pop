# vue-pop

**vue-pop** is a Vue plugin that makes managing pop-ups and notifications a breeze.

> This branch hosts a version of vue-pop compatible with [Vue 3](https://github.com/vue/vue-next)
> 
> If you are using Vue 2 you should install the older release, `@sneppy/vue-pop@0.1.5`

Contributors
------------

- Sneppy @ [sneppy](https://github.com/sneppy)
- Me @ [sneppy](https://github.com/sneppy)
- Myself @ [sneppy](https://github.com/sneppy)

Installation
------------

_vue-pop_ can be installed via npm:

```console
$ npm i -S @sneppy/vue-pop
```

Basic usage
-----------

Create a new instance of `Pop` and tell Vue to use it:

```javascript
import { createApp } from 'vue';
import Pop from './'
import App from './App.vue'

export let pop = new Pop

createApp(App)
	.use(pop)
	.mount('#app')

```

Place a `<pop-view/>` somewhere:

```html
<template>
	<div id="App">
		<router-view/>
		<pop-view/>
	</div>
</template>
```

Next, import the `Pop` instance in some component, and use `Pop.push()` to push a popup window on the stack:

```javascript
import { pop } from '@/main'

export default {
	name: 'SomeComp',

	setup() {

		const onClick = () => pop.push({
			comp: /* Component or async component */
		})
	}
}
```

You can pop the topmost popup anytime using `Pop.pop()`.

Props can be passed down to the popup component like this:

```javascript
pop.push({
	comp: Message,
	props: {
		title: 'Message title',
		text: 'Message text'
	}
})
```

You may also listen for events emitted by the component:

```javascript
pop.push({
	comp: ConfirmDialog,
	props: {
		message: 'Are you sure you want to exit'
	},
	on: {
		'confirm': () => doStuff(),
		'cancel': () => pop.pop() // Close popup
	}
})
```

Note that the popup component is rendered as-is, which means that usually you will have to write some more HTML and CSS to make it look like an actual component.

_vue-pop_ comes with a predefined wrapper, which you can enable by passing the component as a prop:

```javascript
pop.push({
	props: {
		comp: ConfirmDialog,
		message: 'Are you sure you want to exit'
	},
	on: {
		'confirm': () => doStuff(),
		'cancel': () => pop.pop() // Close popup
	}
})
```

The wrapper component generates the following HTML:

```html
<div class="pop-wrapper">
	<div class="pop-overlay"></div>
	<div class="pop-content">
		<Component/>
	</div>
</div>
```

You can style the wrapper using these classes.

Notifications
-------------

_vue-pop_ also has an easy way to handle simple notifications. To enable notifications, create a new `Notif` instance right after creating the `Pop` instance:

```javascript
let pop = new Pop
let notif = new Notif(pop)
```

You will also need to create a dedicated view somewhere:

```html

<template>
	<div id="App">
		<router-view/>
		<pop-view/>
		<pop-view name="notif"/>
	</div>
</template>
```

The `name` attribute designate that view as the notification view.

The notif object has various methods that determine the type of notification:

| method | type |
| ------ | ---- |
| `log` or `info` | log message |
| `done` or `doneall` | success message |
| `warn` | warning message |
| `error` | error message |

All methods are invoked with a plain string message as first parameter and a time duration (ms) as second parameter:

```javascript
notif.done('Personal data updated', 3000)
```

The time duration may be `undefined`, in which case you will need to manually pop the notification with `Notif.pop()`.

By default, notifications are displayed in a bar that fills the top of the screen. You can change the position of notifications with the attribute `position` on the notif `<pop-view/>`:

```html
<pop-view name="notif" position="right bottom"/>
```

Any combination of the following keywords is accepted: `left`, `center`, `right`, `fill` and `top`, `middle`, `bottom`.

> Note that you will also need to import the styles in `src/style`.

Multiple views
--------------

You can define multiple views, usually with different names. In order to address a certain view, you must provide its name in `Pop.push()` and `Pop.pop()`:

```html
<pop-view name="messages"/>
<pop-view name="other"/>
```

```javascript
pop.push({
	comp: SomeComp
}, 'messages')

pop.pop('other')
```

The name is also passed as an attribute `view-name` and can be use to style the wrapper component of that view:

```css
.pop-wrapper[view-name=messages] {
	...
}
```
