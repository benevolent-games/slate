
import {Context} from "./context.js"
import {prepare_quartz} from "./quartz.js"
import {prepare_obsidian} from "./obsidian.js"

export const prepare_frontend = <C extends Context>(context: C) => ({
	quartz: prepare_quartz(context),
	obsidian: prepare_obsidian(context),
})

