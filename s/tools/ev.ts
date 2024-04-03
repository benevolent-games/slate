
import {Pojo} from "./pojo.js"

export type EvListener = (...args: any[]) => void
export type Ev = Pojo<EvListener>

/** attach event listeners to dom elements */
export function ev<E extends Ev>(target: EventTarget, events: E) {
	const entries = Object.entries(events)

	for (const [event, listener] of entries)
		target.addEventListener(event, listener)

	return function dispose() {
		for (const [event, listener] of entries)
			target.removeEventListener(event, listener)
	}
}

