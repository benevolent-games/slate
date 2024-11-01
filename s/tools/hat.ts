
export class Hat<T> {
	#content: T[] = []

	constructor(public items: T[]) {
		this.#content = [...items]
	}

	pull() {
		if (this.#content.length === 0)
			this.#content = [...this.items]
		const index = Math.floor(Math.random() * this.#content.length)
		const [item] = this.#content.splice(index, 1)
		return item
	}
}

