
import {Tracker} from "./tracker.js"
import {Fun, Reaction, Recording} from "./types.js"

export function save_reaction(
		symbol: symbol,
		recording: Recording,
		tracker: Tracker,
		reaction: Reaction,
	) {

	const stoppers: Fun[] = []

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

