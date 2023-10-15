
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

	get payload() {
		return Op.payload(this.value)
	}

	is = {
		loading: () => Op.is.loading(this.value),
		error: () => Op.is.error(this.value),
		ready: () => Op.is.ready(this.value),
	}

	select<R>(choices: Op.Choices<V, R>) {
		return Op.select(this.value, choices)
	}
}

