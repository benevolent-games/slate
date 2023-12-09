
import {Shell} from "./shell.js"
import {Context} from "./context.js"
import {apply} from "../base/helpers/apply.js"
import {prepare_light_component} from "./units/light_component.js"
import {prepare_light_view} from "./units/light_view.js"
import {prepare_shadow_component} from "./units/shadow_component.js"
import {prepare_shadow_view} from "./units/shadow_view.js"
import {BaseElementClasses} from "../base/element.js"

export class Slate<C extends Context> extends Shell<C> {
	constructor(context?: C) {
		super(context)
		this.light_component = prepare_light_component(this)
		this.shadow_component = prepare_shadow_component(this)
		this.light_view = prepare_light_view(this)
		this.shadow_view = prepare_shadow_view(this)
	}

	light_component: ReturnType<typeof prepare_light_component<C>>
	shadow_component: ReturnType<typeof prepare_shadow_component<C>>
	light_view: ReturnType<typeof prepare_light_view<C>>
	shadow_view: ReturnType<typeof prepare_shadow_view<C>>

	components<E extends BaseElementClasses>(elements: E) {
		return apply.context(this.context)(elements)
	}
}

