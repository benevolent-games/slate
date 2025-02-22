
import {Signal} from "../signals/signal.js"

export function maybe<X, R>(x: X, fn: (x: X) => R) {
	const y = x instanceof Signal
		? x.value
		: x
	return y
		? fn(y)
		: undefined
}

export function whereby<X, R>(
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

/** @deprecated renamed to `whereby` */
export const wherefor = whereby

