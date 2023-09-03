
import {FlipUse} from "./use.js"
import {Flat} from "../../flatstate/flat.js"

export function hooks(flat: Flat, element: HTMLElement, rerender: () => void) {
	const counter = {count: 0}
	const states = new Map<number, {}>()
	const setdata = new Map<number, any>()
	const setdowns = new Map<number, () => void>()

	const use = new FlipUse(
		flat,
		counter,
		states,
		setdata,
		setdowns,
		element,
		rerender,
	)

	return {
		use,

		setdown() {
			for (const [id, down] of [...setdowns.entries()]) {
				down()
				setdowns.delete(id)
			}
			setdata.clear()
		},

		wrap<F extends (...args: any[]) => any>(fun: F) {
			return ((...args: any[]) => {
				counter.count = 0
				return fun(...args)
			}) as F
		},
	}
}

