
import {CSSResultGroup} from "lit"

import {Pipe} from "../tools/pipe.js"
import {Flat} from "../flatstate/flat.js"
import {apply} from "../base/helpers/apply.js"
import {View} from "../view/parts/types.js"
import {BaseElementClass} from "../base/element.js"
import {ShaleViewClass, shale_view} from "../view/shale_view.js"
import {requirement, RequirementGroup, RequirementGroupProvided} from "../tools/requirement.js"

export type BaseContext = {flat: Flat, theme: CSSResultGroup}

export const prepare_frontend = <C extends BaseContext>() => {

	return ({
		component: requirement<C>()<BaseElementClass>,

		components: <E extends RequirementGroup<C, BaseElementClass>>(e: E) => (
			(context: C) => (Pipe.with(e)
				.to(requirement.provide(context))
				.to(apply.flat(context.flat))
				.to(apply.theme(context.theme))
				.done() as RequirementGroupProvided<E>
			)
		),

		view: <V extends ShaleViewClass>(fun: (context: C) => V) => (context: C) => shale_view({
			View: fun(context),
			flat: context.flat,
			theme: context.theme,
		}),

		views: <V extends RequirementGroup<C, View<any>>>(
			context: C,
			viewgroup: V,
		) => requirement.provide(context)(viewgroup),
	})
}

