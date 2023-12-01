
import {Flat} from "../../flatstate/flat.js"
import {SignalTower} from "../../signals/tower.js"
import {debounce} from "../../tools/debounce/debounce.js"
import {Collector, Responder} from "../../flatstate/parts/types.js"

export class Reactor {
	#wait: Promise<void> = Promise.resolve()

	constructor(
		public flat: Flat,
		public signals: SignalTower,
	) {}

	get wait() {
		return Promise
			.all([this.flat.wait, this.signals.wait])
			.then(() => this.#wait)
	}

	reaction<P>(
			collector: Collector<P>,
			responder: Responder<P>,
		) {

		const r = debounce(0, responder)

		const stop_f = this.flat.reaction(collector, payload => {
			this.#wait = r(payload)
		})

		const stop_r = this.signals.reaction(collector, payload => {
			this.#wait = r(payload)
		})

		return () => {
			stop_f()
			stop_r()
		}
	}
}

