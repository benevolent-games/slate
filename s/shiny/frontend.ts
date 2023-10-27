
import {Shell} from "./shell.js"
import {Context} from "./context.js"
import {Pipe} from "../tools/pipe.js"
import {mixin} from "../base/helpers/mixin.js"
import {prepare_carbon} from "./units/carbon.js"
import {prepare_oxygen} from "./units/oxygen.js"
import {prepare_quartz} from "./units/quartz.js"
import {BaseElementClass} from "../base/element.js"
import {prepare_obsidian} from "./units/obsidian.js"

export function prepare_frontend<C extends Context>(context?: C | undefined) {
	const shell = new Shell<C>(context)
	const setContext = (c: C) => { shell.context = c }

	return {
		setContext,

		oxygen: prepare_oxygen(shell),
		carbon: prepare_carbon(shell),
		quartz: prepare_quartz(shell),
		obsidian: prepare_obsidian(shell),

		component: <E extends BaseElementClass>(prep: (shell: Shell<C>) => E) => (
			Pipe.with(prep(shell))
				.to(mixin.css_deferred(() => [shell.context.theme]))
				.to(mixin.flat(shell.context.flat))
				.to(mixin.signals(shell.context.tower))
				.done()
		),
	}
}

