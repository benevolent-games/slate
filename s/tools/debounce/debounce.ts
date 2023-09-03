
import {AnyFunction, DebounceReturn} from "./types.js"

export function debounce<xAction extends AnyFunction>(
		delay: number,
		action: xAction,
	): DebounceReturn<xAction> {

	let latestArgs: any[]
	let timeout: any

	let waitingQueue: {
		resolve: (r: ReturnType<xAction>) => void
		reject: (reason: any) => void
	}[] = []

	function reset() {
		latestArgs = []
		if (timeout)
			clearTimeout(timeout)
		timeout = undefined
		waitingQueue = []
	}

	reset()

	return <DebounceReturn<xAction>>((...args) => {
		latestArgs = args

		if (timeout)
			clearTimeout(timeout)

		const promise = new Promise((resolve, reject) => {
			waitingQueue.push({resolve, reject})
		})

		timeout = setTimeout(() => {
			Promise.resolve()
				.then(() => action(...latestArgs))
				.then(r => {
					for (const {resolve} of waitingQueue)
						resolve(r)
					reset()
				})
				.catch(err => {
					for (const {reject} of waitingQueue)
						reject(err)
					reset()
				})
		}, delay)

		return promise
	})
}
