
import {Fun} from "./types.js"

export class Stopper {
	#map = new Map<symbol, () => void>

	stop(symbol: symbol) {
		const stop = this.#map.get(symbol)
		if (stop) {
			this.#map.delete(symbol)
			stop()
		}
	}

	add(symbol: symbol, fun: Fun) {
		this.#map.set(symbol, fun)
	}
}

