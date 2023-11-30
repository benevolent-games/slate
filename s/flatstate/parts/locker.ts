
export class Locker {
	#locked = false

	lock<R>(fn: () => R) {
		this.#locked = true
		const result = fn()
		this.#locked = false
		return result
	}

	get locked() {
		return this.#locked
	}
}

