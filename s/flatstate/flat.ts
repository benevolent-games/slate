
import {Lean} from "./parts/types.js"
import {Locker} from "./parts/locker.js"
import {Tracker} from "./parts/tracker.js"
import {Stopper} from "./parts/stopper.js"
import {Recorder} from "./parts/recorder.js"
import {readonly} from "./parts/readonly.js"
import {Scheduler} from "./parts/scheduler.js"
import {collectivize} from "./parts/collectivize.js"
import {save_reaction} from "./parts/save_reaction.js"
import {proxy_handlers} from "./parts/proxy_handlers.js"

export class Flat {
	static readonly = readonly
	static collectivize = collectivize

	#tracker = new Tracker()
	#recorder = new Recorder()
	#locker = new Locker()
	#stopper = new Stopper()
	#scheduler = new Scheduler()

	#proxy_handlers = proxy_handlers(
		this.#tracker,
		this.#recorder,
		this.#locker,
		this.#stopper,
		this.#scheduler,
	)

	get wait() {
		return this.#scheduler.wait
	}

	state<S extends {}>(state: S) {
		return new Proxy<S>(state, this.#proxy_handlers)
	}

	reaction<P>(
			collector: () => P,
			responder?: (payload: P) => void,
		) {

		const symbol = Symbol()

		const {recording} = this.#recorder.record(
			() => this.#locker.lock(collector)
		)

		this.#stopper.add(
			symbol,
			save_reaction(
				symbol,
				recording,
				this.#tracker,
				{collector, responder},
			),
		)

		return () => this.#stopper.stop(symbol)
	}

	lean(responder: () => void): Lean {
		const symbol = Symbol()
		return {
			stop: () => this.#stopper.stop(symbol),
			collect: collector => {
				const {payload, recording} = this.#recorder.record(
					() => this.#locker.lock(collector)
				)
				this.#stopper.add(
					symbol,
					save_reaction(
						symbol,
						recording,
						this.#tracker,
						{lean: true, responder},
					),
				)
				return payload
			},
		}
	}

	clear() {
		this.#tracker.clear()
	}
}

