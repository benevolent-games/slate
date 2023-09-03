
import {Tracking} from "./types.js"
import {make_map} from "./makers.js"
import {maptool} from "../../tools/maptool.js"

export class Tracker {
	#tracking: Tracking = new WeakMap()

	grab_keymap(state: {}) {
		const keymap = maptool(this.#tracking).grab(state, make_map)

		return {
			keymap,
			grab_symbolmap(key: string) {
				return maptool(keymap).grab(key, make_map)
			},
		}
	}

	clear() {
		this.#tracking = new WeakMap()
	}
}

