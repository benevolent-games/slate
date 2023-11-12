
import {Slice} from "./slice.js"

export interface SliceAccessors<S, X> {
	getter: (state: S) => X
	setter: (state: S, x: X) => S
}

export interface Sliceable<S> {
	readonly state: S
	transmute(fun: (state: S) => S): void
	slice<X>({}: SliceAccessors<S, X>): Slice<S, X>
}

export type SliceOptions<S, X> = SliceAccessors<S, X> & {
	parent: Sliceable<S>
}

