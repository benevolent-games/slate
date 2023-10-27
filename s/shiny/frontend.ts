
import {Shell} from "./shell.js"
import {Context} from "./context.js"
import {prepare_carbon} from "./units/carbon.js"
import {prepare_oxygen} from "./units/oxygen.js"
import {prepare_quartz} from "./units/quartz.js"
import {prepare_obsidian} from "./units/obsidian.js"
import {register_to_dom} from "../base/helpers/register_to_dom.js"

export function prepare_frontend<C extends Context>(context?: C | undefined) {
	const shell = new Shell<C>(context)
	const set_context = (c: C) => { shell.context = c }

	return {
		shell,
		set_context,
		register_to_dom,
		oxygen: prepare_oxygen(shell),
		carbon: prepare_carbon(shell),
		quartz: prepare_quartz(shell),
		obsidian: prepare_obsidian(shell),
	}
}

