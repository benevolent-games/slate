
import {dashify} from "../../tools/dashify.js"
import {HTMLElementClasses} from "../element.js"

export const register_to_dom = <E extends HTMLElementClasses>(elements: E) => {
	for (const [name, Element] of Object.entries(elements))
		customElements.define(dashify(name), Element)
}

