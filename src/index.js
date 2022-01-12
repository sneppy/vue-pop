import { reactive, markRaw } from 'vue'

import PopView, { mainViewSym, popKey } from './view'
import NotifComponent from './Notif.vue'
import '../style/less/index.less'

/* Symbol used to identify pending timer. */
const pendingTimerSym = Symbol('__vue_pop_pending_timer')

/**
 * An helper class to handle simple
 * notifications, based on Pop.
 */
export class Notif
{
	/**
	 * Construct a new Notif object
	 *
	 * @param {Pop} pop the Pop instance used
	 */
	constructor(pop)
	{
		/* The Pop instance bound to this Notif */
		this._pop = pop

		// Init Notif view
		this._pop._getView('notif')
	}

	/**
	 * Push a new notification
	 *
	 * @param {string|Error} message a string or Error to display
	 * @param {string} type the type of message to display
	 * @param {number|null} timeout the duration of the message (in milliseconds) or null
	 */
	push(message, type, timeout = 2000)
	{
		if (!this._pop)
		{
			console.warn('VuePop: Notif instance has invalid Pop instance')
			return
		}

		this._pop.push({
			comp: markRaw(NotifComponent),
			props: {message, type},
			timeout
		}, 'notif')
	}

	/**
	 * Remove the last pushed notification
	 */
	pop()
	{
		this._pop.pop('notif')
	}

	/**
	 * Push an error notification
	 *
	 * @see push
	 */
	error(message, timeout = 2000)
	{
		this.push(message, 'error', timeout)
	}

	/**
	 * Push a done notification
	 *
	 * @see push
	 */
	done(message, timeout = 2000)
	{
		this.push(message, 'done', timeout)
	}

	/**
	 * Push a warning notification
	 *
	 * @see push
	 */
	warn(message, timeout = 2000)
	{
		this.push(message, 'warn', timeout)
	}

	/**
	 * Push a log notification
	 *
	 * @see push
	 */
	log(message, timeout = 2000)
	{
		this.push(message, 'log', timeout)
	}
}

/**
 * A class to handle notifications, pop-ups
 * and more in Vue 3
 */
export class Pop
{
	/**
	 * Returns existing view or creates a new one
	 *
	 * @param {string} name the name of the view
	 */
	_getView(name)
	{
		// Return existing or create it
		this._views[name] = this._views[name] || reactive([])
		return this._views[name]
	}

	/**
	 * If a timeout is specified, setup a
	 * timer at the end of which we close
	 * the popup.
	 *
	 * @param {Object} popup the popup spec object
	 * @param {string} name the name of the view
	 * @return {boolean} true if a timer was setup
	 */
	_maybeSetupTimer(popup, name)
	{
		if (popup && popup.timeout)
		{
			// Start timer
			let start = performance.now()
			let id = setTimeout(() => this.pop(name), popup.timeout)
			popup[pendingTimerSym] = {id, start}
			return true
		}

		return false
	}

	/**
	 * Attempt to pause a popup timeout
	 *
	 * @param {Object} popup the popup spec object
	 * @return {boolean} true if a timer was paused
	 */
	_maybePauseTimer(popup)
	{
		if (popup && popup[pendingTimerSym])
		{
			// Clear timer and set new timeout
			let timer = popup[pendingTimerSym]
			clearTimeout(timer.id)
			popup.timeout -= performance.now() - timer.start
			delete popup[pendingTimerSym]
			return true
		}

		return false
	}

	/**
	 * Attempt to clear a popup timeout
	 *
	 * @see _maybeSetupTimer
	 */
	_maybeClearTimer(popup)
	{
		if (popup && popup[pendingTimerSym])
		{
			// Delete timer
			clearTimeout(popup[pendingTimerSym].id)
			delete popup[pendingTimerSym]
			return true
		}

		return false
	}

	/**
	 * Construct a new Pop instance with the
	 * default view
	 */
	constructor()
	{
		/* The map of views. */
		this._views = {}

		// Init default view
		this._getView('default')
	}

	/**
	 * Returns the top popup of the stack
	 *
	 * @param {string} name the name of the view
	 * @return {Object}
	 */
	top(name = mainViewSym)
	{
		let view = this._getView(name)
		return view[view.length - 1] || null
	}

	/**
	 * Push a new popup onto the stack
	 *
	 * @param {Object} popup the popup spec object
	 * @param {string} name the name of the view to use
	 */
	push(popup, name = mainViewSym)
	{
		let view = this._getView(name)

		if (view.length)
		{
			// Pause timer of top component
			let top = view[view.length - 1]
			this._maybePauseTimer(top)
		}

		// If popup specifies a timeout setup and start a timer
		this._maybeSetupTimer(popup, name)

		view.push(popup)
	}

	/**
	 * Pop the topmost pop-up of the view.
	 */
	pop(name = 'default')
	{
		let view = this._getView(name)

		// Remove from stack and clear timer
		let top = view.pop()
		this._maybeClearTimer(top)

		// Reset timeout for next popup
		if (view.length)
		{
			let next = view[view.length - 1]
			this._maybeSetupTimer(next, name)
		}
	}

	/**
	 * Call to install the plugin with the Vue app.
	 */
	install(app, options)
	{
		// Register view component
		app.component(PopView.name, PopView)

		// Provide this instance
		app.provide(popKey, this)
	}
}
