import { reactive, markRaw } from 'vue'
import PopView from './components/view'
import PopNotif from './components/Notif.vue'


/** Symbol used to inject the pop instance */
export const popKey = Symbol('pop')

/**
 * An helper class to handle simple
 * notifications, based on Pop
 */
export class Notif
{
	/** Pop instance used by this Notif instance */
	pop = null

	/**
	 * Construct a new Notif object
	 * 
	 * @param {Pop} pop the Pop instance used
	 */
	constructor(pop)
	{
		/** The Pop instance bound to this Notif */
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
		this._pop && this._pop.push({
			comp: PopNotif,
			props: { message, type },
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
	/// Views
	views = {}

	/**
	 * Returns existing view or creates a new one
	 * 
	 * @param {string} name the name of the view
	 */
	_getView(name = 'default')
	{
		if (name in this.views) return this.views[name]
		else return (this.views[name] = reactive([])) // Make it reactive
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
	_maybeSetupTimer(popup, name = 'default')
	{
		if (popup && popup.timeout)
		{
			// Set timer
			popup.start = performance.now()
			popup.timer = setTimeout(() => this.pop(name), popup.timeout)

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
		if (popup && popup.timer)
		{
			clearTimeout(popup.timer)
			popup.timer = null
			popup.timeout -= performance.now() - popup.start

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
		if (popup && popup.timer)
		{
			// Delete timer
			clearTimeout(popup.timer)
			delete popup.timer
			delete popup.timeout

			return true
		}

		return false
	}

	/**
	 * Tell vue to skip the popup component
	 * when reacting to changes
	 * 
	 * @param {Object} popup the popup spec object
	 */
	_markRaw(popup)
	{
		if ('comp' in popup)
		{
			popup.comp = markRaw(popup.comp)
		}
		else if (popup.props && 'comp' in popup.props)
		{
			popup.props.comp = markRaw(popup.props.comp)
		}
	}

	/**
	 * Construct a new Pop instance with the
	 * default view
	 */
	constructor()
	{
		// Init default view
		this._getView('default')
	}

	/**
	 * Returns the top popup of the stack
	 * 
	 * @param {string} name the name of the view
	 * @return {Object}
	 */
	top(name = 'default')
	{
		let view = this._getView(name)
		let len = view.length
		return len ? view[len - 1] : null
	}

	/**
	 * Push a new popup onto the stack
	 * 
	 * @param {Object} popup the popup spec object
	 * @param {string} name the name of the view to use
	 */
	push(popup, name = 'default')
	{
		let view = this._getView(name)
		let size = view.length

		// Mark raw component
		this._markRaw(popup)

		if (size !== 0)
		{
			// Pause timer of top component
			let top = view[size - 1]
			this._maybePauseTimer(top)
		}

		// If popup specifies a timeout
		// setup and start a timer
		this._maybeSetupTimer(popup, name)

		view.push(popup)
	}

	/**
	 * 
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
	 * 
	 */
	install(app, options)
	{
		// Register view component
		app.component('pop-view', PopView)

		app.provide(popKey, this)
	}
}
