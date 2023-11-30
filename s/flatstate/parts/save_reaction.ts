
import {Tracker} from "./tracker.js"
import {Fn, Reaction, Recording} from "./types.js"

export function save_reaction(
		symbol: symbol,
		recording: Recording,
		tracker: Tracker,
		reaction: Reaction<any>,
	) {

	const stoppers: Fn[] = []

	for (const [state, keyset] of recording) {
		const {grab_symbolmap} = tracker.grab_keymap(state)

		for (const key of keyset) {
			const symbolmap = grab_symbolmap(key)
			symbolmap.set(symbol, reaction)
			stoppers.push(() => symbolmap.delete(symbol))
		}
	}

	return () => stoppers.forEach(stop => stop())
}

