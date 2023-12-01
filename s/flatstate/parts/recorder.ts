
import {Recording} from "./types.js"
import {make_map, make_set} from "./makers.js"
import {maptool} from "../../tools/maptool.js"
import {Collector} from "../../reactor/types.js"

export class Recorder {
	#recordings: Recording[] = []

	record<P>(fn: Collector<P>) {
		const recording: Recording = make_map()
		this.#recordings.push(recording)
		const payload = fn()
		this.#recordings.pop()
		return {payload, recording}
	}

	record_that_key_was_accessed(state: {}, key: string) {
		const recording = this.#recordings.at(-1)
		if (recording) {
			const keyset = maptool(recording).grab(state, make_set)
			keyset.add(key)
		}
	}
}

