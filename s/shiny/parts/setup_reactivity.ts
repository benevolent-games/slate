
import {TemplateResult} from "lit"
import {flat, signals} from "../state.js"

export type Reactivity<P extends any[]> = {
	render: (...props: P) => (TemplateResult | void)
	stop: () => void
}

export function setup_reactivity<P extends any[]>(
		render: (...props: P) => (TemplateResult | void),
		rerender: () => void,
	): Reactivity<P> {

	const flat_lean = flat.lean(rerender)
	const signals_lean = signals.lean(rerender)

	return {
		render(...props) {
			return flat_lean.collect(
				() => signals_lean.collect(
					() => render(...props)
				)
			)
		},

		stop() {
			flat_lean.stop()
			signals_lean.stop()
		},
	}
}

