
import {Context} from "./context.js"

export class Shell<C extends Context> {
	#context: C | undefined

	constructor(context?: C) {
		this.#context = context
	}

	get context(): C {
		if (this.#context)
			return this.#context
		else
			throw new Error("context was not set. please use setContext(context).")
	}

	set context(context: C) {
		this.#context = context
	}
}

