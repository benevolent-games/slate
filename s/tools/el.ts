
import {is} from "./is.js"
import {Pojo} from "./pojo.js"

/** better ergonomics for manually making html elements */
export function el<E extends HTMLElement>(
		tag: string,
		attrs: Pojo<string | boolean | number | undefined | null> = {},
		...append: (string | Node)[]
	) {

	const element = document.createElement(tag) as E

	for (const [key, value] of Object.entries(attrs)) {
		if (is.void(value))
			continue
		if (is.boolean(value)) {
			if (value)
				element.setAttribute(key, "")
		}
		else if (is.string(value))
			element.setAttribute(key, value)
		else if (is.number(value))
			element.setAttribute(key, value.toString())
		else
			throw new Error("unsupported type for elem attr")
	}

	element.append(...append)
	return element
}

