
export function deepFreeze<T>(obj: T): T {
	if (obj === null || typeof obj !== 'object')
		return obj

	Object.values(obj).forEach(value => {
		if (typeof value === 'object' && value !== null)
			deepFreeze(value)
	})

	return Object.freeze(obj)
}

