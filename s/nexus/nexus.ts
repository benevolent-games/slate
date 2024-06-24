
import {Context} from "./context.js"
import {Shell} from "./parts/shell.js"
import {apply} from "../base/helpers/apply.js"
import {BaseElementClasses} from "../base/element.js"
import {prepare_light_view} from "./units/light_view.js"
import {prepare_shadow_view} from "./units/shadow_view.js"
import {prepare_light_component} from "./units/light_component.js"
import {prepare_shadow_component} from "./units/shadow_component.js"

export class Nexus<C extends Context> extends Shell<C> {
	constructor(context?: C) {
		super(context)
		this.lightComponent = prepare_light_component(this)
		this.shadowComponent = prepare_shadow_component(this)
		this.lightView = prepare_light_view(this)
		this.shadowView = prepare_shadow_view(this)
	}

	lightComponent: ReturnType<typeof prepare_light_component<C>>
	shadowComponent: ReturnType<typeof prepare_shadow_component<C>>
	lightView: ReturnType<typeof prepare_light_view<C>>
	shadowView: ReturnType<typeof prepare_shadow_view<C>>

	components<E extends BaseElementClasses>(elements: E) {
		return apply.context(this.context)(elements)
	}
}

export const defaultNexus = new Nexus(new Context())

