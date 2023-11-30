
import {Signal, accessed} from "../signal.js"
import {debounce} from "../../tools/debounce/debounce.js"

export class SignalTracker<P> {
	#active = true
	#all_signals: Set<Signal<any>>
	#waiters: Set<Promise<void>>
	#actor: ((payload: P) => void) | void
	#relevant_signals = new Set<Signal<any>>()
	#stoppers = new Set<() => void>()

	constructor({
			all_signals, waiters, actor,
		}: {
			all_signals: Set<Signal<any>>
			waiters: Set<Promise<void>>
			actor: ((payload: P) => void) | void
		}) {
		this.#all_signals = all_signals
		this.#waiters = waiters
		this.#actor = actor
	}

	#actuate = debounce(0, (reader: () => P) => {
		if (this.#active) {
			const payload = this.observe(reader)
			if (this.#actor)
				this.#actor(payload)
		}
	})

	#reset_all_signals_accessed_indicator() {
		for (const signal of this.#all_signals)
			signal[accessed] = false
	}

	get #signals_that_should_be_tracked() {
		return [...this.#all_signals].filter(signal => (
			signal[accessed] &&
			!this.#relevant_signals.has(signal)
		))
	}

	observe(reader: () => P) {
		this.#reset_all_signals_accessed_indicator()
		const payload = reader()
		const signals = this.#signals_that_should_be_tracked
		for (const signal of signals) {
			this.#relevant_signals.add(signal)
			this.#stoppers.add(
				signal.subscribe(
					() => this.#waiters.add(this.#actuate(reader))
				)
			)
		}
		return payload
	}

	shutdown() {
		this.#active = false
		this.#stoppers.forEach(stop => stop())
	}
}

