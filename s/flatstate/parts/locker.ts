
import {Fun} from "./types.js"

export class Locker {
	#locked = false

	lock(fun: Fun) {
		this.#locked = true
		fun()
		this.#locked = false
	}

	get locked() {
		return this.#locked
	}
}

