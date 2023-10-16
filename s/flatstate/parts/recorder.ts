
import {Fun, Recording} from "./types.js"
import {make_map, make_set} from "./makers.js"
import {maptool} from "../../tools/maptool.js"

export class Recorder {
	#recording?: Recording

	record(fun: Fun) {
		this.#recording = make_map()

		// // TODO
		// this ends up calling another nested `record` call from sub-views.
		fun()

		// TODO this ends up being undefined...
		const recording = this.#recording

		// TODO ...because the nested call hits this line
		this.#recording = undefined

		return recording
	}

	entries() {
		return this.#recording
			? [...this.#recording.entries()]
			: []
	}

	record_that_key_was_accessed(state: {}, key: string) {
		if (this.#recording) {
			const keyset = maptool(this.#recording).grab(state, make_set)
			keyset.add(key)
		}
	}
}

