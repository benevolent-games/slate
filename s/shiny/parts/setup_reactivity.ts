
import {TemplateResult} from "lit"
import {reactor} from "../state.js"

export type Reactivity<P extends any[]> = {
	render: (...props: P) => (TemplateResult | void)
	stop: () => void
}

export function setup_reactivity<P extends any[]>(
		render: (...props: P) => (TemplateResult | void),
		rerender: () => void,
	): Reactivity<P> {

	const lean = reactor.lean(rerender)

	return {
		stop: lean.stop,
		render: (...props) => lean.collect(() => render(...props)),
	}
}

