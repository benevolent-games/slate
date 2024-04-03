
export class Trashcan {
	#can: (() => void)[] = []

	bag = <T>(item: T) => ({
		dump: (destroy: (item: T) => void) => {
			this.#can.push(() => destroy(item))
			return item
		}
	})

	mark = (fn: () => void) => {
		this.#can.push(fn)
	}

	dispose = () => {
		this.#can.forEach(destroy => destroy())
		this.#can = []
	}
}

