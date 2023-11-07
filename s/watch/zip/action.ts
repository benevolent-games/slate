
import {ob} from "../../tools/ob.js"
import {StateTree} from "../state_tree.js"

export namespace ZipAction {
	export type SetState<S> = (state: S) => void
	export type Group<S> = {[key: string]: Group<S> | Spec<S, any>}
	export type Spec<S, P extends any[]> = (
		(state: S, setState: (newState: S) => void) =>
			(...params: P) => void
	)

	export type Callable<G extends Group<any>> = {
		[P in keyof G]: G[P] extends Group<any>
			? Callable<G[P]>
			: G[P] extends Spec<any, any>
				? ReturnType<G[P]>
				: never
	}

	export function actualize<S, G extends Group<S>>(tree: StateTree<S>, group: G) {
		return ob.map(group, value => {
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
		}) as Callable<G>
	}

	export function group<S>() {
		return <G extends Group<S>>(group: G) => group
	}
}

