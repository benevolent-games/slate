
import {CSSResultGroup} from "lit"

import {Pipe} from "../tools/pipe.js"
import {Flat} from "../flatstate/flat.js"
import {ClayViewClass} from "../view/clay.js"
import {apply} from "../base/helpers/apply.js"
import {BaseElementClass} from "../base/element.js"
import {ShaleView, ShaleViewClass} from "../view/shale.js"
import {LightView, View, ViewParams} from "../view/parts/types.js"
import {requirement, RequirementGroup, RequirementGroupProvided} from "../tools/requirement.js"

export type BaseContext = {flat: Flat, theme: CSSResultGroup}
export type ComponentClass<C extends (...args: any[]) => BaseElementClass> = ReturnType<C>
export type ComponentInstance<C extends (...args: any[]) => BaseElementClass> = InstanceType<ReturnType<C>>

export const prepare_frontend = <C extends BaseContext>() => ({
	component: <E extends BaseElementClass>(fun: (context: C) => E) => fun,

	components: <E extends RequirementGroup<C, BaseElementClass>>(
			context: C,
			elements: E
		) => (
		Pipe.with(elements)
			.to(requirement.provide(context))
			.to(apply.flat(context.flat))
			.to(apply.theme(context.theme))
			.done() as RequirementGroupProvided<E>
	),

	view: <V extends (ShaleViewClass | ClayViewClass)>(
			fun: (context: C) => V
		) => (context: C): V extends ShaleViewClass ? View<ViewParams<V>> : LightView<ViewParams<V>> => {

		const {flat, theme} = context
		const UnknownView = fun(context)

		if (UnknownView.prototype instanceof ShaleView) {
			const View = UnknownView as ShaleViewClass
			return View.directive(View, {flat, theme}) as any
		}
		else {
			const View = UnknownView as ClayViewClass
			return View.directive(View, {flat}) as any
		}
	},

	views: <V extends RequirementGroup<C, View<any> | LightView<any>>>(
		context: C,
		viewgroup: V,
	) => requirement.provide(context)(viewgroup),
})

