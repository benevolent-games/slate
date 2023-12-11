
import {ob} from "./ob.js"

export type Requirement<R, T> = (r: R) => T
export type RequirementGroup<R, T> = {[key: string]: Requirement<R, T>}

export type RequirementProvided<F extends Requirement<any, any>> = ReturnType<F>
export type RequirementGroupProvided<G extends RequirementGroup<any, any>> = {
	[P in keyof G]: RequirementProvided<G[P]>
}

/**
 * establish a pattern for creating many things that have a common requirement.
 *  - `const contextual = requirement<Context>()<Flipview<any>>`
 *  - now you can use `contextual` as a template for creating things that require context
 *  - `const MyView = contextual(context => flipview())`
 *  - in that example, the requirement enforces the types for context and the view
 */
export function requirement<R>() {
	return function<T>(fun: Requirement<R, T>) {
		return fun
	}
}

/**
 * provide a requirement to a group of things.
 */
requirement.provide = <R>(r: R) => (
	<G extends RequirementGroup<R, any>>(group: G) => (
		ob(group).map(fun => fun(r)) as RequirementGroupProvided<G>
	)
)

