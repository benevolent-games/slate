
export function interval(hz: number, fn: () => void) {
	const delay = 1000 / hz
	const id = setInterval(fn, delay)
	return () => clearInterval(id)
}

