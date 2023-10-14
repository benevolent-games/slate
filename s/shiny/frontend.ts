
import {Context} from "./context.js"
import {Pipe} from "../tools/pipe.js"
import {prepare_carbon} from "./carbon.js"
import {prepare_oxygen} from "./oxygen.js"
import {prepare_quartz} from "./quartz.js"
import {mixin} from "../base/helpers/mixin.js"
import {prepare_obsidian} from "./obsidian.js"
import {BaseElementClass} from "../base/element.js"

export const prepare_frontend = <C extends Context>(context: C) => ({
	oxygen: prepare_oxygen(context),
	carbon: prepare_carbon(context),
	quartz: prepare_quartz(context),
	obsidian: prepare_obsidian(context),
	component: <E extends BaseElementClass>(prep: (context: C) => E) => (
		Pipe.with(prep(context))
			.to(mixin.css(context.theme))
			.to(mixin.flat(context.flat))
			.to(mixin.signals(context.signals))
			.done()
	),
})

