
import {signal} from "../../nexus/state.js"
import {dragleave_has_exited_current_target} from "./utils/dragleave_has_exited_current_target.js"

export class ShockDrop {
	#params: Params
	#indicator = signal(false)

	constructor(params: Params) {
		this.#params = params
	}

	get indicator() {
		return this.#indicator.value
	}

	reset_indicator = () => {
		this.#indicator.value = false
	}

	dragover = (event: DragEvent) => {
		event.preventDefault()
		if (this.#params.predicate(event))
			this.#indicator.value = true
	}

	dragleave = (event: DragEvent) => {
		if (dragleave_has_exited_current_target(event))
			this.#indicator.value = false
	}

	drop = (event: DragEvent) => {
		event.preventDefault()
		this.#indicator.value = false
		if (this.#params.predicate(event))
			this.#params.handle_drop(event)
	}
}

type Params = {
	predicate: (event: DragEvent) => boolean
	handle_drop: (event: DragEvent) => void
}

