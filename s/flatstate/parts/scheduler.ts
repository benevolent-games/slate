
import {debounce} from "../../tools/debounce/debounce.js"

export class Scheduler {
	#queue = new Map<symbol, () => void>()
	#wait: Promise<void> = Promise.resolve()

	#actuate = debounce(0, () => {
		const functions = [...this.#queue.values()]
		this.#queue.clear()
		for (const fun of functions)
			fun()
	})

	get wait() {
		return this.#wait
	}

	add(symbol: symbol, fun: () => void) {
		this.#queue.set(symbol, fun)
		this.#wait = this.#actuate()
	}
}

