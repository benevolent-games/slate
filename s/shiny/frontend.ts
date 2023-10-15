
import {Context} from "./context.js"
import {Pipe} from "../tools/pipe.js"
import {prepare_carbon} from "./carbon.js"
import {prepare_oxygen} from "./oxygen.js"
import {prepare_quartz} from "./quartz.js"
import {mixin} from "../base/helpers/mixin.js"
import {prepare_obsidian} from "./obsidian.js"
import {BaseElementClass} from "../base/element.js"
import {RequirementGroup, requirement} from "../tools/requirement.js"

export const prepare_frontend = <C extends Context>(context: C) => ({
	oxygen: prepare_oxygen(context),
	carbon: prepare_carbon(context),
	quartz: prepare_quartz(context),
	obsidian: prepare_obsidian(context),
	component: <E extends BaseElementClass>(prep: (context: C) => E) => (
		Pipe.with(prep(context))
			.to(mixin.css(context.theme))
			.to(mixin.flat(context.flat))
			.to(mixin.signals(context.tower))
			.done()
	),
})

export const deferred_frontend = <C extends Context>() => ({
	provide: <G extends RequirementGroup<C, any>>(context: C, group: G) => (
		requirement.provide(context)(group)
	),

	oxygen: (...p: Parameters<ReturnType<typeof prepare_oxygen>>) => (
		(context: C) => prepare_oxygen(context)(...p)
	),

	carbon: (...p: Parameters<ReturnType<typeof prepare_carbon>>) => (
		(context: C) => prepare_carbon(context)(...p)
	),

	quartz: (...p: Parameters<ReturnType<typeof prepare_quartz>>) => (
		(context: C) => prepare_quartz(context)(...p)
	),

	obsidian: (...p: Parameters<ReturnType<typeof prepare_obsidian>>) => (
		(context: C) => prepare_obsidian(context)(...p)
	),

	component: <E extends BaseElementClass>(prep: (context: C) => E) => (
		(context: C) => Pipe.with(prep(context))
			.to(mixin.css(context.theme))
			.to(mixin.flat(context.flat))
			.to(mixin.signals(context.tower))
			.done()
	),
})

