
import {Op} from "../op/op.js"
import {Signal} from "./signal.js"

export class OpSignal<V> extends Signal<Op.For<V>> {

	constructor() {
		super(Op.loading())
	}

	async run(operation: () => Promise<V>) {
		return Op.run(
			op => this.value = op,
			operation,
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
		return Op.payload(this.value)
	}

	select<R>(choices: Op.Choices<V, R>) {
		return Op.select(this.value, choices)
	}
}

