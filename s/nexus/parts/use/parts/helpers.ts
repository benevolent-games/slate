
import {Init, InitResult, Mount} from "./types.js"
import {Constructor} from "../../../../tools/constructor.js"

/** identity function to help you make an init function */
export const initFn = <I extends Init<any>>(fn: I) => fn

/** identity function to help you make a mount function */
export const mountFn = (fn: Mount) => fn

/** a class intended to be used with use.init via initiate() function */
export class Initiator {
	#cleanups: (() => void)[] = []

	cleanup(fn: () => void) {
		this.#cleanups.push(fn)
	}

	deinit() {
		for (const cleanup of this.#cleanups)
			cleanup()
	}
}

/** wrap an initiator instance in an InitResult array */
export function initiator<I extends Initiator>(instance: I): InitResult<I> {
	return [instance, () => instance.deinit()]
}

/** initiate an instance of an initiator class (helpful for use.init) */
export function initiate<C extends Constructor<Initiator>>(C: C) {
	return (...params: ConstructorParameters<C>): Init<InstanceType<C>> => () => {
		const instance = new C(...params) as InstanceType<C>
		return [instance, () => instance.deinit()]
	}
}

