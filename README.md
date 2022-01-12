# vue-pop

[![npm version](https://badge.fury.io/js/@sneppy%2Fvue-pop.svg)](https://www.npmjs.com/package/@sneppy/vue-pop)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build](https://github.com/sneppy/vue-pop/actions/workflows/build.yml/badge.svg)](https://github.com/sneppy/vue-pop/actions/workflows/build.yml)


**vue-pop** is a plugin for Vue 3 to manage pop-ups and notifications.

![demo](https://i.imgur.com/gRfHqVJ.gif)

Installation
------------

You can install _vue-pop_ with npm:

```console
$ npm i -S @sneppy/vue-pop
```

Basic usage
-----------

Create a new instance of `Pop` and install it with the Vue app:

```javascript
import { createApp } from 'vue';
import { Pop } from '@sneppy/vue-pop'

import App from './App.vue'

export let pop = new Pop()

createApp(App)
	.use(pop)
	.mount('#app')

```

Place `<pop-view/>` somewhere in the DOM tree. That's where the pop-ups will be spawned:

```html
<template>
	<div id="App">
		<router-view/>
		<pop-view/>
	</div>
</template>
```

Next, import the `Pop` instance where needed and use `Pop.push()` to push a popup window on the stack:

```javascript
import { pop } from '@/main'
import SomePopUpComponent from './SomePopUpComponent.vue'

export default {
	setup() {

		const onClick = () => pop.push({
			comp: markRaw(SomePopUpComponent)
		})
	}
}
```

> Starting with `vue-pop@3.1.0` you need to explicitly mark the component as non-reactive with `markRaw()`

You can close the topmost pop-up anytime using `Pop.pop()`.

Props can be passed down to the pop-up component like this:

```javascript
pop.push({
	comp: markRaw(SomePopUpComponent),
	props: {
		title: 'Message title',
		text: 'Message text'
	}
})
```

You may also listen for events emitted by the pop-up component:

```javascript
pop.push({
	comp: markRaw(ConfirmDialogComponent),
	props: {
		message: 'Are you sure you want to exit',
		onConfirm: () => submit(),
		onCancel: () => pop.pop()
	}
})
```

> See the [_v-on_ paragraph](https://v3.vuejs.org/guide/render-function.html#replacing-template-features-with-plain-javascript) in Vue 3 documentation

By default, vue-pop will listen for a `'close'` event and close the pop-up.

```javascript
// ConfirmDialogComponent
emit('close') // This will close the pop-up, just like calling pop.pop()
```

vue-pop comes with a built-in wrapper, which is enabled by passing the component as a prop:

```javascript
pop.push({
	props: {
		comp: ConfirmDialog,
		message: 'Are you sure you want to exit'
	},
	// ...
})
```

The wrapper component generates the following tree:

```
div.pop-wrapper
	div.pop-overlay
	div.pop-content
		comp
```

You can also import a built-in style for the wrapper, or provide your own style:

```javascript
import '@sneppy/vue-pop/dist/index.css'
```

Notifications
-------------

vue-pop provides an helper class to handle simple notifications. To enable it, create a new `Notif` instance right after creating the `Pop` instance:

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

The `name="notif"` attribute designate the view as the notification view.

The notif object has various methods that determine the type of notification:

| method | type |
| ------ | ---- |
| `log` or `info` | log message |
| `done` or `doneall` | success message |
| `warn` | warning message |
| `error` | error message |

All methods accept a plain string message and a time duration (in milliseconds):

```javascript
notif.done('User profile updated', 3000)
```

If the time duration is `undefined` the notification will be displayed until `notif.pop()` is called.

By default, notifications are displayed in a bar that fills the top of the screen. You can set the position of notifications using the `pos="(left|center|right|fill) (top|middle|bottom)"` attribute on `<pop-view/>`:

```html
<pop-view name="notif" position="right bottom"/>
```

You will also need to import the built-in stylesheet, or provide your own.

Advanced Usage
--------------

vue-pop can handle multiple views.

Each view is identified by a unique `name` attribute. In order to address a certain view, you must provide its name in `Pop.push()` and `Pop.pop()`:

```html
<pop-view name="messages"/>
<pop-view name="other"/>
```

```javascript
pop.push({
	comp: markRaw(Component)
}, 'messages')

pop.pop('other')
```

> If two or more views share the same name, they will display the same pop-up

The main view has no name.

You can wrap a view in a [transition](https://v3.vuejs.org/guide/transitions-enterleave.html#transitioning-single-elements-components) component to apply enter and leave animations to the pop-up:

```html
<transition name="fade">
	<pop-view/>
</transition>
```

---

Check out other Vue libraries:

- [Stallone](https://www.npmjs.com/package/@sneppy/stallone) is an elegant and intuitive library to create REST API
  clients;
- [vue-menu](https://www.npmjs.com/package/@sneppy/vue-menu) is a Vue 3 plugin to create custom context menus.
