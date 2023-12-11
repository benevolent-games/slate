
export class Counter {
	#value = 0

	pull() {
		return this.#value++
	}

	reset() {
		this.#value = 0
	}
}

