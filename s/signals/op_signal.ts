
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

	get loading() {
		return Op.is.loading(this.value)
	}

	get error() {
		return Op.is.error(this.value)
	}

	get ready() {
		return Op.is.ready(this.value)
	}

	get payload() {
		return Op.payload(this.value)
	}

	select<R>(choices: Op.Choices<V, R>) {
		return Op.select(this.value, choices)
	}
}

