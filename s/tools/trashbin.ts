
export class Trashbin {
	#fns: (() => void)[] = []

	disposer = (fn: () => void) => {
		this.#fns.push(fn)
	}

	disposable = <X extends {dispose: () => void}>(x: X) => {
		return this.bag(x, () => x.dispose())
	}

	bag = <X>(x: X, fn: (x: X) => void) => {
		this.disposer(() => fn(x))
		return x
	}

	dispose = () => {
		for (const fn of this.#fns.reverse())
			fn()
		this.#fns = []
	}
}

