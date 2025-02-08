
export function dedupe<T>(array: T[]) {
	return [...new Set(array)]
}

