
import {is} from "../../is.js"

export function deepFreeze<X>(item: X): X {

	function recurse(x: X, parents: object[]) {
		if (!is.object(x) || parents.includes(x))
			return x

		const newParents = [...parents, x]

		if (x instanceof Map)
			for (const arr of x.entries())
				for (const y of arr)
					recurse(y, newParents)

		else if (x instanceof Set)
			for (const y of x)
				recurse(y, newParents)

		else if (Array.isArray(x))
			for (const y of x)
				recurse(y, newParents)

		else
			for (const y of Object.values(x))
				recurse(y, newParents)

		return Object.freeze(x)
	}

	return recurse(item, [])
}

