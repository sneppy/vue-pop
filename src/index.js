import Vue from 'vue'
import View from './components/view'
import Notification from './components/Notification'

/**
 * Notification class, depends on @class Pop
 */
export class Notif
{
	/// Pop instance
	pop = null

	/**
	 * Default constructor
	 * 
	 * @param {Pop} pop pop instance
	 */
	constructor(pop)
	{
		this.pop = pop
		this.pop.initView('notif')
	}

	/**
	 * Push notification
	 * 
	 * @param {String|Error} message string or error message
	 * @param {String} level level of notification (e.g. 'error', 'log', 'warn')
	 * @param {Number} timeout notification time to live (ms)
	 */
	push(message, level, timeout = 2000)
	{
		this.pop && this.pop.push({
			comp: Notification,
			props: {message, level},
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
 * TODO: documentation
 */
export class Pop
{
	// Pop instances
	views = {}

	/**
	 * Default constructor
	 */
	constructor(names = [])
	{
		// Create views
		['default', ...names].forEach((name) => this.views[name] = {stack: []})
	}

	/**
	 * Get or create view
	 */
	_getView(name = 'default')
	{
		// Default name
		name = name || 'default'

		// Create view if it does not exists
		let view = this.views[name]
		if (view === undefined)
		{
			Vue.set(this.views, name, {stack: []})
			view = this.views[name]
		}

		return view
	}

	/**
	 * Setup timer for popup if timeout
	 * property is specified
	 */
	_maybeSetupTimer(popup, name)
	{
		if (popup && popup.timeout)
		{
			// Set timer
			popup.t0 = performance.now()
			popup.timer = setTimeout(() => this.pop(name), popup.timeout)

			return true
		}
		else return false
	}

	/**
	 * Pause popup timer, if any
	 */
	_maybePauseTimer(popup)
	{
		if (popup && popup.timer)
		{
			clearTimeout(popup.timer)
			popup.timer = null
			popup.timeout = performance.now() - popup.t0

			return true
		}
		else return false
	}

	/**
	 * Clear timer for popup if timer
	 * exists
	 */
	_maybeClearTimer(popup)
	{
		if (popup && popup.timer)
		{
			clearTimeout(popup.timer)
			delete popup.timer
			delete popup.timeout

			return true
		}
		else return false
	}

	/**
	 * Programmatically add a named pop-view
	 * 
	 * @param {String} name view name
	 */
	initView(name)
	{
		// In the end this is just like
		// asking for the view
		this._getView(name)
	}

	/**
	 * 
	 */
	releaseView(name)
	{
		let view = this.views[name]
		if (view !== undefined) delete this.views[name]
	}

	/**
	 * Returns a copy of the top of the stack
	 */
	top(name = 'default')
	{
		const view = this._getView(name)
		const len = view.stack.length
		return len ? view.stack[len - 1] : null
	}

	/**
	 * Push new popup on stack
	 */
	push(popup, name = 'default')
	{
		const view = this._getView(name)
		
		// TODO: pending and priorities
		const len = view.stack.length
		if (len)
		{
			// Get currently displayed component
			const top = view.stack[len]
			this._maybePauseTimer(top)
		}

		// If popup specifies a timeout,
		// create and start a timer
		this._maybeSetupTimer(popup, name)

		// Add to stack
		view.stack.push(popup)

		return true
	}

	/**
	 * Replace topmost popup with new popup
	 */
	replace(popup, name = 'default')
	{
		const view = this._getView(name)
		
		// Replace topmost popup
		const len = view.stack.length
		if (len)
		{
			// ? Better to pop the component
			// ? or actually replace it?
			// * Here we replace it

			// Clear existing timer
			const top = view.stack[len - 1]
			this._maybeClearTimer(top)

			// Replace head
			view.stack[len - 1] = popup
		}
		// Push onto stack
		else view.stack.push(popup)

		// If popup specifies a timeout,
		// create and start a timer
		this._maybeSetupTimer(popup, name)
	}

	/**
	 * Replace stack with single element stack
	 */
	replaceAll(popup, name = 'default')
	{
		const view = this._getView(name)

		// Clear stack
		for (let top = view.stack.pop(); top; top = view.stack.pop())
			this._maybeClearTimer(top)
		
		// Setup timer if necessary
		this._maybeSetupTimer(popup, name)

		// Push popup
		view.stack.push(popup)
	}

	/**
	 * Remove topmost popup from stack
	 */
	pop(name = 'default')
	{
		const view = this._getView(name)

		// Pop from stack
		let top = view.stack.pop()
		this._maybeClearTimer(top)

		// If necessary set timeout for next popup
		const len = view.stack.length
		this._maybeSetupTimer(view.stack[len - 1], name)

		// TODO: if stack is empty, check pending
	}

	/**
	 * Clear stack
	 */
	clear(name = 'default')
	{
		const view = this._getView(name)

		// Clear stack
		for (let top = view.stack.pop(); top; top = view.stack.pop())
			this._maybeClearTimer(top)
	}

	/**
	 * Vue plugin install script
	 */
	static install(Vue, options)
	{
		if (this.bInstalled)
			// Don't install twice
			return
		
		this.bInstalled = true;

		// Process options
		const bHasOptions = options !== undefined
		if (!bHasOptions) options = Object.create(null)
		
		/**
		 * I kinda looked up this technique
		 * from vue router
		 */
		Vue.mixin({
			/**
			 * Called before component creation
			 */
			beforeCreate() {

				if (this.$options.pop !== undefined)
				{
					this._popRoot = this
					Vue.util.defineReactive(this, '_pop', this.$options.pop)
				}
				else
					this._popRoot = (this.$parent && this.$parent._popRoot) || this
			}
		})

		Object.defineProperty(Vue.prototype, '$pop', {
			get() {

				return this._popRoot._pop
			}
		})

		if (options.withNotif)
		{

			// Install notif object
			Object.defineProperty(Vue.prototype, '$notif', {
				get() {

					// Create new Notif object
					const pop = this._popRoot._pop
					return new Notif(pop)
				}
			})
		}

		Vue.component('pop-view', View)
	}
}

export default Pop
