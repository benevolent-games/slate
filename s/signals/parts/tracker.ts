
import {Signal} from "../signal.js"
import {accessed} from "./accessed_symbol.js"
import {Collector} from "../../reactor/types.js"
import {debounce} from "../../tools/debounce/debounce.js"

export type LeanTrack = {
	lean: true
	actor: () => void
}

export type NormalTrack<P> = {
	collector: () => P
	responder: ((payload: P) => void) | void
}

export type Track<P> = LeanTrack | NormalTrack<P>

export class SignalTracker {
	#active = true
	#all_signals: Set<Signal<any>>
	#waiters: Set<Promise<void>>
	#relevant_signals = new Set<Signal<any>>()
	#stoppers = new Set<() => void>()

	constructor({
			all_signals,
			waiters,
		}: {
			all_signals: Set<Signal<any>>
			waiters: Set<Promise<void>>
		}) {
		this.#all_signals = all_signals
		this.#waiters = waiters
	}

	#actuate = debounce(0, (track: Track<any>) => {
		if (this.#active) {
			if ("lean" in track)
				track.actor()
			else {
				const {payload, recording} = this.observe(track.collector)
				this.add_listeners(track, recording)
				if (track.responder)
					track.responder(payload)
			}
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

	observe<P>(collector: Collector<P>) {
		this.#reset_all_signals_accessed_indicator()
		const payload = collector()
		return {
			payload,
			recording: this.#signals_that_should_be_tracked,
		}
	}

	add_listeners<P>(track: Track<P>, recording: Signal<any>[]) {
		for (const signal of recording) {
			this.#relevant_signals.add(signal)
			this.#stoppers.add(
				signal.on(
					() => this.#waiters.add(this.#actuate(track))
				)
			)
		}
	}

	shutdown() {
		this.#active = false
		this.#stoppers.forEach(stop => stop())
	}
}

