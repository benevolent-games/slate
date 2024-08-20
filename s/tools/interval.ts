
export function interval(milliseconds: number, fn: () => void) {
	const id = setInterval(fn, milliseconds)
	return () => clearInterval(id)
}

interval.hz = (hz: number, fn: () => void) => interval(1000 / hz, fn)

