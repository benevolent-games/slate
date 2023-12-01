
import {Flat} from "../../flatstate/flat.js"
import {SignalTower} from "../../signals/tower.js"
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
			responder?: Responder<P>,
		) {

		const actuate = responder
			? () => responder(runCollector())
			: () => runCollector()

		const lean1 = this.flat.lean(actuate)
		const lean2 = this.signals.lean(actuate)

		function runCollector() {
			return lean1.collect(() => lean2.collect(collector))
		}

		runCollector()
		return () => {
			lean1.stop()
			lean2.stop()
		}
	}
}

