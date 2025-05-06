
import {dashify} from "../../tools/dashify.js"
import {HTMLElementClasses} from "../element.js"

export type RegistrationOptions = {
	soft: boolean
	upgrade: boolean
}

/**
 * register custom elements (web components) to the dom
 *  - takes an object full of custom html elements, and automatically dashes the names
 *    - eg, `MyCoolElement` is registered as `<my-cool-element></my-cool-element>`
 *  - calls `customElements.define`
 *  - option `soft`
 *    - `false` (default) will throw errors if elements are already defined
 *    - `true` will do nothing if an element is already defined
 *  - option `upgrade`
 *    - `true` (default) will run `customElements.upgrade` where appropriate
 *    - `false` will NOT upgrade any existing elements on the page
 */
export function register<E extends HTMLElementClasses>(
		elements: E,
		options: Partial<RegistrationOptions> = {},
	) {

	const {
		soft = false,
		upgrade = true,
	} = options

	for (const [name, Element] of Object.entries(elements)) {
		const tag = dashify(name)
		const already = customElements.get(tag)

		if (soft && already)
			continue

		customElements.define(tag, Element)

		if (upgrade)
			document.querySelectorAll(tag).forEach(element => {
				if (element.constructor === HTMLElement)
					customElements.upgrade(element)
			})
	}
}

/** @deprecated renamed to `register` */
export const register_to_dom = register

