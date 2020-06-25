import {reactive, markRaw} from 'vue'
import PopView from './components/view'
import PopNotif from './components/Notif'

/// Pop key
export const popKey = Symbol('pop')

/**
 *
 */
class Notif
{
	/// Pop instance
	pop = null

	/**
	 * Default constructor
	 */
	constructor(pop)
	{
		// Init notif view
		this.pop = pop
		this.pop._getView('notif')
	}

	/**
	 * Push notification
	 */
	push(message, type, timeout = 2000)
	{
		this.pop && this.pop.push({
			comp: PopNotif,
			props: {message, type},
			timeout
		}, 'notif')
	}
	
	/**
	 * Pop top notification
	 */
	pop()
	{
		this.pop.pop('notif')
	}
	
	/**
	 * Push error notification
	 */
	error(message, timeout = 2000)
	{
		this.push(message, 'error', timeout)
	}

	/**
	 * Push done notification
	 */
	done(message, timeout = 2000)
	{
		this.push(message, 'done', timeout)
	}

	/**
	 * Push warning notification
	 */
	warn(message, timeout = 2000)
	{
		this.push(message, 'warn', timeout)
	}

	/**
	 * Push log notification
	 */
	log(message, timeout = 2000)
	{
		this.push(message, 'log', timeout)
	}
}

/**
 *
 */
class Pop
{
	/// Views
	views = {}

	/**
	 * Returns existing view or creates a new one
	 */
	_getView(name = 'default')
	{
		if (name in this.views) return this.views[name]
		else return (this.views[name] = reactive([])) // Make it reactive
	}

	/**
	 *
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
	 *
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
	 *
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
	 * 
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
	 * 
	 */
	constructor()
	{
		// Init default view
		this._getView('default')
	}

	/**
	 * Returns top element of the stack
	 */
	top(name = 'default')
	{
		let view = this._getView(name)
		let len = view.length
		return len ? view[len - 1] : null
	}

	/**
	 * 
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

export default Pop
export {Pop, Notif}