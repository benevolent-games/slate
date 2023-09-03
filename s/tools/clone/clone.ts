
export function clone<T>(data: T, refs = new Set<any>()): T {

	if (refs.has(data))
		throw new Error("cannot clone circular reference")

	let copy = undefined as T

	if (typeof data === "function" || (data !== null && typeof data === "object")) {
		refs.add(data)

		if (Array.isArray(data))
			copy = data.map(d => clone(d, new Set(refs))) as T

		else if (data.constructor === Object)
			copy = Object.fromEntries(
				Object.entries(data)
					.map(([key, d]) => [key, clone(d, new Set(refs))])
			) as T

		else if (data instanceof Map)
			copy = new Map(Array.from(data, ([key, val]) => [key, clone(val, new Set(refs))])) as T

		else if (data instanceof Set)
			copy = new Set(Array.from(data, val => clone(val, new Set(refs)))) as T

		else if (data instanceof Date)
			copy = new Date(data.getTime()) as T

		else
			copy = data

		refs.delete(data) // Remove current data from refs once we're done with this branch of the object tree
	}

	else
		copy = data

	return copy
}

