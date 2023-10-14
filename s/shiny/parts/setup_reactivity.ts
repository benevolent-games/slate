
import {TemplateResult} from "lit"
import {Context} from "../context.js"

export function setup_reactivity<P extends any[]>(
		context: Context,
		render: (...props: P) => (TemplateResult | void),
		rerender: () => void,
	): (...props: P) => (TemplateResult | void) {

	let stop_cues: (() => void) | undefined = undefined
	let stop_flat: (() => void) | undefined = undefined

	function render_and_track_cues(...props: P) {
		if (stop_cues)
			stop_cues()

		let result: TemplateResult | void = undefined

		stop_cues = context.cues.track(
			() => { result = render(...props) },
			rerender,
		)

		return result
	}

	function render_and_track_flatstate(...props: P) {
		if (stop_flat)
			stop_flat()

		let result: TemplateResult | void = undefined

		stop_flat = context.flat.manual({
			debounce: true,
			discover: false,
			collector: () => { result = render_and_track_cues(...props) },
			responder: rerender,
		})

		return result
	}

	return render_and_track_flatstate
}

