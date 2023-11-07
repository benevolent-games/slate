
import {ob} from "../../tools/ob.js"
import {StateTree} from "../state_tree.js"

export namespace ZipAction {
	export type Blueprint<S> = {[key: string]: Blueprint<S> | Fn<S, any>}
	export type SetState<S> = (state: S) => void
	export type Fn<S, P extends any[]> = (
		(state: S, setState: (newState: S) => void) =>
			(...params: P) => void
	)

	export type Callable<B extends Blueprint<any>> = {
		[P in keyof B]: B[P] extends Blueprint<any>
			? Callable<B[P]>
			: B[P] extends Fn<any, any>
				? ReturnType<B[P]>
				: never
	}

	export function actualize<S, B extends Blueprint<S>>(tree: StateTree<S>, blueprint: B) {
		return ob.map(blueprint, value => {
			if (typeof value === "function") {
				return (...params: any[]) => {
					tree.transmute(state => {
						const setState = (newState: S) => { state = newState }
						value(state, setState)(...params)
						return state
					})
				}
			}
			else {
				return (actualize as any)(tree, value)
			}
		}) as Callable<B>
	}

	export function blueprint<S>() {
		return <B extends Blueprint<S>>(blueprint: B) => blueprint
	}
}

