
import {Locker} from "./locker.js"
import {Reaction} from "./types.js"
import {Stopper} from "./stopper.js"
import {Tracker} from "./tracker.js"
import {Recorder} from "./recorder.js"
import {Scheduler} from "./scheduler.js"
import {save_reaction} from "./save_reaction.js"
import {CircularFlatstateError} from "./errors.js"

export function proxy_handlers(
		tracker: Tracker,
		recorder: Recorder,
		locker: Locker,
		stopper: Stopper,
		scheduler: Scheduler,
	): ProxyHandler<any> {

	function respond_and_run_discovery([symbol, reaction]: [symbol, Reaction]) {
		locker.lock(reaction.responder)

		if (reaction.discover) {
			stopper.stop(symbol)
			const recorded = recorder.record(
				() => locker.lock(reaction.collector)
			)
			stopper.add(
				symbol,
				save_reaction(symbol, recorded, tracker, reaction),
			)
		}
	}

	return {

		get: (state, key: string) => {
			recorder.record_that_key_was_accessed(state, key)
			return state[key]
		},

		set: (state, key: string, value: any) => {
			if (locker.locked)
				throw new CircularFlatstateError(key)

			state[key] = value
			const reactions = [...tracker.grab_keymap(state).grab_symbolmap(key)]

			for (const entry of reactions) {
				const [symbol, reaction] = entry

				if (reaction.debounce)
					scheduler.add(symbol, () => respond_and_run_discovery(entry))
				else
					respond_and_run_discovery(entry)
			}

			return true
		},
	}
}

