
import {Shell} from "./shell.js"
import {Context} from "./context.js"
import {apply} from "../base/helpers/apply.js"
import {prepare_carbon} from "./units/carbon.js"
import {prepare_oxygen} from "./units/oxygen.js"
import {prepare_quartz} from "./units/quartz.js"
import {prepare_obsidian} from "./units/obsidian.js"
import {BaseElementClasses} from "../base/element.js"

export class Slate<C extends Context> extends Shell<C> {
	constructor(context?: C) {
		super(context)
		this.light_component = this.oxygen = prepare_oxygen(this)
		this.shadow_component = this.carbon = prepare_carbon(this)
		this.light_view = this.quartz = prepare_quartz(this)
		this.shadow_view = this.obsidian = prepare_obsidian(this)
	}

	oxygen: ReturnType<typeof prepare_oxygen<C>>
	carbon: ReturnType<typeof prepare_carbon<C>>
	quartz: ReturnType<typeof prepare_quartz<C>>
	obsidian: ReturnType<typeof prepare_obsidian<C>>

	light_component: ReturnType<typeof prepare_oxygen<C>>
	shadow_component: ReturnType<typeof prepare_carbon<C>>
	light_view: ReturnType<typeof prepare_quartz<C>>
	shadow_view: ReturnType<typeof prepare_obsidian<C>>

	components<E extends BaseElementClasses>(elements: E) {
		return apply.context(this.context)(elements)
	}
}
