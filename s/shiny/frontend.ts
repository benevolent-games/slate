
import {Shell} from "./shell.js"
import {Context} from "./context.js"
import {apply} from "../base/helpers/apply.js"
import {prepare_carbon} from "./units/carbon.js"
import {prepare_oxygen} from "./units/oxygen.js"
import {prepare_quartz} from "./units/quartz.js"
import {prepare_obsidian} from "./units/obsidian.js"
import {BaseElementClasses} from "../base/element.js"

export type Slate<C extends Context> = ReturnType<typeof prepare_frontend<C>>

export function prepare_frontend<C extends Context>(context?: C) {
	const shell = new Shell<C>(context)

	const oxygen = prepare_oxygen(shell)
	const carbon = prepare_carbon(shell)
	const quartz = prepare_quartz(shell)
	const obsidian = prepare_obsidian(shell)

	return {
		shell,

		get context() {
			return shell.context
		},

		set context(c: C) {
			shell.context = c
		},

		/** light-dom component */
		oxygen,

		/** shadow-dom component */
		carbon,

		/** light-dom view */
		quartz,

		/** shadow-dom view */
		obsidian,

		lightComponent: oxygen,
		shadowComponent: carbon,
		lightView: quartz,
		shadowView: obsidian,

		components: <E extends BaseElementClasses>(elements: E) => (
			apply.context(shell.context)(elements)
		),
	}
}

