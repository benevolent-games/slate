
import {reactor} from "../state.js"
import {RenderResult} from "./types.js"

export type Reactivity<P extends any[]> = {
	render: (...props: P) => RenderResult
	stop: () => void
}

export function setup_reactivity<P extends any[]>(
		render: (...props: P) => RenderResult,
		rerender: () => void,
	): Reactivity<P> {

	const lean = reactor.lean(rerender)

	return {
		stop: lean.stop,
		render: (...props) => lean.collect(() => render(...props)),
	}
}

