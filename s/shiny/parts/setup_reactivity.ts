
import {TemplateResult} from "lit"
import {flat, signals} from "../state.js"

export function setup_reactivity<P extends any[]>(
		render: (...props: P) => (TemplateResult | void),
		rerender: () => void,
	): (...props: P) => (TemplateResult | void) {

	const flat_lean = flat.lean(rerender)
	const signals_lean = signals.lean(rerender)

	return (...props) => flat_lean.collect(
		() => signals_lean.collect(
			() => render(...props)
		)
	)
}

