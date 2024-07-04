
import {dashify} from "../../tools/dashify.js"
import {HTMLElementClasses} from "../element.js"

export type RegistrationOptions = {
	soft: boolean
}

export function register_to_dom<E extends HTMLElementClasses>(
		elements: E,
		options: RegistrationOptions = {soft: false},
	) {

	for (const [name, Element] of Object.entries(elements)) {
		const tag = dashify(name)

		if (!options.soft || customElements.get(tag) === undefined)
			customElements.define(tag, Element)
	}
}

