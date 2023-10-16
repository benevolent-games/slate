
import {Locker} from "./parts/locker.js"
import {Reaction} from "./parts/types.js"
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

	manual(reaction: Reaction) {
		const symbol = Symbol()
		const recorded = this.#recorder.record(
			() => this.#locker.lock(reaction.collector)
		)
		this.#stopper.add(
			symbol,
			save_reaction(symbol, recorded, this.#tracker, reaction),
		)
		return () => this.#stopper.stop(symbol)
	}

	auto<D>({debounce, discover, collector, responder}: {
			debounce: boolean
			discover: boolean
			collector: () => D
			responder?: (data: D) => void
		}) {
		return this.manual({
			debounce,
			discover,
			collector,
			responder: responder
				? () => responder(collector())
				: collector,
		})
	}

	reaction<D>(collector: () => D, responder?: (data: D) => void) {
		return this.auto({
			debounce: true,
			discover: false,
			collector,
			responder,
		})
	}

	deepReaction<D>(collector: () => D, responder?: (data: D) => void) {
		return this.auto({
			debounce: true,
			discover: true,
			collector,
			responder,
		})
	}

	clear() {
		this.#tracker.clear()
	}
}

