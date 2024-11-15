
import {Op} from "../op/op.js"
import {Signal} from "./signal.js"

export class OpSignal<V> extends Signal<Op.For<V>> {
	#relevant = 0

	constructor(op: Op.For<V>) {
		super(op)
	}

	async load(fn: () => Promise<V>) {
		const id = ++this.#relevant
		return Op.load(
			op => {
				if (this.#relevant === id)
					this.value = op
			},
			fn,
		)
	}

	setLoading() {
		this.value = Op.loading()
	}

	setError(reason: string) {
		this.value = Op.error(reason)
	}

	setReady(payload: V) {
		this.value = Op.ready(payload)
	}

	isLoading(): this is Signal<Op.Loading> {
		return Op.is.loading(this.value)
	}

	isError(): this is Signal<Op.Error> {
		return Op.is.error(this.value)
	}

	isReady(): this is Signal<Op.Ready<V>> {
		return Op.is.ready(this.value)
	}

	get payload() {
		return Op.payload(this.value) as (
			this extends Signal<Op.Ready<V>> ? V
			: this extends Signal<Op.Loading> ? undefined
			: this extends Signal<Op.Error> ? undefined
			: V | undefined
		)
	}

	select<R>(choices: Op.Choices<V, R>) {
		return Op.select(this.value, choices)
	}
}

