
export function find_in_blueprint<T>(obj: any, purpose: string[]): T | undefined {
	let current: any = obj
	for (const key of purpose) {
		if (current[key] === undefined)
			return undefined
		current = current[key]
	}
	return current as T
}

