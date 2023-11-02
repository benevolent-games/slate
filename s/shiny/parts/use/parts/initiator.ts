
import {InitFunction} from "./types.js"
import {Constructor} from "../../../../tools/constructor.js"

/** a class intended to be used with use.init via initiate() function */
export abstract class Initiator {
	abstract dispose(): void
}

/** initiate an instance of an initiator class (helpful for use.init) */
export function initiate<C extends Constructor<Initiator>>(C: C) {
	return (...params: ConstructorParameters<C>): InitFunction<InstanceType<C>> => () => {
		const instance = new C(...params) as InstanceType<C>
		return [instance, () => instance.dispose()]
	}
}

/** identify function to help you make an InitFunction */
export const initializer = <I extends InitFunction<any>>(init: I) => init

