
export function requestAnimationFrameLoop(fn: () => void) {
	let stop = false

	function request() {
		if (stop)
			return

		fn()
		requestAnimationFrame(request)
	}

	request()
	return () => { stop = true }
}

