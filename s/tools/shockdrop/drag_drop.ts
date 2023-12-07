
import {flat} from "../../shiny/state.js"
import {dragleave_has_exited_current_target} from "./utils/dragleave_has_exited_current_target.js"

export class ShockDragDrop<Grabbed, Hovering> {
	#params: Params<Grabbed, Hovering>

	constructor(params: Params<Grabbed, Hovering>) {
		this.#params = params
	}

	#state = flat.state({
		grabbed: undefined as undefined | Grabbed,
		hovering: undefined as undefined | Hovering,
	})

	readonly dragzone = {
		draggable: () => "true",

		dragstart: (grabbed: Grabbed) => (_: DragEvent) => {
			this.#state.grabbed = grabbed
		},

		dragend: () => (_: DragEvent) => {
			this.#state.grabbed = undefined
			this.#state.hovering = undefined
		},
	}

	readonly dropzone = {
		dragenter: () => (_: DragEvent) => {},

		dragleave: () => (event: DragEvent) => {
			if (dragleave_has_exited_current_target(event))
				this.#state.hovering = undefined
		},

		dragover: (hovering: Hovering) => (event: DragEvent) => {
			const {out_of_band} = this.#params

			event.preventDefault()
			if (this.#state.grabbed || (out_of_band && out_of_band.predicate(event, hovering)))
				this.#state.hovering = hovering
		},

		drop: (hovering: Hovering) => (event: DragEvent) => {
			const {handle_drop, out_of_band} = this.#params

			event.preventDefault()
			const {grabbed} = this.#state
			this.#state.grabbed = undefined
			this.#state.hovering = undefined

			if (grabbed)
				handle_drop(event, grabbed, hovering)
			else if (out_of_band && out_of_band.predicate(event, hovering))
				out_of_band.handle_drop(event, hovering)
		},
	}

	get grabbed() {
		return this.#state.grabbed
	}

	get hovering() {
		return this.#state.hovering
	}
}

type Params<Grabbed, Hovering> = {
	handle_drop: (event: DragEvent, grabbed: Grabbed, hovering: Hovering) => void
	out_of_band?: {
		predicate: (event: DragEvent, hovering: Hovering) => boolean
		handle_drop: (event: DragEvent, hovering: Hovering) => void
	}
}

