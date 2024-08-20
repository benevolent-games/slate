
import {Signal} from "../signals/signal.js"

export function wherefor<X, R>(
		x: X | undefined | null | Signal<X | undefined | null>,
		fn: (x: X) => R,
	) {

	const y = x instanceof Signal
		? x.value
		: x

	return (y === undefined || y === null)
		? undefined
		: fn(y)
}

