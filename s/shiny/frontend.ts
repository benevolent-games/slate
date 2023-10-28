
import {Shell} from "./shell.js"
import {Context} from "./context.js"
import {apply} from "../base/helpers/apply.js"
import {prepare_carbon} from "./units/carbon.js"
import {prepare_oxygen} from "./units/oxygen.js"
import {prepare_quartz} from "./units/quartz.js"
import {prepare_obsidian} from "./units/obsidian.js"
import {BaseElementClasses} from "../base/element.js"

export function prepare_frontend<C extends Context>(context?: C) {

	const shell = new Shell<C>(context)

	return {
		get context() {
			return shell.context
		},

		set context(c: C) {
			shell.context = c
		},

		/** light-dom web component */
		oxygen: prepare_oxygen(shell),

		/** shadow-dom web component */
		carbon: prepare_carbon(shell),

		/** light-dom lit view */
		quartz: prepare_quartz(shell),

		/** shadow-dom lit view */
		obsidian: prepare_obsidian(shell),

		components: <E extends BaseElementClasses>(elements: E) => (
			apply.context(shell.context)(elements)
		),
	}
}

