
export function apply_attributes(
		elements: HTMLElement,
		attributes: Record<string, string | number | boolean | undefined>,
	) {

	for (const [key, value] of Object.entries(attributes)) {

		if (typeof value === "string")
			elements.setAttribute(key, value)

		else if (typeof value === "number")
			elements.setAttribute(key, value.toString())

		else if (typeof value === "boolean") {
			if (value === true)
				elements.setAttribute(key, "")
			else
				elements.removeAttribute(key)
		}

		else if (typeof value === "undefined")
			elements.removeAttribute(key)

		else
			console.warn(`invalid attribute type ${key} is ${typeof value}`)
	}
}

