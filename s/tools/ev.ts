
import {Pojo} from "./pojo.js"
import {LitListener} from "./lit_listener.js"

export type EvListener = LitListener | ((...args: any[]) => void)
export type Ev = Pojo<EvListener>

/** attach event listeners to dom elements */
export function ev<E extends Ev>(target: EventTarget, events: E, options?: AddEventListenerOptions) {
	const entries = Object.entries(events)

	for (const [event, listener] of entries)
		target.addEventListener(event, listener, options)

	return function dispose() {
		for (const [event, listener] of entries)
			target.removeEventListener(event, listener)
	}
}

