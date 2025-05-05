
import {dashify} from "../../tools/dashify.js"
import {HTMLElementClasses} from "../element.js"

export type RegistrationOptions = {
	soft: boolean
	upgrade: boolean
}

export function register_to_dom<E extends HTMLElementClasses>(
		elements: E,
		options: Partial<RegistrationOptions> = {},
	) {

	const soft = options.soft ?? false
	const upgrade = options.upgrade ?? true

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

