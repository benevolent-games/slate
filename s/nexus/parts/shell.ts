
import {Context} from "../context.js"

export class Shell<C extends Context> {
	#context: C | undefined

	constructor(context?: C) {
		this.#context = context
	}

	get context(): C {
		if (this.#context)
			return this.#context
		else
			throw new Error("nexus.context was not set, but it's necessary")
	}

	set context(context: C) {
		this.#context = context
	}
}

