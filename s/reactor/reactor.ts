
import {tracker} from "@e280/stz"
import {Flat} from "../flatstate/flat.js"
import {SignalTower} from "../signals/tower.js"
import {Collector, Lean, ReactorCore, Responder} from "./types.js"

export class Reactor implements ReactorCore {
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

	reaction<P>(collector: Collector<P>, responder?: Responder<P>) {
		const actuate = responder
			? () => responder(collect())
			: () => collect()

		const lean = this.lean(actuate)
		const collect = () => lean.collect(collector)

		collect()
		return lean.stop
	}

	lean(actor: () => void): Lean {
		const lean1 = this.flat.lean(actor)
		const lean2 = this.signals.lean(actor)
		const trackingDisposers = new Map<object, () => void>()

		return {
			stop() {
				lean1.stop()
				lean2.stop()
				for (const dispose of trackingDisposers.values())
					dispose()
				trackingDisposers.clear()
			},
			collect(collector) {
				return lean1.collect(() =>
					lean2.collect(() => {
						const {seen, result} = tracker.seen(collector)
						for (const saw of seen) {
							if (!trackingDisposers.has(saw))
								trackingDisposers.set(saw, tracker.changed(saw, actor))
						}
						return result
					})
				)
			},
		}
	}
}

